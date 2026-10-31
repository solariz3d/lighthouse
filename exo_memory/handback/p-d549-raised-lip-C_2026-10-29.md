# D549: a jump takes off from a lip the brush raised or shifted (pane C, sibling-0845a868)

The order: the chair's 03:34:11Z (D549 routed to C; prove it, core maths). The plan is `exo_memory/loop/plan_d549_jump_from_a_raised_lip_2026-10-29.md`, read whole.

| what | value |
|---|---|
| **Commit** | t180-fresh worktree `C:\Users\nname\Downloads\t180-wt-c549`, branch **d549-c**, **`92a36ef76f69922bf5f7e13b3190cee4e7e68497`** on the 0.4.31 batch base **98e3d81**; 13 files, +195 −23; plain message with the co-author line. Not pushed |
| **Full suite + TAP** (on the change; lock, BelowNormal, SWEEP_SEEDS=60, 1,578 s) | **4,093 tests: 4,070 pass, 1 fail, 21 skipped, 1 todo**; mutants applied and caught **729**, not ok mutant rows **0**, NOT APPLIED **0** |
| **The 1 red** | drag-frame row 8, the machine's standing red. It failed alone on every tree tonight, the pre-merge D534 tip included (D537 hand-back §2, 0.4.30 §2, D542). Not caused here; not re-run |
| **core_jump_mutation** | whole, **27 applied / 27 caught / 0 NOT APPLIED**, including the 8 new ones (J20–J27) and the two re-anchored (J6, J16) |
| **Fixtures** | core_cup_fixtures row 5a: **"0 of 9 differ"** |
| **Byte-identical** | a jump off a kv-climbing take-off with no offset, by the button and posed: the sha256 of the segments, the path samples and the saved text, captured on 98e3d81 BEFORE the change, are equal after (row 8) |
| **Checker run** | §4: no new red |

    checked: SC/d549/suite549.log + suite549.tap; SC/d549/golden-before.txt; SC/d549/checker.out; red runs of row 8 on 98e3d81 (below)

## 1. The change

**src/core/adapter.js:**
- **`lipOf(R, p0)`:** the lip of the road piece before a flight, as the lift builds it (offsetPath), in the flight's own frame (x left, y up, z forward; heading 0, the route's pitch p0):
  - the position `[l, h, 0]`;
  - the lifted tangent `d1 = [l′, sin p0 + h′, cos p0 − kh·l]`, the very expression offsetPath uses at the end, as a heading and a pitch.
  - It returns null when h, l and their slopes are all 0 at the end.
- **The flight segment:** with a lip, `to.from` = that pose, and `to.x`/`to.theta` are the landing composed onto it:
  - forward and left turned by the lip's heading;
  - up along world up;
  - the flight's heading added.
- **Without a lip,** the segment is built exactly as before. That is why a clean lip is byte-identical.
- **The segment cache's key for a flight** now includes the lip (`lipKey`: h, l, their slopes, kh at the end). Without it, re-brushing a lip under a placed jump kept the old flight, because the flight piece itself is the same object. Row 8's cache test and mutant J25 hold this.

**src/geom/path.js:**
- **`flightCurveFrom`:** the same cubic Hermite, starting at `to.from.x` along `tangent(from.theta, from.p)`.
- `flightCurve` uses it only when `from` is set.
- `checkSegments` validates `from`.
- `blockKey` includes it.

**src/core/document.js:** checkDoc's FLIGHT_OFFSET is gone. A value that is not a number at the lip is still refused by the document's own channel checks (row 8).

**src/core/close.js:** the close's model of a flight had to learn the lip. **This was not in the plan; a red test showed it.**
- **The miss:** without it, a shifted lip's tilt θ0 rotates everything after the jump, and the model missed by 657 m in 13 km (relative 5e-2).
- **positionJacobian:** adds `−l·F(θ)` and turns the landing by θ0, through the adapter's own `lipOf`, so the two cannot disagree.
- **netRows:** counts the flight's turn as `g.to.theta`, the composed turn, so a lap closes in tangent too. Before the fix, the seam was 0.0749 rad off.

**The app:**
- `jumpwords.js` loses the FLIGHT_OFFSET case.
- jump.js's header and comments in close.js and coreshell.js no longer cite the rule.
- **The Jump ghost's code did not change:** candidateJump hands the preview the adapter's segments, and the preview grows the ghost on the placed base path, where `from` puts the flight exactly on the lifted lip.
  - jump-ui row 1c checks that the ghost's segments fly the same flight, `from` included, as the placed jump.
  - **No headless look by A is owed, by the plan's rule.**

**CHANGELOG [Unreleased] ▸ Fixed:** "A jump can take off from a lip you raised with the brush; it no longer has to be flat road."

