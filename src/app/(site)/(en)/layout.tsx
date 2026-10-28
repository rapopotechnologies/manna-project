import { SiteChrome } from "@/components/SiteChrome";

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome lang="en">{children}</SiteChrome>;
}
