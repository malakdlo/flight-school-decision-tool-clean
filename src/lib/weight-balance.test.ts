/**
 * Weight & balance math — frozen verification cases.
 *
 * Runs in the build via `vitest run` (see package.json). Cases A–H mirror
 * the worked examples presented for owner verification against the 1966
 * Cessna 150F Owner's Manual sample problems.
 *
 * STATUS: FROZEN — owner verified these cases against the POH and approved
 * them on 2026-07-10. Do not change expected values without re-verifying
 * against the owner's manual.
 */
import { assert, test } from 'vitest';

import {
  computeWB,
  forwardLimitAt,
  aftLimitAt,
  limitAt,
  type WBInputs,
} from './weight-balance.ts';
import { cessna150f1966 as c150 } from '../data/aircraft/cessna-150f-1966.ts';

function inputs(partial: Partial<WBInputs> & { stationWeightsLb?: Record<string, number> }): WBInputs {
  return {
    emptyWeightLb: c150.defaultEmpty.weightLb,
    emptyMomentInLb: c150.defaultEmpty.momentInLb,
    oilQt: 5,
    stationWeightsLb: {},
    tankId: 'standard',
    fuelGal: 0,
    fuelBurnGal: 0,
    ...partial,
  };
}

function close(actual: number, expected: number, tol = 0.005, label = '') {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `${label} expected ${expected}, got ${actual}`,
  );
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((i) => i.code);
}

// ---------------------------------------------------------------------------
// Forward-limit interpolation (the likely bug site)
// fwdCG(W) = 31.5 + (W − 1280) × (32.9 − 31.5) / (1600 − 1280)  for 1280 ≤ W ≤ 1600
//          = 31.5                                                for W < 1280
// ---------------------------------------------------------------------------

test('forward limit: flat at 31.5 below 1,280 lb', () => {
  close(forwardLimitAt(c150, 1150), 31.5);
  close(forwardLimitAt(c150, 1200), 31.5);
  close(forwardLimitAt(c150, 1280), 31.5);
});

test('forward limit: sloped between 1,280 and 1,600 lb', () => {
  close(forwardLimitAt(c150, 1440), 32.2); // 31.5 + 160 × 0.004375
  close(forwardLimitAt(c150, 1450), 32.24375);
  close(forwardLimitAt(c150, 1443.375), 32.2148, 0.001);
  close(forwardLimitAt(c150, 1600), 32.9);
});

test('forward limit: clamps to endpoints outside charted weights', () => {
  close(forwardLimitAt(c150, 1100), 31.5);
  close(forwardLimitAt(c150, 1650), 32.9);
});

test('aft limit: constant 37.5 everywhere', () => {
  close(aftLimitAt(c150, 1150), 37.5);
  close(aftLimitAt(c150, 1450), 37.5);
  close(aftLimitAt(c150, 1600), 37.5);
});

test('limitAt: generic piecewise interpolation', () => {
  const pts = [
    { weightLb: 1000, cgIn: 30 },
    { weightLb: 2000, cgIn: 40 },
  ];
  close(limitAt(pts, 1500), 35);
});

// ---------------------------------------------------------------------------
// Case A — exactly at 1,600 lb max gross (no violation at the limit)
// people 366, bag1 40, fuel 20 gal, oil 0
// ---------------------------------------------------------------------------

test('Case A: exactly 1,600 lb is legal (at, not over, the limit)', () => {
  const r = computeWB(
    c150,
    inputs({
      oilQt: 0,
      stationWeightsLb: { frontSeats: 366, baggage1: 40 },
      fuelGal: 20,
      fuelBurnGal: 6,
    }),
  );
  close(r.takeoff.weightLb, 1600);
  close(r.takeoff.momentInLb, 58467);
  close(r.takeoff.cgIn, 36.5419, 0.001);
  close(r.zeroFuel.weightLb, 1480);
  close(r.zeroFuel.cgIn, 36.0993, 0.001);
  assert.strictEqual(r.allIssues.length, 0, `expected no issues, got ${codes(r.allIssues)}`);
});

// ---------------------------------------------------------------------------
// Case B — over max gross
// same as A but people 400 → 1,634 lb, over by 34
// ---------------------------------------------------------------------------

test('Case B: over max gross by 34 lb, named factually', () => {
  const r = computeWB(
    c150,
    inputs({
      oilQt: 0,
      stationWeightsLb: { frontSeats: 400, baggage1: 40 },
      fuelGal: 20,
    }),
  );
  close(r.takeoff.weightLb, 1634);
  close(r.takeoff.cgIn, 36.593, 0.001);
  const over = r.takeoff.issues.find((i) => i.code === 'over-max-gross');
  assert.ok(over, 'expected over-max-gross issue');
  assert.match(over.message, /exceeds the 1,600 lb maximum gross weight by 34 lb/);
});

