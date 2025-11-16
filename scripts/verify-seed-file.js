/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/verify-seed-file.js
 * Description: Comprehensive verification of SQL seed files (guides, events, locations) before migration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extract INSERT statements for a specific table
 *
 * @param {string} sqlContent - Raw SQL file content
 * @param {string} tableName - Table name (e.g., 'wiki_guides', 'wiki_events', 'wiki_locations')
 * @returns {Array} Array of extracted records
 */
function extractRecordsFromSQL(sqlContent, tableName) {
  const records = [];

  // Match INSERT INTO table_name statements
  const pattern = new RegExp(
    `INSERT INTO ${tableName}\\s*\\([^)]+\\)\\s*VALUES\\s*([\\s\\S]*?)(?:ON CONFLICT|;(?:\\s*$|\\s*--))`,
    'gi'
  );

  const matches = sqlContent.matchAll(pattern);

  for (const match of matches) {
    const valuesSection = match[1];

    // Split by ),( to get individual records
    const recordPattern = /\(([^)]+(?:\([^)]*\)[^)]*)*)\)(?:,|\s*$)/g;
    const recordMatches = valuesSection.matchAll(recordPattern);

    for (const recordMatch of recordMatches) {
      const fields = parseInsertValues(recordMatch[1]);
      records.push(fields);
    }
  }

  return records;
}

/**
 * Parse VALUES(...) content into individual fields
 * Handles E'...' strings with escaped quotes and nested parentheses
 *
 * @param {string} valuesContent - Content between VALUES ( ... )
 * @returns {Array} Array of field values
 */
