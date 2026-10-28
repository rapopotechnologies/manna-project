import { ResetView, resetMetadata } from "@/views/AccountViews";

export const metadata = resetMetadata("en");

export default function Page() {
  return <ResetView lang="en" />;
}
