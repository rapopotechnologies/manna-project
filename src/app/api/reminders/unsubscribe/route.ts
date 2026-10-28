import { NextResponse, type NextRequest } from "next/server";
import { localPath } from "@/i18n/lang";
import { isValidUnsubscribe } from "@/lib/reminders";
import { createServiceClient, hasServiceKey } from "@/lib/supabase/admin";

/**
 * Turns reminders off for the reader in a signed link (deleting the row is "off").
 * Only POST changes anything, because email scanners open GET links on their own:
 * - mail apps' one-click "Unsubscribe" (RFC 8058) posts here and gets a plain 200;
 * - the confirm button on /reminders/off posts here with confirm=1 and is sent back to that page.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const u = request.nextUrl.searchParams.get("u") ?? String(form?.get("u") ?? "");
  const t = request.nextUrl.searchParams.get("t") ?? String(form?.get("t") ?? "");
  const ok = isValidUnsubscribe(u, t) && hasServiceKey();
  let lang: "en" | "id" = form?.get("lang") === "id" ? "id" : "en";
  if (ok) {
    const { data } = await createServiceClient().from("reminders").delete().eq("user_id", u).select("lang").maybeSingle();
    if (data?.lang === "id") lang = "id";
  }
  if (form?.get("confirm") !== "1") return new NextResponse(null, { status: ok ? 200 : 400 });
  const to = request.nextUrl.clone();
  to.pathname = localPath(lang, "/reminders/off");
  to.search = ok ? "?done=1" : "?error=1";
  return NextResponse.redirect(to, 303);
}

/** Old or scanner GETs: send them to the confirm page instead of acting. */
export function GET(request: NextRequest) {
  const to = request.nextUrl.clone();
  to.pathname = "/reminders/off";
  return NextResponse.redirect(to);
}
