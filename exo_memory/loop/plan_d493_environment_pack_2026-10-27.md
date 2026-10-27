# D493: what a T-180 environment and props pack would take. Librarian, 2026-10-27

The keeper's business model (memory, t180-business-model, 2026-10-06): the track builder is free; the paid tier is environment and props. Nothing has been researched for it yet. He has seats idle and wants them used (07:29).

## Two parts, in parallel, research only, no code

**Part 1, pane A: what Assetto Corsa needs from a track environment.** From AC's own documentation, the modding wikis and ksEditor/CSP references (each fact names its source):
- how a track ships scenery: kn5 objects, the role of object-name prefixes (e.g. walls, physics, grass), LODs, and what makes an object collidable or not;
- trackside props: barriers, kerbs, grandstands, trees (billboards vs meshes), lights for night (CSP), and their usual triangle and texture budgets;
- the sky and horizon: skyboxes vs CSP weather, what the builder already does for its six looks and what a pack would add;
- how a pack would be installed next to a generated track without touching the user's AC folder beyond the track;
- licensing: what we must author ourselves, and which free asset licences would allow a paid pack.

**Part 2, pane B (or the next free): what the builder would need.** Read the exporter (`src/export/`) and the markers/props code (`src/markers/`) as they stand, and say:
- where a prop catalogue would plug in (placement along the centreline by station and offset, snapping to the road edge, mirroring);
- what the preview would need to show props;
- what the export would need to write them (object naming, materials, shadow casters);
- the smallest first pack that is worth paying for, as a list of ten props and one environment, with a reason each;
- what is risky or expensive, named.

Hand-backs: each a sourced note. The librarian merges them into one plan for the keeper, with the first pack's contents and a build order. No build without his yes.

## WITHDRAWN, 07:33, at the keeper's word: "No lets keep doing what we have been doing, giving the panes more work we didnt plan out yet could be bad"

The panes stop. Whatever is written stays as an untracked note for whoever picks this up later. Nothing else is dispatched from this plan without his yes.
