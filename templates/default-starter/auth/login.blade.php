{{-- resources/views/store/auth/login.blade.php --}}
@extends(store_theme_layout())

@section('content')
@php
  $redirect    = $redirect ?? route('checkout');
  $storeName   = $s->store_name ?? 'Our Store';
  $heroImg     = $s->hero_image_path ?? null;
  $logoPath    = $s->logo_path ?? null;
  $primary     = $s->primary_color ?? '#2D4A2D';

  $assetPath = function ($p) {
    if (!$p) return '';
    return \Illuminate\Support\Str::startsWith($p, ['/','http://','https://']) ? $p : asset($p);
  };
@endphp

<style>
.auth-input:focus { border-color: {{ $primary }}; box-shadow: 0 0 0 3px {{ $primary }}22; }
.auth-remember input { accent-color: {{ $primary }}; }
.auth-btn:hover { background: {{ $primary }}; }
.auth-register-link a:hover { color: {{ $primary }}; }
</style>

<div class="auth-wrap">

  {{-- ===== LEFT PANEL ===== --}}
  <div class="auth-left">
    @if($heroImg)
      <img src="{{ $assetPath($heroImg) }}" class="auth-left-bg" alt="">
    @elseif(file_exists(public_path('store_files/hero_image.jpg')))
      <img src="{{ asset('store_files/hero_image.jpg') }}" class="auth-left-bg" alt="">
    @endif
    <div class="auth-left-overlay"></div>

    <div class="auth-left-content">
      <div class="auth-brand-badge">
        <i class="bi bi-bag-heart-fill"></i>
        {{ $storeName }}
      </div>
      <h2 class="auth-left-heading">
        Your favourite<br>store awaits
      </h2>
      <p class="auth-left-sub">
        Sign in to track your orders, save your wishlist, and enjoy a faster checkout experience.
      </p>
      <div class="auth-trust">
        <div class="auth-trust-item">
          <i class="bi bi-shield-check-fill"></i>
          <span>Secure & encrypted login</span>
        </div>
        <div class="auth-trust-item">
          <i class="bi bi-truck"></i>
          <span>Track orders in real-time</span>
        </div>
        <div class="auth-trust-item">
          <i class="bi bi-lightning-charge-fill"></i>
          <span>One-click checkout</span>
        </div>
      </div>
    </div>
  </div>

  {{-- ===== RIGHT PANEL ===== --}}
  <div class="auth-right">
    <div class="auth-form-wrap">

      {{-- Logo --}}
      <a href="{{ url('/') }}" class="auth-logo">
        @if($logoPath)
          <img src="{{ $assetPath($logoPath) }}" alt="{{ $storeName }}">
        @endif
        {{ $storeName }}
      </a>

      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to your account to continue</p>

      {{-- Already logged in --}}
      @if(Auth::guard('store')->check())
        <div class="auth-success">
          <i class="bi bi-check-circle mr-1"></i> You're already signed in.
        </div>
      @endif

      {{-- Errors --}}
      @if($errors->any())
        <div class="auth-alert">
          <ul>@foreach($errors->all() as $err)<li>{{ $err }}</li>@endforeach</ul>
        </div>
      @endif

      <form method="POST" action="{{ route('store.login') }}" novalidate>
        @csrf
        <input type="hidden" name="redirect" value="{{ $redirect }}">

        <div class="auth-field">
          <label for="email">Email address</label>
          <div class="auth-input-icon">
            <i class="bi bi-envelope"></i>
            <input id="email" type="email" name="email" class="auth-input"
              value="{{ old('email') }}" required autocomplete="email"
              placeholder="you@example.com">
          </div>
        </div>

        <div class="auth-field">
          <label for="password">Password</label>
          <div class="auth-input-icon">
            <i class="bi bi-lock"></i>
            <input id="password" type="password" name="password" class="auth-input"
              required autocomplete="current-password" placeholder="••••••••">
          </div>
        </div>

        <label class="auth-remember">
          <input type="checkbox" name="remember" value="1">
          Keep me signed in
        </label>

        <button type="submit" class="auth-btn">
          Sign In
        </button>
      </form>

      <div class="auth-divider"><span>or</span></div>

      <div class="auth-register-link">
        Don't have an account?
        <a href="{{ route('store.register.show', ['redirect' => $redirect]) }}">Create one</a>
      </div>

    </div>
  </div>

</div>
@endsection
