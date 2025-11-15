#!/usr/bin/env node
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/analyze-seed-files.js
 * Description: Analyzes SQL seed files for duplicate and overlapping wiki content
 * Author: Claude (AI Assistant)
 * Created: 2025-11-15
 *
 * Purpose: Parse SQL seed files and identify potential duplicates in guides, events, and locations
 * Usage: node scripts/analyze-seed-files.js [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seed files to analyze
const SEED_FILES = [
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seed_madeira_czech.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/004_real_verified_wiki_content.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/003_wiki_real_data_LOCATIONS_ONLY.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/004_future_events_seed.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/003_expanded_wiki_categories.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/006_comprehensive_global_seed_data.sql'
];

const VERBOSE = process.argv.includes('--verbose');

/**
 * Extract content from SQL INSERT statements
 */
function parseSQL(content, table) {
  const items = [];

  // Match INSERT INTO statements for the specified table
  const insertRegex = new RegExp(`INSERT INTO ${table}\\s*\\([^)]+\\)\\s*VALUES`, 'gi');
  const matches = content.match(insertRegex);

  if (!matches) return items;

  // Find the position of each INSERT statement
  let startPos = 0;
  while (true) {
    const insertPos = content.indexOf(`INSERT INTO ${table}`, startPos);
    if (insertPos === -1) break;

    // Find the end of VALUES section (look for semicolon or ON CONFLICT)
    let endPos = content.indexOf(';', insertPos);
    const onConflictPos = content.indexOf('ON CONFLICT', insertPos);
    if (onConflictPos !== -1 && onConflictPos < endPos) {
      endPos = onConflictPos;
    }

    if (endPos === -1) break;

    const insertBlock = content.substring(insertPos, endPos);

    // Extract individual records - split by pattern "),(", but handle E'...' strings
    const records = extractRecords(insertBlock);

    records.forEach((record, idx) => {
      const item = parseRecord(record, table);
      if (item) {
        items.push({
          ...item,
          _source: 'unknown',
          _index: items.length
        });
      }
    });

    startPos = endPos + 1;
  }

  return items;
}

/**
 * Extract individual records from VALUES clause
 */
function extractRecords(insertBlock) {
  const records = [];
  const valuesMatch = insertBlock.match(/VALUES\s+([\s\S]+)/i);
  if (!valuesMatch) return records;

  let valuesSection = valuesMatch[1].trim();

  // Simple approach: split by ),( but be careful with nested parens in ARRAY[]
  let depth = 0;
  let recordStart = 0;

  for (let i = 0; i < valuesSection.length; i++) {
    const char = valuesSection[i];

    if (char === '(') depth++;
    if (char === ')') {
      depth--;

      // When we return to depth 0, we've finished a record
      if (depth === 0) {
        const record = valuesSection.substring(recordStart, i + 1);
        records.push(record);

        // Skip comma and whitespace
        i += 1;
        while (i < valuesSection.length && (valuesSection[i] === ',' || valuesSection[i].match(/\s/))) {
          i++;
        }
        recordStart = i;
      }
    }
  }

  return records;
}

/**
 * Parse a single record from VALUES
 */
function parseRecord(record, table) {
  // Remove outer parentheses
  record = record.trim();
  if (record.startsWith('(')) record = record.substring(1);
  if (record.endsWith(')')) record = record.substring(0, record.length - 1);

  // Extract key fields based on table type
  const item = {};

  try {
    if (table === 'wiki_guides') {
      item.type = 'guide';
      item.title = extractQuotedString(record, 0);
      item.slug = extractQuotedString(record, 1);
      item.summary = extractQuotedString(record, 2);
      item.content = extractQuotedString(record, 3);
      item.wordCount = item.content ? item.content.split(/\s+/).length : 0;
    } else if (table === 'wiki_events') {
      item.type = 'event';
      item.title = extractQuotedString(record, 0);
      item.slug = extractQuotedString(record, 1);
      item.description = extractQuotedString(record, 2);
      item.content = item.description || '';
      item.wordCount = item.content ? item.content.split(/\s+/).length : 0;
    } else if (table === 'wiki_locations') {
      item.type = 'location';
      item.name = extractQuotedString(record, 0);
      item.slug = extractQuotedString(record, 1);
      item.description = extractQuotedString(record, 2);
      item.content = item.description || '';
      item.wordCount = item.content ? item.content.split(/\s+/).length : 0;
    }
  } catch (err) {
    if (VERBOSE) console.warn('Parse error:', err.message);
    return null;
  }

  return item;
}

/**
 * Extract nth quoted string from record
 */
function extractQuotedString(record, index) {
  const parts = [];
  let inString = false;
  let currentString = '';
  let stringType = null; // ' or E'
  let i = 0;

  while (i < record.length) {
    const char = record[i];
    const next = record[i + 1];

    if (!inString) {
      // Check for E' (extended string)
      if (char === 'E' && next === "'") {
        inString = true;
        stringType = "E'";
        i += 2;
        continue;
      }
      // Check for ' (regular string)
      if (char === "'") {
        inString = true;
        stringType = "'";
        i++;
        continue;
      }
      // Check for NULL
      if (record.substring(i, i + 4).toUpperCase() === 'NULL') {
        parts.push(null);
        i += 4;
        continue;
      }
    } else {
      // Inside string
      if (char === "'" && next === "'") {
        // Escaped quote
        currentString += "'";
        i += 2;
        continue;
      }
      if (char === "'" && next !== "'") {
        // End of string
        parts.push(currentString);
        currentString = '';
        inString = false;
        stringType = null;
        i++;
        continue;
      }
      currentString += char;
    }

    i++;
  }

  return parts[index] || null;
}

/**
 * Calculate Jaccard similarity between two texts
 */
function jaccardSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  // Extract significant words (>4 characters)
  const words1 = new Set(
    text1.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4)
  );

  const words2 = new Set(
    text2.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4)
  );

  if (words1.size === 0 || words2.size === 0) return 0;

  // Calculate intersection
  const intersection = new Set([...words1].filter(w => words2.has(w)));

  // Calculate union
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Check for slug similarity
 */
