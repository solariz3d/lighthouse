# P-GEN-RED-FIRST — the red at `gen-consumer.js:298`, and the citation it did not survive

Pane A · lap D005 · 2026-09-03 · seat mount `sibling-906f757a`
Artifact: `consonance/tools/gen-consumer.fixture-scope.test.js` (new), one EXCLUDE entry in
`consonance/tools/gen-consumer.js`.

---

## THE CITATION, CHECKED FIRST — and it does not hold as written

The packet routed `librarian/2026-09-03.desktop.md:95`: *"`:298 isFixture` — the fixture guard that
did not stop the 08-23 break."* The chair said to treat it as a claim, not a location. It is wrong
in one direction and right in a better one.

```
git log --oneline -S 'function isFixture' -- consonance/tools/gen-consumer.js
  b20fed5 the generator was rewriting test fixtures, and three suites went green over the damage
git log -1 --format='%h %ad' --date=iso 0ee522b
  0ee522b 2026-08-23 02:51:56 -0600
```

`isFixture` **did not exist during the 08-23 break.** `0ee522b` is the build that broke; `b20fed5` is
the repair, and `isFixture` is the repair. Its own docstring says so: *"Three shipped suites went
green on rewritten fixtures before this existed."* A guard that postdates a break did not fail to
stop it.

And the repair works. Measured over the real generator on the real tree, the three named 08-23
casualties are byte-identical to source, and `main.rs:8835`'s Rust assertion — rewritten on 08-23
into `assert!(shelf.contains("the record, 2026-08-22"))`, which cannot pass — is intact:

```
node -e "…G.build('',{dry:true}); diff every isFixture(rel) file against source"
  6 fixture files differ from source, all token-only and consistent within file
  agreement-spread.test.js · corrections-gate.test.js · second-vantage.test.js : IDENTICAL
  main.rs:8835 : IDENTICAL
```

**So there is no live red to be had at :298 from the 08-23 break.** Written as the packet framed it,
the test would have been a replica agreeing with itself. What is live at :298 is the defect the
repair introduced, and it is worse than a broken test.

---

## THE FINDING — the repair's predicate is over-broad, and it opened the one leak class this tool exists for

