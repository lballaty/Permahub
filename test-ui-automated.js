/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/test-ui-automated.js
 * Description: Automated UI test runner for Permahub
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'http://localhost:3001';
const SUPABASE_URL = 'https://mcbxbaggjaxqfdvmrqsc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNDk4MDYsImV4cCI6MjA0NTgyNTgwNn0.Zt8CJN9bKvlSyn7ptJj0bhSzN-XGLW9iGilN5qGMWs';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
    details: []
};

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, message = '') {
    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    const color = status === 'passed' ? 'green' : status === 'failed' ? 'red' : 'yellow';
    log(`  ${icon} ${name}${message ? ': ' + message : ''}`, color);
}

async function runTest(name, testFn) {
    testResults.total++;
    try {
        await testFn();
        testResults.passed++;
        testResults.details.push({ name, status: 'passed' });
        logTest(name, 'passed');
        return true;
    } catch (error) {
        testResults.failed++;
        testResults.errors.push({ name, error: error.message });
        testResults.details.push({ name, status: 'failed', error: error.message });
        logTest(name, 'failed', error.message);
        return false;
    }
}

// Test Suite 1: Server and Pages
async function testServerAndPages() {
    log('\n📄 Testing Server and Page Loading...', 'cyan');

    await runTest('Dev server is running', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-home.html`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
    });

    const pages = [
        '/wiki/wiki-home.html',
        '/wiki/wiki-editor.html',
        '/wiki/wiki-issues.html',
        '/wiki/wiki-admin.html',
        '/wiki/wiki-favorites.html',
        '/wiki/wiki-map.html',
        '/wiki/wiki-events.html',
        '/wiki/wiki-login.html'
    ];

    for (const page of pages) {
        await runTest(`Page loads: ${page}`, async () => {
            const response = await fetch(`${BASE_URL}${page}`);
            if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
            const html = await response.text();
            if (!html.includes('<!DOCTYPE html>')) throw new Error('Invalid HTML response');
        });
    }
}

// Test Suite 2: Database Connectivity
async function testDatabase() {
    log('\n🗄️ Testing Database Connectivity...', 'cyan');

    await runTest('Supabase connection', async () => {
        const { error } = await supabase.from('categories').select('count').limit(1);
        if (error) throw error;
    });

    await runTest('Categories table exists', async () => {
        const { data, error } = await supabase.from('categories').select('*').limit(5);
        if (error) throw error;
        if (!Array.isArray(data)) throw new Error('Invalid response format');
    });

    await runTest('Wiki content table exists', async () => {
        const { data, error } = await supabase.from('wiki_content').select('*').limit(5);
        if (error && error.message.includes('relation')) {
            throw new Error('Wiki content table not created yet');
        }
        if (error) throw error;
    });

    await runTest('Issues table exists', async () => {
        const { data, error } = await supabase.from('issues').select('*').limit(5);
        if (error && error.message.includes('relation')) {
            throw new Error('Issues table not created yet');
        }
        if (error) throw error;
    });
}

// Test Suite 3: Data Operations
async function testDataOperations() {
    log('\n💾 Testing Data Operations...', 'cyan');

    // Test category CRUD
    await runTest('Create test category', async () => {
        const testCategory = {
            name: 'UI Test Category',
            slug: 'ui-test-category',
            icon: 'fa-test',
            description: 'Created by automated test'
        };

        const { data, error } = await supabase
            .from('categories')
            .insert([testCategory])
            .select();

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Category not created');

        // Store ID for cleanup
        global.testCategoryId = data[0].id;
    });

    await runTest('Read test category', async () => {
        if (!global.testCategoryId) throw new Error('No test category ID');

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', global.testCategoryId);

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Category not found');
    });

    await runTest('Update test category', async () => {
        if (!global.testCategoryId) throw new Error('No test category ID');

        const { error } = await supabase
            .from('categories')
            .update({ name: 'Updated Test Category' })
            .eq('id', global.testCategoryId);

        if (error) throw error;
    });

    await runTest('Delete test category', async () => {
        if (!global.testCategoryId) throw new Error('No test category ID');

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', global.testCategoryId);

        if (error) throw error;
    });

    // Test wiki content operations
    await runTest('Create test wiki content', async () => {
        const testContent = {
            title: 'Automated Test Guide',
            content: '<p>This is a test guide created by automated testing</p>',
            content_type: 'guide',
            status: 'draft',
            created_by: '00000000-0000-0000-0000-000000000000'
        };

        const { data, error } = await supabase
            .from('wiki_content')
            .insert([testContent])
            .select();

        if (error && error.message.includes('relation')) {
            throw new Error('Wiki content table not yet created');
        }
        if (error) throw error;

        if (data && data[0]) {
            global.testContentId = data[0].id;
        }
    });

    if (global.testContentId) {
        await runTest('Delete test wiki content', async () => {
            const { error } = await supabase
                .from('wiki_content')
                .delete()
                .eq('id', global.testContentId);

            if (error) throw error;
        });
    }
}

// Test Suite 4: Real-time Features
async function testRealtime() {
    log('\n🔄 Testing Real-time Features...', 'cyan');

    await runTest('Real-time subscription setup', async () => {
        let subscriptionReceived = false;

        const channel = supabase
            .channel('test-channel')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'categories'
            }, payload => {
                subscriptionReceived = true;
            })
            .subscribe();

        // Wait a moment for subscription to establish
        await new Promise(resolve => setTimeout(resolve, 1000));

        channel.unsubscribe();
    });
}

// Test Suite 5: Feature Availability
async function testFeatures() {
    log('\n✨ Testing Feature Availability...', 'cyan');

    await runTest('Home page has version badge', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('v12') && !html.includes('version-badge')) {
            throw new Error('Version badge not found');
        }
    });

    await runTest('Home page has search functionality', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('searchInput') && !html.includes('type="search"')) {
            throw new Error('Search input not found');
        }
    });

    await runTest('Editor has Quill.js', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-editor.html`);
        const html = await response.text();
        if (!html.includes('quill') && !html.includes('ql-editor')) {
            throw new Error('Quill editor not found');
        }
    });

    await runTest('Map page has Leaflet', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-map.html`);
        const html = await response.text();
        if (!html.includes('leaflet') && !html.includes('L.map')) {
            throw new Error('Leaflet map not found');
        }
    });

    await runTest('Issues page has reporting', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-issues.html`);
        const html = await response.text();
        if (!html.includes('reportIssue') && !html.includes('Report')) {
            throw new Error('Issue reporting not found');
        }
    });

    await runTest('Footer has Report Issue link', async () => {
        const response = await fetch(`${BASE_URL}/wiki/wiki-home.html`);
        const html = await response.text();
        if (!html.includes('wiki-issues.html') || !html.includes('Report')) {
            throw new Error('Report Issue link not in footer');
        }
    });
}

// Main test runner
async function runAllTests() {
    const startTime = Date.now();

    log('\n' + '='.repeat(60), 'bright');
    log('🧪 PERMAHUB COMPREHENSIVE UI TEST SUITE', 'bright');
    log('='.repeat(60), 'bright');
    log(`Started: ${new Date().toLocaleString()}`, 'cyan');
    log(`Testing URL: ${BASE_URL}`, 'cyan');

    // Run test suites
    await testServerAndPages();
    await testDatabase();
    await testDataOperations();
    await testRealtime();
    await testFeatures();

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

    // Save detailed report
    const report = {
        timestamp: new Date().toISOString(),
        duration,
        summary: {
            total: testResults.total,
            passed: testResults.passed,
            failed: testResults.failed,
            passRate
        },
        details: testResults.details,
        errors: testResults.errors
    };

    const fs = await import('fs/promises');
    const reportPath = `test-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Detailed report saved: ${reportPath}`, 'cyan');

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