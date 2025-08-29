# Preact Module Exports Analysis

## Overview

This document provides a comprehensive analysis of all preact/* module exports in search-js to identify which exports are used in the search-templates and search-templates-starter repositories versus which are unused.

## Methodology

1. **Export Discovery**: Automated parsing of all preact/* module entry files to identify exported functions, components, types, and constants
2. **Usage Analysis**: Search through search-templates and search-templates-starter repositories to identify actual import/usage patterns
3. **Classification**: Categorize exports as "used" or "unused" based on findings

## Complete Export Inventory

### preact/autocomplete (5 exports)
- `AutocompleteElement` - Component for autocomplete UI
- `AutocompleteElementProps` - TypeScript props interface  
- `AutocompletePageProvider` - Context provider for autocomplete pages
- `HistoryElement` - Component for search history
- `SearchInput` - Input component for search

### preact/category (1 export)
- `CategoryPageProvider` - Context provider for category pages

### preact/common (10 exports)
- `ExtendedStore` - TypeScript interface for extended store
- `InfiniteScroll` - Component for infinite scrolling
- `InfiniteScrollProps` - TypeScript props interface
- `InfiniteScrollWithLink` - Link-based infinite scroll component
- `State` - TypeScript interface for application state
- `Store` - TypeScript interface for store
- `StoreContext` - React context for store
- `createExtendableStore` - Factory function for extendable stores
- `createStore` - Factory function for stores
- `defaultState` - Default application state

### preact/events (4 exports)
- `dispatchNostoEvent` - Function to dispatch custom events
- `subscribeToNostoEvent` - Function to subscribe to custom events
- `useEventBusDispatch` - Hook for event dispatching
- `useEventBusSubscribe` - Hook for event subscription

### preact/hooks (21 exports)
- `Page` - TypeScript interface for pagination
- `SpeechToText` - TypeScript interface for speech-to-text
- `UseFacetOptions` - TypeScript interface for facet options
- `speechToTextSupported` - Function to check speech-to-text support
- `useActions` - Hook for accessing actions
- `useDecoratedSearchResults` - Hook for decorated search results
- `useFacet` - Hook for managing facets
- `useFacets` - Hook for managing multiple facets
- `useLoadMore` - Hook for load more functionality
- `useNostoAppState` - Hook for accessing app state
- `usePagination` - Hook for pagination
- `usePersonalization` - Hook for personalization features
- `useProductFilters` - Hook for product filtering
- `useRange` - Hook for range selection
- `useRangeSelector` - Hook for range selector UI
- `useResponse` - Hook for API response handling
- `useSelectedFiltersCount` - Hook for counting selected filters
- `useSizeOptions` - Hook for size option management
- `useSort` - Hook for sorting functionality
- `useSpeechToText` - Hook for speech-to-text functionality
- `useSwatches` - Hook for color/pattern swatches

### preact/inject (4 exports)
- `* (re-export all)` - Re-exports all from init module
- `AutocompleteContext` - Context for autocomplete injection
- `AutocompleteInjectContext` - Context for autocomplete injection state
- `createUserComponentRenderer` - Factory for component rendering

### preact/legacy (5 exports)
- `InfiniteScrollWithObserver` - Legacy infinite scroll with intersection observer
- `getNextPageQuery` - Function to get next page query parameters
- `intersectionObserverSupported` - Function to check intersection observer support
- `newSearch` - Action for initiating new search
- `updateSearch` - Action for updating existing search

### preact/serp (2 exports)
- `SearchPageProvider` - Context provider for search result pages
- `SerpElement` - Component for search result page UI

## Repository Access Status

**Status**: ⚠️ Pending Access

The target repositories for usage analysis are:
- `Nosto/search-templates`
- `Nosto/search-templates-starter`

These repositories appear to be private or inaccessible via the GitHub API. Access is required to complete the usage analysis.

## Usage Analysis Scripts

### Script 1: Find Import Statements
```bash
# Search for all imports from @nosto/search-js/preact
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
  xargs grep -l "from ['\"]@nosto/search-js/preact" | \
  xargs grep "from ['\"]@nosto/search-js/preact"
```

### Script 2: Extract Specific Imports
```bash
# Find specific exported items being imported
grep -r "import.*{.*}" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | \
  grep "@nosto/search-js/preact"
```

### Script 3: Dynamic Import Analysis
```bash
# Check for dynamic imports
grep -r "import(" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | \
  grep "search-js/preact"
```

## Expected Results Structure

Once repository access is available, results will be categorized as:

### Used Exports
- Exports that appear in import statements
- Exports that are referenced in code
- Exports that are used in tests

### Unused Exports  
- Exports that do not appear in any import statements
- Exports that are not referenced in any code files
- Candidates for removal (with semantic versioning considerations)

### Partially Used Exports
- Type exports that are imported but may not be directly used in runtime code
- Re-exported items that are imported but not directly referenced

## Recommendations

Final recommendations will include:

1. **Safe to Remove**: Exports with no usage that can be safely removed
2. **Keep for API Compatibility**: Exports that should be maintained for backward compatibility
3. **Consider Deprecation**: Exports with minimal usage that could be deprecated in future versions
4. **Public API Preservation**: Exports that are part of the intended public API

## Total Export Count

**52 exports** across 8 preact modules have been identified for analysis.

---

*Analysis completed on: 2025-08-29*  
*Repository access required to complete usage analysis*