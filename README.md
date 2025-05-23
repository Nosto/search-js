# Search JS

Nosto Search JS is an implementation of Nosto Search. In addition to the base search functionality, it also provides the following features:

* **Currency formatting**: Format prices based on Nosto settings.
* **Product thumbnails**: Thumbnail resizing.
* **Retry logic**: Retry failed search queries automatically.
* **Preact components**: Build modern search interfaces.
* **Autocomplete**: Fast and responsive autocomplete tools.
* **Category search**: Display and filter by categories.
* **SERPs**: Build search result pages with sorting and pagination.
* **Utilities**: Helpers for common tasks like array or object merging and equality checks.
* **Infinite scroll**: Loads more components upon scrolling to the end of results.
  
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
The `currencies` package provides utilities for formatting monetary values and decorating search results with price information.

---

### `preact` packages

#### `preact/autocomplete`
The `preact/autocomplete` package helps you add autocomplete functionality to your search interface.

#### `preact/category`
The `preact/category` package provides tools to show and interact with category-based search results.

#### `preact/common`
The `preact/common` package includes shared components that are used across other `preact` packages.

#### `preact/hooks`
The `preact/hooks` package offers hooks to manage state and actions in your search app.

#### `preact/serp`
The `preact/serp` package provides tools to create Search Engine Results Pages (SERPs) with features like pagination, sorting, and displaying results.

#### `preact/legacy`
The `preact/legacy` package is designed to provide backward compatibility for existing Search Template implementations.

> The components included in this package are intended solely for compatibility purposes. They are not recommended for use in new development or as active components in modern applications.

### `thumbnails`
The `thumbnails` package helps you resize thumbnails. It supports different formats, including Shopify and Nosto-specific ones.

---

### `utils`
The `utils` package includes handy tools for common tasks like array or object merging, checking equality, and generating unique values.