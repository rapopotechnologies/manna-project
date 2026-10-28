"use client";

import { useActionState, useEffect, useState } from "react";
import { Turnstile } from "@/components/account/Turnstile";
import { signIn, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  // Turnstile token (only when a site key is set); a fresh one after every attempt.
  const [token, setToken] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- each finished attempt needs a new check
    if (state.error) setRound((n) => n + 1);
  }, [state]);

  return (
    <form action={action} className="admin-form">
      <label className="field" htmlFor="email">
        <span>Email</span>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </label>
      <label className="field" htmlFor="password">
        <span>Password</span>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </label>
      <input type="hidden" name="captchaToken" value={token ?? ""} />
      <Turnstile onToken={setToken} resetKey={round} />
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      {state.error && (
        <p className="notice notice-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
