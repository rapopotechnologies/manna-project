"use client";

import { useState } from "react";
import { ShareToInstagram } from "@/components/ShareToInstagram";
import { ShareToWhatsApp } from "@/components/ShareToWhatsApp";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { SITE_URL } from "@/lib/site";

type Props = { slug: string; text: string; reference: string; translation: string };

export function FoundActions({ slug, text, reference, translation }: Props) {
  const lang = useLang();
  const id = lang === "id";
  const [status, setStatus] = useState("");

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 4000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`“${text}” — ${reference} (${translation})`);
      flash(id ? "Ayat tersalin" : "Verse copied");
    } catch {
      flash(id ? "Pilih teks ayat di atas untuk menyalinnya" : "Select the verse above to copy it");
    }
  }

  return (
    <div className="found-actions">
      <div className="verse-buttons">
        <ShareToInstagram
          storyUrl={`/found/${slug}/card?format=story${id ? "&lang=id" : ""}`}
          filename={`manna-${slug}-story.png`}
          title={id ? `Ayat yang kutemukan: ${reference}` : `A verse I found: ${reference}`}
          trackKey={slug}
          onStatus={flash}
        />
        <ShareToWhatsApp
          text={`${id ? "Ayat yang kutemukan" : "A verse I found"}: “${text}” — ${reference} (${translation})\n\n${SITE_URL}${localPath(lang, `/found/${slug}`)}`}
          trackKey={slug}
        />
        <button type="button" className="btn" onClick={copy}>{id ? "Salin" : "Copy"}</button>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
