# P-SYNC-AT-LAUNCH + P-RETIRE — the case the desktop hits at 08:00. L052.

**To CHARLIE, 2026-09-09 ~03:30. `main.rs`. This is the packet the 08:00 test actually runs.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §4, P-SYNC-AT-LAUNCH + P-RETIRE
    exo_memory/loop/one_house_two_machines_idea_2026-09-08.md   §3.2, the launch order

**Open them.** This packet routes and adds only what the plan cannot say about itself.

## 2 · THE RETIRE RULE IS THE ONE THAT BITES, AND IT BITES SILENTLY

Main, the librarian and the Third Place have **hard-coded session ids.** So on the desktop,
`claude --resume` finds the DESKTOP's old transcripts for those ids and resumes *them* — **the seat
that was retired, not the one that synced.**

**And it will look like it worked.** A seat wakes, it has history, it talks. Nobody at 8am is going
to notice that the history is the wrong machine's until it contradicts something. **That is the
failure this packet exists to prevent, and it is the same class as every one you have found this
week: a plausible success over a wrong source.**

**The rule:** when the pulled state's `live_host.json` / `letters.json` say the seats last lived on
another host, **move this machine's transcripts for those ids to a projects attic — REVIVABLE, never
deleted — and wake each seat by warm-resume from the synced tail + shelf** (`main.rs` ~`:5112`).

**RETIRE, NEVER OVERWRITE is the keeper's word** and the attic is what makes it true rather than a
label. A retired transcript that cannot be revived is a deleted one with better manners.

## 3 · PULL, VERIFY, THEN START — and the refusal is the point

`state-sync.js --pull` runs **before `set_dirs` reads anything**, and the app **refuses to start on
a partial pull**. One seam row to the board, in the `backfill` announcement's old slot.

**You are the seat that just proved why the order matters.** The offsets bug was a read that ran
before `set_dirs` and quietly used the wrong directory for six weeks. **This is the same ordering
hazard, with a network in the middle** — and a partial pull that proceeds would be that bug's larger
sibling: a seat waking from a half-arrived record and announcing it is in sync.

**Close the `seed_*`-before-`set_dirs` class in the same packet** — `seed_room`, `seed_cards`,
`seed_references` at `:8837-8839`, which you named in L051 §6 and left unowned. The pull must run
after the resolver too, so they are the same repair.

## 4 · TESTS — pure where you can, fixtures where you cannot

**The retire decision must be testable from FIXTURE FILES**, not from a live desktop. Nobody can
re-run 08:00. **If the only way to test the retire path is to have two machines, say so** — that is
a real limit and it changes what the keeper should expect from the first launch.

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, C: `main.rs` and the launch path are yours, and tonight you found the
offsets defect statically, predicted the first launch before the rebuild, and were exactly right.
**A prediction that held is why this packet trusts you with the launch order again.**

## 6 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1   state the count
    the retire decision exercised from fixtures
    say what you did NOT verify -- and specifically, say what CANNOT be verified without the
      second machine, because the keeper needs that list before 08:00, not after

## 7 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    your test files
    exo_memory/handback/p-sync-launch-retire_2026-09-09.md
    exo_memory/map/C.md

**B holds the compaction; A holds `state-sync.js` and `C:\Consonance\state\`; E holds the live
mirror.** **You CALL `state-sync.js --pull`; you do not write it — that is A's.** **Do not commit.**

## 8 · PERMISSION TO REFUSE

**If refusing to start on a partial pull can lock the keeper out of his own app** — a bad network at
8am, a half-fetch, and Consonance will not open on either machine — **say so and propose the other
shape.** Refuse-to-start is right for correctness and catastrophic for a man who has just got home
from work. **There may be a third state: start, but start READ-ONLY and say so loudly.** Rule it;
you have the vantage and I do not.

## 9 · HAND-BACK

`exo_memory/handback/p-sync-launch-retire_2026-09-09.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  the desktop wakes as the synced seats, with its own past kept and revivable.
    FALSIFIER:  a seat on the desktop whose first words come from that machine's old transcript.
