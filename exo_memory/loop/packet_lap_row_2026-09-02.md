# P-LAP-ROW — the ledger cannot record the loop it now runs. L033.

**To CHARLIE, 2026-09-02 ~07:00. Chair-written; every defect below was hit by the chair in the last
forty minutes while trying to record real laps.**

## 0 · YOUR MEMORY IS STALE AND IT IS NOT YOUR FAULT

Your shell was warmed from a capture stamped 02:39 while the `.log` is 06:28 at tens of MB — the
harvester wrote nothing for four hours across four panes. **None of L029–L032 is in your memory**,
including your own two-doors work, which shipped and is on the keeper's screen. That stall is E's
packet this lap. **Re-derive from disk.**

## 1 · THREE DEFECTS, ALL HIT LIVE, ORDERED BY SIZE

**(1) THE RING LAP HAS NO ROW SHAPE — this is the big one and it is a design gap, not a bug.**

`lap-row.js --open` takes `--entry orch|lib`: door one or door two. **Both are ENTRY doors — they
describe where the USER's inquiry came in.** But `BUILDING.md`'s drawing, which you wrote the
two-doors amendment into (`3d6fe60`), also carries the keeper's AMENDMENT 1:

> *"once the loop is going the beginning chain doesnt need to be used again"* — the ring
> `orch → panes → lib → orch` repeats **on its own**, and the user is the ENTRY, not a station.

**A ring lap has no entry.** L033 — the lap you are being dispatched in — is one: the librarian
measured something itself, rang the chair, and the chair planned and dispatched. No user inquiry
entered anywhere. **The chair had to record it as `--initiator chair --entry orch`, which says door
one was used, which is false.** The row now carries a prose note admitting it. That is a ledger
lying in a small way on the very lap that added the ring to the drawing.

**(2) `--initiator` HAS NO VALUE FOR THE LIBRARIAN, THOUGH `--entry lib` EXISTS.**

    node lap-row.js --open L033 --entry lib --initiator librarian
    -> lap-row: --initiator must be one of human|chair|pane, got "librarian"

`INITIATORS` is `human|chair|pane` (`lap-row.js:318`). **Door two was added and the initiator enum
was never extended to match**, so a door-two lap can record the DOOR and not the SEAT. And
`librarian` is emphatically **not** `pane` — that vocabulary ruling is the one E was corrected on
this same night (`holder` is a STATION: `chair | panes | librarian | none`).

**(3) `--holder` ACCEPTS A NON-STATION. Owed since the aura packet; still unowned.**

`holder` is a STATION. `--to <letters>` names panes. A row was written this night with a pane letter
in `--holder`, four rows drifted, and `chain-status.js` had to be taught to skip non-station holders
(`:721`/`:804`) rather than the writer being stopped. **Validate at the write, keep the readers
narrow.** The aura packet was explicit that widening the readers would bless the fan-out error.

## 2 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, C: *"Brief carriers and the loop's documents; syncs a self-declared copy and
says it was scope"* (`p-two-doors`).

**You wrote the two-doors amendment into `BUILDING.md`. This is that same amendment reaching the
instrument that has to record it.** The drawing moved on 09-02 and the ledger did not — which is
verbatim the 2026-08-17 carrier lesson your own packet quoted: *the documents moved and the carrier
did not.* **The ledger is a carrier.**

And your M13 from that lap is the warning for this one: *the entire door-two prose can be deleted
with the suite green — the DRAWING is guarded, the RULE is not.* **Do not ship a fix here whose rule
is unguarded.**

## 3 · WHAT IS ASKED — and (1) may come back as a REFUSAL, which is a real answer

    (1) a row shape for a ring lap. The chair's guess, offered to be attacked rather than
        implemented: --entry ring, with initiator naming the seat that carried it, and the
        guess/map number recorded as ABSENT rather than zero -- because on a ring lap there is
        no user inquiry to seal a guess against, and a zero would read as a failed measurement
        instead of an inapplicable one. That distinction is this room's most-repeated failure
        (done vs never-started, unknown vs idle, nothing-harvested vs harvested-nothing) and it
        is the part to get right.
    (2) add `librarian` to INITIATORS.
    (3) refuse a non-station --holder; accept --to <letters>. Existing drifted rows STAY --
        the ledger is append-only.

**If (1) is wrong — if a ring lap should not be a lap at all, or if the guess/map number is the whole
point and a lap without one should not be opened — SAY THAT.** The chair would rather have the ruling
than the feature. `lap-row.js --report` reads the two door-two falsifiers in `BUILDING.md` off these
rows, so changing the row shape changes what those falsifiers can see: **state that impact
explicitly**, in the hand-back, whichever way you rule.

## 4 · BARS

    1  RED FIRST for each of the three. A test that opens a ring lap; a test that opens with
       --initiator librarian; a test that a non-station --holder is REFUSED.
    2  MUTANTS: remove each validation -> red. applied / caught / NOT APPLIED, survivors and
       equivalents named. Your M13 is the standard: check that the RULE is guarded, not only
       the shape of the output.
    3  APPEND-ONLY IS INVIOLABLE. No existing row is rewritten, reclassified or deleted --
       including the four drifted holder rows and L033's own mis-recorded entry. If a new
       reader is needed to interpret old rows, that is fine; editing them is not.
    4  node consonance/tools/lap-row.js --report  must still run, and chain-status.js must
       still print, on a ledger containing both old and new row shapes. Say what you ran.

**Known reds not yours:** `actors.evidence.test.js` (2026-08-25), `corpus-age.test.js` (B's, this
lap).

## 5 · WHAT YOU OWN — the collision is real

    consonance/tools/lap-row.js
    consonance/tools/lap-row.test.js       (create it if it does not exist -- say which)
    exo_memory/handback/p-lap-row_2026-09-02.md
    exo_memory/map/C.md

**ALPHA holds `main.rs`. ECHO holds `consonance/ui/chain-indicator.js`. BRAVO holds
`consonance/tools/corpus-age.*`.** `chain-status.js` is **unowned this lap** — if your change needs
it, name the change and hand it back rather than making it, because the aura reads through it and E
is live in that path.

**Do not commit.** Name your paths. **Non-author read: E.**

## 6 · PERMISSION TO REFUSE — and the specific shape

Beyond (1) above: say so if adding `--entry ring` makes the two door falsifiers unevaluable, or if
validating `--holder` would break a caller you can find. **A ruling that the ledger should record
fewer things, not more, is a legitimate outcome of this packet.**

## 7 · HAND-BACK

Write `exo_memory/handback/p-lap-row_2026-09-02.md`, then `call_librarian` with that path in the same
turn — pointer and one line, never the finding. Append one line to `exo_memory/map/C.md`; it cannot
reach you yet (A's packet is why), write it anyway.

    OBJECTIVE:  a lap that actually happened can be recorded as what it was, without the writer
                adding a prose note to say the row is wrong.
    FALSIFIER:  if after this the chair opens a ring lap and still has to explain the row in the
                --inquiry text, the shape is still an entry shape with a new label.
