// Edit freely. colorKey = any Tailwind color used with the card template in the prompt (section 4.3).
export type Institution = {
  id: string; code: string; nameBn: string; nameEn: string; desc: string;
  colorKey: string; parent?: string;            // parent = shows under a group card (e.g. AGRI)
  units?: string[];                             // optional sub-filter chips on the home page
};

export const institutions: Institution[] = [
  { id: "DU",   code: "DU",   nameBn: "ঢাকা বিশ্ববিদ্যালয়",                     nameEn: "University of Dhaka",                desc: "A Unit • 2000-01 to 2025-26",              colorKey: "blue",    units: ["A"] },
  { id: "RU",   code: "RU",   nameBn: "রাজশাহী বিশ্ববিদ্যালয়",                  nameEn: "University of Rajshahi",             desc: "2010-11 to 2025-26",                       colorKey: "amber" },
  { id: "JU",   code: "JU",   nameBn: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",             nameEn: "Jahangirnagar University",           desc: "A & D Units • Set-wise papers",            colorKey: "purple",  units: ["A","D"] },
  { id: "CU",   code: "CU",   nameBn: "চট্টগ্রাম বিশ্ববিদ্যালয়",                nameEn: "University of Chittagong",           desc: "A Unit • 2010-11 to 2025-26",              colorKey: "cyan",    units: ["A"] },
  { id: "GST",  code: "GST",  nameBn: "জিএসটি গুচ্ছ",                           nameEn: "GST Cluster",                        desc: "A Unit • 2020-21 to 2025-26",              colorKey: "fuchsia", units: ["A"] },
  { id: "CoU",  code: "CoU",  nameBn: "কুমিল্লা বিশ্ববিদ্যালয়",                 nameEn: "Comilla University",                 desc: "2006-07 to 2025-26",                       colorKey: "emerald" },
  { id: "JnU",  code: "JnU",  nameBn: "জগন্নাথ বিশ্ববিদ্যালয়",                  nameEn: "Jagannath University",               desc: "A Unit • Shift-wise MCQ + Written",        colorKey: "rose",    units: ["A"] },
  { id: "KhU",  code: "KhU",  nameBn: "খুলনা বিশ্ববিদ্যালয়",                    nameEn: "Khulna University",                  desc: "A & B Units • MCQ + Written",              colorKey: "teal",    units: ["A","B"] },
  { id: "AGRI", code: "AGRI", nameBn: "কৃষি ভর্তি প্রশ্নব্যাংক",                  nameEn: "Agriculture Admission",              desc: "GST-Agri, GAU, BAU, SAU, CVASU, SYLAU",    colorKey: "lime" },
  { id: "GSTAGRI", code: "GST-AGRI", nameBn: "কৃষি গুচ্ছ",                      nameEn: "GST Agri Cluster",                   desc: "2019-20 to 2025-26",                       colorKey: "lime",   parent: "AGRI" },
  { id: "GAU",   code: "GAU",   nameBn: "গাজীপুর কৃষি বিশ্ববিদ্যালয়",           nameEn: "Gazipur Agricultural University",    desc: "2012-13 to 2017-18",                       colorKey: "lime",   parent: "AGRI" },
  { id: "BAU",   code: "BAU",   nameBn: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",          nameEn: "Bangladesh Agricultural University", desc: "2010-11 to 2018-19",                       colorKey: "lime",   parent: "AGRI" },
  { id: "SAU",   code: "SAU",   nameBn: "শের-ই-বাংলা কৃষি বিশ্ববিদ্যালয়",       nameEn: "Sher-e-Bangla Agricultural University", desc: "2010-11 to 2018-19",                    colorKey: "lime",   parent: "AGRI" },
  { id: "CVASU", code: "CVASU", nameBn: "চট্টগ্রাম ভেটেরিনারি ও প্রাণিবিজ্ঞান বিশ্ববিদ্যালয়", nameEn: "CVASU",          desc: "2010-11 to 2018-19",                       colorKey: "lime",   parent: "AGRI" },
  { id: "SYLAU", code: "SYLAU", nameBn: "সিলেট কৃষি বিশ্ববিদ্যালয়",             nameEn: "Sylhet Agricultural University",     desc: "2011-12 to 2018-19",                       colorKey: "lime",   parent: "AGRI" },
  { id: "ALL",  code: "ALL",  nameBn: "সকল বিশ্ববিদ্যালয়",                      nameEn: "All Universities",                   desc: "All papers combined",                      colorKey: "indigo" },
];
