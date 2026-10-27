import type { WeekDay } from "@/lib/progress";

const DESCRIBE: Record<WeekDay["state"], string> = {
  gathered: "gathered",
  today: "gathered today",
  grace: "grace day",
  missed: "missed",
  ahead: "not yet",
};

export function WeekRow({ days }: { days: WeekDay[] }) {
  return (
    <ol className="week-row" aria-label="This week">
      {days.map((d) => (
        <li key={d.day} className={`week-${d.state}`}>
          <i aria-hidden="true" />
          <span aria-hidden="true">{d.label}</span>
          <span className="sr-only">{`${new Date(`${d.day}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })}: ${DESCRIBE[d.state]}`}</span>
        </li>
      ))}
    </ol>
  );
}
