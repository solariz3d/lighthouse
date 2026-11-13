# Adversary on R07 (a stage end, alarm or finding has no named consumer, deadline or wake path). Sonnet research agent, 2026-11-13

Marks: [read] I opened it, path:line; [inferred] mine; [ours] a proposal. Counts from a node script over 00_roots.md and
00_ledger.md are [read: script]; what they mean is [inferred]. Sources I cite were read in whole lines.

## Verdict

TOO BROAD TO TEST. Single strongest reason: R07 joins two things whose fixes point in opposite directions. One is "a stage
end has no owner or wake" (add a consumer). The other is "instruments emit lines nobody acts on" (the room's own measurement
says delete most of them). No single check on a recorded case covers both [inferred from the evidence below].
It is also not a clean root: 56 of its 71 claimed ids are claimed by another root too [read: script].

## 1. Is it a symptom? What produces it

The ids the proposers claim for R07 are the union of g3 (35) and g4 (63), 71 in all [read: script over 00_roots.md].
- 56 of the 71 are also on another root's list: R02 37, R04 21, R05 13, R06 9, R03 7, R08 6, R10 2, R01 1 (an id can be in
  several) [read: script]. Only 15 sit on no other root: L0005 L0006 L0017 L0018 L0027 L0028 L0067 L0328 L0333 L1120 L0038
  L0167 L0287 L0381 L1027 [read: script].
- Of those 15, ten are instrument tallies with "cost not recorded" in the ledger: L0005 (the word "refused" in 5,082 board
  rows, kind not split), L0006 (MISSED, 173 rows, meaning not read), L0017 (3,293 turns sourced=false), L0018, L0027, L0028,
  L0067, L0328 (sources-gate denied 430 rings), L0333 (reply-slot blocked 47), L1120 [read: ledger rows]. A gate that refuses
  on purpose (L0328, L0333) is the gate working, not a fault with no consumer. These rows count emission, not an incident.
- Rows with a time cost recorded: 16 of the 71 [read: script, cost field names minutes or hours]. Several are one event seen
  twice: L0068 and L0074 (80 min, 08-29); L0143 and L0144 (8 h 57 m, 09-03); L0239 and L0254 (82 min, 09-16; L0254's own
  row says who caught it is "not recorded") [read: ledger]. About 11 distinct timed events, not 16 [inferred].

