"use client";

import { useId, useState } from "react";
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
  /** More quiet links next to "Read the chapter", e.g. the Terjemahan Baru. */
  links?: { href: string; label: string }[];
};

const T = {
  en: {
    title: (ref: string) => `Today’s verse: ${ref}`,
    wa: (quote: string, url: string) => `${quote}\n\nToday’s verse on Manna: ${url}`,
    copiedBoth: "Verse and link copied",
    noShare: "Couldn’t open sharing on this device",
    copied: "Verse copied",
    selectToCopy: "Select the verse above to copy it",
    shareLink: "Send link",
    copy: "Copy verse",
    saveImage: "Save image",
    chapter: "Read the chapter ↗",
    share: "Share",
    close: "Close",
  },
  id: {
    title: (ref: string) => `Ayat hari ini: ${ref}`,
    wa: (quote: string, url: string) => `${quote}\n\nAyat hari ini di Manna: ${url}`,
    copiedBoth: "Ayat dan tautan tersalin",
    noShare: "Tidak bisa membuka menu berbagi di perangkat ini",
    copied: "Ayat tersalin",
    selectToCopy: "Pilih teks ayat di atas untuk menyalinnya",
    shareLink: "Kirim tautan",
    copy: "Salin ayat",
    saveImage: "Simpan gambar",
    chapter: "Baca pasal ↗",
    share: "Bagikan",
    close: "Tutup",
  },
};

/**
 * A quiet row under the verse: Share (opens a tray with every way to share) and Read the chapter.
 * The tray stays in the page while closed, so the Instagram image is ready the moment it's tapped.
 */
export function VerseActions({ dayKey, text, reference, version, chapterHref, cardHref, shareUrl, links = [] }: Props) {
  const lang = useLang();
  const t = T[lang];
  const trayId = useId();
  const [open, setOpen] = useState(false);
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
      <div className="verse-quiet">
        <button type="button" className="btn btn-small share-toggle" aria-expanded={open} aria-controls={trayId} onClick={() => setOpen((o) => !o)}>
          <ShareGlyph />
          {open ? t.close : t.share}
        </button>
        <a className="quiet-link" href={chapterHref} target="_blank" rel="noopener noreferrer">{t.chapter}</a>
        {links.map((l) => (
          <a key={l.href} className="quiet-link" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
        ))}
      </div>
      <div id={trayId} className="verse-buttons share-tray" hidden={!open}>
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
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function ShareGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7.5 7.5 12 3l4.5 4.5" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}
