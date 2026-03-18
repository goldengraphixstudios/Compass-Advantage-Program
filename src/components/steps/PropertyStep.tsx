import { FormData, FormErrors } from "../FormWizard";

interface Props {
  data: FormData;
  errors: FormErrors;
  onChange: (field: string, value: string) => void;
}

export default function PropertyStep({ data, errors, onChange }: Props) {
  const inputClass = (field: string) =>
    `form-input w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm ${
      errors[field] ? "form-input-error border-red-300" : "border-slate-200"
    }`;

  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Property Details</h3>
          <p className="text-sm text-slate-400">Listing specifications</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Address */}
        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-slate-700 mb-1.5">
            Property Address <span className="text-red-500">*</span>
          </label>
          <input type="text" id="propertyAddress" value={data.propertyAddress} onChange={(e) => onChange("propertyAddress", e.target.value)}
            placeholder="123 Main St, City, State ZIP" className={inputClass("propertyAddress")} />
          {errors.propertyAddress && <p className="text-red-500 text-xs mt-1">{errors.propertyAddress}</p>}
        </div>

        {/* Price + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="listingPrice" className="block text-sm font-medium text-slate-700 mb-1.5">
              Listing Price <span className="text-red-500">*</span>
            </label>
            <input type="text" id="listingPrice" value={data.listingPrice} onChange={(e) => onChange("listingPrice", e.target.value)}
              placeholder="$500,000" className={inputClass("listingPrice")} />
            {errors.listingPrice && <p className="text-red-500 text-xs mt-1">{errors.listingPrice}</p>}
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-1.5">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select id="propertyType" value={data.propertyType} onChange={(e) => onChange("propertyType", e.target.value)}
              className={`${inputClass("propertyType")} cursor-pointer appearance-none`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="">Select type</option>
              <option value="Single Family">Single Family</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Condo">Condo</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
            {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
          </div>
        </div>

        {/* Beds + Baths */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms <span className="text-red-500">*</span></label>
            <input type="number" id="bedrooms" min="0" value={data.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)}
              placeholder="3" className={inputClass("bedrooms")} />
            {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms <span className="text-red-500">*</span></label>
            <input type="number" id="bathrooms" min="0" step="0.5" value={data.bathrooms} onChange={(e) => onChange("bathrooms", e.target.value)}
              placeholder="2" className={inputClass("bathrooms")} />
            {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
          </div>
        </div>

        {/* SqFt + Lot + Year */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="sqft" className="block text-sm font-medium text-slate-700 mb-1.5">Sq. Footage <span className="text-red-500">*</span></label>
            <input type="text" id="sqft" value={data.sqft} onChange={(e) => onChange("sqft", e.target.value)}
              placeholder="2,500" className={inputClass("sqft")} />
            {errors.sqft && <p className="text-red-500 text-xs mt-1">{errors.sqft}</p>}
          </div>
          <div>
            <label htmlFor="lotSize" className="block text-sm font-medium text-slate-700 mb-1.5">Lot Size <span className="text-red-500">*</span></label>
            <input type="text" id="lotSize" value={data.lotSize} onChange={(e) => onChange("lotSize", e.target.value)}
              placeholder="0.5 acres" className={inputClass("lotSize")} />
            {errors.lotSize && <p className="text-red-500 text-xs mt-1">{errors.lotSize}</p>}
          </div>
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-slate-700 mb-1.5">Year Built <span className="text-red-500">*</span></label>
            <input type="text" id="yearBuilt" value={data.yearBuilt} onChange={(e) => onChange("yearBuilt", e.target.value)}
              placeholder="2005" className={inputClass("yearBuilt")} />
            {errors.yearBuilt && <p className="text-red-500 text-xs mt-1">{errors.yearBuilt}</p>}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <label htmlFor="keyFeatures" className="block text-sm font-medium text-slate-700 mb-1.5">
            Key Features / Highlights <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea id="keyFeatures" value={data.keyFeatures} onChange={(e) => onChange("keyFeatures", e.target.value)}
            rows={3} placeholder="e.g. Upgraded kitchen, pool, mountain views, new roof..."
            className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
        </div>
      </div>
    </div>
  );
}
