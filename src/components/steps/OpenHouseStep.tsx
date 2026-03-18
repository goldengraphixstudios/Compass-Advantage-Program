import { FormData, FormErrors } from "../FormWizard";

interface Props {
  data: FormData;
  errors: FormErrors;
  onChange: (field: string, value: string) => void;
}

export default function OpenHouseStep({ data, errors, onChange }: Props) {
  const inputClass = (field: string) =>
    `form-input w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-800 text-sm ${
      errors[field] ? "form-input-error border-red-300" : "border-slate-200"
    }`;

  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Open House Details <span className="text-sm font-normal text-slate-400">(if applicable)</span></h3>
          <p className="text-sm text-slate-400">Schedule and visitor information — skip if not hosting an open house</p>
        </div>
      </div>

      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex gap-3 mb-6">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">All fields in this section are optional. Fill them out only if you are hosting an open house.</p>
      </div>

      <div className="space-y-5">
        {/* Date */}
        <div>
          <label htmlFor="openHouseDates" className="block text-sm font-medium text-slate-700 mb-1.5">
            Open House Date(s) <span className="text-slate-400 font-normal">(if applicable)</span>
          </label>
          <input type="date" id="openHouseDates" value={data.openHouseDates} onChange={(e) => onChange("openHouseDates", e.target.value)}
            className={inputClass("openHouseDates")} />
          <p className="text-xs text-slate-400 mt-1">For multiple dates, add them in the notes below</p>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1.5">
              Start Time <span className="text-slate-400 font-normal">(if applicable)</span>
            </label>
            <input type="time" id="startTime" value={data.startTime} onChange={(e) => onChange("startTime", e.target.value)}
              className={inputClass("startTime")} />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-1.5">
              End Time <span className="text-slate-400 font-normal">(if applicable)</span>
            </label>
            <input type="time" id="endTime" value={data.endTime} onChange={(e) => onChange("endTime", e.target.value)}
              className={inputClass("endTime")} />
          </div>
        </div>

        {/* Agent Present */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Will you be present at the open house? <span className="text-slate-400 font-normal">(if applicable)</span>
          </label>
          <div className="flex gap-4">
            {["Yes", "No"].map((val) => (
              <label key={val}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-colors flex-1 ${
                  data.agentPresent === val ? "border-cyan-500 bg-cyan-50/50" : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <input type="radio" name="agentPresent" value={val} checked={data.agentPresent === val}
                  onChange={(e) => onChange("agentPresent", e.target.value)}
                  className="custom-radio w-5 h-5 rounded-full border-2 border-slate-300 appearance-none cursor-pointer" />
                <span className="text-sm font-medium text-slate-700">{val}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-slate-700 mb-1.5">
            Special Instructions for Visitors <span className="text-slate-400 font-normal">(if applicable)</span>
          </label>
          <textarea id="specialInstructions" value={data.specialInstructions} onChange={(e) => onChange("specialInstructions", e.target.value)}
            rows={3} placeholder="e.g. Park on the street, enter through side gate, ring doorbell..."
            className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
        </div>
      </div>
    </div>
  );
}
