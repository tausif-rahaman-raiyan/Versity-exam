const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const htmlPath = path.join(process.cwd(), 'public/assets/aistudio/Paste_November_10__2026_-_3_31AM_32e0338a');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('HTML Total Length:', html.length);

// Extract all Chorcha asset images
const imgRegex = /https:\/\/assets\.chorcha\.net\/[^"'\s<>]+/g;
const images = [...new Set(html.match(imgRegex) || [])];
console.log('Found ' + images.length + ' unique Chorcha image URLs:');
images.forEach(img => console.log(' - ' + img));
