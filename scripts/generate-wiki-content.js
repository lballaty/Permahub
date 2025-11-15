#!/usr/bin/env node

/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/generate-wiki-content.js
 * Description: Helper script for LLM agents (Claude, ChatGPT) to generate wiki content incrementally with duplicate prevention
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 *
 * Usage:
 *   node scripts/generate-wiki-content.js check-slug guides "my-guide-slug"
 *   node scripts/generate-wiki-content.js list-guides soil-science
 *   node scripts/generate-wiki-content.js list-all guides
 *   node scripts/generate-wiki-content.js generate-slug "My Guide Title"
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .substring(0, 100);        // Limit length
}

/**
 * Check if slug exists in specified table
 */
async function checkSlugExists(table, slug) {
  const { data, error } = await supabase
    .from(table)
    .select('id, slug')
    .eq('slug', slug)
    .limit(1);

  if (error) {
    console.error(`Error checking slug:`, error);
    return { exists: null, error };
  }

  return { exists: data.length > 0, data: data[0] || null };
}

/**
 * List all content from a table
 */
async function listAll(table) {
  const { data, error } = await supabase
    .from(table)
    .select('id, slug, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error(`Error listing content:`, error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * List guides by category
 */
async function listGuidesByCategory(categorySlug) {
  // First get category ID
  const { data: category, error: catError } = await supabase
    .from('wiki_categories')
    .select('id, name, slug')
    .eq('slug', categorySlug)
    .single();

  if (catError) {
    console.error(`Error finding category:`, catError);
    return { data: null, error: catError };
  }

  // Then get guides in that category
  const { data: guides, error: guidesError } = await supabase
    .from('wiki_guide_categories')
    .select(`
      guide_id,
      wiki_guides (
        id,
        title,
        slug,
        status,
        created_at
      )
    `)
    .eq('category_id', category.id);

  if (guidesError) {
    console.error(`Error listing guides:`, guidesError);
    return { data: null, error: guidesError };
  }

  return {
    data: {
      category: category.name,
      guides: guides.map(g => g.wiki_guides)
    },
    error: null
  };
}

/**
 * Search for similar titles
 */
async function searchSimilarTitles(table, titleColumn, searchTerm) {
  const { data, error } = await supabase
    .from(table)
    .select('id, slug')
    .ilike(titleColumn, `%${searchTerm}%`)
    .limit(20);

  if (error) {
    console.error(`Error searching:`, error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Full-text search in guide content for topic overlap
 */
async function searchContentByTopics(keywords) {
  const { data, error } = await supabase.rpc('search_guides', {
    search_query: keywords
  });

  if (error) {
    console.error(`Error searching content:`, error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Get content statistics
 */
async function getStats() {
  const stats = {};

  // Count guides
  const { count: guidesCount } = await supabase
    .from('wiki_guides')
    .select('*', { count: 'exact', head: true });
  stats.guides = guidesCount;

  // Count events
  const { count: eventsCount } = await supabase
    .from('wiki_events')
    .select('*', { count: 'exact', head: true });
  stats.events = eventsCount;

  // Count locations
  const { count: locationsCount } = await supabase
    .from('wiki_locations')
    .select('*', { count: 'exact', head: true });
  stats.locations = locationsCount;

  // Count categories
  const { count: categoriesCount } = await supabase
    .from('wiki_categories')
    .select('*', { count: 'exact', head: true });
  stats.categories = categoriesCount;

  return stats;
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

async function handleCheckSlug(args) {
  const [contentType, slug] = args;

  if (!contentType || !slug) {
    console.error('Usage: check-slug <guides|events|locations> <slug>');
    process.exit(1);
  }

  const tableMap = {
    'guides': 'wiki_guides',
    'events': 'wiki_events',
    'locations': 'wiki_locations'
  };

  const table = tableMap[contentType];
  if (!table) {
    console.error(`Invalid content type. Use: guides, events, or locations`);
    process.exit(1);
  }

  console.log(`Checking if slug exists: ${slug}`);
  const { exists, data, error } = await checkSlugExists(table, slug);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  if (exists) {
    console.log(`❌ SLUG EXISTS: ${slug}`);
    console.log(`Existing content:`, data);
    process.exit(1);
  } else {
    console.log(`✅ SLUG AVAILABLE: ${slug}`);
    process.exit(0);
  }
}

async function handleListGuides(args) {
  const [categorySlug] = args;

  if (!categorySlug) {
    console.error('Usage: list-guides <category-slug>');
    process.exit(1);
  }

  console.log(`Listing guides in category: ${categorySlug}`);
  const { data, error } = await listGuidesByCategory(categorySlug);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log(`\nCategory: ${data.category}`);
  console.log(`Guides (${data.guides.length}):\n`);
  data.guides.forEach((guide, i) => {
    console.log(`${i + 1}. ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`   Status: ${guide.status}`);
    console.log(`   Created: ${new Date(guide.created_at).toLocaleDateString()}\n`);
  });
}

async function handleListAll(args) {
  const [contentType] = args;

  if (!contentType) {
    console.error('Usage: list-all <guides|events|locations>');
    process.exit(1);
  }

  const tableMap = {
    'guides': 'wiki_guides',
    'events': 'wiki_events',
    'locations': 'wiki_locations'
  };

  const table = tableMap[contentType];
  if (!table) {
    console.error(`Invalid content type. Use: guides, events, or locations`);
    process.exit(1);
  }

  console.log(`Listing all ${contentType}...`);
  const { data, error } = await listAll(table);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log(`\nTotal: ${data.length}\n`);
  data.forEach((item, i) => {
    console.log(`${i + 1}. Slug: ${item.slug}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   Created: ${new Date(item.created_at).toLocaleDateString()}\n`);
  });
}

async function handleGenerateSlug(args) {
  const title = args.join(' ');

  if (!title) {
    console.error('Usage: generate-slug "Your Title Here"');
    process.exit(1);
  }

  const slug = generateSlug(title);
  console.log(`Title: ${title}`);
  console.log(`Generated slug: ${slug}`);
}

async function handleStats() {
  console.log('Getting content statistics...\n');
  const stats = await getStats();

  console.log('📊 Wiki Content Statistics:\n');
  console.log(`  Guides:     ${stats.guides}`);
  console.log(`  Events:     ${stats.events}`);
  console.log(`  Locations:  ${stats.locations}`);
  console.log(`  Categories: ${stats.categories}`);
  console.log('');
}

async function handleSearch(args) {
  const [contentType, ...searchTerms] = args;
  const searchTerm = searchTerms.join(' ');

  if (!contentType || !searchTerm) {
    console.error('Usage: search <guides|events|locations> <search term>');
    process.exit(1);
  }

  const config = {
    'guides': { table: 'wiki_guides', column: 'title' },
    'events': { table: 'wiki_events', column: 'title' },
    'locations': { table: 'wiki_locations', column: 'name' }
  };

  const { table, column } = config[contentType] || {};
  if (!table) {
    console.error(`Invalid content type. Use: guides, events, or locations`);
    process.exit(1);
  }

  console.log(`Searching ${contentType} for: "${searchTerm}"`);
  const { data, error } = await searchSimilarTitles(table, column, searchTerm);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log(`\nFound ${data.length} results:\n`);
  data.forEach((item, i) => {
    console.log(`${i + 1}. Slug: ${item.slug}`);
    console.log(`   ID: ${item.id}\n`);
  });
}

async function handleSearchContent(args) {
  const keywords = args.join(' ');

  if (!keywords) {
    console.error('Usage: search-content <topic keywords>');
    console.error('Example: search-content composting worms vermicomposting');
    process.exit(1);
  }

  console.log(`Searching guide content for topics: "${keywords}"\n`);
  const { data, error } = await searchContentByTopics(keywords);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  if (data.length === 0) {
    console.log('✅ No existing content found on these topics');
    console.log('   Safe to create new content');
    process.exit(0);
  }

  console.log(`⚠️  Found ${data.length} guides with similar topics:\n`);
  data.forEach((item, i) => {
    console.log(`${i + 1}. ${item.title}`);
    console.log(`   Slug: ${item.slug}`);
    console.log(`   Summary: ${item.summary}`);
    console.log(`   Relevance: ${item.rank.toFixed(4)}`);
    if (item.rank > 0.1) {
      console.log(`   ⚠️  HIGH OVERLAP - Review this guide before creating new content`);
    }
    console.log('');
  });

  console.log('\n💡 Recommendations:');
  console.log('   - Review guides with relevance > 0.1');
  console.log('   - Ensure your content adds unique value');
  console.log('   - Consider updating existing guide instead');
}

async function handleReport() {
  console.log('🔍 Analyzing Database for Duplicates and Overlaps\n');
  console.log('=' .repeat(60));

  // Get all guides
  const { data: guides, error } = await supabase
    .from('wiki_guides')
    .select('id, title, slug, summary, content')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error.message);
    process.exit(1);
  }

  console.log(`\n📊 Total Guides: ${guides.length}\n`);

  // Find duplicate/similar slugs
  const slugCounts = {};
  guides.forEach(g => {
    const base = g.slug.replace(/-\d{4}$/, ''); // Remove year suffix if exists
    slugCounts[base] = (slugCounts[base] || 0) + 1;
  });

  const duplicateSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);

  if (duplicateSlugs.length > 0) {
    console.log('⚠️  POTENTIAL SLUG DUPLICATES:\n');
    duplicateSlugs.forEach(([baseSlug, count]) => {
      console.log(`   ${baseSlug}: ${count} similar slugs`);
      const similar = guides.filter(g => g.slug.includes(baseSlug));
      similar.forEach(s => console.log(`     - ${s.slug} (${s.title})`));
      console.log('');
    });
  } else {
    console.log('✅ No duplicate slugs found\n');
  }

  // Find content overlaps by comparing all guides
  console.log('🔍 Checking for Content Overlaps...\n');

  const overlaps = [];

  for (let i = 0; i < guides.length; i++) {
    for (let j = i + 1; j < guides.length; j++) {
      const guide1 = guides[i];
      const guide2 = guides[j];

      // Extract key words from both guides (simple approach)
      const words1 = new Set(
        guide1.content
          .toLowerCase()
          .split(/\W+/)
          .filter(w => w.length > 4) // Words longer than 4 chars
      );

      const words2 = new Set(
        guide2.content
          .toLowerCase()
          .split(/\W+/)
          .filter(w => w.length > 4)
      );

      // Calculate Jaccard similarity
      const intersection = new Set([...words1].filter(w => words2.has(w)));
      const union = new Set([...words1, ...words2]);
      const similarity = intersection.size / union.size;

      // Check word count similarity
      const wordCount1 = guide1.content.split(/\s+/).length;
      const wordCount2 = guide2.content.split(/\s+/).length;
      const wordCountRatio = Math.min(wordCount1, wordCount2) / Math.max(wordCount1, wordCount2);

      if (similarity > 0.3 || (similarity > 0.2 && wordCountRatio > 0.8)) {
        overlaps.push({
          guide1,
          guide2,
          similarity: (similarity * 100).toFixed(1),
          wordCountRatio: (wordCountRatio * 100).toFixed(1),
          wordCount1,
          wordCount2
        });
      }
    }
  }

  if (overlaps.length > 0) {
    console.log(`⚠️  FOUND ${overlaps.length} POTENTIAL CONTENT OVERLAPS:\n`);

    overlaps.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

    overlaps.forEach((overlap, idx) => {
      console.log(`${idx + 1}. Similarity: ${overlap.similarity}% | Word Count Match: ${overlap.wordCountRatio}%`);
      console.log(`   Guide 1: "${overlap.guide1.title}"`);
      console.log(`            Slug: ${overlap.guide1.slug}`);
      console.log(`            Words: ${overlap.wordCount1}`);
      console.log(`   Guide 2: "${overlap.guide2.title}"`);
      console.log(`            Slug: ${overlap.guide2.slug}`);
      console.log(`            Words: ${overlap.wordCount2}`);

      if (parseFloat(overlap.similarity) > 50) {
        console.log(`   🚨 CRITICAL: Very high overlap - likely duplicate content!`);
      } else if (parseFloat(overlap.similarity) > 40) {
        console.log(`   ⚠️  WARNING: High overlap - review for consolidation`);
      } else {
        console.log(`   💡 INFO: Moderate overlap - similar topics`);
      }
      console.log('');
    });
  } else {
    console.log('✅ No significant content overlaps found\n');
  }

  // Summary
  console.log('=' .repeat(60));
  console.log('\n📋 SUMMARY:\n');
  console.log(`   Total Guides: ${guides.length}`);
  console.log(`   Slug Duplicates: ${duplicateSlugs.length}`);
  console.log(`   Content Overlaps: ${overlaps.length}`);

  if (overlaps.length > 0) {
    const critical = overlaps.filter(o => parseFloat(o.similarity) > 50);
    const warning = overlaps.filter(o => parseFloat(o.similarity) > 40 && parseFloat(o.similarity) <= 50);
    const info = overlaps.filter(o => parseFloat(o.similarity) <= 40);

    console.log(`     - Critical (>50%): ${critical.length}`);
    console.log(`     - Warning (>40%): ${warning.length}`);
    console.log(`     - Info (>30%): ${info.length}`);
  }

  console.log('\n💡 RECOMMENDATIONS:\n');
  if (overlaps.length === 0 && duplicateSlugs.length === 0) {
    console.log('   ✅ Database looks clean! No action needed.\n');
  } else {
    if (duplicateSlugs.length > 0) {
      console.log('   - Review slug duplicates for consolidation');
    }
    if (overlaps.length > 0) {
      console.log('   - Review high-overlap guides (>40%)');
      console.log('   - Consider merging duplicate content');
      console.log('   - Ensure each guide provides unique value');
    }
    console.log('');
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    console.log(`
Wiki Content Generation Helper
==============================

Usage: node scripts/generate-wiki-content.js <command> [args]

Commands:
  report                       Analyze database for duplicates (DEFAULT - run first!)
  check-slug <type> <slug>     Check if slug is available
  search-content <keywords>    Search guide content for topic overlap (IMPORTANT!)
  list-guides <category-slug>  List all guides in category
  list-all <type>              List all content of type
  generate-slug "title"        Generate slug from title
  search <type> <term>         Search titles for similar content
  stats                        Show content statistics

Content types: guides, events, locations

Examples:
  # FIRST: Check database for duplicates and overlaps
  node scripts/generate-wiki-content.js report

  # BEFORE creating new content - check for topic overlap:
  node scripts/generate-wiki-content.js search-content "composting worms vermicomposting"

  # Check slug availability:
  node scripts/generate-wiki-content.js check-slug guides "my-new-guide"

  # Other useful commands:
  node scripts/generate-wiki-content.js list-guides soil-science
  node scripts/generate-wiki-content.js list-all guides
  node scripts/generate-wiki-content.js generate-slug "Understanding Composting"
  node scripts/generate-wiki-content.js search guides "compost"
  node scripts/generate-wiki-content.js stats

IMPORTANT: Run 'report' to analyze existing content, then 'search-content' before creating!
`);
    process.exit(0);
  }

  const commands = {
    'report': handleReport,
    'check-slug': handleCheckSlug,
    'search-content': handleSearchContent,
    'list-guides': handleListGuides,
    'list-all': handleListAll,
    'generate-slug': handleGenerateSlug,
    'search': handleSearch,
    'stats': handleStats
  };

  const handler = commands[command];
  if (!handler) {
    console.error(`Unknown command: ${command}`);
    console.error('Run without arguments to see usage');
    process.exit(1);
  }

  await handler(args);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
