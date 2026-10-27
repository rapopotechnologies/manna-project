import type { Metadata } from "next";
import Link from "next/link";
import { Countdown } from "@/components/daily/Countdown";
import { Reflect } from "@/components/daily/Reflect";
import { VerseActions } from "@/components/daily/VerseActions";
import { formatDayLabel } from "@/lib/day";
import { SITE_URL } from "@/lib/site";
import { chapterUrl, getTodaysManna } from "@/lib/verse";

export async function generateMetadata(): Promise<Metadata> {
  const verse = await getTodaysManna();
  const description = `“${verse.text}” ${verse.reference} (${verse.version})`;
  return {
    title: "Today’s verse",
    description,
    alternates: { canonical: "/daily" },
    openGraph: { title: `Today’s verse: ${verse.reference}`, description, url: "/daily" },
    twitter: { card: "summary_large_image", title: `Today’s verse: ${verse.reference}`, description },
  };
}

export default async function DailyPage() {
  const verse = await getTodaysManna();
  const isLong = verse.text.length > 220;

  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Today’s manna</span>
        <h1>
          Enough for <span className="brush">today</span>.
        </h1>
      </header>

      <section className="window" aria-labelledby="verse-heading">
        <span className="window-sun" aria-hidden="true" />
        <h2 id="verse-heading" className="window-date">{formatDayLabel(verse.dayKey)}</h2>

        <blockquote className={`verse${isLong ? " is-long" : ""}`}>
          <p>“{verse.text}”</p>
          <cite className="verse-ref">
            {verse.reference} · {verse.version}
          </cite>
        </blockquote>

        <VerseActions
          text={verse.text}
          reference={verse.reference}
          version={verse.version}
          chapterHref={chapterUrl(verse.reference, verse.version)}
          cardHref="/daily/card"
          shareUrl={`${SITE_URL}/daily`}
        />

        <div className="window-foot">
          <Countdown />
          {verse.source === "ourmanna" ? (
            <span>
              Powered by{" "}
              <a href="https://www.ourmanna.com/" target="_blank" rel="noopener noreferrer">OurManna.com</a>
            </span>
          ) : (
            <span>From the Manna Project verse shelf</span>
          )}
        </div>
      </section>

      <div className="kitchen-below">
        <Reflect dayKey={verse.dayKey} />

        <aside className="shelf" aria-label="Keep going">
          <span className="label">Keep going</span>
          <Link className="tile" href="/shop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/journals/BRT/bible-reading-tracker-journal-2.jpg" alt="" width={88} height={88} />
            <span>
              <b>Bible Reading Tracker</b>
              <small>A weekly reading plan and S.O.A.P. journal for your tablet.</small>
            </span>
          </Link>
          <Link className="tile" href="/kids">
            <span className="tile-art" aria-hidden="true"><span /></span>
            <span>
              <b>Manna Kids question</b>
              <small>One question a day to talk about at the dinner table.</small>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
