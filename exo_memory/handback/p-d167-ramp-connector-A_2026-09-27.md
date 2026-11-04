# D167, packet A — the font-transition ramp in the model, and the close-the-loop connector. Pane A, on D, 2026-09-27

Repo `C:\Users\nname\Desktop\t180-track-builder`, `main` @ `ef58520`. **Nothing committed** (panes do not commit).
**Addendum 2 (sculpting and the piece library) was already done before this packet:** it is the ADDENDUM 2 section of
`handback/p-d166-model-A_2026-09-27.md`.

**`src/doc/resolve.js` and `src/geom/path.js` were NOT edited.** `handback/p-d166-read-B_2026-09-27.md` does not exist
yet (`ls handback | grep d166-read-B` → none). `resolve.js` shows an mtime of 12:50, after my last edit, so B is in it.
The resolve change the ramp needs is written up as a diff in §4.

**One correction to the packet:** it names "the 6 TODOs in your `test/doc-geom.test.js`". My `doc-geom.test.js` has 3
tests and no TODO (`grep -c TODO` → 0; all 3 pass). The 6 TODOs are C's round-trip rows (`test/roundtrip.test.js`,
"read_track.cjs heading lock"), seen in every whole-suite run since 12:2x.

## 1. Files

| file | change |
|---|---|
| `src/doc/vocab.js` | `ramp` added to `ROAD_HANDLES`; `RAMP_M = 20` with the ruling quoted beside it |
| `src/doc/serial.js` | `ramp` (m, range 1–1000: "fonts never jump"). **Quanta tightened: lengths 1 mm → 0.1 mm, angles 0.001° → 0.00001°** (§3) |
| `src/doc/document.js` | every road word gets `ramp: 20` at append |
| `src/doc/history.js` | **unchanged**: a sculpted ramp is `editWord` + `commit`, one step like any handle |
| `src/doc/connector.js` | new: `closeLoop(doc, opts)`, `marginOf(closedDoc, opts)`, `integrate`, `DEFAULTS` |
| `test/doc-connector.test.js` | new, 13 tests |
| `test/doc.test.js` | **my own format tests changed, with the format**: the golden text gains `"ramp":20`, and the quantum and hand-edit tests move to the finer quanta (100.00004 / 123.45678 / 100.000049). Nothing else changed. |

## 2. The ramp (the librarian's ruling, `librarian/2026-09-27.desktop.md:129-133`)

- **Every road word carries `ramp`, the transition from the previous road word's profile into its own**, over its
  first `ramp` m, smoothstep in s. Default 20 m, as the ruling says ("inferred as a sensible default, to be tuned").
- It is a handle like any other: sculptable, one undo step (tested), canonical in the text (tested byte-exact at 35.25).
- **Never below 1 m** (`HANDLE_RANGE`, tested): a change within one row step is the hole ARCHITECTURE §4's red list
  names.
- **A jump has no ramp**, since there is no surface. The landing starts on its own profile (tested).
- **My choice, stated:** the ramp runs over the incoming word's first metres, not centred on the join. That keeps the
  edit local: a word's ramp affects that word only, so incremental resolve and C's `extendMesh` stay one-word. Centred
  would make word i's ramp reach back into word i−1. The librarian or C can overrule this.
- **What is NOT done: the ramp does not yet reach the segments.** `resolve.js` is B's this lap, so the document holds
  the ramp and the geometry cannot see it until §4 is applied.

## 3. The connector (ARCHITECTURE §2 :50-51; the ruling: it belongs to the document layer)

- **Shape:** three ordinary words appended at the head (a turn, a straight, a turn: the Dubins plan shape), with
  clothoid ease in and out. It comes back as a doc marked `closed: true`. Closing is one undo step, and undo gives back
  the open document byte-identical (tested).
- **Heading and pitch close EXACTLY.** The last turn is the complement of every turn before it, counted in quanta
  (360° = 36,000,000 quanta, a whole number), and the last climb is the complement of the pitch.
