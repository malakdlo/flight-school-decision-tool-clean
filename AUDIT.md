# Repo Audit — feature/radio-call-builder

_Audit performed before building the Radio Call Script Builder. Branch: `feature/radio-call-builder` (cut from `main` @ `151190e`)._

## 1. Actual repo conventions (what the code really does)

### Stack
- **Astro** static site, Tailwind via `@tailwindcss/vite`, TypeScript for quiz/scoring data. Cloudflare Pages target. No backend.
- **No React anywhere.** Interactive tools are plain Astro components with a scoped `<script>` (vanilla JS, `// @ts-nocheck`) + scoped `<style>`. State is an in-memory `state` object mutated by DOM event listeners and re-rendered by hand.
- Path alias `@/` → `src/` (used in every page/component import).
- Build command: `npm run build` = `astro check && astro build`. Dev: `npm run dev` (`astro dev`).

### Established tool pattern — model to match: METAR decoder (newest)
The newest, cleanest pattern (`src/pages/tools/metar-decoder/index.astro` + `src/components/tools/METARDecoderTrainer.astro`):

1. **Route** = thin wrapper page at `src/pages/tools/<slug>/index.astro`:
   - Imports `BaseLayout` (gives Navbar + Footer + GTM + fonts + JSON-LD graph).
   - Defines `title`, `description`, `canonical` (full `https://flightschoolfriend.com/tools/<slug>/`), and a `structuredData` object (`@type: WebApplication`, `applicationCategory: 'EducationalApplication'`, `isAccessibleForFree: true`, `author: { '@id': '…/#person' }`).
   - Renders `<BaseLayout …><MyTrainer /></BaseLayout>`.
