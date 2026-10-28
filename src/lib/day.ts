// A Manna Project "day" runs midnight to midnight Pacific time, as on the original site.
// Everything daily (the verse, the kids' question) keys off this.

export const BRAND_TIME_ZONE = "America/Los_Angeles";

const keyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: BRAND_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-10-27" for the Pacific calendar day that `date` falls on. */
export function dayKeyFor(date: Date): string {
  return keyFormat.format(date);
}

/** Whole days since 1970-01-01 for a day key. Used to rotate through lists. */
export function dayNumber(dayKey: string): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** The day key `offset` days away from `dayKey`. */
export function shiftDayKey(dayKey: string, offset: number): string {
  const n = dayNumber(dayKey) + offset;
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

/** "Tuesday, October 27", or "Selasa, 27 Oktober" in Indonesian. */
export function formatDayLabel(dayKey: string, lang: "en" | "id" = "en"): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** Milliseconds from `now` until the next Pacific midnight. */
export function msUntilNextDay(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BRAND_TIME_ZONE,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const elapsed = (get("hour") * 3600 + get("minute") * 60 + get("second")) * 1000 + now.getMilliseconds();
  return 86_400_000 - elapsed;
}
