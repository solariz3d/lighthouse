# D587: the validator's heap (pane O, prove it)

**Brief:** the chair's ring of 2026-10-31T15:31Z. Branch **d587-o off d583-c (acaa2a0)**, t180 worktree `C:\Users\nname\Downloads\t180-wt-o587`.
**The change:** t180 **d587-o `b6fa925`**:
- `src/validate/index.js`;
- `test/validate_heap.test.js` (new);
- `test/fixtures/stadium-100km.t180track` (new);
- `CHANGELOG.md`, and `MAP.md` (the t180 line).

**Ownership:** only the validator's internals. Nothing in C's export path or A's preview mesh. The one overlap to name is that the new fixture is **C's D583 synthetic** (`stadium.js`, copied as `S\d587\stadium.c583.js`), committed as a file: sha256 `55c1383867eb19b7…`, equal to `S\d587\doc\eq-STADIUM 100.t180track`.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

**Run conditions:**
- Every run was node only, under the heavy-run lock, at BelowNormal (`S\d587\run.js`).
- `run.js` refuses to start while acs.exe is up, and refuses again after the lock wait. It did refuse once, at about 10:00, when acs.exe came back up during a wait; nothing ran.
- No window and no exe.
- **Low I/O was not set.** The runs read a few MB and write nothing to the tree's disk beyond the test's own output.

## 1. What holds it (measured before cutting)

`S\d587\heapstage.js` runs the check worker's job (C's `checkjob.js` PATH_ONLY model, then the controller, leanLines, CSP on). It works through an **instrumented copy** of the validator (never written to the tree). It records the live heap after a full GC:
- at each stage marker of `core()`;
- then after dropping each holder in turn;
- and last, after dropping **each memo** in turn.

"Live" is **V8's used heap plus `process.memoryUsage().arrayBuffers`**. Typed arrays keep their numbers outside the V8 heap, so a heap-only figure would have scored this cut as a saving it is not.

checked: `node --expose-gc S\d587\heapstage.js <tree> <doc> <label>` → `S\d587\elysium-before.out`, `S\d587\stadium100-before.out` (at acaa2a0), `S\d587\elysium-after.out`, `S\d587\stadium100-after.out` (at b6fa925).

**It is the memos, not the findings.**
- On ELYSIUM, `raw.pts` holds **809,883** findings (539,295 of them `info:on-the-stops`), and dropping it frees only **~99 MB**.
- After the result, the controller **and the model** are all dropped, **861 MB** is still alive above the model. That is the module's WeakMaps, keyed by the frozen segments the document keeps.

## 2. The heap table, before → after (MB above the path-only model; ArrayBuffers counted)

| stage | ELYSIUM before | after | 100 km stadium before | after |
|---|---|---|---|---|
| before the per-station loop | 98.4 | 98.4 | 62.1 | 62.1 |
| after the per-station loop | 687.9 | 358.5 | 264.7 | 212.0 |
| after the segment reds and `stacked()` | 1,015.3 | 504.6 | 470.6 | 289.7 |
| **the controller holds the result** | **1,016.3** | **505.6** | **475.7** | **294.7** |
| everything dropped but the segments (the memos) | 861.0 | 350.3 | 272.3 | 91.4 |
| of which the cup-blend constants (`blendMemo`) | 482.8 | 153.4 | 0 | 0 |
| of which the stacked check's points (`latMemo`) | 247.6 | 66.4 | 205.1 | 76.8 |
| of which the per-segment constants (`constMemo`) | 0 | 0 | 93.6 | 40.9 |
| of which the normalized profiles (`normMemo`) | 165.2 | 165.1 | 106.9 | 106.9 |

The "of which" rows are differences between successive drops in the same runs.

**Documents:**
- ELYSIUM: 13,798 segments, 13,799 stations, 13,799 blend entries (one per station).
- The stadium: 50,034 segments, no blend.

