"use client";

import { useEffect, useState } from "react";
import { localDayKey, pickDay } from "@/lib/reader-day";

/** The reader's local date, as set by the head script (or computed if missing). Browser only. */
export function readerLocalDay(): string {
  return document.documentElement.dataset.day || localDayKey();
}

/**
 * The reader's day, matched to the days the page has content for.
 * Null until the page is running in the browser.
 */
export function useReaderDay(available?: readonly string[]): string | null {
  const [day, setDay] = useState<string | null>(null);
  const key = available?.join(",");
  useEffect(() => {
    const local = readerLocalDay();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the reader's date is only known in the browser
    setDay(available?.length ? pickDay(local, available) : local);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures the list
  }, [key]);
  return day;
}
