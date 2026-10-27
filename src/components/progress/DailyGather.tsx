"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bookFromReference } from "@/data/bible-books";
import { gatherToday, useProgress, weekView } from "@/lib/progress";
import { MannaJar } from "./MannaJar";
import { WeekRow } from "./WeekRow";

/**
 * Drops today's piece of manna into the reader's jar, and stamps the verse's book
 * on their shelf. Sits quietly below the verse, never in front of it.
 */
export function DailyGather({ dayKey, reference }: { dayKey: string; reference: string }) {
  const progress = useProgress();
  const [news, setNews] = useState<{ newPiece: boolean; newBook: string | null } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- record today's visit once, in the browser
    setNews(gatherToday(dayKey, bookFromReference(reference)));
  }, [dayKey, reference]);

  if (!progress) return null;
  const week = weekView(dayKey, progress.gathered);
  const books = Object.keys(progress.books).length;

  return (
    <Link href="/my-manna" className="tile gather-tile">
      <MannaJar pieces={week.count} dropLast={Boolean(news?.newPiece)} size={70} />
      <span>
        <b>Your manna jar</b>
        <small>
          {news?.newPiece ? "Gathered for today. " : ""}
          {week.count} this week{week.streak >= 2 ? ` · ${week.streak}-week streak` : ""}
          {news?.newBook ? ` · New on your shelf: ${news.newBook}` : ` · ${books} of 66 books`}
        </small>
        <WeekRow days={week.days} />
      </span>
    </Link>
  );
}
