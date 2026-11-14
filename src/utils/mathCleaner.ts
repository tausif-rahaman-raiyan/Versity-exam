/**
 * Pure utility for repairing broken KaTeX, chemical formulas, isotopes,
 * ASCII fractions, Unicode subscripts/superscripts, and malformed delimiters.
 */

const UNICODE_SUB_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  '₊': '+',
  '₋': '-'
};

const UNICODE_SUP_MAP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-'
};

const MATH_UNIT_OR_CONTEXT_RE =
  /\b(?:km|m|cm|mm|ft|in|mi|kg|g|mg|mol|mmol|dm|L|l|liter|litre|mL|ml|J|kJ|cal|kcal|W|kW|hp|V|mV|kV|A|mA|N|kN|Pa|kPa|Hz|rad|deg|s|sec|hr|h|min|day|yr|bit|byte|bits|bytes|aq|l|s)\b/i;

const PROTECTED_SLASH_IN_TEXT_RE = [
  /\b(?:km|m|cm|mm|ft|in|mi)\s*\/\s*(?:s\^?2?|sec|hr|h|min|day|yr)\b/i,
  /\b(?:kg|g|mg|mol|mmol)\s*\/\s*(?:l|liter|litre|ml|m\^3|cm\^3|dm\^3)\b/i,
  /\b(?:j|kj|cal|kcal|w|kw|hp)\s*\/\s*(?:s|sec|mol|k|kg)\b/i,
  /\b(?:v|mv|kv)\s*\/\s*(?:m|cm)\b/i,
  /\b(?:n|kn)\s*\/\s*(?:m\^?2?|cm\^?2?|c)\b/i,
  /\b(?:and|or)\s*\/\s*(?:or|and)\b/i,
  /\b(?:na|sn|fe|cu|zn|al|mg|ca|k|li)\s*\/\s*(?:ether|hcl|h2so4|naoh|h2o)\b/i,
  /\b(19\d\d|20\d\d)\s*\/\s*(\d{2,4})\b/,
  /\b(?:group|set|shift|unit|sec)\s*\/\s*(?:group|set|shift|unit|sec|\d+)\b/i,
  /\b7\s*\/\s*8\s*(?:bit|bits|byte|bytes)\b/i,
  /\bhttps?:\/\/\S+/i
];

function isProtectedNonMathSlash(windowText: string): boolean {
  return PROTECTED_SLASH_IN_TEXT_RE.some((re) => re.test(windowText));
}

function replaceUnicodeSubSup(str: string): string {
  let out = str;
  out = out.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋]+/g, (seq) => {
    const mapped = [...seq].map((ch) => UNICODE_SUB_MAP[ch] ?? ch).join('');
    return `_{${mapped}}`;
  });
  out = out.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, (seq) => {
    const mapped = [...seq].map((ch) => UNICODE_SUP_MAP[ch] ?? ch).join('');
    return `^{${mapped}}`;
  });
  return out;
}

/**
 * Normalizes a chemical / algebraic macro body after nested macros and stray `$` are removed.
 */
function cleanMacroBody(rawBody: string): string {
  let body = rawBody;
  for (let pass = 0; pass < 4; pass++) {
    body = body.replace(/\\(?:mathrm|text)\{([^{}]*)\}/g, '$1');
  }

  // Fix merged chemical subscripts like `_{2Cr}`, `_{3CONH}`, `_{8H}`, `_{5COOH}`, `_{3CHO}`
  body = body.replace(/_\{(\d+)([A-Z][A-Za-z0-9]*)\}/g, '_{$1}$2');
  // Fix double-subscript OCR/regex artifacts like `H_{2}_Te`, `H_{2}_SO_{4}`, `S_{20}_{3}`
  body = body.replace(/S_\{20\}_\{3\}/g, 'S_{2}O_{3}');
  body = body.replace(/(_\{?[A-Za-z0-9]+\}?)_([A-Z][A-Za-z0-9]*)/g, '$1$2');
  // Fix alkane/alkene general formulas: `C_{nH}_2_{n}+2` / `C_{nH}_2n` -> `C_{n}H_{2n+2}`
  body = body.replace(/C_\{nH\}/g, 'C_{n}H');
  body = body.replace(/_2_\{n\}([+-]\d+|[+-][a-z])?/g, (_m, tail?: string) => `_{2n${tail || ''}}`);
  body = body.replace(/_2n([+-]\d+|[+-][a-z])?/g, (_m, tail?: string) => `_{2n${tail || ''}}`);
  body = body.replace(/_(\d+)_\{([A-Za-z0-9]+)\}/g, '_{$1$2}');
  // Fix OCR typos inside chemical macros
  body = body
    .replace(/\bBC_\{l3\}|\bBC_\{l_3\}/g, 'BCl_{3}')
    .replace(/\bPOCI_\{3\}/g, 'POCl_{3}')
    .replace(/\bC6H_\{5COOH\}/g, 'C_{6}H_{5}COOH');
  // Brace unbraced multi-digit subscripts inside chemical macros e.g. _18 -> _{18}
  body = body.replace(/_(\d{2,})/g, '_{$1}');
  // Remove trailing empty `_` or `^` at end of macro body
  body = body.replace(/[_^]+$/g, '');
  return body;
}

/**
 * Finds `\mathrm{...}` and `\text{...}` spans, strips stray `$` inside their braces,
 * flattens nested chemical macros only inside standalone/chemical `\mathrm`/`\text` calls
 * (preserving legitimate outer math contexts like `\overrightarrow{\mathrm{A}}` or `\mathrm{v}_{\mathrm{e}}`),
 * and repairs missing closing `$` when it was swallowed inside braces.
 */
