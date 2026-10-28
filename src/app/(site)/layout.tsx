import { AccountSync } from "@/components/account/AccountSync";

/** The public site, in English (the (en) group) and Indonesian (/id). */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <AccountSync />
    </>
  );
}
