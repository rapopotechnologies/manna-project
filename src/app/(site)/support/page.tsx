import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL } from "@/data/products";

export const metadata: Metadata = {
  title: "Support Manna Project",
  description:
    "Help keep Manna Project free, and support children’s education and Christians, schools and churches in Indonesia.",
  alternates: { canonical: "/support" },
};

// The Stripe giving form (one-time and monthly, $3 / $7 / $15 / custom) goes at the
// top of this page once Stripe is connected through the Vercel Marketplace.
export default function SupportPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Support Manna Project</span>
        <h1>
          Help keep the <span className="brush">manna</span> coming.
        </h1>
        <p className="lede">
          Everything here is free: the daily verse, the kids’ question, the reflections. Your support keeps it that
          way, and helps us serve communities in Indonesia.
        </p>
      </header>

      <section aria-labelledby="where">
        <div className="section-head">
          <h2 id="where">Where your support goes</h2>
        </div>
        <div className="give-reasons">
          <article>
            <span className="half-sun" aria-hidden="true" />
            <h3>Keeping Manna Project free</h3>
            <p>A verse every morning and a question for the kids, free for everyone, with no account and no ads.</p>
          </article>
          <article>
            <span className="half-sun half-sun-sage" aria-hidden="true" />
            <h3>Children’s education in Indonesia</h3>
            <p>Supporting children’s education in some of the poorest communities in Indonesia.</p>
          </article>
          <article>
            <span className="half-sun half-sun-olive" aria-hidden="true" />
            <h3>Equipping Christians, schools and churches</h3>
            <p>Putting our journals and bookmarks into the hands of Christians, schools and churches there.</p>
          </article>
        </div>
        <p className="give-note">
          Manna Project isn’t a registered nonprofit, so gifts aren’t tax-deductible.
        </p>
      </section>

      <section className="section" aria-labelledby="other-ways">
        <div className="section-head">
          <h2 id="other-ways">Other ways to help</h2>
        </div>
        <div className="doors">
          <div className="door door-static">
            <span className="door-knob" aria-hidden="true" />
            <b>Shop our products</b>
            <small>Every bookmark, tracker and sticker pack you buy supports the work.</small>
            <span className="door-links">
              <a href={SHOPEE_SHOP_URL} target="_blank" rel="noopener noreferrer">Shopee (Indonesia) ↗</a>
              <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">Etsy (worldwide) ↗</a>
            </span>
          </div>
          <Link className="door" href="/daily">
            <span className="door-knob" aria-hidden="true" />
            <b>Share today’s verse</b>
            <small>Post it to your Instagram story in one tap and invite someone in.</small>
          </Link>
          <Link className="door" href="/contact">
            <span className="door-knob" aria-hidden="true" />
            <b>Partner with us</b>
            <small>Know a school or church that could use our products? Write to {CONTACT_EMAIL}.</small>
          </Link>
        </div>
      </section>
    </div>
  );
}
