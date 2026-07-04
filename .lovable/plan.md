## Problem

After email confirmation, Supabase redirects back with the access token in the URL hash. The browser client actually does hydrate the session (default `detectSessionInUrl: true`), but nothing in the UI reflects that — the header always renders a static "Login" pill. So the user is signed in, but the app looks identical to signed-out, and clicking "Login" then bounces them around.

This is the "sign-in affordance must reflect session state" step that was never added when auth was ported.

## Plan

### 1. Add a shared auth hook

Create `src/hooks/useAuthUser.ts`:
- On mount, call `supabase.auth.getSession()` to seed state.
- Subscribe to `supabase.auth.onAuthStateChange` and update state on `SIGNED_IN`, `SIGNED_OUT`, `USER_UPDATED`, `INITIAL_SESSION`.
- Return `{ user, loading }`.

Single source of truth for header + mobile menu + any future gated UI.

### 2. Session-aware SiteHeader

In `src/components/SiteHeader.tsx`:
- Read `user` from `useAuthUser()`.
- Wrap the auth affordance in `<ClientOnly>` (already exists) to avoid SSR hydration mismatch — server renders nothing, client swaps in the correct state.
- When signed out: keep the existing "Login" pill.
- When signed in: replace it with a small account dropdown (hover, same styling as Resources/Programs) showing the user's email, with:
  - "My Account" → `/account` (placeholder route, see step 4)
  - "Sign out" → calls the sign-out helper below.

### 3. Session-aware MobileMenu

Mirror the same logic inside `src/components/MobileMenu.tsx`: show Login link when signed out, show email + Sign out button when signed in.

### 4. Sign-out helper + minimal /account route

- Add `src/lib/auth.ts` exporting `signOut()` that follows the sign-out hygiene rules: `queryClient.cancelQueries()` (no-op if no client yet — we don't have TanStack Query wired, so just `supabase.auth.signOut()` + `router.invalidate()` + navigate to `/`).
- Create `src/routes/account.tsx` as a minimal placeholder page ("Signed in as {email}", Sign out button). This gives the "My Account" link somewhere to go; we can expand later.

### 5. Confirm redirect handling still works

The confirmation link redirects to `window.location.origin` (set in `register.tsx`'s `emailRedirectTo`). With `detectSessionInUrl: true` (Supabase default) the client parses the hash and stores the session in `localStorage`. Our new hook + listener will pick it up on the very first render, so the header flips to signed-in immediately after landing on `/`.

No changes to `client.ts` (auto-generated), no schema changes, no server functions.

### Out of scope (call out to the user)

- Protected route gating (`_authenticated/` layout) — not needed for this fix.
- Full account/profile management UI — placeholder page only.
- Admin-only UI (that's a separate follow-up after we set `christophuhl07@gmail.com` as owner via the trigger, which already fires on confirmation).

## Files touched

- new `src/hooks/useAuthUser.ts`
- new `src/lib/auth.ts`
- new `src/routes/account.tsx`
- edit `src/components/SiteHeader.tsx`
- edit `src/components/MobileMenu.tsx`
