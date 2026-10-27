import { getTodaysQuestion } from "@/lib/kids";
import { renderKidsCard } from "@/lib/kids-card";

export const alt = "Today’s Manna Kids question";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderKidsCard(await getTodaysQuestion(), "landscape");
}
