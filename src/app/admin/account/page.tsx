import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { PasswordForm } from "./PasswordForm";

export default function AccountPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Account />
    </Suspense>
  );
}

async function Account() {
  const admin = await requireAdmin({ allowPasswordChange: true });
  return (
    <AdminShell
      admin={admin}
      title={admin.mustChangePassword ? "Choose your password" : "Your password"}
      intro={
        admin.mustChangePassword
          ? "You signed in with a temporary password. Choose your own to finish setting up your account."
          : "Change the password you use to sign in."
      }
    >
      <section className="panel" style={{ maxWidth: 520 }}>
        <PasswordForm />
      </section>
    </AdminShell>
  );
}
