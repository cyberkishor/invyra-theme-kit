#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
Invyra Storefront Theme Kit (CLI & MCP)

Usage:
  invyra-theme create <slug> [--name="Theme Name"] [--category="Category"] [--primary="#HEX"] [--secondary="#HEX"]
  invyra-theme validate <theme-dir>
  invyra-theme pack <theme-dir> [--out=<dir>]
  invyra-theme upload <theme.zip> --url=<store-url> [--token=<token>]
  invyra-theme mcp                                (Start the Model Context Protocol stdio server)

Examples:
  npx invyra-theme create artisan_pottery --name="Artisan Pottery" --category="Home Decor"
  npx invyra-theme validate ./resources/views/store/themes/artisan_pottery
  npx invyra-theme pack ./resources/views/store/themes/artisan_pottery
  npx invyra-theme upload ./theme-artisan_pottery.zip --url="https://sajha.invyra-saas.test"
`);
}

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

if (command === 'mcp') {
  require('../server.js');
} else if (command === 'create') {
  const slug = args[1];
  if (!slug) {
    console.error('Error: Theme slug is required. Example: invyra-theme create vintage_leather');
    process.exit(1);
  }

  const getOpt = (key, def) => {
    const match = args.find(a => a.startsWith(`--${key}=`));
    return match ? match.split('=')[1] : def;
  };

  const name = getOpt('name', slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  const category = getOpt('category', 'Retail & Lifestyle');
  const primary = getOpt('primary', '#D97706');
  const secondary = getOpt('secondary', '#78350F');

  let targetDir = path.resolve(process.cwd());
  if (fs.existsSync(path.join(targetDir, 'resources/views/store/themes'))) {
    targetDir = path.join(targetDir, 'resources/views/store/themes', slug);
  } else {
    targetDir = path.join(targetDir, slug);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory already exists at ${targetDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'assets', 'theme.js'), `// ${name} Theme Client Scripts\nconsole.log('${name} theme loaded.');\n`);

  // Manifest
  const manifest = {
    name,
    slug,
    version: '1.0.0',
    description: `Custom high-performance theme for ${name} (${category}).`,
    author: 'Invyra Studio',
    category,
    preview_image: 'preview.svg',
    settings: { primary_color: primary, secondary_color: secondary, background_color: '#FAF8F5', card_background: '#FFFFFF', text_color: '#1C1917' },
    default_colors: { primary, secondary },
    features: ['Responsive Catalog Grid', 'Offcanvas Cart', 'Variant Picker'],
    supported_features: ['hero_banner', 'collections_grid', 'cart_drawer']
  };
  fs.writeFileSync(path.join(targetDir, 'theme.json'), JSON.stringify(manifest, null, 2));

  // Preview SVG
  fs.writeFileSync(path.join(targetDir, 'preview.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#F8FAFC"/><rect width="400" height="42" fill="${secondary}"/><circle cx="28" cy="21" r="8" fill="${primary}"/></svg>`);

  // Style CSS
  fs.writeFileSync(path.join(targetDir, 'style.css'), `/* Theme: ${name} (${slug}) */\n:root { --th-primary: ${primary}; --th-secondary: ${secondary}; }\nbody { font-family: 'Plus Jakarta Sans', sans-serif; }`);

  // Layout Blade
  fs.writeFileSync(path.join(targetDir, 'layout.blade.php'), `@php $s = store_settings(); $currency = $s->currency_code ?: 'रू'; @endphp
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>@yield('title', '${name}')</title>
  <link rel="stylesheet" href="{{ store_theme_asset('style.css', '${slug}') }}?v={{ time() }}">
  @stack('styles')
</head>
<body>
  <header style="padding: 16px; border-bottom: 1px solid #EEE;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
      <a href="{{ route('store.index') }}" style="font-weight: 800; text-decoration: none; color: inherit;">${name}</a>
      <a href="{{ route('store.cart') }}">Bag</a>
    </div>
  </header>
  <main>@yield('content')</main>
  @stack('scripts')
</body>
</html>`);

  // Index Blade
  fs.writeFileSync(path.join(targetDir, 'index.blade.php'), `@extends("store.themes.${slug}.layout")
@section('content')
  <div style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
    <h1>Welcome to ${name}</h1>
    <p>Discover our latest collection.</p>
  </div>
@endsection`);

  // Auth Views
  const authDir = path.join(targetDir, 'auth');
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(path.join(authDir, 'login.blade.php'), `@extends(store_theme_layout())
@section('title', 'Sign In — ' . (\$s->store_name ?? '${name}'))
@section('content')
<div style="max-width: 440px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <h2 style="margin-top: 0; font-weight: 800; font-size: 1.6rem;">Sign In</h2>
  <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 24px;">Access your orders, wishlist, and profile.</p>
  <form method="POST" action="{{ route('store.login') }}">
    @csrf
    <input type="hidden" name="redirect" value="{{ \$redirect ?? route('checkout') }}">
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem;">Email Address</label>
      <input type="email" name="email" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem;">Password</label>
      <input type="password" name="password" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <button type="submit" style="width: 100%; padding: 12px; background: var(--th-primary, #6c5ce7); color: #fff; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">Sign In</button>
  </form>
  <div style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: #64748b;">
    Don't have an account? <a href="{{ route('store.register.show') }}" style="color: var(--th-primary, #6c5ce7); font-weight: 600;">Create one</a>
  </div>
</div>
@endsection`);

  fs.writeFileSync(path.join(authDir, 'register.blade.php'), `@extends(store_theme_layout())
@section('title', 'Create Account — ' . (\$s->store_name ?? '${name}'))
@section('content')
<div style="max-width: 480px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <h2 style="margin-top: 0; font-weight: 800; font-size: 1.6rem;">Create Account</h2>
  <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 24px;">Join for seamless ordering and tracking.</p>
  <form method="POST" action="{{ route('store.register') }}">
    @csrf
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Full Name</label>
      <input type="text" name="name" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Email</label>
      <input type="email" name="email" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Phone Number</label>
      <input type="tel" name="phone" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Delivery Address</label>
      <input type="text" name="address" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Password</label>
        <input type="password" name="password" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
      </div>
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 0.88rem;">Confirm</label>
        <input type="password" name="password_confirmation" required style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;">
      </div>
    </div>
    <button type="submit" style="width: 100%; padding: 12px; background: var(--th-primary, #6c5ce7); color: #fff; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">Register Now</button>
  </form>
  <div style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: #64748b;">
    Already have an account? <a href="{{ route('store.login.show') }}" style="color: var(--th-primary, #6c5ce7); font-weight: 600;">Sign In</a>
  </div>
</div>
@endsection`);

  console.log(`✅ Theme '${name}' [${slug}] created at:\n   ${targetDir}`);
} else if (command === 'validate') {
  const targetPath = path.resolve(args[1] || '.');
  console.log(`Auditing theme at ${targetPath}...`);
  if (!fs.existsSync(path.join(targetPath, 'theme.json'))) {
    console.error('❌ Missing theme.json');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(targetPath, 'layout.blade.php'))) {
    console.error('❌ Missing layout.blade.php');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(targetPath, 'style.css'))) {
    console.error('❌ Missing style.css');
    process.exit(1);
  }
  console.log('✅ Theme passed validation checks!');
} else if (command === 'pack') {
  const targetPath = path.resolve(args[1] || '.');
  const manifestPath = path.join(targetPath, 'theme.json');
  let slug = path.basename(targetPath);
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.slug) slug = manifest.slug;
    } catch (_) {}
  }
  const zipFile = path.resolve(process.cwd(), `theme-${slug}.zip`);
  execSync(`cd "${targetPath}" && zip -r "${zipFile}" . -x "*.DS_Store" "*.git*"`);
  console.log(`🎉 Theme packaged into: ${zipFile}`);
} else if (command === 'upload') {
  const zipFile = path.resolve(args[1] || '');
  const urlArg = args.find(a => a.startsWith('--url='));
  const tokenArg = args.find(a => a.startsWith('--token='));
  if (!zipFile || !urlArg) {
    console.error('Usage: invyra-theme upload <theme.zip> --url=<store-url> [--token=<token>]');
    process.exit(1);
  }
  const storeUrl = urlArg.split('=')[1].replace(/\/$/, '');
  const token = tokenArg ? tokenArg.split('=')[1] : '';
  const authHeader = token ? `-H "Authorization: Bearer ${token}"` : '';
  const endpoint = `${storeUrl}/api/admin/store/themes/upload`;
  const cmd = `curl -k -s -X POST -F "theme=@${zipFile}" ${authHeader} -H "Accept: application/json" "${endpoint}"`;
  console.log(`Uploading ${zipFile} to ${endpoint}...`);
  const out = execSync(cmd).toString();
  console.log(out);
} else {
  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}
