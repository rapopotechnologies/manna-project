import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButtons } from "@/components/shop/BuyButtons";
import { Gallery } from "@/components/shop/Gallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORY_LABELS_ID, CATEGORY_NOTES, CATEGORY_NOTES_ID, CATEGORY_ORDER, ETSY_SHOP_URL, SHOPEE_SHOP_URL } from "@/data/products";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";
import { getProduct, getProducts } from "@/lib/content";
import { formatIdr, formatUsd, productCopy } from "@/lib/product-copy";
import { SITE_URL } from "@/lib/site";

// Product words come from productCopy: Indonesian where the admin has filled it in, otherwise English.

const T = {
  en: {
    metaTitle: "Shop",
    metaDesc: "Book of the Bible bookmarks, a Bible reading tracker, planners and journaling stickers from Manna Project, on Shopee and Etsy.",
    label: "The workshop",
    title: (
      <>
        Made by hand, <span className="brush">for your quiet time</span>.
      </>
    ),
    lede: "Digital and printable tools for Bible reading and journaling. Every item is an instant download from our Shopee shop (Indonesia) or Etsy shop (worldwide).",
    sections: "Shop sections",
    bandTitle: "Buy on Shopee or Etsy",
    band: "Shopee for buyers in Indonesia, Etsy everywhere else. Secure checkout and instant downloads on both.",
    shopee: "Shopee shop (Indonesia) ↗",
    etsy: "Etsy shop (worldwide) ↗",
    crumbs: "Breadcrumb",
    shop: "Shop",
    note: "Shopee for buyers in Indonesia, Etsy everywhere else. Checkout happens securely on their site",
    shipped: ", and the sticker is shipped to you.",
    download: ", and downloads are ready right after purchase.",
    includes: "What’s included",
    details: "Details",
    soap: "Try the S.O.A.P. method free",
    soapNote: "Today’s verse has a short S.O.A.P. reflection built in.",
    pairs: "Pairs well with",
    whole: "See the whole shop →",
  },
  id: {
    metaTitle: "Toko",
    metaDesc: "Pembatas buku kitab-kitab Alkitab, pelacak baca Alkitab, planner, dan stiker jurnal dari Manna Project, di Shopee dan Etsy.",
    label: "Bengkel kami",
    title: (
      <>
        Buatan tangan, <span className="brush">untuk saat teduhmu</span>.
      </>
    ),
    lede: "Alat digital dan siap cetak untuk membaca Alkitab dan menulis jurnal. Setiap produk bisa langsung diunduh dari toko Shopee kami (Indonesia) atau toko Etsy (seluruh dunia).",
    sections: "Bagian toko",
    bandTitle: "Beli di Shopee atau Etsy",
    band: "Shopee untuk pembeli di Indonesia, Etsy untuk negara lain. Pembayaran aman dan unduhan instan di keduanya.",
    shopee: "Toko Shopee (Indonesia) ↗",
    etsy: "Toko Etsy (seluruh dunia) ↗",
    crumbs: "Navigasi",
    shop: "Toko",
    note: "Shopee untuk pembeli di Indonesia, Etsy untuk negara lain. Pembayaran dilakukan dengan aman di situs mereka",
    shipped: ", dan stikernya dikirim ke alamatmu.",
    download: ", dan file siap diunduh setelah pembelian.",
    includes: "Isi paket",
    details: "Detail",
    soap: "Coba metode S.O.A.P. gratis",
    soapNote: "Ayat hari ini dilengkapi renungan singkat S.O.A.P.",
    pairs: "Cocok dipadukan dengan",
    whole: "Lihat seluruh toko →",
  },
};

export function shopMetadata(lang: Lang): Metadata {
  return { title: T[lang].metaTitle, description: T[lang].metaDesc, alternates: langAlternates(lang, "/shop") };
}

export async function ShopView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const products = await getProducts();
  const label = (c: (typeof CATEGORY_ORDER)[number]) => (lang === "id" ? CATEGORY_LABELS_ID[c] : c);
  const notes = lang === "id" ? CATEGORY_NOTES_ID : CATEGORY_NOTES;
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{t.label}</span>
        <h1>{t.title}</h1>
        <p className="lede">{t.lede}</p>
        <nav className="jump" aria-label={t.sections}>
          {groups.map(({ category, items }) => (
            <a key={category} href={`#${category.toLowerCase()}`} className="jump-chip">
              {label(category)} <span>{items.length}</span>
            </a>
          ))}
        </nav>
      </header>

      {groups.map(({ category, items }, gi) => (
        <section key={category} id={category.toLowerCase()} className="shelf-section" aria-labelledby={`cat-${category}`}>
          <div className="section-head">
            <div>
              <h2 id={`cat-${category}`}>{label(category)}</h2>
              <p className="section-note">{notes[category]}</p>
            </div>
          </div>
          <div className="products">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={gi === 0 && i === 0} lang={lang} />
            ))}
          </div>
        </section>
      ))}

      <section className="etsy-band" aria-labelledby="etsy-band">
        <div>
          <h2 id="etsy-band">{t.bandTitle}</h2>
          <p>{t.band}</p>
        </div>
        <div className="band-buttons">
          <a className="btn btn-gold" href={SHOPEE_SHOP_URL} target="_blank" rel="noopener noreferrer">{t.shopee}</a>
          <a className="btn btn-gold" href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">{t.etsy}</a>
        </div>
      </section>
    </div>
  );
}

