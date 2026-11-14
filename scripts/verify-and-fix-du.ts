#!/usr/bin/env npx tsx
/**
 * Targeted deterministic verification and repair pass for DU 25-26 through 00-01:
 * 1. Never guesses answers for incomplete or missing-diagram questions; explicitly sets
 *    answerVerified: false and correctAnswer: -1 with transparent provenance notes.
 * 2. Fixes verified OCR typos and sets mathematically proven verified keys (e.g. du-02-03-q-018).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Question } from '../src/types';

const DU_ROOT = path.resolve('public/data/questions/DU');

async function walkJson(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walkJson(p)));
    else if (e.isFile() && e.name.endsWith('.json')) files.push(p);
  }
  return files.sort();
}

async function main() {
  const files = await walkJson(DU_ROOT);
  let modifiedFiles = 0;
  let updatedQuestions = 0;

  for (const filePath of files) {
    const questions = JSON.parse(await fs.readFile(filePath, 'utf8')) as Question[];
    let changed = false;

    for (const q of questions) {
      // 1. Incomplete / missing required diagram or missing correct-option image: do NOT guess!
      if (q.id === 'du-04-05-q-120') {
        q.correctAnswer = -1;
        q.answerVerified = false;
        q.provenance = {
          ...(q.provenance || {}),
          verificationStatus: 'Incomplete — required vector diagram unavailable in source',
          notes: 'প্রশ্নে উল্লিখিত ভেক্টরগুলোর দিক নির্দেশক চিত্র (Q120_QUESTION_1.jpg) উৎসে সংযুক্ত না থাকায় অনুমান করে উত্তর নির্ধারণ করা হয়নি।'
        };
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-13-14-q-139') {
        q.correctAnswer = -1;
        q.answerVerified = false;
        q.provenance = {
          ...(q.provenance || {}),
          verificationStatus: 'Incomplete — required circuit diagram unavailable in source',
          notes: 'প্রশ্নে উল্লিখিত তড়িৎ বর্তনীর চিত্র (Q139_QUESTION_1.png) উৎসে সংযুক্ত না থাকায় B ও C বিন্দুর বিভব পার্থক্য নির্ভরযোগ্যভাবে যাচাই করা সম্ভব নয়।'
        };
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-10-11-q-009') {
        q.correctAnswer = -1;
        q.answerVerified = false;
        q.provenance = {
          ...(q.provenance || {}),
          verificationStatus: 'Incomplete — official answer option image (A) unavailable in source',
          notes: 'সঠিক বিকল্প হিসেবে চিহ্নিত (ক) অপশনের লেখচিত্র (Q9_OPTA_1.png) উৎসে অনুপস্থিত থাকায় প্রশ্নটি অসম্পূর্ণ হিসেবে চিহ্নিত করা হলো।'
        };
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-11-12-q-074') {
        q.question = q.question.replace('দেখানোহয়েছে', 'দেখানো হয়েছে');
        q.correctAnswer = -1;
        q.answerVerified = false;
        q.provenance = {
          ...(q.provenance || {}),
          verificationStatus: 'Incomplete — official answer option image (D) unavailable in source',
          notes: 'উত্তরপত্রে চিহ্নিত (ঘ) অপশনের লেখচিত্র (Q74_OPTD_1.png) উৎসে অনুপস্থিত থাকায় প্রশ্নটি অসম্পূর্ণ হিসেবে চিহ্নিত করা হলো।'
        };
        changed = true;
        updatedQuestions++;
      }

      // 2. Mathematically verifiable fix for du-02-03-q-018 (A \ B = A ∩ B')
      else if (q.id === 'du-02-03-q-018') {
        q.options = [
          "$A \\cup B = A \\cup B'$",
          "$A \\setminus B = A \\cap B'$",
          "$A \\setminus B = A' \\cup B$",
          "$A \\setminus B = A' \\cup B$"
        ];
        q.correctAnswer = 1;
        q.answerVerified = true;
        q.provenance = {
          ...(q.provenance || {}),
          verificationStatus: 'Verified mathematically (set difference identity A \\ B = A ∩ B\')',
          notes: 'উৎসে A//B দ্বারা সেট অন্তর (A \\ B) বোঝানো হয়েছে এবং সেট তত্ত্বের অভেদ অনুসারে A \\ B = A ∩ B\' সর্বদা সত্য।'
        };
        changed = true;
        updatedQuestions++;
      }

      // 3. Verified OCR text repairs across DU 00-01 to 25-26
      else if (q.id === 'du-00-01-q-122') {
        q.question =
          '$\\mathrm{N}_{2}\\mathrm{O}_{5} \\rightleftharpoons 2\\mathrm{NO}_{2} + \\frac{1}{2}\\mathrm{O}_{2}$, ইহা একটি প্রথম ক্রম বিক্রিয়া এবং এই বিক্রিয়ার বেগ ধ্রুবকের মান $6.2 \\times 10^{-4} \\mathrm{~s}^{-1}$। এই বিক্রিয়ার অর্ধায়ু-';
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-00-01-q-130') {
        q.question = q.question.replace('অাক্ষেপ', 'অধঃক্ষেপ');
        q.options = q.options.map((opt) => opt.replace('আরণ', 'জারণ'));
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-a-19-20-mcq-q-039') {
        q.options = q.options.map((opt) =>
          opt.replace(/х/g, 'x').replace(/у/g, 'y')
        );
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-23-24-mcq-q-018') {
        q.question = q.question
          .replace('ভরঘর্ষণহীন', 'ভর ঘর্ষণহীন')
          .replace('ওপরদিয়ে', 'ওপর দিয়ে');
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-25-26-mcq-q-002') {
        q.options = q.options.map((opt) =>
          opt
            .replace('8.0 L হিলিয়াম 12 kPa চাপে', '8.0 L হিলিয়াম 120 kPa চাপে')
            .replace("250'kPa", '250 kPa')
        );
        changed = true;
        updatedQuestions++;
      } else if (q.id === 'du-25-26-mcq-q-015') {
        q.question =
          "m ভরের একটি উপগ্রহ পৃথিবীপৃষ্ঠ থেকে x উচ্চতায় পৃথিবীর চারপাশে ঘুরে যেখানে পৃথিবীর ব্যাসার্ধ R। যদি পৃথিবীপৃষ্ঠে অভিকর্ষজ ত্বরণ g হয়, তাহলে উপগ্রহটির কক্ষপথে গতি কত? (A satellite of mass m revolves around the earth at a height x above the earth's surface where the radius of the earth is R. If g is the gravitational acceleration on the surface of the earth, what is the orbital speed of the satellite?)";
        changed = true;
        updatedQuestions++;
      }
    }

    if (changed) {
      await fs.writeFile(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
      modifiedFiles++;
    }
  }

  console.log({ duFilesScanned: files.length, modifiedFiles, updatedQuestions });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