function repairNestedMacroSpans(input: string): string {
  let out = '';
  let i = 0;

  while (i < input.length) {
    const isMathrm = input.startsWith('\\mathrm{', i);
    const isText = !isMathrm && input.startsWith('\\text{', i);

    if (!isMathrm && !isText) {
      out += input[i];
      i++;
      continue;
    }

    // Determine whether this `\mathrm{` / `\text{` is already a sub-argument of another math command (e.g. `_{\mathrm{e}}` or `\overrightarrow{\mathrm{A}}`)
    const precededBySubSupOrBrace =
      /(?:[_^]|\}|\\(?:overrightarrow|vec|hat|bar|tilde|xrightarrow|underset|overset|frac|sqrt|text|mathrm)\{?)\s*$/.test(
        out
      );

    // Check how many `$` directly precede this macro if it starts a math span
    let leadingDollars = 0;
    if (!precededBySubSupOrBrace) {
      const mLead = out.match(/(\$+)$/);
      if (mLead) leadingDollars = mLead[1].length;
    }

    const macroName = isMathrm ? 'mathrm' : 'text';
    const openBraceIdx = i + macroName.length + 1;
    let j = openBraceIdx + 1;
    let depth = 1;
    let body = '';
    let hadInternalDollar = false;

    while (j < input.length && depth > 0) {
      const ch = input[j];
      if (ch === '$') {
        hadInternalDollar = true;
        j++;
        continue;
      }
      if (ch === '\n') {
        break;
      }
      if (ch === '{') {
        depth++;
        body += ch;
        j++;
      } else if (ch === '}') {
        depth--;
        if (depth > 0) {
          body += ch;
        }
        j++;
      } else {
        body += ch;
        j++;
      }
    }

    // Handle English fill-in-the-blank trapped inside macro braces (`\mathrm{They____}`, `\text{For___{did}}`)
    if (/_{2,}/.test(body) && /[A-Za-z]/.test(body)) {
      const blankFixed = body
        .replace(/\\(?:mathrm|text)\{([^{}]*)\}/g, '$1')
        .replace(/\{([A-Za-z0-9 ,.'"-]*)\}/g, ' $1 ')
        .replace(/_{2,}/g, ' ____ ')
        .replace(/\s+/g, ' ')
        .trim();
      out = out.replace(/\$+$/, '');
      while (j < input.length && input[j] === '$') j++;
      out += blankFixed;
      i = j;
      continue;
    }

    // Consume an immediately following extra `}` ONLY if `hadInternalDollar` AND next char is `$` (from broken `_{\dots}}$`)
    if (hadInternalDollar && depth === 0 && j < input.length && input[j] === '}' && input[j + 1] === '$') {
      j++;
    }

    let trailingDollars = 0;
    while (j < input.length && input[j] === '$') {
      trailingDollars++;
      j++;
    }

    const cleanBody = cleanMacroBody(body);
    let renderedMacro = '';

    if (macroName === 'text' && (cleanBody.includes('_') || cleanBody.includes('^'))) {
      const fixedInner = cleanBody
        .replace(/_(\d+)/g, '_{$1}')
        .replace(/\^([0-9]+[+\-]?|[+\-])/g, '^{$1}');
      if (/^[A-Za-z-]+-[A-Za-z]+_/.test(fixedInner)) {
        renderedMacro = fixedInner.replace(
          /^([A-Za-z-]+)-([A-Za-z]+)(_\{[^{}]+\}|\^[^{}]+)$/,
          '\\text{$1-}\\mathrm{$2$3}'
        );
      } else if (/\s/.test(fixedInner)) {
        renderedMacro = `\\mathrm{${fixedInner.replace(/\s+/g, '\\ ')}}`;
      } else {
        renderedMacro = `\\mathrm{${fixedInner}}`;
      }
    } else {
      renderedMacro = `\\${macroName}{${cleanBody}}`;
    }

    // Balance `$` delimiters cleanly using dollar parity before the macro
    const countSingleDollars = (s: string): number => {
      const noEsc = s.replace(/\\\$/g, '').replace(/\$\$/g, '');
      return (noEsc.match(/\$/g) || []).length;
    };
    const beforeLead = leadingDollars > 0 ? out.slice(0, out.length - leadingDollars) : out;
    const isMathOpenBeforeLead = countSingleDollars(beforeLead) % 2 === 1;

    if (hadInternalDollar && !precededBySubSupOrBrace) {
      if (leadingDollars > 0) {
        if (isMathOpenBeforeLead) {
          // Previous math span was still open, so first `$` closes it and second opens this macro
          out = beforeLead + '$ ' + '$' + renderedMacro + '$';
        } else {
          out = beforeLead + '$' + renderedMacro + '$';
        }
      } else if (isMathOpenBeforeLead) {
        // Math was already open before this macro
        out += renderedMacro + '$';
      } else {
        out += '$' + renderedMacro + '$';
      }
    } else {
      out += renderedMacro;
      if (trailingDollars > 0) {
        out += '$'.repeat(trailingDollars);
      }
    }

    i = j;
  }

  return out;
}

/**
 * Unwraps `\mathrm{...}` / `\text{...}` fragments that were damaged by nested `$`
 * or nested `\mathrm` / `\text` macros, and repairs merged chemical subscripts.
 */
function stripMacroWrappers(str: string): string {
  // Recursively remove `\mathrm{...}` / `\text{...}` wrappers even with nested `{...}` inside
  let s = str;
  let idx = 0;
  while ((idx = s.search(/\\(?:mathrm|text)\{/)) !== -1) {
    const start = idx;
    const braceStart = s.indexOf('{', start);
    let depth = 1;
    let j = braceStart + 1;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    if (depth === 0) {
      s = s.slice(0, start) + s.slice(braceStart + 1, j - 1) + s.slice(j);
    } else {
      break;
    }
  }
  return s;
}

function repairDamagedMacros(text: string): string {
  let out = text;

  // 1. Repair [IMAGE: ...] URLs FIRST so any accidental `$` inside URLs is removed before bracket rules
  out = out.replace(/\[IMAGE:\s*([^\]]+?)\s*\]/gi, (_m, urlBody: string) => {
    const fixedUrl = urlBody
      .replace(/\\(?:text|mathrm)\{/g, '')
      .replace(/[$}{}]/g, '')
      .trim();
    return `[IMAGE: ${fixedUrl}]`;
  });

  // 1b. Repair already-damaged inline artifacts (e.g. `√$\frac{3}{2}$`, `[ML^$\mathrm{3T^{-2}}$]`, `mol^$\mathrm{2L^{-2}}$`, `[Cu($\mathrm{H}_2\mathrm{O}$)_4]^2+`)
  out = out
    .replace(/^\\\(0$/g, '$0$')
    .replace(/\$\$\s*(\[[^\]]+\][A-Z][A-Za-z0-9_]*)/g, (_m, expr: string) => `$${expr.replace(/_(\d+)/g, '_{$1}')}$`)
    .replace(/\^\s*([+\-])\s*\$\s*(\\mathrm\{(?:[^{}]|\{[^{}]*\})+\})\$?/g, (_m, sgn: string, body: string) => `$^{${sgn}}${body}$`)
    .replace(/\^\$\s*_(\d+)\^(\d+)([A-Z][a-z]?)\s*\$/g, '$$^{$2}_{$1}\\mathrm{$3}$$')
    // Repair `2×10^$\mathrm{11Nm^{-1})}$`
    .replace(
      /(\d+(?:\.\d+)?)\s*[×xX]\s*10\^\$\s*\\mathrm\{(-?\d+)([A-Za-z]+)\^\{(-?\d+)\}(\)?)\}\$?/g,
      (_m, coeff: string, e1: string, unit: string, e2: string, paren: string) =>
        `$${coeff} \\times 10^{${e1}}\\,\\mathrm{${unit}}^{${e2}}$${paren}`
    )
    // Fix split amine/ligand complex like `Ag($\mathrm{NH_{3})}$ $\mathrm{_{2}Cl}$` or `2Ag($\mathrm{NH_{3})}$ $\mathrm{_{2}O}$H_(aq)`
    .replace(
      /(\d*[A-Z][a-z]?)\(\$\s*\\mathrm\{([A-Za-z]+_\{?\d+\}?)\)\}\$?\s*\$\s*\\mathrm\{_\{?(\d+)\}?([A-Za-z0-9()_]+)\}\$?([A-Za-z0-9()_]*)/g,
      (_m, metal: string, lig: string, sub: string, tail: string, post: string) =>
        `$\\mathrm{${metal}(${lig})_{${sub}}${tail}${post.replace(/_\((g|l|s|aq)\)/g, '($1)')}}$`
    )
    // Fix trailing electron count outside `$` like `$[\mathrm{Kr}]\, 4d^{4}\, 5s$2`
    .replace(/([1-7][spdf])\$([0-9]+)(?![0-9])/g, '$1^{$2}$')
    // Merge electron subshells split like `3$\text{d}^{4}$ \, 4$\text{s}^{2}$`
    .replace(/(\d)\s*\$\s*\\(?:text|mathrm)\{([spdf])\}\^\{?(\d+)\}?\s*\$/g, (_m, n: string, orb: string, cnt: string) => `$${n}\\mathrm{${orb}}^{${cnt}}$`)
    .replace(/([A-Za-z0-9\}])_\((g|l|s|aq)\)/g, '$1\\mathrm{($2)}')
    // Fix parenthesized fraction powers `($\frac{1}{3}$)^2` -> `$\left(\frac{1}{3}\right)^{2}$`
    .replace(/\(\s*\$\s*(\\frac\{[^{}]+\}\{[^{}]+\})\s*\$\s*\)\s*\^\s*(\{?-?\d+\}?)/g, (_m, f: string, exp: string) => {
      const cleanExp = exp.startsWith('{') ? exp.slice(1, -1) : exp;
      return `$\\left(${f}\\right)^{${cleanExp}}$`;
    })
    // Fix damaged `(2x^2-1/($2x^{3}))^{10}$` (including `$` inside nested inner parens), skipping `\left(...\right)`
    .replace(/\$?\(([^()\n]*(?:\([^()\n]+\)[^()\n]*)*)\)\^(\{?-?\d+\}?)\$?/g, (m, inner: string, exp: string) => {
      if (!inner.includes('$') || /\\left|\\right/.test(inner) || /[^\x00-\x7F]/.test(inner)) return m;
      const cleanExp = exp.startsWith('{') ? exp.slice(1, -1) : exp;
      const cleanInner = inner
        .replace(/\$/g, '')
        .replace(/(\d+)\s*\/\s*\(([^()]+)\)/g, '\\frac{$1}{$2}')
        .replace(/\^(\d+)/g, '^{$1}');
      return `$\\left(${cleanInner}\\right)^{${cleanExp}}$`;
    })
    // √$\frac{a}{b}$ -> $\frac{\sqrt{a}}{b}$
    .replace(/√\s*\$\s*\\frac\{(\d+)\}\{(\d+)\}\s*\$/g, (_m, a: string, b: string) => `$\\frac{\\sqrt{${a}}}{${b}}$`)
    // Fix spaced carets before digits/braces like `dm ^3`, `t ^ 2`, `x ^{2}`
    .replace(/([A-Za-z0-9)\]])\s+\^\s*(\{?-?\d+\}?)/g, '$1^$2')
    // Clean stray isolated `^` or `_` between `$` and Bengali text or `;`
    .replace(/(\$)\s*[\^_]\s*(?=[^\x00-\x7F])/g, '$1 ')
    .replace(/(\$;)\s*_\s*/g, '$1 ')
    // Repair damaged dimensional formulas `[ML^$\mathrm{3T^{-2}}$]`, `$[S]=[ML^2T^{-1}]$` cleanly respecting outer `$`
    .replace(/\[([^\[\]\n]*M[^\[\]\n]*T[^\[\]\n]*)\]/g, (m, inner: string, offset: number, full: string) => {
      if (!/[MLT].*\^/.test(inner)) return m;
      const before = full.slice(0, offset).replace(/\\\$/g, '').replace(/\$\$/g, '');
      const inMath = (before.match(/\$/g) || []).length % 2 === 1;
      if (!inner.includes('$') && inMath) return m;
      const flattened = stripMacroWrappers(inner.replace(/\$/g, ''));
      const stripped = flattened
        .replace(/\^\{?(-?\d+)\}?/g, '^{$1}')
        .replace(/\s+/g, '');
      if (!/^[MLT0-9^{}\-]+$/.test(stripped)) return m;
      return inMath ? `[\\mathrm{${stripped}}]` : `$[\\mathrm{${stripped}}]$`;
    })
    // Repair damaged unit exponents like `mol^$\mathrm{2L^{-2}}$` or `mol^-$\mathrm{2L^{-2}}$`
    .replace(
      /\b([A-Za-z]{1,4})\^(-?)\$\s*\\mathrm\{(\d+)([A-Za-z]{1,3})\^\{(-?\d+)\}\}\s*\$/g,
      (_m, u1: string, neg: string, e1: string, u2: string, e2: string) =>
        `$\\mathrm{${u1}}^{${neg}${e1}}\\,\\mathrm{${u2}}^{${e2}}$`
    )
    // Repair coordination complexes damaged by internal `$` inside `[...]` e.g. `[Cu($\mathrm{H}_2\mathrm{O}$)_4]^2+`, `[Co($\mathrm{NO_{2})_{6}}$]`
    .replace(
      /\[([A-Z][a-z]?(?:[^\[\]\n]*\$[^\[\]\n]*))\](?:\^(\{[^}]+\}|[0-9]*[+\-]))?/g,
      (m, inner: string, extCharge: string | undefined, offset: number, full: string) => {
        if (/^IMAGE:/i.test(inner) || /[^\x00-\x7F]|=/.test(inner)) return m;
        const before = full.slice(0, offset).replace(/\\\$/g, '').replace(/\$\$/g, '');
        const inMath = (before.match(/\$/g) || []).length % 2 === 1;
        let cleaned = stripMacroWrappers(inner.replace(/\$/g, ''))
          .replace(/\\(?:mathrm|text)\{/g, '')
          .replace(/\s+/g, '')
          // Remove extra macro closing brace before `)` ONLY when not immediately closing a valid subscript like `_{2}`
          .replace(/(?<!_\{[0-9]{1,3})\}\)/g, ')')
          .replace(/_\{(\d+)\)/g, '_{$1})')
          .replace(/_(\d+)/g, '_{$1}')
          .replace(/_\{(\d+)\)_\{(\d+)\}/g, '_{$1})_{$2}');
        const openB = (cleaned.match(/\{/g) || []).length;
        const closeB = (cleaned.match(/\}/g) || []).length;
        if (closeB > openB) {
          let extra = closeB - openB;
          cleaned = cleaned.replace(/\}+$/g, (endBr) => endBr.slice(Math.min(extra, endBr.length)));
        }
        const openP = (cleaned.match(/\(/g) || []).length;
        const closeP = (cleaned.match(/\)/g) || []).length;
        if (openP > closeP) cleaned += ')'.repeat(openP - closeP);
        const body = extCharge
          ? `[\\mathrm{${cleaned}}]^{${extCharge.startsWith('{') ? extCharge.slice(1, -1) : extCharge}}`
          : `[\\mathrm{${cleaned}}]`;
        return inMath ? body : `$${body}$`;
      }
    );

  // 2. Revert false-positive bit fractions like $\frac{7}{8}$ bit -> 7/8 bit
  out = out.replace(/\$\s*\\frac\{(\d+)\}\{(\d+)\}\s*\$\s*(bits?|bytes?)/gi, '$1/$2 $3');
  out = out.replace(/\\frac\{(\d+)\}\{(\d+)\}\s*(bits?|bytes?)/gi, '$1/$2 $3');

  // 2b. Fix swapped `}$)` in state/pressure annotations like `(g}$)`, `(s}$)`, `(aq}$)`, `(1atm}$)`
  out = out.replace(/(\([A-Za-z0-9., ]{1,8})\}(\$?)\)/g, '$1)$2}');
  out = out.replace(/(\((?:g|l|s|aq)\})\$/g, (_m, a: string) => a.slice(0, -1) + ')');

  // 2c. Fix Tollens reagent OCR typo `2Ag(\text{NH_{3})_{2OH}_(aq})` and double-caret typos `^-^24`
  out = out.replace(/2Ag\(\s*\\text\{NH_\{3\}\)\_\{2OH\}\_?\(aq\}\)/gi, '$2\\mathrm{Ag(NH_{3})_{2}OH(aq)}$');
  out = out.replace(/\^-\^(\d+)/g, '^{-$1}');

  // 2d. Fix impossible multi-digit subshell counts from concatenated electron configs (e.g. `3s^{23}$$p^{6}`, `2s^{22}$$p^{63}s^{23}p^{6} 3d^{104}p^{6}`)
  for (let pass = 0; pass < 3; pass++) {
    out = out
      .replace(/([1-7]s)\^\{([12])([1-7])\}(?:\$\$)?([spdf])/g, '$1^{$2}\\, $3$4')
      .replace(/([1-7]?p)\^\{([1-6])([1-7])\}(?:\$\$)?([spdf])/g, '$1^{$2}\\, $3$4')
      .replace(/([1-7]d)\^\{(10|[1-9])([1-7])\}(?:\$\$)?([spdf])/g, '$1^{$2}\\, $3$4')
      .replace(/([1-7]f)\^\{(1[0-4]|[1-9])([1-7])\}(?:\$\$)?([spdf])/g, '$1^{$2}\\, $3$4');
  }

  // 2e. Fix exponents split by `$` (e.g. `8.85 x 10^-$12C^{2}$`, `C^$\mathrm{2N^{-}}$$1m^{2}$`)
  out = out.replace(
    /(\b\d+(?:\.\d+)?)\s*[×xX]\s*10\^-\$([0-9]+)/g,
    (_m, coeff: string, exp: string) => `$${coeff} \\times 10^{-${exp}}`
  );
  out = out.replace(/(\b[A-Za-z0-9]+)\^-\$([0-9]+)/g, (_m, base: string, exp: string) => `$${base}^{-${exp}}`);
  out = out.replace(
    /([A-Za-z0-9])\^\$\\(?:mathrm|text)\{(\d+)([A-Za-z]+)\^\{?([+\-])\}?\}\$\$?(\d+)([A-Za-z]+\^\{?[^}$]+\}?)\$?/g,
    (_m, u1: string, e1: string, u2: string, sgn: string, e2: string, rest: string) =>
      `$${u1}^{${e1}}\\mathrm{${u2}}^{${sgn}${e2}}${rest}$`
  );
  out = out.replace(/\\mathrm\{([A-Za-z]+)\^\{([+\-])\}(\d+)([A-Za-z]+\^\{[^}]+\})\}/g, '\\mathrm{$1}^{$2$3}$4');

  // 3. Structural balanced-brace repair for all `\mathrm{...}` / `\text{...}` spans
  out = repairNestedMacroSpans(out);

  // 4. Clean up `$$` around inline `\mathrm` / `\text` formulas -> single `$`
  out = out.replace(/\$\$\s*(\\(?:mathrm|text)\{[^$\n]+\})\s*\$\$/g, (_m, expr: string) => `$${expr}$`);

  // 5. Fix split formula prefixes like `Na₂$\mathrm{SO_{4}}$` or `H₂$\mathrm{SO_{4}}$` or `$O_2N$\mathrm{CO_{2}H}`
  out = out.replace(
    /\b([A-Z][a-z]?[₀₁₂₃₄₅₆₇₈₉0-9]+)\s*\$\$?(\\mathrm\{(?:[^{}]|\{[^{}]*\})+\})\$\$?/g,
    (_m, head: string, tail: string) => {
      const innerTail = tail.slice('\\mathrm{'.length, -1);
      return `$\\mathrm{${replaceUnicodeSubSup(head)}${innerTail}}$`;
    }
  );
  // Helper to cleanly split into [plain, math, plain, math, ...] tokens
  const splitMathTokens = (s: string): string[] =>
    s.split(/(\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]+?(?<!\\)\$)/g);

  // Merge `$O_2N$` followed immediately by bare `\mathrm{CO_{2}H}`
  {
    const toks = splitMathTokens(out);
    for (let k = 1; k < toks.length - 1; k += 2) {
      if (toks[k].startsWith('$') && !toks[k].startsWith('$$')) {
        const nextPlain = toks[k + 1] ?? '';
        const mTail = nextPlain.match(/^\s*(\$?\\mathrm\{(?:[^{}]|\{[^{}]*\})+\}\$?)/);
        if (mTail && /^[$\w_{}^]+$/.test(toks[k].slice(1, -1))) {
          const innerHead = toks[k].slice(1, -1);
          const strippedTail = mTail[1].replace(/^\$|\$$/g, '');
          toks[k] = `$${innerHead}${strippedTail}$`;
          toks[k + 1] = nextPlain.slice(mTail[0].length);
        }
      }
    }
    out = toks.join('');
  }

  // 6. Fix `$\frac{3}{5}$\text{$R_{H}}`, `3x^$\frac{1}{3}$`, `π^$\frac{2}{2}$`, `$\frac{1}{4}$ x^$\frac{1}{2}$`
  out = out.replace(
    /\$\s*(\\frac\{[^{}]+\}\{[^{}]+\})\s*\$\s*\\(?:text|mathrm)\{\$?((?:[^{}]|\{[^{}]*\})+)\}\$?/g,
    (_m, fracExpr: string, sym: string) => `$${fracExpr} ${sym}$`
  );
  out = out.replace(
    /\$\s*(\\frac\{[^{}]+\}\{[^{}]+\})\s*\$\s*([a-zA-Z])\^\$\s*(\\frac\{[^{}]+\}\{[^{}]+\})\s*\$/g,
    (_m, f1: string, sym: string, f2: string) => `$${f1} ${sym}^{${f2}}$`
  );
  // Fix `π^2/2` already damaged into `π^$\frac{2}{2}$` vs fractional exponent `3x^$\frac{1}{3}$`
  out = out.replace(
    /(\d*[πa-zA-Z])\^\$\s*(-?)\\frac\{(\d+)\}\{(\d+)\}\s*\$/g,
    (_m, base: string, neg: string, num: string, den: string) => {
      if (base.includes('π') && !neg) {
        return `$\\frac{${base.replace(/π/g, '\\pi ')}^{${num}}}{${den}}$`;
      }
      return `$${base}^{${neg}\\frac{${num}}{${den}}}$`;
    }
  );

  // 7. Fix `[$\mathrm{Cu(NH_{3})_{4}}$]^2+` or `[$\mathrm{Fe(CN)_{6}}$]^3-`
  out = out.replace(
    /\[\s*\$\$?\\mathrm\{((?:[^{}]|\{[^{}]*\})+)\}\$\$?\s*\]\^([0-9]+[+\-]?|[+\-][0-9]*)/g,
    (_m, inner: string, charge: string) => `$[\\mathrm{${inner}}]^{${charge}}$`
  );

  // 8. Fix `$\mathrm{ClO_{3}}$^-(aq)` or `$\mathrm{S_{4}O_{6}}$^2-` trailing charge outside `$`
  out = out.replace(
    /\$\$?\\mathrm\{((?:[^{}]|\{[^{}]*\})+)\}\$\$?\^([0-9]*[+\-])(\([a-z]+\))?/g,
    (_m, inner: string, charge: string, state?: string) =>
      `$\\mathrm{${inner}}^{${charge}}${state ? `\\text{${state}}` : ''}$`
  );

  // 9. Wrap bare `\mathrm{...}` or `\text{...}` created outside math delimiters
  out = splitMathTokens(out)
    .map((seg, idx) => {
      if (idx % 2 === 1) return seg;
      let fixed = seg.replace(/\\(?:mathrm|text)\{(?:[^{}]|\{[^{}]*\})+\}/g, (m) => `$${m}$`);
      fixed = fixed.replace(/\\to\b/g, '$\\to$');
      return fixed;
    })
    .join('');

  // Token-safe merge of adjacent inline math formulas separated strictly by `+` or `$\to$`
  {
    let toks = splitMathTokens(out);
    let merged = true;
    while (merged) {
      merged = false;
      const nextToks: string[] = [];
      let k = 0;
      while (k < toks.length) {
        if (
          k % 2 === 1 &&
          k + 2 < toks.length &&
          toks[k].startsWith('$') &&
          !toks[k].startsWith('$$') &&
          /^\s*\+\s*$/.test(toks[k + 1]) &&
          toks[k + 2].startsWith('$') &&
          !toks[k + 2].startsWith('$$')
        ) {
          nextToks.push(`$${toks[k].slice(1, -1)} + ${toks[k + 2].slice(1, -1)}$`);
          k += 3;
          // append next plain token so parity stays aligned before re-splitting
          if (k < toks.length) {
            nextToks.push(toks[k]);
            k++;
          }
          merged = true;
          continue;
        }
        if (
          k % 2 === 1 &&
          k + 4 < toks.length &&
          toks[k].startsWith('$') &&
          !toks[k].startsWith('$$') &&
          /^\s*$/.test(toks[k + 1]) &&
          toks[k + 2] === '$\\to$' &&
          /^\s*$/.test(toks[k + 3]) &&
          toks[k + 4].startsWith('$') &&
          !toks[k + 4].startsWith('$$')
        ) {
          nextToks.push(`$${toks[k].slice(1, -1)} \\to ${toks[k + 4].slice(1, -1)}$`);
          k += 5;
          if (k < toks.length) {
            nextToks.push(toks[k]);
            k++;
          }
          merged = true;
          continue;
        }
        nextToks.push(toks[k]);
        k++;
      }
      toks = splitMathTokens(nextToks.join(''));
    }
    out = toks.join('');
  }

  // 10. Clean inline `$$...$$` -> single `$...$`
  out = out.replace(/\$\$([^$\n]{1,120})\$\$/g, (m, inner: string, offset: number, full: string) => {
    const before = full.slice(Math.max(0, offset - 1), offset);
    const after = full.slice(offset + m.length, offset + m.length + 1);
    const standalone =
      (offset === 0 || before === '\n') && (offset + m.length === full.length || after === '\n');
    if (!standalone && /\\mathrm|\\text|\\frac|\\to|_|\^/.test(inner)) {
      return `$${inner}$`;
    }
    return m;
  });

  // 10b. Token-safe pull of subscripts/superscripts immediately after `$...$` (e.g. `$\mathrm{Cr}$^{3+}`, `$\mathrm{H}$_2`)
  // and removal of stray trailing `^` / `_` (e.g. `$\Delta E^0$^ এর মান`)
  {
    const toks = splitMathTokens(out);
    for (let k = 1; k < toks.length - 1; k += 2) {
      if (toks[k].startsWith('$') && !toks[k].startsWith('$$')) {
        const nextPlain = toks[k + 1] ?? '';
        const mScript = nextPlain.match(/^([_^])(\{[^{}]+\}|[0-9]+[+\-]?|[+\-])/);
        if (mScript) {
          const inner = toks[k].slice(1, -1);
          const op = mScript[1];
          const val = mScript[2].startsWith('{') ? mScript[2].slice(1, -1) : mScript[2];
          if (op === '^' && /\^\{[^{}]+\}$/.test(inner)) {
            toks[k] = `$${inner.replace(/\^\{([^{}]+)\}$/, `^{$1${val}}`)}$`;
          } else if (op === '_' && /_\{[^{}]+\}$/.test(inner)) {
            toks[k] = `$${inner.replace(/_\{([^{}]+)\}$/, `_{$1${val}}`)}$`;
          } else {
            toks[k] = `$${inner}${op}{${val}}$`;
          }
          toks[k + 1] = nextPlain.slice(mScript[0].length);
        } else if (/^[_^](?=\s|[^\x00-\x7F]|$)/.test(nextPlain)) {
          toks[k + 1] = nextPlain.slice(1);
        }
      }
    }
    out = toks.join('');
  }

  // 10c. Clean literal `\,` that leaked outside `$...$` between two math expressions
  out = out.replace(/\$\s*\\,\s*\$/g, '$ \\, $');

  // Escape lone `$5` currency/typo if still odd number of `$`
  const testNoDisplay = out.replace(/\$\$[\s\S]*?\$\$/g, '');
  const singleMatches = [...testNoDisplay.matchAll(/(?<!\\)\$/g)];
  if (singleMatches.length % 2 !== 0) {
    out = out.replace(/(?<!\\)\$(\d+(?:\.\d+)?)(?=\s|[^\x00-\x7F]|$)/g, '\\$$$1');
  }

  return mergeAdjacentInlineMath(out);
}

