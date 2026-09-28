# D179 · the first jump must not be red by default (pane E) · 2026-09-27

**Packet:** the chair's D179 E. **Nothing is committed.** The fix is mostly in A's `src/doc`, so it is an exact diff for
A to apply (§2); my side is one handler (§3). B owns the CHANGELOG, so my entry is §8.

## 0 · The cause, measured

- **What the new user met:** a jump with no speed of its own had its landing ramp sized for **300 km/h**
  (`vocab.js LANDING.DEFAULT_KMH`, "inferred, to be tuned"), while validation checks it at the **design speed, 460 km/h
  by default**.
- **Where it shows:** placed at the build head, the ramp is the only road after the flight. At 460 km/h the 3.2 g fall
  comes down 31.1 m past the gap, and a 300 km/h ramp is 19.3 m, so it is RED. That is C's d177b capture, "3.2 g clears,
  no touchdown found".
- **Where it does not show:** on a closed loop the words after the jump carry the landing. `buildExport` of a closed
  loop with a jump caught both falls at the ghost lap's 764 km/h over the same 19.3 m ramp (checked, §7). So the red
  was a build-head problem, not an export problem.

**The ramp needed, per speed.** The default jump is a 12 m gap, 0.7 m drop, level lip and −2° landing.
`jumps.js landingRamp`, run on the tree with the diff:

