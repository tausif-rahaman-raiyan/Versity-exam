# Question Import Report

## 1. Paper Information

- Institution: University of Dhaka (ঢাকা বিশ্ববিদ্যালয়)
- Institution ID: `DU`
- Unit: `A`
- Session: `19-20`
- Session ID: `du-a-19-20-mcq`
- Paper title: DU A 19-20 MCQ
- Question type: MCQ
- Source filename: `DU_A_19-20_MCQ_d33ee34e.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 85
- Number of subjects: 6 — Physics (15), Chemistry (15), Mathematics (15), Biology (15), Bangla (15), English (10)
- MCQ count: 85
- Written count: 0
- Answer information: 85 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 5

## 3. Data Conversion

- Output JSON path: `public/data/questions/DU/19-20/du-a-19-20-mcq.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `du-a-19-20-mcq-q-001` through `du-a-19-20-mcq-q-085`
- Numbering rules: Preserved exact sequential question numbers (1 to 85) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Physics`, `Chemistry`, `Mathematics`, `Biology`, `Bangla`, `English`)

## 4. Image Processing

- Number of image links discovered: 5
- Successfully downloaded: 5 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/DU/19-20/du-a-19-20-mcq/q-006-question-2b2060.webp` (Q#6, question)
  - `assets/questions/DU/19-20/du-a-19-20-mcq/q-011-option-a-dd90f8.webp` (Q#11, option-a)
  - `assets/questions/DU/19-20/du-a-19-20-mcq/q-011-option-b-42c384.webp` (Q#11, option-b)
  - `assets/questions/DU/19-20/du-a-19-20-mcq/q-011-option-c-b2ab5c.webp` (Q#11, option-c)
  - `assets/questions/DU/19-20/du-a-19-20-mcq/q-011-option-d-868374.webp` (Q#11, option-d)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/DU/19-20/du-a-19-20-mcq/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 85
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 85
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/DU/19-20/du-a-19-20-mcq.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (5 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/DU/19-20/du-a-19-20-mcq.json`
  - `docs/imports/DU/19-20/du-a-19-20-mcq/image-manifest.json`
  - `docs/imports/DU/19-20/du-a-19-20-mcq/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 85
- Local images: 5
- Verified answers: 85
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
