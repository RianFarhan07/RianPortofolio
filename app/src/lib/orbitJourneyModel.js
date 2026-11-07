/*
  Scroll model for the About "orbit journey".

  One normalized scroll progress (0..1) is split into named phases. Everything
  here is a pure function of that number: no timers, no state, so scrolling
  back up replays every stage in reverse, exactly.

    (before 0)   headline flies in while the section rises into view (getEntranceState)
    0.00 – 0.03  hold: the assembled headline is readable once the stage pins
    0.03 – 0.24  headline disperses
    0.18 – 0.34  centre point is born and becomes the core
    0.28 – 0.48  three rings expand from the centre (inner leads)
    0.40 – 0.62  four nodes arrive from four corners on curved paths
    0.56 – 0.66  heading, chapter copy and navigation fade in
    0.60 – 1.00  orbit turns through the four chapters
*/

export const PHASES = {
  headline: [0.03, 0.24],
  core: [0.18, 0.34],
  rings: [0.28, 0.48],
  nodes: [0.4, 0.62],
  copy: [0.56, 0.66],
  shift: [0.3, 0.6],
  journey: [0.6, 1],
};

// Windows are literal pairs (not computed) so the last node/ring reaches exactly 1.
const RING_WINDOWS = [
  [0, 0.5],
  [0.25, 0.75],
  [0.5, 1],
];
const NODE_WINDOWS = [
  [0, 0.55],
  [0.15, 0.7],
  [0.3, 0.85],
  [0.45, 1],
];

/*
  Positions are percentages of the orbit box. Start points lie outside it
  (upper-left, upper-right, lower-right, lower-left); each control point bends
  the path so a node swings in instead of sliding in a straight line.
*/
export const NODE_PATHS = [
  { start: { x: -70, y: -55 }, control: { x: -45, y: 35 }, end: { x: 50, y: 2 } },
  { start: { x: 170, y: -55 }, control: { x: 100, y: -45 }, end: { x: 97, y: 50 } },
  { start: { x: 170, y: 155 }, control: { x: 120, y: 110 }, end: { x: 50, y: 98 } },
  { start: { x: -70, y: 155 }, control: { x: -20, y: 140 }, end: { x: 3, y: 50 } },
];

export function clamp01(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
}

export function phaseProgress(progress, start, end) {
  return clamp01((clamp01(progress) - start) / (end - start));
}

export function easeOut(t) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeInOut(t) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function quadraticBezier(a, c, b, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

export function nodePosition(index, t) {
  const { start, control, end } = NODE_PATHS[index];
  return quadraticBezier(start, control, end, t);
}

export function getOrbitState(progress) {
  const p = clamp01(progress);
  const ringPhase = phaseProgress(p, ...PHASES.rings);
  const nodePhase = phaseProgress(p, ...PHASES.nodes);
  const journey = phaseProgress(p, ...PHASES.journey);

  const u = journey * 4;
  const chapter = Math.min(3, Math.floor(u));
  const within = u - chapter;
  // The active node dwells on top for the first 55% of its chapter,
  // then the orbit turns a quarter so the next node arrives on top.
  const turn = chapter === 3 ? 0 : easeInOut((within - 0.55) / 0.45);

  return {
    progress: p,
    headline: phaseProgress(p, ...PHASES.headline),
    core: phaseProgress(p, ...PHASES.core),
    rings: RING_WINDOWS.map(([from, to]) => phaseProgress(ringPhase, from, to)),
    nodes: NODE_WINDOWS.map(([from, to]) => phaseProgress(nodePhase, from, to)),
    copy: phaseProgress(p, ...PHASES.copy),
    shift: phaseProgress(p, ...PHASES.shift),
    journey,
    chapter,
    rotation: -90 * (chapter + turn) + 0, // "+ 0" turns -0 into 0
  };
}

/*
  Headline entrance, driven by how far the section has risen into view:
  approach 0 = top of the story at the bottom edge of the viewport,
  approach 1 = story pinned. Words land one after another, so the entrance is
  always on screen while it happens (a timed animation used to finish below
  the fold) and it reverses when scrolling back up.
*/
export function getEntranceState(approach, count = 10) {
  const a = clamp01(approach);
  const words = Array.from({ length: count }, (_, i) => {
    const from = 0.18 + (i / Math.max(1, count - 1)) * 0.4;
    return phaseProgress(a, from, from + 0.4); // every window ends below 1, so all words reach exactly 1
  });
  return { words, lead: phaseProgress(a, 0.8, 1) };
}

/*
  Exponential smoothing toward a target, independent of frame rate:
  two 8ms steps land where one 16ms step does. Snaps when within `snap`
  so the render loop can stop. tau <= 0 means "no smoothing".
*/
export function smoothToward(current, target, dtMs, tauMs, snap = 0.5) {
  if (!Number.isFinite(current) || !(tauMs > 0)) return target;
  const next = current + (target - current) * (1 - Math.exp(-Math.max(0, dtMs) / tauMs));
  return Math.abs(target - next) < snap ? target : next;
}

/* Scroll progress that lands in the dwell zone of chapter `index` (clamped 0..3). */
export function chapterScrollProgress(index) {
  const i = Math.min(3, Math.max(0, Math.round(Number(index) || 0)));
  const [from, to] = PHASES.journey;
  return from + (to - from) * ((i + 0.5) / 4);
}
