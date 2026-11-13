# Lap I's build: I1 (landed-live.js), E1 and E3 (the manifest's closure and reasons), I7 (dated holds) and I2 (whats-live by cargo's inputs), each red first and green; all mutants caught; nothing installed (pane P)

Seat: pane P (sibling-372c8abc), on D. Tier: PROVE IT. Nothing installed, merged or pushed. `install.ps1` was edited and tested in throwaway
repos only, apart from one bare `-Check` (a report) for I1's falsifier.
Branch **`lap-i-p` at 764a2d2f**, 10 commits on c1b9a395 (lap-w-h-p's head), worktree `C:\Users\nname\Desktop\worktrees\lh-i-p`.
Registered first: `exo_memory/handback/p-lapi-register-P_2026-11-13.md` (accepted). Scratch (S):
`C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\lapi\`.

## I1, `consonance/tools/landed-live.js` (d7825a0b, 9e6ae523)

- **What it does:** one state per installed entry, against HEAD. It parses `install.ps1` **table by table** (each `@{` to its closing `}` after
  dropping `#` lines), so a key on a row's second line is kept. "Runs here" means a `settings.json` command at the exact installed path, never a
  leaf match. Bytes are compared as git blobs after CRLF→LF.
- **States.** Failing: OWED, NEW, HOLD EXPIRED, LOCAL EDIT. Not failing: LIVE, NOT RUN HERE, HELD, EXCLUDED, EXCLUDED BUT LIVE, RUNS FROM REPO,
  WIRED ELSEWHERE, LIB (no By).
- **Modes and output:** `--all`, `--range A..B` (exit 1 on a failing entry in scope), `--explain`, `--summary`, `--json`. A `LIVE-HERE` last line,
  and each OWED line prints its exact `install.ps1 -NoRegister -Only` with the files it needs.
- **The second reader's changes are all in:** the cross-line parse, fixtures that write their own `By`, the clock seam `LANDED_NOW`, and the -Check
  agreement row run against the real script body.
- **Tests: 16 of 16.** Fixtures A to E (A and B cut from the real history: abcbff60, 63ec0296, 2d161fbd, b79bbafe, 3427cbbd, 142a6541, a6a9ed54),
  B2 and the control, C, and the edges.
  - The pins: the node blob equals `git hash-object --path` for every installed file on D, and the -Check agreement row.
  - **Red** was shown with the tool moved aside (S/i1-red.tap). That is a file-level red; the tool was written before its tests, see §6.
- **Mutants** (`landed-live.mutants.js`, 12 rows):
  - first run: applied 12 / caught 11 / NOT APPLIED 0. The survivor, "ABSENT read as LIVE", showed no row for a registered hook whose file is
    missing.
  - The row was added; rerun: **applied 12 / caught 12 / NOT APPLIED 0** (S/i1-mutants-2.out).
- **The registered falsifier, run on D's real disk** (read-only; scored by O after its installs, as ruled):
  - checked: `--all` against a bare `install.ps1 -Check` of this branch → 38 files, **37 agree**. The 38th, `sessionstart-ambient.js`, is ok to I1
    and DRIFT to -Check. checked: the installed copy has 67 CRs, the repo's 0, and they are identical once CR is removed: line endings only.
  - LIVE requires a command at the exact installed path, so no entry prints LIVE without one.
  - `--range 82da03fc..fe69a9fc` → **exit 1**, `OWED second-reader.js`, `OWED second-reader-worker.js`, `NEW second-reader-note.js` (after I7's
    `By`; before it, `LIB (no By)` for the worker, as the second reader predicted).
  - `--range a3cefeb9^..b0be06f0` → `NOT RUN HERE board-digest.js`, exit 0.
  - On this branch -Check reads ok 20, DRIFT 13, ABSENT 5. Against this morning's 23/10/3 that is +3 DRIFT and +2 ABSENT, as the critic predicted
    for Lap W's merge.

## E1 and E3, `consonance/tools/install-manifest.test.js` (8c8ab3b0, 1d8f1026)

- **E1:** every literal relative require of an installed source resolves to an installed file.
  - checked: at `8e85ff11^` → exactly `board-digest.js -> blind.js` unmet (the 08-17 "Cannot find module"); at 8e85ff11 → none; today → 7
    requires, 0 unmet.
  - Double-quoted requires and `../` are read too.
- **E3:** every non-Lib `$files` row has a `$register` row or a `Wiring` reason citing path:line.
  - **Red on 6 rows** at the start.
  - Two had a reason on record: userprompt-submit.js (`absent_hooks_ruling_2026-08-25.md:19`) and board-digest.js (K4,
    `plan_room_stretch_2026-11-13.md:168`).
  - Four were asked for (`p-lapi-e3-owed-P_2026-11-13.md`) and ruled (`plan_room_stretch_2026-11-13.md:195`). Each `Wiring` cites its own line,
    :204 / :206 / :208 / :210. Those lines are on main (37ffebd1); this branch's copy of the plan predates them, and the landing merge joins them.
  - No `$register` line added; nothing unregistered.
- **5 of 5 green.**

## I7, the dated holds in `dev/shell/install.ps1` (febc3e66, eff8c770)

- `By` on the 7 Lib rows, with the hooks that use each, found by grep.
- K3's holds written in: dispatch-gate.js and carrier-drift-watch.js, `Hold = '…plan_room_stretch_2026-11-13.md:167 - K3, off D'`,
  `HoldOn = @('D')`, `HoldUntil = '2026-11-27'`.
- **The machine and today are read once**, above the filter. `CONSONANCE_INSTALL_NOW` is the clock seam; the script read no date before.
- A string `Hold` here is tested **before the ABSENT branch**, and both write paths skip a held leaf and say so.
- **-Check prints `HELD <leaf>: <ruling> until <date>`** in place of ABSENT and of DECLARED NOT REGISTERED (the report lines the second reader
  named).
- Past the date: `HOLD EXPIRED`, still nothing written, and -Check red.
- **The old boolean `Hold = $true` (a two-way conflict) and its message are unchanged.** No row uses it today.
- `install.ps1` parses with 0 errors (the PowerShell parser, not run).
- **Tests** (`dev/shell/install-holds.test.js`): red at the base, 4 of 5 not ok (S/i7-red.tap); the L row passes there by design. Green: **5 of 5**.
  The expired row asserts the `HOLD EXPIRED` line, not the exit code.
- **Mutants** (`install-holds.mutants.js`, the spec's three and four more): **applied 7 / caught 7 / NOT APPLIED 0** (S/i7-mutants.out).
- `install-only.test.js`: 48 passed, 0 failed.

## I2, `consonance/tools/whats-live.js` (4f6fcbce, 764a2d2f)

- RED only when one of cargo's inputs is newer than the running exe: `<exe dir>/consonance.d` plus Cargo.toml and Cargo.lock.
- Bundle files that are not inputs print on a separate, non-red line.
- No dep-info: "inputs not readable", and the old rule is used, out loud.
- `open-items.js` runs its checks only as a script and exports `bundleResources(confPath)`. Its script run is unchanged: exit 0, same output.
- **Red first:** 6 new rows, TypeError (S/i2-red.txt). Green: **15 of 15**, plus `open-items-build.test.js`. The rows cover the 11-13 case, the
  11-03 true-stale case, Cargo.lock newer, `ui/` or `build.rs` newer (the second reader's weak spot), no dep-info, and the parse.
- **On D:**
  - before (at c1b9a395): exit 1, "RED: the running release binary predates 53bac6a0".
  - after: **exit 0**, "116 + Cargo.toml/.lock … 0 newer than the exe", and one non-red line naming `heavy_footsteps_low_bass_read_2026-11-13.md`
    and `stomp_recordings_and_sonniss_licence_read_2026-11-13.md`.
  - **Correction, found by that run:** the first version read Cargo.toml and Cargo.lock and the bundle list from THIS worktree. Its checkout made
    them newer than the exe: a false RED, and 44 "new" bundle files. Everything is now read from the tree the running exe was built in, two folders
    above `target\release`.
- **On `cargo check` and `consonance.d` (the chair's question):**
  - checked: the file's mtime is 08:48:03 today, the exe's is 2026-11-08 23:56:09, the file's one target line still names `…\consonance.exe`, and
    the librarian's note (`2026-11-13.md:387`) records a `cargo check --release` at about 08:47.
  - inferred: so a `cargo check` rewrites this file, list included, without touching the exe. I ran no cargo command to confirm it.
  - I2 never reads the file's age. It compares each listed input's mtime with the exe's, so a refreshed list can only add inputs that exist now, and
    a newer one still reads RED.

## Suites, and the one red that is not this branch's

- Under the ordinary lock: `landed-live`, `install-manifest`, `install-holds`, `whats-live`, `open-items-build`, `dream-gate`, `portable-paths`,
  `front-door-links` → 96 tests, 94 ok. The 2 not ok were portable-paths.
  - It named four fixture sites of mine (fixed in 764a2d2f: a UNC root, and a message that read as "D:\"), and the base's
    `landing-train.test.js:206`.
  - checked after: portable-paths names **only** `landing-train.test.js:206`, which `pp-fixture-p` (d8554952) fixes. O lands both together.
- `install-only.test.js`: 48 of 48.

## For the landing pane

- **CHANGELOG text** (the room has no root CHANGELOG; the landing pane picks the place):
  > **Added** — Lap I: `landed-live.js` says, per installed hook, whether this machine runs the repo's bytes (OWED, NEW, HELD, LIVE, …) with
  > the exact install to run; `install.ps1` takes dated holds (`Hold`, `HoldOn`, `HoldUntil`), honoured in every mode, with K3's two holds on D
  > until 2026-11-27; two static checks of the manifest (every relative require installed; every unwired file with a cited reason).
  > **Fixed** — `whats-live.js` judges the app by cargo's own build inputs, so a Markdown-only commit no longer reads as a stale binary.
- **No install is needed for the tools.** After landing, a bare `install.ps1` on D will print `HELD` for dispatch-gate.js and
  carrier-drift-watch.js and will not copy or register them.

## Corrections, mine

- **The test-first order slipped again, for I1:** I wrote `landed-live.js` before its tests (as with W4). Red was shown with the tool moved aside, a
  file-level red, and the mutant run then found the gap it hid.
- **I told the chair I7's mutants were queued when they were not.** I had committed the harness and not launched it. It was launched after I said
  so (S/i7-mutants.out).
- **I edited `install.ps1` (I7, E3) while I1's mutant run was going.** That suite reads `install.ps1` for its -Check row. Every control was green,
  and the rerun after the edits is 12 of 12.
- **Escapes:**
  - Git Bash heredocs on this machine turn `\\` into `\` (three test blocks broke, each caught by `node --check` before a commit).
  - The Write tool decodes `\uFEFF` to the character itself. In landed-live.js the escape is restored. In lap-w-h-p's two hooks the character is
    literal: harmless, and the same as `sessionstart-state.js`, and that branch is with O.
- **A Wiring line pointed at a line of `install.ps1` itself.** It moved twice as rows were added, so it now cites the outside ruling.

BASE: C:\Users\nname\Desktop\worktrees\lh-w-p c1b9a395
SOURCES: S/lapi/i1-red.tap, d-all.txt, d-check.txt, d-range-sr.txt, i1-mutants.out, i1-mutants-2.out, e13list.js, i7-red.tap, i7-green.tap, i7-mutants.out, i2-red.txt, touched.tap, install-only.txt; exo_memory/loop/plan_room_stretch_2026-11-13.md:167-210; exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md; git log c1b9a395..764a2d2f; ls of consonance/src-tauri/target/release/consonance.d and consonance.exe
NEXT: librarian route lap-i-p (764a2d2f) to pane O for landing after lap-w-h-p and pp-fixture-p when this file is read; O scores I1 on D after its installs
