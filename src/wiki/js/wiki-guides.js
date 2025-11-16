/**
 * Wiki Guides Page - Display Guides from Database
 * Fetches real guides from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';
import { wikiI18n } from './wiki-i18n.js';

// State
let currentFilter = 'all';
let allGuides = [];
let allCategories = [];
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
 * Render category filters
 */
function renderCategoryFilters() {
  const categoryFilters = document.getElementById('categoryFilters');
  if (!categoryFilters) return;

  // Keep the "All Guides" filter and add categories
  const categoryHTML = allCategories.map(cat => `
    <a href="javascript:void(0)" class="tag guide-filter" data-filter="${cat.id}">
      ${escapeHtml(cat.name)}
    </a>
  `).join('');

  // Add category filters after "All Guides"
  const allFilter = categoryFilters.querySelector('[data-filter="all"]');
  if (allFilter) {
    allFilter.insertAdjacentHTML('afterend', categoryHTML);
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
 * Render guides to the page
 */
function renderGuides() {
  const guidesGrid = document.getElementById('guidesGrid');

  if (!guidesGrid) {
    console.warn('⚠️ guidesGrid element not found');
    return;
  }

  // Filter guides based on current filter
  let filteredGuides = allGuides;

  if (currentFilter !== 'all') {
    filteredGuides = allGuides.filter(guide => {
      return guide.categories.some(cat => cat.id === currentFilter);
    });
  }

  // Apply sorting
  filteredGuides = sortGuides(filteredGuides, currentSort);

  console.log(`📊 Rendering ${filteredGuides.length} guides (filtered from ${allGuides.length} total)`);

  // Update count
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
        ${guide.categories.map(cat => `
          <span class="tag">${escapeHtml(cat.name)}</span>
        `).join('')}
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
 * Initialize filters
 */
function initializeFilters() {
  const filterTags = document.querySelectorAll('.guide-filter');

  filterTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      filterTags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update current filter
      currentFilter = this.dataset.filter;

      console.log(`🔍 Filter changed to: ${currentFilter}`);

      // Re-render guides
      renderGuides();
    });
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
            ${guide.categories.map(cat => `
              <span class="tag">${escapeHtml(cat.name)}</span>
            `).join('')}
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
