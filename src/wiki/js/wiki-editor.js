/**
 * Wiki Editor - Create and Edit Content
 * Supports creating guides, events, and locations with rich text editing and image uploads
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../../js/version-manager.js";

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

// State
let currentContentType = 'guide';
let editingContentId = null;
let quillEditor = null;
let selectedCategories = [];
let uploadedImagePath = null;

// TODO: Replace with actual authenticated user ID when auth is implemented
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Editor ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionBadge();

  // Check authentication status
  const user = await supabase.getCurrentUser();
  const authToken = localStorage.getItem('auth_token');
  const isAuthenticated = !!(user || authToken);

  if (!isAuthenticated) {
    console.log('⚠️ User is not authenticated - showing read-only editor with banner');
  } else {
    console.log('✅ User is authenticated - loading full editor');
  }

  // Check if we're editing existing content
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const contentType = urlParams.get('type') || 'guide';

  currentContentType = contentType;

  // Initialize Quill editor
  initializeQuillEditor();

  // Load categories
  await loadCategories();

  // Initialize content type selector
  initializeContentTypeSelector();

  // Initialize form handlers
  initializeFormHandlers();

  // Initialize image upload
  initializeImageUpload();

  // If not authenticated, show banner and disable save/publish functionality
  if (!isAuthenticated) {
    showAuthBanner();
    disableSaveFunctionality();
  }

  // If editing, load existing content
  if (slug) {
    await loadExistingContent(slug);
  }

  console.log(`✅ Wiki Editor ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Initialize Quill Rich Text Editor
 */
function initializeQuillEditor() {
  if (typeof Quill === 'undefined') {
    console.error('❌ Quill editor not loaded');
    return;
  }

  quillEditor = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['clean']
      ]
    },
    placeholder: 'Start writing your content here...'
  });

  // Update character count
  quillEditor.on('text-change', function() {
    const text = quillEditor.getText();
    const charCount = text.length - 1; // Quill adds a trailing newline
    document.getElementById('charCount').textContent = charCount;
  });

  console.log('✅ Quill editor initialized');
}

/**
 * Load categories from database
 */
async function loadCategories() {
  try {
    console.log('📁 Loading categories...');

    const categories = await supabase.getAll('wiki_categories', {
      order: 'name.asc'
    });

    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    // Render category checkboxes
    container.innerHTML = categories.map(cat => {
      const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
      return `
      <label style="display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem;">
        <input type="checkbox" value="${cat.id}" data-slug="${cat.slug}" class="category-checkbox">
        ${cat.icon || ''} ${translatedName}
      </label>
    `;
    }).join('');

    console.log(`✅ Loaded ${categories.length} categories`);

  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Initialize content type selector
 */
function initializeContentTypeSelector() {
  // Look for radio buttons instead of select dropdown
  const contentTypeRadios = document.querySelectorAll('input[name="contentType"]');

  if (contentTypeRadios.length === 0) {
    console.warn('⚠️ No content type radio buttons found!');
    return;
  }

  // Get the currently checked radio button
  const checkedRadio = document.querySelector('input[name="contentType"]:checked');
  if (checkedRadio) {
    currentContentType = checkedRadio.value;
  }

  // Add change listeners to all radio buttons
  contentTypeRadios.forEach((radio) => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        currentContentType = this.value;
        console.log(`🔄 Content type changed to: ${currentContentType}`);
        updateFormFields();
      }
    });
  });

  // Initial form update
  updateFormFields();
}

/**
 * Update form fields based on content type
 */
