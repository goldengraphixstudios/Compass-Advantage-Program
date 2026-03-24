"use client";

import { useEffect, useRef } from "react";

const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Professional Marketing",
    description: "Our creative team transforms your listing details into scroll-stopping social media content that captures attention and drives engagement.",
    gradient: "from-cyan-500 to-blue-600",
    bgGlow: "bg-cyan-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Multi-Platform Reach",
    description: "Your listing gets featured across Facebook, Instagram, LinkedIn, and more — expanding your reach to thousands of potential buyers instantly.",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Lightning Fast",
    description: "From submission to live posts in just 2–3 business days. Our streamlined process means your listing gets maximum exposure when it matters most.",
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/10",
  },
];

export default function Benefits() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal, .reveal-scale").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="benefits" className="py-20 sm:py-28 bg-white relative overflow-hidden" ref={ref}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #1B2A6B 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="reveal">
            <span className="inline-block text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-full px-4 py-1.5 mb-4 tracking-wide">
              WHY AGENTS LOVE IT
            </span>
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-600 mb-5"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "100ms" }}
          >
            Everything You Need to{" "}
            <span className="gradient-text">Stand Out</span>
          </h2>
          <p className="reveal text-lg text-slate-500 leading-relaxed" style={{ transitionDelay: "200ms" }}>
            The Compass Advantage Program gives your listings the professional marketing boost they deserve — at zero cost to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className={`reveal-scale stagger-${i + 1} group relative bg-white rounded-3xl p-8 lg:p-10 card-hover border border-slate-100`}
            >
              {/* Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${benefit.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {benefit.icon}
              </div>

              <h3 className="relative text-xl font-bold text-navy-600 mb-3">{benefit.title}</h3>
              <p className="relative text-slate-500 leading-relaxed">{benefit.description}</p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r ${benefit.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
