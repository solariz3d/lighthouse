# L271 role 2: the grab along the slope. Pane B, L, 2026-11-28

**The order:** the chair's L271 dispatch, sent 08:03:47Z, delivered 08:05:38Z. It is role 2 of `loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md`
(room 45b92dd4), read whole.
**What D measured:** `handback/p-d678-even-banked-probe2-A_2026-11-27.md`, candidate 3 (`followChord`, in that hand-back's `even678.js`).
**Base:** the builder checkout (t180-track-builder) c522ea6 (landing-1127-l263, installed on L). The branch is `l271-grab-slope`, made from c522ea6 in my own
worktree `t180-b-l271`, beside the checkout.
**Tier:** the branch is pushed (I am the landing pane for this ref only). Nothing is built, installed or merged.
**My stake:** I wrote no part of L270 and none of the D probe. I built the width hold (L264, L268, D678) and read Even on D.

---

## Registered before the build (written 08:4xZ, committed before any line of the branch is written)

### What the code says first (read from c522ea6 `app/core/zonegrab.js` `follow` and `app/core/panel.js` `down`, `followOf`, `followAt`): the candidate as D wrote it removes the lift

- **Every Grab press on the road goes through `follow`.** `panel.js` `down` opens a follow for any press `zoneOf` names, at any u, and `followAt` hands `follow` the pointer's
  whole move on the plane facing the camera. Only `|u| < HINGE_U` (0.1) slides. Every other press hinges about the far rim, and that hinge is how a lift banks the road
  (row 14f: "on a flat road the touched side rises, the far rim stays: a bank and half the lift").
- **D's `followChord` projects the WHOLE in-plane drag onto the chord** (`even678.js:54`: `t = (e·v0x + v·v0y) / n0²`, then `e, v = t·v0`). The part across the chord is dropped,
  and that part is the one that turns the chord.
  - inferred from the code, measured below as row R5: on a flat road the chord is level, so a straight lift of a rim becomes nothing. Grab could no longer bank a road
    by lifting its edge, which it does today every time.
  - D's probe pulled only horizontally (`grab`: `push = fr.R · −e`), so C3a's "the same bytes on a flat road" is true of a horizontal pull and silent about a lift.
- **So I build the narrower form, and call it the slope grab:** only the HORIZONTAL part of the drag (e, along R) goes along the chord's slope, by D's projection
  (e·cx along the chord's unit direction (cx, cy)). The vertical part (v, along the unrolled up) is added as today, so it still turns the chord.
  - For a horizontal pull this is D's `followChord`, to the digit (inferred: the same formula with v = 0). D's measured figures should come back (control K below).
  - For a straight lift it is today's `follow`, unchanged.
  - On a road whose chord is level (flat road, the press on the rim's own height), cx = ±1 and cy = 0 exactly, so every drag is today's.
- D's literal form is measured beside it in every row, so the choice is visible. If he wants the literal form, it is one line.

### The control, read before any row (if it fails, I stop and say so)

| row | passes |
|---|---|
| K1 | the fixtures F, F0, B−, B+, Bhold rebuilt with `even678.js`'s `LAYOUT`, `makeBase` and `grab`, copied unchanged, on c522ea6 |
| K2 | the slope grab's T1 follow on B−, Bhold and B+ equals D's `followChord` T1 follow to 4 places (B−/Bhold: h +0.4306, l −1.8433, w +3.7956, φ 0; B+: h −0.855, l −1.6888, w +3.7956, φ 0), and today's follow equals D's "today" (h −0.2403, l −2, w +3.8559, φ ±0.0872) |

### The rows

| row | what passes | what fails |
|---|---|---|
| R1 flat road, no cup (F0) | the saved text (sha256 of `serialize`) the same as today's after: T1 and T2b (D's pulls), and one grab at s 320 with each of: a horizontal pull out and in, a lift up and down, a diagonal, at u = ±1, ±0.95, ±0.5 and 1.2 | any difference |
| R2 flat road with a cup (F, the default cup) | no bar: say what changes, and by how much | |
| R3 banked turn (B−, Bhold; B+ reported) | after T1 and T2b made with the slope grab, the bank within 0.01° of the turn before any grab, every 1 m over 150–490 | over 0.1° anywhere |
| R4 his 16 tracks and every undo step on L, from copies | `bytes264.js` (each track and undo step as `serialize(parse(text))`, hashed) the same on c522ea6 and on the branch | any difference is a stop |
| R5 the lift (added by me) | a straight lift (along world up) at u = ±1, ±0.95, ±0.5 on F0, F, B− and B+ gives today's follow, every channel within 1e-12 | any channel off by over 1e-9 |
| R6 the existing rows | `app/test/zonegrab.test.js` and the tier's rows that call `follow` | see the prediction |

### Predictions, registered

- **K passes** (the formula is D's for a horizontal pull).
- **R1 passes** on every case. **R5 passes** for the slope grab, and **D's literal form fails R5** on every flat case (a 1 m lift at u = −1 on F0: today φ by atan(1/12) ≈ 4.76°, literal 0).
- **R2, inferred:** a press exactly on the rim (u = ±1) is the same as today, because both rims stand at one height. A press inside the rim (u 0.95, 0.5) has a chord that
  slopes with the cup, so today's horizontal pull there turns the bank a little and the slope grab does not. I expect a bank change today of under 1° and 0 after.
- **R3 passes:** 0.0000° on B−, Bhold and B+, from T1 and T2b (D's C3b).
- **R4 passes:** a grab is an action, `zonegrab.js` is not read when a file is opened or saved, so nothing stored can move.
- **R6 fails, by design, in three rows,** and I say so before I see it: 14h ("on a road banked 60° and 85° … the point follows"), 14j (the road stays under the pointer
  on a pitched road, banked −85° and 60°) and 14l (a press at 60° dragged out). On a bank a horizontal pull now moves the point along the slope, not to the pointer.
  These are rows of his own rule ("the mouse click gives a singular point you then drag to sculpt the track simple as that"). They are amended by name, the far-rim half
  kept as it is, with the new rule written beside it. Any other red is a fault of mine.
- **Item 3, under his hand, inferred before the page is opened:**
  - on a flat road nothing moves differently;
  - on the banked turn the grabbed edge leaves the pointer: at 20°, a 4 m pull moves the point 4·cos²20° = 3.53 m out and 4·cos20°·sin20° = 1.29 m up, so it ends about
    0.47 m short of the pointer across and 1.29 m above it;
  - during the drag the glyph and the value line stand on the road as it was at the press (the preview's shared track holds the pre-drag road, `trackmodel.js` `how: 'drag'`).
    The middle now rises 0.43 m on B− where it dropped 0.24 m, so the glyph may end inside the road where it floated above it;
  - the value line loses its bank entry on a bank (φ 0 is not listed), and shows `w` and `h` instead.
  Measured in the page in section 3.

### The stop rules

- R4 differs: stop, no push.
- K fails: stop, say why, no build.
- An R6 red beyond the three named: the branch is not pushed until it is understood.
- The answer may be "do not build this", in the order's words. If the pictures show the grab working against his hand, I say so beside the push.

---

## Results

### The build: cc4fa71 on `l271-grab-slope`, pushed (checked: `git diff --stat c522ea6 cc4fa71`: 4 files, +72 −10)

- `app/core/zonegrab.js` `follow`, one line changed and one added: `const cx = v0[0] / n0, cy = v0[1] / n0;` and
  `const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v], short = …` (was `[v0[0] + e, v0[1] + v]`), with a four-line comment carrying his word.
- `app/test/zonegrab.test.js`: rows 14h, 14j, 14l amended by name (below); rows 14o, 14p new; a helper `slopeWant` that reads where the point should go from
  the road's own surface (the chord from the far rim to the point, read with `acrossAt`), not from `follow`.
- `app/test/core-pieces-ui.test.js`: row 25 amended by name (the panel's grab on a cupped road; found by the tier, below).
- `CHANGELOG.md`: one entry under Changed, saying what he will notice.

### The control: K passed, so the rows were read

checked: `probe271.log` line `K true`. Every T1 follow (D's gesture, s 320, the outer rim pulled out to 16 m) equals D's run.log to 4 places: the slope grab's on
B−, Bhold (h +0.4306, l −1.8433, w +3.7956, φ 0) and B+ (h −0.855, l −1.6888, w +3.7956, φ 0); today's on B−, B+, F and F0.
`probe271.js` copies `even678.js`'s `LAYOUT`, `makeBase`, `grab` and `followChord` unchanged (one change: the follow is passed by name). TODAY is c522ea6's
`zonegrab.js` read with `git show` and compiled beside the worktree's, so the two differ only by the slope grab's lines in `follow` (checked: `sameSourceAsBase` false;
`git diff c522ea6 cc4fa71 -- app/core/zonegrab.js` is that hunk alone).

### The rows

| row | result | verdict |
|---|---|---|
| R1 flat road, no cup (F0) | the slope grab's saved text equals today's in **37 of 37** cases (T1, T2b, and 5 gestures × 7 presses). D's literal form equals it in 16 of 37: it differs on every lift, sink and diagonal | **pass** |
| R2 flat road with a cup (F) | 22 of 37 the same (D's literal: 6). **The same:** T1, T2b, every gesture at u ±1, every lift and sink anywhere. **Different:** a pull out or in, or a diagonal, pressed inside the rim (u ±0.95, ±0.5) or past it (1.2). There today's pull TURNS the road, and the slope grab does not: 4 m out at u 0.95 today banks it 0.077°, at u 0.5 1.0865°, at u 1.2 0.2498°; the slope grab 0 at all three. The largest channel difference is 0.163 m, at u 0.5: the centre drops 0.3185 m against today's 0.1555 m (the chord slopes down into the cup, and the stretch follows it) | no bar; said |
| R3 banked turn | the bank against the turn before any grab, every 1 m over 150–490: **0.0000°** on B−, Bhold and B+, after T1 and after T2b made with the slope grab. Today: 4.9984° (T1), 5.0209° (T2b), D's figures to the digit. The widest the road gets: 15.7956 m after T1 (today 15.8559 m) | **pass** |
| R5 a straight lift | 72 cases (F0, F, B−, B+; u ±1, ±0.95, ±0.5; up 1, −1, 2.5): the slope grab's follow equals today's, **every channel, difference 0** (not under 1e-12: zero). D's literal form is off in **72 of 72**, by up to 1.67. On F0 a 1 m lift at the rim today banks the road 4.7636° (= atan(1/12), as predicted); D's literal form 0 | **pass**; the literal form fails |
| R6 the zonegrab rows | before the amendment, on the branch: 26 pass, 3 fail, exactly the three named (14l, 14h, 14j), each on its "the point follows" half; the far-rim half passed in all three. The misses: up to 1.73 m, 1.99 m, 1.41 m (checked: `zg-before-amend.tap`). After the amendment and the two new rows: **31 of 31** (`zg-after.tap`) | as predicted |
| R4 his saves, from copies (29 files taken 08:07:33Z, `sha256sum -c` 29 of 29) | `bytes264.js` on c522ea6 (a detached tree, removed after) and on the branch: **the same file**, `cmp` silent (`tier271.log`: `R4 SAME`). 16 tracks, 13 undo files, 49 undo steps; 2 tracks refused by name on both | **pass** |

checked: every figure above from `probe271.json` (`R1`, `R2`, `R3`, `R5`, `K`); the run was 08:11:39–08:15:02Z through heavy-run at BelowNormal (child pid 17660, BelowNormal, CPU
rising at the check), slot 2, beside P's suite in slot 1.

### The rows, red first, and the mutants (checked: `mut271.txt`; each applied to the worktree's file, the zonegrab rows run, the file restored byte for byte: `restored: true`)

| mutant | caught by |
|---|---|
| BASE c522ea6 (the drag whole, as today) | 14l, 14h, 14j, **14o** (red first: 14o is red at the base) |
| D's literal `followChord` (the whole drag onto the chord) | 14d, 14l, **14f**, 14h, 14j, **14p**, 14n: two of TODAY's rows (14f, a rim lifted on a flat road banks it; 14d, a lift partway out) |
| M1 no rise along the slope | 14l, 14h, 14j, 14o |
| M2 the pull whole across | 14l, 14h, 14j, 14o |
| M3 the lift dropped | 14d, 14l, 14m, 14f, 14h, 14j, 14p, 14n |
| M5 the share not squared | 14l, 14e, 14h, 14j, 14o |

**14p is never red at the base:** it guards the lift, which the base already has. It is red under D's literal form and under M3, the two ways to lose it.

### Predictions, scored

| registered | result |
|---|---|
| K passes | **held** |
| R1 passes on every case | **held,** 37 of 37 |
| R5 passes; D's literal form fails it on every flat case (F0, 1 m at u −1: today 4.76°, literal 0) | **held:** slope 0 difference; literal 72 of 72, and 4.7636° against 0 to the digit |
| R2: the rim press the same; inside the rim a pull today turns the bank "under 1°", after 0 | **half held.** The rim press is the same, and the slope grab turns nothing. But today's turn is **1.0865°** at u 0.5, over my "under 1°" |
| R3 0.0000° on all three | **held** |
| R6 fails in exactly 14h, 14j, 14l | **held in the zonegrab file; failed in the tier:** a fourth red, core-pieces-ui row 25, by R2's mechanism (below) |
| item 3, inferred: at 20° a 4 m pull ends the point about 0.47 m short and 1.29 m above the pointer | **the direction held, the size did not:** 0.57 m short and 1.45 m above (`item3.json`, B− at s 330: the cup adds to the bank's slope). Section 3 has it on screen |

### The tier: one red I did not name, understood, amended (checked: `tier-branch.tap`, `tier2-branch.tap`, `run271c.log`)

- The touched rows: every test file that reads `zonegrab.js` (`zonegrab`, `core-pieces-ui`, `handles`) and `sculpt-frame` (row 5 drags on the page).
- **First run: 139 pass, 1 fail, 5 skipped.** The red was **core-pieces-ui row 25** ("Grab on the road: the pressed point follows the pointer…"):
  "the rim point is 0.030894300146717343 m from the pointer".
  - Why: row 25's road is cupped and its rim press is at u −0.95, inside the rim. The chord there slopes with the cup, so the pull's horizontal part
    now runs along it. This is R2's mechanism, which I measured but did not trace to this row: **a missed prediction** (I registered exactly three reds).
  - Amended by name, as 14h/j/l were: the rim point within 1 cm of the slope grab's place, read from the road; the far-rim half unchanged.
  - **Red first:** under the base's line, row 25 alone: `# pass 0 # fail 1` (`run271c.log`).
- **Second run: 140 pass, 0 fail, 5 skipped** (sculpt-frame's rows 1–4, which time only with both slots held; the order put no timing on this lap).
- Not run: the whole suite. Nothing outside these files calls `follow` (checked: `grep` for `zonegrab` over `app/test` and `test`; `mutation.test.js`
  only copies the file, and no harness anchors on the changed line).

## 3. Under his hand, on the real page (checked: `page271.json`, `page271b.json`, `page271c.json`; the pictures)

**How:** headless Chrome, the real `app/index.html`, served twice from the worktree (TODAY with `zonegrab.js` swapped for c522ea6's, byte for byte).
- The road was restored as an autosave, then Sculpt (Tab, 1 = Grab), radius 30.
- The camera is the page's focus at s 330: 35 m up, 45 m back, the view a click on a red sends. **inferred, not known:** that this is his usual view. Nothing
  on disk says which view he sculpts from.
- A real pointer press on the outer rim (the page's own pick read s 330, u −1 at that pixel), dragged, held, shot, released, shot.

**Two pulls, because they differ:**
- **D's pull** (to where the rim moved 4 m straight out projects, run 1): on screen that is 42 px right and **7 px up**. The page reads the up part as a lift,
  and a lift banks the road in both grabs: today **+2.90°** (flatter), the slope grab **−1.76°** (steeper).
- **A level mouse move, 45 px outward** (runs 2 and 3): this is the hand pulling sideways.

| B− (banked turn, −20°), level 45 px pull | today | the slope grab |
|---|---|---|
| the bank at s 330 after | **−15.1303°** (4.87° flatter) | **−20.0000°** |
| the value line during | height −0.23 m · sideways −1.93 m · width +3.72 m · bank +4.87° | height +0.42 m · sideways −1.78 m · width +3.67 m (no bank) |
| the rim from the pointer, after | 9.4 px (0.28 m) | **21.0 px (1.56 m)**, the rim 1.40 m higher than where his hand pulled |
| the middle | down 0.23 m | **up 0.42 m** |

**The flat cupped road (F):** the same in every figure, with the press on the rim: the rim 2.0 px from the pointer, bank 0 → 0, the middle down 0.24 m,
in both.

**So, the answer to item 3:**
- **The readout and the handles still sit where his hand is.** During a grab the glyph (the white up-and-down arrows) and the value box stand at the
  road's middle at the press. They do not move during the drag: the preview's shared track holds the road from before the drag (`trackmodel.js`,
  `how: 'drag'`). The box opens beside the glyph and runs out under the pointer. Its place on screen is the same in both pictures (`pair_Bminus_1_during.png`).
  The middle rising 0.42 m does not hide the glyph at this view.
- **The grabbed edge does not stay under his hand on a bank.** On B− it ends 21 px from the pointer and above it, where today's ends 9 px off. On a flat
  road nothing changes. He will see the edge ride up the slope away from the cursor, and the value line lose its bank figure.
- **The checker:**
  - read off the screenshots, not by the script, whose selector read nothing;
  - during D's pull on B−: today "2 red · 7 amber", red lines across the grabbed stretch; the slope grab "0 red · 5 amber";
  - after the level pull: today "2 red · 6 amber", the slope grab "1 red · 6 amber", a red at 310 m. **Not explained:** it is the grab's own falloff
    (D saw the chord grabs keep the falloff reds), inferred, not checked.

## 4. The pictures (untracked, in `handback/p-l271-grab-slope-B_2026-11-28_evidence/pictures/`)

Each `pair_*` is today (left, c522ea6) against the slope grab (right), the preview's area at its own pixels, the level 45 px pull:

- `pair_Bminus_1_during.png`, **look at this one first:**
  - the banked turn, during the drag, from the focus view, the yellow cross where the pointer is;
  - today's red check lines across the grabbed stretch, and its value line with "bank +4.87°";
  - the slope grab's road keeps its bank.
- `pair_Bminus_2_after.png`: after the release; a cyan cross where the rim ended, the yellow where the hand let go.
- `pair_Bminus_3_side.png`: from the side, 14 m outside the outer rim, 1.2 m above it. **Weak:**
  - the view is low and grazing, and the rise reads as a thicker band of road rather than a shape;
  - flown by the page's own keys (each key's speed learned from one tap), not placed;
  - run 1's side view had overshot to about 400 m and showed nothing, and run 2's stood at 28 m.
- `pair_F_1_during.png`, `pair_F_2_after.png`, `pair_F_3_side.png`: the flat cupped road. Left and right are the same road (the numbers are equal).
- `run1_D-pull_*_during.png`: D's pull (7 px up), single shots, for the bank change a slightly rising hand gives.
- In run 1 the guide box ("Close the loop, 3 of 6") covered the top right. It was closed by its ✕ in runs 2 and 3.

## 5. The push

- **Committed** cc4fa7151b0058370abb3fa3005dc3111c0be3df on `l271-grab-slope`, the 4 files by name, after the privacy grep over the added lines (no hit).
- **Pushed** with one command, `git push origin l271-grab-slope`, from the worktree.
- **push-gate:** `allow` at 2026-11-28T08:42:47.242Z, scanned `origin` `l271-grab-slope` (the last row of `<data>/push-gate.jsonl`).
- **Read back:** `git ls-remote origin l271-grab-slope` → `cc4fa7151b0058370abb3fa3005dc3111c0be3df refs/heads/l271-grab-slope`.
- Nothing else was pushed. No main, no build, no install, no merge.

## The machine

- **Every heavy run went through heavy-run at BelowNormal, in slot 2.**
  - the probe 08:11:39–08:15:02Z, beside P's suite in slot 1;
  - the pictures 08:22Z on;
  - the tier with R4, to 08:39:17Z;
  - the pictures' second and third runs, and the rows again.
  - Each waited out P's and A's exclusive holds in the queue. No `--status && run` form was usable while a hold stood: `--status` exits 1, so I queued
    with `--run`, which waits.
- **Light runs outside heavy-run:** the zonegrab file (twice), the mutants, and three item-3 reruns. All ended by 08:16:40Z, 4 s before P's first exclusive
  hold (08:16:44Z). None ran under any hold, and none after the chair's addition of 08:39Z.
- **Headless:** soundrender.js's launcher (`--mute-audio`), never focused. The title `zz-headless-test` was set first and read back 12 of 12 times
  (`titles` in the three page JSONs). Page errors: 0, 0, 0.
- **Tab proxies:** UNCALIBRATED, read 0 before and after. Orphan browsers: 0 before, 0 after (`leftovers-before.txt`, `leftovers-after.txt`).
- **The worktree** `t180-b-l271` and the detached base tree are both removed. The builder's worktree list has no tree of mine.
- His game and his app were not running at any check (`tasklist`); `--wait-game` on every queued run.
- **His saves:** read from copies only, never named.
- **Evidence:** scripts, JSON, TAP and logs, with machine paths replaced by `<scratch>`, `<downloads>`, `<home>`. So the scripts no longer run as they are:
  give them the paths their headers name.

## Corrections, mine included

- **The registration's heading says "written 08:4xZ".** It was committed at **08:10:07Z** (4febfd3b). The text is as registered.
- **The privacy grep matched the registration and I committed anyway.**
  - My command chained the commit after the grep with `&&`, and a grep that finds something exits 0.
  - The hit was the checkout path (the user folder's Downloads path). The next commit drops it. 4febfd3b still carries it; the lighthouse was not pushed by me.
  - 151 hand-backs already carry the same path, mine never had.
- **Item 3 in node, two errors of mine, found before any figure was used:**
  - I read the road through `buildPath` on the resolved segments, which carries no h or l, so the centre read 0 and the rim moved half.
  - D's MID, s 320, is a piece joint.
  - Re-read through `adapter.toPath`, as the zonegrab rows read it, and at s 330 too: the same figures at 320 and 330.
- **"Under 1°" (R2) was wrong:** today's tip at u 0.5 is 1.0865°.
- **"Exactly three reds" (R6) was wrong:** a fourth, row 25, by the R2 mechanism.
- **My item-3 size (0.47 m short, 1.29 m up) was low:** node says 0.57 and 1.45 (the cup adds); the page, with a level pull, 1.56 m from the target and
  1.40 m up.
- **Run 1's side view overshot** (my key-flight loop, not the page). Its pictures are not used. Runs 2 and 3 learned the keys first.

## Which I would build, and what is still his call

- **Build this form, not D's literal one.** D's projects the whole drag onto the chord. Measured here, that removes the lift that banks a road: it fails
  today's rows 14d and 14f, and 72 of 72 lift cases. The form on the branch keeps the lift to the bit and keeps the bank on a pull (0.0000°).
- **His call, from the pictures:**
  - on a bank the grabbed edge leaves the cursor and rides up the slope (1.4 m on a 4 m pull at 20°);
  - the middle rises where it used to sink;
  - a press inside the edge of a cupped road no longer tips it.
  - If the cursor leaving the edge bothers his hand, the answer may be "do not build this", which the order allows.
- **Untested:** an edge piece (its rims sit at different heights, so the chord is not level on a flat road); a tube; a half-pipe's wall. Each goes
  through the same `follow`.

NEXT: librarian call_chair with this hand-back's path when it has read it, for a non-author read of l271-grab-slope c522ea6..cc4fa71 and the pictures to him
