"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { SUPABASE_URL } from "@/lib/supabase/env";

/** A quiet invitation to save progress to an account. Hidden once the reader is signed in. */
export function AccountInvite() {
  const lang = useLang();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    const ref = SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split(".")[0] : "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookies are only readable in the browser
    setSignedIn(Boolean(ref) && document.cookie.includes(`sb-${ref}-auth-token`));
  }, []);
  if (signedIn !== false) return null;
  return (
    <Link href={localPath(lang, "/account")} className="tile account-invite">
      <span className="tile-art tile-sun" aria-hidden="true"><span /></span>
      <span>
        <b>{lang === "id" ? "Simpan toplesmu di semua perangkat" : "Keep your jar on every device"}</b>
        <small>
          {lang === "id"
            ? "Buat akun gratis untuk menyimpan toples, rak, kebun, dan renunganmu. Selalu opsional."
            : "Create a free account to save your jar, shelf, garden and reflections. Optional, always."}
        </small>
      </span>
    </Link>
  );
}
