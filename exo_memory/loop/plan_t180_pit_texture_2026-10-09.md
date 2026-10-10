# T-180: the pit lane wears the same road texture as the track. Librarian, on D, 2026-10-09 13:4x. Lap D279.

The keeper, 13:47: "ALSO MAKE the pits the same texture as the track".

## Read at t180 `d1bf901`
- `src/export/fromwords.js:243`: `withTextureSet(pit ? PitLane.withLane(scene0, pit.mesh) : scene0, mesh, segs, o.textures)`. The texture set is applied
  per ROAD SEGMENT (`bySegment`), and the pit lane is appended as its own meshes.
- `src/export/pitlane.js:32-37` `withLane` carries the lane mesh's OWN materials into the scene. So inferred, to be checked: the pit lane keeps its
  plain/solid material while the road wears the textured one (asphalt by default, D228).
- `src/export/acready.js:176`: the pit lane (`1ROAD_PIT_…`) is deliberately kept out of the road merge. That stays; only its material changes.

## The lap (E, export; GEOMETRY/EXPORT tier, so the export tests and an AC look check)
1. Confirm in an exported kn5 (`tools/kn5.cjs`) which material the pit lane meshes use vs the road.
2. The pit lane uses the SAME road material/texture as the track: the active texture set's road floor (asphalt, solid colour, or the user's own
   picture), including its UV scaling along the lane, so it reads continuous at the pit entry/exit. Pit box paint (the painted boxes) stays as it is.
   Surface key unchanged (`1ROAD_PIT_…`, the physics surface ROAD/PIT as now).
3. The preview shows the pit lane in the same texture if it draws the lane.
- Rows red first: the exported pit lane meshes reference the same diffuse texture as the road under each texture setting; a solid-colour track
  gives a solid pit lane; paint unchanged; the kn5 still passes the AC-ready checks. Then install with the next build.

NEXT: chair dispatch D279 to E when this plan is read

## Amendment (librarian, 15:0x): the keeper meant the PAINTED PIT BOXES
E's hand-back (`handback/p-pittexture-E_2026-10-09.md`): equation-core tracks have NO pit lane (coreshell.js buildExport passes none); their pits sit on
the main road, marked only by pit-box PAINT, thin near-white outlines (`src/markers/paint.js` MATERIAL `t180b_paint`). E's 9d7e94c (the word-document pit
lane wears the road texture) is correct but changes no core track. Land it anyway, it is right for word tracks.
Asked, the keeper answered: **"The painted pit boxes."** So, **E, follow-up:** the pit-box markings use the track's road surface (the active texture
set's floor, so they blend into the road) instead of the near-white paint. The start line and grid paint stay as they are. The `AC_PIT_n` spawn markers
and the physics are unchanged. Rows red first: a core export's pit-box meshes reference the road material under each texture setting; the start-line and
grid paint are unchanged; the AC-ready checks pass.

## CORRECTION + the keeper's new ask (librarian, 16:3x)
**WRONG, E's "core tracks have no pit lane", relayed by the librarian unchecked (my error too):** the keeper's latest export
`G:\…\content\tracks\t180b_track_2_test\t180b_track_2_test.kn5`, read with `tools/kn5.cjs`, HAS a pit lane: `1ROAD_PIT_in_0` (252 verts),
`1ROAD_PIT_body_0..4`, `1ROAD_PIT_out_0` (252), all in the PLAIN material `t180b_road`, while the road wears `t180b_floor_made-…`. The 12 `AC_PIT_n` sit
at x = 31.2 along it; the grid is on the road at x = ±5.7. E's search (`git grep` over `app/`) missed the path that builds it; an export was not
read. Lesson (librarian): check a claim about what the export contains against an export, before relaying it.
**The keeper, 16:27:** "the pit lane arc that is made, i wonder if the inside could just be filled in so there is no gap between the track and pit".
**E:**
(1) Find where a core export gets its pit lane, and confirm 9d7e94c (or a fix) makes it wear the road texture on a CORE export: re-export a copy of
    TRACK 2 and read the kn5.
(2) FILL: one infill surface from the main road's edge to the pit lane's edge along the body, and filling inside the entry and exit arcs, so there is
    no gap. Same road texture, drivable surface key, joined without a seam or a ray gap (the downforce-ray-gap check must stay clean), and the
    self-check must stay clean.
(3) The pit-box paint follow-up stays as asked.
Rows red first, on a core export. An AC look at the next build is the keeper's.

## FOUND (librarian, 16:4x): the pit lane is the Third Place's, unmerged. Nothing is lost
The keeper: the spawns/pit-lane builds were the Third Place's ("my bad i forgot about their work"). Its checkout is
`C:\Users\nname\Downloads\t180-track-builder`, branch `feature/start-grid` on d1bf901: `f567064` (10-09 11:29, start & grid placed by hand) and
`3656351` (10-09 12:11, pit lane on equation tracks with practice spawns, "Flatten road for pit"); 1 uncommitted path. That is the code the 11:30
install ran. The librarian's 14:02 install (2391ec7, main-based) replaced it and made NO backup of it, so the keeper's current exe lacks the pit lane
and spawns. His tracks are backed up (`tracks-backup-before-pitlane-recovery-*`), and TRACK 2 still carries its `spawns` and `pitLane` data.
**Integration (chair, E):** fetch `feature/start-grid` from the Downloads checkout into the t180 repo. Merge it onto main (5686ccb jump fix, 0dc10dc,
e003c59 pit boxes), resolving against E's D279 work. Then E's infill on top. Then 0.3.4 = start/grid + pit lane + spawns + jump fix + pit texture +
pit boxes + infill, installed as soon as it is green, because the keeper is currently missing his pit lane.
**Lesson (librarian):** before installing over the keeper's exe, check what the installed build was made from; a backup of the CURRENT exe must exist.
