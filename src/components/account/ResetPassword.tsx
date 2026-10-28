"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { createClient } from "@/lib/supabase/browser";

const MIN = 8;

/** Reached from the password-reset email (which signs the reader in for this one step). */
const T = {
  en: {
    min: (n: number) => `Use at least ${n} characters.`,
    mismatch: "The two passwords don’t match.",
    same: "That’s your current password. Choose a new one.",
    wait: "One moment…",
    expired: "This reset link has expired or was opened on a different device.",
    again: "Request a new one",
    newPw: "New password",
    atLeast: (n: number) => `At least ${n} characters.`,
    retype: "Type it again",
    saving: "Saving…",
    save: "Save new password",
  },
  id: {
    min: (n: number) => `Gunakan minimal ${n} karakter.`,
    mismatch: "Kedua kata sandi tidak sama.",
    same: "Itu kata sandimu yang sekarang. Pilih yang baru.",
    wait: "Sebentar…",
    expired: "Tautan atur ulang ini sudah kedaluwarsa atau dibuka di perangkat lain.",
    again: "Minta tautan baru",
    newPw: "Kata sandi baru",
    atLeast: (n: number) => `Minimal ${n} karakter.`,
    retype: "Ketik sekali lagi",
    saving: "Menyimpan…",
    save: "Simpan kata sandi baru",
  },
};

export function ResetPassword() {
  const lang = useLang();
  const t = T[lang];
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
    if (password.length < MIN) return setError(t.min(MIN));
    if (password !== confirm) return setError(t.mismatch);
    setBusy(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(updateError.code === "same_password" ? t.same : updateError.message);
    router.push(`${localPath(lang, "/account")}?reset=1`);
  }

  if (ready === null) return <p className="lede">{t.wait}</p>;
  if (!ready) {
    return (
      <p className="notice-soft">
        {t.expired} <Link href={localPath(lang, "/account")}>{t.again}</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="auth-card auth-form" style={{ maxWidth: 460 }}>
      <label className="auth-field" htmlFor="reset-password">
        <span>{t.newPw}</span>
        <input id="reset-password" type="password" autoComplete="new-password" minLength={MIN} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <small>{t.atLeast(MIN)}</small>
      </label>
      <label className="auth-field" htmlFor="reset-confirm">
        <span>{t.retype}</span>
        <input id="reset-confirm" type="password" autoComplete="new-password" minLength={MIN} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      {error && <p className="auth-message error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? t.saving : t.save}</button>
    </form>
  );
}
