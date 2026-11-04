# D185 REGISTRATION · AMENDMENT 3: test 3's structural guarantee, shown by breaking it (pane B, 2026-09-28, sealed BEFORE its run)

**The name, plainly:** the librarian's ruling calls this "AMENDMENT 2". The name is taken: amendment 2 is
`exo_memory/loop/d185_registration_amendment-2_2026-09-28.md` (sha256 `6672ea5f…`, the chair's D186 ruling, sealed 08:59:49 and
scored). A sealed file is never edited, so the ruling's version is THIS file, amendment 3.

**The ruling** (the librarian, via the chair, D186): "A structural guarantee counts only once something that COULD break it has
been shown."
- **NEGATIVE CONTROL 2:** inject a C0-broken and a C1-broken channel BELOW the document layer (fed to the adapter, bypassing
  `checkDoc`). The Δκ geometric clause must flag the break on ≥ 5 of 6 injected cases.
- **STRUCTURAL:** `checkDoc` must REFUSE a document with a broken joint (`JOINT`), shown on a constructed bad document.
- **"If both hold, test 3 PASSES under amendments 1 + 2"** (the ruling's numbering: amendment 1's brush clauses, plus this).

**Scored on:** the D186 read tree `C:\Users\nname\AppData\Local\Temp\b-d186read-wt` (t180 17c2301 + A's final `document.js` /
`adapter.js`, with `checkDoc` and `jointProblem`). Base: `gen_tracks.json` track 0 (sealed), built with `extend`. Under the lock at
4096 MB.

## A3-1 · NEGATIVE CONTROL 2: injected breaks the Δκ clause must flag
**How the breaks are injected (below the document layer):**
- The harness copies the base document's pieces into a plain object and edits ONE road joint's control points.
- `toPath` is called with `document.js`'s exported `checkDoc` REPLACED, for that call only and in that process only, by a
  pass-through. `adapter.js` calls it through the module object, so the adapter builds whatever it is given. No file is edited.

**The 6 injected cases:** 2 kinds × 3 joints. The joints are the ROAD joints nearest to 25%, 50% and 75% of the base path length.
Let j be the joint's path distance, i the piece after it, and c its κh control points.
- **C0-broken** (a curvature step): add **+0.002 m⁻¹** to EVERY κh control point of piece i. The value jumps at j, and the slope is
  unchanged.
- **C1-broken** (a curvature-rate kink): add **+0.002 m⁻¹** to c[1] of piece i ONLY. The value at j is unchanged, and the slope
  changes by 3·0.002/h.
- κh was chosen because it shapes the centreline, which Δκ measures. φ, w and r do not move the centreline, so Δκ cannot see
  them by construction (stated, not tested).

**The measure:** exactly amendment 2's A2-3 rule.
- Δκ = κ_injected − κ_base on the adapter's samples at 0.5 m (references/02 §3, 0.5 m chords), aligned by index.
- stepᵢ = |Δκᵢ − Δκᵢ₋₁|.
- The window for an injected case: **s₀ = j + r, r = 20 m**, so W = [j, j + 40]. The break sits AT W's left edge. W⁺ = W widened by
  2 local knot spans of the base.
- **FLAGGED** when the max step within ±5 m of any of the four edges is > the max step inside W's middle half [j + 10, j + 30],
  + 1e-9 m⁻¹ (the clause failing IS the flag).

**PASS: FLAGGED on ≥ 5 of the 6.**

**A NOTE, stated before the run** (not a prediction of the outcome): the clause is a FIRST-difference rule. It sees a C0 break as a
step spike at the edge. A C1 break shows only as a change in step SIZE at the edge. Whether that change exceeds the middle half's
largest step depends on the κ-rate the kink leaves inside W. So the C1 cases are the real test of whether the clause can see a
kink.

## A3-2 · STRUCTURAL: checkDoc refuses a broken joint
- The same two injected documents at the 50% joint (C0 and C1), passed to `checkDoc` DIRECTLY.
- **PASS:** each throws a `CoreError` with `code === 'JOINT'`, both cases. Any other outcome (no throw, or a different code) is a
  FAIL.
- **Control:** the unbroken base passes `checkDoc`.

## A3-3 · The verdict
**Test 3 PASSES under the ruling** when:
- amendment 1's brush clauses held (they did: 30/30, κv 6/6, r = 100 15/15, only the 3 predicted narrow misses, `p-d185-read-B`),
  AND A3-1 flags ≥ 5 of 6, AND A3-2 refuses both.

**Otherwise it does not,** and says which part failed.

**Reported beside every earlier verdict:** the original seal FAIL; amendment 1 no pass; amendment 2 27/30 (r = 20 kept in).
Amendment 2, the chair's ruling, and amendment 3, the librarian's ruling, answer different questions. Both results stand.

---
**Sealed by B.** The sha256 and the time are in `exo_memory/handback/p-d186-amend-B_2026-09-28.md`. No injection has been run at
sealing.
