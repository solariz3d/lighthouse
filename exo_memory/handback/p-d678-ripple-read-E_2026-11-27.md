# D678 track 1, pane E (D): the read of the ripple fix e112a14..c2591bf: CLEAN by what I registered, with five findings outside it

Order: the chair's D678 (2026-11-27T16:24:04Z), Track 1 of `exo_memory/loop/packet_t180_pickup_on_D_2026-11-27.md`. Tier: read and measure.
Base: `C:\Users\nname\Downloads\t180-fresh`, before **e112a14** and after **c2591bf** (`origin/l264-extend-holds-width-b`). Two detached
worktrees of my own on G: (`G:/consonance-scratch/e-d678/wt-before`, `wt-after`) and a third for the ramp variants (`wt-ramp`, restored clean
after, `git status --short` 0 lines). I wrote none of e112a14..c2591bf.

**My criteria and predictions were committed before any run:** `p-d678-ripple-read-E_2026-11-27_evidence/first_pass_E.md`, lighthouse 45f358cf
(16:30:19Z). The probe's first run started at 16:33:15Z.

Every claim below is marked **checked** (a run whose output is in the evidence folder) or **inferred** (reasoned from code or from a trend, not run).

## 1. Verdict

**CLEAN by what I registered.** None of my NOT CLEAN conditions fired:
1. No CHANGELOG sentence is contradicted inside the scope it states (§2, §3).
2. No held piece, from any caller, has a joint problem, fails to end at the head's width, level, or moves a placed piece. That holds for all 540 held rows and all 12 Finish runs (§3).
3. B's table and bend ratios re-derive exactly (§8).

**Five findings sit outside those conditions** (§5). Four are new with c2591bf:
- **F1:** Sharp lays its own 2 m hold, which bends far harder.
- **F2:** the price figures hold for a 100 m piece only.
- **F3:** "up to 30 cm" is not a ceiling.
- **F4:** the hold moves the turn of Turn and Sharp, by 2 to 32 cm at the end. I would have registered F4 had I thought of it. **It is the one I would put to the chair.**

The fifth (F5) is older than both commits: a typed width laid from a head that is still changing ends off level.

**For his eye:**
- From the driver's height, a person cannot find the 4.94× bend in the pictures, before or after. From above at true scale it is visible (§6).
- A longer ramp softens the bend about as 1/F. It costs B's 20 m bar at the first step I tried, F = 1.5 (§7).

## 2. My three L264 statements against c2591bf's words

My L264 read (`p-l264-read-E_2026-11-27.md` §2) was NOT CLEAN on three statements of the e112a14 entry. All three are answered:

**(a) "the width moves a few millimetres … (3.7 mm after that brush)".** It held for B's brush only.
- c2591bf replaces it with "about 1.5 times the head's change per metre, in metres, at about 3.6 m into the piece (on a 10 m piece about 0.75 times, at 1.8 m)".
- **Holds, checked.** Extend and the four callers that lay Extend's piece (§3): 300 held rows, factor 1.47 to 1.55, the swing at 3.55 m.
- 10 m pieces: 0.73 to 0.76 at 1.78 m (`short678.txt`).
- The swing goes the way the head was heading in every row (count 0 against, `cmp678.txt`).

**(b) "brought to rest … within the first knot span (at most 20 m)".** At e112a14 it was over 1 mm off until 88 to 96 m.
- c2591bf: "within 1 mm of the head's by 7 to 14 m into a 100 m piece, and on it from three quarters of that span on (15 m), with nothing past it after".
- **Holds, checked.**
  - over 1 mm until 5.57 to 14.35 m (before 18.9 to 98.9 m);
  - over 1e-9 until 14.9 to 15.0 m;
  - 0 rows over 1 mm past 15 m (`cmp678.txt` counts).

**(c) "7.35 cm of right width every 100 m" came from a brush the app does not run.**
- c2591bf drops it and says "The app has no right-width brush (Sculpt's brushes refuse the right width)". **Holds, checked, on both trees:**
  - the shell's default brush on `wd`: "BAD_CHANNEL: brush: mode "value" takes phi or w or …";
  - Sculpt's grab on `wd`: "BAD_CHANNEL: brush: a set takes the value channels …".
