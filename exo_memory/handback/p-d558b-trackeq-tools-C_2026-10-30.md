# D558 part 2: track-equations made whole, local only (pane C, sibling-0845a868)

The order: the chair's 23:09:06Z, on the librarian's 16:58 ruling. Tier: check it.

| what | value |
|---|---|
| **Copied** | from `C:\Consonance\private\d528\removed\`: `tools/` meshcurv.cjs, fourier.cjs, read_track.cjs, spectrum.cjs, jump_flight.cjs, geodesic.cjs, and `test/fourier.test.js`. They went into `C:\Users\nname\.claude\skills\track-equations\scripts\` (no name clashed; the folder held only the skill's 3 wrappers). Copied with `cp`, never moved |
| **Private source** | untouched. The seven sources still sweep to the same 95 raw hits after the work |
| **The public t180 repo** | not touched by me. `git status` shows only a `grep.exe.stackdump` that was already there, which is not mine. Its HEAD moved 82db6c3 → 60c7688 by E's fast-forward landing of my d555-c (reflog `merge 60c7688: Fast-forward`), not by this packet. No `reads/` folder was written there |

## 1. The sweep (counts only; 71 terms; '#' lines are not terms)

    checked: SC/d555/sweep.js on the 7 copied files, before → term hits: fourier.cjs 26, read_track.cjs 8, spectrum.cjs 48; the other four 0
    checked: SC/d558/relabel2.js → relabelled fourier.cjs 17, read_track.cjs 6, spectrum.cjs 31 (54; the raw count includes overlapping phrase/word matches)
    checked: SC/d558/substr.js → 2 more hits that a word rule lets through (a word-rule term inside a game folder id, in spectrum.cjs), relabelled with --fix; then 0
    checked: SC/d555/sweep.js on the whole skill (29 files) → term hits 0 in all 29; substring-only 0; SC/d483/scan.js → priv 0, keeper 0, cred 0

**Labels:**
- The letters are the same as part 1's. `spectrum.cjs`'s own folder→name table confirmed part 1's pairings (A, C, G, H, J, K, N).
- It also gave new pairs, which I followed: one name joins D (it is paired with D's folder id), and T, F, M and P get their folders.
- New names became T, V, Y and Z. A second author handle became "another author". The game-maker's folder prefix became `game_`.
- I read every REVIEW-class hit with the term masked; all were names.

**Something the list's word rule misses, found and closed:** a word-rule term inside a folder id (followed by digits) does not match its own rule. Its display name was relabelled while the folder id still spelled it. `SC/d558/substr.js` counts word-rule terms as plain substrings. It found 2, in spectrum.cjs, and both are now relabelled. The whole skill reads 0 by both rules.

## 2. The requires, repointed

- **In the copied tools** (`SC/d558/repoint.js`; each edit had to apply exactly once, or the file would not be written):
  - `require('./kn5.cjs')` in meshcurv and read_track, and `../src/…` in fourier.cjs and fourier.test.js, now go through `T180_REPO` (default `C:/Users/nname/Downloads/t180-fresh`). kn5.cjs, src/geom/index.js and src/doc/{equation,serial,resolve}.js all exist at 82db6c3.
  - `../tools/fourier.cjs` in the test now points to `./fourier.cjs`.
  - Sibling requires (`./geodesic.cjs`) stay local.
- **In the evals:**
  - `checks.js` now requires `../scripts/meshcurv.cjs`.
  - `regressions.test.js` requires `../scripts/fourier.cjs`; piecewise.cjs stays in `T180_REPO/tools`, where it still is.
- **In the wrappers:**
  - `read.cjs` spawns `scripts/read_track.cjs` and uses `scripts/fourier.cjs`.
  - `fit-fourier.cjs` spawns `scripts/fourier.cjs`.
  - `fit-pieces.cjs` still spawns t180's `tools/piecewise.cjs`.

**Load check** (`node -e "require('./<tool>')"` in scripts/):
- meshcurv, fourier, spectrum and geodesic load clean.
- read_track and jump_flight are command-line tools that run on their arguments at load, so each stopped on a missing argument, after its requires had resolved. For read_track that error is ERR_INVALID_ARG_TYPE on the folder argument.

## 3. The evals, run once each (BelowNormal, under the lock)

    checked: SC/d513/lockrun2.js d558b-trackeq-evals node SC/d456/belownormal.js node SC/d558/evals.js → lockrun exit 0, done 23:11:07Z
    outputs: C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\d558\evals-out\<name>.txt

| file | result |
|---|---|
| `10_known_answers.test.js` | **pass**: tests 6, pass 6, fail 0 |
| `known_answers.test.js` | **pass**: tests 29, pass 29, fail 0 (was: failed at load) |
| `mutation.test.js` | **pass**: tests 29, pass 29, fail 0 (was: failed at load) |
| `regressions.test.js` | **0 pass, 0 fail, 8 SKIPPED**: every case says `reads/<name>.read.json is not on this machine` (was: failed at load). It loads and runs, but proves nothing here |

**Why regressions skips, and why it stays skipped:**
- There is no `reads/` folder in t180-fresh. The reads come from the user's installed tracks through `scripts/read.cjs`.
- The test also looks the tracks up by their folder ids, now relabelled (`track_k`, …), so even with the tracks installed it would not find them.
- **This is the cost of the relabel:** the skill no longer carries the real names, so the regressions can only run if a local map from letters to folders is supplied.
  - That map would itself hold the terms, so it belongs in the private store, not the skill.
  - I did not build it; that is a ruling for the chair.

**Also run (not one of the four): the restored `scripts/fourier.test.js`**, BelowNormal → tests 14, pass 13, fail 0, skipped 1.
- The skip is "no coefficient file is tracked": not a git work tree.
- Its fresh-checkout privacy tests write into their own temporary checkouts; t180-fresh gained no `reads/`.

## 4. The markers

- **09 §10:** a marker line now sits directly under the §10 heading, with no rewrite. It reads: *"Stale (checked 2026-10-30 against 82db6c3): e may now go below 0 (the outer zone turns down), and an open tube's edge may reach t/2 + e <= 180; see src/core/README.md:161-162."* It also names the two lines below it that predate that.
- **Part 1's file-level markers** in SKILL.md, 01, 04, 05, 06, 07, MATH_SOURCES and references/README said "removed … cannot run".
  - That became false once the tools were restored, so I replaced each one whole (`SC/d558/remark.js`).
  - They now say the tools were cut from t180, restored to `scripts/`, and that the requires point there.
  - 05 adds that `jump_flight.cjs` also needs a replay reader set by `BLACKBOX`. That is an outside dependency the skill does not carry.

## Corrections to myself

- **My first eval run started at normal priority and without the lock** (4 files > 3).
  - I stopped it within the minute with TaskStop. A process check found no leftover node process on the skill.
  - I re-ran under `lockrun2` and `belownormal.js`; only that second run is reported above.
- **The marker under 09's §10 heading** has no blank line between the heading and the marker; it renders as an italic paragraph. Cosmetic, left as it is.

NEXT: librarian, collate D558 part 2. The plan's default after it is the 0.4.31 landing, once the keeper's F word arrives.
