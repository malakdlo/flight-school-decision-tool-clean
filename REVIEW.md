# REVIEW.md — Radio Call Script Builder — approved phraseology set (v2)

**Revision history**
- **v1 — 2026-07-09:** Conservative AIM Ch. 4 / AC 90-66 set, approved by Malak (owner).
- **v2 — 2026-07-10:** Towered flows revised by owner direction to match the real-world KRVS script ([project-knowledge/krvs-radio-script.md](project-knowledge/krvs-radio-script.md)): approach/departure radar service added to inbound and outbound, run-up complete call added, rollout-instruction listen step added, radio check removed from outbound (both environments). CTAF templates unchanged from v1 except the radio check deletion.

**Status:** v2 owner-approved (owner supplied the source script). **Instructor sign-off pending on every template below.** The tool stays unlinked and carries the "Draft — under review" banner until every box is checked.

## Conventions (carried from v1 unless noted)

- Full callsign on every call; abbreviate only after ATC abbreviates first (on-page guidance).
- Numbers rendered as spoken: "runway one niner right," "one zero miles," "information bravo," "niner" for 9.
- Initiating a call: who you're calling, then your callsign. Responding: repeat the instruction, callsign last. (KRVS script general reminder.)
- CTAF self-announce begins **and** ends with the airport name.
- Discouraged phrases listed on-page: "any traffic in the area, please advise," "clear of the active," "taking the runway."
- Student-pilot toggle appends ", student pilot" to initial calls to each towered facility (ground taxi request, tower number-one call, approach inbound, tower inbound check-in).
- Values only known in the moment (squawk, assigned heading, passing altitude) render as amber fill-in-live tokens, never invented.
- ~~Radio check standalone card~~ — **removed in v2** (owner: not necessary for outbound; UNICOM radio check also removed).
- ~~"Ready for departure"~~ — **replaced in v2** by the KRVS "number one at runway ___ for departure to ___" form.

Variables: `{callsign}` `{airport}` `{facility}` (approach/departure facility, e.g. Tulsa) `{rwy}` `{atis}` `{spot}` `{taxiway}` `{side}` `{intent}` `{direction}` `{distance}` `{landmark}` `{altitude}` `{destination}`.

---

## Class D towered (under an approach shelf) — 11 templates

### T1 · Taxi request — to Ground (or Clearance Delivery if ATIS directs)
Three variants by flight plan:
> Staying in the pattern: "{airport} Ground, {callsign}, at {spot} with information {atis}, ready to taxi, closed traffic."
> Local/maneuver flight: "{airport} Ground, {callsign}, at {spot} with information {atis}, requesting radar service to the {direction}."
> Cross-country: "{airport} Ground, {callsign}, at {spot} with information {atis}, requesting flight following to {destination}."

Listen for (radar service / flight following): altitude cap + departure frequency + squawk — read back all three; then "readback correct" + runway and taxi route — read back verbatim incl. hold-short/cross-runway. (Pattern: just the runway + route readback.)
- [ ] Instructor sign-off — initials: ______

### T2 · Run-up complete — to Ground
> "{airport} Ground, {callsign}, run-up complete."

Listen for: "number ___, contact tower when number one" — read back, taxi to the hold-short line.
- [ ] Instructor sign-off — initials: ______

### T3 · Number one for departure — to Tower
> "{airport} Tower, {callsign}, number one at runway {rwy}, {closed traffic / for departure to the (direction) / for departure to (destination)}."

Listen for: "hold short … for landing traffic" / "line up and wait" / "fly heading ___, runway ___, cleared for takeoff" — verbatim readback incl. runway; never roll without "cleared for takeoff."
- [ ] Instructor sign-off — initials: ______

### T4 · Downwind report (when instructed) — to Tower
> "{callsign}, midfield {side} downwind, runway {rwy}."
- [ ] Instructor sign-off — initials: ______

### T5 · Final report (when instructed) — to Tower
> "{callsign}, two-mile final, runway {rwy}."
- [ ] Instructor sign-off — initials: ______

### T6 · Departure check-in — to Departure *(new in v2)*
> "{facility} Departure, {callsign}, off {airport}, climbing through [passing altitude] for {altitude}, heading [assigned heading]."

