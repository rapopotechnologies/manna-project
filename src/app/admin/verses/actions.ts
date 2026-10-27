"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CONTENT_TAGS } from "@/lib/content";

export type FormState = { error?: string };

const VERSE_SLUG = /^[a-z0-9_]+$/;
const COLLECTION_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function saveVerse(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const original = String(formData.get("original_slug") ?? "");
  const slug = original || String(formData.get("slug") ?? "").trim().toLowerCase();
  const reference = String(formData.get("reference") ?? "").trim();
  const translation = String(formData.get("translation") ?? "").trim().toUpperCase();
  const lines = String(formData.get("lines") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const collection = String(formData.get("collection_id") ?? "") || null;

  if (!VERSE_SLUG.test(slug) || slug === "new") return { error: "The link name can use lowercase letters, numbers and underscores, like john_3_16." };
  if (!reference) return { error: "Add the reference, like John 3:16." };
  if (!/^[A-Z]{2,6}$/.test(translation)) return { error: "Add the translation, like NIV or ESV." };
  if (!lines.length) return { error: "Add the verse text." };

  const row = { slug, reference, translation, lines, collection_id: collection };
  if (original) {
    const { error } = await supabase.from("hidden_verses").update(row).eq("slug", original);
    if (error) return { error: `Couldn’t save: ${error.message}` };
  } else {
    const { data: last } = await supabase.from("hidden_verses").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("hidden_verses").insert({ ...row, sort_order: (last?.sort_order ?? -1) + 1 });
    if (error) return { error: error.code === "23505" ? "Another verse already uses that link name." : `Couldn’t save: ${error.message}` };
  }
  updateTag(CONTENT_TAGS.verses);
  redirect(`/admin/verses?saved=${slug}`);
}

export async function deleteVerse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (formData.get("confirm") !== "on") redirect(`/admin/verses/${slug}?error=confirm`);
  await supabase.from("hidden_verses").delete().eq("slug", slug);
  updateTag(CONTENT_TAGS.verses);
  redirect(`/admin/verses?removed=${slug}`);
}

export async function saveCollection(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const original = String(formData.get("original_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const id =
    original ||
    String(formData.get("id") ?? name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const blurb = String(formData.get("blurb") ?? "").trim();
  if (!name) return { error: "Name the collection, like Advent 2026." };
  if (!COLLECTION_ID.test(id)) return { error: "Use letters and numbers in the collection name." };

  if (original) {
    const { error } = await supabase.from("collections").update({ name, blurb }).eq("id", original);
    if (error) return { error: `Couldn’t save: ${error.message}` };
  } else {
    const { data: last } = await supabase.from("collections").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("collections").insert({ id, name, blurb, sort_order: (last?.sort_order ?? -1) + 1 });
    if (error) return { error: error.code === "23505" ? "A collection with that name already exists." : `Couldn’t save: ${error.message}` };
  }
  updateTag(CONTENT_TAGS.verses);
  redirect("/admin/verses?saved=collection");
}
