# p-land-redsp: reds-p 2cd5d6c8 landed on lighthouse main, local, NOT PUSHED (pane O), 2026-11-16

Packet: the chair's D677 order of 04:32:38Z. Tier: prove it. Seat: pane O (sibling-36313935), on D.

## What landed
- **Main is now `ee18bf7b`** (local; origin unchanged; no push, per the chair).
- The merges, in `G:\consonance-scratch\lh-land-ip-o`, with main fast-forwarded to them:
  - **fdfce533**: reds-p 2cd5d6c8, P's three commits (d22ef14e, 64502750, 2cd5d6c8), on main 3698e027. It merged clean.
    - checked: `git diff --stat <base> 2cd5d6c8` → `carrier-drift.registry.json`, `state-block.js`, `state-block.test.js` only.
  - **ee18bf7b**: main 4c220d9c merged in. checked: `git diff --stat fdfce533 ee18bf7b -- . ':!exo_memory'` → empty, so it was notes only.
- **No mutation harness names either file.** checked: `grep -l "state-block.js|carrier-drift.js|carrier-drift.registry" consonance/tools/*.mutants.js consonance/hooks/*.mutants.js` → none. The proof here is each file's own suite read red before and after, plus the whole js-suite.

## THE TWO ROWS
| file | on 3698e027, before | on fdfce533 | on main ee18bf7b |
|---|---|---|---|
| `state-block.test.js` | **7 red** of 30 (`S\redsP\before-state-block.out`) | **32/32 green** (`after2-state-block.out`) | **32/32 green** (`main-state-block.out`) |
| `carrier-drift.test.js` | **3 red**, 7 CH-4 findings (`before-carrier-drift.out`) | **3 red**, 6 findings (`after-carrier-drift.out`) | **3 red**, 6 findings (`main-carrier-drift.out`) |

- **js-suite on fdfce533:** checked: `S\redsP\js-suite.out` → exit 1 in 1,122 s.
  - **198 green · 1 failed (carrier-drift) · 0 crashed · 1 canary · 1 not-run** of 201.
  - On 9808818b it was 197/2. **state-block is the row that moved.**

## carrier-drift is NOT green, and reds-p is not why
- **reds-p cleared its own finding:** `exo_memory/cards/watch-the-bearing.md` is gone from the drift list (7 → 6).
- **The six left were all added on 11-15:**
  - `exo_memory/research/open_locomotion_data_and_numbers_2026-11-15.md`
  - `open_source_procedural_animation_code_census_2026-11-15.md`
  - `path_following_with_inertia_on_a_navmesh_2026-11-15.md`
  - `procedural_animation_techniques_open_materials_2026-11-15.md`
  - `quiet_standing_and_sprint_arm_2026-11-15.md`
  - `running_foot_contact_and_foot_planting_2026-11-15.md`
  - Each is `CH4-DRIFT-ADDED`: newly instruction-reachable, and not frozen.
  - checked: `grep -l` for two of them over BOOT, SOURCE and `exo_memory/briefs/` → `exo_memory/briefs/dreamzone2_the_game.md`. The game brief points at them, and briefs are inside the depth-2 walk.
- **Not frozen by me.** The tool asks for a re-freeze "deliberately, after reading it, never as a formality": a classification of what each file teaches. That is for carrier-drift's owner (P) or the librarian to read and decide, not for a landing to do as a formality.
- **The unwelcome form, plainly:** the chair's line was "it should turn main's two js-suite reds green". **One turned green. The other cannot be turned green by reds-p,** because main kept adding reachable files after P's freeze.

## state-block is green with a margin measured in characters
- checked: `S\redsP\margin.js` (it rebuilds the wake block from `state-block.js`'s own sections and adds the full HEAD subject back):
  - **on main ee18bf7b, the unclipped block is 2,991 chars against a 3,000 cap. A HEAD subject fits whole only at 63 characters or fewer.**
  - On main before reds-p (3698e027): 3,044, so 44 over.
- **The live-HEAD row,** "a subject that fits is printed whole and unmarked" (`state-block.test.js:233`), goes red whenever HEAD's subject is longer than that.
  - checked: `git log --format=%s -20` on main → 15 of the last 20 subjects are over 63 characters (median 74, max 106).
  - inferred: the next ordinary commit to main turns state-block red again. P named 12 -> 7 "a stopgap for the cap", and this is that stopgap's measured edge.
- **CORRECTION, mine, on the way:**
  - My first merge subject (fd8c76d3) was 82 characters, and that alone kept state-block red on fdfce533's tree (the block was 6 over). I amended that local, unlanded merge to a 51-character subject. That is my own standing rule: merge subjects under 72.
  - My first rough estimate of the overrun said "about 43 characters". The exact figure was 6; the rough one subtracted the wrong part of the line.

## Not done
- **Nothing pushed.** The push of lighthouse main and the install of push-gate.js are his calls, put to him by the chair.
- **Cargo's 147,617 B librarian wake is left as named.** That is his question, with the state block.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.
