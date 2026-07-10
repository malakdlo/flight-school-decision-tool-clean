/**
 * Flight computer trainer — calculation engines.
 *
 * Pure functions, no DOM, no side effects. Each engine returns the computed
 * values plus `steps`: the worked solution as plain-English lines. The steps
 * drive both the calculator's "how this is computed" panel and practice-mode
 * graded solutions, so the math and its explanation stay in one tested place.
 *
 * Methods are the standard manual-flight-computer (E6B-style) rules of thumb
 * student pilots learn, not exact atmospheric models. Each function's JSDoc
 * states the method used.
 *
 * Frozen after verification — see engines.test.ts. Do not change formulas
 * without re-running the verification cases.
 */

const DEG = Math.PI / 180;

const round = (value: number, places = 0): number => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/** Format for step text: whole numbers stay whole, otherwise 1 decimal. */
const fmt = (value: number, places = 1): string => {
  const r = round(value, places);
  return String(Object.is(r, -0) ? 0 : r);
};

/** Normalize a direction to (0, 360] — 360 displays as 360, not 0. */
export const normalizeHeading = (degrees: number): number => {
  const wrapped = ((degrees % 360) + 360) % 360;
  return wrapped === 0 ? 360 : wrapped;
};

/** Normalize a relative angle to (-180, 180]. */
const relativeAngle = (degrees: number): number => {
  const wrapped = ((degrees % 360) + 360) % 360;
  return wrapped > 180 ? wrapped - 360 : wrapped;
};

const pad3 = (direction: number): string => String(normalizeHeading(direction)).padStart(3, '0');

export type EngineError = { ok: false; error: string };

const err = (error: string): EngineError => ({ ok: false, error });

// ---------------------------------------------------------------------------
// Wind triangle
// ---------------------------------------------------------------------------

export interface WindTriangleInput {
  /** True course, degrees true (0–360]. */
  trueCourse: number;
  /** True airspeed, knots. */
  trueAirspeed: number;
  /** Direction the wind blows FROM, degrees true (0–360]. */
  windDirection: number;
  /** Wind speed, knots. */
  windSpeed: number;
}

export interface WindTriangleResult {
  ok: true;
  /** Wind correction angle, degrees. Positive = crab right, negative = crab left. */
  windCorrectionAngle: number;
  /** True heading = true course + WCA, degrees (0, 360]. */
  trueHeading: number;
  /** Ground speed, knots. */
  groundSpeed: number;
  /** Wind component along course, knots. Positive = headwind, negative = tailwind. */
  headwindComponent: number;
  /** Wind component across course, knots. Positive = from the right, negative = from the left. */
  crosswindComponent: number;
  steps: string[];
}

/**
 * Solve the wind triangle for WCA, true heading, and ground speed.
 *
 * Method (law of sines, same triangle an E6B solves graphically):
 *   wind angle      β   = wind direction − true course
 *   WCA                 = asin(wind speed × sin β ÷ TAS)
 *   true heading        = true course + WCA
 *   ground speed        = TAS × cos(WCA) − wind speed × cos β
 */
