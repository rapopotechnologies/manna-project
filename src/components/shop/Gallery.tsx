"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = { images: { src: string; alt: string }[]; name: string };

/** Swipeable product photos with thumbnails. Uses native scroll snapping. */
export function Gallery({ images, name }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Follow whichever photo is in view as people swipe.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setActive(Math.min(images.length - 1, Math.max(0, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [images.length]);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const next = (i + images.length) % images.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
        }}
      >
        {images.map((img, i) => (
          <div className="gallery-slide" key={img.src} data-index={i} aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
            <Image
              src={img.src}
              alt={img.alt}
              width={1500}
              height={1200}
              sizes="(max-width: 860px) 100vw, 620px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="gallery-arrows">
            <button type="button" className="gallery-arrow" onClick={() => go(active - 1)} aria-label="Previous photo">←</button>
            <span className="gallery-count" aria-live="polite">{active + 1} / {images.length}</span>
            <button type="button" className="gallery-arrow" onClick={() => go(active + 1)} aria-label="Next photo">→</button>
          </div>
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <button
                type="button"
                key={img.src}
                className="gallery-thumb"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
              >
                <Image src={img.src} alt="" width={120} height={96} sizes="96px" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
