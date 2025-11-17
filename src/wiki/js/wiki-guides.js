/**
 * Wiki Guides Page - Display Guides from Database
 * Fetches real guides from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

// State
let currentFilter = 'all';
let currentTheme = '';
let currentCategory = 'all';
let allGuides = [];
let allCategories = [];
let categoryGroups = [];
let currentSort = 'newest';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Guides ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header for testing
  displayVersionInHeader();

  await loadCategories();
  await loadGuides();
  initializeFilters();
  initializeSearch();
  initializeSorting();

  console.log(`✅ Wiki Guides ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Listen for language changes and re-populate dropdowns
 */
document.addEventListener('DOMContentLoaded', function() {
  // Store reference to MutationObserver for language changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        console.log('🌍 Language changed, re-populating dropdowns...');
        // Re-populate dropdowns with new translations
        if (categoryGroups.length > 0) {
          renderCategoryFilters();
          // Restore current selections
          const themeSelect = document.getElementById('themeSelect');
          const categorySelect = document.getElementById('categorySelect');
          if (themeSelect && currentTheme) {
            themeSelect.value = currentTheme;
            filterCategoriesByTheme(currentTheme);
          }
          if (categorySelect && currentCategory && currentCategory !== 'all') {
            categorySelect.value = currentCategory;
          }
          updateActiveFilters();
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
});

/**
 * Load categories from database
 */
async function loadCategories() {
  try {
    console.log('📂 Loading categories from database...');

    // Fetch all categories
    const categories = await supabase.getAll('wiki_categories', {
      order: 'name.asc'
    });

    allCategories = categories;
    console.log(`✅ Loaded ${categories.length} categories`);

    // Render category filters
    renderCategoryFilters();
  } catch (error) {
    console.error('❌ Error loading categories:', error);
  }
}

/**
 * Group categories by theme (same 15 theme groups as wiki-home)
 */
function groupCategoriesByTheme() {
  const themeDefinitions = [
    { name: 'Animal Husbandry & Livestock', icon: '🐓', slugs: ['animal-husbandry', 'beekeeping', 'poultry-keeping'] },
    { name: 'Food Preservation & Storage', icon: '🫙', slugs: ['food-preservation', 'fermentation', 'root-cellaring'] },
    { name: 'Water Management Systems', icon: '💧', slugs: ['water-harvesting', 'pond-design', 'swale-systems'] },
    { name: 'Soil Building & Fertility', icon: '🌱', slugs: ['composting', 'vermicomposting', 'soil-building'] },
    { name: 'Agroforestry & Trees', icon: '🌳', slugs: ['food-forests', 'tree-guilds', 'nut-tree-cultivation'] },
    { name: 'Garden Design & Planning', icon: '📐', slugs: ['garden-design', 'zone-planning', 'season-extension'] },
    { name: 'Natural Building', icon: '🏘️', slugs: ['cob-building', 'straw-bale', 'earthbag-construction'] },
    { name: 'Renewable Energy', icon: '⚡', slugs: ['solar-power', 'biogas', 'micro-hydro'] },
    { name: 'Seed Saving & Propagation', icon: '🌾', slugs: ['seed-saving', 'grafting', 'plant-propagation'] },
    { name: 'Forest Gardening', icon: '🌲', slugs: ['forest-gardening', 'edible-landscaping', 'understory-planting'] },
    { name: 'Ecosystem Management', icon: '🦋', slugs: ['beneficial-insects', 'pollinator-gardens', 'habitat-creation'] },
    { name: 'Soil Regeneration', icon: '🌿', slugs: ['cover-cropping', 'green-manures', 'no-till-farming'] },
    { name: 'Community & Education', icon: '👥', slugs: ['community-gardens', 'teaching-permaculture', 'skill-sharing'] },
    { name: 'Waste & Resource Cycling', icon: '♻️', slugs: ['greywater-systems', 'humanure', 'upcycling'] },
    { name: 'Specialized Techniques', icon: '🔬', slugs: ['mushroom-cultivation', 'aquaponics', 'mycoremediation'] }
  ];

  return themeDefinitions.map(theme => ({
    ...theme,
    categories: allCategories.filter(cat => theme.slugs.includes(cat.slug))
  }));
}

/**
 * Render category filters as dropdown selects
 */
function renderCategoryFilters() {
  categoryGroups = groupCategoriesByTheme();

  const themeSelect = document.getElementById('themeSelect');
  const categorySelect = document.getElementById('categorySelect');

  if (!themeSelect || !categorySelect) return;

  // Populate theme dropdown
  categoryGroups.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.name;
    option.textContent = `${theme.icon} ${theme.name}`;
    themeSelect.appendChild(option);
  });

  // Initially populate with all categories
  populateAllCategories();
}

