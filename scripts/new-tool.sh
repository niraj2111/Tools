#!/usr/bin/env bash
set -euo pipefail

# Create a new tool from the p5 + Tweakpane + SVG template
# Usage: scripts/new-tool.sh "My Tool Title" my-tool-slug

TITLE=${1:-"My Tool"}
SLUG=${2:-}

if [ -z "$SLUG" ]; then
  # derive slug from title
  SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
fi

DEST="tools/$SLUG"
if [ -e "$DEST" ]; then
  echo "Error: $DEST already exists" 1>&2
  exit 1
fi

mkdir -p "tools"
cp -R "templates/p5-tweakpane-svg" "$DEST"

# Replace placeholders
if sed --version >/dev/null 2>&1; then
  # GNU sed
  sed -i "s/__TOOL_TITLE__/$TITLE/g" "$DEST/index.html" "$DEST/sketch.js" "$DEST/README.md"
  sed -i "s/__TOOL_SLUG__/$SLUG/g" "$DEST/index.html" "$DEST/sketch.js" "$DEST/README.md"
else
  # macOS/BSD sed
  sed -i '' "s/__TOOL_TITLE__/$TITLE/g" "$DEST/index.html" "$DEST/sketch.js" "$DEST/README.md"
  sed -i '' "s/__TOOL_SLUG__/$SLUG/g" "$DEST/index.html" "$DEST/sketch.js" "$DEST/README.md"
fi

echo "Created $DEST"
echo "Run a local server and open $DEST/index.html"

