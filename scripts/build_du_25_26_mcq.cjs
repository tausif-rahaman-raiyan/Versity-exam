const fs = require('fs');
const path = require('path');

const questionsData = [
  // -------------------------------------------------------------
  // PHYSICS (Questions 1 - 15)
  // -------------------------------------------------------------
  {
    num: 1,
    subject: "Physics",
    text: "একটি বস্তুকে অনুভূমিকের সাথে $45^\\circ$ কোণে $E$ গতিশক্তিতে নিক্ষেপ করা হলো। সর্বোচ্চ বিন্দুতে বস্তুটির গতিশক্তি কত হবে? (An object is thrown with an energy $E$ at an angle of $45^\\circ$ with the horizontal line. What will be the kinetic energy of the object at the highest point?)",
    opts: [
      { label: "ক", text: "$2E$" },
      { label: "খ", text: "$E/2$" },
      { label: "গ", text: "$0$" },
      { label: "ঘ", text: "$E$" }
    ],
    correct: "খ",
    exp: "প্রক্ষেপকের সর্বোচ্চ বিন্দুতে উলম্ব বেগ উপাদান $v_y = 0$ হয়ে যায়, কিন্তু অনুভূমিক বেগ অপরিবর্তিত থাকে: $v_x = v_0 \\cos\\theta = v_0 \\cos 45^\\circ = \\frac{v_0}{\\sqrt{2}}$।<br>অতএব সর্বোচ্চ বিন্দুতে গতিশক্তি $E' = \\frac{1}{2} m v_x^2 = \\frac{1}{2} m \\left(\\frac{v_0}{\\sqrt{2}}\\right)^2 = \\frac{1}{2} \\left(\\frac{1}{2} m v_0^2\\right) = \\frac{E}{2}$।"
  },
  {
    num: 2,
    subject: "Physics",
    text: "ভিন্ন ভিন্ন চারটি পাত্রে নিম্নলিখিত গ্যাসগুলোর প্রতিটির $0.5\\text{ mole}$ রাখা হয়েছে। কোন গ্যাসটির তাপমাত্রা সর্বোচ্চ হবে? (There are four different containers, each containing $0.5\\text{ mole}$ of the following gases. Which gas will be at the highest temperature?)",
    opts: [
      { label: "ক", text: "$3.0\\text{ L}$ ক্রিপ্টন $300\\text{ kPa}$ চাপে ($3.0\\text{ L of krypton at } 300\\text{ kPa}$)" },
      { label: "খ", text: "$6.0\\text{ L}$ নিয়ন $160\\text{ kPa}$ চাপে ($6.0\\text{ L of neon at } 160\\text{ kPa}$)" },
      { label: "গ", text: "$8.0\\text{ L}$ হিলিয়াম $120\\text{ kPa}$ চাপে ($8.0\\text{ L of helium at } 120\\text{ kPa}$)" },
      { label: "ঘ", text: "$4.0\\text{ L}$ আর্গন $250\\text{ kPa}$ চাপে ($4.0\\text{ L of argon at } 250\\text{ kPa}$)" }
    ],
    correct: "ঘ",
    exp: "আদর্শ গ্যাস সমীকরণ $PV = nRT$ হতে পাই, $T = \\frac{PV}{nR}$। যেহেতু মোল সংখ্যা $n = 0.5\\text{ mol}$ ও $R$ সবার জন্য ধ্রুবক, তাই যার $P \\times V$ গুণফল সর্বোচ্চ, তার তাপমাত্রাও সর্বোচ্চ হবে:<br>• ক্রিপ্টন: $3.0 \\times 300 = 900\\text{ kPa}\\cdot\\text{L}$<br>• নিয়ন: $6.0 \\times 160 = 960\\text{ kPa}\\cdot\\text{L}$<br>• হিলিয়াম: $8.0 \\times 120 = 960\\text{ kPa}\\cdot\\text{L}$<br>• আর্গন: $4.0 \\times 250 = 1000\\text{ kPa}\\cdot\\text{L}$ (সর্বোচ্চ)।<br>অতএব $4.0\\text{ L}$ আর্গনের তাপমাত্রা সর্বোচ্চ।"
  },
  {
    num: 3,
    subject: "Physics",
    text: "একটি $k$ স্প্রিংধ্রুবক বিশিষ্ট ভরহীন স্প্রিং-কে সংকুচিত করে $m$ ভরের একটি বলকে নিক্ষেপ করা হলো। বলটিকে $v$ বেগ অর্জনের জন্য স্প্রিংটিকে কী পরিমাণ সংকুচিত করতে হবে? (A massless spring with force constant $k$ launches a ball of mass $m$. In order for the ball to reach a speed $v$, by what displacement $x$ should the spring be compressed?)",
    opts: [
      { label: "ক", text: "$x = v \\sqrt{\\frac{m}{k}}$" },
      { label: "খ", text: "$x = v^2 \\sqrt{\\frac{k}{m}}$" },
      { label: "গ", text: "$x = \\frac{vk}{m}$" },
      { label: "ঘ", text: "$x = v \\sqrt{\\frac{k}{m}}$" }
    ],
    correct: "ক",
    exp: "শক্তি সংরক্ষণশীলতার নীতি অনুযায়ী, স্প্রিং-এর স্থিতিশক্তি পুরোপুরি বলটির গতিশক্তিতে রূপান্তরিত হয়:<br>$\\frac{1}{2} k x^2 = \\frac{1}{2} m v^2 \\implies k x^2 = m v^2 \\implies x^2 = \\frac{m v^2}{k} \\implies x = v \\sqrt{\\frac{m}{k}}$।"
  },
  {
    num: 4,
    subject: "Physics",
    text: "একটি মিটার স্টিক $0.8c$ গতিতে একজন পর্যবেক্ষককে অতিক্রম করে। পর্যবেক্ষকের প্রসঙ্গ কাঠামোতে, পর্যবেক্ষককে অতিক্রম করতে স্টিকটির কত সময় লাগে? (A meter stick moves past an observer with a speed of $0.8c$. In the observer's reference frame, how long does the stick take to pass the observer?)",
    opts: [
      { label: "ক", text: "$2.5\\text{ ns}$" },
      { label: "খ", text: "$5.2\\text{ ns}$" },
      { label: "গ", text: "$2.4\\text{ ns}$" },
      { label: "ঘ", text: "$4.2\\text{ ns}$" }
    ],
    correct: "ক",
    exp: "পর্যবেক্ষকের সাপেক্ষে দৈর্ঘ্য সংকোচন সূত্র অনুযায়ী সংকুচিত দৈর্ঘ্য:<br>$L = L_0 \\sqrt{1 - \\frac{v^2}{c^2}} = 1.0\\text{ m} \\times \\sqrt{1 - (0.8)^2} = 1.0 \\times \\sqrt{0.36} = 0.6\\text{ m}$।<br>পর্যবেক্ষককে অতিক্রম করতে প্রয়োজনীয় সময়:<br>$\\Delta t = \\frac{L}{v} = \\frac{0.6\\text{ m}}{0.8 \\times (3 \\times 10^8\\text{ m/s})} = \\frac{0.6}{2.4 \\times 10^8} = 0.25 \\times 10^{-8}\\text{ s} = 2.5 \\times 10^{-9}\\text{ s} = 2.5\\text{ ns}$।"
  },
  {
    num: 5,
    subject: "Physics",
    text: "একজন শিক্ষার্থীকে দুটি ভিন্ন রোধ $R_1$ এবং $R_2$ দেওয়া হলো। এগুলোকে বিভিন্নভাবে সংযোগ করে সে $3\\,\\Omega, 4\\,\\Omega, 12\\,\\Omega$, এবং $16\\,\\Omega$ রোধ তৈরি করতে পারে। $R_1$ এবং $R_2$ এর মান কত? (A student is given two different resistors $R_1$ and $R_2$. By using these resistors in different connections, he can obtain $3\\,\\Omega, 4\\,\\Omega, 12\\,\\Omega$, and $16\\,\\Omega$ resistances. What are the values of $R_1$ and $R_2$?)",
    opts: [
      { label: "ক", text: "$3\\,\\Omega, 4\\,\\Omega$" },
      { label: "খ", text: "$2\\,\\Omega, 12\\,\\Omega$" },
      { label: "গ", text: "$3\\,\\Omega, 16\\,\\Omega$" },
      { label: "ঘ", text: "$4\\,\\Omega, 12\\,\\Omega$" }
    ],
    correct: "ঘ",
    exp: "যদি রোধ দুটি $R_1 = 4\\,\\Omega$ এবং $R_2 = 12\\,\\Omega$ হয়, তবে:<br>১. আলাদাভাবে ব্যবহার করলে রোধ পাওয়া যায়: $4\\,\\Omega$ এবং $12\\,\\Omega$।<br>২. শ্রেণিতে যুক্ত করলে: $R_s = R_1 + R_2 = 4 + 12 = 16\\,\\Omega$।<br>৩. সমান্তরালে যুক্ত করলে: $R_p = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{4 \\times 12}{4 + 12} = \\frac{48}{16} = 3\\,\\Omega$।<br>অতএব রোধ দুটির মান $4\\,\\Omega$ এবং $12\\,\\Omega$।"
  },
  {
    num: 6,
    subject: "Physics",
    text: "বোরের মডেল অনুসারে হাইড্রোজেন পরমাণুতে, $r_n$ ব্যাসার্ধে ইলেকট্রনের রৈখিক ভরবেগ কোনটি? (এখানে, $n$ হচ্ছে প্রধান কোয়ান্টাম সংখ্যা এবং $\\hbar = \\frac{h}{2\\pi}$ প্লাঙ্কের হ্রাস ধ্রুবক।) (What will be the linear momentum of the electron of hydrogen at the orbit of radius $r_n$ according to the Bohr atomic model? Here, $n$ is the principal quantum number and $\\hbar = \\frac{h}{2\\pi}$ is the reduced Planck's constant.)",
    opts: [
      { label: "ক", text: "$n\\hbar$" },
      { label: "খ", text: "$\\frac{n\\hbar}{r_n}$" },
      { label: "গ", text: "$\\frac{n^2 r_n}{\\hbar}$" },
      { label: "ঘ", text: "$n r_n \\hbar$" }
    ],
    correct: "খ",
    exp: "বোরের স্বীকার্য অনুযায়ী কৌণিক ভরবেগ $L = m v r_n = n \\frac{h}{2\\pi} = n\\hbar$।<br>রৈখিক ভরবেগ $p = mv$।<br>সুতরাং $p \\cdot r_n = n\\hbar \\implies p = \\frac{n\\hbar}{r_n}$।"
  },
  {
    num: 7,
    subject: "Physics",
    text: "দুটি বাইনারি সংখ্যা $1110.11_2$ এবং $101.10_2$ এর গুণফল কোনটি? (Which of the following is the multiplication result of two binary numbers $1110.11$ and $101.10$?)",
    opts: [
      { label: "ক", text: "$110001.101$" },
      { label: "খ", text: "$101000.1001$" },
      { label: "গ", text: "$1010001.001$" },
      { label: "ঘ", text: "$1010011.001$" }
    ],
    correct: "গ",
    exp: "দশমিকে রূপান্তর করে যাচাই করা যায়:<br>$1110.11_2 = 8 + 4 + 2 + 0.5 + 0.25 = 14.75_{10}$<br>$101.10_2 = 4 + 1 + 0.5 = 5.5_{10}$<br>গুণফল $= 14.75 \\times 5.5 = 81.125_{10}$।<br>এখন $81_{10} = 64 + 16 + 1 = 1010001_2$<br>এবং ভগ্নাংশ $0.125_{10} = \\frac{1}{8} = 0.001_2$।<br>সুতরাং সম্পূর্ণ বাইনারি মান $= 1010001.001_2$।"
  },
  {
    num: 8,
    subject: "Physics",
    text: "$l$ দৈর্ঘ্য ও $A$ প্রস্থচ্ছেদের ক্ষেত্রফল বিশিষ্ট একটি সিলিন্ডার আকৃতির তারের উপাদানের ইয়ং-এর গুণাঙ্ক ও পীড়ন যথাক্রমে $Y$ ও $S$ হলে তারটিতে সঞ্চিত মোট স্থিতিস্থাপক শক্তি কত হবে? (A cylindrical wire of cross-sectional area $A$ and length $l$ have stress and Young's modulus of the material $S$ and $Y$, respectively. What will be the total elastic energy stored in the wire?)",
    opts: [
      { label: "ক", text: "$S^2 ALY / 2$" },
      { label: "খ", text: "$Y l^2 / (2SA)$" },
      { label: "গ", text: "$S^2 AL / (2Y)$" },
      { label: "ঘ", text: "$YA / (2Sl)$" }
    ],
    correct: "গ",
    exp: "তারের একক আয়তনে সঞ্চিত শক্তি $= \\frac{1}{2} \\times \\text{পীড়ন} \\times \\text{বিকৃতি}$।<br>যেহেতু $Y = \\frac{\\text{পীড়ন}}{\\text{বিকৃতি}} \\implies \\text{বিকৃতি} = \\frac{S}{Y}$।<br>অতএব একক আয়তনে শক্তি $= \\frac{1}{2} S \\times \\frac{S}{Y} = \\frac{S^2}{2Y}$।<br>মোট সঞ্চিত শক্তি $U = \\text{একক আয়তনের শক্তি} \\times \\text{আয়তন} = \\frac{S^2}{2Y} \\times (AL) = \\frac{S^2 AL}{2Y}$।"
  },
  {
    num: 9,
    subject: "Physics",
    text: "যদি $|\\vec{A} + \\vec{B}| = |\\vec{A} - \\vec{B}|$ হয়, তবে $\\vec{A}$ এবং $\\vec{B}$ এর মধ্যবর্তী কোণ কত? (If $|\\vec{A} + \\vec{B}| = |\\vec{A} - \\vec{B}|$, then what will be the angle between $\\vec{A}$ and $\\vec{B}$?)",
    opts: [
      { label: "ক", text: "$90^\\circ$" },
      { label: "খ", text: "$180^\\circ$" },
      { label: "গ", text: "$0^\\circ$" },
      { label: "ঘ", text: "$45^\\circ$" }
    ],
    correct: "ক",
    exp: "উভয়পক্ষে বর্গ করে পাই:<br>$|\\vec{A} + \\vec{B}|^2 = |\\vec{A} - \\vec{B}|^2$<br>$\\implies A^2 + B^2 + 2AB \\cos\\theta = A^2 + B^2 - 2AB \\cos\\theta$<br>$\\implies 4AB \\cos\\theta = 0$<br>যেহেতু $A, B \\neq 0$, তাই $\\cos\\theta = 0 \\implies \\theta = 90^\\circ$। অর্থাৎ ভেক্টরদ্বয় পরস্পর লম্ব।"
  },
  {
    num: 10,
    subject: "Physics",
    text: "নিচের কোন লজিক গেটটি প্রদর্শিত সার্কিটের সমতুল্য? (Which of the following logic gates is equivalent to the circuit shown in the figure?)<br><img src=\"/assets/imported/du_25_26_mcq_gsaUpMTeZegwDADZzInvU.png\" alt=\"Logic circuit\" class=\"my-2 max-h-48 rounded border border-border p-2 bg-white dark:bg-slate-900\" />",
    opts: [
      { label: "ক", text: "NOR" },
      { label: "খ", text: "OR" },
      { label: "গ", text: "AND" },
      { label: "ঘ", text: "NAND" }
    ],
    correct: "ক",
    exp: "প্রদর্শিত সার্কিটে সুইচ দুটি সমান্তরালে বাতির সাথে শর্ট-সার্কিট সংযোগে যুক্ত।<br>• যখন $A = 0, B = 0$ (উভয় সুইচ খোলা), তড়িৎ বাতির মধ্য দিয়ে যায় এবং বাতি জ্বলে ($Y = 1$)।<br>• যেকোনো একটি বা উভয় সুইচ বন্ধ করলে ($A=1$ বা $B=1$), কারেন্ট সুইচের মধ্য দিয়ে শর্ট হয়ে মাটিতে যায়, বাতি নিভে যায় ($Y = 0$)।<br>এই সত্যক সারণিটি একটি NOR গেট ($Y = \\overline{A+B}$) এর প্রতিনিধিত্ব করে।"
  },
  {
    num: 11,
    subject: "Physics",
    text: "একটি তাপীয় ইঞ্জিন প্রতি চক্রে ধনাত্মক কাজ করে এবং তাপ হারায়, কিন্তু ইঞ্জিনটি কোনো তাপ গ্রহণ করে না। ইঞ্জিনটি তাপগতিবিদ্যার কোন সূত্রকে লঙ্ঘন করে? (A heat engine does positive work and loses energy in each cycle, but it does not take any energy. Which law of thermodynamics does the engine violate?)",
    opts: [
      { label: "কতৃতীয় সূত্র (Third Law)", text: "তৃতীয় সূত্র (Third Law)" },
      { label: "খদ্বিতীয় সূত্র (Second Law)", text: "দ্বিতীয় সূত্র (Second Law)" },
      { label: "গপ্রথম সূত্র (First Law)", text: "প্রথম সূত্র (First Law)" },
      { label: "ঘ(খ) ও (গ) উভয়েই", text: "(খ) ও (গ) উভয়েই" }
    ],
    correct: "গ",
    exp: "তাপগতিবিদ্যার ১ম সূত্র অনুযায়ী চক্রাকার প্রক্রিয়ায় নিট অন্তঃস্থ শক্তির পরিবর্তন $\\Delta U = 0$, ফলে নিট তাপ নিট কাজের সমান হতে হবে ($Q_{\\text{in}} - Q_{\\text{out}} = W$) । কোনো তাপ গ্রহণ ছাড়া নিট কাজ করা শক্তির নিত্যতা সূত্রকে (প্রথম সূত্র) সরাসরি লঙ্ঘন করে (প্রথম শ্রেণির অবিরত চলন ইঞ্জিন বা PMM-1)।"
  },
  {
    num: 12,
    subject: "Physics",
    text: "$m_1$ ও $m_2$ ভরের দুটি বস্তুর উপর একটি নির্দিষ্ট বল $F$ প্রয়োগে যথাক্রমে $12\\text{ m/s}^2$ ও $3.30\\text{ m/s}^2$ ত্বরণ হলে $(m_2 - m_1)$ ভরের বস্তুর উপর একই বল $F$ প্রয়োগের ফলে ত্বরণ কত হবে? (Applying a certain force $F$ on two objects of masses $m_1$ and $m_2$ results in $12\\text{ m/s}^2$ and $3.30\\text{ m/s}^2$ accelerations, respectively. What will be the acceleration when the same force $F$ is applied on an object of mass $(m_2 - m_1)$?)",
    opts: [
      { label: "ক", text: "$\\frac{m_2 \\times 3.30}{m_1 - m_2}$" },
      { label: "খ", text: "$\\frac{m_1 \\times 3.30}{m_2 - m_1}$" },
      { label: "গ", text: "$\\frac{m_2 \\times 12}{m_2 - m_1}$" },
      { label: "ঘ", text: "$\\frac{m_1 \\times 12}{m_2 - m_1}$" }
    ],
    correct: "ঘ",
    exp: "নিউটনের ২য় সূত্রানুযায়ী $F = m_1 a_1 = m_1 \\times 12$।<br>সুতরাং $(m_2 - m_1)$ ভরের বস্তুর ত্বরণ $a = \\frac{F}{m_2 - m_1} = \\frac{m_1 \\times 12}{m_2 - m_1}$।"
  },
  {
    num: 13,
    subject: "Physics",
    text: "একটি সমান্তরাল পাত ধারককে চার্জ করার ফলে এর পাত দুটির মধ্যে $x$ ভোল্ট বিভব পার্থক্য তৈরি হয়। উক্ত ধারকটির পাতদ্বয়ের মধ্যবর্তী দূরত্ব অর্ধেক করে বিভব পার্থক্য দ্বিগুণ করা হলো। এই দুই অবস্থায় সঞ্চিত শক্তির অনুপাত কত হবে? (Charging a parallel plate capacitor results in a potential difference of $x$ volt between its two plates. The distance between the plates is halved and the potential difference is doubled. What will be the ratio of the energy stored in these two states?)",
    opts: [
      { label: "ক", text: "$4:1$" },
      { label: "খ", text: "$1:8$" },
      { label: "গ", text: "$1:2$" },
      { label: "ঘ", text: "$1:4$" }
    ],
    correct: "খ",
    exp: "ধারকত্ব $C = \\frac{\\varepsilon A}{d}$। মধ্যবর্তী দূরত্ব $d' = d/2$ হলে ধারকত্ব দ্বিগুণ হয়: $C' = 2C$।<br>বিভব পার্থক্য দ্বিগুণ করায় $V' = 2V$।<br>আদি সঞ্চিত শক্তি $U_1 = \\frac{1}{2} C V^2$।<br>চূড়ান্ত সঞ্চিত শক্তি $U_2 = \\frac{1}{2} C' (V')^2 = \\frac{1}{2} (2C) (2V)^2 = 8 \\times \\left(\\frac{1}{2} C V^2\\right) = 8 U_1$।<br>অতএব শক্তির অনুপাত $U_1 : U_2 = 1 : 8$।"
  },
  {
    num: 14,
    subject: "Physics",
    text: "ইয়ং-এর দ্বি-চিড় পরীক্ষায়, অন্যান্য অবস্থা অপরিবর্তিত রেখে উৎসের আলোর কম্পাঙ্ক যদি দ্বিগুণ করা হয়, তাহলে ডোরার প্রস্থের কী পরিবর্তন হবে? (Consider Young's double-slit experiment. What change will be found in fringe width, if the frequency of the light is doubled keeping other parameters unchanged?)",
    opts: [
      { label: "ক", text: "অর্ধেক হয়ে যাবে (become half)" },
      { label: "খ", text: "দ্বিগুণ হয়ে যাবে (become double)" },
      { label: "গ", text: "এক-চতুর্থাংশ হয়ে যাবে (become one-fourth)" },
      { label: "ঘ", text: "একই থাকবে (remain the same)" }
    ],
    correct: "ক",
    exp: "আলোর বেগ $c = f \\lambda \\implies \\lambda = \\frac{c}{f}$।<br>ডোরার প্রস্থ $\\beta = \\frac{\\lambda D}{2d}$ বা $\\Delta x = \\frac{\\lambda D}{d} \\propto \\lambda$।<br>কম্পাঙ্ক $f$ দ্বিগুণ করা হলে তরঙ্গদৈর্ঘ্য $\\lambda$ অর্ধেক হয়ে যায়, ফলে ডোরার প্রস্থও অর্ধেক হয়ে যাবে।"
  },
  {
    num: 15,
    subject: "Physics",
    text: "$m$ ভরের একটি উপগ্রহ পৃথিবীপৃষ্ঠ থেকে $x$ উচ্চতায় পৃথিবীর চারপাশে ঘুরে যেখানে পৃথিবীর ব্যাসার্ধ $R$। যদি পৃথিবীপৃষ্ঠে অভিকর্ষজ ত্বরণ $g$ হয়, তাহলে উপগ্রহটির কক্ষপথে গতি কত? (A satellite of mass $m$ revolves around the earth at a height $x$ from the earth surface. If $g$ is the gravitational acceleration on the surface of the earth, what is the orbital speed of the satellite?)",
    opts: [
      { label: "ক", text: "$v = \\sqrt{\\frac{gR^2}{R+x}}$" },
      { label: "খ", text: "$v = \\sqrt{\\frac{gR^2}{R-x}}$" },
      { label: "গ", text: "$v = \\sqrt{\\frac{gx}{R-x}}$" },
      { label: "ঘ", text: "$v = \\sqrt{\\frac{gx^2}{(R+x)^2}}$" }
    ],
    correct: "ক",
    exp: "কক্ষপথীয় দ্রুতির সূত্র: $v = \\sqrt{\\frac{GM}{R+x}}$।<br>পৃথিবীপৃষ্ঠে $g = \\frac{GM}{R^2} \\implies GM = gR^2$।<br>অতএব $v = \\sqrt{\\frac{gR^2}{R+x}}$।"
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Questions 16 - 30)
  // -------------------------------------------------------------
  {
    num: 16,
    subject: "Chemistry",
    text: "নিচের কোন অণুতে স্থায়ী ডাইপোল আছে? (Which of the following molecules has the permanent dipole?)",
    opts: [
      { label: "ক", text: "$\\text{SF}_4$" },
      { label: "খ", text: "$\\text{BF}_3$" },
      { label: "গ", text: "$\\text{SiF}_4$" },
      { label: "ঘ", text: "$\\text{XeF}_4$" }
    ],
    correct: "ক",
    exp: "• $\\text{BF}_3$: ত্রিকোণাকার সমতলীয় ($sp^2$), প্রতিসম হওয়ায় ডাইপোল মোমেন্ট $\\mu = 0$।<br>• $\\text{SiF}_4$: চতুস্তলকীয় ($sp^3$), প্রতিসম হওয়ায় $\\mu = 0$।<br>• $\\text{XeF}_4$: সমতলীয় বর্গাকার ($sp^3d^2$, ২টি নিঃসঙ্গ জোড় বিপরীতে), ফলে $\\mu = 0$।<br>• $\\text{SF}_4$: এর সংকরায়ন $sp^3d$, জ্যামিতি সি-স (See-saw) আকৃতির এবং ১টি নিঃসঙ্গ ইলেকট্রন জোড় থাকার কারণে এর নিট ডাইপোল মোমেন্ট $\\mu \\neq 0$ (স্থায়ী ডাইপোল বিদ্যমান)।"
  },
  {
    num: 17,
    subject: "Chemistry",
    text: "কোন যৌগটি সন্নিবেশ বন্ধন গঠন করে না? (Which compound does not form coordinate bond?)",
    opts: [
      { label: "ক", text: "$\\text{H}_2\\text{O}$" },
      { label: "খ", text: "$\\text{CCl}_4$" },
      { label: "গ", text: "$\\text{NH}_3$" },
      { label: "ঘ", text: "$\\text{BCl}_3$" }
    ],
    correct: "খ",
    exp: "$\\text{CCl}_4$ যৌগে কেন্দ্রীয় কার্বন পরমাণুর অষ্টক পূর্ণ এবং এর কোনো ফাঁকা $d$-অরবিটাল নেই (যেহেতু কার্বন ২য় পর্যায়ের মৌল)। ফলে এটি নিঃসঙ্গ ইলেকট্রন জোড় গ্রহণ করতে পারে না, আবার মুক্তজোড় না থাকায় দানও করতে পারে না। অতএব $\\text{CCl}_4$ সন্নিবেশ বন্ধন গঠন করে না।"
  },
  {
    num: 18,
    subject: "Chemistry",
    text: "নিচের কোন জৈব যৌগটি আয়োডোফর্ম পরীক্ষায় অংশগ্রহণ করে না? (Which of the following organic compounds does not participate in the iodoform test?)",
    opts: [
      { label: "ক", text: "$\\text{CH}_3\\text{CH(OH)CH}_3$" },
      { label: "খ", text: "$\\text{CH}_3\\text{CH}_2\\text{COCH}_2\\text{CH}_3$" },
      { label: "গ", text: "$\\text{CH}_3\\text{CH}_2\\text{OH}$" },
      { label: "ঘ", text: "$\\text{CH}_3\\text{COCH}_2\\text{CH}_3$" }
    ],
    correct: "খ",
    exp: "আয়োডোফর্ম পরীক্ষার জন্য যৌগে মিথাইল কিটোন গ্রুপ ($\\text{CH}_3-\\text{C}=\\text{O}$) অথবা জারণের পর মিথাইল কিটোন প্রদানকারী গ্রুপ ($\\text{CH}_3-\\text{CH(OH)}-$ ) থাকতে হয়। ডাইইথাইল কিটোন ($\\text{CH}_3\\text{CH}_2\\text{COCH}_2\\text{CH}_3$)-এ কোনো প্রান্তীয় মিথাইল কিটোন গ্রুপ নেই, তাই এটি আয়োডোফর্ম বিক্রিয়া দেয় না।"
  },
  {
    num: 19,
    subject: "Chemistry",
    text: "$a\\,\\text{KClO}_3 \\xrightarrow{\\Delta} b\\,\\text{KClO}_4 + c\\,\\text{KCl}$ এই সমতাকৃত বিক্রিয়ায় $b:c$ এর মান কত? (What is the value of $b:c$ in the balanced reaction, $a\\,\\text{KClO}_3 \\xrightarrow{\\Delta} b\\,\\text{KClO}_4 + c\\,\\text{KCl}$?)",
    opts: [
      { label: "ক", text: "$2:3$" },
      { label: "খ", text: "$1:2$" },
      { label: "গ", text: "$3:2$" },
      { label: "ঘ", text: "$3:1$" }
    ],
    correct: "ঘ",
    exp: "পটাশিয়াম ক্লোরেটের স্বতঃজারণ-বিজারণ (Disproportionation) সমতাকৃত সমীকরণ:<br>$4\\,\\text{KClO}_3 \\xrightarrow{\\Delta} 3\\,\\text{KClO}_4 + 1\\,\\text{KCl}$<br>এখানে $a = 4, b = 3, c = 1$।<br>অতএব $b : c = 3 : 1$।"
  },
  {
    num: 20,
    subject: "Chemistry",
    text: "$\\text{C}_6\\text{H}_5\\text{CHO}$ কে $\\text{Zn-Hg}$ অ্যামালগাম এবং গাঢ় $\\text{HCl}$ এর সাথে উত্তপ্ত করলে কী উৎপন্ন হয়? (What is formed when $\\text{C}_6\\text{H}_5\\text{CHO}$ is heated with $\\text{Zn-Hg}$ amalgam and concentrated $\\text{HCl}$?)",
    opts: [
      { label: "ক", text: "$\\text{C}_6\\text{H}_5\\text{OH}$" },
      { label: "খ", text: "$\\text{C}_6\\text{H}_6$" },
      { label: "গ", text: "$\\text{C}_6\\text{H}_5\\text{CH}_3$" },
      { label: "ঘ", text: "$\\text{C}_6\\text{H}_5\\text{OC}_6\\text{H}_5$" }
    ],
    correct: "গ",
    exp: "এটি ক্লিমেনসেন বিজারণ (Clemmensen Reduction) বিক্রিয়া। অ্যালডিহাইড বা কিটোনের কার্বোনিল গ্রুপ ($>\\text{C}=\\text{O}$) মিথিলিন গ্রুপে ($-\\text{CH}_2-$) বিজারিত হয়:<br>$\\text{C}_6\\text{H}_5\\text{CHO} + 4[\\text{H}] \\xrightarrow{\\text{Zn-Hg / conc. HCl}} \\text{C}_6\\text{H}_5\\text{CH}_3 + \\text{H}_2\\text{O}$ (টলুইন উৎপন্ন হয়)।"
  },
  {
    num: 21,
    subject: "Chemistry",
    text: "নিচের কোন গ্যাসটি গাড়ির ইঞ্জিনে দহনের সময় তৈরি হয় যা এসিড বৃষ্টিতে অবদান রাখে? (Which of the following gases is formed in the car engine during combustion of fuel that contributes to acid rain?)",
    opts: [
      { label: "ক", text: "$\\text{NO}$" },
      { label: "খ", text: "$\\text{CO}_2$" },
      { label: "গ", text: "$\\text{C}_8\\text{H}_{18}$" },
      { label: "ঘ", text: "$\\text{CO}$" }
    ],
    correct: "ক",
    exp: "গাড়ির ইঞ্জিনের উচ্চ দহন তাপমাত্রায় বায়ুর নাইট্রোজেন ও অক্সিজেন বিক্রিয়া করে নাইট্রিক অক্সাইড ($\\text{NO}$) তৈরি করে। পরবর্তীতে এটি জারিত হয়ে $\\text{NO}_2$ এবং বৃষ্টির পানির সাথে মিশে নাইট্রিক এসিড ($\\text{HNO}_3$) উৎপন্ন করে যা এসিড বৃষ্টির প্রধান কারণ।"
  },
  {
    num: 22,
    subject: "Chemistry",
    text: "একই অবস্থায় কোন ধাতুর $1.0\\text{ g}$, জলীয় $\\text{HCl}$ এর সাথে বিক্রিয়া করে সবচেয়ে বেশি আয়তনের $\\text{H}_2$ গ্যাস তৈরি করে? (Under the same conditions, $1.0\\text{ g}$ of which metal produces the highest volume of $\\text{H}_2$ gas in the reaction with aqueous $\\text{HCl}$?)",
    opts: [
      { label: "ক", text: "$\\text{Na}$" },
      { label: "খ", text: "$\\text{Ca}$" },
      { label: "গ", text: "$\\text{K}$" },
      { label: "ঘ", text: "$\\text{Mg}$" }
    ],
    correct: "ঘ",
    exp: "ধাতুর সাথে এসিডের বিক্রিয়ায় উৎপন্ন $\\text{H}_2$ এর মোল সংখ্যা:<br>• $\\text{Na}: 1.0\\text{ g} / 23 = 0.0435\\text{ mol Na} \\implies 0.0217\\text{ mol H}_2$<br>• $\\text{Ca}: 1.0\\text{ g} / 40 = 0.025\\text{ mol Ca} \\implies 0.025\\text{ mol H}_2$<br>• $\\text{K}: 1.0\\text{ g} / 39.1 = 0.0256\\text{ mol K} \\implies 0.0128\\text{ mol H}_2$<br>• $\\text{Mg}: 1.0\\text{ g} / 24.3 = 0.0411\\text{ mol Mg} \\implies 0.0411\\text{ mol H}_2$ (সর্বোচ্চ)।<br>যেহেতু ম্যাগনেসিয়ামের তুল্য ভর সবচেয়ে কম, তাই ১ গ্রাম ম্যাগনেসিয়াম সর্বাধিক আয়তনের $\\text{H}_2$ উৎপন্ন করে।"
  },
  {
    num: 23,
    subject: "Chemistry",
    text: "নিচের কোনটি প্রিজারভেটিভ নয়? (Which of the following is not a preservative?)",
    opts: [
      { label: "ক", text: "চিনি (Sugar)" },
      { label: "খ", text: "বিউটাইলেটেড হাইড্রক্সি অ্যানিসোল (Butylated hydroxy anisole - BHA)" },
      { label: "গ", text: "সোডিয়াম সালফেট (Sodium sulfate)" },
      { label: "ঘ", text: "সোডিয়াম সালফাইট (Sodium sulfite)" }
    ],
    correct: "গ",
    exp: "সোডিয়াম সালফেট ($\\text{Na}_2\\text{SO}_4$) একটি সাধারণ অজৈব লবণ যা খাদ্য সংরক্ষক হিসেবে ব্যবহৃত হয় না। অন্যদিকে চিনি উচ্চ অসমোটিক চাপ সৃষ্টির মাধ্যমে, BHA অ্যান্টিঅক্সিডেন্ট হিসেবে এবং সোডিয়াম সালফাইট অ্যান্টিমাইক্রোবিয়াল প্রিজারভেটিভ হিসেবে ব্যবহৃত হয়।"
  },
  {
    num: 24,
    subject: "Chemistry",
    text: "$\\text{CH}_3\\text{CONH}_2$ হতে $\\text{CH}_3\\text{CH}_2\\text{NH}_2$ তৈরিতে সর্বাপেক্ষা ভাল বিকারক ও বিক্রিয়ার শর্ত কোনটি? (Which are the best reagent and reaction condition for the formation of $\\text{CH}_3\\text{CH}_2\\text{NH}_2$ from $\\text{CH}_3\\text{CONH}_2$?)",
    opts: [
      { label: "ক", text: "শুষ্ক ইথারে $\\text{LiAlH}_4$ ($\\text{LiAlH}_4$ in dry ether)" },
      { label: "খ", text: "শুষ্ক ইথারে $\\text{NaBH}_4$ ($\\text{NaBH}_4$ in dry ether)" },
      { label: "গ", text: "অ্যালকোহলে $\\text{NaBH}_4$ ($\\text{NaBH}_4$ in alcohol)" },
      { label: "ঘ", text: "অ্যালকোহলে $\\text{LiAlH}_4$ ($\\text{LiAlH}_4$ in alcohol)" }
    ],
    correct: "ক",
    exp: "অ্যামাইডকে একই কার্বন সংখ্যার প্রাইমারি অ্যামিনে বিজারিত করতে শক্তিশালী বিজারক শুষ্ক ইথারে লিথিয়াম অ্যালুমিনিয়াম হাইড্রাইড ($\\text{LiAlH}_4\\text{ in dry ether}$) ব্যবহার করা হয়। $\\text{NaBH}_4$ অ্যামাইডকে বিজারিত করতে পারে না।"
  },
  {
    num: 25,
    subject: "Chemistry",
    text: "কোন পরীক্ষা ফেনল সনাক্তকরণে ব্যবহার করা হয়? (Which test is used to identify phenol?)",
    opts: [
      { label: "ক", text: "লিবারম্যান (Liebermann)" },
      { label: "খ", text: "কার্বিলঅ্যামিন (Carbylamine)" },
      { label: "গ", text: "লুকাস বিকারক (Lucas reagent)" },
      { label: "ঘ", text: "টলেন বিকারক (Tollen's reagent)" }
    ],
    correct: "ক",
    exp: "ফেনলকে গাঢ় $\\text{H}_2\\text{SO}_4$ এবং $\\text{NaNO}_2$ সহযোগে উত্তপ্ত করলে লালচে-বাদামি বর্ণ এবং ক্ষার যোগ করলে নীল বা সবুজ বর্ণ ধারণ করে। এটি লিবারম্যানের নাইট্রোসো পরীক্ষা নামে পরিচিত।"
  },
  {
    num: 26,
    subject: "Chemistry",
    text: "$\\text{Zn(s)}/\\text{Zn}^{2+}\\text{(aq)} \\parallel \\text{Cu}^{2+}\\text{(aq)}/\\text{Cu(s)}$ এই গ্যালভানিক কোষটি সম্পর্কে সঠিক উক্তি কোনটি? (Which one is the correct statement about the Galvanic cell, $\\text{Zn(s)}/\\text{Zn}^{2+}\\text{(aq)} \\parallel \\text{Cu}^{2+}\\text{(aq)}/\\text{Cu(s)}$?)",
    opts: [
      { label: "ক", text: "Cu-ইলেকট্রোডে জারণ ঘটে (Oxidation takes place at Cu-electrode)" },
      { label: "খ", text: "Cu-ইলেকট্রোডটি অ্যানোড (The Cu-electrode is an anode)" },
      { label: "গ", text: "কোষ বিক্রিয়াটি হলো $\\text{Zn}^{2+}\\text{(aq)} + \\text{Cu(s)} \\rightarrow \\text{Zn(s)} + \\text{Cu}^{2+}\\text{(aq)}$" },
      { label: "ঘ", text: "ইলেকট্রন Zn- থেকে Cu-ইলেকট্রোডে প্রবাহিত হয় (Electron flows from Zn- to Cu-electrode)" }
    ],
    correct: "ঘ",
    exp: "ড্যানিয়েল কোষে জিংক অধিক সক্রিয় হওয়ায় অ্যানোড হিসেবে কাজ করে (জারণ: $\\text{Zn} \\rightarrow \\text{Zn}^{2+} + 2e^-$) এবং কপার ক্যাথোড হিসেবে কাজ করে (বিজারণ: $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$)। ফলে বহিঃবর্তনীতে ইলেকট্রন অ্যানোড ($\text{Zn}$) থেকে ক্যাথোডে ($\text{Cu}$) প্রবাহিত হয়।"
  },
  {
    num: 27,
    subject: "Chemistry",
    text: "$\\text{Ag}^+\\text{(aq)} + \\text{Fe}^{2+}\\text{(aq)} \\rightleftharpoons \\text{Fe}^{3+}\\text{(aq)} + \\text{Ag(s)}$ বিক্রিয়াটির জন্য সাম্যধ্রুবক, $K_c$, এর একক কোনটি? (What is the unit of equilibrium constant, $K_c$, for the reaction $\\text{Ag}^+\\text{(aq)} + \\text{Fe}^{2+}\\text{(aq)} \\rightleftharpoons \\text{Fe}^{3+}\\text{(aq)} + \\text{Ag(s)}$?)",
    opts: [
      { label: "ক", text: "একক নাই (No unit)" },
      { label: "খ", text: "$\\text{mol}\\cdot\\text{L}^{-1}$" },
      { label: "গ", text: "$\\text{L}\\cdot\\text{mol}^{-1}$" },
      { label: "ঘ", text: "$\\text{mol}^2\\cdot\\text{L}^{-2}$" }
    ],
    correct: "গ",
    exp: "যেহেতু বিশুদ্ধ কঠিন সিলভারের সক্রিয় ভর $[\text{Ag(s)}] = 1$, তাই সাম্যধ্রুবক সমীকরণ হলো:<br>$K_c = \\frac{[\\text{Fe}^{3+}]}{[\\text{Ag}^+][\\text{Fe}^{2+}]} = \\frac{\\text{mol/L}}{(\\text{mol/L})(\\text{mol/L})} = \\frac{1}{\\text{mol/L}} = \\text{L}\\cdot\\text{mol}^{-1}$।"
  },
  {
    num: 28,
    subject: "Chemistry",
    text: "নিচের কোনটি অ্যারোমেটিক নয়? (Which of the following is not aromatic?)",
    opts: [
      { label: "ক", text: "" },
      { label: "খ", text: "" },
      { label: "গ", text: "" },
      { label: "ঘ", text: "" }
    ],
    correct: "ক",
    exp: "হিউকেলের নীতি $(4n+2)\\pi$ ইলেকট্রন এবং বলয়ের প্রতিটি পরমাণু $sp^2$ সংকরিত ও সমতলীয় হতে হয়। অপশন (ক)-এ বলয়ে $sp^3$ কার্বন বিদ্যমান এবং অবিচ্ছিন্ন রেজোন্যান্স অনুপস্থিত থাকায় এটি অ্যারোমেটিক নয়।"
  },
  {
    num: 29,
    subject: "Chemistry",
    text: "নিচের আয়নগুলোর কোনটি ক্ষুদ্রতম? (Which of the following ions is the smallest?)",
    opts: [
      { label: "ক", text: "$\\text{Al}^{3+}$" },
      { label: "খ", text: "$\\text{Mg}^{2+}$" },
      { label: "গ", text: "$\\text{Na}^+$" },
      { label: "ঘ", text: "$\\text{K}^+$" }
    ],
    correct: "ক",
    exp: "$\\text{Na}^+ (Z=11), \\text{Mg}^{2+} (Z=12), \\text{Al}^{3+} (Z=13)$ সম-ইলেকট্রনীয় (Isoelectronic) আয়ন, প্রত্যেকের ইলেকট্রন সংখ্যা ১০। সম-ইলেকট্রনীয় আয়নের ক্ষেত্রে নিউক্লীয় আধান (প্রোটন সংখ্যা) বৃদ্ধির সাথে সাথে বহিঃস্থ ইলেকট্রনের প্রতি আকর্ষণ বাড়ে, ফলে আয়নিক ব্যাসার্ধ হ্রাস পায়। $\\text{Al}^{3+}$-এর কার্যকর নিউক্লিয়ার চার্জ সর্বাধিক হওয়ায় এর আকার ক্ষুদ্রতম ($53.5\\text{ pm}$)।"
  },
  {
    num: 30,
    subject: "Chemistry",
    text: "নিচের কোনটিতে সর্বোচ্চ সংখ্যক অযুগ্ম ইলেকট্রন থাকে? (Which of the following has the highest number of unpaired electrons?)",
    opts: [
      { label: "ক", text: "$_{25}\\text{Mn}$" },
      { label: "খ", text: "$_{27}\\text{Co}^{3+}$" },
      { label: "গ", text: "$_{26}\\text{Fe}^{2+}$" },
      { label: "ঘ", text: "$_{24}\\text{Cr}$" }
    ],
    correct: "ঘ",
    exp: "ইলেকট্রন বিন্যাস লক্ষ্য করি:<br>• $_{25}\\text{Mn}: [\\text{Ar}]\\,3d^5 4s^2 \\implies 3d$ তে ৫টি অযুগ্ম ইলেকট্রন।<br>• $_{27}\\text{Co}^{3+}: [\\text{Ar}]\\,3d^6 \\implies 4$ টি অযুগ্ম ইলেকট্রন।<br>• $_{26}\\text{Fe}^{2+}: [\\text{Ar}]\\,3d^6 \\implies 4$ টি অযুগ্ম ইলেকট্রন।<br>• $_{24}\\text{Cr}: [\\text{Ar}]\\,3d^5 4s^1 \\implies 3d$ তে ৫টি এবং $4s$ এ ১টি, মোট ৬টি অযুগ্ম ইলেকট্রন (সর্বোচ্চ)।"
  },

  // -------------------------------------------------------------
  // MATHEMATICS (Questions 31 - 45)
  // -------------------------------------------------------------
  {
    num: 31,
    subject: "Mathematics",
    text: "$5y^2 + \\sin y = x^2$ হলে, $\\frac{dy}{dx} = ?$ (If $5y^2 + \\sin y = x^2$, then $\\frac{dy}{dx} = ?$)",
    opts: [
      { label: "ক", text: "$\\frac{x}{5y+\\cos y}$" },
      { label: "খ", text: "$\\frac{2x}{5y-\\cos y}$" },
      { label: "গ", text: "$\\frac{2y}{5y-\\cos y}$" },
      { label: "ঘ", text: "$\\frac{2x}{10y+\\cos y}$" }
    ],
    correct: "ঘ",
    exp: "$x$-এর সাপেক্ষে উভয়পক্ষে অন্তরীকরণ করে পাই:<br>$\\frac{d}{dx}(5y^2) + \\frac{d}{dx}(\\sin y) = \\frac{d}{dx}(x^2)$<br>$\\implies 10y \\frac{dy}{dx} + \\cos y \\frac{dy}{dx} = 2x$<br>$\\implies \\frac{dy}{dx} (10y + \\cos y) = 2x \\implies \\frac{dy}{dx} = \\frac{2x}{10y + \\cos y}$।"
  },
  {
    num: 32,
    subject: "Mathematics",
    text: "$\\theta = \\sin^{-1}\\left(\\frac{3}{5}\\right)$ হলে, $\\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta} = ?$ (If $\\theta = \\sin^{-1}\\left(\\frac{3}{5}\\right)$, then $\\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta} = ?$)",
    opts: [
      { label: "ক", text: "$\\frac{7}{25}$" },
      { label: "খ", text: "$\\frac{7}{16}$" },
      { label: "গ", text: "$\\frac{41}{25}$" },
      { label: "ঘ", text: "$\\frac{41}{16}$" }
    ],
    correct: "ক",
    exp: "ত্রিকোণমিতিক সূত্রানুযায়ী, $\\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta} = \\cos 2\\theta = 1 - 2\\sin^2\\theta$।<br>যেহেতু $\\sin\\theta = \\frac{3}{5}$, তাই:<br>$\\cos 2\\theta = 1 - 2 \\left(\\frac{3}{5}\\right)^2 = 1 - 2 \\times \\frac{9}{25} = 1 - \\frac{18}{25} = \\frac{7}{25}$।"
  },
  {
    num: 33,
    subject: "Mathematics",
    text: "$A = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{bmatrix}$ ম্যাট্রিক্সের ক্ষেত্রে $kA$ ম্যাট্রিক্সের নির্ণায়ক কোনটি, যেখানে $k$ একটি স্কেলার?",
    opts: [
      { label: "ক", text: "$6k$" },
      { label: "খ", text: "$3k^3$" },
      { label: "গ", text: "$6k^3$" },
      { label: "ঘ", text: "$5k^3$" }
    ],
    correct: "গ",
    exp: "প্রদত্ত কর্ণ ম্যাট্রিক্স $A$ এর নির্ণায়ক $|A| = 1 \\times 2 \\times 3 = 6$।<br>$n \\times n$ ম্যাট্রিক্সের জন্য ধ্রুবক গুণের নির্ণায়ক বৈশিষ্ট্য হলো $|kA| = k^n |A|$।<br>এখানে ম্যাট্রিক্সের ক্রম $n = 3$, সুতরাং $|kA| = k^3 |A| = 6k^3$।"
  },
  {
    num: 34,
    subject: "Mathematics",
    text: "$\\left(x - \\frac{1}{x}\\right)^8$ এর বিস্তৃতিতে $x$-বর্জিত পদটি কত নম্বর পদ? (Which term is independent of $x$ in the expansion of $\\left(x - \\frac{1}{x}\\right)^8$?)",
    opts: [
      { label: "ক", text: "$1$" },
      { label: "খ", text: "$5$" },
      { label: "গ", text: "$3$" },
      { label: "ঘ", text: "$4$" }
    ],
    correct: "খ",
    exp: "দ্বিপদী বিস্তৃতির সাধারণ পদ $T_{r+1} = \\binom{8}{r} x^{8-r} \\left(-\\frac{1}{x}\\right)^r = \\binom{8}{r} (-1)^r x^{8-2r}$।<br>$x$-বর্জিত পদের জন্য $8 - 2r = 0 \\implies 2r = 8 \\implies r = 4$।<br>অতএব $x$-বর্জিত পদটি হলো $(4+1) = 5$ তম পদ।"
  },
  {
    num: 35,
    subject: "Mathematics",
    text: "$\\int_0^1 f(x)dx = 2$ এবং $\\int_0^5 f(x)dx = 1$ হলে, $\\int_1^5 f(x)dx = ?$ (If $\\int_0^1 f(x)dx = 2$ and $\\int_0^5 f(x)dx = 1$, then $\\int_1^5 f(x)dx = ?$)",
    opts: [
      { label: "ক", text: "$3$" },
      { label: "খ", text: "$1$" },
      { label: "গ", text: "$-1$" },
      { label: "ঘ", text: "$0$" }
    ],
    correct: "গ",
    exp: "নির্দিষ্ট যোগজের ধর্ম অনুযায়ী:<br>$\\int_0^5 f(x)dx = \\int_0^1 f(x)dx + \\int_1^5 f(x)dx$<br>$\\implies 1 = 2 + \\int_1^5 f(x)dx \\implies \\int_1^5 f(x)dx = 1 - 2 = -1$।"
  },
  {
    num: 36,
    subject: "Mathematics",
    text: "$x$ এর কোন মানের জন্য $f(x) = \\sin^3 x \\cos x$, $0 < x < \\pi$ এর মান ক্ষুদ্রতম হবে?",
    opts: [
      { label: "ক", text: "$0$" },
      { label: "খ", text: "$\\frac{2\\pi}{3}$" },
      { label: "গ", text: "$\\frac{\\pi}{3}$" },
      { label: "ঘ", text: "$\\frac{\\pi}{4}$" }
    ],
    correct: "খ",
    exp: "$0 < x < \\pi$ ব্যবধানে $\\sin x > 0$।<br>$f'(x) = 3\\sin^2 x \\cos^2 x - \\sin^4 x = \\sin^2 x (3\\cos^2 x - \\sin^2 x) = 0 \\implies \\tan^2 x = 3 \\implies \\tan x = \\pm \\sqrt{3}$।<br>• $x = \\frac{\\pi}{3}$ তে $\\cos x > 0 \\implies f(x) > 0$ (গুরুমান)।<br>• $x = \\frac{2\\pi}{3}$ তে $\\cos\\left(\\frac{2\\pi}{3}\\right) = -\\frac{1}{2} < 0 \\implies f(x) < 0$ (লঘুমান বা ক্ষুদ্রতম মান)।<br>অতএব $x = \\frac{2\\pi}{3}$ এর জন্য মান ক্ষুদ্রতম।"
  },
  {
    num: 37,
    subject: "Mathematics",
    text: "$(4, -3)$ বিন্দু হতে $x^2 + y^2 - 8x - 6y + 9 = 0$ বৃত্তের উপরিস্থিত বিন্দুর সর্বনিম্ন দূরত্ব কত?",
    opts: [
      { label: "ক", text: "$1$" },
      { label: "খ", text: "$3$" },
      { label: "গ", text: "$4$" },
      { label: "ঘ", text: "$2$" }
    ],
    correct: "ঘ",
    exp: "বৃত্তটির কেন্দ্র $C = (4, 3)$ এবং ব্যাসার্ধ $r = \\sqrt{4^2 + 3^2 - 9} = \\sqrt{16} = 4$।<br>প্রদত্ত বিন্দু $P(4, -3)$ থেকে কেন্দ্র $C(4, 3)$ এর দূরত্ব:<br>$d = \\sqrt{(4-4)^2 + (3 - (-3))^2} = \\sqrt{0 + 6^2} = 6$।<br>যেহেতু বিন্দুটি বৃত্তের বাইরে অবস্থিত ($d > r$), বৃত্তের পরিধির সাথে সর্বনিম্ন দূরত্ব $= d - r = 6 - 4 = 2$।"
  },
  {
    num: 38,
    subject: "Mathematics",
    text: "যদি $f(x) = x^2 - 1$ এবং $g(x) = \\sqrt{x}$ হয়, তাহলে $(g \\circ f)(x)$ এর ডোমেন কোনটি?",
    opts: [
      { label: "ক", text: "$\\mathbb{R}$" },
      { label: "খ", text: "$x \\geq 0$" },
      { label: "গ", text: "$-1 < x < 1$" },
      { label: "ঘ", text: "$x \\leq -1 \\text{ or } x \\geq 1$" }
    ],
    correct: "ঘ",
    exp: "সংযোজিত ফাংশন $(g \\circ f)(x) = g(f(x)) = \\sqrt{x^2 - 1}$।<br>বর্গমূলের ভিতরের রাশি অঋণাত্মক হতে হবে:<br>$x^2 - 1 \\ge 0 \\implies (x - 1)(x + 1) \\ge 0 \\implies x \\le -1$ অথবা $x \\ge 1$।"
  },
  {
    num: 39,
    subject: "Mathematics",
    text: "$\\lim_{x \\to 0} \\frac{8^x - 2^x}{x}$ এর মান কত?",
    opts: [
      { label: "ক", text: "$\\ln 4$" },
      { label: "খ", text: "$\\ln 16$" },
      { label: "গ", text: "$\\ln 2$" },
      { label: "ঘ", text: "$1$" }
    ],
    correct: "ক",
    exp: "ল' হসপিটালের নিয়ম প্রয়োগ করে:<br>$\\lim_{x \\to 0} \\frac{\\frac{d}{dx}(8^x - 2^x)}{\\frac{d}{dx}(x)} = \\lim_{x \\to 0} \\frac{8^x \\ln 8 - 2^x \\ln 2}{1} = 8^0 \\ln 8 - 2^0 \\ln 2 = \\ln 8 - \\ln 2 = \\ln\\left(\\frac{8}{2}\\right) = \\ln 4$।"
  },
  {
    num: 40,
    subject: "Mathematics",
    text: "মূলবিন্দুগামী $P$ ও $Q$ দুটি বলের লব্ধি $R$। যদি $P = Q = R$ হয়, তবে $P$ ও $Q$ এর মধ্যবর্তী কোণ কত হবে?",
    opts: [
      { label: "ক", text: "$60^\\circ$" },
      { label: "খ", text: "$120^\\circ$" },
      { label: "গ", text: "$90^\\circ$" },
      { label: "ঘ", text: "$180^\\circ$" }
    ],
    correct: "খ",
    exp: "লব্ধির সূত্রানুযায়ী $R^2 = P^2 + Q^2 + 2PQ \\cos\\alpha$।<br>শর্তমতে $P = Q = R$ বসিয়ে পাই:<br>$P^2 = P^2 + P^2 + 2P^2 \\cos\\alpha \\implies P^2 = 2P^2(1 + \\cos\\alpha) \\implies 1 = 2(1 + \\cos\\alpha) \\implies \\cos\\alpha = -\\frac{1}{2}$<br>$\\implies \\alpha = 120^\\circ$।"
  },
  {
    num: 41,
    subject: "Mathematics",
    text: "যদি ৫ জন বালক ও ৪ জন বালিকা দৌড় প্রতিযোগিতায় অংশগ্রহণ করে, তাহলে একজন বালকের ১ম ও একজন বালিকার ২য় হওয়ার সম্ভাবনা কত?",
    opts: [
      { label: "ক", text: "$\\frac{5}{18}$" },
      { label: "খ", text: "$\\frac{3}{4}$" },
      { label: "গ", text: "$\\frac{1}{2}$" },
      { label: "ঘ", text: "$\\frac{1}{4}$" }
    ],
    correct: "ক",
    exp: "মোট প্রতিযোগী $= 5 + 4 = 9$ জন।<br>১ম স্থানে একজন বালক আসার সম্ভাবনা $= \\frac{5}{9}$।<br>১ম স্থান নির্ধারিত হওয়ার পর অবশিষ্ট প্রতিযোগী $= 8$ জন, যাদের মধ্যে বালিকা ৪ জন।<br>২য় স্থানে একজন বালিকা আসার সম্ভাবনা $= \\frac{4}{8} = \\frac{1}{2}$।<br>যৌথ সম্ভাবনা $= \\frac{5}{9} \\times \\frac{1}{2} = \\frac{5}{18}$।"
  },
  {
    num: 42,
    subject: "Mathematics",
    text: "যদি $A$ এবং $B$ কোণের ক্ষেত্রে $\\tan A = \\frac{1}{2}$ ও $\\tan B = -\\frac{1}{2}$ হয়, তাহলে $\\tan(A+B)$ কত?",
    opts: [
      { label: "ক", text: "$\\frac{\\pi}{6}$" },
      { label: "খ", text: "$\\frac{\\pi}{4}$" },
      { label: "গ", text: "$0$" },
      { label: "ঘ", text: "$\\frac{\\pi}{3}$" }
    ],
    correct: "গ",
    exp: "$\\tan(A + B) = \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B} = \\frac{\\frac{1}{2} + \\left(-\\frac{1}{2}\\right)}{1 - \\left(\\frac{1}{2}\\right)\\left(-\\frac{1}{2}\\right)} = \\frac{0}{1 + \\frac{1}{4}} = 0$।<br>অতএব $A + B = 0$ বা $\\tan(A+B) = 0$।"
  },
  {
    num: 43,
    subject: "Mathematics",
    text: "$y^2 + 8x - 2y - 23 = 0$ পরাবৃত্তের নিয়ামক রেখার সমীকরণ কোনটি?",
    opts: [
      { label: "ক", text: "$x - 3 = 0$" },
      { label: "খ", text: "$y - 3 = 0$" },
      { label: "গ", text: "$x - 5 = 0$" },
      { label: "ঘ", text: "$y - 5 = 0$" }
    ],
    correct: "গ",
    exp: "সমীকরণটিকে আদর্শ রূপে সাজিয়ে পাই:<br>$(y - 1)^2 - 1 + 8x - 23 = 0 \\implies (y - 1)^2 = -8x + 24 = -8(x - 3) = 4(-2)(x - 3)$<br>এখানে $Y^2 = 4aX$, যেখানে $X = x - 3, Y = y - 1, a = -2$।<br>নিয়ামক রেখার সমীকরণ $X = -a \\implies x - 3 = -(-2) = 2 \\implies x - 5 = 0$।"
  },
  {
    num: 44,
    subject: "Mathematics",
    text: "$(8, 5)$ এবং $(-4, -3)$ বিন্দুদ্বয়ের সংযোগ রেখার লম্ব দ্বিখণ্ডকটি $y$-অক্ষকে কোন বিন্দুতে ছেদ করে?",
    opts: [
      { label: "ক", text: "$(0, 4)$" },
      { label: "খ", text: "$(0, 3)$" },
      { label: "গ", text: "$(0, 2)$" },
      { label: "ঘ", text: "$(0, -4)$" }
    ],
    correct: "ক",
    exp: "বিন্দুদ্বয়ের মধ্যবিন্দু $M = \\left(\\frac{8 + (-4)}{2}, \\frac{5 + (-3)}{2}\\right) = (2, 1)$।<br>সংযোজক রেখার ঢাল $m_1 = \\frac{-3 - 5}{-4 - 8} = \\frac{-8}{-12} = \\frac{2}{3}$।<br>লম্ব দ্বিখণ্ডকের ঢাল $m_2 = -\\frac{3}{2}$।<br>লম্ব দ্বিখণ্ডকের সমীকরণ: $y - 1 = -\\frac{3}{2}(x - 2) \\implies 2y - 2 = -3x + 6 \\implies 3x + 2y - 8 = 0$।<br>$y$-অক্ষের ছেদবিন্দুর জন্য $x = 0$ বসালে $2y = 8 \\implies y = 4$। বিন্দুটি $(0, 4)$।"
  },
  {
    num: 45,
    subject: "Mathematics",
    text: "$\\int \\frac{dx}{x^2 + 6x + 25}$ এর মান কত?",
    opts: [
      { label: "ক", text: "$\\tan^{-1}\\left(\\frac{x+3}{4}\\right) + c$" },
      { label: "খ", text: "$\\frac{1}{4} \\tan^{-1}\\left(\\frac{x+3}{4}\\right) + c$" },
      { label: "গ", text: "$\\frac{1}{4} \\tan^{-1}\\left(\\frac{4}{x+3}\\right) + c$" },
      { label: "ঘ", text: "$\\ln\\left(\\frac{x+3}{4}\\right) + c$" }
    ],
    correct: "খ",
    exp: "পূর্ণবর্গ আকারে রূপান্তর করে পাই:<br>$x^2 + 6x + 25 = (x + 3)^2 + 16 = (x + 3)^2 + 4^2$।<br>আদর্শ সূত্র $\\int \\frac{dx}{(x+a)^2 + b^2} = \\frac{1}{b} \\tan^{-1}\\left(\\frac{x+a}{b}\\right) + c$ প্রয়োগ করে:<br>$\\int \\frac{dx}{(x+3)^2 + 4^2} = \\frac{1}{4} \\tan^{-1}\\left(\\frac{x+3}{4}\\right) + c$।"
  },

  // -------------------------------------------------------------
  // BIOLOGY (Questions 46 - 60)
  // -------------------------------------------------------------
  {
    num: 46,
    subject: "Biology",
    text: "কোনটি বিপন্ন উদ্ভিদের সংখ্যা বৃদ্ধিতে কার্যকরী পদ্ধতি?",
    opts: [
      { label: "ক", text: "গ্রাফটিং" },
      { label: "খ", text: "লেয়ারিং" },
      { label: "গ", text: "কাটিং" },
      { label: "ঘ", text: "টিস্যুকালচার" }
    ],
    correct: "ঘ",
    exp: "টিস্যুকালচার বা মাইক্রোপ্রোপাগেশন পদ্ধতিতে উদ্ভিদের ক্ষুদ্র এক্সপ্লান্ট (যেমন শীর্ষমুকুল বা কাক্ষিক মুকুল) থেকে জীবাণুমুক্ত কৃত্রিম পুষ্টিমাধ্যমে অল্প সময়ে দ্রুত হাজার হাজার রোগমুক্ত ক্লোন চারা উৎপাদন করা যায়, যা বিপন্ন উদ্ভিদ প্রজাতি সংরক্ষণে সর্বাধিক কার্যকরী।"
  },
  {
    num: 47,
    subject: "Biology",
    text: "কোন ব্যাকটেরিয়া ধানের ব্লাইট রোগ সৃষ্টি করে?",
    opts: [
      { label: "ক", text: "Bacillus subtilis" },
      { label: "খ", text: "Xanthomonas oryzae" },
      { label: "গ", text: "Pyricularia oryzae" },
      { label: "ঘ", text: "Escherichia coli" }
    ],
    correct: "খ",
    exp: "ধানের ব্যাকটেরিয়াজনিত পাতা পোড়া বা ব্লাইট (Bacterial blight) রোগের জীবাণু হলো <i>Xanthomonas oryzae</i>। (উল্লেখ্য, <i>Pyricularia oryzae</i> হলো ধানের ব্লাস্ট সৃষ্টিকারী ছত্রাক)।"
  },
  {
    num: 48,
    subject: "Biology",
    text: "নিচের কোনটি সেক্স-লিংকড ডিসঅর্ডার নয়?",
    opts: [
      { label: "ক", text: "হিমোফিলিয়া" },
      { label: "খ", text: "লাল-সবুজ বর্ণান্ধতা" },
      { label: "গ", text: "থ্যালাসেমিয়া" },
      { label: "ঘ", text: "ডুশেনি মাসকুলার ডিস্ট্রফি" }
    ],
    correct: "গ",
    exp: "হিমোফিলিয়া, লাল-সবুজ বর্ণান্ধতা এবং ডুশেনি মাসকুলার ডিস্ট্রফি হলো X-ক্রোমোজোমবাহিত সেক্স-লিংকড প্রচ্ছন্ন রোগ। কিন্তু থ্যালাসেমিয়া হলো অটোজোমবাহিত প্রচ্ছন্ন ব্যাধি (১১ ও ১৬ নং অটোজোমে ত্রুটির কারণে ঘটে)।"
  },
  {
    num: 49,
    subject: "Biology",
    text: "প্রতিটি সজীব উদ্ভিদ কোষেরই একটি পূর্ণাঙ্গ উদ্ভিদে পরিণত হওয়ার অন্তর্নিহিত ক্ষমতাকে বলে-",
    opts: [
      { label: "ক", text: "মাইক্রো প্রোপাগেশন" },
      { label: "খ", text: "ইন-ভিট্রো কালচার" },
      { label: "গ", text: "টটিপোটেন্সি" },
      { label: "ঘ", text: "মেরিস্টেম কালচার" }
    ],
    correct: "গ",
    exp: "একটি সজীব উদ্ভিদ কোষের বিভাজিত ও রূপান্তরিত হয়ে একটি সম্পূর্ণ নতুন চারাগাছ গঠন করার অন্তর্নিহিত জীবতাত্ত্বিক ক্ষমতাকে সেলুলার টটিপোটেন্সি (Totipotency) বলে। বিজ্ঞানী হাবারল্যান্ডট সর্বপ্রথম এই ধারণা দেন।"
  },
  {
    num: 50,
    subject: "Biology",
    text: "কোন পর্বের প্রাণিতে প্রকৃত ট্যাগমাটা পাওয়া যায়?",
    opts: [
      { label: "ক", text: "মোলাস্কা" },
      { label: "খ", text: "পরিফেরা" },
      { label: "গ", text: "অ্যানেলিডা" },
      { label: "ঘ", text: "আর্থ্রোপোডা" }
    ],
    correct: "ঘ",
    exp: "আর্থ্রোপোডা পর্বের প্রাণীদের খণ্ডকগুলো সুনির্দিষ্ট কাজের জন্য একত্রিত হয়ে বিশেষ অঞ্চলে বিভক্ত হয়, যাকে ট্যাগমা বা ট্যাগমাটা (Tagmata) বলে (যেমন: মস্তক, বক্ষ ও উদর)।"
  },
  {
    num: 51,
    subject: "Biology",
    text: "নিচের কোনটি পেরিকন্ড্রিয়াম দ্বারা আবৃত থাকে?",
    opts: [
      { label: "ক", text: "তরুণাস্থি" },
      { label: "খ", text: "ফুসফুস" },
      { label: "গ", text: "হাড়" },
      { label: "ঘ", text: "হৃৎপিন্ড" }
    ],
    correct: "ক",
    exp: "তরুণাস্থি (Cartilage) যে ঘন তন্তুময় যোজক কলার আবরণী দ্বারা আবৃত থাকে তাকে পেরিকন্ড্রিয়াম (Perichondrium) বলে। হাড়ের আবরণ পেরিঅস্টিয়াম, ফুসফুসের প্লুরা এবং হৃৎপিন্ডের আবরণ পেরিকার্ডিয়াম।"
  },
  {
    num: 52,
    subject: "Biology",
    text: "কোনটি আধা-স্বায়ত্তশাসিত কোষ অঙ্গাণু?",
    opts: [
      { label: "ক", text: "গলগি বডি" },
      { label: "খ", text: "রাইবোসোম" },
      { label: "গ", text: "নিউক্লিয়াস" },
      { label: "ঘ", text: "ক্লোরোপ্লাস্ট" }
    ],
    correct: "ঘ",
    exp: "ক্লোরোপ্লাস্ট এবং মাইটোকন্ড্রিয়ায় নিজস্ব বৃত্তাকার ডিএনএ, 70S রাইবোসোম এবং প্রোটিন তৈরির ব্যবস্থা থাকে ও এরা স্বয়ংক্রিয়ভাবে বিভাজিত হতে পারে বলে এদের আধা-স্বায়ত্তশাসিত অঙ্গাণু (Semi-autonomous organelle) বলা হয়।"
  },
  {
    num: 53,
    subject: "Biology",
    text: "নিচের কোনটি জীবন্ত জীবাশ্ম নয়?",
    opts: [
      { label: "ক", text: "প্লাটিপাস" },
      { label: "খ", text: "গ্যাভিয়ালিস" },
      { label: "গ", text: "লিমুলাস" },
      { label: "ঘ", text: "ল্যাটিমেরিয়া" }
    ],
    correct: "খ",
    exp: "লিমুলাস (রাজকাঁকড়া), ল্যাটিমেরিয়া (সিল্যাকান্থ মাছ) এবং প্লাটিপাস হলো সুপরিচিত জীবন্ত জীবাশ্ম। কিন্তু গ্যাভিয়ালিস (ঘড়িয়াল) সরীসৃপ শ্রেণির বিলুপ্তপ্রায় প্রজাতি, এটি জীবন্ত জীবাশ্ম নয়।"
  },
  {
    num: 54,
    subject: "Biology",
    text: "Cycas এর কোরালয়েড মূলের শৈবাল স্তরটি কোথায় অবস্থান করে?",
    opts: [
      { label: "ক", text: "মধ্য কর্টেক্স" },
      { label: "খ", text: "ফ্লোয়েম টিস্যু" },
      { label: "গ", text: "এপিডার্মিস" },
      { label: "ঘ", text: "পেরিসাইকেল" }
    ],
    correct: "ক",
    exp: "সাইকাসের কোরালয়েড মূলের প্রস্থচ্ছেদে কর্টেক্স তিনটি অঞ্চলে বিভক্ত: বহিঃকর্টেক্স, মধ্য কর্টেক্স বা শৈবাল স্তর (Algal zone), এবং অন্তকর্টেক্স। মধ্য কর্টেক্সে নস্টক ও অ্যানাবেনা শৈবাল মিথোজীবী রূপে বাস করে।"
  },
  {
    num: 55,
    subject: "Biology",
    text: "ঘাসফড়িং এর পুঞ্জাক্ষির কোন অংশটি লেন্সের মতো কাজ করে?",
    opts: [
      { label: "ক", text: "কর্নিয়াজেন কোষ" },
      { label: "খ", text: "র‍্যাবডোম" },
      { label: "গ", text: "কর্নিয়া" },
      { label: "ঘ", text: "ক্রিস্টালাইন কোণ কোষ" }
    ],
    correct: "গ",
    exp: "ওমাটিডিয়ামের সবচেয়ে বাইরে অবস্থিত স্বচ্ছ, উত্তল কিউটিকল নির্মিত অংশটি হলো কর্নিয়া (Cornea), যা আলো প্রতিসরণ করে লেন্সের ন্যায় প্রতিবিম্ব গঠনে কাজ করে।"
  },
  {
    num: 56,
    subject: "Biology",
    text: "দেহের কোন অংশে অ্যাম্পুলা অব ভ্যাটার উন্মুক্ত হয়?",
    opts: [
      { label: "ক", text: "পাকস্থলি" },
      { label: "খ", text: "কোলন" },
      { label: "গ", text: "মলাশয়" },
      { label: "ঘ", text: "ডিওডেনাম" }
    ],
    correct: "ঘ",
    exp: "সাধারণ পিত্তনালি এবং প্রধান অগ্ন্যাশয় নালি (উইর্সাং নালি) একত্রিত হয়ে যে হেপাটোপ্যানক্রিয়াটিক অ্যাম্পুলা বা অ্যাম্পুলা অব ভ্যাটার গঠন করে, তা ওড্ডির স্ফিংটার দ্বারা ডিওডেনামের দ্বিতীয় অংশে উন্মুক্ত হয়।"
  },
  {
    num: 57,
    subject: "Biology",
    text: "রক্তে অক্সিজেনের মাত্রা কমে গেলে কোন হরমোন নিঃসৃত হয়?",
    opts: [
      { label: "ক", text: "এরিথ্রোপয়েটিন" },
      { label: "খ", text: "অক্সিটোসিন" },
      { label: "গ", text: "মেলাটোনিন" },
      { label: "ঘ", text: "কর্টিসল" }
    ],
    correct: "ক",
    exp: "রক্তে অক্সিজেনের ঘাটতি (হাইপোক্সিয়া) দেখা দিলে বৃক্ক (Kidney) থেকে এরিথ্রোপয়েটিন (Erythropoietin) হরমোন নিঃসৃত হয়, যা অস্থিমজ্জাকে উদ্দীপিত করে নতুন লোহিত রক্তকণিকা (RBC) উৎপাদন ত্বরান্বিত করে।"
  },
  {
    num: 58,
    subject: "Biology",
    text: "কোষ চক্রের কোন দশায় হিস্টোন প্রোটিন সংশ্লেষিত হয়?",
    opts: [
      { label: "ক", text: "$G_1$ দশা" },
      { label: "খ", text: "$S$ দশা" },
      { label: "গ", text: "$G_2$ দশা" },
      { label: "ঘ", text: "$M$ দশা" }
    ],
    correct: "খ",
    exp: "ইন্টারফেজের সংশ্লেষ বা $S$ দশায় (Synthesis phase) ডিএনএ অণুর অনুলিপন ঘটে এবং নতুন সৃষ্ট ডিএনএ সূত্রকের সাথে যুক্ত হওয়ার জন্য প্রয়োজনীয় হিস্টোন প্রোটিন সংশ্লেষিত হয়।"
  },
  {
    num: 59,
    subject: "Biology",
    text: "ক্যাপিচুলাম পুষ্পবিন্যাসে কোন ধরনের পুষ্পিকা দেখা যায়?",
    opts: [
      { label: "ক", text: "প্রান্ত পুষ্পিকা ও মধ্য পুষ্পিকা" },
      { label: "খ", text: "শুধুমাত্র শীর্ষ পুষ্পিকা" },
      { label: "গ", text: "স্পাইকলেট পুষ্পিকা" },
      { label: "ঘ", text: "উভলিঙ্গিক পুষ্পিকা কেবল" }
    ],
    correct: "ক",
    exp: "সূর্যমুখী ও গাঁদা ফুলের মতো ক্যাপিচুলাম বা শীর্ষমঞ্জরী পুষ্পবিন্যাসে উত্তল পুষ্পাক্ষের পরিধির দিকে থাকে জিহ্বাকৃতির প্রান্ত পুষ্পিকা (Ray floret) এবং কেন্দ্রের দিকে থাকে নলাকার মধ্য পুষ্পিকা বা ডিস্ক পুষ্পিকা (Disc floret)।"
  },
  {
    num: 60,
    subject: "Biology",
    text: "সাইনো-অ্যাট্রিয়াল নোড (SA Node) কে মানবদেহের কী বলা হয়?",
    opts: [
      { label: "ক", text: "দ্বিতীয় পেসমেকার" },
      { label: "খ", text: "রিজার্ভ পেসমেকার" },
      { label: "গ", text: "প্রাকৃতিক পেসমেকার" },
      { label: "ঘ", text: "কৃত্রিম পেসমেকার" }
    ],
    correct: "গ",
    exp: "ডান অলিন্দের প্রাচীরে অবস্থিত সাইনো-অ্যাট্রিয়াল নোড (SA Node) স্বতঃস্ফূর্তভাবে প্রতি মিনিটে ৭০-৮০ বার বিদ্যুৎ তরঙ্গ তৈরি করে হৃদস্পন্দন শুরু ও নিয়ন্ত্রণ করে, তাই একে প্রাকৃতিক পেসমেকার (Natural Pacemaker) বলে।"
  },

  // -------------------------------------------------------------
  // BANGLA (Questions 61 - 75)
  // -------------------------------------------------------------
  {
    num: 61,
    subject: "Bangla",
    text: "'Cartoon' শব্দটির বাংলা পারিভাষিক রূপ কোনটি?",
    opts: [
      { label: "ক", text: "চলচ্চিত্র" },
      { label: "খ", text: "রূপকথা" },
      { label: "গ", text: "ব্যঙ্গচিত্র" },
      { label: "ঘ", text: "চিত্রনাট্য" }
    ],
    correct: "গ",
    exp: "ইংরেজি 'Cartoon' শব্দের বাংলা স্বীকৃত প্রমিত পরিভাষা হলো 'ব্যঙ্গচিত্র'।"
  },
  {
    num: 62,
    subject: "Bangla",
    text: "'মুখর' শব্দের সমার্থক শব্দ কোনটি?",
    opts: [
      { label: "ক", text: "মৃদুভাষী" },
      { label: "খ", text: "মৌন" },
      { label: "গ", text: "বাকহীন" },
      { label: "ঘ", text: "পঞ্চমুখ" }
    ],
    correct: "ঘ",
    exp: "'মুখর' শব্দের অর্থ বাচাল, ধ্বনিত বা অত্যন্ত প্রশংসারত। 'পঞ্চমুখ' বাগধারা বা শব্দের অর্থ অত্যন্ত মুখর বা প্রশংসায় মুখর।"
  },
  {
    num: 63,
    subject: "Bangla",
    text: "'পৌষমাস' শব্দটি বাগধারায় কী অর্থ প্রকাশ করে?",
    opts: [
      { label: "ক", text: "বিপদ" },
      { label: "খ", text: "শীতকাল" },
      { label: "গ", text: "সুসময়" },
      { label: "ঘ", text: "উৎসব" }
    ],
    correct: "গ",
    exp: "'কারো পৌষমাস, কারো সর্বনাশ' প্রবাদে 'পৌষমাস' বলতে ফসল কাটার আনন্দ ও আর্থিক 'সুসময়' বোঝানো হয়।"
  },
  {
    num: 64,
    subject: "Bangla",
    text: "'যারা ধার্মিক, তারা সুখী'- এটি কোন ধরনের বাক্য?",
    opts: [
      { label: "ক", text: "জটিল বাক্য" },
      { label: "খ", text: "সরল বাক্য" },
      { label: "গ", text: "যৌগিক বাক্য" },
      { label: "ঘ", text: "মিশ্র যৌগিক" }
    ],
    correct: "ক",
    exp: "যে বাক্যে একটি প্রধান খণ্ডবাক্য এবং তার আশ্রিত এক বা একাধিক খণ্ডবাক্য সাপেক্ষ সর্বনাম (যারা-তারা, যে-সে) দ্বারা যুক্ত থাকে, তাকে জটিল বা মিশ্র বাক্য বলে।"
  },
  {
    num: 65,
    subject: "Bangla",
    text: "'আমার পথ' প্রবন্ধে প্রাবন্ধিক নজরুল নিজের সত্যকে পথপ্রদর্শক মানাকে কী বলে অভিহিত করেছেন?",
    opts: [
      { label: "ক", text: "অহংকার" },
      { label: "খ", text: "স্পর্ধা" },
      { label: "গ", text: "আত্মবিশ্বাস (দম্ভ নয়)" },
      { label: "ঘ", text: "দাম্ভিকতা" }
    ],
    correct: "গ",
    exp: "কাজী নজরুল ইসলামের 'আমার পথ' প্রবন্ধ অনুযায়ী: 'আপনার সত্যকে পথপ্রদর্শক কাণ্ডারি বলে জানা- এটা কোনো অহংকার বা দম্ভ নয়, এটা হলো অটুট আত্মবিশ্বাস'।"
  },
  {
    num: 66,
    subject: "Bangla",
    text: "'মার্তণ্ড' শব্দটির সঠিক সন্ধি বিচ্ছেদ কোনটি?",
    opts: [
      { label: "ক", text: "মার্ত + অন্ত" },
      { label: "খ", text: "মার্ + তণ্ড" },
      { label: "গ", text: "মার্তো + অণ্ড" },
      { label: "ঘ", text: "মার্ত + অণ্ড" }
    ],
    correct: "ঘ",
    exp: "'মার্তণ্ড' (সূর্য) নিপাতনে সিদ্ধ স্বরসন্ধির উদাহরণ: মার্ত + অণ্ড = মার্তণ্ড।"
  },
  {
    num: 67,
    subject: "Bangla",
    text: "'কেয়ার কাঁটা' গ্রন্থটির রচয়িতা কে এবং এটি কোন শ্রেণির রচনা?",
    opts: [
      { label: "ক", text: "রোকেয়া সাখাওয়াত হোসেনের প্রবন্ধ" },
      { label: "খ", text: "শরৎচন্দ্র চট্টোপাধ্যায়ের নাটক" },
      { label: "গ", text: "আশাপূর্ণা দেবীর উপন্যাস" },
      { label: "ঘ", text: "মানিক বন্দ্যোপাধ্যায়ের ছোটগল্প" }
    ],
    correct: "গ",
    exp: "'কেয়ার কাঁটা' বাংলা সাহিত্যের বিশিষ্ট কথাসাহিত্যিক আশাপূর্ণা দেবীর একটি বহুল পঠিত উপন্যাস।"
  },
  {
    num: 68,
    subject: "Bangla",
    text: "'জীবন্মৃত' কোন সমাসের উদাহরণ?",
    opts: [
      { label: "ক", text: "বহুব্রীহি সমাস" },
      { label: "খ", text: "কর্মধারয় সমাস" },
      { label: "গ", text: "তৎপুরুষ সমাস" },
      { label: "ঘ", text: "দ্বন্দ্ব সমাস" }
    ],
    correct: "ক",
    exp: "'জীবিত থেকেও যে মৃত' = জীবন্মৃত। এটি বহুব্রীহি সমাসের উদাহরণ (অন্যার্থে ব্যক্তিবিশেষকে বোঝায়)।"
  },
  {
    num: 69,
    subject: "Bangla",
    text: "'লালসালু' উপন্যাসে আওয়ালপুর ও মহব্বতনগর গ্রামের মাঝখানে কোন গাছটি ছিল?",
    opts: [
      { label: "ক", text: "তেঁতুল গাছ" },
      { label: "খ", text: "বট গাছ" },
      { label: "গ", text: "পাকুড় গাছ" },
      { label: "ঘ", text: "অশ্বত্থ গাছ" }
    ],
    correct: "ক",
    exp: "সৈয়দ ওয়ালীউল্লাহর 'লালসালু' উপন্যাসে আওয়ালপুর ও মহব্বতনগরের সীমানায় মতিগঞ্জের সড়কের পাশে একটি প্রাচীন তেঁতুল গাছের উল্লেখ রয়েছে।"
  },
  {
    num: 70,
    subject: "Bangla",
    text: "নিচের কোন শব্দগুচ্ছের সবগুলো বানানই শুদ্ধ?",
    opts: [
      { label: "ক", text: "ভৌগলিক, প্রাণীবিদ্যা, পূণ্য" },
      { label: "খ", text: "ভৌগোলিক, প্রাণিবিদ্যা, পুণ্য" },
      { label: "গ", text: "ভৌগোলিক, প্রাণীবিদ্যা, পুণ্য" },
      { label: "ঘ", text: "ভৌগলিক, প্রাণিবিদ্যা, পুন্য" }
    ],
    correct: "খ",
    exp: "• ভূগোল + ইক = ভৌগোলিক (ও-কার যুক্ত)।<br>• প্রাণী হলেও সমাসবদ্ধ পদে হ্রস্ব-ইকার হয়: প্রাণিবিদ্যা।<br>• পুণ্য (পাপ-পুণ্য) বানানে হ্রস্ব-উ এবং মূর্ধন্য-ণ।<br>অতএব (খ) অপশনের প্রতিটি বানান প্রমিত।"
  },
  {
    num: 71,
    subject: "Bangla",
    text: "'সওগাত' শব্দটি কোন ভাষা থেকে বাংলা ভাষায় এসেছে?",
    opts: [
      { label: "ক", text: "আরবি" },
      { label: "খ", text: "ফারসি" },
      { label: "গ", text: "তুর্কি" },
      { label: "ঘ", text: "পর্তুগিজ" }
    ],
    correct: "গ",
    exp: "'সওগাত' (যার অর্থ উপঢৌকন বা উপহার) একটি তুর্কি ভাষার শব্দ। (যেমন: চাকু, তোপ, দারোগা, সওগাত ইত্যাদি তুর্কি শব্দ)।"
  },
  {
    num: 72,
    subject: "Bangla",
    text: "'সুকঠিন' শব্দে 'সু' উপসর্গটি কোন অর্থে ব্যবহৃত হয়েছে?",
    opts: [
      { label: "ক", text: "আতিশয্য" },
      { label: "খ", text: "সহজ" },
      { label: "গ", text: "উত্তম" },
      { label: "ঘ", text: "স্বল্পতা" }
    ],
    correct: "ক",
    exp: "'সুকঠিন' শব্দে 'সু' খাঁটি বাংলা/তৎসম উপসর্গ হিসেবে কাঠিন্যের মাত্রা বা 'আতিশয্য' (অত্যধিক কঠিন) বোঝাতে যুক্ত হয়েছে।"
  },
  {
    num: 73,
    subject: "Bangla",
    text: "'পাশরি' শব্দটির অর্থ কী?",
    opts: [
      { label: "ক", text: "স্মরণ করা" },
      { label: "খ", text: "বিস্মৃত হওয়া" },
      { label: "গ", text: "পাথর হওয়া" },
      { label: "ঘ", text: "পার হওয়া" }
    ],
    correct: "খ",
    exp: "মধ্যযুগীয় বাংলা ও পদাবলিতে 'পাশরি' শব্দের অর্থ 'বিস্মৃত হওয়া' বা 'ভুলে যাওয়া' (যেমন: 'কেমনে পাশরিব তোরে')।"
  },
  {
    num: 74,
    subject: "Bangla",
    text: "'সাধারণ' শব্দটির প্রমিত উচ্চারণ রূপ কোনটি?",
    opts: [
      { label: "ক", text: "শাদারোন" },
      { label: "খ", text: "শাধারোন্" },
      { label: "গ", text: "সাধারণ" },
      { label: "ঘ", text: "সাদারোন" }
    ],
    correct: "খ",
    exp: "'সাধারণ' শব্দের প্রমিত বাংলা উচ্চারণ হলো [শাধারোন্]। স তালব্য 'শ'-রূপে এবং অন্ত্য 'ণ' হসন্তযুক্ত ও-কারান্ত রূপ ধারণ করে।"
  },
  {
    num: 75,
    subject: "Bangla",
    text: "'বাংলার এই দুর্দিনে আমাকে ত্যাগ করবেন না'- 'সিরাজউদ্দৌলা' নাটকে এই আর্তি কার প্রতি ছিল?",
    opts: [
      { label: "ক", text: "মিরজাফরের প্রতি সিরাজের" },
      { label: "খ", text: "নবাবের প্রতি ঘসেটি বেগমের" },
      { label: "গ", text: "লুৎফার প্রতি নবাবের" },
      { label: "ঘ", text: "মোহনলালের প্রতি সিরাজের" }
    ],
    correct: "ক",
    exp: "সিকান্দার আবু জাফরের 'সিরাজউদ্দৌলা' নাটকে পলাশীর যুদ্ধের প্রাক্কালে দেশপ্রেমিক নবাব সিরাজউদ্দৌলা কোরআন ছুঁয়ে শপথ করানোর সময় প্রধান সেনাপতি মিরজাফরের উদ্দেশ্যে এই আকুল আবেদন জানান।"
  },

  // -------------------------------------------------------------
  // ENGLISH (Questions 76 - 90)
  // -------------------------------------------------------------
  {
    num: 76,
    subject: "English",
    text: "Choose the appropriate connector: “__________ ecotourism is becoming increasingly popular, it still faces several environmental and regulatory challenges.”",
    opts: [
      { label: "ক", text: "Because" },
      { label: "খ", text: "Therefore" },
      { label: "গ", text: "Although" },
      { label: "ঘ", text: "Moreover" }
    ],
    correct: "গ",
    exp: "'Although' is used to introduce a subordinate clause containing a statement that makes the main clause surprising (contrast between popularity and challenges)."
  },
  {
    num: 77,
    subject: "English",
    text: "The effect of the painkiller usually __________ after about four hours.",
    opts: [
      { label: "ক", text: "wears out" },
      { label: "খ", text: "wears down" },
      { label: "গ", text: "wears off" },
      { label: "ঘ", text: "wears away" }
    ],
    correct: "গ",
    exp: "The phrasal verb 'wear off' means to gradually disappear, diminish, or lose effect (especially of medicine, pain, or sensations)."
  },
  {
    num: 78,
    subject: "English",
    text: "He is averse __________ manual labour, and consequently failed to succeed __________ his venture.",
    opts: [
      { label: "ক", text: "for, at" },
      { label: "খ", text: "with, to" },
      { label: "গ", text: "from, on" },
      { label: "ঘ", text: "to, in" }
    ],
    correct: "ঘ",
    exp: "Appropriate prepositions: 'averse to' (having a strong dislike or disinclination) and 'succeed in' (achieve the desired aim in something)."
  },
  {
    num: 79,
    subject: "English",
    text: "In the sentence “She was especially pleased with the results”, what part of speech is 'especially'?",
    opts: [
      { label: "ক", text: "Adjective" },
      { label: "খ", text: "Adverb" },
      { label: "গ", text: "Conjunction" },
      { label: "ঘ", text: "Noun" }
    ],
    correct: "খ",
    exp: "'Especially' modifies the participial adjective 'pleased', functioning as an adverb of degree."
  },
  {
    num: 80,
    subject: "English",
    text: "Which of the following is an uncountable noun?",
    opts: [
      { label: "ক", text: "Proposal" },
      { label: "খ", text: "Machine" },
      { label: "গ", text: "Information" },
      { label: "ঘ", text: "Suggestion" }
    ],
    correct: "গ",
    exp: "'Information' is an uncountable (mass) noun in English. It cannot be pluralized (*informations) and does not take indefinite articles (*an information)."
  },
  {
    num: 81,
    subject: "English",
    text: "A person who is deeply committed and dedicated to a particular cause or activity is called a-",
    opts: [
      { label: "ক", text: "deviant" },
      { label: "খ", text: "dilettante" },
      { label: "গ", text: "devotee" },
      { label: "ঘ", text: "drifter" }
    ],
    correct: "গ",
    exp: "'Devotee' refers to an ardent follower, enthusiast, or strongly dedicated supporter of a cause, person, or interest."
  },
  {
    num: 82,
    subject: "English",
    text: "The surveillance drone flew __________ the crowded park without causing panic.",
    opts: [
      { label: "ক", text: "over" },
      { label: "খ", text: "into" },
      { label: "গ", text: "under" },
      { label: "ঘ", text: "between" }
    ],
    correct: "ক",
    exp: "The preposition 'over' indicates movement at a higher level above an area from one side to another."
  },
  {
    num: 83,
    subject: "English",
    text: "What is the antonym of the word 'dynamic'?",
    opts: [
      { label: "ক", text: "Stagnant" },
      { label: "খ", text: "Vibrant" },
      { label: "গ", text: "Kinetic" },
      { label: "ঘ", text: "Agile" }
    ],
    correct: "ক",
    exp: "'Dynamic' means constantly changing, active, or full of energy. Its direct antonym is 'stagnant' (showing no activity or change, still)."
  },
  {
    num: 84,
    subject: "English",
    text: "The word 'demented' is closest in meaning to-",
    opts: [
      { label: "ক", text: "circumspect" },
      { label: "খ", text: "insane" },
      { label: "গ", text: "judicious" },
      { label: "ঘ", text: "lucid" }
    ],
    correct: "খ",
    exp: "'Demented' means driven to irrational, crazy, or insane behavior through stress, anger, or mental impairment."
  },
  {
    num: 85,
    subject: "English",
    text: "You __________ informed the authorities before taking matters into your own hands.",
    opts: [
      { label: "ক", text: "ought" },
      { label: "খ", text: "must" },
      { label: "গ", text: "would" },
      { label: "ঘ", text: "should have" }
    ],
    correct: "ঘ",
    exp: "'Should have + past participle' expresses an unfulfilled past obligation or advice that was not followed."
  },
  {
    num: 86,
    subject: "English",
    text: "Complete the wish: “I wish you __________ all the food! I am extremely hungry now.”",
    opts: [
      { label: "ক", text: "hadn't eaten" },
      { label: "খ", text: "didn't eat" },
      { label: "গ", text: "haven't eaten" },
      { label: "ঘ", text: "wouldn't eat" }
    ],
    correct: "ক",
    exp: "Regret or wish regarding a completed past event uses the past perfect tense: 'I wish + subject + had/hadn't + V3'."
  },
  {
    num: 87,
    subject: "English",
    text: "Identify the grammatically incorrect sentence:",
    opts: [
      { label: "ক", text: "Hardly had the meeting started when the projector malfunctioned." },
      { label: "খ", text: "If I had elected as the team leader, I would have reshuffled the roster." },
      { label: "গ", text: "Neither the manager nor the clerks were present." },
      { label: "ঘ", text: "She prefers tea to coffee." }
    ],
    correct: "খ",
    exp: "In option (খ), the passive meaning requires 'If I had been elected...' instead of the active 'had elected'."
  },
  {
    num: 88,
    subject: "English",
    text: "Choose the correct spelling:",
    opts: [
      { label: "ক", text: "narcissistic" },
      { label: "খ", text: "narcisistic" },
      { label: "গ", text: "narcissestic" },
      { label: "ঘ", text: "narcisestic" }
    ],
    correct: "ক",
    exp: "The correct spelling is 'narcissistic' (having an excessive interest in oneself), containing double 's' (n-a-r-c-i-s-s-i-s-t-i-c)."
  },
  {
    num: 89,
    subject: "English",
    text: "Which figure of speech is present in the phrase “snatched from the jaws of death”?",
    opts: [
      { label: "ক", text: "Simile" },
      { label: "খ", text: "Oxymoron" },
      { label: "গ", text: "Hyperbole" },
      { label: "ঘ", text: "Metaphor" }
    ],
    correct: "ঘ",
    exp: "'Jaws of death' is a metaphor comparing death to a predatory, ravenous beast with jaws without using 'like' or 'as'."
  },
  {
    num: 90,
    subject: "English",
    text: "Prolonged exposure to dim light can __________ existing vision complications.",
    opts: [
      { label: "ক", text: "alleviate" },
      { label: "খ", text: "accelerate" },
      { label: "গ", text: "diminish" },
      { label: "ঘ", text: "appease" }
    ],
    correct: "খ",
    exp: "'Accelerate' means to increase the rate or speed of something (in this context, worsening vision problems)."
  }
];

