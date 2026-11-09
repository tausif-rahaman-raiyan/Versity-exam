# University & Year-Scoped "See Question" & JSON Architecture

Replace the "Question Bank" button on session cards with "See question", scope the view strictly to that specific university and year with top subject filter tabs (Physics, Chemistry, Math, Biology, ICT), ensure "Start Exam" runs that exact session, and structure question banks into university & year-wise JSON files for easy future additions.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed choices:
> - **Card Action Update**: The primary buttons on each session card (e.g. `DU • 25-26`) will be **"See question"** and **"Start Exam"**.
> - **Strict Year & University Scoping**: Clicking "See question" on `DU • 25-26` opens a dedicated view showing **only DU 2025-26 questions**, with a session badge and subject filter tabs at the top (`ALL`, `Physics`, `Chemistry`, `Mathematics`, `Biology`, `ICT`).
> - **University & Year-Wise JSON Structure**: Questions will be organized in modular JSON files per university and year (e.g. `src/data/json/du_25_26.json`, `src/data/json/du_24_25.json`, etc.) with a clear schema so you can easily paste or add all university exams in JSON format later.
> - **Strict Exam Pairing**: Clicking "Start Exam" launches the strict auto-lock exam with the exact questions loaded for that university and session.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. *Direct Targeted Studying*: Instead of dropping into a generic question bank with all universities mixed together, clicking **"See question"** takes the student directly to that exact university and year exam paper.
  2. *Subject Navigation Tabs*: Subject filter tabs (`ALL`, `Physics`, `Chemistry`, `Mathematics`, `Biology`) allow rapid switching between sections of that paper.
  3. *Modular JSON Engine*: Each exam paper has its own standalone JSON dataset, making it trivial for you or any contributor to drop in new years or universities simply by creating/editing JSON files.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **From Home Session Cards**:
   - The student sees the session card:
     ```
     DU • 25-26  [MCQ]
     DU Science Unit Admission Test (2025-26)
     ঢাকা বিশ্ববিদ্যালয় বিজ্ঞান ইউনিট ২০২৫-২৬ সেশনের প্রশ্ন ব্যাংক।
     [সময়: ৯০ মিনিট] [প্রশ্ন: ১০০ টি] [মার্কস: ১০০]
     [See question]  [Start Exam]
     ```
   - Clicking **"See question"**:
     - Navigates immediately to the targeted question paper view for DU 2025-26.
     - Displays top banner: `"ঢাকা বিশ্ববিদ্যালয় (DU) • 2025-26 সেশন প্রশ্ন সমাধান"`.
     - Displays sticky subject filter tabs: `ALL`, `Physics (পদার্থবিজ্ঞান)`, `Chemistry (রসায়ন)`, `Mathematics (গণিত)`, `Biology (জীববিজ্ঞান)`.
     - Includes a prominent `← সকল সেশন ও বিশ্ববিদ্যালয়` back button to return to Home at any time.
     - Each question has its full options, textbook solution, KaTeX math rendering, and inline expandable AI Tutor.
   - Clicking **"Start Exam"**:
     - Immediately launches the live 90-minute strict auto-lock exam for DU 2025-26 with that paper's questions.

2. **Subject Switching inside "See question"**:
   - Student clicks `Physics` tab: only Physics questions for that paper are shown.
   - Student clicks `Chemistry` tab: instant filter without reloading.
   - Student clicks `Ask AI Tutor`: accordion card opens inline right below the question with live streaming explanation.

---

## 3. Key Product Decisions & Trade-Offs

- **Dedicated JSON Format per University & Session**:
  - *Chosen*: Clean JSON files organized by university and session (e.g., `src/data/json/du/du_25_26.json`, `src/data/json/ru/ru_24_25.json`) with TypeScript typing and a centralized index loader.
  - *Why*: Allows you to add, edit, or import hundreds of university admission questions in standard JSON syntax without touching component code.
- **Unified Schema for Questions**:
  - Format:
    ```json
    {
      "id": "du-25-26-p1",
      "university": "DU",
      "session": "25-26",
      "subject": "Physics",
      "question": "একটি সরল দোলকের দৈর্ঘ্য 4 গুণ করা হলে এর দোলনকাল কত গুণ হবে?",
      "options": ["অর্ধেক (0.5 গুণ)", "দ্বিগুণ (2 গুণ)", "চারগুণ (4 গুণ)", "অপরিবর্তিত"],
      "correctAnswer": 1,
      "explanation": "দোলনকাল $T = 2\\pi \\sqrt{\\frac{L}{g}}$। সুতরাং $T \\propto \\sqrt{L}$। দৈর্ঘ্য $L$ কে 4 গুণ করলে দোলনকাল $\\sqrt{4} = 2$ গুণ বৃদ্ধি পাবে।",
      "marks": 1
    }
    ```

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│  src/data/json/                                             │
│    ├── du/du_25_26.json, du_24_25.json, ...                │
│    ├── ru/ru_24_25.json, ...                               │
│    ├── ju/ju_23_24.json, ...                               │
│    ├── cu/cu_24_25.json, ...                               │
│    └── gst/gst_24_25.json, ...                             │
│  src/data/questionBank.ts (Unified Loader & Session Query) │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│        HomeView.tsx          │    │     QuestionBankView.tsx     │
│  - Session Cards             │    │  (Scoped Question View)      │
│  - Button: "See question" ───┼───►│  - Scoped to Uni & Session   │
│  - Button: "Start Exam"      │    │  - Subject Tabs: All/Phy/... │
└──────────────┬───────────────┘    └──────────────┬───────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│      StrictExamView.tsx      │    │      InlineAiTutor.tsx       │
│  - Scoped to Uni & Session   │    │  - Real-time SSE streaming   │
│  - Auto-lock & timer         │    │  - Step-by-step shortcuts    │
└──────────────────────────────┘    └──────────────────────────────┘
```

### Component & File Tasks
1. **Create JSON Files & Central Loader (`src/data/json/`)**:
   - Organize individual JSON files for DU, RU, JU, CU, and GST sessions.
   - Maintain a master session loader in `questionBank.ts` (`getQuestionsForSession(sessionId)`).
2. **Update `HomeView.tsx`**:
   - Replace the `"Question Bank"` button on session cards with `"See question"` (styled with an eye/book icon).
   - Ensure clicking `"See question"` navigates to `questionBank` view with `selectedSession` pre-set.
3. **Update `QuestionBankView.tsx`**:
   - Accept `selectedSession?: ExamSession` and `onBack?: () => void`.
   - When a session is active, lock the view specifically to that session's questions and display subject filter tabs (`ALL`, `Physics`, `Chemistry`, `Mathematics`, `Biology`, `ICT`).
   - Add a clear `"← Back to Sessions"` header button so the student can easily explore other university papers.
