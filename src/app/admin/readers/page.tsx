import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { canSendEmail } from "@/lib/email";
import type { ReaderStatus } from "@/lib/supabase/database.types";
import { approveAll, decideReader } from "./actions";

export default function ReadersPage({ searchParams }: PageProps<"/admin/readers">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Readers searchParams={searchParams} />
    </Suspense>
  );
}

const TABS: { status: ReaderStatus; label: string }[] = [
  { status: "pending", label: "Waiting" },
  { status: "approved", label: "Approved" },
  { status: "declined", label: "Declined" },
];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" });

async function Readers({ searchParams }: { searchParams: PageProps<"/admin/readers">["searchParams"] }) {
  const admin = await requireAdmin();
  const { show, emailed } = await searchParams;
  const tab: ReaderStatus = show === "approved" || show === "declined" ? show : "pending";

  const [{ data: rows }, { data: team }, ...counts] = await Promise.all([
    admin.supabase.from("readers").select("*").eq("status", tab).order("signed_up_at", { ascending: false }).limit(200),
    admin.supabase.from("admins").select("email"),
    ...TABS.map((t) => admin.supabase.from("readers").select("user_id", { count: "exact", head: true }).eq("status", t.status)),
  ]);
  const teamEmails = new Set((team ?? []).map((t) => t.email));
  const list = (rows ?? []).filter((r) => !teamEmails.has(r.email));
  const count = (s: ReaderStatus) => counts[TABS.findIndex((t) => t.status === s)]?.count ?? 0;

  return (
    <AdminShell
      admin={admin}
      title="Readers"
      intro="People who created an account. New accounts wait here until someone on the team approves them. While waiting, their progress still saves on their own device."
      actions={
        tab === "pending" && list.length > 1 ? (
          <form action={approveAll}>
            <button className="btn" type="submit">Approve all {list.length}</button>
          </form>
        ) : undefined
      }
    >
      {emailed === "sent" && <p className="notice notice-ok" role="status">Approved, and a welcome email is on its way.</p>}
      {emailed === "skipped" && (
        <p className="notice notice-warn" role="status">
          Approved, but the welcome email couldn’t be sent. Check that RESEND_API_KEY is set in Vercel and the domain is verified in Resend.
        </p>
      )}

      <nav className="reader-tabs" aria-label="Reader status">
        {TABS.map((t) => (
          <Link key={t.status} href={t.status === "pending" ? "/admin/readers" : `/admin/readers?show=${t.status}`} aria-current={tab === t.status ? "page" : undefined}>
            {t.label} <span className="pill">{count(t.status)}</span>
          </Link>
        ))}
      </nav>

      <section className="panel">
        {list.length === 0 ? (
          <p className="muted">{tab === "pending" ? "Nobody is waiting. New sign-ups will appear here." : "No one here yet."}</p>
        ) : (
          <ul className="member-list">
            {list.map((r) => (
              <li key={r.user_id}>
                <div>
                  <b>{r.email}</b>
                  <div className="muted" style={{ fontSize: "0.82rem" }}>
                    Signed up {when(r.signed_up_at)}
                    {r.decided_by && r.decided_at ? ` · ${r.status === "approved" ? "Approved" : "Declined"} by ${r.decided_by}, ${when(r.decided_at)}` : ""}
                  </div>
                </div>
                <form action={decideReader} className="row-actions">
                  <input type="hidden" name="user_id" value={r.user_id} />
                  <input type="hidden" name="tab" value={tab} />
                  {r.status !== "approved" && <button className="icon-btn approve-btn" name="decision" value="approve" type="submit">Approve</button>}
                  {r.status !== "declined" && <button className="icon-btn" name="decision" value="decline" type="submit">Decline</button>}
                  {r.status !== "pending" && <button className="icon-btn" name="decision" value="reset" type="submit">Move to waiting</button>}
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        {canSendEmail()
          ? "Approving someone sends them a short welcome email. Declining doesn’t email them."
          : "Readers aren’t emailed yet: add RESEND_API_KEY in Vercel to send a welcome email on approval. They’ll see their status on their account page either way."}
      </p>
    </AdminShell>
  );
}
