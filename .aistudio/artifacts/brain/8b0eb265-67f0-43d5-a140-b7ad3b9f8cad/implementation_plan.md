# Varsity Science Admission Portal — Persistent Theme, Multimodal AI Vision Tutor, Exam Settings Dropdown & Bryndan Write Font

This update persists the user's selected Theme Color (Dark or Light/White mode) in `localStorage` across sessions, upgrades **Ask AI Tutor** with multimodal Gemini Vision so it directly reads embedded question and option images and formats explanations in the 4-section Bengali structure, fixes the exam top bar so the Settings dropdown opens cleanly without clipping, and adds the **Bryndan Write** font style option.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both design decisions from Phase 1 have been confirmed and incorporated into this plan:

- **Confirmed Decision 1 (Multimodal Image Analysis in Ask AI Tutor)**: Send all embedded question images and option images to Gemini Vision (`gemini-3.8-flash`) so the AI Tutor inspects diagrams, circuits, chemical structures, and mathematical figures directly for the exact question clicked.
- **Confirmed Decision 2 (Bryndan Write Font Scope)**: Add `Bryndan Write` as the 4th option in `4. Font Style` (`Sans`, `Serif`, `Mono`, `Bryndan Write`) inside the Settings dropdown, applying it to question cards, option boxes, and explanations.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Persistent Theme Color (`localStorage`)**: Saves the user's chosen theme (`dark` or `light`) in `localStorage` (`varsity_qb_theme_mode`). When switched to Light (white) mode, reloading or reopening the app automatically restores Light mode.
  2. **Multimodal Ask AI Tutor with Embedded Image Vision & 4-Part Bangla Format**:
     - Passes the exact question text, option labels/texts, reference explanation, and all embedded `questionImageUrls` and `optionImageUrls` for the specific question where **Ask AI Tutor** was clicked.
     - Converts local `/images/...` and `/assets/...` files (or remote URLs) on the server into base64 `inlineData` multimodal image parts for Gemini Vision.
     - Formats every response with the top **Answer** box (`Answer [গ] ...`) followed by the 4 structured Bengali sections:
       - `১. 🎯 সঠিক উত্তর ও মূল যুক্তি:`
       - `২. 📐 ধাপে ধাপে সমাধান:`
       - `৩. ⚡ এডমিশন ৩০-সেকেন্ড শর্টকাট:`
       - `৪. ⚠️ পরীক্ষার সতর্কতা:`
  3. **Full Settings Dropdown in Exam Top Bar (`44:18 | Submit Exam | Settings`)**:
     - Removes `overflow-hidden` from the sticky exam header container so clicking the Settings button next to `44:18` and `Submit Exam` displays the complete popover menu (`1. Theme Color`, `2. Question Font Size (S/M/L/XL)`, `3. Option Box Font Size (S/M/L/XL)`, `4. Font Style (Sans / Serif / Mono / Bryndan Write)`).
  4. **Bryndan Write Font Style**:
     - Loads a clean handwritten/script font (`Bryndan Write` with Google Fonts `Caveat` / `Patrick Hand` fallback) and wires it into the `4. Font Style` selector in the Settings dropdown.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Theme Persistence**:
     - Opening Settings and clicking `Light` switches the interface to a crisp white background with dark text and saves `'light'` to `localStorage`. Next time the user visits or refreshes, the app starts in `Light` mode.
  2. **Exam Top Bar Settings Access**:
     - During a live exam (`StrictExamView`), clicking the **Settings** button beside the timer (`44:18`) and `Submit Exam` opens the full dropdown showing:
       - `1. Theme Color` (`Dark` | `Light`)
       - `2. Question Font Size` (`S` | `M` | `L` | `XL`)
       - `3. Option Box Font Size` (`S` | `M` | `L` | `XL`)
       - `4. Font Style` (`Sans` | `Serif` | `Mono` | `Bryndan Write`)
  3. **Ask AI Tutor with Image Vision**:
     - Clicking **Ask AI Tutor** on any question card sends that question's text, options, and any attached question/option images to `/api/gemini/explain-stream`.
     - The AI Tutor header displays `AI Tutor Admission Coach`, `Live`, and `{Subject} • {University} ({Session})`, followed by the `Answer [গ] ...` box and the 4-part Bengali explanation with KaTeX math rendering.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Local Image Resolution for Gemini Vision**
  - *Chosen Approach*: Since Chorcha exam images are stored locally under `/public/images/chorcha/...` and `/public/assets/imported/...`, the Express route `/api/gemini/explain-stream` reads local image files directly from disk via `fs/promises` (and fetches remote URLs if any) to construct `{ inlineData: { data, mimeType } }` parts for `@google/genai`.
  - *Why*: Avoids unnecessary network round-trips from the server to itself and works reliably in both dev and production environments.
- **Decision 2: Unclipped Sticky Exam Header**
  - *Chosen Approach*: Remove `overflow-hidden` from the outer sticky header in `StrictExamView` and apply rounded corners directly to the inner top and bottom bars.
  - *Why*: Allows the absolute-positioned `SettingsDropdown` menu to overflow downward over the question list without being cut off.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌───────────────────────────────────────────────────────────────────────────┐
│                         App & LocalStorage State                          │
│  • darkMode ('dark' | 'light' persisted in 'varsity_qb_theme_mode')       │
│  • uiSettings: { questionFontSize, optionFontSize, fontStyle }            │
│    - fontStyle: 'sans' | 'serif' | 'mono' | 'bryndan'                     │
└───────────────┬───────────────────────────────────────────┬───────────────┘
                │                                           │
                ▼                                           ▼
┌───────────────────────────────────────┐ ┌─────────────────────────────────┐
│    Navbar & StrictExamView Header     │ │         InlineAiTutor           │
│  • Unclipped SettingsDropdown Popover │ │  • Sends question, options,     │
│    1. Theme Color (Dark / Light)      │ │    correctAnswer, optionLabels, │
│    2. Question Font Size (S/M/L/XL)   │ │    questionImageUrls,           │
│    3. Option Box Font Size (S/M/L/XL) │ │    optionImageUrls              │
│    4. Font Style (Sans/Serif/Mono/    │ └─────────────────┬───────────────┘
│       Bryndan Write)                  │                   │ POST SSE
└───────────────────────────────────────┘                   ▼
                                          ┌─────────────────────────────────┐
                                          │  /api/gemini/explain-stream     │
                                          │  • Resolves local/remote images │
                                          │    to base64 inlineData parts   │
                                          │  • Calls gemini-3.8-flash with  │
                                          │    4-section Bengali prompt     │
                                          └─────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - **Theme State**: Initialized from `localStorage.getItem('varsity_qb_theme_mode')` (defaults to `'dark'` if unset, restores `'light'` when saved as Light).
  - **Font Style Selector**: Selecting `Bryndan Write` sets `uiSettings.fontStyle = 'bryndan'`, applying the `.font-bryndan` class to question cards, option boxes, and explanations.
  - **Multimodal AI Stream**: `InlineAiTutor` extracts `(question as ImportedQuestion).questionImageUrls` and `optionImageUrls`, passes them in the POST body to `/api/gemini/explain-stream`, and streams the 4-part Bengali explanation live.
