/**
 * Wiki Page - Display Individual Guide from Database
 * Reads slug from URL and fetches the corresponding guide
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

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

    // Fetch author information if author_id exists
    if (currentGuide.author_id) {
      const authors = await supabase.getAll('users', {
        where: 'id',
        operator: 'eq',
        value: currentGuide.author_id
      });
      if (authors.length > 0) {
        currentGuide.author_name = authors[0].full_name;
        console.log(`👤 Guide author: ${currentGuide.author_name}`);
      }
    }

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
  if (!currentGuide) {
    console.error('❌ renderGuide called but currentGuide is null');
    return;
  }

  console.log('🎨 Starting to render guide:', currentGuide.title);

  // Update page title
  document.title = `${currentGuide.title} - Community Wiki`;
  console.log('  ✅ Updated page title');

  // Update breadcrumb (assuming first category for now)
  const breadcrumb = document.querySelector('.wiki-content > div:first-child');
  if (breadcrumb && guideCategories.length > 0) {
    breadcrumb.innerHTML = `
      <a href="wiki-home.html" style="color: var(--wiki-primary);">Home</a> /
      <a href="wiki-home.html?category=${guideCategories[0].slug}" style="color: var(--wiki-primary);">${escapeHtml(guideCategories[0].name)}</a> /
      <span>${escapeHtml(currentGuide.title)}</span>
    `;
    console.log('  ✅ Updated breadcrumb');
  } else {
    console.warn('  ⚠️ Could not find breadcrumb element or no categories');
  }

  // Update title
  const titleElement = document.querySelector('.wiki-content h1');
  if (titleElement) {
    titleElement.textContent = currentGuide.title;
    console.log('  ✅ Updated h1 title to:', currentGuide.title);
  } else {
    console.warn('  ⚠️ Could not find h1 title element');
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
      ${currentGuide.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(currentGuide.author_name)}</span>` : ''}
      <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
      <span><i class="fas fa-clock"></i> ${readTime} min read</span>
      <span><i class="fas fa-eye"></i> ${currentGuide.view_count || 0} views</span>
    `;
    console.log('  ✅ Updated meta information');
  } else {
    console.warn('  ⚠️ Could not find .card-meta element');
  }

  // Update tags
  const tagsElement = document.querySelector('.tags.mt-2');
  if (tagsElement && guideCategories.length > 0) {
    tagsElement.innerHTML = guideCategories.map(cat => {
      const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
      return `<span class="tag">${translatedName}</span>`;
    }).join('');
    console.log('  ✅ Updated tags');
  } else {
    console.warn('  ⚠️ Could not find .tags.mt-2 element or no categories');
  }

  // Update article content
  // Find the article body div (the one with loading spinner)
  const articleDivs = document.querySelectorAll('.wiki-content > div');
  console.log(`  📊 Found ${articleDivs.length} div elements in .wiki-content`);

  // Find the div that contains the loading spinner
  let articleBody = null;
  let foundIndex = -1;
  for (let i = 0; i < articleDivs.length; i++) {
    const div = articleDivs[i];
    if (div.querySelector('.fa-spinner')) {
      articleBody = div;
      foundIndex = i;
      console.log(`  🎯 Found loading spinner in div at index ${i}`);
      break;
    }
  }

  // Fallback to last div if spinner not found
  if (!articleBody) {
    articleBody = articleDivs[articleDivs.length - 1];
    foundIndex = articleDivs.length - 1;
    console.log(`  ⚠️ Spinner not found, using last div at index ${foundIndex}`);
  }

  if (articleBody && currentGuide.content) {
    console.log(`  📝 Replacing content in div at index ${foundIndex}`);

    // Convert markdown to HTML
    const renderedContent = renderMarkdown(currentGuide.content);

    // Replace the entire content (this removes the loading spinner and message)
    articleBody.innerHTML = renderedContent;

    console.log(`  ✅ Updated article body with guide content`);
    console.log(`  📝 Content length: ${renderedContent.length} characters`);
    console.log(`  🔍 Verifying spinner removed:`, articleBody.querySelector('.fa-spinner') === null ? 'YES' : 'NO - STILL THERE!');
  } else {
    console.warn('  ⚠️ Could not find article body element to update');
    console.warn('  articleBody:', articleBody);
    console.warn('  currentGuide.content length:', currentGuide.content?.length);
  }

  // Update edit link
  const editLink = document.querySelector('a[href="wiki-editor.html"]');
  if (editLink) {
    editLink.href = `wiki-editor.html?slug=${currentGuide.slug}`;
    console.log('  ✅ Updated edit link');
  } else {
    console.warn('  ⚠️ Could not find edit link');
  }

  // Check permissions and show/hide edit/delete buttons
  await checkUserPermissions(currentGuide);

  console.log('🎨 Finished rendering guide');

  // Update related guides section if it exists
  updateRelatedGuides();
}

/**
 * Basic markdown to HTML conversion
 */
function renderMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Remove first H1 if present (title already shown in page header)
  html = html.replace(/^# .*$/m, '');

  // Convert headers (H2 and H3 only, no H1)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

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
 * Check if current user has permission to edit/delete this guide
 * Shows or hides edit/delete buttons accordingly
 */
async function checkUserPermissions(guide) {
  try {
    // Get current user
    const user = await supabase.getCurrentUser();
    const authToken = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');

    // Check if user is authenticated
    if (!user && !authToken && !userId) {
      console.log('  ℹ️ User not authenticated - hiding edit/delete buttons');
      hideEditDeleteButtons();
      return;
    }

    // Get user ID (from user object, localStorage, or auth token)
    const currentUserId = user?.id || userId;

    // Check if user is the author
    const isAuthor = currentUserId && guide.author_id === currentUserId;

    if (isAuthor) {
      console.log('  ✅ User is the author - showing edit/delete buttons');
      showDeleteButton();
    } else {
      console.log('  ℹ️ User is not the author - hiding delete button');
      hideDeleteButton();
    }

  } catch (error) {
    console.error('  ❌ Error checking user permissions:', error);
    hideEditDeleteButtons();
  }
}

/**
 * Show delete button
 */
function showDeleteButton() {
  const deleteBtn = document.getElementById('deletePageBtn');
  if (deleteBtn) {
    deleteBtn.style.display = 'inline-block';

    // Add click handler
    deleteBtn.onclick = async function() {
      await deleteGuide();
    };
  }
}

/**
 * Hide delete button
 */
function hideDeleteButton() {
  const deleteBtn = document.getElementById('deletePageBtn');
  if (deleteBtn) {
    deleteBtn.style.display = 'none';
  }
}

/**
 * Hide both edit and delete buttons
 */
function hideEditDeleteButtons() {
  const editBtn = document.getElementById('editPageBtn');
  const deleteBtn = document.getElementById('deletePageBtn');

  if (editBtn) editBtn.style.display = 'none';
  if (deleteBtn) deleteBtn.style.display = 'none';
}

/**
 * Delete current guide with double confirmation
 */
async function deleteGuide() {
  if (!currentGuide) {
    alert('No guide to delete');
    return;
  }

  try {
    const title = currentGuide.title || 'this guide';

    // First confirmation - standard confirm dialog
    const confirmed = confirm(
      `Are you sure you want to delete "${title}"?\n\n` +
      `This action cannot be undone. All data including categories, ` +
      `comments, and associations will be permanently removed.`
    );

    if (!confirmed) {
      console.log('❌ Delete cancelled by user (first confirmation)');
      return;
    }

    // Second confirmation - type "DELETE" to confirm
    const deleteConfirmation = prompt(
      `To confirm deletion, please type DELETE in capital letters:`
    );

    if (deleteConfirmation !== 'DELETE') {
      alert('Deletion cancelled. You must type DELETE exactly to confirm.');
      console.log('❌ Delete cancelled - confirmation text did not match');
      return;
    }

    console.log(`🗑️ Deleting guide with ID: ${currentGuide.id}`);

    // Delete the guide
    await supabase.delete('wiki_guides', currentGuide.id);

    alert(`✅ Guide deleted successfully!`);

    // Redirect to guides listing page
    window.location.href = 'wiki-guides.html';

  } catch (error) {
    console.error('Error deleting guide:', error);
    alert(`Failed to delete guide. ${error.message || 'Please try again.'}`);
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