/**
 * Populate category dropdown with all categories
 */
function populateAllCategories() {
  const categorySelect = document.getElementById('categorySelect');
  if (!categorySelect) return;

  // Clear existing options except first
  categorySelect.innerHTML = `<option value="" data-i18n="wiki.home.all_categories">All Categories</option>`;

  // Add all categories
  allCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.slug;
    const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || cat.name;
    option.textContent = `${cat.icon || ''} ${translatedName}`;
    categorySelect.appendChild(option);
  });
}

/**
 * Filter category dropdown by selected theme
 */
function filterCategoriesByTheme(themeName) {
  const categorySelect = document.getElementById('categorySelect');
  if (!categorySelect) return;

  if (!themeName) {
    populateAllCategories();
    return;
  }

  const theme = categoryGroups.find(t => t.name === themeName);
  if (!theme) return;

  // Clear and repopulate with theme categories
  categorySelect.innerHTML = `<option value="" data-i18n="wiki.home.all_categories_in_theme">All Categories in Theme</option>`;

  theme.categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.slug;
    const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || cat.name;
    option.textContent = `${cat.icon || ''} ${translatedName}`;
    categorySelect.appendChild(option);
  });

  // Translate the first option
  wikiI18n.updatePageText();
}

/**
 * Update active filter tags display
 */
function updateActiveFilters() {
  const activeFilters = document.getElementById('activeFilters');
  const activeFiltersRow = document.getElementById('activeFiltersRow');

  if (!activeFilters || !activeFiltersRow) return;

  const filters = [];

  // Add theme filter if set
  if (currentTheme) {
    const theme = categoryGroups.find(t => t.name === currentTheme);
    if (theme) {
      filters.push(`
        <div class="active-filter-tag">
          <span>${theme.icon} ${theme.name}</span>
          <button class="remove-filter" data-type="theme">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `);
    }
  }

  // Add category filter if set (with count on mobile via CSS)
  if (currentCategory && currentCategory !== 'all') {
    const cat = allCategories.find(c => c.slug === currentCategory);
    if (cat) {
      const filteredCount = getFilteredGuides().length;
      const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || cat.name;
      const guidesText = wikiI18n.t(filteredCount === 1 ? 'wiki.home.guide' : 'wiki.home.guides');
      filters.push(`
        <div class="active-filter-tag">
          <span class="filter-tag-text">${cat.icon || ''} ${translatedName}</span>
          <span class="filter-tag-count"> • ${filteredCount} ${guidesText}</span>
          <button class="remove-filter" data-type="category">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `);
    }
  }

  // Show/hide active filters row
  if (filters.length > 0) {
    activeFilters.innerHTML = filters.join('');
    activeFiltersRow.style.display = 'flex';
  } else {
    activeFilters.innerHTML = '';
    activeFiltersRow.style.display = 'none';
  }
}

/**
 * Load guides from database
 */
async function loadGuides() {
  try {
    console.log('📚 Loading guides from database...');
    showLoading();

    // Fetch all published guides
    console.log('🔍 Fetching published guides from wiki_guides table...');
    const guides = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'created_at.desc'
    });

    console.log(`✅ Loaded ${guides.length} guides from database`);

    // Enrich guides with author information and categories
    console.log('👤 Fetching author information and categories for guides...');
    allGuides = await Promise.all(
      guides.map(async (guide) => {
        // Fetch author
        let authorName = null;
        if (guide.author_id) {
          const authors = await supabase.getAll('users', {
            where: 'id',
            operator: 'eq',
            value: guide.author_id
          });
          if (authors.length > 0) {
            authorName = authors[0].full_name;
          }
        }

        // Fetch categories for this guide
        const guideCategories = await supabase.getAll('wiki_guide_categories', {
          where: 'guide_id',
          operator: 'eq',
          value: guide.id
        });

        // Get category details
        const categoryDetails = await Promise.all(
          guideCategories.map(async (gc) => {
            const cats = await supabase.getAll('wiki_categories', {
              where: 'id',
              operator: 'eq',
              value: gc.category_id
            });
            return cats[0];
          })
        );

        return {
          ...guide,
          author_name: authorName,
          categories: categoryDetails.filter(c => c) // Remove nulls
        };
      })
    );

    console.log('📋 Guide titles:', allGuides.map(g => g.title));

    // Render guides
    console.log('🎨 Rendering guides to DOM...');
    renderGuides();

    console.log('✨ Guides load complete!');
  } catch (error) {
    console.error('❌ Error loading guides:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    showError(wikiI18n.t('wiki.guides.error_loading'));
  }
}

