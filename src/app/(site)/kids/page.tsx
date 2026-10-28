import type { Metadata } from "next";
import { DoodlePad } from "@/components/kids/DoodlePad";
import { TrackView } from "@/components/TrackView";
import { StickerChart } from "@/components/progress/StickerChart";
import { KidsActions } from "@/components/kids/KidsActions";
import { formatDayLabel } from "@/lib/day";
import { getTodaysQuestion } from "@/lib/kids";

export async function generateMetadata(): Promise<Metadata> {
  const { question } = await getTodaysQuestion();
  return {
    title: "Manna Kids question of the day",
    description: question,
    alternates: { canonical: "/kids" },
    openGraph: { title: "Today’s Manna Kids question", description: question, url: "/kids" },
    twitter: { card: "summary_large_image", title: "Today’s Manna Kids question", description: question },
  };
}

export default async function KidsPage() {
  const { dayKey, question, number, total, yesterday } = await getTodaysQuestion();

  return (
    <div className="wrap kids-room">
      <TrackView metric="kids_view" />
      <header className="plaque">
        <span className="label">Manna Kids</span>
        <h1>
          Today’s <span className="brush">big question</span>
        </h1>
        <p className="lede">The same question for every family today, so you can ask it around the table.</p>
      </header>

      <section className="kids-board" aria-labelledby="kids-q">
        <div className="kids-meta">
          <span className="hand" style={{ fontSize: "1.6rem" }}>{formatDayLabel(dayKey)}</span>
          <span className="chip chip-sage">Question {number} of {total}</span>
        </div>
        <h2 id="kids-q" className="kids-question">{question}</h2>

        <KidsActions question={question} dayKey={dayKey} />

        <div className="kids-prompts">
          <div>
            <b>Say it</b>
            <p>Answer out loud at dinner or in the car.</p>
          </div>
          <div>
            <b>Draw it</b>
            <p>Draw your answer below, or in your Manna Kids journal.</p>
          </div>
          <div>
            <b>Thank God for it</b>
            <p>End with a one-line thank-you prayer.</p>
          </div>
        </div>
      </section>

      <StickerChart dayKey={dayKey} />

      <DoodlePad dayKey={dayKey} question={question} dateLabel={formatDayLabel(dayKey)} />

      <p className="yesterday">
        Yesterday’s question: <b>{yesterday}</b>
      </p>
    </div>
  );
}
