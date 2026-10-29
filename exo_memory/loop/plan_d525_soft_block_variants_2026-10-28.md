# D525: the soft road's own numbers, driven and compared. Librarian, 2026-10-28 19:2x

The keeper, 09:59 today: can the geometry be better, or is the wall Assetto's? Answered from D515's stages (`exo_memory/handback/p-d515-crazytest-O_2026-10-28.md`, "Margins" table): the car's layer (travel gone at ~25 g, the box on the mesh at ~47 g) is the mod's; the layer above 47 g is OUR road's soft-collision block, and the game's own wall (MAX_DEPTH 4 m) was 3.72 m away at the deepest frame. The keeper at 19:12: "1 is good to start."

## What exists (checked)

- The block the builder writes, every export, every road mesh: `src/export/trackfiles.js:12-29` SOFT_COLLISION_BLOCK: `MESHES=1ROAD?`, `SOFT_ERP=0.8`, `SOFT_CFM=0.0002`, `BOUNCE=0.1`, `FRICTION=0.05`, `MAX_DEPTH=4`. The numbers are `docs/FINDINGS.md` §4c (lines 76-92): identical on all 11 T-180 tracks, "a copied standard", never tuned by anyone. trackfiles.js:16-19 names the one known difference to the observed tracks: INTENSITY / RIGID_WITH_BODIES / RIGID_WITH_BOXES (1 / 0 / 0 on the observed blocks) are left to CSP's defaults here.
- What the block did on the keeper's helix (D515 §4, bands.txt): the box rode 26-28 cm into the mesh from 58 to 64 g and the depth stopped growing there; 6.25 s at 56-63 g. That is the one measurement of the block under load we have; nothing says how a different ERP/CFM would hold the same load.
- The instruments, all in t180 `tools/`: `loads.cjs`, `bottoming.cjs`, `boxdepth.cjs`, `speed.cjs`; O's `bands.js` and `peaks.js` in the D515 evidence folder. They read a replay and produce the stages table. The same tools on a new replay give the same table: that is the comparison.
- The inputs: the exported CRAZY TEST kn5 (sha256 bfde4dc6…c185) and fast_lane.ai (0cb82e6b…33f9), secured by O in its scratchpad `d515-track\` against E's d514-before manifest (D515 §0). The folder the export went to is the one E re-exported on D514; O's D515 §0 names its stamp.

## The question the lap answers

Hold the geometry fixed (the same kn5, the same AI line, the same car, the same stretch), change ONLY surfaces.ini, and read the stages table of each. If the box depth at matched load (the 50-55, 55-60, 60-64 g bands) moves with ERP/CFM, the road's own numbers are a lever and the next lap tunes the constant in trackfiles.js. If the bands stay within the replay's own scatter across the variants, the block is not the lever: the layer above 47 g is the car's and the game's, and the builder's rules (D517) are the answer, not surfaces.ini.

## Parts

- **Part 1, prepare (pane O, check it; it holds the D515 tools and inputs).**
  1. Read CSP's own account of the soft-collision keys (the CSP wiki page the block comes from, and the CSP source if it is public) and write in one table what SOFT_ERP, SOFT_CFM, INTENSITY and the two RIGID flags do, with the source beside each. No guess from ODE's meaning of ERP/CFM stands without a CSP source saying CSP uses them that way.
  2. Pick FOUR variants and say why each: A the shipped block (the control); B stiffer; C softer; D the shipped block plus INTENSITY/RIGID_WITH_BODIES/RIGID_WITH_BOXES as the observed tracks set them (1/0/0), the difference trackfiles.js:16-19 already names as the one to test. B and C change one key each where CSP's account allows, or ERP and CFM together if the account says they must move together; the magnitudes are O's to choose from the account, stated with the reason.
  3. Stage four track folders in O's scratchpad, each a copy of the exported CRAZY TEST folder with ONLY data/surfaces.ini different and the folder and ui name suffixed (`_soft_a` … `_soft_d`), so the game lists four tracks and nothing of the keeper's existing track is touched. A manifest with sha256 and size of every file in the four folders; the four surfaces.ini diffs against the shipped one in the hand-back.
  4. Hand back the table, the four reasons, the manifest and the staging path. The librarian reads the manifest, then O copies the four folders into the game's content/tracks (new folders only; nothing overwritten; the copy's sha256 compared to the manifest) and the librarian tells the keeper the four names.
- **Part 2, drive (the keeper).** The Mach 6 on each of the four, the same stretch (the helix, piece 13 and its run-in), driven by him or by the game's AI on the fast lane, the same way for all four; a replay saved per variant. Which drove is in the hand-back.
- **Part 3, compare (pane O, check it).** The D515 tools on each replay: the stages table per variant (bands.txt's bins), max load held, the box depth at the 50-55 / 55-60 / 60-64 g bands, longest episode under the mesh, and whether the depth stopped growing; the four height-vs-load plots on one axis. Page to the keeper as an Artifact with the real plots (the librarian publishes). Falsifier, registered now: the lap finds a lever only if some variant's depth at matched load differs from the control's by more than the control's own band-to-band scatter; otherwise the answer is "not the road's numbers", said plainly.

## Kept out

No change to trackfiles.js or FINDINGS in this lap (that is the next lap, prove it, if Part 3 finds a lever). No new geometry. No change to the keeper's installed CRAZY TEST. Nothing started with a window by a pane; the game is the keeper's to run. Removal of the four folders afterwards only on the keeper's word.

surfaced: trackfiles.js:12-29, FINDINGS.md:76-92, p-d515 §0 §4 §5, tools/loads.cjs bottoming.cjs boxdepth.cjs, evidence bands.js.
