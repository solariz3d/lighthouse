# D259: the bank keeps within one full turn, its sign kept (370 → 10, −370 → −10), shown and applied (pane B; rows only)

**Current: commit `6df24fb`** on branch `b-bankwrap`, worktree `C:\Users\nname\Desktop\worktrees\b-bankwrap-wt`, on t180 main `cc177c5`. 7 paths. Not pushed. Tests green (see "Results" at the end). **The keeper's FINAL rule** (18:24): the bank lives in (−360°, +360°) and keeps its sign, shown and applied, in the Extend field and ghost handle, Sculpt's bank handle and the bank brush. **The "Rework" and "Results" sections at the end are the current state.**

> **Superseded, kept as the record:** the sections from "What it does" down to "Rework" describe `4aba04d` (on `5caf5c6`), which built an earlier rule: the lean wrapped to −180…+180, with every target the nearest equivalent the short way. The chair ruled it out when the keeper's final rule arrived, and it never landed.

**Superseded `4aba04d`:** branch `b-bankwrap`, on t180 main `5caf5c6`. 5 paths. Not pushed. Rows only, no window.

## What it does (the keeper, 18:21: "it continues after 360 forever instead of resetting back to 0"; amended 18:22: "like say with the dragging feature")
- **The bank FIELD shows the lean wrapped to −180…+180 at all times.** `HEAD.bank` reads `HD.wrapDeg(h.phi / DEG)`, so after a full roll it reads 0 (upright).
- **A DRAGGED bank wraps too:** the handles host's `apply` writes `show(HD.wrapDeg(value))` into the field, so 350 + 20 reads 10, not 370.
- **The bank handle's label** (`handles.js format`) shows the wrapped lean.
- **Every target, typed or dragged, is the equivalent NEAREST the head's bank** (`panel.js bankTarget`: `T + 360·round((h − T)/360)`). Each piece rolls the short way:
  - a corkscrew is built piece by piece (120, then −120 continues to 240, then 0 continues to 360);
  - typing 0 after a corkscrew is "upright from here" and never unrolls;
  - as the chair amended, the "drag past ±180 rolls on" behaviour from the first version of this lap is dropped.
- **The document's winding is unchanged.** `extendOptions` still sends an absolute angle (its S1 comment and the X5 mutant's anchor `if (b !== null) targets.phi = b * DEG;` are untouched). The core and the file format are not changed, so Close (which joins the seam modulo whole turns) and existing tracks such as TEST 1 at −4π are untouched.
- **A consequence to know:** a typed 360 from upright is now no roll at all. That is the nearest equivalent, and per the amended rule a full turn is built piece by piece.

## Every line touched (for the merge with A's D258 in panel.js and handles.js)
| file | line(s) | what |
|---|---|---|
| `app/core/panel.js` | `:103` | `HEAD.bank` reads `HD.wrapDeg(h.phi / DEG)` |
| `app/core/panel.js` | `+:130-138` | `bankTarget`, under `asTyped` |
| `app/core/panel.js` | `:143` | `opts()`: `bank: bankTarget()` |
| `app/core/panel.js` | `:292` | the handles host's `apply`: a bank value is written wrapped |
| `app/core/handles.js` | `:129-131` | `format` wraps the bank label |
| `app/core/handles.js` | `+:133-134` | new `wrapDeg` |
| `app/core/handles.js` | `:261` | `module.exports` gains `wrapDeg` |

**No mutation harness anchors any of these lines** (checked by grep across `app/test/*mutation*.js` and `test/*mutation*.js` for each changed text).

## Rows, red on `5caf5c6` first
All under the lock; logs in my scratchpad `bankwrap/`. Red run `red2.out`: core-pieces-ui 23 pass / **3 fail**, core-xsec 21 / **1 fail**.

| row | on base |
|---|---|
| **"D259: a corkscrew built piece by piece (120, then −120, then 0, each the short way) rolls a full turn, and the bank field then reads 0 (upright)"**: each step lands at 120, 240, 360, and the field reads −120 then 0 | fail |
| **"D259: typing 0 after the full roll and pressing Extend adds NO roll…"**: still 360, and the new piece's φ is 360 throughout | fail |
| **"D259: dragging the bank handle from 350 past 360 WRAPS (it reads about 10, not 370), and the next piece rolls the short way"**: small drags from 350 until the field wraps; it reads 0–30, and from upright Extend rolls to exactly that, not +360 | fail |

**Amended BY NAME** (the keeper's rule replaced it): core-xsec's "xsec panel: the bank field takes 360 and −540 and reads them back (S1 iv)" is now **"xsec panel: the bank field takes any number, shows the lean wrapped to −180..+180, and a typed value is the equivalent nearest the head (D259)"**:
- no min or max on the input;
- a typed 360 from upright reads 0, with no roll;
- a typed −540 is a half turn the short way (±180).

The core's own winding rows (E's V5, and `extendOptions` with 360) are untouched and pass.

