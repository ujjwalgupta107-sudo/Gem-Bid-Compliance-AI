from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Tender, Bid, Bidder, User, ComplianceEvaluation, ComplianceFinding, Verification, RiskAssessment
from app.security import get_current_user
from app.schemas import BidCreate, FinalDecisionCreate
from app.serializers import s_bid, s_evaluation, s_finding, s_verification, s_risk
from app.services.compliance_service import evaluate_bid
from app.services.report_service import generate_bid_report
from app.audit_chain import record_event
from fastapi.responses import FileResponse

router = APIRouter(tags=["bids"])


@router.get("/bids")
def list_bids(status: str | None = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Bid)
    if status:
        q = q.filter(Bid.status == status)
    bids = q.order_by(Bid.submitted_at.desc()).all()
    return [s_bid(b, include_tender=True) for b in bids]


@router.post("/tenders/{tender_id}/bids")
def create_bid(tender_id: str, payload: BidCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(404, "Tender not found")
    bidder = Bidder(**payload.bidder.model_dump())
    db.add(bidder)
    db.commit()
    db.refresh(bidder)
    bid = Bid(
        tender_id=tender_id, bidder_id=bidder.id, status="DOCUMENTS_PENDING",
        declared_turnover=payload.declared_turnover, declared_local_content_pct=payload.declared_local_content_pct,
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    record_event(db, user.email, "BID_CREATED", "Bid", bid.id, bid_id=bid.id, tender_id=tender_id,
                 new_state=bidder.company_name)
    return s_bid(bid)


@router.get("/bids/{bid_id}")
def get_bid(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(404, "Bid not found")
    out = s_bid(bid, include_tender=True)
    risk = db.query(RiskAssessment).filter(RiskAssessment.bid_id == bid_id).first()
    out["risk"] = s_risk(risk)
    return out


@router.get("/bids/{bid_id}/compliance")
def get_compliance(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    evals = db.query(ComplianceEvaluation).filter(ComplianceEvaluation.bid_id == bid_id).all()
    risk = db.query(RiskAssessment).filter(RiskAssessment.bid_id == bid_id).first()
    verifications = db.query(Verification).filter(Verification.bid_id == bid_id).all()
    return {
        "evaluations": [s_evaluation(e) for e in evals],
        "risk": s_risk(risk),
        "verifications": [s_verification(v) for v in verifications],
    }


@router.post("/bids/{bid_id}/verify")
def verify_bid(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    result = evaluate_bid(bid_id, db, actor=user.email)
    return {
        "evaluations": [s_evaluation(e) for e in result["evaluations"]],
        "risk": s_risk(result["risk"]),
    }


@router.get("/bids/{bid_id}/findings")
def get_findings(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    findings = db.query(ComplianceFinding).filter(ComplianceFinding.bid_id == bid_id).order_by(
        ComplianceFinding.severity.desc()).all()
    return [s_finding(f) for f in findings]


@router.get("/bids/{bid_id}/audit")
def get_audit(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.models import AuditEvent
    from app.serializers import s_audit
    from app.audit_chain import verify_chain
    events = db.query(AuditEvent).filter(AuditEvent.bid_id == bid_id).order_by(AuditEvent.timestamp).all()
    return {"events": [s_audit(e) for e in events], "chain_integrity": verify_chain(db)}


@router.post("/bids/{bid_id}/final-decision")
def final_decision(bid_id: str, payload: FinalDecisionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(404, "Bid not found")
    if payload.decision not in ("QUALIFIED", "DISQUALIFIED", "CLARIFICATION_REQUIRED"):
        raise HTTPException(400, "Invalid decision")
    if not payload.reason or len(payload.reason.strip()) < 5:
        raise HTTPException(400, "A justification is required for the final decision")
    from datetime import datetime
    previous = bid.final_decision
    bid.final_decision = payload.decision
    bid.final_decision_reason = payload.reason
    bid.final_decision_by = user.full_name
    bid.final_decision_at = datetime.utcnow()
    bid.status = payload.decision if payload.decision != "CLARIFICATION_REQUIRED" else "CLARIFICATION_REQUIRED"
    db.commit()
    record_event(db, user.email, "FINAL_DECISION_RECORDED", "Bid", bid_id, bid_id=bid_id,
                 previous_state=previous, new_state=f"{payload.decision}: {payload.reason}")
    return s_bid(bid)


@router.get("/bids/{bid_id}/report")
def get_report(bid_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(404, "Bid not found")
    path = generate_bid_report(bid_id, db)
    record_event(db, user.email, "REPORT_GENERATED", "Bid", bid_id, bid_id=bid_id)
    return FileResponse(path, media_type="application/pdf", filename=f"CPCL_Compliance_Report_{bid_id}.pdf")
