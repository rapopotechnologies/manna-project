import type { Metadata } from "next";
import { CollectionShelf } from "@/components/found/CollectionShelf";
import { collections, findHiddenVerse } from "@/data/hidden-verses";

export const metadata: Metadata = {
  title: "Your hidden verse collection",
  robots: { index: false },
};

export default function CollectionPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Hidden verses</span>
        <h1>
          Notes found <span className="brush">in the walls</span>
        </h1>
        <p className="lede">Every hidden verse you find is kept here, on this device.</p>
      </header>

      {collections.map((c) => (
        <CollectionShelf
          key={c.id}
          name={c.name}
          blurb={c.blurb}
          items={c.slugs.map((slug) => ({ slug, reference: findHiddenVerse(slug)?.reference ?? slug }))}
        />
      ))}
    </div>
  );
}
