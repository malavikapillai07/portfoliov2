/**
 * Universal Image & GIF Lightbox Preview
 * Enables click-to-preview for mockups, screens, wireframes, and GIFs
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
    
    // Only display caption if it is meaningful text (not generic words or empty)
    const cleanAlt = (alt || '').trim();
    if (cleanAlt && !cleanAlt.match(/^(image|img|preview|screenshot|mockup|icon|logo)$/i)) {
      caption.textContent = cleanAlt;
      caption.style.display = 'block';
    } else {
      caption.textContent = '';
      caption.style.display = 'none';
    }

    document.body.classList.add('img-preview-locked');
    overlay.classList.add('is-active');
  }

  function initPreview() {
    ensureLightbox();

    // Select all project media (images and gifs)
    const images = document.querySelectorAll('img');
    images.forEach(function (img) {
      // Exclude logos, small icons, footer links, header brand
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
        img.closest('.author-logo-wrapper') ||
        img.closest('.author-photo-card')
      ) {
        return;
      }

      // If image is inside an external navigation link, don't hijack unless it's a direct image asset
      const parentLink = img.closest('a');
      if (parentLink) {
        const href = parentLink.getAttribute('href') || '';
        if (href && !href.startsWith('#') && !href.match(/\.(png|jpe?g|gif|webp)$/i)) {
          // If this is a project entry card link on the landing page, don't hijack navigation
          if (parentLink.classList.contains('project-entry-link') || parentLink.classList.contains('other-project-card')) {
            return;
          }
        }
      }

      img.classList.add('has-img-preview');
      img.setAttribute('title', 'Click to preview');

      img.addEventListener('click', function (e) {
        if (parentLink && (!parentLink.getAttribute('href') || parentLink.getAttribute('href').startsWith('#') || parentLink.getAttribute('href').match(/\.(png|jpe?g|gif|webp)$/i))) {
          e.preventDefault();
        }
        const highResSrc = img.getAttribute('data-full-src') || img.currentSrc || img.src;
        openLightbox(highResSrc, img.getAttribute('alt') || '');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreview);
  } else {
    initPreview();
  }
})();
