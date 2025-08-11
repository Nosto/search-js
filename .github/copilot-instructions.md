# Instructions for GitHub Copilot

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information in these instructions is incomplete or found to be in error.**

Nosto Search JS is a monorepo library for implementing Nosto Search functionality with TypeScript, Preact components, and comprehensive utilities for building modern search interfaces.

## Repository Structure

The repository contains multiple packages in a monorepo structure:
- **core**: Base search functionality and API integration
- **currencies**: Price formatting and currency utilities  
- **thumbnails**: Image resizing and thumbnail management
- **utils**: Common utilities (arrays, objects, equality checks, performance helpers)
- **preact packages**: React-like components for search UIs
  - `autocomplete`: Search autocomplete components
  - `category`: Category filtering and display
  - `common`: Shared components and actions
  - `events`: Event handling utilities
  - `hooks`: Custom Preact hooks for state management
  - `legacy`: Backward compatibility components
  - `serp`: Search Engine Results Page components
- **dev/preact**: Development demo application for testing components

## Working Effectively

### Initial Setup and Dependencies
Always run these commands in order for a fresh repository setup:

```bash
# Install root dependencies (NEVER CANCEL: takes ~2 minutes)
npm ci

# Install dev app dependencies (NEVER CANCEL: takes ~1 minute) 
cd dev/preact && npm ci && cd ../..
```

Set timeout to 180+ seconds for dependency installation commands.

### Building the Project
```bash
# Main build - NEVER CANCEL: takes ~15 seconds, set timeout to 60+ seconds
npm run build
```

This command runs: TypeScript compilation → Vite bundling → TypeDoc documentation generation.
The build creates the `dist/` directory with all package bundles and the `docs/` directory with generated documentation.

### Testing
```bash
# Run all tests - NEVER CANCEL: takes ~25 seconds, set timeout to 60+ seconds  
npm test

# Run only core library tests with coverage
npm run test:core

# Run tests in watch mode for active development
npm run test:watch
```

The test suite includes 47 test files with 200+ tests. Coverage thresholds are set at 80% for all metrics.

### Linting and Code Quality
```bash
# Check code quality - takes ~5 seconds
npm run lint

# Auto-fix linting issues - ALWAYS run before committing
npm run lint-fix
```

### Development Server
```bash
# Start development environment (library watch + dev app)
npm run dev

# Or start individual components:
# Library watch mode
npm run dev:library

# Dev app only (runs on http://localhost:8000)
cd dev/preact && npm run dev
```

The dev app runs on port 8000, not 5173 as mentioned in its README.

## Validation

### CRITICAL: Manual Validation Requirements
After making any changes, ALWAYS run through these validation steps:

1. **Build Validation**: 
   ```bash
   npm run build
   ```
   Ensure no build errors and all packages compile successfully.

2. **Test Validation**:
   ```bash
   npm test
   ```
   All tests must pass. Some expected warnings (jsdom navigation, intentional search errors) are normal.

3. **Lint Validation**:
   ```bash
   npm run lint-fix
   npm run lint
   ```
   Code must pass all linting rules.

4. **Development App Validation**:
   ```bash
   cd dev/preact
   npm run build
   npm run test
   npm run dev
   ```
   Verify the demo app builds, tests pass, and starts correctly on port 8000.

### End-to-End Validation Scenarios
Always test these scenarios when making changes to components:

- **Search Flow**: Start dev app, enter search terms, verify results display
- **Autocomplete**: Type in search box, verify suggestions appear
- **Filtering**: Apply category or product filters, verify results update
- **Pagination**: Navigate through result pages, verify loading and display
- **Infinite Scroll**: Scroll to bottom of results, verify more results load

## Timing Expectations and Timeouts

**CRITICAL: NEVER CANCEL long-running commands. Always set appropriate timeouts:**

- `npm ci` (root): ~90 seconds - set timeout to 180+ seconds
- `npm ci` (dev/preact): ~45 seconds - set timeout to 120+ seconds  
- `npm run build`: ~15 seconds - set timeout to 60+ seconds
- `npm test`: ~25 seconds - set timeout to 60+ seconds
- `npm run lint`: ~5 seconds - set timeout to 30+ seconds

## Coding Standards

- Use closures over classes
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid 'any' type usage
- Use const (and let) over var
- Use async/await instead of Promise chaining 
- Use individual named exports over bulk exports
- Favor named exports over default exports

## Testing Standards

- Use vitest as the test framework 
- Use 'describe' and 'it' for test structure
- Use 'beforeEach' for setup
- Use 'afterEach' for cleanup
- Use 'expect' for assertions
- Maintain 80%+ code coverage thresholds

## CI Pipeline Requirements

The CI process (.github/workflows/ci.yml) requires:
- Node.js 22
- Successful build of both main library and dev app
- All tests passing (core + dev app)
- Linting with no errors
- Coverage thresholds met

Always run these commands locally before pushing:
```bash
npm run lint-fix
npm run build  
npm test
cd dev/preact && npm run build && npm run test
```

## Key File Locations

### Frequently Modified Files
- `packages/core/src/` - Main search functionality
- `packages/preact/*/src/` - Component implementations
- `packages/utils/src/` - Utility functions
- `vite.config.ts` - Build configuration
- `eslint.config.js` - Linting configuration

### Configuration Files
- `package.json` - Root package configuration and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build and test configuration  
- `.github/workflows/` - CI/CD pipeline definitions

### Documentation
- `README.md` - Project overview and basic usage
- `docs/` - Generated TypeDoc documentation
- `CHANGELOG.md` - Version history and changes

## Common Tasks

When adding new functionality:
1. Identify the appropriate package (core, utils, preact/*)
2. Add implementation with proper TypeScript types
3. Write comprehensive tests
4. Update documentation if needed
5. Run full validation workflow
6. Ensure dev app demonstrates the new feature if applicable

When fixing bugs:
1. Create a failing test that reproduces the issue
2. Implement the minimal fix
3. Verify the test passes
4. Run full validation workflow
5. Check that related functionality still works

## Package Exports

The library uses a complex export structure. Key exports:
- `.` (core functionality)
- `./currencies` 
- `./thumbnails`
- `./utils`
- `./preact/autocomplete`
- `./preact/category` 
- `./preact/common`
- `./preact/events`
- `./preact/hooks`
- `./preact/legacy`
- `./preact/serp`

Always verify exports work correctly after making changes by testing imports in the dev app.
