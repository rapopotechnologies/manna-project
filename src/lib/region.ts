"use client";

import { useEffect, useState } from "react";

const ID_ZONES = ["Asia/Jakarta", "Asia/Pontianak", "Asia/Makassar", "Asia/Jayapura"];

/** True for visitors who are probably in Indonesia (device time zone or language). Null until known. */
export function useLikelyIndonesia(): boolean | null {
  const [likely, setLikely] = useState<boolean | null>(null);
  useEffect(() => {
    let zone = "";
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {}
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time zone and language are only known in the browser
    setLikely(ID_ZONES.includes(zone) || langs.some((l) => l?.toLowerCase().startsWith("id")));
  }, []);
  return likely;
}
