# Search JS

Search JS is a wrapper for Nosto Search with features like:

* **Currency formatting**: Format prices based on Nosto settings.
* **Product thumbnails**: Create and customize product images.
* **Retry logic**: Retry failed search queries automatically.
* **Preact components**: Build modern search interfaces.
* **Autocomplete**: Fast and responsive autocomplete tools.
* **Category search**: Display and filter by categories.
* **SERPs**: Build search result pages with sorting and pagination.
* **Utilities**: Helpers for common tasks like merging and equality checks.
  
## Installation
To install the package, use your preferred package manager:

```bash
yarn add @nosto/search-js
# or
npm install @nosto/search-js --save
```

## Documentation

Read [Nosto Techdocs](https://docs.nosto.com/techdocs/apis/frontend/oss/search-js) for more information on how to use the library.

[Library TypeDoc page](https://nosto.github.io/search-js/) includes detailed library helpers documentation and examples.

## Packages

### `core`
The `core` package provides the foundational functionality for interacting with Nosto Search. It includes utilities for managing search queries, applying decorators, and handling search results.

---

### `currencies`
The `currencies` - provides utilities for formatting monetary values and decorating search results with price information.

---

### `preact` packages

#### `preact/autocomplete`
The `preact/autocomplete` - helps you add autocomplete functionality to your search interface. It includes ready-to-use components

#### `preact/category`
The `preact/category` - provides tools to show and interact with category-based search results.

#### `preact/common`
The `preact/common` - includes shared components that are used across other `preact` packages.

#### `preact/hooks`
The `preact/hooks` - offers hooks to manage state and actions in your search app.

#### `preact/serp`
The `preact/serp` - provides tools to create Search Engine Results Pages (SERPs) with features like pagination, sorting, and displaying results.

#### `preact/legacy`
The `preact/legacy` package is designed to provide backward compatibility for existing Search Template implementations.

> The components included in this package are intended solely for compatibility purposes. They are not recommended for use in new development or as active components in modern applications.

### `thumbnails`
The `thumbnails` - helps you create and customize product thumbnails. It supports different formats, including Shopify and Nosto-specific ones.

---

### `utils`
The `utils` package includes handy tools for common tasks like merging objects, checking equality, and generating unique values.