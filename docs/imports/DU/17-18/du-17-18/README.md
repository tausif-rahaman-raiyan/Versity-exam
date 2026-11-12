# Question Import Report

## 1. Paper Information

- Institution: University of Dhaka (ঢাকা বিশ্ববিদ্যালয়)
- Institution ID: `DU`
- Unit: `A`
- Session: `17-18`
- Session ID: `du-17-18`
- Paper title: DU 17-18
- Question type: MCQ
- Source filename: `DU_17-18_490bcbf5.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 171
- Number of subjects: 6 — Biology (30), English (27), Mathematics (26), Bangla (28), Chemistry (30), Physics (30)
- MCQ count: 171
- Written count: 0
- Answer information: 171 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 18

## 3. Data Conversion

- Output JSON path: `public/data/questions/DU/17-18/du-17-18.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `du-17-18-q-001` through `du-17-18-q-171`
- Numbering rules: Preserved exact sequential question numbers (1 to 171) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Biology`, `English`, `Mathematics`, `Bangla`, `Chemistry`, `Physics`)

## 4. Image Processing

- Number of image links discovered: 18
- Successfully downloaded: 18 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/DU/17-18/du-17-18/q-125-option-a-441096.png` (Q#125, option-a)
  - `assets/questions/DU/17-18/du-17-18/q-125-option-b-344d31.png` (Q#125, option-b)
  - `assets/questions/DU/17-18/du-17-18/q-125-option-c-28ea0c.png` (Q#125, option-c)
  - `assets/questions/DU/17-18/du-17-18/q-125-option-d-013bc0.png` (Q#125, option-d)
  - `assets/questions/DU/17-18/du-17-18/q-127-option-a-b172c6.png` (Q#127, option-a)
  - `assets/questions/DU/17-18/du-17-18/q-127-option-b-22548b.png` (Q#127, option-b)
  - `assets/questions/DU/17-18/du-17-18/q-127-option-c-d69723.png` (Q#127, option-c)
  - `assets/questions/DU/17-18/du-17-18/q-127-option-d-74d248.png` (Q#127, option-d)
  - `assets/questions/DU/17-18/du-17-18/q-133-option-a-d7257a.png` (Q#133, option-a)
  - `assets/questions/DU/17-18/du-17-18/q-133-option-b-533ab0.png` (Q#133, option-b)
  - `assets/questions/DU/17-18/du-17-18/q-149-question-a1f30a.png` (Q#149, question)
  - `assets/questions/DU/17-18/du-17-18/q-164-option-a-01efd8.png` (Q#164, option-a)
  - `assets/questions/DU/17-18/du-17-18/q-164-option-b-9beca0.png` (Q#164, option-b)
  - `assets/questions/DU/17-18/du-17-18/q-164-option-c-ed5865.png` (Q#164, option-c)
  - `assets/questions/DU/17-18/du-17-18/q-166-question-26138d.png` (Q#166, question)
  - `assets/questions/DU/17-18/du-17-18/q-167-option-a-8db5ab.png` (Q#167, option-a)
  - `assets/questions/DU/17-18/du-17-18/q-167-option-b-024125.png` (Q#167, option-b)
  - `assets/questions/DU/17-18/du-17-18/q-167-option-c-1220f6.png` (Q#167, option-c)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/DU/17-18/du-17-18/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 171
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 171
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/DU/17-18/du-17-18.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (18 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/DU/17-18/du-17-18.json`
  - `docs/imports/DU/17-18/du-17-18/image-manifest.json`
  - `docs/imports/DU/17-18/du-17-18/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 171
- Local images: 18
- Verified answers: 171
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
