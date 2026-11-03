# D636: ELYSIUM NEW with the sci-fi road, built on the new generation (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT. Tree: `Desktop/worktrees/t180-e624` at `0692d11` (read only; `git status --short` → 0 lines).
AC was not launched, the app was not touched, and no existing track folder was written.

## The folder

**`G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_elysium_new_scifi_0439\`**, track name **"ELYSIUM NEW SCIFI 0439"**.

- **kn5:** `t180b_elysium_new_scifi_0439.kn5`, **190,293,803 B**, sha256 **`a876657b7da4b23a3dd6d7e0d15ba50a31f49193d4507bb66fc3208d1624af00`**.
  checked: `sha256sum` of the installed kn5 → the same as the export's own `kn5Sha` in `export.log`.
- **It carries the texture:** checked: `node scripts/kn5tex.js <kn5>` (`kn5tex.out`) → `t180b_made-15fd8c54218137c3-2048.dds`, 22,369,748 B, sha256 `e7b240e0e0eb0507…`.
  These are the same texture bytes as D599's and D358's sci-fi ELYSIUM.
- **The file set is complete:** checked: `sha256sum -c files.sha256` inside the installed folder → 10 of 10 OK (`.t180b-builder.json`, `ai/fast_lane.ai`,
  `data/map.ini`, `data/surfaces.ini`, `map.png`, `models.ini`, the kn5, `ui/outline.png`, `ui/preview.png`, `ui/ui_track.json`). `ui_track.json` gives the name
  "ELYSIUM NEW SCIFI 0439", 25046 m and 35 m.
- **The refusal checks, right before the copy:** at 19:33:20Z the folder was absent and `SC/d607/acs.js` reported acs 0. The copy ran inside the same guard.

## How it was made

- **The source:** a copy of `eq-ELYSIUM NEW.t180track`. Its sha256 is `2ab08386…5cfb` before and after (only read). The `.t180undo` was not opened.
  checked: this is the **same sha256 as the "ELYSIUM 0435" D599 built from**. So the track itself is unchanged; what differs is the generation building it.
- **The export:** `scripts/export636.js` is D599's export599.js with only the name changed. The recipe is the D358 spec (`spec.texmaker.json` in the 10-24 cleanup
  backup, sha256 `119e8c5c…5a95`), laid as every road piece's floor (46 pieces) at 2048 px, 35 m across and 20 m along, through `coreshell.buildExport({ textures })`.
  It ran at BelowNormal under the heavy-run lock's second slot (P's 0.4.39 landing held the first; not a timing session).
  checked: `export.log` → built in 137 s, 25,045.6 m, closed, no red. The amber notes are the track's own: bank-cup-edge 8, load-above-proven 5,
  load-on-the-chassis 14, load-sustained 3, wall-swerve 2, plus the catch surface.
- **Against D599 (0.4.35), as a fact, not a verdict:** that kn5 was 242,648,564 B and this one is 190,293,803 B (−52.4 MB). The texture is identical, so the
  difference is in the generated geometry. I did not measure where it comes from.

## The renders (for his page)

In `p-d636-elysium-scifi-C_2026-11-03_evidence/renders/`, 1920×1080:

| file | view |
|---|---|
| `d636-wide.png` | the whole lap from high to one side |
| `d636-follow-p17-joint.png` | a follow cam on the p16 → p17 joint, s 8603 m, about 70° of bank (`joints.out`) |
| `d636-follow-p35-joint.png` | a follow cam on the p34 → p35 joint, s 20603 m, about 85° of bank |
| `d636-p38.png` | p38 from above and beside, its middle (s 23228 m) |

- **How they were made:** the renderer is O's D593 `render2.js`: a software rasteriser in node that reads the installed kn5 whole, its DDS textures included.
  It uses no browser, no GPU, no window and no audio, so `--mute-audio` had nothing to apply to.
- **One change in my copy** (`scripts/render2.diff`, one line): an optional `up` per view, so the follow cams roll with the road. The views come from the
  same document's path frame at the same tree (`scripts/mkviews636.js`, `views.json`).
- **What they show:** I looked at all four. The sci-fi floor (lane dashes, cyan studs, cyan edge) is on the road in all four. The two joint views run
  smoothly through the joint, with no step visible.
  - inferred: "no step visible" is a look at a 1920×1080 still. It is not a measurement of the joint.

## Corrections

- My first wide view was too far out, and the second cropped the lap. The third is the one filed. Only the wide view's numbers changed (`mkviews636.js`).

SOURCES: export.log; files.sha256 (sha256sum -c in the installed folder); kn5tex.out; joints.out; views.json; render.log; acs.js and the folder check at 19:33:20Z; sha256sum of his .t180track before and after
