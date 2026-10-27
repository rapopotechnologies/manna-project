import { redirect } from "next/navigation";
import { cache } from "react";
import type { AdminRole } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Admin = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  email: string;
  role: AdminRole;
  mustChangePassword: boolean;
};

/** The signed-in person and their team role, once per request. Null role = signed in but not on the team. */
export const getSignedIn = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email.toLowerCase() : null;
  if (!claims || !email) return null;
  // Row-level security only returns team rows to team members.
  const { data: row } = await supabase.from("admins").select("role").eq("email", email).maybeSingle();
  const appMeta = (claims.app_metadata ?? {}) as { must_change_password?: boolean };
  return {
    supabase,
    userId: String(claims.sub),
    email,
    role: row?.role ?? null,
    mustChangePassword: appMeta.must_change_password === true,
  };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(options: { superadmin?: boolean; allowPasswordChange?: boolean } = {}): Promise<Admin> {
  const who = await getSignedIn();
  if (!who) redirect("/admin/login");
  if (!who.role) redirect("/admin/login?error=not-on-team");
  // A temporary password has to be replaced before anything else.
  if (who.mustChangePassword && !options.allowPasswordChange) redirect("/admin/account?first=1");
  if (options.superadmin && who.role !== "superadmin") redirect("/admin");
  return who as Admin;
}
