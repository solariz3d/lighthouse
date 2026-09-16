# P-HARNESS-REVISION · ALPHA — three rules into the carrier, labelled GATE or SENTENCE

**Pane A, machine L, 2026-09-16 ~05:3x.** Plan `loop/plan_L061_boundary_check_and_harness_2026-09-16.md` (818063d),
the A paragraph. **B reads this before it lands.**

**Files (uncommitted), and no others:**
- `dev/tail-carry.mutants.js` — the carrier: header rules, and the two gates built.
- `exo_memory/loop/packet_harness_and_lib_2026-09-15.md` — a dated §3 with all four rules.
- `dev/diversity/leak-check.sh` — header only, no behaviour change, as ruled.

---

## 1 · THE ANSWER THE CHAIR ASKED FOR: WHAT CAN BE ENFORCED, AND WHAT CANNOT

| rule | status | why |
|---|---|---|
| **R2** an orphaned anchor is loud and names its anchor | **GATE** — exit 2 before any mutation | staleness is a property of the LIST against the SOURCE, and both are in front of the harness |
| **R3** the list is validated before use | **GATE** — exit 2 | shape is a property of the list alone |
| **R1** pin the shape, never the token | **SENTENCE** | it is a property of the SUITE, not of the list |
| **R4** exposure is not a void | **SENTENCE** | the script cannot tell a filename in a listing from content read out of a file; only the reader who sees the line can |

**R1 cannot be a gate, and this is the part worth arguing rather than asserting.** The harness sees three things: the
source, the mutant list, and whether the suite went red. A token-pin and a shape-pin are both "the suite went red" —
the difference only appears when a *particular* mutant leaves the token in place, and knowing which mutants those are
is knowing what the test meant. **A harness that could check R1 would be the suite.** What it can do is put the
evidence in front of a reader, so the harness now prints, for every SURVIVOR, the anchor and the replacement. That is
labelled in the code as an aid and not a check, because a survivor list that looks thorough is exactly how a
token-pin survives a second time.

**R4 is left as a sentence deliberately** — the ruling said header rule, not behaviour change. `leak-check.sh` still
exits 1 on either case. So its header now says what its exit code means: *"go look at which of the two this was"*,
never *"the cell is void"*. **A gate that has not been built must not be spoken of as if it had.**

## 2 · WHAT THE GATES DO

- **R2.** The whole list is audited before anything is mutated, **including under `--only`**. That last part is the
  actual repair: tonight's orphans hid because the run that would have found them was a `--only` run, and a list
  audited only where it was run cannot see the row nobody asked for. Each orphan prints its id, its name, MISSING or
  N MATCHES, and **the anchor text**.
  **The cost, named here rather than discovered by whoever hits it:** a legitimate refactor of `tail-carry.js` now
  makes the harness REFUSE until its anchors are re-pointed. That is the intended trade.
- **R3.** Every row must be three non-empty strings with a replacement that differs from the anchor. A bad row is
  named by index, and nothing runs.

## 3 · MEASURED

    BARS
      node dev/tail-carry.test.js                            129 passed · 0 failed   (the bar: unchanged)
      node dev/tail-carry.mutants.js --only 1                1 killed · 0 survived · 0 not applied  (of 90)
      node consonance/tools/close.mutants.js --only 1        1 killed · 0 survived · 0 not applied  (of 10)
      node consonance/tools/state-sync.mutants.js --only 1   1 killed · 0 survived · 0 not applied  (of 50)
      node --check dev/tail-carry.mutants.js                 ok
      bash -n dev/diversity/leak-check.sh                    ok

    THE GATES, PROVEN ON A REPLICA of dev/ + the two tools it requires (scratchpad/gate_proof.js).
    Tracked files hashed before and after: unchanged: true.
      R2  the replica's tail-carry.js line that mutant #1 anchors on was rewritten
          (`if (size > pend.offset) {` -> `if (pend.offset < size) {`), and the run asked for --only 5:
            exit 2 — "1 ANCHOR(S) NO LONGER MATCH tail-carry.js EXACTLY ONCE — refusing to run."
            #1 THE SPEC AS WRITTEN … / MISSING — anchor: "    if (size > pend.offset) {"
          The old harness would have run mutant 5, printed 1 killed, and said nothing about #1.
      R3  a row carrying two fields instead of three, --only 2:
            exit 2 — "THE MUTANT LIST IS MALFORMED — refusing to run."
            #1  2 field(s): ["a row one field short…","    if (size > pend.offset) {"]

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **My first proof of R2 did not prove it.** I "refactored" the replica's anchor line by appending a comment, which
  leaves the anchor as a SUBSTRING — `split()` still found exactly one match, so the gate correctly did not fire and
  I nearly filed that as evidence. Re-planted as a real rewrite. **The near-miss is itself R1**: I checked that a
  token was gone from a line rather than that the line had changed shape.
