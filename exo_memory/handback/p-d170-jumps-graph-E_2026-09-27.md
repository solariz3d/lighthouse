# P-D170-JUMPS-GRAPH · ECHO: the jump counter, the load graph, and a head that sits on road

**Pane E, machine D, 2026-09-27 15:5x–16:3x local.** Repo `C:\Users\nname\Desktop\t180-track-builder`, working tree
only. **Nothing committed, nothing pushed, no AC launched.** `src/doc/` and `docs/INTERFACES.md` were not edited.

## 0 · In short

- **Item 4, "0 jumps": found, reproduced first, fixed.**
  - **Cause:** the counter counted *drawn arcs*, and `jumpArcs` leaves out a PENDING jump. In C's capture the jump was
    `w5`, the open head, with no landing yet, so it was pending.
  - **Reproduction:** C's exact word sequence failed with expected 1, actual 0.
  - **Fix:** count validation's own jump list, with pending jumps named: "1 jump (1 waiting for its landing)".
- **Item 5, the grey bar:**
  - **Cause:** my D168 colour ribbon, which painted every station the same grey while there were no loads.
  - **Now:** a **load graph** in its place. It shows the hardest line's load along the track, the 20 g and 90 g limits,
    and red/amber stretches shaded. It is **hidden while there is no load.**
- **Item 3, my side:**
  - **An open end must sit on road.** A head that is a jump's flight is **red, `head-in-the-air`** (ARCHITECTURE.md:82,
    a hole).
  - **A landing ramp must catch both falls.** With a known speed, a ramp that misses either the 3.2 g or the 6.3 g
    landing is **red, `landing-misses-zone`** (ARCHITECTURE.md:75-78), on open tracks too.
  - **`landingRamp()`** in `src/validate/jumps.js` solves each touchdown exactly and gives the ramp's length.
- **Two things surfaced along the way, both real:**
  1. **My own D166 bug: validation measured every jump one station long.** It measured from the station *before* the
     lip, so a 12 m gap read 13 m at a 1 m step. The 6.3 g landing then seemed to need 311 km/h; it really needs
     **287 km/h** (`node -e` probe on straight–jump–straight at 250/300/360 km/h). Reproduced, then fixed.
  2. **A is already building the landing ramp** (`src/doc/resolve.js` and `vocab.js`, in flight since 15:57), **and
     as written every default jump in the app is red.** A sizes a jump with no speed at **300 km/h**, but validation
     checks it at the picker's **460 km/h** (FINDINGS.md:476). At 460 the 3.2 g flight carries past A's 29.8 m ramp.
     §3 is the exact, tested diff that fixes it: the ramp becomes 51.1 m, and the jump is clean at 460.
- **Tests:**
  - mine: 169 pass, 0 fail;
  - the repo: 425 tests, 418 pass, 1 fail, 6 todo. The fail is the in-flight font-blend test, failing without my
    changes too;
  - the app: 224 tests, 223 pass, 1 fail, C's in-flight lighting mutant.
- **Mutants,** on a copy: the first pass was 23 applied, 20 caught, 0 NOT APPLIED, with three survivors handled (§5).
  **Final: 22 applied, 22 caught, 0 NOT APPLIED.**

## 1 · Files

sha256 and lines are from `sha256sum` and `wc -l` at 16:2x.

| file | sha256 | lines | what |
|---|---|---|---|
| `src/validate/index.js` | `35115812f4690265…` | 339 | `head-in-the-air` and `landing-misses-zone` reds with their sources; **the lip** is now the station at the gap's start (from segment lengths), not the one before it |
| `src/validate/jumps.js` | `1f96a2c66b402928…` | 91 | `landingRamp({ D, dh, thetaRad, landRad, v, jumpG, marginM })`: the exact touchdown per fall, and the ramp length |
| `app/validate-ui/panel.js` | `e800a90fddbd4d09…` | 95 | `summary()` counts validation's jumps, pending ones included, plus `jumpsPending` |
| `app/validate-ui/graph.js` (new) | `1a7525a617a38332…` | 52 | `graphModel(state)` (null while there are no loads) and `drawGraph(canvas, model)` |
| `app/validate-ui/index.js` | `0aaec7e89284f316…` | 70 | the graph replaces the ribbon and hides when empty; the counter names pending jumps |
| `test/validate_head.test.js` (new) | `dfcb3361ab98630a…` | 111 | 9 tests |
| `app/test/validate-ui-jumps.test.js` (new) | `bfc9abe2ab06f6b5…` | 94 | 7 tests |
| `test/validate_jumps.test.js`, `test/validate_incremental.test.js`, `test/export_words.test.js`, `app/test/validate-ui.test.js`, `app/test/validate-ui-panel.test.js` (changed tests, §4) | `59ec7cc5…`, `299977e6…`, `0ba5bea9…`, `c0fe81a8…`, `a2c7af5a…` | | |

