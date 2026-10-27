import type { Metadata } from "next";
import { Suspense } from "react";
import { Wordmark } from "@/components/Wordmark";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const errors: Record<string, string> = {
  "not-on-team": "You’re signed in, but this email isn’t on the Manna Project team. Ask the superadmin for an invite.",
};

async function ErrorNote({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? errors[error] : undefined;
  return message ? <p className="notice notice-error">{message}</p> : null;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <Wordmark />
        <h1>Team sign-in</h1>
        <p className="muted">For the Manna Project team. Ask the superadmin if you need an account or a password reset.</p>
        <Suspense fallback={null}>
          <ErrorNote searchParams={searchParams} />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  );
}
