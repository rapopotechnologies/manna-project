"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export type ImageItem = { src: string; alt: string };

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Upload, describe, reorder and remove photos. The first photo is the cover. */
export function ImageManager({ initial, folder }: { initial: ImageItem[]; folder: string }) {
  const [images, setImages] = useState<ImageItem[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function update(i: number, patch: Partial<ImageItem>) {
    setImages((list) => list.map((img, n) => (n === i ? { ...img, ...patch } : img)));
  }
  function move(i: number, dir: -1 | 1) {
    setImages((list) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setBusy(true);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        if (!TYPES.includes(file.type)) throw new Error(`${file.name} isn’t a JPEG, PNG, WebP or AVIF image.`);
        if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 8 MB. Export a smaller version and try again.`);
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
        const path = `${folder}/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage.from("site-images").upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw new Error(`Couldn’t upload ${file.name}: ${upErr.message}`);
        const { data } = supabase.storage.from("site-images").getPublicUrl(path);
        setImages((list) => [...list, { src: data.publicUrl, alt: "" }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <span>Photos</span>
      <small>The first photo is the cover in the shop. Describe each one for people using screen readers.</small>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <div className="images">
        {images.map((img, i) => (
          <div className="image-card" key={img.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" />
            <div className="image-body">
              {i === 0 && <span className="image-first">Cover photo</span>}
              <input
                aria-label={`Description for photo ${i + 1}`}
                placeholder="Describe this photo"
                value={img.alt}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
              <div className="row-actions">
                <span>
                  <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}>←</button>{" "}
                  <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label={`Move photo ${i + 1} later`}>→</button>
                </span>
                <button type="button" className="icon-btn" onClick={() => setImages((l) => l.filter((_, n) => n !== i))}>Remove</button>
              </div>
            </div>
          </div>
        ))}
        <label className="upload" style={{ position: "relative" }}>
          <input type="file" accept={TYPES.join(",")} multiple onChange={(e) => upload(e.target.files)} disabled={busy} />
          <span>{busy ? "Uploading…" : "+ Add photos\nJPEG, PNG or WebP, up to 8 MB"}</span>
        </label>
      </div>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
    </div>
  );
}
