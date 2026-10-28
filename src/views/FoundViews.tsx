import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionShelf } from "@/components/found/CollectionShelf";
import { FoundActions } from "@/components/found/FoundActions";
import { FoundTally } from "@/components/found/FoundTally";
import { TrackView } from "@/components/TrackView";
import { referenceId } from "@/data/bible-id";
import { pick, type Lang } from "@/i18n/lang";
import { getCollectionFor, getHiddenContent, getHiddenVerse } from "@/lib/content";

// Hidden verses keep the wording they were first shared in (English), with the frame in the page's language.

export const foundIndexMetadata = (lang: Lang): Metadata => ({
  title: pick(lang, "Your hidden verse collection", "Koleksi ayat tersembunyimu"),
  robots: { index: false },
});

export async function FoundIndexView({ lang }: { lang: Lang }) {
  const { verses, collections } = await getHiddenContent();
  const ref = (slug: string) => {
    const r = verses.find((v) => v.slug === slug)?.reference ?? slug;
    return lang === "id" ? referenceId(r) : r;
  };
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{pick(lang, "Hidden verses", "Ayat tersembunyi")}</span>
        <h1>
          {lang === "id" ? (
            <>
              Catatan yang ditemukan <span className="brush">di balik dinding</span>
            </>
          ) : (
            <>
              Notes found <span className="brush">in the walls</span>
            </>
          )}
        </h1>
        <p className="lede">
          {pick(
            lang,
            "Every hidden verse you find is kept here, on this device (and in your account, if you’re signed in).",
            "Setiap ayat tersembunyi yang kamu temukan disimpan di sini, di perangkat ini (dan di akunmu, jika kamu sudah masuk).",
          )}
        </p>
      </header>

      {collections.map((c) => (
        <CollectionShelf key={c.id} name={c.name} blurb={c.blurb} items={c.slugs.map((slug) => ({ slug, reference: ref(slug) }))} />
      ))}
    </div>
  );
}

export async function foundMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const verse = await getHiddenVerse(slug);
  const ref = verse ? (lang === "id" ? referenceId(verse.reference) : verse.reference) : "";
  return {
    title: verse ? pick(lang, `You found ${ref}`, `Kamu menemukan ${ref}`) : pick(lang, "Hidden verse", "Ayat tersembunyi"),
    description: verse ? `${verse.lines.join(" ")} ${ref} (${verse.translation})` : undefined,
    robots: { index: false },
    ...(verse && lang === "id"
      ? { openGraph: { locale: "id_ID", images: [{ url: `/found/${slug}/card?format=landscape&lang=id`, width: 1200, height: 630 }] } }
      : {}),
  };
}

export async function FoundView({ lang, slug }: { lang: Lang; slug: string }) {
  const verse = await getHiddenVerse(slug);
  if (!verse) notFound();
  const collection = await getCollectionFor(verse.slug);
  const ref = lang === "id" ? referenceId(verse.reference) : verse.reference;

  return (
    <div className="wrap attic">
      <TrackView metric="found_view" trackKey={verse.slug} />
      <article className="note" aria-labelledby="found-title">
        <h1 id="found-title" className="note-found">
          {pick(lang, "You found one, tucked in the walls.", "Kamu menemukan satu, terselip di balik dinding.")}
        </h1>
        <blockquote className="note-verse" lang="en">
          {verse.lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </blockquote>
        <p className="note-ref">
          {ref} · {verse.translation}
        </p>
        <FoundActions slug={verse.slug} text={verse.lines.join(" ")} reference={ref} translation={verse.translation} />
      </article>
      {collection && <FoundTally slug={verse.slug} slugs={collection.slugs} collectionName={collection.name} />}
    </div>
  );
}
