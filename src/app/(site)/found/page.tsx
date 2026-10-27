import type { Metadata } from "next";
import { CollectionShelf } from "@/components/found/CollectionShelf";
import { getHiddenContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your hidden verse collection",
  robots: { index: false },
};

export default async function CollectionPage() {
  const { verses, collections } = await getHiddenContent();
  const ref = (slug: string) => verses.find((v) => v.slug === slug)?.reference ?? slug;
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
          items={c.slugs.map((slug) => ({ slug, reference: ref(slug) }))}
        />
      ))}
    </div>
  );
}
