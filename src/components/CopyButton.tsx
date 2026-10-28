"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";

type Props = {
  text: string;
  label: string;
  doneLabel?: string;
  className?: string;
};

export function CopyButton({ text, label, doneLabel, className = "btn" }: Props) {
  const id = useLang() === "id";
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt(id ? "Salin ini:" : "Copy this:", text);
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{done ? (doneLabel ?? (id ? "Tersalin" : "Copied")) : label}</span>
    </button>
  );
}
