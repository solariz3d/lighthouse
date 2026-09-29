# P-L130-R · A: one assembled tree, and the camera repaired

**WORKTREE (left in place): `C:\Users\zackn\AppData\Local\Temp\a-l130r-wt`**, detached at t180 `1d68a86`. Nothing committed or pushed.
**Model: Sonnet 5.5** (the first hand-back of the trial in `loop/sonnet_pane_A_trial_registration_2026-09-29.md`).
No window was opened, AC was not launched, no Rust was built (nothing in `src-tauri` changed), `src/core/water.js` and `adapter.js` were not touched.

## 0. Checked before anything was used
- `checked:` sha256 of the inputs: C's patch `86b6131f…`, `prove_render_dpi.ps1` `04d9997d…`, B's wtfix `preview.js` `cf986b00…` and `cameras.js` `ca3b9215…`. All four matched the packet.
- `checked:` `git apply --check` of C's patch on the fresh tree: clean; it touched 6 files.
- **No links:** `find . -type l` gave 0, and `dir /AL /S` gave "File Not Found". The tree is a `git worktree add --detach` checkout (real files, no junctions). I read "made by COPY" as that.
- **Own CARGO_TARGET_DIR:** none set, because I built nothing in Rust. A seat that builds this tree should set its own; not verified by me.

## 1. What is in the tree (landing list, sha256 first 16)
| path | what | sha256 |
|---|---|---|
| `src/core/readout.js` | NEW, mine (L130 A), byte-identical to that hand-back | 01bb4a2d0197cac5 |
| `test/core_readout.test.js` | NEW, mine, 13 tests | a267250fae90ba59 |
| `src/core/README.md` | mine: "The readout" | 4c7b871ad86d2f8d |
| `.claude/skills/track-equations/references/09_core_channels.md` | mine: §8 | e9e77a0d676cb439 |
| `.claude/skills/track-equations/references/MATH_SOURCES.md` | mine: WIKI-GAUSS row | 71fbfac52c07cb6c |
| `app/core/coreshell.js` | C's patch, unchanged | f27cbe92783f898b |
| `app/core/panel.js` | C's patch, unchanged | a81e8c11b931ed77 |
| `app/preview/index.js` | C's patch, unchanged | 379e826e550f2a38 |
| `app/test/core-mutation.test.js` | C's patch, unchanged | 7a0f28dd6ab18a7a |
| `app/core/labels.js` | C's patch, NEW, unchanged | 20b035924c81ad1e |
| `app/test/core-readout-display.test.js` | C's patch, NEW, unchanged | 49f94e2e0a9a7e2d |
| `app/preview/preview.js` | B's wtfix bytes, THEN my repair (a, c, d) | 74ba3f8470fff22e |
| `app/camera/cameras.js` | B's wtfix bytes, THEN my repair (e) | 065855b0b61b95d9 |
| `app/camera/index.js` | wtfix bytes, unchanged (see §6 item 1) | e814865716908bdc |
| `app/test/camera.test.js` | wtfix bytes, THEN my tests (e) | 5b15ceff12a90afc |
| `app/test/preview.test.js` | wtfix bytes, THEN the V11 swap and my tests (a, b, c, d) | 34837028f4098391 |
| `app/test/look.test.js` | wtfix bytes, unchanged | 9a0343317ad6f931 |
| `app/test/mutation.test.js` | my mutants N1–N10, and B8's patch text updated | 0ca8358e5f4cd477 |
| `scripts/prove_render.ps1` | C's DPI fix (f) | a06d1aab7d47ea6e |

