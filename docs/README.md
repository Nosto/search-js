# Preact Exports Analysis

This directory contains analysis of preact/* module exports in search-js.

## Files

- `preact-exports-analysis.md` - Complete analysis documentation with inventory of all 52 exports
- `../scripts/analyze-preact-usage.cjs` - Node.js script to analyze usage in external repositories

## Usage

Once you have access to the search-templates and search-templates-starter repositories:

```bash
# Clone the repositories
git clone https://github.com/Nosto/search-templates.git /tmp/search-templates
git clone https://github.com/Nosto/search-templates-starter.git /tmp/search-templates-starter

# Run the analysis
node scripts/analyze-preact-usage.cjs /tmp/search-templates /tmp/search-templates-starter
```

The script will:
1. Scan all TypeScript/JavaScript files in the repositories
2. Extract imports from `@nosto/search-js/preact/*` modules
3. Generate a usage report showing used vs unused exports
4. Save detailed results to `/tmp/preact_usage_report.json`

## Current Status

- **Export Inventory**: ✅ Complete (52 exports identified)
- **Usage Analysis**: ⚠️ Pending repository access
- **Final Report**: ⚠️ Waiting for usage data

## Export Summary

- `preact/autocomplete`: 5 exports
- `preact/category`: 1 export
- `preact/common`: 10 exports
- `preact/events`: 4 exports
- `preact/hooks`: 21 exports
- `preact/inject`: 4 exports
- `preact/legacy`: 5 exports
- `preact/serp`: 2 exports

**Total: 52 exports**