import type { NextRequest } from "next/server";
import { getVerseForDay } from "@/lib/verse";
import { langFromRequest, layoutFromRequest, renderVerseCard } from "@/lib/verse-card";

/**
 * Image of today's verse.
 *   /daily/card               Instagram feed post (1080×1350)
 *   /daily/card?format=story  Instagram story (1080×1920)
 *   add &lang=id for the Indonesian card
 */
export async function GET(request: NextRequest) {
  const layout = layoutFromRequest(request.nextUrl);
  const verse = await getVerseForDay(request.nextUrl.searchParams.get("d"));
  return renderVerseCard(
    verse,
    layout,
    {
      "Content-Disposition": `inline; filename="manna-${verse.dayKey}-${layout}.png"`,
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
    langFromRequest(request.nextUrl),
  );
}
