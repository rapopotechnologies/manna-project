import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { hasServiceKey } from "@/lib/supabase/admin";
import { TeamManager } from "./TeamManager";

export default function TeamPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Team />
    </Suspense>
  );
}

async function Team() {
  const admin = await requireAdmin({ superadmin: true });
  const { data } = await admin.supabase.from("admins").select("*").order("role", { ascending: false }).order("created_at");
  return (
    <AdminShell admin={admin} title="Team" intro="People who can sign in to this admin. Only the superadmin sees this page.">
      <TeamManager members={data ?? []} ready={hasServiceKey()} />
    </AdminShell>
  );
}
