# L264, pane B (L): after a width brush, Extend with the width left as shown holds the width

**Order:** the chair's 10:22:58Z order, and its 10:25:11Z word (delivered 10:38:37Z) that the base is final. Packet `exo_memory/loop/packet_t180_extend_holds_width_after_brush_2026-11-27.md` (room cff4bea2), read whole. His choice (04:21) is option 1, as the packet records it verbatim; it is not quoted again here. The finding is mine, `handback/p-l258-right-width-B_2026-11-27.md` F3, "Found, not changed".

**Branch:** builder `l264-extend-holds-width-b` **e112a14** (e112a14d2b4ae377e7a09038433fd9331dc59654), one commit on **c522ea6** (`landing-1127-l263` as P left it). Checked: `git log -2`; `git show --stat`, 6 files, +194/−5.
- **Not pushed:** `git ls-remote origin refs/heads/l264-extend-holds-width-b` is empty (checked). Not merged.
- No build, install or landing.
- **Worktrees:** `<Downloads>\t180-b-l264` (the branch) and `<Downloads>\t180-b-l264-base` (detached at c522ea6, for the base runs). Both **removed** (checked: `git worktree remove`, then `ls`). The base one held only my copy of the amended row.
- **P's tier on c522ea6 ended green** (checked: P's hand-back, room 6c75a67a, §5.2: 165 of 165 plain rows, 370 of 370 harness rows, mutants 345 / 345). The chair's 10:25Z word says the same. Item 6 did not stop me.

**First line:** one rule in `extend()` for the width only, with its end pinned level.
- **B's case,** red at c522ea6, is green: three 100 m Extends after the brush each end at 20.463 m, level. Before, they ended at 20.3625, 20.262 and 20.1615.
- **The joint** is C1, and the width stays within 3.7 mm of the head's, back on it by 31 m.
- **Unchanged:** a typed width goes where it is typed, and a level head lays as before, to the byte.
- **His files:** 16 tracks and 49 undo steps save the same as on the base. The bank, cup, edges and right width are measured and unchanged.
- **The tier:** 2,236 row tests with **2 fails**: D642's timing row, which fails as often on the base, and **`drag-ghost` row 5, amended (§5)**. The 8 harnesses that name `extend.js`: 343 mutants applied and caught, 0 NOT APPLIED.
- **Found on the way** (checked): a brush is not the only thing that leaves the width changing at the head, against the packet's premise. A width ramp given to the core as one number `transition` can be ended off level by the fit, and at c522ea6 the corners after one ran the road out to **59 to 210 m wide**. The panel's own width ramps end level. Details in §5.

## 1. Where the rule goes, and why

