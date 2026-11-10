const fs = require('fs');
const path = require('path');

const questionsData = [
  // -------------------------------------------------------------
  // BANGLA (Questions 1 - 15)
  // -------------------------------------------------------------
  {
    num: 1,
    subject: "Bangla",
    text: "নিচের কোনটি 'অ' ধ্বনির সংবৃত উচ্চারণ নয়?",
    opts: [
      { label: "ক", text: "প্রতিভা" },
      { label: "খ", text: "অটল" },
      { label: "গ", text: "প্রত্যয়" },
      { label: "ঘ", text: "অতীত" }
    ],
    correct: "গ",
    exp: "বাংলা উচ্চারণে আদ্য 'অ'-এর পর য-ফলা যুক্ত ব্যঞ্জন থাকলে 'অ'-এর উচ্চারণ স্বাভাবিক বা বিবৃত [অ্যা] হয়। তাই 'প্রত্যয়' শব্দটির উচ্চারণ [প্রঅত্তয়্ / prættɔe̯] - এটি সংবৃত [ও]-কারান্ত নয়। অন্যদিকে প্রতিভা [প্রোতিভা], অটল [ওটোল্], অতীত [ওতীত্] শব্দগুলোতে 'অ' সংবৃত [ও]-এর মতো উচ্চারিত হয়।"
  },
  {
    num: 2,
    subject: "Bangla",
    text: "শুদ্ধ বানানগুচ্ছ কোনটি?",
    opts: [
      { label: "ক", text: "লবন, জিলানী" },
      { label: "খ", text: "রানী, দাসি" },
      { label: "গ", text: "নিশ্বাস, শিরশ্ছেদ" },
      { label: "ঘ", text: "ব্যবসা, ব্যাক্তি" }
    ],
    correct: "গ",
    exp: "• (ক) অপশনে 'লবণ' বানানে মূর্ধন্য-ণ হবে।<br>• (খ) অপশনে প্রমিত বানানে 'রানি' এবং 'দাসী' হবে।<br>• (ঘ) অপশনে 'ব্যক্তি' বানানে আকার হবে না।<br>• (গ) অপশনে 'নিশ্বাস' ও 'শিরশ্ছেদ' (শিরঃ + ছেদ) উভয় বানানই সম্পূর্ণ নির্ভুল ও শুদ্ধ।"
  },
  {
    num: 3,
    subject: "Bangla",
    text: "নিচের কোন শব্দজোড় বিপরীতার্থক?",
    opts: [
      { label: "ক", text: "নীরত - বিরত" },
      { label: "খ", text: "নিথর - নিস্পন্দ" },
      { label: "গ", text: "তট - তীর" },
      { label: "ঘ", text: "বিরাগ - অবজ্ঞা" }
    ],
    correct: "ক",
    exp: "'নীরত' শব্দের অর্থ কোনো কাজে গভীরভাবে মগ্ন বা নিয়োজিত থাকা, আর 'বিরত' শব্দের অর্থ কোনো কাজ থেকে নিবৃত্ত বা ক্ষান্ত থাকা। সুতরাং 'নীরত-বিরত' পরস্পর বিপরীতার্থক শব্দজোড়।"
  },
  {
    num: 4,
    subject: "Bangla",
    text: "'তাঁর পিঠে রক্তজবার মতো ক্ষত ছিল', কারণ -",
    opts: [
      { label: "ক", text: "তিনি কিংবদন্তির কথা বলতেন" },
      { label: "খ", text: "তিনি অরণ্য ও শ্বাপদের কথা বলতেন" },
      { label: "গ", text: "তাঁর করতলে পলিমাটির সৌরভ ছিল" },
      { label: "ঘ", text: "তিনি ক্রীতদাস ছিলেন" }
    ],
    correct: "ঘ",
    exp: "আবু জাফর ওবায়দুল্লাহ রচিত 'আমি কিংবদন্তির কথা বলছি' কবিতায় পূর্বপুরুষদের দাসত্ব ও নিগ্রহের ইতিহাস তুলে ধরে বলা হয়েছে: 'তাঁর পিঠে রক্তজবার মতো ক্ষত ছিল / কারণ তিনি ক্রীতদাস ছিলেন'।"
  },
  {
    num: 5,
    subject: "Bangla",
    text: "'এক থেকে শুরু করে ক্রমাগত' বাক্যের এককথায় প্রকাশ কী?",
    opts: [
      { label: "ক", text: "একাধিক্রমে" },
      { label: "খ", text: "একাহারে" },
      { label: "গ", text: "একাদিক্রমে" },
      { label: "ঘ", text: "একের পর এক" }
    ],
    correct: "গ",
    exp: "'এক থেকে শুরু করে ক্রমাগত' বাক্যসংকোচন বা এককথায় প্রকাশ হলো 'একাদিক্রমে' (এক + আদি + ক্রমে)।"
  },
  {
    num: 6,
    subject: "Bangla",
    text: "'Footnote' পরিভাষার বাংলা প্রতিশব্দ কোনটি?",
    opts: [
      { label: "ক", text: "পত্রবাহক" },
      { label: "খ", text: "পাদটীকা" },
      { label: "গ", text: "পদলেহন" },
      { label: "ঘ", text: "পদচিহ্ন" }
    ],
    correct: "খ",
    exp: "'Footnote' শব্দের প্রমিত বাংলা পারিভাষিক শব্দ হলো 'পাদটীকা' (পৃষ্ঠার নিচে প্রদত্ত ব্যাখ্যামূলক টীকা)।"
  },
  {
    num: 7,
    subject: "Bangla",
    text: "কোন শব্দটি উপসর্গযোগে গঠিত নয়?",
    opts: [
      { label: "ক", text: "উপদ্বীপ" },
      { label: "খ", text: "নাচার" },
      { label: "গ", text: "বেকার" },
      { label: "ঘ", text: "পঙ্কজ" }
    ],
    correct: "ঘ",
    exp: "• 'উপদ্বীপ' গঠিত হয়েছে 'উপ' উপসর্গযোগে।<br>• 'নাচার' গঠিত হয়েছে 'না' উপসর্গযোগে।<br>• 'বেকার' গঠিত হয়েছে 'বে' উপসর্গযোগে।<br>• 'পঙ্কজ' (পঙ্কে জন্মে যা) একটি উপপদ তৎপুরুষ সমাসবদ্ধ এবং প্রত্যয়সাধিত (পঙ্ক + জন্ + ড) শব্দ, এটি উপসর্গযোগে গঠিত নয়।"
  },
  {
    num: 8,
    subject: "Bangla",
    text: "'ফেব্রুয়ারি ১৯৬৯' কবিতায় 'কমলবন' কিসের প্রতীক?",
    opts: [
      { label: "ক", text: "গণ-অভ্যুত্থান" },
      { label: "খ", text: "মানবিকতা" },
      { label: "গ", text: "মাতৃভাষা" },
      { label: "ঘ", text: "প্রকৃতি" }
    ],
    correct: "খ",
    exp: "শামসুর রাহমানের 'ফেব্রুয়ারি ১৯৬৯' কবিতায় ঘাতকের হিংস্র থাবার বিপরীতে 'কমলবন' ধ্বংস হওয়া বলতে মূলত বিপন্ন মানবিকতা ও শাশ্বত শুভচেতনাকে বোঝানো হয়েছে।"
  },
  {
    num: 9,
    subject: "Bangla",
    text: "আভিধানিক ক্রমে সাজানো শব্দগুচ্ছ কোনটি?",
    opts: [
      { label: "ক", text: "তাল, তমাল, তেঁতুল" },
      { label: "খ", text: "দেশ, দ্বেষ, দোকান" },
      { label: "গ", text: "বাতাস, বাতায়ন, বিদ্যুৎ" },
      { label: "ঘ", text: "লিখন, লিপি, লেখক" }
    ],
    correct: "ঘ",
    exp: "বাংলা বর্ণানুক্রম অনুযায়ী ব্যঞ্জনের পর কারচিহ্নের ক্রম: অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ।<br>ল-বর্ণের শব্দগুলোতে কারচিহ্ন ও পরবর্ণের বিন্যাস:<br>১. লিখন: ল্ + ই + খ্<br>২. লিপি: ল্ + ই + প্ (যেহেতু খ-এর পরে প আসে)<br>৩. লেখক: ল্ + এ (ই-কারের পরে এ-কার আসে)।<br>অতএব 'লিখন, লিপি, লেখক' সম্পূর্ণ সঠিক আভিধানিক ক্রম।"
  },
  {
    num: 10,
    subject: "Bangla",
    text: "'খাস তালুকের প্রজা' প্রবাদটির অর্থ হলো-",
    opts: [
      { label: "ক", text: "খুব অনুগত ব্যক্তি" },
      { label: "খ", text: "সৎ ব্যক্তি" },
      { label: "গ", text: "তোষামোদকারী" },
      { label: "ঘ", text: "নিঃস্ব ব্যক্তি" }
    ],
    correct: "ক",
    exp: "'খাস তালুকের প্রজা' বাগধারার অর্থ হলো অতিশয় বাধ্য বা খুব অনুগত ব্যক্তি (যে সর্বদা নির্দেশ মেনে চলে)।"
  },
  {
    num: 11,
    subject: "Bangla",
    text: "'আমার পথ' প্রবন্ধ অনুসারে সত্যকে কিসের মধ্যে পাওয়া যায়?",
    opts: [
      { label: "ক", text: "পরিশ্রমের" },
      { label: "খ", text: "সাধনার" },
      { label: "গ", text: "ভুলের" },
      { label: "ঘ", text: "চেষ্টার" }
    ],
    correct: "গ",
    exp: "কাজী নজরুল ইসলামের 'আমার পথ' প্রবন্ধের বিখ্যাত উক্তি: 'ভুলের মধ্য দিয়েই তবে সত্যকে পাওয়া যায়। কোনো ভুল করছি বুঝতে পারলেই আমি সাথে সাথে তা সংশোধন করে নেব'।"
  },
  {
    num: 12,
    subject: "Bangla",
    text: "'শোনেন, মিলিটারি যাদের ধরে, মিছেমিছি ধরে না' - 'রেইনকোট' গল্পে এই উক্তিটি কার?",
    opts: [
      { label: "ক", text: "আকবর সাজিদ" },
      { label: "খ", text: "আবদুস সাত্তার মৃধা" },
      { label: "গ", text: "নুরুল হুদা" },
      { label: "ঘ", text: "আফাজ আহমদ" }
    ],
    correct: "ঘ",
    exp: "আখতারুজ্জামান ইলিয়াসের 'রেইনকোট' গল্পে ঢাকা কলেজের সুবিধাবাদী, পাকিস্তানি সেনাবাহিনীর দোসর অধ্যক্ষ ড. আফাজ আহমদ এই উক্তিটি করেছিলেন।"
  },
  {
    num: 13,
    subject: "Bangla",
    text: "'মানব-কল্যাণ' প্রবন্ধ অনুসারে মানব-কল্যাণের পথে প্রধান অন্তরায়-",
    opts: [
      { label: "ক", text: "রাষ্ট্র, জাতি, সম্প্রদায় ও গোষ্ঠীগত চেতনা" },
      { label: "খ", text: "দুস্থ, অবহেলিত, বাস্তুহারা, স্বদেশ-বিতাড়িত মানুষ" },
      { label: "গ", text: "অনুগ্রহকারী ও অনুগৃহীতের ব্যবধান" },
      { label: "ঘ", text: "মুক্ত বিচারবুদ্ধির অভাব" }
    ],
    correct: "ক",
    exp: "আবুল ফজলের 'মানব-কল্যাণ' প্রবন্ধ অনুযায়ী বিভক্ত মানবসমাজ ও সংকীর্ণ গণ্ডি অর্থাৎ 'রাষ্ট্র, জাতি, সম্প্রদায় ও গোষ্ঠীগত চেতনা' মানব-কল্যাণকে খণ্ডিত ও বাধাগ্রস্ত করে।"
  },
  {
    num: 14,
    subject: "Bangla",
    text: "'জিলাপি' কোন ভাষা থেকে আগত শব্দ?",
    opts: [
      { label: "ক", text: "ফরাসি" },
      { label: "খ", text: "তুর্কি" },
      { label: "গ", text: "হিন্দি" },
      { label: "ঘ", text: "জাপানি" }
    ],
    correct: "গ",
    exp: "'জিলাপি' শব্দটি আরবি-ফারসি 'জালাবিয়া' বা 'জালেবি' থেকে হিন্দি ভাষার মাধ্যমে বাংলা শব্দভাণ্ডারে প্রবেশ করেছে।"
  },
  {
    num: 15,
    subject: "Bangla",
    text: "প্রমিত বাংলায় তাড়নজাত ধ্বনি কয়টি?",
    opts: [
      { label: "ক", text: "২টি" },
      { label: "খ", text: "৩টি" },
      { label: "গ", text: "৪টি" },
      { label: "ঘ", text: "৫টি" }
    ],
    correct: "ক",
    exp: "বাংলা ব্যাকরণে যে ধ্বনি উচ্চারণের সময় জিভের অগ্রভাগ দ্বারা দন্তমূলীয় অঞ্চলের পিঠে দ্রুত এক বা একাধিক টোকা বা আঘাত লাগে তাকে তাড়নজাত ধ্বনি বলে। প্রমিত বাংলায় তাড়নজাত ধ্বনি ২টি: 'ড়' এবং 'ঢ়'।"
  },

  // -------------------------------------------------------------
  // ENGLISH (Questions 16 - 30)
  // -------------------------------------------------------------
  {
    num: 16,
    subject: "English",
    text: "Identify the error in the following sentence: “Each of the students are responsible for their homework.”",
    opts: [
      { label: "ক", text: "are" },
      { label: "খ", text: "their" },
      { label: "গ", text: "students" },
      { label: "ঘ", text: "homework" }
    ],
    correct: "ক",
    exp: "The distributive pronoun 'Each' is singular and must take a singular verb ('is' instead of 'are'). The corrected sentence is: “Each of the students is responsible for their homework.”"
  },
  {
    num: 17,
    subject: "English",
    text: "An entomologist ___________.",
    opts: [
      { label: "ক", text: "specializes in the study of soil classification" },
      { label: "খ", text: "studies insects" },
      { label: "গ", text: "specializes in providing health care for animals" },
      { label: "ঘ", text: "advocates for the protection of the environment" }
    ],
    correct: "খ",
    exp: "Entomology is the branch of zoology concerned with the study of insects. Therefore, an entomologist is a scientist who studies insects."
  },
  {
    num: 18,
    subject: "English",
    text: "The word with incorrect spelling is-",
    opts: [
      { label: "ক", text: "intervension" },
      { label: "খ", text: "intoxicate" },
      { label: "গ", text: "intertwine" },
      { label: "ঘ", text: "intestine" }
    ],
    correct: "ক",
    exp: "The correct spelling is 'intervention' (spelled with a 't', not an 's')."
  },
  {
    num: 19,
    subject: "English",
    text: "Meditation _________ anxiety and __________ a state of calmness.",
    opts: [
      { label: "ক", text: "relaxes, releases" },
      { label: "খ", text: "retains, brings" },
      { label: "গ", text: "releases, brings" },
      { label: "ঘ", text: "drains, purifies" }
    ],
    correct: "গ",
    exp: "Contextually, meditation 'releases' (relieves/lets go of) anxiety and 'brings' (induces) a state of calmness."
  },
  {
    num: 20,
    subject: "English",
    text: "That's the man _________ I spoke about the job.",
    opts: [
      { label: "ক", text: "whom" },
      { label: "খ", text: "to whom" },
      { label: "গ", text: "which" },
      { label: "ঘ", text: "whose" }
    ],
    correct: "খ",
    exp: "The verb 'speak' requires the preposition 'to' when addressing a person ('speak to someone about something'). In formal relative clauses, the preposition precedes the relative pronoun: 'to whom I spoke'."
  },
  {
    num: 21,
    subject: "English",
    text: "Which one is grammatically correct?",
    opts: [
      { label: "ক", text: "I am to blame for the lapses." },
      { label: "খ", text: "I is to blame for the lapses." },
      { label: "গ", text: "It is me who is to blame." },
      { label: "ঘ", text: "It is me who am to blame." }
    ],
    correct: "ক",
    exp: "The idiom 'to be to blame' means to be responsible for something bad. 'I am to blame' is the standard, natural English expression."
  },
  {
    num: 22,
    subject: "English",
    text: "You sat for the IELTS examination this year, ____?",
    opts: [
      { label: "ক", text: "have you?" },
      { label: "খ", text: "can't you?" },
      { label: "গ", text: "weren't you?" },
      { label: "ঘ", text: "didn't you?" }
    ],
    correct: "ঘ",
    exp: "The main clause verb 'sat' is in the simple past affirmative tense. Tag questions for simple past affirmative statements use 'didn't + pronoun'."
  },
  {
    num: 23,
    subject: "English",
    text: "The synonym of 'concord' is-",
    opts: [
      { label: "ক", text: "animosity" },
      { label: "খ", text: "amity" },
      { label: "গ", text: "variance" },
      { label: "ঘ", text: "discord" }
    ],
    correct: "খ",
    exp: "'Concord' means agreement, peace, and harmony between people or groups. Its synonym is 'amity' (friendly relations)."
  },
  {
    num: 24,
    subject: "English",
    text: "We didn't win the match, we were happy with our team's performance ____.",
    opts: [
      { label: "ক", text: "although" },
      { label: "খ", text: "though" },
      { label: "গ", text: "also" },
      { label: "ঘ", text: "despite" }
    ],
    correct: "খ",
    exp: "When placed at the end of a sentence, 'though' is an adverb meaning 'however' or 'nevertheless'."
  },
  {
    num: 25,
    subject: "English",
    text: "If you are 'empathetic', you ____.",
    opts: [
      { label: "ক", text: "have the ability to understand the feelings of others" },
      { label: "খ", text: "feel pity for others" },
      { label: "গ", text: "are unable to forgive someone" },
      { label: "ঘ", text: "are elated" }
    ],
    correct: "ক",
    exp: "'Empathetic' describes the capacity to understand and share the emotions, experiences, and feelings of others."
  },
  {
    num: 26,
    subject: "English",
    text: "The antonym of 'detrimental' is-",
    opts: [
      { label: "ক", text: "conservative" },
      { label: "খ", text: "disproportionate" },
      { label: "গ", text: "mischievous" },
      { label: "ঘ", text: "beneficial" }
    ],
    correct: "ঘ",
    exp: "'Detrimental' means tending to cause harm or damage. Its direct opposite is 'beneficial' (producing good or helpful results)."
  },
  {
    num: 27,
    subject: "English",
    text: "_________ you mind closing the window, please? It's very cold outside.",
    opts: [
      { label: "ক", text: "Could" },
      { label: "খ", text: "Should" },
      { label: "গ", text: "Would" },
      { label: "ঘ", text: "Can" }
    ],
    correct: "গ",
    exp: "The polite request structure takes the modal verb 'Would': “Would you mind + verb-ing...?”"
  },
  {
    num: 28,
    subject: "English",
    text: "The auditorium is not available for use this week. It _____________.",
    opts: [
      { label: "ক", text: "is refurbished" },
      { label: "খ", text: "is being refurbished" },
      { label: "গ", text: "refurbished" },
      { label: "ঘ", text: "has refurbished" }
    ],
    correct: "খ",
    exp: "An ongoing action happening around the present moment requires the present continuous passive tense: 'is being + past participle'."
  },
  {
    num: 29,
    subject: "English",
    text: "By next month, Shraboni ____ in the bank for five years.",
    opts: [
      { label: "ক", text: "may work" },
      { label: "খ", text: "has worked" },
      { label: "গ", text: "will have worked" },
      { label: "ঘ", text: "works" }
    ],
    correct: "গ",
    exp: "A timeframe introduced with 'By + future time' expressing duration up to that point takes the future perfect tense: 'will have worked'."
  },
  {
    num: 30,
    subject: "English",
    text: "I cannot be subservient __________ him.",
    opts: [
      { label: "ক", text: "on" },
      { label: "খ", text: "by" },
      { label: "গ", text: "over" },
      { label: "ঘ", text: "to" }
    ],
    correct: "ঘ",
    exp: "The adjective 'subservient' takes the preposition 'to' (subservient to someone = prepared to obey others unquestioningly)."
  },

  // -------------------------------------------------------------
  // PHYSICS (Questions 31 - 45)
  // -------------------------------------------------------------
  {
    num: 31,
    subject: "Physics",
    text: "নিচের কোনটি $a$ থেকে $e$ বিন্দু পর্যন্ত একটি সরল দোলকের ববের ত্বরণ সবচেয়ে ভালোমতো চিত্রায়িত করে? (Which of the following best illustrates the acceleration of the bob of a simple pendulum from point $a$ to $e$?)",
    opts: [
      { label: "ক", text: "" },
      { label: "খ", text: "" },
      { label: "গ", text: "" },
      { label: "ঘ", text: "" }
    ],
    correct: "গ",
    exp: "সরল দোলকের ক্ষেত্রে:<br>• প্রান্তীয় বিন্দু $a$ ও $e$-তে বেগ শূন্য হওয়ায় কেন্দ্রমুখী ত্বরণ শূন্য, কেবল স্পর্শকীয় প্রত্যয়নী ত্বরণ বিদ্যমান যা সাম্যাবস্থা $c$-এর দিকে নির্দেশিত।<br>• মধ্যবর্তী সাম্যাবস্থা $c$-তে স্পর্শকীয় ত্বরণ শূন্য, কিন্তু বেগ সর্বোচ্চ হওয়ায় কেবল উলম্বভাবে উপরমুখী কেন্দ্রমুখী ত্বরণ ($a_c = v^2/L$) ক্রিয়াশীল।<br>গ্রাফ (গ)-তে এই ত্বরণ ভেক্টরগুলোর সঠিক দিক প্রদর্শিত।"
  },
  {
    num: 32,
    subject: "Physics",
    text: "একটি পোস্ট অফিস বক্সের ৪র্থ বাহু $S$-এ $1.0\\text{ m}$ দৈর্ঘ্য এবং $1 \\times 10^{-6}\\text{ m}^2$ প্রস্থচ্ছেদের একই ধাতুর দুটি তার সমান্তরালে যুক্ত করা হলো। এখন $P$ বাহু থেকে $1000\\,\\Omega$, $Q$ বাহু থেকে $10\\,\\Omega$ এবং $R$ বাহু থেকে $2000\\,\\Omega$ রোধের প্লাগ উঠালে গ্যালভানোমিটার শূন্য বিক্ষেপ দেয়। তারের উপাদানের আপেক্ষিক রোধ কত?",
    opts: [
      { label: "ক", text: "$20 \\times 10^{-6}\\,\\Omega\\cdot\\text{m}$" },
      { label: "খ", text: "$40 \\times 10^{-6}\\,\\Omega\\cdot\\text{m}$" },
      { label: "গ", text: "$20 \\times 10^{6}\\,\\Omega\\cdot\\text{m}$" },
      { label: "ঘ", text: "$40 \\times 10^{6}\\,\\Omega\\cdot\\text{m}$" }
    ],
    correct: "খ",
    exp: "হুইটস্টোন ব্রিজের সাম্যাবস্থার শর্তানুযায়ী:<br>$\\frac{P}{Q} = \\frac{R}{S} \\implies S = \\frac{Q \\times R}{P} = \\frac{10 \\times 2000}{1000} = 20\\,\\Omega$।<br>যেহেতু ৪র্থ বাহুতে দুটি অভিন্ন তার সমান্তরালে যুক্ত এবং তাদের তুল্য রোধ $S = 20\\,\\Omega$, সুতরাং প্রতিটি তারের নিজস্ব রোধ:<br>$R_{\\text{wire}} = 2 \\times S = 2 \\times 20 = 40\\,\\Omega$।<br>তারের আপেক্ষিক রোধ $\\rho = \\frac{R_{\\text{wire}} A}{l} = \\frac{40 \\times (1 \\times 10^{-6}\\text{ m}^2)}{1.0\\text{ m}} = 40 \\times 10^{-6}\\,\\Omega\\cdot\\text{m}$।"
  },
  {
    num: 33,
    subject: "Physics",
    text: "একটি অনুভূমিক ঘর্ষণহীন তলের উপর একটি কণা প্রাথমিকভাবে স্থির অবস্থায় আছে। কণাটির উপর একটি ধ্রুব অনুভূমিক বল $F$ প্রযুক্ত হচ্ছে। নিচের কোন লেখচিত্রটি কৃতকাজ $W$ বনাম দ্রুতি $v$ সঠিকভাবে প্রকাশ করে?",
    opts: [
      { label: "ক", text: "" },
      { label: "খ", text: "" },
      { label: "গ", text: "" },
      { label: "ঘ", text: "" }
    ],
    correct: "খ",
    exp: "কাজ-শক্তি উপপাদ্য অনুযায়ী, প্রযুক্ত বল দ্বারা কৃতকাজ কণাটির গতিশক্তি পরিবর্তনের সমান:<br>$W = \\Delta K = \\frac{1}{2} m v^2 - 0 = \\frac{1}{2} m v^2$।<br>এখানে $W \\propto v^2$, যা মূলবিন্দুগামী একটি পরাবৃত্তের সমীকরণ ($y = k x^2$)। অতএব $W$ বনাম $v$ লেখচিত্রটি একটি ঊর্ধ্বমুখী বক্ররেখা (পরাবৃত্তীয় আকার)।"
  },
  {
    num: 34,
    subject: "Physics",
    text: "একটি তাপগতীয় সিস্টেমকে দুটি ভিন্ন পথে $A$ অবস্থা থেকে $B$ অবস্থায় নেওয়া হয়। এই দুটি পথের তাপ শোষণ এবং সিস্টেম কর্তৃক কৃতকাজ যথাক্রমে $Q_1, Q_2$ এবং $W_1, W_2$। এই প্রক্রিয়ার জন্য কোনটি সঠিক?",
    opts: [
      { label: "ক", text: "$Q_1 = Q_2$" },
      { label: "খ", text: "$W_1 = W_2$" },
      { label: "গ", text: "$Q_1 + W_1 = Q_2 + W_2$" },
      { label: "ঘ", text: "$Q_1 - W_1 = Q_2 - W_2$" }
    ],
    correct: "ঘ",
    exp: "তাপগতিবিদ্যার ১ম সূত্রানুযায়ী $\\Delta U = Q - W$। অন্তঃস্থ শক্তি $U$ একটি অবস্থা অপেক্ষক (State function), যা পথের ওপর নির্ভর করে না, কেবল আদি ও চূড়ান্ত অবস্থার ওপর নির্ভর করে।<br>অতএব উভয় পথেই অন্তঃস্থ শক্তির পরিবর্তন সমান: $\\Delta U_1 = \\Delta U_2 \\implies Q_1 - W_1 = Q_2 - W_2$।"
  },
  {
    num: 35,
    subject: "Physics",
    text: "নিম্নের কোন বিবৃতিটি একটি ২-ইনপুট বিশিষ্ট XOR গেটের জন্য সত্য?",
    opts: [
      { label: "ক", text: "উভয় ইনপুট ১ হলেই আউটপুট ১ হয়" },
      { label: "খ", text: "উভয় ইনপুট ০ হলেই আউটপুট ১ হয়" },
      { label: "গ", text: "ইনপুটগুলো ভিন্ন হলে আউটপুট ১ হয়" },
      { label: "ঘ", text: "ইনপুটগুলো ভিন্ন হলে আউটপুট ০ হয়" }
    ],
    correct: "গ",
    exp: "XOR (Exclusive OR) গেটের আউটপুট সমীকরণ $Y = A \\oplus B = \\bar{A}B + A\\bar{B}$।<br>যখন দুটি ইনপুট অসদৃশ বা ভিন্ন হয় (অর্থাৎ $A=0, B=1$ অথবা $A=1, B=0$), কেবল তখনই আউটপুট ১ হয়।"
  },
  {
    num: 36,
    subject: "Physics",
    text: "একটি প্রোটনের গতিশক্তি এর মোট শক্তির $75\\%$। প্রোটনটির দ্রুতি কত?",
    opts: [
      { label: "ক", text: "$\\frac{\\sqrt{15}}{4} c$" },
      { label: "খ", text: "$\\frac{3}{4} c$" },
      { label: "গ", text: "$\\frac{9}{16} c$" },
      { label: "ঘ", text: "$\\frac{15}{16} c$" }
    ],
    correct: "ক",
    exp: "আপেক্ষিকতার সূত্র অনুযায়ী মোট শক্তি $E = K + E_0$।<br>প্রশ্নমতে $K = 0.75 E \\implies E_0 = E - 0.75 E = 0.25 E = \\frac{E}{4}$।<br>আমরা জানি $E = \\gamma E_0 \\implies \\gamma = \\frac{E}{E_0} = 4$।<br>$\\frac{1}{\\sqrt{1 - \\frac{v^2}{c^2}}} = 4 \\implies 1 - \\frac{v^2}{c^2} = \\frac{1}{16} \\implies \\frac{v^2}{c^2} = \\frac{15}{16} \\implies v = \\frac{\\sqrt{15}}{4} c$।"
  },
  {
    num: 37,
    subject: "Physics",
    text: "একটি অপবর্তন গ্রেটিং ব্যবহার করে পর্দায় আলোর ডোরা পাওয়া যায়। সমস্ত যন্ত্রপাতি $1.33$ প্রতিসরাঙ্কের একটি তরলে নিমজ্জিত করলে পর্দায় গঠিত হওয়া আলোর ডোরাগুলোর কী পরিবর্তন হবে?",
    opts: [
      { label: "ক", text: "অপরিবর্তিত থাকে" },
      { label: "খ", text: "ছড়িয়ে যায়" },
      { label: "গ", text: "কাছাকাছি আসে" },
      { label: "ঘ", text: "এক পাশে সরে যায়" }
    ],
    correct: "গ",
    exp: "তরলে নিমজ্জিত করলে আলোর কার্যকর তরঙ্গদৈর্ঘ্য হ্রাস পায়: $\\lambda' = \\frac{\\lambda}{\\mu} = \\frac{\\lambda}{1.33}$।<br>অপবর্তন সমীকরণ $d \\sin\\theta = n \\lambda' = \\frac{n \\lambda}{\\mu}$।<br>যেহেতু তরঙ্গদৈর্ঘ্য কমে যায়, অপবর্তন কোণ $\\theta$ হ্রাস পায়, ফলে অপবর্তন ঝালরগুলো সংকুচিত হয়ে পরস্পরের কাছাকাছি আসে।"
  },
  {
    num: 38,
    subject: "Physics",
    text: "একটি প্রক্রিয়ায় একটি আদর্শ গ্যাসের চাপ দ্বিগুণ করা হয়, যেখানে গ্যাস কর্তৃক ত্যাগকৃত তাপ এর ওপর কৃতকাজের সমান। এর ফলে গ্যাসের আয়তনের কী পরিবর্তন হবে?",
    opts: [
      { label: "ক", text: "দ্বিগুণ হবে" },
      { label: "খ", text: "অর্ধেক হবে" },
      { label: "গ", text: "অপরিবর্তিত থাকবে" },
      { label: "ঘ", text: "আরো তথ্য প্রয়োজন" }
    ],
    correct: "খ",
    exp: "গ্যাস কর্তৃক ত্যাগকৃত তাপ $-Q$ এবং গ্যাসের ওপর কৃতকাজ $-W$।<br>শর্তমতে ত্যাগকৃত তাপ কৃতকাজের সমান $\\implies \\Delta Q = \\Delta W$।<br>তাপগতিবিদ্যার ১ম সূত্র $\\Delta U = \\Delta Q - \\Delta W = 0$।<br>যেহেতু অন্তঃস্থ শক্তির পরিবর্তন শূন্য, তাই তাপমাত্রা ধ্রুবক (সমোষ্ণ প্রক্রিয়া)।<br>সমোষ্ণ প্রক্রিয়ায় বয়েলের সূত্রানুযায়ী $P_1 V_1 = P_2 V_2$। চাপ দ্বিগুণ ($P_2 = 2P_1$) করা হলে আয়তন অর্ধেক ($V_2 = V_1 / 2$) হয়ে যাবে।"
  },
  {
    num: 39,
    subject: "Physics",
    text: "একটি বুলেট সোজা উপরে নিক্ষিপ্ত হওয়ার $10\\text{ s}$ পর তার প্রারম্ভিক বিন্দুতে ফিরে আসে। বুলেটের প্রারম্ভিক উৎক্ষেপণ বেগ কত ছিল? ($g = 9.8\\text{ m/s}^2$)",
    opts: [
      { label: "ক", text: "$9.8\\text{ m/s}$" },
      { label: "খ", text: "$25.0\\text{ m/s}$" },
      { label: "গ", text: "$49.0\\text{ m/s}$" },
      { label: "ঘ", text: "$98.0\\text{ m/s}$" }
    ],
    correct: "গ",
    exp: "উল্লম্ব গতির মোট বিচরণকাল $T = \\frac{2u}{g}$।<br>$10 = \\frac{2u}{9.8} \\implies u = \\frac{10 \\times 9.8}{2} = 49.0\\text{ m/s}$।"
  },
  {
    num: 40,
    subject: "Physics",
    text: "তিনটি ভেক্টর $\\vec{A} = 6\\hat{\\imath} - 8\\hat{\\jmath}$, $\\vec{B} = -8\\hat{\\imath} + 3\\hat{\\jmath}$ এবং $\\vec{C} = 26\\hat{\\imath} + 19\\hat{\\jmath}$ দেওয়া আছে। যদি $a\\vec{A} + b\\vec{B} + \\vec{C} = \\vec{0}$ হয়, তবে $a$ ও $b$ এর মান কত?",
    opts: [
      { label: "ক", text: "$a = 7, b = 5$" },
      { label: "খ", text: "$a = 5, b = 7$" },
      { label: "গ", text: "$a = 5, b = 8$" },
      { label: "ঘ", text: "$a = 3, b = 7$" }
    ],
    correct: "খ",
    exp: "ভেক্টর উপাংশ সমীকরণ গঠন করি:<br>$\\hat{\\imath}$ উপাংশ: $6a - 8b + 26 = 0 \\implies 3a - 4b = -13$ ... (i)<br>$\\hat{\\jmath}$ উপাংশ: $-8a + 3b + 19 = 0 \\implies 8a - 3b = 19$ ... (ii)<br>(i) কে ৩ এবং (ii) কে ৪ দ্বারা গুণ করে পাই:<br>$9a - 12b = -39$<br>$32a - 12b = 76$<br>বিয়োগ করে: $23a = 115 \\implies a = 5$।<br>(i) নং এ $a = 5$ বসিয়ে: $3(5) - 4b = -13 \\implies 4b = 28 \\implies b = 7$।"
  },
  {
    num: 41,
    subject: "Physics",
    text: "একটি বর্গক্ষেত্রের দুটি বিপরীত শীর্ষে $Q$ চার্জ এবং অপর দুটি শীর্ষে $q$ চার্জ স্থাপন করা হলো। চার্জের যেকোনো একটির ওপর লব্ধি বল শূন্য হলে $Q/q$ এর মান কত?",
    opts: [
      { label: "ক", text: "$-1$" },
      { label: "খ", text: "$1$" },
      { label: "গ", text: "$-\\frac{1}{\\sqrt{2}}$" },
      { label: "ঘ", text: "$-2\\sqrt{2}$" }
    ],
    correct: "ঘ",
    exp: "বর্গক্ষেত্রের এক বাহুর দৈর্ঘ্য $a$ হলে, অপর বিপরীত শীর্ষের চার্জের দূরত্ব $a\\sqrt{2}$।<br>$Q$ চার্জের ওপর অন্য দুটি $q$ চার্জের লব্ধি বল $= \\sqrt{2} \\frac{k Q q}{a^2}$।<br>বিপরীত শীর্ষের $Q$ চার্জের বল $= \\frac{k Q^2}{2 a^2}$।<br>লব্ধি বল শূন্য হওয়ার শর্তে:<br>$\\sqrt{2} \\frac{k Q q}{a^2} + \\frac{k Q^2}{2 a^2} = 0 \\implies \\sqrt{2} q + \\frac{Q}{2} = 0 \\implies Q = -2\\sqrt{2} q \\implies \\frac{Q}{q} = -2\\sqrt{2}$।"
  },
  {
    num: 42,
    subject: "Physics",
    text: "$x = e^{-2t}, y = 2\\cos 3t$ এবং $z = 2\\sin 2t$ দ্বারা বর্ণিত বক্রপথে একটি কণা ভ্রমণ করে। $t = 0\\text{ s}$ সময়ে কণাটির বেগ কত হবে?",
    opts: [
      { label: "ক", text: "$-2\\hat{\\imath} + 4\\hat{k}$" },
      { label: "খ", text: "$-2\\hat{\\imath} - 6\\hat{\\jmath} + 4\\hat{k}$" },
      { label: "গ", text: "$-\\hat{\\imath} + 2\\hat{\\imath}$" },
      { label: "ঘ", text: "$2\\hat{\\imath} + 6\\hat{\\jmath} + 4\\hat{k}$" }
    ],
    correct: "ক",
    exp: "বেগ ভেক্টরের উপাংশগুলো হলো:<br>$v_x = \\frac{dx}{dt} = -2e^{-2t} \\xrightarrow{t=0} -2$<br>$v_y = \\frac{dy}{dt} = -6\\sin 3t \\xrightarrow{t=0} 0$<br>$v_z = \\frac{dz}{dt} = 4\\cos 2t \\xrightarrow{t=0} 4$<br>অতএব $\\vec{v} = -2\\hat{\\imath} + 0\\hat{\\jmath} + 4\\hat{k} = -2\\hat{\\imath} + 4\\hat{k}$।"
  },
  {
    num: 43,
    subject: "Physics",
    text: "$n = 2 \\rightarrow n = 1$ ধাপান্তরের জন্য নিচের কোনটি ক্ষুদ্রতম তরঙ্গদৈর্ঘ্যের ফোটন উৎপন্ন করে?",
    opts: [
      { label: "ক", text: "$\\text{H}$" },
      { label: "খ", text: "$\\text{D}$" },
      { label: "গ", text: "$\\text{He}^+$" },
      { label: "ঘ", text: "$\\text{Li}^{2+}$" }
    ],
    correct: "ঘ",
    exp: "রিডবার্গ সমীকরণ অনুযায়ী $\\frac{1}{\\lambda} = R_H Z^2 \\left(\\frac{1}{1^2} - \\frac{1}{2^2}\\right) \\implies \\lambda \\propto \\frac{1}{Z^2}$।<br>পারমাণবিক সংখ্যা $Z$ যত বেশি, তরঙ্গদৈর্ঘ্য $\\lambda$ তত ক্ষুদ্রতম হবে। প্রদত্ত আয়নগুলোর মধ্যে লিথিয়ামের $Z = 3$ (সর্বাধিক), তাই $\\text{Li}^{2+}$ ক্ষুদ্রতম তরঙ্গদৈর্ঘ্যের ফোটন নির্গমন করবে।"
  },
  {
    num: 44,
    subject: "Physics",
    text: "পৃথিবীপৃষ্ঠ থেকে $m$ ভরের একটি বস্তু উল্লম্ব বরাবর উপরের দিকে নিক্ষিপ্ত হয়ে সর্বোচ্চ $r_m$ উচ্চতায় উঠলে এর আদিবেগ $v_i$ কত? (পৃথিবীর ব্যাসার্ধ $R_E$ এবং ভর $M_E$)",
    opts: [
      { label: "ক", text: "$v_i = \\sqrt{2GM_g\\left(\\frac{1}{R_E} - \\frac{1}{R_E + r_m}\\right)}$" },
      { label: "খ", text: "$v_i = \\sqrt{2GM_E\\left(\\frac{1}{R_E} - \\frac{1}{R_E + r_m}\\right)}$" },
      { label: "গ", text: "$v_i = \\sqrt{2g(R_E + r_m)}$" },
      { label: "ঘ", text: "$v_i = \\sqrt{2GM_E\\left(\\frac{1}{R_E + r_m} - \\frac{1}{R_E}\\right)}$" }
    ],
    correct: "খ",
    exp: "শক্তি সংরক্ষণশীলতার নীতি অনুযায়ী:<br>$\\frac{1}{2} m v_i^2 - \\frac{GM_E m}{R_E} = 0 - \\frac{GM_E m}{R_E + r_m}$<br>$\\implies \\frac{1}{2} v_i^2 = GM_E \\left(\\frac{1}{R_E} - \\frac{1}{R_E + r_m}\\right) \\implies v_i = \\sqrt{2GM_E\\left(\\frac{1}{R_E} - \\frac{1}{R_E + r_m}\\right)}$।"
  },
  {
    num: 45,
    subject: "Physics",
    text: "$1.1\\text{ m}$ দৈর্ঘ্য ও $2.0\\text{ cm}$ ব্যাসবিশিষ্ট একটি অনুভূমিক রডের একপ্রান্ত দেয়ালে আটকানো। অপর প্রান্তে $31.4\\text{ kg}$ ভর ঝুলালে এর কৌণিক বিকৃতি $0.01\\text{ rad}$ হয়। রডের উপাদানের দৃঢ়তার গুণাঙ্ক কত? ($g = 10\\text{ ms}^{-2}$)",
    opts: [
      { label: "ক", text: "$0.257\\text{ MPa}$" },
      { label: "খ", text: "$0.1\\text{ GPa}$" },
      { label: "গ", text: "$1.670\\text{ MPa}$" },
      { label: "ঘ", text: "$2418.18\\text{ GPa}$" }
    ],
    correct: "খ",
    exp: "রডের ব্যাসার্ধ $r = 1.0\\text{ cm} = 10^{-2}\\text{ m}$। প্রস্থচ্ছেদের ক্ষেত্রফল $A = \\pi r^2 = 3.14 \\times 10^{-4}\\text{ m}^2$।<br>প্রযুক্ত বল $F = mg = 31.4 \\times 10 = 314\\text{ N}$।<br>কৃন্তন পীড়ন $= \\frac{F}{A} = \\frac{314}{3.14 \\times 10^{-4}} = 10^6\\text{ N/m}^2$।<br>দৃঢ়তার গুণাঙ্ক $\\eta = \\frac{\\text{পীড়ন}}{\\text{কৌণিক বিকৃতি}} = \\frac{10^6}{0.01} = 10^8\\text{ Pa} = 0.1\\text{ GPa}$।"
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Questions 46 - 60)
  // -------------------------------------------------------------
  {
    num: 46,
    subject: "Chemistry",
    text: "কোন যৌগটি জলীয় ব্রোমিন দ্রবণের সাথে বিক্রিয়া করে না?",
    opts: [
      { label: "ক", text: "$\\text{CH}_3-\\text{CH}=\\text{CH}_2$" },
      { label: "খ", text: "$\\text{C}_6\\text{H}_5\\text{OH}$" },
      { label: "গ", text: "$\\text{C}_6\\text{H}_5\\text{NH}_2$" },
      { label: "ঘ", text: "$\\text{C}_6\\text{H}_5\\text{CH}_3$" }
    ],
    correct: "ঘ",
    exp: "• প্রোপিন (অ্যালকিন) ব্রোমিন পানির লাল বর্ণ দূরীভূত করে।<br>• ফেনল ও অ্যানিলিনে সক্রিয়কারী গ্রুপ ($-\\text{OH}, -\\text{NH}_2$) থাকায় সাধারণ তাপমাত্রায় ব্রোমিন পানির সাথে বিক্রিয়া করে যথাক্রমে ২,৪,৬-ট্রাইব্রোমোফেনল ও ২,৪,৬-ট্রাইব্রোমোঅ্যানিলিনের সাদা অধঃক্ষেপ ফেলে।<br>• টলুইন ($\\text{C}_6\\text{H}_5\\text{CH}_3$) ব্রোমিন পানির সাথে কোনো বিক্রিয়া প্রদর্শন করে না (এর জন্য হ্যালোজেন বাহক প্রভাবক $\\text{FeBr}_3$ বা উচ্চ তাপ প্রয়োজন)।"
  },
  {
    num: 47,
    subject: "Chemistry",
    text: "কোন যৌগটি টোটোমারিজম দেখায়?",
    opts: [
      { label: "ক", text: "$\\text{CH}_3\\text{COCH}_3$" },
      { label: "খ", text: "$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{OH}$" },
      { label: "গ", text: "$\\text{CH}_3\\text{CH}=\\text{CH}_2$" },
      { label: "ঘ", text: "$\\text{CH}_3\\text{CH}_2\\text{COOH}$" }
    ],
    correct: "ক",
    exp: "অ্যাসিটোন বা প্রোপানোন ($\\text{CH}_3\\text{COCH}_3$)-এ সক্রিয় $\\alpha$-হাইড্রোজেন বিদ্যমান থাকায় এটি গতিশীল কিটো-ইনোল টোটোমারিজম প্রদর্শন করে:<br>$\\text{CH}_3-\\text{C}(=\\text{O})-\\text{CH}_3 \\rightleftharpoons \\text{CH}_3-\\text{C(OH)}=\\text{CH}_2$।"
  },
  {
    num: 48,
    subject: "Chemistry",
    text: "একটি নির্দেশকের $\\text{pK}_{in}$ এর মান $9.3$ হলে নির্দেশকটি কোন টাইট্রেশনের জন্য সর্বোত্তম?",
    opts: [
      { label: "ক", text: "$\\text{HCl} + \\text{NH}_4\\text{OH}$" },
      { label: "খ", text: "$\\text{HCOOH} + \\text{NaOH}$" },
      { label: "গ", text: "$\\text{CH}_3\\text{COOH} + \\text{NH}_4\\text{OH}$" },
      { label: "ঘ", text: "$\\text{HCOOH} + \\text{Na}_2\\text{CO}_3$" }
    ],
    correct: "খ",
    exp: "যে নির্দেশকের $\\text{pK}_{in} = 9.3$, তার কার্যকর বর্ণ পরিবর্তনের pH পরিসর প্রায় $8.3 - 10.3$ (যেমন ফেনলফথ্যালিন)। দুর্বল এসিড ($\\text{HCOOH}$) এবং তীব্র ক্ষার ($\\text{NaOH}$) এর টাইট্রেশনে সমাপ্তি বিন্দু ক্ষারীয় অঞ্চলে ($\text{pH} > 7$, সাধারণত ৮-১০) অবস্থান করায় এই নির্দেশকটি সর্বোত্তম।"
  },
  {
    num: 49,
    subject: "Chemistry",
    text: "$\\text{CH}_3\\text{CONH}_2 + \\text{Br}_2 + 4\\text{KOH} \\xrightarrow{\\Delta} \\text{CH}_3\\text{NH}_2 + 2\\text{KBr} + \\text{K}_2\\text{CO}_3 + 2\\text{H}_2\\text{O}$ বিক্রিয়াটির নাম কী?",
    opts: [
      { label: "ক", text: "হফম্যান ক্ষুদ্রাংশকরণ" },
      { label: "খ", text: "স্যান্ডমেয়ার বিক্রিয়া" },
      { label: "গ", text: "উর্টজ-ফিটিগ বিক্রিয়া" },
      { label: "ঘ", text: "ক্লিমেনসেন বিজারণ" }
    ],
    correct: "ক",
    exp: "ব্রোমিন ও কস্টিক পটাশ দ্রবণ সহযোগে এসিড অ্যামাইডকে উত্তপ্ত করে এক কার্বন কম বিশিষ্ট প্রাইমারি অ্যামিন তৈরির বিক্রিয়াটিকে হফম্যান ডিগ্রেডেশন বা হফম্যান ক্ষুদ্রাংশকরণ বিক্রিয়া বলে।"
  },
  {
    num: 50,
    subject: "Chemistry",
    text: "একই তাপমাত্রা ও চাপে কোন গ্যাসের $1.0\\text{ g}$ সবচেয়ে বেশি আয়তন দখল করে?",
    opts: [
      { label: "ক", text: "$\\text{N}_2$" },
      { label: "খ", text: "$\\text{O}_2$" },
      { label: "গ", text: "$\\text{NH}_3$" },
      { label: "ঘ", text: "$\\text{Ar}$" }
    ],
    correct: "গ",
    exp: "আদর্শ গ্যাস সূত্রানুযায়ী $V = \\frac{nRT}{P} = \\frac{w}{M}\\frac{RT}{P}$। নির্দিষ্ট ভর ও স্থির $T, P$ এ $V \\propto \\frac{1}{M}$।<br>মোলার ভর: $\\text{N}_2 = 28, \\text{O}_2 = 32, \\text{NH}_3 = 17, \\text{Ar} = 40$।<br>অ্যামোনিয়ার ($\\text{NH}_3$) মোলার ভর সর্বনিম্ন হওয়ায় এর ১ গ্রাম সর্বাধিক মোল সংখ্যা ধারণ করে এবং সর্বাধিক আয়তন দখল করে।"
  },
  {
    num: 51,
    subject: "Chemistry",
    text: "কোন $d$-অরবিটালগুলো অক্ষ বরাবর অবস্থিত?",
    opts: [
      { label: "ক", text: "$d_{x^2-y^2}, d_{z^2}$" },
      { label: "খ", text: "$d_{xy}, d_z$" },
      { label: "গ", text: "$d_{yz}, d_{x^2-y^2}$" },
      { label: "ঘ", text: "$d_{xy}, d_{xz}$" }
    ],
    correct: "ক",
    exp: "$d$-উপস্তরের পাঁচটি অরবিটালের মধ্যে $d_{xy}, d_{yz}, d_{zx}$ অক্ষদ্বয়ের মধ্যবর্তী কোণ বরাবর বিন্যস্ত থাকে (Non-axial), আর $d_{x^2-y^2}$ (x ও y অক্ষ বরাবর) এবং $d_{z^2}$ (z অক্ষ বরাবর) সরাসরি অক্ষ বরাবর অবস্থিত (Axial অরবিটাল)।"
  },
  {
    num: 52,
    subject: "Chemistry",
    text: "নির্দিষ্ট আয়তনের প্রমাণ দ্রবণ তৈরিতে নিচের কোনটি ব্যবহার করা হয়?",
    opts: [
      { label: "ক", text: "ব্যুরেট" },
      { label: "খ", text: "পিপেট" },
      { label: "গ", text: "মেজারিং সিলিন্ডার" },
      { label: "ঘ", text: "আয়তনিক ফ্লাস্ক" }
    ],
    correct: "ঘ",
    exp: "রসায়ন গবেষণাগারে সুনির্দিষ্ট ঘনমাত্রার নির্দিষ্ট আয়তনের প্রমাণ দ্রবণ (Standard solution) নিখুঁতভাবে তৈরি ও পরিমাপের জন্য আয়তনিক ফ্লাস্ক (Volumetric flask) ব্যবহৃত হয়।"
  },
  {
    num: 53,
    subject: "Chemistry",
    text: "নিচের কোন অণুটির সামগ্রিক ডাইপোল সর্বাধিক?",
    opts: [
      { label: "ক", text: "$\\text{Br}_2\\text{C}=\\text{CBr}_2$" },
      { label: "খ", text: "$\\text{COCl}_2$" },
      { label: "গ", text: "$\\text{HCHO}$" },
      { label: "ঘ", text: "$\\text{BF}_3$" }
    ],
    correct: "গ",
    exp: "• $\\text{Br}_2\\text{C}=\\text{CBr}_2$ ও $\\text{BF}_3$ প্রতিসম হওয়ায় ডাইপোল মোমেন্ট $\\mu = 0$।<br>• ফরমালডিহাইড ($\\text{HCHO}$)-এ তীব্র তড়িৎ-ঋণাত্মক অক্সিজেনের দিকে কার্বোনিল বন্ধনের ডাইপোল ($>\\text{C}=\\text{O}$) এবং দুটি $\\text{C}-\\text{H}$ বন্ধনের ক্ষুদ্র ডাইপোল একই অভিমুখে ক্রিয়া করায় এর সামগ্রিক ডাইপোল মোমেন্ট সর্বাধিক ($\approx 2.33\\text{ D}$)।"
  },
  {
    num: 54,
    subject: "Chemistry",
    text: "$(\\text{NH}_4)_2\\text{CO}_3 \\xrightarrow{\\Delta} 2\\text{NH}_3 + \\text{CO}_2 + \\text{H}_2\\text{O}$ বিক্রিয়ায় $\\text{CO}_3^{2-}$ আয়ন কী হিসেবে কাজ করে?",
    opts: [
      { label: "ক", text: "জারক" },
      { label: "খ", text: "বিজারক" },
      { label: "গ", text: "এসিড" },
      { label: "ঘ", text: "ক্ষার" }
    ],
    correct: "ঘ",
    exp: "ব্রনস্টেড-লাউরি মতবাদ অনুযায়ী এই বিক্রিয়ায় কার্বনেট আয়ন ($\\text{CO}_3^{2-}$) অ্যামোনিয়াম আয়ন ($\\text{NH}_4^+$) থেকে প্রোটন ($H^+$) গ্রহণ করে $\\text{HCO}_3^-$ গঠন করে, যা পরে ভেঙে $\\text{CO}_2$ ও $\\text{H}_2\\text{O}$ হয়। প্রোটন গ্রহীতা হিসেবে $\\text{CO}_3^{2-}$ ক্ষার (Base) হিসেবে কাজ করে।"
  },
  {
    num: 55,
    subject: "Chemistry",
    text: "নিচের কোন আয়নটিতে শুধুমাত্র একটি নিঃসঙ্গ ইলেকট্রন জোড় আছে?",
    opts: [
      { label: "ক", text: "$\\text{CH}_3^+$" },
      { label: "খ", text: "$\\text{CH}_3^-$" },
      { label: "গ", text: "$\\text{NH}_2^-$" },
      { label: "ঘ", text: "$\\text{NH}_4^+$" }
    ],
    correct: "খ",
    exp: "• মিথাইল কার্বানায়ন ($\\text{CH}_3^-$)-এ কার্বনের ৩টি বন্ধন জোড় এবং ১টি নিঃসঙ্গ জোড় ($sp^3$ সংকরায়ন, পিরামিডীয়) রয়েছে।<br>• $\\text{CH}_3^+$ এবং $\\text{NH}_4^+$ এ কোনো মুক্তজোড় নেই।<br>• অ্যামাইড আয়ন ($\\text{NH}_2^-$)-এ ২টি নিঃসঙ্গ জোড় বিদ্যমান।"
  },
  {
    num: 56,
    subject: "Chemistry",
    text: "সমুদ্রপৃষ্ঠ হতে $15\\text{ km}$ থেকে $50\\text{ km}$ পর্যন্ত বায়ুমণ্ডলের স্তরকে বলা হয়-",
    opts: [
      { label: "ক", text: "তাপমণ্ডল" },
      { label: "খ", text: "মেসোমণ্ডল" },
      { label: "গ", text: "স্ট্র্যাটোমণ্ডল" },
      { label: "ঘ", text: "ট্রপোমণ্ডল" }
    ],
    correct: "গ",
    exp: "ট্রপোপজ (প্রায় ১২-১৫ কিমি) থেকে ৫০ কিমি পর্যন্ত বিস্তৃত শান্ত ও ওজোনস্তর সমৃদ্ধ বায়ুমণ্ডলীয় স্তরটিকে স্ট্র্যাটোমণ্ডল (Stratosphere) বলা হয়।"
  },
  {
    num: 57,
    subject: "Chemistry",
    text: "হাইড্রাজিন ($\\text{N}_2\\text{H}_4$) অণুতে $\\angle\\text{HNH}$ বন্ধন কোণ কত?",
    opts: [
      { label: "ক", text: "$105^\\circ$" },
      { label: "খ", text: "$107^\\circ$" },
      { label: "গ", text: "$109.5^\\circ$" },
      { label: "ঘ", text: "$120^\\circ$" }
    ],
    correct: "খ",
    exp: "হাইড্রাজিনে প্রতিটি নাইট্রোজেন পরমাণু $sp^3$ সংকরিত এবং এতে একটি করে নিঃসঙ্গ ইলেকট্রন জোড় বিদ্যমান। মুক্তজোড়-বন্ধনজোড় বিকর্ষণের কারণে চতুস্তলকীয় আদর্শ কোণ $109.5^\\circ$ হ্রাস পেয়ে অ্যামোনিয়ার ন্যায় প্রায় $107^\\circ$ হয়।"
  },
  {
    num: 58,
    subject: "Chemistry",
    text: "কোন যৌগটি সবচেয়ে বেশি এসিডিক?",
    opts: [
      { label: "ক", text: "$\\text{CH}\\equiv\\text{CH}$" },
      { label: "খ", text: "$\\text{CH}_2=\\text{CH}_2$" },
      { label: "গ", text: "$\\text{C}_6\\text{H}_6$" },
      { label: "ঘ", text: "$\\text{CH}_4$" }
    ],
    correct: "ক",
    exp: "ইথাইন বা অ্যাসিটিলিনে ($\\text{CH}\\equiv\\text{CH}$) কার্বন পরমাণুর সংকরায়ন হলো $sp$ (যার $s$-চরিত্র $50\\%$)। $s$-চরিত্র বৃদ্ধির সাথে সাথে কার্বনের তড়িৎ-ঋণাত্মকতা বৃদ্ধি পায়, ফলে $\\text{C}-\\text{H}$ বন্ধনের ইলেকট্রন কার্বনের দিকে আকৃষ্ট হয়ে সহজে প্রোটন ($H^+$) রূপে অপসারিত হতে পারে। হাইড্রোকার্বনগুলোর মধ্যে অ্যালকাইন সবচেয়ে বেশি অম্লধর্মী।"
  },
  {
    num: 59,
    subject: "Chemistry",
    text: "সর্বনিম্ন কত কার্বনের অ্যালকিন আলোক সমাণুতা প্রদর্শন করে?",
    opts: [
      { label: "ক", text: "$5$" },
      { label: "খ", text: "$6$" },
      { label: "গ", text: "$7$" },
      { label: "ঘ", text: "$8$" }
    ],
    correct: "খ",
    exp: "আলোক সমাণুতার জন্য একটি কাইরাল বা অপ্রতিসম কার্বন পরমাণু ($C^*$) আবশ্যক। অ্যালকিনে কাইরাল কেন্দ্র গঠনে ন্যূনতম প্রয়োজন:<br>$\\text{CH}_2=\\text{CH}-\\text{C}^*\\text{H(CH}_3)-\\text{CH}_2\\text{CH}_3$ (৩-মিথাইলপেন্ট-১-ইন)।<br>এতে মোট কার্বন সংখ্যা $= 1 + 1 + 1 + 1 + 2 = 6$ টি।"
  },
  {
    num: 60,
    subject: "Chemistry",
    text: "নিচের কোন আয়নের ঘনমাত্রায় $\\text{Zn(s)}/\\text{Zn}^{2+}\\text{(aq)} \\parallel \\text{Fe}^{3+}\\text{(aq)}/\\text{Fe}^{2+}\\text{(aq)}, \\text{Pt(s)}$ সেলের বিভব এর প্রমাণ বিভবের চেয়ে বেশি?",
    opts: [
      { label: "ক", text: "$[\\text{Zn}^{2+}] = 1.0\\text{ M}$" },
      { label: "খ", text: "$[\\text{Zn}^{2+}] = 1.1\\text{ M}$" },
      { label: "গ", text: "$[\\text{Fe}^{3+}] = 1.1\\text{ M}$" },
      { label: "ঘ", text: "$[\\text{Fe}^{2+}] = 1.1\\text{ M}$" }
    ],
    correct: "গ",
    exp: "মোট কোষ বিক্রিয়া: $\\text{Zn(s)} + 2\\text{Fe}^{3+}\\text{(aq)} \\rightleftharpoons \\text{Zn}^{2+}\\text{(aq)} + 2\\text{Fe}^{2+}\\text{(aq)}$।<br>নার্নস্ট সমীকরণ: $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0592}{2} \\log \\frac{[\\text{Zn}^{2+}][\\text{Fe}^{2+}]^2}{[\\text{Fe}^{3+}]^2}$।<br>সেল বিভব $E_{\\text{cell}} > E^\\circ_{\\text{cell}}$ হওয়ার জন্য লগারিদমের ভিতরের অনুপাত $< 1$ হতে হবে। বিক্রিয়ক আয়ন $[\\text{Fe}^{3+}]$ বৃদ্ধি করে $1.1\\text{ M}$ করা হলে হর বৃদ্ধি পেয়ে অনুপাত $< 1$ হয়, ফলে সেলের বিভব প্রমাণ বিভবের চেয়ে বেশি হয়।"
  },

  // -------------------------------------------------------------
  // HIGHER MATHEMATICS (Questions 61 - 75)
  // -------------------------------------------------------------
  {
    num: 61,
    subject: "Mathematics",
    text: "একটি ভবনের ছাদ হতে মুক্তভাবে পড়ন্ত একটি বস্তু মাটিতে পড়তে $5\\text{ s}$ সময় নেয়। ভবনের উচ্চতা কত? ($g = 9.8\\text{ m/s}^2$)",
    opts: [
      { label: "ক", text: "$245\\text{ m}$" },
      { label: "খ", text: "$24.5\\text{ m}$" },
      { label: "গ", text: "$122.5\\text{ m}$" },
      { label: "ঘ", text: "$150.5\\text{ m}$" }
    ],
    correct: "গ",
    exp: "মুক্তভাবে পড়ন্ত বস্তুর আদিবেগ $u = 0$।<br>উচ্চতা $h = ut + \\frac{1}{2}gt^2 = 0 + \\frac{1}{2} \\times 9.8 \\times (5)^2 = 4.9 \\times 25 = 122.5\\text{ m}$।"
  },
  {
    num: 62,
    subject: "Mathematics",
    text: "$x^2 + 3x - 4 = 0$ সমীকরণের মূলদ্বয় $a, b$ হলে, $\\frac{1}{a} + \\frac{1}{b} + ab$ এর মান হবে-",
    opts: [
      { label: "ক", text: "$-\\frac{12}{5}$" },
      { label: "খ", text: "$\\frac{13}{4}$" },
      { label: "গ", text: "$\\frac{12}{5}$" },
      { label: "ঘ", text: "$-\\frac{13}{4}$" }
    ],
    correct: "ঘ",
    exp: "মূল ও সহগের সম্পর্ক হতে পাই:<br>$a + b = -3$ এবং $ab = -4$।<br>প্রদত্ত রাশি $= \\frac{a+b}{ab} + ab = \\frac{-3}{-4} + (-4) = \\frac{3}{4} - 4 = \\frac{3 - 16}{4} = -\\frac{13}{4}$।"
  },
  {
    num: 63,
    subject: "Mathematics",
    text: "$\\sqrt{14}$ এককের দুটি সমান বল $120^\\circ$ কোণে এক বিন্দুতে কাজ করে। তাদের লব্ধির মান কত?",
    opts: [
      { label: "ক", text: "$2\\sqrt{14}$" },
      { label: "খ", text: "$4\\sqrt{14}$" },
      { label: "গ", text: "$\\sqrt{14}$" },
      { label: "ঘ", text: "$12\\sqrt{14}$" }
    ],
    correct: "গ",
    exp: "দুটি সমান বল $P$ যদি $120^\\circ$ কোণে ক্রিয়া করে, তবে তাদের লব্ধি বলের মান বলদ্বয়ের প্রত্যেকের মানের সমান হয়:<br>$R = 2P \\cos\\left(\\frac{120^\\circ}{2}\\right) = 2P \\cos 60^\\circ = 2P \\times \\frac{1}{2} = P = \\sqrt{14}$।"
  },
  {
    num: 64,
    subject: "Mathematics",
    text: "একটি ত্রিভুজের $a, b, c$ তিনটি বাহুর দৈর্ঘ্য যথাক্রমে $3, 5, 7$ হলে, $\\angle C = ?$",
    opts: [
      { label: "ক", text: "$120^\\circ$" },
      { label: "খ", text: "$\\cos^{-1}\\left(\\frac{11}{14}\\right)$" },
      { label: "গ", text: "$\\cos^{-1}\\left(\\frac{13}{14}\\right)$" },
      { label: "ঘ", text: "$\\sin^{-1}\\left(\\frac{11}{14}\\right)$" }
    ],
    correct: "ক",
    exp: "কোসাইন সূত্র প্রয়োগ করে:<br>$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{3^2 + 5^2 - 7^2}{2 \\times 3 \\times 5} = \\frac{9 + 25 - 49}{30} = \\frac{-15}{30} = -\\frac{1}{2}$।<br>$\\angle C = \\cos^{-1}\\left(-\\frac{1}{2}\\right) = 180^\\circ - 60^\\circ = 120^\\circ$।"
  },
  {
    num: 65,
    subject: "Mathematics",
    text: "$9x^2 + 25y^2 = 225$ উপবৃত্তের নিয়ামকদ্বয়ের মধ্যবর্তী দূরত্ব কত?",
    opts: [
      { label: "ক", text: "$\\frac{25}{2}$" },
      { label: "খ", text: "$25$" },
      { label: "গ", text: "$\\frac{15}{2}$" },
      { label: "ঘ", text: "$5$" }
    ],
    correct: "ক",
    exp: "সমীকরণকে ২২৫ দ্বারা ভাগ করে আদর্শ রূপে সাজাই:<br>$\\frac{x^2}{25} + \\frac{y^2}{9} = 1 \\implies a^2 = 25, b^2 = 9 \\implies a = 5, b = 3$ (এখানে $a > b$)।<br>উৎকেন্দ্রিকতা $e = \\sqrt{1 - \\frac{b^2}{a^2}} = \\sqrt{1 - \\frac{9}{25}} = \\sqrt{\\frac{16}{25}} = \\frac{4}{5}$।<br>নিয়ামকদ্বয়ের মধ্যবর্তী দূরত্ব $= \\frac{2a}{e} = \\frac{2 \\times 5}{4/5} = \\frac{10 \\times 5}{4} = \\frac{25}{2}$।"
  },
  {
    num: 66,
    subject: "Mathematics",
    text: "$f(x) = \\frac{1}{\\sqrt{4 - x^2}}$ ফাংশনটির ডোমেন কত?",
    opts: [
      { label: "ক", text: "$-2 \\leq x \\leq 2$" },
      { label: "খ", text: "$-2 < x < 2$" },
      { label: "গ", text: "$0 \\leq x \\leq 2$" },
      { label: "ঘ", text: "$-2 \\leq x \\leq 0$" }
    ],
    correct: "খ",
    exp: "ভগ্নাংশের হর বাস্তব ও অশূন্য হতে হলে এবং বর্গমূলের জন্য:<br>$4 - x^2 > 0 \\implies x^2 < 4 \\implies |x| < 2 \\implies -2 < x < 2$।"
  },
  {
    num: 67,
    subject: "Mathematics",
    text: "$x^2 + y^2 - 4x - 6y + c = 0$ বৃত্তটি $x$-অক্ষকে স্পর্শ করলে $c$ এর মান কত?",
    opts: [
      { label: "ক", text: "$0$" },
      { label: "খ", text: "$4$" },
      { label: "গ", text: "$1$" },
      { label: "ঘ", text: "$12$" }
    ],
    correct: "খ",
    exp: "বৃত্তের সমীকরণ $x^2 + y^2 + 2gx + 2fy + c = 0$ এর ক্ষেত্রে $x$-অক্ষকে স্পর্শ করার শর্ত হলো $g^2 = c$।<br>এখানে $2g = -4 \\implies g = -2$।<br>অতএব $c = g^2 = (-2)^2 = 4$।"
  },
  {
    num: 68,
    subject: "Mathematics",
    text: "$y = 2x - x^2$ এবং $x$-অক্ষ দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল কত?",
    opts: [
      { label: "ক", text: "$\\frac{4}{3}\\text{ square units}$" },
      { label: "খ", text: "$\\frac{2}{3}\\text{ square units}$" },
      { label: "গ", text: "$\\frac{8}{3}\\text{ square units}$" },
      { label: "ঘ", text: "$1\\text{ square unit}$" }
    ],
    correct: "ক",
    exp: "$x$-অক্ষের সাথে ছেদবিন্দু নির্ণয়:<br>$2x - x^2 = 0 \\implies x(2 - x) = 0 \\implies x = 0, 2$।<br>ক্ষেত্রফল $A = \\int_0^2 (2x - x^2)dx = \\left[x^2 - \\frac{x^3}{3}\\right]_0^2 = \\left(4 - \\frac{8}{3}\\right) - 0 = \\frac{4}{3}\\text{ বর্গ একক}$।"
  },
  {
    num: 69,
    subject: "Mathematics",
    text: "$\\int_0^5 f(x)dx = 8$ হলে, $\\int_{-1}^4 f(x+1)dx$ এর মান কত?",
    opts: [
      { label: "ক", text: "$0$" },
      { label: "খ", text: "$6$" },
      { label: "গ", text: "$8$" },
      { label: "ঘ", text: "$9$" }
    ],
    correct: "গ",
    exp: "ধরি $u = x + 1 \\implies du = dx$।<br>সীমা পরিবর্তন:<br>যখন $x = -1, u = -1 + 1 = 0$<br>যখন $x = 4, u = 4 + 1 = 5$<br>সুতরাং $\\int_{-1}^4 f(x+1)dx = \\int_0^5 f(u)du = 8$।"
  },
  {
    num: 70,
    subject: "Mathematics",
    text: "$\\sec^{-1} x = \\operatorname{cosec}^{-1} y$ হলে, নিচের কোনটি সত্য?",
    opts: [
      { label: "ক", text: "$x^2 + y^2 = 1$" },
      { label: "খ", text: "$\\frac{1}{x^2} + \\frac{1}{y^2} = 1$" },
      { label: "গ", text: "$\\frac{1}{x} + \\frac{1}{y} = \\frac{\\pi}{2}$" },
      { label: "ঘ", text: "$x + y = \\frac{\\pi}{2}$" }
    ],
    correct: "খ",
    exp: "ধরি $\\sec^{-1} x = \\operatorname{cosec}^{-1} y = \\theta$।<br>$\\implies \\sec\\theta = x \\implies \\cos\\theta = \\frac{1}{x}$<br>এবং $\\operatorname{cosec}\\theta = y \\implies \\sin\\theta = \\frac{1}{y}$<br>যেহেতু $\\cos^2\\theta + \\sin^2\\theta = 1$,<br>$\\therefore \\frac{1}{x^2} + \\frac{1}{y^2} = 1$।"
  },
  {
    num: 71,
    subject: "Mathematics",
    text: "$3x + 7y = 21$ এবং $2ax - 3by + 6 = 0$ সমীকরণদ্বয় একই সরলরেখা প্রকাশ করলে $a$ এবং $b$ এর মান কত?",
    opts: [
      { label: "ক", text: "$a = 1, b = 2$" },
      { label: "খ", text: "$a = -\\frac{3}{7}, b = \\frac{2}{3}$" },
      { label: "গ", text: "$a = 0, b = 1$" },
      { label: "ঘ", text: "$a = \\frac{1}{2}, b = 4$" }
    ],
    correct: "খ",
    exp: "সমীকরণ দুটি সাজাই:<br>১ম: $3x + 7y - 21 = 0$<br>২য়: $2ax - 3by + 6 = 0$<br>একই রেখা নির্দেশ করার শর্তানুযায়ী সহগের অনুপাত সমান:<br>$\\frac{2a}{3} = \\frac{-3b}{7} = \\frac{6}{-21} = -\\frac{2}{7}$<br>• $\\frac{2a}{3} = -\\frac{2}{7} \\implies a = -\\frac{3}{7}$<br>• $\\frac{-3b}{7} = -\\frac{2}{7} \\implies -3b = -2 \\implies b = \\frac{2}{3}$।"
  },
  {
    num: 72,
    subject: "Mathematics",
    text: "$\\omega^3 = 1$ হলে, $(1 + \\omega - \\omega^2)(\\omega + \\omega^2 - 1)(\\omega^2 + 1 - \\omega) = ?$",
    opts: [
      { label: "ক", text: "$0$" },
      { label: "খ", text: "$8$" },
      { label: "গ", text: "$-8$" },
      { label: "ঘ", text: "$1$" }
    ],
    correct: "গ",
    exp: "আমরা জানি $1 + \\omega + \\omega^2 = 0$।<br>• $1 + \\omega = -\\omega^2 \\implies 1 + \\omega - \\omega^2 = -2\\omega^2$<br>• $\\omega + \\omega^2 = -1 \\implies \\omega + \\omega^2 - 1 = -2$<br>• $1 + \\omega^2 = -\\omega \\implies \\omega^2 + 1 - \\omega = -2\\omega$<br>গুণফল $= (-2\\omega^2) \\times (-2) \\times (-2\\omega) = -8\\omega^3 = -8(1) = -8$।"
  },
  {
    num: 73,
    subject: "Mathematics",
    text: "$\\begin{vmatrix} bc & ca & ab \\\\ \\frac{1}{a} & \\frac{1}{b} & \\frac{1}{c} \\\\ a & b & c \\end{vmatrix} = ?$",
    opts: [
      { label: "ক", text: "$1$" },
      { label: "খ", text: "$0$" },
      { label: "গ", text: "$\\frac{1}{2}$" },
      { label: "ঘ", text: "$abc$" }
    ],
    correct: "খ",
    exp: "২য় সারি থেকে $\\frac{1}{abc}$ সাধারণ উৎপাদক নিলে ২য় সারিটি হয়ে যায় $\\begin{bmatrix} bc & ca & ab \\end{bmatrix}$, যা ঠিক ১ম সারির সমান। যেহেতু নির্ণায়কের দুটি সারি সর্বসম, তাই এর মান শূন্য ($0$)।"
  },
  {
    num: 74,
    subject: "Mathematics",
    text: "$f(x) = \\sqrt{1 - \\sqrt{x}}$ হলে, $\\frac{df}{dx} = ?$",
    opts: [
      { label: "ক", text: "$\\frac{1}{4\\sqrt{x}\\sqrt{1-\\sqrt{x}}}$" },
      { label: "খ", text: "$-\\frac{1}{2\\sqrt{x}\\sqrt{1-\\sqrt{x}}}$" },
      { label: "গ", text: "$\\frac{1}{2\\sqrt{x}\\sqrt{1-\\sqrt{x}}}$" },
      { label: "ঘ", text: "$-\\frac{1}{4\\sqrt{x}\\sqrt{1-\\sqrt{x}}}$" }
    ],
    correct: "ঘ",
    exp: "চেইন রুল প্রয়োগ করে:<br>$\\frac{df}{dx} = \\frac{1}{2\\sqrt{1 - \\sqrt{x}}} \\times \\frac{d}{dx}(1 - \\sqrt{x}) = \\frac{1}{2\\sqrt{1 - \\sqrt{x}}} \\times \\left(-\\frac{1}{2\\sqrt{x}}\\right) = -\\frac{1}{4\\sqrt{x}\\sqrt{1 - \\sqrt{x}}}$।"
  },
  {
    num: 75,
    subject: "Mathematics",
    text: "$\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = ?$",
    opts: [
      { label: "ক", text: "$0$" },
      { label: "খ", text: "$\\frac{1}{2}$" },
      { label: "গ", text: "$-1$" },
      { label: "ঘ", text: "$1$" }
    ],
    correct: "ঘ",
    exp: "ল' হসপিটালস রুল প্রয়োগ করে:<br>$\\lim_{x \\to 0} \\frac{\\frac{d}{dx}\\ln(1+x)}{\\frac{d}{dx}x} = \\lim_{x \\to 0} \\frac{\\frac{1}{1+x}}{1} = \\frac{1}{1+0} = 1$।"
  },

  // -------------------------------------------------------------
  // BIOLOGY (Questions 76 - 90)
  // -------------------------------------------------------------
  {
    num: 76,
    subject: "Biology",
    text: "নিচের কোন গ্রুপের উদ্ভিদসমূহ উভচর?",
    opts: [
      { label: "ক", text: "ব্রায়োফাইটা" },
      { label: "খ", text: "টেরিডোফাইটা" },
      { label: "গ", text: "জিমনোস্পার্ম" },
      { label: "ঘ", text: "সবগুলোই" }
    ],
    correct: "ক",
    exp: "ব্রায়োফাইটা (মসবর্গীয়) উদ্ভিদসমূহ স্থলে বসবাস করলেও এদের যৌন জননের নিষেক প্রক্রিয়ার জন্য পানির উপস্থিতি অপরিহার্য, তাই এদের উদ্ভিদ জগতের উভচর (Amphibians of plant kingdom) বলা হয়।"
  },
  {
    num: 77,
    subject: "Biology",
    text: "বর্ণান্ধ পুরুষ ও স্বাভাবিক দৃষ্টিসম্পন্ন মহিলার মধ্যে বিয়ে হলে তাদের সন্তান হবে-",
    opts: [
      { label: "ক", text: "পুত্র বর্ণান্ধ" },
      { label: "খ", text: "পুত্র ৫০% বর্ণান্ধ" },
      { label: "গ", text: "পুত্র ও কন্যা উভয়েই স্বাভাবিক দৃষ্টিসম্পন্ন" },
      { label: "ঘ", text: "কন্যা বর্ণান্ধ" }
    ],
    correct: "গ",
    exp: "বর্ণান্ধতা একটি X-লিংকড প্রচ্ছন্ন ব্যাধি। স্বাভাবিক মহিলা ($X^N X^N$) এবং বর্ণান্ধ পুরুষ ($X^c Y$) এর ক্রস করালে:<br>• সকল কন্যা সন্তান ($X^N X^c$) স্বাভাবিক দৃষ্টিসম্পন্ন বাহক হবে।<br>• সকল পুত্র সন্তান মাতার নিকট থেকে স্বাভাবিক $X^N$ ক্রোমোজোম পাওয়ায় ($X^N Y$) সম্পূর্ণ স্বাভাবিক দৃষ্টিসম্পন্ন হবে।<br>অতএব সকল পুত্র ও কন্যাই স্বাভাবিক দৃষ্টিসম্পন্ন।"
  },
  {
    num: 78,
    subject: "Biology",
    text: "গ্লাইকোলাইসিস প্রক্রিয়ায় একমুখী বিক্রিয়ার সংখ্যা কতটি?",
    opts: [
      { label: "ক", text: "২টি" },
      { label: "খ", text: "৩টি" },
      { label: "গ", text: "৪টি" },
      { label: "ঘ", text: "৬টি" }
    ],
    correct: "খ",
    exp: "গ্লাইকোলাইসিসের ১০টি ধাপের মধ্যে ৩টি ধাপ একমুখী (Irreversible):<br>১. ১ম ধাপ: গ্লুকোজ $\\rightarrow$ গ্লুকোজ-৬-ফসফেট (হেক্সোকাইনেজ)<br>২. ৩য় ধাপ: ফ্রুক্টোজ-৬-ফসফেট $\\rightarrow$ ফ্রুক্টোজ-১,৬-বিসফসফেট (ফসফোফ্রুক্টোকাইনেজ-১)<br>৩. ১০ম ধাপ: ফসফোইনলপাইরুভেট $\\rightarrow$ পাইরুভেট (পাইরুভেট কাইনেজ)।"
  },
  {
    num: 79,
    subject: "Biology",
    text: "সারফেকট্যান্ট কোথায় পাওয়া যায়?",
    opts: [
      { label: "ক", text: "অ্যালভিওলাসে" },
      { label: "খ", text: "ব্রঙ্কাসে" },
      { label: "গ", text: "ট্রাকিয়ায়" },
      { label: "ঘ", text: "নাসারন্ধ্রে" }
    ],
    correct: "ক",
    exp: "ফুসফুসের অ্যালভিওলাসের প্রাচীরের টাইপ-২ অ্যালভিওলার কোষ থেকে সারফেকট্যান্ট (ডিটারজেন্ট সদৃশ ফসফোলিপিড মিশ্রণ) নিঃসৃত হয়, যা তরলের পৃষ্ঠটান কমিয়ে শ্বাসপ্রশ্বাসের সময় অ্যালভিওলাসকে সংকুচিত বা চুপসে যাওয়া থেকে রক্ষা করে।"
  },
  {
    num: 80,
    subject: "Biology",
    text: "গাঠনিক জিন, প্রোমোটার জিন, অপারেটর জিন এবং রেগুলেটর জিনকে একত্রে কী বলা হয়?",
    opts: [
      { label: "ক", text: "মিউটন" },
      { label: "খ", text: "লিংকড জিন" },
      { label: "গ", text: "অপেরন" },
      { label: "ঘ", text: "লিথাল জিন" }
    ],
    correct: "গ",
    exp: "প্রোক্যারিওটিক কোষে জিন প্রকাশের সমন্বিত একক হলো অপেরন (Operon), যা গাঠনিক জিন, প্রোমোটার জিন, অপারেটর জিন এবং রেগুলেটর জিন দ্বারা গঠিত (যেমন: ল্যাক অপেরন)।"
  },
  {
    num: 81,
    subject: "Biology",
    text: "নিচের কোনটি অমেরুদণ্ডী প্রাণীর রেচন অঙ্গ নয়?",
    opts: [
      { label: "ক", text: "মালপিজিয়ান নালিকা" },
      { label: "খ", text: "মালপিজিয়ান বডি" },
      { label: "গ", text: "নেফ্রিডিয়াম" },
      { label: "ঘ", text: "ইউরেট কোষ" }
    ],
    correct: "খ",
    exp: "মালপিজিয়ান বডি বা রেনাল করপাসল (বোম্যান্স ক্যাপসুল ও গ্লোমেরুলাস সমন্বয়ে গঠিত) হলো মেরুদণ্ডী প্রাণীর নেফ্রনের অংশ। অন্যদিকে মালপিজিয়ান নালিকা (পতঙ্গ), নেফ্রিডিয়াম (কেঁচো) ও ইউরেট কোষ অমেরুদণ্ডীর রেচন অঙ্গ।"
  },
  {
    num: 82,
    subject: "Biology",
    text: "কোনটিকে মানবদেহের 'রবিন হুড' বলা হয়?",
    opts: [
      { label: "ক", text: "গ্লুকাগন" },
      { label: "খ", text: "ইনসুলিন" },
      { label: "গ", text: "হিমোগ্লোবিন" },
      { label: "ঘ", text: "সিক্রেটিন" }
    ],
    correct: "খ",
    exp: "ইনসুলিন রক্তে অতিরিক্ত গ্লুকোজ থাকলে তা কোষ ও কলাসমূহে সঞ্চয় করে রক্তে গ্লুকোজের মাত্রা স্বাভাবিক রাখে। এজন্য একে আলংকারিক অর্থে মানবদেহের 'রবিন হুড' বলা হয়।"
  },
  {
    num: 83,
    subject: "Biology",
    text: "কোন ধরনের প্রাণীর জীবনচক্রে প্রতীপ রূপান্তর দেখা যায়?",
    opts: [
      { label: "ক", text: "ইউরোকর্ডেট" },
      { label: "খ", text: "সেফালোকর্ডেট" },
      { label: "গ", text: "স্তন্যপায়ী" },
      { label: "ঘ", text: "উভচর" }
    ],
    correct: "ক",
    exp: "ইউরোকর্ডাটা (যেমন অ্যাসিডিয়া) উপপর্বের উন্নত বৈশিষ্ট্যযুক্ত মুক্ত সাঁতারু ট্যাডপোল লার্ভা রূপান্তরিত হয়ে অনুন্নত, নিশ্চল পূর্ণাঙ্গ প্রাণীতে পরিণত হয়। এই ধরনের অধোগামী পরিবর্তনকে প্রতীপ রূপান্তর (Retrogressive metamorphosis) বলে।"
  },
  {
    num: 84,
    subject: "Biology",
    text: "ভুট্টাকে খরা প্রতিরোধী উদ্ভিদ হিসেবে তৈরি করতে নিচের কোন জিনটি ব্যবহার করা হয়?",
    opts: [
      { label: "ক", text: "Cry1 AC" },
      { label: "খ", text: "PDH 45" },
      { label: "গ", text: "At NHX1" },
      { label: "ঘ", text: "csp B" }
    ],
    correct: "ঘ",
    exp: "<i>Bacillus subtilis</i> ব্যাকটেরিয়া থেকে পৃথককৃত <i>cspB</i> (Cold Shock Protein B) জিন ব্যবহারের মাধ্যমে খরা-সহিষ্ণু ট্রান্সজেনিক ভুট্টা (Drought-tolerant maize, MON 87460) উদ্ভাবন করা হয়েছে।"
  },
  {
    num: 85,
    subject: "Biology",
    text: "সর্বমুখ পরাগধানী যে পরিবারে দেখা যায়-",
    opts: [
      { label: "ক", text: "সাইপেরাসি" },
      { label: "খ", text: "মালভেসি" },
      { label: "গ", text: "পোয়েসি" },
      { label: "ঘ", text: "ফ্যাবেসি" }
    ],
    correct: "গ",
    exp: "ঘাস পরিবারের বা পোয়েসি (Poaceae) উদ্ভিদের পুংকেশরের পরাগধানী পুংদণ্ডের শীর্ষে এমনভাবে আলগাভাবে যুক্ত থাকে যে বাতাসে সকল দিকে অবাধে দুলতে পারে। একে সর্বমুখ (Versatile) পরাগধানী বলে।"
  },
  {
    num: 86,
    subject: "Biology",
    text: "বাংলাদেশে কোন GMO ফসলটি সরকার বাণিজ্যিকভাবে অনুমোদন দিয়েছে?",
    opts: [
      { label: "ক", text: "Bt Maize" },
      { label: "খ", text: "Bt Brinjal" },
      { label: "গ", text: "Bt Cotton" },
      { label: "ঘ", text: "Bt Corn" }
    ],
    correct: "খ",
    exp: "২০১৩ সালে বাংলাদেশ সরকার সর্বপ্রথম জেনেটিক্যালি মডিফাইড খাদ্যশস্য হিসেবে ডগা ও ফল ছিদ্রকারী পোকা প্রতিরোধী বিটি বেগুন (Bt Brinjal) বাণিজ্যিকভাবে কৃষকদের মাঝে চাষাবাদের ছাড়পত্র দেয়।"
  },
  {
    num: 87,
    subject: "Biology",
    text: "হেপাটাইটিস বি নির্ণয়ে নিচের কোন পরীক্ষাটি করা হয়?",
    opts: [
      { label: "ক", text: "এইচবি সারফেস অ্যান্টিজেন (HBsAg)" },
      { label: "খ", text: "প্লাটিলেট কাউন্ট" },
      { label: "গ", text: "অ্যান্টিবডি টাইটার কেবল" },
      { label: "ঘ", text: "সবগুলোই" }
    ],
    correct: "ক",
    exp: "হেপাটাইটিস বি ভাইরাস (HBV) সংক্রমণ নিশ্চিতভাবে ডায়াগনোসিস করার জন্য রক্তের সিরামে হেপাটাইটিস বি সারফেস অ্যান্টিজেন (HBsAg) পরীক্ষাটি প্রাথমিক ও প্রধান স্ক্রিনিং টেস্ট হিসেবে করা হয়।"
  },
  {
    num: 88,
    subject: "Biology",
    text: "কোনটি রুই মাছের বায়ুথলির সাথে সম্পর্কিত নয়?",
    opts: [
      { label: "ক", text: "ওয়েভেরিয়ান অসিকল" },
      { label: "খ", text: "নিউম্যাটিক নালি" },
      { label: "গ", text: "রেটি মিরাবিলি" },
      { label: "ঘ", text: "পার্শ্বরেখা নালি" }
    ],
    correct: "ঘ",
    exp: "ওয়েভেরিয়ান অসিকল বায়ুথলি ও অন্তঃকর্ণকে যুক্ত করে শব্দ অনুভূতির কাজ করে, নিউম্যাটিক নালি গলবিল ও বায়ুথলিকে যুক্ত করে এবং রেটি মিরাবিলি গ্যাস উৎপাদন করে। কিন্তু পার্শ্বরেখা নালি (Lateral line system) হলো মাছের বহিঃস্থ সংবেদী গ্রাহক অঙ্গ যা পানির তরঙ্গ ও চাপ অনুভব করে, এটি বায়ুথলির সাথে যুক্ত নয়।"
  },
  {
    num: 89,
    subject: "Biology",
    text: "বিশ্বের সর্বোচ্চ উদ্ভিদ প্রজাতি হলো-",
    opts: [
      { label: "ক", text: "Shorea faguetiana" },
      { label: "খ", text: "Sequoia sempervirens" },
      { label: "গ", text: "Eucalyptus regnans" },
      { label: "ঘ", text: "Swietenia mahagoni" }
    ],
    correct: "খ",
    exp: "ক্যালিফোর্নিয়ার কোস্ট রেডউড বা <i>Sequoia sempervirens</i> (নগ্নবীজী উদ্ভিদ) বিশ্বের উচ্চতম জীবন্ত উদ্ভিদ প্রজাতি, যার উচ্চতা ১১৫.৮ মিটারেরও (৩৮০ ফুট) বেশি।"
  },
  {
    num: 90,
    subject: "Biology",
    text: "উইর্সাং নালি মানবদেহে কোন অঙ্গে পাওয়া যায়?",
    opts: [
      { label: "ক", text: "কোলন" },
      { label: "খ", text: "যকৃত" },
      { label: "গ", text: "অগ্ন্যাশয়" },
      { label: "ঘ", text: "ফুসফুস" }
    ],
    correct: "গ",
    exp: "অগ্ন্যাশয়ের মধ্য দিয়ে লম্বালম্বিভাবে বিস্তৃত প্রধান অগ্ন্যাশয় নালিকে উইর্সাং নালি (Duct of Wirsung) বলা হয়, যা অগ্ন্যাশয় রস ডিওডেনামে বহন করে আনে।"
  }
];

