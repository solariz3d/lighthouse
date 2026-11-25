# P-SMOOTH-BANK, LAP 4: knots before refusing, the room named, a drag that does not stall (pane O, 2026-11-24)

Tiers as dispatched:
- **b and c are core, so PROVE IT.** Their rows were written first and ran red on 15b1306.
- **a** had its rows from the LAP 3 addendum.
- **d is CHECK IT:** a render, with no test.

**The branch:** `o-smooth-bank` in t180-fresh, base `15b1306`, tip **`950d982`**. It is one commit, pushed after the scan (§9).

**Not done:** nothing landed, installed or launched. Finding 1 / item e (the built road against its marks) and any internal build with the box stay **HELD**.

**Answers:** the chair's LAP 4 GO; the second reader's read, `p-smooth-bank-read2-C_2026-11-24.md` (blob 261f6142), findings 2, 3 and 5. Evidence:
`p-smooth-bank-lap4-O_2026-11-24_evidence/` (each script beside its output).

## 1. The tip

`950d982` "Flowing bank: knots before refusing, an honest room, and a drag that does not stall".

Files:
- `src/core/extend.js` and `app/core/panel.js`;
- `test/core_bank_flow_lap4.test.js` and its `.pins.json` (new);
- `test/core_bank_flow_room_search.test.js` (new, item a);
- `test/core_bank_flow_drawn.test.js` and `test/core_bank_flow.test.js` (rows brought to the knots, §7);
- `app/test/core-bank-flow-panel.test.js`;
- `CHANGELOG.md` and `MAP.md`.

