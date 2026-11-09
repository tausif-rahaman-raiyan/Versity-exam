const fs = require('fs');
const path = require('path');
const https = require('https');

const rawHtml = fs.readFileSync('public/assets/aistudio/Paste_November_10__2026_-_3_36AM_3c10e8f9', 'utf8');

// 1. Find all image URLs from assets.chorcha.net
const imgRegex = /https:\/\/assets\.chorcha\.net\/([^"'\s\)\\]+)/g;
const imgMatches = [];
let match;
while ((match = imgRegex.exec(rawHtml)) !== null) {
  const url = match[0];
  if (!url.includes('favicons') && !url.includes('banner.png') && !url.includes('explanation_icon')) {
    imgMatches.push(url);
  }
}

const uniqueImgUrls = [...new Set(imgMatches)];
console.log('Unique Question Image URLs found:', uniqueImgUrls);

// Ensure directory exists
const targetDir = path.join(__dirname, '../public/assets/imported');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Download images helper
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${filename}`);
      return resolve(`/assets/imported/${filename}`);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${filename}`);
          resolve(`/assets/imported/${filename}`);
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function processImages() {
  const urlMap = {};
  for (let i = 0; i < uniqueImgUrls.length; i++) {
    const url = uniqueImgUrls[i];
    const basename = path.basename(url);
    const localName = `du_25_26_mcq_${basename}`;
    const localPath = await downloadImage(url, localName);
    urlMap[url] = localPath;
  }
  return urlMap;
}

processImages().then((urlMap) => {
  console.log('URL Map:', urlMap);
}).catch(console.error);
