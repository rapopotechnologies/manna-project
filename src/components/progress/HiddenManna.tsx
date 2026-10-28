"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { dayKeyFor } from "@/lib/day";
import { mannaForDay, type MannaPiece } from "@/lib/hidden-manna";
import { gatherHiddenManna, useProgress } from "@/lib/progress";

/**
 * Today's hidden manna on this page, tucked along the edge. Tap to gather.
 * "To the one who conquers I will give some of the hidden manna." Revelation 2:17
 */
export function HiddenManna() {
  const pathname = usePathname();
  const progress = useProgress();
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [floating, setFloating] = useState<number | null>(null);
  const [note, setNote] = useState<{ count: number; total: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the reader's day is only known in the browser
    setDayKey(dayKeyFor(new Date()));
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
          aria-label="A piece of hidden manna. Tap to gather it."
          title="Hidden manna"
        >
          <span aria-hidden="true" />
        </button>
      ))}
      {note && (
        <div className="manna-note" role="status">
          <span className="manna-note-flake" aria-hidden="true" />
          <span>
            <b>Hidden manna gathered</b>
            {note.count} of {note.total} today
            {note.count === note.total ? ". You found them all!" : ""}
          </span>
          <Link href="/my-manna">Your jar →</Link>
        </div>
      )}
    </>
  );
}
