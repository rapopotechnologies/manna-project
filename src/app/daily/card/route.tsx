import { getTodaysManna } from "@/lib/verse";
import { renderVerseCard } from "@/lib/verse-card";

/** Portrait image of today's verse, sized for Instagram stories and texts. */
export async function GET() {
  const verse = await getTodaysManna();
  return renderVerseCard(verse, "portrait", {
    "Content-Disposition": `inline; filename="manna-${verse.dayKey}.png"`,
    "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
  });
}
