import { SupportView, supportMetadata } from "@/views/SupportView";

export const metadata = supportMetadata("en");

export default function Page() {
  return <SupportView lang="en" />;
}
