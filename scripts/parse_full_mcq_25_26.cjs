const fs = require('fs');
const path = require('path');

const rawHtml = fs.readFileSync('public/assets/aistudio/Paste_November_10__2026_-_3_36AM_3c10e8f9', 'utf8');

const imageMap = {
  'https://assets.chorcha.net/gsaUpMTeZegwDADZzInvU.png': '/assets/imported/du_25_26_mcq_gsaUpMTeZegwDADZzInvU.png',
  'https://assets.chorcha.net/1EvGSH9Dm5eSMuH40T2iE.png': '/assets/imported/du_25_26_mcq_1EvGSH9Dm5eSMuH40T2iE.png',
  'https://assets.chorcha.net/vxkOemvnOGv6sGPcO38hm.png': '/assets/imported/du_25_26_mcq_vxkOemvnOGv6sGPcO38hm.png',
  'https://assets.chorcha.net/y401m_IPhuQfLg11lN-HK.png': '/assets/imported/du_25_26_mcq_y401m_IPhuQfLg11lN-HK.png',
  'https://assets.chorcha.net/T5_qMSF_uFXLAWS2om0Xd.png': '/assets/imported/du_25_26_mcq_T5_qMSF_uFXLAWS2om0Xd.png'
};

let cleanedHtml = rawHtml;
for (const [remote, local] of Object.entries(imageMap)) {
  cleanedHtml = cleanedHtml.replaceAll(remote, local);
}

// Let's inspect question card separators
// Question cards start with `<div class="pr-8 mb-2 font-medium text-card-foreground">` or similar
const cardBlocks = cleanedHtml.split(/(?=<div class="pr-8 mb-2 font-medium text-card-foreground">)/);
console.log('Total card blocks split:', cardBlocks.length);

const parsedQuestions = [];

for (let i = 1; i < cardBlocks.length; i++) {
  const block = cardBlocks[i];
  
  // Question text
  const qTextMatch = block.match(/<div class="pr-8 mb-2 font-medium text-card-foreground">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
  let questionText = qTextMatch ? qTextMatch[1].trim() : '';

  // Extract question number if present
  let qNum = i;
  const numMatch = questionText.match(/^(\d+)\.\s*/);
  if (numMatch) {
    qNum = parseInt(numMatch[1], 10);
  }

  // Extract images in question
  const imgRegex = /src="(\/assets\/imported\/[^"]+)"/g;
  const qImages = [];
  let imgM;
  while ((imgM = imgRegex.exec(block)) !== null) {
    qImages.push(imgM[1]);
  }

  // Extract options (<button class="flex items-center gap-3 ...">... <span ...>ক</span> ... <p ...>text</p>)
  const optionRegex = /<button[^>]*class="([^"]*)"[^>]*>[\s\S]*?<span[^>]*>(ক|খ|গ|ঘ)<\/span>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/button>/g;
  const options = [];
  let optM;
  let correctAnswer = null;

  while ((optM = optionRegex.exec(block)) !== null) {
    const cssClass = optM[1];
    const label = optM[2];
    const text = optM[3].trim();
    const isCorrect = cssClass.includes('bg-[#017A471A]') || cssClass.includes('border-[#017A47]');
    const isIncorrect = cssClass.includes('bg-[#FA0C211A]') || cssClass.includes('border-[#FC6B77]');

    if (isCorrect) {
      correctAnswer = { label, text };
    }

    options.push({
      label,
      text,
      html: `<p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${text}</p>`,
      image_urls: [],
      math_tex: [],
      is_correct: isCorrect,
      is_incorrect: isIncorrect,
      css_classes: cssClass
    });
  }

  // Extract explanation if present
  let explanation = null;
  const expMatch = block.match(/<div class="py-3 space-y-3">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
  if (expMatch && expMatch[1].length > 20) {
    explanation = expMatch[1].trim();
  }

  // Subject assignment based on index
  let subject = "Physics";
  if (qNum >= 1 && qNum <= 15) subject = "Physics";
  else if (qNum >= 16 && qNum <= 30) subject = "Chemistry";
  else if (qNum >= 31 && qNum <= 45) subject = "Mathematics";
  else if (qNum >= 46 && qNum <= 60) subject = "Biology";
  else if (qNum >= 61 && qNum <= 75) subject = "Bangla";
  else if (qNum >= 76 && qNum <= 90) subject = "English";

  parsedQuestions.push({
    id: `du_25_26_mcq_${qNum}`,
    question_number: qNum,
    subject: subject,
    question_text: questionText,
    question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${questionText}</p></div></div>`,
    question_math_tex: [],
    question_image_urls: [...new Set(qImages)],
    options: options,
    correct_answer: correctAnswer,
    answer_detection: "visible_green_option",
    explanation: explanation,
    source_label: "DU A 25-26",
    all_image_urls: [...new Set(qImages)],
    raw_card_html: block
  });
}

console.log(`Successfully parsed ${parsedQuestions.length} questions.`);
if (parsedQuestions.length > 0) {
  console.log('Sample Q1:', JSON.stringify(parsedQuestions[0], null, 2));
}

// Write to files
fs.writeFileSync('Question/DU/DU_25-26_MCQ.json', JSON.stringify(parsedQuestions, null, 2), 'utf8');

// Also check for matching files in public/assets/aistudio/
const aistudioFiles = fs.readdirSync('public/assets/aistudio');
for (const file of aistudioFiles) {
  if (file.startsWith('DU_25-26_MCQ') && file.endsWith('.json')) {
    fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(parsedQuestions, null, 2), 'utf8');
    console.log(`Updated public/assets/aistudio/${file}`);
  }
}
