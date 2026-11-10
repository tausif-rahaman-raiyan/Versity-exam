# Varsity QB — Direct `main` Branch `/ (root)` GitHub Pages Support

This update enables the application to run directly when GitHub Pages is configured to publish from **`Branch: main` and folder `/ (root)`**, eliminating the blank white screen and `/src/main.tsx` browser failure without requiring manual GitHub Actions settings changes.

## User Review & Critical Decisions

> [!IMPORTANT]
> Confirmed choice from Phase 1:

- **Confirmed Decision (Direct `main` `/ (root)` Support)**: Include a pre-built production bundle (`./dist-bundle/app.js` and `./dist-bundle/app.css`) and `.nojekyll` in the repository root, alongside a smart loader in `index.html` and public path resolver in `sessionQuestionLoader.ts` so the site works identically in both AI Studio's live Vite dev server and GitHub Pages `main` `/ (root)`.

---

## 1. Overview & Core Concept

- **Why `main` `/ (root)` Showed a Blank Page**:
  1. When GitHub Pages publishes directly from `main` `/ (root)`, it serves the raw repository root without running `vite build`.
  2. Browsers cannot natively execute TypeScript/JSX (`./src/main.tsx`), resulting in a blank screen.
  3. Additionally, static files inside `/public/...` (such as `/public/assets/aistudio/...` and `/public/images/chorcha/...`) are located at `./public/assets/...` when the raw repository root is served directly by GitHub Pages.
- **What This Fix Delivers**:
  1. **Root `.nojekyll` File**: Prevents GitHub Pages' Jekyll processor from ignoring folders or mangling static files on the `main` branch.
  2. **Pre-Built Root Bundle (`dist-bundle/`)**: Compiles the complete React + Tailwind application into predictable root files (`./dist-bundle/app.js` and `./dist-bundle/app.css`) committed directly in the repo root.
  3. **Smart Dual-Mode `index.html`**:
     - On `github.io` (or any static host serving the raw root branch), `index.html` automatically loads `./dist-bundle/app.css` and `./dist-bundle/app.js`.
     - In local/AI Studio Vite development, it loads `./src/main.tsx` as usual.
  4. **Dual-Path Asset & JSON Resolution**:
     - Updates `resolvePublicUrl` in `sessionQuestionLoader.ts` so if fetching `./assets/aistudio/...` returns `404` on raw `main` `/ (root)` hosting, it automatically fetches `./public/assets/aistudio/...` (and rewrites image URLs to `./public/images/chorcha/...` when hosted from the raw repo root).

---

## 2. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Dual-Mode Loading Diagram**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                             /index.html                                 │
│  • Detects hostname / environment:                                      │
│    ├─ AI Studio / Vite Dev Server ──► Loads ./src/main.tsx              │
│    └─ GitHub Pages (main / root)  ──► Loads ./dist-bundle/app.js + .css │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      sessionQuestionLoader.ts                           │
│  • Fetches ./assets/aistudio/<session>.json                             │
│  • If raw main /(root) returns 404 ──► Fetches ./public/assets/...      │
│  • Rewrites image URLs to ./public/images/chorcha/... on raw root host  │
└─────────────────────────────────────────────────────────────────────────┘
```
