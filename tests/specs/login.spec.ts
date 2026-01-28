/**
 * Login Page Test Cases
 * Page Object Model Pattern with Playwright
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { Logger } from '../../src/utils/logger';

test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(({ page }) => {
    // Initialize LoginPage object before each test
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    Logger.info('Initializing LoginPage object');
  });

  test.afterEach(() => {
    // Cleanup after each test
    Logger.info('Test completed and cleaned up');
  });

  /**
   * TC-001: Navigate to Login Page
   * 
   * Objective: Verify user can navigate to login page successfully
   * 
   * Steps:
   * 1. Launch application
   * 2. Navigate to `/login` URL
   * 3. Wait for login form to load
   * 
   * Expected Result:
   * - Login page displays
   * - Login form is visible
   * - All input fields are accessible
   */
  test('TC-001: Should navigate to login page successfully', async () => {
    // Step 1 & 2: Navigate to login page
    await loginPage.navigateToLoginPage();

    // Step 3 & Assertion: Verify login page is displayed
    const isDisplayed = await loginPage.isLoginPageDisplayed();
    expect(isDisplayed).toBe(true);

    // Additional assertion: Verify page name
    expect(loginPage.getPageName()).toBe('Login Page');

    Logger.info('TC-001: Test passed - Login page displayed successfully');
  });

  /**
   * TC-002: Login with Valid Credentials
   * 
   * Objective: Verify successful login with correct username and password
   * 
   * Steps:
   * 1. Navigate to login page
   * 2. Enter valid username: Admin
   * 3. Enter valid password: admin123
   * 4. Click Login button
   * 5. Wait for dashboard to load
   * 
   * Expected Result:
   * - User redirected to dashboard
   * - User session created
   * - No error messages displayed
   * 
   * Test Data:
   * Username: Admin
   * Password: admin123
   */
  test('TC-002: Should login successfully with valid credentials', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLoginPage();

    // Step 2 & 3: Enter credentials and login
    await loginPage.login('Admin', 'admin123');

    // Step 4 & 5: Wait for navigation to dashboard
    await page.waitForURL('**/dashboard/**', { timeout: 10000 });

    // Assertions: Verify successful login
    const currentUrl = await page.url();
    expect(currentUrl).toContain('dashboard');
// Verify dashboard page loaded
    const isDashboardLoaded = await dashboardPage.verifyDashboardLoaded();
    expect(isDashboardLoaded).toBe(true);

    // Verify dashboard title
    const dashboardTitle = await dashboardPage.getDashboardTitle();
    expect(dashboardTitle).toBe('Dashboard');

    await dashboardPage.navigateToDashboard();
    Logger.info('TC-002: Test passed - Login successful with valid credentials');
  });
});
