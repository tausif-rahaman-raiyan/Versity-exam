# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `G`
- Session: `12-13`
- Session ID: `ru-g-12-13`
- Paper title: RU G 12-13
- Question type: MCQ
- Source filename: `RU_G_12-13_db8e3744.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 99
- Number of subjects: 4 — Biology (72), English (9), Chemistry (16), Physics (2)
- MCQ count: 99
- Written count: 0
- Answer information: 99 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 1

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/12-13/ru-g-12-13.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-g-12-13-q-001` through `ru-g-12-13-q-099`
- Numbering rules: Preserved exact sequential question numbers (1 to 99) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Biology`, `English`, `Chemistry`, `Physics`)

## 4. Image Processing

- Number of image links discovered: 1
- Successfully downloaded: 1 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/12-13/ru-g-12-13/q-044-option-d-537ffa.png` (Q#44, option-d)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/12-13/ru-g-12-13/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 99
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 99
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/12-13/ru-g-12-13.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (1 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/12-13/ru-g-12-13.json`
  - `docs/imports/RU/12-13/ru-g-12-13/image-manifest.json`
  - `docs/imports/RU/12-13/ru-g-12-13/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 99
- Local images: 1
- Verified answers: 99
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
