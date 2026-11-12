# Question Import Report

## 1. Paper Information

- Institution: University of Dhaka (ঢাকা বিশ্ববিদ্যালয়)
- Institution ID: `DU`
- Unit: `A`
- Session: `06-07`
- Session ID: `du-06-07`
- Paper title: DU 06-07
- Question type: MCQ
- Source filename: `DU_06-07_a475818f.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 165
- Number of subjects: 6 — Chemistry (28), Physics (30), Mathematics (22), Biology (30), Bangla (30), English (25)
- MCQ count: 165
- Written count: 0
- Answer information: 165 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 6

## 3. Data Conversion

- Output JSON path: `public/data/questions/DU/06-07/du-06-07.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `du-06-07-q-001` through `du-06-07-q-165`
- Numbering rules: Preserved exact sequential question numbers (1 to 165) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Chemistry`, `Physics`, `Mathematics`, `Biology`, `Bangla`, `English`)

## 4. Image Processing

- Number of image links discovered: 6
- Successfully downloaded: 6 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/DU/06-07/du-06-07/q-027-question-9eda71.png` (Q#27, question)
  - `assets/questions/DU/06-07/du-06-07/q-027-option-a-b22b76.png` (Q#27, option-a)
  - `assets/questions/DU/06-07/du-06-07/q-027-option-b-357da2.png` (Q#27, option-b)
  - `assets/questions/DU/06-07/du-06-07/q-027-option-c-19569d.png` (Q#27, option-c)
  - `assets/questions/DU/06-07/du-06-07/q-027-option-d-f737a5.png` (Q#27, option-d)
  - `assets/questions/DU/06-07/du-06-07/q-050-question-c08d72.png` (Q#50, question)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/DU/06-07/du-06-07/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 165
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 165
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/DU/06-07/du-06-07.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (6 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/DU/06-07/du-06-07.json`
  - `docs/imports/DU/06-07/du-06-07/image-manifest.json`
  - `docs/imports/DU/06-07/du-06-07/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 165
- Local images: 6
- Verified answers: 165
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
