# Search JS

Search JS is a wrapper for the Nosto Search functionality with some extended functionality such as
* Nosto currency formatting
* Nosto product thumbnails
* Retry logic

## Installation

To install the package, use your preferred package manager:

```bash
yarn add @nosto/search-js
# or
npm install @nosto/search-js --save
```

## Nosto stub

When using this library, it is not necessary to create the Nosto stub. It will be created automatically as soon as the library is imported for the first time.

## Usage

The main export of this library is the `search` function. It is compatible with the search function of the Nosto JS API and adds a couple of additional options

```ts
import { search, priceDecorator } from "@nosto/search-js"

const response = await search({
    query: 'my search',
    products: { 
        fields: [
            "productId",
            "name",
            "price",
            "listPrice",
            "priceCurrencyCode"
        ] 
    }
}, {
    track: 'serp',
    hitDecorators: [
        priceDecorator()
    ]
})

```