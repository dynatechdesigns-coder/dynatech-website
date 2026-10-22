"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Close } from "./Icons";

export type GalleryItem = { src: string; full: string; title: string; subtitle?: string };

export default function Gallery({ items, layout }: { items: GalleryItem[]; layout: "masonry" | "photo" | "thumbs" }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const containerClass = layout === "masonry" ? "masonry" : layout === "photo" ? "photo-grid" : "thumbs";
  const current = index === null ? null : items[index];

  return (
    <>
      <div className={containerClass}>
        {items.map((item, i) => (
          <button
            key={item.full + i}
            type="button"
            className={layout === "thumbs" ? "thumb" : "tile"}
            onClick={() => setIndex(i)}
            aria-label={`Open ${item.title}`}
          >
            <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
            {layout !== "thumbs" && (
              <span className="tile-info">
                <b>{item.title}</b>
                {item.subtitle && <span>{item.subtitle}</span>}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">
            <Close />
          </button>
          {items.length > 1 && (
            <>
              <button
                className="lb-btn lb-prev"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft />
              </button>
              <button
                className="lb-btn lb-next"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight />
              </button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.full} alt={current.title} />
            <figcaption>
              <b>{current.title}</b>
              {current.subtitle}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
