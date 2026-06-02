# Gemini Prototype References

This folder stores visual prototype snapshots from Gemini.

Version history:
- flight_school_visual_prototype_v1_053026.html
  Original Flight School visual prototype.
- flight_school_visual_prototype_v2_060126.html
  Final V2 Flight School Friend prototype with homepage, quiz, results, guides, about, privacy, and template preview pages.

Implementation rule:
- latest.html is always the current source of truth for Claude Code.
- Dated prototype files are archived references.
- Claude Code should use latest.html for implementation unless explicitly told otherwise.
- Do not copy the single-file prototype router into production.
- Production must use real Astro file-based routes under src/pages/.
