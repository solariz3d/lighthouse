# L130 packet B — non-author review of part 1 (the camera). B, 2026-09-29 ~08:40 UTC

Reviewer: pane B (non-author). Author: the librarian. Packet: chair L130 packet B. Plan: `exo_memory/loop/plan_t180_camera_readout_2026-09-29.md` "Part 1".
Read-only on the repo: nothing edited, committed or pushed. No AC launch, and no window opened (every check is headless).

## VERDICT: NOT GREEN, as the tree stands. It becomes GREEN with a two-line implementation fix, which I ran (§4).

The camera behaves as the keeper asked on every event script I wrote (§2). **But the full suite FAILS 4 tests, and all 4 are caused by this diff**:
- **A4 and A5 NOT APPLIED.** The zoom edit rewrote the chase line in cameras.js, so the mutation table's pinned `from` strings no longer exist.
- **The mutation control FAILS, and so does aclook's "L toggles the look".** The new second `keydown` listener (`onShift`, capture) breaks that test. The author's "54/54" covered only the 3 files it touched, so it never saw either break.

### The six paths (sha256 of the working tree, unchanged from review start to end; re-checked by `sha256sum … | diff` at 08:39Z)
```
1419c4dc96fc86b3ff8eec503fdb9fa0b829b6f4c689c74d45369ac44b9a3612  app/camera/cameras.js
f5f73f98079f38f45c6ae252b99c0a6a12de77c8f678a41fa71f1f616d159951  app/preview/preview.js
e814865716908bdcd423e939689beb796f02f3a11341206e109756c1faed2a93  app/camera/index.js
d4825fed20e0fbfbbb374a46cbf4d10e1b5ac3fbc71bf45a95bb1c857a0e3f1d  app/test/camera.test.js
3f7313ad8829eb33606f9f794f6d74c7f75e436ad95fa88108ce0da75bb8fe2a  app/test/preview.test.js
9a0343317ad6f931a37b75ad8a2dc02be584bd27a391b44a8d8872fdb507d083  app/test/look.test.js
```
**src-tauri/Cargo.toml: CONFIRMED line endings only.** `git diff --ignore-cr-at-eol src-tauri/Cargo.toml | wc -l` gives 0, and `git diff --ignore-all-space --stat` is empty. It is NOT in the landing.

### Method
- **Scratch worktrees.** `git worktree add --detach <scratch>/l130/{wt,wt0,wtfix} 1d68a86`, then a COPY of the named files, with sha256 checked after the copy (6/6 OK).
  - `wt` = 1d68a86 + the six;
  - `wt0` = 1d68a86 + only the 3 test files (red-before);
  - `wtfix` = `wt` + my fix.
- **Link check.** `find . -type l` gives 0 in each. `cmd /c dir /AL /S /B` gives "File Not Found". No reads/ in this repo.
- **Heavy-run lock.** Every node run went through `<scratch>/l130/locked.js` (`heavy-run.js` `hold()` then spawnSync), with `--max-old-space-size=4096`, one at a time. I waited behind A's L130 run (pid 14112) once.

## 1. The full suite and the mutation run (item 2)

Command in `wt`: `node --max-old-space-size=4096 locked.js node --max-old-space-size=4096 --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"` (the package.json `test` script).

**Result: 1,488 tests / 1,471 pass / 4 fail / 6 skipped / 7 todo.**

The 4 failures:
1. `mutation A4 chase ignores its lag`: **NOT APPLIED**: "e = sampleAt(path, head.s - o.lag)" is not in app/camera/cameras.js.
   - The new line reads `head.s - o.lag * z)`, and the pinned string ends in `o.lag)`.
2. `mutation A5 chase lifts along world up`: **NOT APPLIED**: "return { eye: add(e.pos, mul(e.U, o.height)), target, up: e.U, fov };".
   - The new line has `mul(e.U, hgt)`.
3. `preview: L toggles the look …` (app/test/aclook.test.js:251): pressing `l` no longer toggles.
   - **Cause:** that test's fake window stores ONE listener per event type (`addEventListener: (t, f) => keys.set(t, f)`).
   - The new `win.addEventListener('keydown', onShift, true)` is registered after onKey, so it overwrites onKey in the map, and `press('l')` reaches onShift only.
   - Proven caused by the diff. Command: `--test --test-name-pattern="L toggles" app/test/aclook.test.js`: at `wt0` (HEAD code) 1 pass / 0 fail; at `wt` 0 pass / 1 fail.
4. `control: the unmutated temp copy passes every test the mutants are run against`: fails on the same test (3).
   - **While the control is red, the mutation run as a whole is not valid.** In particular L16 ("L does not change the look") reads "caught" by exactly the test that fails unmutated, so L16's catch is vacuous here.

