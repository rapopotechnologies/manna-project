"use client";

import { DoodlePad } from "@/components/kids/DoodlePad";
import { StickerChart } from "@/components/progress/StickerChart";
import { useReaderDay } from "@/lib/use-reader-day";

type Day = { dayKey: string; question: string; dateLabel: string };

/** The sticker chart and doodle pad for the reader's own day. */
export function KidsTools({ days }: { days: Day[] }) {
  const picked = useReaderDay(days.map((d) => d.dayKey));
  const day = days.find((d) => d.dayKey === picked);
  if (!day) return null;
  return (
    <>
      <StickerChart key={`s-${day.dayKey}`} dayKey={day.dayKey} />
      <DoodlePad key={`d-${day.dayKey}`} dayKey={day.dayKey} question={day.question} dateLabel={day.dateLabel} />
    </>
  );
}
