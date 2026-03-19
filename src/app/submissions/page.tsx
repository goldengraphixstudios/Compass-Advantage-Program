"use client";

import { useState } from "react";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;
import { getSubmissionByTicket, type Submission } from "@/lib/storage";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  new: { label: "Received", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  reviewing: { label: "Under Review", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  posted: { label: "Posted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  rejected: { label: "Needs Revision", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" },
};

const statusDescriptions: Record<string, string> = {
  new: "Your submission has been received and is waiting to be reviewed by our marketing team.",
  reviewing: "Our marketing team is currently reviewing your listing and preparing your social media posts.",
  posted: "Your listing has been posted to social media! Check your designated platforms.",
  rejected: "Your submission needs some changes. Please contact our team for details.",
};

export default function SubmissionsPage() {
  const [ticket, setTicket] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket.trim()) return;
    setLoading(true);
    setError("");
    setSubmission(null);
    try {
      const result = await getSubmissionByTicket(ticket);
      setSubmission(result);
      setSearched(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={logo} alt="Compass Title & Escrow" width={160} height={36} className="h-9 w-auto" />
          </Link>
          <Link href="/#form-section"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Submission
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy-600 mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Track Your Submission
          </h1>
          <p className="text-slate-500">
            Enter your ticket number to check the status of your listing submission.
          </p>
        </div>

        {/* Ticket Input */}
        <form onSubmit={handleLookup} className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
            <label htmlFor="ticket" className="block text-sm font-semibold text-slate-700 mb-2">
              Ticket Number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="ticket"
                value={ticket}
                onChange={(e) => { setTicket(e.target.value.toUpperCase()); setSearched(false); setError(""); }}
                placeholder="e.g. CAP-A3B7K2"
                className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm font-mono tracking-wider focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !ticket.trim()}
                className="inline-flex items-center gap-2 bg-navy-600 hover:bg-navy-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-600/30 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                Track
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-3">{error}</p>
            )}
          </div>
        </form>

        {/* Results */}
        {searched && !submission && !error && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Submission Found</h3>
            <p className="text-slate-400 text-sm">
              We couldn&apos;t find a submission with ticket <span className="font-mono font-semibold text-slate-600">{ticket}</span>.<br />
              Please double-check your ticket number and try again.
            </p>
          </div>
        )}

        {submission && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden animate-fade-slide-in">
            {/* Status Banner */}
            {(() => {
              const sc = statusConfig[submission.status || "new"];
              return (
                <div className={`px-6 sm:px-8 py-5 border-b ${sc.bg}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${sc.bg}`}>
                      <svg className={`w-5 h-5 ${sc.color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={sc.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${sc.color}`}>{sc.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{statusDescriptions[submission.status || "new"]}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-6 sm:p-8">
              {/* Ticket & Date */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ticket</p>
                  <p className="text-lg font-bold text-navy-600 font-mono tracking-wider">{submission.ticket}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Submitted</p>
                  <p className="text-sm text-slate-600">{fmtDate(submission.submittedAt)}</p>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-navy-600 text-lg mb-1">{submission.propertyAddress || "No address"}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                  {submission.listingPrice && <span className="font-semibold text-cyan-600">{submission.listingPrice}</span>}
                  {submission.propertyType && <span>{submission.propertyType}</span>}
                  {submission.bedrooms && <span>{submission.bedrooms} bed</span>}
                  {submission.bathrooms && <span>{submission.bathrooms} bath</span>}
                  {submission.sqft && <span>{submission.sqft} sqft</span>}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Agent Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-slate-400">Name:</span> <span className="text-slate-700 font-medium">{submission.agentName}</span></div>
                    <div><span className="text-slate-400">Brokerage:</span> <span className="text-slate-700 font-medium">{submission.brokerageName}</span></div>
                    <div><span className="text-slate-400">MLS #:</span> <span className="text-slate-700 font-medium">{submission.mlsNumber}</span></div>
                  </div>
                </div>

                {submission.openHouseDates && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Open House</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-slate-400">Date:</span> <span className="text-slate-700 font-medium">{submission.openHouseDates}</span></div>
                      {submission.startTime && <div><span className="text-slate-400">Time:</span> <span className="text-slate-700 font-medium">{submission.startTime} - {submission.endTime}</span></div>}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marketing</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-slate-400">Platforms:</span> <span className="text-slate-700 font-medium">{(submission.platforms || []).join(", ") || "—"}</span></div>
                    {submission.hashtags && <div><span className="text-slate-400">Hashtags:</span> <span className="text-slate-700 font-medium">{submission.hashtags}</span></div>}
                  </div>
                </div>

                {(submission.propertyPhotos?.length > 0) && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Photos ({submission.propertyPhotos.length})</h4>
                    <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
                      {submission.propertyPhotos.slice(0, 4).map((p, i) => (
                        <img key={i} src={p.url} alt={p.name} className="w-full h-20 object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-400">
            Lost your ticket? Contact{" "}
            <a href="mailto:jfaioli@compasste.com" className="text-cyan-500 hover:text-cyan-600">jfaioli@compasste.com</a>
            {" "}for assistance.
          </p>
        </div>
      </main>
    </div>
  );
}
