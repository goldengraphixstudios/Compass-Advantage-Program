import { FormData } from "../FormWizard";

interface Props {
  data: FormData;
  propertyPhotos: { name: string; data: string }[];
  headshot: { name: string; data: string } | null;
  onChange: (field: string, value: string) => void;
  onGoToStep: (step: number) => void;
}

interface Section {
  title: string;
  editStep: number;
  fields: [string, string][];
}

export default function ReviewStep({ data, propertyPhotos, headshot, onChange, onGoToStep }: Props) {
  const sections: Section[] = [
    {
      title: "Contact Information",
      editStep: 0,
      fields: [
        ["Agent Name", data.agentName],
        ["Email", data.agentEmail],
        ["Phone", data.agentPhone],
        ["Brokerage", data.brokerageName],
        ["MLS #", data.mlsNumber],
      ],
    },
    {
      title: "Property Details",
      editStep: 1,
      fields: [
        ["Address", data.propertyAddress],
        ["Price", data.listingPrice],
        ["Type", data.propertyType],
        ["Beds/Baths", `${data.bedrooms} bd / ${data.bathrooms} ba`],
        ["Sq Ft", data.sqft],
        ["Lot Size", data.lotSize],
        ["Year Built", data.yearBuilt],
        ["Key Features", data.keyFeatures || "N/A"],
      ],
    },
    {
      title: "Open House",
      editStep: 2,
      fields: [
        ["Date", data.openHouseDates],
        ["Time", `${data.startTime} - ${data.endTime}`],
        ["Agent Present", data.agentPresent],
        ["Special Instructions", data.specialInstructions || "N/A"],
      ],
    },
    {
      title: "Marketing",
      editStep: 3,
      fields: [
        ["Social Media Help", data.needSocialHelp],
        ["Platforms", data.platforms.join(", ") || "N/A"],
        ["Hashtags", data.hashtags || "N/A"],
      ],
    },
    {
      title: "Photos",
      editStep: 4,
      fields: [
        ["Professional Photos", data.hasPhotos || "Not specified"],
        ["Property Photos", `${propertyPhotos.length} uploaded`],
        ["Headshot", headshot ? "1 uploaded" : "None"],
      ],
    },
  ];

  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Review & Submit</h3>
          <p className="text-sm text-slate-400">Please verify your information before submitting</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="border border-slate-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-navy-600 text-sm">{section.title}</h4>
              <button type="button" onClick={() => onGoToStep(section.editStep)}
                className="text-cyan-500 hover:text-cyan-600 text-xs font-medium cursor-pointer">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {section.fields.map(([label, val]) => (
                <div key={label} className={
                  ["Key Features", "Special Instructions", "Address"].includes(label) ? "col-span-2" : ""
                }>
                  <span className="text-xs text-slate-400">{label}</span>
                  <p className="text-sm text-slate-700 font-medium">{val || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Notes */}
      <div className="mt-6">
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-700 mb-1.5">
          Anything else we should know? <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="additionalNotes"
          value={data.additionalNotes}
          onChange={(e) => onChange("additionalNotes", e.target.value)}
          rows={3}
          placeholder="Any additional information that might be helpful..."
          className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm resize-none"
        />
      </div>
    </div>
  );
}
