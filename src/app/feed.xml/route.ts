import { formatDayLabel } from "@/lib/day";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";
import { getTodaysManna } from "@/lib/verse";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** RSS feed of today's verse, for feed readers and search engines. Refreshes with the verse. */
export async function GET() {
  const verse = await getTodaysManna();
  const [y, m, d] = verse.dayKey.split("-").map(Number);
  // OurManna publishes at about midnight UTC.
  const pubDate = new Date(Date.UTC(y, m - 1, d, 0, 5)).toUTCString();
  const link = `${SITE_URL}/daily`;
  const title = `${verse.reference} (${verse.version}): ${formatDayLabel(verse.dayKey)}`;
  const credit = verse.source === "ourmanna" ? " Daily verse powered by OurManna.com." : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${SITE_NAME}: today’s verse`)}</title>
    <link>${link}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(`A Bible verse every day from ${SITE_NAME}. ${MOTTO}.`)}</description>
    <language>en-us</language>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/brand/icon-512.png</url>
      <title>${esc(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    <item>
      <title>${esc(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">manna-daily-${verse.dayKey}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(`“${verse.text}” ${verse.reference} (${verse.version}).${credit} Read and reflect at ${link}`)}</description>
      <enclosure url="${SITE_URL}/daily/card?d=${verse.dayKey}" type="image/png" length="0" />
    </item>
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
