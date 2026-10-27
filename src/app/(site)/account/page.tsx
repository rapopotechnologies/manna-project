import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountPanel } from "@/components/account/AccountPanel";

export const metadata: Metadata = {
  title: "Your account",
  description: "Keep your manna jar, bookshelf, garden and reflections on every device.",
  robots: { index: false },
};

async function Panel({ searchParams }: { searchParams: PageProps<"/account">["searchParams"] }) {
  const sp = await searchParams;
  const notice = sp.welcome ? "welcome" : sp.error === "link" ? "link" : sp.reset ? "reset" : undefined;
  return <AccountPanel notice={notice} />;
}

export default function AccountPage({ searchParams }: PageProps<"/account">) {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">Your account</span>
        <h1>
          Keep your manna <span className="brush">everywhere</span>.
        </h1>
      </header>
      <Suspense fallback={<p className="lede">Checking your account…</p>}>
        <Panel searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
