/* LAAS help centre: the main site's bar, menu and footer behaviour.
   - the Menu button opens and closes #menu (Escape and a tap on a link close it too)
   - the EN / DA switch remembers the choice, as on the main site (DA goes to /da/: there is no Danish help centre)
   - the bag, the floating glass bar and the footer's entrance come from the main site's /cart-nav.js, loaded just
     before this file; only if it is missing does this file float the bar and raise the footer itself */
(() => {
  'use strict';
  const root = document.documentElement;
  // the main site's script owns the bar and the footer; its own Menu handler stands back when this is set
  window.LAAS_UI = true;
  const main = !!window.LAAS_SITE;

  // the language switch: remember the choice, so the Danish pages do not send you back to English
  document.querySelectorAll('.lang a[data-lang]').forEach(a => a.addEventListener('click', e => {
    try { localStorage.setItem('laas-lang', a.dataset.lang); } catch (_) {}
    if (a.getAttribute('aria-current') === 'true') e.preventDefault();
  }));

  // the menu
  const btn = document.getElementById('menu-open'), menu = document.getElementById('menu');
  if (btn && menu) {
    const set = open => {
      menu.hidden = !open;
      if (open) void menu.offsetWidth; // let the clip-path open from closed
      menu.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      root.classList.toggle('menu-open', open);
    };
    btn.addEventListener('click', () => set(menu.hidden));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('resize', () => { if (!menu.hidden && innerWidth > 760) set(false); });
  }

  if (main) return;

  // the footer's entrance
  const f = document.querySelector('.foot2');
  if (f && 'IntersectionObserver' in window) {
    f.classList.add('is-ready');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { f.classList.add('is-in'); io.disconnect(); } }, { rootMargin: '0px 0px -60px 0px' });
    io.observe(f);
  }

  // the bar: clear while nothing sits under it, the glass capsule as soon as content scrolls beneath
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const shell = nav.querySelector('.nav__shell') || nav;
  const clear = c => !c || c === 'transparent' || /rgba\(0, 0, 0, 0\)|\/ 0\)$/.test(c);
  const isContent = el => {
    if (!el || nav.contains(el) || (menu && menu.contains(el))) return false;
    if (/^(IMG|PICTURE|VIDEO|CANVAS|SVG|BUTTON|INPUT|SELECT|TEXTAREA|A|LABEL|SUMMARY)$/i.test(el.tagName) || el.closest('svg')) return true;
    const b = el.getBoundingClientRect();
    if (b.width >= innerWidth * 0.9 && b.height >= innerHeight * 0.9) return false;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    const cs = getComputedStyle(el);
    const filled = cs.backgroundImage !== 'none' || !clear(cs.backgroundColor);
    return filled && !/^(HTML|BODY|MAIN|SECTION|FOOTER|HEADER)$/.test(el.tagName) && el.offsetHeight < innerHeight * 0.9;
  };
  let raf = 0;
  const check = () => {
    raf = 0;
    root.classList.toggle('nav-float', scrollY > 8);
    const r = { top: nav.offsetTop + shell.offsetTop, left: nav.offsetLeft + shell.offsetLeft, width: shell.offsetWidth, height: shell.offsetHeight };
    r.bottom = r.top + r.height; r.right = r.left + r.width;
    let under = false;
    outer: for (const y of [r.top + 4, r.top + r.height / 2, r.bottom + 2]) {
      for (let x = r.left + 12; x < r.right - 12; x += Math.max(40, r.width / 16)) {
        const stack = document.elementsFromPoint(x, y).filter(el => !nav.contains(el));
        if (isContent(stack[0])) { under = true; break outer; }
      }
    }
    root.classList.toggle('nav-clear', !under);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
  let idle = 0;
  addEventListener('scroll', () => { schedule(); clearTimeout(idle); idle = setTimeout(schedule, 140); }, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  schedule();
})();
