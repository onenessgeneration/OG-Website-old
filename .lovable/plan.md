## Port Home page to match old site exactly

Rewrite `src/routes/index.tsx` with the old Home layout (Banner → Vision → VisionImages → UpcomingEventCard → NewTestimonials), using the legacy palette utilities (`bg-tan`, `text-brown`, `bg-darkGreyBrown`, `text-tanAccent`) already exposed in `src/styles.css`.

### Sections

1. **Banner** (`src/components/home/Banner.tsx`)
   - Full-width hero, `h-[calc(100dvh-84px)]` on md+, `h-[200px]` on mobile.
   - Poster image fallback (the old code fetches a `bannerVideoURL` from a Render API that no longer exists). Keep the "What is Oneness Generation?" heading and the rounded outline **Play** button with `GoPlay` icon.
   - Click Play swaps to a `<video>` with controls + close button (matches old behavior). Video source: none by default; if user later drops a file in `src/assets/Home/`, we wire it in. For now Play is disabled with a subtle tooltip, OR plays a silent placeholder — I'll leave the button visible and non-functional until a video asset is provided.

2. **Vision** (`src/components/home/Vision.tsx`)
   - `bg-[#605f4b]` (darkGreyBrown) panel, `md:h-[70vh]`. Left: white heading + 3 paragraphs. Right: `vision.jpg` rounded image with the curved dashed arrow SVG absolutely positioned bottom-left, rotated -20deg.
   - Uses `src/assets/Home/Vision/vision.jpg` and `src/assets/Curvedarrowwithbrokenline.svg` (both present).

3. **VisionImages** (`src/components/home/VisionImages.tsx`)
   - Two-column asymmetric image mosaic. Old code pulls 6 random URLs from API; fallback uses the 4 available assets (`vision.jpg`, `visionimage.jpg`, `IMG_2950.jpg`, `DSC05413.jpg`) plus 2 from `src/assets/Gallery/` (whichever exist) to reach 6.

4. **UpcomingEventCard** (`src/components/home/UpcomingEventCard.tsx`)
   - Section header "What's new?" in `text-darkGreyBrown`.
   - Desktop: full-width background `DSC05413.jpg`, right-side card `bg-gradient-to-t from-[#f5cf9d] to-tan` with asymmetric `rounded-tl-[80px] rounded-br-[80px]` and disabled "Become an OG Trainer" pill.
   - Mobile: stacked variant (gradient card above, full-width image below) — same markup as legacy.

5. **NewTestimonials** (`src/components/home/NewTestimonials.tsx`)
   - Left column: `Testimonials` pill (`bg-tan text-tanAccent border-tanAccent`), heading "What Our Awesome Participants Say", prev/next arrow buttons.
   - Right: slick-style slider showing 2 cards on desktop, 1 on mobile, with the round avatar overlapping the card's left edge and Read More toggles.
   - **Dependency**: install `react-slick`, `slick-carousel`, `react-icons` (react-icons already installed). Import slick CSS in `src/styles.css`.
   - Data: hardcoded array of 4 sample testimonials (the ones currently in `index.tsx`) until Supabase-backed testimonials are wired up. Each card has `participant`, `location`, `tag`, `actualTestimonial`, `quotes`, `testimonialImageURL` (placeholder avatar via `ImagePlaceholder`).

### Wiring

- `src/routes/index.tsx` becomes a thin composition: `<Banner /> <Vision /> <VisionImages /> <UpcomingEventCard /> <NewTestimonials />` with `head()` metadata unchanged.
- Icons: `react-icons/go` (`GoPlay`, `GoArrowLeft`, `GoArrowRight`).
- No `react-reveal` / `useCursor` / `react-intersection-observer` — those are legacy niceties; we drop them (simpler, no runtime cost). Layout/styling stays identical.
- No backend calls in this pass. When Supabase data is later added for banners/vision/testimonials, only the data source changes.

### Out of scope

- Supabase-backed content for banner video, vision images, and testimonials (tracked separately).
- Cursor hover effects and Fade-in animations from the old `useCursor` / `react-reveal`.

### Files touched

- create `src/components/home/Banner.tsx`
- create `src/components/home/Vision.tsx`
- create `src/components/home/VisionImages.tsx`
- create `src/components/home/UpcomingEventCard.tsx`
- create `src/components/home/NewTestimonials.tsx`
- edit `src/routes/index.tsx` (compose the five sections)
- edit `src/styles.css` (add slick CSS imports at top)
- edit `package.json` / `bun.lock` via `bun add react-slick slick-carousel @types/react-slick`
- update `mem://port-progress`
