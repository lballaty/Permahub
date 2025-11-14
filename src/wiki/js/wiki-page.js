/**
 * Wiki Page - Display Individual Guide from Database
 * Reads slug from URL and fetches the corresponding guide
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// State
let currentGuide = null;
let guideCategories = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Page ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionInHeader();

  // Get slug from URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    console.error('❌ No slug provided in URL');
    showError('No guide specified. Please select a guide from the home page.');
    return;
  }

  console.log(`📄 Loading guide with slug: "${slug}"`);

  // Load guide from database
  await loadGuide(slug);

  console.log(`✅ Wiki Page ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Load guide from database by slug
 */
async function loadGuide(slug) {
  try {
    console.log(`🔍 Fetching guide with slug: "${slug}" from database...`);

    // Fetch guide by slug
    const guides = await supabase.getAll('wiki_guides', {
      where: 'slug',
      operator: 'eq',
      value: slug
    });

    if (guides.length === 0) {
      console.error(`❌ No guide found with slug: "${slug}"`);
      showError('Guide not found. It may have been removed or the link is incorrect.');
      return;
    }

    currentGuide = guides[0];
    console.log(`✅ Loaded guide: "${currentGuide.title}"`);

    // Fetch guide categories
    const guideCategoryRelations = await supabase.getAll('wiki_guide_categories', {
      where: 'guide_id',
      operator: 'eq',
      value: currentGuide.id
    });

    // Get full category details
    guideCategories = await Promise.all(
      guideCategoryRelations.map(async (gc) => {
        const cats = await supabase.getAll('wiki_categories', {
          where: 'id',
          operator: 'eq',
          value: gc.category_id
        });
        return cats[0];
      })
    );

    guideCategories = guideCategories.filter(c => c);
    console.log(`📁 Guide categories: ${guideCategories.map(c => c.name).join(', ')}`);

    // Render guide content
    renderGuide();

    // Increment view count
    await incrementViewCount();

  } catch (error) {
    console.error('❌ Error loading guide:', error);
    showError('Failed to load guide. Please try again later.');
  }
}

/**
 * Render guide content to the page
 */
function renderGuide() {
  if (!currentGuide) return;

  // Update page title
  document.title = `${currentGuide.title} - Community Wiki`;

  // Update breadcrumb (assuming first category for now)
  const breadcrumb = document.querySelector('.wiki-content > div:first-child');
  if (breadcrumb && guideCategories.length > 0) {
    breadcrumb.innerHTML = `
      <a href="wiki-home.html" style="color: var(--wiki-primary);">Home</a> /
      <a href="wiki-home.html?category=${guideCategories[0].slug}" style="color: var(--wiki-primary);">${escapeHtml(guideCategories[0].name)}</a> /
      <span>${escapeHtml(currentGuide.title)}</span>
    `;
  }

  // Update title
  const titleElement = document.querySelector('.wiki-content h1');
  if (titleElement) {
    titleElement.textContent = currentGuide.title;
  }

  // Update meta information
  const metaElement = document.querySelector('.card-meta');
  if (metaElement) {
    const publishedDate = new Date(currentGuide.published_at);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = currentGuide.content ? currentGuide.content.split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    metaElement.innerHTML = `
      <span><i class="fas fa-user"></i> ${currentGuide.author_id ? 'Community' : 'Community'}</span>
      <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
      <span><i class="fas fa-clock"></i> ${readTime} min read</span>
      <span><i class="fas fa-eye"></i> ${currentGuide.view_count || 0} views</span>
    `;
  }

  // Update tags
  const tagsElement = document.querySelector('.tags.mt-2');
  if (tagsElement && guideCategories.length > 0) {
    tagsElement.innerHTML = guideCategories.map(cat => `
      <span class="tag">${escapeHtml(cat.name)}</span>
    `).join('');
  }

  // Update article content
  const articleBody = document.querySelector('.wiki-content > div:last-child');
  if (articleBody && currentGuide.content) {
    // Convert markdown to HTML (basic conversion for now)
    articleBody.innerHTML = renderMarkdown(currentGuide.content);
  }

  // Update edit link
  const editLink = document.querySelector('a[href="wiki-editor.html"]');
  if (editLink) {
    editLink.href = `wiki-editor.html?slug=${currentGuide.slug}`;
  }

  // Update related guides section if it exists
  updateRelatedGuides();
}

/**
 * Basic markdown to HTML conversion
 */
function renderMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold and italic
  html = html.replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

  // Convert lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

  // Wrap consecutive li elements in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, function(match) {
    return '<ul>' + match + '</ul>';
  });

  // Convert paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.startsWith('<')) {
      return `<p>${para}</p>`;
    }
    return para;
  }).join('\n');

  // Convert line breaks
  html = html.replace(/\n/gim, '<br>');

  return html;
}

/**
 * Update related guides section
 */
async function updateRelatedGuides() {
  const relatedSection = document.querySelector('.wiki-sidebar .card');
  if (!relatedSection || guideCategories.length === 0) return;

  try {
    // Fetch guides from same category
    const allGuides = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'published_at.desc'
    });

    // Get guides with same categories (excluding current guide)
    const relatedGuides = [];
    for (const guide of allGuides) {
      if (guide.id === currentGuide.id) continue;

      // Check if guide has same category
      const guideCategRelations = await supabase.getAll('wiki_guide_categories', {
        where: 'guide_id',
        operator: 'eq',
        value: guide.id
      });

      const hasMatchingCategory = guideCategRelations.some(gc =>
        guideCategories.some(cat => cat.id === gc.category_id)
      );

      if (hasMatchingCategory) {
        relatedGuides.push(guide);
        if (relatedGuides.length >= 3) break; // Limit to 3 related guides
      }
    }

    // Update related guides HTML
    if (relatedGuides.length > 0) {
      const relatedList = relatedSection.querySelector('ul');
      if (relatedList) {
        relatedList.innerHTML = relatedGuides.map(guide => `
          <li style="margin-bottom: 0.5rem;">
            <a href="wiki-page.html?slug=${guide.slug}" style="color: var(--wiki-primary);">
              ${escapeHtml(guide.title)}
            </a>
          </li>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading related guides:', error);
  }
}

/**
 * Increment view count for the guide
 */
async function incrementViewCount() {
  try {
    if (!currentGuide || !currentGuide.id) {
      console.log('No guide to increment view count for');
      return;
    }

    console.log(`👁️ Incrementing view count for guide: ${currentGuide.id}`);

    // Update view count in database
    const newViewCount = (currentGuide.view_count || 0) + 1;

    const updatedGuide = await supabase.update('wiki_guides', currentGuide.id, {
      view_count: newViewCount,
      updated_at: new Date().toISOString()
    });

    if (updatedGuide) {
      // Update local guide object
      currentGuide.view_count = newViewCount;

      // Update displayed view count
      const viewCountElement = document.querySelector('.fa-eye')?.parentElement;
      if (viewCountElement) {
        viewCountElement.innerHTML = `<i class="fas fa-eye"></i> ${newViewCount} views`;
      }

      console.log(`✅ View count updated to ${newViewCount}`);
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't show error to user - view count is not critical
  }
}

/**
 * Show error message
 */
function showError(message) {
  const contentArea = document.querySelector('.wiki-content');
  if (contentArea) {
    contentArea.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem; margin-top: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
        <h2>Error Loading Guide</h2>
        <p class="text-muted">${escapeHtml(message)}</p>
        <a href="wiki-home.html" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-home"></i> Return to Home
        </a>
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