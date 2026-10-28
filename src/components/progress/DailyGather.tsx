"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bookFromReference } from "@/data/bible-books";
import { bookNameId } from "@/data/bible-id";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { gatherToday, useProgress, weekView } from "@/lib/progress";
import { readerLocalDay, useReaderDay } from "@/lib/use-reader-day";
import { MannaJar } from "./MannaJar";
import { WeekRow } from "./WeekRow";

/**
 * Drops today's piece of manna into the reader's jar, and stamps the verse's book
 * on their shelf. Sits quietly below the verse, never in front of it.
 */
export function DailyGather({ verses }: { verses: { dayKey: string; reference: string }[] }) {
  const lang = useLang();
  const progress = useProgress();
  const verseDay = useReaderDay(verses.map((v) => v.dayKey));
  const [news, setNews] = useState<{ newPiece: boolean; newBook: string | null } | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);

  useEffect(() => {
    if (!verseDay) return;
    const reference = verses.find((v) => v.dayKey === verseDay)?.reference ?? "";
    // The jar counts the reader's own mornings; the shelf gets the book of the verse they read.
    const local = readerLocalDay();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- record today's visit once, in the browser
    setDayKey(local);
    setNews(gatherToday(local, bookFromReference(reference)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once the reader's day is known
  }, [verseDay]);

  if (!progress || !dayKey) return null;
  const week = weekView(dayKey, progress.gathered);
  const books = Object.keys(progress.books).length;

  return (
    <Link href={localPath(lang, "/my-manna")} className="tile gather-tile">
      <MannaJar pieces={week.count} dropLast={Boolean(news?.newPiece)} size={70} />
      <span>
        <b>{lang === "id" ? "Toples manna-mu" : "Your manna jar"}</b>
        {lang === "id" ? (
          <small>
            {news?.newPiece ? "Sudah dikumpulkan hari ini. " : ""}
            {week.count} minggu ini{week.streak >= 2 ? ` · ${week.streak} minggu berturut-turut` : ""}
            {news?.newBook ? ` · Baru di rakmu: ${bookNameId(news.newBook)}` : ` · ${books} dari 66 kitab`}
          </small>
        ) : (
          <small>
            {news?.newPiece ? "Gathered for today. " : ""}
            {week.count} this week{week.streak >= 2 ? ` · ${week.streak}-week streak` : ""}
            {news?.newBook ? ` · New on your shelf: ${news.newBook}` : ` · ${books} of 66 books`}
          </small>
        )}
        <WeekRow days={week.days} />
      </span>
    </Link>
  );
}
