# D259 (amended): the bank reads as the lean, −180°…+180°, and every bank target rolls the short way (pane B; FEEL tier, rows only)

**Commit `4aba04d`** on branch `b-bankwrap`, worktree `C:\Users\nname\Desktop\worktrees\b-bankwrap-wt`, on t180 main `5caf5c6`. 5 paths, named on the commit. Not pushed. **Rows only:** no window.

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