export async function productMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const product = await getProduct(slug);
  if (!product) return {};
  const path = `/shop/${product.slug}`;
  const { name, blurb } = productCopy(product, lang);
  return {
    title: name,
    description: blurb,
    alternates: langAlternates(lang, path),
    openGraph: { title: name, description: blurb, url: localPath(lang, path), ...(lang === "id" ? { locale: "id_ID" } : {}) },
    twitter: { card: "summary_large_image", title: name, description: blurb },
  };
}

export async function ProductView({ lang, slug }: { lang: Lang; slug: string }) {
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  const all = await getProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();

  const pairs = product.pairsWith.map((s) => all.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const usesSoap = product.slug === "bible-reading-tracker";
  const notes = lang === "id" ? CATEGORY_NOTES_ID : CATEGORY_NOTES;
  const copy = productCopy(product, lang);
  // Shipped stickers say so in their (English) details.
  const shipped = product.details.some((d) => /shipped/i.test(d.value));

  // Structured data so search engines can show the product properly, with a price for each shop.
  const offers = [
    product.priceUsd != null && { "@type": "Offer", price: product.priceUsd.toFixed(2), priceCurrency: "USD", url: product.etsyUrl, availability: "https://schema.org/InStock" },
    product.priceIdr != null && { "@type": "Offer", price: String(product.priceIdr), priceCurrency: "IDR", url: product.shopeeUrl || SHOPEE_SHOP_URL, availability: "https://schema.org/InStock" },
  ].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: copy.name,
    description: copy.description,
    image: product.images.map((i) => (i.src.startsWith("http") ? i.src : `${SITE_URL}${encodeURI(i.src)}`)),
    brand: { "@type": "Brand", name: "Manna Project" },
    url: `${SITE_URL}${L(`/shop/${product.slug}`)}`,
    ...(offers.length ? { offers } : {}),
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label={t.crumbs}>
        <Link href={L("/shop")}>{t.shop}</Link>
        <span aria-hidden="true">/</span>
        <span>{lang === "id" ? CATEGORY_LABELS_ID[product.category] : product.category}</span>
      </nav>

      <div className="pdp">
        <Gallery images={product.images} name={product.name} />

        <div className="pdp-info">
          <span className="chip">{notes[product.category]}</span>
          <h1 lang={copy.lang}>{copy.name}</h1>
          <p className="pdp-desc" lang={copy.lang}>{copy.description}</p>

          <BuyButtons
            slug={product.slug}
            etsyUrl={product.etsyUrl}
            shopeeUrl={product.shopeeUrl}
            etsyPrice={product.priceUsd != null ? formatUsd(product.priceUsd) : undefined}
            shopeePrice={product.priceIdr != null ? formatIdr(product.priceIdr) : undefined}
          />
          <p className="pdp-note">
            {t.note}
            {shipped ? t.shipped : t.download}
          </p>

          <section aria-labelledby="includes">
            <h2 id="includes" className="label">{t.includes}</h2>
            <ul className="fixtures pdp-list" lang={copy.lang}>
              {copy.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="details">
            <h2 id="details" className="label">{t.details}</h2>
            <dl className="specs" lang={copy.lang}>
              {copy.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {usesSoap && (
            <Link href={L("/daily")} className="tile">
              <span className="tile-art tile-sun" aria-hidden="true"><span /></span>
              <span>
                <b>{t.soap}</b>
                <small>{t.soapNote}</small>
              </span>
            </Link>
          )}
        </div>
      </div>

      {pairs.length > 0 && (
        <section className="section" aria-labelledby="pairs">
          <div className="section-head">
            <h2 id="pairs">{t.pairs}</h2>
            <Link href={L("/shop")}>{t.whole}</Link>
          </div>
          <div className="products products-2">
            {pairs.map((p) => (
              <ProductCard key={p.slug} product={p} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