**What is left and not cut:**
- **`normMemo` (165 MB on ELYSIUM, 107 on the stadium)** is `P.normalize(g.profile)`, the geometry module's own profile shape. It is read throughout the checker, so its layout is `src/geom`'s business, not this cut's.
- **One normalized profile per segment, even where the profiles are equal,** is the next lever (the stadium's 50,034 are very likely a handful of shapes). inferred: not counted.

## 3. The proof: every finding byte-equal before and after

`S\d587\findings.js` writes, per document:
- **the check worker's result** (the panel's way: PATH_ONLY, controller, leanLines, CSP);
- **`validate()` called directly** with full lines;
- and on an open track, **`revalidate` from its middle equal to `validate`**.

Each result's enumerable fields are written as JSON, with its length and sha256.

checked: `S\d587\findings-before.json` (acaa2a0) and `S\d587\findings-after.json` (b6fa925) → **11 of 11 rows identical**. The two files are byte-equal as wholes: sha256 `743a31ca4c2c258e…` both.

| document | segments | checker red/amber/info | checker JSON | validate() JSON | revalidate |
|---|---|---|---|---|---|
| elysium-2026-10-22 | 13,798 | 0/28/18 | 5,455,417 B, sha256 5850ac1cc2b96df6… | 426,425,297 B, sha256 93f15356d8c9bc09… | closed |
| F1 bowl lap closed | 748 | 0/0/0 | 276,634 B, 7b1f326aaaab1aa1… | 1,159,221 B, 472f507d8177c1c0… | closed |
| F2 halfpipe lap closed | 748 | 0/1/3 | 276,724 B, c94c54d27dd571b3… | 1,157,116 B, 669b067ed684ea71… | closed |
| F3 bowl narrow cap | 210 | 2/1/0 | 69,086 B, f50fc53e51c7008f… | 526 B, 5fdbb68761eff3cf… | equal |
| F4 halfpipe width along s | 150 | 0/0/0 | 49,188 B, f9d5782a7b3b23f1… | 328 B, a6ed2e459f43b458… | equal |
| F5 flat bank 30 | 120 | 1/0/0 | 39,200 B, edae9a7dc182c2f9… | 328 B, a6ed2e459f43b458… | equal |
| F6 bowl r brushed | 200 | 0/0/0 | 53,700 B, 5d64c66d01125c88… | 328 B, a6ed2e459f43b458… | equal |
| F7 hill then jump | 161 | 1/2/2 | 56,011 B, eede9a9c2fe72668… | 476 B, d4f7d775583c0c21… | equal |
| F8 mixed families | 150 | 2/0/0 | 41,205 B, 20defbf814e45664… | 693 B, 5c0741eb307c231c… | equal |
| F9 empty | — | `toSegments` refuses (EMPTY), before and after | — | — | — |
| stadium 100 km | 50,034 | 0/0/0 | 19,136,821 B, 67a5f75d1eaf713f… | 79,567,358 B, e2a70e6d84a3393f… | closed |

- **The JSON includes `lines` and `speed`,** so every load figure on the kept lines is compared, not only the red/amber/info lists.
- **On open F3-F8, `validate()` with the default options carries almost nothing** (328-693 B): no speed is claimed on an open track without a design speed. Those documents' load path is covered by the checker column, which passes the design speed.

## 4. The cut (b6fa925)

- **`constOf`** returns `{ n, a }`. `a` is one Float64Array of `CW = 8` figures per u: `[u, X, Y, nl, nu, sg, cos, sgsin]`. It replaces one `{u, X, Y, nl, nu, sg, cos, sgsin}` object per u.
  - **The per-station loop and the seam loop** read the figures into locals (`cX`, `cnl`, …). `nx`/`ny`/`nz` take `(p, nl, nu)`.
  - The arithmetic is the same expressions on the same doubles.
