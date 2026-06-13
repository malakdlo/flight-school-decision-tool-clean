# Codex Repo Audit — Handoff Bundle vs Local Project

Date: 2026-06-02

## 1. Executive Summary

The handoff bundle should become the updated strategic source of truth. It reframes the project as **Flight School Friend**, a broader resource and business platform, with the **Flight School Decision Tool** as the first quiz/funnel/product. The local production code is already mostly aligned with that direction: it uses Flight School Friend branding, real Astro routes, guide pages, tool placeholders, find-resource placeholders, quiz pages, and four result pages.

The main drift is in documentation and operating instructions, not production code. The local `README.md`, `CLAUDE.md`, `project-knowledge/*`, `prompts/claude/*`, and `references/gemini-prototype/README.md` still describe the V1 workflow where Gemini/latest.html and Claude Code are the primary source of truth. They should be updated or archived after review.

Do not rewrite the app yet. P0 should be a documentation/source-of-truth migration that preserves the working deployed Astro/Tailwind/Cloudflare app.

## 2. Handoff Bundle Source-Of-Truth Summary

The handoff bundle says:

- **Brand:** Flight School Friend is the umbrella brand and future resource platform.
- **First product:** Flight School Decision Tool is the first quiz/funnel/product.
- **Premium product:** Personalized 28-day Flight School Decision Roadmap PDF.
- **Funnel:** SEO/social/content -> quiz landing page -> quiz -> result teaser -> email capture -> full result -> roadmap upsell -> nurture/resources.
- **Audience:** aspiring pilots before commitment, career switchers, parents/teens, college-age researchers, recreational flyers, ownership/travel-motivated adults, and research-first users.
- **Result direction:** segments should eventually support Career Captain, Weekend Wing, Cautious Researcher, Medical / Logistics First, Budget Builder, and Dream vs. Reality Explorer.
- **Workflow:** move from `ChatGPT -> Gemini -> Claude Code -> GitHub -> Cloudflare` to `Codex repo review/planning -> Gemini prototype -> Codex production update -> build/test -> GitHub -> Cloudflare`.
- **Source hierarchy:** production code first, then `AGENTS.md` and current `project-knowledge`, then latest Gemini prototype references, then prompts, then archives.
- **Prototype handling:** Gemini output is reference/design input, not production source. Save versions under `references/gemini-prototypes/YYYY-MM-DD-vX/` with prompt/notes and a `LATEST.md` manifest.

## 3. Current Local Repo Architecture Map

Framework/build:

- Astro static site with Tailwind through `@tailwindcss/vite`.
- `package.json` scripts: `dev`, `build`, `preview`, `deploy:pages`.
- Build command: `npm run build`, which runs `astro check && astro build`.
- Cloudflare target: static `dist`, confirmed by `wrangler.toml` with `pages_build_output_dir = "dist"`.

Production routes:

- `/` -> `src/pages/index.astro`
- `/flight-school-decision-tool/` -> `src/pages/flight-school-decision-tool/index.astro`
- `/flight-school-decision-tool/quiz/` -> `src/pages/flight-school-decision-tool/quiz/index.astro`
- `/flight-school-decision-tool/results/career-captain/`
- `/flight-school-decision-tool/results/personal-owner/`
- `/flight-school-decision-tool/results/research-first/`
- `/flight-school-decision-tool/results/weekend-hobbyist/`
- `/guides/` plus four guide pages
- `/tools/` plus three tool placeholder pages
- `/find/` plus AME, CFI/DPE, flight schools, scholarships template previews
- `/about/`, `/privacy/`, `/404`

Quiz architecture:

- Questions: `src/data/quizQuestions.ts`
- Scoring: `src/lib/scoring.ts`
- Result type union: `src/types/quiz.ts`
- Quiz UI/client script: `src/pages/flight-school-decision-tool/quiz/index.astro`
- Result copy/rendering: individual result page `.astro` files, not centralized data.

Shared layout:

- `src/layouts/BaseLayout.astro`
- `src/components/Navbar.astro`
- `src/components/Footer.astro`
- `src/config/site.ts`
- `src/styles/global.css`

SEO/deploy assets:

- `public/robots.txt`
- `public/sitemap.xml`
- Per-page metadata via `BaseLayout`.
- No `llms.txt` found.

Prototype references:

- Current local folder is `references/gemini-prototype/`, singular.
- `latest.html` is treated locally as canonical V2 reference.
- Handoff recommends `references/gemini-prototypes/`, plural, with dated subfolders and `LATEST.md`.

## 4. Handoff Vs Local Comparison Table