- P4 control: the same two calls on `w` are accepted (head 20.463 and 20.4409).
- Only a shell built with `brushFn: null`, which the app never builds, reaches the older sculpt. On this road it refuses `wd` for another reason: "NOT_SPLIT …".
- The bank, cup and edge figures (0.42°, 0.73° per 100 m) are the ones I measured at e112a14 in L264 (0.4196°, 0.7323). **Inferred unchanged:**
  - the hold needs the width itself still changing (`holdW … from.w.m !== 0`);
  - a bank, cup or edge brush leaves the width level;
  - checked: after the width heads, bank, cup and edges are the same on both trees (`chan678.txt`: phi ≤ 1.1e-16, c and e 0).

**The rest of the entry, checked:**
- "a level head lays exactly as before": 9 of 9 level-head rows have the same bytes on both trees, and so does Finish's level lap.
- "a typed width still goes where it is typed": the same bytes on both trees in 12 of 12, from the level head, E4 and E6, typed 22 and 20.46, over 100 and 30 m (`typed678.txt`).
- Its figures for B's heads re-derive to the digit: 1.6 mm, 30 cm (295.7 mm), 0.076 per m, 4.94× (`ramp678.txt` F 1, `p1_after.txt`).

## 3. The callers the builder's rows do not vary (checked: `d678.js` → `d678_before.json`, `d678_after.json`; `cmp678.js` → `cmp678.txt`)

**What was laid.**
- 61 heads on B's road (`plain()`):
  - a level head;
  - E1, E4, E6;
  - **Sculpt's grab near the end**, 45 heads: d ∈ {0,1,2,3,5} m before the end × r ∈ {5,10,20} × dw ∈ {+2,−2,+4};
  - **the wide brush**, 12 heads: +5 and −5 m at 25, 30, 35 m before the end, r 30 and 40. The brush widens r to 60 m whatever is asked, so r 30 and r 40 lay the same head.
