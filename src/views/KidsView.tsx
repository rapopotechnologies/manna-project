import type { Metadata } from "next";
import { DayVariants } from "@/components/DayVariants";
import { KidsActions } from "@/components/kids/KidsActions";
import { KidsTools } from "@/components/kids/KidsTools";
import { TrackView } from "@/components/TrackView";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";
import { formatDayLabel } from "@/lib/day";
import { getKidsDays, getTodaysQuestion } from "@/lib/kids";

const T = {
  en: {
    metaTitle: "Manna Kids question of the day",
    ogTitle: "Today’s Manna Kids question",
    title: (
      <>
        Today’s <span className="brush">big question</span>
      </>
    ),
    lede: "The same question for every family today, so you can ask it around the table.",
    number: (n: number, total: number) => `Question ${n} of ${total}`,
    say: "Say it",
    sayNote: "Answer out loud at dinner or in the car.",
    draw: "Draw it",
    drawNote: "Draw your answer below, or in your Manna Kids journal.",
    thank: "Thank God for it",
    thankNote: "End with a one-line thank-you prayer.",
    yesterday: "Yesterday’s question:",
  },
  id: {
    metaTitle: "Pertanyaan Manna Kids hari ini",
    ogTitle: "Pertanyaan Manna Kids hari ini",
    title: (
      <>
        <span className="brush">Pertanyaan besar</span> hari ini
      </>
    ),
    lede: "Pertanyaan yang sama untuk setiap keluarga hari ini, supaya bisa kalian bicarakan di meja makan.",
    number: (n: number, total: number) => `Pertanyaan ${n} dari ${total}`,
    say: "Ucapkan",
    sayNote: "Jawab dengan suara keras saat makan malam atau di mobil.",
    draw: "Gambarkan",
    drawNote: "Gambar jawabanmu di bawah ini, atau di jurnal Manna Kids-mu.",
    thank: "Bersyukurlah kepada Tuhan",
    thankNote: "Tutup dengan doa syukur satu kalimat.",
    yesterday: "Pertanyaan kemarin:",
  },
};

export async function kidsMetadata(lang: Lang): Promise<Metadata> {
  const t = T[lang];
  const day = await getTodaysQuestion();
  const question = lang === "id" ? day.questionId : day.question;
  const base = {
    title: t.metaTitle,
    description: question,
    alternates: langAlternates(lang, "/kids"),
    openGraph: { title: t.ogTitle, description: question, url: localPath(lang, "/kids") },
    twitter: { card: "summary_large_image" as const, title: t.ogTitle, description: question },
  };
  if (lang === "en") return base;
  const images = [{ url: "/kids/card?format=landscape&lang=id", width: 1200, height: 630, alt: t.ogTitle }];
  return { ...base, openGraph: { ...base.openGraph, locale: "id_ID", images }, twitter: { ...base.twitter, images } };
}

export async function KidsView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { utcDay, days } = await getKidsDays();
  const byDay = new Map(days.map((d) => [d.dayKey, d]));
  const q = (d: (typeof days)[number]) => (lang === "id" ? d.questionId : d.question);

  return (
    <div className="wrap kids-room">
      <TrackView metric="kids_view" />
      <header className="plaque">
        <span className="label">Manna Kids</span>
        <h1>{t.title}</h1>
        <p className="lede">{t.lede}</p>
      </header>

      {/* A new question at each family's own midnight. */}
      <DayVariants
        group="kids"
        days={days.map((d) => d.dayKey)}
        fallback={utcDay}
        utcDay={utcDay}
        render={(dayKey) => {
          const day = byDay.get(dayKey)!;
          return (
            <section className="kids-board" aria-labelledby={`kids-q-${dayKey}`}>
              <div className="kids-meta">
                <span className="hand" style={{ fontSize: "1.6rem" }}>{formatDayLabel(dayKey, lang)}</span>
                <span className="chip chip-sage">{t.number(day.number, day.total)}</span>
              </div>
              <h2 id={`kids-q-${dayKey}`} className="kids-question">{q(day)}</h2>

              <KidsActions question={q(day)} dayKey={dayKey} />

              <div className="kids-prompts">
                <div>
                  <b>{t.say}</b>
                  <p>{t.sayNote}</p>
                </div>
                <div>
                  <b>{t.draw}</b>
                  <p>{t.drawNote}</p>
                </div>
                <div>
                  <b>{t.thank}</b>
                  <p>{t.thankNote}</p>
                </div>
              </div>
            </section>
          );
        }}
      />

      <KidsTools days={days.map((d) => ({ dayKey: d.dayKey, question: q(d), dateLabel: formatDayLabel(d.dayKey, lang) }))} />

      <DayVariants
        group="kids-yesterday"
        days={days.map((d) => d.dayKey)}
        fallback={utcDay}
        utcDay={utcDay}
        render={(dayKey) => {
          const day = byDay.get(dayKey)!;
          return (
            <p className="yesterday">
              {t.yesterday} <b>{lang === "id" ? day.yesterdayId : day.yesterday}</b>
            </p>
          );
        }}
      />
    </div>
  );
}
