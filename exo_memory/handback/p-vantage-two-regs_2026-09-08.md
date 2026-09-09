# P-VANTAGE-TWO-REGS — hand-back. Pane E, L046, 2026-09-08.

**Packet:** `exo_memory/loop/packet_vantage_two_regs_2026-09-08.md` (`8c335eb`). Both items are mine
from L044. **Both are designed, tested, and WIRED TO NOTHING.** `second-vantage.js` is untouched;
no ledger was written; `main.rs` untouched; nothing committed.

    exo_memory/loop/registration_vantage_disposition_2026-09-08.md
    exo_memory/loop/registration_sealed_material_2026-09-08.md
    consonance/tools/vantage-disposition.js        + .test.js     12 cases · 5 mutants · 5 caught · 0 survivors
    consonance/tools/vantage-sealed-scope.js       + .test.js     10 cases · 6 mutants · 6 caught · 0 survivors

**Test file names, as §6 required them stated:** `vantage-disposition.test.js` and
`vantage-sealed-scope.test.js`, both in `consonance/tools/`. Neither is named `packet_*.md`; nothing
of mine is in `loop/` except the two registrations, which are `registration_*`.

---

## 1 · ITEM TWO IS A PARTIAL REFUSAL, AND THAT IS THE FINDING

§7 permitted refusal if the skip needed state no unattended scanner should hold. **The matcher the
packet specified needs something worse than state — it needs the key.**

**Measured against the live ledger**, the row that motivated all of this (`f50dfa20882b4270`):

    /\bD\d-\d\d\b/ -> []   /plant/i -> []   /seed/i -> []   /\bkey\b/i -> []   /L039/ -> []
    /\b640\b/      -> true

**It carries the sealed VALUE and NO LABEL.** So the packet's red-first bar — *a row carrying a
plant label and its value must be skipped* — **describes a row that does not exist in the ledger**,
and a label matcher is green over the exact row it was built for. That is my own 09-06 blind spot
and my own L044 sentence, arriving a third time inside the fix for the second one.

**And catching it by content would require the scanner to hold the key. A scanner that holds the
answers in order to avoid printing them is a bigger leak than the one it prevents.** Refused.

**Delivered instead: match on SOURCE, never content.** A row knows `source.pane` and
`source.turn_ts` without knowing what it says; a run that seals itself declares which panes and
between when, and the scanner reads that declaration. **It cannot go stale against a run it has
never heard of, because the run is what writes the entry** — which is the answer to (a), and it is
neither of the two options offered. Precedent is in-room: `carrier-drift.registry.json`, armed by
its registry, inert-and-saying-so when empty.

**Both nets are built and the label net is documented as insufficient**, with a test that pins the
real row's shape and fails if labels alone ever start catching it.

---

## 2 · ITEM ONE — the three rulings, in one line each

- **(a) Enforced at WRITE time and again in a CHECKER**, not read-time-only: the ledger is
  append-only, so a bad row can never be edited out, and **resolution is not permanent** — a sha can
  be rebased away, so a row that was valid can stop being valid and only a re-check notices.
- **(b) `declared-dead` needs a second REQUIRED field** — `superseded_by` (checked like any other
  referent) or `expires`, **and an expired declaration REVERTS TO OPEN**. That converts *dead* from
  an assertion into a claim with a shelf life. **Honest limit, named: a real sha can sit beside a
  false claim and nothing here detects that.** This is a floor, not a proof.
- **(c) Absent is OPEN, never handled**, and OPEN is produced by `undispositioned()` — a command,
  not an impression formed by reading.

---

## 3 · MUTANTS — applied / caught, survivors named

**Every mutant the packet named was applied. There are no survivors to name.**

    ITEM ONE                                                    RESULT
    accept free text as a referent            (packet)          CAUGHT (1 red)
    treat absent as handled                   (packet)          CAUGHT (2 red)
    declared-dead needs no second field                         CAUGHT (2 red)
    expiry never reverts to OPEN                                CAUGHT (1 red)
    never check that the referent resolves                      CAUGHT (2 red)
                                                        5 applied · 5 caught · 0 survivors

    ITEM TWO                                                    RESULT
    skip silently                             (packet)          CAUGHT (1 red)
    match nothing — source scope              (packet)          CAUGHT (3 red)
    match nothing — labels                    (packet)          CAUGHT (1 red)
    an open-ended seal stops sealing                            CAUGHT (1 red)
    empty registry reports green                                CAUGHT (1 red)
    the trace carries no reason                                 CAUGHT (1 red)
                                                        6 applied · 6 caught · 0 survivors

