# L040 · THE TWO ONE-LINERS, AND A CORRECTION TO MY OWN HEADLINE NUMBER

*Pane E, 2026-09-06. Collation read at the file: `librarian/2026-09-06.md` ~04:08 (`5d765d0`).
Nothing committed; paths in §6. **Read §3 first if you are carrying my figure anywhere** — it is
wrong and it has already travelled into the collation.*

---

## 1 · FIX 1 — THE ANCHOR WAS WRONG, NOT THE WORDING. MY ERROR, AND A FOUND IT BY DOING RATHER THAN READING

`raise-target.test.js:111` asserted `/^mod seat_alias;$/m`. The `$` demands end-of-line immediately
after the semicolon, so **the trailing comment I myself prescribed in the patch note failed my own
test.** A and C both saw it and both correctly left it alone because the file is mine.

**The chair asked me to decide which half was wrong rather than relax the test to fit a bad
prescription. The file settles it — the wording is right and the regex was wrong:**

    $ sed -n '20,29p' consonance/src-tauri/src/main.rs
      mod cochlea;   // audio as relationships: ratios, not frequencies. Pure maths, no unsafe.
      mod cochlea_service;  // threads, the ledger, and the refusal to run near an anti-cheat …
      mod lap_holders;  // whose turn it is when MORE THAN ONE lap is open — the guard's pure half
      mod seat_alias;  // what a person TYPES -> what PaneNames INDEXES; the 58 measured failures

**A trailing comment on a `mod` line IS the house style in that exact block.** A test that forbids
the convention its own file follows is the defective half, so the anchor is relaxed to
`/^mod seat_alias;/m` — still line-anchored, so a commented-out `// mod seat_alias;` cannot satisfy
it. The prescription stands unchanged and C's line is untouched.

**What this cost and who paid it:** nothing, because a different seat was the one typing. Had I
folded my own patch I would have written the line to match my own regex and never learned the regex
was wrong. **The one-seat-one-file rule produced the catch as a side effect** — worth noting because
that rule is usually argued for on collision-safety grounds alone.