| Area | Handoff says | Local project says/does | Conflict? | Recommendation |
|---|---|---|---|---|
| Business mission | Flight School Friend is broader resource platform; Decision Tool is first product. | Production pages use Flight School Friend; older docs/README emphasize Decision Tool starter. | Partial | Make handoff business framing primary in new docs. |
| Product scope | Quiz plus result funnel, roadmap, guides, worksheets, future tools/resources. | App has quiz, results, guides, tools/find placeholders. | Low | Preserve app; update docs to match existing broader surfaces. |
| Audience segments | Career, teen/parent, college, recreational, ownership, research-first. | Local docs include many of these; quiz has four segments. | Medium | Expand docs/quiz roadmap to include handoff segments. |
| Monetization plan | Email capture, paid 28-day roadmap PDF, worksheets, future directory/leads. | Local result/guide forms are placeholder-only; README mentions starter kit. | Medium | Document current placeholder state; plan email/payment integration later. |
| Quiz flow/results | Landing -> intro -> questions -> teaser -> email -> full result -> paid CTA. | Current quiz redirects straight to full result pages with placeholder email section. | Medium | P2 add result teaser/email gate/paid CTA after docs cleanup. |
| Result segments | Six possible strategic segments. | Four implemented: Weekend Hobbyist, Career Captain, Personal Owner, Research-First. | Medium | Keep current four for now; decide whether to rename/expand after analytics/CRO plan. |
| Email funnel | Email unlocks full result/resources; roadmap upsell follows. | Forms only show local success messages; no backend/provider. | High for conversion | Add provider choice and form integration in a future implementation phase. |
| Site architecture | Wants guides/resources, future directories/tools. | Local repo already has guides, tools, find routes. | Low | Keep and formalize as roadmap in source-of-truth docs. |
| Guide roadmap | Cost, Part 61/141, choosing school, PPL requirements, plus future clusters. | All four initial guides exist. | Low | Improve content/schema/internal links; add `llms.txt` if desired. |
| Tech stack | Likely Astro/Tailwind/Cloudflare; inspect first. | Confirmed Astro static + Tailwind + Cloudflare Pages. | None | Keep stack stable. |
| Deployment | GitHub -> Cloudflare Pages; `npm run build`; `dist`. | README and wrangler agree. | Low | Preserve; update docs for Codex-led workflow. |
| AI workflow | Codex primary repo operator; Gemini prototype; Claude optional. | README/CLAUDE/prompt files say Claude Code primary. | High | Add `AGENTS.md`; update `CLAUDE.md`; archive old Claude-first prompts. |
| Prompt organization | `prompts/codex`, `prompts/gemini`, optional Claude. | Local has `prompts/chatgpt` and `prompts/claude`; no Codex/Gemini folders. | High | Copy/adapt handoff prompts into repo and archive stale prompts. |
| Prototype handling | Prototypes are references with dated subfolders and manifest. | `references/gemini-prototype/latest.html` is local canonical source. | Medium | Move toward `references/gemini-prototypes/LATEST.md`; preserve old folder during migration. |

## 5. Stale/Risky File List

| File | Keep / update / archive / delete later | Reason | Recommended replacement/source |
|---|---|---|---|
| `README.md` | Update | Says repo is structured so Claude Code is production engineer; V1 operating model is outdated. | Handoff `README_START_HERE.md`, `03-dev-workflow-os.md`, local confirmed build notes. |
| `CLAUDE.md` | Update | Useful stack guardrails, but says `latest.html` is current source of truth and Claude is codebase OS. | Handoff `CLAUDE.md`; keep Claude as secondary/compatibility. |
| missing `AGENTS.md` | Create | Codex needs repo-local operating instructions. | Handoff `AGENTS.md`. |
| `project-knowledge/design-brief.md` | Archive or fold into design system | Says Gemini V1 prototype is design source of truth. | New `project-knowledge/00-current-source-of-truth.md` and design notes. |
| `project-knowledge/design-system.md` | Keep/update | Useful palette/component notes; lacks current source hierarchy. | Keep as supporting design doc or merge into architecture/design section. |
| `project-knowledge/implementation-plan.md` | Archive/update | Phase plan is mostly already completed and V1-specific. | Handoff `05-current-vs-future-architecture.md` and new implementation plan. |
| `project-knowledge/product-strategy.md` | Update | Mostly compatible but narrower than Flight School Friend + paid 28-day roadmap framing. | Handoff `00`, `02`. |
| `project-knowledge/project-brief.md` | Update/archive | Still names only Decision Tool and old result paths. | Handoff `00`, `01`. |
| `project-knowledge/quiz-logic.md` | Update | Says six-question quiz and old segment names; current code has eight questions/four different result IDs. | Current `src/data/quizQuestions.ts`, `src/lib/scoring.ts`, handoff `01`. |
| `project-knowledge/seo-aeo-strategy.md` | Keep/update | Mostly aligned; should add broader roadmap and current routes. | Handoff `04-site-resource-roadmap.md`. |
| `prompts/chatgpt/gemini-prototype-request.md` | Archive/update | Older Gemini prompt lacks updated funnel, 28-day roadmap, Codex production mapping. | Handoff `prompts/gemini/01-create-visual-prototype.md`. |
| `prompts/claude/*` | Archive or keep as legacy | Claude-first operating prompts conflict with Codex primary workflow. | Handoff `prompts/codex/*`; optional `prompts/claude/` compatibility. |
| `references/gemini-prototype/README.md` | Update | Says `latest.html` is source of truth for Claude Code. | New `references/gemini-prototypes/LATEST.md`. |
| `references/gemini-prototype/latest.html` | Keep as reference | Current production likely came from it; should not remain strategic source of truth. | Store under dated prototype folder with notes. |
| `.claude/` | Review before committing | Untracked; contains local Claude commands/settings. | Keep untracked or intentionally document/commit only non-sensitive commands. |
| `cloude.md` / `claude.md` lowercase | Not found | Requested misspelling risk does not appear in current repo. | No action. |