function slugSimilarity(slug1, slug2) {
  if (!slug1 || !slug2) return 0;

  // Remove year suffixes for comparison
  const base1 = slug1.replace(/-\d{4}$/, '');
  const base2 = slug2.replace(/-\d{4}$/, '');

  if (base1 === base2) return 1.0;

  // Check if one contains the other
  if (base1.includes(base2) || base2.includes(base1)) {
    return 0.8;
  }

  // Calculate word overlap
  const words1 = new Set(base1.split('-'));
  const words2 = new Set(base2.split('-'));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Analyze all seed files
 */
function analyzeAllFiles() {
  console.log('🔍 Analyzing Wiki Seed Files for Duplicates and Overlaps\n');
  console.log('=' .repeat(80) + '\n');

  const allGuides = [];
  const allEvents = [];
  const allLocations = [];

  // Parse all files
  SEED_FILES.forEach(filePath => {
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        return;
      }

      const fileName = path.basename(filePath);
      const content = fs.readFileSync(filePath, 'utf8');

      console.log(`📄 Parsing: ${fileName}`);

      // Extract guides, events, locations
      const guides = parseSQL(content, 'wiki_guides');
      const events = parseSQL(content, 'wiki_events');
      const locations = parseSQL(content, 'wiki_locations');

      guides.forEach(g => g._source = fileName);
      events.forEach(e => e._source = fileName);
      locations.forEach(l => l._source = fileName);

      allGuides.push(...guides);
      allEvents.push(...events);
      allLocations.push(...locations);

      console.log(`   ✓ Guides: ${guides.length}, Events: ${events.length}, Locations: ${locations.length}\n`);
    } catch (err) {
      console.error(`❌ Error parsing ${filePath}:`, err.message);
    }
  });

  console.log('=' .repeat(80));
  console.log(`\n📊 Total Content Parsed:\n`);
  console.log(`   Guides:    ${allGuides.length}`);
  console.log(`   Events:    ${allEvents.length}`);
  console.log(`   Locations: ${allLocations.length}\n`);

  // Analyze for duplicates
  console.log('=' .repeat(80) + '\n');

  analyzeContent('GUIDES', allGuides);
  analyzeContent('EVENTS', allEvents);
  analyzeContent('LOCATIONS', allLocations);
}

/**
 * Analyze a collection of content items for overlaps
 */