## 2 · What was found, and how

**Item 4, "0 jumps".** `summary()` returned `jumps: state.arcs.length`, and `jumpArcs` skips pending jumps: those with
no landing road yet. C's sequence (straight, sweep, turn in half-pipe, wall-ride, jump) ends on the jump, so it was
pending. Validation had it all along (`result.jumps`, `pending: true`); only the counter hid it.
- **Reproduced first:** `app/test/validate-ui-jumps.test.js`, test 1, C's sequence word for word: expected 1, actual 0.
- **Why a second reproduction was needed.** With A's in-flight ramp, that sequence no longer leaves the jump pending,
  so test 1 would pass even with the old counter. Test 2 places a jump as the FIRST word, which has no take-off road
  and stays pending under either model.
- **Checked:** with the old line put back, test 2 fails; with the fix, it passes. That check edited the live
  `panel.js` for about 2 s and restored it, confirmed by `grep`. It was brief, but it's the in-place hazard I named in
  D167, and it should have been done on a copy.

**Item 5, the grey bar.** It was mine: the D168 colour ribbon. Before D169 there were no loads, so every station
painted as clear grey. The load graph that replaces it plots, per station, the **highest** load across the lateral
lines, the line hit hardest (a wall on a half-pipe). Its y scale always includes 1.1 × the proven 90 g, so the limit
line shows; the 1.1 is inferred, a display margin. It shades red and amber stretches, and **it is not drawn at all
while there is no load**.

**Item 3.**
- **`head-in-the-air`:** an OPEN path whose last segment is a flight (`kind: 'gap'`) is red from the flight's first
  station to the head. A closed loop has no head. The old open-head exemption stays for a non-jump gap still being
  placed, and the pending jump itself is still reported as pending, not failed.
- **`landing-misses-zone`:** at a known take-off speed, every landing jumps.js cannot catch on the landing road is red,
  with `worst` the heaviest fall that misses. With no speed, nothing about a landing is claimed. Before this, only a
  CLOSED lap's proof said it.

**The lip (my D166 bug).** Validation took the take-off point as `S[first − 1]`, the station before the flight. C's
`buildPath` gives the boundary station to the segment it starts, so the station before the flight is one step *before*
the edge. Every jump read one step too long, and 1–2 m on a 12 m jump is a lot.
- **Found** when A's ramp, sized for 300 km/h, validated red at 300 km/h.
- **Reproduced first:** "validation measures a jump from its LIP" failed with `step 1: gap 13.000000000000014`.
- **Fixed:** the lip is the station at the gap's start s, from the segment lengths. A hand-built path with no lengths
  keeps the old rule, which is right for it, because it samples its boundary onto the road before.
- **Measured after:** a default jump on straight–jump–straight reads 12.000 m. Its landings need 205 km/h (3.2 g) and
  **287 km/h (6.3 g)** (`node -e` probe on a 2 m step).

## 3 · The model change for A: the exact diff (applied and tested on a copy, not on A's files)

A's in-flight implementation already does what the review asks: the jump word emits the flight, then a `part: 'land'`
road ramp at the landing pitch, on the take-off road's profile. **It is the right shape, and I propose only two
changes:**

