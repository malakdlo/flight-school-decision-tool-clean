# Cloudflare Pages Deploy Troubleshooting - 2026-06-15

## Problem

The local site builds and shows the updated navigation, `/tools/`, `/tools/flight-school-cost-calculator/`, and updated sitemap entries. GitHub `main` is also up to date. The live site at `www.flightschoolfriend.com` is not reflecting those changes.

Live symptoms observed:

- The homepage still shows the older nav without the new Tools menu.
- The homepage still links the Flight School Cost Calculator card to `/tools/` and labels it `Template Preview`, which matches the source before commit `1365356`.
- `https://www.flightschoolfriend.com/sitemap.xml` is missing:
  - `https://www.flightschoolfriend.com/tools/`
  - `https://www.flightschoolfriend.com/tools/flight-school-cost-calculator/`
- `/tools/` and `/tools/flight-school-cost-calculator/` returned HTTP 200 during testing, but production did not show the expected current content.

## Key Finding

This is not a Wrangler issue.

The repo is connected to Cloudflare Pages auto-deploy through GitHub. GitHub check-runs confirm Cloudflare Pages is receiving the commits, but the Cloudflare Pages builds are failing. Production is therefore stuck on the last successful deployment.

Update after reviewing the Cloudflare failed deployment log: `npm run build` succeeds in Cloudflare. The failure happens after the Astro build, when Cloudflare Pages reads the generated `dist/server/wrangler.json` deploy configuration.

## Deployment Timeline

- `77ec2cf` - `Production QA cleanup: sitemap, unused file removal, verified clean`
  - Cloudflare Pages status: successful deploy
  - Date from GitHub check-run: 2026-06-02
  - This appears to be the version production is still serving.

- `d55a881` - `Add Kit email capture integration`
  - Cloudflare Pages status: build failed
  - Important change: switched Astro from static output to Cloudflare server output:
    - `output: 'static'` became `output: 'server'`
    - added `@astrojs/cloudflare`
    - added server-side API routes for Kit lead capture

- `eb777d8` - `Ignore local email env file`
  - Cloudflare Pages status: build failed

- `1365356` - `Add V1 flight school cost tool`
  - Cloudflare Pages status: build failed
  - This is the commit that added the calculator page and related code.

- `b5901c9` - `Update cost calculator navigation`
  - Cloudflare Pages status: build failed
  - This is the commit that updated nav and sitemap.

- `07db8b2` - `Codex modified astro config file`
  - Cloudflare Pages status: build failed
  - This commit attempted to reduce unnecessary Cloudflare adapter bindings.

## What Was Checked

- Local branch was clean and matched `origin/main` during the first investigation.
- GitHub `main` was verified at the expected latest commit.
- There are no GitHub Actions workflows. Deploys are coming from the Cloudflare Workers and Pages GitHub app.
- GitHub check-runs showed Cloudflare Pages failures, not missing pushes.
- The Cloudflare Pages project name from GitHub check-run URLs is `flight-school-decision-tool-clean`.
- Local `npm run build` passed.
- Local `npm run build` also passed with `.env.local` temporarily hidden, so missing Kit environment variables are not currently reproducible as the local build failure.
- The live site was directly fetched with `curl`; it matched an older production artifact.

## What Was Tried

### 1. Verified live production output

Confirmed production sitemap did not include the new `/tools` entries, while local `public/sitemap.xml` and `dist/client/sitemap.xml` did include them.

### 2. Verified GitHub and Cloudflare status

Used GitHub API/check-runs to confirm Cloudflare Pages is failing builds for the new commits.

The GitHub check-run summary for the newest checked commit showed:

- App: `cloudflare-workers-and-pages`
- Name: `Cloudflare Pages`
- Conclusion: `failure`
- Status text: `Build failed`

GitHub does not expose full Cloudflare build logs. The Cloudflare dashboard log link is required for the exact error.

### 3. Tested local builds with and without local secrets

Local build passed normally.

Local build also passed after temporarily moving `.env.local` out of the way and restoring it immediately after the build. This suggests the Cloudflare failure is not simply because the Kit secrets are absent during build.

### 4. Reduced unnecessary Cloudflare adapter bindings

The Cloudflare adapter was auto-enabling:

- `SESSION` KV binding
- `IMAGES` binding

The app does not currently use Astro sessions or `astro:assets` image optimization, so `astro.config.mjs` was changed to:

- use `imageService: 'passthrough'`
- use `sessionDrivers.lruCache()`

This removed `SESSION` and `IMAGES` from the generated Cloudflare worker config, but Cloudflare Pages still failed on commit `07db8b2`.

## Is Removing `/references/` or `/email/` the Cause?

Probably not directly.

Reasoning:

- The deleted `/references/gemini-prototype` files were prototype/reference artifacts, not imported by the Astro app.
- The deleted `/email` files were local Kit helper scripts and docs, not part of the app runtime.
- Local `npm run build` passes after those deletions.
- Cloudflare had already started failing at `d55a881`, before the later cleanup commit that removed most of those files.

The only way those removals would be the cause is if Cloudflare Pages has a custom dashboard build command that references `/email` scripts or `/references` files. The repo `package.json` build command does not.

## Current Most Likely Cause

The root cause from the Cloudflare log is the generated assets binding name.

Cloudflare log error:

```text
Processing ../../../buildhome/repo/dist/server/wrangler.json configuration:
- The name 'ASSETS' is reserved in Pages projects. Please use a different name for your Assets binding.
```

What happened:

- `d55a881` switched the site from static Astro output to Cloudflare server output.
- `@astrojs/cloudflare` generated `dist/server/wrangler.json`.
- Without a project-provided assets binding name, the adapter defaulted to `ASSETS`.
- Cloudflare Pages now rejects `ASSETS` as a reserved binding name for Pages projects.

This explains why local and Cloudflare builds can pass but the deployment still fails after `Finished`.

## Fix Attempt

`wrangler.toml` was updated to declare a non-reserved assets binding:

```toml
[assets]
binding = "STATIC_ASSETS"
```

Local verification after this change:

- `npm run build` passes.
- Generated `dist/server/wrangler.json` now contains:

```json
"assets": {
  "binding": "STATIC_ASSETS",
  "directory": "../client"
}
```

This directly addresses the Cloudflare error about the reserved `ASSETS` name.

## Next Steps

1. Commit and push the `wrangler.toml` fix.

2. Watch the Cloudflare Pages check-run for the new commit.

3. If Cloudflare passes deployment, verify production:
   - `https://www.flightschoolfriend.com/`
   - `https://www.flightschoolfriend.com/tools/`
   - `https://www.flightschoolfriend.com/tools/flight-school-cost-calculator/`
   - `https://www.flightschoolfriend.com/sitemap.xml`

4. If Cloudflare still fails, open the new failed deployment log and check whether it moved past the `ASSETS` binding error to a different error.

5. Also verify Cloudflare Pages build settings:
   - Project: `flight-school-decision-tool-clean`
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node version: use a current Node version compatible with Astro and Vite, preferably Node 20 or 22.

6. If Cloudflare is failing because of server output after the binding fix, choose one of these paths:
   - Keep server output and fix the Cloudflare Pages/Workers deployment settings.
   - Revert to static output and remove/move server-side Kit API routes to a separate worker or external endpoint.

7. If Cloudflare is failing because of dependency or TypeScript checks:
   - Reproduce the exact Cloudflare command locally.
   - Patch the reported file/config.
   - Push a small fix commit and re-check the Cloudflare Pages check-run.
