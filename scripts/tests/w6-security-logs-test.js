#!/usr/bin/env node

/**
 * W6: Security Logs Page - UI/UX Test
 * Tests the security logs page for UI issues and missing features
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8103';
const SUPER_ADMIN = {
  email: 'info@gaiai.ai',
  password: '23235656',
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SecurityLogsUITester {
  constructor() {
    this.issues = [];
    this.features = {
      present: [],
      missing: [],
    };
  }

  async run() {
    console.log('🔍 Testing Security Logs Page UI/UX...\n');

    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Login
      console.log('1. Logging in as SUPER_ADMIN...');
      await page.goto(`${BASE_URL}/login`);
      await page.type('input[name="email"], input[type="email"]', SUPER_ADMIN.email);
      await page.type('input[name="password"], input[type="password"]', SUPER_ADMIN.password);
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);
      console.log('   ✅ Logged in\n');

      // Navigate to Security Logs
      console.log('2. Navigating to Security Logs...');
      await page.goto(`${BASE_URL}/super-admin/security-logs`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      console.log('   ✅ Page loaded\n');

      // Take initial screenshot
      await page.screenshot({ path: 'screenshots/security-logs-initial.png', fullPage: true });

      // Test 1: Check header elements
      console.log('3. Checking header elements...');
      const headerTests = await this.testHeader(page);
      console.log(`   ✅ Header: ${headerTests.present.length} present, ${headerTests.missing.length} missing\n`);

      // Test 2: Check stats cards
      console.log('4. Checking stats cards...');
      const statsTests = await this.testStatsCards(page);
      console.log(`   ✅ Stats: ${statsTests.present.length} present, ${statsTests.missing.length} missing\n`);

      // Test 3: Check filter/search functionality
      console.log('5. Checking filter/search...');
      const filterTests = await this.testFilters(page);
      console.log(`   ✅ Filters: ${filterTests.present.length} present, ${filterTests.missing.length} missing\n`);

      // Test 4: Check log entries
      console.log('6. Checking log entries...');
      const logTests = await this.testLogEntries(page);
      console.log(`   ✅ Logs: ${logTests.present.length} present, ${logTests.missing.length} missing\n`);

      // Test 5: Check pagination
      console.log('7. Checking pagination...');
      const paginationTests = await this.testPagination(page);
      console.log(`   ✅ Pagination: ${paginationTests.present.length} present, ${paginationTests.missing.length} missing\n`);

      // Test 6: Check export functionality
      console.log('8. Checking export...');
      const exportTests = await this.testExport(page);
      console.log(`   ✅ Export: ${exportTests.present.length} present, ${exportTests.missing.length} missing\n`);

      // Test 7: Check date range selector
      console.log('9. Checking date range...');
      const dateTests = await this.testDateRange(page);
      console.log(`   ✅ Date Range: ${dateTests.present.length} present, ${dateTests.missing.length} missing\n`);

      // Collect all features
      this.features.present = [
        ...headerTests.present,
        ...statsTests.present,
        ...filterTests.present,
        ...logTests.present,
        ...paginationTests.present,
        ...exportTests.present,
        ...dateTests.present,
      ];

      this.features.missing = [
        ...headerTests.missing,
        ...statsTests.missing,
        ...filterTests.missing,
        ...logTests.missing,
        ...paginationTests.missing,
        ...exportTests.missing,
        ...dateTests.missing,
      ];

      // Generate report
      this.generateReport();

    } finally {
      await browser.close();
    }
  }

  async testHeader(page) {
    const present = [];
    const missing = [];

    // Check title
    const title = await page.$('h1');
    if (title) present.push('Page title');
    else missing.push('Page title');

    // Check filter button
    const filterBtn = await page.$('button:has-text("Filtrele")');
    if (filterBtn) {
      present.push('Filter button (visual)');
      // Check if functional
      const filterModal = await page.$('[role="dialog"]');
      if (!filterModal) missing.push('Filter functionality');
    } else {
      missing.push('Filter button');
    }

    // Check export button
    const exportBtn = await page.$('button:has-text("Export")');
    if (exportBtn) {
      present.push('Export button (visual)');
      missing.push('Export functionality');
    } else {
      missing.push('Export button');
    }

    return { present, missing };
  }

  async testStatsCards(page) {
    const present = [];
    const missing = [];

    // Check if stats cards exist
    const stats = await page.$$('.bg-gradient-to-br');
    if (stats.length >= 4) {
      present.push(`${stats.length} stats cards`);
    }

    // Check for specific stats
    const activeToday = await page.$('text=/Aktif Bugün/');
    if (activeToday) present.push('Active Today stat');

    const activeWeek = await page.$('text=/Aktif Bu Hafta/');
    if (activeWeek) present.push('Active Week stat');

    // Check for missing critical stats
    const failedLogins = await page.$('text=/Failed Login/');
    if (!failedLogins) missing.push('Failed Logins stat');

    const suspiciousActivity = await page.$('text=/Suspicious/');
    if (!suspiciousActivity) missing.push('Suspicious Activity stat');

    return { present, missing };
  }

  async testFilters(page) {
    const present = [];
    const missing = [];

    // Search bar
    const searchBar = await page.$('input[type="search"], input[placeholder*="ara"]');
    if (!searchBar) missing.push('Search bar');

    // Log level filter
    const logLevelFilter = await page.$('select, [role="combobox"]');
    if (!logLevelFilter) missing.push('Log level filter (INFO/WARN/ERROR)');

    // Event type filter
    missing.push('Event type filter');

    // User filter
    missing.push('User/email filter');

    // Organization filter
    missing.push('Organization filter');

    return { present, missing };
  }

  async testLogEntries(page) {
    const present = [];
    const missing = [];

    // Check if logs are displayed
    const logEntries = await page.$$('[class*="space-y"] > div');
    if (logEntries.length > 0) {
      present.push(`${logEntries.length} log entries displayed`);
    }

    // Check log details
    const firstLog = logEntries[0];
    if (firstLog) {
      // Check for IP address
      const ipText = await firstLog.$('text=/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}/');
      if (!ipText) missing.push('IP address in logs');

      // Check for severity/log level indicator
      const severityBadge = await firstLog.$('[class*="bg-red"], [class*="bg-yellow"], [class*="bg-green"]');
      if (!severityBadge) missing.push('Log severity indicator (color-coded)');

      // Check for details button/modal
      const detailsBtn = await firstLog.$('button:has-text("Details"), button:has-text("Detay")');
      if (!detailsBtn) missing.push('Log details view/modal');
    }

    return { present, missing };
  }

  async testPagination(page) {
    const present = [];
    const missing = [];

    const pagination = await page.$('[role="navigation"] button, .pagination');
    if (!pagination) {
      missing.push('Pagination controls');
      missing.push('Items per page selector');
      missing.push('Total count display');
    }

    return { present, missing };
  }

  async testExport(page) {
    const present = [];
    const missing = [];

    missing.push('Export format selection (CSV/JSON/PDF)');
    missing.push('Export date range selection');
    missing.push('Export progress indicator');

    return { present, missing };
  }

  async testDateRange(page) {
    const present = [];
    const missing = [];

    // Fixed "Son 24 Saat" text exists
    const fixedRange = await page.$('text=/Son 24 Saat/');
    if (fixedRange) present.push('Fixed time range display');

    // But no selector
    const dateRangePicker = await page.$('input[type="date"], [class*="date-picker"]');
    if (!dateRangePicker) {
      missing.push('Date range picker (custom range)');
      missing.push('Quick filters (Today, Week, Month, Year)');
    }

    return { present, missing };
  }

  generateReport() {
    console.log('\n\n' + '='.repeat(60));
    console.log('SECURITY LOGS UI/UX TEST REPORT');
    console.log('='.repeat(60) + '\n');

    console.log(`✅ PRESENT FEATURES (${this.features.present.length}):`);
    this.features.present.forEach(f => console.log(`   • ${f}`));

    console.log(`\n❌ MISSING FEATURES (${this.features.missing.length}):`);
    this.features.missing.forEach(f => console.log(`   • ${f}`));

    console.log('\n' + '='.repeat(60));
    console.log(`COVERAGE: ${this.features.present.length}/${this.features.present.length + this.features.missing.length} (${Math.round(this.features.present.length / (this.features.present.length + this.features.missing.length) * 100)}%)`);
    console.log('='.repeat(60) + '\n');

    // Save to file
    const report = {
      timestamp: new Date().toISOString(),
      present: this.features.present,
      missing: this.features.missing,
      coverage: Math.round(this.features.present.length / (this.features.present.length + this.features.missing.length) * 100),
    };

    fs.writeFileSync(
      'test-outputs/security-logs-ui-test.json',
      JSON.stringify(report, null, 2)
    );

    console.log('✅ Report saved to: test-outputs/security-logs-ui-test.json\n');
  }
}

const tester = new SecurityLogsUITester();
tester.run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
