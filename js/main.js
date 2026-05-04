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
      // Remove on-dark once past the hero so nav is always legible
      if (hero) {
        const pastHero = window.scrollY > (hero.offsetHeight - 80);
        nav.classList.toggle('on-dark', !pastHero);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ── */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav-mobile__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Language Switcher ── */
  const LANG_KEY = 'sc-lang';

  function setLang(lang) {
    const valid = (lang === 'en') ? 'en' : 'ro';
    document.documentElement.lang = valid === 'en' ? 'en' : 'ro-RO';
    localStorage.setItem(LANG_KEY, valid);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === valid);
    });
    // Update <html> attr so CSS rules fire
    document.documentElement.setAttribute('lang', valid === 'en' ? 'en' : 'ro');
  }

  // Wire up all lang buttons (desktop + mobile, all pages)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // Apply saved preference immediately (before paint)
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

  /* ── Portfolio Filter ── */
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
          item.style.opacity = show ? '1' : '0.2';
          item.style.pointerEvents = show ? '' : 'none';
        });
      });
    });
  }

})();
