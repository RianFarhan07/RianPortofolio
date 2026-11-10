import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  NODE_PATHS,
  chapterScrollProgress,
  easeOut,
  getEntranceState,
  getOrbitState,
  nodePosition,
  phaseProgress,
  smoothToward,
} from "../lib/orbitJourneyModel";

/*
  Home "About" section: one scroll-controlled story.

  The headline flies in while the section rises into view, holds once the
  stage pins, flies apart, a point is born where it was, rings grow from that
  point, four capabilities swing in from the corners, and the orbit then turns
  through the chapters. Every stage is a pure function of scroll position
  (lib/orbitJourneyModel), eased toward that position so wheel steps read as
  motion rather than jumps, and fully reversible.

  Rendering: a single rAF loop writes transform/opacity straight onto the ~30
  moving elements (never layout properties, never inherited custom properties)
  and skips values that did not change. It stops itself once at rest and
  reports that state on the story element as data-motion="idle" | "moving".

  Product note: like the rest of the site (PRODUCT.md, DESIGN.md), motion is
  always on and prefers-reduced-motion is deliberately ignored — Windows with
  "Animation effects" off reports `reduce`, which used to leave this section
  fading in place while everything else animated. Set to true to honour it.
*/
const RESPECT_REDUCED_MOTION = false;
const EASE_MS = 120; // how quickly the scene catches up with the scroll position

const stats = [
  { value: 20, suffix: "+", label: "Projects shipped" },
  { value: 4, suffix: "+", label: "Years building" },
];

const proofItems = ["CarbonEthics", "Disnaker Makassar", "Hacktiv8", "SMAN 4 Jeneponto"];

/* Where each word comes from (fx/fy in vw/vh, scale, rotation in deg) and where it
   flies when dispersing (dx/dy in vw/vh). Fixed, never random, so it reverses exactly. */
const headline = [
  { text: "I", fx: -52, fy: -18, fs: 0.5, fr: -12, dx: -42, dy: -24 },
  { text: "build", fx: 0, fy: -48, fs: 0.7, fr: 6, dx: 4, dy: -40 },
  { text: "from", fx: 54, fy: -10, fs: 0.6, fr: 10, dx: 44, dy: -16 },
  { text: "the", fx: 8, fy: 6, fs: 2.4, fr: 0, dx: 12, dy: 10 },
  { text: "interface", fx: -50, fy: 22, fs: 0.6, fr: 8, dx: -46, dy: 26 },
  { text: "to", fx: 6, fy: 52, fs: 0.5, fr: -8, dx: 8, dy: 44 },
  { text: "the", fx: 50, fy: 30, fs: 0.7, fr: -10, dx: 40, dy: 28 },
  { text: "system", fx: -30, fy: -45, fs: 0.8, fr: 5, dx: -34, dy: -34, outline: true },
  { text: "behind", fx: 36, fy: 48, fs: 0.55, fr: -6, dx: 38, dy: 38, outline: true },
  { text: "it.", fx: -10, fy: 6, fs: 2.8, fr: 0, dx: -14, dy: 12, outline: true },
];

const chapters = [
  {
    label: "Interface",
    hint: "What people touch",
    tag: "Chapter 01 · Interface",
    title: "Making ideas tangible",
    body: "Android projects taught me to start with a problem close enough to understand and a user close enough to listen to.",
  },
  {
    label: "Systems",
    hint: "Data and APIs",
    tag: "Chapter 02 · Systems",
    title: "Thinking beyond the interface",
    body: "The interface pulled me into APIs, data models, roles, and the architecture behind every reliable interaction.",
  },
  {
    label: "Resilience",
    hint: "Reality-proof UX",
    tag: "Chapter 03 · Resilience",
    title: "Designing for imperfect conditions",
    body: "Weak signals, slow GPS, and interrupted workflows made resilience part of the experience itself.",
  },
  {
    label: "Ecosystem",
    hint: "Products connected",
    tag: "Chapter 04 · Ecosystem",
    title: "Connecting the whole product range",
    body: "Today I connect public web, B2B monitoring, internal operations, and field mobile products at CarbonEthics.",
  },
];

