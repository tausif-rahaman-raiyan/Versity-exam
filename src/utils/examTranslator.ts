import { Question } from '../data/questionBank';
import { ImportedQuestion } from '../data/sessionQuestionLoader';

export type ExamLanguage = 'bn' | 'en';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] || d);
}

export function toEnglishNumber(value: number | string): string {
  return String(value).replace(/[০-৯]/g, (d) => {
    const idx = BN_DIGITS.indexOf(d);
    return idx >= 0 ? String(idx) : d;
  });
}

export function getOptionLabelForLang(index: number, lang: ExamLanguage): string {
  if (lang === 'bn') {
    const bnLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
    return bnLabels[index] || String.fromCharCode(65 + index);
  }
  return String.fromCharCode(65 + index);
}

export function getSubjectLabelForLang(subject: string, lang: ExamLanguage): string {
  const mapBn: Record<string, string> = {
    ALL: 'সকল বিষয় (ALL)',
    Bangla: 'বাংলা',
    Biology: 'জীববিজ্ঞান (Biology)',
    Chemistry: 'রসায়ন (Chemistry)',
    English: 'ইংরেজি (English)',
    Mathematics: 'গণিত (Mathematics)',
    Physics: 'পদার্থবিজ্ঞান (Physics)',
    ICT: 'আইসিটি (ICT)',
  };
  const mapEn: Record<string, string> = {
    ALL: 'ALL',
    Bangla: 'Bangla (বাংলা)',
    Biology: 'Biology',
    Chemistry: 'Chemistry',
    English: 'English',
    Mathematics: 'Mathematics',
    Physics: 'Physics',
    ICT: 'ICT',
  };
  return lang === 'bn' ? mapBn[subject] || subject : mapEn[subject] || subject;
}

/**
 * Strips LaTeX math segments ($...$) temporarily so we can check if there is real English prose
 * outside math formulas.
 */
function stripLatexMath(input: string): string {
  return input
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]*\$/g, ' ');
}

/**
 * Splits a bilingual string of the form:
 *   "বাংলা প্রশ্ন বা অপশন (English question or option)"
 * or multi-line:
 *   "বাংলা লাইন\nEnglish line"
 * into separate { bn, en, hasBoth } strings.
 *
 * Rules:
 * - If the string has ONLY English / math / numbers (no Bengali chars), both `bn` and `en` return the original string.
 * - If `subject === 'Bangla'` or `subject === 'English'`, returns original string as-is without stripping parentheses.
 */
export function splitBilingualText(
  rawText: string,
  subject?: string
): { bn: string; en: string; hasBoth: boolean } {
  const text = (rawText || '').trim();
  if (!text) return { bn: '', en: '', hasBoth: false };

  // Keep Bangla and English language/literature questions untouched
  if (subject === 'Bangla' || subject === 'English') {
    return { bn: text, en: text, hasBoth: false };
  }

  // If there are NO Bengali characters at all (e.g. "2E", "E/2", "NOR", "Bacillus subtilis", "$SF_4$"),
  // show the exact English/formula text in BOTH Bengali and English modes!
  if (!/[\u0980-\u09FF]/.test(text)) {
    return { bn: text, en: text, hasBoth: true };
  }

  // 1. Check if text ends with a balanced parenthesized English translation: "...বাংলা... (English...)"
  if (text.endsWith(')')) {
    let depth = 0;
    let openIdx = -1;
    let inMath = false;

    for (let i = text.length - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === '$') {
        inMath = !inMath;
      }
      if (!inMath) {
        if (ch === ')') {
          depth++;
        } else if (ch === '(') {
          depth--;
          if (depth === 0) {
            openIdx = i;
            break;
          }
        }
      }
    }

    if (openIdx > 0) {
      const beforeParen = text.slice(0, openIdx).trim();
      const insideParen = text.slice(openIdx + 1, text.length - 1).trim();
      const insideWithoutMath = stripLatexMath(insideParen);

      // Verify:
      // - `beforeParen` contains Bengali characters
      // - `insideParen` has no Bengali characters
      // - `insideParen` has English words (at least 2 consecutive letters outside LaTeX math, or starts with math followed by English words)
      if (
        /[\u0980-\u09FF]/.test(beforeParen) &&
        !/[\u0980-\u09FF]/.test(insideParen) &&
        /[a-zA-Z]{2,}/.test(insideWithoutMath)
      ) {
        // Also clean any inline middle English gloss in `beforeParen` if desired, or keep `beforeParen` clean
        return {
          bn: beforeParen,
          en: insideParen,
          hasBoth: true,
        };
      }
    }
  }

  // 2. Check if text has newline-separated Bengali line(s) followed by English line(s)
  // e.g. "অম্লের অনুবন্ধী ক্ষারক দুর্বল হলে অম্লটি শক্তিশালী হয়\nThe weaker the conjugate base of an acid is, the stronger is the acid."
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length >= 2) {
    const bnLines = lines.filter((l) => /[\u0980-\u09FF]/.test(l));
    const enLines = lines.filter(
      (l) => !/[\u0980-\u09FF]/.test(l) && /[a-zA-Z]{2,}/.test(stripLatexMath(l))
    );
    if (bnLines.length >= 1 && enLines.length >= 1 && bnLines.length + enLines.length === lines.length) {
      const enCleaned = enLines
        .join(' ')
        .replace(/^\(([\s\S]*)\)$/, '$1')
        .trim();
      return {
        bn: bnLines.join('\n'),
        en: enCleaned,
        hasBoth: true,
      };
    }
  }

  return { bn: text, en: text, hasBoth: false };
}

