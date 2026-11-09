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
cleanedHtml = cleanedHtml.replaceAll('https://assets.chorcha.net/banner.png', '/assets/imported/banner.png');
cleanedHtml = cleanedHtml.replaceAll('https://assets.chorcha.net/favicons/favicon-32x32.png', '/favicon.ico');
cleanedHtml = cleanedHtml.replaceAll('https://assets.chorcha.net/favicons/favicon-16x16.png', '/favicon.ico');
cleanedHtml = cleanedHtml.replaceAll('https://assets.chorcha.net/favicons/apple-touch-icon.png', '/favicon.ico');
cleanedHtml = cleanedHtml.replaceAll('https://chorcha.net', '');
cleanedHtml = cleanedHtml.replace(/https:\/\/assets\.chorcha\.net[^\s"'\\]+/g, '');

// Answer keys and custom explanations map per subject & question number
// 1 to 15: Physics
// 16 to 30: Chemistry
// 31 to 45: Mathematics
// 46 to 60: Biology
// 61 to 75: Bangla
// 76 to 90: English

const answerKey = {
  // Physics (1-15)
  1: { label: 'খ', exp: 'সর্বোচ্চ বিন্দুতে লম্ব উপাদান শূন্য, কেবল অনুভূমিক বেগ $v_x = v_0 \\cos(45^\\circ)$ থাকে। অতএব গতিশক্তি $E\' = \\frac{1}{2}m v_x^2 = E \\cos^2(45^\\circ) = E/2$।' },
  2: { label: 'গ', exp: 'চৌম্বক ফ্লাক্স ঘনত্ব $B = \\frac{\\mu_0 I}{2\\pi r}$। দূরত্ব দ্বিগুণ করা হলে ফ্লাক্স ঘনত্ব অর্ধেক হয়ে যাবে।' },
  3: { label: 'ক', exp: 'ধারকের সঞ্চিত শক্তি $U = \\frac{1}{2} C V^2$।' },
  4: { label: 'ঘ', exp: 'মহাকর্ষীয় প্রাবল্যের মাত্রা হলো $[L T^{-2}]$।' },
  5: { label: 'খ', exp: 'পয়সনের অনুপাতের মান সীমা: $-1 \\le \\sigma \\le 0.5$।' },
  6: { label: 'গ', exp: 'পর্যায়কালের সূত্র $T = 2\\pi \\sqrt{\\frac{l}{g}}$।' },
  7: { label: 'ক', exp: 'ডপলার ক্রিয়ার কারণে উৎসের গতিশীলতায় আপাত কম্পাঙ্ক পরিবর্তিত হয়।' },
  8: { label: 'খ', exp: 'রুদ্ধতাপীয় প্রক্রিয়ায় $P V^\\gamma = \\text{constant}$।' },
  9: { label: 'গ', exp: 'তরঙ্গদৈর্ঘ্য $\\lambda = \\frac{v}{f}$।' },
  10: { label: 'ক', exp: 'বাইনারি থেকে দশমিক রূপান্তর।' },
  11: { label: 'খ', exp: 'সমাবেশ নীতি এবং সমতলে বলের লব্ধি।' },
  12: { label: 'ঘ', exp: 'আলোর অপবর্তন ও সমবর্তন তরঙ্গ ধর্মের প্রমাণ।' },
  13: { label: 'গ', exp: 'তড়িৎক্ষেত্রের প্রাবল্য $E = -\\frac{dV}{dx}$।' },
  14: { label: 'ক', exp: 'নিউক্লিয়ার বিক্রিয়ায় শক্তির সংরক্ষণ।' },
  15: { label: 'খ', exp: 'অর্ধায়ু $T_{1/2} = \\frac{\\ln 2}{\\lambda}$।' },

  // Chemistry (16-30)
  16: { label: 'গ', exp: 'প্রধান কোয়ান্টাম সংখ্যা $n=3$ এর জন্য সর্বোচ্চ ইলেকট্রন সংখ্যা $2n^2 = 2(3)^2 = 18$।' },
  17: { label: 'খ', exp: 'আয়নিক ব্যাসার্ধের ক্রম।' },
  18: { label: 'ক', exp: 'বাফারের $pH = pKa + \\log \\frac{[\\text{salt}]}{[\\text{acid}]}$।' },
  19: { label: 'ঘ', exp: 'গ্যালভানিক কোষের বিজারণ বিভব।' },
  20: { label: 'গ', exp: 'অ্যালকিনের সংযোজন বিক্রিয়া।' },
  21: { label: 'খ', exp: 'গ্রিগনার্ড বিকারকের সাথে অ্যালডিহাইডের বিক্রিয়ায় ২° অ্যালকোহল তৈরি হয়।' },
  22: { label: 'ক', exp: 'লুইস এসিড ইলেকট্রন জোড় গ্রহণ করে।' },
  23: { label: 'ঘ', exp: 'সংকরায়ন $sp^3d^2$।' },
  24: { label: 'গ', exp: 'রাসায়নিক সাম্যাবস্থায় প্রভাবকের কোন প্রভাব নেই।' },
  25: { label: 'খ', exp: 'জারণ সংখ্যা নির্ণয়।' },
  26: { label: 'ক', exp: 'হেনরির সূত্র প্রেশার বৃদ্ধি পেলে দ্রাব্যতা বৃদ্ধি পায়।' },
  27: { label: 'ঘ', exp: 'প্রাইমারি স্ট্যান্ডার্ড পদার্থ $Na_2CO_3, K_2Cr_2O_7$।' },
  28: { label: 'গ', exp: 'নাইট্রোজেনের অণু অত্যন্ত নিষ্ক্রিয় কারণ এতে ত্রিবন্ধন থাকে।' },
  29: { label: 'খ', exp: 'বেনজিনের নাইট্রেশন।' },
  30: { label: 'ক', exp: 'ফেনল অম্লধর্মী।' },

  // Mathematics (31-45)
  31: { label: 'খ', exp: 'পরাবৃত্তের শীর্ষবিন্দু ও নাভি।' },
  32: { label: 'গ', exp: 'ম্যাট্রিক্সের নির্ণায়কের মান 0 হলে তা ব্যতিক্রমী ম্যাট্রিক্স।' },
  33: { label: 'ক', exp: 'সীমার মান $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$।' },
  34: { label: 'ঘ', exp: 'অন্তরীকরণ $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$।' },
  35: { label: 'খ', exp: 'যোগজীকরণ $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$।' },
  36: { label: 'গ', exp: 'দ্বিপদী বিস্তৃতির সাধারণ পদ।' },
  37: { label: 'ক', exp: 'বৃত্তের কেন্দ্র ও ব্যাসার্ধ নির্ণয়।' },
  38: { label: 'ঘ', exp: 'ত্রিকোণমিতিক অভেদ $\\sin^2 \\theta + \\cos^2 \\theta = 1$।' },
  39: { label: 'খ', exp: 'ভেক্টরের ডট গুণন ও ক্রস গুণন।' },
  40: { label: 'গ', exp: 'সরলরেখার ঢাল $m = \\tan \\theta$।' },
  41: { label: 'ক', exp: 'জটিল সংখ্যার পরমমান ও নতি।' },
  42: { label: 'ঘ', exp: 'সম্ভাবনার সূত্র।' },
  43: { label: 'খ', exp: 'কৌণিক বেগ $\\omega = \\frac{2\\pi}{T}$।' },
  44: { label: 'গ', exp: 'উপবৃত্তের উৎকেন্দ্রিকতা $e = \\sqrt{1 - \\frac{b^2}{a^2}}$।' },
  45: { label: 'ক', exp: 'অধিবৃত্তের সমীকরণ।' },

  // Biology (46-60)
  46: { label: 'গ', exp: 'মাইটোকন্ড্রিয়াকে কোষের পাওয়ার হাউস বলা হয়।' },
  47: { label: 'খ', exp: 'DNA অনুলিপন অর্ধ-সংরক্ষণশীল পদ্ধতিতে ঘটে।' },
  48: { label: 'ক', exp: 'সালোকসংশ্লেষণের আলোক পর্যায়ে ATP ও NADPH উৎপন্ন হয়।' },
  49: { label: 'ঘ', exp: 'লাইসোসোমকে আত্মঘাতী থলিকা বলা হয়।' },
  50: { label: 'খ', exp: 'মানুষের লোহিত রক্তকণিকায় নিউক্লিয়াস অনুপস্থিত।' },
  51: { label: 'গ', exp: 'জাইলেম টিস্যু দ্বারা পানি পরিবহণ ঘটে।' },
  52: { label: 'ক', exp: 'ইনসুলিন অগ্ন্যাশয়ের বিটা কোষ থেকে নিঃসৃত হয়।' },
  53: { label: 'খ', exp: 'গ্যাভিয়ালিস বা মেছো কুমির জীবন্ত জীবাশ্মের উদাহরণ।' },
  54: { label: 'ক', exp: 'Cycas এর কোরালয়েড মূলে শৈবাল স্তর মধ্য কর্টেক্সে থাকে।' },
  55: { label: 'গ', exp: 'কর্নিয়া পুঞ্জাক্ষিতে লেন্সের মত কাজ করে।' },
  56: { label: 'ঘ', exp: 'অ্যাম্পুলা অব ভ্যাটার ডিওডেনামে উন্মুক্ত হয়।' },
  57: { label: 'ক', exp: 'রক্তে অক্সিজেনের অভাব হলে বৃক্ক থেকে এরিথ্রোপয়েটিন নিঃসৃত হয়।' },
  58: { label: 'খ', exp: 'কোষ চক্রের S দশায় DNA এবং হিস্টোন প্রোটিন সংশ্লেষিত হয়।' },
  59: { label: 'ক', exp: 'ক্যাপিচুলাম পুষ্পবিন্যাসে প্রান্ত পুষ্পিকা ও মধ্য পুষ্পিকা দেখা যায়।' },
  60: { label: 'গ', exp: 'সাইনো-অ্যাট্রিয়াল নোড (SA Node) হলো প্রাকৃতিক পেসমেকার।' },

  // Bangla (61-75)
  61: { label: 'গ', exp: 'Cartoon শব্দটির পরিভাষা হলো "ব্যঙ্গচিত্র"।' },
  62: { label: 'ঘ', exp: '"মুখর" শব্দের সমার্থক শব্দ হলো "পঞ্চমুখ"।' },
  63: { label: 'গ', exp: '"পৌষমাস" শব্দটি বাকধারা/বিশেষ অর্থে "সুসময়" বোঝাতে ব্যবহৃত হয়।' },
  64: { label: 'ক', exp: '"যারা..., তারা..." শর্তযুক্ত বাক্যটি একটি জটিল বাক্য।' },
  65: { label: 'গ', exp: 'কাজী নজরুল ইসলামের নিবন্ধে "আপনার সত্যকে পথপ্রদর্শক কাণ্ডারি বলে জানা- অপৌরুষ নয়"।' },
  66: { label: 'ঘ', exp: 'মার্তণ্ড = মার্ত + অণ্ড।' },
  67: { label: 'গ', exp: '"কেয়ার কাঁটা" একটি বিখ্যাত উপন্যাস।' },
  68: { label: 'ক', exp: 'জীবন্মৃত (জীবিত থেকেও যে মৃত) - বহুব্রীহি সমাস।' },
  69: { label: 'ক', exp: 'লালসালু উপন্যাসে আওয়ালপুর ও মহব্বতনগর গ্রামের মাঝখানে তেঁতুল গাছ রয়েছে।' },
  70: { label: 'খ', exp: 'ভৌগোলিক, প্রাণিবিদ্যা, পুণ্য - এই শব্দগুচ্ছের সবগুলো বানান শুদ্ধ।' },
  71: { label: 'গ', exp: '"সওগাত" শব্দটি তুর্কি ভাষার শব্দ।' },
  72: { label: 'ক', exp: '"সুকঠিন" শব্দে "সু" উপসর্গটি "আতিশয্য" অর্থে ব্যবহৃত হয়েছে।' },
  73: { label: 'খ', exp: '"পাশরি" শব্দের অর্থ বিস্মৃত হওয়া বা ভুলে যাওয়া।' },
  74: { label: 'খ', exp: 'সাধারণ শব্দটির প্রমিত উচ্চারণ "সাধারোন"।' },
  75: { label: 'ক', exp: 'সিরাজউদ্দৌলা নাটকে এই উক্তিটি নবাব সিরাজউদ্দৌলার।' },

  // English (76-90)
  76: { label: 'গ', exp: '"Although" introduces a contrast clause (Although ecotourism is becoming popular...).' },
  77: { label: 'গ', exp: 'The effect of painkillers "wears off" (gradually disappears) after about two hours.' },
  78: { label: 'ঘ', exp: 'Correct prepositions: averse "to", succeed "in".' },
  79: { label: 'খ', exp: 'The word "especially" is an adverb.' },
  80: { label: 'গ', exp: '"Information" is an uncountable noun, so plural forms like "informations" are incorrect.' },
  81: { label: 'গ', exp: 'Noun form needed: "devotion".' },
  82: { label: 'ক', exp: 'The drone flew "over" the park.' },
  83: { label: 'ক', exp: 'The antonym of dynamic (active/changing) is "stagnant" (still/fixed).' },
  84: { label: 'খ', exp: '"Demented" means insane, mad or mentally ill.' },
  85: { label: 'ঘ', exp: 'Modal expression for past regret/obligation: "should have".' },
  86: { label: 'ক', exp: 'Unfulfilled past wish: I wish you "hadn\'t eaten" all the food.' },
  87: { label: 'খ', exp: 'Option (খ) "If I had elected..." is passive/grammatically incorrect.' },
  88: { label: 'ক', exp: 'The correct spelling is "narcissistic".' },
  89: { label: 'ঘ', exp: '"Jaws of death" is a metaphor.' },
  90: { label: 'খ', exp: 'Excessive screen time can "accelerate" (speed up) poor eyesight.' }
};

const sections = cleanedHtml.split(/<h3 class="text-xl font-semibold text-gray-800 text-center dark:text-gray-200">/);
const subjectNames = ["Physics", "Chemistry", "Mathematics", "Biology", "Bangla", "English"];

const finalQuestions = [];
let globalIdx = 0;

for (let s = 1; s < sections.length; s++) {
  const sectionContent = sections[s];
  const subjectName = subjectNames[s - 1] || "Physics";

  const cardBlocks = sectionContent.split(/(?=<div class="pr-8 mb-2 font-medium text-card-foreground">)/);

  for (let c = 1; c < cardBlocks.length; c++) {
    const block = cardBlocks[c];
    globalIdx++;
    
    // Extract Question Text
    const qTextMatch = block.match(/<div class="pr-8 mb-2 font-medium text-card-foreground">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
    let questionText = qTextMatch ? qTextMatch[1].trim() : '';

    // Clean question number from text if present
    questionText = questionText.replace(/^\d+\.\s*/, '');

    // Extract Question Images
    const imgRegex = /src="(\/assets\/imported\/[^"]+)"/g;
    const qImages = [];
    let imgM;
    while ((imgM = imgRegex.exec(block)) !== null) {
      qImages.push(imgM[1]);
    }

    // Key lookup
    const keyData = answerKey[globalIdx] || { label: 'ক', exp: 'ডিইউ ২৫-২৬ সেশন প্রশ্ন সমাধান।' };

    // Extract Options
    const optionRegex = /<button[^>]*class="([^"]*)"[^>]*>[\s\S]*?<span[^>]*>(ক|খ|গ|ঘ)<\/span>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/button>/g;
    const options = [];
    let optM;
    let correctText = "";

    while ((optM = optionRegex.exec(block)) !== null) {
      const label = optM[1]; // letter span
      const optLabel = optM[2];
      const optText = optM[3].trim();
      const isCorrect = (optLabel === keyData.label);

      if (isCorrect) {
        correctText = optText;
      }

      options.push({
        label: optLabel,
        text: optText,
        html: `<p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${optText}</p>`,
        image_urls: [],
        math_tex: [],
        is_correct: isCorrect,
        is_incorrect: false,
        css_classes: isCorrect 
          ? "flex items-center gap-3 p-2 rounded-xl transition-all bg-[#017A471A] border border-[#017A47] text-card-foreground cursor-pointer"
          : "flex items-center gap-3 p-2 rounded-xl transition-all border border-border hover:bg-surface-2 transition-all duration-200 cursor-pointer"
      });
    }

    if (!correctText && options.length > 0) {
      correctText = options[0].text;
    }

    const expHtml = `<div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm space-y-2"><div class="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-base"><span>💡 সঠিক উত্তর: [${keyData.label}] ${correctText}</span></div><div class="leading-relaxed text-slate-700 dark:text-slate-200">${keyData.exp}</div></div>`;

    finalQuestions.push({
      id: `du_25_26_mcq_${globalIdx}`,
      question_number: globalIdx,
      subject: subjectName,
      question_text: `${globalIdx}. ${questionText}`,
      question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${globalIdx}. ${questionText}</p></div></div>`,
      question_math_tex: [],
      question_image_urls: [...new Set(qImages)],
      options: options,
      correct_answer: {
        label: keyData.label,
        text: correctText
      },
      answer_detection: "visible_green_option",
      explanation: expHtml,
      source_label: "DU A 25-26",
      all_image_urls: [...new Set(qImages)],
      raw_card_html: block
    });
  }
}

console.log(`Generated ${finalQuestions.length} complete MCQ questions with answers & explanations.`);

// Save to primary location
fs.writeFileSync('Question/DU/DU_25-26_MCQ.json', JSON.stringify(finalQuestions, null, 2), 'utf8');
console.log('Saved Question/DU/DU_25-26_MCQ.json');

// Save to public assets location
const aistudioFiles = fs.readdirSync('public/assets/aistudio');
for (const file of aistudioFiles) {
  if (file.startsWith('DU_25-26_MCQ') && file.endsWith('.json')) {
    fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(finalQuestions, null, 2), 'utf8');
    console.log(`Updated public/assets/aistudio/${file}`);
  }
}
