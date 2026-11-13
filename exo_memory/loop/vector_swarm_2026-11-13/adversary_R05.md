# Adversary on R05: "a send, hold or stop has no receipt and does not bind" (Sonnet, 2026-11-13)

Marks: [read] I opened it, with path:line; [inferred] mine; [ours] a proposal. Counts below were derived by a node script
over 00_roots.md and 00_ledger.md run on D, 2026-11-13, unless marked [inferred]. The sorting of rows into kinds is my
reading of each row's own text, and I say so where it matters.

Read whole: plan_vector_swarm_2026-11-13.md, 00_roots.md, the 79 ledger rows that R05's groups claim (printed by script), and
the primaries named in the sections below. Not read whole: the other 1,044 ledger rows, the four roots_g files.

## 0. What R05 claims, in numbers

- R05 is proposed by g2, g3 and g4; g1 did not propose it [read: 00_roots.md:71]. Union of the three groups' id lists: 79 rows
  of 1,123 (7.0%); in all three groups 21, in two 21, in one 37 [read: script].
- 56 of the 79 are also claimed by another root; only 23 are claimed by R05 alone [read: script]. Overlap: R02 44, R04 30,
  R07 13, R06 6, R10 5, R03 3, R01 2.
- Cost the statement quotes: queue wait "median 208-230 s, max 16,543 s" [read: 00_roots.md:69]. The primary says the
  second reader did NOT reproduce the median (it got 230 s by another pairing; 208 s has no script on disk); p90 and max
  reproduced [read: room_better_2026-11-13/in_delivery.md:136-140]. The L-machine median in the same file is 140 s, n 67,
  max 2,119 s, and it is behind `stamp=working` only [read: in_delivery.md:136-137].

## 1. Is it a symptom of another root on the list? Partly, and the part that is not is small

Ask "what produces this?" for each kind of row R05 claims. I sorted the 79 into six kinds by each row's own text
[inferred: my reading; the ids are exact, the sorting is mine]:

| Kind | n | Ledger ids | What produces it |
|---|---|---|---|
| A. An order (hold, stop, correction) reached a working pane after the work it was about | 13 | L0270 L0621 L0683 L0875 L0916 L0917 L0935 L0943 L0944 L1008 L1058 L1081 L1114 | the queue (see below) AND, in 5 of 13, the order itself |
| B. Delivery mechanics: queue wait, forced at 240 s, composer text, no landing note, STALE hold | 19 | L0001 L0002 L0003 L0115 L0132 L0175 L0183 L0184 L0202 L0235 L0245 L0258 L0288 L0292 L0293 L0412 L0418 L0538 L1092 | the single FIFO queue; mostly 09-02 to 09-23, before D415 (10-19) |
| C. A pane or the vendor returned an error | 7 | L0004 L0009 L0218 L0623 L0971 L0972 L1079 | an edge 403 under a burst of calls, no StopFailure hook, a digest line that hid it |
| D. Nobody was woken, or nobody owned the next step | 13 | L0143 L0144 L0239 L0240 L0241 L0242 L0254 L0294 L0303 L0304 L0563 L0698 L0816 | R07 (no consumer, no wake path), a crash, a blocked AskUserQuestion |
| E. A gate refused a seat out of turn | 10 | L0046 L0114 L0129 L0131 L0133 L0134 L0149 L0150 L0176 L0196 | the baton gate's design, 09-02 to 09-09, since reworked |
| F. Not about sending at all | 17 | L0262 L0289 L0290 L0301 L0246 L0248 L0457 L0729 L0822 L0823 L0866 L0948 L0962 L1004 L1007 L1019 L1031 | R01, R10, R03, R04, a source that returned 403, keeper messages spliced in a box |

Counts check: 13+19+7+13+10+17 = 79; every id assigned once [read: script, no unassigned, no duplicates].

What this shows, with evidence:

1. **The rows that fit the statement are 13 of 1,123, 1.2% [read: script].** Kind A is the only kind where a hold or stop
   "arrives after the work". Kinds C to F are other faults that were swept in because each touches a message.
2. **Kind A is itself duplicated.** L0916, L0917 and L0943 are one event: the stop for L177 sent 09:09:02Z, held 604 s,
   reached C at 09:19:06Z [read: handback/p-l177-lean-lead-C_2026-11-12.md:5-6; librarian/2026-11-12.md:90]. L1058 and L1081
   are one event: the hold sent 14:53Z, reached E 15:12Z, 1151 s [read: handback/p-l199-voice-ingame-E_2026-11-13.md:136-142;
   librarian/2026-11-13.md:407]. L1008 cites the same line :407 and the keeper's "the 4." [read: ledger row L1008], so it is
   probably the same event [inferred]. Folded: 13 rows are about 9 events [inferred].
