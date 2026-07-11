# site-map-and-funnels.md — flightschoolfriend.com
*v3 — 2026-07-10. Every linkable destination + its pitch + Kit tag. Merges the v2 canonical inventory with the production route verification from the 2026-07-10 Codex QA/documentation pass (branch `qa/live-tools-audit-v2` / `docs/site-map-live-tools-v2`).*

*CANONICAL LOCATION: `00_shared/` in the Claude Cowork Brain — edits originate there. The copy at `/project-knowledge/site-map-and-funnels.md` in the site repo is a mirror for coding agents (Codex / Claude Code); any commit that changes what is live or captured must update the repo mirror in the same commit, and the change must be synced back to `00_shared/`. Cross-repo sync workflow is under review (Jul 2026) — until it lands, Malak syncs manually.*

## Brand
- Public brand: **Flight School Friend** (site) + **@privatepilotnotebook** (IG journey arm)
- Tagline: "A friend for every leg of the flight school journey."
- Positioning: free tools + real training journey, built in public by a student pilot in Tulsa, OK. Decision support — never instruction/legal/medical advice.

## Design system
- Canonical reference: **style-guide_website_flight-school-friend_current.md** (repo path: `/project-knowledge/style-guide_website_flight-school-friend_current.md`). Source of truth for all flightschoolfriend.com visual/UI decisions — color tokens, type scale, spacing, components, iconography, motion, a11y.
- Applies to: site pages, guides, tools/trainers, quiz/calculator UI, on-site email-capture components.
- Does NOT apply to: IG content DS ("Private Pilot Notebook DS" + PPN Video Design System) — separate and IG-only.
- The design-brief files in `/project-knowledge/` are reference only and never override the style guide.
- Any Codex/Claude Code prompt touching site UI cites the style guide by name; drift gets flagged.

## Linkable destinations

### Core pages & hubs

