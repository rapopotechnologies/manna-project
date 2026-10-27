"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/daily", label: "Today’s verse" },
  { href: "/shop", label: "Shop" },
  { href: "/kids", label: "Manna Kids" },
  { href: "/about", label: "About" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="nav-links">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link href={href} aria-current={active ? "page" : undefined} className="nav-link">
              <span className="nav-sun" aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
