/**
 * Flight computer trainer — practice problem generation and grading.
 *
 * Builds randomized, GA-plausible problems on top of the frozen engines in
 * engines.ts (the engines compute every answer — no math lives here), and
 * grades entered answers against stated per-type tolerance bands. Manual
 * flight computers read imprecisely by design, so "correct" is a band, not
 * an exact match: within tolerance = correct, within 2× = close, else off.
 */
import {
  cToF,
  densityAltitude,
  distanceFromSpeedTime,
  fToC,
  fuelBurned,
  fuelEndurance,
  fuelRequired,
  galToLbs,
  kmToNm,
  ktsToMph,
  lbsToGal,
  mphToKts,
  nmToKm,
  nmToSm,
  pressureAltitude,
  smToNm,
  speedFromDistanceTime,
  timeFromSpeedDistance,
  trueAirspeed,
  windTriangle,
} from './engines';

export type PracticeCategory = 'wind' | 'tsd' | 'fuel' | 'altitude' | 'tas' | 'convert';

export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  wind: 'Wind triangle',
  tsd: 'Time · speed · distance',
  fuel: 'Fuel',
  altitude: 'Altitudes',
  tas: 'True airspeed',
  convert: 'Conversions',
};

export interface AnswerField {
  id: string;
  /** Input label shown to the user, e.g. "True heading". */
  label: string;
  /** Unit shown with the input and in feedback, e.g. "°", "kts", "min". */
  unit: string;
  /** Correct answer at full precision. */
  value: number;
  /** ± band for a "correct" verdict; "close" is within twice this. */
  tolerance: number;
  /** Decimal places when displaying the computed answer. */
  places: number;
  /** Compass values: grade on circular difference so 001 vs 360 is 1°, not 359°. */
  circular?: boolean;
}

export interface PracticeProblem {
  category: PracticeCategory;
  categoryLabel: string;
  /** The question, e.g. "Find your true heading and ground speed." */
  title: string;
  /** Given values, one per line, e.g. "True course 090°". */
  givens: string[];
  fields: AnswerField[];
  /** Worked solution from the engine. */
  steps: string[];
  /** Optional method/rule-of-thumb note. */
  method?: string;
}

export type Verdict = 'correct' | 'close' | 'off';

export function gradeField(field: AnswerField, entered: number): Verdict {
  if (!Number.isFinite(entered)) return 'off';
  let diff = Math.abs(entered - field.value);
  if (field.circular) {
    const wrapped = Math.abs(((entered - field.value) % 360 + 540) % 360 - 180);
    diff = wrapped;
  }
  if (diff <= field.tolerance + 1e-9) return 'correct';
  if (diff <= field.tolerance * 2 + 1e-9) return 'close';
  return 'off';
}

/** Overall verdict: correct only if every field is correct; off if any field is off. */
export function overallVerdict(verdicts: Verdict[]): Verdict {
  if (verdicts.every((v) => v === 'correct')) return 'correct';
  if (verdicts.some((v) => v === 'off')) return 'off';
  return 'close';
}

// ---------------------------------------------------------------------------
// Randomization helpers — GA-plausible ranges
// ---------------------------------------------------------------------------

export type Rng = () => number;

const randInt = (rng: Rng, min: number, max: number): number => Math.floor(rng() * (max - min + 1)) + min;
const randStep = (rng: Rng, min: number, max: number, step: number): number =>
  min + step * randInt(rng, 0, Math.round((max - min) / step));
const pick = <T>(rng: Rng, items: T[]): T => items[randInt(rng, 0, items.length - 1)];

const fmtClock = (hours: number): string => {
  const totalMin = Math.round(hours * 60);
  return `${Math.floor(totalMin / 60)}:${String(totalMin % 60).padStart(2, '0')}`;
};
const pad3 = (deg: number): string => String(deg).padStart(3, '0');

/** Unwrap an engine result that is guaranteed valid for generated inputs. */
function must<T extends { ok: boolean }>(result: T | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(`generator produced invalid engine input: ${(result as { error: string }).error}`);
  return result as T;
}

// ---------------------------------------------------------------------------
// Per-category generators
// ---------------------------------------------------------------------------

