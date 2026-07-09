# Flight School Friend — Website Style Guide

* Website Style Guide for flightschoolfriend.com.
* Updated on 7/8/2026 from Claude Design DS "Flight School Friend Design System"

A modern SaaS decision tool wearing an aviation-notebook skin — nav-log grids, logbook sections, checklist modules, roadmap legs, and cockpit-instrument micro-details. No airplane silhouettes, wings, clouds, runway photos, or military clichés. Useful before decorative.

This system ships two coordinated themes from one token set: **Clarity** (light, default) and **Cockpit** (dark, instrument-panel feel for hero moments and dashboards). Toggle with `class="dark"` or `[data-theme="dark"]`.

---

## 1. Voice

**Who we're talking to:** people deciding whether to start flight school, and active PPL students early in training.

**Stance:** a knowledgeable friend, not a gatekeeping expert. Second person ("you"). Calm confidence, never hype.

**Tone:** clear · practical · motivating · structured · beginner-aware · slightly aspirational · checklist-friendly · modern but not corporate.

**Casing:** sentence case everywhere — headlines, buttons, nav. UPPERCASE reserved for short mono eyebrows/technical labels (`STEP 1 OF 8`, `ROADMAP TIMELINE`). Title Case only for proper nouns and persona names.

**Soft, non-overpromising language is mandatory.** Results are starting points, not verdicts.

- Say: "You may be leaning toward…", "This result can help you think through…", "You're likely a good fit for…", "Your result is a starting point, not a final answer."
- Avoid: "You are definitely…", "The best path for you", "Guaranteed path", "Become a pilot fast", "Everything you need to know", "Expert pilot advice."

**Lean on:** tools, resources, checklists, questions, decision support, roadmap, guide, tracker, calculator, beginner-friendly, starting point, clarity.
**Avoid overusing:** expert, guaranteed, masterclass, ultimate, secret, foolproof, hack.

**Always-on disclaimer** (footer / near tools): *"Flight School Friend is an independent educational resource. It is not legal, medical, financial, or FAA certification advice. Always verify requirements with the FAA, your aviation medical examiner, and your flight school."*


---

## 2. Color

A disciplined navy → sky-blue → graphite system on a cool off-white. Semantics stay restrained: green for "why this fits," amber for "questions to ask," red only for true errors.

### Clarity (light) — default

| Role | Token | Value |
|---|---|---|
| Background | `--bg` | `#FAFBFD` |
| Surface | `--surface` | `#FFFFFF` |
| Surface sunken | `--surface-sunken` | `#EEF2F7` |
| Surface inverse | `--surface-inverse` | `#0E1B2E` |
| Border | `--border` | `#E2E8F0` |
| Border (strong) | `--border-strong` | `#CBD5E1` |
| Text — strong (headings) | `--text-strong` | `#0E1B2E` |
| Text — body | `--text-body` | `#334155` |
| Text — muted | `--text-muted` | `#64748B` |
| Primary (CTAs, links) | `--primary` | `#0B69D6` |
| Primary hover | `--primary-hover` | `#0A5BBA` |
| Primary soft (tint fill) | `--primary-soft` | `#EAF3FE` |
| Secondary (logo/inverse) | `--secondary` | `#0E1B2E` |
| Accent (diagram lines) | `--accent` | `#5B7FB5` |
| Success | `--success` | `#1F9D5B` |
| Warning | `--warning` | `#E08600` |
| Error | `--error` | `#DC2B36` |

### Cockpit (dark) — `.dark` / `[data-theme="dark"]`

| Role | Token | Value |
|---|---|---|
| Background | `--bg` | `#08111E` |
| Surface | `--surface` | `#0F1C30` |
| Surface elevated | `--surface-elevated` | `#16273F` |
| Border | `--border` | `#21344E` |
| Text — strong | `--text-strong` | `#EAF1F9` |
| Text — body | `--text-body` | `#B6C6D8` |
| Primary | `--primary` | `#38A0FF` |
| Primary hover | `--primary-hover` | `#5CB2FF` |
| Success | `--success` | `#34C77B` |
| Warning | `--warning` | `#F0A22E` |
| Error | `--error` | `#F2575F` |

### Raw palette (source scales)

