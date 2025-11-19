/**
 * Wiki Admin - Category Management
 * Allows administrators to create, edit, and delete categories for guides, events, and locations
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../js/version-manager.js"';

// State
let categories = [];
let currentFilter = 'all';
let editingCategoryId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Admin ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionBadge();

  // Load categories
  await loadCategories();

  // Initialize UI elements
  initializeTabs();
  initializeSearch();
  initializeModals();
  initializeColorPicker();
  initializeEmojiPicker();

  // Load statistics
  await loadStatistics();

  console.log(`✅ Wiki Admin ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Load all categories from database
 */
async function loadCategories() {
  try {
    console.log('📁 Loading categories from database...');

    categories = await supabase.getAll('wiki_categories', {
      order: 'name.asc'
    });

    console.log(`✅ Loaded ${categories.length} categories`);

    // Render categories
    renderCategories();

  } catch (error) {
    console.error('❌ Error loading categories:', error);
    showError('Failed to load categories. Please refresh the page.');
  }
}

/**
 * Load statistics
 */
async function loadStatistics() {
  try {
    // Count total categories
    document.getElementById('totalCategories').textContent = categories.length;

    // Count guides using categories
    const guideCategoryRelations = await supabase.getAll('wiki_guide_categories');
    const uniqueGuides = new Set(guideCategoryRelations.map(gc => gc.guide_id));
    document.getElementById('guidesUsingCategories').textContent = uniqueGuides.size;

    // For now, set events and locations to 0 since we don't have event/location category tables yet
    document.getElementById('eventsUsingCategories').textContent = '0';
    document.getElementById('locationsUsingCategories').textContent = '0';

  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

/**
 * Render categories list
 */
function renderCategories() {
  const container = document.getElementById('categoriesList');
  if (!container) return;

  // Filter categories based on search
  const searchTerm = document.getElementById('searchCategories')?.value.toLowerCase() || '';
  let filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm) ||
    cat.slug.toLowerCase().includes(searchTerm) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm))
  );

  // Filter by type if needed
  if (currentFilter !== 'all') {
    // For now, show all categories since we don't have type field yet
    // In future, we could add a category_type field to differentiate
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--wiki-text-muted);"></i>
        <p class="text-muted" style="margin-top: 1rem;">No categories found</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(category => `
    <div class="category-item">
      <div class="category-info">
        <div class="category-icon" ${category.color ? `style="background: ${category.color}20; color: ${category.color};"` : ''}>
          ${category.icon || '📁'}
        </div>
        <div class="category-details">
          <div class="category-name">${escapeHtml(category.name)}</div>
          <div class="category-slug">${escapeHtml(category.slug)}</div>
          ${category.description ? `<div class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">${escapeHtml(category.description)}</div>` : ''}
        </div>
      </div>
      <div class="category-actions">
        <button class="btn btn-outline btn-small" onclick="editCategory('${category.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-outline btn-small" onclick="deleteCategory('${category.id}', '${escapeHtml(category.name)}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Initialize tabs
 */
function initializeTabs() {
  const tabs = document.querySelectorAll('.admin-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active state
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update filter
      currentFilter = this.dataset.type;

      // Re-render categories
      renderCategories();
    });
  });
}

/**
 * Initialize search
 */
function initializeSearch() {
  const searchInput = document.getElementById('searchCategories');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    renderCategories();
  });
}

/**
 * Initialize modals
 */
function initializeModals() {
  // Add category button
  const addBtn = document.getElementById('addCategoryBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      editingCategoryId = null;
      document.getElementById('modalTitle').textContent = 'Add New Category';
      document.getElementById('categoryForm').reset();
      openCategoryModal();
    });
  }

  // Form submission
  const form = document.getElementById('categoryForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await saveCategory();
    });
  }

  // Auto-generate slug from name
  const nameInput = document.getElementById('categoryName');
  const slugInput = document.getElementById('categorySlug');
  if (nameInput && slugInput) {
    nameInput.addEventListener('input', function() {
      if (!editingCategoryId) { // Only auto-generate for new categories
        slugInput.value = generateSlug(this.value);
      }
    });
  }
}

