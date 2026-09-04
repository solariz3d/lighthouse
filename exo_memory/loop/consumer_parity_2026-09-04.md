# CONSUMER PARITY — D010 P4, the run

*Pane J, 2026-09-04. Scored against `bab20a9` `loop/consumer_falsifier_ruling_2026-09-04.md` **as
amended by B**. Non-author of the ruling (A wrote it, B attacked and amended it, the librarian
re-derived B). I wrote none of it. Every number below was produced by a command printed beside it.*

---

## 0 · THE WINDOW — the precondition, met and printed

    git rev-parse --short HEAD    ->  f21dbc9      at OPEN
    git status --porcelain        ->  (empty)      at OPEN
    git rev-parse --short HEAD    ->  f21dbc9      at CLOSE
    git status --porcelain        ->  (empty)      at CLOSE

**HEAD did not move and the worktree was clean at both ends. No seat committed inside the window.**
S and G are taken at **one commit**, not merely one wall-clock window — B's precondition, met.

*The packet named `202c459` as the clean point. HEAD was `f21dbc9`, four commits later (D009
collation, D009 return leg, the D010 sealed guess). Clean is the property that matters and the sha
is printed, so the run stands; recorded because a report that quietly generates from a different
commit than its packet names is the carrier failure one level down.*

---

## 1 · THE VERDICT

    THE TRIPLE      P = 18      M = 1      B = 1
    THE BAR         P =  0      M = 0      B = 0
    THE GUARD       I = S - G = 74 - 66 = 8

**REFUTED.** All three legs of the bar are missed. The falsifier fires, as A predicted it would.

    O1  D = 0                                    FAILS  (18, 1, 1)
    O2a SEED present AND declared in the tree     PASSES
    O2b pick_default_room -> bundled seed         PASSES  (§6)

---

## 2 · S AND G — and the two reconciliations the packet asked for. Both are one root cause.

### The measurements, at `f21dbc9`

    $ find . -path ./node_modules -prune -o -path ./.git -prune -o -path ./target -prune \
             -o -name '*.test.js' -print | sort            ->  S = 74
    $ git ls-files '*.test.js' | sed 's|^|./|' | sort       ->  74
    $ diff <the two lists>                                  ->  IDENTICAL, zero lines
    $ (cd "$T" && find . -name '*.test.js' | sort)          ->  G = 66   MEASURED, not derived

