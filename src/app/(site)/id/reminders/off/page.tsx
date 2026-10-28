import { Suspense } from "react";
import { RemindersOffView, remindersOffMetadata } from "@/views/RemindersOffView";

export const metadata = remindersOffMetadata("id");

export default function Page({ searchParams }: PageProps<"/id/reminders/off">) {
  return (
    <Suspense>
      <RemindersOffView lang="id" searchParams={searchParams} />
    </Suspense>
  );
}
