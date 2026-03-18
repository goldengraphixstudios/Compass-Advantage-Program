import { supabase } from "./supabase";

export interface Submission {
  id: string;
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
  propertyPhotos: { name: string; url: string }[];
  headshot: { name: string; url: string } | null;
  submittedAt: string;
  status: "new" | "reviewing" | "posted" | "rejected";
}

// ── Key mapping (camelCase <-> snake_case) ──

const camelToSnake: Record<string, string> = {
  agentName: "agent_name", agentEmail: "agent_email", agentPhone: "agent_phone",
  brokerageName: "brokerage_name", mlsNumber: "mls_number",
  propertyAddress: "property_address", listingPrice: "listing_price",
  propertyType: "property_type", lotSize: "lot_size", yearBuilt: "year_built",
  keyFeatures: "key_features", openHouseDates: "open_house_dates",
  startTime: "start_time", endTime: "end_time", agentPresent: "agent_present",
  specialInstructions: "special_instructions", needSocialHelp: "need_social_help",
  hasPhotos: "has_photos", additionalNotes: "additional_notes",
  propertyPhotos: "property_photos", submittedAt: "submitted_at",
};

const snakeToCamel: Record<string, string> = Object.fromEntries(
  Object.entries(camelToSnake).map(([c, s]) => [s, c])
);

function toDbRow(obj: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    row[camelToSnake[key] || key] = val;
  }
  return row;
}

function fromDbRow(row: Record<string, unknown>): Submission {
  const obj: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(row)) {
    obj[snakeToCamel[key] || key] = val;
  }
  return obj as unknown as Submission;
}

// ── Photo utilities ──

function dataURLtoFile(dataURL: string, filename: string): File {
  const [header, b64] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binary = atob(b64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new File([array], filename, { type: mime });
}

async function uploadPhoto(submissionId: string, folder: string, name: string, dataURL: string): Promise<string> {
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${submissionId}/${folder}/${Date.now()}-${safeName}`;
  const file = dataURLtoFile(dataURL, safeName);
  const { error } = await supabase.storage.from("submission-photos").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("submission-photos").getPublicUrl(path);
  return data.publicUrl;
}

// ── CRUD operations ──

export async function getSubmissions(): Promise<Submission[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    return [];
  }
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row: Record<string, unknown>) => fromDbRow(row));
}

export async function saveSubmission(input: {
  id: string;
  agentName: string; agentEmail: string; agentPhone: string;
  brokerageName: string; mlsNumber: string;
  propertyAddress: string; listingPrice: string; propertyType: string;
  bedrooms: string; bathrooms: string; sqft: string;
  lotSize: string; yearBuilt: string; keyFeatures: string;
  openHouseDates: string; startTime: string; endTime: string;
  agentPresent: string; specialInstructions: string;
  needSocialHelp: string; platforms: string[]; hashtags: string;
  hasPhotos: string; additionalNotes: string;
  propertyPhotos: { name: string; data: string }[];
  headshot: { name: string; data: string } | null;
  submittedAt: string;
  status: string;
}): Promise<void> {
  // Upload photos to Supabase Storage
  const photoUrls = await Promise.all(
    input.propertyPhotos.map(async (p) => ({
      name: p.name,
      url: await uploadPhoto(input.id, "property", p.name, p.data),
    }))
  );

  let headshotUrl: { name: string; url: string } | null = null;
  if (input.headshot) {
    const url = await uploadPhoto(input.id, "headshot", input.headshot.name, input.headshot.data);
    headshotUrl = { name: input.headshot.name, url };
  }

  // Build database row (exclude raw base64 data)
  const { propertyPhotos: _pp, headshot: _hs, ...fields } = input;
  const row = toDbRow({
    ...fields,
    propertyPhotos: photoUrls,
    headshot: headshotUrl,
  });

  const { error } = await supabase.from("submissions").insert(row);
  if (error) throw error;
}

export async function updateSubmission(id: string, updates: Partial<Submission>): Promise<void> {
  const row = toDbRow(updates as Record<string, unknown>);
  const { error } = await supabase.from("submissions").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteSubmission(id: string): Promise<void> {
  // Delete photos from storage
  try {
    for (const folder of ["property", "headshot"]) {
      const { data: files } = await supabase.storage.from("submission-photos").list(`${id}/${folder}`);
      if (files && files.length > 0) {
        await supabase.storage.from("submission-photos").remove(files.map((f) => `${id}/${folder}/${f.name}`));
      }
    }
  } catch { /* ignore storage cleanup errors */ }

  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) throw error;
}

export async function clearAllSubmissions(): Promise<void> {
  const { data: subs } = await supabase.from("submissions").select("id");
  if (subs) {
    for (const sub of subs) {
      try {
        for (const folder of ["property", "headshot"]) {
          const { data: files } = await supabase.storage.from("submission-photos").list(`${sub.id}/${folder}`);
          if (files && files.length > 0) {
            await supabase.storage.from("submission-photos").remove(files.map((f) => `${sub.id}/${folder}/${f.name}`));
          }
        }
      } catch { /* ignore */ }
    }
  }
  const { error } = await supabase.from("submissions").delete().neq("id", "");
  if (error) throw error;
}

// ── CSV export (takes pre-loaded submissions) ──

export function exportSubmissionsCSV(submissions: Submission[]): void {
  if (submissions.length === 0) return;

  const headers = [
    "Agent Name", "Email", "Phone", "Brokerage", "MLS #",
    "Property Address", "Price", "Type", "Bedrooms", "Bathrooms",
    "Sq Ft", "Lot Size", "Year Built", "Key Features", "Open House Date",
    "Start Time", "End Time", "Agent Present", "Special Instructions",
    "Social Media Help", "Platforms", "Hashtags", "Additional Notes", "Status", "Submitted At",
  ];

  const rows = submissions.map((s) => [
    s.agentName, s.agentEmail, s.agentPhone, s.brokerageName, s.mlsNumber,
    s.propertyAddress, s.listingPrice, s.propertyType, s.bedrooms, s.bathrooms,
    s.sqft, s.lotSize, s.yearBuilt, s.keyFeatures, s.openHouseDates,
    s.startTime, s.endTime, s.agentPresent, s.specialInstructions,
    s.needSocialHelp, (s.platforms || []).join("; "), s.hashtags, s.additionalNotes, s.status, s.submittedAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `compass-advantage-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Draft functions (stay in localStorage — per-browser) ──

const DRAFT_KEY = "compassAdvantageDraft";

export function saveDraft(data: Record<string, unknown> | object): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function loadDraft(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
