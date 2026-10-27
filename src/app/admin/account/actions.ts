"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { passwordProblem } from "@/lib/admin/passwords";
import { createServiceClient } from "@/lib/supabase/admin";

export type PasswordState = { error?: string };

/** Sets the signed-in admin's own password and clears the "temporary password" flag. */
export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const admin = await requireAdmin({ allowPasswordChange: true });
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const problem = passwordProblem(password, confirm);
  if (problem) return { error: problem };

  const { error } = await admin.supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.code === "same_password" ? "That’s your current password. Choose a new one." : `Couldn’t change it: ${error.message}` };
  }

  if (admin.mustChangePassword) {
    const { error: metaError } = await createServiceClient().auth.admin.updateUserById(admin.userId, {
      app_metadata: { must_change_password: false },
    });
    if (metaError) return { error: "Your password changed, but we couldn’t finish setup. Try again." };
    // Pick up the updated flag in the session cookie.
    await admin.supabase.auth.refreshSession();
  }

  redirect("/admin?password=changed");
}
