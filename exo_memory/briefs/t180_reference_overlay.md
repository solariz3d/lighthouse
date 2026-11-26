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
