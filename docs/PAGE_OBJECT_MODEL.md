# Page Object Model Documentation

## Overview

The Page Object Model (POM) is a design pattern that creates an abstraction layer for web elements. It helps create maintainable and readable test code.

## Structure

### BasePage
The base class that all page objects extend from. Provides common functionality like:
- Navigation
- Element interactions
- Wait conditions
- Assertions

### Page Objects
Individual page classes for each page/screen in your application.

Example structure:
```
src/pages/
├── BasePage.ts           # Base class
├── LoginPage.ts          # Login page object
├── DashboardPage.ts      # Dashboard page object
└── ProductPage.ts        # Product page object
```

## Best Practices

1. **One page object per page** - Each page should have its own class
2. **Encapsulate elements** - Keep selectors private
3. **Public methods for actions** - Expose only necessary actions
4. **Readable method names** - Use descriptive names
5. **Return page objects** - For navigation, return the next page object

## Example Usage

```typescript
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

const loginPage = new LoginPage();
const dashboardPage: DashboardPage = await loginPage
  .enterUsername('user@example.com')
  .enterPassword('password')
  .clickLogin();

expect(await dashboardPage.isDisplayed()).toBe(true);
```

## Benefits

- Reduces code duplication
- Improves test readability
- Simplifies maintenance
- Increases reusability