| design speed | ramp | 3.2 g touchdown past the gap | 6.3 g touchdown |
|---|---|---|---|
| 285 km/h | 17.7 m | 7.7 m | **does not clear** |
| 290 km/h | 18.2 m | 8.2 m | 0.2 m |
| 300 km/h (the old sizing) | 19.3 m | 9.3 m | 0.8 m |
| **460 km/h (the default)** | **41.1 m** | **31.1 m** | **12.5 m** |
| 600 km/h | 67.0 m | 57.0 m | 26.0 m |
| 764 km/h (the slider's top) | 105.8 m | 95.7 m | 46.0 m |

**Cited:**
- the two falls: FINDINGS.md:336-337, "the measured range is **3.2–6.3 g**";
- that a ramp must catch both: FINDINGS.md:341-342, "The landing must catch the long flight (3.2 g) and the short one
  (6.3 g), which is an argument for long landing ramps", and :384-386, "the landing ramp has to catch both";
- the default design speed: FINDINGS.md:476, "The design-speed default is the pooled p50, 460 km/h".

## 1 · The design, and the one choice in it

- **A jump with no speed of its own sizes its ramp for the DESIGN SPEED.** That is the slider's speed while the track
  is open, otherwise the default 460 km/h (`MACH6.designSpeedKmh`).
- **The ramp resize is DERIVED: no undo step.**
  - The document does not change. The ramp is a function of the document and the design speed, and the design speed is
    a setting of the shell, as the slider already was of the validation panel.
  - So undo has nothing of the slider's to take back. Moving the slider back gives the same ramp to the bit (tested).
  - Undo after a slider move takes back the last WORD (tested).
- **Why not a document field** (which would make it one undo step)? `serial.js` holds the document to a strict key list
  and a hand-written canonical form (`serial.js:186`, `:143`). A field is a schema change across `document.js`,
  `serial.js`, share codes and likely a schema version, in files A is changing for the soak fixes. Derived needs none
  of that. The choice is reversible later if the chair wants the design speed saved with the track.
- **A CLOSED loop keeps its ramps at the default when the slider moves.** Resizing a ramp moves everything after it,
  so it would open the loop: the same failure as the length drag I routed to A in p-d177-incval §3.1. The connector
  closes with the default, since `connector.js` resolves without a speed. On a closed loop the landing is carried by the
  words after the jump (§0). Tested: the loop still closes at 700 km/h.

## 2 · For A: the exact diff (`scratchpad d179/a.diff`, sha256 `7431c4c83cd3ef2b`, 177 lines; re-made at 21:0x after A's own edit of `app/shell.js`)

**Made by script** (`d179/make-a-diff.js`) on copies of A's current files. Every replacement must match once, or it
stops. It is against these files:

| file | sha256 (16) |
|---|---|
| `src/doc/vocab.js` | `240d3d70a4f212bc` |
| `src/doc/resolve.js` | `974c0ffcc2cde9dd` |
| `app/shell.js` | `5daa1945a4a89137` (A's current, which already carries my D177 timers fix) |
| `test/doc-jump.test.js` | `6ce32484bd0395f7` |

- **`vocab.js`:** `LANDING.DEFAULT_KMH` goes from 300 to `MACH6.designSpeedKmh` (460), with the reason.
- **`resolve.js`:**
  - `resolve(doc, { designSpeedKmh })` and `resolveFrom(prev, doc, { designSpeedKmh })`;
  - `landingRamp` sizes for the jump's own speed (`speedFrom 'word'`), else the given design speed (`'design'`), else
    the default (`'default'`);
  - the result records `designSpeedKmh`, and `resolveFrom` re-resolves in full when it differs;
  - a speed that is not a positive number is a `ResolveError BAD_DESIGN_SPEED`.
  - Every existing caller without a speed gets the default: the connector, the export, the ghost and the tests.
- **`shell.js`:**
  - `state.designSpeedKmh` (null = the default);
  - `setDesignSpeed(kmh | null)`: checked, re-resolves, NOT a history entry;
  - `resolved()` passes the speed for an OPEN document only.
- **`test/doc-jump.test.js`, one test changed, because its requirement changed:** "with no speed on the jump the ramp
  is sized for the stated default, 300 km/h" now reads 460 km/h. It pinned the old default, which this packet replaces.
  The other ramp tests pass explicit speeds and are untouched.

**If it does not apply:** A is changing `src/doc` for the soak fixes. The script re-makes the diff against whatever A
has (`node d179/make-a-diff.js`), and it stops, naming the hunk, if any replacement no longer matches once.

## 3 · My side (applied, live)

- **`app/validate-ui/index.js`:** the slider's handler calls `shell.setDesignSpeed(kmh)` and then
  `ctl.setDesignSpeed(kmh)`, so the ramp is resized before validation checks at the new speed.
- **The shell call is guarded** (`typeof shell.setDesignSpeed === 'function'`): until A applies §2, the handler does
  exactly what it did before.
- **For the landing default itself, nothing in `src/validate` changed.** Validation already checked each jump at its
  take-off speed against its landing road; it was the ramp that was built for the wrong speed.
- **`src/validate` did change for the addendum** (§5a): a jump with no forward gap is red, not thrown.

## 4 · Tests (`app/test/validate-ui-jumpdefault.test.js`, 8 tests; it LANDS WITH A's DIFF)

**Where it lives until then:** it calls `shell.setDesignSpeed`, so it goes in with §2. Until then it sits in
`scratchpad d179/tree/app/test/` (sha256 `399fa7f5a5970ac0`). **In the live tree it would fail today**, and B's suite
would go red for a diff that is not applied.

**On the tree with §2 applied:** `node --test --test-concurrency=4 app/test/validate-ui-jumpdefault.test.js` → **8/8**. The 8th was added after the mutation pass: resolve itself refuses a bad design speed.

1. **The default jump at the default speed is clean:** no red, both landings caught, and the ramp sized for 460.
2. **`resolve` with no speed gives the same default ramp,** so the export, the connector and the ghost agree with the
   panel.
3. **The slider swept over its whole range, at its own step:** 50, 55 … 760 (a range input snaps to min + n·5), plus
   764, its maximum.
   - At every speed where the car clears the gap, computed independently from `jumps.landingRamp`'s touchdowns, there
     is NO red, and the ramp follows the slider with `speedFrom 'design'`.
   - That is **clean at every step from 290 to 764 km/h (96 steps).**
   - Below 290 km/h the 6.3 g fall does not clear the 12 m gap at any ramp length, so the jump is red for exactly that,
     `landing-misses-zone`, and nothing else.
4. **A jump sculpted past what the car can clear is red, with its reason.**
   - The gap is sculpted to 80 m at 460 km/h. The result is one `landing-misses-zone`, with its ARCHITECTURE source,
     and `worst` names the heaviest fall that misses (6.3 g).
   - **The packet said "sculpted too short".** The ramp itself has no handle: it is sized by resolve, so it cannot be
     sculpted short. What a user CAN overdo is the flight, and that is the red tested.
5. **Derived:** after `setDesignSpeed`, the history is the same object. At 600 km/h the ramp is longer; back at 460 it
   is the same length to the bit; undo takes back the last word.
6. **A closed loop keeps its ramps when the slider moves to 700,** and `buildPath(…, closed)` still closes.
7. **A design speed that is not a positive number** is refused with a message and changes nothing.

**Neighbouring suites on the tree with §2 applied:** doc, validate, shell, validate-ui, onboarding, phrasebook, export
and handles.
- The result is 425/427. The 2 failures are `app/test/shell-dist.test.js`, which reads `src-tauri/build.rs`, absent
  from my copy. Live they pass 2/2.
- So nothing regressed that I could run. **The full suite under the lock is NOT run by me** for this diff; it is A's
  to run on applying it.

## 5 · The chair's wording, against what was built

- "It RESIZES when the speed slider moves": yes, **on an open track**. On a closed loop, no, and §1 says why.
- "clean at every step" of the slider: yes, **from 290 km/h up**. Below it, no ramp can help a 12 m gap, and the red
  says so. **The call left open:** a gap that also shrinks with the design speed would make the jump clean down to
  50 km/h. It is a change to what the jump word IS, so it is A's and the chair's decision. Not done.
- "stays red only if the user sculpts it too short": the ramp cannot be sculpted (§4.4). The flight can, and it is red
  when it is too much.

## 5a · ADDENDUM (the chair, 21:0x): validation must REPORT red, never throw

**A's finding** (p-d179-soakfix-A §3): `src/validate/index.js` called `checkJump`, and `jumps.js:41` throws a plain
`Error` when the measured gap is ≤ 0. `buildExport` would pass that throw straight through.

**Reproduced from A's own capture:**
- the document is `captured-17.t180track`, from A's scratchpad (1923 bytes);
- it was opened with HEAD's `src/doc/resolve.js`, before A's JUMP_PAST_VERTICAL fix, and validated at 460 km/h;
- the harness is `scratchpad d179/repro/`.

| validation | result |
|---|---|
| HEAD's | **throws** `Error: checkJump: the gap must be positive, got -12.000000000000007` |
| mine | **red** `jump-gap-not-forward` (worst 12 m: the landing lip is 12 m behind the take-off lip), plus that document's own `landing-misses-zone` |

**The fix** (mine: `src/validate/index.js` sha256 `46d91c5f658dd0c8`, `app/validate-ui/jumparcs.js` `ed86459796df007d`):
- A jump whose landing lip is not ahead of its take-off lip gets a jump entry with `badGap: true`, no landings and
  `reachable: false`.
- It also gets a red over its flight: `jump-gap-not-forward`, with source "ARCHITECTURE.md:72 (a jump check needs a
  gap …)" and `worst` = how far behind the lip it lands.
- `checkJump` is never called with it.
- A closed lap over it FAILS with that reason, not a generic "landing-unreachable".
- The jump arcs skip it, since there is no flight to draw.

**Tests** (`test/validate_jumps.test.js`, sha256 `9dcc72342c796468`; mine, from D166): **16/16.**
- a gap of 0, and a gap of −5 m: each is one named red with its source and `worst`, `badGap` set, and `doesNotThrow`;
- a closed lap over the −5 m jump fails with the reason.
- Validation, validate-ui, A's jump tests and the export tests together: **183/183.**

**THE AUDIT: every throw site in `src/validate`, and what each is.**

| site | throws when | reachable from a user's document? | verdict |
|---|---|---|---|
| `index.js:137` | `validate` is called without a path with samples, or without segments | no: a caller's bug | **kept**: fail loudly |
| `index.js:140` | the path has fewer than two samples | no: `buildPath` always gives the start and the end of every word | **kept** |
| `jumps.js:41` `checkJump` | the gap is ≤ 0 | **YES**, via validate (the gap is measured from the geometry) | **fixed**: validate reports red first and never calls it so |
| `jumps.js:25` `minSpeed` | the gap is ≤ 0 | only through `checkJump`, after its own guard | kept |
| `jumps.js:78-79` `landingRamp` | the gap is ≤ 0, or no take-off speed | not from validate. It is called by A's `resolve.js` with the word's `gap` handle and a speed resolve guarantees positive | kept, and **checked** that A guards it: a `gap` of 0 or −1 is refused by `checkDoc` (`DocError HANDLE_RANGE … outside [0.001, 10000]`). The smallest allowed, 0.001, becomes a named `ResolveError JUMP_UNSOLVABLE`, not a plain throw |
| `bounds.js:76` `handleBounds` | no word with that id | no: an API misuse | kept |

**Not audited:** throws in modules `src/validate` calls but does not own (`src/geom/profile.js normalize`, `limits.js`),
beyond what the tests above exercise.

## 6 · Mutation pass

**How it ran:**
- `d179/mutate_d179.js`: 16 mutants, on a COPY of `d179/tree` (the repo with §2 applied and my test file), under the
  lock, at `--test-concurrency=4`.
- The tests run: `validate-ui-jumpdefault`, A's `doc-jump`, my `validate_jumps` and `validate-ui-jumps`.

**First pass: applied 16 / caught 13 / NOT APPLIED 0.** The copy was restored equal to the tree.

| # | mutant | result |
|---|---|---|
| 1 | the no-forward-gap guard removed (validation throws again) | caught |
| 2 | the no-forward-gap red not pushed | caught |
| 3 | the lap not told why | caught |
| 4 | the jump arcs do not skip a no-gap jump | **SURVIVED**: a test gap |
| 5 | `vocab.js`: the default back to 300 km/h | caught |
| 6 | the given design speed ignored | caught |
| 7 | the jump's own speed ignored | caught |
| 8 | `speedFrom` always "default" | caught (by the assertion added before the pass) |
| 9 | `resolveFrom` keeps a result made at another speed | caught |
| 10 | `resolveTail` does not pass the speed on | caught |
| 11 | the result does not record its speed | **SURVIVED**: equivalent in output. `resolveFrom` then re-resolves in full every time, which is the same answer, only slower |
| 12 | `resolve` accepts a bad speed | **SURVIVED**: a test gap. The shell refused it first, and nothing called `resolve` with one directly |
| 13 | the shell resizes a CLOSED track too | caught |
| 14 | `setDesignSpeed` does not re-resolve | caught |
| 15 | `setDesignSpeed` adds an undo step | caught |
| 16 | `setDesignSpeed` accepts any value | caught |

**Tests added for #4 and #12:**
- `validate-ui-jumps`: a no-gap jump draws no arc.
- `validate-ui-jumpdefault`: `resolve` itself refuses 0, −5, NaN and Infinity with a named `ResolveError`, and takes null
  as the default.
- The new tests: **16/16** on the tree.
- **The re-run of #4, #11 and #12** (`ONLY=4,11,12 node d179/mutate_d179.js`, under the lock):
  - applied 3 / caught 2 / NOT APPLIED 0;
  - #4 is now caught, #12 is now caught, and #11 survives, as the equivalent mutant it is.
- **Final: 16 applied / 15 caught / 0 NOT APPLIED. The one survivor is equivalent in output** (a slower, full
  re-resolve).

**One run was discarded, and why.** An earlier run of this pass (03:01) was stopped and thrown away. My own dry run of
the next version began by clearing its working copy while it ran (EPERM, partial). That process then died, and A's
next run correctly took over its dead lock. Its partial results are not used. The numbers above are the fresh run.

## 7 · Commands (scratchpad `d179/`)

- `make-a-diff.js`: makes `a.diff` and `tree/` from the live files.
- The slider sweep, the export check and the ramp table are node one-liners over `tree/`, recorded in this lap's
  transcript. The one that proves the export point is `buildExport` of
  `straight straight jump straight turn straight turn` + `closeLoop()`.
- `mutate_d179.js`: the mutation pass.

## 8 · CHANGELOG entry (for B)

- **Fixed:** the first jump a new user placed was red straight away. A jump's landing ramp was sized for 300 km/h
  while the track is checked at the design speed, 460 km/h by default, so the long 3.2 g fall landed past the ramp's
  end.
  - The ramp is now sized for the design speed: 41 m at 460 km/h instead of 19 m.
  - On a track still being built it resizes when the design-speed slider moves. The slider is a setting, not an edit,
    so there is no undo step.
  - A closed loop keeps its ramps, because resizing one would open the loop, and the road after each jump already
    carries its landing there.
  - Below 290 km/h the default 12 m jump cannot be cleared at all, and it says so.
