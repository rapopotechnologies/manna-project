import { Suspense } from "react";
import { RemindersOffView, remindersOffMetadata } from "@/views/RemindersOffView";

export const metadata = remindersOffMetadata("en");

export default function Page({ searchParams }: PageProps<"/reminders/off">) {
  return (
    <Suspense>
      <RemindersOffView lang="en" searchParams={searchParams} />
    </Suspense>
  );
}
