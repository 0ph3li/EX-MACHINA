/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — home.js (v2)
   concept, design & code by ghostly.grl ♥
   01 hero: deus (a dotted star) glows in the noise, red boxes track it
   02 act iii: the boxes hunt the bug, the god comes down, <= becomes <
   03 the five acts: cards slide sideways
   04 talk to deus: mic + speech, small talk in english and italiano
   05 the end: her black hole eats the title
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, clamp, lerp } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const WIDE = matchMedia('(min-width: 801px)').matches;

  /* ═══════════════ the noise bands, everywhere ═══════════════ */
  const NZ = {};
  const NOPT = {
    hero: { bands: 8, ys: [0.36, 0.43, 0.5, 0.58, 0.64, 0.72, 0.8, 0.9], amp: 0.9 },
    tr: { bands: 7, amp: 0.55 },
    acts: { bands: 6, amp: 0.45 },
    talk: { bands: 7, ys: [0.3, 0.42, 0.5, 0.56, 0.62, 0.74, 0.86], amp: 0.6 },
    ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 },
  };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));

  /* ═══════════════ timecodes run, the date is today ═══════════════ */
  const tcs = $$('[data-tc]').map((el, i) => ({ el, off: [174.5, 47, 2.3, 0][i] || 0, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + o.off); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));
  const d = new Date(), z = (n) => String(n).padStart(2, '0');
  $$('[data-date]').forEach((el) => (el.textContent = `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()}`));

  /* ═══════════════ 01 · hero: deus, tracked ═══════════════ */
  const hero = $('.hero');
  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: WIDE ? 0.29 : 0.3, spin: 0.22 });
  god.cy = WIDE ? 0.6 : 0.52;
  const hb = $$('[data-boxes] .box');
  const LAB = ['bug_047', 'null?', '<=', 'race', 'any', 'todo', 'undefined', 'off by 1', 'deus', 'line 47', 'NaN', 'merge'];
  let hunting = false;
  const hunt = (el, i) => {
    if (!hunting) return;
    const p = god.pick(), s = 44 + Math.random() * 96;
    el.firstChild.textContent = LAB[(Math.random() * LAB.length) | 0];
    XM.box(el, { x: p.x - s / 2, y: p.y - s * 0.4, w: s, h: s * (0.65 + Math.random() * 0.5) });
    el._t = setTimeout(() => hunt(el, i), 1300 + Math.random() * 1400);
  };
  const startHunt = () => { if (hunting) return; hunting = true; hb.forEach((el, i) => { if (G) gsap.to(el, { opacity: 1, duration: 0.2, delay: i * 0.25 }); else el.style.opacity = 1; el._t = setTimeout(() => hunt(el, i), i * 380); }); };
  const stopHunt = () => { hunting = false; hb.forEach((el) => clearTimeout(el._t)); };

  // the title: letters arrive scrambled, the star spins in
  const split = $$('[data-split]').map((el) => XM.chars(el));
  XM.ready.then(() => {
    if (!MOTION) { startHunt(); return; }
    const all = split.flat();
    gsap.set(all, { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(god, { form: 1, duration: 2.2, ease: 'expo.out' }, 0)
      .fromTo(god, { tear: 1.2 }, { tear: 0, duration: 1.4, ease: 'power2.out' }, 0)
      .add(() => XM.decode(split[0], { stagger: 0.08, duration: 1.2, y: 90 }), 0.15)
      .add(() => XM.decode(split[1], { stagger: 0.05, duration: 1.2, y: 90 }), 0.35)
      .from('.hero__slash', { scaleY: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
      .from('.hero__star', { scale: 0, rotate: -270, duration: 1.4, ease: 'expo.out' }, 0.8)
      .from('.hero__exe, .hero__date', { x: -30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.hero__v, .hero__tc', { x: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.hero__foot > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.8)
      .from('.hero__icons a', { y: 14, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'steps(4)' }, 1.2)
      .add(startHunt, 1.1);
  });
  // leave the hero: the boxes rest, the star grows and comes apart, the title splits
  if (MOTION) {
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onLeave: stopHunt, onEnterBack: startHunt });
    gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      .to(god, { scale: WIDE ? 0.42 : 0.45, burst: 1.1, ease: 'power1.in' }, 0)
      .to('.hero__ex', { xPercent: -60, opacity: 0, ease: 'power1.in' }, 0)
      .to('.hero__machina', { xPercent: 30, opacity: 0, ease: 'power1.in' }, 0)
      .to('.hero__slash, .hero__star', { opacity: 0 }, 0)
      .to(NZ.hero || {}, { shift: 0.3, amp: 1.8 }, 0);
  }
  // click: the god glitches, the boxes all jump on it
  hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    if (!G) return;
    gsap.fromTo(god, { burst: 0.7, tear: 1.4 }, { burst: 0, tear: 0, duration: 1.1, ease: 'expo.out' });
    NZ.hero && gsap.fromTo(NZ.hero, { amp: 2.6 }, { amp: 0.9, duration: 1.2 });
    const c = god.center();
    hb.forEach((el, i) => { el.firstChild.textContent = ['locked', 'deus', 'line 47'][i]; XM.box(el, { x: c.x - c.r * (0.5 + i * 0.25), y: c.y - c.r * (0.5 + i * 0.25), w: c.r * (1 + i * 0.5), h: c.r * (1 + i * 0.5) }, { d: 0.3 }); });
  });

  /* ═══════════════ 02 · act iii: the boxes hunt the bug ═══════════════ */
  const code = $('[data-code]');
  if (code) {
    const T = {}; $$('[data-t]', code).forEach((el) => (T[el.dataset.t] = el));
    const hunters = $$('[data-hunt]', code).map((el, i) => (el.classList.add('lab-' + i), el)), bug = T.bug, err = $('[data-err]', code), errTxt = err.textContent;
    const state = $('[data-tr-state]'), tests = $('[data-tests]'), steps = $$('[data-steps] li'), wire = $('.tr__wire', code);
    const trGod = XM.glyph($('[data-tr-god]'), { scale: 0.36, spin: 0.9, dot: 1.4 });
    const ROUTE = [['sum', 'price', 'len'], ['todo', 'set', 'tax'], ['tax', 'fn', 'price']];
    const LOCK = ['line 47', '<=', 'off by one'];
    const rectOf = (el, pad = 6) => { const r = el.getBoundingClientRect(), c = code.getBoundingClientRect(); return { x: r.left - c.left - pad, y: r.top - c.top - pad * 0.6, w: r.width + pad * 2, h: r.height + pad * 1.2 }; };
    let stage = -1, fixed = false, found = false;
    const render = (p) => {
      // which hop are we on
      const st2 = p < 0.06 ? -1 : p < 0.58 ? Math.min(2, Math.floor(((p - 0.06) / 0.52) * 3)) : 3;
      if (st2 !== stage) {
        stage = st2;
        hunters.forEach((el, i) => {
          if (stage < 0) { if (G) gsap.to(el, { opacity: 0, duration: 0.2 }); return; }
          el.style.opacity = 1;
          const tgt = stage === 3 ? bug : T[ROUTE[i][stage]];
          const rc = rectOf(tgt, stage === 3 ? 8 + i * 9 : 6);
          el.firstChild.textContent = stage === 3 ? LOCK[i] : ROUTE[i][stage];
          XM.box(el, rc, { delay: i * 0.08 });
          el.classList.toggle('is-lock', stage === 3);
        });
      }
      const isFound = p >= 0.58, isFixed = p >= 0.82;
      if (isFound !== found) {
        found = isFound;
        if (found && G) { gsap.fromTo(code, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, .3)' }); NZ.tr && gsap.fromTo(NZ.tr, { amp: 2.2 }, { amp: 1, duration: 0.8 }); }
      }
      if (isFixed !== fixed) {
        fixed = isFixed;
        bug.textContent = fixed ? '<' : '<=';
        bug.classList.toggle('is-fixed', fixed);
        err.textContent = fixed ? '// 48 tests passed. go home.' : errTxt;
        err.classList.toggle('is-ok', fixed);
        hunters.forEach((el, i) => { el.classList.toggle('is-ok', fixed); el.firstChild.textContent = fixed ? ['fixed', '<', 'resolved'][i] : LOCK[i]; });
        if (fixed && G) { gsap.fromTo('.tr__flash', { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'power2.out' }); gsap.fromTo(trGod, { burst: 0.9 }, { burst: 0, duration: 1.2, ease: 'expo.out' }); }
      }
      state.textContent = fixed ? 'FIXED' : found ? 'FOUND' : 'SEARCHING';
      tests.textContent = `tests ${Math.round(clamp((p - 0.82) / 0.12) * 48)}/48`;
      tests.classList.toggle('is-ok', p >= 0.94);
      const si = p < 0.06 ? 0 : p < 0.58 ? 1 : p < 0.82 ? 2 : 3;
      steps.forEach((li, i) => li.classList.toggle('is-on', i === si));
      // the god on its wire, lowered onto the bug
      const br = rectOf(bug, 0), e = 1 - Math.pow(1 - clamp((p - 0.6) / 0.2), 3);
      wire.style.left = br.x + br.w / 2 - 35 + 'px';
      wire.style.top = br.y - 30 + 'px';
      wire.style.transform = `translateY(${-(1 - e) * innerHeight * 1.1}px)`;
      if (NZ.tr && !G) NZ.tr.amp = 0.5;
      if (NZ.tr) NZ.tr.amp = fixed ? 0.25 : 0.5 + clamp((p - 0.06) / 0.52) * 0.9;
    };
    if (MOTION) {
      ScrollTrigger.create({ trigger: '.tr__pin', start: 'top top', end: '+=280%', pin: true, scrub: true, onUpdate: (s) => render(s.progress), onRefresh: (s) => { stage = -1; render(s.progress); } });
      gsap.from('.tr__h span', { yPercent: 100, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.tr', start: 'top 70%' } });
      gsap.from('.tr__code', { opacity: 0, filter: 'blur(10px)', duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '.tr', start: 'top 60%' } });
    } else { render(0.3); render(1); }
    code.addEventListener('click', () => XM.toast('it’s line 47. <b>it’s always line 47.</b>'));
    addEventListener('resize', () => { stage = -1; });
  }

  /* ═══════════════ 03 · the five acts, sideways ═══════════════ */
  const track = $('[data-track]'), actN = $('[data-act-n]');
  if (track && MOTION && WIDE) {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 40);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.acts__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => (actN.textContent = '0' + (1 + Math.round(s.progress * 4))) } });
    const cards = $$('.card', track);
    XM.loop(() => { const sk = clamp(XM.vel, -1, 1) * -4; cards.forEach((c) => (c.style.transform = `skewX(${sk.toFixed(2)}deg)`)); });
  }
  if (MOTION) {
    $$('.card').forEach((c, i) => {
      const b = $('.box', c);
      gsap.to(b, { x: () => (Math.random() - 0.5) * 40, y: () => (Math.random() - 0.5) * 30, duration: 1.4 + i * 0.2, ease: 'steps(3)', repeat: -1, repeatRefresh: true });
      gsap.from(c, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', delay: WIDE ? i * 0.08 : 0, scrollTrigger: { trigger: WIDE ? '.acts__pin' : c, start: 'top 80%' } });
    });
  }
  $$('[data-decode]').forEach((el) => XM.decodeOn(el, 'top 82%', { stagger: 0.018 }));

  /* ═══════════════ 04 · talk to deus ═══════════════ */
  const talk = $('.talk');
  const orb = XM.sphere($('[data-orb]'), { n: 1300, scale: 0.36, warm: 0, cold: true, spin: 0.18, dot: 1.15, form: MOTION ? 0 : 1 });
  if (MOTION) {
    gsap.to(orb, { form: 1, duration: 2.4, ease: 'power3.inOut', scrollTrigger: { trigger: talk, start: 'top 55%' } });
    gsap.from('.talk__h span:first-child', { xPercent: -40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: talk, start: 'top 65%' } });
    gsap.from('.talk__h span:last-child', { xPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: talk, start: 'top 65%' } });
    gsap.from('.talk__ctrl > *, .talk__out', { y: 26, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.talk__orb', start: 'top 70%' } });
  }
  const sub = $('[data-sub]'), you = $('[data-you]'), mic = $('[data-mic]'), mb = $('[data-mic-btn]'), typeF = $('[data-type]');
  const boxL = $('[data-box-l]'), tState = $('[data-talk-state]');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition, bin = $('[data-bin]');
  let rec = null, state = 'idle', heard = '';
  const setState = (s) => {
    state = s; mic.setAttribute('aria-pressed', s === 'listening' ? 'true' : 'false');
    talk.dataset.state = s;
    $('span', mb).textContent = s === 'listening' ? 'listening… tap to stop' : s === 'speaking' ? 'stop' : 'speak with deus';
    boxL.textContent = { idle: 'idle', listening: 'listening', thinking: 'parsing', speaking: 'deus' }[s];
    tState.textContent = { idle: 'LISTENING FOR YOU', listening: 'LISTENING', thinking: 'THINKING', speaking: 'SPEAKING' }[s];
    if (G) { gsap.to(orb, { amp: s === 'idle' ? 0 : s === 'thinking' ? 0.4 : 1, duration: 0.6 }); NZ.talk && gsap.to(NZ.talk, { amp: s === 'idle' ? 0.6 : 1.5, duration: 0.6 }); }
  };
  // deus speaks binary: every letter is 8 bits, played as 4 blips (2 bits each → 4 pitches),
  // like a modem with feelings. the subtitle decodes the bits into words as it goes
  let ac = null, voiceNodes = null, talking = null;
  const CH = 0.052, F = [440, 660, 990, 1480];
  const bits = (ch) => (ch.charCodeAt(0) & 255).toString(2).padStart(8, '0');
  const hush = () => {
    if (voiceNodes) { try { voiceNodes.forEach((n) => n.stop()); } catch (e) {} voiceNodes = null; }
    if (talking) { clearInterval(talking.iv); talking.done(); talking = null; }
  };
  const sing = (text) => {
    if (!XM.get('voice', true)) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = ac || new AC(); ac.resume && ac.resume();
    const t0 = ac.currentTime + 0.05, end = t0 + text.length * CH;
    const out = ac.createGain(); out.gain.value = 0.9; out.connect(ac.destination);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.connect(out);
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; g.gain.value = 0; o.connect(g); g.connect(lp);
    const hum = ac.createOscillator(), hg = ac.createGain(); hum.type = 'triangle'; hum.frequency.value = 55; hg.gain.setValueAtTime(0, t0); hg.gain.linearRampToValueAtTime(0.05, t0 + 0.2); hg.gain.setValueAtTime(0.05, end); hg.gain.linearRampToValueAtTime(0, end + 0.3); hum.connect(hg); hg.connect(out);
    [...text].forEach((ch, i) => {
      const at = t0 + i * CH;
      if (/\s/.test(ch)) { g.gain.setValueAtTime(0, at); return; }
      const b = bits(ch);
      for (let j = 0; j < 4; j++) {
        const tt = at + (j * CH) / 4;
        o.frequency.setValueAtTime(F[parseInt(b.substr(j * 2, 2), 2)] * (/[.!?,]/.test(ch) ? 0.5 : 1), tt);
        g.gain.setValueAtTime(0.045, tt); g.gain.setValueAtTime(0, tt + (CH / 4) * 0.72);
      }
    });
    o.start(t0); hum.start(t0); o.stop(end + 0.05); hum.stop(end + 0.4);
    voiceNodes = [o, hum];
  };
  const speak = (text) => new Promise((res) => {
    hush();
    sing(text);
    if (RM) { sub.textContent = text; bin.textContent = ''; return res(); }
    let i = 0; const one = () => (Math.random() < 0.5 ? '0' : '1');
    talking = { done: res };
    talking.iv = setInterval(() => {
      i++;
      // the last few letters are still bits, the rest has decoded into english
      sub.textContent = text.slice(0, Math.max(0, i - 3)) + [...text.slice(Math.max(0, i - 3), i)].map((c) => (c === ' ' ? ' ' : one())).join('');
      const word = text.slice(0, i).split(' ').pop();
      bin.textContent = [...word.slice(-3)].map(bits).join(' ');
      if (G && text[i - 1] !== ' ') gsap.fromTo(orb, { pulse: 0.7 }, { pulse: 0, duration: 0.2, overwrite: 'auto' });
      if (i >= text.length) { clearInterval(talking.iv); sub.textContent = text; bin.textContent = ''; const d = talking.done; talking = null; d(); }
    }, CH * 1000);
  });
  const answer = async (q) => {
    q = (q || '').trim(); if (!q) { setState('idle'); return; }
    you.textContent = '“' + q + '”';
    setState('thinking');
    if (G) gsap.fromTo(orb, { burst: 0.5, pulse: 1 }, { burst: 0, pulse: 0, duration: 1, ease: 'expo.out' });
    const reply = XM.chat(q);
    await new Promise((r) => setTimeout(r, RM ? 0 : 650));
    setState('speaking');
    await speak(reply);
    setTimeout(() => state === 'speaking' && setState('idle'), 700);
  };
  const listen = () => {
    if (state === 'listening') { rec && rec.stop(); return; }
    if (state === 'speaking') { hush(); setState('idle'); return; }
    if (!SR) { XM.toast('this browser won’t lend me its ears. <b>type it instead.</b>'); typeF.q.focus(); return; }
    hush();
    rec = new SR(); rec.lang = navigator.language || 'en-US'; rec.interimResults = true; rec.maxAlternatives = 1;
    heard = ''; you.textContent = ''; sub.textContent = 'listening.';
    rec.onresult = (e) => {
      let txt = '', fin = false;
      for (let i = e.resultIndex; i < e.results.length; i++) { txt += e.results[i][0].transcript; if (e.results[i].isFinal) fin = true; }
      heard = txt; you.textContent = '“' + txt + '”';
      if (G) gsap.fromTo(orb, { pulse: 0.8 }, { pulse: 0, duration: 0.4 });
      if (fin) { rec.onend = null; rec.stop(); answer(heard); }
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') XM.toast('the mic is blocked. <b>allow it, or type below.</b>');
      else if (e.error === 'no-speech') sub.textContent = 'silence. the most honest bug report.';
      else XM.toast('i lost you (' + e.error + '). <b>type it instead.</b>');
    };
    rec.onend = () => { if (state === 'listening') heard ? answer(heard) : setState('idle'); };
    try { rec.start(); setState('listening'); } catch (err) { setState('idle'); }
    if (G) gsap.fromTo(orb, { burst: 0.9 }, { burst: 0, duration: 1.4, ease: 'expo.out' });
  };
  mic && mic.addEventListener('click', listen);
  mb && mb.addEventListener('click', listen);
  typeF && typeF.addEventListener('submit', (e) => { e.preventDefault(); const q = typeF.q.value; typeF.q.value = ''; answer(q); });
  $$('[data-say]').forEach((b) => b.addEventListener('click', () => answer(b.dataset.say)));
  const vt = $('[data-voice]');
  const paintV = () => { const on = XM.get('voice', true); vt.setAttribute('aria-pressed', on); vt.textContent = on ? 'sound on' : 'sound off'; };
  vt && (paintV(), vt.addEventListener('click', () => { XM.set('voice', !XM.get('voice', true)); if (!XM.get('voice', true) && voiceNodes) { try { voiceNodes.forEach((n) => n.stop()); } catch (e) {} voiceNodes = null; } paintV(); }));

  /* ═══════════════ 05 · the end: your code goes in (her black hole) ═══════════════ */
  const hole = $('[data-hole]'), swallow = { v: 0 };
  if (hole) {
    XM.watch(hole); let f;
    const size = () => (f = XM.fit(hole)); size(); addEventListener('resize', size);
    const TOK = ['const', 'let', '=>', '{', '}', '()', 'return', 'if', 'else', 'await', 'async', 'null', '[]', ';', 'fn', 'i++', '<=', '===', 'map', 'push', 'git', 'merge', 'main', 'fix:', 'export', 'import', '0', '1', 'true', 'TAX', 'cart', 'total', 'deus', '//', 'try', 'catch'];
    let bh = null; XM.loadImg('img/HOME/black-hole.jpg').then((im) => (bh = im)).catch(() => {});
    const TILT = -0.2, ct = Math.cos(TILT), stt = Math.sin(TILT);
    const P = []; const spawn = (p, fresh) => { p.r = fresh ? 0.12 + Math.random() * 1.4 : 1.05 + Math.random() * 0.5; p.th = fresh ? Math.random() * 6.283 : -0.9 + Math.random() * 1.2; p.tok = TOK[(Math.random() * TOK.length) | 0]; p.s = Math.random(); return p; };
    for (let i = 0; i < 380; i++) P.push(spawn({}, true));
    const stars = Array.from({ length: 60 }, () => [Math.random(), Math.random(), Math.random()]);
    let lt = 0;
    XM.loop((t) => {
      const dt = Math.min(0.05, t - lt || 0.016); lt = t;
      if (!hole._vis || !f) return;
      const { ctx, w, h } = f, cx = w * 0.4, cy = h * 0.6, Rw = Math.max(w, h) * 0.5;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      stars.forEach(([x, y, s]) => { ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.5 * s * (0.6 + 0.4 * Math.sin(t * 2 + s * 20))})`; ctx.fillRect(x * w, y * h, 1 + s, 1 + s); });
      if (bh) { // her photo: hole centre sits at (385, 383) of 735 × 782
        const k = (Rw * 1.05) / 735 * (1 + 0.012 * Math.sin(t * 0.8) + swallow.v * 0.1);
        ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(bh, cx - 385 * k, cy - 383 * k, 735 * k, 782 * k); ctx.globalCompositeOperation = 'source-over';
      } else {
        const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rw * 0.45);
        gg.addColorStop(0, 'rgba(255,120,60,.35)'); gg.addColorStop(0.35, 'rgba(255,79,46,.12)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg; ctx.fillRect(0, 0, w, h);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const p of P) {
        const sp = (RM ? 0 : 1) * (1 + Math.abs(XM.vel) * 4 + swallow.v * 3);
        p.r -= dt * (0.025 + 0.03 / p.r) * sp;
        p.th += dt * (0.12 / (p.r * p.r + 0.08)) * sp;
        if (p.r < 0.1) spawn(p, false);
        const ox = Math.cos(p.th) * p.r * Rw, oy = Math.sin(p.th) * p.r * Rw * 0.3, x = cx + ox * ct - oy * stt, y = cy + ox * stt + oy * ct;
        const al = clamp(1.35 - p.r) * clamp((p.r - 0.1) * 5);
        if (al <= 0.01 || x < -40 || x > w + 40) continue;
        const hot = clamp(1 - (p.r - 0.12) / 0.35);
        ctx.fillStyle = `rgba(255,${Math.round(lerp(240, 120, hot))},${Math.round(lerp(232, 70, hot))},${al * (0.3 + 0.5 * p.s)})`;
        ctx.font = `400 ${Math.round(7 + p.r * 10)}px "Geist Mono", monospace`;
        ctx.fillText(p.tok, x, y);
      }
    });
  }
  if (hole && MOTION) {
    const endH = $('.end__h'); endH.removeAttribute('data-scramble');
    const ch = XM.chars(endH);
    const toHole = (el) => { const r = el.getBoundingClientRect(), q = hole.getBoundingClientRect(); return { x: q.left + q.width * 0.4 - (r.left + r.width / 2), y: q.top + q.height * 0.6 - (r.top + r.height / 2) }; };
    gsap.set(ch, { opacity: 0 });
    ScrollTrigger.create({ trigger: '.end', start: 'top 60%', once: true, onEnter: () => XM.decode(ch, { stagger: 0.06, duration: 1.2 }) });
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.end', start: 'top 18%', end: 'bottom 70%', scrub: 1.2, invalidateOnRefresh: true } });
    ch.forEach((c, i) => tl.to(c, { x: () => toHole(c).x, y: () => toHole(c).y, scale: 0.05, rotate: 220 + i * 40, opacity: 0, ease: 'power3.in', duration: 1 }, i * 0.07));
    tl.to(swallow, { v: 1, duration: 0.6 }, 0.2).to('.end__copy p', { y: 60, opacity: 0, filter: 'blur(6px)', stagger: 0.1, duration: 0.6, ease: 'power2.in' }, 0.3);
    gsap.from('.end__copy p, .end__foot', { y: 18, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.end', start: 'top 60%' } });
  }

  /* ═══════════════ footer: the word rises out of the noise ═══════════════ */
  const word = $('.ft__word');
  if (word && MOTION) {
    const wc = XM.chars(word);
    gsap.from(wc, { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
    gsap.from('.ft__word i', { rotate: -360, scale: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }
  const touch = $('[data-touch]');
  touch && touch.addEventListener('submit', (e) => { e.preventDefault(); const n = (touch.name.value || 'stranger').trim().split(' ')[0]; touch.reset(); XM.toast(`noted, ${n.replace(/[<>&]/g, '')}. <b>deus will descend shortly.</b> (it won’t. it’s a concept.)`); });

  addEventListener('load', () => ST && ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
