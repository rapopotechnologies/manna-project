import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Literata, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { langScript } from "@/i18n/lang";
import { readerDayScript } from "@/lib/reader-day";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"], display: "swap" });
const read = Literata({ subsets: ["latin"], variable: "--font-read", style: ["normal", "italic"], axes: ["opsz"], display: "swap" });
const label = Montserrat({ subsets: ["latin"], variable: "--font-label", weight: ["600", "700"], display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", weight: ["500", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · ${MOTTO}`, template: `%s · ${SITE_NAME}` },
  description:
    "A daily verse, a question for kids, and handmade Bible journaling bookmarks, trackers and stickers from Manna Project.",
  applicationName: SITE_NAME,
  appleWebApp: { title: "Manna", statusBarStyle: "default" },
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: "Manna Project: today’s verse" }] } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F3E6" },
    { media: "(prefers-color-scheme: dark)", color: "#121915" },
  ],
};

// Sets the time of day before first paint so the daily page's sky never flashes.
const daypartScript = `(function(){try{var h=new Date().getHours();var p=h>=5&&h<10?"dawn":h<17&&h>=10?"day":h>=17&&h<20?"dusk":"night";document.documentElement.dataset.daypart=p;}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${read.variable} ${label.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript + daypartScript + readerDayScript }} />
      </head>
      <body>
        {children}
        <Analytics />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
