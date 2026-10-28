"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { stripLang } from "@/i18n/lang";
import { track } from "@/lib/track";

/** Which printed code was scanned: "daily", "kids", "found:<slug>", or the page path for anything else. */
export function qrKeyFor(path: string): string {
  const p = stripLang(path);
  if (p === "/daily") return "daily";
  if (p === "/kids") return "kids";
  if (p.startsWith("/found/")) return `found:${p.slice(7)}`;
  return p === "/" ? "home" : p.slice(1);
}

/**
 * Counts one QR scan when a page is opened from a printed code (?src=qr), on any page,
 * then tidies the address so a refresh or a shared link isn't counted again.
 */
export function QrScan() {
  const pathname = usePathname();
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("src") !== "qr") return;
    track("qr_scan", qrKeyFor(url.pathname));
    url.searchParams.delete("src");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [pathname]);
  return null;
}
