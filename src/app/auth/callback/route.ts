import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where links from sign-up confirmation emails, password-reset emails and
 * Google sign-in land. Turns the one-time code into a session cookie.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextParam = request.nextUrl.searchParams.get("next") ?? "/account";
  // Only ever send people to a page on this site.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  const to = request.nextUrl.clone();
  to.search = "";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // `next` can carry its own query (e.g. /account?welcome=1), so parse it rather than setting the pathname.
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
