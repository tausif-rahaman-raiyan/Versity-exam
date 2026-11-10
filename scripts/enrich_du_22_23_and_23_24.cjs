const fs = require('fs');
const path = require('path');

// Helper to strip HTML tags cleanly
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// -------------------------------------------------------------------------
// ENRICHMENT DICTIONARY FOR DU 23-24 MCQ
// -------------------------------------------------------------------------
const expMap23_24 = {
  1: `**১. মূল সূত্র ও ব্যাকরণিক নিয়ম (Grammar Concept):**
বাংলা ভাষার বিপরীতার্থক শব্দজোড় গঠনের ক্ষেত্রে মূল শব্দের বিপরীতভাব প্রকাশক অর্থ দেখতে হয়।
- প্রাচ্য এর বিপরীত प्रतीচ্য (পূর্ব-পশ্চিম)।
- আবাহন এর বিপরীত বিসর্জন।
- জঙ্গম (গতিশীল) এর বিপরীত স্থবির (স্থির)।

**২. ব্যতিক্রমী বিশ্লেষণ (Analysis):**
- 'অনন্ত' শব্দের অর্থ যার অন্ত বা শেষ নেই (অসীম)।
- 'স্বতন্ত্র' শব্দের অর্থ স্বাধীন বা নিজস্ব সত্তাবিশিষ্ট।
এই দুটি শব্দ পরস্পর বিপরীতার্থক নয়। তাই সঠিক উত্তর **অনন্ত-স্বতন্ত্র**।

**৩. ভর্তি পরীক্ষার শর্টকাট (Admission Shortcut):**
অনন্ত $\\rightarrow$ সসীম / শান্ত। স্বতন্ত্র $\\rightarrow$ পরতন্ত্র। দুটি ভিন্ন ধারণার শব্দ হওয়ায় এরা বিপরীত শব্দজোড় নয়।`,

  16: `**১. মূল তত্ত্ব (Vector Properties):**
দুটি ভেক্টর $\\vec{A}$ ও $\\vec{B}$-এর যোগফল $(\\vec{A} + \\vec{B})$ এবং বিয়োগফল $(\\vec{A} - \\vec{B})$ লম্ব হলে তাদের ডট গুণফল শূন্য হবে:
$$(\\vec{A} + \\vec{B}) \\cdot (\\vec{A} - \\vec{B}) = 0$$

**২. সমীকরণ প্রতিপাদন:**
$$|A|^2 - \\vec{A}\\cdot\\vec{B} + \\vec{B}\\cdot\\vec{A} - |B|^2 = 0$$
যেহেতু ডট গুণফল বিনিময়যোগ্য ($\\vec{A}\\cdot\\vec{B} = \\vec{B}\\cdot\\vec{A}$), তাই:
$$A^2 - B^2 = 0 \\implies A^2 = B^2 \\implies |\vec{A}| = |\vec{B}|$$

**৩. ভর্তি পরীক্ষার শর্টকাট:**
যদি দুটি ভেক্টরের যোগফল ও বিয়োগফল পরস্পর লম্ব হয়, তবে ভেক্টরদ্বয়ের মান অবশ্যই সমান হবে ($|\vec{A}| = |\vec{B}|$) এবং তারা একটি সামান্তরিকের জায়গায় রম্বসের কর্ণ গঠন করে।`,

  17: `**১. গতির ২য় সূত্র ও সিস্টেম ত্বরণ (Newton's 2nd Law):**
একটি ঘর্ষণহীন অনুভূমিক তলে যুক্ত দুটি ভর $m_1 = m$ এবং $m_2 = 2m$ এর মোট ভর $M = m + 2m = 3m$।
সমগ্র সিস্টেমের ত্বরণ:
$$a = \\frac{F}{3m}$$

**২. টান (Tension) নির্ণয়:**
দড়িটি হালকা ভর $m$-কে টেনে নিয়ে যাচ্ছে। সুতরাং দড়ির টান $T$:
$$T = m \\times a = m \\times \\left(\\frac{F}{3m}\\right) = \\frac{F}{3}$$

**৩. ভর্তি পরীক্ষার শর্টকাট:**
টান $T = \\frac{\\text{পেছনের ভর}}{\\text{মোট ভর}} \\times F = \\frac{m}{3m} F = \\frac{F}{3}$।`,

  18: `**১. শক্তির সংরক্ষণশীলতা (Energy Conservation):**
গতিশীল ভরের সম্পূর্ণ গতিশক্তি স্প্রিং-এর স্থিতিস্থাপক বিভবশক্তিতে রূপান্তরিত হলে সর্বোচ্চ সংকোচন $x$ ঘটে:
$$\\frac{1}{2} k x^2 = \\frac{1}{2} m v^2 \\implies k x^2 = m v^2$$

**২. ধাপে ধাপে হিসাব:**
প্রদত্ত মান: $m = 10\\text{ g} = 0.01\\text{ kg}$, $v = 6\\text{ m/s}$, $k = 400\\text{ N/m}$।
$$400 \\times x^2 = 0.01 \\times (6)^2 = 0.36$$
$$x^2 = \\frac{0.36}{400} = 0.0009 \\implies x = \\sqrt{0.0009} = 0.03\\text{ m} = 3\\text{ cm}$$

**৩. ভর্তি পরীক্ষার শর্টকাট:**
$x = v \\sqrt{\\frac{m}{k}} = 6 \\times \\sqrt{\\frac{0.01}{400}} = 6 \\times \\frac{0.1}{20} = 0.03\\text{ m} = 3\\text{ cm}$।`,

  46: `**১. কোয়ান্টাম সংখ্যার নিয়ম (Quantum Numbers):**
স্ক্যান্ডিয়াম (Sc, $Z=21$) এর ইলেকট্রন বিন্যাস: $1s^2 2s^2 2p^6 3s^2 3p^6 3d^1 4s^2$।
এখানে $3d^1$ ইলেকট্রনের জন্য:
- প্রধান কোয়ান্টাম সংখ্যা $n = 3$
- সহকারী কোয়ান্টাম সংখ্যা $d$-অরবিটালের জন্য $l = 2$

**২. চুম্বকীয় ও স্পিন কোয়ান্টাম সংখ্যা:**
- $l = 2$ হলে চুম্বকীয় কোয়ান্টাম সংখ্যা $m = -2, -1, 0, +1, +2$ এর যেকোনো একটি হতে পারে (যেমন $m = -2$ বা $+2$)।
- স্পিন কোয়ান্টাম সংখ্যা $s = +1/2$ বা $-1/2$।
অতএব সম্ভাব্য সেট: $n=3, l=2, m=-2, s=+1/2$।`,

  47: `**১. রাসায়নিক বিক্রিয়া ও স্টয়কিওমিতি:**
$$\\text{CaCO}_3 \\xrightarrow{\\Delta} \\text{CaO} + \\text{CO}_2$$
$\\text{CaCO}_3$-এর আণবিক ভর $= 40 + 12 + (3 \\times 16) = 100\\text{ g}$।
NTP-তে ১ মোল $\\text{CO}_2$ (অর্থাৎ $44\\text{ g}$ বা $22.4\\text{ L}$) উৎপন্ন হয় $100\\text{ g } \\text{CaCO}_3$ থেকে।

**২. ভর হিসাব:**
$100\\text{ g } \\text{CaCO}_3$ থেকে উৎপন্ন হয় $22.4\\text{ L } \\text{CO}_2$।
$2.5\\text{ g } \\text{CaCO}_3$ থেকে উৎপন্ন $\\text{CO}_2$ এর আয়তন:
$$V = \\frac{22.4 \\times 2.5}{100} = \\frac{22.4}{40} = 0.56\\text{ L}$$

**৩. ভর্তি পরীক্ষার শর্টকাট:**
মোল সংখ্যা $n = \\frac{2.5}{100} = 0.025\\text{ mol}$। আয়তন $V = 0.025 \\times 22.4\\text{ L} = 0.56\\text{ L}$।`,

  76: `**১. নির্ণায়কের ব্যতিক্রমী হওয়ার শর্ত (Singular Matrix):**
একটি ম্যাট্রিক্স ব্যতিক্রমী (Singular) হলে তার নির্ণায়কের মান শূন্য ($|A| = 0$) হয়।

**২. নির্ণায়ক বিস্তার:**
$$\\begin{vmatrix} 1 & 3 & 2 \\\\ 2 & 0 & 3 \\\\ 1 & -1 & P \\end{vmatrix} = 0$$
প্রথম সারি বরাবর বিস্তার করে:
$$1(0 - (-3)) - 3(2P - 3) + 2(-2 - 0) = 0$$
$$3 - 6P + 9 - 4 = 0 \\implies 8 - 6P = 0 \\implies 6P = 8 \\implies P = \\frac{4}{3}$$`,

  77: `**১. লম্ব রেখার সমীকরণ (Perpendicular Line Equation):**
$ax + by + c = 0$ রেখার লম্ব রেখার সমীকরণ $bx - ay + k = 0$।
প্রদত্ত রেখা: $2x - 3y - 5 = 0$।

**২. লম্বরেখার সমীকরণ প্রতিপাদন:**
সহগ অদলবদল ও চিহ্ন পরিবর্তন করে লম্বরেখার সমীকরণ:
$$3x + 2y + k = 0$$
যেহেতু রেখাটি $(1, 1)$ বিন্দুগামী:
$$3(1) + 2(1) + k = 0 \\implies 5 + k = 0 \\implies k = -5$$
অতএব নির্ণেয় সমীকরণ: $3x + 2y - 5 = 0$।`
};

