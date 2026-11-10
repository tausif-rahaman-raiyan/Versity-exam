const fs = require('fs');
const path = require('path');

const questions = [
  // ======================== PHYSICS (1 - 4) ========================
  {
    number: 1,
    question_number: 1,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '1. অনুভূমিকভাবে চলমান একটি আলফা কণা $(m_{\\alpha} = 4u)$ একটি স্থির অক্সিজেন নিউক্লিয়াসের $(m_o = 16u)$ সাথে স্থিতিস্থাপক সংঘর্ষে লিপ্ত হয়। সংঘর্ষের পর আলফা কণাটি তার আদি গতিপথের সাথে সমকোণে বিক্ষিপ্ত হয় এবং অক্সিজেন নিউক্লিয়াসটি আদি গতিপথের সাথে $65^\\circ$ কোণে $1.2 \\times 10^5\\text{ m/s}$ গতিতে চলে যায়। আলফা কণাটির চূড়ান্ত গতিবেগ নির্ণয় কর।',
    question_html:
      '<p>1. অনুভূমিকভাবে চলমান একটি আলফা কণা $(m_{\\alpha} = 4u)$ একটি স্থির অক্সিজেন নিউক্লিয়াসের $(m_o = 16u)$ সাথে স্থিতিস্থাপক সংঘর্ষে লিপ্ত হয়। সংঘর্ষের পর আলফা কণাটি তার আদি গতিপথের সাথে সমকোণে বিক্ষিপ্ত হয় এবং অক্সিজেন নিউক্লিয়াসটি আদি গতিপথের সাথে $65^\\circ$ কোণে $1.2 \\times 10^5\\text{ m/s}$ গতিতে চলে যায়। আলফা কণাটির চূড়ান্ত গতিবেগ নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* আলফা কণার ভর, $m_{\\alpha} = 4u$\n* অক্সিজেন নিউক্লিয়াসের ভর, $m_o = 16u$\n* সংঘর্ষের পর অক্সিজেন নিউক্লিয়াসের বেগ, $v_o = 1.2 \\times 10^5\\text{ m/s}$\n* অক্সিজেন নিউক্লিয়াসের বিক্ষেপণ কোণ, $\\theta_o = 65^\\circ$\n* আলফা কণার বিক্ষেপণ কোণ, $\\theta_{\\alpha} = 90^\\circ$\n\nআদি গতিপথের লম্ব দিকে ($y$-অক্ষ বরাবর) রৈখিক ভরবেগের সংরক্ষণশীলতা নীতি প্রয়োগ করে পাই:\n$$m_{\\alpha} v_{\\alpha} \\sin 90^\\circ - m_o v_o \\sin 65^\\circ = 0$$\n$$\\Rightarrow v_{\\alpha} = \\frac{m_o v_o \\sin 65^\\circ}{m_{\\alpha}}$$\n$$\\Rightarrow v_{\\alpha} = \\frac{16u \\times 1.2 \\times 10^5 \\times \\sin 65^\\circ}{4u}$$\n$$\\Rightarrow v_{\\alpha} = 4 \\times 1.2 \\times 10^5 \\times 0.9063 = 4.35 \\times 10^5\\text{ m/s}$$\n\n**উত্তর:** আলফা কণাটির চূড়ান্ত গতিবেগ $4.35 \\times 10^5\\text{ m/s}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 2,
    question_number: 2,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '2. ![ত্বরণ বনাম অবস্থান লেখচিত্র](/assets/imported/du_25_26_written_9959a5f3f0e1e4c7.png)\nএকটি $10\\text{ kg}$ ভরের বস্তু $x$-অক্ষ বরাবর গতিশীল। বস্তুটির ত্বরণ তার অবস্থানের ফাংশন হিসেবে চিত্রে দেখানো হয়েছে। বস্তুটি $x = 0\\text{ m}$ থেকে $x = 8\\text{ m}$ পর্যন্ত অতিক্রম করলে, এর উপর মোট কৃতকাজ কত?',
    question_html:
      '<p>2. <img src="/assets/imported/du_25_26_written_9959a5f3f0e1e4c7.png" alt="ত্বরণ বনাম অবস্থান লেখচিত্র" /> একটি $10\\text{ kg}$ ভরের বস্তু $x$-অক্ষ বরাবর গতিশীল। বস্তুটির ত্বরণ তার অবস্থানের ফাংশন হিসেবে চিত্রে দেখানো হয়েছে। বস্তুটি $x = 0\\text{ m}$ থেকে $x = 8\\text{ m}$ পর্যন্ত অতিক্রম করলে, এর উপর মোট কৃতকাজ কত?</p>',
    question_image_urls: ['/assets/imported/du_25_26_written_9959a5f3f0e1e4c7.png'],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে, বস্তুর ভর $m = 10\\text{ kg}$।\nকৃতকাজ, $W = \\int_{0}^{8} F\\,dx = m \\int_{0}^{8} a\\,dx = m \\times (\\text{ত্বরণ-অবস্থান লেখচিত্রের ক্ষেত্রফল})$।\n\nচিত্র হতে দেখা যায়, $x = 0\\text{ m}$ থেকে $x = 8\\text{ m}$ পর্যন্ত লেখচিত্রটি একটি ত্রিভুজ (বা ট্রাপিজিয়াম অংশ) গঠন করে যার:\n* ভূমি $= 8\\text{ m}$ এবং সর্বোচ্চ উচ্চতা $a_{\\max} = 20\\text{ m/s}^2$\n* লেখচিত্রের আবদ্ধ ক্ষেত্রফল, $\\int_{0}^{8} a\\,dx = \\frac{1}{2} \\times 8 \\times 20 = 80\\text{ m}^2/\\text{s}^2$\n\nসুতরাং মোট কৃতকাজ:\n$$W = m \\times 80 = 10 \\times 80 = 800\\text{ J}$$\n\n**উত্তর:** মোট কৃতকাজ $800\\text{ J}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 3,
    question_number: 3,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '3. একটি কার্নো ইঞ্জিন $T_H = 900\\text{ K}$ এবং $T_L = 300\\text{ K}$ তাপমাত্রার মধ্যে কাজ করে। ইঞ্জিনটি প্রতি চক্রে $0.25\\text{ s}$ সময়ে $1200\\text{ J}$ কাজ করে। উচ্চ-তাপমাত্রার তাপাধার থেকে নিম্ন-তাপমাত্রার তাপাধারে শক্তি স্থানান্তরের ফলে একটি চক্রে কার্যকরী পদার্থের এনট্রপি কত পরিবর্তন হয়?',
    question_html:
      '<p>3. একটি কার্নো ইঞ্জিন $T_H = 900\\text{ K}$ এবং $T_L = 300\\text{ K}$ তাপমাত্রার মধ্যে কাজ করে। ইঞ্জিনটি প্রতি চক্রে $0.25\\text{ s}$ সময়ে $1200\\text{ J}$ কাজ করে। উচ্চ-তাপমাত্রার তাপাধার থেকে নিম্ন-তাপমাত্রার তাপাধারে শক্তি স্থানান্তরের ফলে একটি চক্রে কার্যকরী পদার্থের এনট্রপি কত পরিবর্তন হয়?</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* উৎসের তাপমাত্রা, $T_H = 900\\text{ K}$\n* গ্রাহকের তাপমাত্রা, $T_L = 300\\text{ K}$\n* প্রতি চক্রে কৃতকাজ, $W = 1200\\text{ J}$\n\nকার্নো ইঞ্জিনের কর্মদক্ষতা:\n$$\\eta = 1 - \\frac{T_L}{T_H} = 1 - \\frac{300}{900} = \\frac{2}{3}$$\n\nআবার, $\\eta = \\frac{W}{Q_H} \\Rightarrow Q_H = \\frac{W}{\\eta} = \\frac{1200}{2/3} = 1800\\text{ J}$\nএবং বর্জিত তাপ, $Q_L = Q_H - W = 1800 - 1200 = 600\\text{ J}$।\n\n* একটি পূর্ণ প্রত্যাবর্তী চক্রে কার্যকরী পদার্থ আদি অবস্থায় ফিরে আসে এবং এনট্রপি একটি অবস্থা অপেক্ষক (State Function) হওয়ায় একটি পূর্ণ চক্রে কার্যকরী পদার্থের নিট এনট্রপির পরিবর্তন:\n$$\\Delta S = \\frac{Q_H}{T_H} - \\frac{Q_L}{T_L} = \\frac{1800}{900} - \\frac{600}{300} = 2 - 2 = 0\\text{ J/K}$$\n*(উল্লেখ্য: সমোষ্ণ প্রসারণে গৃহীত এনট্রপি $+2\\text{ J/K}$ এবং সমোষ্ণ সংকোচনে বর্জিত এনট্রপি $-2\\text{ J/K}$, ফলে পূর্ণ চক্রে মোট এনট্রপি পরিবর্তন $0\\text{ J/K}$।)*\n\n**উত্তর:** একটি পূর্ণ চক্রে কার্যকরী পদার্থের এনট্রপির পরিবর্তন $0\\text{ J/K}$ (এবং প্রতি ধাপে স্থানান্তরিত এনট্রপির মান $2\\text{ J/K}$)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 4,
    question_number: 4,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    question:
      '4. ![বর্তনী চিত্র](/assets/imported/du_25_26_written_c6d08baa9b58946f.png)\nপাশের চিত্রের প্রদত্ত বর্তনীতে ব্যাটারিটির অভ্যন্তরীণ রোধ নগণ্য হলে রোধ $R$ কর্তৃক ক্ষয়প্রাপ্ত বৈদ্যুতিক ক্ষমতা $\\text{mW}$ এককে নির্ণয় কর।',
    question_html:
      '<p>4. <img src="/assets/imported/du_25_26_written_c6d08baa9b58946f.png" alt="বর্তনী চিত্র" /> পাশের চিত্রের প্রদত্ত বর্তনীতে ব্যাটারিটির অভ্যন্তরীণ রোধ নগণ্য হলে রোধ $R$ কর্তৃক ক্ষয়প্রাপ্ত বৈদ্যুতিক ক্ষমতা $\\text{mW}$ এককে নির্ণয় কর।</p>',
    question_image_urls: ['/assets/imported/du_25_26_written_c6d08baa9b58946f.png'],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত বর্তনী হতে:\n* তড়িচ্চালক শক্তি, $E = 2\\text{ V}$\n* জেনার ডায়োডটি বিপরীত ঝোঁকে (Reverse bias) সংযুক্ত কিন্তু এর ব্রেকডাউন ভোল্টেজ $V_Z = 5\\text{ V}$।\n* যেহেতু সরবরাহকৃত ভোল্টেজ $(2\\text{ V}) < V_Z (5\\text{ V})$, তাই জেনার ডায়োডটি ব্রেকডাউন অঞ্চলে পৌঁছাবে না এবং খোলা বর্তনীর (Open circuit) মতো আচরণ করবে (এর মধ্য দিয়ে কোনো তড়িৎ প্রবাহিত হবে না)।\n\nফলে পুরো তড়িৎ প্রবাহ $1\\text{ k}\\Omega$ এবং $R = 3\\text{ k}\\Omega$ রোধের শ্রেণি সমবায়ের মধ্য দিয়ে প্রবাহিত হবে:\n* মোট তুল্য রোধ, $R_{\\text{eq}} = 1\\text{ k}\\Omega + 3\\text{ k}\\Omega = 4\\text{ k}\\Omega = 4000\\text{ }\\Omega$\n* বর্তনীর মূল প্রবাহ, $I = \\frac{E}{R_{\\text{eq}}} = \\frac{2}{4000}\\text{ A} = 0.5 \\times 10^{-3}\\text{ A} = 0.5\\text{ mA}$\n\nসুতরাং $R = 3\\text{ k}\\Omega = 3000\\text{ }\\Omega$ রোধ কর্তৃক ক্ষয়প্রাপ্ত বৈদ্যুতিক ক্ষমতা:\n$$P = I^2 R = (0.5 \\times 10^{-3})^2 \\times 3000 = 0.25 \\times 10^{-6} \\times 3000 = 0.75 \\times 10^{-3}\\text{ W} = 0.75\\text{ mW}$$\n\n**উত্তর:** রোধ $R$ কর্তৃক ক্ষয়প্রাপ্ত বৈদ্যুতিক ক্ষমতা $0.75\\text{ mW}$।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== CHEMISTRY (5 - 8) ========================
  {
    number: 5,
    question_number: 5,
    subject: 'রসায়ন (Chemistry)',
    question:
      '1.1. Si, P, এবং S এই মৌলগুলোকে গলনাংকের নিম্ন ক্রমানুসারে সাজাও। মৌলগুলোর গলনাংক এই ক্রমানুসারে কমে কেন ব্যাখ্যা কর।\n1.2. $\\text{CH}_3^+$ ও $\\text{CH}_3^-$ এর মধ্যে কার্বনের হাইব্রিডাইজেশন লিখ এবং তাদের আকৃতি উল্লেখ কর।',
    question_html:
      '<div><p>1.1. Si, P, এবং S এই মৌলগুলোকে গলনাংকের নিম্ন ক্রমানুসারে সাজাও। মৌলগুলোর গলনাংক এই ক্রমানুসারে কমে কেন ব্যাখ্যা কর।</p><p>1.2. $\\text{CH}_3^+$ ও $\\text{CH}_3^-$ এর মধ্যে কার্বনের হাইব্রিডাইজেশন লিখ এবং তাদের আকৃতি উল্লেখ কর।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ১.১ সমাধান ও ব্যাখ্যা:\nমৌলগুলোর গলনাঙ্কের নিম্নক্রম হচ্ছে- $\\text{Si} > \\text{S} > \\text{P}$\nএক্ষেত্রে, Si বৃহদকার\n![Si বৃহদকার সমযোজী কাঠামো](/assets/imported/du_25_26_written_8afdd13e5a246dca.png)\nসমযোজী কাঠামো তৈরি করে এদের বন্ধন ভাঙতে প্রচুর শক্তির প্রয়োজন। অপরদিকে $\\text{S}_8$ ও $\\text{P}_4$ অণু দুর্বল ভ্যানডার ওয়ালস আকর্ষণ বল দ্বারা যুক্ত এক্ষেত্রে, সালফার\n![S8 অণু](/assets/imported/du_25_26_written_68ac11cfd5a7b0d3.png)\nঅণু ফসফরাস\n![P4 অণু](/assets/imported/du_25_26_written_1f11a814ff82266c.png)\nঅণু এর চেয়ে বড় এবং ভারী তাই ভ্যানডার ওয়ালস বল তুলনামূলক বেশি শক্তিশালী। তাই সালফারের গলনাংক বেশি। একারণেই, $\\text{Si} > \\text{S} > \\text{P}$\n\n---\n### ১.২ সমাধান ও ব্যাখ্যা:\n$\\text{CH}_3^+$ এর ক্ষেত্রে, $\\text{X} = \\frac{1}{2}(4 + 3 - 1) = 3$\n$\\text{CH}_3^-$ এর ক্ষেত্রে, $\\text{X} = \\frac{1}{2}(4 + 3 + 1) = 4$\n\n| আয়ন | X এর মান | সংকরায়ণ | মুক্তজোড় ইলেকট্রন সংখ্যা | আকৃতি |\n| --- | --- | --- | --- | --- |\n| $\\text{CH}_3^+$ | 3 | $\\text{sp}^2$ | 0 | সমতলীয় ত্রিভুজাকার |\n| $\\text{CH}_3^-$ | 4 | $\\text{sp}^3$ | 1 | ত্রিকোণাকার পিরামিডীয় |',
    explanation_html: null,
    explanation_image_urls: [
      '/assets/imported/du_25_26_written_8afdd13e5a246dca.png',
      '/assets/imported/du_25_26_written_68ac11cfd5a7b0d3.png',
      '/assets/imported/du_25_26_written_1f11a814ff82266c.png',
    ],
  },
  {
    number: 6,
    question_number: 6,
    subject: 'রসায়ন (Chemistry)',
    question:
      '2.1. একটি দুর্বল এসিড HA এবং এর লবণ NaA এর মিশ্রণ কীভাবে বাফার হিসাবে কাজ করে বিক্রিয়ার মাধ্যমে দেখাও।\n2.2. 50 mL $0.01\\text{ molL}^{-1}$ NaOH এর জলীয় দ্রবণকে 100 mL $0.01\\text{ molL}^{-1}$ HA এর জলীয় দ্রবণের সাথে মিশানো হলো। HA এর বিয়োজন ধ্রুবকের মান $1.0 \\times 10^{-5}$ হলে, দ্রবণের pH হিসাব কর।',
    question_html:
      '<div><p>2.1. একটি দুর্বল এসিড HA এবং এর লবণ NaA এর মিশ্রণ কীভাবে বাফার হিসাবে কাজ করে বিক্রিয়ার মাধ্যমে দেখাও।</p><p>2.2. 50 mL $0.01\\text{ molL}^{-1}$ NaOH এর জলীয় দ্রবণকে 100 mL $0.01\\text{ molL}^{-1}$ HA এর জলীয় দ্রবণের সাথে মিশানো হলো। HA এর বিয়োজন ধ্রুবকের মান $1.0 \\times 10^{-5}$ হলে, দ্রবণের pH হিসাব কর।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ২.১ সমাধান ও ব্যাখ্যা:\nবাফার দ্রবণে HA এবং NaA নিম্নরূপ বিয়োজিত হয়:\n![বাফার দ্রবণে বিয়োজন ও কৌশল](/assets/imported/du_25_26_written_2b184fba8c301fbe.png)\nএভাবে বাফার দ্রবণটিতে সামান্য $\\text{H}^+$ বা $\\text{OH}^-$ যোগ করলেও দ্রবণের pH অপরিবর্তিত থাকবে।\n\n---\n### ২.২ সমাধান ও ব্যাখ্যা:\n![প্রশমন বিক্রিয়া ও মোল সংখ্যা হিসাব](/assets/imported/du_25_26_written_21bd4f5ebeaaabe0.png)\n$\\therefore$ এটি একটি বাফার দ্রবণ। হেডারসন হ্যানসেলবাখ সমীকরণ অনুযায়ী:\n$$\\text{pH} = \\text{pK}_\\text{a} + \\log \\frac{n_{\\text{NaA}}}{n_{\\text{HA}}} = -\\log(1 \\times 10^{-5}) + \\log \\frac{\\left(\\frac{50}{1000}\\right) \\times 0.01}{\\left(\\frac{50}{1000}\\right) \\times 0.01} = 5$$',
    explanation_html: null,
    explanation_image_urls: [
      '/assets/imported/du_25_26_written_2b184fba8c301fbe.png',
      '/assets/imported/du_25_26_written_21bd4f5ebeaaabe0.png',
    ],
  },
  {
    number: 7,
    question_number: 7,
    subject: 'রসায়ন (Chemistry)',
    question:
      '3. নিচের বিক্রিয়াগুলোতে A, B, C এর স্থলে বিকারকের সংকেত ও বিক্রিয়ার শর্ত এবং P, Q এর স্থলে উৎপাদগুলোর সংকেত লিখ।\n![বিক্রিয়া ছক](/assets/imported/du_25_26_written_c14bd8eebaf5b966.png)',
    question_html:
      '<p>3. নিচের বিক্রিয়াগুলোতে A, B, C এর স্থলে বিকারকের সংকেত ও বিক্রিয়ার শর্ত এবং P, Q এর স্থলে উৎপাদগুলোর সংকেত লিখ। <img src="/assets/imported/du_25_26_written_c14bd8eebaf5b966.png" alt="বিক্রিয়া ছক" /></p>',
    question_image_urls: ['/assets/imported/du_25_26_written_c14bd8eebaf5b966.png'],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত বিক্রিয়াগুলো বিশ্লেষণ করে বিকারক (A, B, C) ও উৎপাদ (P, Q) নিচে দেওয়া হলো:\n\n1. **প্রথম বিক্রিয়া (রোজেনমান্ড বিজারণ):**\n   * **A (বিকারক ও শর্ত):** $\\text{H}_2 / \\text{Pd}, \\text{BaSO}_4$, উত্তপ্ত জাইলিন মাধ্যম $(\\Delta)$\n   * **Q (প্রধান উৎপাদ):** $\\text{CH}_3\\text{CHO}$ (ইথান্যাল) এবং উপজাত $\\text{HCl}$।\n\n2. **দ্বিতীয় বিক্রিয়া (অ্যালকাইনের আর্দ্র বিশ্লেষণ):**\n   * **B (বিকারক ও শর্ত):** $20\\%\\text{ H}_2\\text{SO}_4$ এবং $2\\%\\text{ HgSO}_4, 60^\\circ\\text{C}$ তাপমাত্রা।\n\n3. **তৃতীয় বিক্রিয়া (হ্যালোফর্ম বিক্রিয়া ও ডিকার্বক্সিলেশন):**\n   * **P (উৎপাদ):** $\\text{CHI}_3$ (আয়োডোফর্মের হলুদ অধঃক্ষেপ)\n   * **C (বিকারক ও শর্ত):** সোডা লাইম $(\\text{NaOH} + \\text{CaO})$ এবং তাপ $(\\Delta)$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 8,
    question_number: 8,
    subject: 'রসায়ন (Chemistry)',
    question:
      '4.1. $\\text{CH}_3\\text{CH(Cl)CH}_2\\text{CH}_3$ কে অ্যালকোহলীয় NaOH এর সাথে উত্তপ্ত করলে উৎপন্ন সমাণুগুলোর গাঠনিক সংকেত এবং নাম লিখ।\n4.2. গ্যালভানিক কোষে লবণ সেতু কী? এই লবণ সেতুর কাজ উল্লেখ কর।',
    question_html:
      '<div><p>4.1. $\\text{CH}_3\\text{CH(Cl)CH}_2\\text{CH}_3$ কে অ্যালকোহলীয় NaOH এর সাথে উত্তপ্ত করলে উৎপন্ন সমাণুগুলোর গাঠনিক সংকেত এবং নাম লিখ।</p><p>4.2. গ্যালভানিক কোষে লবণ সেতু কী? এই লবণ সেতুর কাজ উল্লেখ কর।</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### ৪.১ সমাধান ও ব্যাখ্যা:\n$$\\text{CH}_3 - \\text{CHCl} - \\text{CH}_2 - \\text{CH}_3 + \\text{NaOH(alc)} \\xrightarrow{\\Delta} \\text{C}_4\\text{H}_8 + \\text{NaCl} + \\text{H}_2\\text{O}$$\n$\\text{C}_4\\text{H}_8$ এর গাঠনিক সংকেত ও নাম:\n![C4H8 এর গাঠনিক সংকেত ও নাম](/assets/imported/du_25_26_written_3c96dd429f2aaf55.png)\n\n---\n### ৪.২ সমাধান ও ব্যাখ্যা:\nগ্যালভানিক কোষের পরোক্ষ সংযোগে উভয় অর্ধকোষের মাঝে তড়িৎ নিরপেক্ষতা বজায় রাখার জন্য নিষ্ক্রিয় তড়িৎ বিশ্লেষ্য (যেমন: $\\text{KCl}, \\text{KNO}_3, \\text{NH}_4\\text{NO}_3, \\text{Na}_2\\text{SO}_4$) পূর্ণ উল্টানো U আকৃতির বাঁকানো কাচনল ব্যবহার করা হয়, একে লবণ সেতু বলে।\n\n**লবণ সেতুর কাজ:**\n1. দুটি অর্ধকোষের মধ্যে পরোক্ষ সংযোগ স্থাপন করা।\n2. কোষের বর্তনী পূর্ণ করা।\n3. উভয় অর্ধকোষে বৈদ্যুতিক চার্জ নিরপেক্ষতা বজায় রাখা।\n4. তরল-সংযোগ বিভব দূর করা।',
    explanation_html: null,
    explanation_image_urls: ['/assets/imported/du_25_26_written_3c96dd429f2aaf55.png'],
  },

  // ======================== MATHEMATICS (9 - 12) ========================
  {
    number: 9,
    question_number: 9,
    subject: 'গণিত (Mathematics)',
    question:
      '1. $27x^2 + 6x - (p + 2) = 0$ এর একটি মূল অপরটির বর্গ হলে $p$ এর মান বের কর।',
    question_html:
      '<p>1. $27x^2 + 6x - (p + 2) = 0$ এর একটি মূল অপরটির বর্গ হলে $p$ এর মান বের কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nমনে করি, প্রদত্ত সমীকরণ $27x^2 + 6x - (p + 2) = 0$-এর মূলদ্বয় $\\alpha$ এবং $\\alpha^2$।\n\nমূল ও সহগের সম্পর্ক হতে পাই:\n1. মূলদ্বয়ের যোগফল: $\\alpha + \\alpha^2 = -\\frac{6}{27} = -\\frac{2}{9}$\n   $$\\Rightarrow 9\\alpha^2 + 9\\alpha + 2 = 0$$\n   $$\\Rightarrow (3\\alpha + 1)(3\\alpha + 2) = 0$$\n   $$\\therefore \\alpha = -\\frac{1}{3} \\text{ অথবা } \\alpha = -\\frac{2}{3}$$\n\n2. মূলদ্বয়ের গুণফল: $\\alpha \\cdot \\alpha^2 = \\alpha^3 = -\\frac{p + 2}{27}$\n\n* **যদি $\\alpha = -\\frac{1}{3}$ হয়:**\n  $$\\left(-\\frac{1}{3}\\right)^3 = -\\frac{p + 2}{27} \\Rightarrow -\\frac{1}{27} = -\\frac{p + 2}{27} \\Rightarrow p + 2 = 1 \\Rightarrow p = -1$$\n\n* **যদি $\\alpha = -\\frac{2}{3}$ হয়:**\n  $$\\left(-\\frac{2}{3}\\right)^3 = -\\frac{p + 2}{27} \\Rightarrow -\\frac{8}{27} = -\\frac{p + 2}{27} \\Rightarrow p + 2 = 8 \\Rightarrow p = 6$$\n\n**উত্তর:** $p = -1$ অথবা $p = 6$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 10,
    question_number: 10,
    subject: 'গণিত (Mathematics)',
    question:
      '2. একটি বৃত্তের সমীকরণ নির্ণয় কর যা $x$-অক্ষকে $(4, 0)$ বিন্দুতে স্পর্শ করে এবং যার দ্বারা $y$-অক্ষের ছেদাংশের পরিমাণ $4$ একক।',
    question_html:
      '<p>2. একটি বৃত্তের সমীকরণ নির্ণয় কর যা $x$-অক্ষকে $(4, 0)$ বিন্দুতে স্পর্শ করে এবং যার দ্বারা $y$-অক্ষের ছেদাংশের পরিমাণ $4$ একক।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nবৃত্তটি $x$-অক্ষকে $(4, 0)$ বিন্দুতে স্পর্শ করায় বৃত্তটির কেন্দ্রের ভুজ $h = 4$ এবং ব্যাসার্ধ $r = |k|$ (যেখানে $k$ হলো কেন্দ্রের কোটি)।\n\nআবার, $y$-অক্ষের ছেদাংশের পরিমাণ $4$ একক হওয়ায়:\n$$2\\sqrt{f^2 - c} = 4 \\text{ বা, } r^2 - h^2 = \\left(\\frac{4}{2}\\right)^2 = 4$$\nযেহেতু $r = |k|$ এবং $h = 4$, তাই:\n$$k^2 - 4^2 = 4 \\Rightarrow k^2 = 16 + 4 = 20 \\Rightarrow k = \\pm 2\\sqrt{5}$$\n\nসুতরাং বৃত্তটির কেন্দ্র $(4, \\pm 2\\sqrt{5})$ এবং ব্যাসার্ধ $r = \\sqrt{20}$।\nবৃত্তটির সমীকরণ:\n$$(x - 4)^2 + (y \\mp 2\\sqrt{5})^2 = (\\sqrt{20})^2$$\n$$\\Rightarrow x^2 - 8x + 16 + y^2 \\mp 4\\sqrt{5}y + 20 = 20$$\n$$\\Rightarrow x^2 + y^2 - 8x \\mp 4\\sqrt{5}y + 16 = 0$$\n\n**উত্তর:** নির্ণেয় বৃত্তের সমীকরণ $x^2 + y^2 - 8x \\pm 4\\sqrt{5}y + 16 = 0$।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 11,
    question_number: 11,
    subject: 'গণিত (Mathematics)',
    question:
      '3. $x = y^2$ এবং $y = x - 2$ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল নির্ণয় কর।',
    question_html:
      '<p>3. $x = y^2$ এবং $y = x - 2$ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nপ্রদত্ত সমীকরণদ্বয়:\n$$x = y^2 \\quad \\cdots (1)$$\n$$y = x - 2 \\Rightarrow x = y + 2 \\quad \\cdots (2)$$\n\nছেদবিন্দু নির্ণয়:\n$$y^2 = y + 2 \\Rightarrow y^2 - y - 2 = 0 \\Rightarrow (y - 2)(y + 1) = 0$$\n$$\\therefore y = -1, 2$$\n\nসুতরাং আবদ্ধ ক্ষেত্রের ক্ষেত্রফল:\n$$A = \\int_{-1}^{2} (x_2 - x_1)\\,dy = \\int_{-1}^{2} (y + 2 - y^2)\\,dy$$\n$$= \\left[ \\frac{y^2}{2} + 2y - \\frac{y^3}{3} \\right]_{-1}^{2}$$\n$$= \\left( \\frac{4}{2} + 4 - \\frac{8}{3} \\right) - \\left( \\frac{1}{2} - 2 + \\frac{1}{3} \\right)$$\n$$= \\left( 6 - \\frac{8}{3} \\right) - \\left( -\\frac{7}{6} \\right) = \\frac{10}{3} + \\frac{7}{6} = \\frac{27}{6} = \\frac{9}{2} = 4.5\\text{ বর্গ একক}$$\n\n**উত্তর:** নির্ণেয় ক্ষেত্রফল $\\frac{9}{2}$ বা $4.5$ বর্গ একক।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 12,
    question_number: 12,
    subject: 'গণিত (Mathematics)',
    question:
      '4. একটি বস্তুকে ভূমি হতে $100\\text{ ft/s}$ বেগে এবং অনুভূমিকের সাথে $\\cos^{-1}\\left(\\frac{3}{5}\\right)$ কোণে শূন্যে নিক্ষেপ করা হলো। $2\\text{ s}$ পরে নিক্ষেপণ বিন্দু হতে বস্তুটির দূরত্ব নির্ণয় কর।',
    question_html:
      '<p>4. একটি বস্তুকে ভূমি হতে $100\\text{ ft/s}$ বেগে এবং অনুভূমিকের সাথে $\\cos^{-1}\\left(\\frac{3}{5}\\right)$ কোণে শূন্যে নিক্ষেপ করা হলো। $2\\text{ s}$ পরে নিক্ষেপণ বিন্দু হতে বস্তুটির দূরত্ব নির্ণয় কর।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nদেওয়া আছে,\n* আদিবেগ, $u = 100\\text{ ft/s}$\n* নিক্ষেপণ কোণ, $\\alpha = \\cos^{-1}\\left(\\frac{3}{5}\\right) \\Rightarrow \\cos\\alpha = \\frac{3}{5}$ এবং $\\sin\\alpha = \\frac{4}{5}$\n* সময়, $t = 2\\text{ s}$ এবং অভিকর্ষজ ত্বরণ $g = 32\\text{ ft/s}^2$\n\n$t = 2\\text{ s}$ পর বস্তুটির অনুভূমিক সরণ $(x)$ এবং উল্লম্ব সরণ $(y)$:\n$$x = (u\\cos\\alpha)t = 100 \\times \\frac{3}{5} \\times 2 = 120\\text{ ft}$$\n$$y = (u\\sin\\alpha)t - \\frac{1}{2}gt^2 = 100 \\times \\frac{4}{5} \\times 2 - \\frac{1}{2} \\times 32 \\times 2^2 = 160 - 64 = 96\\text{ ft}$$\n\nসুতরাং $2\\text{ s}$ পরে নিক্ষেপণ বিন্দু $(0,0)$ হতে বস্তুটির সরলরৈখিক দূরত্ব:\n$$r = \\sqrt{x^2 + y^2} = \\sqrt{120^2 + 96^2} = \\sqrt{14400 + 9216} = \\sqrt{23616} = 24\\sqrt{41}\\text{ ft} \\approx 153.67\\text{ ft}$$\n\n**উত্তর:** নিক্ষেপণ বিন্দু হতে বস্তুটির দূরত্ব $24\\sqrt{41}\\text{ ft}$ (বা $153.67\\text{ ft}$)।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BIOLOGY (13 - 16) ========================
  {
    number: 13,
    question_number: 13,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '1. মাইটোকন্ড্রিয়া ও প্লাস্টিডের মধ্যে পাঁচটি সাদৃশ্য লিখ।',
    question_html: '<p>1. মাইটোকন্ড্রিয়া ও প্লাস্টিডের মধ্যে পাঁচটি সাদৃশ্য লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nমাইটোকন্ড্রিয়া ও প্লাস্টিডের মধ্যে পাঁচটি প্রধান সাদৃশ্য নিচে দেওয়া হলো:\n1. **দ্বিস্তরী আবরণী:** উভয় অঙ্গাণুই দ্বিস্তরী লিপোপ্রোটিন ঝিল্লি (বহিঃস্থ ও অন্তঃস্থ মেমব্রেন) দ্বারা আবৃত।\n2. **নিজস্ব DNA:** উভয় অঙ্গাণুর নিজস্ব বৃত্তাকার DNA রয়েছে।\n3. **রাইবোজোম:** উভয়ের ম্যাট্রিক্স/স্ট্রোমায় $70\\text{S}$ প্রকৃতির রাইবোজোম থাকে।\n4. **শক্তি রূপান্তর ও ATP সংশ্লেষণ:** উভয়ই কোষে শক্তি রূপান্তরের সাথে জড়িত এবং ATP উৎপন্ন করে (মাইটোকন্ড্রিয়ায় অক্সিডেটিভ ফসফোরাইলেশন ও ক্লোরোপ্লাস্টে ফটোফসফোরাইলেশন)।\n5. **স্ব-প্রজননক্ষম (Semi-autonomous):** উভয় অঙ্গাণুই নিজস্ব DNA ও রাইবোজোমের সাহায্যে প্রোটিন সংশ্লেষণ ও বিভাজনের মাধ্যমে সংখ্যাবৃদ্ধি করতে পারে।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 14,
    question_number: 14,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '2. উদাহরণসহ Poaceae গোত্রের চারটি সনাক্তকারী বৈশিষ্ট্য লিখ?',
    question_html: '<p>2. উদাহরণসহ Poaceae গোত্রের চারটি সনাক্তকারী বৈশিষ্ট্য লিখ?</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**Poaceae গোত্রের চারটি সনাক্তকারী বৈশিষ্ট্য:**\n1. **কাণ্ড:** কাণ্ড সাধারণত নলাকার এবং মধ্যপর্ব ফাঁপা (Culm)।\n2. **পাতা:** পাতা একান্তর, সমান্তরাল শিরাবিন্যাসযুক্ত এবং পত্রমূল কাণ্ডবেষ্টক ও লিগিউল (Ligule) যুক্ত।\n3. **পুষ্পবিন্যাস:** পুষ্পবিন্যাস স্পাইকলেট (Spikelet) প্রকৃতির।\n4. **পুষ্প ও ফল:** পুষ্পে লডিকিউল (Lodicule) নামক পেরিয়ান্থ থাকে, পরাগধানী সর্বমুখ (Versatile), গর্ভমুণ্ড পালকের ন্যায় (Feathery) এবং ফল ক্যারিওপসিস (Caryopsis) প্রকৃতির।\n\n**উদাহরণ:** ধান (*Oryza sativa*), গম (*Triticum aestivum*)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 15,
    question_number: 15,
    subject: 'জীববিজ্ঞান (Biology)',
    question: '3. কন্ড্রিকথিস ও অ্যাকটিনোপটেরিজি শ্রেণির মধ্যে পাঁচটি পার্থক্য লিখ?',
    question_html: '<p>3. কন্ড্রিকথিস ও অ্যাকটিনোপটেরিজি শ্রেণির মধ্যে পাঁচটি পার্থক্য লিখ?</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\nকন্ড্রিকথিস (Chondrichthyes) ও অ্যাকটিনোপটেরিজি (Actinopterygii) শ্রেণির মধ্যে পাঁচটি পার্থক্য:\n\n| বৈশিষ্ট্য | Chondrichthyes (কন্ড্রিকথিস) | Actinopterygii (অ্যাকটিনোপটেরিজি) |\n| --- | --- | --- |\n| ১. অন্তঃকঙ্কাল | তরুণাস্থিময় (Cartilaginous) | অস্থিময় (Bony) |\n| ২. আঁইশ | প্ল্যাকয়েড (Placoid) প্রকৃতির | সাইক্লয়েড বা টিনয়েড প্রকৃতির |\n| ৩. ফুলকা ছিদ্র | ৫–৭ জোড়া এবং কানকো (Operculum) বিহীন | ৪ জোড়া এবং কানকো দ্বারা আবৃত |\n| ৪. পুচ্ছ পাখনা | হেটারোসার্কাল (অসম অংশবিশিষ্ট) | হোমোসার্কাল (সমান অংশবিশিষ্ট) |\n| ৫. বায়ুথলি (Air bladder) | অনুপস্থিত | উপস্থিত (প্লবতা রক্ষায় সাহায্য করে) |',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 16,
    question_number: 16,
    subject: 'জীববিজ্ঞান (Biology)',
    question:
      '4. আইলেটস অব ল্যাঙ্গারহ্যান্স কোথায় অবস্থিত? এর চার ধরনের কোষ ও তাদের নিঃসৃত হরমোনসমূহের নাম লিখ।',
    question_html:
      '<p>4. আইলেটস অব ল্যাঙ্গারহ্যান্স কোথায় অবস্থিত? এর চার ধরনের কোষ ও তাদের নিঃসৃত হরমোনসমূহের নাম লিখ।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান:\n**অবস্থান:** আইলেটস অব ল্যাঙ্গারহ্যান্স (Islets of Langerhans) মানবদেহের **অগ্ন্যাশয় (Pancreas)** গ্রন্থির অন্তঃক্ষরা অংশে অবস্থিত।\n\n**চার ধরনের কোষ ও নিঃসৃত হরমোনসমূহের নাম:**\n1. **আলফা ($\\alpha$) কোষ:** গ্লুকাগন (Glucagon) হরমোন নিঃসৃত করে (রক্তে গ্লুকোজের মাত্রা বৃদ্ধি করে)।\n2. **বিটা ($\\beta$) কোষ:** ইনসুলিন (Insulin) হরমোন নিঃসৃত করে (রক্তে গ্লুকোজের মাত্রা কমায়)।\n3. **ডেল্টা ($\\delta$) কোষ:** সোমাটোস্ট্যাটিন (Somatostatin) হরমোন নিঃসৃত করে (আলফা ও বিটা কোষের ক্ষরণ নিয়ন্ত্রণ করে)।\n4. **পিপি (PP) বা গামা ($\\gamma$) কোষ:** প্যানক্রিয়াটিক পলিপেপটাইড (Pancreatic Polypeptide) নিঃসৃত করে।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== BANGLA (17 - 19) ========================
  {
    number: 17,
    question_number: 17,
    subject: 'বাংলা',
    question:
      '1. সারমর্ম লেখ:\nআজকে অনেক রূঢ় রৌদ্রে ঘুরে প্রাণ\nপৃথিবীর মানুষকে মানুষের মতো\nভালোবাসা দিতে গিয়ে তবু,\nদেখেছি আমারি হাতে হয়ত নিহত\nভাই বোন বন্ধু পরিজন পড়ে আছে;\nপৃথিবীর গভীর গভীরতর অসুখ এখন;\nমানুষ তবুও ঋণী পৃথিবীরই কাছে।',
    question_html:
      '<p>1. সারমর্ম লেখ:<br/>আজকে অনেক রূঢ় রৌদ্রে ঘুরে প্রাণ<br/>পৃথিবীর মানুষকে মানুষের মতো<br/>ভালোবাসা দিতে গিয়ে তবু,<br/>দেখেছি আমারি হাতে হয়ত নিহত<br/>ভাই বোন বন্ধু পরিজন পড়ে আছে;<br/>পৃথিবীর গভীর গভীরতর অসুখ এখন;<br/>মানুষ তবুও ঋণী পৃথিবীরই কাছে।</p>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সারমর্ম:\nযুদ্ধ, হিংসা ও হানাহানিতে আজ মানবসভ্যতা গভীর সংকটে নিপতিত। মানুষে মানুষে ভালোবাসার পরিবর্তে আত্মঘাতী সংঘাতে আপনজনই আজ মানুষের হাতে প্রাণ হারাচ্ছে। তবুও সমস্ত অবক্ষয় ও অসুস্থতা সত্ত্বেও মানুষ এই সুন্দর পৃথিবীর কাছেই চিরঋণী ও দায়বদ্ধ।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 18,
    question_number: 18,
    subject: 'বাংলা',
    question:
      '2. প্রতিটি শব্দের দুটি করে সমার্থক শব্দ লেখ:\n2.1. সময়\n2.2. শিখা\n2.3. বৃক্ষ',
    question_html:
      '<div><p>2. প্রতিটি শব্দের দুটি করে সমার্থক শব্দ লেখ:</p><p>2.1. সময়</p><p>2.2. শিখা</p><p>2.3. বৃক্ষ</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান ও ব্যাখ্যা:\n* **২.১. সময়:** সময় শব্দের সমার্থক শব্দ: **কাল, যুগ**।\n* **২.২. শিখা:** শিখা শব্দের সমার্থক শব্দ: **চূড়া, শিখর** (বা অগ্নিশিখা/জ্বালা)।\n* **২.৩. বৃক্ষ:** বৃক্ষ শব্দের দুটি সমার্থক শব্দ: **বিটপী, উদ্ভিদ** (বা তরু, পাদপ)।',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 19,
    question_number: 19,
    subject: 'বাংলা',
    question:
      '3. অর্থসহ বাক্যে প্রয়োগ দেখাও:\n3.1. তামার বিষ\n3.2. তালপাতার সেপাই\n3.3. গোঁফখেজুরে\n3.4. কুম্ভীরাশ্রু',
    question_html:
      '<div><p>3. অর্থসহ বাক্যে প্রয়োগ দেখাও:</p><p>3.1. তামার বিষ</p><p>3.2. তালপাতার সেপাই</p><p>3.3. গোঁফখেজুরে</p><p>3.4. কুম্ভীরাশ্রু</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### সমাধান ও ব্যাখ্যা:\n* **৩.১. তামার বিষ:** \'তামার বিষ\' বাগধারাটির অর্থ হলো **অর্থের কুপ্রভাব**।\n  *বাক্য:* সুজনকে তামার বিষে পেয়েছে বলে মানুষকে মানুষ মনে করে না।\n* **৩.২. তালপাতার সেপাই:** ‘তালপাতার সেপাই’ বাগধারাটির অর্থ হলো **ক্ষীণজীবী / অতিশয় দুর্বল**।\n  *বাক্য:* ওসমান হাদী হতে চাইলে তালপাতার সেপাই হলে চলবে না।\n* **৩.৩. গোঁফখেজুরে:** গোঁফখেজুরে বাগধারাটির অর্থ হলো **অত্যন্ত অলস**।\n  *বাক্য:* রাকিবের মত গোঁফখেজুরে লোক আর একটা নাই।\n* **৩.৪. কুম্ভীরাশ্রু:** কুম্ভীরাশ্রু বাগধারাটির অর্থ হলো **মায়াকান্না / কপট কান্না**।\n  *বাক্য:* প্রতারকের কুম্ভীরাশ্রু দেখে ভুলতে নাই।',
    explanation_html: null,
    explanation_image_urls: [],
  },

  // ======================== ENGLISH (20 - 22) ========================
  {
    number: 20,
    question_number: 20,
    subject: 'ইংরেজি (English)',
    question:
      '1. Write meaningful sentences with the following words/phrase:\n1.1. soothing\n1.2. grudge\n1.3. bedecked\n1.4. go with the flow',
    question_html:
      '<div><p>1. Write meaningful sentences with the following words/phrase:</p><p>1.1. soothing</p><p>1.2. grudge</p><p>1.3. bedecked</p><p>1.4. go with the flow</p></div>',
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      '### Solution:\n* **1.1. soothing:** The soothing sound of rain helped her relax after a long, tiring day.\n* **1.2. grudge:** He decided not to hold a grudge and chose forgiveness instead.\n* **1.3. bedecked:** The streets were bedecked with colorful lights and flags during the festival.\n* **1.4. go with the flow:** Instead of worrying about every detail, she decided to go with the flow and enjoy the journey.',
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 21,
    question_number: 21,
    subject: 'ইংরেজি (English)',
    question:
      "2. Explain the following proverb in your own words: 'Time once lost cannot be regained'",
    question_html:
      "<p>2. Explain the following proverb in your own words: 'Time once lost cannot be regained'</p>",
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      "### Solution:\n**'Time once lost cannot be regained'**\n\nTime is the most valuable and irreversible asset in human life. If a person loses wealth, health, or material possessions, they can work hard to recover them in the future. However, a single moment that passes by is gone forever and can never be brought back at any cost. Those who waste their youth and opportunities in idleness or procrastination ultimately face regret and failure. Therefore, we must be punctual, disciplined, and make the best use of every single moment in the present to achieve success in life.",
    explanation_html: null,
    explanation_image_urls: [],
  },
  {
    number: 22,
    question_number: 22,
    subject: 'ইংরেজি (English)',
    question: "3. Write a well-organized paragraph on 'How to stop animal cruelty'.",
    question_html: "<p>3. Write a well-organized paragraph on 'How to stop animal cruelty'.</p>",
    question_image_urls: [],
    options: [],
    raw_options: [],
    correct_answer: null,
    answer_detection: 'written_question_no_mcq_answer',
    explanation:
      "### Solution:\n**How to Stop Animal Cruelty**\n\nAnimal cruelty is a grave moral and ecological issue that demands immediate collective action. Every living creature plays a vital role in maintaining the delicate balance of our biodiversity and ecosystem. To stop cruelty toward animals, strict enforcement of animal welfare laws must be ensured so that offenders face meaningful legal consequences for abuse, neglect, or illegal poaching. Furthermore, raising public awareness through schools, media, and community programs is essential to cultivate empathy and kindness toward stray and domestic animals from an early age. Supporting local animal shelters, adopting rescued pets, providing clean water and food for street animals, and boycotting products tested on animals are practical steps every citizen can take. By treating animals with compassion and respect, we build a more humane and sustainable world for all.",
    explanation_html: null,
    explanation_image_urls: [],
  },
];

const payload = {
  schema_version: '2.0',
  university: 'DU',
  session: '25-26',
  title: 'DU A 25-26 Written',
  exam_type: 'Written',
  total_questions: questions.length,
  questions,
};

const outPaths = [
  path.join(process.cwd(), 'public/assets/aistudio/DU_25-26_Written_f3fe4f9d.json'),
  path.join(process.cwd(), 'Question/DU/DU_25-26_Written.json'),
];

for (const p of outPaths) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote:', p);
}
