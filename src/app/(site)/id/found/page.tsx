import { FoundIndexView, foundIndexMetadata } from "@/views/FoundViews";

export const metadata = foundIndexMetadata("id");

export default function Page() {
  return <FoundIndexView lang="id" />;
}
