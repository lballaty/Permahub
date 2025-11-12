#!/usr/bin/env node

/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/execute-all-migrations.mjs
 * Description: Comprehensive database migration executor for Permahub Supabase integration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-12
 *
 * This script:
 * 1. Creates bootstrap RPC function (execute_sql) in database
 * 2. Executes all migrations in proper order using that function
 * 3. Falls back to manual instructions if needed
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SUPABASE_URL = 'https://mcbxbaggjaxqfdvmrqsc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMTg0NiwiZXhwIjoyMDc4MDc3ODQ2fQ.dTRFNjBrZHsLERsjzqSckpJ1oaQcCjIw98_UvgKyQJU';

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Define migrations in execution order
const migrations = [
  {
    file: 'database/migrations/00_bootstrap_execute_sql.sql',
    name: 'Bootstrap: Execute SQL RPC Function',
    critical: true,
    order: 0
  },
  {
    file: 'database/migrations/001_initial_schema.sql',
    name: 'Phase 1: Initial Schema (users, projects, resources)',
    critical: true,
    order: 1
  },
  {
    file: 'database/migrations/002_analytics.sql',
    name: 'Phase 2: Analytics (activity tracking)',
    critical: true,
    order: 2
  },
  {
    file: 'database/migrations/003_items_pubsub.sql',
    name: 'Phase 3: Pub/Sub (notifications)',
    critical: true,
    order: 3
  },
  {
    file: 'database/migrations/004_wiki_schema.sql',
    name: 'Phase 4: Wiki System',
    critical: false,
    order: 4
  },
  {
    file: 'database/migrations/20251107_eco_themes.sql',
    name: 'Feature: Eco Themes',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_theme_associations.sql',
    name: 'Feature: Theme Associations',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_landing_page_analytics.sql',
    name: 'Feature: Landing Page Analytics',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_learning_resources.sql',
    name: 'Feature: Learning Resources',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_events.sql',
    name: 'Feature: Events',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_discussions.sql',
    name: 'Feature: Discussions',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_discussion_comments.sql',
    name: 'Feature: Discussion Comments',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_reviews.sql',
    name: 'Feature: Reviews',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/20251107_event_registrations.sql',
    name: 'Feature: Event Registrations',
    critical: false,
    order: 5
  },
  {
    file: 'database/migrations/005_wiki_multilingual_content.sql',
    name: 'Phase 5: Wiki Multilingual Content',
    critical: false,
    order: 6
  },
  {
    file: 'database/migrations/20251112_wiki_content_tables.sql',
    name: 'Wiki: Content Tables',
    critical: false,
    order: 6
  }
];

/**
 * Execute a single SQL statement via RPC
 */
async function executeSql(sqlStatement, description) {
  try {
    console.log(`  → Executing: ${description}`);

    const { data, error } = await supabase.rpc('execute_sql', {
      query: sqlStatement
    });

    if (error) {
      console.error(`    ❌ RPC Error: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log(`    ✓ Success`);
    return { success: true, data };

  } catch (err) {
    console.error(`    ❌ Exception: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Execute a migration file
 */
async function executeMigration(filePath, migrationName) {
  try {
    console.log(`\n📋 ${migrationName}`);
    console.log(`📂 File: ${path.basename(filePath)}`);

    // Check if file exists
    const absolutePath = path.join(__dirname, filePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`  ❌ File not found: ${absolutePath}`);
      return { success: false, error: 'File not found' };
    }

    // Read SQL file
    const sql = fs.readFileSync(absolutePath, 'utf-8');
    console.log(`  ✓ SQL read (${sql.length} characters)`);

    // Split into statements (remove comments and empty lines)
    const statements = sql
      .split(';')
      .map(stmt => {
        // Remove SQL comments
        return stmt
          .split('\n')
          .filter(line => !line.trim().startsWith('--'))
          .join('\n')
          .trim();
      })
      .filter(stmt => stmt.length > 0);

    console.log(`  ✓ Found ${statements.length} SQL statements`);

    // Execute each statement
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';';
      const result = await executeSql(stmt, `Statement ${i + 1}/${statements.length}`);

      if (result.success) {
        successCount++;
      } else {
        failureCount++;
        // Don't stop on failures - continue with next statements
        // Some statements might fail due to IF NOT EXISTS clauses
      }
    }

    console.log(`  📊 Results: ${successCount} succeeded, ${failureCount} failed`);

    return {
      success: failureCount === 0,
      successCount,
      failureCount
    };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function runAllMigrations() {
  console.log('═'.repeat(80));
  console.log('PERMAHUB: COMPREHENSIVE DATABASE MIGRATION EXECUTOR');
  console.log('═'.repeat(80));
  console.log(`\n🔗 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using Service Role Key (admin access)\n`);

  // Sort migrations by order
  const sortedMigrations = [...migrations].sort((a, b) => a.order - b.order);

  let totalSuccess = 0;
  let totalFail = 0;
  const results = [];

  // Execute each migration
  for (const migration of sortedMigrations) {
    const result = await executeMigration(migration.file, migration.name);
    results.push({
      name: migration.name,
      file: migration.file,
      ...result
    });

    if (result.success) {
      totalSuccess++;
    } else {
      totalFail++;
      if (migration.critical) {
        console.error(`\n⚠️  CRITICAL MIGRATION FAILED: ${migration.name}`);
        console.error(`This migration is required. Stopping execution.`);
        break;
      }
    }

    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n' + '═'.repeat(80));
  console.log('MIGRATION SUMMARY');
  console.log('═'.repeat(80));

  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    const details = r.successCount
      ? ` (${r.successCount}/${r.successCount + r.failureCount})`
      : '';
    console.log(`${status} ${r.name}${details}`);
  });

  console.log('\n' + '═'.repeat(80));
  console.log(`✓ COMPLETED: ${totalSuccess}/${sortedMigrations.length} migrations executed`);
  console.log('═'.repeat(80));

  if (totalFail > 0) {
    console.log(`\n⚠️  ${totalFail} migration(s) failed. Check output above for details.`);
    console.log('Some failures may be expected (IF NOT EXISTS clauses, already created tables).\n');
  }

  console.log('\nNext steps:');
  console.log('1. Verify tables in Supabase console (Tables section)');
  console.log('2. Check RLS policies are enabled');
  console.log('3. Test app connection: npm run dev');
  console.log('4. Create sample data');
  console.log('5. Deploy to cloud\n');
}

// Run migrations
runAllMigrations().catch(console.error);