function updateFormFields() {
  const eventFields = document.getElementById('eventFields');
  const locationFields = document.getElementById('locationFields');
  const wikipediaFields = document.getElementById('wikipediaFields');

  // Hide all type-specific fields first
  if (eventFields) eventFields.style.display = 'none';
  if (locationFields) locationFields.style.display = 'none';
  if (wikipediaFields) wikipediaFields.style.display = 'none';

  // Show relevant fields
  if (currentContentType === 'event' && eventFields) {
    eventFields.style.display = 'block';
  } else if (currentContentType === 'location' && locationFields) {
    locationFields.style.display = 'block';
  } else if (currentContentType === 'guide' && wikipediaFields) {
    wikipediaFields.style.display = 'block';
    initializeWikipediaHandlers();
  }

  // Update form title
  const formTitle = document.querySelector('h1');
  if (formTitle) {
    if (editingContentId) {
      formTitle.innerHTML = `<i class="fas fa-edit"></i> Edit ${capitalizeFirst(currentContentType)}`;
    } else {
      formTitle.innerHTML = `<i class="fas fa-plus"></i> Create New ${capitalizeFirst(currentContentType)}`;
    }
  }
}

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
  const form = document.getElementById('editorForm');
  if (!form) return;

  // Main form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await saveContent();
  });

  // Save button (unified - reads status from dropdown)
  const saveBtns = document.querySelectorAll('#saveBtn');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      await saveContent();
    });
  });

  // Delete button
  const deleteBtn = document.getElementById('deleteBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await deleteContent();
    });
  }

  // Preview button
  const previewBtn = document.getElementById('previewBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
      showPreview();
    });
  }

  // Status dropdown change handler - update badge
  const statusSelect = document.getElementById('statusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', function() {
      updateStatusBadge();
    });
  }

  // Auto-generate slug from title
  const titleInput = document.getElementById('title');
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      if (!editingContentId) { // Only auto-generate for new content
        const slug = generateSlug(this.value);
        // Store slug internally (we don't have a slug field in the UI)
        titleInput.dataset.slug = slug;
      }
    });
  }
}

/**
 * Initialize image upload
 */
function initializeImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const removeImage = document.getElementById('removeImage');

  if (!imageUpload) return;

  imageUpload.addEventListener('change', async function(e) {
    if (this.files && this.files[0]) {
      const file = this.files[0];

      // Validate file
      if (!validateImageFile(file)) {
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage (when implemented)
      // For now, we'll store it as base64 in the featured_image field
      uploadedImagePath = await uploadImage(file);
    }
  });

  if (removeImage) {
    removeImage.addEventListener('click', function() {
      imageUpload.value = '';
      imagePreview.style.display = 'none';
      previewImg.src = '';
      uploadedImagePath = null;
    });
  }
}

/**
 * Validate image file
 */
function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    alert('Image file size must be less than 5MB');
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    alert('Only JPEG, PNG, GIF, and WebP images are allowed');
    return false;
  }

  return true;
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(file) {
  try {
    console.log('📤 Uploading image...');

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `${currentContentType}s/temp/${filename}`;

    // For now, return a data URL since we don't have storage configured yet
    // In production, this would upload to Supabase Storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        console.log('✅ Image prepared for upload');
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    // TODO: When Supabase Storage is configured:
    // const { data, error } = await supabase.storage
    //   .from('wiki-images')
    //   .upload(path, file);
    // if (error) throw error;
    // return data.path;

  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image. Please try again.');
    return null;
  }
}

/**
 * Save content to database
 */
