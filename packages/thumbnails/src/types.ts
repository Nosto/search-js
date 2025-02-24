/**
 * Nosto thumbnail size code.
 * Sometimes referred to as `imageVersion`.
 *
 * * 1: 170x170 px
 * * 2: 100x100 px
 * * 3: 90x70 px
 * * 4: 50x50 px
 * * 5: 30x30 px
 * * 6: 100x140 px
 * * 7: 200x200 px
 * * 8: 400x400 px
 * * 9: 750x750 px
 * * 10: Original (Square)
 * * 11: 200x200 px (Square)
 * * 12: 400x400 px (Square)
 * * 13: 750x750 px (Square)
 */
export type NostoSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "orig"

/**
 * Shopify thumbnail size code.
 *
 * * Pico (16×16 px)
 * * Icon (32×32 px)
 * * Thumb (50×50 px)
 * * Small (100×100 px)
 * * Compact (160×160 px)
 * * Medium (240×240 px)
 * * Large (480×480 px)
 * * Grande (600×600 px)
 * * Original (1024×1024 px)
 * * Master (full size)
 */
export type ShopifySize =
  | "pico"
  | "icon"
  | "thumb"
  | "small"
  | "compact"
  | "medium"
  | "large"
  | "grande"
  | "original"
  | "master"

/**
 * Shopify compatible Nosto thumbnail size code.
 * This is a subset of {@link NostoSize} that is compatible with Shopify CDN.
 *
 * * 1: 170x170 px
 * * 2: 100x100 px
 * * 3: 90x70 px
 * * 4: 50x50 px
 * * 5: 30x30 px
 * * 6: 100x140 px
 * * 7: 200x200 px
 * * 8: 400x400 px
 * * 9: 750x750 px
 */
export type NostoShopifySize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
