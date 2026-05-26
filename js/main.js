/**
 * 行政書士事務所カルペ・ディエム — main.js
 * ハンバーガーメニュー + スクロールアニメーション + ページトップボタン
 */

'use strict';

/* ============================================================
   1. ハンバーガーメニュー
   ============================================================ */
(function () {
  const hamburger = document.getElementById('js-hamburger');
  const mobileNav = document.getElementById('js-mobile-nav');

  if (!hamburger || !mobileNav) return;

  /**
   * メニューを開閉する
   * @param {boolean} [force] - true=開く / false=閉じる / 省略=トグル
   */
  function toggleMenu(force) {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    const next   = typeof force === 'boolean' ? force : !isOpen;

    hamburger.setAttribute('aria-expanded', String(next));
    mobileNav.classList.toggle('is-open', next);
    mobileNav.setAttribute('aria-hidden', String(!next));

    // body スクロールロック
    document.body.style.overflow = next ? 'hidden' : '';
  }

  // ハンバーガーボタン クリック
  hamburger.addEventListener('click', () => toggleMenu());

  // メニュー内リンク クリック → 閉じる
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ウィンドウ幅が広がったとき（PCに戻った時）→ 閉じる
  const mediaQuery = window.matchMedia('(min-width: 769px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) toggleMenu(false);
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // オーバーレイ外クリックで閉じる（オーバーレイは実装しない代わりにヘッダー外クリック）
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.site-header');
    if (
      hamburger.getAttribute('aria-expanded') === 'true' &&
      header &&
      !header.contains(e.target) &&
      !mobileNav.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
})();


/* ============================================================
   2. スクロール時フェードイン（Intersection Observer）
   ============================================================ */
(function () {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // stagger delay はデータ属性で設定可能
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ============================================================
   3. スクロール量に応じたヘッダースタイル変更
   ============================================================ */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const THRESHOLD = 80;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期チェック
})();


/* ============================================================
   4. ページトップボタン
   ============================================================ */
(function () {
  const btn = document.getElementById('js-back-to-top');
  if (!btn) return;

  const SHOW_THRESHOLD = 400;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('is-visible', window.scrollY > SHOW_THRESHOLD);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   5. スムーズスクロール（href="#..." のリンク全般）
   ============================================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
