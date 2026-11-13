# Roots, group 3 (way in: who or what caught each row, how late, what would an instrument need)

Research agent, Sonnet, blind to the other groups. Source: `00_ledger.md`, whole, 1,123 rows. Rows the second reader marked
REMOVE (L0029 L0162 L0255 L0299 L0300 L0390 L0409) are left out. The plan was read first, whole:
`exo_memory/loop/plan_vector_swarm_2026-11-13.md` [read].

## What the catcher column shows

A keyword count over the sixth field of every kept row (one node pass) [read: command output; rough, because the field is
free text]: keeper 217, a pane or named seat 463, an instrument/gate/test/harness/falsifier/count 153, the seat itself 150,
"not recorded" or nobody 26, other 107. Reading the rows, three shapes recur [inferred]:

- The catcher was a person or a later reader, and the fault had already left the seat (a wrong figure in a ring, a wrong
  status to the keeper, an all-clear). Lateness runs from minutes to days: L0068 80 min, L0143 8 h 57 m, L0241 4 h 24 m,
  L0525 about 8 h, L0563 10 h 34 m, L0340 29 days, L0398 16 days, L1120 27 days.
- The catcher was an instrument, but it spoke to nobody who acts (L0017, L0025, L0067, L0364, L0386, L0428, L0590 to
  L0593), or it was itself wrong on its first live window (L1015, L1064, L0985, L0986).
- The keeper saw it by eye or by silence (L0076 to L0079, L0288, L0289, L0304, L0443).

The question for each root: what would have to exist so an instrument, not a person, catches it before it leaves the seat.

## Root A: a claim of fact leaves the seat on a stand-in, and nothing at the point of utterance asks for the thing

[ours] Statement: a figure, time, sha, status or "no such thing" is written from a summary, a listing, memory, a hand count
or a cut read, and nothing checks it against the opened source before it reaches a ring, a hand-back or the keeper.

Mechanism [inferred]: the source is cheap to open but the claim is cheaper to type. The room has the rule (cite, do not
recollect; every number from one run) and instruments for it (sourced_ledger, sources-gate, reply-slot, second reader), but
they run after the fact, in shadow or warn mode, or on a sample (L0017 18.8% of turns unsourced; L0386 1,023 would-block
rows with zero blocked; L0428 2,468 warns; L0582 second reader flagged real errors in 8 of 80 rings, 2 never caught). So a
wrong claim is carried one hop and the next seat treats it as a premise (L0109, L0587, L0197, L1011).

Ledger ids it would have prevented [inferred, by reading each row]:
L0013 L0014 L0033 L0034 L0035 L0036 L0040 L0041 L0042 L0043 L0044 L0045 L0047 L0049 L0053 L0054 L0055 L0056 L0057 L0059
L0066 L0071 L0072 L0073 L0081 L0082 L0083 L0084 L0086 L0087 L0088 L0097 L0099 L0103 L0105 L0107 L0109 L0110 L0116 L0117
L0118 L0119 L0120 L0121 L0126 L0153 L0154 L0160 L0170 L0171 L0172 L0173 L0174 L0182 L0186 L0190 L0192 L0197 L0198 L0199
L0200 L0203 L0204 L0206 L0208 L0209 L0212 L0214 L0224 L0225 L0226 L0229 L0247 L0250 L0262 L0264 L0275 L0301 L0307 L0310
L0346 L0413 L0447 L0467 L0475 L0482 L0485 L0489 L0507 L0531 L0532 L0551 L0566 L0568 L0572 L0584 L0586 L0587 L0588 L0610
L0625 L0657 L0663 L0691 L0699 L0709 L0728 L0733 L0734 L0735 L0754 L0775 L0778 L0779 L0795 L0800 L0801 L0806 L0807 L0814
L0820 L0824 L0825 L0826 L0827 L0867 L0868 L0869 L0874 L0882 L0883 L0897 L0903 L0904 L0905 L0911 L0913 L0919 L0920 L0924
L0927 L0929 L0930 L0939 L0945 L0947 L0963 L0964 L0965 L0985 L0986 L0990 L0991 L0992 L0993 L0995 L0997 L1002 L1006 L1009
L1010 L1017 L1023 L1036 L1062 L1066 L1075 L1076 L1098 L1099 L1100 L1101 L1102 L1103 L1104 L1105 L1106 L1107 L1111 L1112
L1117 L1118 L1119.

Fix kind [ours]: a pre-send check that, for each figure, path, sha, time or negative claim in an outgoing ring or reply,
requires a matching tool result from the same turn, and blocks (not warns) when it is absent.