export function windTriangle(input: WindTriangleInput): WindTriangleResult | EngineError {
  const { trueCourse, trueAirspeed, windDirection, windSpeed } = input;

  if (!Number.isFinite(trueCourse) || !Number.isFinite(trueAirspeed) || !Number.isFinite(windDirection) || !Number.isFinite(windSpeed)) {
    return err('Enter a number in every field.');
  }
  if (trueAirspeed <= 0) return err('True airspeed must be greater than zero.');
  if (windSpeed < 0) return err('Wind speed cannot be negative.');
  if (trueCourse < 0 || trueCourse > 360 || windDirection < 0 || windDirection > 360) {
    return err('Directions must be between 0 and 360 degrees.');
  }
  if (windSpeed >= trueAirspeed) {
    return err('Wind speed is at or above your true airspeed — the aircraft cannot hold this course. Check your inputs.');
  }

  const windAngle = relativeAngle(windDirection - trueCourse);
  const windAngleRad = windAngle * DEG;
  const sinWca = (windSpeed * Math.sin(windAngleRad)) / trueAirspeed;
  const wcaRad = Math.asin(sinWca);
  const windCorrectionAngle = wcaRad / DEG;
  const trueHeading = normalizeHeading(trueCourse + windCorrectionAngle);
  const groundSpeed = trueAirspeed * Math.cos(wcaRad) - windSpeed * Math.cos(windAngleRad);
  const headwindComponent = windSpeed * Math.cos(windAngleRad);
  const crosswindComponent = windSpeed * Math.sin(windAngleRad);

  const crabSide = windCorrectionAngle > 0.05 ? ' (crab right)' : windCorrectionAngle < -0.05 ? ' (crab left)' : ' (no crab needed)';

  return {
    ok: true,
    windCorrectionAngle,
    trueHeading,
    groundSpeed,
    headwindComponent,
    crosswindComponent,
    steps: [
      `Wind angle = wind direction − true course = ${pad3(windDirection)}° − ${pad3(trueCourse)}° = ${fmt(windAngle)}° ${windAngle >= 0 ? '(wind from the right of course)' : '(wind from the left of course)'}`,
      `WCA = asin(wind speed × sin(wind angle) ÷ TAS) = asin(${fmt(windSpeed)} × sin(${fmt(windAngle)}°) ÷ ${fmt(trueAirspeed)}) = ${fmt(windCorrectionAngle)}°${crabSide}`,
      `True heading = true course + WCA = ${pad3(trueCourse)}° ${windCorrectionAngle < 0 ? '−' : '+'} ${fmt(Math.abs(windCorrectionAngle))}° = ${fmt(trueHeading)}°`,
      `Ground speed = TAS × cos(WCA) − wind speed × cos(wind angle) = ${fmt(trueAirspeed)} × cos(${fmt(windCorrectionAngle)}°) − ${fmt(windSpeed)} × cos(${fmt(windAngle)}°) = ${fmt(groundSpeed)} kts`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Time / speed / distance
// ---------------------------------------------------------------------------

export interface ValueResult {
  ok: true;
  value: number;
  steps: string[];
}

/** Time (hours) = distance ÷ ground speed. */
export function timeFromSpeedDistance(groundSpeedKts: number, distanceNm: number): ValueResult | EngineError {
  if (!Number.isFinite(groundSpeedKts) || !Number.isFinite(distanceNm)) return err('Enter a number in every field.');
  if (groundSpeedKts <= 0) return err('Ground speed must be greater than zero.');
  if (distanceNm < 0) return err('Distance cannot be negative.');
  const hours = distanceNm / groundSpeedKts;
  return {
    ok: true,
    value: hours,
    steps: [
      `Time = distance ÷ ground speed = ${fmt(distanceNm)} NM ÷ ${fmt(groundSpeedKts)} kts = ${fmt(hours, 2)} hr`,
      `${fmt(hours, 2)} hr × 60 = ${fmt(hours * 60)} minutes`,
    ],
  };
}

/** Ground speed (kts) = distance ÷ time. */
export function speedFromDistanceTime(distanceNm: number, hours: number): ValueResult | EngineError {
  if (!Number.isFinite(distanceNm) || !Number.isFinite(hours)) return err('Enter a number in every field.');
  if (hours <= 0) return err('Time must be greater than zero.');
  if (distanceNm < 0) return err('Distance cannot be negative.');
  const speed = distanceNm / hours;
  return {
    ok: true,
    value: speed,
    steps: [`Ground speed = distance ÷ time = ${fmt(distanceNm)} NM ÷ ${fmt(hours, 2)} hr = ${fmt(speed)} kts`],
  };
}

/** Distance (NM) = ground speed × time. */
export function distanceFromSpeedTime(groundSpeedKts: number, hours: number): ValueResult | EngineError {
  if (!Number.isFinite(groundSpeedKts) || !Number.isFinite(hours)) return err('Enter a number in every field.');
  if (groundSpeedKts <= 0) return err('Ground speed must be greater than zero.');
  if (hours < 0) return err('Time cannot be negative.');
  const distance = groundSpeedKts * hours;
  return {
    ok: true,
    value: distance,
    steps: [`Distance = ground speed × time = ${fmt(groundSpeedKts)} kts × ${fmt(hours, 2)} hr = ${fmt(distance)} NM`],
  };
}

// ---------------------------------------------------------------------------
// Fuel
// ---------------------------------------------------------------------------

/** Fuel burned (gal) = burn rate (GPH) × time (hours). */
export function fuelBurned(gph: number, hours: number): ValueResult | EngineError {
  if (!Number.isFinite(gph) || !Number.isFinite(hours)) return err('Enter a number in every field.');
  if (gph <= 0) return err('Fuel burn rate must be greater than zero.');
  if (hours < 0) return err('Time cannot be negative.');
  const gallons = gph * hours;
  return {
    ok: true,
    value: gallons,
    steps: [`Fuel burned = burn rate × time = ${fmt(gph)} GPH × ${fmt(hours, 2)} hr = ${fmt(gallons, 1)} gal`],
  };
}

/** Endurance (hours) = usable fuel (gal) ÷ burn rate (GPH). */
export function fuelEndurance(usableGallons: number, gph: number): ValueResult | EngineError {
  if (!Number.isFinite(usableGallons) || !Number.isFinite(gph)) return err('Enter a number in every field.');
  if (gph <= 0) return err('Fuel burn rate must be greater than zero.');
  if (usableGallons < 0) return err('Usable fuel cannot be negative.');
  const hours = usableGallons / gph;
  return {
    ok: true,
    value: hours,
    steps: [
      `Endurance = usable fuel ÷ burn rate = ${fmt(usableGallons, 1)} gal ÷ ${fmt(gph)} GPH = ${fmt(hours, 2)} hr`,
      `${fmt(hours, 2)} hr × 60 = ${fmt(hours * 60)} minutes`,
    ],
  };
}

/** Fuel required (gal) = burn rate × (trip time + reserve time). */
export function fuelRequired(gph: number, tripHours: number, reserveHours = 0): ValueResult | EngineError {
  if (!Number.isFinite(gph) || !Number.isFinite(tripHours) || !Number.isFinite(reserveHours)) {
    return err('Enter a number in every field.');
  }
  if (gph <= 0) return err('Fuel burn rate must be greater than zero.');
  if (tripHours < 0 || reserveHours < 0) return err('Time cannot be negative.');
  const totalHours = tripHours + reserveHours;
  const gallons = gph * totalHours;
  const steps =
    reserveHours > 0
      ? [
          `Total time = trip + reserve = ${fmt(tripHours, 2)} hr + ${fmt(reserveHours, 2)} hr = ${fmt(totalHours, 2)} hr`,
          `Fuel required = burn rate × total time = ${fmt(gph)} GPH × ${fmt(totalHours, 2)} hr = ${fmt(gallons, 1)} gal`,
        ]
      : [`Fuel required = burn rate × time = ${fmt(gph)} GPH × ${fmt(tripHours, 2)} hr = ${fmt(gallons, 1)} gal`];
  return { ok: true, value: gallons, steps };
}

// ---------------------------------------------------------------------------
// Altitudes
// ---------------------------------------------------------------------------

/**
 * Pressure altitude (ft) = field elevation + (29.92 − altimeter setting) × 1,000.
 * Standard rule of thumb: 1 inHg ≈ 1,000 ft.
 */
export function pressureAltitude(fieldElevationFt: number, altimeterInHg: number): ValueResult | EngineError {
  if (!Number.isFinite(fieldElevationFt) || !Number.isFinite(altimeterInHg)) return err('Enter a number in every field.');
  if (altimeterInHg < 28 || altimeterInHg > 31.5) {
    return err('Altimeter setting should be between 28.00 and 31.50 inHg.');
  }
  const correction = (29.92 - altimeterInHg) * 1000;
  const pa = fieldElevationFt + correction;
  return {
    ok: true,
    value: pa,
    steps: [
      `Correction = (29.92 − altimeter setting) × 1,000 = (29.92 − ${altimeterInHg.toFixed(2)}) × 1,000 = ${fmt(correction)} ft`,
      `Pressure altitude = field elevation + correction = ${fmt(fieldElevationFt)} + ${fmt(correction)} = ${fmt(pa)} ft`,
    ],
  };
}

/** ISA standard temperature (°C) at a pressure altitude: 15 − 2 × (altitude ÷ 1,000). */
export function isaTemperature(pressureAltitudeFt: number): number {
  return 15 - 2 * (pressureAltitudeFt / 1000);
}

/**
 * Density altitude (ft) = pressure altitude + 120 × (OAT − ISA temp).
 * Standard rule of thumb: 120 ft per °C above/below ISA.
 */
export function densityAltitude(pressureAltitudeFt: number, oatC: number): ValueResult | EngineError {
  if (!Number.isFinite(pressureAltitudeFt) || !Number.isFinite(oatC)) return err('Enter a number in every field.');
  if (pressureAltitudeFt < -2000 || pressureAltitudeFt > 20000) {
    return err('Pressure altitude should be between −2,000 and 20,000 ft for this trainer.');
  }
  if (oatC < -60 || oatC > 60) return err('Temperature should be between −60 and 60 °C.');
  const isa = isaTemperature(pressureAltitudeFt);
  const deviation = oatC - isa;
  const da = pressureAltitudeFt + 120 * deviation;
  return {
    ok: true,
    value: da,
    steps: [
      `ISA temp at ${fmt(pressureAltitudeFt)} ft = 15 − 2 × (${fmt(pressureAltitudeFt)} ÷ 1,000) = ${fmt(isa)} °C`,
      `ISA deviation = OAT − ISA = ${fmt(oatC)} − ${fmt(isa)} = ${fmt(deviation)} °C`,
      `Density altitude = pressure altitude + 120 × deviation = ${fmt(pressureAltitudeFt)} + 120 × ${fmt(deviation)} = ${fmt(da)} ft`,
    ],
  };
}

// ---------------------------------------------------------------------------
// True airspeed (rule of thumb)
// ---------------------------------------------------------------------------

export interface TrueAirspeedResult extends ValueResult {
  /** The density altitude computed on the way to TAS, ft. */
  densityAltitudeFt: number;
}

/**
 * True airspeed rule of thumb: TAS ≈ CAS + 2% of CAS per 1,000 ft of
 * density altitude. Density altitude comes from the 120 ft/°C rule above.
 * This is the quick mental/E6B method, not the exact compressible solution.
 */
export function trueAirspeed(casKts: number, pressureAltitudeFt: number, oatC: number): TrueAirspeedResult | EngineError {
  if (!Number.isFinite(casKts)) return err('Enter a number in every field.');
  if (casKts <= 0) return err('Calibrated airspeed must be greater than zero.');
  const da = densityAltitude(pressureAltitudeFt, oatC);
  if (!da.ok) return da;
  const tas = casKts * (1 + 0.02 * (da.value / 1000));
  return {
    ok: true,
    value: tas,
    densityAltitudeFt: da.value,
    steps: [
      ...da.steps,
      `TAS ≈ CAS × (1 + 2% per 1,000 ft of density altitude) = ${fmt(casKts)} × (1 + 0.02 × ${fmt(da.value / 1000, 2)}) = ${fmt(tas)} kts`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

/** Exact/standard conversion factors. Avgas weight is the flight-planning standard 6 lbs/gal. */
export const CONVERSION_FACTORS = {
  /** 1 knot = 1.15078 mph (1 NM = 1,852 m exactly; 1.15078 is the standard rounding). */
  KT_TO_MPH: 1.15078,
  /** 1 nautical mile = 1.15078 statute miles. */
  NM_TO_SM: 1.15078,
  /** 1 nautical mile = 1.852 km (exact). */
  NM_TO_KM: 1.852,
  /** Avgas (100LL) flight-planning weight: 6 lbs per US gallon. */
  AVGAS_LBS_PER_GAL: 6,
} as const;

export function ktsToMph(kts: number): ValueResult | EngineError {
  if (!Number.isFinite(kts)) return err('Enter a number to convert.');
  const mph = kts * CONVERSION_FACTORS.KT_TO_MPH;
  return { ok: true, value: mph, steps: [`${fmt(kts)} kts × 1.15078 = ${fmt(mph)} mph`] };
}

export function mphToKts(mph: number): ValueResult | EngineError {
  if (!Number.isFinite(mph)) return err('Enter a number to convert.');
  const kts = mph / CONVERSION_FACTORS.KT_TO_MPH;
  return { ok: true, value: kts, steps: [`${fmt(mph)} mph ÷ 1.15078 = ${fmt(kts)} kts`] };
}

export function nmToSm(nm: number): ValueResult | EngineError {
  if (!Number.isFinite(nm)) return err('Enter a number to convert.');
  const sm = nm * CONVERSION_FACTORS.NM_TO_SM;
  return { ok: true, value: sm, steps: [`${fmt(nm)} NM × 1.15078 = ${fmt(sm)} SM`] };
}

export function smToNm(sm: number): ValueResult | EngineError {
  if (!Number.isFinite(sm)) return err('Enter a number to convert.');
  const nm = sm / CONVERSION_FACTORS.NM_TO_SM;
  return { ok: true, value: nm, steps: [`${fmt(sm)} SM ÷ 1.15078 = ${fmt(nm)} NM`] };
}

export function nmToKm(nm: number): ValueResult | EngineError {
  if (!Number.isFinite(nm)) return err('Enter a number to convert.');
  const km = nm * CONVERSION_FACTORS.NM_TO_KM;
  return { ok: true, value: km, steps: [`${fmt(nm)} NM × 1.852 = ${fmt(km)} km`] };
}

export function kmToNm(km: number): ValueResult | EngineError {
  if (!Number.isFinite(km)) return err('Enter a number to convert.');
  const nm = km / CONVERSION_FACTORS.NM_TO_KM;
  return { ok: true, value: nm, steps: [`${fmt(km)} km ÷ 1.852 = ${fmt(nm)} NM`] };
}

export function galToLbs(gal: number): ValueResult | EngineError {
  if (!Number.isFinite(gal)) return err('Enter a number to convert.');
  const lbs = gal * CONVERSION_FACTORS.AVGAS_LBS_PER_GAL;
  return { ok: true, value: lbs, steps: [`${fmt(gal, 1)} gal × 6 lbs/gal (avgas standard) = ${fmt(lbs, 1)} lbs`] };
}

export function lbsToGal(lbs: number): ValueResult | EngineError {
  if (!Number.isFinite(lbs)) return err('Enter a number to convert.');
  const gal = lbs / CONVERSION_FACTORS.AVGAS_LBS_PER_GAL;
  return { ok: true, value: gal, steps: [`${fmt(lbs, 1)} lbs ÷ 6 lbs/gal (avgas standard) = ${fmt(gal, 1)} gal`] };
}

export function cToF(celsius: number): ValueResult | EngineError {
  if (!Number.isFinite(celsius)) return err('Enter a number to convert.');
  const f = celsius * 1.8 + 32;
  return { ok: true, value: f, steps: [`(${fmt(celsius)} °C × 1.8) + 32 = ${fmt(f)} °F`] };
}

export function fToC(fahrenheit: number): ValueResult | EngineError {
  if (!Number.isFinite(fahrenheit)) return err('Enter a number to convert.');
  const c = (fahrenheit - 32) / 1.8;
  return { ok: true, value: c, steps: [`(${fmt(fahrenheit)} °F − 32) ÷ 1.8 = ${fmt(c)} °C`] };
}
