#!/usr/bin/env bash
# ==============================================================================
# Invyra Storefront Theme Scaffolder
# Usage: ./scaffold-theme.sh <slug> [Name] [Category] [PrimaryColor] [SecondaryColor]
# ==============================================================================

set -e

SLUG="$1"
NAME="${2:-$SLUG}"
CATEGORY="${3:-Retail & Lifestyle}"
PRIMARY="${4:-#D97706}"
SECONDARY="${5:-#78350F}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <theme_slug> [\"Theme Name\"] [\"Category\"] [\"#PrimaryHex\"] [\"#SecondaryHex\"]"
  exit 1
fi

VIEW_DIR="resources/views/store/themes/$SLUG"
PUBLIC_DIR="public/store_themes/$SLUG"

echo "Scaffolding Invyra Theme: $NAME ($SLUG)..."

mkdir -p "$VIEW_DIR"
mkdir -p "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR/assets"

# 1. theme.json
cat <<EOF > "$VIEW_DIR/theme.json"
{
  "name": "$NAME",
  "slug": "$SLUG",
  "version": "1.0.0",
  "description": "Custom high-performance theme for $NAME ($CATEGORY).",
  "author": "Invyra Studio",
  "category": "$CATEGORY",
  "preview_image": "preview.svg",
  "settings": {
    "primary_color": "$PRIMARY",
    "secondary_color": "$SECONDARY",
    "background_color": "#FAF8F5",
    "card_background": "#FFFFFF",
    "text_color": "#1C1917"
  },
  "default_colors": {
    "primary": "$PRIMARY",
    "secondary": "$SECONDARY"
  },
  "features": [
    "High-Density Responsive Catalog Grid",
    "Instant Offcanvas Cart Drawer",
    "Technical Specifications & Variant Picker",
    "Trust Badges & Curated Storytelling",
    "Customer Order & Account Portal"
  ],
  "supported_features": [
    "hero_banner",
    "collections_grid",
    "cart_drawer",
    "reviews"
  ]
}
EOF

# 2. preview.svg
cat <<EOF > "$VIEW_DIR/preview.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%">
  <rect width="400" height="260" fill="#F8FAFC" rx="8"/>
  <rect width="400" height="42" fill="$SECONDARY"/>
  <circle cx="28" cy="21" r="8" fill="$PRIMARY"/>
  <rect x="46" y="16" width="90" height="10" rx="3" fill="#FFFFFF" fill-opacity="0.9"/>
  <rect x="26" y="60" width="348" height="90" rx="6" fill="$PRIMARY" fill-opacity="0.12"/>
  <rect x="42" y="78" width="160" height="14" rx="4" fill="$SECONDARY"/>
  <rect x="42" y="98" width="220" height="8" rx="3" fill="#64748B"/>
  <rect x="42" y="118" width="80" height="18" rx="4" fill="$PRIMARY"/>
  <g transform="translate(26, 164)">
    <rect width="106" height="74" rx="6" fill="#FFFFFF" stroke="#E2E8F0"/>
    <rect x="120" width="106" height="74" rx="6" fill="#FFFFFF" stroke="#E2E8F0"/>
    <rect x="240" width="106" height="74" rx="6" fill="#FFFFFF" stroke="#E2E8F0"/>
  </g>
</svg>
EOF

# 3. style.css
cat <<EOF > "$VIEW_DIR/style.css"
/* ==========================================================================
   Theme: $NAME ($SLUG)
   ========================================================================== */

:root {
  --th-primary: $PRIMARY;
  --th-secondary: $SECONDARY;
  --th-bg: #FAF8F5;
  --th-surface: #FFFFFF;
  --th-text: #1C1917;
  --th-muted: #78716C;
  --th-border: rgba(0, 0, 0, 0.08);
  --th-radius: 12px;
  --th-font: 'Plus Jakarta Sans', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--th-font);
  background-color: var(--th-bg);
  color: var(--th-text);
  line-height: 1.5;
}

.th-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

