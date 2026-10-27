"use client";

import { useEffect } from "react";
import { SUPABASE_URL } from "@/lib/supabase/env";

/** If the reader is signed in, quietly sync their progress. Does nothing (and loads nothing) otherwise. */
export function AccountSync() {
  useEffect(() => {
    if (!SUPABASE_URL) return;
    const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
    if (!document.cookie.includes(`sb-${ref}-auth-token`)) return;
    import("@/lib/sync").then((m) => m.startSync()).catch(() => {});
  }, []);
  return null;
}
