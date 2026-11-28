# L271, pane C (L): a second-seat read of the grab along the slope, `l271-grab-slope` cc4fa71 (c522ea6..cc4fa71)

Seat: pane C (sibling-0845a868, L). This answers the chair's L271 read (sent 2026-11-28T08:46:20Z). I wrote none of it. Before this section was committed
I had read the packet's "Role 2" (`loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md:45-63`) and B's record
(`handback/p-l271-grab-slope-B_2026-11-28.md`, whole). I had not read the diff.
**My stake:** none in the grab. Last lap I read the N4a merge's files and page (L270 role 2), the same way this read looks at the page.

## 1. Registered before the diff (committed before I open `git diff c522ea6 cc4fa71`)

**The default is NOT CLEAN.** CLEAN needs every condition below.

| # | condition for CLEAN | what makes it NOT CLEAN |
|---|---|---|
| C1 | the delta is the 4 files B names; in `zonegrab.js` only `follow` changes, by the lines B quotes (and a comment) | any other change to code |
| C2 | **B's claim 1, with a control:** on a flat road with no cup, my own cases (my construction, not B's probe) give the same saved text (sha256 of `serialize`) on cc4fa71 as on c522ea6 in every case. **The control:** the same comparison shows a difference where one is expected (a pull pressed inside the rim of a cupped road, B's R2), so it can see one | any flat no-cup case differs; or the control shows no difference (then the comparison is blind and the 37 of 37 is not checked) |
| C3 | **B's claim 2, with a control:** on a banked turn a horizontal pull leaves the bank within 0.01° of the bank before the grab, every 1 m over the grab's window. **The control:** today's (c522ea6) pull turns it, by about 5° (B and D: 4.9984°) | over 0.01° anywhere; or today's turns it by under 1° (then the case does not exercise the change) |
| C4 | **lifts unchanged:** a straight lift (vertical only) gives today's follow, every channel within 1e-9, on every road I build (flat, cupped, banked, edge piece, tube, half-pipe) | any channel off by over 1e-9 |
| C5 | **the untested three** (an edge piece, a tube, a half-pipe's wall): on each, a horizontal pull and a lift both run, with finite values, and with no refusal today does not also give. I say what the bank, the width and the middle do, today against the branch, and whether it is new behaviour. **On each, the branch's pull turns the bank by no more than today's does** (the change exists to keep the bank) | a throw, NaN, or a refusal only on the branch; or the branch's pull turns the bank MORE than today's on any of the three |
| C6 | **core-pieces-ui row 25, amended by name:** the amendment is true to the mechanism when (a) its expected point is read from the road's own surface, not from `follow`; (b) it is red under c522ea6's `follow`; (c) it is red under a mutant that breaks the slope (the pull whole across, B's M2) and under D's literal form; (d) its tolerance is no looser than the row's old one | (a) false, or any of (b)–(d) passes where it should fail: then the amendment suits the code |
| C7 | the touched rows are green on cc4fa71 (`zonegrab`, `core-pieces-ui`, `handles`) | any `not ok` or cancelled |
| C8 | the CHANGELOG entry states nothing a run of mine contradicts | a contradicted figure or rule |

**Unwelcome outcomes, in words that would make them true:**
- "on an edge piece the slope grab tips the road where today's did not";
- "row 25 was amended to pass, and it would pass a grab that ignores the slope";
- "a flat road is not the same".

Any of these is NOT CLEAN. The answer may also be "do not build this". For him, the point that weighs most is the one B already names: on a bank the edge
leaves the cursor.

*From here on, results. The registration above was committed at 8f2376f2 (08:46:55Z) before I opened the diff.*

## 2. Verdict

**NOT CLEAN, by one registered condition (C6), and on a test, not on the code.** Amended row 25 of `core-pieces-ui` passes under a grab that moves the
point by the whole horizontal pull across (mutant M2), which my C6(c) named as the case it must catch. Every other condition holds.
- The code does what B says it does, on the roads B tried and on the three B did not.
- On a pull the bank stays at 0.0000° everywhere I looked. A flat road with no cup is the same text.
- **I see no reason in the code not to build this.** Whether to build it is his call from the pictures: on a bank the edge leaves the cursor, by up to
  2.83 m on a 4 m pull at 45°.

## 3. The conditions, scored

| # | result | |
|---|---|---|
| C1 the delta | 4 files, +72 −10. In `zonegrab.js` only `follow` changes: `const cx = v0[0] / n0, cy = v0[1] / n0;` added, and the `v1` line now `[v0[0] + e * cx * cx, v0[1] + e * cx * cy + v]` (was `[v0[0] + e, v0[1] + v]`), plus a five-line comment. The rest are 2 test files and the CHANGELOG | **holds** |
| C2 flat, no cup, with a control | **120 of 120** the same saved text (sha256). My roads, not B's: straight 32 m, a 150 m-radius turn, a 12 m road; presses at u ±1, ±0.95, ±0.5, 0.25, −1.2; out 3, in 2, lift 1.5, sink 1, a diagonal. **The control** (a 30° cup, pressed inside the rim) differs in 9 of 15: every pull and diagonal, as B's R2 predicts. The comparison can see a difference | **holds** |
| C3 the bank on a pull, with a control | over the window every 1 m: **0°** in all 66 banked cases on the branch (±20°, ±45°, straight and turning, u 1, −1, 0.95, 0.5, out 4 and in 2, and B's B− and B+ T1). **Today: up to 6.0183°.** B's T1: today 4.9984°, branch 0 | **holds** |
| C4 lifts unchanged | every lift and sink in every group, 241 cases (48 + 6 + 64 + 48 + 48 + 27): **follow identical (difference 0), saved text identical**. inferred, from the code: this holds by construction, because a vertical drag has no part along R (R is horizontal and square to T), so e = 0 and the new line reduces to the old one | **holds** |
| C5 the untested three | 400 cases (an edge piece four ways, a tube three ways, a half-pipe's wall three ways; 8 presses × 5 gestures): **0 errors, 0 non-finite, no refusal on either tree.** A pull out or in turns the bank by **0** on the branch, against up to 2.92° (edge), 7.61° (tube) and 2.32° (half-pipe) today. Section 4 has what each does | **holds** (the diagonal, said in 4.4) |
| **C6 row 25** | (a) holds: the expected point is read from the road (`acrossAt` for both rims, the frame's R and U0), not from `follow`, **but it is the same arithmetic as `follow`'s new line** (e·cx² along R, e·cx·cy + v along U0). (b) holds: red under c522ea6's line. (d) holds: the tolerance is 0.01 m, as before. **(c) fails: under M2 (the pull whole across, the rise kept) row 25 passes, 2 of 2.** Under M1, M5, M6 (half the move), M7 (down the slope), M8 (10% long) and D's literal form it is red | **FIRES** |
| C7 the touched rows | `zonegrab`, `core-pieces-ui` and `handles` whole on cc4fa71: **tests 139, pass 139, fail 0, cancelled 0, skipped 0** (`evidence/touched.tap`) | **holds** |
| C8 the CHANGELOG | every figure it states reproduces in my run (4.5). One nit: "0.57 m short of the pointer and 1.45 m above it" is the pull up the bank only. Pulled down the bank (B+) it is 0.44 m short and **1.09 m below** | **holds**, one nit |

checked:
- `evidence/c271.js` on both trees through heavy-run at BelowNormal (08:51:22Z–08:52:08Z), 631 cases each, 0 errors (`evidence/probe.log`).
- `evidence/cmp271.js` → `evidence/cmp271.txt`; the figures in `evidence/detail.json`; the raw outputs in `evidence/today.json.gz` and `evidence/branch.json.gz`.
- Row 25 and the mutants: `evidence/mut271.js` → `evidence/mut271.json` (through heavy-run, ending 08:51:21Z).
  - Each mutant is one exact replacement of the `v1` line: applied 8 / NOT APPLIED 0.
  - After each, the file was restored; the sha256 after equals the original's.

### 3.1 Row 25, in full (the chair's item 4)

| mutant on `follow`'s line | row 25 | zonegrab rows red |
|---|---|---|
| BASE c522ea6 (the drag whole) | **red** | 4 (14l, 14h, 14j, 14o) |
| M1 no rise along the slope | red | 4 |
| **M2 the pull whole across (rise kept)** | **green** | 4 (14l, 14h, 14j, 14o) |
| M5 the share not squared | red | 5 |
| M6 half the slope move | red | 5 |
| M7 down the slope instead of up | red | 4 |
| M8 the slope move 10% long | red | 5 |
| D's literal form | red | 7 |

**Is the amendment true to the mechanism, or did it suit the code?**
- It is **true to the mechanism in what it reads**: both rims and the frame come from the built road, and the bar is unchanged.
- It is **weak in what it can tell apart.** On row 25's road (cupped, the press at −0.95) the chord's slope is small, so the share across (e·cx²) is
  within 1 cm of the whole pull (e). The row therefore pins the rise along the slope, which M1 and M7 break, but not the share across, which M2 breaks.
  - inferred: with a slope of a few degrees, e·cy² is millimetres for a pull of a few metres.
- **No mutant on the line survives the whole touched set.** M2 is red in zonegrab 14l, 14h, 14j and 14o. So the mechanism is pinned in the suite; row 25
  alone does not pin it.
- The row's title still reads "the pressed point follows the pointer", and its rim half no longer means that. Nit.
- **What would close C6** is B's to choose. Options:
  - a press further from the rim on row 25's cupped road, or a banked road for its rim half, so that the share across shows;
  - or say in the amendment's comment that the rise is pinned here and the share across is pinned in zonegrab 14l, 14h, 14j and 14o.

## 4. The untested three, and what the bank, the width and the middle do (the chair's item 2)

All three run through the same `follow`: the slope grab acts on the chord from the far rim to the pressed point.
- Where that chord is level, every gesture is today's, to the byte. That covers a rim press on a symmetric edge, a tube and a half-pipe, on flat road.
- Where the chord slopes, a pull runs along it.

From `evidence/c5_out3.txt` (a 3 m pull out; "dh" is the middle's height and "dl" its sideways move, at the press):

### 4.1 An edge piece (rims at different heights: e 30° and er 0°, or e 0° and er 40°)

- **On flat road the chord is not level:** 2.55° (e 30/er 0) and 4.66° (e 0/er 40) at the rims, up to 9.32° pressed at u 0.5.
- **Today** a pull tips the road: up to 0.41° at the rim and 1.07° at u 0.5.
- **The branch** leaves the bank at 0. The width grows the same to within 6 mm. The middle follows the slope: at the low rim of e 0/er 40 it drops
  0.39 m (today 0.28). At the high rim it drops 0.15 m.
- **This is new behaviour on a flat road.** On an edge piece "a flat road is the same" is no longer true for a press at the rim, because the rims are
  not level. B's CHANGELOG line "on a flat road nothing changes ... for a press on the edge" is about a cup, and it is right for a cup. An asymmetric
  edge is the case it does not cover. Nit: say it.
- With a 20° bank: today −1.94°, the branch 0. The pulled rim rides 1.06 m up and 0.44 m in from the pointer.

### 4.2 A tube (t 200° and 300°)

- **At the tube's tips** (u ±1) the chord is level on flat road, so every gesture is today's.
- **Pressed partway round** (u 0.7, 0.5) the chord slopes 15° to 37.5°.
  - Today the pull turns the bank by up to **7.61°** (t 300, u 0.5).
  - The branch: 0.
  - The width grows less on the branch: 6.74 m against 7.09 m.
  - The middle moves much less sideways: 0.64 m against 2.49 m, and sinks more (2.40 m against 1.91 m).
  - The pressed point ends **1.11 m short and 1.45 m below** the pointer.
- So **on a tube's side wall a horizontal pull now slides the tube down the wall's own slope** rather than rolling it. That is new behaviour, the largest
  of the three.

### 4.3 A half-pipe's wall (r 0.3 and 0.6)

- **On flat road** the chord is nearly level even partway up (0.7° to 2.4°). The branch is within 1 cm of today in width and middle, with the bank at 0
  where today gives 0.07° to 0.27°. **Nearly no change.**
- **With a 20° bank**, today −1.69° to −2.06°, the branch 0. The middle rises 0.43 to 0.57 m where today it drops 0.04 to 0.06 m. The pressed point
  ends about 1 m above the pointer.

### 4.4 The diagonal, said plainly

- **What happens.** A drag that pulls 2 m out and lifts 1 m at once turns the bank **more** on the branch than today in 15 of the 80 diagonal cases on the three, all
  where the chord slopes. Examples: a banked tube's rim, today 0.72° and the branch 2.65°; a banked half-pipe's rim, 0.43° against 1.57°.
- **Why**, checked (`evidence/diag271.js` → `evidence/diag.log`, both trees):
  - In all 15, the branch's diagonal turns the bank **less** than the same 1 m lift alone. For example 2.6533° against 2.9239°, and 1.5746° against 1.6662°.
  - Today's pull alone turns the bank **the other way**, by 0.10° to 1.97° against the lift. On the branch the same pull turns it 0.
  - So the extra bank on the branch is the lift's own. Today's pull was partly cancelling it.
- **For him.** On a banked road, a hand that rises as it pulls out now gets the lift's bank change whole, where today the pull ate some of it. B's page
  run found the same thing from the screen: D's pull, 7 px up, banked the road −1.76° on the branch.
- **Under my C5 this holds:** the pull turns nothing; the bank change is the lift's.

### 4.5 Everything the CHANGELOG states, reproduced (C8; `evidence/detail.json` "fixtures" and "control")

| CHANGELOG | my run |
|---|---|
| a 4 m pull out on a 20° turn left it 5.0° flatter | today 4.9984°, branch 0 (B− and B+, T1) |
| 0.0000° after one pull ... on three banked turns | one pull on B− and B+ (and 64 of my own cases): 0. **Eight pulls and Bhold: not run by me** |
| about 0.57 m short of the pointer and 1.45 m above it, where today's grab ends it 0.20 m off | B−: 0.5693 across, 1.4519 up; today 0.0874 and 0.1762 (0.197 m). On B+: 0.4387 across, **−1.093** (below) |
| the middle up 0.43 m up the bank, down 0.86 m down it (today it drops 0.24 m) | +0.4306, −0.855, −0.2403 |
| the road widens 3.80 m for the 4 m pull, against 3.86 m today | 3.7956, 3.8559 |
| a press inside the edge of a cupped road: today 0.08° at 95% of the way out, about 1.1° halfway; no tip now | F: today −0.077° and −1.0865°, branch 0 |
| a press on the edge of a flat road, with or without a cup, nothing changes | F at u −1: identical figures; my flat roads 120 of 120 |

## 5. For him (not for the build)

- On a bank the grabbed edge leaves the cursor, by about the pull × sin(bank): **1.45 m above** at 20° on a 4 m pull, and **2.83 m** at 45°.
- On a tube's side wall a sideways pull slides the tube down its own wall, and the point ends well below the pointer (1.45 m at t 300).
- Lifting while pulling now banks a banked road by the lift's whole amount (4.4).
- B's pictures show the banked turn. None shows a tube or an edge piece. inferred: one picture of a tube's wall pulled sideways would show him the
  largest change before he decides.

## 6. Corrections, mine

- I ran my colour-code cleanup `sed` over every evidence file, the two `.gz` files included, which could have changed their bytes. I regenerated both and
  checked them against their sources (`gzip -dc | cmp`): identical.
- The comparison first flagged 15 diagonal cases as "the branch turns MORE". I did not count them either as the C5 trigger or as clean until the
  decomposition was run (4.4). Said here so the order is visible.
- Before committing I checked my own figures against the outputs. Two counts were wrong in the draft: the lifts were "159 cases" (they are 241) and
  the diagonals "15 of 96" (15 of the 80 on the three roads). Today's counter-turn range was "−0.15°" (it is 0.10° at the least). All three are fixed above.

## 7. The machine

- **Worktrees:** `C:\Consonance\t180-wt-c-l271` (cc4fa71) and `-base` (c522ea6), both detached. They are removed after a clean status check (the ring says so).
- **Runs:** three heavy-run jobs, all at BelowNormal from the scratch folder, so heavy-run ran them one after another: the mutants with the touched rows,
  the probe, and the diagonal check. No `--timing`, no `--exclusive`. Nothing ran outside heavy-run, except `node --check` and the reading of JSON.
- No picture was taken, no headless browser was opened, his folder was not read, and nothing was pushed, merged or built.

BASE: C:\Users\zackn\Downloads\t180-track-builder cc4fa71
BASE: C:\Consonance\lighthouse b135a75f

SOURCES: loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md :45-63; handback/p-l271-grab-slope-B_2026-11-28.md (whole); git diff c522ea6 cc4fa71; app/core/zonegrab.js follow;
app/test/zonegrab.test.js (helpers, 14e-14p); app/test/core-pieces-ui.test.js row 25; evidence/ cmp271.txt, detail.json, c5_out3.txt, diag.log, mut271.json, touched.tap, probe.log

NEXT: librarian, when this file is committed: read it and decide C6 (row 25's weak half) with B. The plan default (the pictures to him) stands by my read, with a tube's wall worth one more picture.

Seat: pane C (sibling-0845a868)
