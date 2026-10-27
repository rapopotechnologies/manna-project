import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Hidden verses are left out on purpose: they're meant to be found.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/daily`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/kids`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
