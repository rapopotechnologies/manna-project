import { PrivacyView, privacyMetadata } from "@/views/PrivacyView";

export const metadata = privacyMetadata("id");

export default function Page() {
  return <PrivacyView lang="id" />;
}
