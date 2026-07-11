/**
 * 1966 Cessna 150F weight & balance constants.
 * Source: 1966 Cessna 150F Owner's Manual.
 *
 * Arms and envelopes vary across 150 model years — these numbers are for the
 * 1966 150F specifically. A future aircraft (e.g. 172S) is a new file like
 * this one plus a new route; the calculator component is aircraft-agnostic.
 *
 * Relative import (no `@/` alias) so the unit tests run under the repo test
 * runner with no path-alias config.
 */
import type { AircraftWBProfile } from '../../lib/weight-balance.ts';

export const cessna150f1966: AircraftWBProfile = {
  id: 'cessna-150f-1966',
  name: 'Cessna 150F',
  modelYearNote:
    '1966 model year. Arms and CG envelopes vary across 150 variants — check the manual for your exact year.',
  source: '1966 Cessna 150F Owner’s Manual',
  datumNote: 'Reference datum: front face of the firewall. All arms in inches aft of datum.',
  maxGrossLb: 1600,
  categories: ['Normal', 'Utility'],
  categoryNote:
    'On this type, Normal and Utility category share the same 1,600 lb maximum gross weight and the same CG envelope.',
  envelope: {
    minWeightLb: 1150,
    maxWeightLb: 1600,
    // Forward limit: constant 31.5 in below 1,280 lb, then a straight line to
    // 32.9 in at 1,600 lb.
    forwardLimit: [
      { weightLb: 1150, cgIn: 31.5 },
      { weightLb: 1280, cgIn: 31.5 },
      { weightLb: 1600, cgIn: 32.9 },
    ],
    // Aft limit: constant 37.5 in at all weights.
    aftLimit: [
      { weightLb: 1150, cgIn: 37.5 },
      { weightLb: 1600, cgIn: 37.5 },
    ],
  },
  loadStations: [
    {
      id: 'frontSeats',
      label: 'Pilot + passenger',
      armIn: 39.0,
      help: 'Combined weight of both front-seat occupants.',
    },
    {
      id: 'baggage1',
      label: 'Baggage area 1 / child seat',
      armIn: 64.0,
      maxLb: 120,
      help: 'Behind the seats. Max 120 lb.',
    },
    {
      id: 'baggage2',
      label: 'Baggage area 2',
      armIn: 84.0,
      maxLb: 40,
      help: 'The aft shelf. Max 40 lb.',
    },
  ],
  groupLimits: [
    {
      id: 'baggage-combined',
      label: 'Combined baggage (areas 1 + 2)',
      stationIds: ['baggage1', 'baggage2'],
      maxLb: 120,
    },
  ],
  fuel: {
    armIn: 42.0,
    lbsPerGal: 6,
    tankOptions: [
      { id: 'standard', label: 'Standard tanks', totalGal: 26.0, usableGal: 22.5 },
      { id: 'long-range', label: 'Long-range tanks', totalGal: 38.0, usableGal: 35.0 },
    ],
    defaultTankId: 'standard',
  },
  oil: {
    armIn: -13.5,
    lbsPerQt: 1.875,
    capacityQt: 6,
    defaultQt: 5,
    minOperatingQt: 4,
  },
  // Pre-filled example weighing record (numbers only). The UI labels this
  // "replace with YOUR aircraft's current weighing record."
  defaultEmpty: {
    weightLb: 1074,
    cgIn: 34.07,
    momentInLb: 36593,
  },
};
