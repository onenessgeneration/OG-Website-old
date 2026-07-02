## Goal

Bring the current TanStack Start site to visual parity with the old Vite/React Router site by copying styling directly from the old source you'll re-upload. Existing routes stay in place as fallback wherever the old source is silent (removed asset folders, missing pages, etc.).

## Prerequisite (blocks step 1)

Re-attach `OG_Website_copy.zip` in your next message. The previous upload is no longer in the sandbox. Once attached, I extract it to `/tmp/og-ref/` (excluding `.git`) and work entirely from there — nothing from the old repo gets copied wholesale into this project.

## Approach

The old site is Vite + React + Tailwind (v3-style config + plain CSS/JSX). The current site is TanStack Start + Tailwind v4 (CSS-first tokens in `src/styles.css`). I port **styling, markup, and component structure**, not the framework wiring. Rules:

- Keep TanStack routing (`createFileRoute`), keep `<Link to="…">` from `@tanstack/react-router`, keep Supabase auth wiring.
- Replace `react-router-dom`'s `<Link to>` / `useNavigate` with TanStack equivalents.
- Rewrite `tailwind.config.js` colors/fonts/keyframes into `@theme` + `@utility` blocks in `src/styles.css` (Tailwind v4 CSS-first).
- Copy plain `.css` files as-is under `src/styles/` and `@import` them from `src/styles.css`.
- Preserve exact class strings, spacing, breakpoints, animations, and image placements from the old JSX.
- Asset paths: the assets already live under `src/assets/…` in this project; rewrite old `/src/assets/...` imports to the matching current path. Missing assets (Home/Vision, Calm, programs, soulsync — the folders you removed) fall back to whatever the current route already uses.

## Steps

1. **Extract & inventory** — unzip to `/tmp/og-ref/`, list every page component in `oneness-frontend/src/pages` (or equivalent), diff against current `src/routes/*.tsx`, and note any old shared components (Header, Footer, Hero, Cards, etc.) worth porting verbatim.

2. **Global styles & tokens** — port the old `tailwind.config.js` theme (colors, fonts, container, keyframes) and any global CSS files into `src/styles.css` using Tailwind v4 syntax. Load the old fonts via `<link>` in `src/routes/__root.tsx` (never `@import` a URL).

3. **Shared chrome** — rewrite `SiteHeader.tsx` and `SiteFooter.tsx` to match the old `Navbar`/`Footer` markup and styling (nav layout, logo placement, mobile menu, footer columns). Swap router imports to TanStack.

4. **Home page** (`src/routes/index.tsx`) — replace body with the old Home page JSX/sections. Keep the current `head()` block.

5. **Content routes** — page by page, for each of: `about-us`, `programs`, `oneness-yoga`, `serene-mind`, `soul-sync`, `sfz`, `summer-camp`, `gallery`, `blog`, `get-involved`, `contact-us`, `wallpapers`, `login`, `register`. For each route:
   - Copy the old page's JSX + subcomponents into the route file (or a colocated component if long).
   - Rewrite imports (router, assets).
   - Keep existing `createFileRoute` + `head()` metadata (adjust title only if the old page had a clearer one).
   - Where the old source references a removed asset folder, keep the current route's fallback image/section.

6. **Auth/data touch-ups** — `login.tsx` and `register.tsx` keep the current Supabase form logic; only the presentation wrapper (layout, inputs, buttons) copies the old styling.

7. **QA pass** — run typecheck/build; walk each route in the preview at desktop + mobile widths, comparing to the old screenshots in `Screenshots/` (and to the live old site if you can share a URL). File any visual gaps as follow-ups rather than re-planning.

## Technical notes

- Tailwind v4: no `tailwind.config.js`. All tokens go under `@theme` in `src/styles.css`; custom utilities via `@utility`; class-based dark via `@custom-variant`. shadcn tokens use `@theme inline` (already set up).
- Fonts: install with `bun add @fontsource/<name>` and import in the root, or `<link>` in `__root.tsx` head. Do not `@import` Google Fonts URLs in CSS.
- Router swap cheatsheet: `import { Link, useNavigate } from "react-router-dom"` → `from "@tanstack/react-router"`; `<Link to="/x">` unchanged; `useNavigate()(path)` unchanged; `<NavLink>` → `<Link activeProps={{ className: "…" }}>`.
- Do not touch `src/routeTree.gen.ts`, `src/integrations/supabase/*` auto-generated files, `.env`, `supabase/config.toml`, or `vite.config.ts`.
- No new npm deps expected beyond fontsource packages the old site used. I'll list them before installing.

## Out of scope

- No backend/schema changes.
- No new features or copy edits — pure visual/structural port.
- No animation library swap; if the old site used Framer Motion / GSAP and it's already installed, reuse it, otherwise translate to CSS.

## What I need from you

- Re-upload `OG_Website_copy.zip` (or the `oneness-frontend/` folder alone if smaller).
- Optional: a live URL of the old deployed site — makes visual QA much faster than diffing screenshots.
