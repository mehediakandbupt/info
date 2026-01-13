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
      this.loadHero();
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
      this.loadHero();
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
                <a class="nav-link" href="index.html">${this.t('navbar.home')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">${this.t('navbar.about')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="projects.html">${this.t('navbar.projects')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="publications.html">${this.t('navbar.publications')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="contact.html">${this.t('navbar.contact')}</a>
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

  // Load hero component with current language
  loadHero() {
    const heroContainer = document.getElementById('hero-container');
    if (!heroContainer) return;

    const heroHTML = `
      <section class="hero-section py-5">
        <div class="container">
          <div class="row align-items-stretch g-4">
            <!-- Left Column: Profile Card (Image + Basic Info) -->
            <div class="col-lg-3">
              <div class="card border-0 shadow profile-card">
                <!-- Card Image -->
                <img src="assets/images/profile/hasan.jpg" alt="Profile Photo" class="card-img-top">
                
                <!-- Card Body - Basic Info -->
                <div class="card-body text-center">
                  <div class="info-item">
                    <span class="info-label">${this.t('profile.nationality')}</span>
                    <p class="info-value">${this.t('profile.nationalityValue')}</p>
                  </div>

                  <hr class="my-2">

                  <div class="info-item">
                    <span class="info-label">${this.t('profile.age')}</span>
                    <p class="info-value">${this.t('profile.ageValue')}</p>
                  </div>

                  <hr class="my-2">

                  <div class="info-item">
                    <span class="info-label">${this.t('profile.email')}</span>
                    <p class="info-value">
                      <a href="mailto:${this.t('profile.emailValue')}" class="text-decoration-none">${this.t('profile.emailValue')}</a>
                    </p>
                  </div>

                  <hr class="my-2">

                  <div class="info-item">
                    <span class="info-label">${this.t('profile.phone')}</span>
                    <p class="info-value">
                      <a href="tel:${this.t('profile.phoneValue').replace(/\s/g, '')}" class="text-decoration-none">${this.t('profile.phoneValue')}</a>
                    </p>
                  </div>

                  <hr class="my-2">

                  <div class="info-item">
                    <span class="info-label">${this.t('profile.location')}</span>
                    <p class="info-value">${this.t('profile.locationValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Professional Summary/Bio -->
            <div class="col-lg-9">
              <div class="bio-content">
                <h1 class="hero-name">${this.t('hero.name')}</h1>
                <p class="hero-title text-muted mb-4">${this.t('hero.title')}</p>
                
                <p class="hero-bio lead">${this.t('hero.bio')}</p>
                
                <!-- Social Links -->
                <div class="social-links mb-4">
                  <a href="https://github.com/hmmakand" class="btn btn-outline-dark btn-sm mx-2" title="GitHub" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/mehedi-hasan-04a09863" class="btn btn-outline-dark btn-sm mx-2" title="LinkedIn" target="_blank">
                    <i class="fab fa-linkedin"></i> LinkedIn
                  </a>
                  <a href="https://www.researchgate.net/profile/Mohammad-Mehedi-Hasan-9?ev=hdr_xprf" class="btn btn-outline-dark btn-sm mx-2" title="ResearchGate" target="_blank">
                    <i class="fab fa-researchgate"></i> ResearchGate
                  </a>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    heroContainer.innerHTML = heroHTML;
  }

  // Helper method to load component from file
  loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(componentPath)
      .then(response => response.text())
      .then(data => {
        container.innerHTML = data;
      })
      .catch(error => console.error(`Error loading ${componentPath}:`, error));
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