async function saveContent() {
  try {
    // Get status from dropdown
    const statusSelect = document.getElementById('statusSelect');
    const status = statusSelect ? statusSelect.value : 'draft';

    console.log(`💾 Saving ${currentContentType} as ${status}...`);

    // Show loading state
    showLoadingState(true);

    // Get form data
    const title = document.getElementById('title')?.value?.trim();
    const summary = document.getElementById('summary')?.value?.trim();
    const content = quillEditor.root.innerHTML;
    const slug = document.getElementById('title')?.dataset?.slug || generateSlug(title);

    // Get selected categories
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');
    selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

    // Comprehensive validation
    const validationErrors = [];

    // Required fields validation based on content type
    if (!title) {
      validationErrors.push('Title is required');
    }

    if (!slug) {
      validationErrors.push('Unable to generate slug from title');
    }

    if (currentContentType === 'guide') {
      if (!summary) {
        validationErrors.push('Summary is required for guides');
      }
      if (!content || quillEditor.getText().trim().length < 10) {
        validationErrors.push('Content must be at least 10 characters');
      }
    } else if (currentContentType === 'event') {
      const eventDate = document.getElementById('eventDate')?.value;
      if (!eventDate) {
        validationErrors.push('Event date is required');
      }
      if (!summary && !content) {
        validationErrors.push('Event description is required');
      }
    } else if (currentContentType === 'location') {
      const latitude = document.getElementById('latitude')?.value;
      const longitude = document.getElementById('longitude')?.value;
      if (!latitude || !longitude) {
        validationErrors.push('Location coordinates (latitude and longitude) are required');
      }
      if (latitude && (latitude < -90 || latitude > 90)) {
        validationErrors.push('Latitude must be between -90 and 90');
      }
      if (longitude && (longitude < -180 || longitude > 180)) {
        validationErrors.push('Longitude must be between -180 and 180');
      }
      if (!summary) {
        validationErrors.push('Description is required for locations');
      }
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      showValidationErrors(validationErrors);
      showLoadingState(false);
      return;
    }

    let savedContentId;

    // Save based on content type
    if (currentContentType === 'guide') {
      savedContentId = await saveGuide({
        title,
        slug,
        summary,
        content,
        status,
        featured_image: uploadedImagePath
      });
    } else if (currentContentType === 'event') {
      savedContentId = await saveEvent({
        title,
        slug,
        summary,
        description: content,
        status,
        featured_image: uploadedImagePath,
        date: document.getElementById('eventDate')?.value,
        time: document.getElementById('startTime')?.value,
        end_time: document.getElementById('endTime')?.value,
        location: document.getElementById('eventLocation')?.value
      });
    } else if (currentContentType === 'location') {
      savedContentId = await saveLocation({
        name: title,
        slug,
        description: summary,
        content,
        status,
        featured_image: uploadedImagePath,
        address: document.getElementById('address')?.value,
        latitude: parseFloat(document.getElementById('latitude')?.value) || null,
        longitude: parseFloat(document.getElementById('longitude')?.value) || null
      });
    }

    // Save category associations
    if (savedContentId && selectedCategories.length > 0) {
      await saveCategoryAssociations(savedContentId);
    }

    // Show success message
    const message = status === 'publish'
      ? `✅ ${capitalizeFirst(currentContentType)} published successfully!`
      : `✅ Draft saved successfully!`;

    alert(message);

    // Redirect to view page if published
    if (status === 'publish') {
      if (currentContentType === 'guide') {
        window.location.href = `wiki-page.html?slug=${slug}`;
      } else if (currentContentType === 'event') {
        window.location.href = 'wiki-events.html';
      } else if (currentContentType === 'location') {
        window.location.href = `wiki-map.html#location-${savedContentId}`;
      }
    }

  } catch (error) {
    console.error('Error saving content:', error);
    showLoadingState(false);

    // Parse and show specific error messages
    let errorMessage = 'Failed to save. ';

    if (error.response?.data?.message) {
      errorMessage += error.response.data.message;
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please check your input and try again.';
    }

    showErrorMessage(errorMessage);
  }
}

/**
 * Save guide to database
 */
async function saveGuide(data) {
  // Get Wikipedia data
  const wikipediaUrl = document.getElementById('wikipediaUrl')?.value;
  const wikipediaSummary = document.getElementById('wikipediaSummary')?.value;
  const wikipediaVerified = document.getElementById('wikipediaUrl')?.dataset.verified === 'true';

  const guideData = {
    ...data,
    author_id: MOCK_USER_ID,
    published_at: data.status === 'published' ? new Date().toISOString() : null,
    allow_comments: document.getElementById('allowComments')?.checked,
    allow_edits: document.getElementById('allowEdits')?.checked,
    notify_group: document.getElementById('notifyGroup')?.checked,
    // Add Wikipedia fields
    wikipedia_url: wikipediaUrl || null,
    wikipedia_summary: wikipediaSummary || null,
    wikipedia_verified: wikipediaVerified,
    wikipedia_verified_at: wikipediaVerified ? new Date().toISOString() : null,
    wikipedia_verified_by: wikipediaVerified ? MOCK_USER_ID : null
  };

  if (editingContentId) {
    await supabase.update('wiki_guides', editingContentId, guideData);
    return editingContentId;
  } else {
    const result = await supabase.insert('wiki_guides', guideData);
    return result && result.length > 0 ? result[0].id : null;
  }
}

