// The site's two languages. English lives at the plain URLs (/daily), Indonesian under /id (/id/daily).
// Safe to import from server and client code.

export type Lang = "en" | "id";

export const LANG_STORAGE_KEY = "manna:lang";

/** "/daily" → "/id/daily" for Indonesian; unchanged for English. Keeps ?query and #hash. */
export function localPath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path === "/" || path === "") return "/id";
  return `/id${path}`;
}

/** "/id/daily" → "/daily". The page's English path, used to compare routes. */
export function stripLang(pathname: string): string {
  if (pathname === "/id") return "/";
  return pathname.startsWith("/id/") ? pathname.slice(3) : pathname;
}

export function langOf(pathname: string | null | undefined): Lang {
  return pathname === "/id" || pathname?.startsWith("/id/") ? "id" : "en";
}

export const dateLocale = (lang: Lang) => (lang === "id" ? "id-ID" : "en-US");

/** Canonical URL plus links to the page in the other language, for search engines. */
export function langAlternates(lang: Lang, path: string) {
  return {
    canonical: localPath(lang, path),
    languages: { en: path, id: localPath("id", path), "x-default": path },
  };
}

/** Pick the text for the current language. */
export const pick = <T>(lang: Lang, en: T, id: T): T => (lang === "id" ? id : en);

/**
 * Runs in <head> before the page paints:
 * - sets <html lang="id"> on Indonesian pages;
 * - sends first-time visitors on Indonesian devices (time zone or language) to the
 *   Indonesian page, unless they've picked a language with the EN | ID switch.
 */
export const langScript = `try{var lp=location.pathname,li=lp==="/id"||lp.indexOf("/id/")===0;if(li){document.documentElement.lang="id"}else if(!/^\\/(admin|auth)(\\/|$)/.test(lp)){var ls=null;try{ls=localStorage.getItem("${LANG_STORAGE_KEY}")}catch(e){}if(!ls){var lz="";try{lz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}var ll=(navigator.languages&&navigator.languages[0])||navigator.language||"";if(/^Asia\\/(Jakarta|Pontianak|Makassar|Jayapura)$/.test(lz)||/^(id|in)(-|$)/i.test(ll)){location.replace((lp==="/"?"/id":"/id"+lp)+location.search+location.hash)}}}}catch(e){}`;
