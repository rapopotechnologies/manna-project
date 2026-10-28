"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildDrawingCard } from "@/lib/drawing-card";
import { track } from "@/lib/track";

const colors = [
  { name: "Ink", value: "#1C1B17" },
  { name: "Gold", value: "#E1AD37" },
  { name: "Sage", value: "#6FA597" },
  { name: "Olive", value: "#7E7A3F" },
  { name: "Coral", value: "#E0785E" },
  { name: "Sky", value: "#5B8FC9" },
];

const PAPER = "#FFFCF3";
const WIDTH = 1200;
const HEIGHT = 800;
const storageKey = (dayKey: string) => `manna:doodle:${dayKey}`;

type Props = { dayKey: string; question: string; dateLabel: string };

/** A drawing pad for today's question. Drawings save on this device only. */
export function DoodlePad({ dayKey, question, dateLabel }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const card = useRef<File | null>(null);
  const cardTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(colors[0].value);
  const [eraser, setEraser] = useState(false);
  const [thick, setThick] = useState(false);
  const [status, setStatus] = useState("");

  const ctx = () => canvas.current?.getContext("2d") ?? null;

  const fill = useCallback(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = PAPER;
    c.fillRect(0, 0, WIDTH, HEIGHT);
  }, []);

  // Keep a share card ready, so the share sheet opens straight from the tap (iPhones require that).
  const prepareCard = useCallback(() => {
    clearTimeout(cardTimer.current);
    cardTimer.current = setTimeout(async () => {
      if (!canvas.current || !hasInk.current) return;
      const blob = await buildDrawingCard(canvas.current, question, dateLabel);
      card.current = blob ? new File([blob], `manna-kids-${dayKey}-drawing.png`, { type: "image/png" }) : null;
    }, 350);
  }, [dayKey, question, dateLabel]);

  useEffect(() => {
    const probe = new File([new Blob()], "probe.png", { type: "image/png" });
    const touch = window.matchMedia("(pointer: coarse)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sharing support is only known in the browser
    setCanShareFiles(touch && typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
  }, []);

  // Restore today's drawing, if any.
  useEffect(() => {
    fill();
    try {
      const saved = localStorage.getItem(storageKey(dayKey));
      if (!saved) return;
      const img = new Image();
      img.onload = () => {
        ctx()?.drawImage(img, 0, 0, WIDTH, HEIGHT);
        hasInk.current = true;
        prepareCard();
      };
      img.src = saved;
    } catch {
      // Storage unavailable; start with a blank page.
    }
  }, [dayKey, fill, prepareCard]);

  function save() {
    prepareCard();
    try {
      localStorage.setItem(storageKey(dayKey), canvas.current!.toDataURL("image/jpeg", 0.8));
    } catch {
      // Storage full or blocked; the drawing still shows for this visit.
    }
  }

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * WIDTH, y: ((e.clientY - rect.top) / rect.height) * HEIGHT };
  }

  function stroke(from: { x: number; y: number }, to: { x: number; y: number }) {
    const c = ctx();
    if (!c) return;
    c.strokeStyle = eraser ? PAPER : color;
    c.lineWidth = eraser ? 48 : thick ? 22 : 9;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(from.x, from.y);
    c.lineTo(to.x, to.y);
    c.stroke();
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    hasInk.current = true;
    const p = point(e);
    last.current = p;
    stroke(p, { x: p.x + 0.1, y: p.y + 0.1 });
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const p = point(e);
    stroke(last.current, p);
    last.current = p;
  }

  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    save();
  }

  function clear() {
    fill();
    hasInk.current = false;
    card.current = null;
    try {
      localStorage.removeItem(storageKey(dayKey));
    } catch {}
    setStatus("Page cleared");
    setTimeout(() => setStatus(""), 2000);
  }

  function download() {
    canvas.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manna-kids-drawing-${dayKey}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("Drawing saved to your device");
      setTimeout(() => setStatus(""), 3000);
    }, "image/png");
  }

  async function shareCard() {
    if (!hasInk.current) {
      setStatus("Draw something first, then share it.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    // Phones: open the share sheet with the ready-made card (Instagram appears there).
    if (canShareFiles && card.current) {
      try {
        await navigator.share({ files: [card.current], title: "Our Manna Kids drawing" });
        track("ig_share", "kids-drawing");
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") setStatus("Couldn’t open sharing. Use Save drawing instead.");
      }
      return;
    }
    // Computers: download the story card to post from a phone.
    const blob = card.current ?? (canvas.current ? await buildDrawingCard(canvas.current, question, dateLabel) : null);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manna-kids-${dayKey}-story.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    track("ig_share", "kids-drawing");
    setStatus("Story image saved. Open Instagram on your phone and add it to your story.");
    setTimeout(() => setStatus(""), 4000);
  }

  return (
    <section className="doodle" aria-labelledby="doodle-title">
      <div className="doodle-head">
        <div>
          <span className="label">Draw it</span>
          <h2 id="doodle-title">Draw your answer</h2>
        </div>
        <p className="doodle-note">Your drawing stays on this device unless you share it.</p>
      </div>

      <div className="doodle-tools" role="toolbar" aria-label="Drawing tools">
        <div className="swatches-row" role="radiogroup" aria-label="Color">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={!eraser && color === c.value}
              aria-label={c.name}
              className="swatch"
              style={{ background: c.value }}
              onClick={() => {
                setColor(c.value);
                setEraser(false);
              }}
            />
          ))}
        </div>
        <div className="doodle-buttons">
          <button type="button" className="btn btn-small" aria-pressed={thick} onClick={() => setThick((t) => !t)}>
            {thick ? "Thin brush" : "Thick brush"}
          </button>
          <button type="button" className="btn btn-small" aria-pressed={eraser} onClick={() => setEraser((v) => !v)}>
            Eraser
          </button>
          <button type="button" className="btn btn-small" onClick={clear}>Clear</button>
          <button type="button" className="btn btn-small" onClick={download}>Save drawing</button>
          <button type="button" className="btn btn-small btn-instagram" onClick={shareCard}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            {canShareFiles ? "Share to Instagram" : "Instagram story image"}
          </button>
        </div>
      </div>

      <canvas
        ref={canvas}
        className={`doodle-canvas${eraser ? " is-erasing" : ""}`}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Drawing area. Draw with your finger, a pen or a mouse."
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </section>
  );
}
