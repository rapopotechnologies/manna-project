import { AccountView, accountMetadata } from "@/views/AccountViews";

export const metadata = accountMetadata("en");

export default function Page({ searchParams }: PageProps<"/account">) {
  return <AccountView lang="en" searchParams={searchParams} />;
}
