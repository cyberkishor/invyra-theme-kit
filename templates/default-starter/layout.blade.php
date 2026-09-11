@php
  $s = store_settings();
  $storeName = $s->store_name ?? 'Invyra Store';
  $currency = $s->currency_code ?: 'रू';
  $themeSlug = 'starter_theme';
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
