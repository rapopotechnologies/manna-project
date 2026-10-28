// Each reader gets the day's content at their own midnight.
//
// Pages are built ahead of time, so they include every day a reader somewhere in the
// world could be on (at most UTC yesterday, today and tomorrow). A tiny script in the
// page head stores the reader's local date on <html data-day>, and CSS shows the
// matching day before anything is painted.
//
// The daily verse can only go as far as OurManna has published (about midnight UTC),
// so readers ahead of UTC (like Indonesia) get each new verse at about 7am local time.

const DAY_MS = 86_400_000;

/** "2026-10-28" in the reader's own time zone. */
export function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "2026-10-28" in UTC. */
export function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dayKey: string, n: number): string {
  return new Date(Date.parse(`${dayKey}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

export const isDayKey = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** The available day to show for a reader's local date: their own day, or the nearest one there is. */
export function pickDay(local: string, available: readonly string[]): string {
  if (!available.length) return local;
  const sorted = [...available].sort();
  if (sorted.includes(local)) return local;
  if (local > sorted[sorted.length - 1]) return sorted[sorted.length - 1];
  if (local < sorted[0]) return sorted[0];
  return sorted.filter((d) => d <= local).pop() ?? sorted[0];
}

/** The local dates a reader anywhere could be on during a UTC day: yesterday, today and tomorrow. */
export function possibleLocalDays(utcDay: string): string[] {
  return [addDays(utcDay, -1), utcDay, addDays(utcDay, 1)];
}

/**
 * Milliseconds until the reader sees a new verse. That's their next local midnight,
 * unless OurManna hasn't published that day yet, in which case it's the next UTC midnight.
 */
export function msUntilNextVerse(now = new Date()): number {
  const shown = (t: Date) => [localDayKey(t), utcDayKey(t)].sort()[0];
  const current = shown(now);
  const nextLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const nextUtc = Date.parse(`${addDays(utcDayKey(now), 1)}T00:00:00Z`);
  const boundaries = [nextLocal, nextUtc, nextLocal + DAY_MS, nextUtc + DAY_MS].sort((a, b) => a - b);
  for (const t of boundaries) {
    if (shown(new Date(t + 1000)) !== current) return t - now.getTime();
  }
  return nextLocal - now.getTime();
}

/** Milliseconds until the reader's next local midnight (kids' question, hidden manna). */
export function msUntilLocalMidnight(now = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}

/** Inline script for <head>: records the reader's local date before the page paints. */
export const readerDayScript = `try{var d=new Date(),p=function(n){return(n<10?"0":"")+n};document.documentElement.dataset.day=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());}catch(e){}`;
