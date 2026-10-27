"use client";

// A reader's progress: the manna jar, bookshelf, garden and kids' sticker chart.
// Saved in this browser only. Reader accounts (phase 8) will sync it.

import { useSyncExternalStore } from "react";
import { dayNumber } from "@/lib/day";

export type Progress = {
  /** Day keys (YYYY-MM-DD) when today's verse was opened. */
  gathered: string[];
  /** Book name → day key it was first stamped. */
  books: Record<string, string>;
  /** Day keys with a finished S.O.A.P. reflection. */
  reflections: string[];
  /** Day keys when the family talked through the kids' question. */
  kidsStickers: string[];
};

const KEY = "manna:progress";
const EVENT = "manna:progress";
const EMPTY: Progress = { gathered: [], books: {}, reflections: [], kidsStickers: [] };

let cache: Progress | null = null;
let cacheRaw: string | null = null;

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw && cache) return cache;
    cacheRaw = raw;
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {};
    cache = {
      gathered: Array.isArray(parsed.gathered) ? parsed.gathered : [],
      books: parsed.books && typeof parsed.books === "object" ? parsed.books : {},
      reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
      kidsStickers: Array.isArray(parsed.kidsStickers) ? parsed.kidsStickers : [],
    };
    return cache;
  } catch {
    return EMPTY;
  }
}

function write(next: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked; progress shows for this visit only.
  }
  cache = next;
  cacheRaw = JSON.stringify(next);
  window.dispatchEvent(new Event(EVENT));
}

const addDay = (list: string[], day: string) => (list.includes(day) ? list : [...list, day].sort());

export function gatherToday(day: string, book: string | null): { newPiece: boolean; newBook: string | null } {
  const p = read();
  const newPiece = !p.gathered.includes(day);
  const newBook = book && !p.books[book] ? book : null;
  if (newPiece || newBook) {
    write({ ...p, gathered: addDay(p.gathered, day), books: newBook ? { ...p.books, [newBook]: day } : p.books });
  }
  return { newPiece, newBook };
}

export function plantReflection(day: string): boolean {
  const p = read();
  if (p.reflections.includes(day)) return false;
  write({ ...p, reflections: addDay(p.reflections, day) });
  return true;
}

export function addKidsSticker(day: string): boolean {
  const p = read();
  if (p.kidsStickers.includes(day)) return false;
  write({ ...p, kidsStickers: addDay(p.kidsStickers, day) });
  return true;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Live progress in client components. Null during server rendering. */
export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

// ---------- The week, Monday to Sunday ----------

const keyOf = (n: number) => new Date(n * 86_400_000).toISOString().slice(0, 10);

/** 0 = Monday … 6 = Sunday */
const weekdayOf = (n: number) => (new Date(n * 86_400_000).getUTCDay() + 6) % 7;

export type WeekDay = { day: string; label: string; state: "gathered" | "grace" | "missed" | "today" | "ahead" };

/**
 * This week's jar. One missed day is a grace day (no manna fell on the Sabbath),
 * so it never breaks the streak.
 */
export function weekView(today: string, gathered: string[]) {
  const t = dayNumber(today);
  const monday = t - weekdayOf(t);
  const set = new Set(gathered);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const days: WeekDay[] = labels.map((label, i) => {
    const n = monday + i;
    const day = keyOf(n);
    if (set.has(day)) return { day, label, state: n === t ? "today" : "gathered" };
    if (n > t) return { day, label, state: "ahead" };
    if (n === t) return { day, label, state: "ahead" };
    return { day, label, state: "missed" };
  });
  const missed = days.filter((d) => d.state === "missed");
  if (missed.length === 1) missed[0].state = "grace";
  const count = days.filter((d) => d.state === "gathered" || d.state === "today").length;

  // Weeks in a row with at most one missed day.
  let streak = missed.length <= 1 ? 1 : 0;
  if (streak) {
    for (let w = 1; w < 520; w++) {
      const start = monday - 7 * w;
      const misses = Array.from({ length: 7 }, (_, i) => keyOf(start + i)).filter((d) => !set.has(d)).length;
      if (misses > 1) break;
      streak++;
    }
  }
  return { days, count, streak, graceUsed: missed.length === 1 };
}
