# Comprehensive DU Question Mapping & Exam Portal Plan

Mapping and loading all question JSON files directly from the `/Question/DU/` and `/public/assets/aistudio/` directories into the app's dataset loader, hiding the top navigation bar when entering Strict Exam mode, rendering Written questions as clean cards without MCQ option buttons, placing the `All` | `MCQ` | `Written` filter buttons directly under the university selection header, and synchronizing all DU sessions (45 minutes, 90 questions, 60 marks).

## User Review & Critical Decisions

- **Full DU Question Directory Integration**: Automatically load and map every single question JSON file located in `/Question/DU/` (from DU 00-01 up to DU 25-26 MCQ and Written) into `sessionQuestionLoader.ts` and `questionBank.ts`.
- **Hide Top Navigation Bar in Exam Mode**: When `currentView === 'exam'`, the entire `<Navbar>` is hidden for a full-screen, distractor-free auto-lock exam session.
- **Written Question Card Display**: For Written exams (`questionType === 'Written'`), do NOT render MCQ option buttons (A/B/C/D) or force option locking. Show formatted question cards with KaTeX formulas, localized image attachments, and expandable written solution toggles.
- **DU Session Metadata Parity**: Update DU sessions in `questionBank.ts` to 45 minutes duration, 90 MCQ questions, and 60 total marks for MCQ exams, matching official Chorcha DU A Unit standards.
- **UI Filter Positioning**: Place the `All`, `MCQ`, `Written` segmented filter buttons directly below the heading `"বিশ্ববিদ্যালয় নির্বাচন করুন (Select University) প্রতিটি বিশ্ববিদ্যালয়ের গত ১০ বছরের পৃথক প্রশ্ন ব্যাংক এবং রিয়েল এক্সাম পোর্টাল।"` in `HomeView.tsx`.
- **Clean UI (No Import JSON UI)**: Remove all "Import JSON" buttons and modal popups.

---

## 1. Overview & Core Concept

- **Directory-Based Question Loader**: Dynamically loads JSON files from `/Question/DU/` for all DU sessions (DU 25-26 MCQ, DU 25-26 Written, DU 24-25, DU 23-24, down to DU 00-01).
- **Distraction-Free Exam View**: Hides the navbar completely during exams.
- **Written Exam Card Support**: Renders written questions with solution boxes instead of MCQ buttons.

---

## 2. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Question Data Layer                              │
│                                                                             │
│   /Question/DU/ & /public/assets/aistudio/                                  │
│   ├── DU_25-26_MCQ.json, DU_25-26_Written.json                              │
│   ├── DU_24-25_MCQ.json, DU_24-25_Written.json                              │
│   ├── ... (All DU 00-01 to 25-26 files)                                     │
│   └── src/data/sessionQuestionLoader.ts & questionBank.ts                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│             HomeView.tsx             ││          StrictExamView.tsx          │
│                                      ││                                      │
│ - Sub-header description             ││ - Full-screen layout (Navbar hidden) │
│ - [All] [MCQ] [Written] filter row   ││ - MCQ: 4-option auto-lock buttons    │
│ - University Selector Cards          ││ - Written: Question card without     │
│ - DU Sessions (45 min, 90 Qs)        ││   MCQ option buttons                 │
└──────────────────────────────────────┘└──────────────────────────────────────┘
```

---

## Step-by-Step Implementation Steps

1. **Update `App.tsx`**:
   - Wrap `<Navbar>` in `{currentView !== 'exam' && <Navbar ... />}` to hide the top bar in exam mode.
   - Remove `JsonImportModal` and import buttons.

2. **Update `sessionQuestionLoader.ts` & `questionBank.ts`**:
   - Map all JSON files from `/Question/DU/` and `/public/assets/aistudio/` for every DU session (DU 00-01 to DU 25-26 MCQ & Written).
   - Sync all DU MCQ sessions to 45 minutes duration, 90 questions, and 60 marks.
   - Add localized image link replacements `/assets/imported/` for all Chorcha image URLs.

3. **Update `HomeView.tsx`**:
   - Position `All`, `MCQ`, `Written` filter buttons directly under the university header description.
   - Remove "Import JSON" buttons.

4. **Update `StrictExamView.tsx`**:
   - Check for Written questions (`q.questionType === 'Written'`) and hide MCQ option selection buttons.
   - Display written solution toggle and written completion flow.
