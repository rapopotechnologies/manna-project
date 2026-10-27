import type { Metadata } from "next";
import { formatDayLabel } from "@/lib/day";
import { getTodaysQuestion } from "@/lib/kids";

export const metadata: Metadata = {
  title: "Manna Kids question of the day",
  description: "One question a day for kids to answer, draw, or talk about at the dinner table.",
  alternates: { canonical: "/kids" },
};

export default async function KidsPage() {
  const { dayKey, question, number, yesterday } = await getTodaysQuestion();

  return (
    <div className="wrap">
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
          <span className="chip">Question {number} of 100</span>
        </div>
        <h2 id="kids-q" className="kids-question">{question}</h2>

        <div className="kids-prompts">
          <div>
            <b>Say it</b>
            <p>Answer out loud at dinner or in the car.</p>
          </div>
          <div>
            <b>Draw it</b>
            <p>Draw your answer in your Manna Kids journal.</p>
          </div>
          <div>
            <b>Thank God for it</b>
            <p>End with a one-line thank-you prayer.</p>
          </div>
        </div>
      </section>

      <p className="yesterday">
        Yesterday’s question: <b>{yesterday}</b>
      </p>
    </div>
  );
}
