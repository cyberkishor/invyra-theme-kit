# Invyra Storefront Theme Development Rules

Apply these strict guidelines when authoring, modifying, or reviewing Invyra Storefront Themes:

1. **Asset References**:
   Always link stylesheets using `{{ store_theme_asset('style.css', '{slug}') }}`. Never use raw hardcoded paths like `/css/style.css`.
2. **Canonical Named Routes**:
   - Product Single Page: `route('store.product.show', $product->slug ?? $product->id)`
   - Cart View: `route('store.cart')`
   - Express Checkout: `route('checkout')`
   - Customer Portal: `route('account')`
   - Order Details: `route('account.order.show', $order->id)`
3. **Database Column Guard**:
   When querying products, use `Product::where('is_active', 1)->where('hide_from_online_store', 0)`. The `products` table does not have a `status` column.
4. **Image Fallbacks**:
   Always guard against missing product images by providing `asset('images/products/no-image.png')` fallback.
5. **Scoped CSS Tokens**:
   Prefix all CSS custom properties with the theme's short unique prefix (e.g. `--th-primary`, `--apx-primary`, etc.) to prevent style leakage.
