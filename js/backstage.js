/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — backstage.js (about)
   concept, design & code by ghostly.grl ♥
   house rules: red boxes snap onto the key words as you read them ·
   the history slides along a wire with a hook riding it ·
   the stage door takes a note · the credits roll with the scroll.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const WIDE = matchMedia('(min-width: 901px)').matches;

  /* ═══════════════ noise, timecodes, title ═══════════════ */
  const NZ = {};
  const NOPT = { sh: { bands: 7, ys: [0.4, 0.48, 0.56, 0.63, 0.7, 0.8, 0.9], amp: 0.8 }, hr: { bands: 6, amp: 0.3 }, cr: { bands: 6, amp: 0.35 }, ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 } };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));
  const tcs = $$('[data-tc]').map((el) => ({ el, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + 1947); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));
  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: matchMedia('(min-width: 801px)').matches ? 0.2 : 0.24, spin: 0.2 });
  god.cx = matchMedia('(min-width: 801px)').matches ? 0.78 : 0.5; god.cy = 0.56;
  const shBox = $('.sh__box');
  const track = () => { const p = god.pick(), s = 50 + Math.random() * 70; XM.box(shBox, { x: p.x - s / 2, y: p.y - s / 2, w: s, h: s * 0.8 }); shBox.firstChild.textContent = ['crew', 'off duty', 'cables', 'no flash', '1947'][(Math.random() * 5) | 0]; };
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
  $$('[data-decode]').forEach((el) => XM.decodeOn(el, 'top 82%', { stagger: 0.018 }));

  /* ═══════════════ house rules: the box snaps onto the word you're reading ═══════════════ */
  $$('.hr__list li').forEach((li) => {
    if (!ST || RM) { li.classList.add('is-on'); return; }
    ScrollTrigger.create({ trigger: li, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-on' });
    gsap.from(li, { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 88%' } });
  });

  /* ═══════════════ history on a wire ═══════════════ */
  const hist = $('[data-hist]'), hook = $('[data-hist-hook]');
  if (hist && MOTION && WIDE) {
    const dist = () => Math.max(0, hist.scrollWidth - innerWidth + 60);
    gsap.to(hist, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.hist__pin', start: 'top top', end: () => '+=' + dist() * 1.1, pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => { hook.style.left = s.progress * (hist.scrollWidth - 200) + 'px'; } } });
    $$('.era', hist).forEach((e) => gsap.from($('.era__img', e), { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: '.hist__pin', start: 'top 60%' } }));
  }

  /* ═══════════════ stage door ═══════════════ */
  const door = $('[data-door]');
  door && door.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = (door.name.value || 'stranger').trim().split(' ')[0].replace(/[<>&]/g, '');
    door.reset();
    if (G && !RM) gsap.fromTo(door, { x: 0 }, { x: 40, opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => gsap.to(door, { x: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'expo.out' }) });
    XM.toast(`note slid under the door, ${n}. <b>the crew reads everything.</b> (it’s a concept. nobody does.)`);
  });
  if (MOTION) gsap.from('.door__h span', { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.door', start: 'top 70%' } });

  /* ═══════════════ the credits roll ═══════════════ */
  const roll = $('[data-roll]');
  if (roll && MOTION && WIDE) {
    const dist = () => roll.offsetHeight + innerHeight * 0.6;
    gsap.to(roll, { y: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.credits__pin', start: 'top top', end: () => '+=' + dist() * 1.2, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
  }
  if (MOTION) {
    const word = $('.ft__word'); if (word) gsap.from(XM.chars(word), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }

  addEventListener('load', () => ST && ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
