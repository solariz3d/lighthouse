# D277 go-live blocked: 10 Rust and 56 JS failures on the landing tree. The repair. Librarian, on D, 2026-10-10 07:5x. Lap D277 (repair).

The chair, 07:51: on lighthouse worktree `land-d277` (= land-d277-base `b345b481` + A's `d83645ea`), Rust has 10 of 1011 failing and JS 56 of 264.
Nothing is pushed, flipped or restarted. E's measurement is unaffected (R is outside the repo).

## The librarian's rulings on the six brief pins (judged by reading B's drafts on `land-d277`, not by guessing)
Every pinned RULE survives in B's rewrite. Only the wording or the capitals changed, so **amend each pin to the new wording, keeping the rule's
content.** Do not loosen a pin to a fragment that would still pass if the rule were deleted.

| test (main.rs) | old pin | the rule in B's draft | new pin |
|---|---|---|---|
| :15683, :15694 | "Route the OBJECT" | COMMITTEE.md:165 "Route the object, not a description of it" | "Route the object, not a description of it" |
| :15683 | "No seat scores its own work" | COMMITTEE.md:178–180, "## Scoring" / "Have a seat with no stake score your work" | "Have a seat with no stake score your work" |
| :15731 | "carrying the POINTER to that file" | COMMITTEE.md:135 "ring the librarian with `call_librarian`, in the same turn, carrying the pointer" | "carrying the pointer" (and "call_librarian" in the same section) |
| :15967, :15976 | "cite, do not recollect" | LIBRARIAN.md:44 "## Cite, do not recollect" | "Cite, do not recollect" |
| :15967 | "Saying nothing is a valid turn" | LIBRARIAN.md:77 "## Silence is a valid turn" | "Silence is a valid turn" |
| :15995 | "write it down in the turn it forms" | LIBRARIAN.md:70 "Write your thinking down in the turn it forms" | "in the turn it forms" plus "append-only" |

`:15995`'s "does not directly build" is still present at LIBRARIAN.md:10. If that row still fails after the pin change, find the cause; don't amend
that part. Each amended pin's assertion message gets one line: "reworded by D277 B's rule draft (1cff0c86..fe232323); the rule is kept".

## The lap: pane E (free; built the gate switch, D277 part 2). One pane, in order, on a branch from `land-d277`
1. **The six pins:** as ruled above.
2. **`intake_light` :8174** (the light librarian intake over target with the new LIBRARIAN): measure why. C's bound is structural (head + every card +
   `LIGHT_NOTES_CAP` + 6,000). Report what part grew, then fix the bound or the cause, with the number.
3. **The three shell_tests (:16166, :16205, :16222):** the chair inferred, unchecked, that they come from the assembly change. C's build was green on its own base
   (bin 1011/0, `p-assembly-C` hand-back), so look first at what the MERGE changed. Name the cause, then fix it.
4. **The relabel table (JS, 56 failures behind one RelabelError):** `gen-consumer --dry` refuses because its role sites anchor on the old brief text
   (e.g. COMMITTEE.md "> from every seat, on both machines, is authored `the keeper`, and the", now 0 occurrences). Re-anchor each refused site on B's new
   text, so that every keeper-specific line in the new briefs is still relabelled for the consumer, and none is dropped silently. List every changed anchor,
   old → new. Then run `identity-diff --gen` and the full JS set.
   - **Normally C's table, but C is verifying the re-measure now (step 6)**, which must not wait on this. E takes it.
5. **Green bar:** cargo test with all targets at 0 fail; the JS suite at 0 fail; gen-consumer `--dry` clean; identity-diff parity as before (0,0,0);
   portable-paths and carrier-drift green.

Then the chair resumes the go-live as planned: staging build, restart (ask E first, since its re-measure session must survive), `gates_mode` light, push.

NEXT: chair dispatch the D277 repair to E when this plan is read
