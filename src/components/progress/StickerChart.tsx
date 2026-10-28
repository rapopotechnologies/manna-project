"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";
import { dateLocale } from "@/i18n/lang";
import { dayNumber, shiftDayKey } from "@/lib/day";
import { addKidsSticker, useProgress } from "@/lib/progress";

/** Two weeks of stickers: one for each day the family talked the question through. */
export function StickerChart({ dayKey }: { dayKey: string }) {
  const lang = useLang();
  const id = lang === "id";
  const progress = useProgress();
  const [justAdded, setJustAdded] = useState(false);
  const days = Array.from({ length: 14 }, (_, i) => shiftDayKey(dayKey, i - 13));
  const have = new Set(progress?.kidsStickers ?? []);
  const doneToday = have.has(dayKey);
  const total = progress?.kidsStickers.length ?? 0;

  return (
    <section className="sticker-section" aria-labelledby="stickers-title">
      <div className="doodle-head">
        <div>
          <span className="label">{id ? "Bagan stiker" : "Sticker chart"}</span>
          <h2 id="stickers-title">{id ? "Sudah kalian bicarakan?" : "Did you talk about it?"}</h2>
        </div>
        {progress && <p className="doodle-note">{id ? `${total} stiker sejauh ini` : `${total} ${total === 1 ? "sticker" : "stickers"} so far`}</p>}
      </div>
      <ol className="sticker-grid" aria-label={id ? "Dua minggu terakhir" : "The last two weeks"}>
        {days.map((d) => {
          const on = have.has(d);
          const shape = dayNumber(d) % 3;
          return (
            <li key={d} className={`${on ? `on shape-${shape}` : ""}${d === dayKey ? " is-today" : ""}${on && d === dayKey && justAdded ? " pop" : ""}`}>
              <span className="sr-only">
                {new Date(`${d}T12:00:00Z`).toLocaleDateString(dateLocale(lang), { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })}
                {on ? (id ? ": ada stiker" : ": sticker") : id ? ": belum ada stiker" : ": no sticker"}
              </span>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        className="btn btn-sage"
        disabled={!progress || doneToday}
        onClick={() => setJustAdded(addKidsSticker(dayKey))}
      >
        {doneToday
          ? id ? "Stiker hari ini sudah ditempel" : "Today’s sticker is on the chart"
          : id ? "Sudah kami bicarakan! Tempel stiker" : "We talked about it! Add a sticker"}
      </button>
    </section>
  );
}
