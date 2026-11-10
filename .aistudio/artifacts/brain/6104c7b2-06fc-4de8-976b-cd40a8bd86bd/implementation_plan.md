# Comprehensive Dataset Cleaning Plan: Fix Numbering, Math Notation & KaTeX Duplicates

## Summary
Fix all dataset formatting glitches across **DU 25-26, DU 24-25, DU 23-24, and DU 22-23 MCQ** datasets, including double numbering prefixes (e.g. `16. 1.`), duplicated KaTeX/MathML HTML string artifacts (e.g. `A→\mathrm{\overrightarrow{A}}A`), corrupted escape sequences (e.g. `\v` vertical tab turning `\vec{A}` into `ec{A}`), and messy option strings.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions have been confirmed in Phase 1:

- **Math & Vector Symbol Cleaning**: Convert all raw vector notation, fractions, and symbols into pristine LaTeX (`$\vec{A}$`, `$\vec{B}$`, `$\frac{a}{b}$`, `$\left|\vec{A}\right| = \left|\vec{B}\right|$`), and strip duplicate concatenated text strings created by web scrapers.
- **Double Question Number Removal**: Strip leading numeric prefixes (`1.`, `2.`, `16. 1.`) from `q.question` and `q.question_text` so that views (`QuestionBankView` and `StrictExamView`) render the question index cleanly exactly once (e.g., `16. দুটি ভেক্টর...`).

---

## 1. Overview & Root Cause Analysis

### Identified Issues & Technical Root Causes:
1. **Double Numbering (`16. 1. দুটি ভেক্টর...`)**:
   - Both `QuestionBankView` and `StrictExamView` output `<span className="font-bold">{q.number}.</span>`.
   - In `q.question` and `q.question_text`, the text itself contained a leading `"1. "` or `"16. 1. "` from raw imports, leading to double numbers.
2. **Corrupted Vector/LaTeX Escapes (`ec{A}`, `\x0B` vertical tabs)**:
   - When building Node JS strings, `\v` in `"\vec{A}"` was interpreted as JavaScript vertical tab escape sequence (`\x0b`), stripping `\v` and producing `ec{A}`.
3. **KaTeX / MathML Text Duplication (`A→\mathrm{\overrightarrow{A}}A`, `∣A∣=∣B∣`)**:
   - Scraped HTML contained MathML annotations alongside fallback plain-text, which got concatenated together as a single string during JSON serialization.

---

## 2. Technical Solution & Pipeline Architecture

```text
┌────────────────────────────────────────────────────────┐
│ Input Datasets (DU 25-26, 24-25, 23-24, 22-23)          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Robust Cleaner Engine (scripts/fix_all_math_glitches.cjs)│
│ 1. Fix string escape bugs (replace \x0bec with \\vec)  │
│ 2. Convert duplicate KaTeX/MathML strings to           │
│    standard LaTeX mode: $\vec{A}$, $\vec{B}$, etc.     │
│ 3. Strip leading number prefixes from question text    │
│ 4. Re-format options & explanations into pristine math  │
│ 5. Save to Question/DU/ and public/assets/aistudio/   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ UI Verification & Rendering                            │
│ • QuestionBankView & StrictExamView render 16. cleanly │
│ • MathInlineRenderer renders crisp KaTeX vector math   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Specific File Fixes & Pipeline Script

1. **`scripts/fix_all_math_glitches.cjs`**:
   - Create a specialized sanitizer that processes `DU_25-26_MCQ.json`, `DU_24-25_MCQ.json`, `DU_23-24_MCQ.json`, and `DU_22-23_MCQ.json`.
   - Strip leading numbering regex `/^(\d+[\s.)।-]+)+/` from all question prompts.
   - Clean vector strings: `A→\mathrm{\overrightarrow{A}}A` $\to$ `$\vec{A}$`, `B→\mathrm{\overrightarrow{B}}B` $\to$ `$\vec{B}$`, `∣A→∣=...` $\to$ `$\left|\vec{A}\right| = \left|\vec{B}\right|$`.
   - Fix fractions and powers in chemistry and math questions.
   - Re-sync files to `public/assets/aistudio/`.

2. **`src/components/QuestionBankView.tsx` & `src/components/StrictExamView.tsx`**:
   - Ensure the regex stripping in `MathInlineRenderer` handles lingering number prefixes defensively so double numbering is impossible.

---

## 4. Verification & Testing Plan

1. Run `node scripts/fix_all_math_glitches.cjs`.
2. Inspect DU 23-24 Question 16 in Node to confirm:
   - Question text is: `"দুটি ভেক্টর $\vec{A}$ এবং $\vec{B}$-এর যোগফল তাদের পার্থক্যের ওপর লম্ব। নিচের কোন বিবৃতিটি অবশ্যই সত্য ?"`
   - Option A is: `"$\left|\vec{A}\right| = \left|\vec{B}\right|$"`
   - Explanation contains: `"$$\left|\vec{A} + \vec{B}\right|^2 = \left|\vec{A} - \vec{B}\right|^2 \implies |\vec{A}| = |\vec{B}|$$"`
3. Execute `compile_applet` and `lint_applet` to verify compilation.
