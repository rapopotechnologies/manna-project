"use client";

import { useState } from "react";
import { ShareToInstagram } from "@/components/ShareToInstagram";
import { ShareToWhatsApp } from "@/components/ShareToWhatsApp";
import { useLang } from "@/i18n/client";
import { track } from "@/lib/track";

type Props = {
  dayKey: string;
  text: string;
  /** Shown as written, so pass the Indonesian reference on Indonesian pages. */
  reference: string;
  version: string;
  chapterHref: string;
  cardHref: string;
  shareUrl: string;
};

const T = {
  en: {
    title: (ref: string) => `Today’s verse: ${ref}`,
    wa: (quote: string, url: string) => `${quote}\n\nToday’s verse on Manna: ${url}`,
    copiedBoth: "Verse and link copied",
    noShare: "Couldn’t open sharing on this device",
    copied: "Verse copied",
    selectToCopy: "Select the verse above to copy it",
    shareLink: "Share link",
    copy: "Copy",
    saveImage: "Save image",
    chapter: "Read chapter ↗",
  },
  id: {
    title: (ref: string) => `Ayat hari ini: ${ref}`,
    wa: (quote: string, url: string) => `${quote}\n\nAyat hari ini di Manna: ${url}`,
    copiedBoth: "Ayat dan tautan tersalin",
    noShare: "Tidak bisa membuka menu berbagi di perangkat ini",
    copied: "Ayat tersalin",
    selectToCopy: "Pilih teks ayat di atas untuk menyalinnya",
    shareLink: "Bagikan tautan",
    copy: "Salin",
    saveImage: "Simpan gambar",
    chapter: "Baca pasal ↗",
  },
};

export function VerseActions({ dayKey, text, reference, version, chapterHref, cardHref, shareUrl }: Props) {
  const lang = useLang();
  const t = T[lang];
  const [status, setStatus] = useState("");
  const quote = `“${text}” — ${reference} (${version})`;
  const langQuery = lang === "id" ? "&lang=id" : "";

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 4000);
  }

  async function share() {
    const data = { title: t.title(reference), text: quote, url: shareUrl };
    if (navigator.share) {
      try {
        await navigator.share(data);
        track("link_share", "daily");
      } catch {
        // The person closed the share sheet; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${quote}\n${shareUrl}`);
      flash(t.copiedBoth);
    } catch {
      flash(t.noShare);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(quote);
      flash(t.copied);
    } catch {
      flash(t.selectToCopy);
    }
  }

  return (
    <div className="verse-actions">
      <div className="verse-buttons">
        <ShareToInstagram
          storyUrl={`/daily/card?format=story&d=${dayKey}${langQuery}`}
          filename={`manna-${dayKey}-story.png`}
          title={t.title(reference)}
          trackKey="daily"
          onStatus={flash}
        />
        <ShareToWhatsApp text={t.wa(quote, shareUrl)} trackKey="daily" />
        <button type="button" className="btn" onClick={share}>{t.shareLink}</button>
        <button type="button" className="btn" onClick={copy}>{t.copy}</button>
        <a className="btn" href={`${cardHref}?d=${dayKey}${langQuery}`} download={`manna-${dayKey}.png`}>{t.saveImage}</a>
        <a className="btn" href={chapterHref} target="_blank" rel="noopener noreferrer">{t.chapter}</a>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
