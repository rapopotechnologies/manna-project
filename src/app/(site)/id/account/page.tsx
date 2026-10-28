import { AccountView, accountMetadata } from "@/views/AccountViews";

export const metadata = accountMetadata("id");

export default function Page({ searchParams }: PageProps<"/id/account">) {
  return <AccountView lang="id" searchParams={searchParams} />;
}