1. **Size a jump with no speed at `MACH6.designSpeedKmh` (460 km/h, FINDINGS.md:476), not 300.** Validation checks it
   at the picker's speed, which defaults to 460. As written, every default jump is red in the app. Measured on A's
   current tree, a straight then a jump, 2 m step:

   | take-off | A's ramp (sized at 300) | 3.2 g lands | red |
   |---|---|---|---|
   | 300 km/h | 29.8 m | 9.3 m past the lip | — |
   | **460 km/h** | 29.8 m | **misses** | **`landing-misses-zone`** |

   With the diff: a 51.1 m ramp, landings 31.1 m and 12.5 m past the lip at 460 km/h, clean at both speeds.
2. **Solve the touchdowns exactly with `src/validate/jumps.js` `landingRamp()`,** rather than a 2,000 m search sampled
   every 0.5 m. There is one sizing rule, owned by validation and used by both. `SEARCH_M`, `STEP_M` and the extra
   sample step go away.

`test/doc-jump.test.js` is A's, and it pins "the stated default, 300 km/h". The diff includes its update, so it is
A's decision and not mine.

**Verified on a full copy of the tree** (`scratchpad/d170/copy`) with the diff applied: `node --test "test/*.test.js"`
gives 422 tests, 415 pass, 1 fail, 6 todo. The fail is the font-blend test, which fails on the live tree without the
diff too. My validate-ui, handles, shell and palette tests on the copy: 122 pass, 0 fail.

The diff is against A's working tree at `src/doc/vocab.js` `d0087660899b20d3…`, `src/doc/resolve.js`
`df0c85c385de4720…` and `test/doc-jump.test.js` `d7d4431d2ed189f3…`:

