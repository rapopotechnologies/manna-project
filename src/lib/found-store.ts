// Which hidden verses this device has found. Kept in the browser only for now;
// reader accounts (phase 8) will sync it.

const KEY = "manna:found";

export function readFound(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addFound(slug: string): string[] {
  const list = readFound();
  if (list.includes(slug)) return list;
  const next = [...list, slug];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("manna:local-change"));
  } catch {
    // Storage unavailable; the count covers this visit only.
  }
  return next;
}
