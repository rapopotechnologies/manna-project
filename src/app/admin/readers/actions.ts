"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { sendApprovedEmail } from "@/lib/email";

/** Back to the readers list, keeping the current tab and search, with a short notice. */
function back(formData: FormData, notice?: string): never {
  const params = new URLSearchParams();
  const tab = String(formData.get("tab") ?? "");
  const q = String(formData.get("q") ?? "");
  if (tab === "approved" || tab === "declined") params.set("show", tab);
  if (q) params.set("q", q);
  if (notice) params.set("notice", notice);
  revalidatePath("/admin/readers");
  revalidatePath("/admin");
  redirect(`/admin/readers${params.size ? `?${params}` : ""}`);
}

/** Approve or decline a reader account. Approved readers get a welcome email. */
export async function decideReader(formData: FormData) {
  const { supabase, email } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const decision = formData.get("decision");
  const status = decision === "approve" ? "approved" : decision === "decline" ? "declined" : decision === "reset" ? "pending" : null;
  if (!userId || !status) back(formData);

  const { data: updated } = await supabase
    .from("readers")
    .update({
      status: status!,
      decided_at: status === "pending" ? null : new Date().toISOString(),
      decided_by: status === "pending" ? null : email,
    })
    .eq("user_id", userId)
    .select("email")
    .maybeSingle();

  if (status === "approved" && updated?.email) {
    back(formData, (await sendApprovedEmail(updated.email)) ? "approved-emailed" : "approved");
  }
  back(formData, status === "declined" ? "declined" : "moved");
}

/** Approves everyone currently waiting, and emails each of them. */
export async function approveAll(formData: FormData) {
  const { supabase, email } = await requireAdmin();
  const { data: approved } = await supabase
    .from("readers")
    .update({ status: "approved", decided_at: new Date().toISOString(), decided_by: email })
    .eq("status", "pending")
    .select("email");
  const results = await Promise.all((approved ?? []).map((r) => sendApprovedEmail(r.email)));
  back(formData, results.length && results.every(Boolean) ? "approved-emailed" : "approved");
}

/** Emails a reader a link to choose a new password. */
export async function sendPasswordReset(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const { data: reader } = await supabase.from("readers").select("email").eq("user_id", userId).maybeSingle();
  if (!reader) back(formData, "error");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "bymannaproject.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const { error } = await supabase.auth.resetPasswordForEmail(reader!.email, {
    redirectTo: `${proto}://${host}/auth/callback?next=/account/reset`,
  });
  back(formData, error ? "reset-failed" : "reset-sent");
}

/** Deletes a reader's account and saved progress. Requires ticking the confirm box. */
export async function deleteReader(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  if (formData.get("confirm") !== "on") back(formData, "confirm");
  const { error } = await supabase.rpc("admin_delete_reader", { target: userId });
  back(formData, error ? "error" : "deleted");
}
