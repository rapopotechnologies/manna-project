import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL } from "@/data/products";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";

const T = {
  en: {
    metaTitle: "Support Manna Project",
    metaDesc: "Help keep Manna Project free, and support children’s education and Christians, schools and churches in Indonesia.",
    label: "Support Manna Project",
    title: (
      <>
        Help keep the <span className="brush">manna</span> coming.
      </>
    ),
    lede: "Everything here is free: the daily verse, the kids’ question, the reflections. Your support keeps it that way, and helps us serve communities in Indonesia.",
    where: "Where your support goes",
    free: "Keeping Manna Project free",
    freeNote: "A verse every morning and a question for the kids, free for everyone, with no account and no ads.",
    edu: "Children’s education in Indonesia",
    eduNote: "Supporting children’s education in some of the poorest communities in Indonesia.",
    equip: "Equipping Christians, schools and churches",
    equipNote: "Putting our journals and bookmarks into the hands of Christians, schools and churches there.",
    note: "Manna Project isn’t a registered nonprofit, so gifts aren’t tax-deductible.",
    other: "Other ways to help",
    shop: "Shop our products",
    shopNote: "Every bookmark, tracker and sticker pack you buy supports the work.",
    etsy: "Etsy (worldwide) ↗",
    share: "Share today’s verse",
    shareNote: "Send it on WhatsApp or post it to your Instagram story in one tap, and invite someone in.",
    partner: "Partner with us",
    partnerNote: (email: string) => `Know a school or church that could use our products? Write to ${email}.`,
  },
  id: {
    metaTitle: "Dukung Manna Project",
    metaDesc:
      "Bantu Manna Project tetap gratis, dan dukung pendidikan anak-anak serta umat Kristen, sekolah, dan gereja di Indonesia.",
    label: "Dukung Manna Project",
    title: (
      <>
        Bantu agar <span className="brush">manna</span> terus turun.
      </>
    ),
    lede: "Semua yang ada di sini gratis: ayat harian, pertanyaan untuk anak, dan renungannya. Dukunganmu menjaganya tetap gratis, dan membantu kami melayani komunitas di Indonesia.",
    where: "Ke mana dukunganmu disalurkan",
    free: "Menjaga Manna Project tetap gratis",
    freeNote: "Satu ayat setiap pagi dan satu pertanyaan untuk anak-anak, gratis untuk semua orang, tanpa akun dan tanpa iklan.",
    edu: "Pendidikan anak-anak di Indonesia",
    eduNote: "Mendukung pendidikan anak-anak di beberapa komunitas termiskin di Indonesia.",
    equip: "Memperlengkapi umat Kristen, sekolah, dan gereja",
    equipNote: "Menyalurkan jurnal dan pembatas buku kami ke tangan umat Kristen, sekolah, dan gereja di sana.",
    note: "Manna Project bukan lembaga nirlaba terdaftar, jadi pemberian tidak dapat dikurangkan dari pajak.",
    other: "Cara lain untuk membantu",
    shop: "Belanja produk kami",
    shopNote: "Setiap pembatas buku, tracker, dan paket stiker yang kamu beli ikut mendukung pelayanan ini.",
    etsy: "Etsy (seluruh dunia) ↗",
    share: "Bagikan ayat hari ini",
    shareNote: "Kirim lewat WhatsApp atau unggah ke Instagram Story dengan sekali ketuk, dan ajak orang lain ikut.",
    partner: "Bermitra dengan kami",
    partnerNote: (email: string) => `Kenal sekolah atau gereja yang bisa memakai produk kami? Tulis ke ${email}.`,
  },
};

export function supportMetadata(lang: Lang): Metadata {
  return { title: T[lang].metaTitle, description: T[lang].metaDesc, alternates: langAlternates(lang, "/support") };
}

// The giving form (one-time and monthly) goes at the top of this page once payments are connected.
export function SupportView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{t.label}</span>
        <h1>{t.title}</h1>
        <p className="lede">{t.lede}</p>
      </header>

      <section aria-labelledby="where">
        <div className="section-head">
          <h2 id="where">{t.where}</h2>
        </div>
        <div className="give-reasons">
          <article>
            <span className="half-sun" aria-hidden="true" />
            <h3>{t.free}</h3>
            <p>{t.freeNote}</p>
          </article>
          <article>
            <span className="half-sun half-sun-sage" aria-hidden="true" />
            <h3>{t.edu}</h3>
            <p>{t.eduNote}</p>
          </article>
          <article>
            <span className="half-sun half-sun-olive" aria-hidden="true" />
            <h3>{t.equip}</h3>
            <p>{t.equipNote}</p>
          </article>
        </div>
        <p className="give-note">{t.note}</p>
      </section>

      <section className="section" aria-labelledby="other-ways">
        <div className="section-head">
          <h2 id="other-ways">{t.other}</h2>
        </div>
        <div className="doors">
          <div className="door door-static">
            <span className="door-knob" aria-hidden="true" />
            <b>{t.shop}</b>
            <small>{t.shopNote}</small>
            <span className="door-links">
              <a href={SHOPEE_SHOP_URL} target="_blank" rel="noopener noreferrer">Shopee (Indonesia) ↗</a>
              <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">{t.etsy}</a>
            </span>
          </div>
          <Link className="door" href={L("/daily")}>
            <span className="door-knob" aria-hidden="true" />
            <b>{t.share}</b>
            <small>{t.shareNote}</small>
          </Link>
          <Link className="door" href={L("/contact")}>
            <span className="door-knob" aria-hidden="true" />
            <b>{t.partner}</b>
            <small>{t.partnerNote(CONTACT_EMAIL)}</small>
          </Link>
        </div>
      </section>
    </div>
  );
}
