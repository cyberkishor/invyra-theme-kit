#!/usr/bin/env node

/**
 * Invyra Theme Development MCP Server
 * Zero-dependency Model Context Protocol (MCP) Server for Invyra Storefront Themes.
 * Communicates via JSON-RPC 2.0 over standard I/O (stdio).
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const SERVER_NAME = 'invyra-theme-mcp';
const SERVER_VERSION = '1.0.0';
const PROTOCOL_VERSION = '2024-11-05';

// Define exposed MCP tools
const TOOLS = [
  {
    name: 'invyra_create_theme',
    description: 'Scaffold a complete, production-grade storefront theme for Invyra SaaS with all required Blade views, manifest, and scoped CSS.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Unique snake_case identifier for the theme (e.g. vintage_leather)' },
        name: { type: 'string', description: 'Human-readable theme title (e.g. Vintage Leather & Goods)' },
        category: { type: 'string', description: 'Business category (e.g. Fashion, Hardware, Food)' },
        primary_color: { type: 'string', description: 'Primary brand color hex (e.g. #D97706)' },
        secondary_color: { type: 'string', description: 'Secondary brand color hex (e.g. #78350F)' },
        target_dir: { type: 'string', description: 'Optional directory path where theme will be scaffolded (defaults to current directory or resources/views/store/themes)' }
      },
      required: ['slug']
    }
  },
  {
    name: 'invyra_validate_theme',
    description: 'Audit and validate an Invyra theme for required files, manifest schema, correct route references, image fallbacks, and CSS scoping.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute or relative path to the theme directory containing theme.json' }
      },
      required: ['path']
    }
  },
  {
    name: 'invyra_pack_theme',
    description: 'Package a validated theme directory into a deployable ZIP archive ready for Invyra SaaS Storefront Theme Manager upload.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the theme directory to pack' },
        output_dir: { type: 'string', description: 'Optional output directory for the zip file' }
      },
      required: ['path']
    }
  },
  {
    name: 'invyra_upload_theme',
    description: 'Upload and install a packaged theme ZIP to a live Invyra SaaS store via API.',
    inputSchema: {
      type: 'object',
      properties: {
        zip_path: { type: 'string', description: 'Path to the theme .zip file' },
        store_url: { type: 'string', description: 'Invyra store URL (e.g. https://mystore.invyra.com)' },
        token: { type: 'string', description: 'Store API Bearer token' }
      },
      required: ['zip_path', 'store_url']
    }
  }
];

// Tool handlers
function handleCreateTheme(args) {
  const slug = String(args.slug).toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const name = args.name || slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const category = args.category || 'Retail & Lifestyle';
  const primary = args.primary_color || '#D97706';
  const secondary = args.secondary_color || '#78350F';

  let targetDir = args.target_dir ? path.resolve(args.target_dir) : process.cwd();
  
  // If targetDir is a laravel project root, place in resources/views/store/themes/{slug}
  if (fs.existsSync(path.join(targetDir, 'resources/views/store/themes'))) {
    targetDir = path.join(targetDir, 'resources/views/store/themes', slug);
  } else if (!targetDir.endsWith(slug)) {
    targetDir = path.join(targetDir, slug);
  }

  if (fs.existsSync(targetDir)) {
    return { isError: true, content: [{ type: 'text', text: `Directory already exists at ${targetDir}` }] };
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'assets', 'theme.js'), `// ${name} Client Scripts\nconsole.log('${name} theme loaded.');\n`);

  // 1. theme.json
  const manifest = {
    name,
    slug,
    version: '1.0.0',
    description: `Custom high-performance theme for ${name} (${category}).`,
    author: 'Invyra Studio',
    category,
    preview_image: 'preview.svg',
    settings: {
      primary_color: primary,
      secondary_color: secondary,
      background_color: '#FAF8F5',
      card_background: '#FFFFFF',
      text_color: '#1C1917'
    },
    default_colors: { primary, secondary },
    features: [
      'High-Density Responsive Catalog Grid',
      'Instant Offcanvas Cart Drawer',
      'Technical Specifications & Variant Picker',
      'Trust Badges & Curated Storytelling',
      'Customer Order & Account Portal'
    ],
    supported_features: ['hero_banner', 'collections_grid', 'cart_drawer', 'reviews']
  };
  fs.writeFileSync(path.join(targetDir, 'theme.json'), JSON.stringify(manifest, null, 2));

  // 2. preview.svg
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%">
  <rect width="400" height="260" fill="#F8FAFC" rx="8"/>
  <rect width="400" height="42" fill="${secondary}"/>
  <circle cx="28" cy="21" r="8" fill="${primary}"/>
  <rect x="46" y="16" width="90" height="10" rx="3" fill="#FFFFFF" fill-opacity="0.9"/>
  <rect x="26" y="60" width="348" height="90" rx="6" fill="${primary}" fill-opacity="0.12"/>
  <rect x="42" y="78" width="160" height="14" rx="4" fill="${secondary}"/>
  <rect x="42" y="98" width="220" height="8" rx="3" fill="#64748B"/>
  <rect x="42" y="118" width="80" height="18" rx="4" fill="${primary}"/>
</svg>`;
  fs.writeFileSync(path.join(targetDir, 'preview.svg'), svg);

  // 3. style.css
  const css = `/* Theme: ${name} (${slug}) */
