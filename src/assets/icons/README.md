# Permahub PWA Icons

## Required Icons

The PWA needs 8 icon sizes for full platform support:

- **72x72** - Android small
- **96x96** - Android medium, app shortcuts
- **128x128** - Android large
- **144x144** - Windows tile
- **152x152** - iOS small
- **192x192** - Android standard, PWA requirement
- **384x384** - Android medium-large
- **512x512** - Android large, splash screen, PWA requirement

## How to Generate Icons

### Option 1: Use the HTML Generator (Easiest)

1. Open `generate-icons.html` in your browser
2. Click "Download All Icons"
3. Save all 8 PNG files
4. Move them to this `/src/assets/icons/` folder

### Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create a simple green square placeholder (from project root)
cd src/assets/icons

# Generate all sizes
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#2d8659 \
    -gravity center \
    -pointsize $((size/6)) \
    -fill white \
    -annotate +0+0 'P' \
    icon-${size}x${size}.png
done
```

### Option 3: Use Figma/Sketch/Photoshop

1. Design a 1024x1024px master icon
2. Use these design guidelines:
   - **Background:** Permahub green (#2d8659) with gradient
   - **Icon:** Simple leaf, plant, or "P" monogram in white/cream
   - **Safe zone:** Keep important content in center 80% (for maskable icons)
   - **Simple shapes:** Details are lost at small sizes
3. Export 8 sizes listed above
4. Use PNG format with transparency support

### Option 4: Use an Online Tool

- **Favicon Generator:** https://realfavicongenerator.net/
- **PWA Asset Generator:** https://www.pwabuilder.com/imageGenerator
- **Maskable Icon Editor:** https://maskable.app/editor

## Design Guidelines

### Permahub Brand Colors
- Primary Green: `#2d8659`
- Dark Green: `#1a5f3f`
- Cream: `#f5f5f0`
- Terracotta: `#d4a574`

### Icon Design Tips
- ✅ Keep it simple (recognizable at 72px)
- ✅ High contrast (visible on light and dark backgrounds)
- ✅ Centered design (80% safe zone for maskable)
- ✅ Nature theme (leaf, plant, earth, hands, community)
- ❌ No small text (unreadable at small sizes)
- ❌ No complex details (lost when scaled down)

## Icon Purpose

| Size | Used For |
|------|----------|
| 72x72 | Android small icon |
| 96x96 | Android medium, app shortcuts |
| 128x128 | Android large |
| 144x144 | Windows 10/11 tile |
| 152x152 | iOS small icon |
| 192x192 | Android standard, **PWA minimum requirement** |
| 384x384 | Android large |
| 512x512 | Android XL, splash screen, **PWA minimum requirement** |

## Maskable Icons

For best Android support, icons should be "maskable" - designed to work with different shapes (circle, rounded square, squircle).

**Maskable Safe Zone:**
- Keep important content within center 80% of icon
- Fill entire 100% with background color/gradient
- Test at https://maskable.app/

## Current Status

**Status:** 🚧 Placeholder icons needed

**Next Steps:**
1. Open `generate-icons.html` in browser
2. Download all icons
3. Place them in this folder
4. Remove this README section after icons are generated

## Files in This Directory

After generation, you should have:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `generate-icons.html` (can delete after use)
- `README.md` (this file)