/**
 * Save event to database
 */
async function saveEvent(data) {
  const eventData = {
    ...data,
    organizer_id: MOCK_USER_ID,
    // Add contact fields
    organizer_name: document.getElementById('organizerName')?.value?.trim() || null,
    organizer_organization: document.getElementById('organizerOrganization')?.value?.trim() || null,
    contact_email: document.getElementById('contactEmail')?.value?.trim() || null,
    contact_phone: document.getElementById('contactPhone')?.value?.trim() || null,
    contact_website: document.getElementById('contactWebsite')?.value?.trim() || null
  };

  if (editingContentId) {
    await supabase.update('wiki_events', editingContentId, eventData);
    return editingContentId;
  } else {
    const result = await supabase.insert('wiki_events', eventData);
    return result && result.length > 0 ? result[0].id : null;
  }
}

/**
 * Save location to database
 */
async function saveLocation(data) {
  const locationData = {
    ...data,
    location_type: 'community', // Default type
    created_by: MOCK_USER_ID,
    // Add contact fields
    contact_name: document.getElementById('locationContactName')?.value?.trim() || null,
    contact_email: document.getElementById('locationContactEmail')?.value?.trim() || null,
    contact_phone: document.getElementById('locationContactPhone')?.value?.trim() || null,
    website: document.getElementById('locationWebsite')?.value?.trim() || null,
    contact_hours: document.getElementById('locationContactHours')?.value?.trim() || null
  };

  if (editingContentId) {
    await supabase.update('wiki_locations', editingContentId, locationData);
    return editingContentId;
  } else {
    const result = await supabase.insert('wiki_locations', locationData);
    return result && result.length > 0 ? result[0].id : null;
  }
}

/**
 * Save category associations
 */
async function saveCategoryAssociations(contentId) {
  try {
    // Only for guides for now (need to create event_categories and location_categories tables)
    if (currentContentType === 'guide') {
      // Delete existing associations if editing
      if (editingContentId) {
        // This would need a delete method in supabase-client.js
        console.log('Would delete existing category associations');
      }

      // Create new associations
      for (const categoryId of selectedCategories) {
        await supabase.insert('wiki_guide_categories', {
          guide_id: contentId,
          category_id: categoryId
        });
      }
    }
  } catch (error) {
    console.error('Error saving category associations:', error);
  }
}

/**
 * Load existing content for editing
 */
