---
name: Rian Farhan Portfolio
description: Blueprint Schematic — an aerospace technical drawing made cinematic.
colors:
  ochre: "#e0a83a"
  ochre-deep: "#b8860b"
  ochre-light: "#9c6a12"
  ochre-light-deep: "#7d5410"
  ink: "#e7edf5"
  ink-invert: "#10233f"
  bg: "#0d1520"
  surface: "#0a1420"
  surface-section: "#060d18"
  bg-light: "#f2f4f7"
  surface-light: "#e8ecf1"
  online: "#4ade80"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(4.5rem, 10vw, 10.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(3rem, 6vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.65rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  chip: "7px"
  md: "8px"
  card: "14px"
  lg: "16px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  section: "clamp(32px, 5vw, 80px)"
components:
  button-primary:
    backgroundColor: "{colors.ochre}"
    textColor: "#10233f (dark theme) / #ffffff (light theme) — ochre is light-toned, so text flips per theme for contrast"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.ochre-deep}"
    textColor: "#10233f (dark theme) / #ffffff (light theme)"
    rounded: "{rounded.pill}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ochre}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  chip-square:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ochre}"
    rounded: "{rounded.chip}"
    padding: "4px 11px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
  nav:
    backgroundColor: "#111d2c"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
---

# Design System: Rian Farhan Portfolio

## 1. Overview

**Creative North Star: "Blueprint Schematic"**

This is an aerospace technical drawing made cinematic. The portfolio does not *describe* an engineer; it renders the instrument an engineer would draft for themselves — corner brackets that frame every viewport like a drafting-table registration mark, a scan line that sweeps the screen like a plotter pen, outlined display type that reads like a stencil on vellum, and live counters that tick up on load like a revision log. The medium is the message: precision, technical confidence, and control are demonstrated in the craft of the interface itself, not claimed in the copy.

The world is deep-navy and vellum-lit. Rich blueprint-navy grounds (`#0d1520` body, `#0a1420` panels) let a single ochre/brass accent (`#e0a83a`) carry the whole surface as luminous edges, glows, and readouts — like a revision stamp or brass rivet catching light. Type is the other half of the identity: a heavy geometric display face (Syne) set in tight, uppercase, negative-tracked slabs, paired with a quiet humanist body (DM Sans) and a genuine system monospace that surfaces wherever the machine speaks — the interactive terminal, technical labels, stat captions. Motion is deliberate and always-on: this system intentionally ignores `prefers-reduced-motion` because the animation *is* the identity — but readability, hierarchy, and contrast are engineered to survive it.

What this system explicitly rejects: the interchangeable one-page developer template; over-designed noise where effects bury the actual work; and the AI-generated gradient-and-glass look — decorative gradients, glassmorphism-by-default, and the cross-project sameness that makes a visitor think "an AI made this." Every device here earns its place by being an instrument reading, not an ornament.

**Key Characteristics:**
- Blueprint-navy grounds, one ochre/brass accent carried as glow and luminous edge — a deliberate departure from the teal-on-near-black "AI dev portfolio" default.
- Instrument furniture: corner brackets, scan lines, pulse dots, and counters as recurring HUD vocabulary, reframed as drafting/schematic marks.
- Outlined + solid display type in tight uppercase Syne slabs.
- Monospace as the machine's voice — terminal, labels, readouts — never as generic "developer" costume.
- Motion is a constant; contrast and hierarchy are built to hold up under it.

## 2. Colors

A blueprint-navy palette where a single ochre/brass accent does all the talking against a deep schematic-navy ground; the accent is switchable to alternate variants from a single block in `index.css`.

### Primary
- **Ochre** (#e0a83a): The one voice of the system. Carries CTAs (as a gradient into its deep stop), active nav states, chip text, pulse dots, glows, scan lines, and every counter's `+`/`%` suffix. In the light theme it deepens to **Ochre Light** (#9c6a12) for contrast against the pale vellum ground.
- **Ochre Deep** (#b8860b): The dark stop of every primary gradient (`135deg, ochre-deep → ochre`) and hover state. Light-theme pair is **Ochre Light Deep** (#7d5410).
- **Button text flips per theme.** Ochre is a light-toned hue, so white CTA text only holds contrast reliably in the light theme (ochre-deep is dark enough there). In the dark theme, where the accent is brighter, CTA text is dark navy (`#10233f`) instead of white. This is a deliberate exception to "always white button text," driven by measured contrast, not an inconsistency.

### Neutral
- **Vellum Ink** (#e7edf5): Primary text on dark — a near-white with a cool blueprint cast, never pure `#fff`. Its inverse on light grounds is **Navy Ink** (#10233f).
- **Void** (#0d1520): The dark body ground — a deep blueprint navy, not near-black.
- **Console Navy** (#0a1420): The panel/card/input surface — a deeper navy that reads as a recessed drafting console. Section wells go deeper to **Section Navy** (#060d18).
- **Muted Ink**: Secondary text as `rgba(210, 222, 235, 0.45–0.52)` on dark, `rgba(16, 35, 63, 0.45)` on light. Borders and hairlines are the accent at low alpha (`rgba(184, 134, 11, 0.10–0.22)` dark / `rgba(125, 84, 16, 0.10-0.22)` light), never neutral gray.
- **Vellum** (#f2f4f7) / **Vellum Surface** (#e8ecf1): The light-theme grounds — a cool pale blue-grey, not warm cream.

### Semantic
- **Online Green** (#4ade80): Reserved for `open_to_work` / availability status only. It is a status signal, not an accent — never used decoratively.
- **Alert Red** (#ef4444): Form validation errors only (used at 0.5 alpha on input borders).

### Named Rules
**The One Voice Rule.** Ochre is the only chromatic accent on screen at a time. Everything colored — glow, border, chip, counter, gradient — is ochre or its deep stop. Do not introduce a second decorative hue; if the brand needs a different color, switch the entire accent variant in `index.css`, don't add to it.

**The No-Gray-Line Rule.** Borders, dividers, and hairlines are always the accent at low alpha (`rgba(var(--ac2), .1–.35)`), never a neutral gray. A gray line breaks the screen-lit illusion.

**The Blueprint-White Rule.** Light text on dark is `#e7edf5` (cool blueprint-cast near-white), never pure `#ffffff`. Pure white reads as flat paper; the cool cast reads as a lit schematic display.

## 3. Typography

**Display Font:** Syne (with `sans-serif` fallback) — geometric, quirky, heavy.
**Body Font:** DM Sans (with `system-ui, sans-serif`) — quiet humanist workhorse.
**Label / Mono Font:** system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) — the machine's voice.

**Character:** A three-way contrast system. Syne's tight, wide-weight display slabs carry all the drama; DM Sans stays out of the way for reading; the monospace appears only where the interface is *reporting* — terminal output, stat captions, technical labels, coordinates. The pairing works because the three families sit on genuinely different axes (geometric display / humanist sans / mono), never two-of-a-kind.

### Hierarchy
- **Display** (Syne 800, `clamp(4.5rem, 10vw, 10.5rem)`, line-height 0.9, `-0.04em`, uppercase): The hero word-stack only (SOFTWARE / ENGINEER), one line solid ink, one line outlined via `-webkit-text-stroke`. Intentionally exceeds the usual display ceiling — it is a stencil, not a paragraph.
- **Headline** (Syne 800, `clamp(3rem, 6vw, 6.5rem)`, line-height 0.88, uppercase): Section titles (SELECTED / WORKS), same solid-plus-outlined treatment.
- **Title** (Syne 800, `~1.35rem`, `-0.03em`): Card and project names.
- **Body** (DM Sans 400, `0.82–0.88rem`, line-height 1.6–1.7): Descriptions and prose. Cap measure at 60–75ch; on dark grounds keep line-height at the upper end (1.65+) so light-on-dark type breathes.
- **Label** (mono 500, `0.6–0.68rem`, `0.16–0.22em`, uppercase): HUD furniture — section eyebrows, counters (`01 / 20`), coordinates (`JAKARTA — ID`), stat captions, terminal prompts.

### Named Rules
**The Stencil Rule.** Display and headline slabs always pair a solid line with an outlined line (`-webkit-text-stroke` at ~0.15–0.24 alpha). The outline is the HUD signature; a fully-solid heading loses the instrument read.

**The Mono-Means-Machine Rule.** Monospace is reserved for text the *system* emits — terminal, readouts, labels, coordinates. It is never used for headlines or body prose. Mono as generic "I'm technical" decoration is banned; here it has a job.

## 4. Elevation

This system is flat-by-construction and lit-by-glow. There are almost no conventional drop shadows; depth is conveyed by luminosity — radial ochre glows bleed from behind the hero photo and under CTAs, and surfaces separate by their own darkness (Console Navy panels on a Void ground) plus a low-alpha accent border. The one true shadow is the navbar's lift when it condenses on scroll. Think cockpit instrument, not paper stack: things glow, they don't cast.

### Shadow Vocabulary
- **CTA Glow** (`box-shadow: 0 0 28px rgba(var(--ac-glow), 0.4)`, → `0 0 44px … 0.65` on hover): The ochre halo under primary buttons. A glow, not a drop — no offset, no dark.
- **Ambient Bloom** (`radial-gradient(ellipse, rgba(var(--ac1), 0.28–0.35), transparent 70%)` + `blur(18–24px)`): Free-standing glow layers behind the hero photo, under section anchors, and beneath counters.
- **Nav Lift** (`box-shadow: 0 10px 30px -12px rgba(0,0,0,0.35)`): The single conventional shadow, applied only to the condensed floating navbar.

### Named Rules
**The Glow-Not-Drop Rule.** Elevation is emitted light (`0 0 Npx` ochre halos, radial blooms), not cast shadow. A dark offset drop shadow reads as paper and breaks the screen-lit world. Reserve the one real drop shadow for the scrolled navbar.

## 5. Components

For each component, lead with its character, then shape, color, and states.

### Buttons
- **Shape:** Fully pill (100px radius). This is non-negotiable across CTAs, ghosts, chips, and inputs.
- **Primary:** Gradient `linear-gradient(135deg, ochre-deep → ochre)`, `~12px 28px` padding, CTA Glow halo. Text is `#10233f` (dark theme) / white (light theme) — see the Button text flips per theme note in Colors. An `ExternalLink` / arrow icon leads or trails the label.
- **Hover / Focus:** `translateY(-2px)` and the glow intensifies (`0 0 44px … 0.65`). Transitions on transform + box-shadow (~0.22s).
- **Ghost / Secondary:** `rgba(var(--ac2), 0.06)` fill, `1px solid rgba(var(--ac2), 0.22)` border, muted ink text, same pill. Hover lifts and brightens the border. Used for the "Source / GitHub" fallback beside a primary "Live Demo".

### Chips
- **Pill chip (tag):** `rgba(var(--ac2), 0.07)` fill, `1px solid rgba(var(--ac2), 0.2)` border, ochre text, pill. Hover deepens border + fill. Used for tech-stack tags and the `● available now` status badge.
- **Square chip (tech token):** `rgba(var(--ac1), 0.1)` fill, `1px solid rgba(var(--ac1), 0.28)` border, ochre text, `7px` radius. The denser, more technical chip inside project detail panels.

### Cards / Containers
- **Corner Style:** `14px` (project panels) or `16px` (outer cards).
- **Background:** Console Navy at high alpha — `rgba(10, 20, 32, 0.96)` on dark, `rgba(232, 236, 241, 0.96)` on light.
- **Border:** `1px solid rgba(var(--ac2), 0.18)` — accent, never gray.
- **Elevation:** Flat; no drop shadow. Depth comes from the darker fill + accent border. Nested cards are forbidden.
- **HUD frame:** Cards and hero viewports carry the four L-shaped corner brackets and, where large, a sweeping scan line.

### Inputs / Fields
- **Style:** Pill (100px) for single-line, `16px` for textarea. Fill `rgba(10, 20, 32, 0.7)`, `1px` accent border, `12px 16px` padding.
- **Focus:** Border shifts to solid ochre (`border-color: var(--ac)`). No glow ring — the border shift is the whole signal.
- **Error:** Border goes to `rgba(239, 68, 68, 0.5)`.

### Navigation
- **Desktop:** A floating pill bar, top-center, transparent at rest and condensing on scroll to `#111d2c` (dark) / `#f7f9fb` (light) with `blur(10px)` and Nav Lift shadow; `max-width` animates 1200 → 760px. Brand mark "Rian.dev" is the one sanctioned gradient-clipped text. Active link = ochre with a small ochre dot beneath.
- **Mobile:** A fixed bottom tab bar with lucide icons; active tab ochre with a dot. A floating theme toggle sits bottom-right.

### The HUD Instrument Kit (signature)
The recurring furniture that defines the North Star, reused across every major section:
- **Corner brackets:** four 12–18px L-shapes, `1px solid rgba(var(--ac2), 0.35)`, insetting each viewport.
- **Scan line:** a 1px accent-gradient bar sweeping top→bottom on a 6–7s loop.
- **Pulse dot:** a 6px ochre dot with an expanding-ring `box-shadow` keyframe, marking "live" states.
- **Counters:** Syne numerals that animate 0→N over ~2s, with an ochre `+`/`%` suffix.
- **The Terminal:** an interactive `neofetch`-style console on the About page — monospace, command prompt, typed output — the literal embodiment of the machine's voice.

## 6. Do's and Don'ts

### Do:
- **Do** keep ochre as the single accent (`#e0a83a` dark / `#9c6a12` light), carried as glow, border, chip, and counter. Switch the whole variant in `index.css` if a different hue is needed.
- **Do** ground text on dark in `#e7edf5`, never pure white; keep it above 4.5:1 so it holds under the always-on motion. CTA button text is the deliberate exception — it flips to dark navy in the dark theme since the ochre accent there is too light for white text to hold contrast.
- **Do** pair a solid display line with an outlined (`-webkit-text-stroke`) line for the Stencil signature.
- **Do** reserve monospace for the machine's voice — terminal, labels, counters, coordinates.
- **Do** convey depth with emitted glow (`0 0 Npx` ochre), and draw every hairline in low-alpha accent, not gray.
- **Do** frame major viewports with the HUD kit — corner brackets, scan line, pulse dot — so the instrument identity stays consistent.
- **Do** keep every button, chip, and input on the 100px pill (textarea excepted at 16px).

### Don't:
- **Don't** ship the generic one-page developer template — the interchangeable, forgettable portfolio is the thing to beat.
- **Don't** over-design into noise: motion and effects must never bury the projects or drop body contrast below legible.
- **Don't** drift into the AI-generated look — no decorative multi-hue gradients, no glassmorphism-by-default, no gradient text (the "Rian.dev" mark is the one sanctioned exception).
- **Don't** use a gray border, divider, or hairline anywhere; use low-alpha ochre.
- **Don't** use a dark offset drop shadow for elevation (paper look); use an ochre glow. The scrolled navbar is the only drop-shadow exception.
- **Don't** use monospace as generic "developer" decoration, or set headlines/body in it.
- **Don't** introduce a second decorative accent hue alongside ochre.
- **Don't** nest cards, or add a colored side-stripe border to a card or callout.
