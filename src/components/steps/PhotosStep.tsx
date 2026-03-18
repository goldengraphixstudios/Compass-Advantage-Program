"use client";

import { useCallback, useRef, useState } from "react";
import { FormData } from "../FormWizard";

interface Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  propertyPhotos: { name: string; data: string }[];
  headshot: { name: string; data: string } | null;
  onPropertyPhotosChange: (photos: { name: string; data: string }[]) => void;
  onHeadshotChange: (headshot: { name: string; data: string } | null) => void;
}

export default function PhotosStep({ data, errors, onChange, propertyPhotos, headshot, onPropertyPhotosChange, onHeadshotChange }: Props) {
  const propertyInputRef = useRef<HTMLInputElement>(null);
  const headshotInputRef = useRef<HTMLInputElement>(null);
  const [propDragActive, setPropDragActive] = useState(false);
  const [headDragActive, setHeadDragActive] = useState(false);

  const readFile = (file: File): Promise<{ name: string; data: string }> => {
    return new Promise((resolve, reject) => {
      if (file.size > 10 * 1024 * 1024) { reject(new Error("File too large")); return; }
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, data: reader.result as string });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePropertyFiles = useCallback(async (files: FileList) => {
    const remaining = 5 - propertyPhotos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.all(toProcess.map((f) => readFile(f).catch(() => null)));
    const valid = results.filter(Boolean) as { name: string; data: string }[];
    onPropertyPhotosChange([...propertyPhotos, ...valid]);
  }, [propertyPhotos, onPropertyPhotosChange]);

  const handleHeadshotFile = useCallback(async (files: FileList) => {
    if (files.length === 0) return;
    try {
      const result = await readFile(files[0]);
      onHeadshotChange(result);
    } catch { /* too large */ }
  }, [onHeadshotChange]);

  const handleDrop = (e: React.DragEvent, type: "property" | "headshot") => {
    e.preventDefault();
    type === "property" ? setPropDragActive(false) : setHeadDragActive(false);
    const files = e.dataTransfer.files;
    type === "property" ? handlePropertyFiles(files) : handleHeadshotFile(files);
  };

  return (
    <div className="animate-fade-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-600">Photos</h3>
          <p className="text-sm text-slate-400">Upload property images and your headshot</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Has Photos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Do you have professional photos?</label>
          <div className="flex gap-4">
            {["Yes", "No"].map((val) => (
              <label key={val}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-colors flex-1 ${
                  data.hasPhotos === val ? "border-cyan-500 bg-cyan-50/50" : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <input type="radio" name="hasPhotos" value={val} checked={data.hasPhotos === val}
                  onChange={(e) => onChange("hasPhotos", e.target.value)}
                  className="custom-radio w-5 h-5 rounded-full border-2 border-slate-300 appearance-none cursor-pointer" />
                <span className="text-sm font-medium text-slate-700">{val}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Photos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Property Photos <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(up to 5, max 10 MB each)</span>
          </label>
          <div
            className={`file-drop border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${propDragActive ? "file-drop-active border-cyan-500" : "border-slate-200"}`}
            onClick={() => propertyInputRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setPropDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setPropDragActive(true); }}
            onDragLeave={() => setPropDragActive(false)}
            onDrop={(e) => handleDrop(e, "property")}
          >
            <input ref={propertyInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && handlePropertyFiles(e.target.files)} />
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10 MB</p>
          </div>
          {errors.propertyPhotos && <p className="text-red-500 text-xs mt-2">{errors.propertyPhotos}</p>}
          {propertyPhotos.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-3">
              {propertyPhotos.map((p, i) => (
                <div key={i} className="photo-thumb aspect-square rounded-xl overflow-hidden relative bg-slate-100">
                  <img src={p.data} alt={p.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => onPropertyPhotosChange(propertyPhotos.filter((_, idx) => idx !== i))}
                    className="remove-btn absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Headshot */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Personal Headshot <span className="text-slate-400 font-normal">(optional — max 10 MB)</span>
          </label>
          <div
            className={`file-drop border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${headDragActive ? "file-drop-active border-cyan-500" : "border-slate-200"}`}
            onClick={() => headshotInputRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setHeadDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setHeadDragActive(true); }}
            onDragLeave={() => setHeadDragActive(false)}
            onDrop={(e) => handleDrop(e, "headshot")}
          >
            <input ref={headshotInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files && handleHeadshotFile(e.target.files)} />
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">Click to upload your headshot</p>
            <p className="text-xs text-slate-400 mt-1">Professional photo recommended</p>
          </div>
          {headshot && (
            <div className="mt-3">
              <div className="photo-thumb w-24 h-24 rounded-xl overflow-hidden relative bg-slate-100 inline-block">
                <img src={headshot.data} alt="Headshot" className="w-full h-full object-cover" />
                <button type="button" onClick={() => onHeadshotChange(null)}
                  className="remove-btn absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="bg-cyan-50/60 border border-cyan-100 rounded-xl p-4 flex gap-3">
          <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-cyan-800">
            Use well-lit, high-resolution photos that showcase the property&apos;s best features. Professional photography significantly increases engagement.
          </p>
        </div>
      </div>
    </div>
  );
}
