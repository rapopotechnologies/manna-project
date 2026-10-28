import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL, SUPPORT_EMAIL } from "@/data/products";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function faqs(lang: Lang): { q: string; a: React.ReactNode }[] {
  const L = (path: string) => localPath(lang, path);
  if (lang === "id") {
    return [
      {
        q: "Di mana saya bisa membeli produk kalian?",
        a: (
          <>
            Di Indonesia, lewat <a href={SHOPEE_SHOP_URL} {...ext}>toko Shopee</a> kami. Di negara lain, lewat{" "}
            <a href={ETSY_SHOP_URL} {...ext}>toko Etsy</a> kami. Pembayaran dilakukan dengan aman di situs mereka.
          </>
        ),
      },
      {
        q: "Di mana file unduhan saya setelah membeli?",
        a: "File-mu langsung siap setelah pembelian. Kamu bisa menemukannya di daftar pembelian di Shopee atau Etsy, dan di bukti pembelian yang mereka kirim.",
      },
      {
        q: "Aplikasi apa yang bisa dipakai untuk produk digital?",
        a: "Bible Reading Tracker dan stiker digital bisa dipakai di GoodNotes dan aplikasi catatan serupa. Stikernya juga tersedia sebagai file PNG satuan. Pembatas buku berupa file PDF dan JPEG siap cetak di kertas A4.",
      },
      {
        q: "Apakah ayat hariannya gratis?",
        a: (
          <>
            Ya. <Link href={L("/daily")}>Ayat hari ini</Link>, <Link href={L("/kids")}>pertanyaan Manna Kids</Link>, dan
            renungannya gratis, tanpa perlu akun.
          </>
        ),
      },
      {
        q: "Kenapa ayatnya dalam bahasa Inggris?",
        a: "Ayat harian berasal dari OurManna.com dalam terjemahan NIV (bahasa Inggris). Di bawah setiap ayat ada tautan untuk membacanya dalam Terjemahan Baru (TB) di Bible.com. Ayat-ayat tersembunyi tetap memakai kata-kata saat pertama kali dibagikan, dan masing-masing diberi label terjemahannya.",
      },
      {
        q: "Kapan ayat baru muncul?",
        a: "Ayat baru berasal dari OurManna, yang terbit sekitar tengah malam UTC, jadi di Indonesia ayat baru muncul sekitar pukul 07.00 WIB. Pertanyaan Manna Kids berganti setiap tengah malam waktu setempat.",
      },
      {
        q: "Bisakah saya menaruh ayat hari ini di layar utama ponsel?",
        a: "Bisa. Di iPhone, buka ayatnya di Safari, ketuk Bagikan, lalu Tambahkan ke Layar Utama. Di Android, buka di Chrome, ketuk menu, lalu Tambahkan ke layar utama atau Instal aplikasi.",
      },
      {
        q: "Apakah renungan dan gambar saya bersifat pribadi?",
        a: "Ya. Catatan S.O.A.P., gambar anak-anak, dan ayat yang kamu temukan tersimpan di perangkatmu. Jika kamu membuat akun, progresmu juga tersimpan di akunmu supaya bisa dibuka di perangkat lain. Tidak ada orang lain yang bisa melihatnya.",
      },
    ];
  }
  return [
    {
      q: "Where do I buy your products?",
      a: (
        <>
          In Indonesia, through our <a href={SHOPEE_SHOP_URL} {...ext}>Shopee shop</a>. Everywhere else, through our{" "}
          <a href={ETSY_SHOP_URL} {...ext}>Etsy shop</a>. Checkout happens securely on their site.
        </>
      ),
    },
    {
      q: "Where are my downloads after I buy?",
      a: "Your files are ready right after purchase. You’ll find them in your purchases on Shopee or Etsy, and in the receipt they send you.",
    },
    {
      q: "Which apps work with the digital products?",
      a: "The Bible Reading Tracker and the digital stickers work with GoodNotes and similar note-taking apps. The stickers also come as individual PNG files. The bookmarks are printable PDF and JPEG files laid out on A4 pages.",
    },
    {
      q: "Is the daily verse free?",
      a: (
        <>
          Yes. <Link href="/daily">Today’s verse</Link>, the <Link href="/kids">Manna Kids question</Link> and the reflections are
          free, with no account needed.
        </>
      ),
    },
    {
      q: "Which Bible translation do you use?",
      a: "The daily verse is the NIV, provided by OurManna.com. The hidden verses keep the wording they were first shared in, and each one is labeled with its translation.",
    },
    {
      q: "When does a new verse appear?",
      a: "At midnight where you are. The verse comes from OurManna, which publishes at about midnight UTC, so in Asia it arrives a little later in the morning (around 7am in Jakarta). The kids’ question always changes at your own midnight.",
    },
    {
      q: "Can I put today’s verse on my home screen?",
      a: "Yes. On iPhone, open the verse in Safari, tap Share, then Add to Home Screen. On Android, open it in Chrome, tap the menu, then Add to Home screen or Install app.",
    },
    {
      q: "Are my reflections and drawings private?",
      a: "Yes. Your S.O.A.P. notes, kids’ drawings and found verses are saved on your device. If you create an account, your progress is also saved to it so you can pick up on another device. Nobody else can see it.",
    },
  ];
}

