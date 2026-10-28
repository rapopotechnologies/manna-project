"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { langOf, localPath, stripLang } from "@/i18n/lang";
import { readerLocalDay } from "@/lib/use-reader-day";
import { mannaForDay, type MannaPiece } from "@/lib/hidden-manna";
import { gatherHiddenManna, useProgress } from "@/lib/progress";

/**
 * Today's hidden manna on this page, tucked along the edge. Tap to gather.
 * "To the one who conquers I will give some of the hidden manna." Revelation 2:17
 */
export function HiddenManna() {
  const fullPath = usePathname();
  const lang = langOf(fullPath);
  // Pieces are placed by page, the same in both languages.
  const pathname = stripLang(fullPath);
  const progress = useProgress();
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [floating, setFloating] = useState<number | null>(null);
  const [note, setNote] = useState<{ count: number; total: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the reader's day is only known in the browser
    setDayKey(readerLocalDay());
  }, []);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 5000);
    return () => clearTimeout(t);
  }, [note]);

  if (!dayKey || !progress) return null;
  const { pieces } = mannaForDay(dayKey);
  const gathered = progress.manna[dayKey] ?? [];
  const here = pieces.filter((p) => p.path === pathname && (!gathered.includes(p.id) || p.id === floating));

  function gather(piece: MannaPiece) {
    const count = gatherHiddenManna(dayKey!, piece.id);
    if (!count) return;
    setFloating(piece.id);
    setTimeout(() => setFloating(null), 900);
    setNote({ count, total: pieces.length });
  }

  return (
    <>
      {here.map((piece) => (
        <button
          key={piece.id}
          type="button"
          className={`hidden-manna side-${piece.side}${floating === piece.id ? " is-gathered" : ""}`}
          style={{ top: `${piece.top}%` }}
          onClick={() => gather(piece)}
          aria-label={lang === "id" ? "Sebutir manna tersembunyi. Ketuk untuk mengumpulkannya." : "A piece of hidden manna. Tap to gather it."}
          title={lang === "id" ? "Manna tersembunyi" : "Hidden manna"}
        >
          <span aria-hidden="true" />
        </button>
      ))}
      {note && (
        <div className="manna-note" role="status">
          <span className="manna-note-flake" aria-hidden="true" />
          <span>
            {lang === "id" ? (
              <>
                <b>Manna tersembunyi terkumpul</b>
                {note.count} dari {note.total} hari ini
                {note.count === note.total ? ". Kamu menemukan semuanya!" : ""}
              </>
            ) : (
              <>
                <b>Hidden manna gathered</b>
                {note.count} of {note.total} today
                {note.count === note.total ? ". You found them all!" : ""}
              </>
            )}
          </span>
          <Link href={localPath(lang, "/my-manna")}>{lang === "id" ? "Toplesmu →" : "Your jar →"}</Link>
        </div>
      )}
    </>
  );
}
