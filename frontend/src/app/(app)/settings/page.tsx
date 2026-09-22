"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("PROFILE");

  const tabs = [
    { id: "PROFILE", label: "Officer Profile" },
    { id: "NOTIFICATIONS", label: "Notifications" },
    { id: "RULES", label: "Compliance Rules" },
    { id: "SECURITY", label: "Security & Identity" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your officer profile, preferences, and system rule configurations.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? "bg-gem-50 text-gem-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden min-h-[400px]">
          
          {activeTab === "PROFILE" && (
            <div className="p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Officer Profile</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gem-100 text-gem-700 rounded-full flex items-center justify-center text-2xl font-black border-4 border-white shadow-sm">
                  AK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Arvind Krishnan</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">CPCL • Procurement Division</p>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                  <input type="text" disabled value="arvind.k@cpcl.co.in" className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg px-3 py-2 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Role & Permissions</label>
                  <select disabled className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg px-3 py-2 cursor-not-allowed appearance-none">
                    <option>Senior Procurement Officer</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Role assignments are managed centrally via GovSSO.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "RULES" && (
            <div className="p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Compliance Rule Versioning</h2>
              <p className="text-sm text-slate-500 mb-6">The system operates on version-controlled compliance logic to ensure audit traceability.</p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Active Ruleset</span>
                  <h3 className="text-base font-bold text-emerald-900 mt-0.5">GeM Central Rules v2026.4</h3>
                  <p className="text-xs text-emerald-700 mt-1">Deployed on Sep 15, 2026</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Changelog</h3>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                <div className="p-3 bg-white">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">v2026.4</span>
                    <span className="text-xs text-slate-400">Sep 15, 2026</span>
                  </div>
                  <p className="text-xs text-slate-600">Updated financial turnover regex to accommodate new auditor formatting standards.</p>
                </div>
                <div className="p-3 bg-slate-50">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">v2026.3</span>
                    <span className="text-xs text-slate-400">Aug 01, 2026</span>
                  </div>
                  <p className="text-xs text-slate-600">Added semantic contradiction detection for MSME category mismatches.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Security & Identity</h2>
              
              <div className="space-y-6 max-w-lg">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Identity Provider</h3>
                      <p className="text-xs text-slate-500">Keycloak (GovSSO)</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Connected</span>
                    <span className="text-slate-400">Token expires in 42 mins</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Active Sessions</h3>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    <div className="p-3 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Windows • Chrome</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Chennai, India • IP: 103.45.xx.xx</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Current Session</span>
                    </div>
                  </div>
                  <button className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-800 transition">
                    Revoke all other sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "NOTIFICATIONS" && (
            <div className="p-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4 max-w-lg">
                {[
                  { title: "High-Risk Bidder Flagged", desc: "Get notified when a bidder fails a critical compliance rule." },
                  { title: "Government API Outage", desc: "Alerts when GSTN, Udyam, or PAN APIs experience downtime." },
                  { title: "New Audit Report Generated", desc: "Notify when a full CVC-ready report is successfully exported." }
                ].map((notif, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-1">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gem-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition">{notif.title}</h3>
                      <p className="text-xs text-slate-500">{notif.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
