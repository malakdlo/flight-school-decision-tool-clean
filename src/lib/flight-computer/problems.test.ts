/**
 * Tests for practice problem generation and grading.
 *
 * Generators run against a seeded RNG for many iterations to check the
 * brief's realism invariants (winds <= 40 kts, TAS 90-140, sane altitudes)
 * and that every generated problem has finite, engine-computed answers.
 */
import { describe, expect, it } from 'vitest';
import {
  buildQueue,
  CATEGORY_LABELS,
  generateProblem,
  gradeField,
  overallVerdict,
  type AnswerField,
  type PracticeCategory,
} from './problems';

/** Deterministic LCG so test runs are reproducible. */
function seededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as PracticeCategory[];
const ITERATIONS = 250;

describe('generateProblem invariants', () => {
  it('every category produces well-formed problems with finite answers', () => {
    const rng = seededRng(42);
    for (const category of CATEGORIES) {
      for (let i = 0; i < ITERATIONS; i += 1) {
        const p = generateProblem(category, rng);
        expect(p.category).toBe(category);
        expect(p.title.length).toBeGreaterThan(0);
        expect(p.steps.length).toBeGreaterThan(0);
        expect(p.fields.length).toBeGreaterThan(0);
        for (const field of p.fields) {
          expect(Number.isFinite(field.value)).toBe(true);
          expect(field.tolerance).toBeGreaterThan(0);
        }
      }
    }
  });

  it('wind problems stay GA-plausible: wind 5-40 kts, TAS 90-140, valid triangle', () => {
    const rng = seededRng(7);
    for (let i = 0; i < ITERATIONS; i += 1) {
      const p = generateProblem('wind', rng);
      const wind = p.givens[2].match(/Wind (\d{3})° at (\d+) kts/);
      const tas = p.givens[1].match(/True airspeed (\d+) kts/);
      expect(wind).not.toBeNull();
      expect(tas).not.toBeNull();
      const windSpeed = Number(wind![2]);
      const tasKts = Number(tas![1]);
      expect(windSpeed).toBeGreaterThanOrEqual(5);
      expect(windSpeed).toBeLessThanOrEqual(40);
      expect(tasKts).toBeGreaterThanOrEqual(90);
      expect(tasKts).toBeLessThanOrEqual(140);
      // wind < TAS always, so the triangle is always solvable
      expect(windSpeed).toBeLessThan(tasKts);
      const heading = p.fields.find((f) => f.id === 'heading')!;
      const gs = p.fields.find((f) => f.id === 'gs')!;
      expect(heading.circular).toBe(true);
      expect(heading.value).toBeGreaterThan(0);
      expect(heading.value).toBeLessThanOrEqual(360);
      expect(gs.value).toBeGreaterThan(0);
    }
  });

  it('altitude problems stay in trainer ranges', () => {
    const rng = seededRng(11);
    for (let i = 0; i < ITERATIONS; i += 1) {
      const p = generateProblem('altitude', rng);
      const field = p.fields[0];
      // PA from elevations 0-7,000 and settings 29.20-30.60 stays within
      // -700..7,750; DA from PA 1,000-8,000 and OAT -10..35 stays within
      // -3,000..12,000. Either way, sane trainer numbers.
      expect(field.value).toBeGreaterThan(-3500);
      expect(field.value).toBeLessThan(12500);
    }
  });

  it('tas problems stay in a plausible envelope (no hot-and-high extremes)', () => {
    const rng = seededRng(21);
    for (let i = 0; i < ITERATIONS; i += 1) {
      const p = generateProblem('tas', rng);
      const field = p.fields[0];
      // CAS 90-140 with ISA-relative OAT keeps rule-of-thumb TAS below ~170
      // and never below CAS at very negative density altitudes by much.
      expect(field.value).toBeGreaterThan(80);
      expect(field.value).toBeLessThan(172);
    }
  });

  it('tsd time problems answer in minutes within a plausible leg length', () => {
    const rng = seededRng(13);
    for (let i = 0; i < ITERATIONS; i += 1) {
      const p = generateProblem('tsd', rng);
      const field = p.fields[0];
      if (field.id === 'time') {
        // 25-200 NM at 90-140 kts → roughly 10 min to 2.3 hr
        expect(field.value).toBeGreaterThan(9);
        expect(field.value).toBeLessThan(140);
      }
    }
  });
});

describe('gradeField', () => {
  const field: AnswerField = { id: 'gs', label: 'Ground speed', unit: 'kts', value: 100, tolerance: 2, places: 0 };

  it('within tolerance is correct, boundary included', () => {
    expect(gradeField(field, 100)).toBe('correct');
    expect(gradeField(field, 101.9)).toBe('correct');
    expect(gradeField(field, 102)).toBe('correct');
    expect(gradeField(field, 98)).toBe('correct');
  });

  it('within twice tolerance is close', () => {
    expect(gradeField(field, 102.1)).toBe('close');
    expect(gradeField(field, 104)).toBe('close');
    expect(gradeField(field, 96)).toBe('close');
  });

  it('beyond twice tolerance is off, as is a non-numeric entry', () => {
    expect(gradeField(field, 104.1)).toBe('off');
    expect(gradeField(field, 90)).toBe('off');
    expect(gradeField(field, NaN)).toBe('off');
  });

  it('grades headings on the circle: 001 vs 360 is 1 degree off, not 359', () => {
    const heading: AnswerField = { id: 'h', label: 'Heading', unit: '°', value: 360, tolerance: 2, places: 0, circular: true };
    expect(gradeField(heading, 1)).toBe('correct');
    expect(gradeField(heading, 359)).toBe('correct');
    expect(gradeField(heading, 4)).toBe('close');
    expect(gradeField(heading, 355)).toBe('off');
  });
});

describe('overallVerdict', () => {
  it('correct only when all fields correct; off if any field is off', () => {
    expect(overallVerdict(['correct', 'correct'])).toBe('correct');
    expect(overallVerdict(['correct', 'close'])).toBe('close');
    expect(overallVerdict(['close', 'close'])).toBe('close');
    expect(overallVerdict(['correct', 'off'])).toBe('off');
  });
});

describe('buildQueue', () => {
  it('builds the requested count and distributes categories evenly', () => {
    const rng = seededRng(99);
    const queue = buildQueue(['wind', 'fuel'], 10, rng);
    expect(queue).toHaveLength(10);
    const windCount = queue.filter((p) => p.category === 'wind').length;
    expect(windCount).toBe(5); // even split over full deck cycles
  });

  it('returns empty for no categories', () => {
    expect(buildQueue([], 10, seededRng(1))).toHaveLength(0);
  });
});
