/**
 * BasePage - Abstract base class for all Page Objects
 * Provides common functionality and methods for page interaction with Playwright
 */

import { Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  protected pageName: string = 'Base Page';
  protected page: Page | null = null;

  /**
   * Initialize page with Playwright Page object
   */
  setPage(page: Page): void {
    this.page = page;
  }

  /**
   * Get page name
   */
  getPageName(): string {
    return this.pageName;
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      Logger.error('Page is not initialized');
      throw new Error('Page is not initialized. Call setPage() first.');
    }
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  /**
   * Wait for element
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    if (!this.page) {
      Logger.error('Page is not initialized');
      throw new Error('Page is not initialized');
    }
    Logger.info(`Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Click element
   */
  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    Logger.info(`Clicking element: ${selector}`);
    await this.page.click(selector);
  }

  /**
   * Type text
   */
  async typeText(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    Logger.info(`Typing text in ${selector}: ${text}`);
    await this.page.fill(selector, text);
  }

  /**
   * Get element text
   */
  async getElementText(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    Logger.info(`Getting text from element: ${selector}`);
    const text = await this.page.textContent(selector);
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    if (!this.page) {
      Logger.error('Page is not initialized');
      return false;
    }
    Logger.info(`Checking visibility of element: ${selector}`);
    const isVisible = await this.page.isVisible(selector);
    return isVisible;
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reloadPage(): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    Logger.info('Reloading page');
    await this.page.reload();
  }
}