- **`latOf`** keeps `xy` as one Float64Array `[X0, Y0, X1, Y1, …]`. `r` is a running `Math.max` over the same hypots in the same order. That is the same number as `Math.max(0, ...all)`, NaN included.
- **`deepFreeze` skips typed arrays.** `Object.freeze` throws on a view with elements. **This is a guard lost, said plainly:** a reader that wrote into a memoised Float64Array would no longer throw. The object holding it is still frozen. No reader writes to it today (the only readers are the two loops and `ptsOf`, all read-only).
- **Speed:** old and new code were alternated, 3 each, in fresh processes, in the same window (C's suite was running throughout).
  - checked: `S\d587\ab.js` → `S\d587\ab.out`.
  - ELYSIUM: before 29,631 / 29,658 / 24,315 ms; after 22,629 / 24,996 / 31,637 ms.
  - Stadium: before 4,578 / 3,789 / 4,326 ms; after 3,176 / 3,363 / 3,613 ms.
  - **No slower.** The ELYSIUM spread is larger than any difference.

## 5. Tests (prove it)

**Red first.** `test/validate_heap.test.js` runs the check worker's job in a fresh process and reads heap + ArrayBuffers above the model.
- **Row 1** is the 100 km stadium under **380 MB**; its control is that the check read 100,000+ lines.
- **Row 2** is ELYSIUM under **700 MB**; its control is that its ambers are read.
- checked: `S\d587\redgreen.js` → `S\d587\heaptest-before.out` and `S\d587\heaptest-after.out`.
  - **On the old validator, both rows are red:** "kept 471.2 MB above the model, the ceiling is 380 MB" and "kept 1016.3 MB …, the ceiling is 700 MB".
  - **On b6fa925, 2/2 green.**
  - The old file was put in the tree for the red run and the new one restored in a `finally`; `cmp` confirms the tree holds the cut.
- **The ceilings sit between measured before and after,** with ~85 MB and ~190 MB of room over the after.

**The validator's tests:** 20 files (`test/validate*.test.js` without the load harness, plus `app/test/validate*.test.js`, the new file included).
- checked: `S\d587\prove.js` → `S\d587\prove-validate.out` → **243 tests, 243 pass, 0 fail.**

**The mutation harnesses that name `src/validate/index.js`, whole:**

| harness | applied | caught | NOT APPLIED | controls |
|---|---|---|---|---|
| `test/validate_load_mutation.test.js` | 13 | 13 | 0 | pass |
| `test/core_cup_mutation.test.js` | 48 | 48 | 0 | pass |
| `test/core_jump_mutation.test.js` | 27 | 27 | 0 | pass |

checked: `S\d587\prove-<harness>.out`, counted from the TAP `ok N - mutant|mutation …: applied, and caught` lines. No harness anchor was moved by the cut.

**Mutants of the cut itself** (no harness reaches the packing). checked: `S\d587\mut587.js` → `S\d587\mut587.out`, against the 19 validator files:
- **P1, the normal reads nu as nl and nl as nu:** applied, **caught** (36 fail; e.g. "on a level straight … only gravity acts").
- **P3, the stacked points read X as Y:** applied, **caught** (5 fail; e.g. "the station-pair stacking check finds exactly what measuring every surface point finds").
- **P2, the side sign read from the cos slot:** applied, **SURVIVED.**
  - inferred: **result-equivalent except where a wall stands at ψ exactly 90°.**
  - `csg` only chooses between `L` and `L·cos ψ + U·sg·sin ψ`, which is `L` exactly when sg = 0, because there `sgsin` is stored as `0 · sin ψ`.
  - Elsewhere `cos ψ` is non-zero unless ψ = 90°.
  - **No row was written for it** (the D503 lesson: a row never red proves nothing).
- **Applied 3 / caught 2 / NOT APPLIED 0.**

## For the landing

- **Merge:** d587-o's five paths; base d583-c. C's branch is the base, so landing after C's D583 keeps the order.
- **The new test costs about 40 s** (two fresh processes, ELYSIUM's check about 25 s). It is not a mutation harness, so it rides in the fast suite. inferred: `scripts/test-fast.cjs` picks it up by its name pattern; not checked.
- **The ceilings are absolute MB on this machine's node 24.** A different V8 could move the figures.

## Corrections

- **My first findings run stopped at F9.** `toSegments` refuses an empty track by design. `findings.js` now records it as a row, and both runs carry it.
- **My first A/B printed nulls:** the child's number came with colour codes. It was fixed to plain stdout before any figure was read.
- **My first heap reading was heap-only.** The before tables were re-run with ArrayBuffers counted (0 MB before, as expected), so before and after are in the same unit.
