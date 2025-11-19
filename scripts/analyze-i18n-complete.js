/**
 * Comprehensive i18n Analysis
 * Analyzes both wiki and non-wiki translation systems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('═══════════════════════════════════════════════════════════');
console.log('📊 COMPLETE I18N SYSTEM ANALYSIS');
console.log('═══════════════════════════════════════════════════════════\n');

// Read both translation files
const mainI18nPath = path.join(__dirname, '../src/js/i18n-translations.js');
const wikiI18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');

const mainContent = fs.readFileSync(mainI18nPath, 'utf-8');
const wikiContent = fs.readFileSync(wikiI18nPath, 'utf-8');

// ============================================================================
// ANALYZE NON-WIKI PLATFORM (i18n-translations.js)
// ============================================================================

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║  NON-WIKI PLATFORM (src/js/i18n-translations.js)        ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Extract supported languages
const mainLangMatch = mainContent.match(/supportedLanguages:\s*\{([^}]+)\}/s);
const mainLangEntries = mainLangMatch ? mainLangMatch[1].match(/'([a-z]{2})':\s*\{[^}]+\}/g) : [];
const mainLangs = mainLangEntries.map(entry => entry.match(/'([a-z]{2})'/)[1]);

console.log(`📋 Languages declared in supportedLanguages: ${mainLangs.length}`);
mainLangs.forEach(lang => {
  const langData = mainContent.match(new RegExp(`'${lang}':\\s*\\{\\s*name:\\s*'([^']+)',\\s*nativeName:\\s*'([^']+)',\\s*flag:\\s*'([^']+)'`, 's'));
  if (langData) {
    console.log(`   ${langData[3]} ${lang}: ${langData[1]} (${langData[2]})`);
  }
});

// Count keys per language
const mainKeysByLang = {};
const mainNamespaces = {};

mainLangs.forEach(lang => {
  const langBlockRegex = new RegExp(`${lang}:\\s*\\{([\\s\\S]*?)\\n    (?:[a-z]{2}:|\\})`, 'm');
  const match = mainContent.match(langBlockRegex);

  if (match) {
    const langBlock = match[1];
    const keys = langBlock.match(/'([^']+)':/g);
    mainKeysByLang[lang] = keys ? keys.length : 0;

    // Extract namespaces
    if (keys && lang === 'en') {
      const namespaceSet = new Set();
      keys.forEach(key => {
        const k = key.replace(/'/g, '').replace(/:$/, '');
        const namespace = k.split('.')[0];
        namespaceSet.add(namespace);
      });
      mainNamespaces[lang] = Array.from(namespaceSet).sort();
    }
  } else {
    mainKeysByLang[lang] = 0;
  }
});

console.log(`\n📊 Translation Keys by Language:`);
Object.entries(mainKeysByLang)
  .sort((a, b) => b[1] - a[1])
  .forEach(([lang, count]) => {
    const percentage = mainKeysByLang['en'] > 0 ? ((count / mainKeysByLang['en']) * 100).toFixed(1) : '0.0';
    const status = count === mainKeysByLang['en'] ? '✅' : count > 0 ? '🟡' : '❌';
    console.log(`   ${status} ${lang}: ${count} keys (${percentage}% of EN)`);
  });

if (mainNamespaces['en']) {
  console.log(`\n📂 Namespaces in English (${mainNamespaces['en'].length}):`);
  console.log(`   ${mainNamespaces['en'].join(', ')}`);
}

// ============================================================================
// ANALYZE WIKI PLATFORM (wiki-i18n.js)
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  WIKI PLATFORM (src/wiki/js/wiki-i18n.js)              ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Extract supported languages (wiki uses different format)
const wikiLangMatch = wikiContent.match(/supportedLanguages:\s*\{([^}]+)\}/s);
const wikiLangEntries = wikiLangMatch ? wikiLangMatch[1].match(/'([a-z]{2})':\s*\{[^}]+\}/g) : [];
const wikiLangs = wikiLangEntries.map(entry => entry.match(/'([a-z]{2})'/)[1]);

// If no supportedLanguages found, extract from translations block
if (wikiLangs.length === 0) {
  const translationsMatch = wikiContent.match(/translations:\s*\{([\\s\\S]*?)\n  \}/m);
  if (translationsMatch) {
    const langMatches = translationsMatch[1].match(/\\n    ([a-z]{2}):\\s*\\{/g);
    if (langMatches) {
      wikiLangs.push(...langMatches.map(m => m.match(/([a-z]{2}):/)[1]));
    }
  }
}

console.log(`📋 Languages with translations: ${wikiLangs.length}`);

// Count keys per language in wiki
const wikiKeysByLang = {};
const wikiNamespaces = {};

wikiLangs.forEach(lang => {
  const langBlockRegex = new RegExp(`${lang}:\\s*\\{([\\s\\S]*?)\\n    (?:[a-z]{2}:|\\})`, 'm');
  const match = wikiContent.match(langBlockRegex);

  if (match) {
    const langBlock = match[1];
    const keys = langBlock.match(/'wiki\.[^']+'/g);
    wikiKeysByLang[lang] = keys ? keys.length : 0;

    // Extract namespaces for English
    if (keys && lang === 'en') {
      const namespaceSet = new Set();
      keys.forEach(key => {
        const k = key.replace(/'/g, '');
        const parts = k.split('.');
        if (parts.length >= 2) {
          const namespace = `${parts[0]}.${parts[1]}`; // wiki.nav, wiki.home, etc.
          namespaceSet.add(namespace);
        }
      });
      wikiNamespaces[lang] = Array.from(namespaceSet).sort();
    }
  } else {
    wikiKeysByLang[lang] = 0;
  }
});

console.log(`\n📊 Translation Keys by Language:`);
Object.entries(wikiKeysByLang)
  .sort((a, b) => b[1] - a[1])
  .forEach(([lang, count]) => {
    const percentage = wikiKeysByLang['en'] > 0 ? ((count / wikiKeysByLang['en']) * 100).toFixed(1) : '0.0';
    const status = count === wikiKeysByLang['en'] ? '✅' : count > wikiKeysByLang['en'] ? '🟢' : count > 0 ? '🟡' : '❌';
    console.log(`   ${status} ${lang}: ${count} keys (${percentage}% of EN)`);
  });

if (wikiNamespaces['en']) {
  console.log(`\n📂 Namespaces in English (${wikiNamespaces['en'].length}):`);
  wikiNamespaces['en'].forEach(ns => {
    const count = Object.keys(wikiContent.match(new RegExp(`'${ns}\\.[^']+':`, 'g')) || {}).length;
    console.log(`   ${ns}: ~${count} keys`);
  });
}

// ============================================================================
// COMPARISON & ANALYSIS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  COMPARISON & ORGANIZATION                                ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Find common languages
const commonLangs = mainLangs.filter(l => wikiLangs.includes(l));
const mainOnly = mainLangs.filter(l => !wikiLangs.includes(l));
const wikiOnly = wikiLangs.filter(l => !mainLangs.includes(l));

console.log(`🔗 Common Languages (${commonLangs.length}): ${commonLangs.join(', ') || 'none'}`);
console.log(`📱 Main Platform Only (${mainOnly.length}): ${mainOnly.join(', ') || 'none'}`);
console.log(`📚 Wiki Platform Only (${wikiOnly.length}): ${wikiOnly.join(', ') || 'none'}`);

// Summary stats
console.log(`\n📈 Summary Statistics:`);
console.log(`   Main Platform: ${Object.values(mainKeysByLang).reduce((a,b) => a+b, 0)} total keys across ${mainLangs.length} languages`);
console.log(`   Wiki Platform: ${Object.values(wikiKeysByLang).reduce((a,b) => a+b, 0)} total keys across ${wikiLangs.length} languages`);
console.log(`   Total System: ${Object.values(mainKeysByLang).reduce((a,b) => a+b, 0) + Object.values(wikiKeysByLang).reduce((a,b) => a+b, 0)} keys`);

// File sizes
const mainStats = fs.statSync(mainI18nPath);
const wikiStats = fs.statSync(wikiI18nPath);
const mainLines = mainContent.split('\n').length;
const wikiLines = wikiContent.split('\n').length;

console.log(`\n📄 File Information:`);
console.log(`   Main Platform: ${mainLines} lines, ${(mainStats.size / 1024).toFixed(1)} KB`);
console.log(`   Wiki Platform: ${wikiLines} lines, ${(wikiStats.size / 1024).toFixed(1)} KB`);

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  RECOMMENDATIONS                                          ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const recommendations = [];

// Check for incomplete translations
Object.entries(mainKeysByLang).forEach(([lang, count]) => {
  if (lang !== 'en' && count < mainKeysByLang['en']) {
    const missing = mainKeysByLang['en'] - count;
    recommendations.push(`⚠️  Main Platform ${lang.toUpperCase()}: Missing ${missing} keys (${((missing/mainKeysByLang['en'])*100).toFixed(1)}% incomplete)`);
  }
});

Object.entries(wikiKeysByLang).forEach(([lang, count]) => {
  if (lang !== 'en' && count < wikiKeysByLang['en']) {
    const missing = wikiKeysByLang['en'] - count;
    recommendations.push(`⚠️  Wiki Platform ${lang.toUpperCase()}: Missing ${missing} keys (${((missing/wikiKeysByLang['en'])*100).toFixed(1)}% incomplete)`);
  }
});

// Check for language consistency
if (mainOnly.length > 0) {
  recommendations.push(`💡 Consider adding ${mainOnly.join(', ')} to wiki platform for consistency`);
}
if (wikiOnly.length > 0) {
  recommendations.push(`💡 Consider adding ${wikiOnly.join(', ')} to main platform for consistency`);
}

if (recommendations.length === 0) {
  console.log('✅ All languages are complete and consistent!');
} else {
  recommendations.forEach(rec => console.log(rec));
}

console.log('\n═══════════════════════════════════════════════════════════\n');
