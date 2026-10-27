"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CONTENT_TAGS } from "@/lib/content";

const RESTORABLE = {
  products: { key: "slug", tag: CONTENT_TAGS.products },
  hidden_verses: { key: "slug", tag: CONTENT_TAGS.verses },
  collections: { key: "id", tag: CONTENT_TAGS.verses },
} as const;

/** Puts a product, verse or collection back the way it was before a change. */
export async function restoreVersion(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = Number(formData.get("id"));
  const { data: entry } = await supabase.from("change_log").select("*").eq("id", id).maybeSingle();
  const target = entry ? RESTORABLE[entry.target_table as keyof typeof RESTORABLE] : undefined;
  if (!entry || !target || !entry.before || typeof entry.before !== "object") redirect("/admin/history?error=restore");

  const row = { ...(entry.before as Record<string, unknown>) };
  delete row.updated_at;
  const { error } = await supabase.from(entry.target_table as keyof typeof RESTORABLE).upsert(row as never, { onConflict: target.key });
  if (error) redirect("/admin/history?error=restore");
  updateTag(target.tag);
  redirect(`/admin/history?restored=${encodeURIComponent(entry.target_id)}`);
}
