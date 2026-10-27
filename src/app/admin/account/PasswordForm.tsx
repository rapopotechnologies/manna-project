"use client";

import { useActionState } from "react";
import { MIN_PASSWORD } from "@/lib/admin/password-rules";
import { changePassword, type PasswordState } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  return (
    <form action={action} className="admin-form">
      <label className="field" htmlFor="new-password">
        <span>New password</span>
        <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD} required />
        <small>At least {MIN_PASSWORD} characters. A short phrase is easier to remember than random letters.</small>
      </label>
      <label className="field" htmlFor="confirm-password">
        <span>Type it again</span>
        <input id="confirm-password" name="confirm" type="password" autoComplete="new-password" minLength={MIN_PASSWORD} required />
      </label>
      {state.error && <p className="notice notice-error" role="alert">{state.error}</p>}
      <div><button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save password"}</button></div>
    </form>
  );
}
