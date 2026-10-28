// Builds a story-sized image (1080×1920) of a child's drawing with the day's question,
// entirely in the browser. Nothing is uploaded.

const W = 1080;
const H = 1920;
// Instagram covers the top ~250px and bottom ~340px of a story with its own controls.
const TOP = 250;
const BOTTOM = H - 340;
const PAD = 96;

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

let wordmark: Promise<HTMLImageElement> | null = null;
function loadWordmark() {
  wordmark ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "/brand/manna-wordmark.png";
  });
  return wordmark;
}

export async function buildDrawingCard(drawing: HTMLCanvasElement, question: string, dateLabel: string): Promise<Blob | null> {
  await document.fonts?.ready;
  const logo = await loadWordmark().catch(() => null);
  const read = fontVar("--font-read", "Georgia, serif");
  const hand = fontVar("--font-hand", "cursive");
  const label = fontVar("--font-label", "Arial, sans-serif");

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Sage sky fading into linen, with a sage sun, like the kids' room.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#D5E7E1");
  bg.addColorStop(0.45, "#F8F3E6");
  bg.addColorStop(1, "#F8F3E6");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  for (const [r, a] of [[200, 0.1], [160, 0.22], [120, 1]] as const) {
    ctx.beginPath();
    ctx.arc(W - 150, 140, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(148, 189, 181, ${a})`;
    ctx.fill();
  }

  // Date
  ctx.fillStyle = "#3F6B5C";
  ctx.font = `700 52px ${hand}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`Manna Kids · ${dateLabel}`, PAD, TOP + 60, W - PAD * 2);

  // Question: shrink to fit in at most 5 lines
  let size = 64;
  let lines: string[] = [];
  for (; size >= 40; size -= 4) {
    ctx.font = `500 ${size}px ${read}`;
    lines = wrap(ctx, question, W - PAD * 2);
    if (lines.length <= 5) break;
  }
  ctx.fillStyle = "#1C1B17";
  const lineH = size * 1.28;
  let y = TOP + 160;
  for (const l of lines) {
    ctx.fillText(l, PAD, y);
    y += lineH;
  }

  // Drawing in a white frame, as large as fits above the logo
  const frameTop = y + 30;
  const logoTop = BOTTOM - 130;
  const maxFrameH = logoTop - 70 - frameTop;
  let frameW = W - PAD * 2;
  let inner = frameW - 40;
  let innerH = (inner * drawing.height) / drawing.width;
  if (innerH + 40 > maxFrameH) {
    innerH = maxFrameH - 40;
    inner = (innerH * drawing.width) / drawing.height;
    frameW = inner + 40;
  }
  const frameX = (W - frameW) / 2;
  // Center the drawing in the space between the question and the logo.
  const spare = maxFrameH - (innerH + 40);
  const frameTopCentered = frameTop + Math.max(0, spare / 2);
  ctx.save();
  ctx.shadowColor = "rgba(28, 27, 23, 0.18)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  roundRect(ctx, frameX, frameTopCentered, frameW, innerH + 40, 28);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, frameX + 20, frameTopCentered + 20, inner, innerH, 14);
  ctx.clip();
  ctx.drawImage(drawing, frameX + 20, frameTopCentered + 20, inner, innerH);
  ctx.restore();

  // Footer: logo and address
  if (logo) ctx.drawImage(logo, PAD, logoTop, 260, (260 * logo.height) / logo.width);
  ctx.fillStyle = "#1C1B17";
  ctx.font = `700 24px ${label}`;
  ctx.textAlign = "right";
  ctx.fillText("BYMANNAPROJECT.COM/KIDS", W - PAD, logoTop + 80);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