/**
 * Splits a bilingual explanation if it contains an explicit `[EN]` or `(English: ...)` or `**English:**` section,
 * or falls back to `splitBilingualText`.
 */
function getLocalizedExplanationText(
  rawExplanation: string | undefined,
  lang: ExamLanguage,
  subject?: string,
  aiExplanation?: string
): string {
  if (!rawExplanation) return '';

  // Check for explicit separator "||EN||" or "\n\n[EN]\n"
  if (rawExplanation.includes('||EN||')) {
    const [bnPart, enPart] = rawExplanation.split('||EN||');
    return lang === 'bn' ? bnPart.trim() : (enPart || bnPart).trim();
  }

  const split = splitBilingualText(rawExplanation, subject);
  if (split.hasBoth) {
    return lang === 'bn' ? split.bn : split.en;
  }

  if (lang === 'bn') {
    return rawExplanation;
  }

  return aiExplanation || translateScienceTextToEnglish(rawExplanation, subject);
}

// Comprehensive phrase and scientific term dictionary for instant Bengali -> English translation
const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  // Common question stems & structures
  [/নিচের কোনটি সঠিক নয়\??/gi, 'Which of the following is NOT correct?'],
  [/নিচের কোনটি সঠিক\??/gi, 'Which of the following is correct?'],
  [/নিচের কোনটি সত্য নয়\??/gi, 'Which of the following is NOT true?'],
  [/নিচের কোনটি সত্য\??/gi, 'Which of the following is true?'],
  [/নিচের কোনটি/gi, 'Which of the following'],
  [/নিম্নের কোনটি/gi, 'Which of the following'],
  [/নিম্নলিখিত কোন/gi, 'which of the following'],
  [/কোনটি সঠিক\??/gi, 'which one is correct?'],
  [/এর মান কত\??/gi, '— what is its value?'],
  [/মান কত হবে\??/gi, 'what will be the value?'],
  [/মান কত\??/gi, 'what is the value?'],
  [/কত হবে\??/gi, 'what will it be?'],
  [/কত গুণ হবে\??/gi, 'how many times will it be?'],
  [/কত গুণ\??/gi, 'how many times?'],
  [/কাকে বলা হয়\??/gi, 'is called what?'],
  [/কাকে বলে\??/gi, 'is called what?'],
  [/কোনটি ব্যবহৃত হয়\??/gi, 'which one is used?'],
  [/ব্যবহার করা হয়\??/gi, 'is used?'],
  [/ব্যবহার করে/gi, 'using'],
  [/তৈরি করা হল/gi, 'was prepared'],
  [/তৈরি করা হলো/gi, 'was prepared'],
  [/নিক্ষেপ করা হলো/gi, 'is projected'],
  [/নিক্ষেপ করা হল/gi, 'is projected'],
  [/ক্রিয়ারত/gi, 'acting'],
  [/ক্রিয়ারত/gi, 'acting'],
  [/অবস্থিত/gi, 'located'],
  [/পর্যবেক্ষণ করা গেল/gi, 'was observed'],
  [/পাওয়া যায়/gi, 'is found'],
  [/পাওয়া যায়/gi, 'is found'],
  [/বলা হয়/gi, 'is called'],
  [/বলা হয়/gi, 'is called'],
  [/সবচেয়ে বেশি স্থিতিশীল/gi, 'most stable'],
  [/সবচেয়ে বেশি স্থিতিশীল/gi, 'most stable'],
  [/সবচেয়ে বেশি/gi, 'maximum / highest'],
  [/সবচেয়ে বেশি/gi, 'maximum / highest'],
  [/সবচেয়ে কম/gi, 'minimum / lowest'],
  [/সবচেয়ে কম/gi, 'minimum / lowest'],
  [/সর্বাপেক্ষা শক্তিশালী/gi, 'the strongest'],
  [/সর্বাপেক্ষা/gi, 'most / highest'],

  // Physics terms
  [/মহাকর্ষীয় ধ্রুবক/gi, 'gravitational constant'],
  [/মহাকর্ষীয় ধ্রুবক/gi, 'gravitational constant'],
  [/মাত্রা সমীকরণ/gi, 'dimensional formula'],
  [/সরল দোলকের/gi, 'of a simple pendulum'],
  [/সরল দোলক/gi, 'simple pendulum'],
  [/দোলনকাল/gi, 'time period'],
  [/পর্যায়কাল/gi, 'time period'],
  [/পর্যায়কাল/gi, 'time period'],
  [/গতিশক্তিতে/gi, 'with kinetic energy'],
  [/গতিশক্তি/gi, 'kinetic energy'],
  [/স্থিতিশক্তি/gi, 'potential energy'],
  [/যান্ত্রিক শক্তি/gi, 'mechanical energy'],
  [/সর্বোচ্চ উচ্চতা/gi, 'maximum height'],
  [/সর্বোচ্চ বিন্দুতে/gi, 'at the highest point'],
  [/আনুভূমিক পাল্লা/gi, 'horizontal range'],
  [/অনুভূমিক পাল্লা/gi, 'horizontal range'],
  [/অনুভূমিকের সাথে/gi, 'with the horizontal'],
  [/অনুভুমিকের সাথে/gi, 'with the horizontal'],
  [/উল্লম্ব বেগ/gi, 'vertical velocity'],
  [/অনুভূমিক বেগ/gi, 'horizontal velocity'],
  [/সর্বোচ্চ বেগ/gi, 'maximum velocity'],
  [/কৌণিক বেগ/gi, 'angular velocity'],
  [/কৌণিক ত্বরণ/gi, 'angular acceleration'],
  [/রৈখিক বেগ/gi, 'linear velocity'],
  [/ভরবেগ/gi, 'momentum'],
  [/কৌণিক ভরবেগ/gi, 'angular momentum'],
  [/জড়তার ভ্রামক/gi, 'moment of inertia'],
  [/জড়তার ভ্রামক/gi, 'moment of inertia'],
  [/বৃত্তাকার কক্ষপথে/gi, 'in a circular orbit'],
  [/বৃত্তাকার পথে/gi, 'in a circular path'],
  [/ব্যাসার্ধের/gi, 'of radius'],
  [/ব্যাসার্ধ/gi, 'radius'],
  [/উপগ্রহ/gi, 'satellite'],
  [/পৃথিবীর পৃষ্ঠে/gi, "on Earth's surface"],
  [/মুক্তিবেগ/gi, 'escape velocity'],
  [/অভিকর্ষজ ত্বরণ/gi, 'gravitational acceleration'],
  [/ত্বরণ/gi, 'acceleration'],
  [/সরণ/gi, 'displacement'],
  [/বেগ/gi, 'velocity'],
  [/দ্রুতি/gi, 'speed'],
  [/বল/gi, 'force'],
  [/কাজ/gi, 'work'],
  [/ক্ষমতা/gi, 'power'],
  [/শক্তি/gi, 'energy'],
  [/পৃষ্ঠটান/gi, 'surface tension'],
  [/সান্দ্রতা/gi, 'viscosity'],
  [/স্থিতিস্থাপকতা/gi, 'elasticity'],
  [/ইয়ং এর গুণাঙ্ক/gi, "Young's modulus"],
  [/ইয়ং-এর গুণাঙ্ক/gi, "Young's modulus"],
  [/পানির ত্রৈধ বিন্দু/gi, 'triple point of water'],
  [/পরম তাপমাত্রা/gi, 'absolute temperature'],
  [/তাপমাত্রা/gi, 'temperature'],
  [/তাপীয় অন্তরক/gi, 'thermally insulated'],
  [/তাপীয় অন্তরক/gi, 'thermally insulated'],
  [/রুদ্ধতাপীয়/gi, 'adiabatic'],
  [/রুদ্ধতাপীয়/gi, 'adiabatic'],
  [/সমোষ্ণ/gi, 'isothermal'],
  [/সমচাপ/gi, 'isobaric'],
  [/সমআয়তন/gi, 'isochoric'],
  [/এনট্রপি/gi, 'entropy'],
  [/কার্নো ইঞ্জিন/gi, 'Carnot engine'],
  [/কর্মদক্ষতা/gi, 'efficiency'],
  [/স্থির তরঙ্গে/gi, 'in a standing wave'],
  [/স্থির তরঙ্গ/gi, 'standing wave'],
  [/নিস্পন্দ বিন্দুর/gi, 'of nodes'],
  [/নিস্পন্দ বিন্দু/gi, 'node'],
  [/সুস্পন্দ বিন্দু/gi, 'antinode'],
  [/তরঙ্গদৈর্ঘ্য/gi, 'wavelength'],
  [/কম্পাঙ্ক/gi, 'frequency'],
  [/বিস্তার/gi, 'amplitude'],
  [/দশা পার্থক্য/gi, 'phase difference'],
  [/পথ পার্থক্য/gi, 'path difference'],
  [/উত্তল লেন্স/gi, 'convex lens'],
  [/অবতল লেন্স/gi, 'concave lens'],
  [/ফোকাস দূরত্ব/gi, 'focal length'],
  [/প্রতিসরাঙ্ক/gi, 'refractive index'],
  [/ব্যতিচার/gi, 'interference'],
  [/অপবর্তন/gi, 'diffraction'],
  [/সমাবর্তন/gi, 'polarization'],
  [/লজিক গেট/gi, 'logic gate'],
  [/অর্ধপরিবাহী/gi, 'semiconductor'],
  [/পরিবাহী/gi, 'conductor'],
  [/ধারকত্ব/gi, 'capacitance'],
  [/ধারক/gi, 'capacitor'],
  [/রোধ/gi, 'resistance'],
  [/আপেক্ষিক রোধ/gi, 'resistivity'],
  [/তড়িৎ প্রবাহ/gi, 'electric current'],
  [/তড়িৎ প্রবাহ/gi, 'electric current'],
  [/বিভব পার্থক্য/gi, 'potential difference'],
  [/তড়িৎক্ষেত্র/gi, 'electric field'],
  [/চৌম্বক ক্ষেত্র/gi, 'magnetic field'],
  [/অর্ধায়ু/gi, 'half-life'],
  [/অর্ধায়ু/gi, 'half-life'],
  [/তেজস্ক্রিয়/gi, 'radioactive'],
  [/ফোটন/gi, 'photon'],
  [/শূন্য ভর/gi, 'zero mass'],
  [/শূণ্য ভর/gi, 'zero mass'],

  // Chemistry terms
  [/প্রাইমারি স্ট্যান্ডার্ড পদার্থ/gi, 'primary standard substance'],
  [/সেকেন্ডারি স্ট্যান্ডার্ড পদার্থ/gi, 'secondary standard substance'],
  [/কার্বোক্যাটায়নটি/gi, 'carbocation'],
  [/কার্বোক্যাটায়নটি/gi, 'carbocation'],
  [/কার্বোক্যাটায়ন/gi, 'carbocation'],
  [/হাইড্রোজেন বন্ধন/gi, 'hydrogen bond'],
  [/সমযোজী বন্ধন/gi, 'covalent bond'],
  [/আয়নিক বন্ধন/gi, 'ionic bond'],
  [/আয়নিক বন্ধন/gi, 'ionic bond'],
  [/সন্নিবেশ বন্ধন/gi, 'coordinate bond'],
  [/সংকরায়ণ/gi, 'hybridization'],
  [/সংকরায়ন/gi, 'hybridization'],
  [/ক্ষারীয় বাফার দ্রবণ/gi, 'basic buffer solution'],
  [/ক্ষারীয় বাফার দ্রবণ/gi, 'basic buffer solution'],
  [/অম্লীয় বাফার দ্রবণ/gi, 'acidic buffer solution'],
  [/বাফার দ্রবণ/gi, 'buffer solution'],
  [/জলীয় দ্রবণ/gi, 'aqueous solution'],
  [/জলীয় দ্রবণ/gi, 'aqueous solution'],
  [/দ্রবণের/gi, 'of the solution'],
  [/দ্রবণ/gi, 'solution'],
  [/মোলার ঘনমাত্রা/gi, 'molar concentration'],
  [/ঘনমাত্রা/gi, 'concentration'],
  [/তড়িৎ রাসায়নিক কোষ/gi, 'electrochemical cell'],
  [/তড়িৎ রাসায়নিক কোষ/gi, 'electrochemical cell'],
  [/জারণ মান/gi, 'oxidation number'],
  [/জারণ সংখ্যা/gi, 'oxidation number'],
  [/বিজারণ/gi, 'reduction'],
  [/জারণ/gi, 'oxidation'],
  [/রিডবার্গ ধ্রুবক/gi, 'Rydberg constant'],
  [/হাইড্রোজেন পরমাণুর/gi, 'of hydrogen atom'],
  [/বর্ণালি/gi, 'spectrum'],
  [/বর্ণালী/gi, 'spectrum'],
  [/ইলেকট্রন বিন্যাস/gi, 'electron configuration'],
  [/ইলেকট্রন আসক্তি/gi, 'electron affinity'],
  [/তড়িৎ ঋণাত্মকতা/gi, 'electronegativity'],
  [/আয়নীকরণ শক্তি/gi, 'ionization energy'],
  [/আয়নীকরণ শক্তি/gi, 'ionization energy'],
  [/বিক্রিয়াসমূহের মধ্যে/gi, 'among the reactions'],
  [/বিক্রিয়াসমূহের মধ্যে/gi, 'among the reactions'],
  [/বিক্রিয়ায়/gi, 'in the reaction'],
  [/বিক্রিয়ায়/gi, 'in the reaction'],
  [/বিক্রিয়া/gi, 'reaction'],
  [/বিক্রিয়া/gi, 'reaction'],
  [/যৌগে/gi, 'in the compound'],
  [/যৌগটি/gi, 'the compound'],
  [/যৌগ/gi, 'compound'],
  [/মৌল/gi, 'element'],
  [/পরমাণু/gi, 'atom'],
  [/অণু/gi, 'molecule'],
  [/গ্যাসের ভর/gi, 'mass of the gas'],
  [/আদর্শ গ্যাস/gi, 'ideal gas'],

  // Mathematics terms
  [/পোলার স্থানাংকে/gi, 'in polar coordinates'],
  [/পোলার স্থানাঙ্ক/gi, 'polar coordinates'],
  [/কার্তেসীয় স্থানাঙ্ক/gi, 'Cartesian coordinates'],
  [/রেখা দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল/gi, 'area of the region bounded by the lines'],
  [/রেখা দ্বারা আবদ্ধ অঞ্চলের ক্ষেত্রফল/gi, 'area of the region bounded by the lines'],
  [/আবদ্ধ ক্ষেত্রের ক্ষেত্রফল/gi, 'area of the bounded region'],
  [/ক্ষেত্রফল কত বর্গ একক/gi, 'what is the area in square units'],
  [/ক্ষেত্রফল/gi, 'area'],
  [/বর্গ একক/gi, 'square units'],
  [/ব্যবধিতে/gi, 'in the interval'],
  [/ব্যবধি/gi, 'interval'],
  [/ভেক্টর/gi, 'vector'],
  [/লম্ব হবে/gi, 'will be perpendicular'],
  [/সমান্তরাল হবে/gi, 'will be parallel'],
  [/অন্তরীকরণ/gi, 'differentiation'],
  [/যোগজীকরণ/gi, 'integration'],
  [/নির্ণায়ক/gi, 'determinant'],
  [/ম্যাট্রিক্স/gi, 'matrix'],
  [/দ্বিঘাত সমীকরণ/gi, 'quadratic equation'],
  [/সমীকরণের মূলদ্বয়/gi, 'roots of the equation'],
  [/মূলদ্বয়/gi, 'roots'],
  [/সমীকরণ/gi, 'equation'],
  [/বিন্দুতে/gi, 'at a point'],
  [/বিন্দু/gi, 'point'],
  [/সরলরেখা/gi, 'straight line'],
  [/বৃত্তের/gi, 'of the circle'],
  [/বৃত্ত/gi, 'circle'],
  [/পরাবৃত্ত/gi, 'parabola'],
  [/উপবৃত্ত/gi, 'ellipse'],
  [/অধিবৃত্ত/gi, 'hyperbola'],
  [/উৎকেন্দ্রিকতা/gi, 'eccentricity'],
  [/উপকেন্দ্র/gi, 'focus'],
  [/স্পর্শক/gi, 'tangent'],
  [/ঢাল/gi, 'slope'],

  // Biology terms
  [/কোষপ্রাচীরের/gi, 'of the cell wall'],
  [/কোষপ্রাচীর/gi, 'cell wall'],
  [/কোষের শক্তিঘর/gi, 'powerhouse of the cell'],
  [/মাইটোকন্ড্রিয়া/gi, 'mitochondria'],
  [/রাইবোজোম/gi, 'ribosome'],
  [/লাইসোজোম/gi, 'lysosome'],
  [/গলগি বডি/gi, 'Golgi body'],
  [/ক্লোরোপ্লাস্ট/gi, 'chloroplast'],
  [/নিউক্লিয়াস/gi, 'nucleus'],
  [/ক্রোমোজোম/gi, 'chromosome'],
  [/মানবদেহে রক্তের প্লাজমার স্বাভাবিক/gi, 'normal human blood plasma'],
  [/মানবদেহের বৃহত্তম গ্রন্থি/gi, 'largest gland of the human body'],
  [/মানবদেহের/gi, 'of the human body'],
  [/মানবদেহে/gi, 'in the human body'],
  [/এড্রেনাল গ্রন্থি/gi, 'adrenal gland'],
  [/পিটুইটারি গ্রন্থি/gi, 'pituitary gland'],
  [/থাইরয়েড গ্রন্থি/gi, 'thyroid gland'],
  [/অগ্ন্যাশয়/gi, 'pancreas'],
  [/যকৃৎ/gi, 'liver'],
  [/হরমোন নিঃসৃত হয়/gi, 'hormone is secreted'],
  [/হরমোন নিঃসৃত হয়/gi, 'hormone is secreted'],
  [/হরমোন/gi, 'hormone'],
  [/এনজাইম/gi, 'enzyme'],
  [/ঘাসফড়িং- এর/gi, 'of grasshopper'],
  [/ঘাস ফড়িং এর/gi, 'of grasshopper'],
  [/ঘাসফড়িং/gi, 'grasshopper'],
  [/রেচন অঙ্গের নাম কি/gi, 'what is the name of the excretory organ'],
  [/রেচন অঙ্গ/gi, 'excretory organ'],
  [/স্পাইরাকল/gi, 'spiracles'],
  [/সমপ্রকটতার ফিনোটাইপিক অনুপাত/gi, 'phenotypic ratio of codominance'],
  [/ফিনোটাইপিক অনুপাত/gi, 'phenotypic ratio'],
  [/জিনোটাইপিক অনুপাত/gi, 'genotypic ratio'],
  [/নিষিক্ত ডিম্বাণু/gi, 'fertilized ovum'],
  [/ডিম্বাণু/gi, 'ovum'],
  [/পরিণত হয়/gi, 'develops into'],
  [/পরিণত হয়/gi, 'develops into'],
  [/ব্যাকটেরিয়ার/gi, 'of bacteria'],
  [/ব্যাকটেরিয়া/gi, 'bacteria'],
  [/ভাইরাস/gi, 'virus'],
  [/ফ্লাজেলাম/gi, 'flagellum'],
  [/শিখাকোষ/gi, 'flame cell'],
  [/পর্বের বৈশিষ্ট্য/gi, 'characteristic of the phylum'],
  [/অ্যামাইনো এসিডের/gi, 'of amino acid'],
  [/অ্যামাইনো এসিড/gi, 'amino acid'],
  [/মস্তিষ্ক ও সুষুম্নাকান্ডের আবরণ/gi, 'covering of the brain and spinal cord'],
  [/পরিবহনতন্ত্র/gi, 'vascular system'],
  [/বিলুপ্ত প্রায়/gi, 'endangered / nearly extinct'],
  [/সালোকসংশ্লেষণ/gi, 'photosynthesis'],
  [/শ্বসন/gi, 'respiration'],
  [/সেলুলোজ/gi, 'cellulose'],
  [/কাইটিন/gi, 'chitin'],
  [/পেকটিন/gi, 'pectin'],
  [/লিগনিন/gi, 'lignin'],

  // Common Option & Explanation words
  [/অর্ধেক/gi, 'Half (0.5x)'],
  [/দ্বিগুণ/gi, 'Double (2x)'],
  [/চারগুণ/gi, 'Four times (4x)'],
  [/তিনগুণ/gi, 'Three times (3x)'],
  [/অপরিবর্তিত/gi, 'Unchanged'],
  [/কোনোটিই নয়/gi, 'None of these'],
  [/কোনটিই নয়/gi, 'None of these'],
  [/উভয়ই/gi, 'Both'],
  [/সবগুলোই/gi, 'All of these'],
  [/সঠিক উত্তর/gi, 'Correct Answer'],
  [/সমাধান/gi, 'Solution'],
  [/ব্যাখ্যা/gi, 'Explanation'],
  [/আমরা জানি/gi, 'We know'],
  [/প্রশ্নমতে/gi, 'According to the question'],
  [/এখানে/gi, 'Here'],
  [/অতএব/gi, 'Therefore'],
  [/সুতরাং/gi, 'Therefore'],
  [/হলে/gi, 'if'],
  [/এবং/gi, 'and'],
  [/অথবা/gi, 'or'],
  [/বা/gi, 'or'],
  [/থেকে/gi, 'from'],
  [/মধ্যে/gi, 'among / between'],
  [/জন্য/gi, 'for'],
  [/দ্বারা/gi, 'by'],
  [/সাথে/gi, 'with'],
  [/একটি/gi, 'a / one'],
  [/দুইটি/gi, 'two'],
  [/তিনটি/gi, 'three'],
  [/চারটি/gi, 'four'],
  [/কোনো/gi, 'any'],
  [/কোন/gi, 'which'],
  [/কত/gi, 'how much / what'],
  [/যদি/gi, 'if'],
  [/তবে/gi, 'then'],
  [/হয়/gi, 'is'],
  [/হয়/gi, 'is'],
  [/থাকে/gi, 'exists / has'],
  [/নয়/gi, 'not'],
  [/নয়/gi, 'not'],
];

