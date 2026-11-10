const fs = require('fs');
const path = require('path');

function cleanText(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // 1. Fix corrupted \v -> \vec escapes (\x0bec or ec{A})
  s = s.replace(/\x0bec/g, '\\vec')
       .replace(/\\x0bec/g, '\\vec')
       .replace(/ec\{/g, '\\vec{');

  // 2. Fix specific vector math duplications from web scrapers
  s = s.replace(/A→\\mathrm\{\\overrightarrow\{A\}\}A/g, '$\\vec{A}$')
       .replace(/B→\\mathrm\{\\overrightarrow\{B\}\}B/g, '$\\vec{B}$')
       .replace(/\\mathrm\{\\overrightarrow\{A\}\}/g, '$\\vec{A}$')
       .replace(/\\mathrm\{\\overrightarrow\{B\}\}/g, '$\\vec{B}$')
       .replace(/\\overrightarrow\{\\mathrm\{A\}\}/g, '\\vec{A}')
       .replace(/\\overrightarrow\{\\mathrm\{B\}\}/g, '\\vec{B}');

  // 3. Fix vector option duplications
  s = s.replace(/∣A→∣=∣B⃗∣ \|\\overrightarrow\{\\mathrm\{A\}\}\|=\|\\vec\{B\}\| ∣A∣=∣B∣/g, '$\\left|\\vec{A}\\right| = \\left|\\vec{B}\\right|$')
       .replace(/A→·\\vec\{B\}=0 \\overrightarrow\{\\mathrm\{A\}\} \\cdot \\vec\{B\}=0 A·B=0/g, '$\\vec{A} \\cdot \\vec{B} = 0$')
       .replace(/A→×\\vec\{B\}=0 \\overrightarrow\{\\mathrm\{A\}\} \\times \\vec\{B\}=0 A×B=0/g, '$\\vec{A} \\times \\vec{B} = 0$')
       .replace(/A→=−2 B \\overrightarrow\{\\mathrm\{A\}\}=-2 \\mathrm{~B} A=−2 B/g, '$\\vec{A} = -2\\vec{B}$');

  // 4. Clean up isolated A→ or B→
  s = s.replace(/A→/g, '$\\vec{A}$')
       .replace(/B→/g, '$\\vec{B}$');

  // 5. Fix double / triple dollar sign issues
  s = s.replace(/\$\$\$\\vec\{A\}\$\$\$/g, '$\\vec{A}$')
       .replace(/\$\$\\vec\{A\}\$\$/g, '$\\vec{A}$')
       .replace(/\$\$\$\\vec\{B\}\$\$\$/g, '$\\vec{B}$')
       .replace(/\$\$\\vec\{B\}\$\$/g, '$\\vec{B}$');

  // 6. Clean multiple spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function cleanQuestionItem(q, index) {
  const qNum = q.question_number || q.number || (index + 1);

  // Clean raw question prompt and strip leading numbers (e.g., '16. 1. ', '1. ', '16. ')
  let rawQ = q.question_text || q.question || '';
  let cleanQ = cleanText(rawQ);
  cleanQ = cleanQ.replace(/^(\d+[\s.)|।-]+)+/, '').trim();

  q.question = cleanQ;
  q.question_text = cleanQ;

  // Question HTML format without embedded number prefix
  q.question_html = `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${cleanQ}</p></div></div>`;

  // Clean Options
  if (Array.isArray(q.options)) {
    q.options.forEach((opt, optIdx) => {
      if (typeof opt === 'object' && opt !== null) {
        if (opt.text) {
          opt.text = cleanText(opt.text);
        }
        if (opt.text && opt.image_urls && opt.image_urls.length > 0) {
          // If option has dedicated image, keep text empty unless label
          if (/<img/i.test(opt.text) || opt.text.length < 5) {
            opt.text = '';
          }
        }
        if (opt.text) {
          opt.html = `<div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${opt.text}</p></div>`;
        } else {
          opt.html = '';
        }
      }
    });
  }

  // Clean Explanation
  if (q.explanation) {
    let cleanExp = cleanText(q.explanation);
    // Fix any remaining corrupted \vec in explanation
    cleanExp = cleanExp.replace(/\\x0bec/g, '\\vec')
                       .replace(/ec\{/g, '\\vec{')
                       .replace(/\| ec\{/g, '|\\vec{')
                       .replace(/\( ec\{/g, '(\\vec{');
    q.explanation = cleanExp;
    q.explanation_html = `<div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm space-y-2"><div class="leading-relaxed text-slate-700 dark:text-slate-200">${cleanExp.replace(/\n/g, '<br/>')}</div></div>`;
  }

  return q;
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const list = Array.isArray(data) ? data : (data.questions || []);

  const cleanedList = list.map((q, idx) => cleanQuestionItem(q, idx));

  // Save cleaned JSON
  const outputData = Array.isArray(data) ? cleanedList : { ...data, questions: cleanedList };
  fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Cleaned ${cleanedList.length} questions in ${filePath}`);

  // Sync to public/assets/aistudio/
  const filePrefix = path.basename(filePath, '.json');
  if (fs.existsSync('public/assets/aistudio')) {
    const aistudioFiles = fs.readdirSync('public/assets/aistudio');
    for (const file of aistudioFiles) {
      if (file.startsWith(filePrefix) && file.endsWith('.json')) {
        fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(cleanedList, null, 2), 'utf8');
        console.log(`Synced to public/assets/aistudio/${file}`);
      }
    }
  }
}

// Clean all 4 DU MCQ datasets
processFile('Question/DU/DU_25-26_MCQ.json');
processFile('Question/DU/DU_24-25_MCQ.json');
processFile('Question/DU/DU_23-24_MCQ.json');
processFile('Question/DU/DU_22-23_MCQ.json');

console.log('All math glitches, vector notations, and double numbering fixed successfully!');