- **Navy** (ink, inverse sections, logo): `#08111E` `#0E1B2E` `#13233B` `#1B3050` `#244068`
- **Steel** (secondary diagram lines): `#3F5E8C` `#5B7FB5` `#8FAAD4`
- **Sky** (tints/soft fills): `#BBD3F0` `#D9E8FB` `#EAF3FE` `#F4F9FF`
- **Primary blue** (CTAs, links, focus): `#0A5BBA` `#0B69D6` `#1F84F0` `#3D9BFF`
- **Graphite** (warm neutral dark, recap strips): `#2B2E33` `#3A3D42` `#5A6068`
- **Neutral gray**: `#F6F8FB` `#EEF2F7` `#E2E8F0` `#CBD5E1` `#94A3B8` `#64748B` `#475569` `#334155`

**Rules:** always use semantic tokens in components, never raw scale values directly. No bluish-purple gradients, no harsh black shadows. A whisper of vertical sky→white gradient is acceptable only on hero/CTA bands.

---

## 3. Typography

**Family:** Inter throughout (display, headings, UI, body) — a clean, neutral geometric sans-serif. Single-family system.

```
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Mono** (eyebrows, `STEP x OF y`, field codes): system monospace stack — `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`.

**Weights:** Regular 400 (body) · Medium 500 (secondary UI) · SemiBold 600 (subheads, labels) · Bold 700 (section heads, quiz questions) · ExtraBold 800 (display headlines).

### Type scale

| Style | Token | Size | Line height |
|---|---|---|---|
| Display | `--fs-display` | clamp(2.75rem, 5.2vw, 4.25rem) | 1.05 |
| H1 | `--fs-h1` | 2.5rem (40px) | 1.25 |
| H2 | `--fs-h2` | 2rem (32px) | 1.25 |
| H3 | `--fs-h3` | 1.5rem (24px) | 1.25 |
| H4 | `--fs-h4` | 1.25rem (20px) | 1.25 |
| Lead | `--fs-lead` | 1.1875rem (19px) | 1.7 |
| Body | `--fs-body` | 1rem (16px) | 1.6 |
| Small | `--fs-sm` | 0.9375rem (15px) | 1.6 |
| XSmall | `--fs-xs` | 0.8125rem (13px) | 1.18 |
| Label | `--fs-label` | 0.75rem (12px) | 1.18 |

**Tracking:** display/heading slightly tight (`-0.022em` / `-0.015em`); body neutral (`0em`); eyebrows/mono loose and uppercase (`0.12em` / `0.02em`).

Body text is never smaller than 16px. Mobile hit targets are never smaller than 44px.

---

## 4. Spacing, radius & shadow

**Base grid:** 4px.

| Token | Value | Token | Value |
|---|---|---|---|
| `--space-1` | 4px | `--space-10` | 40px |
| `--space-2` | 8px | `--space-12` | 48px |
| `--space-3` | 12px | `--space-16` | 64px |
| `--space-4` | 16px | `--space-20` | 80px |
| `--space-5` | 20px | `--space-24` | 96px |
| `--space-6` | 24px | `--space-32` | 128px |
| `--space-8` | 32px | | |

**Containers:** prose 720px · quiz 760px · content 1080px · wide 1240px, fluid gutter `clamp(1.25rem, 5vw, 3rem)`.

**Section rhythm:** `clamp(4rem, 8vw, 8rem)` between major sections — generous, calm density.

**Radius:** inputs/chips 12px · cards 16px · hero/feature panels 20–28px · pills 999px · FSF logo squircle 10px.

**Shadows:** soft, low, navy-tinted — never harsh black.

- `--shadow-sm`: `0 1px 3px rgba(14,27,46,.06), 0 1px 2px rgba(14,27,46,.04)`
- `--shadow-md`: `0 4px 12px rgba(14,27,46,.07), 0 2px 4px rgba(14,27,46,.04)`
- `--shadow-lg`: `0 12px 32px rgba(14,27,46,.10), 0 4px 8px rgba(14,27,46,.05)`

Dark theme leans on borders + subtle elevation rather than shadow.

---

## 5. Backgrounds & motifs

- Mostly flat `--bg` (cool off-white) or white `--surface`. No photographic backgrounds, no busy gradients.
- Signature texture: a faint **nav-log / graph-paper grid** (32px) behind heroes and results — subtle, never loud.
- Full-bleed **navy inverse bands** break up long pages (problem sections, CTA strips, email capture).
- **Recurring motifs:** roadmap timeline (chips joined by `→` arrows ending in a filled goal chip); decision-path connectors (Understand → Compare → Plan → Decide on right-angle lines); circular checklist tokens; scattered→organized question cards; small cockpit micro-details (compass, sparklines, dotted routes, map pins) — accents only, never busy scenes.
- Illustration style: flat navy/sky vector, transparent background, token colors only, live text labels, never photographic or warm-toned.

---

## 6. Components

- **Button** — primary / secondary / inverse / soft / ghost, 3 sizes. Hover darkens; active = slight darken + `translateY(1px)`.
- **Badge** — pill eyebrow/status, 5 tones, optional mono styling.
- **Card** — white surface, 1px border, 16px radius, soft shadow. Optional colored left accent rail *only* to denote state (used sparingly). Inverse cards: no border, deeper shadow.
- **Callout** — source-aware / warning / info block.
- **TextField** — 12px radius, 1.5px border, blue focus ring, 44px+ height; inverse variant for dark bands.
- **Checkbox** — square (forms) and circular (checklist token, blue when complete).
- **QuizProgress** — `STEP x OF y` + animated progress bar.
- **AnswerChoice** — large tappable radio card; selected = blue border + tinted fill + filled radio.
- **RoadmapTimeline** — chip chain → filled goal chip.
- **ChecklistItem** — green checkmark ("fits") or amber question marker ("clarify next").
- **PersonaCard** — Weekend Hobbyist / Career Captain / Personal Owner / Research-First.

---

## 7. Iconography

- **Library:** Lucide (lucide.dev) — 1.75–2px stroke, rounded joins, geometric.
- **Suggested mappings:** compass → `compass` · route → `route`/`map` · checklist → `list-checks`/`circle-check` · cost → `calculator`/`dollar-sign` · schedule → `calendar` · medical → `stethoscope`/`heart-pulse` · school → `graduation-cap` · instructor → `user-round` · goal → `target`/`flag` · plane → `plane` (sparingly).
- Stroke icons only for UI. The FSF squircle logo mark is the one filled brand glyph.
- Decorative icons fill with `--steel-500`/`--primary`; checkmarks `--success`; question markers `--warning`.
- **Avoid:** emoji as icons, generic airplane silhouettes, wings, clouds, runway photos, pilot badges, military/tactical iconography.

---

## 8. Motion

- Restrained and functional: fade + 8–12px upward translate on entrance, `200ms` `ease-out` (`cubic-bezier(0.22, 0.61, 0.36, 1)`), stagger ≤60ms.
- Quiz steps cross-fade/slide gently; progress bar animates width.
- No bounce, no parallax, no infinite decorative loops.
- Always honor `prefers-reduced-motion`.

**States:**
- *Hover:* buttons darken; cards lift (shadow ↑) with border going blue; links shift to hover color.
- *Focus:* visible 3px blue focus ring on every interactive element — never remove outlines.
- *Active/press:* slight darken + `translateY(1px)` / `scale(0.99)`.
- *Selected (quiz):* blue border + tinted fill + filled radio.

---

## 9. Layout & responsiveness

- Mobile-first. Single column below 768px; multi-column grids at `md`/`lg`.
- Quiz is always a single centered column, ≤760px.
- Long-form guides use the 720px prose container; tool pages use 1080px.
- Nav collapses to a sheet/drawer on mobile; the primary CTA stays visible.

---

## 10. Accessibility

- Target WCAG AA. Body text ≥16px, mobile touch targets ≥44px.
- Every interactive element keyboard-reachable with a visible focus ring.
- Quiz answers are real radios/`role="radio"` in a `radiogroup`; progress uses `aria-valuenow/min/max`.
- Color is never the sole signal — checkmarks and warning markers carry icons + text, not just color.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 11. Do / Don't

**Do:** speak in "you"; frame results as a starting point; use checklists, roadmaps, comparison tables; cite and disclaim; keep motion calm; keep focus rings visible.

**Don't:** overpromise ("guaranteed," "best," "fast"); use airplane silhouettes, wings, clouds, runways, military or pilot-badge imagery; use emoji as icons; use harsh shadows or bluish-purple gradients; write in a gatekeeping-expert tone.
