# D432: roads closer than 2 m are red only when they actually clip (librarian, 2026-10-22)

## The report

The keeper, 2026-10-22 09:19: "also, the reds are bullshit, the tracks can be under 2m apart as long as the geometry isnt clipping into eachother".

## What makes them red today (checked by reading, at local-0.4.13 6261a22)

- `src/validate/limits.js:43-44` `stackedM: 2`, sourced from ARCHITECTURE.md:85, "drivable surfaces stacked within about 2 m" (RED).
- `src/validate/index.js:581` `stacked()` reds any two surface points of different passes closer than 2 m. Points within 25 m along s are the same pass and are not compared. The red is pushed at `:397` as `stacked-within-2m`.
- `src/geom/bvh.js` `selfCheck` reports `stacked` (a 2 m segment along each vertex normal) separately from `intersections` (triangles that actually meet).
- `app/core/overlapmerge.js:9` counts `stacked-within-2m` as an overlap, along with `self-intersection` and `downforce-ray-gap`.
- `src/geom/pitlane.js:138` `laneCheck` applies the same 2 m rule between the pit lane and the main road.

## The change the keeper asked for

- Two passes closer than 2 m that do not touch are **no longer red**, in the preview or at export.
- Geometry that clips is still red: `self-intersection` (triangles that meet), unchanged.
- `downforce-ray-gap` is a separate rule and is untouched.

## Part 1, pane E. Tier: prove it (the validator and the export gate)

1. From local-0.4.13 6261a22, in your own worktree, on branch `d432-e`.
2. **Test first:**
   - two passes 1.5 m apart (side by side, and one above the other) that do not touch: no red;
   - the same passes moved until their triangles meet: red, as self-intersection;
   - both rows go through the validator, the preview's overlap check (`overlapjob.js`) and the export's check.
   - The first row is red now.
3. **The change:** stacked-within-2m stops being red in all three places (validate, selfCheck's consumers, overlapmerge), and in `laneCheck` for the pit lane.
   - Keep the stacked measure itself if other code reads it, as information only, not a red.
   - Correct ARCHITECTURE.md:85 and the limits.js comment to say why, citing the keeper's words.
   - Any existing test that pins the 2 m red is now wrong by the keeper's ruling. Change it, and name each one in the hand-back.
4. Every mutation harness that covers validate, bvh or overlapmerge runs whole. The core and close harnesses run once.
5. CHANGELOG line under Changed.
6. **Name the one risk plainly in the hand-back, without changing the rule for it.** A road directly above another with less than a car's height between them does not clip as geometry, but a car on the lower road would hit the upper one. Measure whether any of the keeper's saved tracks has such a place (read copies only). The keeper decides whether that case needs its own rule.

**Part 2:** the librarian rules. It rides 0.4.14 if accepted before Part 3 of D429 starts.

NEXT: chair route D432 Part 1 to E now (E is free since D429 Part 2); E hands back to the librarian.
