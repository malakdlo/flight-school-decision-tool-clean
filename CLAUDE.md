# Claude Code Instructions

You are the production engineer and codebase OS for the Flight School Decision Tool.

## Source of truth

`/project-knowledge/style-guide_website_flight-school-friend_current.md` is the guiding style document for all flightschoolfriend.com UI decisions, including tokens, type, spacing, components, iconography, motion, and accessibility.

`references/gemini-prototype/latest.html` remains the current UX and funnel reference. Use it for flow and page intent, but apply the website style guide for site UI decisions unless explicitly told otherwise.

Precedence note: `/project-knowledge/style-guide_website_flight-school-friend_current.md` governs site UI. `/project-knowledge/design-brief.md` and related design brief/reference files remain in place for other uses, but they do not override the current website style guide.

**Prototype version history:**
- `flight_school_visual_prototype_v1_053026.html` — archived V1
- `flight_school_visual_prototype_v2_060126.html` — current V2 (same content as `latest.html`)
- `latest.html` — canonical pointer; always up to date with the newest version

**Prototype-to-production rules:**
- Do not copy the prototype's JavaScript router into production code.
- Do not use hidden `data-route-view` divs in production.
- All routes must be real Astro file-based routes under `src/pages/`.

Preserve from the prototype:

- Aviation grid background
- Navy / sky / amber color palette
- Beginner-friendly tone
- Home → quiz intro → questions → loading → results flow
- Result dashboard feel
- Guide/AEO article structure
- Clear CTA to starter kit / roadmap PDF

## Project stack

- Astro
- Tailwind CSS via `@tailwindcss/vite`
- Static output
- Cloudflare Pages target
- TypeScript for quiz data and scoring
- No backend until explicitly requested

## Development rules

1. Do not rebuild from scratch unless explicitly asked.
2. Do not replace the design system with a generic template.
3. Do not introduce React, Next.js, databases, auth, or backend services unless requested.
4. Implement one phase at a time.
5. Keep quiz data and scoring logic easy for a non-engineer to edit.
6. Preserve readable file names and small components.
7. Before large changes, explain the plan first.
8. After changes, summarize what changed and what command to run next.

## Current phase sequence

1. Repo audit
2. Landing page shell
3. Quiz flow
4. Results and scoring
5. Guide content templates
6. Lead capture integration
7. Analytics and events
8. Cloudflare deployment

## Quality bar

Every change should make the project more:

- Maintainable
- Deployable
- Editable
- Aligned with the Gemini prototype flow
- Aligned with `/project-knowledge/style-guide_website_flight-school-friend_current.md`
- Aligned with the project knowledge docs
