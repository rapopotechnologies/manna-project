"use client";

import { useLang } from "@/i18n/client";

// A glass jar holding this week's manna: one piece per morning gathered (up to 7).

const SPOTS = [
  { x: 44, y: 150, r: -6 },
  { x: 70, y: 152, r: 4 },
  { x: 96, y: 150, r: -3 },
  { x: 56, y: 137, r: -10 },
  { x: 84, y: 136, r: 9 },
  { x: 70, y: 123, r: -4 },
  { x: 47, y: 124, r: 12 },
];

export function MannaJar({ pieces, dropLast = false, size = 140 }: { pieces: number; dropLast?: boolean; size?: number }) {
  const lang = useLang();
  const n = Math.max(0, Math.min(7, pieces));
  return (
    <svg
      className="jar"
      viewBox="0 0 140 170"
      width={size}
      height={(size * 170) / 140}
      role="img"
      aria-label={lang === "id" ? `Toples manna berisi ${n} dari 7 butir minggu ini` : `Manna jar with ${n} of 7 pieces this week`}
    >
      <rect x="36" y="6" width="68" height="16" rx="5" fill="var(--gold)" stroke="var(--ink)" strokeWidth="2" />
      <path
        d="M44 22 L44 30 Q28 34 27 48 L24 140 Q24 162 46 162 L94 162 Q116 162 116 140 L113 48 Q112 34 96 30 L96 22"
        fill="var(--chip)"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M36 56 L34 120" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {SPOTS.slice(0, n).map((s, i) => (
        <g key={i} className={dropLast && i === n - 1 ? "manna-drop" : undefined}>
          <ellipse cx={s.x} cy={s.y} rx="12" ry="7" transform={`rotate(${s.r} ${s.x} ${s.y})`} fill="#F6EBC8" stroke="var(--ink)" strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}
