import fs from 'fs';
import path from 'path';

const universities = ['DU', 'RU', 'JU'];
let totalFixed = 0;

function fixKaTeXText(text) {
  if (!text || typeof text !== 'string') return text;
  let modified = text;

  // 1. Fix misplaced $ signs inside \mathrm{...} or \text{...}, e.g. \mathrm{CH_{3CONH}$_2$} -> \mathrm{CH_3CONH_2}
  modified = modified.replace(/\\mathrm\{([^}]*)\$([^}]*)\}/g, (match, p1, p2) => {
    return `\\mathrm{${p1}${p2}}`;
  });
  modified = modified.replace(/\\text\{([^}]*)\$([^}]*)\}/g, (match, p1, p2) => {
    return `\\text{${p1}${p2}}`;
  });

  // 2. Fix nested \mathrm{... \mathrm{...} ...}
  modified = modified.replace(/\\mathrm\{([^}]*)\\mathrm\{([^}]*)\}([^}]*)\}/g, (match, a, b, c) => {
    return `\\mathrm{${a}${b}${c}}`;
  });

  // 3. Fix specific broken chemical formulas reported:
  // \mathrm{C_{8H}_18} -> \mathrm{C_8H_{18}}
  modified = modified.replace(/\\mathrm\{C_\{8H\}_18\}/g, '\\mathrm{C_8H_{18}}');
  modified = modified.replace(/C_\{8H\}_18/g, '\\mathrm{C_8H_{18}}');

  // \mathrm{CH_{3CONH}_2} or \mathrm{CH_{3CONH}$_2$} -> \mathrm{CH_3CONH_2}
  modified = modified.replace(/CH_\{3CONH\}_2/g, 'CH_3CONH_2');
  modified = modified.replace(/\\mathrm\{CH_\{3CONH\}_2\}/g, '\\mathrm{CH_3CONH_2}}');

  // \mathrm{CH_{3CH}\mathrm{_{2}N}H_{2}} or similar -> \mathrm{CH_3CH_2NH_2}
  modified = modified.replace(/CH_\{3CH\}[\s\S]*?N[\s\S]*?H_\{2\}/g, 'CH_3CH_2NH_2');

  // 4. Clean up any remaining unclosed or weird $ inside math macros
  // e.g. $\mathrm{...}$ nested or double $
  // Let's ensure well-formed math mode where subscripts are properly braced:
  // e.g. \mathrm{H_2SO_4} instead of \mathrm{H_2SO_4} (already fine, but let's ensure numbers in subscripts have braces if needed, e.g. _2 -> _{2} or handled by KaTeX)

  return modified;
}

function processObject(obj) {
  let changed = false;
  if (typeof obj === 'string') {
    const cleaned = fixKaTeXText(obj);
    if (cleaned !== obj) {
      changed = true;
      totalFixed++;
      return cleaned;
    }
    return obj;
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const res = processObject(obj[i]);
      if (res !== obj[i]) {
        obj[i] = res;
        changed = true;
      }
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const res = processObject(obj[key]);
      if (res !== obj[key]) {
        obj[key] = res;
        changed = true;
      }
    }
  }
  return obj;
}

function auditDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      auditDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        const jsonStrBefore = JSON.stringify(data);
        processObject(data);
        const jsonStrAfter = JSON.stringify(data);
        if (jsonStrBefore !== jsonStrAfter) {
          fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`Fixed KaTeX in: ${path.relative(process.cwd(), fullPath)}`);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

for (const uni of universities) {
  const uniDir = path.join(process.cwd(), 'public', 'data', 'questions', uni);
  console.log(`Fixing KaTeX in university: ${uni} at ${uniDir}`);
  auditDirectory(uniDir);
}

console.log(`KaTeX fix complete. Total files/fields fixed: ${totalFixed}`);
