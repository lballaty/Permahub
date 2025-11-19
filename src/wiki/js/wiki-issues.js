/**
 * Wiki Issues - Bug Tracking and Feature Requests
 * Allows registered users to report issues and track their resolution
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../js/version-manager.js"';

// State
let allIssues = [];
let currentTab = 'all';
let currentUserId = null;

// TODO: Replace with actual authenticated user ID when auth is implemented
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Issues ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionBadge();

  // Set current user (mock for now)
  currentUserId = MOCK_USER_ID;

  // Collect system information
  collectSystemInfo();

  // Load issues from database
  await loadIssues();

  // Initialize UI
  initializeTabs();
  initializeFilters();
  initializeIssueForm();
  initializeTypeSelector();
  initializeSeveritySelector();
  initializeScreenshot();
  initializeLogFileHandling();

  console.log(`✅ Wiki Issues ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Load issues from database
 */
async function loadIssues() {
  try {
    console.log('🐛 Loading issues from database...');

    allIssues = await supabase.getAll('wiki_issues', {
      order: 'created_at.desc'
    });

    console.log(`✅ Loaded ${allIssues.length} issues`);

    // If no issues exist, create sample issues for testing
    if (allIssues.length === 0) {
      await createSampleIssues();
      allIssues = await supabase.getAll('wiki_issues', {
        order: 'created_at.desc'
      });
    }

    // Load votes for current user
    await loadUserVotes();

    // Update statistics
    updateStatistics();

    // Render issues list
    renderIssues();

  } catch (error) {
    console.error('❌ Error loading issues:', error);
    showError('Failed to load issues. Please refresh the page.');
  }
}

/**
 * Create sample issues for testing
 */
async function createSampleIssues() {
  const sampleIssues = [
    {
      title: 'Search not filtering events correctly',
      description: 'When searching for events on the events page, the search function does not filter results. All events remain visible regardless of the search term entered.',
      issue_type: 'bug',
      severity: 'medium',
      status: 'open',
      page_url: '/wiki-events.html',
      reported_by: MOCK_USER_ID,
      version: VERSION_DISPLAY,
      upvotes: 3
    },
    {
      title: 'Add dark mode support',
      description: 'It would be great to have a dark mode toggle for better readability in low-light conditions. This would help reduce eye strain during evening use.',
      issue_type: 'feature',
      severity: 'low',
      status: 'open',
      page_url: '/wiki-home.html',
      reported_by: MOCK_USER_ID,
      version: VERSION_DISPLAY,
      upvotes: 7
    },
    {
      title: 'Map loads slowly with many locations',
      description: 'When there are more than 50 locations, the map page takes several seconds to load and becomes sluggish when zooming or panning.',
      issue_type: 'performance',
      severity: 'high',
      status: 'in_progress',
      page_url: '/wiki-map.html',
      reported_by: MOCK_USER_ID,
      version: VERSION_DISPLAY,
      upvotes: 5
    }
  ];

  for (const issue of sampleIssues) {
    await supabase.create('wiki_issues', issue);
  }

  console.log('✅ Created sample issues for testing');
}

/**
 * Load user's votes
 */
async function loadUserVotes() {
  try {
    const votes = await supabase.getAll('wiki_issue_votes', {
      where: 'user_id',
      operator: 'eq',
      value: currentUserId
    });

    // Mark issues that user has voted on
    allIssues.forEach(issue => {
      issue.userVoted = votes.some(v => v.issue_id === issue.id);
    });

  } catch (error) {
    console.error('Error loading user votes:', error);
  }
}

/**
 * Update statistics
 */
function updateStatistics() {
  const stats = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    total: allIssues.length
  };

  allIssues.forEach(issue => {
    if (issue.status === 'open') stats.open++;
    else if (issue.status === 'in_progress') stats.in_progress++;
    else if (issue.status === 'resolved') stats.resolved++;
  });

  document.getElementById('openCount').textContent = stats.open;
  document.getElementById('progressCount').textContent = stats.in_progress;
  document.getElementById('resolvedCount').textContent = stats.resolved;
  document.getElementById('totalCount').textContent = stats.total;
}

/**
 * Render issues list
 */
