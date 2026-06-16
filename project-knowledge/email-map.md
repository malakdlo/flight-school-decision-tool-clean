# Email Map

This map describes every email-related form currently in the Flight School Friend site, what it is intended to do, where it submits, what fields it sends, and what to check if it fails.

## Current Email Strategy

The site now uses plain Kit HTML forms instead of custom server API routes.

Current Kit form endpoint:

```text
https://app.kit.com/forms/9565964/subscriptions
```

Current deployment model:

```text
Astro static site -> browser posts form directly to Kit
```

Important limitation:

Because the form posts cross-origin to Kit inside a hidden iframe, the page cannot reliably read Kit's response. Success messages are optimistic. The real confirmation is whether the subscriber and fields appear in Kit.

## Active Funnel: Cost Calculator Estimate

Pages:

- `/tools/flight-school-cost-calculator/`

Source:

- `src/components/tools/FlightSchoolCostCalculator.astro`

Form selector:

```text
.fsf-email-row
```

Submit target:

```text
https://app.kit.com/forms/9565964/subscriptions
```

Submit method:

```text
POST
```

Iframe target:

```text
kit-cost-calculator-submit
```

Visible fields:

- `email_address`

Hidden fields:

- `fields[source_page]`
- `fields[lead_magnet]`
- `fields[training_goal]`
- `fields[training_structure]`
- `fields[low_estimate]`
- `fields[base_estimate]`
- `fields[high_estimate]`
- `fields[utm_source]`
- `fields[utm_medium]`
- `fields[utm_campaign]`
- `fields[utm_content]`
- `fields[utm_term]`

Dynamic field population:

- `training_goal` is set from the selected calculator goal.
- `low_estimate`, `base_estimate`, and `high_estimate` are set from the current calculator totals at submit time.
- UTM fields are set from stored/current UTM params.

Analytics events:

- `cost_calculator_view`
- `cost_calculator_started`
- `cost_calculator_input_changed`
- `cost_calculator_goal_selected`
- `cost_calculator_estimate_updated`
- `cost_calculator_email_submit`
- `cost_calculator_email_success`

Known status:

- Local submit was reported working for the cost calculator.

Potential issues:

- Kit may not accept one or more custom field keys.
- Kit may accept the email but ignore fields that are not defined in Kit.
- Success message is optimistic and does not prove Kit accepted the form.

Fixes:

- If email appears but fields are missing, confirm exact Kit custom field keys and update `fields[...]` names.
- If no subscriber appears, verify form id `9565964` is the correct live Kit form and accepts public subscriptions.
- If UTM fields are blank, test with query params such as `?utm_source=test&utm_medium=local&utm_campaign=form_test`.

## Active Funnel: Quiz Result Plan Delivery

Pages:

- `/flight-school-decision-tool/results/weekend-hobbyist/`
- `/flight-school-decision-tool/results/career-captain/`
- `/flight-school-decision-tool/results/personal-owner/`
- `/flight-school-decision-tool/results/research-first/`

Source:

- `src/components/EmailCaptureForm.astro`

Page usage:

- `src/pages/flight-school-decision-tool/results/weekend-hobbyist/index.astro`
- `src/pages/flight-school-decision-tool/results/career-captain/index.astro`
- `src/pages/flight-school-decision-tool/results/personal-owner/index.astro`
- `src/pages/flight-school-decision-tool/results/research-first/index.astro`

Form selector:

```text
.fsf-email-capture
```

Submit target:

```text
https://app.kit.com/forms/9565964/subscriptions
```

Submit method:

```text
POST
```

Iframe target pattern:

```text
kit-result-submit-{quiz_segment}
```

Visible fields:

- `fields[first_name]`
- `email_address`

Hidden fields:

- `fields[quiz_segment]`
- `fields[source_page]`
- `fields[utm_source]`
- `fields[utm_medium]`
- `fields[utm_campaign]`

Quiz segment values:

- `weekend_hobbyist`
- `career_captain`
- `personal_owner`
- `research_first`

Dynamic field population:

- `source_page` is set to `window.location.pathname` at submit time.
- UTM fields are set from current URL query params.
- `quiz_segment` is rendered server-side based on the page's result type.

Analytics events:

- `fsf_email_capture_submit`
- `fsf_email_capture_success`

Known status:

- Local submit status for `/flight-school-decision-tool/results/weekend-hobbyist/` was uncertain.
- The result-page form uses the same Kit endpoint and `email_address` field as the working calculator form.
- The first-name field was changed to `fields[first_name]` to match the custom-field pattern used elsewhere.

Potential issues:

- Kit may expect first name as `first_name` instead of `fields[first_name]`.
- Kit may ignore `fields[first_name]` if no matching custom field exists.
- Kit may accept the email while ignoring custom fields.
- Success message is optimistic because the iframe response cannot be inspected.

Fixes:

- If the subscriber appears without first name, either:
  - create/confirm a Kit custom field key named `first_name`, or
  - change the input name back to `first_name`.
- If no subscriber appears, compare the network request from this page to the cost calculator request. They should both post to form `9565964` with `email_address`.
- If only some quiz segments fail, inspect the rendered `fields[quiz_segment]` value for unsupported characters or a Kit automation rule mismatch.

