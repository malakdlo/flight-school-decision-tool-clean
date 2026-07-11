/**
 * Aircraft profile registry for the weight & balance calculator.
 * Add a new aircraft: create its constants file, register it here, and add a
 * route that renders <WeightBalanceCalculator aircraftId="..." />.
 */
import type { AircraftWBProfile } from '../../lib/weight-balance.ts';
import { cessna150f1966 } from './cessna-150f-1966.ts';

export const AIRCRAFT_PROFILES: Record<string, AircraftWBProfile> = {
  [cessna150f1966.id]: cessna150f1966,
};

export { cessna150f1966 };