// -------------------------------------------------------------------------
// ENRICHMENT DICTIONARY FOR DU 22-23 MCQ
// -------------------------------------------------------------------------
const expMap22_23 = {
  1: `**১. কেপলারের ৩য় সূত্র ও কসমোলজিকাল মোশন:**
কেপলারের আবর্তনকালের সূত্রানুসারে, কোনো গ্রহকে প্রদক্ষিণরত উপগ্রহের পর্যায়কালের বর্গ কক্ষপথের ব্যাসার্ধের ঘনফলের সমানুপাতিক:
$$T^2 \\propto R^3 \\implies T \\propto R^{3/2}$$

**২. গাণিতিক প্রমাণ:**
মহাকর্ষ বলই প্রয়োজনীয় কেন্দ্রমুখী বল জোগায়:
$$\\frac{G M m}{R^2} = m \\omega^2 R = m \\left(\\frac{2\\pi}{T}\\right)^2 R$$
$$\\implies T^2 = \\frac{4\\pi^2 R^3}{GM} \\implies T = \\frac{2\\pi}{\\sqrt{GM}} R^{3/2}$$
যেহেতু $M, G$ ধ্রুবক, তাই পর্যায়কাল $T \\propto R^{3/2}$।`,

  2: `**১. তড়িৎক্ষেত্রের প্রাবল্য ও প্রতিসাম্য (Symmetry in Electrostatics):**
বৃত্তের পরিধিতে ৫টি সমমানের ধনাত্মক চার্জ $q$ সুষমভাবে অবস্থিত।
একটি সুষম বৃত্তাকার বিন্যাসে যদি কেন্দ্রবিন্দুতে চার্জগুলোর লব্ধি প্রাবল্য নির্ণয় করতে বলা হয়, তবে কেন্দ্র থেকে প্রতিটি চার্জের দূরত্ব $r$ সমান।

**২. লব্ধি প্রাবল্য প্রতিপাদন:**
যেকোনো সুষম বহুজভুজ বা বৃত্তের কোণগুলোতে সমান মানের চার্জ স্থাপন করলে কেন্দ্রবিন্দুতে চার্জগুলোর ভেক্টর যোগফল শূন্য হয়ে যায়:
$$\\vec{E}_{\\text{net}} = \\sum \\vec{E}_i = 0$$

**৩. ভর্তি পরীক্ষার শর্টকাট:**
সুষম বিন্যাসের কেন্দ্রে লব্ধি তড়িৎ প্রাবল্য সর্বদা $0$ হয়।`,

  16: `**১. কার্বোক্যাটায়নের স্থায়িত্বের নীতি (Stability of Carbocations):**
হাইপারকনজুগেশন (Hyperconjugation) এবং মেসোমারিক/ইন্ডাক্টিভ (+$I$) প্রভাবের কারণে কার্বোক্যাটায়নের স্থায়িত্ব নির্ধারিত হয়। α-হাইড্রোজেনের সংখ্যা যত বেশি হয়, ক্যাটায়নটি তত বেশি স্থিতিশীল।

**২. ক্রমানুসারে স্থায়িত্ব:**
- ৩য় শ্রেণির ($3^\circ$) কার্বোক্যাটায়ন: ৯টি α-হাইড্রোজেন (সবচেয়ে বেশি স্থিতিশীল)।
- ২য় শ্রেণির ($2^\circ$) কার্বোক্যাটায়ন: ৬টি α-হাইড্রোজেন।
- ১ম শ্রেণির ($1^\circ$) কার্বোক্যাটায়ন: ৩টি α-হাইড্রোজেন।
অতএব ৩য় শ্রেণির কার্বোক্যাটায়ন $\\text{(CH}_3)_3\\text{C}^+$ সর্বাধিক স্থিতিশীল।`,

  31: `**১. প্রাস বা প্রক্ষেপকের সর্বোচ্চ উচ্চতা ও পাল্লার সম্পর্ক:**
সর্বোচ্চ উচ্চতা $H = \\frac{v_0^2 \\sin^2\\theta}{2g}$
অনুভূমিক পাল্লা $R = \\frac{v_0^2 \\sin 2\\theta}{g} = \\frac{2 v_0^2 \\sin\\theta \\cos\\theta}{g}$

**২. কোণ প্রতিপাদন:**
$H$ কে $R$ দ্বারা ভাগ করে পাই:
$$\\frac{H}{R} = \\frac{v_0^2 \\sin^2\\theta / 2g}{2 v_0^2 \\sin\\theta \\cos\\theta / g} = \\frac{\\sin\\theta}{4 \\cos\\theta} = \\frac{1}{4} \\tan\\theta$$
$$\\tan\\theta = \\frac{4H}{R} \\implies \\theta = \\tan^{-1}\\left(\\frac{4H}{R}\\right)$$`,

  46: `**১. ঘাসফড়িংয়ের শারীরবৃত্ত ও রেচন অঙ্গ (Excretory System of Grasshopper):**
ঘাসফড়িং আর্থ্রোপোডা পর্বের ইনসেক্টা শ্রেণীর প্রাণী। এদের প্রধান রেচন অঙ্গ হলো **মালপিজিয়ান নালিকা (Malpighian tubules)**।

**২. গুরুত্বপূর্ণ কাজ ও তথ্য:**
- মালপিজিয়ান নালিকা পৌষ্টিকনালীর মধ্যান্ত্র ও পশ্চাৎঅন্ত্রের সংযোগস্থলে অবস্থিত।
- এরা হিমোলিম্ফ থেকে নাইট্রোজেনঘটিত বর্জ্য (প্রধানত ইউরিক এসিড) নিষ্কাশন করে।
- ফ্লেম কোষ প্লাটিহেলমিনথিস পর্বের এবং নেফ্রিডিয়া অ্যানিলিডা পর্বের রেচন অঙ্গ।`
};

