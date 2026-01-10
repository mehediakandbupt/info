// Language Management System
class LanguageManager {
  constructor() {
    this.currentLang = this.getStoredLanguage() || 'en';
    this.translations = {};
    this.init();
  }

  // Initialize language manager
  async init() {
    try {
      const response = await fetch('assets/utils/translations.json');
      this.translations = await response.json();
      this.loadNavbar();
      this.updatePageContent();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  // Get stored language preference from localStorage
  getStoredLanguage() {
    return localStorage.getItem('language');
  }

  // Set language preference
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
      this.loadNavbar();
      this.updatePageContent();
    }
  }

  // Get translation text
  t(key) {
    const keys = key.split('.');
    let text = this.translations[this.currentLang];
    
    for (const k of keys) {
      text = text[k];
      if (!text) return key;
    }
    
    return text;
  }

  // Load navbar with current language
  loadNavbar() {
    const navContainer = document.getElementById('navbar-container');
    if (!navContainer) return;

    const navbarHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <!-- Brand/Full Name (Left) -->
          <a class="navbar-brand fw-bold" href="index.html">${this.t('navbar.brand')}</a>
          
          <!-- Toggler Button for Mobile -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <!-- Navbar Content -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <!-- Menu (Middle) -->
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <a class="nav-link" href="#home">${this.t('navbar.home')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#about">${this.t('navbar.about')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#projects">${this.t('navbar.projects')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#publications">${this.t('navbar.publications')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#contact">${this.t('navbar.contact')}</a>
              </li>
            </ul>
            
            <!-- Language Selector (Right) -->
            <div class="d-flex gap-2">
              <button class="btn btn-sm ${this.currentLang === 'en' ? 'btn-light' : 'btn-outline-light'}" onclick="langManager.setLanguage('en')">EN</button>
              <button class="btn btn-sm ${this.currentLang === 'zh' ? 'btn-light' : 'btn-outline-light'}" onclick="langManager.setLanguage('zh')">中文</button>
            </div>
          </div>
        </div>
      </nav>
    `;

    navContainer.innerHTML = navbarHTML;
  }

  // Update page content based on current language
  updatePageContent() {
    // Update page title
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
      pageTitle.textContent = this.t('navbar.brand');
    }

    // Update HTML lang attribute
    const htmlElement = document.documentElement;
    htmlElement.lang = this.currentLang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = this.t(key);
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    });
  }
}

// Initialize language manager when DOM is ready
let langManager;
document.addEventListener('DOMContentLoaded', () => {
  langManager = new LanguageManager();
});
