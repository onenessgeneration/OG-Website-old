// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deployment target is controlled by DEPLOY_TARGET env var so the Lovable
// editor keeps its default Cloudflare build while Vercel deploys override it.
// Set DEPLOY_TARGET=vercel in Vercel's Environment Variables (all envs).
const deployTarget = process.env.DEPLOY_TARGET;

export default defineConfig(
  deployTarget === "vercel"
    ? { nitro: { preset: "vercel" } }
    : deployTarget === "node"
    ? { nitro: { preset: "node-server" } }
    : {},
);
