"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { passwordProblem } from "@/lib/admin/passwords";

export type PasswordState = { error?: string };

/** Sets the signed-in admin's own password and clears the "temporary password" flag. */
export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const admin = await requireAdmin({ allowPasswordChange: true });
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const problem = passwordProblem(password, confirm);
  if (problem) return { error: problem };

  // Clearing the temporary-password flag happens in the same call, with the admin's own session.
  const { error } = await admin.supabase.auth.updateUser({ password, data: { must_change_password: false } });
  if (error) {
    return { error: error.code === "same_password" ? "That’s your current password. Choose a new one." : `Couldn’t change it: ${error.message}` };
  }

  // Pick up the cleared flag in the session cookie.
  await admin.supabase.auth.refreshSession();

  redirect("/admin?password=changed");
}
