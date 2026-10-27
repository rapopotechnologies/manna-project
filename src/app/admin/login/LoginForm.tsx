"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

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
