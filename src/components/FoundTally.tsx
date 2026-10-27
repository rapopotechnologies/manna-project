"use client";

import { useEffect, useState } from "react";

const KEY = "manna:found";

/** "3 of 10 found", remembered on this device. */
export function FoundTally({ slug, slugs }: { slug: string; slugs: string[] }) {
  const [found, setFound] = useState<string[] | null>(null);

  useEffect(() => {
    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    if (!list.includes(slug)) list = [...list, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      // Storage unavailable; show this visit only.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading device storage once on mount
    setFound(list.filter((s) => slugs.includes(s)));
  }, [slug, slugs]);

  if (!found) return null;
  const count = found.length;

  return (
    <div className="tally">
      <div className="tally-dots" aria-hidden="true">
        {slugs.map((s) => (
          <i key={s} className={found.includes(s) ? "on" : undefined} />
        ))}
      </div>
      <p>
        {count === slugs.length
          ? `All ${slugs.length} found. Well done!`
          : `${count} of ${slugs.length} hidden verses found`}
      </p>
    </div>
  );
}
