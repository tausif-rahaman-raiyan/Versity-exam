# JU & KhU Unit Selection and Mark Distribution Comparison

Streamline the university selector cards by removing legacy/set-code unit labels from Rajshahi University (RU) and Comilla University (CoU), and introduce an interactive Unit Selection & Side-by-Side Mark Distribution Comparison panel exclusively for Jahangirnagar University (JU) and Khulna University (KhU).

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design and functional choices have been confirmed from your answers:

- **Confirmed Decision 1 — Exclusive Unit Tabs (Defaulting to Unit A)**: Only **JU** (`Unit A` / `Unit D`) and **KhU** (`Unit A` / `Unit B`) display unit filter tabs before the session cards, defaulting to **Unit A** when either university is selected.
- **Confirmed Decision 2 — Side-by-Side Unit Comparison Cards**: Below the unit selector tabs, both units are always shown side by side (`JU Unit A — Science / Math & Physics` vs `JU Unit D — Biological Sciences`, and `KU Unit A — Science, Engineering and Technology` vs `KU Unit B — Biological Sciences`) with full faculty details, subject lists, seat counts, mark distributions, and exam rules, while visually highlighting whichever unit tab is currently active.
- **Confirmed Decision 3 — Clean RU & CoU Cards**: Remove `C • H • F • G` from RU and `A • B • C` from CoU on the university selection cards so only true multi-unit universities (`JU` and `KhU`) show unit badges.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. Removes set-code unit badges (`C • H • F • G` on RU and `A • B • C` on CoU) from the university selection cards while keeping `A • D` on JU and `A • B` on KhU.
  2. Displays an interactive **Unit A / Unit D** (for JU) or **Unit A / Unit B** (for KhU) selector bar above the session exam cards, filtering the session grid to the active unit and remembering the selected unit when returning from an exam or question bank.
  3. Renders a rich **Side-by-Side Unit Overview & Mark Distribution** section directly below the unit tabs so candidates can compare faculties, subjects, seats, MCQ/Written mark breakdowns, pass marks, and negative marking rules at a glance.
- **Target Audience / Persona**: University admission candidates preparing for Jahangirnagar University (A & D Units) and Khulna University (A & B Units) who need clarity on unit-specific syllabus weights and exam rules before launching a practice paper.
- **Key Value**: Eliminates confusion between set codes (RU/CoU) and actual academic units (JU/KhU), while giving students immediate visibility into unit eligibility, subject weights, and passing criteria right above the session cards.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **University Card Selection**:
     - On the institution grid (`বিশ্ববিদ্যালয় ও ইউনিট নির্বাচন করুন`), **RU** displays `"2010-11 to 2025-26"` without `C • H • F • G`, and **CoU** displays `"2006-07 to 2025-26"` without `A • B • C`.
     - **JU** displays `A • D` and **KhU** displays `A • B`.
  2. **Selecting Jahangirnagar University (JU)**:
     - Clicking **JU** smoothly scrolls down and defaults the unit filter to **Unit A**.
     - A prominent 2-tab selector bar appears at the top:
       - `JU Unit A — (Science / Math & Physics)`
       - `JU Unit D — (Biological Sciences)`
     - Below the selector bar, a 2-column comparison layout displays **JU A Unit** and **JU D Unit** side by side (stacked cleanly on mobile phones), highlighting the active unit card with a purple accent border and badge:
       - **Shared Exam Rules Strip**: `Total Marks: 80` • `Pass Mark: 36 (45%)` • `Exam Time: 55 Minutes` • `Negative Marking: –0.20 / wrong answer`.
       - **JU A Unit Card**: Faculty of Mathematical & Physical Sciences + IIT • 8 Subjects (CSE, Mathematics, Physics, Chemistry, Statistics, Geological/Environmental Sciences, IIT) • `426 Seats` • Core Focus: Physics, Higher Math, Chemistry • Mark Breakdown: Mathematics (`22`), Physics (`22`), Chemistry (`22`), ICT (`8`), Bangla (`3`), English (`3`).
       - **JU D Unit Card**: Faculty of Biological Sciences (Life Sciences) • 7 Subjects (Botany, Zoology, Biochemistry & Molecular Biology, Microbiology, Biotechnology & Genetic Engineering, Public Health & Informatics, Pharmacy) • `310 Seats (155 Male / 155 Female)` • Core Focus: Botany, Zoology, Chemistry • Mark Breakdown: Botany (`22`), Zoology (`22`), Chemistry (`24`), Bangla (`4`), English (`4`), IQ / Intelligence Test (`4`).
     - Clicking either unit tab (or clicking directly on one of the two comparison cards) switches the active unit filter between `A` and `D` and updates the session exam cards below.
  3. **Selecting Khulna University (KhU)**:
     - Clicking **KhU** smoothly scrolls down and defaults the unit filter to **Unit A**.
     - A 2-tab selector bar appears:
       - `KU Unit A — (Science, Engineering and Technology)`
       - `KU Unit B — (Biological Sciences)`
     - Below the selector bar, a 2-column comparison layout displays **KU A Unit** and **KU B Unit** side by side with a teal accent theme:
       - **Shared Exam Rules Strip**: `Total Marks: 100 (MCQ 60 + Written 40)` • `Per MCQ: 1 Mark` • `Negative Marking: –0.25 / wrong answer`.
       - **KU A Unit Card**: School of Science, Engineering and Technology • **MCQ (`60 Marks`)**: Physics (`20`), Chemistry (`20`), Math (`20`) *(with circular variation note for English/ICT)* • **Written (`40 Marks`)**: `5 questions × 8 marks = 40 marks` (English, Physics, Chemistry, Math, ICT) • **Architecture Note**: Additional `50-mark` drawing test required for Architecture.
       - **KU B Unit Card**: School of Biological Science • **MCQ (`60 Marks`)**: Biology (`15`), Chemistry (`12`), Math (`12`), Physics (`12`), English (`9`) • **Written (`40 Marks`, 2-mark questions)**: Biology (`10` — 5×2), Chemistry (`8` — 4×2), Math (`8` — 4×2), Physics (`8` — 4×2), English (`6`).
