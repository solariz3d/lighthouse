# p-janitorpaths-E · D287-e2: the janitor's machine-specific paths · pane E, on D, 2026-10-10 · GREEN

The chair's red: the landing js-suite at main `57ef433d` failed `consonance/tools/portable-paths.test.js` (2 rows) on 15 sites from my `ef8fe910`.
**Result: lighthouse `611baf44` + `90687cf4` on `57ef433d`, branch `d287-e2`, worktree `G:\worktrees\e-d287e2-wt`. Not pushed; tree clean.**
Evidence in my scratchpad `d287e2/`; every run under the heavy-run lock, through main's `heavy-run.js` by absolute path.

## Why it reached main: my own false green
My D287 hand-back said "portable-paths: green, 0 new". That was false for these files. **portable-paths scans `git ls-files`, and I ran it BEFORE committing, while
`janitor.js`, its test, its mutants and the `.ps1` were untracked**, so it never saw them. From now on the ratchets run on the committed tree. Both commits below
were made before the ratchet that judged them.

## The fix
- **REVIEW (`Z:\consonance-archive`) and DISGUISED (`os.homedir()/Desktop/worktrees`) are config now, not code**, read the way `transcript-watch.js` `dataDir()`
  reads `data_dir`: an env override, then `~/.consonance.json`, else nothing.
  - the archive: `CONSONANCE_ARCHIVE`, then `archive_dir`;
  - the worktrees folder: `CONSONANCE_WORKTREES`, then `worktrees_dir`.
  - **Neither set: the class is not run, and the report SAYS so, naming the key** (`NOTE: (b) moves nothing …`, `NOTE: (d) is not run …`); (b) keeps its logs
    with the reason "no archive configured". It degrades loudly, never to a guess.
- **This machine's values belong in ITS config. I may not edit the live `~/.consonance.json`, so here are the two keys to add** (the values D287 had in code):
  ```
  "worktrees_dir": "C:\\Users\\nname\\Desktop\\worktrees",
  "archive_dir": "Z:\\consonance-archive"
  ```
  Until they are set, the janitor runs (a) and (c) only. `janitor-task.ps1` now prints a WARNING for each missing key at install (a warning, not a refusal:
  the vantage installer's form), and prints the value of each key that is set.
- **BENIGN-MESSAGE (`janitor-task.ps1:99`) is removed, not baselined:** the task description names the setting, not the path.
- The test's fake `C:\Users\…\Downloads` path no longer carries a real username (`someone`).

## The baseline, read row by row
After the fix, 15 → **12**, all benign, and only those were baselined (`portable-paths.js --update`):
- `janitor.js` ×2 BENIGN-FIXTURE: the D: refusal (`assertSafe`) and `archiveReady`'s D: check. Kept as code on purpose: the refusal is the safe direction on
  ANY machine (on one where D: is not a stick it refuses a drive it would never have been pointed at), and making it config would make a missing key unsafe.
- `janitor.mutants.js` ×1 BENIGN-FIXTURE: the mutant that removes that refusal.
- `janitor.test.js` ×9 BENIGN-TEST: sandbox fakes (`Q:\nowhere-at-all`, the `assertSafe` cases, a cited-log text).
- **The diff: exactly those 12 entries, plus the counts BENIGN-TEST 360 → 369 and BENIGN-FIXTURE 9 → 12. No other row touched.**

## Measured
| run | result | sha256 |
|---|---|---|
| portable-paths at main, reproduced | RED, 15 (`pp-main.txt`) | `61277615eecea21d…` |
| after the config fix, before the baseline | RED, 12, all BENIGN-* (`pp2.txt`) | `0c6f6c9f23ea63ba…` |
| the new config rows on main's janitor | 2 of 2 red (`red.tap`) | `52ddfb44e468f32c…` |
| the same rows + the suites on the fix | 62/62 (`green.tap`) | `e5f703eed371bc82…` |
| **portable-paths on `90687cf4`** | **green — 379 files in scope, 438 known sites, 0 new** (`pp3.txt`) | `2b5a37aec233a5fd…` |
| **portable-paths.test.js + janitor + heavy-run + state-manifest tests** | **106/106** (`tests.tap`) | `d3ece41434c86450…` |
| janitor.mutants.js | control 17/0; **25 applied · 25 caught · 0 survived · 0 NOT APPLIED** (`jmut.txt`) | `4a38935486fb1c45…` |
| one dry run (the keys not set here) | (a) 20,575 → 2.65 GB; (b) 0, (c) 0, (d) 0; both NOTE lines printed (`dry.txt`) | `4845e979577244a2…` |

## Corrections to myself
- The false "portable-paths green" in `p-janitor-E_2026-10-10.md` (above). That hand-back's line stands corrected by this one.
- A heredoc stripped backslashes once more during this lap (a username swap matched nothing, and an anchor failed loudly). Redone with Edit; nothing wrong landed.

## Not established
- The janitor has not run with the two keys set (the dry run above has them unset). The chair's install should set them first and re-run the dry run.
- The landing js-suite itself is the collator's: I ran portable-paths.test.js and the janitor's own suites, not the whole suite.

NEXT: librarian collate D287-e2 and route the two config keys and the task install to the chair, when this hand-back is read
