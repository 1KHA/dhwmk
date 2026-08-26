"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface WinnerSlide {
  /** Image shown in the carousel and lightbox. */
  src: string;
  /** Full title (alt text, caption, lightbox heading). */
  title: string;
  /** Short label for the navigation chips. */
  label: string;
}

/* Winner posters live in public/winners; the web/ copies are resized for the page. */
const WINNERS: WinnerSlide[] = [
  { src: "/winners/web/first.jpg", title: "الفريق الفائز بالمركز الأول", label: "المركز الأول" },
  { src: "/winners/web/second.jpg", title: "الفريق الفائز بالمركز الثاني", label: "المركز الثاني" },
  { src: "/winners/web/third.jpg", title: "الفريق الفائز بالمركز الثالث", label: "المركز الثالث" },
  { src: "/winners/web/audience.jpg", title: "الفريق الفائز بجائزة تصويت الجمهور", label: "تصويت الجمهور" },
];

interface ImageCarouselProps {
  slides?: WinnerSlide[];
  autoRotateInterval?: number;
}

/* Horizontal spacing between neighbouring cards, as a fraction of a card's width. */
const CARD_GAP = 0.76;
/* Tilt of the side cards (they face the centre). */
const CARD_TILT = 14;

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
  </svg>
);

/*
 * Coverflow-style carousel for the winning teams. Reads right-to-left like the
 * rest of the page: the next slide waits on the LEFT, so dragging the deck to the
 * right (or pressing the left arrow) advances. Autoplay pauses while the pointer
 * is over the stage, while dragging, while the lightbox is open, and while the
 * tab is hidden. Clicking the centre card opens the poster full-screen.
 */
export default function ImageCarousel({ slides = WINNERS, autoRotateInterval = 5000 }: ImageCarouselProps) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; t: number; moved: boolean } | null>(null);
  /* When the last drag actually moved; a click landing right after it is not a "tap". */
  const lastDragEnd = useRef(0);

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  const paused = hover || dragging || hidden || lightbox !== null;

  /* ---- autoplay (restarts its progress whenever it resumes) ---- */
  useEffect(() => {
    if (paused) return;
    setCycle((c) => c + 1);
    const t = setTimeout(next, autoRotateInterval);
    return () => clearTimeout(t);
  }, [index, paused, next, autoRotateInterval]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* ---- lightbox: keyboard + scroll lock ---- */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i + 1) % n));
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i - 1 + n) % n));
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, n]);

  /* ---- pointer drag / swipe ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointer.current = { id: e.pointerId, x: e.clientX, t: performance.now(), moved: false };
    stageRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    setDrag(0);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p || e.pointerId !== p.id) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > 6) p.moved = true;
    setDrag(dx);
  };
  const endDrag = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p || e.pointerId !== p.id) return;
    const dx = e.clientX - p.x;
    const velocity = dx / Math.max(performance.now() - p.t, 1); // px per ms
    const width = stageRef.current?.clientWidth ?? 800;
    const threshold = Math.min(90, width * 0.12);
    if (Math.abs(dx) > threshold || Math.abs(velocity) > 0.45) {
      if (dx > 0) next();
      else prev();
    }
    lastDragEnd.current = p.moved ? performance.now() : 0;
    pointer.current = null;
    setDrag(0);
    setDragging(false);
  };

  const onCardClick = (i: number, offset: number) => {
    if (performance.now() - lastDragEnd.current < 300) return;
    if (offset === 0) setLightbox(i);
    else go(i);
  };

  const onStageKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); next(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); prev(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightbox(index); }
  };

  const current = slides[index];

  return (
    <section className="dhl-wc" aria-roledescription="carousel" aria-label="المشاريع الفائزة" data-reveal>
      <div
        ref={stageRef}
        className={`dhl-wc-stage${dragging ? " is-dragging" : ""}`}
        tabIndex={0}
        onKeyDown={onStageKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <div className="dhl-wc-glow" aria-hidden="true" />

        {slides.map((s, i) => {
          let offset = (i - index + n) % n;
          if (offset > n / 2) offset -= n;
          const abs = Math.abs(offset);
          const far = abs >= 2;
          const style: React.CSSProperties = far
            ? { transform: "translateX(0) scale(0.6)", opacity: 0, zIndex: 0 }
            : {
                transform: `translateX(calc(${-offset * CARD_GAP * 100}% + ${drag}px)) scale(${1 - 0.16 * abs}) rotateY(${-offset * CARD_TILT}deg)`,
                opacity: 1 - 0.32 * abs,
                zIndex: 10 - abs,
              };
          return (
            <figure
              key={s.src}
              className={`dhl-wc-card${offset === 0 ? " is-active" : ""}`}
              style={style}
              data-offset={offset}
              aria-hidden={offset !== 0}
              onClick={() => onCardClick(i, offset)}
            >
              <img src={s.src} alt={s.title} draggable={false} loading={abs === 0 ? "eager" : "lazy"} />
              <span className="dhl-wc-zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                </svg>
              </span>
            </figure>
          );
        })}

        <button type="button" className="dhl-wc-arrow dhl-wc-arrow-next" onClick={next} aria-label="التالي">
          <Chevron dir="left" />
        </button>
        <button type="button" className="dhl-wc-arrow dhl-wc-arrow-prev" onClick={prev} aria-label="السابق">
          <Chevron dir="right" />
        </button>
      </div>

      <p className="dhl-wc-caption" key={index} aria-live="polite">
        {current.title}
        <span className="dhl-wc-count" dir="ltr">{index + 1} / {n}</span>
      </p>

      <div className="dhl-wc-nav" role="tablist" aria-label="اختر الفريق">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={active}
              className={`dhl-wc-chip${active ? " is-active" : ""}`}
              onClick={() => go(i)}
            >
              {active && (
                <span
                  key={cycle}
                  className="dhl-wc-progress"
                  style={{ animationDuration: `${autoRotateInterval}ms`, animationPlayState: paused ? "paused" : "running" }}
                  aria-hidden="true"
                />
              )}
              <span className="dhl-wc-chip-text">{s.label}</span>
            </button>
          );
        })}
      </div>

      {lightbox !== null &&
        createPortal(
          <div className="dhl-lb" role="dialog" aria-modal="true" aria-label={slides[lightbox].title} dir="rtl" onClick={() => setLightbox(null)}>
            <button type="button" className="dhl-lb-close" aria-label="إغلاق" onClick={() => setLightbox(null)}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <button type="button" className="dhl-lb-arrow dhl-lb-arrow-next" aria-label="التالي" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % n); }}>
              <Chevron dir="left" />
            </button>
            <button type="button" className="dhl-lb-arrow dhl-lb-arrow-prev" aria-label="السابق" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + n) % n); }}>
              <Chevron dir="right" />
            </button>
            <figure className="dhl-lb-figure" key={lightbox} onClick={(e) => e.stopPropagation()}>
              <img src={slides[lightbox].src} alt={slides[lightbox].title} />
              <figcaption>
                {slides[lightbox].title}
                <span dir="ltr">{lightbox + 1} / {n}</span>
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </section>
  );
}
