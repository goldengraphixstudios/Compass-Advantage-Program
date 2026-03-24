"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;

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
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src={logo} alt="Compass Title & Escrow, Ltd." width={220} height={60} className="h-12 sm:h-16 w-auto" fetchPriority="high" />
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-navy-600 transition-colors">
              How It Works
            </a>
            <a href="#form-section" className="text-sm font-medium text-slate-600 hover:text-navy-600 transition-colors">
              Submit a Listing
            </a>
            <Link href="/submissions" className="text-sm font-medium text-slate-600 hover:text-navy-600 transition-colors">
              Track Submission
            </Link>
            <a
              href="#form-section"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
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
