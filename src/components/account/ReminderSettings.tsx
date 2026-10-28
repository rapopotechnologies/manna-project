"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { localDayKey } from "@/lib/reader-day";
import { createClient } from "@/lib/supabase/browser";

type Mode = "off" | "daily" | "away";

const T = {
  en: {
    label: "Morning reminder",
    title: "A verse in your inbox?",
    note: (email: string) => `Sent to ${email} around 6am your time. Off unless you choose otherwise.`,
    off: "Off",
    offNote: "No emails.",
    daily: "Every morning",
    dailyNote: "Today’s verse each morning.",
    away: "Only when I’ve been away",
    awayNote: "After 2 days without a visit, and once more after a week. Then nothing until you’re back.",
    saving: "Saving…",
    saved: "Saved.",
    failed: "Couldn’t save just now. Try again.",
  },
  id: {
    label: "Pengingat pagi",
    title: "Ayat di kotak masukmu?",
    note: (email: string) => `Dikirim ke ${email} sekitar pukul 6 pagi waktumu. Mati kecuali kamu memilih lain.`,
    off: "Mati",
    offNote: "Tanpa email.",
    daily: "Setiap pagi",
    dailyNote: "Ayat hari ini setiap pagi.",
    away: "Hanya saat aku lama tidak mampir",
    awayNote: "Setelah 2 hari tidak berkunjung, dan sekali lagi setelah seminggu. Setelah itu tidak ada, sampai kamu kembali.",
    saving: "Menyimpan…",
    saved: "Tersimpan.",
    failed: "Belum bisa menyimpan. Coba lagi.",
  },
};

const timeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
  } catch {
    return "Asia/Jakarta";
  }
};

/** Opt-in morning reminder emails: off, every morning, or only after a few days away. */
export function ReminderSettings({ userId, email }: { userId: string; email: string }) {
  const lang = useLang();
  const t = T[lang];
  const [mode, setMode] = useState<Mode | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    createClient()
      .from("reminders")
      .select("mode")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setMode(data?.mode ?? "off"));
  }, [userId]);

  async function choose(next: Mode) {
    const before = mode;
    setMode(next);
    setStatus(t.saving);
    const supabase = createClient();
    const { error } =
      next === "off"
        ? await supabase.from("reminders").delete().eq("user_id", userId)
        : await supabase
            .from("reminders")
            .upsert({ user_id: userId, mode: next, lang, time_zone: timeZone(), last_seen: localDayKey() }, { onConflict: "user_id" });
    if (error) {
      setMode(before);
      setStatus(t.failed);
    } else {
      setStatus(t.saved);
      setTimeout(() => setStatus(""), 2500);
    }
  }

  const options: { value: Mode; name: string; note: string }[] = [
    { value: "off", name: t.off, note: t.offNote },
    { value: "daily", name: t.daily, note: t.dailyNote },
    { value: "away", name: t.away, note: t.awayNote },
  ];

  return (
    <section className="progress-card" aria-labelledby="reminder-title">
      <div className="progress-head">
        <span className="label">{t.label}</span>
        <h2 id="reminder-title">{t.title}</h2>
      </div>
      <fieldset className="reminder-options" disabled={mode === null}>
        <legend className="sr-only">{t.label}</legend>
        {options.map((o) => (
          <label key={o.value} className={`reminder-option${mode === o.value ? " is-on" : ""}`}>
            <input type="radio" name="reminder" value={o.value} checked={mode === o.value} onChange={() => choose(o.value)} />
            <span>
              <b>{o.name}</b>
              <small>{o.note}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <p className="muted-line">{t.note(email)}</p>
      <p className="muted-line" role="status">{status}</p>
    </section>
  );
}
