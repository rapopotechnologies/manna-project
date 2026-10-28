"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { createClient } from "@/lib/supabase/browser";
import { Turnstile, TURNSTILE_SITE_KEY } from "./Turnstile";

type Mode = "sign-in" | "sign-up" | "forgot";
const MIN = 8;
const GOOGLE_ON = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN === "on";

const callback = (next: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

const T = {
  en: {
    confirmFirst: "Please confirm your email first. Open the link we sent you.",
    noMatch: "That email and password don’t match. You can reset your password below.",
    tooShort: (n: number) => `Use at least ${n} characters for your password.`,
    tooMany: "Too many tries. Wait a few minutes and try again.",
    almost: (email: string) => `Almost there. We sent a confirmation link to ${email}. Open it on this device to finish creating your account.`,
    resetSent: (email: string) => `If ${email} has an account, a link to choose a new password is on its way.`,
    resent: "We sent the confirmation link again.",
    titles: { "sign-in": "Sign in", "sign-up": "Create your free account", forgot: "Reset your password" } as Record<Mode, string>,
    tabs: "Account",
    signIn: "Sign in",
    create: "Create account",
    google: "Continue with Google",
    or: "or with email",
    email: "Email",
    password: "Password",
    min: (n: number) => `At least ${n} characters.`,
    wait: "One moment…",
    sendReset: "Email me a reset link",
    sendAgain: "Send it again",
    back: "Back to sign in",
    forgot: "Forgot your password?",
    human: "Please finish the quick check above first.",
    agree: "By creating an account you agree to our",
    privacy: "privacy & terms",
  },
  id: {
    confirmFirst: "Konfirmasi emailmu dulu. Buka tautan yang kami kirim.",
    noMatch: "Email dan kata sandi tidak cocok. Kamu bisa mengatur ulang kata sandi di bawah.",
    tooShort: (n: number) => `Gunakan minimal ${n} karakter untuk kata sandimu.`,
    tooMany: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.",
    almost: (email: string) => `Sedikit lagi. Kami mengirim tautan konfirmasi ke ${email}. Buka di perangkat ini untuk menyelesaikan pembuatan akun.`,
    resetSent: (email: string) => `Jika ${email} punya akun, tautan untuk membuat kata sandi baru sedang dikirim.`,
    resent: "Tautan konfirmasi sudah kami kirim lagi.",
    titles: { "sign-in": "Masuk", "sign-up": "Buat akun gratis", forgot: "Atur ulang kata sandi" } as Record<Mode, string>,
    tabs: "Akun",
    signIn: "Masuk",
    create: "Buat akun",
    google: "Lanjutkan dengan Google",
    or: "atau dengan email",
    email: "Email",
    password: "Kata sandi",
    min: (n: number) => `Minimal ${n} karakter.`,
    wait: "Sebentar…",
    sendReset: "Kirim tautan atur ulang",
    sendAgain: "Kirim lagi",
    back: "Kembali ke halaman masuk",
    forgot: "Lupa kata sandi?",
    human: "Selesaikan dulu pemeriksaan singkat di atas.",
    agree: "Dengan membuat akun, kamu menyetujui",
    privacy: "privasi & ketentuan",
  },
};

/** Sign in, create an account, or reset a forgotten password. */
export function AuthForms({ onSignedIn }: { onSignedIn: () => void }) {
  const lang = useLang();
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string; resend?: boolean } | null>(null);

  // Cloudflare Turnstile: each token works once, so get a fresh one after every attempt.
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaRound, setCaptchaRound] = useState(0);
  const captchaToken = captcha ?? undefined;
  const needsCaptcha = Boolean(TURNSTILE_SITE_KEY);
  const nextCaptcha = () => setCaptchaRound((n) => n + 1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (needsCaptcha && !captcha) {
      setMessage({ kind: "error", text: t.human });
      return;
    }
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password, options: { captchaToken } });
        if (error) {
          const unconfirmed = /confirm/i.test(error.message);
          setMessage({
            kind: "error",
            text: unconfirmed ? t.confirmFirst : t.noMatch,
            resend: unconfirmed,
          });
        } else {
          onSignedIn();
        }
      } else if (mode === "sign-up") {
        if (password.length < MIN) {
          setMessage({ kind: "error", text: t.tooShort(MIN) });
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: callback(`${L("/account")}?welcome=1`), captchaToken },
        });
        if (error) {
          setMessage({ kind: "error", text: error.status === 429 ? t.tooMany : error.message });
        } else if (data.session) {
          onSignedIn();
        } else {
          setMessage({
            kind: "ok",
            text: t.almost(cleanEmail),
          });
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: callback(L("/account/reset")), captchaToken });
        setMessage(
          error && error.status === 429 ? { kind: "error", text: t.tooMany } : { kind: "ok", text: t.resetSent(cleanEmail) },
        );
      }
    } finally {
      setBusy(false);
      if (needsCaptcha) nextCaptcha();
    }
  }

  async function resend() {
    if (needsCaptcha && !captcha) {
      setMessage({ kind: "error", text: t.human });
      return;
    }
    setBusy(true);
    await createClient().auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: callback(`${L("/account")}?welcome=1`), captchaToken },
    });
    setBusy(false);
    if (needsCaptcha) nextCaptcha();
    setMessage({ kind: "ok", text: t.resent });
  }

  async function google() {
    await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback(L("/account")) } });
  }

  const titles = t.titles;

  return (
    <div className="auth-card">
      {mode !== "forgot" && (
        <div className="auth-tabs" role="tablist" aria-label={t.tabs}>
          <button type="button" role="tab" aria-selected={mode === "sign-in"} onClick={() => { setMode("sign-in"); setMessage(null); }}>{t.signIn}</button>
          <button type="button" role="tab" aria-selected={mode === "sign-up"} onClick={() => { setMode("sign-up"); setMessage(null); }}>{t.create}</button>
        </div>
      )}
      <h2>{titles[mode]}</h2>

      {GOOGLE_ON && mode !== "forgot" && (
        <>
          <button type="button" className="btn btn-google" onClick={google}>
            <GoogleGlyph /> {t.google}
          </button>
          <p className="auth-or"><span>{t.or}</span></p>
        </>
      )}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-field" htmlFor="account-email">
          <span>{t.email}</span>
          <input id="account-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "forgot" && (
          <label className="auth-field" htmlFor="account-password">
            <span>{t.password}</span>
            <input
              id="account-password"
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
              minLength={mode === "sign-up" ? MIN : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "sign-up" && <small>{t.min(MIN)}</small>}
          </label>
        )}
        <Turnstile onToken={setCaptcha} resetKey={captchaRound} />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? t.wait : mode === "sign-in" ? t.signIn : mode === "sign-up" ? t.create : t.sendReset}
        </button>
      </form>

      {mode === "sign-up" && (
        <p className="auth-fine">
          {t.agree} <a href={L("/privacy")}>{t.privacy}</a>.
        </p>
      )}

      {message && (
        <p className={`auth-message ${message.kind}`} role={message.kind === "error" ? "alert" : "status"}>
          {message.text}{" "}
          {message.resend && <button type="button" className="link-button" onClick={resend} disabled={busy}>{t.sendAgain}</button>}
        </p>
      )}

      <p className="auth-switch">
        {mode === "forgot" ? (
          <button type="button" className="link-button" onClick={() => { setMode("sign-in"); setMessage(null); }}>{t.back}</button>
        ) : (
          <button type="button" className="link-button" onClick={() => { setMode("forgot"); setMessage(null); }}>{t.forgot}</button>
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
