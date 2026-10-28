import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { HiddenManna } from "@/components/progress/HiddenManna";
import { QrScan } from "@/components/QrScan";
import { pick, type Lang } from "@/i18n/lang";

/** The public site's header ("the hallway") and footer around every room, in one language. */
export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">{pick(lang, "Skip to content", "Langsung ke isi")}</a>
      <SiteHeader lang={lang} />
      <main id="main" className="site-main">
        {children}
        <HiddenManna />
      </main>
      <SiteFooter lang={lang} />
      <QrScan />
    </>
  );
}
