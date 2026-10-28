import { DailyView, dailyMetadata } from "@/views/DailyView";

export const generateMetadata = () => dailyMetadata("en");

export default function Page() {
  return <DailyView lang="en" />;
}
