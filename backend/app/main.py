import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine, SessionLocal
from app.models import User
from app.routers import auth, tenders, bids, documents, findings, verification_center, dashboard

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("gem-compliance")

def _init_db_and_seed():
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            has_users = db.query(User).first() is not None
        finally:
            db.close()
        if not has_users:
            logger.info("Database is empty — running demo seed...")
            from app.seed import seed
            seed()
            logger.info("Demo seed complete.")
    except Exception as e:
        logger.error(f"Database initialization warning (will retry on incoming requests): {e}")


_init_db_and_seed()

app = FastAPI(
    title="AI-Powered Integrated Bid Compliance Verification Platform",
    description="SIH26100 Prototype — Ministry of Petroleum & Natural Gas / CPCL. "
                "Human-in-the-loop compliance verification for GeM procurement. "
                "The Procurement Officer retains the final qualification decision.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.method} {request.url.path}")
    return JSONResponse(status_code=500, content={"detail": "Internal error. Please retry or contact the administrator."})


app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(bids.router)
app.include_router(documents.router)
app.include_router(findings.router)
app.include_router(verification_center.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "AI-Powered Integrated Bid Compliance Verification Platform (SIH26100 Prototype)",
        "note": "AI provides extraction, verification, analysis and recommendations only. "
                "The Procurement Officer makes the final qualification decision.",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
