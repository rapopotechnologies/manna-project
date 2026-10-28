import { DailyView, dailyMetadata } from "@/views/DailyView";

export const generateMetadata = () => dailyMetadata("id");

export default function Page() {
  return <DailyView lang="id" />;
}
