/**
 * URL Validation Script - Check URL relevancy for events and locations
 *
 * This script:
 * 1. Reads event and location URLs from JSON files
 * 2. Fetches each URL and checks HTTP status
 * 3. Analyzes page content for relevancy (organization name, keywords)
 * 4. Generates detailed validation report with recommendations
 *
 * Usage: node scripts/validate-urls.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const EVENT_URLS_FILE = path.join(__dirname, '../docs/verification/event-urls-for-validation.json');
const LOCATION_URLS_FILE = path.join(__dirname, '../docs/verification/location-urls-for-validation.json');
const REPORT_FILE = path.join(__dirname, '../docs/verification/url-validation-report.md');

// Validation results
const results = {
  events: {
    valid: [],
    invalid: [],
    redirected: [],
    notRelevant: []
  },
  locations: {
    valid: [],
    invalid: [],
    redirected: [],
    notRelevant: []
  },
  stats: {
    totalChecked: 0,
    valid: 0,
    invalid: 0,
    redirected: 0,
    notRelevant: 0
  }
};

/**
 * Fetch URL with redirect tracking
 */
async function fetchURL(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    let redirectCount = 0;
    let finalURL = url;

    const doRequest = (currentURL) => {
      const urlObj = new URL(currentURL);
      const currentClient = urlObj.protocol === 'https:' ? https : http;
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      };

      const req = currentClient.request(currentURL, options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          redirectCount++;

          if (redirectCount > maxRedirects) {
            req.destroy();
            resolve({
              status: res.statusCode,
              finalURL: currentURL,
              redirected: true,
              redirectCount,
              content: '',
              error: 'Too many redirects'
            });
            return;
          }

          // Handle relative redirects
          const redirectURL = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, currentURL).href;

          finalURL = redirectURL;
          req.destroy();

          // Small delay before following redirect
          setTimeout(() => {
            doRequest(redirectURL);
          }, 100);
          return;
        }

        // Collect response body
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
          // Limit data collection to first 50KB
          if (data.length > 50000) {
            req.destroy();
          }
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            finalURL,
            redirected: redirectCount > 0,
            redirectCount,
            content: data,
            contentType: res.headers['content-type'] || ''
          });
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          status: 0,
          finalURL: currentURL,
          redirected: false,
          redirectCount: 0,
          content: '',
          error: 'Request timeout'
        });
      });

      req.on('error', (err) => {
        resolve({
          status: 0,
          finalURL: currentURL,
          redirected: false,
          redirectCount: 0,
          content: '',
          error: err.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 0,
          finalURL: currentURL,
          redirected: false,
          redirectCount: 0,
          content: '',
          error: 'Request timeout'
        });
      });

      req.end();
    };

    doRequest(url);
  });
}

/**
 * Check if URL content is relevant to the item
 */
function checkRelevancy(item, response) {
  const { content, finalURL } = response;

  // Extract text content from HTML (simple approach)
  const textContent = content
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  // Build search terms from item metadata
  const searchTerms = [];

  if (item.title) searchTerms.push(item.title.toLowerCase());
  if (item.name) searchTerms.push(item.name.toLowerCase());
  if (item.organizer_organization) searchTerms.push(item.organizer_organization.toLowerCase());
  if (item.organizer_name) searchTerms.push(item.organizer_name.toLowerCase());

  // Extract domain name
  const domain = new URL(finalURL).hostname.replace('www.', '');

  // Check for matches
  let matches = 0;
  let matchDetails = [];

  for (const term of searchTerms) {
    // Skip very short terms
    if (term.length < 4) continue;

    // Check if term appears in content
    if (textContent.includes(term)) {
      matches++;
      matchDetails.push(`Found "${term}" in content`);
    }

    // Check if term appears in domain
    if (domain.includes(term.replace(/\s+/g, ''))) {
      matches++;
      matchDetails.push(`Found "${term}" in domain`);
    }
  }

  // Check for known irrelevant indicators
  const irrelevantIndicators = [
    'loan', 'credit', 'finance', 'mortgage', 'payday',
    'domain for sale', 'parked domain', 'buy this domain',
    'this domain may be for sale'
  ];

  for (const indicator of irrelevantIndicators) {
    if (textContent.includes(indicator)) {
      matchDetails.push(`⚠️ Found irrelevant indicator: "${indicator}"`);
      return {
        isRelevant: false,
        confidence: 0,
        reason: `Contains irrelevant content: "${indicator}"`,
        matchDetails
      };
    }
  }

  // Calculate confidence score
  const confidence = searchTerms.length > 0 ? (matches / searchTerms.length) * 100 : 0;

  return {
    isRelevant: confidence > 30, // At least 30% match
    confidence: Math.round(confidence),
    reason: matches > 0
      ? `${matches}/${searchTerms.length} search terms found`
      : 'No relevant terms found',
    matchDetails
  };
}

