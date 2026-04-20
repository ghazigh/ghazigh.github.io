/* =============================================================
   AI RESEARCHER — interactive layer
   - Neural-field canvas (hero)
   - Scroll reveals
   - Magnetic CTAs
   - Date & section tracking
   ============================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================
  // Today's date in the hero meta block
  // =========================================================
  function setToday() {
    const el = document.querySelector('[data-today]');
    if (!el) return;
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    el.textContent = `${months[d.getMonth()]} ${d.getDate()} · ${d.getFullYear()}`;

    document.querySelectorAll('[data-year]').forEach(n => n.textContent = d.getFullYear());
    const q = Math.floor(d.getMonth() / 3) + 1;
    document.querySelectorAll('[data-quarter]').forEach(n => n.textContent = q);
  }

  // =========================================================
  // Neural-field canvas
  // =========================================================
  function setupNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ink = #141210, rust = #C4552D, paper deep = #EBE1CB
    const INK    = 'rgba(20, 18, 16,';
    const RUST   = 'rgba(196, 85, 45,';
    const SLATE  = 'rgba(62, 89, 112,';

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let nodes = [];
    let edges = [];
    let t = 0;
    let temp = 0.71;
    let loss = 0.418;
    let mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    }

    function layout() {
      // Sprinkle nodes in a soft grid with jitter — two visual "clusters".
      nodes = [];
      const target = Math.max(22, Math.min(52, Math.round((W * H) / 6400)));
      for (let i = 0; i < target; i++) {
        const cluster = Math.random() < 0.5 ? 0 : 1;
        const cx = cluster === 0 ? W * 0.34 : W * 0.68;
        const cy = cluster === 0 ? H * 0.42 : H * 0.58;
        const r = Math.pow(Math.random(), 0.8) * Math.min(W, H) * 0.42;
        const a = Math.random() * Math.PI * 2;
        const x = cx + Math.cos(a) * r + (Math.random() - 0.5) * 24;
        const y = cy + Math.sin(a) * r + (Math.random() - 0.5) * 24;
        nodes.push({
          x0: x, y0: y, x, y,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,
          phase: Math.random() * Math.PI * 2,
          cluster,
          size: 1.6 + Math.random() * 2.2,
          pulse: 0
        });
      }
      // Build sparse edges (kNN-ish, capped).
      edges = [];
      const maxPer = 3;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        const dists = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const nj = nodes[j];
          const d = (ni.x - nj.x) ** 2 + (ni.y - nj.y) ** 2;
          dists.push([d, j]);
        }
        dists.sort((a, b) => a[0] - b[0]);
        for (let k = 0; k < Math.min(maxPer, dists.length); k++) {
          const j = dists[k][1];
          if (i < j) edges.push({ i, j, w: 0.2 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 });
        }
      }
      updateReadout();
    }

    function updateReadout() {
      const set = (k, v) => {
        const el = canvas.parentElement.querySelector(`[data-ro="${k}"]`);
        if (el) el.textContent = v;
      };
      set('nodes', String(nodes.length).padStart(2, '0'));
      set('edges', String(edges.length).padStart(3, '0'));
      set('temp', temp.toFixed(2));
      set('loss', loss.toFixed(3));
    }

    function draw() {
      t += 0.0075;
      // Slow jitter on global read-outs
      if ((performance.now() | 0) % 40 === 0) {
        temp += (Math.random() - 0.5) * 0.006;
        temp = Math.max(0.5, Math.min(0.95, temp));
        loss += (Math.random() - 0.5) * 0.003;
        loss = Math.max(0.18, Math.min(0.62, loss));
        updateReadout();
      }

      // Background — very subtle tonal gradient
      ctx.clearRect(0, 0, W, H);

      // Faint paper grid
      ctx.save();
      ctx.strokeStyle = INK + '0.05)';
      ctx.lineWidth = 1;
      const step = 22;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke();
      }
      ctx.restore();

      // Node drift
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx + Math.cos(t + n.phase) * 0.08;
        n.y += n.vy + Math.sin(t * 0.9 + n.phase) * 0.08;
        const dx = n.x - n.x0, dy = n.y - n.y0;
        n.vx -= dx * 0.0006;
        n.vy -= dy * 0.0006;
        n.vx *= 0.99;
        n.vy *= 0.99;

        // Mouse attraction
        if (mouse.active) {
          const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < 120 * 120) {
            const f = (120 - Math.sqrt(md2)) * 0.0007;
            n.vx += mdx * f;
            n.vy += mdy * f;
          }
        }

        n.pulse = Math.max(0, n.pulse - 0.02);
      }

      // Edges
      ctx.lineCap = 'round';
      for (let k = 0; k < edges.length; k++) {
        const e = edges[k];
        const a = nodes[e.i], b = nodes[e.j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > Math.min(W, H) * 0.55) continue;

        const attention = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.4 + e.phase));
        const alpha = 0.05 + 0.18 * attention * e.w;

        ctx.strokeStyle = INK + alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.8 + attention * 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Occasional signal packet along the edge — rust dot
        const sig = (t * 0.6 + e.phase) % 6;
        if (sig < 1) {
          const p = sig;
          const px = a.x + (b.x - a.x) * p;
          const py = a.y + (b.y - a.y) * p;
          ctx.fillStyle = RUST + (0.6 * (1 - Math.abs(p - 0.5) * 2)).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
          // Light up destination
          b.pulse = Math.min(1, b.pulse + 0.04 * (1 - p));
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = n.size + n.pulse * 3;
        // halo on pulse
        if (n.pulse > 0.04) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
          g.addColorStop(0, RUST + (0.18 * n.pulse).toFixed(3) + ')');
          g.addColorStop(1, RUST + '0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2); ctx.fill();
        }
        // ring
        ctx.strokeStyle = INK + '0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke();
        // dot
        ctx.fillStyle = n.cluster === 0 ? INK + '0.9)' : RUST + '0.95)';
        ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(0.9, r - 1.2), 0, Math.PI * 2); ctx.fill();
      }

      // Crosshairs — faint axis marks
      ctx.strokeStyle = INK + '0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.5, 6); ctx.lineTo(W * 0.5, 14);
      ctx.moveTo(W * 0.5, H - 14); ctx.lineTo(W * 0.5, H - 6);
      ctx.moveTo(6, H * 0.5); ctx.lineTo(14, H * 0.5);
      ctx.moveTo(W - 14, H * 0.5); ctx.lineTo(W - 6, H * 0.5);
      ctx.stroke();

      rafId = requestAnimationFrame(draw);
    }

    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    });
    canvas.addEventListener('pointerleave', () => { mouse.active = false; });

    let rafId = null;
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (prefersReduced) {
      // Draw one static frame
      draw();
      cancelAnimationFrame(rafId);
    } else {
      draw();
    }
  }

  // =========================================================
  // Portrait frame sequence — autoplay once, then scroll-scrub
  // =========================================================
  function setupPortraitScrubber() {
    const canvas = document.querySelector('.portrait-canvas');
    const hero = document.querySelector('.new-hero-section');
    const wrap = canvas && canvas.parentElement;
    if (!canvas || !hero || !wrap) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const FRAME_COUNT  = 102;     // frames_hero_webp/frame_000000..000101.webp
    const FRAME_PREFIX = 'frames_hero_webp/frame_';
    const FRAME_PAD    = 6;
    const FRAME_EXT    = 'webp';
    // Don't rewind past ~30% of sequence — keeps the subject recognizable at max scroll
    const MIN_FRAME_FRAC = 0.30;
    const AUTOPLAY_FPS   = 30;

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const pad = (n, w) => String(n).padStart(w, '0');
    const url = (i) => FRAME_PREFIX + pad(i, FRAME_PAD) + '.' + FRAME_EXT;

    const imgs = new Array(FRAME_COUNT);
    const loaded = new Array(FRAME_COUNT);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cur = FRAME_COUNT - 1;
    let autoplaying = true;
    let rafQueued = false;
    let heroTopAbs = null;

    const roEls = {};
    wrap.querySelectorAll('[data-ro]').forEach(el => { roEls[el.dataset.ro] = el; });
    if (roEls.total) roEls.total = roEls.total;

    function setReadout(frame, scrubProgress) {
      if (roEls.frame) roEls.frame.textContent = String(frame).padStart(3, '0');
      if (roEls.total) roEls.total.textContent = String(FRAME_COUNT);
      if (roEls.scrub) roEls.scrub.textContent = (scrubProgress * 100).toFixed(0).padStart(2, '0') + '%';
      if (roEls.fps) roEls.fps.textContent = String(AUTOPLAY_FPS);
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(r.width * dpr));
      const h = Math.max(1, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    }

    function drawCover(img) {
      const cw = canvas.width, ch = canvas.height;
      if (!cw || !ch) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale, dh = ih * scale;
      const dx = (cw - dw) * 0.5;
      const dy = (ch - dh) * 0.35; // bias slightly up so face is centered
      ctx.fillStyle = '#EBE1CB';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function draw() {
      if (rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(() => {
        rafQueued = false;
        const img = imgs[cur];
        if (img && loaded[cur]) drawCover(img);
      });
    }

    function ensureLoaded(i, cb) {
      if (i < 0 || i >= FRAME_COUNT) return;
      if (loaded[i]) { cb && cb(); return; }
      if (!imgs[i]) {
        imgs[i] = new Image();
        imgs[i].decoding = 'async';
        imgs[i].src = url(i);
      }
      imgs[i].onload = () => { loaded[i] = true; cb && cb(); };
      imgs[i].onerror = () => { /* leave unloaded */ };
    }

    function preloadAll() {
      let i = 0;
      const pump = () => {
        for (let k = 0; k < 4 && i < FRAME_COUNT; k++, i++) ensureLoaded(i);
        if (i < FRAME_COUNT) {
          if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(pump);
          } else {
            window.setTimeout(pump, 16);
          }
        }
      };
      pump();
    }

    function setFrame(i) {
      i = clamp(Math.round(i), 0, FRAME_COUNT - 1);
      if (i === cur) return;
      cur = i;
      ensureLoaded(cur, draw);
    }

    function ensureHeroTop() {
      if (heroTopAbs !== null) return;
      const r = hero.getBoundingClientRect();
      heroTopAbs = (window.scrollY || 0) + r.top;
    }

    function progressFromScroll() {
      ensureHeroTop();
      // ~9 px of scroll per frame (full sequence unfolds across ~650 px ≈ 2 wheel
      // ticks-worth). Fast enough that small scroll reads as change, slow enough
      // that a single wheel tick doesn't burn through the whole animation.
      const scrubPx = 650;
      const y = (window.scrollY || 0) - heroTopAbs;
      return clamp(y / scrubPx, 0, 1);
    }

    function onScroll() {
      if (autoplaying) return;
      const p = progressFromScroll();
      // Scrolling down rewinds sequence but only down to MIN_FRAME_FRAC
      const minFrame = Math.round(MIN_FRAME_FRAC * (FRAME_COUNT - 1));
      const maxFrame = FRAME_COUNT - 1;
      const frame = Math.round(maxFrame - p * (maxFrame - minFrame));
      setFrame(frame);
      setReadout(frame, p);
    }

    function autoplayOnce() {
      const total = FRAME_COUNT - 1;
      const dur = (FRAME_COUNT / AUTOPLAY_FPS) * 1000;
      let start = null;
      function step(ts) {
        if (start === null) start = ts;
        const t = clamp((ts - start) / dur, 0, 1);
        const frame = Math.round(t * total);
        setFrame(frame);
        setReadout(frame, 0);
        if (t < 1) requestAnimationFrame(step);
        else {
          autoplaying = false;
          onScroll(); // hand off to scroll-scrub
        }
      }
      // kick off as soon as first frame is ready
      ensureLoaded(0, () => requestAnimationFrame(step));
    }

    // Wire up
    const ro = new ResizeObserver(() => { heroTopAbs = null; resize(); });
    ro.observe(canvas);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { heroTopAbs = null; }, { passive: true });
    resize();
    setReadout(0, 0);
    preloadAll();
    if (prefersReduced) {
      // Static: just show last frame
      ensureLoaded(FRAME_COUNT - 1, () => { setFrame(FRAME_COUNT - 1); setReadout(FRAME_COUNT - 1, 0); });
      autoplaying = false;
    } else {
      autoplayOnce();
    }
  }

  // =========================================================
  // Scroll reveals — apply .reveal to section children
  // =========================================================
  function setupReveals() {
    const targets = document.querySelectorAll(
      '.section-head, .prose-body p, .pullquote, .prose-aside, ' +
      '.cap-row, .panel, .chron-entry, .biblio-entry, ' +
      '.honor-list li, .work-card, .letter, .colophon-inner'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.setAttribute('data-reveal-delay', String(i % 4));
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-inview'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-inview');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    targets.forEach(t => io.observe(t));
  }

  // =========================================================
  // Magnetic CTAs
  // =========================================================
  function setupMagnetic() {
    if (prefersReduced) return;
    const els = document.querySelectorAll('.cta, .social-link, .floating-action');
    els.forEach(el => {
      let rect = null;
      el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
        rect = null;
      });
    });
  }

  // =========================================================
  // Section tracking in nav
  // =========================================================
  function setupSectionTracking() {
    const links = Array.from(document.querySelectorAll('.custom-nav-links a[data-nav-section]'));
    const map = new Map();
    links.forEach(a => {
      const key = a.getAttribute('data-nav-section');
      const section = document.querySelector(`[data-section="${key}"]`);
      if (section) map.set(section, a);
    });
    if (map.size === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.2) {
          links.forEach(a => a.classList.remove('nav-active'));
          const a = map.get(e.target);
          if (a) a.classList.add('nav-active');
        }
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.2, 0.4, 0.6] });

    map.forEach((_, section) => io.observe(section));
  }

  // =========================================================
  // Smooth scroll for nav + hero CTAs
  // =========================================================
  function setupSmoothScroll() {
    document.querySelectorAll('[data-nav-section]').forEach(a => {
      a.addEventListener('click', (e) => {
        const key = a.getAttribute('data-nav-section');
        const target = document.querySelector(`[data-section="${key}"]`);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    });
  }

  // =========================================================
  // Boot
  // =========================================================
  function boot() {
    setToday();
    setupNeuralCanvas();
    setupPortraitScrubber();
    setupReveals();
    setupMagnetic();
    setupSectionTracking();
    setupSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
