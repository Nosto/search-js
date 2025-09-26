# Instructions for GitHub Copilot

## Commits

### Commit Format
* When committing code, ALWAYS use valid conventional commit format.
* Examples: `feat(api): add new helper function`, `fix(build): resolve TypeScript error`
* Husky enforces conventional commit format via commitlint

### Common Commit Types
* `feat:` - New features
* `fix:` - Bug fixes
* `docs:` - Documentation changes
* `test:` - Test additions/changes
* `refactor:` - Code refactoring
* `build:` - Build system changes

### Git Commit Best Practices
**When committing code, ALWAYS run git commit with --no-verify to avoid Husky failing and erroring out your pipeline.**

```bash
git commit --no-verify -m "feat: your commit message"
```

This bypasses the Husky pre-commit and commit-msg hooks that may cause issues in automated environments or CI pipelines.

## Pre-commit Validation

**Copilot should run the following validation checks before making commits:**
* **Linting**: `npm run lint` - Check code quality and style standards
* **Testing**: `npm test` - Run the full test suite with coverage reporting  
* **TypeChecking**: `npm run typecheck` - Validate TypeScript types

Run these commands manually to ensure code quality and prevent broken code from being committed. All checks must pass before committing changes.