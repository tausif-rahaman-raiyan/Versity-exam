import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { cleanMathAndChemicalText } from './mathCleaner.ts';

const mdParser = unified().use(remarkParse).use(remarkMath);

function assertValidKatex(text: string) {
  const cleanEsc = text.replace(/\\\$/g, '');
  const rem = cleanEsc.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+?\$/g, '');
  assert.equal(rem.includes('$'), false, `Unbalanced $ found in: ${text}`);

  const tree = mdParser.parse(text);
  const visit = (node: any) => {
    if (!node) return;
    if (node.type === 'inlineMath' || node.type === 'math') {
      assert.doesNotThrow(
        () => katex.renderToString(node.value, { displayMode: node.type === 'math', strict: false, throwOnError: true }),
        `remark-math + KaTeX failed for "${node.value}" in "${text}"`
      );
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
  };
  visit(tree);
}

describe('cleanMathAndChemicalText', () => {
  it('repairs split \\mathrm and nested $ chemical formulas', () => {
    const cases = [
      '$$\\mathrm{K_{2Cr}$$\\mathrm{_{2}O}$_{7}}$ এর দ্রবণ',
      '\\mathrm{CH_{3CONH}$_2} হতে \\mathrm{CH_{3CH}\\mathrm{_{2}N}$H_{2}}',
      '$$\\mathrm{C_{8H}_18}$$',
      '$\\mathrm{$N_{2}$(g}$)+$$\\mathrm{$H_{2}$(g}$)$\\to$\\text{\\mathrm{N}$H_${3}(g}$)',
      'Na₂$$\\mathrm{SO_{4}$}$',
      '[$$\\mathrm{Fe(CN)_{6}$}$]^3-',
      '$\\text{PO_{4}}$',
      '$\\text{Vit-B_{1}}$',
      '$\\frac{3}{5}$\\text{$R_{H}}',
      '$2 \\times 2$ বর্গ ম্যাট্রিক্সের $c_{i j}=\\left\\{\\begin{array}{l}i+2 j ; i \\neq j \\\\ 2 i+j ; i=j\\end{array}\\right.$ হলে নিচের কোনটি সত্য?',
      '$$\\mathrm{C_{2H}$_4}$+$\\mathrm{H}_2\\mathrm{O}$ (I)$\\to$$\\mathrm{$C_{2H}$_{5OH}}',
      '$O_2N$\\text{\\mathrm{C}O_${2H}}',
      '$\\frac{\\pi}{300}$ ms$^{-1}$',
      '$\\frac{1}{4}$ x^$\\frac{1}{2}$'
    ];

    for (const input of cases) {
      const cleaned = cleanMathAndChemicalText(input);
      assertValidKatex(cleaned);
      assert.equal(/_\{\d+[A-Z]/.test(cleaned), false, `Unfixed merged subscript in: ${cleaned}`);
    }
  });

  it('repairs colliding $...$$...$ delimiters, concatenated electron configs, and trailing scripts', () => {
    const e1 = cleanMathAndChemicalText('$1s^{2}\\, 2s^{2}\\, 2p 3s^{23}$$p^{6}$$3d^{10}\\, 4p^{6}$');
    assertValidKatex(e1);
    assert.match(e1, /3s\^\{2\}\\,\s*3p\^\{6\}/);

    const e2 = cleanMathAndChemicalText('1s^22s^2 2p^63s^23p^6 3d^54s^2');
    assertValidKatex(e2);
    assert.match(e2, /\$1s\^\{2\}\\,\s*2s\^\{2\}\\,\s*2p\^\{6\}\\,\s*3s\^\{2\}\\,\s*3p\^\{6\}\\,\s*3d\^\{5\}\\,\s*4s\^\{2\}\$/);

    const e3 = cleanMathAndChemicalText('$1s^{2}\\, 2s^{22}$$p^{63}s^{23}p^{6} 3d^{104}p^{6}$');
    assertValidKatex(e3);
    assert.match(e3, /3d\^\{10\}\\,\s*4p\^\{6\}/);

    const colliding = [
      '$sp^{3}$$d^{2}$ সংকরণ বিশিষ্ট যৌগ কোনটি?',
      '$x^{3}-$$5x^{2}$ + 17x- 13 = 0',
      '$2.3 \\times 10^{-3}$$\\mathrm{s}^{-1}$',
      '8.85 x 10^-$12C^{2}$$\\mathrm{N^{-}1m^{2}}$',
      '$6.626 \\times 10^{-34}$C^$\\mathrm{2N^{-}}$$1m^{2}$',
      'নিচের বিক্রিয়ার জন্য $\\Delta E^0$^ এর মান কত? $-1.66$$\\mathrm{Zn}$^{2+}($\\text{aq}$) + 2$\\text{e}$^{-} \\rightarrow $\\mathrm{Zn}$(s)$-0.76$',
      '$4d^{2}$$x/dt^{2}$ + 16x = 0',
      '$\\rm$$\\mathrm{CaCO}$_3$.\\ {\\rm MgCO}_3$',
      '$0.6023 \\times 10^{2}^{2}$',
      'Zn/Zn^{2}^+ এবং $Cu^{2}$^+'
    ];
    for (const c of colliding) {
      const cleaned = cleanMathAndChemicalText(c);
      assertValidKatex(cleaned);
    }
  });

  it('formats isotopes, electron configurations, and raw ions', () => {
    const iso = cleanMathAndChemicalText('_25Mn ও _26Fe^2+ এর ইলেকট্রন বিন্যাস');
    assert.match(iso, /\\mathrm\{_\{25\}Mn\}/);
    assert.match(iso, /\\mathrm\{_\{26\}Fe\^\{2\+\}\}/);
    assertValidKatex(iso);

    const econf = cleanMathAndChemicalText('[Ar]3d^3 4s^2 এবং 1s^2 2s^2 2p^6');
    assertValidKatex(econf);
    assert.match(econf, /3d\^\{3\}/);
  });

  it('formats ASCII fractions into KaTeX \\frac while preserving non-math slashes and units', () => {
    const frac1 = cleanMathAndChemicalText('বিন্দুটি (-1, -7/10) এবং ঢাল -1/5');
    assert.match(frac1, /\\frac\{7\}\{10\}/);
    assert.match(frac1, /-\\frac\{1\}\{5\}/);
    assertValidKatex(frac1);

    const frac2 = cleanMathAndChemicalText('$k < 1/8$ এবং $s=+1/2$ ও $q_1/q_2=16$');
    assert.match(frac2, /\\frac\{1\}\{8\}/);
    assert.match(frac2, /\\frac\{1\}\{2\}/);
    assert.match(frac2, /\\frac\{q_1\}\{q_2\}/);
    assertValidKatex(frac2);

    const unit = cleanMathAndChemicalText('$8 \\times 10^{-14} N/C$ ও $Cu^{2+}(aq)/Cu(s)$ ও $2m/s^2$');
    assert.equal(unit.includes('\\frac'), false);
    assertValidKatex(unit);

    const bit = cleanMathAndChemicalText('$\\frac{7}{8}$ bit');
    assert.equal(bit, '7/8 bit');

    const extra = cleanMathAndChemicalText(
      '1/2n(n+2)(2n+3) এবং $1/2H_2(g)\\to H^{+}(aq)$ ও $m^{1/2} s^{-1 / 2}$ এবং (2x^2-5/7x)^15 ও 3/2xমোট শক্তি এবং x^2-4x+4=0'
    );
    assert.match(extra, /\\frac\{1\}\{2\}n/);
    assert.match(extra, /\\frac\{1\}\{2\}H_2/);
    assert.match(extra, /s\^\{-\\frac\{1\}\{2\}\}/);
    assert.match(extra, /\\frac\{5\}\{7\}x/);
    assert.match(extra, /\\frac\{3\}\{2\} \\times/);
    assert.match(extra, /\$x\^\{2\}-4x\+4=0\$/);
    assertValidKatex(extra);
  });

  it('repairs corrupted IMAGE URLs, English blank underscores, and odd dollar typos', () => {
    const img = cleanMathAndChemicalText('[IMAGE: https://assets.chorcha.net/$\\text{AS5XPdty6wS__{OmRoXKP1}}$.png]');
    assert.equal(img, '[IMAGE: https://assets.chorcha.net/AS5XPdty6wS__OmRoXKP1.png]');

    const blank = cleanMathAndChemicalText('$$\\mathrm{I___{finished}}$$ my letter yet.');
    assert.equal(blank, 'I ____ finished my letter yet.');

    const odd = cleanMathAndChemicalText('UV-রশ্মিতে $5 এর দৃশ্যমান আলোর বিকিরণ কোনটি? এবং x^2 + y^2 ^^^= 4');
    assertValidKatex(odd);

    const cuCases = [
      'NH_4^++OH^– বিক্রিয়া এবং mol^–2L^–2 ও 3.8 ms^-1',
      'C_nH_2_n+2 এবং C_nH_2_n-2 এবং 135_10 এর দ্বিমিকরূপ',
      'px^2+(2p-7)x+p=0 এবং p(x)=tan^-1x এবং 30^o^ কোণ',
      '$C_6H_5NH_2 + CHCl_3 + KOH \\u2192 C_6H_5(NC) + KCl + H_2O$'
    ];
    for (const c of cuCases) {
      const cleaned = cleanMathAndChemicalText(c);
      assertValidKatex(cleaned);
    }
  });

  it('repairs complex ions, dimensional brackets, compound units, raw sqrts, and adds spacing around inline math', () => {
    const complex = cleanMathAndChemicalText('[Co($\\mathrm{NO_{2})_{6}}$]');
    assert.equal(complex, '$[\\mathrm{Co(NO_{2})_{6}}]$');
    assertValidKatex(complex);

    const cuComplex = cleanMathAndChemicalText('[Cu($\\mathrm{H}_2\\mathrm{O}$)_4]^2+');
    assert.equal(cuComplex, '$[\\mathrm{Cu(H_{2}O)_{4}}]^{2+}$');
    assertValidKatex(cuComplex);

    const dim = cleanMathAndChemicalText('[ML^$\\mathrm{3T^{-2}}$]');
    assert.equal(dim, '$[\\mathrm{ML^{3}T^{-2}}]$');
    assertValidKatex(dim);

    const unit = cleanMathAndChemicalText('90kmh^-1 এবং 5kgm^2 ও mol^$\\mathrm{2L^{-2}}$ এবং 10 ms^{-1}');
    assert.match(unit, /\\mathrm\{km\}\\,\\mathrm\{h\}\^\{-1\}/);
    assert.match(unit, /\\mathrm\{kg\}\\,\\mathrm\{m\}\^\{2\}/);
    assert.match(unit, /\\mathrm\{mol\}\^\{2\}\\,\\mathrm\{L\}\^\{-2\}/);
    assert.match(unit, /\\mathrm\{ms\}\^\{-1\}/);
    assertValidKatex(unit);

    const sq = cleanMathAndChemicalText('√3/2 c এবং 1/√2 ও \\sqrt34');
    assert.match(sq, /\\frac\{\\sqrt\{3\}\}\{2\}/);
    assert.match(sq, /\\frac\{1\}\{\\sqrt\{2\}\}/);
    assert.match(sq, /\\sqrt\{34\}/);
    assertValidKatex(sq);

    const spaced = cleanMathAndChemicalText('সহিত$CH_3Cl$এবং$AlCl_3$এর');
    assert.equal(spaced, 'সহিত $CH_3Cl$ এবং $AlCl_3$ এর');
    assertValidKatex(spaced);

    const extraCases = [
      '^+$\\mathrm{CR_{3}}$',
      '$$[\\mathrm{Fe(H_{2}O)_{6}}]Cl_3',
      '1+$\\frac{1}{3}$+($\\frac{1}{3}$)^2',
      'π^$\\frac{2}{2}$ s',
      '(2x^2-1/($2x^{3}))^{10}$',
      '80^oC থেকে 32^oF এবং (75.75)_10',
      '5.25ms$^{-2}$ এবং sp$^3$ এবং 6 ms¯^1 ও 10ms^-²',
      'বিকারকটি-$Ar-CHO$\\xrightarrow{\\text { বিকারক (Reagent) }} \\xrightarrow{$\\mathrm{H}^{+}$ / $\\mathrm{H}_{2}$ $\\mathrm{O}$}$ArCH(OH)COOH$',
      'যদি z_1=1+i এবং z_2=1-i হয় তাহলে z_1z_2 এর মান হবে-',
      '$\\pm \\sqrt{\\left ( \\frac}{A}{2} \\right )$',
      '$[S]= [ML^2T^{-1}]$',
      '$[Fe(\\mathrm{H}_{2}$ $\\mathrm{O})_6]Cl_3$',
      '\\(0',
      '_42 Mo এর ইলেক্ট্রন বিন্যাস',
      '$[\\mathrm{Kr}]\\, 4d^{4}\\, 5s$2',
      'Ag($\\mathrm{NH_{3})}$ $\\mathrm{_{2}Cl}$',
      '2Ag($\\mathrm{NH_{3})}$ $\\mathrm{_{2}O}$H_(aq)'
    ];
    for (const c of extraCases) {
      const cleaned = cleanMathAndChemicalText(c);
      assertValidKatex(cleaned);
    }
  });
});

