"use client";

import { useState } from "react";

type Props = {
  text: string;
  label: string;
  doneLabel?: string;
  className?: string;
};

export function CopyButton({ text, label, doneLabel = "Copied", className = "btn" }: Props) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
