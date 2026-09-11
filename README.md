# Invyra Storefront Theme Developer Kit (CLI, MCP & Skill)

> The official developer toolkit, Antigravity AI skill, and Model Context Protocol (MCP) server for scaffolding, validating, packaging, and deploying custom storefront themes for **Invyra SaaS**.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io/)

---

## Overview

Invyra's multi-tenant storefront architecture enables independent online stores to use tailored Blade & CSS themes. This repository provides everything needed for a human developer or an AI assistant (Antigravity, Claude, Cursor, Windsurf) to:

1. **Scaffold** complete, production-ready themes in seconds.
2. **Audit & Validate** theme syntax, required files, named routes, and CSS scoping.
3. **Package** themes into distribution-ready `.zip` archives.
4. **Upload & Test** themes on any live or local Invyra tenant store.

---

## Three Ways to Use

### Option 1: As an MCP Server (For Claude Desktop, Cursor, Antigravity)

Add this server to your AI client configuration:

#### In Claude Desktop (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "invyra-themes": {
      "command": "node",
      "args": ["/path/to/invyra-theme-kit/server.js"]
    }
  }
}
```

#### In Antigravity (`mcp_config.json`):
```json
{
  "mcpServers": {
    "invyra-themes": {
      "command": "node",
      "args": ["invyra-theme-kit/server.js"]
    }
  }
}
```

#### Available MCP Tools:
- `invyra_create_theme`: Scaffolds a complete theme with all Blade views, `theme.json`, and scoped CSS.
- `invyra_validate_theme`: Audits files, routes, image fallbacks, and CSS scoping.
- `invyra_pack_theme`: Bundles the theme into a `.zip` file for distribution.
- `invyra_upload_theme`: Uploads and activates the theme on an Invyra store via API.

---

### Option 2: As an Antigravity AI Skill / Plugin

Clone or copy this folder into your workspace customization root:
```bash
# Copy into workspace agents plugin folder:
mkdir -p .agents/plugins
cp -r invyra-theme-kit .agents/plugins/invyra-theme-kit
```

The AI agent will automatically detect the skill whenever you ask:
- *"Create a new theme for an organic tea store"*
- *"Audit the apex_hardware theme"*
- *"Package and upload my theme to test"*

---

### Option 3: As a Standalone Developer CLI

Run commands directly in your terminal:

```bash
# Make executable
chmod +x bin/invyra-theme.js

# Scaffold a new theme
./bin/invyra-theme.js create vintage_leather --name="Vintage Leather Goods" --category="Fashion & Crafts" --primary="#854D0E" --secondary="#3F2205"

# Audit and validate an existing theme directory
./bin/invyra-theme.js validate ./resources/views/store/themes/vintage_leather

# Package theme into a deployable zip file
./bin/invyra-theme.js pack ./resources/views/store/themes/vintage_leather

# Upload directly to an Invyra store
./bin/invyra-theme.js upload ./theme-vintage_leather.zip --url="https://sajha.invyra-saas.test" --token="YOUR_API_TOKEN"
```

---

## Directory Architecture of an Invyra Theme

```text
my_theme_slug/
├── theme.json               # Manifest (name, slug, colors, supported features)
├── layout.blade.php         # Master storefront layout (header, nav, offcanvas bag, footer)
├── index.blade.php          # Homepage with hero & dynamic lineups ($blocks)
├── shop.blade.php           # Catalog page with category filters & price sorting
├── product-detail.blade.php # Single PDP with gallery, variant chips, & specs
├── cart.blade.php           # Requisition bag & order summary
├── checkout.blade.php       # Single-page checkout & payment selection
├── thank-you.blade.php      # Order receipt & tracking link
├── account.blade.php        # Customer profile page
├── account_orders.blade.php # Customer order history listing
├── order-show.blade.php     # Detailed order invoice view
├── contact.blade.php        # Store hours & inquiry form
├── preview.svg              # 400x260 vector thumbnail card
├── style.css                # Scoped CSS with custom properties
└── assets/                  # Public static assets (images, SVGs, client JS, fonts)
    ├── theme.js             # Optional client-side script
    ├── logo.svg             # Brand logo & SVG icons
    └── images/              # Banners & graphic badges
```

When a theme is uploaded or installed, everything inside `assets/` and root `style.css` is automatically published to `public/store_themes/{slug}/`.

---

## Theme Authoring Rules

1. **Asset Loading**:
   Always load theme stylesheets, JavaScript, and images using `store_theme_asset`:
   ```blade
   {{-- Root stylesheet --}}
   <link rel="stylesheet" href="{{ store_theme_asset('style.css', '{slug}') }}?v={{ time() }}">

   {{-- Custom script from assets/ folder --}}
   <script src="{{ store_theme_asset('theme.js', '{slug}') }}"></script>

   {{-- Custom image/SVG from assets/ folder --}}
   <img src="{{ store_theme_asset('logo.svg', '{slug}') }}" alt="Brand Logo">
   ```
2. **Canonical Named Routes**:
   - Product detail: `route('store.product.show', $product->slug ?? $product->id)`
   - Shopping bag: `route('store.cart')`
   - Checkout: `route('checkout')`
   - Customer account: `route('account')`
   - Orders: `route('account.orders')`
   - Order detail: `route('account.order.show', $order->id)`
3. **Database Guards**:
   Always query products using `where('is_active', 1)->where('hide_from_online_store', 0)`. The `products` table does not have a `status` column.
4. **Image Fallbacks**:
   Always provide fallback images:
   ```blade
   {{ $product->image && $product->image !== 'no-image.png' ? asset('images/products/' . $product->image) : asset('images/products/no-image.png') }}
   ```
5. **Scoped CSS**:
   Prefix all CSS variables with your theme prefix (e.g. `--th-primary`, `--th-surface`) to prevent conflicts.

---

## Publishing to GitHub

To publish this kit as your own GitHub repository:

```bash
cd invyra-theme-kit
git init
git add .
git commit -m "feat: initial release of Invyra Storefront Theme Kit"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/invyra-theme-kit.git
git push -u origin main
```

---

## License

This project is open-sourced under the [MIT License](LICENSE).
