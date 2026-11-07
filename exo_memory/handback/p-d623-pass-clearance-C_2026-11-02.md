# D623: the pass-clearance rule and the builder's refusal (pane C)

Seat: pane C, sibling-0845a868. Order: `[chair:MAIN]` D623, 2026-11-03T00:44Z. Branch `d623-c` off public main `a005e1d`, worktree `Desktop\worktrees\t180-c623`.
Tier: PROVE IT for the rule's maths; CHECK IT for the refusal UI.

## 0. For A, first: the function (stable)

```js
const { passClearance, CAR_MARGIN_M } = require('../validate/passclear.js');   // src/validate/passclear.js
passClearance(path, segments, { apronM, marginM, minSeparationM, from })
  -> [{ s, u, otherS, otherU, gapM, needM, shortM, surfaceGapM, apron, onApron, hullM, clip, at }]   // one per station that has one, by s
```

- **`path`:** the LIFTED path, as the export builds its road: `liftPath(buildPath(segs, …))`; samples with `s`, `seg`, `pos`, `T`, `L`, `U`.
- **`segments`:** the export's segments.
- **`apronM`:** the track's apron width, `doc.edgeApronM` (default `apron.js APRON_WIDTH_M`, 2 m). 0 means no apron.
- **`marginM`:** the car's room, default `CAR_MARGIN_M` = 3.1 m. Must be above 0.
- **`minSeparationM`:** default 25 m, as validate's `stacked()`.
- **`from`:** a station index; only stations from it lead. Default 0, the whole track.
- **Each finding** is the station whose car room the other pass's solid reaches:
  - `gapM`: how far over its surface that solid comes, along its normal; negative means through it;
  - `shortM` = `needM − gapM`;
  - `surfaceGapM`: the other pass's own surface there, its road, or its plank when `apron` is true;
  - `onApron`: this road's point is on its apron;
  - `hullM`: the other pass's depth there;
  - `clip`: the physics surfaces themselves touch or pass through;
  - `at`: the world point.
- It throws a plain `Error` on `marginM <= 0` or `apronM < 0`.
- **Cost:** 1.3–2.5 s on his 25 km ELYSIUM; tens of ms on a fixture.
- `validate()` runs it only on request (`opts.passClearance`, with `opts.apronM`). The export's own validate call does not ask, so the export is unchanged until your warning row calls the function itself.

## 1. STATUS: the rule and its proof are done; the builder's refusal breaks 46 existing rows. NOT committed. One decision is the chair's (§6).

## 2. The rule (`src/validate/passclear.js`, new)

