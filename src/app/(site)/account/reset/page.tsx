import type { Metadata } from "next";
import { ResetPassword } from "@/components/account/ResetPassword";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default function ResetPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Your account</span>
        <h1>Choose a new password</h1>
      </header>
      <ResetPassword />
    </div>
  );
}
