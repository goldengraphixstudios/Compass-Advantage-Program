"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveSubmission, saveDraft, loadDraft, clearDraft, generateId, generateTicket } from "@/lib/storage";
import ContactStep from "./steps/ContactStep";
import PropertyStep from "./steps/PropertyStep";
import OpenHouseStep from "./steps/OpenHouseStep";
import MarketingStep from "./steps/MarketingStep";
import PhotosStep from "./steps/PhotosStep";
import ReviewStep from "./steps/ReviewStep";
import SuccessScreen from "./SuccessScreen";

export interface FormData {
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  brokerageName: string;
  mlsNumber: string;
  propertyAddress: string;
  listingPrice: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  keyFeatures: string;
  openHouseDates: string;
  startTime: string;
  endTime: string;
  agentPresent: string;
  specialInstructions: string;
  needSocialHelp: string;
  platforms: string[];
  hashtags: string;
  hasPhotos: string;
  additionalNotes: string;
}

export type FormErrors = Record<string, string>;

const INITIAL_DATA: FormData = {
  agentName: "", agentEmail: "", agentPhone: "", brokerageName: "", mlsNumber: "",
  propertyAddress: "", listingPrice: "", propertyType: "", bedrooms: "", bathrooms: "",
  sqft: "", lotSize: "", yearBuilt: "", keyFeatures: "",
  openHouseDates: "", startTime: "", endTime: "", agentPresent: "", specialInstructions: "",
  needSocialHelp: "", platforms: [], hashtags: "", hasPhotos: "", additionalNotes: "",
};

