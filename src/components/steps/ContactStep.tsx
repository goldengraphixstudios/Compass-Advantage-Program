import { FormData, FormErrors } from "../FormWizard";

interface Props {
  data: FormData;
  errors: FormErrors;
  onChange: (field: string, value: string) => void;
}

export default function ContactStep({ data, errors, onChange }: Props) {
  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Contact Information</h3>
          <p className="text-sm text-slate-400">Your professional details</p>
        </div>
      </div>

      <div className="space-y-5">
        {[
          { id: "agentName", label: "Agent's Full Name", type: "text", placeholder: "e.g. Jane Smith" },
          { id: "agentEmail", label: "Agent's Email Address", type: "email", placeholder: "jane@brokerage.com" },
          { id: "agentPhone", label: "Agent's Phone Number", type: "tel", placeholder: "(555) 123-4567" },
          { id: "brokerageName", label: "Brokerage Name", type: "text", placeholder: "Your brokerage" },
          { id: "mlsNumber", label: "MLS Number", type: "text", placeholder: "MLS #" },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-slate-700 mb-1.5">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <input
              type={field.type}
              id={field.id}
              value={data[field.id as keyof FormData] as string || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`form-input w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm ${
                errors[field.id] ? "form-input-error border-red-300" : "border-slate-200"
              }`}
            />
            {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
