#!/usr/bin/env bash
# ==============================================================================
# Invyra Storefront Theme Validator
# Usage: ./validate-theme.sh <slug>
# ==============================================================================

set -e

SLUG="$1"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <theme_slug>"
  exit 1
fi

VIEW_DIR="resources/views/store/themes/$SLUG"
PUBLIC_DIR="public/store_themes/$SLUG"

echo "========================================================="
echo " Auditing Invyra Theme: $SLUG"
echo "========================================================="

ERRORS=0

# 1. Directory Checks
if [ ! -d "$VIEW_DIR" ]; then
  echo "❌ Missing view directory: $VIEW_DIR"
  exit 1
fi

echo "✅ View directory exists: $VIEW_DIR"

# 2. Required Files Checklist
REQUIRED_FILES=(
  "theme.json"
  "layout.blade.php"
  "index.blade.php"
  "shop.blade.php"
  "product-detail.blade.php"
  "cart.blade.php"
  "checkout.blade.php"
  "thank-you.blade.php"
  "account.blade.php"
  "account_orders.blade.php"
  "order-show.blade.php"
  "contact.blade.php"
  "style.css"
  "preview.svg"
)

echo "Checking required template files..."
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$VIEW_DIR/$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ⚠️ Missing $file (will fallback to default if not provided)"
  fi
done

# 3. theme.json Validation
if [ -f "$VIEW_DIR/theme.json" ]; then
  if python3 -m json.tool "$VIEW_DIR/theme.json" > /dev/null 2>&1; then
    echo "✅ theme.json is valid JSON"
  else
    echo "❌ theme.json has invalid JSON syntax!"
    ERRORS=$((ERRORS + 1))
  fi
fi

# 4. Dangerous / Deprecated Syntax Checks
echo "Checking for deprecated patterns in $VIEW_DIR..."

if grep -rn "where('status'" "$VIEW_DIR" 2>/dev/null; then
  echo "❌ Found where('status' query! Products table does not have 'status' column. Use where('is_active', 1)."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ No invalid status column queries found."
fi

if grep -rn "route('store.product'" "$VIEW_DIR" 2>/dev/null; then
  echo "❌ Found deprecated route('store.product')! Use route('store.product.show')."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Route store.product.show is used correctly."
fi

if grep -rn "route('store.checkout'" "$VIEW_DIR" 2>/dev/null; then
  echo "❌ Found deprecated route('store.checkout')! Use route('checkout')."
  ERRORS=$((ERRORS + 1))
fi

if grep -rn "route('store.account'" "$VIEW_DIR" 2>/dev/null; then
  echo "❌ Found deprecated route('store.account')! Use route('account')."
  ERRORS=$((ERRORS + 1))
fi

# 5. Public Assets Mirror Check
echo "Checking public assets mirror in $PUBLIC_DIR..."
if [ -f "$PUBLIC_DIR/style.css" ]; then
  echo "✅ public/store_themes/$SLUG/style.css exists"
else
  echo "⚠️ Mirroring style.css to $PUBLIC_DIR/style.css..."
  mkdir -p "$PUBLIC_DIR"
  cp "$VIEW_DIR/style.css" "$PUBLIC_DIR/style.css" 2>/dev/null || true
fi

echo "========================================================="
if [ $ERRORS -eq 0 ]; then
  echo "🎉 Theme $SLUG passed all validation checks!"
  exit 0
else
  echo "⚠️ Theme $SLUG has $ERRORS error(s) to resolve."
  exit 1
fi
