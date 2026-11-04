# D421 Part 5, Step 2: the page subscribers every edit pays (seat A, 2026-10-20)

Answers Step 2 of the chair's 20:56Z packet: C's profile (`exo_memory/handback/p-d421-freeze-C_2026-10-20.md` §5) names four subscribers:

| subscriber | C's cost (ms) |
|---|---|
| `segkey.keyOf` | 639 |
| the spawns layer's `spawnsInfo` | 778 |
| `pieceReadouts` | 485 |
| `ghostModel` | 350 |

The order: each goes coarse during a drag, or skips unchanged pieces, and is exact on release. Tier: prove it. Step 1 is `p-d421-sculptframe-A_2026-10-20.md`.

## §0 Where it is

- **Commit 761fef7**, branch `d421-a`, worktree `C:\Users\nname\Downloads\t180-wt-a33`. Its parent is d2e57d6 (Step 1), which sits on ea54ac3.
- It is local, committed by named paths, and not pushed. `checked:` `git log --oneline -3`; `git status --short` gives empty.
- **Paths:**
  - `app/core/labels.js`
  - `app/core/spawnslayer.js`
  - `app/core/spawndrag.js`
  - `app/test/sculpt-subscribers.test.js` (new)
  - `CHANGELOG.md` (one Unreleased ▸ Fixed line)

## §1 What each of the four is, and what I did