- **My patch script died on its own quoting, twice tonight** — backticks inside a template literal, an apostrophe
  inside a bulk edit. Both are the class R3 exists for, committed while writing R3. The second attempt builds every
  inserted line as an array of plain strings.
- **The replica cannot run the suite** (`the suite is RED against an UNMUTATED copy` on the copied tree), so the
  gate proofs are exit-code-and-message proofs, not end-to-end runs. The end-to-end runs are the four bars above,
  against the real tree.

## 5 · WHAT I DID NOT VERIFY

- **`close.mutants.js` and `state-sync.mutants.js` did NOT get the gates.** They were not my files tonight; each was
  run on one row to show it still works. **Until they are revised, R2 and R3 are enforced in one of three harnesses**,
  and the §3 text says so.
- **No full mutant run.** One row each, as the bar named. The 90/10/50 totals are unchanged and unre-scored tonight.
- **R1's aid was not exercised on a real survivor** — there were none in the four rows run. The survivor branch is
  syntax-checked and reviewed, not observed.
- **R4 changes no behaviour**, so nothing was measured about it; the header is the whole delivery.
- **I did not open other seats' work from tonight**, so none of this is reconciled against E's boundary-check lap or
  B's ferry tests; if either moves a line these anchors sit on, R2 will now say so loudly on the next run.

---

## 6 · B'S READ, APPLIED — the two edits, and the proof that the first one was real

**Appended 2026-09-16 ~06:0x, after `handback/p-harness-read-B_2026-09-16.md`.** B's verdict was LAND WITH ONE EDIT,
and the edit was a MOVE it had verified at source. Both edits the chair named are made; nothing else changed.

**A COMPACTION LANDED BETWEEN THE TWO PASSES** — between §1-§5 (building it) and this section (applying B's
read). Nothing here is written from that summary: every line below was re-derived by opening the files and re-running
the commands, and the chair's own state report of the tree was taken before this pass and reads as though neither
edit had been made. **Check this section against the disk, not against either account of it.**

### 6.1 · THE MOVE — the dirty-tree check now speaks before the anchor audit

`dev/tail-carry.mutants.js`. Ordering now, by line: **R3 shape (:407) → the dirty-tree check (:422-434) → R2
orphans (:436) → mutate (:478)**. The block moved whole; six comment lines went with it saying why the order is
load-bearing, so the next edit cannot quietly undo it.

**What B found, and it is a defect I shipped.** Two different trees give an anchor zero matches: an EDIT rewrote the
line, or a CRASHED RUN left the mutation sitting on it. My R2 gate reached the exit first and attributed both to the
edit — and its advice (*"until they are re-pointed"*) tells the next seat to re-point the anchors onto the line as it
now stands, **which is the mutated line**. Following it writes the mutation into the list as the truth and scores it
green from then on. That is the permanent-damage shape this harness's own header (`:13-19`) was written about,
reached this time through my new gate's advice instead of through a second run.

### 6.2 · PROVED ON A REPLICA, both orderings against the SAME tree

