"use client";

import Link from "next/link";
import { AccountInvite } from "@/components/account/AccountInvite";
import { BOOKS } from "@/data/bible-books";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { readerLocalDay } from "@/lib/use-reader-day";
import { mannaForDay } from "@/lib/hidden-manna";
import { useProgress, weekView } from "@/lib/progress";
import { Bookshelf } from "./Bookshelf";
import { Garden } from "./Garden";
import { MannaJar } from "./MannaJar";
import { WeekRow } from "./WeekRow";

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const T = {
  en: {
    loading: "Gathering your jar…",
    empty: (link: React.ReactNode) => <>Your jar is empty for now. Open {link} and your first piece of manna drops in.</>,
    todaysVerse: "today’s verse",
    pantry: "The pantry",
    jar: "Your manna jar",
    week: (n: number, grace: boolean) => `${n} gathered this week${grace ? ". One grace day used, and that’s okay." : "."}`,
    mornings: (n: number) => `${n} ${plural(n, "morning", "mornings")} in all`,
    streak: (n: number) => ` · ${n} weeks in a row`,
    sabbathNote: "No manna fell on the Sabbath, so one missed day a week never breaks your streak.",
    hiddenLabel: "Hidden manna",
    sabbath: "Day off",
    gatheredToday: (n: number, total: number) => `${n} of ${total} gathered today`,
    noManna: "The manna’s taking a day off. Fresh pieces fall tomorrow morning.",
    allFound: "You found every piece today! Fresh ones fall tomorrow morning.",
    double: "Bonus Friday: twice as much fell today! ",
    look: "Pieces are hiding along the edges of pages around the site. Grab them before midnight, when they melt away.",
    hiddenTotal: (n: number) => `${n} gathered in all`,
    fullDays: (n: number) => ` · ${n} ${plural(n, "day", "days")} with every piece found`,
    tagline: "New hiding spots every morning.",
    library: "The library",
    shelf: (n: number) => `Your bookshelf: ${n} of 66`,
    shelfNote: "Each day’s verse adds its book to your shelf.",
    garden: "The garden",
    flowers: (n: number) => `${n} ${plural(n, "flower", "flowers")} planted`,
    gardenNote: (link: React.ReactNode) => <>Finish a S.O.A.P. reflection on {link} to plant a flower. Short or long, every one counts.</>,
  },
  id: {
    loading: "Menyiapkan toplesmu…",
    empty: (link: React.ReactNode) => <>Toplesmu masih kosong. Buka {link} dan butir manna pertamamu akan masuk.</>,
    todaysVerse: "ayat hari ini",
    pantry: "Dapur",
    jar: "Toples manna-mu",
    week: (n: number, grace: boolean) => `${n} terkumpul minggu ini${grace ? ". Satu hari anugerah terpakai, dan itu tidak apa-apa." : "."}`,
    mornings: (n: number) => `${n} pagi seluruhnya`,
    streak: (n: number) => ` · ${n} minggu berturut-turut`,
    sabbathNote: "Manna tidak turun pada hari Sabat, jadi satu hari terlewat dalam seminggu tidak memutus rangkaianmu.",
    hiddenLabel: "Manna tersembunyi",
    sabbath: "Hari libur",
    gatheredToday: (n: number, total: number) => `${n} dari ${total} terkumpul hari ini`,
    noManna: "Manna sedang libur hari ini. Butir baru turun besok pagi.",
    allFound: "Kamu menemukan semua butir hari ini! Yang baru turun besok pagi.",
    double: "Bonus Jumat: hari ini turun dua kali lipat! ",
    look: "Butir-butirnya bersembunyi di tepi halaman-halaman di situs ini. Ambil sebelum tengah malam, sebelum semuanya meleleh.",
    hiddenTotal: (n: number) => `${n} terkumpul seluruhnya`,
    fullDays: (n: number) => ` · ${n} hari dengan semua butir ditemukan`,
    tagline: "Tempat persembunyian baru setiap pagi.",
    library: "Perpustakaan",
    shelf: (n: number) => `Rak bukumu: ${n} dari 66`,
    shelfNote: "Setiap ayat harian menambahkan kitabnya ke rakmu.",
    garden: "Kebun",
    flowers: (n: number) => `${n} bunga ditanam`,
    gardenNote: (link: React.ReactNode) => <>Selesaikan renungan S.O.A.P. pada {link} untuk menanam bunga. Pendek atau panjang, semuanya berarti.</>,
  },
};

