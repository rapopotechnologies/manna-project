import { MyMannaView, myMannaMetadata } from "@/views/AccountViews";

export const metadata = myMannaMetadata("id");

export default function Page() {
  return <MyMannaView lang="id" />;
}