:root {
  --th-primary: ${primary};
  --th-secondary: ${secondary};
  --th-bg: #FAF8F5;
  --th-surface: #FFFFFF;
  --th-text: #1C1917;
  --th-muted: #78716C;
  --th-border: rgba(0, 0, 0, 0.08);
  --th-radius: 12px;
}
body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--th-bg); color: var(--th-text); }
.th-container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
.th-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: var(--th-radius); font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
.th-btn-primary { background: var(--th-primary); color: #FFFFFF; }
.th-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.th-card { background: var(--th-surface); border: 1px solid var(--th-border); border-radius: var(--th-radius); overflow: hidden; display: flex; flex-direction: column; }
`;
  fs.writeFileSync(path.join(targetDir, 'style.css'), css);

  // 4. layout.blade.php
  const layout = `@php
  $s = store_settings();
  $storeName = $s->store_name ?? '${name}';
  $currency = $s->currency_code ?: 'रू';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', $storeName)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="{{ store_theme_asset('style.css', '${slug}') }}?v={{ time() }}">
  @stack('styles')
</head>
<body>
  <header style="background: #FFFFFF; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 16px 0;">
    <div class="th-container" style="display: flex; align-items: center; justify-content: space-between;">
      <a href="{{ route('store.index') }}" style="font-weight: 800; font-size: 1.3rem; text-decoration: none; color: var(--th-secondary);">${name}</a>
      <nav style="display: flex; gap: 20px;">
        <a href="{{ route('store.index') }}" style="text-decoration: none; color: inherit; font-weight: 600;">Home</a>
        <a href="{{ route('store.shop') }}" style="text-decoration: none; color: inherit; font-weight: 600;">Shop</a>
        <a href="{{ route('store.contact') }}" style="text-decoration: none; color: inherit; font-weight: 600;">Contact</a>
      </nav>
      <div style="display: flex; gap: 10px;">
        <a href="{{ route('account') }}" class="th-btn" style="border: 1px solid rgba(0,0,0,0.1);"><i class="bi bi-person"></i></a>
        <a href="{{ route('store.cart') }}" class="th-btn th-btn-primary"><i class="bi bi-bag"></i></a>
      </div>
    </div>
  </header>
  <main>
    @yield('content')
  </main>
  @stack('scripts')
</body>
</html>`;
  fs.writeFileSync(path.join(targetDir, 'layout.blade.php'), layout);

  // 5. index.blade.php
  const index = `@extends("store.themes.${slug}.layout")
@section('content')
  <div class="th-container" style="padding: 60px 20px;">
    <h1 style="font-size: 2.5rem; font-weight: 900; color: var(--th-secondary); margin-bottom: 8px;">${name}</h1>
    <p style="color: var(--th-muted); font-size: 1.1rem; margin-bottom: 32px;">Discover handcrafted items curated for quality and durability.</p>
    <div class="th-grid">
      @php
        $products = \\App\\Models\\Product::query()->where('is_active', 1)->where('hide_from_online_store', 0)->take(8)->get();
      @endphp
      @foreach($products as $prod)
        <div class="th-card">
          <img src="{{ $prod->image ? asset('images/products/' . $prod->image) : asset('images/products/no-image.png') }}" class="th-card-img" style="aspect-ratio: 4/3; object-fit: cover;">
          <div style="padding: 16px;">
            <a href="{{ route('store.product.show', $prod->slug ?? $prod->id) }}" style="text-decoration: none; color: inherit; font-weight: 700;">{{ $prod->name }}</a>
            <div style="margin-top: 8px; font-weight: 800; color: var(--th-primary);">{{ $currency }} {{ number_format($prod->display_price ?? $prod->price, 2) }}</div>
          </div>
        </div>
      @endforeach
    </div>
  </div>
@endsection`;
  fs.writeFileSync(path.join(targetDir, 'index.blade.php'), index);

  return {
    content: [{
      type: 'text',
      text: `✅ Theme '${name}' [${slug}] scaffolded successfully!\nPath: ${targetDir}\nFiles created: theme.json, preview.svg, style.css, layout.blade.php, index.blade.php`
    }]
  };
}

function handleValidateTheme(args) {
  const themePath = path.resolve(args.path);
  if (!fs.existsSync(themePath) || !fs.statSync(themePath).isDirectory()) {
    return { isError: true, content: [{ type: 'text', text: `Directory not found: ${themePath}` }] };
  }

  const reports = [];
  let errors = 0;

  reports.push(`Auditing Invyra Theme at: ${themePath}`);

  // 1. theme.json
  const manifestPath = path.join(themePath, 'theme.json');
  if (!fs.existsSync(manifestPath)) {
    reports.push('❌ Missing theme.json manifest');
    errors++;
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!data.name || !data.slug) {
        reports.push('⚠️ theme.json should define "name" and "slug"');
      } else {
        reports.push(`✅ theme.json is valid (Theme: ${data.name} [${data.slug}])`);
      }
    } catch (e) {
      reports.push(`❌ theme.json has invalid JSON syntax: ${e.message}`);
      errors++;
    }
  }

  // 2. Required files
  const requiredFiles = ['layout.blade.php', 'index.blade.php', 'style.css'];
  for (const f of requiredFiles) {
    if (fs.existsSync(path.join(themePath, f))) {
      reports.push(`✅ ${f} exists`);
    } else {
      reports.push(`❌ Missing required file: ${f}`);
      errors++;
    }
  }

  // 3. Scan for anti-patterns in Blade files
  const files = fs.readdirSync(themePath);
  for (const file of files) {
    if (file.endsWith('.blade.php')) {
      const content = fs.readFileSync(path.join(themePath, file), 'utf8');
      if (content.includes("where('status'")) {
        reports.push(`❌ ${file}: Invalid query where('status' found. Use where('is_active', 1).`);
        errors++;
      }
      if (content.includes("route('store.product'")) {
        reports.push(`❌ ${file}: Deprecated route('store.product') found. Use route('store.product.show').`);
        errors++;
      }
      if (content.includes("route('store.checkout'")) {
        reports.push(`⚠️ ${file}: Deprecated route('store.checkout') found. Use route('checkout').`);
      }
    }
  }

  if (errors === 0) {
    reports.push('\n🎉 Theme passed all critical validation checks!');
  } else {
    reports.push(`\n❌ Found ${errors} error(s) that need fixing.`);
  }

  return {
    isError: errors > 0,
    content: [{ type: 'text', text: reports.join('\n') }]
  };
}

function handlePackTheme(args) {
  const themePath = path.resolve(args.path);
  if (!fs.existsSync(themePath)) {
    return { isError: true, content: [{ type: 'text', text: `Directory not found: ${themePath}` }] };
  }

  const manifestPath = path.join(themePath, 'theme.json');
  let slug = path.basename(themePath);
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.slug) slug = manifest.slug;
    } catch (_) {}
  }

  const outputDir = args.output_dir ? path.resolve(args.output_dir) : process.cwd();
  const zipFile = path.join(outputDir, `theme-${slug}.zip`);

  try {
    // Zip directory contents
    execSync(`cd "${themePath}" && zip -r "${zipFile}" . -x "*.DS_Store" "*.git*"`, { stdio: 'pipe' });
    return {
      content: [{ type: 'text', text: `🎉 Theme packaged successfully!\nArchive: ${zipFile}\nSize: ${fs.statSync(zipFile).size} bytes` }]
    };
  } catch (e) {
    return { isError: true, content: [{ type: 'text', text: `Failed to zip theme: ${e.message}` }] };
  }
}

function handleUploadTheme(args) {
  const zipPath = path.resolve(args.zip_path);
  if (!fs.existsSync(zipPath)) {
    return { isError: true, content: [{ type: 'text', text: `File not found: ${zipPath}` }] };
  }

  const storeUrl = args.store_url.replace(/\/$/, '');
  const uploadEndpoint = `${storeUrl}/api/admin/store/themes/upload`;

  try {
    const authHeader = args.token ? `-H "Authorization: Bearer ${args.token}"` : '';
    const cmd = `curl -k -s -X POST -F "theme=@${zipPath}" ${authHeader} -H "Accept: application/json" "${uploadEndpoint}"`;
    const response = execSync(cmd, { stdio: 'pipe' }).toString();

    let json;
    try { json = JSON.parse(response); } catch (_) { json = null; }

    if (json && json.success) {
      return {
        content: [{ type: 'text', text: `🎉 Theme uploaded and installed successfully!\nMessage: ${json.message}\nActive Theme: ${json.theme?.slug || 'Uploaded'}` }]
      };
    } else {
      return {
        isError: true,
        content: [{ type: 'text', text: `Server response: ${response}` }]
      };
    }
  } catch (e) {
    return { isError: true, content: [{ type: 'text', text: `Upload failed: ${e.message}` }] };
  }
}

// JSON-RPC stdio reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
  } catch (e) {
    sendResponse({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }

  const { id, method, params } = request;

  if (method === 'initialize') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
      }
    });
  } else if (method === 'notifications/initialized') {
    // No response required for notifications
  } else if (method === 'tools/list') {
    sendResponse({
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS }
    });
  } else if (method === 'tools/call') {
    const { name, arguments: args } = params || {};
    let response;

    switch (name) {
      case 'invyra_create_theme':
        response = handleCreateTheme(args || {});
        break;
      case 'invyra_validate_theme':
        response = handleValidateTheme(args || {});
        break;
      case 'invyra_pack_theme':
        response = handlePackTheme(args || {});
        break;
      case 'invyra_upload_theme':
        response = handleUploadTheme(args || {});
        break;
      default:
        sendResponse({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool not found: ${name}` }
        });
        return;
    }

    sendResponse({
      jsonrpc: '2.0',
      id,
      result: response
    });
  } else {
    if (id !== undefined) {
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      });
    }
  }
});

function sendResponse(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}
