# D540: a longer, gentler at-start swell (pane E, machine D), 2026-10-29

Tier: prove it, small. t180 branch `d540-e`, commit `60415c5`, off origin/main `82db6c3` (on v0.4.30 e41eb73). Worktree: `C:\Users\nname\Downloads\t180-wt-e540`. Not pushed.

## 1. The change

- `app/core/panel.js`: `SWELL_SPREAD` 2.6 → **3.4**, with a comment giving the user's words and the figures.
- The 20 m floor, the half-piece cap, and cup and edge at start are unchanged.
- CHANGELOG [Unreleased] has one Changed line: "The bank at start comes in over a longer, gentler swell."

## 2. His piece: before and after

His piece is 1,000 m flat, then 1,000 m with bank −41.38 at start, cup 15.5, width 31. The figures come from `S/d540/his.js`, the same script run on the same tree before and after the edit (`S/d540/before.txt`, `after.txt`).

| | before (2.6, origin/main 82db6c3) | after (3.4, 60415c5) |
|---|---|---|
| ramp | 115.3 m | **150.7 m** |
| bank at 10 m | −0.455° | −0.204° |
| bank at 20 m | −3.524° | −1.630° |
| bank at 50 m | −26.466° | −16.393° |
| checker roll peak (20 m chord) | 0.8407 °/m | **0.6522 °/m** |
| bank's own peak rate | 0.868 °/m | 0.664 °/m |
| kink (largest rate change over 2 m) | 0.07696 | **0.04529** |
| reaches −41.38 at the ramp's end | yes | yes |

Other lengths at 3.4:
- 20° → **72.9 m** (the chair's 72.8 is before the 0.1 m round-up);
- 54° → 196.7 m.

checked: `S/d535/sweep.js` (D535) gives 0.664 °/m as the worst roll over banks of 8 to 180° at 3.4.

**Is 3.4 "a little into it more"?** It is 31% longer, and it halves how steeply the rate changes.
- "A little" might be 3.0 (D535's sweep row): his ramp 133 m, kink 0.058, bank −2.36° at 20 m, worst roll 0.752.
- I took 3.4 as ordered. inferred: his words ask for both further and less steep, and 3.4 gives the clearer step.
- If his eye says it now arrives too late, 3.0 is the one-number step back.

## 3. Tests: red at 3.4 first, then amended by name (the rule changed)

`core_extend_at_start` + `core_bank_swell` at 3.4: 4 red, all of them length pins.
- `core_extend_at_start`:
  - 20° ramp `< 60` → `< 80` (72.9 m);
  - 54° `149.5–151.5` → `195.5–197.5` (196.7 m), and the row's title reads "about 197 m".
- `core_bank_swell`:
  - lean `> 0.3° by 10 m, > 2° by 20 m` → `> 0.15, > 1.2` (measured 0.204, 1.630);
  - the **flat-stretch row's bound is now a share of the ramp**, `< 6%` (was `< 5 m`). A wider bump has a flatter top in absolute terms: 6.75 m under the 0.005 °/m-per-2 m bar on the 150.7 m ramp, still one bump with no second rise. The old rounded-linear plateau was 14.5 m of 97.5 (15%), so the row still separates the two. W1 (the plateau back) is still caught.
- `core-readout-display`'s capped 50 is unchanged.

Results:
- the two files: 12/12;
- `core-readout-display` + `core-xsec`: 72/72;
- `core_cup_fixtures` 13/13, with **"0 of 9 differ"**.

## 4. Mutation

`test/core_ramp_mutation.test.js`, whole, under the lock at BelowNormal (gate.log "no timing session in any slot; taking the lock" 22:48:05Z): 57/57.
- Mutants: **applied 55 / caught 55 / NOT APPLIED 0**.
- S1, S2 and W1 are among them, all caught.
- Every anchor was checked to occur exactly once by reading the source.

## 5. Not done

- No full suite (that is the landing's job).
- No build or install (C's job).

SOURCES: S/d540/his.js, before.txt, after.txt, S/d535/sweep.js (D535), S/d540/fixtures.tap, core_ramp_mutation.tap, run.log, gate.log, t180 git log -1 (60415c5)
