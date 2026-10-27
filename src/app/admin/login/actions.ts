"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { status: "idle" | "sent" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Emails a one-time sign-in link, but only to people on the team. */
export async function sendSignInLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { status: "error", message: "Enter the email address you were invited with." };

  const supabase = await createClient();
  const { data: onTeam } = await supabase.rpc("is_team_email", { check_email: email });

  if (onTeam) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${proto}://${host}/admin/auth/callback`, shouldCreateUser: true },
    });
    if (error) {
      return {
        status: "error",
        message: "We couldn’t send a link just now. Wait a few minutes and try again.",
      };
    }
  }

  // Same message either way, so the form doesn't reveal who is on the team.
  return {
    status: "sent",
    message: "If that email is on the team, a sign-in link is on its way. Open it in this browser.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
