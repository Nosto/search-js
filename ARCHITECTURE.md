# Search-JS Architecture Diagram

This document provides a visual component diagram of the search-js library structure, showing the top-level modules and their main exports.

## Component Diagram

```mermaid
graph TB
    subgraph "Search-JS Library"
        
        subgraph Core["🔍 core"]
            CoreSearch["search()"]
            CoreAddToCart["addToCart()"]
            CoreTypes["Types:<br/>• DecoratedProduct<br/>• DecoratedResult<br/>• SearchOptions<br/>• HitDecorator"]
        end
        
        subgraph Currencies["💰 currencies"] 
            CurrencyFormatting["getCurrencyFormatting()"]
            PriceDecorator["priceDecorator()"]
            CurrencyTypes["Types:<br/>• CurrencyConfig<br/>• CurrencyFormats<br/>• FormattedPrices<br/>• Result"]
        end
        
        subgraph Thumbnails["🖼️ thumbnails"]
            GenerateThumbnail["generateThumbnailUrl()"]
            NostoThumbDecorator["nostoThumbnailDecorator()"]
            ShopifyThumbDecorator["shopifyThumbnailDecorator()"]
            ThumbnailDecorator["thumbnailDecorator()"]
            ThumbTypes["Types:<br/>• NostoSize<br/>• ShopifySize<br/>• NostoShopifySize"]
        end
        
        subgraph Utils["🛠️ utils"]
            BindInput["bindInput()"]
            Cl["cl()"]
            DeepMerge["deepMerge()"]
            IsEqual["isEqual()"]
            IsPlainObject["isPlainObject()"]
            IsBot["isBot()"]
            Logger["logger"]
            MergeArrays["mergeArrays()"]
            ParseNumber["parseNumber()"]
            Measure["measure()"]
            Pick["pick()"]
            Unique["unique()"]
            UtilTypes["Types:<br/>• Merge<br/>• PlainMerge<br/>• Simplify<br/>• Unfreeze<br/>• BindElementOptions<br/>• InputBindingCallbacks"]
        end
        
        subgraph Preact["⚛️ preact"]
            
            subgraph PreactAutocomplete["preact/autocomplete"]
                AutocompleteProvider["AutocompletePageProvider"]
                SearchInput["SearchInput"]
                AutocompleteElement["AutocompleteElement"]
                HistoryElement["HistoryElement"]
                AutocompleteConfig["AutocompleteConfig"]
            end
            
            subgraph PreactCategory["preact/category"]
                CategoryProvider["CategoryPageProvider"]
                CategoryConfig["CategoryConfig"]
            end
            
            subgraph PreactCommon["preact/common"]
                InfiniteScroll["InfiniteScroll"]
                InfiniteScrollLink["InfiniteScrollWithLink"]
                CreateStore["createStore()"]
                DefaultState["defaultState"]
                StoreContext["StoreContext"]
                ExtendableStore["createExtendableStore()"]
                CommonTypes["Types:<br/>• State<br/>• Store<br/>• ExtendedStore"]
            end
            
            subgraph PreactEvents["preact/events"]
                EventDispatch["dispatchNostoEvent()"]
                EventSubscribe["subscribeToNostoEvent()"]
                UseEventDispatch["useEventBusDispatch()"]
                UseEventSubscribe["useEventBusSubscribe()"]
            end
            
            subgraph PreactHooks["preact/hooks"]
                UseActions["useActions()"]
                UseDecoratedResults["useDecoratedSearchResults()"]
                UseFacet["useFacet()"]
                UseFacets["useFacets()"]
                UseLoadMore["useLoadMore()"]
                UseNostoAppState["useNostoAppState()"]
                UsePagination["usePagination()"]
                UsePersonalization["usePersonalization()"]
                UseProductFilters["useProductFilters()"]
                UseRange["useRange()"]
                UseRangeSelector["useRangeSelector()"]
                UseResponse["useResponse()"]
                UseSelectedFiltersCount["useSelectedFiltersCount()"]
                UseSizeOptions["useSizeOptions()"]
                UseSort["useSort()"]
                UseSpeechToText["useSpeechToText()"]
                UseSwatches["useSwatches()"]
                HookTypes["Types:<br/>• UseFacetOptions<br/>• Page<br/>• SpeechToText"]
                SpeechSupported["speechToTextSupported()"]
            end
            
            subgraph PreactInject["preact/inject"]
                Init["init()"]
                InjectAutocomplete["injectAutocomplete()"]
                InjectCategory["injectCategory()"]
                InjectSerp["injectSerp()"]
                InjectComponent["injectComponent()"]
                AutocompleteContext["AutocompleteContext"]
                InjectTypes["Types:<br/>• InitResult<br/>• InitConfig"]
            end
            
            subgraph PreactLegacy["preact/legacy"]
                NewSearch["newSearch()"]
                UpdateSearch["updateSearch()"]
                InfiniteScrollObserver["InfiniteScrollWithObserver"]
                IntersectionSupport["intersectionObserverSupported()"]
                GetNextPageQuery["getNextPageQuery()"]
            end
            
            subgraph PreactSerp["preact/serp"]
                SerpElement["SerpElement"]
                SearchPageProvider["SearchPageProvider"]
                SerpConfig["SerpConfig"]
            end
        end
    end
    
    %% Styling
    classDef coreStyle fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef currencyStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef thumbStyle fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef utilStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef preactStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef submoduleStyle fill:#f5f5f5,stroke:#616161,stroke-width:1px
    
    class Core coreStyle
    class Currencies currencyStyle
    class Thumbnails thumbStyle
    class Utils utilStyle
    class Preact preactStyle
    class PreactAutocomplete,PreactCategory,PreactCommon,PreactEvents,PreactHooks,PreactInject,PreactLegacy,PreactSerp submoduleStyle
```