2. **Component** = `src/components/tools/<Name>.astro`:
   - Single root `<section class="fsf-<name>" aria-labelledby=…>`.
   - Scoped `<style>` **re-declares the design tokens locally** at the top (`--bg`, `--surface`, `--primary`, `--text-strong`, shadows, etc. — copied from the style guide's Clarity palette) rather than relying on globals. Self-contained.
   - Scoped `<script>` (`// @ts-nocheck`) holds data + `state` + render functions + listeners. `data-*` attributes are the JS ↔ DOM hooks (`data-question-form`, `data-choice`, etc.). No framework, no localStorage, no fetch.

### Styling / token conventions (from the live tools + style guide)
- Tool container width: `min(100% - clamp(2.5rem,10vw,6rem), 1080px)`, centered, `padding: clamp(4rem,8vw,7rem) 0`.
- Cards: `1px solid var(--border)`, radius 16px (12px on ≤420px), `--shadow-md`.
- Eyebrows: mono stack, uppercase, `0.12em` tracking, `--primary`, 0.75rem, weight 700.
- Buttons/inputs/chips: `min-height: 44px`, radius 12px; inputs `1.5px` border, 48px min height.
- Selected state: `border-color: var(--primary); background: var(--primary-soft)`.
- Focus: `outline: 3px solid rgba(11,105,214,.35); outline-offset: 3px` on `:focus-visible`.
- Active press: `translateY(1px)`.
- Sentence case everywhere; peer/friend voice, soft non-overpromising language.
- Responsive breakpoints used in tools: `760px` (collapse grids to 1 col) and `420px` (tighten radius/padding, full-width actions).
- `@media (prefers-reduced-motion: reduce)` disables transitions.
- Inverse/mono "strip" for machine text (METAR raw string) = `--surface-inverse` bg, mono font, `overflow-x:auto`, `white-space:nowrap`.

### Disclaimer convention
- Standard formal disclaimer, used verbatim as a `SITE_DISCLAIMER` constant in maneuvers-quiz:
  > "Flight School Friend is an independent educational resource. It is not legal, medical, financial, or FAA certification advice. Always verify requirements with the FAA, your aviation medical examiner, and your flight school."
- Tools ALSO carry a short tool-specific "training note" aside (amber `!` marker) reinforcing "practice only, verify with instructor/official source."
- Global `Footer.astro` carries only a short one-line disclaimer; the full formal text is added **inline per tool**.

## 2. Recent change map (last ~20 commits — what Codex shipped)
| Commit | What landed |
|---|---|
| `151190e` | Track maneuvers quiz data for deploy |
| `0b9fbc5` | Maneuvers quiz tool (`/tools/maneuvers-quiz/`, BaseLayout + inline component + JSON data file) |
| `aa3cea0` | METAR decoder (`/tools/metar-decoder/`, BaseLayout + `components/tools/METARDecoderTrainer.astro`) — **newest reference pattern** |
| `e4e0d22` | PPL requirements tracker page (`/tools/ppl-requirements-tracker/`) |
| `ff23e0a` | Crosswind component calculator (`/tools/crosswind-calculator/`) |
| `1c603cb` | Website style guide references update (current style guide) |
| `ae137e6`, `709ddf2` | Guides index layout, audience category pages |
| `1974bdc`, `2ecc5e8` | PPL solo prep tools, Kit captures on results/calculator |
| earlier | Journey/stage restructure, homepage repositioning, cost calculator V1, Cloudflare deploy fixes |

Recent tools cluster under `/tools/<slug>/` and are unlinked-until-ready in several cases.

## 3. Discrepancies — CLAUDE.md / guidance docs vs. current repo state
**(Logged for your review — I did NOT edit CLAUDE.md.)**

1. **"static React" (task brief) vs. reality.** The build brief says the tool should be "static React … same architecture as the existing trainers." The existing trainers are **not React** — they are Astro components with vanilla `<script>`. CLAUDE.md rule #3 also forbids introducing React. **Resolution:** I built to the actual trainer architecture (Astro + vanilla JS, in-memory state, no localStorage/API), honoring "same architecture as existing trainers" over the literal word "React." No user decision needed.

2. **`site-map-and-funnels.md` does not exist.** The task brief names `/project-knowledge/site-map-and-funnels.md` as a canonical authority for the page/funnel inventory. It is **not present** in `/project-knowledge/` (nor anywhere in the repo). Closest existing docs: `email-map.md`, `product-strategy.md`, `seo-aeo-strategy.md`. **Impact:** the "update site-map-and-funnels.md" wrap-up step cannot be done against an existing file — it would need to be created, or the brief refers to a doc that lives outside this repo. Flagging for you; not blocking the build (tool stays unlinked regardless).

3. **CLAUDE.md phase sequence is stale.** CLAUDE.md lists an 8-phase sequence ending at "Cloudflare deployment" with the current phase around landing/quiz. In reality the site is well past that — homepage, quiz, results personas, guides, and five+ tools are all shipped and deploying to Cloudflare. The phase list no longer reflects project state.

4. **Two parallel tool page patterns exist.** `crosswind-calculator` and `ppl-requirements-tracker` are **fully standalone pages** (own `<!doctype html>`/`<head>`/`<body>`, they bypass `BaseLayout`, so no shared Navbar/Footer). `metar-decoder` and `maneuvers-quiz` use `BaseLayout`. Per your instruction to match the newest (METAR), I used the **BaseLayout** pattern. Noting the inconsistency so it isn't mistaken for the standard.

5. **`project-knowledge/gated-content.md` is untracked** (uncommitted, pre-existing on `main` before I branched). Safe to branch around — it carries over untouched. I did not add or modify it.

6. **`design-brief.md` / `design-system.md` are thin/older** and, per CLAUDE.md's own precedence note, are superseded by the current website style guide for all UI decisions. Followed the style guide.

## 4. Build decisions locked from this audit (no user input needed)
- Route: `src/pages/tools/radio-call-builder/index.astro` (BaseLayout wrapper) + `src/components/tools/RadioCallBuilder.astro` (component). METAR pattern.
- In-memory `state`, vanilla JS, no localStorage/fetch. Local token block in scoped `<style>`.
- Standard `SITE_DISCLAIMER` constant + the tool-specific phraseology disclaimer + "Draft — under review" banner component.
- Page left **unlinked** — no nav/homepage/footer/tools-index edits.