export function translateScienceTextToEnglish(rawText: string, subject?: string): string {
  if (!rawText) return rawText;
  // Keep Bangla language & literature questions in Bengali script since the subject itself is Bangla
  if (subject === 'Bangla') return rawText;

  // First check if the text already contains an embedded English translation
  const split = splitBilingualText(rawText, subject);
  if (split.hasBoth) {
    return split.en;
  }

  // Convert Bengali digits outside LaTeX or globally to English digits
  let output = toEnglishNumber(rawText);

  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    output = output.replace(pattern, replacement);
  }

  return output;
}

export function getLocalizedQuestion(
  question: Question,
  lang: ExamLanguage,
  aiTranslation?: { question?: string; options?: string[]; explanation?: string }
): Question {
  const imported = question as ImportedQuestion;
  const optionLabels = (question.options || []).map((_, idx) => getOptionLabelForLang(idx, lang));

  // Split bilingual question stem
  const stemSplit = splitBilingualText(question.question, question.subject);

  if (lang === 'bn') {
    const bnOptions = question.options.map((opt) => {
      const optSplit = splitBilingualText(opt, question.subject);
      return optSplit.bn;
    });

    const bnExplanation = getLocalizedExplanationText(
      question.explanation,
      'bn',
      question.subject
    );

    return {
      ...imported,
      question: stemSplit.bn,
      options: bnOptions,
      explanation: bnExplanation,
      optionLabels,
    };
  }

  // English ('en') mode
  const translatedStem = stemSplit.hasBoth
    ? stemSplit.en
    : aiTranslation?.question || translateScienceTextToEnglish(question.question, question.subject);

  const translatedOptions = question.options.map((opt, idx) => {
    const optSplit = splitBilingualText(opt, question.subject);
    if (optSplit.hasBoth) {
      return optSplit.en;
    }
    if (aiTranslation?.options && aiTranslation.options[idx]) {
      return aiTranslation.options[idx];
    }
    return translateScienceTextToEnglish(opt, question.subject);
  });

  const translatedExplanation = getLocalizedExplanationText(
    question.explanation,
    'en',
    question.subject,
    aiTranslation?.explanation
  );

  return {
    ...imported,
    question: translatedStem,
    options: translatedOptions,
    explanation:
      translatedExplanation ||
      `Official ${question.university} (${question.subject}) solution and detailed explanation.`,
    optionLabels,
  };
}
