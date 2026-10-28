import { LostBody } from "@/components/LostBody";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader lang="en" />
      <main id="main">
        <LostBody />
      </main>
      <SiteFooter lang="en" />
    </>
  );
}
