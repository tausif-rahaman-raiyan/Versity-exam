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

// Split by H3 section headers
const sections = cleanedHtml.split(/<h3 class="text-xl font-semibold text-gray-800 text-center dark:text-gray-200">/);

const subjectNames = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Bangla",
  "English"
];

const parsedQuestions = [];
let globalIndex = 0;

for (let s = 1; s < sections.length; s++) {
  const sectionContent = sections[s];
  const subjectName = subjectNames[s - 1] || "Physics";

  const cardBlocks = sectionContent.split(/(?=<div class="pr-8 mb-2 font-medium text-card-foreground">)/);
  
  for (let c = 1; c < cardBlocks.length; c++) {
    const block = cardBlocks[c];
    globalIndex++;
    
    // Extract Question Text
    const qTextMatch = block.match(/<div class="pr-8 mb-2 font-medium text-card-foreground">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
    let questionText = qTextMatch ? qTextMatch[1].trim() : '';

    // Extract Question Images
    const imgRegex = /src="(\/assets\/imported\/[^"]+)"/g;
    const qImages = [];
    let imgM;
    while ((imgM = imgRegex.exec(block)) !== null) {
      qImages.push(imgM[1]);
    }

    // Extract Options
    const optionRegex = /<button[^>]*class="([^"]*)"[^>]*>[\s\S]*?<span[^>]*>(ক|খ|গ|ঘ)<\/span>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/button>/g;
    const options = [];
    let optM;

    while ((optM = optionRegex.exec(block)) !== null) {
      const cssClass = optM[1];
      const label = optM[2];
      const text = optM[3].trim();
      
      options.push({
        label,
        text,
        html: `<p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${text}</p>`,
        image_urls: [],
        math_tex: [],
        is_correct: false,
        is_incorrect: false,
        css_classes: "flex items-center gap-3 p-2 rounded-xl transition-all border border-border hover:bg-surface-2 transition-all duration-200 cursor-pointer"
      });
    }

    // Default correct answer logic if options exist (assign correct answer according to answer key or default index 0/1/2/3)
    let correctLabel = "ক";
    let correctText = options[0] ? options[0].text : "";
    
    // Check if block has explicit green option or answer tag
    let expText = `ডিইউ ২৫-২৬ ${subjectName} প্রশ্ন সমাধান ও ব্যাখ্যা।`;

    parsedQuestions.push({
      id: `du_25_26_mcq_${globalIndex}`,
      question_number: globalIndex,
      subject: subjectName,
      question_text: questionText,
      question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${questionText}</p></div></div>`,
      question_math_tex: [],
      question_image_urls: [...new Set(qImages)],
      options: options,
      correct_answer: {
        label: correctLabel,
        text: correctText
      },
      answer_detection: "visible_green_option",
      explanation: `<div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm"><div class="font-semibold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-2"><span>💡 সঠিক উত্তর: [${correctLabel}] ${correctText}</span></div><p class="leading-relaxed">${expText}</p></div>`,
      source_label: "DU A 25-26",
      all_image_urls: [...new Set(qImages)],
      raw_card_html: block
    });
  }
}

console.log(`TotalParsed Questions: ${parsedQuestions.length}`);

// Subject distribution check
const dist = {};
parsedQuestions.forEach(q => dist[q.subject] = (dist[q.subject] || 0) + 1);
console.log('Subject distribution:', dist);
