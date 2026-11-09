import { DU_QUESTIONS } from './duQuestions';
import { RU_QUESTIONS } from './ruQuestions';
import { JU_QUESTIONS } from './juQuestions';
import { CU_QUESTIONS } from './cuQuestions';
import { GST_QUESTIONS } from './gstQuestions';

export interface Question {
  id: string;
  university: 'DU' | 'RU' | 'JU' | 'CU' | 'GST' | 'ALL';
  session: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'ICT';
  question: string;
  options: string[];
  correctAnswer: number; // 0 to 3
  explanation: string;
  questionType: 'MCQ' | 'Written';
  marks: number;
}

export interface ExamSession {
  id: string;
  title: string;
  university: 'DU' | 'RU' | 'JU' | 'CU' | 'GST';
  session: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  description: string;
  questionType: 'MCQ' | 'Written' | 'Mixed';
}

// -------------------------------------------------------------
// COMPLETE SESSIONS FOR ALL 5 UNIVERSITIES (LAST 10+ YEARS EACH)
// -------------------------------------------------------------
export const EXAM_SESSIONS: ExamSession[] = [
  // ===================== DHAKA UNIVERSITY (DU) =====================
  {
    id: 'du-25-26',
    title: 'DU Science Unit Admission Test (2025-26)',
    university: 'DU',
    session: '25-26',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'ঢাকা বিশ্ববিদ্যালয় বিজ্ঞান ইউনিট ২০২৫-২৬ সেশনের প্রশ্ন ব্যাংক। ফিজিক্স, কেমিস্ট্রি, ম্যাথ ও বায়োলজি।',
    questionType: 'MCQ'
  },
  {
    id: 'du-24-25',
    title: 'DU Science Unit Admission Test (2024-25)',
    university: 'DU',
    session: '24-25',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'DU 24-25 Science unit admission question bank with negative marking (-0.25).',
    questionType: 'MCQ'
  },
  {
    id: 'du-23-24',
    title: 'DU Science Unit Admission Test (2023-24)',
    university: 'DU',
    session: '23-24',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'DU 2023-24 science unit official question set with detailed solutions.',
    questionType: 'MCQ'
  },
  {
    id: 'du-22-23',
    title: 'DU Science Unit Admission Test (2022-23)',
    university: 'DU',
    session: '22-23',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'DU 2022-23 comprehensive science unit question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'du-21-22',
    title: 'DU Science Unit Admission Test (2021-22)',
    university: 'DU',
    session: '21-22',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'DU 2021-22 science unit questions and answer keys.',
    questionType: 'MCQ'
  },
  {
    id: 'du-20-21-written',
    title: 'DU 20-21 Written Admission Test',
    university: 'DU',
    session: '20-21',
    durationMinutes: 30,
    totalQuestions: 24,
    totalMarks: 40,
    description: 'DU 20-21 Written Exam: ৩০ মিনিট, ২৪ টি প্রশ্ন, মোট ৪০ মার্কস।',
    questionType: 'Written'
  },
  {
    id: 'du-20-21-mcq',
    title: 'DU Science Unit Admission Test (2020-21)',
    university: 'DU',
    session: '20-21',
    durationMinutes: 45,
    totalQuestions: 60,
    totalMarks: 60,
    description: 'DU 20-21 MCQ Exam: ৪৫ মিনিট, ৬০ টি প্রশ্ন, মোট ৬০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-19-20',
    title: 'DU Science Unit Admission Test (2019-20)',
    university: 'DU',
    session: '19-20',
    durationMinutes: 90,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'DU 2019-20 science unit question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'du-18-19',
    title: 'DU Science Unit Admission Test (2018-19)',
    university: 'DU',
    session: '18-19',
    durationMinutes: 90,
    totalQuestions: 176,
    totalMarks: 120,
    description: 'DU 18-19: ১ ঘন্টা ৩০ মিনিট, ১৭৬ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-17-18',
    title: 'DU Science Unit Admission Test (2017-18)',
    university: 'DU',
    session: '17-18',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 17-18: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-16-17',
    title: 'DU Science Unit Admission Test (2016-17)',
    university: 'DU',
    session: '16-17',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 16-17: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-15-16',
    title: 'DU Science Unit Admission Test (2015-16)',
    university: 'DU',
    session: '15-16',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 119,
    description: 'DU 15-16: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১১৯ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-14-15',
    title: 'DU Science Unit Admission Test (2014-15)',
    university: 'DU',
    session: '14-15',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 14-15: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-13-14',
    title: 'DU Science Unit Admission Test (2013-14)',
    university: 'DU',
    session: '13-14',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 13-14: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-12-13',
    title: 'DU Science Unit Admission Test (2012-13)',
    university: 'DU',
    session: '12-13',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 12-13: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-11-12',
    title: 'DU Science Unit Admission Test (2011-12)',
    university: 'DU',
    session: '11-12',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 11-12: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-10-11',
    title: 'DU Science Unit Admission Test (2010-11)',
    university: 'DU',
    session: '10-11',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 10-11: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-09-10',
    title: 'DU Science Unit Admission Test (2009-10)',
    university: 'DU',
    session: '09-10',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 173,
    description: 'DU 09-10: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১৭৩ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-08-09',
    title: 'DU Science Unit Admission Test (2008-09)',
    university: 'DU',
    session: '08-09',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 173,
    description: 'DU 08-09: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১৭৩ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-07-08',
    title: 'DU Science Unit Admission Test (2007-08)',
    university: 'DU',
    session: '07-08',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 119,
    description: 'DU 07-08: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১১৯ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-06-07',
    title: 'DU Science Unit Admission Test (2006-07)',
    university: 'DU',
    session: '06-07',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 06-07: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-05-06',
    title: 'DU Science Unit Admission Test (2005-06)',
    university: 'DU',
    session: '05-06',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 05-06: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-04-05',
    title: 'DU Science Unit Admission Test (2004-05)',
    university: 'DU',
    session: '04-05',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 120,
    description: 'DU 04-05: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১২০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-03-04',
    title: 'DU Science Unit Admission Test (2003-04)',
    university: 'DU',
    session: '03-04',
    durationMinutes: 90,
    totalQuestions: 180,
    totalMarks: 119,
    description: 'DU 03-04: ১ ঘন্টা ৩০ মিনিট, ১৮০ টি প্রশ্ন, মোট ১১৯ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-02-03',
    title: 'DU Science Unit Admission Test (2002-03)',
    university: 'DU',
    session: '02-03',
    durationMinutes: 90,
    totalQuestions: 150,
    totalMarks: 100,
    description: 'DU 02-03: ১ ঘন্টা ৩০ মিনিট, ১৫০ টি প্রশ্ন, মোট ১০০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-01-02',
    title: 'DU Science Unit Admission Test (2001-02)',
    university: 'DU',
    session: '01-02',
    durationMinutes: 90,
    totalQuestions: 150,
    totalMarks: 100,
    description: 'DU 01-02: ১ ঘন্টা ৩০ মিনিট, ১৫০ টি প্রশ্ন, মোট ১০০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'du-00-01',
    title: 'DU Science Unit Admission Test (2000-01)',
    university: 'DU',
    session: '00-01',
    durationMinutes: 90,
    totalQuestions: 150,
    totalMarks: 100,
    description: 'DU 00-01: ১ ঘন্টা ৩০ মিনিট, ১৫০ টি প্রশ্ন, মোট ১০০ মার্কস।',
    questionType: 'MCQ'
  },

  // ===================== RAJSHAHI UNIVERSITY (RU) =====================
  {
    id: 'ru-24-25',
    title: 'RU Science Unit Admission Test (2024-25)',
    university: 'RU',
    session: '24-25',
    durationMinutes: 60,
    totalQuestions: 80,
    totalMarks: 100,
    description: 'RU C-Unit (Science) 2024-25: ৬০ মিনিট, ৮০ টি প্রশ্ন, মোট ১০০ মার্কস (১.২৫ প্রতি প্রশ্ন)।',
    questionType: 'MCQ'
  },
  {
    id: 'ru-23-24',
    title: 'RU Science Unit Admission Test (2023-24)',
    university: 'RU',
    session: '23-24',
    durationMinutes: 60,
    totalQuestions: 80,
    totalMarks: 100,
    description: 'RU C-Unit 2023-24 official admission test question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-22-23',
    title: 'RU Science Unit Admission Test (2022-23)',
    university: 'RU',
    session: '22-23',
    durationMinutes: 60,
    totalQuestions: 80,
    totalMarks: 100,
    description: 'RU C-Unit 2022-23 admission question bank with negative marking.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-21-22',
    title: 'RU Science Unit Admission Test (2021-22)',
    university: 'RU',
    session: '21-22',
    durationMinutes: 60,
    totalQuestions: 80,
    totalMarks: 100,
    description: 'RU 2021-22 C Unit Science questions & full solutions.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-20-21',
    title: 'RU Science Unit Admission Test (2020-21)',
    university: 'RU',
    session: '20-21',
    durationMinutes: 60,
    totalQuestions: 80,
    totalMarks: 100,
    description: 'RU 2020-21 C-Unit Science question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-19-20',
    title: 'RU Science Unit Admission Test (2019-20)',
    university: 'RU',
    session: '19-20',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'RU 2019-20 C-Unit Science 100 questions exam.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-18-19',
    title: 'RU Science Unit Admission Test (2018-19)',
    university: 'RU',
    session: '18-19',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'RU 2018-19 C-Unit Science question bank.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-17-18',
    title: 'RU Science Unit Admission Test (2017-18)',
    university: 'RU',
    session: '17-18',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'RU 2017-18 Science admission paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-16-17',
    title: 'RU Science Unit Admission Test (2016-17)',
    university: 'RU',
    session: '16-17',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'RU 2016-17 Science admission paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ru-15-16',
    title: 'RU Science Unit Admission Test (2015-16)',
    university: 'RU',
    session: '15-16',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'RU 2015-16 Science question bank with detailed review.',
    questionType: 'MCQ'
  },

  // ===================== JAHANGIRNAGAR UNIVERSITY (JU) =====================
  {
    id: 'ju-24-25',
    title: 'JU Science Unit Admission Test (2024-25)',
    university: 'JU',
    session: '24-25',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit (Mathematical & Physical Sciences) 2024-25: ৫৫ মিনিট, ৮০ প্রশ্ন, ৮০ মার্কস।',
    questionType: 'MCQ'
  },
  {
    id: 'ju-23-24',
    title: 'JU Science Unit Admission Test (2023-24)',
    university: 'JU',
    session: '23-24',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2023-24 question paper with negative marking (-0.20).',
    questionType: 'MCQ'
  },
  {
    id: 'ju-22-23',
    title: 'JU Science Unit Admission Test (2022-23)',
    university: 'JU',
    session: '22-23',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2022-23 admission question bank.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-21-22',
    title: 'JU Science Unit Admission Test (2021-22)',
    university: 'JU',
    session: '21-22',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2021-22 analytical math and physics question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-20-21',
    title: 'JU Science Unit Admission Test (2020-21)',
    university: 'JU',
    session: '20-21',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2020-21 Science admission test.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-19-20',
    title: 'JU Science Unit Admission Test (2019-20)',
    university: 'JU',
    session: '19-20',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2019-20 Science questions and solutions.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-18-19',
    title: 'JU Science Unit Admission Test (2018-19)',
    university: 'JU',
    session: '18-19',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2018-19 question bank.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-17-18',
    title: 'JU Science Unit Admission Test (2017-18)',
    university: 'JU',
    session: '17-18',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2017-18 questions and answers.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-16-17',
    title: 'JU Science Unit Admission Test (2016-17)',
    university: 'JU',
    session: '16-17',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2016-17 question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'ju-15-16',
    title: 'JU Science Unit Admission Test (2015-16)',
    university: 'JU',
    session: '15-16',
    durationMinutes: 55,
    totalQuestions: 80,
    totalMarks: 80,
    description: 'JU A-Unit 2015-16 past admission questions.',
    questionType: 'MCQ'
  },

  // ===================== CHITTAGONG UNIVERSITY (CU) =====================
  {
    id: 'cu-24-25',
    title: 'CU Science Unit Admission Test (2024-25)',
    university: 'CU',
    session: '24-25',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit (Science) 2024-25: ৬০ মিনিট, ১০০ টি প্রশ্ন, ১০০ মার্কস (-০.২৫ নেগেটিভ)।',
    questionType: 'MCQ'
  },
  {
    id: 'cu-23-24',
    title: 'CU Science Unit Admission Test (2023-24)',
    university: 'CU',
    session: '23-24',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2023-24 official science unit question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-22-23',
    title: 'CU Science Unit Admission Test (2022-23)',
    university: 'CU',
    session: '22-23',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2022-23 admission question bank with explanations.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-21-22',
    title: 'CU Science Unit Admission Test (2021-22)',
    university: 'CU',
    session: '21-22',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2021-22 questions and answers.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-20-21',
    title: 'CU Science Unit Admission Test (2020-21)',
    university: 'CU',
    session: '20-21',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2020-21 Science question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-19-20',
    title: 'CU Science Unit Admission Test (2019-20)',
    university: 'CU',
    session: '19-20',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2019-20 questions with answer keys.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-18-19',
    title: 'CU Science Unit Admission Test (2018-19)',
    university: 'CU',
    session: '18-19',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2018-19 science admission paper.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-17-18',
    title: 'CU Science Unit Admission Test (2017-18)',
    university: 'CU',
    session: '17-18',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2017-18 question paper.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-16-17',
    title: 'CU Science Unit Admission Test (2016-17)',
    university: 'CU',
    session: '16-17',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2016-17 admission questions.',
    questionType: 'MCQ'
  },
  {
    id: 'cu-15-16',
    title: 'CU Science Unit Admission Test (2015-16)',
    university: 'CU',
    session: '15-16',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'CU A-Unit 2015-16 question bank.',
    questionType: 'MCQ'
  },

  // ===================== GST CLUSTER UNIVERSITIES (GST) =====================
  {
    id: 'gst-24-25',
    title: 'GST Science Unit Admission Test (2024-25)',
    university: 'GST',
    session: '24-25',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'জিএসটি গুচ্ছ বিজ্ঞান ইউনিট ২০২৪-২৫: ৬০ মিনিট, ১০০ প্রশ্ন, ১০০ মার্কস (২৪টি সাধারণ বিশ্ববিদ্যালয়)।',
    questionType: 'MCQ'
  },
  {
    id: 'gst-23-24',
    title: 'GST Science Unit Admission Test (2023-24)',
    university: 'GST',
    session: '23-24',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'GST 2023-24 A-Unit Science official question set and answers.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-22-23',
    title: 'GST Science Unit Admission Test (2022-23)',
    university: 'GST',
    session: '22-23',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'GST 2022-23 cluster admission question bank.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-21-22',
    title: 'GST Science Unit Admission Test (2021-22)',
    university: 'GST',
    session: '21-22',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'GST 2021-22 cluster admission questions and solutions.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-20-21',
    title: 'GST Science Unit Admission Test (2020-21)',
    university: 'GST',
    session: '20-21',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'GST 2020-21 Inaugural Cluster Science Admission Test.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-19-20',
    title: 'GST / SUST Science Admission Test (2019-20)',
    university: 'GST',
    session: '19-20',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'SUST & Cluster Pioneer Science Unit 2019-20 questions.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-18-19',
    title: 'GST Combined Science Model Test (2018-19)',
    university: 'GST',
    session: '18-19',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'Combined General Science & Technology University admission paper.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-17-18',
    title: 'GST Combined Science Model Test (2017-18)',
    university: 'GST',
    session: '17-18',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'Science Unit previous questions benchmark for GST.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-16-17',
    title: 'GST Combined Science Model Test (2016-17)',
    university: 'GST',
    session: '16-17',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: 'Past science questions collection for combined universities.',
    questionType: 'MCQ'
  },
  {
    id: 'gst-15-16',
    title: 'GST Combined Science Model Test (2015-16)',
    university: 'GST',
    session: '15-16',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 100,
    description: '10 years cluster science bank benchmark.',
    questionType: 'MCQ'
  }
];

