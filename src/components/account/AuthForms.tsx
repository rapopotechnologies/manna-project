"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Mode = "sign-in" | "sign-up" | "forgot";
const MIN = 8;
const GOOGLE_ON = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN === "on";

const callback = (next: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

/** Sign in, create an account, or reset a forgotten password. */
export function AuthForms({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string; resend?: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) {
          const unconfirmed = /confirm/i.test(error.message);
          setMessage({
            kind: "error",
            text: unconfirmed
              ? "Please confirm your email first. Open the link we sent you."
              : "That email and password don’t match. You can reset your password below.",
            resend: unconfirmed,
          });
        } else {
          onSignedIn();
        }
      } else if (mode === "sign-up") {
        if (password.length < MIN) {
          setMessage({ kind: "error", text: `Use at least ${MIN} characters for your password.` });
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: callback("/account?welcome=1") },
        });
        if (error) {
          setMessage({ kind: "error", text: error.status === 429 ? "Too many tries. Wait a few minutes and try again." : error.message });
        } else if (data.session) {
          onSignedIn();
        } else {
          setMessage({
            kind: "ok",
            text: `Almost there. We sent a confirmation link to ${cleanEmail}. Open it on this device to finish creating your account.`,
          });
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: callback("/account/reset") });
        setMessage(
          error && error.status === 429
            ? { kind: "error", text: "Too many tries. Wait a few minutes and try again." }
            : { kind: "ok", text: `If ${cleanEmail} has an account, a link to choose a new password is on its way.` },
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    await createClient().auth.resend({ type: "signup", email: email.trim().toLowerCase(), options: { emailRedirectTo: callback("/account?welcome=1") } });
    setBusy(false);
    setMessage({ kind: "ok", text: "We sent the confirmation link again." });
  }

  async function google() {
    await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback("/account") } });
  }

  const titles: Record<Mode, string> = { "sign-in": "Sign in", "sign-up": "Create your free account", forgot: "Reset your password" };

  return (
    <div className="auth-card">
      {mode !== "forgot" && (
        <div className="auth-tabs" role="tablist" aria-label="Account">
          <button type="button" role="tab" aria-selected={mode === "sign-in"} onClick={() => { setMode("sign-in"); setMessage(null); }}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "sign-up"} onClick={() => { setMode("sign-up"); setMessage(null); }}>Create account</button>
        </div>
      )}
      <h2>{titles[mode]}</h2>

      {GOOGLE_ON && mode !== "forgot" && (
        <>
          <button type="button" className="btn btn-google" onClick={google}>
            <GoogleGlyph /> Continue with Google
          </button>
          <p className="auth-or"><span>or with email</span></p>
        </>
      )}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-field" htmlFor="account-email">
          <span>Email</span>
          <input id="account-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "forgot" && (
          <label className="auth-field" htmlFor="account-password">
            <span>Password</span>
            <input
              id="account-password"
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
              minLength={mode === "sign-up" ? MIN : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "sign-up" && <small>At least {MIN} characters.</small>}
          </label>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "One moment…" : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : "Email me a reset link"}
        </button>
      </form>

      {message && (
        <p className={`auth-message ${message.kind}`} role={message.kind === "error" ? "alert" : "status"}>
          {message.text}{" "}
          {message.resend && <button type="button" className="link-button" onClick={resend} disabled={busy}>Send it again</button>}
        </p>
      )}

      <p className="auth-switch">
        {mode === "forgot" ? (
          <button type="button" className="link-button" onClick={() => { setMode("sign-in"); setMessage(null); }}>Back to sign in</button>
        ) : (
          <button type="button" className="link-button" onClick={() => { setMode("forgot"); setMessage(null); }}>Forgot your password?</button>
        )}
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
