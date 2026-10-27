import type { NextRequest } from "next/server";
import { getHiddenVerse } from "@/lib/content";
import { renderFoundCard } from "@/lib/found-card";
import { layoutFromRequest } from "@/lib/verse-card";

/** Image of a hidden verse. Add ?format=story for Instagram Stories. */
export async function GET(request: NextRequest, { params }: RouteContext<"/found/[verse]/card">) {
  const { verse: slug } = await params;
  const verse = await getHiddenVerse(slug);
  if (!verse) return new Response("Not found", { status: 404 });
  const layout = layoutFromRequest(request.nextUrl);
  return renderFoundCard(verse, layout, {
    "Content-Disposition": `inline; filename="manna-${slug}-${layout}.png"`,
    "Cache-Control": "public, max-age=86400, s-maxage=86400",
  });
}
