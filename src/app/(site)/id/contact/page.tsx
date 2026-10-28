import { ContactView, contactMetadata } from "@/views/ContactView";

export const metadata = contactMetadata("id");

export default function Page() {
  return <ContactView lang="id" />;
}
