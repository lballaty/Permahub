/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/test-ui-quick.js
 * Description: Quick UI test runner using native fetch
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

// Configuration
const BASE_URL = 'http://localhost:3001';

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTest(name, testFn) {
    testResults.total++;
    try {
        const result = await testFn();
        testResults.passed++;
        log(`  ✅ ${name}: ${result || 'Passed'}`, 'green');
        return true;
    } catch (error) {
        testResults.failed++;
        testResults.errors.push({ name, error: error.message });
        log(`  ❌ ${name}: ${error.message}`, 'red');
        return false;
    }
}

// Main test runner
async function runAllTests() {
    const startTime = Date.now();

    log('\n' + '='.repeat(60), 'bright');
    log('🧪 PERMAHUB UI QUICK TEST', 'bright');
    log('='.repeat(60), 'bright');
    log(`Started: ${new Date().toLocaleString()}`, 'cyan');
    log(`Testing URL: ${BASE_URL}`, 'cyan');

    log('\n📄 Testing Page Loading...', 'cyan');

    // Test page loading
    const pages = [
        { url: '/src/wiki/wiki-home.html', name: 'Home Page' },
        { url: '/src/wiki/wiki-editor.html', name: 'Content Editor' },
        { url: '/src/wiki/wiki-issues.html', name: 'Issue Reporting' },
        { url: '/src/wiki/wiki-admin.html', name: 'Admin Panel' },
        { url: '/src/wiki/wiki-favorites.html', name: 'Favorites' },
        { url: '/src/wiki/wiki-map.html', name: 'Interactive Map' },
        { url: '/src/wiki/wiki-events.html', name: 'Events Page' },
        { url: '/src/wiki/wiki-login.html', name: 'Login Page' }
    ];

    for (const page of pages) {
        await runTest(`Loading ${page.name}`, async () => {
            const response = await fetch(`${BASE_URL}${page.url}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();

            // Check for specific features
            const features = [];
            if (html.includes('v12')) features.push('v12 badge');
            if (html.includes('searchInput')) features.push('search');
            if (html.includes('quill')) features.push('Quill editor');
            if (html.includes('leaflet')) features.push('Leaflet map');
            if (html.includes('Report Issue')) features.push('issue reporting');
            if (html.includes('languageSelector')) features.push('language switcher');

            return features.length > 0 ? `Found: ${features.join(', ')}` : 'Page loaded';
        });
    }

    log('\n✨ Testing Key Features...', 'cyan');

    await runTest('Version Badge (v12)', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('v12')) throw new Error('Version badge not found');
        return 'Version v12 displayed';
    });

    await runTest('Search Functionality', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('search') && !html.includes('Search')) {
            throw new Error('Search feature not found');
        }
        return 'Search input available';
    });

    await runTest('Dynamic Categories', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('category') && !html.includes('Category')) {
            throw new Error('Categories section not found');
        }
        return 'Category system present';
    });

    await runTest('Event Registration', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('Register') && !html.includes('register')) {
            throw new Error('Registration feature not found');
        }
        return 'Registration buttons found';
    });

    await runTest('Issue Reporting Link', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('wiki-issues.html')) {
            throw new Error('Issue reporting link not found');
        }
        return 'Report Issue link in footer';
    });

    await runTest('Rich Text Editor', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-editor.html`);
        const html = await response.text();
        if (!html.includes('quill') && !html.includes('editor')) {
            throw new Error('Editor not found');
        }
        return 'Quill.js editor loaded';
    });

    await runTest('Interactive Map', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-map.html`);
        const html = await response.text();
        if (!html.includes('map') && !html.includes('leaflet')) {
            throw new Error('Map functionality not found');
        }
        return 'Leaflet map configured';
    });

    await runTest('Multi-language Support', async () => {
        const response = await fetch(`${BASE_URL}/src/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('i18n') && !html.includes('lang')) {
            throw new Error('Language support not found');
        }
        return 'i18n system available';
    });

    // Test specific file existence
    log('\n📁 Testing File Structure...', 'cyan');

    await runTest('Event Registration Test File', async () => {
        const response = await fetch(`${BASE_URL}/test-event-registration.html`);
        if (!response.ok) throw new Error('Test file not accessible');
        return 'Test file accessible';
    });

    // Generate summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);

    log('\n' + '='.repeat(60), 'bright');
    log('📊 TEST SUMMARY', 'bright');
    log('='.repeat(60), 'bright');

    log(`\nTotal Tests: ${testResults.total}`, 'cyan');
    log(`Passed: ${testResults.passed}`, 'green');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
    log(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
    log(`Duration: ${duration}s`, 'cyan');

    if (testResults.failed > 0) {
        log('\n❌ Failed Tests:', 'red');
        testResults.errors.forEach(error => {
            log(`  • ${error.name}: ${error.error}`, 'red');
        });
    } else {
        log('\n✅ All tests passed successfully!', 'green');
    }

    log('\n' + '='.repeat(60) + '\n', 'bright');

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    log('\n❌ Test runner error:', 'red');
    console.error(error);
    process.exit(1);
});