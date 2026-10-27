"use client";

import { useEffect, useState } from "react";
import { ShareToInstagram } from "@/components/ShareToInstagram";

type Props = { question: string; dayKey: string };

/** Read aloud, share and copy for today's kids' question. */
export function KidsActions({ question, dayKey }: Props) {
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
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`Manna Kids question: ${question}`);
      flash("Question copied");
    } catch {
      flash("Select the question above to copy it");
    }
  }

  return (
    <div className="kids-actions">
      <div className="verse-buttons">
        {canSpeak && (
          <button type="button" className="btn btn-sage" onClick={readAloud} aria-pressed={speaking}>
            <SpeakerGlyph />
            {speaking ? "Stop reading" : "Read it aloud"}
          </button>
        )}
        <ShareToInstagram
          storyUrl={`/kids/card?format=story&d=${dayKey}`}
          filename={`manna-kids-${dayKey}-story.png`}
          title="Today’s Manna Kids question"
          trackKey="kids"
          onStatus={flash}
        />
        <button type="button" className="btn" onClick={copy}>Copy</button>
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