function parseInsertValues(valuesContent) {
  const fields = [];
  let current = '';
  let inString = false;
  let stringDelimiter = null;
  let escapeNext = false;
  let depth = 0;

  valuesContent = valuesContent.trim();

  for (let i = 0; i < valuesContent.length; i++) {
    const char = valuesContent[i];
    const nextChar = valuesContent[i + 1];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      current += char;
      continue;
    }

    // Handle E'...' strings
    if (!inString && char === 'E' && nextChar === "'") {
      inString = true;
      stringDelimiter = "'";
      i++; // Skip the quote
      continue;
    }

    // Handle regular '...' strings
    if (!inString && char === "'") {
      inString = true;
      stringDelimiter = "'";
      continue;
    }

    // Handle string end (doubled quotes are escapes)
    if (inString && char === stringDelimiter) {
      if (nextChar === stringDelimiter) {
        current += char;
        i++; // Skip next quote
        continue;
      }
      inString = false;
      stringDelimiter = null;
      continue;
    }

    // Handle parentheses depth (for ARRAY['...'])
    if (!inString && char === '(') depth++;
    if (!inString && char === ')') depth--;

    // Handle field separator
    if (!inString && char === ',' && depth === 0) {
      fields.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  // Push last field
  if (current.trim()) {
    fields.push(current.trim());
  }

  return fields;
}

/**
 * Clean extracted string values
 *
 * @param {string} str - Raw string from SQL
 * @returns {string} Cleaned string
 */
function cleanString(str) {
  if (!str) return '';
  if (str === 'NULL') return '';

  // Remove surrounding quotes
  str = str.replace(/^E?'(.+)'$/s, '$1');

  // Unescape doubled quotes
  str = str.replace(/''/g, "'");

  // Handle basic escape sequences
  str = str.replace(/\\n/g, '\n');
  str = str.replace(/\\t/g, '\t');
  str = str.replace(/\\r/g, '\r');

  return str.trim();
}

/**
 * Calculate word count from text content
 *
 * @param {string} text - Text content to count words in
 * @returns {number} Word count
 */
function calculateWordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Check for required sections in markdown content
 *
 * @param {string} content - Markdown content
 * @returns {Object} Section presence check
 */
function checkRequiredSections(content) {
  if (!content) return {};

  const sections = {
    hasIntroduction: /##?\s+Introduction/i.test(content),
    hasResourcesSection: /##?\s+(Resources?|Further Reading|Sources?)/i.test(content),
    hasCitations: /https?:\/\//i.test(content) || /Source:/i.test(content),
    hasSafetySection: /##?\s+(Safety|Precautions?|Warnings?)/i.test(content),
    hasExamples: /##?\s+Examples?/i.test(content) || /\*\*Example/i.test(content),
    hasHeaders: /^##?\s+/m.test(content),
    hasConclusion: /##?\s+(Conclusion|Summary)/i.test(content)
  };

  return sections;
}

/**
 * Verify a single wiki guide's compliance
 *
 * @param {Object} guide - Guide object
 * @param {string} sourceFile - Source SQL file name
 * @returns {Object} Verification results
 */
function verifyGuide(guide, sourceFile) {
  const wordCount = calculateWordCount(guide.content);
  const sections = checkRequiredSections(guide.content);

  // Calculate scores
  const wordCountScore = Math.min(100, (wordCount / 1000) * 100);

  let summaryScore = 0;
  const summaryLength = guide.summary?.length || 0;
  if (summaryLength >= 100 && summaryLength <= 150) {
    summaryScore = 100;
  } else if (summaryLength >= 75 && summaryLength <= 200) {
    summaryScore = 75;
  } else if (summaryLength > 0) {
    summaryScore = 50;
  }

  const citationScore = sections.hasCitations ? 100 : 0;
  const resourcesScore = sections.hasResourcesSection ? 100 : 0;
  const structureScore = (
    (sections.hasHeaders ? 25 : 0) +
    (sections.hasIntroduction ? 25 : 0) +
    (sections.hasResourcesSection ? 25 : 0) +
    (sections.hasConclusion ? 25 : 0)
  );

  // Overall compliance (weighted average)
  const weights = {
    wordCount: 0.30,
    summary: 0.10,
    citations: 0.20,
    resources: 0.20,
    structure: 0.20
  };

  const overallScore = (
    wordCountScore * weights.wordCount +
    summaryScore * weights.summary +
    citationScore * weights.citations +
    resourcesScore * weights.resources +
    structureScore * weights.structure
  );

  // Collect issues
  const issues = [];
  const recommendations = [];

  if (wordCount < 1000) {
    issues.push(`Word count too low: ${wordCount}/1,000 words (${wordCountScore.toFixed(1)}%)`);
    recommendations.push(`Expand content to at least 1,000 words (currently ${1000 - wordCount} words short)`);
  }
  if (summaryLength < 100 || summaryLength > 150) {
    issues.push(`Summary length not optimal: ${summaryLength}/100-150 chars`);
    recommendations.push(`Adjust summary to 100-150 characters (currently ${summaryLength} chars)`);
  }
  if (!sections.hasCitations) {
    issues.push('No citations or sources found');
    recommendations.push('Add citations and source links throughout the content');
  }
  if (!sections.hasResourcesSection) {
    issues.push('Missing Resources/Further Reading section');
    recommendations.push('Add "Resources & Further Reading" section with at least 3 sources');
  }
  if (!sections.hasIntroduction) {
    issues.push('Missing Introduction section');
    recommendations.push('Add "## Introduction" section at the beginning');
  }
  if (!sections.hasConclusion) {
    recommendations.push('Consider adding a Conclusion or Summary section');
  }

  return {
    type: 'guide',
    title: guide.title,
    slug: guide.slug,
    wordCount,
    summaryLength,
    sections,
    scores: {
      wordCountScore,
      summaryScore,
      citationScore,
      resourcesScore,
      structureScore,
      overallScore
    },
    issues,
    recommendations,
    passes: overallScore >= 80
  };
}

/**
 * Verify a single wiki event's compliance
 *
 * @param {Object} event - Event object
 * @param {string} sourceFile - Source SQL file name
 * @returns {Object} Verification results
 */
function verifyEvent(event, sourceFile) {
  const issues = [];
  const recommendations = [];

  // Required fields check
  const hasTitle = event.title && event.title.length >= 10;
  const hasDescription = event.description && event.description.length >= 50;
  const hasDate = event.event_date && /^\d{4}-\d{2}-\d{2}$/.test(event.event_date);
  const hasLocation = event.location_name && event.location_name.length > 0;
  const hasType = event.event_type && ['workshop', 'course', 'tour', 'workday', 'meetup'].includes(event.event_type);

  // Optional but recommended
  const hasCoordinates = event.latitude && event.longitude;
  const hasPrice = event.price !== undefined;
  const hasMaxAttendees = event.max_attendees && event.max_attendees > 0;
  const hasRegistrationURL = event.registration_url && event.registration_url.length > 0;

  // Calculate score
  let score = 0;
  score += hasTitle ? 20 : 0;
  score += hasDescription ? 20 : 0;
  score += hasDate ? 20 : 0;
  score += hasLocation ? 15 : 0;
  score += hasType ? 15 : 0;
  score += hasCoordinates ? 5 : 0;
  score += hasPrice ? 2.5 : 0;
  score += hasMaxAttendees ? 2.5 : 0;

  // Collect issues
  if (!hasTitle) {
    issues.push('Title missing or too short (min 10 chars)');
  }
  if (!hasDescription) {
    issues.push('Description missing or too short (min 50 chars)');
  } else if (event.description.length < 100) {
    recommendations.push(`Description could be more detailed (currently ${event.description.length} chars, recommend 100+)`);
  }
  if (!hasDate) {
    issues.push('Event date missing or invalid format');
  }
  if (!hasLocation) {
    issues.push('Location name missing');
  }
  if (!hasType) {
    issues.push('Event type missing or invalid');
  }
  if (!hasCoordinates) {
    recommendations.push('Add latitude/longitude coordinates for map display');
  }
  if (!hasRegistrationURL) {
    recommendations.push('Add registration URL if available');
  }

  return {
    type: 'event',
    title: event.title,
    slug: event.slug,
    date: event.event_date,
    location: event.location_name,
    descriptionLength: event.description?.length || 0,
    scores: {
      overallScore: score
    },
    issues,
    recommendations,
    passes: score >= 80
  };
}

/**
 * Verify a single wiki location's compliance
 *
 * @param {Object} location - Location object
 * @param {string} sourceFile - Source SQL file name
 * @returns {Object} Verification results
 */
function verifyLocation(location, sourceFile) {
  const issues = [];
  const recommendations = [];

  // Required fields check
  const hasName = location.name && location.name.length >= 5;
  const hasDescription = location.description && location.description.length >= 100;
  const hasCoordinates = location.latitude && location.longitude;
  const hasType = location.location_type && ['farm', 'garden', 'community', 'education', 'business'].includes(location.location_type);
  const hasAddress = location.address && location.address.length > 0;

  // Optional but recommended
  const hasWebsite = location.website && location.website.length > 0;
  const hasTags = location.tags && location.tags.length > 0;

  // Calculate score
  let score = 0;
  score += hasName ? 20 : 0;
  score += hasDescription ? 30 : 0;
  score += hasCoordinates ? 25 : 0;
  score += hasType ? 15 : 0;
  score += hasAddress ? 10 : 0;

  // Quality bonus
  const descLength = location.description?.length || 0;
  if (descLength >= 200) score += 5;
  if (hasWebsite) score += 2.5;
  if (hasTags) score += 2.5;

  // Collect issues
  if (!hasName) {
    issues.push('Name missing or too short (min 5 chars)');
  }
  if (!hasDescription) {
    issues.push('Description missing or too short (min 100 chars)');
  } else if (descLength < 150) {
    recommendations.push(`Description could be more detailed (currently ${descLength} chars, recommend 150+)`);
  }
  if (!hasCoordinates) {
    issues.push('Latitude/longitude coordinates missing (required for map)');
  }
  if (!hasType) {
    issues.push('Location type missing or invalid');
  }
  if (!hasAddress) {
    issues.push('Address missing');
  }
  if (!hasWebsite) {
    recommendations.push('Add website URL if available');
  }
  if (!hasTags || location.tags.length < 3) {
    recommendations.push('Add at least 3 relevant tags for better discoverability');
  }

  return {
    type: 'location',
    name: location.name,
    slug: location.slug,
    locationType: location.location_type,
    descriptionLength: descLength,
    coordinates: hasCoordinates ? `${location.latitude}, ${location.longitude}` : 'Missing',
    tagCount: location.tags?.length || 0,
    scores: {
      overallScore: score
    },
    issues,
    recommendations,
    passes: score >= 80
  };
}

/**
 * Parse wiki_guides from SQL
 *
 * @param {string} sqlContent - SQL file content
 * @returns {Array} Array of guide objects
 */
function parseWikiGuides(sqlContent) {
  const records = extractRecordsFromSQL(sqlContent, 'wiki_guides');

  return records.map(fields => ({
    title: cleanString(fields[0]),
    slug: cleanString(fields[1]),
    summary: cleanString(fields[2]),
    content: cleanString(fields[3]),
    status: cleanString(fields[4]) || 'draft',
    view_count: parseInt(fields[5]) || 0
  }));
}

/**
 * Parse wiki_events from SQL
 *
 * @param {string} sqlContent - SQL file content
 * @returns {Array} Array of event objects
 */
function parseWikiEvents(sqlContent) {
  const records = extractRecordsFromSQL(sqlContent, 'wiki_events');

  return records.map(fields => ({
    title: cleanString(fields[0]),
    slug: cleanString(fields[1]),
    description: cleanString(fields[2]),
    event_type: cleanString(fields[3]),
    event_date: cleanString(fields[4]),
    start_time: cleanString(fields[5]),
    end_time: cleanString(fields[6]),
    location_name: cleanString(fields[7]),
    location_address: cleanString(fields[8]),
    latitude: fields[9] && fields[9] !== 'NULL' ? parseFloat(fields[9]) : null,
    longitude: fields[10] && fields[10] !== 'NULL' ? parseFloat(fields[10]) : null,
    max_attendees: parseInt(fields[11]) || 0,
    price: parseFloat(fields[12]) || 0,
    price_display: cleanString(fields[13]),
    registration_url: cleanString(fields[14]),
    status: cleanString(fields[15]) || 'draft'
  }));
}

/**
 * Parse wiki_locations from SQL
 *
 * @param {string} sqlContent - SQL file content
 * @returns {Array} Array of location objects
 */
function parseWikiLocations(sqlContent) {
  const records = extractRecordsFromSQL(sqlContent, 'wiki_locations');

  return records.map(fields => ({
    name: cleanString(fields[0]),
    slug: cleanString(fields[1]),
    description: cleanString(fields[2]),
    address: cleanString(fields[3]),
    latitude: fields[4] && fields[4] !== 'NULL' ? parseFloat(fields[4]) : null,
    longitude: fields[5] && fields[5] !== 'NULL' ? parseFloat(fields[5]) : null,
    location_type: cleanString(fields[6]),
    website: cleanString(fields[7]),
    contact_email: cleanString(fields[8]),
    tags: fields[9] ? fields[9].match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || [] : [],
    status: cleanString(fields[10]) || 'draft'
  }));
}

/**
 * Generate comprehensive verification report
 *
 * @param {Object} results - Verification results
 * @param {string} seedFile - Seed file name
 * @returns {string} Report markdown
 */
function generateReport(results, seedFile) {
  const today = new Date().toISOString().split('T')[0];

  let report = `# Comprehensive Seed File Verification Report\n\n`;
  report += `**Seed File:** ${seedFile}\n\n`;
  report += `**Verification Date:** ${today}\n\n`;
  report += `**Verified By:** verify-seed-file.js (automated)\n\n`;
  report += `---\n\n`;

  // Summary statistics
  report += `## Summary\n\n`;

  const stats = {
    guides: { total: results.guides.length, passing: results.guides.filter(r => r.passes).length },
    events: { total: results.events.length, passing: results.events.filter(r => r.passes).length },
    locations: { total: results.locations.length, passing: results.locations.filter(r => r.passes).length }
  };

  report += `| Content Type | Total | Passing (≥80%) | Failing (<80%) |\n`;
  report += `|--------------|-------|----------------|----------------|\n`;
  report += `| Wiki Guides | ${stats.guides.total} | ${stats.guides.passing} ✅ | ${stats.guides.total - stats.guides.passing} ❌ |\n`;
  report += `| Wiki Events | ${stats.events.total} | ${stats.events.passing} ✅ | ${stats.events.total - stats.events.passing} ❌ |\n`;
  report += `| Wiki Locations | ${stats.locations.total} | ${stats.locations.passing} ✅ | ${stats.locations.total - stats.locations.passing} ❌ |\n`;
  report += `| **TOTAL** | **${stats.guides.total + stats.events.total + stats.locations.total}** | **${stats.guides.passing + stats.events.passing + stats.locations.passing}** ✅ | **${(stats.guides.total - stats.guides.passing) + (stats.events.total - stats.events.passing) + (stats.locations.total - stats.locations.passing)}** ❌ |\n\n`;

  const totalPassing = stats.guides.passing + stats.events.passing + stats.locations.passing;
  const totalItems = stats.guides.total + stats.events.total + stats.locations.total;
  const passPercentage = totalItems > 0 ? ((totalPassing / totalItems) * 100).toFixed(1) : 0;

  report += `**Overall Compliance: ${passPercentage}%**\n\n`;
  report += `---\n\n`;

  // Wiki Guides Section
  if (results.guides.length > 0) {
    report += `## Wiki Guides (${results.guides.length})\n\n`;

    results.guides.forEach((result, index) => {
      const status = result.passes ? '✅ PASS' : '❌ FAIL';
      report += `### ${index + 1}. ${result.title} ${status}\n\n`;
      report += `- **Slug:** ${result.slug}\n`;
      report += `- **Overall Score:** ${result.scores.overallScore.toFixed(1)}%\n`;
      report += `- **Word Count:** ${result.wordCount} words (${result.scores.wordCountScore.toFixed(1)}%)\n`;
      report += `- **Summary:** ${result.summaryLength} chars (${result.scores.summaryScore}%)\n\n`;

      if (result.issues.length > 0) {
        report += `**Issues:**\n`;
        result.issues.forEach(issue => report += `- ❌ ${issue}\n`);
        report += `\n`;
      }

      if (result.recommendations.length > 0) {
        report += `**Recommendations:**\n`;
        result.recommendations.forEach(rec => report += `- 💡 ${rec}\n`);
        report += `\n`;
      }

      report += `---\n\n`;
    });
  }

  // Wiki Events Section
  if (results.events.length > 0) {
    report += `## Wiki Events (${results.events.length})\n\n`;

    results.events.forEach((result, index) => {
      const status = result.passes ? '✅ PASS' : '❌ FAIL';
      report += `### ${index + 1}. ${result.title} ${status}\n\n`;
      report += `- **Slug:** ${result.slug}\n`;
      report += `- **Date:** ${result.date}\n`;
      report += `- **Location:** ${result.location}\n`;
      report += `- **Overall Score:** ${result.scores.overallScore.toFixed(1)}%\n`;
      report += `- **Description:** ${result.descriptionLength} chars\n\n`;

      if (result.issues.length > 0) {
        report += `**Issues:**\n`;
        result.issues.forEach(issue => report += `- ❌ ${issue}\n`);
        report += `\n`;
      }

      if (result.recommendations.length > 0) {
        report += `**Recommendations:**\n`;
        result.recommendations.forEach(rec => report += `- 💡 ${rec}\n`);
        report += `\n`;
      }

      report += `---\n\n`;
    });
  }

  // Wiki Locations Section
  if (results.locations.length > 0) {
    report += `## Wiki Locations (${results.locations.length})\n\n`;

    results.locations.forEach((result, index) => {
      const status = result.passes ? '✅ PASS' : '❌ FAIL';
      report += `### ${index + 1}. ${result.name} ${status}\n\n`;
      report += `- **Slug:** ${result.slug}\n`;
      report += `- **Type:** ${result.locationType}\n`;
      report += `- **Coordinates:** ${result.coordinates}\n`;
      report += `- **Overall Score:** ${result.scores.overallScore.toFixed(1)}%\n`;
      report += `- **Description:** ${result.descriptionLength} chars\n`;
      report += `- **Tags:** ${result.tagCount}\n\n`;

      if (result.issues.length > 0) {
        report += `**Issues:**\n`;
        result.issues.forEach(issue => report += `- ❌ ${issue}\n`);
        report += `\n`;
      }

      if (result.recommendations.length > 0) {
        report += `**Recommendations:**\n`;
        result.recommendations.forEach(rec => report += `- 💡 ${rec}\n`);
        report += `\n`;
      }

      report += `---\n\n`;
    });
  }

  // Final Status
  report += `## Final Status\n\n`;

  if (totalPassing === totalItems && totalItems > 0) {
    report += `✅ **ALL ITEMS PASSED VERIFICATION!**\n\n`;
    report += `This seed file is ready to be migrated to the database.\n\n`;
  } else {
    const failingCount = totalItems - totalPassing;
    report += `⚠️ **${failingCount} item(s) need fixes before migration.**\n\n`;
    report += `Please address the issues and recommendations listed above.\n\n`;
  }

  return report;
}

/**
 * Verify SQL seed file
 *
 * @param {string} seedFilePath - Path to seed file
 */
function verifySeedFile(seedFilePath) {
  console.log(`\n🔍 Verifying seed file: ${seedFilePath}\n`);
  console.log('='.repeat(60));

  if (!fs.existsSync(seedFilePath)) {
    console.error(`❌ Seed file not found: ${seedFilePath}`);
    process.exit(1);
  }

  // Read SQL file
  const sqlContent = fs.readFileSync(seedFilePath, 'utf8');
  console.log(`✅ Read seed file (${sqlContent.length} characters)\n`);

  // Parse all content types
  console.log('📊 Parsing content...\n');
  const guides = parseWikiGuides(sqlContent);
  const events = parseWikiEvents(sqlContent);
  const locations = parseWikiLocations(sqlContent);

  console.log(`  - Found ${guides.length} wiki guides`);
  console.log(`  - Found ${events.length} wiki events`);
  console.log(`  - Found ${locations.length} wiki locations\n`);

  if (guides.length === 0 && events.length === 0 && locations.length === 0) {
    console.log('⚠️  No content found in this seed file');
    return;
  }

  // Verify all content
  console.log('🔎 Verifying content quality...\n');

  const results = {
    guides: guides.map(guide => verifyGuide(guide, path.basename(seedFilePath))),
    events: events.map(event => verifyEvent(event, path.basename(seedFilePath))),
    locations: locations.map(location => verifyLocation(location, path.basename(seedFilePath)))
  };

  // Generate report
  const report = generateReport(results, path.basename(seedFilePath));

  // Save report
  const today = new Date().toISOString().split('T')[0];
  const reportDir = path.join(__dirname, '..', 'docs', 'verification', today);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const seedFileName = path.basename(seedFilePath, '.sql');
  const reportPath = path.join(reportDir, `${seedFileName}-verification.md`);
  fs.writeFileSync(reportPath, report, 'utf8');

  console.log(`📝 Report saved: ${reportPath}\n`);
  console.log('='.repeat(60));

  // Print summary
  const passingGuides = results.guides.filter(r => r.passes).length;
  const passingEvents = results.events.filter(r => r.passes).length;
  const passingLocations = results.locations.filter(r => r.passes).length;

  const totalPassing = passingGuides + passingEvents + passingLocations;
  const totalItems = guides.length + events.length + locations.length;

  console.log(`\n✅ Passing: ${totalPassing}/${totalItems}`);
  console.log(`❌ Failing: ${totalItems - totalPassing}/${totalItems}\n`);

  if (totalPassing < totalItems) {
    console.log('⚠️  Seed file needs fixes before migration!');
    console.log(`See report for details: ${reportPath}\n`);
    process.exit(1);
  } else {
    console.log('✅ Seed file ready for migration!\n');
  }
}

// CLI interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n📘 Comprehensive Seed File Verification Tool\n');
  console.log('Verifies wiki guides, events, and locations in SQL seed files\n');
  console.log('Usage:');
  console.log('  node scripts/verify-seed-file.js <path-to-seed-file.sql>\n');
  console.log('Examples:');
  console.log('  node scripts/verify-seed-file.js supabase/to-be-seeded/seed_madeira_czech.sql');
  console.log('  node scripts/verify-seed-file.js supabase/to-be-seeded/004_real_verified_wiki_content.sql');
  console.log('  node scripts/verify-seed-file.js supabase/to-be-seeded/004_future_events_seed.sql\n');
  process.exit(0);
}

const seedFilePath = path.resolve(args[0]);
verifySeedFile(seedFilePath);
