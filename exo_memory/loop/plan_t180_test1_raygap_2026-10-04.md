# T-180: the keeper's TEST 1 won't export: downforce-ray-gap reds in the rolled section. Diagnose first. Librarian, on D, 2026-10-04 23:4x. Lap D241.

The keeper, 23:39: "I went in with a track, but there is a not exported red validation wtf it wouldnt export".

## Checked
- The newest save is `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 1.t180track` (23:39, 46 pieces, closed, about 11 km).
  Exported with the installed code (`lib-mirror-build`, fa5fd937) into a SCRATCH folder by the librarian's node script: **refused, RED:
  `downforce-ray-gap`** at s 4510, 5814–5818, 5856–5858, 5946–5948, 5984, 6022 (and more; the message is cut off), u from −14.4 to +4.8,
  worst 0.1–1 m. Source of the rule: `FINDINGS.md:110` (gaps in the road mesh are RED), `docs/research/04_ac_physics_drivability.md` §4 (the
  Mach 6's downforce is one ray to the road, 1 m ahead).
- **Where:** the rolled section. No tube anywhere (no `t` channel). Bank runs through −178° (pieces at 3250–4730), −360° (5150–5720) and
  about −306° (5900–6980), on a cup of 20° and a width of 31 m. Around 5900–6620 the turn is about 0.68°/m, a radius of about 84 m.
- Not known: whether these are REAL holes in the road mesh (which would also hurt in AC) or a validator artefact on an inverted or rolling
  cup road (e.g. the ray's direction or reach while the road is upside down).

## The lap (E, read-only diagnosis; NO fix in this lap; the keeper is blocked, so it's first in E's queue)
1. Export the same document into a scratch folder (never the AC folder) with the installed code, and list EVERY red (the full list, not
   the cut-off message).
2. At each red's (s, u): measure the actual road mesh. Is there a hole, a seam gap or a non-overlap between rows or cells under the ray's
   footprint, and how big is it? Or is the mesh continuous and the validator's ray mis-aimed (its direction against the road normal, its
   reach, or a sign under inversion)? A picture of the mesh at two of the spots.
3. Classify each red: REAL GAP (and what geometry makes it: a twist rate, a cup at high bank, a seam between pieces) or VALIDATOR
   ARTEFACT (which line, and why).
4. Output `loop/test1_raygap_diagnosis_2026-10-04.md`. The fix comes after, by the classification. If it's a validator artefact, that's
   a validator fix with a test. If it's real gaps, the mesh is fixed, or the keeper is told what to smooth.

NEXT: chair dispatch D241 diagnosis to E now (the keeper is blocked) when this plan is read
