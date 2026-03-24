"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Submit Your Details",
    description: "Complete the simple listing form with your property info, open house schedule, photos, and marketing preferences.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    number: "02",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "We Create & Design",
    description: "Our marketing team reviews your submission and crafts engaging, professional social media content tailored to your listing.",
    color: "from-violet-500 to-purple-600",
  },
  {
    number: "03",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: "Get Featured & Grow",
    description: "Your listing goes live on Compass social media channels within 2–3 business days, reaching thousands of potential buyers.",
    color: "from-amber-500 to-orange-500",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #00AEEF 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="reveal">
            <span className="inline-block text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-full px-4 py-1.5 mb-4 tracking-wide">
              SIMPLE PROCESS
            </span>
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-600 mb-5"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "100ms" }}
          >
            How It Works
          </h2>
          <p className="reveal text-lg text-slate-500 leading-relaxed" style={{ transitionDelay: "200ms" }}>
            Get your listing featured on Compass social media in three simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative flex items-start gap-6 lg:gap-10 mb-16 last:mb-0 ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[31px] lg:left-[39px] top-[72px] w-[2px] h-[calc(100%+16px)] bg-gradient-to-b from-slate-200 to-transparent" />
              )}

              {/* Number circle */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                  <span className="text-xs font-bold text-navy-600">{step.number}</span>
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 card-hover group">
                <h3 className="text-xl lg:text-2xl font-bold text-navy-600 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed lg:text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow pointing to form */}
        <div className="reveal text-center mt-16" style={{ transitionDelay: "400ms" }}>
          <a
            href="#form-section"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-navy-600 to-navy-500 hover:from-navy-500 hover:to-navy-400 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-600/25 cursor-pointer"
          >
            Start Your Submission
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
