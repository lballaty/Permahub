#!/usr/bin/env node
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/check-database-vs-seeds.js
 * Description: Compare existing database content with seed files to identify duplicates before seeding
 * Author: Claude (AI Assistant)
 * Created: 2025-11-15
 *
 * Purpose: Dump current database content and compare with seed files
 * Usage: node scripts/check-database-vs-seeds.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Seed files to check against
const SEED_FILES = [
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seed_madeira_czech.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/004_real_verified_wiki_content.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/003_wiki_real_data_LOCATIONS_ONLY.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/004_future_events_seed.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/003_expanded_wiki_categories.sql',
  '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/006_comprehensive_global_seed_data.sql'
];

async function main() {
  console.log('🔍 Comparing Database Content with Seed Files\n');
  console.log('='.repeat(80) + '\n');

  // Step 1: Dump existing database content
  console.log('📊 Step 1: Fetching current database content...\n');

  const { data: dbGuides, error: guidesError } = await supabase
    .from('wiki_guides')
    .select('id, title, slug, summary, content, status, created_at')
    .order('created_at', { ascending: false });

  const { data: dbEvents, error: eventsError } = await supabase
    .from('wiki_events')
    .select('id, title, slug, description, event_date, location_name, status, created_at')
    .order('created_at', { ascending: false });

  const { data: dbLocations, error: locationsError } = await supabase
    .from('wiki_locations')
    .select('id, name, slug, description, address, latitude, longitude, status, created_at')
    .order('created_at', { ascending: false });

  if (guidesError || eventsError || locationsError) {
    console.error('❌ Error fetching database content:', guidesError || eventsError || locationsError);
    process.exit(1);
  }

  console.log('Current Database Content:');
  console.log(`   Guides:    ${dbGuides.length}`);
  console.log(`   Events:    ${dbEvents.length}`);
  console.log(`   Locations: ${dbLocations.length}`);
  console.log(`   Total:     ${dbGuides.length + dbEvents.length + dbLocations.length}\n`);

  // Step 2: Parse seed files
  console.log('📄 Step 2: Parsing seed files...\n');

  const seedGuides = [];
  const seedEvents = [];
  const seedLocations = [];

  for (const filePath of SEED_FILES) {
    if (!fs.existsSync(filePath)) continue;

    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    // Simple parsing - extract slugs from INSERT statements
    const guideSlugs = extractSlugs(content, 'wiki_guides');
    const eventSlugs = extractSlugs(content, 'wiki_events');
    const locationSlugs = extractSlugs(content, 'wiki_locations');

    guideSlugs.forEach(slug => seedGuides.push({ slug, source: fileName }));
    eventSlugs.forEach(slug => seedEvents.push({ slug, source: fileName }));
    locationSlugs.forEach(slug => seedLocations.push({ slug, source: fileName }));
  }

  console.log('Seed Files Content:');
  console.log(`   Guides:    ${seedGuides.length}`);
  console.log(`   Events:    ${seedEvents.length}`);
  console.log(`   Locations: ${seedLocations.length}`);
  console.log(`   Total:     ${seedGuides.length + seedEvents.length + seedLocations.length}\n`);

  // Step 3: Compare and find duplicates
  console.log('='.repeat(80));
  console.log('\n🔎 Step 3: Checking for Duplicates\n');

  const duplicateGuides = findDuplicates(dbGuides, seedGuides, 'guide');
  const duplicateEvents = findDuplicates(dbEvents, seedEvents, 'event');
  const duplicateLocations = findDuplicates(dbLocations, seedLocations, 'location');

  // Report duplicates
  reportDuplicates('GUIDES', duplicateGuides);
  reportDuplicates('EVENTS', duplicateEvents);
  reportDuplicates('LOCATIONS', duplicateLocations);

  // Step 4: Identify new content
  console.log('='.repeat(80));
  console.log('\n📥 Step 4: New Content to be Added\n');

  const newGuides = findNewContent(dbGuides, seedGuides);
  const newEvents = findNewContent(dbEvents, seedEvents);
  const newLocations = findNewContent(dbLocations, seedLocations);

  console.log(`New Guides to Add:    ${newGuides.length}`);
  console.log(`New Events to Add:    ${newEvents.length}`);
  console.log(`New Locations to Add: ${newLocations.length}`);
  console.log(`Total New Items:      ${newGuides.length + newEvents.length + newLocations.length}\n`);

  if (newGuides.length > 0) {
    console.log('Sample New Guides:');
    newGuides.slice(0, 5).forEach(g => {
      console.log(`   - ${g.slug} (from ${g.source})`);
    });
    if (newGuides.length > 5) console.log(`   ... and ${newGuides.length - 5} more`);
    console.log('');
  }

  // Step 5: Summary and recommendations
  console.log('='.repeat(80));
  console.log('\n📋 SUMMARY\n');

  const totalDuplicates = duplicateGuides.length + duplicateEvents.length + duplicateLocations.length;
  const totalNew = newGuides.length + newEvents.length + newLocations.length;

  console.log(`Database has:     ${dbGuides.length + dbEvents.length + dbLocations.length} items`);
  console.log(`Seed files have:  ${seedGuides.length + seedEvents.length + seedLocations.length} items`);
  console.log(`Duplicates found: ${totalDuplicates} items`);
  console.log(`New to add:       ${totalNew} items\n`);

  if (totalDuplicates > 0) {
    console.log('⚠️  WARNING: Duplicates Detected!\n');
    console.log('Recommendations:');
    console.log('   1. Review duplicate slugs above');
    console.log('   2. Either:');
    console.log('      a) Remove duplicates from seed files before running them, OR');
    console.log('      b) Use ON CONFLICT (slug) DO NOTHING in seed files, OR');
    console.log('      c) Clear database tables first (if rebuilding from scratch)\n');
  } else {
    console.log('✅ No duplicates found! Safe to run seed files.\n');
  }

  if (totalNew === 0) {
    console.log('ℹ️  All seed file content already exists in database.');
    console.log('   No new items will be added.\n');
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    database: {
      guides: dbGuides.length,
      events: dbEvents.length,
      locations: dbLocations.length,
      total: dbGuides.length + dbEvents.length + dbLocations.length
    },
    seedFiles: {
      guides: seedGuides.length,
      events: seedEvents.length,
      locations: seedLocations.length,
      total: seedGuides.length + seedEvents.length + seedLocations.length
    },
    duplicates: {
      guides: duplicateGuides,
      events: duplicateEvents,
      locations: duplicateLocations,
      total: totalDuplicates
    },
    newContent: {
      guides: newGuides.length,
      events: newEvents.length,
      locations: newLocations.length,
      total: totalNew
    }
  };

  const reportPath = '/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/DATABASE_SEED_COMPARISON.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Full report saved to: DATABASE_SEED_COMPARISON.json\n`);

  console.log('='.repeat(80));
}

