"use client";
import React, { useState } from "react";

export default function GovernmentConnectorsPage() {
  const [testingId, setTestingId] = useState<string | null>(null);

  const mockConnectors = [
    { id: "UDYAM", name: "Udyam (MSME)", type: "REST API", status: "OPERATIONAL", lastSync: "2 mins ago", latency: "142ms", url: "api.msme.gov.in/v1/verify" },
    { id: "GST", name: "GSTN", type: "SOAP", status: "OPERATIONAL", lastSync: "5 mins ago", latency: "310ms", url: "api.gst.gov.in/taxpayer" },
    { id: "PAN", name: "Income Tax (PAN)", type: "REST API", status: "OPERATIONAL", lastSync: "10 mins ago", latency: "89ms", url: "api.incometax.gov.in/pan/status" },
    { id: "EPFO", name: "EPFO / ESIC", type: "Webhook", status: "OPERATIONAL", lastSync: "1 hour ago", latency: "420ms", url: "api.epfindia.gov.in/compliance" },
    { id: "CPPP", name: "CPPP API", type: "REST API", status: "DEGRADED", lastSync: "1 hour ago", latency: "1850ms", url: "eprocure.gov.in/cppp/v2" },
    { id: "DIGI", name: "DigiLocker", type: "OAuth2", status: "OPERATIONAL", lastSync: "12 mins ago", latency: "215ms", url: "api.digitallocker.gov.in" },
    { id: "STARTUP", name: "Startup India", type: "REST API", status: "OFFLINE", lastSync: "2 days ago", latency: "Timeout", url: "api.startupindia.gov.in" },
    { id: "NSIC", name: "NSIC", type: "REST API", status: "OPERATIONAL", lastSync: "30 mins ago", latency: "195ms", url: "api.nsic.co.in/verify" }
  ];

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
    }, 1500);
  };

  const getStatusVisuals = (status: string) => {
    switch (status) {
      case "OPERATIONAL": return { text: "Operational", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
      case "DEGRADED": return { text: "Degraded", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
      case "OFFLINE": return { text: "Offline", badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
      default: return { text: "Unknown", badge: "bg-slate-50 text-slate-700 border-slate-200", dot: "bg-slate-500" };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Government Connectors
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage integrations and monitor the health of external registries.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gem-700 text-white text-sm font-semibold rounded-lg hover:bg-gem-800 shadow-md transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Sync All Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockConnectors.map(connector => {
          const v = getStatusVisuals(connector.status);
          const isTesting = testingId === connector.id;
          
          return (
            <div key={connector.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col group hover:border-slate-300 transition-colors">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center font-mono text-[10px] font-bold text-slate-600">
                      {connector.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-none">{connector.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 inline-block">{connector.type}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${v.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`}></span>
                    {v.text}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Last Sync</span>
                    <span className="font-mono text-slate-700">{connector.lastSync}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Latency</span>
                    <span className={`font-mono ${connector.latency === 'Timeout' ? 'text-rose-600 font-bold' : parseInt(connector.latency) > 1000 ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
                      {connector.latency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Endpoint</span>
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={connector.url}>{connector.url}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <button className="text-xs font-semibold text-gem-600 hover:text-gem-800 hover:underline">View History</button>
                <button 
                  onClick={() => handleTestConnection(connector.id)}
                  disabled={isTesting}
                  className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Test Connection
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
