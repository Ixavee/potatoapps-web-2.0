/* =============================================
   POTATO APPS — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── LENIS SMOOTH SCROLL ──
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  let lenisRaf = null;

  if (window.Lenis && !reduceMotion.matches) {
    lenis = new Lenis({
      duration: 0.85,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    const raf = (time) => {
      lenis.raf(time);
      lenisRaf = requestAnimationFrame(raf);
    };
    lenisRaf = requestAnimationFrame(raf);

    const handleReducedMotionChange = (event) => {
      if (event.matches && lenis) {
        cancelAnimationFrame(lenisRaf);
        lenis.destroy();
        lenis = null;
      }
    };

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', handleReducedMotionChange);
    } else {
      reduceMotion.addListener(handleReducedMotionChange);
    }
  }

  // ── CURSOR GLOW ──
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reduceMotion.matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let glowX = 0;
    let glowY = 0;
    let glowQueued = false;

    document.addEventListener('pointermove', e => {
      glowX = e.clientX;
      glowY = e.clientY;

      if (!glowQueued) {
        glowQueued = true;
        requestAnimationFrame(() => {
          glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
          glowQueued = false;
        });
      }
    }, { passive: true });
  }

  // ── THEME TOGGLE ──
  const saved = localStorage.getItem('pa-theme');
  if (saved === 'light') document.body.classList.add('light');
  const themeIcons = {
    light: '<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 1 0 9 9 7 7 0 1 1-9-9Z"/></svg>',
    dark: '<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>',
  };
  const setThemeIcon = (button, isLight) => {
    button.innerHTML = isLight ? themeIcons.light : themeIcons.dark;
  };

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    setThemeIcon(btn, document.body.classList.contains('light'));
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      localStorage.setItem('pa-theme', isLight ? 'light' : 'dark');
      document.querySelectorAll('.theme-toggle').forEach(b => {
        setThemeIcon(b, isLight);
      });
    });
  });

  // ── NAV SCROLL ──
  const nav = document.querySelector('nav');
  let navScrolled = false;
  const updateNav = (scroll) => {
    const shouldBeScrolled = scroll > 40;
    if (shouldBeScrolled !== navScrolled) {
      nav.classList.toggle('scrolled', shouldBeScrolled);
      navScrolled = shouldBeScrolled;
    }
  };

  if (nav) {
    updateNav(window.scrollY);
    window.addEventListener('scroll', () => updateNav(window.scrollY), { passive: true });
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => updateNav(scroll));
    }
  }

  // ── MOBILE MENU ──
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      if (lenis) {
        if (mobileMenu.classList.contains('open')) lenis.stop();
        else lenis.start();
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        if (lenis) lenis.start();
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
  if (canHover && !reduceMotion.matches) {
    document.querySelectorAll('.card').forEach(card => {
      let tiltQueued = false;
      let pointerX = 0;
      let pointerY = 0;

      card.addEventListener('pointermove', e => {
        pointerX = e.clientX;
        pointerY = e.clientY;

        if (!tiltQueued) {
          tiltQueued = true;
          requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (pointerX - rect.left) / rect.width  - 0.5;
            const y = (pointerY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
            tiltQueued = false;
          });
        }
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

});
