import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORY_NOTES, CATEGORY_ORDER, ETSY_SHOP_URL } from "@/data/products";
import { getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Book of the Bible bookmarks, a Bible reading tracker and journaling stickers from Manna Project, sold on Etsy.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">The workshop</span>
        <h1>
          Made by hand, <span className="brush">for your quiet time</span>.
        </h1>
        <p className="lede">Digital and printable tools for Bible reading and journaling. Every item is an instant download from our Etsy shop.</p>
        <nav className="jump" aria-label="Shop sections">
          {groups.map(({ category, items }) => (
            <a key={category} href={`#${category.toLowerCase()}`} className="jump-chip">
              {category} <span>{items.length}</span>
            </a>
          ))}
        </nav>
      </header>

      {groups.map(({ category, items }, gi) => (
        <section key={category} id={category.toLowerCase()} className="shelf-section" aria-labelledby={`cat-${category}`}>
          <div className="section-head">
            <div>
              <h2 id={`cat-${category}`}>{category}</h2>
              <p className="section-note">{CATEGORY_NOTES[category]}</p>
            </div>
          </div>
          <div className="products">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={gi === 0 && i === 0} />
            ))}
          </div>
        </section>
      ))}

      <section className="etsy-band" aria-labelledby="etsy-band">
        <div>
          <h2 id="etsy-band">Every purchase happens on Etsy</h2>
          <p>Secure checkout, instant downloads, and your files stay in your Etsy account.</p>
        </div>
        <a className="btn btn-gold" href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
          Visit the Etsy shop ↗
        </a>
      </section>
    </div>
  );
}
