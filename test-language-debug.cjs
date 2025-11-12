/**
 * Debug Language Switcher - Check console errors
 */

const { chromium } = require('playwright');
const path = require('path');

async function debugLanguageSwitcher() {
  console.log('🔍 Debugging Language Switcher...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`  [${type.toUpperCase()}] ${text}`);
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`  [ERROR] ${error.message}`);
  });

  const htmlPath = 'file://' + path.join(__dirname, 'src/wiki/wiki-home.html');
  console.log(`Loading: ${htmlPath}\n`);
  await page.goto(htmlPath);
  await page.waitForTimeout(1000);

  console.log('\n📋 Testing if wikiI18n is loaded...');
  const wikiI18nExists = await page.evaluate(() => {
    return typeof window.wikiI18n !== 'undefined';
  });
  console.log(`  wikiI18n exists: ${wikiI18nExists}`);

  if (wikiI18nExists) {
    const currentLang = await page.evaluate(() => {
      return window.wikiI18n.getLanguage();
    });
    console.log(`  Current language: ${currentLang}`);
  }

  console.log('\n🖱️  Clicking language button...');
  await page.click('#langSelectorBtn');
  await page.waitForTimeout(500);

  console.log('🖱️  Clicking Portuguese option...');
  await page.click('[data-lang="pt"]');
  await page.waitForTimeout(1000);

  console.log('\n📊 Checking text after language change...');
  const welcomeText = await page.textContent('[data-i18n="wiki.home.welcome"]');
  const logoText = await page.textContent('[data-i18n="wiki.nav.logo"]');
  const statsText = await page.textContent('[data-i18n="wiki.home.stats.guides"]');

  console.log(`  Logo: "${logoText}"`);
  console.log(`  Welcome: "${welcomeText.substring(0, 60)}..."`);
  console.log(`  Stats: "${statsText}"`);

  const newLang = await page.evaluate(() => {
    return window.wikiI18n.getLanguage();
  });
  console.log(`\n  Language after change: ${newLang}`);

  console.log('\n⏸️  Browser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('\n✅ Debug complete');
}

debugLanguageSwitcher().catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});
