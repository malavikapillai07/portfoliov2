/**
 * Portfolio Logic — Malavika Pillai
 * 1. Single crisp square orange cursor
 * 2. Multilingual typewriter greeting (Malayalam, English, Hindi, Kannada, etc.)
 * 3. Live Kochi time clock (HH:mm)
 * 4. Navigation hover reveal for Projects / About / Resume (no outer rectangle)
 * 5. Role "in making" hover pill
 * 6. Ambient sound engine
 * 7. Case study modal viewer
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. Site Launch Preloader Overlay (2x speed, muted, cropped, pure white bg)
  // =========================================================================
  const sitePreloader = document.getElementById('sitePreloader');
  const preloaderVideo = document.getElementById('preloaderVideo');
  const preloaderSkipBtn = document.getElementById('preloaderSkipBtn');

  if (sessionStorage.getItem('sitePreloaderShown') === 'true') {
    if (sitePreloader) sitePreloader.style.display = 'none';
  } else if (sitePreloader && preloaderVideo) {
    preloaderVideo.playbackRate = 2.0;
    preloaderVideo.muted = true;

    let hasPreloaderClosed = false;
    const closePreloader = () => {
      if (hasPreloaderClosed) return;
      hasPreloaderClosed = true;
      sessionStorage.setItem('sitePreloaderShown', 'true');
      sitePreloader.classList.add('fade-out');
      setTimeout(() => {
        sitePreloader.style.display = 'none';
      }, 450);
    };

    preloaderVideo.addEventListener('ended', closePreloader);
    if (preloaderSkipBtn) {
      preloaderSkipBtn.addEventListener('click', closePreloader);
    }

    // Fallback safety timeout (at 2x speed, 10s video finishes in ~5s)
    setTimeout(closePreloader, 5600);

    const playPromise = preloaderVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Preloader play notification:', err);
        closePreloader();
      });
    }
  }

  // =========================================================================
  // 1. Single Square Orange Cursor
  // =========================================================================
  const cursorSquare = document.getElementById('cursor-square');
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    if (!hasMoved) {
      hasMoved = true;
      cursorSquare.style.opacity = '1';
    }
    cursorSquare.style.left = `${e.clientX}px`;
    cursorSquare.style.top = `${e.clientY}px`;
  });

  function attachHoverEffects() {
    const interactiveElements = document.querySelectorAll('a, button, [data-modal], .role-interactive-wrapper, .nav-pill-main, .nav-pill-item, .brand-logo-wrap');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }
  attachHoverEffects();

  // Logo 3D flip when hovering over Malavika Pillai or logo lockup
  const logoFlipContainer = document.getElementById('logoFlipContainer');
  const authorTitle = document.getElementById('authorTitle');
  const brandLogoWrap = document.getElementById('brandLogoWrap');
  const nameBlock = document.getElementById('nameBlock');

  if (logoFlipContainer) {
    const flipTargets = [authorTitle, brandLogoWrap, nameBlock].filter(Boolean);
    flipTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        logoFlipContainer.classList.add('is-flipped');
      });
      target.addEventListener('mouseleave', () => {
        logoFlipContainer.classList.remove('is-flipped');
      });
    });
  }

  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  document.addEventListener('mouseleave', () => {
    cursorSquare.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorSquare.style.opacity = '1';
  });


  // =========================================================================
  // 2. Multilingual Typewriter Greeting (with Malayalam & Indic support)
  // =========================================================================
  const typewriterEl = document.getElementById('greetingsTypewriter');

  if (typewriterEl) {
    const greetings = [
      'നമസ്കാരം',     // Malayalam (Namaskaram)
      'ഹലോ',           // Malayalam (Hello)
      'Hello',          // English
      'नमस्ते',         // Hindi
      'ನಮಸ್ಕಾರ',       // Kannada
      'வணக்கம்',        // Tamil
      'Bonjour',        // French
      'Hola',           // Spanish
      'こんにちは',     // Japanese
      'Ciao'            // Italian
    ];

    let currentGreetingIdx = 0;
    let isDeleting = false;
    let charIdx = 0;
    let currentChars = [];

    function getGraphemes(text) {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), s => s.segment);
      }
      return Array.from(text);
    }

    currentChars = getGraphemes(greetings[currentGreetingIdx]);

    function typeLoop() {
      const fullGraphemes = currentChars;
      
      if (isDeleting) {
        charIdx--;
        typewriterEl.textContent = fullGraphemes.slice(0, charIdx).join('');
      } else {
        charIdx++;
        typewriterEl.textContent = fullGraphemes.slice(0, charIdx).join('');
      }

      let typeSpeed = isDeleting ? 45 : 95;

      if (!isDeleting && charIdx === fullGraphemes.length) {
        typeSpeed = 2200; // Hold completed word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentGreetingIdx = (currentGreetingIdx + 1) % greetings.length;
        currentChars = getGraphemes(greetings[currentGreetingIdx]);
        typeSpeed = 400; // Short pause before next greeting
      }

      setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 600);
  }


  // =========================================================================
  // 3. Role "in making" Hover Pill
  // =========================================================================
  const roleWrapper = document.getElementById('roleWrapper');
  if (roleWrapper) {
    roleWrapper.addEventListener('mouseenter', () => {
      roleWrapper.classList.add('is-hovered');
    });
    roleWrapper.addEventListener('mouseleave', () => {
      roleWrapper.classList.remove('is-hovered');
    });
  }


  // =========================================================================
  // 4. Live Kochi Time Clock
  // =========================================================================
  const kochiTimeEl = document.getElementById('kochiTime');

  function updateKochiClock() {
    if (!kochiTimeEl) return;
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      kochiTimeEl.textContent = formatter.format(new Date());
    } catch {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      kochiTimeEl.textContent = `${hrs}:${mins}`;
    }
  }

  updateKochiClock();
  setInterval(updateKochiClock, 1000);


  // =========================================================================
  // 5. Navigation Pill Hover Expand (No enclosing outline box)
  // =========================================================================
  const navPillTrack = document.getElementById('navPillTrack');
  const btnResume = document.getElementById('btnResume');

  if (navPillTrack) {
    navPillTrack.addEventListener('mouseenter', () => {
      navPillTrack.classList.add('is-expanded');
    });
    navPillTrack.addEventListener('mouseleave', () => {
      navPillTrack.classList.remove('is-expanded');
    });
  }

  const btnProjects = document.getElementById('btnProjects');
  const mainFlow = document.getElementById('mainFlow');

  if (btnProjects && mainFlow) {
    btnProjects.addEventListener('click', (e) => {
      e.preventDefault();
      const rect = mainFlow.getBoundingClientRect();
      const targetY = window.pageYOffset + rect.top - 36;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    });
  }

  if (btnResume) {
    btnResume.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Malavika Pillai — Resume (Product Designer in the making)\nExperience, Projects & Case Studies.');
    });
  }


  // =========================================================================
  // 6. Subtle Web Audio Atmospheric Sound Toggle
  // =========================================================================
  const soundToggle = document.getElementById('soundToggle');
  const soundMutedIcon = document.querySelector('.sound-muted');
  const soundPlayingIcon = document.querySelector('.sound-playing');

  let audioCtx = null;
  let masterGain = null;
  let isPlayingAudio = false;

  function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const baseFreqs = [196.0, 293.66, 392.0, 587.33];
    baseFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 2 : -2), audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.035 / (idx + 1), audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
    });
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!audioCtx) initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      isPlayingAudio = !isPlayingAudio;
      if (isPlayingAudio) {
        soundMutedIcon.classList.add('hidden');
        soundPlayingIcon.classList.remove('hidden');
        masterGain.gain.setTargetAtTime(0.06, audioCtx.currentTime, 0.4);
      } else {
        soundMutedIcon.classList.remove('hidden');
        soundPlayingIcon.classList.add('hidden');
        masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
      }
    });
  }


  // =========================================================================
  // 7. Case Study Modal Details
  // =========================================================================
  const projectData = {
    'hero-project': {
      title: 'Grøn & Flöw — Smart Living & Conscious Commerce',
      image: 'assets/hero_app.jpg',
      paragraphs: [
        'A mobile-first ecosystem created to deliver pantry essentials and eco-conscious cleaning supplies in under 30 minutes without cognitive sensory overload.',
        'We designed a calm, cream-and-sage interface grounded in fluid bottom-sheet navigation, zero-friction item selection, and transparent carbon offset indicators.',
        'Result: Increased checkout conversion rate by 24% while cutting selection time in half.'
      ]
    },
    'grocery-photo': {
      title: 'Redefining Grocery Photography',
      image: 'assets/grocery_photo.jpg',
      paragraphs: [
        'Reimagining catalogue photography as an essential standard for trust in instant groceries and consumer-packaged goods.',
        'Traditional stock photos erode user trust when the physical product arrives looking different. We engineered an authentic visual taxonomy: natural tactile textures, transparent ingredient labeling, and pastel swatch system that matches actual produce freshness.',
        'Across 1,200+ SKU shoots, product return disputes dropped by 38%, establishing a recognizable benchmark for digital merchandising.'
      ]
    },
    'flaneur-redesign': {
      title: 'Flâneur Website Redesign',
      image: 'assets/chocolate_laptop.jpg',
      paragraphs: [
        'Designing a digital flagship for Flâneur, an artisanal chocolate atelier, crafted in a 12-hour high-intensity design sprint under evolving constraints.',
        'The aesthetic translates sensory chocolate notes into molten dark stone tones, warm amber backlight, and responsive editorial typography.',
        'Features interactive cocoa-percentage tasting profiles, bespoke gift curation builders, and seamless micro-animations.'
      ]
    }
  };

  const modal = document.getElementById('caseStudyModal');
  const modalContent = document.getElementById('modalContentTarget');
  const closeBtn = document.getElementById('modalCloseBtn');

  function openCaseStudy(id) {
    const item = projectData[id];
    if (!item || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="modal-lead-img">
      <h2 class="modal-title-text">${item.title}</h2>
      ${item.paragraphs.map(p => `<p class="modal-para">${p}</p>`).join('')}
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      openCaseStudy(el.getAttribute('data-modal'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });


  // =========================================================================
  // 8. Email Copy-to-Clipboard with "Link copied ✓" feedback
  // =========================================================================
  const emailBtns = document.querySelectorAll('.sitemap-email-btn, #sitemapEmailBtn');
  emailBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'malavikapillaiofficial@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.classList.remove('is-copied');
        }, 2200);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });


  // =========================================================================
  // 9. About Page Figma Picture Frame Slider (4 images, click & touch)
  // =========================================================================
  const slidesTrack = document.getElementById('slidesTrack');
  const sliderDots = document.querySelectorAll('#sliderDots .slider-dot');
  const sliderViewport = document.getElementById('sliderViewport');

  if (slidesTrack && sliderDots.length > 0) {
    let currentSlide = 0;
    const totalSlides = sliderDots.length;

    function goToSlide(idx) {
      currentSlide = (idx + totalSlides) % totalSlides;
      slidesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      sliderDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    sliderDots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
    });

    if (sliderViewport) {
      sliderViewport.addEventListener('click', (e) => {
        if (!e.target.closest('.slider-dot')) {
          goToSlide(currentSlide + 1);
        }
      });

      // Touch swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;
      sliderViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      sliderViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 40) {
          goToSlide(currentSlide + 1);
        } else if (touchEndX - touchStartX > 40) {
          goToSlide(currentSlide - 1);
        }
      }, { passive: true });

      // Auto advance every 4.5 seconds if user is not hovering
      let autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 4500);

      sliderViewport.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
      sliderViewport.addEventListener('mouseleave', () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 4500);
      });
    }
  }

});

