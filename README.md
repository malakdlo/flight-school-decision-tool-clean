# Flight School Decision Tool

A clean Astro + Tailwind starter rebuilt from the Gemini visual prototype. This repo is intentionally simple: static-first, Cloudflare Pages-ready, and structured so Claude Code can act as the production engineer without redesigning the prototype.

## What this project contains

- A landing page based on the Gemini prototype
- A client-side quiz flow with basic scoring
- Four result paths: Weekend Hobbyist, Career Pilot, Personal Aircraft / Business Travel, and Explorer
- A guide article template for SEO/AEO/GEO content
- Project knowledge docs for strategy and implementation continuity
- Claude Code prompts for phased build work
- A preserved copy of the Gemini prototype in `/references/gemini-prototype`

## Website UI guidance

`/project-knowledge/style-guide_website_flight-school-friend_current.md` is the guiding style document for all flightschoolfriend.com UI decisions, including tokens, type, spacing, components, iconography, motion, and accessibility.

The Gemini prototype remains a UX and funnel reference. `/project-knowledge/design-brief.md` and related design brief/reference files remain in place for other uses, but they do not override the current website style guide for site UI work.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL Astro prints in your terminal.

To stop the dev server, press:

```bash
Control + C
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

Deployment is automatic: push to `main` and Cloudflare Pages builds and deploys.

**Cloudflare Pages settings (confirmed working):**

| Setting | Value |
|---|---|
| Framework | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Production branch | `main` |

Or deploy manually with Wrangler:

```bash
npm run deploy:pages
```

## Deployment Notes

- `npm run build` runs `astro check && astro build`. Both must pass for a deployment to succeed.
- `vite` is pinned to `^7` in `devDependencies`. Do not remove this pin or upgrade it to `^8` — see Troubleshooting below.
- No environment variables are required for static builds. Add them in the Cloudflare Pages dashboard only if a future phase introduces server-side features.

## Troubleshooting

**`astro check` fails with: `Type 'Plugin<any>[]' is not assignable to type 'PluginOption'`**

This is a duplicate Vite version conflict. It happens when npm installs `vite@8` at the project root to satisfy `@tailwindcss/vite`'s peer dependency, while Astro bundles its own `vite@7`. TypeScript sees two incompatible Vite type sets and fails on the plugin assignment in `astro.config.mjs`.

Fix: ensure `package.json` has `"vite": "^7"` in `devDependencies`, then run `npm install`. npm will deduplicate to a single `vite@7.x` that both Astro and `@tailwindcss/vite` accept.

## Recommended Git setup

```bash
git init
git add .
git commit -m "Initial clean Astro build from Gemini prototype"
```

Then create a new GitHub repo and connect it to Cloudflare Pages for automatic deploys on push to `main`.

## Operating model

```text
ChatGPT = strategy, product direction, docs, prompts
Gemini = fast visual prototype builder
Claude Code = production engineer and codebase OS
GitHub = source of truth
Cloudflare = deployment
```

## Important rule

Do not redesign the site from scratch. The Gemini prototype is the UX and funnel reference for V1, and `/project-knowledge/style-guide_website_flight-school-friend_current.md` governs the production website UI. Claude Code should preserve the intended flow and refactor it into clean production code.
