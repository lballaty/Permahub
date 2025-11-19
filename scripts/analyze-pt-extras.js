/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/analyze-pt-extras.js
 * Description: Analyze Portuguese extra translation keys and their UI usage
 * Author: Claude Code
 * Created: 2025-01-17
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 PORTUGUESE EXTRAS ANALYSIS');
console.log('═══════════════════════════════════════════════════════════\n');

// Read wiki-i18n.js file
const i18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

// Extract keys from a language
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

// Extract translation for a key
const extractTranslation = (langCode, key) => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const translationRegex = new RegExp(`'${escapedKey}':\\s*'([^']*(?:\\\\'[^']*)*)'`, 'm');
  const langRegex = new RegExp(`${langCode}: \\{([\\s\\S]*?)\\n    \\}`, 'm');
  const langMatch = i18nContent.match(langRegex);

  if (!langMatch) return null;

  const transMatch = langMatch[1].match(translationRegex);
  return transMatch ? transMatch[1] : null;
};

// Get all keys
const enKeys = extractKeysFromLanguage('en');
const ptKeys = extractKeysFromLanguage('pt');

console.log(`📊 English keys: ${enKeys.length}`);
console.log(`📊 Portuguese keys: ${ptKeys.length}`);

const enSet = new Set(enKeys);
const ptSet = new Set(ptKeys);

// Find Portuguese extras
const ptExtras = ptKeys.filter(key => !enSet.has(key));
console.log(`📊 Portuguese extra keys: ${ptExtras.length}\n`);

// Group extras by section
const bySection = {};
ptExtras.forEach(key => {
  const parts = key.split('.');
  const section = parts.slice(0, 2).join('.');
  if (!bySection[section]) bySection[section] = [];
  bySection[section].push(key);
});

console.log('═══════════════════════════════════════════════════════════');
console.log('📂 PORTUGUESE EXTRAS BY SECTION');
console.log('═══════════════════════════════════════════════════════════\n');

Object.keys(bySection).sort().forEach(section => {
  console.log(`\n📁 ${section} (${bySection[section].length} keys):`);
  bySection[section].forEach(key => {
    const translation = extractTranslation('pt', key);
    const slug = key.replace(/^wiki\.[^.]+\./, '');
    console.log(`   • ${slug}`);
    console.log(`     PT: ${translation}`);
  });
});

// Check which keys are used in the UI
console.log('\n═══════════════════════════════════════════════════════════');
console.log('🔍 UI USAGE ANALYSIS');
console.log('═══════════════════════════════════════════════════════════\n');

const projectRoot = path.join(__dirname, '..');
const searchPaths = ['src/wiki/**/*.html', 'src/wiki/**/*.js'];

const usageReport = {
  used: [],
  notUsed: []
};

ptExtras.forEach(key => {
  let foundUsage = false;

  // Search for the key in HTML and JS files
  searchPaths.forEach(pattern => {
    try {
      const result = execSync(`grep -r "${key}" ${projectRoot}/src/wiki/ 2>/dev/null || true`, {
        encoding: 'utf-8'
      });

      if (result.trim()) {
        foundUsage = true;
      }
    } catch (e) {
      // Ignore errors
    }
  });

  // Also check for the slug part in data-i18n attributes
  const keyParts = key.split('.');
  const slug = keyParts[keyParts.length - 1];

  try {
    const dataI18nResult = execSync(
      `grep -r 'data-i18n.*${slug}' ${projectRoot}/src/wiki/ 2>/dev/null || true`,
      { encoding: 'utf-8' }
    );

    if (dataI18nResult.trim()) {
      foundUsage = true;
    }
  } catch (e) {
    // Ignore errors
  }

  // Check for wikiI18n.t() calls
  try {
    const functionCallResult = execSync(
      `grep -r "wikiI18n\\.t.*${slug}" ${projectRoot}/src/wiki/ 2>/dev/null || true`,
      { encoding: 'utf-8' }
    );

    if (functionCallResult.trim()) {
      foundUsage = true;
    }
  } catch (e) {
    // Ignore errors
  }

  if (foundUsage) {
    usageReport.used.push(key);
  } else {
    usageReport.notUsed.push(key);
  }
});

console.log(`✅ Keys used in UI: ${usageReport.used.length}`);
if (usageReport.used.length > 0) {
  usageReport.used.forEach(key => {
    console.log(`   • ${key}`);
  });
}

console.log(`\n❌ Keys NOT used in UI: ${usageReport.notUsed.length}`);
if (usageReport.notUsed.length > 0) {
  usageReport.notUsed.forEach(key => {
    console.log(`   • ${key}`);
  });
}

// Save detailed report
const reportData = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalPtKeys: ptKeys.length,
    totalEnKeys: enKeys.length,
    ptExtras: ptExtras.length,
    usedInUI: usageReport.used.length,
    notUsedInUI: usageReport.notUsed.length
  },
  bySection: Object.keys(bySection).reduce((acc, section) => {
    acc[section] = bySection[section].map(key => ({
      key,
      slug: key.replace(/^wiki\.[^.]+\./, ''),
      translation: extractTranslation('pt', key),
      usedInUI: usageReport.used.includes(key)
    }));
    return acc;
  }, {}),
  usageReport
};

const reportPath = path.join(__dirname, '../docs/pt-extras-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`📝 Detailed report saved to: docs/pt-extras-analysis.json`);
console.log('═══════════════════════════════════════════════════════════\n');