function genWind(rng: Rng): PracticeProblem {
  const trueCourse = randStep(rng, 5, 360, 5);
  const trueAirspeedKts = randStep(rng, 90, 140, 5);
  const windDirection = randStep(rng, 10, 360, 10);
  const windSpeed = randStep(rng, 5, 40, 5);
  const r = must(windTriangle({ trueCourse, trueAirspeed: trueAirspeedKts, windDirection, windSpeed }));
  return {
    category: 'wind',
    categoryLabel: CATEGORY_LABELS.wind,
    title: 'Find your true heading and ground speed.',
    givens: [
      `True course ${pad3(trueCourse)}°`,
      `True airspeed ${trueAirspeedKts} kts`,
      `Wind ${pad3(windDirection)}° at ${windSpeed} kts`,
    ],
    fields: [
      { id: 'heading', label: 'True heading', unit: '°', value: r.trueHeading, tolerance: 2, places: 0, circular: true },
      { id: 'gs', label: 'Ground speed', unit: 'kts', value: r.groundSpeed, tolerance: 2, places: 0 },
    ],
    steps: r.steps,
    method: 'Same triangle as the wind side of your flight computer — wind vector against true course.',
  };
}

function genTsd(rng: Rng): PracticeProblem {
  const variant = pick(rng, ['time', 'speed', 'distance'] as const);

  if (variant === 'time') {
    const gs = randStep(rng, 90, 140, 5);
    const dist = randStep(rng, 25, 200, 5);
    const r = must(timeFromSpeedDistance(gs, dist));
    return {
      category: 'tsd',
      categoryLabel: CATEGORY_LABELS.tsd,
      title: 'How many minutes will this leg take?',
      givens: [`Ground speed ${gs} kts`, `Distance ${dist} NM`],
      fields: [{ id: 'time', label: 'Time', unit: 'min', value: r.value * 60, tolerance: 6, places: 0 }],
      steps: r.steps,
    };
  }

  if (variant === 'speed') {
    const gs = randStep(rng, 90, 140, 5);
    const hours = randStep(rng, 30, 120, 5) / 60; // 0:30–2:00 in 5-min steps
    const dist = Math.round(gs * hours);
    const r = must(speedFromDistanceTime(dist, hours));
    return {
      category: 'tsd',
      categoryLabel: CATEGORY_LABELS.tsd,
      title: 'What is your ground speed?',
      givens: [`Distance ${dist} NM`, `Time ${fmtClock(hours)}`],
      fields: [{ id: 'gs', label: 'Ground speed', unit: 'kts', value: r.value, tolerance: 2, places: 0 }],
      steps: r.steps,
    };
  }

  const gs = randStep(rng, 90, 140, 5);
  const hours = randStep(rng, 20, 110, 5) / 60; // 0:20–1:50
  const r = must(distanceFromSpeedTime(gs, hours));
  return {
    category: 'tsd',
    categoryLabel: CATEGORY_LABELS.tsd,
    title: 'How far will you travel?',
    givens: [`Ground speed ${gs} kts`, `Time ${fmtClock(hours)}`],
    fields: [{ id: 'dist', label: 'Distance', unit: 'NM', value: r.value, tolerance: 2, places: 0 }],
    steps: r.steps,
  };
}

