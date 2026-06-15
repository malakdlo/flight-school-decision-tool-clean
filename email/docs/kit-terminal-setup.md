# Kit Terminal Setup

## Recommended Kit organization for V1

- Use tags for lead state and automation triggers.
- Use custom fields for metadata.
- Use segments later as saved filters in the Kit UI.
- Do not use Kit Products yet because Lemon Squeezy will handle checkout later.

## Local verification commands

Run these from the email workspace:

```bash
cd /Users/malaklopez/Projects/flight-school-decision-tool-clean/email
./scripts/map-kit-env.sh
./scripts/verify-kit-env.sh
./scripts/confirm-kit-fields.sh
./scripts/list-kit-forms.sh
./scripts/test-kit-lead.sh your-email@example.com career_captain
```

`map-kit-env.sh` prints clean env lines for tags, custom fields, and the form named `FSF Quiz Result Email Capture` if it exists.

`verify-kit-env.sh` checks that values in `email/.env.local` are present and valid in Kit without printing the API key.

`confirm-kit-fields.sh` verifies these custom fields only:

- `quiz_segment`
- `source_page`
- `utm_source`
- `utm_medium`
- `utm_campaign`

`test-kit-lead.sh` creates or updates a test subscriber, adds the subscriber to `KIT_FORM_ID` if set, and applies the quiz lead/source/segment tags.

## Supported terminal test segments

- `career_captain`
- `weekend_hobbyist`
- `personal_owner`
- `research_first`

## Site env sync

For local Astro dev, copy the Kit values from `email/.env.local` into the root `.env.local`.

Do not commit either env file.
