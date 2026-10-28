"use client";

import { SITE_URL } from "@/lib/site";
import { useActionState, useState } from "react";
import { addMember, removeMember, resetPassword, type TeamState } from "./actions";

type Member = { email: string; role: "superadmin" | "admin"; created_at: string; invited_by: string | null };

function TempPassword({ state }: { state: TeamState }) {
  const [copied, setCopied] = useState(false);
  if (!state.tempPassword || !state.email) return null;
  const text = `Sign in at ${SITE_URL}/admin/login\nEmail: ${state.email}\nTemporary password: ${state.tempPassword}`;
  return (
    <div className="temp-password" role="status">
      <p>
        <b>{state.done === "added" ? `${state.email} can now sign in.` : `New temporary password for ${state.email}.`}</b> Send them
        these details. The password is shown only once, and they’ll choose their own when they sign in.
      </p>
      <pre>{text}</pre>
      <button
        type="button"
        className="btn btn-small"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Copied" : "Copy sign-in details"}
      </button>
    </div>
  );
}

function MemberActions({ member }: { member: Member }) {
  const [resetState, reset, resetting] = useActionState<TeamState, FormData>(resetPassword, {});
  const [removeState, remove, removing] = useActionState<TeamState, FormData>(removeMember, {});
  const [confirming, setConfirming] = useState(false);
  if (member.role === "superadmin") return <span className="muted">Change yours under “Your password”</span>;
  return (
    <div className="member-actions">
      <div className="row-actions">
        <form action={reset}>
          <input type="hidden" name="email" value={member.email} />
          <button className="icon-btn" type="submit" disabled={resetting}>{resetting ? "Resetting…" : "Reset password"}</button>
        </form>
        {confirming ? (
          <form action={remove}>
            <input type="hidden" name="email" value={member.email} />
            <button className="icon-btn btn-danger" type="submit" disabled={removing}>{removing ? "Removing…" : "Yes, remove"}</button>{" "}
            <button className="icon-btn" type="button" onClick={() => setConfirming(false)}>Keep</button>
          </form>
        ) : (
          <button className="icon-btn" type="button" onClick={() => setConfirming(true)}>Remove</button>
        )}
      </div>
      <TempPassword state={resetState} />
      {(resetState.error || removeState.error) && <p className="notice notice-error">{resetState.error ?? removeState.error}</p>}
    </div>
  );
}

export function TeamManager({ members, ready }: { members: Member[]; ready: boolean }) {
  const [state, action, pending] = useActionState<TeamState, FormData>(addMember, {});
  return (
    <>
      {!ready && (
        <p className="notice notice-warn">
          Team changes need the Supabase secret key. Add <code>SUPABASE_SECRET_KEY</code> to the Vercel project settings (and
          <code> .env.local</code> for local testing), then redeploy.
        </p>
      )}

      <section className="panel" aria-labelledby="members">
        <h2 id="members">Team members</h2>
        <ul className="member-list">
          {members.map((m) => (
            <li key={m.email}>
              <div>
                <b>{m.email}</b> <span className={`pill${m.role === "superadmin" ? " on" : ""}`}>{m.role === "superadmin" ? "Superadmin" : "Admin"}</span>
                <div className="muted" style={{ fontSize: "0.82rem" }}>
                  Added {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {m.invited_by ? ` by ${m.invited_by}` : ""}
                </div>
              </div>
              <MemberActions member={m} />
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="add">
        <h2 id="add">Add someone to the team</h2>
        <form action={action} className="admin-form">
          <label className="field" htmlFor="member-email">
            <span>Their email</span>
            <input id="member-email" name="email" type="email" required placeholder="name@example.com" disabled={!ready} />
            <small>They can edit products, verses and questions, and see traffic. They can’t manage the team.</small>
          </label>
          <div><button className="btn btn-primary" type="submit" disabled={pending || !ready}>{pending ? "Adding…" : "Add and create login"}</button></div>
        </form>
        {state.error && <p className="notice notice-error" role="alert">{state.error}</p>}
        <TempPassword state={state} />
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Nothing is emailed. You’ll get a temporary password to send them yourself. Only people on this list can sign in.
        </p>
      </section>
    </>
  );
}
