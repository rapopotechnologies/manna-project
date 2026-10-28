import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where links the site emails itself land (e.g. a password reset sent by the team).
 * Checks the one-time token, signs the reader in for that step, then sends them on.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const tokenHash = sp.get("token_hash");
  const type = sp.get("type") as EmailOtpType | null;
  const nextParam = sp.get("next") ?? "/account";
  // Only ever send people to a page on this site.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  const to = request.nextUrl.clone();
  to.search = "";
  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const dest = new URL(next, request.nextUrl.origin);
      to.pathname = dest.pathname;
      to.search = dest.search;
      return NextResponse.redirect(to);
    }
  }
  to.pathname = next === "/id" || next.startsWith("/id/") ? "/id/account" : "/account";
  to.searchParams.set("error", "link");
  return NextResponse.redirect(to);
}
