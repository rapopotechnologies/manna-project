import type { KidsDay } from "@/lib/kids";
import { formatDayLabel } from "@/lib/day";
import { renderCard, type CardLayout } from "@/lib/verse-card";

/** Today's Manna Kids question as a card, in the kids' room sage colors. */
export function renderKidsCard(day: KidsDay, layout: CardLayout, headers?: Record<string, string>) {
  return renderCard(
    {
      kicker: `Manna Kids · ${formatDayLabel(day.dayKey)}`,
      body: day.question,
      quote: false,
      caption: "Talk about it at dinner",
      url: "bymannaproject.com/kids",
      theme: "sage",
    },
    layout,
    headers,
  );
}
