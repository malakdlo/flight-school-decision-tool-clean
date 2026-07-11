/**
 * Verification suite for the flight computer engines.
 *
 * Expected values are worked by hand from the stated formulas in
 * FAA/ASA-style practice-problem ranges, spot-checked against a manual
 * flight computer before the engines were frozen. These cases are the
 * contract: a formula change that moves any expected value is a breaking
 * change and needs re-verification, not a test edit.
 */
import { describe, expect, it } from 'vitest';
import {
  cToF,
  densityAltitude,
  distanceFromSpeedTime,
  fToC,
  fuelBurned,
  fuelEndurance,
  fuelRequired,
  galToLbs,
  isaTemperature,
  kmToNm,
  ktsToMph,
  lbsToGal,
  mphToKts,
  nmToKm,
  nmToSm,
  normalizeHeading,
  pressureAltitude,
  smToNm,
  speedFromDistanceTime,
  timeFromSpeedDistance,
  trueAirspeed,
  windTriangle,
} from './engines';

/** Narrow an engine result to its ok variant or fail the test. */
function ok<T extends { ok: boolean }>(result: T | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(`expected ok result, got error: ${(result as { error: string }).error}`);
  return result as T;
}

describe('normalizeHeading', () => {
  it('keeps 360 as 360, not 0', () => {
    expect(normalizeHeading(360)).toBe(360);
    expect(normalizeHeading(0)).toBe(360);
  });
  it('wraps past 360 and below 0', () => {
    expect(normalizeHeading(370)).toBe(10);
    expect(normalizeHeading(-5)).toBe(355);
  });
});

describe('wind triangle', () => {
  it('quartering headwind from the left: TC 090, TAS 120, wind 040@20', () => {
    const r = ok(windTriangle({ trueCourse: 90, trueAirspeed: 120, windDirection: 40, windSpeed: 20 }));
    expect(r.windCorrectionAngle).toBeCloseTo(-7.3, 1); // crab left, into the wind
    expect(r.trueHeading).toBeCloseTo(82.7, 1);
    expect(r.groundSpeed).toBeCloseTo(106.2, 1);
  });

  it('direct crosswind from the right: TC 180, TAS 100, wind 270@20', () => {
    const r = ok(windTriangle({ trueCourse: 180, trueAirspeed: 100, windDirection: 270, windSpeed: 20 }));
    expect(r.windCorrectionAngle).toBeCloseTo(11.5, 1); // asin(20/100)
    expect(r.trueHeading).toBeCloseTo(191.5, 1);
    expect(r.groundSpeed).toBeCloseTo(98.0, 1); // TAS × cos(WCA); a pure crosswind still costs a little GS
    expect(r.headwindComponent).toBeCloseTo(0, 5);
    expect(r.crosswindComponent).toBeCloseTo(20, 5);
  });

  it('direct headwind: TC 360, TAS 110, wind 360@25', () => {
    const r = ok(windTriangle({ trueCourse: 360, trueAirspeed: 110, windDirection: 360, windSpeed: 25 }));
    expect(r.windCorrectionAngle).toBeCloseTo(0, 5);
    expect(r.trueHeading).toBe(360);
    expect(r.groundSpeed).toBeCloseTo(85, 5);
    expect(r.headwindComponent).toBeCloseTo(25, 5);
  });

  it('direct tailwind: TC 090, TAS 100, wind 270@15', () => {
    const r = ok(windTriangle({ trueCourse: 90, trueAirspeed: 100, windDirection: 270, windSpeed: 15 }));
    expect(r.windCorrectionAngle).toBeCloseTo(0, 5);
    expect(r.trueHeading).toBeCloseTo(90, 5);
    expect(r.groundSpeed).toBeCloseTo(115, 5);
    expect(r.headwindComponent).toBeCloseTo(-15, 5); // negative = tailwind
  });

  it('heading normalizes across north: TC 360, TAS 100, wind 060@25', () => {
    const r = ok(windTriangle({ trueCourse: 360, trueAirspeed: 100, windDirection: 60, windSpeed: 25 }));
    expect(r.windCorrectionAngle).toBeCloseTo(12.5, 1);
    expect(r.trueHeading).toBeCloseTo(12.5, 1); // 360 + 12.5 wraps to 012.5
    expect(r.groundSpeed).toBeCloseTo(85.1, 1);
  });

  it('flags wind speed at or above TAS as invalid instead of computing garbage', () => {
    expect(windTriangle({ trueCourse: 90, trueAirspeed: 100, windDirection: 90, windSpeed: 100 }).ok).toBe(false);
    expect(windTriangle({ trueCourse: 90, trueAirspeed: 100, windDirection: 90, windSpeed: 120 }).ok).toBe(false);
  });

  it('rejects out-of-range and missing inputs', () => {
    expect(windTriangle({ trueCourse: 400, trueAirspeed: 100, windDirection: 90, windSpeed: 10 }).ok).toBe(false);
    expect(windTriangle({ trueCourse: 90, trueAirspeed: 0, windDirection: 90, windSpeed: 10 }).ok).toBe(false);
    expect(windTriangle({ trueCourse: 90, trueAirspeed: 100, windDirection: 90, windSpeed: NaN }).ok).toBe(false);
  });
});

