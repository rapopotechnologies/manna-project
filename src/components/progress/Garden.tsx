"use client";

import { useLang } from "@/i18n/client";
import { dayNumber } from "@/lib/day";

const PETALS = ["#E1AD37", "#94BDB5", "#E0A0A0", "#C9B6E4", "#E0785E", "#F2D27A"];
const PER_ROW = 8;

/** One flower for every finished reflection, newest at the end. */
export function Garden({ days }: { days: string[] }) {
  const lang = useLang();
  const recent = days.slice(-40);
  const rows = Math.max(1, Math.ceil((recent.length + 1) / PER_ROW));
  const width = 420;
  const rowH = 96;

  return (
    <svg className="garden" viewBox={`0 0 ${width} ${rows * rowH}`} role="img" aria-label={lang === "id" ? `Kebun renungan dengan ${days.length} bunga` : `Reflection garden with ${days.length} flowers`}>
      {Array.from({ length: rows }, (_, r) => (
        <path
          key={`g${r}`}
          d={`M6 ${r * rowH + 86} C 120 ${r * rowH + 80}, 260 ${r * rowH + 92}, ${width - 6} ${r * rowH + 84}`}
          stroke="var(--olive)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {recent.map((day, i) => {
        const n = dayNumber(day);
        const row = Math.floor(i / PER_ROW);
        const x = 30 + (i % PER_ROW) * ((width - 60) / (PER_ROW - 1));
        const ground = row * rowH + 85;
        const h = 40 + (n % 3) * 7;
        const top = ground - h;
        const color = PETALS[n % PETALS.length];
        const petals = 5 + (n % 2);
        return (
          <g key={day}>
            <path d={`M${x} ${ground} C ${x - 3} ${ground - 15}, ${x + 3} ${ground - 28}, ${x} ${top}`} stroke="var(--ink)" strokeWidth="1.8" fill="none" />
            <ellipse cx={x - 7} cy={ground - 14} rx="7" ry="3" fill="var(--olive)" transform={`rotate(-25 ${x - 7} ${ground - 14})`} />
            {Array.from({ length: petals }, (_, p) => {
              const a = (p / petals) * Math.PI * 2;
              return <circle key={p} cx={x + Math.cos(a) * 7.5} cy={top + Math.sin(a) * 7.5} r="6" fill={color} stroke="var(--ink)" strokeWidth="1" />;
            })}
            <circle cx={x} cy={top} r="4" fill="var(--ink)" />
          </g>
        );
      })}
      {/* The next flower waiting to grow */}
      {(() => {
        const i = recent.length;
        const row = Math.floor(i / PER_ROW);
        const x = 30 + (i % PER_ROW) * ((width - 60) / (PER_ROW - 1));
        const ground = row * rowH + 85;
        return (
          <g opacity="0.6">
            <path d={`M${x} ${ground} L${x} ${ground - 14}`} stroke="var(--ink)" strokeWidth="1.8" />
            <ellipse cx={x - 6} cy={ground - 13} rx="6" ry="2.6" fill="var(--olive)" transform={`rotate(-20 ${x - 6} ${ground - 13})`} />
            <ellipse cx={x + 6} cy={ground - 15} rx="6" ry="2.6" fill="var(--olive)" transform={`rotate(20 ${x + 6} ${ground - 15})`} />
          </g>
        );
      })()}
    </svg>
  );
}
