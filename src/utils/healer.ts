/**
 * Test Healer - Self-healing mechanism for Playwright tests
 * Automatically detects and fixes broken locators and element changes
 */

import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';

export interface LocatorStrategy {
  type: 'css' | 'xpath' | 'text' | 'role' | 'testId' | 'label' | 'placeholder';
  value: string;
  priority: number;
}

export interface HealingResult {
  success: boolean;
  originalLocator: string;
  healedLocator?: string;
  strategy?: string;
  attempts: number;
}

export class TestHealer {
  private healingHistory: Map<string, HealingResult> = new Map();
  private locatorCache: Map<string, string> = new Map();

  /**
   * Generate alternative locator strategies for an element
   */
  private async generateAlternativeStrategies(
    page: Page,
    originalLocator: string,
    context?: string
  ): Promise<LocatorStrategy[]> {
    const strategies: LocatorStrategy[] = [];

    try {
      // Try to find element with original locator first
      const element = page.locator(originalLocator).first();
      
      // If element exists, extract attributes for alternative strategies
      const isVisible = await element.isVisible().catch(() => false);
      
      if (isVisible) {
        // Get element attributes
        const id = await element.getAttribute('id').catch(() => null);
        const className = await element.getAttribute('class').catch(() => null);
        const name = await element.getAttribute('name').catch(() => null);
        const testId = await element.getAttribute('data-testid').catch(() => null);
        const ariaLabel = await element.getAttribute('aria-label').catch(() => null);
        const placeholder = await element.getAttribute('placeholder').catch(() => null);
        const text = await element.textContent().catch(() => null);
        const role = await element.getAttribute('role').catch(() => null);

        // Build alternative strategies based on available attributes
        if (testId) {
          strategies.push({ type: 'testId', value: testId, priority: 1 });
        }
        if (id) {
          strategies.push({ type: 'css', value: `#${id}`, priority: 2 });
        }
        if (name) {
          strategies.push({ type: 'css', value: `[name="${name}"]`, priority: 3 });
        }
        if (ariaLabel) {
          strategies.push({ type: 'label', value: ariaLabel, priority: 4 });
        }
        if (placeholder) {
          strategies.push({ type: 'placeholder', value: placeholder, priority: 5 });
        }
        if (role) {
          strategies.push({ type: 'role', value: role, priority: 6 });
        }
        if (text && text.trim()) {
          strategies.push({ type: 'text', value: text.trim(), priority: 7 });
        }
        if (className) {
          const classes = className.split(' ').filter(c => c);
          if (classes.length > 0) {
            strategies.push({ 
              type: 'css', 
              value: `.${classes.join('.')}`, 
              priority: 8 
            });
          }
        }
      }
    } catch (error) {
      Logger.warn(`Could not extract element attributes: ${error}`);
    }

    return strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Try to heal a broken locator by finding alternative strategies
   */
  async healLocator(
    page: Page,
    originalLocator: string,
    elementContext?: string
  ): Promise<HealingResult> {
    Logger.info(`Attempting to heal locator: ${originalLocator}`);
    
    // Check cache first
    if (this.locatorCache.has(originalLocator)) {
      const cachedLocator = this.locatorCache.get(originalLocator)!;
      Logger.info(`Using cached healed locator: ${cachedLocator}`);
      return {
        success: true,
        originalLocator,
        healedLocator: cachedLocator,
        strategy: 'cached',
        attempts: 0
      };
    }

    const strategies = await this.generateAlternativeStrategies(page, originalLocator, elementContext);
    let attempts = 0;

    for (const strategy of strategies) {
      attempts++;
      try {
        let locator: Locator;

        switch (strategy.type) {
          case 'testId':
            locator = page.getByTestId(strategy.value);
            break;
          case 'text':
            locator = page.getByText(strategy.value, { exact: false });
            break;
          case 'role':
            locator = page.getByRole(strategy.value as any);
            break;
          case 'label':
            locator = page.getByLabel(strategy.value);
            break;
          case 'placeholder':
            locator = page.getByPlaceholder(strategy.value);
            break;
          case 'css':
          case 'xpath':
            locator = page.locator(strategy.value);
            break;
          default:
            continue;
        }

        // Check if element is visible
        const isVisible = await locator.first().isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const healedLocator = strategy.value;
          Logger.info(`Successfully healed locator using ${strategy.type}: ${healedLocator}`);
          
          // Cache the healed locator
          this.locatorCache.set(originalLocator, healedLocator);
          
          const result: HealingResult = {
            success: true,
            originalLocator,
            healedLocator,
            strategy: strategy.type,
            attempts
          };
          
          this.healingHistory.set(originalLocator, result);
          return result;
        }
      } catch (error) {
        Logger.debug(`Strategy ${strategy.type} failed: ${error}`);
        continue;
      }
    }

    // No healing strategy worked
    const result: HealingResult = {
      success: false,
      originalLocator,
      attempts
    };
    
    this.healingHistory.set(originalLocator, result);
    Logger.error(`Failed to heal locator after ${attempts} attempts: ${originalLocator}`);
    return result;
  }

