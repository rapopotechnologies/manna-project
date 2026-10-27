"use client";

import { useActionState } from "react";
import { sendSignInLink, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendSignInLink, { status: "idle", message: "" });

  return (
    <form action={action} className="admin-form">
      <label className="field" htmlFor="email">
        <span>Email</span>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      {state.status !== "idle" && (
        <p className={`notice ${state.status === "error" ? "notice-error" : "notice-ok"}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
