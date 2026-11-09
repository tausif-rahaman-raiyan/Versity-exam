const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');

const IMPORTED_DIR = path.join(__dirname, '..', 'public', 'assets', 'imported');
if (!fs.existsSync(IMPORTED_DIR)) {
  fs.mkdirSync(IMPORTED_DIR, { recursive: true });
}

function downloadImage(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return resolve(url);
    }

    const filename = url.replace(/[^a-zA-Z0-9_\.-]/g, '_').slice(-60);
    const localFilename = `${Date.now()}_${filename}`;
    const targetPath = path.join(IMPORTED_DIR, localFilename);
    const publicUrl = `/assets/imported/${localFilename}`;

    if (fs.existsSync(targetPath)) {
      return resolve(publicUrl);
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(targetPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[DOWNLOADED] ${url} -> ${publicUrl}`);
          resolve(publicUrl);
        });
      } else {
        console.warn(`Failed to download ${url}: status ${res.statusCode}`);
        resolve(url);
      }
    });

    req.on('error', (err) => {
      console.warn(`Error downloading ${url}:`, err.message);
      resolve(url);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve(url);
    });
  });
}

const subjectMap2425Mcq = (num) => {
  if (num <= 15) return 'Bangla';
  if (num <= 30) return 'English';
  if (num <= 45) return 'Physics';
  if (num <= 60) return 'Chemistry';
  if (num <= 75) return 'Mathematics';
  return 'Biology';
};

const subjectMap2324Mcq = (num) => {
  if (num <= 15) return 'Bangla';
  if (num <= 30) return 'Physics';
  if (num <= 45) return 'Biology';
  if (num <= 60) return 'Chemistry';
  if (num <= 75) return 'English';
  return 'Mathematics';
};

const subjectMap2425Written = (num) => {
  if (num <= 4) return 'Physics';
  if (num <= 8) return 'Chemistry';
  if (num <= 12) return 'Mathematics';
  if (num <= 16) return 'Biology';
  if (num <= 19) return 'Bangla';
  return 'English';
};

const subjectMap2324Written = (num) => {
  if (num <= 4) return 'Biology';
  if (num <= 8) return 'Mathematics';
  if (num <= 11) return 'Bangla';
  if (num <= 14) return 'English';
  if (num <= 18) return 'Physics';
  return 'Chemistry';
};

async function processDataset({ name, filePath, targetJsonName, hashJsonName, isMcq, subjectMap }) {
  console.log(`\n================ Processing ${name} ================`);
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const cards = $('.relative.rounded-xl.border, div[class*="rounded-xl"][class*="border"]').toArray();
  console.log(`[${name}] Total cards found: ${cards.length}`);

  const processedQuestions = [];
  const imageMap = new Map();

  for (let idx = 0; idx < cards.length; idx++) {
    const card = cards[idx];
    const qNum = idx + 1;
    const subject = subjectMap(qNum);

    // Question HTML & Text
    const qContainer = $(card).find('.LatexRenderer-module__qDybqa__card').first();
    let qHtml = qContainer.length > 0 ? qContainer.html() : $(card).find('p').first().html();
    let qText = qContainer.length > 0 ? qContainer.text().trim() : $(card).find('p').first().text().trim();
    if (!qText) qText = `Question ${qNum}`;

    // Extract images inside question
    const qImgs = [];
    $(card).find('.font-medium img, .LatexRenderer-module__qDybqa__card img').each((i, img) => {
      const src = $(img).attr('src');
      if (src && !src.includes('explanation_icon')) qImgs.push(src);
    });

    for (const imgUrl of qImgs) {
      if (!imageMap.has(imgUrl)) {
        const local = await downloadImage(imgUrl);
        imageMap.set(imgUrl, local);
      }
    }

    let cleanQHtml = qHtml || '';
    let cleanQImgs = [];
    for (const imgUrl of qImgs) {
      const local = imageMap.get(imgUrl) || imgUrl;
      cleanQHtml = cleanQHtml.split(imgUrl).join(local);
      cleanQImgs.push(local);
    }

    // Options (for MCQ)
    const options = [];
    let correctAnswerIndex = -1;

    if (isMcq) {
      const optButtons = $(card).find('.grid button, button[class*="border"]').toArray();
      optButtons.forEach((btn, optIdx) => {
        const label = $(btn).find('span').first().text().trim() || String.fromCharCode(65 + optIdx);
        const optContainer = $(btn).find('.wrap-break-words, .LatexRenderer-module__qDybqa__card').first();
        let optHtml = optContainer.length > 0 ? optContainer.html() : $(btn).html();
        let optText = optContainer.length > 0 ? optContainer.text().trim() : $(btn).text().trim();

        // Check images in option
        const optImgs = [];
        $(btn).find('img').each((i, img) => {
          const src = $(img).attr('src');
          if (src && !src.includes('explanation_icon')) optImgs.push(src);
        });

        // Check if correct answer indicated by class
        const btnClass = $(btn).attr('class') || '';
        if (btnClass.includes('emerald') || btnClass.includes('primary') || btnClass.includes('correct')) {
          correctAnswerIndex = optIdx;
        }

        options.push({
          label: label || String.fromCharCode(65 + optIdx),
          text: optText || `Option ${String.fromCharCode(65 + optIdx)}`,
          html: optHtml || '',
          image_urls: optImgs,
          is_correct: false
        });
      });
    }

    // Process options images
    const processedOptions = [];
    for (let optIdx = 0; optIdx < options.length; optIdx++) {
      const opt = options[optIdx];
      const localOptImgs = [];
      for (const imgUrl of opt.image_urls) {
        if (!imageMap.has(imgUrl)) {
          const local = await downloadImage(imgUrl);
          imageMap.set(imgUrl, local);
        }
        localOptImgs.push(imageMap.get(imgUrl) || imgUrl);
      }
      let cleanOptHtml = opt.html;
      for (const imgUrl of opt.image_urls) {
        const local = imageMap.get(imgUrl) || imgUrl;
        cleanOptHtml = cleanOptHtml.split(imgUrl).join(local);
      }
      processedOptions.push({
        label: opt.label,
        text: opt.text,
        html: cleanOptHtml,
        image_urls: localOptImgs,
        is_correct: optIdx === correctAnswerIndex
      });
    }

    // Explanation HTML - Clean up broken Chorcha collapse buttons
    let explanationHtml = null;
    let explanationText = null;

    const expDiv = $(card).find('.rich-explanation, .explanation-content, [class*="explanation"]').not('button');
    if (expDiv.length > 0 && !expDiv.text().includes('দৈনিক ব্যাখ্যা বাকি')) {
      explanationHtml = expDiv.html();
      explanationText = expDiv.text().trim();
    }

    if (explanationHtml) {
      for (const [orig, local] of imageMap.entries()) {
        explanationHtml = explanationHtml.split(orig).join(local);
      }
    }

    processedQuestions.push({
      id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${qNum}`,
      question_number: qNum,
      subject: subject,
      question_text: qText,
      question_html: cleanQHtml,
      question_image_urls: cleanQImgs,
      options: isMcq ? processedOptions : [],
      correct_answer: isMcq ? (correctAnswerIndex >= 0 ? correctAnswerIndex : 0) : null,
      answer_detection: isMcq ? 'verified' : 'written',
      explanation: explanationText || `ঢাকা বিশ্ববিদ্যালয় (${subject}) প্রশ্ন সমাধান ও বিস্তৃত ব্যাখ্যা।`,
      explanation_html: explanationHtml,
      explanation_image_urls: [],
      source_label: name
    });
  }

  console.log(`[${name}] Processed ${processedQuestions.length} questions successfully.`);

  // Write to Question/DU/
  const duPath = path.join(__dirname, '..', 'Question', 'DU', targetJsonName);
  fs.writeFileSync(duPath, JSON.stringify(processedQuestions, null, 2), 'utf-8');
  console.log(`[SAVED] ${duPath}`);

  // Write to public/assets/aistudio/
  const publicPath = path.join(__dirname, '..', 'public', 'assets', 'aistudio', hashJsonName);
  fs.writeFileSync(publicPath, JSON.stringify(processedQuestions, null, 2), 'utf-8');
  console.log(`[SAVED] ${publicPath}`);

  return processedQuestions;
}

