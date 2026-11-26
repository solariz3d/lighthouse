# T-180: other tracks as a shadow layer, to study by eye and for scale

Other authors' track names stay out of this public repo (the rule of `briefs/t180_banked_s_and_wall_hairpin.md:7`).

## His words

- 2026-11-26 01:05 (L): "i had this idea for a while but have yet to mention it, i think it could be cool to allow for
  made tracks already to be sort of overlayed in its own cosmetic shadow layer, so you can compare tracks, not to
  straight up copy them, but to study the design by your eye, you know what I mean? It will also help build an idea
  of scale from tracks that already exist"

## What exists (checked by the librarian, 01:0x)

- The builder can already read an AC track's AI line: `readAiLine` at `src/export/ailine.js:208` (AcTools' layout).
  It was checked against 73 of 74 local `fast_lane.ai` files (`ailine.js:7-8`). Per point it gives a 3D position,
  plus `sideLeft`, `sideRight`, `camber` and `radius` (`ailine.js:46`). That covers the centre, the width, the climb
  and the bank: enough to draw another track's road at true scale.
- L has 34 tracks installed under `steamapps/common/assettocorsa/content/tracks`.
- Outside, checked 01:0x (web search): BTB has a background image tool for reference, and RTB had none (an old forum
  answer). GT6's course maker and BallisticNG's layout creator overlay a reference image that you scale by hand to
  match. Every one found is a flat 2D image, scaled by eye. An overlay of the real 3D road from its AI line, at true
  scale with no scaling step, was not found in any of them.

## State

- 01:0x: packet `loop/packet_t180_reference_overlay_B_2026-11-26.md` (L243), a first look with pictures. It queues
  behind L241/L242 unless he wants it run alongside them.

## His words, 02:23 (L)
- "Yes, and it can be accessed through the other saved tracks that already exist in the assetto track folder, it
  doesnt create it through our system, just renders the total shape of the track to see within the preview"
- L243 was sent to pane B at 02:2x with this added: the reference is picked from the installed tracks (and their
  layouts) in AC's tracks folder. It is read-only, and nothing of it enters the doc.
- 03:3x (L): L243 first look done (`handback/p-l243-reference-overlay-B_2026-11-26.md`), pictures sent. Open with him: AI-line ribbon vs the kn5 road (about one more lap).
- 04:49 (L): to ribbon now or the full road, "Yes finish the rest." Both go: L250,
  `loop/packet_t180_shadow_tracks_BO_2026-11-26.md` (B the ribbon and panel, O the kn5 reader in Rust).
- 05:2x (L): L250 built. B: `handback/p-l250-shadow-B_2026-11-26.md`, builder `l250-shadow-tracks` 59a54e3 (ribbon 18/18,
  panel 17/17, mutants 23/23; read-only proved for the doc, a save, an undo step and an export, in both modes). O:
  `handback/p-l250-kn5-O_2026-11-26.md`, the kn5 road reader (61 of 61 installed layouts read; its mesh rule replaced
  the first look's, which dropped road on 30 of 61). Eight pictures sent to him (`t180-wt-l243\out\l250-pictures`).
  Not run: the whole suite, a cargo build of the merged tree, the real app's IPC. E reads next.
- 05:4x (L): E's read of L250 is **NOT CLEAN** (`handback/p-l250-read-E_2026-11-26.md`). One behaviour defect: a Line/Road
  switch while a pick is still reading drops his newest pick or draws it in the mode he left (`app/reference/panel.js:152-158`,
  rows V3e and V3f; reachable during a Road read of 0.1 to 1 s). One look defect: the panel is a dark slab in Skyline
  (inline colours at `panel.js:37`). Holds: read-only through a real save, the merged tree builds (24 cargo rows), 61 of
  61 layouts read, O's mesh rule on L. A gap E measured: 15 of 61 layouts have no AI line and cannot be shown in either
  mode, the largest one included. Not L250's: the START / grid / PIT labels stack in the overhead with no reference at
  all (`app/core/spawnslayer.js`), now on the backlog. Repair round sent: B the race and the panel's class, O the start
  from the kn5 for layouts with no AI line.
- 06:0x (L): the repair is in: builder `l250-shadow-tracks` b26db76 (local), `handback/p-l250-shadow-B_2026-11-26.md`
  "Repair", with O's adf307c merged. The mode-switch race is fixed (rows P6 and P7 red first; E's own file 9 of 9 after
  the fix). The panel takes the page's tokens (white in Skyline; the librarian opened `look_skyline.png`). All 15 layouts
  with no AI line can now be shown as Road, placed by the kn5's start and set down on the road under it. Rows: ribbon 19
  of 19, panel 23 of 23. Not run: cargo on the merged tree by B, the real app's IPC, a picture of a Road placed by its
  start. Open, B's finding: with an AI line, Road sits 0.28 to 0.40 m below his road at the start (the AI line rides that
  far above its own road). E re-reads the repair next.
- 06:2x (L): the re-read by E of the repair is **NOT CLEAN** on one new defect (`handback/p-l250-read-E_2026-11-26.md`, "Re-read"):
  a layout with no AI line shown as Road, then the mode set to Line, shows a refusal and drops his pick; back in Road nothing is
  drawn (rows V3i and V3j, `reread/e_vary2.test.js`). Everything the repair fixed holds when varied: the race by five paths,
  cargo on the merged tree 28 rows, 61 of 61 layouts, the 15 start-placed layouts each 0.000 m off his start height and facing
  along their road. The largest layout (3,200,034 triangles) shows in 378 ms through the real panel. The librarian opened
  `reread/overhead_N53.png`: the reference lies under his road in Road mode. Measured: with an AI line, Road sits 0.28 to 0.57 m
  below his road at the start; with none it is flush. Second repair sent to B: the Road-to-Line defect, Road set down on the
  ground in both cases (the librarian changed its earlier lean on the weighing by E), a tighter reach for the ground under a start.
- 06:3x (L): the second repair is in: builder `l250-shadow-tracks` 8c99a24 on b26db76 (local), `handback/p-l250-shadow-B_2026-11-26.md` "Second repair". A layout with no AI line keeps his pick through Line and draws again in Road (rows P9, P10, red first: 47 rows, 38 passed, 9 failed at b26db76); Road is set down flush with his road with a line too (RD1 amended by name, one line to undo); the ground under a start is the highest road at or below it; the words say "its first grid slot". Rows: ribbon 20 of 20, panel 27 of 27; mutants 18 of 19, the survivor equivalent. Not run: the real page, the flush height measured over the 44 installed lines (inferred). O reads the range, since E is reading the follow-ups.
- 06:4x (L): the read by O of the second repair is **CLEAN** (`handback/p-l250-read2-O_2026-11-26.md`). In the real page a layout with no AI line goes Road, Line, Road with no native call in Line and draws again; with a line, Road lands 0.000 m off his start height on 44 of 44 lines; 0 of 104 starts and first points sit under their road. One latent case, not on L: a road exactly at the height of the point is dropped in 1.0 to 9.2% of spots; a one-line cut closes it and goes in at the landing. The shadow tracks join the landing: `loop/packet_t180_landing_B_2026-11-26.md`.
