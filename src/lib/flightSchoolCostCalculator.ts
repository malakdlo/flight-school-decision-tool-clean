export const COST_CALCULATOR_SOURCE_PAGE = '/tools/flight-school-cost-calculator/';
export const COST_CALCULATOR_LEAD_MAGNET = 'flight_school_cost_calculator';

export type TrainingGoal = 'sport' | 'ppl' | 'ppl-ir' | 'commercial' | 'career';
export type PhaseId = 'sport' | 'ppl' | 'ir' | 'cpl' | 'cfi';

export interface RateInputs {
  aircraft: number;
  instructor: number;
  complex: number;
  sim: number;
}

export interface PhaseInputs {
  dualHrs?: number;
  soloHrs?: number;
  simHrs?: number;
  buildHrs?: number;
  complexHrs?: number;
  groundHrs?: number;
  materials?: number;
  written?: number;
  checkride?: number;
}

export interface ExtraInputs {
  medical: number;
  headset: number;
  efb: number;
  supplies: number;
}

export interface CostCalculatorState {
  goal: TrainingGoal;
  rates: RateInputs;
  phases: Record<PhaseId, PhaseInputs>;
  extras: ExtraInputs;
}

export interface PhaseTotal {
  real: number;
  low: number;
  high: number;
  hours: number;
}

export interface CostCalculatorTotals {
  per: Partial<Record<PhaseId, PhaseTotal>>;
  extras: number;
  low: number;
  real: number;
  high: number;
  hours: number;
  goal: TrainingGoalMeta;
}

export interface TrainingGoalMeta {
  id: TrainingGoal;
  label: string;
  blurb: string;
  phases: PhaseId[];
}

export interface PhaseMeta {
  name: string;
  desc: string;
  fields: Array<{ key: keyof PhaseInputs; label: string; unit: '$' | 'hrs' }>;
}

const LOW_MULTIPLIER = 0.85;
const HIGH_MULTIPLIER = 1.3;

export const DEFAULT_COST_CALCULATOR_STATE: CostCalculatorState = {
  goal: 'ppl',
  rates: {
    aircraft: 185,
    instructor: 75,
    complex: 265,
    sim: 95,
  },
  phases: {
    sport: { dualHrs: 25, soloHrs: 5, groundHrs: 10, materials: 300, written: 175, checkride: 750 },
    ppl: { dualHrs: 45, soloHrs: 15, groundHrs: 15, materials: 400, written: 175, checkride: 850 },
    ir: { dualHrs: 30, simHrs: 10, groundHrs: 15, materials: 350, written: 175, checkride: 950 },
    cpl: { dualHrs: 20, buildHrs: 95, complexHrs: 10, groundHrs: 10, materials: 250, written: 175, checkride: 1000 },
    cfi: { dualHrs: 15, groundHrs: 25, materials: 300, written: 350, checkride: 1200 },
  },
  extras: {
    medical: 165,
    headset: 400,
    efb: 700,
    supplies: 250,
  },
};

export const TRAINING_GOALS: TrainingGoalMeta[] = [
  { id: 'sport', label: 'Sport Pilot', blurb: 'Fly light-sport aircraft for fun.', phases: ['sport'] },
  { id: 'ppl', label: 'Private Pilot (PPL)', blurb: 'The foundation license for personal flying.', phases: ['ppl'] },
  { id: 'ppl-ir', label: 'PPL + Instrument Rating', blurb: 'Add all-weather capability and safety margin.', phases: ['ppl', 'ir'] },
  { id: 'commercial', label: 'Commercial Pilot', blurb: 'Plan through the 250-hour commercial threshold.', phases: ['ppl', 'ir', 'cpl'] },
  { id: 'career', label: 'Full Career Path (through CFI)', blurb: 'PPL, instrument, commercial, and CFI.', phases: ['ppl', 'ir', 'cpl', 'cfi'] },
];

