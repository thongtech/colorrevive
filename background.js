const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
const STORAGE_KEY = 'colorReviveEnabled';

// Icon paths
const ICON_PATHS = {
  enabled: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
  },
  disabled: {
    16: 'icons/icon16-disabled.png',
    48: 'icons/icon48-disabled.png',
    128: 'icons/icon128-disabled.png'
  }
};

// Update icon based on enabled state
async function updateIcon(isEnabled) {
  try {
    const action = browserAPI.action || browserAPI.browserAction;
    const iconPath = isEnabled ? ICON_PATHS.enabled : ICON_PATHS.disabled;
    
    await action.setIcon({
      path: iconPath
    });
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Initialize icon on startup
browserAPI.runtime.onStartup.addListener(async () => {
  const result = await browserAPI.storage.sync.get([STORAGE_KEY]);
  const isEnabled = result[STORAGE_KEY] !== false;
  await updateIcon(isEnabled);
});

// Listen for storage changes
browserAPI.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes[STORAGE_KEY]) {
    const isEnabled = changes[STORAGE_KEY].newValue !== false;
    updateIcon(isEnabled);
  }
});

// Initialize icon on installation
browserAPI.runtime.onInstalled.addListener(async () => {
  const result = await browserAPI.storage.sync.get([STORAGE_KEY]);
  const isEnabled = result[STORAGE_KEY] !== false;
  await updateIcon(isEnabled);
});

