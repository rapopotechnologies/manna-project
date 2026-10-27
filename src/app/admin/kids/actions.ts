"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CONTENT_TAGS } from "@/lib/content";

const clean = (v: FormDataEntryValue | null) => String(v ?? "").replace(/\s+/g, " ").trim();

export async function updateQuestion(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = Number(formData.get("id"));
  const question = clean(formData.get("question"));
  if (!id || question.length < 3) redirect("/admin/kids?error=short");
  await supabase.from("kids_questions").update({ question }).eq("id", id);
  updateTag(CONTENT_TAGS.kids);
  redirect(`/admin/kids?saved=${id}#q-${id}`);
}

export async function addQuestion(formData: FormData) {
  const { supabase } = await requireAdmin();
  const question = clean(formData.get("question"));
  if (question.length < 3) redirect("/admin/kids?error=short");
  const { data: last } = await supabase.from("kids_questions").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
  await supabase.from("kids_questions").insert({ question, position: (last?.position ?? 0) + 1 });
  updateTag(CONTENT_TAGS.kids);
  redirect("/admin/kids?added=1#add");
}

export async function deleteQuestion(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = Number(formData.get("id"));
  const { count } = await supabase.from("kids_questions").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 7) redirect("/admin/kids?error=min");
  await supabase.from("kids_questions").delete().eq("id", id);
  // Close the gap so the daily rotation keeps a simple 1…N order.
  const { data } = await supabase.from("kids_questions").select("id, position").order("position");
  const moves = (data ?? []).map((r, i) => ({ ...r, next: i + 1 })).filter((r) => r.position !== r.next);
  for (const r of moves) await supabase.from("kids_questions").update({ position: r.next }).eq("id", r.id);
  updateTag(CONTENT_TAGS.kids);
  redirect("/admin/kids?removed=1");
}
