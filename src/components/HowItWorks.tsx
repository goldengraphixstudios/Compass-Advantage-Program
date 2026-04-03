"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Submit Your Details",
    desc: "Complete the listing form with your property info, open house schedule, and marketing preferences.",
    gradient: "from-navy-500 to-navy-700",
    accent: "bg-navy-50 text-navy-600",
    num: "01",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "We Review & Create",
    desc: "Our marketing team reviews your submission and creates engaging social media content for the Compass channels.",
    gradient: "from-cyan-500 to-cyan-700",
    accent: "bg-cyan-50 text-cyan-700",
    num: "02",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "Get Featured",
    desc: "Your listing is posted across all of the Compass social media channels within 2\u20133 business days.",
    gradient: "from-navy-600 to-cyan-600",
    accent: "bg-slate-50 text-navy-600",
    num: "03",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-navy-600 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How It Works
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Get your listing featured on the Compass social media channels in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal relative bg-white rounded-3xl p-8 lg:p-10 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group flex flex-col"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Step number badge */}
              <div className={`absolute top-7 right-7 text-xs font-bold tracking-widest ${step.accent} px-2.5 py-1 rounded-full`}>
                {step.num}
              </div>

              {/* Icon container */}
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center mb-7 group-hover:scale-105 transition-transform duration-300 shadow-lg`}
              >
                {step.icon}
              </div>

              <h3
                className="text-xl font-bold text-navy-600 mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-base flex-1">{step.desc}</p>

              {/* Bottom accent line */}
              <div className={`mt-8 h-1 w-16 rounded-full bg-gradient-to-r ${step.gradient} opacity-60`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
