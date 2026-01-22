// Language Management System
class LanguageManager {
  constructor() {
    this.currentLang = this.getStoredLanguage() || 'en';
    this.translations = {};
    this.publicationsData = null;
    this.projectsData = null;
    this.qualificationsData = null;
    this.init();
  }

  // Initialize language manager
  async init() {
    try {
      const response = await fetch('assets/utils/translations.json');
      this.translations = await response.json();
      this.loadNavbar();
      this.loadHero();
      this.loadProjects();
      this.loadPublications();
      this.loadQualifications();
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
      this.loadProjects();
      this.loadPublications();
      this.loadQualifications();
      this.updatePageContent();
    }
  }

  // Load qualifications from JSON file
  async loadQualifications() {
    const titleEl = document.getElementById('qualifications-title');
    const tabsEl = document.getElementById('qualifications-tabs');
    const contentEl = document.getElementById('qualifications-content');
    if (!tabsEl || !contentEl) return;

    try {
      if (!this.qualificationsData) {
        const response = await fetch('assets/utils/qualifications.json');
        this.qualificationsData = await response.json();
      }

      const { labels, education, skills, languages } = this.qualificationsData;
      const lang = this.currentLang;
      const l = labels[lang];

      if (titleEl) {
        titleEl.textContent = l.sectionTitle;
      }

      tabsEl.innerHTML = `
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="education-tab" data-bs-toggle="tab" data-bs-target="#education" type="button" role="tab" aria-controls="education" aria-selected="true">${l.tabs.education}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="skills-tab" data-bs-toggle="tab" data-bs-target="#skills" type="button" role="tab" aria-controls="skills" aria-selected="false">${l.tabs.skills}</button>
        </li>
      `;

      const educationHtml = education.map(item => {
        const degree = item.degree?.[lang] || item.degree?.en || '';
        const institution = item.institution?.[lang] || item.institution?.en || '';
        const year = item.year?.[lang] || item.year?.en || '';
        const focusLabel = item.focusLabel?.[lang] || item.focusLabel?.en || '';
        const focusTitle = item.focusTitle?.[lang] || item.focusTitle?.en || '';
        const description = item.description?.[lang] || item.description?.en || '';

        return `
          <div class="timeline-item">
            <span class="timeline-dot"></span>
            <div class="timeline-card">
              <h5 class="mb-1">${degree}</h5>
              <div class="timeline-meta">${institution} — ${year}</div>
              <div class="mt-2"><strong>${focusLabel}</strong>: ${focusTitle}</div>
              <p class="mt-2 mb-0">${description}</p>
            </div>
          </div>
        `;
      }).join('');

      const skillsList = skills.technical?.[lang] || skills.technical?.en || [];
      const trainingList = skills.training?.[lang] || skills.training?.en || [];

      const languagesHtml = languages.map(item => {
        const name = item.name?.[lang] || item.name?.en || '';
        const level = item.level?.[lang] || item.level?.en || '';
        return `<li class="list-group-item"><strong>${name}</strong> — ${level}</li>`;
      }).join('');

      contentEl.innerHTML = `
        <div class="tab-pane fade show active" id="education" role="tabpanel" aria-labelledby="education-tab">
          <div class="education-timeline">
            ${educationHtml}
          </div>
        </div>
        <div class="tab-pane fade" id="skills" role="tabpanel" aria-labelledby="skills-tab">
          <h5 class="mb-3">${l.technicalSkills}</h5>
          <ul class="list-group mb-4">
            ${skillsList.map(item => `<li class="list-group-item">${item}</li>`).join('')}
          </ul>
          <h5 class="mb-3">${l.training}</h5>
          <ul class="list-group">
            ${trainingList.map(item => `<li class="list-group-item">${item}</li>`).join('')}
          </ul>
                <h5 class="mt-4 mb-3">${l.tabs.languages}</h5>
          <ul class="list-group">
            ${languagesHtml}
          </ul>
        </div>
      `;
    } catch (error) {
      console.error('Error loading qualifications:', error);
      contentEl.innerHTML = '<p class="text-center text-muted">Failed to load qualifications.</p>';
    }
  }

