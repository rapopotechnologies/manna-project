"use client";

import { useLang } from "@/i18n/client";
import { dateLocale } from "@/i18n/lang";
import type { WeekDay } from "@/lib/progress";

const DESCRIBE: Record<WeekDay["state"], string> = {
  gathered: "gathered",
  today: "gathered today",
  grace: "grace day",
  missed: "missed",
  ahead: "not yet",
};

const DESCRIBE_ID: Record<WeekDay["state"], string> = {
  gathered: "terkumpul",
  today: "terkumpul hari ini",
  grace: "hari anugerah",
  missed: "terlewat",
  ahead: "belum",
};

// Monday first, as in progress.weekView.
const LETTERS_ID = ["S", "S", "R", "K", "J", "S", "M"];

export function WeekRow({ days }: { days: WeekDay[] }) {
  const lang = useLang();
  return (
    <ol className="week-row" aria-label={lang === "id" ? "Minggu ini" : "This week"}>
      {days.map((d, i) => (
        <li key={d.day} className={`week-${d.state}`}>
          <i aria-hidden="true" />
          <span aria-hidden="true">{lang === "id" ? LETTERS_ID[i] : d.label}</span>
          <span className="sr-only">{`${new Date(`${d.day}T12:00:00Z`).toLocaleDateString(dateLocale(lang), { weekday: "long", timeZone: "UTC" })}: ${(lang === "id" ? DESCRIBE_ID : DESCRIBE)[d.state]}`}</span>
        </li>
      ))}
    </ol>
  );
}
