# Landing Page (pixel-perfect recreation in code)

A faithful HTML/CSS recreation of the original landing image (`public/dhnew001.png`, 3840×13116).
Everything that was pixels is now real markup: text, cards, gradients, and buttons — only the
logos, ornaments, calligraphy mark, and small icons are cropped image assets.

## Route

Runs at **`/landing`** (e.g. `http://localhost:3000/landing`).

## Folder contents (fully self-contained)

```
src/app/landing/
├── page.tsx        # Next.js route (metadata + render)
├── Landing.tsx     # All markup (server component, no state)
├── landing.css     # All styles (scoped with .dhl- prefix)
├── components/
│   ├── ImageCarousel.tsx  # Winning-projects carousel (auto-rotate + drag), ported from the home page
│   └── FAQSection.tsx     # Expandable FAQ, ported from the home page
├── assets/         # Cropped image assets from the original artwork
│   ├── carousel/   # 01/02/03.png carousel slides
│   └── fonts/      # Somar Bold / Medium / Light (referenced via @font-face in landing.css)
└── README.md
```

The page is the complete landing experience: the pixel-perfect recreation of the artwork
(header → hero → prizes → conditions → journey), followed by the interactive second half
ported 1:1 from the original home page — the winning-projects carousel, the FAQ accordion,
and the footer image.

## How the pixel-perfect scaling works

- The design canvas is the original image's coordinate system: **3840 units wide**.
- `landing.css` defines `--u: calc(100cqw / 3840)` on a `container-type: inline-size` wrapper,
  so **1 unit = 1 original-image pixel**, at any viewport width.
- Every position/size/font-size is written as `calc(N * var(--u))` where `N` was measured
  directly from the image. The page therefore scales exactly like the image does.

## Moving it to another project

1. Copy the whole `src/app/landing/` folder into the target Next.js (App Router) project's `app/` dir.
2. That's it — fonts and images are imported relatively from inside the folder.
   - Requires a bundler that handles static image imports and CSS `url()` assets (Next.js does both out of the box).
3. If the target project's global CSS injects aggressive resets, the component already guards against
   the common ones (e.g. Tailwind preflight's `img { max-width: 100% }` is undone with `max-width: none`).
4. The "سجل الآن" button links to `/register-team` — change `REGISTER_URL` in `Landing.tsx` as needed.

## Notes

- The empty maroon area under "الوقت المتبقي على إغلاق التسجيل" mirrors the original image, which
  reserves that space for a live countdown overlay. Mount your countdown component there if needed
  (absolute position, `top: calc(1250 * var(--u))`, centered).
- The page is RTL (`dir="rtl"`) and uses the Somar font family bundled in `assets/fonts/`.
