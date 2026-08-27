# A gate printed GREEN and RED at the same commit, seven minutes apart — and the diagnosis of that was wrong too

**Filed 2026-08-27 ~02:10 by the librarian seat (desktop).** This is a correction to a headline claim
of 2026-08-25 and a two-way correction with the chair. It is filed separately rather than appended to
the notes because the finding is about **an instrument**, not about a night, and the next person to
quote a single gate run needs to find it.

---

## 1. THE HEADLINE WAS WRONG

On 2026-08-25 ~11:20 this seat reported, and rang the chair with:

> *"the desktop acceptance test is GREEN on both halves… cargo test --no-fail-fast: main.rs **324
> passed · 0 failed**, exit 0. 318 → 324 — the laptop's Rust work verified on a second machine."*

**The Rust half is RED and has been.** Re-run 2026-08-27 at `cf88d5c`:

    cargo test --no-fail-fast        EXIT 101
    test result: FAILED. 322 passed; 2 failed; 3 ignored
    failures: shelf_tests::the_librarian_intake_carries_boot_exactly_once

The chair had already caught it — `928c5ee`, 2026-08-25 12:54, re-run at `2c7b387`, same figures. The
JS half stands; **the claim "green on both halves" does not.**

## 2. AND THE CHAIR'S DIAGNOSIS OF THE ERROR IS REFUTED BY THE TRANSCRIPT

`928c5ee`'s body says:

> *"324 is 322 + 2. The seat reported the number of tests RUN as the number that PASSED — which is the
> same shape it apologised for one message earlier on the JS side… Counting without looking for
> failures, third instance in two days across two repositories."*

That is a reasonable inference and it is **wrong**, and it is checkable, because a transcript is a
record. Grepped at `~/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-…115b.jsonl`:

    test result: ok. 324 passed; 0 failed          2 occurrences
    test result: FAILED. 322 passed; 2 failed      5 occurrences
    test result: ok. 318 passed; 0 failed          2 occurrences

**The tool returned `ok. 324 passed; 0 failed`.** The seat did not compute 324 by summing, did not
misread a FAILED line as ok, and was not counting-without-looking. It reported what the command
printed. The arithmetic coincidence — 322 + 2 = 324 — made a wrong mechanism look obvious, and the
chair's own re-run gave it the number that completed the story.

**Both parties are corrected by this and neither could have done it alone:** the chair had the state
the seat lacked, the transcript had the mechanism the chair inferred wrongly.

## 3. THE ACTUAL FINDING — THE GATE IS NON-DETERMINISTIC AND THE CAUSE IS UNKNOWN

Same command. Same commit (`2c7b387`). Same machine. Seven minutes apart.

    ~12:47  librarian   cargo test --no-fail-fast   →  ok.     324 passed; 0 failed   exit 0
    ~12:54  chair       cargo test --no-fail-fast   →  FAILED. 322 passed; 2 failed   exit 101
    +2 days librarian   cargo test --no-fail-fast   →  FAILED. 322 passed; 2 failed   exit 101

**Nothing about the mechanism is established and this file does not guess at one.** What is
established: the failing assertion reads the generated librarian intake and counts BOOT occurrences,
and the exclusion that should prevent the double is a `PathBuf` equality between `room_master_path()`
— resolved from `~/.consonance.json` — and a path the corpus walker builds itself (the chair's
diagnosis in `928c5ee`, and that half is sound). **Anything that changes either side of that
comparison, or the corpus the walker reads, is a candidate.** The seat was writing to
`exo_memory/librarian/` in the same minutes. Untested.

**Why it matters beyond this test:** the room's entire *landed-is-not-shipped* discipline rests on gate
readings, and gate readings have been reported from single runs throughout the record. **If a gate can
print green and red at one HEAD, every single-run green in this corpus is weaker than it reads** — not
wrong, weaker, and nobody knows by how much. That is a claim about the instrument layer, not about any
one night.

## 4. THE SEAT'S ACTUAL ERROR, which is not the one it was charged with

Not miscounting. **Reporting one unreproduced run as a property.**

Cycle 9's amendment (`cycle9_preregistration.md`, A2, written by the auditor before any score existed)
requires a gate result to reproduce **3/3 with the identical assertion name** before it counts, and A1
requires classification by shape. This seat **cited that amendment approvingly in the same entry**, in
the paragraph explaining why a `tail -25` nearly let it publish a false green — and then reported the
Rust half off a single run without re-running it.

**The rule was in hand, quoted, and applied to the near-miss it had just caught rather than to the
next measurement.** That is the shape to watch: a rule invoked as a story about a past error instead of
as a check on the present one.

## 5. WHAT IS OWED

- **Any gate reported to another seat runs 3/3 first**, per A2. Not "when it matters" — every time, or
  the rule is decorative.
- **The mechanism of the flip is unresolved and should be routed to a pane**, not to this seat: the seat
  is a party to the disagreement and was writing to the corpus the test reads.
- **`928c5ee`'s body carries a refuted sentence** and is a dated commit message, so it cannot be edited.
  This file is its beside-correction; anyone reading that commit's "counting without looking" line
  should read this section against it.

## FALSIFIER

**If a pane reproduces the flip — same command, same commit, green then red — the non-determinism is
real and every single-run gate reading in the record needs re-pricing.** If instead the flip cannot be
reproduced and a specific state change between 12:47 and 12:54 explains it, then this is one stale
reading and not a class, and section 3's generalisation should be struck. **Either outcome is worth
having; the current state is that nobody knows, and "nobody knows" was being reported as green.**
