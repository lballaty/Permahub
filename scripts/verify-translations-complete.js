/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/verify-translations-complete.js
 * Description: Verify all translation keys exist in EN, PT, ES, CS languages
 * Author: Claude Code
 * Created: 2025-01-16
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Languages to verify
const LANGUAGES_TO_VERIFY = ['en', 'pt', 'es', 'cs', 'de'];
const LANGUAGE_NAMES = {
  en: 'English',
  pt: 'Portuguese',
  es: 'Spanish',
  cs: 'Czech',
  de: 'German'
};

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 TRANSLATION COMPLETENESS VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

// Read wiki-i18n.js file
const i18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

// Extract translations object using regex
const translationsMatch = i18nContent.match(/const wikiI18n = \{[\s\S]*?translations: (\{[\s\S]*?\n  \}),/);
if (!translationsMatch) {
  console.error('❌ Could not extract translations object from wiki-i18n.js');
  process.exit(1);
}

// Parse the translations (we'll extract keys manually)
const extractKeysFromLanguage = (langCode) => {
  const langRegex = new RegExp(`${langCode}: \\{([\\s\\S]*?)\\n    \\}`, 'm');
  const match = i18nContent.match(langRegex);

  if (!match) {
    return [];
  }

  const langContent = match[1];
  const keyRegex = /'([^']+)':\s*'[^']*(?:\\'[^']*)*'/g;
  const keys = [];
  let keyMatch;

  while ((keyMatch = keyRegex.exec(langContent)) !== null) {
    keys.push(keyMatch[1]);
  }

  return keys;
};

// Extract all keys from each language
const languageKeys = {};
LANGUAGES_TO_VERIFY.forEach(lang => {
  languageKeys[lang] = extractKeysFromLanguage(lang);
  console.log(`📊 ${LANGUAGE_NAMES[lang]} (${lang}): ${languageKeys[lang].length} keys found`);
});

console.log('\n' + '═══════════════════════════════════════════════════════════');
console.log('📋 ANALYSIS BY LANGUAGE');
console.log('═══════════════════════════════════════════════════════════\n');

// Use English as the baseline (should have all keys)
const baselineKeys = new Set(languageKeys['en']);
console.log(`🔵 Baseline (English): ${baselineKeys.size} unique keys\n`);

// Check each language against the baseline
const results = {};
LANGUAGES_TO_VERIFY.slice(1).forEach(lang => {
  const langKeySet = new Set(languageKeys[lang]);
  const missing = [...baselineKeys].filter(key => !langKeySet.has(key));
  const extra = [...langKeySet].filter(key => !baselineKeys.has(key));

  results[lang] = {
    total: langKeySet.size,
    missing: missing,
    extra: extra,
    coverage: ((langKeySet.size - extra.length) / baselineKeys.size * 100).toFixed(2)
  };

  console.log(`🔵 ${LANGUAGE_NAMES[lang]} (${lang})`);
  console.log(`   Total keys: ${langKeySet.size}`);
  console.log(`   Coverage: ${results[lang].coverage}% (${langKeySet.size - extra.length}/${baselineKeys.size})`);
  console.log(`   Missing keys: ${missing.length}`);
  console.log(`   Extra keys: ${extra.length}`);

  if (missing.length > 0) {
    console.log(`\n   ❌ Missing keys in ${lang}:`);
    missing.slice(0, 10).forEach(key => console.log(`      - ${key}`));
    if (missing.length > 10) {
      console.log(`      ... and ${missing.length - 10} more`);
    }
  }

  if (extra.length > 0) {
    console.log(`\n   ⚠️  Extra keys in ${lang} (not in English):`);
    extra.slice(0, 5).forEach(key => console.log(`      - ${key}`));
    if (extra.length > 5) {
      console.log(`      ... and ${extra.length - 5} more`);
    }
  }

  console.log('');
});

// Key category analysis
console.log('═══════════════════════════════════════════════════════════');
console.log('📂 KEY CATEGORY BREAKDOWN');
console.log('═══════════════════════════════════════════════════════════\n');

const categories = {};
[...baselineKeys].forEach(key => {
  const category = key.split('.')[1] || 'other'; // e.g., wiki.auth.login -> auth
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(key);
});

Object.keys(categories).sort().forEach(category => {
  console.log(`📁 ${category}: ${categories[category].length} keys`);

  // Check coverage for this category in each language
  LANGUAGES_TO_VERIFY.slice(1).forEach(lang => {
    const langKeySet = new Set(languageKeys[lang]);
    const categoryKeys = categories[category];
    const translated = categoryKeys.filter(key => langKeySet.has(key)).length;
    const percentage = (translated / categoryKeys.length * 100).toFixed(1);

    const status = percentage === '100.0' ? '✅' : percentage > '90.0' ? '🟡' : '❌';
    console.log(`   ${status} ${lang}: ${percentage}% (${translated}/${categoryKeys.length})`);
  });
  console.log('');
});

// Generate detailed report
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');

let allComplete = true;

LANGUAGES_TO_VERIFY.forEach(lang => {
  if (lang === 'en') {
    console.log(`✅ ${LANGUAGE_NAMES[lang]}: ${baselineKeys.size} keys (BASELINE)`);
  } else {
    const result = results[lang];
    if (result.missing.length === 0 && result.extra.length === 0) {
      console.log(`✅ ${LANGUAGE_NAMES[lang]}: ${result.total} keys - 100% COMPLETE`);
    } else {
      console.log(`❌ ${LANGUAGE_NAMES[lang]}: ${result.coverage}% complete - ${result.missing.length} missing, ${result.extra.length} extra`);
      allComplete = false;
    }
  }
});

console.log('\n' + '═══════════════════════════════════════════════════════════');

if (allComplete) {
  console.log('🎉 ALL LANGUAGES COMPLETE! 🎉');
  console.log('═══════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.log('⚠️  INCOMPLETE TRANSLATIONS DETECTED');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Write detailed report to file
  const reportPath = path.join(__dirname, '../docs/translation-gaps-report.json');
  const detailedReport = {
    generatedAt: new Date().toISOString(),
    baseline: {
      language: 'en',
      totalKeys: baselineKeys.size
    },
    languages: {}
  };

  LANGUAGES_TO_VERIFY.slice(1).forEach(lang => {
    detailedReport.languages[lang] = {
      name: LANGUAGE_NAMES[lang],
      ...results[lang]
    };
  });

  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
  console.log(`📝 Detailed report written to: ${reportPath}\n`);

  process.exit(1);
}