// ---------------------------------------------------------------------------
// Case C — forward of the SLOPED limit at 1,450 lb (the interpolation trap)
// Hypothetical forward empty CG of 29.0 in (the real 150F's stations can't
// physically reach this region — this case exists to prove the sloped check).
// CG 31.593 is AFT of the flat 31.5 floor, so a naive constant-31.5 check
// would wrongly pass it; the sloped limit at 1,450 lb is 32.24375.
// ---------------------------------------------------------------------------

test('Case C: CG forward of sloped limit at 1,450 lb that a flat 31.5 check would miss', () => {
  const r = computeWB(
    c150,
    inputs({
      emptyWeightLb: 1074,
      emptyMomentInLb: 1074 * 29.0, // 31,146
      oilQt: 0,
      stationWeightsLb: { frontSeats: 376 },
    }),
  );
  close(r.takeoff.weightLb, 1450);
  close(r.takeoff.cgIn, 31.5931, 0.001);
  assert.ok(r.takeoff.cgIn > 31.5, 'trap precondition: CG is aft of the flat 31.5 floor');
  const fwd = r.takeoff.issues.find((i) => i.code === 'cg-forward-of-limit');
  assert.ok(fwd, 'expected cg-forward-of-limit issue');
  assert.match(fwd.message, /forward of the forward limit \(32.24 in at 1,450 lb\)/);
});

// ---------------------------------------------------------------------------
// Case D — aft of the 37.5 in limit
// defaults, people 120, bag1 80, bag2 40 (combined = 120, legal), fuel 4 gal
// ---------------------------------------------------------------------------

test('Case D: CG aft of 37.5 in', () => {
  const r = computeWB(
    c150,
    inputs({
      stationWeightsLb: { frontSeats: 120, baggage1: 80, baggage2: 40 },
      fuelGal: 4,
    }),
  );
  close(r.takeoff.weightLb, 1347.375);
  close(r.takeoff.momentInLb, 50634.4375);
  close(r.takeoff.cgIn, 37.5801, 0.001);
  const aft = r.takeoff.issues.find((i) => i.code === 'cg-aft-of-limit');
  assert.ok(aft, 'expected cg-aft-of-limit issue');
  assert.match(aft.message, /aft of the aft limit \(37.5 in\) by 0.08 in/);
});

// ---------------------------------------------------------------------------
// Case E — combined baggage over 120 lb with both areas individually legal
// bag1 100 (≤120 ✓), bag2 40 (≤40 ✓), combined 140 → over by 20
// ---------------------------------------------------------------------------

test('Case E: combined baggage over 120 with both areas individually legal', () => {
  const r = computeWB(
    c150,
    inputs({
      stationWeightsLb: { frontSeats: 280, baggage1: 100, baggage2: 40 },
      fuelGal: 15,
    }),
  );
  const cs = codes(r.inputIssues);
  assert.ok(cs.includes('group-over-max:baggage-combined'), `expected combined issue, got ${cs}`);
  assert.ok(!cs.includes('station-over-max:baggage1'), 'area 1 alone is legal');
  assert.ok(!cs.includes('station-over-max:baggage2'), 'area 2 alone is legal');
  const combined = r.inputIssues.find((i) => i.code === 'group-over-max:baggage-combined');
  assert.match(combined!.message, /exceeds the 120 lb combined limit by 20 lb/);
  // This aft-heavy load also pushes CG past 37.5 — warnings stack.
  close(r.takeoff.weightLb, 1593.375);
  close(r.takeoff.cgIn, 38.237, 0.001);
  assert.ok(codes(r.takeoff.issues).includes('cg-aft-of-limit'));
});

test('per-area baggage limits enforced individually', () => {
  const r = computeWB(
    c150,
    inputs({ stationWeightsLb: { frontSeats: 170, baggage1: 130, baggage2: 50 } }),
  );
  const cs = codes(r.inputIssues);
  assert.ok(cs.includes('station-over-max:baggage1'));
  assert.ok(cs.includes('station-over-max:baggage2'));
  assert.ok(cs.includes('group-over-max:baggage-combined'));
});

// ---------------------------------------------------------------------------
// Case F — fuel burn exceeds fuel on board (invalid input)
// ---------------------------------------------------------------------------

