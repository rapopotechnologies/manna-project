import Link from "next/link";
import { AccountLink } from "@/components/account/AccountLink";
import { LangSwitch } from "@/components/LangSwitch";
import { NavLinks } from "@/components/NavLinks";
import { Wordmark } from "@/components/Wordmark";
import { localPath, pick, type Lang } from "@/i18n/lang";

export function SiteHeader({ lang }: { lang: Lang }) {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href={localPath(lang, "/")} className="home-link" aria-label={pick(lang, "Manna Project home", "Beranda Manna Project")}>
          <Wordmark />
        </Link>
        <div className="header-right">
          <nav aria-label={pick(lang, "Main", "Utama")}>
            <NavLinks />
          </nav>
          <LangSwitch />
          <AccountLink />
        </div>
      </div>
    </header>
  );
}
