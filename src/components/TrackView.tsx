"use client";

import { useEffect } from "react";
import { track, type Metric } from "@/lib/track";

// Which QR code was scanned, recorded with each scan.
const QR_KEY: Partial<Record<Metric, string>> = { verse_view: "daily", kids_view: "kids", found_view: "found" };

/** Counts one view of a page, plus a QR scan when the link came from a printed code (?src=qr). */
export function TrackView({ metric, trackKey = "" }: { metric: Metric; trackKey?: string }) {
  useEffect(() => {
    track(metric, trackKey);
    if (new URLSearchParams(window.location.search).get("src") === "qr") {
      track("qr_scan", metric === "found_view" ? `found:${trackKey}` : (QR_KEY[metric] ?? ""));
    }
  }, [metric, trackKey]);
  return null;
}
