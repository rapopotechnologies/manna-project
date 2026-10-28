import type { KidsDay } from "@/lib/kids";
import type { Lang } from "@/i18n/lang";
import { formatDayLabel } from "@/lib/day";
import { renderCard, type CardLayout } from "@/lib/verse-card";

/** Today's Manna Kids question as a card, in the kids' room sage colors. */
export function renderKidsCard(day: KidsDay, layout: CardLayout, headers?: Record<string, string>, lang: Lang = "en") {
  const id = lang === "id";
  return renderCard(
    {
      kicker: `Manna Kids · ${formatDayLabel(day.dayKey, lang)}`,
      body: id ? day.questionId : day.question,
      quote: false,
      caption: id ? "Bicarakan saat makan malam" : "Talk about it at dinner",
      url: id ? "bymannaproject.com/id/kids" : "bymannaproject.com/kids",
      theme: "sage",
    },
    layout,
    headers,
  );
}
