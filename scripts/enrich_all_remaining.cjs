const fs = require('fs');

const more25_26 = {
  31: `**১. মূল সূত্র ও ধারা নির্ণয় (Calculus & Functions):**
প্রদত্ত অপেক্ষক বা ধারার ক্ষেত্রে সীমা (Limit) ও অবকলন নির্ণয়ের জন্য স্ট্যান্ডার্ড লাপ্লাস বা লা হসপিটাল (L'Hôpital's) নিয়ম এবং ত্রিকোণমিতিক রূপান্তর সূত্র ব্যবহার করা হয়:
$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{\\tan x}{x} = 1$$

**২. ধাপে ধাপে সমাধান (Step-by-Step Derivation):**
প্রদত্ত রাশিমালার ক্ষেত্রে চলক প্রতিস্থাপন বা ধারা বিস্তার করে সীমা নির্ণয় করলে ফাংশনটির অবিচ্ছিন্নতা (Continuity) ও সঠিক মান নির্ধারিত হয়।`,

  32: `**১. স্পর্শক ও অভিলম্বের সমীকরণ (Tangents & Normals):**
বক্ররেখার সমীকরণ $y = f(x)$ হলে কোনো নির্দিষ্ট বিন্দু $(x_1, y_1)$-এ অঙ্কিত স্পর্শকের ঢাল (Slope) হলো:
$$m = \\left. \\frac{dy}{dx} \\right|_{(x_1, y_1)}$$

**২. অভিলম্বের ঢাল ও সমীকরণ:**
অভিলম্ব স্পর্শকের উপর লম্ব হওয়ায় অভিলম্বের ঢাল $m' = -\\frac{1}{m}$।
অতএব অভিলম্বের সমীকরণ:
$$y - y_1 = -\\frac{1}{m} (x - x_1)$$
মানগুলো প্রতিস্থাপন করে সরলীকরণ করলে নির্ণেয় সমীকরণটি পাওয়া যায়।`,

  46: `**১. মাইটোসিস ও মায়োসিস কোষ বিভাজন নীতি (Cell Division):**
কোষ বিভাজনের প্রোফেজ-১ উপপর্যায়ের প্যাকাইটিন (Pachytene) দশায় দুটি নন-সিস্টার ক্রোমাটিডের মধ্যে খণ্ডবিনিময় বা ক্রসিং ওভার (Crossing over) ঘটে।

**২. গুরুত্ব ও তাৎপর্য (Biological Significance):**
- ক্রসিং ওভারের ফলে জিনের নতুন রিকম্বিনেশন সৃষ্টি হয়, যা জীবের জিনগত প্রকরণ (Genetic variation) সৃষ্টিতে মুখ্য ভূমিকা পালন করে।
- অপশনগুলোর মধ্যে লেপটোটিনে ক্রোমোজোম ঘনীভূত হতে শুরু করে, জাইগোটিনে সিন্যাপসিস ঘটে (বাইভ্যালেন্ট সৃষ্টি), এবং ডিপ্লোটিনে কায়াজমা স্পষ্ট পরিলক্ষিত হয়।`,

  47: `**১. হরমোন ও শারীরবৃত্তীয় নিয়ন্ত্রণ (Endocrine Regulation):**
ইনসুলিন একটি পেপটাইড হরমোন যা অগ্ন্যাশয়ের আইলেটস অব ল্যাঙ্গারহ্যান্সের বিটা ($\beta$) কোষ থেকে নিঃসৃত হয়।

**২. শারীরবৃত্তীয় ক্রিয়া:**
- রক্তে গ্লুকোজের মাত্রা বেড়ে গেলে ইনসুলিন গ্লাইকোজেনেসিস প্রক্রিয়ায় অতিরিক্ত গ্লুকোজকে যকৃৎ ও পেশিতে গ্লাইকোজেনে রূপান্তর করে রক্তে শর্করার মাত্রা স্বাভাবিক রাখে।
- অপরপক্ষে আলফা ($\alpha$) কোষ থেকে নিঃসৃত গ্লুকাগন বিপরীত কাজটি সম্পন্ন করে (গ্লাইকোজেনোলাইসিস)।`
};

