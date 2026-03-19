"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  onReset: () => void;
  ticket: string;
}

export default function SuccessScreen({ onReset, ticket }: Props) {
  const [copied, setCopied] = useState(false);

  const copyTicket = () => {
    navigator.clipboard.writeText(ticket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path className="animate-check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-navy-600 mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Submission Received!
        </h2>
        <p className="text-slate-500 text-lg mb-6">
          Your listing has been successfully submitted to the Compass Advantage Program.
        </p>

        {/* Ticket Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Tracking Ticket</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-navy-600 tracking-widest font-mono">{ticket}</span>
            <button
              onClick={copyTicket}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-navy-600 transition-colors cursor-pointer"
              title="Copy ticket number"
            >
              {copied ? (
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Save this ticket number — use it to check your submission status anytime.
          </p>
        </div>

        <p className="text-slate-400 text-sm mb-8">
          Our marketing team will review your submission and post it within 2&ndash;3 business days.
        </p>
        <div className="space-y-3">
          <button
            onClick={onReset}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
          >
            Submit Another Listing
          </button>
          <Link
            href="/submissions"
            className="block w-full text-center border border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-3.5 rounded-xl text-sm font-medium transition-colors"
          >
            Track Your Submission
          </Link>
        </div>
      </div>
    </div>
  );
}
