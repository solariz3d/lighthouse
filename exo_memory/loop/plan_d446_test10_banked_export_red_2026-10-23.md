# D446: "TEST 10 banked" export refused, "validation is red, nothing written", in local-0.4.16 (librarian, 2026-10-23 ~09:50)

**The report (the keeper, 09:42):** "for TEST 10 BANKED, still says red validation is red nothing written … when i am exporting i mean". Seen in the installed local-0.4.16 (e8e34d0).

**His file, which is never written to:** `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 10 banked.t180track`, 37,038 B, saved 2026-10-22 09:48, sha256 d1550e7e40232e51…72de72. That save is from before D438 and D439, so its closer is the morning's one.

**The copy:** `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\d446\eq-TEST-10-banked.t180track`, with the same sha256. A pane takes its own copy from this one and checks the sha256 first.

**Fact found (checked, this seat):** at e8e34d0, `validate(toPath(doc, step 2), toSegments(doc), { fullSpeed, softCollision })`, with no roadMesh, folds or csp, gives **red 0** and the lap proves (scratchpad d446/v.js). It is closed, has 23 pieces and no pit lane. So the red comes from what only the export adds (src/export/fromwords.js :230-248):
- the downforce-ray gap against the built road mesh (raygap);
- the mesh folds;
- csp;

or it comes from a different save than this one (inferred, not checked).

## One part, one pane: E (knows the export path: D432, D437a), tier prove it

1. **Reproduce it, headless, `--mute-audio`, never stealing focus, at e8e34d0.** Run the page Export (or `runSegments` in node with the same options as the app) on the copy. Write to a fake AC root only, as `run-export-437b.js` does, and nothing to his tracks folder or the AC folder. Give the exact RED message: every range, its reason and its s.
2. **Name the cause** and say whether it is a real defect in the road or a false red:
   - which check fires;
   - where on the lap (the closer, the seam, a joint);
   - whether cd3dc42-era code (0.4.14, b6969da) refuses the same file too.
3. **Re-finish test:** load the copy, Open the closer (or re-run Finish to start from the open TEST 10 fixture, fixtures-d431/test10-open), then finish with 0.4.16 and export. Does it pass? The installed `t180b_test_10_banked` in AC was made from a finish that changed later, so a re-finish is the likely remedy if the red is real. inferred, not checked.
4. **If it is a false red:** a red-first test on the copy's geometry, using no private file in the repo (a construction that reproduces it), then the fix, the harnesses for the touched files whole, and the full proof at landing.
5. **Hand back to the librarian** with the message, the cause and a plain-words remedy for the keeper. Build nothing past step 3 without a ruling, unless step 2 shows a plain false red with a one-line cause.

## E's D446 hand-back ruled (librarian, 2026-10-23 ~10:15)

E's hand-back is `exo_memory/handback/p-d446-E_2026-10-23.md` (git-blob 1da5fbd3…, 10,036 B). It finds two `downforce-ray-gap` reds in p5, at s 2574 and s 2928. The probe past one edge hits the OTHER pass's lip, 354–356 m along the lap, 0.64 m away. The same reds come at 0.4.14. Re-finishing does not clear them. Narrowing p5 to 23 m clears them, tested on a copy.

**Rulings.**
1. **A false red: fix it, D446 build, E, prove it, from e8e34d0.** raygap's own definition of a gap is the SAME road resuming within a metre. In `overRoad`, a hit counts only if its nearest station is on the same pass: circular s distance from the edge's station ≤ a bound E names with its reason. Suggested: the larger of the local road width and 30 m, since a slit, a missing triangle or a pit-lane lip sits within metres and another pass sits hundreds away.
   - Red first: a construction with no private file, a bowl piece curled so its two edges pass within 1 m, like p5. It must be red at e8e34d0.
   - Every existing raygap row stays green: slit, missing triangle, pit lane short of the road.
   - The harnesses that anchor in raygap.js run whole. Own mutants: the bound removed (the red returns), and the bound at 0 (true slits missed).
   - His TEST 10 banked copy (sha256 d1550e7e…) exports with no red, through E's exp446.js route at the fix.
