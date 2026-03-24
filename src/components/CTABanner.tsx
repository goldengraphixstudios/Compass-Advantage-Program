"use client";

import { useEffect, useRef } from "react";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.2 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0A112C 0%, #1B2A6B 40%, #0098D1 100%)" }} />

      {/* Animated blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 animate-blob"
        style={{ background: "radial-gradient(circle, rgba(0,174,239,0.5) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 animate-blob"
        style={{ background: "radial-gradient(circle, rgba(77,202,241,0.4) 0%, transparent 70%)", animationDelay: "-4s" }} />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px"
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="reveal">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Get Your Listing{" "}
            <span className="gradient-text">Featured?</span>
          </h2>
        </div>
        <p className="reveal text-lg sm:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ transitionDelay: "100ms" }}>
          Join the agents who are already leveraging Compass&rsquo; marketing power. Submit your listing today and watch your reach grow.
        </p>
        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4" style={{ transitionDelay: "200ms" }}>
          <a
            href="#form-section"
            className="group inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-navy-600 px-10 py-4 rounded-full text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20 cursor-pointer"
          >
            Submit Your Listing Now
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <span className="text-blue-200/50 text-sm">No cost &middot; No commitment &middot; Fast turnaround</span>
        </div>
      </div>
    </section>
  );
}
