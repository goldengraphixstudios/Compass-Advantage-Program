"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Submit a Listing", href: "#form-section" },
    { label: "Track Submission", href: "/submissions", isPage: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-navy-900/5 border-b border-slate-100"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 relative z-10">
              <img
                src={logo}
                alt="Compass Title & Escrow, Ltd."
                width={220}
                height={60}
                className="h-10 sm:h-14 w-auto"
                fetchPriority="high"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-500 hover:text-navy-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-500 hover:text-navy-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                )
              )}
              <a
                href="#form-section"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
              >
                Get Started
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-[2px] bg-navy-600 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
                <span className={`block h-[2px] bg-navy-600 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
                <span className={`block h-[2px] bg-navy-600 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) =>
            link.isPage ? (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-2xl font-medium text-navy-600 hover:text-cyan-500 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: menuOpen ? `${i * 80}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-2xl font-medium text-navy-600 hover:text-cyan-500 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: menuOpen ? `${i * 80}ms` : "0ms" }}
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#form-section"
            onClick={() => setMenuOpen(false)}
            className={`mt-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-500 cursor-pointer ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menuOpen ? `${navLinks.length * 80}ms` : "0ms" }}
          >
            Submit Your Listing
          </a>
        </div>
      </div>
    </>
  );
}
