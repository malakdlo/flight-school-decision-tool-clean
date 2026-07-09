# Claude Prompt: Quiz Flow

Improve the quiz experience only.

Use `/project-knowledge/style-guide_website_flight-school-friend_current.md` as the guiding style document for all flightschoolfriend.com UI decisions, including tokens, type, spacing, components, iconography, motion, and accessibility.

Preserve the Gemini quiz flow:

- Intro card
- 6-question assessment
- Answer card selection
- Progress bar
- Loading screen
- Results transition

Precedence note: `/project-knowledge/style-guide_website_flight-school-friend_current.md` governs site UI. `/project-knowledge/design-brief.md` and related design brief/reference files remain in place for other uses, but they do not override the current website style guide.

Keep quiz questions in `src/data/quizQuestions.ts`.
Keep scoring in `src/lib/scoring.ts`.
Do not change the landing page unless required for navigation.
