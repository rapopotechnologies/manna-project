import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${encodeURI(src)}`);

type Entry = MetadataRoute.Sitemap[number];

/** One entry per language, each pointing at the other, so search engines show the right one. */
function both(path: string, rest: Omit<Entry, "url" | "alternates">): Entry[] {
  const en = `${SITE_URL}${path === "/" ? "/" : path}`;
  const id = `${SITE_URL}${path === "/" ? "/id" : `/id${path}`}`;
  const alternates = { languages: { en, id } };
  return [
    { url: en, alternates, ...rest },
    { url: id, alternates, ...rest },
  ];
}

// Hidden verses, accounts and the admin are left out on purpose.
// Product photos are listed so they can appear in Google Images.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    ...both("/", { changeFrequency: "daily", priority: 1, images: [`${SITE_URL}/brand/manna-lockup.png`] }),
    ...both("/daily", { changeFrequency: "daily", priority: 0.9 }),
    ...both("/shop", { changeFrequency: "monthly", priority: 0.8 }),
    ...products.flatMap((p) =>
      both(`/shop/${p.slug}`, { changeFrequency: "monthly", priority: 0.7, images: p.images.map((i) => abs(i.src)) }),
    ),
    ...both("/kids", { changeFrequency: "daily", priority: 0.6 }),
    ...both("/about", { changeFrequency: "yearly", priority: 0.5 }),
    ...both("/support", { changeFrequency: "yearly", priority: 0.5 }),
    ...both("/contact", { changeFrequency: "yearly", priority: 0.4 }),
    ...both("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
  ];
}
