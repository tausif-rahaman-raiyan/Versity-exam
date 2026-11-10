const fs = require('fs');
const cheerio = require('cheerio');

function dumpQuestions(filePath, outPath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  const cards = $('.relative.rounded-xl.border, div[class*="rounded-xl"][class*="border"]').toArray();
  const results = [];

  cards.forEach((card, idx) => {
    const qContainer = $(card).find('.LatexRenderer-module__qDybqa__card').first();
    let qText = qContainer.length > 0 ? qContainer.text().trim() : $(card).find('p').first().text().trim();
    
    // Options
    const opts = [];
    $(card).find('button').each((i, btn) => {
      const text = $(btn).text().trim().replace(/\s+/g, ' ');
      if (/^[কখগঘABCD]/.test(text)) {
        opts.push(text);
      }
    });

    // Images
    const imgs = [];
    $(card).find('img').each((i, img) => {
      const src = $(img).attr('src');
      if (src && !src.includes('favicons') && !src.includes('banner')) {
        imgs.push(src);
      }
    });

    results.push({
      index: idx + 1,
      question: qText,
      options: opts,
      images: imgs
    });
  });

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved ${results.length} questions to ${outPath}`);
}

dumpQuestions('public/assets/aistudio/Paste_November_10__2026_-_3_49PM_7d5c81be', 'scripts/raw_du_25_26_mcq.json');
dumpQuestions('public/assets/aistudio/Paste_November_10__2026_-_3_49PM_e2ba1b8a', 'scripts/raw_du_24_25_mcq.json');