/**
 * Resolves colliding `$A$$B$` inline math spans where a closing `$` touches an opening `$`.
 */
function mergeAdjacentInlineMath(input: string): string {
  let out = '';
  let i = 0;
  let state: 'plain' | 'inline' | 'display' = 'plain';
  let inlineBuf = '';

  const UNIT_HEAD_RE = /^\\(?:mathrm|text)\{(?:km|m|cm|mm|kg|g|mg|mol|mmol|dm|L|l|mL|ml|J|kJ|cal|kcal|W|kW|V|mV|kV|A|mA|N|kN|Pa|kPa|Hz|s|hr|h|min|C|K)\b/;

  const joinInline = (a: string, b: string): { merged: boolean; left: string; right: string } => {
    const tA = a.trimEnd();
    const tB = b.trimStart();
    if (!tA) return { merged: true, left: tB, right: '' };
    if (!tB) return { merged: true, left: tA, right: '' };

    const endsWithOp = /(?:[+\-=<>(\[{]|\\to|\\rightarrow|\\cdot|\\times|\\rm)$/.test(tA);
    const startsWithOpOrPunct = /^(?:[+\-=<>)\]},.;:^_]|\\to\b|\\rightarrow\b)/.test(tB);
    const isOrbitalPair =
      /(?:[1-7][spdf](?:\^\{?\d+\}?)?)$/.test(tA) && /^(?:[1-7][spdf](?:\^|$|\s|\\,|\\mathrm|\\text)?)/.test(tB);
    const isHybridPair =
      /(?:sp\^\{?\d+\}?|d\^\{?\d+\}?)$/.test(tA) && /^(?:sp|d)\^/.test(tB);
    const isUnitAfterNum = /(?:\d\}?)$/.test(tA) && UNIT_HEAD_RE.test(tB);
    const isDiffPair = /d\^\{?\d+\}?$/.test(tA) && /^[a-zA-Z]\/d[a-zA-Z]/.test(tB);

    if (endsWithOp || startsWithOpOrPunct || isHybridPair || isDiffPair) {
      const needSpace =
        (/\\(?:to|rightarrow|cdot|times|rm)$/.test(tA) && /^[A-Za-z0-9\\]/.test(tB)) ||
        (tA.endsWith('+') && tB.startsWith('\\alpha'));
      return { merged: true, left: `${tA}${needSpace ? ' ' : ''}${tB}`, right: '' };
    }
    if (isOrbitalPair || isUnitAfterNum) {
      return { merged: true, left: `${tA}\\, ${tB}`, right: '' };
    }
    return { merged: false, left: tA, right: tB };
  };

  while (i < input.length) {
    const ch = input[i];
    if (ch === '\\' && i + 1 < input.length && input[i + 1] === '$') {
      if (state === 'inline') inlineBuf += '\\$';
      else out += '\\$';
      i += 2;
      continue;
    }

    if (ch !== '$') {
      if (state === 'inline') inlineBuf += ch;
      else out += ch;
      i++;
      continue;
    }

    const isDouble = input[i + 1] === '$';
    if (state === 'plain') {
      if (isDouble) {
        state = 'display';
        out += '$$';
        i += 2;
      } else {
        state = 'inline';
        inlineBuf = '';
        i += 1;
      }
    } else if (state === 'display') {
      if (isDouble) {
        state = 'plain';
        out += '$$';
        i += 2;
      } else {
        i += 1;
      }
    } else {
      // Currently inside inline `$`
      if (isDouble) {
        // Scan ahead to find closing `$` of next inline chunk on same line
        let j = i + 2;
        while (j < input.length && input[j] !== '$' && input[j] !== '\n') {
          if (input[j] === '\\' && j + 1 < input.length) j += 2;
          else j++;
        }
        if (j < input.length && input[j] === '$') {
          const nextChunk = input.slice(i + 2, j);
          const joined = joinInline(inlineBuf, nextChunk);
          if (joined.merged) {
            inlineBuf = joined.left;
          } else {
            out += `$${joined.left}$ `;
            inlineBuf = joined.right;
          }
          i = j; // Let loop process the `$` (or `$$`) at `j`
        } else {
          // No matching closing `$` after `$$` — close inline span cleanly
          out += `$${inlineBuf.trim()}$`;
          state = 'plain';
          inlineBuf = '';
          i += 2;
        }
      } else {
        out += `$${inlineBuf}$`;
        state = 'plain';
        inlineBuf = '';
        i += 1;
      }
    }
  }

  if (state === 'inline' && inlineBuf) {
    out += `$${inlineBuf}$`;
  }
  return out;
}

