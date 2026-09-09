document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');
  const heroVisual = document.querySelector('.hero-visual');
  let ticking = false;

  const updateScrollEffects = () => {
    const y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 18 ? '0 10px 35px rgba(0,0,0,.16)' : 'none';
    }
    if (hero && heroCopy && heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const progress = Math.min(y / Math.max(hero.offsetHeight, 1), 1);
      heroCopy.style.transform = `translate3d(0, ${progress * 18}px, 0)`;
      heroVisual.style.transform = `translate3d(0, ${progress * -10}px, 0)`;
      hero.style.setProperty('--scroll-progress', progress.toFixed(3));
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  updateScrollEffects();

  const sections = [...document.querySelectorAll('main section[id]')];
  const navItems = [...document.querySelectorAll('.nav-links a')];
  const updateNav = () => {
    const marker = window.scrollY + 140;
    let current = 'top';
    sections.forEach((section) => {
      if (marker >= section.offsetTop) current = section.id;
    });
    navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  const launchTarget = new Date('2026-12-18T00:00:00');
  const countdownIds = ['count-days', 'count-hours', 'count-minutes', 'count-seconds'];
  const countdownEls = countdownIds.map((id) => document.getElementById(id));
  const updateCountdown = () => {
    if (countdownEls.some((el) => !el)) return;
    let diff = launchTarget.getTime() - Date.now();
    if (diff <= 0) {
      countdownEls.forEach((el) => { el.textContent = '00'; });
      return;
    }
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);
    [days, hours, minutes, seconds].forEach((value, index) => {
      countdownEls[index].textContent = String(value).padStart(2, '0');
    });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
});