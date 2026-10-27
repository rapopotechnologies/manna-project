"use client";

import { useState } from "react";
import { ShareToInstagram } from "@/components/ShareToInstagram";

type Props = { slug: string; text: string; reference: string; translation: string };

export function FoundActions({ slug, text, reference, translation }: Props) {
  const [status, setStatus] = useState("");

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 4000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`“${text}” — ${reference} (${translation})`);
      flash("Verse copied");
    } catch {
      flash("Select the verse above to copy it");
    }
  }

  return (
    <div className="found-actions">
      <div className="verse-buttons">
        <ShareToInstagram
          storyUrl={`/found/${slug}/card?format=story`}
          filename={`manna-${slug}-story.png`}
          title={`A verse I found: ${reference}`}
          onStatus={flash}
        />
        <button type="button" className="btn" onClick={copy}>Copy</button>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