## Module Descriptions

### 🔍 Core
The foundational search functionality providing the main search API and cart integration.

**Key Exports:**
- `search()` - Main search function with decorators and caching
- `addToCart()` - Add products to cart with tracking
- Types for search options, decorated results, and hit decorators

### 💰 Currencies
Currency formatting and price decoration utilities for internationalizing price display.

**Key Exports:**
- `getCurrencyFormatting()` - Get formatting rules for currencies
- `priceDecorator()` - Decorate search results with formatted prices
- Configuration types for currency handling

### 🖼️ Thumbnails  
Image processing and thumbnail generation utilities supporting multiple formats.

**Key Exports:**
- `generateThumbnailUrl()` - Generate thumbnail URLs
- `nostoThumbnailDecorator()` - Nosto-specific thumbnail decorator
- `shopifyThumbnailDecorator()` - Shopify-specific thumbnail decorator
- `thumbnailDecorator()` - Generic thumbnail decorator

### 🛠️ Utils
General-purpose utilities for common development tasks.

**Key Exports:**
- `deepMerge()` - Deep merge objects and arrays
- `bindInput()` - Bind search inputs with autocomplete and native disabling
- `isEqual()` - Deep equality checking
- `logger` - Logging utilities with performance tracking
- `cl()` - Conditional class name helper
- `isBot()` - Bot detection utility
- `measure()` - Performance measurement utility
- `pick()` - Object property selection
- Various helper functions for arrays, objects, and type manipulation

### ⚛️ Preact
Modern UI components and hooks for building search interfaces.

#### Submodules:
- **autocomplete** - Fast autocomplete functionality
- **category** - Category-based search and filtering
- **common** - Shared components, store management, infinite scroll
- **events** - Event bus system for component communication
- **hooks** - React-style hooks for state management and actions  
- **inject** - Dynamic component injection system
- **legacy** - Backward compatibility components
- **serp** - Search Engine Results Pages with sorting and pagination

## Dependencies

The modules have the following dependency relationships:

- **Core** depends on `@nosto/nosto-js` for search API integration
- **Preact modules** depend on `preact` and often use **utils** and **core**
- **Currencies** and **Thumbnails** work as decorators with **core** search results
- **Utils** is used across all other modules as a foundation library

## Usage Patterns

1. **Basic Search**: Import from `core` for search functionality
2. **UI Components**: Import from appropriate `preact/*` submodules  
3. **Result Enhancement**: Use `currencies` and `thumbnails` decorators
4. **Utilities**: Import from `utils` for common operations
