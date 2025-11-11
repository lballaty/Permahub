/**
 * Wiki Home Page - Search and Filter Functionality
 */

// Sample guide data (in production, this would come from Supabase)
const guides = [
  {
    id: 1,
    title: 'Building a Swale System for Water Retention',
    author: 'Sarah Chen',
    date: '3 days ago',
    views: 127,
    description: 'Learn how to design and construct swales to capture and distribute rainwater across your property. This comprehensive guide covers site assessment, design principles, and construction techniques.',
    categories: ['water', 'agroforestry']
  },
  {
    id: 2,
    title: 'Companion Planting Guide for Vegetable Gardens',
    author: 'Miguel Torres',
    date: '5 days ago',
    views: 89,
    description: 'Discover which vegetables grow best together and why. This guide includes detailed companion planting charts and explains the science behind beneficial plant relationships.',
    categories: ['gardening', 'food']
  },
  {
    id: 3,
    title: 'Hot Composting: A Step-by-Step Guide',
    author: 'Emma Wilson',
    date: '1 week ago',
    views: 203,
    description: 'Master the art of hot composting to turn kitchen scraps and yard waste into rich, dark compost in just 18 days. Includes troubleshooting tips and material ratios.',
    categories: ['composting', 'waste']
  },
  {
    id: 4,
    title: 'Installing Drip Irrigation for Food Gardens',
    author: 'James O\'Brien',
    date: '1 week ago',
    views: 156,
    description: 'Save water and time with an efficient drip irrigation system. This practical guide covers materials, layout design, and maintenance for home garden installations.',
    categories: ['irrigation', 'water']
  },
  {
    id: 5,
    title: 'Starting a Community Seed Library',
    author: 'Priya Sharma',
    date: '2 weeks ago',
    views: 178,
    description: 'Learn how to organize and run a community seed library to preserve heirloom varieties and promote seed sovereignty. Includes organizational tips and catalog systems.',
    categories: ['community', 'food']
  },
  {
    id: 6,
    title: 'Building with Cob: Natural Building Basics',
    author: 'Tom Anderson',
    date: '2 weeks ago',
    views: 92,
    description: 'Introduction to cob building techniques using clay, sand, and straw. Learn about material preparation, wall construction, and finishing techniques for this sustainable building method.',
    categories: ['building']
  }
];

// State
let currentCategory = 'all';
let currentSearchQuery = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  renderGuides();
  initializeCategoryFilters();
  initializeSearch();
});

/**
 * Render guides to the page
 */
function renderGuides() {
  const guidesGrid = document.getElementById('guidesGrid');
  const guideCount = document.getElementById('guideCount');

  if (!guidesGrid) return;

  // Filter guides based on current category and search query
  const filteredGuides = guides.filter(guide => {
    // Category filter
    const matchesCategory = currentCategory === 'all' ||
                           guide.categories.includes(currentCategory);

    // Search filter
    const matchesSearch = currentSearchQuery === '' ||
                         guide.title.toLowerCase().includes(currentSearchQuery) ||
                         guide.description.toLowerCase().includes(currentSearchQuery) ||
                         guide.author.toLowerCase().includes(currentSearchQuery);

    return matchesCategory && matchesSearch;
  });

  // Update count
  if (guideCount) {
    if (currentCategory === 'all' && currentSearchQuery === '') {
      guideCount.textContent = 'Showing all guides';
    } else {
      guideCount.textContent = `Showing ${filteredGuides.length} guide${filteredGuides.length !== 1 ? 's' : ''}`;
    }
  }

  // Render guides
  if (filteredGuides.length === 0) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No guides found</h3>
        <p class="text-muted">Try adjusting your filters or search query</p>
      </div>
    `;
    return;
  }

  guidesGrid.innerHTML = filteredGuides.map(guide => `
    <div class="card">
      <div class="card-meta">
        <span><i class="fas fa-user"></i> ${guide.author}</span>
        <span><i class="fas fa-calendar"></i> ${guide.date}</span>
        <span><i class="fas fa-eye"></i> ${guide.views} views</span>
      </div>
      <h3 class="card-title">
        <a href="wiki-page.html" style="text-decoration: none; color: inherit;">
          ${guide.title}
        </a>
      </h3>
      <p class="text-muted">
        ${guide.description}
      </p>
      <div class="tags">
        ${guide.categories.map(cat => `
          <span class="tag">${getCategoryName(cat)}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Get human-readable category name
 */
function getCategoryName(category) {
  const names = {
    'water': 'Water Management',
    'gardening': 'Gardening',
    'composting': 'Composting',
    'energy': 'Renewable Energy',
    'food': 'Food Production',
    'agroforestry': 'Agroforestry',
    'building': 'Natural Building',
    'waste': 'Waste Management',
    'irrigation': 'Irrigation',
    'community': 'Community'
  };
  return names[category] || category;
}

/**
 * Initialize category filters
 */
function initializeCategoryFilters() {
  const categoryFilters = document.querySelectorAll('.category-filter');

  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      categoryFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      // Update current category
      currentCategory = this.dataset.category;

      // Re-render guides
      renderGuides();
    });
  });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');

  if (!searchInput) return;

  // Add debouncing to avoid too many re-renders
  let searchTimeout;

  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderGuides();
    }, 300);
  });
}
