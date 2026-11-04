/**
 * Universal Image & GIF Lightbox Preview
 * Only preview project case study content images + the flipped Malu official photo on the landing page
 */
(function () {
  'use strict';

  function ensureLightbox() {
    let overlay = document.getElementById('globalImagePreviewOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'globalImagePreviewOverlay';
      overlay.className = 'img-preview-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Image preview');
      overlay.innerHTML = `
        <button type="button" class="img-preview-close" aria-label="Close preview">&times;</button>
        <div class="img-preview-dialog">
          <img class="img-preview-image" src="" alt="Preview">
          <p class="img-preview-caption"></p>
        </div>
      `;
      document.body.appendChild(overlay);

      const closeBtn = overlay.querySelector('.img-preview-close');
      const img = overlay.querySelector('.img-preview-image');

      function closeLightbox() {
        overlay.classList.remove('is-active');
        document.body.classList.remove('img-preview-locked');
        document.documentElement.classList.remove('img-preview-locked');
        setTimeout(() => {
          if (!overlay.classList.contains('is-active')) {
            img.src = '';
          }
        }, 250);
      }

      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.classList.contains('img-preview-dialog')) {
          closeLightbox();
        }
      });

      img.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
          closeLightbox();
        }
      });
    }
    return overlay;
  }

  function openLightbox(src, alt) {
    if (!src) return;
    const overlay = ensureLightbox();
    const img = overlay.querySelector('.img-preview-image');
    const caption = overlay.querySelector('.img-preview-caption');

    img.src = src;
    img.alt = alt || 'Preview';

    const cleanAlt = (alt || '').trim();
    if (cleanAlt && !cleanAlt.match(/^(image|img|preview|screenshot|mockup|icon|logo)$/i)) {
      caption.textContent = cleanAlt;
      caption.style.display = 'block';
    } else {
      caption.textContent = '';
      caption.style.display = 'none';
    }

    document.documentElement.classList.add('img-preview-locked');
    document.body.classList.add('img-preview-locked');
    overlay.classList.add('is-active');
  }

  function isProjectCaseStudyPage() {
    const loc = window.location.pathname.toLowerCase();
    return (
      loc.includes('/kmrl') ||
      loc.includes('/eravathody') ||
      loc.includes('/looplink') ||
      loc.includes('/reflexlabs') ||
      document.querySelector('.case-study-stage, .cs-container, .case-container, .cs-section, .case-section, #wireframes, #heuristic-evaluation') !== null
    );
  }

  function initPreview() {
    ensureLightbox();

    // 1. Landing page: ONLY the flipped Malu official picture next to Malavika Pillai
    const maluPic = document.querySelector('.malu-picture-img, .logo-face-back img');
    if (maluPic) {
      maluPic.classList.add('has-img-preview');
      maluPic.setAttribute('title', 'Click to preview');
      maluPic.addEventListener('click', function (e) {
        e.stopPropagation();
        const src = maluPic.getAttribute('data-full-src') || maluPic.currentSrc || maluPic.src;
        openLightbox(src, maluPic.getAttribute('alt') || 'Malavika Pillai');
      });
    }

    // 2. Project case study pages: ONLY project media (wireframes, diagrams, mockups, screens, gifs)
    if (isProjectCaseStudyPage()) {
      const candidateImages = document.querySelectorAll(
        '.wireframe-visual-box img, .wireframe-card img, .ia-diagram-full-frame img, .ia-diagram-wrap img, .flow-diagram-wrap img, .heuristic-diagram-frame img, .storyboard-card-wrap img, .empathy-card-wrap img, .persona-neat-wrap img, .media-frame img, .zigzag-media-box img, .interaction-gif-viewport img, .screen-slot img, .case-study-img, .showcase-img, .presentation-slide-img, img.ia-diagram-img, img.flow-diagram-img, img.heuristic-diagram-img, img.storyboard-strip-img, img.empathy-map-img, img.persona-neat-img'
      );

      candidateImages.forEach(function (img) {
        // Exclude navigation, brand marks, and sitemap logos
        if (
          img.classList.contains('sitemap-logo-img') ||
          img.classList.contains('sitemap-behance-img') ||
          img.classList.contains('sitemap-link-img') ||
          img.classList.contains('nav-logo') ||
          img.classList.contains('logo-mark') ||
          img.classList.contains('author-avatar-img') ||
          img.closest('.brand-block') ||
          img.closest('.nav-container') ||
          img.closest('.sitemap-col-author') ||
          img.closest('.sitemap-socials-row') ||
          img.closest('.sitemap-col-contact') ||
          img.closest('.header-left') ||
          img.closest('header') ||
          img.closest('footer')
        ) {
          return;
        }

        const parentLink = img.closest('a');
        if (parentLink) {
          const href = parentLink.getAttribute('href') || '';
          if (href && !href.startsWith('#') && !href.match(/\.(png|jpe?g|gif|webp)$/i)) {
            return;
          }
        }

        img.classList.add('has-img-preview');
        img.setAttribute('title', 'Click to preview');
        img.addEventListener('click', function (e) {
          if (parentLink) e.preventDefault();
          const highResSrc = img.getAttribute('data-full-src') || img.getAttribute('data-full') || img.currentSrc || img.src;
          openLightbox(highResSrc, img.getAttribute('alt') || '');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreview);
  } else {
    initPreview();
  }
})();
