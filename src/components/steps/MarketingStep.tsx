import { FormData, FormErrors } from "../FormWizard";

interface Props {
  data: FormData;
  errors: FormErrors;
  onChange: (field: string, value: string) => void;
  onTogglePlatform: (platform: string) => void;
}

const platformOptions = [
  {
    value: "Facebook",
    icon: (
      <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    value: "Instagram",
    icon: (
      <svg className="w-5 h-5 text-[#E4405F]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    value: "Other",
    icon: (
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function MarketingStep({ data, errors, onChange, onTogglePlatform }: Props) {
  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Marketing Preferences</h3>
          <p className="text-sm text-slate-400">Social media and branding options</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Social Help */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Do you need help creating social media posts? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {["Yes", "No"].map((val) => (
              <label key={val}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-colors flex-1 ${
                  data.needSocialHelp === val ? "border-cyan-500 bg-cyan-50/50" : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <input type="radio" name="needSocialHelp" value={val} checked={data.needSocialHelp === val}
                  onChange={(e) => onChange("needSocialHelp", e.target.value)}
                  className="custom-radio w-5 h-5 rounded-full border-2 border-slate-300 appearance-none cursor-pointer" />
                <span className="text-sm font-medium text-slate-700">{val === "Yes" ? "Yes, please" : "No, I'm good"}</span>
              </label>
            ))}
          </div>
          {errors.needSocialHelp && <p className="text-red-500 text-xs mt-1">{errors.needSocialHelp}</p>}
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Preferred Platforms <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformOptions.map((p) => (
              <label key={p.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                  data.platforms.includes(p.value) ? "border-cyan-500 bg-cyan-50/50" : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <input type="checkbox" checked={data.platforms.includes(p.value)}
                  onChange={() => onTogglePlatform(p.value)}
                  className="custom-check w-5 h-5 rounded-md border-2 border-slate-300 appearance-none cursor-pointer" />
                {p.icon}
                <span className="text-sm font-medium text-slate-700">{p.value}</span>
              </label>
            ))}
          </div>
          {errors.platforms && <p className="text-red-500 text-xs mt-1">{errors.platforms}</p>}
        </div>

        {/* Hashtags */}
        <div>
          <label htmlFor="hashtags" className="block text-sm font-medium text-slate-700 mb-1.5">
            Hashtags or Branding <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input type="text" id="hashtags" value={data.hashtags} onChange={(e) => onChange("hashtags", e.target.value)}
            placeholder="#LuxuryLiving #DreamHome #YourBrokerageName"
            className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm" />
        </div>
      </div>
    </div>
  );
}
