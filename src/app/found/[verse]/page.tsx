import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoundActions } from "@/components/found/FoundActions";
import { FoundTally } from "@/components/found/FoundTally";
import { collectionFor, findHiddenVerse, hiddenVerses } from "@/data/hidden-verses";

export function generateStaticParams() {
  return hiddenVerses.map((v) => ({ verse: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/found/[verse]">): Promise<Metadata> {
  const { verse: slug } = await params;
  const verse = findHiddenVerse(slug);
  return {
    title: verse ? `You found ${verse.reference}` : "Hidden verse",
    description: verse ? `${verse.lines.join(" ")} ${verse.reference} (${verse.translation})` : undefined,
    robots: { index: false },
  };
}

export default async function FoundPage({ params }: PageProps<"/found/[verse]">) {
  const { verse: slug } = await params;
  const verse = findHiddenVerse(slug);
  if (!verse) notFound();
  const collection = collectionFor(verse.slug);

  return (
    <div className="wrap attic">
      <article className="note" aria-labelledby="found-title">
        <p id="found-title" className="note-found">You found one, tucked in the walls.</p>
        <blockquote className="note-verse">
          {verse.lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </blockquote>
        <p className="note-ref">
          {verse.reference} · {verse.translation}
        </p>
        <FoundActions
          slug={verse.slug}
          text={verse.lines.join(" ")}
          reference={verse.reference}
          translation={verse.translation}
        />
      </article>
      {collection && <FoundTally slug={verse.slug} slugs={collection.slugs} collectionName={collection.name} />}
    </div>
  );
}