- From each head, ten callers through the shell with the panel's `extendOptions`:
  - Extend;
  - Turn by 45, and Turn by −90 over 200;
  - a corner of 30 with an extra 20 from 50;
  - Sharp −60 R40 ramp 8, 90 R150 ramp 4, −60 R40 ramp 1, and 90 R22 ramp 4 (the panel's default, refused on this road: "SHARP_TOO_TIGHT …", on both trees);
  - Jump's take-off;
  - Level.
- 610 rows on each tree; 540 held, 9 level, 61 refused on both trees.

**Every held row:** joint `null`, the piece ends at the head's width with slope 0, and the placed pieces have the same hash. The count against each is 0 of 540 (§8 has the controls).

**Turn by (both), the corner list, Jump's take-off and Level lay exactly Extend's held width**, from the same head: 300 of 300 rows identical to Extend's in swing, settle and bend. This is what B inferred and I predicted (checked).

**Sharp lays its own** (checked, 180 rows). `build` passes `knotM = min(2, ramp)`, so the hold's ramp is the first knot span of a 2 m spacing: 1.9154 m on R40 ramp 8.

| Sharp, c2591bf (e112a14) | swing ÷ slope | where | over 1 mm until | largest \|w″\| per m | ÷ the brushed piece's own |
|---|---|---|---|---|---|
| −60 R40 ramp 8 | 0.18 to 0.20 (0.34 to 0.38) | 0.39 to 0.45 m | ≤ 1.70 m (≤ 14.1) | up to 4.71 (2.56) | up to 35.4 (19.2) |
| 90 R150 ramp 4 | 0.20 to 0.21 (0.46 to 0.50) | 0.40 to 0.48 m | ≤ 1.38 m (≤ 14.5) | up to 4.44 (2.51) | up to 33.4 (18.9) |
| −60 R40 ramp 1 | 0.09 to 0.11 (0.18 to 0.21) | 0.25 m | ≤ 0.72 m (≤ 7.34) | up to 7.15 (4.51) | up to 53.8 (34.0) |

- After the E4 wide brush: 28 mm at 0.42 m, w″ 0.427 per m (35× the brush's own; 7.2× Extend's 0.0595).
- After E6: 36 mm, w″ 0.547 per m (Extend's 0.076).
- **Sharp was already this sharp at e112a14:** 0.23 and 0.30 per m for E4 and E6, and it rang to 7 m. c2591bf roughly halves the swing, cuts the settle four- to eightfold (6.84 → 1.45 m after E4; 14.1 → 1.70 m at worst), and raises w″ 1.6 to 1.8×.

**Finish** (`finishToStart`, on my L264 lap of a straight, four quarter turns at R 180 and 60 m; six heads: level, E1, E4, E6, a grab +2 at the end r 10, a grab −2 at end−2 r 5).
- All 12 runs (both trees) closed, plan LSL, window [6,7,8], placed pieces the same.
- The first piece is a held piece on a 19.6 m knot span:
  - after: factor 1.46 to 1.50 at 3.48 m, over 1 mm until ≤ 13.84 m, over 1e-9 until ≤ 14.71 m;
  - before: 3.64 at 8.2 m, over 1 mm until up to 165.5 m, over 1e-9 until up to 332.8 m.
- Checked. B had inferred it.

## 4. The heads the packet named (checked, `grids678.txt`)

**Sculpt's grab near the end** (45 heads).
- The head's slope runs 0.0008 to **1.67 m per m** (+4 at end−3, r 5).
- After: swing 1.19 mm to **2.55 m** (head 20.55 m, narrowing to 18.00, back within 1 mm by 14.35 m). Before: 3.0 mm to 6.19 m.
- Factor 1.47 to 1.54. Over 1 mm until ≤ 14.3 m (before up to 98.9).
- w″ up to 0.656 per m. That is **below the grab's own bend in every case**: 0.008 to 0.83 of it (before 0.003 to 0.34).

**The wide brush** (12 heads).
- Slope 0.132 to 0.154. Swing 202 to 235 mm (before 490 to 571). Over 1 mm until 13.5 to 13.6 m (before 95.8 to 96.2).
- Bend 4.44 to **4.94×** the brush's own (before 1.80 to 2.00×).
- The 4.94 is the 30 m-before head; 25 m gives 4.64, 35 m gives 4.44.

## 5. Findings outside what I registered

**F1. Sharp's held piece is not the one the entry describes** (checked, §3).
- The swing rule, the 3.6 m, the 7 to 14 m and the price figures are Extend's.
- Sharp's hold is 1.9 m long. It swings a fifth as far, settles inside 2 m, and its edge bends 0.43 to 0.55 per m after the entry's own two heads, up to 7.15 per m after a steep grab.
- The entry's heading names Extend, so this is scope, not contradiction. The entry says nothing of Sharp.

**F2. The price sentence is the 100 m piece's** (checked, `short678.txt`). "Over those metres" ties it to the 7 to 14 m of a 100 m piece. Shorter Extends bend harder:

| piece | E4 (wide brush): w″, × own | E6 (grab): w″ | swing ÷ slope (E1, E4, E6) |
|---|---|---|---|
| 100 or 200 m | 0.0595, 4.94× | 0.0762 | 1.53 to 1.55 |
| 30 m and 15 m | 0.0789, 6.55× | 0.101 | 1.15 to 1.19 |
| 10 m | 0.117, **9.71×** | 0.150 | 0.73 to 0.76 |

- **Inferred:** 30 m and 15 m read the same because both have a first knot span of 15 m.
- The 10 m swing is stated in the entry and holds. The 15 and 30 m swing is between the two stated figures.

**F3. "Up to 30 cm after the steepest heads measured" is not a ceiling** (checked, §4).
- It is true of B's heads. Sculpt's grab near the end leaves heads 8.6× steeper, with a swing up to 2.55 m, 2.4× less than e112a14's 6.19 m.
- Every such swing is still 1.5× the slope and settled by 14.35 m. So the rule in the sentence before it holds; only the "up to" reads as a bound.

**F4. The hold moves the turn of Turn and Sharp** (checked, `chan678.txt`, `endpos678.txt`).
- The hold's extra knots are the whole piece's. Its other channels are fitted on them; the code says so (`extend.js`, "a held piece's other channels are fitted on them too").
- For a constant turn (Extend, Jump, Level) that moves nothing: kh 3.7e-10 per m, ends 0 m apart.
- For a turn that changes inside the piece, it moves the turn's shape and so where the road ends. Same head on both trees, then the same head as level on c2591bf: the end-point distances are identical (`endpos678.txt`).

| caller, after a width brush | kh moved, largest | tightest radius | where the road ends, vs e112a14 and vs a level head |
|---|---|---|---|
| Turn by 45 (100 m) | 7.0e-5 per m | 73.054 → 73.186 m | 3.3 cm |
| Turn by −90 over 200 | 1.89e-4 per m | 60.556 → 60.396 m | **31.7 cm** |
| corner 30 + extra 20 | 3.95e-5 per m | 53.185 → 53.215 m | 1.9 cm |
| Sharp −60 R40 ramp 8 | 1.48e-3 per m | 40 m | 13.9 cm (the run 0.139 m shorter) |
| Sharp 90 R150 ramp 4 | 4.06e-4 per m | 150 m | 9.0 cm |
| Sharp −60 R40 ramp 1 | 3.79e-3 per m | 40 m | 0 |
| Extend, Jump, Level | ≤ 3.7e-10 | unchanged | 0 |

- The turn still turns what was typed: 45.000005°, −90.000001°. That fits the entry's "the turn and climb keep going as they go, as their fields say". **Inferred:** so this is not a contradiction.
- What the entry does not say is that brushing the width near the end now changes the path the next Turn or Sharp lays.
- It is the same for E1's 1 mm brush as for the steepest grab: the kh moved is identical for E1, E4, E6 and the +4 grab (checked). End points were checked for E4 and E6 only. **Inferred, the cause:** the knots depend on the piece, not the slope.
- **B's hand-back §1 says "the turn moves at most 8.6e-6 per m"** (a 300 m Turn by corner of 45°). That does not bound it: 7.0e-5 to 3.8e-3 per m here (checked).
- **Recommendation:** the chair puts F4 to him. If the path must not depend on the width's state, laying the hold's knots into the width only is a code change I have not tried. **Inferred:** B ruled it out by keeping one knot vector per piece.

**F5. Older than both commits: a typed width from a still-changing head ends off level** (checked, `typed678.txt`, same bytes on both trees).
- After the wide brush, a typed 22 over 30 m ends at 21.9987 m, widening 0.0059 m per m; over 100 m, at 22.0001, 0.00057 per m. From a level head it ends exactly at 22, level.
- The entry's "The panel's own width ramps end level" is e112a14's, unchanged, and holds only from a level head.
- **Inferred:** small in practice since c2591bf, because the next Extend as shown now holds from there (a 9 mm swing). My L264 read missed it.

## 6. Pictures, at true scale (untracked: `G:/consonance-scratch/e-d678/pics/`, each with its commit burned in)

**What was rendered.**
- Two scenes, each on both trees:
  - `extend`: the E4 head, then the panel's Extend as shown over 100 m and 60 m;
  - `sharp`: the E4 head, then Sharp −60 R40 ramp 8, then Extend 60 m.
- The kn5 the export writes, read back and rendered by the repository's CPU renderer (`src/lookmatch/raster.js`), untextured. No browser and no app.
- Three views per scene and tree:
  - **driver:** eye 1.1 m over the centreline 12 m before the joint, 55° field, 1600 × 900;
  - **driver-edge:** eye 1.1 m up, 2 m in from the left edge, looking along it, the same 55°;
  - **above:** 50 px per metre on both axes.
- Plus an overlay plan drawn from the measured mesh edges: e112a14 orange, c2591bf cyan, the joint's edge carried straight in grey, 50 px per metre.

**What a driver would see: nothing a person can find, before or after** (checked: `pixdiff678.txt`, `silhouette678.txt`).
- `extend`, from the centre: the pictures differ in 500 pixels (0.035%), all on the far silhouette, which moves at most 1 px. The joint's edges are 10.8 m to each side, at the frame's edges.
- `extend`, from 2 m in from the edge: 226 pixels (0.016%); the silhouette moves at most 2 px.
- `sharp`: the silhouette's largest moves (61 and 68 px) are 3 and 10 columns where a far road sliver, about one pixel thick, comes in or out. That is the run ending 0.139 m shorter (F4), not the joint.
- **Inferred, why:** a 23 cm change spread over 13 m, 10 m to the side, seen at grazing angle from 1.1 m up, is below a pixel at this field.

**From above it is visible** (checked, the overlay plan and the `above` renders; 15,037 pixels differ, 0.63%, on `extend`).
- At e112a14 each edge pulls in about 28 cm, deepest 8.4 m past the joint, and is still visibly off 20 m on.
- At c2591bf it pulls in about 11.5 cm, deepest at 3.6 m, and is back by 14 m.
- The 4.94× is the edge turning from the brush's falloff into the hold over those first metres. **Inferred, from w″ ÷ 2 per side:** a plan curvature of 0.030 per m (a radius of about 34 m) where the brush bent the edge at 0.006 per m (about 166 m).
- On `sharp` the 28 mm swing is 1.4 px at this scale: not visible in either tree.

**Whether 4.94× is acceptable is his.** The read's answer: invisible from the seat, a visible corner in plan from above.

## 7. Would a longer ramp cost the bar? Yes (checked, `ramp678.sh` → `ramp678.txt`)

**Method.** A scratch copy of c2591bf with the one line `holdR = … startRampM(length, knotM)` multiplied by F (≤ the piece). Restored from git after; 0 files changed. B's bar (bec0f333): within 1 mm of the head's width from 20 m on.

| F | E4 swing, mm (where) | E4 over 1 mm until | E4 bend ÷ the brush's | E6 over 1 mm until | E6 bend ÷ the grab's | bar |
|---|---|---|---|---|---|---|
| 1 (c2591bf) | 230.8 (3.55 m) | 13.56 | 4.94 | 13.67 | 1.65 | met |
| 1.5 | 346.2 (5.33) | **20.61** | 3.31 | **20.76** | 1.11 | **missed** |
| 2 | 461.6 (7.10) | 27.71 | 2.49 | 27.89 | 0.83 | missed |
| 3 | 692.4 (10.65) | 42.00 | 1.66 | 42.24 | 0.56 | missed |

- The bend falls about as 1/F, and the swing and settle grow about as F. Checked for F ≤ 3.
- E1 still meets the bar up to F = 2 (17.71 m).
- **Inferred, by the same trend:** bringing the wide brush's bend down to the brush's own needs F ≈ 5, a swing of about 1.15 m and about 70 m to settle.
- Joint, end and placed pieces are as at F = 1 in every row.

## 8. Positive controls (dossier row: "never report a zero from an instrument you have not run a positive control through")

**Registered controls.**
- **P1, passed (checked).** B's own `ripple268.js` (committed in `p-l268-…-B_2026-11-27_evidence/`) gives B's table to the 0.1 mm on both trees:
  - before: −3.7 … +311.1 mm at 8.4 m;
  - after: −1.6 … +128.0 mm at 3.6 m (`p1_before.txt`, `p1_after.txt`).
- **P2, passed (checked).** My measure sees the ringing where it exists: on e112a14, E4 over 1 mm until 96.1 m (d678: up to 98.9).
- **P3, passed (checked).** Every held row records its head's slope; 540 of 540 are nonzero. The 9 level-head rows are reported apart, not counted as held.
- **P4, passed (checked).** The right-width refusals are about `wd`: the same calls on `w` are accepted (§2c).

**Each zero above, with its control** (checked, `chan678.txt`).
- **Joint problems 0:** `D.jointProblem` returns `null` for the laid joint and flags the same piece with its width raised 1 mm ("w starts at 21.601…, the previous piece ends at 21.6").
- **Placed pieces moved 0:** the hash reads a copy as the same and one control point moved 1e-9 as different.
- **Level-head bytes the same, 9 of 9:** the same hash reads all 540 held rows as different.
- **Other channels unmoved:** the same instrument reads the width moved (up to 5.58 m) and the turn (F4).
- **The pictures' "no visible difference":** the same diff finds 15,037 pixels on the view from above.

**One instrument I could not calibrate:** `leftovers.js` reads tab proxies "UNCALIBRATED (read 0, and the control made none)", before (16:36Z) and after (16:52Z). I started no browser (checked, my commands). The 0 → 0 is no evidence, and none is needed.

## 9. Corrections

- **The packet says B's `ripple268.js` and `bend268.js` "did not travel from L".** They did: 39 tracked files in `exo_memory/handback/p-l268-width-hold-ripple-B_2026-11-27_evidence/`, the two scripts among them (checked, `git ls-files`). P1 ran them.
- **B's "Sharp, Jump and Finish … inferred: they lay their pieces by `extend`"** is right for Jump and Finish. For Sharp it is right about the call but not the piece: Sharp passes its own `knotM`, so its hold is 1.9 m (F1).
- **B's "the turn moves at most 8.6e-6 per m"** does not hold beyond B's 300 m corner (F4).
- **Mine: my first heavy-run label tripped the timing gate.**
  - "E D678 probe … (read, not timing)" contains "timing" without the exempt "not a timing", so `heavy-run --status` printed "GATE: exit 1 — slot 2 names a timing session. Run nothing" from 16:33:15Z to 16:39:27Z.
  - Pane A's run started at 16:39:28Z, one second after mine ended. **Inferred:** it may have waited on my false gate.
  - My later runs say "(not a timing session)".

## 10. Evidence (text only; the pictures stay on G:)

`p-d678-ripple-read-E_2026-11-27_evidence/`:
- `first_pass_E.md`: the registration (45f358cf).
- The probe and its data: `d678.js`, `d678_before.json`, `d678_after.json`, `cmp678.js`, `cmp678.txt`, `grids678.txt`.
- The width's controls: `p1_before.txt`, `p1_after.txt`.
- Other channels and the turn: `chan678.js`, `chan678.txt`, `endpos678.js`, `endpos678.txt`.
- Typed widths and short pieces: `typed678.js`, `typed678.txt`, `short678.js`, `short678.txt`.
- The ramp variants: `ramp678.js`, `ramp678.sh`, `ramp678.txt`.
- The pictures' measures: `render678.js`, `render678.json`, `pixdiff678.js`, `pixdiff678.txt`, `silhouette678.js`, `silhouette678.txt`.
- `leftovers_before.txt`, `leftovers_after.txt`.

To re-derive:
- **Every table:** `node d678.js <tree> <out.json>` on both trees, then `node cmp678.js d678_before.json d678_after.json`.
- **The rest:** each script's header gives its usage; each takes the two trees.

## 11. Load and what is left running

- **Under heavy-run, BelowNormal:**
  - the probe (16:33:15 to 16:39:27Z);
  - P1 (before it);
  - the ramp variants and the pictures (twice; the second render added the edge view).
- **Small reads, each under a minute:** `chan678`, `endpos678` at BelowNormal. **Mine to own:** `typed678`, `short678`, `pixdiff678`, `silhouette678` and the grid summary ran at normal priority under `timeout`, not at BelowNormal as the order says.
- **No suite, build, install, merge or push of a builder branch.** His app and the game were not launched, and no browser was used.
- **One task of mine was stopped by its id:** a pixel-diff that had moved to the background. Nothing of mine is running.
- **The three worktrees on G: are left in place**, detached and clean.

NEXT: librarian route CLEAN (D678 track 1), with F4 (the hold moves the next Turn or Sharp by 2 to 32 cm) and the 4.94× pictures (§6) to him