/**
 * Validate a single URL
 */
async function validateURL(item, urlField, type) {
  const url = item[urlField];

  if (!url) {
    return {
      item,
      urlField,
      type,
      status: 'NO_URL',
      message: 'No URL provided'
    };
  }

  console.log(`Checking ${type}: ${item.title || item.name} -> ${url}`);

  try {
    const response = await fetchURL(url);
    results.stats.totalChecked++;

    // Check HTTP status
    if (response.error) {
      results.stats.invalid++;
      return {
        item,
        urlField,
        type,
        status: 'ERROR',
        message: response.error,
        url,
        recommendation: 'FIND_REPLACEMENT'
      };
    }

    if (response.status === 404) {
      results.stats.invalid++;
      return {
        item,
        urlField,
        type,
        status: 'NOT_FOUND',
        message: '404 Not Found',
        url,
        recommendation: 'FIND_REPLACEMENT'
      };
    }

    if (response.status >= 500) {
      results.stats.invalid++;
      return {
        item,
        urlField,
        type,
        status: 'SERVER_ERROR',
        message: `Server error: ${response.status}`,
        url,
        recommendation: 'RECHECK_LATER'
      };
    }

    // Check redirects
    if (response.redirected) {
      const originalDomain = new URL(url).hostname;
      const finalDomain = new URL(response.finalURL).hostname;

      if (originalDomain !== finalDomain) {
        results.stats.redirected++;

        // Check relevancy of final destination
        const relevancy = checkRelevancy(item, response);

        if (!relevancy.isRelevant) {
          results.stats.notRelevant++;
          return {
            item,
            urlField,
            type,
            status: 'REDIRECTED_IRRELEVANT',
            message: `Redirected to unrelated site: ${finalDomain}`,
            url,
            finalURL: response.finalURL,
            relevancy,
            recommendation: 'FIND_REPLACEMENT'
          };
        }

        return {
          item,
          urlField,
          type,
          status: 'REDIRECTED',
          message: `Redirected to ${finalDomain}`,
          url,
          finalURL: response.finalURL,
          relevancy,
          recommendation: 'UPDATE_URL'
        };
      }
    }

    // Check relevancy for valid URLs
    const relevancy = checkRelevancy(item, response);

    if (!relevancy.isRelevant) {
      results.stats.notRelevant++;
      return {
        item,
        urlField,
        type,
        status: 'NOT_RELEVANT',
        message: `Content not relevant: ${relevancy.reason}`,
        url,
        relevancy,
        recommendation: 'FIND_REPLACEMENT'
      };
    }

    // Valid URL
    results.stats.valid++;
    return {
      item,
      urlField,
      type,
      status: 'VALID',
      message: `Valid (${relevancy.confidence}% confidence)`,
      url,
      relevancy,
      recommendation: 'KEEP'
    };

  } catch (error) {
    results.stats.invalid++;
    return {
      item,
      urlField,
      type,
      status: 'ERROR',
      message: error.message,
      url,
      recommendation: 'FIND_REPLACEMENT'
    };
  }
}

/**
 * Generate markdown report
 */
