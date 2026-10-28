import type { Metadata } from "next";
import Link from "next/link";
import { Countdown } from "@/components/daily/Countdown";
import { Reflect } from "@/components/daily/Reflect";
import { VerseActions } from "@/components/daily/VerseActions";
import { DayVariants } from "@/components/DayVariants";
import { DailyGather } from "@/components/progress/DailyGather";
import { TrackView } from "@/components/TrackView";
import { referenceId, tbUrl } from "@/data/bible-id";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";
import { formatDayLabel } from "@/lib/day";
import { SITE_URL } from "@/lib/site";
import { chapterUrl, getTodaysManna, getVerseDays } from "@/lib/verse";

const T = {
  en: {
    kicker: "Today’s manna",
    title: (
      <>
        Enough for <span className="brush">today</span>.
      </>
    ),
    powered: "Powered by",
    shelf: "From the Manna Project verse shelf",
    keepGoing: "Keep going",
    tracker: "Bible Reading Tracker",
    trackerNote: "A weekly reading plan and S.O.A.P. journal for your tablet.",
    kids: "Manna Kids question",
    kidsNote: "One question a day to talk about at the dinner table.",
  },
  id: {
    kicker: "Manna hari ini",
    title: (
      <>
        Cukup untuk <span className="brush">hari ini</span>.
      </>
    ),
    powered: "Dari",
    shelf: "Dari rak ayat Manna Project",
    keepGoing: "Lanjutkan",
    tracker: "Bible Reading Tracker",
    trackerNote: "Rencana baca mingguan dan jurnal S.O.A.P. untuk tabletmu.",
    kids: "Pertanyaan Manna Kids",
    kidsNote: "Satu pertanyaan sehari untuk dibicarakan di meja makan.",
  },
};

export async function dailyMetadata(lang: Lang): Promise<Metadata> {
  const verse = await getTodaysManna();
  const ref = lang === "id" ? referenceId(verse.reference) : verse.reference;
  const description = `“${verse.text}” ${ref} (${verse.version})`;
  const title = lang === "id" ? "Ayat hari ini" : "Today’s verse";
  const ogTitle = `${title}: ${ref}`;
  const base = {
    title,
    description,
    alternates: langAlternates(lang, "/daily"),
    openGraph: { title: ogTitle, description, url: localPath(lang, "/daily") },
    twitter: { card: "summary_large_image" as const, title: ogTitle, description },
  };
  if (lang === "en") return base;
  const images = [{ url: `/daily/card?format=landscape&lang=id`, width: 1200, height: 630, alt: "Ayat hari ini dari Manna Project" }];
  return { ...base, openGraph: { ...base.openGraph, locale: "id_ID", images }, twitter: { ...base.twitter, images } };
}

export async function DailyView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  const { utcDay, days } = await getVerseDays();
  const newest = days[days.length - 1];
  const byDay = new Map(days.map((v) => [v.dayKey, v]));

  return (
    <div className="wrap">
      <TrackView metric="verse_view" />
      <header className="plaque">
        <span className="label">{t.kicker}</span>
        <h1>{t.title}</h1>
      </header>

      {/* One window per day; each reader sees their own day (see DayVariants). */}
      <DayVariants
        group="verse"
        days={days.map((v) => v.dayKey)}
        fallback={newest.dayKey}
        utcDay={utcDay}
        render={(day) => {
          const verse = byDay.get(day)!;
          const isLong = verse.text.length > 220;
          const ref = lang === "id" ? referenceId(verse.reference) : verse.reference;
          const tb = lang === "id" ? tbUrl(verse.reference) : null;
          return (
            <section className="window" aria-labelledby={`verse-heading-${day}`}>
              <span className="window-sun" aria-hidden="true" />
              <h2 id={`verse-heading-${day}`} className="window-date">{formatDayLabel(verse.dayKey, lang)}</h2>

              <blockquote className={`verse${isLong ? " is-long" : ""}`}>
                <p lang="en">“{verse.text}”</p>
                <cite className="verse-ref">
                  {ref} · {verse.version}
                </cite>
              </blockquote>
              {tb && (
                <p className="verse-tb">
                  Ayat ini dalam bahasa Inggris (NIV).{" "}
                  <a href={tb} target="_blank" rel="noopener noreferrer">Baca {ref} dalam Terjemahan Baru ↗</a>
                </p>
              )}

              <VerseActions
                dayKey={verse.dayKey}
                text={verse.text}
                reference={ref}
                version={verse.version}
                chapterHref={chapterUrl(verse.reference, verse.version)}
                cardHref="/daily/card"
                shareUrl={`${SITE_URL}${L("/daily")}`}
              />

              <div className="window-foot">
                <Countdown />
                {verse.source === "ourmanna" ? (
                  <span>
                    {t.powered}{" "}
                    <a href="https://www.ourmanna.com/" target="_blank" rel="noopener noreferrer">OurManna.com</a>
                  </span>
                ) : (
                  <span>{t.shelf}</span>
                )}
              </div>
            </section>
          );
        }}
      />

      <div className="kitchen-below">
        <Reflect verseDays={days.map((v) => v.dayKey)} />

        <aside className="shelf" aria-label={t.keepGoing}>
          <span className="label">{t.keepGoing}</span>
          <DailyGather verses={days.map((v) => ({ dayKey: v.dayKey, reference: v.reference }))} />
          <Link className="tile" href={L("/shop/bible-reading-tracker")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/journals/BRT/bible-reading-tracker-journal-2.jpg" alt="" width={88} height={88} />
            <span>
              <b>{t.tracker}</b>
              <small>{t.trackerNote}</small>
            </span>
          </Link>
          <Link className="tile" href={L("/kids")}>
            <span className="tile-art" aria-hidden="true"><span /></span>
            <span>
              <b>{t.kids}</b>
              <small>{t.kidsNote}</small>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
