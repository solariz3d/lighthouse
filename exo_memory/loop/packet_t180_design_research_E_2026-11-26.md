# Packet L246 (pane E; on L): research, a design doc or repo to learn clean UI from

His words, 02:33, are in `briefs/t180_ui_declutter.md`. In short: the rounded windows look cheap to him; he wants to
learn how to do clean UI that suits our look, from a real design doc or repo. Research only, no code.

Read first, so this does not repeat it: `research/ai_slop_ui_survey_2026-10-29.md` (what reads as slop and as crafted),
`research/ui_unslop_guide_2026-10-27.md`, `handback/p-d546-slop-audit-C_2026-10-29.md`.

## Find and read (open each source; never cite unread)

1. **Design systems and guides that are public and written down**, each with a URL and what it teaches about clean,
   engineered UI: shape and corner radius, spacing scale, type, colour roles, density, and how a window or panel sits
   over content. Candidates to check, not conclusions: Refactoring UI; Apple HIG (materials, shapes); Vercel Geist;
   Radix (Themes, Colors); IBM Carbon (it is square-cornered on purpose, and says why); Linear's writing on design;
   Rauno Freiberg's "Invisible details of interaction design"; Material 3 shape scale. Add better ones you find.
2. **Corner radius specifically:** when a radius reads as engineered and when it reads as cheap or toy-like. Cover
   concentric (nested) radii, small radii (0-4 px) against large ones and pills, and radius relative to element height.
   Cite each claim.
3. **Tools for a technical, instrument-like look**, which a track builder is: sim-racing and motorsport UI (telemetry
   tools such as MoTeC i2; in-game HUDs from current sims), CAD and 3D editors (Blender, Figma's canvas UI), and pro
   audio. What do they do with panels, readouts and labels over a 3D view?
4. **One or two repos worth learning from**: open-source UIs whose code shows these choices, with the file that holds
   the tokens.

## Deliverable

`research/clean_ui_design_sources_2026-11-26.md`: every claim with its source and URL, and agreement or disagreement
between sources said plainly. Then a short section, "Against our six looks", that reads our themes
(`app/themes/*.css` and SIGIL in `app/index.html`, builder 0ab6cc8) against what you found. Name the specific lines
that a source would call cheap: radii first, then glows, then glass. That section proposes; it changes nothing.
Outside searches carry no names of people or of the project.

Hand-back to the librarian, with claims marked checked (opened) or inferred.
