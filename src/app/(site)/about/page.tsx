import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Manna Project makes modern, purposeful journals, bookmarks and stickers that make room for faith in a busy life.",
  alternates: { canonical: "/about" },
};

const shelf = [
  { src: "/journals/BRT/bible-reading-tracker-journal-3.jpg", alt: "A S.O.A.P. journal page from the Bible Reading Tracker" },
  { src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-4.jpg", alt: "Four styles of Book of the Bible bookmarks" },
  { src: "/stickers/basic_stickers/basic_stickers3.jpg", alt: "Digital stickers on a journal page" },
];

// The story is trimmed from the original About copy; wording kept where possible.
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
            We make modern, purposeful products: journals, bookmarks and stickers that work as daily companions. We
            love the satisfaction of crossing off a to-do list. We also love the quiet moments of reflection and the
            connection we find with God through our faith.
          </p>
          <p>
            Life isn’t only about getting things done. It’s also about finding grace in each moment, however busy the
            day. Thank you for joining us on the way to a more purposeful, faith-centered life.
          </p>
        </div>

        <aside className="about-name" aria-labelledby="why-manna">
          <span className="label">Why “manna”</span>
          <h2 id="why-manna">Enough for today</h2>
          <p>
            In Exodus 16, God gave His people manna each morning, enough for that day. That’s the idea behind
            everything here: a little, every day, rather than everything at once.
          </p>
        </aside>
      </div>

      <section className="section" aria-label="What Manna Project does">
        <div className="halves-grid">
          <article className="half-card">
            <span className="half-sun" aria-hidden="true" />
            <h2>Cultivating faith</h2>
            <p>Small daily rhythms that keep God close on busy days. All free, no account needed.</p>
            <ul className="fixtures">
              <li><Link href="/daily">A verse every morning</Link>, with a short S.O.A.P. reflection</li>
              <li><Link href="/kids">A question for the kids</Link> to talk about at dinner</li>
              <li>Ten hidden verses, tucked away for you to find</li>
            </ul>
          </article>
          <article className="half-card">
            <span className="half-sun half-sun-sage" aria-hidden="true" />
            <h2>Crafting grace</h2>
            <p>Thoughtfully designed tools that turn quiet time into something you look forward to.</p>
            <ul className="fixtures">
              <li><Link href="/shop/bible-reading-tracker">A Bible reading tracker</Link> and S.O.A.P. journal</li>
              <li><Link href="/shop/book-of-the-bible-bookmarks-bundle">Bookmarks</Link> for all 66 books of the Bible</li>
              <li><Link href="/shop#planners">Printable planners</Link> for your days, weeks and year</li>
              <li><Link href="/shop#stickers">Digital and vinyl stickers</Link> for journaling and everyday things</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="made">
        <div className="section-head">
          <div>
            <span className="label">From the workshop</span>
            <h2 id="made">Made by hand</h2>
          </div>
          <Link href="/shop">Visit the shop →</Link>
        </div>
        <div className="about-shelf">
          {shelf.map((img) => (
            <div className="product-photo" key={img.src}>
              <Image src={img.src} alt={img.alt} width={1000} height={800} sizes="(max-width: 760px) 100vw, 360px" />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="about-strip">
          <div>
            <span className="label">Say hello</span>
            <h2>Questions or ideas?</h2>
          </div>
          <div className="about-strip-copy">
            <p>We’d love to hear from you, whether it’s about an order or about how Manna Project fits into your day.</p>
            <Link className="btn" href="/contact">Get in touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
