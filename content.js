(function() {
  'use strict';

  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  let isEnabled;
  let isWhitelisted = false;
  let styleCheckInterval = null;
  let mutationObserver = null;
  let cachedCurrentDomain = null;
  const STORAGE_KEY = 'colorReviveEnabled';
  const WHITELIST_KEY = 'colorReviveWhitelist';

  function getCurrentDomain() {
    if (!cachedCurrentDomain) {
      const hostname = window.location.hostname;
      cachedCurrentDomain = hostname.replace(/^www\./, '').toLowerCase();
    }
    return cachedCurrentDomain;
  }

  function checkWhitelist(whitelist) {
    if (!whitelist || !Array.isArray(whitelist)) return false;
    const currentClean = getCurrentDomain();
    
    return whitelist.some(domain => {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase();
      return currentClean === cleanDomain || currentClean.endsWith('.' + cleanDomain);
    });
  }

  browserAPI.storage.sync.get([STORAGE_KEY, WHITELIST_KEY], function(result) {
    if (!result[WHITELIST_KEY]) {
      browserAPI.storage.sync.set({ [WHITELIST_KEY]: ['facebook.com'] });
      result[WHITELIST_KEY] = ['facebook.com'];
    }
    
    isEnabled = result[STORAGE_KEY] !== false;
    isWhitelisted = checkWhitelist(result[WHITELIST_KEY]);
    
    if (isEnabled && !isWhitelisted) {
      activateExtension();
    }
  });

  browserAPI.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
      if (changes[STORAGE_KEY]) {
        isEnabled = changes[STORAGE_KEY].newValue;
      }
      
      if (changes[WHITELIST_KEY]) {
        isWhitelisted = checkWhitelist(changes[WHITELIST_KEY].newValue);
      }
      
      if (isEnabled && !isWhitelisted) {
        activateExtension();
      } else {
        deactivateExtension();
      }
    }
  });

  function ensureStyleInjected() {
    if (!document.head) return;
    
    const styleId = 'colorrevive-override';
    let style = document.getElementById(styleId);
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* High specificity universal override */
        html:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        body:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        *:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake) {
          filter: none !important;
          -webkit-filter: none !important;
        }
        
        /* Extra high specificity for media elements */
        img:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        video:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        picture:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        svg:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake),
        canvas:not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake):not(#colorrevive-fake) {
          filter: none !important;
          -webkit-filter: none !important;
        }
      `;
    }
    
    if (document.head.lastChild !== style) {
      document.head.appendChild(style);
    }
  }

  function activateExtension() {
    ensureStyleInjected();
    forceRemoveFiltersFromMedia();
    
    if (!mutationObserver) {
      setupObservers();
    }
    
    if (!styleCheckInterval) {
      styleCheckInterval = setInterval(() => {
        if (isEnabled && !isWhitelisted) {
          ensureStyleInjected();
          forceRemoveFiltersFromMedia();
        }
      }, 2000);
    }
  }

  function removeFilterFromElement(element) {
    if (!element || !element.style) return;
    element.style.setProperty('filter', 'none', 'important');
    element.style.setProperty('-webkit-filter', 'none', 'important');
  }

  function forceRemoveFiltersFromMedia() {
    const mediaElements = document.querySelectorAll('img, video, picture, svg, canvas');
    mediaElements.forEach(removeFilterFromElement);
  }

  function setupObservers() {
    mutationObserver = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          removeFilterFromElement(mutation.target);
        } else if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              if (/^(IMG|VIDEO|PICTURE|SVG|CANVAS)$/.test(node.nodeName)) {
                removeFilterFromElement(node);
              }
              try {
                const mediaElements = node.querySelectorAll('img, video, picture, svg, canvas');
                mediaElements.forEach(removeFilterFromElement);
              } catch (e) {}
            }
          }
        }
      }
    });

    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      childList: true,
      subtree: true
    });
  }

  function deactivateExtension() {
    if (styleCheckInterval) {
      clearInterval(styleCheckInterval);
      styleCheckInterval = null;
    }
    
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    
    const style = document.getElementById('colorrevive-override');
    if (style) {
      style.remove();
    }
  }
})();