async function loadExistingContent(slug) {
  try {
    console.log(`📄 Loading existing ${currentContentType} with slug: ${slug}`);

    let content;

    if (currentContentType === 'guide') {
      const guides = await supabase.getAll('wiki_guides', {
        where: 'slug',
        operator: 'eq',
        value: slug
      });
      content = guides[0];
    } else if (currentContentType === 'event') {
      const events = await supabase.getAll('wiki_events', {
        where: 'slug',
        operator: 'eq',
        value: slug
      });
      content = events[0];
    } else if (currentContentType === 'location') {
      const locations = await supabase.getAll('wiki_locations', {
        where: 'slug',
        operator: 'eq',
        value: slug
      });
      content = locations[0];
    }

    if (!content) {
      console.error('Content not found');
      alert('Content not found');
      return;
    }

    editingContentId = content.id;

    // Populate form fields
    document.getElementById('title').value = content.title || content.name;
    document.getElementById('summary').value = content.summary || content.description;

    // Set content in Quill
    if (content.content) {
      quillEditor.root.innerHTML = content.content;
    }

    // Load type-specific fields
    if (currentContentType === 'event') {
      if (content.date) document.getElementById('eventDate').value = content.date;
      if (content.time) document.getElementById('startTime').value = content.time;
      if (content.end_time) document.getElementById('endTime').value = content.end_time;
      if (content.location) document.getElementById('eventLocation').value = content.location;
      // Load contact fields
      if (content.organizer_name) document.getElementById('organizerName').value = content.organizer_name;
      if (content.organizer_organization) document.getElementById('organizerOrganization').value = content.organizer_organization;
      if (content.contact_email) document.getElementById('contactEmail').value = content.contact_email;
      if (content.contact_phone) document.getElementById('contactPhone').value = content.contact_phone;
      if (content.contact_website) document.getElementById('contactWebsite').value = content.contact_website;
    } else if (currentContentType === 'location') {
      if (content.address) document.getElementById('address').value = content.address;
      if (content.latitude) document.getElementById('latitude').value = content.latitude;
      if (content.longitude) document.getElementById('longitude').value = content.longitude;
      // Load contact fields
      if (content.contact_name) document.getElementById('locationContactName').value = content.contact_name;
      if (content.contact_email) document.getElementById('locationContactEmail').value = content.contact_email;
      if (content.contact_phone) document.getElementById('locationContactPhone').value = content.contact_phone;
      if (content.website) document.getElementById('locationWebsite').value = content.website;
      if (content.contact_hours) document.getElementById('locationContactHours').value = content.contact_hours;
    }

    // Load image if exists
    if (content.featured_image) {
      document.getElementById('previewImg').src = content.featured_image;
      document.getElementById('imagePreview').style.display = 'block';
      uploadedImagePath = content.featured_image;
    }

    // Load categories (for guides)
    if (currentContentType === 'guide') {
      const guideCats = await supabase.getAll('wiki_guide_categories', {
        where: 'guide_id',
        operator: 'eq',
        value: content.id
      });

      guideCats.forEach(gc => {
        const checkbox = document.querySelector(`.category-checkbox[value="${gc.category_id}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    // Update form title
    updateFormFields();

    // Show editing controls (status badge and delete button)
    showEditingControls(content.status);

    console.log('✅ Content loaded for editing');

  } catch (error) {
    console.error('Error loading content:', error);
    alert('Failed to load content for editing');
  }
}

/**
 * Initialize Wikipedia handlers
 */
function initializeWikipediaHandlers() {
  const wikipediaUrl = document.getElementById('wikipediaUrl');
  const verifyBtn = document.getElementById('verifyWikipedia');
  const fetchSummaryBtn = document.getElementById('fetchWikipediaSummary');
  const verificationDiv = document.getElementById('wikipediaVerification');
  const verifiedStatus = document.getElementById('wikipediaVerifiedStatus');
  const summaryBox = document.getElementById('wikipediaSummaryBox');

  if (!wikipediaUrl) return;

  // Show/hide verification section when URL is entered
  wikipediaUrl.addEventListener('input', function() {
    if (this.value && this.value.match(/https:\/\/.*\.wikipedia\.org\/wiki\/.*/)) {
      verificationDiv.style.display = 'block';
      verifiedStatus.style.display = 'none';
    } else {
      verificationDiv.style.display = 'none';
      verifiedStatus.style.display = 'none';
    }
  });

  // Verify Wikipedia link
  if (verifyBtn) {
    verifyBtn.addEventListener('click', async function() {
      const url = wikipediaUrl.value;
      if (!url) return;

      try {
        // Extract article name from URL
        const articleName = url.split('/wiki/')[1];

        // For now, just mark as verified (in production, would validate the URL)
        verifiedStatus.style.display = 'block';
        verificationDiv.querySelector('.fas.fa-exclamation-triangle').parentElement.parentElement.style.display = 'none';

        // Store verification status
        wikipediaUrl.dataset.verified = 'true';
        wikipediaUrl.dataset.verifiedAt = new Date().toISOString();

        console.log('✅ Wikipedia link verified:', articleName);
      } catch (error) {
        console.error('Error verifying Wikipedia link:', error);
        alert('Failed to verify Wikipedia link. Please check the URL.');
      }
    });
  }

  // Fetch Wikipedia summary
  if (fetchSummaryBtn) {
    fetchSummaryBtn.addEventListener('click', async function() {
      const url = wikipediaUrl.value;
      if (!url) return;

      try {
        // Extract article name from URL
        const articleName = url.split('/wiki/')[1];
        const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${articleName}`;

        // Note: This would need CORS handling in production
        console.log('📖 Fetching Wikipedia summary for:', articleName);

        // For now, show the summary box with a placeholder
        summaryBox.style.display = 'block';
        document.getElementById('wikipediaSummary').value =
          `Summary of "${decodeURIComponent(articleName)}" from Wikipedia. (Note: In production, this would fetch actual content via a backend API to avoid CORS issues)`;

      } catch (error) {
        console.error('Error fetching Wikipedia summary:', error);
        alert('Failed to fetch Wikipedia summary. You can add it manually.');
        summaryBox.style.display = 'block';
      }
    });
  }
}

/**
 * Show preview of content
 */
function showPreview() {
  const title = document.getElementById('title').value;
  const summary = document.getElementById('summary').value;
  const content = quillEditor.root.innerHTML;

  // Create preview HTML
  const previewHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: white; border-radius: 8px;">
      <h1>${escapeHtml(title)}</h1>
      <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">${escapeHtml(summary)}</p>
      ${uploadedImagePath ? `<img src="${uploadedImagePath}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">` : ''}
      <div style="line-height: 1.8;">${content}</div>
    </div>
  `;

  // Open preview in new window
  const previewWindow = window.open('', 'preview', 'width=900,height=700');
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview: ${escapeHtml(title)}</title>
      <link rel="stylesheet" href="css/wiki.css">
    </head>
    <body style="background: #f5f5f5; padding: 2rem;">
      ${previewHTML}
    </body>
    </html>
  `);
}