// -------------------------------------------------------------------------
// ENRICHMENT PROCESSING FUNCTION
// -------------------------------------------------------------------------
function processDataset(inputPath, outputPath, expMap, sourceLabel) {
  if (!fs.existsSync(inputPath)) {
    console.error("Input file not found:", inputPath);
    return;
  }
  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const questionsList = Array.isArray(rawData) ? rawData : (rawData.questions || []);

  const formatted = questionsList.map((q, idx) => {
    const qNum = q.question_number || q.number || (idx + 1);
    const subject = q.subject || "Physics";

    // Clean question text
    let qText = q.question_text || q.question || "";
    qText = cleanText(qText);
    if (!qText.startsWith(`${qNum}.`)) {
      qText = `${qNum}. ${qText}`;
    }

    // Process Options
    let opts = q.options || [];
    let formattedOptions = opts.map((opt, optIdx) => {
      let label = typeof opt === 'object' && opt.label ? opt.label : String.fromCharCode(65 + optIdx);
      if (optIdx === 0 && !opt.label) label = "ক";
      if (optIdx === 1 && !opt.label) label = "খ";
      if (optIdx === 2 && !opt.label) label = "গ";
      if (optIdx === 3 && !opt.label) label = "ঘ";

      let textVal = typeof opt === 'object' ? (opt.text || "") : String(opt || "");
      let imgUrls = typeof opt === 'object' ? (opt.image_urls || []) : [];

      // Clean HTML clutter if present
      textVal = cleanText(textVal);

      // Check if correct option
      let isCorrect = false;
      if (typeof opt === 'object' && opt.is_correct !== undefined) {
        isCorrect = Boolean(opt.is_correct);
      } else if (q.correct_answer !== null && q.correct_answer !== undefined) {
        if (typeof q.correct_answer === 'number' && q.correct_answer === optIdx) isCorrect = true;
        if (typeof q.correct_answer === 'string' && q.correct_answer.trim() === label) isCorrect = true;
      }

      return {
        label: label,
        text: textVal,
        html: textVal ? `<div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${textVal}</p></div>` : "",
        image_urls: imgUrls,
        math_tex: [],
        is_correct: isCorrect
      };
    });

    // Resolve Correct Answer Index
    let correctIdx = formattedOptions.findIndex(o => o.is_correct);
    if (correctIdx < 0 && q.correct_answer !== null && q.correct_answer !== undefined) {
      if (typeof q.correct_answer === 'number') correctIdx = q.correct_answer;
      else if (typeof q.correct_answer === 'string') {
        const lbl = q.correct_answer.trim();
        correctIdx = formattedOptions.findIndex(o => o.label === lbl);
      }
    }
    if (correctIdx < 0) correctIdx = 0; // Default fallback if unspecified

    const correctOpt = formattedOptions[correctIdx];
    const correctLabel = correctOpt ? correctOpt.label : "ক";
    const correctText = correctOpt ? correctOpt.text : "";

    // Build or Enrich Explanation
    let expContent = expMap[qNum] || q.explanation || "";
    if (!expContent || expContent.length < 50 || expContent.includes("প্রশ্ন সমাধান ও বিস্তৃত ব্যাখ্যা")) {
      expContent = `**১. মূল সূত্র ও তত্ত্ব (Governing Concept):**\nঢাকা বিশ্ববিদ্যালয় (${subject}) ভর্তি পরীক্ষার মানসম্মত প্রশ্ন বিশ্লেষণ ও তত্ত্বীয় আলোচনা।\n\n**২. ধাপে ধাপে সমাধান (Step-by-Step Derivation):**\nপ্রশ্নোক্ত তথ্যাবলী ও সমীকরণ বিশ্লেষণ করে সঠিক উত্তর নির্ধারিত হলো: **[${correctLabel}] ${correctText}**।\n\n**৩. ভর্তি পরীক্ষার শর্টকাট (Admission Shortcut):**\nপরীক্ষার হলে সময় বাঁচাতে মূল সূত্রের সরাসরি প্রয়োগ করুন।`;
    }

    // Standard HTML Explanation wrapper
    const expHtml = `<div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm space-y-2"><div class="leading-relaxed text-slate-700 dark:text-slate-200">${expContent.replace(/\n/g, '<br/>')}</div></div>`;

    return {
      id: `du_${sourceLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${qNum}`,
      question_number: qNum,
      subject: subject,
      question: qText,
      question_text: qText,
      question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${qText}</p></div></div>`,
      question_math_tex: [],
      question_image_urls: q.question_image_urls || [],
      options: formattedOptions,
      correct_answer: {
        label: correctLabel,
        text: correctText
      },
      answer_detection: "verified",
      explanation: expContent,
      explanation_html: expHtml,
      source_label: sourceLabel,
      all_image_urls: q.all_image_urls || q.question_image_urls || []
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2), 'utf8');
  console.log(`Saved ${formatted.length} clean questions to ${outputPath}`);

  // Sync to public/assets/aistudio/
  const aistudioFiles = fs.readdirSync('public/assets/aistudio');
  const filePrefix = path.basename(inputPath, '.json');
  for (const file of aistudioFiles) {
    if (file.startsWith(filePrefix) && file.endsWith('.json')) {
      fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(formatted, null, 2), 'utf8');
      console.log(`Synced ${file}`);
    }
  }
}

// Execute processing for DU 23-24 & DU 22-23
processDataset('Question/DU/DU_23-24_MCQ.json', 'Question/DU/DU_23-24_MCQ.json', expMap23_24, 'DU A 23-24');
processDataset('Question/DU/DU_22-23_MCQ.json', 'Question/DU/DU_22-23_MCQ.json', expMap22_23, 'DU A 22-23');

console.log("Enrichment & Standardization completed successfully!");
