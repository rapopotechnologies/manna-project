import { cacheLife, cacheTag } from "next/cache";
import { usfmFor } from "@/data/bible-id";
import { fallbackVerses, type Verse } from "@/data/fallback-verses";
import { dayNumber } from "@/lib/day";
import { addDays, isDayKey, utcDayKey } from "@/lib/reader-day";
import { hasSupabase } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

/** The same passage in the Terjemahan Sederhana Indonesia, for the Indonesian site. */
export type IndonesianText = { text: string; reference: string; version: "TSI" };

export type DailyVerse = Verse & {
  dayKey: string;
  source: "ourmanna" | "fallback";
  /** Null when YouVersion couldn't be reached; the Indonesian site then shows the NIV. */
  tsi?: IndonesianText | null;
};

export type VerseDays = {
  /** The UTC date these were assembled on. */
  utcDay: string;
  /** Verses for the days readers could be on, oldest first (usually UTC yesterday and today). */
  days: DailyVerse[];
};

const OURMANNA_URL = "https://beta.ourmanna.com/api/v1/get?format=json&order=daily";

async function fetchOurManna(): Promise<Verse | null> {
  try {
    const res = await fetch(OURMANNA_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const details = (data as { verse?: { details?: Record<string, unknown> } })?.verse?.details;
    const text = typeof details?.text === "string" ? details.text.replace(/\s+/g, " ").trim() : "";
    const reference = typeof details?.reference === "string" ? details.reference.trim() : "";
    if (!text || !reference) return null;
    const version = typeof details?.version === "string" && details.version ? details.version : "NIV";
    return { text, reference, version };
  } catch {
    return null;
  }
}

const TSI_BIBLE_ID = 320;

/** The passage in the TSI from the YouVersion Platform (key in YOUVERSION_APP_KEY). */
async function fetchTsi(reference: string): Promise<IndonesianText | null> {
  const key = process.env.YOUVERSION_APP_KEY;
  const usfm = usfmFor(reference);
  if (!key || !usfm) return null;
  try {
    const res = await fetch(`https://api.youversion.com/v1/bibles/${TSI_BIBLE_ID}/passages/${usfm.passage}`, {
      headers: { "X-YVP-App-Key": key, accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: unknown; reference?: unknown };
    const text = typeof data.content === "string" ? data.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";
    const ref = typeof data.reference === "string" ? data.reference.trim() : "";
    return text && ref ? { text, reference: ref, version: "TSI" } : null;
  } catch {
    return null;
  }
}

const withTsi = async (v: DailyVerse): Promise<DailyVerse> => ({ ...v, tsi: await fetchTsi(v.reference) });

const fallbackFor = (dayKey: string): DailyVerse => ({
  ...fallbackVerses[dayNumber(dayKey) % fallbackVerses.length],
  dayKey,
  source: "fallback",
});

/**
 * The verses for UTC yesterday and today, from the archive the database keeps
 * (it saves OurManna's verse every day). Cached and refreshed every 15 minutes.
 * If today's isn't archived yet, OurManna is asked directly; if that fails, a
 * verse from our own backup list is used, so the page is never empty.
 */
export async function getVerseDays(): Promise<VerseDays> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  cacheTag("daily-verse");

  const utcDay = utcDayKey(new Date());
  const yesterday = addDays(utcDay, -1);
  const archived = new Map<string, DailyVerse>();

  if (hasSupabase) {
    try {
      const { data } = await createPublicClient()
        .from("daily_verses")
        .select("day, text, reference, version")
        .gte("day", yesterday)
        .lte("day", utcDay)
        .order("day");
      for (const r of data ?? []) {
        archived.set(r.day, { dayKey: r.day, text: r.text, reference: r.reference, version: r.version, source: "ourmanna" });
      }
    } catch {
      // Archive unavailable; fall through to OurManna directly.
    }
  }

  if (!archived.has(utcDay)) {
    const live = await fetchOurManna();
    archived.set(utcDay, live ? { ...live, dayKey: utcDay, source: "ourmanna" } : fallbackFor(utcDay));
  }

  const days = [...archived.values()].sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  return { utcDay, days: await Promise.all(days.map(withTsi)) };
}

/** The newest verse (link previews, the RSS feed, the default share image). */
export async function getTodaysManna(): Promise<DailyVerse> {
  const { days } = await getVerseDays();
  return days[days.length - 1];
}

/** The verse for a specific day if we have it, otherwise the newest. */
export async function getVerseForDay(day: string | null): Promise<DailyVerse> {
  const { days } = await getVerseDays();
  if (isDayKey(day)) {
    const match = days.find((v) => v.dayKey === day);
    if (match) return match;
    if (hasSupabase) {
      try {
        const { data } = await createPublicClient().from("daily_verses").select("day, text, reference, version").eq("day", day).maybeSingle();
        if (data) return withTsi({ dayKey: data.day, text: data.text, reference: data.reference, version: data.version, source: "ourmanna" });
      } catch {}
    }
  }
  return days[days.length - 1];
}

/** Bible Gateway link to the whole chapter, e.g. "Galatians 1:10" -> Galatians 1. */
export function chapterUrl(reference: string, version: string): string {
  const chapter = reference.replace(/:.*$/, "").trim();
  const q = new URLSearchParams({ search: chapter, version });
  return `https://www.biblegateway.com/passage/?${q.toString()}`;
}
