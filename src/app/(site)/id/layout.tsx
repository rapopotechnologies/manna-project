import { SiteChrome } from "@/components/SiteChrome";

/** Bahasa Indonesia. The same pages as English, under /id. */
export default function IndonesianLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome lang="id">{children}</SiteChrome>;
}
