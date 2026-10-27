"use client";

import { track } from "@/lib/track";

type Props = { href: string; slug: string; className?: string; children: React.ReactNode };

/** A link to an Etsy listing that counts the click for the admin overview. */
export function EtsyLink({ href, slug, className, children }: Props) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => track("etsy_click", slug)}>
      {children}
    </a>
  );
}
