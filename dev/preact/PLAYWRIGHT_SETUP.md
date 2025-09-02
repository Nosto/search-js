# Playwright Testing Setup for dev/preact

This document describes the Playwright testing setup added to the dev/preact application.

## Files Added/Modified

### 1. Dependencies Added
- `@playwright/test` - Added to `dev/preact/package.json` as a dev dependency

### 2. Configuration Files

#### `playwright.config.ts`
- Created Playwright configuration file with:
  - Test directory set to `./tests/e2e`
  - Base URL configured to `http://localhost:8000`
  - Chromium browser project configured to use system chromium
  - Web server integration to automatically start/stop dev server during tests
  - HTML reporter for test results

#### Updated `vite.config.ts`
- Added `include` and `exclude` patterns to prevent vitest from running Playwright tests
- Vitest now only runs tests in the `test/` directory
- Playwright tests in `tests/e2e/` are excluded from vitest

### 3. Test Structure

#### `tests/e2e/home.spec.ts`
- Simple end-to-end test that:
  - Opens the home page (`/`)
  - Verifies the page title contains "Vite + Preact"
  - Checks that key DOM elements are visible (app div, main element, home component)
  - Validates the welcome message content is rendered correctly

### 4. NPM Scripts Added
- `test:e2e` - Runs Playwright tests
- `test:e2e:ui` - Runs Playwright tests with UI mode

## Usage

### Running Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run unit tests (vitest)
npm test
```

### Test Isolation
- Unit tests (vitest) and e2e tests (Playwright) run independently
- Each test framework only processes its intended test files
- No conflicts between test runners

## Technical Notes

### Browser Setup
- Uses system chromium browser instead of downloading Playwright browsers
- This approach works reliably in CI/containerized environments
- No additional browser downloads required

### Dev Server Integration
- Playwright automatically starts the dev server before running tests
- Server runs on port 8000 (matching vite config)
- Automatic cleanup when tests complete
- Reuses existing server in non-CI environments

### Test Structure
- Tests are organized in `tests/e2e/` directory
- Follows standard Playwright conventions
- Uses describe/test structure for organized test suites

## Benefits

1. **Complete UI Testing**: Tests the actual rendered application in a real browser
2. **Automatic Server Management**: No manual server startup required
3. **Isolated Test Environments**: Unit and e2e tests don't interfere with each other
4. **CI/CD Ready**: Works in containerized and CI environments
5. **Minimal Dependencies**: Uses system browser, no heavy downloads