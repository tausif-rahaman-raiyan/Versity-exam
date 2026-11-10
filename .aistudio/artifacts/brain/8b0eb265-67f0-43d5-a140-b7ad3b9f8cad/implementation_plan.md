# Dedicated Explanation Font Size Scaling & Vibrant Emerald Answer Styling

Enable fine-grained typographical control by adding a dedicated Explanation Font Size control with +/- pixel buttons in Settings, ensuring the explanation header ("সঠিক উত্তর ও মূল ব্যাখ্যা:"), KaTeX mathematical formulas, tables, and step-by-step solutions dynamically resize, and styling the final "উত্তর" (Answer) line with a vibrant emerald-green gradient card, glowing border, and bold highlight.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed in Phase 1:
> - **Explanation Scaling**: Added a dedicated "Explanation Font Size" control in the Settings dropdown (12px to 26px with 1px +/- buttons, default 14px) so students can independently scale explanation text, headers, and formulas alongside Question and Option font sizes.
> - **Answer Line Visual Style**: The final "উত্তর" / "Answer" summary line will be rendered as a vibrant emerald-green highlight card with a glowing border, emerald badge, and high-contrast bold colored text.

- **Confirmed Decision 1**: Add `explanationFontPx` to `UiSettings` (default 14px, range 12px–26px) with +/- pixel adjustment buttons in `SettingsDropdown.tsx`.
- **Confirmed Decision 2**: In `QuestionBankView.tsx` and `StrictExamView.tsx`, apply dynamic pixel font sizing to the explanation container, header ("সঠিক উত্তর ও মূল ব্যাখ্যা:"), and all inner formula blocks.
- **Confirmed Decision 3**: In `MathMarkdownRenderer.tsx`, detect the concluding "উত্তর:" / "**উত্তর:**" line and render it as a distinct emerald-accented callout with glowing border and rich contrast.

---

## 1. Overview & Core Concept

- **What It Delivers**:
  1. A dedicated **4. Explanation Font Size** control with +/- buttons and live pixel readouts inside the Settings menu, directly beside Question Font Size and Option Font Size.
  2. Dynamic font scaling across the entire solution card: the section header **সঠিক উত্তর ও মূল ব্যাখ্যা:**, KaTeX inline and display formulas ($...$ and $$...$$), Markdown comparison tables, and step-by-step derivation text.
  3. A high-visibility, colorful answer conclusion block for the final **উত্তর** line, making key results immediately recognizable to admission candidates.
- **Target Audience**: HSC Science and Varsity Admission aspirants (DU, RU, JU, CU, GST) reading on phones, tablets, and laptops in both Light and Dark themes.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Font Customization**:
   - The user opens Settings from the top bar.
   - They see:
     1. Theme Color (Light / Dark)
     2. Question Font Size (px with - / +)
     3. Option Box Font Size (px with - / +)
     4. **Explanation Font Size** (px with - / +)
   - Clicking `+` or `-` adjusts `explanationFontPx` by 1px increments (12px to 26px).
   - In both Question Bank mode and Exam Review mode, the explanation header, text, KaTeX formulas, and matrices scale in real time.
2. **Visual Hierarchy & Colorful Answer Card**:
   - The explanation section opens with a cleanly scaled header **সঠিক উত্তর ও মূল ব্যাখ্যা:**.
   - The concluding line starting with `**উত্তর:**` or `উত্তর:` transitions from plain text into an eye-catching emerald card:
     - **Light Mode**: Rich emerald-50 gradient background, emerald-500/60 border, glowing emerald shadow-sm, with an uppercase "উত্তর" badge and dark emerald-950 bold text.
     - **Dark Mode**: Deep `#06281E` / emerald-950/70 background, emerald-400/50 luminous border, and crisp emerald-200 math/text rendering.

---

## 3. Key Technical Decisions & Architecture

```
┌────────────────────────────────────────────────────────┐
│                   SettingsDropdown                     │
│  - 1. Theme Color (Light/Dark)                         │
│  - 2. Question Font Size (px +/-)                      │
│  - 3. Option Box Font Size (px +/-)                    │
│  - 4. Explanation Font Size (px +/-) [NEW]             │
└──────────────────────────┬─────────────────────────────┘
                           │ updates UiSettings state
                           ▼
┌────────────────────────────────────────────────────────┐
│             UiSettings (localStorage v2)               │
│  { questionFontPx, optionFontPx, explanationFontPx }   │
└────────────┬─────────────────────────────┬─────────────┘
             │                             │
             ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     QuestionBankView      │ │      StrictExamView       │
│  - Question text: Q px    │ │  - Question text: Q px    │
│  - Options: Opt px        │ │  - Options: Opt px        │
│  - Explanation: Exp px    │ │  - Explanation: Exp px    │
└────────────┬──────────────┘ └────────────┬──────────────┘
             │                             │
             └──────────────┬──────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               MathMarkdownRenderer                     │
│  - Inherits dynamic explanation font size (in px)      │
│  - Scales KaTeX math & display blocks proportionally   │
│  - Detects '**উত্তর:**' line:                          │
│    -> renders Colorful Emerald Highlight Card          │
└────────────────────────────────────────────────────────┘
```

1. **State Persistence (`src/utils/uiSettings.ts`)**:
   - Extend `UiSettings` interface with `explanationFontPx: number`.
   - Update `DEFAULT_UI_SETTINGS` with `explanationFontPx: 14`.
   - Update `loadUiSettings()` and `saveUiSettings()` with backward-compatible defaults.
2. **Settings Dropdown (`src/components/SettingsDropdown.tsx`)**:
   - Add the **4. Explanation Font Size** control with minus/plus buttons, disabled states at bounds (12px–26px), and live pixel indicator.
3. **Question Views (`QuestionBankView.tsx` & `StrictExamView.tsx`)**:
   - Pass `explanationFontPx` to the explanation wrapper and header `সঠিক উত্তর ও মূল ব্যাখ্যা:`.
4. **Renderer Enhancement (`src/components/MathMarkdownRenderer.tsx`)**:
   - Add answer line detection for lines beginning with `**উত্তর:**`, `**উত্তর**:`, `উত্তর:`, or `**Answer:**`.
   - Wrap the detected answer in an emerald-themed callout card with an accent icon/badge and vibrant contrast.

---

## 4. Verification Plan

1. **Compilation & Linting**: Co-execute `compile_applet` and `lint_applet` to confirm zero TypeScript errors.
2. **Font Size Adjustment Test**:
   - Test decreasing and increasing explanation font size from 12px to 26px in the settings dropdown.
   - Verify that header `সঠিক উত্তর ও মূল ব্যাখ্যা:`, paragraphs, and mathematical equations scale smoothly.
3. **Emerald Answer Highlight Test**:
   - Verify that written questions (e.g. DU 25-26, DU 24-25, DU 23-24, DU 22-23, DU 21-22, DU 20-21, DU 19-20 Written) and MCQ explanations display the final `**উত্তর:**` in the vibrant emerald card in both Light and Dark themes.
4. **Build Bundle**: Run `npm run build` to update `dist-bundle/` for GitHub Pages.
