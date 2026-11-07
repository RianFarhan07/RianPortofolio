import { expect, test } from "@playwright/test";
import {
  NODE_PATHS,
  PHASES,
  chapterScrollProgress,
  clamp01,
  easeOut,
  getEntranceState,
  getOrbitState,
  nodePosition,
  phaseProgress,
  quadraticBezier,
  smoothToward,
} from "../src/lib/orbitJourneyModel.js";

// Pure scroll model behind the About "orbit journey". No browser involved.

test("clamp01 and phaseProgress stay finite for NaN, negative and >1 input", () => {
  expect(clamp01(NaN)).toBe(0);
  expect(clamp01(undefined)).toBe(0);
  expect(clamp01(Infinity)).toBe(0);
  expect(clamp01(-3)).toBe(0);
  expect(clamp01(7)).toBe(1);
  expect(phaseProgress(NaN, 0.2, 0.4)).toBe(0);
  expect(phaseProgress(-1, 0.2, 0.4)).toBe(0);
  expect(phaseProgress(2, 0.2, 0.4)).toBe(1);
  expect(phaseProgress(0.3, 0.2, 0.4)).toBeCloseTo(0.5, 9);
});

test("headline is assembled at 0 and fully dispersed by 0.24", () => {
  expect(getOrbitState(0).headline).toBe(0);
  expect(getOrbitState(0.24).headline).toBe(1);
  const mid = getOrbitState(0.12).headline;
  expect(mid).toBeGreaterThan(0);
  expect(mid).toBeLessThan(1);
});

test("core is born during 0.18..0.34 and rings build during 0.28..0.48", () => {
  expect(getOrbitState(0.18).core).toBe(0);
  expect(getOrbitState(0.34).core).toBe(1);
  expect(getOrbitState(0.28).rings).toEqual([0, 0, 0]);
  expect(getOrbitState(0.48).rings).toEqual([1, 1, 1]);
  const [inner, middle, outer] = getOrbitState(0.38).rings;
  expect(inner).toBeGreaterThan(middle);
  expect(middle).toBeGreaterThan(outer);
});

test("four nodes arrive during 0.40..0.62 in staggered order", () => {
  expect(getOrbitState(0.4).nodes).toEqual([0, 0, 0, 0]);
  expect(getOrbitState(0.62).nodes).toEqual([1, 1, 1, 1]);
  const mid = getOrbitState(0.5).nodes;
  for (let i = 0; i < 3; i += 1) expect(mid[i]).toBeGreaterThanOrEqual(mid[i + 1]);
});

test("journey runs 0.60..1 and chapter is clamped to integers 0..3", () => {
  expect(getOrbitState(0.6).journey).toBe(0);
  expect(getOrbitState(1).journey).toBe(1);
  for (const p of [-5, 0, 0.3, 0.6, 0.79, 0.8, 0.99, 1, 9, NaN]) {
    const { chapter } = getOrbitState(p);
    expect(Number.isInteger(chapter)).toBe(true);
    expect(chapter).toBeGreaterThanOrEqual(0);
    expect(chapter).toBeLessThanOrEqual(3);
  }
  expect(getOrbitState(1).chapter).toBe(3);
});

test("phase values never decrease while scrolling down and are always finite", () => {
  let previous = getOrbitState(0);
  for (let i = 1; i <= 200; i += 1) {
    const state = getOrbitState(i / 200);
    for (const key of ["headline", "core", "journey", "copy", "shift"]) {
      expect(Number.isFinite(state[key])).toBe(true);
      expect(state[key]).toBeGreaterThanOrEqual(previous[key] - 1e-12);
    }
    previous = state;
  }
});

test("scroll state is a pure function: going down then up gives identical values", () => {
  const before = getOrbitState(0.37);
  for (const p of [0.9, 0.1, 0.77, 0.02, 0.55]) getOrbitState(p);
  expect(getOrbitState(0.37)).toEqual(before);
});

test("quadraticBezier matches the quadratic formula at t=0, .5, 1", () => {
  const a = { x: -40, y: -30 };
  const c = { x: 10, y: 80 };
  const b = { x: 50, y: 2 };
  expect(quadraticBezier(a, c, b, 0)).toEqual(a);
  expect(quadraticBezier(a, c, b, 1)).toEqual(b);
  const half = quadraticBezier(a, c, b, 0.5);
  expect(half.x).toBeCloseTo(0.25 * a.x + 0.5 * c.x + 0.25 * b.x, 9);
  expect(half.y).toBeCloseTo(0.25 * a.y + 0.5 * c.y + 0.25 * b.y, 9);
});