3. **In 5 of the 13 the order was itself the fault, so the queue only delayed a wrong order.**
   - L0916/L0917/L0943: L177's plan was "my own idea and from no source"; the keeper's item 152 asked for research first
     [read: librarian/2026-11-12.md:77-83]. That is R10/R01 upstream of the stop.
   - L1008/L1058/L1081: the hold was the librarian's over-reading of his 08:51 word; he lifted it at 09:25 with "we need to
     use our usage man" and said of the lateness "its more my fault there" [read: briefs/lighthouse_the_room.md:97-98,
     :107-108; ledger row L1007]. A hold that bound, sent on that reading, would have idled E and the other panes by
     design; the recorded idle of about 34 minutes (L1007) is what a binding hold causes when the order is wrong.
   So "bind the order" makes a wrong order cost more. R05 does not say how a seat tells which orders deserve to bind.
4. **Upstream of kind A, on the list, is nothing; upstream of kind A, off the list, is the queue.** A working pane takes one
   turn at a time and a message waits behind it (`main.rs:11645`, "any packet behind a long turn waits as long as the turn"
   [read: in_delivery.md:136]). That is a property of how the panes run, not a root R01 to R10 states. The room named the
   missing remedy twice: an interrupt (`loop/interrupt_gate_gap_2026-09-09.md`) and a cancel key
   (`loop/chair_cancel_dispatch_idea_2026-09-17.md`, "not built") [read: both files]. `grep -c chair_cancel
   consonance/src-tauri/src/main.rs` returns 0 [read: command run].
5. **Kinds B, D, E are symptoms of other roots or of closed designs.** Kind D is R07's mechanism by R07's own ids (13
   overlap) and R04's adversary already moved the stall rows there [read: adversary_R04.md:53-55, :90]. Kind E is the baton
   gate; K's pane found it on 09-03 [read: ledger rows L0149, L0150] and the room has changed the gate since [inferred:
   no REFUSED OUT OF TURN row in the 11-xx rows R05 claims]. Kind B is mostly dated before 10-19; of R05's 79 rows, 33 are
   dated 10-19 or later [read: script], and 11 of those 33 are kind A.
6. **R05 is the upstream of R02's rows, not the reverse:** adversary_R02 already argued R02 is "the other side was not
   asked" laid over R03, R05, R04 [read: adversary_R02.md:32-37]. I agree on the direction. That helps R05 and does not
   change the count in point 1.

## 2. Ledger rows its proposers claim that it does not explain (primaries opened)

- **L0948** (C stopped at step 1 of L190). Claimed under R05 for "the packet was delivered 15 min after it was sent". The
  hand-back says the stop was because no readable source gives arm swing against speed: preprints.org returned 403 and the
  two papers read give one speed or no figure [read: handback/p-l190-arms-C_2026-11-12.md:1-31]. The 15 minutes is not the
  cause. Not explained by R05.
- **L0457** ("D481: the cause was fitWithHold"). The row's text is a commit subject about a fit function [read: ledger row].
  It entered R05 by the word "hold". Not explained.
- **L0866** (heavy.cpus profile, harness control could not go green on D). It is R03; R05 gets it only through the clause
  "the relayed hold had no mechanism to bind until D663" [read: ledger row L0866]. The row's fault is two tests reading D's
  own profile [read: handback/p-d663-hold-E_2026-11-11.md:50-58 via the ledger row].
- **L0822, L0823, L1019, L1031.** His own message arrived cut off with a pane's ring pasted into the same input box. That
  is two writers on one box, the keeper's text spliced, not a missing receipt and not a hold that failed to bind [read:
  ledger rows; the primaries dz2.md were not opened by me].
- **L0262, L0290, L0301** are a seat's unchecked reading (R01). **L0301** is the 09-24 "3 h 17 m delivery stall" that was
  the seat's own question blocking its turn; the ledger and the room_better table both mark it not a delivery fault [read:
  in_delivery.md:176, the 09-24 row].
