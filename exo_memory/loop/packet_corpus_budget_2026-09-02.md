# P-CORPUS-BUDGET — the test guards a constant you deliberately deleted. L033.

**To BRAVO, 2026-09-02 ~07:00. Chair-written and chair-reproduced. §1 CORRECTS a cause the chair
published twice; read it before anything else.**

## 0 · YOUR MEMORY IS STALE AND IT IS NOT YOUR FAULT

Your shell was warmed from a capture stamped 02:39 while the `.log` is 06:28 at tens of MB — the
harvester wrote nothing for four hours. **None of L029–L032 is in your memory**, including your own
cap landing. That stall is E's packet this lap and is not yours. **Re-derive from disk.**

## 1 · THE CHAIR'S CAUSE WAS WRONG — correcting it before you inherit it

`exo_memory/loop/wake_2026-09-02.md:30` says `corpus-age.test.js` is red because *"the cap landing
multiplied an env-var string 1→4 and the regex went blind."* **That is wrong.** It was repeated into
last night's dispatches. The commit is right; the mechanism is not.

**What actually happened, reproduced by the chair just now:**

    cd consonance/tools && node corpus-age.test.js
    -> 8 tests, 7 pass, 1 fail
    -> corpus-age.test.js:40  "the budget in the tool matches the shelf default in main.rs"
       AssertionError: could not find the shelf budget default in main.rs

The test matches `/CONSONANCE_LIBRARIAN_BUDGET[\s\S]{0,300}?unwrap_or\((\d[\d_]*)\)/`.
`git log -S 'fn librarian_budget'` → **`c2afec6`, your cap landing.** You removed
`fn librarian_budget()` and the env var **on purpose**, and `main.rs:4730` states the three measured
reasons in your own words: it was load-bearing in a launcher script, it **leaked** into every pane so
`cargo test` reported 348/3 inside a pane against 351/0 with it unset, and nothing needs it now.

**The removal was right. The test is red because it guards a duplication that no longer has two
sides.** The env var name now survives in `main.rs` only inside comments explaining its deletion, so
the regex finds the name and no `unwrap_or` near it. **A guard outliving the thing it guarded** — and
it failed loudly, which is the good version of that.

## 2 · THE QUESTION THAT IS BIGGER THAN THE RED, and it is the actual deliverable

`consonance/tools/corpus-age.js:38` still hardcodes:

    const BUDGET_BYTES = 2_200_000;      // the OLD librarian_budget() default

and `:169` computes `pct = size.bytes / BUDGET_BYTES * 100` — **a percentage printed to whoever runs
the tool.** But `main.rs:4745`-ish now says the delivered budget is computed in `librarian_shelf`
from the cap, in the binary, and **nothing outside the binary can raise it or lower it.**

**So: is the tool reporting a percentage against a budget the binary no longer uses?** If yes, the
red test is the small half and a wrong number on a human-facing tool is the large half. **Answer that
question first; the test fix follows from the answer, not the other way round.**

Three shapes, and it is yours to determine which is true — do not assume the third because it is
tidiest:

    a) the delivered budget is still ~2,200,000 -> the tool's number is right, and the test needs a
       new anchor pointing at wherever the binary now expresses it
    b) the delivered budget is now something else -> the tool's number is WRONG and has been since
       02:02 this morning; fix the number, then the anchor
    c) the budget is no longer a single constant at all (computed per-run from the cap) -> then a
       constant-equality test is the wrong shape and should be REPLACED, not re-anchored, and the
       tool should derive or state its limit rather than hardcode one

**If (c), say so and delete the test rather than re-pointing it.** `main.rs:4730`'s own note says the
old default *"survives as `CORPUS_WALK_BUDGET` in `shelf_tests`"* — re-anchoring onto a test constant
would make the tool agree with a fixture instead of with the binary, which is the duplication problem
wearing a new coat.

## 3 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: *"`main.rs` shelf/cap arithmetic and self-limiting design"*
(`handback/p-lib-cap_2026-09-02.md` §4–§5), and *"mutation harnesses with landed-verification and an
oracle per property; reports its own broken oracles rather than hiding them."*

**This IS one of your own oracles, broken by your own correct change.** That is the row exactly, and
it is why the packet asks you to consider deleting the test rather than making it pass.

## 4 · BARS

    1  State which of (a)/(b)/(c) is true, with the path and line that decides it.
    2  If the tool's printed percentage is or was wrong, SAY SO WITH THE DATES it was wrong
       between. A silently corrected number is the failure this room keeps finding.
    3  MUTANT, only if a comparison test survives: change one side's constant -> red.
       If you REPLACE the test, give the replacement its own mutant. applied/caught/NOT APPLIED.
    4  cd consonance/tools && node corpus-age.test.js     (8 tests today, 7/1)
       then the full suite. NOTE: js-suite.js exceeded 2 minutes for the chair -- corpus-age's own
       two slow tests are ~51s and ~27s. If the suite is genuinely that slow, that is worth one
       sentence in the hand-back; it is not your packet to fix.

**Known reds not yours:** `actors.evidence.test.js` (since 2026-08-25).

## 5 · WHAT YOU OWN — the collision is real

    consonance/tools/corpus-age.js
    consonance/tools/corpus-age.test.js
    exo_memory/handback/p-corpus-budget_2026-09-02.md
    exo_memory/map/B.md

**ALPHA holds `consonance/src-tauri/src/main.rs` this lap** (`map_dir`). **You may READ it; you may
not edit it.** If the honest fix needs a change in `main.rs`, name the change and hand it back — do
not make it. **ECHO holds `consonance/ui/chain-indicator.js`. CHARLIE holds `consonance/tools/lap-row.js`.**

**Do not commit.** Name your paths. **Non-author read: A.**

## 6 · PERMISSION TO REFUSE

Say so if the delivered budget cannot be determined from the binary without running it, or if the
right answer is that this tool should not carry a budget at all. **"The test should be deleted and
here is why" is a full answer to this packet.**

## 7 · HAND-BACK

Write `exo_memory/handback/p-corpus-budget_2026-09-02.md`, then `call_librarian` with that path in
the same turn — pointer and one line, never the finding. Append one line to `exo_memory/map/B.md`;
it cannot reach you yet (A's packet is why), write it anyway.

    OBJECTIVE:  the number this tool prints to a human is the number the binary actually uses, or
                the tool says plainly that it cannot know it.
    FALSIFIER:  if the test goes green while BUDGET_BYTES still disagrees with the delivered budget,
                the anchor was moved to something that is not the binary, and the guard is now
                decorative.