/**
 * Get filtered guides based on current category
 */
function getFilteredGuides() {
  if (currentCategory === 'all' || !currentCategory) {
    return allGuides;
  }
  return allGuides.filter(guide => {
    return guide.categories.some(cat => cat.slug === currentCategory);
  });
}

/**
 * Update count display (responsive: summary bar on desktop, inline count on mobile)
 */
function updateCountDisplay() {
  const filtered = getFilteredGuides();
  const currentCount = document.getElementById('currentCount');
  const totalCount = document.getElementById('totalCount');

  if (currentCount) currentCount.textContent = filtered.length;
  if (totalCount) totalCount.textContent = allGuides.length;
}

/**
 * Render guides to the page
 */
function renderGuides() {
  const guidesGrid = document.getElementById('guidesGrid');

  if (!guidesGrid) {
    console.warn('⚠️ guidesGrid element not found');
    return;
  }

  // Filter guides based on current category
  let filteredGuides = getFilteredGuides();

  // Apply sorting
  filteredGuides = sortGuides(filteredGuides, currentSort);

  console.log(`📊 Rendering ${filteredGuides.length} guides (filtered from ${allGuides.length} total)`);

  // Update counts
  updateCountDisplay();
  const guideCount = document.getElementById('guideCount');
  if (guideCount) {
    guideCount.textContent = filteredGuides.length;
  }

  // Render guides
  if (filteredGuides.length === 0) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-book-open" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.guides.no_guides_found')}</h3>
        <p class="text-muted">${wikiI18n.t('wiki.guides.try_different_filter')}</p>
      </div>
    `;
    return;
  }

  guidesGrid.innerHTML = filteredGuides.map(guide => `
    <div class="card">
      <div class="card-meta">
        <span><i class="fas fa-calendar"></i> ${formatDate(guide.published_at)}</span>
        ${guide.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(guide.author_name)}</span>` : ''}
        <span><i class="fas fa-eye"></i> ${guide.view_count || 0} views</span>
      </div>
      <h3 class="card-title">
        <a href="wiki-page.html?slug=${escapeHtml(guide.slug || '')}" style="text-decoration: none; color: inherit;">
          ${escapeHtml(guide.title)}
        </a>
      </h3>
      <p class="text-muted">
        ${escapeHtml(guide.summary)}
      </p>
      <div class="tags">
        ${guide.categories.map(cat => {
          const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
          return `<span class="tag">${translatedName}</span>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Sort guides based on selected sort option
 */
function sortGuides(guides, sortOption) {
  const sorted = [...guides];

  switch (sortOption) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'popular':
      sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      break;
    case 'alpha':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return sorted;
}

/**
 * Initialize dropdown filters
 */
function initializeFilters() {
  const themeSelect = document.getElementById('themeSelect');
  const categorySelect = document.getElementById('categorySelect');

  if (!themeSelect || !categorySelect) {
    console.warn('⚠️ Theme or category select not found');
    return;
  }

  // Theme dropdown change handler
  themeSelect.addEventListener('change', function() {
    currentTheme = this.value;
    currentCategory = 'all';
    categorySelect.value = '';

    console.log(`🎨 Theme changed to: ${currentTheme || 'All Themes'}`);

    // Update category dropdown based on theme
    filterCategoriesByTheme(currentTheme);

    // Update active filters display
    updateActiveFilters();

    // Re-render guides
    renderGuides();
    updateCountDisplay();
  });

  // Category dropdown change handler
  categorySelect.addEventListener('change', function() {
    currentCategory = this.value || 'all';

    console.log(`📁 Category changed to: ${currentCategory}`);

    // Update active filters display
    updateActiveFilters();

    // Re-render guides
    renderGuides();
    updateCountDisplay();
  });

  // Remove filter button handlers (event delegation)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-filter')) {
      const button = e.target.closest('.remove-filter');
      const type = button.dataset.type;

      if (type === 'theme') {
        currentTheme = '';
        themeSelect.value = '';
        populateAllCategories();
      } else if (type === 'category') {
        currentCategory = 'all';
        categorySelect.value = '';
      }

      updateActiveFilters();
      renderGuides();
      updateCountDisplay();
    }
  });
}

