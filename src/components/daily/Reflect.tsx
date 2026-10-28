"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { plantReflection } from "@/lib/progress";
import { useReaderDay } from "@/lib/use-reader-day";

const steps = [
  { key: "s", letter: "S", name: "Scripture", hint: "Write out the phrase that stood out to you." },
  { key: "o", letter: "O", name: "Observation", hint: "What do you notice? What is God saying here?" },
  { key: "a", letter: "A", name: "Application", hint: "How will this shape your day today?" },
  { key: "p", letter: "P", name: "Prayer", hint: "Turn it into a short prayer." },
] as const;

// The letters stay S.O.A.P. (the method's name), with the Indonesian word alongside.
const stepsId: Record<(typeof steps)[number]["key"], { name: string; hint: string }> = {
  s: { name: "Scripture · Firman", hint: "Tuliskan bagian ayat yang paling menyentuhmu." },
  o: { name: "Observation · Pengamatan", hint: "Apa yang kamu perhatikan? Apa yang Tuhan katakan di sini?" },
  a: { name: "Application · Penerapan", hint: "Bagaimana ayat ini membentuk harimu hari ini?" },
  p: { name: "Prayer · Doa", hint: "Jadikan sebuah doa singkat." },
};

const T = {
  en: {
    label: "Reflect",
    title: "Spend five minutes with it",
    sub: "The S.O.A.P. method, the same one in our Bible Reading Tracker.",
    saved: "Saved on this device. Signed in? It saves to your account too.",
    private: "Your notes stay on this device, or in your account if you’re signed in. Nobody else sees them.",
    planted: "A flower was planted in",
    garden: "your garden",
    support: "Manna Project is free, kept going by readers like you.",
    supportLink: "Support it →",
  },
  id: {
    label: "Renungkan",
    title: "Luangkan lima menit bersamanya",
    sub: "Metode S.O.A.P., sama seperti di Bible Reading Tracker kami.",
    saved: "Tersimpan di perangkat ini. Sudah masuk? Tersimpan juga di akunmu.",
    private: "Catatanmu tersimpan di perangkat ini, atau di akunmu jika kamu sudah masuk. Tidak ada orang lain yang melihatnya.",
    planted: "Sekuntum bunga ditanam di",
    garden: "kebunmu",
    support: "Manna Project gratis, dan tetap berjalan berkat pembaca sepertimu.",
    supportLink: "Dukung kami →",
  },
};

type Notes = Record<(typeof steps)[number]["key"], string>;
const empty: Notes = { s: "", o: "", a: "", p: "" };

const storageKey = (dayKey: string) => `manna:soap:${dayKey}`;

/** A S.O.A.P. reflection for the verse the reader is seeing, saved only on this device. */
export function Reflect({ verseDays }: { verseDays: string[] }) {
  const lang = useLang();
  const t = T[lang];
  const dayKey = useReaderDay(verseDays) ?? verseDays[verseDays.length - 1];
  const [notes, setNotes] = useState<Notes>(empty);
  const [saved, setSaved] = useState(false);
  const [planted, setPlanted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(dayKey));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loading saved notes once on mount
      if (raw) setNotes({ ...empty, ...JSON.parse(raw) });
    } catch {
      // Storage unavailable (private mode); the form still works for this visit.
    }
  }, [dayKey]);

  function update(key: keyof Notes, value: string) {
    const next = { ...notes, [key]: value };
    setNotes(next);
    try {
      localStorage.setItem(storageKey(dayKey), JSON.stringify(next));
      window.dispatchEvent(new Event("manna:local-change"));
      setSaved(true);
    } catch {
      setSaved(false);
    }
    if (steps.every((s) => next[s.key].trim()) && plantReflection(dayKey)) setPlanted(true);
  }

  return (
    <details className="reflect">
      <summary>
        <span className="label">{t.label}</span>
        <span className="reflect-title">{t.title}</span>
        <span className="reflect-sub">{t.sub}</span>
      </summary>
      <div className="reflect-grid">
        {steps.map((step) => (
          <label key={step.key} className="reflect-field" htmlFor={`soap-${step.key}`}>
            <span className="reflect-letter" aria-hidden="true">{step.letter}</span>
            <span className="reflect-name">{lang === "id" ? stepsId[step.key].name : step.name}</span>
            <textarea
              id={`soap-${step.key}`}
              rows={3}
              placeholder={lang === "id" ? stepsId[step.key].hint : step.hint}
              value={notes[step.key]}
              onChange={(e) => update(step.key, e.target.value)}
            />
          </label>
        ))}
      </div>
      <p className="reflect-note">{saved ? t.saved : t.private}</p>
      {planted && (
        <p className="reflect-planted hand">
          {t.planted} <Link href={localPath(lang, "/my-manna")}>{t.garden}</Link>.
        </p>
      )}
      {steps.every((s) => notes[s.key].trim()) && (
        <p className="reflect-support">
          {t.support} <Link href={localPath(lang, "/support")}>{t.supportLink}</Link>
        </p>
      )}
    </details>
  );
}