  // Load projects from JSON file
  async loadProjects() {
    const projectsContainer = document.getElementById('projects-list');
    const projectsTitle = document.getElementById('projects-title');
    const filterContainer = document.getElementById('projects-filter');
    if (!projectsContainer) return;

    try {
      if (!this.projectsData) {
        const response = await fetch('assets/utils/projects.json');
        this.projectsData = await response.json();
      }

      const { projects, labels, filters } = this.projectsData;
      const lang = this.currentLang;
      const l = labels[lang];
      const filterList = filters || [];

      if (projectsTitle) {
        projectsTitle.textContent = l.sectionTitle;
      }

      const renderProjects = (filterId) => {
        const normalizedFilter = filterId || 'all';
        const filtered = normalizedFilter === 'all'
          ? projects
          : projects.filter(project => project.category === normalizedFilter);

        let html = '';
        filtered.forEach(project => {
        const title = project.title?.[lang] || project.title?.en || '';
        const description = project.description?.[lang] || project.description?.en || '';
        const role = project.role?.[lang] || project.role?.en || '';
        const highlights = project.highlights?.[lang] || project.highlights?.en || [];
        const techStack = project.techStack || [];

        const links = project.links || {};
        const linkButtons = [
          links.demo ? `<a class="btn btn-sm btn-primary" href="${links.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> ${l.demo}</a>` : '',
          links.repo ? `<a class="btn btn-sm btn-outline-dark" href="${links.repo}" target="_blank"><i class="fab fa-github"></i> ${l.repo}</a>` : '',
          links.paper ? `<a class="btn btn-sm btn-outline-secondary" href="${links.paper}" target="_blank"><i class="fas fa-file-alt"></i> ${l.paper}</a>` : ''
        ].filter(Boolean).join('');

        const highlightList = highlights.length
          ? `<div class="mt-2">
              <div class="fw-semibold mb-1">${l.highlights}</div>
              <ul class="project-highlight">
                ${highlights.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>`
          : '';

        html += `
          <div class="col-lg-6 col-12">
            <div class="card project-card">
              <div class="card-body">
                <h3 class="project-title">${title}</h3>

                <div class="project-meta">
                  ${role ? `<span class="meta-item"><i class="fas fa-user"></i> ${l.role}: ${role}</span>` : ''}
                  ${project.period ? `<span class="meta-item"><i class="fas fa-calendar-alt"></i> ${l.period}: ${project.period}</span>` : ''}
                </div>

                <p class="project-desc">${description}</p>

                ${techStack.length ? `
                  <div class="fw-semibold mb-2">${l.tech}</div>
                  <div class="project-tags">
                    ${techStack.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
                  </div>
                ` : ''}

                ${highlightList}

                ${linkButtons ? `<div class="project-links mt-3">${linkButtons}</div>` : ''}
              </div>
            </div>
          </div>
        `;
        });

        projectsContainer.innerHTML = html || '<div class="col-12"><p class="text-center text-muted">No projects found.</p></div>';
      };

      if (!this.currentProjectFilter) {
        this.currentProjectFilter = 'all';
      }

      if (filterContainer && filterList.length) {
        filterContainer.innerHTML = filterList.map(filter => {
          const label = filter.label?.[lang] || filter.label?.en || filter.id;
          const activeClass = filter.id === this.currentProjectFilter ? 'active' : '';
          return `<button type="button" class="btn btn-sm btn-outline-primary filter-btn ${activeClass}" data-filter="${filter.id}">${label}</button>`;
        }).join('');

        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this.currentProjectFilter = btn.dataset.filter;
            filterContainer.querySelectorAll('.filter-btn').forEach(b => {
              b.classList.toggle('active', b === btn);
            });
            renderProjects(this.currentProjectFilter);
          });
        });
      }

      renderProjects(this.currentProjectFilter);
    } catch (error) {
      console.error('Error loading projects:', error);
      projectsContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">Failed to load projects.</p></div>';
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
                <a class="nav-link" href="qualifications.html">${this.t('navbar.about')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="projects.html">${this.t('navbar.projects')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="publications.html">${this.t('navbar.publications')}</a>
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

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navContainer.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === currentPage);
    });
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

  // Load publications from JSON file
  async loadPublications() {
    const publicationsContainer = document.getElementById('publications-list');
    const publicationsTitle = document.getElementById('publications-title');
    if (!publicationsContainer) return;

    try {
      // Load publications data if not already loaded
      if (!this.publicationsData) {
        const response = await fetch('assets/utils/publications.json');
        this.publicationsData = await response.json();
      }

      const { publications, labels } = this.publicationsData;
      const lang = this.currentLang;
      const l = labels[lang];

      // Update section title
      if (publicationsTitle) {
        publicationsTitle.textContent = l.sectionTitle;
      }

      // Generate HTML for each publication
      let html = '';
      publications.forEach(pub => {
        const isJournal = pub.type === 'journal';
        const badge = isJournal 
          ? `<span class="impact-badge impact-${pub.sciQuartile.toLowerCase()}">${l['sci' + pub.sciQuartile.toUpperCase()]}</span>`
          : (pub.eiIndexed ? `<span class="ei-badge">${l.eiIndexed}</span>` : '');

        const formattedDate = this.formatDate(pub.date, lang);
        const abstract = pub.abstract[lang] || pub.abstract['en'];

        html += `
          <div class="publication-item">
            <div class="publication-header" onclick="togglePublication(this)">
              <h3 class="publication-title">
                <i class="fas fa-chevron-down expand-icon"></i>
                ${pub.title}
              </h3>
              <div class="publication-badges">
                ${badge}
              </div>
            </div>
            <div class="publication-body" style="display: none;">
              <div class="publication-meta">
                <div class="row">
                  <div class="col-md-3 col-sm-6 col-12">
                    <div class="meta-item">
                      <span class="meta-label">${l.type}</span>
                      <span class="meta-value">
                        <i class="fas ${isJournal ? 'fa-book' : 'fa-users'}"></i> 
                        ${isJournal ? l.journalArticle : l.conferencePaper}
                      </span>
                    </div>
                    <div class="meta-item mt-3">
                      <span class="meta-label">${l.doi}</span>
                      <span class="meta-value">
                        <a href="https://doi.org/${pub.doi}" target="_blank">${pub.doi}</a>
                      </span>
                    </div>
                  </div>
                  <div class="col-md-5 col-sm-6 col-12">
                    <div class="meta-item">
                      <span class="meta-label">${isJournal ? l.journal : l.conference}</span>
                      <span class="meta-value">${isJournal ? pub.journal : pub.conference}</span>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-6 col-6">
                    <div class="meta-item">
                      <span class="meta-label">${isJournal ? l.impactFactor : l.location}</span>
                      <span class="meta-value">${isJournal ? pub.impactFactor : `<i class="fas fa-map-marker-alt"></i> ${pub.location}`}</span>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-6 col-6">
                    <div class="meta-item">
                      <span class="meta-label">${l.publicationDate}</span>
                      <span class="meta-value"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="abstract-section">
                <span class="abstract-label">${l.abstract}</span>
                <p class="abstract-text">${abstract}</p>
              </div>
            </div>
          </div>
        `;
      });

      publicationsContainer.innerHTML = html;
    } catch (error) {
      console.error('Error loading publications:', error);
      publicationsContainer.innerHTML = '<p class="text-center text-muted">Failed to load publications.</p>';
    }
  }

  // Format date based on language
  formatDate(dateStr, lang) {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    
    if (lang === 'zh') {
      return `${year}年${month}月`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
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
