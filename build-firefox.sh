#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Error: Version not specified"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

VERSION="$1"
OUTPUT_FILE="colorrevive-firefox-v${VERSION}.zip"

echo "🦊 Packaging ColorRevive for Firefox v${VERSION}"

if [ -f "$OUTPUT_FILE" ]; then
    echo "🗑️  Removing old package..."
    rm "$OUTPUT_FILE"
fi

cp manifest.json manifest.json.backup
cp manifest.firefox.json manifest.json

zip -r "$OUTPUT_FILE" \
    manifest.json \
    content.js \
    background.js \
    popup.html \
    popup.js \
    styles.css \
    icons/ \
    locales/

mv manifest.json.backup manifest.json

echo "✅ Firefox package created: $OUTPUT_FILE"