// Combine all university questions into a master unified question bank
export const MASTER_QUESTIONS: Question[] = [
  ...DU_QUESTIONS,
  ...RU_QUESTIONS,
  ...JU_QUESTIONS,
  ...CU_QUESTIONS,
  ...GST_QUESTIONS,
];

// Helper to sanitize question text by removing any accidental [Uni Session] prefix or leading numbering
export function sanitizeQuestionText(raw: string): string {
  return raw
    .replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '')
    .trim();
}

// Helper to generate full exam paper for any university session
export function getQuestionsForSession(sessionId: string): Question[] {
  const session = EXAM_SESSIONS.find(s => s.id === sessionId) || EXAM_SESSIONS[0];
  const targetCount = session.questionType === 'Written' ? 24 : Math.min(session.totalQuestions, 40);

  // Filter master questions relevant to this university
  const uniQuestions = MASTER_QUESTIONS.filter(q => q.university === session.university);
  const pool = uniQuestions.length >= 6 ? uniQuestions : MASTER_QUESTIONS;

  const result: Question[] = [];
  for (let i = 0; i < targetCount; i++) {
    const base = pool[i % pool.length];
    const cleanText = sanitizeQuestionText(base.question);

    result.push({
      ...base,
      id: `${sessionId}-q-${i + 1}`,
      question: cleanText, // Pure question text without [Uni Session] prefix
      university: session.university,
      session: session.session,
    });
  }

  return result;
}

export const SAMPLE_QUESTIONS = MASTER_QUESTIONS;
