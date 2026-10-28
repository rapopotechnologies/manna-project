// Hidden manna: small pieces that fall somewhere on the site each morning.
// Like Exodus 16: new every day, gone by tomorrow, double on the sixth day,
// none on the Sabbath. The same pieces for everyone on a given day.

import { dayNumber } from "@/lib/day";

/** Pages where manna can fall. */
const PAGES = ["/", "/daily", "/shop", "/kids", "/about", "/contact", "/support", "/my-manna", "/found"];

export type MannaPiece = {
  id: number;
  path: string;
  /** Which edge of the page it sits along. */
  side: "left" | "right";
  /** Distance down the page, as a percentage of the page height. */
  top: number;
};

/** 0 = Sunday … 6 = Saturday, for a YYYY-MM-DD day key. */
const weekday = (dayKey: string) => new Date(`${dayKey}T12:00:00Z`).getUTCDay();

export type MannaDay = { pieces: MannaPiece[]; sabbath: boolean; double: boolean };

/** Small seeded random generator, so every reader gets the same pieces on the same day. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mannaForDay(dayKey: string): MannaDay {
  const day = weekday(dayKey);
  const sabbath = day === 6; // Saturday: no manna fell (Exodus 16:26)
  const double = day === 5; // Friday: twice as much (Exodus 16:22)
  if (sabbath) return { pieces: [], sabbath, double };

  const count = double ? 6 : 3;
  const rand = seeded(dayNumber(dayKey) * 7919 + 17);
  const pages = [...PAGES];
  // Shuffle the pages, then drop the pieces onto the first few.
  for (let i = pages.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pages[i], pages[j]] = [pages[j], pages[i]];
  }
  const pieces: MannaPiece[] = Array.from({ length: count }, (_, id) => ({
    id,
    path: pages[id % pages.length],
    side: rand() < 0.5 ? "left" : "right",
    top: Math.round(12 + rand() * 76),
  }));
  return { pieces, sabbath, double };
}
