/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — script.js (the script / how it works)
   concept, design & code by ghostly.grl ♥
   title page: deus reads, a box tracks it · the play: a red box reads
   the screenplay with you, the still on the left changes per act,
   the terminal panels type themselves · numbers count · notes open
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, clamp } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const WIDE = matchMedia('(min-width: 801px)').matches;

  /* ═══════════════ noise + timecodes ═══════════════ */
  const NZ = {};
  const NOPT = { sh: { bands: 7, ys: [0.4, 0.48, 0.56, 0.63, 0.7, 0.8, 0.9], amp: 0.8 }, nums: { bands: 5, amp: 0.4 }, next: { bands: 7, ys: [0.25, 0.38, 0.46, 0.55, 0.62, 0.72, 0.85], amp: 0.7 }, ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 } };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));
  const tcs = $$('[data-tc]').map((el, i) => ({ el, off: [92.4, 0][i] || 0, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + o.off); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));

  /* ═══════════════ title page: deus, reading ═══════════════ */
  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: WIDE ? 0.2 : 0.24, spin: 0.2 });
  god.cx = WIDE ? 0.74 : 0.5; god.cy = WIDE ? 0.58 : 0.6;
  const shBox = $('.sh__box');
  const track = () => { const p = god.pick(), s = 50 + Math.random() * 70; XM.box(shBox, { x: p.x - s / 2, y: p.y - s / 2, w: s, h: s * 0.8 }); shBox.firstChild.textContent = ['reading', 'act i', 'plot', 'line 47', 'deus'][(Math.random() * 5) | 0]; };
  let trackT = setInterval(track, 1600);
  const split = $$('[data-split]').map((el) => XM.chars(el));
  if (MOTION) {
    gsap.set(split.flat(), { opacity: 0 });
    gsap.timeline({ delay: 0.25 })
      .to(god, { form: 1, duration: 2, ease: 'expo.out' }, 0)
      .fromTo(god, { tear: 1.2 }, { tear: 0, duration: 1.3 }, 0)
      .add(() => XM.decode(split[0], { stagger: 0.07, duration: 1.1, y: 90 }), 0.1)
      .add(() => XM.decode(split[1], { stagger: 0.05, duration: 1.1, y: 90 }), 0.3)
      .from('.sh__slash', { scaleY: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
      .from('.sh__sub, .sh__file, .sh__down', { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.sh .hero__v, .sh .hero__tc', { x: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6);
    gsap.timeline({ scrollTrigger: { trigger: '.sh', start: 'top top', end: 'bottom top', scrub: 0.8, onLeave: () => clearInterval(trackT), onEnterBack: () => { clearInterval(trackT); trackT = setInterval(track, 1600); } } })
      .to(god, { burst: 1, scale: 0.34, ease: 'power1.in' }, 0)
      .to('.sh__a', { xPercent: -40, opacity: 0 }, 0).to('.sh__b', { xPercent: 30, opacity: 0 }, 0);
  }

  /* ═══════════════ dramatis personae ═══════════════ */
  if (MOTION) gsap.from('.dp__list li', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.dp', start: 'top 75%' } });

  /* ═══════════════ the play: a red box reads with you ═══════════════ */
  const text = $('[data-text]'), reader = $('[data-reader]'), rows = $$('[data-r]', text), acts = $$('.act-s', text);
  const imgs = $$('.play__img'), idx = $$('[data-index] li'), stillL = $('[data-still-l]'), readP = $('[data-read]');
  let cur = -1, curAct = -1;
  const LAB = { scene: 'scene', dir: 'stage dir.', ln: 'line', panel: 'deus.log', 'curtain-line': 'end' };
  const typed = new WeakSet();
  const typePanel = (pre) => {
    if (typed.has(pre) || RM) return; typed.add(pre);
    const html = pre.innerHTML, lines = html.split('\n');
    pre.innerHTML = '';
    lines.forEach((l, i) => setTimeout(() => { pre.innerHTML += (i ? '\n' : '') + l; }, 140 + i * 260));
  };
  const read = () => {
    const mid = innerHeight * 0.48; let best = -1, bd = 1e9;
    rows.forEach((r, i) => { const b = r.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - mid); if (b.bottom > 0 && b.top < innerHeight && d < bd) { bd = d; best = i; } });
    if (best < 0 || best === cur) return;
    cur = best;
    rows.forEach((r, i) => r.classList.toggle('is-read', i <= best));
    const r = rows[best], tb = text.getBoundingClientRect(), rb = r.getBoundingClientRect();
    reader.style.opacity = 1;
    XM.box(reader, { x: rb.left - tb.left - 12, y: rb.top - tb.top - 10, w: rb.width + 24, h: rb.height + 20 }, { d: 0.32 });
    const k = Object.keys(LAB).find((c) => r.classList.contains(c));
    reader.firstChild.textContent = k ? LAB[k] : 'reading';
    if (r.hasAttribute('data-panel')) typePanel(r);
    readP.textContent = Math.round((best / (rows.length - 1)) * 100) + '%';
    const a = acts.indexOf(r.closest('.act-s'));
    if (a !== curAct) {
      curAct = a;
      imgs.forEach((im, i) => im.classList.toggle('is-on', i === a));
      idx.forEach((li, i) => li.classList.toggle('is-on', i === a));
      stillL.textContent = 'scene 0' + (a + 1);
      if (G) gsap.fromTo(imgs[a], { filter: 'brightness(2.2) contrast(1.4)', x: -8 }, { filter: 'brightness(1) contrast(1)', x: 0, duration: 0.6, ease: 'steps(5)' });
      const sb = $('.play__still-box');
      if (sb) XM.box(sb, { x: (0.08 + Math.random() * 0.3) * sb.parentElement.offsetWidth, y: (0.1 + Math.random() * 0.4) * sb.parentElement.offsetHeight, w: (0.3 + Math.random() * 0.3) * sb.parentElement.offsetWidth, h: (0.2 + Math.random() * 0.2) * sb.parentElement.offsetHeight });
    }
  };
  imgs[0] && imgs[0].classList.add('is-on'); idx[0] && idx[0].classList.add('is-on');
  addEventListener('scroll', read, { passive: true }); addEventListener('resize', () => { cur = -1; read(); });
  if (RM) rows.forEach((r) => r.classList.add('is-read'));
  if (MOTION) acts.forEach((a) => gsap.from($('.act-s__h h2', a), { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: a, start: 'top 75%' } }));

  /* ═══════════════ numbers count up ═══════════════ */
  $$('[data-count]').forEach((b) => {
    const to = +b.dataset.count, dec = +(b.dataset.dec || 0), fmt = (v) => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US'));
    if (!MOTION) { b.textContent = fmt(to); return; }
    const o = { v: 0 }; b.textContent = fmt(0);
    ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'expo.out', onUpdate: () => (b.textContent = fmt(o.v)) }) });
  });

  /* ═══════════════ notes: one open at a time ═══════════════ */
  const ds = $$('.notes details');
  ds.forEach((d) => d.addEventListener('toggle', () => { if (d.open) ds.forEach((o) => o !== d && (o.open = false)); }));
  if (MOTION) gsap.from('.notes__h span', { xPercent: -20, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.notes', start: 'top 70%' } });

  /* ═══════════════ next scene ═══════════════ */
  if (MOTION) gsap.from('.next__a span', { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
  const word = $('.ft__word');
  if (word && MOTION) gsap.from(XM.chars(word), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });

  addEventListener('load', () => ST && ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
