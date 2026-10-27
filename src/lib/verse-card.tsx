import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { DailyVerse } from "@/lib/verse";
import { formatDayLabel } from "@/lib/day";

export const LINEN = "#F8F3E6";
export const INK = "#1C1B17";
export const GOLD = "#E1AD37";
export const GOLD_TEXT = "#8A6208";

type CardFont = { name: string; data: Buffer; weight: 500 | 700; style: "normal" };
let assets: Promise<{ fonts: CardFont[]; wordmark: string }> | null = null;

export function loadAssets() {
  assets ??= (async () => {
    const dir = join(process.cwd(), "src/assets/fonts");
    const [literata, montserrat, caveat, wordmark] = await Promise.all([
      readFile(join(dir, "Literata-Medium.ttf")),
      readFile(join(dir, "Montserrat-Bold.ttf")),
      readFile(join(dir, "Caveat-Bold.ttf")),
      readFile(join(process.cwd(), "public/brand/manna-wordmark.png")),
    ]);
    return {
      fonts: [
        { name: "Literata", data: literata, weight: 500 as const, style: "normal" as const },
        { name: "Montserrat", data: montserrat, weight: 700 as const, style: "normal" as const },
        { name: "Caveat", data: caveat, weight: 700 as const, style: "normal" as const },
      ],
      wordmark: `data:image/png;base64,${wordmark.toString("base64")}`,
    };
  })();
  return assets;
}

/** Verse text size that keeps long passages inside the card. */
function verseSize(text: string, base: number) {
  const n = text.length;
  if (n < 90) return base;
  if (n < 160) return base * 0.86;
  if (n < 240) return base * 0.74;
  if (n < 340) return base * 0.62;
  return base * 0.52;
}

/** story: Instagram Stories (9:16). post: Instagram feed (4:5). landscape: link previews. */
export type CardLayout = "story" | "post" | "landscape";

type Spec = {
  width: number;
  height: number;
  padX: number;
  padTop: number;
  padBottom: number;
  sun: number;
  sunTop: number;
  sunRight: number;
  glowStop: number;
  date: number;
  verse: number;
  ref: number;
  gap: number;
  maxWidth: number;
  logo: [number, number];
  url: number;
};

// Stories keep 250px clear at the top and 340px at the bottom for Instagram's own controls.
const specs: Record<CardLayout, Spec> = {
  story: { width: 1080, height: 1920, padX: 96, padTop: 250, padBottom: 340, sun: 340, sunTop: 230, sunRight: 80, glowStop: 42, date: 60, verse: 70, ref: 30, gap: 48, maxWidth: 890, logo: [300, 122], url: 24 },
  post: { width: 1080, height: 1350, padX: 96, padTop: 96, padBottom: 96, sun: 300, sunTop: 110, sunRight: 90, glowStop: 45, date: 56, verse: 64, ref: 28, gap: 40, maxWidth: 900, logo: [260, 106], url: 22 },
  landscape: { width: 1200, height: 630, padX: 72, padTop: 72, padBottom: 72, sun: 220, sunTop: -60, sunRight: 70, glowStop: 60, date: 40, verse: 46, ref: 22, gap: 24, maxWidth: 860, logo: [190, 77], url: 18 },
};

export async function renderVerseCard(verse: DailyVerse, layout: CardLayout, headers?: Record<string, string>) {
  const { fonts, wordmark } = await loadAssets();
  const s = specs[layout];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(180deg, #FBE3A4 0%, ${LINEN} ${s.glowStop}%)`,
          padding: `${s.padTop}px ${s.padX}px ${s.padBottom}px`,
          position: "relative",
          color: INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: s.sun,
            height: s.sun,
            borderRadius: s.sun,
            background: GOLD,
            right: s.sunRight,
            top: s.sunTop,
            boxShadow: `0 0 0 ${s.sun * 0.12}px rgba(225,173,55,0.22), 0 0 0 ${s.sun * 0.28}px rgba(225,173,55,0.1)`,
          }}
        />
        <div style={{ display: "flex", fontFamily: "Caveat", fontSize: s.date, color: GOLD_TEXT }}>
          {formatDayLabel(verse.dayKey)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s.gap, maxWidth: s.maxWidth }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Literata",
              fontSize: verseSize(verse.text, s.verse),
              lineHeight: 1.38,
              letterSpacing: -0.5,
            }}
          >
            {`“${verse.text}”`}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Montserrat",
              fontSize: s.ref,
              letterSpacing: 5,
              color: GOLD_TEXT,
              textTransform: "uppercase",
            }}
          >
            {`${verse.reference} · ${verse.version}`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={wordmark} width={s.logo[0]} height={s.logo[1]} />
          <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: s.url, letterSpacing: 3, color: INK }}>
            BYMANNAPROJECT.COM/DAILY
          </div>
        </div>
      </div>
    ),
    { width: s.width, height: s.height, fonts, headers },
  );
}