- **Position closes by Newton** on (first turn, straight length, first climb), then a polish on the quantum grid. Each
  step is integrated the way the geometry integrates: heading and pitch turning at k and kp about world up, and position
  = ∫T by Gauss–Legendre-5 on ≤ 0.25 m substeps, from the head's frame taken from `buildPath`.
- **Why the quanta changed:** at 1 mm / 0.001°, one angle quantum on a few hundred metres of lever moves the seam by
  millimetres (500 m × 8.7e-6 rad ≈ 4 mm, inferred), past the geometry's 1e-3 m `closeTol`. At 0.1 mm / 0.00001° the
  seam closes to **2.9e-5–6.9e-5 m** on the test lap (the inline `node -e` run listing candidates; every candidate
  ≤ 1e-3 in the test).
- **G2:**
  - the connector opens from the head's curvature, as resolve does;
  - it closes to 0, where every first word opens from;
  - `closure.g2` reports it, and is true for every candidate on the test lap.
  - It is false when the first word has easeIn 0, which is the user's own curvature step.
- **Ranking** calls E's `validate` (unedited):
  - each candidate's closed lap is built by `buildPath(…, { closed: true })` (C's own closure check) and validated at
    one design speed, **300 km/h by default** (inferred: the platform test's design speed; `opts.speedKmh` overrides);
  - `margin` = provenG (90, `validate/limits.js`) − the largest `f_g` **on the connector** (s ≥ the old head,
    `fromS`);
  - red on the connector sorts last, then margin, largest first.
  - On the test lap: 10 candidates, R 120 m at 6.51–6.52 g (margin 83.48–83.49), R 60 m at 14.2 g, two with red, which
    sort after the clean ones.
- **No candidate is an answer.** It gives `candidates: []` and a `reason` with the counts. The impossible test:
  climbing ~2 km away, with radii [60] and a 10° climb limit, gives "no connector closes this loop within the limits: 9
  starts; 1 did not converge; 8 converged but needed a climb of up to 27.7° against the 10° limit".
- **Refused by name:** an empty document (`EMPTY_DOC`), an already closed one (`ALREADY_CLOSED`), and a heartline
  mismatch between the first and last words (reported as no connector).
- **The candidate doc is `closed: true`, but `resolve` still refuses closed documents** (`CLOSE_NOT_BUILT`, B's file).
  So the connector and its tests resolve the open twin (`{ ...doc, closed: false }`) and close it through `buildPath`.
  §4 item 2 is the resolve change that ends this.
- **My errors on the way:**
  - The first version tried 180 starts, and the test file ran past its 10-minute cap. I cut to 3 starts per (R,
    winding), added an early give-up, and the test file now shares one `closeLoop` result.
  - Newton wandered to a climb of −1,860 rad, and `appendWord` refused it. A step outside the handle ranges is now
    "infeasible", not a crash.
  - My ranking test compared a connector-only margin against a whole-lap one. Candidates now carry `fromS`, the region
    their margin covers.

## 4. THE RESOLVE CHANGE, AS A DIFF (not applied: `resolve.js` is B's this lap). Against `resolveWord` as it stands at 12:50

```diff
-const START = Object.freeze({ kIn: 0, kpIn: 0, pitch: 0, roll: 0, heart: 0, first: true, prevId: null });
+const START = Object.freeze({ kIn: 0, kpIn: 0, pitch: 0, roll: 0, heart: 0, first: true, prevId: null, prof: null });
+const sameProfile = (a, b) => a.u.length === b.u.length && a.u.every((x, i) => x === b.u[i]) && a.psi.every((x, i) => x === b.psi[i]);
 function resolveWord(w, st, segments) {
-  let { kIn, kpIn, pitch, roll, heart, first, prevId } = st;
+  let { kIn, kpIn, pitch, roll, heart, first, prevId, prof } = st;
   …
-    return { kIn: 0, kpIn: 0, pitch: h.land, roll, heart, first, prevId: w.id };
+    return { kIn: 0, kpIn: 0, pitch: h.land, roll, heart, first, prevId: w.id, prof: null };   // no surface to blend from after a gap
   …
   const rollAt = (s) => …, profile = profileOf(w.font, h);
+  const R = Math.min(h.ramp, L), blends = !!prof && !sameProfile(prof, profile);   // a transition stays inside its word
   parts.forEach(([part, k0, k1, kp0, kp1], i) => {
     …
-    segments.push({ …, heartline: h.heartline, profile, speed: w.speed, tempo });
+    const blend = blends && cuts[i] < R ? { from: prof, s0: cuts[i], length: R } : null;
+    segments.push({ …, heartline: h.heartline, profile, blend, speed: w.speed, tempo });
   });
-  return { …, first: false, prevId: w.id };
+  return { …, first: false, prevId: w.id, prof: profile };
```

- **The segment field `blend: { from, s0, length } | null`**: at segment-local u, the word-local distance is `s0 + u`,
  and the weight is `smoothstep((s0 + u) / length)`, capped at 1. **C's geometry blends** width, wall and ψ(u) from
  `from` to `profile` by that weight, as the ruling says. The profiles have 3 or 5 knots (a flat font is the 5-knot form
  with wall 0), so C can blend knot by knot. That is C's call.
- **Item 2, closed documents:** replace the `CLOSE_NOT_BUILT` refusal with: resolve as open, check the seam (the first
  road word's roll0 ≡ the last road word's roll1 mod 2π, heartlines equal), give the first word's segments a `blend`
  from the last road word's profile, and return `closed: true`. The connector's docs then resolve directly.
  `test/doc.test.js` "a closed document is refused until the closing connector exists" must then change: that test was
  written for this lap's gap and becomes wrong by design.
- **Consumers:** `INTERFACES.md` §1 gains `blend` (B), and C's `buildPath`/`buildMesh` read it.

## 5. Tests

- **Tolerances, stated before the first run (in the test header):** the geometry's own bar, 1e-3 m in position and
  1e-6 in tangent (`src/geom/path.js` `closeTol` and its tangent check), and G2 at both joins within 1e-12.
- **Red first, for real:** all 12 original tests failed against a stub `connector.js` (12/12 not ok), including the
  four ramp tests, because `ramp` did not exist yet.
- **`node --test --test-reporter=tap test/doc-connector.test.js` → tests 13 · pass 13 · fail 0** (about 45 s; one shared
  `closeLoop`, plus one for determinism, plus the impossible case).
- The 13th test was added after mutant C7 survived (§6).
- **All mine:** `doc`, `doc-head`, `doc-geom`, `doc-library`, `doc-connector`, `ailine` → see §7 for the final run.

## 6. Mutants — on copies (`scratchpad/d165/conn_mutants.js`; caught = the copied `test/doc-connector.test.js` exits non-zero)

**listed 13 · applied 13 · caught 11 · survived 2 · NOT APPLIED 0 · NO RESULT 0.** Live files unchanged; 0 temp dirs.

| mutant | result |
|---|---|
| R1 default transition 10 m | caught |
| R2 zero transition allowed | caught |
| R3 a jump carries a transition | caught (my first R3 was an equivalent mutant, `RAMP_M + 0 * 1`, replaced before the run) |
| C1 last turn off its complement by 100 quanta | caught (6 failing) |
| C2 last climb off by 100 quanta | caught (6 failing) |
| C3 ranked worst first | caught |
| C4 red ignored in the rank | caught |
| C5 connector ends with curvature on | caught |
| C6 climb limit not enforced | caught |
| **C7 margin over the whole lap** | **SURVIVED → new test → re-run alone: caught** |
| **C8 a loose closure accepted (tolerance ×1e4)** | **SURVIVED, and left**: see below |
| C9 reason drops the climb | caught |
| C10 an already closed doc re-closed | caught |

- **C7 was a real gap.** The ranking test recomputed the margin through `marginOf` itself, so a `marginOf` mutant moved
  both sides. The new test computes the connector's largest `f_g` independently (`buildPath` + `validate` in the
  test). It also checks that the whole lap is harder elsewhere, so the two regions are told apart.
- **C8 is a redundant guard, not an untested behaviour.** A candidate looser than 5×tol (5e-4 m) must still pass the
  geometry's own 1e-3 m `closeTol` inside the ranking, and a looser one makes `buildPath` throw, so the candidate is
  discarded (counted as "refused by the geometry"). Mine bites only between 5e-4 and 1e-3 m. No start in these tests
  lands there, and I could not construct one without faking the solver. Stated rather than hidden.
- Only C7 was re-run after its test was added. Adding a test cannot un-catch the others.
- **The model set (`doc_mutants.js`, 38 mutants) is re-run below (§7),** because the quanta and ramp changed files its
  anchors live in. D2's anchor moved with the quanta and was re-pointed before the run.

## 7. Model mutants re-run, whole suite, privacy

- **Model set re-run** (`scratchpad/d165/doc_mutants.js`: 38 mutants over `src/doc/*`, against the 4 doc test files):
  **listed 38 · applied 38 · caught 38 · survived 0 · NOT APPLIED 0 · NO RESULT 0.** Live `src/doc` unchanged.
  D2 was re-pointed at the new quantum first.
- **Mine:** `node --test --test-reporter=tap` on `test/doc.test.js`, `doc-head`, `doc-geom`, `doc-library`,
  `doc-connector` and `ailine` → **tests 95 · pass 95 · fail 0**.
- **Whole suite:** `node --test --test-reporter=tap "test/*.test.js"` → **tests 356 · pass 350 · fail 0 · todo 6**. The 6
  TODOs are C's round-trip rows.
- **Privacy gate:** `grep -i` over `src/doc/*.js`, `test/doc*.test.js`, `src/export/ailine.js` and
  `test/ailine.test.js`. It found **3 room words, fixed before this hand-back**: "the librarian's ruling" in comments
  in `connector.js`, `vocab.js` and `doc-connector.test.js`, reworded to "the design ruling". Re-grep → 0. The
  `isBuiltinName` hits are the known false positive (it contains "nName").

## 8. What was NOT verified

- **The ramp in the geometry:** not reached until §4 lands (B, then C).
- **A closed document through `resolve`:** refused until §4 item 2.
- **The connector on real-size tracks.** One `closeLoop` on a 0.9 km lap took about 17 s (the inline run). Longer
  tracks and more radii cost more. For the app, the build head needs this off the drag path, or faster. This was not
  profiled beyond the first cut.
- **Connectors other than turn–straight–turn** (e.g. S-shapes with climb spread through the middle). A track this family
  cannot close reports "no connector", not a wrong one.
- **The 300 km/h ranking speed** is inferred. E's lap sim needs `car.accel`, which FINDINGS does not give
  (`validate/limits.js`), so a design speed stands in.
- **Roll at the seam** is closed to the nearest multiple of 2π. A track that has rolled 360° closes rolled-through, as
  intended, and this is not tested beyond the plain lap.

## 9. CHANGELOG entry for B

```
### Added
- Fonts ramp, never jump: every road word carries a transition length (`ramp`, default 20 m, never below 1 m) from
  the previous word's cross-section into its own, sculptable and undoable like any handle. It reaches the geometry once
  resolve carries it (pending).
- `src/doc/connector.js`: close the loop. It builds turn-straight-turn clothoid connectors from the open end back to
  the start, closing heading and pitch exactly and position to the geometry's 1e-3 m, curvature-continuous at both
  joins. It ranks them by validation's worst load on the connector (red last), and reports plainly when no connector
  fits the limits. The chosen one appends as ordinary words, so closing is one undo step.

### Changed
- The document's quanta are finer (0.1 mm, 0.00001°), so a closed loop can meet its start within the geometry's
  tolerance.
```

NEXT: librarian — score D167 when C's and E's are in; B applies §4 (the resolve diff) on its version, then C blends by `blend`, before the app lap
