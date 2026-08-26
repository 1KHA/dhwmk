"use client";
import { useEffect } from "react";

/*
 * Scroll-triggered entrance animations. Any element inside `.dhl` carrying a
 * `data-reveal` attribute starts hidden (see the motion rules in landing.css —
 * they only apply once the inline script in Landing.tsx has added `.dhl-js`)
 * and receives `.is-in` the first time it scrolls into view.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".dhl [data-reveal]"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
