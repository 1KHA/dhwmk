import type { CSSProperties } from "react";

/*
 * Decorative glyphs from public/pattern (one file per icon in /pattern/icons).
 * Painted through a CSS mask (see .dhl-ico in landing.css) so each can be
 * tinted to its section; every icon is used exactly once on the landing page.
 */
export default function Icon({ name, className }: { name: string; className: string }) {
  return (
    <span
      className={`dhl-ico ${className}`}
      style={{ "--ico": `url(/pattern/icons/${name}.svg)` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
