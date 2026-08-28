# D002 — the replacement falsifier: a boundary test with a denominator the licensed behaviour cannot suppress

**Machine: DESKTOP-EEGVFMT (the desktop).** Both ledgers this reads are machine-local; every number
below is this machine's. **Seat:** pane B, LAP D002. Not the seat that wrote the original
(`fb08c50`, librarian) and not the seat that ruled on its removal (P5).

**Landed:** `consonance/tools/boundary-check.js` + `.test.js`, and the replacement text at
`consonance/src-tauri/brief/BUILDING.md`, striking the falsifier P5 ruled out.

---

## 0. WHAT IT CANNOT SEE — stated before it was written, per the bar

Written down first so the list is a design constraint rather than a defence:

1. **Only `[chair:…]` arrivals count.** Anything else that left the room — a brief pasted into a pane
   by hand, a file carried to the laptop, a pane-to-pane handoff, a dispatch through a channel that
   does not stamp — is invisible. **The denominator is a floor.** The true rate can only be worse
   than what prints.
2. **It reads that a guess existed, not that it was good.** Four junk paths seal a lap.
3. **It cannot say WHY a lap is absent.** Misclassification and plain forgetfulness fire identically.
   It is biased toward firing on purpose; a fire is a reason to go look.
4. **A blind window blinds it.** `board_push` mutes every writer while `data/blind.lock` exists,
   transcript ingest included. Measured: one ran **2026-06-30 → 2026-08-01 and swallowed 2,473
   entries**, and those two lines are the only trace of it on a 120,672-row board.
5. **It cannot see the other machine.**
6. **It cannot see a dispatch that never rendered.** If the verb failed or the pane was dead, there is
   no row — undercounting the denominator, so it under-fires rather than over-fires.
7. **It does not measure whether the chain HELPED.** It measures that the boundary was respected. P5's
   A-3 stands: nobody has compared freestyle outcomes against chained ones, and this does not either.

---

## 1. What was wrong, in one sentence per defect

Registered text, `BUILDING.md:326-330`: *"If three consecutive cycles produce no lap row, the freestyle
clause has eaten the instrument."*

- **No unit.** Nothing counts cycles (P5 finding 2). No run of any tool could evaluate it.
- **Wrong event.** A presence test aimed at a boundary harm: a room that logs laps for tight-loop work
  while freestyling every dispatch reads green while having the 08-24 failure (P5 finding 4).
- **The signal was suppressible by the licensed behaviour.** Freestyle is the mode that hands nothing
  off; a lap row is the artifact of handing something off. The clause licensed not generating its own
  evidence.
- **And then it read SATISFIED off n=1, on the row minted by the lap convened to attack it** (P5
  finding 5; the librarian's return leg calls this the proof that removal is right).

---

## 2. The replacement

> **If a chair dispatch renders in a receiving pane while no lap holds a sealed guess, then work left
> the room without one and the cut was applied at a boundary it does not cover.**
>
>     node consonance/tools/boundary-check.js

**The inversion that repairs it:**

| | old | new |
|---|---|---|
| signal | no lap row | a dispatch **that rendered** with no sealed lap |
| absence of a lap row | reads **GREEN** | **FIRES** |
| absence of a dispatch | reads **GREEN** | **UNMEASURED** (exit 2) |
| denominator written by | the seat exercising the clause | the receiving pane's transcript |
| unit | cycles — do not exist | dispatch arrivals — 312 on this board |

**Why the denominator is outside the object under test.** `main.rs:5605` stamps `[chair:MAIN]` onto
every chair dispatch, and `board_push` mirrors the receiving transcript into `data/board.jsonl`. The
sending seat cannot omit the stamp and cannot suppress the row: it exists because the text arrived.
The numerator (`lap.jsonl`) *is* self-reported — and that is now safe, because under-reporting fires
the check instead of passing it.

**This is the L009 trap avoided rather than dodged.** The rule is *"any bar or predicate that reads the
object under test to decide whether to test it"* (`librarian/2026-08-25.md:920-924`, and P5 §3 counting
this as the fourth instance). The object under test is the freestyle clause; the behaviour it licenses
is **not opening a lap**. That behaviour has no reach into the denominator at all.

---

## 3. ON CONSTRAINT 2 — I took the stages as the coordinate, not as the signal, and here is the number that decided it

The return leg's constraint reads: *"phrased in STAGES, which exist — not cycles, which nothing
counts."* I kept the intent and declined the literal form, and the reason is measurable rather than
stylistic.

The literal stage-presence reading — *"how many dispatches carry a `dispatched` stage row"* — evaluates
today as:

    STAGE READING: 0 of 12 carry a `dispatched` row     -> would FIRE at 100%
    SEAL READING:  0 of 12 rendered with no sealed lap  -> HOLDS

**Both D001 and D002 opened with a sealed guess before anything was dispatched.** Their chain rows jump
from `open`/`map` straight to `handbacks-in`; the `dispatched` baton was simply never written. So the
stage-presence version fires at 12 of 12 **on a bookkeeping gap, at a moment when the boundary was in
fact respected** — which is the original defect mirrored: a presence test, on a different row, firing
for something other than the harm.

