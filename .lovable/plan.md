You're right — I skipped the desktop "collapse" behavior. The original `SoulSync.jsx` renders **two** versions of the six pillar cards:

1. `hidden xl:grid` — one card per viewport height, each `sticky top-0` with `top: calc(10vh + index*25px)` and a per-card `useTransform` scale of `1 → 1 - (data.length - index) * 0.05`. As you scroll, each card sticks and the previous ones shrink underneath it, producing the stacked "collapse" effect. The image inside also has its own `useTransform` scale (2 → 1) driven by the outer container's `scrollYProgress`.
2. `grid md:grid-cols-2 xl:hidden` — the plain 2-column grid used on tablet/mobile.

My current `src/routes/soul-sync.tsx` only ships variant 2, which is why the page doesn't collapse on desktop.

### Changes to `src/routes/soul-sync.tsx`

- In `SoulSyncVideoAndCards`, keep the sticky video `motion.div` (Section1) and add the desktop sticky-stacking cards (Section2 xl variant) alongside the existing mobile grid. Reuse the outer `container` ref's `scrollYProgress` so the video scale/rotate and the card image scale share the same scroll driver, matching the original.
- Per-card sticky wrapper: `sticky top-0`, inline `top: calc(10vh + ${i*25}px)`, inline `backgroundColor: item.color`, `motion.div` with `style={{ scale: scales[i] }}`.
- Precompute the six `useTransform` calls at the top of the component (fixed-length loop, hook-rules safe) — one per pillar, range `[i*0.25, 1] → [1, 1 - (6 - i) * 0.05]`.
- Add `imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])` and apply it to the image `motion.div` inside each xl card.
- Card inner layout mirrors the original: `md:flex md:h-[500px] lg:w-[1000px] rounded-3xl md:p-12`, left column text, right column image with `rounded-3xl overflow-hidden`.
- Use `ImagePlaceholder` (assets folder is empty in the reference too) sized to fill the right column.
- Keep the existing `md:grid-cols-2 xl:hidden` grid unchanged.

### Fix SSR runtime error

`Section()` currently passes `label={undefined}` to `ImagePlaceholder`, which likely triggers the "Element type is invalid" render error on the server. Remove the prop (its default is `"Image"`) or pass an empty string label — I'll drop the prop so the placeholder just uses its default.

### Out of scope

- Wiring real Soul Sync video / pillar imagery (assets aren't available; placeholders stay).
- Any other route.

### Files touched

- edit `src/routes/soul-sync.tsx`