const more24_25 = {
  16: `**১. Subject-Verb Agreement & Tense Rules:**
বাক্যে যখন 'neither... nor' বা 'either... or' ব্যবহৃত হয়, তখন ভার্ব সর্বদা নিকটবর্তী কর্তা (nearest subject) অনুসারে নির্ধারিত হয়।

**২. ব্যাখ্যা ও নিয়ম:**
- যদি নিকটবর্তী কর্তা একবচন (singular) হয়, ভার্বও একবচন হবে।
- যদি নিকটবর্তী কর্তা বহুবচন (plural) হয়, ভার্বও বহুবচন হবে।`,

  17: `**১. Conditional Sentence (3rd Conditional):**
অতীতের কোনো অপূর্ণ বা অবাস্তব সম্ভাবনা নির্দেশ করতে Third Conditional স্ট্রাকচার ব্যবহৃত হয়:
$$\\text{If} + \\text{Past Perfect} (had + V_3), \\quad \\text{Subject} + \\text{would/could/might have} + V_3$$

**২. প্রয়োগ ও সঠিক রূপ:**
শর্তযুক্ত অংশটিতে 'had known' থাকায় প্রধান ক্লজে 'would have arrived' বা 'would have helped' রূপটি ব্যাকরণসম্মত।`,

  46: `**১. দ্রাব্যতা ও দ্রাব্যতা গুণফল নীতি (Solubility & $K_{sp}$):**
স্বল্প দ্রাব্য লবণের ক্ষেত্রে দ্রবণ সম্পৃক্ত হলে আয়নগুলোর ঘনমাত্রার গুণফল আয়নিক গুণফল ($K_{ip}$) দ্রাব্যতা গুণফল ($K_{sp}$)-এর সমান হয়।

**২. অধঃক্ষেপণের শর্ত:**
- যদি $K_{ip} > K_{sp}$ হয়, তবে অতিরিক্ত আয়ন অধঃক্ষিপ্ত হবে।
- যদি $K_{ip} < K_{sp}$ হয়, তবে দ্রবণ অসম্পৃক্ত থাকবে (কোনো অধঃক্ষেপ পড়বে না)।
- যদি $K_{ip} = K_{sp}$ হয়, দ্রবণটি সম্পৃক্ত অবস্থায় থাকবে।`,

  61: `**১. ম্যাট্রিক্সের বিপরীত যোগ্যতা ও নির্ণায়ক (Inverse Matrix Condition):**
কোনো বর্গ ম্যাট্রিক্স $A$-এর বিপরীত ম্যাট্রিক্স $A^{-1}$ থাকার আবশ্যিক শর্ত হলো ম্যাট্রিক্সটিকে অবিকৃত বা নন-সিঙ্গুলার (Non-singular) হতে হবে, অর্থাৎ এর নির্ণায়কের মান শূন্য হতে পারবে না:
$$|A| \\neq 0$$

**২. মান নির্ণয়:**
নির্ণায়ক $|A| = 0$ ধরে চলকের মান বের করলে সেই মানের জন্য ম্যাট্রিক্সের কোনো বিপরীত ম্যাট্রিক্স থাকবে না।`
};

function applyMore(filePath, map) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const q of data) {
    const num = q.question_number || q.number;
    if (map[num]) {
      q.explanation = map[num];
      q.explanation_html = `<div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm space-y-2"><div class="leading-relaxed text-slate-700 dark:text-slate-200">${map[num].replace(/\\n/g, '<br/>')}</div></div>`;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

applyMore('Question/DU/DU_25-26_MCQ.json', more25_26);
applyMore('public/assets/aistudio/DU_25-26_MCQ_bf0372c1.json', more25_26);
applyMore('Question/DU/DU_24-25_MCQ.json', more24_25);
applyMore('public/assets/aistudio/DU_24-25_MCQ_fe25be31.json', more24_25);
console.log("Applied additional explanations!");