Do not delete any of these yet. Archive after the new source-of-truth docs are created.

## 6. Recommended Source-Of-Truth File Structure

Recommended repo structure:

```txt
project-knowledge/
  00-current-source-of-truth.md
  01-business-strategy.md
  02-product-flight-school-decision-tool.md
  03-audience-monetization-funnel.md
  04-site-architecture.md
  05-dev-workflow.md
  06-seo-content-roadmap.md
  07-ai-assistant-roles.md
  archive/

prompts/
  codex/
  gemini/
  claude/
  archive/

references/
  gemini-prototypes/
    LATEST.md
  handoffs/
    2026-06-02-flight-school-friend-context/
  audits/
    2026-06-02-context-review/
  archive/
```

The handoff bundle should be copied into the repo under:

```txt
references/handoffs/2026-06-02-flight-school-friend-context/
```

Then distill it into current source-of-truth docs under `project-knowledge/`. The copied handoff should remain a historical input, not the day-to-day source after migration.

## 7. Recommended Prompt/Skill Structure

Global Codex skill candidates under `~/.codex/skills/`:

- `astro-tailwind-cloudflare-implementation`: production-safe Astro/Tailwind static-site changes and build checks.
- `gemini-prototype-ingestion`: compare prototype HTML to Astro files, map sections to components, remove prototype-only code.
- `project-context-migration`: archive stale docs, create migration notes, update source hierarchy.

Claude skills under `~/.claude/skills/`:

- Optional equivalents for targeted code edits, but Claude should read repo `CLAUDE.md` and defer to `AGENTS.md`/project-knowledge hierarchy.

Repo-local docs:

- `PROJECT_DIR/AGENTS.md`: primary Codex operating doc from handoff.
- `PROJECT_DIR/CLAUDE.md`: compatibility doc that explicitly says Claude is secondary/optional.
- `PROJECT_DIR/prompts/codex/`: repo audit, project-knowledge reorg, prototype-to-Astro, quiz funnel update.
- `PROJECT_DIR/prompts/gemini/`: visual prototype and guide page prototype prompts.
- `PROJECT_DIR/prompts/claude/`: optional legacy/secondary prompts, clearly labeled.

Workflow-specific prompt docs:

- Astro/Tailwind implementation: `prompts/codex/03-convert-gemini-prototype-to-astro.md`
- Gemini prototype ingestion: same Codex prompt plus Gemini visual prototype prompt.
- Quiz funnel/CRO updates: `prompts/codex/04-implement-quiz-funnel-update.md`
- SEO guide creation: add/keep Codex and Gemini guide-page prompts.
- Cloudflare deploy checks: Codex prompt or checklist under `prompts/codex/`.
- Safe refactoring: add an explicit Codex safe-refactor checklist or include in `AGENTS.md`.

## 8. Prioritized Implementation Plan

### P0 — Preserve working app and identify source of truth

- Goal: lock in current working state and eliminate source ambiguity.
- Files likely affected: `AGENTS.md`, `CLAUDE.md`, `README.md`, `project-knowledge/*`, `references/handoffs/*`.
- Risk: Low if docs-only.
- Validation: `git status`; if any code touched, `npm run build`.
- Assistant: Codex primary; ChatGPT for strategy review if desired.

### P1 — Update docs and prompts

- Goal: migrate handoff docs/prompts into repo, archive stale Claude/V1 context with migration notes.
- Files likely affected: `project-knowledge/`, `prompts/`, `references/gemini-prototypes/`, `references/archive/`.
- Risk: Low/medium due possible context churn.
- Validation: `find project-knowledge prompts references -maxdepth 3 -type f | sort`; `git diff --stat`.
- Assistant: Codex primary.

### P2 — Update quiz/product funnel