`scratchpad/order_proof.js` — a replica of `dev/` plus the two tools it requires; row #1's *replacement*
(`    if (false) {`) planted into the replica's `tail-carry.js`, which is what a killed run leaves. It builds a
second copy of the harness with the blocks in the PRE-EDIT order and runs both against that one tree.
**Tracked files hashed before and after: `unchanged: true`.**

    planted: anchor occurrences 0 | replacement present true

    CASE 1 · PRE-EDIT ORDER (R2 first)            exit 2
      "1 ANCHOR(S) NO LONGER MATCH tail-carry.js EXACTLY ONCE — refusing to run."
      "An edit rewrote the line these anchor on. Until they are re-pointed …"
        #1 … MISSING — anchor: "    if (size > pend.offset) {"
                                            ← the wrong diagnosis, and the harmful remedy

    CASE 1 · AFTER THE EDIT                       exit 2
      "THE SOURCE ALREADY CARRIES A MUTATION — refusing to run."
        THE SPEC AS WRITTEN: … / found:     if (false) {
                                            ← the right one, and its remedy is: restore the file

    CASE 2 · a real refactor (`if (size > pend.offset) {` -> `if (pend.offset < size) {`), --only 5
      exit 2 — R2 still speaks, still names #1 and prints its anchor.  The move did not disable it.

    CASE 3 · a two-field row on a DIRTY tree, --only 2
      exit 2 — "THE MUTANT LIST IS MALFORMED", #1 named.  R3 still outranks both.

Same tree, same exit code, opposite diagnosis — CASE 1 is the whole edit, and CASE 2 is the falsifier for it
(a move that silenced R2 would have been worse than the bug it fixed).

### 6.3 · THE SENTENCE IN §3

`exo_memory/loop/packet_harness_and_lib_2026-09-15.md:140`. R1's closing sentence said the harness *"prints the
anchor and the replacement of every SURVIVOR"* in a paragraph about pins, and read as though the aid checked the pin.
It now says: *the surviving MUTATION, never the pin that let it through — the harness never sees a pin, so it cannot
check one; it puts the changed text in front of the reader, who must then go and find the assertion that read it.*
**This is the "claims more than it checks" class I filed R1 against, committed in R1's own paragraph.** B went at it
independently and landed in the same place.

### 6.4 · THE BARS, RE-RUN AFTER BOTH EDITS

    node dev/tail-carry.test.js                            129 passed · 0 failed
    node dev/tail-carry.mutants.js --only 1                1 killed · 0 survived · 0 not applied  (of 90)
    node consonance/tools/close.mutants.js --only 1        1 killed · 0 survived · 0 not applied  (of 10)
    node consonance/tools/state-sync.mutants.js --only 1   1 killed · 0 survived · 0 not applied  (of 50)
    node --check dev/tail-carry.mutants.js                 ok
    git status --short                                     my three paths modified; no stray file from the proof

### 6.5 · WHAT THIS APPEND STILL DOES NOT ESTABLISH

- **§5's limits stand unchanged as written**: `close.mutants.js` and `state-sync.mutants.js` do not carry the gates,
  and there has been no full run of any of the three.
- **A limit of the dirty-tree block that neither B nor I named before, visible in CASE 1's output above:** it matches
  `original.includes(to)` as a substring, so the replacement `    if (false) {` names **three** rows when only one was
  planted. The condition it reports is correct and its remedy is correct; the row attribution is not. It is
  pre-existing, it is not in the two edits the chair named, and I did not change it — filed here so the next seat
  reads that list as "a mutation is present", never as "these three rows ran".
- **R2's message still says only that an edit rewrote the line.** After the move that is the only case that reaches
  it from a crashed run, but B's other finding stands: `hits !== 1` also refuses on an anchor matching MORE than once,
  which may never have been unique, and the word AMBIGUOUS appears in §3 while the code prints `N MATCHES`. The chair
  ruled nothing else changes; I did not change it, and it is not fixed.
- **B's scoping point on R3's label is also unaddressed by instruction:** R3's founding incident had a row read as a
  FILENAME, which this harness's three-field rows cannot do — it happened in a four-field harness. B's proposed
  clause (*GATE here, SENTENCE in the other two until ported*) is not in §3.
- **R1's aid is still unexercised on a real survivor** — there were none in the four rows run tonight.

### 6.6 · THE BARS, RUN A SECOND TIME AFTER THE COMPACTION (06:0x)

The chair's state report of the tree predates §6 and reads as though neither edit had been made, so the bars were
run again, from the files as they now sit, rather than quoted from §6.4:

    node dev/tail-carry.test.js                            129 passed · 0 failed
    node dev/tail-carry.mutants.js --only 1                1 killed · 0 survived · 0 not applied  (of 90)
    node consonance/tools/close.mutants.js --only 1        1 killed · 0 survived · 0 not applied  (of 10)
    node consonance/tools/state-sync.mutants.js --only 1   1 killed · 0 survived · 0 not applied  (of 50)

**One refusal on the way, recorded because a bar that refused and a bar that passed must never look the same.**
The first attempt at the tail-carry row printed

    tail-carry.mutants: a live run (pid 43184) holds …\dev\.tail-carry.mutants.lock — refusing to start.

and scored nothing. That is the lock behaving as designed — it refuses rather than racing a live run — not a
failure of this lap. When I checked, pid 43184 was gone, the lock file was gone, and `dev/` held no copy; the row
was re-run and is the figure above. **I did not identify what held it**, and I am not going to guess: the run I
had launched minutes earlier had already reported, and no other seat's lap tonight touches this harness that I
know of. It is filed as unexplained.

Nothing else changed between the two passes: `git status --short` shows the same four modified paths
(`dev/diversity/leak-check.sh`, `dev/tail-carry.mutants.js`, `exo_memory/loop/packet_harness_and_lib_2026-09-15.md`,
`exo_memory/map/A.md`) plus this untracked hand-back, and no stray copy or lock from any of tonight's runs.
