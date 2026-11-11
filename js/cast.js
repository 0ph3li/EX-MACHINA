/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — cast.js (the cast / modes)
   concept, design & code by ghostly.grl ♥
   one god, six roles: a single cloud of dots changes costume
   (? { } # “ ✓ ☾) as you scroll; a red box follows the actor.
   the call sheet reads your clock and puts the right role on stage.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, clamp, lerp } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const WIDE = matchMedia('(min-width: 1001px)').matches;

  /* ═══════════════ the roles ═══════════════ */
  const ROLES = [
    { n: 'I', name: 'The Oracle', mode: 'ask', glyph: '?', does: 'answers anything about your codebase. it reads, it never writes.', best: 'onboarding, 2 a.m. archaeology, “who wrote this?”', never: 'touches a single file', line: '“you asked where the auth lives. it lives in three places. that’s the bug.”' },
    { n: 'II', name: 'The Mechanic', mode: 'fix', glyph: '{ }', does: 'finds the bug, writes the patch, proves it with a test.', best: 'stack traces, NaN, “it worked on friday”', never: 'fixes what isn’t broken', line: '“it’s line 47. hand me the <.”' },
    { n: 'III', name: 'The Architect', mode: 'plan', glyph: '#', does: 'writes the plan before the code, and refactors without knocking down the set.', best: 'new features, migrations, the big rewrite', never: 'types before you agree', line: '“three files, two steps, one migration. sign here.”' },
    { n: 'IV', name: 'The Critic', mode: 'review', glyph: '“', does: 'reads your pull request like opening night. leaves notes, not insults.', best: 'PRs, security smells, naming crimes', never: 'approves its own work', line: '“lovely function. terrible name. also, sql injection on line 12.”' },
    { n: 'V', name: 'The Chorus', mode: 'test', glyph: '✓', does: 'writes the tests nobody wrote. forty-eight voices, one verdict.', best: 'coverage, edge cases, the empty cart', never: 'mocks the thing it’s testing', line: '“we sing when it passes. we scream when it doesn’t.”' },
    { n: 'VI', name: 'The Understudy', mode: 'background', glyph: '☾', does: 'works while you sleep. you wake up to a pull request and a note.', best: 'chores, upgrades, the 400 lint warnings', never: 'merges. not even once.', line: '“go to bed. i’ve got the second act.”' },
  ];

  /* ═══════════════ noise + timecodes + title (same as the script page) ═══════════════ */
  const NZ = {};
  const NOPT = { sh: { bands: 7, ys: [0.4, 0.48, 0.56, 0.63, 0.7, 0.8, 0.9], amp: 0.8 }, cs: { bands: 6, amp: 0.45 }, next: { bands: 7, ys: [0.25, 0.38, 0.46, 0.55, 0.62, 0.72, 0.85], amp: 0.7 }, ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 } };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));
  const tcs = $$('[data-tc]').map((el, i) => ({ el, off: [301.2, 47][i] || 0, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + o.off); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));

  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: matchMedia('(min-width: 801px)').matches ? 0.2 : 0.24, spin: 0.2 });
  god.cx = matchMedia('(min-width: 801px)').matches ? 0.72 : 0.5; god.cy = 0.58;
  const shBox = $('.sh__box');
  let ri = 0;
  const track = () => { const p = god.pick(), s = 50 + Math.random() * 70; XM.box(shBox, { x: p.x - s / 2, y: p.y - s / 2, w: s, h: s * 0.8 }); shBox.firstChild.textContent = ROLES[ri++ % 6].name.toLowerCase(); };
  let trackT = setInterval(track, 1500);
  const split = $$('[data-split]').map((el) => XM.chars(el));
  if (MOTION) {
    gsap.set(split.flat(), { opacity: 0 });
    gsap.timeline({ delay: 0.25 })
      .to(god, { form: 1, duration: 2, ease: 'expo.out' }, 0)
      .fromTo(god, { tear: 1.2 }, { tear: 0, duration: 1.3 }, 0)
      .add(() => XM.decode(split[0], { stagger: 0.07, duration: 1.1, y: 90 }), 0.1)
      .add(() => XM.decode(split[1], { stagger: 0.06, duration: 1.1, y: 90 }), 0.3)
      .from('.sh__slash', { scaleY: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
      .from('.sh__sub, .sh__file, .sh__down', { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.sh .hero__v, .sh .hero__tc', { x: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6);
    gsap.timeline({ scrollTrigger: { trigger: '.sh', start: 'top top', end: 'bottom top', scrub: 0.8, onLeave: () => clearInterval(trackT), onEnterBack: () => { clearInterval(trackT); trackT = setInterval(track, 1500); } } })
      .to(god, { burst: 1, scale: 0.34, ease: 'power1.in' }, 0)
      .to('.sh__a', { xPercent: -40, opacity: 0 }, 0).to('.sh__b', { xPercent: 30, opacity: 0 }, 0);
  }

  /* ═══════════════ the morph: one cloud of dots, six costumes ═══════════════ */
  const cv = $('[data-morph]');
  const N = WIDE ? 1500 : 950;
  const P = Array.from({ length: N }, () => ({ fx: (Math.random() - 0.5) * 2, fy: (Math.random() - 0.5) * 2, tx: 0, ty: 0, x: 0, y: 0, ox: 0, oy: 0, s: Math.random(), z: Math.random(), red: Math.random() < 0.035 }));
  const st = { m: 1, k: -1, shapes: [] };
  let ctx, W, H; const size = () => { const f = XM.fit(cv); ctx = f.ctx; W = f.w; H = f.h; }; size();
  addEventListener('resize', size);
  const sample = (g) => {
    const S = 280, oc = document.createElement('canvas'); oc.width = oc.height = S;
    const o = oc.getContext('2d', { willReadFrequently: true });
    o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle';
    const fs = g === '“' ? 420 : g.length > 1 ? 190 : 250;
    o.font = `400 ${fs}px Gloock, "Times New Roman", serif`;
    o.fillText(g, S / 2, S / 2 + (g === '“' ? 70 : 6));
    // crop to the ink and centre it, so every costume sits in the same spot
    const d = o.getImageData(0, 0, S, S).data, pts = [];
    let x0 = S, y0 = S, x1 = 0, y1 = 0;
    for (let y = 0; y < S; y += 3) for (let x = 0; x < S; x += 3) if (d[(y * S + x) * 4 + 3] > 120) { pts.push([x, y]); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sc = Math.max(x1 - x0, y1 - y0) || 1;
    for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return pts.map(([x, y]) => [(x - cx) / sc, (y - cy) / sc]);
  };
  const build = () => { st.shapes = ROLES.map((r) => sample(r.glyph)); };
  st.set = (k) => {
    if (k === st.k || !st.shapes.length) return;
    st.k = k; const sh = st.shapes[k];
    P.forEach((p, i) => { p.fx = p.x; p.fy = p.y; const q = sh[i % sh.length]; p.tx = q[0] + (Math.random() - 0.5) * 0.008; p.ty = q[1] + (Math.random() - 0.5) * 0.008; });
    if (G && !RM) gsap.fromTo(st, { m: 0 }, { m: 1, duration: 1.3, ease: 'power2.inOut', overwrite: true }); else st.m = 1;
  };
  const PX = new Float32Array(N), PY = new Float32Array(N);
  st.pick = () => { const k = (Math.random() * N) | 0; return { x: PX[k], y: PY[k] }; };
  XM.watch(cv);
  XM.loop((t) => {
    if (!cv._vis || !ctx) return;
    ctx.clearRect(0, 0, W, H);
    const r = cv.getBoundingClientRect(), mx = XM.ptr.x - r.left, my = XM.ptr.y - r.top;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.62;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.9);
    g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(0.5, 'rgba(205,214,255,.04)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N; i++) {
      const p = P[i];
      const e0 = clamp(st.m * 1.5 - p.s * 0.5), e = e0 < 0.5 ? 4 * e0 * e0 * e0 : 1 - Math.pow(-2 * e0 + 2, 3) / 2;
      const fly = Math.sin(e0 * Math.PI) * 0.35 * (0.4 + p.z); // mid-change, the dots fly out like a quick costume change
      p.x = lerp(p.fx, p.tx, e); p.y = lerp(p.fy, p.ty, e);
      let x = cx + (p.x + Math.cos(p.s * 40) * fly) * R, y = cy + (p.y + Math.sin(p.s * 40) * fly) * R;
      x += Math.sin(t * 0.8 + p.s * 30) * 1.4; y += Math.cos(t * 0.7 + p.s * 20) * 1.4;
      const dx = x - mx, dy = y - my, dd = dx * dx + dy * dy;
      let tx = 0, ty = 0; if (dd < 14400) { const dist = Math.sqrt(dd) || 1, f = 1 - dist / 120; tx = (dx / dist) * f * f * 34; ty = (dy / dist) * f * f * 34; }
      tx += XM.vel * (p.s - 0.5) * 30;
      p.ox += (tx - p.ox) * 0.15; p.oy += (ty - p.oy) * 0.15;
      x += p.ox; y += p.oy; PX[i] = x; PY[i] = y;
      const tw = 0.6 + 0.4 * Math.sin(t * 2.2 + p.s * 60);
      ctx.fillStyle = p.red ? `rgba(255,70,50,${0.9 * tw})` : `rgba(255,255,255,${(0.35 + p.z * 0.6) * tw})`;
      const d = 1.1 + p.z * 1.7;
      ctx.fillRect(x - d / 2, y - d / 2, d, d);
    }
    ctx.globalCompositeOperation = 'source-over';
    XM.tear(ctx, cv, Math.sin(clamp(st.m) * Math.PI) * 0.9 + Math.abs(XM.vel) * 0.2, t);
  });

  /* ═══════════════ casting: scroll changes the role ═══════════════ */
  const lis = $$('[data-list] li'), shots = $$('.cs__shot'), csBox = $('[data-cs-box]'), stage = $('.cs__stage');
  const F = { n: $('[data-role-n]'), name: $('[data-name]'), does: $('[data-does]'), best: $('[data-best]'), never: $('[data-never]'), line: $('[data-line]'), mode: $('[data-mode]'), count: $('[data-cs-n]') };
  let role = -1, lineT = null;
  const typeLine = (s) => { clearInterval(lineT); if (RM) { F.line.textContent = s; return; } let i = 0; F.line.textContent = ''; lineT = setInterval(() => { F.line.textContent = s.slice(0, ++i); if (i >= s.length) clearInterval(lineT); }, 24); };
  const setRole = (k) => {
    if (k === role) return; role = k; const R = ROLES[k];
    st.set(k);
    lis.forEach((li, i) => li.classList.toggle('is-on', i === k));
    shots.forEach((s, i) => s.classList.toggle('is-on', i === k));
    F.n.textContent = 'ROLE ' + R.n; F.mode.textContent = R.mode; F.count.textContent = '0' + (k + 1);
    F.name.textContent = R.name; F.does.textContent = R.does; F.best.textContent = R.best; F.never.textContent = R.never;
    if (MOTION) { const ch = XM.chars(F.name); XM.decode(ch, { stagger: 0.03, duration: 0.8, y: 60 }); gsap.fromTo([F.does, '.cs__dl'], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }); }
    typeLine(R.line);
    csBox.firstChild.textContent = R.name.toLowerCase();
    if (NZ.cs && G) gsap.fromTo(NZ.cs, { amp: 1.8 }, { amp: 0.45, duration: 1 });
  };
  // the red box follows the actor around the stage
  setInterval(() => {
    if (!stage._vis) return;
    const p = st.pick(), s = 60 + Math.random() * 90;
    XM.box(csBox, { x: clamp(p.x - s / 2, 0, stage.clientWidth - s), y: clamp(p.y - s / 2, 0, stage.clientHeight - s), w: s, h: s * (0.7 + Math.random() * 0.4) });
  }, 1400);
  XM.watch(stage);
  (document.fonts ? document.fonts.load('250px Gloock').then(() => document.fonts.ready) : Promise.resolve()).then(() => { build(); P.forEach((p) => { p.x = p.fx; p.y = p.fy; }); st.k = -1; const k = role < 0 ? 0 : role; role = -1; setRole(k); });

  let pinST = null;
  if (MOTION) {
    pinST = ScrollTrigger.create({ trigger: '.cs__pin', start: 'top top', end: '+=500%', pin: true, scrub: true, onUpdate: (s) => setRole(Math.min(5, Math.floor(s.progress * 6))) });
  } else setRole(0);
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const k = +b.dataset.go;
    if (pinST && XM.lenis) XM.lenis.scrollTo(pinST.start + (pinST.end - pinST.start) * ((k + 0.5) / 6), { duration: 1.4 });
    else setRole(k);
  }));
  cv.addEventListener('click', () => { if (G) { gsap.fromTo(st, { m: 0.35 }, { m: 1, duration: 1, ease: 'power2.out' }); } XM.toast(`<b>${ROLES[Math.max(0, role)].name.toLowerCase()}</b> takes a bow. it’s still deus underneath.`); });

  /* ═══════════════ call sheet: your clock decides who’s on ═══════════════ */
  const now = $('[data-now]'), rows = $$('[data-call] li');
  const onNow = () => {
    const d = new Date(), h = d.getHours();
    now.textContent = `${String(h).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    rows.forEach((li) => { const a = +li.dataset.from, b = +li.dataset.to, on = a < b ? h >= a && h < b : h >= a || h < b; li.classList.toggle('is-now', on); });
  };
  onNow(); setInterval(onNow, 30000);
  if (MOTION) {
    gsap.from('.call__h span', { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.call', start: 'top 70%' } });
    gsap.from(rows, { x: -30, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.call__list', start: 'top 80%' } });
    gsap.from('.next__a span', { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
    const word = $('.ft__word');
    if (word) gsap.from(XM.chars(word), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }

  addEventListener('load', () => ST && ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
