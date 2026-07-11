/**
 * Aircraft-agnostic weight & balance math.
 *
 * All aircraft-specific numbers live in a profile object (see
 * `src/data/aircraft/`). Adding another aircraft (e.g. a 172S) means writing
 * a new profile file and a new route — no changes here.
 *
 * Uses relative imports (no `@/` alias) so the frozen unit test suite can run
 * under plain `node --test` with no bundler.
 */

export interface EnvelopePoint {
  weightLb: number;
  cgIn: number;
}

export interface TankOption {
  id: string;
  label: string;
  totalGal: number;
  usableGal: number;
}

export interface LoadStation {
  id: string;
  label: string;
  armIn: number;
  maxLb?: number;
  help?: string;
}

export interface StationGroupLimit {
  id: string;
  label: string;
  stationIds: string[];
  maxLb: number;
}

export interface AircraftWBProfile {
  id: string;
  /** e.g. "Cessna 150F" */
  name: string;
  /** e.g. "1966 model year — arms and envelopes vary across 150 variants." */
  modelYearNote: string;
  /** On-page citation, e.g. "1966 Cessna 150F Owner's Manual" */
  source: string;
  datumNote: string;
  maxGrossLb: number;
  /** e.g. ['Normal', 'Utility'] */
  categories: string[];
  categoryNote: string;
  envelope: {
    minWeightLb: number;
    maxWeightLb: number;
    /** Sorted ascending by weight. Piecewise-linear between points. */
    forwardLimit: EnvelopePoint[];
    /** Sorted ascending by weight. Piecewise-linear between points. */
    aftLimit: EnvelopePoint[];
  };
  loadStations: LoadStation[];
  groupLimits: StationGroupLimit[];
  fuel: {
    armIn: number;
    lbsPerGal: number;
    tankOptions: TankOption[];
    defaultTankId: string;
  };
  oil: {
    armIn: number;
    lbsPerQt: number;
    capacityQt: number;
    defaultQt: number;
    minOperatingQt: number;
  };
  /** Pre-filled example weighing record — numbers only, always user-editable. */
  defaultEmpty: {
    weightLb: number;
    cgIn: number;
    momentInLb: number;
  };
}

export interface WBInputs {
  emptyWeightLb: number;
  emptyMomentInLb: number;
  oilQt: number;
  /** Keyed by LoadStation id; missing keys read as 0. */
  stationWeightsLb: Record<string, number>;
  tankId: string;
  fuelGal: number;
  fuelBurnGal: number;
}

export type IssueKind = 'limit' | 'invalid' | 'info';

export interface WBIssue {
  code: string;
  kind: IssueKind;
  message: string;
}

export interface WBStationRow {
  id: string;
  label: string;
  armIn: number;
  weightLb: number;
  momentInLb: number;
}

export type ConditionId = 'zeroFuel' | 'takeoff' | 'landing';

export interface WBConditionResult {
  id: ConditionId;
  label: string;
  weightLb: number;
  momentInLb: number;
  cgIn: number;
  issues: WBIssue[];
}

export interface WBResult {
  rows: WBStationRow[];
  tank: TankOption;
  oilWeightLb: number;
  fuelWeightLb: number;
  fuelBurnLb: number;
  usefulLoadLb: number;
  inputIssues: WBIssue[];
  zeroFuel: WBConditionResult;
  takeoff: WBConditionResult;
  /** null when fuel burn exceeds fuel on board (invalid input). */
  landing: WBConditionResult | null;
  allIssues: WBIssue[];
}

const EPS = 1e-6;

