# Database-Driven Theme System Implementation Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/plans/database-driven-themes-plan.md

**Description:** Detailed plan for converting hardcoded theme groups to database-driven system

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-17

---

## 🎯 Goal

Convert the hardcoded theme groupings in `wiki-home.js` and `wiki-guides.js` to a database-driven system that allows admins to:
- Add/edit/remove theme groups without touching code
- Reassign categories to different themes
- Translate theme names properly via i18n
- Scale the system to any number of themes/categories

---

## 📊 Current State

### Problems:
1. **Hardcoded themes**: 15 theme groups hardcoded in JavaScript
2. **No translations**: Theme names only in English
3. **Difficult to maintain**: Adding/editing themes requires code changes
4. **Not scalable**: Can't easily reorganize category structure

### Current Implementation:
```javascript
// In wiki-home.js and wiki-guides.js
function groupCategoriesByTheme() {
  const themeDefinitions = [
    { name: 'Animal Husbandry & Livestock', icon: '🐓', slugs: ['animal-husbandry', 'beekeeping', 'poultry-keeping'] },
    // ... 14 more hardcoded themes
  ];

  return themeDefinitions.map(theme => ({
    ...theme,
    categories: allCategories.filter(cat => theme.slugs.includes(cat.slug))
  }));
}
```

---

## 🏗️ Proposed Database Schema

### New Table: `wiki_theme_groups`

```sql
CREATE TABLE public.wiki_theme_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sorting
CREATE INDEX idx_wiki_theme_groups_sort ON wiki_theme_groups(sort_order);

-- Index for active themes
CREATE INDEX idx_wiki_theme_groups_active ON wiki_theme_groups(is_active);

-- Enable RLS
ALTER TABLE wiki_theme_groups ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active themes
CREATE POLICY "Anyone can view active theme groups"
  ON wiki_theme_groups
  FOR SELECT
  USING (is_active = true);

-- Policy: Only admins can manage themes (to be added later)
```

### Update Existing Table: `wiki_categories`

```sql
-- Add theme reference column
ALTER TABLE public.wiki_categories
ADD COLUMN theme_id UUID REFERENCES wiki_theme_groups(id) ON DELETE SET NULL;

-- Index for theme lookups
CREATE INDEX idx_wiki_categories_theme ON wiki_categories(theme_id);

-- Update RLS policy (already exists, just noting it here)
```

---

## 📦 Migration Files

### Migration 1: Create Theme Groups Table
**File:** `supabase/migrations/010_create_wiki_theme_groups.sql`

- Create `wiki_theme_groups` table
- Add indexes
- Enable RLS
- Add policies

### Migration 2: Link Categories to Themes
**File:** `supabase/migrations/011_link_categories_to_themes.sql`

- Add `theme_id` column to `wiki_categories`
- Add index
- Update existing categories to link to themes (done after seed)

---

## 🌱 Seed Data

### Seed File: Theme Groups
**File:** `supabase/seeds/012_wiki_theme_groups_seed.sql`

Insert 15 theme groups:

```sql
INSERT INTO public.wiki_theme_groups (name, slug, icon, description, sort_order) VALUES
  ('Animal Husbandry & Livestock', 'animal-husbandry-livestock', '🐓', 'Raising animals and beekeeping', 1),
  ('Food Preservation & Storage', 'food-preservation-storage', '🫙', 'Preserving and storing food', 2),
  ('Water Management Systems', 'water-management-systems', '💧', 'Water harvesting and management', 3),
  ('Soil Building & Fertility', 'soil-building-fertility', '🌱', 'Composting and soil health', 4),
  ('Agroforestry & Trees', 'agroforestry-trees', '🌳', 'Food forests and tree guilds', 5),
  ('Garden Design & Planning', 'garden-design-planning', '📐', 'Garden layout and planning', 6),
  ('Natural Building', 'natural-building', '🏘️', 'Cob, straw bale, earthbag construction', 7),
  ('Renewable Energy', 'renewable-energy', '⚡', 'Solar, biogas, micro-hydro', 8),
  ('Seed Saving & Propagation', 'seed-saving-propagation', '🌾', 'Seed saving and plant propagation', 9),
  ('Forest Gardening', 'forest-gardening', '🌲', 'Forest gardens and edible landscaping', 10),
  ('Ecosystem Management', 'ecosystem-management', '🦋', 'Beneficial insects and habitat creation', 11),
  ('Soil Regeneration', 'soil-regeneration', '🌿', 'Cover crops and regenerative agriculture', 12),
  ('Community & Education', 'community-education', '👥', 'Community gardens and teaching', 13),
  ('Waste & Resource Cycling', 'waste-resource-cycling', '♻️', 'Greywater and resource cycling', 14),
  ('Specialized Techniques', 'specialized-techniques', '🔬', 'Mushrooms, aquaponics, mycoremediation', 15);
```

