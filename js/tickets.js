/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — tickets.js (pricing, as a box office)
   concept, design & code by ghostly.grl ♥
   billing toggle (per show / season pass) and a ticket finder: four
   questions (team size, private code, nights, reviews) pick the plan,
   the live ticket adds it up and prints. no money moves.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, clamp, lerp } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const WIDE = matchMedia('(min-width: 801px)').matches;

  /* ═══════════════ noise, timecodes, title ═══════════════ */
  const NZ = {};
  const NOPT = { sh: { bands: 7, ys: [0.4, 0.48, 0.56, 0.63, 0.7, 0.8, 0.9], amp: 0.8 }, tk: { bands: 6, amp: 0.35 }, next: { bands: 7, ys: [0.25, 0.38, 0.46, 0.55, 0.62, 0.72, 0.85], amp: 0.7 }, ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 } };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));
  const tcs = $$('[data-tc]').map((el) => ({ el, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + 1260); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));
  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: WIDE ? 0.2 : 0.24, spin: 0.2 });
  god.cx = WIDE ? 0.78 : 0.5; god.cy = 0.56;
  const shBox = $('.sh__box');
  const track = () => { const p = god.pick(), s = 50 + Math.random() * 70; XM.box(shBox, { x: p.x - s / 2, y: p.y - s / 2, w: s, h: s * 0.8 }); shBox.firstChild.textContent = ['admit one', '$12', 'free', 'acts ∞', 'per seat'][(Math.random() * 5) | 0]; };
  let trackT = setInterval(track, 1500);
  const split = $$('[data-split]').map((el) => XM.chars(el));
  if (MOTION) {
    gsap.set(split.flat(), { opacity: 0 });
    gsap.timeline({ delay: 0.25 })
      .to(god, { form: 1, duration: 2, ease: 'expo.out' }, 0)
      .fromTo(god, { tear: 1.2 }, { tear: 0, duration: 1.3 }, 0)
      .add(() => XM.decode(split[0], { stagger: 0.06, duration: 1.1, y: 90 }), 0.1)
      .add(() => XM.decode(split[1], { stagger: 0.06, duration: 1.1, y: 90 }), 0.3)
      .from('.sh__slash', { scaleY: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
      .from('.sh__sub, .sh__file, .sh__down', { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.sh .hero__v, .sh .hero__tc', { x: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6);
    gsap.timeline({ scrollTrigger: { trigger: '.sh', start: 'top top', end: 'bottom top', scrub: 0.8, onLeave: () => clearInterval(trackT), onEnterBack: () => { clearInterval(trackT); trackT = setInterval(track, 1500); } } })
      .to(god, { burst: 1, scale: 0.34, ease: 'power1.in' }, 0)
      .to('.sh__a', { xPercent: -40, opacity: 0 }, 0).to('.sh__b', { xPercent: 20, opacity: 0 }, 0);
    gsap.from('.tix', { y: 80, rotate: (i) => [-3, 0, 3][i], opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.tk__list', start: 'top 80%' } });
    ['.seats__h span', '.find__q fieldset', '.prog__h span', '.notes__h span', '.next__a span'].forEach((s) => gsap.from(s, { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 85%' } }));
    gsap.from('.prog__t tbody tr', { opacity: 0, x: -20, duration: 0.7, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.prog__t', start: 'top 80%' } });
    const word = $('.ft__word'); if (word) gsap.from(XM.chars(word), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }

  /* ═══════════════ billing: per show / season pass ═══════════════ */
  const bills = $$('[data-bill]'), pill = $('.tk__pill'), prices = $$('[data-m]');
  let bill = 'm';
  const fmt = (v) => (v % 1 ? v.toFixed(2) : String(v));
  const paintPill = () => { const b = bills.find((x) => x.dataset.bill === bill); pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; };
  const setBill = (b) => {
    bill = b; bills.forEach((x) => x.classList.toggle('is-on', x.dataset.bill === b)); paintPill();
    prices.forEach((el) => {
      const to = +el.dataset[b], o = { v: +el.textContent || 0 };
      if (G && !RM) gsap.to(o, { v: to, duration: 0.8, ease: 'expo.out', onUpdate: () => (el.textContent = fmt(Math.round(o.v * 100) / 100)), onComplete: () => (el.textContent = fmt(to)) });
      else el.textContent = fmt(to);
    });
    $$('[data-per]').forEach((el) => { el.dataset.base = el.dataset.base || el.textContent; el.textContent = b === 'y' ? el.dataset.base + ', billed yearly' : el.dataset.base; });
    paintLive();
  };
  bills.forEach((x) => x.addEventListener('click', () => setBill(x.dataset.bill)));
  addEventListener('resize', paintPill); requestAnimationFrame(paintPill); document.fonts && document.fonts.ready.then(paintPill);

  /* ═══════════════ find your ticket ═══════════════ */
  const PLAN = ['Standing room', 'The stalls', 'The box'];
  const PRICE = { m: [0, 12, 39], y: [0, 9.6, 31.2] };
  const tixs = $$('.tix'), devs = $('[data-devs]'), devsV = $('[data-devs-v]'), live = $('[data-live]');
  const L = { plan: $('[data-l-plan]'), seats: $('[data-l-seats]'), each: $('[data-l-each]'), acts: $('[data-l-acts]'), total: $('[data-l-total]'), why: $('[data-l-why]'), no: $('[data-l-no]'), admit: $('[data-l-admit]'), date: $('[data-l-date]'), tag: $('[data-l-tag]') };
  const d = new Date(); L.date.textContent = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() + ' · TONIGHT';
  const A = { priv: 0, night: 0, rev: 0 };
  $$('.seg').forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => { $$('button', g).forEach((x) => x.classList.toggle('is-on', x === b)); A[g.dataset.q] = +b.dataset.v; paintLive(true); })));
  devs.addEventListener('input', () => paintLive(true));
  let lastPlan = -1;
  function paintLive(bump) {
    const n = +devs.value; devsV.textContent = n;
    // the rules of the house
    const plan = n >= 3 || A.night === 2 || (A.rev === 1 && n > 1) ? 2 : A.priv || A.night === 1 || A.rev === 1 || n === 2 ? 1 : 0;
    const each = PRICE[bill][plan], total = Math.round(each * n * 100) / 100;
    L.plan.textContent = PLAN[plan];
    L.seats.textContent = n; L.each.textContent = each ? '$' + fmt(each) : '$0'; L.acts.textContent = plan ? '∞' : '30/day';
    L.total.textContent = total ? '$' + fmt(total) + (bill === 'y' ? '/mo' : '') : 'free';
    L.admit.textContent = n > 1 ? `ADMIT ${n}` : 'ADMIT ONE';
    const why = [n === 1 ? 'just you' : `${n} developers`, A.priv ? 'private code' : 'open code', ['nights off', 'some nights', 'deus every night'][A.night], A.rev ? 'deus reviews everything' : 'you review'];
    L.why.textContent = 'because: ' + why.join(', ') + '.';
    L.no.textContent = 'Nº ' + String(plan * 1000 + n * 7 + A.night * 3 + A.priv).padStart(4, '0');
    tixs.forEach((t) => t.classList.toggle('is-picked', +t.dataset.plan === plan));
    if (plan !== lastPlan) {
      L.tag.textContent = ['free is fine', 'recommended', 'the whole company'][plan];
      if (bump && G && !RM) { gsap.fromTo(live, { rotate: -1.5, y: -8 }, { rotate: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,.4)' }); XM.decode(XM.chars(L.plan), { stagger: 0.03, duration: 0.7, y: 60 }); }
      lastPlan = plan;
    }
  }
  paintLive(false);

  // print: the ticket slides out of a slot, the stub gets torn
  $('[data-print]').addEventListener('click', () => {
    if (G && !RM) {
      gsap.timeline()
        .to(live, { clipPath: 'inset(0 0 100% 0)', y: -20, duration: 0.35, ease: 'power2.in' })
        .set(live, { y: 0 })
        .fromTo(live, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'steps(14)' })
        .fromTo('.live__stub', { x: 0, rotate: 0 }, { x: 14, rotate: 6, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 });
    }
    XM.toast(`ticket printed: <b>${L.plan.textContent.toLowerCase()} × ${L.seats.textContent}</b>. it’s a concept, no money moved.`);
  });

  /* ═══════════════ box office: one note open at a time ═══════════════ */
  const ds = $$('.notes details');
  ds.forEach((dd) => dd.addEventListener('toggle', () => { if (dd.open) ds.forEach((o) => o !== dd && (o.open = false)); }));

  addEventListener('load', () => { ST && ScrollTrigger.refresh(); paintPill(); });
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
