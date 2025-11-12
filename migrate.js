const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://mcbxbaggjaxqfdvmrqsc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMTg0NiwiZXhwIjoyMDc4MDc3ODQ2fQ.dTRFNjBrZHsLERsjzqSckpJ1oaQcCjIw98_UvgKyQJU';

async function main() {
  console.log('='.repeat(80));
  console.log('PERMAHUB: DATABASE MIGRATION EXECUTOR');
  console.log('='.repeat(80));

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const migrations = [
    { file: 'database/migrations/001_initial_schema.sql', name: 'Phase 1: Initial Schema' },
    { file: 'database/migrations/002_analytics.sql', name: 'Phase 2: Analytics' },
    { file: 'database/migrations/003_items_pubsub.sql', name: 'Phase 3: Pub/Sub' },
  ];

  for (const migration of migrations) {
    try {
      console.log(`\n📋 ${migration.name}`);
      const sql = fs.readFileSync(migration.file, 'utf-8');
      console.log(`✓ SQL read (${sql.length} chars)`);
      
      // Try to execute the SQL
      const { data, error } = await supabase.rpc('execute_sql', { query: sql });
      
      if (error) {
        console.error(`⚠ Note: ${error.message}`);
      } else {
        console.log(`✓ Migration executed`);
      }
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('Migration attempt completed');
  console.log('='.repeat(80));
}

main().catch(console.error);