describe('time / speed / distance', () => {
  it('time: 165 NM at 110 kts = 1.5 hr', () => {
    expect(ok(timeFromSpeedDistance(110, 165)).value).toBeCloseTo(1.5, 5);
  });
  it('speed: 240 NM in 2.0 hr = 120 kts', () => {
    expect(ok(speedFromDistanceTime(240, 2)).value).toBeCloseTo(120, 5);
  });
  it('distance: 95 kts for 1.2 hr = 114 NM', () => {
    expect(ok(distanceFromSpeedTime(95, 1.2)).value).toBeCloseTo(114, 5);
  });
  it('short-leg time: 24 NM at 96 kts = 0.25 hr (15 min)', () => {
    expect(ok(timeFromSpeedDistance(96, 24)).value).toBeCloseTo(0.25, 5);
  });
  it('rejects zero speed and zero time', () => {
    expect(timeFromSpeedDistance(0, 100).ok).toBe(false);
    expect(speedFromDistanceTime(100, 0).ok).toBe(false);
  });
});

describe('fuel', () => {
  it('burned: 8.5 GPH for 2.5 hr = 21.25 gal', () => {
    expect(ok(fuelBurned(8.5, 2.5)).value).toBeCloseTo(21.25, 5);
  });
  it('endurance: 38 gal usable at 9.5 GPH = 4.0 hr', () => {
    expect(ok(fuelEndurance(38, 9.5)).value).toBeCloseTo(4, 5);
  });
  it('required: 9 GPH, 2.0 hr trip + 0.75 hr reserve = 24.75 gal', () => {
    expect(ok(fuelRequired(9, 2, 0.75)).value).toBeCloseTo(24.75, 5);
  });
  it('required with no reserve: 7.2 GPH for 1.5 hr = 10.8 gal', () => {
    expect(ok(fuelRequired(7.2, 1.5)).value).toBeCloseTo(10.8, 5);
  });
  it('rejects zero GPH', () => {
    expect(fuelBurned(0, 2).ok).toBe(false);
    expect(fuelEndurance(30, 0).ok).toBe(false);
  });
});

describe('pressure altitude', () => {
  it('high setting lowers PA: field 3,500 ft, altimeter 30.15 → 3,270 ft', () => {
    expect(ok(pressureAltitude(3500, 30.15)).value).toBeCloseTo(3270, 0);
  });
  it('low setting raises PA: field 1,200 ft, altimeter 29.42 → 1,700 ft', () => {
    expect(ok(pressureAltitude(1200, 29.42)).value).toBeCloseTo(1700, 0);
  });
  it('standard day: field 0 ft, altimeter 29.92 → 0 ft', () => {
    expect(ok(pressureAltitude(0, 29.92)).value).toBeCloseTo(0, 5);
  });
  it('field 5,000 ft, altimeter 28.92 → 6,000 ft', () => {
    expect(ok(pressureAltitude(5000, 28.92)).value).toBeCloseTo(6000, 0);
  });
  it('rejects implausible altimeter settings', () => {
    expect(pressureAltitude(1000, 27.5).ok).toBe(false);
    expect(pressureAltitude(1000, 32).ok).toBe(false);
  });
});

