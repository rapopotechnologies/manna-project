"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addFound } from "@/lib/found-store";

type Props = { slug: string; slugs: string[]; collectionName: string };

/** Marks this verse as found and shows "3 of 10 found", remembered on this device. */
export function FoundTally({ slug, slugs, collectionName }: Props) {
  const [found, setFound] = useState<string[] | null>(null);

  useEffect(() => {
    const list = addFound(slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading device storage once on mount
    setFound(list.filter((s) => slugs.includes(s)));
  }, [slug, slugs]);

  if (!found) return null;
  const count = found.length;
  const done = count === slugs.length;

  return (
    <div className="tally">
      <div className="tally-dots" aria-hidden="true">
        {slugs.map((s) => (
          <i key={s} className={found.includes(s) ? "on" : undefined} />
        ))}
      </div>
      <p>
        {done
          ? `You found all ${slugs.length} in ${collectionName.toLowerCase()}. Well done!`
          : `${count} of ${slugs.length} hidden verses found`}
      </p>
      <Link href="/found" className="tally-link">See your collection →</Link>
    </div>
  );
}
