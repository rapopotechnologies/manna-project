import { KidsView, kidsMetadata } from "@/views/KidsView";

export const generateMetadata = () => kidsMetadata("id");

export default function Page() {
  return <KidsView lang="id" />;
}
