/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/verify-guide.js
 * Description: Automated wiki guide verification tool following WIKI_GUIDE_VERIFICATION_PROCESS.md
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-15
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
 * Calculate line count from text content
 *
 * @param {string} text - Text content to count lines in
 * @returns {number} Line count
 */
function calculateLineCount(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

/**
 * Fetch guide metadata from database
 *
 * @param {string} slug - Guide slug
 * @returns {Promise<Object>} Guide metadata
 */
async function fetchGuideMetadata(slug) {
  console.log(`\n📊 Fetching metadata for guide: ${slug}`);

  const { data, error } = await supabase
    .from('wiki_guides')
    .select('id, title, slug, summary, content, created_at, updated_at')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(`Failed to fetch guide: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Guide not found: ${slug}`);
  }

  // Calculate metrics
  const metadata = {
    ...data,
    summary_length: data.summary?.length || 0,
    content_length: data.content?.length || 0,
    word_count: calculateWordCount(data.content),
    line_count: calculateLineCount(data.content)
  };

  console.log(`✅ Guide found: "${metadata.title}"`);
  console.log(`   Word count: ${metadata.word_count} words`);
  console.log(`   Summary length: ${metadata.summary_length} characters`);

  return metadata;
}

/**
 * Fetch guide categories from database
 *
 * @param {string} guideId - Guide UUID
 * @returns {Promise<Array>} Array of category names
 */
async function fetchGuideCategories(guideId) {
  console.log(`\n🏷️  Fetching categories...`);

  const { data, error } = await supabase
    .from('wiki_guide_categories')
    .select(`
      wiki_categories (
        name,
        slug
      )
    `)
    .eq('guide_id', guideId);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories = data.map(item => item.wiki_categories.name);
  console.log(`✅ Categories: ${categories.join(', ')}`);

  return categories;
}

/**
 * Check if SQL seed file exists for guide
 *
 * @param {string} slug - Guide slug
 * @returns {Object} Seed file status
 */
function checkSeedFile(slug) {
  const seedFilePath = path.join(__dirname, '..', 'database', 'seeds', 'wiki-guides', `${slug}.sql`);
  const exists = fs.existsSync(seedFilePath);

  console.log(`\n📄 Checking seed file...`);
  if (exists) {
    console.log(`✅ Seed file exists: ${seedFilePath}`);
    return { exists: true, path: seedFilePath };
  } else {
    console.log(`❌ Seed file not found: ${seedFilePath}`);
    return { exists: false, path: seedFilePath };
  }
}

/**
 * Calculate compliance scores
 *
 * @param {Object} metadata - Guide metadata
 * @param {Array} categories - Guide categories
 * @param {Object} seedFile - Seed file status
 * @returns {Object} Compliance scores
 */
function calculateScores(metadata, categories, seedFile) {
  console.log(`\n📈 Calculating compliance scores...`);

  // Word count score (need 1,000+)
  const wordCountScore = Math.min(100, (metadata.word_count / 1000) * 100);

  // Summary score (100-150 chars is ideal)
  let summaryScore = 0;
  if (metadata.summary_length >= 100 && metadata.summary_length <= 150) {
    summaryScore = 100;
  } else if (metadata.summary_length > 0) {
    summaryScore = 50;
  }

  // Category score (at least 1 category)
  const categoryScore = categories.length > 0 ? 100 : 0;

  // SQL seed file score
  const sqlScore = seedFile.exists ? 100 : 0;

  // Placeholders for scores that require external verification
  // (These would be filled in by manual verification or AI agent)
  const accuracyScore = null;  // Requires Wikipedia/source checking
  const citationScore = null;  // Requires checking Resources section
  const alignmentScore = null; // Requires content analysis
  const structureScore = null; // Requires section checking
  const relevanceScore = null; // Requires permaculture analysis

  console.log(`   Word Count Score: ${wordCountScore.toFixed(1)}%`);
  console.log(`   Summary Score: ${summaryScore}%`);
  console.log(`   Category Score: ${categoryScore}%`);
  console.log(`   SQL Seed File Score: ${sqlScore}%`);

  return {
    wordCountScore,
    summaryScore,
    categoryScore,
    sqlScore,
    accuracyScore,
    citationScore,
    alignmentScore,
    structureScore,
    relevanceScore
  };
}

