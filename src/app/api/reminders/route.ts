import { NextResponse, type NextRequest } from "next/server";
import { canSendEmail, sendReminderEmail } from "@/lib/email";
import { localPath } from "@/i18n/lang";
import { pickDay } from "@/lib/reader-day";
import { AWAY_NUDGE_DAYS, daysBetween, isAuthorized, localNow, SEND_HOUR, turnOffPageUrl, unsubscribeUrl } from "@/lib/reminders";
import { SITE_URL } from "@/lib/site";
import { createServiceClient, hasServiceKey } from "@/lib/supabase/admin";
import { getVerseDays } from "@/lib/verse";
import { shownVerse } from "@/views/DailyView";

/**
 * Sends the morning reminders that are due: called every hour by the database's scheduler
 * (pg_cron job "send-reminders"), with the shared secret. Each reader gets theirs around
 * 6am in their own time zone, at most once a day, so extra calls never double-send.
 */
async function run(request: NextRequest) {
  if (!isAuthorized(request.headers.get("authorization"))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasServiceKey() || !canSendEmail()) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const db = createServiceClient();
  const { data: reminders, error } = await db.from("reminders").select("*");
  if (error) return NextResponse.json({ error: "database" }, { status: 500 });

  const due = (reminders ?? []).flatMap((r) => {
    const { day, hour } = localNow(r.time_zone);
    if (hour !== SEND_HOUR || r.last_sent_on === day) return [];
    if (r.mode === "away" && !(r.last_seen && AWAY_NUDGE_DAYS.includes(daysBetween(r.last_seen, day)))) return [];
    return [{ ...r, day }];
  });
  if (!due.length) return NextResponse.json({ sent: 0, failed: 0 });

  // Only approved readers and the team; the email address comes from their reader record.
  const [{ data: readers }, { data: team }] = await Promise.all([
    db.from("readers").select("user_id, email, status").in("user_id", due.map((r) => r.user_id)),
    db.from("admins").select("email"),
  ]);
  const teamEmails = new Set((team ?? []).map((a) => a.email.toLowerCase()));
  const verseDays = await getVerseDays();
  const byDay = new Map(verseDays.days.map((v) => [v.dayKey, v]));

  let sent = 0;
  let failed = 0;
  for (const r of due) {
    const reader = readers?.find((x) => x.user_id === r.user_id);
    if (!reader || !(reader.status === "approved" || teamEmails.has(reader.email.toLowerCase()))) continue;
    const verse = byDay.get(pickDay(r.day, verseDays.days.map((v) => v.dayKey)));
    if (!verse) continue;
    const shown = shownVerse(verse, r.lang);
    const ok = await sendReminderEmail({
      to: reader.email,
      lang: r.lang,
      mode: r.mode,
      verse: { text: shown.text, reference: `${shown.reference} · ${shown.version}` },
      url: `${SITE_URL}${localPath(r.lang, "/daily")}`,
      turnOffUrl: turnOffPageUrl(r.user_id, r.lang),
      unsubscribeUrl: unsubscribeUrl(r.user_id),
    });
    if (ok) {
      sent++;
      await db.from("reminders").update({ last_sent_on: r.day }).eq("user_id", r.user_id);
    } else {
      failed++;
    }
  }
  return NextResponse.json({ sent, failed });
}

export const POST = run;
export const GET = run;
