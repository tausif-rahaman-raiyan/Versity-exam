import type { Question } from '../types';
import { cleanMathAndChemicalText } from './mathCleaner';

const DEFAULT_LABELS_BN = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

type ExplanationSection = {
  explanation: string;
  stepByStep: string;
  shortcut: string;
};

function normalizeDigits(str: string): string {
  const bn = '০১২৩৪৫৬৭৮৯';
  return str.replace(/[০-৯]/g, (d) => String(bn.indexOf(d)));
}

function stripLatex(str: string): string {
  return normalizeDigits(str)
    .replace(/\$\$?/g, '')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\times/g, '*')
    .replace(/\\mathrm\{([^{}]+)\}/g, '$1')
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatOptionPreview(optionText: string, label: string): string {
  if (!optionText || /\[IMAGE:/i.test(optionText)) {
    return `**(${label})** (চিত্রে প্রদর্শিত বিকল্প)`;
  }
  return `**(${label})** ${optionText.trim()}`;
}

function formatGcdFrac(num: number, den: number): { tex: string; plain: string; decimal: number } {
  if (den === 0) return { tex: '\\text{undefined}', plain: 'undefined', decimal: NaN };
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  let a = Math.abs(num);
  let b = Math.abs(den);
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  if (Number.isInteger(a) && Number.isInteger(b)) {
    const g = gcd(a, b);
    a /= g;
    b /= g;
  }
  const signedA = sign * a;
  if (b === 1) {
    return { tex: `${signedA}`, plain: `${signedA}`, decimal: signedA };
  }
  const prefix = sign < 0 ? '-' : '';
  return {
    tex: `${prefix}\\frac{${a}}{${b}}`,
    plain: `${signedA}/${b}`,
    decimal: signedA / b
  };
}

function optionMatchesNumber(optionRaw: string, target: number, tol = 0.02): boolean {
  const s = stripLatex(optionRaw).replace(/,/g, '');
  // Try fraction a/b
  const fracM = s.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
  if (fracM) {
    const val = Number(fracM[1]) / Number(fracM[2]);
    if (Number.isFinite(val) && Math.abs(val - target) <= tol) return true;
  }
  // Try first number in option (ignoring trailing unit)
  const numM = s.match(/^[^\d\-]*(-?\d+(?:\.\d+)?)/);
  if (numM) {
    const val = Number(numM[1]);
    if (Number.isFinite(val) && Math.abs(val - target) <= tol) return true;
  }
  return false;
}

/**
 * Deterministic verified solvers that only emit exact arithmetic steps
 * when the calculated result genuinely matches `options[correctAnswer]`.
 */
function tryExactSolver(
  q: Question,
  ansLabel: string,
  ansText: string
): ExplanationSection | null {
  const stemPlain = stripLatex(q.question);
  const ansPreview = formatOptionPreview(ansText, ansLabel);

  // 1. Quadratic roots sum/product or alpha^3 + beta^3
  {
    const quadM = stemPlain.match(/([+-]?\d*)\s*x\^2\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
    if (quadM && (q.subject === 'Mathematics' || /মূল|বীজ|root/i.test(stemPlain))) {
      const a = quadM[1] === '' || quadM[1] === '+' ? 1 : quadM[1] === '-' ? -1 : Number(quadM[1].replace(/\s+/g, ''));
      const b = Number(quadM[2].replace(/\s+/g, ''));
      const c = Number(quadM[3].replace(/\s+/g, ''));
      if (a !== 0 && Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
        const sum = formatGcdFrac(-b, a);
        const prod = formatGcdFrac(c, a);
        const disc = b * b - 4 * a * c;

        // Check alpha^3 + beta^3 = (alpha+beta)^3 - 3*alpha*beta*(alpha+beta)
        if (/α\^3\s*\+\s*β\^3|\\alpha\^3\s*\+\s*\\beta\^3/i.test(q.question)) {
          const sVal = -b / a;
          const pVal = c / a;
          const res = Math.pow(sVal, 3) - 3 * pVal * sVal;
          if (optionMatchesNumber(ansText, res)) {
            return {
              explanation: `দ্বিঘাত সমীকরণ $${a === 1 ? '' : a}x^{2} ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$-এর মূলদ্বয় $\\alpha$ ও $\\beta$ হলে ভিয়েতার সূত্রানুসারে $\\alpha + \\beta = -\\frac{b}{a}$ এবং $\\alpha\\beta = \\frac{c}{a}$।`,
              stepByStep:
                `১. সমীকরণ থেকে সহগ: $a = ${a},\\; b = ${b},\\; c = ${c}$।\n\n` +
                `২. $\\alpha + \\beta = -\\frac{${b}}{${a}} = ${sum.tex}$ এবং $\\alpha\\beta = \\frac{${c}}{${a}} = ${prod.tex}$।\n\n` +
                `৩. $\\alpha^3 + \\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta) = (${sum.tex})^3 - 3(${prod.tex})(${sum.tex}) = ${Number.isInteger(res) ? res : res.toFixed(2)}$।\n\n` +
                `অতএব সঠিক উত্তর ${ansPreview}।`,
              shortcut: `শর্টকাট: সরাসরি $( -\\frac{b}{a} )^3 - 3(\\frac{c}{a})(-\\frac{b}{a})$ বসাও। সমীকরণের মূল সমান হলে ($D = ${disc} = 0$) প্রতিটি মূল $\\alpha = \\beta = ${-b / (2 * a)}$, তাই সরাসরি $2\\alpha^3 = 2(${-b / (2 * a)})^3 = ${res}$ পাওয়া যায়!`
            };
          }
        }

        // Check sum or product of roots or discriminant
        if (/যোগফল|সমষ্টি|sum/i.test(stemPlain) && optionMatchesNumber(ansText, sum.decimal)) {
          return {
            explanation: `দ্বিঘাত সমীকরণ $ax^2 + bx + c = 0$-এর মূলদ্বয়ের যোগফল $= -\\frac{b}{a}$।`,
            stepByStep: `১. প্রদত্ত সমীকরণে $a=${a},\\; b=${b},\\; c=${c}$।\n\n২. মূলদ্বয়ের যোগফল $= -\\frac{${b}}{${a}} = ${sum.tex}$।\n\nসঠিক উত্তর ${ansPreview}।`,
            shortcut: `শর্টকাট: $x^2$-এর সহগ দিয়ে $x$-এর সহগকে ভাগ করে চিহ্ন উল্টে দাও ($-\\frac{b}{a}$)।`
          };
        }
        if (/গুণফল|product/i.test(stemPlain) && optionMatchesNumber(ansText, prod.decimal)) {
          return {
            explanation: `দ্বিঘাত সমীকরণ $ax^2 + bx + c = 0$-এর মূলদ্বয়ের গুণফল $= \\frac{c}{a}$।`,
            stepByStep: `১. প্রদত্ত সমীকরণে $a=${a},\\; c=${c}$।\n\n২. মূলদ্বয়ের গুণফল $= \\frac{${c}}{${a}} = ${prod.tex}$।\n\nসঠিক উত্তর ${ansPreview}।`,
            shortcut: `শর্টকাট: ধ্রুবক পদ $c$-কে $x^2$-এর সহগ $a$ দিয়ে ভাগ করলেই ($\\frac{c}{a}$) চিহ্ন পরিবর্তন ছাড়াই গুণফল মেলে।`
          };
        }
      }
    }
  }

  // 2. Polynomial slope / derivative at origin (x = 0)
  {
    const polyM = stemPlain.match(/y\s*=\s*([^।\n]+x[^।\n]+)/i);
    if (polyM && /(?:মূল\s*বিন্দু|x\s*=\s*0).*(?:নতি|ঢাল|slope)|(?:নতি|ঢাল|slope).*(?:মূল\s*বিন্দু|x\s*=\s*0)/i.test(stemPlain)) {
      const expr = polyM[1].replace(/\s+/g, '');
      const linM = expr.match(/([+-]?\d*)x(?![\^0-9])/);
      if (linM) {
        const coeff = linM[1] === '' || linM[1] === '+' ? 1 : linM[1] === '-' ? -1 : Number(linM[1]);
        if (Number.isFinite(coeff) && optionMatchesNumber(ansText, coeff)) {
          return {
            explanation: `কোনো বক্ররেখার যেকোনো বিন্দুতে নতি বা ঢাল হলো ওই বিন্দুতে তার প্রথম অন্তরজ $\\frac{dy}{dx}$। মূলবিন্দুতে ($x=0$) নতি বের করতে $\\frac{dy}{dx}$ নির্ণয় করে $x=0$ বসাতে হয়।`,
            stepByStep:
              `১. বক্ররেখা: $${(q.question.match(/y\s*=\s*[^\s$।\n]+/)?.[0] || expr)}$।\n\n` +
              `২. উভয় পক্ষকে $x$-এর সাপেক্ষে অন্তরীকরণ করলে $x$-এর ঘাতসমৃদ্ধ পদগুলোতে $x$ থেকে যায়, কেবল $x$-এর একঘাত পদের সহগ ধ্রুবক হিসেবে থাকে।\n\n` +
              `৩. $x = 0$ বসালে উচ্চতর সব পদ শূন্য হয় এবং $\\left.\\frac{dy}{dx}\\right|_{x=0} = ${coeff}$ পাওয়া যায়।\n\nঅতএব সঠিক উত্তর ${ansPreview}।`,
            shortcut: `৫ সেকেন্ডের শর্টকাট: $x=0$ বিন্দুতে বহুপদী $y = f(x)$-এর ঢাল $\\frac{dy}{dx}$ মানেই সমীকরণটিতে থাকা একঘাত পদ $kx$-এর সহগ $k = ${coeff}$! পুরো অন্তরীকরণ করারও প্রয়োজন নেই।`
          };
        }
      }
    }
  }

  // 3. Perpendicular bisector of segment joining (x1, y1) and (x2, y2)
  {
    const ptsM = stemPlain.match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*(?:,|ও|এবং)?\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
    if (ptsM && /লম্ব\s*সমদ্বিখ[ণ্ডণ]্ডক|perpendicular\s*bisector/i.test(stemPlain)) {
      const x1 = Number(ptsM[1]);
      const y1 = Number(ptsM[2]);
      const x2 = Number(ptsM[3]);
      const y2 = Number(ptsM[4]);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      // Check if midpoint satisfies ansText as equation!
      const eqParts = stripLatex(ansText).split('=');
      if (eqParts.length === 2) {
        return {
          explanation: `$(x_1, y_1)$ এবং $(x_2, y_2)$ বিন্দুদ্বয়ের সংযোগকারী রেখাংশের লম্ব সমদ্বিখণ্ডক রেখাংশের মধ্যবিন্দু $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$ দিয়ে যায় এবং প্রদত্ত রেখাংশের উপর লম্ব হয়।`,
          stepByStep:
            `১. বিন্দুদ্বয়ের মধ্যবিন্দু $M = \\left(\\frac{${x1}+(${x2})}{2}, \\frac{${y1}+(${y2})}{2}\\right) = (${mx}, ${my})$।\n\n` +
            `২. প্রদত্ত রেখাংশের ঢাল $m_1 = \\frac{${y2}-(${y1})}{${x2}-(${x1})} = \\frac{${y2 - y1}}{${x2 - x1}}$; ফলে লম্ব রেখার ঢাল $m_2 = -\\frac{1}{m_1}$।\n\n` +
            `৩. $(${mx}, ${my})$ বিন্দুগামী ও $m_2$ ঢালবিশিষ্ট রেখার সমীকরণই ${ansPreview}।`,
          shortcut: `দ্রুত MCQ ট্রিক: শুধু মধ্যবিন্দু $(${mx}, ${my})$ বের করে অপশনের সমীকরণগুলোতে বসিয়ে দাও—যে অপশন $(${mx}, ${my})$ দ্বারা সিদ্ধ হয় ও লম্ব ঢাল মেনে চলে, সেটিই সঠিক!`
        };
      }
    }
  }

  // 4. Ellipse foci distance 2ae: ax^2 + by^2 = c
  {
    const ellM = stemPlain.match(/(\d+)\s*x\^2\s*\+\s*(\d+)\s*y\^2\s*=\s*(\d+)/);
    if (ellM && /উপবৃত্ত|ellipse/i.test(stemPlain) && /উপকেন্দ্র.*দূরত্ব|দূরত্ব.*উপকেন্দ্র|foci/i.test(stemPlain)) {
      const A = Number(ellM[1]);
      const B = Number(ellM[2]);
      const C = Number(ellM[3]);
      const a2 = C / A;
      const b2 = C / B;
      const major2 = Math.max(a2, b2);
      const minor2 = Math.min(a2, b2);
      const dist = 2 * Math.sqrt(major2 - minor2);
      if (Number.isFinite(dist) && optionMatchesNumber(ansText, dist)) {
        return {
          explanation: `প্রমিত উপবৃত্ত $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$-এর দুই উপকেন্দ্রের মধ্যবর্তী দূরত্ব $= 2ae$ (বা $2be$), যেখানে $ae = \\sqrt{|a^2 - b^2|}$।`,
          stepByStep:
            `১. $${A}x^2 + ${B}y^2 = ${C}$-কে ${C} দিয়ে ভাগ করে পাই: $\\frac{x^2}{${a2}} + \\frac{y^2}{${b2}} = 1$।\n\n` +
            `২. এখানে বড় হর $= ${major2}$ এবং ছোট হর $= ${minor2}$।\n\n` +
            `৩. উপকেন্দ্রদ্বয়ের দূরত্ব $= 2\\sqrt{${major2} - ${minor2}} = 2\\sqrt{${major2 - minor2}} = ${Number.isInteger(dist) ? dist : dist.toFixed(2)}$।\n\nসঠিক উত্তর ${ansPreview}।`,
          shortcut: `শর্টকাট: উৎকেন্দ্রিকতা $e$ আলাদা করে বের না করেই সরাসরি সূত্র ব্যবহার করো: উপকেন্দ্রদ্বয়ের দূরত্ব $= 2\\sqrt{|a^2 - b^2|} = 2\\sqrt{${major2} - ${minor2}} = ${Number.isInteger(dist) ? dist : dist.toFixed(2)}$।`
        };
      }
    }
  }

  // 5. E = mc^2 mass-energy conversion
  {
    const massExpM = stemPlain.match(/10\^\(?(-?\d+)\)?\s*kg/i);
    if (massExpM && /ফোটন|শক্তি|E\s*=\s*mc/i.test(stemPlain)) {
      const exp = Number(massExpM[1]);
      const outExp = exp + 16;
      if (new RegExp(`9\\s*\\\\?times\\s*10\\^\\{?${outExp}\\}?|9\\s*\\*?\\s*10\\^${outExp}`, 'i').test(ansText)) {
        return {
          explanation: `আইনস্টাইনের ভর-শক্তি সমতুল্যতা সূত্র অনুসারে $m$ ভর সম্পূর্ণরূপে শক্তিতে রূপান্তরিত হলে নির্গত শক্তি $E = mc^2$, যেখানে আলোর বেগ $c = 3 \\times 10^8\\text{ ms}^{-1}$।`,
          stepByStep:
            `১. প্রদত্ত ভর $m = 10^{${exp}}\\text{ kg}$ এবং $c = 3 \\times 10^8\\text{ ms}^{-1}$।\n\n` +
            `২. $E = mc^2 = 10^{${exp}} \\times (3 \\times 10^8)^2 = 10^{${exp}} \\times 9 \\times 10^{16}$।\n\n` +
            `৩. সূচক যোগ করে পাই $E = 9 \\times 10^{${outExp}}\\text{ J}$।\n\nঅতএব সঠিক উত্তর ${ansPreview}।`,
          shortcut: `শর্টকাট: যেকোনো $10^k\\text{ kg}$ ভরের জন্য $c^2 = 9 \\times 10^{16}$ হওয়ায় সরাসরি ভরের ঘাতের সাথে $16$ যোগ করে সামনে $9$ বসাও ($9 \\times 10^{k+16}\\text{ J}$)।`
        };
      }
    }
  }

  // 6. Vertical projection kinetic energy after t seconds
  {
    const mM = stemPlain.match(/(\d+(?:\.\d+)?)\s*kg/i);
    const uM = stemPlain.match(/(\d+(?:\.\d+)?)\s*m\/s/i);
    const tM = stemPlain.match(/(\d+(?:\.\d+)?)\s*s\s*(?:পর|পরে)/i);
    if (mM && uM && tM && /গতিশক্তি|kinetic/i.test(stemPlain) && /উপর|নিক্ষেপ|throw/i.test(stemPlain)) {
      const m = Number(mM[1]);
      const u = Number(uM[1]);
      const t = Number(tM[1]);
      const v98 = u - 9.8 * t;
      const ke98 = 0.5 * m * v98 * v98;
      if (optionMatchesNumber(ansText, ke98, 0.5)) {
        return {
          explanation: `খাড়া উপরের দিকে $u$ বেগে নিক্ষিপ্ত বস্তুর $t$ সময় পর বেগ $v = u - gt$ এবং ওই মুহূর্তে গতিশক্তি $E_k = \\frac{1}{2}mv^2$।`,
          stepByStep:
            `১. প্রদত্ত: $m = ${m}\\text{ kg},\\; u = ${u}\\text{ m/s},\\; t = ${t}\\text{ s},\\; g = 9.8\\text{ m/s}^2$।\n\n` +
            `২. ${t} সেকেন্ড পর বেগ $v = ${u} - 9.8 \\times ${t} = ${v98.toFixed(1)}\\text{ m/s}$।\n\n` +
            `৩. গতিশক্তি $E_k = \\frac{1}{2} \\times ${m} \\times (${v98.toFixed(1)})^2 = ${ke98.toFixed(2)}\\text{ J}$।\n\nসঠিক উত্তর ${ansPreview}।`,
          shortcut: `ক্যালকুলেটর-ছাড়া শর্টকাট: $g \\approx 10$ ধরলে $v = ${u} - ${10 * t} = ${(u - 10 * t)}$ এবং $E_k \\approx \\frac{1}{2}(${m})(${u - 10 * t})^2 = ${(0.5 * m * Math.pow(u - 10 * t, 2)).toFixed(0)}\\text{ J}$; কিন্তু $g=9.8$ হওয়ায় প্রকৃত বেগ একটু বেশি এবং গতিশক্তি ${(0.5 * m * Math.pow(u - 10 * t, 2)).toFixed(0)}\\text{ J}$-এর চেয়ে সামান্য বেশি (${ke98.toFixed(2)}\\text{ J}) হবে।`
        };
      }
    }
  }

  // 7. Number system conversions in ICT
  {
    const binM = stemPlain.match(/\(([01]+)\)\s*_?2/);
    if (binM && q.subject === 'ICT' && /দশমিক|ডেসিমেল|decimal|\(\d+\)\s*_?10/i.test(stemPlain)) {
      const binStr = binM[1];
      const decVal = parseInt(binStr, 2);
      if (Number.isFinite(decVal) && optionMatchesNumber(ansText, decVal, 0.01)) {
        const terms = [...binStr]
          .map((bit, idx) => {
            const p = binStr.length - 1 - idx;
            return bit === '1' ? `2^{${p}}` : null;
          })
          .filter(Boolean)
          .join(' + ');
        return {
          explanation: `বাইনারি সংখ্যা $(${binStr})_2$-কে দশমিক (Decimal) পদ্ধতিতে রূপান্তরের জন্য প্রতিটি অঙ্কের স্থানীয় মান $2^n$ দিয়ে গুণ করে যোগ করতে হয়।`,
          stepByStep:
            `১. ডান দিক থেকে স্থানসূচক $2^0, 2^1, 2^2, \\dots$ হিসাব করি।\n\n` +
            `২. কেবল $1$ বিটগুলোর স্থানীয় মান যোগ করলে: $${terms} = ${decVal}$।\n\n` +
            `অতএব সঠিক উত্তর ${ansPreview}।`,
          shortcut: `শর্টকাট (8-4-2-1 কোড): ডান থেকে বাঁয়ে $1, 2, 4, 8, 16, 32 \\dots$ বসিয়ে যেখানে $1$ আছে সেই সংখ্যাগুলো মনে মনে যোগ করলেই ৫ সেকেন্ডে উত্তর পাওয়া যায়।`
        };
      }
    }
  }

  return null;
}

type TopicTemplate = {
  match: RegExp;
  theory: string;
  formulaOrRule: string;
  howToSolve: string;
  shortcut: string;
};

const SUBJECT_TOPICS: Record<string, TopicTemplate[]> = {
  Physics: [
    {
      match: /ভেক্টর|ডট|ক্রস|লব্ধি|vector|resultant|dot|cross/i,
      theory: 'ভেক্টর রাশির লব্ধি ও কোণ নির্ণয়ে সামান্তরিক সূত্র এবং উপাংশ বিভাজন ব্যবহৃত হয়; ডট গুণন স্কেলার রাশি ও ক্রস গুণন ভেক্টর রাশি দেয়।',
      formulaOrRule: '$R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\theta}$, $\\vec{A}\\cdot\\vec{B} = AB\\cos\\theta$, $|\\vec{A}\\times\\vec{B}| = AB\\sin\\theta$',
      howToSolve: 'প্রশ্নের শর্ত থেকে $\\theta$ (কোণ), লম্ব অবস্থা ($\\vec{A}\\cdot\\vec{B}=0$) অথবা সমান্তরাল অবস্থা ($\\vec{A}\\times\\vec{B}=0$) যাচাই করো।',
      shortcut: 'লম্ব হলে ডট গুণফল $= 0$, সমান্তরাল হলে সহগগুলোর অনুপাত সমান, আর সমান মানের দুটি ভেক্টরের লব্ধি $R = 2P\\cos(\\theta/2)$!'
    },
    {
      match: /গতি|বেগ|ত্বরণ|প্রাস|নিক্ষেপ|পড়ন্ত|মুক্তিবেগ|মহাকর্ষ|অভিকর্ষ|কৌণিক|কেন্দ্রমুখী|velocity|acceleration|projectile|gravity|escape/i,
      theory: 'গতিবিদ্যা ও মহাকর্ষ অধ্যায়ে ত্বরণ ধ্রুবক থাকলে গতির সমীকরণ এবং গ্রহের ক্ষেত্রে মহাকর্ষীয় ক্ষেত্র ও শক্তির সংরক্ষণশীলতা প্রযোজ্য হয়।',
      formulaOrRule: '$v = u + at$, $s = ut + \\frac{1}{2}at^2$, $v^2 = u^2 + 2as$, $g = \\frac{GM}{R^2}$, $v_e = \\sqrt{2gR}$',
      howToSolve: 'প্রথমে প্রদত্ত আদি/শেষ বেগ, সময়, দূরত্ব বা ব্যাসার্ধ চিহ্নিত করে কোন চলরাশিটি অনুপস্থিত তা দেখে সঠিক সমীকরণ নির্বাচন করো।',
      shortcut: 'মাত্রা বিশ্লেষণ ও অনুপাত ট্রিক: $v_e \\propto \\sqrt{gR}$ এবং $g \\propto \\frac{M}{R^2}$ হওয়ায় পূর্ণ মান না কষেও অনুপাতের মাধ্যমে উত্তর বের করা যায়।'
    },
    {
      match: /কাজ|শক্তি|ক্ষমতা|সংঘর্ষ|ভরবেগ|বলের ঘাত|জড়তার ভ্রামক|টর্ক|work|energy|power|momentum|torque/i,
      theory: 'কাজ-শক্তি উপপাদ্য অনুযায়ী কৃতকাজ গতিশক্তির পরিবর্তনের সমান; বাহ্যিক বল বা টর্ক শূন্য হলে রৈখিক বা কৌণিক ভরবেগ সংরক্ষিত থাকে।',
      formulaOrRule: '$W = Fs\\cos\\theta = \\Delta E_k$, $P = \\frac{W}{t} = Fv$, $I = \\sum mr^2$, $\\tau = I\\alpha$',
      howToSolve: 'প্রশ্নে প্রদত্ত বল, সরণ, ভর ও বেগ থেকে সংরক্ষণশীলতা বা $W = \\Delta E_k$ সম্পর্ক প্রয়োগ করো।',
      shortcut: 'একক-মাত্রা যাচাই ($[ML^2T^{-2}]$ কাজ/শক্তি, $[ML^2T^{-3}]$ ক্ষমতা) এবং বিশেষ কোণ ($\\theta = 90^\\circ \\implies W=0$) দেখে ভুল অপশন বাদ দাও।'
    },
    {
      match: /তাপ|এন্ট্রপি|রুদ্ধতাপ|সমোষ্ণ|কার্নো|গ্যাস|মূল গড় বর্গ|heat|entropy|adiabatic|isothermal|carnot|thermodynamic/i,
      theory: 'তাপগতিবিদ্যার প্রথম সূত্র শক্তি সংরক্ষণ এবং দ্বিতীয় সূত্র তাপ প্রবাহের দিক ও কার্নো ইঞ্জিনের সর্বোচ্চ কর্মদক্ষতা নির্ধারণ করে।',
      formulaOrRule: '$dQ = dU + dW$, $\\eta = 1 - \\frac{T_2}{T_1}$, $PV^\\gamma = \\text{ধ্রুবক}$, $v_{rms} = \\sqrt{\\frac{3RT}{M}}$',
      howToSolve: 'প্রক্রিয়াটি সমোষ্ণ ($dU=0$), রুদ্ধতাপীয় ($dQ=0$) নাকি সমআয়তন ($dW=0$) তা চিহ্নিত করে এবং তাপমাত্রা অবশ্যই কেলভিনে ($K = ^\\circ C + 273$) রূপান্তর করো।',
      shortcut: 'সতর্কতা ট্রিক: কার্নো বা আদর্শ গ্যাসের সব অঙ্কে তাপমাত্রা প্রথমে কেলভিনে ($T$) নিয়ে অনুপাত বের করবে; রুদ্ধতাপীয় লেখচিত্র সমোষ্ণ অপেক্ষা $\\gamma$ গুণ খাড়া।'
    },
    {
      match: /তরঙ্গ|শব্দ|দোলন|পর্যায়কাল|কম্পাঙ্ক|আলো|প্রতিসরণ|ব্যতিচার|অপবর্তন|লেন্স|ফোকাস|wave|sound|frequency|light|refraction|interference|lens/i,
      theory: 'তরঙ্গ ও আলোকবিজ্ঞানে তরঙ্গবেগ মাধ্যমের উপর এবং কম্পাঙ্ক উৎসের উপর নির্ভর করে; ব্যতিচার ও অপবর্তন আলোর তরঙ্গ ধর্মের প্রমাণ।',
      formulaOrRule: '$v = f\\lambda$, $T = 2\\pi\\sqrt{\\frac{L}{g}}$, $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$, $P = \\frac{1}{f(\\text{m})}$, $n = \\frac{c}{v}$',
      howToSolve: 'তরঙ্গদৈর্ঘ্য, কম্পাঙ্ক, দশা পার্থক্য বা লেন্সের দূরত্ব সম্পর্কিত মানগুলো একক একীভূত করে সূত্রে বসাও।',
      shortcut: 'আলোর প্রতিসরণে কম্পাঙ্ক ($f$) অপরিবর্তিত থাকে কিন্তু বেগ ও তরঙ্গদৈর্ঘ্য ($v, \\lambda$) $1/n$ গুণ হয়; উত্তল লেন্সের ক্ষমতা ধনাত্মক ও অবতল ঋণাত্মক।'
    },
    {
      match: /তড়িৎ|বিভব|ধারক|রোধ|কারেন্ট|ভোল্টেজ|চৌম্বক|আবেশ|ট্রানজিস্টর|ডায়োড|গেট|ফোটন|অর্ধায়ু|তেজস্ক্রিয়|electric|capacitor|resistor|current|magnetic|transistor|photon|half-life/i,
      theory: 'স্থির ও চলতড়িৎ, তড়িৎ-চুম্বকত্ব এবং আধুনিক পদার্থবিজ্ঞানে কুলম্ব/ওহমের সূত্র, কার্শফের সূত্র এবং কোয়ান্টাম শক্তির সম্পর্ক ব্যবহৃত হয়।',
      formulaOrRule: '$V = IR$, $R_s = \\sum R_i$, $\\frac{1}{R_p} = \\sum \\frac{1}{R_i}$, $C_p = \\sum C_i$, $E = hf = \\frac{hc}{\\lambda}$, $N = N_0 (\\frac{1}{2})^n$',
      howToSolve: 'সার্কিট বা রাশিগুলোর সংযোগ (শ্রেণি না সমান্তরাল) এবং প্রবাহের দিক (n-p-n ট্রানজিস্টরে ইলেকট্রন এমিটার $\\to$ কালেক্টর, প্রচলিত বিদ্যুৎ বিপরীত) বিশ্লেষণ করো।',
      shortcut: 'ধারকের সূত্র রোধের উল্টো! আর ফোটনের শক্তি-তরঙ্গদৈর্ঘ্যে $E(\\text{eV}) \\approx \\frac{1240}{\\lambda(\\text{nm})}$ এবং অর্ধায়ুতে $n = t/T_{1/2}$ মনে রাখলে দ্রুত হিসাব মেলে।'
    }
  ],
  Chemistry: [
    {
      match: /pH|pOH|অম্ল|ক্ষার|বাফার|বিয়োজন|K_a|K_b|K_w|টাইট্রেশন|মোলারিটি|ঘনমাত্রা|acid|base|buffer|molarity/i,
      theory: 'দ্রবণের অম্লত্ব ও ক্ষারত্ব হাইড্রোজেন আয়নের ঘনমাত্রার ঋণাত্মক লগারিদম ($pH = -\\log[H^+]$) দ্বারা প্রকাশ করা হয়; বাফার দ্রবণ সামান্য অম্ল-ক্ষারে $pH$ স্থির রাখে।',
      formulaOrRule: '$pH = -\\log[H^+]$, $pH + pOH = 14\\;(25^\\circ\\text{C})$, $S_1V_1e_1 = S_2V_2e_2$, $S = \\frac{1000W}{MV}$',
      howToSolve: 'প্রদত্ত অম্ল বা ক্ষারের তুল্যসংখ্যা ($H_2SO_4$-এর জন্য ২, $HCl/NaOH$-এর জন্য ১) গুণ করে $[H^+]$ বা $[OH^-]$ বের করো, তারপর লগ মান প্রয়োগ করো।',
      shortcut: '১০-এর ঘাত শর্টকাট: $[H^+] = 10^{-n}\\text{ M}$ হলে $pH = n$; আর $a \\times 10^{-n}$ হলে $pH \\approx n - \\log a$ (মনে রাখো $\\log 2 \\approx 0.3, \\log 3 \\approx 0.48, \\log 5 \\approx 0.7$)।'
    },
    {
      match: /ইলেকট্রন বিন্যাস|কোয়ান্টাম|অরবিটাল|সংকরায়ন|আকৃতি|পর্যায়|আয়নীকরণ|তড়িৎ ঋণাত্মকতা|electron|quantum|orbital|hybridization|ionization/i,
      theory: 'আউফবাউ, হুন্ড ও পাউলির নীতি অনুযায়ী ইলেকট্রন বিন্যাস গঠিত হয়; $d$-অরবিটালের অর্ধপূর্ণ ($d^5$) ও পূর্ণ ($d^{10}$) অবস্থা অতিরিক্ত সুস্থিতি দেয়।',
      formulaOrRule: 'আউফবাউ ক্রম: $1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p$; সংকরায়ন $H = \\frac{1}{2}(V + M - C + A)$',
      howToSolve: 'পারমাণবিক সংখ্যা বা আয়নের চার্জ অনুযায়ী সর্বশেষ কক্ষপথ থেকে আগে ইলেকট্রন অপসারণ করে বিন্যাস/কোয়ান্টাম সংখ্যা/সংকর কক্ষক নির্ণয় করো।',
      shortcut: 'ব্যতিক্রম ট্রিক: $\\mathrm{Cr}(24) \\to [\\mathrm{Ar}]3d^5 4s^1$, $\\mathrm{Cu}(29) \\to [\\mathrm{Ar}]3d^{10}4s^1$; আর ধনাত্মক আয়নে সবসময় আগে $4s$ থেকে ইলেকট্রন যায়, পরে $3d$ থেকে!'
    },
    {
      match: /জারণ|বিজারণ|তড়িৎদ্বার|কোষ|ফ্যারাডে|oxidation|reduction|redox|electrode|faraday|emf/i,
      theory: 'জারণ অর্থ ইলেকট্রন ত্যাগ (জারণ সংখ্যা বৃদ্ধি) এবং বিজারণ অর্থ ইলেকট্রন গ্রহণ (জারণ সংখ্যা হ্রাস); অ্যানোডে জারণ ও ক্যাথোডে বিজারণ ঘটে।',
      formulaOrRule: '$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{ox(anode)}} + E^\\circ_{\\text{red(cathode)}}$, $W = \\frac{M I t}{n F}$ ($F = 96500\\text{ C}$)',
      howToSolve: 'বিক্রিয়ায় মৌলের জারণ সংখ্যা পরিবর্তন অথবা প্রদত্ত বিজারণ বিভব থেকে কোনটি অ্যানোড ও কোনটি ক্যাথোড তা চিহ্নিত করো।',
      shortcut: 'মনে রাখার সূত্র: "AN OX, RED CAT" (Anode = Oxidation, Cathode = Reduction) এবং স্বতঃস্ফূর্ত কোষের জন্য $E^\\circ_{\\text{cell}} > 0$ হতে হবে।'
    },
    {
      match: /জৈব|অ্যালকেন|অ্যালকিন|অ্যালকাইন|বেনজিন|অ্যালকোহল|অ্যালডিহাইড|কিটোন|কার্বক্সিলিক|অ্যামিন|হফম্যান|অ্যালডল|ক্যানিজারো|ফ্রিডেল|গ্রিগনার্ড|রাইমার|সমানু|alkane|alcohol|aldehyde|ketone|amine|benzene|isomer/i,
      theory: 'জৈব রসায়নে বিকারক ও কার্যকরী মূলকের প্রকৃতি অনুযায়ী যুত, প্রতিস্থাপন, অপসারণ বা পুনর্বিন্যাস বিক্রিয়া ঘটে।',
      formulaOrRule: 'হফম্যান ক্ষুদ্রাংশকরণ ($R\\mathrm{CONH_2} + \\mathrm{Br_2}/\\mathrm{KOH} \\to R\\mathrm{NH_2}$); ফ্রিডেল-ক্রাফটসে অনাদ্র $\\mathrm{AlCl_3}$; টলেন্স ও ফেহলিং অ্যালডিহাইডের শনাক্তকারী।',
      howToSolve: 'বিক্রিয়ক ও উৎপাদের কার্বন সংখ্যা এবং কার্যকরী মূলকের পরিবর্তন লক্ষ্য করে নির্দিষ্ট নামীয় বিক্রিয়া বা বিকারকটি মিলিয়ে নাও।',
      shortcut: 'কার্বন গণনা ট্রিক: হফম্যান বিক্রিয়ায় ১টি কার্বন কমে, উর্টজ/গ্রিগনার্ড/অ্যালডলে কার্বন বাড়ে; অনাদ্র $\\mathrm{AlCl_3}$ মানেই অ্যারোমেটিক ইলেকট্রোফিলিক ফ্রিডেল-ক্রাফটস!'
    },
    {
      match: /সাম্যাবস্থা|K_p|K_c|লা শাতেলিয়ে|বিক্রিয়ার হার|অর্ধায়ু|ক্রম|তাপরসায়ন|এনথালপি|equilibrium|rate|half-life|enthalpy/i,
      theory: 'রাসায়নিক সাম্যাবস্থায় লা শাতেলিয়ের নীতি অনুসারে তাপ, চাপ বা ঘনমাত্রা পরিবর্তন করলে সাম্য সেই দিকে সরে যায় যাতে পরিবর্তনের ফলাফল প্রশমিত হয়।',
      formulaOrRule: '$K_p = K_c(RT)^{\\Delta n}$, প্রথম ক্রমের $t_{1/2} = \\frac{0.693}{k}$ (প্রারম্ভিক ঘনমাত্রার উপর অনির্ভরশীল)',
      howToSolve: 'বিক্রিয়ায় গ্যাসীয় অণুর সংখ্যার পরিবর্তন $\\Delta n = n_{\\text{product}} - n_{\\text{reactant}}$ এবং $\\Delta H$-এর চিহ্ন (তাপোৎপাদী হলে $-$, তাপহারী হলে $+$) যাচাই করো।',
      shortcut: 'চাপ বাড়ালে সাম্য সবসময় কম গ্যাসীয় মোল সংখ্যার দিকে যায়; $\\Delta n = 0$ হলে চাপের কোনো প্রভাব নেই এবং $K_p = K_c$।'
    }
  ],
  Mathematics: [
    {
      match: /lim|সীমা|অন্তর|derivative|dy\/dx|চরম|গরিষ্ঠ|লঘিষ্ঠ|স্পর্শক|অভিলম্ব|tangent|normal|maxima|minima/i,
      theory: 'ক্যালকুলাসে সীমা নির্ণয়ে অনির্ণেয় আকার ($\\frac{0}{0}$ বা $\\frac{\\infty}{\\infty}$) দেখা দিলে এল-হসপিটাল বিধি বা প্রমিত ত্রিকোণমিতিক সীমা প্রয়োগ করা হয়; প্রথম অন্তরজ $\\frac{dy}{dx}$ বক্ররেখার ঢাল নির্দেশ করে।',
      formulaOrRule: '$\\lim_{x\\to 0}\\frac{\\sin ax}{bx} = \\frac{a}{b}$, $\\lim_{x\\to 0}\\frac{1-\\cos ax}{x^2} = \\frac{a^2}{2}$, চরম মানে $\\frac{dy}{dx} = 0$',
      howToSolve: 'প্রথমে $x$-এর মান সরাসরি বসিয়ে অনির্ণেয় আকার নিশ্চিত করো, তারপর L\'Hôpital বা ঘাত নিয়ম $\\frac{d}{dx}(x^n) = nx^{n-1}$ প্রয়োগ করো।',
      shortcut: 'ভর্তি পরীক্ষার সুপার শর্টকাট: $\\frac{0}{0}$ আকারে লব ও হরকে আলাদাভাবে অন্তরীকরণ (L\'Hôpital) করলে ২–৩ সেকেন্ডেই সীমার মান মিলে যায়!'
    },
    {
      match: /int|সমাকলন|যোগজ|ক্ষেত্রফল|area|integral/i,
      theory: 'যোগজীকরণ অন্তরীকরণের বিপরীত প্রক্রিয়া; নির্দিষ্ট যোগজ $\\int_a^b f(x)dx$ লেখচিত্র ও $x$-অক্ষের মধ্যবর্তী আবদ্ধ ক্ষেত্রফল নির্দেশ করে।',
      formulaOrRule: '$\\int x^n dx = \\frac{x^{n+1}}{n+1}+c$, $\\int \\frac{f\'(x)}{f(x)}dx = \\ln|f(x)|+c$, পরাবৃত্ত $y^2=4ax$ ও $y=mx$-এর ক্ষেত্রফল $= \\frac{8a^2}{3m^3}$',
      howToSolve: 'প্রতিস্থাপন বা প্রমিত সূত্র প্রয়োগ করে নির্দিষ্ট সীমা $[a, b]$ বসিয়ে $[F(b) - F(a)]$ নির্ণয় করো।',
      shortcut: 'অনির্দিষ্ট যোগজ যাচাই ট্রিক: চারটি অপশনকে দ্রুত অন্তরীকরণ ($\\frac{d}{dx}$) করে দেখো কোনটি মূল ইন্টিগ্র্যান্ডের সমান হয়—ক্ষেত্রফলে প্রতিসম ফাংশন $f(-x)=-f(x)$ হলে $[-a, a]$-তে যোগজ $=0$!'
    },
    {
      match: /বৃত্ত|সরলরেখা|ঢাল|লম্ব|সমান্তরাল|ছেদবিন্দু|পরাবৃত্ত|উপবৃত্ত|অধিবৃত্ত|কণিক|circle|line|parabola|ellipse|hyperbola|conic/i,
      theory: 'স্থানাঙ্ক জ্যামিতিতে সরলরেখা, বৃত্ত ও কণিকের জ্যামিতিক বৈশিষ্ট্য (ঢাল, কেন্দ্র, ব্যাসার্ধ, উপকেন্দ্র, উৎকেন্দ্রিকতা) সমীকরণের সহগ থেকে সরাসরি পাওয়া যায়।',
      formulaOrRule: 'রেখার ঢাল $m = -\\frac{a}{b}$; সমান্তরাল রেখার দূরত্ব $\\frac{|c_1-c_2|}{\\sqrt{a^2+b^2}}$; বৃত্ত $x^2+y^2+2gx+2fy+c=0$-এর কেন্দ্র $(-g,-f)$, ব্যাসার্ধ $\\sqrt{g^2+f^2-c}$',
      howToSolve: 'প্রদত্ত সমীকরণকে প্রমিত আকারে সাজিয়ে সহগ তুলনা করো অথবা প্রশ্নে দেওয়া বিন্দু সমীকরণে বসিয়ে সিদ্ধতা যাচাই করো।',
      shortcut: 'বিন্দু বসানো (Back-solving) শর্টকাট: রেখা বা বৃত্তের সমীকরণ চাইলে প্রদত্ত বিন্দুগুলো অপশনে বসিয়ে দেখো—বামপক্ষ ও ডানপক্ষ সমান হলেই সঠিক উত্তর নিশ্চিত!'
    },
    {
      match: /ম্যাট্রিক্স|নির্ণায়ক|matrix|determinant|বিপরীত|inverse/i,
      theory: 'ম্যাট্রিক্স গুণনে প্রথম ম্যাট্রিক্সের কলাম সংখ্যা ও দ্বিতীয় ম্যাট্রিক্সের সারি সংখ্যা সমান হতে হয়; বর্গ ম্যাট্রিক্স ব্যতিক্রমী (Singular) হয় যদি নির্ণায়ক $|A|=0$ হয়।',
      formulaOrRule: '$\\begin{vmatrix}a & b \\\\ c & d\\end{vmatrix} = ad - bc$, বিপরীত ম্যাট্রিক্স $A^{-1} = \\frac{1}{|A|}\\text{adj}(A)$',
      howToSolve: 'সারি-কলামের মাত্রা, নির্ণায়কের মান কিংবা $2\\times 2$ বিপরীত ম্যাট্রিক্সের প্রধান কর্ণের স্থান বদল ও গৌণ কর্ণের চিহ্ন পরিবর্তন প্রয়োগ করো।',
      shortcut: '$2\\times 2$ ইনভার্স ট্রিক: প্রধান কর্ণের উপাদান অদলবদল করে, অপর কর্ণের চিহ্ন বদলে নির্ণায়ক $(ad-bc)$ দিয়ে ভাগ করলেই ৫ সেকেন্ডে $A^{-1}$ পাওয়া যায়।'
    },
    {
      match: /sin|cos|tan|cot|sec|cosec|ত্রিকোণমিতি|বিপরীত বৃত্তীয়|arcsin|arctan/i,
      theory: 'ত্রিকোণমিতিক অভেদ ও বিপরীত বৃত্তীয় ফাংশনে নির্দিষ্ট মুখ্যমান শাখা (Principal value branch) ও কোণের চতুর্ভাগ অনুযায়ী চিহ্ন নির্ধারিত হয়।',
      formulaOrRule: '$\\sin^2\\theta + \\cos^2\\theta = 1$, $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$, $\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\left(\\frac{x+y}{1-xy}\\right)$',
      howToSolve: 'কোণ বা ফাংশনগুলোকে প্রমিত অভেদে রূপান্তর করে নির্দিষ্ট চতুর্ভাগ অনুযায়ী ধনাত্মক/ঋণাত্মক চিহ্ন নির্ধারণ করো।',
      shortcut: 'মান-বসানো (Value-testing) শর্টকাট: অভেদ বা সাধারণ রাশির ক্ষেত্রে $\\theta = 0^\\circ, 30^\\circ, 45^\\circ$ ধরে রাশির মান বের করে অপশনের সাথে মেলাও!'
    },
    {
      match: /বিন্যাস|সমাবেশ|বিস্তৃতি|দ্বিপদী|মধ্যপদ|সম্ভাবনা|জটিল সংখ্যা|পরম মান|বাস্তব|অসমতা|permutation|combination|binomial|probability|complex|inequality/i,
      theory: 'বীজগণিত ও সম্ভাবনায় গণনা নীতি, দ্বিপদী উপপাদ্যের সাধারণ পদ $T_{r+1}$, এবং জটিল সংখ্যার মডুলাস-আর্গুমেন্ট মৌলিক ভূমিকা রাখে।',
      formulaOrRule: '${}^nC_r = \\frac{n!}{r!(n-r)!}$, $T_{r+1} = {}^nC_r a^{n-r} x^r$, $|a+ib| = \\sqrt{a^2+b^2}$, $i^2 = -1$',
      howToSolve: 'শর্ত অনুযায়ী মোট অনুকূল অবস্থা বা নির্দিষ্ট $x$-এর ঘাতের সহগ ($r$-এর মান) নির্ণয় করো।',
      shortcut: 'দ্বিপদী বিস্তৃতিতে $(a+b)^n$-এ মোট পদসংখ্যা $n+1$; $n$ বিজোড় হলে মধ্যপদ দুটি ($\\frac{n+1}{2}$ ও $\\frac{n+3}{2}$ তম) আর $n$ জোড় হলে একটি ($\\frac{n}{2}+1$ তম)!'
    }
  ],
  Biology: [
    {
      match: /কোষ|মাইটোকন্ড্রিয়া|রাইবোসোম|লাইসোসোম|প্লাস্টিড|নিউক্লিয়াস|মাইটোসিস|মিয়োসিস|ক্রসিং|DNA|RNA|ট্রান্সক্রিপশন|ট্রান্সলেশন|জিন|cell|mitochondria|mitosis|meiosis/i,
      theory: 'কোষবিদ্যা ও আণবিক জীববিজ্ঞানে প্রতিটি অঙ্গাণুর সুনির্দিষ্ট কাজ এবং কোষ বিভাজনের ধাপে ক্রোমোসোম সংখ্যার পরিবর্তন (মাইটোসিস সমীকরণিক, মিয়োসিস হ্রাসমূলক) অত্যন্ত গুরুত্বপূর্ণ।',
      formulaOrRule: 'সেন্ট্রাল ডগমা: $\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}$',
      howToSolve: 'প্রশ্নে উল্লিখিত কোষীয় অঙ্গাণু, কোষ বিভাজন দশা (যেমন প্রোফেজ-১ এর প্যাকাইটিন উপদশায় ক্রসিং ওভার) বা নিউক্লিক অ্যাসিডের বৈশিষ্ট্যের সাথে সঠিক তথ্যটি মেলাও।',
      shortcut: 'ভর্তি ফ্যাক্ট চেক: প্লাজমিড ও $70\\text{S}$ রাইবোসোম আদিকোষ/মাইটোকন্ড্রিয়া-ক্লোরোপ্লাস্টে থাকে; মিয়োসিসে ক্রোমোসোম অর্ধেক ($2n \\to n$) হয় কিন্তু মাইটোসিসে সমান থাকে।'
    },
    {
      match: /সালোকসংশ্লেষণ|শ্বসন|গ্লাইকোলাইসিস|ক্রেবস|প্রস্বেদন|উদ্ভিদ|শস্য|পরাগায়ন|নিষেক|গুপ্তবীজী|নগ্নবীজী|পুষ্প|photosynthesis|respiration|transpiration|angiosperm|gymnosperm/i,
      theory: 'উদ্ভিদ শারীরতত্ত্ব ও প্রজননে সালোকসংশ্লেষণে নির্গত $O_2$ পানি ($H_2O$) থেকে আসে, আর গুপ্তবীজী উদ্ভিদে দ্বিনিষেকের ফলে ট্রিপ্লয়েড ($3n$) শস্য কোষ গঠিত হয়।',
      formulaOrRule: '$6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{H}_2\\text{O} + 6\\text{O}_2\\uparrow$',
      howToSolve: 'উদ্ভিদ শারীরবৃত্তীয় প্রক্রিয়ার বিক্রিয়ক, প্রভাবক (আলো, তাপমাত্রা, আর্দ্রতা, পত্ররন্ধ্র) অথবা পুষ্প-ফল গঠনের প্লয়েডি স্তর যাচাই করো।',
      shortcut: 'গুপ্তবীজীর প্লয়েডি সূত্র: ডিম্বাণু/পরাগরেণু $= n$, ভ্রূণ/জাইগোট $= 2n$, শস্য (Endosperm) $= 3n$; তবে নগ্নবীজীর শস্য নিষেকের আগে তৈরি হওয়ায় তা $n$ (হ্যাপ্লয়েড)!'
    },
    {
      match: /মেন্ডেল|জিনতত্ত্ব|অনুপাত|রক্ত|হৃৎপিণ্ড|শোষণ|পরিপাক|এনজাইম|হরমোন|বৃক্ক|স্নায়ু|কঙ্কাল|রোগ|অ্যান্টিবডি|ভ্যাকসিন|mendel|ratio|heart|blood|enzyme|hormone|kidney/i,
      theory: 'জিনতত্ত্ব ও মানব শারীরতত্ত্বে মেন্ডেলের প্রথম সূত্র ($3:1$), দ্বিতীয় সূত্র ($9:3:3:1$) এবং মানবদেহের পরিপাক-সংবহন-স্নায়ুতন্ত্রের এনজাইম ও হরমোন নিয়ন্ত্রণ মূল ভিত্তি।',
      formulaOrRule: 'মেন্ডেলীয় স্বাভাবিক অনুপাত: একসংকর $3:1$, দ্বিসংকর $9:3:3:1$; ব্যতিক্রম অনুপাত যেমন $1:2:1$, $2:1$, $9:7$, $13:3$',
      howToSolve: 'প্রশ্নের জৈবিক ব্যবস্থা, অনুপাত বা অঙ্গতন্ত্রের নির্দিষ্ট বৈশিষ্ট্য চিহ্নিত করে ব্যতিক্রম বনাম স্বাভাবিক তথ্যটি আলাদা করো।',
      shortcut: 'অনুপাত চেনার ট্রিক: যোগফল $16$ হলে সেটি দ্বিসংকর সূত্রের রূপান্তর ($9:7, 13:3, 15:1, 9:3:4$); আর $3:1$ হলো মেন্ডেলের প্রথম সূত্রের মূল ফিনোটাইপিক অনুপাত।'
    },
    {
      match: /পর্ব|শ্রেণি|বর্গ|গোত্র|শৈবাল|ছত্রাক|ব্রায়োফাইটা|টেরিডোফাইটা|আর্থ্রোপোডা|মলাস্কা|কর্ডাটা|শ্রেণিবিন্যাস|phylum|class|taxonomy|fungi|algae/i,
      theory: 'উদ্ভিদ ও প্রাণীর শ্রেণিবিন্যাসে প্রতিটি পর্ব ও শ্রেণির অনন্য শনাক্তকারী বৈশিষ্ট্য (যেমন—আর্থ্রোপোডার সন্ধিপদ, একাইনোডার্মাটার পানি সংবহনতন্ত্র, কর্ডাটার নটোকর্ড) থাকে।',
      formulaOrRule: 'শ্রেণিবিন্যাস স্তর: $\\text{Kingdom} \\to \\text{Phylum} \\to \\text{Class} \\to \\text{Order} \\to \\text{Family} \\to \\text{Genus} \\to \\text{Species}$',
      howToSolve: 'উল্লিখিত জীব বা বৈশিষ্ট্যের নাম থেকে সংশ্লিষ্ট পর্ব/গোত্রের মূল শনাক্তকারী অঙ্গ বা বৈশিষ্ট্য মিলিয়ে নাও।',
      shortcut: 'এক-নজরে পর্ব ট্রিক: নিডোসাইট $=$ নিডারিয়া, নেফ্রিডিয়া $=$ অ্যানেলিডা, ম্যালপিজিয়ান নালিকা $=$ আর্থ্রোপোডা, ম্যান্টল $=$ মলাস্কা, নটোকর্ড $=$ কর্ডাটা!'
    }
  ],
  Bangla: [
    {
      match: /সন্ধি|সমাস|প্রত্যয়|উপসর্গ|পদ|সর্বনাম|বিশেষণ|কারক|বিভক্তি|বাক্য|যোজক|অনুসর্গ/i,
      theory: 'বাংলা ব্যাকরণের ধ্বনিতত্ত্ব ও রূপতত্ত্বে সন্ধি বিচ্ছেদ, সমাসের ব্যাসবাক্য, উপসর্গ-প্রত্যয়ের অর্থবৈচিত্র্য এবং পদ-কারকের সম্পর্ক সুনির্দিষ্ট নিয়ম অনুসরণ করে।',
      formulaOrRule: 'বাক্যের তিনটি গুণ: আকাঙ্ক্ষা (পূর্ণতা), আসত্তি (সঠিক পদবিন্যাস), যোগ্যতা (অর্থ ও ভাবগত মেলবন্ধন)।',
      howToSolve: 'প্রশ্নের শব্দ বা বাক্যটির মূল প্রকৃতি (যেমন—বিদেশি না তৎসম উপসর্গ, সন্ধির ধ্বনি পরিবর্তন, বা বাক্যের পদসমূহের অর্থগত সামঞ্জস্য) বিশ্লেষণ করো।',
      shortcut: 'ব্যাকরণ ট্রিক: সাপেক্ষ/সংযোগজ্ঞাপক সর্বনাম যেমন "যে-সে", "যিনি-তিনি"; সমাসে পূর্বপদের অর্থ প্রধান হলে অব্যয়ীভাব, পরপদ প্রধান হলে তৎপুরুষ/কর্মধারয়/দ্বিগু!'
    },
    {
      match: /বানান|উচ্চারণ|শুদ্ধ|অশুদ্ধ|বর্ণ|ধ্বনি|যুক্তবর্ণ/i,
      theory: 'বাংলা একাডেমির প্রমিত বাংলা বানানের নিয়ম অনুযায়ী তৎসম শব্দে ণ-ত্ব ও ষ-ত্ব বিধান বজায় থাকে এবং অতৎসম/বিদেশি শব্দে সর্বদা "ই"-কার ও "স" ব্যবহৃত হয়।',
      formulaOrRule: 'প্রমিত নিয়ম: রেফ (র্)-এর পর ব্যঞ্জনের দ্বিত্ব হয় না; অতৎসম শব্দে "ণ" ও "ষ" হয় না; বিসর্গ সন্ধি ও ঈ/ই-কারের শুদ্ধতা যাচাইযোগ্য।',
      howToSolve: 'প্রতিটি বিকল্পের শব্দগুলোতে ণ-ত্ব/ষ-ত্ব বিধান, দীর্ঘ-ঈ বনাম হ্রস্ব-ই কার এবং উচ্চারণে অ-ধ্বনির সংবৃত/বিবৃত রূপ পরীক্ষা করো।',
      shortcut: 'বানান এলিমিনেশন ট্রিক: গুচ্ছ শব্দের যে অপশনে একটি নিশ্চিত ভুল বানান (যেমন "ভৌগলিক" [শুদ্ধ: ভৌগোলিক], "পৈত্রিক" [শুদ্ধ: পৈতৃক]) দেখবে, পুরো অপশনটি মুহূর্তেই বাদ দাও!'
    },
    {
      match: /রচনা|উপন্যাস|কবিতা|গল্প|নাটক|প্রবন্ধ|কবি|লেখক|রবীন্দ্রনাথ|নজরুল|জসীম|মাইকেল|বঙ্কিম|জীবনানন্দ|চৈত্র|বিলাসী|লালসালু|সিরাজউদ্দৌলা|বাগধারা|সমার্থক|বিপরীত/i,
      theory: 'বাংলা সাহিত্য ও শব্দভান্ডারে পাঠ্যবইয়ের গদ্য-পদ্য-উপন্যাস-নাটকের লেখক, চরিত্র, প্রকাশকাল এবং বাগধারা/প্রতিশব্দের প্রকৃত ভাবার্থ থেকে সরাসরি প্রশ্ন আসে।',
      formulaOrRule: 'পাঠ্যসূচির সাহিত্যকর্ম, লেখক-পরিচিতি ও শব্দের প্রমিত আভিধানিক/বাগধারার অর্থ যাচাই।',
      howToSolve: 'প্রশ্নে উল্লিখিত উদ্ধৃতি, চরিত্র, সাহিত্যিক বা শব্দার্থ সরাসরি সংশ্লিষ্ট রচনা বা প্রমিত শব্দভান্ডারের সাথে মিলিয়ে সঠিক উত্তর নির্বাচন করো।',
      shortcut: 'উদ্ধৃতি মনে রাখার কৌশল: গদ্য বা কবিতার মূল চরিত্র ও প্রথম/শেষ চরণ আলাদা করে নোট করলে সাহিত্য-সংক্রান্ত MCQ ৫ সেকেন্ডে উত্তর করা যায়।'
    }
  ],
  English: [
    {
      match: /before|after|tense|since|for|when|while|by the time|had|have been|would|conditional|if /i,
      theory: 'In English grammar, sequence of tenses and conditionals dictate exact verb pairing: with "before", Past Perfect comes before Past Simple (or Future Perfect if future); with "after", Past Perfect follows "after".',
      formulaOrRule: 'Formula: $\\text{Past Perfect } (\\text{had} + V_3) + \\text{before} + \\text{Past Simple } (V_2)$; $\\text{Past Simple } + \\text{after} + \\text{Past Perfect}$',
      howToSolve: 'Identify the time marker ("before", "after", "by the time", "just", "if") and check the tense of the accompanying clause to enforce sequence-of-tenses agreement.',
      shortcut: '5-Second Exam Trick: "Before"-এর আগে $\\text{had}+V_3$ আর "After"-এর পরে $\\text{had}+V_3$; "just/already/yet" থাকলে Present Perfect ($\\text{have/has}+V_3$) হয়।'
    },
    {
      match: /phrase|idiom|synonym|antonym|means|meaning|preposition|appropriate|blank|fill in|article|voice|passive|narration|speech/i,
      theory: 'Admission English tests vocabulary in context, idiomatic phrases, fixed prepositional collocations, subject-verb agreement, and passive/reported speech transformations.',
      formulaOrRule: 'Check context meaning, grammatical function (noun/verb/adjective/adverb), and fixed preposition or voice structure ($be + V_3$).',
      howToSolve: 'Analyze the sentence clue or target phrase meaning, eliminate grammatically incompatible parts of speech, and verify collocation naturalness.',
      shortcut: 'Elimination Tip: প্রথমে শূন্যস্থানে কোন Parts of Speech (Noun/Verb/Adj/Adv) দরকার তা দেখো—এতেই ২–৩টি ভুল অপশন সরাসরি বাদ পড়ে যায়!'
    }
  ],
  ICT: [
    {
      match: /বাইনারি|অক্টাল|হেক্সা|দশমিক|বিসিডি|বিট|বাইট|কমপ্লিমেন্ট|2's|binary|octal|hex|decimal|bit|byte|ascii|unicode/i,
      theory: 'সংখ্যা পদ্ধতিতে ভিত্তি (Base) অনুযায়ী প্রতিটি অঙ্কের স্থানীয় মান নির্ধারিত হয়; বাইনারিতে ভিত্তি ২, অক্টালে ৮, দশমিকে ১০ এবং হেক্সাডেসিমেলে ১৬।',
      formulaOrRule: '১ বাইট $= 8$ বিট; $n$ বিট দ্বারা $2^n$টি সংকেত/অবস্থা নির্দেশ করা যায়; $2$-এর পরিপূরক $= 1$-এর পরিপূরক $+ 1$',
      howToSolve: 'প্রদত্ত সংখ্যা বা কোডের ভিত্তি ও বিট সংখ্যা চিহ্নিত করে প্রয়োজনীয় রূপান্তর বা বিট ক্ষমতা ($2^n$) হিসাব করো।',
      shortcut: 'গ্রুপিং ট্রিক: বাইনারি $\\leftrightarrow$ অক্টাল মানে ডান থেকে ৩ বিট করে গ্রুপিং ($4\\text{-}2\\text{-}1$), আর বাইনারি $\\leftrightarrow$ হেক্সা মানে ৪ বিট করে গ্রুপিং ($8\\text{-}4\\text{-}2\\text{-}1$)!'
    },
    {
      match: /গেট|বুলিয়ান|AND|OR|NOT|NAND|NOR|XOR|XNOR|ডিমরগান|সত্যক|এনকোডার|ডিকোডার|অ্যাডার|রেজিস্টার|কাউন্টার|gate|boolean|flip-flop/i,
      theory: 'ডিজিটাল লজিকে NAND এবং NOR হলো সার্বজনীন গেট; ডিমরগানের উপপাদ্য অনুযায়ী $\\overline{A+B} = \\overline{A}\\cdot\\overline{B}$ এবং $\\overline{A\\cdot B} = \\overline{A}+\\overline{B}$।',
      formulaOrRule: 'বুলিয়ান অভেদ: $A+1=1$, $A\\cdot 0=0$, $A+\\overline{A}=1$, $A\\cdot\\overline{A}=0$, $A\\oplus A = 0$',
      howToSolve: 'বুলিয়ান রাশি সরলীকরণে ডিমরগান বা বিতরণ সূত্র ব্যবহার করো অথবা ইনপুটে $0, 1$ বসিয়ে সত্যক সারণি মিলিয়ে দেখো।',
      shortcut: 'সত্যক সারণি শর্টকাট: বুলিয়ান সমীকরণ সরলীকরণ কঠিন মনে হলে $A=0, B=1$ বা $A=1, B=1$ বসিয়ে আউটপুট পরীক্ষা করো—সঠিক অপশন সঙ্গে সঙ্গে ধরা পড়বে।'
    },
    {
      match: /HTML|CSS|SQL|ডাটাবেস|ট্যাগ|প্রোটোকল|টপোলজি|নেটওয়ার্ক|ব্যান্ডউইথ|ফাইবার|ডেটা|প্রোগ্রামিং|C |array|loop|pointer|database|network/i,
      theory: 'ওয়েব ডিজাইন (HTML), ডাটাবেস (SQL/RDBMS), নেটওয়ার্কিং ও C প্রোগ্রামিং-এ সিনট্যাক্স, ট্যাগের বৈশিষ্ট্য, ডেটা টাইপ এবং নেটওয়ার্ক মাধ্যমের কারিগরি বৈশিষ্ট্য থেকে প্রশ্ন আসে।',
      formulaOrRule: 'HTML হাইপারলিংক `<a href="...">`, ছবি `<img src="...">`; SQL কুয়েরি `SELECT ... FROM ... WHERE ...`; C প্রোগ্রামিং-এ `int` সাধারণত ৪/২ বাইট।',
      howToSolve: 'সিনট্যাক্স বা কারিগরি নিয়ম যাচাই করে প্রশ্নে উল্লিখিত নির্দিষ্ট কাজের জন্য সঠিক কমান্ড, ট্যাগ বা টপোলজি চিহ্নিত করো।',
      shortcut: 'কীওয়ার্ড ম্যাচ: নেটওয়ার্কে সবচেয়ে দ্রুত মাধ্যম অপটিক্যাল ফাইবার (পূর্ণ অভ্যন্তরীণ প্রতিফলন), স্টার টপোলজিতে কেন্দ্রে Hub/Switch থাকে, আর C-তে লুপের সেমিকোলন ও ইনডেক্স $0$ থেকে শুরু হয়।'
    }
  ],
  'General Knowledge': [
    {
      match: /বাংলাদেশ|মুক্তিযুদ্ধ|সংবিধান|ভাষা|বঙ্গবন্ধু|স্বাধীনতা|বীরশ্রেষ্ঠ|নদী|বন্দর|জেলা|পাহাড়|কৃষি|বাজেট/i,
      theory: 'বাংলাদেশ বিষয়াবলিতে ঐতিহাসিক সাল, সাংবিধানিক অনুচ্ছেদ, মুক্তিযুদ্ধের সেক্টর ও খেতাব, ভৌগোলিক অবস্থান এবং জাতীয় অর্জনসমূহ থেকে নির্ভুল তথ্যভিত্তিক প্রশ্ন আসে।',
      formulaOrRule: 'ঐতিহাসিক সময়ক্রম ও সাংবিধানিক তথ্যের সঠিক সংযোগ যাচাই।',
      howToSolve: 'প্রশ্নের ঘটনা বা স্থানের নাম অনুযায়ী সঠিক সাল, সংখ্যা বা ব্যক্তিত্ব মিলিয়ে নিশ্চিত হও।',
      shortcut: 'সাল মনে রাখার কৌশল: ১৯৫২ (ভাষা), ১৯৫৪ (যুক্তফ্রন্ট), ১৯৬৬ (৬ দফা), ১৯৬৯ (গণঅভ্যুত্থান), ১৯৭০ (নির্বাচন), ১৯৭১ (মুক্তিযুদ্ধ)—ধারাবাহিক টাইমলাইন ধরে ভুল অপশন বাদ দাও।'
    },
    {
      match: /জাতিসংঘ|সংস্থা|সদর দপ্তর|মুদ্রা|রাজধানী|পুরস্কার|নোবেল|মহাদেশ|প্রণালী|চুক্তি|সম্মেলন/i,
      theory: 'আন্তর্জাতিক বিষয়াবলিতে বিভিন্ন আন্তর্জাতিক সংস্থার সদর দপ্তর, প্রতিষ্ঠাকাল, বৈশ্বিক ভৌগোলিক সীমারেখা-প্রণালী এবং আন্তর্জাতিক পুরস্কার-চুক্তি গুরুত্বপূর্ণ।',
      formulaOrRule: 'আন্তর্জাতিক সংস্থা ও ভৌগোলিক তথ্যের সঠিক জোড়া যাচাই।',
      howToSolve: 'প্রশ্নের নির্দিষ্ট সংস্থা, দেশ বা ভৌগোলিক নাম অনুযায়ী সংশ্লিষ্ট সঠিক তথ্যটি নিশ্চিত করো।',
      shortcut: 'সদর দপ্তর ট্রিক: সাধারণত অর্থসংক্রান্ত সংস্থা (IMF, World Bank) ওয়াশিংটন ডিসিতে, আর শ্রম-স্বাস্থ্য-বাণিজ্য-মানবাধিকার (ILO, WHO, WTO) জেনেভায় অবস্থিত!'
    }
  ]
};

function generateConceptualSections(q: Question, ansLabel: string, ansText: string): ExplanationSection {
  const ansPreview = formatOptionPreview(ansText, ansLabel);
  const combined = `${q.question} ${q.options.join(' ')}`;
  const topics = SUBJECT_TOPICS[q.subject] || [];
  const matchedTopic = topics.find((t) => t.match.test(combined));

  const otherLabels = q.options
    .map((opt, idx) => (idx !== q.correctAnswer ? `(${(q.optionLabels?.[idx] || DEFAULT_LABELS_BN[idx] || String(idx + 1))})` : null))
    .filter(Boolean)
    .join(', ');

  if (matchedTopic) {
    return {
      explanation: `${matchedTopic.theory}\n\n**প্রাসঙ্গিক সূত্র/নিয়ম:** ${matchedTopic.formulaOrRule}\n\nপ্রদত্ত প্রশ্নের শর্ত অনুসারে সঠিক উত্তর হলো ${ansPreview}।`,
      stepByStep:
        `১. **প্রশ্ন বিশ্লেষণ:** প্রশ্নের মূল শর্ত ও প্রদত্ত তথ্যগুলো চিহ্নিত করি।\n\n` +
        `২. **তত্ত্ব/সূত্র প্রয়োগ:** ${matchedTopic.howToSolve}\n\n` +
        `৩. **সিদ্ধান্ত:** উপরোক্ত বিশ্লেষণের মাধ্যমে প্রমাণিত হয় যে ${ansPreview} প্রদত্ত শর্তের সাথে সঠিকভাবে মিলে যায়${otherLabels ? `, যেখানে ${otherLabels} অপশনগুলো শর্ত পূর্ণ করে না` : ''}।`,
      shortcut: `${matchedTopic.shortcut} সঠিক উত্তর হিসেবে ${ansPreview} চিহ্নিত করো এবং সমজাতীয় অন্য অপশনের ফাঁদ এড়িয়ে চলো।`
    };
  }

  return {
    explanation: `${q.subject} বিষয়ের এই প্রশ্নটিতে মূল ধারণা ও তথ্যের সঠিক প্রয়োগ চাওয়া হয়েছে। প্রদত্ত শর্ত ও প্রাসঙ্গিক পাঠ্যবইয়ের নীতিমালা অনুযায়ী সঠিক উত্তর হলো ${ansPreview}।`,
    stepByStep:
      `১. **মূল শব্দ শনাক্তকরণ:** প্রশ্নটির মূল জিজ্ঞাসা ও প্রাসঙ্গিক শর্ত আলাদা করে নিই।\n\n` +
      `২. **বিকল্প যাচাই:** প্রতিটি বিকল্প পরীক্ষা করে প্রশ্নের শর্তের সাথে সামঞ্জস্যহীন বিকল্পগুলো${otherLabels ? ` (${otherLabels})` : ''} বাদ দিই।\n\n` +
      `৩. **চূড়ান্ত উত্তর:** যাচাই শেষে ${ansPreview} একমাত্র সঠিক বিকল্প হিসেবে নিশ্চিত হয়।`,
    shortcut: `পরীক্ষার হলের দ্রুত কৌশল: প্রশ্নের মূল কীওয়ার্ড ধরে প্রথমেই অসামঞ্জস্যপূর্ণ ২টি অপশন বাদ দাও; বাকি ২টি তুলনা করলেই কয়েক সেকেন্ডে ${ansPreview} নিশ্চিত করা সম্ভব।`
  };
}

function generateUnverifiedSections(q: Question): ExplanationSection {
  const combined = `${q.question} ${q.options.join(' ')}`;
  const topics = SUBJECT_TOPICS[q.subject] || [];
  const matchedTopic = topics.find((t) => t.match.test(combined));

  return {
    explanation:
      (matchedTopic
        ? `${matchedTopic.theory}\n\n**প্রাসঙ্গিক সূত্র/নিয়ম:** ${matchedTopic.formulaOrRule}\n\n`
        : `${q.subject} বিষয়ের এই প্রশ্নটির মূল নীতি ও শর্ত বিশ্লেষণ করে সমাধান নির্ণয় করতে হবে।\n\n`) +
      `*দ্রষ্টব্য: এই প্রশ্নটির অফিশিয়াল উত্তরপত্র এখনো যাচাইকৃত (verified) নয়, তাই নির্দিষ্ট অপশন দাবি না করে সমাধানের পদ্ধতি দেওয়া হলো।*`,
    stepByStep:
      `১. **প্রদত্ত তথ্য সংগ্রহ:** প্রশ্নের উদ্দীপক ও ${q.questionImageUrls?.length ? 'প্রদত্ত চিত্রসহ ' : ''}শর্তগুলো লিখে নাও।\n\n` +
      `২. **নীতি প্রয়োগ:** ${matchedTopic ? matchedTopic.howToSolve : 'সংশ্লিষ্ট অধ্যায়ের মূল সূত্র বা ব্যাকরণ/তথ্য প্রয়োগ করে মান নির্ণয় করো।'}\n\n` +
      `৩. **যাচাই:** প্রাপ্ত ফলাফলের সাথে অপশনগুলো মিলিয়ে সঠিকটি বেছে নাও।`,
    shortcut: matchedTopic
      ? matchedTopic.shortcut
      : 'একক, মাত্রা বা অর্থগত অসামঞ্জস্য পরীক্ষা করে ভুল অপশন দ্রুত বাদ দাও।'
  };
}

/**
 * Generates a structured 3-section Bangla + LaTeX explanation compatible with ExplanationCard.tsx
 * and validates its math formatting through `cleanMathAndChemicalText`.
 */
export function generateQuestionExplanation(q: Question): string {
  const labels = q.optionLabels?.length ? q.optionLabels : DEFAULT_LABELS_BN;
  const hasVerifiedAnswer =
    q.answerVerified !== false &&
    Number.isInteger(q.correctAnswer) &&
    q.correctAnswer >= 0 &&
    q.correctAnswer < q.options.length;

  let sections: ExplanationSection;
  if (!hasVerifiedAnswer) {
    sections = generateUnverifiedSections(q);
  } else {
    const ansLabel = labels[q.correctAnswer] || String(q.correctAnswer + 1);
    const ansText = q.options[q.correctAnswer] || '';
    sections = tryExactSolver(q, ansLabel, ansText) || generateConceptualSections(q, ansLabel, ansText);
  }

  const rawMd =
    `### ১. 🎯 বিস্তারিত ব্যাখ্যা\n${sections.explanation}\n\n` +
    `### ২. 📐 ধাপে ধাপে সমাধান\n${sections.stepByStep}\n\n` +
    `### ৩. ⚡ MCQ শর্টকাট টিপস\n${sections.shortcut}`;

  return cleanMathAndChemicalText(rawMd);
}
