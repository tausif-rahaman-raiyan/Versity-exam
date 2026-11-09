const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');

const IMPORTED_DIR = path.join(__dirname, '..', 'public', 'assets', 'imported');
if (!fs.existsSync(IMPORTED_DIR)) {
  fs.mkdirSync(IMPORTED_DIR, { recursive: true });
}

function downloadImage(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') return resolve(url);
    if (!url.startsWith('http://') && !url.startsWith('https://')) return resolve(url);
    
    // Create safe local filename
    const filename = url.replace(/[^a-zA-Z0-9_\.-]/g, '_').slice(-60);
    const localFilename = `${Date.now()}_${filename}`;
    const targetPath = path.join(IMPORTED_DIR, localFilename);
    const publicUrl = `/assets/imported/${localFilename}`;

    if (fs.existsSync(targetPath)) {
      return resolve(publicUrl);
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(targetPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(publicUrl);
        });
      } else {
        console.warn(`Failed to download ${url}: status ${res.statusCode}`);
        resolve(url);
      }
    });

    req.on('error', (err) => {
      console.warn(`Error downloading ${url}:`, err.message);
      resolve(url);
    });

    req.setTimeout(8000, () => {
      req.destroy();
      resolve(url);
    });
  });
}

function cleanHtml(html, imgMap) {
  if (!html) return '';
  let cleaned = html;
  for (const [orig, local] of imgMap.entries()) {
    cleaned = cleaned.split(orig).join(local);
  }
  return cleaned.trim();
}

async function parseChorchaMcqHtml(filePath, sessionPrefix, sessionYear) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);

  // Find all cards or question containers
  const cards = $('.question-card, .card, .q-card, [class*="question"]').toArray();
  console.log(`[${sessionPrefix}] Found raw elements: ${cards.length}`);

  const questionElements = $('.card-body, .question-card-body, div[id^="question-"]').toArray();
  
  // We can select elements containing question text or answer choices
  // Let me inspect the structure of one of the files to ensure exact selectors.
}

// Let's test reading one file structure first
console.log('Script helper loaded.');