/**
 * Normalizes contents inside an existing `$ ... $` or `$$ ... $$` KaTeX block.
 */
function normalizeMathInner(rawInner: string): string {
  let math = rawInner;

  math = math.replace(/(?<!\\)\$/g, '');

  // Handle Unicode symbols inside `\text{...}` cleanly BEFORE general symbol replacement
  // e.g., `\text{ μF}` -> `\mu\text{F}`, `\text{DNA→mRNA→}` -> `\text{DNA}\to\text{mRNA}\to`
  math = math.replace(/\\text\{([^{}]+)\}/g, (_m, innerText: string) => {
    let t = innerText;
    if (/[μΩ→←⇌]/.test(t)) {
      t = t
        .replace(/μ/g, '}\\mu\\text{')
        .replace(/Ω/g, '}\\Omega\\text{')
        .replace(/→/g, '}\\to\\text{')
        .replace(/←/g, '}\\leftarrow\\text{')
        .replace(/⇌/g, '}\\rightleftharpoons\\text{');
      return `\\text{${t}}`.replace(/\\text\{\s*\}/g, '');
    }
    return `\\text{${t}}`;
  });

  math = math
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/π/g, '\\pi ')
    .replace(/ħ/g, '\\hbar ')
    .replace(/θ/g, '\\theta ')
    .replace(/α/g, '\\alpha ')
    .replace(/β/g, '\\beta ')
    .replace(/γ/g, '\\gamma ')
    .replace(/δ/g, '\\delta ')
    .replace(/Δ/g, '\\Delta ')
    .replace(/ω/g, '\\omega ')
    .replace(/λ/g, '\\lambda ')
    .replace(/μ/g, '\\mu ')
    .replace(/σ/g, '\\sigma ')
    .replace(/Ω/g, '\\Omega ')
    .replace(/∞/g, '\\infty ')
    .replace(/≤/g, '\\le ')
    .replace(/≥/g, '\\ge ')
    .replace(/≠/g, '\\ne ')
    .replace(/≈/g, '\\approx ')
    .replace(/±/g, '\\pm ')
    .replace(/\\u2192/gi, '\\to ')
    .replace(/\\u2190/gi, '\\leftarrow ')
    .replace(/\\u21c[bc]/gi, '\\rightleftharpoons ')
    .replace(/\\u00b0/gi, '^\\circ ')
    .replace(/\^o\^/gi, '^\\circ ')
    .replace(/→/g, '\\to ')
    .replace(/←/g, '\\leftarrow ')
    .replace(/⇌/g, '\\rightleftharpoons ')
    .replace(/°/g, '^\\circ ');

  // Convert literal `√` inside math mode (`√(3RT/M)` or `√ 3 R T \div M`) into `\sqrt{...}`
  math = math.replace(/√\s*\(([^()]+)\)/g, '\\sqrt{$1}');
  math = math.replace(/√\s*([^{}\n]+)/g, (_m, rest: string) => `\\sqrt{${rest.trim()}}`);
  // Fix unbraced multi-digit `\sqrt34` -> `\sqrt{34}`
  math = math.replace(/\\sqrt(\d{2,})(?![0-9])/g, '\\sqrt{$1}');

  math = replaceUnicodeSubSup(math);

  math = math.replace(/\\circC\b/g, '^\\circ\\text{C}');
  math = math.replace(/\^\s*\\circ\s*C\b/g, '^\\circ\\text{C}');

  // Clean general chemical formulas / merged subscripts inside math
  math = math.replace(/_\{(\d+)([A-Z][A-Za-z0-9]*)\}/g, '_{$1}$2');
  math = math.replace(/S_\{20\}_\{3\}/g, 'S_{2}O_{3}');
  math = math.replace(/(_\{?[A-Za-z0-9]+\}?)_([A-Z][A-Za-z0-9]*)/g, '$1$2');
  math = math.replace(/C_\{nH\}/g, 'C_{n}H');
  math = math.replace(/_2_\{n\}([+-]\d+|[+-][a-z])?/g, (_m, tail?: string) => `_{2n${tail || ''}}`);
  math = math.replace(/_2n([+-]\d+|[+-][a-z])?/g, (_m, tail?: string) => `_{2n${tail || ''}}`);
  math = math.replace(/_(\d+)_\{([A-Za-z0-9]+)\}/g, '_{$1$2}');
  math = math.replace(/_(\d{2,})/g, '_{$1}');

  // Fix trailing bare `_` or `^` and stray repeated carets (`^^^=`)
  math = math.replace(/([_^])(\s*(?:\}|$))/g, '$2');
  math = math.replace(/\^{2,}\s*=/g, ' = ');

  // Fix double-caret or fraction-exponent typos (`N^{-}1` -> `N^{-1}`, `10^{2}^{2}` -> `10^{22}`, `2x^{2+}\frac` -> `2x^{2}+\frac`)
  math = math.replace(/([a-zA-Z0-9])\^\{(\d+)([+\-])\}(?=\\frac|\\[A-Za-z])/g, '$1^{$2}$3');
  math = math.replace(/\^-\^(\d+)/g, '^{-$1}');
  math = math.replace(/\^([0-9]+)\^([+\-0-9]+)/g, '^{$1$2}');
  math = math.replace(/\^\{([^{}]+)\}\s*\^\{([^{}]+)\}/g, '^{$1$2}');
  math = math.replace(/\^\{([^{}]+)\}\s*\^([+\-0-9]+)/g, '^{$1$2}');
  math = math.replace(/_\{([^{}]+)\}\s*_\{([^{}]+)\}/g, '_{$1$2}');
  math = math.replace(/\^\{([+\-])\}(\d+)/g, '^{$1$2}');
  math = math.replace(/\^(-?\d+)\/(\d+)/g, '^{-\\frac{$1}{$2}}'.replace('{-\\frac{-', '{\\frac{-'));
  math = math.replace(/\^-\s*(\d+[a-zA-Z]*)/g, '^{-$1}');
  math = math.replace(/\^([0-9]+[+\-](?![A-Za-z0-9])|[+\-][0-9]*)/g, '^{$1}');

  // Fix `\frac}{a}{b}` & `\frac {a} {b}` spacing & lowercase `z_{1z}_{2}` double-subscript
  math = math.replace(/\\frac\}\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '\\frac{$1}{$2}');
  math = math.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '\\frac{$1}{$2}');
  math = math.replace(/([a-zA-Z])_\{(\d+)([a-zA-Z])\}_\{(\d+)\}/g, '$1_{$2}$3_{$4}');
  math = math.replace(/\\frac\{R\^\{3\}\{2\}\}/g, 'R^{\\frac{3}{2}}');
  math = math.replace(/\\frac\{R\^3\{2\}\}/g, 'R^{\\frac{3}{2}}');

  // Convert differential notation like `d^{2}x/dt^{2}` -> `\frac{d^{2}x}{dt^{2}}`
  math = math.replace(
    /\b(\d*d(?:\^\{?\d+\}?)?[a-zA-Z])\/(d[a-zA-Z](?:\^\{?\d+\}?)?)\b/g,
    '\\frac{$1}{$2}'
  );

  // Convert math fractions inside `$...$` like `1/2`, `1/8`, `q_1/q_2`, safely ignoring `t_{1/2}`
  math = math.replace(
    /(?<![\\A-Za-z0-9_{])([A-Za-z](?:_\{[A-Za-z0-9]+\}|_[A-Za-z0-9])?|\d+)\s*\/\s*([A-Za-z](?:_\{[A-Za-z0-9]+\}|_[A-Za-z0-9])?|\d+)(?![A-Za-z0-9_}])/g,
    (full, num: string, den: string, offset: number, src: string) => {
      const around = src.slice(Math.max(0, offset - 12), Math.min(src.length, offset + full.length + 12));
      if (/\((?:aq|g|l|s)\)/i.test(around) || /\bPt\b/.test(around)) {
        return full;
      }
      const isBothPureDigits = /^\d+$/.test(num) && /^\d+$/.test(den);
      if (!isBothPureDigits) {
        if (MATH_UNIT_OR_CONTEXT_RE.test(num) && MATH_UNIT_OR_CONTEXT_RE.test(den)) {
          return full;
        }
        if (
          /^(?:km|m|cm|mm|kg|g|mg|mol|dm|L|l|mL|J|kJ|W|kW|V|kV|A|N|kN|Pa|Hz|rad|s|hr|h|min|C|K)$/i.test(num) ||
          /^(?:km|m|cm|mm|kg|g|mg|mol|dm|L|l|mL|J|kJ|W|kW|V|kV|A|N|kN|Pa|Hz|rad|s|hr|h|min|C|K)$/i.test(den)
        ) {
          if (!/_/.test(num) && !/_/.test(den) && !/^(?:[xyzabpqruv]|m|n|k)$/i.test(num)) {
            return full;
          }
          if (/^(?:N\/C|V\/m|J\/K|J\/s|m\/s|km\/h|km\/hr|mol\/L|g\/L|kg\/m|rad\/s|W\/m)$/i.test(full)) {
            return full;
          }
        }
      }
      if (src[offset + full.length] === '^') {
        return full;
      }
      return `\\frac{${num}}{${den}}`;
    }
  );

  // Also convert leading stoichiometric/coefficient fractions like `1/2H_2`, `3/2x` inside math
  math = math.replace(
    /(?<![\\A-Za-z0-9_{.])(\d+)\s*\/\s*(\d+)(?=(?:[A-Za-z(]))/g,
    (_m, num: string, den: string) => `\\frac{${num}}{${den}}`
  );

  math = math.replace(/\^\{(-?)\s*(\d+)\s*\/\s*(\d+)\s*\}/g, '^{$1\\frac{$2}{$3}}');

  // Fix accidentally unmatched `{` or `}` inside `\overrightarrow{\mathrm{A}` etc.,
  // ignoring escaped `\{` and `\}` (e.g. `\left\{ ... \right.`)
  let balance = 0;
  for (let idx = 0; idx < math.length; idx++) {
    const ch = math[idx];
    if (ch === '\\') {
      idx++; // skip next escaped char
      continue;
    }
    if (ch === '{') balance++;
    else if (ch === '}') balance--;
  }
  while (balance > 0) {
    math += '}';
    balance--;
  }
  while (balance < 0 && math.endsWith('}') && !math.endsWith('\\}')) {
    math = math.slice(0, -1);
    balance++;
  }

  return math.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Normalizes plain-text segments outside `$...$`.
 */
function normalizePlainSegment(segment: string): string {
  let out = segment;

  const mapOutsideInlineMath = (s: string, fn: (plain: string) => string): string =>
    s
      .split(/(\$[^$\n]+\$)/g)
      .map((chunk) => (chunk.startsWith('$') ? chunk : fn(chunk)))
      .join('');

  // 1. Isotopes / atomic-number prefixes: `_25Mn`, `_26Fe^2+`, `_6C^{12}`, `^24_12Mg`, `^15_7N`
  out = out.replace(
    /(?<![\w\\$])\^(\d+)_(\d+)([A-Z][a-z]?)(?![A-Za-z0-9])/g,
    (_m, mass: string, atomic: string, elem: string) => `$^{${mass}}_{${atomic}}\\mathrm{${elem}}$`
  );
  out = out.replace(
    /(?<![\w\\$])_(?:\{(\d+)\}|(\d+))\s*([A-Z][a-z]?)(?:\^(\{[^}]+\}|[0-9]+[+\-]?|[+\-]))?/g,
    (_m, a1: string | undefined, a2: string | undefined, elem: string, charge?: string) => {
      const atomic = a1 || a2 || '';
      if (charge) {
        const cleanCharge = charge.startsWith('{') ? charge.slice(1, -1) : charge;
        return `$\\mathrm{_{${atomic}}${elem}^{${cleanCharge}}}$`;
      }
      return `$\\mathrm{_{${atomic}}${elem}}$`;
    }
  );
  // 1b. Combinatorics `^18C_r+2`, `^nP_4`, `^nC_7`
  out = mapOutsideInlineMath(out, (plain) =>
    plain.replace(
      /(?<![\w\\$])\^([A-Za-z0-9]+)([CP])_([A-Za-z0-9]+(?:\+\d+)?)(?![\w])/g,
      (_m, n: string, op: string, r: string) => `\${}^{${n}}${op}_{${r}}$`
    )
  );

  // 2. Scientific notation & Unicode sub/superscripts
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(/(\b\d+(?:\.\d+)?\s*[×xX]\s*10\^-\^(\d+))/g, (_m, _all, exp: string) => {
        const coeffMatch = _m.match(/^(\d+(?:\.\d+)?)/);
        return `$${coeffMatch?.[1] || '1'} \\times 10^{-${exp}}$`;
      })
      .replace(/(\b\d+(?:\.\d+)?\s*[×xX]\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, (m) => {
        const converted = replaceUnicodeSubSup(m).replace(/[×xX]/g, '\\times ');
        return `$${converted}$`;
      })
      .replace(/(\b(?:[A-Z][a-z]?[₀₁₂₃₄₅₆₇₈₉]*)+[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]*)/g, (m) => {
        if (!/[₀-₉⁰-⁹⁺⁻]/.test(m)) return m;
        const converted = replaceUnicodeSubSup(m);
        return `$\\mathrm{${converted}}$`;
      })
      .replace(/(\b[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, (m) => {
        const converted = replaceUnicodeSubSup(m);
        return `$${converted}$`;
      })
  );

  // 2b. Electron configurations BEFORE Unit Powers so `1s^22s^22p^6` is never matched as seconds (`s`)
  const ORBITAL_RE_SRC = '(?:[1-7]s(?:\\^[12])?|[1-7]p(?:\\^[1-6])?|[1-7]d(?:\\^(?:10|[1-9]))?|[1-7]f(?:\\^(?:1[0-4]|[1-9]))?)';
  const ELECTRON_CFG_RE = new RegExp(
    `(?:\\[[A-Z][a-z]?\\]\\s*(?:${ORBITAL_RE_SRC}\\s*)+|\\b${ORBITAL_RE_SRC}(?:\\s*${ORBITAL_RE_SRC})+(?![a-zA-Z0-9]))`,
    'g'
  );
  const ORBITAL_TOKEN_RE = new RegExp(ORBITAL_RE_SRC, 'g');
  out = mapOutsideInlineMath(out, (plain) =>
    plain.replace(ELECTRON_CFG_RE, (m) => {
      const prefixM = m.match(/^\s*\[([A-Z][a-z]?)\]/);
      const prefix = prefixM ? `[\\mathrm{${prefixM[1]}}]\\, ` : '';
      const rest = prefixM ? m.slice(prefixM[0].length) : m;
      const orbitals = (rest.match(ORBITAL_TOKEN_RE) || []).map((orb) =>
        orb.replace(/\^(\d+)/, '^{$1}')
      );
      return `$${prefix}${orbitals.join('\\, ')}$`;
    })
  );

  // 2c. Standalone powers of 10 (`10^-30`, `10^3`, `10^-3m`, `6.25 × 10^{18}`) & dimensional formulas (`[ML^3T^-2]`)
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(
        /(?:(\d+(?:\.\d+)?)\s*[×xX*]\s*)?10\s*\^\s*\{?(-?\d+)\}?(m|cm|mm|km|s|kg|g|L|mol|J|N|V|A|Hz)?(?![\w])/g,
        (m, coeff: string | undefined, exp: string, unit?: string, offset?: number, full?: string) => {
          if (!coeff && offset !== undefined && full && /[\w\\$.]/.test(full[offset - 1] || '')) return m;
          const base = coeff ? `${coeff} \\times 10^{${exp}}` : `10^{${exp}}`;
          return unit ? `$${base}\\,\\mathrm{${unit}}$` : `$${base}$`;
        }
      )
      .replace(/\[((?:M(?:\^-?\d+)?|L(?:\^-?\d+)?|T(?:\^-?\d+)?){2,})\]/g, (m, inner: string) => {
        if (!inner.includes('^')) return m;
        return `$[\\mathrm{${inner.replace(/\^(-?\d+)/g, '^{$1}')}}]$`;
      })
  );

  // 2d. Physical/chemical compound & single unit powers BEFORE chemical Rule 4
  // Handles: `mol^2L^-2`, `mol^-2L^-2`, `90kmh^-1`, `5kgm^2`, `10 ms^{-1}`, `atm^2`
  const UNIT_PART_SRC = '(?:mmol|mol|kms|km|cm|mm|dm|nm|pm|kg|mg|ms|hr|min|atm|Pa|Hz|rad|sr|Wb|m|s|g|L|l|K|J|W|N|V|A|C|F|T|H|S|h)';
  const UNIT_SEQ_RE = new RegExp(
    `(?<![A-Za-z_\\\\$^])((?:${UNIT_PART_SRC}(?:\\^(?:\\{-?\\d+\\}|-?\\d+))?(?:\\/(?:${UNIT_PART_SRC}(?:\\^(?:\\{-?\\d+\\}|-?\\d+))?))?)+)(?![A-Za-z0-9_])`,
    'g'
  );
  const UNIT_TOKEN_RE = new RegExp(`(${UNIT_PART_SRC})(\\^(?:\\{-?\\d+\\}|-?\\d+))?(\\/)?`, 'g');
  out = mapOutsideInlineMath(out, (plain) =>
    plain.replace(UNIT_SEQ_RE, (m, _grp, offset: number, src: string) => {
      if (!m.includes('^')) return m;
      const prevChar = offset > 0 ? src[offset - 1] : '';
      const sep = /\d/.test(prevChar) ? ' ' : '';
      const rendered: string[] = [];
      let tm: RegExpExecArray | null;
      UNIT_TOKEN_RE.lastIndex = 0;
      while ((tm = UNIT_TOKEN_RE.exec(m)) !== null) {
        const unit = tm[1];
        const rawExp = tm[2] ? tm[2].slice(1) : '';
        const exp = rawExp ? `^{${rawExp.startsWith('{') ? rawExp.slice(1, -1) : rawExp}}` : '';
        const slash = tm[3] || '';
        rendered.push(`\\mathrm{${unit}}${exp}${slash}`);
      }
      return rendered.length ? `${sep}$${rendered.join('\\,')}$` : m;
    })
  );

  // 4. Raw chemical formulas / ions / alkane general formulas with `_` or `^` outside math mode
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(/\bC_nH_2_n([+-]\d+)\b/g, (_m, tail: string) => `$\\mathrm{C}_{n}\\mathrm{H}_{2n${tail}}$`)
      .replace(/\bC_nH_2_n\b/g, '$\\mathrm{C}_{n}\\mathrm{H}_{2n}$')
      .replace(/\bC_nH_n\b/g, '$\\mathrm{C}_{n}\\mathrm{H}_{n}$')
      .replace(
        /(?<![\w\\$^])(\[[A-Z][A-Za-z0-9()_]+\]\^(?:\{[^}]+\}|[0-9]*[+\-]))/g,
        (m) => {
          const cleaned = m.replace(/_(\d+)/g, '_{$1}').replace(/\^([0-9]*[+\-])/, '^{$1}');
          return `$\\mathrm{${cleaned}}$`;
        }
      )
      .replace(
        /(?<![\w\\$^])(\d*[A-Z][A-Za-z0-9]*(?:_[0-9]+|\^[0-9]*[+\-]|\^\{[0-9]*[+\-]\})+(?:[A-Za-z0-9()_^\-+]*)*)/g,
        (m) => {
          const cleaned = m
            .replace(/_(\d+)/g, '_{$1}')
            .replace(/\^(\d*[+\-]|\d+)/g, '^{$1}');
          return `$\\mathrm{${cleaned}}$`;
        }
      )
      .replace(/(?<![\w\\$^])(\d+)_(2|8|10|16)(?![\w])/g, (_m, num: string, base: string) => `$${num}_{${base}}$`)
      .replace(
        /(?<![\w\\$^])([A-Za-z]_(?:\d+|[A-Za-z]{1,2})(?:[A-Za-z]_(?:\d+|[A-Za-z]{1,2}))*)(?![\w])/g,
        (m) => `$${m.replace(/_(\d+|[A-Za-z]{1,2})/g, '_{$1}')}$`
      )
  );

  // 5. Square root expressions & fractions BEFORE general ASCII fractions
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(
        /(?:ω\s*=\s*)?2π\s*√\s*\(([a-zA-Z0-9+\-*^]+)\s*\/\s*([a-zA-Z0-9+\-*^]+)\)/g,
        '$2\\pi\\sqrt{\\frac{$1}{$2}}$'
      )
      .replace(
        /√\s*\(([a-zA-Z0-9+\-*^]+)\s*\/\s*([a-zA-Z0-9+\-*^]+)\)/g,
        '$\\sqrt{\\frac{$1}{$2}}$'
      )
      .replace(
        /(\d*)\s*√(\d+)\s*\/\s*(\d*)\s*√(\d+)/g,
        (_m, c1: string, r1: string, c2: string, r2: string) => `$\\frac{${c1}\\sqrt{${r1}}}{${c2}\\sqrt{${r2}}}$`
      )
      .replace(
        /(\d*)\s*√(\d+)\s*\/\s*(\d+)/g,
        (_m, c1: string, r1: string, den: string) => `$\\frac{${c1}\\sqrt{${r1}}}{${den}}$`
      )
      .replace(
        /(\d+)\s*\/\s*(\d*)\s*√(\d+)/g,
        (_m, num: string, c2: string, r2: string) => `$\\frac{${num}}{${c2}\\sqrt{${r2}}}$`
      )
      .replace(/(\d+)√(\d+)/g, (_m, c: string, r: string) => `$${c}\\sqrt{${r}}$`)
      .replace(/(?<![A-Za-z0-9\\$])√(\d+)(?![A-Za-z0-9\/])/g, (_m, r: string) => `$\\sqrt{${r}}$`)
  );

  // 6. Coordinate pairs containing fractions like `(-1, -7/10)` or `(0, -10/3)`
  out = mapOutsideInlineMath(out, (plain) =>
    plain.replace(
      /\(\s*(-?\d+(?:\/\d+)?)\s*,\s*(-?\d+(?:\/\d+)?)\s*\)/g,
      (m, x: string, y: string) => {
        if (!x.includes('/') && !y.includes('/')) return m;
        const fmt = (v: string) => {
          const fm = v.match(/^(-?)(\d+)\/(\d+)$/);
          return fm ? `${fm[1]}\\frac{${fm[2]}}{${fm[3]}}` : v;
        };
        return `$(${fmt(x)}, ${fmt(y)})$`;
      }
    )
  );

  // 7. Exponent fractions / powers like `x^-3/4`, `x^-1/2`, `-1/9 e^-9x`
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(
        /(?<![\w\\$])([a-zA-Z])\^(-?\d+)\/(\d+)(?![\w\/])/g,
        (_m, base: string, num: string, den: string) => {
          const sign = num.startsWith('-') ? '-' : '';
          const absNum = num.replace(/^-/, '');
          return `$${base}^{${sign}\\frac{${absNum}}{${den}}}$`;
        }
      )
      .replace(
        /(?<![\w\\$])(-?\d+)\/(\d+)\s*([a-zA-Z]\^[-\w]+)/g,
        (_m, num: string, den: string, tail: string) => {
          const sign = num.startsWith('-') ? '-' : '';
          const absNum = num.replace(/^-/, '');
          const cleanTail = tail.replace(/\^(-\w+|\w+)/g, '^{$1}');
          return `$${sign}\\frac{${absNum}}{${den}}${cleanTail}$`;
        }
      )
  );

  // 8. Math equations / polynomials / trig inverses / fractional powers with `^` or `_` outside math mode
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(/\^{2,}\s*=/g, ' = ')
      // Fix `y^_2_` OCR -> `y^{2}`, `(Time)^-1`, `E=hc\λ`, `4MLf^2`, `μ_s`, `3.9^x-4.3^x+1=0`, and binary/base parens `(75.75)_10` -> `$(75.75)_{10}$`
      .replace(/([A-Za-z])\^_(\d+)_/g, '$1^{$2}')
      .replace(/\(([A-Za-z]+)\)\^\{?(-?\d+)\}?/g, (_m, w: string, e: string) => `$(\\mathrm{${w}})^{${e}}$`)
      .replace(/\bE\s*=\s*hc\\λ/g, '$E = \\frac{hc}{\\lambda}$')
      .replace(/\b([μ])_([a-zA-Z])\b/g, (_m, _sym: string, sub: string) => `$\\mu_{${sub}}$`)
      .replace(/\(([0-9A-Fa-f.]+)\)\s*_\s*(2|8|10|16)(?![0-9A-Za-z])/g, (_m, n: string, b: string) => `$(${n})_{${b}}$`)
      .replace(/\b\d+\.\d+\^[a-zA-Z](?:[+\-\s\d.a-zA-Z^]*)=\s*0\b/g, (m) => `$${m.replace(/\./g, '\\cdot ').replace(/\^([a-zA-Z])/g, '^{$1}')}$`)
      // Fix `(u^2/(2g))` or `2u^2/g` or `π^2/2`
      .replace(/(\d*π\^\d+)\s*\/\s*(\d+)/g, (_m, num: string, den: string) => `$\\frac{${num.replace(/π/g, '\\pi ').replace(/\^(\d+)/g, '^{$1}')}}{${den}}$`)
      .replace(/(\d*[a-zA-Z]\^\d+)\s*\/\s*(?:\(([^()\n]+)\)|(\d*[a-zA-Z]))(?![\w^])/g, (_m, num: string, d1?: string, d2?: string) => `$\\frac{${num.replace(/\^(\d+)/g, '^{$1}')}}{${d1 || d2}}$`)
      // Fix `P^H` / `pK_W=14` / `x^x` / `cosx^2` / `4MLf^2`
      .replace(/\bP\^H\b/g, '$\\mathrm{pH}$')
      .replace(/\b(pK_[WAwa])=(\d+(?:\.\d+)?)\b/g, (_m, lhs: string, rhs: string) => `$${lhs}=${rhs}$`)
      .replace(/(?<![\w\\$])([a-zA-Z])\^([a-zA-Z])(?![\w])/g, (_m, b: string, e: string) => `$${b}^{${e}}$`)
      .replace(/(?<![\w\\$])(\d*[A-Za-z]{2,8})\^(-?\d+)(?![\w])/g, (m, sym: string, exp: string) => {
        if (/^(?:sin|cos|tan|cot|sec|csc|log|ln|mol|dm|cm|mm|ms|kms|kmh|atm)$/i.test(sym)) return m;
        return `$${sym}^{${exp}}$`;
      })
      .replace(/(?<![\w\\$])((?:\([^()\n]+\)\^\d+)|(?:[a-zA-Z]\s*=\s*[a-zA-Z0-9\s]*\[[A-Z][a-z]?\](?:\^\d+|[a-zA-Z0-9^+\-*])*)|(?:[a-zA-Z]{1,3}\([^()\n]+\)\s*=\s*(?:sin|cos|tan|cot|sec|csc|log|ln)\^-?\d+[a-zA-Z]?)|(?:(?:sin|cos|tan|cot|sec|csc)\^?-?\d*[a-zA-Z]\^\d+)|(?:(?:sin|cos|tan|cot|sec|csc)\^-?\d+[a-zA-Z]?)|(?:\d*[a-zA-Zαβγθω]{1,2}(?:_[a-zA-Z0-9]+)?\^\{?-?\d+\}?(?:[+\-\s\dA-Za-zαβγθω()^_=]*))|(?:[a-zA-Zαβγθω](?:_[a-zA-Z0-9]+)?(?:\s*=\s*)[+-]?\s*\d*[a-zA-Zαβγθω]{1,2}(?:_[a-zA-Z0-9]+)?\^\d+[+\-\s\dA-Za-zαβγθω()^_=]*))(?=$|[\s,।?!;]|(?<=[^A-Za-z])(?=[^\x00-\x7F]))/g,
        (m) => {
          if (!m.includes('^') && !m.includes('_')) return m;
          if (/^\s*\d*(?:mol|dm|cm|mm|ms|kms|kmh|atm|m|s|kg|g|L|K|β|α)\^/i.test(m)) return m;
          let cleaned = m
            .trim()
            .replace(/\^(-?\d+)/g, '^{$1}')
            .replace(/\b(sin|cos|tan|cot|sec|csc|log|ln)(?=\^|\s*[a-zA-Z])/g, '\\$1 ')
            .replace(/α/g, '\\alpha ')
            .replace(/β/g, '\\beta ')
            .replace(/γ/g, '\\gamma ')
            .replace(/θ/g, '\\theta ')
            .replace(/ω/g, '\\omega ')
            .replace(/(\d+)\s*\/\s*(\d+)(?=[a-zA-Z])/g, '\\frac{$1}{$2}');
          return `$${cleaned}$`;
        }
      )
      .replace(/(?<![\w\\$])(β|α|γ)\^(-?\d+|[+\-])(?![\w])/g, (_m, sym: string, exp: string) => {
        const tex = sym === 'β' ? '\\beta' : sym === 'α' ? '\\alpha' : '\\gamma';
        return `$${tex}^{${exp}}$`;
      })
  );

  // 9. Standalone numeric / negative fractions (`-1/5`, `7/2`), algebraic coefficient fractions (`1/2n(n+2)`, `1/2PV=RT`), and `3/2xমোট শক্তি`
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(
        /(?<![a-zA-Z0-9_.\/$-])(\d+)\s*\/\s*(\d+)[xX×]\s*(?=[^\x00-\x7F])/g,
        (_m, num: string, den: string) => `$\\frac{${num}}{${den}} \\times$ `
      )
      .replace(
        /(?<![a-zA-Z0-9_.\/$-])(\d+)\s*\/\s*(\d+)\s*([a-zA-Z][a-zA-Z0-9(=+\-*]*)/g,
        (match, num: string, den: string, tail: string) => {
          if (/^(?:bit|bits|byte|bytes|am|pm)$/i.test(tail)) return match;
          return `$\\frac{${num}}{${den}}${tail}$`;
        }
      )
      .replace(
        /(?<![a-zA-Z0-9_.\/$-])(-?)(\d+)\s*\/\s*(\d+)(?![a-zA-Z0-9_.\/$-])/g,
        (match, sign: string, num: string, den: string, offset: number, full: string) => {
          const windowText = full.slice(
            Math.max(0, offset - 18),
            Math.min(full.length, offset + match.length + 18)
          );
          if (isProtectedNonMathSlash(windowText)) return match;
          return `$${sign}\\frac{${num}}{${den}}$`;
        }
      )
  );

  // 10. Remaining scientific notation, degrees, ohms & bare LaTeX macros outside `$...$`
  out = mapOutsideInlineMath(out, (plain) =>
    plain
      .replace(/\\sqrt(\d{2,})(?![0-9])/g, (_m, n: string) => `$\\sqrt{${n}}$`)
      .replace(/\\sqrt\{([^{}]+)\}/g, (_m, n: string) => `$\\sqrt{${n}}$`)
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, a: string, b: string) => `$\\frac{${a}}{${b}}$`)
      .replace(/\\xrightarrow\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, lbl: string) => {
        const cleanLbl = lbl.replace(/\\text\s*\{([^}]*)\}/g, '$1').replace(/\\mathrm\{([^}]*)\}/g, '$1').trim();
        return cleanLbl ? `$\\xrightarrow{\\text{${cleanLbl}}}$` : '$\\to$';
      })
      .replace(/\\(?:rightleftharpoons|leftrightarrow|rightarrow|to|times|div|pm|approx|ne|le|ge)\b/g, (m) => `$${m}$`)
      .replace(
        /\b(\d+(?:\.\d+)?)\s*(km|m|cm|mm)\s*\/\s*(s|hr|h)\^(\d+)\b/g,
        (_m, val: string, u1: string, u2: string, exp: string) => `$${val}\\,${u1}/${u2}^{${exp}}$`
      )
      .replace(/(-?\d+(?:\.\d+)?)\s*\^[o0]\s*([CFR])\b/g, (_m, val: string, unit: string) => `$${val}^\\circ\\mathrm{${unit}}$`)
      .replace(/(-?\d+(?:\.\d+)?)\s*\^[o0](?![A-Za-z0-9])/g, (_m, val: string) => `$${val}^\\circ$`)
      .replace(/(\d+(?:\.\d+)?)\s*\^o\^/gi, (_m, val: string) => `$${val}^\\circ$`)
      .replace(/(?<![A-Za-z0-9\\$])(\d+(?:\.\d+)?)\s*\^0(?=\s+[^\x00-\x7F])/g, (_m, val: string) => `$${val}^\\circ$`)
      .replace(/\b(\d+(?:\.\d+)?)\s*Ω\b/g, (_m, val: string) => `$${val}\\,\\Omega$`)
  );

  return out;
}

