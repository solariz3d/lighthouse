# Packet L250 (pane B and pane O build; pane E reads when its L249 part is in; on L): shadow tracks, finished

**His words.** 01:05 and 02:23 are in `briefs/t180_reference_overlay.md`. 04:49, to "ship the ribbon now, or wait for
the full road?": "Yes finish the rest." So both: the ribbon made ready to install, and the full road from the kn5.

**What exists:** B's first look, `l243-reference-overlay` d0e4c78 (local, from cfa7ad9), hand-back
`handback/p-l243-reference-overlay-B_2026-11-26.md`. Other authors' track names stay out of every repo and hand-back.

## B: the ribbon, ready to install (branch `l250-shadow-tracks`, d0e4c78 rebased onto `l242-themed-marks` 0ab6cc8)
1. Rebase and keep the first look's rows green.
2. Close what the first look left: the 2 of 46 lines that do not read are refused in words in the panel, never drawn
   wrong; a layout that carries another layout's line is labelled as such; open (point to point) lines draw open.
3. The panel: pick from the installed tracks and layouts in AC's tracks folder, show or hide, and clear. Read-only:
   nothing of the reference enters the doc, a save, an undo step or an export. Rows prove each of those four.
4. Placement: at his start, with a move and turn nudge (the first look has one); the reference is never mistaken for his
   road (his road in front where they overlap). Say what you chose for height and why.
5. The shadow's colour comes from a token so each look can set it; one default is enough for this lap.

## O: the full road from the kn5 (same branch, native side only; O starts now, B wires it in after step 3)
- A Rust reader in `src-tauri/src/` (a new file beside `reference.rs`) that walks a track's kn5 node tree and returns
  only the valid-track meshes: AC's ROAD and KERB plus every key its `surfaces.ini` marks `IS_VALID_TRACK=1`
  (B's hand-back, "The total shape"). The node-side reader to check against is `tools/kn5.cjs readKn5`.
- One command the page can call per track and layout; it sends positions and indices only (about 1.8 MB for the
  152,397-triangle case), never the 450 to 634 MB file. A track with several kn5 files reads all of them.
- Rows (cargo): triangle and vertex counts equal `tools/kn5.cjs` for B's three references (their keys are in B's
  evidence, name-free); a truncated or foreign file is refused with a reason; no surfaces.ini falls back to AC's defaults.
- Measure and report: cold and warm read time, peak memory of the read, and the frame time with the road drawn
  (the first look took no figure). If peak memory passes 1 GB on this 32 GB machine, stop and say so before wiring.
- O works in its own worktree on a branch from B's d0e4c78 (`l250-o-kn5`) and touches only `src-tauri/`. B merges it and
  adds the mode to the panel: "Line" (ribbon) or "Road" (kn5), with the same placement and read-only rows for both.

## Tier and rows
**Build it** (a new layer in the preview and a new native reader; read-only by design, and that is what the rows prove).
Touched tests only (`test/reference_ribbon.test.js`, the new cargo rows, the panel's rows); the whole suite once at the
landing. Before a cargo build or a timing: `node consonance/tools/heavy-run.js --status`; no build while his app runs.

## For his eye, before any install
Pictures from the real page of the branch: his Coast Esses with a reference as Line and as Road, overhead and from his
start, in two looks. Local only, not committed. The librarian shows them.

Hand-backs to the librarian, claims checked or inferred. No install, no release.
