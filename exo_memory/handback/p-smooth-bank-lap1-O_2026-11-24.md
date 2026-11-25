# Pane O: the smooth banked turns, LAP 1 (Parts 0–3, the two AC layouts, the chart and the renders)

Seat c88002b1, 2026-11-24. Tier: PROVE IT. Plan: `exo_memory/loop/plan_t180_smooth_banked_turns_2026-11-24.md` (git-blob 565c44f1), with the librarian's
amendment to Part 1. Nothing landed on main, nothing installed, nothing launched.

## 1. Branch, tip, base

- **Branch `o-smooth-bank` on t180 (C:\Users\nname\Downloads\t180-fresh's origin), tip `513cd93` (`513cd9355d2c0eda02701f169f640127effaef08`), one commit on `3b33b38`, 8 files, +603 −3.** Worktree
  `G:\consonance-scratch\o-smooth-t180`, kept (§13).
- **Pushed: that branch only**, after the credential scan: `push-gate.jsonl` row `2026-11-24T10:57:13.899Z`, seat c88002b1, `decision: allow`, scanned
  `G:\consonance-scratch\o-smooth-t180` → origin `o-smooth-bank`. `git ls-remote` reads `513cd93…` at `refs/heads/o-smooth-bank`. Nothing else was pushed;
  lighthouse main stays on HOLD.
- **Base: main `3b33b38`, not `l217-ai-line` `102496e`.** l217-ai-line is main plus one unlanded commit (L217, the AI line's `CLEAR_UP`), touching
  `CHANGELOG.md`, `src/export/ailine.js` and two of its tests. Branching from it would put another pane's unreviewed commit into my diff and into the export
  comparison (the AI line is one of the exported files). Nothing in this lap needs it.

## 2. What was built

- `test/roll_profile.js` (Part 0, test code only): the stop instrument. It reads the bank every 0.5 m, the roll rate over a 4 m chord, and names each STOP
  (a stretch where the roll falls under half the rate the marks ask, above a 0.15 °/m floor); `turnOf` reads a turn's angle, its middle-80 % span and radius.
- `src/core/extend.js` (Part 2): `bankShape: 'flow'` with `through: { phi: [{ at, target }, …] }`, opt-in. `flowMarks` checks the marks (10 refusals by
  name); `flowBank` re-solves the piece's bank as the least-bending cubic spline (∫ φ″², Gauss 3-point, a KKT solve by `tools/piecewise.cjs` `denseSolve`)
  that passes every mark, carries the joint's bank, roll rate and roll acceleration in (C2), and holds a turning mark (the bank's PEAK) at rest. Everything without
  `'flow'` takes the old path byte for byte (§9).
- Tests: `test/roll_profile.test.js` (8 rows), `test/core_bank_flow.test.js` (17 rows + 1 todo), `test/core_bank_flow_unmoved.test.js` (4 rows),
  `test/core_bank_flow_mutation.test.js` (28 mutants + control).
- `MAP.md` (the extend.js line) and `CHANGELOG.md` (Added).

## 3. Red, then green

| file | first run | then | now |
|---|---|---|---|
| roll_profile.test.js | red: `Cannot find module './roll_profile.js'` | 5 pass, 2 fail (row 2: 0 stops read, the reference rate 0.1 under the 0.15 floor; row 7: built 20° read 8e-6° off a 1e-6 bound) | **8/8** |
| core_bank_flow.test.js | **12 fail, 1 pass**, every fail `BAD_SHAPE … got flow` (the pass is flow 10, the opt-in guard, green by design) | λ = 0: 11 pass, 2 fail (flow 5 overshoot −27.568° at 109; built 1, 9.583° off the document at 673); peak at rest: 12/1; then 14/0 + 1 todo | **17 pass, 0 fail, 1 todo** (after §10's rows) |
| flow 4b (added after the mutation run) | **red on my own code:** after F5, a road whose bank ends rolling, the joint read φ″ −7.49e-5 → 0 (`flowBank` pinned φ″ = 0 at the start: C1, not C2) | fixed: the start's φ″ row takes the lead's (0 after a flight) | **green** |
| core_bank_flow_unmoved.test.js | red on base by design (`RECORD` placeholders), its four hashes read there | — | **4/4 on the branch, the base's hashes unedited** |

Two corrections to rows, both said plainly: row 2's reference was raised to a 0→20→40° ramp read against 0.2 °/m, and it asserts the mark lies INSIDE the
stop's stretch ±2 m (a halt is a stretch, not a point); row 7's bound was loosened from 1e-6 to 1e-4 (the residual is the adapter's, 8e-6°). The plan's row 2
as written (two pieces end to end) is row **2b**, added after the module and green at its first run: it is the bug as a known answer, so green there is the
instrument agreeing, not the fix.

## 4. Part 1 under the amendment: PASSES IN ONE PIECE, so Part 4 is not owed

One piece, `extendCorner`, `turnDeg: 0` and two extra turns (`changes.turnDeg` +92 from 80, −91 from 200), bank off, no joint anywhere in the crossing:

| turn A / turn B over | turn A span, radius | turn B span, radius | bars (A ≥ 51 m, ≥ 40 m; B ≥ 41 m, ≥ 32 m) |
|---|---|---|---|
| 60 / 50 m | 29, 22.2 | 25, 19.3 | fail |
| 80 / 70 | 39, 30.4 | 35, 27.2 | fail |
| 100 / 80 | 48, 37.0 | 39, 30.7 | fail |
| **110 / 90** | **53, 41.3** | **45, 35.0** | **pass** |
| **120 / 100** (the tests' S) | **58, 44.8** | **49, 38.6** | **pass** |
| 130 / 110 | 63, 49.0 | 54, 42.5 | pass |

Angles 92.0 and −91.0 exactly. **My registered expectation was wrong in its second half:** I expected two corner pieces to reach the size and one piece
not to; one piece does. No ruling was needed, so I did not ring. The numbers he would type are the row above (piece 300 m, turn A from 80 m, turn B from 200 m).

## 5. Part 2: the falsifier fired, and the registered answer was measured and NOT taken

Row 5 (no overshoot) failed at λ = 0 on the banked S: −29.1° around a −27° mark, 2.10° over. The plan registered tension (∫ λφ′² + φ″²). Measured
(`tension_sweep.js`, doc bank, the banked S):

| peak at rest | λ | worst overshoot | roll rate peak 30/20/8 m (°/m) | roll acceleration peak (°/m²) |
|---|---|---|---|---|
| no | 0 | 2.102° | 0.598 / 0.603 / 0.607 | 0.0148 |
| no | 0.01 | 0.792° | | 0.0327 |
| no | 0.03 | 0.462° | 0.523 / 0.525 / 0.527 | 0.0460 |
| **yes** | **0** | **0.137°** | **0.677 / 0.690 / 0.699** | **0.0234** |
| yes | 0.003 | 0.251° | | 0.0332 |
| yes | 0.03 | 0.223° | | 0.0633 |

Tension cuts the overshoot only by tripling the roll acceleration it exists to keep low, and never under 0.46°. Holding the PEAK at rest (φ′ = 0 at a mark
where the marks turn back) takes it to 0.137° with no tension. **Taken: peak at rest, λ = 0** (`FLOW_PEAK_REST`, `FLOW_TENSION`). A peak at rest is not a
stop: the bank there is turning back, so its rate passes through zero anyway. The 30 m peak of 0.677 sits close to its 0.70 bar.

One deviation from the plan's text: a mark gets its own knot unless one lies within **1 m** (`FLOW_SNAP_M`), not within `KNOT_GAP_M` (5 m). The last mark's
anchor knot must always lie after the mark before it, and a 5 m snap broke that on the S.

## 6. Part 3: built as laid IN THE CROSSING; the straights are not, and the adapter was not changed

Built (adapter `toPath`) minus document, along the banked S (`built_gap.js`):

| stretch | worst built − doc |
|---|---|
| the run-in (straight, before turn A) | **3.82°** (track 360) |
| turn A's start | 3.03° (track 380) |
| turn A's peak through turn B (track 430–600) | **0.00°** |
| the ease-out (straight) | **9.58°** (track ~670: the built 26 → 0 takes ~140 m against the document's 100) |

Row 1 of Part 3 fails on the straights. Per the plan, **the adapter is NOT changed in this lap**: `bankPlan` re-rounds a bank whose roll accelerates past
`BANK_BAR` where the road does not turn, and changing it moves the built bank, and so the export, of saved tracks. The test file carries it as a `todo` row with
these numbers. The fix the plan names goes in Part 2's solve, next lap: lay on a straight what the adapter would build there. Over the crossing, where he
pointed, the flowing bank is built exactly as laid, and the as-built check accepts it (`bankCheck: 'list'` gives []; built 3 lays the whole S with the check on).

## 7. The two AC layouts (hand-over item 3), headless through the core

**`G:\consonance-scratch\o-smooth-work\ac\`**: `t180b_smooth_s_today\` and `t180b_smooth_s_flow\` (10 files each, the same route as the Export button:
`createCoreShell` → `buildExport`), with `today.t180track` and `flow.t180track` beside them. Nothing was copied into AC or into his tracks folder; that is his click.

- Both: a 300 m lead, the S in one 300 m piece (turn A +92° from 80 m, turn B −91° from 200 m), a 150 m ease-out, then a return loop closed by `close()` with
  the lead, S and ease-out protected (they move by 1e-9 at most). 3,200 m, closed, 33 m wide.
- **flow:** the bank flows through −20° (80 m), −27° (145), 0° (200), 25° (255), 26° (300).
- **today:** the same marks as a rounded first ramp and a rounded change at each mark. **Today's builder refuses these marks** with its as-built check
  (change 1 needs 83.3 m before the next mark; −27° back to 0 needs 163.7 m, and the crossing has 55). So today's layout is laid with that check stubbed in a
  local copy of `turnby.js` (`build_s.js`, `UNCHECKED`): it is the bump he would feel, not a track he could lay today.
- **A confound, measured:** the two centrelines differ by up to **0.90 m** in the S (track 592.5): `extendCorner` projects the same turn eases onto two knot
  vectors. The angles agree (92.00 / −90.99 both); turn A's span 58.5 against 57.5 m.

On the built road (what the exporter meshes), track 300–750 (`read_both.js`):

| | today | flow | bar |
|---|---|---|---|
| stops | **2** (500 m, the crossing's 0°; 555 m, the 25→26° mark) | **0** | 0 |
| roll rate peak, 30 m | 0.754 | 0.677 | 0.70 |
| 20 m | 0.844 | 0.690 | 0.89 |
| 8 m | 0.905 | 0.699 | 1.08 |
| roll acceleration peak, 1 m second difference (°/m²) | 0.0574 | 0.0234 | — |

The adapter already carries today's same-direction joint at 380 (−20 → −27), so today's built road halts twice, not four times. The halt at 500 is the one he
pointed to.

**The falsifier, carried from the plan:** if he feels a bump in "flow" where this reads no stop, the instrument is wrong, and that is the next lap before
anything is built on it.

## 8. The chart and the renders, beside his screenshot

Evidence: `p-smooth-bank-lap1-O_2026-11-24_evidence/` — `chart.html` (the bank and the 4 m roll rate, two panels on one distance axis, hover readout, light
and dark; the palette's slots 1–2, validated: both modes pass every check) and `chart_shot.png`; `renders/m0_view.png` (today), `renders/m1_view.png` (flow),
with `_top` plan views: the builder's own mesh (`buildMesh`) through the look-match rasteriser, a reading grid on the mesh's uvs, mirrored so turn A is the
right-hander his screenshot shows, camera `CAM=440,30,48,510,70` (placed by eye last lap, not fitted). Builds only: no real road is in any of them.

**What differs from his screenshot:**
- **The crossing.** In his, the road between the turns runs as one long twisting diagonal. In "today" the lower edge of the crossing kinks where the bank
  sits on its 0° shelf; in "flow" that edge is one continuous curve from turn A into turn B. The difference is small in a still picture; the chart shows
  it plainly (today's 0° shelf at 500 m; its roll rate falls to zero twice).
- **Height.** His S climbs from turn A to turn B onto a higher level; both builds are level (height was not fitted, as in the flow lap).
- **Turn A's tightness.** His turn A reads tighter against the road's width near the car than ours; ours is at the size bars measured from the real road
  last lap (span 57.5–58.5 m, radius ~45 m). Whether the difference is the camera (placed by eye) or the turn, I have not measured.
- **Surface.** His road wears the reference track's texture, kerbs and walls; ours wears a reading grid on a bare deck.

## 9. Must-not-move

**Unmoved: 36 of 36, base `3b33b38` against the branch (with the C2 fix).** `scripts/mnm.js` run by `mnm_both.js`, one process per tree, under the lock; output
`mnm2_base.json` and `mnm2_branch.json` (hashes by index; no track's name or layout).

- **The items:** his 27 saved tracks, copied to G: as t01–t27 and read there (never in his folder), and fixtures F1–F9.
- **Per item:** the sha256 of `D.serialize(D.parse(text))`; of the built path (`A.toPath` step 0.5, every sample's s, pos, T, L, U and roll as Float64);
  of every export file, through the core shell as the Export button (an open or refused track records its refusal code and the message's hash).
- **Read:** 35 serialize hashes (t27 does not parse on either tree: BAD_DOC), 34 path hashes (F9, the empty fixture, throws EMPTY on both), **110 export
  files** (11 items export), 24 identical refusals (OPEN_LOOP 23, RED 1).
- **The first pass read 11 differing exports. It was the marker file alone** (`.t180b-builder.json`, all 11), whose `written` field is the wall clock; every
  kn5, AI line, map and ini was byte-identical. The pass counted here hashes the marker with `written` replaced, and reads 0 differing.
- **The existing hash rows** (`UNMOVED` in core_bank_ramp, `GOLD` in core_bank_swell, the sha rows in core_changes): **unedited** (`git diff 3b33b38` over the
  three files is empty) and green in the suite.
- **The new rows** (`test/core_bank_flow_unmoved.test.js`): Close, Finish, `smoothRamps` and `extendCorner` without flow, each a document's sha256 read on a
  worktree of `3b33b38` from this very file (red there by design until recorded), and green on the branch.

## 10. Mutation counts

Counted from each harness's own MUTANTS table against its run (`scripts/mutcount.js <run.txt>`: the ids in the table, how many ran, how many were caught):
- **The new harness, `test/core_bank_flow_mutation.test.js` (over `src/core/extend.js`'s flowing bank): 28 of 28 mutants caught, CONTROL green.**
  Run: `mut_run3.txt`, under the lock, TMP on G:; `extend.js` is unchanged from that run to `513cd93`.
- **The existing `test/core_ramp_mutation.test.js` (over `extend.js`, `bankswing.js`, `turnby.js` and the panel), re-run on the tip `513cd93`: 106 of 106 mutants
  caught, CONTROL and the crash stand-in green** (108 tests in all). Run: `mut_ramp_tip.txt`. Its earlier run, before the C2 fix, also caught 106 of 106.

The first run of the new harness (26 mutants) left **7 survivors**, each a gap, none equivalent:
- **R8** (a backward mark not refused): the 5 m-gap check refuses it too, and its message also says "after", so flow 8's word could not tell them apart. Flow 8 now asks "must come after".
- **S1, S2** (the joint's slope not carried): the banked S's lead ends level and at rest, so m0 = 0 there. Every builder route ends a bank at rest; fixture F5 does not. **New row flow 4b** (a flowing piece on F5), which **found a real defect**: `flowBank` pinned φ″ = 0 at the start, so after a road ending rolling the joint was C1. Fixed (the lead's φ″ is carried; after a flight, 0), and flow 4c guards the flight branch (it would pass on the old code too; mutant J3 is what shows it red). Three mutants J1–J3 added for the new lines.
- **K1, K2, S6, S8** (no knot at the marks; a 10 m snap; least slope; tension 0.03): nothing bounded the roll acceleration, the quantity the solve exists to minimise. Measured on mutated copies (`mutprobe.js`): 0.0234 °/m² as built, 0.0304 (K1, K2), 0.088 (S6), 0.061 (S8). **New row flow 12:** under 0.026.

The second run then failed its CONTROL: the copied tree had no `test/fixtures`, so 4b and 4c failed on every mutant and five "catches" were void. The harness now copies F5; the third run is the one counted above.

## 11. The full suite

Two full runs on the branch (`node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`, under the lock, TMP on G:):

| run | code | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|---|
| `suite_branch.txt` | before the C2 fix and before the unmoved, 4b, 4c and 12 rows | 4671 | 4647 | **0** | 21 | 3 |
| `suite_branch2.txt` | **the committed tip's code**, every file in it | 4707 | 4681 | **2** | 21 | 3 |

**The two fails on the second run are timing rows, not the bank.** Neither passes through the flowing bank, which is opt-in, and neither row asks for it:
- `app/test/core-extra-bank-drag-cost.test.js:94` D642: the rolling drag's p95 at 2.23× the early drag, bar 2×. **Run alone on base `3b33b38` it fails
  too (2.01×); alone on the branch it passes.**
- `app/test/release-frame.test.js:121` row 1: worst frame 8.3 ms, bar 6.0, under the suite's load. **Alone on the branch it passes.**

(`timing2.js` ran the two files alone, branch then base, under the exclusive lock.) I am reporting them as read, not as green: the landing pane's suite is
the one that counts, and on this machine these two rows are load-bound on base as well.

The three todos: `app/test/aclook.test.js:219` and `app/test/core-extra-bank-drag-cost.test.js:111` (both on base), and mine,
`test/core_bank_flow.test.js` "built 1 (straight road)". Mine carries Part 3's straights (§6: run-in 3.819° at 360, ease-out 9.583° at 673).

## 12. Corrections owned in this lap

- Part 1's expectation was wrong: one piece reaches the size bars.
- Part 2's registered answer (tension) was measured and replaced by the peak at rest (§5).
- `FLOW_SNAP_M` = 1 m, not the plan's `KNOT_GAP_M` (§5).
- Part 0 row 2 first deviated from the plan's two-piece wording; row 2b is the wording as written.
- "Today" cannot be laid by today's builder with its check on; the layout says so (§7).
- **My roll accelerations were 4× too small** where I read them as `(v[i+2] − 2v[i] + v[i−2]) / 4` on 0.5 m samples: that is a 1 m second difference, h = 1. Found by the mutation probe disagreeing with the sweep; `read_both.js`, the chart's table and §7 are corrected (today 0.0574, flow 0.0234 °/m²). The sweep's figures in §5 were right.
- **`flowBank` was C1, not C2, after a road ending rolling** (§10): my own defect, found by a row the mutation run made me write.
- **A unit slip in my draft of §10:** it said the ramp harness caught "108 of 108"; 108 is its TESTS (106 mutants, the control, the crash stand-in). Caught
  by recounting from the table before this went out; §10 now counts mutants, from `mutcount.js`.
- **The push-gate fails CLOSED since D677**, not open as my notes had it; its row for this push is in §1.

## 13. Leftovers

`node consonance/tools/leftovers.js --repo C:/Users/nname/Downloads/t180-fresh --strays G:/consonance-scratch --prefix o-`, read at 10:57Z; my
`o-smooth-base` worktree was removed after that read:
- **Worktrees:** t180-fresh has 64 linked + main after the removal (65 before).
  - Mine: **`o-smooth-t180` only, kept** while the next lap reads this diff and builds Parts 4–5 on it.
  - `build_s.js` and `read_both.js` rebuild the two AC layouts from it.
  - The branch is on origin, so the worktree can go whenever asked.
- **Strays: 12 `o-*` folders on G: that are not worktrees**, all mine from this and earlier laps: o-b7-out, o-e3-out, o-fall-out, o-flow-edgeprofile,
  o-flow-figs, o-flow-local, o-flow-renders, o-his-build, o-lb-out, o-look, o-look-suite, o-smooth-work.
  - **Not deleted:** no delete without his yes.
  - `o-smooth-work` holds the two AC layouts this lap was asked to leave on G:.
- Fake roots 0, orphan browsers 0, long-running 0. Tab proxies UNCALIBRATED (0 read, control 0).

## 14. The map lines

- **`exo_memory/map/O.md`**, appended: the line dated `2026-11-24 11:0xZ`, "smooth banked turns LAP 1 …".
- **t180 `MAP.md`, the `extend.js` line (line 54)**, one sentence added before its *why*, committed in `513cd93`:
  > The FLOWING bank (`bankShape: 'flow'` with `through: { phi: [{ at, target }, …] }`, opt-in; `flowMarks` checks the marks, `flowBank` solves the bank as
  > the least-bending spline through them, a knot at each mark (`FLOW_SNAP_M`), the joint's bank, rate and roll acceleration carried (C2), a mark where the
  > bank turns back held at rest (`FLOW_PEAK_REST`)) passes the marks without halting at them; `test/roll_profile.js` is the instrument that reads a halt.

## 15. For the next lap (Part 5 and the landing, after a second pane reads the diff; Part 4 is not owed, §4)

- The diff to read: `git diff 3b33b38 513cd93` on t180 (8 files). The core change is `src/core/extend.js`, `flowMarks` and `flowBank` and the one call
  under `if (flow)`.
- Part 3's straights are open (§6): the run-in and the ease-out re-round on the built road. The plan's fix (lay on a straight what the adapter builds
  there) belongs to the solve, not to the adapter.
- The panel does not offer `'flow'` yet (Part 5). The layouts here were made headless.
- The falsifier stands: if he feels a bump in "flow" where the instrument reads no stop, the instrument is wrong.
