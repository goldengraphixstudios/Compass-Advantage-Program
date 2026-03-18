"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;
import { getSubmissions, deleteSubmission, clearAllSubmissions, exportSubmissionsCSV, type Submission } from "@/lib/storage";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  reviewing: { label: "Reviewing", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  posted: { label: "Posted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const all = await getSubmissions();
      setSubmissions(all);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = submissions.filter((s) => {
    const matchesSearch = !search || [s.agentName, s.propertyAddress, s.brokerageName, s.mlsNumber, s.listingPrice]
      .some((v) => (v || "").toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selected = submissions.find((s) => s.id === selectedId) || null;

  const handleDelete = async (id: string) => {
    await deleteSubmission(id);
    setSelectedId(null);
    await load();
  };

  const handleClearAll = async () => {
    await clearAllSubmissions();
    setShowClearModal(false);
    await load();
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src={logo} alt="Compass Title & Escrow" width={160} height={36} className="h-9 w-auto" />
          </Link>
          <Link href="/#form-section"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Submission
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-600" style={{ fontFamily: "var(--font-display)" }}>
                Submissions Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {submissions.length} total submission{submissions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search submissions..."
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 w-64" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "34px" }}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="posted">Posted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => exportSubmissionsCSV(submissions)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button onClick={() => submissions.length > 0 && setShowClearModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">{loading ? "Loading..." : "No Submissions Yet"}</h3>
            <p className="text-slate-400 mb-6">{loading ? "Fetching submissions from database" : "Submitted listings will appear here"}</p>
            <Link href="/#form-section"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">
              Submit Your First Listing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No matching submissions found</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((s) => {
              const { date, time } = fmtDate(s.submittedAt);
              const photoCount = (s.propertyPhotos || []).length;
              return (
                <div key={s.id}
                  className="bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all p-5 cursor-pointer animate-fade-slide-in"
                  onClick={() => setSelectedId(s.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-navy-600 truncate">{s.propertyAddress || "No address"}</h3>
                        {s.listingPrice && <span className="flex-shrink-0 text-sm font-semibold text-cyan-600">{s.listingPrice}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {s.agentName}
                        </span>
                        <span>{date} at {time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(() => { const sc = statusConfig[s.status || "new"]; return (
                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      ); })()}
                      {s.propertyType && <span className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-600 text-xs font-medium">{s.propertyType}</span>}
                      {photoCount > 0 && <span className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-medium">{photoCount} photo{photoCount > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400">
                    {s.bedrooms && <span>{s.bedrooms} bed</span>}
                    {s.bathrooms && <span>{s.bathrooms} bath</span>}
                    {s.sqft && <span>{s.sqft} sqft</span>}
                    {s.openHouseDates && <span>Open House: {s.openHouseDates}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-fade-slide-in">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-navy-600" style={{ fontFamily: "var(--font-display)" }}>
                      {selected.propertyAddress || "No address"}
                    </h2>
                    {(() => { const sc = statusConfig[selected.status || "new"]; return (
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    ); })()}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Submitted {fmtDate(selected.submittedAt).date} at {fmtDate(selected.submittedAt).time}</p>
                </div>
                <button onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selected.propertyPhotos?.length > 0 && (
                <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                  {selected.propertyPhotos.map((p, i) => (
                    <img key={i} src={p.url} alt={p.name} className="w-full h-40 object-cover" />
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-navy-600">{selected.listingPrice || "-"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Listing Price</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-navy-600">{selected.bedrooms || "-"}/{selected.bathrooms || "-"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Bed / Bath</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-navy-600">{selected.sqft || "-"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sq. Ft.</p>
                </div>
              </div>

              {/* Details */}
              {[
                { title: "Contact Information", fields: [["Agent", selected.agentName], ["Email", selected.agentEmail], ["Phone", selected.agentPhone], ["Brokerage", selected.brokerageName], ["MLS #", selected.mlsNumber]] },
                { title: "Property Details", fields: [["Type", selected.propertyType], ["Lot Size", selected.lotSize], ["Year Built", selected.yearBuilt], ...(selected.keyFeatures ? [["Features", selected.keyFeatures] as [string, string]] : [])] },
                { title: "Open House", fields: [["Date", selected.openHouseDates], ["Time", `${selected.startTime} - ${selected.endTime}`], ["Agent Present", selected.agentPresent], ...(selected.specialInstructions ? [["Instructions", selected.specialInstructions] as [string, string]] : [])] },
                { title: "Marketing", fields: [["Social Help", selected.needSocialHelp], ["Platforms", (selected.platforms || []).join(", ")], ...(selected.hashtags ? [["Hashtags", selected.hashtags] as [string, string]] : [])] },
              ].map((section) => (
                <div key={section.title} className="mb-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{section.title}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {section.fields.map(([label, val]) => (
                      <div key={label} className={["Features", "Instructions"].includes(label) ? "col-span-2" : ""}>
                        <span className="text-slate-400">{label}:</span>{" "}
                        <span className="text-slate-700 font-medium">{val || "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selected.additionalNotes && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Additional Notes</h4>
                  <p className="text-sm text-slate-700">{selected.additionalNotes}</p>
                </div>
              )}

              {selected.headshot && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Agent Headshot</h4>
                  <img src={selected.headshot.url} alt="Agent headshot" className="w-20 h-20 rounded-xl object-cover" />
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                <button onClick={() => handleDelete(selected.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer">
                  Delete
                </button>
                <button onClick={() => setSelectedId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-navy-600 hover:bg-navy-500 text-white text-sm font-semibold transition-colors cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowClearModal(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center animate-fade-slide-in">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Clear All Submissions?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone. All saved submissions will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleClearAll}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
