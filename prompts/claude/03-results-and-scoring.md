# Claude Prompt: Results and Scoring

Improve result rendering and scoring only.

Use `/project-knowledge/style-guide_website_flight-school-friend_current.md` as the guiding style document for all flightschoolfriend.com UI decisions, including tokens, type, spacing, components, iconography, motion, and accessibility.

Precedence note: `/project-knowledge/style-guide_website_flight-school-friend_current.md` governs site UI. `/project-knowledge/design-brief.md` and related design brief/reference files remain in place for other uses, but they do not override the current website style guide.

Requirements:

1. Maintain four result paths:
   - Weekend Hobbyist
   - Career Pilot
   - Personal Aircraft / Business Travel
   - Explorer / Not Sure Yet
2. Keep result data in `src/data/results.ts`
3. Keep scoring logic readable and editable
4. Preserve the Gemini result dashboard feel
5. Do not add server-side logic yet

After coding, explain how I can edit the scoring rules myself.
