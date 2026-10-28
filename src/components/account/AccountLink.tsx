"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SUPABASE_URL } from "@/lib/supabase/env";

/** Header icon for the reader's account. A gold dot shows when they're signed in. */
export function AccountLink() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const ref = SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split(".")[0] : "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookies are only readable in the browser
    setSignedIn(Boolean(ref) && document.cookie.includes(`sb-${ref}-auth-token`));
  }, [pathname]);

  const active = pathname === "/account" || pathname.startsWith("/account/");
  return (
    <Link
      href="/account"
      className={`account-link${signedIn ? " is-signed-in" : ""}`}
      aria-label={signedIn ? "Your account (signed in)" : "Your account: sign in or create one"}
      aria-current={active ? "page" : undefined}
      title={signedIn ? "Your account" : "Sign in"}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3.8" />
        <path d="M4.5 20c1.4-3.6 4.3-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
      </svg>
      <span className="account-dot" aria-hidden="true" />
      {!signedIn && <span className="account-text" aria-hidden="true">Sign in</span>}
    </Link>
  );
}
