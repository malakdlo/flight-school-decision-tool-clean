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

Cloudflare Pages settings:

```text
Build command: npm run build
Build output directory: dist
```

Or deploy with Wrangler:

```bash
npm run deploy:pages
```

## Recommended Git setup

```bash
git init
git add .
git commit -m "Initial clean Astro build from Gemini prototype"
```

Then create a new GitHub repo and connect it to Cloudflare Pages.

## Operating model

```text
ChatGPT = strategy, product direction, docs, prompts
Gemini = fast visual prototype builder
Claude Code = production engineer and codebase OS
GitHub = source of truth
Cloudflare = deployment
```

## Important rule

Do not redesign the site from scratch. The Gemini prototype is the visual and funnel source of truth for V1. Claude Code should preserve the visual direction and refactor it into clean production code.