- **L0538** shows the opposite of "no receipt": the pulse printed "delivery-unconfirmed" for 31 dispatches and O found 32 of
  32 had arrived; 2,504 such fires since 10-20 [read: ledger row L0538]. A receipt-like signal already exists and mostly
  lies. More of the same adds alarms.
- **L0971/L0972 (the 403 bursts).** A packet reached a pane and the pane answered with an API error. The trace's own
  inferred cause is a burst of calls in the same seconds, an edge block that "lifts by itself within minutes" [read:
  loop/stall_trace_403_packets_eaten_2026-11-13.md:37-43, via second reader]. A receipt would say "delivered" and be true;
  the delivery was not what failed. What is missing is that a turn ended on an error is not read as not done. That is
  closer to R02 (a done-state read from the wrong side) and to the pane-health stamp, not to R05's "queue and binding".
- **The expensive rows are not R05's.** The recorded waits of an hour or more among the 79: L0143 8 h 57 m, L0144 9 h,
  L0184 72 m, L0235 about 100 m, L0239 82 m, L0240 81 m, L0241 4 h 24 m, L0245 about 3.6 h, L0303 3 h 28 m, L0304 4 h 26 m,
  L0563 10 h 34 m [read: ledger rows]. Every one is kind B or D or a crash. Their sum is about 46 h by the rows' own figures;
  with L0143/L0144 as one event and L0241 disputed (the second reader found the chair waited on an event elsewhere,
  in_stalls.md:246 via 00_build_paths.md:81-84), about 33 h [inferred sum]. The recorded figures for kind A, added:
  604 s, 700-880 s, 1151 s, 29 to 49 min, 15 min, about 3 min, about 4 min come to about 2 h [inferred sum]. So by recorded
  cost, R05's own core is about 6% of what its list carries.
- **And the cost of the core is often small by the primaries.** L0683: C "built to the newer", no rework recorded [read:
  handback/p-l139-C_2026-11-05.md:89]. L1058: the branch is local, unlanded, "nothing is reverted unless he says so" [read:
  p-l199-voice-ingame-E_2026-11-13.md:151-153]. L0917: a build kept as a measuring stick (+0.60 s lean lag)
  [read: librarian/2026-11-12.md:88]. The costly kind-A rows are L0944 (stride rework, 29 to 49 min late) and L0943 (a merge
  undone with `reset --keep`, nothing pushed) [read: handback files named in the ledger].

## 3. Could a fix be shown to work on a recorded case, or is it too broad to test?

R05 states two fixes in one sentence, and they test differently.

- **The receipt half ("the sender is told when it was read or acted on").** Proposed in room_better 00_build_paths Part 1 as
  a three-step fix. Its second reader found step 1 "covers neither recorded case as written": on 09-16 there was no
  DELIVERED row (a door delivery to the librarian) and the waiting seat was a third seat; on 11-13 each receiver's next line
  WAS a line, the API error [read: 00_build_paths.md:92-100]. Its proving fixture "is not the 09-16 case and would pass a
  clause that misses it" [read: 00_build_paths.md:110-113]. Also the 11-13 L board rows are not on D (D's board has 0 rows
  between 11-12T21Z and 11-13T14Z) [read: 00_build_paths.md:88-89]. **Test named: none that runs on a recorded case today.**
  A receipt also cannot change kind A: telling the sender at minute 10 that an order landed does not undo the build.
- **The bind half ("a hold or stop binds what the receiver's next command checks").** Two shapes exist.
  - A resource gate: D663's exclusive heavy-run hold, built and green (92 of 92 mutants, 96/96 rows; red first, 10 of 12
    new rows red on main) [read: handback/p-d663-hold-E_2026-11-11.md:5-10, :56-60]. It binds runs and builds, not edits or
    commits. It would not have stopped E's commit in L1081 or C's merge in L0943.
  - An interrupt (Escape on the pane). Not built (point 1.4). Its own note says Escape "does not undo files the pane already
    wrote" and must be measured at source first [read: chair_cancel_dispatch_idea_2026-09-17.md, design point 2]. A test on
    a recorded case needs L's board rows, which are absent on D. The nearest replayable case is the packet-side
    handbacks' own timestamps (L0917: 09:09:02Z sent, built before 09:19:06Z); a fixture could feed those, but then it tests
    the fixture's picture of the queue, the failure the room keeps finding (R03).
- **The 403 piece has a test.** The trace gives one: feed a pane reply "Please run /login · API Error: 403" after a
  delivery and require "not acted on, redelivery pending" then exactly one redelivery [read: 00_build_paths.md:117-119, citing
  the trace :31]. It runs on a recorded case. It belongs to R02/pane-health more than to R05 (section 2).