function generateReport() {
  const timestamp = new Date().toISOString();

  let report = `# URL Validation Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `**Total URLs Checked:** ${results.stats.totalChecked}\n\n`;
  report += `---\n\n`;

  // Summary statistics
  report += `## Summary\n\n`;
  report += `| Status | Count | Percentage |\n`;
  report += `|--------|-------|------------|\n`;
  report += `| ✅ Valid | ${results.stats.valid} | ${Math.round((results.stats.valid / results.stats.totalChecked) * 100)}% |\n`;
  report += `| ❌ Invalid | ${results.stats.invalid} | ${Math.round((results.stats.invalid / results.stats.totalChecked) * 100)}% |\n`;
  report += `| 🔀 Redirected | ${results.stats.redirected} | ${Math.round((results.stats.redirected / results.stats.totalChecked) * 100)}% |\n`;
  report += `| ⚠️ Not Relevant | ${results.stats.notRelevant} | ${Math.round((results.stats.notRelevant / results.stats.totalChecked) * 100)}% |\n`;
  report += `| **Total** | **${results.stats.totalChecked}** | **100%** |\n\n`;
  report += `---\n\n`;

  // Invalid URLs (need replacement)
  const invalidURLs = [...results.events.invalid, ...results.locations.invalid];
  if (invalidURLs.length > 0) {
    report += `## ❌ Invalid URLs (Need Replacement)\n\n`;
    report += `**Action Required:** Find valid URLs or mark for deletion\n\n`;

    invalidURLs.forEach((result, index) => {
      report += `### ${index + 1}. ${result.item.title || result.item.name}\n\n`;
      report += `- **Type:** ${result.type}\n`;
      report += `- **Slug:** \`${result.item.slug}\`\n`;
      report += `- **URL:** ${result.url}\n`;
      report += `- **Issue:** ${result.message}\n`;
      report += `- **Recommendation:** ${result.recommendation}\n`;

      if (result.item.organizer_organization) {
        report += `- **Organization:** ${result.item.organizer_organization}\n`;
      }
      if (result.item.contact_email) {
        report += `- **Contact:** ${result.item.contact_email}\n`;
      }

      report += `\n**Research Notes:**\n`;
      report += `- [ ] Search Google for: "${result.item.title || result.item.name}" "${result.item.organizer_organization || ''}"\n`;
      report += `- [ ] Check social media (Facebook, Instagram, LinkedIn)\n`;
      report += `- [ ] Replacement URL: ___________________________\n`;
      report += `- [ ] Mark for deletion if no valid URL found\n\n`;
    });

    report += `---\n\n`;
  }

  // Not relevant URLs
  const notRelevantURLs = [...results.events.notRelevant, ...results.locations.notRelevant];
  if (notRelevantURLs.length > 0) {
    report += `## ⚠️ Not Relevant URLs\n\n`;
    report += `**Action Required:** Verify and find correct URLs\n\n`;

    notRelevantURLs.forEach((result, index) => {
      report += `### ${index + 1}. ${result.item.title || result.item.name}\n\n`;
      report += `- **Type:** ${result.type}\n`;
      report += `- **Slug:** \`${result.item.slug}\`\n`;
      report += `- **URL:** ${result.url}\n`;
      report += `- **Issue:** ${result.message}\n`;
      report += `- **Confidence:** ${result.relevancy.confidence}%\n`;

      if (result.relevancy.matchDetails && result.relevancy.matchDetails.length > 0) {
        report += `- **Match Details:**\n`;
        result.relevancy.matchDetails.forEach(detail => {
          report += `  - ${detail}\n`;
        });
      }

      if (result.finalURL && result.finalURL !== result.url) {
        report += `- **Redirects to:** ${result.finalURL}\n`;
      }

      report += `\n**Action:**\n`;
      report += `- [ ] Verify URL is correct\n`;
      report += `- [ ] Find correct URL: ___________________________\n`;
      report += `- [ ] Mark for deletion if organization is defunct\n\n`;
    });

    report += `---\n\n`;
  }

  // Redirected URLs (should update)
  const redirectedURLs = [...results.events.redirected, ...results.locations.redirected];
  if (redirectedURLs.length > 0) {
    report += `## 🔀 Redirected URLs (Should Update)\n\n`;
    report += `**Action Required:** Update to final destination URL\n\n`;

    report += `| Slug | Type | Original URL | Final URL | Confidence |\n`;
    report += `|------|------|--------------|-----------|------------|\n`;

    redirectedURLs.forEach(result => {
      const originalDomain = new URL(result.url).hostname;
      const finalDomain = new URL(result.finalURL).hostname;
      report += `| \`${result.item.slug}\` | ${result.type} | ${originalDomain} | ${finalDomain} | ${result.relevancy.confidence}% |\n`;
    });

    report += `\n---\n\n`;
  }

  // Valid URLs
  const validURLs = [...results.events.valid, ...results.locations.valid];
  if (validURLs.length > 0) {
    report += `## ✅ Valid URLs\n\n`;
    report += `**Count:** ${validURLs.length}\n\n`;
    report += `All URLs returned 200 status with relevant content. No action needed.\n\n`;

    report += `<details>\n<summary>View all valid URLs</summary>\n\n`;
    report += `| Slug | Type | URL | Confidence |\n`;
    report += `|------|------|-----|------------|\n`;

    validURLs.forEach(result => {
      const domain = new URL(result.url).hostname;
      report += `| \`${result.item.slug}\` | ${result.type} | ${domain} | ${result.relevancy.confidence}% |\n`;
    });

    report += `\n</details>\n\n`;
    report += `---\n\n`;
  }

  // Action checklist
  report += `## 📋 Action Checklist\n\n`;
  report += `- [ ] Review all invalid URLs (${invalidURLs.length})\n`;
  report += `- [ ] Research replacement URLs for invalid entries\n`;
  report += `- [ ] Review all not relevant URLs (${notRelevantURLs.length})\n`;
  report += `- [ ] Update redirected URLs (${redirectedURLs.length})\n`;
  report += `- [ ] Create database migration with fixes\n`;
  report += `- [ ] Update seed files\n`;
  report += `- [ ] Mark defunct organizations for deletion\n\n`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting URL validation...\n');

  // Read JSON files
  console.log('📖 Reading validation files...');
  const events = JSON.parse(fs.readFileSync(EVENT_URLS_FILE, 'utf-8'));
  const locations = JSON.parse(fs.readFileSync(LOCATION_URLS_FILE, 'utf-8'));

  console.log(`Found ${events.length} events and ${locations.length} locations\n`);

  // Validate event URLs
  console.log('🎫 Validating event URLs...\n');
  for (const event of events) {
    // Check registration_url
    if (event.registration_url) {
      const result = await validateURL(event, 'registration_url', 'event');

      if (result.status === 'VALID') {
        results.events.valid.push(result);
      } else if (result.status === 'REDIRECTED') {
        results.events.redirected.push(result);
      } else if (result.status === 'NOT_RELEVANT' || result.status === 'REDIRECTED_IRRELEVANT') {
        results.events.notRelevant.push(result);
      } else {
        results.events.invalid.push(result);
      }
    }

    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Validate location URLs
  console.log('\n📍 Validating location URLs...\n');
  for (const location of locations) {
    // Check website
    if (location.website) {
      const result = await validateURL(location, 'website', 'location');

      if (result.status === 'VALID') {
        results.locations.valid.push(result);
      } else if (result.status === 'REDIRECTED') {
        results.locations.redirected.push(result);
      } else if (result.status === 'NOT_RELEVANT' || result.status === 'REDIRECTED_IRRELEVANT') {
        results.locations.notRelevant.push(result);
      } else {
        results.locations.invalid.push(result);
      }
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate report
  console.log('\n📝 Generating validation report...\n');
  const report = generateReport();
  fs.writeFileSync(REPORT_FILE, report);

  console.log(`\n✅ Validation complete!\n`);
  console.log(`📊 Results:`);
  console.log(`   - Valid: ${results.stats.valid}`);
  console.log(`   - Invalid: ${results.stats.invalid}`);
  console.log(`   - Redirected: ${results.stats.redirected}`);
  console.log(`   - Not Relevant: ${results.stats.notRelevant}`);
  console.log(`   - Total: ${results.stats.totalChecked}\n`);
  console.log(`📄 Report saved to: ${REPORT_FILE}\n`);
}

// Run validation
main().catch(error => {
  console.error('❌ Error running validation:', error);
  process.exit(1);
});