function CountUp({ to, suffix = "", active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let frame;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, to]);

  return (
    <>
      {value}
      <em>{suffix}</em>
    </>
  );
}

const fixed = (value, digits) => Number(value.toFixed(digits)); // stable strings -> unchanged values are skipped

/* Static parts, created once: re-renders on chapter change skip them entirely. */
const css = `
        .oj-root {
          --oj-vh: 100vh;
          --oj-top: 84px;
          --oj-bottom: 24px;
          position: relative;
          color: var(--oj-ink);
          background: var(--oj-bg);
          font-family: 'DM Sans', sans-serif;
        }

        @supports (height: 100svh) { .oj-root { --oj-vh: 100svh; } }

        .oj-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }

        .oj-story {
          position: relative;
          height: 700vh;
        }

        /* Everything that moves is written as transform/opacity by script. The
           defaults below are the no-JavaScript view: headline assembled, orbit hidden. */
        .oj-stage {
          position: sticky;
          top: 0;
          height: var(--oj-vh);
          overflow: hidden;
          contain: layout paint;
          background:
            linear-gradient(rgba(var(--ac2), .05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--ac2), .05) 1px, transparent 1px),
            var(--oj-bg);
          background-size: 72px 72px;
        }

        .oj-corner {
          position: absolute;
          z-index: 30;
          width: 18px;
          height: 18px;
          border: 0 solid rgba(var(--ac2), .35);
          pointer-events: none;
        }
        .oj-corner-tl { top: 14px; left: 14px; border-top-width: 1px; border-left-width: 1px; }
        .oj-corner-tr { top: 14px; right: 14px; border-top-width: 1px; border-right-width: 1px; }
        .oj-corner-bl { bottom: 14px; left: 14px; border-bottom-width: 1px; border-left-width: 1px; }
        .oj-corner-br { right: 14px; bottom: 14px; border-right-width: 1px; border-bottom-width: 1px; }

        .oj-scan {
          position: absolute;
          z-index: 29;
          top: 0;
          right: 0;
          left: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--ac2), .4), transparent);
          opacity: 0;
          animation: oj-scan 7s ease-in-out infinite paused;
          pointer-events: none;
          will-change: transform;
        }
        .oj-root.is-near .oj-scan { animation-play-state: running; }
        /* plain units (no var()) so the browser can run it on the compositor */
        @keyframes oj-scan {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          6%, 94% { opacity: 1; }
          100% { transform: translate3d(0, 100vh, 0); opacity: 0; }
        }

        /* Stages 1 + 2: headline flies in, holds, then disperses */
        .oj-intro {
          position: absolute;
          z-index: 14;
          inset: 0;
          display: grid;
          justify-items: center;
          padding: 0 clamp(20px, 5vw, 80px);
          place-content: center;
          text-align: center;
          pointer-events: none;
        }

        .oj-title {
          max-width: 1100px;
          margin: 0;
          color: var(--oj-ink);
          font: 800 clamp(2.8rem, 7vw, 7.8rem)/.92 'Syne', sans-serif;
          letter-spacing: -.065em;
        }

        .oj-word {
          display: inline-block;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .oj-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(var(--ac2), .85);
        }

        .oj-lead {
          max-width: 620px;
          margin-top: 28px;
          will-change: transform, opacity;
        }
        .oj-lead p {
          margin: 0;
          color: var(--oj-muted);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        /* Stages 3 + 4: a point is born, rings expand from it */
        .oj-system {
          position: absolute;
          left: 50%;
          top: calc(var(--oj-top) + (var(--oj-vh) - var(--oj-top) - var(--oj-bottom)) / 2);
          width: min(58vw, 730px, calc((var(--oj-vh) - var(--oj-top) - var(--oj-bottom) - 184px) / .96));
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          will-change: transform;
        }

        .oj-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(var(--ac2), .3);
          border-radius: 50%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
          will-change: transform, opacity; /* own layer: growing rings don't re-raster the orbit */
        }
        .oj-r1 { width: 34%; aspect-ratio: 1; }
        .oj-r2 { width: 65%; aspect-ratio: 1; border-style: dashed; }
        .oj-r3 { width: 96%; aspect-ratio: 1; border-color: rgba(var(--ac2), .18); }

        .oj-seed {
          position: absolute;
          z-index: 3;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--ac);
          box-shadow: 0 0 26px rgba(var(--ac1), .85);
          opacity: 0;
          transform: translate(-50%, -50%);
        }
        .oj-root.is-near .oj-story.is-seed-live .oj-seed { animation: oj-seed 1.4s ease-out infinite; }
        @keyframes oj-seed {
          0% { box-shadow: 0 0 0 0 rgba(var(--ac1), .55), 0 0 26px rgba(var(--ac1), .85); }
          100% { box-shadow: 0 0 0 26px rgba(var(--ac1), 0), 0 0 26px rgba(var(--ac1), .85); }
        }

        .oj-core {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          display: grid;
          width: 23%;
          aspect-ratio: 1;
          place-items: center;
          border: 1px solid var(--ac);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--ac1), .18), var(--oj-panel) 68%);
          box-shadow: 0 0 62px rgba(var(--ac1), .12);
          text-align: center;
          font: 700 clamp(.7rem, 1.2vw, 1rem) 'Syne', sans-serif;
          opacity: 0;
          transform: translate(-50%, -50%) scale(.2);
          will-change: transform, opacity;
        }
        .oj-core-label { opacity: 0; }

        /* Stage 5: nodes arrive from four corners */
        .oj-node {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: clamp(108px, 14vw, 184px);
          aspect-ratio: 1;
          place-items: center;
          padding: 14px;
          border: 1px solid rgba(var(--ac2), .24);
          border-radius: 50%;
          background: var(--oj-panel);
          color: var(--oj-muted);
          text-align: center;
          opacity: 0;
          transform: translate(-50%, -50%) scale(.55);
          transition: border-color 300ms ease, box-shadow 300ms ease, color 300ms ease;
          will-change: transform, opacity;
        }
        .oj-node strong {
          display: block;
          margin-bottom: 5px;
          color: var(--oj-ink);
          font: 700 clamp(.72rem, 1.15vw, .96rem) 'Syne', sans-serif;
        }
        .oj-node.is-active {
          border-color: var(--ac);
          color: var(--ac);
          box-shadow: 0 0 0 9px rgba(var(--ac1), .07), 0 0 42px rgba(var(--ac1), .2);
        }

        /* Stage 6: chapter copy and navigation fade in once the orbit has formed */
        .oj-heading, .oj-copy, .oj-nav { visibility: hidden; opacity: 0; }
        .oj-story.is-orbit-ready .oj-heading,
        .oj-story.is-orbit-ready .oj-copy,
        .oj-story.is-orbit-ready .oj-nav { visibility: visible; }

        .oj-heading {
          position: absolute;
          z-index: 12;
          top: clamp(84px, 9vh, 110px);
          left: clamp(28px, 5vw, 74px);
          max-width: 470px;
        }
        .oj-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 14px;
          color: var(--ac);
          font-size: .66rem;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .oj-eyebrow::before { width: 30px; height: 1px; background: var(--ac); content: ''; }
        .oj-heading h3 {
          margin: 0;
          color: var(--oj-ink);
          font: 800 clamp(2.2rem, 3.6vw, 4.4rem)/.94 'Syne', sans-serif;
          letter-spacing: -.065em;
        }
        .oj-heading h3 span {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(var(--ac2), .85);
        }

        .oj-copy {
          position: absolute;
          z-index: 12;
          bottom: clamp(36px, 7vh, 76px);
          left: clamp(28px, 5vw, 74px);
          max-width: 450px;
        }
        .oj-copy small {
          display: block;
          margin-bottom: 10px;
          color: var(--ac);
          font-size: .66rem;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .oj-copy h3 {
          margin: 0 0 12px;
          color: var(--oj-ink);
          /* scales with the shorter of width and height so the panel stays clear of the orbit on short laptops */
          font: 800 clamp(1.5rem, min(3vw, 4.4vh), 3.5rem)/.98 'Syne', sans-serif;
          letter-spacing: -.045em;
        }
        .oj-copy p {
          margin: 0;
          color: var(--oj-muted);
          font-size: clamp(.86rem, 1.9vh, 1rem);
          line-height: 1.65;
        }

        .oj-nav {
          position: absolute;
          z-index: 20;
          top: 50%;
          right: clamp(22px, 4vw, 60px);
          display: grid;
          gap: 12px;
          transform: translateY(-50%);
        }
        .oj-nav button {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 0;
          border: 0;
          background: transparent;
          color: transparent;
          cursor: pointer;
        }
        .oj-nav span {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: .62rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          transition: color 250ms ease;
        }
        .oj-nav i {
          display: block;
          width: 5px;
          height: 30px;
          border-radius: 99px;
          background: rgba(var(--ac2), .26);
          transition: background 250ms ease, box-shadow 250ms ease;
        }
        .oj-nav button:hover span,
        .oj-nav button:focus-visible span,
        .oj-nav button.is-active span { color: var(--oj-muted); }
        .oj-nav button.is-active i { background: var(--ac); box-shadow: 0 0 14px rgba(var(--ac1), .65); }
        .oj-nav button:focus-visible { outline: 1px solid var(--ac); outline-offset: 6px; }


        .oj-skip {
          position: absolute;
          z-index: 25;
          right: clamp(22px, 4vw, 60px);
          bottom: 30px;
          padding-bottom: 3px;
          border-bottom: 1px solid rgba(var(--ac2), .45);
          color: var(--oj-faint);
          font-size: .62rem;
          letter-spacing: .14em;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 180ms ease, border-color 180ms ease;
        }
        .oj-skip:hover, .oj-skip:focus-visible { border-color: var(--ac); color: var(--ac); }

        /* Closing: the calls to action stay on the home page */
        .oj-closing {
          position: relative;
          display: grid;
          justify-items: center;
          gap: 30px;
          padding: clamp(72px, 10vw, 130px) clamp(18px, 4vw, 64px);
          border-top: 1px solid rgba(var(--ac2), .22);
          background: var(--oj-bg);
          text-align: center;
        }
        .oj-closing h3 {
          max-width: 1100px;
          margin: 0;
          color: var(--oj-ink);
          font: 800 clamp(2.2rem, 4.2vw, 4.6rem)/.96 'Syne', sans-serif;
          letter-spacing: -.06em;
        }
        .oj-closing h3 span {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(var(--ac2), .85);
        }

        .oj-role { display: grid; gap: 4px; }
        .oj-role small {
          color: var(--oj-faint);
          font-size: .6rem;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .oj-role strong { color: var(--oj-ink); font-size: .92rem; font-weight: 600; }

        .oj-stats {
          display: grid;
          width: min(640px, 100%);
          grid-template-columns: .8fr .8fr 1.2fr;
          border-top: 1px solid rgba(var(--ac2), .22);
          border-bottom: 1px solid rgba(var(--ac2), .22);
        }
        .oj-stat { padding: 21px 14px 19px; }
        .oj-stat + .oj-stat { border-left: 1px solid rgba(var(--ac2), .2); }
        .oj-stat strong {
          display: block;
          min-height: 37px;
          margin-bottom: 5px;
          color: var(--oj-ink);
          font: 800 clamp(1.65rem, 2.5vw, 2.25rem)/1 'Syne', sans-serif;
          letter-spacing: -.05em;
        }
        .oj-stat strong em { color: var(--ac); font-style: normal; }
        .oj-stat span {
          color: var(--oj-faint);
          font-size: .58rem;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .oj-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .oj-button {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 24px;
          border: 1px solid rgba(var(--ac2), .28);
          border-radius: 100px;
          color: var(--oj-ink);
          font-size: .78rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }
        .oj-button:hover { transform: translateY(-2px); }
        .oj-button-primary {
          border-color: transparent;
          background: linear-gradient(135deg, var(--ac-deep), var(--ac));
          box-shadow: 0 0 28px rgba(var(--ac-glow), .4);
          color: var(--oj-button-text);
        }
        .oj-button-primary:hover { box-shadow: 0 0 44px rgba(var(--ac-glow), .65); }
        .oj-button-ghost { background: rgba(var(--ac2), .06); }
        .oj-button-ghost:hover { border-color: rgba(var(--ac2), .62); }

        .oj-proof {
          margin: 0;
          color: var(--oj-faint);
          font-size: .6rem;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .oj-proof b { color: var(--oj-muted); font-weight: 500; }

        @media (max-width: 900px) {
          .oj-heading h3 { font-size: clamp(2.2rem, 5vw, 4rem); }
          .oj-system {
            width: min(68vw, calc((var(--oj-vh) - var(--oj-top) - var(--oj-bottom) - 184px) / .96));
          }
          .oj-copy { max-width: 380px; }
          .oj-nav { right: 18px; }
        }

        /* Portrait tablets have height to spare: stack the orbit above the panel instead of beside it. */
        @media (max-width: 900px) and (min-height: 900px) {
          .oj-root { --oj-bottom: 250px; }
        }

        /* Below Tailwind's md the navbar becomes a bottom tab bar plus a floating theme
           toggle, so the chapter panel moves to the (free) top and the orbit sits below it. */
        @media (max-width: 767px) {
          .oj-root { --oj-top: 252px; --oj-bottom: 78px; }
          .oj-story { height: 600vh; }
          .oj-title { font-size: clamp(2.4rem, 11.5vw, 3.6rem); }
          .oj-lead p { font-size: .95rem; }
          .oj-heading { display: none; }
          .oj-system {
            width: min(80vw, calc(104vw - 120px), calc((var(--oj-vh) - var(--oj-top) - var(--oj-bottom) - 84px) / .96));
          }
          .oj-core { width: 28%; font-size: .62rem; }
          .oj-node { width: 84px; padding: 8px; font-size: .64rem; }
          .oj-copy {
            top: 40px;
            right: 20px;
            bottom: auto;
            left: 20px;
            height: 196px;
            max-width: none;
            padding: 12px 16px;
            overflow: hidden;
            border-left: 1px solid var(--ac);
            background: linear-gradient(90deg, var(--oj-panel), transparent 140%);
          }
          .oj-copy small { margin-bottom: 6px; font-size: .62rem; }
          .oj-copy h3 { margin-bottom: 8px; font-size: 1.3rem; }
          .oj-copy p { font-size: .8rem; line-height: 1.55; }
          .oj-nav { display: none; }
          .oj-skip { top: 12px; right: 20px; bottom: auto; }
          .oj-stats { grid-template-columns: 1fr; }
          .oj-stat, .oj-stat + .oj-stat {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            padding: 17px 0;
            border-left: 0;
          }
          .oj-stat + .oj-stat { border-top: 1px solid rgba(var(--ac2), .18); }
          .oj-stat strong { min-height: 0; margin: 0; }
          .oj-actions { width: 100%; flex-direction: column; }
        }
`;