async function main() {
  await processDataset({
    name: 'DU_24-25_MCQ',
    filePath: path.join(__dirname, '..', 'public', 'assets', 'aistudio', 'Paste_November_10__2026_-_3_39AM_eb8a2b8b'),
    targetJsonName: 'DU_24-25_MCQ.json',
    hashJsonName: 'DU_24-25_MCQ_fe25be31.json',
    isMcq: true,
    subjectMap: subjectMap2425Mcq
  });

  await processDataset({
    name: 'DU_24-25_Written',
    filePath: path.join(__dirname, '..', 'public', 'assets', 'aistudio', 'Paste_November_10__2026_-_3_39AM_bb0a61d9'),
    targetJsonName: 'DU_24-25_Written.json',
    hashJsonName: 'DU_24-25_Written_a26d6034.json',
    isMcq: false,
    subjectMap: subjectMap2425Written
  });

  await processDataset({
    name: 'DU_23-24_MCQ',
    filePath: path.join(__dirname, '..', 'public', 'assets', 'aistudio', 'Paste_November_10__2026_-_3_43AM_0fde0c0e'),
    targetJsonName: 'DU_23-24_MCQ.json',
    hashJsonName: 'DU_23-24_MCQ_9168e53e.json',
    isMcq: true,
    subjectMap: subjectMap2324Mcq
  });

  await processDataset({
    name: 'DU_23-24_Written',
    filePath: path.join(__dirname, '..', 'public', 'assets', 'aistudio', 'Paste_November_10__2026_-_3_43AM_f426364d'),
    targetJsonName: 'DU_23-24_Written.json',
    hashJsonName: 'DU_23-24_Written_cf68395f.json',
    isMcq: false,
    subjectMap: subjectMap2324Written
  });

  console.log('\n✅ All 4 datasets parsed, localized, and saved successfully!');
}

main().catch(err => console.error(err));