## 2. The repair, item by item (each with its check)
- **(a) newest key.** `held` is now a `Map` (physical key → its action), in the order pressed. Only the newest movement (fly) key moves; on its release the next newest does; the look (arrow) keys all still turn. A repeated key-down keeps its place. Test: "with W and D held only the NEWEST (D) moves…". Red on the pre-repair app.
- **(b) V11.** The vacuous "pressed as w, released as W" test is replaced by B's V11 (already in free, W held, blur, 3 frames: no movement). `checked:` RED on HEAD's `preview.js` (a copy of the pre-repair tree with HEAD's three camera files: the V11 test fails; it passes on the fixed tree).
- **(c) P3.** The takeover into free is now a flag set at a key-down and used ONCE on the next frame; C and B clear it. Test "P3: C or B pressed while a movement key is held leaves free mode and stays out of it". Red on the pre-repair app.
- **(d) P5.** `e.deltaY || e.deltaX || 0`. Test: Shift+wheel with `deltaY 0, deltaX −100` zooms ×4, equal to the deltaY form. Red before.
- **(e) BLACK overhead zoom-in: cause found by measurement** (scratchpad `l130r/black2.js`). The overhead fit centres on the track's BOX centre, and zooming in shrinks the view around that centre. On a curved or closed track the centre lies off the road; with no ground drawn, the view is empty.
  - **Measured:** on a 400 m arc, the head is out of view and 0 of 201 centreline samples are in view from zoom 0.247 down; on the closed stadium, 0 of 217 from 0.123 down.
  - **Fix:** the view's centre slides from the box centre to the head as the view zooms in, `w = min(1, zoom)`. At zoom 1 and out it is the box centre exactly (the D170 fit, unchanged; tested). The head is in view at every zoom (the offset is at most zoom·hf against a half-extent of 1.08·zoom·hf).
  - **Tests, RED before:** "overhead zoomed in (0.05 to 50): the head and the road near it stay in view", on a 300 m straight, the 400 m arc and the stadium. The pre-repair app fails all three; the fixed tree passes all three. A fourth test pins zoom 1 and out as unchanged.
  - `inferred:` C's black capture (`labels-overhead-z0.05`, a 5-piece track) is this same cause. I did not reproduce C's capture (no window opened).
- **(f) DPI.** Two lines added to `scripts/prove_render.ps1`. `checked:` `diff` against C's `prove_render_dpi.ps1` after stripping carriage returns gave no difference.

## 3. Results (under the heavy-run lock, `--max-old-space-size=4096`; scratchpad `l130r/full2.txt`)
- **The full suite:** `test/*`, `app/test/*`, and the skill's `known_answers` and `mutation` evals: **1,602 tests · 1,589 pass · 0 fail · 6 skipped · 7 todo.** That includes the app mutation test (182 listed mutants and its control) and C's core mutation test (43 listed), both green.
- **My mutants N1–N10 (app mutation):** 10 applied · 10 caught · 0 NOT APPLIED. N1 every held key moves; N2 the oldest key moves; N3 a repeat reorders; N4 a key-up lets go of every key; N5 the takeover re-fires (C and B undone); N6 the wheel ignores deltaX; N7 the action looked up by name; N8 no slide to the head; N9 half the slide; N10 the slide beyond the box centre when zoomed out.
- **B8's patch text** moved with the eye line I changed (`c[0]…c[2]` became `ex…ez`): the same fault in its new spelling. It is still caught.
- Camera 26/26, preview 23/23, look 17/17 when run alone.

## 4. My errors (disclosed)
- The first full run had **2 failures, both mine:** N9 survived (the tests did not pin the slide rate: on an arc and a stadium the head sits near the box centre, so a half-rate slide still kept it in view), and N7 was an equivalent mutant (`… || a` gives back the same action). I added the straight-track case (the head at the box edge; red on the pre-repair app and on the N9 copy) and made N7 `|| {}`. The results above are the second run.
- A quote in a test title was a syntax error; fixed before any run.
- The test "releasing the OLDER of two held keys" also passes on the pre-repair app (both keys moved there); it is kept because N4 needs it.

## 5. Scope notes
- **Beyond the list, because they fell out of the same rewrite:** B's P2 (a non-QWERTY layout: the key's action is now fixed at key-down, so a key labelled W on another physical key flies) with a test "P2…", red before; and the tests "arrow keys are not movement keys", "a repeat keeps its place", "a NEW movement key-down after C takes the view over again" (the last two are guards).
- **Not done, by choice:** P4 (a sticky drag when the button is released outside the window) and the panel wording "+90.0°" (G's).

## 6. Told and not established
1. **Files I took beyond the packet's list, please check on landing:** `app/camera/index.js` and the tests `camera.test.js`, `look.test.js`, `preview.test.js`. These are in the shared checkout as uncommitted work (their bytes there equal wtfix's; the sha256 matched), and V11 replaces a test that lives in `preview.test.js`. Also my three shelf files (§1, rows 3–5), so the math lands with its source. **Left out:** the shared checkout's modified `src-tauri/Cargo.toml` (not mine; I did not read its content).
2. **No display check.** No window or GL rendering was run: the black view is shown fixed by the projection of the head and the road (`M.viewProj`), not by a capture. `inferred:` the real overhead now shows road when zoomed in.
3. **Real timing.** The tests drive a fake window with stepped frames; a real keyboard's key-repeat and a real animation frame were not run.
4. **The readout's M1–M6 score** is B's, on this tree, against E's seal.
5. **The review of the repair** is E's (non-author).
