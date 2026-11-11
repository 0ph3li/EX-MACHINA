# EX-MACHINA — the god in your terminal

**EX-MACHINA** is a concept website for an AI pair programmer that doesn't exist.

In Greek theatre, when a plot got so tangled nobody could untie it, a crane (the *mēchanē*) lowered a god onto the stage to fix everything in the last act. *Deus ex machina*: the god from the machine.

EX-MACHINA is that, for code. Your bug is the tragedy:
- in act I you write it;
- in act II it breaks in production;
- in act III a red box finds the line (it's always line 47), and **deus** comes down, writes the ending and leaves before the applause.

> It's always line 47.

Concept, design & code by **ghostly.grl** ♥ 
---

## The idea

Most AI tools sell themselves as magic. EX-MACHINA admits it's a theatre trick, and plays it straight:

- **The whole product is a play.** The pages are the script, the cast, the rehearsal, the tickets and backstage. The modes are roles, the pricing is a box office and the about page ends with the credits rolling.
- **Deus is a figure made of dots.** It's a 3D asterisk drawn as a point cloud, glowing in video noise. It assembles in the loader, sways under the cursor, glitches when you click and comes apart when you scroll.
- **Red boxes hunt bugs.** On every page, detection boxes (as on a surveillance feed) track the god, roam through code and lock onto the line.
- **It talks in binary.** Ask it something with your voice or by typing. It answers silly questions too ("how are you?", "tabs or spaces?", in English or Italian), as modem-like blips while the subtitle decodes bits into words.
- **The 47 is real.** In 1947, at Harvard, a moth stopped the Mark II and was taped into the logbook as the *"first actual case of bug being found."* The year was forty-seven, and so is the line.

### Art direction: Cyber Angel × qintara

One world, built from two refs in `VIBES/`:
- **qintara** gives the black stage, the pill nav, the quiet light sans headlines, the object in the middle and the dotted icon row.
- **Cyber Angel** gives the glitch bands, the red detection boxes, the glowing figure, the split display-serif titles (*Ex / Machina*, *The / Script*…), the timecodes and the vertical `SYSTEM DEUS // ONLINE` status line.

Her black hole closes the home.

| colour | hex | where |
|---|---|---|
| black | `#000000` | every stage |
| pearl | `#eeede8` | type, dots, the tickets |
| ice | `#cdd6ff` | the glitch-band noise |
| red | `#ff3324` | the only accent: detection boxes, line 47, bits |

**Type**:
- [Gloock](https://fonts.google.com/specimen/Gloock): the split poster titles.
- [Geist](https://fonts.google.com/specimen/Geist) (light): headlines and body.
- [Geist Mono](https://fonts.google.com/specimen/Geist+Mono): code, logs, labels.
- [Silkscreen](https://fonts.google.com/specimen/Silkscreen): pixel words (`THE END`, `DESCEND.exe`).
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) italic: stage directions and the signature.

---

## Pages

### `index.html` · home
| screen | what happens |
|---|---|
| **Loader · DESCEND.exe** | `checkout.js` scrolls past, typed line by line, while a red box scans the screen. It stops on line 47 and the box snaps onto `<=`, which becomes `<`. Then the dotted star assembles, glitches and bursts. Flash. |
| **Hero** | *Ex / Machina* split across a poster. Deus glows in the noise bands while three red boxes chase it (`bug_047`, `null?`, `<=`). Around it: DESCEND.exe, today's date, a running timecode and the dotted icon row. **Click**: the star glitches and every box jumps on it. **Scroll**: it grows and comes apart. |
| **Act III** (pinned) | Three boxes hunt through `checkout.js`, then all lock onto `<=` on line 47. Deus comes down on a wire, `<=` becomes `<` and 48 tests pass. |
| **The five acts** (sideways) | Five Cyber Angel cards with her photos, each with a red box and a timecode: exposition, rising action, crisis, descent, exit. |
| **Talk to deus** | Real mic (Web Speech API) or typing. Deus answers in **binary**: every letter is 8 bits played as 4 blips (Web Audio), the subtitle decodes into English and the current bits run in red. A `sound on/off` toggle. |
| **The end** | Her black hole: your code spirals in, and `THE END` gets swallowed as you scroll. |

### `script.html` · the script (how it works)
| screen | what happens |
|---|---|
| **The / Script** | The title page. Deus reads, a box follows. |
| **Dramatis personae** | You, the bug, deus, the tests, production, each with a dotted pixel icon. |
| **The play** | The five acts as a real screenplay: scene headings, stage directions, dialogue. **A red box reads it with you**, paragraph by paragraph. The still on the left swaps with each act, and the terminal panels type themselves (the diff, *48 passed*, PR #219). |
| **In numbers** | 4,112 files read · 0.8 s to find line 47 · 48 tests · 0 pushes to main without you. |
| **Notes from the director** | The FAQ. |

### `cast.html` · the cast (modes)
| screen | what happens |
|---|---|
| **The / Cast** | "One god, six roles." |
| **Casting** (pinned) | One cloud of dots changes costume as you scroll:<br>`?` the oracle (ask)<br>`{ }` the mechanic (fix)<br>`#` the architect (plan)<br>`“` the critic (review)<br>`✓` the chorus (test)<br>`☾` the understudy (works while you sleep)<br>A red box follows the actor, and the role card swaps photo, name, *best in*, *never* and a typed line. |
| **Call sheet** | It reads your clock and marks who's **ON STAGE NOW** (the oracle by day, the mechanic before bed, the critic at 3 a.m.…). |

### `rehearsal.html` · dress rehearsal (the playground)
| screen | what happens |
|---|---|
| **The stage** | The A28 window (○○○ and ✳) around a **real editor**. Pick a bug or paste your own:<br>`checkout.js`: off-by-one<br>`profile.js`: missing await<br>`cart.py`: mutable default<br>`hero.css`: centring<br>Then **lower the god**: the box sniffs a few lines and locks onto the culprit, the stage log types the hypothesis, deus writes the diff into your code, the tests count up, and you accept or undo. It also catches `==`, `var` and stray `console.log`s. ⌘/Ctrl + Enter runs it. Nothing leaves the browser. |
| **Rules of rehearsal** | Nothing leaves the room · the god is scripted · the bugs are real. |

### `tickets.html` · opening night (pricing)
| screen | what happens |
|---|---|
| **The tickets** | Three perforated, barcoded stubs: **standing room** $0, **the stalls** $12, **the box** $39 per seat. A *per show / season pass* toggle (−20%) rolls the prices. |
| **Which ticket?** | Four questions (how many developers, private code, should deus work at night, who reviews PRs) pick the plan. The live ticket adds up seats × price, says *because…*, and prints. No money moves. |
| **The programme** | The comparison table. |
| **Box office** | The FAQ. |

### `backstage.html` · backstage (about)
| screen | what happens |
|---|---|
| **House rules** | "We don't believe in gods. We build cranes." Six rules; a red box snaps onto each key word as you read. |
| **A short history of the crane** (sideways, on a wire) | 431 BC the *mēchanē* · 19 BC Horace's *nec deus intersit* · **1947 the moth** · 2026 starting over (again). |
| **The stage door** | A contact form. You slide your note under the door. |
| **Credits** | The end credits roll with the scroll, then *Act I ↺* takes you back to the start. |

---

## Details worth finding

- **The loader** runs once per session. Between pages, a curtain drops a red box: `DESCEND.exe — the cast`.
- **Cursor**: a `+`, like the dots, with contextual labels and a trail of little crosses, plus magnetic buttons.
- **Tab title**: switch tabs and it reads *act ii. it broke. come back.*
- **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A): **ASCENSION.exe**. Everything goes up.
- **Console**: open devtools for the cat and the god on its wire, then try:
  - `XM.help()`
  - `XM.ask("my bug")`
  - `XM.chat("come stai?")`
  - `XM.ascend()`
- **Small talk**: deus answers *how are you*, *who are you*, jokes, *tabs or spaces*, *vim*, *are you real*, *what time is it*, *ti amo*… in English and Italian.
- **Reduced motion**: with `prefers-reduced-motion` on, the loader is skipped and every scene renders in its final state.

---

## Built with

- Plain **HTML / CSS / JavaScript**: no framework, no build step.
- [**GSAP 3.12.5**](https://gsap.com) + **ScrollTrigger**: every entrance, pin and scrub.
- [**Lenis 1.1.13**](https://lenis.darkroom.engineering): smooth scrolling.
- **Canvas 2D** for everything made of dots:
  - `XM.glyph`: the 3D dotted star.
  - `XM.glitch`: the noise bands.
  - `XM.sphere`: the listening orb.
  - The morphing costumes, the black hole.
- **Web Speech API** for the mic, **Web Audio** for the binary voice.
- `localStorage` (prefix `xm-`) for the sound toggle and the cookie line. `sessionStorage` remembers that you've already seen the loader.

### Structure

```
EX-MACHINA/
├── index.html · script.html · cast.html · rehearsal.html · tickets.html · backstage.html
├── css/
│   ├── style.css        shared: tokens, nav, cursor, red box, loader, curtain, footer
│   ├── home.css         home (+ shared poster bits for the inner pages)
│   └── <page>.css       one per page
├── js/
│   ├── main.js          shared engine (window.XM): glitch, glyph, box, sphere, oracle/chat, loader, easter eggs
│   └── <page>.js        one per page
├── img/                 HOME · SCRIPT · CAST · BACKSTAGE · README.md
├── reel/ex-machina-reel.mp4   the case-study reel (1080×1920, 30 fps)
├── VIBES/               the 8-ref moodboard
└── favicon.svg
```

### Run it locally

Any static server works:

```bash
python3 -m http.server 5780
```

Then open http://localhost:5780. The microphone needs Chrome and permission. Typing works everywhere.

---

EX-MACHINA is a concept: there is no product, no subscription and no god. The deus answers are scripted. The photos and the moodboard refs in `VIBES/` belong to their authors.

<sub>concept, design & code by ghostly.grl ♥ · 2026</sub>
