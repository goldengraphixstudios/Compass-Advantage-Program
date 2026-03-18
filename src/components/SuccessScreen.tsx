import Link from "next/link";

interface Props {
  onReset: () => void;
}

export default function SuccessScreen({ onReset }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path className="animate-check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-navy-600 mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Submission Received!
        </h2>
        <p className="text-slate-500 text-lg mb-2">
          Your listing has been successfully submitted to the Compass Advantage Program.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Our marketing team will review your submission and post it within 2&ndash;3 business days.
        </p>
        <div className="space-y-3">
          <button
            onClick={onReset}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
          >
            Submit Another Listing
          </button>
          <Link
            href="/submissions"
            className="block w-full text-center border border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-3.5 rounded-xl text-sm font-medium transition-colors"
          >
            View All Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
