"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { createClient } from "@/lib/supabase/browser";
import { useProgress } from "@/lib/progress";
import { getSyncStatus, readLocal, startSync, stopSync, SYNC_EVENT, type SyncStatus } from "@/lib/sync";
import { AuthForms } from "./AuthForms";

type User = { email: string };

const T = {
  en: {
    teamNoDelete: "Team accounts can’t be deleted here. Ask the superadmin.",
    deleteFailed: "Couldn’t delete your account just now. Try again.",
    checking: "Checking your account…",
    badLink: "That link didn’t work. It may have expired or been opened on a different device. Try again below.",
    why: "Why have an account?",
    why1: "Your manna jar, bookshelf and garden on every device",
    why2: "Your S.O.A.P. reflections, saved safely",
    why3: "Hidden verses you’ve found, and your kids’ sticker chart",
    optional:
      "Completely optional. Today’s verse never needs an account. What’s already saved on this device moves into your account the first time you sign in.",
    welcome: "Welcome! Your account is ready, and everything on this device is now saved to it.",
    resetDone: "Your new password is saved.",
    pendingTitle: "Thanks for signing up!",
    pending:
      "Your account is waiting for approval from the Manna Project team. Until then, your jar, shelf and garden keep saving on this device, and they’ll move into your account as soon as you’re approved.",
    declined: "Your account wasn’t approved. Everything still works on this device. Questions?",
    contact: "Get in touch",
    signedIn: "Signed in",
    syncing: "Saving to your account…",
    synced: (at: string) => `Saved to your account${at ? ` at ${at}` : ""}.`,
    syncError: "Couldn’t reach your account just now. Your progress is safe on this device and will save next time.",
    idle: "Your progress saves to your account automatically.",
    syncPending: "Waiting for approval. Saving on this device for now.",
    syncDeclined: "Saving on this device only.",
    mornings: "mornings gathered",
    books: "of 66 books",
    flowers: "flowers planted",
    see: "See my manna",
    download: "Download my data",
    signOut: "Sign out",
    deleteTitle: "Delete account",
    deleteNote: "Deletes your account and everything saved in it. What’s on this device stays until you clear your browser.",
    confirm: "Yes, delete my account",
    keep: "Keep it",
    deleteBtn: "Delete my account",
  },
  id: {
    teamNoDelete: "Akun tim tidak bisa dihapus di sini. Hubungi superadmin.",
    deleteFailed: "Akunmu belum bisa dihapus saat ini. Coba lagi.",
    checking: "Memeriksa akunmu…",
    badLink: "Tautan itu tidak berhasil. Mungkin sudah kedaluwarsa atau dibuka di perangkat lain. Coba lagi di bawah.",
    why: "Kenapa perlu akun?",
    why1: "Toples manna, rak buku, dan kebunmu di semua perangkat",
    why2: "Renungan S.O.A.P.-mu, tersimpan dengan aman",
    why3: "Ayat tersembunyi yang sudah kamu temukan, dan bagan stiker anak-anakmu",
    optional:
      "Sepenuhnya opsional. Ayat hari ini tidak pernah memerlukan akun. Apa yang sudah tersimpan di perangkat ini akan pindah ke akunmu saat pertama kali kamu masuk.",
    welcome: "Selamat datang! Akunmu sudah siap, dan semua yang ada di perangkat ini sekarang tersimpan di sana.",
    resetDone: "Kata sandi barumu sudah tersimpan.",
    pendingTitle: "Terima kasih sudah mendaftar!",
    pending:
      "Akunmu sedang menunggu persetujuan dari tim Manna Project. Sampai saat itu, toples, rak, dan kebunmu tetap tersimpan di perangkat ini, dan akan pindah ke akunmu begitu disetujui.",
    declined: "Akunmu tidak disetujui. Semuanya tetap berfungsi di perangkat ini. Ada pertanyaan?",
    contact: "Hubungi kami",
    signedIn: "Sudah masuk",
    syncing: "Menyimpan ke akunmu…",
    synced: (at: string) => `Tersimpan di akunmu${at ? ` pukul ${at}` : ""}.`,
    syncError: "Akunmu tidak bisa dihubungi saat ini. Progresmu aman di perangkat ini dan akan tersimpan nanti.",
    idle: "Progresmu tersimpan ke akunmu secara otomatis.",
    syncPending: "Menunggu persetujuan. Untuk sementara tersimpan di perangkat ini.",
    syncDeclined: "Hanya tersimpan di perangkat ini.",
    mornings: "pagi terkumpul",
    books: "dari 66 kitab",
    flowers: "bunga ditanam",
    see: "Lihat manna-ku",
    download: "Unduh dataku",
    signOut: "Keluar",
    deleteTitle: "Hapus akun",
    deleteNote: "Menghapus akunmu dan semua yang tersimpan di dalamnya. Data di perangkat ini tetap ada sampai kamu membersihkan browser.",
    confirm: "Ya, hapus akunku",
    keep: "Jangan",
    deleteBtn: "Hapus akunku",
  },
};