**First version of this lap:** before the chair's amendment I had built and red-run the "a drag past ±180 rolls on" version (`red.out`). That design was dropped unapplied: only the rows and the implementation of the amended rule are in the commit.

## Green on `4aba04d`, 256/256 top-level (`green.out`)

| file | passing |
|---|---|
| core-pieces-ui | 26 |
| core-xsec | 22 |
| handles | 18 |
| core-readout-display | 37 |
| core-eqonly | 31 |
| core-sculpt | 9 |
| core-shell | 28 |
| jump-ui | 4 |
| preview | 81 |

No harness run.

## Not established
- The keeper's hands: whether rolling the short way every piece is how he wants to build a corkscrew.
- **Sculpt's bank handle** (a placed piece's bank) drags by a delta of the piece's own value. Its label now reads wrapped, but its behaviour is unchanged and not re-checked in a window.
- No harness, and no real window.

## Rework: the keeper's FINAL rule, a signed wrap at ±360 (state at the BIOS-flash stop)

**Commit `ec78ea1`** ("WIP: D259: the bank keeps within one full turn, its sign kept…") on branch **`b-bankwrap`**, worktree `C:\Users\nname\Desktop\worktrees\b-bankwrap-wt`, **rebased onto main `cc177c5`** (A's D258). Clean tree. Not pushed. **It replaces `4aba04d` above, which built the superseded rule (−180…+180, nearest equivalent, short way) and never landed.**

**WIP only because its tests have NOT run.** The code is complete. My red/green hold queued twice behind the librarian's three mutation harnesses (lock pid 24664, held since 00:53Z): the first gave up after 30 min with exit 3, and the second was cut off when the session ended, also never running. Nothing of mine is running or waiting now (checked: no node process carries my run's command line).

**The rule built** (the keeper, 18:24: "same for -360 if it banks the other way ... it should reset back to 0"):
- The bank lives in (−360, +360) and **keeps its sign**: `handles.wrapTurn(x) = x % 360`, with no −0. So 370 → 10, −370 → −10, 300 stays 300, a typed 400 → 40, and 360 → 0.
- It applies to the value **shown and the value applied**, in all three places:
  - the Extend bank field (`HEAD`) and the ghost's bank handle (the host's `apply` writes it wrapped);
  - a typed value, sent wrapped and otherwise as typed (`panel bankTarget`, absolute; `extendOptions` unchanged);
  - **Sculpt's bank handle and the bank brush**, both through `coreshell brushTo`: the new `bankWithinTurn` reads the bank at the drag's centre on the drag's BASE document (`b.s0`; Sculpt passes the piece's middle). If base plus delta would pass one turn, it sends the delta that lands on the wrapped value. A drag that stays inside one turn is applied exactly as given.
- **No nearest-equivalent rewrite.** The stored winding of existing tracks is untouched; there is no core or file change.

**Rows written (each must be shown red on a `cc177c5` copy, then green, when the lock is free):**
- `core-pieces-ui`:
  - a typed 300 stays 300 and a typed 400 becomes 40, with the field showing them;
  - a ghost bank-handle drag from 350 by about +20 gives about 10, and from −350 by about −20 about −10; Extend applies what the field shows.
- `core-sculpt`:
  - Sculpt from 350 by +20 gives 10, from −350 by −20 gives −10, and 300 stays 300; the handle label reads 10, −10, 300, 0;
  - a bank brush by 370 gives 10, by 300 gives 300, by −370 gives −10, at its centre.
- `core-xsec`: the S1 iv row amended BY NAME again, to "the bank field takes any number and keeps it within one turn, its sign kept: 360 is 0 and −540 is −180 (D259)".

**Lines touched against `cc177c5`** (an 80-insertion / 11-deletion diff):

| file | change |
|---|---|
| `app/core/panel.js` | `HEAD.bank`; `bankTarget`, after `asTyped`; `opts()`; the handles host's `apply` |
| `app/core/handles.js` | `format`; new `wrapTurn`; exports |
| `app/core/coreshell.js` | new `bankWithinTurn`, after `pieceOffsets`; the head of `brushTo` |
| `CHANGELOG.md` | the D259 entry, rewritten for the final rule |
| tests | the three files above |

**The rebase:** one conflict, on `handles.js`'s exports line (A's `LANDING_ORDER` and my `wrapTurn`); both kept. My resolution had switched the file to CRLF while the base stores LF, so I set the endings back; the diff is now the true 8 lines for that file.

**To finish, after the flash, under one hold** (my steps file `bankwrap/stepsfinal.json`):
1. the reds, in my scratch worktree `C:\Users\nname\Desktop\worktrees\b-bankred-wt` (detached at `cc177c5`, holding uncommitted COPIES of the three test files, nothing else);
2. the greens on `b-bankwrap`: core-pieces-ui, core-xsec, core-sculpt, handles, core-readout-display, core-eqonly, core-shell, jump-ui, preview, core-close-preview.

