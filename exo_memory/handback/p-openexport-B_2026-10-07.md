# D264 — Export to Assetto Corsa on an unfinished track (pane B, 2026-10-07 01:4x)

FEEL tier. Rows and fake hosts only: no real window, no AC, the real AC install never touched. Worktree `C:\Users\nname\Desktop\worktrees\b-openac-wt`,
branch `b-openac`, **commit `2b929c2` on t180 main `e17a73e`**, 9 named paths, +130 / −30. Not pushed.

## Verdict
**Done. Land `2b929c2`.** The plan is right, with one note on dead code below.

## What changed
1. **Export to Assetto Corsa on an OPEN track** (`app/install/install.js`): the build refuses `OPEN_LOOP` as before, and the installer then
   makes D243a's TEST build (`buildExport({ textures, test: true })`). That build is folder `t180b_<name>_test`, with a run-off and a wall, its
   reds listed as warnings and in `t180b_TEST_UNFINISHED.txt`, and the name "(test, unfinished)". It goes through the same `native.installTrack`
   as the real export. The result line names the whole folder, then says: "this track is not closed, so it was exported as an unfinished TEST:
   the road ends in a run-off and a wall; reds are listed as warnings (TEST EXPORT (unfinished): N red finding(s) NOT blocking …)". The core
   is not changed (`coreshell.js:647` still refuses for every other caller).
   - A closed track builds with the same opts as before, so its export is unchanged (the existing row that checks
     `seen = { textures }` still passes).
2. **⋯ → Test export (unfinished)…** (`app/install/index.js`, `app/index.html`): the page's own handler (folder picker + `shell.exportTo(dir,
   { test: true })`) is removed. The install panel now binds the button (`testButton`) to `install({ test: true })`, which uses the same path as
   the main button and opens the **AC folder** picker only when AC is not known. On a closed track it is refused by name (TEST_CLOSED,
   "this track is closed: use Export …"), and nothing is written. **⋯ → Export…** is unchanged and still refuses an open loop.
3. **Docs:** the guide's Export step (`app/onboarding/guide.js`), `README.md` (Exporting), `app/README.md` and the tooltip on the ⋯ Test
   export button. There is also a CHANGELOG entry (Unreleased / Changed).

**Guards** are unchanged and still the install's own: native `install_to` takes only `t180b_` folders and never writes over a folder the
builder did not make (marker file), and an unnamed track is refused before anything is built.

## Rows (red first)
In `app/test/share-install.test.js`. The native side WRITES into a temp `assettocorsa\content\tracks` on disk, and the folders that land there
are read back.
- **Amended BY NAME** (its rule changed): "an open loop is not installed: the refusal is the Export button's own, and nothing is written" →
  "D264: an open loop is installed as the unfinished TEST export, t180b_<name>_test, and the line says so; never as t180b_<name>".
- New: open track → button writes only `t180b_monza_test` (with `t180b_TEST_UNFINISHED.txt` and `ai/fast_lane.ai`) and says so; a closed track
  then writes `t180b_monza`, a real export with no TEST file and no "TEST" in the line.
- New: ⋯ Test export → into AC with 0 dialogs when AC is known; with AC unknown, the AC folder picker once, which is remembered.
- New: guards. ⋯ Test export on a closed track is refused by name, with 0 folders written; an unnamed open track (`''`, `untitled`) is not
  installed.
- `src-tauri/src/ac.rs`: `a_test_export_folder_installs_under_the_same_guards`. `t180b_mine_test` installs and re-installs; a
  `t180b_theirs_test` folder the builder did not write is refused and left untouched (1 file); `mine_test` is refused for having no prefix.

**Red on `e17a73e`** (detached copy `b-openacred-wt`, the same rows uncommitted): share-install 20 pass / 4 fail, all 4 of them the new
rows. Two failed on the keeper's own text ("the loop is not closed: close it first (one click), then export") and two on "testButton.onclick
is not a function". *Note:* the guards row fails on base only because the button has no handler there; the guard behaviour itself already
held on base, so that red only proves the button is wired. The cargo row was not run on base: its guards predate D264, and it is a guard,
not a red.

**Green on `2b929c2`**, under the lock: 12 files, **200 tests, 198 pass / 0 fail / 2 skipped**. The 2 skips are the known ones: no local
position fit in reads/, and the brush hill row that has been superseded. The files: share-install, closer, core-eqonly, core-shell,
export-selfcheck, layout-css, onboarding, guides, shell-dist, shell-layout, test/core_doc, test/core_sculpt_modes. **cargo test 35/35.**
app/core is not touched, so core-xsec was not run. No mutation harness (the FEEL-tier rule).
Logs: my scratchpad `openac/red.out`, `openac/green.out`, `openac/cargo.out`. My first cargo step did not start (spawnSync found no `cargo`
on PATH: "exit null 0.0s"), so I re-ran it with the full path.

## Notes
- **`shell.exportTo(dir, { test: true })` no longer has a caller on the page.** It is still correct, still tested
  (`core-shell.test.js` D243a rows), and harmless. The comment at `core-shell.test.js:342` ("what the page's button calls") is now stale; I left
  it because it is outside the change. Remove the path or keep it as the shell's API: the chair's call.
- A closed track's ⋯ Test export message comes from the core ("use Export"), not "use Export to Assetto Corsa". It is accurate enough, and
  unchanged.
- Not done: driving the real app through the `T180_TEST_STEAM_PATH` / `T180_TEST_APP_DATA` seams (no real window this lap). The JS rows use a
  temp AC tree on disk, and the native guard is cargo's.
- My slips: a row cut stopped at a `});` inside the row (caught by `node --check`, restored, cut at a line-start `});` instead), and one
  heredoc escape collapsed (fixed with Edit).

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_open_export_ac_2026-10-07.md
NEXT: chair land 2b929c2 when this is read
