# Test Utilities Documentation

## Overview
This document explains the three main utilities created for the Playwright test automation framework:

1. **Planner** - Test execution planning and management
2. **Generator** - Test data generation
3. **Healer** - Self-healing locators

---

## 1. Test Planner (`planner.ts`)

### Purpose
Manages test execution strategy, prioritization, and tracking. Helps organize tests efficiently.

### Key Features
- ✅ Test case prioritization (critical, high, medium, low)
- ✅ Dependency management
- ✅ Multiple execution strategies (sequential, parallel, prioritized)
- ✅ Test execution history tracking
- ✅ Flaky test detection
- ✅ Execution summary and statistics

### Usage Examples

```typescript
import { planner, TestCase } from '../src/utils/planner';

// Define test cases
const testCases: TestCase[] = [
  {
    id: 'TC-001',
    name: 'Login Test',
    description: 'Test user login',
    priority: 'critical',
    tags: ['login', 'smoke'],
    estimatedDuration: 5000
  },
  {
    id: 'TC-002',
    name: 'Dashboard Test',
    priority: 'high',
    dependencies: ['TC-001'], // Run after TC-001
    tags: ['dashboard']
  }
];

// Create test plan
planner.createTestPlan({
  name: 'Smoke Test Suite',
  testCases,
  executionStrategy: 'prioritized'
});

// Get execution order
const order = planner.getExecutionOrder('Smoke Test Suite');

// Record test result
planner.recordExecution({
  testId: 'TC-001',
  status: 'passed',
  duration: 4500
});

// Get statistics
const summary = planner.getExecutionSummary();
const flakyTests = planner.getFlakyTests();
```

---

## 2. Test Data Generator (`generator.ts`)

### Purpose
Generates realistic and dynamic test data for various test scenarios.

### Key Features
- ✅ User data generation (username, email, password, etc.)
- ✅ Product data generation
- ✅ Order data generation
- ✅ Random data utilities (strings, numbers, emails, phones, dates)
- ✅ Boundary value testing
- ✅ CSV data generation
- ✅ Bulk data generation

### Usage Examples

```typescript
import { generator } from '../src/utils/generator';

// Generate single user
const user = generator.generateUser({
  prefix: 'test',
  includeEmail: true
});
// Output: { username: 'test_abc123', password: 'Pass@xyz789', email: '...', ... }

// Generate multiple users
const users = generator.generateUsers(10, { prefix: 'batch' });

// Generate product
const product = generator.generateProduct({
  name: 'Test Product',
  category: 'Electronics'
});

// Generate order
const order = generator.generateOrder(user.username);

// Get test credentials
const validCreds = generator.getTestCredentials('valid');
const invalidCreds = generator.getTestCredentials('invalid');

// Random utilities
const email = generator.randomEmail('john.doe');
const phone = generator.randomPhoneNumber('+91');
const randomStr = generator.randomString(10, 'PREFIX_');
const randomNum = generator.randomNumber(1, 100);

// Boundary values
const boundaries = generator.generateBoundaryValues('string', {
  minLength: 3,
  maxLength: 20
});

// Bulk generation
const bulkData = generator.generateTestData({
  type: 'user',
  count: 50,
  prefix: 'bulk'
});
```

---

## 3. Test Healer (`healer.ts`)

### Purpose
Self-healing mechanism that automatically detects and fixes broken locators when elements change.

### Key Features
- ✅ Automatic locator healing
- ✅ Multiple fallback strategies (testId, id, name, aria-label, text, etc.)
- ✅ Locator caching for performance
- ✅ Healing statistics and history
- ✅ Export healed locators
- ✅ Smart element finding with priority-based strategies

### Usage Examples