### Seed File: Link Categories to Themes
**File:** `supabase/seeds/013_link_categories_to_themes.sql`

Update categories with theme_id:

```sql
-- Animal Husbandry & Livestock theme
UPDATE wiki_categories SET theme_id = (SELECT id FROM wiki_theme_groups WHERE slug = 'animal-husbandry-livestock')
WHERE slug IN ('animal-husbandry', 'beekeeping', 'poultry-keeping');

-- Food Preservation & Storage theme
UPDATE wiki_categories SET theme_id = (SELECT id FROM wiki_theme_groups WHERE slug = 'food-preservation-storage')
WHERE slug IN ('food-preservation', 'fermentation', 'root-cellaring');

-- ... continue for all 15 themes
```

---

## 💻 JavaScript Changes

### Update `wiki-home.js`

**Current approach:**
- Hardcoded `themeDefinitions` array
- Maps categories by slug matching

**New approach:**
- Load themes from `wiki_theme_groups` table
- Load categories with theme relationship
- Group dynamically based on `theme_id`

```javascript
// NEW: Load themes from database
let allThemes = [];

async function loadThemes() {
  try {
    console.log('📁 Loading themes from database...');

    const themes = await supabase.getAll('wiki_theme_groups', {
      where: 'is_active',
      operator: 'eq',
      value: true,
      order: 'sort_order.asc'
    });

    allThemes = themes;
    console.log(`✅ Loaded ${themes.length} themes`);
  } catch (error) {
    console.error('❌ Error loading themes:', error);
  }
}

// UPDATED: Group categories by theme using database relationship
function groupCategoriesByTheme() {
  return allThemes.map(theme => ({
    ...theme,
    categories: allCategories.filter(cat => cat.theme_id === theme.id)
  }));
}

// UPDATED: Initialization
document.addEventListener('DOMContentLoaded', async function() {
  await loadThemes(); // Load themes first
  await loadInitialData(); // Then load categories
  renderCategoryFilters();
  // ... rest of initialization
});
```

### Update `wiki-guides.js`

Same changes as `wiki-home.js`:
- Add `loadThemes()` function
- Update `groupCategoriesByTheme()` to use database theme relationship
- Add theme loading to initialization

---

## 🔧 Admin Panel Features

### Theme Management UI
**File:** `src/wiki/wiki-admin.html`

Add new section for theme management:

```html
<section class="admin-section">
  <h2>🎨 Theme Groups</h2>
  <button class="btn btn-primary" id="addThemeBtn">
    <i class="fas fa-plus"></i> Add Theme
  </button>

  <table class="admin-table">
    <thead>
      <tr>
        <th>Icon</th>
        <th>Name</th>
        <th>Slug</th>
        <th>Categories</th>
        <th>Order</th>
        <th>Active</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="themesTableBody">
      <!-- Themes loaded dynamically -->
    </tbody>
  </table>
</section>
```

### Features:
1. **List themes**: Show all themes with sort order
2. **Add theme**: Create new theme group
3. **Edit theme**: Modify name, icon, description, sort order
4. **Delete theme**: Remove theme (sets is_active to false)
5. **Reorder themes**: Drag-and-drop or up/down arrows
6. **Assign categories**: Multi-select to assign categories to theme

