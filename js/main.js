/* ============================================
   THÉMATIK v2 — JS ENGINE
   Animations, Lightbox, Filters, Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- IMAGE CATALOGUE (from /img) ---
  const IMG = [
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.34.jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.36 (1).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.36 (2).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.36.jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.46 (1).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.46 (2).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.46.jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.47 (1).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.47 (2).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.47 (3).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.12.47.jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (1).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (2).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (3).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (4).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (5).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48 (6).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.48.jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.49 (1).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.49 (2).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.49 (3).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.49 (4).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 02.12.49.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.36.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.37 (1).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.37 (2).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.37.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.47 (1).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.47.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.48 (1).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.48 (2).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.48.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.51 (1).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.51 (2).jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 02.31.51 (3).jpeg' },
    { cat: 'enseignes',           file: 'WhatsApp Image 2026-06-09 at 02.31.51.jpeg' },
    { cat: 'signaletique-interieure', file: 'WhatsApp Image 2026-06-09 at 02.31.52 (1).jpeg' },
    { cat: 'enseignes',           file: 'WhatsApp Image 2026-06-09 at 02.31.52 (2).jpeg' },
    { cat: 'totems',              file: 'WhatsApp Image 2026-06-09 at 02.31.52 (3).jpeg' },
    { cat: 'presentoirs',         file: 'WhatsApp Image 2026-06-09 at 02.31.52 (4).jpeg' },
    { cat: 'panneaux',            file: 'WhatsApp Image 2026-06-09 at 02.31.52 (5).jpeg' },
    { cat: 'panneaux',            file: 'WhatsApp Image 2026-06-09 at 02.31.52 (6).jpeg' },
    { cat: 'panneaux-sol-geants', file: 'WhatsApp Image 2026-06-09 at 02.31.52.jpeg' },
    { cat: 'panneaux-sol-geants', file: 'WhatsApp Image 2026-06-09 at 02.31.53 (2).jpeg' },
    { cat: 'panneaux-chantier',   file: 'WhatsApp Image 2026-06-09 at 02.31.53 (3).jpeg' },
    { cat: 'panneaux-toiture',    file: 'WhatsApp Image 2026-06-09 at 02.31.53 (4).jpeg' },
    { cat: 'panneaux-affichage',  file: 'WhatsApp Image 2026-06-09 at 02.31.53 (5).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 02.31.53.jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 03.19.17.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 03.33.33.jpeg' },
    { cat: 'impression-numerique',file: 'WhatsApp Image 2026-06-09 at 03.33.37 (1).jpeg' },
    { cat: 'enseignes',           file: 'WhatsApp Image 2026-06-09 at 03.33.40.jpeg' },
    { cat: 'signaletique-interieure', file: 'WhatsApp Image 2026-06-09 at 03.33.41 (1).jpeg' },
    { cat: 'identite-visuelle',   file: 'WhatsApp Image 2026-06-09 at 03.33.41.jpeg' },
    { cat: 'panneaux-affichage',  file: 'WhatsApp Image 2026-06-09 at 03.33.43.jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 15.59.59 (1).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 15.59.59 (2).jpeg' },
    { cat: 'habillage-vehicules', file: 'WhatsApp Image 2026-06-09 at 15.59.59 (3).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 16.00.00 (2).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 16.00.00 (3).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 16.00.00 (4).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 16.00.00 (6).jpeg' },
    { cat: 'habillage-magasins',  file: 'WhatsApp Image 2026-06-09 at 16.00.00.jpeg' },
  ];
  const VIDEOS = [
    { cat: 'hero', file: 'WhatsApp Video 2026-06-09 at 02.12.48.mp4' },
    { cat: 'hero', file: 'WhatsApp Video 2026-06-09 at 02.31.51.mp4' },
  ];

  const path = (f) => `img/${encodeURIComponent(f)}`;
  const catNames = {
    enseignes: 'Enseignes',
    bipole: 'Bipôle',
    panneaux: 'Panneaux',
    'panneaux-sol-geants': 'Panneaux sur sol géants',
    'panneaux-chantier': 'Panneaux de chantier',
    'panneaux-toiture': 'Panneaux sur toiture',
    'signaletique-interieure': 'Signalétique intérieure',
    presentoirs: 'Présentoirs',
    palissades: 'Palissades',
    'identite-visuelle': 'Identité visuelle des entreprises',
    'habillage-vehicules': 'Habillage de véhicules',
    'bureau-vente': 'Bureau de vente',
    'habillage-magasins': 'Habillage de magasins',
    'impression-numerique': 'Impression numérique',
    'panneaux-affichage': "Panneaux d'affichage",
    stands: 'Stands',
    totems: 'Totems',
  };
  const catContext = {
    enseignes: { problem: 'Façade qui manque d\'impact', solution: 'Enseigne lumineuse ou lettrage sur mesure', result: 'Visibilité 24h/24' },
    bipole: { problem: 'Besoin d\'affichage double face', solution: 'Bipôle publicitaire 360°', result: 'Visibilité dans l\'espace public' },
    panneaux: { problem: 'Messages noyés dans le paysage', solution: 'Panneau standard aux dimensions adaptées', result: 'Impact visuel renforcé' },
    'panneaux-sol-geants': { problem: 'Annonces de grande envergure invisibles', solution: 'Panneau au sol géant à l\'entrée', result: 'Captation immédiate du regard' },
    'panneaux-chantier': { problem: 'Palissade de chantier sans message', solution: 'Habiliage chantier réglementaire', result: 'Communication et protection' },
    'panneaux-toiture': { problem: 'Toiture inexploitée', solution: 'Panneau sur toiture visible des axes', result: 'Visibilité maximale' },
    'signaletique-interieure': { problem: 'Visiteurs perdus dans vos locaux', solution: 'Signalétique intérieure claire', result: 'Guidage fluide et esthétique' },
    presentoirs: { problem: 'Produits sans mise en valeur', solution: 'Présentoir sur mesure', result: 'Mise en avant des articles' },
    palissades: { problem: 'Palissade nue, image négative', solution: 'Habiliage de palissade esthétique', result: 'Valorisation du chantier' },
    'identite-visuelle': { problem: 'Marque sans cohérence graphique', solution: 'Identité visuelle complète', result: 'Image professionnelle unifiée' },
    'habillage-vehicules': { problem: 'Véhicules qui passent inaperçus', solution: 'Habiliage publicitaire sur mesure', result: 'Marque mobile 24h/24' },
    'bureau-vente': { problem: 'Bureau de vente difficile à repérer', solution: 'Signalétique et habillage dédiés', result: 'Repérage immédiat' },
    'habillage-magasins': { problem: 'Vitrine qui n\'attire pas le regard', solution: 'Habiliage vitrine et façade', result: 'Attraction client renforcée' },
    'impression-numerique': { problem: 'Supports sans rendu professionnel', solution: 'Impression grand format HD', result: 'Rendu éclatant' },
    'panneaux-affichage': { problem: 'Affichage extérieur sans impact', solution: 'Panneau d\'affichage couleurs vives', result: 'Impact maximal sur les passants' },
    stands: { problem: 'Stand qui ne se démarque pas', solution: 'Stand sur mesure image de marque', result: 'Différenciation en salon' },
    totems: { problem: 'Entrée sans signal fort', solution: 'Totem vertical haute visibilité', result: 'Identification à distance' },
  };
  const catList = Object.keys(catNames);

  // --- 1. MOBILE MENU ---
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }

  // --- 2. HEADER SCROLL ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 60);
  }, { passive: true });

  // --- 2b. HERO ENTRANCE ANIMATIONS ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const els = heroContent.querySelectorAll('.hero-brand, .hero-title, .hero-text, .btn-group');
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
      el.style.transitionDelay = `${0.2 + i * 0.15}s`;
    });
    requestAnimationFrame(() => {
      els.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) {
      scrollInd.style.opacity = '0';
      scrollInd.style.animation = 'none';
      requestAnimationFrame(() => {
        scrollInd.style.transition = 'opacity 1s 1.2s';
        scrollInd.style.opacity = '1';
      });
    }
  }

  // --- 3. HERO SLIDER ---
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    let current = 0;
    const interval = setInterval(() => {
      slides.forEach(s => s.classList.remove('active'));
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // --- 4. SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const revealTypes = [
    { selector: '.reveal', cls: 'visible', threshold: 0.12 },
    { selector: '.reveal-left', cls: 'visible', threshold: 0.12 },
    { selector: '.reveal-right', cls: 'visible', threshold: 0.12 },
    { selector: '.reveal-scale', cls: 'visible', threshold: 0.12 },
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // --- 5. PARALLAX ON SCROLL ---
  const parallaxElements = document.querySelectorAll('.parallax-element');
  if (parallaxElements.length) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.speed || 0.3);
        const y = rect.top * speed;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    });
  }

  // --- 6. COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersDone = false;
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          const numEl = counter.querySelector('.num');
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            if (numEl) numEl.textContent = Math.round(current);
          }, duration / steps);
        });
        counterObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (statNumbers.length) {
    const grid = statNumbers[0].closest('.stats-grid');
    if (grid) counterObs.observe(grid);
  }

  // --- 7. PORTFOLIO BUILD ---
  const masonry = document.querySelector('.masonry');
  const filterBar = document.querySelector('.filter-bar');
  const loadMore = document.getElementById('load-more');
  const lightbox = document.getElementById('lightbox');

  let currentFilter = 'tout';
  let visibleCount = 12;
  const perPage = 12;
  let filteredItems = [];
  let lightboxItems = [];
  let lightboxIdx = 0;

  if (masonry) {
    renderMasonry();

    // Filters
    if (filterBar) {
      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.dataset.filter;
          visibleCount = perPage;
          renderMasonry();
          masonry.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    if (loadMore) {
      loadMore.addEventListener('click', () => {
        visibleCount += perPage;
        renderMasonry();
      });
    }
  }

  function renderMasonry() {
    filteredItems = currentFilter === 'tout'
      ? IMG
      : IMG.filter(item => item.cat === currentFilter);

    const items = filteredItems.slice(0, visibleCount);
    masonry.innerHTML = '';

    items.forEach((item, idx) => {
      const a = document.createElement('div');
      a.className = 'masonry-item';
      // Random tall/wide for visual interest
      const r = Math.random();
      if (r > 0.85) a.classList.add('tall');
      else if (r > 0.7) a.classList.add('wide');

      const ctx = catContext[item.cat] || { problem: 'Projet', solution: 'Réalisation', result: '' };
      a.innerHTML = `
        <img src="${path(item.file)}"         alt="Réalisation ${catNames[item.cat] || 'signalétique'} — Thematik Communication" loading="lazy">
        <div class="overlay">
          <span>${catNames[item.cat] || 'Projet'}</span>
          <h4>${ctx.problem}</h4>
          <small style="display: block; color: var(--accent); font-size: 0.8rem; margin-top: 2px;">${ctx.solution} &rarr;</small>
        </div>
      `;
      a.addEventListener('click', () => openLightbox(idx));
      masonry.appendChild(a);
    });

    if (loadMore) {
      loadMore.style.display = visibleCount >= filteredItems.length ? 'none' : 'inline-flex';
    }
  }

  // --- 8. LIGHTBOX ---
  function openLightbox(index) {
    lightboxItems = filteredItems;
    lightboxIdx = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const img = lightbox.querySelector('img');
    const counter = lightbox.querySelector('.lightbox-counter');
    const item = lightboxItems[lightboxIdx];
    if (item) {
      img.src = path(item.file);
      img.alt = 'Réalisation ' + (catNames[item.cat] || 'signalétique') + ' — Thematik Communication';
      counter.textContent = `${lightboxIdx + 1} / ${lightboxItems.length}`;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    lightboxIdx += dir;
    if (lightboxIdx < 0) lightboxIdx = lightboxItems.length - 1;
    if (lightboxIdx >= lightboxItems.length) lightboxIdx = 0;
    updateLightbox();
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.prev').addEventListener('click', () => navLightbox(-1));
    lightbox.querySelector('.next').addEventListener('click', () => navLightbox(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    // Swipe
    let sx = 0;
    lightbox.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = sx - e.changedTouches[0].screenX;
      if (Math.abs(dx) > 50) navLightbox(dx > 0 ? 1 : -1);
    }, { passive: true });
  }

  // --- 9. HOME PORTFOLIO PREVIEW ---
  const homeGrid = document.querySelector('.home-portfolio-grid');
  if (homeGrid) {
    homeGrid.innerHTML = '';
    const preview = IMG.slice(0, 7);
    preview.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'home-portfolio-item';
      if (i === 0) div.classList.add('featured');
      div.innerHTML = `
        <img src="${path(item.file)}"         alt="Projet ${catNames[item.cat] || 'signalétique'} — Thematik Communication" loading="${i < 4 ? 'eager' : 'lazy'}">
        <div class="portfolio-overlay">
          <span>${catNames[item.cat]}</span>
        </div>
      `;
      homeGrid.appendChild(div);
    });
  }

  // --- 10. SERVICE IMAGES (home grid + services page) ---
  function assignServiceImages() {
    const cards = document.querySelectorAll('.service-card-img');
    const shuffled = [...IMG].sort(() => Math.random() - 0.5);
    cards.forEach((card, i) => {
      if (i < shuffled.length) {
        card.src = path(shuffled[i].file);
        card.alt = 'Illustration ' + (catNames[shuffled[i].cat] || 'service') + ' — Thematik Communication';
      }
    });
  }
  assignServiceImages();

  // --- 11. CONTACT FORM ---
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message envoyé';
      btn.style.background = '#25d366';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

});