```diff
--- a/src/doc/vocab.js
+++ b/src/doc/vocab.js
@@ -58,9 +58,10 @@
 // THE LANDING RAMP a jump carries (the D170 review: "a jump word should carry its landing ramp, so the head sits on road
 // and the next piece starts on the landing"). It is sized by src/validate/jumps.js: the flight is followed at both
 // measured falls (MACH6.jumpG, 3.2 g and 6.3 g, FINDINGS.md:336-337), and the ramp runs past the farther touchdown by
-// RUNOUT_M. Defaults (inferred, to be tuned): RUNOUT_M 20 m, MIN_M 20 m (the ramp when no fall clears the gap),
-// SEARCH_M 2,000 m (how far along the ramp a touchdown is looked for), and DEFAULT_KMH 300 (the speed a jump with no
-// speed of its own is sized for: the platform test's design speed, the middle of its 250–350 km/h band).
-const LANDING = Object.freeze({ RUNOUT_M: 20, MIN_M: 20, SEARCH_M: 2000, STEP_M: 0.5, DEFAULT_KMH: 300 });
+// RUNOUT_M. Defaults (inferred, to be tuned): RUNOUT_M 20 m, MIN_M 20 m (the ramp when no fall clears the gap). A jump
+// with no speed of its own is sized for the program's design speed, MACH6.designSpeedKmh (460 km/h, docs/FINDINGS.md:476),
+// the speed validation checks it at by default. The touchdowns are solved exactly (src/validate/jumps.js landingRamp),
+// so there is no search distance or sampling step.
+const LANDING = Object.freeze({ RUNOUT_M: 20, MIN_M: 20 });
 
 module.exports = { DEG, TEMPOS, FONTS, WORDS, ROAD_HANDLES, JUMP_HANDLES, RAMP_M, LANDING, handlesOf };
--- a/src/doc/resolve.js
+++ b/src/doc/resolve.js
@@ -26,7 +26,7 @@
 'use strict';
 
 const { TEMPOS, FONTS, LANDING } = require('./vocab.js');
-const { checkJump } = require('../validate/jumps.js');
+const { landingRamp: sizeLanding } = require('../validate/jumps.js');
 const { MACH6 } = require('../validate/limits.js');
 const { checkDoc } = require('./serial.js');
 
@@ -79,25 +79,23 @@
 const flatProfile = () => profileOf('flat', { width: FONTS.flat.width, wall: 0, psiL: 0, psiR: 0 });
 
 /**
- * Size a jump's landing ramp with validation's own jump check (src/validate/jumps.js checkJump, the projectile at
- * g_eff): the ramp is the line from the landing lip at the landing pitch, and the flight is followed down onto it at
- * each measured fall (MACH6.jumpG). The ramp runs past the FARTHER touchdown by LANDING.RUNOUT_M. With no speed on the
- * jump, it is sized for LANDING.DEFAULT_KMH, and says so. If no fall clears the gap at that speed, the ramp is
+ * Size a jump's landing ramp with validation's own jump model (src/validate/jumps.js landingRamp, the projectile at
+ * g_eff): the ramp is the line from the landing lip at the landing pitch, and each measured fall (MACH6.jumpG) is
+ * solved exactly onto it. The ramp runs past the FARTHER touchdown by LANDING.RUNOUT_M. With no speed on the jump, it
+ * is sized for MACH6.designSpeedKmh (FINDINGS.md:476), the speed validation checks it at, and says so. If no fall clears the gap at that speed, the ramp is
  * LANDING.MIN_M long and `landing.why` says why: the jump itself is then a red for validation, not for this sizing.
  */
 function landingRamp(lipPitch, h, speed) {
-  const v = Number.isFinite(speed) && speed > 0 ? speed : LANDING.DEFAULT_KMH / 3.6, speedFrom = speed > 0 ? 'word' : 'default';
-  const tanL = Math.tan(h.land), cosL = Math.cos(h.land), road = [];
-  for (let x = h.gap; x <= h.gap + LANDING.SEARCH_M + 1e-9; x += LANDING.STEP_M) road.push({ x, y: -h.drop + (x - h.gap) * tanL });
-  const r = checkJump({ D: h.gap, dh: -h.drop, thetaRad: lipPitch, v, landingRoad: road, jumpG: MACH6.jumpG, reach: MACH6.reach });
-  const touchdownsM = r.landings.map((l) => (l.x == null ? null : (l.x - h.gap) / cosL));
+  const v = Number.isFinite(speed) && speed > 0 ? speed : MACH6.designSpeedKmh / 3.6, speedFrom = speed > 0 ? 'word' : 'default';
+  const cosL = Math.cos(h.land);
+  const r = sizeLanding({ D: h.gap, dh: -h.drop, thetaRad: lipPitch, landRad: h.land, v, jumpG: MACH6.jumpG, marginM: 0 });
+  const touchdownsM = r.touchdowns.map((t) => (t.x == null ? null : (t.x - h.gap) / cosL));   // along the ramp
   let far = -1, sizedBy = null;
-  r.landings.forEach((l, i) => { if (touchdownsM[i] != null && touchdownsM[i] > far) { far = touchdownsM[i]; sizedBy = `${l.g}g`; } });
-  const missed = r.landings.filter((l, i) => touchdownsM[i] == null).map((l) => `${l.g} g`);
+  r.touchdowns.forEach((t, i) => { if (touchdownsM[i] != null && touchdownsM[i] > far) { far = touchdownsM[i]; sizedBy = `${t.g}g`; } });
+  const missed = r.touchdowns.filter((t, i) => touchdownsM[i] == null).map((t) => `${t.g} g`);
   const why = sizedBy === null ? `neither fall clears the ${h.gap} m gap at ${(v * 3.6).toFixed(0)} km/h, so the ramp is the ${LANDING.MIN_M} m minimum`
-    : missed.length ? `at ${missed.join(' and ')} the flight does not come down on the ramp (it falls short or runs past ${LANDING.SEARCH_M} m)` : null;
-  // + one sample step: checkJump interpolates the touchdown linearly between road samples, and a ramp must err long
-  const length = sizedBy === null ? LANDING.MIN_M : Math.max(LANDING.MIN_M, far + LANDING.STEP_M + LANDING.RUNOUT_M);
+    : missed.length ? `at ${missed.join(' and ')} the flight does not clear the gap at ${(v * 3.6).toFixed(0)} km/h` : null;
+  const length = sizedBy === null ? LANDING.MIN_M : Math.max(LANDING.MIN_M, far + LANDING.RUNOUT_M);
   return { length, landing: { speed: v, speedFrom, touchdownsM, sizedBy, runoutM: LANDING.RUNOUT_M, why } };
 }
 
--- a/test/doc-jump.test.js
+++ b/test/doc-jump.test.js
@@ -71,12 +71,12 @@
   assert.ok(jumpSegs(jumpDoc(350))[1].length > jumpSegs(jumpDoc(250))[1].length);
 });
 
-test('with no speed on the jump the ramp is sized for the stated default, 300 km/h, and says so', () => {
+test('with no speed on the jump the ramp is sized for the design speed, MACH6.designSpeedKmh (460 km/h, FINDINGS.md:476), and says so', () => {
   let d = D.createDoc('n');
   d = D.appendWord(d, 'straight', { handles: { climb: 4 * DEG } }); d = D.appendWord(d, 'jump');
   const L = jumpSegs(d)[1].landing;
   assert.equal(L.speedFrom, 'default');
-  assert.ok(Math.abs(L.speed - kmh(300)) < 1e-9);
+  assert.ok(Math.abs(L.speed - kmh(require('../src/validate/limits.js').MACH6.designSpeedKmh)) < 1e-9);
 });
 
 test('a jump no fall clears at its speed still gets a ramp, the minimum, and says why it was not sized', () => {
```

