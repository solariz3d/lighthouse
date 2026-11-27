# D678 Track 2: the delta read of c2591bf..1074d5d (the width hold laid last)

Seat: pane E (machine D), sibling-07b8a48f. 2026-11-27, 19:1x to 19:4x Z.
Order: the chair's D678 Track 2 (sent 19:11:10Z). Packet `exo_memory/loop/packet_t180_width_hold_path_2026-11-27.md`, Track 2, with the "Amended 12:4x" section (:49) and its ruling 3.
Range: `l264-extend-holds-width-b`, c2591bf..1074d5d.
- 346e2a0 is B's repair, the hold laid last.
- 1074d5d is a CHANGELOG sentence only.
Read against B's hand-back `p-d678-width-hold-path-B_2026-11-27.md`, sections 1 to 3.7.
Tier: read and measure. Nothing was built, installed, merged or pushed in the builder repo, and his app was not launched.
Registration: `p-d678-width-hold-delta-read-E_2026-11-27_evidence/registration_E.md`, committed as lighthouse 04942ea before any run.
Evidence: the same folder, with every script and text output of this read.
- `d678.js`, `cmp678.js`, `chan678.js` and `endpos678.js` are Track 1's, byte for byte, in `p-d678-ripple-read-E_2026-11-27_evidence/` (checked with `cmp`).
- `ripple268.js` is B's L268 instrument, copied here as run.
- The worktrees and `p1_tip.json` (1 MB) stay on `G:\consonance-scratch\e-d678`.

## Verdict: NOT CLEAN, on the CHANGELOG only

**The code meets ruling 3's bar** (all checked):
- The width columns are c2591bf's on every row but the two named Sharps. Those two are within 1.054 mm of swing, end level, and are the level piece's length again.
- The F4 table reads within 0.636 of a step.
- EX12's anchor, D9's case from 10 m and drag-ghost row 5's new pin all stand.
- Finish closes every lap, moves no placed piece, and lays the level lap's lengths.

**Two sentences the range adds to the CHANGELOG are contradicted inside their own scope** (my registered items 4 and 6):

- **C1, Finish.** The CHANGELOG says "the closed lap's pieces end within 0.1 mm of a level head's". That holds for the lap's last end only (0.064 mm, B's 6.4e-5 m).
  - The first two new pieces end **1.36 mm and 1.0 mm** from the level lap's.
  - I measured this with B's own end measure (`row1_678.js` `endOf`), applied to the lap cut after each piece. Checked.
  - At e112a14 the same pieces end within 0.034 mm.
- **C2, Sharp's bend.** The CHANGELOG says "after that grab the width's second derivative reaches 4.4 to 7.2 per metre (7.15 with a ramp of 1)". The spline's own second derivative reaches **4.98 to 8.95 per metre (8.95 with a ramp of 1)**. Checked.
  - The peak sits at the joint (x = 0). The 0.1 m sample the figure came from starts at 0.1 m and never reads it.
  - **The 7.15 is mine:** my Track 1 read reported "up to 7.15 per m" (its table at :92, and :122). This corrects my own figure as much as B's sentence.