2. **The near-touch (the keeper's open "edge-to-edge warning"): add it as INFORMATION that never blocks, like D432's stacked-within-2m.** Show it where two passes' edges come within 1 m. Use plain words, e.g. "two parts of the road come within 0.6 m of each other edge to edge (2.57 km and 2.93 km)". This is the safe default; the keeper is told and can veto it, or ask for it to be raised to an amber.
3. **For the keeper now:** narrowing p5 to 23 m works today. The fix makes it unnecessary.
4. It rides the next batch. E's worktrees t180-wt-e40 and e41 stay until the build.

## E's D446 build ruled (librarian, 2026-10-23 11:2x)

Read: `exo_memory/handback/p-d446-E_2026-10-23.md` §7–11 whole.
Checked on disk: t180-wt-e40 HEAD bad1bb39d264…, tree clean, `git diff --stat e8e34d0 HEAD` 9 files +166 −16; `node --test test/validate_raygap.test.js test/validate_raygap_lean.test.js` → 18 pass, 0 fail (14 + 4, as E says).

- **ACCEPTED as built:** the same-pass bound (max of 30 m and the road width, circular round a closed lap), the near-touch as info within 1 m, red-first rows 11 and 14 on e8e34d0, his copy exporting clean in the page (`page-fix-d.log`), the public comments reworded.
- **The row 1b amendment is accepted:** the 4 dropped coil gaps all met the other circle about 1,130 m on, and are near-touches now. It is a test made wrong by a ruled rule change, said so in §8.
- **M6 (the 1 m filter removed) is owed one row before review:** an other-pass edge at about 1.5 m is NOT a near-touch. It is one assertion on the existing builder, prove-it tier, and leaves no filter unguarded. E adds it as row 15.
- **M7 (the export's warning line removed) is accepted surviving:** an export of a closed lap per row is costly, and the words are checked on his copy through the page itself (§9).
- **Then P reviews** d446-e at the new tip, then a landing pane makes local-0.4.17 (full suite, harnesses, his copy exports in the page).
- **The keeper is told** the near-touch line is new information; he can veto it or ask for amber.

OUTPUT → NEXT: changed — M6's survival adds a row to E before P, not after.
NEXT: E add row 15 (other-pass edge at ~1.5 m is not a near-touch; M6 caught) when this ruling is read; then P reviews d446-e.

## E's row 15 ruled (librarian, 2026-10-23 11:5x)

Read: hand-back §12. Checked: t180-wt-e40 `git log -2` → 5a2fbab over bad1bb3, tree clean.
- **ACCEPTED at ~1.09 m.** My "about 1.5 m" was wrong: an edge whose probe meets another pass is always within √(1 + 0.6²) ≈ 1.17 m of it, so a row at 1.5 m never reaches the filter and could not catch M6. E's scan agrees (no near entry beyond +0.8 m spacing).
- M6 is caught now (`ownmut3.out`, not ok 15). Own mutants 7/6/0; M7 survives, as ruled.
- **Next: P reviews d446-e at 5a2fbab** (prove it: the bound, its seam, the near-touch, row 1b's amendment, his copy). Then a landing pane makes local-0.4.17.

OUTPUT → NEXT: unchanged — row 15 caught M6 as asked; the review goes ahead.
NEXT: P review d446-e at 5a2fbab when the chair relays this.

## P's D446 review ruled (librarian, 2026-10-23 12:1x)

Read: `exo_memory/handback/p-d446-review-P_2026-10-23.md` whole. Verdict: can land, with two findings.
- **Finding 1 (§1.3), ACCEPTED, fixed in THIS batch.** A closed path's first and last samples sit at one place (s 0 and s lengthM, 5.6e-6 m apart). `Math.min(d, Math.abs(lapM - (d % lapM)))` reads that pair as a whole lap apart. On a seam slit, half the edges read worst 1 m instead of 0.5. Owed from E in d446-e:
  - (a) the plain form, `Math.min(d, lapM - d)` (with d already in [0, lapM]);
  - (b) one row through `validate()` on a built closed lap with a 0.3 m slit at the seam (P's `seam446.js` construction), asserting every gap edge's widthM ≤ 0.5 and no near-touch. That catches P's Pd and Pc both: Pc gave a false 0.30 m near-touch at s 0.
  - Red first: the row is red at 5a2fbab.
- **Finding 2 (§1.5), ACCEPTED; my ruling was wrong.** I wrote that M7's words were "checked on his copy through the page itself". They were checked in node: the page's Export to Assetto Corsa note carries only `jump:` and TEST warnings (app/install/install.js :62–68), so the keeper, who installs, would never see the near-touch. Ruling 2 meant him to see it. Owed from E: install.js's filter takes `near-touch:` beside `jump:` (one line), plus the page run on his copy showing the words in Install's note (`grep -c "near-touch"` ≥ 1 in the page log). That also gives M7 a check in the page.
- Notes, no action: Pa (the width term, harmless, widens only), Pb, Pe (cosmetic), :232 `if (!other)` (harmless), pitlane's `spanGaps` (pre-existing), and near-touch listed only where the ray meets (accepted: that is the set his report came from).
- The keeper is told the near-touch line will show on Install. He can veto it or ask for amber.

OUTPUT → NEXT: changed — two one-line fixes and a row go to E before landing, instead of landing 5a2fbab as is.
NEXT: E fix finding 1 (form + seam row, red first) and finding 2 (install.js filter + page log) in d446-e when the chair relays this; then the librarian reads E's hand-back, and a landing pane makes local-0.4.17 (P re-reads the two diffs at landing, not a new review).

## The keeper on the near-touch (2026-10-23 18:07)

His words: "it should be obvious to not clip track into each other". Read against his D432 word (src/validate/index.js:415, 2026-10-22: "the tracks can be under 2m apart as long as the geometry isnt clipping into eachother"), it says what the builder already does:
- road that clips is **red** (self-intersection, from the mesh's own BVH folds, :396; or the stack's clip, :420);
- TEST 10 banked's two edges are 0.63 m apart and do not clip (its export has 0 self-intersection reds).

So the near-touch stays **information**. No lap opened. If he meant something else (for example, that Finish or Close should never lay road that near another pass), that is a new rule and his to state.
