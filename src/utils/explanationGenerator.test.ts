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

  it('matches exact solvers and narrow micro-topics across DU 25-26 and historical DU sessions without formula collisions', () => {
    const q1: Question = {
      id: 'du-25-26-mcq-q-001',
      number: 1,
      subject: 'Physics',
      question: 'একটি বস্তুকে অনুভুমিকের সাথে 45° কোণে E গতিশক্তিতে নিক্ষেপ করা হলো। সর্বোচ্চ বিন্দুতে বস্তুটির গতিশক্তি কত হবে? (An object is thrown with an energy E at an angle of 45° with the horizontal line. What will be the kinetic energy of the object at the highest point?)',
      options: ['2E', '$\\frac{E}{2}$', '0', 'E'],
      correctAnswer: 1,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e1 = generateQuestionExplanation(q1);
    assertValidExplanation(e1);
    assert.match(e1, /cos\^2.*45/);
    assert.equal(e1.includes('GM'), false, 'Projectile question must never emit gravitation g=GM/R^2 formula');

    const q2: Question = {
      id: 'du-25-26-mcq-q-002',
      number: 2,
      subject: 'Physics',
      question: 'ভিন্ন ভিন্ন চারটি পাত্রে নিম্নলিখিত গ্যাসগুলোর প্রতিটির 0.5 মোল রাখা হয়েছে। কোন গ্যাসটির তাপমাত্রা সর্বোচ্চ হবে?',
      options: [
        '3.0 L ক্রিপ্টন 300 kPa চাপে',
        '6.0 L নিয়ন 160 kPa চাপে',
        '8.0 L হিলিয়াম 120 kPa চাপে',
        '4.0 L আর্গন 250 kPa চাপে'
      ],
      correctAnswer: 3,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e2 = generateQuestionExplanation(q2);
    assertValidExplanation(e2);
    assert.match(e2, /PV = nRT/);
    assert.match(e2, /1000/);
    assert.equal(e2.includes('কার্নো'), false, 'Ideal gas comparator must not emit Carnot formula');

    const q4: Question = {
      id: 'du-25-26-mcq-q-004',
      number: 4,
      subject: 'Physics',
      question: 'একটি মিটার স্টিক 0.8c গতিতে একজন পর্যবেক্ষককে অতিক্রম করে। পর্যবেক্ষকের প্রসঙ্গ কাঠামোতে, পর্যবেক্ষককে অতিক্রম করতে স্টিকটির কত সময় লাগে?',
      options: ['2.5 ns', '5.2 ns', '2.4 ns', '4.2 ns'],
      correctAnswer: 0,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e4 = generateQuestionExplanation(q4);
    assertValidExplanation(e4);
    assert.match(e4, /2\.50?\\text\{ ns\}|2\.5\\text\{ ns\}/);

    const q7: Question = {
      id: 'du-25-26-mcq-q-007',
      number: 7,
      subject: 'Physics',
      question: 'দুটি বাইনারি সংখ্যা 1110.11 এবং 101.10 এর গুণফল কোনটি?',
      options: ['110001.101', '101000.1001', '1010001.001', '1010011.001'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e7 = generateQuestionExplanation(q7);
    assertValidExplanation(e7);
    assert.match(e7, /1010001\.001/);

    const q8: Question = {
      id: 'du-25-26-mcq-q-008',
      number: 8,
      subject: 'Physics',
      question: 'l দৈর্ঘ্য ও A প্রস্থচ্ছেদের ক্ষেত্রফল বিশিষ্ট একটি সিলিন্ডার আকৃতির তারের উপাদানের ইয়ং-এর গুণাঙ্ক ও পীড়ন যথাক্রমে Y ও S হলে (cross-sectional area A)',
      options: ['$\\frac{S^2 ALY}{2}$', '$\\frac{Yl^2}{2SA}$', '$\\frac{S^2 AL}{2Y}$', '$\\frac{YA}{2Sl}$'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e8 = generateQuestionExplanation(q8);
    assertValidExplanation(e8);
    assert.match(e8, /\\frac\{S\^2 AL\}\{2Y\}/);
    assert.equal(e8.includes('ভেক্টর'), false, '"cross-sectional" must never match vector topic');

    const q13: Question = {
      id: 'du-25-26-mcq-q-013',
      number: 13,
      subject: 'Physics',
      question: 'একটি সমান্তরাল পাত ধারককে চার্জ করার ফলে এর পাত দুটির মধ্যে x ভোল্ট বিভব পার্থক্য তৈরি হয়। উক্ত ধারকটির পাতদ্বয়ের মধ্যবর্তী দূরত্ব অর্ধেক করে বিভব পার্থক্য দ্বিগুণ করা হলো। এই দুই অবস্থায় সঞ্চিত শক্তির অনুপাত কত হবে?',
      options: ['4:1', '1:8', '1:2', '1:4'],
      correctAnswer: 1,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e13 = generateQuestionExplanation(q13);
    assertValidExplanation(e13);
    assert.match(e13, /1 : 8/);

    const q20: Question = {
      id: 'du-25-26-mcq-q-020',
      number: 20,
      subject: 'Chemistry',
      question: '$\\mathrm{C}_6\\mathrm{H}_5\\mathrm{CHO}$ কে $\\text{Zn.Hg}$ অ্যামালগাম এবং গাঢ় $\\mathrm{HCl}$ (concentrated HCl) এর সাথে উত্তপ্ত করলে কী উৎপন্ন হয়?',
      options: ['$\\mathrm{C}_6\\mathrm{H}_5\\mathrm{OH}$', '$\\mathrm{C}_6\\mathrm{H}_6$', '$\\mathrm{C}_6\\mathrm{H}_5\\mathrm{CH}_3$', '$\\mathrm{C}_6\\mathrm{H}_5\\mathrm{OC}_6\\mathrm{H}_5$'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e20 = generateQuestionExplanation(q20);
    assertValidExplanation(e20);
    assert.match(e20, /ক্লিমেনসেন/);
    assert.equal(e20.includes('লা শাতেলিয়ে'), false, '"concentrated" must never match equilibrium/rate topic');

    const q77: Question = {
      id: 'du-25-26-mcq-q-077',
      number: 77,
      subject: 'English',
      question: 'The effect of painkillers __________ after about two hours.',
      options: ['run down', 'work out', 'wears off', 'take off'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const e77 = generateQuestionExplanation(q77);
    assertValidExplanation(e77);
    assert.match(e77, /wear off|phrasal verb|wears off/i);
    assert.equal(e77.includes('Past Perfect'), false, '"after about" must not trigger Past Perfect rule');

    const qSet: Question = {
      id: 'du-02-03-q-018',
      number: 18,
      subject: 'Mathematics',
      question: 'ডি মরগানের কোনটি সঠিক?',
      options: ["$A \\cup B = A \\cup B'$", "$A \\setminus B = A \\cap B'$", "$A \\setminus B = A' \\cup B$", "$A \\setminus B = A' \\cup B$"],
      correctAnswer: 1,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '02-03'
    };
    const eSet = generateQuestionExplanation(qSet);
    assertValidExplanation(eSet);
    assert.match(eSet, /\\setminus/);

    const qMissingDiagram: Question = {
      id: 'du-04-05-q-120',
      number: 120,
      subject: 'Physics',
      question: 'নিম্নের চিত্রে $\\vec{p}, \\vec{q}$ ও $\\vec{r}$ দ্বারা প্রদর্শিত ভেক্টরগুলোর জন্য কোনটি সঠিক?',
      options: ['$\\vec{p}+\\vec{q}+\\vec{r}=0$', '$\\vec{p}-\\vec{q}=\\vec{r}$', '$\\vec{p}+\\vec{q}=\\vec{r}$', '$\\vec{q}+\\vec{r}=\\vec{p}$'],
      correctAnswer: -1,
      answerVerified: false,
      questionType: 'MCQ',
      institution: 'DU',
      session: '04-05',
      provenance: {
        sourceFile: 'DU_04-05.txt',
        sourceLocation: 'Q120',
        answerSource: 'Unavailable',
        explanationSource: 'Unavailable',
        verificationStatus: 'Incomplete — required vector diagram unavailable in source',
        notes: 'প্রশ্নে উল্লিখিত ভেক্টরগুলোর দিক নির্দেশক চিত্র (Q120_QUESTION_1.jpg) উৎসে সংযুক্ত না থাকায় অনুমান করে উত্তর নির্ধারণ করা হয়নি।'
      }
    };
    const eMiss = generateQuestionExplanation(qMissingDiagram);
    assertValidExplanation(eMiss);
    assert.match(eMiss, /Q120_QUESTION_1\.jpg/);

    const qLongChemDisplay: Question = {
      id: 'cu-a-20-21-q-068',
      number: 68,
      subject: 'Chemistry',
      question: '$$\\mathrm{C}_{2}\\mathrm{H}_{5}\\mathrm{ONa}+\\mathrm{C}_{2}\\mathrm{H}_{5}\\mathrm{I} \\rightarrow \\mathrm{C}_{2}\\mathrm{H}_{5}\\mathrm{OC}_{2}\\mathrm{H}_{5}+\\mathrm{NaI}$$ বিক্রিয়াটি কোন নামে পরিচিত? (What is the name of the reaction?)',
      options: ['রাইমার-টাইম্যান', 'ক্যানিজারো', 'উইলিয়ামসন সংশ্লেষণ', 'ফ্রিডেল-ক্রাফটস'],
      correctAnswer: 2,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'CU',
      session: '20-21'
    };
    assertValidExplanation(generateQuestionExplanation(qLongChemDisplay));

    const qMatrix: Question = {
      id: 'cu-a-23-24-q-092',
      number: 92,
      subject: 'Mathematics',
      question: '$\\begin{vmatrix} x+1 & \\omega & \\omega^2 \\\\ \\omega & x+\\omega^2 & 1 \\\\ \\omega^2 & 1 & x+\\omega \\end{vmatrix} = 0$ সমীকরণটির নির্ণায়ক সমাধান করলে $x$-এর মান কোনটি হবে?',
      options: ['0', '1', '-1', '3'],
      correctAnswer: 0,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'CU',
      session: '23-24'
    };
    assertValidExplanation(generateQuestionExplanation(qMatrix));

    const qResistors: Question = {
      id: 'du-25-26-mcq-q-005',
      number: 5,
      subject: 'Physics',
      question: 'একজন শিক্ষার্থীকে দুটি ভিন্ন রোধ $R_1$ এবং $R_2$ দেওয়া হলো। এগুলোকে বিভিন্নভাবে সংযোগ করে সে $3 \\Omega$, $4 \\Omega$, $12 \\Omega$, এবং $16 \\Omega$ রোধ তৈরী করতে পারে। $R_1$ এবং $R_2$ এর মান কত?',
      options: ['$3 \\Omega$, $4 \\Omega$', '$2 \\Omega$, $12 \\Omega$', '$3 \\Omega$, $16 \\Omega$', '$4 \\Omega$, $12 \\Omega$'],
      correctAnswer: 3,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '25-26'
    };
    const eRes = generateQuestionExplanation(qResistors);
    assertValidExplanation(eRes);
    assert.match(eRes, /4\\times 12|4 \+ 12|4\+12/);

    const qShunt: Question = {
      id: 'du-00-01-q-005',
      number: 5,
      subject: 'Physics',
      question: '100 Ω রোধের একটি গ্যালভানোমিটারের সাথে কত শান্ট যুক্ত করলে মূল প্রবাহের 1% গ্যালভানোমিটারের মধ্য দিয়ে প্রবাহিত হবে?',
      options: ['1.01 Ω', '10.1 Ω', '100 Ω', '0.99 Ω'],
      correctAnswer: 0,
      answerVerified: true,
      questionType: 'MCQ',
      institution: 'DU',
      session: '00-01'
    };
    const eShunt = generateQuestionExplanation(qShunt);
    assertValidExplanation(eShunt);
    assert.match(eShunt, /1\.01/);
  });
});
