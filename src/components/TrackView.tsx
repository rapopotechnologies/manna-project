"use client";

import { useEffect } from "react";
import { track, type Metric } from "@/lib/track";

/** Counts one view of a page. (QR scans are counted for every page by QrScan, in the site frame.) */
export function TrackView({ metric, trackKey = "" }: { metric: Metric; trackKey?: string }) {
  useEffect(() => {
    track(metric, trackKey);
  }, [metric, trackKey]);
  return null;
}
