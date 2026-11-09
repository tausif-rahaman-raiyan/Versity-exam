const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const htmlPath = path.join(process.cwd(), 'public/assets/aistudio/Paste_November_10__2026_-_3_31AM_32e0338a');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('HTML Total Length:', html.length);

// Extract all Chorcha asset images
const imgRegex = /https:\/\/assets\.chorcha\.net\/[^"'\s<>]+\.(png|jpg|jpeg|svg|gif)|https:\/\/assets\.chorcha\.net\/[A-Za-z0-9_-]+/g;
const rawMatches = html.match(imgRegex) || [];
const images = [...new Set(rawMatches.filter(url => !url.includes('banner.png') && !url.includes('favicons')))];

console.log('Found ' + images.length + ' unique Chorcha image URLs:');
images.forEach(img => console.log(' - ' + img));
