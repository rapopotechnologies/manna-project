import { getTodaysManna } from "@/lib/verse";
import { renderVerseCard } from "@/lib/verse-card";

export const alt = "Today’s verse from Manna Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const verse = await getTodaysManna();
  return renderVerseCard(verse, "landscape");
}
