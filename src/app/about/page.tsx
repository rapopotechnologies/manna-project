import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Manna Project makes modern, purposeful journals and stickers that make room for faith in a busy life.",
  alternates: { canonical: "/about" },
};

// Trimmed from the original About copy; wording kept where possible.
export default function AboutPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">About Manna Project</span>
        <h1>
          Life is more than <span className="brush">the daily grind</span>.
        </h1>
      </header>

      <div className="about">
        <div className="about-body">
          <p>
            In a world that celebrates busyness and endless productivity, Manna Project makes room for the deeper,
            more meaningful parts of life.
          </p>
          <p>
            We make modern, purposeful products: journals and stickers that work as daily companions. We love the
            satisfaction of crossing off a to-do list. We also love the quiet moments of reflection and the
            connection we find with God through our faith.
          </p>
          <p>Thank you for joining us on the way to a more purposeful, faith-centered life.</p>
        </div>

        <div className="halves">
          <section className="half">
            <h2>Cultivating faith</h2>
            <p>Small daily rhythms, like a verse in the morning and a question at dinner, that keep God close on busy days.</p>
          </section>
          <section className="half">
            <h2>Crafting grace</h2>
            <p>Thoughtfully designed bookmarks, trackers and stickers that turn quiet time into something you look forward to.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
