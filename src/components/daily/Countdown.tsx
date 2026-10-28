"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { msUntilNextVerse } from "@/lib/reader-day";

function format(ms: number, lang: "en" | "id") {
  const mins = Math.max(1, Math.ceil(ms / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const [hu, mu] = lang === "id" ? ["j", "m"] : ["h", "m"];
  return h > 0 ? `${h}${hu} ${m}${mu}` : `${m}${mu}`;
}

/** "New verse in 8h 24m", counted to the reader's own midnight (or when OurManna publishes, if later). */
export function Countdown() {
  const lang = useLang();
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMs(msUntilNextVerse(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const text =
    ms === null
      ? lang === "id" ? "Ayat baru setiap pagi" : "A new verse every morning"
      : lang === "id" ? `Ayat baru dalam ${format(ms, lang)}` : `New verse in ${format(ms, lang)}`;
  return <span className="countdown">{text}</span>;
}
