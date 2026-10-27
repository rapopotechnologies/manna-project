"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The original site reported to two GA4 properties: one for the main site,
// one for the daily pages. Keep both so history carries over.
const MAIN_ID = "G-449MP292MX";
const DAILY_ID = "G-JKS4R683TW";

const idFor = (path: string) =>
  path.startsWith("/daily") || path.startsWith("/kids") ? DAILY_ID : MAIN_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // gtag.js expects the arguments object itself, not an array
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
  }
  window.gtag(...args);
}

/** Sends one page view per route change to the matching GA4 property. */
export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    gtag("config", idFor(pathname), { page_path: pathname + window.location.search });
  }, [pathname]);

  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${MAIN_ID}`} strategy="afterInteractive" />;
}