// Format questions according to the standardized schema
const formattedQuestions = questionsData.map((q) => {
  const correctOpt = q.opts.find(o => o.label === q.correct);
  const correctText = correctOpt ? correctOpt.text : "";

  const options = q.opts.map((opt) => {
    const isCorrect = (opt.label === q.correct);
    const optImages = [];
    if (q.num === 31) {
      if (opt.label === 'ক') optImages.push('/assets/imported/1794260842826_du_asset_oFet1452ruogC60mwcC-_.png');
      else if (opt.label === 'খ') optImages.push('/assets/imported/1794260842953_du_asset_9Y9-bIL6akjyzcUnJCVIx.png');
      else if (opt.label === 'গ') optImages.push('/assets/imported/1794260842977_du_asset_IdRpV9KVnzsDAMMNVZPf5.png');
      else if (opt.label === 'ঘ') optImages.push('/assets/imported/1794260843006_du_asset_pSudqQtsKekxpBFRjTsW6.png');
    } else if (q.num === 33) {
      if (opt.label === 'ক') optImages.push('/assets/imported/1794260843028_du_asset_KoBjvSHR-9VEVvVfuqddU.png');
      else if (opt.label === 'খ') optImages.push('/assets/imported/1794260843044_du_asset_hnR4TxbUgKtZX6Sxejb2m.png');
      else if (opt.label === 'গ') optImages.push('/assets/imported/1794260843057_du_asset_ZF72KZImwDKBGCphj3MND.png');
      else if (opt.label === 'ঘ') optImages.push('/assets/imported/1794260843090_du_asset_ZRcySwlGiq4-XA08usNq-.png');
    }

    const cleanOptText = opt.text.replace(/<[^>]+>/g, '').trim();

    return {
      label: opt.label,
      text: cleanOptText,
      html: cleanOptText
        ? `<div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${opt.text}</p></div>`
        : "",
      image_urls: optImages,
      math_tex: [],
      is_correct: isCorrect,
      is_incorrect: false,
      css_classes: isCorrect
        ? "flex items-center gap-3 p-2 rounded-xl transition-all bg-[#017A471A] border border-[#017A47] text-card-foreground cursor-pointer"
        : "flex items-center gap-3 p-2 rounded-xl transition-all border border-border hover:bg-surface-2 transition-all duration-200 cursor-pointer"
    };
  });

  const cleanCorrectText = correctText.replace(/<[^>]+>/g, '').trim();
  // Pure markdown explanation with LaTeX
  const cleanExpMarkdown = cleanCorrectText
    ? `**💡 সঠিক উত্তর: [${q.correct}] ${cleanCorrectText}**\n\n${q.exp.replace(/<br\s*\/?>/gi, '\n\n').replace(/<\/?i>/gi, '*')}`
    : `**💡 সঠিক উত্তর: [${q.correct}]**\n\n${q.exp.replace(/<br\s*\/?>/gi, '\n\n').replace(/<\/?i>/gi, '*')}`;

  // Styled HTML explanation
  const expHtml = `<div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 text-sm space-y-2"><div class="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-base"><span>💡 সঠিক উত্তর: [${q.correct}]${cleanCorrectText ? ` ${cleanCorrectText}` : ''}</span></div><div class="leading-relaxed text-slate-700 dark:text-slate-200">${q.exp}</div></div>`;

  const cleanQuestionText = q.text.replace(/<[^>]+>/g, '').trim();

  return {
    id: `du_24_25_mcq_${q.num}`,
    question_number: q.num,
    subject: q.subject,
    question: `${q.num}. ${cleanQuestionText}`,
    question_text: `${q.num}. ${cleanQuestionText}`,
    question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${q.num}. ${q.text}</p></div></div>`,
    question_math_tex: [],
    question_image_urls: [],
    options: options,
    correct_answer: {
      label: q.correct,
      text: correctText.replace(/<[^>]+>/g, '')
    },
    answer_detection: "verified",
    explanation: cleanExpMarkdown,
    explanation_html: expHtml,
    source_label: "DU A 24-25",
    all_image_urls: []
  };
});


// Write to primary Question/DU/ location
fs.writeFileSync('Question/DU/DU_24-25_MCQ.json', JSON.stringify(formattedQuestions, null, 2), 'utf8');
console.log('Saved Question/DU/DU_24-25_MCQ.json with', formattedQuestions.length, 'questions.');

// Update matching file in public/assets/aistudio/
const aistudioFiles = fs.readdirSync('public/assets/aistudio');
for (const file of aistudioFiles) {
  if (file.startsWith('DU_24-25_MCQ') && file.endsWith('.json')) {
    fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(formattedQuestions, null, 2), 'utf8');
    console.log(`Updated public/assets/aistudio/${file}`);
  }
}
