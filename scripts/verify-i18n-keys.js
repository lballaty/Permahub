/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/verify-i18n-keys.js
 * Description: Verify all data-i18n attributes have corresponding translations
 * Author: Claude Code
 * Created: 2025-01-16
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load wiki-i18n.js and extract English translations
const i18nFilePath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
const i18nContent = fs.readFileSync(i18nFilePath, 'utf-8');

// Extract English translations using regex
const enMatch = i18nContent.match(/translations\.en\s*=\s*(\{[\s\S]*?\n\s*\};)/);
if (!enMatch) {
  console.error('❌ Could not extract English translations from wiki-i18n.js');
  process.exit(1);
}

// Parse the translations object
let translations = {};
try {
  // Create a safe eval context
  const evalCode = `(${enMatch[1].replace(/;$/, '')})`;
  translations = eval(evalCode);
} catch (e) {
  console.error('❌ Error parsing translations:', e.message);
  process.exit(1);
}

// Recursive function to get all keys from nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const translationKeys = new Set(getAllKeys(translations));
console.log(`📚 Found ${translationKeys.size} translation keys in wiki-i18n.js\n`);

// Find all HTML files in src/wiki
const wikiDir = path.join(__dirname, '../src/wiki');
const htmlFiles = fs.readdirSync(wikiDir).filter(f => f.endsWith('.html'));

let totalAttributes = 0;
let totalMissing = 0;
const missingByPage = {};

console.log('='.repeat(80));
console.log('🔍 Checking i18n coverage across all wiki pages');
console.log('='.repeat(80) + '\n');

for (const htmlFile of htmlFiles) {
  const filePath = path.join(wikiDir, htmlFile);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all data-i18n and data-i18n-placeholder attributes
  const i18nRegex = /data-i18n(?:-placeholder)?=["']([^"']+)["']/g;
  const matches = [...content.matchAll(i18nRegex)];

  const pageKeys = matches.map(m => m[1]);
  totalAttributes += pageKeys.length;

  // Check which keys are missing
  const missing = pageKeys.filter(key => !translationKeys.has(key));

  console.log(`📄 ${htmlFile}`);
  console.log(`   Attributes: ${pageKeys.length}`);

  if (missing.length > 0) {
    console.log(`   ❌ Missing: ${missing.length}`);
    missing.forEach(k => console.log(`      - ${k}`));
    missingByPage[htmlFile] = missing;
    totalMissing += missing.length;
  } else {
    console.log(`   ✅ All translations present`);
  }
  console.log('');
}

// Summary
console.log('='.repeat(80));
console.log('📊 SUMMARY');
console.log('='.repeat(80));
console.log(`Total i18n attributes found: ${totalAttributes}`);
console.log(`Translation keys in wiki-i18n.js: ${translationKeys.size}`);
console.log(`Missing translations: ${totalMissing}`);
console.log(`Pages with missing keys: ${Object.keys(missingByPage).length}`);

if (totalMissing > 0) {
  console.log('\n❌ MISSING TRANSLATIONS:');
  console.log(JSON.stringify(missingByPage, null, 2));

  // Write to file
  const reportPath = path.join(__dirname, '../docs/i18n-missing-keys.json');
  fs.writeFileSync(reportPath, JSON.stringify(missingByPage, null, 2));
  console.log(`\n📝 Full report written to: ${reportPath}`);

  process.exit(1);
} else {
  console.log('\n✅ All i18n attributes have corresponding translations!');
  process.exit(0);
}
