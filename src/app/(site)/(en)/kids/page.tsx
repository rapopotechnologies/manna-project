import { KidsView, kidsMetadata } from "@/views/KidsView";

export const generateMetadata = () => kidsMetadata("en");

export default function Page() {
  return <KidsView lang="en" />;
}