.th-topbar {
  background: var(--th-secondary);
  color: #FFFFFF;
  font-size: 0.82rem;
  padding: 8px 0;
  text-align: center;
}

.th-header {
  background: var(--th-surface);
  border-bottom: 1px solid var(--th-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.th-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.th-brand {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--th-secondary);
  text-decoration: none;
}

.th-nav-list {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.th-nav-link {
  color: var(--th-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.th-nav-link:hover, .th-nav-link.active {
  color: var(--th-primary);
}

.th-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--th-radius);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.th-btn-primary {
  background: var(--th-primary);
  color: #FFFFFF;
}

.th-btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.th-btn-outline {
  background: transparent;
  color: var(--th-secondary);
  border: 1.5px solid var(--th-border);
}

.th-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.th-card {
  background: var(--th-surface);
  border: 1px solid var(--th-border);
  border-radius: var(--th-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.th-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.th-card-img {
  aspect-ratio: 4/3;
  width: 100%;
  object-fit: cover;
  background: #F1F5F9;
}

.th-footer {
  background: var(--th-secondary);
  color: #FFFFFF;
  padding: 60px 0 24px;
  margin-top: 80px;
}
EOF

# 4. layout.blade.php
cat <<'EOF' > "$VIEW_DIR/layout.blade.php"
@php
  $s = store_settings();
  $storeName = $s->store_name ?? 'Invyra Store';
  $currency = $s->currency_code ?: 'रू';
  $themeSlug = 'THEME_SLUG_PLACEHOLDER';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', $storeName)</title>
  <meta name="description" content="@yield('description', 'Official Storefront powered by Invyra.')">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="{{ store_theme_asset('style.css', $themeSlug) }}?v={{ time() }}">
  @stack('styles')
</head>
<body>

  <div class="th-topbar">
    <div class="th-container">
      <span>✨ Fast Dispatch Across City Hubs · 100% Certified Genuine Stock</span>
    </div>
  </div>

  <header class="th-header">
    <div class="th-container th-header-inner">
      <a href="{{ route('store.index') }}" class="th-brand">{{ $storeName }}</a>
      <nav>
        <ul class="th-nav-list">
          <li><a href="{{ route('store.index') }}" class="th-nav-link {{ request()->routeIs('store.index') ? 'active' : '' }}">Home</a></li>
          <li><a href="{{ route('store.shop') }}" class="th-nav-link {{ request()->routeIs('store.shop') ? 'active' : '' }}">Shop</a></li>
          <li><a href="{{ route('store.contact') }}" class="th-nav-link {{ request()->routeIs('store.contact') ? 'active' : '' }}">Contact</a></li>
        </ul>
      </nav>
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="{{ route('account') }}" class="th-btn th-btn-outline" style="padding: 8px 14px;"><i class="bi bi-person"></i></a>
        <a href="{{ route('store.cart') }}" class="th-btn th-btn-primary" style="padding: 8px 16px;"><i class="bi bi-bag"></i> Bag</a>
      </div>
    </div>
  </header>

  <main>
    @yield('content')
  </main>

  <footer class="th-footer">
    <div class="th-container" style="text-align: center;">
      <p>&copy; {{ date('Y') }} {{ $storeName }}. Powered by Invyra SaaS.</p>
    </div>
  </footer>

  @stack('scripts')
</body>
</html>
EOF

sed -i '' "s/THEME_SLUG_PLACEHOLDER/$SLUG/g" "$VIEW_DIR/layout.blade.php" 2>/dev/null || sed -i "s/THEME_SLUG_PLACEHOLDER/$SLUG/g" "$VIEW_DIR/layout.blade.php"

# Copy assets to public directory
cp "$VIEW_DIR/style.css" "$PUBLIC_DIR/style.css"
cp "$VIEW_DIR/preview.svg" "$PUBLIC_DIR/preview.svg"

echo "Theme $SLUG created successfully in $VIEW_DIR and mirrored to $PUBLIC_DIR."
