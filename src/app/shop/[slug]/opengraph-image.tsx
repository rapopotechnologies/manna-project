import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { findProduct, products } from "@/data/products";
import { GOLD, GOLD_TEXT, INK, LINEN, loadAssets } from "@/lib/verse-card";

export const alt = "A Manna Project product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug) ?? products[0];
  const { fonts, wordmark } = await loadAssets();
  const photo = await readFile(join(process.cwd(), "public", product.images[0].src));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: LINEN, color: INK }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={photoSrc} width={630} height={504} style={{ margin: "63px 0 0 48px", borderRadius: 24 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 56px 48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 20, letterSpacing: 4, color: GOLD_TEXT }}>
              {product.category.toUpperCase()}
            </div>
            <div style={{ display: "flex", fontFamily: "Literata", fontSize: product.name.length > 28 ? 44 : 52, lineHeight: 1.15 }}>
              {product.name}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img src={wordmark} width={170} height={69} />
            <div style={{ width: 44, height: 44, borderRadius: 44, background: GOLD }} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
