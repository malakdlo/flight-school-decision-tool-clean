# Kit Env Values

Do not commit `.env.local`. Keep `KIT_API_KEY` server-side only.

## Core

- `KIT_API_KEY`: Kit API v4 key used by terminal scripts and the server-side Astro API route.
- `KIT_FORM_ID`: Optional Kit form id for `FSF Quiz Result Email Capture`. The site does not use a Kit embedded form.

## Tags

- `KIT_TAG_LEAD_QUIZ_COMPLETED`: Marks a quiz result email capture lead.
- `KIT_TAG_LEAD_PDF_REQUESTED`: Reserved for a future PDF request flow.
- `KIT_TAG_SEGMENT_CAREER_CAPTAIN`: Applies when `quizSegment` is `career_captain`.
- `KIT_TAG_SEGMENT_WEEKEND_HOBBYIST`: Applies when `quizSegment` is `weekend_hobbyist`.
- `KIT_TAG_SEGMENT_PERSONAL_OWNER`: Applies when `quizSegment` is `personal_owner`.
- `KIT_TAG_SEGMENT_RESEARCH_FIRST`: Applies when `quizSegment` is `research_first`.
- `KIT_TAG_SOURCE_FSF_SITE`: Marks the lead source as Flight School Friend site.
- `KIT_TAG_SOURCE_QUIZ_RESULT_PAGE`: Marks the lead source as a quiz result page.

Tags are the source of truth for automations and lead/customer state.

## Custom Fields

- `KIT_FIELD_QUIZ_SEGMENT=quiz_segment`: Stores the result segment sent by the result page component.
- `KIT_FIELD_SOURCE_PAGE=source_page`: Stores `window.location.pathname`.
- `KIT_FIELD_UTM_SOURCE=utm_source`: Stores `URLSearchParams.get("utm_source")`.
- `KIT_FIELD_UTM_MEDIUM=utm_medium`: Stores `URLSearchParams.get("utm_medium")`.
- `KIT_FIELD_UTM_CAMPAIGN=utm_campaign`: Stores `URLSearchParams.get("utm_campaign")`.

Custom fields store subscriber metadata. Segments can be created later in the Kit UI as saved filters based on these tags and fields.

## Dynamic values set by the site

- `firstName`: Optional visible form field.
- `email`: Required visible form field.
- `quizSegment`: Hidden component prop from the result page.
- `sourcePage`: Browser pathname at submit time.
- `utmSource`: `utm_source` query parameter.
- `utmMedium`: `utm_medium` query parameter.
- `utmCampaign`: `utm_campaign` query parameter.

## V1 constraints

- Do not use Kit embedded forms.
- Do not create or depend on Kit Segments.
- Do not create Kit Products.
- Lemon Squeezy checkout will be integrated later.