export function AccountPanel({ notice }: { notice?: "welcome" | "link" | "reset" }) {
  const lang = useLang();
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
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
        /Team members/.test(rpcError.message) ? t.teamNoDelete : t.deleteFailed,
      );
      return;
    }
    stopSync();
    await supabase.auth.signOut();
    setUser(null);
    setConfirmDelete(false);
  }

  if (user === undefined) return <p className="lede">{t.checking}</p>;

  if (!user) {
    return (
      <div className="account-grid">
        <div className="account-why">
          {notice === "link" && <p className="notice-soft">{t.badLink}</p>}
          <h2>{t.why}</h2>
          <ul className="fixtures">
            <li>{t.why1}</li>
            <li>{t.why2}</li>
            <li>{t.why3}</li>
          </ul>
          <p className="muted-line">{t.optional}</p>
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
        <p className="notice-soft">{t.welcome}</p>
      )}
      {notice === "reset" && <p className="notice-soft">{t.resetDone}</p>}

      {sync.state === "pending" && (
        <p className="notice-soft">
          <b>{t.pendingTitle}</b> {t.pending}
        </p>
      )}
      {sync.state === "declined" && (
        <p className="notice-soft">
          {t.declined} <Link href={L("/contact")}>{t.contact}</Link>.
        </p>
      )}

      <section className="progress-card" aria-labelledby="acct">
        <div className="progress-head">
          <span className="label">{t.signedIn}</span>
          <h2 id="acct" className="account-email">{user.email}</h2>
        </div>
        <p className="muted-line" role="status">
          {sync.state === "syncing" && t.syncing}
          {sync.state === "synced" &&
            t.synced(sync.at ? new Date(sync.at).toLocaleTimeString(lang === "id" ? "id-ID" : [], { hour: "numeric", minute: "2-digit" }) : "")}
          {sync.state === "error" && t.syncError}
          {sync.state === "idle" && t.idle}
          {sync.state === "pending" && t.syncPending}
          {sync.state === "declined" && t.syncDeclined}
        </p>
        <div className="account-stats">
          <div><b>{gathered}</b><span>{t.mornings}</span></div>
          <div><b>{books}</b><span>{t.books}</span></div>
          <div><b>{flowers}</b><span>{t.flowers}</span></div>
        </div>
        <div className="porch-ctas">
          <Link className="btn btn-primary" href={L("/my-manna")}>{t.see}</Link>
          <button type="button" className="btn" onClick={download}>{t.download}</button>
          <button type="button" className="btn" onClick={signOut}>{t.signOut}</button>
        </div>
      </section>

      <section className="progress-card" aria-labelledby="delete">
        <h2 id="delete" className="account-small-head">{t.deleteTitle}</h2>
        <p className="muted-line">{t.deleteNote}</p>
        {confirmDelete ? (
          <div className="porch-ctas">
            <button type="button" className="btn btn-danger" onClick={deleteAccount}>{t.confirm}</button>
            <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>{t.keep}</button>
          </div>
        ) : (
          <div><button type="button" className="btn" onClick={() => setConfirmDelete(true)}>{t.deleteBtn}</button></div>
        )}
        {error && <p className="auth-message error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
