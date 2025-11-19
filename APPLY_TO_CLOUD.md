# Apply 011_madeira_farms_projects.sql to Cloud Database

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/APPLY_TO_CLOUD.md

**Created:** 2025-11-19

---

## Quick Steps to Apply to Cloud

### 1. Open Supabase Console
- URL: https://supabase.com/dashboard
- Project: **mcbxbaggjaxqfdvmrqsc**

### 2. Navigate to SQL Editor
- Click **SQL Editor** in left sidebar
- Click **New Query** button

### 3. Open the SQL File
- File location: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeded/011_madeira_farms_projects.sql`
- Open in text editor
- Select All (Cmd+A)
- Copy (Cmd+C)

### 4. Paste and Execute
- Paste into Supabase SQL Editor (Cmd+V)
- Click **Run** button
- Wait for completion (~30 seconds)

### 5. Expected Success Output

You should see:
```
UPDATE 1
UPDATE 1
UPDATE 1
UPDATE 1
UPDATE 1
UPDATE 1
DO
```

And these verification notices:
```
NOTICE: ================================================================
NOTICE: Phase 2, Batch 3 - Madeira Farms & Projects Verification
NOTICE: ================================================================
NOTICE: 1. Alma Farm Gaula: 6853 characters
NOTICE: 2. Permaculture Project Fajã da Ovelha: 9278 characters
NOTICE: 3. Madeira Native Plant Nursery: 10096 characters
NOTICE: 4. Levada das 25 Fontes Water Heritage Site: 13217 characters
NOTICE: 5. Mercado Agrícola do Santo da Serra: 12234 characters
NOTICE: 6. Mercado dos Lavradores Funchal: 15465 characters
NOTICE: ================================================================
NOTICE: Phase 2, Batch 3 complete! All 6 Madeira locations expanded.
NOTICE: ================================================================
```

---

## What This Updates

**6 Madeira Locations Expanded:**

1. **Alma Farm Gaula** (405 → 6,853 chars)
   - Small-scale organic farm with veggie boxes
   - Coconut fiber mulching techniques
   - Instagram: @alma.farm.madeira

2. **Permaculture Project Fajã da Ovelha** (451 → 9,278 chars)
   - Workaway volunteer opportunities
   - 8,000m² property with ocean views
   - Traditional house restoration

3. **Madeira Native Plant Nursery** (450 → 10,096 chars)
   - IFCN endemic species conservation
   - Laurisilva forest restoration
   - 76+ endemic plant species

4. **Levada das 25 Fontes Water Heritage Site** (408 → 13,217 chars)
   - 2,000km historic irrigation system
   - UNESCO tentative list
   - Permaculture water management lessons

5. **Mercado Agrícola do Santo da Serra** (411 → 12,234 chars)
   - Sunday farmers market
   - 100% Madeiran production
   - Live music and community gathering

6. **Mercado dos Lavradores Funchal** (426 → 15,465 chars)
   - Historic market since 1940
   - Art Deco architecture
   - Central agricultural hub

---

## Alternative: Using pgAdmin or Database Client

If you prefer a GUI database client:

1. **Install pgAdmin** or similar PostgreSQL client
2. **Create New Connection:**
   - Host: `db.mcbxbaggjaxqfdvmrqsc.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (from Supabase Database Settings)

3. **Execute SQL:**
   - Open Query Tool
   - Paste SQL from `011_madeira_farms_projects.sql`
   - Execute (F5)

---

## After Applying

Once cloud database is updated:

✅ Local database: Applied ✓
✅ Cloud database: Applied ✓
✅ Git commits: Complete ✓

**Next Steps:**
- Phase 2, Batch 4: Expand 4 community locations (final 12% to reach 100%)
- Phase 3: Expand 10-15 selected events

---

**Status:** Ready to apply to cloud
