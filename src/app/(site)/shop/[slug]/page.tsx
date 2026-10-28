import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButtons } from "@/components/shop/BuyButtons";
import { Gallery } from "@/components/shop/Gallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORY_NOTES } from "@/data/products";
import { getProduct, getProducts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.blurb,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.name, description: product.blurb, url: `/shop/${product.slug}` },
    twitter: { card: "summary_large_image", title: product.name, description: product.blurb },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const all = await getProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();

  const pairs = product.pairsWith.map((s) => all.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const usesSoap = product.slug === "bible-reading-tracker";

  // Structured data so search engines can show the product properly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => (i.src.startsWith("http") ? i.src : `${SITE_URL}${encodeURI(i.src)}`)),
    brand: { "@type": "Brand", name: "Manna Project" },
    url: `${SITE_URL}/shop/${product.slug}`,
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span>{product.category}</span>
      </nav>

      <div className="pdp">
        <Gallery images={product.images} name={product.name} />

        <div className="pdp-info">
          <span className="chip">{CATEGORY_NOTES[product.category]}</span>
          <h1>{product.name}</h1>
          <p className="pdp-desc">{product.description}</p>

          <BuyButtons slug={product.slug} etsyUrl={product.etsyUrl} shopeeUrl={product.shopeeUrl} />
          <p className="pdp-note">
            Shopee for buyers in Indonesia, Etsy everywhere else. Checkout happens securely on their site
            {product.details.some((d) => /shipped/i.test(d.value))
              ? ", and the sticker is shipped to you."
              : ", and downloads are ready right after purchase."}
          </p>

          <section aria-labelledby="includes">
            <h2 id="includes" className="label">What’s included</h2>
            <ul className="fixtures pdp-list">
              {product.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="details">
            <h2 id="details" className="label">Details</h2>
            <dl className="specs">
              {product.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {usesSoap && (
            <Link href="/daily" className="tile">
              <span className="tile-art tile-sun" aria-hidden="true"><span /></span>
              <span>
                <b>Try the S.O.A.P. method free</b>
                <small>Today’s verse has a short S.O.A.P. reflection built in.</small>
              </span>
            </Link>
          )}
        </div>
      </div>

      {pairs.length > 0 && (
        <section className="section" aria-labelledby="pairs">
          <div className="section-head">
            <h2 id="pairs">Pairs well with</h2>
            <Link href="/shop">See the whole shop →</Link>
          </div>
          <div className="products products-2">
            {pairs.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