/**
 * Ensures non-overlapping single-space separation when inline `$...$` touches
 * surrounding Bengali/Latin/numeric tokens without punctuation.
 */
function normalizeInlineMathSpacing(input: string): string {
  const parts = input.split(/(\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]+?(?<!\\)\$)/g);
  for (let idx = 1; idx < parts.length; idx += 2) {
    const mathTok = parts[idx];
    if (!mathTok.startsWith('$') || mathTok.startsWith('$$')) continue;

    const prev = parts[idx - 1] ?? '';
    if (prev.length > 0) {
      const lastChar = prev[prev.length - 1];
      // Add space after Bengali letters/digits, ASCII letters/digits, or closing punctuation like `,` `;` `:`
      if (/[\u0980-\u09FFA-Za-z0-9,;:?]/.test(lastChar)) {
        parts[idx - 1] = prev + ' ';
      }
    }

    const next = parts[idx + 1] ?? '';
    if (next.length > 0) {
      const firstChar = next[0];
      // Add space before Bengali letters/digits or ASCII letters/digits (skip hyphens `-`, punctuation, closing brackets, quotes)
      if (/[\u0980-\u09FFA-Za-z0-9]/.test(firstChar)) {
        parts[idx + 1] = ' ' + next;
      }
    }
  }
  return parts.join('').replace(/ {2,}/g, ' ');
}

