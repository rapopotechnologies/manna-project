import { cacheLife } from "next/cache";
import { kidsQuestions } from "@/data/kids-questions";
import { dayKeyFor, dayNumber, shiftDayKey } from "@/lib/day";

export type KidsDay = {
  dayKey: string;
  question: string;
  number: number;
  yesterday: string;
};

const pick = (dayKey: string) => {
  const i = dayNumber(dayKey) % kidsQuestions.length;
  return { question: kidsQuestions[i], number: i + 1 };
};

/** Same question for every family on a given day, cycling through all 100. */
export async function getTodaysQuestion(): Promise<KidsDay> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  const dayKey = dayKeyFor(new Date());
  const today = pick(dayKey);
  return { dayKey, ...today, yesterday: pick(shiftDayKey(dayKey, -1)).question };
}
