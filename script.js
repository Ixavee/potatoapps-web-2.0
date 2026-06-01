/* =============================================
   POTATO APPS — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR GLOW ──
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  // ── SMOOTH SCROLL for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── THEME TOGGLE ──
  const saved = localStorage.getItem('pa-theme');
  if (saved === 'light') document.body.classList.add('light');

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    // set correct icon on load
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
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ──
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── SCROLL REVEAL ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
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
    const duration = 1200;
    const start    = performance.now();
    const update   = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
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

