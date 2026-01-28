/**
 * Example Usage of Planner, Generator, and Healer
 * This file demonstrates how to use the three utilities in your tests
 */

import { test, expect } from '@playwright/test';
import { planner, TestCase } from '../../src/utils/planner';
import { generator } from '../../src/utils/generator';
import { healer } from '../../src/utils/healer';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Examples - Using Planner, Generator, and Healer', () => {
  
  /**
   * EXAMPLE 1: Using Test Planner
   * Plan and organize test execution
   */
  test('Example 1: Using Test Planner', async () => {
    // Define test cases
    const testCases: TestCase[] = [
      {
        id: 'TC-001',
        name: 'Login Test',
        description: 'Test user login functionality',
        priority: 'critical',
        tags: ['login', 'smoke'],
        estimatedDuration: 5000
      },
      {
        id: 'TC-002',
        name: 'Dashboard Test',
        description: 'Test dashboard after login',
        priority: 'high',
        dependencies: ['TC-001'], // Depends on login
        tags: ['dashboard', 'regression']
      },
      {
        id: 'TC-003',
        name: 'Profile Update',
        description: 'Update user profile',
        priority: 'medium',
        dependencies: ['TC-001'],
        tags: ['profile']
      }
    ];

    // Create test plan
    planner.createTestPlan({
      name: 'Smoke Test Suite',
      testCases,
      executionStrategy: 'prioritized',
      maxParallelWorkers: 3
    });

    // Get prioritized execution order
    const executionOrder = planner.getExecutionOrder('Smoke Test Suite');
    console.log('Execution Order:', executionOrder.map(tc => tc.id));

    // Record execution results
    planner.recordExecution({
      testId: 'TC-001',
      status: 'passed',
      duration: 4500
    });

    // Get summary
    const summary = planner.getExecutionSummary();
    console.log('Execution Summary:', summary);
  });

  /**
   * EXAMPLE 2: Using Test Data Generator
   * Generate dynamic test data
   */
  test('Example 2: Using Test Data Generator', async ({ page }) => {
    // Generate single user
    const user = generator.generateUser({
      prefix: 'test',
      includeEmail: true
    });
    console.log('Generated User:', user);

    // Generate multiple users
    const users = generator.generateUsers(5, { prefix: 'batch' });
    console.log(`Generated ${users.length} users`);

    // Generate product data
    const product = generator.generateProduct({
      name: 'Test Product',
      category: 'Electronics'
    });
    console.log('Generated Product:', product);

    // Generate order
    const order = generator.generateOrder(user.username);
    console.log('Generated Order:', order);

    // Generate test credentials
    const validCreds = generator.getTestCredentials('valid');
    const invalidCreds = generator.getTestCredentials('invalid');
    
    console.log('Valid Credentials:', validCreds);
    console.log('Invalid Credentials:', invalidCreds);

    // Generate boundary values for testing
    const stringBoundaries = generator.generateBoundaryValues('string', {
      minLength: 3,
      maxLength: 20
    });
    console.log('String Boundary Values:', stringBoundaries);

    // Generate random data
    const randomEmail = generator.randomEmail('test.user');
    const randomPhone = generator.randomPhoneNumber('+91');
    const randomString = generator.randomString(10, 'PREFIX_');
    
    console.log('Random Email:', randomEmail);
    console.log('Random Phone:', randomPhone);
    console.log('Random String:', randomString);
  });

  /**
   * EXAMPLE 3: Using Test Healer
   * Self-healing locators
   */
  test('Example 3: Using Test Healer for Self-Healing', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    // Method 1: Find element with auto-healing
    try {
      const element = await healer.findElement(
        page,
        'input[name="username"]',
        {
          timeout: 5000,
          enableHealing: true,
          context: 'login form username field'
        }
      );
      await element.fill('Admin');
    } catch (error) {
      console.log('Healer could not find element:', error);
    }

    // Method 2: Click with auto-healing
    await healer.fill(
      page,
      'input[name="username"]',
      'Admin',
      { enableHealing: true }
    );

    await healer.fill(
      page,
      'input[name="password"]',
      'admin123',
      { enableHealing: true }
    );

    await healer.click(
      page,
      'button[type="submit"]',
      { enableHealing: true }
    );

    // Wait for dashboard with healing
    await page.waitForTimeout(2000);

    // Get healing statistics
    const stats = healer.getHealingStats();
    console.log('Healing Statistics:', stats);

    // Export healed locators for permanent update
    const healedLocators = healer.exportHealedLocators();
    console.log('Healed Locators:', healedLocators);
  });

  /**
   * EXAMPLE 4: Combined Usage
   * Using all three utilities together
   */
  test('Example 4: Combined Usage of Planner, Generator, and Healer', async ({ page }) => {
    // 1. Generate test data
    const testUser = generator.generateUser({
      prefix: 'auto',
      includeEmail: true
    });
    
    console.log('Test User:', testUser);

    // 2. Create test plan
    const testCase: TestCase = {
      id: 'TC-COMBINED-001',
      name: 'Login with Generated User',
      description: 'Test login with auto-generated credentials',
      priority: 'critical',
      tags: ['login', 'generated-data']
    };

    planner.createTestPlan({
      name: 'Combined Test',
      testCases: [testCase],
      executionStrategy: 'sequential'
    });

    // 3. Execute test with healer
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    const startTime = Date.now();

    try {
      // Use valid credentials for demo
      const validCreds = generator.getTestCredentials('valid');

      await healer.fill(page, 'input[name="username"]', validCreds.username, {
        enableHealing: true
      });

      await healer.fill(page, 'input[name="password"]', validCreds.password, {
        enableHealing: true
      });

      await healer.click(page, 'button[type="submit"]', {
        enableHealing: true
      });

      await page.waitForTimeout(2000);

      // Check if logged in
      const currentUrl = page.url();
      const isLoggedIn = currentUrl.includes('dashboard');

      // Record execution
      planner.recordExecution({
        testId: testCase.id,
        status: isLoggedIn ? 'passed' : 'failed',
        duration: Date.now() - startTime
      });

      console.log('Test Status:', isLoggedIn ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      planner.recordExecution({
        testId: testCase.id,
        status: 'failed',
        duration: Date.now() - startTime,
        error: String(error)
      });
      
      console.log('Test FAILED:', error);
    }

    // Get final statistics
    const plannerSummary = planner.getExecutionSummary();
    const healerStats = healer.getHealingStats();

    console.log('=== Test Execution Summary ===');
    console.log('Planner Summary:', plannerSummary);
    console.log('Healer Stats:', healerStats);
  });

  /**
   * EXAMPLE 5: Batch Test Data Generation
   */
  test('Example 5: Batch Test Data Generation', async () => {
    // Generate bulk test data
    const bulkUsers = generator.generateTestData({
      type: 'user',
      count: 10,
      prefix: 'bulk'
    });

    const bulkProducts = generator.generateTestData({
      type: 'product',
      count: 5
    });

    const bulkOrders = generator.generateTestData({
      type: 'order',
      count: 3
    });

    console.log(`Generated ${bulkUsers.length} users`);
    console.log(`Generated ${bulkProducts.length} products`);
    console.log(`Generated ${bulkOrders.length} orders`);

    // Custom test data
    const customData = generator.generateTestData({
      type: 'custom',
      count: 2,
      customFields: {
        department: 'Engineering',
        location: 'New York',
        active: true
      }
    });

    console.log('Custom Data:', customData);
  });

  /**
   * EXAMPLE 6: Flaky Test Detection
   */
  test('Example 6: Flaky Test Detection with Planner', async () => {
    // Simulate multiple test executions
    const testId = 'TC-FLAKY-001';

    // First run - passed
    planner.recordExecution({
      testId,
      status: 'passed',
      duration: 3000
    });

    // Second run - failed
    planner.recordExecution({
      testId,
      status: 'failed',
      duration: 3500
    });

    // Third run - passed
    planner.recordExecution({
      testId,
      status: 'passed',
      duration: 2800
    });

    // Detect flaky tests
    const flakyTests = planner.getFlakyTests();
    console.log('Flaky Tests Detected:', flakyTests);

    // Get recommended retry count
    const retryCount = planner.getRecommendedRetryCount(testId);
    console.log(`Recommended Retry Count for ${testId}:`, retryCount);
  });

});