What each item does:
- **a. The drag.** `opts()` passes `dragging: scrubbing`, and `extendOptions` then gives the core `roomSearch: false` for a flowing bank.
  - With that, the core asks only whether the list lays. In `extend` and in `checkBankAsBuilt` (a corner's relay), a refusal names its mark with no room in it.
  - The release asks whole.
- **b. The knots.** `flowBank` first tries a refused list again with knots added (`flowRefined`, `FLOW_REFINE_M = [10, 5, 2.5]`). They go between the marks either side of the mark first refused; every span there is split to 10 m, then 5 m, then 2.5 m. Only then does it refuse.
  - A list that lays as it is never gets knots.
  - A refusal that stands is the last try's.
- **c. The room.** `flowRoom` tries every whole metre up to `FLOW_NEAR_M = 10` first and names the least that lays. Past that it steps up by 5 m and back by the metre while it lays, as on 15b1306. The message drops "at least" (§6 says why this form).
- **d. The label.** The first mark's box reads "bank 1 at m".

## 2. The rows, red then green

On 15b1306 (the tip's five row files laid over an export of 15b1306): **33 pass, 12 fail**, in `rows_lap4_red_final.txt`. On the tip: **45 pass, 0 fail**, in `rows_lap4_green_final.txt`.

| row | what it holds | 15b1306 | 950d982 |
|---|---|---|---|
| b1 | the reader's list 21.2:4.2 40.8:20.8 56.6:-0.7 (told "+5 m") lays as drawn, through each mark | ✖ | ✔ |
| b2 | of the reader's 72 refusals at the 5 m floor, at least 48 lay, each through its marks (0.05°, flow 1's bar); the rest are refused by name | ✖ "only 0 of 72" | ✔ |
| b3 | unmoved: the banked S and every drawn list that laid on 15b1306 (88 at 5 m, 142 at 20 m), the same bytes (pinned on 15b1306) | ✔ (the guard) | ✔ |
| b4 | every list that lays only with knots is C2 at the joint | ✖ | ✔ |
| b5 | save size: a knotted list saves at most 600 bytes over the same piece with the plain bank; its knots lie between the marks either side of one mark | ✖ | ✔ |
| c1 | the reader's three over-asked lists (told +65 where +27 lays; +58 where +0.5 lays; +10 where +1 lays) lay, or are told the least whole metre | ✖ | ✔ |
| c2 | every refusal of the reader's 320 lists (5 m and 20 m floors) names a room that lays: the least whole metre where one up to 10 lays, and the metre below a farther room refused; never "at least" | ✖ | ✔ |
| room rows 2 | (item a) a refused list asked without its search is refused by name, its mark, no room | ✖ | ✔ |
| panel row 5 | a refusal reaches the panel in the core's words, the room's new wording | ✖ | ✔ |
| panel row 6 | during a drag every question carries `roomSearch: false`, and each refusal names mark 1 with no room; the release asks whole and names the room | ✖ | ✔ |
| drawn 2, 6, 7 | §7 | ✖ | ✔ |

The other room rows (1, 3, 4) pass on both: they hold that nothing changes, and on 15b1306 the option is simply ignored.

## 3. Mutants

| harness | caught | notes |
|---|---|---|
| **LAP 4, new** (`mut_lap4.js`, over the lap4, flow, room, drawn and panel files, 45 rows) | **12 of 14** | survivors below |
| LAP 3 addendum (`mut_room.js`, item a) | **9 of 9** | |
| LAP 3 panel (`mut_panel.js`) | **10 of 10** | P1 and P9 re-pointed at the panel's current lines, which gained `dragging` |
| `core_bank_flow_mutation` + `core_ramp_mutation` | **154 of 154** | after flow 8, §7 |

The two LAP 4 survivors:
- **L9, no knot kept clear of the ends:** equivalent. A knot is added only inside a span longer than its step (h ≥ 2.5), so it lands at least 1.25 m from either end anyway.
- **L6, the refusal is the first try's, not the last's:** no refusal changes. Asked bare and whole, none of the 320 drawn lists gets a different message (`l6.js`). The rule cannot be seen on these lists, and I wrote no row I could not make red.

What the first run found: L2 (knots around each try's own mark) and C5 (no step back past 10 m) survived it. So b2's bar went from 43 to 48, the count measured for choosing r.fail.k (48 against 46), and c2 gained the metre-below check. Both are caught now.

## 4. Unmoved

- **b3, as in §2:** the S is 2780 bytes and its sha256 is pinned, plus the 88 and 142 drawn lists.
- **Must-not-move: 36 of 36 the same as 513cd93**, on his saved tracks' copies, exportMs left out (`mnm_summary.txt`). extend.js has not changed since that run.
- **The C2 joint:** b4, flow 4/4b, drawn 7 and drawn 8.
- **The save size:** b5.
- **Full suite:** tests 4755, pass 4731, **fail 0**, skipped 21, todo 3 (`suite_lap4b_summary.txt`). It ran before the last edit to the lap4 file (b2's bar and the metre-below check), and that file was re-run green on its own (45 of 45 with the other four).

## 5. The drag's time per frame across a refused region

`drag_time.js`. Each frame is what the panel asks: `candidateReadout` then `candidate(…, coarse)`. Mark 1 of the reader's list 158 is dragged 45 → 125 m by 1 m, and it is refused at all 81 frames. Three passes, median kept, under the exclusive lock.

| asked | median per frame | p95 | max | 81 frames total |
|---|---|---|---|---|
| whole (before a) | 1075.5 ms | 1350.2 | 1378.6 | 85.7 s |
| `roomSearch: false` (a drag now) | **5.1 ms** | 5.9 | 7.2 | 0.42 s |

The second reader's q6 drag (its q2 list's mark 2, 45 → 125) is a different case:
- it now lays at 77 of 81 frames, because of b;
- whole: median 7.4 ms, max 39.0;
- with a drag: median 6.9 ms, max 10.1.

## 6. Item c: which form, and why

The chair offered two forms: the least, or no "at least". I took the second, plus the least within 10 m.

**Measured with each option** (`release_cost.txt`: the whole ask at the release, over the reader's refusals):

| form | median per refusal | p95 | list 158 (needs +170) |
|---|---|---|---|
| the exact least (every metre below the first 5 m step that lays) | 61 ms | 807 | **1209 ms** |
| the second form (the tip, `release_cost_tip.txt`) | 27 ms | 215 | 253 ms |
| 15b1306 | 33 ms | 193 | 223 ms |

The tip's figures are at the 5 m floor, measured on 950d982 under the lock. At the 20 m floor its median is 27 ms and its max 171.

**Why the least within 10 m:** every over-ask past 5 m the reader found had a whole metre within 10 that lays. Within 10 m the room named now is the least, and c1's three lists are told it or lay.

**What the cost buys for far rooms:** past 10 m a smaller move than the one named can lay, so "at least" is gone. A release that takes 1.2 s seemed the wrong trade for an exact far figure.

**What would change it:** if you want the exact least everywhere, it is one line (the near loop to `top`). c2 already holds the property.

## 7. Rows I changed, and why

Each change below is a deliberate change of behaviour, not a weakened check.

- **Lists swapped because b now lays them:**
  - the room rows' REFUSED lists and panel rows 5 and 6;
  - drawn 2's READER_2. Both lists now lay, and they are held to drawn's bar (`checkList`). Two drawn lists still refused now hold the refusal by name.
- **Wording, for c:** drawn 6's regex, the room rows and panel rows 5 and 6 ("at least" gone).
- **drawn 7.** After fixture F5, a road that ends rolling, a one-number transition was refused ("the joint has no free control point"). It now lays, because the knots give the joint its point (`d7.js`). The joint is **C2 to 1e-9** (value, rate, roll acceleration), and the row now asserts exactly that. Its premise ("not laid with its joint C1") stands. This is a behaviour change you may want to rule on.
- **flow 8.** Its 5 m floor check matched `'5 m'`, and under mutant R9 (no floor) the room search's own "needs 5 m after" matched it, so R9 survived. The row was verifiably too loose. It now matches `'under 5 m'`, the floor's own words.
- **b2's bar went from 43 to 48** (§3).

## 8. Concern for the chair: knotted lists roll faster

`steep.js`, over the drawn lists. The flowing bank's checks are the marks, the range and the side; it has **no roll-rate bar**, so lists that need steep roll now lay.

| lists | steepest roll on the document, median | max | built road's worst miss at a mark, median | max | > 10° |
|---|---|---|---|---|---|
| 5 m floor, laid on 15b1306 (88) | 1.32 °/m | 4.68 | 18.6° | 51.2° | 61 |
| 5 m floor, laid only with knots (48) | 3.60 °/m | **14.63** | 15.6° | 52.1° | 32 |
| 20 m floor, laid on 15b1306 (142) | 1.09 °/m | 4.08 | 13.3° | 49.8° | 81 |
| 20 m floor, laid only with knots (5) | 1.92 °/m | 3.65 | 25.4° | 39.3° | 5 |

- **An example that lays:** 60° of roll in 6 m ([[60,30],[66,-30],[72,30]]).
- **The built road misses its marks** about as often for the old lists as for the new: that is finding 1 / item e, HELD on his answer on the bar. The knots do not make it worse in the median.
- **The roll rate is the new thing.** If the bar he chooses includes a roll-rate limit, it belongs in `flowInside`'s held rows, not in the refinement. I added none: no bar was ruled.

## 9. Item d, the render

`box_B.png`: "bank 1 at m [80]" fits the 260 px column, above the rows "bank 2" and "bank 3".

## 10. A timing row on its bar (not this lap's)

D642 (`app/test/core-extra-bank-drag-cost.test.js`, the extra bank's rolling drag) asks for at most 2× and went red once in the first suite run.

| tree | runs, alone under the lock |
|---|---|
| tip | 1.99, 2.08, 2.01× |
| 15b1306 | 1.92, 2.00, 1.97× (`d642_base.txt`) |

No flowing bank is involved in that drag. It sits on its margin on both trees, and the second full suite passed it. I left it alone; it is a row to watch.

## 11. Pushed

- **Branch `o-smooth-bank` only:** `15b1306..950d982`. `git ls-remote` reads `950d982d…` at `refs/heads/o-smooth-bank`.
- **The push-gate row:** `2026-11-24T15:52:47.715Z`, seat c88002b1, `decision: allow`, scanned `G:\consonance-scratch\o-smooth-t180` → origin `o-smooth-bank`.
- **Before the push:** the 611 added lines were scanned for credentials, his words and his 45 saved tracks' names; none was found.
- **Not pushed:** nothing on main. Lighthouse main stays on HOLD.
