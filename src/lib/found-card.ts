import type { HiddenVerse } from "@/data/hidden-verses";
import type { Lang } from "@/i18n/lang";
import { renderCard, type CardLayout } from "@/lib/verse-card";

/** A hidden verse as a card: "Found in the walls". */
export function renderFoundCard(verse: HiddenVerse, layout: CardLayout, headers?: Record<string, string>, lang: Lang = "en") {
  return renderCard(
    {
      kicker: lang === "id" ? "Ditemukan di balik dinding" : "Found in the walls",
      body: verse.lines.join(" "),
      quote: true,
      caption: `${verse.reference} · ${verse.translation}`,
      url: "bymannaproject.com",
    },
    layout,
    headers,
  );
}
