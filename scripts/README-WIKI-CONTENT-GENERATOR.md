# Wiki Content Generation Helper

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/README-WIKI-CONTENT-GENERATOR.md

**Description:** Instructions for using the wiki content generation helper script

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-14

---

## Purpose

This script helps LLM agents (Claude, ChatGPT, etc.) generate wiki content incrementally while preventing duplicates.

## Setup

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Verify .env file exists** with Supabase credentials:
```bash
cat .env | grep VITE_SUPABASE
```

3. **Make script executable** (optional):
```bash
chmod +x scripts/generate-wiki-content.js
```

## Commands

### Check Slug Availability

Before creating content, verify the slug is unique:

```bash
node scripts/generate-wiki-content.js check-slug guides "understanding-composting"
```

**Output:**
- ✅ `SLUG AVAILABLE` - Safe to use (exit code 0)
- ❌ `SLUG EXISTS` - Choose different slug (exit code 1)

### List Guides by Category

See what content already exists in a category:

```bash
node scripts/generate-wiki-content.js list-guides soil-science
```

**Output:**
```
Category: Soil Science
Guides (3):

1. Understanding Soil Food Web: A Practical Guide
   Slug: understanding-soil-food-web-practical
   Status: published
   Created: 11/14/2025

2. Soil Testing Methods
   Slug: soil-testing-methods
   Status: published
   Created: 11/13/2025
```

### List All Content

Get overview of all content of a type:

```bash
node scripts/generate-wiki-content.js list-all guides
node scripts/generate-wiki-content.js list-all events
node scripts/generate-wiki-content.js list-all locations
```

### Generate Slug from Title

Auto-generate URL-friendly slug:

```bash
node scripts/generate-wiki-content.js generate-slug "Understanding Composting Methods"
```

**Output:**
```
Title: Understanding Composting Methods
Generated slug: understanding-composting-methods
```

### Search for Similar Content

Find existing content before creating:

```bash
node scripts/generate-wiki-content.js search guides "compost"
node scripts/generate-wiki-content.js search events "workshop"
node scripts/generate-wiki-content.js search locations "farm"
```

### Show Statistics

Get current content counts:

```bash
node scripts/generate-wiki-content.js stats
```

**Output:**
```
📊 Wiki Content Statistics:

  Guides:     47
  Events:     12
  Locations:  8
  Categories: 52
```

## Workflow for LLM Agents

### Step-by-Step Content Creation

**1. Check what exists:**
```bash
# Get statistics
node scripts/generate-wiki-content.js stats

# List content in target category
node scripts/generate-wiki-content.js list-guides soil-science

# Search for similar content
node scripts/generate-wiki-content.js search guides "composting"
```

**2. Generate and verify slug:**
```bash
# Generate slug from title
node scripts/generate-wiki-content.js generate-slug "Hot Composting Methods"

# Check if it's available
node scripts/generate-wiki-content.js check-slug guides "hot-composting-methods"
```

**3. Create content using SQL:**

See `/docs/WIKI_CONTENT_CREATION_GUIDE.md` for SQL templates.

**4. Verify creation:**
```bash
# Confirm new content added
node scripts/generate-wiki-content.js stats

# List category to see new guide
node scripts/generate-wiki-content.js list-guides composting
```

## Use Cases

### For Claude Code / ChatGPT

When generating multiple guides for a project:

```bash
# 1. Check category coverage
node scripts/generate-wiki-content.js list-guides water-management

# 2. See what needs to be created
# (Category has only 2 guides, needs more)

# 3. Generate slug for new guide
node scripts/generate-wiki-content.js generate-slug "Rainwater Harvesting Systems"

# 4. Verify slug availability
node scripts/generate-wiki-content.js check-slug guides "rainwater-harvesting-systems"

# 5. Create guide using SQL template
# (See WIKI_CONTENT_CREATION_GUIDE.md)

# 6. Confirm creation
node scripts/generate-wiki-content.js search guides "rainwater"
```

### Preventing Duplicates

**Before creating ANY content:**

```bash
# 1. Search for similar titles
node scripts/generate-wiki-content.js search guides "permaculture design"

# If results found, check if your content would be duplicate
# 2. If creating anyway, ensure unique slug
node scripts/generate-wiki-content.js check-slug guides "permaculture-design-principles-2025"
```

### Batch Content Generation

When creating multiple pieces:

```bash
#!/bin/bash
# Script to check multiple slugs

slugs=(
  "understanding-cover-crops"
  "green-manure-guide"
  "nitrogen-fixing-plants"
)

for slug in "${slugs[@]}"; do
  echo "Checking: $slug"
  node scripts/generate-wiki-content.js check-slug guides "$slug"
  if [ $? -eq 0 ]; then
    echo "✅ Available"
  else
    echo "❌ Exists - choose different slug"
  fi
  echo ""
done
```

## Error Handling

### Exit Codes

- `0` - Success (slug available, command completed)
- `1` - Error (slug exists, invalid arguments, database error)

### Common Errors

**"Error: Missing environment variables"**
- Solution: Verify `.env` file exists with Supabase credentials

**"Error: Invalid content type"**
- Solution: Use `guides`, `events`, or `locations`

**"Error: Category not found"**
- Solution: Check category slug spelling, run `list-all` to see available categories

## API Reference

### checkSlugExists(table, slug)

Check if slug exists in specified table.

**Returns:** `{ exists: boolean, data: object|null, error: object|null }`

### listGuidesByCategory(categorySlug)

List all guides in a category.

**Returns:** `{ data: { category: string, guides: array }, error: object|null }`

### generateSlug(title)

Generate URL-friendly slug from title.

**Returns:** `string`

### getStats()

Get content statistics.

**Returns:** `{ guides: number, events: number, locations: number, categories: number }`

## Examples

### Example 1: Creating a New Guide Series

```bash
# Plan: Create 5 guides about composting methods

# Step 1: Check category
node scripts/generate-wiki-content.js list-guides composting

# Step 2: Search for existing content
node scripts/generate-wiki-content.js search guides "compost"

# Step 3: Generate slugs for planned guides
titles=(
  "Hot Composting Step by Step"
  "Vermicomposting for Beginners"
  "Bokashi Composting Method"
  "Trench Composting Techniques"
  "Compost Tea Brewing Guide"
)

for title in "${titles[@]}"; do
  node scripts/generate-wiki-content.js generate-slug "$title"
done

# Step 4: Check availability of each slug
# Step 5: Create guides using SQL templates
# Step 6: Verify with stats
node scripts/generate-wiki-content.js stats
```

### Example 2: Adding Regional Events

```bash
# Plan: Add events for Madeira region

# Step 1: Check existing events
node scripts/generate-wiki-content.js list-all events

# Step 2: Generate unique slug with location and date
node scripts/generate-wiki-content.js generate-slug "Permaculture Workshop Madeira May 2026"
# Output: permaculture-workshop-madeira-may-2026

# Step 3: Verify availability
node scripts/generate-wiki-content.js check-slug events "permaculture-workshop-madeira-may-2026"

# Step 4: Create event using SQL template
```

### Example 3: Cataloging Locations

```bash
# Plan: Add permaculture farms in Czech Republic

# Step 1: Search for existing Czech locations
node scripts/generate-wiki-content.js search locations "czech"

# Step 2: Check for geographic duplicates (use SQL)
# Check coordinates in database to avoid duplicating same farm

# Step 3: Generate slugs with location identifiers
node scripts/generate-wiki-content.js generate-slug "EcoCentrum Lipka Prague"
# Output: ecocentrum-lipka-prague

# Step 4: Create location with verified coordinates
```

## Tips for LLM Agents

1. **Always run `stats` first** - Know what already exists
2. **Always run `check-slug` before INSERT** - Prevent constraint violations
3. **Use `search` liberally** - Find similar content to avoid duplication
4. **Generate unique slugs** - Include dates, locations, or identifiers
5. **Verify after creation** - Run `stats` or `search` to confirm
6. **Log your work** - Track what you created in session

## Troubleshooting

### Script won't run

```bash
# Check Node version (need 18+)
node --version

# Check if dependencies installed
npm list @supabase/supabase-js

# Reinstall if needed
npm install
```

### Database connection fails

```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_SERVICE_ROLE_KEY

# Check .env file
cat .env
```

### Slug always shows as existing

```bash
# Test database connection
node scripts/generate-wiki-content.js stats

# If stats work but check-slug doesn't, there may be actual duplicate
# Try different slug variation
```

---

**For more information:**
- Main guide: `/docs/WIKI_CONTENT_CREATION_GUIDE.md`
- Database schema: `/supabase/migrations/004_wiki_schema.sql`
- Report issues: Create issue in repository
