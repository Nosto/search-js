# Search JS

Search JS is a wrapper for the Nosto Search functionality with some extended functionality such as:

* **Nosto currency formatting**: Provides utilities for formatting prices according to Nosto's currency settings, ensuring consistent and localized price displays.
* **Nosto product thumbnails**: Includes tools for generating and customizing product thumbnails, supporting various configurations like Shopify and Nosto-specific formats.
* **Retry logic**: Implements robust retry mechanisms for handling transient errors in search queries, ensuring reliable and consistent search results.
* **Preact components**: Offers a collection of reusable Preact components and hooks for building modern, interactive search interfaces.
* **Autocomplete support**: Includes pre-built components and utilities for creating fast and responsive autocomplete experiences.
* **Category-based search**: Provides tools for displaying and interacting with category-specific search results, including hierarchical structures and filtering.
* **Search Engine Results Pages (SERPs)**: Features components for building full-featured SERPs with pagination, sorting, and result rendering.
* **Utility functions**: Includes general-purpose utilities for simplifying common tasks like deep merging, equality checks, and unique value generation.

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

> This package is intended for advanced use cases where direct interaction with the search logic is required. It is recommended for developers building custom integrations or extending the library's functionality.

---

### `currencies`
The `currencies` package provides utilities for formatting monetary values and decorating search results with price information. It includes support for Nosto's currency settings and localization.

> This package is ideal for applications that need to display prices in a user-friendly format, adhering to Nosto's currency configuration.

---

### `preact`
The `preact` package is the main package for building Preact-based applications with Nosto Search. It includes components, hooks, and utilities for creating search experiences.

> It provides modern, reusable components and hooks for building search interfaces.
#### `preact/autocomplete`
The `preact/autocomplete` package provides components and utilities for building autocomplete functionality in search interfaces. It includes pre-built components for input fields, suggestions, and result rendering.

> This package is ideal for creating fast and responsive autocomplete experiences.

#### `preact/category`
The `preact/category` package includes components and utilities for displaying and interacting with category-based search results. It supports hierarchical category structures and filtering.

> This package is useful for applications that need to display category-specific search results.

#### `preact/common`
The `preact/common` package provides shared components and utilities used across other `preact` sub-packages. It includes reusable building blocks such as buttons, loaders, and layout components.

> This package is intended for internal use but can also be leveraged to maintain consistency across custom components.

#### `preact/hooks`
The `preact/hooks` package offers a collection of hooks for managing state and side effects in Preact-based search applications. It includes hooks for handling search queries, results, and user interactions.

> This package is recommended for developers who prefer using hooks to build custom search logic and components.

#### `preact/serp`
The `preact/serp` package provides components and utilities for building Search Engine Results Pages (SERPs). It includes features for pagination, sorting, and displaying search results.

> This package is ideal for creating full-featured search result pages.
#### `preact/legacy`
The `preact/legacy` package is designed to provide backward compatibility for existing Search Template implementations. It serves as a bridge to support legacy functionality.

> The components included in this package are intended solely for compatibility purposes. They are not recommended for use in new development or as active components in modern applications.

### `thumbnails`
The `thumbnails` package provides utilities for generating and decorating product thumbnails. It supports various thumbnail configurations, including Shopify and Nosto-specific formats.

> This package is useful for applications that require dynamic thumbnail generation or customization of product images.

---

### `utils`
The `utils` package includes general-purpose utilities used across the library. These utilities provide helper functions for tasks such as deep merging, equality checks, and unique value generation.

> This package is intended for internal use but can also be leveraged in custom implementations to simplify common operations.