**1. The labels' `pieceReadouts` (485 ms). Fixed, in `labels.js`.**
- The labels layer read every piece's readout once per new document. That meant every step of a brush drag, from the brushed piece to the end of the track.
- Now, while `st.brush` is open, the labels keep the readouts from when the drag began, and the first frame after the release reads the let-go track.
- The labels show only the head and the hovered piece. During a drag the Sculpt strip shows the value being dragged (B's part 3).

**2. The spawns layer's `spawnsInfo` (778 ms). Fixed, in `spawnslayer.js`, then in `spawndrag.js`.**
- `spawnsInfo` builds the whole lap's path.
- The layer now only marks its marks stale on a change. The next frame asks, and it does not ask while `st.brush` is open, so the release's pointer-up does not ask either.
- `items()` still answers at once, which is what `core-spawndrag` reads.
- **The profile then showed the cost had moved, not gone.** The start's hover in `spawndrag.js` (`onMove` → `hitAt` → `infoNow`) asks `spawnsInfo` on every pointer move. Before, it hit the memo the layer had filled.
  - `checked:` `scratchpad/d421/prof-fix10.txt`: `spawnsInfo` 845 ms, through `hitAt spawndrag.js:138` 785 ms.
  - While a brush drag owns the pointer no mark can be grabbed, so the hover no longer looks for one.

**3. `segkey.keyOf` (639 ms). Not fixed here. It is E's file, so E should make this change.**
- `trackmodel.js:41-47` already caches a frozen segment's key.
- During a drag the preview meshes `coarsen(resolved.segments, 6)` (`preview.js:160`, `trackmodel.js:129`), and `coarse.js:63-65` builds every coarse segment as a new, unfrozen `{ ...g, fractions }`. So every segment of the lap is hashed again at every step.
- **The one-line fix, in `coarse.js` `coarsen()`, before `m.set(g, c)`:** `if (Object.isFrozen(g)) Object.freeze(c);`
  - The coarse segment is already one object per input segment. The thinned `fractions` arrays are memoised and never written.
- **Measured as a scratch edit, then put back:**
  - `checked:` `scratchpad/d421/prof-freeze10.txt`: `keyOf` drops out of the top 25 inclusive (the cut-off is 196 ms; it was 595 at the base).
  - In the same 3 s drag, 28 moves are answered against 11-13, the slowest in 120 ms against 257-320.
  - `checked:` `git status --short` after the run shows only my own files; `coarse.js` was restored with `git checkout`.

**4. `ghostModel` (350 ms). No change needed in Sculpt.**
- The cost was the Extend ghost being re-asked for each new document. That was under the old brush, outside Sculpt.
- `ghostModel` returns null whenever `st.sculpt` is set: `checked:` `panel.js:421` here and B's `t180-wt-b421` `panel.js:491`.
- B's part 3 removes the old brush strip, so every brush drag is a Sculpt drag. In `t180-wt-b421`, `grep -n "brush on" app/core/panel.js` finds none.
- `inferred:` it costs nothing in a Sculpt drag. That rests on reading B's code; I have not timed it on B's page.

## §2 Red, then green

| run | result |
|---|---|
| `app/test/sculpt-subscribers.test.js` on ea54ac3 (only the test written) | rows 1 and 2 **red** (`pieceReadouts was read during the drag 6 !== 0`; `spawnsInfo was asked during the drag 6 !== 0`); row 3 green, as it should be |
| row 2b before the `spawndrag` change | **red**: `the hover asked for spawnsInfo while the brush held the pointer 6 !== 0` |
| the file after the three changes | 4 / 4 |
| every test file that loads `labels.js`, `spawnslayer.js` or `spawndrag.js`, plus the mutation harnesses anchoring in them, plus the new file: 14 files whole, under the lock | **368 tests, 368 pass, 0 fail**. Of the harness mutants, 135 are `applied, and caught`, 0 NOT APPLIED, among them L1-L3 and R1-R17 in `labels.js`. `checked:` `scratchpad/d421/set1.txt`, `set1-full.txt` |
| my own mutants of the new lines, against the new file whole (`scratchpad/d421/mutants.js`) | **applied 4 / caught 4 / NOT APPLIED 0**. MA labels read during the drag (row 1); MB marks asked during the drag (row 2); MC marks asked in the release (rows 2 and 2b); MD the hover looks during the drag (row 2b). `checked:` `scratchpad/d421/mutants.txt` |

The consumers I traced:

| touched file | who mounts or loads it |
|---|---|
| `labels.js` | `panel.js:630` (`LB.mount`); `piecesui.js` (`labelText` only) |
| `spawnslayer.js` | `panel.js:632`; `spawndrag.js` (`marks()`, pure, unchanged) |
| `spawndrag.js` | `panel.js` |

Each consumer's test file is in the 14 files above.

## §3 The profile (the old brush on ea54ac3, C's `page.js`: 50 × 200 m, height brush r 60, a 3 s drag)

The machine was shared: B's, C's, E's and O's suites ran beside these runs. So the absolute times are noisy; what moves is the attribution.

| run | `keyOf` | `spawnsInfo` | `pieceReadouts` | `ghostModel` (old brush only) | source |
|---|---|---|---|---|---|
| ea54ac3 | 595 | 716 | 460 | 329 | `prof` printed in this session; `base10.cpuprofile` |
| A's three changes | 931 | not in the top 25 | not in the top 25 | 521 | `prof-a10.txt` |
| plus the scratch freeze in `coarse.js` | not in the top 25 | not in the top 25 | not in the top 25 | not in the top 25 | `prof-freeze10.txt` |

**What is left after all four, for E and O:**
- the mesh (`sculptMesh` 769, `handleKey` 598): E's ladder;
- the height offset: `resolved.lift` / `offsetPath` 383, in `coreshell.js:318` (O's), with `relift` 345 in `trackmodel.js` (E's);
- the brush itself, 241.

## §4 Corrections, mine

- **My first MC mutant was equivalent.** It added the read on `refresh()`, but at the release `endBrush` keeps the same document and resolved track, so `refresh` returns before reaching it. It survived, and that told me nothing. I rewrote it as a subscriber that reads whenever it is told, which is the old behaviour; that one is caught.
- **I committed Step 2 into the tree my queued Step 1 red run pointed at.** That run would have timed Step 2's code, not ea54ac3. It had not started (no output file, neither slot mine). I stopped it and re-pointed it at a new tree, `t180-wt-a34` (branch `d421-a-red`, ea54ac3 plus the test file only).

NEXT: librarian, route §1.3 (the one-line `coarse.js` freeze) to E, and §3's height-offset line to O and E. A appends the Step 1 red table to `p-d421-sculptframe-A_2026-10-20.md` §2 when its run lands, then resumes D407b.
