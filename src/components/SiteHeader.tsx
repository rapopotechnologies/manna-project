import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import { Wordmark } from "@/components/Wordmark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href="/" className="home-link" aria-label="Manna Project home">
          <Wordmark />
        </Link>
        <nav aria-label="Main">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