**Per mutant, app/test/mutation.test.js** (61 mutants + control). Tally: grep of each `id` against the suite log. **59 applied and caught, 2 NOT APPLIED (A4, A5), control FAIL.**

The pins the packet named:
- A2 (`if (k === keys.build) mode = 'build';`): applied, caught.
- A7 (`const p = mode === 'free' ? freePose() : poseFor(mode, ctx, opts);`): applied, caught.
- A8 (`if (mode === 'free' && was !== 'free') enterFree(shown`): applied, caught.
- A18 (`const a = keyAction(e.key, e);`): applied, caught.

The author's claim that it kept these verbatim holds; `grep -cF` finds each once. **What it missed is that A4 and A5 pin the chase lines, which the zoom edit changed.**

## 2. VARY: my own event scripts, not the author's (item 1)

File: `<scratch>/l130/vary.js`, 15 node:test cases.
- It drives `createPreview` through a fake window/canvas/document that keeps EVERY listener (not one per type) and supports `removeEventListener`.
- Run: `WT=<tree> node … locked.js node … --test vary.js`.
- **Results:** `wt` 14/14 (run 1, before V11 was added); `wtfix` 15/15; `wt0` (HEAD code) 5 pass / 9 fail. The HEAD failures are the red-before for the behaviours below.

| # | script | new tree | HEAD |
|---|---|---|---|
| V1 | W down, Shift down (+ a 'W' autorepeat), **Shift released BEFORE W**, then W up | step 1.5 m, 6.0 m with Shift (ratio 4.000), 1.5 m after Shift up, 0 after W up | 0 (build view, W does nothing) |
| V1b | Shift first, W down as 'W', W up as 'W' with Shift still down | 6.0 m/frame, then 0 | 0 |
| V2 | right-drag, then **blur mid-drag**, then a move | yaw −0.2 → −0.2 (stops) | — |
| V3 | **wheel in overhead on a CLOSED stadium** (`F.stadium()`, closed: true) | eye height 217.98 → 166.19 after 2 notches; drawn pose 166.19 after 80 frames; clamps 0.05 / 50; eye still 10.6 m above the box top at 0.05 | no zoom |
| V3 | the other views, eye-to-head distance: 1 notch in / 1 out of base | build 16.16 → 14.05 / 18.58; side 40.45 → 35.17 / 46.52; chase 24.89 → 21.74 / 28.42; free dolly 4.000 m | — |
| V4 | **right-drag, then C** (the button still held), then more moves, then mouseup | C → build, stays build, yaw unchanged, the drag inert | — |
| V5 | **W held across visibilitychange** (hide, show, autorepeat, up) | 0 while hidden, 0 on return, 1.5 m on the next autorepeat, 0 after up | — |
| V6 | **ArrowLeft + ArrowRight + ArrowUp + W + a right-drag of 40 px, one frame** | dYaw −0.16 = −40×0.004 exactly (the arrows cancel), dPitch +0.08 = 1.6×0.05, flew 1.5 m | nothing |
| V6b | ArrowRight by the KEY path, projected with the renderer's own `M.viewProj` | the old ahead point at ndc x −0.259 (**turned right on screen**) | +0.259 (**turned LEFT**: the mirror the keeper reported) |
| V7 | grid over 5 frames + a view change, default vs `ground: true` | 0 lines vs 32 | 56 by default |
| V10 | dispose() | every listener removed (window, canvas, document) | — |
| V11 | already in free, W held, **blur**, 3 frames | 0 m | **4.5 m drift**: the drift fix catches the bug |

**Answers to the packet:**
- **The drift stops** (V2, V5, V11).
- **Yaw turns the right way on screen**, by keys and by mouse (V6, V6b).
- **Sprint works and releases** in both orders (V1, V1b).
- **The wheel zooms in every view within [0.05, 50]** (V3).
- **The grid is off by default** (V7).

**Findings from the probes. None of them blocks; each is for the owner to decide:**
- **P1: the author's test "pressed as w, released as W (Shift between) still lets go" can't fail.**
  - It PASSES on HEAD code too (`wt0` run: 46/54 pass; the 8 failures are the other 8 new tests). The old code already lowercased `e.key` on both key-down and key-up.
  - So the plan's cause "a key pressed as 'w' and released as 'W'" was never a drift cause for letters. The cause that holds is the lost key-up on blur/hide (V11: 4.5 m at HEAD, 0 new).
- **P2: a regression on non-QWERTY layouts** (V8).
  - The action is decided from `e.key` but held under `e.code`. On AZERTY, the key labelled A (code KeyQ) now flies DOWN (Δ [0, −1.5, 0]). HEAD flew it left ([+1.5, 0, 0]; +x is screen left).
  - The key labelled W (code KeyZ) now does nothing. HEAD flew it forward (1.5 m).
  - **Fix idea:** store the ACTION with the code at key-down (`held: Map(code → action)`). Not needed for a QWERTY keeper, but it is a behaviour the change broke.
