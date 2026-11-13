import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import type { Question } from '../types';
import { generateQuestionExplanation } from './explanationGenerator';

const mdParser = unified().use(remarkParse).use(remarkMath);

function assertValidExplanation(md: string) {
  assert.match(md, /###\s*১\.\s*🎯\s*বিস্তারিত ব্যাখ্যা/);
  assert.match(md, /###\s*২\.\s*📐\s*ধাপে ধাপে সমাধান/);
  assert.match(md, /###\s*৩\.\s*⚡\s*MCQ শর্টকাট টিপস/);
  assert.match(md, /\n\n২\./, 'Step 2 should start after a Markdown paragraph break');
  assert.match(md, /\n\n(?:৩\.|অতএব|সঠিক উত্তর)/, 'Step 3 or conclusion should start after a Markdown paragraph break');

  const cleanEsc = md.replace(/\\\$/g, '');
  const rem = cleanEsc.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+?\$/g, '');
  assert.equal(rem.includes('$'), false, `Unbalanced $ in generated explanation: ${md}`);

  const tree = mdParser.parse(md);
  const visit = (node: any) => {
    if (!node) return;
    if (node.type === 'inlineMath' || node.type === 'math') {
      assert.doesNotThrow(
        () => katex.renderToString(node.value, { displayMode: node.type === 'math', strict: false, throwOnError: true }),
        `remark-math + KaTeX error on "${node.value}"`
      );
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
  };
  visit(tree);
}

describe('generateQuestionExplanation', () => {
  it('computes exact derivations for physics, math, and ICT problems matching verified answers', () => {
    const qMassEnergy: Question = {
      id: 'test-1',
      number: 2,
      subject: 'Physics',
      question: '$10^{-28}$ kg ভরের একটি কণা ভরহীন ফোটনে ক্ষয় হলে, কত শক্তি বের হবে?',
      options: ['$10^{-28} J$', '$3 \\times 10^{-20} J$', '$9 \\times 10^{-12}J$', 'None'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '00-01'
    };
    const exp1 = generateQuestionExplanation(qMassEnergy);
    assertValidExplanation(exp1);
    assert.match(exp1, /E = mc\^2/);
    assert.match(exp1, /9 \\times 10\^\{-12\}/);

    const qEllipse: Question = {
      id: 'test-2',
      number: 95,
      subject: 'Mathematics',
      question: '$3x^{2}+4y^{2}=12$ উপবৃত্তের উপকেন্দ্রদ্বয়ের দূরত্ব কত?',
      options: ['2', '$\\sqrt{3}$', '1', '$\\frac{2}{\\sqrt{3}}$'],
      correctAnswer: 0,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '00-01'
    };
    const exp2 = generateQuestionExplanation(qEllipse);
    assertValidExplanation(exp2);
    assert.match(exp2, /2\\sqrt\{4 - 3\} = 2/);

    const qSlope: Question = {
      id: 'test-3',
      number: 97,
      subject: 'Mathematics',
      question: '$y=2x^3+3x^2-12x+7$ একটি বক্ররেখার সমীকরণ। মূল বিন্দুতে বক্ররেখাটির নতির পরিমাণ কত?',
      options: ['8', '12', '6', '-12'],
      correctAnswer: 3,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '00-01'
    };
    const exp3 = generateQuestionExplanation(qSlope);
    assertValidExplanation(exp3);
    assert.match(exp3, /-12/);

    const qBin: Question = {
      id: 'test-4',
      number: 1,
      subject: 'ICT',
      question: '$(1101)_2$ এর দশমিক মান কত?',
      options: ['11', '13', '14', '15'],
      correctAnswer: 1,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '23-24'
    };
    const exp4 = generateQuestionExplanation(qBin);
    assertValidExplanation(exp4);
    assert.match(exp4, /2\^\{3\}.*= 13/);
  });

  it('handles unverified answers and image options without inventing answers or broken markdown', () => {
    const qUnverified: Question = {
      id: 'test-unv',
      number: 10,
      subject: 'Chemistry',
      question: 'নিচের কোনটি লুইস এসিড?',
      options: ['$\\mathrm{NH_3}$', '$\\mathrm{BCl_3}$', '$\\mathrm{H_2O}$', '$\\mathrm{OH^-}$'],
      correctAnswer: -1,
      answerVerified: false,
      questionType: 'MCQ',
      institution: 'RU',
      session: '19-20'
    };
    const expUnv = generateQuestionExplanation(qUnverified);
    assertValidExplanation(expUnv);
    assert.match(expUnv, /যাচাইকৃত.*নয়/);

    const qImgOpt: Question = {
      id: 'test-img',
      number: 11,
      subject: 'Physics',
      question: 'কোন লেখচিত্রটি ওহমের সূত্র নির্দেশ করে?',
      options: ['[IMAGE: https://example.com/a.png]', '[IMAGE: https://example.com/b.png]'],
      correctAnswer: 0,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '20-21'
    };
    const expImg = generateQuestionExplanation(qImgOpt);
    assertValidExplanation(expImg);
    assert.equal(expImg.includes('[IMAGE:'), false);
    assert.match(expImg, /চিত্রে প্রদর্শিত বিকল্প/);
  });
});
