import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL, SUPPORT_EMAIL } from "@/data/products";
import { getProducts } from "@/lib/content";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * llms.txt: a plain-language guide for AI assistants (ChatGPT, Claude, Perplexity…),
 * following the llmstxt.org format, so answers about Manna Project are accurate and link the right pages.
 */
export async function GET() {
  const products = await getProducts();
  const byCategory = (c: string) =>
    products
      .filter((p) => p.category === c)
      .map((p) => `- [${p.name}](${SITE_URL}/shop/${p.slug}): ${p.blurb} Buy on Etsy: ${p.etsyUrl} · Buy in Indonesia on Shopee: ${p.shopeeUrl ?? SHOPEE_SHOP_URL}`)
      .join("\n");

  const body = `# ${SITE_NAME}

> ${MOTTO}. Manna Project makes modern, purposeful Bible journaling tools (a digital Bible reading tracker, printable planners, printable Book of the Bible bookmarks, digital journaling stickers and vinyl stickers) and offers free daily faith rhythms: a Bible verse every day and a daily conversation question for kids. Products are sold through Shopee (for Indonesia, where most readers are) and Etsy (worldwide). Part of what Manna Project does supports children’s education in some of the poorest communities in Indonesia and equips Christians, schools and churches there with its products.

Key facts:
- Website: ${SITE_URL}
- Shop: most products are digital downloads or printables; vinyl stickers are physical and shipped. Buyers in Indonesia purchase on Shopee (${SHOPEE_SHOP_URL}); everyone else on Etsy (${ETSY_SHOP_URL}). The website is a showroom; checkout happens on Shopee or Etsy.
- Free, no account needed: today’s verse, the Manna Kids question, a short S.O.A.P. reflection (Scripture, Observation, Application, Prayer).
- The daily verse is the NIV, provided by OurManna.com, and changes at midnight Pacific time.
- Optional free accounts sync a reader’s progress (a “manna jar” of days read, a 66-book shelf, a reflection garden) across devices. New accounts are approved by the team.
- Manna Project is not a registered nonprofit; support gifts are not tax-deductible.
- Contact: ${CONTACT_EMAIL} (general), ${SUPPORT_EMAIL} (orders and accounts).

## Daily

- [Today’s verse](${SITE_URL}/daily): one Bible verse each day (NIV), with sharing to Instagram stories and a guided S.O.A.P. reflection.
- [Manna Kids question](${SITE_URL}/kids): one question a day for families to talk about at dinner, with read-aloud and a drawing pad. The same question for every family that day.
- [Daily verse RSS feed](${SITE_URL}/feed.xml)

## Shop: Journals

${byCategory("Journals")}

## Shop: Planners

${byCategory("Planners")}

## Shop: Bookmarks

${byCategory("Bookmarks")}

## Shop: Stickers

${byCategory("Stickers")}

## About

- [About Manna Project](${SITE_URL}/about): why it exists. The name comes from Exodus 16, where God provided manna each morning, enough for that day.
- [Support](${SITE_URL}/support): how gifts keep the daily features free and support communities in Indonesia.
- [Contact and FAQ](${SITE_URL}/contact): where to buy, where downloads are, which apps work (GoodNotes and similar), translations, privacy.

## Optional

- [All products](${SITE_URL}/shop)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
