import { pickDay, possibleLocalDays } from "@/lib/reader-day";

type Props = {
  /** A short name, unique on the page, e.g. "verse". */
  group: string;
  /** Days the page has content for, oldest first. */
  days: string[];
  /** The day to show when the reader's date isn't known (no JavaScript). Usually the newest. */
  fallback: string;
  /** The UTC date this copy of the page was built on, to work out which local dates readers could be on. */
  utcDay: string;
  render: (day: string) => React.ReactNode;
};

/**
 * Renders one copy of `render` per day and shows only the reader's own day.
 * The choice is made by CSS keyed off <html data-day>, so the right day is on
 * screen at first paint, with no flash and no extra request.
 */
export function DayVariants({ group, days, fallback, utcDay, render }: Props) {
  const sel = (d: string) => `[data-day-group="${group}"][data-for-day="${d}"]`;
  const rules = [`[data-day-group="${group}"]:not([data-for-day="${fallback}"]){display:none}`];
  for (const local of possibleLocalDays(utcDay)) {
    const shown = pickDay(local, days);
    if (shown === fallback) continue;
    rules.push(`:root[data-day="${local}"] ${sel(fallback)}{display:none}`);
    rules.push(`:root[data-day="${local}"] ${sel(shown)}{display:block}`);
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: rules.join("") }} />
      {days.map((day) => (
        <div key={day} data-day-group={group} data-for-day={day}>
          {render(day)}
        </div>
      ))}
    </>
  );
}
