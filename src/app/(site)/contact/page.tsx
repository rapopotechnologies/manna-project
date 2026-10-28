import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SUPPORT_EMAIL } from "@/data/products";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Manna Project, and answers to common questions about orders and the daily verse.",
  alternates: { canonical: "/contact" },
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where do I buy your products?",
    a: (
      <>
        Everything is sold through our <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">Etsy shop</a>.
        Checkout happens securely on Etsy.
      </>
    ),
  },
  {
    q: "Where are my downloads after I buy?",
    a: "Your files are ready right after purchase. You’ll find them in your Etsy purchases and in the receipt email Etsy sends you.",
  },
  {
    q: "Which apps work with the digital products?",
    a: "The Bible Reading Tracker and the digital stickers work with GoodNotes and similar note-taking apps. The stickers also come as individual PNG files. The bookmarks are printable PDF and JPEG files laid out on A4 pages.",
  },
  {
    q: "Is the daily verse free?",
    a: (
      <>
        Yes. <Link href="/daily">Today’s verse</Link>, the <Link href="/kids">Manna Kids question</Link> and the
        reflections are free, with no account needed.
      </>
    ),
  },
  {
    q: "Which Bible translation do you use?",
    a: "The daily verse is the NIV, provided by OurManna.com. The hidden verses keep the wording they were first shared in, and each one is labeled with its translation.",
  },
  {
    q: "When does a new verse appear?",
    a: "At midnight Pacific time, every day. The kids’ question changes at the same time.",
  },
  {
    q: "Can I put today’s verse on my home screen?",
    a: "Yes. On iPhone, open the verse in Safari, tap Share, then Add to Home Screen. On Android, open it in Chrome, tap the menu, then Add to Home screen or Install app.",
  },
  {
    q: "Are my reflections and drawings private?",
    a: "Yes. Your S.O.A.P. notes, kids’ drawings and found verses are saved only on your own device. Nothing is sent to us.",
  },
];

export default function ContactPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Contact</span>
        <h1>
          Come on <span className="brush">in</span>.
        </h1>
        <p className="lede">Questions about an order, ideas, or just a hello: we’d love to hear from you.</p>
      </header>

      <div className="contact-grid">
        <section className="contact-card" aria-labelledby="email-us">
          <span className="label">Email</span>
          <h2 id="email-us">Write to us</h2>
          <p className="contact-email selectable">{CONTACT_EMAIL}</p>
          <div className="porch-ctas">
            <CopyButton text={CONTACT_EMAIL} label="Copy email" className="btn btn-primary" />
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>Open email app</a>
          </div>
        </section>

        <section className="contact-card contact-card-alt" aria-labelledby="orders">
          <span className="label">Orders</span>
          <h2 id="orders">Questions about a purchase or your account?</h2>
          <p>
            Email <span className="selectable">{SUPPORT_EMAIL}</span>, or message us through Etsy so your order details come with your
            question.
          </p>
          <a className="btn btn-gold" href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
            Go to our Etsy shop ↗
          </a>
        </section>
      </div>

      <section className="section" aria-labelledby="faq">
        <div className="section-head">
          <h2 id="faq">Common questions</h2>
        </div>
        <div className="faq">
          {faqs.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
