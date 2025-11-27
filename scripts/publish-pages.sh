#!/usr/bin/env bash
set -euo pipefail

# Publish Vite build output to docs-gh/ for GitHub Pages (gh-pages branch)
ROOT="$(cd -- "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DO_PUSH=false

show_help() {
  cat <<'EOF'
Usage: ./scripts/publish-pages.sh [--push] [--help]

Builds the site with Vite, refreshes docs-gh/ with dist/, and optionally pushes docs-gh/ to the gh-pages branch (hooks skipped).

Options:
  --push   Build, sync docs-gh/, then push docs-gh/ to origin/gh-pages for Pages deployment.
  -h, --help  Show this help message.
EOF
}

case "${1:-}" in
  --push)
    DO_PUSH=true
    ;;
  -h|--help)
    show_help
    exit 0
    ;;
  "" )
    ;;
  *)
    echo "Unknown option: ${1:-}" >&2
    show_help
    exit 1
    ;;
esac

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

echo "📄 Copying wiki pages into docs-gh/wiki/..."
rsync -a --delete "$ROOT/src/wiki/" "$ROOT/docs-gh/wiki/"

echo "📦 Copying shared JS and manifest for wiki runtime..."
mkdir -p "$ROOT/docs-gh/js"
rsync -a --delete "$ROOT/src/js/" "$ROOT/docs-gh/js/"
if [ -f "$ROOT/public/manifest.json" ]; then
  cp "$ROOT/public/manifest.json" "$ROOT/docs-gh/manifest.json"
fi
if [ -f "$ROOT/src/sw.js" ]; then
  cp "$ROOT/src/sw.js" "$ROOT/docs-gh/sw.js"
fi

echo "✅ docs-gh/ updated with latest build."

if $DO_PUSH; then
  echo "🌐 Pushing docs-gh/ to gh-pages (skipping hooks)..."
  SKIP_SIMPLE_GIT_HOOKS=1 git subtree push --prefix docs-gh origin gh-pages
  echo "✅ gh-pages updated. Ensure GitHub Pages source is: gh-pages /"
else
  echo
  echo "Next steps:"
  echo "  git add docs-gh"
  echo "  git commit -m \"chore: publish pages build\""
  echo "  git push origin main"
  echo "If you want to publish directly: ./scripts/publish-pages.sh --push"
fi
