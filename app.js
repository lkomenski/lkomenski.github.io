// ─── COPYRIGHT YEAR ───────────────────────────────────────────────────────────
document.querySelectorAll('.copyright-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ─── ACTIVE NAV STATE ─────────────────────────────────────────────────────────
// Highlights the correct nav link based on the current page filename.
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === page) {
      link.style.color = 'var(--dark)';
      link.setAttribute('aria-current', 'page');
    }
  });
})();

// ─── MOBILE NAV TOGGLE ────────────────────────────────────────────────────────
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  // Inject mobile nav styles dynamically so they only apply when JS is active
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .nav-links.open {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 58px;
        left: 0;
        right: 0;
        background-color: var(--warm-white);
        border-bottom: 1px solid var(--rule);
        padding: 20px 24px 28px;
        gap: 20px;
        z-index: 99;
      }
      .nav-links.open a {
        font-size: 14px;
        letter-spacing: 0.06em;
      }
    }
  `;
  document.head.appendChild(style);

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = '☰';
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = '☰';
    }
  });
})();

// ─── SMOOTH SCROLL ────────────────────────────────────────────────────────────
// Handles anchor links on the same page (e.g. #writing on index).
// CSS scroll-behavior handles most cases; this adds offset for the sticky nav.
(function initSmoothScroll() {
  const NAV_HEIGHT = 58;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── WRITING LIST — SUBTLE HOVER ENHANCEMENT ──────────────────────────────────
// Dims sibling items slightly when hovering a writing index row,
// making the hovered item feel selected without any heavy visual change.
(function initWritingListHover() {
  const list = document.querySelector('.writing-index-list');
  if (!list) return;

  const items = list.querySelectorAll('.writing-index-item');

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(other => {
        if (other !== item) other.style.opacity = '0.45';
      });
    });
    item.addEventListener('mouseleave', () => {
      items.forEach(other => { other.style.opacity = ''; });
    });
  });
})();

// ─── POST TABLE OF CONTENTS ───────────────────────────────────────────────────
(function initTOC() {
  const sidebar = document.querySelector('.post-sidebar');
  if (!sidebar) return;

  const headings = document.querySelectorAll('.post-body-inner h2');
  if (headings.length < 2) return;

  const NAV_OFFSET = 74;

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'section-' + (i + 1);
  });

  const list = document.createElement('ul');
  list.className = 'post-toc-list';

  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', e => {
      e.preventDefault();
      const top = h.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
    li.appendChild(a);
    list.appendChild(li);
  });

  const toc = document.createElement('nav');
  toc.className = 'post-toc';
  toc.setAttribute('aria-label', 'Table of contents');

  const label = document.createElement('span');
  label.className = 'post-toc-label';
  label.textContent = 'On this page';

  toc.appendChild(label);
  toc.appendChild(list);
  sidebar.appendChild(toc);

  // Reveal the sidebar once the first heading enters the viewport
  const revealObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      sidebar.classList.add('toc-visible');
      revealObserver.disconnect();
    }
  }, { rootMargin: '0px 0px -30% 0px' });
  revealObserver.observe(headings[0]);

  const links = list.querySelectorAll('a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('toc-active'));
        const active = list.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('toc-active');
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  headings.forEach(h => observer.observe(h));
})();