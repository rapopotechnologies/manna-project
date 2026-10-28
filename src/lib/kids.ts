import { cacheLife, cacheTag } from "next/cache";
import { CONTENT_TAGS, getKidsQuestions, type KidsQuestion } from "@/lib/content";
import { dayNumber } from "@/lib/day";
import { addDays, isDayKey, possibleLocalDays, utcDayKey } from "@/lib/reader-day";

export type KidsDay = {
  dayKey: string;
  question: string;
  /** The question in Indonesian. */
  questionId: string;
  number: number;
  total: number;
  yesterday: string;
  yesterdayId: string;
};

export type KidsDays = { utcDay: string; days: KidsDay[] };

function dayFor(questions: KidsQuestion[], dayKey: string): KidsDay {
  const at = (key: string) => dayNumber(key) % questions.length;
  const i = at(dayKey);
  const y = questions[at(addDays(dayKey, -1))];
  return {
    dayKey,
    question: questions[i].en,
    questionId: questions[i].id,
    number: i + 1,
    total: questions.length,
    yesterday: y.en,
    yesterdayId: y.id,
  };
}

/**
 * The question for every date a reader could be on right now, so each family
 * gets a new question at their own midnight. The same question for everyone on a date.
 */
export async function getKidsDays(): Promise<KidsDays> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  cacheTag(CONTENT_TAGS.kids);
  const questions = await getKidsQuestions();
  const utcDay = utcDayKey(new Date());
  return { utcDay, days: possibleLocalDays(utcDay).map((d) => dayFor(questions, d)) };
}

/** Today's question by UTC date (link previews, default share image). */
export async function getTodaysQuestion(): Promise<KidsDay> {
  const { utcDay, days } = await getKidsDays();
  return days.find((d) => d.dayKey === utcDay) ?? days[1];
}

/** The question for a specific date (share images). */
export async function getQuestionForDay(day: string | null): Promise<KidsDay> {
  if (!isDayKey(day)) return getTodaysQuestion();
  return dayFor(await getKidsQuestions(), day);
}
