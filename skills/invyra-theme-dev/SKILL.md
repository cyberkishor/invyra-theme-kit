---
name: invyra-theme-dev
description: >-
  Use this skill whenever creating, modifying, scaffolding, validating, or updating storefront themes
  and templates in Invyra SaaS. Applies to requests mentioning "create theme", "new store template",
  "modify theme", "theme.json", "storefront design", or "customize store appearance".
---

# Invyra Storefront Theme Development Skill

This skill provides standard operating procedures, architectural specifications, view contracts, and automated tooling for creating, customizing, and validating storefront themes in the Invyra multi-tenant SaaS platform.

---

## 1. Quick Scaffolding

To scaffold a complete, production-ready theme in seconds:

### Option A: Using the Scaffolding Script
```bash
bash .agents/skills/invyra-theme-dev/scripts/scaffold-theme.sh <slug> "<Theme Name>" "<Category>" "<Primary Color>" "<Secondary Color>"
```
*Example:*
```bash
bash .agents/skills/invyra-theme-dev/scripts/scaffold-theme.sh artisan_ceramics "Artisan Ceramics & Pottery" "Home & Crafts" "#B45309" "#78350F"
```

### Option B: Using the Artisan Command
```bash
php artisan theme:make <slug> --name="<Theme Name>" --category="<Category>"
```

---

## 2. Directory & File Architecture

Every theme consists of two mirrored locations:
1. **Views & Templates:** `resources/views/store/themes/{slug}/`
2. **Public Static Assets:** `public/store_themes/{slug}/`

### Required Files Checklist:
| File | Purpose | Key Requirements |
| :--- | :--- | :--- |
| `theme.json` | Manifest & metadata | Must define `name`, `slug`, `version`, `features`, `settings` / `default_colors`. |
| `layout.blade.php` | Master storefront wrapper | Topbar, header/nav, announcement bar, mobile drawer, offcanvas cart, footer, scripts. |
| `index.blade.php` | Homepage | Hero banner, dynamic lineup blocks (`$blocks`), category circles, benefits grid, testimonials. |
| `shop.blade.php` | Catalog browsing | Search input (`q`), category filters, price sort dropdown, responsive product cards. |
| `product-detail.blade.php` | Single PDP | Image gallery, variant picker chips, display price, stock badge, quantity stepper, add-to-cart, reviews. |
| `cart.blade.php` | Cart / Requisition page | Table of items, quantity controls, subtotal, tax/delivery calculation, proceed to checkout. |
| `checkout.blade.php` | One-page checkout | Customer name/phone/email, shipping address, payment selector (Fonepay / Cash on Delivery), summary. |
| `thank-you.blade.php` | Order confirmation | Order number `#`, items list, total paid/due, order status tracker button. |
| `account.blade.php` | Customer profile | Personal info update form, recent order shortcut. |
| `account_orders.blade.php` | Order history list | Order ID, date, status pills, amount, view details link. |
| `order-show.blade.php` | Order details view | Order itemized invoice, delivery details, status timeline. |
| `contact.blade.php` | Contact & inquiry desk | Store hours, physical address, map/phone, contact message form (`store.contact.send`). |
| `style.css` | Scoped CSS stylesheet | Pure CSS with scoped custom properties (`--{prefix}-primary`, etc.). |
| `preview.svg` | Theme preview card | Vector thumbnail illustration (aspect ratio 3:2 or 400x260). |

---

## 3. Strict Rules & Architectural Contracts

### Rule 1: Always use `store_theme_asset` for theme assets
In Blade layouts and views, reference theme assets via:
```blade
<link rel="stylesheet" href="{{ store_theme_asset('style.css', '{slug}') }}?v={{ time() }}">
```
*Note: Both signatures `store_theme_asset('style.css', '{slug}')` and `store_theme_asset('{slug}', 'style.css')` are supported.*

### Rule 2: Use Canonical Named Routes
Never hardcode URLs or use legacy route names. Always use the active registered route names:
- **Homepage:** `route('store.index')`
- **Shop Catalog:** `route('store.shop')`
- **Product Detail:** `route('store.product.show', $product->slug ?? $product->id)`
- **Cart Page:** `route('store.cart')`
- **Checkout:** `route('checkout')`
- **Thank You:** `route('store.thankyou')`
- **Customer Account:** `route('account')`
- **Account Orders:** `route('account.orders')`
- **Order Details:** `route('account.order.show', $order->id)`
- **Contact:** `route('store.contact')`

### Rule 3: Product Active Query
When querying products in themes or components, always use the active flags:
```php
Product::query()
    ->where('is_active', 1)
    ->where('hide_from_online_store', 0)
```
**NEVER** do `->where('status', 'active')` (the `status` column does not exist on the `products` table).

### Rule 4: Product Image Fallbacks
Always guard against missing or placeholder product images:
```blade
@php
  $imgSrc = $product->image && $product->image !== 'no-image.png'
      ? asset('images/products/' . $product->image)
      : asset('images/products/no-image.png');
@endphp
```

### Rule 5: Scoped CSS Custom Properties
Never pollute global styling. Scope your theme CSS using unique theme prefixes:
```css
:root {
  --{prefix}-primary: #D97706;
  --{prefix}-secondary: #78350F;
  --{prefix}-bg: #FAF6F0;
  --{prefix}-surface: #FFFFFF;
  --{prefix}-text: #1C130E;
  --{prefix}-muted: #78716C;
  --{prefix}-border: rgba(120, 53, 15, 0.12);
  --{prefix}-radius: 12px;
}
```

---

## 4. Theme Manifest Schema (`theme.json`)

```json
{
  "name": "Theme Display Name",
  "slug": "theme_slug",
  "version": "1.0.0",
  "description": "Comprehensive description of the theme, target industry, and aesthetic.",
  "author": "Invyra Studio",
  "category": "Industry Category",
  "preview_image": "preview.svg",
  "settings": {
    "primary_color": "#HEX",
    "secondary_color": "#HEX",
    "background_color": "#HEX",
    "card_background": "#HEX",
    "text_color": "#HEX"
  },
  "default_colors": {
    "primary": "#HEX",
    "secondary": "#HEX"
  },
  "features": [
    "Feature 1 Description",
    "Feature 2 Description",
    "Feature 3 Description"
  ],
  "supported_features": [
    "feature_slug_1",
    "feature_slug_2"
  ]
}
```

---

## 5. Automated Validation Runbook

Whenever you finish creating or modifying a theme, run the validation tool:

```bash
bash .agents/skills/invyra-theme-dev/scripts/validate-theme.sh <slug>
# Or via artisan:
php artisan theme:validate <slug>
```

This verifies:
1. All 13 mandatory template and asset files exist.
2. `theme.json` is valid JSON and contains required keys.
3. No legacy route names (`store.product`, `store.checkout`, `store.account`) are present.
4. No invalid queries (`where('status'`) exist in view templates.
5. Assets in `public/store_themes/{slug}` are synchronized.
6. The theme compiles and returns HTTP 200 on Home, Shop, and Product Detail pages.

---

## 6. References & Deep Dives

- [Blade View Contracts & Injected Variables](file://./references/view-contracts.md)
- [Design Tokens & UI Standards](file://./references/design-tokens.md)
