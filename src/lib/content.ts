import { cacheLife, cacheTag } from "next/cache";
import { products as fallbackProducts, type Product, type ProductCategory } from "@/data/products";
import {
  collections as fallbackCollections,
  hiddenVerses as fallbackVerses,
  type Collection,
  type HiddenVerse,
} from "@/data/hidden-verses";
import { kidsQuestions as fallbackQuestions } from "@/data/kids-questions";
import { hasSupabase } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

// Content managed in the admin. Every read is cached and tagged; publishing in the
// admin refreshes the tag. If Supabase can't be reached (or is paused on the free
// plan), the copies in src/data keep the site working.

export const CONTENT_TAGS = {
  products: "content:products",
  verses: "content:verses",
  kids: "content:kids",
} as const;

const CATEGORIES: ProductCategory[] = ["Journals", "Planners", "Bookmarks", "Stickers"];

export type ShopProduct = Product & { featured: boolean };

function asImages(value: unknown): Product["images"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((i): i is { src: string; alt?: string } => typeof i?.src === "string" && i.src.length > 0)
    .map((i) => ({ src: i.src, alt: typeof i.alt === "string" ? i.alt : "" }));
}

function asDetails(value: unknown): Product["details"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((d): d is { label: string; value: string } => typeof d?.label === "string" && typeof d?.value === "string")
    .map((d) => ({ label: d.label, value: d.value }));
}

const FALLBACK_FEATURED = new Set(["bible-reading-tracker", "book-of-the-bible-bookmarks-bundle", "bible-journal-basic-stickers"]);
const fallbackShop = (): ShopProduct[] => fallbackProducts.map((p) => ({ ...p, featured: FALLBACK_FEATURED.has(p.slug) }));

/** Published products in shop order. */
export async function getProducts(): Promise<ShopProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.products);
  if (!hasSupabase) return fallbackShop();
  try {
    const { data, error } = await createPublicClient()
      .from("products")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("name");
    if (error || !data?.length) return fallbackShop();
    return data.map((r) => ({
      slug: r.slug,
      name: r.name,
      category: (CATEGORIES.includes(r.category as ProductCategory) ? r.category : "Journals") as ProductCategory,
      blurb: r.blurb,
      description: r.description,
      includes: r.includes,
      details: asDetails(r.details),
      pairsWith: r.pairs_with,
      etsyUrl: r.etsy_url,
      shopeeUrl: r.shopee_url ?? undefined,
      images: asImages(r.images),
      featured: r.featured,
    })).filter((p) => p.images.length > 0);
  } catch {
    return fallbackShop();
  }
}

export async function getProduct(slug: string): Promise<ShopProduct | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

/** Hidden verses and the collections they belong to. */
export async function getHiddenContent(): Promise<{ verses: HiddenVerse[]; collections: Collection[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.verses);
  const fallback = { verses: [...fallbackVerses], collections: [...fallbackCollections] };
  if (!hasSupabase) return fallback;
  try {
    const db = createPublicClient();
    const [v, c] = await Promise.all([
      db.from("hidden_verses").select("*").order("sort_order").order("reference"),
      db.from("collections").select("*").order("sort_order").order("name"),
    ]);
    if (v.error || c.error || !v.data?.length) return fallback;
    const verses: HiddenVerse[] = v.data.map((r) => ({
      slug: r.slug,
      reference: r.reference,
      translation: r.translation as HiddenVerse["translation"],
      lines: r.lines,
    }));
    const collections: Collection[] = (c.data ?? []).map((col) => ({
      id: col.id,
      name: col.name,
      blurb: col.blurb,
      slugs: v.data.filter((r) => r.collection_id === col.id).map((r) => r.slug),
    }));
    return { verses, collections };
  } catch {
    return fallback;
  }
}

export async function getHiddenVerse(slug: string): Promise<HiddenVerse | undefined> {
  return (await getHiddenContent()).verses.find((v) => v.slug === slug);
}

export async function getCollectionFor(slug: string): Promise<Collection | undefined> {
  return (await getHiddenContent()).collections.find((c) => c.slugs.includes(slug));
}

/** The kids' questions in order. */
export async function getKidsQuestions(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.kids);
  if (!hasSupabase) return [...fallbackQuestions];
  try {
    const { data, error } = await createPublicClient().from("kids_questions").select("question").order("position");
    if (error || !data?.length) return [...fallbackQuestions];
    return data.map((r) => r.question);
  } catch {
    return [...fallbackQuestions];
  }
}