/**
 * Generate verification report text
 *
 * @param {Object} metadata - Guide metadata
 * @param {Array} categories - Guide categories
 * @param {Object} scores - Compliance scores
 * @param {Object} seedFile - Seed file status
 * @returns {string} Report markdown content
 */
function generateReport(metadata, categories, scores, seedFile) {
  const today = new Date().toISOString().split('T')[0];

  let report = `# Wiki Guide Verification Report (Automated)\n\n`;
  report += `**Guide Title:** ${metadata.title}\n\n`;
  report += `**Guide Slug:** ${metadata.slug}\n\n`;
  report += `**Verification Date:** ${today}\n\n`;
  report += `**Verified By:** Automated Script (verify-guide.js)\n\n`;
  report += `**Note:** This is an automated partial verification. Manual verification is required for:\n`;
  report += `- Factual accuracy checking (Wikipedia/source verification)\n`;
  report += `- Citation quality assessment\n`;
  report += `- Title/Summary/Content alignment\n`;
  report += `- Content structure compliance\n`;
  report += `- Permaculture relevance assessment\n\n`;
  report += `---\n\n`;

  report += `## 1. Basic Metadata\n\n`;
  report += `- **Title:** ${metadata.title}\n`;
  report += `- **Summary Length:** ${metadata.summary_length} characters\n`;
  report += `- **Content Length:** ${metadata.content_length} characters\n`;
  report += `- **Word Count:** ${metadata.word_count} words\n`;
  report += `- **Line Count:** ${metadata.line_count} lines\n`;
  report += `- **Created:** ${metadata.created_at}\n`;
  report += `- **Updated:** ${metadata.updated_at}\n\n`;

  report += `**Compliance:**\n`;
  report += `- ${metadata.title ? '✅' : '❌'} Title present\n`;
  report += `- ${metadata.summary_length >= 100 && metadata.summary_length <= 150 ? '✅' : '❌'} Summary length (${metadata.summary_length}/100-150 chars)\n`;
  report += `- ${metadata.word_count >= 1000 ? '✅' : '❌'} Word count minimum (${metadata.word_count}/1,000 words = ${(metadata.word_count/1000*100).toFixed(1)}%)\n\n`;

  report += `---\n\n`;

  report += `## 2. Category Assignment\n\n`;
  report += `- **Categories:** ${categories.join(', ') || 'None'}\n`;
  report += `- **Category Count:** ${categories.length}\n\n`;
  report += `**Compliance:**\n`;
  report += `- ${categories.length > 0 ? '✅' : '❌'} Categories assigned\n`;
  report += `- ${categories.length >= 2 ? '✅' : '⚠️'} Multiple categories (${categories.length} categories)\n\n`;

  report += `---\n\n`;

  report += `## 3. SQL Seed File\n\n`;
  report += `- **Expected Location:** ${seedFile.path}\n`;
  report += `- **Exists:** ${seedFile.exists ? 'YES ✅' : 'NO ❌'}\n\n`;

  report += `---\n\n`;

  report += `## 4. Automated Compliance Scores\n\n`;
  report += `**Note:** Only automated checks are shown below. Manual verification required for complete scoring.\n\n`;
  report += `- **Word Count Score:** ${scores.wordCountScore.toFixed(1)}% (${metadata.word_count}/1,000 words)\n`;
  report += `- **Summary Score:** ${scores.summaryScore}% (${metadata.summary_length} chars)\n`;
  report += `- **Category Score:** ${scores.categoryScore}% (${categories.length} categories)\n`;
  report += `- **SQL Seed File Score:** ${scores.sqlScore}%\n\n`;

  report += `**Requires Manual Verification:**\n`;
  report += `- Factual Accuracy Score (25% weight)\n`;
  report += `- Citation Score (15% weight)\n`;
  report += `- Alignment Score (15% weight)\n`;
  report += `- Structure Score (15% weight)\n`;
  report += `- Relevance Score (10% weight)\n\n`;

  report += `---\n\n`;

  report += `## 5. Summary\n\n`;

  let issues = [];
  if (metadata.word_count < 1000) {
    issues.push(`❌ Word count below minimum: ${metadata.word_count}/1,000 (${(metadata.word_count/1000*100).toFixed(1)}%)`);
  }
  if (metadata.summary_length < 100 || metadata.summary_length > 150) {
    issues.push(`⚠️  Summary length outside ideal range: ${metadata.summary_length}/100-150 chars`);
  }
  if (categories.length === 0) {
    issues.push(`❌ No categories assigned`);
  }
  if (!seedFile.exists) {
    issues.push(`❌ SQL seed file missing`);
  }

  if (issues.length === 0) {
    report += `✅ **All automated checks passed!**\n\n`;
    report += `Next steps: Complete manual verification for accuracy, citations, alignment, structure, and relevance.\n\n`;
  } else {
    report += `**Issues Found:**\n\n`;
    issues.forEach(issue => {
      report += `${issue}\n`;
    });
    report += `\n`;
  }

  report += `---\n\n`;
  report += `## 6. Next Steps\n\n`;
  report += `1. Complete manual verification following: \`/docs/processes/WIKI_GUIDE_VERIFICATION_PROCESS.md\`\n`;
  report += `2. Search Wikipedia for relevant article\n`;
  report += `3. Find 2+ authoritative sources (.edu, .gov)\n`;
  report += `4. Verify factual accuracy of all claims\n`;
  report += `5. Check for Resources & Further Learning section\n`;
  report += `6. Assess permaculture relevance\n`;
  report += `7. Calculate final compliance score\n`;
  report += `8. Generate full report using: \`/docs/templates/GUIDE_VERIFICATION_REPORT_TEMPLATE.md\`\n\n`;

  report += `---\n\n`;
  report += `**Automated Verification Complete**\n\n`;
  report += `**Report Generated:** ${today}\n`;

  return report;
}

