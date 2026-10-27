import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { getTodaysManna } from "@/lib/verse";

const featured = ["bible-reading-tracker", "book-of-the-bible-bookmarks-bundle", "floral-line-digital-stickers"];

export default async function HomePage() {
  const verse = await getTodaysManna();
  const picks = featured.map((slug) => products.find((p) => p.slug === slug)!).filter(Boolean);

  return (
    <div className="wrap">
      <section className="porch">
        <div className="porch-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-ink" src="/brand/manna-lockup.png" alt="Manna Project: cultivating faith, crafting grace" width={1066} height={579} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-light" src="/brand/manna-lockup-light.png" alt="" aria-hidden="true" width={1066} height={579} />
        </div>
        <div className="porch-copy">
          <h1 style={{ fontSize: "var(--t-3xl)" }}>
            Faith for the <span className="brush">everyday</span>.
          </h1>
          <p>
            A verse every morning, a question for the kids at dinner, and handmade journaling tools to help you slow
            down with God in the middle of a full life.
          </p>
          <div className="porch-ctas">
            <Link className="btn btn-primary" href="/daily">Read today’s verse</Link>
            <Link className="btn" href="/shop">Browse the shop</Link>
          </div>
        </div>
      </section>

      <Link className="welcome-mat" href="/daily">
        <span className="welcome-sun" aria-hidden="true" />
        <span>
          <span className="label">Today’s verse</span>
          <span className="welcome-verse">“{verse.text}”</span>
          <span className="welcome-ref">{verse.reference} · {verse.version}</span>
        </span>
        <span className="welcome-go">Read & reflect</span>
      </Link>

      <nav className="doors" aria-label="Explore">
        <Link className="door" href="/shop">
          <span className="door-knob" aria-hidden="true" />
          <b>Shop</b>
          <small>Bible bookmarks, a reading tracker and journaling stickers, made by hand.</small>
        </Link>
        <Link className="door" href="/kids">
          <span className="door-knob" aria-hidden="true" />
          <b>Manna Kids</b>
          <small>One question a day for kids to answer, draw, or talk through with you.</small>
        </Link>
        <Link className="door" href="/about">
          <span className="door-knob" aria-hidden="true" />
          <b>About</b>
          <small>Why Manna Project exists, and who makes it.</small>
        </Link>
      </nav>

      <section className="section" aria-labelledby="featured">
        <div className="section-head">
          <h2 id="featured">From the workshop</h2>
          <Link href="/shop">See everything →</Link>
        </div>
        <div className="products">
          {picks.map((p) => (
            <article className="product" key={p.slug}>
              <a className="product-photo" href={p.etsyUrl} target="_blank" rel="noopener noreferrer">
                <Image src={p.images[0]} alt={p.name} width={1000} height={800} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px" />
              </a>
              <span className="chip">{p.category}</span>
              <h3>{p.name}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
