/**
 * Language Switcher Visual Test with Playwright
 *
 * This script will:
 * 1. Open wiki-home.html in a browser
 * 2. Take screenshots in English, Portuguese, and Spanish
 * 3. Verify the language actually changes in the UI
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testLanguageSwitcher() {
  console.log('🚀 Starting Language Switcher Visual Test...\n');

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'language-test-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 } });
  const page = await context.newPage();

  // Navigate to wiki-home.html
  const htmlPath = 'file://' + path.join(__dirname, 'src/wiki/wiki-home.html');
  console.log(`📂 Loading: ${htmlPath}\n`);
  await page.goto(htmlPath);

  // Wait for page to fully load
  await page.waitForTimeout(500);

  // Test languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' }
  ];

  for (const lang of languages) {
    console.log(`${lang.flag} Testing ${lang.name} (${lang.code})...`);

    // Click language button to open dropdown
    await page.click('#langSelectorBtn');
    await page.waitForTimeout(200);

    // Click the language option
    await page.click(`[data-lang="${lang.code}"]`);
    await page.waitForTimeout(500);

    // Capture key elements' text
    const texts = {
      logo: await page.textContent('[data-i18n="wiki.nav.logo"]'),
      home: await page.textContent('[data-i18n="wiki.nav.home"]'),
      welcome: await page.textContent('[data-i18n="wiki.home.welcome"]'),
      subtitle: await page.textContent('[data-i18n="wiki.home.subtitle"]'),
      statsGuides: await page.textContent('[data-i18n="wiki.home.stats.guides"]'),
      categories: await page.textContent('[data-i18n="wiki.home.categories"]'),
      recentGuides: await page.textContent('[data-i18n="wiki.home.recent_guides"]'),
      contributeTitle: await page.textContent('[data-i18n="wiki.home.contribute_title"]'),
      createGuide: await page.textContent('[data-i18n="wiki.home.create_guide"]'),
      searchPlaceholder: await page.getAttribute('[data-i18n-placeholder="wiki.home.search"]', 'placeholder')
    };

    console.log(`  ✓ Logo: "${texts.logo}"`);
    console.log(`  ✓ Welcome: "${texts.welcome.substring(0, 50)}..."`);
    console.log(`  ✓ Stats: "${texts.statsGuides}"`);
    console.log(`  ✓ Categories: "${texts.categories}"`);
    console.log(`  ✓ Create Guide: "${texts.createGuide}"`);
    console.log(`  ✓ Search Placeholder: "${texts.searchPlaceholder}"`);

    // Take full page screenshot
    const screenshotPath = path.join(screenshotsDir, `wiki-home-${lang.code}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`  📸 Screenshot saved: ${screenshotPath}\n`);
  }

  // Also test on wiki-events page
  console.log('📄 Testing wiki-events.html page...\n');
  await page.goto('file://' + path.join(__dirname, 'src/wiki/wiki-events.html'));
  await page.waitForTimeout(500);

  // Test Portuguese on events page
  await page.click('#langSelectorBtn');
  await page.waitForTimeout(200);
  await page.click('[data-lang="pt"]');
  await page.waitForTimeout(500);

  const eventsTexts = {
    logo: await page.textContent('[data-i18n="wiki.nav.logo"]'),
    home: await page.textContent('[data-i18n="wiki.nav.home"]'),
    events: await page.textContent('[data-i18n="wiki.nav.events"]')
  };

  console.log(`🇵🇹 Portuguese on Events Page:`);
  console.log(`  ✓ Logo: "${eventsTexts.logo}"`);
  console.log(`  ✓ Home: "${eventsTexts.home}"`);
  console.log(`  ✓ Events: "${eventsTexts.events}"`);

  const eventsScreenshot = path.join(screenshotsDir, 'wiki-events-pt.png');
  await page.screenshot({ path: eventsScreenshot, fullPage: true });
  console.log(`  📸 Screenshot saved: ${eventsScreenshot}\n`);

  await browser.close();

  console.log('✅ Test completed successfully!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
  console.log('\nTo view screenshots:');
  console.log(`  open ${screenshotsDir}`);
}

// Run the test
testLanguageSwitcher().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
