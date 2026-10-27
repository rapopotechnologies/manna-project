"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inviteAdmin(formData: FormData) {
  const { supabase, email: inviter } = await requireAdmin({ superadmin: true });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) redirect("/admin/team?error=email");
  const { error } = await supabase.from("admins").insert({ email, role: "admin", invited_by: inviter });
  if (error) redirect(`/admin/team?error=${error.code === "23505" ? "exists" : "failed"}`);
  revalidatePath("/admin/team");
  redirect(`/admin/team?invited=${encodeURIComponent(email)}`);
}

export async function removeAdmin(formData: FormData) {
  const { supabase } = await requireAdmin({ superadmin: true });
  const email = String(formData.get("email") ?? "");
  // Row-level security already blocks removing the superadmin; this is belt and braces.
  await supabase.from("admins").delete().eq("email", email).eq("role", "admin");
  revalidatePath("/admin/team");
  redirect("/admin/team?removed=1");
}
