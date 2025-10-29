document.addEventListener('DOMContentLoaded', async function() {
  // Universal browser API - works on both Chrome and Firefox
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  
  const toggle = document.getElementById('toggleEnabled');
  const statusText = document.getElementById('statusText');
  const statusDot = document.getElementById('statusDot');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const themeLightBtn = document.getElementById('themeLightBtn');
  const themeDarkBtn = document.getElementById('themeDarkBtn');
  const langEnBtn = document.getElementById('langEnBtn');
  const langThBtn = document.getElementById('langThBtn');
  const githubLink = document.getElementById('githubLink');
  
  const STORAGE_KEY = 'colorReviveEnabled';
  const LANG_KEY = 'colorReviveLanguage';
  const THEME_KEY = 'colorReviveTheme';
  const WHITELIST_KEY = 'colorReviveWhitelist';
  
  let currentLocale = {};
  let currentLang = 'en';
  let currentTheme = 'light';
  let whitelist = [];

  // Detect browser language
  function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('th') ? 'th' : 'en';
  }

  // Detect system theme preference
  function detectSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    // Update active state
    if (themeLightBtn && themeDarkBtn) {
      themeLightBtn.classList.toggle('active', theme === 'light');
      themeDarkBtn.classList.toggle('active', theme === 'dark');
    }
  }

  // Load and apply saved theme
  async function loadTheme() {
    try {
      const result = await browserAPI.storage.sync.get(THEME_KEY);
      const savedTheme = result[THEME_KEY];
      const theme = savedTheme || detectSystemTheme();
      applyTheme(theme);
    } catch (error) {
      console.error('Error loading theme:', error);
      applyTheme(detectSystemTheme());
    }
  }

  // Set theme
  async function setTheme(theme) {
    applyTheme(theme);
    try {
      await browserAPI.storage.sync.set({ [THEME_KEY]: theme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  // Load locale file
  async function loadLocale(lang) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error('Locale not found');
      currentLocale = await response.json();
      return true;
    } catch (error) {
      console.error(`Failed to load locale ${lang}:`, error);
      // Fallback to English if Thai fails
      if (lang !== 'en') {
        const response = await fetch('locales/en.json');
        currentLocale = await response.json();
      }
      return false;
    }
  }

  // Update all i18n elements
  function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (currentLocale[key]) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = currentLocale[key];
        } else {
          element.textContent = currentLocale[key];
        }
      }
    });
  }

  // Initialize language
  async function initLanguage() {
    const stored = await browserAPI.storage.sync.get([LANG_KEY]);
    currentLang = stored[LANG_KEY] || detectBrowserLanguage();
    
    await loadLocale(currentLang);
    updateI18n();
    document.documentElement.lang = currentLang;
    
    // Update active state
    if (langEnBtn && langThBtn) {
      langEnBtn.classList.toggle('active', currentLang === 'en');
      langThBtn.classList.toggle('active', currentLang === 'th');
    }
  }

  // Set language
  async function setLanguage(lang) {
    currentLang = lang;
    await browserAPI.storage.sync.set({ [LANG_KEY]: currentLang });
    await loadLocale(currentLang);
    updateI18n();
    document.documentElement.lang = currentLang;
    
    // Update active state
    if (langEnBtn && langThBtn) {
      langEnBtn.classList.toggle('active', lang === 'en');
      langThBtn.classList.toggle('active', lang === 'th');
    }
    
    // Update status text with current state
    const result = await browserAPI.storage.sync.get([STORAGE_KEY]);
    const isEnabled = result[STORAGE_KEY] !== false;
    updateStatus(isEnabled);
  }

  // Toggle settings panel
  function toggleSettingsPanel() {
    const isOpen = settingsPanel.classList.toggle('open');
    settingsToggle.classList.toggle('active', isOpen);
  }

  // Close settings panel when clicking outside
  document.addEventListener('click', function(e) {
    if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
      settingsPanel.classList.remove('open');
      settingsToggle.classList.remove('active');
    }
  });

  // Settings panel event listeners
  settingsToggle.addEventListener('click', toggleSettingsPanel);
  
  themeLightBtn.addEventListener('click', () => setTheme('light'));
  themeDarkBtn.addEventListener('click', () => setTheme('dark'));
  
  langEnBtn.addEventListener('click', () => setLanguage('en'));
  langThBtn.addEventListener('click', () => setLanguage('th'));

  // Update status display
  function updateStatus(isEnabled) {
    const enabledText = currentLocale.statusEnabled || 'Enabled';
    const disabledText = currentLocale.statusDisabled || 'Disabled';
    
    statusText.textContent = isEnabled ? enabledText : disabledText;
    statusDot.className = `status-dot ${isEnabled ? 'active' : 'inactive'}`;
    
    // Animate the change
    statusText.style.animation = 'none';
    setTimeout(() => {
      statusText.style.animation = 'fadeIn 0.3s ease';
    }, 10);
  }

  // Initialize
  await initLanguage();
  await loadTheme();

  // Load extension state
  browserAPI.storage.sync.get([STORAGE_KEY], function(result) {
    const isEnabled = result[STORAGE_KEY] !== false;
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
  });

  // Handle toggle change
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    browserAPI.storage.sync.set({ [STORAGE_KEY]: isEnabled }, function() {
      updateStatus(isEnabled);
      
      // Add ripple effect
      const card = document.querySelector('.status-card');
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = 'pulse 0.3s ease';
      }, 10);
    });
  });

  // Handle GitHub link
  githubLink.addEventListener('click', function(e) {
    e.preventDefault();
    browserAPI.tabs.create({ url: 'https://github.com/thongtech/colorrevive' });
  });

  // Whitelist management
  const whitelistInput = document.getElementById('whitelistInput');
  const addWhitelistBtn = document.getElementById('addWhitelistBtn');
  const whitelistContainer = document.getElementById('whitelistContainer');
  const whitelistEmpty = document.getElementById('whitelistEmpty');

  // Load whitelist
  async function loadWhitelist() {
    const result = await browserAPI.storage.sync.get([WHITELIST_KEY]);
    whitelist = result[WHITELIST_KEY] || ['facebook.com'];
    
    // Save default if empty
    if (!result[WHITELIST_KEY]) {
      await browserAPI.storage.sync.set({ [WHITELIST_KEY]: whitelist });
    }
    
    displayWhitelist();
  }

  // Display whitelist
  function displayWhitelist() {
    whitelistContainer.innerHTML = '';
    
    if (whitelist.length === 0) {
      whitelistEmpty.style.display = 'block';
      whitelistContainer.appendChild(whitelistEmpty);
    } else {
      whitelistEmpty.style.display = 'none';
      
      whitelist.forEach(domain => {
        const item = document.createElement('div');
        item.className = 'whitelist-item';
        
        const domainText = document.createElement('span');
        domainText.className = 'whitelist-domain';
        domainText.textContent = domain;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'whitelist-remove-btn';
        removeBtn.textContent = currentLocale.whitelistRemove || 'Remove';
        removeBtn.setAttribute('data-i18n', 'whitelistRemove');
        removeBtn.addEventListener('click', () => removeDomain(domain));
        
        item.appendChild(domainText);
        item.appendChild(removeBtn);
        whitelistContainer.appendChild(item);
      });
    }
  }

  // Add domain to whitelist
  async function addDomain() {
    const domain = whitelistInput.value.trim();
    
    if (!domain) return;
    
    // Clean domain (remove protocol, www, trailing slash)
    const cleanDomain = domain
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')
      .toLowerCase();
    
    // Check if already exists
    if (whitelist.includes(cleanDomain)) {
      whitelistInput.value = '';
      return;
    }
    
    whitelist.push(cleanDomain);
    await browserAPI.storage.sync.set({ [WHITELIST_KEY]: whitelist });
    
    whitelistInput.value = '';
    displayWhitelist();
    
    // Animate
    whitelistContainer.style.animation = 'none';
    setTimeout(() => {
      whitelistContainer.style.animation = 'fadeIn 0.3s ease';
    }, 10);
  }

  // Remove domain from whitelist
  async function removeDomain(domain) {
    whitelist = whitelist.filter(d => d !== domain);
    await browserAPI.storage.sync.set({ [WHITELIST_KEY]: whitelist });
    
    displayWhitelist();
    
    // Animate
    whitelistContainer.style.animation = 'none';
    setTimeout(() => {
      whitelistContainer.style.animation = 'fadeIn 0.3s ease';
    }, 10);
  }

  // Add event listeners
  addWhitelistBtn.addEventListener('click', addDomain);
  
  whitelistInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addDomain();
    }
  });

  // Load whitelist on init
  await loadWhitelist();

  // Add smooth scroll behavior
  document.querySelector('.popup-container').style.opacity = '0';
  setTimeout(() => {
    document.querySelector('.popup-container').style.transition = 'opacity 0.3s ease';
    document.querySelector('.popup-container').style.opacity = '1';
  }, 10);
});
