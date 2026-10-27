"use client";

import { useEffect } from "react";
import { track, type Metric } from "@/lib/track";

/** Counts one view of a page. On the daily verse page it also counts QR code scans. */
export function TrackView({ metric, trackKey = "" }: { metric: Metric; trackKey?: string }) {
  useEffect(() => {
    track(metric, trackKey);
    if (metric === "verse_view" && new URLSearchParams(window.location.search).get("src") === "qr") {
      track("qr_scan");
    }
  }, [metric, trackKey]);
  return null;
}