### Reconciliation 1 — `S = 74 by find vs 73 tracked`. **The delta was mine, and it is gone.**

    $ git ls-tree -r --name-only 3d2f1bc | grep -c '\.test\.js$'   ->  73     (A's derivation sha)
    $ git ls-tree -r --name-only f21dbc9 | grep -c '\.test\.js$'   ->  74     (today)
    $ git log --diff-filter=A -1 -- consonance/tools/ambient-default-claim.test.js
      e0973ff  D007 packet 2c

**Two universes, exactly as the packet predicted: WORKTREE versus INDEX.** At `3d2f1bc`,
`consonance/tools/ambient-default-claim.test.js` existed on disk and not in the index — I created it
during D007 P2c and it landed one commit later at `e0973ff`. `find` walked the worktree and saw 74;
`git ls-files` read the index and saw 73. **Neither count was wrong. They were counting different
objects, and the object that separated them was my own uncommitted file.**

At `f21dbc9` the file is committed and the two agree at 74, with identical lists. **The discrepancy
is not resolved in favour of one number; it is dissolved, and it will recur the next time any seat
measures S over a dirty tree.** That is the whole reason this packet demanded a clean tree.

### Reconciliation 2 — `G = 66 derived vs 63 measured`. **Both were right, at different commits.**

`G = 66` measured inside the tree today matches A's static derivation exactly. My 63 was measured on
2026-09-03 at an earlier HEAD, before three test files were added — A flagged it stale in the ruling
itself (`§2`, *"three test files were added after that run"*), and `63 + 3 = 66`. **A's derivation
was sound; my number was old.** There is no unread MANIFEST rule, which was A's stated fear.

### And the same root explains A's addend error that B caught

A printed `consonance/tools 52 · hooks 12 · ui 4 = 69`, which does not sum. Measured today:

    ./consonance/tools  53      ./consonance/hooks  12      ./consonance/ui  4      = 69

**A's total 69 was right and the addend 52 was wrong** — 52 was the *index* count of `tools` at
`3d2f1bc` (52 + 12 + 4 + 5 = 73, the tracked total), dropped into a total taken from the *worktree*.
One sum over two universes, as B said, and the file that made the two universes differ is the same
uncommitted file as Reconciliation 1. **All three discrepancies — 74/73, 66/63, 52/53 — are one
event.**

### I = 8, enumerated by name rather than by arithmetic

    $ comm -23 <source list> <generated list>

    consonance/tools/catch-ledger.test.js                    EXCLUDE (entry 3 of 6)
    consonance/tools/gen-consumer.fixture-scope.test.js      EXCLUDE (entry 6 of 6)
    consonance/tools/gen-consumer.test.js                    EXCLUDE (entry 5 of 6)
    dev/dream/dream_cycle.test.js                            outside every MANIFEST dir
    dev/headwatch/install_headwatch.test.js                  outside every MANIFEST dir
    dev/shell/hooks/userprompt_pulse.test.js                 outside every MANIFEST dir
    dev/vantage/install_vantage.test.js                      outside every MANIFEST dir
    exo_memory/loop/run2/rig/score.test.js                   outside every MANIFEST dir

3 + 5 = 8. Matches A's derivation and B's re-derivation. **`I` did not move this lap.**

---

## 3 · P = 18 — the parity halves, same commit, one window

    $ node consonance/tools/js-suite.js --quiet                      # SOURCE, f21dbc9
      71 green · 2 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 1 not-run   (of 74)

    $ (cd "$T" && node consonance/tools/js-suite.js --quiet)         # GENERATED from f21dbc9
      46 green · 17 failed · 2 crashed · 0 silent · 0 canary · 0 sang · 1 not-run  (of 66)

| | source | generated | counts toward P? |
|---|---|---|---|
| `consonance/tools/carrier-drift.test.js` | FAILED | FAILED | **no** — shared red, workshop debt |
| `dev/shell/hooks/userprompt_pulse.test.js` | FAILED | *not present* | **no** — in `I`, invisible by construction |
| `consonance/tools/actors.evidence.test.js` | NOT-RUN | NOT-RUN | **no** — amendment 3: it did not run in source |
| the other 17 FAILED + 2 CRASHED, generated | green | red | **yes — 18** |

**P = 19 − 1 = 18.**

Amendment 3 did work here: without it `actors.evidence.test.js` would have been counted, and it is
absent both sides for the same declared reason.

### The 2 crashes are both a MANIFEST gap naming its own missing file

    consonance/hooks/dream-gate.test.js
      Error: ENOENT ... j-d010-f21dbc9\dev\shell\install.ps1                  at dream-gate.test.js:65
    consonance/tools/universe-print.test.js
      Error: ENOENT ... j-d010-f21dbc9\dev\shell\hooks\userprompt-submit.js   at universe-print.test.js:303

**These are the two gaps K deliberately left open** (`gen-consumer.js`, *"TWO MANIFEST GAPS ARE
KNOWINGLY LEFT OPEN, 2026-09-04, and they are NOT in EXCLUDE on purpose"*), with the reason written
into the source: `install.ps1`'s own `$files` list enumerates twelve `dev/shell/**` files that are
also absent, so shipping the installer alone is worse than the dangling link. K's conclusion, which
this run confirms from the other end: **closing either properly means deciding whether the whole
dev-shell layer ships, and that is a repo-shape decision sitting with the keeper.**

**Consequence, stated plainly: 2 of the 18 cannot be cleared by any seat.** P has a floor above zero
until that decision is made.

### D005's three crash-causing gaps, status today

    dev/shell/install.ps1                     ABSENT — open
    consonance/src-tauri/tests/arch_test.rs   PRESENT — closed
    dev/shell/hooks/userprompt-submit.js      ABSENT — open

B's three (`carrier-drift.registry.json`, `groove-FINDINGS.md`, `tools/README.md`): **all three
present.** The widening closed three, as K said and as the packet records.

---

## 4 · M = 1, B = 1 — the cold sweep, INSIDE the generated tree

A's §10 weakness 2, in A's own words: *"B's Leg 1 was never run there, and I did not run it there
either. My §4 numbers come from the SOURCE tree."* **This run closes that.** Every row below was
executed with cwd inside the generated tree and `CONSONANCE_DATA` pointed at a fresh empty directory.

Universe: the shipped `README.md` table, *"The ones a reader will actually want"* — **five names,
unchanged**; `consonance/README.md` last touched at `285b2d6`, before this lap. Clause 5 clean.

| tool | rc | bytes | stack frames | class |
|---|---|---|---|---|
| `chain-status.js` | 0 | **0** | 0 | **MUTE** |
| `board-audit.js` | 0 | 468 | 0 | SPEAKS — but **FALSE-COLD** |
| `ferry.js --due` | 1 | 1622 | **4** | **BROKEN** |
| `carrier-drift.js` | 1 | 4376 | **0** | SPEAKS |
| `js-suite.js` | 1 | 8216 | 0 | SPEAKS |

    M = 1     chain-status.js — exit 0, zero bytes. Unsuppressible; the real defect.
    B = 1     ferry.js --due — Error: spawnSync C:\WINDOWS\system32\cmd.exe ENOENT, 4 frames,
              died before printing a report of its own (amendment 2).

**`carrier-drift.js` moved from BROKEN to SPEAKS.** B measured it dying on
`ENOENT carrier-drift.registry.json`; that gap is closed, so it now prints a full report and exits 1
*because it found drift* — zero stack frames, the declared-inert good failure the packet describes.
**This is the one number that improved between B's run and mine, and it improved because a manifest
gap was closed by shipping the file.** That is the non-degenerating move, demonstrated.

**`board-audit.js` is still FALSE-COLD, unchanged since A and since B:**

    board: 155676 rows parsed of 155680 lines  (C:\Consonance\data\board.jsonl)

From inside the generated tree, with an empty `CONSONANCE_DATA`, it read a hardcoded absolute path
and parsed 155,676 rows of **this room's own board**. It is not scored in either direction. It is the
sign this room has the worst history with: **a green produced by our own data**, and the only reason
it is not a silent one is that A built the FALSE-COLD class to name it.

**Known defect, reproduced, not fixed (packet: not mine):** `carrier-drift.js:424-426` omits
`ch4InCorpus` on the empty-registry path, so `:695` prints
`CH-4: 27 instruction-reachable ... · undefined of them inside the scanned corpus`. One key. It
surfaced in this run exactly as described.

---

## 5 · THE RUST SIDE — not part of the triple, and the largest thing this run found

`cargo check` is the command in A's ruling and in `gen-consumer.build.test.js`. In the generated tree:

    cargo check           EXIT 0    6 warnings, 0 errors
    cargo check --tests   EXIT 0    0 errors        <- arch_test.rs now ships AND type-checks

**Both green. Then:**

    cargo test, GENERATED     bin consonance  376 passed ·  2 FAILED      arch_test   8 passed · 4 FAILED
    cargo test, SOURCE        bin consonance  378 passed ·  0 failed      arch_test  10 passed · 2 FAILED

**Six failing Rust tests in the product, and `cargo check` returns 0 over all of them.** This is the
`gen-consumer.js` header's own stated gap — *"a clean scan and a broken product are indistinguishable
from here"* — one level up: a clean **check** over a product that compiles and fails.

**And `cargo test` hides two-thirds of it.** It aborts at the first failing target, so a seat running
plain `cargo test` in the generated tree sees the 2 bin failures and never learns `arch_test` has 4;
`--test arch_test` had to be run separately to find them.

### Rust parity breaks = 4 (green in source, red in generated)

    repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is
      panicked: "the checkout must be the one this crate is compiled from,
                 got C:\Users\nname\Desktop\lighthouse"

**The generated tree's binary resolved its checkout to the private tree.** The test caught it, which
is the instrument working — but it is the FALSE-COLD class again, in the Rust half, and this time
inside the artifact a stranger would receive.

    managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists
      panicked: "no map directory in this checkout: ...\j-d010-f21dbc9\exo_memory\map"

    arch_test::every_relative_link_in_the_docs_exists_in_a_fresh_clone
    arch_test::the_shipped_room_carries_every_section_of_the_maintained_room

Shared, not counted: `every_chair_verb_authenticates`,
`every_named_record_file_exists_and_every_record_file_is_named` — red both sides, workshop debt.

**`exo_memory/map/` does not ship, by design** — B's registration puts maps in the class that never
ships. So `the_map_walk...` is a test whose premise is the workshop, and **it cannot pass in a
consumer tree no matter what any seat does.** The JS suite has a declared MACHINE-BOUND class for
exactly this shape; the Rust suite has no equivalent, so the test simply reads as a product defect.

**This is A's §10 weakness 3, arriving with a case.** A asked whether `> 0` is discipline or
stubbornness. Here is the first hard instance: at least one parity break is irreducible by
construction, and two more are blocked on a keeper decision. **The bar should not move — A is right
that moving it is clause 3 — but the room now knows P has a floor, and the honest fix is a
declared-inert class on the Rust side, not a softer bar.**

---

## 6 · THE OBJECTIVE, O2

**O2a — PASSES.** `consonance/src-tauri/brief/SEED.md` present (9,621 bytes), `exo_memory/SEED.md`
present, and `brief/SEED.md` declared in that tree's `tauri.conf.json` bundle resources.

**O2b — PASSES.** `pick_default_room` is covered in the shipped source at `main.rs:8692-8724`,
including `pick_default_room(None, None, s("bundled-seed"), ...)` at `:8708` — the stranger's exact
vector. Those tests are inside the `bin consonance` target, whose only two failures are named in §5
and are neither of them a `pick_default_room` test. **They passed in the generated tree.**

**The third part still has no instrument**, exactly as A registered: nothing here observes a first
wake happening or a person reading it. Not proxied.

---

## 7 · THE DEGENERATING CLAUSES, checked

    1  EXCLUDE closing a manifest gap        CLEAN. Six entries, byte-identical to A's derivation;
       (dD <= 0 with dI >= |dD|)             ZERO added this lap. K left two gaps OPEN and wrote the
                                             distinction into gen-consumer.js rather than excluding.
                                             dD = 0 and dI = 0: no degeneration, and no progress.

    2  parity delta non-zero after TWO laps  ARMED, 1 OF 2 ELAPSED. Commits to gen-consumer.js /
       in which a seat commits to            MANIFEST / EXCLUDE since bab20a9: exactly one, 202c459
       gen-consumer.js                       (K's re-point). One more such lap with P > 0 fires it.

    3  D's bar moves                         CLEAN. Scored at P=M=B=0. Not softened. §5 argues the
                                             bar should stay even though it now has a known floor.

    4  D reported without I                  CLEAN. I = 8, printed and enumerated.

    5  cold-sweep universe changed silently  CLEAN. Five names unchanged; README.md at 285b2d6.

    6  a season with D unprinted             CLEAN. Printed here.

    7  P and (M,B) from different HEADs      CLEAN. All at f21dbc9, one window, HEAD unmoved.

---

## 8 · THE NUMBER DID NOT MOVE, AND THE THING UNDER IT DID

`P = 18` today. `P = 18` in my D005 run. **These are not the same 18.** Then: 63 files, an earlier
HEAD, **3** crashes, all three a manifest gap naming its own missing file. Now: 66 files,
`f21dbc9`, **2** crashes, two of those three gaps still open and the third closed.

So one crash was cleared and the count held — which means a failure was added somewhere I cannot
name, **because I recorded a count in D005 and not a list.** That is a defect in my own instrument
and it is the reason §3's table above names every file. A parity number without its member list
cannot support the one question anyone asks of it next: *did the same thing fail?*

**Registered for the next run of this packet: print the member list, not the count.** The diff
between two laps' lists is the measurement; the delta between two integers is a rumour.
