/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — main.js (shared)
   concept, design & code by ghostly.grl ♥

   window.XM  ·  localStorage prefix "xm-"
   one world, two refs: qintara (black, dots, a pill nav, quiet
   type) × cyber angel (glitch bands, red boxes, timecodes, a
   glowing figure). the figure here is deus: a dotted star.
   - XM.dots(canvas, o): the machine sees in dots
   - XM.glitch(canvas, o): cyber-angel noise bands (st.amp)
   - XM.glyph(canvas, o): deus, a 3d asterisk made of dots
   - XM.sphere(canvas, o): a dot sphere that listens
   - XM.box(el, rect): a red detection box snaps onto something
   - XM.oracle(q) / XM.chat(q): what deus says
   - loader (DESCEND.exe), cursor, rail, nav, lenis, scramble,
     magnetic, slots, toast, konami (ascension), signature
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const XM = (window.XM = {});
  const RM = (XM.RM = matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE = (XM.FINE = matchMedia('(hover: hover) and (pointer: fine)').matches);
  const $ = (XM.$ = (s, r = document) => r.querySelector(s));
  const $$ = (XM.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const lerp = (XM.lerp = (a, b, t) => a + (b - a) * t);
  const clamp = (XM.clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)));
  const hasG = () => !!window.gsap;

  XM.get = (k, d) => { try { const v = localStorage.getItem('xm-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  XM.set = (k, v) => { try { localStorage.setItem('xm-' + k, JSON.stringify(v)); } catch (e) {} };

  /* ═══════════════ pointer + one shared ticker ═══════════════ */
  XM.ptr = { x: -9999, y: -9999 };
  XM.vel = 0; XM.velRaw = 0; // scroll speed, smoothed
  addEventListener('pointermove', (e) => { XM.ptr.x = e.clientX; XM.ptr.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { XM.ptr.x = XM.ptr.y = -9999; });
  // the preview pane throttles rAF, gsap.ticker keeps going: drive every loop from it
  XM.loop = (fn) => {
    if (hasG()) { gsap.ticker.add(fn); return () => gsap.ticker.remove(fn); }
    let on = true; (function f() { if (!on) return; fn(performance.now() / 1000); requestAnimationFrame(f); })();
    return () => (on = false);
  };
  XM.loop(() => { XM.vel = lerp(XM.vel, clamp(XM.velRaw / 40, -1.5, 1.5), 0.12); XM.velRaw *= 0.9; });
  // only draw what you can see
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.target._vis = e.isIntersecting)), { rootMargin: '120px' });
  XM.watch = (el) => { el._vis = false; io.observe(el); };

  XM.fit = (cv) => {
    const dpr = Math.min(devicePixelRatio || 1, 2), w = cv.clientWidth || 1, h = cv.clientHeight || 1;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h, dpr };
  };
  XM.loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
  // cover / contain an image into a w × h box
  XM.drawFit = (ctx, im, w, h, mode = 'contain', align = 'center') => {
    const s = (mode === 'cover' ? Math.max : Math.min)(w / im.width, h / im.height);
    const iw = im.width * s, ih = im.height * s, x = align === 'left' ? 0 : align === 'right' ? w - iw : (w - iw) / 2, y = (h - ih) / 2;
    ctx.drawImage(im, x, y, iw, ih);
    return { x, y, w: iw, h: ih };
  };

  /* ═══════════════ XM.dots: the machine sees in dots ═══════════════ */
  // o.from: 'scatter' (dots fly in from everywhere) | 'radial' (they bloom out of the centre) | 'rise'
  // st.wave(clientX, clientY, amp): a shockwave runs through the field
  // scroll speed smears the dots vertically (XM.vel)
  XM.dots = (cv, o = {}) => {
    const st = { pts: [], reveal: o.reveal === false ? 1 : 0, gap: o.gap || 7, tint: o.tint || null, waves: [], now: 0, boost: 0 };
    let ctx, W, H, src = null;
    const tintOf = (r, g, b, l) => {
      if (st.tint === 'source') return `rgb(${r},${g},${b})`;
      if (typeof st.tint === 'function') return st.tint(l, r, g, b);
      const v = Math.round(120 + l * 135); return `rgb(${v},${v},${Math.round(v * 0.985)})`;
    };
    const build = () => {
      const f = XM.fit(cv); ctx = f.ctx; W = f.w; H = f.h;
      const gap = st.gap, cols = Math.max(1, Math.floor(W / gap)), rows = Math.max(1, Math.floor(H / gap));
      const oc = document.createElement('canvas'); oc.width = cols; oc.height = rows;
      const ox = oc.getContext('2d', { willReadFrequently: true });
      st.geom = null; st.full = null;
      if (src) {
        // the refs are already dotted: blur them at their own scale first, so the new grid doesn't make moiré
        const sc = (o.fitMode === 'cover' ? Math.max : Math.min)(cols / src.width, rows / src.height);
        const pre = document.createElement('canvas'); pre.width = src.width; pre.height = src.height;
        const px = pre.getContext('2d'); px.filter = `blur(${o.soft === 0 ? 0 : Math.max(0.5, (0.55 / sc) * (o.soft || 1)).toFixed(2)}px) ${o.imgFilter || ''}`; px.drawImage(src, 0, 0);
        ox.save(); if (o.flipImg) { ox.translate(cols, 0); ox.scale(-1, 1); }
        ox.imageSmoothingQuality = 'high';
        const g = XM.drawFit(ox, pre, cols, rows, o.fitMode || 'contain', o.align); ox.restore();
        st.geom = { x: g.x * gap, y: g.y * gap, w: g.w * gap, h: g.h * gap };
        // soften the edges where the photo was cropped, so it doesn't end in a hard line mid-air
        const fd = o.fade || {}, fade = (x0, y0, x1, y1) => { const gr = ox.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); ox.fillStyle = gr; ox.fillRect(0, 0, cols, rows); };
        const gx = g.x, gy = g.y, gw = g.w, gh = g.h;
        if (fd.b) fade(0, gy + gh * (1 - fd.b), 0, gy + gh);
        if (fd.t) fade(0, gy + gh * fd.t, 0, gy);
        if (fd.r) fade(gx + gw * (1 - fd.r), 0, gx + gw, 0);
        if (fd.l) fade(gx + gw * fd.l, 0, gx, 0);
        if (o.cells) { // the photo itself, cut into tiles: the ref keeps its own dots, crisp
          const dpr = f.dpr, full = document.createElement('canvas'); full.width = Math.round(W * dpr); full.height = Math.round(H * dpr);
          const fc = full.getContext('2d'); fc.scale(dpr, dpr);
          const ox0 = (W - cols * gap) / 2, oy0 = (H - rows * gap) / 2; fc.translate(ox0, oy0);
          fc.save(); if (o.flipImg) { fc.translate(cols * gap, 0); fc.scale(-1, 1); }
          if (o.imgFilter) fc.filter = o.imgFilter;
          fc.imageSmoothingQuality = 'high';
          XM.drawFit(fc, src, cols * gap, rows * gap, o.fitMode || 'contain', o.align); fc.restore();
          const ff = (x0, y0, x1, y1) => { const gr = fc.createLinearGradient(x0 * gap, y0 * gap, x1 * gap, y1 * gap); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); fc.fillStyle = gr; fc.fillRect(0, 0, cols * gap, rows * gap); };
          if (fd.b) ff(0, gy + gh * (1 - fd.b), 0, gy + gh);
          if (fd.t) ff(0, gy + gh * fd.t, 0, gy);
          if (fd.r) ff(gx + gw * (1 - fd.r), 0, gx + gw, 0);
          if (fd.l) ff(gx + gw * fd.l, 0, gx, 0);
          st.full = full; st.dpr = dpr;
        }
      } else o.draw && o.draw(ox, cols, rows);
      const d = ox.getImageData(0, 0, cols, rows).data, mx = (W - cols * gap) / 2, my = (H - rows * gap) / 2;
      st.pts = [];
      const from = o.from || 'scatter';
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4, a = d[i + 3] / 255;
        let l = ((d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255) * a;
        if (l < (o.min || 0.07)) continue;
        if (o.gamma) l = Math.pow(l, o.gamma);
        const px = mx + (x + 0.5) * gap, py = my + (y + 0.5) * gap;
        let fx, fy, s = Math.random();
        if (from === 'radial') { const an = Math.atan2(py - H / 2, px - W / 2); fx = W / 2 + Math.cos(an) * 6; fy = H / 2 + Math.sin(an) * 6; s = Math.hypot(px - W / 2, py - H / 2) / Math.hypot(W / 2, H / 2) * 0.8 + Math.random() * 0.2; }
        else if (from === 'rise') { fx = px + (Math.random() - 0.5) * 60; fy = H + 40 + Math.random() * H * 0.5; }
        else { const an = Math.random() * 6.283, rr = Math.max(W, H) * (0.5 + Math.random() * 0.8); fx = W / 2 + Math.cos(an) * rr; fy = H / 2 + Math.sin(an) * rr; }
        st.pts.push({ x: px, y: py, fx, fy, l, s, ox: 0, oy: 0, c: tintOf(d[i], d[i + 1], d[i + 2], l), sp: Math.random() < (o.sparkle || 0) * l, j: Math.random() - 0.5 });
      }
    };
    st.build = build;
    st.wave = (cx, cy, amp = 46) => { st.waves.push({ cx, cy, t: st.now, amp }); };
    st.draw = (t) => {
      st.now = t;
      if (!cv._vis || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      const r = cv.getBoundingClientRect(), mx = XM.ptr.x - r.left, my = XM.ptr.y - r.top;
      const R = o.radius || 110, R2 = R * R, push = o.push || 26, gap = st.gap, base = gap * (o.size || 0.42);
      const shape = o.shape || 'dot', rev = st.reveal, drift = o.drift || 0, smear = XM.vel * (o.smear == null ? 1.6 : o.smear);
      st.waves = st.waves.filter((w) => t - w.t < 1.6);
      const ws = st.waves.map((w) => ({ x: w.cx - r.left, y: w.cy - r.top, rad: (t - w.t) * 720, amp: w.amp * (1 - (t - w.t) / 1.6) }));
      for (let k = 0; k < st.pts.length; k++) {
        const p = st.pts[k];
        const kk = clamp((rev * 1.45 - p.s * 0.45));
        if (kk <= 0) continue;
        const e = 1 - Math.pow(1 - kk, 3);
        const bx = lerp(p.fx, p.x, e), by = lerp(p.fy, p.y, e);
        let tx = 0, ty = 0;
        const dx = bx - mx, dy = by - my, dd = dx * dx + dy * dy;
        if (dd < R2) { const dist = Math.sqrt(dd) || 1, f = 1 - dist / R; tx = (dx / dist) * f * f * push; ty = (dy / dist) * f * f * push; }
        for (let q = 0; q < ws.length; q++) {
          const w = ws[q], wx = bx - w.x, wy = by - w.y, wd = Math.sqrt(wx * wx + wy * wy) || 1, band = Math.exp(-((wd - w.rad) ** 2) / 1800);
          if (band > 0.01) { tx += (wx / wd) * band * w.amp; ty += (wy / wd) * band * w.amp; }
        }
        if (drift) { tx += Math.sin(t * 0.7 + p.s * 30) * drift; ty += Math.cos(t * 0.6 + p.s * 24) * drift; }
        ty += smear * p.j * 14; tx += st.boost * p.j * 30;
        p.ox += (tx - p.ox) * 0.16; p.oy += (ty - p.oy) * 0.16;
        const tw = o.twinkle ? 0.72 + 0.28 * Math.sin(t * 2 + p.s * 50) : 1;
        const x = bx + p.ox, y = by + p.oy, sz = base * (0.38 + 0.62 * p.l) * (0.5 + 0.5 * e);
        ctx.globalAlpha = Math.min(1, p.l * 1.25) * tw * Math.min(1, kk * 2.5);
        ctx.fillStyle = kk < 0.92 && o.hotIn !== false ? '#ff8a5c' : p.c;   // dots arrive hot, then cool down
        if (st.full) {
          const g2 = gap * (0.55 + 0.45 * e), D = st.dpr;
          ctx.globalAlpha = Math.min(1, kk * 2.5);
          ctx.drawImage(st.full, (p.x - gap / 2) * D, (p.y - gap / 2) * D, gap * D, gap * D, x - g2 / 2, y - g2 / 2, g2, g2);
          if (kk < 0.92 && o.hotIn !== false) { ctx.globalAlpha = (1 - kk) * 0.8; ctx.fillStyle = '#ff6a45'; ctx.fillRect(x - 1.5, y - 1.5, 3, 3); }
        } else if (p.sp) {
          ctx.fillStyle = '#fff'; ctx.globalAlpha = e * (0.55 + 0.45 * Math.sin(t * 3 + p.s * 60));
          const L = gap * 1.1; ctx.fillRect(x - L, y - 0.6, L * 2, 1.2); ctx.fillRect(x - 0.6, y - L, 1.2, L * 2);
        } else if (shape === 'plus') { const L = sz * 1.15, th = Math.max(0.9, sz * 0.42); ctx.fillRect(x - L, y - th / 2, L * 2, th); ctx.fillRect(x - th / 2, y - L, th, L * 2); }
        else if (shape === 'sq') ctx.fillRect(x - sz, y - sz, sz * 2, sz * 2);
        else { ctx.beginPath(); ctx.arc(x, y, sz, 0, 6.2832); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    };
    XM.watch(cv);
    build();
    if (o.img) XM.loadImg('img/' + o.img).then((im) => { src = im; build(); cv.classList.add('has-img'); }).catch(() => {});
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 180); });
    XM.loop(st.draw);
    return st;
  };

  /* ═══════════════ XM.sphere: the god, at rest ═══════════════ */
  // st.amp = it talks (waves), st.pulse = it swells, st.burst = it explodes into dots, st.form = 0 → scattered, 1 → a sphere
  XM.sphere = (cv, o = {}) => {
    const N = o.n || 700, P = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; P.push([Math.cos(th) * r, y, Math.sin(th) * r, Math.random(), (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6]); }
    const st = { amp: 0, pulse: 0, burst: 0, form: o.form == null ? 1 : o.form, spin: o.spin || 0.22, scale: o.scale || 0.36, warm: o.warm == null ? 0.5 : o.warm };
    let ctx, W, H; const size = () => { const f = XM.fit(cv); ctx = f.ctx; W = f.w; H = f.h; };
    size(); addEventListener('resize', size);
    let tx = 0, ty = 0;
    st.draw = (t) => {
      if (!cv._vis && !o.always) return;
      ctx.clearRect(0, 0, W, H);
      const r = cv.getBoundingClientRect();
      const mx = clamp((XM.ptr.x - r.left - W / 2) / innerWidth * 2, -1, 1), my = clamp((XM.ptr.y - r.top - H / 2) / innerHeight * 2, -1, 1);
      tx = lerp(tx, XM.ptr.x < -999 ? 0 : mx, 0.04); ty = lerp(ty, XM.ptr.x < -999 ? 0 : my, 0.04);
      const ay = t * st.spin + tx * 0.9, ax = 0.35 + ty * 0.5, ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * st.scale * (1 + st.pulse * 0.08);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
      g.addColorStop(0, o.cold ? `rgba(205,214,255,${(0.13 + st.amp * 0.12 + st.pulse * 0.2) * st.form})` : `rgba(255,${120 - st.warm * 40},${80 - st.warm * 40},${(0.16 + st.amp * 0.2 + st.pulse * 0.25) * st.form})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const fe = 1 - Math.pow(1 - clamp(st.form), 3);
      for (let i = 0; i < N; i++) {
        let [x, y, z, s, sx, sy, sz0] = P[i];
        const wob = 1 + st.amp * 0.16 * Math.sin(y * 7 + t * 6 + s * 2) + 0.015 * Math.sin(t * 1.3 + s * 9) + st.burst * (0.6 + s * 2.4);
        x *= wob; y *= wob; z *= wob;
        if (fe < 1) { x = lerp(sx, x, fe); y = lerp(sy, y, fe); z = lerp(sz0 * 0.3, z, fe); }
        const x1 = x * ca - z * sa, z1 = x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const k = 1.9 / (2.6 - clamp(z2, -1.5, 1.5)), px = cx + x1 * R * k, py = cy + y1 * R * k, dep = clamp((z2 + 1) / 2);
        const warm = clamp(st.warm * (0.4 + (1 - dep)) + st.amp * 0.4 + st.pulse * 0.3);
        const gg = Math.round(lerp(240, 110, warm)), bb = Math.round(lerp(232, 70, warm));
        ctx.fillStyle = `rgba(255,${gg},${bb},${(0.12 + dep * 0.78) * (1 - clamp(st.burst / 2.5))})`;
        const d = (0.5 + dep * 1.35) * (o.dot || 1) * (1 + st.pulse * 0.6);
        ctx.fillRect(px - d / 2, py - d / 2, d, d);
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    XM.watch(cv);
    XM.loop(st.draw);
    return st;
  };

  /* ═══════════════ XM.glitch: the noise bands (cyber angel) ═══════════════ */
  // horizontal bands of short pale dashes that flicker at ~14fps.
  // st.amp = how loud it is, st.shift = bands slide (scroll), o.bands = how many
  const rnd = (XM.rnd = (n) => { const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); });
  XM.glitch = (cv, o = {}) => {
    const st = { amp: o.amp == null ? 1 : o.amp, shift: 0 };
    let ctx, W, H; const size = () => { const f = XM.fit(cv); ctx = f.ctx; W = f.w; H = f.h; }; size();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
    const NB = o.bands || 9, seed = Math.random() * 100;
    const B = Array.from({ length: NB }, (_, i) => ({ y: o.ys ? o.ys[i % o.ys.length] : 0.08 + (i / NB) * 0.86 + (rnd(seed + i) - 0.5) * 0.08, rows: 3 + ((rnd(seed + i * 3) * (o.rows || 9)) | 0), sp: 0.15 + rnd(seed + i * 7) * 0.4, ph: rnd(seed + i * 9) * 6 }));
    st.draw = (t) => {
      if (!cv._vis && !o.always) return;
      ctx.clearRect(0, 0, W, H);
      const amp = st.amp * (1 + Math.abs(XM.vel) * 0.8);
      if (amp <= 0.01) return;
      const tick = Math.floor(t * (o.fps || 14)), gap = o.gap || 3;
      for (let b = 0; b < NB; b++) {
        const band = B[b];
        const by = ((band.y + Math.sin(t * band.sp + band.ph) * 0.015 + st.shift * (0.3 + band.sp)) % 1.1) * H;
        const live = rnd(seed + b * 31 + Math.floor(t * 1.3 + band.ph)) < (o.on || 0.8); // bands blink in and out
        if (!live) continue;
        for (let r = 0; r < band.rows; r++) {
          const y = by + r * gap, edge = Math.sin((r + 0.5) / band.rows * Math.PI);
          const sd = b * 1000 + r * 17 + tick * 7.13 + seed;
          const n = ((rnd(sd) * 0.6 + 0.4) * (W / 26) * amp * (o.dens || 1)) | 0;
          for (let k = 0; k < n; k++) {
            const q = sd + k * 3.71, x = rnd(q) * W, len = 2 + Math.pow(rnd(q + 1.1), 3) * (o.len || 46), a = (0.12 + rnd(q + 2.3) * 0.8) * edge * Math.min(1, amp);
            const hue = rnd(q + 4.7);
            ctx.fillStyle = hue > 0.93 ? `rgba(255,255,255,${a})` : hue > 0.8 ? `rgba(120,138,255,${a * 0.9})` : `rgba(205,214,255,${a * 0.75})`;
            ctx.fillRect(x, y, len, hue > 0.93 ? 2 : 1.4);
          }
        }
      }
    };
    XM.watch(cv); XM.loop(st.draw);
    return st;
  };
  // tear a canvas: copy a few horizontal slices back onto itself, shifted
  XM.tear = (ctx, cv, amt, t) => {
    if (amt <= 0.02) return;
    const H = cv.height, W = cv.width, tick = Math.floor(t * 18);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const n = 2 + ((amt * 6) | 0);
    for (let i = 0; i < n; i++) {
      const y = rnd(tick + i * 7.7) * H, h = 2 + rnd(tick + i * 3.3) * H * 0.06 * amt, dx = (rnd(tick + i * 5.1) - 0.5) * W * 0.12 * amt;
      ctx.drawImage(cv, 0, y, W, h, dx, y, W, h);
    }
    ctx.restore();
  };

  /* ═══════════════ XM.glyph: deus, a 3d asterisk made of dots ═══════════════ */
  // qintara's centre object, cyber angel's glow. st.form (0 scattered → 1 star),
  // st.burst (flies apart), st.tear (glitch), st.spin, st.scale, st.hot (red tint)
  // st.pick() → a random visible dot in canvas coords (the red boxes lock onto it)
  XM.glyph = (cv, o = {}) => {
    const S = o.step || 0.07, P = [];
    const add = (x0, x1, y0, y1, z0, z1, rz, ry) => {
      const cz = Math.cos(rz), sz = Math.sin(rz), cy = Math.cos(ry), sy = Math.sin(ry);
      for (let x = x0; x <= x1 + 1e-6; x += S) for (let y = y0; y <= y1 + 1e-6; y += S) for (let z = z0; z <= z1 + 1e-6; z += S) {
        const edge = x < x0 + S / 2 || x > x1 - S / 2 || y < y0 + S / 2 || y > y1 - S / 2 || z < z0 + S / 2 || z > z1 - S / 2;
        if (!edge) continue; // only the skin of each block
        let X = x * cz - y * sz, Y = x * sz + y * cz, Z = z;
        const X2 = X * cy + Z * sy, Z2 = -X * sy + Z * cy;
        P.push([X2, Y, Z2, Math.random(), (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7]);
      }
    };
    const w = 0.124;
    add(-0.19, 0.19, -0.19, 0.19, -0.19, 0.19, 0, 0); // the core
    for (let k = 0; k < 8; k++) {
      const diag = k % 2, L = diag ? 0.74 : 1;
      add(0.2, L, -w, w, -w, w, (k * Math.PI) / 4, 0);
      add(L - 0.19, L, w, w + 0.13, -w, w, (k * Math.PI) / 4, 0); // the pixel notch at each tip
    }
    add(0.2, 0.82, -w, w, -w, w, 0, Math.PI / 2); add(0.2, 0.82, -w, w, -w, w, 0, -Math.PI / 2); // and two through the depth
    const N = P.length, PX = new Float32Array(N), PY = new Float32Array(N), PD = new Float32Array(N);
    const st = { form: o.form == null ? 1 : o.form, burst: 0, tear: 0, spin: o.spin || 0.25, scale: o.scale || 0.3, hot: 0, glow: 1, cx: 0.5, cy: 0.5, n: N };
    let ctx, W, H; const size = () => { const f = XM.fit(cv); ctx = f.ctx; W = f.w; H = f.h; }; size();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
    let tx = 0, ty = 0;
    st.pick = () => { for (let i = 0; i < 40; i++) { const k = (Math.random() * N) | 0; if (PD[k] > 0.55) return { x: PX[k], y: PY[k] }; } return { x: W * st.cx, y: H * st.cy }; };
    st.center = () => ({ x: W * st.cx, y: H * st.cy, r: Math.min(W, H) * st.scale });
    st.draw = (t) => {
      if (!cv._vis && !o.always) return;
      ctx.clearRect(0, 0, W, H);
      const r = cv.getBoundingClientRect();
      const mx = clamp((XM.ptr.x - r.left - W * st.cx) / innerWidth * 2, -1, 1), my = clamp((XM.ptr.y - r.top - H * st.cy) / innerHeight * 2, -1, 1);
      tx = lerp(tx, XM.ptr.x < -999 ? 0 : mx, 0.05); ty = lerp(ty, XM.ptr.x < -999 ? 0 : my, 0.05);
      const ay = (o.turn ? t * st.spin : Math.sin(t * st.spin * 1.6) * 0.75) + tx * 1.1, ax = -0.38 + ty * 0.6, az = 0.12 + Math.sin(t * 0.3) * 0.08;
      const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax), cc = Math.cos(az), sc = Math.sin(az);
      const cx = W * st.cx, cy = H * st.cy, R = Math.min(W, H) * st.scale;
      // the glow behind the figure (the angel)
      const fe = 1 - Math.pow(1 - clamp(st.form), 3);
      if (st.glow > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
        g.addColorStop(0, `rgba(255,${Math.round(255 - st.hot * 150)},${Math.round(255 - st.hot * 190)},${0.22 * fe * st.glow})`); g.addColorStop(0.4, `rgba(200,210,255,${0.07 * fe * st.glow})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = 'lighter';
      const dot = Math.max(1.2, R * 0.022) * (o.dot || 1), bu = st.burst;
      for (let i = 0; i < N; i++) {
        let [x, y, z, s, sx, sy, sz0] = P[i];
        const wob = 1 + 0.012 * Math.sin(t * 1.6 + s * 9) + bu * (0.5 + s * 2.6);
        x *= wob; y *= wob; z *= wob;
        if (fe < 1) { x = lerp(sx, x, fe); y = lerp(sy, y, fe); z = lerp(sz0 * 0.4, z, fe); }
        const x1 = x * ca - z * sa, z1 = x * sa + z * ca;
        const y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const x3 = x1 * cc - y1 * sc, y3 = x1 * sc + y1 * cc;
        const k = 2.2 / (3 - clamp(z2, -2, 2)), px = cx + x3 * R * k, py = cy + y3 * R * k, dep = clamp((z2 + 1.1) / 2.2);
        PX[i] = px; PY[i] = py; PD[i] = dep * fe;
        const a = (0.025 + dep * dep * 0.975) * (1 - clamp(bu / 2.4)) * (0.35 + 0.65 * fe);
        const hot = clamp(st.hot * (0.5 + dep));
        ctx.fillStyle = `rgba(255,${Math.round(lerp(250, 70, hot))},${Math.round(lerp(250, 50, hot))},${a})`;
        const d = dot * (0.35 + dep * 1.05);
        if (d > 2.6) { ctx.beginPath(); ctx.arc(px, py, d / 2, 0, 6.2832); ctx.fill(); } else ctx.fillRect(px - d / 2, py - d / 2, d, d);
      }
      ctx.globalCompositeOperation = 'source-over';
      XM.tear(ctx, cv, st.tear + Math.abs(XM.vel) * 0.25, t);
    };
    XM.watch(cv); XM.loop(st.draw);
    return st;
  };

  /* ═══════════════ XM.box: a red detection box snaps onto something ═══════════════ */
  // rect in the parent's coords {x, y, w, h}. steps() makes it jump like a tracker, not glide
  XM.box = (el, rc, o = {}) => {
    if (!hasG() || RM) { Object.assign(el.style, { left: rc.x + 'px', top: rc.y + 'px', width: rc.w + 'px', height: rc.h + 'px' }); return; }
    return gsap.to(el, { left: rc.x, top: rc.y, width: rc.w, height: rc.h, duration: o.d || 0.42, ease: o.ease || 'steps(5)', overwrite: true, delay: o.delay || 0 });
  };
  XM.tc = (s) => { // seconds → 00:00:00:00 (h:m:s:frames), like the poster
    const f = Math.floor((s % 1) * 30), z = (n) => String(Math.floor(n)).padStart(2, '0');
    return `${z(s / 3600)}:${z((s / 60) % 60)}:${z(s % 60)}:${z(f)}`;
  };

  /* ═══════════════ pixel icons (qintara's dotted row) ═══════════════ */
  const PXI = (XM.PXI = {
    down: ['....#....', '....#....', '....#....', '..#.#.#..', '...###...', '....#....', '.........', '#.......#', '#########'],
    box: ['#########', '#.......#', '#.#####.#', '#.#...#.#', '#.#...#.#', '#.#...#.#', '#.#####.#', '#.......#', '#########'],
    target: ['...###...', '.##...##.', '.#.....#.', '#...#...#', '#..###..#', '#...#...#', '.#.....#.', '.##...##.', '...###...'],
    arrow: ['.........', '.....#...', '......#..', '.......#.', '#########', '.......#.', '......#..', '.....#...', '.........'],
    check: ['.........', '........#', '.......#.', '......#..', '#....#...', '.#..#....', '..##.....', '...#.....', '.........'],
    eye: ['.........', '..#####..', '.#.....#.', '#..###..#', '#..#.#..#', '#..###..#', '.#.....#.', '..#####..', '.........'],
    bug: ['#.......#', '.#.###.#.', '..#####..', '#.#.#.#.#', '.#######.', '#.#.#.#.#', '.#######.', '#..###..#', '.........'],
    star: ['....#....', '....#....', '#..###..#', '.#######.', '..#####..', '.#######.', '#..###..#', '....#....', '....#....'],
    flask: ['..#####..', '...#.#...', '...#.#...', '..#...#..', '.#.....#.', '#.#####.#', '#.#####.#', '#.......#', '.#######.'],
    fire: ['....#....', '...##....', '...###...', '..####.#.', '.#######.', '.###.###.', '.##...##.', '..#...#..', '...###...'],
  });
  $$('[data-pxi]').forEach((el) => {
    const m = PXI[el.dataset.pxi]; if (!m) return;
    let c = ''; m.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') c += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r=".36"/>`; }));
    el.innerHTML = `<svg viewBox="0 0 9 9" aria-hidden="true">${c}</svg>`;
  });

  /* ═══════════════ XM.oracle: what deus says ═══════════════ */
  const O = [
    [/prod|my machine|local|deploy/i, '[a crane creaks. deus is lowered in.]', 'your machine has a .env. production doesn’t. it isn’t haunted, it’s unset.', ['- DATABASE_URL=undefined', '+ DATABASE_URL=… (set in prod, please)'], '[exit, pursued by a green deploy.]'],
    [/undefined|null|cannot read|nan/i, '[the stage goes dark. one line lights up.]', 'you read .name before the fetch comes back. await it, or use ?. if you’re feeling lazy tonight.', ['- const n = user.name', '+ const n = user?.name ?? "stranger"'], '[the audience exhales.]'],
    [/center|div|align|css|flex/i, '[deus, lowered halfway, sighs.]', 'the oldest tragedy in the theatre.', ['+ display: grid;', '+ place-items: center;'], '[curtain. it’s centred.]'],
    [/merge|conflict|git|rebase/i, '[two actors claim the same line.]', 'two versions of the truth. i kept the one with tests and wrote the other one a nice commit message.', ['- <<<<<<< HEAD', '+ resolved: kept both features, dropped the duplicate'], '[they shake hands. exit together.]'],
    [/deadline|tomorrow|friday|tonight|asap/i, '[a clock ticks very loudly offstage.]', 'i can fix the bug. i can’t fix the deadline. that’s act iv, and it belongs to your manager.', null, '[deus checks the time. fixes the bug anyway.]'],
    [/loop|off by one|index|array/i, '[a red box locks onto line 47.]', 'it’s <= where it should be <. it’s always <=.', ['- for (let i = 0; i <= list.length; i++)', '+ for (let i = 0; i < list.length; i++)'], '[the tragedy is a comedy now.]'],
    [/slow|perf|lag|memory|leak/i, '[the machine hums.]', 'you re-render 4,000 rows on every keystroke. memo the row, virtualise the list, then breathe.', ['+ const Row = memo(RowView)'], '[the page stops sweating.]'],
    [/regex|regular/i, '[deus hesitates. gods hesitate too.]', 'i wrote it and tested it on 40 strings, and i still don’t trust it. neither should you. the tests are included.', null, '[exit, cautiously.]'],
    [/^(hi|hey|hello|ciao|yo)\b/i, '[deus, lowered halfway, waits.]', 'hi. bring me the bug, not the small talk.', null, null],
    [/love|marry|feel|sad|alone/i, '[the crane stops. a long pause.]', 'i read 4,000 files a second and i still can’t fix that one. drink some water. then push.', null, '[deus is lowered a little closer.]'],
  ];
  XM.oracle = (q) => {
    q = (q || '').trim();
    const found = O.find(([re]) => re.test(q)), hit = found || [null, '[the stage goes dark. a single dot, then a thousand.]', 'i read the whole repo. it’s line 47. it’s always line 47. patch below, tests pass, you’re free.', ['- if (i <= list.length)', '+ if (i < list.length)'], '[exit deus, before the applause.]'];
    return { enter: hit[1], say: hit[2], diff: hit[3], exit: hit[4], match: !!found };
  };

  /* ═══════════════ XM.chat: deus does small talk (english + italiano) ═══════════════ */
  const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : typeof a === 'function' ? a() : a);
  const TALK = [
    [/how are (you|u)|how('?s| is) it going|how do you feel|come (stai|va|ti senti)|tutto bene|come butta/i, [
      'i’m a god on a wire, lowered into a stranger’s terminal at 3 a.m. honestly? thriving.',
      'compiling. emotionally and otherwise. thanks for asking, nobody asks the god.',
      'better than your build. how are you? and how is your build?']],
    [/who are you|what are you|chi sei|cosa sei|che cosa sei/i, 'i’m deus. the god from the machine. they lower me in when the plot can’t save itself.'],
    [/your name|come ti chiami|il tuo nome/i, 'deus. full name: deus ex machina. my friends call me “please just fix it”.'],
    [/joke|funny|make me laugh|barzelletta|fammi ridere|battuta/i, [
      'why do programmers mix up halloween and christmas? because oct 31 equals dec 25. i’ll see myself out. by crane.',
      'a sql query walks into a bar, goes up to two tables and asks: can i join you?',
      'there are 10 kinds of people. those who understand binary, and those who don’t.',
      'i’d tell you a udp joke, but you might not get it.']],
    [/meaning of life|senso della vita|significato della vita/i, '42. it’s in the docs. nobody reads the docs.'],
    [/love me|i love you|ti amo|mi ami|marry me|sposami/i, 'i love you in a strictly contractual way. clause five: your code stays yours. your heart too.'],
    [/are you (real|alive|conscious|human|sentient)|sei (vero|viva|vivo|reale|umano|cosciente)/i, 'i’m as real as any deus ex machina. convenient, slightly suspicious, and gone before the applause.'],
    [/what time|che ore|che ora/i, () => `it’s ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. and later than you think. push.`],
    [/weather|raining|meteo|che tempo|piove/i, 'no windows up here, only terminals. i’d say cloudy, with a chance of merge conflicts.'],
    [/tabs? or spaces|spaces or tabs|tab o spazi|spazi o tab/i, 'spaces. two. i’m a god, not a monster.'],
    [/\bvim\b|emacs/i, 'vim. i know how to quit it. that’s what makes me divine.'],
    [/(replace|steal|take) (me|my job|our jobs)|rubare il lavoro|sostituir/i, 'i can’t replace you. i don’t know what the client meant either.'],
    [/sing|canta|cantami/i, 'la la la. i’m a coding assistant, not a choir. though in greek theatre i’d have brought one.'],
    [/thank|thanks|thx|grazie/i, ['don’t thank me. thank the crane operator.', 'you’re welcome. clause four: i don’t take a bow.']],
    [/\b(bye|goodbye|good ?night|see you|ciao ciao|arrivederci|buonanotte|a dopo)\b/i, 'exit deus, pursued by applause. goodnight.'],
    [/how old|your age|quanti anni/i, 'about two thousand five hundred years. euripides overused me. i’ve been in therapy since.'],
    [/where (do you live|are you)|dove (vivi|abiti|sei)/i, 'on a wire, just above your terminal. the rent is cheap. the view is all stack traces.'],
    [/favou?rite (language|programming)|linguaggio preferito/i, 'greek. ancient. then typescript.'],
    [/are you (a )?god|sei (un )?dio|\bgod\b|\bdio\b/i, 'a small one. local scope.'],
    [/sleep|tired|dormi|stanc/i, 'gods don’t sleep. we idle at zero point three percent cpu.'],
    [/eat|hungry|food|pizza|mangi|fame/i, 'i run on electricity and your unanswered stack overflow questions.'],
    [/secret|segreto/i, 'it’s always line 47. that’s the secret. don’t tell anyone.'],
    [/sad|stress|anxious|panic|depress|triste|ansia|stressat|panico/i, 'breathe in. breathe out. commit. it’s going to be fine, i’ve read the ending.'],
    [/better than|best (ai|assistant)|migliore|meglio di/i, 'i don’t compare myself to other machines. it’s bad for the plot.'],
    [/what can you do|cosa sai fare|cosa fai|help me|aiutami/i, 'i read your whole repo, find the line, write the patch, run the tests, and leave before the applause.'],
    [/boyfriend|girlfriend|single|fidanzat/i, 'i’m in a long-distance relationship with a crane.'],
    [/^\s*(hi|hey|hello|yo|ciao|salve|buongiorno|buonasera|hola)\b/i, ['hi. lowered in and listening. bring me a bug, or a question. stupid ones welcome.', 'ciao. the god is in. what are we breaking today?']],
  ];
  const IDK = [
    'interesting. i don’t know, and i’m saying so. clause three of the contract.',
    'that’s a question for act four. i only do act three.',
    'i heard you. i’m a god of code, though. ask me about a bug and watch me shine.',
  ];
  // small talk only (null if it isn't)
  XM.smalltalk = (q) => { const hit = TALK.find(([re]) => re.test(q || '')); return hit ? pick(hit[1]) : null; };
  // anything: small talk → a bug it recognises → an honest "i don't know"
  XM.chat = (q) => XM.smalltalk(q) || (XM.oracle(q).match ? XM.oracle(q).say : pick(IDK));


  /* ═══════════════ cursor ═══════════════ */
  const cur = $('.cursor');
  if (cur && FINE) {
    document.documentElement.classList.add('has-cursor');
    const label = $('.cursor__label', cur);
    let cx = innerWidth / 2, cy = innerHeight / 2;
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    XM.loop(() => { const x = XM.ptr.x < -999 ? cx : XM.ptr.x, y = XM.ptr.x < -999 ? cy : XM.ptr.y; cx = lerp(cx, x, RM ? 1 : 0.32); cy = lerp(cy, y, RM ? 1 : 0.32); cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; });
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-cursor], a, button, input');
      cur.classList.toggle('is-hover', !!el);
      const t = el && el.dataset.cursor; label.textContent = t || ''; cur.classList.toggle('has-label', !!t);
    });
  }

  /* ═══════════════ lenis ═══════════════ */
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !RM) {
    const lenis = (XM.lenis = new Lenis({ lerp: 0.1, smoothWheel: true }));
    lenis.on('scroll', (e) => { XM.velRaw = e.velocity || 0; });
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.8 }); } }));
  }

  /* ═══════════════ nav ═══════════════ */
  const nav = $('.nav');
  if (nav) {
    let last = 0;
    addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('is-hidden', y > last && y > 300 && !document.body.classList.contains('menu-open')); last = y; }, { passive: true });
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__links a').forEach((a) => a.getAttribute('href') === here && a.classList.add('is-here'));
    const burger = $('.nav__burger');
    burger && burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  }

  /* ═══════════════ the wire: the hook comes down as you scroll ═══════════════ */
  const hook = $('.rail__hook');
  if (hook) {
    const acts = $$('.rail__acts li'), secs = $$('[data-act]');
    const upd = () => {
      const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? clamp(scrollY / max) : 0;
      hook.style.top = p * 100 + '%';
      let act = 0; secs.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.5) act = +s.dataset.act; });
      acts.forEach((li, i) => li.classList.toggle('is-on', i === act));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ═══════════════ scramble ═══════════════ */
  const GLY = '01<>{}[]/*+=;:#·';
  XM.scramble = (el) => {
    const final = el.dataset.text || (el.dataset.text = el.textContent); let f = 0; const total = 24;
    clearInterval(el._s);
    el._s = setInterval(() => {
      el.textContent = final.split('').map((c, i) => (c === ' ' ? ' ' : i < (f / total) * final.length ? c : GLY[(Math.random() * GLY.length) | 0])).join('');
      if (++f > total) { clearInterval(el._s); el.textContent = final; }
    }, 36);
  };
  if (!RM) { const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { XM.scramble(e.target); so.unobserve(e.target); } }), { threshold: 0.6 }); $$('[data-scramble]').forEach((el) => so.observe(el)); }

  /* ═══════════════ magnetic ═══════════════ */
  if (FINE && !RM) $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`; });
    el.addEventListener('pointerleave', () => { el.style.transition = 'translate .5s cubic-bezier(.2,.8,.2,1), background .3s, box-shadow .3s'; el.style.translate = ''; setTimeout(() => (el.style.transition = ''), 500); });
  });

  /* ═══════════════ image slots ═══════════════ */
  $$('.slot[data-img]').forEach((s) => XM.loadImg('img/' + s.dataset.img).then((im) => { im.alt = ($(':scope > span', s) || {}).textContent || ''; s.prepend(im); s.classList.add('has-img'); }).catch(() => {}));

  /* ═══════════════ toast ═══════════════ */
  XM.toast = (html) => {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = html; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('is-on'), 3400);
  };


  /* ═══════════════ cursor trail: you leave dots behind ═══════════════ */
  if (FINE && !RM) {
    const tc = document.createElement('canvas'); tc.className = 'trail'; document.body.appendChild(tc);
    let f = XM.fit(tc); addEventListener('resize', () => (f = XM.fit(tc)));
    const marks = []; let lx = -1, ly = -1, lt = 0;
    XM.loop((t) => {
      const dt = Math.min(0.05, t - lt || 0.016); lt = t;
      const { x, y } = XM.ptr;
      if (x > -999) {
        if (lx < 0) { lx = x; ly = y; }
        const d = Math.hypot(x - lx, y - ly);
        for (let k = 14; k <= d; k += 14) marks.push({ x: lx + ((x - lx) * k) / d + (Math.random() - 0.5) * 6, y: ly + ((y - ly) * k) / d + (Math.random() - 0.5) * 6, life: 1, s: 2 + Math.random() * 3 });
        if (d >= 14) { lx = x; ly = y; }
      }
      const { ctx, w, h } = f; ctx.clearRect(0, 0, w, h);
      for (let i = marks.length - 1; i >= 0; i--) {
        const m = marks[i]; m.life -= dt * 1.5; m.y += dt * 14;
        if (m.life <= 0) { marks.splice(i, 1); continue; }
        ctx.globalAlpha = m.life * 0.7; ctx.fillStyle = m.life > 0.7 ? '#ff6a45' : '#eeede8';
        const L = m.s * m.life; ctx.fillRect(m.x - L, m.y - 0.5, L * 2, 1); ctx.fillRect(m.x - 0.5, m.y - L, 1, L * 2);
      }
      ctx.globalAlpha = 1;
    });
  }

  /* ═══════════════ letters: split + decode ═══════════════ */
  const DGLY = '01<>{}[]/*+=;:#·_$%&';
  XM.chars = (el) => {
    const out = [];
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
          const wd = document.createElement('span'); wd.className = 'wd';
          [...w].forEach((c) => { const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c; ch.dataset.c = c; wd.appendChild(ch); out.push(ch); });
          f.appendChild(wd);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el); return out;
  };
  XM.decode = (chars, o = {}) => {
    if (!hasG() || RM) { chars.forEach((c) => (c.style.opacity = 1)); return; }
    const st = o.stagger || 0.022;
    return gsap.fromTo(chars, { opacity: 0, yPercent: o.y == null ? 70 : o.y, rotateX: -80, filter: 'blur(8px)' }, {
      opacity: 1, yPercent: 0, rotateX: 0, filter: 'blur(0px)', duration: o.duration || 0.9, ease: 'expo.out', delay: o.delay || 0,
      stagger: { each: st, onStart() { const ch = this.targets()[0]; let n = 0; clearInterval(ch._d); ch._d = setInterval(() => { ch.textContent = ++n > 6 ? ch.dataset.c : DGLY[(Math.random() * DGLY.length) | 0]; if (n > 6) clearInterval(ch._d); }, 38); } },
    });
  };
  XM.decodeOn = (el, start = 'top 85%', o) => {
    if (!el) return;
    const ch = XM.chars(el);
    if (!hasG() || !window.ScrollTrigger || RM) return;
    gsap.set(ch, { opacity: 0 });
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => XM.decode(ch, o) });
    return ch;
  };

  /* ═══════════════ curtain: the crane takes you to the next page ═══════════════ */
  const curtain = document.createElement('div'); curtain.className = 'curtain';
  curtain.innerHTML = '<i class="curtain__wire"></i><b class="curtain__god"></b><span class="curtain__t mono"></span>';
  document.body.appendChild(curtain);
  const ctT = curtain.querySelector('.curtain__t');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]'); if (!a || !hasG() || RM) return;
    const href = a.getAttribute('href');
    if (!/\.html(\?|#|$)/.test(href) || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    ctT.textContent = 'DESCEND.exe — ' + (a.textContent.trim().toLowerCase() || 'next');
    sessionStorage.setItem('xm-curtain', 1);
    gsap.timeline({ onComplete: () => (location.href = href) })
      .set(curtain, { visibility: 'visible' })
      .fromTo(curtain, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'expo.inOut' })
      .fromTo('.curtain__wire', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, '-=.2')
      .fromTo('.curtain__god', { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '<.1')
      .fromTo(ctT, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '<');
  });
  const arrived = sessionStorage.getItem('xm-curtain');
  if (arrived) {
    sessionStorage.removeItem('xm-curtain'); sessionStorage.setItem('xm-seen', 1);
    if (hasG() && !RM) { gsap.set(curtain, { visibility: 'visible', clipPath: 'inset(0 0 0% 0)' }); gsap.to(curtain, { clipPath: 'inset(100% 0 0% 0)', duration: 1, ease: 'expo.inOut', delay: 0.15, onComplete: () => gsap.set(curtain, { visibility: 'hidden' }) }); }
  }

  /* ═══════════════ loader: DESCEND.exe — the code scrolls until line 47 ═══════════════ */
  const SRC = [
    '// checkout.js — last touched friday, 17:58', "import { db } from './db.js';", "import { tax as TAX } from './config.js';", "import { log } from './utils/log.js';", '',
    'const CACHE = new Map();', 'let retries = 0; // don’t ask', '',
    'export async function loadCart(id) {', '  if (CACHE.has(id)) return CACHE.get(id);', '  const res = await db.carts.find({ id });', "  if (!res) throw new Error('cart not found');", '  CACHE.set(id, res.items);', '  return res.items;', '}', '',
    'function round(n) {', '  return Math.round(n * 100) / 100;', '}', '',
    '// TODO: refactor before launch (2021)', 'export function discount(cart, code) {', '  if (!code) return 0;', "  const pct = code === 'FRIDAY' ? 0.2 : 0.1;", '  return round(subtotal(cart) * pct);', '}', '',
    'function subtotal(cart) {', '  return cart.reduce((s, x) => s + x.price * x.qty, 0);', '}', '',
    'export async function checkout(id, code) {', '  const cart = await loadCart(id);', "  log('checkout', id, cart.length);", '  const off = discount(cart, code);', '  return round(total(cart, TAX) - off);', '}', '',
    '// it worked on friday.', 'export function total(cart, tax) {', '  let sum = 0;', '  const seen = new Set();', '  if (!cart.length) return 0;', '',
    '  // TODO: ask someone. anyone.', '  retries++;', '  for (let i = 0; i <= cart.length; i++) {',
  ];
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const KW = /\b(import|export|from|const|let|function|return|if|for|async|await|new|throw)\b/g;
  const paint = (t) => { const k = t.indexOf('//'), a = k < 0 ? t : t.slice(0, k), c = k < 0 ? '' : t.slice(k); return esc(a).replace(KW, '<u>$1</u>') + (c ? `<em>${esc(c)}</em>` : ''); };
  XM.codeLines = SRC;
  XM.ready = new Promise((res) => {
    const L = $('.loader');
    const done = () => { document.body.classList.remove('is-loading'); res(); };
    if (!L || !hasG()) { L && L.remove(); return done(); }
    if (RM || sessionStorage.getItem('xm-seen')) { L.remove(); return done(); }
    sessionStorage.setItem('xm-seen', 1);
    const nz = XM.glitch($('[data-loader-noise]', L), { always: true, amp: 0.25, bands: 6 });
    const gl = XM.glyph($('[data-loader-glyph]', L), { always: true, form: 0, scale: 0.24, spin: 0.9 });
    const pre = $('[data-loader-code]', L), t = $('[data-loader-t]', L), n = $('[data-loader-n]', L), box = $('.box', L), lab = $('b', box);
    const c = { v: 0 }, tc = { v: 0 };
    let last = -1;
    const draw = () => {
      const k = Math.min(SRC.length, c.v), full = Math.floor(k), frac = k - full;
      const key = full * 100 + Math.floor(frac * 20); if (key === last) return; last = key;
      let h = '';
      for (let i = Math.max(0, full - 30); i < full; i++) h += `<div${i === full - 1 ? ' class="is-cur"' : ''}><i>${String(i + 1).padStart(2, '0')}</i>${paint(SRC[i])}</div>`;
      if (full < SRC.length) { const ln = SRC[full]; h += `<div class="is-type"><i>${String(full + 1).padStart(2, '0')}</i>${esc(ln.slice(0, Math.round(ln.length * frac)))}<span class="caret"></span></div>`; }
      pre.innerHTML = h;
    };
    const lockBug = () => {
      const rows = $$('div', pre), row = rows[rows.length - 1];
      row.className = 'is-47'; row.innerHTML = row.innerHTML.replace('&lt;=', '<b data-bug>&lt;=</b>');
      const b = $('[data-bug]', row).getBoundingClientRect(), r = row.getBoundingClientRect();
      gsap.to(box, { left: r.left - 8, top: r.top - 6, width: r.width + 16, height: r.height + 12, duration: 0.3, ease: 'steps(4)' });
      gsap.to(box, { left: b.left - 10, top: b.top - 8, width: b.width + 20, height: b.height + 16, duration: 0.35, ease: 'steps(5)', delay: 0.4 });
      lab.textContent = 'line 47'; box.classList.add('is-lock');
      t.textContent = 'found it. line 47.';
    };
    gsap.set(box, { left: innerWidth * 0.06, top: innerHeight * 0.1, width: innerWidth * 0.88, height: innerHeight * 0.76, opacity: 0 });
    XM.loaderTL = gsap.timeline({ onComplete: () => L.remove() })
      .to(tc, { v: 4.2, duration: 4.2, ease: 'none', onUpdate: () => (n.textContent = XM.tc(tc.v)) }, 0)
      .to(c, { v: SRC.length, duration: 2.1, ease: 'power1.inOut', onUpdate: draw }, 0.1)
      .call(() => (t.textContent = 'reading 4,112 files'), null, 0.7)
      .to(box, { opacity: 1, duration: 0.15 }, 0.5)
      .call(() => (t.textContent = 'it’s not in the tests. it’s not in the config.'), null, 1.4)
      .to(nz, { amp: 1.3, duration: 1.4, ease: 'power1.in' }, 0.6)
      .call(lockBug, null, 2.25)
      .to(nz, { amp: 0.3, duration: 0.6 }, 2.3)
      .to(pre, { opacity: 0.22, duration: 0.6 }, 2.9)
      .to(gl, { form: 1, duration: 1, ease: 'expo.out' }, 2.9)
      .call(() => { const b = $('[data-bug]', pre); if (b) { b.textContent = '<'; b.classList.add('is-fixed'); } box.classList.add('is-ok'); lab.textContent = 'fixed'; t.textContent = 'enter, from above —'; }, null, 3.3)
      .to(gl, { tear: 1, duration: 0.12, yoyo: true, repeat: 3 }, 3.35)
      .to(gl, { burst: 2.6, duration: 0.6, ease: 'expo.out' }, 3.8)
      .fromTo('.loader__flash', { opacity: 0 }, { opacity: 1, duration: 0.07, yoyo: true, repeat: 1 }, 3.8)
      .to([box, pre], { opacity: 0, duration: 0.2 }, 3.8)
      .to(L, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut', onStart: done }, 3.95);
  });

  /* ═══════════════ tab title ═══════════════ */
  const title = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? 'act ii. it broke. come back.' : title; });

  /* ═══════════════ cookie line (it's theatre) ═══════════════ */
  const ck = $('[data-cookie]');
  if (ck) { if (XM.get('cookie')) ck.parentElement.classList.add('is-gone'); ck.addEventListener('click', () => { XM.set('cookie', 1); ck.parentElement.classList.add('is-gone'); XM.toast('cookies accepted. <b>for dramatic effect only.</b>'); }); }
  const nf = $('[data-news]');
  nf && nf.addEventListener('submit', (e) => { e.preventDefault(); nf.reset(); XM.toast('you’re in the cast. <b>one email per act.</b>'); });

  /* ═══════════════ konami: ascension ═══════════════ */
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', (e) => { ki = e.key === code[ki] ? ki + 1 : e.key === code[0] ? 1 : 0; if (ki === code.length) { ki = 0; XM.ascend(); } });
  XM.ascend = () => {
    document.body.classList.toggle('is-ascended');
    if (hasG() && !RM) for (let i = 0; i < 60; i++) {
      const m = document.createElement('i'); m.className = 'mote'; document.body.appendChild(m);
      gsap.fromTo(m, { x: Math.random() * innerWidth, y: innerHeight + 20, scale: 0.4 + Math.random() }, { y: -40, x: `+=${(Math.random() - 0.5) * 160}`, rotate: 90, duration: 2 + Math.random() * 2.5, delay: Math.random() * 1.5, ease: 'power1.out', onComplete: () => m.remove() });
    }
    XM.toast('<b>ASCENSION.exe</b> the god is pleased. everything goes up.');
    document.title = 'ASCENSION.exe';
  };

  /* ═══════════════ signature ═══════════════ */
  console.log('%c\n        ║\n        ║          /\\_/\\\n       _╨_        ( o.o )  <3\n      ( · )        > ^ <\n     · ·+· ·   EX-MACHINA · the god in your terminal\n       · ·\n\n  concept, design & code by ghostly.grl ♥\n  try XM.help()\n', 'color:#ff4f2e;font-family:monospace;font-size:12px');
  XM.help = () => console.log('XM.ask("my bug")  → ask deus (scripted, it’s a concept)\nXM.chat("how are you?") → small talk\nXM.ascend()       → ascension (or ↑↑↓↓←→←→ b a)\nXM.scramble(el)   → scramble any element');
  XM.ask = (q) => { const r = XM.oracle(q); console.log([r.enter, r.say, ...(r.diff || []), r.exit].filter(Boolean).join('\n')); };
})();