  /**
   * Find element with self-healing capability
   */
  async findElement(
    page: Page,
    locator: string,
    options?: {
      timeout?: number;
      enableHealing?: boolean;
      context?: string;
    }
  ): Promise<Locator> {
    const timeout = options?.timeout || 5000;
    const enableHealing = options?.enableHealing !== false;

    try {
      // Try original locator first
      const element = page.locator(locator);
      await element.first().waitFor({ timeout, state: 'visible' });
      return element;
    } catch (error) {
      if (!enableHealing) {
        throw error;
      }

      Logger.warn(`Original locator failed, attempting to heal: ${locator}`);
      
      // Attempt healing
      const healingResult = await this.healLocator(page, locator, options?.context);
      
      if (healingResult.success && healingResult.healedLocator) {
        Logger.info(`Using healed locator: ${healingResult.healedLocator}`);
        return page.locator(healingResult.healedLocator);
      }
      
      throw new Error(`Could not heal locator: ${locator}`);
    }
  }

  /**
   * Click with self-healing
   */
  async click(
    page: Page,
    locator: string,
    options?: {
      timeout?: number;
      enableHealing?: boolean;
      context?: string;
    }
  ): Promise<void> {
    Logger.info(`Clicking element: ${locator}`);
    const element = await this.findElement(page, locator, options);
    await element.first().click();
  }

  /**
   * Fill with self-healing
   */
  async fill(
    page: Page,
    locator: string,
    value: string,
    options?: {
      timeout?: number;
      enableHealing?: boolean;
      context?: string;
    }
  ): Promise<void> {
    Logger.info(`Filling element: ${locator} with value: ${value}`);
    const element = await this.findElement(page, locator, options);
    await element.first().fill(value);
  }

  /**
   * Get text with self-healing
   */
  async getText(
    page: Page,
    locator: string,
    options?: {
      timeout?: number;
      enableHealing?: boolean;
      context?: string;
    }
  ): Promise<string> {
    Logger.info(`Getting text from element: ${locator}`);
    const element = await this.findElement(page, locator, options);
    return await element.first().textContent() || '';
  }

  /**
   * Wait for element with self-healing
   */
  async waitFor(
    page: Page,
    locator: string,
    options?: {
      timeout?: number;
      enableHealing?: boolean;
      context?: string;
      state?: 'visible' | 'hidden' | 'attached' | 'detached';
    }
  ): Promise<void> {
    Logger.info(`Waiting for element: ${locator}`);
    const element = await this.findElement(page, locator, options);
    await element.first().waitFor({ 
      timeout: options?.timeout, 
      state: options?.state || 'visible' 
    });
  }

  /**
   * Get healing statistics
   */
  getHealingStats(): {
    totalAttempts: number;
    successful: number;
    failed: number;
    successRate: number;
    cachedLocators: number;
  } {
    const total = this.healingHistory.size;
    const successful = Array.from(this.healingHistory.values()).filter(r => r.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      totalAttempts: total,
      successful,
      failed,
      successRate: parseFloat(successRate.toFixed(2)),
      cachedLocators: this.locatorCache.size
    };
  }

  /**
   * Get healing history
   */
  getHealingHistory(): Map<string, HealingResult> {
    return this.healingHistory;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.locatorCache.clear();
    Logger.info('Healer cache cleared');
  }

  /**
   * Export healed locators for permanent update
   */
  exportHealedLocators(): Array<{ original: string; healed: string; strategy: string }> {
    const exports: Array<{ original: string; healed: string; strategy: string }> = [];
    
    this.healingHistory.forEach((result, original) => {
      if (result.success && result.healedLocator && result.strategy) {
        exports.push({
          original,
          healed: result.healedLocator,
          strategy: result.strategy
        });
      }
    });

    Logger.info(`Exported ${exports.length} healed locators`);
    return exports;
  }
}

// Singleton instance
export const healer = new TestHealer();