/**
 * Cleans and normalizes all math, chemical formulas, isotopes, subscripts/superscripts,
 * and fractions in a question stem, option, or explanation string so KaTeX renders with 0 errors.
 */
export function cleanMathAndChemicalText(input: string): string {
  if (!input || typeof input !== 'string') return input;

  // Step 1: Repair macros & `[IMAGE: ...]` URLs
  let working = repairDamagedMacros(input);

  // Protect `[IMAGE: ...]` tokens with underscore-free sentinels so math regexes never alter URLs
  const imageTokens: string[] = [];
  working = working.replace(/\[IMAGE:\s*[^\]]+?\]/gi, (m) => {
    const idx = imageTokens.length;
    imageTokens.push(m);
    return `\uE000IMG${idx}\uE001`;
  });

  // Normalize Unicode en-dash/minus/macron & Unicode superscripts immediately after `^` or `_` (e.g. `OH^–`, `mol^–2`, `ms¯^1`, `10ms^-²`)
  working = working
    .replace(/([_^])\s*[–−]/g, '$1-')
    .replace(/¯\s*\^?\s*([⁰¹²³⁴⁵⁶⁷⁸⁹0-9]+)/g, (_m, exp: string) => `^-${replaceUnicodeSubSup(exp).replace(/[^{0-9}]/g, '')}`)
    .replace(/\^(-?)\s*([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, (_m, neg: string, seq: string) => {
      const mapped = [...seq].map((ch) => UNICODE_SUP_MAP[ch] ?? ch).join('');
      return `^{${neg}${mapped}}`;
    });
  // Collapse double-caret exponents like `^{2}^+` or `^2^+` globally before math/plain splitting
  working = working
    .replace(/\^\{([^{}]+)\}\s*\^([+\-0-9]+)/g, '^{$1$2}')
    .replace(/\^([0-9]+)\^([+\-0-9]+)/g, '^{$1$2}')
    // Merge prefixes split directly against `$` like `sp$^3$` -> `$sp^3$`, `4.0$\mu C$` -> `$4.0\,\mu C$`, `5.25ms$^{-2}$` -> `$5.25\,\mathrm{ms}^{-2}$`
    .replace(/\b([A-Za-z]{1,4})\$\s*(\^\{?[0-9+\-]+\}?)\s*\$/g, '$$$1$2$$')
    .replace(/(\b\d+(?:\.\d+)?)\s*([A-Za-z]{1,4})\$\s*(\^\{?-?[0-9+\-]+\}?)\s*\$/g, '$$$1\\,\\mathrm{$2}$3$$')
    .replace(/(\b\d+(?:\.\d+)?)\s*\$\s*(\\mu\s*[A-Za-z]+)\s*\$/g, '$$$1\\,$2$$');

  // Step 2: Split into math (`$$...$$` or `$...$`) vs plain-text chunks
  const mathRegex = /\$\$([\s\S]*?)\$\$|(?<!\\)\$([^$\n]+?)(?<!\\)\$/g;
  const parts: string[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(working)) !== null) {
    if (match.index > lastIdx) {
      parts.push(normalizePlainSegment(working.slice(lastIdx, match.index)));
    }
    const isBlock = match[1] !== undefined;
    const rawInner = isBlock ? match[1] : match[2];
    const cleanInner = normalizeMathInner(rawInner);
    if (cleanInner) {
      parts.push(isBlock ? `$$${cleanInner}$$` : `$${cleanInner}$`);
    }
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < working.length) {
    parts.push(normalizePlainSegment(working.slice(lastIdx)));
  }

  let result = mergeAdjacentInlineMath(parts.join(''));
  result = normalizeInlineMathSpacing(result);

  // Restore protected `[IMAGE: ...]` tokens
  result = result.replace(/\uE000IMG(\d+)\uE001/g, (_m, idxStr: string) => {
    return imageTokens[Number(idxStr)] ?? '';
  });

  return result;
}
