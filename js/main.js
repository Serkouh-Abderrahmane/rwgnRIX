/* ============================================
   THÉMATIK v2 — JS ENGINE
   Animations, Lightbox, Filters, Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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
    // Hide filter buttons for categories without images
    if (filterBar) {
      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        const slug = btn.dataset.filter;
        if (slug !== 'tout' && !COVERS[slug]) {
          btn.style.display = 'none';
        }
      });
    }

    renderMasonry();

    // Filters
    if (filterBar) {
      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.dataset.filter;
          visibleCount = perPage;
          updateCategoryHero(currentFilter);
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

  function updateCategoryHero(slug) {
    const hero = document.querySelector('.category-hero');
    if (!hero) return;

    if (slug === 'tout' || !COVERS[slug]) {
      hero.style.display = 'none';
      return;
    }

    const img = hero.querySelector('.category-hero-img');
    const title = hero.querySelector('.category-hero-title');
    const desc = hero.querySelector('.category-hero-desc');
    const ctx = catContext[slug] || {};

    img.src = path(COVERS[slug]);
    img.alt = catNames[slug] || slug;
    title.textContent = catNames[slug] || slug;
    desc.textContent = ctx.solution || '';
    hero.style.display = 'block';
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
    // Show one image per available category (up to 7)
    const catsWithImages = catList.filter(slug => COVERS[slug]);
    const preview = catsWithImages.slice(0, 7).map(slug => {
      const imgs = IMG.filter(i => i.cat === slug);
      return imgs.length ? imgs[0] : null;
    }).filter(Boolean);
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
    cards.forEach(card => {
      const cat = card.dataset.category;
      let file = null;
      if (cat && COVERS[cat]) {
        file = COVERS[cat];
      } else if (cat) {
        const imgs = IMG.filter(i => i.cat === cat);
        if (imgs.length) file = imgs[Math.floor(Math.random() * imgs.length)].file;
      }
      if (!file) {
        const fallback = IMG[Math.floor(Math.random() * IMG.length)];
        if (fallback) file = fallback.file;
      }
      if (file) {
        card.src = path(file);
        card.alt = 'Illustration ' + (catNames[cat || 'service'] || 'service') + ' — Thematik Communication';
      }
    });
  }
  assignServiceImages();

  // --- 11. CONTACT FORM (WhatsApp) ---
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const parts = [
        'Bonjour Thematik Communication,', '',
        'Nouvelle demande de devis :', '',
        `Nom : ${data.get('name')}`,
        `Email : ${data.get('email')}`,
        `Téléphone : ${data.get('phone')}`,
        `Service : ${data.get('service')}`, '',
        `Message : ${data.get('message')}`,
      ];
      const msg = parts.map(s => encodeURIComponent(s)).join('%0A');
      window.open(`https://wa.me/212661324180?text=${msg}`, '_blank');
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Redirection WhatsApp...';
      btn.style.background = '#25d366';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

});
