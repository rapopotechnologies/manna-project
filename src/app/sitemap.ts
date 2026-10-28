import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${encodeURI(src)}`);

// Hidden verses, accounts and the admin are left out on purpose.
// Product photos are listed so they can appear in Google Images.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1, images: [`${SITE_URL}/brand/manna-lockup.png`] },
    { url: `${SITE_URL}/daily`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop`, changeFrequency: "monthly", priority: 0.8 },
    ...products.map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: p.images.map((i) => abs(i.src)),
    })),
    { url: `${SITE_URL}/kids`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/support`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
