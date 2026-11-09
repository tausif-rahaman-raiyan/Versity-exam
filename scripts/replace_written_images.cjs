const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const file1 = path.join(process.cwd(), 'public/assets/aistudio/DU_25-26_Written_f3fe4f9d.json');
const file2 = path.join(process.cwd(), 'Question/DU/DU_25-26_Written.json');
const importedDir = path.join(process.cwd(), 'public/assets/imported');

if (!fs.existsSync(importedDir)) {
  fs.mkdirSync(importedDir, { recursive: true });
}

function fetchAndLocalize(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchAndLocalize(res.headers.location));
      }
      if (res.statusCode !== 200) {
        console.warn(`Failed ${url}: status ${res.statusCode}`);
        return resolve({ original: url, local: url });
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        let filename = '';
        if (url.includes('explanation_icon.svg')) {
          filename = 'explanation_icon.svg';
        } else {
          const hash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
          let ext = 'png';
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('jpeg')) ext = 'jpg';
          else if (contentType.includes('svg')) ext = 'svg';
          filename = `du_25_26_written_${hash}.${ext}`;
        }
        const localPath = path.join(importedDir, filename);
        fs.writeFileSync(localPath, buffer);
        const relativeUrl = `/assets/imported/${filename}`;
        console.log(`Mapped: ${url} -> ${relativeUrl}`);
        resolve({ original: url, local: relativeUrl });
      });
    }).on('error', (err) => {
      console.warn(`Error on ${url}:`, err.message);
      resolve({ original: url, local: url });
    });
  });
}

async function run() {
  let content1 = fs.readFileSync(file1, 'utf8');

  // Extract all asset URLs
  const regex = /https:\/\/(?:assets\.)?chorcha\.net\/[^"'\s<>\\]+/g;
  const matches = [...new Set(content1.match(regex) || [])];
  console.log(`Found ${matches.length} unique asset URLs in written JSON.`);

  const map = {};
  for (const url of matches) {
    const cleanUrl = url.replace(/\\$/g, '');
    const res = await fetchAndLocalize(cleanUrl);
    map[cleanUrl] = res.local;
    map[url] = res.local;
  }

  // Also replace any other chorcha image URLs if found
  let jsonStr1 = fs.readFileSync(file1, 'utf8');
  let jsonStr2 = fs.existsSync(file2) ? fs.readFileSync(file2, 'utf8') : null;

  for (const [orig, loc] of Object.entries(map)) {
    jsonStr1 = jsonStr1.split(orig).join(loc);
    if (jsonStr2) {
      jsonStr2 = jsonStr2.split(orig).join(loc);
    }
  }

  fs.writeFileSync(file1, jsonStr1);
  console.log(`Updated ${file1}`);

  if (jsonStr2) {
    fs.writeFileSync(file2, jsonStr2);
    console.log(`Updated ${file2}`);
  }

  console.log('Done replacement.');
}

run().catch(console.error);
