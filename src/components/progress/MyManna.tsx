"use client";

import Link from "next/link";
import { AccountInvite } from "@/components/account/AccountInvite";
import { BOOKS } from "@/data/bible-books";
import { useProgress, weekView } from "@/lib/progress";
import { Bookshelf } from "./Bookshelf";
import { Garden } from "./Garden";
import { MannaJar } from "./MannaJar";
import { WeekRow } from "./WeekRow";

/** The reader's jar, shelf and garden. Everything comes from this browser's storage. */
export function MyManna({ today }: { today: string }) {
  const progress = useProgress();
  if (!progress) return <p className="lede">Gathering your jar…</p>;

  const week = weekView(today, progress.gathered);
  const shelfCount = BOOKS.filter((b) => progress.books[b.name]).length;
  const isNew = progress.gathered.length === 0;

  return (
    <div className="my-manna">
      {isNew && (
        <p className="notice-soft">
          Your jar is empty for now. Open <Link href="/daily">today’s verse</Link> and your first piece of manna drops in.
        </p>
      )}

      <section className="progress-card" aria-labelledby="jar-title">
        <div className="progress-head">
          <span className="label">The pantry</span>
          <h2 id="jar-title">Your manna jar</h2>
        </div>
        <div className="jar-layout">
          <MannaJar pieces={week.count} size={150} />
          <div className="jar-copy">
            <WeekRow days={week.days} />
            <p className="hand">
              {week.count} gathered this week
              {week.graceUsed ? ". One grace day used, and that’s okay." : "."}
            </p>
            <p className="muted-line">
              {progress.gathered.length} {progress.gathered.length === 1 ? "morning" : "mornings"} in all
              {week.streak >= 2 ? ` · ${week.streak} weeks in a row` : ""}
            </p>
            <p className="muted-line">
              No manna fell on the Sabbath, so one missed day a week never breaks your streak.
            </p>
          </div>
        </div>
      </section>

      <section className="progress-card" aria-labelledby="shelf-title">
        <div className="progress-head">
          <span className="label">The library</span>
          <h2 id="shelf-title">Your bookshelf: {shelfCount} of 66</h2>
        </div>
        <Bookshelf books={progress.books} />
        <p className="muted-line">Each day’s verse adds its book to your shelf.</p>
      </section>

      <section className="progress-card" aria-labelledby="garden-title">
        <div className="progress-head">
          <span className="label">The garden</span>
          <h2 id="garden-title">
            {progress.reflections.length} {progress.reflections.length === 1 ? "flower" : "flowers"} planted
          </h2>
        </div>
        <Garden days={progress.reflections} />
        <p className="muted-line">
          Finish a S.O.A.P. reflection on <Link href="/daily">today’s verse</Link> to plant a flower. Short or long, every one counts.
        </p>
      </section>

      <AccountInvite />
    </div>
  );
}
