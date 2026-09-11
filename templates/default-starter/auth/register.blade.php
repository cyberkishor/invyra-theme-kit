{{-- resources/views/store/auth/register.blade.php --}}
@extends(store_theme_layout())

@section('content')
@php
  $redirect  = $redirect ?? request('redirect', route('checkout'));
  $storeName = $s->store_name ?? 'Our Store';
  $heroImg   = $s->hero_image_path ?? null;
  $logoPath  = $s->logo_path ?? null;
  $primary   = $s->primary_color ?? '#2D4A2D';

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
        Join our<br>community today
      </h2>
      <p class="auth-left-sub">
        Create an account to track orders, manage your wishlist, and enjoy a faster checkout experience.
      </p>
      <div class="auth-trust">
        <div class="auth-trust-item">
          <i class="bi bi-shield-check-fill"></i>
          <span>Secure & encrypted</span>
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
      <a href="{{ route('store.index') }}" class="auth-logo">
        @if($logoPath)
          <img src="{{ $assetPath($logoPath) }}" alt="{{ $storeName }}">
        @endif
        {{ $storeName }}
      </a>

      <h1 class="auth-title">{{ __('messages.CreateAccount') }}</h1>
      <p class="auth-subtitle">{{ __('messages.CreateStoreAccountFaster') }}</p>

      {{-- Errors --}}
      @if($errors->any())
        <div class="auth-alert">
          <ul>@foreach($errors->all() as $err)<li>{{ $err }}</li>@endforeach</ul>
        </div>
      @endif

      <form method="POST" action="{{ route('store.register') }}" novalidate>
        @csrf
        <input type="hidden" name="redirect" value="{{ $redirect }}">

        <div class="auth-field">
          <label for="name">{{ __('messages.FullName') }}</label>
          <div class="auth-input-icon">
            <i class="bi bi-person"></i>
            <input id="name" type="text" name="name" class="auth-input"
              value="{{ old('name') }}" required autocomplete="name"
              placeholder="{{ __('messages.FullName') }}">
          </div>
          @error('name') <div class="invalid-msg">{{ $message }}</div> @enderror
        </div>

        <div class="auth-field">
          <label for="email">{{ __('messages.Email') }}</label>
          <div class="auth-input-icon">
            <i class="bi bi-envelope"></i>
            <input id="email" type="email" name="email" class="auth-input"
              value="{{ old('email') }}" required autocomplete="email"
              placeholder="you@example.com">
          </div>
          @error('email') <div class="invalid-msg">{{ $message }}</div> @enderror
        </div>

        <div class="auth-field">
          <label for="phone">{{ __('messages.Phone') }}</label>
          <div class="auth-input-icon">
            <i class="bi bi-telephone"></i>
            <input id="phone" type="tel" name="phone" class="auth-input"
              value="{{ old('phone') }}" required autocomplete="tel"
              placeholder="+1 234 567 8900">
          </div>
          @error('phone') <div class="invalid-msg">{{ $message }}</div> @enderror
        </div>

        <div class="auth-field">
          <label for="address">{{ __('messages.Address') }}</label>
          <div class="auth-input-icon">
            <i class="bi bi-geo-alt"></i>
            <input id="address" type="text" name="address" class="auth-input"
              value="{{ old('address') }}" required autocomplete="street-address"
              placeholder="{{ __('messages.Address') }}">
          </div>
          @error('address') <div class="invalid-msg">{{ $message }}</div> @enderror
        </div>

        <div class="auth-field">
          <label for="regPass">{{ __('messages.Password') }}</label>
          <div class="auth-input-icon" style="display:flex;">
            <i class="bi bi-lock" style="z-index:1;"></i>
            <input id="regPass" type="password" name="password" class="auth-input"
              required autocomplete="new-password" placeholder="••••••••"
              style="border-radius: var(--radius-md) 0 0 var(--radius-md); flex:1;">
            <button type="button"
              class="border border-l-0 border-border-base px-3 bg-white hover:bg-gray-50 transition-colors text-text-muted"
              style="border-radius: 0 var(--radius-md) var(--radius-md) 0;"
              onclick="togglePass('regPass', this)">
              <i class="bi bi-eye"></i>
            </button>
          </div>
          <small class="text-xs text-text-muted mt-1 block">{{ __('messages.Minimum6Chars') }}</small>
          @error('password') <div class="invalid-msg">{{ $message }}</div> @enderror
        </div>

        <div class="auth-field">
          <label for="password_confirmation">{{ __('messages.ConfirmPassword') }}</label>
          <div class="auth-input-icon">
            <i class="bi bi-lock-fill"></i>
            <input id="password_confirmation" type="password" name="password_confirmation"
              class="auth-input" required autocomplete="new-password" placeholder="••••••••">
          </div>
        </div>

        <button type="submit" class="auth-btn">
          <i class="bi bi-person-plus mr-1"></i> {{ __('messages.CreateAccount') }}
        </button>
      </form>

      <div class="auth-divider"><span>or</span></div>

      <div class="auth-register-link">
        {{ __('messages.AlreadyHaveAccountQ') }}
        <a href="{{ route('store.login.show', ['redirect' => $redirect]) }}">{{ __('messages.SignIn') }}</a>
      </div>

    </div>
  </div>

</div>

<script>
  function togglePass(id, btn){
    const el = document.getElementById(id);
    if (!el) return;
    const isText = el.type === 'text';
    el.type = isText ? 'password' : 'text';
    btn.innerHTML = isText ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  }
</script>
@endsection
