const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. DU 24-25 WRITTEN (22 Questions)
// ============================================================================
const questions24_25 = [
  // ======================== PHYSICS (1 - 4) ========================
  {
    number: 1,
    question_number: 1,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '1. সমান্তরাল ও মসৃণ অনুভূমিক তলে অবস্থিত X ও Y দুটি ব্লক পরস্পরের সাথে একটি হালকা স্প্রিং দ্বারা সংযুক্ত। ব্লক দুটিকে পরস্পরের দিকে চেপে রেখাংশ বরাবর স্প্রিংটিকে স্বাভাবিক অবস্থান থেকে $1.0\\text{ cm}$ সংকুচিত করা হলো এবং স্থির অবস্থা থেকে ছেড়ে দেওয়া হলো। স্প্রিংটি যখন তার স্বাভাবিক দৈর্ঘ্যে পৌঁছায় তখন ব্লক X-এর গতিশক্তি হয় $1.0\\text{ J}$। যদি ব্লক X-এর ভর ব্লক Y-এর ভরের $0.4$ গুণ হয়, তবে স্প্রিং ধ্রুবকের মান নির্ণয় কর।',
    question_html:
      '<p>1. সমান্তরাল ও মসৃণ অনুভূমিক তলে অবস্থিত X ও Y দুটি ব্লক পরস্পরের সাথে একটি হালকা স্প্রিং দ্বারা সংযুক্ত। ব্লক দুটিকে পরস্পরের দিকে চেপে রেখাংশ বরাবর স্প্রিংটিকে স্বাভাবিক অবস্থান থেকে $1.0\\text{ cm}$ সংকুচিত করা হলো এবং স্থির অবস্থা থেকে ছেড়ে দেওয়া হলো। স্প্রিংটি যখন তার স্বাভাবিক দৈর্ঘ্যে পৌঁছায় তখন ব্লক X-এর গতিশক্তি হয় $1.0\\text{ J}$। যদি ব্লক X-এর ভর ব্লক Y-এর ভরের $0.4$ গুণ হয়, তবে স্প্রিং ধ্রুবকের মান নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* স্প্রিংয়ের সংকোচন, $x = 1.0\\text{ cm} = 0.01\\text{ m}$\n* ব্লক X-এর গতিশক্তি, $E_X = 1.0\\text{ J}$\n* ভর সম্পর্ক, $m_X = 0.4\\,m_Y \\Rightarrow \\frac{m_X}{m_Y} = 0.4$\n\nযেহেতু তলটি মসৃণ ও বাহ্যিক কোনো বল ক্রিয়াশীল নেই এবং ব্লক দুটি স্থির অবস্থা থেকে মুক্ত হয়েছে, তাই ভরবেগের সংরক্ষণশীলতা নীতি অনুসারে যেকোনো মুহূর্তে ব্লক দুটির রৈখিক ভরবেগের মান সমান ও বিপরীতমুখী হবে:\n$$p_X = p_Y = p$$\n\nগতিশক্তি ও ভরবেগের সম্পর্ক $E_k = \\frac{p^2}{2m}$ হতে পাই:\n$$\\frac{E_Y}{E_X} = \\frac{m_X}{m_Y} = 0.4$$\n$$\\Rightarrow E_Y = 0.4 \\times E_X = 0.4 \\times 1.0\\text{ J} = 0.4\\text{ J}$$\n\nসুতরাং স্বাভাবিক দৈর্ঘ্যে পৌঁছানোর মুহূর্তে ব্লক দুটির মোট গতিশক্তি:\n$$E_{\\text{total}} = E_X + E_Y = 1.0 + 0.4 = 1.4\\text{ J}$$\n\nযান্ত্রিক শক্তির নিত্যতা সূত্রানুসারে, সংকুচিত স্প্রিংয়ের সঞ্চিত বিভব শক্তি = ব্লক দুটির মোট গতিশক্তি:\n$$\\frac{1}{2}kx^2 = E_{\\text{total}}$$\n$$\\Rightarrow k = \\frac{2E_{\\text{total}}}{x^2} = \\frac{2 \\times 1.4}{(0.01)^2} = \\frac{2.8}{10^{-4}} = 2.8 \\times 10^4\\text{ N/m}$$\n\n**উত্তর:** স্প্রিং ধ্রুবকের মান $2.8 \\times 10^4\\text{ N/m}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 2,
    question_number: 2,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '2. একটি গ্যাস মিশ্রণে $n_1$ মোল এক-পারমাণবিক গ্যাস এবং $n_2$ মোল দ্বি-পারমাণবিক গ্যাস আছে। যদি মিশ্রণটির ক্ষেত্রে $\\frac{c_p}{c_v} = \\frac{3}{2}$ হয়, তবে $n_1$ ও $n_2$-এর মধ্যে সম্পর্ক নির্ণয় কর। ($c_p$ এবং $c_v$ যথাক্রমে স্থির চাপে ও স্থির আয়তনে মোলার আপেক্ষিক তাপ নির্দেশ করে।)',
    question_html:
      '<p>2. একটি গ্যাস মিশ্রণে $n_1$ মোল এক-পারমাণবিক গ্যাস এবং $n_2$ মোল দ্বি-পারমাণবিক গ্যাস আছে। যদি মিশ্রণটির ক্ষেত্রে $\\frac{c_p}{c_v} = \\frac{3}{2}$ হয়, তবে $n_1$ ও $n_2$-এর মধ্যে সম্পর্ক নির্ণয় কর। ($c_p$ এবং $c_v$ যথাক্রমে স্থির চাপে ও স্থির আয়তনে মোলার আপেক্ষিক তাপ নির্দেশ করে।)</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nআমরা জানি,\n* এক-পারমাণবিক গ্যাসের ক্ষেত্রে ($f_1 = 3$):\n  $$C_{v_1} = \\frac{3}{2}R, \\quad C_{p_1} = \\frac{5}{2}R$$\n* দ্বি-পারমাণবিক গ্যাসের ক্ষেত্রে ($f_2 = 5$):\n  $$C_{v_2} = \\frac{5}{2}R, \\quad C_{p_2} = \\frac{7}{2}R$$\n\nগ্যাস মিশ্রণের ক্ষেত্রে তুল্য $C_v$ এবং $C_p$:\n$$C_{v(\\text{mix})} = \\frac{n_1 C_{v_1} + n_2 C_{v_2}}{n_1 + n_2} = \\frac{n_1 \\left(\\frac{3}{2}R\\right) + n_2 \\left(\\frac{5}{2}R\\right)}{n_1 + n_2}$$\n$$C_{p(\\text{mix})} = \\frac{n_1 C_{p_1} + n_2 C_{p_2}}{n_1 + n_2} = \\frac{n_1 \\left(\\frac{5}{2}R\\right) + n_2 \\left(\\frac{7}{2}R\\right)}{n_1 + n_2}$$\n\nপ্রশ্নমতে, মিশ্রণটির জন্য $\\gamma_{\\text{mix}} = \\frac{C_{p(\\text{mix})}}{C_{v(\\text{mix})}} = \\frac{3}{2}$:\n$$\\frac{5n_1 + 7n_2}{3n_1 + 5n_2} = \\frac{3}{2}$$\n$$\\Rightarrow 2(5n_1 + 7n_2) = 3(3n_1 + 5n_2)$$\n$$\\Rightarrow 10n_1 + 14n_2 = 9n_1 + 15n_2$$\n$$\\Rightarrow n_1 = n_2$$\n\n**উত্তর:** নির্ণেয় সম্পর্ক $n_1 = n_2$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 3,
    question_number: 3,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '3. ![বর্তনী চিত্র](/assets/imported/du_24_25_written_1745c5c26ff5a242.png)\nকার্শফের সূত্র ব্যবহার করে প্রদত্ত বর্তনীটির প্রতিটি শাখায় বিদ্যুৎ প্রবাহের মান নির্ণয় কর।',
    question_html:
      '<p>3. <img src="/assets/imported/du_24_25_written_1745c5c26ff5a242.png" alt="বর্তনী চিত্র" /> কার্শফের সূত্র ব্যবহার করে প্রদত্ত বর্তনীটির প্রতিটি শাখায় বিদ্যুৎ প্রবাহের মান নির্ণয় কর।</p>',
    question_image_urls: ['/assets/imported/du_24_25_written_1745c5c26ff5a242.png'],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত বর্তনীতে:\n* বাম শাখায় তড়িচ্চালক শক্তি $E_1 = 4\\text{ V}$ এবং রোধ $R_1 = 2\\,\\Omega$\n* ডান শাখায় তড়িচ্চালক শক্তি $E_2 = 6\\text{ V}$ এবং রোধ $R_2 = 2\\,\\Omega$\n* মাঝের শাখায় রোধ $R_3 = 4\\,\\Omega$\n\nধরি, বাম শাখার $4\\text{ V}$ কোষ হতে উর্ধ্বমুখী তড়িৎ প্রবাহ $I_1$ এবং ডান শাখার $6\\text{ V}$ কোষ হতে উর্ধ্বমুখী তড়িৎ প্রবাহ $I_2$ উৎপন্ন হয়ে উপরের সংযোগ বিন্দুতে মিলিত হয় এবং মাঝের $4\\,\\Omega$ রোধের মধ্য দিয়ে নিম্নমুখী তড়িৎ প্রবাহ $I_3$ প্রবাহিত হয়।\n\n**১ম ধাপ (কার্শফের ১ম সূত্র বা KCL):**\nউপরের সংযোগ বিন্দুতে KCL প্রয়োগ করে পাই:\n$$I_3 = I_1 + I_2 \\quad \\text{--- (i)}$$\n\n**২য় ধাপ (কার্শফের ২য় সূত্র বা KVL):**\nবাম বদ্ধ লুপে ঘড়ির কাঁটার দিকে KVL প্রয়োগ করে পাই:\n$$2I_1 + 4I_3 = 4$$\n$$\\Rightarrow 2I_1 + 4(I_1 + I_2) = 4$$\n$$\\Rightarrow 6I_1 + 4I_2 = 4 \\Rightarrow 3I_1 + 2I_2 = 2 \\quad \\text{--- (ii)}$$\n\nডান বদ্ধ লুপে ঘড়ির কাঁটার বিপরীত দিকে KVL প্রয়োগ করে পাই:\n$$2I_2 + 4I_3 = 6$$\n$$\\Rightarrow 2I_2 + 4(I_1 + I_2) = 6$$\n$$\\Rightarrow 4I_1 + 6I_2 = 6 \\Rightarrow 2I_1 + 3I_2 = 3 \\quad \\text{--- (iii)}$$\n\n**৩য় ধাপ (সমীকরণ সমাধান):**\n$\\text{(ii)} \\times 3 - \\text{(iii)} \\times 2$ করে পাই:\n$$(9I_1 + 6I_2) - (4I_1 + 6I_2) = 6 - 6$$\n$$\\Rightarrow 5I_1 = 0 \\Rightarrow I_1 = 0\\text{ A}$$\n\n$I_1 = 0$ মানটি (iii) নং সমীকরণে বসিয়ে পাই:\n$$3I_2 = 3 \\Rightarrow I_2 = 1\\text{ A}$$\n\nএবং (i) নং সমীকরণ হতে মাঝের শাখার প্রবাহ:\n$$I_3 = I_1 + I_2 = 0 + 1 = 1\\text{ A}$$\n\n**উত্তর:** বাম শাখায় ($4\\text{ V}, 2\\,\\Omega$) প্রবাহ $I_1 = 0\\text{ A}$, ডান শাখায় ($6\\text{ V}, 2\\,\\Omega$) প্রবাহ $I_2 = 1\\text{ A}$ এবং মাঝের শাখায় ($4\\,\\Omega$) প্রবাহ $I_3 = 1\\text{ A}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 4,
    question_number: 4,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '4. একটি ধাতব পৃষ্ঠকে $310\\text{ nm}$ তরঙ্গদৈর্ঘ্যের একবর্ণী আলো দ্বারা আলোকিত করা হলে নির্গত ফটোইলেকট্রনের সর্বোচ্চ গতিশক্তি হয় $4 \\times 10^{-19}\\text{ J}$। ধাতুটির সূচন তরঙ্গদৈর্ঘ্য নির্ণয় কর। (দেওয়া আছে, $hc = 1240\\text{ eV}\\cdot\\text{nm}$)',
    question_html:
      '<p>4. একটি ধাতব পৃষ্ঠকে $310\\text{ nm}$ তরঙ্গদৈর্ঘ্যের একবর্ণী আলো দ্বারা আলোকিত করা হলে নির্গত ফটোইলেকট্রনের সর্বোচ্চ গতিশক্তি হয় $4 \\times 10^{-19}\\text{ J}$। ধাতুটির সূচন তরঙ্গদৈর্ঘ্য নির্ণয় কর। (দেওয়া আছে, $hc = 1240\\text{ eV}\\cdot\\text{nm}$)</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* আপতিত আলোর তরঙ্গদৈর্ঘ্য, $\\lambda = 310\\text{ nm}$\n* $hc = 1240\\text{ eV}\\cdot\\text{nm}$\n* সর্বোচ্চ গতিশক্তি, $K_{\\max} = 4 \\times 10^{-19}\\text{ J} = \\frac{4 \\times 10^{-19}}{1.6 \\times 10^{-19}}\\text{ eV} = 2.5\\text{ eV}$\n\nআপতিত ফোটনের শক্তি:\n$$E = \\frac{hc}{\\lambda} = \\frac{1240\\text{ eV}\\cdot\\text{nm}}{310\\text{ nm}} = 4.0\\text{ eV}$$\n\nআইনস্টাইনের আলোক-তড়িৎ সমীকরণ অনুসারে, কার্যপেক্ষক $\\phi_0$:\n$$E = \\phi_0 + K_{\\max}$$\n$$\\Rightarrow \\phi_0 = E - K_{\\max} = 4.0 - 2.5 = 1.5\\text{ eV}$$\n\nআবার, $\\phi_0 = \\frac{hc}{\\lambda_0}$ হতে সূচন তরঙ্গদৈর্ঘ্য $\\lambda_0$:\n$$\\lambda_0 = \\frac{hc}{\\phi_0} = \\frac{1240\\text{ eV}\\cdot\\text{nm}}{1.5\\text{ eV}} = 826.67\\text{ nm}$$\n\n**উত্তর:** ধাতুটির সূচন তরঙ্গদৈর্ঘ্য $826.67\\text{ nm}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== CHEMISTRY (5 - 8) ========================
  {
    number: 5,
    question_number: 5,
    subject: 'রসায়ন (Chemistry)',
    question:
      '1. নিচের বিক্রিয়ার স্কিমে X, Y ও Z বিকারক/বিক্রিয়ার শর্ত এবং উৎপাদ P ও Q চিহ্নিত কর:\n$\\text{CH}_3\\text{OH} \\xrightarrow{x} \\text{CH}_3\\text{Cl} \\xrightarrow{y} \\text{CH}_3\\text{CN} \\xrightarrow{z} \\text{CH}_3\\text{CH}_2\\text{NH}_2 \\xrightarrow{\\text{HNO}_2} \\text{P} + \\text{Q} + \\text{H}_2\\text{O}$',
    question_html:
      '<p>1. নিচের বিক্রিয়ার স্কিমে X, Y ও Z বিকারক/বিক্রিয়ার শর্ত এবং উৎপাদ P ও Q চিহ্নিত কর:<br>$\\text{CH}_3\\text{OH} \\xrightarrow{x} \\text{CH}_3\\text{Cl} \\xrightarrow{y} \\text{CH}_3\\text{CN} \\xrightarrow{z} \\text{CH}_3\\text{CH}_2\\text{NH}_2 \\xrightarrow{\\text{HNO}_2} \\text{P} + \\text{Q} + \\text{H}_2\\text{O}$</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত বিক্রিয়া ক্রমটি সম্পূর্ণ করে পাই:\n\n$$\\text{CH}_3\\text{OH} \\xrightarrow{\\text{PCl}_5 \\text{ বা } \\text{SOCl}_2 \\text{ (X)}} \\text{CH}_3\\text{Cl} \\xrightarrow{\\text{alc. KCN (Y)}} \\text{CH}_3\\text{CN} \\xrightarrow{\\text{LiAlH}_4 \\text{ বা } \\text{Na/C}_2\\text{H}_5\\text{OH (Z)}} \\text{CH}_3\\text{CH}_2\\text{NH}_2 \\xrightarrow{\\text{HNO}_2} \\text{CH}_3\\text{CH}_2\\text{OH (P)} + \\text{N}_2 \\text{ (Q)} + \\text{H}_2\\text{O}$$\n\nসুতরাং,\n* **X (বিকারক):** $\\text{PCl}_5$ বা $\\text{SOCl}_2$ বা গাঢ় $\\text{HCl} + \\text{অনাদ্র ZnCl}_2$\n* **Y (বিকারক):** অ্যালকোহলীয় $\\text{KCN}$ বা $\\text{NaCN(alc)}$\n* **Z (বিকারক):** $\\text{LiAlH}_4$ (শুষ্ক ইথার) অথবা $\\text{Na} + \\text{C}_2\\text{H}_5\\text{OH}$ (মেনডিয়াস বিজারণ) অথবা $\\text{H}_2/\\text{Ni}$\n* **P (উৎপাদ):** $\\text{CH}_3\\text{CH}_2\\text{OH}$ (ইথানল)\n* **Q (উৎপাদ):** $\\text{N}_2$ (নাইট্রোজেন গ্যাস)',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 6,
    question_number: 6,
    subject: 'রসায়ন (Chemistry)',
    question:
      '2.1. সাম্যাবস্থায় $2\\text{SO}_2(g) + \\text{O}_2(g) \\rightleftharpoons 2\\text{SO}_3(g)$ বিক্রিয়াটির সাম্যধ্রুবক $K_c$ এর সমীকরণ লেখ। যদি সাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হয়, তবে সাম্যাবস্থা কোন দিকে অগ্রসর হবে গাণিতিকভাবে ব্যাখ্যা কর।\n2.2. পানির DO এর সংজ্ঞা দাও। বিশ্ব স্বাস্থ্য সংস্থার মতে পানিতে BOD ও COD এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা কত?',
    question_html:
      '<div><p>2.1. সাম্যাবস্থায় $2\\text{SO}_2(g) + \\text{O}_2(g) \\rightleftharpoons 2\\text{SO}_3(g)$ বিক্রিয়াটির সাম্যধ্রুবক $K_c$ এর সমীকরণ লেখ। যদি সাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হয়, তবে সাম্যাবস্থা কোন দিকে অগ্রসর হবে গাণিতিকভাবে ব্যাখ্যা কর।</p><p>2.2. পানির DO এর সংজ্ঞা দাও। বিশ্ব স্বাস্থ্য সংস্থার মতে পানিতে BOD ও COD এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা কত?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ২.১ সমাধান ও ব্যাখ্যা:\nবিক্রিয়াটির সাম্যধ্রুবক, $K_c = \\frac{[\\text{SO}_3]^2}{[\\text{SO}_2]^2[\\text{O}_2]}$\n\nসাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হলে বিক্রিয়া কোশেন্ট,\n$$Q_c = \\frac{(2 \\times [\\text{SO}_3])^2}{[\\text{SO}_2]^2(2 \\times [\\text{O}_2])} = \\frac{4 \\times [\\text{SO}_3]^2}{2 \\times [\\text{SO}_2]^2[\\text{O}_2]} = 2 \\times \\frac{[\\text{SO}_3]^2}{[\\text{SO}_2]^2[\\text{O}_2]} = 2K_c$$\n\nএখানে, $Q_c > K_c$ হওয়ায় সাম্যাবস্থা বামদিকে অর্থাৎ পশ্চাৎমুখী অগ্রসর হবে।\n\n---\n### ২.২ সমাধান ও ব্যাখ্যা:\n**DO (Dissolved Oxygen):** নির্দিষ্ট তাপমাত্রায় পানিতে দ্রবীভূত অক্সিজেনের পরিমাণকে DO (Dissolved Oxygen) বলে। এটি সাধারণত ppm বা mg/L এককে প্রকাশ করা হয়।\n\n* বিশ্ব স্বাস্থ্য সংস্থার (WHO) মতে পানিতে **BOD** এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা: **$6.0\\text{ ppm}$ (বা $6\\text{ mg/L}$)**\n* বিশ্ব স্বাস্থ্য সংস্থার (WHO) মতে পানিতে **COD** এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা: **$10.0\\text{ ppm}$ (বা $10\\text{ mg/L}$)**',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 7,
    question_number: 7,
    subject: 'রসায়ন (Chemistry)',
    question:
      '3.1. স্ফুটনাঙ্কের সংজ্ঞা দাও। হাইড্রোজেন ফ্লোরাইডের স্ফুটনাঙ্ক হাইড্রোজেন ক্লোরাইড অপেক্ষা বেশি কেন?\n3.2. একটি দুর্বল এসিড ও সবল ক্ষারের প্রশমন তাপের মান কেন $-57.3\\text{ kJ mol}^{-1}$ অপেক্ষা কম ঋণাত্মক হয়?',
    question_html:
      '<div><p>3.1. স্ফুটনাঙ্কের সংজ্ঞা দাও। হাইড্রোজেন ফ্লোরাইডের স্ফুটনাঙ্ক হাইড্রোজেন ক্লোরাইড অপেক্ষা বেশি কেন?</p><p>3.2. একটি দুর্বল এসিড ও সবল ক্ষারের প্রশমন তাপের মান কেন $-57.3\\text{ kJ mol}^{-1}$ অপেক্ষা কম ঋণাত্মক হয়?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ৩.১ সমাধান ও ব্যাখ্যা:\nস্থির চাপে যে নির্দিষ্ট তাপমাত্রায় কোনো তরল পদার্থের বাষ্পচাপ বায়ুমণ্ডলীয় চাপের সমান হয় এবং তরলটি বুদবুদসহ ফুটতে শুরু করে বাষ্পে পরিণত হয়, সেই তাপমাত্রাকে ঐ তরলের স্ফুটনাঙ্ক বলে।\n\nহাইড্রোজেন ফ্লোরাইড (HF) অণুতে অধিক তড়িৎ ঋণাত্মক ফ্লোরিন পরমাণু থাকায় HF অণুসমূহ পরস্পরের সাথে শক্তিশালী আন্তঃআণবিক হাইড্রোজেন বন্ধন গঠন করে সংযোজিত অবস্থায় $(\\text{HF})_n$ থাকে। অন্যদিকে HCl অণুতে ক্লোরিন পরমাণুর আকার বড় ও তড়িৎ ঋণাত্মকতা কম হওয়ায় এতে কোনো হাইড্রোজেন বন্ধন গঠিত হয় না, কেবল দুর্বল ভ্যানডার ওয়ালস বল কাজ করে। HF এর হাইড্রোজেন বন্ধন ভাঙতে অতিরিক্ত তাপশক্তির প্রয়োজন হয়, তাই HF এর স্ফুটনাঙ্ক ($19.5^\\circ\\text{C}$) HCl এর স্ফুটনাঙ্ক ($-85^\\circ\\text{C}$) এর চেয়ে বেশি।\n![HF অণুতে হাইড্রোজেন বন্ধন](/assets/imported/du_24_25_written_ce4869ae02a0947f.png)\n\n---\n### ৩.২ সমাধান ও ব্যাখ্যা:\nসবল এসিড ও সবল ক্ষার জলীয় দ্রবণে সম্পূর্ণরূপে আয়নিত থাকে, তাই এদের প্রশমন বিক্রিয়ায় $1\\text{ mol H}^+$ ও $1\\text{ mol OH}^-$ যুক্ত হয়ে $1\\text{ mol H}_2\\text{O}$ উৎপন্ন হওয়ার ফলে নির্দিষ্ট পরিমাণ তাপ ($-57.3\\text{ kJ mol}^{-1}$) নির্গত হয়।\n\nকিন্তু দুর্বল এসিড (যেমন $\\text{CH}_3\\text{COOH}$) জলীয় দ্রবণে আংশিক আয়নিত থাকে। প্রশমন চলাকালে দুর্বল এসিডকে সম্পূর্ণরূপে বিয়োজিত (আয়নিত) করতে উৎপন্ন তাপের কিছু অংশ শোষিত বা ব্যয়িত হয়। ফলে নিট নির্গত তাপের পরিমাণ হ্রাস পায় এবং প্রশমন তাপের মান $-57.3\\text{ kJ mol}^{-1}$ অপেক্ষা কম ঋণাত্মক (যেমন প্রায় $-55.2\\text{ kJ mol}^{-1}$) হয়।',
    explanation_html: null,
    explanation_image_urls: ['/assets/imported/du_24_25_written_ce4869ae02a0947f.png'],
  },
  {
    number: 8,
    question_number: 8,
    subject: 'রসায়ন (Chemistry)',
    question:
      '4.1. $\\text{CCl}_4, \\text{NaCl}$ এবং $\\text{SiCl}_4$ এর মধ্যে কোন যৌগটি পানিতে আর্দ্রবিশ্লেষিত হয় না এবং কেন?\n4.2. জলীয় কপার সালফেট দ্রবণে অতিরিক্ত জলীয় অ্যামোনিয়া ধীরে ধীরে যোগ করলে কী ঘটে বিক্রিয়াসহ লেখ।',
    question_html:
      '<div><p>4.1. $\\text{CCl}_4, \\text{NaCl}$ এবং $\\text{SiCl}_4$ এর মধ্যে কোন যৌগটি পানিতে আর্দ্রবিশ্লেষিত হয় না এবং কেন?</p><p>4.2. জলীয় কপার সালফেট দ্রবণে অতিরিক্ত জলীয় অ্যামোনিয়া ধীরে ধীরে যোগ করলে কী ঘটে বিক্রিয়াসহ লেখ।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ৪.১ সমাধান ও ব্যাখ্যা:\nপ্রদত্ত যৌগগুলোর মধ্যে **$\\text{CCl}_4$ (কার্বন টেট্রাক্লোরাইড)** এবং **$\\text{NaCl}$** পানিতে আর্দ্রবিশ্লেষিত হয় না (বিশেষত সমযোজী হ্যালাইড হিসেবে $\\text{CCl}_4$ আর্দ্রবিশ্লেষিত হয় না এবং $\\text{NaCl}$ পানিতে কেবল দ্রবীভূত/আয়নিত হয়, আর্দ্রবিশ্লেষিত হয় না)।\n\n* **$\\text{CCl}_4$ আর্দ্রবিশ্লেষিত না হওয়ার কারণ:** কার্বন ২য় পর্যায়ের মৌল হওয়ায় এর যোজ্যতা স্তরে কোনো ফাঁকা $d$-অরবিটাল নেই। ফলে পানির অক্সিজেন পরমাণু তার নিঃসঙ্গ ইলেকট্রন যুগল কার্বন পরমাণুতে দান করে সন্নিবেশ বন্ধন গঠন করতে পারে না এবং আকারে ছোট কার্বন পরমাণু চারটি বড় ক্লোরিন পরমাণু দ্বারা পরিবেষ্টিত থাকায় স্টেরিক বাধাও বেশি। তাই $\\text{CCl}_4$ পানিতে আর্দ্রবিশ্লেষিত হয় না। (অন্যদিকে $\\text{SiCl}_4$-এ ফাঁকা $3d$ অরবিটাল থাকায় তা সহজেই আর্দ্রবিশ্লেষিত হয়।)\n\n---\n### ৪.২ সমাধান ও ব্যাখ্যা:\nজলীয় কপার সালফেট ($\\text{CuSO}_4$) দ্রবণে প্রথমে অল্প পরিমাণ জলীয় অ্যামোনিয়া ($\\text{NH}_4\\text{OH}$) যোগ করলে ক্ষারকীয় কপার সালফেটের হালকা নীল বর্ণের অধঃক্ষেপ পড়ে:\n$$2\\text{CuSO}_4 + 2\\text{NH}_4\\text{OH} \\rightarrow \\text{CuSO}_4\\cdot\\text{Cu(OH)}_2\\downarrow \\text{ (হালকা নীল অধঃক্ষেপ)} + (\\text{NH}_4)_2\\text{SO}_4$$\n\nএরপর এতে অতিরিক্ত জলীয় অ্যামোনিয়া ধীরে ধীরে যোগ করলে হালকা নীল অধঃক্ষেপটি দ্রবীভূত হয়ে **টেট্রাঅ্যাম্মিন কপার(II) সালফেট** নামক জটিল যৌগের গাঢ় নীল বর্ণের স্বচ্ছ দ্রবণ উৎপন্ন করে:\n$$\\text{CuSO}_4\\cdot\\text{Cu(OH)}_2 + (\\text{NH}_4)_2\\text{SO}_4 + 6\\text{NH}_4\\text{OH} \\rightarrow 2[\\text{Cu(NH}_3)_4]\\text{SO}_4 \\text{ (গাঢ় নীল দ্রবণ)} + 8\\text{H}_2\\text{O}$$\n*(সংক্ষেপে: $\\text{CuSO}_4 + 4\\text{NH}_3 \\rightarrow [\\text{Cu(NH}_3)_4]\\text{SO}_4$)*',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== MATHEMATICS (9 - 12) ========================
  {
    number: 9,
    question_number: 9,
    subject: 'গণিত (Mathematics)',
    question: '1. যদি $z$ একটি জটিল সংখ্যা হয়, তবে সমাধান কর: $|z + 1| = z + 2(1 + i)$',
    question_html: '<p>1. যদি $z$ একটি জটিল সংখ্যা হয়, তবে সমাধান কর: $|z + 1| = z + 2(1 + i)$</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, $z = x + iy$, যেখানে $x, y \\in \\mathbb{R}$।\nপ্রদত্ত সমীকরণ:\n$$|z + 1| = z + 2(1 + i)$$\n$$\\Rightarrow |(x + 1) + iy| = (x + iy) + 2 + 2i$$\n$$\\Rightarrow \\sqrt{(x + 1)^2 + y^2} = (x + 2) + i(y + 2)$$\n\nউভয় পক্ষ হতে বাস্তব ও কাল্পনিক অংশ সমীকৃত করে পাই:\n* কাল্পনিক অংশ: $y + 2 = 0 \\Rightarrow y = -2$\n* বাস্তব অংশ: $\\sqrt{(x + 1)^2 + y^2} = x + 2$, যেখানে $x + 2 \\ge 0$\n\n$y = -2$ বসিয়ে বর্গ করে পাই:\n$$(x + 1)^2 + (-2)^2 = (x + 2)^2$$\n$$\\Rightarrow x^2 + 2x + 1 + 4 = x^2 + 4x + 4$$\n$$\\Rightarrow 2x + 5 = 4x + 4$$\n$$\\Rightarrow 2x = 1 \\Rightarrow x = \\frac{1}{2}$$\n\nএখানে $x + 2 = \\frac{1}{2} + 2 = \\frac{5}{2} > 0$, যা শর্ত সিদ্ধ করে।\n\n**উত্তর:** নির্ণেয় সমাধান $z = \\frac{1}{2} - 2i$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 10,
    question_number: 10,
    subject: 'গণিত (Mathematics)',
    question:
      '2. দেখাও যে, $x^2 + y^2 - 4x + 6y + 8 = 0$ এবং $x^2 + y^2 - 10x - 6y + 14 = 0$ বৃত্ত দুইটি পরস্পরকে স্পর্শ করে এবং স্পর্শ বিন্দুটির স্থানাঙ্ক নির্ণয় কর।',
    question_html:
      '<p>2. দেখাও যে, $x^2 + y^2 - 4x + 6y + 8 = 0$ এবং $x^2 + y^2 - 10x - 6y + 14 = 0$ বৃত্ত দুইটি পরস্পরকে স্পর্শ করে এবং স্পর্শ বিন্দুটির স্থানাঙ্ক নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n১ম বৃত্তের সমীকরণ: $x^2 + y^2 - 4x + 6y + 8 = 0$\n* কেন্দ্র $C_1(2, -3)$\n* ব্যাসার্ধ $r_1 = \\sqrt{2^2 + (-3)^2 - 8} = \\sqrt{4 + 9 - 8} = \\sqrt{5}$\n\n২য় বৃত্তের সমীকরণ: $x^2 + y^2 - 10x - 6y + 14 = 0$\n* কেন্দ্র $C_2(5, 3)$\n* ব্যাসার্ধ $r_2 = \\sqrt{5^2 + 3^2 - 14} = \\sqrt{25 + 9 - 14} = \\sqrt{20} = 2\\sqrt{5}$\n\nকেন্দ্রদ্বয়ের মধ্যবর্তী দূরত্ব:\n$$C_1C_2 = \\sqrt{(5 - 2)^2 + (3 - (-3))^2} = \\sqrt{3^2 + 6^2} = \\sqrt{9 + 36} = \\sqrt{45} = 3\\sqrt{5}$$\nএবং ব্যাসার্ধদ্বয়ের যোগফল:\n$$r_1 + r_2 = \\sqrt{5} + 2\\sqrt{5} = 3\\sqrt{5}$$\n\nযেহেতু $C_1C_2 = r_1 + r_2$, সুতরাং বৃত্ত দুইটি পরস্পরকে **বহিঃস্থভাবে স্পর্শ করে** (দেখানো হলো)।\n\n**স্পর্শ বিন্দুর স্থানাঙ্ক:**\nস্পর্শ বিন্দুটি $C_1(2, -3)$ ও $C_2(5, 3)$ সংযোজক রেখাংশকে $r_1 : r_2 = \\sqrt{5} : 2\\sqrt{5} = 1 : 2$ অনুপাতে অন্তর্বিভক্ত করে:\n$$x = \\frac{1 \\times 5 + 2 \\times 2}{1 + 2} = \\frac{9}{3} = 3$$\n$$y = \\frac{1 \\times 3 + 2 \\times (-3)}{1 + 2} = \\frac{-3}{3} = -1$$\n\n**উত্তর:** স্পর্শ বিন্দুটির স্থানাঙ্ক $(3, -1)$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 11,
    question_number: 11,
    subject: 'গণিত (Mathematics)',
    question: '3. $x = 1, y = x - 2$ এবং $y^2 = x$ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল নির্ণয় কর।',
    question_html: '<p>3. $x = 1, y = x - 2$ এবং $y^2 = x$ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত রেখা ও বক্ররেখা:\n* $y^2 = x$ পরাবৃত্ত এবং $y = x - 2 \\Rightarrow x = y + 2$ সরলরেখার ছেদবিন্দু:\n  $$y^2 = y + 2 \\Rightarrow y^2 - y - 2 = 0 \\Rightarrow (y - 2)(y + 1) = 0$$\n  $$\\therefore y = -1, 2 \\Rightarrow \\text{ছেদবিন্দু } (1, -1) \\text{ ও } (4, 2)$$\n* আবার $x = 1$ রেখাটি $y = x - 2$ রেখাকে $(1, -1)$ বিন্দুতে এবং $y^2 = x$ পরাবৃত্তকে $(1, -1)$ ও $(1, 1)$ বিন্দুতে ছেদ করে।\n\nসুতরাং $x = 1$ হতে $x = 4$ পর্যন্ত উপরে পরাবৃত্তের ধনাত্মক শাখা $y = \\sqrt{x}$ এবং নিচে সরলরেখা $y = x - 2$ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল:\n$$\\text{ক্ষেত্রফল, } A = \\int_{1}^{4} \\left(\\sqrt{x} - (x - 2)\\right) dx$$\n$$= \\left[ \\frac{2}{3}x^{3/2} - \\frac{x^2}{2} + 2x \\right]_{1}^{4}$$\n$$= \\left( \\frac{2}{3}(8) - \\frac{16}{2} + 8 \\right) - \\left( \\frac{2}{3}(1) - \\frac{1}{2} + 2 \\right)$$\n$$= \\frac{16}{3} - \\left( \\frac{2}{3} + \\frac{3}{2} \\right) = \\frac{14}{3} - \\frac{3}{2} = \\frac{28 - 9}{6} = \\frac{19}{6}\\text{ বর্গ একক}$$\n\n*(নোট: যদি প্রথম চতুর্ভাগের বাইরে বাম অংশ অর্থাৎ $x = 0$ হতে $x = 1$ পর্যন্ত $y^2 = x$ ও $x = 1$ দ্বারা আবদ্ধ ক্ষেত্র ধরা হয় তবে তার ক্ষেত্রফল $\\frac{4}{3}$ বর্গ একক এবং সম্পূর্ণ একত্রিত ক্ষেত্রফল $\\frac{19}{6} + \\frac{4}{3} = \\frac{9}{2}$ বর্গ একক।)*\n\n**উত্তর:** নির্ণেয় আবদ্ধ ক্ষেত্রের ক্ষেত্রফল $\\frac{19}{6}$ বর্গ একক (বা $\\frac{9}{2}$ বর্গ একক)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 12,
    question_number: 12,
    subject: 'গণিত (Mathematics)',
    question:
      '4. একটি টাওয়ারের চূড়া হতে অবাধে পড়ন্ত একটি বস্তু তার পতনের শেষ সেকেন্ডে টাওয়ারের উচ্চতার $\\frac{4}{9}$ অংশ অতিক্রম করে। টাওয়ারটির উচ্চতা নির্ণয় কর।',
    question_html:
      '<p>4. একটি টাওয়ারের চূড়া হতে অবাধে পড়ন্ত একটি বস্তু তার পতনের শেষ সেকেন্ডে টাওয়ারের উচ্চতার $\\frac{4}{9}$ অংশ অতিক্রম করে। টাওয়ারটির উচ্চতা নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, টাওয়ারটির উচ্চতা $H$ এবং বস্তুটি মোট $n$ সেকেন্ডে ভূমিতে পতিত হয়।\nস্থির অবস্থা ($u = 0$) হতে অবাধে পড়ন্ত বস্তুর:\n* $n$ সেকেন্ডে অতিক্রান্ত মোট দূরত্ব, $H = \\frac{1}{2}gn^2 \\quad \\text{--- (i)}$\n* $n$-তম (শেষ) সেকেন্ডে অতিক্রান্ত দূরত্ব, $h_n = \\frac{1}{2}g(2n - 1) \\quad \\text{--- (ii)}$\n\nপ্রশ্নমতে, $h_n = \\frac{4}{9}H$:\n$$\\frac{1}{2}g(2n - 1) = \\frac{4}{9} \\times \\frac{1}{2}gn^2$$\n$$\\Rightarrow 9(2n - 1) = 4n^2$$\n$$\\Rightarrow 4n^2 - 18n + 9 = 0$$\n$$\\Rightarrow (2n - 9)(2n - 1) = 0$$\n$$\\therefore n = \\frac{9}{2}\\text{ s} = 4.5\\text{ s} \\quad \\left(\\because n = \\frac{1}{2}\\text{ s গ্রহণযোগ্য নয় কারণ মোট সময় } n > 1\\text{ s}\\right)$$\n\nসুতরাং টাওয়ারটির উচ্চতা:\n$$H = \\frac{1}{2}gn^2 = \\frac{1}{2} \\times 9.8 \\times \\left(\\frac{9}{2}\\right)^2 = 4.9 \\times \\frac{81}{4} = \\frac{396.9}{4} = 99.225\\text{ m}$$\n*(অথবা $g$ এর মাধ্যমে $\\frac{81}{8}g$ একক)*\n\n**উত্তর:** টাওয়ারটির উচ্চতা $99.225\\text{ m}$ (বা $\\frac{81}{8}g$)।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BIOLOGY (13 - 16) ========================
  {
    number: 13,
    question_number: 13,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '1. স্থায়ী টিস্যুর পাঁচটি বৈশিষ্ট্য লেখ।',
    question_html: '<p>1. স্থায়ী টিস্যুর পাঁচটি বৈশিষ্ট্য লেখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**স্থায়ী টিস্যুর পাঁচটি বৈশিষ্ট্য নিচে দেওয়া হলো:**\n১. স্থায়ী টিস্যুর কোষগুলো সাধারণত বিভাজনে অক্ষম।\n২. এ টিস্যুতে সজীব ও মৃত উভয় প্রকার কোষই থাকে।\n৩. কোষগুলোর প্রাচীর অপেক্ষাকৃত স্থূল (পুরু) এবং কোষে বড় কেন্দ্রীয় কোষগহ্বর (Vacuole) থাকে।\n৪. কোষগুলোতে সাইটোপ্লাজম কম থাকে এবং নিউক্লিয়াস আকারে ছোট ও কোষের একপাশে অবস্থান করে (মৃত কোষে প্রোটোপ্লাজম থাকে না)।\n৫. কোষগুলোর মধ্যে সাধারণত আন্তঃকোষীয় ফাঁক (Intercellular space) উপস্থিত থাকে এবং কোষপ্রাচীরে নানা নকশা বা কূপ দেখা যায়।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 14,
    question_number: 14,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '2. $\\text{C}_4$ উদ্ভিদের পাঁচটি বৈশিষ্ট্য লেখ।',
    question_html: '<p>2. $\\text{C}_4$ উদ্ভিদের পাঁচটি বৈশিষ্ট্য লেখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**$\\text{C}_4$ উদ্ভিদের পাঁচটি বৈশিষ্ট্য নিচে দেওয়া হলো:**\n১. $\\text{C}_4$ উদ্ভিদের পাতায় **ক্রাঞ্জ অ্যানাটমি (Kranz anatomy)** উপস্থিত থাকে, অর্থাৎ ভাস্কুলার বান্ডলকে ঘিরে অরীয়ভাবে সজ্জিত বান্ডলশিথ কোষস্তর ও তার বাইরে মেসোফিল কোষস্তর থাকে।\n২. এদের পাতায় ক্লোরোপ্লাস্ট **দ্বিরূপী (Dimorphic)**—মেসোফিল কোষে গ্রানাযুক্ত ক্লোরোপ্লাস্ট এবং বান্ডলশিথ কোষে গ্রানাবিহীন বড় ক্লোরোপ্লাস্ট থাকে।\n৩. এদের প্রথম স্থায়ী পদার্থ ৪-কার্বনবিশিষ্ট **অক্সালো অ্যাসিটিক অ্যাসিড (OAA)** এবং $\\text{CO}_2$ গ্রাহক হলো ফসফোইনল পাইরুভেট (PEP)।\n৪. উচ্চ তাপমাত্রা ($30^\\circ\\text{C} - 45^\\circ\\text{C}$) এবং তীব্র আলোতেও এরা অত্যন্ত দক্ষতার সাথে সালোকসংশ্লেষণ করতে পারে।\n৫. এদের পাতায় আলোক-শ্বসন (Photorespiration) প্রায় ঘটেই না বা অত্যন্ত নগণ্য, ফলে কার্বন বিজারণের হার বেশি।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 15,
    question_number: 15,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '3. পরিফেরা ও একাইনোডার্মাটা পর্বের প্রাণীদের দুটি করে শনাক্তকারী বৈশিষ্ট্য এবং একটি করে উদাহরণ লেখ।',
    question_html:
      '<p>3. পরিফেরা ও একাইনোডার্মাটা পর্বের প্রাণীদের দুটি করে শনাক্তকারী বৈশিষ্ট্য এবং একটি করে উদাহরণ লেখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**পরিফেরা (Porifera) পর্ব:**\n* **শনাক্তকারী বৈশিষ্ট্য:**\n  ১. দেহপ্রাচীরে অসংখ্য ক্ষুদ্র ছিদ্র বা **অস্টিয়া (Ostia)** এবং দেহের শীর্ষে বড় ছিদ্র **অসকুলাম (Osculum)** থাকে।\n  ২. দেহে বৈশিষ্ট্যপূর্ণ নালী-তন্ত্র (Canal system) এবং ফ্ল্যাজেলাযুক্ত **কোয়ানোসাইট (Choanocyte)** কোষ থাকে।\n* **উদাহরণ:** *Scypha gelatinosum* (সাইফা) বা *Spongilla locustris* (মিঠাপানির স্পঞ্জ)।\n\n**একাইনোডার্মাটা (Echinodermata) পর্ব:**\n* **শনাক্তকারী বৈশিষ্ট্য:**\n  ১. পূর্ণাঙ্গ প্রাণীরা **পঞ্চঅরীয় প্রতিসম (Pentamerous radially symmetrical)** এবং দেহত্বক কাঁটাময় চুননির্মিত অসিকলযুক্ত।\n  ২. দেহে অনন্য **পানি সংবহনতন্ত্র (Water vascular system)** এবং চলন অঙ্গ হিসেবে **নালিকা পদ (Tube feet)** থাকে।\n* **উদাহরণ:** *Asterias vulgaris* (সমুদ্র তারা / Starfish)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 16,
    question_number: 16,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '4. মানবদেহে খাদ্য পরিপাকে সহায়তাকারী পাঁচটি হরমোনের প্রধান কাজ লেখ।',
    question_html: '<p>4. মানবদেহে খাদ্য পরিপাকে সহায়তাকারী পাঁচটি হরমোনের প্রধান কাজ লেখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**মানবদেহে খাদ্য পরিপাকে সহায়তাকারী পাঁচটি হরমোনের প্রধান কাজ নিচে দেওয়া হলো:**\n১. **গ্যাস্ট্রিন (Gastrin):** পাকস্থলীর গ্যাস্ট্রিক গ্রন্থিকে উদ্দীপিত করে গ্যাস্ট্রিক রস ও হাইড্রোক্লোরিক অ্যাসিড ($\\text{HCl}$) নিঃসরণ নিয়ন্ত্রণ করে।\n২. **সিক্রেটিন (Secretin):** অগ্ন্যাশয়কে উদ্দীপিত করে বাইকার্বনেটসমৃদ্ধ অগ্ন্যাশয় রস নিঃসরণ ঘটায় এবং যকৃৎ হতে পিত্তরস নিঃসরণে সহায়তা করে।\n৩. **কোলেসিস্টোকাইনিন (Cholecystokinin / CCK):** পিত্তথলির সংকোচন ঘটিয়ে পিত্তরস ক্ষুদ্রান্ত্রে নির্গত করে এবং অগ্ন্যাশয় হতে পরিপাককারী এনজাইম নিঃসরণ উদ্দীপিত করে।\n৪. **সোমাটোস্ট্যাটিন (Somatostatin):** গ্যাস্ট্রিন ও গ্যাস্ট্রিক রস নিঃসরণ হ্রাস করে পরিপাক ক্রিয়ার মাত্রা নিয়ন্ত্রণ করে।\n৫. **এন্টেরোকাইনিন (Enterocrinin):** ক্ষুদ্রান্ত্রের প্রাচীরের ব্রুনার ও লিবারকুন গ্রন্থিকে উদ্দীপিত করে আন্ত্রিক রস ও এনজাইম নিঃসরণ ঘটায়।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BANGLA (17 - 19) ========================
  {
    number: 17,
    question_number: 17,
    subject: 'বাংলা (Bangla)',
    question:
      '1. সারমর্ম লেখ:\nমানব-কল্যাণ স্বয়ম্ভু, বিচ্ছিন্ন, সম্পর্ক-রহিত হতে পারে না। প্রতিটি মানুষ যেমন সমাজের সাথে সম্পর্কিত, তেমনি তার কল্যাণও সমগ্র সমাজের কল্যাণের সাথে সংযুক্ত। এই উপলব্ধি ছাড়া মানব-কল্যাণ স্রেফ দান-খয়রাত আর কাঙালি ভোজনের মতো মানবমর্যাদার অবমাননাকর এক পদ্ধতি না হয়ে যায় না; যা আমাদের দেশে আর সমাজে রীতিমতো প্রকট। এসব ক্রিয়াকর্মের মূল বা উৎস হচ্ছে "ওপর থেকে নিচের দিকে" অনুগ্রহ প্রদর্শন। তা ছাড়া, রাষ্ট্রীয় ও সামাজিক প্রেক্ষাপটে মানব-কল্যাণকে বৃহত্তর মানবতার সাথে সংযুক্ত করে না দেখলে তার সর্বজনীনতা এবং কার্যকারিতাও ক্ষুণ্ণ হয়ে পড়ে। মানব-কল্যাণ তো মানুষের পক্ষে, মানুষের জন্য, মানুষ হিসেবে তার সহজাত অধিকার ও মর্যাদা প্রতিষ্ঠা ছাড়া আর কিছু নয়। এ উপলব্ধি ছাড়া মানব-কল্যাণ মানব-অপমানে পরিণত হয়।',
    question_html:
      '<p>1. সারমর্ম লেখ:<br>মানব-কল্যাণ স্বয়ম্ভু, বিচ্ছিন্ন, সম্পর্ক-রহিত হতে পারে না। প্রতিটি মানুষ যেমন সমাজের সাথে সম্পর্কিত, তেমনি তার কল্যাণও সমগ্র সমাজের কল্যাণের সাথে সংযুক্ত। এই উপলব্ধি ছাড়া মানব-কল্যাণ স্রেফ দান-খয়রাত আর কাঙালি ভোজনের মতো মানবমর্যাদার অবমাননাকর এক পদ্ধতি না হয়ে যায় না; যা আমাদের দেশে আর সমাজে রীতিমতো প্রকট। এসব ক্রিয়াকর্মের মূল বা উৎস হচ্ছে "ওপর থেকে নিচের দিকে" অনুগ্রহ প্রদর্শন। তা ছাড়া, রাষ্ট্রীয় ও সামাজিক প্রেক্ষাপটে মানব-কল্যাণকে বৃহত্তর মানবতার সাথে সংযুক্ত করে না দেখলে তার সর্বজনীনতা এবং কার্যকারিতাও ক্ষুণ্ণ হয়ে পড়ে। মানব-কল্যাণ তো মানুষের পক্ষে, মানুষের জন্য, মানুষ হিসেবে তার সহজাত অধিকার ও মর্যাদা প্রতিষ্ঠা ছাড়া আর কিছু নয়। এ উপলব্ধি ছাড়া মানব-কল্যাণ মানব-অপমানে পরিণত হয়।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**সারমর্ম:**\nপ্রকৃত মানব-কল্যাণ কোনো বিচ্ছিন্ন দান-খয়রাত বা করুণা প্রদর্শন নয়; বরং তা সমগ্র সমাজের সামগ্রিক মঙ্গলের সাথে অবিচ্ছেদ্যভাবে যুক্ত। অনুগ্রহের পরিবর্তে মানুষের সহজাত অধিকার ও আত্মমর্যাদা প্রতিষ্ঠা করাই সত্যিকারের মানব-কল্যাণ। এই চেতনা ছাড়া তথাকথিত সাহায্য কেবল মানুষের মর্যাদাকেই অপমানিত করে।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 18,
    question_number: 18,
    subject: 'বাংলা (Bangla)',
    question: '2. নিচের শব্দগুলোর প্রমিত বানানরূপ লেখ:\nঅচিন্ত, বিভিশিকা, আকাঙ্খা, অহর্নিশি, সমিচীন, দূর্বিশহ।',
    question_html:
      '<p>2. নিচের শব্দগুলোর প্রমিত বানানরূপ লেখ:<br>অচিন্ত, বিভিশিকা, আকাঙ্খা, অহর্নিশি, সমিচীন, দূর্বিশহ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত শব্দগুলোর প্রমিত বানানরূপ নিচে দেওয়া হলো:\n\n| প্রদত্ত অশুদ্ধ বানান | প্রমিত (শুদ্ধ) বানান |\n| --- | --- |\n| অচিন্ত | **অচিন্ত্য** |\n| বিভিশিকা | **বিভীষিকা** |\n| আকাঙ্খা | **আকাঙ্ক্ষা** |\n| অহর্নিশি | **অহর্নিশ** |\n| সমিচীন | **সমীচীন** |\n| দূর্বিশহ | **দুর্বিষহ** |',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 19,
    question_number: 19,
    subject: 'বাংলা (Bangla)',
    question: '3. সংজ্ঞার্থ দাও:\nস্পষ্ট ব্যঞ্জন, উপসর্গ, জটিল বাক্য, অপিনিহিতি।',
    question_html: '<p>3. সংজ্ঞার্থ দাও:<br>স্পষ্ট ব্যঞ্জন, উপসর্গ, জটিল বাক্য, অপিনিহিতি।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n* **স্পৃষ্ট ব্যঞ্জন (বা স্পষ্ট ব্যঞ্জন):** যেসব ব্যঞ্জনধ্বনি উচ্চারণের সময় মুখগহ্বরের দুটি বাক্-প্রত্যঙ্গ পরস্পরকে পূর্ণভাবে স্পর্শ করে ফুসফুসতাড়িত বাতাসকে সাময়িকভাবে বাধা দেয় এবং পরক্ষণেই স্পর্শ খুলে বাতাস বেরিয়ে যায়, সেগুলোকে স্পৃষ্ট ব্যঞ্জন বা স্পর্শ ব্যঞ্জন বলে। যেমন— ক, খ, প, ফ, ত, থ ইত্যাদি।\n* **উপসর্গ:** যেসব অর্থহীন অব্যয়সূচক শব্দাংশ অন্য শব্দের (ধাতু বা নাম শব্দের) পূর্বে বসে নতুন অর্থবোধক শব্দ গঠন করে এবং শব্দের অর্থের সম্প্রসারণ, সংকোচন বা পরিবর্তন ঘটায়, সেগুলোকে উপসর্গ বলে। যেমন— প্র, পরা, পরি, সু, বি ইত্যাদি।\n* **জটিল বাক্য:** যে বাক্যে একটি প্রধান খণ্ডবাক্য এবং তার ওপর নির্ভরশীল এক বা একাধিক অপ্রধান খণ্ডবাক্য পরস্পর সাপেক্ষ সর্বনাম বা যোজক দ্বারা যুক্ত থাকে, তাকে জটিল বা মিশ্র বাক্য বলে। যেমন— *যিনি পরের উপকার করেন, তাঁকে সবাই শ্রদ্ধা করে।*\n* **অপিনিহিতি:** শব্দের মধ্যকার পরের ই-কার ($\\text{ি}$) বা উ-কার ($\\text{ু}$) তার নির্ধারিত স্থানের পূর্বে অর্থাৎ ব্যঞ্জনধ্বনির আগে উচ্চারিত হওয়ার রীতিকে অপিনিহিতি বলে। যেমন— আজি > আইজ, সাধু > সাউধ, সত্য > সইত্য।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== ENGLISH (20 - 22) ========================
  {
    number: 20,
    question_number: 20,
    subject: 'ইংরেজি (English)',
    question: '1. Make meaningful sentences with the following words: disintegrate, exalted, tranquility, eradicate.',
    question_html:
      '<p>1. Make meaningful sentences with the following words: disintegrate, exalted, tranquility, eradicate.</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n* **Disintegrate** *( ভেঙে টুকরো টুকরো হয়ে যাওয়া / ক্ষয়প্রাপ্ত হওয়া)*: Without mutual trust and respect, even the strongest social bonds can gradually **disintegrate**.\n* **Exalted** *(মহান / উচ্চমর্যাদাসম্পন্ন)*: The poet held an **exalted** position in the literary history of the nation.\n* **Tranquility** *(প্রশান্তি / নীরবতা)*: Walking along the quiet riverbank at dawn filled his mind with deep **tranquility**.\n* **Eradicate** *(সমূলে উৎপাটন করা / নির্মূল করা)*: Education and economic empowerment are essential tools to **eradicate** poverty from society.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 21,
    question_number: 21,
    subject: 'ইংরেজি (English)',
    question:
      "2. Fill in the blanks with appropriate words from the list: (care, disabilities, pleasant, relaxed, education, enjoyable)\nChildren's right to (a) ___ also implies that the school they will go to will have a (b) ___ and learning-friendly environment where everyone will have an (c) ___ time. Teachers will be kind, caring and supportive and children will feel (d) ___. No harsh words will be spoken to them and special (e) ___ taken of the children with learning (f) ___.",
    question_html:
      "<p>2. Fill in the blanks with appropriate words from the list: (care, disabilities, pleasant, relaxed, education, enjoyable)<br>Children's right to (a) ___ also implies that the school they will go to will have a (b) ___ and learning-friendly environment where everyone will have an (c) ___ time. Teachers will be kind, caring and supportive and children will feel (d) ___. No harsh words will be spoken to them and special (e) ___ taken of the children with learning (f) ___.</p>",
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n* **(a)** education\n* **(b)** pleasant\n* **(c)** enjoyable\n* **(d)** relaxed\n* **(e)** care\n* **(f)** disabilities\n\n**Completed Passage:**\nChildren\'s right to **(a) education** also implies that the school they will go to will have a **(b) pleasant** and learning-friendly environment where everyone will have an **(c) enjoyable** time. Teachers will be kind, caring and supportive and children will feel **(d) relaxed**. No harsh words will be spoken to them and special **(e) care** taken of the children with learning **(f) disabilities**.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 22,
    question_number: 22,
    subject: 'ইংরেজি (English)',
    question: '3. Write a paragraph on "Students\' role in social work."',
    question_html: '<p>3. Write a paragraph on "Students\' role in social work."</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n**Students\' Role in Social Work**\n\nStudents are the most energetic, idealistic, and progressive force of a nation, and while their primary duty is acquiring knowledge, they also bear a vital responsibility toward society. Because they possess fresh perspectives and compassionate hearts, students can play a transformative role in social work and community development. During natural disasters such as floods, cyclones, and cold waves, student volunteers are often the first responders who collect relief funds, distribute food and medicine, and rescue affected families. Beyond emergency relief, students can organize adult literacy campaigns for underprivileged citizens, raise public awareness about sanitation, dengue prevention, and environmental conservation, and participate in tree plantation and blood donation drives. Engaging in social service alongside academic studies not only uplifts marginalized communities but also instills empathy, leadership, civic responsibility, and moral integrity in students, preparing them to become conscientious leaders of tomorrow.',
    explanation_html: null,
    explanation_image_urls: [],
  },
];

// ============================================================================
// 2. DU 23-24 WRITTEN (22 Questions)
// ============================================================================
const questions23_24 = [
  // ======================== BIOLOGY (1 - 4) ========================
  {
    number: 1,
    question_number: 1,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '1. ব্যাকটেরিয়ার ফ্ল্যাজেলা এবং পিলির মধ্যে পাঁচটি পার্থক্য লিখ।',
    question_html: '<p>1. ব্যাকটেরিয়ার ফ্ল্যাজেলা এবং পিলির মধ্যে পাঁচটি পার্থক্য লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nব্যাকটেরিয়ার ফ্ল্যাজেলা এবং পিলির মধ্যে পাঁচটি পার্থক্য নিচে দেওয়া হলো:\n\n| পার্থক্যের বিষয় | ফ্ল্যাজেলা (Flagella) | পিলি (Pili) |\n| --- | --- | --- |\n| ১. আকার ও আকৃতি | অপেক্ষাকৃত লম্বা, সরু ও ঢেউ খেলানো সূত্রাকার উপাঙ্গ। | অপেক্ষাকৃত খাটো, ফাঁপা, শক্ত ও দণ্ডাকার উপাঙ্গ। |\n| ২. রাসায়নিক উপাদান | **ফ্ল্যাজেলিন (Flagellin)** নামক প্রোটিন দ্বারা গঠিত। | **পিলিন (Pilin)** নামক প্রোটিন দ্বারা গঠিত। |\n| ৩. উৎপত্তি | কোষঝিল্লি বা প্লাজমামেমব্রেনের বেসাল বডি থেকে উৎপন্ন হয়। | সাইটোপ্লাজম বা কোষপ্রাচীরের নিচের স্তর থেকে উৎপন্ন হয়। |\n| ৪. সংখ্যা | কোষে এদের সংখ্যা তুলনামূলকভাবে কম (১ থেকে কয়েকটি)। | কোষে এদের সংখ্যা অনেক বেশি (শতাধিক হতে পারে)। |\n| ৫. প্রধান কাজ | ব্যাকটেরিয়ার **চলনে (Locomotion)** সহায়তা করে। | পোষক কোষের সাথে **আটকে থাকা** এবং কনজুগেশন নালি গঠনে সহায়তা করে। |',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 2,
    question_number: 2,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '2. জিন ক্লোনিং বলতে কী বোঝ? রিকম্বিনেন্ট ডিএনএ টেকনোলজির ধাপগুলো উল্লেখ করো।',
    question_html: '<p>2. জিন ক্লোনিং বলতে কী বোঝ? রিকম্বিনেন্ট ডিএনএ টেকনোলজির ধাপগুলো উল্লেখ করো।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**জিন ক্লোনিং (Gene Cloning):** কোনো জীব থেকে কাঙ্ক্ষিত একটি জিন বা ডিএনএ খণ্ড পৃথক করে বাহকের (যেমন প্লাজমিড) সাহায্যে পোষক কোষে প্রবেশ করিয়ে হুবহু অসংখ্য প্রতিলিপি (কপি) তৈরি করার প্রক্রিয়াকে জিন ক্লোনিং বলে।\n\n**রিকম্বিনেন্ট ডিএনএ (Recombinant DNA) টেকনোলজির ধাপসমূহ:**\n১. দাতা জীব থেকে কাঙ্ক্ষিত DNA নির্বাচন ও পৃথকীকরণ।\n২. বাহক (Vector, যেমন ব্যাকটেরিয়ার প্লাজমিড) নির্বাচন ও পৃথকীকরণ।\n৩. নির্দিষ্ট **রেস্ট্রিকশন এনজাইম (Restriction Enzyme)** দ্বারা কাঙ্ক্ষিত DNA এবং বাহক প্লাজমিড DNA-কে নির্দিষ্ট স্থানে কর্তন করা।\n৪. **DNA লাইগেজ (DNA Ligase)** এনজাইমের সাহায্যে কাঙ্ক্ষিত DNA খণ্ডকে বাহক প্লাজমিডের সাথে যুক্ত করে **রিকম্বিনেন্ট DNA** তৈরি করা।\n৫. রিকম্বিনেন্ট DNA-কে উপযুক্ত পোষক কোষে (যেমন *E. coli* ব্যাকটেরিয়ায়) প্রবেশ করানো (ট্রান্সফরমেশন)।\n৬. রিকম্বিনেন্ট DNA-ধারী পোষক কোষ শনাক্তকরণ এবং আবাদ মাধ্যমে সংখ্যাবৃদ্ধি (ক্লোনিং) ও কাঙ্ক্ষিত উৎপাদ সংগ্রহ।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 3,
    question_number: 3,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '3. শ্রেণিবিন্যাসের ভিত্তি হিসেবে প্রাণীর জীবনপদ্ধতি প্রধানত কত ভাগে ভাগ করা যায়, সংক্ষেপে ব্যাখ্যা করো।',
    question_html:
      '<p>3. শ্রেণিবিন্যাসের ভিত্তি হিসেবে প্রাণীর জীবনপদ্ধতি প্রধানত কত ভাগে ভাগ করা যায়, সংক্ষেপে ব্যাখ্যা করো।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nশ্রেণিবিন্যাসের ভিত্তি হিসেবে প্রাণীর জীবনপদ্ধতিকে প্রধানত **দুই ভাগে** ভাগ করা যায়:\n\n১. **মুক্তজীবী (Free-living):** যেসব প্রাণী স্বাধীনভাবে চলাফেরা ও জীবনযাপন করে এবং খাদ্য ও আশ্রয়ের জন্য অন্য কোনো জীবের ওপর সরাসরি পরজীবী হিসেবে নির্ভরশীল নয়, তাদের মুক্তজীবী প্রাণী বলে। যেমন— কবুতর (*Columba livia*), রুই মাছ (*Labeo rohita*), মানুষ ইত্যাদি।\n\n২. **পরজীবী (Parasitic):** যেসব প্রাণী অন্য কোনো জীবদেহের (পোষক) ভেতরে বা বাইরে অবস্থান করে সেখান থেকে পুষ্টি শোষণ করে জীবনধারণ করে এবং পোষকের ক্ষতিসাধন করে, তাদের পরজীবী প্রাণী বলে। যেমন— যকৃৎ কৃমি (*Fasciola hepatica*), গোলকৃমি (*Ascaris lumbricoides*) ইত্যাদি। *(এছাড়া মিথোজীবী ও সহভোক্তা জীবনপদ্ধতিও দেখা যায়।)*',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 4,
    question_number: 4,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '4. Hydra-র একটি আদর্শ নিডোসাইটের অংশগুলো উল্লেখ করো।',
    question_html: '<p>4. Hydra-র একটি আদর্শ নিডোসাইটের অংশগুলো উল্লেখ করো।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**Hydra-র একটি আদর্শ নিডোসাইট (Cnidocyte) কোষের প্রধান অংশগুলো নিচে উল্লেখ করা হলো:**\n১. **আবরণী (Cell covering):** দ্বিস্তরী প্লাজমামেমব্রেন দ্বারা গঠিত বহিরাবরণ এবং দানাদার সাইটোপ্লাজম ও গোড়ার দিকে অবস্থিত নিউক্লিয়াস।\n২. **নেমাটোসিস্ট (Nematocyst):** কোষের অভ্যন্তরে অবস্থিত হিপনোটক্সিন তরলপূর্ণ থলি (ক্যাপসুল), ফাঁপা সুতা বা সূত্রক এবং কাঁটাযুক্ত বাট (বা শ্যাফট) — যেখানে ৩টি বড় কাঁটা (**বার্ব**) ও ৩ সারি ক্ষুদ্র কাঁটা (**বার্বিউল**) থাকে।\n৩. **অপারকুলাম (Operculum):** নেমাটোসিস্টের মুখ ঢেকে রাখা ঢাকনাসদৃশ অংশ।\n৪. **নিডোসিল (Cnidocil):** নিডোসাইটের মুক্ত প্রান্তে অবস্থিত দৃঢ়, সংবেদনশীল ও ট্রিগারের মতো কাজ করা রুম বা কাঁটাসদৃশ প্রবর্ধক।\n৫. **পেশি-সূত্র ও ল্যাসো (Muscle fibrils & Lasso):** নেমাটোসিস্টের নিচের প্রান্তে অবস্থিত সংকোচনশীল পেশিতন্তু ও পেঁচানো সূত্রক।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== MATHEMATICS (5 - 8) ========================
  {
    number: 5,
    question_number: 5,
    subject: 'গণিত (Mathematics)',
    question:
      '1. একটি বুলেট বালির বস্তা $6\\text{ cm}$ ভেদ করার পর $\\frac{1}{3}$ বেগ হারায়। বুলেটটি বস্তার মধ্যে কত সেন্টিমিটার প্রবেশ করে থেমে যাবে?',
    question_html:
      '<p>1. একটি বুলেট বালির বস্তা $6\\text{ cm}$ ভেদ করার পর $\\frac{1}{3}$ বেগ হারায়। বুলেটটি বস্তার মধ্যে কত সেন্টিমিটার প্রবেশ করে থেমে যাবে?</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, বুলেটের আদিবেগ $u$ এবং সুষম মন্দন $a$।\n$s_1 = 6\\text{ cm}$ ভেদ করার পর বেগ $\\frac{1}{3}$ অংশ হারালে অবশিষ্ট বেগ, $v = u - \\frac{u}{3} = \\frac{2u}{3}$।\n\nগতির সমীকরণ $v^2 = u^2 - 2as$ প্রয়োগ করে পাই:\n$$\\left(\\frac{2u}{3}\\right)^2 = u^2 - 2a(6)$$\n$$\\Rightarrow \\frac{4u^2}{9} = u^2 - 12a \\Rightarrow 12a = \\frac{5u^2}{9} \\Rightarrow 2a = \\frac{5u^2}{54}$$\n\nধরি, বুলেটটি বস্তার মধ্যে শুরু থেকে মোট $S\\text{ cm}$ প্রবেশ করে থেমে যাবে (শেষবেগ $v\' = 0$):\n$$0^2 = u^2 - 2aS$$\n$$\\Rightarrow S = \\frac{u^2}{2a} = \\frac{u^2}{\\frac{5u^2}{54}} = \\frac{54}{5} = 10.8\\text{ cm}$$\n\nএবং $6\\text{ cm}$ ভেদ করার পর **আরও** প্রবেশ করবে: $10.8 - 6 = 4.8\\text{ cm}$।\n\n**উত্তর:** বুলেটটি বস্তার মধ্যে মোট $10.8\\text{ cm}$ (বা $6\\text{ cm}$ এর পর আরও $4.8\\text{ cm}$) প্রবেশ করে থেমে যাবে।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 6,
    question_number: 6,
    subject: 'গণিত (Mathematics)',
    question:
      '2. $x^2 + kx + 1 = 0$ সমীকরণের মূলদ্বয়ের অনুপাত $x^2 - 2x + 9 = 0$ সমীকরণের মূলদ্বয়ের অনুপাতের সমান হলে $k$-এর মান নির্ণয় কর।',
    question_html:
      '<p>2. $x^2 + kx + 1 = 0$ সমীকরণের মূলদ্বয়ের অনুপাত $x^2 - 2x + 9 = 0$ সমীকরণের মূলদ্বয়ের অনুপাতের সমান হলে $k$-এর মান নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, প্রথম সমীকরণ $x^2 + kx + 1 = 0$ এর মূলদ্বয় $\\alpha, \\beta$ এবং দ্বিতীয় সমীকরণ $x^2 - 2x + 9 = 0$ এর মূলদ্বয় $\\gamma, \\delta$।\nতাহলে:\n* $\\alpha + \\beta = -k, \\quad \\alpha\\beta = 1$\n* $\\gamma + \\delta = 2, \\quad \\gamma\\delta = 9$\n\nপ্রশ্নমতে, $\\frac{\\alpha}{\\beta} = \\frac{\\gamma}{\\delta}$।\nযোজন-বিয়োজন ও বর্গ অথবা $\\frac{(\\alpha + \\beta)^2}{\\alpha\\beta} = \\frac{(\\gamma + \\delta)^2}{\\gamma\\delta}$ অভেদ প্রয়োগ করে পাই:\n$$\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha} + 2 = \\frac{\\gamma}{\\delta} + \\frac{\\delta}{\\gamma} + 2$$\n$$\\Rightarrow \\frac{(\\alpha + \\beta)^2}{\\alpha\\beta} = \\frac{(\\gamma + \\delta)^2}{\\gamma\\delta}$$\n$$\\Rightarrow \\frac{(-k)^2}{1} = \\frac{(2)^2}{9}$$\n$$\\Rightarrow k^2 = \\frac{4}{9} \\Rightarrow k = \\pm \\frac{2}{3}$$\n\n**উত্তর:** $k = \\pm \\frac{2}{3}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 7,
    question_number: 7,
    subject: 'গণিত (Mathematics)',
    question:
      '3. $(-1, 2)$ বিন্দু দিয়ে যায় এবং $3x - y + 7 = 0$ রেখার সাথে $45^\\circ$ কোণ উৎপন্ন করে এরূপ সরলরেখার সমীকরণ নির্ণয় কর।',
    question_html:
      '<p>3. $(-1, 2)$ বিন্দু দিয়ে যায় এবং $3x - y + 7 = 0$ রেখার সাথে $45^\\circ$ কোণ উৎপন্ন করে এরূপ সরলরেখার সমীকরণ নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত রেখা $3x - y + 7 = 0 \\Rightarrow y = 3x + 7$ এর ঢাল $m_1 = 3$।\nধরি, নির্ণেয় সরলরেখার ঢাল $m$।\n\nরেখাদ্বয়ের মধ্যবর্তী কোণ $45^\\circ$ হওয়ায়:\n$$\\tan 45^\\circ = \\pm \\frac{m - m_1}{1 + mm_1}$$\n$$\\Rightarrow 1 = \\pm \\frac{m - 3}{1 + 3m}$$\n\n* $(+)$ চিহ্ন নিয়ে: $1 + 3m = m - 3 \\Rightarrow 2m = -4 \\Rightarrow m = -2$\n* $(-)$ চিহ্ন নিয়ে: $1 + 3m = -m + 3 \\Rightarrow 4m = 2 \\Rightarrow m = \\frac{1}{2}$\n\nসুতরাং $(-1, 2)$ বিন্দুগামী নির্ণেয় সরলরেখার সমীকরণ:\n১. যখন $m = -2$:\n$$y - 2 = -2(x + 1) \\Rightarrow 2x + y = 0$$\n২. যখন $m = \\frac{1}{2}$:\n$$y - 2 = \\frac{1}{2}(x + 1) \\Rightarrow 2y - 4 = x + 1 \\Rightarrow x - 2y + 5 = 0$$\n\n**উত্তর:** নির্ণেয় সরলরেখাদ্বয়ের সমীকরণ $2x + y = 0$ এবং $x - 2y + 5 = 0$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 8,
    question_number: 8,
    subject: 'গণিত (Mathematics)',
    question: '4. $\\theta$-এর জন্য সমাধান কর: $3\\sec^4\\theta + 8 = 10\\sec^2\\theta, \\quad 0 < \\theta < 2\\pi$।',
    question_html: '<p>4. $\\theta$-এর জন্য সমাধান কর: $3\\sec^4\\theta + 8 = 10\\sec^2\\theta, \\quad 0 < \\theta < 2\\pi$।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত সমীকরণ:\n$$3\\sec^4\\theta - 10\\sec^2\\theta + 8 = 0$$\n$$\\Rightarrow 3\\sec^4\\theta - 6\\sec^2\\theta - 4\\sec^2\\theta + 8 = 0$$\n$$\\Rightarrow (3\\sec^2\\theta - 4)(\\sec^2\\theta - 2) = 0$$\n\n**১ম ক্ষেত্র:** $3\\sec^2\\theta - 4 = 0 \\Rightarrow \\sec^2\\theta = \\frac{4}{3} \\Rightarrow \\cos\\theta = \\pm \\frac{\\sqrt{3}}{2}$\n$0 < \\theta < 2\\pi$ ব্যবধিতে:\n$$\\theta = \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$$\n\n**২য় ক্ষেত্র:** $\\sec^2\\theta - 2 = 0 \\Rightarrow \\sec^2\\theta = 2 \\Rightarrow \\cos\\theta = \\pm \\frac{1}{\\sqrt{2}}$\n$0 < \\theta < 2\\pi$ ব্যবধিতে:\n$$\\theta = \\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$$\n\n**উত্তর:** নির্ণেয় সমাধান $\\theta = \\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}, \\frac{11\\pi}{6}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BANGLA (9 - 11) ========================
  {
    number: 9,
    question_number: 9,
    subject: 'বাংলা (Bangla)',
    question: '1. পরিভাষাযোগে বাক্য গঠন করো: অ্যাডহক; রেয়াত; ডেপুটেশন; প্রোক্টর; নথি; তিলার্ধ।',
    question_html: '<p>1. পরিভাষাযোগে বাক্য গঠন করো: অ্যাডহক; রেয়াত; ডেপুটেশন; প্রোক্টর; নথি; তিলার্ধ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n* **অ্যাডহক (তদর্থক / অস্থায়ী):** প্রতিষ্ঠানের জরুরি কার্যক্রম পরিচালনার জন্য একটি **অ্যাডহক** কমিটি গঠন করা হয়েছে।\n* **রেয়াত (মওকুফ / ছাড়):** দুর্নীতির বিষয়ে অপরাধীদের কোনো প্রকার **রেয়াত** দেওয়া হবে না।\n* **ডেপুটেশন (প্রেষণ):** তাকে শিক্ষা মন্ত্রণালয় থেকে প্রেষণে বা **ডেপুটেশনে** নতুন প্রকল্পে নিয়োগ দেওয়া হয়েছে।\n* **প্রোক্টর (শৃঙ্খলাপাল):** বিশ্ববিদ্যালয়ের সার্বিক শৃঙ্খলা রক্ষায় **প্রোক্টর** মহোদয় সর্বদা তৎপর রয়েছেন।\n* **নথি (ফাইল / দলিল):** জমি সংক্রান্ত পুরনো **নথি**গুলো মহাফেজখানায় সযত্নে সংরক্ষিত আছে।\n* **তিলার্ধ (তিলের অর্ধেক / এক মুহূর্ত):** পরীক্ষার্থীদের পরীক্ষার হলে **তিলার্ধ** সময়ও নষ্ট করা উচিত নয়।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 10,
    question_number: 10,
    subject: 'বাংলা (Bangla)',
    question: '2. উপসর্গযোগে ছয়টি শব্দ তৈরি করো: গর; প্রতি; অভি; অজ; পাতি; নিম।',
    question_html: '<p>2. উপসর্গযোগে ছয়টি শব্দ তৈরি করো: গর; প্রতি; অভি; অজ; পাতি; নিম।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত উপসর্গগুলো দিয়ে গঠিত শব্দ নিচে দেওয়া হলো:\n\n| উপসর্গ | গঠিত শব্দ |\n| --- | --- |\n| **গর** | **গরহাজির**, গরমিল |\n| **প্রতি** | **প্রতিধ্বনি**, প্রতিবাদ |\n| **অভি** | **অভিযান**, অভিনয় |\n| **অজ** | **অজপাড়াগাঁ**, অজমূর্খ |\n| **পাতি** | **পাতিহাঁস**, পাতিলেবু |\n| **নিম** | **নিমরাজি**, নিমখুন |',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 11,
    question_number: 11,
    subject: 'বাংলা (Bangla)',
    question: '3. ভাবসম্প্রসারণ করো: যে সহে, সে রহে।',
    question_html: '<p>3. ভাবসম্প্রসারণ করো: যে সহে, সে রহে।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**মূলভাব:** সহনশীলতা বা ধৈর্য মানবজীবনের একটি শ্রেষ্ঠ গুণ। প্রতিকূল পরিস্থিতিতে যে ব্যক্তি ধৈর্য ও সহিষ্ণুতার পরিচয় দেয়, জীবনসংগ্রামে শেষ পর্যন্ত সেই টিকে থাকে এবং জয়ী হয়।\n\n**সম্প্রসারিত ভাব:** মানবজীবন পুষ্পশয্যা নয়; তা নানা ঘাত-প্রতিঘাত, দুঃখ-কষ্ট ও প্রতিকূলতায় পরিপূর্ণ। চলার পথে মানুষকে প্রতিনিয়ত নানামুখী বাধা-বিপত্তি ও সংকটের মুখোমুখি হতে হয়। এসব সংকটে যারা ধৈর্য হারিয়ে হতাশ হয়ে পড়ে কিংবা অস্থিরতা প্রকাশ করে, তারা অকালেই ঝরে পড়ে এবং অভীষ্ট লক্ষ্যে পৌঁছাতে পারে না। পক্ষান্তরে, প্রাকৃতিক জগতের দিকে তাকালে দেখা যায়—প্রচণ্ড ঝড়ের তাণ্ডবে বিশাল শক্ত বৃক্ষ ভেঙে পড়লেও নরম ঘাস বা লতা নত হয়ে ঝড় সহ্য করে ঠিকই টিকে থাকে। মানুষের জীবনেও ধৈর্য ও সহিষ্ণুতা তেমনই এক অজেয় শক্তি। বিপদে অবিচল থেকে, অন্যায় বা কটু কথায় উত্তেজিত না হয়ে যারা নীরবে সংগ্রাম চালিয়ে যায়, কালের প্রবাহে তাদের অস্তিত্বই স্থায়ী ও গৌরবময় হয়।\n\n**মন্তব্য:** সহনশীলতাই জীবনসংগ্রামে টিকে থাকার মূলমন্ত্র। তাই জীবনের যেকোনো দুর্যোগে ধৈর্যধারণ করলেই কাঙ্ক্ষিত সাফল্য অর্জন করা সম্ভব।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== ENGLISH (12 - 14) ========================
  {
    number: 12,
    question_number: 12,
    subject: 'ইংরেজি (English)',
    question:
      '1. Make meaningful sentences with the following words: superfluous, intrinsic, idiosyncratic, apprehensive',
    question_html:
      '<p>1. Make meaningful sentences with the following words: superfluous, intrinsic, idiosyncratic, apprehensive</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n* **Superfluous** *(অতিরিক্ত / অপ্রয়োজনীয়)*: Please remove all **superfluous** words from the essay to make it concise and clear.\n* **Intrinsic** *(অন্তর্নিহিত / সহজাত)*: Honesty has an **intrinsic** value that cannot be measured by material wealth.\n* **Idiosyncratic** *(স্বতন্ত্র মেজাজ বা ব্যক্তিগত বৈশিষ্ট্যপূর্ণ)*: The artist is famous for his **idiosyncratic** style of blending bright colors with geometric shapes.\n* **Apprehensive** *(আশঙ্কিত / উদ্বিগ্ন)*: Many students felt **apprehensive** before the announcement of the admission test results.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 13,
    question_number: 13,
    subject: 'ইংরেজি (English)',
    question:
      '2. Write a well-organised paragraph on "The perils of Artificial Intelligence (AI)", in the space provided, keeping in mind the elements of a paragraph, such as a topic sentence, supporting detail sentences and a conclusion.',
    question_html:
      '<p>2. Write a well-organised paragraph on "The perils of Artificial Intelligence (AI)", in the space provided, keeping in mind the elements of a paragraph, such as a topic sentence, supporting detail sentences and a conclusion.</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n**The Perils of Artificial Intelligence (AI)**\n\nWhile Artificial Intelligence (AI) has revolutionized modern science and industry, its rapid and unregulated expansion poses severe perils to humanity. First and foremost, widespread automation driven by AI threatens to displace millions of workers across manufacturing, customer service, and even creative professions, widening global economic inequality. Furthermore, AI-powered deepfakes and algorithmic disinformation can easily manipulate public opinion, erode trust in democratic institutions, and violate personal privacy through mass surveillance. Another critical danger lies in algorithmic bias and autonomous weapons systems, where life-and-death decisions could be made by machines lacking human empathy and moral judgment. Over-reliance on AI tools in education also risks diminishing human critical thinking and problem-solving abilities. In conclusion, unless strict ethical frameworks, transparency, and international regulations are enforced, the unchecked growth of Artificial Intelligence may endanger the very society it was designed to serve.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 14,
    question_number: 14,
    subject: 'ইংরেজি (English)',
    question:
      '3. Read the extract carefully and answer the questions that follow:\n"All people dream, but not equally.\nThose who dream by night in the dusty recesses of their mind,\nWake in the morning to find that it was vanity;\nBut the dreamers of the day are dangerous people,\nFor they dream their dreams with open eyes,\nAnd make them come true."\n\n3.1. What do the "dusty recesses" mean?\n3.2. Why are the "dreamers of the day" dangerous?\n3.3. How do the two types of dreamers differ?',
    question_html:
      '<div><p>3. Read the extract carefully and answer the questions that follow:<br>"All people dream, but not equally.<br>Those who dream by night in the dusty recesses of their mind,<br>Wake in the morning to find that it was vanity;<br>But the dreamers of the day are dangerous people,<br>For they dream their dreams with open eyes,<br>And make them come true."</p><p>3.1. What do the "dusty recesses" mean?</p><p>3.2. Why are the "dreamers of the day" dangerous?</p><p>3.3. How do the two types of dreamers differ?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### 3.1 Solution:\nThe phrase **"dusty recesses"** refers to the forgotten, inactive, or hidden corners of the unconscious human mind where passive nighttime dreams occur and fade away upon waking.\n\n---\n### 3.2 Solution:\nThe **"dreamers of the day"** are called dangerous because they dream consciously with open eyes, possess strong determination, and actively work in reality to turn their visionary dreams into real-world change.\n\n---\n### 3.3 Solution:\nThe two types of dreamers differ in awareness and action: nighttime dreamers dream passively while asleep and wake up to find their dreams empty ("vanity"), whereas daytime dreamers envision goals consciously ("with open eyes") and take concrete action to make them come true.',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== PHYSICS (15 - 18) ========================
  {
    number: 15,
    question_number: 15,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '1. $\\vec{F} = (4y - c_1 z)\\hat{i} + (5z + c_2 x)\\hat{j} + (c_3 y - 3x)\\hat{k}$ ভেক্টরটি একটি সংরক্ষণশীল বল ক্ষেত্র হলে $c_1, c_2, c_3$ এর মান বের করো।',
    question_html:
      '<p>1. $\\vec{F} = (4y - c_1 z)\\hat{i} + (5z + c_2 x)\\hat{j} + (c_3 y - 3x)\\hat{k}$ ভেক্টরটি একটি সংরক্ষণশীল বল ক্ষেত্র হলে $c_1, c_2, c_3$ এর মান বের করো।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nআমরা জানি, একটি বল ক্ষেত্র $\\vec{F}$ সংরক্ষণশীল হওয়ার শর্ত হলো এর কার্ল শূন্য হওয়া, অর্থাৎ:\n$$\\vec{\\nabla} \\times \\vec{F} = \\vec{0}$$\n\nএখন,\n$$\\vec{\\nabla} \\times \\vec{F} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ 4y - c_1 z & 5z + c_2 x & c_3 y - 3x \\end{vmatrix} = \\vec{0}$$\n\n$$\\Rightarrow \\hat{i}(c_3 - 5) - \\hat{j}(-3 - (-c_1)) + \\hat{k}(c_2 - 4) = \\vec{0}$$\n$$\\Rightarrow (c_3 - 5)\\hat{i} + (3 - c_1)\\hat{j} + (c_2 - 4)\\hat{k} = 0\\hat{i} + 0\\hat{j} + 0\\hat{k}$$\n\nসহগ সমীকৃত করে পাই:\n* $3 - c_1 = 0 \\Rightarrow c_1 = 3$\n* $c_2 - 4 = 0 \\Rightarrow c_2 = 4$\n* $c_3 - 5 = 0 \\Rightarrow c_3 = 5$\n\n**উত্তর:** $c_1 = 3, \\; c_2 = 4, \\; c_3 = 5$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 16,
    question_number: 16,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '2. দেখাও যে, অভিকর্ষের টানে মুক্তভাবে পড়ন্ত $m$ ভরের একটি বস্তুর $n$-তম সেকেন্ডে হারানো স্থিতিশক্তি $\\frac{1}{2}mg^2(2n - 1)$ এর সমান।',
    question_html:
      '<p>2. দেখাও যে, অভিকর্ষের টানে মুক্তভাবে পড়ন্ত $m$ ভরের একটি বস্তুর $n$-তম সেকেন্ডে হারানো স্থিতিশক্তি $\\frac{1}{2}mg^2(2n - 1)$ এর সমান।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, $m$ ভরের একটি বস্তু স্থির অবস্থা ($u = 0$) থেকে অভিকর্ষের টানে মুক্তভাবে নিচে পড়ছে।\n* $(n - 1)$ সেকেন্ডে অতিক্রান্ত দূরত্ব: $h_{n-1} = \\frac{1}{2}g(n - 1)^2$\n* $n$ সেকেন্ডে অতিক্রান্ত দূরত্ব: $h_n = \\frac{1}{2}gn^2$\n\nসুতরাং $n$-তম সেকেন্ডে বস্তুটির অতিক্রান্ত দূরত্ব (উচ্চতা হ্রাস):\n$$\\Delta h = h_n - h_{n-1} = \\frac{1}{2}gn^2 - \\frac{1}{2}g(n - 1)^2$$\n$$= \\frac{1}{2}g\\left(n^2 - (n^2 - 2n + 1)\\right) = \\frac{1}{2}g(2n - 1)$$\n\nঅতএব, $n$-তম সেকেন্ডে বস্তুটির হারানো স্থিতিশক্তি:\n$$\\Delta E_p = mg\\Delta h = mg \\times \\frac{1}{2}g(2n - 1) = \\frac{1}{2}mg^2(2n - 1) \\quad \\text{(দেখানো হলো)}$$',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 17,
    question_number: 17,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '3. $q$ এবং $9q$ পরিমাণের দুটি বিন্দু আধান পরস্পর থেকে $d$ দূরত্বে অবস্থিত। সংযোগকারী রেখাংশের ওপর এমন একটি অবস্থান বের করো যেখানে $5q$ পরিমাণের আধান স্থাপন করলে তার ওপর লব্ধি বল শূন্য হয়।',
    question_html:
      '<p>3. $q$ এবং $9q$ পরিমাণের দুটি বিন্দু আধান পরস্পর থেকে $d$ দূরত্বে অবস্থিত। সংযোগকারী রেখাংশের ওপর এমন একটি অবস্থান বের করো যেখানে $5q$ পরিমাণের আধান স্থাপন করলে তার ওপর লব্ধি বল শূন্য হয়।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nধরি, $q$ ও $9q$ আধান দুটির সংযোগকারী রেখাংশের ওপর $q$ আধান হতে $x$ দূরত্বে (এবং $9q$ আধান হতে $(d - x)$ দূরত্বে) $5q$ আধান স্থাপন করলে তার ওপর লব্ধি বল শূন্য হবে।\n\nকুলম্বের সূত্রানুসারে সাম্যাবস্থায়:\n$$F_1 = F_2$$\n$$\\Rightarrow \\frac{1}{4\\pi\\varepsilon_0} \\frac{q \\cdot 5q}{x^2} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{9q \\cdot 5q}{(d - x)^2}$$\n$$\\Rightarrow \\frac{1}{x^2} = \\frac{9}{(d - x)^2}$$\n\nউভয় পক্ষে বর্গমূল করে পাই (রেখাংশের মধ্যবর্তী স্থানের জন্য $+$ চিহ্ন নিয়ে):\n$$\\frac{1}{x} = \\frac{3}{d - x}$$\n$$\\Rightarrow 3x = d - x \\Rightarrow 4x = d \\Rightarrow x = \\frac{d}{4}$$\n\n**উত্তর:** $q$ আধান থেকে $\\frac{d}{4}$ দূরত্বে (এবং $9q$ আধান থেকে $\\frac{3d}{4}$ দূরত্বে) সংযোগকারী রেখাংশের ওপর $5q$ আধান স্থাপন করলে লব্ধি বল শূন্য হবে।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 18,
    question_number: 18,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '4. একটি হাইড্রোজেন পরমাণুর ইলেকট্রনটি $n_1 = 4$ কক্ষপথ থেকে অপর একটি কক্ষপথ $n_2$-তে ট্র্যানজিশন করে। নতুন কক্ষপথে ইলেকট্রনের পর্যায়কালের তুলনায় পূর্বের কক্ষপথের পর্যায়কাল আট গুণ। $n_2$-এর মান নির্ণয় করো।',
    question_html:
      '<p>4. একটি হাইড্রোজেন পরমাণুর ইলেকট্রনটি $n_1 = 4$ কক্ষপথ থেকে অপর একটি কক্ষপথ $n_2$-তে ট্র্যানজিশন করে। নতুন কক্ষপথে ইলেকট্রনের পর্যায়কালের তুলনায় পূর্বের কক্ষপথের পর্যায়কাল আট গুণ। $n_2$-এর মান নির্ণয় করো।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nবোরের পরমাণু মডেল অনুসারে, হাইড্রোজেন পরমাণুর $n$-তম কক্ষপথে আবর্তনরত ইলেকট্রনের:\n* ব্যাসার্ধ $r_n \\propto n^2$ এবং বেগ $v_n \\propto \\frac{1}{n}$\n* সুতরাং পর্যায়কাল $T_n = \\frac{2\\pi r_n}{v_n} \\propto n^3$\n\nঅতএব,\n$$\\frac{T_1}{T_2} = \\left(\\frac{n_1}{n_2}\\right)^3$$\n\nপ্রশ্নমতে, $n_1 = 4$ এবং $T_1 = 8 T_2 \\Rightarrow \\frac{T_1}{T_2} = 8$:\n$$\\left(\\frac{4}{n_2}\\right)^3 = 8 = 2^3$$\n$$\\Rightarrow \\frac{4}{n_2} = 2 \\Rightarrow n_2 = 2$$\n\n**উত্তর:** $n_2 = 2$।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== CHEMISTRY (19 - 22) ========================
  {
    number: 19,
    question_number: 19,
    subject: 'রসায়ন (Chemistry)',
    question:
      '1.1. সাম্যাবস্থায় $2\\text{SO}_2(g) + \\text{O}_2(g) \\rightleftharpoons 2\\text{SO}_3(g)$ বিক্রিয়াটির সাম্যধ্রুবক $K_c$ এর সমীকরণ লেখ। যদি সাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হয়, তবে সাম্যাবস্থা কোন দিকে অগ্রসর হবে গাণিতিকভাবে ব্যাখ্যা কর।\n1.2. পানির DO এর সংজ্ঞা দাও। বিশ্ব স্বাস্থ্য সংস্থার মতে পানিতে BOD ও COD এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা কত?',
    question_html:
      '<div><p>1.1. সাম্যাবস্থায় $2\\text{SO}_2(g) + \\text{O}_2(g) \\rightleftharpoons 2\\text{SO}_3(g)$ বিক্রিয়াটির সাম্যধ্রুবক $K_c$ এর সমীকরণ লেখ। যদি সাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হয়, তবে সাম্যাবস্থা কোন দিকে অগ্রসর হবে গাণিতিকভাবে ব্যাখ্যা কর।</p><p>1.2. পানির DO এর সংজ্ঞা দাও। বিশ্ব স্বাস্থ্য সংস্থার মতে পানিতে BOD ও COD এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা কত?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ১.১ সমাধান ও ব্যাখ্যা:\nবিক্রিয়াটির সাম্যধ্রুবক, $K_c = \\frac{[\\text{SO}_3]^2}{[\\text{SO}_2]^2[\\text{O}_2]}$\n\nসাম্যাবস্থায় $\\text{O}_2$ ও $\\text{SO}_3$ এর ঘনমাত্রা দ্বিগুণ করা হলে বিক্রিয়া কোশেন্ট,\n$$Q_c = \\frac{(2 \\times [\\text{SO}_3])^2}{[\\text{SO}_2]^2(2 \\times [\\text{O}_2])} = \\frac{4 \\times [\\text{SO}_3]^2}{2 \\times [\\text{SO}_2]^2[\\text{O}_2]} = 2 \\times \\frac{[\\text{SO}_3]^2}{[\\text{SO}_2]^2[\\text{O}_2]} = 2K_c$$\n\nএখানে, $Q_c > K_c$ হওয়ায় সাম্যাবস্থা বামদিকে অর্থাৎ পশ্চাৎমুখী অগ্রসর হবে।\n\n---\n### ১.২ সমাধান ও ব্যাখ্যা:\n**DO:** পানিতে দ্রবীভূত অক্সিজেনের পরিমাণকে DO (Dissolved Oxygen) বলে।\n* বিশ্ব স্বাস্থ্য সংস্থার (WHO) মতে পানিতে **BOD** এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা: **$6.0\\text{ ppm}$**\n* বিশ্ব স্বাস্থ্য সংস্থার (WHO) মতে পানিতে **COD** এর সর্বোচ্চ গ্রহণযোগ্য মাত্রা: **$10.0\\text{ ppm}$**',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 20,
    question_number: 20,
    subject: 'রসায়ন (Chemistry)',
    question:
      '2.1. বাস্তব গ্যাস কোন শর্তে আদর্শ গ্যাসের ন্যায় আচরণ করে? কক্ষ তাপমাত্রায় ও চাপে $\\text{CO}_2$ ও $\\text{NH}_3$ গ্যাসের মধ্যে কোনটি আদর্শ আচরণ থেকে বেশি বিচ্যুত হবে এবং কেন?\n2.2. $\\text{Pb(s)/Pb}^{2+}\\text{(aq)} \\parallel \\text{Ag}^+\\text{(aq)/Ag(s)}$ তড়িৎ রাসায়নিক কোষটির লবণ সেতুতে $\\text{K}_2\\text{SO}_4$ এবং $\\text{KCl}$ তড়িৎ বিশ্লেষ্য হিসেবে ব্যবহার করা যাবে না কেন?',
    question_html:
      '<div><p>2.1. বাস্তব গ্যাস কোন শর্তে আদর্শ গ্যাসের ন্যায় আচরণ করে? কক্ষ তাপমাত্রায় ও চাপে $\\text{CO}_2$ ও $\\text{NH}_3$ গ্যাসের মধ্যে কোনটি আদর্শ আচরণ থেকে বেশি বিচ্যুত হবে এবং কেন?</p><p>2.2. $\\text{Pb(s)/Pb}^{2+}\\text{(aq)} \\parallel \\text{Ag}^+\\text{(aq)/Ag(s)}$ তড়িৎ রাসায়নিক কোষটির লবণ সেতুতে $\\text{K}_2\\text{SO}_4$ এবং $\\text{KCl}$ তড়িৎ বিশ্লেষ্য হিসেবে ব্যবহার করা যাবে না কেন?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ২.১ সমাধান ও ব্যাখ্যা:\n**নিম্ন চাপ এবং উচ্চ তাপমাত্রায়** বাস্তব গ্যাস আদর্শ গ্যাসের ন্যায় আচরণ করে।\n\nকক্ষ তাপমাত্রা ও চাপে $\\text{CO}_2$ ও $\\text{NH}_3$ গ্যাসের মধ্যে **$\\text{NH}_3$** আদর্শ আচরণ থেকে বেশি বিচ্যুত হবে। কারণ $\\text{CO}_2$ অপোলার অণু হলেও $\\text{NH}_3$ একটি পোলার অণু এবং এর অণুসমূহের মধ্যে শক্তিশালী আন্তঃআণবিক আকর্ষণ বল (হাইড্রোজেন বন্ধন) বিদ্যমান থাকে। আকর্ষণ বল যত বেশি হয়, গ্যাসটি আদর্শ আচরণ হতে তত বেশি বিচ্যুত হয়।\n\n---\n### ২.২ সমাধান ও ব্যাখ্যা:\n$\\text{Pb(s)/Pb}^{2+}\\text{(aq)} \\parallel \\text{Ag}^+\\text{(aq)/Ag(s)}$ কোষে লবণ সেতুতে $\\text{K}_2\\text{SO}_4$ এবং $\\text{KCl}$ ব্যবহার করা যাবে না। কারণ:\n* লবণ সেতুতে $\\text{K}_2\\text{SO}_4$ ব্যবহার করলে $\\text{SO}_4^{2-}$ আয়ন অ্যানোড অর্ধকোষের $\\text{Pb}^{2+}$ আয়নের সাথে বিক্রিয়া করে পানিতে অদ্রবণীয় সাদা বর্ণের **$\\text{PbSO}_4$**-এর অধঃক্ষেপ তৈরি করবে।\n* আর $\\text{KCl}$ ব্যবহার করলে $\\text{Cl}^-$ আয়ন উভয় অর্ধকোষের $\\text{Pb}^{2+}$ এবং $\\text{Ag}^+$ আয়নের সাথে বিক্রিয়া করে যথাক্রমে অদ্রবণীয় **$\\text{PbCl}_2$** এবং **$\\text{AgCl}$**-এর সাদা অধঃক্ষেপ তৈরি করবে।\n\nএর ফলে অর্ধকোষে মুক্ত আয়নের ঘনমাত্রা হ্রাস পাবে এবং লবণ সেতুর মুখ বন্ধ হয়ে কোষের তড়িৎ প্রবাহ বন্ধ হয়ে যাবে। (এক্ষেত্রে লবণ সেতুতে $\\text{KNO}_3$ বা $\\text{NH}_4\\text{NO}_3$ ব্যবহার করা উপযুক্ত।)',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 21,
    question_number: 21,
    subject: 'রসায়ন (Chemistry)',
    question:
      '3.1. জালনোট শনাক্তকরণে UV রশ্মির ভূমিকা ব্যাখ্যা কর।\n3.2. এসিড বৃষ্টি সৃষ্টির জন্য দায়ী বিক্রিয়াসমূহ উল্লেখ কর।',
    question_html:
      '<div><p>3.1. জালনোট শনাক্তকরণে UV রশ্মির ভূমিকা ব্যাখ্যা কর।</p><p>3.2. এসিড বৃষ্টি সৃষ্টির জন্য দায়ী বিক্রিয়াসমূহ উল্লেখ কর।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ৩.১ সমাধান ও ব্যাখ্যা:\nআসল ব্যাংক নোটে বিশেষ ধরনের **ফ্লুরোসেন্ট ফসফর (Fluorescent phosphor)** বা অদৃশ্য নিরাপত্তা কালি ও সুতা ব্যবহার করা হয়। এর ওপর নির্দিষ্ট তরঙ্গদৈর্ঘ্যের (প্রায় $230 - 365\\text{ nm}$) অতিবেগুনি রশ্মি (**UV ray**) ফেললে ফসফর অণু UV রশ্মি শোষণ করে উত্তেজিত হয় এবং প্রতিপ্রভা (Fluorescence) প্রক্রিয়ায় দৃশ্যমান আলো বিকিরণ করে উজ্জ্বলভাবে জ্বলে ওঠে। জাল নোটে এই বিশেষ ফসফর কালি না থাকায় UV রশ্মির নিচে কোনো প্রতিপ্রভা দেখা যায় না; ফলে সহজেই জালনোট শনাক্ত করা যায়।\n\n---\n### ৩.২ সমাধান ও ব্যাখ্যা:\nবায়ুমণ্ডলে উপস্থিত $\\text{CO}_2, \\text{SO}_2$ ও $\\text{NO}_x$ গ্যাস বৃষ্টির পানির সাথে বিক্রিয়া করে এসিড বৃষ্টি সৃষ্টি করে:\n1. $\\text{CO}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{H}_2\\text{CO}_3$\n2. $\\text{SO}_2 + \\frac{1}{2}\\text{O}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{H}_2\\text{SO}_4$\n3. $2\\text{NO}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{HNO}_2 + \\text{HNO}_3$\n4. $4\\text{NO}_2 + \\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 4\\text{HNO}_3$',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 22,
    question_number: 22,
    subject: 'রসায়ন (Chemistry)',
    question:
      '4.1. নিম্নের উদ্দীপক থেকে A, B এবং C যৌগগুলো শনাক্ত কর।\n$\\text{CH}_3\\text{COOH} + \\text{NH}_3 \\xrightarrow{\\Delta} \\text{A} \\xrightarrow{\\text{Br}_2 + \\text{NaOH}} \\text{B} \\xrightarrow{\\text{CHCl}_3 + \\text{KOH(alc)}} \\text{C}$\n4.2. অ্যালকোহল ও কার্বক্সিলিক এসিডের মধ্যে পরীক্ষামূলকভাবে কীভাবে পার্থক্য নির্ণয় করা যায় বিক্রিয়াসহ লেখ।',
    question_html:
      '<div><p>4.1. নিম্নের উদ্দীপক থেকে A, B এবং C যৌগগুলো শনাক্ত কর।<br>$\\text{CH}_3\\text{COOH} + \\text{NH}_3 \\xrightarrow{\\Delta} \\text{A} \\xrightarrow{\\text{Br}_2 + \\text{NaOH}} \\text{B} \\xrightarrow{\\text{CHCl}_3 + \\text{KOH(alc)}} \\text{C}$</p><p>4.2. অ্যালকোহল ও কার্বক্সিলিক এসিডের মধ্যে পরীক্ষামূলকভাবে কীভাবে পার্থক্য নির্ণয় করা যায় বিক্রিয়াসহ লেখ।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ৪.১ সমাধান ও ব্যাখ্যা:\nপ্রদত্ত বিক্রিয়া ক্রম:\n$$\\text{CH}_3\\text{COOH} + \\text{NH}_3 \\xrightarrow{\\Delta} \\text{CH}_3\\text{CONH}_2 \\text{ (A)} \\xrightarrow{\\text{Br}_2 + \\text{NaOH}} \\text{CH}_3\\text{NH}_2 \\text{ (B)} \\xrightarrow{\\text{CHCl}_3 + \\text{KOH(alc)}} \\text{CH}_3\\text{NC} \\text{ (C)}$$\n* **A:** $\\text{CH}_3\\text{CONH}_2$ (ইথান্যামাইড বা অ্যাসিট্যামাইড)\n* **B:** $\\text{CH}_3\\text{NH}_2$ (মিথাইল অ্যামিন — হফম্যান ক্ষুদ্রাংশকরণ বিক্রিয়া)\n* **C:** $\\text{CH}_3\\text{NC}$ (মিথাইল আইসোসায়ানাইড বা কার্বিল অ্যামিন)\n\n---\n### ৪.২ সমাধান ও ব্যাখ্যা:\n**সোডিয়াম বাইকার্বনেট ($\\text{NaHCO}_3$) পরীক্ষা:**\nকার্বক্সিলিক এসিডের জলীয় দ্রবণে $5\\%$ $\\text{NaHCO}_3$ দ্রবণ যোগ করলে বুদবুদসহ $\\text{CO}_2$ গ্যাস নির্গত হয় যা চুনের পানিকে ঘোলা করে। কিন্তু অ্যালকোহল $\\text{NaHCO}_3$ দ্রবণের সাথে কোনো বিক্রিয়া করে না।\n\n* $\\text{R-COOH} + \\text{NaHCO}_3 \\rightarrow \\text{R-COONa} + \\text{CO}_2\\uparrow + \\text{H}_2\\text{O}$\n* $\\text{CO}_2 + \\text{Ca(OH)}_2 \\rightarrow \\text{CaCO}_3\\downarrow \\text{ (সাদা অধঃক্ষেপ)} + \\text{H}_2\\text{O}$\n* $\\text{R-OH} + \\text{NaHCO}_3 \\rightarrow \\text{কোনো বিক্রিয়া ঘটে না।}$',
    explanation_html: null,
    explanation_image_urls: [],
  },
];

// ============================================================================
// 3. DU 22-23 WRITTEN (22 Questions)
// ============================================================================
const questions22_23 = [
  // ======================== PHYSICS (1 - 4) ========================
  {
    number: 1,
    question_number: 1,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '1. ভেক্টর $\\vec{a} = \\alpha\\hat{i} + 2\\hat{j} + \\beta\\hat{k}$ ভেক্টর $\\vec{b} = \\hat{i} + \\hat{j}$ এবং ভেক্টর $\\vec{c} = \\hat{j} + \\hat{k}$ এর সাথে সমান কোণ $\\theta$ তৈরি করে এবং তাদের সাথে একই সমতলে অবস্থান করে। $\\alpha$ এবং $\\beta$ এর মান নির্ণয় কর।',
    question_html:
      '<p>1. ভেক্টর $\\vec{a} = \\alpha\\hat{i} + 2\\hat{j} + \\beta\\hat{k}$ ভেক্টর $\\vec{b} = \\hat{i} + \\hat{j}$ এবং ভেক্টর $\\vec{c} = \\hat{j} + \\hat{k}$ এর সাথে সমান কোণ $\\theta$ তৈরি করে এবং তাদের সাথে একই সমতলে অবস্থান করে। $\\alpha$ এবং $\\beta$ এর মান নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n$$\\vec{a} = \\alpha\\hat{i} + 2\\hat{j} + \\beta\\hat{k}, \\quad \\vec{b} = \\hat{i} + \\hat{j}, \\quad \\vec{c} = \\hat{j} + \\hat{k}$$\nএখানে $|\\vec{b}| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$ এবং $|\\vec{c}| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$।\n\n**১ম শর্ত (সমান কোণ $\\theta$):**\n$$\\cos\\theta = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{\\vec{a}\\cdot\\vec{c}}{|\\vec{a}||\\vec{c}|}$$\n$$\\Rightarrow \\frac{\\alpha + 2}{|\\vec{a}|\\sqrt{2}} = \\frac{2 + \\beta}{|\\vec{a}|\\sqrt{2}} \\Rightarrow \\alpha + 2 = 2 + \\beta \\Rightarrow \\alpha = \\beta \\quad \\text{--- (i)}$$\n\n**২য় শর্ত (সমতলীয় হওয়ার শর্ত):**\n$\\vec{a}, \\vec{b}, \\vec{c}$ একই সমতলে অবস্থান করায় এদের বক্স গুণফল শূন্য হবে ($\\vec{a}\\cdot(\\vec{b}\\times\\vec{c}) = 0$):\n$$\\begin{vmatrix} \\alpha & 2 & \\beta \\\\ 1 & 1 & 0 \\\\ 0 & 1 & 1 \\end{vmatrix} = 0$$\n$$\\Rightarrow \\alpha(1 - 0) - 2(1 - 0) + \\beta(1 - 0) = 0$$\n$$\\Rightarrow \\alpha - 2 + \\beta = 0 \\Rightarrow \\alpha + \\beta = 2 \\quad \\text{--- (ii)}$$\n\n(i) ও (ii) নং হতে পাই:\n$$2\\alpha = 2 \\Rightarrow \\alpha = 1 \\text{ এবং } \\beta = 1$$\n\n**উত্তর:** $\\alpha = 1$ এবং $\\beta = 1$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 2,
    question_number: 2,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '2. নিচের বর্তনীতে $E = 9\\text{ V}, R_0 = 2\\,\\Omega, R_1 = 6\\,\\Omega, R_2 = 4\\,\\Omega, R_3 = 8\\,\\Omega$ হলে, বর্তনীতে বিদ্যুৎ প্রবাহ $i_0, i_1$ এবং $i_{23}$ কত হবে?\n![বর্তনী চিত্র](/assets/imported/du_22_23_written_4707d3661104dec8.png)',
    question_html:
      '<p>2. নিচের বর্তনীতে $E = 9\\text{ V}, R_0 = 2\\,\\Omega, R_1 = 6\\,\\Omega, R_2 = 4\\,\\Omega, R_3 = 8\\,\\Omega$ হলে, বর্তনীতে বিদ্যুৎ প্রবাহ $i_0, i_1$ এবং $i_{23}$ কত হবে?</p><p><img src="/assets/imported/du_22_23_written_4707d3661104dec8.png" alt="বর্তনী চিত্র" /></p>',
    question_image_urls: ['/assets/imported/du_22_23_written_4707d3661104dec8.png'],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত বর্তনী চিত্র হতে:\n* $R_2 = 4\\,\\Omega$ এবং $R_3 = 8\\,\\Omega$ শ্রেণি সমবায়ে যুক্ত:\n  $$R_{23} = R_2 + R_3 = 4 + 8 = 12\\,\\Omega$$\n* $R_{23} = 12\\,\\Omega$ এবং $R_1 = 6\\,\\Omega$ পরস্পর সমান্তরাল সমবায়ে যুক্ত:\n  $$R_p = \\frac{R_1 \\times R_{23}}{R_1 + R_{23}} = \\frac{6 \\times 12}{6 + 12} = \\frac{72}{18} = 4\\,\\Omega$$\n* এখন $R_0 = 2\\,\\Omega$ এই সমান্তরাল সমবায়ের সাথে শ্রেণিতে যুক্ত, তাই বর্তনীর মোট তুল্য রোধ:\n  $$R_{\\text{eq}} = R_0 + R_p = 2 + 4 = 6\\,\\Omega$$\n\n**১. মূল প্রবাহ $i_0$:**\n$$i_0 = \\frac{E}{R_{\\text{eq}}} = \\frac{9}{6} = 1.5\\text{ A}$$\n\n**২. $R_1$ শাখার প্রবাহ $i_1$ (প্রবাহ বিভাজন সূত্র হতে):**\n$$i_1 = \\frac{R_{23}}{R_1 + R_{23}} \\times i_0 = \\frac{12}{6 + 12} \\times 1.5 = \\frac{2}{3} \\times 1.5 = 1.0\\text{ A}$$\n\n**৩. $R_2$ ও $R_3$ শাখার প্রবাহ $i_{23}$:**\n$$i_{23} = i_0 - i_1 = 1.5 - 1.0 = 0.5\\text{ A}$$\n\n**উত্তর:** $i_0 = 1.5\\text{ A}, \\; i_1 = 1.0\\text{ A}$ এবং $i_{23} = 0.5\\text{ A}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 3,
    question_number: 3,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '3. একটি গতিশীল মিটার স্কেলের দৈর্ঘ্য $60\\text{ cm}$ ও ভরবেগ $8\\text{ J}/c$। এর আপেক্ষিক শক্তি নির্ণয় কর। ($c$ = শূন্য মাধ্যমে আলোর বেগ)',
    question_html:
      '<p>3. একটি গতিশীল মিটার স্কেলের দৈর্ঘ্য $60\\text{ cm}$ ও ভরবেগ $8\\text{ J}/c$। এর আপেক্ষিক শক্তি নির্ণয় কর। ($c$ = শূন্য মাধ্যমে আলোর বেগ)</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* মিটার স্কেলের নিশ্চল দৈর্ঘ্য, $L_0 = 1\\text{ m} = 100\\text{ cm}$\n* গতিশীল অবস্থায় দৈর্ঘ্য, $L = 60\\text{ cm}$\n* ভরবেগ, $p = 8\\text{ J}/c \\Rightarrow pc = 8\\text{ J}$\n\nদৈর্ঘ্য সংকোচনের সূত্র হতে:\n$$L = L_0 \\sqrt{1 - \\frac{v^2}{c^2}}$$\n$$\\Rightarrow \\sqrt{1 - \\frac{v^2}{c^2}} = \\frac{L}{L_0} = \\frac{60}{100} = 0.6$$\n$$\\Rightarrow 1 - \\frac{v^2}{c^2} = (0.6)^2 = 0.36 \\Rightarrow \\frac{v^2}{c^2} = 1 - 0.36 = 0.64 \\Rightarrow \\frac{v}{c} = 0.8$$\n\nআবার, আপেক্ষিক মোট শক্তি $E$ এবং ভরবেগ $p$-এর সম্পর্ক $p = \\frac{Ev}{c^2} \\Rightarrow pc = E\\left(\\frac{v}{c}\\right)$ হতে পাই:\n$$E = \\frac{pc}{v/c} = \\frac{8\\text{ J}}{0.8} = 10\\text{ J}$$\n\n*(এছাড়া নিশ্চল শক্তি $E_0 = \\sqrt{E^2 - (pc)^2} = \\sqrt{10^2 - 8^2} = 6\\text{ J}$ এবং আপেক্ষিক গতিশক্তি $E_k = E - E_0 = 10 - 6 = 4\\text{ J}$।)*\n\n**উত্তর:** মিটার স্কেলটির মোট আপেক্ষিক শক্তি $10\\text{ J}$ (এবং গতিশক্তি $4\\text{ J}$)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 4,
    question_number: 4,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '4. সরল ছন্দিত গতিসম্পন্ন কণার ব্যবকলনীয় সমীকরণটি লিখ এবং দেখাও যে $x = A\\sin(\\omega t + \\varphi)$ উক্ত সমীকরণের একটি সমাধান। (প্রতীকগুলো প্রচলিত অর্থ বহন করে।)',
    question_html:
      '<p>4. সরল ছন্দিত গতিসম্পন্ন কণার ব্যবকলনীয় সমীকরণটি লিখ এবং দেখাও যে $x = A\\sin(\\omega t + \\varphi)$ উক্ত সমীকরণের একটি সমাধান। (প্রতীকগুলো প্রচলিত অর্থ বহন করে।)</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**সরল ছন্দিত গতিসম্পন্ন কণার ব্যবকলনীয় সমীকরণ:**\n$$\\frac{d^2x}{dt^2} + \\omega^2 x = 0 \\quad \\text{--- (i)}$$\n\n**প্রমাণ:**\nদেওয়া আছে,\n$$x = A\\sin(\\omega t + \\varphi)$$\nসময় $t$-এর সাপেক্ষে অন্তরীকরণ করে বেগ পাই:\n$$\\frac{dx}{dt} = \\frac{d}{dt}[A\\sin(\\omega t + \\varphi)] = \\omega A\\cos(\\omega t + \\varphi)$$\nপুনরায় $t$-এর সাপেক্ষে অন্তরীকরণ করে ত্বরণ পাই:\n$$\\frac{d^2x}{dt^2} = \\frac{d}{dt}[\\omega A\\cos(\\omega t + \\varphi)] = -\\omega^2 A\\sin(\\omega t + \\varphi) = -\\omega^2 x$$\n$$\\therefore \\frac{d^2x}{dt^2} + \\omega^2 x = 0$$\n\nঅতএব, $x = A\\sin(\\omega t + \\varphi)$ সরল ছন্দিত গতির ব্যবকলনীয় সমীকরণের একটি সমাধান (দেখানো হলো)।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== CHEMISTRY (5 - 8) ========================
  {
    number: 5,
    question_number: 5,
    subject: 'রসায়ন (Chemistry)',
    question:
      '1. (a) উদাহরণসহ অনুবন্ধী অম্ল ও ক্ষারক বলতে কী বুঝায় লিখ।\n(b) পানির বিশুদ্ধতার তিনটি মানদণ্ড লিখ।',
    question_html:
      '<div><p>1. (a) উদাহরণসহ অনুবন্ধী অম্ল ও ক্ষারক বলতে কী বুঝায় লিখ।</p><p>(b) পানির বিশুদ্ধতার তিনটি মানদণ্ড লিখ।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**(a) অনুবন্ধী অম্ল ও ক্ষারক:**\n* **অনুবন্ধী অম্ল (Conjugate Acid):** ব্রনস্টেড-লাউরি মতবাদ অনুসারে, কোনো ক্ষারক একটি প্রোটন ($\\text{H}^+$) গ্রহণ করার পর যে অম্লীয় সত্তায় পরিণত হয়, তাকে ঐ ক্ষারকের অনুবন্ধী অম্ল বলে।\n* **অনুবন্ধী ক্ষারক (Conjugate Base):** কোনো অম্ল একটি প্রোটন ($\\text{H}^+$) ত্যাগ করার পর যে ক্ষারকীয় সত্তায় পরিণত হয়, তাকে ঐ অম্লের অনুবন্ধী ক্ষারক বলে।\n* **উদাহরণ:**\n  $$\\text{CH}_3\\text{COOH (অম্ল)} + \\text{H}_2\\text{O (ক্ষারক)} \\rightleftharpoons \\text{CH}_3\\text{COO}^- \\text{ (অনুবন্ধী ক্ষারক)} + \\text{H}_3\\text{O}^+ \\text{ (অনুবন্ধী অম্ল)}$$\n\n---\n**(b) পানির বিশুদ্ধতার তিনটি মানদণ্ড:**\n১. **pH মান:** বিশুদ্ধ ও পানযোগ্য পানির আদর্শ pH মান $6.5 - 8.5$।\n২. **দ্রবীভূত অক্সিজেন (DO):** বিশুদ্ধ পানিতে DO এর মান $4.0 - 6.0\\text{ ppm}$ (বা $\\text{mg/L}$) হওয়া প্রয়োজন।\n৩. **BOD ও খরতা:** বিশুদ্ধ পানিতে BOD এর মান কম ($1 - 3\\text{ ppm}$) এবং পানি বর্ণহীন, গন্ধহীন ও রোগজীবাণুমুক্ত হওয়া আবশ্যক।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 6,
    question_number: 6,
    subject: 'রসায়ন (Chemistry)',
    question:
      '2. বাফার দ্রবণ কী? সমমোলার $\\text{CH}_3\\text{COOH}$ এবং $\\text{CH}_3\\text{COONa}$ এর জলীয় দ্রবণ কিভাবে বাফার হিসেবে কাজ করে তার কৌশল লিখ। এ দ্রবণের pH গণনার জন্য হেন্ডারসন-হ্যাসেলবাখ সমীকরণটি লিখ।',
    question_html:
      '<p>2. বাফার দ্রবণ কী? সমমোলার $\\text{CH}_3\\text{COOH}$ এবং $\\text{CH}_3\\text{COONa}$ এর জলীয় দ্রবণ কিভাবে বাফার হিসেবে কাজ করে তার কৌশল লিখ। এ দ্রবণের pH গণনার জন্য হেন্ডারসন-হ্যাসেলবাখ সমীকরণটি লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**বাফার দ্রবণ:** যে দ্রবণে বাইরে থেকে সামান্য পরিমাণ তীব্র অম্ল বা তীব্র ক্ষার যোগ করলেও দ্রবণের pH মানের তেমন কোনো পরিবর্তন ঘটে না, তাকে বাফার দ্রবণ বলে।\n\n**বাফার ক্রিয়া কৌশল:**\nজলীয় দ্রবণে মৃদু অম্ল $\\text{CH}_3\\text{COOH}$ আংশিক এবং সবল তড়িৎ বিশ্লেষ্য লবণ $\\text{CH}_3\\text{COONa}$ সম্পূর্ণরূপে বিয়োজিত থাকে:\n$$\\text{CH}_3\\text{COOH(aq)} \\rightleftharpoons \\text{CH}_3\\text{COO}^-\\text{(aq)} + \\text{H}^+\\text{(aq)}$$\n$$\\text{CH}_3\\text{COONa(aq)} \\rightarrow \\text{CH}_3\\text{COO}^-\\text{(aq)} + \\text{Na}^+\\text{(aq)}$$\n\n১. **অম্ল ($\\text{H}^+$) যোগ করলে:** যোগকৃত $\\text{H}^+$ আয়ন দ্রবণের পর্যাপ্ত $\\text{CH}_3\\text{COO}^-$ আয়নের সাথে যুক্ত হয়ে অবিয়োজিত মৃদু অম্ল $\\text{CH}_3\\text{COOH}$ গঠন করে:\n$$\\text{CH}_3\\text{COO}^- + \\text{H}^+ \\rightleftharpoons \\text{CH}_3\\text{COOH}$$\n২. **ক্ষার ($\\text{OH}^-$) যোগ করলে:** যোগকৃত $\\text{OH}^-$ আয়ন দ্রবণের $\\text{H}^+$ আয়নের সাথে যুক্ত হয়ে পানি উৎপন্ন করে এবং ঘাটতি পূরণে $\\text{CH}_3\\text{COOH}$ আরও বিয়োজিত হয়:\n$$\\text{CH}_3\\text{COOH} + \\text{OH}^- \\rightarrow \\text{CH}_3\\text{COO}^- + \\text{H}_2\\text{O}$$\nফলে উভয় ক্ষেত্রেই দ্রবণের pH অপরিবর্তিত থাকে।\n\n**হেন্ডারসন-হ্যাসেলবাখ সমীকরণ:**\n$$\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{CH}_3\\text{COONa}]}{[\\text{CH}_3\\text{COOH}]}$$\n*(সমমোলার দ্রবণের ক্ষেত্রে $[\\text{CH}_3\\text{COONa}] = [\\text{CH}_3\\text{COOH}]$ হওয়ায় $\\text{pH} = \\text{pK}_a$।)*',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 7,
    question_number: 7,
    subject: 'রসায়ন (Chemistry)',
    question:
      '3. (a) প্রশ্নবোধক চিহ্নের জায়গায় উপযুক্ত যৌগ/বিকারক বসিয়ে নিচের বিক্রিয়াটির শূন্যস্থান পূরণ কর:\n$\\text{C}_6\\text{H}_6 \\xrightarrow{?} \\text{C}_6\\text{H}_5\\text{NO}_2 \\xrightarrow{\\text{Sn+HCl}} ? \\xrightarrow{\\text{NaNO}_2, \\text{HCl}, 0^\\circ\\text{C}} ? \\xrightarrow{?} \\text{C}_6\\text{H}_5\\text{OH}$\n(b) $\\text{S}_\\text{N}1$ এবং $\\text{S}_\\text{N}2$ বিক্রিয়া বলতে কী বুঝ?',
    question_html:
      '<div><p>3. (a) প্রশ্নবোধক চিহ্নের জায়গায় উপযুক্ত যৌগ/বিকারক বসিয়ে নিচের বিক্রিয়াটির শূন্যস্থান পূরণ কর:<br>$\\text{C}_6\\text{H}_6 \\xrightarrow{?} \\text{C}_6\\text{H}_5\\text{NO}_2 \\xrightarrow{\\text{Sn+HCl}} ? \\xrightarrow{\\text{NaNO}_2, \\text{HCl}, 0^\\circ\\text{C}} ? \\xrightarrow{?} \\text{C}_6\\text{H}_5\\text{OH}$</p><p>(b) $\\text{S}_\\text{N}1$ এবং $\\text{S}_\\text{N}2$ বিক্রিয়া বলতে কী বুঝ?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**(a) সম্পূর্ণ বিক্রিয়া ক্রম:**\n$$\\text{C}_6\\text{H}_6 \\xrightarrow{\\text{গাঢ় HNO}_3 + \\text{গাঢ় H}_2\\text{SO}_4,\\; 60^\\circ\\text{C}} \\text{C}_6\\text{H}_5\\text{NO}_2 \\xrightarrow{\\text{Sn+HCl}} \\mathbf{\\text{C}_6\\text{H}_5\\text{NH}_2} \\xrightarrow{\\text{NaNO}_2, \\text{HCl}, 0^\\circ\\text{C}} \\mathbf{\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-} \\xrightarrow{\\mathbf{\\text{H}_2\\text{O},\\; \\Delta}} \\text{C}_6\\text{H}_5\\text{OH}$$\n* ১ম `?`: গাঢ় $\\text{HNO}_3$ + গাঢ় $\\text{H}_2\\text{SO}_4$, $60^\\circ\\text{C}$\n* ২য় `?`: $\\text{C}_6\\text{H}_5\\text{NH}_2$ (অ্যানিলিন)\n* ৩য় `?`: $\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^-$ (বেনজিন ডায়াজোনিয়াম ক্লোরাইড)\n* ৪র্থ `?`: $\\text{H}_2\\text{O}$, তাপ ($\\Delta$)\n\n---\n**(b) $\\text{S}_\\text{N}1$ ও $\\text{S}_\\text{N}2$ বিক্রিয়া:**\n* **$\\text{S}_\\text{N}1$ বিক্রিয়া (এক-আণবিক কেন্দ্রাকর্ষী প্রতিস্থাপন):** যে কেন্দ্রাকর্ষী প্রতিস্থাপন বিক্রিয়া দুই ধাপে সম্পন্ন হয় (১ম ধাপে কার্বোক্যাটায়ন গঠন এবং ২য় ধাপে নিউক্লিওফাইলের আক্রমণ) এবং যার হার কেবল সাবস্ট্রেট (যেমন $3^\\circ$ অ্যালকাইল হ্যালাইড)-এর ঘনমাত্রার ওপর নির্ভর করে, তাকে $\\text{S}_\\text{N}1$ বিক্রিয়া বলে।\n* **$\\text{S}_\\text{N}2$ বিক্রিয়া (দ্বি-আণবিক কেন্দ্রাকর্ষী প্রতিস্থাপন):** যে কেন্দ্রাকর্ষী প্রতিস্থাপন বিক্রিয়া অবস্থান্তর অবস্থার মাধ্যমে এক ধাপে সম্পন্ন হয় এবং যার হার সাবস্ট্রেট (যেমন $1^\\circ$ অ্যালকাইল হ্যালাইড) ও নিউক্লিওফাইল উভয়ের ঘনমাত্রার ওপর নির্ভর করে, তাকে $\\text{S}_\\text{N}2$ বিক্রিয়া বলে।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 8,
    question_number: 8,
    subject: 'রসায়ন (Chemistry)',
    question:
      '4. (a) জ্যামিতিক সমাণুতা প্রদর্শনের শর্ত কী কী? 2-বিউটিনের জ্যামিতিক সমাণুগুলোর গাঠনিক সংকেত আঁক।\n(b) আন্তঃআণবিক এবং অন্তঃআণবিক হাইড্রোজেন বন্ধনের উদাহরণ দাও।',
    question_html:
      '<div><p>4. (a) জ্যামিতিক সমাণুতা প্রদর্শনের শর্ত কী কী? 2-বিউটিনের জ্যামিতিক সমাণুগুলোর গাঠনিক সংকেত আঁক।</p><p>(b) আন্তঃআণবিক এবং অন্তঃআণবিক হাইড্রোজেন বন্ধনের উদাহরণ দাও।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**(a) জ্যামিতিক সমাণুতার শর্তাবলি:**\n১. যৌগে কার্বন-কার্বন দ্বিবন্ধন ($\\text{C=C}$) বা চাক্রিক কাঠামোর কারণে মুক্ত ঘূর্ণন রহিত (Restricted rotation) হতে হবে।\n২. দ্বিবন্ধনযুক্ত প্রতিটি কার্বন পরমাণুর সাথে যুক্ত দুটি করে পরমাণু বা মূলক পরস্পর ভিন্ন হতে হবে (যেমন $ab\\text{C=C}ab$ বা $ab\\text{C=C}cd$, যেখানে $a \\ne b$)।\n\n**2-বিউটিন ($\\text{CH}_3-\\text{CH=CH}-\\text{CH}_3$)-এর জ্যামিতিক সমাণুদ্বয়:**\n* **সিস-2-বিউটিন (cis-2-butene):** একই পাশে দুটি $-\\text{CH}_3$ মূলক এবং একই পাশে দুটি $-\\text{H}$ পরমাণু যুক্ত থাকে।\n* **ট্রান্স-2-বিউটিন (trans-2-butene):** বিপরীত পাশে (কর্ণ বরাবর) দুটি $-\\text{CH}_3$ মূলক এবং বিপরীত পাশে দুটি $-\\text{H}$ পরমাণু যুক্ত থাকে।\n\n---\n**(b) হাইড্রোজেন বন্ধনের উদাহরণ:**\n* **আন্তঃআণবিক হাইড্রোজেন বন্ধন:** পানি ($\\text{H}_2\\text{O}$), হাইড্রোজেন ফ্লোরাইড ($\\text{HF}$), অ্যামোনিয়া ($\\text{NH}_3$), ইথানল বা *প্যারা*-নাইট্রোফেনল।\n* **অন্তঃআণবিক হাইড্রোজেন বন্ধন:** *অর্থো*-নাইট্রোফেনল, স্যালিসাইলিক এসিড বা *অর্থো*-হাইড্রক্সিবেনজালডিহাইড।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== MATHEMATICS (9 - 12) ========================
  {
    number: 9,
    question_number: 9,
    subject: 'গণিত (Mathematics)',
    question: '1. $p$ এর মান কত হলে $(4, 4)$ বিন্দুটি $x^2 - 8x + py + 7 = 0$ পরাবৃত্তের উপকেন্দ্র হবে?',
    question_html: '<p>1. $p$ এর মান কত হলে $(4, 4)$ বিন্দুটি $x^2 - 8x + py + 7 = 0$ পরাবৃত্তের উপকেন্দ্র হবে?</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত পরাবৃত্তের সমীকরণ:\n$$x^2 - 8x + py + 7 = 0$$\n$$\\Rightarrow (x - 4)^2 - 16 + py + 7 = 0$$\n$$\\Rightarrow (x - 4)^2 = -py + 9 = -p\\left(y - \\frac{9}{p}\\right)$$\n\nইহাকে আদর্শ সমীকরণ $(x - h)^2 = 4a(y - k)$ এর সাথে তুলনা করে পাই:\n* শীর্ষবিন্দু $(h, k) = \\left(4, \\frac{9}{p}\\right)$\n* $4a = -p \\Rightarrow a = -\\frac{p}{4}$\n\nঅতএব পরাবৃত্তটির উপকেন্দ্রের স্থানাঙ্ক:\n$$(h, k + a) = \\left(4, \\frac{9}{p} - \\frac{p}{4}\\right)$$\n\nপ্রশ্নমতে, উপকেন্দ্র $(4, 4)$:\n$$\\frac{9}{p} - \\frac{p}{4} = 4$$\n$$\\Rightarrow 36 - p^2 = 16p \\Rightarrow p^2 + 16p - 36 = 0$$\n$$\\Rightarrow (p + 18)(p - 2) = 0$$\n$$\\therefore p = 2 \\text{ অথবা } p = -18$$\n\n**উত্তর:** $p = 2, -18$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 10,
    question_number: 10,
    subject: 'গণিত (Mathematics)',
    question:
      '2. যদি $y = \\cos x \\ln\\left(\\frac{1}{\\sec x + \\tan x}\\right)$ হয় তবে $\\frac{d^2y}{dx^2} + y$ এর মান নির্ণয় কর।',
    question_html:
      '<p>2. যদি $y = \\cos x \\ln\\left(\\frac{1}{\\sec x + \\tan x}\\right)$ হয় তবে $\\frac{d^2y}{dx^2} + y$ এর মান নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n$$y = \\cos x \\ln\\left(\\frac{1}{\\sec x + \\tan x}\\right) = -\\cos x \\ln(\\sec x + \\tan x)$$\n\n$x$-এর সাপেক্ষে ১ম বার অন্তরীকরণ করে পাই:\n$$\\frac{dy}{dx} = \\sin x \\ln(\\sec x + \\tan x) - \\cos x \\cdot \\frac{\\sec x \\tan x + \\sec^2 x}{\\sec x + \\tan x}$$\n$$\\Rightarrow \\frac{dy}{dx} = \\sin x \\ln(\\sec x + \\tan x) - \\cos x \\cdot \\sec x = \\sin x \\ln(\\sec x + \\tan x) - 1$$\n\nপুনরায় $x$-এর সাপেক্ষে অন্তরীকরণ করে পাই:\n$$\\frac{d^2y}{dx^2} = \\cos x \\ln(\\sec x + \\tan x) + \\sin x \\cdot \\sec x - 0$$\n$$\\Rightarrow \\frac{d^2y}{dx^2} = -y + \\tan x$$\n$$\\therefore \\frac{d^2y}{dx^2} + y = \\tan x$$\n\n**উত্তর:** $\\frac{d^2y}{dx^2} + y = \\tan x$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 11,
    question_number: 11,
    subject: 'গণিত (Mathematics)',
    question:
      '3. যদি $3x^2 - 6x + 2 = 0$ সমীকরণের মূলদ্বয় $m$ ও $n$ হয়, তবে $m + \\frac{1}{n}$ এবং $n + \\frac{1}{m}$ মূলবিশিষ্ট সমীকরণটি নির্ণয় কর।',
    question_html:
      '<p>3. যদি $3x^2 - 6x + 2 = 0$ সমীকরণের মূলদ্বয় $m$ ও $n$ হয়, তবে $m + \\frac{1}{n}$ এবং $n + \\frac{1}{m}$ মূলবিশিষ্ট সমীকরণটি নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত সমীকরণ $3x^2 - 6x + 2 = 0$ এর মূলদ্বয় $m$ ও $n$ হওয়ায়:\n* মূলদ্বয়ের যোগফল: $m + n = -\\frac{-6}{3} = 2$\n* মূলদ্বয়ের গুণফল: $mn = \\frac{2}{3}$\n\nনতুন সমীকরণের মূলদ্বয় $m + \\frac{1}{n}$ এবং $n + \\frac{1}{m}$:\n* **মূলদ্বয়ের যোগফল ($S$):**\n  $$S = \\left(m + \\frac{1}{n}\\right) + \\left(n + \\frac{1}{m}\\right) = (m + n) + \\frac{m + n}{mn} = 2 + \\frac{2}{2/3} = 2 + 3 = 5$$\n* **মূলদ্বয়ের গুণফল ($P$):**\n  $$P = \\left(m + \\frac{1}{n}\\right)\\left(n + \\frac{1}{m}\\right) = mn + 1 + 1 + \\frac{1}{mn} = \\frac{2}{3} + 2 + \\frac{3}{2} = \\frac{4 + 12 + 9}{6} = \\frac{25}{6}$$\n\nসুতরাং নির্ণেয় সমীকরণ:\n$$x^2 - Sx + P = 0$$\n$$\\Rightarrow x^2 - 5x + \\frac{25}{6} = 0$$\n$$\\Rightarrow 6x^2 - 30x + 25 = 0$$\n\n**উত্তর:** নির্ণেয় সমীকরণ $6x^2 - 30x + 25 = 0$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 12,
    question_number: 12,
    subject: 'গণিত (Mathematics)',
    question:
      '4. যদি $a\\cos\\alpha + b\\sin\\alpha = a\\cos\\beta + b\\sin\\beta$ হয়, তবে দেখাও যে $\\cos^2\\frac{\\alpha + \\beta}{2} - \\sin^2\\frac{\\alpha + \\beta}{2} = \\frac{a^2 - b^2}{a^2 + b^2}$।',
    question_html:
      '<p>4. যদি $a\\cos\\alpha + b\\sin\\alpha = a\\cos\\beta + b\\sin\\beta$ হয়, তবে দেখাও যে $\\cos^2\\frac{\\alpha + \\beta}{2} - \\sin^2\\frac{\\alpha + \\beta}{2} = \\frac{a^2 - b^2}{a^2 + b^2}$।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n$$a\\cos\\alpha + b\\sin\\alpha = a\\cos\\beta + b\\sin\\beta$$\n$$\\Rightarrow a(\\cos\\alpha - \\cos\\beta) = -b(\\sin\\alpha - \\sin\\beta)$$\n$$\\Rightarrow a\\left(-2\\sin\\frac{\\alpha + \\beta}{2}\\sin\\frac{\\alpha - \\beta}{2}\\right) = -b\\left(2\\cos\\frac{\\alpha + \\beta}{2}\\sin\\frac{\\alpha - \\beta}{2}\\right)$$\n\nউভয় পক্ষকে $-2\\sin\\frac{\\alpha - \\beta}{2}$ দ্বারা ভাগ করে পাই ($\\alpha \\ne \\beta$):\n$$a\\sin\\frac{\\alpha + \\beta}{2} = b\\cos\\frac{\\alpha + \\beta}{2}$$\n$$\\Rightarrow \\tan\\frac{\\alpha + \\beta}{2} = \\frac{b}{a}$$\n\nএখন বামপক্ষ:\n$$\\cos^2\\frac{\\alpha + \\beta}{2} - \\sin^2\\frac{\\alpha + \\beta}{2} = \\frac{1 - \\tan^2\\frac{\\alpha + \\beta}{2}}{1 + \\tan^2\\frac{\\alpha + \\beta}{2}} = \\frac{1 - \\frac{b^2}{a^2}}{1 + \\frac{b^2}{a^2}} = \\frac{a^2 - b^2}{a^2 + b^2} \\quad \\text{(দেখানো হলো)}$$',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BIOLOGY (13 - 16) ========================
  {
    number: 13,
    question_number: 13,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '1. পোয়েসি (Poaceae) গোত্রের পাঁচটি শনাক্তকারী বৈশিষ্ট্য লিখ।',
    question_html: '<p>1. পোয়েসি (Poaceae) গোত্রের পাঁচটি শনাক্তকারী বৈশিষ্ট্য লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**পোয়েসি (Poaceae) গোত্রের পাঁচটি শনাক্তকারী বৈশিষ্ট্য নিচে দেওয়া হলো:**\n১. কাণ্ড সাধারণত নলাকার এবং মধ্যপর্ব ফাঁপা (**কাল্ম / Culm**)।\n২. পাতা একান্তর, সরল, সমান্তরাল শিরাবিন্যাসযুক্ত এবং পাতার গোড়ায় কাণ্ডবেষ্টক **লিগিউল (Ligule)** যুক্ত পত্রমূল থাকে।\n৩. পুষ্পবিন্যাস বিশেষ ধরনের **স্পাইকলেট (Spikelet)** প্রকৃতির।\n৪. পরাগধানী **সর্বমুখ (Versatile)** এবং গর্ভমুণ্ড **পালকাকার (Feathery)**।\n৫. ফল **ক্যারিওপসিস (Caryopsis)** জাতীয় (যেখানে ফলত্বক ও বীজত্বক অবিচ্ছেদ্যভাবে যুক্ত থাকে)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 14,
    question_number: 14,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '2. ভাজক কলা ও স্থায়ী কলার মধ্যে পাঁচটি প্রধান পার্থক্য লিখ।',
    question_html: '<p>2. ভাজক কলা ও স্থায়ী কলার মধ্যে পাঁচটি প্রধান পার্থক্য লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nভাজক কলা ও স্থায়ী কলার মধ্যে পাঁচটি প্রধান পার্থক্য নিচে দেওয়া হলো:\n\n| পার্থক্যের বিষয় | ভাজক কলা (Meristematic Tissue) | স্থায়ী কলা (Permanent Tissue) |\n| --- | --- | --- |\n| ১. বিভাজন ক্ষমতা | কোষগুলো সর্বদা বিভাজনে সক্ষম। | কোষগুলো সাধারণত বিভাজনে অক্ষম। |\n| ২. কোষগহ্বর | কোষে সাধারণত কোষগহ্বর থাকে না। | কোষে বড় কেন্দ্রীয় কোষগহ্বর থাকে। |\n| ৩. আন্তঃকোষীয় ফাঁক | কোষগুলোর মাঝে কোনো আন্তঃকোষীয় ফাঁক থাকে না। | কোষগুলোর মাঝে সাধারণত আন্তঃকোষীয় ফাঁক থাকে। |\n| ৪. কোষপ্রাচীর | কোষপ্রাচীর পাতলা ও সেলুলোজ নির্মিত। | কোষপ্রাচীর অপেক্ষাকৃত পুরু (লিগনিন/পেকটিনযুক্ত)। |\n| ৫. নিউক্লিয়াস ও বিপাক | নিউক্লিয়াস আকারে বড় ও কেন্দ্রে অবস্থিত এবং বিপাকীয় হার বেশি। | নিউক্লিয়াস ছোট ও একপাশে অবস্থিত এবং বিপাকীয় হার কম। |',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 15,
    question_number: 15,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '3. হার্ট অ্যাটাকের পাঁচটি লক্ষণ লিখ।',
    question_html: '<p>3. হার্ট অ্যাটাকের পাঁচটি লক্ষণ লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**হার্ট অ্যাটাক (Myocardial Infarction)-এর পাঁচটি প্রধান লক্ষণ নিচে দেওয়া হলো:**\n১. বুকের মাঝখানে তীব্র চাপ, জ্বালাপোড়া বা অসহ্য ব্যথা অনুভূত হওয়া।\n২. বুকের ব্যথা বাম বাহু, কাঁধ, ঘাড়, চোয়াল বা পিঠের দিকে ছড়িয়ে পড়া।\n৩. ঘন ঘন শ্বাসকষ্ট বা দম বন্ধ হয়ে আসার অনুভূতি হওয়া।\n৪. শরীর থেকে অতিরিক্ত ঠান্ডা ঘাম নির্গত হওয়া।\n৫. মাথা ঘোরা, বমি বমি ভাব বা হঠাৎ তীব্র দুর্বলতা ও অস্থিরতা অনুভব করা।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 16,
    question_number: 16,
    subject: 'জীববিজ্ঞান (Biology)',
    question:
      '4. নিচের প্রাণীগুলোর বৈজ্ঞানিক নাম লিখ:\n(a) গৃহ মাছি\n(b) গোলকৃমি\n(c) রুই মাছ\n(d) দোয়েল\n(e) গোখরা সাপ',
    question_html:
      '<p>4. নিচের প্রাণীগুলোর বৈজ্ঞানিক নাম লিখ:<br>(a) গৃহ মাছি<br>(b) গোলকৃমি<br>(c) রুই মাছ<br>(d) দোয়েল<br>(e) গোখরা সাপ</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত প্রাণীগুলোর বৈজ্ঞানিক নাম নিচে দেওয়া হলো:\n* **(a) গৃহ মাছি:** *Musca domestica*\n* **(b) গোলকৃমি:** *Ascaris lumbricoides*\n* **(c) রুই মাছ:** *Labeo rohita*\n* **(d) দোয়েল:** *Copsychus saularis*\n* **(e) গোখরা সাপ:** *Naja naja*',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BANGLA (17 - 19) ========================
  {
    number: 17,
    question_number: 17,
    subject: 'বাংলা (Bangla)',
    question: '1. নিচের শব্দগুলো দিয়ে বাক্য রচনা কর: পাণ্ডুর; তপোবন; মহাকাল; সাম্যবাদ; কিংবদন্তি।',
    question_html: '<p>1. নিচের শব্দগুলো দিয়ে বাক্য রচনা কর: পাণ্ডুর; তপোবন; মহাকাল; সাম্যবাদ; কিংবদন্তি।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n* **পাণ্ডুর (ফ্যাকাশে / বিবর্ণ):** দীর্ঘদিন কঠিন রোগে ভুগে তার মুখখানা **পাণ্ডুর** হয়ে গেছে।\n* **তপোবন (ঋষিদের আশ্রম বা তপস্যার বন):** প্রাচীন ভারতের **তপোবন**গুলো ছিল জ্ঞানচর্চা ও প্রশান্তির পবিত্র তীর্থস্থান।\n* **মহাকাল (অনন্তকাল / চিরকাল):** রবীন্দ্রনাথের অমর সৃষ্টি **মহাকালের** বুকে চিরদিন অম্লান হয়ে থাকবে।\n* **সাম্যবাদ (সকল মানুষের সমান অধিকারের মতবাদ):** কাজী নজরুল ইসলাম তাঁর কবিতায় শোষণমুক্ত সমাজ ও **সাম্যবাদের** জয়গান গেয়েছেন।\n* **কিংবদন্তি (জনশ্রুতি / লোকপ্রসিদ্ধ ব্যক্তি):** জয়নুল আবেদিন বাংলাদেশের চিত্রকলা জগতের এক অমর **কিংবদন্তি**।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 18,
    question_number: 18,
    subject: 'বাংলা (Bangla)',
    question: "2. 'প্লাস্টিক দূষণ' বিষয়ে পাঁচটি বাক্যে একটি অনুচ্ছেদ রচনা কর।",
    question_html: "<p>2. 'প্লাস্টিক দূষণ' বিষয়ে পাঁচটি বাক্যে একটি অনুচ্ছেদ রচনা কর।</p>",
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**প্লাস্টিক দূষণ:**\n১. পরিবেশে অপচনশীল প্লাস্টিকজাত বর্জ্যের অনিয়ন্ত্রিত জমে থাকা এবং তার ফলে মাটি, পানি ও জীববৈচিত্র্যের মারাত্মক ক্ষতিসাধনকেই প্লাস্টিক দূষণ বলে।\n২. প্লাস্টিক শত শত বছরেও মাটিতে পচে না যাওয়ায় তা জমির উর্বরতা নষ্ট করে এবং পয়ঃনিষ্কাশন নালা বন্ধ করে শহরে জলাবদ্ধতা সৃষ্টি করে।\n৩. নদী ও সমুদ্রে নিক্ষিপ্ত প্লাস্টিক বর্জ্য জলজ প্রাণী ও মাছের দেহে মাইক্রোপ্লাস্টিক হিসেবে প্রবেশ করে পুরো খাদ্যশৃঙ্খলকে বিষাক্ত করে তুলছে।\n৪. প্লাস্টিক পোড়ানোর ফলে নির্গত বিষাক্ত গ্যাস বায়ুমণ্ডলকে দূষিত করে এবং মানবদেহে ক্যান্সার ও শ্বাসকষ্টসহ নানা জটিল রোগের ঝুঁকি বাড়ায়।\n৫. তাই পরিবেশ ও আগামী প্রজন্মকে রক্ষা করতে একবার ব্যবহারযোগ্য প্লাস্টিক বর্জন করে পাট ও কাগজের মতো পরিবেশবান্ধব বিকল্প ব্যবহারের পাশাপাশি প্লাস্টিক রিসাইক্লিং জোরদার করা অপরিহার্য।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 19,
    question_number: 19,
    subject: 'বাংলা (Bangla)',
    question: '3. ভাবসম্প্রসারণ কর:\n"পরের অভাব মনে করিলে চিন্তন\nআপন অভাব ক্ষোভ থাকে কতক্ষণ?"',
    question_html:
      '<p>3. ভাবসম্প্রসারণ কর:<br>"পরের অভাব মনে করিলে চিন্তন<br>আপন অভাব ক্ষোভ থাকে কতক্ষণ?"</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**মূলভাব:** মানুষ স্বভাবতই নিজের অভাব ও দুঃখকে বড় করে দেখে হতাশায় ভোগে। কিন্তু চারপাশের আরও অসংখ্য অসহায় ও দুস্থ মানুষের চরম অভাব-অনটনের কথা চিন্তা করলে নিজের অভাবজনিত ক্ষোভ ও আক্ষেপ নিমেষেই দূর হয়ে যায়।\n\n**সম্প্রসারিত ভাব:** সংসারে প্রতিটি মানুষের জীবনেই কমবেশি অপ্রাপ্তি ও অভাব থাকে। আত্মকেন্দ্রিক মানুষ কেবল নিজের সামান্য অপ্রাপ্তি নিয়েই সর্বদা হা-হুতাশ করে এবং মানসিক অশান্তিতে দিন কাটায়। অথচ সে যদি একবার নিজের গণ্ডি থেকে বেরিয়ে সমাজের অবহেলিত, অন্নহীন ও বস্ত্রহীন মানুষের করুণ জীবনযাত্রার দিকে তাকায়, তবে সে উপলব্ধি করতে পারবে যে তার নিজের অবস্থান তাদের চেয়ে কতটা ভালো। অপরের বৃহত্তর দুঃখ ও দারিদ্র্যের প্রতি সহমর্মিতা অনুভব করলে মানুষের মন উদার হয় এবং নিজের ক্ষুদ্র অভাববোধ তুচ্ছ মনে হয়। পরের কল্যাণে হাত বাড়িয়ে দেওয়ার মধ্যেই প্রকৃত আত্মতৃপ্তি ও মানসিক প্রশান্তি নিহিত।\n\n**মন্তব্য:** আত্মকেন্দ্রিকতা পরিহার করে পরের দুঃখ-কষ্টের কথা স্মরণ ও সহমর্মিতা চর্চা করলেই মানুষ নিজের অভাবের গ্লানি ভুলে সুখী ও পরিতৃপ্ত জীবনযাপন করতে পারে।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== ENGLISH (20 - 22) ========================
  {
    number: 20,
    question_number: 20,
    subject: 'ইংরেজি (English)',
    question:
      '1. Make meaningful sentences with the following words: dissolve, proactive, bibliophile, perverse, rattling.',
    question_html:
      '<p>1. Make meaningful sentences with the following words: dissolve, proactive, bibliophile, perverse, rattling.</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n* **Dissolve** *(দ্রবীভূত হওয়া / বিলুপ্ত করা)*: Sugar and salt **dissolve** quickly when stirred in warm water.\n* **Proactive** *(অগ্রণী / আগে থেকেই সচেতন ও উদ্যোগী)*: Taking **proactive** measures against climate change can save millions of lives.\n* **Bibliophile** *(বইপ্রেমী)*: As an ardent **bibliophile**, she spends most of her leisure hours in libraries and bookstores.\n* **Perverse** *(বিকৃত / একগুঁয়ে বা অযৌক্তিক)*: He took a **perverse** pleasure in arguing against every reasonable suggestion.\n* **Rattling** *(ঝনঝন বা খটখট শব্দ করা)*: The fierce storm wind kept **rattling** the old wooden window panes all night.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 21,
    question_number: 21,
    subject: 'ইংরেজি (English)',
    question:
      '2. Read the following extract from the poem "The Lake Isle of Innisfree" and answer the questions that follow:\n"And I shall have some peace there, for peace comes dropping slow,\nDropping from the veils of the morning to where the cricket sings;\nThere midnight\'s all a glimmer, and noon a purple glow,\nAnd evening full of the linnet\'s wings."\n\n(a) What image has been used by the poet to describe peace?\n(b) What are the living creatures mentioned in the poem?',
    question_html:
      '<div><p>2. Read the following extract from the poem "The Lake Isle of Innisfree" and answer the questions that follow:<br>"And I shall have some peace there, for peace comes dropping slow,<br>Dropping from the veils of the morning to where the cricket sings;<br>There midnight\'s all a glimmer, and noon a purple glow,<br>And evening full of the linnet\'s wings."</p><p>(a) What image has been used by the poet to describe peace?</p><p>(b) What are the living creatures mentioned in the poem?</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n**(a)** The poet uses the serene visual image of morning mist or dew **"dropping slow / Dropping from the veils of the morning"** down to the grass where the cricket sings to describe peace descending gently upon nature.\n\n**(b)** The living creatures mentioned in the extract are the **cricket** (an insect that sings in the morning) and the **linnet** (a small songbird flying in the evening; in the full poem, the **honey-bee** is also mentioned).',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 22,
    question_number: 22,
    subject: 'ইংরেজি (English)',
    question: '3. Write a well-organized paragraph on "The use and abuse of advertisements".',
    question_html: '<p>3. Write a well-organized paragraph on "The use and abuse of advertisements".</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n**The Use and Abuse of Advertisements**\n\nAdvertisements are a powerful medium of communication in the modern commercial world, serving both beneficial and harmful purposes depending on how they are used. On the positive side, advertisements inform consumers about new products, services, prices, and technological innovations, enabling people to make informed purchasing choices while fostering healthy competition among manufacturers. Public service advertisements also play a vital role in raising social awareness about health, education, and road safety. However, the abuse of advertisements has become increasingly alarming in recent years. Many unscrupulous companies use exaggerated claims, deceptive visuals, and false promises to sell inferior or even harmful products such as junk food and unsafe cosmetics. Moreover, aggressive advertising manipulates consumer psychology, promotes materialism and unnecessary spending, and often exploits children and cultural values for profit. Therefore, strict consumer protection laws and ethical advertising standards must be enforced so that advertisements serve as a truthful guide rather than a tool of deception.',
    explanation_html: null,
    explanation_image_urls: [],
  },
];

// ============================================================================
// WRITE ALL 3 SESSIONS
// ============================================================================
const sessionsToWrite = [
  {
    session: '24-25',
    title: 'DU A 24-25 Written',
    questions: questions24_25,
    paths: [
      'public/assets/aistudio/DU_24-25_Written_a26d6034.json',
      'Question/DU/DU_24-25_Written.json',
    ],
  },
  {
    session: '23-24',
    title: 'DU A 23-24 Written',
    questions: questions23_24,
    paths: [
      'public/assets/aistudio/DU_23-24_Written_cf68395f.json',
      'Question/DU/DU_23-24_Written.json',
    ],
  },
  {
    session: '22-23',
    title: 'DU A 22-23 Written',
    questions: questions22_23,
    paths: [
      'public/assets/aistudio/DU_22-23_Written_50c9130b.json',
      'Question/DU/DU_22-23_Written.json',
    ],
  },
];

for (const item of sessionsToWrite) {
  const payload = {
    schema_version: '2.0',
    university: 'DU',
    session: item.session,
    title: item.title,
    exam_type: 'Written',
    total_questions: item.questions.length,
    questions: item.questions,
  };

  for (const relPath of item.paths) {
    const fullPath = path.join(process.cwd(), relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`Wrote ${item.title} (${item.questions.length} questions) -> ${relPath}`);
  }
}
