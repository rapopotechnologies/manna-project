import type { NextRequest } from "next/server";
import { getTodaysManna } from "@/lib/verse";
import { renderVerseCard, type CardLayout } from "@/lib/verse-card";

/**
 * Image of today's verse.
 *   /daily/card               Instagram feed post (1080×1350)
 *   /daily/card?format=story  Instagram story (1080×1920)
 */
export async function GET(request: NextRequest) {
  const layout: CardLayout = request.nextUrl.searchParams.get("format") === "story" ? "story" : "post";
  const verse = await getTodaysManna();
  return renderVerseCard(verse, layout, {
    "Content-Disposition": `inline; filename="manna-${verse.dayKey}-${layout}.png"`,
    "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
  });
}
