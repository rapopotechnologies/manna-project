"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CONTENT_TAGS } from "@/lib/content";
import { SUPABASE_URL } from "@/lib/supabase/env";

export type FormState = { error?: string };

const CATEGORIES = ["Journals", "Planners", "Bookmarks", "Stickers"];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Images may be files that ship with the site (/...) or uploads in our Supabase storage. */
function parseImages(raw: string) {
  let list: unknown;
  try {
    list = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(list)) return null;
  const storage = `${SUPABASE_URL}/storage/v1/object/public/site-images/`;
  const ok = list.every(
    (i) => typeof i?.src === "string" && (i.src.startsWith("/") || i.src.startsWith(storage)) && typeof i?.alt === "string",
  );
  return ok ? (list as { src: string; alt: string }[]).map((i) => ({ src: i.src, alt: i.alt.trim() })) : null;
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const original = String(formData.get("original_slug") ?? "");
  const slug = original || String(formData.get("slug") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const etsyUrl = String(formData.get("etsy_url") ?? "").trim();
  const images = parseImages(String(formData.get("images") ?? "[]"));

  if (!name) return { error: "Give the product a name." };
  if (!SLUG.test(slug) || slug === "new") return { error: "The web address can only use lowercase letters, numbers and dashes, like bible-reading-tracker." };
  if (!CATEGORIES.includes(category)) return { error: "Choose a category." };
  if (!/^https:\/\/(www\.)?etsy\.com\//.test(etsyUrl)) return { error: "The Etsy link should start with https://www.etsy.com/." };
  const shopeeUrl = String(formData.get("shopee_url") ?? "").trim();
  if (shopeeUrl && !/^https:\/\/([a-z0-9-]+\.)*(shopee\.co\.id|shp\.ee)\//.test(shopeeUrl)) {
    return { error: "The Shopee link should start with https://shopee.co.id/ or https://id.shp.ee/." };
  }
  if (!images || images.length === 0) return { error: "Add at least one photo." };
  if (images.some((i) => !i.alt)) return { error: "Describe every photo in a few words. Screen readers read this aloud." };

  const toDetails = (v: FormDataEntryValue | null, fallbackLabel: string) =>
    lines(v).map((l) => {
      const at = l.indexOf(":");
      return at > 0 ? { label: l.slice(0, at).trim(), value: l.slice(at + 1).trim() } : { label: fallbackLabel, value: l };
    });
  const details = toDetails(formData.get("details"), "Detail");

  // Prices: "4.50" / "4,50" dollars; "45.000" / "45000" rupiah. Empty hides the price.
  const usdRaw = String(formData.get("price_usd") ?? "").trim().replace(/^\$|^US\$/i, "").replace(",", ".");
  const idrRaw = String(formData.get("price_idr") ?? "").trim().replace(/^Rp\s*/i, "").replace(/[.,\s]/g, "");
  const priceUsd = usdRaw ? Number(usdRaw) : null;
  const priceIdr = idrRaw ? Number(idrRaw) : null;
  if (priceUsd !== null && !(Number.isFinite(priceUsd) && priceUsd >= 0 && priceUsd < 100000)) return { error: "The Etsy price should be a number of dollars, like 4.50." };
  if (priceIdr !== null && !(Number.isInteger(priceIdr) && priceIdr >= 0)) return { error: "The Shopee price should be a whole number of rupiah, like 45000." };
  const text = (k: string) => String(formData.get(k) ?? "").trim();

  const row = {
    slug,
    name,
    category,
    blurb: String(formData.get("blurb") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    includes: lines(formData.get("includes")),
    details,
    pairs_with: formData.getAll("pairs_with").map(String).filter((s) => s !== slug),
    etsy_url: etsyUrl,
    shopee_url: shopeeUrl || null,
    images,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    name_id: text("name_id") || null,
    blurb_id: text("blurb_id") || null,
    description_id: text("description_id") || null,
    includes_id: lines(formData.get("includes_id")),
    details_id: toDetails(formData.get("details_id"), "Detail"),
    price_usd: priceUsd === null ? null : Math.round(priceUsd * 100) / 100,
    price_idr: priceIdr,
  };

  if (original) {
    const { error } = await supabase.from("products").update(row).eq("slug", original);
    if (error) return { error: `Couldn’t save: ${error.message}` };
  } else {
    const { data: last } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("products").insert({ ...row, sort_order: (last?.sort_order ?? -1) + 1 });
    if (error) {
      return { error: error.code === "23505" ? "A product already uses that web address. Pick another." : `Couldn’t save: ${error.message}` };
    }
  }

  updateTag(CONTENT_TAGS.products);
  redirect(`/admin/products?saved=${slug}`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (formData.get("confirm") !== "on") redirect(`/admin/products/${slug}?error=confirm`);
  await supabase.from("products").delete().eq("slug", slug);
  updateTag(CONTENT_TAGS.products);
  redirect(`/admin/products?removed=${slug}`);
}

export async function toggleProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const value = formData.get("value") === "true";
  const patch = formData.get("field") === "featured" ? { featured: value } : { published: value };
  await supabase.from("products").update(patch).eq("slug", slug);
  updateTag(CONTENT_TAGS.products);
}

export async function moveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const { data } = await supabase.from("products").select("slug").order("sort_order").order("name");
  const order = (data ?? []).map((r) => r.slug);
  const i = order.indexOf(slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= order.length) return;
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((s, n) => supabase.from("products").update({ sort_order: n }).eq("slug", s)));
  updateTag(CONTENT_TAGS.products);
}