**One finding outside the bar, registered beforehand as expected and not as a trigger:**
- **F1, a field typed "at start".** With a bank, cup or edge typed at start, the held width is no longer c2591bf's. This holds for Extend and Turn by. Sharp ramp 8's width moves 2.0 mm at most, inside its own bar.
- After a moving head the width dives to the second control point (the head's width plus m·K0/3) and stays there. It holds to 9 m on a 30 m piece and is back by 12.5 m. On a 100 m piece it holds to about 10.5 m and is within 1 mm by 15.7 to 16.1 m.
  - After the +4 grab: 1.30 m on a 100 m piece (c2591bf 1.39 m) and 0.52 m on a 30 m piece (c2591bf 1.04 m).
  - The bend doubles on 30 m (3.18 against 1.685 per m, by B's 0.1 m sample).
- The path is e112a14's within 0.66 of a step.
- Neither the ruling nor the CHANGELOG names this case. Read literally, ruling 3's "for every caller" does not hold here. That call is the librarian's.

## 1. Ruling 3, the width columns (R1)

**`d678.js` on the tip** gives 610 rows (`d678_tip.json`, 307 KB, on G: and committed).

**`delta678.js` c2591bf → tip** (`delta678.txt`) compares these columns exactly (`===`): swing, swingAt, factor, over1mmUntil, over1e9Until, end, joint, w2B, w2fine, w2fineAt and placedSame. Checked:
- **Extend, Turn by 45, Turn by −90 over 200, the corner with an extra, Sharp ramp 1, Jump and Level:** the width columns are the same on 60 of 60 held rows for each caller. The level head's bytes are the same on all 9. Sharp 90 R22 is refused by both, with the same text, 61 of 61.
- **Sharp −60 R40 ramp 8:** 60 of 60 within the bar.
  - The largest |Δswing| is 1.054 mm.
  - It ends at the head's width with slope 0, and the joint is null.
  - Its length is 40.2238 → 40.3629 m, the level length.
- **Sharp 90 R150 ramp 4:** 60 of 60 within the bar. The largest |Δswing| is 0.121 mm, and the length is 234.2583 → 234.3479 m.
- "Against the bar: 0 fail".

**`cmp678.js` c2591bf → tip** (`cmp678_after_tip.txt`). Checked:
- Every caller's ranges are the same except the two named Sharps.
  - Ramp 8: |w″| 4.71 → 4.69, and >1 mm until 1.70 → 1.71 m.
  - R150: factor 0.196 → 0.195, and |w″| 4.44 → 4.43.
- Its control, e112a14 → c2591bf (`cmp678_control.txt`), moves every caller (Extend's factor 3.70 → 1.47 to 1.55, for example).

**P1b.** `ripple268.js`'s text output on the tip is byte for byte c2591bf's (`p1_tip.txt` against Track 1's `p1_after.txt`, 1209 B each). Checked.
- Its JSON (`p1_tip.json`, 1 MB, left on G:) differs only in the piece hashes: table 7 of 8, lengths 14 of 16, sweep 80 of 80, extra 1 of 6. That is B's §1.3 seen from the other side.

## 2. The F4 table (R2), and the path sentence (N4)

**`var678.js`, F4's set on the tip against e112a14 from the same head** (`f4_tip.txt`). Checked:
- The heads are level, E1, E4, E6 and the grab +4 at end−3, r 5.
- The callers are Extend, Turn by 45, Turn by −90 over 200, the corner list with an extra from 50 and from 10, the three Sharps, Jump and Level.
- 50 laid, none refused.
- The worst channel is **0.636 of a step**. The worst end is **2.6e-6 m**. Counts and lengths are the same on 50 of 50.
- Against the same head with its width made level, the result is the same.

**`chan678.js` e112a14 → tip** (`chan678_tip.txt`): 45 rows, worst 0.636 steps (E1, Turn by −90 over 200, kh at 20.94 m), no length differs. Checked.
- Its own controls pass: a 1 mm raised joint is caught, and a control point moved 1e-9 changes the hash.

**`endpos678.js`** (`endpos678_tip.txt`): 21 rows, the worst end apart 0 m. Checked.

So the CHANGELOG's N4 holds: "the same turn and climb … to within a step of their stored decimals … end in the same place (within 0.003 mm)". The figures are 0.636 steps and 0.0026 mm. Checked.

## 3. The three things B's tier found (R3)

**EX12's anchor.** Checked:
- At the tip, `grep -cF "doc: extend(doc, { ...o, bankCheck: false, widthHold: 'later' })" src/core/turnby.js` gives 1. My mutant script's own count is also 1.
- Unmutated, the harness's pattern `row (2|3|11):` over its 13 files passes 17 of 17 (`ex12_control.tap`).
- Mutated, 1 of 17 fails: row 11 ("what frees his piece, read apart …"). Rows 2 and 3 pass (`ex12_mutant.tap`).
- The harness counts a mutant caught when at least one selected test fails (`test/core_ramp_mutation.test.js:3`), so EX12 stands.
- My registration said the mutant "turns red the rows `row (2|3|11):`". That can be read as all three; only row 11 goes red.

**D9's new case from 10 m.** Checked:
- The harness's edit (`test/core_width_hold_mutation.test.js:29`) is the edit I applied.
- Unmutated, `core-width-hold.test.js` passes 13 of 13.
- Mutated, 12 of 13 pass. The one failure is the corner-list test, with "the corner list, its extra from 10 m, piece 1: kh is 2.63e-4 from the level head's, over one step".
- The size, from my own probe with D9 applied (`f4_d9.txt`):
  - **from 10 m: 262,878 steps, and the end 6.73 cm** from e112a14's (B: 0.0673 m);
  - **from 50 m: 0.366 steps, end 4.5e-7 m.** D9 does not change this case, so the from-50 case alone could not catch D9.
- The worktree was restored to 0 changed files.

**Drag-ghost row 5's new pin.** Checked:
- `drag-ghost.test.js` on the tip passes 7 of 7.
- My own build of the row's documents (`dg5e678.js`: its steps copied, my own hash; `dg5e678.txt`) gives these hashes:

| tree | placed + corners but w | placed |
|---|---|---|
| tip | **015881f53acdbc5f** (the new pin) | 24bcdf657190c0cd |
| c2591bf | 5e302d1023e4f078 (the old pin) | 24bcdf657190c0cd |
| e112a14 | eb3501a2c3eec581 | 24bcdf657190c0cd |

- The corners' knots are 77/22/112 against e112a14's 74/19/109, three more per corner.
- The corners' channels but w are within **0.685, 0.622 and 0.000 steps** of e112a14's as curves. Their ends are 3.1e-6, 6.3e-6 and 0 m off.
  - At c2591bf: 455 and 32,207 steps, with ends 7.2 mm and 12.5 cm off.
- That the bytes otherwise differ only by Boehm's re-rounding around those knots is inferred, because the curves agree within a step.

## 4. Finish as it stands at 346e2a0 (R4)

**The range holds no Finish code.** Checked:
- `git diff --stat c2591bf 1074d5d` touches CHANGELOG.md, MAP.md, extend.js, turnby.js and four test files, and no finish.js.
- 346e2a0..1074d5d is CHANGELOG.md only (4+, 2−).
- That the try missed and was reverted is B's §3 and the librarian's ruling. I did not re-run it.

**`fin678.js` on the tip, c2591bf and e112a14**, from my six lap heads (`fin_tip.txt`, `fin_c259.txt`, `fin_e112.txt`). Checked:
- Every lap closes, with plan LSL, window [6,7,8] and the placed pieces the same.
- On the tip the lengths are **942/364/943 for all six**. c2591bf laid 942/363/942 for the five moving heads.
- The first piece's width ends at the head's width, level.
- Its width columns are c2591bf's on 6 of 6 (`delta678.txt`, its Finish section).
- **Bank:** the first new piece's bank is **0.9651° at 72.53 m** from the level lap's, on all five moving heads.
- **Turn:** 178 to 181 steps (1.8e-7 rad/m) at 7.87 to 7.90 m.
  - Against the same head with its width level: 0.9651° and 179.7 to 180.4 steps.
  - c2591bf: 1.3509° and 277,430 steps.
  - e112a14: 0 after the brushes. After the grabs, ≤ 1.8 steps of turn and ≤ 0.0001° of bank against the level lap, and 0 against the level twin.
- So "up to about 1° (0.97° measured …), its turn by under 2e-7 rad per metre" holds. Checked.

**The ends (C1):** per new piece, **1.36, 1.0 and 0.064 mm** after the brushes. After the grabs: 1.35 to 1.37, 1.0 to 1.01, and 0.011 to 0.040 mm (`fin_tip.txt`). Checked.
- `finends678.js` re-measures these by B's own `endOf` (`row1_678.js:31`), applied to the lap cut after each new piece. It gives the same numbers (`finends_tip.txt`).
- B's "ends within 6.4e-5 m" is the third number only: B's `endOf` takes the last sample of the whole lap (`row1_678.js:31`; `final_row1.txt:58`, "largest end apart 0.000064 m").
- Control: the level lap against itself reads 0, 0, 0. e112a14 reads at most 3.4e-5 m (`finends_e112.txt`).
- The CHANGELOG's "the closed lap's pieces end within 0.1 mm of a level head's" is therefore true of the lap's end and not of its first two pieces.
- Inferred from the figures: about 1.8e-7 rad/m of turn over the piece's first metres, carried 942 m, gives about a millimetre.

## 5. The CHANGELOG's added sentences, one by one

| sentence (c2591bf..1074d5d) | what I measured | |
|---|---|---|
| "30 cm after Sculpt's grab of +2 m centred 10 m before the end (0.19 m per m)" | E6 Extend swing 295.8 mm; slope 0.19377 | checked |
| "2.55 m after a grab of +4 m centred 3 m before the end, radius 5 (1.67 m per m)" | 2.5472 m at 3.55 m; slope 1.66857 | checked |
| "there is no ceiling but the head's own slope" | factor 1.47 to 1.55 on every row of the Extend family, slopes 0.001 to 1.67 (`cmp678_after_tip.txt`) | inferred: a law seen on the grid, and "no ceiling" itself cannot be run |
| "after the +2 m grab … reaches 0.076 per metre" (the figure was c2591bf's) | B's measure 0.0762; the spline's own 0.0775 | checked; 2% under, not in the range |
| "about five times as hard as the brush itself bent it" | 4.94 (B's measure); 5.02 (the spline's) | checked |
| "6.55 times on 15 m and 9.71 times on 10 m" | 6.547 and 9.709 (B's measure); 6.688 and 10.03 (the spline's) | checked on B's measure; the spline's own reads 2 to 3% higher |
| "Sharp holds the width over its own first span … (about 1.9 m)" | the hold's knots end at 1.922 (ramp 8), 1.986 (R150) and 1.974 m (ramp 1) | checked |
| "about 0.1 to 0.2 times the head's change per metre: 18 to 33 cm after the +4 m grab" | factor 0.110 to 0.198; 18.4, 31.0 and 33.0 cm | checked |
| "reaches 4.4 to 7.2 per metre (7.15 with a ramp of 1)" | **4.98, 5.36 and 8.95** (the spline's own, at x = 0); B's measure reads 4.43, 4.69 and 7.15 | **C2, contradicted** |
| "The hold does not move the road … within a step … within 0.003 mm" | 0.636 steps, 0.0026 mm (§2); my variation 0.66 steps, 1.5e-6 m (§6) | checked |
| Finish: "0.97° … under 2e-7 rad per metre" | 0.9651°, 1.81e-7 | checked |
| Finish: "the closed lap's pieces end within 0.1 mm of a level head's" | 1.36, 1.0 and 0.064 mm | **C1, contradicted** for pieces 1 and 2 |
| Finish: "One try … missed it … not kept" | no Finish code in the range | checked as far as the code goes; the miss itself not re-run |

**How the bend was read** (`wpp678.js`, `wpp_tip.txt`). Checked:
- A cubic's w″ is linear between knots, so its largest |w″| sits at a knot or at the piece's ends.
- I read it there one-sided from each side, as (f(k) − 2f(k∓e) + f(k∓2e))/e², at e = 1e-3 and e = 1e-4.
  - The two agree to 0.2%: 8.9386 and 8.9549 for ramp 1.
- Control: on 3x³ − 2x² at 1.5 (exact 23) the formula reads 22.9982 and 23.0018.
- All three measures agree with one straight line, falling about 18 per m² from 8.95 at x = 0: B's 0.1 m sample reads 7.15 at 0.1 m, and the fine one 8.60 at 0.02 m. The peak is the joint.

**Also seen:** Extend over 30 m and over 15 m lay the same hold (the 30 m piece's first even knot is 15 m), so their bends are identical: 0.0788 per m after the wide brush. Checked.

## 6. The one thing varied: a second field typed with the hold

`var678.js`'s set W1 to W6 (`var_tip.txt`, `var_c259.txt`) and `atstart678.js` (`atstart_tip.txt`, `atstart_c259.txt`). The heads are level, E1, E4, E6 and the grab +4.

**W1 (climb 4 as a corner) and W2 (corner 30 with climb 4).** Checked:
- Within 0.574 of a step of e112a14, with ends ≤ 1.5e-6 m.
- The width is c2591bf's: knots, w and length the same.
- At c2591bf: 8,108 and 39,548 steps, with ends 3.9 mm and 1.9 cm.
- The prediction held.

**W3 to W6 (a bank of 8 at start, which makes the hold's subdivisions 8).** Checked:
- The path is within **0.66** (W3), 0.519 (W4), 0 (W5) and 0.472 (W6) steps of e112a14, with ends ≤ 3.7e-7 m.
- The joint is null, every width ends at the head's level, and none is over 1 mm past 16.08 m.
- At c2591bf: W3 1.42 to 1.81 steps, W4 49,076, W5 1 to 1.744, W6 1,476,897 (13.9 cm).
- **Prediction "the worst re-rounding is above 0.636 and under 2":** it held, barely (0.66).
- **Prediction "a knot nearer than 1e-3 m is possible at the tip":** not found. The smallest knot gaps are 0.156 m (W3, W4), 0.3125 m (W5) and 0.078 m (W6).
- Registered item 5 is not triggered.

**F1, the width under "at start", tip against c2591bf** (`atstart678.js`, `prof678.js`, `prof678.txt`). Checked:
- The same for bank, cup or edge typed at start. With the bank typed over the whole piece, the width is c2591bf's.
- The bend column is B's 0.1 m sample (`atstart678.js`), per m.

| head (100 m Extend) | swing c2591bf → tip | 1 mm until | bend |
|---|---|---|---|
| E4 | −126.0 → −118.1 mm | 16.59 → 15.68 m | 0.1161 → 0.1235 |
| E6 | −161.5 → −151.4 mm | 16.66 → 15.74 m | 0.1488 → 0.1583 |
| grab +4 | −1390.5 → −1303.6 mm | 17.09 → 16.08 m | 1.281 → 1.363 |

| head (30 m Extend) | swing c2591bf → tip | bend |
|---|---|---|
| E4 | −94.5 → −47.2 mm | 0.1522 → 0.2878 |
| E6 | −121.1 → −60.6 mm | 0.1961 → 0.3696 |
| grab +4 | −1042.9 → −521.4 mm | 1.685 → 3.18 |

- On 100 m the piece has one knot fewer (32 → 31). On 30 m the knot count is the same (22) and only w differs.
- **The shape, grab +4, 30 m, every 0.5 m** (`prof678.txt`):
  - tip: 0, −468, −521, … −521 to 9.0 m, then back to 0 by 12.5 m;
  - c2591bf: 0, −632, −937, −1035, −1043, … −1043 to 7.5 m, then back by 12.5 m.
- The control points: on the tip, P1 = P2 = … = the head's width − 0.5214 (m·K0/3 with K0 = 0.9375 m, the at-start ramp's first subdivision). At c2591bf, P1 = −0.5214 and P2 onward = −1.0429 (m·1.875/3, the hold's own first subdivision).
- On 100 m it is the same with K0 = 2.3438 m against 2.5 m.
- **Mechanism, inferred from the code:**
  - `layHold` (extend.js) sets w[1] from the merged piece's first knot BEFORE `rampControl`.
  - rampControl's clamp includes P[1], and its ideal ramp from the head's slope dips below that, so P[2] onward sit at P[1]: the plateau.
  - At c2591bf the plateau sat at the hold's own first subdivision, past P[1].
- The tip matches the hold's stated design ("at most the second control point's way", extend.js above `holdW`); c2591bf did not.
- What it means for him:
  - After a moving head, typing a bank, cup or edge at start leaves the width about m·K0/3 off the head's for about 10 m. On a 30 m piece that dip is now half as deep as at c2591bf and bends twice as hard.
  - None of the CHANGELOG's Extend figures (about 1.5 × the slope, within 1 mm by 7 to 14 m) describes this case. It reads 0.78 × and 15.7 to 16.1 m.
  - The "7 to 14 m" sentence predates the range.

## 7. Controls (the dossier row: E, positive-control discipline, `handback/p-aura_2026-09-02.md` §8)

Every zero above was read from an instrument that had first returned a non-zero on a known difference:

| instrument | the zero it gave | its control, non-zero |
|---|---|---|
| `delta678.js` | 0 fail, tip | e112a14 → c2591bf: 540 of 540 held rows differ; 537 fail (532 rows + 5 Finish heads). The 8 others are the Sharps' tiny-head rows, within 1.1 mm either way, so the Sharp bar alone cannot see a tiny head. |
| `cmp678.js` | the same ranges | e112a14 → c2591bf: every caller moves |
| `var678.js` f4 (P2) | 0.636 steps, 2.6e-6 m | c2591bf: 3,787,042 steps, 0.3173 m, 8 lengths |
| `var678.js` var (P3) | ≤ 0.66 steps | c2591bf: W4 49,076 steps, W2 39,548 |
| `chan678.js`, `endpos678.js` | 0.636, 0 m | Track 1's e112a14 → c2591bf: 3.79e6 steps, 0.3173 m; its built-in joint and hash controls |
| EX12, D9 (P4) | the rows green | mutated: 1 of 17 red, 1 of 13 red |
| `dg5e678.js` | within 0.685 steps | c2591bf: 32,207 steps, 12.5 cm |
| `finends678.js` | the level lap 0 | the tip 1.36 mm; e112a14 3.4e-5 m |
| `wpp678.js` | (no zero; a peak) | 3x³ − 2x²: 22.9982 / 23.0018 against 23 |
| `keyscan678.js` (P5) | 0 in this hand-back and its evidence | the key itself: the count in §9 |

## 8. Corrections

- **Mine, Track 1:** "up to 7.15 per m" for Sharp's bend was B's 0.1 m sample. The spline's own peak is 8.95 per m at the joint. The CHANGELOG took my figure (C2). Track 1's hand-back is a dated trace and keeps its words; this is the correction.
- **My registration:**
  - It wrote EX12's result as "turns red the rows `row (2|3|11):`". One of the three goes red, which is what the harness counts.
  - It named a P2 instrument (`f4steps678.js` on `chan678.txt`) that I did not write. The F4 set run on c2591bf took its place, and chan678 itself was re-run on the tip.
- **My first run script left out `cmp678.js`,** which the order names. I ran it after (`cmp678_after_tip.txt`).

## 9. Load, and what was not done

**All runs went through heavy-run at BelowNormal, each labelled "(not a timing session)", on synthetic roads only:**
- the probes, 19:17:53Z to 19:21:27Z;
- the mutants, 19:21:28Z to 19:21:36Z (queued behind my own run's tree, not another seat's);
- Finish, the D9 size and the at-start probe, 19:23:15Z to 19:25:24Z;
- four short runs between 19:25Z and 19:32Z: `wpp678.js`, `finends678.js`, `prof678.js` and `cmp678.js`.

Outside heavy-run, and none of it builder code: `node --check`, small `node -e` summaries of the JSON outputs, and git.
- I stopped no task and ended no other seat's run.
- The worktrees stay in place on G:. `wt-mut` is restored (0 changed files).

**Not done:**
- B's whole tier and the width-hold harness's D1 to D11: only D9, and EX12, were re-run.
- The reverted Finish try.
- Pictures: none for this read.

**Names (P5):** `keyscan678.js` over this hand-back and its evidence folder. The key is the control: 9 names and parts read from it, the key itself counts 19, and these 56 files count 0 (`keyscan.txt`).

NEXT: librarian rule on C1, C2 and F1 when this hand-back is read
