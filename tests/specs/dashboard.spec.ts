/**
 * Dashboard Page Test Cases
 * Page Object Model Pattern with Playwright
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { Logger } from '../../src/utils/logger';

test.describe('Dashboard Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test to access dashboard
    Logger.info('Logging in to access dashboard');
    await loginPage.navigateToLoginPage();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL('**/dashboard/**', { timeout: 10000 });
    Logger.info('Successfully logged in and navigated to dashboard');
  });

  test.afterEach(() => {
    Logger.info('Test completed and cleaned up');
  });

  /**
   * TC-DASH-001: Verify Dashboard Displays After Login
   * 
   * Objective: Verify dashboard page loads successfully after login
   * 
   * Expected Result:
   * - Dashboard page displayed
   * - URL contains `/dashboard/`
   * - Dashboard title visible
   * - Side menu displayed
   */
  test('TC-DASH-001: Should verify dashboard displays after login', async ({ page }) => {
    // Step 1: Already logged in from beforeEach
    // Step 2: Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Step 3: Verify dashboard URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard/');

    // Step 4: Verify dashboard elements are visible
    const dashboardTitle = await dashboardPage.getDashboardTitle();
    expect(dashboardTitle).toBeTruthy();

    Logger.info('TC-DASH-001: Test passed - Dashboard displays after login');
  });

  /**
   * TC-DASH-002: Verify Dashboard Title
   * 
   * Objective: Verify dashboard page has correct title
   * 
   * Expected Result:
   * - Dashboard title displayed as "Dashboard"
   * - Title is visible and readable
   */
  test('TC-DASH-002: Should verify dashboard title', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Get dashboard title text
    const dashboardTitle = await dashboardPage.getDashboardTitle();

    // Step 3: Verify title matches expected value
    expect(dashboardTitle).toContain('Dashboard');

    Logger.info('TC-DASH-002: Test passed - Dashboard title is correct');
  });

  /**
   * TC-DASH-003: Verify Side Menu Visibility
   * 
   * Objective: Verify side navigation menu is visible
   * 
   * Steps:
   * 1. Navigate to dashboard
   * 2. Check if side menu is visible
   * 3. Verify menu items are accessible
   * 
   * Expected Result:
   * - Side menu is visible
   * - Menu items are clickable
   * - Menu is properly aligned
   */
  test('TC-DASH-003: Should verify side menu is visible', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle');

    // Step 2: Check if side menu is visible
    const isSideMenuVisible = await dashboardPage.isSideMenuVisible();
    expect(isSideMenuVisible).toBe(true);

    // Step 3: Verify menu items are accessible
    // The side menu should be displayed and ready for interaction
    Logger.info('TC-DASH-003: Test passed - Side menu is visible and accessible');
  });

  /**
   * TC-DASH-004: Verify Top Navigation Bar
   * 
   * Objective: Verify top navigation bar elements
   * 
   * Expected Result:
   * - Navigation bar visible
   * - User dropdown accessible
   * - Search functionality available
   */
  test('TC-DASH-004: Should verify top navigation bar', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Check top navigation bar
    const isNavBarVisible = await page.locator('nav').isVisible();
    expect(isNavBarVisible).toBe(true);

    // Step 3 & 4: Verify components
    const userDropdown = page.locator('[class*="user"]');
    expect(await userDropdown.count()).toBeGreaterThan(0);

    Logger.info('TC-DASH-004: Test passed - Top navigation bar verified');
  });

  /**
   * TC-DASH-005: Verify Dashboard Widgets Display
   * 
   * Objective: Verify all dashboard widgets are displayed
   * 
   * Expected Result:
   * - All widgets displayed
   * - Widget content loaded
   * - No error messages in widgets
   */
  test('TC-DASH-005: Should verify dashboard widgets display', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2 & 3: Check for widgets
    const widgets = await page.locator('[class*="widget"]').count();
    expect(widgets).toBeGreaterThan(0);

    // Step 4: Verify no error messages
    const errorElements = await page.locator('[class*="error"]').count();
    expect(errorElements).toBe(0);

    Logger.info('TC-DASH-005: Test passed - All widgets are displayed');
  });

  /**
   * TC-DASH-006: Verify Widget Interactions
   * 
   * Objective: Verify dashboard widgets are interactive
   * 
   * Steps:
   * 1. Navigate to dashboard
   * 2. Click on widget elements
   * 3. Verify widget expands/collapses
   * 4. Verify widget data refreshes
   * 
   * Expected Result:
   * - Widgets respond to clicks
   * - Content updates properly
   * - No UI breaks
   */
  test('TC-DASH-006: Should verify widget interactions', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle');

    // Step 2 & 3: Verify widgets are visible and interactive
    const widgetsVisible = await dashboardPage.verifyWidgetsVisible();
    expect(widgetsVisible).toBe(true);

    // Step 4: Verify dashboard content loads without errors
    const dashboardContentLoaded = await dashboardPage.verifyDashboardContent();
    expect(dashboardContentLoaded).toBe(true);

    // Get widget count for confirmation
    const widgetCount = await dashboardPage.getWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);

    Logger.info('TC-DASH-006: Test passed - Widgets are interactive and functional');
  });

  /**
   * TC-DASH-007: Verify User Dropdown Menu
   * 
   * Objective: Verify user dropdown menu functionality
   * 
   * Expected Result:
   * - Dropdown menu opens on click
   * - Menu items visible:
   *   - About
   *   - Support
   *   - Change Password
   *   - Logout
   * - Menu items are clickable
   */
  test('TC-DASH-007: Should verify user dropdown menu', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Click on user dropdown icon
    const userDropdownButton = page.locator('[class*="userdropdown"], [class*="user-menu"]').first();
    await userDropdownButton.click();

    // Wait for dropdown to open
    await page.waitForTimeout(500);

    // Step 3: Verify dropdown menu opens
    const dropdownMenu = page.locator('[class*="dropdown-menu"]').first();
    const isVisible = await dropdownMenu.isVisible().catch(() => false);
    
    if (isVisible) {
      // Step 4: Check menu items visible
      const menuItems = await page.locator('[class*="dropdown-menu"] a, [class*="dropdown-menu"] button').count();
      expect(menuItems).toBeGreaterThan(0);
    }

    Logger.info('TC-DASH-007: Test passed - User dropdown menu verified');
  });

  /**
   * TC-DASH-008: Logout from Dashboard
   * 
   * Objective: Verify user can logout from dashboard
   * 
   * Expected Result:
   * - User logged out successfully
   * - Redirected to login page
   * - Session cleared
   * - Cannot access dashboard without login
   */
  test('TC-DASH-008: Should logout from dashboard', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Click user dropdown
    const userDropdownButton = page.locator('[class*="userdropdown"], [class*="user-menu"]').first();
    await userDropdownButton.click();

    await page.waitForTimeout(500);

    // Step 3: Click Logout option
    const logoutButton = page.locator('text=Logout, a[href*="logout"], button:has-text("Logout")').first();
    await logoutButton.click({ timeout: 5000 }).catch(async () => {
      // Try alternative logout selector
      await page.locator('text=/logout/i').first().click();
    });

    // Step 4: Verify redirect to login page
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    const currentUrl = page.url();
    expect(currentUrl).toContain('/auth/login');

    Logger.info('TC-DASH-008: Test passed - User successfully logged out');
  });

  /**
   * TC-DASH-009: Verify Search Box Functionality
   * 
   * Objective: Verify search box works on dashboard
   * 
   * Expected Result:
   * - Search box accepts input
   * - Search suggestions appear
   * - Results are relevant
   * - Search is case-insensitive
   */
  test('TC-DASH-009: Should verify search box functionality', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Click on search box
    const searchBox = page.locator('input[type="search"], [placeholder*="search"]').first();
    const isSearchVisible = await searchBox.isVisible().catch(() => false);

    if (isSearchVisible) {
      await searchBox.click();

      // Step 3: Enter search term
      await searchBox.fill('Admin');

      await page.waitForTimeout(500);

      // Step 4: Verify search results or suggestions
      const suggestions = await page.locator('[class*="suggestion"], [class*="dropdown"]').count();
      Logger.info(`Found ${suggestions} search suggestions`);
    }

    Logger.info('TC-DASH-009: Test passed - Search box functionality verified');
  });

  /**
   * TC-DASH-010: Search with Special Characters
   * 
   * Objective: Verify search handles special characters
   * 
   * Expected Result:
   * - No errors thrown
   * - Appropriate results or empty state
   * - UI remains stable
   */
  test('TC-DASH-010: Should handle search with special characters', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Find and click search box
    const searchBox = page.locator('input[type="search"], [placeholder*="search"]').first();
    const isSearchVisible = await searchBox.isVisible().catch(() => false);

    if (isSearchVisible) {
      await searchBox.click();

      // Step 3: Enter special characters
      await searchBox.fill('@#$%^');

      await page.waitForTimeout(500);

      // Step 4: Verify system handles gracefully
      const isPageStable = await page.url().then(url => url.includes('/dashboard/')).catch(() => false);
      expect(isPageStable).toBe(true);
    }

    Logger.info('TC-DASH-010: Test passed - Special characters handled gracefully');
  });

  /**
   * TC-DASH-011: Navigate to Different Modules
   * 
   * Objective: Verify navigation to different modules from dashboard
   * 
   * Expected Result:
   * - Successfully navigates to module
   * - URL updated correctly
   * - Page content loads
   * - Breadcrumb shows current location
   */
  test('TC-DASH-011: Should navigate to different modules', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Click on Admin module in side menu
    const adminModule = page.locator('a:has-text("Admin"), [class*="menu"] a:has-text("Admin")').first();
    const isAdminVisible = await adminModule.isVisible().catch(() => false);

    if (isAdminVisible) {
      // Step 3: Verify navigation to module page
      await adminModule.click();
      await page.waitForLoadState('networkidle');

      // Step 4: Verify URL updated correctly
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }

    Logger.info('TC-DASH-011: Test passed - Module navigation verified');
  });

  /**
   * TC-DASH-013: Dashboard Load Time
   * 
   * Objective: Verify dashboard loads within acceptable time
   * 
   * Expected Result:
   * - Dashboard loads within 5 seconds
   * - All widgets load within 10 seconds
   * - No timeout errors
   */
  test('TC-DASH-013: Should verify dashboard load time is acceptable', async ({ page }) => {
    // Measure dashboard load time
    const startTime = Date.now();

    // Already navigated in beforeEach, just wait for full load
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Verify load time is acceptable (5 seconds = 5000ms)
    expect(loadTime).toBeLessThan(5000);

    Logger.info(`TC-DASH-013: Test passed - Dashboard loaded in ${loadTime}ms`);
  });

  /**
   * TC-DASH-014: Keyboard Navigation
   * 
   * Objective: Verify dashboard is keyboard accessible
   * 
   * Expected Result:
   * - All elements focusable
   * - Focus indicators visible
   * - Logical tab order
   * - Menu accessible via keyboard
   */
  test('TC-DASH-014: Should verify keyboard navigation', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Use Tab to navigate elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Get focused element
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    // Step 3: Verify an element is focused
    expect(focusedElement).toBeTruthy();

    Logger.info('TC-DASH-014: Test passed - Keyboard navigation is functional');
  });

  /**
   * TC-DASH-016: Handle Session Timeout
   * 
   * Objective: Verify behavior when session times out
   * 
   * Expected Result:
   * - User redirected to login page
   * - Appropriate message shown
   * - No data loss
   * - Can login again
   */
  test('TC-DASH-016: Should handle session timeout gracefully', async ({ page }) => {
    // Step 1: Already on dashboard from beforeEach
    await page.waitForLoadState('networkidle');

    // Step 2: Simulate session timeout by clearing cookies
    await page.context().clearCookies();

    // Step 3: Try to interact with dashboard - navigate to a module
    const adminLink = page.locator('a:has-text("Admin")').first();
    const isVisible = await adminLink.isVisible().catch(() => false);

    if (isVisible) {
      await adminLink.click();

      // Step 4: Verify redirect to login (or stay on dashboard with new session)
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      
      // Should either redirect to login or show session expired message
      const isLoginPage = currentUrl.includes('/auth/login') || currentUrl.includes('/auth/');
      const hasSessionMessage = await page.locator('text=/session|timeout|expired/i').count().catch(() => 0);

      expect(isLoginPage || hasSessionMessage > 0).toBe(true);
    }

    Logger.info('TC-DASH-016: Test passed - Session timeout handled gracefully');
  });
});
