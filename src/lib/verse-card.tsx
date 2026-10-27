import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { DailyVerse } from "@/lib/verse";
import { formatDayLabel } from "@/lib/day";

const LINEN = "#F8F3E6";
const INK = "#1C1B17";
const GOLD = "#E1AD37";
const GOLD_TEXT = "#8A6208";

type CardFont = { name: string; data: Buffer; weight: 500 | 700; style: "normal" };
let assets: Promise<{ fonts: CardFont[]; wordmark: string }> | null = null;

function loadAssets() {
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

type Layout = "portrait" | "landscape";

export async function renderVerseCard(verse: DailyVerse, layout: Layout, headers?: Record<string, string>) {
  const { fonts, wordmark } = await loadAssets();
  const portrait = layout === "portrait";
  const width = portrait ? 1080 : 1200;
  const height = portrait ? 1350 : 630;
  const pad = portrait ? 96 : 72;
  const sun = portrait ? 300 : 220;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(180deg, #FBE3A4 0%, ${LINEN} ${portrait ? 45 : 60}%)`,
          padding: pad,
          position: "relative",
          color: INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: sun,
            height: sun,
            borderRadius: sun,
            background: GOLD,
            right: portrait ? 90 : 70,
            top: portrait ? 110 : -60,
            boxShadow: `0 0 0 ${sun * 0.12}px rgba(225,173,55,0.22), 0 0 0 ${sun * 0.28}px rgba(225,173,55,0.1)`,
          }}
        />
        <div style={{ display: "flex", fontFamily: "Caveat", fontSize: portrait ? 56 : 40, color: GOLD_TEXT }}>
          {formatDayLabel(verse.dayKey)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: portrait ? 40 : 24, maxWidth: portrait ? 900 : 860 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Literata",
              fontSize: verseSize(verse.text, portrait ? 64 : 46),
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
              fontSize: portrait ? 28 : 22,
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
          <img src={wordmark} width={portrait ? 260 : 190} height={portrait ? 106 : 77} />
          <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: portrait ? 22 : 18, letterSpacing: 3, color: INK }}>
            BYMANNAPROJECT.COM/DAILY
          </div>
        </div>
      </div>
    ),
    { width, height, fonts, headers },
  );
}
