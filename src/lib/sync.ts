// Keeps a signed-in reader's device and account in step.
// Loaded only when a sign-in cookie exists, so anonymous visitors never download it.

import { localDayKey } from "@/lib/reader-day";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/browser";
import { readProgress, replaceProgress, type Progress } from "@/lib/progress";
import { readFound } from "@/lib/found-store";

type Notes = Record<string, string>;
export type ReaderData = { progress: Progress; reflections: Record<string, Notes>; found: string[] };

const SOAP_PREFIX = "manna:soap:";
const FOUND_KEY = "manna:found";
export const SYNC_EVENT = "manna:sync";

export type SyncStatus = { state: "idle" | "syncing" | "synced" | "error" | "pending" | "declined"; at?: number };
let status: SyncStatus = { state: "idle" };
function setStatus(next: SyncStatus) {
  status = next;
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
}
export const getSyncStatus = () => status;

// ---------- Local device ----------

function readReflections(): Record<string, Notes> {
  const out: Record<string, Notes> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(SOAP_PREFIX)) continue;
      const notes = JSON.parse(localStorage.getItem(key) ?? "{}");
      if (notes && typeof notes === "object") out[key.slice(SOAP_PREFIX.length)] = notes;
    }
  } catch {
    // Storage blocked; nothing to sync from this device.
  }
  return out;
}

export function readLocal(): ReaderData {
  return { progress: readProgress(), reflections: readReflections(), found: readFound() };
}

function writeLocal(data: ReaderData) {
  replaceProgress(data.progress);
  try {
    for (const [day, notes] of Object.entries(data.reflections)) {
      localStorage.setItem(SOAP_PREFIX + day, JSON.stringify(notes));
    }
    localStorage.setItem(FOUND_KEY, JSON.stringify(data.found));
  } catch {
    // Storage full or blocked; the account still has everything.
  }
}

// ---------- Merging ----------

const union = (a: string[] = [], b: string[] = []) => Array.from(new Set([...a, ...b])).sort();
const textLength = (n: Notes = {}) => Object.values(n).join("").trim().length;

function asReaderData(row: { progress: Json; reflections: Json; found: string[] } | null): ReaderData {
  const p = (row?.progress ?? {}) as Partial<Progress>;
  return {
    progress: {
      gathered: Array.isArray(p.gathered) ? p.gathered : [],
      books: p.books && typeof p.books === "object" ? p.books : {},
      reflections: Array.isArray(p.reflections) ? p.reflections : [],
      kidsStickers: Array.isArray(p.kidsStickers) ? p.kidsStickers : [],
      manna: p.manna && typeof p.manna === "object" ? p.manna : {},
    },
    reflections: (row?.reflections && typeof row.reflections === "object" ? row.reflections : {}) as Record<string, Notes>,
    found: row?.found ?? [],
  };
}

/** Nothing is ever lost: days are combined, and for a day with notes on both sides the longer notes win. */
export function merge(a: ReaderData, b: ReaderData): ReaderData {
  const books: Record<string, string> = { ...b.progress.books };
  for (const [book, day] of Object.entries(a.progress.books)) {
    books[book] = books[book] && books[book] < day ? books[book] : day;
  }
  const manna: Record<string, number[]> = { ...b.progress.manna };
  for (const [day, ids] of Object.entries(a.progress.manna ?? {})) {
    manna[day] = Array.from(new Set([...(manna[day] ?? []), ...ids])).sort((x, y) => x - y);
  }
  const reflections: Record<string, Notes> = { ...b.reflections };
  for (const [day, notes] of Object.entries(a.reflections)) {
    if (!reflections[day] || textLength(notes) >= textLength(reflections[day])) reflections[day] = notes;
  }
  return {
    progress: {
      gathered: union(a.progress.gathered, b.progress.gathered),
      books,
      reflections: union(a.progress.reflections, b.progress.reflections),
      kidsStickers: union(a.progress.kidsStickers, b.progress.kidsStickers),
      manna,
    },
    reflections,
    found: union(a.found, b.found),
  };
}

// ---------- Account ----------

let started = false;
let pushTimer: ReturnType<typeof setTimeout> | undefined;

async function push(userId: string) {
  const supabase = createClient();
  const data = readLocal();
  setStatus({ state: "syncing" });
  const { error } = await supabase.from("reader_data").upsert({
    user_id: userId,
    progress: data.progress as unknown as Json,
    reflections: data.reflections as unknown as Json,
    found: data.found,
  });
  setStatus(error ? { state: "error" } : { state: "synced", at: Date.now() });
}

/** Pulls the account, merges it with this device, and keeps pushing changes. Safe to call more than once. */
export async function startSync(): Promise<void> {
  if (started) return;
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;

  // New accounts wait for approval before anything saves to the account.
  const { data: reader } = await supabase.from("readers").select("status").eq("user_id", user.id).maybeSingle();
  const { data: team } = await supabase.from("admins").select("email").limit(1);
  const approved = reader?.status === "approved" || Boolean(team?.length);
  if (!approved) {
    setStatus({ state: reader?.status === "declined" ? "declined" : "pending" });
    return;
  }
  started = true;
  void markSeen(user.id);

  setStatus({ state: "syncing" });
  const { data: row, error } = await supabase.from("reader_data").select("progress, reflections, found").eq("user_id", user.id).maybeSingle();
  if (error) {
    started = false;
    setStatus({ state: "error" });
    return;
  }
  writeLocal(merge(readLocal(), asReaderData(row)));
  await push(user.id);

  const schedule = () => {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => void push(user.id), 1500);
  };
  window.addEventListener("manna:progress", schedule);
  window.addEventListener("manna:local-change", schedule);
}

/**
 * Records today's visit (the reader's own date) on their reminder, if they have one, so
 * "only when I've been away" knows when they were last here. Once a day per device.
 */
async function markSeen(userId: string) {
  const today = localDayKey();
  try {
    if (localStorage.getItem("manna:seen") === today) return;
  } catch {}
  let zone = "Asia/Jakarta";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || zone;
  } catch {}
  const { error } = await createClient().from("reminders").update({ last_seen: today, time_zone: zone }).eq("user_id", userId);
  if (!error) {
    try {
      localStorage.setItem("manna:seen", today);
    } catch {}
  }
}

export function stopSync() {
  started = false;
  clearTimeout(pushTimer);
}
