/* ═══════════════════════════════════════════════════════════════
   EX-MACHINA — rehearsal.js (the playground)
   concept, design & code by ghostly.grl ♥
   a real editor. "lower the god": a red box scans the lines, a few
   scripted rules recognise classic tragedies (off-by-one, missing
   await, python's mutable default, css centring, ==, var, stray logs),
   deus writes the patch into your code, runs "the tests", and leaves.
   nothing leaves the browser.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, clamp } = XM;
  const G = !!window.gsap, ST = !!window.ScrollTrigger, MOTION = G && ST && !RM;
  const wait = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));

  /* ═══════════════ noise, timecodes, title (shared with the other inner pages) ═══════════════ */
  const NZ = {};
  const NOPT = { sh: { bands: 7, ys: [0.4, 0.48, 0.56, 0.63, 0.7, 0.8, 0.9], amp: 0.8 }, rh: { bands: 8, amp: 0.35 }, next: { bands: 7, ys: [0.25, 0.38, 0.46, 0.55, 0.62, 0.72, 0.85], amp: 0.7 }, ft: { bands: 4, ys: [0.12, 0.3, 0.62, 0.8], amp: 0.4 } };
  $$('[data-noise]').forEach((cv) => (NZ[cv.dataset.noise] = XM.glitch(cv, NOPT[cv.dataset.noise] || {})));
  const tcs = $$('[data-tc]').map((el, i) => ({ el, off: [512.3, 0][i] || 0, last: '' }));
  XM.loop((t) => tcs.forEach((o) => { const v = XM.tc(t + o.off); if (v !== o.last) { o.el.textContent = v; o.last = v; } }));

  const WIDE = matchMedia('(min-width: 801px)').matches;
  const god = XM.glyph($('[data-glyph]'), { form: MOTION ? 0 : 1, scale: WIDE ? 0.2 : 0.24, spin: 0.2 });
  god.cx = WIDE ? 0.78 : 0.5; god.cy = 0.56;
  const shBox = $('.sh__box');
  const track = () => { const p = god.pick(), s = 50 + Math.random() * 70; XM.box(shBox, { x: p.x - s / 2, y: p.y - s / 2, w: s, h: s * 0.8 }); shBox.firstChild.textContent = ['bug', 'null?', '<=', 'await?', 'NaN'][(Math.random() * 5) | 0]; };
  let trackT = setInterval(track, 1500);
  const split = $$('[data-split]').map((el) => XM.chars(el));
  if (MOTION) {
    gsap.set(split.flat(), { opacity: 0 });
    gsap.timeline({ delay: 0.25 })
      .to(god, { form: 1, duration: 2, ease: 'expo.out' }, 0)
      .fromTo(god, { tear: 1.2 }, { tear: 0, duration: 1.3 }, 0)
      .add(() => XM.decode(split[0], { stagger: 0.07, duration: 1.1, y: 90 }), 0.1)
      .add(() => XM.decode(split[1], { stagger: 0.04, duration: 1.1, y: 90 }), 0.3)
      .from('.sh__slash', { scaleY: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
      .from('.sh__sub, .sh__file, .sh__down', { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6)
      .from('.sh .hero__v, .sh .hero__tc', { x: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.6);
    gsap.timeline({ scrollTrigger: { trigger: '.sh', start: 'top top', end: 'bottom top', scrub: 0.8, onLeave: () => clearInterval(trackT), onEnterBack: () => { clearInterval(trackT); trackT = setInterval(track, 1500); } } })
      .to(god, { burst: 1, scale: 0.34, ease: 'power1.in' }, 0)
      .to('.sh__a', { xPercent: -40, opacity: 0 }, 0).to('.sh__b', { xPercent: 20, opacity: 0 }, 0);
    gsap.from('.rh__win', { y: 60, opacity: 0, clipPath: 'inset(0 50% 0 50% round 18px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.rh', start: 'top 75%' } });
    gsap.from('.rules__list li', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.rules', start: 'top 75%' } });
    gsap.from('.next__a span', { yPercent: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
    const word = $('.ft__word'); if (word) gsap.from(XM.chars(word), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }

  /* ═══════════════ the scenarios ═══════════════ */
  const SCN = [
    { file: 'checkout.js', code: `// checkout.js — it worked on friday.\nexport function total(cart, tax) {\n  let sum = 0;\n  for (let i = 0; i <= cart.length; i++) {\n    sum += cart[i].price * cart[i].qty;\n  }\n  return sum * (1 + tax);\n}\n\n// TypeError: cannot read properties of undefined (reading 'price')` },
    { file: 'profile.js', code: `// profile.js\nasync function showProfile(id) {\n  const user = fetchUser(id);\n  title.textContent = user.name;\n  avatar.src = user.photo;\n}\n\n// the page says: undefined. the page always says undefined.` },
    { file: 'cart.py', code: `# cart.py\ndef add(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add("coffee"))\nprint(add("croissant"))  # why is the coffee still here?` },
    { file: 'hero.css', code: `/* hero.css */\n.hero {\n  height: 100vh;\n}\n\n.hero h1 {\n  margin: auto; /* please */\n  vertical-align: middle; /* PLEASE */\n}` },
    { file: 'yours.txt', code: '' },
  ];

  /* ═══════════════ the rules: classic tragedies deus recognises ═══════════════ */
  // each: test(line, all) → match, fix(lines, i, m) → new lines, plus what deus says
  const RULES = [
    { id: 'off-by-one', test: (l) => /<=\s*[\w.\]\[]+\.length/.exec(l), tok: '<=',
      fix: (L, i) => { L[i] = L[i].replace(/<=(\s*[\w.\]\[]+\.length)/, '<$1'); return L; },
      hyp: 'off-by-one in the loop', why: 'you loop one step too far. the last index is length − 1, so the last turn reads something that isn’t there.', say: 'it was always <=. it is always <=.' },
    { id: 'missing await', test: (l) => /^(\s*(?:const|let|var)\s+\w+\s*=\s*)(?!await\b)((?:this\.)?(?:fetch|get|load|read|query|find)\w*\s*\()/i.exec(l),
      fix: (L, i) => { L[i] = L[i].replace(/^(\s*(?:const|let|var)\s+\w+\s*=\s*)/, '$1await '); return L; },
      hyp: 'a promise read before it resolved', why: 'you read .name off a promise. it isn’t a user yet, it’s a promise of one. await it.', say: 'patience is a virtue. so is await.' },
    { id: 'mutable default', test: (l) => /def\s+\w+\((.*?)(\w+)\s*=\s*(\[\]|\{\})/.exec(l), tok: null,
      fix: (L, i, m) => { const name = m[2], empty = m[3], ind = (L[i + 1] || '    ').match(/^\s*/)[0] || '    '; L[i] = L[i].replace(new RegExp(name + '\\s*=\\s*' + (empty === '[]' ? '\\[\\]' : '\\{\\}')), name + '=None'); L.splice(i + 1, 0, `${ind}${name} = ${empty} if ${name} is None else ${name}`); return L; },
      hyp: 'a mutable default argument', why: 'python builds that default list once, at definition. every call shares it. that’s why the coffee never leaves.', say: 'None is the only safe default. sad, but true.' },
    { id: 'css centring', test: (l) => /vertical-align:\s*middle|margin:\s*auto/.exec(l),
      fix: (L, i) => {
        const out = L.filter((l) => !/vertical-align:\s*middle|margin:\s*auto/.test(l));
        const k = out.findIndex((l) => /\{\s*$/.test(l)); if (k >= 0) out.splice(k + 1, 0, '  display: grid;', '  place-items: center;');
        return out;
      },
      hyp: 'centring from the child', why: 'the child can beg all it wants. the parent decides. two lines on the parent and it’s done.', say: 'the oldest tragedy in the theatre. resolved.' },
    { id: 'loose equality', test: (l, all) => !/\bdef\b|^\s*#/.test(all) && /[^=!<>]==[^=]/.exec(l),
      fix: (L, i) => { L[i] = L[i].replace(/([^=!<>])==([^=])/g, '$1===$2'); return L; },
      hyp: 'loose equality', why: '"0" == 0 is true in javascript. so is [] == false. three equals signs, always.', say: 'equal is not the same as the same.' },
    { id: 'var', test: (l) => /^\s*var\s/.exec(l),
      fix: (L, i) => { L[i] = L[i].replace(/^(\s*)var\s/, '$1let '); return L; },
      hyp: 'a var leaking out of its scope', why: 'var ignores the block it lives in. let doesn’t.', say: 'it’s not 2009. let it go.' },
    { id: 'stray log', test: (l) => /console\.log\(|^\s*print\(\s*["']?(debug|here|test)/i.exec(l),
      fix: (L, i) => { L.splice(i, 1); return L; },
      hyp: 'a debug log left on stage', why: 'it prints in production, in front of the audience. i took it off.', say: 'nobody needed to see “HERE 2”.' },
  ];

  /* ═══════════════ the editor ═══════════════ */
  const code = $('[data-code]'), gut = $('[data-gut]'), ed = $('[data-ed]'), box = $('[data-box]'), flash = $('[data-flash]');
  const fileL = $('[data-file]'), log = $('[data-log]'), run = $('[data-run]'), after = $('[data-after]'), stateL = $('[data-state]'), tests = $('[data-tests]');
  const rh = $('.rh'), tabs = $$('[data-scn]');
  const mini = XM.glyph($('[data-mini]'), { scale: 0.42, spin: 0.6, dot: 1.6 });
  let scn = 0, before = null, busy = false, hit = -1;
  const lines = () => code.value.split('\n');
  const paintGut = () => { gut.innerHTML = lines().map((_, i) => `<span${i === hit ? ' class="is-hit"' : ''}>${i + 1}</span>`).join('\n'); gut.scrollTop = code.scrollTop; };
  code.addEventListener('input', () => { hit = -1; paintGut(); after.hidden = true; });
  code.addEventListener('scroll', () => { gut.scrollTop = code.scrollTop; box.style.opacity = 0; });
  code.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = code.selectionStart; code.setRangeText('  ', s, code.selectionEnd, 'end'); paintGut(); } if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') go(); });
  const load = (k) => {
    if (busy) return; scn = k; hit = -1;
    tabs.forEach((b, i) => b.classList.toggle('is-on', i === k));
    fileL.textContent = SCN[k].file; code.value = SCN[k].code;
    code.placeholder = k === 4 ? '// paste your bug here.\n// deus knows a few classic tragedies:\n// off-by-one, missing await, mutable defaults,\n// css centring, ==, var, stray console.logs.' : '';
    after.hidden = true; box.style.opacity = 0; tests.textContent = '—'; paintGut();
    if (k === 4) code.focus();
  };
  tabs.forEach((b) => b.addEventListener('click', () => load(+b.dataset.scn)));

  // where is line i (and optionally columns a..b) inside the editor box
  const geo = () => { const cs = getComputedStyle(code), lh = parseFloat(cs.lineHeight), c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; return { lh, cw: c.measureText('0').width, pt: parseFloat(cs.paddingTop), pl: code.offsetLeft + parseFloat(cs.paddingLeft) }; };
  const rectOf = (i, a, b) => {
    const g = geo(), L = lines()[i] || '', s = a == null ? L.search(/\S|$/) : a, e = b == null ? Math.max(s + 1, L.trimEnd().length) : b;
    return { x: g.pl + s * g.cw - code.scrollLeft - 7, y: g.pt + i * g.lh - code.scrollTop - 3, w: (e - s) * g.cw + 14, h: g.lh + 6 };
  };
  const reveal = (i) => { const g = geo(), y = g.pt + i * g.lh; if (y < code.scrollTop + g.lh || y > code.scrollTop + code.clientHeight - g.lh * 2) code.scrollTop = Math.max(0, y - code.clientHeight / 3); gut.scrollTop = code.scrollTop; };

  /* ═══════════════ the log ═══════════════ */
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const say = async (cls, text, html) => {
    const li = document.createElement('li'); li.className = cls; log.appendChild(li);
    if (html || RM) li.innerHTML = html || esc(text);
    else { for (let i = 1; i <= text.length; i += 2) { li.textContent = text.slice(0, i); log.scrollTop = log.scrollHeight; await wait(12); } li.textContent = text; }
    log.scrollTop = log.scrollHeight;
    if (G) gsap.from(li, { opacity: 0, x: -8, duration: 0.4, ease: 'expo.out' });
    return li;
  };
  const setState = (s) => { stateL.textContent = s; $('.rh .hero__v b') && ($('.rh .hero__v b').textContent = s); };

  /* ═══════════════ lower the god ═══════════════ */
  const go = async () => {
    if (busy) return;
    const src = code.value;
    if (!src.trim()) { await say('dir', '[deus is lowered onto an empty stage. it waits. awkward.]'); code.focus(); return; }
    busy = true; run.disabled = true; after.hidden = true; rh.classList.add('is-running'); log.innerHTML = '';
    before = src; hit = -1; paintGut();
    setState('READING');
    if (G) { NZ.rh && gsap.to(NZ.rh, { amp: 1.4, duration: 0.6 }); gsap.fromTo(mini, { burst: 1, tear: 1 }, { burst: 0, tear: 0, duration: 1.2, ease: 'expo.out' }); }
    const L = src.split('\n');
    await say('dir', '[a crane creaks. deus is lowered in.]');
    await say('sys', `› reading ${SCN[scn].file} · ${L.length} lines · ${src.length} characters`);
    // find the tragedy
    let found = null;
    for (const r of RULES) { for (let i = 0; i < L.length; i++) { const m = r.test(L[i], src); if (m) { found = { r, i, m }; break; } } if (found) break; }
    // the red box scans a few lines first, like it's sniffing
    box.style.opacity = 1; box.classList.remove('is-lock', 'is-ok'); box.firstChild.textContent = 'scanning';
    const nonEmpty = L.map((l, i) => (l.trim() ? i : -1)).filter((i) => i >= 0);
    for (let k = 0; k < 4; k++) { const i = nonEmpty[(Math.random() * nonEmpty.length) | 0]; reveal(i); XM.box(box, rectOf(i), { d: 0.3 }); box.firstChild.textContent = 'line ' + (i + 1); await wait(380); }
    if (!found) {
      const i = Math.min(L.length - 1, 46); reveal(i); XM.box(box, rectOf(i), { d: 0.35 }); box.firstChild.textContent = i === 46 ? 'line 47' : 'line ' + (i + 1);
      setState('CONFUSED');
      await say('sys', '› no known tragedy found. checked: off-by-one, await, mutable defaults, centring, ==, var, stray logs.');
      await say('say', i === 46 ? 'i checked line 47 out of habit. it’s fine. that’s the scariest part.' : 'i read it twice. nothing’s broken. that’s the scariest bug of all.');
      await say('dir', '[deus writes a test anyway, out of suspicion. exit, slowly.]');
      tests.textContent = '1/1'; end(false); return;
    }
    const { r, i, m } = found;
    hit = i; paintGut(); reveal(i);
    let a = null, b = null; if (r.tok) { const c = L[i].indexOf(r.tok); if (c >= 0) { a = c; b = c + r.tok.length; } } else if (m && m.index != null && r.id !== 'mutable default') { a = m.index + (m[1] && r.id === 'missing await' ? m[1].length : 0); b = a + (r.id === 'missing await' ? m[2].length : m[0].length); }
    XM.box(box, rectOf(i, a, b), { d: 0.42, ease: 'steps(6)' });
    box.classList.add('is-lock'); box.firstChild.textContent = r.id;
    if (G) { gsap.fromTo(ed, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,.3)' }); NZ.rh && gsap.fromTo(NZ.rh, { amp: 2.4 }, { amp: 0.9, duration: 0.8 }); }
    setState('FOUND');
    await say('sys', `› hypothesis: ${r.hyp} · line ${i + 1} · confidence 0.9${(Math.random() * 9) | 0}`);
    await say('say', r.why);
    // the patch
    const NL = r.fix(L.slice(), i, m);
    const dif = [];
    const from = Math.max(0, i - 0), toOld = L.slice(from, from + 3), toNew = NL.slice(from, from + 3 + (NL.length - L.length));
    toOld.forEach((l) => { if (!NL.includes(l) || l === L[i]) dif.push(`<span class="del">- ${esc(l)}</span>`); });
    toNew.forEach((l) => { if (!L.includes(l)) dif.push(`<span class="add">+ ${esc(l)}</span>`); });
    if (r.id === 'css centring') { dif.length = 0; L.filter((l) => /vertical-align:\s*middle|margin:\s*auto/.test(l)).forEach((l) => dif.push(`<span class="del">- ${esc(l)}</span>`)); dif.push('<span class="add">+   display: grid;</span>', '<span class="add">+   place-items: center;</span>'); }
    setState('DESCENDING');
    await say('dir', '[deus writes, quickly, before anyone can object.]');
    await say('diff', '', dif.join('\n'));
    await wait(300);
    code.value = NL.join('\n'); hit = Math.min(i, NL.length - 1); paintGut(); reveal(hit);
    const g = geo(); flash.style.top = g.pt + hit * g.lh - code.scrollTop + 'px';
    if (G) gsap.fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1, ease: 'power2.out' });
    XM.box(box, rectOf(hit), { d: 0.3 }); box.classList.remove('is-lock'); box.classList.add('is-ok'); box.firstChild.textContent = 'fixed';
    // the chorus
    setState('TESTING');
    const n = 12 + ((Math.random() * 40) | 0), c = { v: 0 };
    const tli = await say('sys', `› running ${n} tests…`);
    if (G && !RM) await new Promise((res) => gsap.to(c, { v: n, duration: 1.2, ease: 'power2.out', onUpdate: () => (tests.textContent = `${Math.round(c.v)}/${n}`), onComplete: res }));
    tests.textContent = `${n}/${n}`;
    tli.textContent = `› ${n} tests`;
    await say('ok', `${n} passed. 0 failed. 1 new test for exactly this.`);
    await say('say', r.say);
    await say('dir', '[exit deus, before the applause.]');
    if (G) gsap.fromTo(mini, { burst: 1.4 }, { burst: 0, duration: 1.4, ease: 'expo.out' });
    end(true);
  };
  const end = (patched) => {
    busy = false; run.disabled = false; rh.classList.remove('is-running');
    setState(patched ? 'EXIT' : 'STANDING BY');
    after.hidden = !patched;
    if (G && NZ.rh) gsap.to(NZ.rh, { amp: 0.35, duration: 1 });
  };
  run.addEventListener('click', go);
  $('[data-accept]').addEventListener('click', () => { after.hidden = true; before = null; say('dir', '[you accept the patch. you take the bow. that’s in the contract.]'); XM.toast('patch accepted. <b>the credit is yours.</b>'); box.style.opacity = 0; hit = -1; paintGut(); });
  $('[data-undo]').addEventListener('click', () => { if (before == null) return; code.value = before; before = null; after.hidden = true; hit = -1; paintGut(); box.style.opacity = 0; tests.textContent = '—'; say('dir', '[you undo it. deus shrugs. exit, sulking, but politely.]'); });
  addEventListener('resize', () => { box.style.opacity = 0; });

  load(0);
  addEventListener('load', () => ST && ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ScrollTrigger.refresh());
})();
