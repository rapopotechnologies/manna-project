import Link from "next/link";
import { signOut } from "@/app/admin/login/actions";
import { Wordmark } from "@/components/Wordmark";
import type { Admin } from "@/lib/admin/auth";
import { AdminNav } from "./AdminNav";

type Props = {
  admin: Admin;
  title: string;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminShell({ admin, title, intro, actions, children }: Props) {
  return (
    <div className="admin-frame">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand" aria-label="Admin overview">
          <Wordmark />
          <span>Admin</span>
        </Link>
        <nav aria-label="Admin">
          <AdminNav superadmin={admin.role === "superadmin"} />
        </nav>
        <div className="admin-who">
          <span className="admin-email">{admin.email}</span>
          <span className="admin-role">{admin.role === "superadmin" ? "Superadmin" : "Admin"}</span>
          <div className="admin-who-actions">
            <Link href="/" target="_blank">View site ↗</Link>
            <form action={signOut}>
              <button type="submit" className="link-button">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="admin-main" id="main">
        <header className="admin-head">
          <div>
            <h1>{title}</h1>
            {intro && <p className="muted">{intro}</p>}
          </div>
          {actions && <div className="admin-head-actions">{actions}</div>}
        </header>
        {children}
      </main>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="admin-frame">
      <aside className="admin-side" />
      <main className="admin-main">
        <p className="muted">Loading…</p>
      </main>
    </div>
  );
}