/**
 * Generate slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

/**
 * Show validation errors to user
 */
function showValidationErrors(errors) {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f8d7da;
    color: #721c24;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
    max-width: 400px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  errorContainer.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 0.5rem;">
      <i class="fas fa-exclamation-triangle"></i> Please fix the following errors:
    </div>
    <ul style="margin: 0; padding-left: 1.5rem;">
      ${errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}
    </ul>
    <button onclick="this.parentElement.remove()" style="
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #721c24;
    ">&times;</button>
  `;

  // Remove any existing error container
  const existing = document.querySelector('[data-error-container]');
  if (existing) existing.remove();

  errorContainer.setAttribute('data-error-container', 'true');
  document.body.appendChild(errorContainer);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (errorContainer.parentElement) {
      errorContainer.remove();
    }
  }, 10000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  showValidationErrors([message]);
}

/**
 * Show/hide loading state
 */
function showLoadingState(show) {
  // Update button states
  const submitButtons = document.querySelectorAll('#publishBtn, #publishBtn2, #saveDraftBtn, #saveDraftBtn2');
  submitButtons.forEach(btn => {
    if (show) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  });

  // Show/hide loading indicator
  if (show) {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'savingIndicator';
    loadingIndicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      text-align: center;
    `;
    loadingIndicator.innerHTML = `
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
      <div>Saving...</div>
    `;
    document.body.appendChild(loadingIndicator);
  } else {
    const indicator = document.getElementById('savingIndicator');
    if (indicator) indicator.remove();
  }
}

/**
 * Show editing controls when editing existing content
 * Displays status badge and delete button
 */
function showEditingControls(currentStatus = 'draft') {
  // Show and update status badge
  const statusBadge = document.getElementById('currentStatusBadge');
  const statusBadgeText = document.getElementById('statusBadgeText');

  if (statusBadge && statusBadgeText) {
    statusBadge.style.display = 'flex';
    statusBadgeText.textContent = capitalizeFirst(currentStatus);

    // Apply appropriate badge class
    statusBadge.className = '';
    statusBadge.classList.add('badge', `badge-${currentStatus}`);
  }

  // Update status dropdown to match current status
  const statusSelect = document.getElementById('statusSelect');
  if (statusSelect) {
    statusSelect.value = currentStatus;
  }

  // Show delete button
  const deleteBtn = document.getElementById('deleteBtn');
  if (deleteBtn) {
    deleteBtn.style.display = 'inline-block';
  }

  console.log(`✅ Editing controls shown for status: ${currentStatus}`);
}

/**
 * Update status badge when dropdown changes
 */
