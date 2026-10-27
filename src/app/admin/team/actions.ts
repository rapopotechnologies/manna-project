"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { temporaryPassword } from "@/lib/admin/passwords";
import { createServiceClient } from "@/lib/supabase/admin";

export type TeamState = { error?: string; email?: string; tempPassword?: string; done?: "added" | "reset" | "removed" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function findUserId(email: string): Promise<string | null> {
  const service = createServiceClient();
  // The team is small, so one page of users is plenty.
  const { data } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
  return data?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
}

/** Creates a login with a temporary password and adds the email to the team. */
export async function addMember(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const { supabase, email: superadmin } = await requireAdmin({ superadmin: true });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { error: "That doesn’t look like an email address." };

  const service = createServiceClient();
  const tempPassword = temporaryPassword();
  const existing = await findUserId(email);
  if (existing) {
    const { error } = await service.auth.admin.updateUserById(existing, {
      password: tempPassword,
      user_metadata: { must_change_password: true },
    });
    if (error) return { error: `Couldn’t set up their login: ${error.message}` };
  } else {
    const { error } = await service.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { must_change_password: true },
    });
    if (error) return { error: `Couldn’t create their login: ${error.message}` };
  }

  const { error } = await supabase.from("admins").insert({ email, role: "admin", invited_by: superadmin });
  if (error && error.code !== "23505") return { error: `Their login was created, but adding them to the team failed: ${error.message}` };

  revalidatePath("/admin/team");
  return { done: "added", email, tempPassword };
}

/** Gives a team member a new temporary password. They choose their own at next sign-in. */
export async function resetPassword(_prev: TeamState, formData: FormData): Promise<TeamState> {
  await requireAdmin({ superadmin: true });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const service = createServiceClient();
  const tempPassword = temporaryPassword();
  const id = await findUserId(email);
  const result = id
    ? await service.auth.admin.updateUserById(id, { password: tempPassword, user_metadata: { must_change_password: true } })
    : await service.auth.admin.createUser({ email, password: tempPassword, email_confirm: true, user_metadata: { must_change_password: true } });
  if (result.error) return { error: `Couldn’t reset it: ${result.error.message}` };
  return { done: "reset", email, tempPassword };
}

/** Takes someone off the team and deletes their login. */
export async function removeMember(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const { supabase } = await requireAdmin({ superadmin: true });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Row-level security also blocks removing the superadmin.
  const { data: removed } = await supabase.from("admins").delete().eq("email", email).eq("role", "admin").select("email");
  if (!removed?.length) return { error: "Couldn’t remove them." };
  const id = await findUserId(email);
  if (id) await createServiceClient().auth.admin.deleteUser(id);
  revalidatePath("/admin/team");
  return { done: "removed", email };
}
