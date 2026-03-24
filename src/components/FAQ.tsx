"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "Is the Compass Advantage Program really free for agents?",
    a: "Yes, absolutely! The program is completely free for all real estate agents. We handle all the social media content creation and posting at no cost to you.",
  },
  {
    q: "How long does it take for my listing to be posted?",
    a: "Once you submit your listing details, our marketing team will review and create your social media content within 2–3 business days. You'll receive a tracking ticket to monitor the status of your submission.",
  },
  {
    q: "Which social media platforms will my listing appear on?",
    a: "Your listing will be featured across Compass' established social media channels including Facebook, Instagram, LinkedIn, and Twitter/X — reaching thousands of potential buyers across multiple platforms.",
  },
  {
    q: "What information do I need to submit?",
    a: "You'll need your contact details, property information (address, price, beds/baths, sqft), open house schedule (if applicable), photos of the property, and your marketing preferences. The form guides you through each step.",
  },
  {
    q: "Can I track the status of my submission?",
    a: "Yes! After submitting, you'll receive a unique tracking ticket (e.g., CAP-XXXXXX). Use this ticket on our Track Submission page to check your submission status anytime — no login required.",
  },
  {
    q: "How many listings can I submit?",
    a: "There is no limit! You can submit as many listings as you'd like. Each submission is processed individually and gets its own tracking ticket.",
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-white shadow-lg shadow-slate-200/50" : "bg-white hover:bg-slate-50/50"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="flex items-center gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-navy-600">
            {index + 1}
          </span>
          <span className="font-semibold text-navy-600 text-[15px] sm:text-base">{faq.q}</span>
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 pl-[72px]">
          <p className="text-slate-500 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-slate-50" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="reveal">
            <span className="inline-block text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-full px-4 py-1.5 mb-4 tracking-wide">
              FAQ
            </span>
          </div>
          <h2
            className="reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-600 mb-5"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "100ms" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="reveal text-lg text-slate-500 leading-relaxed" style={{ transitionDelay: "200ms" }}>
            Everything you need to know about the program
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${(i + 3) * 80}ms` }}>
              <FAQItem faq={faq} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