/**
 * Initialize search
 */
function initializeSearch() {
  const searchInput = document.getElementById('guideSearch');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();

      if (searchTerm === '') {
        // Show all guides
        renderGuides();
        return;
      }

      // Filter guides by search term
      const guidesGrid = document.getElementById('guidesGrid');
      const filteredGuides = allGuides.filter(guide => {
        return guide.title.toLowerCase().includes(searchTerm) ||
               guide.summary.toLowerCase().includes(searchTerm) ||
               guide.categories.some(cat => cat.name.toLowerCase().includes(searchTerm));
      });

      // Update count
      const guideCount = document.getElementById('guideCount');
      if (guideCount) {
        guideCount.textContent = filteredGuides.length;
      }

      // Render filtered guides
      if (filteredGuides.length === 0) {
        guidesGrid.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <i class="fas fa-search" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.guides.no_guides_found')}</h3>
            <p class="text-muted">${wikiI18n.t('wiki.guides.no_search_results')}</p>
          </div>
        `;
        return;
      }

      const sorted = sortGuides(filteredGuides, currentSort);

      guidesGrid.innerHTML = sorted.map(guide => `
        <div class="card">
          <div class="card-meta">
            <span><i class="fas fa-calendar"></i> ${formatDate(guide.published_at)}</span>
            ${guide.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(guide.author_name)}</span>` : ''}
            <span><i class="fas fa-eye"></i> ${guide.view_count || 0} views</span>
          </div>
          <h3 class="card-title">
            <a href="wiki-page.html?slug=${escapeHtml(guide.slug || '')}" style="text-decoration: none; color: inherit;">
              ${escapeHtml(guide.title)}
            </a>
          </h3>
          <p class="text-muted">
            ${escapeHtml(guide.summary)}
          </p>
          <div class="tags">
            ${guide.categories.map(cat => {
              const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
              return `<span class="tag">${translatedName}</span>`;
            }).join('')}
          </div>
        </div>
      `).join('');
    });
  }
}

/**
 * Initialize sorting buttons
 */
function initializeSorting() {
  const sortNewest = document.getElementById('sortNewest');
  const sortPopular = document.getElementById('sortPopular');
  const sortAlpha = document.getElementById('sortAlpha');

  const sortButtons = [sortNewest, sortPopular, sortAlpha];

  if (sortNewest) {
    sortNewest.addEventListener('click', function() {
      currentSort = 'newest';
      updateSortButtons(sortButtons, this);
      renderGuides();
    });
  }

  if (sortPopular) {
    sortPopular.addEventListener('click', function() {
      currentSort = 'popular';
      updateSortButtons(sortButtons, this);
      renderGuides();
    });
  }

  if (sortAlpha) {
    sortAlpha.addEventListener('click', function() {
      currentSort = 'alpha';
      updateSortButtons(sortButtons, this);
      renderGuides();
    });
  }

  // Set initial active state
  updateSortButtons(sortButtons, sortNewest);
}

/**
 * Update sort button states
 */
function updateSortButtons(buttons, activeButton) {
  buttons.forEach(btn => {
    if (btn) {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }
  });

  if (activeButton) {
    activeButton.classList.remove('btn-outline');
    activeButton.classList.add('btn-primary');
  }
}

/**
 * Show loading state
 */
function showLoading() {
  const guidesGrid = document.getElementById('guidesGrid');
  if (guidesGrid) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.guides.loading')}</h3>
      </div>
    `;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const guidesGrid = document.getElementById('guidesGrid');
  if (guidesGrid) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.common.error')}</h3>
        <p class="text-muted">${escapeHtml(message)}</p>
      </div>
    `;
  }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return wikiI18n.t('wiki.time.unknown_date');

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return wikiI18n.t('wiki.time.today');
  if (diffDays === 1) return wikiI18n.t('wiki.time.yesterday');
  if (diffDays < 7) return `${diffDays} ${wikiI18n.t('wiki.time.days_ago')}`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks !== 1 ? wikiI18n.t('wiki.time.weeks_ago') : wikiI18n.t('wiki.time.week_ago')}`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months !== 1 ? wikiI18n.t('wiki.time.months_ago') : wikiI18n.t('wiki.time.month_ago')}`;
  }

  return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
