# p-d622 — ELYSIUM's p38/p41 crossing, old against new, as textured renders (O), 2026-11-02

Packet: the chair's D622 (00:34Z). Tier: JUST DO IT. Seat: O. For the page the librarian builds after A's D616 (the keeper: "not sure what i am looking for").

## The inputs, read only
- old: `content\tracks\t180b_elysium\t180b_elysium.kn5`, sha256 `a7c986de…2802`, the same file A measured.
- new: `content\tracks\t180b_elysium_new\t180b_elysium_new.kn5`, sha256 `384fdb1f…87f6`, written 16:33.
  - **Not the file A measured:** D616 gives `384b44ae…87f6` for the new kn5.
  - checked: A's own `int616.js` re-run on this file → still **33 intersecting pairs `UNDERSKIN_p38` × `1ROAD_APRON_p41`** over x 35.17–41.78, and the old file 3 pairs, both exactly as D616.
  - So the crossing is unchanged between the two new files.
- Both were copied to `G:\Consonance-tools\scratch-O-d622\{old,new}.kn5`, with sha256 equal to the originals. Nothing was written to the AC or tracks folders.

## The images (2560×1440, PNG, all in `G:\Consonance-tools\scratch-O-d622\final\`)

Every old/new pair shares one camera file (`views.json`, sha256 `93aaebb3…4647`), so the cameras are identical. The names run `<old|new>-<plain|xray>-<view>.png`.

**What the colours mean** (put this on the page beside the images):
- **magenta, outlined yellow:** p38's hull underside (`UNDERSKIN_p38_*`, and in the old export also `APRONSIDE_p38_*`), where it is actually drawn;
- **cyan:** p41's apron, the strip a wheel reaches when it leaves the lower road;
- **magenta stripes** (the `xray` images only): the hull triangles that intersect p41's apron, shown where something else hides them. That is **NOT what AC draws**; it shows where the hull runs through the apron. The old export has 2 such triangles (A's 3 pairs) and the new one 26 (A's 33 pairs) (`xtri.js` → `xtri-old.json`, `xtri-new.json`).
- Everything else is drawn as AC draws it: textures, back faces culled, depth.

| # | view | what it shows | recommended pair |
|---|---|---|---|
| (1) | `1-wheel` | eye 0.4 m above p41's apron at x 24, looking into the crossing | `old-plain-1-wheel.png` / `new-plain-1-wheel.png` |
| (2) | `2-side-zoom` | from beside, 39 m out (62, 36, −446), fov 14, onto the slot between p38 and the apron | **`old-xray-2-side-zoom.png` / `new-xray-2-side-zoom.png`** |
| (2) | `2-side` | the same spot, wider (fov 45) | `old-xray-2-side.png` / `new-xray-2-side.png` |
| (3) | `3-wide` | from 1.1 km up: the loop passing over its own exit; the crossing is ringed in yellow | `old-plain-3-wide.png` / `new-plain-3-wide.png` |
| (3) | `3-wide-near` | from about 360 m: p38 crossing over the lower road, with the cyan apron running underneath; ringed | `new-plain-3-wide-near.png` (old is the same view) |
| extra | `4-cut-x38` | a textured render with its near plane cut at x 38, through the crossing. The hull is drawn double-sided here only, so its edge-on shell shows | **`old-plain-4-cut-x38.png` / `new-plain-4-cut-x38.png`** |

## What I saw looking at every shot (read before captioning)
- **(2) side-zoom, x-ray, is the clearest real view.**
  - new: a long striped run, about 6 m, of hull triangles through the apron, to the left of the cyan;
  - old: one small striped patch at the apron's east end (the 3 old pairs, `APRONSIDE_p38`).
  - The difference is obvious side by side.
- **Cut x38 makes it plainest.**
  - new: the thin magenta hull band runs straight THROUGH the cyan apron;
  - old: the hull is a thick band that stays above it.
  - It is a slice, but a real textured render, not a diagram.
- **(1) from wheel height the two look almost the same, and that is a finding, not a failed shot.**
  - Under p38 the apron runs beneath a ceiling (p38 is a banked road about 25 m wide) that comes down to meet it ahead in both exports.
  - The old 0.5 m slot (`section-old.txt`, x 36–40: hull 27.73–28.03 against apron 27.21–27.71) foreshortens to a line at wheel height 12 m away.
  - So a driver on that apron would not see much change. The cut is visible from beside the road and in the slice, not from the wheel.
- **(3)** both wide shots place it plainly: the ring is where p38→p39's loop passes over its own exit.
- **The two exports' materials differ:** old's apron and hull use a solid grey texture (`t180b_solid_128.dds`), new's use the road texture. So the old images are flatter, and the old plain wheel shot is 126 KB against 2 MB. That is what each file holds, not the renderer.

## How (scripts in `exo_memory/handback/p-d622-crossing-renders-O_2026-11-02_evidence/`)
- **Renderer:** `render622.js` is built by `mkrender.js` from my D593 `render2.js` (a headless software renderer in node: no window, no GPU, no browser, so `--mute-audio` has nothing to apply to).
  - It adds the magenta/cyan tints, the yellow outline and ring, the x-ray limited to `XRAYTRI`, and a view's `near`/`double`.
  - Each run went through D604's `run.js`: the heavy-run lock, BelowNormal, the acs.exe check before the lock wait and again before the run, every child hidden.
- **Cameras:** `cams.js` writes `views.json`. The wheel eye stands on p41's apron by a vertical ray at (24, −474.6): the apron at y 25.02, normal (−0.14, 0.93, 0.35), and the eye 0.4 m along it.
- **Placement probes:** `section.js` gives `section-old.txt` and `section-new.txt`, per 2 m of x at z −474.3: the apron top, p38's road and p38's hull. `probe.js` lists the meshes near the crossing.
- **Dropped after looking:**
  - the first wheel eyes at x 30.5 and x 43.6: one was all ceiling, the other stood where p38's own apron dives under;
  - an x-ray of the whole hull, which striped all of p38's underside and buried the cut.

## Corrections
- My first x-ray marked every hidden hull pixel (1.9 M pixels in the side view), which is the hull under its own road, not the problem. It was narrowed to the triangles that intersect the apron before any image was kept.

SOURCES: the chair's D622; the two kn5 files (sha256 above); A's `int616.js` re-run; the scripts and text outputs in the evidence folder; every final PNG opened and looked at
NEXT: the librarian builds the page from these paths when this ring is read
