import { FoundIndexView, foundIndexMetadata } from "@/views/FoundViews";

export const metadata = foundIndexMetadata("en");

export default function Page() {
  return <FoundIndexView lang="en" />;
}
