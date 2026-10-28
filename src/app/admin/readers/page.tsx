import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { canSendEmail } from "@/lib/email";
import type { ReaderStatus } from "@/lib/supabase/database.types";
import { approveAll, decideReader, deleteReader, sendPasswordReset } from "./actions";

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

const NOTICES: Record<string, { kind: "ok" | "warn" | "error"; text: string }> = {
  "approved-emailed": { kind: "ok", text: "Approved, and a welcome email is on its way." },
  approved: { kind: "ok", text: "Approved. No welcome email was sent (add RESEND_API_KEY in Vercel to send one)." },
  declined: { kind: "ok", text: "Declined. They weren’t emailed." },
  moved: { kind: "ok", text: "Moved back to waiting." },
  "reset-sent": { kind: "ok", text: "Password reset email sent. The link works once and expires after an hour." },
  "reset-failed": { kind: "error", text: "Couldn’t send the reset email. Wait a minute and try again." },
  deleted: { kind: "ok", text: "Account and saved progress deleted." },
  confirm: { kind: "warn", text: "Tick the box to confirm before deleting an account." },
  error: { kind: "error", text: "That didn’t work. Refresh the page and try again." },
};

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" })
    : "never";

async function Readers({ searchParams }: { searchParams: PageProps<"/admin/readers">["searchParams"] }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const tab: ReaderStatus = sp.show === "approved" || sp.show === "declined" ? sp.show : "pending";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const notice = typeof sp.notice === "string" ? NOTICES[sp.notice] : undefined;

  const { data } = await admin.supabase.rpc("admin_reader_details", { search: q });
  const all = data ?? [];
  const list = all.filter((r) => r.status === tab);
  const count = (s: ReaderStatus) => all.filter((r) => r.status === s).length;
  const tabHref = (s: ReaderStatus) => {
    const params = new URLSearchParams();
    if (s !== "pending") params.set("show", s);
    if (q) params.set("q", q);
    return `/admin/readers${params.size ? `?${params}` : ""}`;
  };

  return (
    <AdminShell
      admin={admin}
      title="Readers"
      intro="People who created an account. New accounts wait here until someone on the team approves them. While waiting, their progress still saves on their own device."
      actions={
        tab === "pending" && list.length > 1 && !q ? (
          <form action={approveAll}>
            <button className="btn" type="submit">Approve all {list.length}</button>
          </form>
        ) : undefined
      }
    >
      {notice && <p className={`notice notice-${notice.kind}`} role="status">{notice.text}</p>}

      <div className="reader-bar">
        <nav className="reader-tabs" aria-label="Reader status">
          {TABS.map((t) => (
            <Link key={t.status} href={tabHref(t.status)} aria-current={tab === t.status ? "page" : undefined}>
              {t.label} <span className="pill">{count(t.status)}</span>
            </Link>
          ))}
        </nav>
        <form className="reader-search" role="search" action="/admin/readers">
          {tab !== "pending" && <input type="hidden" name="show" value={tab} />}
          <label className="sr-only" htmlFor="reader-q">Search by email</label>
          <input id="reader-q" name="q" type="search" defaultValue={q} placeholder="Search by email" />
          <button className="icon-btn" type="submit">Search</button>
          {q && <Link className="icon-btn" href={tabHref(tab).replace(/[?&]q=[^&]*/, "")}>Clear</Link>}
        </form>
      </div>

      <section className="panel">
        {list.length === 0 ? (
          <p className="muted">
            {q ? `No ${TABS.find((t) => t.status === tab)!.label.toLowerCase()} readers match “${q}”.` : tab === "pending" ? "Nobody is waiting. New sign-ups will appear here." : "No one here yet."}
          </p>
        ) : (
          <ul className="reader-list">
            {list.map((r) => (
              <li key={r.user_id}>
                <div className="reader-main">
                  <div>
                    <b>{r.email}</b> <span className="pill">{r.provider === "google" ? "Google" : "Email"}</span>
                  </div>
                  <div className="muted reader-meta">
                    Signed up {when(r.signed_up_at)} · Last signed in {when(r.last_sign_in_at)}
                    {r.decided_by && r.decided_at ? ` · ${r.status === "approved" ? "Approved" : "Declined"} by ${r.decided_by}, ${when(r.decided_at)}` : ""}
                  </div>
                  {r.status === "approved" && (
                    <div className="reader-progress">
                      {r.synced_at
                        ? `${r.mornings} ${r.mornings === 1 ? "morning" : "mornings"} · ${r.books} of 66 books · ${r.flowers} ${r.flowers === 1 ? "flower" : "flowers"} · last saved ${when(r.synced_at)}`
                        : "Nothing saved to their account yet. It syncs on their next visit."}
                    </div>
                  )}
                </div>

                <div className="reader-actions">
                  <form action={decideReader} className="row-actions">
                    <input type="hidden" name="user_id" value={r.user_id} />
                    <input type="hidden" name="tab" value={tab} />
                    <input type="hidden" name="q" value={q} />
                    {r.status !== "approved" && <button className="icon-btn approve-btn" name="decision" value="approve" type="submit">Approve</button>}
                    {r.status !== "declined" && <button className="icon-btn" name="decision" value="decline" type="submit">Decline</button>}
                    {r.status !== "pending" && <button className="icon-btn" name="decision" value="reset" type="submit">Move to waiting</button>}
                  </form>

                  <details className="reader-more">
                    <summary>More</summary>
                    <div className="reader-more-body">
                      {r.provider === "email" ? (
                        <form action={sendPasswordReset}>
                          <input type="hidden" name="user_id" value={r.user_id} />
                          <input type="hidden" name="tab" value={tab} />
                          <input type="hidden" name="q" value={q} />
                          <button className="icon-btn" type="submit">Email a password reset link</button>
                        </form>
                      ) : (
                        <p className="muted reader-meta">Signs in with Google, so there’s no password to reset.</p>
                      )}
                      <form action={deleteReader} className="reader-delete">
                        <input type="hidden" name="user_id" value={r.user_id} />
                        <input type="hidden" name="tab" value={tab} />
                        <input type="hidden" name="q" value={q} />
                        <label className="check"><input type="checkbox" name="confirm" /> Delete {r.email} and their saved progress</label>
                        <button className="icon-btn btn-danger" type="submit">Delete account</button>
                      </form>
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        {canSendEmail()
          ? "Approving someone sends them a short welcome email. Declining doesn’t email them."
          : "Readers aren’t emailed yet: add RESEND_API_KEY in Vercel to send a welcome email on approval. They’ll see their status on their account page either way."}{" "}
        Team members don’t appear here.
      </p>
    </AdminShell>
  );
}
