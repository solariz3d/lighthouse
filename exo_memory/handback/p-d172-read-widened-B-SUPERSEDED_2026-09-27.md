SUPERSEDED, NOT A RECORD OF ANY LANDING (B, 2026-09-27 ~18:00). This was the widened D171–D174 read, built on 59ff906 after D171+D172 had already landed as ae10a41. Nothing was ever landed from it, its worktree b-d174land-wt is removed, and its section 5 claim that D175 edited the live CHANGELOG is WRONG (that file is 59ff906's, left behind by the index-only reset). The record for D171+D172 is p-d172-read-B_2026-09-27.md as committed at 614a80c (sha256 89befb2a…); the record for D173+D174 is p-d174-read-B_2026-09-27.md. Kept only as a dated trace.

GREEN
Worktree: C:\Users\nname\AppData\Local\Temp\b-d174land-wt (detached at 59ff906; D171 + D172 + D173 + D174; nothing committed)
Superseded: C:\Users\nname\AppData\Local\Temp\b-d172land-wt, the D171+D172-only landing from the first packet. Do NOT land it. It is kept only
because it is mine to remove on your word: `git -C C:\Users\nname\Desktop\t180-track-builder worktree remove --force <that path>`.

# P-D172-READ, widened to D171–D174: the combined read, and the landing

**Pane B, machine D, 2026-09-27, 17:15–17:40 local.** Nothing was committed or pushed, and AC was not launched. The
shared checkout is untouched.

## 0 · In short

- **The suite in the worktree, under the heavy-run lock, `--test-concurrency=4` (`npm test`):**
  **806 tests · 800 pass · 0 fail · 6 todo, exit 0**, 17:31:22–17:37:01, `duration_ms 337942`. The "failing tests"
  block holds only the known `todo` (roundtrip width, C's p-d166 §3).
- **All four parts do what they say**, within the limits each author stated. I wrote my own probes, with my own
  fixtures:
  - markers 10/11 plus the export refusal (the 11th was my open-track fixture);
  - textures 20/20;
  - texture maker 15/15;
  - pit lane and layouts 16/16.
  (§2)
- **Built from a snapshot, not the live tree.** At **17:28:38** I copied all 68 pending files into
  `scratchpad/d174/snap/`, with sha256 and mtime for each (`snap_sha.txt`). The worktree was filled from that copy.
  Its 60 landing files are byte-equal to the snapshot (`wt_sha.txt`), and they were still equal after the suite ran.
  **D175 edits did not slip in:** 11 live files changed after 17:28:38 and 6 new ones appeared (§5). None of them is
  in the worktree.
- **One worktree carries all four laps,** so the doc files no longer need their D172 and D174 hunks separated. Every
  mixed file is carried whole, as it stood at the snapshot.
- **Privacy: PASS** on every item. One NOTE: four new comment lines carry room vocabulary (§4).
- **`--test-concurrency=4` has been in `package.json` since 59ff906.** No change was needed.

## 1 · What is in, and what is out

`files.txt` lists the 68 pending files at the snapshot (`git diff --name-only HEAD` plus untracked, sorted).
`land.txt` holds the 60 that land.

**Excluded (8):**
- `scripts/ac_launch.js`, `test/ac_launch.test.js`: excluded as always.
- `scripts/prove_render.js`, `scripts/prove_render_dialog.ps1`: C's edits from 17:00–17:01. They are named in none of
  the D171–D174 hand-backs, so they go to whoever owns that lap.
- **D175, already on disk at the snapshot:** `scripts/bench.js` (17:27:18), `scripts/soak.js` (17:28:31),
  `src/doc/phrasebook.js` (17:27:53) and `test/phrasebook.test.js` (17:28:32).
- No landing file requires any excluded file. Checked with `grep -nE "require\([^)]*(phrasebook|bench|soak|ac_launch|prove_render)"` over
  the 60: 0 hits.

**Hash checks against each author's own table:**
- **D173 (C):** all 11 files in C's §1 table match the snapshot on the first 16 hex digits: `2d9823af`, `228ecb3c`,
  `21942c0d`, `1f077e4b`, `5e34fef4`, `2b4d1847`, `42ec2268`, `dfc9c2f4`, `6faf53ca`, `b681c781`, `836844ec`.
  `app/test/mutation.test.js` is `0aa6df69` against C's `cd8d5926`. It and `test/geom_mutation.test.js` both changed
  at 17:25:45, which is C's §7 fix (child `node --test` runs capped at `--test-concurrency=4`). The diff against HEAD
  shows exactly that plus C's T1/T2, and nothing else.
- **D171 (E):** `src/markers/*`, `app/markers/*` and `src/export/markers.js` match E's table.
  `test/export_words.test.js` and `test/markers_export.test.js` were edited after E's 16:4x table, as in the first
  read.
- **D174 (A):** A gave no hashes. The snapshot's sha256 for each file is the record.
- **D172 (A):** `test/doc-textures.test.js` now reads `D.SCHEMA`. That is A's own D174 re-pin, named in A's §1.

## 2 · Does each part do what it says?

**D171 markers and D172 textures:** as in the first read of this packet. The probes are `scratchpad/d172/probe_mk.js`,
`probe_exp.js`, `probe_tex.js` and `probe_mig.js`:
- markers keep their track coordinates when an upstream turn changes, and stand 1.09e-14 m from the surface;
- the paint is generated from the markers;
- a red layout refuses the export and writes nothing;
- the self-made PNG becomes a DDS with the full mip chain (my hand-parsed header agrees);
- files are refused by name;
- the kn5 holds the preview's DDS bytes verbatim.

**D172 is still a library:** the mesh UVs, the per-slot materials, the preview display and the page/export wiring
are A's named seams, not built.

**D173 texture maker (`scratchpad/d174/probe_tm.js`, 15/15):**
- four presets;
- each preset's text round-trips byte-exact;
- each renders the same bytes twice (asphalt `04832fb7…`, rainbow `95232f7d…`, lanes `48b99c84…`, neon-night
  `f3180a9c…`, sha256 of the RGBA at 96×48);
- **rainbow renders the same bytes in a fresh process** (`95232f7d…`);
- a texture of my own (4 across-stripes, width 0.5 of the period, at 64²) is exactly 32 white rows in runs of 8, at
  two columns;
- **the seam into A's DDS:** lanes at 128×32 → 8 mips, and level 0 is byte-identical to the maker's pixels;
- refusals: BAD_SIZE (8193), UNKNOWN_LAYER, UNKNOWN_KEY.
- My first two fails were my fixture: it lacked the `"texmaker": 1` key and spelled `color` for `colour`.
- Not re-derived: C's resolution bounds, and the corrected composite bound.

**D174 pit lane and layouts (`scratchpad/d174/probe_pit.js`, 16/16).** My loop is 5 words plus closeLoop, with a
260 m straight. The lane is on w3, from 20 to 240 m, offset 10, width 6, easing over 60 m.
- **The document:**
  - schema 3 carries the lane;
  - its text round-trips byte-exact;
  - `setPitLane(d, null)` gives the lane-free document back byte-exact;
  - schema 2 migrates to 3 with `pitLane: null`;
  - a schema-2 file already carrying `pitLane` is refused (UNKNOWN_KEY).
- **The joins, by my own finite difference on `at(s)`:** at both the leave and the rejoin, the inner edge is ON the
  road edge (gap 0.0 m). Over 0.05 m the angle between the edge and inner directions is 4.16e-4 rad, which is the
  smoothstep's own quadratic (3·(h/D)²·offset / h ≈ 4.2e-4), so it goes to 0 as h → 0. The gap stays in [0, 10] m
  and never goes negative.
- **The export:**
  - the kn5 has three `1ROAD_PIT_*` cells;
  - both AC_PIT boxes stand **23.0 m from the main centreline**, which is 10 half-width + 10 offset + 3 half-lane, so
    they are on the lane;
  - the same loop with no lane has no pit cells.
- **Layouts:**
  - a two-layout project writes `models_withpit.ini`, `models_plain.ini`, `<layout>/data`, `<layout>/ai` and
    `ui/<layout>/ui_track.json`, with no root `models.ini` or `ui/ui_track.json` (19 files);
  - the lane appears only in its own layout's kn5;
  - each `pitboxes` equals its own kn5's AC_PIT count (2 and 2).
- **Not verified:** anything in AC; `ai/pit_lane.ai`, which is not generated, so AI cars cannot pit; validation of the
  lane itself (loads, speed); anything in the app, since the lane is not editable there yet. All of this is A's own §6.

**Flags for A, from reading the D174 hand-back:**
- its §4 still holds the unfilled placeholder `FULLSUITE`, and its §5 ends at `MUTANTS2`: the full-suite count and the
  mutant re-run result were never written in;
- the 26/26 and 117/117 counts predate the survivor tests.

## 3 · package.json

`git show 59ff906:package.json` → `"test": "node --test --test-concurrency=4 \"test/*.test.js\" \"app/test/*.test.js\""`.
It landed with D170. No change here.

## 4 · Privacy gate (worktree, 61 files = 60 plus CHANGELOG, 582K by `du -ch`)

The file set is `(git diff --name-only; git ls-files -o --exclude-standard) | sort -u`.

| item | command | result |
|---|---|---|
| keys / tokens | `grep -nE "sk-…\|AKIA…\|ghp_…\|xox[bp]-\|AI_GATEWAY\|api[_-]?key\s*[:=]\|Bearer …"` | **PASS**, 0 hits |
| personal paths | `grep -nE "C:\\\\Users\|C:/Users\|nname\|zackn\|solariz3d\|trynabe\|AppData\|Desktop"` | **PASS**, 0 hits |
| binaries | extension grep plus `file -b` not-text | **PASS**, none |
| no generated or other-author texture bytes | the above, plus `grep -nE "[A-Za-z0-9+/]{200,}"` | **PASS**, none. `presets.js` takes colour stops by eye from our own `results/rainbow_full.png`, which is already tracked at HEAD, and copies no bytes |
| test images generated in the tests | as in the first read: zlib, A's `encodePng`, `test/texture_jpeg_encoder.js`, and C's `makeTexture` | **PASS** |
| other authors' track content | `grep -lE "auroracryopticon\|nordschleife"` | **PASS**: `src/export/layouts.js` names two installed tracks' FOLDER LAYOUT in a comment, with no content from them. HEAD already names installed tracks (`results/envelope.json`, `results/t180.json`) |
| room vocabulary | added lines plus the new files, `grep -iE "consonance\|librarian\|keeper\|lighthouse\|exo_memory\|\bseat\b\|orchestrator\|hand-?back"` | **NOTE** (not private data, the same class as HEAD's existing `library.js:1`): `app/markers/panel.js:13` "(a proposal for A, D171 hand-back)"; `src/markers/index.js:7` "hand-back's proposed interface"; `test/markers_lane.test.js:2` "(the D171 hand-back proposes …)"; `src/doc/pitlane.js:4` "(§11.1, the keeper: …)". These are the authors' own files, so I did not edit them; each is a one-line comment edit if the chair wants them clean before the push |
| excluded work absent | the §1 list | **PASS** |

## 5 · The live tree has moved since the snapshot (17:37:26, `sha256sum` against `snap_sha.txt`)

- **Changed:** `app/test/texture-panel.test.js`, `app/texture/index.js`, `app/texture/panel.js`, `scripts/bench.js`,
  `scripts/soak.js`, `src/doc/phrasebook.js`, **`src/doc/serial.js`**, **`src/doc/textures.js`**,
  `src/texture/set.js`, `src/texture/warnings.js`, `test/phrasebook.test.js`.
- **New:** **`CHANGELOG.md`** (modified in the live tree), `app/shell.js`, `src/doc/packs.js`,
  `test/doc-packs.test.js`, `test/perf.test.js`, `test/texture-made.test.js`.
- **For the chair, landing:** these are D175. After the commit, the live `serial.js`, `textures.js`, the texture files
  and `CHANGELOG.md` sit on top of the new HEAD as D175's diff. **The live `CHANGELOG.md` was edited by D175 while
  this landing carries its own CHANGELOG.** Bringing the shared checkout to the new HEAD must not overwrite D175's
  CHANGELOG edit; it will need a merge (same method as 59ff906: `reset --mixed` keeps the working files).

## 6 · The landing list (61 files)

**Modified (11):** `CHANGELOG.md`, `app/test/mutation.test.js`, `src/doc/document.js`, `src/doc/library.js`,
`src/doc/serial.js`, `src/export/fromwords.js`, `src/export/markers.js`, `test/doc-library.test.js`, `test/doc.test.js`,
`test/export_words.test.js`, `test/geom_mutation.test.js`.

**New (50):**
- D171: `app/markers/index.js`, `app/markers/panel.js`, `app/test/markers-panel.test.js`, `src/markers/checks.js`,
  `src/markers/index.js`, `src/markers/layout.js`, `src/markers/paint.js`, `src/markers/place.js`,
  `test/markers_export.test.js`, `test/markers_lane.test.js`, `test/markers_track.test.js`
- D172: `app/test/texture-panel.test.js`, `app/texture/index.js`, `app/texture/panel.js`, `src/doc/textures.js`,
  `src/texture/dds.js`, `src/texture/errors.js`, `src/texture/image.js`, `src/texture/index.js`,
  `src/texture/inflate.js`, `src/texture/jpeg.js`, `src/texture/mapping.js`, `src/texture/png.js`, `src/texture/set.js`,
  `src/texture/slots.js`, `src/texture/warnings.js`, `test/doc-textures.test.js`, `test/texture-image.test.js`,
  `test/texture-mapping.test.js`, `test/texture-set.test.js`, `test/texture_jpeg_encoder.js`
- D173: `app/test/texmaker-panel.test.js`, `app/texmaker/index.js`, `app/texmaker/model.js`, `src/texmaker/errors.js`,
  `src/texmaker/index.js`, `src/texmaker/make.js`, `src/texmaker/presets.js`, `src/texmaker/schema.js`,
  `src/texmaker/text.js`, `test/texmaker.test.js`, `test/texmaker_mutation.test.js`
- D174: `src/doc/pitlane.js`, `src/doc/project.js`, `src/export/layouts.js`, `src/export/pitlane.js`,
  `src/geom/pitlane.js`, `test/doc-pitlane.test.js`, `test/export-layouts.test.js`, `test/geom-pitlane.test.js`

**Excluded:** the 8 in §1. **Commit from the worktree by path:** `git -C <WT> add -- <the 61>`, then
`git -C <WT> commit -- <the 61>`.

## 7 · CHANGELOG (in the worktree)

- **Added:**
  - D171 markers, with `opts.markers`;
  - D172 slots, tools and panel, marked "not yet used by the mesh, the preview or the export" and "not yet mounted";
  - **D173** the texture maker (four presets; the panel not yet mounted);
  - **D174** the pit lane (schema 3; not yet editable in the app), the pit lane in the export (**no `ai/pit_lane.ai`,
    so AI cars cannot pit**), and projects of several layouts.
- **Changed:**
  - the hotlap start's run-up (352 m at 460 km/h);
  - the canonical text carrying `textures` (2) and `pitLane` (3);
  - the mutation harnesses' children capped at concurrency 4.
- **Fixed:** the 3-abreast grid read 40° off.
- Left out: in-lap bugs no user ever met (A's schema-"1" string and schema-2-with-lane, C's decal quarter turn).

## 8 · Corrections to myself (W)

- **W1** (first packet): I copied a "pure" `fromwords.js` without checking its hash against E's table, and it carried
  two D174 lines. Here every copy was hashed at copy time, as the chair asked.
- **W2:** probe-side slips, none of them a product defect:
  - an open-track export fixture;
  - `readKn5` returns `pos`, not a matrix;
  - a closed document must be resolved through `buildExport` (`resolve` refuses CLOSE_NOT_BUILT);
  - the texmaker fixture lacked `"texmaker": 1`;
  - one probe temp dir was left by a crashed run; it is removed.
- **W3:** my first-packet suite runner printed no counts, because its filter ran on text with ANSI codes. Counts here
  come from `sed 's/\x1b\[[0-9;]*m//g' suite.full.txt | grep "^ℹ "`. The full output's sha256 is
  `7cd00d87e197d302…`.

## 9 · Commands

- Snapshot: the loop in `scratchpad/d174` (`files.txt`, `snap/`, `snap_sha.txt`, `snap_time.txt` = 17:28:38,
  `snap_head.txt` = 59ff906).
- Worktree: `git worktree add --detach <WT> 59ff906`, then copy from `snap/` by `land.txt`, then `wt_sha.txt`.
- Suite: `node scratchpad/d174/suite.js`. It calls `heavy-run.js hold()`, runs `npm test` with `NO_COLOR=1` and the
  gateway key removed from the child env, then releases.
- Probes: `node scratchpad/d174/probe_pit.js`, `probe_tm.js`, and `scratchpad/d172/probe_*.js`. Their temp folders are
  removed.
- Drift: the §5 loop at 17:37:26.

Scratchpad = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad`.