## 2. Tests first: red on 98e3d81, green after

**The new rows are core_jump.test.js row 8,** not a separate core_jump_offset file, so that core_jump_mutation (which runs core_jump.test.js) catches the new mutants. 9 rows:
1. **A lip raised 2 m by the hill brush:**
   - the flight starts at the road's last row (1e-9), which is the unlifted end 2 m up (1e-9);
   - it leaves along the lifted road's tangent (no kink, 1e-9);
   - the landing is at the lip's pose plus the flight's (1e-9), with its heading and pitch;
   - the landing's own h and l are 0.
2. **The mesh at a level raised lip** (its last two control points equal, so the end's slope is exactly 0):
   - the road's last row is the unlifted mesh's last row moved 2 m up, vertex by vertex (1e-9);
   - that row is centred on the lifted lip, and the landing's first row on its start (1e-6).
3. **A shifted lip still moving (`l`):** the heading is tilted by atan(dl/ds) (1e-9), and the landing turns with it.
4. **A rising lip on a level piece:** the take-off pitch is atan(dh/ds) (1e-9), with the same tangent as the lifted road.
5. **A rising lip on a climbing piece:** the pitch is the lifted road's, above the piece's own.
   - The plan's "the lip's slope plus the piece's pitch" is the first-order form; the code uses the lift's exact tangent, so the road and the air meet with no kink.
6. **Byte-identical with no offset**, by the button and posed: the shas captured before.
7. **A lap with a shifted-lip jump:**
   - the close's model predicts the adapter across it (relative < 1e-3);
   - it closes in position (< 1 mm) and in tangent (< 1e-6 rad).
8. **The document** no longer refuses a jump after an offset; a NaN offset is still refused.
9. **The segment cache** sees a re-brushed lip.

**Red before:** rows 1–5, 7 and 8 failed on 98e3d81 with `FLIGHT_OFFSET` (7 red, the byte-identical guard green). Row 7 was red again after the adapter change, on the close's model (657 m) and then its seam tangent (0.0749 rad), until close.js learned the lip. Row 9 was added after its risk was seen; mutant J25 is its proof.

**Amended by name, because their rule changed:**
- **core_offset** "offsets must fade to 0 before a jump": now accepted.
- **core_piece row 4:** a saved jump re-adds after an unfaded hill.
- **jump-ui:** the FLIGHT_OFFSET refusal row is removed, and **row 1c** replaces it: the same brushed head, through the shell's own brush, now places the jump, as one undo step. On the base, that same shell refused it.

**The mutants added to core_jump_mutation, all caught by row 8:**
- J20: the lip's height dropped;
- J21: the slopes dropped from the take-off tangent;
- J22: the landing not turned by the tilt;
- J23: the landing's height from the route's end;
- J24: the curve ignoring `from`;
- J25: the cache forgetting the lip;
- J26: the close's model without the tilt;
- J27: the close's net turn without the tilt.

**Re-anchored by name:**
- J6 follows close.js's `g.to.theta`.
- J16 sits on the no-lip branch of the rewritten line. Its old anchor no longer existed.

All 27 anchors occur exactly once.

## 3. Lines and scans

- **Line endings:** every changed file is CRLF with 0 bare LF, as at HEAD.
- **Scan of the 13 files:** private 0, the word 0, credentials 0.
- **Lap ids:** no new comment carries one.

## 4. The checker run (no new red)

    checked: node SC/d549/checker.js <worktree> → SC/d549/checker.out

**The lap:** core_jump's own jump lap (a 300 m take-off, the jump 40 m on, a 300 m landing, four quarter turns at R 180, a 60 m straightening), open.

| take-off | red | amber | the jump |
|---|---|---|---|
| flat lip | 4 (self-intersection) | 3 (low-overhead) | free, gap 40.00 m, ramp 0° |
| raised 2 m at the lip | **4, the same** | **3, the same** | free, gap 40.00 m, ramp **0.20°** (the lip's slope, now the take-off's) |
| shifted 3 m, still moving | **4, the same** | **3, the same** | free, gap 40.00 m |

The 4 reds are the open lap's coil against itself, the same with or without the lip.

## 5. Not done

- **No headless look at the ghost.** The ghost's code did not change (§1).
- **The plan's falsifier waits for his hands:** a raised lip, a placed jump, an exported track. Is there a step at the lip in the game, or does the take-off pitch differ from what the builder shows?
- **No install. Nothing pushed.**

SC = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad`.

NEXT: librarian, read §1–§2; it rides the release after 0.4.31 (or 0.4.31 if the build waits for it), and the user's try in the game is the falsifier.
