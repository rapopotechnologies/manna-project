import { redirect } from "next/navigation";
import { cache } from "react";
import type { AdminRole } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Admin = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  email: string;
  role: AdminRole;
};

/** The signed-in person and their team role, once per request. Null role = signed in but not on the team. */
export const getSignedIn = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  if (!email) return null;
  // Row-level security only returns team rows to team members.
  const { data: row } = await supabase.from("admins").select("role").eq("email", email).maybeSingle();
  return { supabase, email, role: row?.role ?? null };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(options: { superadmin?: boolean } = {}): Promise<Admin> {
  const who = await getSignedIn();
  if (!who) redirect("/admin/login");
  if (!who.role) redirect("/admin/login?error=not-on-team");
  if (options.superadmin && who.role !== "superadmin") redirect("/admin");
  return who as Admin;
}
