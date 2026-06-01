/* =============================================
   POTATO APPS — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── LENIS SMOOTH SCROLL ──
  // Same library used by Framer sites
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ── CURSOR GLOW ──
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  // ── THEME TOGGLE ──
  const saved = localStorage.getItem('pa-theme');
  if (saved === 'light') document.body.classList.add('light');

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      localStorage.setItem('pa-theme', isLight ? 'light' : 'dark');
      document.querySelectorAll('.theme-toggle').forEach(b => {
        b.textContent = isLight ? '🌙' : '☀️';
      });
    });
  });

  // ── NAV SCROLL ──
  const nav = document.querySelector('nav');
  lenis.on('scroll', ({ scroll }) => {
    nav.classList.toggle('scrolled', scroll > 40);
  });

  // ── MOBILE MENU ──
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      if (mobileMenu.classList.contains('open')) lenis.stop();
      else lenis.start();
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        lenis.start();
      });
    });
  }

  // ── SCROLL REVEAL ──
  // Staggered, silky smooth reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── STAT COUNTER ANIMATION ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();
    const update   = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4);
      el.textContent = prefix + Math.floor(target * ease) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(update);
  }

  // ── SUPPORT FORM → MAILTO ──
  const formSubmit = document.querySelector('.form-submit');
  if (formSubmit) {
    formSubmit.addEventListener('click', () => {
      const name    = document.getElementById('f-name')?.value    || '';
      const email   = document.getElementById('f-email')?.value   || '';
      const app     = document.getElementById('f-app')?.value     || '';
      const message = document.getElementById('f-message')?.value || '';
      const subject = encodeURIComponent(`[${app || 'Potato Apps'}] Support Request`);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nApp: ${app}\n\n${message}`);
      window.location.href = `mailto:connect.k4vxd@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ── CARD TILT ──
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});

