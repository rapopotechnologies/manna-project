"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { sendApprovedEmail } from "@/lib/email";

const SHOW = { approved: "approved", declined: "declined", pending: "" } as const;

/** Approve or decline a reader account. Approved readers get a welcome email. */
export async function decideReader(formData: FormData) {
  const { supabase, email } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const decision = formData.get("decision");
  const status = decision === "approve" ? "approved" : decision === "decline" ? "declined" : decision === "reset" ? "pending" : null;
  if (!userId || !status) return;

  const { data: updated } = await supabase
    .from("readers")
    .update({ status, decided_at: status === "pending" ? null : new Date().toISOString(), decided_by: status === "pending" ? null : email })
    .eq("user_id", userId)
    .select("email")
    .maybeSingle();

  let emailed = "";
  if (status === "approved" && updated?.email) {
    emailed = (await sendApprovedEmail(updated.email)) ? "sent" : "skipped";
  }
  revalidatePath("/admin/readers");
  revalidatePath("/admin");
  const from = String(formData.get("tab") ?? "pending") as keyof typeof SHOW;
  const params = new URLSearchParams();
  if (SHOW[from]) params.set("show", SHOW[from]);
  if (emailed) params.set("emailed", emailed);
  redirect(`/admin/readers${params.size ? `?${params}` : ""}`);
}

/** Approves everyone currently waiting, and emails each of them. */
export async function approveAll() {
  const { supabase, email } = await requireAdmin();
  const { data: approved } = await supabase
    .from("readers")
    .update({ status: "approved", decided_at: new Date().toISOString(), decided_by: email })
    .eq("status", "pending")
    .select("email");
  const results = await Promise.all((approved ?? []).map((r) => sendApprovedEmail(r.email)));
  revalidatePath("/admin/readers");
  revalidatePath("/admin");
  redirect(results.length ? `/admin/readers?emailed=${results.every(Boolean) ? "sent" : "skipped"}` : "/admin/readers");
}
