import { cacheLife, cacheTag } from "next/cache";
import { fallbackVerses, type Verse } from "@/data/fallback-verses";
import { dayKeyFor, dayNumber } from "@/lib/day";

export type DailyVerse = Verse & {
  dayKey: string;
  source: "ourmanna" | "fallback";
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

/**
 * Today's verse. Cached on the server and refreshed every 15 minutes, so the
 * page is served instantly and picks up the new verse shortly after midnight.
 */
export async function getTodaysManna(): Promise<DailyVerse> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  cacheTag("daily-verse");

  const dayKey = dayKeyFor(new Date());
  const live = await fetchOurManna();
  if (live) return { ...live, dayKey, source: "ourmanna" };

  const fallback = fallbackVerses[dayNumber(dayKey) % fallbackVerses.length];
  return { ...fallback, dayKey, source: "fallback" };
}

/** Bible Gateway link to the whole chapter, e.g. "Galatians 1:10" -> Galatians 1. */
export function chapterUrl(reference: string, version: string): string {
  const chapter = reference.replace(/:.*$/, "").trim();
  const q = new URLSearchParams({ search: chapter, version });
  return `https://www.biblegateway.com/passage/?${q.toString()}`;
}
