"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { SITE_URL } from "@/lib/site";

export type QrTarget = { group: string; path: string; label: string };

type Lang = "auto" | "en" | "id";

const INK = "#1C1B17";
const PAPER = "#FFFFFF";

/** Pick a page, get a QR code for it as SVG (for print) or PNG. */
export function QrMaker({ targets }: { targets: QrTarget[] }) {
  const [path, setPath] = useState(targets[0]?.path ?? "/daily");
  const [custom, setCustom] = useState("");
  const [lang, setLang] = useState<Lang>("auto");
  const [count, setCount] = useState(true);
  const [svg, setSvg] = useState("");
  const [png, setPng] = useState("");

  const groups = useMemo(() => [...new Set(targets.map((t) => t.group))], [targets]);
  const chosen = custom.trim() ? (custom.trim().startsWith("/") ? custom.trim() : `/${custom.trim()}`) : path;
  const localized = lang === "id" ? (chosen === "/" ? "/id" : `/id${chosen}`) : chosen;
  const url = `${SITE_URL}${localized}${count ? `${localized.includes("?") ? "&" : "?"}src=qr` : ""}`;
  const name = `manna-qr-${(localized.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home").toLowerCase()}`;

  useEffect(() => {
    let live = true;
    const options = { errorCorrectionLevel: "M" as const, margin: 2, color: { dark: INK, light: PAPER } };
    Promise.all([QRCode.toString(url, { ...options, type: "svg" }), QRCode.toDataURL(url, { ...options, width: 1200 })]).then(([s, p]) => {
      if (!live) return;
      setSvg(s);
      setPng(p);
    });
    return () => {
      live = false;
    };
  }, [url]);

  const svgHref = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : undefined;

  return (
    <div className="panel-grid qr-maker">
      <section className="panel" aria-labelledby="qr-what">
        <h2 id="qr-what">Where should it go?</h2>
        <div className="admin-form">
          <label className="field" htmlFor="qr-page">
            <span>Page</span>
            <select id="qr-page" value={path} onChange={(e) => { setPath(e.target.value); setCustom(""); }}>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {targets.filter((t) => t.group === g).map((t) => (
                    <option key={t.path} value={t.path}>{t.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="field" htmlFor="qr-custom">
            <span>Or another address on the site</span>
            <input id="qr-custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="/shop#stickers" />
            <small>Starts with a slash. Leave empty to use the page above.</small>
          </label>
          <fieldset className="field qr-langs">
            <span>Language</span>
            <label><input type="radio" name="qr-lang" checked={lang === "auto"} onChange={() => setLang("auto")} /> Automatic (Indonesian phones see Indonesian)</label>
            <label><input type="radio" name="qr-lang" checked={lang === "en"} onChange={() => setLang("en")} /> English page</label>
            <label><input type="radio" name="qr-lang" checked={lang === "id"} onChange={() => setLang("id")} /> Indonesian page</label>
          </fieldset>
          <label className="qr-check">
            <input type="checkbox" checked={count} onChange={(e) => setCount(e.target.checked)} /> Count scans on the overview
          </label>
        </div>
      </section>

      <section className="panel qr-result" aria-labelledby="qr-code">
        <h2 id="qr-code">Your QR code</h2>
        <div className="qr-preview">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt={`QR code for ${url}`} width={240} height={240} />
          ) : (
            <span className="muted">Making it…</span>
          )}
        </div>
        <p className="qr-url">{url}</p>
        <div className="qr-actions">
          <a className="btn btn-primary" href={svgHref} download={`${name}.svg`} aria-disabled={!svg}>Download SVG (for print)</a>
          <a className="btn" href={png || undefined} download={`${name}.png`} aria-disabled={!png}>Download PNG</a>
          <a className="btn" href={url} target="_blank" rel="noopener noreferrer">Test the link ↗</a>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Print it at least 2 cm wide, dark on a light background. “Automatic” codes work for everyone: phones set to Indonesian open the
          Indonesian page.
        </p>
      </section>
    </div>
  );
}
