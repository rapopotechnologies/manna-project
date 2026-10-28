import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { CONTACT_EMAIL, ETSY_SHOP_URL } from "@/data/products";
import { getProducts } from "@/lib/content";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";
import { getTodaysQuestion } from "@/lib/kids";
import { getTodaysManna } from "@/lib/verse";

export default async function HomePage() {
  const [verse, kids, products] = await Promise.all([getTodaysManna(), getTodaysQuestion(), getProducts()]);
  const featured = products.filter((p) => p.featured);
  const picks = (featured.length ? featured : products).slice(0, 3);

  // Tells search engines who runs the site, for the name and logo shown in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/icon-512.png`,
        slogan: MOTTO,
        email: CONTACT_EMAIL,
        sameAs: [ETSY_SHOP_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Front porch */}
      <section className="porch">
        <div className="porch-lockup">
          <span className="porch-sun" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-ink" src="/brand/manna-lockup.png" alt="Manna Project: cultivating faith, crafting grace" width={1066} height={579} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-light" src="/brand/manna-lockup-light.png" alt="" aria-hidden="true" width={1066} height={579} />
        </div>
        <div className="porch-copy">
          <h1 className="porch-title">
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

      {/* Welcome mat: today's verse */}
      <Link className="welcome-mat sky" href="/daily">
        <span className="welcome-sun" aria-hidden="true" />
        <span>
          <span className="label">Today’s verse</span>
          <span className="welcome-verse">“{verse.text}”</span>
          <span className="welcome-ref">{verse.reference} · {verse.version}</span>
        </span>
        <span className="welcome-go">Read & reflect</span>
      </Link>

      {/* A day with Manna: the free rhythms, in the order of a day */}
      <section className="section" aria-labelledby="day">
        <div className="section-head">
          <div>
            <span className="label">Free, every day</span>
            <h2 id="day">A day with Manna</h2>
          </div>
        </div>
        <ol className="day-arc">
          <li className="day-stop day-stop-morning">
            <span className="day-now">Now</span>
            <span className="day-sun day-sun-morning" aria-hidden="true" />
            <span className="day-time">Morning</span>
            <b>Read today’s verse</b>
            <p>A new verse every day. Share it to your Instagram story in one tap.</p>
            <Link href="/daily">Open today’s verse →</Link>
          </li>
          <li className="day-stop day-stop-noon">
            <span className="day-now">Now</span>
            <span className="day-sun day-sun-noon" aria-hidden="true" />
            <span className="day-time">Any quiet moment</span>
            <b>Spend five minutes with it</b>
            <p>A short S.O.A.P. reflection: Scripture, Observation, Application, Prayer.</p>
            <Link href="/daily">Reflect on it →</Link>
          </li>
          <li className="day-stop day-stop-evening">
            <span className="day-now">Now</span>
            <span className="day-sun day-sun-evening" aria-hidden="true" />
            <span className="day-time">Dinner time</span>
            <b>Ask the kids</b>
            <p className="day-quote">“{kids.question}”</p>
            <Link href="/kids">Today’s Manna Kids question →</Link>
          </li>
        </ol>
      </section>

      {/* Workshop */}
      <section className="section" aria-labelledby="featured">
        <div className="section-head">
          <div>
            <span className="label">The workshop</span>
            <h2 id="featured">Tools for your quiet time</h2>
          </div>
          <Link href="/shop">See all {products.length} →</Link>
        </div>
        <div className="products">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Living room teaser */}
      <section className="section" aria-labelledby="about-teaser">
        <div className="about-strip">
          <div>
            <span className="label">About Manna Project</span>
            <h2 id="about-teaser">Life is more than the daily grind.</h2>
          </div>
          <div className="about-strip-copy">
            <p>
              We celebrate a crossed-off to-do list, and we also make room for the quiet moments with God that a busy
              day crowds out. Everything here is made to help with that.
            </p>
            <Link className="btn" href="/about">Read our story</Link>
          </div>
        </div>
        <p className="hidden-hint hand">
          Psst: ten verses are tucked away around Manna Project. Keep an eye out.
        </p>
      </section>
    </div>
  );
}
