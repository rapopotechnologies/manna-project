// Counts things for the admin overview: daily totals only, no cookies, no personal data.
// Runs in the browser and calls the public `track` function in Supabase.

import { SUPABASE_KEY, SUPABASE_URL, hasSupabase } from "@/lib/supabase/env";

export type Metric = "verse_view" | "qr_scan" | "kids_view" | "found_view" | "ig_share" | "link_share" | "wa_share" | "etsy_click" | "shopee_click";

export function track(metric: Metric, key = "") {
  if (typeof window === "undefined" || !hasSupabase) return;
  // Don't count local testing.
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
  try {
    fetch(`${SUPABASE_URL}/rest/v1/rpc/track`, {
      method: "POST",
      keepalive: true,
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ metric, key }),
    }).catch(() => {});
  } catch {
    // Counting must never break the page.
  }
}
