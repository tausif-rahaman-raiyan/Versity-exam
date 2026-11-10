const fs = require('fs');
const cheerio = require('cheerio');

function inspectExam(filePath, name) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  
  console.log('=== ' + name + ' ===');
  const buttons = $('button').length;
  console.log('Total buttons:', buttons);
  
  // Options in chorcha format typically have label 'ক', 'খ', 'গ', 'ঘ'
  const options = [];
  $('button').each((i, el) => {
    const text = $(el).text().trim();
    if (/^[কখগঘ]/.test(text)) {
      const cls = $(el).attr('class') || '';
      const isGreen = cls.includes('017A47') || cls.includes('emerald') || cls.includes('green');
      options.push({ text: text.substring(0, 30), isGreen, cls: cls.substring(0, 40) });
    }
  });
  console.log('Options found:', options.length);
  const greenOpts = options.filter(o => o.isGreen);
  console.log('Green (correct) options found:', greenOpts.length);

  // Look for questions
  const qParagraphs = [];
  $('p').each((i, el) => {
    const t = $(el).text().trim();
    const m = t.match(/^(\d+)\.\s*/);
    if (m) {
      qParagraphs.push({ num: parseInt(m[1]), text: t.substring(0, 50) });
    }
  });
  console.log('--- First 10 buttons ---');
  $('button').slice(0, 10).each((i, el) => {
    console.log(i, $(el).attr('class'), $(el).text().trim().replace(/\s+/g, ' '));
  });

  // Look for any div or span with text "সঠিক উত্তর" or "ব্যাখ্যা" or "Answer" or "Explanation"
  console.log('--- Checking for Answer & Explanation tags ---');
  const answerTexts = [];
  $('*').each((i, el) => {
    const t = $(el).text().trim();
    if (t.includes('সঠিক উত্তর') || t.includes('ব্যাখ্যা:') || t.includes('Explanation:')) {
      if ($(el).children().length === 0) {
        answerTexts.push({ tag: el.tagName, text: t.substring(0, 60) });
      }
    }
  });
  console.log('Found answer/explanation elements:', answerTexts.slice(0, 10));
}

inspectExam('public/assets/aistudio/Paste_November_10__2026_-_3_49PM_7d5c81be', 'DU 25-26');
inspectExam('public/assets/aistudio/Paste_November_10__2026_-_3_49PM_e2ba1b8a', 'DU 24-25');

