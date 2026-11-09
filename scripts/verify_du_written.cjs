const fs = require('fs');
const path = require('path');

const writtenPath1 = path.join(process.cwd(), 'public/assets/aistudio/DU_25-26_Written_f3fe4f9d.json');
const writtenPath2 = path.join(process.cwd(), 'Question/DU/DU_25-26_Written.json');

const data1 = JSON.parse(fs.readFileSync(writtenPath1, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(writtenPath2, 'utf8'));

console.log(`File 1 question count: ${data1.questions.length}`);
console.log(`File 2 question count: ${data2.questions.length}`);

let externalLinkCount = 0;
let localLinkCount = 0;

for (const q of data1.questions) {
  const qStr = JSON.stringify(q);
  if (qStr.includes('chorcha.net')) {
    externalLinkCount++;
  }
  if (qStr.includes('/assets/imported/')) {
    localLinkCount++;
  }
}

console.log(`External links in File 1 questions: ${externalLinkCount}`);
console.log(`Local links in File 1 questions: ${localLinkCount}`);

if (data1.questions.length === 22 && externalLinkCount === 0) {
  console.log('DU 25-26 Written verification PASSED successfully!');
} else {
  console.error('DU 25-26 Written verification FAILED.');
  process.exit(1);
}
