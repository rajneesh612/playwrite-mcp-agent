/**
 * LoginPage - Page Object for Login functionality
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class LoginPage extends BasePage {
  // Page elements (selectors) - OrangeHRM Demo Site
  private readonly selectors = {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    errorMessage: '.oxd-alert-content-text',
    rememberMeCheckbox: 'input[type="checkbox"]',
    forgotPasswordLink: '.orangehrm-login-forgot-header',
    loginForm: '.oxd-form'
  };

  constructor(page?: Page) {
    super();
    this.pageName = 'Login Page';
    if (page) {
      this.setPage(page);
    }
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<LoginPage> {
    Logger.info('Navigating to login page');
    await this.navigateTo('/web/index.php/auth/login');
    await this.waitForElement(this.selectors.loginForm);
    return this;
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<LoginPage> {
    Logger.info(`Entering username: ${username}`);
    await this.click(this.selectors.usernameInput);
    await this.typeText(this.selectors.usernameInput, username);
    return this;
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<LoginPage> {
    Logger.info('Entering password');
    await this.click(this.selectors.passwordInput);
    await this.typeText(this.selectors.passwordInput, password);
    return this;
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    Logger.info('Clicking login button');
    await this.click(this.selectors.loginButton);
  }

  /**
   * Complete login flow
   */
  async login(username: string, password: string): Promise<void> {
    Logger.info(`Logging in with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check if remember me checkbox is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    Logger.info('Checking if Remember Me is selected');
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    const isChecked = await this.page.isChecked(this.selectors.rememberMeCheckbox);
    return isChecked;
  }

  /**
   * Click remember me checkbox
   */
  async clickRememberMe(): Promise<LoginPage> {
    Logger.info('Clicking Remember Me checkbox');
    await this.click(this.selectors.rememberMeCheckbox);
    return this;
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    Logger.info('Clicking Forgot Password link');
    await this.click(this.selectors.forgotPasswordLink);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    Logger.info('Getting error message');
    return await this.getElementText(this.selectors.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    Logger.info('Checking if error message is displayed');
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    Logger.info('Checking if login page is displayed');
    return await this.isElementVisible(this.selectors.loginForm);
  }

  /**
   * Clear all input fields
   */
  async clearAllFields(): Promise<LoginPage> {
    Logger.info('Clearing all input fields');
    await this.typeText(this.selectors.usernameInput, '');
    await this.typeText(this.selectors.passwordInput, '');
    return this;
  }
}
