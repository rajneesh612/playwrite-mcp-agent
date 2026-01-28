# Dashboard Test Cases Documentation

## Overview
Comprehensive test cases for Dashboard Page Object Model functionality.

## Test Execution Environment
- Framework: Playwright
- Language: TypeScript
- Pattern: Page Object Model (POM)
- Base Class: BasePage
- Application: OrangeHRM Demo

---

## 1. Dashboard Navigation Tests

### TC-DASH-001: Verify Dashboard Displays After Login
**Objective:** Verify dashboard page loads successfully after login

**Preconditions:** User is logged in with valid credentials

**Steps:**
1. Login with valid credentials
2. Wait for dashboard to load
3. Verify dashboard URL
4. Verify dashboard elements are visible

**Expected Result:**
- Dashboard page displayed
- URL contains `/dashboard/`
- Dashboard title visible
- Side menu displayed
- Top navigation bar present

---

## 2. Dashboard UI Elements Tests

### TC-DASH-002: Verify Dashboard Title
**Objective:** Verify dashboard page has correct title

**Steps:**
1. Navigate to dashboard
2. Get dashboard title text
3. Verify title matches expected value

**Expected Result:**
- Dashboard title displayed as "Dashboard"
- Title is visible and readable

### TC-DASH-003: Verify Side Menu Visibility
**Objective:** Verify side navigation menu is visible

**Steps:**
1. Navigate to dashboard
2. Check if side menu is visible
3. Verify menu items are accessible

**Expected Result:**
- Side menu is visible
- Menu items are clickable
- Menu is properly aligned

### TC-DASH-004: Verify Top Navigation Bar
**Objective:** Verify top navigation bar elements

**Steps:**
1. Navigate to dashboard
2. Check top navigation bar
3. Verify user dropdown present
4. Verify search box present

**Expected Result:**
- Navigation bar visible
- User dropdown accessible
- Search functionality available

---

## 3. Dashboard Widgets Tests

### TC-DASH-005: Verify Dashboard Widgets Display
**Objective:** Verify all dashboard widgets are displayed

**Steps:**
1. Navigate to dashboard
2. Check for Time at Work widget
3. Check for Quick Launch section
4. Verify widget content loads

**Expected Result:**
- All widgets displayed
- Widget content loaded
- No error messages in widgets

### TC-DASH-006: Verify Widget Interactions
**Objective:** Verify dashboard widgets are interactive

**Steps:**
1. Navigate to dashboard
2. Click on widget elements
3. Verify widget expands/collapses
4. Verify widget data refreshes

**Expected Result:**
- Widgets respond to clicks
- Content updates properly
- No UI breaks

---

## 4. User Menu Tests

### TC-DASH-007: Verify User Dropdown Menu
**Objective:** Verify user dropdown menu functionality

**Steps:**
1. Navigate to dashboard
2. Click on user dropdown icon
3. Verify dropdown menu opens
4. Check menu items visible

**Expected Result:**
- Dropdown menu opens on click
- Menu items visible:
  - About
  - Support
  - Change Password
  - Logout
- Menu items are clickable

### TC-DASH-008: Logout from Dashboard
**Objective:** Verify user can logout from dashboard

**Steps:**
1. Navigate to dashboard
2. Click user dropdown
3. Click Logout option
4. Verify redirect to login page

**Expected Result:**
- User logged out successfully
- Redirected to login page
- Session cleared
- Cannot access dashboard without login

---

## 5. Search Functionality Tests

### TC-DASH-009: Verify Search Box Functionality
**Objective:** Verify search box works on dashboard

**Steps:**
1. Navigate to dashboard
2. Click on search box
3. Enter search term
4. Verify search results display

**Expected Result:**
- Search box accepts input
- Search suggestions appear
- Results are relevant
- Search is case-insensitive

### TC-DASH-010: Search with Special Characters
**Objective:** Verify search handles special characters

**Steps:**
1. Navigate to dashboard
2. Enter special characters in search
3. Verify system handles gracefully

**Expected Result:**
- No errors thrown
- Appropriate results or empty state
- UI remains stable

---

## 6. Dashboard Menu Navigation Tests

### TC-DASH-011: Navigate to Different Modules
**Objective:** Verify navigation to different modules from dashboard

**Modules to Test:**
- Admin
- PIM
- Leave
- Time
- Recruitment
- My Info
- Performance

