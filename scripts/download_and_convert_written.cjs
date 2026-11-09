const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const htmlPath = path.join(process.cwd(), 'public/assets/aistudio/Paste_November_10__2026_-_3_31AM_32e0338a');
const html = fs.readFileSync(htmlPath, 'utf8');

const importedDir = path.join(process.cwd(), 'public/assets/imported');
if (!fs.existsSync(importedDir)) {
  fs.mkdirSync(importedDir, { recursive: true });
}

// 1. Download & localize all 9 Chorcha image URLs
const imgRegex = /https:\/\/assets\.chorcha\.net\/[A-Za-z0-9_-]+(?:\.(?:png|jpg|jpeg|svg|gif))?/g;
const rawMatches = html.match(imgRegex) || [];
const imageUrls = [...new Set(rawMatches.filter(url => !url.includes('banner.png') && !url.includes('favicons')))];

console.log('Downloading & Localizing ' + imageUrls.length + ' image assets...');

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchImage(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/png';
        let ext = 'png';
        if (contentType.includes('jpeg')) ext = 'jpg';
        else if (contentType.includes('svg')) ext = 'svg';
        else if (contentType.includes('gif')) ext = 'gif';
        else if (url.endsWith('.png')) ext = 'png';
        else if (url.endsWith('.jpg')) ext = 'jpg';
        
        const hash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
        const filename = `du_25_26_written_${hash}.${ext}`;
        const localPath = path.join(importedDir, filename);
        fs.writeFileSync(localPath, buffer);
        const relativeUrl = `/assets/imported/${filename}`;
        console.log(`Saved: ${url} -> ${relativeUrl}`);
        resolve({ original: url, local: relativeUrl });
      });
    }).on('error', reject);
  });
}

async function main() {
  const urlMap = {};
  for (const url of imageUrls) {
    try {
      const res = await fetchImage(url);
      urlMap[res.original] = res.local;
    } catch (e) {
      console.warn(`Error downloading ${url}:`, e.message);
    }
  }

  // 2. Parse HTML content into structured questions for DU 25-26 Written
  // We will replace all Chorcha image URLs in html with localized urlMap values
  let localizedHtml = html;
  for (const [orig, loc] of Object.entries(urlMap)) {
    localizedHtml = localizedHtml.split(orig).join(loc);
  }

  // Parse questions from DOM structure
  // HTML structure has section titles like <h3 ...>পদার্থবিজ্ঞান (Physics)(4)</h3>
  // and question cards inside <div class="w-full">...
  
  const sections = [
    { name: 'Physics', title: 'পদার্থবিজ্ঞান (Physics)' },
    { name: 'Chemistry', title: 'রসায়ন (Chemistry)' },
    { name: 'Mathematics', title: 'গণিত (Mathematics)' },
    { name: 'Biology', title: 'জীববিজ্ঞান (Biology)' },
    { name: 'Bangla', title: 'বাংলা' },
    { name: 'English', title: 'ইংরেজি (English)' }
  ];

  // We can write a JS DOM-like parser using regex to extract question cards
  // Each question card contains question HTML and optional explanation HTML
  const questionBlocks = [];
  let qNumber = 1;

  // Split by section headers or question cards
  // Let's inspect section matches:
  const sectionSplitter = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
  let secMatch;
  const sectionIndices = [];
  while ((secMatch = sectionSplitter.exec(localizedHtml)) !== null) {
    sectionIndices.push({
      header: secMatch[1].replace(/<[^>]*>/g, '').trim(),
      index: secMatch.index
    });
  }

  console.log('Section headers found:', sectionIndices);

  // Output sanitized localized JSON for DU 25-26 Written
  const outputQuestions = [];
  
  // Custom manual extraction of the 22 authentic written questions from the HTML
  // Physics 1-4, Chemistry 1.1, 1.2, 2.1, 2.2, 3, 4.1, 4.2, Math 1-4, Biology 1-4, Bangla 1, 2.1-2.3, 3.1-3.4, English 1.1-1.4, 2, 3
  
  fs.writeFileSync('./scripts/localized_written_html.html', localizedHtml);
  console.log('Saved localized HTML for detailed JSON building.');
}

main().catch(console.error);
