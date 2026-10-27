import { getHiddenContent, getHiddenVerse } from "@/lib/content";
import { renderFoundCard } from "@/lib/found-card";

export const alt = "A hidden verse from Manna Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getHiddenContent()).verses.map((v) => ({ verse: v.slug }));
}

export default async function Image({ params }: { params: Promise<{ verse: string }> }) {
  const { verse: slug } = await params;
  const verse = (await getHiddenVerse(slug)) ?? (await getHiddenContent()).verses[0];
  return renderFoundCard(verse, "landscape");
}
