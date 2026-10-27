import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { GOLD, GOLD_TEXT, INK, LINEN, loadAssets } from "@/lib/verse-card";

export const alt = "Manna Project: cultivating faith, crafting grace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default link preview for pages without their own image. */
export default async function Image() {
  const { fonts } = await loadAssets();
  const lockup = await readFile(join(process.cwd(), "public/brand/manna-lockup.png"));
  const lockupSrc = `data:image/png;base64,${lockup.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: `linear-gradient(180deg, #FBE3A4 0%, ${LINEN} 55%)`,
          color: INK,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 90,
            top: -70,
            width: 240,
            height: 240,
            borderRadius: 240,
            background: GOLD,
            boxShadow: "0 0 0 30px rgba(225,173,55,0.2), 0 0 0 70px rgba(225,173,55,0.1)",
          }}
        />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={lockupSrc} width={560} height={304} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 420, marginTop: 120 }}>
          <div style={{ display: "flex", fontFamily: "Literata", fontSize: 40, lineHeight: 1.25 }}>
            A verse every morning, and handmade tools for your quiet time.
          </div>
          <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 18, letterSpacing: 4, color: GOLD_TEXT }}>
            BYMANNAPROJECT.COM
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