What sits upstream of the timed events, case by case [read: ledger row, then primary where I opened it]:
- **R05/R02 (the next actor was told, but "told" is read off the sender's side).** L0241: the chair "waited on a ring
  already delivered at 13:15:46", 13:16 to 17:40 [read: librarian/2026-09-16.md:177]. The consumer existed and the message
  had arrived. The plan itself says its 4 h 24 m figure belonged to a different fault than the one it was ranked under
  (plan_vector_swarm_2026-11-13.md, "Why the choosing is the hard part"). Also L0294 (E wrote the addendum without
  re-ringing), L0412 (D348 tied to pane C and queued while A and B were free), L0816 (A's stop note never arrived) [read: ledger].
- **R04/R09 (a lock and a shell hazard).** L0982, 99 min 40 s: "no seat owned starting the train, B's mutants held the slot,
  a runaway grep held the gate" [read: librarian/2026-11-13.md:280,295,311-312]. The owner gap is one of three causes there;
  the other two are the slot holder and the grep. Removing the owner gap alone does not move the other two.
- **A rule that exists and fails at the moment of need.** L0143 and L0240: the librarian wrote "waiting on the chair" while
  the next stage was ready. The keeper's 05:21 catch and the 05:27 entry say the rule was already written (BUILDING.md:35-42,
  LIBRARIAN.md:255-266) and a pulse line fired 345 times unheeded [read: librarian/2026-09-16.md, entries 05:22 and 05:27].
  That is "a written control does not fire where it is needed", close to R03 and to the trigger-index finding the entry cites.
  R07 as worded ("no named consumer") does not describe it: the consumer was named in writing.
- **A real R07 core survives:** L0591 (HANDBACKS IN fired 761 times, 0 acted; E owed 7 h 1 min across 8 keep-warms), where
  O's finding is "the line was right and the seat able to act on it had no working turn; the cause is the pairing of the
  owed line with the keep-warm's 'not work'" [read: handback/p-d627-p3-everyturn-O_2026-11-03.md, Notes B]. Also L1027 and
  L1020 (pane O given no work all morning) and L0068/L0074 (a collation alarm "as a conjunction nothing computes") [read: ledger].
  Roughly five to six events, not twelve [inferred].

## 2. Rows its proposers claim that it does not explain

- **Instrument tallies that are not faults** (the ten above): emission, not a missing consumer, and no cost.
- **L0017, L0018, L0027, L0028, L0326:** sourced=false turns, return-ledger misses, vantage DISAGREE and CANNOT-SETTLE, second
  reader flags. Whether each was acted on is "not recorded" in every row [read: ledger]. A missing consumer is a hypothesis
  for them, not a recorded fact [inferred].
- **L0381 and L0287:** 12 stale open laps closed in D300; 47 lap ids in commits never minted. Bookkeeping, no cost recorded
  [read: ledger].
- **L0982, the root's headline "four READY branches idle 99 min 40 s":** shown above to have three causes [read].
- **L0241's 4 h 24 m**, the largest timed figure in the set, is in R07's g4 list but is a delivery-state miss (R05/R02)
  [read: ledger, plan].
- The roots clerk records that group 3 judged its version "a symptom of R05 and R02" [read: 00_roots.md, R07 Statement].
  The ledger supports that for the delivery cases and not for L0591, which is a wake-path gap [inferred].

## 3. Could a fix be shown to work on a recorded case?

For the stage-end half: yes, case by case, but each case is its own fix. Tests I can name [ours]:
- Replay L0143 (baton held 8 h 57 m): a stage-end row names a receiver, and a timer or hook wakes the receiver if the row
  has not moved in N minutes. Pass = the baton moves with no keeper line. P-BATON-WAKE was "named; not built" on 09-03
  (librarian/2026-09-03.desktop.md:73,151) and a handback for it is listed at :219; I did not open that handback.
- Replay L0591: an owed idle seat gets a WORK turn naming the action. Pass = the owed seat acts inside one keep-warm
  interval. This is recommendation 1 of room_value_result_2026-11-03.md ("fix the idle gap first"). Whether it was built I
  did not check; L0982 on 11-13 shows a similar gap again.
For the emission half: there is no failing recorded case to test against. The fix the room itself measured is deletion:
O's classes (STALE, dirty, sync, chain, fused, state block, the NEXT-trailer note, sources-gate in light mode) are NOISE and
sit in the "retire, by name" list of room_value_result_2026-11-03.md [read]. A "consumer" fix would add readers to 4,577-fire
lines that O showed move no seat. One root with a test for one half and an opposite remedy for the other has no single test.

## 4. Has the room tried a fix of this kind, and how did it end

Each attempt below is "name a consumer, or put the line where the next actor reads it" [read unless marked]:
- **Stalled-lap detector, 08-29** (stalled_lap_detector_2026-08-29.md; attack file by E). The next day L018 sat at MAP with
  five idle panes 1 h 40 m to 2 h 14 m, "fifth stall-by-silence, a day after the detector was built" (L0079,
  librarian/2026-08-30.md:763-768,829). Dwells: L010 5,099 min, L011 4.2, L013 1,234, L017 42.5, L018 29.7; the record itself
  says "the five stalls are not one phenomenon" (librarian/2026-08-30.md:829). One root over unlike stalls is what it warned against.
- **P-BATON-WAKE, 09-03:** absent that day, a handback by pane K exists later. No later baton stall of that exact shape is in
  R07's rows after 09-16 except L0294 (50 min). I did not open its result [inferred].
- **The NEXT-trailer gate, 09-16** ("each seat tells the next where to hand it"). Live checks G1, G2, G4, G5 passed on 09-16
  (librarian/2026-09-16.md, entries 13:16 and 17:41), including the station-less NEXT line that preceded the 82-minute stall,
  so on that recorded shape the fix worked. After the light switch (10-09), 1,335 would-refuse rings were delivered, chair
  compliance went 153/340, 169/397, 1/30, and the note goes to the receiver, not the sender (L0364, L0593; trailer.rs:286-287
  as quoted by O) [read: ledger, O handback]. The fix worked on the case, then lost its force in a mode change: that is R03
  and the gates-mode setting, not a missing consumer.
- **ferry-watch after dream-watch** (L1120, L0050): dream-watch printed one unactionable line each turn for 27 days; its
  successor printed "Route the OBJECT" for hours and 84 of 109 artifact commits were never ferried
  (consonance/hooks/ferry-watch.js:10-13; hooks/dispatch-gate.js:3-7) [read via ledger]. A line to a consumer was skipped twice.
- **Pulse STALE and HANDBACKS IN lines:** fired 4,577 and 761 times, 0 acted (L0590, L0591); O's ruling: noise, retire. The
  wake-path fix (a WORK turn) was recommended and "nothing has moved" on 11-03 [read: room_value_result_2026-11-03.md].
- **L0615, L0959, L0415:** weekly census and open-items runs "never scheduled"; registered falsifiers "due and unscored"; the
  H3 score never taken [read: ledger]. These are promises with no consumer, instances of R07's wording. They show the room
  has built such consumers and let them lapse, so a new one does not by itself stick.
- **The 11-12 fix owed, then built late:** "Fix, for good" in stall_trace_lockbn_cmd_c_mangled_2026-11-12.md was owed with no
  owner and came back on 11-13 [read via adversary_R04.md; I did not reopen the trace].

## What survives my attack

- A narrow core is real and testable: an owed seat gets a work turn, and a baton or stage row that names a receiver gets a
  wake after N minutes. L0591, L0143/L0144, L0240, L1027, L0068/L0074 are cases to replay [ours].
- The keeper caught the stage-end stalls again and again (L0068, L0076 to L0079, L0143, L0240, L0241, L0412), so the human
  is the consumer of last resort in the record. That count comes from reading the "who caught it" fields, not a script [inferred].

## What I did not open

- handback/p-baton-wake_2026-09-03.md and the P-BATON-WAKE result; whether the 11-03 idle-gap fix was built.
- stalled_lap_detector_2026-08-29.md beyond its first lines; trailer_gate_census_2026-09-27.md beyond section 1.
- librarian/2026-10-09.md (why the gates went to light mode); the hook and trailer.rs source.
- The scorers' files for R07 (none exist yet in the directory) and every ledger row outside R07's id list.
- Any transcript or data jsonl; all fire counts are the ledger's and O's, not rechecked.