const TOTAL_STEPS = 6;
const STEP_LABELS = ["Contact", "Property", "Open House", "Marketing", "Photos", "Review"];

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [propertyPhotos, setPropertyPhotos] = useState<{ name: string; data: string }[]>([]);
  const [headshot, setHeadshot] = useState<{ name: string; data: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData((prev) => ({ ...prev, ...draft, platforms: (draft.platforms as string[]) || [] }));
    }
  }, []);

  // Reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-save draft
  const triggerDraftSave = useCallback(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      saveDraft(data as unknown as Record<string, unknown>);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 800);
  }, [data]);

  const handleChange = useCallback((field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    triggerDraftSave();
  }, [triggerDraftSave]);

  const handleTogglePlatform = useCallback((platform: string) => {
    setData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
    setErrors((prev) => { const next = { ...prev }; delete next.platforms; return next; });
    triggerDraftSave();
  }, [triggerDraftSave]);

  // Validation
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (currentStep === 0) {
      if (!data.agentName.trim()) errs.agentName = "Required";
      if (!data.agentEmail.trim()) errs.agentEmail = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.agentEmail)) errs.agentEmail = "Invalid email";
      if (!data.agentPhone.trim()) errs.agentPhone = "Required";
      if (!data.brokerageName.trim()) errs.brokerageName = "Required";
      if (!data.mlsNumber.trim()) errs.mlsNumber = "Required";
    }
    if (currentStep === 1) {
      if (!data.propertyAddress.trim()) errs.propertyAddress = "Required";
      if (!data.listingPrice.trim()) errs.listingPrice = "Required";
      if (!data.propertyType) errs.propertyType = "Required";
      if (!data.bedrooms) errs.bedrooms = "Required";
      if (!data.bathrooms) errs.bathrooms = "Required";
      if (!data.sqft.trim()) errs.sqft = "Required";
      if (!data.lotSize.trim()) errs.lotSize = "Required";
      if (!data.yearBuilt.trim()) errs.yearBuilt = "Required";
    }
    // Step 2 (Open House) — all optional, no validation
    if (currentStep === 3) {
      if (!data.needSocialHelp) errs.needSocialHelp = "Please select an option";
      if (data.platforms.length === 0) errs.platforms = "Select at least one platform";
    }
    if (currentStep === 4) {
      if (propertyPhotos.length === 0) errs.propertyPhotos = "Please upload at least one property photo";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) setCurrentStep(step);
  };

  const changeStep = (dir: number) => {
    if (dir === 1 && !validate()) return;
    const next = Math.max(0, Math.min(TOTAL_STEPS - 1, currentStep + dir));
    setCurrentStep(next);
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const ticket = generateTicket();
      await saveSubmission({
        ...data,
        propertyPhotos,
        headshot,
        submittedAt: new Date().toISOString(),
        id: generateId(),
        ticket,
        status: "new",
      });
      clearDraft();
      setTicketCode(ticket);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("Failed to submit. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setPropertyPhotos([]);
    setHeadshot(null);
    setCurrentStep(0);
    setErrors({});
    setSubmitted(false);
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (submitted) return <SuccessScreen onReset={handleReset} ticket={ticketCode} />;

  return (
    <section id="form-section" className="py-20 sm:py-28 relative overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100/80" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #1B2A6B 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 reveal">
          <span className="inline-block text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-full px-4 py-1.5 mb-4 tracking-wide">
            SUBMIT YOUR LISTING
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-600 mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Listing Submission Form
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Complete the form below to get your listing featured on Compass social media channels
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10 reveal" style={{ transitionDelay: "100ms" }}>
          <div className="flex items-center justify-between max-w-xl mx-auto px-4">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="contents">
                <button
                  onClick={() => goToStep(i)}
                  className="flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none"
                  type="button"
                >
                  <div className={`step-dot w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i < currentStep ? "step-dot-completed" : i === currentStep ? "step-dot-active" : "bg-slate-200 text-slate-400"
                  }`}>
                    {i < currentStep ? "\u2713" : i + 1}
                  </div>
                  <span className="text-xs font-medium text-slate-400 hidden sm:block">{label}</span>
                </button>
                {i < TOTAL_STEPS - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors duration-400 ${
                    i < currentStep ? "bg-gradient-to-r from-navy-600 to-cyan-500" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="reveal bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden" style={{ transitionDelay: "200ms" }}>
          <div className="p-6 sm:p-10">
            {currentStep === 0 && <ContactStep data={data} errors={errors} onChange={handleChange} />}
            {currentStep === 1 && <PropertyStep data={data} errors={errors} onChange={handleChange} />}
            {currentStep === 2 && <OpenHouseStep data={data} errors={errors} onChange={handleChange} />}
            {currentStep === 3 && <MarketingStep data={data} errors={errors} onChange={handleChange} onTogglePlatform={handleTogglePlatform} />}
            {currentStep === 4 && (
              <PhotosStep data={data} errors={errors} onChange={handleChange}
                propertyPhotos={propertyPhotos} headshot={headshot}
                onPropertyPhotosChange={setPropertyPhotos} onHeadshotChange={setHeadshot} />
            )}
            {currentStep === 5 && (
              <ReviewStep data={data} propertyPhotos={propertyPhotos} headshot={headshot}
                onChange={handleChange} onGoToStep={setCurrentStep} />
            )}
          </div>

          {submitError && (
            <div className="mx-6 sm:mx-10 mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {submitError}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="px-6 sm:px-10 pb-6 sm:pb-10 flex items-center justify-between gap-4">
            {currentStep > 0 ? (
              <button type="button" onClick={() => changeStep(-1)}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all duration-200 cursor-pointer hover:border-slate-300">
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : <div />}

            {currentStep < TOTAL_STEPS - 1 ? (
              <button type="button" onClick={() => changeStep(1)}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer">
                Next Step
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-navy-600 to-navy-500 hover:from-navy-500 hover:to-navy-400 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-600/25 cursor-pointer disabled:opacity-60 disabled:pointer-events-none">
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Draft indicator */}
        <p className={`text-center text-xs text-slate-400 mt-4 transition-opacity duration-300 ${draftSaved ? "opacity-100" : "opacity-0"}`}>
          <svg className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Draft saved automatically
        </p>
      </div>
    </section>
  );
}