/**
 * Save report to file
 *
 * @param {string} slug - Guide slug
 * @param {string} reportContent - Report markdown content
 */
function saveReport(slug, reportContent) {
  const today = new Date().toISOString().split('T')[0];
  const reportDir = path.join(__dirname, '..', 'docs', 'verification', today);

  // Create directory if it doesn't exist
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `${slug}-automated.md`);
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  console.log(`\n📝 Report saved: ${reportPath}`);
}

/**
 * Main verification function
 *
 * @param {string} slug - Guide slug to verify
 */
async function verifyGuide(slug) {
  try {
    console.log(`\n🔍 Starting verification for guide: ${slug}\n`);
    console.log('='.repeat(60));

    // Step 1: Fetch metadata
    const metadata = await fetchGuideMetadata(slug);

    // Step 2: Fetch categories
    const categories = await fetchGuideCategories(metadata.id);

    // Step 3: Check seed file
    const seedFile = checkSeedFile(slug);

    // Step 4: Calculate scores
    const scores = calculateScores(metadata, categories, seedFile);

    // Step 5: Generate report
    const report = generateReport(metadata, categories, scores, seedFile);

    // Step 6: Save report
    saveReport(slug, report);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Automated verification complete!');
    console.log('\n⚠️  IMPORTANT: This is a PARTIAL verification.');
    console.log('   Complete the manual verification steps documented in:');
    console.log('   /docs/processes/WIKI_GUIDE_VERIFICATION_PROCESS.md\n');

  } catch (error) {
    console.error(`\n❌ Verification failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Verify all guides in database
 */
async function verifyAllGuides() {
  try {
    console.log('\n🔍 Fetching all guides from database...\n');

    const { data: guides, error } = await supabase
      .from('wiki_guides')
      .select('slug')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch guides: ${error.message}`);
    }

    console.log(`Found ${guides.length} guides to verify\n`);
    console.log('='.repeat(60));

    for (const guide of guides) {
      await verifyGuide(guide.slug);
      console.log('\n');
    }

    console.log('='.repeat(60));
    console.log(`✅ All ${guides.length} guides verified!`);
    console.log('\n⚠️  IMPORTANT: These are PARTIAL verifications.');
    console.log('   Complete the manual verification steps for each guide.\n');

  } catch (error) {
    console.error(`\n❌ Batch verification failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n📘 Wiki Guide Verification Tool\n');
  console.log('Usage:');
  console.log('  node scripts/verify-guide.js <guide-slug>    Verify a specific guide');
  console.log('  node scripts/verify-guide.js --all           Verify all guides');
  console.log('\nExamples:');
  console.log('  node scripts/verify-guide.js starting-first-backyard-flock');
  console.log('  node scripts/verify-guide.js --all\n');
  process.exit(0);
}

if (args[0] === '--all') {
  verifyAllGuides();
} else {
  verifyGuide(args[0]);
}