function updateStatusBadge() {
  const statusSelect = document.getElementById('statusSelect');
  const statusBadgeText = document.getElementById('statusBadgeText');
  const statusBadge = document.getElementById('currentStatusBadge');

  if (!statusSelect || !statusBadgeText || !statusBadge) return;

  const newStatus = statusSelect.value;
  statusBadgeText.textContent = capitalizeFirst(newStatus);

  // Update badge class
  statusBadge.className = '';
  statusBadge.classList.add('badge', `badge-${newStatus}`);
}

/**
 * Delete current content with double confirmation
 */
async function deleteContent() {
  if (!editingContentId) {
    alert('No content to delete');
    return;
  }

  try {
    const title = document.getElementById('title')?.value || 'this content';

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

    console.log(`🗑️ Deleting ${currentContentType} with ID: ${editingContentId}`);

    // Determine table name based on content type
    const tableName = currentContentType === 'guide' ? 'wiki_guides' :
                     currentContentType === 'event' ? 'wiki_events' :
                     'wiki_locations';

    // Get current user for soft delete tracking
    const user = await supabase.getCurrentUser();
    const userId = user?.id || MOCK_USER_ID;

    // Soft delete the content (allows restore)
    await supabase.softDelete(tableName, editingContentId, userId);

    alert(`✅ ${capitalizeFirst(currentContentType)} deleted successfully!\n\nYou can restore this from your "Deleted Content" page within 30 days.`);

    // Redirect to appropriate listing page
    if (currentContentType === 'guide') {
      window.location.href = 'wiki-guides.html';
    } else if (currentContentType === 'event') {
      window.location.href = 'wiki-events.html';
    } else if (currentContentType === 'location') {
      window.location.href = 'wiki-map.html';
    }

  } catch (error) {
    console.error('Error deleting content:', error);
    alert(`Failed to delete ${currentContentType}. ${error.message || 'Please try again.'}`);
  }
}

/**
 * Show authentication banner at top of editor
 *
 * Business Purpose: Inform unauthenticated users they can explore but not save
 */
function showAuthBanner() {
  const cardHeader = document.querySelector('.card-header');
  if (!cardHeader) return;

  const bannerHTML = `
    <div id="authBanner" style="
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
      padding: 1.25rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    ">
      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <i class="fas fa-exclamation-circle" style="font-size: 1.5rem;"></i>
          <div>
            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">
              You are not logged in
            </div>
            <div style="font-size: 0.95rem; opacity: 0.95;">
              Editing is disabled. You can explore the editor, but you won't be able to save or publish content.
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-shrink: 0;">
          <a href="wiki-login.html" class="btn" style="
            background: white;
            color: #ee5a6f;
            border: none;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            white-space: nowrap;
          ">
            <i class="fas fa-sign-in-alt"></i> Log In
          </a>
          <a href="wiki-signup.html" class="btn" style="
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid white;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            white-space: nowrap;
          ">
            <i class="fas fa-user-plus"></i> Sign Up
          </a>
        </div>
      </div>
    </div>
  `;

  cardHeader.insertAdjacentHTML('beforebegin', bannerHTML);
}

/**
 * Disable save and publish functionality for unauthenticated users
 *
 * Business Purpose: Prevent save attempts that would fail due to backend auth
 */
function disableSaveFunctionality() {
  const publishBtn = document.getElementById('publishBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const previewBtn = document.getElementById('previewBtn');

  // Disable publish button
  if (publishBtn) {
    publishBtn.disabled = true;
    publishBtn.style.opacity = '0.5';
    publishBtn.style.cursor = 'not-allowed';
    publishBtn.title = 'Please log in to publish content';
    publishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      alert('Please log in to publish content');
    }, true);
  }

  // Disable save draft button
  if (saveDraftBtn) {
    saveDraftBtn.disabled = true;
    saveDraftBtn.style.opacity = '0.5';
    saveDraftBtn.style.cursor = 'not-allowed';
    saveDraftBtn.title = 'Please log in to save drafts';
    saveDraftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      alert('Please log in to save drafts');
    }, true);
  }

  // Keep preview button enabled (it's read-only)
  if (previewBtn) {
    previewBtn.title = 'Preview your content (read-only mode)';
  }

  console.log('🔒 Save functionality disabled - user not authenticated');
}