function extractSlugs(content, tableName) {
  const slugs = [];
  const regex = new RegExp(`INSERT INTO ${tableName}[\\s\\S]*?VALUES[\\s\\S]*?'([^']+)'[\\s\\S]*?'([^']+)'`, 'g');

  let match;
  while ((match = regex.exec(content)) !== null) {
    // Second captured group is typically the slug
    if (match[2]) {
      slugs.push(match[2]);
    }
  }

  return slugs;
}

function findDuplicates(dbItems, seedItems, type) {
  const duplicates = [];
  const dbSlugs = new Set(dbItems.map(item => item.slug));

  seedItems.forEach(seedItem => {
    if (dbSlugs.has(seedItem.slug)) {
      const dbItem = dbItems.find(db => db.slug === seedItem.slug);
      duplicates.push({
        slug: seedItem.slug,
        source: seedItem.source,
        dbCreatedAt: dbItem.created_at,
        dbTitle: dbItem.title || dbItem.name
      });
    }
  });

  return duplicates;
}

function findNewContent(dbItems, seedItems) {
  const dbSlugs = new Set(dbItems.map(item => item.slug));
  return seedItems.filter(seed => !dbSlugs.has(seed.slug));
}

function reportDuplicates(label, duplicates) {
  if (duplicates.length === 0) {
    console.log(`✅ ${label}: No duplicates\n`);
    return;
  }

  console.log(`⚠️  ${label}: ${duplicates.length} duplicates found\n`);
  duplicates.slice(0, 10).forEach(dup => {
    console.log(`   Slug: ${dup.slug}`);
    console.log(`      Database: "${dup.dbTitle}" (created ${new Date(dup.dbCreatedAt).toLocaleDateString()})`);
    console.log(`      Seed file: ${dup.source}`);
    console.log('');
  });

  if (duplicates.length > 10) {
    console.log(`   ... and ${duplicates.length - 10} more duplicates\n`);
  }
}

// Run
main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