One recorded case that fails today and passes afterwards: L0209 (twin L0199), the 7,069-byte file whose digests carried no
function name. Replay the three seats' messages through the check. Today the bare hex strings pass and two false accusations
follow; after the fix a digest with no function word, or a "differs" claim with no run of the other function, is held.
Second case: L1006 (two handoffs read through a 260-character cut, then dispatched from).

Honest limit [inferred]: L0310 records that 18 of 23 wrong claims named nothing a check could touch, and L0309 that the
check-precedes-claim instrument was unusable on half its sample. A check keyed on "a token a command can touch" covers
only part of this root.

## Root B: a done-state is accepted on a proxy for the state (delivered, green, landed, installed, all-clear)

[ours] Statement: "delivered", "green", "landed", "installed", "held" and "all clear" are read off a stamp, a test, a
commit or a hand-back, not off the running thing, and the proxy can be true while the thing is not.

Mechanism [inferred]: the proxy is what the instrument can see. A DELIVERED stamp prints for text in a composer (L0418);
a suite is green while a guard is wrong (L1064: 101 tests and 73 mutants green, no row had a child exit in the window); a
gate is "live" while the installed copy is the 08-24 file (L0089); a fix is "landed" but its installed copy is older than
its source (L1087, L0971); a landing check passes vacuously (L0058, L0065). The room already holds the shape of the fix in
one tool: after a push, `consonance/tools/close.js` asks the remote what it holds (plan lines 39 to 42 [read]).

Ledger ids it would have prevented [inferred]:
L0012 L0020 L0021 L0022 L0023 L0058 L0065 L0089 L0092 L0112 L0124 L0145 L0146 L0148 L0151 L0156 L0164 L0165 L0168 L0176
L0177 L0178 L0180 L0194 L0195 L0206 L0207 L0215 L0231 L0237 L0256 L0258 L0259 L0264 L0265 L0267 L0271 L0276 L0277 L0296
L0302 L0324 L0325 L0327 L0330 L0338 L0345 L0348 L0358 L0360 L0377 L0405 L0406 L0414 L0416 L0417 L0418 L0421 L0422 L0432
L0444 L0448 L0458 L0460 L0464 L0471 L0472 L0486 L0488 L0491 L0508 L0511 L0518 L0522 L0527 L0528 L0544 L0559 L0560 L0565
L0575 L0578 L0613 L0627 L0637 L0648 L0665 L0668 L0675 L0696 L0702 L0713 L0742 L0746 L0762 L0765 L0838 L0839 L0858 L0878
L0880 L0884 L0888 L0914 L0956 L0971 L0996 L1015 L1043 L1044 L1064 L1079 L1080 L1085 L1086 L1087 L1088 L1089 L1091 L1116.

