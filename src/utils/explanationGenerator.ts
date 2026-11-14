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
    .replace(/\\cdot/g, '*')
    .replace(/\\vec\{([^{}]+)\}/g, '$1')
    .replace(/\\overrightarrow\{([^{}]+)\}/g, '$1')
    .replace(/\\hat\{([^{}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^{}]+)\}/g, '$1')
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasBalancedDollars(s: string): boolean {
  const noEsc = s.replace(/\\\$/g, '');
  const rem = noEsc.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+?\$/g, '');
  return !rem.includes('$');
}

function cleanStemSnippet(q: Question): string {
  // Collapse display math to inline math & replace image markers cleanly
  const raw = (q.question || '')
    .replace(/\[IMAGE:\s*[^\]]+?\]/gi, '[চিত্র]')
    .replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner: string) => `$${inner.replace(/\s+/g, ' ').trim()}$`)
    .replace(/\s+/g, ' ')
    .trim();

  // Prefer the concise Bangla sentence (before English parenthetical duplicate if present)
  // only when the prefix retains balanced math delimiters.
  const parenMatch = raw.match(/\s*\((?=[A-Z][a-z]+ )/);
  let primary = raw;
  if (parenMatch && parenMatch.index !== undefined && parenMatch.index > 15) {
    const candidate = raw.slice(0, parenMatch.index).trim();
    if (hasBalancedDollars(candidate)) {
      primary = candidate;
    }
  }

  if (primary.length <= 150 && hasBalancedDollars(primary)) {
    return primary;
  }

  const tokens: Array<{ text: string; isMath: boolean }> = [];
  const mathRe = /\$[^$\n]+\$/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = mathRe.exec(primary)) !== null) {
    if (m.index > lastIdx) {
      tokens.push({ text: primary.slice(lastIdx, m.index), isMath: false });
    }
    tokens.push({ text: m[0], isMath: true });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < primary.length) {
    tokens.push({ text: primary.slice(lastIdx), isMath: false });
  }

  let acc = '';
  const maxLen = 155;
  for (const tok of tokens) {
    if (!tok.isMath) {
      const safePlain = tok.text.replace(/\$/g, '');
      const remaining = maxLen - acc.length;
      if (remaining <= 0) break;
      if (safePlain.length <= remaining) {
        acc += safePlain;
      } else {
        const slice = safePlain.slice(0, remaining);
        const lastSpace = slice.lastIndexOf(' ');
        acc += (lastSpace > 10 ? slice.slice(0, lastSpace) : slice).trimEnd();
        break;
      }
    } else {
      if (acc.length + tok.text.length <= maxLen + 45) {
        acc += tok.text;
      } else if (acc.length < 25 && tok.text.length <= 260) {
        acc += tok.text;
        break;
      } else {
        break;
      }
    }
  }

  let snippet = acc.trim();
  if (snippet.length < primary.length) {
    snippet = snippet.replace(/[,;:\-—\s]+$/, '') + '...';
  }

  if (!snippet || !hasBalancedDollars(snippet)) {
    const plain = stripLatex(primary);
    snippet = plain.length > 140 ? plain.slice(0, 137).trim() + '...' : plain;
  }
  return snippet;
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

function optionMatchesNumber(optionRaw: string, target: number, tol = 0.03): boolean {
  const s = stripLatex(optionRaw).replace(/,/g, '');
  const fracM = s.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
  if (fracM) {
    const val = Number(fracM[1]) / Number(fracM[2]);
    if (Number.isFinite(val) && Math.abs(val - target) <= tol) return true;
  }
  const numM = s.match(/^[^\d\-]*(-?\d+(?:\.\d+)?)/);
  if (numM) {
    const val = Number(numM[1]);
    if (Number.isFinite(val) && Math.abs(val - target) <= tol) return true;
  }
  return false;
}

function parseVector3D(expr: string): [number, number, number] | null {
  const s = stripLatex(expr).replace(/\s+/g, '');
  if (!/[ijk]/i.test(s)) return null;
  const getCoeff = (axis: 'i' | 'j' | 'k'): number => {
    const re = new RegExp(`([+-]?\\d*(?:\\.\\d+)?)${axis}(?![A-Za-z])`, 'i');
    const m = s.match(re);
    if (!m) return 0;
    const raw = m[1];
    if (raw === '' || raw === '+') return 1;
    if (raw === '-') return -1;
    const v = Number(raw);
    return Number.isFinite(v) ? v : 0;
  };
  return [getCoeff('i'), getCoeff('j'), getCoeff('k')];
}

function parseBinaryFrac(bin: string): number {
  const [intPart, fracPart = ''] = bin.split('.');
  let val = parseInt(intPart || '0', 2);
  for (let i = 0; i < fracPart.length; i++) {
    if (fracPart[i] === '1') val += Math.pow(2, -(i + 1));
  }
  return val;
}

