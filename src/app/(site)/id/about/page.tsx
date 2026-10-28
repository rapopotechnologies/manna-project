import { AboutView, aboutMetadata } from "@/views/AboutView";

export const metadata = aboutMetadata("id");

export default function Page() {
  return <AboutView lang="id" />;
}
