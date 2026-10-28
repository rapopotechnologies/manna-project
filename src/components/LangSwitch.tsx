"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LANG_STORAGE_KEY, langOf, localPath, stripLang, type Lang } from "@/i18n/lang";

function remember(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked; the switch still works for this visit.
  }
}

function Switch({ query }: { query: string }) {
  const pathname = usePathname();
  const lang = langOf(pathname);
  const base = stripLang(pathname);
  const options: { lang: Lang; label: string; name: string }[] = [
    { lang: "en", label: "EN", name: "English" },
    { lang: "id", label: "ID", name: "Bahasa Indonesia" },
  ];
  return (
    <nav className="lang-switch" aria-label={lang === "id" ? "Bahasa" : "Language"}>
      {options.map((o) => (
        <Link
          key={o.lang}
          href={`${localPath(o.lang, base)}${query}`}
          hrefLang={o.lang}
          lang={o.lang}
          aria-label={o.name}
          aria-current={o.lang === lang ? "true" : undefined}
          onClick={() => remember(o.lang)}
          prefetch={false}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}

function WithQuery() {
  const q = useSearchParams().toString();
  return <Switch query={q ? `?${q}` : ""} />;
}

/** EN | ID. Remembers the choice so Indonesian devices aren't switched automatically again. */
export function LangSwitch() {
  return (
    <Suspense fallback={<Switch query="" />}>
      <WithQuery />
    </Suspense>
  );
}