test('Case F: fuel burn > fuel on board is flagged and landing is not computed', () => {
  const r = computeWB(
    c150,
    inputs({ stationWeightsLb: { frontSeats: 340 }, fuelGal: 10, fuelBurnGal: 12 }),
  );
  assert.strictEqual(r.landing, null);
  const burn = r.inputIssues.find((i) => i.code === 'burn-exceeds-fuel');
  assert.ok(burn, 'expected burn-exceeds-fuel issue');
  assert.strictEqual(burn.kind, 'invalid');
});

// ---------------------------------------------------------------------------
// Case G — oil 0 vs 5 vs 6 qt: useful load = max gross − empty − oil
// ---------------------------------------------------------------------------

test('Case G: oil quarts drive useful load and moment', () => {
  const base = { stationWeightsLb: { frontSeats: 340 }, fuelGal: 20 };
  const oil0 = computeWB(c150, inputs({ ...base, oilQt: 0 }));
  const oil5 = computeWB(c150, inputs({ ...base, oilQt: 5 }));
  const oil6 = computeWB(c150, inputs({ ...base, oilQt: 6 }));
  close(oil0.usefulLoadLb, 526);
  close(oil5.usefulLoadLb, 516.625); // the "~516 lb" headline number
  close(oil6.usefulLoadLb, 514.75);
  close(oil6.oilWeightLb, 11.25);
  // Oil sits ahead of the datum: 6 qt adds −151.875 in·lb of moment.
  close(oil6.zeroFuel.momentInLb - oil0.zeroFuel.momentInLb, -151.875);
  close(oil6.zeroFuel.weightLb - oil0.zeroFuel.weightLb, 11.25);
});

test('oil below the 4 qt minimum gets an informational note', () => {
  const r = computeWB(c150, inputs({ oilQt: 3, stationWeightsLb: { frontSeats: 340 } }));
  const note = r.inputIssues.find((i) => i.code === 'oil-below-min');
  assert.ok(note && note.kind === 'info');
});

// ---------------------------------------------------------------------------
// Case H — normal flight: two people, full standard fuel, light bag, 8 gal burn
// people 340, bag1 20, fuel 22.5 gal, oil 5 qt, burn 8 gal
// ---------------------------------------------------------------------------

test('Case H: normal two-up full-fuel flight — all three conditions in envelope', () => {
  const r = computeWB(
    c150,
    inputs({
      stationWeightsLb: { frontSeats: 340, baggage1: 20 },
      fuelGal: 22.5,
      fuelBurnGal: 8,
    }),
  );
  close(r.zeroFuel.weightLb, 1443.375);
  close(r.zeroFuel.momentInLb, 51006.4375);
  close(r.zeroFuel.cgIn, 35.3383, 0.001);

  close(r.takeoff.weightLb, 1578.375);
  close(r.takeoff.momentInLb, 56676.4375);
  close(r.takeoff.cgIn, 35.9081, 0.001);

  assert.ok(r.landing, 'landing should be computed');
  close(r.landing!.weightLb, 1530.375);
  close(r.landing!.momentInLb, 54660.4375);
  close(r.landing!.cgIn, 35.717, 0.001);

  assert.strictEqual(r.allIssues.length, 0, `expected no issues, got ${codes(r.allIssues)}`);
});

// ---------------------------------------------------------------------------
// Fuel capacity caps per tank option
// ---------------------------------------------------------------------------

test('fuel over usable capacity flags on standard tanks, legal on long-range', () => {
  const std = computeWB(
    c150,
    inputs({ stationWeightsLb: { frontSeats: 300 }, fuelGal: 30, tankId: 'standard' }),
  );
  assert.ok(codes(std.inputIssues).includes('fuel-over-usable'));

  const lr = computeWB(
    c150,
    inputs({ stationWeightsLb: { frontSeats: 300 }, fuelGal: 30, tankId: 'long-range' }),
  );
  assert.ok(!codes(lr.inputIssues).includes('fuel-over-usable'));
});

// ---------------------------------------------------------------------------
// Below the charted envelope minimum weight → informational note, not a limit
// ---------------------------------------------------------------------------

test('below 1,150 lb charted minimum yields an info note', () => {
  const r = computeWB(c150, inputs({ oilQt: 5, stationWeightsLb: { frontSeats: 60 } }));
  close(r.zeroFuel.weightLb, 1143.375);
  const note = r.zeroFuel.issues.find((i) => i.code === 'below-envelope-min-weight');
  assert.ok(note && note.kind === 'info');
});
