"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langOf, localPath, stripLang } from "@/i18n/lang";

const links = [
  { href: "/daily", en: "Today’s verse", id: "Ayat hari ini" },
  { href: "/shop", en: "Shop", id: "Toko" },
  { href: "/kids", en: "Manna Kids", id: "Manna Kids" },
  { href: "/about", en: "About", id: "Tentang" },
];

export function NavLinks() {
  const pathname = usePathname();
  const lang = langOf(pathname);
  const path = stripLang(pathname);
  return (
    <ul className="nav-links">
      {links.map(({ href, en, id }) => {
        const active = path === href || path.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link href={localPath(lang, href)} aria-current={active ? "page" : undefined} className="nav-link">
              <span className="nav-sun" aria-hidden="true" />
              {lang === "id" ? id : en}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
