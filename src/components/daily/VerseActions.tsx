"use client";

import { useState } from "react";

type Props = {
  text: string;
  reference: string;
  version: string;
  chapterHref: string;
  cardHref: string;
  shareUrl: string;
};

export function VerseActions({ text, reference, version, chapterHref, cardHref, shareUrl }: Props) {
  const [status, setStatus] = useState("");
  const quote = `“${text}” — ${reference} (${version})`;

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 2200);
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
        <button type="button" className="btn btn-primary" onClick={share}>Share</button>
        <button type="button" className="btn" onClick={copy}>Copy</button>
        <a className="btn" href={cardHref} download>Save image</a>
        <a className="btn" href={chapterHref} target="_blank" rel="noopener noreferrer">Read chapter ↗</a>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
