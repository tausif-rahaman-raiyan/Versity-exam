# Varsity QB — Pixel Font Controls, Default White Theme, GitHub Pages Auto-Deploy & Fast Split-Wise AI Tutor

This update rebrands the header to **Varsity QB** with a **Question Bank** primary navigation button, replaces the `S/M/L/XL` font buttons with `-` / `+` pixel steppers (`px`), sets the first-time default theme to **White (Light Mode)** while remembering subsequent changes in `localStorage`, fixes the GitHub Pages `404 /src/main.tsx` issue with relative Vite paths and an automated GitHub Actions deployment workflow, upgrades **Ask AI Tutor** with fast split-wise section streaming, and updates the footer to `developed by Tausif Rahaman Raiyan` with interactive hover effects on the Instagram and GitHub buttons.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both design decisions from Phase 1 have been confirmed and incorporated into this plan:

- **Confirmed Decision 1 (GitHub Pages 404 Fix)**: Configure `base: './'` in `vite.config.ts`, resolve local image assets relative to `import.meta.env.BASE_URL`, add `.github/workflows/deploy.yml` to automatically build `dist/` and publish to GitHub Pages on push, and include seamless static-host fallback in `InlineAiTutor` so AI explanations work on `github.io` as well as full-stack servers.
- **Confirmed Decision 2 (Pixel Font Size Controls)**: Replace `S/M/L/XL` buttons with `-` and `+` buttons displaying exact pixel values (`16px` default for Question Font Size, `14px` default for Option Box Font Size, adjustable in `1px` steps between `12px` and `26px`).

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Header & Navigation Updates**:
     - Changes the brand title from `Varsity Science QB` to **`Varsity QB`** with subtitle `DU • RU • JU • CU • GST`.
     - Renames the `Universities` navigation button to **`Question Bank`**.
  2. **Footer Attribution & Hover Micro-Interactions**:
     - Changes `Made with Tausif Rahaman Raiyan` to **`developed by Tausif Rahaman Raiyan`**.
     - Enhances the **Instagram** and **GitHub** icon links with smooth scale, elevation, and color-fill hover animations.
  3. **Pixel (`px`) Font Size Controls with `-` / `+` Buttons**:
     - In the Settings dropdown, both **2. Question Font Size** (default `16px`) and **3. Option Box Font Size** (default `14px`) display their live `px` value between `-` and `+` buttons (`1px` step, `12px`–`26px` range).
  4. **Default White (Light) Theme on First Visit**:
     - First-time visitors start in **White / Light Mode** (`darkMode = false`) until they toggle the theme in Settings, which is then persisted in `localStorage` (`varsity_qb_theme_v2`).
  5. **GitHub Pages Build & 404 Resolution**:
     - Sets `base: './'` in `vite.config.ts` and adds `.github/workflows/deploy.yml` so pushing to GitHub automatically compiles TypeScript/React into production bundles instead of serving raw `/src/main.tsx`.
  6. **Fast Split-Wise Streaming in Ask AI Tutor**:
     - Uses `gemini-3.8-flash` with `ThinkingLevel.LOW` for sub-second time-to-first-token and renders the 4 Bengali sections (`১. 🎯 সঠিক উত্তর ও মূল যুক্তি`, `২. 📐 ধাপে ধাপে সমাধান`, `৩. ⚡ এডমিশন ৩০-সেকেন্ড শর্টকাট`, `৪. ⚠️ পরীক্ষার সতর্কতা`) progressively in distinct split-wise visual cards as chunks stream in.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Adjusting Font Size in Pixels**:
     - User opens **Settings** in the Navbar or Exam Bar and clicks `-` or `+` next to `16px` (Question Font Size) or `14px` (Option Box Font Size). The question text and option boxes immediately resize to the exact pixel value.
  2. **First-Time White Theme Experience**:
     - Opening the app for the first time loads the clean white canvas with pastel-tinted subject and session cards. Switching to `Dark` in Settings saves the preference to `localStorage` for future visits.
  3. **Fast Split-Wise AI Tutor**:
     - Clicking **Ask AI Tutor** immediately displays the top **Answer** box (`Answer [গ] ...`) and streams each of the 4 explanation sections into clean, separated blocks as soon as tokens arrive.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: GitHub Pages Static + Full-Stack Compatibility**
  - *Chosen Approach*: Configure `base: './'` in Vite, add `.github/workflows/deploy.yml` for automated GitHub Pages deployment from `dist/`, and allow `InlineAiTutor` to fall back to direct streaming if `/api/gemini/explain-stream` is unavailable on a static GitHub Pages host.
  - *Why*: Eliminates the `GET /src/main.tsx 404` error on GitHub Pages and ensures every feature (including image loading and AI Tutor) works on `tausif-rahaman-raiyan.github.io`.
- **Decision 2: Split-Wise Section Rendering for Perceived Speed**
  - *Chosen Approach*: Parse the incoming stream by the 4 numbered Bengali section markers (`১.`, `২.`, `৩.`, `৪.`) so each completed or active section renders in its own structured sub-card immediately without waiting for the entire response to finish.
  - *Why*: Delivers instant readability within `<1s` of clicking **Ask AI Tutor**.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌───────────────────────────────────────────────────────────────────────────┐
│                         App & LocalStorage State                          │
│  • darkMode (Default: false [White/Light], saved in 'varsity_qb_theme_v2')│
│  • uiSettings: { questionFontPx: 16, optionFontPx: 14, fontStyle }        │
└───────────────┬───────────────────────────────────────────┬───────────────┘
                │                                           │
                ▼                                           ▼
┌───────────────────────────────────────┐ ┌─────────────────────────────────┐
│     Navbar ("Varsity QB") & Exam      │ │    InlineAiTutor (Split-Wise)   │
│  • Nav: [Question Bank] [Analytics]   │ │  • Top Answer Box               │
│  • SettingsDropdown:                  │ │  • Progressive 4-Card Split     │
│    1. Theme (White/Light | Dark)      │ │    Stream (gemini-3.8-flash,    │
│    2. Question Font: [-] 16px [+]     │ │    ThinkingLevel.LOW + Vision)  │
│    3. Option Font:   [-] 14px [+]     │ └─────────────────────────────────┘
│    4. Font Style (Sans/Serif/Mono/    │
│       Bryndan Write)                  │ ┌─────────────────────────────────┐
└───────────────────────────────────────┘ │   GitHub Pages Build Pipeline   │
                                          │  • vite.config.ts (base: './')  │
                                          │  • .github/workflows/deploy.yml │
                                          └─────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - **Pixel Steppers**: Clicking `-` decrements by `1px` (min `12px`); clicking `+` increments by `1px` (max `26px`), applying `style={{ fontSize: `${px}px` }}` to question stems and option boxes.
  - **Split-Wise Stream Parser**: Splits streamed markdown into sections (`১. 🎯`, `২. 📐`, `৩. ⚡`, `৪. ⚠️`) and renders each section progressively with KaTeX math support.
