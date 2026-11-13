import fs from 'fs';
import path from 'path';

const universities = ['DU', 'RU', 'JU'];
let totalFixed = 0;

function cleanChemicalText(text) {
  if (!text || typeof text !== 'string') return text;
  let modified = text;

  // 1. Fix isotope/atomic number patterns like _25Mn, _26Fe^2+, _6C^{12}, etc.
  modified = modified.replace(/(?<![\$\w\\])_([0-9]+)([A-Z][a-z]?)(?:\^([0-9+\-]+))?/g, (match, atomic, elem, charge) => {
    if (charge) {
      return `$\\mathrm{_{${atomic}}${elem}^{${charge}}}$`;
    }
    return `$\\mathrm{_{${atomic}}${elem}}$`;
  });

  // 2. Fix \text{...} containing chemical formulas with subscripts/superscripts, e.g. \text{CH_{3CONH}_2} or \text{H_2SO_4} or \text{CH_{3CONH}_2}
  // Specifically handle \text{CH_{3CONH}_2} or similar
  modified = modified.replace(/\\text\{([^}]*)\}/g, (match, inner) => {
    // If inner contains chemical subscript/superscript patterns like _ or ^ or multiple letters with numbers
    if (inner.includes('_') || inner.includes('^') || /[A-Z][a-z]?[0-9]/.test(inner)) {
      let cleaned = inner
        .replace(/_([0-9]+)/g, '_{$1}')
        .replace(/\^([0-9+\-]+)/g, '^{$1}');
      return `$\\mathrm{${cleaned}}$`;
    }
    return match;
  });

  // 3. Fix standalone patterns like _25Mn or _26Fe
  modified = modified.replace(/\b_([0-9]+)([A-Z][a-z]?)\b/g, '$\\mathrm{_{$1}$2}$');

  return modified;
}

function processObject(obj) {
  let changed = false;
  if (typeof obj === 'string') {
    const cleaned = cleanChemicalText(obj);
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
          console.log(`Updated: ${path.relative(process.cwd(), fullPath)}`);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

for (const uni of universities) {
  const uniDir = path.join(process.cwd(), 'public', 'data', 'questions', uni);
  console.log(`Auditing university: ${uni} at ${uniDir}`);
  auditDirectory(uniDir);
}

console.log(`Audit complete. Total fixes applied: ${totalFixed}`);