function genFuel(rng: Rng): PracticeProblem {
  const variant = pick(rng, ['burned', 'endurance', 'required'] as const);
  const gph = randStep(rng, 60, 120, 5) / 10; // 6.0–12.0 in 0.5 steps

  if (variant === 'burned') {
    const hours = randStep(rng, 40, 180, 5) / 60; // 0:40–3:00
    const r = must(fuelBurned(gph, hours));
    return {
      category: 'fuel',
      categoryLabel: CATEGORY_LABELS.fuel,
      title: 'How much fuel will you burn?',
      givens: [`Burn rate ${gph} GPH`, `Time ${fmtClock(hours)}`],
      fields: [{ id: 'gal', label: 'Fuel burned', unit: 'gal', value: r.value, tolerance: 0.5, places: 1 }],
      steps: r.steps,
    };
  }

  if (variant === 'endurance') {
    const usable = randInt(rng, 24, 53);
    const r = must(fuelEndurance(usable, gph));
    return {
      category: 'fuel',
      categoryLabel: CATEGORY_LABELS.fuel,
      title: 'What is your endurance, in minutes?',
      givens: [`Usable fuel ${usable} gal`, `Burn rate ${gph} GPH`],
      fields: [{ id: 'min', label: 'Endurance', unit: 'min', value: r.value * 60, tolerance: 6, places: 0 }],
      steps: r.steps,
      method: 'Plan to be on the ground well before this — your legal reserve is a minimum, not a target.',
    };
  }

  const tripHours = randStep(rng, 60, 180, 5) / 60; // 1:00–3:00
  const reserveMin = pick(rng, [30, 45]);
  const r = must(fuelRequired(gph, tripHours, reserveMin / 60));
  return {
    category: 'fuel',
    categoryLabel: CATEGORY_LABELS.fuel,
    title: 'How much fuel do you need, including reserve?',
    givens: [`Burn rate ${gph} GPH`, `Trip time ${fmtClock(tripHours)}`, `Reserve ${reserveMin} min`],
    fields: [{ id: 'gal', label: 'Fuel required', unit: 'gal', value: r.value, tolerance: 0.5, places: 1 }],
    steps: r.steps,
  };
}

function genAltitude(rng: Rng): PracticeProblem {
  const variant = pick(rng, ['pa', 'da'] as const);

  if (variant === 'pa') {
    const elev = randStep(rng, 0, 7000, 10);
    const altimeter = randInt(rng, 2920, 3060) / 100; // 29.20–30.60
    const r = must(pressureAltitude(elev, altimeter));
    return {
      category: 'altitude',
      categoryLabel: CATEGORY_LABELS.altitude,
      title: 'Find the pressure altitude.',
      givens: [`Field elevation ${elev.toLocaleString('en-US')} ft`, `Altimeter ${altimeter.toFixed(2)} inHg`],
      fields: [{ id: 'pa', label: 'Pressure altitude', unit: 'ft', value: r.value, tolerance: 100, places: 0 }],
      steps: r.steps,
      method: 'Rule of thumb: about 1,000 ft per inch of pressure.',
    };
  }

  const pa = randStep(rng, 1000, 8000, 500);
  // OAT generated as ISA deviation (-20..+25 degC) so density altitude stays in
  // a plausible envelope instead of stacking max altitude on max heat.
  const isa = Math.round(15 - 2 * (pa / 1000));
  const oat = Math.max(-10, Math.min(35, isa + randInt(rng, -20, 25)));
  const r = must(densityAltitude(pa, oat));
  return {
    category: 'altitude',
    categoryLabel: CATEGORY_LABELS.altitude,
    title: 'Find the density altitude.',
    givens: [`Pressure altitude ${pa.toLocaleString('en-US')} ft`, `OAT ${oat} °C`],
    fields: [{ id: 'da', label: 'Density altitude', unit: 'ft', value: r.value, tolerance: 200, places: 0 }],
    steps: r.steps,
    method: 'Rule of thumb: about 120 ft per °C of ISA deviation.',
  };
}

function genTas(rng: Rng): PracticeProblem {
  const cas = randStep(rng, 90, 140, 5);
  const pa = randStep(rng, 2000, 8000, 500);
  // Same ISA-relative OAT as density altitude problems: keeps DA (and so TAS)
  // in the range a student actually sees, instead of hot-and-high extremes.
  const isa = Math.round(15 - 2 * (pa / 1000));
  const oat = Math.max(-10, Math.min(30, isa + randInt(rng, -15, 20)));
  const r = must(trueAirspeed(cas, pa, oat));
  return {
    category: 'tas',
    categoryLabel: CATEGORY_LABELS.tas,
    title: 'Find your true airspeed.',
    givens: [`Calibrated airspeed ${cas} kts`, `Pressure altitude ${pa.toLocaleString('en-US')} ft`, `OAT ${oat} °C`],
    fields: [{ id: 'tas', label: 'True airspeed', unit: 'kts', value: r.value, tolerance: 3, places: 0 }],
    steps: r.steps,
    method: 'Rule of thumb: add 2% of CAS per 1,000 ft of density altitude.',
  };
}