function renderIssues() {
  const container = document.getElementById('issuesList');
  if (!container) return;

  // Filter issues based on current tab and filters
  let filteredIssues = [...allIssues];

  // Tab filter
  if (currentTab === 'my') {
    filteredIssues = filteredIssues.filter(i => i.reported_by === currentUserId);
  } else if (currentTab === 'bugs') {
    filteredIssues = filteredIssues.filter(i => i.issue_type === 'bug');
  } else if (currentTab === 'features') {
    filteredIssues = filteredIssues.filter(i => i.issue_type === 'feature');
  } else if (currentTab === 'resolved') {
    filteredIssues = filteredIssues.filter(i => i.status === 'resolved' || i.status === 'closed');
  }

  // Apply additional filters
  const severityFilter = document.getElementById('filterSeverity')?.value;
  const statusFilter = document.getElementById('filterStatus')?.value;
  const searchQuery = document.getElementById('searchIssues')?.value.toLowerCase();

  if (severityFilter) {
    filteredIssues = filteredIssues.filter(i => i.severity === severityFilter);
  }

  if (statusFilter) {
    filteredIssues = filteredIssues.filter(i => i.status === statusFilter);
  }

  if (searchQuery) {
    filteredIssues = filteredIssues.filter(i =>
      i.title.toLowerCase().includes(searchQuery) ||
      i.description.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  const sortBy = document.getElementById('sortBy')?.value || 'newest';
  filteredIssues.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'most-voted') return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortBy === 'severity') {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, trivial: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return 0;
  });

  // Render
  if (filteredIssues.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <i class="fas fa-inbox" style="font-size: 3rem; color: var(--wiki-text-muted);"></i>
        <h3 style="color: var(--wiki-text-muted); margin-top: 1rem;">No issues found</h3>
        <p class="text-muted">Try adjusting your filters or report a new issue</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredIssues.map(issue => `
    <div class="card issue-list-item" onclick="showIssueDetail('${issue.id}')" style="cursor: pointer;">
      <div class="flex-between" style="align-items: start;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            ${getIssueIcon(issue.issue_type)}
            <h3 style="margin: 0; flex: 1;">${escapeHtml(issue.title)}</h3>
            <span class="issue-status status-${issue.status}">${formatStatus(issue.status)}</span>
          </div>
          <p class="text-muted" style="margin-bottom: 1rem;">
            ${escapeHtml(issue.description).substring(0, 150)}${issue.description.length > 150 ? '...' : ''}
          </p>
          <div style="display: flex; gap: 2rem; font-size: 0.9rem; color: var(--wiki-text-muted);">
            <span>
              <i class="fas fa-flag severity-${issue.severity}"></i>
              ${capitalizeFirst(issue.severity || 'medium')}
            </span>
            <span>
              <i class="fas fa-clock"></i>
              ${timeAgo(issue.created_at)}
            </span>
            ${issue.page_url ? `
              <span>
                <i class="fas fa-link"></i>
                ${escapeHtml(issue.page_url)}
              </span>
            ` : ''}
          </div>
        </div>
        <button class="upvote-btn ${issue.userVoted ? 'voted' : ''}"
                onclick="event.stopPropagation(); toggleVote('${issue.id}')">
          <i class="fas fa-arrow-up"></i>
          <span>${issue.upvotes || 0}</span>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Initialize tabs
 */
function initializeTabs() {
  const tabs = document.querySelectorAll('.issue-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      currentTab = this.dataset.tab;
      renderIssues();
    });
  });
}

/**
 * Initialize filters
 */
function initializeFilters() {
  const filters = ['filterSeverity', 'filterStatus', 'sortBy', 'searchIssues'];

  filters.forEach(filterId => {
    const element = document.getElementById(filterId);
    if (element) {
      element.addEventListener(element.tagName === 'INPUT' ? 'input' : 'change', renderIssues);
    }
  });
}

/**
 * Initialize issue form
 */
function initializeIssueForm() {
  const form = document.getElementById('issueForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await submitIssue();
  });
}

/**
 * Initialize type selector
 */
function initializeTypeSelector() {
  const typeCards = document.querySelectorAll('.issue-type-card');

  typeCards.forEach(card => {
    card.addEventListener('click', function() {
      typeCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('issueType').value = this.dataset.type;
    });
  });
}

/**
 * Initialize severity selector
 */
function initializeSeveritySelector() {
  const severityOptions = document.querySelectorAll('.severity-option');

  severityOptions.forEach(option => {
    option.addEventListener('click', function() {
      severityOptions.forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('issueSeverity').value = this.dataset.severity;
    });
  });
}

/**
 * Initialize screenshot upload
 */
function initializeScreenshot() {
  const screenshotInput = document.getElementById('screenshot');
  const preview = document.getElementById('screenshotPreview');

  if (!screenshotInput) return;

  screenshotInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
}

/**
 * Initialize log file handling with drag & drop
 */
function initializeLogFileHandling() {
  const logFileInput = document.getElementById('logFile');
  const logFileDropZone = document.getElementById('logFileDropZone');
  const logFilePreview = document.getElementById('logFilePreview');
  const logFileName = document.getElementById('logFileName');

  if (!logFileInput || !logFileDropZone) return;

  // File input change handler
  logFileInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      handleLogFile(e.target.files[0]);
    }
  });

  // Drag & drop handlers
  logFileDropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = 'var(--wiki-bg-secondary)';
    this.style.borderColor = 'var(--wiki-primary)';
  });

  logFileDropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = 'transparent';
    this.style.borderColor = 'var(--wiki-border)';
  });

  logFileDropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = 'transparent';
    this.style.borderColor = 'var(--wiki-border)';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Check file type
      if (file.name.match(/\.(log|txt|json)$/i)) {
        logFileInput.files = files;
        handleLogFile(file);
      } else {
        alert('Please upload a .log, .txt, or .json file');
      }
    }
  });

  // Handle log file display
  function handleLogFile(file) {
    logFileName.textContent = file.name;
    logFilePreview.style.display = 'block';

    // If file is small enough, preview its content
    if (file.size < 100000) { // Less than 100KB
      readFileAsText(file).then(content => {
        // Optionally show preview of file content
        const preview = content.substring(0, 200);
        console.log('Log file preview:', preview + (content.length > 200 ? '...' : ''));
      });
    }
  }
}

/**
 * Read file as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Remove log file
 */
window.removeLogFile = function() {
  const logFileInput = document.getElementById('logFile');
  const logFilePreview = document.getElementById('logFilePreview');

  if (logFileInput) {
    logFileInput.value = '';
  }
  if (logFilePreview) {
    logFilePreview.style.display = 'none';
  }
}

/**
 * Collect system information
 */
function collectSystemInfo() {
  // Browser info
  const browserInfo = navigator.userAgent;
  document.getElementById('browserInfo').textContent = getBrowserName(browserInfo);

  // Screen info
  const screenInfo = `${screen.width}x${screen.height}`;
  document.getElementById('screenInfo').textContent = screenInfo;

  // Platform info
  const platformInfo = navigator.platform || 'Unknown';
  document.getElementById('platformInfo').textContent = platformInfo;
}

/**
 * Get browser name from user agent
 */
function getBrowserName(userAgent) {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

/**
 * Show report form
 */
window.showReportForm = function() {
  document.getElementById('reportModal').style.display = 'block';
  // Auto-fill current page URL
  document.getElementById('pageUrl').value = window.location.pathname;
};

/**
 * Hide report form
 */
window.hideReportForm = function() {
  document.getElementById('reportModal').style.display = 'none';
  document.getElementById('issueForm').reset();
  document.getElementById('screenshotPreview').style.display = 'none';
};

/**
 * Submit issue
 */
async function submitIssue() {
  try {
    const issueData = {
      title: document.getElementById('issueTitle').value,
      description: document.getElementById('issueDescription').value,
      issue_type: document.getElementById('issueType').value,
      severity: document.getElementById('issueSeverity').value,
      page_url: document.getElementById('pageUrl').value,
      browser_info: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      device_type: navigator.platform,
      reported_by: currentUserId,
      version: VERSION_DISPLAY,
      status: 'open'
    };

    // Add error logs if provided
    const errorLogs = document.getElementById('errorLogs').value.trim();
    if (errorLogs) {
      issueData.error_logs = errorLogs;
    }

    // Handle log file if provided
    const logFileInput = document.getElementById('logFile');
    if (logFileInput.files && logFileInput.files[0]) {
      const logFile = logFileInput.files[0];
      const logContent = await readFileAsText(logFile);
      issueData.log_file_content = logContent;
      issueData.log_file_name = logFile.name;
    }

    // Handle screenshot if provided
    const screenshotInput = document.getElementById('screenshot');
    if (screenshotInput.files && screenshotInput.files[0]) {
      // Convert to base64 for now (in production, upload to storage)
      const reader = new FileReader();
      reader.onload = async function(e) {
        issueData.screenshot_url = e.target.result;
        await saveIssue(issueData);
      };
      reader.readAsDataURL(screenshotInput.files[0]);
    } else {
      await saveIssue(issueData);
    }

  } catch (error) {
    console.error('Error submitting issue:', error);
    alert('Failed to submit issue. Please try again.');
  }
}

/**
 * Save issue to database
 */
async function saveIssue(issueData) {
  try {
    await supabase.create('wiki_issues', issueData);

    alert('✅ Issue reported successfully! Thank you for your feedback.');
    hideReportForm();

    // Reload issues
    await loadIssues();

  } catch (error) {
    console.error('Error saving issue:', error);
    alert('Failed to save issue. Please try again.');
  }
}

/**
 * Toggle vote on issue
 */
window.toggleVote = async function(issueId) {
  try {
    const issue = allIssues.find(i => i.id === issueId);
    if (!issue) return;

    // Toggle vote in database (would use the upvote_issue function)
    if (issue.userVoted) {
      // Remove vote
      await supabase.delete('wiki_issue_votes', {
        issue_id: issueId,
        user_id: currentUserId
      });
      issue.upvotes = Math.max(0, (issue.upvotes || 0) - 1);
      issue.userVoted = false;
    } else {
      // Add vote
      await supabase.create('wiki_issue_votes', {
        issue_id: issueId,
        user_id: currentUserId
      });
      issue.upvotes = (issue.upvotes || 0) + 1;
      issue.userVoted = true;
    }

    // Update UI
    renderIssues();

  } catch (error) {
    console.error('Error toggling vote:', error);
  }
};

/**
 * Show issue detail
 */
window.showIssueDetail = async function(issueId) {
  const issue = allIssues.find(i => i.id === issueId);
  if (!issue) return;

  const modal = document.getElementById('issueDetailModal');
  const content = document.getElementById('issueDetailContent');

  content.innerHTML = `
    <div class="flex-between mb-3">
      <h2>${getIssueIcon(issue.issue_type)} ${escapeHtml(issue.title)}</h2>
      <button class="btn btn-outline btn-small" onclick="hideIssueDetail()">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div style="display: flex; gap: 2rem; margin-bottom: 2rem;">
      <span class="issue-status status-${issue.status}">${formatStatus(issue.status)}</span>
      <span class="severity-${issue.severity}">
        <i class="fas fa-flag"></i> ${capitalizeFirst(issue.severity || 'medium')}
      </span>
      <span class="text-muted">
        <i class="fas fa-clock"></i> ${new Date(issue.created_at).toLocaleDateString()}
      </span>
      <button class="upvote-btn ${issue.userVoted ? 'voted' : ''}" onclick="toggleVote('${issue.id}')">
        <i class="fas fa-arrow-up"></i> ${issue.upvotes || 0}
      </button>
    </div>

    <div class="card" style="background: var(--wiki-bg-secondary);">
      <h3>Description</h3>
      <p>${escapeHtml(issue.description)}</p>

      ${issue.screenshot_url ? `
        <h3>Screenshot</h3>
        <img src="${issue.screenshot_url}" style="max-width: 100%; border-radius: 8px;">
      ` : ''}

      ${issue.page_url ? `
        <p><strong>Page:</strong> <a href="${escapeHtml(issue.page_url)}">${escapeHtml(issue.page_url)}</a></p>
      ` : ''}

      <p><strong>Version:</strong> ${escapeHtml(issue.version || 'Unknown')}</p>
      <p><strong>Browser:</strong> ${getBrowserName(issue.browser_info || '')}</p>
    </div>

    <div style="margin-top: 2rem;">
      <h3>Comments</h3>
      <div id="issueComments">
        <!-- Comments would be loaded here -->
        <p class="text-muted">No comments yet. Be the first to comment!</p>
      </div>

      <div class="card" style="margin-top: 1rem;">
        <textarea class="form-input" placeholder="Add a comment..." rows="3"></textarea>
        <button class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-comment"></i> Post Comment
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'block';
};

/**
 * Hide issue detail
 */
window.hideIssueDetail = function() {
  document.getElementById('issueDetailModal').style.display = 'none';
};

/**
 * Get issue type icon
 */
function getIssueIcon(type) {
  const icons = {
    bug: '<i class="fas fa-bug" style="color: #d32f2f;"></i>',
    feature: '<i class="fas fa-star" style="color: #fbc02d;"></i>',
    improvement: '<i class="fas fa-lightbulb" style="color: #689f38;"></i>',
    ui: '<i class="fas fa-palette" style="color: #7b1fa2;"></i>',
    performance: '<i class="fas fa-tachometer-alt" style="color: #f57c00;"></i>',
    security: '<i class="fas fa-shield-alt" style="color: #0277bd;"></i>',
    other: '<i class="fas fa-question-circle" style="color: #616161;"></i>'
  };
  return icons[type] || icons.other;
}

/**
 * Format status
 */
function formatStatus(status) {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Time ago helper
 */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

/**
 * Show error
 */
function showError(message) {
  const container = document.getElementById('issuesList');
  if (container) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946;"></i>
        <h3 style="color: var(--wiki-text-muted); margin-top: 1rem;">Error</h3>
        <p class="text-muted">${escapeHtml(message)}</p>
      </div>
    `;
  }
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}