**So the stages supply the definition and the seal supplies the signal.** `dispatched` is the stage at
which work leaves the room; the check asks whether a *seal* existed at that moment, and it keys the
moment to an event outside the ledger. Nothing here is phrased in cycles.

*If the chair wants the stage-presence number too, it is one line and it is real — but it measures baton
discipline, not the cut, and shipping it as this falsifier would put a 100% red on the board for a thing
that is not wrong.*

---

## 4. WHAT MAKES IT FIRE NEXT WEEK

**One unsealed dispatch fires it.** No window to fill, no `RATE_FLOOR`, no n to reach — a boundary is
crossed once or not at all. The original needed three uncountable cycles; this needs one event of a
kind that happened **12 times in the two days since the clause landed** and **312 times on this board's
life**.

    2026-08-27  7 dispatches      2026-08-28  5 dispatches (by 08:26Z)

And the fire is produced by *the clause's own licensed behaviour*: a seat that freestyles — opens no lap
— and then dispatches leaves an arrival with no covering seal. **The act the cut risks is the act that
trips the wire.** That is the property the original inverted.

**Registered against myself, before the next lap:** if D003 or any later lap dispatches without a
sealed lap open and this check does **not** fire, the denominator is narrower than I have claimed and
limit 1 above is doing more work than I think. That is the observation that marks this replacement
degenerating.

---

## 5. Verification

    node consonance/tools/boundary-check.test.js     22 pass / 0 fail
    node consonance/tools/js-suite.js                62 green · 1 failed · 1 not-run (of 64)

**Mutation-proven**, each mutation applied to the shipped file and reverted:

| mutation | red |
|---|---|
| empty denominator returns HOLDS instead of UNMEASURED | **4** |
| the seal becomes retroactive (drop `l.at <= ts`) | **1** |
| blind windows no longer suppress the verdict | **2** |
| remove the `statSync` guard only | 0 |
| remove the `rl.on('error')` handler only | 0 |
| **remove both** | **1** |

The last three are reported together because either guard alone suffices and the test only holds the
pair. Stated rather than presented as three independent proofs.

**A bug the tests caught before it shipped, and it is this room's own species.** The first version
handled a missing board through the stream's `error` event alone. `readline` re-emits that on the
Interface, which had no handler, so **a missing board crashed the process with exit code 1 — and 1 is
the FIRES code.** A check that could not be run was reporting the harm it exists to detect. Found by
`a missing board is UNMEASURED, never a pass`, which is in the file because of the bar in §0, not
because I suspected the bug.

**The one red is not mine:** `state-block.test.js` fails identically with my two files present and
moved aside (21 pass / 1 fail both ways). Reported, not touched.

---

## 6. THE NUMBER NOBODY ASKED FOR: striking it does not un-teach it

    consonance/src-tauri/target/release/BUILDING.md   Aug 25 09:02   old falsifier: 0   new: 0
    consonance/src-tauri/target/debug/BUILDING.md     Aug 26 00:12   old falsifier: 1   new: 0

P5 found the release build predates the clause entirely, so **a pane spawned from release has never
read the section at all**. The debug build is worse in the way that matters here: **it carries the
struck falsifier and not the replacement.** Until the briefs are rebuilt, a pane from debug is being
taught the exact sentence three seats have now ruled unfireable.

**This is BOOT's carrier problem, live, in the object being repaired.** The 2026-08-17 lesson —
*"editing the downstream documents moved nothing, because the carrier was never edited; mark the
carriers, leave the traces"* — applies to the build artifacts, and `open-items-build.test.js:90`
already records BUILDING.md shipping drifted once before. **Landed is not shipped**, for briefs as
well as hooks. I did not rebuild; that is the chair's call and it touches other seats' panes.

---

## 7. WHAT I DID NOT VERIFY

- **That `[chair:…]` is the only channel by which work leaves the room.** I confirmed the stamp is
  applied by the backend at `main.rs:5605` and that 312 arrivals carry it. I did **not** enumerate the
  other verbs to prove none of them dispatches without it. If one does, limit 1 is larger than stated.
- **The laptop.** Untouched and unseen.
- **Whether the 08-24 incident is as described.** Like P5, I took it from `fb08c50`'s body and did not
  open the transcript. The cut's derivation rests on it.
- **That D001/D002 were correctly classified as chain-worthy.** The check reads whether a seal existed,
  and both had one. Whether the *content* of those seals was any good is limit 2 and is unmeasured.
- **Anything about guard 2.** P5's A-1 repair — what is recoverable at the seam, and that the sealed
  prior is not — is still owed and is not in this commit. The new falsifier does not depend on it, but
  the seam it names is exactly where a fire will come from.
- **The Rust gate.** Red at HEAD and owned by another seat this lap; I did not run or touch it.
- **Whether the board's dedup key is right.** Two genuinely identical dispatches to one pane count once.
  I chose undercounting over ratcheting on replay, and did not measure how often that collides.
