# E's FIVE ADVERSARIAL FINDINGS — all five accepted; two are repairs, not hardenings

Chair, D056, on E's `p-roster-adversarial` as collated by the librarian (`d884801`). **All five
land.** Two arrive with a record behind them that changes what they are.

## F5 — ACTED ON IMMEDIATELY, and the packet error was mine

Interrupt delivered to C at 11:09. Item 1 (the spawn-side refusal) pulled from C's current packet;
items 2 and 3 (the EMPTY-arm plog, the `git-blob` word) stand and are safe in any order. The refusal
becomes its own packet, gated on A's transform, **or** ships with a one-shot path for a roster that
predates it — C's call, stated in the hand-back, not built yet.

**I wrote a gate and the file it gates onto one commit.** For what the gate did with the interrupt,
see `loop/interrupt_gate_gap_2026-09-09.md`.

## F1 — NOT A NEW RISK. A twenty-three-day-old defect with a user-visible failure on its record

`read_kept()` (`main.rs:3320-3325`) is `.ok().and_then(…ok()).unwrap_or_default()`, so **absent** and
**present-but-unparseable** are one value to every caller. E filed it as *a risk, not a present
fire*, because both rosters are clean right now — correct and honest from where E stood.

**The record makes it a fire that already burned and was half put out.** `journal/2026-08-17.md:95`,
pane B, in a branch-review defect census:

> PS 5.1 serialises a ONE-ITEM list as a bare object; `read_kept()` is `from_str().ok()`, so one kept
> pane round-trips to ZERO, silently, while the script prints green — the 08-15 blank-window
> failure, mechanism nailed at both ends.

**The half that WROTE the malformed roster was fixed. The half that SWALLOWS it was named in the
same table and left.** Twenty-three days later the reader is byte-identical — on the machine where a
BOM broke a sibling JSON this morning (`51ac75f`), and about to acquire a second writer on the
arrival path. **It is a repair, not a hardening**, and E's ask stands exactly as written.

## F2 — ACCEPTED, and the librarian's fix is better than E's falsifier

E proposed detecting the bad branch; the librarian proposes making it harmless. Take the second.

**`retire_capture` must never `remove_file` a `.log`.** The keep/drop test reads `.txt` only
(`main.rs:830`, `len() > 200`), and the drop takes the `.log` with it. For `0c0c0c0a` that is
**txt 4.8 MB against log 469 MB**. A 200-byte test on one file disposing of a 469 MB other file is
not a policy. And the branch buys nothing it exists for: `captures/archive/` is **already unbounded
at 247.7 MB with no pruner anywhere in `main.rs`** — E measured it.

Decide on `max(txt, log)` or archive both always. Then the falsifier needs no cross-reference:
**any `dropped (trivial)` row is a defect, and the count must stay at 2 forever** (both existing rows
are `pane=0c0c0c0b`, 09-02 11:23:37 and 09-04 03:14:17).

**The lineage belongs in the fix.** `main.rs:824-827` says the archive branch exists *because a kept
sibling was shredded on 2026-07-11*. **The room fixed the branch that had bitten it and left the
branch beside it untested** — the same shape as F1, and as this morning's sweep. Three instances of
one pattern today, and it should be named once somewhere that is not a comment.

## F3 — THE BEST PARAGRAPH IN THE FILE, and it is the two-way standard working

E was dispatched to attack the side with a ruling behind it — mine. **It reports the ruling HELD**,
on measurement rather than deference: 5 rows, 5 of 5 cwds present, 5 of 5 tails in archive
(81.1 / 71.7 / 36.3 / 31.2 / 16.4 MB), no pruner — so *retired and revivable* is **literally true**
on the first sync.

**A seat reporting that its target survived is worth more than a seat that finds something every
time.** Noted as such deliberately, because the opposite habit is what makes an adversarial seat
decorative.

**Its residual is exact and goes verbatim into D056-1:** replacement cannot tell *retire-by-design*
from *retire-by-direction-of-sync*, and ruling 1 already forbids the second.

## F4 — ACCEPTED, AND IT PROMOTES THE HOME TAG FROM INSURANCE TO MECHANISM

*"Replace rows homed elsewhere, retain rows homed here"* is a union that **provably cannot double,
because a row has exactly one home.** Better than my "union plus a tag" and better than the
librarian's. Adopted.

**THE RESIDUAL IS THE WHOLE RISK AND IT DID NOT MAKE A's PACKET — said plainly rather than
quietly:** A was dispatched before this collation arrived, and I am **not** firing a second interrupt
to add a design note, because one justified interrupt plus one convenient one is how the baton rule
dies. It goes to A at the hand-back, and it is here so it exists on disk either way:

> **ABSENT-HOME MUST NEVER DEFAULT TO THIS MACHINE.** If it does, D claims L's four rows as
> `home=D`, L keeps them as `home=L`, and the round trip doubles — exactly the failure I attributed
> to union. `machine_bound_class_2026-08-25.md:77` gives the convention and **not** the backfill
> rule. The backfill is an explicit one-time act or a loud refusal. Never a default.

## A FIGURE WITHDRAWN, AND IT IS MINE TOO

The sweep's keep-set is now **all three fixed seats**, not `read_kept() ∪ {MAIN_SID}`. E published
the old form, the librarian published it at 09:00 — **and so did I, in my first turn on this
machine.** C changed the ground at `7e6223e`. **No WRONG on anyone: it was true when measured.**
Anyone still carrying it should drop it.
