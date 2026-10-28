import { AccountSync } from "@/components/account/AccountSync";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { HiddenManna } from "@/components/progress/HiddenManna";

/** The public site: shared header ("the hallway") and footer around every room. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main" className="site-main">
        {children}
        <HiddenManna />
      </main>
      <SiteFooter />
      <AccountSync />
    </>
  );
}
