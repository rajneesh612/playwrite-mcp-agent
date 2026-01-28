/**
 * DashboardPage - Page Object for Dashboard functionality
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class DashboardPage extends BasePage {
  // Page elements (selectors) - OrangeHRM Dashboard
  private readonly selectors = {
    dashboard: '.oxd-topbar-header-breadcrumb',
    dashboardTitle: '.oxd-topbar-header-breadcrumb-module',
    userDropdown: '.oxd-userdropdown-tab',
    userDropdownMenu: '.oxd-userdropdown',
    logoutButton: 'a[href="/web/index.php/auth/logout"]',
    sideMenu: '.oxd-main-menu',
    timeAtWorkWidget: '.orangehrm-dashboard-widget',
    quickLaunchSection: '.orangehrm-todo-list',
    searchBox: 'input[placeholder="Search"]'
  };

  constructor(page?: Page) {
    super();
    this.pageName = 'Dashboard Page';
    if (page) {
      this.setPage(page);
    }
  }

  /**
   * Check if dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    Logger.info('Checking if dashboard is displayed');
    return await this.isElementVisible(this.selectors.dashboard);
  }

  /**
   * Get dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    Logger.info('Getting dashboard title');
    return await this.getElementText(this.selectors.dashboardTitle);
  }

  /**
   * Click user dropdown
   */
  async clickUserDropdown(): Promise<DashboardPage> {
    Logger.info('Clicking user dropdown');
    await this.click(this.selectors.userDropdown);
    await this.waitForElement(this.selectors.userDropdownMenu);
    return this;
  }

  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    Logger.info('Logging out from application');
    await this.clickUserDropdown();
    await this.click(this.selectors.logoutButton);
  }

  /**
   * Check if side menu is visible
   */
  async isSideMenuVisible(): Promise<boolean> {
    Logger.info('Checking if side menu is visible');
    return await this.isElementVisible(this.selectors.sideMenu);
  }

  /**
   * Search in dashboard
   */
  async search(searchTerm: string): Promise<void> {
    Logger.info(`Searching for: ${searchTerm}`);
    await this.click(this.selectors.searchBox);
    await this.typeText(this.selectors.searchBox, searchTerm);
  }

  /**
   * Verify dashboard loaded successfully
   */
  async verifyDashboardLoaded(): Promise<boolean> {
    Logger.info('Verifying dashboard loaded successfully');
    const isDashboardVisible = await this.isDashboardDisplayed();
    const isSideMenuVisible = await this.isSideMenuVisible();
    return isDashboardVisible && isSideMenuVisible;
  }

  /**
   * Navigate to dashboard (if not already there)
   */
  async navigateToDashboard(): Promise<DashboardPage> {
    Logger.info('Navigating to dashboard');
    await this.navigateTo('/web/index.php/dashboard/index');
    await this.waitForElement(this.selectors.dashboard);
    return this;
  }

  /**
   * Get number of widgets on dashboard
   */
  async getWidgetCount(): Promise<number> {
    Logger.info('Getting widget count');
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    const widgets = await this.page.locator(this.selectors.timeAtWorkWidget).count();
    return widgets;
  }

  /**
   * Verify widgets are visible
   */
  async verifyWidgetsVisible(): Promise<boolean> {
    Logger.info('Verifying widgets are visible');
    const widgetCount = await this.getWidgetCount();
    return widgetCount > 0;
  }

  /**
   * Verify dashboard content loads
   */
  async verifyDashboardContent(): Promise<boolean> {
    Logger.info('Verifying dashboard content loads');
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    const content = await this.page.locator('.oxd-layout-context').isVisible();
    return content;
  }
}