## Inactive/Demo Funnel: Guide Checklist Forms

Pages:

- `/guides/flight-school-cost/`
- `/guides/part-61-vs-part-141/`
- `/guides/how-to-choose-a-flight-school/`
- `/guides/private-pilot-requirements/`

Source:

- `src/pages/guides/flight-school-cost.astro`
- `src/pages/guides/part-61-vs-part-141.astro`
- `src/pages/guides/how-to-choose-a-flight-school.astro`
- `src/pages/guides/private-pilot-requirements.astro`

Form id:

```text
mid-email-form
```

Current behavior:

- These forms do not submit to Kit.
- They prevent default submission in local JavaScript.
- They hide the form and show the message:

```text
Got it - this checklist would be sent in the live version.
```

Current status:

- Demo/inactive.
- Not connected to Kit.

Potential issues:

- Visitors may think they submitted a real email, but no lead is created in Kit.
- The same `id="mid-email-form"` appears on multiple pages, which is okay because each page has one copy, but this should become a reusable component if activated.

Fixes:

- Convert these to the same plain Kit HTML form pattern.
- Add hidden fields:
  - `fields[source_page]`
  - `fields[lead_magnet]`
  - `fields[utm_source]`
  - `fields[utm_medium]`
  - `fields[utm_campaign]`
- Use a guide-specific `lead_magnet` value, for example:
  - `flight_school_cost_checklist`
  - `part_61_vs_part_141_checklist`
  - `choose_a_flight_school_checklist`
  - `private_pilot_requirements_checklist`
- Update the visible success message to avoid saying `would be sent`.

## Removed Server/API Path

Removed files:

- `src/pages/api/lead-capture.ts`
- `src/pages/api/kit/cost-calculator-subscribe.ts`
- `src/lib/kit.ts`

Removed deployment requirements:

- `@astrojs/cloudflare`
- `@cloudflare/workers-types`
- `wrangler`
- Cloudflare server output
- Kit API key in Cloudflare

Reason removed:

- The custom API path forced Astro server output and triggered Cloudflare Pages deployment issues.
- Plain Kit HTML forms keep deployment static and simpler.

## Kit Field Reference

Fields currently used by active forms:

- `email_address`
- `fields[first_name]`
- `fields[quiz_segment]`
- `fields[source_page]`
- `fields[lead_magnet]`
- `fields[training_goal]`
- `fields[training_structure]`
- `fields[low_estimate]`
- `fields[base_estimate]`
- `fields[high_estimate]`
- `fields[utm_source]`
- `fields[utm_medium]`
- `fields[utm_campaign]`
- `fields[utm_content]`
- `fields[utm_term]`

Fields to verify inside Kit:

- `first_name`
- `quiz_segment`
- `source_page`
- `lead_magnet`
- `training_goal`
- `training_structure`
- `low_estimate`
- `base_estimate`
- `high_estimate`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

## Test Checklist

Cost calculator:

1. Open `/tools/flight-school-cost-calculator/?utm_source=test&utm_medium=local&utm_campaign=email_map`.
2. Change the selected training goal.
3. Change at least one cost input.
4. Submit a unique test email.
5. Confirm the subscriber appears in Kit.
6. Confirm estimate fields and UTM fields appear.

Weekend Hobbyist result page:

1. Open `/flight-school-decision-tool/results/weekend-hobbyist/?utm_source=test&utm_medium=local&utm_campaign=email_map`.
2. Submit a unique test email.
3. Confirm the subscriber appears in Kit.
4. Confirm `quiz_segment=weekend_hobbyist`.
5. Confirm `source_page=/flight-school-decision-tool/results/weekend-hobbyist/`.

Other result pages:

1. Repeat the same test for each result page.
2. Confirm each result creates or updates the subscriber with the expected `quiz_segment`.

Guide pages:

1. Confirm current guide forms are intentionally demo-only.
2. Do not count these as active lead capture until converted.

## Troubleshooting Matrix

Symptom: Form shows success but no subscriber appears in Kit.

- Likely cause: wrong form id, Kit rejected request, or endpoint/form is not public.
- Fix: verify form `9565964` in Kit, compare browser Network request with the working calculator request.

Symptom: Subscriber appears but fields are blank.

- Likely cause: Kit custom field keys do not match `fields[...]` names.
- Fix: confirm custom field keys in Kit and update input names.

Symptom: First name does not appear.

- Likely cause: Kit expects `first_name` as a top-level field rather than `fields[first_name]`.
- Fix: change result-page first name input to `name="first_name"` or create a Kit custom field named `first_name`.

Symptom: UTM values are blank.

- Likely cause: no UTM params were present in URL, or result-page forms only read current URL query params.
- Fix: test with explicit UTM query params. If persistent UTMs are needed on result pages, use the shared UTM storage helper currently used by the calculator.

Symptom: Cloudflare deploy fails again.

- Likely cause: not related to email form submission if the site remains static.
- Fix: check that `astro.config.mjs` still uses `output: 'static'`, and confirm no Cloudflare server adapter dependencies were reintroduced.