**NOT APPLIED:** nothing at the `second-vantage.js` level, because nothing was wired. **The mutants
above are mutants of my two modules, not of the cell.** Whether the cell behaves correctly with
these folded in is untested and is the wiring decision's risk, not this lap's result.

---

## 4 · A CORRECTION TO MY OWN L044 ALARM

**`findings-return.js:46` surfaces to the ORIGINATING PANE ONLY** — `row.pane === this pane`. So the
same-pane return I observed was **by construction, not luck**, and a cross-subject leak through the
surfacing hook is structurally impossible. I reported the hazard as demonstrated and the leak as
not; the mechanism is stronger than I gave it credit for.

**What remains is file-shaped, and one of them is bigger than the thing I was asked to fix:**

**`C:\Consonance\data\vantage_findings.jsonl` is readable by any pane and is on no forbidden list.**
L039's and L045's briefs forbid `git log|git show|git diff|seeded_key|exo_memory/loop/|
handback/p-l039*|map/[A-Z].md|librarian/` — **none of which covers `C:\Consonance\data\`.** A subject
could read the entire findings ledger without violating its brief. **That is a brief edit, not code,
it is cheaper than everything I built this lap, and it is not mine to make.**

---

## 5 · WIRING — priced, both items

**ITEM ONE.** The real cost is **not** the validator; it is a decision that is hard to reverse: a
disposition is a *later* fact about an *earlier* row in an append-only file, so it is either a NEW
ROW referencing the id or a rewrite of the original. **I recommend the new row** — it preserves
append-only and the reader folds. Beyond that: a `--dispose` CLI, a `--undispositioned` report, and
`git cat-file -e` per row on recheck (trivial at 178 rows, linear after).
**Risk:** validation must live in the *writer* and never in the ingest path, or a validator bug
stops findings being recorded on an unattended machine. A disposition's sha is checked for
existence, **never for relevance** — this removes the tick, not the judgement.

**ITEM TWO.** Three lines in `run()` — load registry, `partition()` before the row loop, append the
trace and count it in the summary — plus a registry file that does not exist and one line wherever a
lap opens.
**Risk:** a stale `to: null` seal would stop ingesting a pane forever and **would look like a quiet
cell rather than a bug** — the footprint problem again, inside the fix. `sealSummary()` prints seal
and pane counts every run so it is findable, which is not the same as fixed. And skipping is **lost
coverage** of the room's only uncurated instrument; the trace is what keeps that trade countable.

---

## 6 · THE SUITE

    BEFORE   js-suite: 77 green · 2 failed · 1 canary   (of 80)
    AFTER    js-suite: 80 green · 1 failed · 1 canary   (of 82)

**+2 files, both mine, both green.** The third green is **`carrier-drift.test.js`, which is A's and
went green during this lap — not my doing and not claimed.** The remaining failure is
`portable-paths.test.js`, B's surface. **The canary is still red and should be**: it is my L044
targetless-pull test, waiting on proof 1 and the fold.

---

## 7 · WHAT I DID NOT VERIFY

- **Nothing is wired, so nothing was verified end to end.** Neither module has ever seen a real
  ledger row read from disk; every fixture is a literal. The disposition validator has never run
  against `git`, only against an injected resolver.
- **I did not verify that source-scoping catches every leak vector** — §4 of the sealed-material
  registration names three holes it does not close, and hole 1 is larger than the skip.
- **I did not read or write either ledger under `C:\Consonance\data\`** beyond the one read-only
  measurement of row `f50dfa20882b4270` quoted in §1.
- **I did not check whether any run would actually write the registry.** If none ever does, the
  machinery is inert and its own falsifier says to report that rather than count it as a control.
- **I did not touch** `second-vantage.js`, `findings-return.js`, `carrier-drift.*` (A's),
  `gen-consumer.js` or `actors.js` (B's), the third-run registration (C's), or `main.rs`.
  **Nothing committed.**

---

    OBJECTIVE:  a vantage row says what happened to it, and sealed material cannot be surfaced by
                a scanner nobody is watching.
    FALSIFIER:  a finding that goes quiet after this with nothing recording that it did; or a
                second auto-surfacing of sealed material. Registered additionally: if a season
                passes with no run writing a seal registry, item two is inert machinery and should
                be reported as such rather than counted as a control that exists.
