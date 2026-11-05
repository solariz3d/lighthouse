# D640 (ledger lap): the briefs rule in the three seat briefs. Pane A, 2026-11-04. Tier: check it.

Branch `d640-a` in `C:\Users\nname\Desktop\worktrees\a-d640-wt`, off `ac29ce62`. Not pushed.

## What changed
The same bullet, with its Why line, went into each file's own section on hand-backs and briefs:

> - Keep one brief per thing being built in `exo_memory/briefs/`: his words and pictures go into the brief in the turn they
>   arrive; the state half is updated in the same turn as the work.
>   Why: transcripts no longer travel between machines, so the repo is the handoff, and a summary of the problem is the step
>   that loses it (`exo_memory/loop/handoff_how_handoffs_work_2026-11-04.md`).

- `consonance/src-tauri/brief/LIBRARIAN.md`, "Your notes are your restore point", after the write-in-the-turn rule.
- `consonance/src-tauri/brief/BUILDING.md`, "Hand-backs and collation", after the COMMITTEE.md pointer.
- `consonance/src-tauri/brief/COMMITTEE.md`, "The hand-back: a file, a map line, a ring", after the where-to-write rule.

    checked: git diff --stat → 3 files, 6 insertions
    checked: grep -n -i "exo_memory/briefs|in the turn|his words|verbatim" over the three at ac29ce62 → the rule was in none of them,
             so there was nothing to refuse. The nearest existing line is BUILDING.md "Forward the inquiry verbatim" (the joint step),
             which covers the inquiry, not a brief kept per build.

The rule's wording is the chair's packet's, verbatim. I did not quote the keeper in the briefs, because `consumer-relabel` pins
keeper lines. The Why line points at L's handoff note, which holds his words.

## Tests
    checked: S\d640\js.txt (node S\d640\js.js, 11 files, heavy-run lock held) → 9 exit 0; gen-consumer.test.js and
             identity-diff.test.js exit 1
    checked: the same two at ac29ce62 (my edits stashed) → the same failures, all "1 exo_memory/ entr(ies) are in neither column"
    checked: S\d640\cargo.log (cargo test --bin consonance -- brief intake committee librarian building trailer handback)
             → 167 passed, 1 failed, 2 ignored
    checked: S\d640\cargo-base.log (that one test at ac29ce62, my edits stashed) → FAILED, strict 141,758 B, light 117,696 B

S = C:\Users\nname\AppData\Local\Temp\claude\4589df4838997b56\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad

**Both reds are already at the base. Neither is mine, and neither is in my three files.**

1. **gen-consumer / identity-diff: `exo_memory/briefs` is in neither column.** The folder came in with f63412e6 and ac29ce62.
   The consumer generator refuses any `exo_memory/` entry that no manifest rule reaches and `STAYS_PRIVATE` does not name
   (`consonance/tools/gen-consumer.js`, `report.unclassified`). Whether briefs ship or stay private is a decision. They hold his
   words and his screenshots, so my lean is STAYS_PRIVATE, but it is the chair's or the keeper's call, in a file I don't own.
   **As it stands, pushing lighthouse main pushes this red.**
2. **`light_the_librarian_intake_is_under_target_with_the_cards_and_the_room`: the light librarian intake must be 25,000 B or more
   under strict.** At the base it is 24,062 B under (strict 141,758, light 117,696). With my edit it is 23,601 B under (strict 141,681,
   light 118,080). My LIBRARIAN.md line rides whole in the light intake (+384 B), while the strict one is held to its budget, so the
   line shrinks the gap by 461 B. The test went red before this lap; the bar or the light shelf is for whoever owns intake.

## Not done, as ordered
- d639-a 39bbb015 and plan-D640 not landed; the stick's tails and Z:\stick-backups untouched.

## The librarian's two rulings (notes 6006f68d, via the chair 02:24Z)

**Ruling 1, done.** `exo_memory/briefs` is in `STAYS_PRIVATE` in `consonance/tools/gen-consumer.js`, as one line beside `handback`:
the briefs hold his words verbatim and his screenshots, so they stay out of the consumer copy. Lighthouse itself stays public.

    checked: S\d640\js2.txt (node S\d640\js.js gen-consumer.test.js identity-diff.test.js, heavy-run lock held) → both exit 0
             (both exit 1 before, above)
    checked: grep -c briefs dev/mutation/mutate-gen-consumer.js consonance/tools/janitor.mutants.js → 0 and 0; the line is new,
             no anchor is on it and no existing line moved

**Ruling 2: a KNOWN RED, not loosened.** `intake_light_tests::light_the_librarian_intake_is_under_target_with_the_cards_and_the_room`
asks for the light librarian intake to be 25,000 B or more under strict. It is 24,062 B under at the base ac29ce62 and 23,601 B under
with this branch (the figures and runs are in "Tests" above). The test is unchanged.

**Follow-up, opened here, not done:** measure what grew in the light librarian shelf since the bar last held (the 2026-10-09 comment
at the test measured 110,038 B light; it is 117,696 B at the base). Then either trim what grew, or bring the bar to him with the
measurement. Owner: whoever the chair names for intake.
