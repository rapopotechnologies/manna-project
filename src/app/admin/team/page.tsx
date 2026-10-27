import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { inviteAdmin, removeAdmin } from "./actions";

export default function TeamPage({ searchParams }: PageProps<"/admin/team">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Team searchParams={searchParams} />
    </Suspense>
  );
}

const errors: Record<string, string> = {
  email: "That doesn’t look like an email address.",
  exists: "That person is already on the team.",
  failed: "Couldn’t add them. Try again.",
};

async function Team({ searchParams }: { searchParams: PageProps<"/admin/team">["searchParams"] }) {
  const admin = await requireAdmin({ superadmin: true });
  const { invited, removed, error } = await searchParams;
  const { data } = await admin.supabase.from("admins").select("*").order("role", { ascending: false }).order("created_at");

  return (
    <AdminShell
      admin={admin}
      title="Team"
      intro="People who can sign in to this admin. Only the superadmin sees this page."
    >
      {typeof error === "string" && errors[error] && <p className="notice notice-error" role="alert">{errors[error]}</p>}
      {invited && (
        <p className="notice notice-ok" role="status">
          Added {String(invited)}. Send them to bymannaproject.com/admin/login to sign in with that email.
        </p>
      )}
      {removed && <p className="notice notice-ok" role="status">Removed. They can no longer edit the site.</p>}

      <section className="panel table-scroll">
        <table className="admin-table">
          <thead>
            <tr><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Added</th><th scope="col"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((m) => (
              <tr key={m.email}>
                <td>{m.email}</td>
                <td><span className={`pill${m.role === "superadmin" ? " on" : ""}`}>{m.role === "superadmin" ? "Superadmin" : "Admin"}</span></td>
                <td className="muted">{new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{m.invited_by ? ` by ${m.invited_by}` : ""}</td>
                <td>
                  {m.role === "admin" && (
                    <form action={removeAdmin} className="row-actions">
                      <input type="hidden" name="email" value={m.email} />
                      <button className="icon-btn" type="submit">Remove</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" aria-labelledby="invite">
        <h2 id="invite">Invite someone</h2>
        <form action={inviteAdmin} className="admin-form">
          <label className="field" htmlFor="invite-email">
            <span>Their email</span>
            <input id="invite-email" name="email" type="email" required placeholder="name@example.com" />
            <small>They can edit products, verses and questions, and see traffic. They can’t manage the team.</small>
          </label>
          <div><button className="btn btn-primary" type="submit">Add to team</button></div>
        </form>
        <p className="notice notice-warn">
          Sign-in emails only reach new team members once a proper email sender is connected in Supabase. Until then, Supabase’s
          built-in email only delivers to the Supabase account owner.
        </p>
      </section>
    </AdminShell>
  );
}
