"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const MIN = 8;

/** Reached from the password-reset email (which signs the reader in for this one step). */
export function ResetPassword() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setReady(Boolean(data.user)));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (password !== confirm) return setError("The two passwords don’t match.");
    setBusy(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(updateError.code === "same_password" ? "That’s your current password. Choose a new one." : updateError.message);
    router.push("/account?reset=1");
  }

  if (ready === null) return <p className="lede">One moment…</p>;
  if (!ready) {
    return (
      <p className="notice-soft">
        This reset link has expired or was opened on a different device. <Link href="/account">Request a new one</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="auth-card auth-form" style={{ maxWidth: 460 }}>
      <label className="auth-field" htmlFor="reset-password">
        <span>New password</span>
        <input id="reset-password" type="password" autoComplete="new-password" minLength={MIN} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <small>At least {MIN} characters.</small>
      </label>
      <label className="auth-field" htmlFor="reset-confirm">
        <span>Type it again</span>
        <input id="reset-confirm" type="password" autoComplete="new-password" minLength={MIN} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      {error && <p className="auth-message error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
