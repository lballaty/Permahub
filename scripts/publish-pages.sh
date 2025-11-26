#!/usr/bin/env bash
set -euo pipefail

# Publish Vite build output to docs/ for GitHub Pages (main/docs source)
ROOT="$(cd -- "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "🔧 Publishing build to docs-gh/ for GitHub Pages..."

if [ ! -d node_modules ]; then
  echo "📦 node_modules not found; installing dependencies with npm ci..."
  npm ci
fi

echo "🏗️  Building site..."
npm run build

echo "🧹 Refreshing docs-gh/ with dist/ contents..."
rm -rf "$ROOT/docs-gh"
mkdir -p "$ROOT/docs-gh"
rsync -a --delete "$ROOT/dist/" "$ROOT/docs-gh/"

echo "✅ docs-gh/ updated with latest build."
echo
echo "Next steps:"
echo "  git add docs-gh"
echo "  git commit -m \"chore: publish pages build\""
echo "  git push origin main"
echo "Then ensure GitHub Pages is set to source: main /docs-gh"
