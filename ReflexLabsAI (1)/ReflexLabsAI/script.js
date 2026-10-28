/**
 * ReflexLabs AI - Case Study Website
 * Custom JavaScript logic matching Portfolio aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Top Reading Progress Bar ---
  const progressBar = document.getElementById('topProgressBar');
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // --- Single Crisp Square Orange Cursor matching Portfolio ---
  const cursorSquare = document.getElementById('cursor-square');
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    if (!hasMoved && cursorSquare) {
      hasMoved = true;
      cursorSquare.style.opacity = '1';
    }
    if (cursorSquare) {
      cursorSquare.style.left = `${e.clientX}px`;
      cursorSquare.style.top = `${e.clientY}px`;
    }
  });

  const interactiveElements = document.querySelectorAll('a, button, .block, .tag, .insight-card, .process-step, .comp-card, .persona-card, .hud-pill, .screen-slot');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  document.addEventListener('mouseleave', () => {
    if (cursorSquare) cursorSquare.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorSquare) cursorSquare.style.opacity = '1';
  });

});