```typescript
import { healer } from '../src/utils/healer';

// Find element with auto-healing
const element = await healer.findElement(
  page,
  'input[name="username"]',
  {
    timeout: 5000,
    enableHealing: true,
    context: 'login form username field'
  }
);

// Click with auto-healing
await healer.click(
  page,
  'button[type="submit"]',
  { enableHealing: true }
);

// Fill input with auto-healing
await healer.fill(
  page,
  'input[name="username"]',
  'Admin',
  { enableHealing: true }
);

// Get text with auto-healing
const text = await healer.getText(
  page,
  '.dashboard-title',
  { enableHealing: true }
);

// Wait for element with auto-healing
await healer.waitFor(
  page,
  '.loading-spinner',
  { 
    enableHealing: true, 
    state: 'hidden' 
  }
);

// Get healing statistics
const stats = healer.getHealingStats();
console.log(stats);
// Output: { totalAttempts: 5, successful: 4, failed: 1, successRate: 80, cachedLocators: 4 }

// Export healed locators for permanent updates
const healedLocators = healer.exportHealedLocators();
console.log(healedLocators);
// Output: [{ original: 'input[name="old"]', healed: '#username', strategy: 'css' }]

// Clear cache when needed
healer.clearCache();
```

---

## How Healer Works

When a locator fails, the healer automatically tries multiple strategies in priority order:

1. **data-testid** (highest priority)
2. **id attribute**
3. **name attribute**
4. **aria-label**
5. **placeholder**
6. **role**
7. **text content**
8. **class names** (lowest priority)

Once a working locator is found, it's cached for future use.

---

## Combined Usage Example

```typescript
test('Complete workflow with all utilities', async ({ page }) => {
  // 1. Generate test data
  const user = generator.generateUser({ prefix: 'auto' });
  
  // 2. Plan test execution
  planner.createTestPlan({
    name: 'Login Flow',
    testCases: [{
      id: 'TC-001',
      name: 'Login Test',
      priority: 'critical'
    }],
    executionStrategy: 'sequential'
  });
  
  // 3. Execute with self-healing
  await page.goto('https://app.com');
  
  await healer.fill(page, '#username', user.username, { enableHealing: true });
  await healer.fill(page, '#password', user.password, { enableHealing: true });
  await healer.click(page, 'button[type="submit"]', { enableHealing: true });
  
  // 4. Record results
  planner.recordExecution({
    testId: 'TC-001',
    status: 'passed',
    duration: 5000
  });
  
  // 5. Get insights
  console.log('Planner Summary:', planner.getExecutionSummary());
  console.log('Healer Stats:', healer.getHealingStats());
});
```

---

## Best Practices

### Planner
- Define all test cases upfront with proper priorities
- Use tags for easy filtering (smoke, regression, etc.)
- Track dependencies to ensure correct execution order
- Monitor flaky tests and increase retry counts accordingly

### Generator
- Use appropriate prefixes to identify test data
- Generate fresh data for each test run to avoid conflicts
- Use boundary values for validation testing
- Save generated data when debugging is needed

### Healer
- Always enable healing in CI/CD environments
- Review healed locators and update page objects permanently
- Use meaningful context descriptions
- Monitor healing statistics to identify problematic elements
- Clear cache when page structure changes significantly

---

## Files Created

1. `src/utils/planner.ts` - Test planning and execution management
2. `src/utils/generator.ts` - Test data generation
3. `src/utils/healer.ts` - Self-healing locators
4. `tests/specs/examples.spec.ts` - Complete usage examples
5. `docs/UTILITIES_GUIDE.md` - This documentation

---

## Running Examples

```bash
# Run all examples
npx playwright test examples.spec.ts

# Run specific example
npx playwright test examples.spec.ts -g "Example 1"

# Run with UI mode
npx playwright test examples.spec.ts --ui

# Run with debug mode
npx playwright test examples.spec.ts --debug
```

---

## Support

For issues or questions about these utilities, please refer to:
- Example test file: `tests/specs/examples.spec.ts`
- Source code comments in each utility file
- Playwright documentation: https://playwright.dev
