# THE .bin FIXTURES WERE CR-STRIPPED ON THE WAY IN — recovery state, and the one step that is time-critical

Diagnosed by the librarian on lap D055 from C's §5 "pre-existing, not diagnosed" red. Extended here
by the chair with a measurement the collation did not have. The pin is landed at `cc2403a`;
**this file is the recovery, which is not done.**

## THE MECHANISM, settled

`.gitattributes:32` is `* text=auto eol=lf`, and its explicit binary list carried no `*.bin` — that
file was written 2026-08-25, the first `.bin` in this repo was born 2026-09-09. A raw terminal
capture holds **0 NUL bytes**, so git's heuristic classes it TEXT and strips CRs during `git add`.
`e3a9b10` (07:03:59, laptop) therefore committed stripped bytes while the laptop's working tree
still held the originals.

**And every instrument reports success over it.** `git status` says CLEAN — because git compares
the *normalised* working file to the blob. C ruled out CRLF corruption correctly and for the right
reason (disk equals the HEAD blob), and that test cannot see damage done on the way IN. Third time
this morning that a file crossed a boundary, arrived changed, and every check in between was green.
**Both times the tell was a byte count someone had written down on the other side.**

## THE TWO FIXTURES ARE NOT IN THE SAME SITUATION — this is the part that changes the plan

Measured on D, 2026-09-09 09:30:

| fixture | on disk | LF | recorded original | shortfall | CRLF pairs | bare LF |
|---|---|---|---|---|---|---|
| `composer_empty_reads_busy_2026-09-09.bin` | 524,204 | 84 | **524,288** (=2^19) | 84 | 84 | **0** |
| `composer_slash_command_reads_empty_2026-09-09.bin` | 236,387 | 164 | **236,544** | 157 | 157 | **7** |

Recorded sizes are the fixtures' own author's, from the laptop:
`exo_memory/handback/p-composer-update_2026-09-09.md:162` and `…/p-composer-anchor_2026-09-09.md:153`.

**Fixture 1 is FULLY RECOVERABLE HERE AND NEEDS NO LAPTOP.** Its shortfall equals its LF count
exactly, so every newline in the original was CRLF, and the inverse transform is deterministic:

    perl -0777 -pe 's/\n/\r\n/g' composer_empty_reads_busy_2026-09-09.bin > restored.bin
    wc -c < restored.bin        # -> 524288

That number is a **prediction that could have failed and did not** — it lands on the recorded size
to the byte, and on 2^19, which a regenerated capture does not hit by accident. It confirms the
librarian's diagnosis independently of the size records it was derived from.

**Fixture 2 is NOT RECOVERABLE from these bytes.** Its shortfall is 157 against 164 newlines, so
**7 of them were bare LF and nothing on disk says which 7.** The same transform overshoots to
236,551. The laptop's working tree is the single surviving source.

## THE TIME-CRITICAL STEP — one command, and it must precede the laptop's first git command

The laptop is closed and its tree is frozen, so this is urgent-when-it-wakes rather than urgent now.
**Before any `git pull`, `checkout`, `stash` or `reset` on L:**

    cd <laptop lighthouse>
    cp consonance/src-tauri/fixtures/screens/*.bin  <scratch>/
    wc -c consonance/src-tauri/fixtures/screens/*.bin

**Why a checkout is the specific danger:** with the old attributes git reported those files CLEAN
while their bytes differed from the blob, so a checkout would have overwritten the only good copy
without a warning. `cc2403a` closes that — under `binary` they now read as MODIFIED — but the pin
must reach L before the checkout does, and the copy costs nothing either way.

## ORDER OF THE REPAIR, and it does not vary

1. `cc2403a` reaches L. **(landed here, not pushed)**
2. Copy + `wc -c` on L, above.
3. Re-add both fixtures under the fixed attributes. Fixture 1 may be restored from D by the perl
   command; fixture 2 must come from L's working copy.
4. Re-run the suite on **both** machines. Fixture 2's test passing today means only that nothing
   currently reads its 84 missing bytes — **both** fixtures are short.

## THE LIBRARIAN'S FALSIFIER, still standing and still worth running

> If L's working copies turn out byte-identical to the blobs, those recorded sizes were of captures
> never committed, the diagnosis is wrong, and the red is something else.

**One `wc -c` on L settles it. Nobody re-captures anything until it has been run.** Note that the
fixture-1 reconstruction already supports the diagnosis without L — but it does not *replace* this,
because a single confirming reconstruction and two corrupted files are different claims.

    FALSIFIER for this file: if the Sunday runbook's first git command is reached without step 2
    having run, the note failed at the only thing it was for.
