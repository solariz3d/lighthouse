# L268, pane B (L): the ripple out of the width hold, and a true CHANGELOG

**Order:** the chair's 12:52:38Z order. Packet `exo_memory/loop/packet_t180_width_hold_ripple_2026-11-27.md` (room 8f154624), read whole. E's read `handback/p-l264-read-E_2026-11-27.md` §2 and §3, read.
**BASE:** `l264-extend-holds-width-b` e112a14 (my own L264 commit). Worktree `<Downloads>\t180-b-l268` on that branch.

## REGISTERED BEFORE ANY FIX (committed before the code changes; its commit time is the registration's)

**The instrument:** `ripple268.js` (in the evidence folder).
- It builds the heads of E's table (§2 (a)) as E built them, with E's own measure (`e264.js` `measure`):
  - the app's brush through `createCoreShell`'s default `brushFn`;
  - Sculpt's grab by `beginFollow`;
  - the number-transition head of drag-ghost row 5;
  - one Extend of 100 m as shown, through the panel's `extendOptions`.
- **Checked:** on e112a14 it gives E's eight swings to the tenth of a millimetre: 3.7, 25.8, 343.5, 560.5, 204.7, 718.3, 446.9 and 311.1 mm (`try.json`; the run is repeated as the "before").

The eight rows:

| row | the head |
|---|---|
| E1 | the brush, +1.37 at end−5, r 20 |
| E2 | the brush, +1.37 at end−10 |
| E3 | the brush, +5 at end−19 |
| E4 | the brush, +5 at end−30, r 40 |
| E5 | grab, w +1.37 at end−5 |
| E6 | grab, w +2 at end−10 |
| E7 | grab, w −2 at end−20, r 30 |
| E8 | a number transition (drag-ghost row 5's head) |

**"The ripple is gone"** (the librarian's bar, made a number). On **every one of the eight rows**, the width is under 1 mm off the head's width from the ramp's end on:
- the last station (every 0.1 m of the 100 m piece) at which |w − head| > 1 mm lies **at or before R**;
- R is the hold's ramp, `startRampM(100)` = 20 m.

**Guards, each of which must also hold** (any one failing means not done):
1. **No kink:** on every row the document's own `jointProblem` is null, and the new piece's first two width control points carry the head's value and slope.
2. The new piece **ends exactly at the head's width, level**, on every row.
3. **The overshoot stays:** on every row the swing has the sign of the head's slope (past the head's width, the way it was heading) and is not zero.
4. **A level head lays e112a14's piece byte for byte** (the unbrushed road). **A typed width** (22 whole piece, 22 early, 20.46) lays e112a14's piece byte for byte.
5. **His roads do not move** (from copies). His saved tracks and undo steps save the same as on e112a14, and one Extend of 100 m at each open head lays e112a14's piece byte for byte. The pieces already laid never move.

**Measured and reported beside the bar, not judged by it:**
- the swing before and after;
- the last distance over 1 mm before and after;
- the largest |w″| (how hard the edge bends) before and after;
- the same eight heads on 10 m and 400 m pieces;
- E's whole sweep;
- a Turn by corner from the steepest head;
- **which bytes of the other channels move, and by how much as a curve:** every other channel sampled every metre, on both trees, compared.

**Stop rule (the order's item 4).** If the bar cannot be met without a kink, or the change moves any of his roads (guard 5), the code stays as e112a14 and only the CHANGELOG is done.

*(The RESULTS heading that stood here when this was registered held only a pending line; the results follow below.)*

## RESULTS (written after the fix; nothing above changed but the pending line)

**First line: the ripple is gone by the registered bar, 8 of 8 rows, and the stop rule did not fire** (checked).

**Builder:** `l264-extend-holds-width-b` **c2591bf** (c2591bf900089bbf7af5098b0017e8252b1af80d), one commit on e112a14: 6 files, +114/−27.
- **Not pushed:** `git ls-remote origin refs/heads/l264-extend-holds-width-b` is empty (checked). No build, landing or install.
- **The worktree** `<Downloads>\t180-b-l268` was removed after the commit, clean (checked).

On every one of E's eight rows:
- the held width is within 1 mm of the head's **by 6.9 to 13.6 m** (it was 19.7 to 96.6 m), within the 20 m ramp;
- the joint is smooth;
- it ends exactly at the head's width, level;
- it still goes past the head's width the way the head was heading, now **about 1.5 times** the head's slope (it was 3.7).

His roads do not move. **The price is a harder bend in the edge** near the joint (§3).

### 1. Where the rule goes, and why (the order's item 1)

**The fix** (`src/core/extend.js`, checked by the diff): the hold is **laid** as a typed width's short ramp is, not fitted.
- **The mechanism:** `rampControl(piece, 'w', from.w, holdW, holdR, held, sub)` on `RAMP_KNOTS` extra knots of its own, in its ramp. `holdR = startRampM(length, knotM)` is the first knot span, at most 20 m, and the whole piece at 20 m or less.
- **Kept knots:** the extra knots are kept beside the knots the piece would have had. `rampKnots` gains an optional `base`, so a held piece with a typed bank, cup or edge keeps its quarter knots.
- **L264's end pin is removed.** Since every control point from half the ramp on is the head's width, the last two included, `rampControl` ends the hold there itself.
  - checked (`pincheck.txt`): with the pin out, the last two control points are the head's width exactly on 8 re-laying paths, and on every case of `ripple268.js` (`after.txt` equals the run with the pin kept).
  - A two-line note stands in its place. The L264 comment above the hold is corrected to say how the hold is laid.

**Why this way** (checked, each by a mutant on the hold's rows, `precheck268.txt`):
- **(a) Fitting with more knots:** `rampControl`'s own comment says extra knots shrink the ringing but never remove it (inferred from the core's comment; not run). Mutant N1 (the hold fitted again, on the new knots) fails the bar row.
- **(b) Control points on the piece's existing knots, no knots of its own:** the width is at rest only after two knot spans, about 40 m. Mutant N2 fails the bar row.
- **(c) A longer ramp** (the whole piece): at rest only at half the piece. Mutant N5 fails the bar row.
- **What was built adds no new shape to the core.** It is the shape a typed width at start already takes, used for the head's own width.

**What each does to the joint and to the stretch already brushed:** the joint is C1 by construction in every option, because `rampControl` leaves the first two control points, which carry the head's value and slope. The brushed stretch is never touched: Extend lays a new piece only.

**Which bytes of the other channels move** (the order asked; checked, `cmp268.txt`, `dg5cmp.txt`):
- **Only in a held piece**, that is, one laid from a head whose width is still changing.
- Its other channels are fitted on the extra knots too, so **their bytes move**. Of the 110 new pieces measured, the bytes without the width are the same in 4: the level head and the three typed widths. The other 106 are all held pieces.
- **As curves**, sampled every metre:
  - the turn moves at most **8.6e-6 per m** (a Turn by corner of 45° from the steepest head);
  - in drag-ghost row 5's corners, **3.2e-5 per m** of turn, 9.3e-7 of climb and 1.8e-8 rad of bank;
  - everything else at most 1.1e-14 (float noise).
- **A typed bank beside a held width** lays at most 0.03° nearer or farther from its ideal ramp than at e112a14 (`basecheck.js`): 0.4174° → 0.3853° on 30 and 40 m pieces, 0.1720° → 0.1728° on 100 m.
  - **Without `base`** that would have been **2.25°** (checked: `base-without.txt`). That is why `base` exists and has a row and two mutants.
- **A level head** lays e112a14's piece byte for byte; so do the **typed widths** (22 whole piece, 22 early, 20.46). Checked: `cmp268.txt` EXTRA.

### 2. The bar, before and after (checked: `ripple268.js` on e112a14 → `before.txt`, on c2591bf → `after.txt`; compared by `cmp268.js` → `cmp268.txt`)

| row (E's table) | head slope (per m) | swing, mm (where) | over 1 mm until, m (bar: ≤ 20) | largest \|w″\| (per m) |
|---|---|---|---|---|
| E1 the brush, +1.37 at end−5 | −0.0010 | −3.7 (8.4) → **−1.6 (3.6)** | 19.7 → **6.9** | 1.60e-4 → 4.01e-4 |
| E2 the brush, +1.37 at end−10 | −0.0070 | −25.8 → **−10.6** | 35.8 → **10.9** | 1.11e-3 → 2.74e-3 |
| E3 the brush, +5 at end−19 | −0.0927 | −343.5 → **−141.4** | 94.9 → **13.3** | 1.48e-2 → 3.64e-2 |
| E4 the brush, +5 at end−30, r 40 | −0.1512 | −560.5 → **−230.8** | 96.1 → **13.5** | 2.41e-2 → 5.95e-2 |
| E5 grab, w +1.37 at end−5 | −0.0552 | −204.7 → **−84.3** | 93.2 → **12.9** | 8.80e-3 → 2.17e-2 |
| E6 grab, w +2 at end−10 | −0.1938 | −718.3 → **−295.7** | 96.6 → **13.6** | 3.09e-2 → 7.62e-2 |
| E7 grab, w −2 at end−20, r 30 | +0.1205 | +446.9 → **+184.0** | 95.6 → **13.4** | 1.92e-2 → 4.74e-2 |
| E8 a number transition | +0.0839 | +311.1 → **+128.0** | 94.6 → **13.2** | 1.34e-2 → 3.30e-2 |

**8 of 8 meet the bar.** The guards hold on all 8: joint null, end exactly the head's width and level, and the swing has the head's sign and is not zero (guards 1 to 3).

**Beside the bar** (reported, not judged):
- **E's whole sweep:** 80 held cases, all within 1 mm by the ramp's end. The latest "over 1 mm" was 96.1 m before and is **13.5 m** after. The swing is 3.70–3.71 × the slope before and **1.50–1.55 ×** after.
- **400 m pieces:** the same as 100 m (over 1 mm until at most 13.6 m; it was up to 129.2 m).
- **10 m pieces** (ramp 10 m): over 1 mm until at most 6.66 m (it was up to 9.77 m). The swing is about 0.75 × the slope, at 1.8 m.
- **Where it settles** (checked, `exact268.txt`): within **1e-9 m** of the head's width from **14.92–14.98 m** on (100 and 400 m pieces), and from 7.45–7.49 m on 10 m pieces. That is three quarters of the ramp.
  - It is not bit-exact: evaluating the spline sums the basis functions times equal control points, and that differs from the head's width by a few ulps. (My first reading said "exact from 99.99 m"; that measured those ulps, and was corrected.)

### 3. For his eye: the bend (checked: `bend268.js`)

**Inferred:** a shorter settle bends the edge harder. E's §3 named this trade before I built it.

The largest |w″| of the held piece against the brushed piece's own:

| tree | held piece / brushed piece |
|---|---|
| **after** | **0.13 × to 4.94 ×** |
| before (e112a14) | 0.05 × to 2.00 × |

- **The hardest is E4,** the wide +5 m brush centred 30 m before the end, radius 40: 5.95e-2 per m, against the brush's 1.20e-2. Here the hold brings back over about 15 m what the brush spread over 80.
- **After the steepest grab (E6):** 1.65 × (7.62e-2 against 4.62e-2).
- It is in the CHANGELOG, as he would read it.

### 4. The joint (the order's item 2)

- **No kink** (checked): `jointProblem` is null on every held piece measured (8 + 16 + 80 + 2).
- **The slope at the joint** is the head's to within the storage of the second control point. That is 1.5e-4 / h, where h is the first knot span: 2.5 m on a 10 m piece and 5 m on 100 m.
- **L264's row 2 asked 2e-5.** That held for the fitted hold's 10 and 20 m first spans only. On 2.5 m the two nearest storable slopes are −0.00096 and −0.00108 against −0.001005, so no stored piece can meet it.
- **AMENDED** to the rounding bound, with the reason in place. It is tighter than 2e-5 on a 20 m span (7.5e-6). The document's own joint check allows 6e-4.

### 5. The CHANGELOG (the order's item 5; checked against the runs above)

The entry now says, from the runs:
- **(a)** how far the width swings, by rule and with the range: about 1.5 × the head's change per metre, at about 3.6 m; 1.6 mm after the +1.37 m brush; up to 30 cm after the steepest head measured.
- **(b)** where it settles: within 1 mm by 7 to 14 m into a 100 m piece, and on it from three quarters of the span (15 m). The span is at most 20 m, the whole piece at 20 m or less.
- **(c)** that the app has no right-width brush. checked: the shell's rate brush and Sculpt's grab both refuse `wd`, BAD_CHANNEL. The 7.35 cm figure is gone.
- **the bend:** about five times the brush's own after the wide brush, 0.076 per m after the grab.

Corrections made while writing it, all mine:
- The span was first written "20 m on a piece of 80 m or more". checked: it is 20 m from 40 m up, 12.5–17.5 m at 25, 30, 35 and 50 m, and the whole piece at 20 m or less.
- The bend was first compared with "the earlier fitted hold", which was never released. It is now compared with the brush's own.
- `sed -i` stripped the file's CRLF; restored. The diff is the entry's lines only (12+/6−).
- The entry has no words of his and no track name (checked: privacy grep 0; names, 1 hit, the common word "road").

### 6. Rows, harness, his documents, the tier (the order's item 6)

**Red first** (checked: `hold-red.tap`, `hold-green.tap`). `app/test/core-width-hold.test.js` has three new rows:

| row | what it holds | at e112a14 | on c2591bf |
|---|---|---|---|
| **the bar** | every head of E's table is within 1 mm by the ramp's end | **red**: E2's 35.8 m | green |
| the guards | smooth joint, level end, overshoot the head's way | green | green |
| the bank's knots | a held width beside a typed bank, cup or edge on a 30–60 m piece keeps its quarter knots: within 0.5°, 0.25 and 0.35 of its quintic | green | green |

- **The file:** at e112a14, 8 tests, 7 pass, **1 fail**; on c2591bf, **8 of 8**.
- **drag-ghost row 5, AMENDED** (checked: `dg-fix.tap` 7 of 7, `dg-e112a14.tap` 6 of 7, red on the corners' pin only):
  - its three corners are held pieces, so their other channels moved;
  - the placed pieces are pinned to c522ea6's bytes, separately (24bcdf657190c0cd, the same on both trees);
  - the corners with the width out are pinned to L268's (5e302d1023e4f078);
  - the curves' movement is written in the comment.

**The hold's harness** (`test/core_width_hold_mutation.test.js`): 8 mutants on the hold's lines, applied 8 / caught 8 in the tier run. CONTROL is ok (TAP row 281) and the crash stand-in ok (282). My counter said "control not found" only by its name pattern.
- **Kept:** H1 (never held) and H5 (a typed width held).
- **New:** N1 (fitted again), N2 (no knots of its own), N3 and N6 (`base` dropped, at the call and in `rampKnots`), N4 (the joint not held: rampControl given `held` false), N5 (the ramp the whole piece).
- **LEFT OUT as equivalent, with the reason in place:**
  - L264's H2 and H4 now change only the function the fit reads, and `rampControl` overwrites every free point. Pre-check: 8 of 8 rows pass on each.
  - The level-head mutant, as at L264.
  - L264's H3 and H6 mutated the removed pin.

**His documents** (checked: fresh copies, `copies.taken`; 29 files, `sha256sum -c` 29 of 29; `bytes264.js` on e112a14 and on the fix, `bytes-cmp.txt`):
- tracks saved the same: **16 of 16** (2 refused BAD_DOC on both, as before);
- undo steps the same: **49 of 49**;
- an Extend of 100 m at each open head lays the same piece: **12 of 12**. All 12 heads are level, so the hold fires on none.
- No name is written; the file listing his file names stays in my scratch folder.

**The tier** (checked: `tier/`; under heavy-run at BelowNormal, 13:07:43Z to 13:33:19Z):
- **Run beside A's** L267 probe in the other slot (13:03Z on, `heavy-run --status`).
- **The order's tier is inside it:** the touched rows (core-width-hold, drag-ghost) and the hold's harness.
- **Added,** because a held piece's other bytes move and drag-ghost showed a file can pin them: every file that executes `extend.js` (194, L262's rule) and every harness that names it (8).
- **Rows:** 2,239 tests, 2,206 pass, **3 fail**, 28 skipped, 2 todo.
  - The 3 are `preview-lod-frame` rows 1, 2 and 4, **frame timing**: p95 68–140 ms against 6.9.
  - **Not this change** (checked: `lodtrack.js`): that file's 100 km track is the same text on both trees (325e7b9c4e42bbe1), with no piece laid from a still-changing head. The timing is the machine, beside A's run and the tier's own concurrency of 4.
- **Harnesses:** 359 tests, 359 pass. All 8: **applied 345 / caught 345 / NOT APPLIED 0** (`harness-count.txt`).
- **Statically** (`literals268.txt`): 98 literals of 39 harnesses that occurred once in e112a14's `extend.js` still occur once.
- **Not run:** the whole suite.

### For the reader (E), the packet's item 8 as before, plus

- **The bend (§3).** Read it as he would. Is five times the brush's own bend at E4 acceptable, or should the ramp be longer?
  - A longer ramp settles later. The bar is the first knot span, registered.
- **Held pieces in other callers:** Turn by measured; Sharp, Jump and Finish not varied here (inferred: they lay their pieces by `extend`).

### Machine, names

- **Privacy grep:** 0 on the builder diff's added lines and on this hand-back. **Names:** 1 hit, the common word "road".
- **His saves:** read only from copies, never named.
- **No push, no build, no install.**

SOURCES: this file's registration (bec0f333); `ripple268.js`, `cmp268.js`, `exact268.js`, `bend268.js`, `basecheck.js`, `pincheck.js`, `dg5curves.js`, `lodtrack.js`, `precheck268.sh`, `bytes264.js`/`cmp264.js` runs; `hold-red.tap`, `hold-green.tap`, `dg-*.tap`, `tier/`; `git log`/`ls-remote` for c2591bf
NEXT: librarian call_chair with this hand-back's path when it has read it, for E's read of l264-extend-holds-width-b e112a14..c2591bf