- **Visual Identity & Theme**:
  - Matches each institution's signature palette (`purple` for JU, `teal` for KhU) in both Light and Dark mode.
  - Compact, well-structured mobile layout (`p-3.5 sm:p-5`, 2-column subject mark pills inside each unit card) so phone screens stay clean and scannable.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Interactive Comparison Cards Coupled with Unit Filter Tabs**:
  - *Chosen Approach*: Clicking either a unit tab (`Unit A` / `Unit D` or `Unit B`) or clicking a unit comparison card activates that unit and filters the session exam cards below.
  - *Why*: Users naturally tap the comparison card they are reading; making both the top tabs and the side-by-side cards interactive provides effortless switching while keeping both units visible for comparison.
- **Decision 2 — Persisting Active Unit Across Exam & Question Bank Navigation**:
  - *Chosen Approach*: Lift `selectedUnit` (`'A' | 'B' | 'D'`) to root `App` state and synchronize it when launching or returning from any JU/KhU session.
  - *Why*: If a student selects JU Unit D, opens a JU D session, and clicks Back/Exit, they return directly to JU Unit D at their exact scroll position.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                               App State                                 │
│  • selectedInstitutionId ('DU' | 'RU' | 'JU' | 'KhU' | ...)             │
│  • selectedUnit ('A' | 'D' | 'B') — synced with active session          │
│  • homeScrollYRef — restores scroll position on Back / Exit             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                               HomeView                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 1. Institution Selector Grid                                      │  │
│  │    • RU & CoU: no unit tags (set codes removed)                   │  │
│  │    • JU: A • D badge  |  KhU: A • B badge                         │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │ (Shown only when JU or KhU active) │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 2. JU / KhU Unit Filter & Side-by-Side Comparison Section         │  │
│  │    • 2-Tab Unit Switcher (Unit A vs Unit D / Unit B)              │  │
│  │    • Exam Rules Banner (Total Marks, Pass Mark, Time, Neg Mark)   │  │
│  │    • Side-by-Side Comparison Grid (Unit A Card  ||  Unit D/B Card)│  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │ (Filters by s.unit === selectedUnit)│
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 3. Session Exam Cards Grid                                        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - Selecting `JU` or `KhU` in `HomeView` sets `selectedInstitutionId` and resets `selectedUnit` to `'A'`.
  - When a user opens a `JU` or `KhU` session in Question Bank or Exam mode, `syncInstitutionForSession` also syncs `selectedUnit` to `session.unit` (`'A'`, `'D'`, or `'B'`) so returning to Home always keeps the matching unit tab active.