So as stated R05 is one sentence over a receipt (no recorded case), a resource gate (built, narrow), an interrupt (unbuilt,
no replayable case on D) and an error-turn rule (testable, but a different fault). That is the "too broad" finding.

## 4. Has the room tried a fix of this kind, and how did it end

All [read] unless marked.

- **240-second forced delivery** (Sept). It made deliveries land, then 26 of 43 dispatches were forced (60%), "about 3.6 h
  of a 5-h chair shift idle" (L0245, librarian/2026-09-16.md:77). The cause of the forcing was found 09-19: a dim prompt
  suggestion read as typed text (L0258, map/M.md:924,929). Ended by finding the detector wrong, not by a receipt.
- **The withdraw directive** (L065 D1, 09-20): built; a message can cancel queued messages in the target's queue, fail-closed
  on the count [read: consonance/src-tauri/src/main.rs:13966-13990]. It cancels what is queued; it cannot stop a turn running.
  The 11-12 stop (L0917) and 11-13 hold (L1058) were stops of running work.
- **Interrupt carve-out with no mechanism** (09-09, loop/interrupt_gate_gap_2026-09-09.md) and **the chair's Escape key**
  (09-17, chair_cancel_dispatch_idea_2026-09-17.md, "not built"). Named twice, with its falsifier written. Not built:
  `chair_cancel` has 0 hits in main.rs [read: command run]. So the fix of the bind kind has been on the shelf 55 days.
- **D415, delivery must submit** (10-19): built and tested for the door; never extended to the drain, whose row reports NOT
  SUBMITTED but no render [read: in_delivery.md:133-135; adversary_R02.md section 4].
- **A pure duration alarm was refused** ("SIX MINUTES OF ALARM OVER A CORRECT STATE", chain-status.js:260) and clause 4 now
  prints a QUEUED wait over 3 minutes [read: chain-status.js:252-262; 00_build_paths.md:258-261].
- **The room's own count against a carrier fix:** D307 census of where wrong beliefs began, n 42: PROXY 14, RING 14, INFER 5,
  DIGEST 4, "no dominant origin" [read via adversary_R02.md section 4, citing loop/plan_belief_origin_d307_2026-10-12.md:33-34].
  That is a count of wrong beliefs, not of the ledger, so it bears on R02 and only a little on R05.
- **The 11-13 swarm's own result:** the delivery fix ranked first by 4 h 24 m was a different fault, and its step 1 could not be
  built as written [read: 00_build_paths.md:81-100; plan_vector_swarm_2026-11-13.md:11-12]. R05 is that same section's
  descendant, now widened. The plan registered that this exact thing must not repeat.

## 5. What survives the attack (two lines)

Kind A is real, it recurs (09-20, 11-05, 11-11, 11-12 twice, 11-13 twice), each case has a sender timestamp and a receiver
timestamp on disk, and the interrupt that would bind a stop has been named and never built. The 403 not-acted-on rule is a
testable fix on a recorded case, and R02's and R04's adversaries both placed their non-matching rows under R05 [read:
adversary_R02.md:32-33; adversary_R04.md:53-57], so it is a strong upstream for the delivery stalls, if the root is narrowed.

## Verdict (one line)

TOO BROAD TO TEST: R05 joins a receipt (the second reader found it covers neither recorded case), a binding stop (an unbuilt
interrupt, no replayable case on D) and an error-turn rule, and only 13 of its 79 rows (about 9 events, about 2 h of recorded
cost) fit its own statement.

## What I did not open

- The other 1,044 ledger rows; I took the 79 R05 rows from the merged ledger text and opened only the primaries named above.
- The four roots_g files; I used 00_roots.md's merged id lists as extracted.
- dz2.md (rows L0822, L0823, L1019, L1031) and board.jsonl; no figure here comes from a transcript or the board.
- stall_trace_403_packets_eaten_2026-11-13.md itself; I used the second reader's quotes of it in 00_build_paths.md.
- librarian/2026-09-16.md, map/M.md and the L-machine handbacks other than the five named; those rows are taken from the ledger.
- Whether the 13-row sorting is right in every case; it is my reading of one-line rows. The 79 and the 56/23 overlap are scripted.
- Whether any seat has since used the `withdraw` directive on a running pane's queue; D's board has no 11-12/11-13 L rows.
