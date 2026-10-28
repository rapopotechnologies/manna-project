"use client";

import { useEffect, useState } from "react";
import { ShareToInstagram } from "@/components/ShareToInstagram";
import { ShareToWhatsApp } from "@/components/ShareToWhatsApp";
import { useLang } from "@/i18n/client";
import { localPath } from "@/i18n/lang";
import { SITE_URL } from "@/lib/site";

type Props = { question: string; dayKey: string };

const T = {
  en: {
    copyPrefix: "Manna Kids question",
    copied: "Question copied",
    select: "Select the question above to copy it",
    stop: "Stop reading",
    read: "Read it aloud",
    title: "Today’s Manna Kids question",
    wa: (q: string, url: string) => `Manna Kids question for today: ${q}\n\nAsk it around the table: ${url}`,
    copy: "Copy",
  },
  id: {
    copyPrefix: "Pertanyaan Manna Kids",
    copied: "Pertanyaan tersalin",
    select: "Pilih teks pertanyaan di atas untuk menyalinnya",
    stop: "Berhenti membaca",
    read: "Bacakan",
    title: "Pertanyaan Manna Kids hari ini",
    wa: (q: string, url: string) => `Pertanyaan Manna Kids hari ini: ${q}\n\nTanyakan di meja makan: ${url}`,
    copy: "Salin",
  },
};

/** Read aloud, share and copy for today's kids' question (pass it in the page's language). */
export function KidsActions({ question, dayKey }: Props) {
  const lang = useLang();
  const t = T[lang];
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature check only possible in the browser
    setCanSpeak("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus(""), 4000);
  }

  function readAloud() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.9;
    utterance.lang = lang === "id" ? "id-ID" : "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${t.copyPrefix}: ${question}`);
      flash(t.copied);
    } catch {
      flash(t.select);
    }
  }

  return (
    <div className="kids-actions">
      <div className="verse-buttons">
        {canSpeak && (
          <button type="button" className="btn btn-sage" onClick={readAloud} aria-pressed={speaking}>
            <SpeakerGlyph />
            {speaking ? t.stop : t.read}
          </button>
        )}
        <ShareToInstagram
          storyUrl={`/kids/card?format=story&d=${dayKey}${lang === "id" ? "&lang=id" : ""}`}
          filename={`manna-kids-${dayKey}-story.png`}
          title={t.title}
          trackKey="kids"
          onStatus={flash}
        />
        <ShareToWhatsApp text={t.wa(question, `${SITE_URL}${localPath(lang, "/kids")}`)} trackKey="kids" />
        <button type="button" className="btn" onClick={copy}>{t.copy}</button>
      </div>
      <p className="toast" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function SpeakerGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