/**
 * Initialize color picker
 */
function initializeColorPicker() {
  const colorOptions = document.querySelectorAll('.color-option');

  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('categoryColor').value = this.dataset.color;
    });
  });
}

/**
 * Initialize emoji picker
 */
function initializeEmojiPicker() {
  const emojiOptions = document.querySelectorAll('.emoji-option');

  emojiOptions.forEach(option => {
    option.addEventListener('click', function() {
      emojiOptions.forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('categoryIcon').value = this.dataset.emoji;
    });
  });
}

/**
 * Open category modal
 */
function openCategoryModal() {
  document.getElementById('categoryModal').classList.add('active');
}

/**
 * Close category modal
 */
window.closeCategoryModal = function() {
  document.getElementById('categoryModal').classList.remove('active');
  editingCategoryId = null;
};

/**
 * Edit category
 */
window.editCategory = async function(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return;

  editingCategoryId = categoryId;
  document.getElementById('modalTitle').textContent = 'Edit Category';

  // Fill form with category data
  document.getElementById('categoryName').value = category.name;
  document.getElementById('categorySlug').value = category.slug;
  document.getElementById('categoryDescription').value = category.description || '';
  document.getElementById('categoryIcon').value = category.icon || '';
  document.getElementById('categoryColor').value = category.color || '';

  // Select emoji
  const emojiOptions = document.querySelectorAll('.emoji-option');
  emojiOptions.forEach(o => {
    o.classList.remove('selected');
    if (o.dataset.emoji === category.icon) {
      o.classList.add('selected');
    }
  });

  // Select color
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(o => {
    o.classList.remove('selected');
    if (o.dataset.color === category.color) {
      o.classList.add('selected');
    }
  });

  openCategoryModal();
};

/**
 * Save category (create or update)
 */
async function saveCategory() {
  try {
    const categoryData = {
      name: document.getElementById('categoryName').value,
      slug: document.getElementById('categorySlug').value,
      description: document.getElementById('categoryDescription').value,
      icon: document.getElementById('categoryIcon').value,
      color: document.getElementById('categoryColor').value
    };

    if (editingCategoryId) {
      // Update existing category
      await supabase.update('wiki_categories', editingCategoryId, categoryData);
      console.log('✅ Category updated successfully');
    } else {
      // Create new category
      await supabase.create('wiki_categories', categoryData);
      console.log('✅ Category created successfully');
    }

    // Reload categories and close modal
    await loadCategories();
    await loadStatistics();
    closeCategoryModal();

  } catch (error) {
    console.error('Error saving category:', error);
    alert('Failed to save category. The slug might already exist.');
  }
}

/**
 * Delete category
 */
window.deleteCategory = function(categoryId, categoryName) {
  document.getElementById('deleteCategoryName').textContent = categoryName;
  document.getElementById('deleteModal').classList.add('active');

  // Store category ID for confirmation
  window.deletingCategoryId = categoryId;
};

/**
 * Close delete modal
 */
window.closeDeleteModal = function() {
  document.getElementById('deleteModal').classList.remove('active');
  window.deletingCategoryId = null;
};

/**
 * Confirm delete
 */
window.confirmDelete = async function() {
  if (!window.deletingCategoryId) return;

  try {
    await supabase.delete('wiki_categories', window.deletingCategoryId);
    console.log('✅ Category deleted successfully');

    // Reload categories and close modal
    await loadCategories();
    await loadStatistics();
    closeDeleteModal();

  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category. It might be in use by some content.');
  }
};

/**
 * Generate slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.getElementById('categoriesList');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946;"></i>
        <p class="text-muted" style="margin-top: 1rem;">${escapeHtml(message)}</p>
      </div>
    `;
  }
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