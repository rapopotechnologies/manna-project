"use client";

import { usePathname } from "next/navigation";
import { langOf, localPath, type Lang } from "./lang";

/** The language of the page being viewed, from its URL. */
export function useLang(): Lang {
  return langOf(usePathname());
}

/** Turns an English path into the same page in the current language. */
export function useLocalPath(): (path: string) => string {
  const lang = useLang();
  return (path) => localPath(lang, path);
}
