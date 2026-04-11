"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? "shadow-lg shadow-slate-200/50" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Nav links left-aligned */}
          <div className="hidden sm:flex items-center gap-8">
            <a href="#how-it-works" className="text-lg font-medium text-slate-600 hover:text-navy-600 transition-colors">
              How It Works
            </a>
            <a href="#form-section" className="text-lg font-medium text-slate-600 hover:text-navy-600 transition-colors">
              Submit a Listing
            </a>
            <Link href="/submissions" className="text-lg font-medium text-slate-600 hover:text-navy-600 transition-colors">
              Track Submission
            </Link>
          </div>
          {/* Get Started button right-aligned */}
          <a
            href="#form-section"
            className="hidden sm:inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-7 py-3.5 rounded-lg text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          {/* Mobile fallback */}
          <a
            href="#form-section"
            className="sm:hidden bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          >
            Submit
          </a>
        </div>
      </div>
    </nav>
  );
}
