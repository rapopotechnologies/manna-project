"use client";

import { useState } from "react";
import { ShareToInstagram } from "@/components/daily/ShareToInstagram";

type Props = {
  dayKey: string;
  text: string;
  reference: string;
  version: string;
  chapterHref: string;
  cardHref: string;
  shareUrl: string;
};

export function VerseActions({ dayKey, text, reference, version, chapterHref, cardHref, shareUrl }: Props) {
  const [status, setStatus] = useState("");
  const quote = `“${text}” — ${reference} (${version})`;

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 4000);
  }

  async function share() {
    const data = { title: `Today’s verse: ${reference}`, text: quote, url: shareUrl };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // The person closed the share sheet; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${quote}\n${shareUrl}`);
      flash("Verse and link copied");
    } catch {
      flash("Couldn’t open sharing on this device");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(quote);
      flash("Verse copied");
    } catch {
      flash("Select the verse above to copy it");
    }
  }

  return (
    <div className="verse-actions">
      <div className="verse-buttons">
        <ShareToInstagram dayKey={dayKey} reference={reference} onStatus={flash} />
        <button type="button" className="btn" onClick={share}>Share link</button>
        <button type="button" className="btn" onClick={copy}>Copy</button>
        <a className="btn" href={`${cardHref}?d=${dayKey}`} download={`manna-${dayKey}.png`}>Save image</a>
        <a className="btn" href={chapterHref} target="_blank" rel="noopener noreferrer">Read chapter ↗</a>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
