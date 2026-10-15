# T-180 back to the panes: lap D330 (librarian, 2026-10-15 17:3x)

The keeper, verbatim: "we are moving track building work back to the panes, third place got you a catchup md".
The source is `C:\Users\nname\Downloads\t180-handoff\CATCH-UP.md` (141 lines, written ~17:00 by the Third Place), read
in full by the librarian. Beside it are `row8-finish-roll.test.patch` and `harness/`. Every number below is the Third
Place's, named with its run; panes re-run before they quote one.

## Where things are (from CATCH-UP.md, checked where marked)

- **Repo:** `C:\Users\nname\Downloads\t180-track-builder`, branch `feature/denser-asphalt`. Pushes go to `origin main`.
  - **`Desktop\t180-track-builder` is a stale clone. Never touch it.** checked by the librarian: 22 commits behind
    origin.
- **Released:** v0.3.6, main `5aa226d`, tag `v0.3.6`.
- **Unpushed since:** 13 commits, all described in CHANGELOG `[Unreleased]`.
- **Installed:** `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe` is `6c37902`, with `.exe.before-<name>`
  backups beside it.
- **Full suite:** `npm test`.
  - The librarian ran it twice this afternoon: 2800 of 2814, about 37 min.
  - The one fail is the pre-existing BANK_RATE test, which reads a gitignored `reads/rainbow_rd.read.json` that this
    clone lacks.
  - `test/core_water_mutation.test.js` failed once under the full load, and passes 20/20 alone.

## The keeper's firm rules for this work (CATCH-UP.md:27-44), binding on every pane

1. **Never steal focus.** He races while the builder runs.
   - Every browser and harness runs headless (`--headless=new`).
   - No `bringToFront`. No GUI window unless he asks.
   - Even `chrome.exe --version` without headless hands off to his Chrome.
2. **No push without his word, every time.** The credential scan runs before any push.
3. **Public text in our own words:** no quotes of him and no "the keeper" in the changelog or release notes.
4. **Obvious, measured, reversible builder fixes:** do them, then report. Ask before deleting or overwriting his data.
5. **Test first:**
   - reproduce a bug in a failing test;
   - change a test only when it is wrong, and say so;
   - run the full suite for core maths;
   - keep CHANGELOG.md current.
6. **Prove a fix with a measurement before calling it fixed.**
7. **Install only while the builder is closed** (`Get-Process t180-track-builder`):
   - back up the current exe;
   - compare hashes;
   - build with `cd src-tauri && ~/.cargo/bin/cargo build --release`.
   For this lap, installs wait for the librarian's collation.

## How the panes share one clone

Each pane works in its own git worktree off `feature/denser-asphalt`, at `C:\Users\nname\Downloads\t180-wt-<letter>`, and
commits there by named paths. The chair lands the worktree branches into `feature/denser-asphalt` after the librarian's
read. Nothing is pushed.

## Lap D330, wave 1, all four in parallel

1. **A, FIRST, Finish lays its roll too short** (CATCH-UP.md:46-66).
   - Apply `row8-finish-roll.test.patch` and see it fail on 6c37902 ("worst roll rate 1.131°/m, amber 0.9338").
   - Fix `src/core/finish.js:117`: size the roll by its measured peak, not its average. The way the catch-up prefers:
     lay it, measure it with the validator's own `rollRates` (`_internal`), and lengthen it until it is under amber.
   - Then ELYSIUM's fixture (`harness/fx/eq-ELYSIUM.t180track`) closes with 0 roll reds, measured with
     `harness/node/rollprobe.js`.
   - This is core maths: the full suite, plus a mutant of the sizing.
   - CHANGELOG entry.
2. **B, the two test faults found in the librarian's audit.**
   - The BANK_RATE test depends on gitignored data. It skips with a stated reason when its `reads/` file is absent, and
     the README or test header says how to get the reads. This changes a test because the test is wrong for any clone
     without the data; say so in the commit.
   - `core_water_mutation.test.js`, load-sensitive: find what times out under load, and make it robust without
     weakening any caught mutant.
3. **C, memory headroom, the catch-up's first lever** (CATCH-UP.md:105-110).
   - The preview mesh's boundary rows (`vertex()` `{p,n,q}` objects, about 433 MB on ELYSIUM) move into typed arrays, out
     of V8's 4 GB pointer cage.
   - It touches `rowWith`, `rowsOf`, `meshSeam` and the reuse paths, so the mutation suites must stay at their counts.
   - Measure with `harness/livesites.js` and `isoheap.js`, headless, before and after.
4. **E, the window-thread pause** (CATCH-UP.md:114-117). `proposeClose` (finish) takes about 4.5 s on the window thread.
   - Move it to a Web Worker, as the checker went in `7512f84`.
   - Measure the window's longest frame gap through Close with `harness/closefreeze.js`, headless, before and after. Its
     summary regex has a bug; fix it or read the marks.

**Not in this lap, held for the keeper:**
- the "export anyway (I drove it)" button (he hasn't answered);
- release 0.3.7 (on his word);
- ELYSIUM's stacked-within-2m reds;
- To floor from a down-sloping end.

Then the librarian reads all four, the chair lands them, the full suite runs on the landed branch, and an install waits
until the builder is closed.
