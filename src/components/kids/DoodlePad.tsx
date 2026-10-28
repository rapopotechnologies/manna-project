"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildDrawingCard } from "@/lib/drawing-card";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/track";

const colors = [
  { name: "Ink", nameId: "Hitam", value: "#1C1B17" },
  { name: "Gold", nameId: "Emas", value: "#E1AD37" },
  { name: "Sage", nameId: "Hijau sage", value: "#6FA597" },
  { name: "Olive", nameId: "Hijau zaitun", value: "#7E7A3F" },
  { name: "Coral", nameId: "Koral", value: "#E0785E" },
  { name: "Sky", nameId: "Biru langit", value: "#5B8FC9" },
];

const T = {
  en: {
    cleared: "Page cleared",
    saved: "Drawing saved to your device",
    drawFirst: "Draw something first, then share it.",
    shareTitle: "Our Manna Kids drawing",
    noShare: "Couldn’t open sharing. Use Save drawing instead.",
    storySaved: "Story image saved. Open Instagram on your phone and add it to your story.",
    label: "Draw it",
    title: "Draw your answer",
    note: "Your drawing stays on this device unless you share it.",
    tools: "Drawing tools",
    color: "Color",
    thin: "Thin brush",
    thick: "Thick brush",
    eraser: "Eraser",
    clear: "Clear",
    save: "Save drawing",
    share: "Share to Instagram",
    story: "Instagram story image",
    canvas: "Drawing area. Draw with your finger, a pen or a mouse.",
    url: "BYMANNAPROJECT.COM/KIDS",
    wa: "WhatsApp",
    waMessage: (q: string, url: string) => `We drew our answer to today’s Manna Kids question: “${q}”\n\n${url}`,
    waSaved: "Drawing saved. Attach it to your WhatsApp message.",
  },
  id: {
    cleared: "Halaman dibersihkan",
    saved: "Gambar tersimpan di perangkatmu",
    drawFirst: "Gambar sesuatu dulu, lalu bagikan.",
    shareTitle: "Gambar Manna Kids kami",
    noShare: "Tidak bisa membuka menu berbagi. Pakai Simpan gambar saja.",
    storySaved: "Gambar story tersimpan. Buka Instagram di ponselmu dan tambahkan ke story-mu.",
    label: "Gambarkan",
    title: "Gambarkan jawabanmu",
    note: "Gambarmu tetap di perangkat ini kecuali kamu membagikannya.",
    tools: "Alat menggambar",
    color: "Warna",
    thin: "Kuas tipis",
    thick: "Kuas tebal",
    eraser: "Penghapus",
    clear: "Bersihkan",
    save: "Simpan gambar",
    share: "Bagikan ke Instagram",
    story: "Gambar Instagram Story",
    canvas: "Area menggambar. Gambar dengan jari, pena, atau mouse.",
    url: "BYMANNAPROJECT.COM/ID/KIDS",
    wa: "WhatsApp",
    waMessage: (q: string, url: string) => `Kami menggambar jawaban untuk pertanyaan Manna Kids hari ini: “${q}”\n\n${url}`,
    waSaved: "Gambar tersimpan. Lampirkan ke pesan WhatsApp-mu.",
  },
};

const PAPER = "#FFFCF3";
const WIDTH = 1200;
const HEIGHT = 800;
const storageKey = (dayKey: string) => `manna:doodle:${dayKey}`;

type Props = { dayKey: string; question: string; dateLabel: string };

/** A drawing pad for today's question. Drawings save on this device only. */
export function DoodlePad({ dayKey, question, dateLabel }: Props) {
  const lang = useLang();
  const t = T[lang];
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
      const blob = await buildDrawingCard(canvas.current, question, dateLabel, t.url);
      card.current = blob ? new File([blob], `manna-kids-${dayKey}-drawing.png`, { type: "image/png" }) : null;
    }, 350);
  }, [dayKey, question, dateLabel, t.url]);

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
    setStatus(t.cleared);
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
      setStatus(t.saved);
      setTimeout(() => setStatus(""), 3000);
    }, "image/png");
  }

  function saveBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // WhatsApp links can only carry text, so phones share the image through the share menu
  // (WhatsApp is listed there), and computers save the image and open WhatsApp with the message.
  async function shareWhatsApp() {
    if (!hasInk.current) {
      setStatus(t.drawFirst);
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    const message = t.waMessage(question, `${SITE_URL}${localPath(lang, "/kids")}`);
    if (canShareFiles && card.current) {
      try {
        await navigator.share({ files: [card.current], text: message, title: t.shareTitle });
        track("wa_share", "kids-drawing");
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") setStatus(t.noShare);
      }
      return;
    }
    // Open WhatsApp first, while the tap still counts (pop-up blockers), then save the image.
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    track("wa_share", "kids-drawing");
    const blob = card.current ?? (canvas.current ? await buildDrawingCard(canvas.current, question, dateLabel, t.url) : null);
    if (blob) saveBlob(blob, `manna-kids-${dayKey}-drawing.png`);
    setStatus(t.waSaved);
    setTimeout(() => setStatus(""), 5000);
  }

  async function shareCard() {
    if (!hasInk.current) {
      setStatus(t.drawFirst);
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    // Phones: open the share sheet with the ready-made card (Instagram appears there).
    if (canShareFiles && card.current) {
      try {
        await navigator.share({ files: [card.current], title: t.shareTitle });
        track("ig_share", "kids-drawing");
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") setStatus(t.noShare);
      }
      return;
    }
    // Computers: download the story card to post from a phone.
    const blob = card.current ?? (canvas.current ? await buildDrawingCard(canvas.current, question, dateLabel, t.url) : null);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manna-kids-${dayKey}-story.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    track("ig_share", "kids-drawing");
    setStatus(t.storySaved);
    setTimeout(() => setStatus(""), 4000);
  }

  return (
    <section className="doodle" aria-labelledby="doodle-title">
      <div className="doodle-head">
        <div>
          <span className="label">{t.label}</span>
          <h2 id="doodle-title">{t.title}</h2>
        </div>
        <p className="doodle-note">{t.note}</p>
      </div>

      <div className="doodle-tools" role="toolbar" aria-label={t.tools}>
        <div className="swatches-row" role="radiogroup" aria-label={t.color}>
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={!eraser && color === c.value}
              aria-label={lang === "id" ? c.nameId : c.name}
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
            {thick ? t.thin : t.thick}
          </button>
          <button type="button" className="btn btn-small" aria-pressed={eraser} onClick={() => setEraser((v) => !v)}>
            {t.eraser}
          </button>
          <button type="button" className="btn btn-small" onClick={clear}>{t.clear}</button>
          <button type="button" className="btn btn-small" onClick={download}>{t.save}</button>
          <button type="button" className="btn btn-small btn-wa" onClick={shareWhatsApp}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
            </svg>
            {t.wa}
          </button>
          <button type="button" className="btn btn-small btn-instagram" onClick={shareCard}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            {canShareFiles ? t.share : t.story}
          </button>
        </div>
      </div>

      <canvas
        ref={canvas}
        className={`doodle-canvas${eraser ? " is-erasing" : ""}`}
        width={WIDTH}
        height={HEIGHT}
        aria-label={t.canvas}
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
