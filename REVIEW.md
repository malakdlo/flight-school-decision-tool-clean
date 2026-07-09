# REVIEW.md — Radio Call Script Builder — approved phraseology set

**Status:** Approved by Malak (owner) on 2026-07-09, as recommended. This set is **frozen for the build** — any change to a template below requires a new review pass.
**Next gate:** per-template instructor sign-off (checkboxes below). The tool stays unlinked and carries the "Draft — under review" banner until every box is checked.

Basis: FAA AIM Chapter 4 (radio communications phraseology, ATC procedures) and AC 90-66 (non-towered airport operations). Conservative, unembellished. Class C/B and flight following are out of scope for v1 and noted on-page.

## Approved conventions (apply to all templates)

- Full callsign on every call; abbreviate only after ATC abbreviates first (on-page guidance note, not baked into templates).
- Numbers rendered as spoken: "runway two five," "one zero miles," "information alpha," "niner" for 9.
- "Ready for departure," never "ready for takeoff" — "takeoff" is reserved for the clearance exchange itself.
- CTAF self-announce begins **and** ends with the airport name.
- Discouraged phrases listed on-page as don'ts: "any traffic in the area, please advise," "clear of the active," "taking the runway."
- Student-pilot toggle appends ", student pilot" to initial towered calls (taxi, takeoff, inbound initial) per AIM 4-2-4. Towered only.
- Crosswind call included in the CTAF pattern set, marked optional.
- Towered in-pattern calls use report-when-instructed framing (tower sequences you).
- Radio check is a standalone card with a "skip when the frequency is busy" note.
- Inbound position input: distance dropdown (3/5/7/10/15 mi) + 8-way direction + optional altitude.

Variables: `{callsign}` `{airport}` `{rwy}` `{atis}` `{spot}` (position on field) `{side}` (left/right) `{intent}` (full stop / touch and go) `{direction}` `{distance}` `{altitude}` `{taxiway}`.

---

## Class D (towered) — 9 templates

### T1 · Radio check — to Ground
> "{airport} Ground, {callsign}, radio check."

Listen for: readability report ("loud and clear" / "readability five").
- [ ] Instructor sign-off — initials: ______

### T2 · Taxi — to Ground
> "{airport} Ground, {callsign}, at {spot}, with information {atis}, ready to taxi, {closed traffic / VFR departure to the (direction)}[, student pilot]."

Listen for: runway + route; read back runway, route, and any hold-short verbatim with callsign (hold-short readback mandatory).
- [ ] Instructor sign-off — initials: ______

### T3 · Takeoff — to Tower
> "{airport} Tower, {callsign}, ready for departure, runway {rwy}, {closed traffic / departing to the (direction)}[, student pilot]."

Listen for: "cleared for takeoff runway {rwy}" (read back), "line up and wait" / "hold short" (mandatory readbacks). Never roll without "cleared for takeoff."
- [ ] Instructor sign-off — initials: ______

### T4 · Downwind report (when instructed) — to Tower
> "{callsign}, midfield {side} downwind, runway {rwy}."

Listen for: sequence + clearance ("cleared touch and go / for the option / number two, follow…"). Read back clearances with callsign.
- [ ] Instructor sign-off — initials: ______

### T5 · Final report (when instructed) — to Tower
> "{callsign}, two-mile final, runway {rwy}."

Listen for: "cleared to land / cleared for the option, runway {rwy}." No clearance by short final → go around and say so.
- [ ] Instructor sign-off — initials: ______

### T6 · Inbound initial — to Tower
> "{airport} Tower, {callsign}, {distance} miles {direction}[, {altitude}], with information {atis}, inbound, {intent}[, student pilot]."

Listen for: **your callsign in the reply** (establishes two-way comms to enter Class D — "aircraft calling, standby" does not), then the entry instruction; read back.
- [ ] Instructor sign-off — initials: ______

### T7 · Inbound position report (as instructed) — to Tower
> "{callsign}, midfield {side} downwind, runway {rwy}."

Listen for: landing clearance + sequencing.
- [ ] Instructor sign-off — initials: ______

### T8 · After-landing taxi — to Ground
> "{airport} Ground, {callsign}, clear of runway {rwy}[ at {taxiway}], taxi to {spot}."

Listen for: taxi route + any hold-short (mandatory readback). Call only when fully past the hold-short line, stopped, and told to contact ground.
- [ ] Instructor sign-off — initials: ______

### T9 · Frequency change — to Tower
> "{airport} Tower, {callsign}, request frequency change."

Listen for: "frequency change approved." Stay with tower inside the Class D; intentions were stated in the takeoff call.
- [ ] Instructor sign-off — initials: ______

---

## Untowered (CTAF) — 11 templates

No ATIS letter; AWOS/ASOS listen card replaces it.

### C1 · Radio check — to UNICOM
> "{airport} UNICOM, {callsign}, radio check."

Listen for: any reply confirms transmit; keep brief if busy.
- [ ] Instructor sign-off — initials: ______

### C2 · Taxi — self-announce on CTAF
> "{airport} traffic, {callsign}, taxiing from {spot} to runway {rwy}, {airport}."

Listen for: nobody clears you — conflicting taxi/inbound calls; clear visually.
- [ ] Instructor sign-off — initials: ______

### C3 · Takeoff — self-announce on CTAF
> "{airport} traffic, {callsign}, departing runway {rwy}, {remaining in the pattern / departing to the (direction)}, {airport}."

Listen for: traffic on final, base, or back-taxiing. Announce before entering the runway, after the final-approach scan.
- [ ] Instructor sign-off — initials: ______

### C4 · Crosswind (optional) — self-announce on CTAF
> "{airport} traffic, {callsign}, {side} crosswind, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C5 · Downwind — self-announce on CTAF
> "{airport} traffic, {callsign}, {side} downwind, runway {rwy}, {intent}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C6 · Base — self-announce on CTAF
> "{airport} traffic, {callsign}, {side} base, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C7 · Final — self-announce on CTAF
> "{airport} traffic, {callsign}, final, runway {rwy}, {intent}, {airport}."

Listen for (C4–C7): other position calls — especially straight-in traffic on final.
- [ ] Instructor sign-off — initials: ______

### C8 · Inbound initial (~10 NM) — self-announce on CTAF
> "{airport} traffic, {callsign}, {distance} miles {direction}[, {altitude}], inbound, planning {side} downwind entry, runway {rwy}, {intent}, {airport}."

Listen for: who's already in the pattern and where; runway in use may not match AWOS wind.
- [ ] Instructor sign-off — initials: ______

### C9 · Downwind entry — self-announce on CTAF
> "{airport} traffic, {callsign}, entering {side} downwind on the forty-five, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C10 · After-landing — self-announce on CTAF
> "{airport} traffic, {callsign}, clear of runway {rwy}, taxiing to {spot}, {airport}."

Never "clear of the active."
- [ ] Instructor sign-off — initials: ______

### C11 · Departing the pattern — self-announce on CTAF
> "{airport} traffic, {callsign}, departing the pattern to the {direction}, {straight out / on the forty-five}[, climbing {altitude}], {airport}."

Straight-out or a 45 in the pattern-turn direction are the AC 90-66 recommended departures.
- [ ] Instructor sign-off — initials: ______

---

## Sign-off completion

- [ ] All 20 templates initialed above
- [ ] Instructor name / certificate: ____________________
- [ ] Date: ____________
- [ ] After sign-off: remove the "Draft — under review" banner, remove `noindex`, link the page (tools index / nav), and update the site map doc.