// Format questions according to the standardized schema
const formattedQuestions = questionsData.map((q) => {
  const correctOpt = q.opts.find(o => o.label === q.correct);
  const correctText = correctOpt ? correctOpt.text : "";

  // Extract question images
  const qImages = [];
  if (q.num === 10) {
    qImages.push('/assets/imported/du_25_26_mcq_gsaUpMTeZegwDADZzInvU.png');
  }

  const options = q.opts.map((opt) => {
    const isCorrect = (opt.label === q.correct);
    const optImages = [];
    if (q.num === 28) {
      if (opt.label === 'ক') optImages.push('/assets/imported/du_25_26_mcq_1EvGSH9Dm5eSMuH40T2iE.png');
      else if (opt.label === 'খ') optImages.push('/assets/imported/du_25_26_mcq_vxkOemvnOGv6sGPcO38hm.png');
      else if (opt.label === 'গ') optImages.push('/assets/imported/du_25_26_mcq_y401m_IPhuQfLg11lN-HK.png');
      else if (opt.label === 'ঘ') optImages.push('/assets/imported/du_25_26_mcq_T5_qMSF_uFXLAWS2om0Xd.png');
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
    id: `du_25_26_mcq_${q.num}`,
    question_number: q.num,
    subject: q.subject,
    question: `${q.num}. ${cleanQuestionText}`,
    question_text: `${q.num}. ${cleanQuestionText}`,
    question_html: `<div class="pr-8 mb-2 font-medium text-card-foreground"><div class="LatexRenderer-module__qDybqa__card px-1 leading-relaxed overflow-x-auto overflow-y-hidden"><p style="line-height: 1.7" class="text-lg tracking-wide font-normal leading-relaxed">${q.num}. ${q.text}</p></div></div>`,
    question_math_tex: [],
    question_image_urls: qImages,
    options: options,
    correct_answer: {
      label: q.correct,
      text: correctText.replace(/<[^>]+>/g, '')
    },
    answer_detection: "verified",
    explanation: cleanExpMarkdown,
    explanation_html: expHtml,
    source_label: "DU A 25-26",
    all_image_urls: qImages
  };
});


// Write to files
fs.writeFileSync('Question/DU/DU_25-26_MCQ.json', JSON.stringify(formattedQuestions, null, 2), 'utf8');
console.log('Saved Question/DU/DU_25-26_MCQ.json with', formattedQuestions.length, 'questions.');

const aistudioFiles = fs.readdirSync('public/assets/aistudio');
for (const file of aistudioFiles) {
  if (file.startsWith('DU_25-26_MCQ') && file.endsWith('.json')) {
    fs.writeFileSync(path.join('public/assets/aistudio', file), JSON.stringify(formattedQuestions, null, 2), 'utf8');
    console.log(`Updated public/assets/aistudio/${file}`);
  }
}
