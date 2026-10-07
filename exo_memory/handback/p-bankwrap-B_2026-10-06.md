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
