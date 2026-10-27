"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/** A drawing pad for today's question. Drawings save on this device only. */
export function DoodlePad({ dayKey }: { dayKey: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
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

  // Restore today's drawing, if any.
  useEffect(() => {
    fill();
    try {
      const saved = localStorage.getItem(storageKey(dayKey));
      if (!saved) return;
      const img = new Image();
      img.onload = () => ctx()?.drawImage(img, 0, 0, WIDTH, HEIGHT);
      img.src = saved;
    } catch {
      // Storage unavailable; start with a blank page.
    }
  }, [dayKey, fill]);

  function save() {
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

  return (
    <section className="doodle" aria-labelledby="doodle-title">
      <div className="doodle-head">
        <div>
          <span className="label">Draw it</span>
          <h2 id="doodle-title">Draw your answer</h2>
        </div>
        <p className="doodle-note">Your drawing stays on this device.</p>
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
          <button type="button" className="btn btn-small btn-primary" onClick={download}>Save drawing</button>
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
