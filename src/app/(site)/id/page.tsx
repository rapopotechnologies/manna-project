import { HomeView, homeMetadata } from "@/views/HomeView";

export const metadata = homeMetadata("id");

export default function Page() {
  return <HomeView lang="id" />;
}