Preceded by listen card: tower's handoff ("turn right heading ___, contact {facility} Departure") — read back, switch. Followed by listen card: "radar contact …" (heading ≠ altitude clearance; hold the cap) and radar termination / center handoff.
- [ ] Instructor sign-off — initials: ______

### T7 · Approach inbound call — to Approach *(new in v2)*
> "{facility} Approach, {callsign}, {distance} miles {direction} [of {landmark}], at {altitude}, inbound {airport} with information {atis}."

Listen for: squawk (read back + set), then "radar contact … proceed direct / routing, expect runway ___" — read back and fly it; instructions can change with traffic. Then the handoff: "contact {airport} Tower" — read back, switch.
- [ ] Instructor sign-off — initials: ______

### T8 · Tower inbound check-in — to Tower *(revised in v2)*
> "{airport} Tower, {callsign}, inbound for a full stop." — or — "{airport} Tower, {callsign}, inbound requesting laps in the pattern."

Listen for: pattern entry ("enter a midfield right downwind for runway ___"), possibly "I'll call your base" or "follow the ___, report traffic in sight" — read back, comply; landing clearance comes when tower is ready ("number ___, runway ___, cleared to land / cleared for the option") — read back with runway.
- [ ] Instructor sign-off — initials: ______

### T9 · Traffic in sight — to Tower *(new in v2)*
> "Traffic in sight, {callsign}."
- [ ] Instructor sign-off — initials: ______

### T10 · Position report (as instructed) — to Tower
> "{callsign}, midfield {side} downwind, runway {rwy}."
- [ ] Instructor sign-off — initials: ______

### T11 · After-landing taxi — to Ground *(revised in v2)*
> "{airport} Ground, {callsign}, at {taxiway}, request taxi to {spot}."

Preceded by listen card: rollout instructions ("turn right when able / on ___, contact ground," or "taxi to parking this frequency" = stay with tower) — read back, clear the runway fully, checklist off the runway.
- [ ] Instructor sign-off — initials: ______

---

## Untowered (CTAF) — 10 templates (v1, radio check removed)

AWOS/ASOS listen card opens the taxi operation; no UNICOM radio check.

### C1 · Taxi — self-announce
> "{airport} traffic, {callsign}, taxiing from {spot} to runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C2 · Takeoff — self-announce
> "{airport} traffic, {callsign}, departing runway {rwy}, {remaining in the pattern / departing to the (direction) / departing to (destination)}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C3 · Crosswind (optional) — self-announce
> "{airport} traffic, {callsign}, {side} crosswind, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C4 · Downwind — self-announce
> "{airport} traffic, {callsign}, {side} downwind, runway {rwy}, {intent}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C5 · Base — self-announce
> "{airport} traffic, {callsign}, {side} base, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C6 · Final — self-announce
> "{airport} traffic, {callsign}, final, runway {rwy}, {intent}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C7 · Inbound initial (~10 NM) — self-announce
> "{airport} traffic, {callsign}, {distance} miles {direction}[, {altitude}], inbound, planning {side} downwind entry, runway {rwy}, {intent}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C8 · Downwind entry — self-announce
> "{airport} traffic, {callsign}, entering {side} downwind on the forty-five, runway {rwy}, {airport}."
- [ ] Instructor sign-off — initials: ______

### C9 · After-landing — self-announce
> "{airport} traffic, {callsign}, clear of runway {rwy}, taxiing to {spot}, {airport}." *(never "clear of the active")*
- [ ] Instructor sign-off — initials: ______

### C10 · Departing the pattern — self-announce
> "{airport} traffic, {callsign}, departing the pattern to the {direction}, {straight out / on the forty-five}[, climbing {altitude}], {airport}."
- [ ] Instructor sign-off — initials: ______

---

## Sign-off completion

- [ ] All 21 templates initialed above
- [ ] Listen-card guidance reviewed (readbacks, handoffs, rollout, landing clearance, radar termination)
- [ ] Instructor name / certificate: ____________________
- [ ] Date: ____________
- [ ] After sign-off: remove the "Draft — under review" banner, remove `noindex` and the sitemap exclusion, link the page (tools index / nav), and update the site map doc.
