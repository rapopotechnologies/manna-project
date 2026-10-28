import type { Metadata } from "next";
import Link from "next/link";
import { Countdown } from "@/components/daily/Countdown";
import { Reflect } from "@/components/daily/Reflect";
import { VerseActions } from "@/components/daily/VerseActions";
import { DayVariants } from "@/components/DayVariants";
import { DailyGather } from "@/components/progress/DailyGather";
import { TrackView } from "@/components/TrackView";
import { referenceId, tbUrl, TSI_COPYRIGHT, TSI_NAME, tsiChapterUrl } from "@/data/bible-id";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";
import { formatDayLabel } from "@/lib/day";
import { SITE_URL } from "@/lib/site";
import { chapterUrl, getTodaysManna, getVerseDays, type DailyVerse } from "@/lib/verse";

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

/** What the page shows for a verse: TSI on the Indonesian site when we have it, otherwise the NIV. */
export function shownVerse(verse: DailyVerse, lang: Lang) {
  if (lang === "id" && verse.tsi) return { text: verse.tsi.text, reference: verse.tsi.reference, version: verse.tsi.version, lang: "id" as const };
  return {
    text: verse.text,
    reference: lang === "id" ? referenceId(verse.reference) : verse.reference,
    version: verse.version,
    lang: "en" as const,
  };
}

export async function dailyMetadata(lang: Lang): Promise<Metadata> {
  const shown = shownVerse(await getTodaysManna(), lang);
  const ref = shown.reference;
  const description = `“${shown.text}” ${ref} (${shown.version})`;
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
          const shown = shownVerse(verse, lang);
          const isLong = shown.text.length > 220;
          const ref = shown.reference;
          const tb = lang === "id" ? tbUrl(verse.reference) : null;
          const showsTsi = shown.version === "TSI";
          return (
            <section className="window" aria-labelledby={`verse-heading-${day}`}>
              <span className="window-sun" aria-hidden="true" />
              <h2 id={`verse-heading-${day}`} className="window-date">{formatDayLabel(verse.dayKey, lang)}</h2>

              <blockquote className={`verse${isLong ? " is-long" : ""}`}>
                <p lang={shown.lang}>“{shown.text}”</p>
                <cite className="verse-ref">
                  {ref} · {shown.version}
                </cite>
              </blockquote>
              {lang === "id" && (
                <div className="verse-tb">
                  {showsTsi ? (
                    <details className="verse-niv">
                      <summary>Versi bahasa Inggris (NIV)</summary>
                      <p lang="en">“{verse.text}” <span className="verse-niv-ref">{verse.reference} · {verse.version}</span></p>
                    </details>
                  ) : (
                    <p>Ayat ini dalam bahasa Inggris (NIV).</p>
                  )}
                </div>
              )}

              <VerseActions
                dayKey={verse.dayKey}
                text={shown.text}
                reference={ref}
                version={shown.version}
                chapterHref={(showsTsi && tsiChapterUrl(verse.reference)) || chapterUrl(verse.reference, verse.version)}
                cardHref="/daily/card"
                shareUrl={`${SITE_URL}${L("/daily")}`}
                links={tb ? [{ href: tb, label: "Terjemahan Baru ↗" }] : []}
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
              {showsTsi && (
                <p className="verse-credit">
                  {TSI_NAME} (TSI) {TSI_COPYRIGHT}. Lewat{" "}
                  <a href="https://www.bible.com/versions/320" target="_blank" rel="noopener noreferrer">YouVersion</a>.
                </p>
              )}
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