Then drop the "WIP:" from the subject and hand back the numbers here. A note to keep: the label assertion in the Sculpt row would already pass on a tree carrying `format`'s change; its red comes from the drag and brush parts.

**My slip:** before the final rule arrived I ran a `git stash push` on files that were already committed, which saved nothing, with a queued `git stash pop` after it. The stash list is shared across this repo's worktrees, so the pop could have applied another seat's stash. I checked: the list was empty, and I stopped that run before the pop ran. Nothing was applied.

## Results: resumed after the BIOS flash, tests run, "WIP" dropped

**Commit `6df24fb`** (it replaces `ec78ea1`: the same code, the corrected Sculpt and brush rows, "WIP:" dropped) on `b-bankwrap`, on `cc177c5`. Not pushed. 7 paths, an 85 / 11 diff against `cc177c5`.

**One heavy-run hold** for the reds and greens (`bankwrap/final3.out` in my scratchpad), with `CONSONANCE_HEAVY_WAIT_MS` raised to 2 h so it could queue. The two `core-sculpt` rows were then corrected, and that file was run again red and green under a second hold (`bankwrap/sculpt.out`).

**Reds on a `cc177c5` copy** (`b-bankred-wt`, detached at `cc177c5`, with uncommitted copies of my three test files): **all 5 new rows fail.**

| file | on the base |
|---|---|
| core-pieces-ui | 25 pass / **2 fail**: the typed 300/400 row and the ghost drag 350/−350 row |
| core-xsec | 21 / **1 fail**: the S1 iv row as amended |
| core-sculpt | 9 / **2 fail**: Sculpt 348.26 by +20 → **368.16**; a brush by 370 → **364.45** (both past one turn) |

**Greens on `6df24fb`: 268 / 268 top-level.**

| file | passing |
|---|---|
| core-pieces-ui | 27 |
| core-xsec | 22 |
| core-sculpt | 11 |
| handles | 19 |
| core-readout-display | 37 |
| core-eqonly | 31 |
| core-shell | 28 |
| jump-ui | 5 |
| preview | 81 |
| core-close-preview | 7 |

No harness, per the packet.

**A correction to my own rows, made in this run.** The first green run had the two `core-sculpt` rows failing on my branch too, at 348.26 (asked 350) and 9.85 (asked 10). The cause was not the rule: the brush fits its change into the piece's control points, so its centre does not land exactly on the asked value. Its gain there is **0.985 (brush, piece 0) to 0.995 (Sculpt, piece 2), measured on both trees.** My rows had asserted equality to within 1e-6.

They now check the **rule**, within 3% of the change sent: the bank stays within one turn, keeps its sign, and comes out near `wrapTurn(b0 + delta)`, where `b0` is the bank as actually read under the drag. The first red on the base was therefore not meaningful for the Sculpt row, which failed at its first step rather than at the wrap. I re-ran it, and it now fails for the right reason (368.16 past a turn).

**Not established:**
- The keeper's hands: whether wrapping back from 0 past a full turn feels right while dragging.
- No real window.
- No harness. The touched lines are listed in the Rework section above; `coreshell.brushTo`'s head and the new `bankWithinTurn` are what a harness run should cover at install.

## X6 (2026-10-07 04:0x, the chair's follow-up; test-only)

- **The miss was a stale name.** The librarian's core-xsec harness on v0.3.1 (`b33bac5`) read 30/31. X6's `caughtBy` at `app/test/core-xsec-mutation.test.js:19` still read `'xsec panel: the bank field takes 360'`. D259 had renamed that row (`app/test/core-xsec.test.js:270`) to `'xsec panel: the bank field takes any number and keeps it within one turn, its sign kept: 360 is 0 and -540 is -180 (D259)'`. The harness matches a failed test's line by substring (`failed.some((l) => l.includes(m.caughtBy))`, :65), so the mutant was caught but counted as a miss.
- **Fix:** commit **`e850c45`** on branch `b-x6name`, on `b33bac5` (worktree `C:\Users\nname\Desktop\worktrees\b-x6-wt`), not pushed. One line: X6's `caughtBy` is now the renamed row's stable prefix, `'xsec panel: the bank field takes any number'`, with a `CHANGED D259` comment. The prefix occurs once in `core-xsec.test.js`.
- **Harness, run once under the lock:** `node --test app/test/core-xsec-mutation.test.js` on `e850c45` gave **31 tests, 31 pass, 0 fail** (control included), 20.2 s. The harness's own line reads: "mutation X6 (KS1-2) max="180" on the bank input: applied, and caught by "xsec panel: the bank field takes any number…"". Log: my scratchpad `x6/harness.out`.