const STYLE_ELEMENT = <style>{css}</style>;

const INTRO_AND_HEADING = (
  <>
            <div className="oj-intro">
              <h2 className="oj-title" id="about-preview-title">
                {headline.map((word, i) => (
                  <Fragment key={`${word.text}-${i}`}>
                    {i > 0 ? " " : null}
                    <span className="oj-word">
                      <span className={word.outline ? "oj-outline" : undefined}>{word.text}</span>
                    </span>
                  </Fragment>
                ))}
              </h2>
              <div className="oj-lead">
                <p>
                  My journey is not a list of dates. It is an expanding view of what a useful
                  product needs&mdash;and who it needs to connect.
                </p>
              </div>
            </div>

            <div className="oj-heading">
              <p className="oj-eyebrow oj-mono">My product universe</p>
              <h3>
                Every project<span>expanded the system.</span>
              </h3>
            </div>
  </>
);

const SR_LIST = (
        <ol className="sr-only oj-sr">
          {chapters.map((item) => (
            <li key={item.label}>
              <strong>{item.title}.</strong> {item.body}
            </li>
          ))}
        </ol>
);

export default function AboutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rootRef = useRef(null);
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const closingRef = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [closingVisible, setClosingVisible] = useState(false);

  /* Count-up in the closing block starts when it is reached. */
  useEffect(() => {
    const closing = closingRef.current;
    if (!closing) return undefined;
    if (!("IntersectionObserver" in window)) {
      setClosingVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setClosingVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(closing);
    return () => observer.disconnect();
  }, []);

  /* Decorative loops (scan line, seed pulse) only run while the section is near the viewport. */
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !("IntersectionObserver" in window)) {
      root?.classList.add("is-near");
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => root.classList.toggle("is-near", entry.isIntersecting),
      { rootMargin: "50% 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /* Scroll-driven render loop. */
  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    if (!story || !stage) return undefined;

    const all = (selector) => [...stage.querySelectorAll(selector)];
    const words = all(".oj-word");
    const lead = stage.querySelector(".oj-lead");
    const system = stage.querySelector(".oj-system");
    const rings = all(".oj-ring");
    const seed = stage.querySelector(".oj-seed");
    const core = stage.querySelector(".oj-core");
    const label = stage.querySelector(".oj-core-label");
    const nodes = all("[data-node]");
    const risers = all(".oj-heading, .oj-copy");
    const faders = all(".oj-nav");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");

    const written = new Map();
    const put = (el, prop, value) => {
      let record = written.get(el);
      if (!record) {
        record = {};
        written.set(el, record);
      }
      if (record[prop] === value) return;
      record[prop] = value;
      el.style[prop] = value;
    };
    const flags = {};
    const flag = (el, name, on) => {
      if (flags[name] === on) return;
      flags[name] = on;
      el.classList.toggle(name, on);
    };

    /* Layout is only read here (on resize, load, or when content above changes height),
       never inside the animation frame, so easing frames cannot force a layout. */
    let vw = 0;
    let vh = 0;
    let range = 1;
    let stageWidth = 0;
    let systemSize = 0;
    let storyTop = 0;
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      range = Math.max(1, story.offsetHeight - vh);
      stageWidth = stage.clientWidth;
      systemSize = system.offsetWidth;
      storyTop = story.getBoundingClientRect().top + window.scrollY;
    };

    let lastChapter = -1;
    let motionState = "";
    const setMotion = (value) => {
      if (motionState === value) return;
      motionState = value;
      story.dataset.motion = value;
    };

    /* y = how far the page has scrolled past the top of the story, in px (negative while approaching). */
    const draw = (y) => {
      const reduced = RESPECT_REDUCED_MOTION && motion.matches;
      const state = getOrbitState(y / range);
      const entrance = getEntranceState(1 + y / vh, words.length);
      const h = state.headline;
      const keep = Math.max(0, 1 - h * 1.25);

      words.forEach((el, i) => {
        const word = headline[i];
        const e = easeOut(entrance.words[i]);
        put(el, "opacity", String(fixed(e * keep, 3)));
        if (reduced || (e === 1 && h === 0)) {
          put(el, "transform", "none");
          return;
        }
        const tx = fixed(((word.fx * (1 - e) + word.dx * h) * vw) / 100, 1);
        const ty = fixed(((word.fy * (1 - e) + word.dy * h) * vh) / 100, 1);
        const scale = fixed((word.fs + (1 - word.fs) * e) * (1 - h * 0.3), 4);
        const turn = fixed(word.fr * (1 - e), 2);
        put(el, "transform", `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotate(${turn}deg)`);
      });

      put(lead, "opacity", String(fixed(entrance.lead * Math.max(0, 1 - h * 2.6), 3)));
      put(lead, "transform", reduced || h === 0 ? "none" : `translate3d(0, ${fixed(h * 44, 1)}px, 0)`);

      const rotation = reduced ? 0 : state.rotation;
      const shift = compact.matches ? 0 : fixed(state.shift * 0.09 * stageWidth, 1);
      put(system, "transform", `translate(-50%, -50%) translate3d(${shift}px, 0, 0) rotate(${fixed(rotation, 2)}deg)`);
      const counter = fixed(-rotation, 2);

      state.rings.forEach((value, i) => {
        put(rings[i], "opacity", String(fixed(value, 3)));
        put(rings[i], "transform", `translate(-50%, -50%) scale(${fixed(value, 4)})`);
      });

      put(seed, "opacity", String(fixed(Math.min(1, state.core * 8) * (1 - phaseProgress(state.core, 0.65, 1)), 3)));
      flag(story, "is-seed-live", !reduced && state.core > 0 && state.core < 1);
      put(core, "opacity", String(fixed(Math.min(1, state.core * 1.6), 3)));
      put(core, "transform", `translate(-50%, -50%) rotate(${counter}deg) scale(${fixed(0.2 + state.core * 0.8, 4)})`);
      put(label, "opacity", String(fixed(phaseProgress(state.core, 0.7, 1), 3)));

      nodes.forEach((el, i) => {
        const t = easeOut(state.nodes[i]);
        const point = reduced ? NODE_PATHS[i].end : nodePosition(i, t);
        const px = fixed(((point.x - 50) / 100) * systemSize, 1);
        const py = fixed(((point.y - 50) / 100) * systemSize, 1);
        const scale = reduced ? 1 : fixed(0.55 + 0.45 * t, 4);
        put(el, "opacity", String(fixed(Math.min(1, state.nodes[i] * (reduced ? 1 : 2.5)), 3)));
        put(el, "transform", `translate(-50%, -50%) translate3d(${px}px, ${py}px, 0) rotate(${counter}deg) scale(${scale})`);
      });

      const copy = String(fixed(state.copy, 3));
      risers.forEach((el) => {
        put(el, "opacity", copy);
        put(el, "transform", `translate3d(0, ${fixed((1 - state.copy) * 18, 1)}px, 0)`);
      });
      faders.forEach((el) => put(el, "opacity", copy));
      flag(story, "is-orbit-ready", state.copy >= 0.5);

      if (state.chapter !== lastChapter) {
        lastChapter = state.chapter;
        setChapter(state.chapter);
      }
    };

    let goal = 0;
    let current = 0;
    let frame = 0;
    let lastTime = 0;
    // read in the scroll handler (layout is already clean there); frames reuse it
    const readGoal = () => {
      goal = window.scrollY - storyTop;
    };

    const tick = (now) => {
      frame = 0;
      const dt = lastTime ? now - lastTime : 16;
      lastTime = now;
      const reduced = RESPECT_REDUCED_MOTION && motion.matches;
      // nothing of the story on screen: no point easing through it, jump straight there
      const offscreen = goal < -vh || goal > range + vh;
      current = reduced || offscreen ? goal : smoothToward(current, goal, dt, EASE_MS);
      draw(current);
      if (current === goal) {
        lastTime = 0;
        setMotion("idle");
      } else {
        setMotion("moving");
        frame = requestAnimationFrame(tick);
      }
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      readGoal();
      kick();
    };
    const onResize = () => {
      measure();
      readGoal();
      current = goal;
      kick();
    };
    // content above the story can change height (images, fonts, other sections): re-measure then
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(onResize) : null;

    measure();
    readGoal();
    current = goal;
    draw(current);
    setMotion("idle");

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    window.addEventListener("pageshow", onResize);
    motion.addEventListener("change", kick);
    compact.addEventListener("change", onResize);
    resizeObserver?.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("pageshow", onResize);
      motion.removeEventListener("change", kick);
      compact.removeEventListener("change", onResize);
      resizeObserver?.disconnect();
    };
  }, []);

  const scrollToChapter = (index) => {
    const story = storyRef.current;
    if (!story) return;
    const range = story.offsetHeight - window.innerHeight;
    const top = story.getBoundingClientRect().top + window.scrollY + range * chapterScrollProgress(index);
    const reduced = RESPECT_REDUCED_MOTION && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  const themeStyles = {
    "--oj-bg": isDark ? "#181e16" : "#e0d3c2",
    "--oj-panel": isDark ? "rgba(27, 33, 25, .94)" : "rgba(216, 202, 182, .96)",
    "--oj-ink": isDark ? "#e2d6c6" : "#232b20",
    "--oj-muted": isDark ? "#a39680" : "#575246",
    "--oj-faint": isDark ? "#908671" : "#5e5848",
    "--oj-button-text": isDark ? "#232b20" : "#ffffff",
  };

  const active = chapters[chapter];

  return (
    <>
      {STYLE_ELEMENT}

      <section
        id="about"
        ref={rootRef}
        className="oj-root"
        style={themeStyles}
        aria-labelledby="about-preview-title"
      >
        <div className="oj-story" ref={storyRef}>
          <div className="oj-stage" ref={stageRef}>
            <span className="oj-corner oj-corner-tl" aria-hidden="true" />
            <span className="oj-corner oj-corner-tr" aria-hidden="true" />
            <span className="oj-corner oj-corner-bl" aria-hidden="true" />
            <span className="oj-corner oj-corner-br" aria-hidden="true" />
            <div className="oj-scan" aria-hidden="true" />

            {INTRO_AND_HEADING}

            <div className="oj-system" aria-hidden="true">
              <div className="oj-ring oj-r1" />
              <div className="oj-ring oj-r2" />
              <div className="oj-ring oj-r3" />
              <div className="oj-seed" />
              <div className="oj-core">
                <span className="oj-core-label">Build what matters</span>
              </div>
              {chapters.map((item, i) => (
                <div
                  className={`oj-node${i === chapter ? " is-active" : ""}`}
                  data-node={i}
                  key={item.label}
                >
                  <div>
                    <strong>{item.label}</strong>
                    {item.hint}
                  </div>
                </div>
              ))}
            </div>

            <div className="oj-copy" aria-live="polite">
              <small className="oj-mono">{active.tag}</small>
              <h3>{active.title}</h3>
              <p>{active.body}</p>
            </div>

            <nav className="oj-nav" aria-label="Jump to a journey chapter">
              {chapters.map((item, i) => (
                <button
                  className={i === chapter ? "is-active" : undefined}
                  type="button"
                  key={item.label}
                  aria-current={i === chapter ? "step" : undefined}
                  onClick={() => scrollToChapter(i)}
                >
                  <span>{item.label}</span>
                  <i />
                </button>
              ))}
            </nav>

            <a className="oj-skip oj-mono" href="#projects">
              Skip to projects
            </a>
          </div>
        </div>

        {SR_LIST}

        <div className="oj-closing" ref={closingRef}>
          <h3>
            Today, I build the connections
            <span>users never have to think about.</span>
          </h3>

          <div className="oj-role">
            <small className="oj-mono">Most recently at</small>
            <strong>CarbonEthics &mdash; Fullstack Developer Associate Manager</strong>
          </div>

          <div className="oj-stats" role="group" aria-label="Experience summary">
            {stats.map(({ value, suffix, label }) => (
              <div className="oj-stat" key={label}>
                <strong>
                  <CountUp to={value} suffix={suffix} active={closingVisible} />
                </strong>
                <span className="oj-mono">{label}</span>
              </div>
            ))}
            <div className="oj-stat">
              <strong>
                Web <em>+</em> Mobile
              </strong>
              <span className="oj-mono">Full product range</span>
            </div>
          </div>

          <div className="oj-actions">
            <Link to="/projects" className="oj-button oj-button-primary">
              Explore Projects <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/about" className="oj-button oj-button-ghost">
              About Me
            </Link>
          </div>

          <p className="oj-proof oj-mono">
            Selected proof &mdash; {proofItems.map((item, i) => (
              <Fragment key={item}>
                {i > 0 ? " · " : null}
                <b>{item}</b>
              </Fragment>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}
