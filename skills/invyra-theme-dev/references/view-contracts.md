# Blade View Contracts & Variables Reference

This reference details the data variables injected into each view template by `StoreFrontController` and `AccountPagesController`.

---

## 1. Global View Variables (Injected via `resolveView`)

Every store view automatically receives:
- **`$s`** (`App\Models\StoreSetting`): Active store settings model.
  - `$s->store_name` (string): Brand / business name.
  - `$s->currency_code` (string): e.g. `रू`, `$`, `NRs`.
  - `$s->contact_phone`, `$s->contact_email`, `$s->address`.
  - `$s->primary_color`, `$s->secondary_color`.
  - `$s->social_links` (array).
  - `$s->allow_overselling` (bool).
- **`$currency`** (string): Currency symbol (defaults to `$s->currency_code ?: '$'`).

---

## 2. Homepage (`index.blade.php`)

Injected by `StoreFrontController::index`:
- **`$blocks`** (array): Dynamic homepage lineup configured in store settings.
  ```php
  foreach ($blocks as $block) {
      // $block['type']: 'collection' | 'banner' | 'newsletter' | 'testimonials'
      // For collection:
      // $block['title']
      // $block['collection']
      // $block['products'] (Collection of Product models with display_price and stock computed)
      // $block['cfg']['layout'] ('grid' | 'carousel')
  }
  ```
- **`$categories`** (`Illuminate\Support\Collection<Category>`): List of all active product categories.
- **`$banners`** (`Illuminate\Support\Collection<StoreBanner>`): Active marketing banners with `$banner->image_url`.
- **`$testimonials`** (`Illuminate\Support\Collection<StoreTestimonial>`): Active customer reviews.

---

## 3. Shop Catalog (`shop.blade.php`)

Injected by `StoreFrontController::shop`:
- **`$products`** (`Illuminate\Pagination\LengthAwarePaginator<Product>`): Paginated product results.
  - Each `$product` has computed:
    - `$product->display_price`: Final price with discount & tax.
    - `$product->price`: Base/original price.
    - `$product->stock`: Current inventory.
    - `$product->variants`: Eager loaded variants.
- **`$categories`** (`Illuminate\Support\Collection<Category>`): Category filter options.
- **`$selectedCategory`** (string|null): Current category filter slug or ID.
- **`$q`** (string): Current search query term.
- **`$sort`** (string): Active sort parameter (`latest`, `price_asc`, `price_desc`).

---

## 4. Product Detail Page (`product-detail.blade.php`)

Injected by `StoreFrontController::productDetail`:
- **`$product`** (`App\Models\Product`): Product model with variants eager loaded.
  - `$product->name`, `$product->slug`, `$product->description`, `$product->note`.
  - `$product->price`, `$product->display_price`.
  - `$product->variants` (`Collection<ProductVariant>`): Array of variant objects with `id`, `name`, `price`, `image`.
  - `$product->is_variant` (bool).
- **`$related`** (`Collection<Product>`): Up to 4 related products from the same category/collection.
- **`$reviews`** (`Collection<ProductReview>`): Approved customer reviews.
- **`$reviewStats`** (array):
  - `average`: Float (e.g. 4.8).
  - `count`: Total count.
  - `distribution`: Count per star (1-5).

---

## 5. Account & Orders Views

- **Account (`account.blade.php`)**:
  - Requires auth on `'store'` guard.
  - Access user via `auth('store')->user()`.
- **Account Orders (`account_orders.blade.php`)**:
  - `$orders`: Paginated list of `OnlineOrder` models.
- **Order Details (`order-show.blade.php`)**:
  - `$order`: Single `OnlineOrder` with items and products eager loaded.
  - `$order->order_number`, `$order->total_amount`, `$order->status`, `$order->shipping_address`.