| Status | URL | One-line pitch (for CTAs) | Kit tag / capture |
|---|---|---|---|
| ✅ Live | `/` | Home entry point for future pilots and early PPL students. | 28-Day Program Kit capture on page + global footer signup. Hero CTAs → `/researching-flight-school/` and `/ppl-students/` (both verified live 2026-07-10). |
| ✅ Live | `/researching-flight-school/` | "Deciding on flight school starts here." | No page-specific capture; global footer signup. Hub cards link to research guides + 28-day tracker. |
| ✅ Live | `/ppl-students/` | "Tools for the training you're in right now." | No page-specific capture yet (`tool_waitlist` on coming-soon cards was the v2 plan — verify current state when tool linking lands). Hub cards link to solo tools, PPL guide category, journey. |
| ✅ Live | `/guides/` | Starter guide library with Stage/Topic filters. | No page-specific capture; global footer signup. ⚠️ Filter taxonomy proposed by Codex, pending Malak review: stages `Research` / `PPL student` / `Both stages`; topics `Cost & Budget` / `Training Paths` / `School Selection` / `Requirements` / `Solo Prep`. |
| ✅ Live | `/guides/researching-flight-school/` | Category page for research-stage guides. | No page-specific capture. Link-fix target confirmed — Flight School Research category links use this route. |
| ✅ Live | `/guides/ppl-student/` | Category page for active-PPL-student guides. | No page-specific capture. Link-fix target confirmed — PPL Student category links use this route. |
| ✅ Live | `/guides/flight-school-cost/` | "What flight school really costs — ranges, line items, sources." | In-guide capture (verify tag on next Kit pass). |
| ✅ Live ⚠️ | Pre-Solo Written guide page | (orphaned — confirm it's now reachable from `/guides/` after the filter/index rework; add to index if still orphaned) | ⚠️ Untracked Kit form on page — document or remove (carried from v2, unresolved). |
| ✅ Live | `/privacy/` | Privacy policy: forms, analytics, email provider, cookies, contact. | No capture. ⚠️ Template-based — Malak to have reviewed before treating as final. |
| ✅ Live ⚠️ | `/about/` | About page — why Flight School Friend exists. | No capture. ⚠️ Content still V1-era (28-Day-tool framing) — update pending Malak's direction. |
| 🟡 In build | `/journey/` | "Every flight, every mistake, every tool — the whole training journey, logbook style." | `newsletter` planned. ⚠️ Individual flight details still need filling (Malak content task). |
| ✅ Live | `/thank-you/download/ppl-solo-prep-pack/` | Hidden thank-you landing page (noindex/nofollow — verified in v2). | — |

### Tools (all verified live 2026-07-10)

| Status | URL | One-line pitch (for CTAs) | Kit tag / capture |
|---|---|---|---|
| ✅ Live | `/tools/crosswind-calculator/` | "Free crosswind component calculator — enter runway and wind, see your components instantly." | No capture. |
| ✅ Live | `/tools/ppl-requirements-tracker/` | "Track your hours against every 14 CFR 61.109 requirement for your PPL." | Capture placeholder built, UNWIRED — Kit UID, tag, and printable asset all pending. No live download. |
| ✅ Live | `/tools/metar-decoder/` | "Paste any METAR, get a plain-language decode — free practice for real weather." | No tool-specific capture (global footer signup only). Steps 3–5 selection bug fixed + re-verified. |
| ✅ Live | `/tools/maneuvers-quiz/` | "Practice PPL maneuver callouts and self-review against the maneuver cards." | Download gate NOT wired — disabled Kit stub only. ⚠️ School sign-off on card content required before gate ships. Do not promote as a gated download. |
| ✅ Live ⚠️ | `/tools/radio-call-builder/` | "Build and practice towered and CTAF radio-call scripts — with practice mode." | ⚠️ **ACTIVE Kit signup detected on page ("new-tool updates") with NO tag/UID documented here — cardinal-rule gap. Document the tag + form UID immediately or unwire the form.** "Under review" banner absent; REVIEW.md marked signed off 2026-07-10 — Malak to confirm CFI review actually occurred (not agent self-certification). Future template changes require a new review pass. |
| ✅ Live | `/tools/flight-computer-trainer/` | "Practice E6B-style wind, time-speed-distance, fuel, altitude, TAS, and conversion problems — formulas shown." | No active capture (disabled printable-problem-set stub only). |
| ✅ Live | `/tools/cessna-150-weight-balance/` | "Practice Cessna 150 weight & balance — useful load, takeoff/landing points on the CG envelope." | No active capture (planned worksheet placeholder unwired). |

### Built / queued assets (carried from v2 — status unverified this pass)

| Status | Item | Pitch | Kit tag / capture |
|---|---|---|---|
| 🟡 Reconcile | ATC Comms Curveball Trainer (React) | "Free ATC radio practice with curveballs." | `tool_waitlist` planned. ⚠️ Reconcile against `/tools/radio-call-builder/` — merged into it, superseded, or still separate? |
| 🟡 Reconcile | Pattern Work / Landing Scenarios trainer (React) | "Drill landing decision scenarios. Free." | `tool_waitlist` planned. Verify build/deploy status. |
| 🟡 Reconcile | Pre-Solo Written Trainer (React) | "Practice for your pre-solo written the way I did." | `tool_waitlist` planned. Verify build/deploy status. |
| 🔴 Gate pending | 28-Day Flight School Decision Program (PDF) | "Free 28-day framework to decide if flight training is right for you." | `plan_download` — homepage capture references this program; verify gate/asset state. |
| 🟡 Ready to ship | Discovery Flight Guide + checklist | "How to prep for a discovery flight — printable checklist." | `discovery_checklist` — Codex prompt + PDF produced; founder-note variant awaits decision. |
| 🟡 In production | PPL Solo Study Guide (PDF) | Email-gated study guide — solo stage. | Tag TBD — document before gate wires. Landing page must be live before any promo reel. |
| 🟡 In production | PPL Ground School Study Guide (PDF) | Email-gated study guide — knowledge-test stage. | Tag TBD — same rules. |
| 🟡 Guide gate | CX-3 flight computer guide page | Must be live before the CX-3 Reel ships. | — |
| 🟡 To build | Research Tracker + PPL Flight Tracker (sheets) | "The exact sheets I use." | Email-gated, tags TBD. |

### Kit forms (existing)

| Status | Form | Config | Tag |
|---|---|---|---|
| ✅ Live | PPL Solo Flight Tracker Sheet | auto-confirm + redirect | tracker tag ⚠️ exact name still undocumented |
| ✅ Live | PPL Solo Full Prep Pack | auto-confirm + redirect | ⚠️ tag + `ok_location` field still undocumented — fill exact names |
| ⚠️ NEW / undocumented | Radio call builder "new-tool updates" signup | unknown | ⚠️ tag + UID must be documented or form unwired |

## IG → site linking rules
1. Link in bio points to a simple links page or the most timely destination (solo week: journey post; tool launch week: the tool).
2. Every P2 (tools) post CTA references the concrete thing: "free — link in bio" only when bio actually links to it that week.
3. UTM every link: `utm_source=instagram&utm_medium=social&utm_campaign=<post-slug>`.
4. **Never CTA to a page that isn't live** — "live" means verified in production, not merged. (Cardinal rule.)
5. Guide/landing pages live before their promo Reels ship.

## Kit funnel snapshot
- Plan: **free tier — confirmed sufficient.** Single automation slot reserved for the three-email welcome sequence.
- Custom fields: `quiz_segment`, `source_page`, `utm_source/medium/campaign`, **`ok_location`** (deferred to backlog; interim proxy = "Oklahoma Pipeline" Kit Segment), `calculator_estimate`, `plan_download`
- Tags: `newsletter`, `plan_download`, `calculator_estimate`, `tool_waitlist`, `discovery_checklist`, `directory_waitlist`, ⚠️ + live Solo Tracker / Solo Prep Pack tags (document exact names) ⚠️ + radio-call-builder signup tag (document or unwire)
- Cardinal rule: **no form wires until its tag name + form UID are documented in this file.** The radio call builder entry above is currently out of compliance — resolve first in the next Kit pass.
- Welcome sequences: quiz-persona-branched 4-email sequence (in build; ⚠️ 4 persona placeholder names need replacing with actual result labels); newsletter welcome asks the Tulsa question in email 1.
- Parked: **Prompt C** (quiz + calculator capture sections) pending three embed UIDs (9569639, 9659130, 9569637).
- North-star email metric: **count of `ok_location=true` subscribers** (future Tulsa student waitlist).

## Funnel logic for content decisions
IG reach → follows → bio link → tool/guide → email capture (geo-tagged) → nurture → [future: Tulsa students · coaching clients · guide buyers]. When choosing between two post ideas, prefer the one that gives a follower a *reason to leave IG for the site* — saves are good, geo-tagged emails are the business.