---

## 🌍 Translation Strategy

### Theme Name Translations

**Approach:** Use i18n keys based on theme slug

```javascript
// When rendering theme dropdown
allThemes.forEach(theme => {
  const option = document.createElement('option');
  option.value = theme.id;

  // Translate theme name using slug-based i18n key
  const translatedName = wikiI18n.t(`wiki.themes.${theme.slug}`) || theme.name;
  option.textContent = `${theme.icon} ${translatedName}`;

  themeSelect.appendChild(option);
});
```

### i18n Keys to Add

In `wiki-i18n.js`, add for each language:

```javascript
// English
'wiki.themes.animal-husbandry-livestock': 'Animal Husbandry & Livestock',
'wiki.themes.food-preservation-storage': 'Food Preservation & Storage',
// ... all 15 themes

// Portuguese
'wiki.themes.animal-husbandry-livestock': 'Criação de Animais e Gado',
'wiki.themes.food-preservation-storage': 'Preservação e Armazenamento de Alimentos',
// ... all 15 themes

// Spanish
'wiki.themes.animal-husbandry-livestock': 'Ganadería y Cría de Animales',
'wiki.themes.food-preservation-storage': 'Conservación y Almacenamiento de Alimentos',
// ... all 15 themes
```

---

## 🧪 Testing Plan

### 1. Database Testing
- ✅ Verify theme groups table created
- ✅ Verify categories linked to themes
- ✅ Test RLS policies (read access for all, write for admins)
- ✅ Test cascade behavior (theme deletion)

### 2. Frontend Testing
- ✅ Themes load correctly from database
- ✅ Dropdowns populate with themes
- ✅ Category filtering works by theme
- ✅ Translations work for theme names
- ✅ Language switching updates theme names

### 3. Admin Panel Testing
- ✅ Theme CRUD operations work
- ✅ Category assignment works
- ✅ Sort order changes reflect in dropdowns
- ✅ Deactivating theme hides it from frontend

---

## 📋 Implementation Checklist

### Phase 1: Database Setup ✅
- [ ] Create migration: `010_create_wiki_theme_groups.sql`
- [ ] Create migration: `011_link_categories_to_themes.sql`
- [ ] Create seed: `012_wiki_theme_groups_seed.sql`
- [ ] Create seed: `013_link_categories_to_themes.sql`
- [ ] Run migrations in Supabase
- [ ] Run seeds in Supabase
- [ ] Verify data in Supabase console

### Phase 2: JavaScript Updates ✅
- [ ] Add `loadThemes()` to `wiki-home.js`
- [ ] Update `groupCategoriesByTheme()` in `wiki-home.js`
- [ ] Update initialization in `wiki-home.js`
- [ ] Add `loadThemes()` to `wiki-guides.js`
- [ ] Update `groupCategoriesByTheme()` in `wiki-guides.js`
- [ ] Update initialization in `wiki-guides.js`
- [ ] Test theme loading and filtering

### Phase 3: i18n Translations ✅
- [ ] Add theme translation keys for English
- [ ] Add theme translation keys for Portuguese
- [ ] Add theme translation keys for Spanish
- [ ] Add theme translation keys for other 12 languages
- [ ] Test language switching with themes

### Phase 4: Admin Panel ✅
- [ ] Add theme management section to `wiki-admin.html`
- [ ] Create `wiki-admin-themes.js` for theme CRUD
- [ ] Implement add theme functionality
- [ ] Implement edit theme functionality
- [ ] Implement delete/deactivate theme functionality
- [ ] Implement theme reordering
- [ ] Implement category assignment UI
- [ ] Test all admin operations

### Phase 5: Testing & Documentation ✅
- [ ] Test complete workflow end-to-end
- [ ] Test with different user roles (admin vs regular)
- [ ] Test all 15 languages
- [ ] Update documentation
- [ ] Create migration guide for future theme additions

---

## 🚀 Benefits After Implementation

### For Admins:
- ✅ Add new themes without code changes
- ✅ Reorganize categories easily
- ✅ Control theme visibility
- ✅ Customize sort order

