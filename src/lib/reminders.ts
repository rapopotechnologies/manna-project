import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

// Morning reminder emails (opt-in, see public.reminders). REMINDERS_SECRET protects the hourly
// trigger and signs unsubscribe links. The same value is stored in Supabase Vault as
// "reminders_secret" so the database's hourly job can call /api/reminders.

export const SEND_HOUR = 6;

const secret = () => process.env.REMINDERS_SECRET ?? "";
export const hasRemindersSecret = () => secret().length >= 24;

/** True when the request carries the shared secret (Authorization: Bearer …). */
export function isAuthorized(header: string | null): boolean {
  if (!hasRemindersSecret() || !header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret());
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const sign = (userId: string) => createHmac("sha256", secret()).update(`unsubscribe:${userId}`).digest("hex").slice(0, 32);

export function unsubscribeUrl(userId: string): string {
  return `${SITE_URL}/api/reminders/unsubscribe?${new URLSearchParams({ u: userId, t: sign(userId) })}`;
}

/** The page the email links to: a button to turn reminders off (scanners can't trigger it). */
export function turnOffPageUrl(userId: string, lang: "en" | "id"): string {
  return `${SITE_URL}${lang === "id" ? "/id" : ""}/reminders/off?${new URLSearchParams({ u: userId, t: sign(userId) })}`;
}

export function isValidUnsubscribe(userId: string | null, token: string | null): boolean {
  if (!userId || !token || !hasRemindersSecret()) return false;
  const a = Buffer.from(sign(userId));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The reader's local date and hour right now, in their saved time zone. */
export function localNow(timeZone: string, now = new Date()): { day: string; hour: number } {
  let zone = timeZone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
  } catch {
    zone = "Asia/Jakarta";
  }
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

/** Whole days between two YYYY-MM-DD dates. */
export const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

/** "away" readers hear from us after 2 days without a visit and once more after a week, then not until they come back. */
export const AWAY_NUDGE_DAYS = [2, 7];
