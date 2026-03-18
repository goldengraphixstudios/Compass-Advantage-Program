"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;
import {
  getSubmissions,
  deleteSubmission,
  clearAllSubmissions,
  updateSubmission,
  exportSubmissionsCSV,
  type Submission,
} from "@/lib/storage";

const ADMIN_PASSWORD = "compass2024";
const STATUS_OPTIONS: Submission["status"][] = ["new", "reviewing", "posted", "rejected"];

const statusConfig: Record<Submission["status"], { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  reviewing: { label: "Reviewing", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  posted: { label: "Posted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"submissions" | "settings">("submissions");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; name: string } | null>(null);

  // Check stored auth
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("compassAdminAuth") === "true") {
      setAuthed(true);
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const all = await getSubmissions();
      setSubmissions(all);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load, refreshKey]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 10000);
    return () => clearInterval(interval);
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("compassAdminAuth", "true");
      setLoginError("");
    } else {
      setLoginError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem("compassAdminAuth");
  };

  const handleStatusChange = async (id: string, status: Submission["status"]) => {
    await updateSubmission(id, { status });
    await load();
  };

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

  const filtered = submissions.filter((s) => {
    const matchesSearch = !search || [s.agentName, s.propertyAddress, s.brokerageName, s.mlsNumber, s.listingPrice]
      .some((v) => (v || "").toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selected = submissions.find((s) => s.id === selectedId) || null;

  const downloadFile = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  };

  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === "new").length,
    reviewing: submissions.filter((s) => s.status === "reviewing").length,
    posted: submissions.filter((s) => s.status === "posted").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #1B2A6B 0%, #2D4080 40%, #0098D1 100%)" }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
          <div className="text-center mb-8">
            <img src={logo} alt="Compass" width={200} height={60} className="h-14 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-navy-600" style={{ fontFamily: "var(--font-display)" }}>
              Admin Panel
            </h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to manage submissions</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                placeholder="Enter admin password"
                className={`form-input w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-800 placeholder:text-slate-300 text-sm ${
                  loginError ? "form-input-error border-red-300" : "border-slate-200"
                }`}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-1.5">{loginError}</p>}
            </div>
            <button type="submit"
              className="w-full bg-navy-600 hover:bg-navy-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
              Sign In
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-6">
            <Link href="/" className="text-cyan-500 hover:text-cyan-600">Back to website</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Compass" width={140} height={40} className="h-9 w-auto" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-50 text-navy-600 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="hidden sm:flex bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => setActiveTab("submissions")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "submissions" ? "bg-white text-navy-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>
                Submissions
              </button>
              <button onClick={() => setActiveTab("settings")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "settings" ? "bg-white text-navy-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>
                Settings
              </button>
            </div>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">View Site</Link>
            <button onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {activeTab === "submissions" ? (
        <>
          {/* Stats Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: "Total", value: stats.total, color: "text-navy-600", bg: "bg-navy-50" },
                { label: "New", value: stats.new, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Reviewing", value: stats.reviewing, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Posted", value: stats.posted, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Rejected", value: stats.rejected, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 w-full" />
                </div>
                {/* Status filter */}
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: "32px" }}>
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="posted">Posted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setRefreshKey((k) => k + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Refresh
                </button>
                <button onClick={() => exportSubmissionsCSV(submissions)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export CSV
                </button>
                <button onClick={() => submissions.length > 0 && setShowClearModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-slate-400 text-sm">{loading ? "Loading submissions..." : submissions.length === 0 ? "No submissions yet" : "No matching results"}</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Agent</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Submitted</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => {
                        const { date, time } = fmtDate(s.submittedAt);
                        const sc = statusConfig[s.status || "new"];
                        return (
                          <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-medium text-navy-600 truncate max-w-[200px]">{s.propertyAddress || "—"}</p>
                              <p className="text-xs text-slate-400 mt-0.5">MLS: {s.mlsNumber || "—"}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-slate-700">{s.agentName}</p>
                              <p className="text-xs text-slate-400">{s.brokerageName}</p>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-700">{s.listingPrice || "—"}</td>
                            <td className="py-3 px-4 text-slate-500">{s.propertyType || "—"}</td>
                            <td className="py-3 px-4">
                              <select
                                value={s.status || "new"}
                                onChange={(e) => handleStatusChange(s.id, e.target.value as Submission["status"])}
                                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none ${sc.bg} ${sc.color}`}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{statusConfig[opt].label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-xs">
                              {date}<br />{time}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => setSelectedId(s.id)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy-600 transition-colors cursor-pointer"
                                  title="View details">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
                                <button onClick={() => handleDelete(s.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Delete">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-400">
                  Showing {filtered.length} of {submissions.length} submissions — auto-refreshes every 10s
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Settings Tab ── */
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-navy-600 mb-6" style={{ fontFamily: "var(--font-display)" }}>Settings</h2>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h3 className="font-semibold text-navy-600 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => { const newSubs = submissions.filter((s) => s.status === "new"); newSubs.forEach((s) => handleStatusChange(s.id, "reviewing")); }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Mark All New as Reviewing</p>
                    <p className="text-xs text-slate-400">{stats.new} submission{stats.new !== 1 ? "s" : ""} will be updated</p>
                  </div>
                </button>
                <button onClick={() => { const revSubs = submissions.filter((s) => s.status === "reviewing"); revSubs.forEach((s) => handleStatusChange(s.id, "posted")); }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Mark All Reviewing as Posted</p>
                    <p className="text-xs text-slate-400">{stats.reviewing} submission{stats.reviewing !== 1 ? "s" : ""} will be updated</p>
                  </div>
                </button>
                <button onClick={() => exportSubmissionsCSV(submissions)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Export All to CSV</p>
                    <p className="text-xs text-slate-400">{stats.total} submission{stats.total !== 1 ? "s" : ""} will be exported</p>
                  </div>
                </button>
                <button onClick={() => setRefreshKey((k) => k + 1)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-navy-300 hover:bg-navy-50/50 transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Force Refresh</p>
                    <p className="text-xs text-slate-400">Reload all submissions from storage</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-100 p-6">
              <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50/50">
                <div>
                  <p className="text-sm font-medium text-slate-700">Delete All Submissions</p>
                  <p className="text-xs text-slate-400">Permanently removes all {stats.total} submissions. This cannot be undone.</p>
                </div>
                <button onClick={() => submissions.length > 0 && setShowClearModal(true)}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer flex-shrink-0">
                  Delete All
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h3 className="font-semibold text-navy-600 mb-4">About</h3>
              <div className="space-y-2 text-sm text-slate-500">
                <p>Compass Advantage Program — Admin Panel</p>
                <p>Data is stored in the browser&apos;s localStorage. To share data across devices, use the CSV export.</p>
                <p className="text-xs text-slate-400 mt-3">Contact: jfaioli@compasste.com | abettencourt@compasste.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <h2 className="text-xl font-bold text-navy-600" style={{ fontFamily: "var(--font-display)" }}>
                      {selected.propertyAddress || "No address"}
                    </h2>
                    <span className={`px-2 py-0.5 rounded-md border text-xs font-semibold ${statusConfig[selected.status || "new"].bg} ${statusConfig[selected.status || "new"].color}`}>
                      {statusConfig[selected.status || "new"].label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">Submitted {fmtDate(selected.submittedAt).date} at {fmtDate(selected.submittedAt).time}</p>
                </div>
                <button onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status changer */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                {STATUS_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => { handleStatusChange(selected.id, opt); setSelectedId(null); setTimeout(() => setSelectedId(selected.id), 50); }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      (selected.status || "new") === opt
                        ? `${statusConfig[opt].bg} ${statusConfig[opt].color}`
                        : "border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}>
                    {statusConfig[opt].label}
                  </button>
                ))}
              </div>

              {selected.propertyPhotos?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Property Photos ({selected.propertyPhotos.length})</h4>
                    <button
                      onClick={() => selected.propertyPhotos.forEach((p) => downloadFile(p.url, p.name))}
                      className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                    {selected.propertyPhotos.map((p, i) => (
                      <div key={i} className="relative group cursor-pointer" onClick={() => setLightboxImg({ src: p.url, name: p.name })}>
                        <img src={p.url} alt={p.name} className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); downloadFile(p.url, p.name); }}
                              className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">{p.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-navy-600">{selected.listingPrice || "—"}</p>
                  <p className="text-xs text-slate-400">Price</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-navy-600">{selected.bedrooms || "—"}/{selected.bathrooms || "—"}</p>
                  <p className="text-xs text-slate-400">Bed/Bath</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-navy-600">{selected.sqft || "—"}</p>
                  <p className="text-xs text-slate-400">Sq Ft</p>
                </div>
              </div>

              {[
                { title: "Contact", fields: [["Agent", selected.agentName], ["Email", selected.agentEmail], ["Phone", selected.agentPhone], ["Brokerage", selected.brokerageName], ["MLS #", selected.mlsNumber]] },
                { title: "Property", fields: [["Type", selected.propertyType], ["Lot", selected.lotSize], ["Year", selected.yearBuilt], ...(selected.keyFeatures ? [["Features", selected.keyFeatures] as [string, string]] : [])] },
                { title: "Open House", fields: [["Date", selected.openHouseDates || "N/A"], ["Time", selected.startTime ? `${selected.startTime} - ${selected.endTime}` : "N/A"], ["Present", selected.agentPresent || "N/A"]] },
                { title: "Marketing", fields: [["Help", selected.needSocialHelp], ["Platforms", (selected.platforms || []).join(", ")], ...(selected.hashtags ? [["Hashtags", selected.hashtags] as [string, string]] : [])] },
              ].map((section) => (
                <div key={section.title} className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{section.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {section.fields.map(([l, v]) => (
                      <div key={l} className={["Features"].includes(l) ? "col-span-2" : ""}>
                        <span className="text-slate-400">{l}:</span> <span className="text-slate-700 font-medium">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selected.additionalNotes && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
                  <p className="text-sm text-slate-700">{selected.additionalNotes}</p>
                </div>
              )}

              {selected.headshot && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Headshot</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer" onClick={() => setLightboxImg({ src: selected.headshot!.url, name: selected.headshot!.name })}>
                      <img src={selected.headshot.url} alt="Headshot" className="w-16 h-16 rounded-xl object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{selected.headshot.name}</p>
                      <button onClick={() => downloadFile(selected.headshot!.url, selected.headshot!.name)}
                        className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium mt-1 cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
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

      {/* Image Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-4xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg.src} alt={lightboxImg.name} className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            <div className="flex items-center justify-between mt-3">
              <p className="text-white/70 text-sm truncate">{lightboxImg.name}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadFile(lightboxImg.src, lightboxImg.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
                <button onClick={() => setLightboxImg(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
            <p className="text-sm text-slate-500 mb-6">This permanently deletes all {submissions.length} submissions.</p>
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
