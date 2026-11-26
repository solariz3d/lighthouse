# BUILD 2, the Sharp gate (D677): Sharp refuses on reds only. Pane B, 2026-11-26

From my own answer, `exo_memory/handback/p-sharp-vs-rate-B_2026-11-26.md`. Tier: PROVE IT.

- **Branch:** `d677-sharp-reds-b` on `solariz3d/t180-track-builder`, tip **d80c96adcae1e70d11adfd40dc54e0f6252d98e7**, one commit on `ceb21f5` (landing-1126). Not merged, not installed.
  - checked: `git ls-remote origin refs/heads/d677-sharp-reds-b` → `d80c96a…`
  - checked: push-gate ledger row `2026-11-26T22:20:26.468Z` → `allow`
  - checked: a privacy grep of the 161 added lines against the words of the `reads/` file names → 2 hits, both ordinary words ("short", "normal"), no name; credential words → 0.
- **Worktree:** `G:\consonance-scratch\b-t4-t180`. Evidence (local, uncommitted): `G:\consonance-scratch\b-sharp-work\`.

## The change

All of it is in `src/core/sharp.js`.
- `extendSharp` refuses only when `faults(...).red` is non-empty. The message names the reds.
- `tightestSharp` bisects on `clear`, which means no red; ambers play no part.
- `ADVISORY` stays as it was: it only filters the ambers a refusal carries.
- The checker's 970 km/h full-speed probe and display are unchanged, as his D256 choice.

One wording change: when no radius up to 2000 m clears, the message says "free of reds" instead of "green".

**What stops refusing.** Every amber now stops refusing, not just the two the order named (`load-above-proven`, `bank-cup-edge`).
- The full set is every amber `src/validate/index.js:484` assembles: `raw.pts` ambers, `rollAmber`, `overheadAmber`, `stackAmber`, `sustainedLoad` and the rest.
- On these probes I saw three: `load-above-proven`, `bank-cup-edge`, and the amber level of `roll-rate`.

## Rows, red first

`test/core_sharp.test.js`. Base runs used `git stash` of `sharp.js` only.
- checked: `git diff --quiet ceb21f5 -- src/core/sharp.js` → "sharp.js = base".
- Command: `node --test --test-name-pattern D677 test/core_sharp.test.js`, run at BelowNormal.

| row | what | on ceb21f5 | on d80c96a |
|---|---|---|---|
| 1 | one of the 36 made synthetic (R 26, −69°, width 29, bank 44°, edges 7° / 2°): lays, and the checker shows `load-above-proven` on it | **RED**: `SHARP_TOO_TIGHT … (load-above-proven): tightest at this width: 67.4 m; faults {"red":[],"amber":["load-above-proven"]}` | green |
| 2 | width 24 at R 11 folds: refuses, names `fold`, nothing changes | green (a guard: a red refused before too) | green |
| 3 | tightestSharp where only ambers fired: names ≤ 26 m, that radius lays, 0.2 m under it is a red | **RED**: `tightest 67.4 m, typed 26 m` | green |
| 4 | off-camber made synthetic (R 48, −36°, width 29, bank −18°, edges 13° / 7.5°): `leaves-surface` refuses by name, names where the red ends, that lays, 0.2 m under it the red is back | green (a guard on the red half; see below) | green |

- checked: `b-sharp-work/rows_base2.txt` → tests 4, pass 2, fail 2 (rows 1 and 3).
- checked: `b-sharp-work/sharp_branch3.txt` → the whole file, tests 12, pass 12.

**Row 4 was added after the first harness run**, so that S10 and S11 would be caught (below).
- Its first form asserted "no radius up to R_HI is free of it". That was my inference and it was wrong on the branch: the tightest named was 308.5 m.
  - checked: `sharp_branch2.txt` → `308.5 !== null`.
- So on base the off-camber corner named no radius because of its `bank-cup-edge` amber, which no radius clears; the red alone ends at 308.5 m. The row now asserts that, without pinning the figure.

**One existing row amended, by name:** "width 24: R 11 is refused for the fold, and the tightest named is green…" (`core_sharp.test.js:74-79`, comment `AMENDED (D677)`).
- It asserted that the tightest radius has no amber except D515's two. At width 24 that radius carries `load-above-proven`, which D677 now lays.
  - checked: `sharp_branch.txt` → `+ ['load-above-proven']`.
- It now asserts no red. The rule it encoded is the one this order changed. Its name is unchanged, and still says "green".
  - inferred: the name is slightly stale; renaming is the landing pane's call.

**Touched files' tests on d80c96a:**
- `core_sharp.test.js` 12/12.
- `core_close_banks_lap.test.js` plus `app/test/core-readout-display.test.js` 121/121.
  - checked: `touched_tip.txt`
- The earlier `core_sharp` plus `close_banks` run was 83/83 (`touched_branch.txt`).

## Mutation runs on sharp.js

There was no harness naming `sharp.js` at base, so I wrote `test/core_sharp_mutation.test.js` on the `core_ramp_mutation` pattern: CONTROL, the D352 crash stand-in, and one exact string per mutant. It ran under the heavy-run lock: `heavy-run.js --run --priority belownormal`.

- **Final run, the committed harness:** **applied 11 / caught 11 / NOT APPLIED 0**, CONTROL green, stand-in reads NOT TESTED.
  - checked: `b-sharp-work/mut_branch4.txt` → tests 13, pass 13.
  - The 11 are S1–S6, S8–S11 and S14. They cover:
    - the rule itself (S1: an amber refuses again; S2: a red does not; S3 and S4: what `clear` counts; S5 and S6: what the refusal names);
    - the probe (S8: the window; S9: the width; S10: the bank; S11: full speed);
    - the smaller-than-its-ramps refusal (S14).
- **All 17 written:** applied 17, caught 11. The six survivors are left out of the harness by name, with the reason in its comment.
  - **Equivalent (2):**
    - S15, a closed loop not refused: `document.js:396` refuses `CLOSED` itself.
    - S16, R 0 accepted: `extend.js:114` refuses `BAD_TARGET` for the rate 1/0.
    - inferred: equivalent from the code, and the by-name rows stayed green.
  - **Not caught, not shown equivalent (4):**
    - S7, a fault anywhere on the probe counts: no row puts a fault on the probe's straights.
    - S12, the exit's last rate and slope not zeroed.
    - S13, the least-norm hold correction skipped. Its own comment measures 0.02° short at R 12, width 24, and the rows turn at R 22 and up.
    - S17, knot spacing 4 m, not 2.
    - S12, S13 and S17 are outside D677's change; they are gaps in the existing file, named here, not fixed.
- The first two runs (`mut_branch.txt`, `mut_branch2.txt`) are where S10 and S11 survived until row 4 existed.
- One run (`mut_branch3.txt`) never ran: it waited 30 min for a slot and gave up (exit 3).

## His tracks unmoved

**36 of 36 unmoved.** That is his 27 saved tracks (copied read-only from the app's `tracks` folder, renamed t01–t27) plus fixtures F1–F9.
- The instrument is O's `mnm.js`: it hashes `serialize(parse)`, the built path at 0.5 m and the export.
- It ran once on a clean `ceb21f5` worktree (`G:\consonance-scratch\b-sharp-base`) and once on the branch, one process each, under the lock.
- checked: `mnm_base.json` against `mnm_branch.json`, with timing fields dropped → 36 items each, 36 identical.
- inferred: as expected, because nothing on a saved track calls Sharp's gate. Sharp only decides whether a new corner is laid.

## Found, pre-existing, not changed

- **`probe` drops the right edge.** `sharp.js:97`'s `first` = `{kh, kv, phi, w, r, e, s}` has no `er`, so the probe is always symmetric.
  - A head with a different right edge (row 1's synthetic has 7° / 2°) is judged on its left edge on both sides.
  - inferred: this can move a `bank-cup-edge` or `leaves-surface` verdict on asymmetric roads. Not measured.

## Corrections

- Row 4's first assertion: "no radius free of reds" was wrong. It is 308.5 m on this build; see above.

## Code map and changelog

- `MAP.md`, the `sharp.js` line now reads: "refuses only on a red on its probe since D677, an amber is laid and shown; `tightestSharp` the tightest radius with no red".
- `CHANGELOG.md`, Unreleased ▸ Changed: an entry with the why, and how to go back.

## The falsifier this lap registered

- From the sharp-vs-rate answer, still open: it is wrong if the [T4] replay, mapped to lap distance, puts the car through any of the 36 at a speed where the check's hardest line is over 90 g, and the car held.
- This build does not test that. It acts on the answer.
