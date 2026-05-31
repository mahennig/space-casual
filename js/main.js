/* main.js — Space Casuals */
(function () {
  'use strict';

  /* ── Sticky Nav ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const hero = document.querySelector('.hero');
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      nav.classList.toggle('scrolled', scrolled);
      if (hero) {
        const pastHero = window.scrollY > (hero.offsetHeight - 80);
        nav.classList.toggle('on-dark', !pastHero);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu (with accessibility) ── */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (burger && mobileMenu) {
    mobileMenu.setAttribute('aria-modal', 'true');
    mobileMenu.setAttribute('aria-label', 'Mobile navigation');

    function openMobileMenu() {
      burger.classList.add('open');
      mobileMenu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstLink = mobileMenu.querySelector('.nav-mobile__link');
      if (firstLink) firstLink.focus();
    }

    function closeMobileMenu() {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.contains('open');
      if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    mobileMenu.querySelectorAll('.nav-mobile__link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ── Language Switcher ── */
  const LANG_KEY = 'sc-lang';

  function setLang(lang) {
    const valid = (lang === 'en') ? 'en' : 'ro';
    document.documentElement.lang = valid === 'en' ? 'en' : 'ro';
    localStorage.setItem(LANG_KEY, valid);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === valid);
    });
    document.documentElement.setAttribute('lang', valid === 'en' ? 'en' : 'ro');
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  setLang(localStorage.getItem(LANG_KEY) || 'ro');

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ── Portfolio Filter (hide items, reflow grid) ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        filterItems.forEach(item => {
          const show = cat === 'all' || item.dataset.cat.includes(cat);
          if (show) {
            item.classList.remove('filter-hidden');
            item.style.opacity = '1';
            item.style.pointerEvents = '';
          } else {
            item.classList.add('filter-hidden');
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
          }
        });
      });
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Contact Form Handler ── */
  const contactForm = document.querySelector('.form[data-action]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const statusEl = contactForm.querySelector('.form__status');
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.dataset.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (statusEl) statusEl.className = 'form__status';
        if (response.ok) {
          if (statusEl) {
            statusEl.className = 'form__status form__status--success';
            const lang = document.documentElement.getAttribute('lang');
            statusEl.textContent = lang === 'en'
              ? 'Thank you! Your message has been sent. We will get back to you shortly.'
              : 'Multumim! Mesajul tau a fost trimis. Te vom contacta in curand.';
          }
          contactForm.reset();
        } else {
          if (statusEl) {
            statusEl.className = 'form__status form__status--error';
            const lang = document.documentElement.getAttribute('lang');
            statusEl.textContent = lang === 'en'
              ? 'Something went wrong. Please try again or email us directly.'
              : 'A aparut o eroare. Te rugam sa incerci din nou sau sa ne scrii direct pe email.';
          }
        }
      } catch (err) {
        if (statusEl) {
          statusEl.className = 'form__status form__status--error';
          statusEl.textContent = 'Network error. Please try again.';
        }
      }
      submitBtn.disabled = false;
    });
  }

})();
