"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { useLang } from "@/i18n/client";

/** Cloudflare Turnstile site key. Without it, no check is shown (and Supabase shouldn't require one). */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  onToken: (token: string | null) => void;
  /** Change this number to get a fresh token (each token works once). */
  resetKey: number;
};

/** Cloudflare's "are you human" check, shown on the account forms to stop fake sign-ups. */
export function Turnstile({ onToken, resetKey }: Props) {
  const lang = useLang();
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const tokenCb = useRef(onToken);
  useEffect(() => {
    tokenCb.current = onToken;
  }, [onToken]);

  const mount = useCallback(() => {
    if (!box.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(box.current, {
      sitekey: TURNSTILE_SITE_KEY,
      language: lang === "id" ? "id" : "en",
      theme: "auto",
      size: "flexible",
      callback: (token: string) => tokenCb.current(token),
      "expired-callback": () => tokenCb.current(null),
      "error-callback": () => tokenCb.current(null),
    });
  }, [lang]);

  useEffect(() => {
    mount();
    return () => {
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [mount]);

  useEffect(() => {
    if (resetKey && widget.current && window.turnstile) {
      tokenCb.current(null);
      window.turnstile.reset(widget.current);
    }
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={mount} />
      <div ref={box} className="turnstile" />
    </>
  );
}