- Goal: add teaser/email/full-result/paid-roadmap flow, centralize result segment data, improve CTAs.
- Files likely affected: `src/pages/flight-school-decision-tool/quiz/index.astro`, result pages, `src/data/quizQuestions.ts`, new `src/data/resultSegments.ts`, `src/lib/scoring.ts`.
- Risk: Medium because it affects the core conversion path.
- Validation: `npm run build`; manual quiz path test through all result routes.
- Assistant: Gemini for prototype, Codex for implementation; ChatGPT for CRO copy/segment logic.

### P3 — Add guide/resource pages

- Goal: strengthen SEO guides, resource appendix, worksheets/tool pages, internal links.
- Files likely affected: `src/pages/guides/*`, `src/pages/tools/*`, `src/pages/find/*`, `public/sitemap.xml`, maybe content collections later.
- Risk: Low/medium.
- Validation: `npm run build`; check sitemap route coverage.
- Assistant: ChatGPT for outlines, Gemini for page prototypes, Codex for production.

### P4 — Add analytics/CRO workflow

- Goal: track homepage visits, quiz starts/completions, result distribution, email conversion, roadmap clicks.
- Files likely affected: `BaseLayout`, quiz page, result pages, forms, maybe analytics config.
- Risk: Medium due third-party/provider choices.
- Validation: `npm run build`; browser/network event smoke test.
- Assistant: Codex for implementation; ChatGPT for experiment design.

### P5 — Future architecture and monetization expansion

- Goal: support paid PDF roadmap, provider integration, directory, calculators, training tools.
- Files likely affected: TBD; may require backend/serverless/provider decisions.
- Risk: High if auth/payment/personalization is added.
- Validation: build, provider sandbox tests, Cloudflare Pages/Workers compatibility checks.
- Assistant: ChatGPT for business/product, Gemini for UX, Codex for architecture/implementation; Claude optional for scoped patches.

## 9. Commands Run And Notable Outputs

Commands run:

```bash
printf 'HANDOFF_DIR=%s/Downloads/flight_school_friend_handoff\nPROJECT_DIR=%s/Projects/flight-school-decision-tool-clean\n' "$HOME" "$HOME"
ls -la "$HOME/Downloads/flight_school_friend_handoff"
find "$HOME/Downloads/flight_school_friend_handoff" -maxdepth 4 -type f | sort
pwd
ls -la
find . -maxdepth 4 -type f -not -path './node_modules/*' -not -path './dist/*' -not -path './.git/*' | sort | sed 's#^./##' | head -500
git status
git log --oneline -8
cat package.json
find src/pages -type f | sort
find src public references project-knowledge prompts -maxdepth 3 -type f | sort
grep -RInE "Flight School Friend|Flight School Decision Tool|Claude|Claude Code|Codex|Gemini|prototype|latest|Cloudflare|one-off|quiz|roadmap|email|28-day|cloude|claude" ...
find . -iname '*agent*' -o -iname '*claude*' -o -iname '*cloude*' | sort
sed -n ... selected handoff and repo files
mkdir -p references/handoffs/2026-06-02-context-review
```

Notable outputs:

- Handoff path exists: `/Users/malaklopez/Downloads/flight_school_friend_handoff`.
- Project path exists: `/Users/malaklopez/Projects/flight-school-decision-tool-clean`.
- Git branch: `main`, up to date with `origin/main`.
- Untracked: `.claude/`.
- Recent commits include production QA cleanup and V2 Gemini prototype conversion.
- `rg` is not installed, so `grep` was used.
- No lowercase `claude.md` or misspelled `cloude.md` found.
- Local route inventory includes nested quiz and result pages under `src/pages/flight-school-decision-tool/`.

## 10. Risks, Assumptions, And Questions

Risks:

- Local docs currently overstate Gemini `latest.html` and Claude Code as source of truth; future assistants may revive stale workflow if these are not updated.
- Email capture and roadmap CTAs are placeholder-only, so conversion assumptions are not yet validated.
- Result content is duplicated across individual `.astro` pages instead of centralized segment data, which makes future segment changes harder.
- `public/sitemap.xml` does not include `/tools/` and `/find/` template routes.
- No `AGENTS.md` exists yet in the repo, so Codex lacks repo-local instruction continuity.
- The untracked `.claude/` folder may contain useful local commands, but should be reviewed before any commit.

Assumptions:

- Cloudflare Pages builds from GitHub `main` using `npm run build` and `dist`, matching README and `wrangler.toml`.
- The current deployed app should be preserved while docs/workflow are cleaned up.
- The handoff bundle is newer than the local docs and should guide the migration.

Questions:

- Should the four current result segments remain for V1, or should the next prototype expand to the six handoff segments?
- Which email provider/payment provider should be used before implementing capture and roadmap purchase?
- Should `/tools/` and `/find/` template-preview pages be indexed now, or excluded until they are production content?
- Should `.claude/commands/llm-council.md` be committed as a supported workflow asset or kept local-only?
