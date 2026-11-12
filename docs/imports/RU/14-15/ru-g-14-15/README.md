# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `G`
- Session: `14-15`
- Session ID: `ru-g-14-15`
- Paper title: RU G 14-15
- Question type: MCQ
- Source filename: `RU_G_14-15_646a15ce.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 100
- Number of subjects: 3 — Chemistry (29), Biology (61), English (10)
- MCQ count: 100
- Written count: 0
- Answer information: 100 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 0

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/14-15/ru-g-14-15.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-g-14-15-q-001` through `ru-g-14-15-q-100`
- Numbering rules: Preserved exact sequential question numbers (1 to 100) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Chemistry`, `Biology`, `English`)

## 4. Image Processing

- Number of image links discovered: 0
- Successfully downloaded: 0 (plus 0 deduplicated)
- Local image paths:
  - None (no external images in this paper)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/14-15/ru-g-14-15/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 100
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 100
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/14-15/ru-g-14-15.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (0 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/14-15/ru-g-14-15.json`
  - `docs/imports/RU/14-15/ru-g-14-15/image-manifest.json`
  - `docs/imports/RU/14-15/ru-g-14-15/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 100
- Local images: 0
- Verified answers: 100
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