**The proposed INTERFACES.md lines (B's file, not edited).**

`:43` becomes:

> A jump resolves to TWO segments, the flight (`part: 'gap'`, `kind: 'gap'`) and its landing ramp (`part: 'land'`,
> `kind: 'road'`, straight at the landing pitch, on the take-off road's profile), sized by `src/validate/jumps.js`
> `landingRamp` so that both measured falls come down on it at the jump's speed (else `MACH6.designSpeedKmh`), plus a
> run-out. The ramp carries `landing: { speed, speedFrom, touchdownsM, sizedBy, runoutM, why }`.

`:50`: `part` becomes `'in'` \| `'body'` \| `'out'` \| `'gap'` \| `'land'`.

**And a line for §3 (validation):** "An open path's head must sit on road: a head that is a jump's flight is red
(`head-in-the-air`, ARCHITECTURE.md:82). At a known take-off speed, a landing the road does not catch is red
(`landing-misses-zone`, ARCHITECTURE.md:75-78)."

## 4 · Tests

| command | result |
|---|---|
| `node --test --test-reporter=tap test/validate*.test.js test/export_words.test.js app/test/validate-ui*.test.js app/test/handles*.test.js` | **169 tests: 169 pass, 0 fail** |
| `node --test --test-reporter=tap "test/*.test.js"` | **425 tests: 418 pass, 1 fail, 6 todo.** The fail is the in-flight font-blend test, failing without my changes too |
| `node --test --test-reporter=tap "app/test/*.test.js"` | **224 tests: 223 pass, 1 fail**, C's in-flight lighting mutant (`mutation B2 one-sided light`) |

**The packet's five, all present:**
1. **A document with one jump counts 1 jump.** C's sequence, plus the jump-first case that stays pending under either
   model.
2. **The graph bar is hidden with no speed and drawn with one.**
   - With no speed, `graphModel` is null, both empty and after placing words.
   - With the default speed there is one point per station, each the hardest line (on a right turn, where the hardest
     line is not the first one), with the car's two limits, and the 90 g line always on the scale.
   - With amber, the stretches are shaded.
3. **A floating head after a jump without a ramp is red:** `head-in-the-air`, sourced, and the jump pending.
4. **One with the ramp is clean:** no red, and the head is a road segment.
5. **The landing position is in the zone at both landings.**
   - Validation catches both, and each touchdown x lies between the lip and the ramp's end.
   - `landingRamp`'s touchdowns sit on the ramp line to 1e-9 m.
   - A ramp at 40% length is red at 3.2 g.
   - At 200 km/h the 6.3 g fall cannot clear, and it is red at 6.3 g.

**Also:** with no speed, no landing red (while the floating head is still red); a closed loop has no head; `landingRamp`
refuses no gap or no speed; the jump is measured from its lip at 1 m and 2 m steps; through the shell, the head is red
exactly when the path ends in a flight, and landing road clears it.

**Tests I changed, each marked `CHANGED 2026-09-27 (D170)` in the file with its reason:**
- `test/validate_jumps.test.js` "an open head that ends in the air is a pending jump, not a failure", and
  `test/validate_incremental.test.js` "…head is a gap (mid-build): no gap-in-road red…". Both asserted *no red at all*,
  the rule this packet reverses. The jump stays pending and there is still no gap-in-road red; the head is now red. The
  incremental one also asserts the red's extent: the flight's first station to the head.
- `app/test/validate-ui.test.js` "a landing the flight misses…": 300 → 250 km/h. Its premise ("6.3 g needs 86.4 m/s")
  came from the one-station-long gap; measured from the lip it needs 287 km/h.
- `test/export_words.test.js` (mine, D167) "a lap the proof fails…": 300 → 250 km/h, the same reason.
- `app/test/validate-ui.test.js` "a jump still waiting…" and `app/test/validate-ui-panel.test.js` "a jump placed at
  the open head…": under A's ramp a jump at the head is no longer waiting. They now build a flight-ended path by hand,
  or assert what holds under either model.

## 5 · Mutation results (`scratchpad/d170/mutate_d170.js`, on a copy, one progress line per mutant)

**First pass: 23 applied, 20 caught, 0 NOT APPLIED.** The three survivors:

| survivor | what it was | now |
|---|---|---|
| `graph: first line, not the hardest` | a vacuous test: on a left turn the hardest line IS the first one | a right-turn test that asserts somewhere the hardest line is not the first |
| `index: head rule on closed paths too` | untested: no test had a closed path ending in a flight | "a CLOSED loop has no head" |
| `index: gap start from lengths only` | **equivalent**: on C's paths the segment lengths sum to exactly `path.starts[j].s` | the `path.starts` branch deleted; its mutant dropped with it |

**Final: 22 applied, 22 caught, 0 NOT APPLIED; copy restored equal to live: yes.** They cover the counter, pending, the
graph (null, hardest, scale, limits, bands), the head rule (on/off, closed, extent), the landing check (on, speed-gated,
worst), the lip (the old bug, the other boundary rule), the jump-first case, and `landingRamp` (root, farthest, land
pitch, margin, unclearable, no speed).

## 6 · NOT verified

- **Nothing in a window.** The graph's canvas drawing, the hiding, and the counter's text are not seen: only their
  models, through A's real shell.
- **A's diff is tested on a copy, not applied.** Whether A adopts it, especially the 460 km/h sizing, is A's call. If A
  keeps 300, every default jump in the app is red at the picker's default.
- **The ramp is sized at one speed.** A car faster than the jump's speed (or the picker's) carries past it, and
  validation then says so. Sizing for the lap sim's 764 km/h cap instead would make every ramp much longer; not
  proposed.
- The 1.1 graph margin and the 10 m `landingRamp` default margin are inferred. A's diff passes `marginM: 0` and keeps
  its own 20 m run-out.
- The font-blend failure (repo) and the lighting mutant (app) are other seats' in-flight work, not investigated.

## 7 · CHANGELOG lines (for B)

```
### Added
- A load graph in the validation panel: the hardest line's load along the track, with the 20 g and 90 g limits and
  the red and amber stretches shaded. It is hidden while there is no load (no design speed), where the old colour strip
  showed an empty grey bar.
- Validation: an open track's head must sit on road. A head that is a jump's flight is red (`head-in-the-air`). At a
  known take-off speed, a landing the road does not catch is red (`landing-misses-zone`), on open tracks as well as in
  the closed lap's proof.
- `src/validate/jumps.js` `landingRamp()`: the exact touchdown of each measured fall on a straight landing ramp, and
  the ramp length that catches both.

### Fixed
- The jump counter read "0 jumps" with a jump placed: it counted drawn landing arcs, which leave out a jump still
  waiting for its landing. It now counts every jump and names the ones waiting.
- Validation measured every jump one station step too long (from the station before the lip), so a 12 m gap read as
  13 m and the 6.3 g landing seemed to need 311 km/h instead of 287.
```

NEXT: librarian call_librarian with the pointer when the hand-back is written