- **P3: C or B pressed while W is held snaps back to free on the next frame** (V9: C → build → free; B → build → free).
  - The "first move takes over" rule re-fires while any key is held. So the camera keys do nothing while flying. This may be intended; the keeper may not expect it.
- **P4: a sticky drag if the button is released outside the window** with no mouseup and no blur (V2b: yaw −0.2 → −0.8 on a button-less move).
  - `inferred:` Chromium's implicit mouse capture usually delivers that mouseup, so this is probably rare in WebView2. Checking `e.buttons` in onMove would close it.
- **P5: Shift+wheel ×4 is probably dead on Windows** (V3b: deltaY 0 + deltaX −100 + shift gives no zoom; deltaY + shift gives ×4 correctly).
  - `inferred, not run in WebView2:` Chromium on Windows turns Shift+wheel into a horizontal scroll (deltaX), so `-Math.sign(e.deltaY || 0)` sees 0. This is the author's extra, not the keeper's ask. `e.deltaY || e.deltaX` would fix it.

## 3. Privacy gate on the six (item 3): CLEAN

- **Command 1:** a case-insensitive `grep -c` over the six whole files for: the user-profile path form, both machine usernames, the keeper's handle and email domain, api-key/secret/password words, 32+ hex runs, drive-letter paths, and OneDrive/Downloads (the search words themselves are not written here). Result: 0 / 0 / 0 / 0 / 0 / 0.
- **Command 2:** the same idea over the diff's added lines (plus `token`, `reads/`, `.exe`, `screenshot`, emails, `/c/`): 0 hits.
- **Wording:** "the keeper" appears as a role. It has precedent in the public tree (`git grep -c "the keeper" 1d68a86 -- app src`: 5 files). No personal paths, keys, other authors' content, reads/ equations, screenshots or exe.

## 4. The fix I ran (implementation only, no test touched), for the author/chair to apply

Tree `wtfix`, applied by `<scratch>/l130/applyfix.js` (exact string replacements that throw if a string is missing).

**preview.js:**
- Delete `onShift` (its declaration, its capture add, and its remove in dispose).
- Read Shift in onKey instead, as its FIRST line (before the input filter, so Shift is tracked while typing too): `boost = !!e.shiftKey;`

**cameras.js chase:** scale a copy of the options, so the pinned lines survive verbatim:
```js
const oc = opts.chase || DEFAULTS.chase, o = { ...oc, lag: oc.lag * z, height: oc.height * z }, e = sampleAt(path, head.s - o.lag), t = sampleAt(path, Math.min(head.s, e.s + o.lookAhead));
let target = add(t.pos, mul(t.U, o.height / 3));
if (len(sub(target, add(e.pos, mul(e.U, o.height)))) < 1e-6) target = add(target, e.T);
return { eye: add(e.pos, mul(e.U, o.height)), target, up: e.U, fov };
```
- One behaviour difference from the author's version: the target's lift (`o.height / 3`) now scales with the zoom too. The author left it unscaled. The chase numbers in V3 are identical to 3 decimals.

**Result on `wtfix`:**
- full suite **1,488 / 1,475 pass / 0 fail / 6 skipped / 7 todo**;
- app mutation **61/61 applied and caught, control PASS**;
- vary.js **15/15**.

**Resulting sha256:**
- preview.js `cf986b00fc5245bb0d19249593cf76125fa9a6d655d54ff1bccaeccd27ad1b14`
- cameras.js `ca3b9215fe74b66c60e5b0214f8034709a2afc1863167a153bae3a10e9a64862`

The other four files are unchanged. **I did not write these into the repo.** The author owns the files. If the chair wants my exact bytes, they are in `<scratch>/l130/wtfix` (a worktree of the shared repo, no links; I will not remove it until told).

## What this review does NOT establish
- **Nothing was run in the real WebView2 window.** Every event is synthetic, through a fake that keeps every listener. The feel (speeds, the 0.004 rad/px look, ×1.15 per notch) is untested against the keeper's hands.
- P4 and P5 are inferred from browser behaviour, not observed.
- The keeper's drift may have had a cause other than a lost key-up. In free mode, only held keys and the wheel move the eye (checked by reading `frame`), so a stuck held key is the only in-code cause I found.

## Corrections to myself
- **W1:** my first shell heredoc for vary.js failed on quoting. I rewrote it with the Write tool; no run used the broken file.
- **W2:** my first mutation tally (a grep for "✔ mutation", 165) counted mutation tests from other suites too. I re-tallied per `id` from app/test/mutation.test.js: 61 mutants + 1 control.

NEXT: librarian call_librarian with the p-l130-camera-read-B pointer when the review is written