Fix kind [ours]: for each class of done-claim, one probe that asks the running thing (the remote, the installed hook, the
pane's composer, the live process) in the same call as the claim; plus a positive control, so a check that cannot fail is
seen to fail on a seeded fault.

One recorded case: L1087 and L0971. Board-digest fix a3cefeb9 is in the repo and not installed on D (installed copy
08-25) or on L. Today a "fixed" report passes. After the fix, the probe compares the installed hook's hash with the repo's
and the report is refused. Second case: L1064, the idle-holder guard, 101 tests green, wrong on its first live window with
negative CPU figures.

Overlap with Root A [inferred]: both are the stand-in shape the plan names. The difference is the object. A is a claim about
the world made by a seat; B is a claim about the system's own state made from an instrument's output. B's fix asks the
system; A's asks the source.

## Root C: a message, hold or stop is sent and nobody can tell when, whether, or in what order it was acted on

[ours] Statement: delivery is write-then-hope. The sender gets no receipt tied to the receiver's action, and the receiver
gets no age or sequence on what it reads, so a stale hold or a swallowed packet is acted on, or not acted on, silently.

Mechanism [inferred]: queued deliveries wait behind a working pane without bound (L0002: median 208 to 230 s, p90 924 s,
max 16,543 s); the stamp says delivered but the pane has not read it (L0418; the reverse in L0538, where 32 of 32 had
arrived while the pulse said unconfirmed); a pane whose last reply is an API error does not act on a packet and the digest
hides the error (L0971, L0972, L1079); holds and stops cross the work they were meant to stop (L0917, L0943, L1058, L1081,
L1114). The catcher is mostly the keeper, by silence (L0143, L0235, L0240, L0288, L0623), or the pane after the fact.

Ledger ids it would have prevented [inferred]:
L0001 L0002 L0003 L0004 L0009 L0046 L0114 L0115 L0129 L0131 L0132 L0133 L0134 L0143 L0144 L0149 L0150 L0175 L0183 L0196
L0202 L0235 L0239 L0240 L0241 L0242 L0246 L0254 L0262 L0270 L0288 L0289 L0292 L0293 L0294 L0301 L0303 L0304 L0418 L0538
L0623 L0683 L0698 L0875 L0916 L0917 L0935 L0943 L0944 L0948 L0971 L0972 L1008 L1058 L1079 L1081 L1092 L1114.

Fix kind [ours]: a receipt from the receiving pane after it reads (not after it is written), and an age plus a sequence
number on every hold, stop and ruling, so a pane drops a superseded one; an unanswered ring raises an owed row on a named seat.

One recorded case: L1058 (a hold sent 14:53Z reached pane E at 15:12Z after 1,151 s, by which time the voice was built and
handed back) or L0943 (a stop reached pane C after it had merged). Today the hold is acted on after the fact. After the
fix the pane sees it is superseded and the sender sees "not read at +60 s".

Known limit [inferred]: the plan says a second reader found the first swarm's delivery fix could not be built as written
(plan lines 9 to 12 [read]). The cause named here is the missing receipt, not that fix; the case should be checked before
it is trusted.

## Root D: shared single-machine resources are guarded by a cooperative lock keyed to one view, and nothing checks holder liveness

[ours] Statement: seats share one tree, one lock, one GPU, one memory budget and one clock; the guards depend on seats
cooperating and on the lock tool seeing the holder, so a holder that is idle, mangled, killed, orphaned or outside the view
stalls or spoils everyone.

Mechanism [inferred]: L0912 a mangled `cmd /c` held heavy-run.lock idle (6 min); L0966 the same stall returned, 40 min,
because "the fix for good" was never built; L0967 and L0970 an orphaned grep with a 16,000-wide repeat held 6.3 GB commit
and the gate printed the tail and hid the cause; L0968 a reaper killed a sweep and the wrapper went on; L1065 a bare-PID
`taskkill /T` killed another seat's exclusive timing session; L0799, L0804, L0951 and L1036 seats took a slot beside a
declared timing session. Catchers: the keeper's "why is Consonance laggy" (L0314), the librarian reading a process list, the
pane that was hurt. The idle-holder guard built for this was wrong live (L1015).

Ledger ids it would have prevented [inferred]:
L0011 L0113 L0155 L0193 L0289 L0291 L0314 L0316 L0319 L0345 L0348 L0383 L0400 L0420 L0443 L0482 L0483 L0525 L0569 L0571
L0577 L0579 L0666 L0669 L0676 L0685 L0710 L0716 L0720 L0725 L0768 L0783 L0799 L0804 L0810 L0843 L0844 L0857 L0862 L0863
L0872 L0912 L0951 L0966 L0967 L0968 L0969 L0970 L0973 L0974 L0975 L0976 L0977 L0978 L0979 L0980 L0981 L0982 L0983 L0984
L1015 L1036 L1041 L1055 L1061 L1065 L1109.

Fix kind [ours]: one owner of the lock that checks holder liveness (its child tree, its CPU over a window read from a clock)
and enforces a hold by mechanism (refuse to start), not by ring.

One recorded case: L0912 and L0966 (the same stall twice). Today it recurs for 6 then 40 min; after the fix the idle holder
is named and released inside a bound. L1015 shows the wrong way to do it: a guard that reads negative CPU is not a fix.

## Root E: what the seat knows lives in a window or an uncommitted tree, and the carrier across a gap is a summary

[ours] Statement: at a compaction, restart, machine change or seat change, the carrier is a summary or an untracked file,
so the keeper's words, open lists and finished hand-backs are lost or must be asked for again.

Mechanism [inferred]: L0551 and L0610, after one compaction 15 of 37 window items were lost and a push was ordered before
he tried the changes; L0024 and L0346, 5 of 1,759 corrections survive verbatim in 102 summaries; L0487 and L0705, 17
finished hand-backs sat untracked up to five days; L0788 and L0794, L's open list did not cross to D; L0629, the seat asked
what his message, held in D's tail, had already answered; L1005, the wake built the shelf from the old tree after a fetch
cut at 20 s. The catcher is the keeper ("the desktop left you everything"; "how did u miss") or a later reader.

Ledger ids it would have prevented [inferred]:
L0010 L0024 L0031 L0048 L0070 L0094 L0098 L0106 L0133 L0235 L0257 L0268 L0322 L0346 L0371 L0398 L0412 L0487 L0551 L0610
L0614 L0629 L0631 L0633 L0634 L0650 L0705 L0708 L0793 L0797 L0815 L0816 L0915 L0988 L1005 L1006 L1013 L1021 L1028 L1033
L1093 L1094.

Fix kind [ours]: a restore step that names, by path, the keeper's original messages and the open list and checks at wake
that they are in the window (a read of the carried file, not of its summary), plus a commit-or-warn on untracked hand-backs.

One recorded case: L0610 (a hand-counted compaction window: 15 of 37 lost). Today the loss is found by hand; after the fix a
wake check lists the 37 and fails on the 15.

## Root F (weaker, I think a symptom): instruments fire into a place no acting seat reads

[ours] Statement: a signal nobody acts on is paid for in tokens every turn and teaches seats to skip the channel.

Mechanism [inferred]: pulse STALE fired 4,577 times for 1 change, 0 acted on (L0590); "HANDBACKS IN, NOT COLLATED" 761 fires,
0 acted (L0591); the NEXT-trailer note went to the receiver, 935 notes, 0 acted (L0593); the state block 163 emissions, 0
acted (L0025); carrier-drift 1,982 silent red repeats (L0067); sources-gate 2,468 warns reached no seat (L0428); dream-watch
one line a turn for 27 days (L1120); the vantage reader left 70.7% of rows with no verdict (L0026).

Ledger ids it would have prevented [inferred]: L0004 L0005 L0006 L0017 L0018 L0025 L0026 L0027 L0028 L0050 L0051 L0067
L0239 L0254 L0326 L0328 L0333 L0334 L0352 L0355 L0364 L0386 L0387 L0428 L0538 L0582 L0583 L0590 L0591 L0592 L0593 L0609
L0615 L1084 L1120.

Fix kind [ours]: every signal names who acts on it and the expected next row; a signal with 0 acted-on rows over a window is
retired or rerouted.

One recorded case: L0239 (345 identical "lap older than ten minutes" pulse lines overnight, no station acted, 82 min).
Today it prints 345 times; after the fix it fires once to a named seat with an owed row.

Caution [inferred]: this root explains rows by what was not done with a signal. It sits partly under Root C (the receiver)
and Root B (the instrument was advisory). I rank it a symptom of C and B.

## Ledger ids I could not place under any root [inferred]

- Product and design faults found by the keeper's eye on T-180 or the game, where the cause is geometry or design and not
  the room: L0323 L0332 L0338 L0342 L0405 L0433 L0441 L0446 L0473 L0481 L0484 L0499 L0500 L0504 L0512 L0513 L0514 L0515
  L0516 L0519 L0521 L0549 L0550 L0654 L0655 L0660 L0661 L0684 L0697 L0706 L0707 L0731 L0732 L0764 L0769 L0770 L0774 L0809
  L0830 L0848 L0921 L0922 L0925 L0926 L1003 L1014 L1016 L1018 L1029 L1113.
- Third Place conduct rows (hedging, caution, base-rate deflection; a different mechanism, the reflex BOOT names):
  L0336 L0343 L0369 L0370 L0393 L0394 L0395 L0396 L0397 L0403 L0449 L0450 L0451 L0452 L0598 L0599 L0600 L0603 L0645 L0952
  L0953 L1034 L1073 L1074.
- Single-event machine or vendor faults: L0104 L0210 L0236.
- Usage-cost measurements that are costs, not faults: L0469 L0898 L0899.
- Rows too thin to place: L0007 L0008 L0021 L0183 L0270 L1121 L1122 L1123.

The lists overlap (A and B share about 25 ids; C and D about 8), and the counts above are by reading, not by command, so the
sum of list lengths is not a count of distinct rows.

## How the roots rank, from the catcher lens only [inferred]

A and B cover the most rows. C and D cover the rows with the longest recorded waits (hours: L0143, L0241, L0525, L0563).
E covers the rows where the keeper had to repeat himself. F is a symptom. The catcher view says the missing instrument is
mostly one thing: something that asks the live thing, at the moment of the claim, in the same call (A and B), plus an
acknowledgement that comes from the receiving end (C).

## What I did not open

- No primary source. I read the plan and `00_ledger.md` whole (1,231 lines) and nothing else, so every attribution of a
  row to a root is by the ledger's row text, not by the source it cites.
- The ledger's second reader estimates about 10% of rows are unreliable as written (commit-subject rows, AGG rows). I did
  not discount them. Several ids above rest on a commit subject only (L0446 L0457 L0475 L0903 L0904 L0963 L0964 L0965 L1112
  L1114 L1117 L1118).
- No other file in `vector_swarm_2026-11-13` (blind rule), apart from the ledger.
- No per-id score by command; the id lists are by my reading.
