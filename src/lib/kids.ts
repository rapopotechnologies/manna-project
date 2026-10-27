import { cacheLife, cacheTag } from "next/cache";
import { CONTENT_TAGS, getKidsQuestions } from "@/lib/content";
import { dayKeyFor, dayNumber, shiftDayKey } from "@/lib/day";

export type KidsDay = {
  dayKey: string;
  question: string;
  number: number;
  total: number;
  yesterday: string;
};

/** Same question for every family on a given day, cycling through the whole list. */
export async function getTodaysQuestion(): Promise<KidsDay> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  cacheTag(CONTENT_TAGS.kids);
  const questions = await getKidsQuestions();
  const pick = (key: string) => {
    const i = dayNumber(key) % questions.length;
    return { question: questions[i], number: i + 1 };
  };
  const dayKey = dayKeyFor(new Date());
  return { dayKey, ...pick(dayKey), total: questions.length, yesterday: pick(shiftDayKey(dayKey, -1)).question };
}
