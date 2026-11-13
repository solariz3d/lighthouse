# Adversary against R08, "the token cost of a wake, ping or compaction is not metered when it is spent"

Adversary, Sonnet research agent, 2026-11-13, read-only except this file. Marks: [read] opened and seen, path:line;
[inferred] mine; [ours] a proposal. Read whole: plan_vector_swarm_2026-11-13.md, 00_roots.md, the ledger rows named below
(by grep -n of 00_ledger.md, each row line whole), and the primaries named in sections 3 and 4.

## Verdict in one line

TOO BROAD TO TEST. Its own claim ("not metered") is already half false, and its cost rows are the price of other roots.

## 1. Is it a symptom? Yes, mostly of R02, R03 and R01. Ask "what produces this?"

R08 names a cost (tokens). The ledger rows that carry that cost have other makers [inferred, from the rows below]:

- L1013: keep-warm woke O after 13,722 idle minutes because `activated_by_use` counted a `/effort` echo as activation.
  That is a liveness proxy read off one side: R02 (a done-state read off the sender's side, the target not asked)
  [read: 00_ledger.md:1052; wake_level2_2026-11-13/idle_compaction_keepwarm.md:12-19].
- L0371: idle compaction (a vendor timer, 54.5-56.7 min) races the keep-warm ping (50 min + 0-6 offset): 18,088,314 tokens
  written. Two timers, neither reading the other: R04's shape (a gate that records intent, not state) [read: 00_ledger.md:410].
- L1093: nine seats resumed on Opus and three were moved to Fable, rewriting 2,049,358 tokens. The cause on disk: Consonance
  passes no `--model` on resume, and the memory note seat-substrates.md said a restart changes the model, which is wrong for a
  resumed seat. That is R01 (a claim typed from memory) [read: cold_wake_cost.md:7-12 and the 2nd-reader note near :27-34;
  00_ledger.md:1132, :1135].
- L0251, L0263 (intake over its cap, seat could not open, "its guard red") and L0100-L0102 (evictor dead by arithmetic):
  a ceiling never shown to fire on the real size is R03 [read: 00_ledger.md:290, :302, :139-141].
- L0201, L0016: board replay was a reader bug (offsets read from the wrong dir), found by board-audit.js: R03
  [read: 00_ledger.md:240, :55].

So the tokens are the invoice. A meter would show the invoice; it would remove none of these causes.

## 2. Rows its proposer claims that it does not explain

Group 2 listed 39 ids. I read each row. About 18 are about the token cost of a wake, ping, resume or compaction (L0010,
L0016, L0095, L0100-L0102, L0201, L0226, L0251, L0252, L0257, L0263, L0371, L0469, L0898, L0899, L1013, L1093, L1094)
[read: the rows in 00_ledger.md]. About 20 are not [inferred, my reading of one ledger line each]:

- L0024, L0346: what a compaction summary keeps (5 of 1,759 corrections). A content fault, R06. The cost is "the directive
  changed", not tokens [read: 00_ledger.md:63, :385].
- L0025, L0590, L0593: pulse and state-block lines no seat acts on: R07. Tokens are a side note [read: :64, :629, :632].
- L0326, L0334, L0582, L0595: the second reader's flags, skips and narrowing. An instrument's acted-on rate: R03/R07
  [read: :365, :373, :621, :634].
- L0613: the narrowing "never reached D; the installed copy is from 10-01": R02 [read: :652].
- L0614: whether the no-cut rule covers harness idle compaction is unruled. A rule gap, not a meter gap [read: :653].
- L0561, L0562: usage.js silently skips transcripts over 512 MB. That is a meter that lied by omission. It argues for
  checking instruments (R03), not for the absence of one [read: :600-601].
- L1012, L1022, L1024: agents launched without a named model took the seat's model; a 36-agent swarm launched from the wrong
  pane. Spend, but not a wake, ping or compaction [read: :1051, :1061, :1063].
- L1095, L1096, L1097: grep gave 3 of 7 compaction lines; a note and a swarm claim were wrong. R01 [read: :1134-1136].
- L0048: a compaction landing at 909,787 of 1M. Room to think, not a meter [read: :87].

About half of R08's ids are not its own, so its count of 39 flatters it.

## 3. Could a fix be shown to work on a recorded case?

"A meter" names no fix that can fail on a recorded case. Three readings, tried [inferred]:

- A meter that prints tokens per event. It exists: usage.js, seat_tokens.js, extract.js, perseat.js, and the keeper's own
  usage page. Every large figure in the ledger (L0010, L0257, L0371, L0469, L0898, L1093) came out of one of them, within
  hours or two days, not "weeks later" [read: third_place/2026-10-31.md:3-19 measured a 48-hour table the day the keeper said
  usage burned too fast; L0257's keeper saw it on his usage page, 00_ledger.md:296]. The stated mechanism does not match
  the rows [inferred].
- A ceiling beside the cache write. No recorded case shows a ceiling that would refuse a wasteful write and allow a needed
  one. L0100-L0102 and L0251/L0263 are ceilings that existed and were red or a no-op (R03 again).
- A cut (compact before a break, pin `--model`, move the ping). These have recorded tests: L1093 (a model pin saves
  2,029,827 Opus tokens), L1013 (one exclusion in `activated_by_use`). But they fix R02/R01 rows, not "unmetered", and some
  need his word per seat under the no-cut rule [read: cold_wake_cost.md summary lines 4-5].

Another limit: how the weekly limit weights reads against writes is not known [read: plan_keep_warm_2026-09-21.md, the
"Not known" line in section 0], so a token meter cannot be shown to match what he is charged.

## 4. Has the room tried a fix of this kind?

Yes, five times. They show the gap is policy and guard-checking, not measurement [read unless marked]:

- 2026-08-24 shelf tier (index the record, carry the system) after a compaction at 909,787 tokens
  (loop/shelf_tier_2026-08-24.md:11-18). F-growth fired on 09-01 anyway (358k, 417k, 501k); its landing falsifier was
  withdrawn because it "would have PASSED, certifying nothing" (wake_level2_2026-11-13/prior_attempts.md, W1 section).
- 2026-09-21 keep-warm: ping every ~50 min so a restart is the only full re-read (plan_keep_warm_2026-09-21.md, CHUNK T,
  with a registered falsifier). It was built. The ledger shows it worked on its case: 84 calls wrote over half a context
  after a gap under 55 min, 0 since 11-01 [read: 00_ledger.md:49]. Its later faults (L1013, L0371) are timer and proxy
  faults.
- 2026-09-21 fresh-vs-resumed test: drafted, "Not run. Not registered yet" (fresh_vs_resumed_test_2026-09-21.md:1-3) [read
  the header only; I did not search whether it ran later].
- 2026-09-01 pane shell ceiling (140k) and its recurrence 2026-09-20 at 154,087 against 150,000 (L0263).
- 2026-11-03 usage.js rewrite over the 512 MB skip (L0561, L0562).

Pattern [inferred]: each fix of "the carry is too big" worked where its guard was checked on a real run and failed where the
guard was green on fixtures. That is R03's pattern, not a new root.

## What survives my attack (two lines)

The cost is real and large: 5.92 M tokens at one wake, 18.1 M from the race, 1,678 M cache reads for O in 48 h [read: rows
L1093, L0371, L0469]. As a cost column to weigh the other roots' rows (R02's L1013, R01's L1096), R08 is worth keeping; it is
not itself a cause to fix.

## What I did not open

- roots_g2.md itself (I used the clerk's merge in 00_roots.md).
- Any transcript or C:/Consonance/data file (no pass run); every number here is a ledger row's.
- Whether the fresh-vs-resumed test was later run; whether the 09-21 keep-warm trial's falsifier was scored.
- The primaries of the ~20 ids I classed as not R08's; I read one ledger line each.
