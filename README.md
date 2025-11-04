# ColorRevive ➕

A browser extension for Chrome and Firefox that automatically removes grayscale filters from websites, restoring vibrant colours for better readability.

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/thongtech/colorrevive)
[![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-yellow.svg)](manifest.json)
[![Firefox](https://img.shields.io/badge/Firefox-Manifest%20V2-orange.svg)](manifest.firefox.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/blkhbcflichlgphgahiglmnjpinepkni?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/colorrevive/blkhbcflichlgphgahiglmnjpinepkni)
[![Firefox Add-on](https://img.shields.io/amo/v/colorrevive?label=Firefox%20Add-on)](https://addons.mozilla.org/en-GB/firefox/addon/colorrevive/)

**[English](README.md) | [ภาษาไทย](README.th.md)**

## 🌟 Overview

<p align="center">
  <img src="docs/screenshots/screenshot.png" alt="ColorRevive Screenshot" width="600">
</p>

ColorRevive detects and removes CSS grayscale filters applied to websites, instantly restoring full colour. Whether websites use grayscale for design choices, accessibility features, or special occasions, ColorRevive gives you control to view content in full colour when you need better readability.

<p align="center">
  <img src="docs/screenshots/before_after.png" alt="Before and After Comparison" width="600">
</p>

The extension works silently in the background, automatically detecting and removing grayscale filters while you browse. With a simple toggle, you can enable or disable the colour restoration at any time.

## ✨ Features

- 🎯 **Automatic Colour Restoration** - Instantly removes grayscale filters when you visit a website
- 📝 **Whitelist Control** - Choose which sites to keep in grayscale
- 🔒 **Privacy-First** - No data collection, everything stays on your computer
- ⚙️ **No Setup Required** - Just install and it works
- 🦊 **Works Everywhere** - Compatible with any Chrome-based and Firefox-based browsers

<div style="margin-top: 30px;"></div>

<p align="center">
  <img src="docs/screenshots/features.png" alt="Features" width="600">
</p>


## 🎯 Use Cases

ColorRevive is designed to help in various scenarios:

### 1. **Mourning Period Websites**
Many websites, particularly in Thailand and other Asian countries, apply grayscale filters during mourning periods as a mark of respect. While culturally significant, this can make content difficult to read, especially on websites with media and images.

**Example:** Thai government websites, news portals, and banks often apply `filter: grayscale(100%)` during national mourning periods.

### 2. **Accessibility Improvements**
Some users find grayscale websites harder to read due to:
- Reduced contrast making text less legible
- Difficulty distinguishing UI elements
- Eye strain from monochrome displays
- Confusion in colour-coded information

## 🚀 Installation

### Google Chrome / Chromium-based

#### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/colorrevive/blkhbcflichlgphgahiglmnjpinepkni)
2. Click "Add to Chrome"
3. Enjoy!

#### From GitHub Release
1. Download `colorrevive-chrome-<version>.zip` from [Releases](https://github.com/thongtech/colorrevive/releases/latest)
2. Extract the ZIP file
3. Open `chrome://extensions/` in your browser
4. Enable "Developer mode" (toggle in the top right)
5. Click "Load unpacked"
6. Select the extracted folder
7. The extension icon will appear in your toolbar

### Mozilla Firefox / Gecko-based

#### From Firefox Add-ons (Recommended)
1. Visit [Firefox Add-ons](https://addons.mozilla.org/en-GB/firefox/addon/colorrevive/)
2. Click "Add to Firefox"
3. Enjoy!

#### From GitHub Release
1. Download `colorrevive-firefox-<version>.zip` from [Releases](https://github.com/thongtech/colorrevive/releases/latest)
2. Extract the ZIP file
3. Open `about:debugging#/runtime/this-firefox` in your browser
4. Click "Load Temporary Add-on"
5. Navigate to the extracted folder and select `manifest.json`
6. The extension will be loaded temporarily (removed on browser restart)

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to report issues on [GitHub Issues](https://github.com/thongtech/colorrevive/issues)

All contributions are welcome!
