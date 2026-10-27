"use client";

import { useEffect, useState } from "react";
import { msUntilNextDay } from "@/lib/day";

function format(ms: number) {
  const mins = Math.max(1, Math.ceil(ms / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** "New verse in 8h 24m". Rendered only in the browser, since it depends on the clock. */
export function Countdown() {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLeft(format(msUntilNextDay(new Date())));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="countdown">{left ? `New verse in ${left}` : "A new verse every morning"}</span>;
}
