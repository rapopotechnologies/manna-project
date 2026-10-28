"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/client";
import { track } from "@/lib/track";

type Props = {
  /** Story-sized image to share, e.g. /daily/card?format=story&d=2026-10-27 */
  storyUrl: string;
  filename: string;
  title: string;
  /** What is being shared, for the admin counts: "daily", "kids" or a verse slug. */
  trackKey: string;
  onStatus: (message: string) => void;
};

type Mode = "share" | "download";

/**
 * Opens the phone's share sheet with a story-sized image, so
 * Instagram (Stories, Feed or Direct) shows up as a target. Websites can't post
 * to Instagram directly; the share sheet is the supported path.
 * On computers and older phones it downloads the image instead.
 */
export function ShareToInstagram({ storyUrl, filename, title, trackKey, onStatus }: Props) {
  const id = useLang() === "id";
  const file = useRef<File | null>(null);
  const [mode, setMode] = useState<Mode>("download");

  // Fetch the image ahead of the tap. iOS only allows sharing a file if the
  // share sheet opens right after the tap, with no download in between.
  useEffect(() => {
    let cancelled = false;
    // Only phones and tablets have Instagram in their share sheet.
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const probe = new File([new Blob()], "probe.png", { type: "image/png" });
    const canShareFiles = typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] });
    if (!isTouchDevice || !canShareFiles) return;

    fetch(storyUrl)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => {
        if (cancelled) return;
        file.current = new File([blob], filename, { type: "image/png" });
        setMode("share");
      })
      .catch(() => {
        // Leave the download fallback in place.
      });
    return () => {
      cancelled = true;
    };
  }, [storyUrl, filename]);

  async function share() {
    if (!file.current) return;
    try {
      await navigator.share({ files: [file.current], title });
      track("ig_share", trackKey);
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        onStatus(id ? "Tidak bisa membuka menu berbagi. Simpan gambarnya, lalu unggah dari Instagram." : "Couldn’t open sharing. Use Save image, then post it from Instagram.");
      }
    }
  }

  if (mode === "share") {
    return (
      <button type="button" className="btn btn-instagram" onClick={share}>
        <InstagramGlyph />
        {id ? "Bagikan ke Instagram" : "Share to Instagram"}
      </button>
    );
  }

  return (
    <a
      className="btn btn-instagram"
      href={storyUrl}
      download={filename}
      onClick={() => {
        track("ig_share", trackKey);
        onStatus(id ? "Gambar story tersimpan. Buka Instagram di ponselmu dan tambahkan ke story-mu." : "Story image saved. Open Instagram on your phone and add it to your story.");
      }}
    >
      <InstagramGlyph />
      {id ? "Gambar Instagram Story" : "Instagram story image"}
    </a>
  );
}

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
