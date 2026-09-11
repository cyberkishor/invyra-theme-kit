# Design Tokens & UI Architecture Reference

To ensure high visual quality, modularity, and zero stylesheet collision, follow these design token rules when authoring themes.

---

## 1. Naming Convention & Scoping

Each theme must choose a unique 2 to 4 letter lowercase prefix based on its slug.

| Theme | Prefix | Example Variables |
| :--- | :--- | :--- |
| `apex_hardware` | `apx-` | `--apx-primary`, `--apx-surface` |
| `himalayan_roast` | `hr-` | `--hr-espresso`, `--hr-amber` |
| `k_beauty` | `kb-` | `--kb-rose`, `--kb-mint` |
| `crust_crumb` | `cc-` | `--cc-crust`, `--cc-hearth` |
| `aurvi_jewellery` | `aur-` | `--aur-gold`, `--aur-obsidian` |
| `soundpulse_audio`| `sp-` | `--sp-cyan`, `--sp-violet` |

---

## 2. Core Token Hierarchy

Declare the following design tokens in `:root` inside `style.css`:

```css
:root {
  /* Brand Accents */
  --{prefix}-primary: #D97706;
  --{prefix}-secondary: #78350F;
  --{prefix}-accent: #F59E0B;

  /* Surfaces & Canvas */
  --{prefix}-bg: #FAF6F0;
  --{prefix}-surface: #FFFFFF;
  --{prefix}-card: #FFFFFF;
  --{prefix}-dark: #1C130E;

  /* Typography */
  --{prefix}-font-heading: 'Plus Jakarta Sans', sans-serif;
  --{prefix}-font-body: 'Plus Jakarta Sans', sans-serif;
  --{prefix}-text: #1C130E;
  --{prefix}-text-muted: #78716C;

  /* Borders & Shadows */
  --{prefix}-border: rgba(120, 53, 15, 0.12);
  --{prefix}-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --{prefix}-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --{prefix}-shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.12);

  /* Layout */
  --{prefix}-radius-sm: 6px;
  --{prefix}-radius: 12px;
  --{prefix}-radius-lg: 20px;
  --{prefix}-container: 1240px;
}
```

---

## 3. Essential UI Component Classes

1. **Buttons (`.{prefix}-btn`)**:
   - `.{prefix}-btn-primary`: Vibrant solid fill with hover lift.
   - `.{prefix}-btn-secondary` or `outline`: 1.5px border with subtle hover background.
2. **Product Cards (`.{prefix}-prod-card`)**:
   - Aspect ratio image container (1:1 or 4:3) with object-fit cover.
   - Price row with original strikethrough price and current display price.
   - Stock badge pill (`In Stock` / `Pre-order`).
   - Action buttons (Add to Bag / Quick View).
3. **Cart Drawer (`#{prefix}CartDrawer`)**:
   - Fixed slide-out drawer (`position: fixed; right: 0; top: 0; width: 420px; height: 100vh; z-index: 9999;`).
   - Smooth slide transition (`transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);`).
