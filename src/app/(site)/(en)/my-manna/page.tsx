import { MyMannaView, myMannaMetadata } from "@/views/AccountViews";

export const metadata = myMannaMetadata("en");

export default function Page() {
  return <MyMannaView lang="en" />;
}