### For Developers:
- ✅ No more hardcoded theme definitions
- ✅ Cleaner, more maintainable code
- ✅ Database-driven architecture
- ✅ Easier to test and debug

### For Users:
- ✅ Properly translated theme names
- ✅ Better organized categories
- ✅ More intuitive filtering experience
- ✅ Consistent across all languages

---

## 📝 Future Enhancements

1. **Theme Colors**: Add color field for visual theming
2. **Theme Icons**: Upload custom icons instead of emojis
3. **Theme Descriptions**: Rich text descriptions for each theme
4. **Theme Analytics**: Track which themes are most used
5. **Multi-level Themes**: Sub-themes for even better organization
6. **Theme Tags**: Additional metadata for advanced filtering

---

## 🔗 Related Files

- Migration: `supabase/migrations/010_create_wiki_theme_groups.sql`
- Migration: `supabase/migrations/011_link_categories_to_themes.sql`
- Seed: `supabase/seeds/012_wiki_theme_groups_seed.sql`
- Seed: `supabase/seeds/013_link_categories_to_themes.sql`
- JavaScript: `src/wiki/js/wiki-home.js`
- JavaScript: `src/wiki/js/wiki-guides.js`
- Admin UI: `src/wiki/wiki-admin.html`
- Admin JS: `src/wiki/js/wiki-admin-themes.js` (to be created)
- i18n: `src/wiki/js/wiki-i18n.js`

---

**Status:** ✅ Phases 1-3 Complete - Ready for Phase 4 (Admin Panel)

**Completed:**
- ✅ Phase 1: Database migrations and seeds
- ✅ Phase 2: JavaScript updates (wiki-home.js, wiki-guides.js)
- ✅ Phase 3: i18n translations (all 15 themes in all 15 languages)

**Next Step:** Build admin panel for theme management (Phase 4)

---

## ✅ Implementation Complete (Phases 1-3)

### Phase 1: Database Setup (Complete 2025-11-17)

**Created Files:**
- `supabase/migrations/010_create_wiki_theme_groups.sql`
- `supabase/migrations/011_link_categories_to_themes.sql`
- `supabase/seeds/012_wiki_theme_groups_seed.sql`
- `supabase/seeds/013_link_categories_to_themes.sql`

**Database Status:**
- ✅ `wiki_theme_groups` table created with 15 themes
- ✅ `wiki_categories.theme_id` foreign key added
- ✅ 45 categories linked to themes
- ✅ RLS policies enabled
- ✅ All seeds executed successfully

### Phase 2: JavaScript Updates (Complete 2025-11-17)

**Updated Files:**
- `src/wiki/js/wiki-home.js`
- `src/wiki/js/wiki-guides.js`

**Changes Made:**
- ✅ Added `loadThemes()` function to load from database
- ✅ Updated `groupCategoriesByTheme()` to use database relationships
- ✅ Updated `renderCategoryFilters()` to use translated theme names
- ✅ Updated `filterCategoriesByTheme()` to use theme IDs
- ✅ Updated `updateActiveFilters()` to display translated names
- ✅ Removed all hardcoded theme definitions

### Phase 3: i18n Translations (Complete 2025-11-17)

**Updated File:**
- `src/wiki/js/wiki-i18n.js`

**Translations Added:**
- ✅ All 15 themes translated in all 15 languages (225 total keys)
- ✅ 9 themes already existed, 6 new themes added:
  - `wiki.themes.soil-building-fertility`
  - `wiki.themes.agroforestry-trees`
  - `wiki.themes.garden-design-planning`
  - `wiki.themes.natural-building`
  - `wiki.themes.seed-saving-propagation`
  - `wiki.themes.waste-resource-cycling`

**Languages with Complete Theme Coverage (15):**
- English, Portuguese, Spanish, French, German, Italian, Dutch, Polish, Japanese, Chinese, Korean, Czech, Slovak, Ukrainian, Russian

### Documentation Created:

**New Documents:**
- `docs/architecture/i18n-architecture.md` - Comprehensive i18n system documentation