describe('density altitude', () => {
  it('ISA temperature ladder: 15 °C at sea level, 5 °C at 5,000 ft, −1 °C at 8,000 ft', () => {
    expect(isaTemperature(0)).toBeCloseTo(15, 5);
    expect(isaTemperature(5000)).toBeCloseTo(5, 5);
    expect(isaTemperature(8000)).toBeCloseTo(-1, 5);
  });
  it('hot day: PA 5,000 ft, OAT 25 °C → DA 7,400 ft', () => {
    expect(ok(densityAltitude(5000, 25)).value).toBeCloseTo(7400, 0);
  });
  it('0 °C edge: PA 3,000 ft, OAT 0 °C → DA 1,920 ft', () => {
    expect(ok(densityAltitude(3000, 0)).value).toBeCloseTo(1920, 0);
  });
  it('cold day goes below field: PA 2,000 ft, OAT −10 °C → DA −520 ft', () => {
    expect(ok(densityAltitude(2000, -10)).value).toBeCloseTo(-520, 0);
  });
  it('standard day: PA 6,500 ft, OAT 2 °C (ISA) → DA equals PA', () => {
    expect(ok(densityAltitude(6500, 2)).value).toBeCloseTo(6500, 0);
  });
});

describe('true airspeed (2% per 1,000 ft rule)', () => {
  it('CAS 110, PA 6,500 ft, OAT 15 °C → DA 8,060 ft, TAS ≈ 127.7 kts', () => {
    const r = ok(trueAirspeed(110, 6500, 15));
    expect(r.densityAltitudeFt).toBeCloseTo(8060, 0);
    expect(r.value).toBeCloseTo(127.7, 1);
  });
  it('sea-level standard day: CAS 100, PA 0, OAT 15 °C → TAS = CAS', () => {
    expect(ok(trueAirspeed(100, 0, 15)).value).toBeCloseTo(100, 5);
  });
  it('ISA at altitude: CAS 120, PA 8,000 ft, OAT −1 °C → TAS 139.2 kts', () => {
    expect(ok(trueAirspeed(120, 8000, -1)).value).toBeCloseTo(139.2, 1);
  });
  it('negative DA gives TAS below CAS: CAS 100, PA 1,000 ft, OAT −10 °C → TAS ≈ 96.5 kts', () => {
    const r = ok(trueAirspeed(100, 1000, -10));
    expect(r.densityAltitudeFt).toBeCloseTo(-1760, 0);
    expect(r.value).toBeCloseTo(96.5, 1);
  });
});

describe('conversions', () => {
  it('kts ↔ mph: 100 kts = 115.078 mph and back', () => {
    expect(ok(ktsToMph(100)).value).toBeCloseTo(115.078, 3);
    expect(ok(mphToKts(115.078)).value).toBeCloseTo(100, 3);
  });
  it('NM ↔ SM: 100 NM = 115.078 SM; 115.078 SM = 100 NM', () => {
    expect(ok(nmToSm(100)).value).toBeCloseTo(115.078, 3);
    expect(ok(smToNm(115.078)).value).toBeCloseTo(100, 3);
  });
  it('NM ↔ km: 100 NM = 185.2 km; 54 km ≈ 29.16 NM', () => {
    expect(ok(nmToKm(100)).value).toBeCloseTo(185.2, 3);
    expect(ok(kmToNm(54)).value).toBeCloseTo(29.158, 2);
  });
  it('avgas gal ↔ lbs at 6 lbs/gal: 30 gal = 180 lbs and back', () => {
    expect(ok(galToLbs(30)).value).toBeCloseTo(180, 5);
    expect(ok(lbsToGal(180)).value).toBeCloseTo(30, 5);
  });
  it('°C ↔ °F: 0 °C = 32 °F, 100 °C = 212 °F, −40 is the same in both, 59 °F = 15 °C', () => {
    expect(ok(cToF(0)).value).toBeCloseTo(32, 5);
    expect(ok(cToF(100)).value).toBeCloseTo(212, 5);
    expect(ok(cToF(-40)).value).toBeCloseTo(-40, 5);
    expect(ok(fToC(59)).value).toBeCloseTo(15, 5);
  });
});