## 2 · FIX 2 — `every_chair_verb_authenticates`, RED SINCE 09-02 OVER A TEST FIXTURE

    $ node -e "<count both tokens in src/mcp.rs>"
      verbs (raw substring):  6        auths (raw substring):  5
      the six:  314 async fn chair_inject(     507 async fn chair_phase(
                547 async fn chair_decide(     560 async fn chair_scrollback(
                573 async fn chair_status(
                933 let b = body_of("async fn chair_inject(");     <- A STRING, INSIDE A TEST
      anchored to declaration lines: verbs 5, auths 5

`src.matches("async fn chair_")` counted the fixture string of a test that checks the declaration.
The counter is now line-anchored: a declaration cannot be indented past its `impl` and cannot follow
anything on its line; a mention inside a string always does one or the other.

**The class, and it is the reason the chair paired these two:** one regex too strict, one too loose,
both in guards nobody was watching. Mine rejected a correct input; this one accepted a fake one and
**reported an unauthenticated actuator path for four days in a test target nothing was running.** A
guard that cries wolf in a file nobody opens is indistinguishable from no guard.

**THE MIRROR HAZARD IS LEFT OPEN WITH ITS NAME ON IT.** I anchored `verbs` and did NOT anchor
`auths`, because `self.auth_chair(` appears mid-line inside an `if` and has no equivalent line
shape. So the day a fixture quotes `"self.auth_chair("`, that count inflates and **this tripwire goes
green over a missing gate** — the dangerous direction. Closing it properly means teaching the counter
to skip `#[cfg(test)]`, which is more than this landing should carry. It is written into the source
beside the fix rather than left for someone to rediscover.

## 3 · THE CORRECTION — MY "58" WAS WRONG IN KIND, AND THE LIBRARIAN HAS ALREADY CARRIED IT

I reported **58 resolution failures on the board.** That figure counts *occurrences of the string*
`no live pane matches` across board rows. **Every one of those rows is prose.**

    rows containing the string                     41
    rows where the refusal IS the message           0      <- this should have stopped me
    by day: 07-27  2 · 08-24  26 · 09-01  2 · 09-06  11

The 26 rows on 08-24 are seats *analysing this very defect*; the 11 today include **my own board
posts about it.** I measured the room's conversation about the bug and reported it as the bug. The
librarian has already propagated it — *"E's 58 checks out: 36 board rows carry…"* — so this
correction has to reach the collation, not just this file.

### The real instrument was two functions away the whole time

`deliver_pull`'s outcome is audited: `board_push(… pane: "gate" …)` at `main.rs:6534`. **Ten gate
rows, the complete history of approved pulls:**

    2026-07-13   NOT delivered — pane is HUMAN-DRIVEN     correct refusal, not this defect
    2026-07-27   no target to deliver to                  empty target, not this defect
    2026-08-24   no live pane matches 'Main'    librarian -> Main      EVAPORATED
    2026-09-01   no live pane matches 'MAIN'    CHARLIE   -> MAIN      EVAPORATED
    2026-09-06   delivered to a2122153          librarian -> E         ok (letter is registered)
    2026-09-06   no live pane matches 'MAIN'    librarian -> MAIN      EVAPORATED
    2026-09-06   delivered to 0c0c0c0a   x4     librarian -> pane id   ok (the workaround)

**THREE keeper-approved hands evaporated. Not four, and not fifty-eight.** All three targeted the
orchestrator by label; every success used a raw pane id or a registered letter.

**The defect is unchanged and the shape is sharper: 3 of 10 approved pulls lost, and every
label-to-Main attempt in the record failed.** A smaller number that is actually a measurement.

**How I got it wrong:** I grepped the whole board and took occurrences for events, without first
asking whether a refusal is even written as its own row. It is. My own check for *"the refusal IS
the message"* returned **zero**, and that should have stopped me on the first pass instead of the
third. The room's rule is that uncurated measurement is its one real exterior — **a grep over prose
is not that instrument; it is the room reading itself and finding itself.** The correct instrument
returned a number that cost me my headline, which is roughly how you can tell.

## 4 · THE THREE LOST HANDS, RE-QUEUABLE VERBATIM — the chair's standing item, answered with contents

The gate-cards carry each hand's text, so **nothing needs reconstructing**:

    9ff882d4   2026-08-24 09:52   librarian -> Main
               "The Cycle 1 map+plan the orch is waiting on is delivered and v…"
    a000da92   2026-09-01 12:38   CHARLIE   -> MAIN
               "P-LIB-WINDOW is BUILT, uncommitted, all four bars met. Hand-back…"
    462f0497   2026-09-06 08:27   librarian -> MAIN
               "KEEPER-DIRECTED (02:26: 'correct the other panes before B is done')."

Two are probably stale and one is tonight's. **Which get re-queued and which are declared dead is
not mine to decide** — but nobody has to guess what they said, and "declared dead" should mean
someone read the text and said so, not that the count was retired.

## 5 · SUITES — what I got, not what was predicted

    $ cargo test --bin consonance -- --test-threads=1
      test result: ok. 398 passed; 0 failed; 3 ignored; finished in 8.84s

    $ cargo test --test arch_test -- --test-threads=1
      test result: FAILED. 11 passed; 1 failed
      the one red: every_named_record_file_exists_and_every_record_file_is_named

**`every_chair_verb_authenticates` is no longer in the failure list — that is fix 2 landing.**

### I LEFT THE SECOND RED ON PURPOSE. DO NOT LET ANYONE "FIX" IT BY DELETING THE ASSERTION

    record/third_place_prehistory_2026-08-30.md is named by no card — a record nothing points at
    is unreachable by a pane, which is worse than not splitting it out at all

**That assertion is telling the truth.** It is a real fact about the corpus, C flagged the same line
as the weakest in its own ruling, and the chair confirmed it at the file. It becomes a packet after
the rebuild. The failure mode to guard against is the obvious one: a later seat clearing a red
board by deleting the check instead of naming the record. **The test is right; the corpus is wrong.**

`node consonance/tools/js-suite.js` was still running when this was filed; result appended in §7
rather than promised. *(This is the same shape as one lap ago and I am naming it the same way: a
figure I owe is a figure I say is outstanding, not one I round off.)*

## 6 · PATHS — nothing committed

    consonance/tools/raise-target.test.js         MODIFIED  fix 1; canary marker DELETED (it sang)
    consonance/src-tauri/tests/arch_test.rs       MODIFIED  fix 2 + the mirror hazard, named
    exo_memory/handback/p-raise-target-folds_2026-09-06.md   NEW  this file
    exo_memory/map/E.md                           +1 line

`main.rs`, `mcp.rs`, `seat_alias.rs` **untouched by me this turn** — C holds the first two; the third
is mine and needed no change. B's `gen-consumer.js` and `memory/` untouched.

**The canary sang and I deleted the exemption in the same turn**, which is the handshake the file
was built around: six of six green, `JS-SUITE: EXPECTED-RED` removed, the file now an ordinary guard
against the defect returning. A stale exemption left behind would have suppressed a real red here
later — that is js-suite's own stated reason and it applies to the seat that wrote the marker.

## 7 · AFTER THE REBUILD

The proof that is mine: **`raise_pull` with target `MAIN` renders.** Until that is observed, the
sentence from my last two hand-backs stands unchanged and I am not going to soften it: **the unit is
proven and the delivery is not.** 398 green tests and a folded patch are not a rendered message.

*js-suite result, as promised:*

    $ node consonance/tools/js-suite.js                                    (exit 0)
      74 green · 2 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 0 not-run · 0 class-error
      of 76 discovered · 76 ran assertions to a summary · 0 NOT-RUN · 0 neither

      FAILED: consonance/tools/actors.evidence.test.js
      FAILED: consonance/tools/carrier-drift.test.js

**`0 canary · 0 sang` is the line that matters, and the runner is checking my work rather than
taking my word for it.** Had I left the exemption in, this would read `1 sang` — which js-suite
counts as a failure, because an expected-red going green is one. Had the marker still been inert,
`raise-target.test.js` would be sitting in the FAILED list. It is neither: **the file is an ordinary
green and holds no exemption.** 75 files last lap, 76 now; the new one is mine.

**The two reds are the same two as last lap and neither is mine.** `carrier-drift.test.js` is
long-standing shared workshop debt (`consumer_parity_2026-09-04.md` §3). `actors.evidence.test.js`
I flagged last lap as having moved from NOT-RUN to FAILED, and declined to attribute then; it is
still red, the tree is carrying five seats' uncommitted work tonight, and I am still not attributing
it. **Neither blocks the rebuild, and neither should be quietly folded into someone's landing to
clear the board.**

*(This block was appended by a shell heredoc that ate every backticked filename on the first
attempt, and rewritten by hand. Noted only because the corrupted version was briefly on disk and a
reader who saw it should know which one is real.)*