export function contactMetadata(lang: Lang): Metadata {
  return {
    title: lang === "id" ? "Kontak" : "Contact",
    description:
      lang === "id"
        ? "Hubungi Manna Project, dan jawaban untuk pertanyaan umum tentang pesanan dan ayat harian."
        : "Get in touch with Manna Project, and answers to common questions about orders and the daily verse.",
    alternates: langAlternates(lang, "/contact"),
  };
}

export function ContactView({ lang }: { lang: Lang }) {
  const id = lang === "id";
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{id ? "Kontak" : "Contact"}</span>
        <h1>
          {id ? (
            <>
              Silakan <span className="brush">masuk</span>.
            </>
          ) : (
            <>
              Come on <span className="brush">in</span>.
            </>
          )}
        </h1>
        <p className="lede">
          {id
            ? "Pertanyaan tentang pesanan, ide, atau sekadar menyapa: kami senang mendengar darimu."
            : "Questions about an order, ideas, or just a hello: we’d love to hear from you."}
        </p>
      </header>

      <div className="contact-grid">
        <section className="contact-card" aria-labelledby="email-us">
          <span className="label">Email</span>
          <h2 id="email-us">{id ? "Tulis kepada kami" : "Write to us"}</h2>
          <p className="contact-email selectable">{CONTACT_EMAIL}</p>
          <div className="porch-ctas">
            <CopyButton text={CONTACT_EMAIL} label={id ? "Salin email" : "Copy email"} className="btn btn-primary" />
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>{id ? "Buka aplikasi email" : "Open email app"}</a>
          </div>
        </section>

        <section className="contact-card contact-card-alt" aria-labelledby="orders">
          <span className="label">{id ? "Pesanan" : "Orders"}</span>
          <h2 id="orders">{id ? "Pertanyaan tentang pembelian atau akunmu?" : "Questions about a purchase or your account?"}</h2>
          <p>
            {id ? (
              <>
                Kirim email ke <span className="selectable">{SUPPORT_EMAIL}</span>, atau kirim pesan lewat Shopee atau Etsy supaya detail
                pesananmu ikut terkirim.
              </>
            ) : (
              <>
                Email <span className="selectable">{SUPPORT_EMAIL}</span>, or message us through Shopee or Etsy so your order details come
                with your question.
              </>
            )}
          </p>
          <div className="band-buttons">
            <a className="btn btn-gold" href={SHOPEE_SHOP_URL} {...ext}>Shopee (Indonesia) ↗</a>
            <a className="btn btn-gold" href={ETSY_SHOP_URL} {...ext}>{id ? "Etsy (seluruh dunia) ↗" : "Etsy (worldwide) ↗"}</a>
          </div>
        </section>
      </div>

      <section className="section" aria-labelledby="faq">
        <div className="section-head">
          <h2 id="faq">{id ? "Pertanyaan umum" : "Common questions"}</h2>
        </div>
        <div className="faq">
          {faqs(lang).map(({ q, a }) => (
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
