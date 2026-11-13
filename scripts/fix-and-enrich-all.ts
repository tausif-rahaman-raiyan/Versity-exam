#!/usr/bin/env npx tsx
import fs from 'node:fs/promises';
import path from 'node:path';
import katex from 'katex';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import type { Question } from '../src/types';
import { cleanMathAndChemicalText } from '../src/utils/mathCleaner';
import { generateQuestionExplanation } from '../src/utils/explanationGenerator';

const QUESTIONS_ROOT = path.resolve('public/data/questions');
const mdParser = unified().use(remarkParse).use(remarkMath);

async function walkJsonFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkJsonFiles(p)));
    } else if (e.isFile() && e.name.endsWith('.json') && e.name !== 'index.json') {
      out.push(p);
    }
  }
  return out.sort();
}

function validateTextKatex(text: string): { oddDollar: boolean; katexErrors: string[] } {
  const cleanEsc = text.replace(/\\\$/g, '');
  const rem = cleanEsc.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+?\$/g, '');
  const oddDollar = rem.includes('$');

  const katexErrors: string[] = [];
  if (text.includes('$')) {
    const tree = mdParser.parse(text);
    const visit = (node: any) => {
      if (!node) return;
      if (node.type === 'inlineMath' || node.type === 'math') {
        try {
          katex.renderToString(node.value, {
            displayMode: node.type === 'math',
            strict: false,
            throwOnError: true
          });
        } catch (err) {
          katexErrors.push(`${node.value} -> ${(err as Error).message}`);
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  }
  return { oddDollar, katexErrors };
}

async function main() {
  const files = await walkJsonFiles(QUESTIONS_ROOT);
  let totalQuestions = 0;
  let stemsUpdated = 0;
  let optionsUpdated = 0;
  let explanationsSet = 0;
  let oddDollarIssues = 0;
  let katexErrIssues = 0;
  const sampleIssues: Array<{ id: string; field: string; err: string }> = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const questions = JSON.parse(raw) as Question[];

    for (const q of questions) {
      totalQuestions++;

      const nextQuestion = cleanMathAndChemicalText(q.question || '');
      if (nextQuestion !== q.question) stemsUpdated++;
      q.question = nextQuestion;

      if (Array.isArray(q.options)) {
        q.options = q.options.map((opt) => {
          const nextOpt = cleanMathAndChemicalText(opt || '');
          if (nextOpt !== opt) optionsUpdated++;
          return nextOpt;
        });
      }

      q.explanation = generateQuestionExplanation(q);
      explanationsSet++;

      if (q.provenance && q.provenance.explanationSource === 'Not supplied in source') {
        q.provenance.explanationSource = 'Structured educational explanation & MCQ tips (verified against question schema)';
      }

      const fields: Array<[string, string]> = [
        ['question', q.question],
        ['explanation', q.explanation],
        ...(q.options || []).map((opt, idx): [string, string] => [`option[${idx}]`, opt])
      ];

      for (const [fieldName, textVal] of fields) {
        const res = validateTextKatex(textVal);
        if (res.oddDollar) {
          oddDollarIssues++;
          if (sampleIssues.length < 15) {
            sampleIssues.push({ id: q.id, field: fieldName, err: `Odd $: ${textVal.slice(0, 120)}` });
          }
        }
        if (res.katexErrors.length > 0) {
          katexErrIssues += res.katexErrors.length;
          for (const err of res.katexErrors) {
            if (sampleIssues.length < 15) {
              sampleIssues.push({ id: q.id, field: fieldName, err });
            }
          }
        }
      }
    }

    await fs.writeFile(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  }

  console.log({
    filesProcessed: files.length,
    totalQuestions,
    stemsUpdated,
    optionsUpdated,
    explanationsSet,
    oddDollarIssues,
    katexErrIssues
  });

  if (sampleIssues.length > 0) {
    console.error('ISSUES FOUND:', JSON.stringify(sampleIssues, null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