export function fmtLb(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function fmtIn(n: number): string {
  return (Math.round(n * 100) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

export function fmtGal(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

/**
 * Piecewise-linear CG limit at a given weight.
 * Points must be sorted ascending by weight. Weights outside the charted
 * range clamp to the nearest endpoint's CG value (so an over-gross condition
 * still gets a meaningful forward/aft check at the top of the envelope).
 */
export function limitAt(points: EnvelopePoint[], weightLb: number): number {
  if (points.length === 0) throw new Error('limitAt: no envelope points');
  if (weightLb <= points[0].weightLb) return points[0].cgIn;
  const last = points[points.length - 1];
  if (weightLb >= last.weightLb) return last.cgIn;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (weightLb >= a.weightLb && weightLb <= b.weightLb) {
      const t = (weightLb - a.weightLb) / (b.weightLb - a.weightLb);
      return a.cgIn + t * (b.cgIn - a.cgIn);
    }
  }
  return last.cgIn;
}

export function forwardLimitAt(profile: AircraftWBProfile, weightLb: number): number {
  return limitAt(profile.envelope.forwardLimit, weightLb);
}

export function aftLimitAt(profile: AircraftWBProfile, weightLb: number): number {
  return limitAt(profile.envelope.aftLimit, weightLb);
}

function clampNonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function checkEnvelope(
  profile: AircraftWBProfile,
  label: string,
  weightLb: number,
  cgIn: number,
): WBIssue[] {
  const issues: WBIssue[] = [];
  const overGross = weightLb - profile.maxGrossLb;
  if (overGross > EPS) {
    issues.push({
      code: 'over-max-gross',
      kind: 'limit',
      message: `${label}: ${fmtLb(weightLb)} lb exceeds the ${fmtLb(profile.maxGrossLb)} lb maximum gross weight by ${fmtLb(overGross)} lb.`,
    });
  }
  if (profile.envelope.minWeightLb - weightLb > EPS) {
    issues.push({
      code: 'below-envelope-min-weight',
      kind: 'info',
      message: `${label}: ${fmtLb(weightLb)} lb is below the lowest weight shown on the envelope (${fmtLb(profile.envelope.minWeightLb)} lb) — the chart doesn't cover this condition.`,
    });
  }
  const fwd = forwardLimitAt(profile, weightLb);
  if (fwd - cgIn > EPS) {
    issues.push({
      code: 'cg-forward-of-limit',
      kind: 'limit',
      message: `${label}: CG ${fmtIn(cgIn)} in is forward of the forward limit (${fmtIn(fwd)} in at ${fmtLb(weightLb)} lb) by ${fmtIn(fwd - cgIn)} in.`,
    });
  }
  const aft = aftLimitAt(profile, weightLb);
  if (cgIn - aft > EPS) {
    issues.push({
      code: 'cg-aft-of-limit',
      kind: 'limit',
      message: `${label}: CG ${fmtIn(cgIn)} in is aft of the aft limit (${fmtIn(aft)} in) by ${fmtIn(cgIn - aft)} in.`,
    });
  }
  return issues;
}

export function computeWB(profile: AircraftWBProfile, rawInputs: WBInputs): WBResult {
  const tank =
    profile.fuel.tankOptions.find((t) => t.id === rawInputs.tankId) ??
    profile.fuel.tankOptions.find((t) => t.id === profile.fuel.defaultTankId) ??
    profile.fuel.tankOptions[0];

  const emptyWeightLb = clampNonNegative(rawInputs.emptyWeightLb);
  const emptyMomentInLb = Number.isFinite(rawInputs.emptyMomentInLb)
    ? rawInputs.emptyMomentInLb
    : 0;
  const oilQt = clampNonNegative(rawInputs.oilQt);
  const fuelGal = clampNonNegative(rawInputs.fuelGal);
  const fuelBurnGal = clampNonNegative(rawInputs.fuelBurnGal);

  const inputIssues: WBIssue[] = [];

  // Per-station weights + per-station limits
  const stationRows: WBStationRow[] = profile.loadStations.map((s) => {
    const weightLb = clampNonNegative(rawInputs.stationWeightsLb[s.id] ?? 0);
    if (s.maxLb !== undefined && weightLb - s.maxLb > EPS) {
      inputIssues.push({
        code: `station-over-max:${s.id}`,
        kind: 'limit',
        message: `${s.label} is ${fmtLb(weightLb)} lb — exceeds its ${fmtLb(s.maxLb)} lb limit by ${fmtLb(weightLb - s.maxLb)} lb.`,
      });
    }
    return {
      id: s.id,
      label: s.label,
      armIn: s.armIn,
      weightLb,
      momentInLb: weightLb * s.armIn,
    };
  });

  // Combined limits (e.g. baggage areas 1 + 2)
  for (const group of profile.groupLimits) {
    const total = group.stationIds.reduce(
      (sum, id) => sum + (stationRows.find((r) => r.id === id)?.weightLb ?? 0),
      0,
    );
    if (total - group.maxLb > EPS) {
      inputIssues.push({
        code: `group-over-max:${group.id}`,
        kind: 'limit',
        message: `${group.label} is ${fmtLb(total)} lb — exceeds the ${fmtLb(group.maxLb)} lb combined limit by ${fmtLb(total - group.maxLb)} lb.`,
      });
    }
  }

  // Fuel checks
  if (fuelGal - tank.usableGal > EPS) {
    inputIssues.push({
      code: 'fuel-over-usable',
      kind: 'limit',
      message: `Fuel is ${fmtGal(fuelGal)} gal — exceeds the ${fmtGal(tank.usableGal)} gal usable capacity of the ${tank.label.toLowerCase()} by ${fmtGal(fuelGal - tank.usableGal)} gal.`,
    });
  }
  const burnExceedsFuel = fuelBurnGal - fuelGal > EPS;
  if (burnExceedsFuel) {
    inputIssues.push({
      code: 'burn-exceeds-fuel',
      kind: 'invalid',
      message: `Fuel burn (${fmtGal(fuelBurnGal)} gal) exceeds fuel on board (${fmtGal(fuelGal)} gal) — landing numbers can't be computed.`,
    });
  }

  // Oil checks
  if (oilQt - profile.oil.capacityQt > EPS) {
    inputIssues.push({
      code: 'oil-over-capacity',
      kind: 'limit',
      message: `Oil is ${fmtGal(oilQt)} qt — exceeds the ${fmtGal(profile.oil.capacityQt)} qt sump capacity by ${fmtGal(oilQt - profile.oil.capacityQt)} qt.`,
    });
  } else if (oilQt > EPS && profile.oil.minOperatingQt - oilQt > EPS) {
    inputIssues.push({
      code: 'oil-below-min',
      kind: 'info',
      message: `Oil is ${fmtGal(oilQt)} qt — below the ${fmtGal(profile.oil.minOperatingQt)} qt minimum for normal operation in the owner's manual.`,
    });
  }

  const oilWeightLb = oilQt * profile.oil.lbsPerQt;
  const oilMomentInLb = oilWeightLb * profile.oil.armIn;
  const fuelWeightLb = fuelGal * profile.fuel.lbsPerGal;
  const fuelMomentInLb = fuelWeightLb * profile.fuel.armIn;
  const fuelBurnLb = fuelBurnGal * profile.fuel.lbsPerGal;

  const rows: WBStationRow[] = [
    {
      id: 'empty',
      label: 'Basic empty weight',
      armIn: emptyWeightLb > 0 ? emptyMomentInLb / emptyWeightLb : 0,
      weightLb: emptyWeightLb,
      momentInLb: emptyMomentInLb,
    },
    {
      id: 'oil',
      label: `Oil (${fmtGal(oilQt)} qt)`,
      armIn: profile.oil.armIn,
      weightLb: oilWeightLb,
      momentInLb: oilMomentInLb,
    },
    ...stationRows,
    {
      id: 'fuel',
      label: `Fuel (${fmtGal(fuelGal)} gal usable)`,
      armIn: profile.fuel.armIn,
      weightLb: fuelWeightLb,
      momentInLb: fuelMomentInLb,
    },
  ];

  const stationsWeight = stationRows.reduce((s, r) => s + r.weightLb, 0);
  const stationsMoment = stationRows.reduce((s, r) => s + r.momentInLb, 0);

  const zfWeight = emptyWeightLb + oilWeightLb + stationsWeight;
  const zfMoment = emptyMomentInLb + oilMomentInLb + stationsMoment;
  const toWeight = zfWeight + fuelWeightLb;
  const toMoment = zfMoment + fuelMomentInLb;
  const ldWeight = toWeight - fuelBurnLb;
  const ldMoment = toMoment - fuelBurnLb * profile.fuel.armIn;

  const makeCondition = (
    id: ConditionId,
    label: string,
    weightLb: number,
    momentInLb: number,
  ): WBConditionResult => {
    const cgIn = weightLb > 0 ? momentInLb / weightLb : 0;
    return {
      id,
      label,
      weightLb,
      momentInLb,
      cgIn,
      issues: checkEnvelope(profile, label, weightLb, cgIn),
    };
  };

  const zeroFuel = makeCondition('zeroFuel', 'Zero fuel', zfWeight, zfMoment);
  const takeoff = makeCondition('takeoff', 'Takeoff', toWeight, toMoment);
  const landing = burnExceedsFuel
    ? null
    : makeCondition('landing', 'Landing', ldWeight, ldMoment);

  const usefulLoadLb = profile.maxGrossLb - emptyWeightLb - oilWeightLb;

  const allIssues = [
    ...inputIssues,
    ...zeroFuel.issues,
    ...takeoff.issues,
    ...(landing?.issues ?? []),
  ];

  return {
    rows,
    tank,
    oilWeightLb,
    fuelWeightLb,
    fuelBurnLb,
    usefulLoadLb,
    inputIssues,
    zeroFuel,
    takeoff,
    landing,
    allIssues,
  };
}
