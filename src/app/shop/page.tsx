import type { Metadata } from "next";
import Image from "next/image";
import { ETSY_SHOP_URL, products, type ProductCategory } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Book of the Bible bookmarks, a Bible reading tracker and journaling stickers from Manna Project, sold on Etsy.",
  alternates: { canonical: "/shop" },
};

const order: ProductCategory[] = ["Journals", "Bookmarks", "Stickers"];

export default function ShopPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">The workshop</span>
        <h1>
          Made by hand, <span className="brush">for your quiet time</span>.
        </h1>
        <p className="lede">Digital and printable tools for Bible reading and journaling. Every item is sold through our Etsy shop.</p>
        <a className="btn" href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start" }}>
          Visit the Etsy shop ↗
        </a>
      </header>

      {order.map((category) => {
        const items = products.filter((p) => p.category === category);
        if (!items.length) return null;
        return (
          <section key={category} className="section" style={{ paddingTop: "var(--s-6)" }} aria-labelledby={`cat-${category}`}>
            <div className="section-head">
              <h2 id={`cat-${category}`}>{category}</h2>
            </div>
            <div className="products">
              {items.map((p) => (
                <article className="product" key={p.slug}>
                  <a className="product-photo" href={p.etsyUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                    <Image src={p.images[0]} alt="" width={1000} height={800} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px" />
                  </a>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <a className="btn btn-primary btn-small" href={p.etsyUrl} target="_blank" rel="noopener noreferrer">
                    Buy on Etsy ↗<span className="sr-only"> ({p.name})</span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
