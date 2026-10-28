import type { Metadata } from "next";
import Link from "next/link";
import { DayVariants } from "@/components/DayVariants";
import { ProductCard } from "@/components/shop/ProductCard";
import { referenceId } from "@/data/bible-id";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL } from "@/data/products";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";
import { getProducts } from "@/lib/content";
import { getKidsDays } from "@/lib/kids";
import { MOTTO, MOTTO_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import { getVerseDays } from "@/lib/verse";

const T = {
  en: {
    lockupAlt: "Manna Project: cultivating faith, crafting grace",
    title: (
      <>
        Faith for the <span className="brush">everyday</span>.
      </>
    ),
    intro:
      "A verse every morning, a question for the kids at dinner, and handmade journaling tools to help you slow down with God in the middle of a full life.",
    readVerse: "Read today’s verse",
    browse: "Browse the shop",
    todaysVerse: "Today’s verse",
    readReflect: "Read & reflect",
    freeDaily: "Free, every day",
    dayTitle: "A day with Manna",
    now: "Now",
    morning: "Morning",
    morningTitle: "Read today’s verse",
    morningBody: "A new verse every day. Share it to your Instagram story or WhatsApp in one tap.",
    morningLink: "Open today’s verse →",
    noon: "Any quiet moment",
    noonTitle: "Spend five minutes with it",
    noonBody: "A short S.O.A.P. reflection: Scripture, Observation, Application, Prayer.",
    noonLink: "Reflect on it →",
    evening: "Dinner time",
    eveningTitle: "Ask the kids",
    eveningLink: "Today’s Manna Kids question →",
    workshop: "The workshop",
    workshopTitle: "Tools for your quiet time",
    seeAll: (n: number) => `See all ${n} →`,
    about: "About Manna Project",
    aboutTitle: "Life is more than the daily grind.",
    aboutBody:
      "We celebrate a crossed-off to-do list, and we also make room for the quiet moments with God that a busy day crowds out. Everything here is made to help with that.",
    story: "Read our story",
    hint: "Psst: ten verses are tucked away around Manna Project, and a little hidden manna falls on the site every morning. Keep an eye out.",
  },
  id: {
    lockupAlt: "Manna Project: menumbuhkan iman, merangkai anugerah",
    title: (
      <>
        Iman untuk <span className="brush">setiap hari</span>.
      </>
    ),
    intro:
      "Satu ayat setiap pagi, satu pertanyaan untuk anak-anak saat makan malam, dan alat jurnal buatan tangan untuk membantumu berhenti sejenak bersama Tuhan di tengah hidup yang sibuk.",
    readVerse: "Baca ayat hari ini",
    browse: "Lihat toko",
    todaysVerse: "Ayat hari ini",
    readReflect: "Baca & renungkan",
    freeDaily: "Gratis, setiap hari",
    dayTitle: "Sehari bersama Manna",
    now: "Sekarang",
    morning: "Pagi",
    morningTitle: "Baca ayat hari ini",
    morningBody: "Ayat baru setiap hari. Bagikan ke Instagram Story atau WhatsApp dengan sekali ketuk.",
    morningLink: "Buka ayat hari ini →",
    noon: "Saat teduh kapan saja",
    noonTitle: "Luangkan lima menit bersamanya",
    noonBody: "Renungan singkat dengan metode S.O.A.P.: Scripture (Firman), Observation (Pengamatan), Application (Penerapan), Prayer (Doa).",
    noonLink: "Renungkan →",
    evening: "Waktu makan malam",
    eveningTitle: "Tanya anak-anak",
    eveningLink: "Pertanyaan Manna Kids hari ini →",
    workshop: "Bengkel kami",
    workshopTitle: "Alat untuk saat teduhmu",
    seeAll: (n: number) => `Lihat semua ${n} →`,
    about: "Tentang Manna Project",
    aboutTitle: "Hidup lebih dari sekadar rutinitas.",
    aboutBody:
      "Kami ikut senang saat daftar tugas tercoret semua, tapi kami juga memberi ruang untuk saat-saat tenang bersama Tuhan yang sering tersisih oleh hari yang sibuk. Semua yang ada di sini dibuat untuk itu.",
    story: "Baca kisah kami",
    hint: "Psst: ada sepuluh ayat yang tersembunyi di sekitar Manna Project, dan sedikit manna tersembunyi turun di situs ini setiap pagi. Perhatikan baik-baik.",
  },
};

export function homeMetadata(lang: Lang): Metadata {
  if (lang === "en") return { alternates: langAlternates("en", "/") };
  return {
    title: { absolute: "Manna Project: ayat harian, pertanyaan untuk anak, dan alat jurnal Kristen" },
    description:
      "Satu ayat Alkitab setiap pagi, pertanyaan Manna Kids untuk keluarga, dan jurnal, planner, pembatas buku serta stiker Kristen buatan tangan.",
    alternates: langAlternates("id", "/"),
    openGraph: { locale: "id_ID", url: "/id" },
  };
}

export async function HomeView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  const [verseDays, kidsDays, products] = await Promise.all([getVerseDays(), getKidsDays(), getProducts()]);
  const verses = new Map(verseDays.days.map((v) => [v.dayKey, v]));
  const questions = new Map(kidsDays.days.map((d) => [d.dayKey, lang === "id" ? d.questionId : d.question]));
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
        slogan: lang === "id" ? MOTTO_ID : MOTTO,
        email: CONTACT_EMAIL,
        sameAs: [ETSY_SHOP_URL, SHOPEE_SHOP_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: ["en-US", "id-ID"],
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
          <img className="lockup-ink" src="/brand/manna-lockup.png" alt={t.lockupAlt} width={1066} height={579} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-light" src="/brand/manna-lockup-light.png" alt="" aria-hidden="true" width={1066} height={579} />
        </div>
        <div className="porch-copy">
          <h1 className="porch-title">{t.title}</h1>
          <p>{t.intro}</p>
          <div className="porch-ctas">
            <Link className="btn btn-primary" href={L("/daily")}>{t.readVerse}</Link>
            <Link className="btn" href={L("/shop")}>{t.browse}</Link>
          </div>
        </div>
      </section>

      {/* Welcome mat: today's verse */}
      <DayVariants
        group="mat"
        days={verseDays.days.map((v) => v.dayKey)}
        fallback={verseDays.days[verseDays.days.length - 1].dayKey}
        utcDay={verseDays.utcDay}
        render={(day) => {
          const verse = verses.get(day)!;
          return (
            <Link className="welcome-mat sky" href={L("/daily")}>
              <span className="welcome-sun" aria-hidden="true" />
              <span>
                <span className="label">{t.todaysVerse}</span>
                <span className="welcome-verse" lang="en">“{verse.text}”</span>
                <span className="welcome-ref">
                  {lang === "id" ? referenceId(verse.reference) : verse.reference} · {verse.version}
                </span>
              </span>
              <span className="welcome-go">{t.readReflect}</span>
            </Link>
          );
        }}
      />

      {/* A day with Manna: the free rhythms, in the order of a day */}
      <section className="section" aria-labelledby="day">
        <div className="section-head">
          <div>
            <span className="label">{t.freeDaily}</span>
            <h2 id="day">{t.dayTitle}</h2>
          </div>
        </div>
        <ol className="day-arc">
          <li className="day-stop day-stop-morning">
            <span className="day-now">{t.now}</span>
            <span className="day-sun day-sun-morning" aria-hidden="true" />
            <span className="day-time">{t.morning}</span>
            <b>{t.morningTitle}</b>
            <p>{t.morningBody}</p>
            <Link href={L("/daily")}>{t.morningLink}</Link>
          </li>
          <li className="day-stop day-stop-noon">
            <span className="day-now">{t.now}</span>
            <span className="day-sun day-sun-noon" aria-hidden="true" />
            <span className="day-time">{t.noon}</span>
            <b>{t.noonTitle}</b>
            <p>{t.noonBody}</p>
            <Link href={L("/daily")}>{t.noonLink}</Link>
          </li>
          <li className="day-stop day-stop-evening">
            <span className="day-now">{t.now}</span>
            <span className="day-sun day-sun-evening" aria-hidden="true" />
            <span className="day-time">{t.evening}</span>
            <b>{t.eveningTitle}</b>
            <DayVariants
              group="home-kids"
              days={kidsDays.days.map((d) => d.dayKey)}
              fallback={kidsDays.utcDay}
              utcDay={kidsDays.utcDay}
              render={(day) => <p className="day-quote">“{questions.get(day)}”</p>}
            />
            <Link href={L("/kids")}>{t.eveningLink}</Link>
          </li>
        </ol>
      </section>

      {/* Workshop */}
      <section className="section" aria-labelledby="featured">
        <div className="section-head">
          <div>
            <span className="label">{t.workshop}</span>
            <h2 id="featured">{t.workshopTitle}</h2>
          </div>
          <Link href={L("/shop")}>{t.seeAll(products.length)}</Link>
        </div>
        <div className="products">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} lang={lang} />
          ))}
        </div>
      </section>

      {/* Living room teaser */}
      <section className="section" aria-labelledby="about-teaser">
        <div className="about-strip">
          <div>
            <span className="label">{t.about}</span>
            <h2 id="about-teaser">{t.aboutTitle}</h2>
          </div>
          <div className="about-strip-copy">
            <p>{t.aboutBody}</p>
            <Link className="btn" href={L("/about")}>{t.story}</Link>
          </div>
        </div>
        <p className="hidden-hint hand">{t.hint}</p>
      </section>
    </div>
  );
}
