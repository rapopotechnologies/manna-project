"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readFound } from "@/lib/found-store";

type Item = { slug: string; reference: string };
type Props = { name: string; blurb: string; items: Item[] };

/** One collection: found verses as notes, the rest as empty slots. */
export function CollectionShelf({ name, blurb, items }: Props) {
  const [found, setFound] = useState<string[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading device storage once on mount
    setFound(readFound());
  }, []);

  const count = found ? items.filter((i) => found.includes(i.slug)).length : 0;

  return (
    <section className="collection" aria-labelledby={`col-${name}`}>
      <div className="section-head">
        <div>
          <h2 id={`col-${name}`}>{name}</h2>
          <p className="section-note">{blurb}</p>
        </div>
        <span className="chip">{found ? `${count} of ${items.length} found` : `${items.length} verses`}</span>
      </div>

      <ul className="slots">
        {items.map((item, i) => {
          const isFound = found?.includes(item.slug);
          return (
            <li key={item.slug} className={`slot${isFound ? " is-found" : ""}`} style={{ rotate: `${((i * 37) % 5) - 2}deg` }}>
              {isFound ? (
                <Link href={`/found/${item.slug}`}>
                  <span className="slot-mark" aria-hidden="true" />
                  {item.reference}
                </Link>
              ) : (
                <span className="slot-hidden">
                  <span className="sr-only">Not found yet</span>
                  <span aria-hidden="true">?</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {found && count === 0 && (
        <p className="collection-empty hand">None found yet. They’re tucked away around Manna Project, so keep an eye out.</p>
      )}
    </section>
  );
}
