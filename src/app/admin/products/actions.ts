"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CONTENT_TAGS } from "@/lib/content";
import { SUPABASE_URL } from "@/lib/supabase/env";

export type FormState = { error?: string };

const CATEGORIES = ["Journals", "Bookmarks", "Stickers"];
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
  if (!images || images.length === 0) return { error: "Add at least one photo." };
  if (images.some((i) => !i.alt)) return { error: "Describe every photo in a few words. Screen readers read this aloud." };

  const details = lines(formData.get("details")).map((l) => {
    const at = l.indexOf(":");
    return at > 0 ? { label: l.slice(0, at).trim(), value: l.slice(at + 1).trim() } : { label: "Detail", value: l };
  });

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
    images,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
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
