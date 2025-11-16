/**
 * Simple i18n verification script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load wiki-i18n.js
const i18nFile = fs.readFileSync(path.join(__dirname, '../src/wiki/js/wiki-i18n.js'), 'utf-8');

// Extract all English translation keys
const keyMatches = i18nFile.matchAll(/'(wiki\.[^']+)':\s*'[^']+'/g);
const translationKeys = new Set([...keyMatches].map(m => m[1]));

console.log(`📚 Found ${translationKeys.size} translation keys in wiki-i18n.js\n`);

// Find all HTML files
const wikiDir = path.join(__dirname, '../src/wiki');
const htmlFiles = fs.readdirSync(wikiDir).filter(f => f.endsWith('.html'));

let totalAttributes = 0;
let totalMissing = 0;
const missingByPage = {};

console.log('='.repeat(80));
console.log('🔍 Checking i18n coverage');
console.log('='.repeat(80) + '\n');

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(wikiDir, htmlFile), 'utf-8');

  // Find all i18n attributes
  const matches = [...content.matchAll(/data-i18n(?:-placeholder)?=["']([^"']+)["']/g)];
  const pageKeys = matches.map(m => m[1]);
  totalAttributes += pageKeys.length;

  // Find missing
  const missing = pageKeys.filter(key => !translationKeys.has(key));

  console.log(`📄 ${htmlFile.padEnd(30)} Attributes: ${String(pageKeys.length).padStart(3)}`);

  if (missing.length > 0) {
    console.log(`   ❌ Missing ${missing.length}:`);
    missing.forEach(k => console.log(`      - ${k}`));
    missingByPage[htmlFile] = missing;
    totalMissing += missing.length;
  }
}

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY');
console.log('='.repeat(80));
console.log(`Total i18n attributes:        ${totalAttributes}`);
console.log(`Translation keys available:   ${translationKeys.size}`);
console.log(`Missing translations:         ${totalMissing}`);
console.log(`Pages with missing keys:      ${Object.keys(missingByPage).length}`);

if (totalMissing > 0) {
  const reportPath = path.join(__dirname, '../docs/i18n-missing-keys.json');
  fs.writeFileSync(reportPath, JSON.stringify(missingByPage, null, 2));
  console.log(`\n📝 Report: ${reportPath}`);
  process.exit(1);
} else {
  console.log('\n✅ All i18n attributes have translations!');
}
