"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useProgress } from "@/lib/progress";
import { getSyncStatus, readLocal, startSync, stopSync, SYNC_EVENT, type SyncStatus } from "@/lib/sync";
import { AuthForms } from "./AuthForms";

type User = { email: string };

export function AccountPanel({ notice }: { notice?: "welcome" | "link" | "reset" }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [sync, setSync] = useState<SyncStatus>(getSyncStatus());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const progress = useProgress();

  const load = useCallback(async () => {
    const { data } = await createClient().auth.getUser();
    setUser(data.user?.email ? { email: data.user.email } : null);
    if (data.user) await startSync();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the session once in the browser
    void load();
    const onSync = (e: Event) => setSync((e as CustomEvent<SyncStatus>).detail);
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, [load]);

  async function signOut() {
    stopSync();
    await createClient().auth.signOut();
    setUser(null);
  }

  function download() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...readLocal() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-manna.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function deleteAccount() {
    setError("");
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    if (rpcError) {
      setError(
        /Team members/.test(rpcError.message)
          ? "Team accounts can’t be deleted here. Ask the superadmin."
          : "Couldn’t delete your account just now. Try again.",
      );
      return;
    }
    stopSync();
    await supabase.auth.signOut();
    setUser(null);
    setConfirmDelete(false);
  }

  if (user === undefined) return <p className="lede">Checking your account…</p>;

  if (!user) {
    return (
      <div className="account-grid">
        <div className="account-why">
          {notice === "link" && <p className="notice-soft">That link didn’t work. It may have expired or been opened on a different device. Try again below.</p>}
          <h2>Why have an account?</h2>
          <ul className="fixtures">
            <li>Your manna jar, bookshelf and garden on every device</li>
            <li>Your S.O.A.P. reflections, saved safely</li>
            <li>Hidden verses you’ve found, and your kids’ sticker chart</li>
          </ul>
          <p className="muted-line">
            Completely optional. Today’s verse never needs an account. What’s already saved on this device moves into your account the first
            time you sign in.
          </p>
        </div>
        <AuthForms onSignedIn={load} />
      </div>
    );
  }

  const gathered = progress?.gathered.length ?? 0;
  const books = progress ? Object.keys(progress.books).length : 0;
  const flowers = progress?.reflections.length ?? 0;

  return (
    <div className="account-signed-in">
      {notice === "welcome" && sync.state !== "pending" && sync.state !== "declined" && (
        <p className="notice-soft">Welcome! Your account is ready, and everything on this device is now saved to it.</p>
      )}
      {notice === "reset" && <p className="notice-soft">Your new password is saved.</p>}

      {sync.state === "pending" && (
        <p className="notice-soft">
          <b>Thanks for signing up!</b> Your account is waiting for approval from the Manna Project team. Until then, your jar, shelf
          and garden keep saving on this device, and they’ll move into your account as soon as you’re approved.
        </p>
      )}
      {sync.state === "declined" && (
        <p className="notice-soft">
          Your account wasn’t approved. Everything still works on this device. Questions? <Link href="/contact">Get in touch</Link>.
        </p>
      )}

      <section className="progress-card" aria-labelledby="acct">
        <div className="progress-head">
          <span className="label">Signed in</span>
          <h2 id="acct" className="account-email">{user.email}</h2>
        </div>
        <p className="muted-line" role="status">
          {sync.state === "syncing" && "Saving to your account…"}
          {sync.state === "synced" && `Saved to your account${sync.at ? ` at ${new Date(sync.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}.`}
          {sync.state === "error" && "Couldn’t reach your account just now. Your progress is safe on this device and will save next time."}
          {sync.state === "idle" && "Your progress saves to your account automatically."}
          {sync.state === "pending" && "Waiting for approval. Saving on this device for now."}
          {sync.state === "declined" && "Saving on this device only."}
        </p>
        <div className="account-stats">
          <div><b>{gathered}</b><span>mornings gathered</span></div>
          <div><b>{books}</b><span>of 66 books</span></div>
          <div><b>{flowers}</b><span>flowers planted</span></div>
        </div>
        <div className="porch-ctas">
          <Link className="btn btn-primary" href="/my-manna">See my manna</Link>
          <button type="button" className="btn" onClick={download}>Download my data</button>
          <button type="button" className="btn" onClick={signOut}>Sign out</button>
        </div>
      </section>

      <section className="progress-card" aria-labelledby="delete">
        <h2 id="delete" className="account-small-head">Delete account</h2>
        <p className="muted-line">
          Deletes your account and everything saved in it. What’s on this device stays until you clear your browser.
        </p>
        {confirmDelete ? (
          <div className="porch-ctas">
            <button type="button" className="btn btn-danger" onClick={deleteAccount}>Yes, delete my account</button>
            <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>Keep it</button>
          </div>
        ) : (
          <div><button type="button" className="btn" onClick={() => setConfirmDelete(true)}>Delete my account</button></div>
        )}
        {error && <p className="auth-message error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