function genConvert(rng: Rng): PracticeProblem {
  const variants = [
    () => {
      const kts = randStep(rng, 60, 160, 5);
      const r = must(ktsToMph(kts));
      return { title: `Convert ${kts} kts to mph.`, field: { id: 'mph', label: 'Speed', unit: 'mph', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const mph = randStep(rng, 70, 185, 5);
      const r = must(mphToKts(mph));
      return { title: `Convert ${mph} mph to knots.`, field: { id: 'kts', label: 'Speed', unit: 'kts', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const nm = randStep(rng, 20, 300, 5);
      const r = must(nmToSm(nm));
      return { title: `Convert ${nm} NM to statute miles.`, field: { id: 'sm', label: 'Distance', unit: 'SM', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const sm = randStep(rng, 25, 345, 5);
      const r = must(smToNm(sm));
      return { title: `Convert ${sm} SM to nautical miles.`, field: { id: 'nm', label: 'Distance', unit: 'NM', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const nm = randStep(rng, 20, 300, 5);
      const r = must(nmToKm(nm));
      return { title: `Convert ${nm} NM to kilometers.`, field: { id: 'km', label: 'Distance', unit: 'km', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const km = randStep(rng, 40, 500, 10);
      const r = must(kmToNm(km));
      return { title: `Convert ${km} km to nautical miles.`, field: { id: 'nm', label: 'Distance', unit: 'NM', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const gal = randInt(rng, 5, 60);
      const r = must(galToLbs(gal));
      return { title: `Convert ${gal} gal of avgas to pounds.`, field: { id: 'lbs', label: 'Weight', unit: 'lbs', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const lbs = randStep(rng, 30, 360, 5);
      const r = must(lbsToGal(lbs));
      return { title: `Convert ${lbs} lbs of avgas to gallons.`, field: { id: 'gal', label: 'Fuel', unit: 'gal', value: r.value, tolerance: 0.5, places: 1 }, steps: r.steps };
    },
    () => {
      const c = randInt(rng, -20, 40);
      const r = must(cToF(c));
      return { title: `Convert ${c} °C to Fahrenheit.`, field: { id: 'f', label: 'Temperature', unit: '°F', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
    () => {
      const f = randStep(rng, 0, 104, 2);
      const r = must(fToC(f));
      return { title: `Convert ${f} °F to Celsius.`, field: { id: 'c', label: 'Temperature', unit: '°C', value: r.value, tolerance: 2, places: 0 }, steps: r.steps };
    },
  ];
  const v = pick(rng, variants)();
  return {
    category: 'convert',
    categoryLabel: CATEGORY_LABELS.convert,
    title: v.title,
    givens: [],
    fields: [v.field],
    steps: v.steps,
  };
}

const GENERATORS: Record<PracticeCategory, (rng: Rng) => PracticeProblem> = {
  wind: genWind,
  tsd: genTsd,
  fuel: genFuel,
  altitude: genAltitude,
  tas: genTas,
  convert: genConvert,
};

export function generateProblem(category: PracticeCategory, rng: Rng = Math.random): PracticeProblem {
  return GENERATORS[category](rng);
}

/**
 * Build a practice queue of `count` problems drawn evenly from the selected
 * categories (shuffled), so a 10-problem run over 3 categories doesn't
 * cluster.
 */
export function buildQueue(categories: PracticeCategory[], count: number, rng: Rng = Math.random): PracticeProblem[] {
  if (categories.length === 0) return [];
  const queue: PracticeProblem[] = [];
  let deck: PracticeCategory[] = [];
  for (let i = 0; i < count; i += 1) {
    if (deck.length === 0) {
      deck = [...categories];
      for (let j = deck.length - 1; j > 0; j -= 1) {
        const k = randInt(rng, 0, j);
        [deck[j], deck[k]] = [deck[k], deck[j]];
      }
    }
    queue.push(generateProblem(deck.pop() as PracticeCategory, rng));
  }
  return queue;
}