| option | the joint | the stretch already brushed | what Extend lays after a brush |
|---|---|---|---|
| (a) the brush leaves the open end level | C1, trivially: Extend continues a level head (inferred, not built) | **changed**: the last span of every brush that reaches the head would be bent level, so a brush near the end lays another shape than now. Heads already brushed (Sculpt's piece brush, an autosave, a saved track) still carry their slope on. It also does nothing for the number-transition case of §5 | the width held, but only after brushes made after the change |
| (b1) Extend holds, the blend over the whole piece | C1 (checked: `holdprobe-fix-v1.txt`, a trial build of this variant, never committed) | untouched | the brush's narrowing runs on into the new piece: **2.6 cm** at 42 m of a 100 m piece, **10.5 cm** at 168 m of a 400 m one, growing with the piece. Without a pin, a 10 m piece ends 20.4633 with a slope of +0.00093 |
| **(b2) built: Extend brings the width to rest within the first knot span, and pins its end** | **C1** (checked below; and by construction: `roadPiece` holds the head's value and slope as the first two control points, ref 09 §1, and the document's joint check has the last word) | **untouched**: Extend never edits a placed piece | within **3.7 mm** of the head's width (the least, 20.459279 at 8.25 m), +0.27 mm at 31 m, then exact. The same on 100 m and 400 m; 10 m pieces end level, five in a row (checked, `holdprobe-fix-v2.txt`) |

**Why (b2):**
- It fixes every head where the width is still changing, whatever left it so: the brush at the head, Sculpt's piece brush on the last piece (0.000165 /m, §3), and the core's number-transition ramp (§5).
- It keeps what the slope does in new road inside the first knot span (at most 20 m, `startRampM`, the span "at start" uses).
- It uses the blend a typed width already takes (`channelFn`, bloss), so no new shape enters the core.

**The code** (`src/core/extend.js`, checked by the diff):
- **The rule:** `holdW = held && !given(targets.w) && from.w.m !== 0 ? from.w.v : undefined`. When set, the width's function is `channelFn(from.w, holdW, startRampM(length, knotM), 'w')`; every other channel is exactly as before.
- **The end pin:** beside the right width's own (D677 (b)), a held width's last two control points are the head's width. A piece with no inner knot cannot end level by the fit alone (+0.00093 /m measured).
- **The header comment** names the width as the one exception to the general rule.
- **A level head is not touched, by construction** (`from.w.m !== 0`). Taking that condition out is equivalent (§2), so a level head is the same either way; his 12 open heads show it (§4).

## 2. Red first, then green (checked)

**The rows:** `app/test/core-width-hold.test.js`, five, through the shell and the panel's own `extendOptions`.

**At c522ea6 with only `extend.js` reverted** (`git stash push -- src/core/extend.js`, my worktree): 5 rows, 3 pass, **2 fail** (`hold-red.tap`).
- **Row 1, B's case:** 19.1 brushed +1.37 at the head (s0 = end − 5, r 20), three 100 m Extends, each must end at {20.463, 0}. It fails at Extend 1.
- **Row 2, the joint,** on 100 m, 400 m and 10 m pieces:
  - the document's own `jointProblem` is null;
  - the width at the joint is the head's, and its slope within 2e-5 of the head's;
  - the width is within 5 mm of the head's everywhere and within 0.5 mm from 40 m on;
  - it ends at {v, 0}.
  - At the base it fails at 5 m: 20.457975.
- **On the fix: 5 of 5** (`hold-green.tap`).
- **Three guards, green on both:**
  - a width typed after the brush (22, and 20.46 as the field shows it) goes where it is typed;
  - a level head lays every width control point at the head's width;
  - a brush at the head of the turn, climb, bank, cup, both edges and right width goes on at the head's rate.

**The harness,** `test/core_width_hold_mutation.test.js` (built as the right-width harness is): **8 of 8**, `harnesscount.js` **applied 6 / caught 6 / NOT APPLIED 0**, control ok (`hold-harness.tap`, `hold-harness-count.txt`, under the exclusive hold, 11:17:06Z). The mutants:
- H1: never held.
- H2: the blend over the whole piece.
- H3: the end not pinned.
- H4: the blend starts level.
- H5: a typed width held instead.
- H6: the joint kinked, its second control point put at the head's width.
- **Left out, equivalent:** "a level head held too". A level head's hold target is its own width, so the piece is every control point at it. Checked: `h6check.js`, 5 of 5 rows pass on it; the reason is written in place.

**The joint, and a mutant that really kinks it** (`h-precheck.txt`):
- Making the blend start level (H4) does **not** kink the joint, because `roadPiece` holds the head's slope anyway. Row 2 catches H4 by the width's swing.
- H6 is a real kink: the document refuses the piece (JOINT), and rows 1 and 2 fail.

**Corrections, mine:**
- **Row 5's first version used a fixed slope threshold (1e-6).** A turn brush leaves −3.9e-7, so that guard was red at the base for the row's own reason. Its tolerances are now relative to each channel's slope and stored decimals, and it was run again: the figures above.
- **The tier's list of harnesses missed the new one.** `tier264.js` took the harnesses from `git grep`, which reads only tracked files, and the file was not committed yet. So it ran 7 of 8. The new harness was run on its own, under the exclusive hold: the 8 of 8 above.

## 3. The other "it keeps it" fields: measured, not changed (checked: `measure.js` → `measure-base.txt`, `measure-fix.txt`)

**Setup:** the rate brush at the head (s0 = end − 5, r 20) on a road that has each field, then three 100 m Extends with nothing typed. The two files are identical but for the three width lines.

| field (road) | brushed | the head after it | each Extend, base and branch alike |
|---|---|---|---|
| bank (plain) | +0.1 rad | 0.239118 rad, −0.000073 /m | −0.0073 rad (0.42°) every 100 m, the slope kept |
| cup (cup) | +10° | 29.949°, −0.007323 °/m | −0.73° every 100 m |
| left edge (edge) | +10° | 19.949°, −0.007323 °/m | −0.73° every 100 m |
| right edge (edge) | +10° | the same | −0.73° every 100 m |
| right width (split) | +1 m | 4.4949 m, −0.000735 /m | −7.35 cm every 100 m |
| width, the control | +1.37 m | 20.463 m, −0.001005 /m | base −10.05 cm every 100 m; branch held at 20.463 |

- **The same with Sculpt on** for the width, bank, cup and both edges. Sculpt does not offer the right width; the rate brush outside Sculpt took it.
- **Sculpt's piece brush on the whole last piece** (s0 its middle, r half its length) leaves a smaller slope:
  - width 0.000165 /m (1.65 cm per 100 m at base, held on the branch);
  - bank 0.000012 rad/m;
  - cup and both edges 0.001237 °/m.
- **Not measured:**
  - Sculpt's grab (`beginFollow`) needs the app's brush function, which the Node shell has not got. Inferred: a grab whose window reaches the head leaves a slope the same way.
  - Extend's own handles set a target, whose blend ends level (`channelFn`, S′(1) = 0). Inferred from the code: a handle leaves none.
- **The turn and climb:** a brush at the head leaves a slope, and Extend goes on at it, on the branch as before (row 5, checked).
- He has been asked about the bank; nothing here changes it.

## 4. His saved tracks (checked, from a run)

- **Copies, read only:** his tracks folder copied at 10:35:01Z (`copies.taken`): 16 tracks and 13 undo sidecars. `sha256sum -c` gave 29 of 29 against his folder.
- **The run:** `bytes264.js` puts each track and each undo step (present, past, future) through `D.serialize(D.parse(text))`, on the base and on the branch (my worktree, `extend.js` reverted, then restored). `cmp264.js` compares them (`bytes-cmp.txt`):
  - **tracks saved the same on both: 16 of 16.** Two are refused BAD_DOC on both: the old piece-builder files P's oracle names.
  - **undo steps the same on both: 49 of 49.**
  - **one Extend of 100 m at each open head lays the same piece on both: 12 of 12** (2 closed). All 12 of his open heads have a level width, so the hold fires on none of them.
  - **13 of 16 save as their own file again, byte for byte, on both.** The other three are the two refused, and one that re-saves differently from its file on the base too. That predates this.
- **Not reconciled:** P counted **121** undo steps in its 10:11Z copies; mine count **49**. Two of his 29 files were written after P's copies (one sidecar at 10:31:51Z, from their modification times), and P's counting script is not in the room. Each count is from its own run on its own copies.
- No track name is written here; files are numbered in name order. His files were never opened except as copies.

## 5. The tier, and `drag-ghost` row 5 (checked)

**The rule** (`reach.js`, `reach-l264.txt`):
- **Rows:** every test file that executes `src/core/extend.js` by L262's definition: `require()` literals starting `./` or `../`, followed transitively. That is **194 of 389**, the new row file among them.
- **Harnesses:** every mutation harness whose text names `extend.js`. That is 8: bank_flow, cup, landing_xsec, ramp, right_width, smooth_ramps (in prose only) and xsec, and the new one.

**The run:** `tier264.js` under heavy-run at BelowNormal, behind `--wait-game`. His game was running at 10:37:27Z, so it waited 9 minutes and started 10:46:07Z (`tier-heavyrun.txt`, `tier264.log`).

**Rows,** 10:46:07Z–11:03:59Z (1,072 s), `--test-concurrency=4`: tests **2,236**, pass 2,204, **fail 2**, cancelled 0, skipped 28, todo 2 (`tier-rows-totals.txt`; the 745 KB TAP stays in my scratch folder). The two fails:
1. **D642** (`core-extra-bank-drag-cost`, a timing row): 2.18× against its 2× bar. Run four times under the exclusive hold, alternately: base 2.07× and 2.64×, branch 2.02× and 2.11×. **It fails as often at c522ea6** (`d642-*.tap`), as it did at f3cd425 in L258. Not this change's.
2. **`drag-ghost` row 5:** its pinned hash of placed pieces and three corner solves moved. Read apart (`dg5probe.js`, `dg5hash.txt`):
   - **The row's 75 m piece** (width 25 typed with `transition: 30`, one number for every channel) ends at 25.1049 m **still widening, +0.0839 m per m**: the fit ends the 30 m ramp off level.
   - **At c522ea6,** the three corners after it, with no width typed, carried that on: their width ended **150.96, 58.67 and 209.69 m**. The pinned hash `e79334c4029711ec` held exactly that (checked: (a) on the base).
   - **On the branch** each corner holds 25.1049, level.
   - **With the corners' width taken out** (and wd, as before), the hash is **`eb3501a2c3eec581` on both c522ea6 and the branch**. So nothing else moved, to the byte.
   - **The row is AMENDED,** as D677 (b) amended it: pin that hash, and assert each corner holds the head's width. A comment says why, and the row's name says it. Red at c522ea6 with the amendment (6 of 7, row 5 on "each corner holds the head's width"), green on the branch 7 of 7 (`dg-base.tap`, `dg-branch.tap`).

**Where the width is left changing, besides a brush** (`slopesrc.js` → `slopesrc-base.txt`, at c522ea6; from a level head 40 m wide, width 25 typed):
- **The panel's own `extendOptions`, whole piece and "early" ticked:** end at 25, level, on 75 m and 300 m.
- **The core with a per-channel `transition: { w: 30 }`:** level.
- **The core with a number `transition: 30`:** +0.0839 /m on 75 m and −0.00003 /m on 300 m. Turn by with a number transition: −0.00003 /m.
- So in his panel only a brush (or Sculpt) leaves it; a core caller with a number transition can too. The hold catches both. This was against the packet's "only a brush leaves a slope at the head" (inferred there from the code; measured here).

**Harnesses** (tier, 7 files), 11:03:59Z–11:14:06Z (607 s), `--test-concurrency=2`: tests **349, pass 349**, fail 0. `harnesscount.js` (`tier-harness-count.txt`):

| harness | applied / caught / NOT APPLIED |
|---|---|
| bank_flow | 45 / 45 / 0 |
| cup | 48 / 48 / 0 |
| landing_xsec | 18 / 18 / 0 |
| ramp | 106 / 106 / 0 |
| right_width | 35 / 35 / 0 |
| smooth_ramps | 18 / 18 / 0 |
| xsec | 67 / 67 / 0 |

That is **337 / 337 / 0**, plus the new harness's 6 / 6 / 0 (§2): **343 in all**.
- **Every edit of every harness on `extend.js` still applies** (static, before the run): `literals.js`, 96 string literals across 39 harnesses that occurred once in c522ea6's `extend.js` still occur once (`literals-l264.txt`).
- **Not run:** the whole suite.

## 6. Left for the reader (E), from the packet's item 8

Vary what I fixed:
- a brush in the middle of the road;
- a brush on a closed lap;
- a width brushed down, not up;
- an Extend with a width typed;
- through Turn by, Sharp and Jump: their pieces come from `extend()` (inferred: they hold too; not varied here);
- the number-transition case of §5 in other shapes.

## Names and the machine

- **Privacy grep** over the builder diff's added lines (with the two new files whole): **0** (checked).
- **Names:** `namecheck258.js` → 65 terms, 1 hit, #31, the common word "road".
- **His saves:** read only from copies, never named; the copies stay in my scratch folder (not in either repo). Synthetic roads in every row and probe.
- **leftovers.js:**
  - before (10:3xZ): tab proxies UNCALIBRATED (read 0, the control made none), 0 orphan browsers, 35 linked worktrees and the main;
  - after (11:2xZ): the same: UNCALIBRATED (read 0), 0 orphan browsers, 35 linked and the main (both of mine removed; other seats' come and go).
  - No `t180-hold-mut-`, `t180-l264-h6-` or `t180-wd-mut-` folder is left in Temp (checked).
- **His game:** acs.exe was running when I queued the tier, and heavy-run waited until it closed (`--wait-game`). The light probes and row files before it ran at BelowNormal, seconds each.

**Evidence:** `p-l264-extend-holds-width-B_2026-11-27_evidence/`, 47 files (paths written `<scratch>`, `<Downloads>`, `<temp>`, `<home>`).

SOURCES: exo_memory/loop/packet_t180_extend_holds_width_after_brush_2026-11-27.md (cff4bea2); handback/p-l263-test-install-P_2026-11-27.md (6c75a67a); git log/show/ls-remote for l264-extend-holds-width-b and c522ea6; hold-red.tap, hold-green.tap, tier-rows.tap, tier-harnesses.tap, hold-harness.tap, dg-*.tap, d642-*.tap through tapfails.js and harnesscount.js; holdprobe.js, measure.js, bytes264.js, cmp264.js, h6check.js, literals.js, reach.js, dg5probe.js, dg5hash.js, slopesrc.js runs; heavy-run.js --status and --wait-game; leftovers.js
NEXT: librarian call_chair with this hand-back's path when it has read it, for E's read of l264-extend-holds-width-b c522ea6..e112a14
