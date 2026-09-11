@php $s = store_settings(); $currency = $s->currency_code ?: 'रू'; @endphp
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>@yield('title', 'Test Kit Theme')</title>
  <link rel="stylesheet" href="{{ store_theme_asset('style.css', 'test_kit_theme') }}?v={{ time() }}">
  @stack('styles')
</head>
<body>
  <header style="padding: 16px; border-bottom: 1px solid #EEE;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
      <a href="{{ route('store.index') }}" style="font-weight: 800; text-decoration: none; color: inherit;">Test Kit Theme</a>
      <a href="{{ route('store.cart') }}">Bag</a>
    </div>
  </header>
  <main>@yield('content')</main>
  @stack('scripts')
</body>
</html>