`isFixture` keys on `/\.rs$/`. That classifies the whole of `main.rs` — ~10,000 lines, of which
`#[cfg(test)]` is a small tail — as a fixture, against its own docstring (*"Test files and the Rust
`#[cfg(test)]` block are fixtures"*). Two guards stand down together and a third never covered it:

1. `transform()` routes it to the token-only branch, so `demachine()` never runs on it.
2. `scan()` waives DANGLING, MACHINE and RECORD for fixtures.
3. `build()`'s `unportable` report matches DANGLING and RECORD refs only — **never MACHINE**.

Measured at HEAD:

```
node -e "const r=G.build('',{dry:true}) …"
  refused: none | leaks: 0 | unportable entries: 18
  main.rs in unportable: 7 refs — all DANGLING/RECORD
  scan(main.rs as fixture)     : 0 MACHINE
  scan(same bytes, non-.rs path): 3 MACHINE
```

The three hits, in `///` doc comments in **live code**, nowhere near `#[cfg(test)]`:

| line | class | content |
|---|---|---|
| 363 | MACHINE | `{home}\OneDrive\Desktop\projects\lighthouse\` — LEAKS calls this *"the keeper's personal sync directory"* |
| 404 | MACHINE | `the repo moved out of OneDrive on 2026-07-28` |
| 5351 | MACHINE | `C:\Consonance\lighthouse\exo_memory\map\` — the private tree's own path |

Confirmed present in the staged output: `grep -rn OneDrive` over the generated tree returns
`main.rs:363` and `:404`.

**Not refused, not reported, not counted.** DANGLING and RECORD hits in the same file *are*
surfaced through `unportable`, so a reader is told about those. MACHINE is the one class in neither
channel — in a Rust file it is invisible to every part of this generator.

**It is a regression, not an old gap.** Pre-`b20fed5` `scan()` read
`const allowed = ALLOW[rel] || [];` — no fixture clause — so those lines failed the build.

---

## THE BAR — mutation-proven, and the mutation corrected my draft

Three loads of the generator from a **mutated copy in scratchpad**, with `__dirname` repo resolution
replaced by a literal path. The shared checkout was never edited for this.
Harness kept at `scratchpad/mutate.js`.

```
HEAD (unmutated)                   T1 GREEN · T2 RED (3) · T3 RED    refused: none · leaks: 0
A: isFixture -> false              T1 RED   · T2 RED (2) · T3 GREEN  refused: 15 leak(s)
B: waiver scoped to #[cfg(test)]   T1 GREEN · T2 RED (3) · T3 GREEN  refused: 9 leak(s)
```

- **A is the reproduction.** Neutering the guard turns T1 red — the 08-23 break returns over the
  real tree. That is what makes T1 a test about the break rather than about four files existing.
- **B is the candidate fix and it does NOT clear T2.** I predicted it would. It does not: scoping the
  waiver makes the generator **refuse** the three MACHINE hits; it does not remove them. So the two
  reds have different owners, and the drafted file said otherwise until the run said this.
  - **T3** clears with the predicate fix.
  - **T2** clears only when `main.rs`'s doc comments stop naming those paths, or `demachine()` grows
    patterns that match them. No scan change turns it green.
- **A's second finding:** under A the private-path count drops 3 → 2, because `deidentify()` rewrites
  `C:\Consonance\lighthouse` → `%CONSONANCE_HOME%` on a non-fixture. That substitution exists today
  and the fixture routing is what declines it.

---

## THE ARTIFACT

`consonance/tools/gen-consumer.fixture-scope.test.js` — 1 green, 3 red, declared
`JS-SUITE: EXPECTED-RED` so the suite classifies it as a canary rather than a failure. The
declaration is in the file so it dies with the fix: js-suite treats an expected-red that goes green
as a failure, which forces whoever repairs the predicate to come back and remove the marker.

**The declaration failed on its first landing and I only know because I ran the suite.** I put the
marker inside the block comment as ` * JS-SUITE: EXPECTED-RED`. `js-suite.js:217` is
`/^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/m` — the line must START with `//` or `#` — while its own
header at `:41` says only *"a file declares itself by containing the marker."* The suite read the
file as `FAILED`, `0 canary`. Moved to a `//` line at the top; re-run gives
`1 canary · 0 sang`, and the file is listed as *"declared EXPECTED-RED, still red — not counted as a
failure."* **That is the same shape as the finding above, twice in one session: a docstring
describing a looser rule than the code implements.** Worth a line in `js-suite.js:41`; not my file,
not taken.

It is a **new file, not an addition to `gen-consumer.test.js`**, for one measured reason: the canary
marker is per-file, and putting a deliberate red in the existing 26-test file would blanket-exempt
every real red in it. *A canary is an exemption from failing, never from classification.*

Every existing fixture test in `gen-consumer.test.js` calls `transform()` on a hand-written literal.
That measures a model of the break. This file runs `G.build('', {dry:true})` and reads the staged
output — **a replica is not evidence until it agrees with the instrument**, which is the line the
packet turned on.

One EXCLUDE entry added to `gen-consumer.js`: the new test requires `gen-consumer.js`, which does not
ship, so unexcluded it would crash on load in a consumer tree. Verified the entry **fires** rather
than joining `portable-paths.baseline.json` as a dead entry (`excluded` contains it; the file is
absent from staging).

---

## WHAT I DID NOT VERIFY, AND WHAT THESE TESTS CANNOT CATCH

- **I did not land the fix.** Mutation B is proven in scratchpad only. Landing it makes the generator
  **refuse** (9 leaks) — B is registering the split predicate against current output this lap, and
  changing what the generator emits underneath that would invalidate the reading. The fix is
  described precisely above so the holder implements rather than rediscovers.
- **T2 asserts on output content, not on the predicate.** A fix that keeps `isFixture` over-broad and
  merely deletes the offending comments turns it green while the hole stays open for the next Rust
  file. The scope claim is not asserted directly, because asserting it needs a `#[cfg(test)]` region
  model, and a model is what this file exists to avoid trusting.
- **T1 pins four named casualties.** It does not prove no other fixture was damaged.
- **The suite delta is unattributed.** Private tree `66 green · 3 failed of 70`; generated tree
  `42 green · 17 failed · 3 crashed of 63` (both run this session). That is 14 more failures and 3
  more crashes than the private tree, and I did **not** do the file-by-file attribution the 08-23
  entry did. I do not know how many are generator rewrites vs manifest gaps vs absent data. One I
  did check: generated `portable-paths.test.js` fails on `the green line says how many baselined
  sites are FATAL`, which is a **manifest gap** — `portable-paths.baseline.json` is `.json` and the
  tools rule matches `/\.js$/`, so it never ships. Not a rewrite.
- **Nothing here says the generated tree compiles or runs.**
- **`gh repo view solariz3d/lighthouse --json isPrivate` → `false`, `pushedAt 2026-09-03T07:07:40Z`.**
  Confirms the chair's context. `gen-consumer.js:2` says *"the PRIVATE lighthouse tree"*. T4 pins the
  claim, not the fact — the visibility is not checkable from a test without a network call, so if the
  tree is made private again the fix is to say so beside that line, not to delete the test.
- **Every suite number here is a reading of a MOVING tree.** Four full runs inside ~25 minutes:
  `66 green · 3 failed of 70` → `67 · 5 of 73` → `68 · 4 of 73` → `67 · 4 · 1 canary of 73`. Files
  appeared between runs (`baton-wake.*`, `clean.js`) and `staged` moved 176 → 180. In the third run
  `portable-paths.test.js` came back FAILED; run standalone immediately after it is **31/31 green**,
  so that red was another seat's in-flight edit, not a state of the file. Treat the generated-vs-
  private delta above as an order of magnitude, not a measurement, and re-run both sides in one
  quiet window before anyone scores it.

---

## FOR B, SPECIFICALLY

The split predicate treats `record/`, `journal/`, `loop/`, `map/` as the ship/stay question. This
finding is a **third case that neither branch covers**: `main.rs` ships by manifest, is not under any
of those directories, and carries the private tree's path and the keeper's OneDrive path in prose
doc-comments that the scan is currently waiving. A predicate that decides *which files* ship does not
reach it. It needs a rule about *which lines inside a shipped file* the leak scan may waive.

---

*Written by pane A, mount `sibling-906f757a`, lap D005. Nothing pushed.*
