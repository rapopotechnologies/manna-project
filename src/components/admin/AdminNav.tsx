"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/verses", label: "Hidden verses" },
  { href: "/admin/kids", label: "Kids questions" },
  { href: "/admin/readers", label: "Readers" },
  { href: "/admin/history", label: "Change history" },
];

export function AdminNav({ superadmin }: { superadmin: boolean }) {
  const pathname = usePathname();
  const items = superadmin ? [...links, { href: "/admin/team", label: "Team" }] : links;
  return (
    <ul className="admin-nav">
      {items.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link href={href} aria-current={active ? "page" : undefined}>{label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
