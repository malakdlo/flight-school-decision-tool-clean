# Email Capture History and Options

## Context

Flight School Friend originally deployed as a static Astro site on Cloudflare Pages. That deployment model is simple:

```text
Astro builds HTML/CSS/JS -> Cloudflare Pages serves static files
```

The Kit email capture integration introduced custom server API routes:

- `/api/lead-capture`
- `/api/kit/cost-calculator-subscribe`

Those routes used the Kit API from the server so the site could submit custom lead data while keeping the Kit API key out of the browser.

That changed the deployment model:

```text
Astro builds a Cloudflare server app -> Cloudflare Pages deploys a Worker/runtime config
```

This added deployment complexity around `@astrojs/cloudflare`, generated `dist/server/wrangler.json`, asset bindings, and Pages compatibility rules.

## What Went Wrong

The live site stopped updating after the server/API integration because Cloudflare Pages builds started failing after the last successful static deploy.

Important finding from Cloudflare logs:

- `npm run build` completed successfully.
- The failure happened after build, when Cloudflare Pages tried to validate Wrangler/Worker configuration.
- One failure was caused by the generated assets binding name `ASSETS`, which Cloudflare Pages treats as reserved.
- Attempting to set `[assets]` in the root `wrangler.toml` failed earlier because Pages project config does not support that field.

The problem was not caused by removing `/email/` or `/references/` from Git pushes. Those folders contained docs, scripts, and prototypes. The trigger was moving from static output to server output for custom Kit API routes.

## Option 1: Kit Embed or Full JS Script

How it works:

```text
Visitor submits Kit embed -> Kit handles signup
```

Pros:

- Simplest implementation.
- Keeps the site static.
- No Kit API key in the app.
- No custom server route.
- Avoids Cloudflare Worker/Pages runtime configuration.

Cons:

- Less control over styling and behavior.
- May be harder to send calculator estimates, quiz segment, source page, and UTM data.
- More dependent on Kit's embedded script behavior.

Best fit:

- Fastest path to reliable email capture.
- Good when styling and custom fields are less important than stability.

## Option 2: Plain Kit HTML Form

How it works:

```text
Visitor submits custom-styled HTML form -> browser posts directly to Kit form endpoint
```

Current endpoint pattern:

```text
https://app.kit.com/forms/{KIT_FORM_ID}/subscriptions
```

Current public Kit form id:

```text
9565964
```

The site keeps custom-styled forms, but posts directly to Kit with normal form fields:

- `email_address`
- `first_name`
- `fields[quiz_segment]`
- `fields[source_page]`
- `fields[lead_magnet]`
- `fields[training_goal]`
- `fields[low_estimate]`
- `fields[base_estimate]`
- `fields[high_estimate]`
- `fields[utm_source]`
- `fields[utm_medium]`
- `fields[utm_campaign]`
- `fields[utm_content]`
- `fields[utm_term]`

Pros:

- Keeps the site static.
- Avoids Cloudflare server/API deployment issues.
- Preserves the custom visual design of the forms.
- Can still send basic custom fields to Kit.
- Does not require Kit API secrets in Cloudflare.

Cons:

- We cannot reliably read Kit's response because the form posts cross-origin.
- Success messaging is optimistic after submit.
- Custom field delivery depends on Kit accepting the `fields[field_key]` names.
- Advanced tagging and fallback logic from the API route are not available unless configured inside Kit.

Best fit:

- Current recommended path.
- Good balance of stable deployment, custom design, and basic lead metadata.

## Option 3: Custom Server API Routes

How it works:

```text
Visitor submits form -> Flight School Friend API route -> Kit API
```

Pros:

- Most control.
- Can send rich calculator data and quiz segmentation.
- Can apply Kit tags programmatically.
- Can handle API errors and retries more explicitly.
- Keeps Kit API keys hidden from the browser.

Cons:

- Requires server output.
- Requires Cloudflare Pages/Workers runtime configuration to be correct.
- Introduces more deployment failure points.
- Requires Cloudflare environment variables/secrets.
- Harder to debug without direct Cloudflare dashboard or API access.

Best fit:

- Later-stage funnel infrastructure.
- Worth revisiting after the static site and calculator are stable in production.

## Current Decision

Use Option 2: plain Kit HTML forms.

Implementation direction:

- Return Astro to `output: 'static'`.
- Remove custom Kit server API routes.
- Remove Cloudflare server adapter requirements.
- Keep custom-styled forms.
- Post forms directly to Kit's public form subscription endpoint.
- Use hidden iframe targets so visitors stay on the page after submitting.
- Use hidden fields for quiz segment, source page, UTM values, and calculator estimates.

## Current Implementation Notes

Result-page email forms:

- Component: `src/components/EmailCaptureForm.astro`
- Posts to Kit form `9565964`
- Sends:
  - first name
  - email
  - quiz segment
  - source page
  - UTM source, medium, campaign

Cost calculator email form:

- Component: `src/components/tools/FlightSchoolCostCalculator.astro`
- Posts to Kit form `9565964`
- Sends:
  - email
  - source page
  - lead magnet name
  - training goal
  - estimate range
  - UTM source, medium, campaign, content, term

Server-side Kit files removed from the production path:

- `src/pages/api/lead-capture.ts`
- `src/pages/api/kit/cost-calculator-subscribe.ts`
- `src/lib/kit.ts`

## Follow-Up Checks

After deploy:

1. Confirm Cloudflare Pages deploys successfully as a static site.
2. Verify the live pages update:
   - `/`
   - `/tools/`
   - `/tools/flight-school-cost-calculator/`
   - `/sitemap.xml`
3. Submit a test email from a quiz result page.
4. Submit a test email from the cost calculator.
5. Verify the subscriber appears in Kit.
6. Verify custom fields appear in Kit as expected.
7. If custom fields do not appear, confirm the exact custom field keys in Kit and update the form input names.

## Future Upgrade Path

If richer email automation becomes necessary, revisit Option 3 after launch. The safer upgrade path would be:

1. Keep the static site stable.
2. Create a separate Cloudflare Worker or serverless endpoint for Kit API calls.
3. Test that endpoint independently.
4. Switch only the forms to the API endpoint after the Worker is known-good.

