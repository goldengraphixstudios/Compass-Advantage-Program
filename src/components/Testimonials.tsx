"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "The Compass Advantage Program completely transformed how I market my listings. Within days, my property was getting incredible visibility across social media — and I didn't have to lift a finger.",
    name: "Sarah Mitchell",
    title: "Senior Real Estate Agent",
    initials: "SM",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    quote: "As a busy agent, I don't have time to create professional social media content for every listing. This program handles it all beautifully, and the quality of the posts is outstanding.",
    name: "James Rodriguez",
    title: "Broker Associate",
    initials: "JR",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote: "I've had multiple buyers tell me they first saw the property on social media through Compass. The reach this program provides is unmatched, and it's completely free. It's a no-brainer.",
    name: "Emily Chen",
    title: "Luxury Home Specialist",
    initials: "EC",
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function Testimonials() {
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
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #1B2A6B 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="reveal">
            <span className="inline-block text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-full px-4 py-1.5 mb-4 tracking-wide">
              AGENT TESTIMONIALS
            </span>
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-600 mb-5"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "100ms" }}
          >
            Trusted by Top Agents
          </h2>
          <p className="reveal text-lg text-slate-500 leading-relaxed" style={{ transitionDelay: "200ms" }}>
            See why agents choose the Compass Advantage Program for their listing marketing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`reveal-scale stagger-${i + 1} group relative bg-white rounded-3xl p-8 card-hover border border-slate-100`}
            >
              {/* Quote mark */}
              <div className="mb-6">
                <svg className="w-10 h-10 text-cyan-100" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">{t.quote}</p>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-navy-600">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.title}</p>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