test("nodes arrive from four different corners on curved (not straight) paths", () => {
  const starts = NODE_PATHS.map((path) => path.start);
  expect(starts[0].x).toBeLessThan(0);
  expect(starts[0].y).toBeLessThan(0); // Interface: upper-left
  expect(starts[1].x).toBeGreaterThan(100);
  expect(starts[1].y).toBeLessThan(0); // Systems: upper-right
  expect(starts[2].x).toBeGreaterThan(100);
  expect(starts[2].y).toBeGreaterThan(100); // Resilience: lower-right
  expect(starts[3].x).toBeLessThan(0);
  expect(starts[3].y).toBeGreaterThan(100); // Ecosystem: lower-left

  NODE_PATHS.forEach((path, i) => {
    expect(nodePosition(i, 0)).toEqual(path.start);
    expect(nodePosition(i, 1)).toEqual(path.end);
    const mid = nodePosition(i, 0.5);
    const straight = { x: (path.start.x + path.end.x) / 2, y: (path.start.y + path.end.y) / 2 };
    expect(Math.hypot(mid.x - straight.x, mid.y - straight.y)).toBeGreaterThan(5);
  });
});

test("every node settles inside the orbit box with equal reach from the centre", () => {
  for (const { end } of NODE_PATHS) {
    expect(end.x).toBeGreaterThanOrEqual(0);
    expect(end.x).toBeLessThanOrEqual(100);
    expect(end.y).toBeGreaterThanOrEqual(0);
    expect(end.y).toBeLessThanOrEqual(100);
    expect(Math.max(Math.abs(end.x - 50), Math.abs(end.y - 50))).toBeLessThanOrEqual(48);
  }
});

test("chapterScrollProgress lands inside its own chapter with that node on top", () => {
  for (let i = 0; i < 4; i += 1) {
    const state = getOrbitState(chapterScrollProgress(i));
    expect(state.chapter).toBe(i);
    expect(state.rotation).toBeCloseTo(-90 * i, 9);
  }
  // out-of-range input is clamped, never throws
  expect(getOrbitState(chapterScrollProgress(-4)).chapter).toBe(0);
  expect(getOrbitState(chapterScrollProgress(99)).chapter).toBe(3);
  expect(getOrbitState(chapterScrollProgress(NaN)).chapter).toBe(0);
});

test("rotation is zero before the journey begins and never exceeds 270 degrees", () => {
  expect(getOrbitState(0.5).rotation).toBe(0);
  for (let i = 0; i <= 100; i += 1) {
    expect(Math.abs(getOrbitState(i / 100).rotation)).toBeLessThanOrEqual(270 + 1e-9);
  }
});

test("entrance: words fly in while the section rises into view, all assembled once it pins", () => {
  const start = getEntranceState(0);
  expect(start.words).toHaveLength(10);
  expect(start.words.every((w) => w === 0)).toBe(true);
  expect(start.lead).toBe(0);

  const end = getEntranceState(1);
  expect(end.words.every((w) => w === 1)).toBe(true);
  expect(end.lead).toBe(1);

  // mid-approach: staggered, first word leads, nothing is stuck at 0 or 1 for all
  const mid = getEntranceState(0.6);
  expect(mid.words[0]).toBeGreaterThan(mid.words[9]);
  expect(mid.words[0]).toBeGreaterThan(0);
  expect(mid.words[9]).toBeLessThan(1);

  // garbage in -> safe out
  expect(getEntranceState(NaN).words.every((w) => w === 0)).toBe(true);
  expect(getEntranceState(5).words.every((w) => w === 1)).toBe(true);
  expect(getEntranceState(1, 4).words).toHaveLength(4);
});

test("entrance never decreases as the section rises and is a pure function (reversible)", () => {
  let previous = getEntranceState(0);
  for (let i = 1; i <= 100; i += 1) {
    const state = getEntranceState(i / 100);
    state.words.forEach((w, k) => expect(w).toBeGreaterThanOrEqual(previous.words[k]));
    expect(state.lead).toBeGreaterThanOrEqual(previous.lead);
    previous = state;
  }
  expect(getEntranceState(0.42)).toEqual(getEntranceState(0.42));
});

test("headline holds fully assembled just after pinning, then disperses", () => {
  expect(getOrbitState(0.025).headline).toBe(0);
  expect(getOrbitState(0.24).headline).toBe(1);
});

test("smoothToward eases frame-rate independently and snaps when close", () => {
  const one = smoothToward(0, 100, 16, 120);
  expect(one).toBeGreaterThan(0);
  expect(one).toBeLessThan(100);
  // two 8ms frames land exactly where one 16ms frame does
  expect(smoothToward(smoothToward(0, 100, 8, 120), 100, 8, 120)).toBeCloseTo(one, 9);
  expect(smoothToward(99.7, 100, 16, 120)).toBe(100); // within half a pixel: snap
  expect(smoothToward(0, 100, 16, 0)).toBe(100); // no smoothing requested
  expect(smoothToward(NaN, 100, 16, 120)).toBe(100); // never stuck on a bad value
  expect(smoothToward(0, 100, 5000, 120)).toBe(100); // long pause (tab switch): arrive
});

test("copy and shift phases are defined and easeOut is bounded", () => {
  expect(PHASES.copy[0]).toBeGreaterThanOrEqual(PHASES.nodes[0]);
  expect(PHASES.copy[1]).toBeLessThanOrEqual(PHASES.journey[0] + 0.1);
  expect(easeOut(0)).toBe(0);
  expect(easeOut(1)).toBe(1);
  expect(easeOut(NaN)).toBe(0);
});