function analyzeContent(label, items) {
  console.log(`\n🔎 Analyzing ${label} for Duplicates and Overlaps\n`);
  console.log('-'.repeat(80) + '\n');

  if (items.length === 0) {
    console.log(`   No ${label.toLowerCase()} found.\n`);
    return;
  }

  const duplicateSlugs = [];
  const contentOverlaps = [];

  // Check slug duplicates
  const slugMap = {};
  items.forEach(item => {
    const slug = item.slug;
    if (!slug) return;

    if (slugMap[slug]) {
      duplicateSlugs.push({
        slug,
        items: [slugMap[slug], item]
      });
    } else {
      slugMap[slug] = item;
    }
  });

  // Check content overlaps
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];

      // Calculate similarities
      const contentSim = jaccardSimilarity(item1.content, item2.content);
      const slugSim = slugSimilarity(item1.slug, item2.slug);

      // Flag if significant overlap
      if (contentSim > 0.3 || slugSim > 0.6) {
        contentOverlaps.push({
          item1,
          item2,
          contentSimilarity: (contentSim * 100).toFixed(1),
          slugSimilarity: (slugSim * 100).toFixed(1),
          severity: contentSim > 0.5 ? 'CRITICAL' : contentSim > 0.4 ? 'WARNING' : 'INFO'
        });
      }
    }
  }

  // Report duplicate slugs
  if (duplicateSlugs.length > 0) {
    console.log(`\n🚨 DUPLICATE SLUGS (${duplicateSlugs.length})\n`);
    duplicateSlugs.forEach(dup => {
      console.log(`   Slug: "${dup.slug}"`);
      dup.items.forEach(item => {
        const displayTitle = item.title || item.name || 'Untitled';
        console.log(`      - ${displayTitle} (${item._source})`);
      });
      console.log();
    });
  } else {
    console.log(`✅ No duplicate slugs found\n`);
  }

  // Report content overlaps
  if (contentOverlaps.length > 0) {
    // Sort by severity
    const critical = contentOverlaps.filter(o => o.severity === 'CRITICAL');
    const warnings = contentOverlaps.filter(o => o.severity === 'WARNING');
    const info = contentOverlaps.filter(o => o.severity === 'INFO');

    console.log(`\n⚠️  CONTENT OVERLAPS (${contentOverlaps.length} total)\n`);

    if (critical.length > 0) {
      console.log(`   🔴 CRITICAL (>50% similar): ${critical.length}\n`);
      critical.forEach(overlap => {
        printOverlap(overlap);
      });
    }

    if (warnings.length > 0) {
      console.log(`   🟡 WARNING (>40% similar): ${warnings.length}\n`);
      warnings.forEach(overlap => {
        printOverlap(overlap);
      });
    }

    if (info.length > 0 && VERBOSE) {
      console.log(`   🔵 INFO (>30% similar): ${info.length}\n`);
      info.forEach(overlap => {
        printOverlap(overlap);
      });
    }
  } else {
    console.log(`✅ No significant content overlaps found\n`);
  }

  // Summary
  console.log('-'.repeat(80));
  console.log(`\nSummary for ${label}:`);
  console.log(`   Total items:       ${items.length}`);
  console.log(`   Duplicate slugs:   ${duplicateSlugs.length}`);
  console.log(`   Content overlaps:  ${contentOverlaps.length}`);
  if (contentOverlaps.length > 0) {
    const critical = contentOverlaps.filter(o => o.severity === 'CRITICAL').length;
    const warnings = contentOverlaps.filter(o => o.severity === 'WARNING').length;
    console.log(`      Critical: ${critical}, Warnings: ${warnings}, Info: ${contentOverlaps.length - critical - warnings}`);
  }
  console.log();
}

/**
 * Print details of an overlap
 */
function printOverlap(overlap) {
  const { item1, item2, contentSimilarity, slugSimilarity, severity } = overlap;

  const title1 = item1.title || item1.name || 'Untitled';
  const title2 = item2.title || item2.name || 'Untitled';

  console.log(`   ${severity}: ${contentSimilarity}% content, ${slugSimilarity}% slug similarity`);
  console.log(`      1. "${title1}"`);
  console.log(`         Slug: ${item1.slug}`);
  console.log(`         Source: ${item1._source}`);
  console.log(`         Words: ${item1.wordCount || 0}`);
  console.log(`      2. "${title2}"`);
  console.log(`         Slug: ${item2.slug}`);
  console.log(`         Source: ${item2._source}`);
  console.log(`         Words: ${item2.wordCount || 0}`);
  console.log();
}

// Run analysis
try {
  analyzeAllFiles();

  console.log('=' .repeat(80));
  console.log('\n✅ Analysis Complete\n');
  console.log('Recommendations:');
  console.log('   1. Review all CRITICAL overlaps - likely duplicates');
  console.log('   2. Check WARNING overlaps - may need consolidation');
  console.log('   3. Fix duplicate slugs immediately - will cause database errors');
  console.log('   4. Run with --verbose to see INFO level overlaps\n');
} catch (err) {
  console.error('❌ Fatal error:', err.message);
  if (VERBOSE) console.error(err.stack);
  process.exit(1);
}
