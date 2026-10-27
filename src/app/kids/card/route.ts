import type { NextRequest } from "next/server";
import { getTodaysQuestion } from "@/lib/kids";
import { renderKidsCard } from "@/lib/kids-card";
import { layoutFromRequest } from "@/lib/verse-card";

/** Image of today's Manna Kids question. Add ?format=story for Instagram Stories. */
export async function GET(request: NextRequest) {
  const layout = layoutFromRequest(request.nextUrl);
  const day = await getTodaysQuestion();
  return renderKidsCard(day, layout, {
    "Content-Disposition": `inline; filename="manna-kids-${day.dayKey}-${layout}.png"`,
    "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
  });
}
