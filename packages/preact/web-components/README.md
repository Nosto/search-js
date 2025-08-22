# Nosto Web Components

A collection of custom HTML elements that expose core Nosto Search functionality as easy-to-use web components.

## Installation

```bash
npm install @nosto/search-js
```

## Quick Start

### 1. Register the Components

```javascript
import { registerNostoElements } from '@nosto/search-js/preact/web-components'

// Register all components
registerNostoElements()
```

### 2. Use in HTML

```html
<!-- Autocomplete search input -->
<nosto-autocomplete 
  account-id="your-account-id"
  default-currency="USD"
  limit="8">
</nosto-autocomplete>

<!-- Filter sidebar -->
<nosto-filters account-id="your-account-id"></nosto-filters>

<!-- Product results grid -->
<nosto-results 
  account-id="your-account-id"
  limit="24">
</nosto-results>

<!-- Sorting dropdown -->
<nosto-sorting account-id="your-account-id"></nosto-sorting>

<!-- Pagination controls -->
<nosto-pagination account-id="your-account-id"></nosto-pagination>
```

## Components

### NostoAutocomplete

Wraps an input field and renders an autocomplete dropdown with search suggestions.

**Attributes:**
- `account-id` (required) - Your Nosto account ID
- `default-currency` - Default currency for price formatting (default: "EUR")
- `limit` - Maximum number of suggestions to show (default: 5)
- `min-query-length` - Minimum query length to trigger autocomplete (default: 2)
- `debounce-delay` - Debounce delay in milliseconds (default: 500)

**Events Dispatched:**
- `nosto:search-js/autocomplete-select` - When a suggestion is selected
- `nosto:search-js/search` - When a search is submitted

### NostoResults

Renders a grid of search result products.

**Attributes:**
- `account-id` (required) - Your Nosto account ID
- `default-currency` - Default currency for price formatting (default: "EUR")
- `limit` - Number of products per page (default: 24)

**Events Dispatched:**
- `nosto:search-js/results-updated` - When search results are updated

**Events Listened:**
- `nosto:search-js/search` - Performs a new search

### NostoFilters

Renders filter facets and selected filter summary.

**Attributes:**
- `account-id` (required) - Your Nosto account ID

**Events Dispatched:**
- `nosto:search-js/filter-change` - When a filter is toggled

### NostoSorting

Renders a sorting dropdown for search results.

**Attributes:**
- `account-id` (required) - Your Nosto account ID
- `sort-options` - JSON string of custom sort options

**Events Dispatched:**
- `nosto:search-js/sort-change` - When sort option changes

**Default Sort Options:**
```json
[
  {"id": "relevance", "name": "Relevance"},
  {"id": "price-asc", "name": "Price: Low to High"},
  {"id": "price-desc", "name": "Price: High to Low"},
  {"id": "name-asc", "name": "Name: A to Z"},
  {"id": "name-desc", "name": "Name: Z to A"}
]
```

### NostoPagination

Renders pagination controls for search results.

**Attributes:**
- `account-id` (required) - Your Nosto account ID
- `limit` - Number of products per page (should match NostoResults limit)

**Events Dispatched:**
- `nosto:search-js/page-change` - When page changes

**Events Listened:**
- `nosto:search-js/results-updated` - Updates pagination based on results

## Component Communication

All components communicate through custom events with the `nosto:search-js/` prefix:

- `nosto:search-js/search` - Trigger a new search
- `nosto:search-js/filter-change` - Filter was toggled
- `nosto:search-js/sort-change` - Sort option changed
- `nosto:search-js/page-change` - Page changed
- `nosto:search-js/results-updated` - Search results updated
- `nosto:search-js/autocomplete-select` - Autocomplete suggestion selected

### Event Listening

```javascript
document.addEventListener('nosto:search-js/search', (event) => {
  console.log('Search query:', event.detail.query)
})

document.addEventListener('nosto:search-js/filter-change', (event) => {
  console.log('Filter changed:', event.detail.field, event.detail.value, event.detail.active)
})
```

## Advanced Usage

### Individual Component Registration

If you only need specific components:

```javascript
import { registerComponents } from '@nosto/search-js/preact/web-components'

// Register only the components you need
registerComponents.autocomplete()
registerComponents.results()
registerComponents.pagination()
```

### Custom Sort Options

```html
<nosto-sorting 
  account-id="your-account-id"
  sort-options='[
    {"id": "relevance", "name": "Best Match"},
    {"id": "price-asc", "name": "Price: Low to High", "field": "price", "order": "asc"},
    {"id": "popularity", "name": "Most Popular", "field": "popularity", "order": "desc"}
  ]'>
</nosto-sorting>
```

## Browser Support

Requires browsers with Custom Elements support (all modern browsers). For older browsers, you may need polyfills.

## TypeScript

Full TypeScript support is included. Import types:

```typescript
import type { NostoWebComponentConfig } from '@nosto/search-js/preact/web-components'
```

## Examples

See the [demo.html](./demo.html) file for a complete working example.