**The model, read from the path (no mesh), per road station:**
- **its SOLID:** every lateral point (at most 1 m apart), from the road surface down to the hull's bottom.
  - The hull hangs along the section's up (`underskin.js skinDir`), at the export's depth: `UNDERSKIN_OFFSET_M` (1.5 m), deepened toward an edge that rises by `hullDepth(rim)` times x² (`rowDepths`' rule).
  - Beyond each edge with an apron (not a closed ring, rim under 60°, apron width over 0): the plank, at 25° down, with a box under it down to the edge's own depth.
- **its CAR ROOM:** 3.1 m along the surface's normal, over the road and over its aprons, since a wheel off the road runs onto the apron.
- **Two stations of different passes** (25 m apart along the lap, as `stacked()`) break the rule where one's solid reaches into the other's car room.
  - So a road over another keeps its hull's bottom 3.1 m over the lower road.
  - Upside down, it keeps its ROAD 3.1 m clear, since its hull is on the far side.
  - Roads that meet are the case with no room at all.

**The number:** `CAR_MARGIN_M = 3.1` m.
- **Why 3.1:** the replay's highest collision-box top was 2.42 m (D616 §9), and the camera behind the car has its eye 3 m up the road; the tube rule reads the same eye with the same 0.1 m to spare.
- **So the bound road to road:**
  - 4.6 m over a flat road (hull 1.5 m; `hullDepth(0)` is also 1.5);
  - 5.43 m under an edge rising 30°;
  - at most 6.1 m (HULL_EDGE_MAX_M 3).
- **Stricter than the export in two places, said:** the hull's eases where its apron stops (`hullEase`) and in a twist (`hullScaleAt`) make the export's hull shallower. The rule reads the full depth.
- **Not modelled:** the pit lane, and a profile blended along a piece (read at its segment's profile, as the stack reads it).

## 3. Where it is used

- **`validate()`:** a red, `'pass-clearance'` (worst: metres short), only on request: `opts.passClearance`, `opts.apronM`.
  - It reads the whole track, like the roll rate, so revalidate equals validate.
  - It is skipped while a drag's window leaves the rest pending.
  - Its source line is in `SRC`; its plain words are in `app/validate-ui/labels.js`.
- **The track checker** (`app/validate-ui/panel.js`) asks for it, with the track's apron width (`shell.edgeApron()`).
- **The builder** (`app/core/coreshell.js commit()`, every piece placement and every simple edit):
  - An edit that makes a NEW break is refused, by name, and nothing changes. The message:
    > too close to another pass of the road: the road at 0.76 km (p4) meets the road at 0.12 km (p1); a road over another must keep its underside 3.1 m clear for a car (36 places). Nothing changed.
  - It reads from the first station the edit moved; the whole track when the apron width changed.
  - A break the track already had (the same place, s and the other pass's s within 4 m or the point within 2 m, at least as short) does not refuse an edit.
- **The export does not ask.** A's warning row calls the function itself.

## 4. ELYSIUM and his other tracks: what shows red (copies, read-only; `EV/his-tracks.txt`, `ely.js`)

| track | places | where | worst |
|---|---|---|---|
| ELYSIUM | 1 | p41 s 23,720–23,734 under p38 s 22,663–22,665 | 4.81 m short; **the planks meet (clip)** |
| CRAZY TEST | 1 | p11 s 14,237–14,293 under p9 at s 4,990 | 1.14 m short |
| TEST 10 | 3 | **p5 under itself** (s 2,562–2,940 against s 2,930, 355 m on); p16 under p4 and under p8 | 4.21 m short, clip (p5); 0.15 and 0.16 m (p16) |
| testtrack10 (the tracked fixture's track) | 1 | the same p38 crossing | 4.86 m short, clip |
| tube cases | 0 | | |

- **TEST 10's p5 is the case D446 ruled "not a gap":** the road curls back on itself, its lip 0.64 m from the other pass's lip. Under this rule it is red. That is his to know.
- **ELYSIUM in the app** (§5): "2 red · 33 amber · lap proved". The first red reads "another pass of the road is too close over this one here: … at 22663–22665 and 23720–23734 m". The second is the older one.
- Cost: 1.3–2.5 s for a whole-track read on ELYSIUM, 0.4–1.1 s on the others.

**The older 0.88 m apron-over-apron overlap (p38 × p41): CAUGHT, inside the same red, as a clip.**
- At those stations the two physics surfaces lie on both sides of each other: clip true at both passes.
- The export's own closest pair, a p38 plank vertex 0.96 m from p41's edge (`cmpmesh.js`, a node export of ELYSIUM), is at p41 s 23,722, inside the red.
- **inferred, a limit:** my planks are straight 25° lines, so at the worst point they read p38's plank 0.21 m above p41's where the export has them through each other. The red is there regardless: the hull and the margin dominate it.

## 5. The shot (headless, `EV/shot/`)

- The real page, headless, served from the worktree. It opens the user's ELYSIUM copy (File ▸ Open, with the native side stood in for, as `preview-lod-frame.test.js` does). Page errors 0.
- **The checker's red list names the place** (`EV/shot/redlist.txt`, and in every shot): "2 red · 33 amber · lap proved", with the red line above. Checked by me.
- **What the shots do NOT show:** the red stretch on the 3D road.
  - It is 4 m on p38 and 14 m on p41.
  - Focusing the camera there (`t180-camera-focus`) gives a free view where I could see the checker's amber tint but no red patch.
  - The Overhead view shows the whole 25 km.
  - Clicking the red entry did not move the camera.
- So the shot shows the place by its listing, not a red patch on the road.

## 6. The tests

**PROVE IT, the maths: `test/passclear.test.js`, 10 rows, 10/10.**
- 1: just inside / just outside the bound on a flat crossing. The road gap is bisected to the bound ± 5 cm; inside is found 5 cm short, outside finds nothing.
- 2: the finding is the upper road's underside, and its parts add up to the measured gap.
- 3: a level crossing is a clip.
- 4: BANKED: at a height a flat crossing clears, a 45° bank is found, at the road gap less |u|·sin 45°.
- 5: INVERTED: a gap that breaks the bound upright is clear upside down; below 3.1 m it is found at the road itself.
- 6: side by side 1.5 m apart, the aprons reach under each other's; with no apron, nothing.
- 7: one pass is never against itself (a 26 m road round a 16 m hairpin; the stadium closed).
- 8: `from`.
- 9: bad inputs refused by name.
- 10: the solid is the export's (`rowDepths`' rule and the apron's box, from the export's constants).

**Red first:**
- Without the rule the file is red (module not found).
- Mutants on `passclear.js` (`EV/mutrun.out`): **applied 13 / caught 13 / NOT APPLIED 0**. Two of them are the real bugs I made on the way:
  - every road read as a closed ring, so no aprons;
  - a level crossing missed.
- **Correction:** the rows were written after my first draft of the rule, not before. The red evidence is the absence and the mutants, not a row seen red first.

**CHECK IT, the refusal: `app/test/core-pass-clearance.test.js`, 4 rows, 4/4.**
- a level straight back across the first is refused by name and nothing changes;
- placed 8.4 m over the first, it is placed;
- a track that already breaks is still edited elsewhere;
- the checker shows the red at both passes, in plain words.

**THE CASCADE: the touched and neighbouring files, 864 tests, 818 pass, 46 fail** (`EV/touched-1-summary.txt`; it ran on a tree a few edits older than this one).
- **About 15 rows:** fixtures built THROUGH THE SHELL with stacked roads on purpose, now refused by the guard. They are D432's rule that two passes may be under 2 m apart when they do not clip, the rule the user's 18:35 word replaces:
  - the two-circle coil "as TEST 1 stacked";
  - Close's laps;
  - the pieces UI's circles;
  - the readout displays.
- **About 8 rows:** Close refuses because its bar counts the checker's new reds (`pass-clearance` in "it adds N reds").
- **About 8 rows:** the incremental-validate property tests. Their reference `validate()` options (`OPTS`) do not ask for the rule while the controller now does. The property itself holds: the red is a whole-track read that `_raw` never carries.
- **The rest are downstream of a refused fixture:** pit-lane exports, a mutation harness's own control, a cut.

## 7. The decision (the chair's), and what I recommend

The builder refusal the order asks for necessarily changes behaviour that about 18 test files pin.

**Recommended: amend by name, each with a comment citing the user's 18:35 word:**
- fixtures that need stacked road open it with `adopt()` (a track saved that way), not by building it through the guarded shell;
- the incremental tests' `OPTS` ask for the rule as the controller does;
- Close keeps counting it as a red it may not add. That is the same rule as the builder's: Close is an edit.

**The alternative:** the guard only on piece placement (extend, turn, level, sharp, jump, insert), with Close and the shell's other edits left to the checker's red. That cuts the cascade to the fixture rows only.

**Either way, his TEST 10 (p5 under itself) and CRAZY TEST open red.** A user who tries to rebuild a TEST-1-style stacked coil is refused.

## 8. State

- Worktree `t180-c623`, branch `d623-c` off a005e1d, **nothing committed**.
- Changed: `src/validate/passclear.js` (new), `src/validate/index.js`, `app/core/coreshell.js`, `app/validate-ui/labels.js`, `app/validate-ui/panel.js`, `CHANGELOG.md`, `test/passclear.test.js` (new), `app/test/core-pass-clearance.test.js` (new).
- All CRLF.
- **Sweep:** the added lines have term hits 0. The first draft had one term in three new lines (a word for the camera behind the car); I reworded them before anything was committed. Older lines on public main keep theirs.
- Nothing written to his tracks or the AC folders. acs.exe checked before each run. Every child process hidden; Chrome headless.

SOURCES: the order D623; D616 and D617's hand-backs; `src/export/underskin.js`, `apron.js`, `src/validate/index.js` at a005e1d; the runs in EV.

---

## 9. After the ruling (the chair, 01:44Z: amend by name; the red drawn on both passes; commit)

**Committed: t180 `d623-c` at `72fff66`** (over a005e1d), by named paths. 28 files, +626 / −54. Not pushed.

**The red is drawn on the road, and the click moves the view.**
- **Correction to the chair's premise:** no red was ever drawn on the 3D road, for any reason. `git log -S` finds no listener of the checker's `t180:validation` event in the preview, ever.
- What I built:
  - `app/preview/preview.js` `setReds` / `redMarks`: every station of a red range gets a line across the road, in the checker's red. All reds are drawn, not only this one.
  - `app/preview/index.js` listens to `t180:validation`.
  - `app/validate-ui/index.js`: a red entry is clickable, and sends `t180-camera-focus` to its places in turn. `labels.js findingGroups` now carries `places`.
- **The shot, on ELYSIUM, headless, checked by me** (`EV/shot/shot-red-entry-1.png`, `-2.png`):
  - after the first click, the view is at p38's place: red lines across both passes' road, 2 on p38 above and 8 on p41 below;
  - after the second click, at p41's place, the same two bands.
  - page errors 0.

**The amendments, by name,** each citing the user's word ("forbid building the track a little closer because of the bulk of the underside"):
- **Stacked or self-meeting fixtures are made with the core's own `extendCorner` and opened (`adopt`) or committed as one edit (`commitDoc`):**
  - the four-quarter-turn lap whose circle comes back onto its first straight: close-worker, core-close-preview, core-buildmenu, core-cut, core-eqonly, core-textures, sculpt-tools, core-pitlane ×2, core-pitlane-even, core-readout-display, preview-async;
  - the two-circle coils: core-check-lean, core-pieces-ui;
  - the 100 km track whose 800 m pieces keep the turn before them and circle back over themselves: pick-cull, preview-lod-frame.
- **"Any edit" made smaller (5 m, short of the start) where 20 or 50 m laid road past the start onto it:** close-worker rows 3 and 7, core-close-preview row 7. In core-readout-display, the coil's last piece is taken off instead of 50 m added.
- **`validate-ui-incval`'s `OPTS` ask for the rule**, as the controller does.
- **`stacked_not_red` row 8:** Close refuses the coil, by self-intersection OR pass-clearance.

**What the cascade taught the rule, each with a test or mutant:**
- **An OPEN TRACK'S SEAM is not a pass.** Two cases:
  - the last piece laid along the first (within 30°), which is how a lap is built before Close;
  - stations within 25 m of both ends (a bend that opened a closed lap).
  - A last piece ACROSS the first is still found: row 1's crossing.
  - Without this, the builder refused the ordinary lay-the-last-piece-then-Close.
- **The same pass reaches as far as the two sections' lateral reach added** (road and apron), not only 25 m: the panel's default 35 m road, cupped, 300 m then a 750 m turn, read two stations 28 m apart as passes. I had removed this widening once, on a subset artifact; the readout row showed it is needed.
- **A clip is kept per station when the other's surface lies on both sides of this one** (`stacked()`'s sign test), not only at a sampled point within 1 mm.
- **During a drag window, the settled stations keep their findings** (`validate-ui-incval` row 9: never a stale clean).
- **Not listed as unchecked** when not asked: the export printed it as a warning with a source path in it (core-shell D464).

**The runs, all on the final tree, under the lock, BelowNormal, acs.exe checked before each:**
- **Mutants on `passclear.js`, against passclear, core-pass-clearance, core-readout-display and sculpt-tools: applied 18 / caught 18 / NOT APPLIED 0**, the unmutated control passing (`EV/mutrun3.out`).
  - P6 is withdrawn with its code.
  - P19 (the 25 m ends) survived a run that did not include sculpt-tools, and is caught by it.
- **The touched set: 1,029 tests, 1,029 pass, 0 fail** (`EV/touched-3-summary.txt`). It covers:
  - `test/validate*`, `stacked_not_red`, `passclear`;
  - `app/test/validate-ui*`, `redgroups`, `core-*`, `close-*`, `sculpt-tools`;
  - the preview tests but the three that time frames;
  - `camera`, `pick-cull`.
- **Not run:** `preview-lod-frame`, `preview-close-reuse`, `preview-speed` (frame and timing rows). preview-lod-frame's fixture is amended; its rows need a quiet machine.
- **His tracks, reread on the final rule:** unchanged from §4 (`EV/his-tracks.txt`).

**Sweep:** the commit's message and added lines have term hits 0, and credential prefixes 0. The evidence folder: 22 files, term hits 0.

**Corrections in this round:**
- My first two amendments by line number caught the wrong lines (core-pitlane's tube lap, preview-async's openLap). Both were found by reading the diff and fixed before the run.
- My first P19 verdict ("dead code") was wrong: the runner did not run the test that holds it.

NEXT: librarian collate D623 with A's warning row when both are in; the chair names the landing.

## 10. A's four red files (the chair, 06:40Z, BLOCKING): the cause, and the commit fcf70e3

**The cause.** 72fff66 changes no exporter code and moves no exported byte on purpose. The export test's lap (`pitLap`: a 600 m straight, four quarter turns at R 180, 60 m, Close) lays its fourth turn back onto its own first straight. The new guard refused that turn, the 60 m and the Close still went through, and so the test exported a three-turn lap.
- checked: `EV/r3/lapsteps.js` on a005e1d vs 72fff66 → base 898 segments, every step null; 72fff66: `turn3 … PASS_CLEARANCE: … the road at 1.65 km (p5) meets the road at 0.52 km (p1) … (17 places)`, then 756 segments, closed.
- checked: `PRINT_D437B=1 node --test --test-name-pattern="row 1" app/test/export-isolated.test.js` → a005e1d `a5eef6d390282bc0`; 72fff66 `c41cdb114d71bb2c`; fcf70e3 `a5eef6d390282bc0`. The open TEST export is `8c49973d829104e6` in all three.
- **No pin was moved.** The fixture was amended by name (the same pieces made with the core, `turnby.js extendCorner`, then `adopt`, then Close, as core-pitlane's lap() in 72fff66), and the pin is a005e1d's again.

**The app mutation harness.** Its control did not fail on an anchor. The temp copy it builds (`runMutant`) lacked `app/validate-ui/colour.js`, which preview.js now requires for the checker's red, so preview.js could not load.
- One line copies that file, as the 0.4.29 line copies zonegrab.js. It requires only src/, which is already copied.
- checked: `EV/r3/anchors.js` → the same on a005e1d and on 72fff66: 104 rows, 1 anchor not exactly once (A11, renderer.js, 2 times, already so at a005e1d). No preview.js anchor moved.

**The same fault was wider than A's four, and my touched set had missed it.**
- `EV/r3/lapprobe.js` and `probe2.js`: every variant of this lap is refused at a turn (bowl 600, bowl 300, tube t360, tube t280, a 300+200 start, a 30+300 start, the curved lap with no straight), and Close then closes the shorter road with no red. `message === null` assertions do not see it, because the next extend clears the message.
- A preload logger (`EV/r3/refusallog.js`: it wraps createCoreShell and logs every new PASS_CLEARANCE message with the test line) ran over all 68 shell-making test files bar the 4 timing ones (`EV/r3/diag.sh`, one slot, under the lock).
  - First pass (after the four-turn sites were amended): 25 refusals at 12 sites and 9 failing rows (`EV/r3/diag-summary.txt` was overwritten by the second pass; its rows are in `five-c-summary.txt`).
  - The same 5 files without the preload, on a005e1d and on the working tree (`EV/r3/five.sh`): a005e1d 44/44; the working tree 35 pass / 9 fail. These are the files guides, undo-reopen, core_gridturn, core_segcache and core_segcache_lift (`EV/r3/five-base-summary.txt`, `five-c-summary.txt`). **These 9 rows are red at 72fff66 too, and were missed by my D623 touched set.**
- Every refusal is a real break of the rule as built. `EV/r3/probe3.js` and `probe4.js` give each one's message:
  - circles back onto the first straight (16 four-turn sites, by regex, counted per file: `EV/r3/amend.js` and `amend2.js`);
  - a pitch of 0.05 rad/m over 250 m (guides' "hilly" track), which is a vertical loop over its own road;
  - a spiral whose reverse turn crosses its first straight (core_gridturn);
  - a tube and cup that keep turning at about 50 m with a 31–40 m road, so the road comes round beside itself, aprons over aprons, as passclear row 6 (core_segcache row 1);
  - a jump landing heading back, and the road after it (preview-async);
  - an oval whose last turn reaches its start before Close (core_segcache_lift);
  - a 3-turn track whose last straight crosses its first (undo-reopen).
- **Each was amended by name**, citing "forbid building the track a little closer because of the bulk of the underside":
  - With `adopt`, where the test does not read the build's history.
  - With one `commitDoc` per piece, where it does: undo-reopen's last piece and its row 4's 100 m; core_segcache row 1's steps from the cup on. That keeps the undo steps the rows read.
  - core-eqonly keeps three shell extends for the guide's "a few" and commits the rest.
- core_gridturn row 3 (Turn to grid) is **unchanged**: with the spiral whole again, 400 m at 90/45/15 is laid with no refusal (`EV/r3/probe5.js`). Its refusals came only from the spiral silently missing a piece.
- After the amendments, the logger's second pass found 2 refusals (`EV/r3/refusals-diag2.log`: undo-reopen:65 and core_segcache:43). Both were then fixed as above, and the two files with the logger read 13/13 with 0 refusals.

**A fact for the chair, not changed:** `commitDoc` (paste, share codes, install) does not run the guard (`app/core/coreshell.js:1488`; the guard is called only from commit(), :438). So a pasted or installed stacked track opens, as "existing tracks still open" asks. It is also the door these amendments use.

**The runs** (`EV/r3/round3.sh`, under the lock, BelowNormal, `--test-concurrency=1`, no preload; acs.exe checked first):
- A's four (export-isolated, export-isolated-page, app mutation, export-isolated-mutation): **132 / 132 pass, 0 fail** (`EV/r3/four-summary.txt`).
  - Mutants: **applied 116 / caught 116 / NOT APPLIED 0** (104 app, 12 export). Each harness's control passes first.
- D623's touched set joined with every shell-making file (100 files, bar the 4 timing files): **1,411 / 1,411 pass, 0 fail** (`EV/r3/touched-3-summary.txt`).
- Not run: preview-speed, sculpt-frame, preview-lod-frame and preview-close-reuse (frame-timing files). preview-speed's and sculpt-frame's fixtures are amended by the same regex. preview-close-reuse's U has legs about 380 m apart, and preview-speed's tubeShell is two quarter turns asserting `message === null`, so neither is refused.

**The commit:** t180 d623-c **`fcf70e3`** over 72fff66, 23 test files by path. Not pushed.
- **ITS MESSAGE CARRIES A TERM:** sweep.js on `git log -1 --format=%B fcf70e3` gives term hits 1, at term index #17 (termat.js: col 16, length 10). My sweep below checked only the added lines, not the message, and I wrote the message. It must not land as it is. I have not rewritten it, because "never amend". **Asking the chair:** an order to recommit fcf70e3's tree with a reworded message over 72fff66 (a reset of my own unpushed commit, then one new commit by path), or the landing pane rewords it. A should wait for the new sha before rebasing.
- **RECOMMITTED at the chair's order (08:03Z): `9dac8291716a156b43674c447049a07deb1a7954`** (9dac829) over 72fff66, replacing fcf70e3. Done by `git reset --soft 72fff66`, `git reset -q`, then `git commit -F <msg> -- <the 23 paths of git diff --name-only 72fff66 fcf70e3>`.
  - checked: `git rev-parse 9dac829^{tree} fcf70e3^{tree}` → both `c6901ce33774ca1a045530041ebd65323c62a5e5`; `git diff fcf70e3 9dac829` → 0 bytes; working tree clean.
  - checked: sweep.js on `git log -1 --format=%B 9dac829` → term hits 0; seat words and lap ids 0. The new message: "Tests: lay the tracks that come back over their own road with the core's pieces, as the builder now refuses them", plus the Co-Authored-By line.
  - fcf70e3 is now unreferenced on d623-c and was never pushed. **A rebases onto 9dac829.**
- Sweep of its 124 added lines (`SC/d555/sweep.js`): term hits 0, seat words 0, credential prefixes 0.
- A rebases its WARN row onto `fcf70e3`.

**Corrections:**
- My D623 "touched set 1,029/1,029" was true of that set and not enough. 13 files outside it (four of them A's) were red or silently built another track. I should have run every shell-making file, since the guard sits in every shell's commit().
- I stopped my own first round-3 run mid-way to make these edits (its lock released, its processes ended). No result from it is used.

## 11. The one red on the 0.4.39 landing: texture-page row 9 (the chair, 03:56Z)

**The cause is mine: 72fff66.** A's d3cf1ee does not touch it.
- Row 9 lays one 150 m piece turning 720° through the palette. That piece crosses itself, so the pass-clearance guard refuses it ("PASS_CLEARANCE … Nothing changed"). Nothing is laid, and the checker lists nothing: `()`.
  - checked: `node r4/probe.js <tree>`: on 9dac829, extend gives PASS_CLEARANCE and 0 pieces; on a005e1d it gives null and 1 piece.
  - checked: `git diff --name-only 9dac829 d3cf1ee | grep -c texture-page` → 0.
- Red before (9dac829, row 9 only): `r4/before.summary` → pass 0 / fail 1, "sigil: the checker lists a red and an amber ()".

**The fix: amended by name (the rule changed).** Row 9 now lays a 30 m piece turning 120°. It never comes back over its start, so the guard lays it. It is too tight for the road's width, so it still folds (red) and lays its folded road low over itself (amber).
- checked: `node r4/probe4.js <tree>` (through the turn field, `turnDeg`): 30/120 is laid, with red fold 1 + self-intersection 2 and amber low-overhead 4.
- First try, 80 m / 360°: green in my kh probe, but the turn-field route refuses it. `r4/after9.summary` is still red; `probe3.js` shows the refusal.

**The commit:** `b6ced2ec99ade57161d77dfb2d08caef61c5da20` on a new branch d623-c2, parent d3cf1ee (d617-a's head), one file (app/test/texture-page.test.js, +7 −4). Its worktree is Desktop\worktrees\t180-c623b. NOT pushed.
- Message: "Tests: the texture page's warning-text row lays a corner that folds, as the builder now refuses a piece that crosses itself" plus Co-Authored-By.
- checked: sweep.js on the added lines and on the committed message → term hits 0, room words 0. The one grep hit for "lap" is the checker's own "lap lines" wording, already in that line.
- Green after: `r4/after.summary` → texture-page plus redgroups plus the 6 validate-ui files on b6ced2e, under the lock, BelowNormal, one slot: **96/96**. Row 9 read 4 warning lines and 32 pit lane texts in each of the 6 looks.

**For A:** d617-a fast-forwards to b6ced2e (`git merge --ff-only d623-c2`).

**Noted, not changed:** the guard compares passes of the centreline. A corner too tight for its width (a fold) is not a second pass, so 60 m turning 360° is laid even though the checker calls it self-intersecting. That is the checker's fold red doing its job. I'm noting it only because the new row depends on folds not being refused.