**Steps:**
1. Navigate to dashboard
2. Click on module in side menu
3. Verify navigation to module page
4. Verify breadcrumb updated

**Expected Result:**
- Successfully navigates to module
- URL updated correctly
- Page content loads
- Breadcrumb shows current location

---

## 7. Responsive Design Tests

### TC-DASH-012: Verify Dashboard on Different Resolutions
**Objective:** Verify dashboard is responsive

**Screen Sizes:**
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667

**Expected Result:**
- Layout adjusts to screen size
- All elements accessible
- No horizontal scroll
- Menu collapses on small screens

---

## 8. Performance Tests

### TC-DASH-013: Dashboard Load Time
**Objective:** Verify dashboard loads within acceptable time

**Steps:**
1. Login to application
2. Measure time to dashboard load
3. Verify all widgets load

**Expected Result:**
- Dashboard loads within 5 seconds
- All widgets load within 10 seconds
- No timeout errors

---

## 9. Accessibility Tests

### TC-DASH-014: Keyboard Navigation
**Objective:** Verify dashboard is keyboard accessible

**Steps:**
1. Navigate to dashboard
2. Use Tab to navigate elements
3. Use Enter/Space to activate
4. Use arrow keys for menus

**Expected Result:**
- All elements focusable
- Focus indicators visible
- Logical tab order
- Menu accessible via keyboard

### TC-DASH-015: Screen Reader Compatibility
**Objective:** Verify dashboard works with screen readers

**Expected Result:**
- All elements have proper labels
- ARIA attributes present
- Headings properly structured
- Links have descriptive text

---

## 10. Error Handling Tests

### TC-DASH-016: Handle Session Timeout
**Objective:** Verify behavior when session times out

**Steps:**
1. Login to dashboard
2. Wait for session timeout
3. Try to interact with dashboard
4. Verify redirect to login

**Expected Result:**
- User redirected to login page
- Appropriate message shown
- No data loss
- Can login again

### TC-DASH-017: Handle Network Errors
**Objective:** Verify dashboard handles network issues

**Steps:**
1. Navigate to dashboard
2. Simulate network disconnect
3. Try to interact with widgets
4. Verify error handling

**Expected Result:**
- Appropriate error message
- No page crash
- Retry mechanism available
- Graceful degradation

---

## Test Data

### Valid Dashboard URLs
```typescript
{
  dashboardUrl: '/web/index.php/dashboard/index',
  baseUrl: 'https://opensource-demo.orangehrmlive.com'
}
```

### Dashboard Elements
```typescript
const dashboardElements = {
  title: 'Dashboard',
  widgets: ['Time at Work', 'My Actions', 'Quick Launch', 'Buzz Latest Posts'],
  menuItems: ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance']
};
```

### User Dropdown Menu Items
```typescript
const userMenuItems = [
  'About',
  'Support', 
  'Change Password',
  'Logout'
];
```

---

## Test Execution Priority

| Priority | Test Case | Category | Reason |
|----------|-----------|----------|--------|
| Critical | TC-DASH-001 | Navigation | Core functionality |
| Critical | TC-DASH-008 | Logout | Security |
| High | TC-DASH-002 | UI Elements | User experience |
| High | TC-DASH-007 | User Menu | Navigation |
| Medium | TC-DASH-005 | Widgets | Content display |
| Medium | TC-DASH-011 | Navigation | Module access |
| Low | TC-DASH-012 | Responsive | Design |
| Low | TC-DASH-014 | Accessibility | Compliance |

---

## Page Object Model Structure

### DashboardPage Class
```typescript
class DashboardPage extends BasePage {
  // Selectors
  - dashboard
  - dashboardTitle
  - userDropdown
  - sideMenu
  - widgets
  - searchBox
  
  // Methods
  - isDashboardDisplayed()
  - getDashboardTitle()
  - clickUserDropdown()
  - logout()
  - search()
  - verifyDashboardLoaded()
  - navigateToDashboard()
}
```

---

## Dependencies

### Required Page Objects
- LoginPage (for navigation to dashboard)
- BasePage (parent class)

### Required Utilities
- Logger (for logging)
- Config (for URLs and settings)

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | | | Pending |
| Dev Lead | | | Pending |
| Product Owner | | | Pending |