/** The reader's jar, shelf and garden. Everything comes from this browser's storage. */
export function MyManna() {
  const lang = useLang();
  const t = T[lang];
  const progress = useProgress();
  if (!progress) return <p className="lede">{t.loading}</p>;

  const verseLink = <Link href={localPath(lang, "/daily")}>{t.todaysVerse}</Link>;
  const today = readerLocalDay();
  const week = weekView(today, progress.gathered);
  const shelfCount = BOOKS.filter((b) => progress.books[b.name]).length;
  const isNew = progress.gathered.length === 0;
  // Same clock as the falling pieces (the reader's device), so the two always agree.
  const mannaDay = readerLocalDay();
  const hidden = mannaForDay(mannaDay);
  const foundToday = (progress.manna[mannaDay] ?? []).length;
  const hiddenTotal = Object.values(progress.manna).reduce((n, ids) => n + ids.length, 0);
  const fullDays = Object.entries(progress.manna).filter(([day, ids]) => {
    const n = mannaForDay(day).pieces.length;
    return n > 0 && ids.length >= n;
  }).length;

  return (
    <div className="my-manna">
      {isNew && <p className="notice-soft">{t.empty(verseLink)}</p>}

      <section className="progress-card" aria-labelledby="jar-title">
        <div className="progress-head">
          <span className="label">{t.pantry}</span>
          <h2 id="jar-title">{t.jar}</h2>
        </div>
        <div className="jar-layout">
          <MannaJar pieces={week.count} size={150} />
          <div className="jar-copy">
            <WeekRow days={week.days} />
            <p className="hand">{t.week(week.count, Boolean(week.graceUsed))}</p>
            <p className="muted-line">
              {t.mornings(progress.gathered.length)}
              {week.streak >= 2 ? t.streak(week.streak) : ""}
            </p>
            <p className="muted-line">{t.sabbathNote}</p>
          </div>
        </div>
      </section>

      <section className="progress-card hidden-manna-card" aria-labelledby="hidden-title">
        <div className="progress-head">
          <span className="label">{t.hiddenLabel}</span>
          <h2 id="hidden-title">{hidden.sabbath ? t.sabbath : t.gatheredToday(foundToday, hidden.pieces.length)}</h2>
        </div>
        {hidden.sabbath ? (
          <p className="muted-line">{t.noManna}</p>
        ) : (
          <>
            <div className="manna-dots" aria-hidden="true">
              {hidden.pieces.map((p) => (
                <i key={p.id} className={(progress.manna[mannaDay] ?? []).includes(p.id) ? "on" : undefined} />
              ))}
            </div>
            <p className="muted-line">
              {foundToday >= hidden.pieces.length ? t.allFound : `${hidden.double ? t.double : ""}${t.look}`}
            </p>
          </>
        )}
        <p className="muted-line">
          {t.hiddenTotal(hiddenTotal)}
          {fullDays ? t.fullDays(fullDays) : ""}
        </p>
        <p className="hand hidden-verse">{t.tagline}</p>
      </section>

      <section className="progress-card" aria-labelledby="shelf-title">
        <div className="progress-head">
          <span className="label">{t.library}</span>
          <h2 id="shelf-title">{t.shelf(shelfCount)}</h2>
        </div>
        <Bookshelf books={progress.books} />
        <p className="muted-line">{t.shelfNote}</p>
      </section>

      <section className="progress-card" aria-labelledby="garden-title">
        <div className="progress-head">
          <span className="label">{t.garden}</span>
          <h2 id="garden-title">{t.flowers(progress.reflections.length)}</h2>
        </div>
        <Garden days={progress.reflections} />
        <p className="muted-line">{t.gardenNote(verseLink)}</p>
      </section>

      <AccountInvite />
    </div>
  );
}
