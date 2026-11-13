# Adversary on R02: "a done-state is read off the sender's side and the target is not asked" (Sonnet, 2026-11-13)

Marks: [read] I opened it, with path:line; [inferred] mine; [ours] a proposal. Counts below were derived by a node script
over 00_roots.md and 00_ledger.md (run on D, 2026-11-13) unless marked [inferred]. A fault is an event, not a verdict.

Read whole: plan_vector_swarm_2026-11-13.md, 00_roots.md, the 236 ledger rows R02's proposers claim (opened by script, full
lines), plus the primaries named in sections 2 and 4.

## 0. Verdict

TOO BROAD TO TEST. Strongest reason: of the 236 ledger rows R02 claims, only 23 were claimed by all three groups, and about
19 of those 23 say one narrow thing (an installed copy older than the repo). The rest is a bag of five or more mechanisms
that a "read it back from the target" fix does not share a test with [inferred, from reading all 236 rows].

## 1. Is it a symptom? What produces it?

R02 is not one fault; it is two or three faults that a clerk merged (00_roots.md merge notes: "R02 merges group 1 Roots 1
and 2") [read: 00_roots.md, "Merge notes"]. Each half has an upstream root on the list.

Overlap, by script [read: command run]: of R02's 236 ids, 82 are also claimed by R03, 55 by R04, 44 by R05, 37 by R07,
22 by R06, 10 by R01. Only 43 ids are claimed by no other root. Seen from the other side: 44 of R05's 79 ids sit in R02,
and 37 of R07's 71.

- Half A, "installed copy older than the repo" (rows L0020 L0021 L0023 L0089 L0092 L0256 L0296 L0448 L0472 L0565 L0613 L0765
  L0996 L1044 L1079 L1085 L1086 L1087 L1088: 19 of the 23 all-three rows) [read: ledger rows]. What produces it: a landing is
  accepted without a run on the installed copy, on the machine and mode in use. That is R03's own statement, nearly word
  for word: "no run on one recorded real case, on the installed copy, machine and mode in use, is required first"
  [read: 00_roots.md R03]. Upstream root: R03. Rows that show it: L0089 (a gate "never live", the outcome column never
  wrote a row), L0377 (the shelf-budget build made on the strict walk; the room runs light), L0627 and L0702 (push gate wired
  nowhere on L) [read: ledger].
- Half B, "delivered / queued / held read as acted on" (L0001-L0004, L0046, L0175, L0176, L0683, L0935, L0943, L0944, L1058,
  L1081, L1092 and others). What produces it: the send has no receipt and does not bind. That is R05's statement
  [read: 00_roots.md R05]. Upstream root: R05. R05's own proposers (g2, g3, g4) put the same rows there.
- Half C, "held / idle / alive taken off the sender" (the lock rows, L0968-L0984 and the like). Upstream root: R04, which
  already says "records that someone holds it, not whether the holder is alive". R04 and R02 share 55 ids.

So R02 is "the other side was not asked" laid over R03, R05 and R04. Fix those three and Halves A, B and C are each
addressed in their own terms. Fix R02 as stated and you have a slogan, not a build [inferred].

## 2. Rows its proposers claim that it does NOT explain

I read the 43 rows claimed by R02 alone, and the 90 claimed rows that match none of my keyword filters
(install/hook, delivery/queue, lock/idle) [read: script]. Rows where the fault is not a done-state read off a sender:

- Product or code defects: L0012 (a top-level const redeclared a function; Main would not load), L0324 (autocrlf changed the
  fixtures), L0338 (UI laid under a scroll bar), L0405 (a close turned the window white; the cause was memory, found from his
  crash dumps, third_place/2026-10-16.md:5), L0406 (the seat's own Finish code laid a roll short), L0458 (a new sky he did
  not like), L0486 (a stray escaped quote), L0488 and L0491 (a first fix over a cap; a harness left three uncaught), L0522,
  L0559, L0560, L0654, L0655, L0707, L0878 (lamp sound and picture chose by different hashes).
- A reasoning slip with no target to ask: L0224 (WRONG 103, a struck form used on his read of a friend; the primary is a
  correction already on disk, librarian/2026-09-14.md:125) [read].
- A measured aggregate of a different class: L0376 (the census: gates caught 0 of 383, rules broken 47.6%)
  [read: map/M.md:987-993]. It says the dominant error is "a STATE not checked", which supports half B, but it is an
  aggregate, not an incident of a sender-side stamp.
- Hardware or media: L0231 (the stick's ledger.json corrupt, 512 bytes of the wrong file plus NUL fill, map/M.md:887)
  [read]. The close was checked after the write and the check found it, which is the R02 fix working, not R02's failure.
- Rules and knowledge not reaching a lane: L0148 (carrier-drift never green), L0414 and L0416 (brief omitted the harness
  test), L0432 (a branch green on its own checks turned main red): R03 or R09, not R02.

Count of rows I judge R02 does not explain: about 30 of the 43 rows it alone claims, plus about 20 in the 90-row residue
[inferred; I did not score each row].

How far the proposers agree [read: script]: 23 ids by all three groups, 24 by two, 189 by one. Group 1 claimed 126, group 2
claimed 60, group 3 claimed 120. A root where four rows in five rest on one group's reading is chosen by that group, not by
a shared count. The plan registers "the blind groups' top roots share nothing and the swarm reports one anyway" as the
failure [read: plan_vector_swarm_2026-11-13.md, "Registered before it runs"]. R02 shares 23 of 236, not nothing, but 10 percent.

## 3. Could a fix be shown to work on a recorded case?

Only a fix for one half, never for R02 as written.

- Half A (install drift) has a test: `dev/shell/install.ps1 -Check` lists DRIFT and ABSENT; red today on D (10 DRIFT, 3
  ABSENT) and on L (15 DRIFT, 9 ABSENT) [read: map/M.md:1030; ledger L1088]. A proving check: "-Check prints 0 DRIFT, 0
  ABSENT after the fix, and the L1079 digest case runs". But the instrument already exists, and the stall is that applying
  it is unsafe: "installing syncs all at once" (L1079), and a bare run on 09-07 re-registered hooks against a ruling (L0189,
  install.ps1:18-24) [read]. The open work is a one-entry install path (`-Only` exists since 09-08, map/M.md:1032) and a
  decision to run it, not a root cause.
- Half B (delivery) already has a built test: D415 added a composer check after the Enter, tests first, red then green
  [read: loop/plan_d415_delivery_submits_2026-10-19.md, "The fix" and "Tests first"]. What remains is a named gap: the
  drain's DELIVERED row has no render check [read: room_better_2026-11-13/00_build_paths.md:514, section 19]. That is a
  one-function test, not R02.
- Layers. "Ask the target" has no stopping point: delivered, rendered, submitted, read and acted on are five different
  answers, and a read-back at one layer passes while the next fails. L0004 (54 keep-warm MISSED rows, 47 "API Error"
  lines) and L0935 (packets out of order, up to 15 min late) are failures at layers D415's check does not see [read:
  ledger]. R02 does not say which layer to ask, so no single red-then-green check can be written for it [inferred].
- A test I would accept for R02 itself: pick ten past incidents, give each a read-back probe, count how many it would have
  caught before cost. No such count is on disk; 00_build_paths.md section 18 says the same of the collation check
  ("No such count exists") [read: 00_build_paths.md:490-500].

## 4. Has the room already tried a fix of this kind?

Yes, four times. None ended as "the root was fixed".

1. close.js asks the remote after a push; the plan names it as the one tool that does [read: plan, "One candidate"]. It
   fixed pushes. It did not stop L0271 ("close --check passed while a real close on L would have published L's ledger",
   librarian/2026-09-21.md:74) [read: ledger], where the check read the wrong thing.
2. "Landed is not shipped" was named for hooks three times by 08-31 (L0092) and filed in journals 08-17, 08-18, 08-22 and
   map/M.md:371 [read: grep, 11 files match]. The rule was written in August; L1085-L1088 are the same fault in November.
   A written rule did not stop it, and the instrument (-Check) did not run as a gate.
3. D307, the census of where a wrong carried belief began (n=42): PROXY 14, RING 14, INFER 5, DIGEST 4 [read:
   loop/plan_belief_origin_d307_2026-10-12.md:33]. Verdict there: "NO DOMINANT ORIGIN ... No carrier fix is supported by this
   measure, and nothing is built from it" (:34). R02 is PROXY plus RING under one name; the room's own count says they are
   two origins of equal weight, so one fix for both is not supported by that count. Caution: that census was of wrong
   beliefs, not of the 1,123-row ledger, so it bears on R02 but does not decide it [inferred].
4. D305, a claim check on a stated state: "DON'T BUILD", held-out catch 5 of 16 = 31.3% against a 40% bar [read:
   map/M.md:993, the 10-12 continuation line]. A check on what a sender says did not clear its bar. The same line records
   "presence of a figure is not evidence of a check".

D415 is the opposite case: a narrow target read-back that was built and tested. It worked for the door; it was never
extended to the drain, and the 11-13 delivery faults sit at a layer it does not cover.

## 5. What survives the attack (two lines)

The install-drift half is real, counted (19 of the 23 rows all three groups agree on) and testable today by -Check; it is
the best-evidenced single mechanism R02 touches. And "ask the target" is a sound design rule, behind close.js and D415,
worth keeping as a rule inside R03 and R05 rather than as a root.

## What I did not open

- Primaries behind the ledger rows beyond those named in sections 2 to 4; I took each row's text for the rest.
- The four roots_g files; I used 00_roots.md's merged id lists as extracted.
- Whether the groups' ledger ids are correct; I did not recount the 1,123 rows.
- Transcripts, data/*.jsonl and the board; no figure here comes from them.
- The "about 19" and "about 30 / 20" counts are my reading of rows, not a script verdict.