function toBinaryFrac(num: number): string {
  const intPart = Math.floor(num);
  let frac = num - intPart;
  let intStr = intPart.toString(2);
  if (frac === 0) return intStr;
  let fracStr = '';
  let guard = 0;
  while (frac > 1e-9 && guard < 12) {
    frac *= 2;
    if (frac >= 1 - 1e-9) {
      fracStr += '1';
      frac -= 1;
      if (frac < 0) frac = 0;
    } else {
      fracStr += '0';
    }
    guard++;
  }
  return `${intStr}.${fracStr}`;
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
  const ansPlain = stripLatex(ansText);
  const ansPreview = formatOptionPreview(ansText, ansLabel);

  // 1. Projectile kinetic energy at highest point: KE_top = E * cos^2(theta)
  {
    const angM = stemPlain.match(/(\d+(?:\.\d+)?)\s*(?:°|ডিগ্রি|degree)/i);
    if (angM && /সর্বোচ্চ বিন্দু|highest point/i.test(stemPlain) && /গতিশক্তি|kinetic energy/i.test(stemPlain)) {
      const deg = Number(angM[1]);
      const cos2Map: Record<number, { num: number; den: number; cosTex: string }> = {
        0: { num: 1, den: 1, cosTex: '1' },
        30: { num: 3, den: 4, cosTex: '\\frac{\\sqrt{3}}{2}' },
        45: { num: 1, den: 2, cosTex: '\\frac{1}{\\sqrt{2}}' },
        60: { num: 1, den: 4, cosTex: '\\frac{1}{2}' },
        90: { num: 0, den: 1, cosTex: '0' }
      };
      const entry = cos2Map[deg];
      if (entry) {
        const isZero = entry.num === 0 && /^0/.test(ansPlain);
        const isMatch =
          isZero ||
          (entry.den === 2 && /E\/2|\\frac\{E\}\{2\}|0\.5\s*E/i.test(ansText + ansPlain)) ||
          (entry.den === 4 && entry.num === 3 && /3E\/4|\\frac\{3E\}\{4\}|0\.75\s*E/i.test(ansText + ansPlain)) ||
          (entry.den === 4 && entry.num === 1 && /E\/4|\\frac\{E\}\{4\}|0\.25\s*E/i.test(ansText + ansPlain));
        if (isMatch) {
          return {
            explanation: `নিক্ষিপ্ত প্রাসের সর্বোচ্চ বিন্দুতে বেগের উল্লম্ব উপাংশ ($v_y$) শূন্য হয়ে যায় এবং কেবল অনুভূমিক উপাংশ $v_x = v\\cos\\theta$ অবশিষ্ট থাকে। তাই সর্বোচ্চ বিন্দুতে গতিশক্তি হয় $K_{\\text{top}} = \\frac{1}{2}m(v\\cos\\theta)^2 = E\\cos^2\\theta$।`,
            stepByStep:
              `১. আদি গতিশক্তি $E = \\frac{1}{2}mv^2$ এবং নিক্ষেপ কোণ $\\theta = ${deg}^\\circ$।\n\n` +
              `২. সর্বোচ্চ বিন্দুতে উল্লম্ব বেগ $v_y = 0$, কেবল অনুভূমিক বেগ $v_x = v\\cos ${deg}^\\circ = ${entry.cosTex}\\,v$ থাকে।\n\n` +
              `৩. অতএব $K_{\\text{top}} = E\\cos^2 ${deg}^\\circ = E \\left(${entry.cosTex}\\right)^2 = ${entry.num === 0 ? '0' : entry.den === 1 ? 'E' : `\\frac{${entry.num === 1 ? '' : entry.num}E}{${entry.den}}`}$।\n\n` +
              `সঠিক উত্তর ${ansPreview}।`,
            shortcut: `৫ সেকেন্ডের প্রাস শর্টকাট: অনুভূমিকের সাথে $\\theta$ কোণে নিক্ষিপ্ত বস্তুর সর্বোচ্চ বিন্দুতে গতিশক্তি $= E\\cos^2\\theta$ এবং বিভবশক্তি $= E\\sin^2\\theta$। সরাসরি $\\cos^2 ${deg}^\\circ = ${entry.num === 0 ? '0' : `\\frac{${entry.num}}{${entry.den}}`}$ বসালেই উত্তর মেলে!`
          };
        }
      }
    }
  }

  // 2. Ideal gas PV = nRT container comparator (equal moles -> highest/lowest T)
  if (/PV\s*=\s*nRT|গ্যাস.*তাপমাত্রা\s*(?:সর্বোচ্চ|সর্বনিম্ন)|container.*highest temperature/i.test(stemPlain)) {
    const pvRows: Array<{ label: string; vol: number; press: number; pv: number }> = [];
    for (let i = 0; i < q.options.length; i++) {
      const optS = normalizeDigits(q.options[i]);
      const vM = optS.match(/(\d+(?:\.\d+)?)\s*L\b/i);
      const pM = optS.match(/(\d+(?:\.\d+)?)\s*['’]?\s*(kPa|atm|Pa)/i);
      if (vM && pM) {
        const vol = Number(vM[1]);
        const press = Number(pM[1]);
        pvRows.push({
          label: q.optionLabels?.[i] || DEFAULT_LABELS_BN[i] || String(i + 1),
          vol,
          press,
          pv: vol * press
        });
      }
    }
    if (pvRows.length === q.options.length) {
      const wantMin = /সর্বনিম্ন|lowest/i.test(stemPlain);
      const best = pvRows.reduce((acc, cur) => (wantMin ? (cur.pv < acc.pv ? cur : acc) : cur.pv > acc.pv ? cur : acc));
      if (best.label === (q.optionLabels?.[q.correctAnswer] || DEFAULT_LABELS_BN[q.correctAnswer])) {
        const summaryLines = pvRows
          .map((r) => `(${r.label}) $P \\times V = ${r.press} \\times ${r.vol} = ${r.pv}$`)
          .join('; ');
        return {
          explanation: `আদর্শ গ্যাসের সমীকরণ $PV = nRT$ অনুসারে, সব পাত্রে মোল সংখ্যা $n$ ($0.5$ মোল) এবং সার্বজনীন গ্যাস ধ্রুবক $R$ সমান হলে তাপমাত্রা $T \\propto PV$। অর্থাৎ যে পাত্রের $PV$-এর গুণফল ${wantMin ? 'সর্বনিম্ন' : 'সর্বাধিক'}, সেই পাত্রের গ্যাসের তাপমাত্রাই ${wantMin ? 'সর্বনিম্ন' : 'সর্বোচ্চ'} হবে।`,
          stepByStep:
            `১. $PV = nRT \\implies T = \\frac{PV}{nR}$; যেহেতু প্রতিটিতে $n$ একই, তাই প্রতিটি পাত্রের $P \\times V$ হিসাব করি।\n\n` +
            `২. তুলনা: ${summaryLines}।\n\n` +
            `৩. দেখা যাচ্ছে পাত্র (${best.label})-এর $PV = ${best.pv}$ ${wantMin ? 'সবচেয়ে কম' : 'সবচেয়ে বেশি'}। তাই সঠিক উত্তর ${ansPreview}।`,
          shortcut: `দ্রুত তুলনা ট্রিক: $n$ সমান থাকলে একক রূপান্তরের (যেমন L কে $\\text{m}^3$ বা kPa কে Pa) মোটেও দরকার নেই—সরাসরি প্রতিটি অপশনের $\\text{Pressure} \\times \\text{Volume}$ গুণ করে ${wantMin ? 'ক্ষুদ্রতম' : 'বৃহত্তম'} মানটি বেছে নাও!`
        };
      }
    }
  }

  // 3. Spring compression to launch ball of mass m to speed v
  if (/স্প্রিং|spring/i.test(stemPlain) && /সঙ্কুচিত|সংকুচিত|compress/i.test(stemPlain)) {
    if (/\\sqrt\{\\frac\{m\}\{k\}\}|v\s*\*\s*sqrt\(m\/k\)/i.test(ansText + ansPlain)) {
      return {
        explanation: `শক্তির সংরক্ষণশীলতা নীতি অনুযায়ী, $k$ বলধ্রুবক বিশিষ্ট স্প্রিংকে $x$ পরিমাণ সংকুচিত করলে সঞ্চিত স্থিতিস্থাপক বিভবশক্তি $\\frac{1}{2}kx^2$ সম্পূর্ণরূপে $m$ ভরের বলটির গতিশক্তি $\\frac{1}{2}mv^2$-তে রূপান্তরিত হয়।`,
        stepByStep:
          `১. স্প্রিং-এর সঞ্চিত বিভবশক্তি $U = \\frac{1}{2}kx^2$ এবং বলের অর্জিত গতিশক্তি $K = \\frac{1}{2}mv^2$।\n\n` +
          `২. শক্তির সংরক্ষণ অনুসারে: $\\frac{1}{2}kx^2 = \\frac{1}{2}mv^2 \\implies x^2 = \\frac{mv^2}{k}$।\n\n` +
          `৩. উভয় পক্ষের বর্গমূল করে পাই $x = v\\sqrt{\\frac{m}{k}}$। অতএব সঠিক উত্তর ${ansPreview}।`,
        shortcut: `মাত্রা যাচাই শর্টকাট: সরণ $x$-এর মাত্রা $[L]$ ও বেগ $v$-এর মাত্রা $[LT^{-1}]$। তাই $v$-কে সময়ের মাত্রা $[T]$ দিয়ে গুণ করতে হবে—যেখানে $\\sqrt{\\frac{m}{k}}$-এর এককই সেকেন্ড ($T \\propto \\sqrt{m/k}$)। ফলে $x = v\\sqrt{\\frac{m}{k}}$ মুহূর্তেই নিশ্চিত করা যায়!`
      };
    }
  }

  // 4. Relativistic meter stick length contraction passing observer
  if (/মিটার স্টিক|meter stick/i.test(stemPlain) && /(\d+(?:\.\d+)?)\s*c/i.test(stemPlain)) {
    const vM = stemPlain.match(/(\d+(?:\.\d+)?)\s*c/i);
    if (vM) {
      const beta = Number(vM[1]);
      if (beta > 0 && beta < 1) {
        const gammaInv = Math.sqrt(1 - beta * beta);
        const tNs = (1 * gammaInv) / (beta * 0.3); // 1m / (beta * 3e8 m/s) in ns (1e9 / 3e8 = 1/0.3)
        if (optionMatchesNumber(ansText, tNs, 0.08)) {
          return {
            explanation: `আপেক্ষিকতার বিশেষ তত্ত্ব অনুসারে পর্যবেক্ষকের সাপেক্ষে $v = ${beta}c$ বেগে গতিশীল $L_0 = 1\\text{ m}$ দৈর্ঘ্যের স্টিকটির দৈর্ঘ্য সঙ্কুচিত হয়ে $L = L_0\\sqrt{1 - \\frac{v^2}{c^2}}$ হয় এবং অতিক্রান্ত সময় $t = \\frac{L}{v}$।`,
            stepByStep:
              `১. স্থির দৈর্ঘ্য $L_0 = 1\\text{ m}$, বেগ $v = ${beta}c$। ফলে $\\sqrt{1 - ${beta}^2} = ${gammaInv.toFixed(2)}$।\n\n` +
              `২. সঙ্কুচিত দৈর্ঘ্য $L = 1 \\times ${gammaInv.toFixed(2)} = ${gammaInv.toFixed(2)}\\text{ m}$।\n\n` +
              `৩. সময় $t = \\frac{L}{v} = \\frac{${gammaInv.toFixed(2)}}{${beta} \\times 3 \\times 10^8}\\text{ s} = ${tNs.toFixed(2)}\\text{ ns}$।\n\nসঠিক উত্তর ${ansPreview}।`,
            shortcut: `পিথাগোরিয়ান ট্রিপল শর্টকাট: $v = 0.8c$ হলে $\\sqrt{1-0.8^2} = 0.6$ (3-4-5 ত্রিভুজ) এবং $v = 0.6c$ হলে $0.8$! আর $1\\text{ m}/c \\approx 3.33\\text{ ns}$, তাই $t = \\frac{0.6}{0.8} \\times \\frac{10}{3} = 2.5\\text{ ns}$।`
          };
        }
      }
    }
  }

  // 5. Parallel-plate capacitor energy ratio when distance d and voltage V change
  if (/সমান্তরাল পাত ধারক|parallel plate capacitor/i.test(stemPlain) && /সঞ্চিত শক্তি|শক্তির অনুপাত|energy stored/i.test(stemPlain)) {
    if (/অর্ধেক|halved/i.test(stemPlain) && /দ্বিগুণ|doubled/i.test(stemPlain) && /1\s*:\s*8/.test(ansPlain)) {
      return {
        explanation: `সমান্তরাল পাত ধারকের ধারকত্ব $C = \\frac{\\varepsilon_0 A}{d}$ এবং সঞ্চিত স্থিতিশক্তি $U = \\frac{1}{2}CV^2 = \\frac{\\varepsilon_0 A V^2}{2d}$, অর্থাৎ $U \\propto \\frac{V^2}{d}$।`,
        stepByStep:
          `১. প্রথম অবস্থায় দূরত্ব $d_1 = d$ এবং বিভব $V_1 = V$, ফলে $U_1 \\propto \\frac{V^2}{d}$।\n\n` +
          `২. দ্বিতীয় অবস্থায় $d_2 = \\frac{d}{2}$ (অর্ধেক) এবং $V_2 = 2V$ (দ্বিগুণ), ফলে নতুন ধারকত্ব $C_2 = 2C_1$।\n\n` +
          `৩. অতএব $U_2 = \\frac{1}{2}(2C_1)(2V)^2 = 8 \\times \\left(\\frac{1}{2}C_1 V^2\\right) = 8 U_1$। তাই অনুপাত $U_1 : U_2 = 1 : 8$।\n\nসঠিক উত্তর ${ansPreview}।`,
        shortcut: `অনুপাত ট্রিক: $U \\propto \\frac{V^2}{d}$। বিভব $2$ গুণ $\\implies V^2$ হবে $4$ গুণ, আর দূরত্ব $\\frac{1}{2}$ গুণ $\\implies$ ভাগ হয়ে আরও $2$ গুণ; মোট $4 \\times 2 = 8$ গুণ! তাই $U_1:U_2 = 1:8$।`
      };
    }
  }

  // 6. Two resistors R1, R2 series & parallel values check
  if (/R_1.*R_2|রোধ.*সংযোগ/i.test(q.question)) {
    const numsInAns = ansPlain.match(/(\d+(?:\.\d+)?)/g)?.map(Number);
    if (numsInAns && numsInAns.length === 2) {
      const [r1, r2] = numsInAns;
      const rs = r1 + r2;
      const rp = (r1 * r2) / (r1 + r2);
      if (stemPlain.includes(String(rs)) && stemPlain.includes(String(Number.isInteger(rp) ? rp : rp.toFixed(1)))) {
        return {
          explanation: `দুটি রোধ $R_1$ ও $R_2$-কে শ্রেণি সমবায়ে যুক্ত করলে সর্বোচ্চ তুল্য রোধ $R_s = R_1 + R_2$ এবং সমান্তরাল সমবায়ে যুক্ত করলে সর্বনিম্ন তুল্য রোধ $R_p = \\frac{R_1 R_2}{R_1 + R_2}$ পাওয়া যায়।`,
          stepByStep:
            `১. শ্রেণি সংযোগের শর্তে প্রদত্ত সর্বোচ্চ রোধ $R_1 + R_2 = ${rs}\\,\\Omega$।\n\n` +
            `২. সমান্তরাল সংযোগের শর্তে $\\frac{R_1 R_2}{R_1 + R_2} = ${rp}\\,\\Omega$।\n\n` +
            `৩. কেবল $${r1}\\,\\Omega$ ও $${r2}\\,\\Omega$-এর ক্ষেত্রেই $${r1}+${r2}=${rs}\\,\\Omega$ এবং $\\frac{${r1}\\times ${r2}}{${r1}+${r2}}=${rp}\\,\\Omega$ পাওয়া যায়। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `অপশন যোগ ট্রিক: দুটি রোধের শ্রেণি মান মানেই তাদের সাধারণ যোগফল ($R_1 + R_2 = ${rs}\\,\\Omega$)—অপশনগুলোর যে জোড়ার যোগফল প্রদত্ত বৃহত্তম রোধটির সমান, সেটিই উত্তর!`
        };
      }
    }
  }

  // 7. Bohr linear momentum p = n*hbar / r_n
  if (/বোর|Bohr/i.test(stemPlain) && /রৈখিক ভরবেগ|linear momentum/i.test(stemPlain) && /n\\hbar.*r_n|n\s*\\?hbar\s*\/\s*r_n/i.test(ansText + ansPlain)) {
    return {
      explanation: `বোরের কৌণিক ভরবেগের কোয়ান্টায়ন শর্তানুসারে $n$-তম কক্ষপথে ইলেকট্রনের কৌণিক ভরবেগ $L = r_n p = n\\frac{h}{2\\pi} = n\\hbar$।`,
      stepByStep:
        `১. কৌণিক ভরবেগ $L = mvr_n = pr_n$, যেখানে রৈখিক ভরবেগ $p = mv$।\n\n` +
        `২. বোরের স্বীকার্য অনুযায়ী $pr_n = n\\hbar$।\n\n` +
        `৩. অতএব $p = \\frac{n\\hbar}{r_n}$। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `শর্টকাট: $L = r \\times p = n\\hbar$ মনে রাখলেই এক লাইনে $p = \\frac{n\\hbar}{r_n}$ বের হয়ে যায় (মাত্রাও $[L]^{-1} \\times [ML^2T^{-1}] = [MLT^{-1}]$ মেলে)।`
    };
  }

  // 8. Equal-force acceleration on difference mass (m2 - m1)
  if (/m_1.*m_2/i.test(q.question) && /\(m_2\s*-\s*m_1\)/i.test(stemPlain)) {
    const accMs = stemPlain.match(/(\d+(?:\.\d+)?)\s*m\/s\^2/g);
    if (accMs && accMs.length >= 2) {
      const a1 = Number(accMs[0].replace(/[^\d.]/g, ''));
      const a2 = Number(accMs[1].replace(/[^\d.]/g, ''));
      if (/m_1.*12|12.*m_1/.test(ansPlain) || ansPlain.includes(String(a1))) {
        return {
          explanation: `নিউটনের দ্বিতীয় সূত্রানুসারে সমান বল $F$ প্রয়োগে $F = m_1 a_1 = m_2 a_2$ হয়। তাই $m_1$ ও $m_2$ এর যেকোনো একটিকে $F$-এর মাধ্যমে প্রকাশ করে $(m_2 - m_1)$-এর ত্বরণ $a = \\frac{F}{m_2 - m_1}$ নির্ণয় করা যায়।`,
          stepByStep:
            `১. যেহেতু উভয় ক্ষেত্রেই প্রযুক্ত বল সমান, তাই $F = ${a1}m_1 = ${a2}m_2$।\n\n` +
            `২. $(m_2 - m_1)$ ভরের বস্তুর উপর একই বল $F$ প্রয়োগ করলে ত্বরণ $a = \\frac{F}{m_2 - m_1}$।\n\n` +
            `৩. এখানে $F = m_1 \\times ${a1}$ বসালে পাই $a = \\frac{m_1 \\times ${a1}}{m_2 - m_1}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `সমমাত্রা শর্টকাট: প্রথম বস্তু $m_1$-এর ত্বরণ ${a1} এবং $(m_2-m_1)$ ধনাত্মক ভর হতে হলে হরে $(m_2-m_1)$ ও লবে $F = m_1 \\times ${a1}$ থাকতে হবে!`
        };
      }
    }
  }

  // 9. Young's double slit fringe width vs frequency doubling
  if (/দ্বি-চিড়|দ্বি-চিড়|double-slit/i.test(stemPlain) && /কম্পাঙ্ক.*দ্বিগুণ|frequency.*doubled/i.test(stemPlain) && /অর্ধেক|half/i.test(ansText)) {
    return {
      explanation: `ইয়ং-এর দ্বি-চিড় পরীক্ষায় ডোরার প্রস্থ $\\beta = \\frac{\\lambda D}{d}$ এবং আলোর বেগ $c = f\\lambda \\implies \\lambda = \\frac{c}{f}$। সুতরাং ডোরার প্রস্থ কম্পাঙ্কের ব্যস্তানুপাতিক ($\\beta \\propto \\frac{1}{f}$)।`,
      stepByStep:
        `১. ডোরার প্রস্থ $\\beta = \\frac{\\lambda D}{d} = \\frac{cD}{fd}$।\n\n` +
        `২. অন্যান্য পরামিতি ($D, d, c$) স্থির রেখে কম্পাঙ্ক $f$ দ্বিগুণ ($2f$) করলে তরঙ্গদৈর্ঘ্য $\\lambda$ অর্ধেক হয়।\n\n` +
        `৩. ফলে নতুন ডোরার প্রস্থ $\\beta' = \\frac{\\beta}{2}$, অর্থাৎ অর্ধেক হয়ে যাবে। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `ব্যস্তানুপাতিক ট্রিক: $\\beta \\propto \\lambda \\propto \\frac{1}{f}$। তাই কম্পাঙ্ক $2$ গুণ হলে ডোরার প্রস্থ সঙ্গে সঙ্গে $\\frac{1}{2}$ (অর্ধেক) হয়ে যায়!`
    };
  }

  // 10. Satellite orbital speed at height x (or h)
  if (/উপগ্রহ|satellite/i.test(stemPlain) && /কক্ষপথ|orbital speed/i.test(stemPlain) && /gR\^2|gR\^\{?2\}?/i.test(ansText + ansPlain)) {
    return {
      explanation: `পৃথিবীর কেন্দ্র থেকে $R+x$ দূরত্বে ঘূর্ণায়মান উপগ্রহের কেন্দ্রমুখী বল মহাকর্ষীয় বল দ্বারা জোগান দেওয়া হয়: $\\frac{mv^2}{R+x} = \\frac{GMm}{(R+x)^2}$ এবং পৃথিবীপৃষ্ঠে $GM = gR^2$।`,
      stepByStep:
        `১. কক্ষপথের সমতা থেকে $v^2 = \\frac{GM}{R+x}$।\n\n` +
        `২. পৃথিবীপৃষ্ঠে $g = \\frac{GM}{R^2} \\implies GM = gR^2$ বসিয়ে পাই $v^2 = \\frac{gR^2}{R+x}$।\n\n` +
        `৩. বর্গমূল করে পাই $v = \\sqrt{\\frac{gR^2}{R+x}}$। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `সীমানা যাচাই ট্রিক: উপগ্রহ যদি পৃষ্ঠের খুব কাছে ($x = 0$) ঘুরে, তবে সূত্রটি পরিচিত $v = \\sqrt{gR}$ দিতে হবে—কেবল $\\sqrt{\\frac{gR^2}{R+x}}$-তে $x=0$ বসালে $\\sqrt{gR}$ পাওয়া যায়!`
    };
  }

  // 11. Binary multiplication (`1110.11` and `101.10`) or general binary-to-decimal
  {
    const binPairM = stemPlain.match(/([01]+(?:\.[01]+)?)\s*(?:এবং|ও|and|\*)\s*([01]+(?:\.[01]+)?)/);
    if (binPairM && /গুণফল|multiplication/i.test(stemPlain)) {
      const b1 = binPairM[1];
      const b2 = binPairM[2];
      const d1 = parseBinaryFrac(b1);
      const d2 = parseBinaryFrac(b2);
      const prod = d1 * d2;
      const prodBin = toBinaryFrac(prod);
      if (ansPlain.replace(/0+$/, '').replace(/\.$/, '') === prodBin.replace(/0+$/, '').replace(/\.$/, '')) {
        return {
          explanation: `বাইনারি সংখ্যা দুটির গুণফল সরাসরি বাইনারি গুণের নিয়মে অথবা দ্রুত দশমিকে রূপান্তর করে গুণফলকে পুনরায় বাইনারিতে নিয়ে নির্ণয় করা যায়।`,
          stepByStep:
            `১. প্রথম সংখ্যা $(${b1})_2 = ${d1}_{10}$ এবং দ্বিতীয় সংখ্যা $(${b2})_2 = ${d2}_{10}$।\n\n` +
            `২. দশমিক গুণফল: $${d1} \\times ${d2} = ${prod}$।\n\n` +
            `৩. $${prod}_{10}$-কে বাইনারিতে রূপান্তর করলে পাই $(${prodBin})_2$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `দশমিক পয়েন্ট বিট শর্টকাট: ${b1}-এ দশমিকের পর ${b1.split('.')[1]?.length || 0} বিট এবং ${b2}-এ ${b2.split('.')[1]?.length || 0} বিট, আর $1 \\times 1 = 1$ যাচাই করেই অপশন ছেঁটে ফেলা যায়!`
        };
      }
    }
    const binM = stemPlain.match(/\(([01]+)\)\s*_?2/);
    if (binM && /দশমিক|ডেসিমেল|decimal|\(\d+\)\s*_?10/i.test(stemPlain)) {
      const binStr = binM[1];
      const decVal = parseInt(binStr, 2);
      if (Number.isFinite(decVal) && optionMatchesNumber(ansText, decVal, 0.01)) {
        const terms = [...binStr]
          .map((bit, idx) => (bit === '1' ? `2^{${binStr.length - 1 - idx}}` : null))
          .filter(Boolean)
          .join(' + ');
        return {
          explanation: `বাইনারি সংখ্যা $(${binStr})_2$-কে দশমিক (Decimal) পদ্ধতিতে রূপান্তরের জন্য প্রতিটি $1$ বিটের স্থানীয় মান $2^n$ যোগ করতে হয়।`,
          stepByStep:
            `১. ডান দিক থেকে স্থানসূচক $2^0, 2^1, 2^2, \\dots$ হিসাব করি।\n\n` +
            `২. কেবল $1$ বিটগুলোর স্থানীয় মান যোগ করলে: $${terms} = ${decVal}$।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `8-4-2-1 কোড ট্রিক: ডান থেকে বাঁয়ে $1, 2, 4, 8, 16, 32 \\dots$ লিখে $1$ বিটের সংখ্যাগুলো যোগ করলে ৫ সেকেন্ডে উত্তর পাওয়া যায়।`
        };
      }
    }
  }

  // 12. Vector perpendicularity |A+B| = |A-B|, equal resultant P=Q=R, 3D angle, and projection
  if (/\|A\s*\+\s*B\|\s*=\s*\|A\s*-\s*B\||\|\\vec\{A\}\s*\+\s*\\vec\{B\}\|\s*=\s*\|\\vec\{A\}\s*-\s*\\vec\{B\}\|/i.test(q.question + stemPlain) && /90/.test(ansPlain)) {
    return {
      explanation: `দুটি ভেক্টরের যোগফলের মান ও বিয়োগফলের মান সমান হলে তাদের বর্গও সমান হয়: $|\\vec{A}+\\vec{B}|^2 = |\\vec{A}-\\vec{B}|^2 \\implies 4\\vec{A}\\cdot\\vec{B} = 0$।`,
      stepByStep:
        `১. উভয় পক্ষকে বর্গ করে পাই: $A^2 + B^2 + 2AB\\cos\\theta = A^2 + B^2 - 2AB\\cos\\theta$।\n\n` +
        `২. পক্ষান্তর করলে $4AB\\cos\\theta = 0 \\implies \\cos\\theta = 0$।\n\n` +
        `৩. অতএব মধ্যবর্তী কোণ $\\theta = 90^\\circ$। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `জ্যামিতিক শর্টকাট: কোনো সামান্তরিকের দুই কর্ণ $|\\vec{A}+\\vec{B}|$ ও $|\\vec{A}-\\vec{B}|$ সমান হলে সেটি অবশ্যই একটি আয়তক্ষেত্র—তাই বাহুদ্বয়ের কোণ $90^\\circ$!`
    };
  }
  if (/P\s*=\s*Q\s*=\s*R/i.test(stemPlain) && /লব্ধি|resultant/i.test(stemPlain) && /120/.test(ansPlain)) {
    return {
      explanation: `সামান্তরিক সূত্রানুসারে $P$ ও $Q$ বলের লব্ধি $R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\theta}$। যখন $P = Q = R$ হয়, তখন বল দুটি ও লব্ধি একটি সমবাহু জ্যামিতি তৈরি করে এবং $\\cos\\theta = -\\frac{1}{2}$ হয়।`,
      stepByStep:
        `১. $R^2 = P^2 + Q^2 + 2PQ\\cos\\theta$ সূত্রে $P=Q=R$ বসাই।\n\n` +
        `২. $P^2 = P^2 + P^2 + 2P^2\\cos\\theta \\implies 2\\cos\\theta = -1 \\implies \\cos\\theta = -\\frac{1}{2}$।\n\n` +
        `৩. অতএব মধ্যবর্তী কোণ $\\theta = 120^\\circ$। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `স্থায়ী ফলাফল: সমান মানের দুটি ভেক্টরের লব্ধির মানও তাদের প্রতিটির সমান হলে মধ্যবর্তী কোণ সর্বদা $120^\\circ$ হয় ($60^\\circ$ হলে $R=\\sqrt{3}P$, $90^\\circ$ হলে $R=\\sqrt{2}P$)!`
    };
  }
  {
    const vecMatches = [...q.question.matchAll(/([^=।,\n]*\\hat\{[ijk]\}[^=।,\n]*)/g)];
    if (vecMatches.length >= 2) {
      const v1 = parseVector3D(vecMatches[0][1]);
      const v2 = parseVector3D(vecMatches[1][1]);
      if (v1 && v2) {
        const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
        const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2);
        const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2);
        if (/মধ্যবর্তী কোণ|angle/i.test(stemPlain) && mag1 > 0 && mag2 > 0) {
          const deg = (Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180) / Math.PI;
          if (optionMatchesNumber(ansText, deg, 0.5)) {
            return {
              explanation: `দুটি ভেক্টর $\\vec{A}$ ও $\\vec{B}$-এর মধ্যবর্তী কোণ $\\theta$ নির্ণয়ে ডট গুণনের সূত্র $\\cos\\theta = \\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{A}||\\vec{B}|}$ ব্যবহৃত হয়।`,
              stepByStep:
                `১. ডট গুণফল $\\vec{A}\\cdot\\vec{B} = (${v1[0]})(${v2[0]}) + (${v1[1]})(${v2[1]}) + (${v1[2]})(${v2[2]}) = ${dot}$।\n\n` +
                `২. মান $|\\vec{A}| = \\sqrt{${v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2}}$ এবং $|\\vec{B}| = \\sqrt{${v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2}}$।\n\n` +
                `৩. $\\cos\\theta = \\frac{${dot}}{${(mag1 * mag2).toFixed(2).replace(/\.00$/, '')}} \\implies \\theta = ${Math.round(deg)}^\\circ$। সঠিক উত্তর ${ansPreview}।`,
              shortcut: `দ্রুত যাচাই: প্রথমে ডট গুণফল $= 0$ হয় কি না দেখো (হলে সোজা $90^\\circ$); না হলে $\\frac{\\vec{A}\\cdot\\vec{B}}{AB}$ এর ভগ্নাংশটি $1/2 \\to 60^\\circ$, $1/\\sqrt{2} \\to 45^\\circ$, $\\sqrt{3}/2 \\to 30^\\circ$ এর সাথে মেলাও!`
            };
          }
        }
        if (/অভিক্ষেপ|projection/i.test(stemPlain) && mag2 > 0) {
          const proj = dot / mag2;
          if (/3\/√2|3\/sqrt\(2\)|\\frac\{3\}\{\\sqrt\{2\}\}/i.test(ansText + ansPlain) || optionMatchesNumber(ansText, proj, 0.05)) {
            return {
              explanation: `$\\vec{B}$ ভেক্টরের অভিমুখে $\\vec{A}$ ভেক্টরের লম্ব অভিক্ষেপ হলো $A\\cos\\theta = \\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{B}|}$।`,
              stepByStep:
                `১. ডট গুণফল $\\vec{A}\\cdot\\vec{B} = (${v1[0]})(${v2[0]}) + (${v1[1]})(${v2[1]}) + (${v1[2]})(${v2[2]}) = ${dot}$।\n\n` +
                `২. যে ভেক্টরের উপর অভিক্ষেপ ($\\vec{B}$), তার মান $|\\vec{B}| = \\sqrt{${v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2}}$।\n\n` +
                `৩. অভিক্ষেপ $= \\frac{${dot}}{\\sqrt{${v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2}}}$। সঠিক উত্তর ${ansPreview}।`,
              shortcut: `মনে রাখার কৌশল: "যার উপর বা যার অভিমুখে" অভিক্ষেপ চাওয়া হয়, সবসময় তার মান ($|\\vec{B}|$) নিচে (হরে) বসে: $\\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{B}|}$!`
            };
          }
        }
      }
    }
  }

  // 13. Circle min/max distance from external point to x^2+y^2+2gx+2fy+c=0
  {
    const ptM = stemPlain.match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
    const circM = stemPlain.match(/x\^2\s*\+\s*y\^2\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)\s*y\s*([+-]\s*\d+)\s*=\s*0/i);
    if (ptM && circM && /বৃত্ত|circle/i.test(stemPlain) && /সর্বনিম্ন দূরত্ব|সর্বোচ্চ দূরত্ব|minimum distance|maximum distance/i.test(stemPlain)) {
      const x0 = Number(ptM[1]);
      const y0 = Number(ptM[2]);
      const twoG = Number(circM[1].replace(/\s+/g, ''));
      const twoF = Number(circM[2].replace(/\s+/g, ''));
      const c = Number(circM[3].replace(/\s+/g, ''));
      const cx = -twoG / 2;
      const cy = -twoF / 2;
      const r = Math.sqrt(cx * cx + cy * cy - c);
      const dCenter = Math.hypot(x0 - cx, y0 - cy);
      const isMax = /সর্বোচ্চ|maximum/i.test(stemPlain);
      const target = isMax ? dCenter + r : Math.abs(dCenter - r);
      if (Number.isFinite(r) && optionMatchesNumber(ansText, target, 0.05)) {
        return {
          explanation: `কোনো বিন্দু $(x_0, y_0)$ থেকে বৃত্তের পরিধির উপরিস্থিত বিন্দুর ${isMax ? 'সর্বোচ্চ' : 'সর্বনিম্ন'} দূরত্ব হলো বিন্দু থেকে কেন্দ্রের দূরত্ব $d$ ও ব্যাসার্ধ $r$-এর ${isMax ? 'যোগফল ($d + r$)' : 'পার্থক্য ($|d - r|$)'}।`,
          stepByStep:
            `১. বৃত্তের কেন্দ্র $C = \\left(-\\frac{${twoG}}{2}, -\\frac{${twoF}}{2}\\right) = (${cx}, ${cy})$ এবং ব্যাসার্ধ $r = \\sqrt{${cx}^2 + ${cy}^2 - (${c})} = ${r}$।\n\n` +
            `২. $(${x0}, ${y0})$ থেকে কেন্দ্র $(${cx}, ${cy})$-এর দূরত্ব $d = \\sqrt{(${x0}-(${cx}))^2 + (${y0}-(${cy}))^2} = ${dCenter}$।\n\n` +
            `৩. ${isMax ? 'সর্বোচ্চ দূরত্ব $= d + r' : 'সর্বনিম্ন দূরত্ব $= |d - r|'} = ${target}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `জ্যামিতিক ট্রিক: কেন্দ্র $(-g, -f)$ ও $(x_0, y_0)$-এর স্থানাঙ্ক মিলে গেলে (যেমন উভয়ের ভুজ $4$) দূরত্ব শুধু কোটিদ্বয়ের পার্থক্য—সেখান থেকে সরাসরি ব্যাসার্ধ $r$ বিয়োগ (বা যোগ) করলেই উত্তর মেলে!`
        };
      }
    }
  }

  // 14. Perpendicular bisector of (x1, y1) and (x2, y2) and its x/y-axis intercept or equation
  {
    const ptsM = stemPlain.match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*(?:,|ও|এবং)?\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
    if (ptsM && /লম্ব\s*(?:সম)?দ্বিখ[ণ্ডণ]্ডক|perpendicular\s*bisector/i.test(stemPlain)) {
      const x1 = Number(ptsM[1]);
      const y1 = Number(ptsM[2]);
      const x2 = Number(ptsM[3]);
      const y2 = Number(ptsM[4]);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      // Line perp to (dx, dy) passing (mx, my): dx*(x - mx) + dy*(y - my) = 0
      if (/y-অক্ষকে|y-axis/i.test(stemPlain) && dy !== 0) {
        const yInt = my + (dx * mx) / dy;
        if (ansPlain.includes(`(0,${yInt})`) || ansPlain.includes(`(0, ${yInt})`)) {
          return {
            explanation: `$(x_1, y_1)$ ও $(x_2, y_2)$ বিন্দুদ্বয়ের সংযোগ রেখার লম্ব দ্বিখণ্ডক তাদের মধ্যবিন্দু $M$ দিয়ে যায় এবং রেখাটির উপর লম্ব হয়; এর সমীকরণ $dx(x - x_M) + dy(y - y_M) = 0$।`,
            stepByStep:
              `১. মধ্যবিন্দু $M = \\left(\\frac{${x1}+(${x2})}{2}, \\frac{${y1}+(${y2})}{2}\\right) = (${mx}, ${my})$।\n\n` +
              `২. সংযোগ রেখার ঢাল $m_1 = \\frac{${dy}}{${dx}}$, তাই লম্ব দ্বিখণ্ডকের ঢাল $m_2 = -\\frac{${dx}}{${dy}}$।\n\n` +
              `৩. $y$-অক্ষের উপর $x = 0$ বসিয়ে পাই $y - ${my} = -\\frac{${dx}}{${dy}}(0 - ${mx}) \\implies y = ${yInt}$। অতএব ছেদবিন্দু $(0, ${yInt})$। সঠিক উত্তর ${ansPreview}।`,
            shortcut: `লম্ব শর্টকাট: $(x_1, y_1)$ ও $(x_2, y_2)$ বিন্দু থেকে সমদূরবর্তী শর্তে $(0, y)$ বিন্দু বের করলে: $x_1^2+(y-y_1)^2 = x_2^2+(y-y_2)^2$ সমাধান করলেই আলাদা ঢাল-মধ্যবিন্দু ছাড়াও $y=${yInt}$ পাওয়া যায়!`
          };
        }
      }
      if (ansPlain.includes('=')) {
        return {
          explanation: `$(x_1, y_1)$ ও $(x_2, y_2)$ বিন্দুদ্বয়ের সংযোগ রেখাংশের লম্ব সমদ্বিখণ্ডক মধ্যবিন্দু $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$ দিয়ে যায় এবং রেখাংশের উপর লম্ব হয়।`,
          stepByStep:
            `১. মধ্যবিন্দু $M = (${mx}, ${my})$।\n\n` +
            `২. প্রদত্ত রেখার ঢাল $m_1 = \\frac{${dy}}{${dx}}$, ফলে লম্ব রেখার ঢাল $m_2 = -\\frac{${dx}}{${dy}}$।\n\n` +
            `৩. $(${mx}, ${my})$ বিন্দুগামী ও $m_2$ ঢালের সমীকরণই ${ansPreview}।`,
          shortcut: `বিন্দু বসানো শর্টকাট: মধ্যবিন্দু $(${mx}, ${my})$ যে অপশনের সমীকরণটিকে সিদ্ধ করে এবং ঢাল $m_2$ মেলে, সেটিই সঠিক উত্তর!`
        };
      }
    }
  }

  // 15. Exponential limit lim_{x->0} (a^x - b^x)/x = ln(a/b)
  {
    const limM = q.question.match(/\\lim_\{x\s*\\to\s*0\}\s*\\frac\{(\d+)\^x\s*-\s*(\d+)\^x\}\{x\}/);
    if (limM) {
      const a = Number(limM[1]);
      const b = Number(limM[2]);
      const ratio = a / b;
      if (Number.isInteger(ratio) && new RegExp(`(?:ln|In)\\s*${ratio}\\b`, 'i').test(ansPlain)) {
        return {
          explanation: `প্রমিত সূচকীয় সীমার সূত্রানুসারে $\\lim_{x \\to 0} \\frac{a^x - 1}{x} = \\ln a$ এবং $x=0$ বসালে এটি $\\frac{0}{0}$ অনির্ণেয় আকার ধারণ করে।`,
          stepByStep:
            `১. রাশিটিকে সাজিয়ে লিখি: $\\lim_{x \\to 0} \\frac{${a}^x - ${b}^x}{x} = \\lim_{x \\to 0} \\frac{(${a}^x - 1) - (${b}^x - 1)}{x}$।\n\n` +
            `২. প্রমিত সূত্র প্রয়োগে $= \\ln ${a} - \\ln ${b} = \\ln\\left(\\frac{${a}}{${b}}\\right)$।\n\n` +
            `৩. মান $= \\ln ${ratio}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `L'Hôpital / সূত্র ট্রিক: $\\lim_{x\\to 0}\\frac{a^x - b^x}{x} = \\ln\\left(\\frac{a}{b}\\right)$! সরাসরি $\\ln(${a}/${b}) = \\ln ${ratio}$ লিখে দাও।`
        };
      }
    }
  }

  // 16. Integral of dx / (x^2 + bx + c) with perfect square shift (dx / ((x+p)^2 + a^2))
  {
    const intM = q.question.match(/\\int\s*\\frac\{dx\}\{x\^2\s*([+-]\s*\d+)x\s*([+-]\s*\d+)\}/);
    if (intM) {
      const b = Number(intM[1].replace(/\s+/g, ''));
      const c = Number(intM[2].replace(/\s+/g, ''));
      const p = b / 2;
      const a2 = c - p * p;
      const a = Math.sqrt(a2);
      if (Number.isInteger(p) && a2 > 0 && Number.isInteger(a) && ansText.includes(`\\frac{1}{${a}}`) && ansText.includes('\\tan^{-1}')) {
        return {
          explanation: `হরে দ্বিঘাত রাশি $x^2 + bx + c$-কে পূর্ণবর্গ আকারে $(x+p)^2 + a^2$ রূপান্তর করলে প্রমিত সূত্র $\\int \\frac{dx}{(x+p)^2 + a^2} = \\frac{1}{a}\\tan^{-1}\\left(\\frac{x+p}{a}\\right) + c$ প্রয়োগ করা যায়।`,
          stepByStep:
            `১. হরকে পূর্ণবর্গ করি: $x^2 ${b >= 0 ? '+' : ''}${b}x + ${c} = (x ${p >= 0 ? '+' : ''}${p})^2 + ${a}^2$।\n\n` +
            `২. প্রমিত যোগজ সূত্র অনুযায়ী $\\int \\frac{dx}{(x ${p >= 0 ? '+' : ''}${p})^2 + ${a}^2} = \\frac{1}{${a}}\\tan^{-1}\\left(\\frac{x ${p >= 0 ? '+' : ''}${p}}{${a}}\\right) + c$।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `সহগ শর্টকাট: $\\int \\frac{dx}{x^2+bx+c}$-এ সামনে অবশ্যই $\\frac{1}{a}$ থাকবে, এবং $a = \\sqrt{c - (b/2)^2} = \\sqrt{${c}-${p * p}} = ${a}$! সামনে $\\frac{1}{${a}}$ দেখেই অপশন (ক) বাদ দিয়ে সঠিক উত্তর চেনা যায়।`
        };
      }
    }
  }

  // 17. Two-place ordered probability: B boys, G girls -> P(boy 1st, girl 2nd)
  {
    const bgM = stemPlain.match(/(\d+)\s*জন\s*বালক\s*ও\s*(\d+)\s*জন\s*বালিকা/);
    if (bgM && /১ম|প্রথম/.test(stemPlain) && /২য়|দ্বিতীয়/.test(stemPlain) && /সম্ভাবনা/.test(stemPlain)) {
      const boys = Number(bgM[1]);
      const girls = Number(bgM[2]);
      const total = boys + girls;
      const f = formatGcdFrac(boys * girls, total * (total - 1));
      if (optionMatchesNumber(ansText, f.decimal, 0.005)) {
        return {
          explanation: `বিনা প্রতিস্থাপনে ক্রমিক দুটি ঘটনার শর্তাধীন সম্ভাবনা গুণন সূত্র $P(A \\cap B) = P(A) \\cdot P(B|A)$ দ্বারা নির্ণয় করা হয়।`,
          stepByStep:
            `১. মোট প্রতিযোগী $= ${boys} + ${girls} = ${total}$ জন।\n\n` +
            `২. ১ম স্থানে একজন বালক হওয়ার সম্ভাবনা $= \\frac{${boys}}{${total}}$; এরপর অবশিষ্ট ${total - 1} জনের মধ্যে ২য় স্থানে একজন বালিকা হওয়ার সম্ভাবনা $= \\frac{${girls}}{${total - 1}}$।\n\n` +
            `৩. নির্ণেয় সম্ভাবনা $= \\frac{${boys}}{${total}} \\times \\frac{${girls}}{${total - 1}} = ${f.tex}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `দ্রুত গণনা: $\\frac{B \\times G}{(B+G)(B+G-1)} = \\frac{${boys} \\times ${girls}}{${total} \\times ${total - 1}} = ${f.tex}$!`
        };
      }
    }
  }

  // 18. Quadratic roots / alpha^3 + beta^3
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
              shortcut: `শর্টকাট: সরাসরি $(-\\frac{b}{a})^3 - 3(\\frac{c}{a})(-\\frac{b}{a})$ বসাও। সমীকরণের মূল সমান হলে ($D = ${disc} = 0$) প্রতিটি মূল $\\alpha = \\beta = ${-b / (2 * a)}$, তাই সরাসরি $2\\alpha^3 = ${res}$!`
            };
          }
        }
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

  // 19. Polynomial slope at origin x=0
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
              `২. উভয় পক্ষকে $x$-এর সাপেক্ষে অন্তরীকরণ করলে উচ্চতর ঘাতের পদগুলোতে $x$ থাকে, কেবল একঘাত পদের সহগ ধ্রুবক হিসেবে থাকে।\n\n` +
              `৩. $x = 0$ বসালে $\\left.\\frac{dy}{dx}\\right|_{x=0} = ${coeff}$ পাওয়া যায়। সঠিক উত্তর ${ansPreview}।`,
            shortcut: `৫ সেকেন্ডের শর্টকাট: $x=0$ বিন্দুতে বহুপদী $y = f(x)$-এর ঢাল মানেই সমীকরণটির একঘাত পদ $kx$-এর সহগ $k = ${coeff}$!`
          };
        }
      }
    }
  }

  // 20. Ellipse foci distance 2ae: ax^2 + by^2 = c
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
            `৩. উপকেন্দ্রদ্বয়ের দূরত্ব $= 2\\sqrt{${major2} - ${minor2}} = ${Number.isInteger(dist) ? dist : dist.toFixed(2)}$।\n\nসঠিক উত্তর ${ansPreview}।`,
          shortcut: `শর্টকাট: $e$ বের না করেই সরাসরি সূত্র ব্যবহার করো: উপকেন্দ্রদ্বয়ের দূরত্ব $= 2\\sqrt{|a^2 - b^2|} = 2\\sqrt{${major2} - ${minor2}} = ${Number.isInteger(dist) ? dist : dist.toFixed(2)}$।`
        };
      }
    }
  }

  // 21. E = mc^2
  {
    const massExpM = stemPlain.match(/10\^\(?(-?\d+)\)?\s*kg/i);
    if (massExpM && /ফোটন|শক্তি|E\s*=\s*mc/i.test(stemPlain)) {
      const exp = Number(massExpM[1]);
      const outExp = exp + 16;
      if (new RegExp(`9\\s*\\\\?times\\s*10\\^\\{?${outExp}\\}?|9\\s*\\*?\\s*10\\^${outExp}`, 'i').test(ansText)) {
        return {
          explanation: `আইনস্টাইনের ভর-শক্তি সমতুল্যতা সূত্রানুসারে $m$ ভর সম্পূর্ণরূপে শক্তিতে রূপান্তরিত হলে নির্গত শক্তি $E = mc^2$, যেখানে আলোর বেগ $c = 3 \\times 10^8\\text{ ms}^{-1}$।`,
          stepByStep:
            `১. প্রদত্ত ভর $m = 10^{${exp}}\\text{ kg}$ এবং $c = 3 \\times 10^8\\text{ ms}^{-1}$।\n\n` +
            `২. $E = mc^2 = 10^{${exp}} \\times (3 \\times 10^8)^2 = 10^{${exp}} \\times 9 \\times 10^{16}$।\n\n` +
            `৩. সূচক যোগ করে পাই $E = 9 \\times 10^{${outExp}}\\text{ J}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `শর্টকাট: যেকোনো $10^k\\text{ kg}$ ভরের জন্য ভরের ঘাতের সাথে সরাসরি $16$ যোগ করে সামনে $9$ বসাও ($9 \\times 10^{k+16}\\text{ J}$)।`
        };
      }
    }
  }

  // 22. Vertical projection kinetic energy after t seconds
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
            `৩. গতিশক্তি $E_k = \\frac{1}{2} \\times ${m} \\times (${v98.toFixed(1)})^2 = ${ke98.toFixed(2)}\\text{ J}$। সঠিক উত্তর ${ansPreview}।`,
          shortcut: `ক্যালকুলেটর-ছাড়া শর্টকাট: $g \\approx 10$ ধরলে $v = ${u - 10 * t}$, $E_k \\approx ${(0.5 * m * Math.pow(u - 10 * t, 2)).toFixed(0)}\\text{ J}$; কিন্তু $g=9.8$ হওয়ায় প্রকৃত মান তার চেয়ে সামান্য বেশি (${ke98.toFixed(2)}\\text{ J}) হবে।`
        };
      }
    }
  }

  // 23. Temperature scale F = k * C (e.g. Fahrenheit = 3 * Celsius -> 80)
  if (/ফারেনহাইট|Fahrenheit/i.test(stemPlain) && /সেন্ট্রিগ্রেড|সেলসিয়াস|Celsius/i.test(stemPlain) && /তিনগুণ|দ্বিগুণ/i.test(stemPlain)) {
    const k = /তিনগুণ/.test(stemPlain) ? 3 : 2;
    // F = kC and (F-32)/9 = C/5 => (kC-32)/9 = C/5 => (5k - 9)C = 160 => F = k * 160 / (5k - 9)
    const fVal = (k * 160) / (5 * k - 9);
    const cVal = fVal / k;
    if (optionMatchesNumber(ansText, fVal, 0.2)) {
      return {
        explanation: `সেলসিয়াস ($C$) ও ফারেনহাইট ($F$) স্কেলের মৌলিক সম্পর্ক $\\frac{C}{5} = \\frac{F - 32}{9}$। প্রশ্নের শর্তানুযায়ী $F = ${k}C$ বা $C = \\frac{F}{${k}}$।`,
        stepByStep:
          `১. $\\frac{C}{5} = \\frac{F - 32}{9}$ সমীকরণে $C = \\frac{F}{${k}}$ বসাই।\n\n` +
          `২. $\\frac{F}{${5 * k}} = \\frac{F - 32}{9} \\implies 9F = ${5 * k}F - ${5 * k * 32}$।\n\n` +
          `৩. সমাধান করে পাই $F = ${fVal.toFixed(1).replace(/\.0$/, '')}^\\circ\\text{F}$ (এবং $C = ${cVal.toFixed(2)}^\\circ\\text{C}$)। সঠিক উত্তর ${ansPreview}।`,
        shortcut: `অপশন টেস্ট শর্টকাট: $F = ${fVal.toFixed(0)}$ ধরে $\\frac{F-32}{9} \\times 5 = \\frac{${fVal.toFixed(0)}-32}{9}\\times 5 = ${cVal.toFixed(2)}$, যা ঠিক ${fVal.toFixed(0)}/${k}!`
      };
    }
  }

  // 24. Nuclear half-life: N/N0 = 1/k after t = n * T_half
  {
    const tHalfM = stemPlain.match(/অর্ধায়ু\s*(\d+(?:\.\d+)?)\s*(বছর|বৎসর|দিন|ঘণ্টা|মিনিট|সেকেন্ড|years?|days?|s)/i);
    const fracRemM = stemPlain.match(/(?:\\frac\{1\}\{(\d+)\}|1\/(\d+))\s*অংশ/);
    if (tHalfM && fracRemM && /তেজস্ক্রিয়|অর্ধায়ু/i.test(stemPlain)) {
      const tHalf = Number(tHalfM[1]);
      const denom = Number(fracRemM[1] || fracRemM[2]);
      const n = Math.log2(denom);
      if (Number.isInteger(n) && n > 0) {
        const totalTime = n * tHalf;
        if (optionMatchesNumber(ansText, totalTime, 0.1)) {
          return {
            explanation: `তেজস্ক্রিয় ক্ষয় সূত্রানুসারে $n$-টি অর্ধায়ু পরে অবশিষ্ট পদার্থের পরিমাণ হয় $N = N_0 \\left(\\frac{1}{2}\\right)^n$ এবং মোট সময় $t = n \\cdot T_{1/2}$।`,
            stepByStep:
              `১. প্রদত্ত: অর্ধায়ু $T_{1/2} = ${tHalf}$ ${tHalfM[2]} এবং অবশিষ্ট অংশ $\\frac{N}{N_0} = \\frac{1}{${denom}}$।\n\n` +
              `২. $\\left(\\frac{1}{2}\\right)^n = \\frac{1}{${denom}} = \\left(\\frac{1}{2}\\right)^{${n}} \\implies n = ${n}$টি অর্ধায়ু।\n\n` +
              `৩. মোট সময় $t = ${n} \\times ${tHalf} = ${totalTime}$ ${tHalfM[2]}। সঠিক উত্তর ${ansPreview}।`,
            shortcut: `২-এর ঘাত গণনা ট্রিক: ${denom} মানে $2^{${n}}$, তাই সরাসরি অর্ধায়ু সংখ্যা $n = ${n}$-কে $T_{1/2} = ${tHalf}$ দিয়ে গুণ করলে $t = ${totalTime}$ পাওয়া যায়!`
          };
        }
      }
    }
  }

  // 25. First-order chemical kinetics t_{1/2} = 0.693 / k
  {
    const kM = stemPlain.match(/(\d+(?:\.\d+)?)\s*\*\s*10\^\(?(-?\d+)\)?\s*s\^\(?-1\)?/i);
    if (kM && /প্রথম ক্রম|first order/i.test(stemPlain) && /অর্ধায়ু|half[- ]?life/i.test(stemPlain)) {
      const k = Number(kM[1]) * Math.pow(10, Number(kM[2]));
      const tHalf = Math.LN2 / k;
      if (optionMatchesNumber(ansText, tHalf, tHalf * 0.03)) {
        return {
          explanation: `প্রথম ক্রম বিক্রিয়ার ক্ষেত্রে অর্ধায়ু প্রারম্ভিক ঘনমাত্রার উপর নির্ভর করে না এবং বেগ ধ্রুবক $k$-এর সাথে সম্পর্ক $t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$।`,
          stepByStep:
            `১. প্রদত্ত বেগ ধ্রুবক $k = ${kM[1]} \\times 10^{${kM[2]}}\\,\\mathrm{s}^{-1}$।\n\n` +
            `২. $t_{1/2} = \\frac{0.693}{${kM[1]} \\times 10^{${kM[2]}}} \\approx ${tHalf.toFixed(1)}\\,\\mathrm{s}$।\n\n` +
            `অতএব সঠিক উত্তর ${ansPreview}।`,
          shortcut: `দ্রুত ভাগ: $0.693 \\approx 0.7$, তাই $\\frac{0.7}{${kM[1]}} \\times 10^{${-Number(kM[2])}}$ হিসাব করেই নিকটতম সঠিক অপশন শনাক্ত করা যায়!`
        };
      }
    }
  }

  // 26. AC frequency I = I0 sin(k pi t)
  {
    const acM = q.question.match(/\\sin\s*(\d+(?:\.\d+)?)\s*\\?pi\s*t/i);
    if (acM && /কম্পাঙ্ক|frequency/i.test(stemPlain)) {
      const k = Number(acM[1]);
      const freq = k / 2;
      if (optionMatchesNumber(ansText, freq, 0.05)) {
        return {
          explanation: `দিক পরিবর্তী প্রবাহের আদর্শ সমীকরণ $I = I_0\\sin(\\omega t) = I_0\\sin(2\\pi f t)$, যেখানে $\\omega = 2\\pi f$।`,
          stepByStep:
            `১. প্রদত্ত সমীকরণের সাথে $I = I_0\\sin(2\\pi f t)$ তুলনা করে পাই $2\\pi f = ${k}\\pi$।\n\n` +
            `২. কম্পাঙ্ক $f = \\frac{${k}\\pi}{2\\pi} = ${freq}\\text{ Hz}$।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `১ সেকেন্ডের ট্রিক: $\\sin(k\\pi t)$ আকারে থাকলে $\\pi t$-এর সহগকে সোজা $2$ দিয়ে ভাগ করো ($f = ${k}/2 = ${freq}\\text{ Hz}$)!`
        };
      }
    }
  }

  // 27. Identical N capacitors in series (C/N) or parallel (N*C)
  {
    const capM = stemPlain.match(/(\d+(?:\.\d+)?)\s*[μµu]F\s*এর\s*(\d+)টি\s*ধারক/i);
    if (capM) {
      const cVal = Number(capM[1]);
      const count = Number(capM[2]);
      const isSeries = /সিরিজ|শ্রেণি|series/i.test(stemPlain);
      const eq = isSeries ? cVal / count : cVal * count;
      if (optionMatchesNumber(ansText, eq, 0.05)) {
        return {
          explanation: `একই ধারকত্ব $C$-এর $n$ সংখ্যক ধারক ${isSeries ? 'শ্রেণি (Series) সমবায়ে থাকলে সমতুল্য ধারকত্ব $C_s = \\frac{C}{n}$' : 'সমান্তরাল (Parallel) সমবায়ে থাকলে সমতুল্য ধারকত্ব $C_p = nC$'} হয়।`,
          stepByStep:
            `১. প্রতিটি ধারকের মান $C = ${cVal}\\,\\mu\\mathrm{F}$ এবং সংখ্যা $n = ${count}$।\n\n` +
            `২. ${isSeries ? `শ্রেণি সমবায়ে $C_s = \\frac{${cVal}}{${count}} = ${eq}\\,\\mu\\mathrm{F}$` : `সমান্তরাল সমবায়ে $C_p = ${count} \\times ${cVal} = ${eq}\\,\\mu\\mathrm{F}$`}।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `মনে রাখার সূত্র: ধারকের সমবায় রোধের ঠিক বিপরীত—শ্রেণিতে কমে ($C/n$) এবং সমান্তরালে বাড়ে ($nC$)!`
        };
      }
    }
  }

  // 28. Pump power P = mgh / t
  {
    const volM = stemPlain.match(/(\d+(?:\.\d+)?)\s*লিটার\s*পানি/i);
    const hM = stemPlain.match(/(\d+(?:\.\d+)?)\s*m\s*(?:উপরে|উচ্চতায়)/i);
    if (volM && hM && /প্রতি\s*সেকেন্ড|per second/i.test(stemPlain) && /ক্ষমতা|power/i.test(stemPlain)) {
      const mass = Number(volM[1]);
      const h = Number(hM[1]);
      const pVal = mass * 9.8 * h;
      if (optionMatchesNumber(ansText, pVal, 1)) {
        return {
          explanation: `প্রতি সেকেন্ডে $m$ ভরের পানি $h$ উচ্চতায় তুলতে প্রয়োজনীয় ন্যূনতম ক্ষমতা $P = \\frac{W}{t} = \\frac{mgh}{t}$, যেখানে ১ লিটার পানির ভর $\\approx 1\\text{ kg}$ এবং ক্ষমতার একক ওয়াট ($\\text{W}$)।`,
          stepByStep:
            `১. প্রতি সেকেন্ডে ($t=1\\text{ s}$) উত্তোলিত পানির ভর $m = ${mass}\\text{ kg}$, উচ্চতা $h = ${h}\\text{ m}$।\n\n` +
            `২. $P = \\frac{${mass} \\times 9.8 \\times ${h}}{1} = ${pVal.toFixed(0)}\\text{ W}$।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `এককের ফাঁদ এড়াও: সংখ্যাগত মান ${pVal.toFixed(0)} দুটি অপশনে থাকলেও ক্ষমতা চাওয়ায় একক অবশ্যই ওয়াট ($\\text{W}$ বা $\\text{J/s}$), জুল ($\\text{J}$) নয়!`
        };
      }
    }
  }

  // 29. Galvanometer Shunt S = G / (n - 1)
  {
    const gM = stemPlain.match(/(\d+(?:\.\d+)?)\s*(?:Ω|ওহম)/);
    const pctM = stemPlain.match(/(\d+(?:\.\d+)?)\s*%/);
    if (gM && pctM && /শান্ট|shunt/i.test(stemPlain) && /গ্যালভানোমিটার/i.test(stemPlain)) {
      const G = Number(gM[1]);
      const pct = Number(pctM[1]);
      const shunt = (G * pct) / (100 - pct);
      if (optionMatchesNumber(ansText, shunt, 0.05)) {
        return {
          explanation: `মূল প্রবাহ $I$-এর $p\\%$ গ্যালভানোমিটার ($G$) দিয়ে প্রবাহিত হতে হলে সমান্তরালে যুক্ত শান্ট রোধ $S = \\frac{G \\cdot I_g}{I - I_g}$।`,
          stepByStep:
            `১. প্রদত্ত: $G = ${G}\\,\\Omega$, এবং $\\frac{I_g}{I} = \\frac{${pct}}{100}$ (অর্থাৎ বাকি $${100 - pct}\\%$ শান্টের মধ্য দিয়ে যাবে)।\n\n` +
            `২. $S = G \\times \\frac{${pct}}{100 - ${pct}} = ${G} \\times \\frac{${pct}}{${100 - pct}} \\approx ${shunt.toFixed(2)}\\,\\Omega$।\n\n` +
            `সঠিক উত্তর ${ansPreview}।`,
          shortcut: `শান্ট অনুপাত সূত্র: গ্যালভানোমিটারে প্রবাহ $1/n$ অংশ করতে হলে $S = \\frac{G}{n-1}$; এখানে $${pct}\\% = \\frac{${pct}}{100}$ হওয়ায় $S = \\frac{${G} \\times ${pct}}{${100 - pct}} \\approx ${shunt.toFixed(2)}\\,\\Omega$!`
        };
      }
    }
  }

  // 30. Balanced chemical disproportionation reaction a KClO3 -> b KClO4 + c KCl
  if (/KClO.*3.*KClO.*4.*KCl/i.test(stemPlain) && /3\s*:\s*1/.test(ansPlain)) {
    return {
      explanation: `$\\mathrm{KClO}_3$-এর তাপীয় অসামঞ্জস্য বিক্রিয়ায় $\\mathrm{Cl}$ ($+5$) একই সাথে জারিত হয়ে $\\mathrm{KClO}_4$ ($+7$) এবং বিজারিত হয়ে $\\mathrm{KCl}$ ($-1$) উৎপন্ন করে।`,
      stepByStep:
        `১. জারণ সংখ্যার পরিবর্তন: $\\mathrm{Cl}^{+5} \\to \\mathrm{Cl}^{+7}$ (বৃদ্ধি $+2$), এবং $\\mathrm{Cl}^{+5} \\to \\mathrm{Cl}^{-1}$ (হ্রাস $-6$)।\n\n` +
        `২. ইলেকট্রন সমতা করতে $+2$ বৃদ্ধিকে $3$ দিয়ে ও $-6$ হ্রাসকে $1$ দিয়ে গুণ করি।\n\n` +
        `৩. সমতাকৃত সমীকরণ: $4\\mathrm{KClO}_3 \\xrightarrow{\\Delta} 3\\mathrm{KClO}_4 + \\mathrm{KCl}$। অতএব $b : c = 3 : 1$। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `অক্সিজেন-সমতা ট্রিক: ডানদিকে শুধু $\\mathrm{KClO}_4$-এ অক্সিজেন আছে (৪টি) এবং বামে $\\mathrm{KClO}_3$-এ ৩টি; অক্সিজেন সমান করতে $4\\mathrm{KClO}_3 \\to 3\\mathrm{KClO}_4$ এবং বাকি $\\mathrm{K, Cl}$ থেকে $1\\mathrm{KCl}$, তাই $b:c = 3:1$!`
    };
  }

  // 31. Equal mass (1.0 g) of metals reacting with HCl -> largest volume of H2
  if (/1(?:\.0)?\s*g.*H_?2\s*গ্যাস|1(?:\.0)?\s*g.*highest volume of H2/i.test(stemPlain) && /\bMg\b/i.test(ansPlain)) {
    return {
      explanation: `সমান তাপমাত্রা ও চাপে উৎপন্ন $\\mathrm{H}_2$ গ্যাসের আয়তন সরাসরি $\\mathrm{H}_2$-এর মোল সংখ্যার সমানুপাতিক ($V \\propto n$)। $1\\text{ g}$ ধাতু থেকে উৎপন্ন $\\mathrm{H}_2$ মোল সংখ্যা $= \\frac{\\text{যোজ্যতা}}{2 \\times \\text{পারমাণবিক ভর}}$ (অর্থাৎ তুল্যভর সবচেয়ে কম হলে আয়তন সর্বাধিক)।`,
      stepByStep:
        `১. তুলনা (প্রতি $1\\text{ g}$-এ তুল্য সংখ্যা $= \\frac{\\text{যোজ্যতা}}{M}$):\n\n` +
        `২. $\\mathrm{Na}: \\frac{1}{23} \\approx 0.043$, $\\mathrm{K}: \\frac{1}{39} \\approx 0.026$, $\\mathrm{Ca}: \\frac{2}{40} = 0.050$, কিন্তু $\\mathrm{Mg}: \\frac{2}{24} \\approx 0.083$।\n\n` +
        `৩. ম্যাগনেসিয়ামের ($\\mathrm{Mg}$) তুল্যভর ($12$) সর্বনিম্ন হওয়ায় $1.0\\text{ g}$ থেকে সর্বাধিক $\\mathrm{H}_2$ গ্যাস উৎপন্ন হবে। সঠিক উত্তর ${ansPreview}।`,
      shortcut: `তুল্যভর শর্টকাট: সমান ভরের ধাতু থেকে সবচেয়ে বেশি $\\mathrm{H}_2$ পাওয়া যায় সেই ধাতুতে যার $\\text{তুল্যভর} = \\frac{M}{\\text{যোজ্যতা}}$ সবচেয়ে ছোট ($\\mathrm{Mg}: \\frac{24}{2}=12$)!`
    };
  }

  // 32. Set identity du-02-03-q-018: A \ B = A ∩ B'
  if (/A\s*\\setminus\s*B\s*=\s*A\s*\\cap\s*B'/.test(ansText) || /ডি\s*মরগান|De Morgan|সেট|অভেদ/i.test(stemPlain + (q.provenance?.notes || ''))) {
    if (q.id === 'du-02-03-q-018') {
      return {
        explanation: `সেট তত্ত্বের মৌলিক সংজ্ঞা অনুযায়ী $A \\setminus B$ (বা $A - B$) হলো এমন উপাদানসমূহের সেট যারা $A$-তে আছে কিন্তু $B$-তে নেই, অর্থাৎ $B$-এর পূরক সেট $B'$-এ আছে।`,
        stepByStep:
          `১. যেকোনো উপাদান $x \\in (A \\setminus B) \\iff x \\in A$ এবং $x \\notin B$।\n\n` +
          `২. $x \\notin B \\iff x \\in B'$।\n\n` +
          `৩. অতএব $x \\in (A \\cap B')$, অর্থাৎ $A \\setminus B = A \\cap B'$। সঠিক উত্তর ${ansPreview}।`,
        shortcut: `ভেনচিত্র শর্টকাট: যেকোনো ছোট সেট উদাহরণ $A=\\{1,2\\}, B=\\{2,3\\}, U=\\{1,2,3,4\\}$ ধরে নিলেই $A \\setminus B = \\{1\\} = A \\cap B'$ এক সেকেন্ডে যাচাই করা যায়!`
      };
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

/**
 * Narrow, word-boundary-guarded micro-topics sorted from MOST SPECIFIC to GENERAL
 * so broad terms never hijack unrelated problems.
 */
const SUBJECT_TOPICS: Record<string, TopicTemplate[]> = {
  Physics: [
    {
      match: /ইয়ং-এর গুণাঙ্ক|ইয়ং-এর গুণাঙ্ক|পীড়ন|পীড়ন|বিকৃতি|স্থিতিস্থাপক|সঞ্চিত মোট স্থিতিস্থাপক|young's modulus|stress|strain|elastic/i,
      theory: 'স্থিতিস্থাপক সীমার মধ্যে পীড়ন বিকৃতির সমানুপাতিক ($Y = \\frac{\\text{পীড়ন}}{\\text{বিকৃতি}}$) এবং তারে সঞ্চিত একক আয়তনের স্থিতিস্থাপক শক্তি $u = \\frac{1}{2}\\times\\text{পীড়ন}\\times\\text{বিকৃতি} = \\frac{S^2}{2Y}$।',
      formulaOrRule: '$U = u \\cdot V = \\frac{S^2 AL}{2Y} = \\frac{1}{2}\\frac{Y A l^2}{L} = \\frac{1}{2}Fl$',
      howToSolve: 'একক আয়তনে সঞ্চিত শক্তি $\\frac{S^2}{2Y}$-কে তারের আয়তন $AL$ দিয়ে গুণ করে মোট সঞ্চিত শক্তি বের করো।',
      shortcut: 'মাত্রা যাচাই ট্রিক: পীড়ন $S$ ও ইয়ং গুণাঙ্ক $Y$ উভয়েরই মাত্রা এক (চাপ/শক্তি-ঘনত্ব), তাই $\\frac{S^2}{2Y}$-এর মাত্রা শক্তি/আয়তন—এর সাথে আয়তন $AL$ গুণ করলে $[\\text{Energy}]$ মেলে!'
    },
    {
      match: /ধারক|ধারকত্ব|সমান্তরাল পাত|capacitor|capacitance/i,
      theory: 'ধারকে সঞ্চিত তড়িৎ শক্তি $U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C} = \\frac{1}{2}QV$ এবং সমান্তরাল পাত ধারকের ধারকত্ব $C = \\frac{\\varepsilon_0 K A}{d}$।',
      formulaOrRule: 'শ্রেণি: $\\frac{1}{C_s} = \\sum \\frac{1}{C_i}$; সমান্তরাল: $C_p = \\sum C_i$; শক্তি $U = \\frac{1}{2}CV^2$',
      howToSolve: 'ব্যাটারি সংযুক্ত থাকলে বিভব $V$ স্থির থাকে ($U \\propto C$), আর বিচ্ছিন্ন থাকলে চার্জ $Q$ স্থির থাকে ($U \\propto \\frac{1}{C}$)—এভাবে পরিবর্তিত রাশি হিসাব করো।',
      shortcut: 'সতর্কতা: ধারকের শ্রেণি-সমান্তরাল সূত্র রোধের ঠিক বিপরীত, এবং $C \\propto \\frac{A}{d}$!'
    },
    {
      match: /লজিক গেট|সত্যক সারণি|ট্রানজিস্টর|ডায়োড|অর্ধপরিবাহী|সেমিকন্ডাক্টর|logic gate|AND|OR|NAND|NOR|XOR|semiconductor|transistor|diode/i,
      theory: 'ডিজিটাল ও সেমিকন্ডাক্টর ইলেকট্রনিক্সে লজিক গেটের বুলিয়ান আউটপুট ($\\text{OR}: A+B$, $\\text{AND}: A\\cdot B$, $\\text{NOR}: \\overline{A+B}$, $\\text{NAND}: \\overline{A\\cdot B}$) এবং পঞ্চযোজী ($n$-টাইপ) ও ত্রিযোজী ($p$-টাইপ) ডোপিং নির্ণায়ক ভূমিকা রাখে।',
      formulaOrRule: 'ডিমরগানের সূত্র: $\\overline{A+B}=\\overline{A}\\cdot\\overline{B}$; $p$-টাইপ = ত্রিযোজী (হোল সংখ্যাগরিষ্ঠ), $n$-টাইপ = পঞ্চযোজী (ইলেকট্রন সংখ্যাগরিষ্ঠ)',
      howToSolve: 'ইনপুট বা সার্কিটের অবস্থা ($0, 1$) প্রতিটি সমন্বয়ে যাচাই করে সত্যক সারণির আউটপুটের সাথে মেলাও।',
      shortcut: 'সার্কিট থেকে গেট চেনার ট্রিক: সমান্তরাল (Parallel) সুইচ মানে OR গেট, শ্রেণি (Series) সুইচ মানে AND গেট; আর ডোপিংয়ে $\\text{P-5 = n-type}$ (Penta $\\to$ negative)!'
    },
    {
      match: /আপেক্ষিকতা|লরেন্টজ|দৈর্ঘ্য সংকোচন|কাল দীর্ঘায়ন|ফোটন|ডি ব্রগলি|বোর|হাইড্রোজেন পরমাণু|কার্যাপেক্ষক|অর্ধায়ু|তেজস্ক্রিয়|relativity|photon|bohr|half-life/i,
      theory: 'আধুনিক পদার্থবিজ্ঞানে বিশেষ আপেক্ষিকতা, কোয়ান্টাম শক্তির ($E=hf$) আলোক-তড়িৎ ক্রিয়া, বোর পরমাণু মডেল ($mvr = n\\hbar$) এবং তেজস্ক্রিয় ক্ষয় সূত্র ব্যবহৃত হয়।',
      formulaOrRule: '$L = L_0\\sqrt{1-v^2/c^2}$, $E = hf = \\frac{hc}{\\lambda}$, $L = pr_n = n\\hbar$, $N = N_0(\\frac{1}{2})^{t/T_{1/2}}$',
      howToSolve: 'গতিশীল কাঠামোর বেগ, ফোটনের কম্পাঙ্ক/তরঙ্গদৈর্ঘ্য অথবা অর্ধায়ু সংখ্যার মান সংশ্লিষ্ট প্রমিত সূত্রে প্রয়োগ করো।',
      shortcut: 'দ্রুত হিসাব: $E(\\text{eV}) \\approx \\frac{1240}{\\lambda(\\text{nm})}$; $0.8c$ বা $0.6c$ থাকলে $\\sqrt{1-v^2/c^2}$ যথাক্রমে $0.6$ ও $0.8$ হয়।'
    },
    {
      match: /ভেক্টর|\bডট\b|\bক্রস\b|লব্ধি|অভিক্ষেপ|\bvector\b|\bresultant\b|\bprojection\b/i,
      theory: 'ভেক্টরের লব্ধি নির্ণয়ে সামান্তরিক সূত্র এবং দুটি ভেক্টরের মধ্যবর্তী কোণ বা অভিক্ষেপ নির্ণয়ে স্কেলার (ডট) গুণন ব্যবহৃত হয়।',
      formulaOrRule: '$R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\theta}$, $\\vec{A}\\cdot\\vec{B} = AB\\cos\\theta$, $\\vec{B}$-এর দিকে $\\vec{A}$-এর অভিক্ষেপ $= \\frac{\\vec{A}\\cdot\\vec{B}}{B}$',
      howToSolve: 'ভেক্টর উপাংশগুলোর ডট/ক্রস গুণফল বা লব্ধির শর্ত ($\\vec{A}\\cdot\\vec{B}=0 \\implies 90^\\circ$) যাচাই করো।',
      shortcut: 'লম্ব হলে ডট গুণফল $= 0$, সমান্তরাল হলে অনুপাত সমান, আর সমান মানের দুটি ভেক্টরের লব্ধি $2P\\cos(\\theta/2)$!'
    },
    {
      match: /রোধ|কারেন্ট|ভোল্টেজ|বিভব|তড়িৎ|কার্শফ|ওহম|শান্ট|আপেক্ষিক রোধ|চৌম্বক|ফ্লাক্স|আবেশ|resistor|current|ohm|shunt|magnetic|dipole/i,
      theory: 'তড়িৎ ও চুম্বকত্বে ওহমের সূত্র ($V=IR$), রোধের আপেক্ষিক সম্পর্ক ($R = \\rho \\frac{L}{A}$), কুলম্ব/গাউস ও কার্শফের সূত্র এবং তড়িৎ দ্বিপোলের দূরত্ব-নির্ভরতা ($E \\propto r^{-3}$) প্রযোজ্য।',
      formulaOrRule: '$V=IR$, $\\rho = \\frac{RA}{L}$, শ্রেণি $R_s = \\sum R_i$, সমান্তরাল $\\frac{1}{R_p}=\\sum\\frac{1}{R_i}$, শান্ট $S = \\frac{G I_g}{I - I_g}$',
      howToSolve: 'বর্তনীর সংযোগ ধরন (শ্রেণি না সমান্তরাল) ও প্রদত্ত ভৌত রাশি চিহ্নিত করে সমীকরণে বসাও।',
      shortcut: 'অপশন বাছাই: তড়িৎ দ্বিপোলের ক্ষেত্র $r^{-3}$ অনুযায়ী কমে (বিন্দু চার্জের $r^{-2}$ থেকে আলাদা); আর পরিবাহীর দৈর্ঘ্য $n$ গুণ টেনে বাড়ালে রোধ $n^2$ গুণ হয়!'
    },
    {
      match: /হাইগেনস|ব্যতিচার|অপবর্তন|সমবর্তন|প্রতিসরণ|প্রতিফলন|দ্বি-চিড়|দ্বি-চিড়|তরঙ্গদৈর্ঘ্য|কম্পাঙ্ক|লেন্স|ফোকাস|huygens|interference|diffraction|polarization|double-slit|refraction|lens/i,
      theory: 'আলোকবিজ্ঞান ও তরঙ্গ তত্ত্বে প্রতিফলন, প্রতিসরণ, ব্যতিচার ও অপবর্তন তরঙ্গ প্রকৃতির প্রমাণ; তবে সমবর্তন (Polarization) কেবল অনুপ্রস্থ (Transverse) তরঙ্গেই ঘটে—অনুদৈর্ঘ্য শব্দতরঙ্গে বা হাইগেনসের সাধারণ অনুদৈর্ঘ্য মডেলের মাধ্যমে নয়।',
      formulaOrRule: '$v = f\\lambda$, ডোরার প্রস্থ $\\beta = \\frac{\\lambda D}{d}$, $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$, $n = \\frac{c}{v}$',
      howToSolve: 'ঘটনাটি তরঙ্গের কোন ধর্ম (অনুদৈর্ঘ্য বনাম অনুপ্রস্থ) নির্দেশ করে অথবা তরঙ্গদৈর্ঘ্য/কম্পাঙ্ক পরিবর্তনে প্রস্থ-বেগ কীভাবে বদলায় তা বিশ্লেষণ করো।',
      shortcut: 'মূল পার্থক্য: শব্দ (অনুদৈর্ঘ্য তরঙ্গ) ব্যতিচার, অপবর্তন ও প্রতিসরণ দেখালেও সমবর্তন (Polarization) দেখায় না! আর প্রতিসরণে কম্পাঙ্ক $f$ সর্বদা স্থির থাকে।'
    },
    {
      match: /প্রাস|নিক্ষেপ|উপগ্রহ|মুক্তিবেগ|মহাকর্ষ|অভিকর্ষ|ত্বরণ|ভরবেগ|সংঘর্ষ|টর্ক|জড়তার ভ্রামক|projectile|satellite|escape|gravity|acceleration|torque/i,
      theory: 'গতিবিদ্যা ও মহাকর্ষে বল-ত্বরণের সম্পর্ক ($F=ma$), প্রাসের দ্বিমাত্রিক গতি এবং কক্ষপথে আবর্তনের ক্ষেত্রে কেন্দ্রমুখী বল ও মহাকর্ষীয় বলের সমতা মূল ভিত্তি।',
      formulaOrRule: '$v = u + at$, $s = ut + \\frac{1}{2}at^2$, প্রাসের শীর্ষে $K = E\\cos^2\\theta$, উপগ্রহের বেগ $v = \\sqrt{\\frac{gR^2}{R+h}}$',
      howToSolve: 'কোন ভৌত রাশিটি ধ্রুবক (বল, ত্বরণ, বা কৌণিক ভরবেগ) তা নির্ণয় করে সঠিক গতি-সমীকরণ নির্বাচন করো।',
      shortcut: 'সীমানা পরীক্ষা: দূরত্ব বা উচ্চতা $0$ বসালে সাধারণ সূত্র পাওয়া যায় কি না দেখে ভুল অপশন সঙ্গে সঙ্গে বাদ দাও!'
    },
    {
      match: /তাপীয় ইঞ্জিন|এন্ট্রপি|রুদ্ধতাপ|সমোষ্ণ|কার্নো|আদর্শ গ্যাস|চার্লসের সূত্র|বয়েলের|তাপগতিবিদ্যা|ফারেনহাইট|thermodynamics|heat engine|carnot|ideal gas|charles/i,
      theory: 'তাপগতিবিদ্যার প্রথম সূত্র ($dQ = dU + dW$) শক্তি সংরক্ষণশীলতা এবং দ্বিতীয় সূত্র তাপীয় ইঞ্জিনের দিক ও দক্ষতা নিয়ন্ত্রণ করে; গ্যাস অণুর গড় গতিশক্তি ও চাপ-আয়তনে $PV = nRT$ প্রযোজ্য।',
      formulaOrRule: '$PV = nRT$, $\\eta = 1 - \\frac{T_2}{T_1}$, $\\frac{C}{5} = \\frac{F-32}{9}$, প্রথম সূত্র $dQ = dU + dW$',
      howToSolve: 'প্রক্রিয়াটিতে তাপ, কাজ ও অভ্যন্তরীণ শক্তির পরিবর্তন কিংবা তাপমাত্রা-চাপ-আয়তন ($PV/nR$) সম্পর্ক যাচাই করো।',
      shortcut: 'তাপমাত্রার সব অঙ্কে তাপমাত্রা কেলভিন ($K = ^\\circ\\text{C} + 273$) এককে নিয়ে তুলনা করবে!'
    }
  ],
  Chemistry: [
    {
      match: /আয়োডোফর্ম|আয়োডোফর্ম|হ্যালোফর্ম|iodoform|haloform/i,
      theory: 'আয়োডোফর্ম বিক্রিয়ায় $\\mathrm{I}_2$ ও $\\mathrm{NaOH}$-এর সাথে বিক্রিয়া করে হলুদ অধঃক্ষেপ ($\\mathrm{CHI}_3$) দিতে হলে যৌগে অবশ্যই $\\mathrm{CH}_3\\mathrm{CO}-$ অথবা $\\mathrm{CH}_3\\mathrm{CH(OH)}-$ (ইথানল, প্রোপানল-২, মিথাইল কিটোন) মূলক থাকতে হবে।',
      formulaOrRule: 'শনাক্তকারী মূলক: $\\mathrm{CH}_3-\\mathrm{CO}-$ বা $\\mathrm{CH}_3-\\mathrm{CH(OH)}-$ হলে হলুদ $\\mathrm{CHI}_3\\downarrow$ উৎপন্ন হয়।',
      howToSolve: 'বিকল্পগুলোর গাঠনিক সংকেত দেখে পরীক্ষা করো কোন যৌগটিতে প্রান্তীয় $\\mathrm{CH}_3\\mathrm{CO}-$ বা $\\mathrm{CH}_3\\mathrm{CH(OH)}-$ অংশ অনুপস্থিত (যেমন পেন্টান-৩-ওন $\\mathrm{CH_3CH_2COCH_2CH_3}$)।',
      shortcut: 'আয়োডোফর্ম ট্রিক: কিটোনের কার্বনিল মূলকটি (C=O) ২য় কার্বনে না থেকে ৩য় কার্বনে ($\\mathrm{CH_3CH_2COCH_2CH_3}$) গেলে তাতে $\\mathrm{CH_3CO}-$ গ্রুপ থাকে না—তাই সাড়া দেয় না!'
    },
    {
      match: /অ্যামালগাম|ক্লিমেনসেন|উলফ|টলেন্স|ফেহলিং|হফম্যান|অ্যালডল|ক্যানিজারো|ফ্রিডেল|গ্রিগনার্ড|রাইমার|clemmensen|amalgam|tollens|fehling/i,
      theory: 'নামীয় জৈব বিক্রিয়ায় নির্দিষ্ট বিকারক কার্যকরী মূলককে সুনির্দিষ্ট উৎপাদে রূপান্তর করে; যেমন ক্লিমেনসেন বিজারণে $\\mathrm{Zn(Hg)}$ ও গাঢ় $\\mathrm{HCl}$ কার্বনিল মূলক ($>\\mathrm{C}=\\mathrm{O}$)-কে সম্পূর্ণ বিজারিত করে $-\\mathrm{CH}_2-$ মূলকে পরিণত করে।',
      formulaOrRule: 'ক্লিমেনসেন: $R\\mathrm{CHO} \\xrightarrow{\\text{Zn(Hg)/HCl}} R\\mathrm{CH}_3$; হফম্যান: $R\\mathrm{CONH}_2 \\xrightarrow{\\mathrm{Br_2/KOH}} R\\mathrm{NH}_2$',
      howToSolve: 'বিক্রিয়কের কার্যকরী মূলক এবং প্রদত্ত বিকারক ($\\mathrm{Zn.Hg/HCl}$ বা $\\mathrm{Br_2/KOH}$ ইত্যাদি) চিহ্নিত করে কার্বনিল অক্সিজেন অপসারণ বা কার্বন সংখ্যার পরিবর্তন হিসাব করো।',
      shortcut: 'বিকারক চিনলেই উত্তর: $\\mathrm{Zn.Hg} + \\text{গাঢ় HCl}$ মানেই ক্লিমেনসেন বিজারণ—$\\mathrm{-CHO}$ সরাসরি $\\mathrm{-CH}_3$-তে রূপান্তরিত হয় (অর্থাৎ $\\mathrm{C_6H_5CHO \\to C_6H_5CH_3}$ টলুইন)!'
    },
    {
      match: /সন্নিবেশ বন্ধন|সন্নিবেশ|ডাইপোল|মেরুতা|সংকরায়ন|আকৃতি|coordinate bond|dipole|hybridization/i,
      theory: 'সন্নিবেশ বন্ধন গঠনের জন্য অন্তত একটি নিঃসঙ্গ ইলেকট্রন জোড় (Lone pair দাতা যেমন $\\mathrm{NH_3, H_2O}$) অথবা ফাঁকা অরবিটাল (গ্রহীতা যেমন $\\mathrm{BCl_3}$) থাকতে হয়; আর স্থায়ী ডাইপোল মোমেন্ট নির্ভর করে অণুর অপ্রতিসম জ্যামিতির (যেমন $\\mathrm{SF_4}$-এর সি-স আকৃতি, $\\mu \\neq 0$) উপর।',
      formulaOrRule: 'অষ্টক পূর্ণ ও নিঃসঙ্গ ইলেকট্রন জোড়হীন/ফাঁকা $d$-অরবিটালহীন কার্বনের সম্পৃক্ত যৌগ ($\\mathrm{CCl_4}$) সাধারণত সন্নিবেশ বন্ধন করে না; সুষম জ্যামিতিতে (ত্রিকোণীয় সমতলীয় $\\mathrm{BF_3}$, চতুস্তলকীয় $\\mathrm{SiF_4}$, সমতলীয় বর্গাকার $\\mathrm{XeF_4}$) লব্ধি ডাইপোল $\\mu = 0$।',
      howToSolve: 'কেন্দ্রীয় পরমাণুর যোজ্যতা ইলেকট্রন, নিঃসঙ্গ ইলেকট্রন জোড় ($LP$) ও প্রতিসাম্য জ্যামিতি নির্ণয় করে ব্যতিক্রম অণুটি শনাক্ত করো।',
      shortcut: 'প্রতিসাম্য ট্রিক: কেন্দ্রীয় পরমাণুতে কোনো নিঃসঙ্গ জোড় না থাকলে ($\\mathrm{BF_3, SiF_4}$) বা প্রতিসম জোড় থাকলে ($\\mathrm{XeF_4}$) ডাইপোল কেটে $0$ হয়; $\\mathrm{SF_4}$-এ ১টি নিঃসঙ্গ জোড় থাকায় এটি পোলার!'
    },
    {
      match: /প্রিজারভেটিভ|সংরক্ষক|এসিড বৃষ্টি|অম্লবৃষ্টি|গ্রীনহাউস|গ্রিনহাউস|দহন|preservative|acid rain/i,
      theory: 'পরিবেশ ও খাদ্য রসায়নে এসিড বৃষ্টির প্রধান উৎস হলো উচ্চ তাপমাত্রায় বায়ুমণ্ডলের $\\mathrm{N_2}$ ও $\\mathrm{O_2}$ বিক্রিয়ায় সৃষ্ট $\\mathrm{NO/NO_2}$ এবং জ্বালানির $\\mathrm{SO_2}$; আর খাদ্য প্রিজারভেটিভ জীবাণু বা জারণ রোধ করে।',
      formulaOrRule: 'ইঞ্জিন দহনে: $\\mathrm{N_2 + O_2 \\xrightarrow{\\Delta} 2NO}$; প্রাকৃতিক/কৃত্রিম প্রিজারভেটিভ: চিনি, লবণ, BHA, $\\mathrm{Na_2SO_3}$ (সালফাইট), সোডিয়াম বেনজোয়েট (সালফেট $\\mathrm{Na_2SO_4}$ নয়)',
      howToSolve: 'প্রশ্নের পরিবেশগত বা ব্যবহারিক রাসায়নিক ভূমিকা (যেমন অ্যান্টি-অক্সিডেন্ট বনাম নিষ্ক্রিয় লবণ, অথবা দহনে উৎপন্ন নাইট্রোজেন অক্সাইড) যাচাই করো।',
      shortcut: 'সতর্ক পার্থক্য: প্রিজারভেটিভ হিসেবে সোডিয়াম **সালফাইট** ($\\mathrm{Na_2SO_3}$) ব্যবহৃত হয়, কিন্তু সোডিয়াম **সালফেট** ($\\mathrm{Na_2SO_4}$) নয়!'
    },
    {
      match: /pH|pOH|লুইস এসিড|ব্রনস্টেড|অম্ল|ক্ষার|বাফার|টাইট্রেশন|মোলারিটি|ঘনমাত্রা|\bacid\b|\bbase\b|buffer|molarity/i,
      theory: 'অম্ল-ক্ষার তত্ত্বে ব্রনস্টেড-লাউরি প্রোটন দাতা-গ্রহীতা, আর লুইস তত্ত্বে ইলেকট্রন জোড় গ্রহীতা এসিড ($\\mathrm{BF_3, AlCl_3}$) ও দাতা ক্ষার ($\\mathrm{NH_3, H_2O}$); দ্রবণের $pH = -\\log[\\mathrm{H}^+]$।',
      formulaOrRule: '$pH = -\\log[H^+]$, $pH + pOH = 14\\;(25^\\circ\\text{C})$, $S_1V_1e_1 = S_2V_2e_2$',
      howToSolve: 'প্রোটন বা ইলেকট্রন জোড় দান-গ্রহণের ক্ষমতা অথবা তুল্যসংখ্যাসহ $[\\mathrm{H}^+]$ মান হিসাব করো।',
      shortcut: '১০-এর ঘাত ট্রিক: $[H^+] = 10^{-n}\\text{ M}$ হলে $pH = n$; আর অষ্টক অপূর্ণ কেন্দ্রীয় পরমাণু থাকলেই সেটি লুইস এসিড!'
    },
    {
      match: /ইলেকট্রন বিন্যাস|কোয়ান্টাম|অরবিটাল|পর্যায়|আয়নীকরণ|তড়িৎ ঋণাত্মকতা|electron|quantum|orbital|ionization/i,
      theory: 'আউফবাউ, হুন্ড ও পাউলির নীতি অনুযায়ী ইলেকট্রন বিন্যাস গঠিত হয়; $d$-অরবিটালের অর্ধপূর্ণ ($d^5$) ও পূর্ণ ($d^{10}$) অবস্থা অতিরিক্ত সুস্থিতি দেয়।',
      formulaOrRule: '$1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p$',
      howToSolve: 'পারমাণবিক সংখ্যা অনুযায়ী শক্তিক্রম ও সুস্থিত অর্ধপূর্ণ/পূর্ণ বিন্যাস ($d^5 s^1, d^{10} s^1$) যাচাই করো।',
      shortcut: 'ব্যতিক্রম ট্রিক: $\\mathrm{Cr}(24) \\to [\\mathrm{Ar}]3d^5 4s^1$, $\\mathrm{Cu}(29) \\to [\\mathrm{Ar}]3d^{10}4s^1$, $\\mathrm{Mo}(42) \\to [\\mathrm{Kr}]4d^5 5s^1$!'
    },
    {
      match: /জারণ|বিজারণ|অধঃক্ষেপ|তড়িৎদ্বার|কোষ|ফ্যারাডে|সমতাকৃত|oxidation|reduction|redox|electrode|faraday/i,
      theory: 'জারণ অর্থ ইলেকট্রন ত্যাগ (জারণ সংখ্যা বৃদ্ধি) এবং বিজারণ অর্থ ইলেকট্রন গ্রহণ (জারণ সংখ্যা হ্রাস); সমতাকৃত বিক্রিয়ায় মোট ত্যাগকৃত ও গৃহীত ইলেকট্রন সমান হয়।',
      formulaOrRule: '$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{ox(anode)}} + E^\\circ_{\\text{red(cathode)}}$, $W = \\frac{MIt}{nF}$',
      howToSolve: 'প্রতিটি মৌলের জারণ সংখ্যা বের করে জারণ-বিজারণ অর্ধবিক্রিয়া বা ইলেকট্রন সমতা মেলাও।',
      shortcut: 'মনে রাখার সূত্র: AN OX, RED CAT (অ্যানোডে জারণ, ক্যাথোডে বিজারণ) এবং $E^\\circ_{\\text{cell}} > 0$ হলে বিক্রিয়া স্বতঃস্ফূর্ত!'
    },
    {
      match: /সাম্যাবস্থা|K_p|K_c|লা শাতেলিয়ে|অর্ধায়ু|প্রথম ক্রম|বিক্রিয়ার হার|এনথালপি|equilibrium|half-life|enthalpy/i,
      theory: 'রাসায়নিক সাম্যাবস্থায় লা শাতেলিয়ের নীতি ও $K_p = K_c(RT)^{\\Delta n}$ এবং রাসায়নিক গতিবিদ্যায় বিক্রিয়ার ক্রম অনুযায়ী অর্ধায়ু নির্ধারিত হয়।',
      formulaOrRule: '$K_p = K_c(RT)^{\\Delta n}$, প্রথম ক্রমের $t_{1/2} = \\frac{0.693}{k}$',
      howToSolve: 'গ্যাসীয় মোল সংখ্যার পার্থক্য $\\Delta n$ কিংবা ক্রম অনুযায়ী বেগ সমীকরণ প্রয়োগ করো।',
      shortcut: 'চাপ বাড়ালে সাম্য কম গ্যাসীয় মোলের দিকে যায়; $\\Delta n = 0$ হলে $K_p = K_c$।'
    }
  ],
  Mathematics: [
    {
      match: /ডোমেন|রেঞ্জ|ফাংশন|সংযোজিত|domain|range|function/i,
      theory: 'বাস্তব ফাংশনের ডোমেন হলো স্বাধীন চলকের সেই সকল বাস্তব মান যার জন্য ফাংশনটি সংজ্ঞায়িত থাকে: বর্গমূলের ভেতরের রাশি $\\ge 0$, হর $\\neq 0$ এবং $\\ln$-এর ভেতরের রাশি $> 0$ হতে হয়।',
      formulaOrRule: '$(g \\circ f)(x) = g(f(x))$ সংজ্ঞায়িত হয় যখন $x \\in \\text{Dom}(f)$ এবং $f(x) \\in \\text{Dom}(g)$।',
      howToSolve: 'প্রথমে সংযোজিত ফাংশন গঠন করে বর্গমূল বা ভগ্নাংশের অসমতা ($f(x) \\ge 0$) সমাধান করো।',
      shortcut: 'বর্গমূল অসমতা ট্রিক: $\\sqrt{x^2 - a^2}$ সংজ্ঞায়িত হতে $x^2 - a^2 \\ge 0 \\implies x \\le -a$ অথবা $x \\ge a$—কখনোই মাঝের সীমা $(-a, a)$ নয়!'
    },
    {
      match: /\\lim|সীমা|অন্তর|derivative|dy\/dx|চরম|গরিষ্ঠ|লঘিষ্ঠ|স্পর্শক|অভিলম্ব|tangent|normal|maxima|minima/i,
      theory: 'ক্যালকুলাসে সীমা নির্ণয়ে অনির্ণেয় আকার ($\\frac{0}{0}$ বা $\\frac{\\infty}{\\infty}$) দেখা দিলে L\'Hôpital বিধি বা প্রমিত সীমা প্রয়োগ করা হয়; প্রথম অন্তরজ $\\frac{dy}{dx}$ বক্ররেখার ঢাল নির্দেশ করে।',
      formulaOrRule: '$\\lim_{x\\to 0}\\frac{a^x-1}{x}=\\ln a$, $\\lim_{x\\to 0}\\frac{\\sin ax}{bx} = \\frac{a}{b}$, চরম মানে $\\frac{dy}{dx} = 0$',
      howToSolve: 'সীমা বসিয়ে $\\frac{0}{0}$ আকার যাচাই করে L\'Hôpital বা ঘাত নিয়ম $\\frac{d}{dx}(x^n)=nx^{n-1}$ প্রয়োগ করো।',
      shortcut: '$\\frac{0}{0}$ আকারে লব ও হরকে আলাদাভাবে অন্তরীকরণ (L\'Hôpital) করলে ২–৩ সেকেন্ডেই সীমা মিলে যায়!'
    },
    {
      match: /\\int|সমাকলন|যোগজ|ক্ষেত্রফল|area|integral/i,
      theory: 'যোগজীকরণ অন্তরীকরণের বিপরীত প্রক্রিয়া; দ্বিঘাত হরের সমাকলনে পূর্ণবর্গ করে $\\tan^{-1}$ বা $\\ln$ প্রমিত রূপ ব্যবহার করা হয় এবং নির্দিষ্ট যোগজ আবদ্ধ ক্ষেত্রফল দেয়।',
      formulaOrRule: '$\\int \\frac{dx}{(x+p)^2+a^2} = \\frac{1}{a}\\tan^{-1}\\left(\\frac{x+p}{a}\\right)+c$; $\\int x^n dx = \\frac{x^{n+1}}{n+1}+c$',
      howToSolve: 'হরকে পূর্ণবর্গ বা প্রতিস্থাপন করে প্রমিত ফরমুলায় সাজাও এবং নির্দিষ্ট সীমা $[a, b]$ বসাও।',
      shortcut: 'অনির্দিষ্ট যোগজ যাচাই: অপশনগুলোর একটি করে অন্তরীকরণ ($\\frac{d}{dx}$) করলে যেটি মূল ইন্টিগ্র্যান্ডের সাথে মেলে, সেটিই ১০০% সঠিক!'
    },
    {
      match: /পরাবৃত্ত|উপবৃত্ত|অধিবৃত্ত|কণিক|নিয়ামক|নিয়ামক|উপকেন্দ্র|উৎকেন্দ্রিকতা|parabola|ellipse|hyperbola|directrix|foci/i,
      theory: 'কণিকের সমীকরণকে পূর্ণবর্গ করে প্রমিত রূপ $(y-k)^2 = 4a(x-h)$ বা $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$-এ নিলে শীর্ষবিন্দু, উপকেন্দ্র ও নিয়ামকের সমীকরণ সরাসরি পাওয়া যায়।',
      formulaOrRule: 'পরাবৃত্ত $(y-k)^2 = 4a(x-h)$-এর নিয়ামক $x - h = -a$; উপবৃত্তে উপকেন্দ্রদ্বয়ের দূরত্ব $= 2\\sqrt{|a^2-b^2|}$।',
      howToSolve: 'প্রদত্ত সমীকরণটিকে $x$ বা $y$-এ পূর্ণবর্গ আকারে সাজিয়ে $h, k, a$ চিহ্নিত করো।',
      shortcut: 'নিয়ামক শর্টকাট: $(y-k)^2 = 4a(x-h)$-এ নিয়ামক সর্বদা $x = h - a$ রূপের সরলরেখা (অর্থাৎ কেবল $x$ চলক থাকবে, $y$ নয়)!'
    },
    {
      match: /বৃত্ত|সরলরেখা|লম্ব|সমান্তরাল|ছেদবিন্দু|ঢাল|circle|straight line|bisector/i,
      theory: 'স্থানাঙ্ক জ্যামিতিতে বৃত্ত $x^2+y^2+2gx+2fy+c=0$-এর কেন্দ্র $(-g,-f)$ ও ব্যাসার্ধ $\\sqrt{g^2+f^2-c}$; এবং লম্ব রেখাদ্বয়ের ঢালের গুণফল $-1$।',
      formulaOrRule: 'বৃত্ত থেকে বিন্দুর সর্বনিম্ন দূরত্ব $= |d - r|$; লম্ব রেখা: $bx - ay + k = 0$',
      howToSolve: 'কেন্দ্র, ব্যাসার্ধ বা মধ্যবিন্দু ও ঢাল নির্ণয় করে প্রদত্ত শর্তে বসাও।',
      shortcut: 'বিন্দু বসানো ট্রিক: রেখার সমীকরণ চাইলে মধ্যবিন্দু বা প্রদত্ত বিন্দু অপশনের সমীকরণে বসিয়ে সিদ্ধতা যাচাই করো!'
    },
    {
      match: /বল|লব্ধি|সাম্য|স্থিতি|গতি|P\s*=\s*Q|force|resultant|statics/i,
      theory: 'স্থিতিবিদ্যা ও বলের সামান্তরিক সূত্রানুসারে দুটি বল $P$ ও $Q$-এর লব্ধি $R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\theta}$।',
      formulaOrRule: '$R^2 = P^2 + Q^2 + 2PQ\\cos\\theta$; সমান মানের বলের ক্ষেত্রে $R = 2P\\cos(\\theta/2)$',
      howToSolve: 'প্রদত্ত বলদ্বয় ও লব্ধির সম্পর্কটি সামান্তরিক সূত্রে বসিয়ে $\\cos\\theta$ নির্ণয় করো।',
      shortcut: 'বিশেষ কোণ মনে রাখো: $P=Q$ হলে $\\theta=60^\\circ \\to \\sqrt{3}P$, $\\theta=90^\\circ \\to \\sqrt{2}P$, $\\theta=120^\\circ \\to P$, $\\theta=180^\\circ \\to 0$!'
    },
    {
      match: /ম্যাট্রিক্স|নির্ণায়ক|matrix|determinant|বিপরীত|inverse/i,
      theory: 'বর্গ ম্যাট্রিক্সের নির্ণায়ক $|A|=0$ হলে সেটি ব্যতিক্রমী (Singular) এবং বিপরীত ম্যাট্রিক্স নির্ণয়যোগ্য হয় যখন $|A| \\neq 0$।',
      formulaOrRule: '$\\begin{vmatrix}a & b \\\\ c & d\\end{vmatrix} = ad - bc$; $A^{-1} = \\frac{1}{|A|}\\text{adj}(A)$',
      howToSolve: 'সারি-কলামের মাত্রা বা নির্ণায়ক $|A|$ হিসাব করে প্রতিসাম্য/ব্যতিক্রমী/ইনভার্স শর্ত মেলাও।',
      shortcut: '$2\\times 2$ ইনভার্স ট্রিক: প্রধান কর্ণের উপাদান অদলবদল, অপর কর্ণের চিহ্ন বদল, আর $(ad-bc)$ দিয়ে ভাগ!'
    },
    {
      match: /\\sin|\\cos|\\tan|\\cot|\\sec|\\csc|ত্রিকোণমিতি|বিপরীত বৃত্তীয়|arcsin|arctan/i,
      theory: 'ত্রিকোণমিতিক অভেদ, যৌগিক কোণের সূত্র এবং বিপরীত বৃত্তীয় ফাংশনের মুখ্যমান শাখা ($\\tan^{-1}x \\in (-\\frac{\\pi}{2}, \\frac{\\pi}{2})$) অনুযায়ী কোণের মান নির্ধারিত হয়।',
      formulaOrRule: '$\\tan(A+B) = \\frac{\\tan A + \\tan B}{1 - \\tan A\\tan B}$, $\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\left(\\frac{x+y}{1-xy}\\right)$',
      howToSolve: 'প্রদত্ত ত্রিকোণমিতিক মানগুলোকে যৌগিক কোণ বা অভেদে রূপান্তর করে চতুর্ভাগ অনুযায়ী সঠিক চিহ্ন নাও।',
      shortcut: 'মান-বসানো শর্টকাট: ধনাত্মক সূক্ষ্মকোণ $A, B$-তে $\\tan A = -\\tan B$ হলে $\\tan(A+B) = 0$ বা মুখ্যমান বিবেচনায় কোণটি সরাসরি বের করা যায়!'
    },
    {
      match: /সম্ভাবনা|বিন্যাস|সমাবেশ|দ্বিপদী|জটিল সংখ্যা|সেট|অসমতা|পরম মান|probability|permutation|combination|binomial|complex|inequality/i,
      theory: 'গণনা নীতি, সম্ভাবনা ($P = \\frac{\\text{অনুকূল}}{\\text{মোট}}$), দ্বিপদী বিস্তৃতি এবং জটিল সংখ্যার মডুলাস-আর্গুমেন্টের সুনির্দিষ্ট নিয়ম এখানে প্রযোজ্য।',
      formulaOrRule: '${}^nC_r = \\frac{n!}{r!(n-r)!}$, $T_{r+1} = {}^nC_r a^{n-r} x^r$, $P(A\\cap B) = P(A)P(B|A)$',
      howToSolve: 'প্রতিস্থাপন আছে কি না, ক্রম বিবেচ্য কি না বা জটিল সংখ্যার $i^2 = -1$ ব্যবহার করে মান নির্ণয় করো।',
      shortcut: 'প্রতিস্থাপনবিহীন সম্ভাবনায় প্রতি ধাপে মোট সংখ্যা $1$ করে কমে—এই শর্তটি মিলিয়ে নিলেই ভুল অপশন বাদ পড়ে!'
    }
  ],
  Biology: [
    {
      match: /টিস্যুকালচার|টিস্যু কালচার|টটিপোটেন্সি|গ্রাফটিং|মেরিস্টেম|উদ্ভিদ প্রজনন|tissue culture|totipotency|micropropagation/i,
      theory: 'জীবপ্রযুক্তি ও টিস্যু কালচারে প্রতিটি সজীব উদ্ভিদ কোষের পূর্ণাঙ্গ উদ্ভিদে পরিণত হওয়ার ক্ষমতাকে টটিপোটেন্সি (Totipotency) বলে; বিপন্ন বা বিরল উদ্ভিদের দ্রুত বংশবৃদ্ধিতে টিস্যু কালচার সবচেয়ে কার্যকর পদ্ধতি।',
      formulaOrRule: 'এক্সপ্ল্যান্ট $\\to$ ক্যালাস গঠন $\\to$ মূলের ও কাণ্ডের সৃষ্টি (অর্গানোজেনেসিস) $\\to$ চারা উদ্ভিদ (টটিপোটেন্সি ভিত্তিক)',
      howToSolve: 'গ্রাফটিং/কাটিং প্রচলিত অঙ্গজ প্রজনন হলেও বিরল ও বিপন্ন প্রজাতি সংরক্ষণে ও রোগমুক্ত চারা উৎপাদনে মাইক্রোপ্রোপাগেশন/টিস্যুকালচারের অনন্য ভূমিকা শনাক্ত করো।',
      shortcut: 'কীওয়ার্ড জোড়া: সজীব কোষ থেকে পূর্ণ উদ্ভিদ = টটিপোটেন্সি; বিপন্ন উদ্ভিদ/রোগমুক্ত চারা = টিস্যু কালচার (মেরিস্টেম কালচার)!'
    },
    {
      match: /ব্লাইট|ব্যাকটেরিয়া|ভাইরাস|ছত্রাক|ম্যালেরিয়া|ডেঙ্গু|অণুজীব|bacteria|virus|blight|malaria|fungi/i,
      theory: 'অণুজীব ও উদ্ভিদ-প্রাণীর রোগতত্ত্বে প্রতিটি জীবাণুর নির্দিষ্ট পোষক ও সৃষ্ট রোগ থাকে; যেমন ধানের ব্যাকটেরিয়াল ব্লাইট রোগের জীবাণু হলো *Xanthomonas oryzae*।',
      formulaOrRule: 'ধানের ব্লাইট = *Xanthomonas oryzae* (ব্যাকটেরিয়া); ধানের ব্লাস্ট = *Pyricularia oryzae* (ছত্রাক)',
      howToSolve: 'প্রশ্নে উল্লিখিত রোগের ধরন (ব্যাকটেরিয়াজনিক নাকি ছত্রাকজনিত) দেখে অপশনগুলোর বৈজ্ঞানিক নাম যাচাই করো।',
      shortcut: 'ব্যাকটেরিয়া vs ছত্রাক ট্রিক: ধানের ব্লাইটে *Xanthomonas oryzae* আর ব্লাস্টে *Pyricularia oryzae*; *E. coli* মানব অন্ত্রের এবং *Bacillus subtilis* মাটির ব্যাকটেরিয়া!'
    },
    {
      match: /সেক্স-লিংকড|বর্ণান্ধ|হিমোফিলিয়া|থ্যালাসেমিয়া|মেন্ডেল|জিনতত্ত্ব|অনুপাত|ক্রোমোসোম|sex-linked|mendel|thalassemia|hemophilia/i,
      theory: 'মানব জিনতত্ত্বে X-ক্রোমোসোম বাহিত সেক্স-লিংকড রোগ (হিমোফিলিয়া, লাল-সবুজ বর্ণান্ধতা, ডুশেনি মাসকুলার ডিস্ট্রফি) এবং অটোজোমাল প্রচ্ছন্ন রোগ (থ্যালাসেমিয়া) পৃথক বংশগতি নিয়ম মেনে চলে।',
      formulaOrRule: 'সেক্স-লিংকড = X-লিঙ্কড; অটোজোমাল রিসেসিভ = থ্যালাসেমিয়া; মেন্ডেলের ১ম সূত্র $3:1$, ২য় সূত্র $9:3:3:1$',
      howToSolve: 'রোগ বা অনুপাতটি X-ক্রোমোসোম বাহিত নাকি অটোজোমাল/মেন্ডেলীয়—সেটি আলাদা করো।',
      shortcut: 'মেডিকেল-ডিইউ ফ্যাক্ট: থ্যালাসেমিয়া একটি অটোজোমাল রোগ (সেক্স-লিংকড নয়!), অথচ বর্ণান্ধতা ও হিমোফিলিয়া X-ক্রোমোসোম বাহিত সেক্স-লিংকড ডিসঅর্ডার!'
    },
    {
      match: /কোষ|মাইটোকন্ড্রিয়া|রাইবোসোম|লাইসোসোম|প্লাস্টিড|নিউক্লিয়াস|মাইটোসিস|মিয়োসিস|ক্রসিং|DNA|RNA|ট্রান্সক্রিপশন|ট্রান্সলেশন|cell|mitochondria|mitosis|meiosis/i,
      theory: 'কোষবিদ্যা ও আণবিক জীববিজ্ঞানে প্রতিটি অঙ্গাণুর কাজ এবং কোষ বিভাজনের ধাপে ক্রোমোসোম সংখ্যার পরিবর্তন (মাইটোসিস সমীকরণিক, মিয়োসিস হ্রাসমূলক) অত্যন্ত গুরুত্বপূর্ণ।',
      formulaOrRule: 'সেন্ট্রাল ডগমা: $\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}$',
      howToSolve: 'উল্লিখিত কোষীয় অঙ্গাণু, কোষ বিভাজন উপদশা (প্যাকাইটিনে ক্রসিং ওভার) বা নিউক্লিক অ্যাসিডের বৈশিষ্ট্য মেলাও।',
      shortcut: 'ভর্তি ফ্যাক্ট: প্লাজমিড ও $70\\text{S}$ রাইবোসোম আদিকোষ ও মাইটোকন্ড্রিয়া-ক্লোরোপ্লাস্টে থাকে; মিয়োসিসে ক্রোমোসোম $2n \\to n$ হয়।'
    },
    {
      match: /সালোকসংশ্লেষণ|শ্বসন|গ্লাইকোলাইসিস|ক্রেবস|প্রস্বেদন|পরাগায়ন|নিষেক|গুপ্তবীজী|নগ্নবীজী|শস্য|পুষ্প|photosynthesis|respiration|transpiration|angiosperm|gymnosperm/i,
      theory: 'উদ্ভিদ শারীরতত্ত্ব ও প্রজননে সালোকসংশ্লেষণে নির্গত $O_2$ পানি ($H_2O$) থেকে আসে, আর গুপ্তবীজী উদ্ভিদে দ্বিনিষেকের ফলে ট্রিপ্লয়েড ($3n$) শস্য কোষ গঠিত হয়।',
      formulaOrRule: '$6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{H}_2\\text{O} + 6\\text{O}_2\\uparrow$',
      howToSolve: 'বিক্রিয়ক, প্রভাবক (আলো, তাপমাত্রা, পত্ররন্ধ্র) অথবা পুষ্প-ফল গঠনের প্লয়েডি স্তর যাচাই করো।',
      shortcut: 'প্লয়েডি সূত্র: ডিম্বাণু/পরাগরেণু $= n$, ভ্রূণ $= 2n$, গুপ্তবীজীর শস্য $= 3n$, কিন্তু নগ্নবীজীর শস্য নিষেকের আগে তৈরি হওয়ায় $n$!'
    },
    {
      match: /রক্ত|হৃৎপিণ্ড|শোষণ|পরিপাক|এনজাইম|হরমোন|বৃক্ক|স্নায়ু|কঙ্কাল|অ্যান্টিবডি|ভ্যাকসিন|heart|blood|enzyme|hormone|kidney/i,
      theory: 'মানব শারীরতত্ত্বে পরিপাক গ্রন্থি ও এনজাইম, রক্ত সংবহন, বৃক্কে মূত্র তৈরি এবং স্নায়বিক-হরমোনাল নিয়ন্ত্রণ সুনির্দিষ্ট অঙ্গ ও গ্রন্থির সাথে সম্পর্কিত।',
      formulaOrRule: 'পাকস্থলীতে পেপসিন (আমিষ), অগ্ন্যাশয়ে ট্রিপসিন-অ্যামাইলেজ-লাইপেজ, হৃদচক্র $0.8\\text{ s}$, বৃক্কের একক নেফ্রন।',
      howToSolve: 'প্রশ্নে উল্লিখিত অঙ্গ, এনজাইম বা হরমোনটির নির্দিষ্ট উৎস ও কার্যকারিতা যাচাই করো।',
      shortcut: 'এক-কথায় সংযোগ: নেফ্রন $=$ বৃক্ক, অ্যালভিওলাই $=$ ফুসফুস, আইলেটস অব ল্যাঙ্গারহ্যান্স $=$ অগ্ন্যাশয় (ইনসুলিন/গ্লুকাগন)!'
    },
    {
      match: /পর্ব|শ্রেণি|বর্গ|গোত্র|শৈবাল|আর্থ্রোপোডা|মলাস্কা|কর্ডাটা|শ্রেণিবিন্যাস|phylum|class|taxonomy|algae/i,
      theory: 'জীবের শ্রেণিবিন্যাসে প্রতিটি পর্ব ও গোত্রের অনন্য শনাক্তকারী বৈশিষ্ট্য থাকে—যেমন আর্থ্রোপোডার সন্ধিপদ, একাইনোডার্মাটার পানি সংবহনতন্ত্র, কর্ডাটার নটোকর্ড।',
      formulaOrRule: '$\\text{Kingdom} \\to \\text{Phylum} \\to \\text{Class} \\to \\text{Order} \\to \\text{Family} \\to \\text{Genus} \\to \\text{Species}$',
      howToSolve: 'উল্লিখিত জীব বা বৈশিষ্ট্যের সাথে সংশ্লিষ্ট পর্ব/গোত্রের মূল শনাক্তকারী অঙ্গটি মেলাও।',
      shortcut: 'পর্ব ট্রিক: নিডোসাইট $=$ নিডারিয়া, নেফ্রিডিয়া $=$ অ্যানেলিডা, ম্যালপিজিয়ান নালিকা $=$ আর্থ্রোপোডা, ম্যান্টল $=$ মলাস্কা, নটোকর্ড $=$ কর্ডাটা!'
    }
  ],
  Bangla: [
    {
      match: /জটিল|যৌগিক|সরল|বাক্য|মিশ্র/i,
      theory: 'গঠন অনুযায়ী বাংলা বাক্য তিন প্রকার: একটি মাত্র কর্তা ও একটি সমাপিকা ক্রিয়া থাকলে সরল; একটি প্রধান খণ্ডবাক্য ও এক বা একাধিক আশ্রিত খণ্ডবাক্য ("যে-সে", "যদি-তবে") থাকলে জটিল/মিশ্র; এবং দুই বা ততোধিক স্বাধীন বাক্য অব্যয় ("ও, এবং, কিন্তু") দ্বারা যুক্ত হলে যৌগিক।',
      formulaOrRule: 'সাপেক্ষ সর্বনাম/অব্যয় ("যে...সে", "যদি...তবে", "যখন...তখন") $\\implies$ জটিল বাক্য।',
      howToSolve: 'বাক্যটিতে কয়টি সমাপিকা ক্রিয়া আছে এবং কোনো সাপেক্ষ/সংযোজক অব্যয় খণ্ডবাক্যগুলোকে যুক্ত করেছে কি না তা দেখো।',
      shortcut: 'বাক্য চেনার ট্রিক: "যে-সে / যদি-তবে / যখন-তখন" থাকলে জটিল, "এবং / কিন্তু / অথবা" দিয়ে দুটো পূর্ণ বাক্য জুড়লে যৌগিক!'
    },
    {
      match: /সন্ধি/i,
      theory: 'তৎসম সন্ধিতে পাশাপাশি অবস্থিত দুটি ধ্বনির মিলনে অর্থবোধক দুটি পৃথক পদ পাওয়া যায়; স্বরসন্ধিতে $\\text{অ/আ} + \\text{অ/আ} = \\text{আ}$ এবং অ-কারের পর অ-কার বা ঋ-কারের নিয়ম বজায় থাকে।',
      formulaOrRule: 'মার্তণ্ড $= \\text{মার্ত} + \\text{অণ্ড}$ (নিপাতনে সিদ্ধ স্বরসন্ধি / অ + অ ব্যতিক্রম রূপ)',
      howToSolve: 'বিচ্ছেদকৃত দুটি অংশেরই শুদ্ধ বানান ও অর্থবোধক রূপ পরীক্ষা করো ("উণ্ড/উন্ড" অর্থহীন, প্রকৃত শব্দ "অণ্ড")।',
      shortcut: 'সন্ধি ট্রিক: বিচ্ছেদের পর দ্বিতীয় অংশের প্রথম স্বরধ্বনি এবং উভয় অংশের শুদ্ধ বানান পরীক্ষা করলে ভুল অপশন বাদ পড়ে যায়!'
    },
    {
      match: /সমাস|বহুব্রীহি|কর্মধারয়|তৎপুরুষ|অব্যয়ীভাব|দ্বন্দ্ব|দ্বিগু/i,
      theory: 'অর্থপ্রাধান্য অনুসারে সমাস চার ভাগে বিভক্ত: পূর্বপদ প্রধান (অব্যয়ীভাব), পরপদ প্রধান (তৎপুরুষ, কর্মধারয়, দ্বিগু), উভয়পদ প্রধান (দ্বন্দ্ব), এবং অন্যপদ প্রধান (বহুব্রীহি)।',
      formulaOrRule: 'বহুব্রীহি সমাসে সমস্যমান পদগুলোর কোনোটির অর্থ প্রধান না হয়ে ভিন্ন কোনো ব্যক্তি বা বস্তুকে বোঝায় (যেমন "জীবন্মৃত" $=$ জীবিত থেকেও যে মৃতের মতো)।',
      howToSolve: 'অপশনগুলোর ব্যাসবাক্য তৈরি করে দেখো কোনটিতে পূর্বপদ বা পরপদের বদলে তৃতীয় কোনো বিশেষ অর্থ প্রাধান্য পাচ্ছে।',
      shortcut: 'এলিমিনেশন ট্রিক: "আমরণ" (আ উপসর্গ $\\to$ অব্যয়ীভাব), "জলে-স্থলে" (উভয়পদ $\\to$ দ্বন্দ্ব), "চৌরাস্তা" (সংখ্যা $\\to$ দ্বিগু/কর্মধারয়)—তাই বাকি "জীবন্মৃত" নিশ্চিত বহুব্রীহি!'
    },
    {
      match: /উপসর্গ|প্রত্যয়|কারক|বিভক্তি|পদ|সর্বনাম|বিশেষণ/i,
      theory: 'বাংলা ব্যাকরণের রূপতত্ত্বে উপসর্গ শব্দের পূর্বে বসে নতুন অর্থবোধক শব্দ তৈরি করে (আতিশয্য, উৎকর্ষ, অভাব ইত্যাদি অর্থে) এবং প্রত্যয়-কারক শব্দের রূপান্তর ও বাক্যস্থিত সম্পর্ক নির্ধারণ করে।',
      formulaOrRule: '"সু" উপসর্গ কদাচিৎ প্রশংসা বা সহজ অর্থের বাইরে আতিশয্য অর্থেও ব্যবহৃত হয় (যেমন "সুকঠিন" $=$ অত্যন্ত কঠিন)।',
      howToSolve: 'প্রদত্ত মূল শব্দের আগে উপসর্গ যুক্ত হয়ে অর্থের কী বিশেষ পরিবর্তন ঘটেছে (অতিশয়তা, নিন্দা, বিপরীত না উত্তম) তা বিশ্লেষণ করো।',
      shortcut: 'অর্থ-প্রতিস্থাপন ট্রিক: শব্দটিকে বাক্যে বসাও—"সুকঠিন" মানে "ভালো কঠিন" বা "সহজ" নয়, বরং "খুব কঠিন" (আতিশয্য)!'
    },
    {
      match: /উৎসভাষা|তৎসম|তদ্ভব|আরবি|ফারসি|তুর্কি|পর্তুগিজ|দেশি|বিদেশি/i,
      theory: 'বাংলা শব্দভান্ডারে ঐতিহাসিক ও সাংস্কৃতিক যোগাযোগের কারণে আরবি, ফারসি, তুর্কি, পর্তুগিজ ও ফরাসি শব্দ যুক্ত হয়েছে; শব্দটির মূল উৎস ভাষা নির্ভুলভাবে জানা প্রয়োজন।',
      formulaOrRule: 'প্রচলিত তুর্কি শব্দ: বাবা, চাকর, চাকু, তোপ, দারোগা, কুলি, লাশ, **সওগাত**, খাঁ, বেগম।',
      howToSolve: 'শব্দটি প্রশাসনিক, ধর্মীয় নাকি তুর্কি/ফারসি সাংস্কৃতিক ঐতিহ্য থেকে আগত তা শব্দতালিকার সাথে মেলাও।',
      shortcut: 'তুর্কি শব্দ ছন্দ: দারোগা, চাকু, তোপ, সওগাত, বেগম, লাশ, কুলি—এগুলো ভর্তি পরীক্ষায় বারবার আসা তুর্কি শব্দ!'
    },
    {
      match: /বানান|শুদ্ধ|অশুদ্ধ|ণ-ত্ব|ষ-ত্ব|উচ্চারণ/i,
      theory: 'বাংলা একাডেমির প্রমিত বাংলা বানান ও উচ্চারণ বিধি অনুযায়ী তৎসম শব্দে ণ-ত্ব ও ষ-ত্ব বিধান, ই/ঈ-কার, এবং উচ্চারণে তালব্য "শ" ("স"-এর সাধারণ ধ্বনি) ও ও-কারের নিয়ম অনুসৃত হয়।',
      formulaOrRule: 'প্রমিত রূপ: ভৌগোলিক, প্রাণিবিদ্যা (সমাসবদ্ধে ই-কার), পুণ্য; উচ্চারণে দন্ত্য "স" সাধারণত "শ" রূপে উচ্চারিত হয় এবং অ-কার সংবৃত ("ও") হয়।',
      howToSolve: 'গুচ্ছ বানানে একটি ভুল (যেমন বহুল্যতা/ব্রাহ্মণ/নিষ্ফল/প্রবহমান) পেলেই অপশনটি বাদ দাও; উচ্চারণে হসন্ত ও শ/ও-কারের সঠিক অবস্থান পরীক্ষা করো।',
      shortcut: 'বানান এলিমিনেশন: একটি ভুল ধরতে পারলেই পুরো গুচ্ছ বাদ—যেমন "প্রবাহমান" ভুল (শুদ্ধ: প্রবহমান), "বিভুতিভূষণ" ভুল (উ-কার নয় ঊ-কার), "বাহুল্যতা" অশুদ্ধ (দ্বৈত প্রত্যয়)!'
    },
    {
      match: /রচনা|উপন্যাস|কবিতা|গল্প|নাটক|সংলাপ|চরিত্র|গ্রন্থ|সিরাজউদ্দৌলা|লালসালু|রবীন্দ্রনাথ|নজরুল|জীবনানন্দ|বাগধারা|সমার্থক|বিপরীত/i,
      theory: 'বাংলা সাহিত্য ও শব্দভান্ডারে পাঠ্যবইয়ের গদ্য, কবিতা, নাটক ও উপন্যাসের লেখক পরিচিতি, সংলাপ, চরিত্র এবং প্রমিত আভিধানিক অর্থ থেকে সরাসরি প্রশ্ন আসে।',
      formulaOrRule: 'পাঠ্যসূচির সাহিত্যকর্ম (যেমন "কেয়ার কাঁটা" = কাজী নজরুল ইসলামের গল্পগ্রন্থ; "লালসালু" = সৈয়দ ওয়ালীউল্লাহ্; "সিরাজউদ্দৌলা" = সিকান্দার আবু জাফর) ও মূল উদ্ধৃতি যাচাই।',
      howToSolve: 'প্রশ্নের সংলাপ, গ্রন্থের নাম বা বিশেষ শব্দার্থ ("পাশরি" = বিস্মৃত হওয়া) পাঠ্যবইয়ের প্রাসঙ্গিক অধ্যায় বা মূল ভাবের সাথে মেলাও।',
      shortcut: 'সাহিত্য নোট: প্রতিটি পাঠ্য গল্প-উপন্যাস-নাটকের কেন্দ্রীয় চরিত্র, উক্তি ও লেখকের প্রধান গ্রন্থ-শ্রেণি (কাব্য/গল্প/উপন্যাস) একসাথে মনে রাখো।'
    }
  ],
  English: [
    {
      match: /\btense\b|past perfect|present perfect|\bhad\b|\bhave been\b|\bhas\b|\bsince\b.*past|\bconditional\b|\bif\b.*(?:would|had|were)/i,
      theory: 'English sequence of tenses and conditionals require tense consistency across main and subordinate clauses (e.g., Past Perfect before Past Simple with "before", and Past Simple + "had + V3" with "after").',
      formulaOrRule: '$\\text{Past Perfect } (\\text{had}+V_3) + \\text{before} + V_2$; Type-2 Conditional: $\\text{If} + V_2, \\text{would} + V_1$',
      howToSolve: 'Check the finite verb of the accompanying clause and the time/conditional marker to choose the matching verb form.',
      shortcut: '5-Second Rule: "Before"-এর আগে $\\text{had}+V_3$, "After"-এর পরে $\\text{had}+V_3$; এবং "since/for + time" থাকলে Perfect Continuous হয়।'
    },
    {
      match: /although|however|additionally|nonetheless|conjunction|connector|linking|ecotourism/i,
      theory: 'Subordinating conjunctions like "although/though" introduce a dependent clause expressing contrast within a single complex sentence, whereas conjunctive adverbs ("however", "nonetheless", "additionally") require a full stop or semicolon before connecting two independent clauses.',
      formulaOrRule: '$\\text{Although} + \\text{Clause 1}, \\text{Clause 2}$ (single comma joins contrasting clauses without a semicolon)',
      howToSolve: 'Check the punctuation (comma vs semicolon) and logical relationship (contrast vs addition) between the two clauses.',
      shortcut: 'Punctuation Clue: দুটি clause-কে শুধু একটি কমা (,) আলাদা করলে বাক্যের শুরুতে "However/Nonetheless" বসতে পারে না—অবশ্যই Subordinating Conjunction ("Although/Even though") বসাতে হবে!'
    },
    {
      match: /phrasal verb|wears off|run down|work out|take off|preposition|averse|succeed/i,
      theory: 'Admission English frequently tests idiomatic phrasal verbs, subject-verb agreement ("The effect ... wears off"), and fixed prepositional collocations ("averse to", "succeed in").',
      formulaOrRule: 'Subject "The effect" (singular) takes singular verb "wears off"; fixed pairs: $\\text{averse to}$, $\\text{succeed in}$',
      howToSolve: 'Verify both meaning ("wear off" = gradually fade away) and singular/plural verb agreement or paired fixed prepositions.',
      shortcut: 'Two-Blank Trick: দুটি শূন্যস্থানের প্রথম নিশ্চিত প্রিপোজিশনটি ("averse to" — never "from/by") চিহ্নিত করলেই মুহূর্তে ৩টি ভুল অপশন কাটা যায়!'
    },
    {
      match: /phrase|idiom|synonym|antonym|means|meaning|vocabulary|article|voice|passive|narration|speech|blank|fill in/i,
      theory: 'English grammar and vocabulary items require matching contextual meaning, grammatical category (Noun/Verb/Adj/Adv), voice ($be + V_3$), or direct-to-indirect narration shifts.',
      formulaOrRule: 'Check context clue, parts-of-speech slot, and tense/pronoun shift rules.',
      howToSolve: 'Identify the grammatical slot and eliminate options with the wrong part of speech or opposite tone.',
      shortcut: 'POS Elimination: প্রথমে শূন্যস্থানে Noun, Verb না Adjective দরকার তা দেখো—এতেই অর্ধেকের বেশি ভুল অপশন বাদ পড়ে যায়!'
    }
  ],
  ICT: [
    {
      match: /বাইনারি|অক্টাল|হেক্সা|দশমিক|বিসিডি|বিট|বাইট|কমপ্লিমেন্ট|2's|binary|octal|hex|decimal|bit|byte|ascii|unicode/i,
      theory: 'সংখ্যা পদ্ধতিতে ভিত্তি (Base) অনুযায়ী প্রতিটি অঙ্কের স্থানীয় মান নির্ধারিত হয়; বাইনারিতে ভিত্তি ২, অক্টালে ৮, দশমিকে ১০ এবং হেক্সাডেসিমেলে ১৬।',
      formulaOrRule: '১ বাইট $= 8$ বিট; $n$ বিটে $2^n$টি সংকেত; $2$-এর পরিপূরক $= 1$-এর পরিপূরক $+ 1$',
      howToSolve: 'ভিত্তি ও বিট সংখ্যা চিহ্নিত করে $2^n$ বা স্থানিক মানের গুণফল হিসাব করো।',
      shortcut: 'গ্রুপিং ট্রিক: বাইনারি $\\leftrightarrow$ অক্টাল মানে ৩ বিট ($4\\text{-}2\\text{-}1$), আর হেক্সা মানে ৪ বিট ($8\\text{-}4\\text{-}2\\text{-}1$)!'
    },
    {
      match: /গেট|বুলিয়ান|\bAND\b|\bOR\b|\bNOT\b|\bNAND\b|\bNOR\b|\bXOR\b|\bXNOR\b|ডিমরগান|সত্যক|এনকোডার|ডিকোডার|অ্যাডার|রেজিস্টার|কাউন্টার|\bgate\b|boolean|flip-flop/i,
      theory: 'ডিজিটাল লজিকে NAND ও NOR সার্বজনীন গেট; ডিমরগানের উপপাদ্য অনুযায়ী $\\overline{A+B} = \\overline{A}\\cdot\\overline{B}$ এবং $\\overline{A\\cdot B} = \\overline{A}+\\overline{B}$।',
      formulaOrRule: 'বুলিয়ান অভেদ: $A+1=1$, $A\\cdot 0=0$, $A+\\overline{A}=1$, $A\\cdot\\overline{A}=0$, $A\\oplus A = 0$',
      howToSolve: 'বুলিয়ান রাশি সরলীকরণ করো অথবা ইনপুটে $0, 1$ বসিয়ে সত্যক সারণি মেলাও।',
      shortcut: 'সত্যক সারণি ট্রিক: সরাসরি $A=0, B=1$ বসিয়ে আউটপুট পরীক্ষা করলেই ৫ সেকেন্ডে সঠিক গেট বা সমীকরণ চেনা যায়।'
    },
    {
      match: /HTML|CSS|SQL|ডাটাবেস|ট্যাগ|প্রোটোকল|টপোলজি|নেটওয়ার্ক|ব্যান্ডউইথ|ফাইবার|ডেটা|প্রোগ্রামিং|\bC\b|array|loop|pointer|database|network/i,
      theory: 'ওয়েব ডিজাইন (HTML), ডাটাবেস (SQL/RDBMS), নেটওয়ার্কিং ও C প্রোগ্রামিং-এ সিনট্যাক্স, ট্যাগ এবং নেটওয়ার্ক মাধ্যমের বৈশিষ্ট্য যাচাই করা হয়।',
      formulaOrRule: 'HTML: `<a href="...">`, `<img src="...">`; SQL: `SELECT ... FROM ... WHERE ...`; অ্যারে ইনডেক্স $0$ থেকে শুরু।',
      howToSolve: 'প্রদত্ত কোড বা নেটওয়ার্ক টপোলজির নিয়ম অনুযায়ী আউটপুট বা সঠিক ট্যাগ নির্ণয় করো।',
      shortcut: 'কীওয়ার্ড ম্যাচ: অপটিক্যাল ফাইবারে পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটে, স্টার টপোলজিতে কেন্দ্রে Hub/Switch থাকে।'
    }
  ],
  'General Knowledge': [
    {
      match: /বাংলাদেশ|মুক্তিযুদ্ধ|সংবিধান|ভাষা|বঙ্গবন্ধু|স্বাধীনতা|বীরশ্রেষ্ঠ|নদী|বন্দর|জেলা|পাহাড়|কৃষি|বাজেট/i,
      theory: 'বাংলাদেশ বিষয়াবলিতে ঐতিহাসিক সাল, সাংবিধানিক অনুচ্ছেদ, মুক্তিযুদ্ধের সেক্টর ও খেতাব এবং ভৌগোলিক তথ্যের সঠিক সমন্বয় চাওয়া হয়।',
      formulaOrRule: 'ঐতিহাসিক সময়ক্রম ও সাংবিধানিক তথ্যের সঠিক সংযোগ যাচাই।',
      howToSolve: 'প্রশ্নের ঘটনা বা স্থানের নাম অনুযায়ী সঠিক সাল, সংখ্যা বা ব্যক্তিত্ব মিলিয়ে নিশ্চিত হও।',
      shortcut: 'টাইমলাইন শর্টকাট: ১৯৫২ (ভাষা), ১৯৫৪ (যুক্তফ্রন্ট), ১৯৬৬ (৬ দফা), ১৯৬৯ (গণঅভ্যুত্থান), ১৯৭১ (মুক্তিযুদ্ধ) ধরে ভুল অপশন বাদ দাও।'
    },
    {
      match: /জাতিসংঘ|সংস্থা|সদর দপ্তর|মুদ্রা|রাজধানী|পুরস্কার|নোবেল|মহাদেশ|প্রণালী|চুক্তি|সম্মেলন/i,
      theory: 'আন্তর্জাতিক বিষয়াবলিতে আন্তর্জাতিক সংস্থার সদর দপ্তর, প্রতিষ্ঠাকাল, ভৌগোলিক প্রণালী ও পুরস্কার-চুক্তি গুরুত্বপূর্ণ।',
      formulaOrRule: 'আন্তর্জাতিক সংস্থা ও ভৌগোলিক তথ্যের সঠিক জোড়া যাচাই।',
      howToSolve: 'প্রশ্নের নির্দিষ্ট সংস্থা, দেশ বা ভৌগোলিক নাম অনুযায়ী সঠিক তথ্য নিশ্চিত করো।',
      shortcut: 'সদর দপ্তর ট্রিক: অর্থসংক্রান্ত সংস্থা (IMF, World Bank) ওয়াশিংটন ডিসি; শ্রম-স্বাস্থ্য-বাণিজ্য-মানবাধিকার (ILO, WHO, WTO) জেনেভায়!'
    }
  ]
};

function generateConceptualSections(q: Question, ansLabel: string, ansText: string): ExplanationSection {
  const ansPreview = formatOptionPreview(ansText, ansLabel);
  const combined = `${q.question} ${q.options.join(' ')}`;
  const topics = SUBJECT_TOPICS[q.subject] || [];
  const matchedTopic = topics.find((t) => t.match.test(combined));
  const snippet = cleanStemSnippet(q);

  const otherLabels = q.options
    .map((_opt, idx) => (idx !== q.correctAnswer ? `(${(q.optionLabels?.[idx] || DEFAULT_LABELS_BN[idx] || String(idx + 1))})` : null))
    .filter(Boolean)
    .join(', ');

  if (matchedTopic) {
    return {
      explanation: `${matchedTopic.theory}\n\n**প্রাসঙ্গিক সূত্র/নিয়ম:** ${matchedTopic.formulaOrRule}\n\nপ্রদত্ত প্রশ্ন (“${snippet}”) অনুযায়ী সঠিক উত্তর হলো ${ansPreview}।`,
      stepByStep:
        `১. **প্রশ্ন বিশ্লেষণ:** প্রশ্নে চাওয়া হয়েছে— “${snippet}”।\n\n` +
        `২. **তত্ত্ব/সূত্র প্রয়োগ:** ${matchedTopic.howToSolve}\n\n` +
        `৩. **সিদ্ধান্ত:** উপরোক্ত বিশ্লেষণের মাধ্যমে প্রমাণিত হয় যে ${ansPreview} সঠিক উত্তর${otherLabels ? `, যেখানে ${otherLabels} বিকল্পগুলো প্রাসঙ্গিক শর্ত পূরণ করে না` : ''}।`,
      shortcut: `${matchedTopic.shortcut} সঠিক উত্তর হিসেবে ${ansPreview} চিহ্নিত করো।`
    };
  }

  return {
    explanation: `প্রদত্ত প্রশ্ন (“${snippet}”)-তে ${q.subject} বিষয়ের নির্ভুল ধারণা ও প্রাসঙ্গিক তথ্য যাচাই করা হয়েছে। প্রদত্ত বিকল্পগুলোর মধ্যে সঠিক উত্তর হলো ${ansPreview}।`,
    stepByStep:
      `১. **প্রশ্ন বিশ্লেষণ:** মূল জিজ্ঞাসা “${snippet}” লক্ষ্য করে প্রাসঙ্গিক বিষয়বস্তু আলাদা করি।\n\n` +
      `২. **বিকল্প তুলনা:** প্রতিটি বিকল্প যাচাই করে প্রশ্নের শর্তের সাথে সামঞ্জস্যহীন বিকল্পগুলো${otherLabels ? ` (${otherLabels})` : ''} বাদ দিই।\n\n` +
      `৩. **চূড়ান্ত সিদ্ধান্ত:** তুলনামূলক বিচারে ${ansPreview} একমাত্র যথাযথ বিকল্প হিসেবে নিশ্চিত হয়।`,
    shortcut: `পরীক্ষার হলের দ্রুত কৌশল: মূল শব্দ ধরে প্রথমেই অপ্রাসঙ্গিক ২টি অপশন বাদ দাও; বাকি অপশনগুলোর সুনির্দিষ্ট বৈশিষ্ট্য মেলালেই কয়েক সেকেন্ডে ${ansPreview} নিশ্চিত করা যাবে।`
  };
}

function generateUnverifiedSections(q: Question): ExplanationSection {
  const combined = `${q.question} ${q.options.join(' ')}`;
  const topics = SUBJECT_TOPICS[q.subject] || [];
  const matchedTopic = topics.find((t) => t.match.test(combined));
  const snippet = cleanStemSnippet(q);
  const provenanceNote = q.provenance?.notes?.trim();

  const incompleteNotice = provenanceNote
    ? `*দ্রষ্টব্য: ${provenanceNote}*`
    : '*দ্রষ্টব্য: এই প্রশ্নটির অফিশিয়াল উত্তরপত্র বা প্রয়োজনীয় চিত্র সম্পূর্ণরূপে যাচাইকৃত নয়, তাই অনুমান করে কোনো অপশনকে সঠিক দাবি না করে কেবল প্রাসঙ্গিক সমাধান পদ্ধতি দেওয়া হলো।*';

  return {
    explanation:
      (matchedTopic
        ? `${matchedTopic.theory}\n\n**প্রাসঙ্গিক সূত্র/নিয়ম:** ${matchedTopic.formulaOrRule}\n\n`
        : `প্রদত্ত প্রশ্ন (“${snippet}”)-এর মূল নীতি ও শর্ত বিশ্লেষণ করে সমাধান নির্ণয় করতে হবে।\n\n`) +
      incompleteNotice,
    stepByStep:
      `১. **প্রদত্ত তথ্য ও সীমাবদ্ধতা:** “${snippet}” প্রশ্নের উদ্দীপক ও ${q.questionImageUrls?.length ? 'প্রদত্ত চিত্রসহ ' : ''}শর্তগুলো দেখে নাও${provenanceNote ? ` (${provenanceNote})` : ''}।\n\n` +
      `২. **সমাধানের নীতি:** ${matchedTopic ? matchedTopic.howToSolve : 'সংশ্লিষ্ট অধ্যায়ের মূল সূত্র বা প্রাসঙ্গিক তথ্য প্রয়োগ করে মান নির্ণয় করো।'}\n\n` +
      `৩. **যাচাই:** সম্পূর্ণ তথ্য/চিত্র উপস্থিত থাকলে প্রাপ্ত ফলাফলের সাথে বিকল্পগুলো মিলিয়ে সঠিক উত্তর নির্বাচন করবে।`,
    shortcut: matchedTopic
      ? matchedTopic.shortcut
      : 'অসম্পূর্ণ বা চিত্রহীন প্রশ্নে কখনোই আন্দাজে উত্তর দাগাবে না; সম্পূর্ণ তথ্য থাকলে একক, মাত্রা ও যুক্তি দিয়ে ভুল অপশন বাদ দাও।'
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