export const PHASE_META: Record<PhaseId, PhaseMeta> = {
  sport: {
    name: 'Sport Pilot Certificate',
    desc: 'Light-sport aircraft, daytime VFR flying',
    fields: [
      { key: 'dualHrs', label: 'Dual instruction', unit: 'hrs' },
      { key: 'soloHrs', label: 'Solo practice', unit: 'hrs' },
      { key: 'groundHrs', label: 'Ground instruction', unit: 'hrs' },
      { key: 'materials', label: 'Ground school & materials', unit: '$' },
      { key: 'written', label: 'FAA written exam', unit: '$' },
      { key: 'checkride', label: 'Checkride (DPE fee)', unit: '$' },
    ],
  },
  ppl: {
    name: 'Private Pilot License (PPL)',
    desc: 'Foundation license for all pilot training',
    fields: [
      { key: 'dualHrs', label: 'Dual instruction', unit: 'hrs' },
      { key: 'soloHrs', label: 'Solo practice', unit: 'hrs' },
      { key: 'groundHrs', label: 'Ground instruction', unit: 'hrs' },
      { key: 'materials', label: 'Ground school & materials', unit: '$' },
      { key: 'written', label: 'FAA written exam', unit: '$' },
      { key: 'checkride', label: 'Checkride (DPE fee)', unit: '$' },
    ],
  },
  ir: {
    name: 'Instrument Rating (IR)',
    desc: 'Fly in clouds and low-visibility conditions',
    fields: [
      { key: 'dualHrs', label: 'Dual instrument instruction', unit: 'hrs' },
      { key: 'simHrs', label: 'Simulator / AATD', unit: 'hrs' },
      { key: 'groundHrs', label: 'Ground instruction', unit: 'hrs' },
      { key: 'materials', label: 'Course & materials', unit: '$' },
      { key: 'written', label: 'FAA written exam', unit: '$' },
      { key: 'checkride', label: 'Checkride (DPE fee)', unit: '$' },
    ],
  },
  cpl: {
    name: 'Commercial Pilot License (CPL)',
    desc: 'Get paid to fly passengers or cargo',
    fields: [
      { key: 'dualHrs', label: 'Dual instruction', unit: 'hrs' },
      { key: 'buildHrs', label: 'Time building (solo)', unit: 'hrs' },
      { key: 'complexHrs', label: 'Complex / TAA aircraft', unit: 'hrs' },
      { key: 'groundHrs', label: 'Ground instruction', unit: 'hrs' },
      { key: 'materials', label: 'Course & materials', unit: '$' },
      { key: 'written', label: 'FAA written exam', unit: '$' },
      { key: 'checkride', label: 'Checkride (DPE fee)', unit: '$' },
    ],
  },
  cfi: {
    name: 'Certified Flight Instructor (CFI)',
    desc: 'Teach others and build hours toward the airlines',
    fields: [
      { key: 'dualHrs', label: 'Dual instruction', unit: 'hrs' },
      { key: 'groundHrs', label: 'Ground instruction', unit: 'hrs' },
      { key: 'materials', label: 'Course & materials', unit: '$' },
      { key: 'written', label: 'FAA writtens (FOI + FIA)', unit: '$' },
      { key: 'checkride', label: 'Checkride (DPE fee)', unit: '$' },
    ],
  },
};

export const RATE_FIELDS: Array<{ key: keyof RateInputs; label: string }> = [
  { key: 'aircraft', label: 'Aircraft rental / hr' },
  { key: 'instructor', label: 'Instructor (CFI) / hr' },
  { key: 'complex', label: 'Complex / TAA rental / hr' },
  { key: 'sim', label: 'Simulator / AATD / hr' },
];

export const EXTRA_FIELDS: Array<{ key: keyof ExtraInputs; label: string }> = [
  { key: 'medical', label: 'FAA medical exam' },
  { key: 'headset', label: 'Aviation headset' },
  { key: 'efb', label: 'iPad + EFB app' },
  { key: 'supplies', label: 'Books, charts & supplies' },
];

export function calculatePhaseTotal(state: CostCalculatorState, phaseId: PhaseId): PhaseTotal {
  const phase = state.phases[phaseId];
  const rates = state.rates;
  const hourCost =
    value(phase.dualHrs) * (rates.aircraft + rates.instructor) +
    value(phase.soloHrs) * rates.aircraft +
    value(phase.simHrs) * rates.sim +
    value(phase.buildHrs) * rates.aircraft +
    value(phase.complexHrs) * (rates.complex + rates.instructor) +
    value(phase.groundHrs) * rates.instructor;
  const fixed = value(phase.materials) + value(phase.written) + value(phase.checkride);
  const real = hourCost + fixed;
  const hours =
    value(phase.dualHrs) +
    value(phase.soloHrs) +
    value(phase.simHrs) +
    value(phase.buildHrs) +
    value(phase.complexHrs);

  return {
    real: roundCurrency(real),
    low: roundCurrency(hourCost * LOW_MULTIPLIER + fixed),
    high: roundCurrency(hourCost * HIGH_MULTIPLIER + fixed),
    hours,
  };
}

export function calculateExtrasTotal(state: CostCalculatorState): number {
  return roundCurrency(EXTRA_FIELDS.reduce((sum, item) => sum + state.extras[item.key], 0));
}

export function calculateFlightSchoolCost(state: CostCalculatorState): CostCalculatorTotals {
  const goal = TRAINING_GOALS.find((item) => item.id === state.goal) || TRAINING_GOALS[1];
  const per: Partial<Record<PhaseId, PhaseTotal>> = {};
  let low = 0;
  let real = 0;
  let high = 0;
  let hours = 0;

  for (const phaseId of goal.phases) {
    const total = calculatePhaseTotal(state, phaseId);
    per[phaseId] = total;
    low += total.low;
    real += total.real;
    high += total.high;
    hours += total.hours;
  }

  const extras = calculateExtrasTotal(state);

  return {
    per,
    extras,
    low: roundCurrency(low + extras),
    real: roundCurrency(real + extras),
    high: roundCurrency(high + extras),
    hours,
    goal,
  };
}

export function roundCurrency(value: number): number {
  return Math.round(Number.isFinite(value) ? value : 0);
}

export function formatCurrency(value: number): string {
  return `$${roundCurrency(value).toLocaleString('en-US')}`;
}

function value(input: number | undefined): number {
  return Number.isFinite(input) ? Number(input) : 0;
}
