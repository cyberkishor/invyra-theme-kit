@extends('store.themes.starter_theme.layout')

@section('title', 'Starter Theme Storefront')

@section('content')
  {{-- Hero Banner --}}
  <div style="background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,194,255,0.05)); padding: 80px 0; border-bottom: 1px solid var(--th-border); text-align: center;">
    <div class="th-container" style="max-width: 800px;">
      <span style="font-size: 0.85rem; font-weight: 800; color: var(--th-primary); text-transform: uppercase; letter-spacing: 0.1em;">Starter Showcase</span>
      <h1 style="font-size: 3rem; font-weight: 900; margin: 16px 0; color: var(--th-secondary); letter-spacing: -0.02em;">Next-Generation Retail Experience</h1>
      <p style="color: var(--th-muted); font-size: 1.15rem; line-height: 1.6; margin-bottom: 30px;">A clean, responsive foundation for building customized storefront themes in Invyra SaaS.</p>
      <div style="display: flex; justify-content: center; gap: 14px;">
        <a href="{{ route('store.shop') }}" class="th-btn th-btn-primary" style="padding: 14px 28px; font-size: 1rem;">Explore Catalog <i class="bi bi-arrow-right"></i></a>
        <a href="{{ route('store.contact') }}" class="th-btn th-btn-outline" style="padding: 14px 24px; font-size: 1rem;">Contact Us</a>
      </div>
    </div>
  </div>

  {{-- Featured Grid --}}
  <div class="th-container" style="padding: 60px 20px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
      <div>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin: 0 0 6px;">Featured Products</h2>
        <p style="color: var(--th-muted); margin: 0;">Handpicked products from our catalog</p>
      </div>
      <a href="{{ route('store.shop') }}" style="color: var(--th-primary); font-weight: 700; text-decoration: none;">View All &rarr;</a>
    </div>

    <div class="th-grid">
      @php
        $products = \App\Models\Product::query()
          ->where('is_active', 1)
          ->where('hide_from_online_store', 0)
          ->take(8)
          ->get();
      @endphp

      @forelse($products as $prod)
        @php
          $img = $prod->image && $prod->image !== 'no-image.png' 
              ? asset('images/products/' . $prod->image) 
              : asset('images/products/no-image.png');
          $price = $prod->display_price ?? $prod->price;
        @endphp
        <div class="th-card">
          <a href="{{ route('store.product.show', $prod->slug ?? $prod->id) }}">
            <img src="{{ $img }}" alt="{{ $prod->name }}" class="th-card-img" style="aspect-ratio: 4/3; object-fit: cover;">
          </a>
          <div style="padding: 18px; display: flex; flex-direction: column; flex: 1;">
            <a href="{{ route('store.product.show', $prod->slug ?? $prod->id) }}" style="text-decoration: none; color: inherit; font-weight: 700; font-size: 1.05rem; margin-bottom: 8px;">{{ $prod->name }}</a>
            <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 800; color: var(--th-primary); font-size: 1.15rem;">{{ $currency }} {{ number_format($price, 2) }}</span>
              <a href="{{ route('store.product.show', $prod->slug ?? $prod->id) }}" class="th-btn th-btn-outline" style="padding: 6px 14px; font-size: 0.85rem;">View</a>
            </div>
          </div>
        </div>
      @empty
        <p style="color: var(--th-muted); grid-column: 1 / -1;">No products found in catalog.</p>
      @endforelse
    </div>
  </div>
@endsection
