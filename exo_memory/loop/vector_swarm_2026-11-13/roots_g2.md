# Roots, group 2: where the time and tokens went, and when anyone could first have seen it (Sonnet research agent, 2026-11-13)

Way in: for each row of `00_ledger.md` I asked where the TIME or TOKENS went and what was the first moment the loss could
have been seen by anyone or anything. [read] I read every row of the ledger (L0001 to L1123) in the file
`exo_memory/loop/vector_swarm_2026-11-13/00_ledger.md`. Rows marked REMOVE (L0029 and the others so marked) are skipped.
Id lists below are my own placing by reading [inferred]; I did not count them with a command, so every count is [inferred].
Costs I lean on are the ledger's own: L0563 10 h 34 min, L0525 about 8 h, L0241 4 h 24 m (the ledger notes it is another
fault than a delivery stall, see L1103), L0303 3 h 28 m, L0982 99 min 40 s, L0970 about 30 min, L0010 42,128,568 tokens,
L1093 5,922,308 + 2,049,358 tokens, L0371 18,088,314 tokens. All [read] in the rows named.

Three patterns I saw before naming roots, [inferred]:
- The biggest recorded minutes are WAITS (a queue, a lock, a holder, a hold that arrives late), not wrong work.
- The biggest recorded tokens are CARRY (whole conversations rewritten on wake or ping), and they were counted weeks later
  from transcripts, not at the moment they were spent (L0010 "0 since 11-01", L0469, L0898, L0899).
- A large share of the "wrong" rows were seen at the next reading of the source, one turn later, by a person or a pane. The
  loss there is small per row and large in number.

## Root 1: A slot, a lock or a queue is trusted to be held by something alive and moving, and nothing measures movement

Statement. A holder of a shared slot (heavy-run lock, memory gate, composer, the baton, a lap row, a delivery queue) is read
as present or absent, and nothing reads whether the holder is making progress, so a wait runs until a person looks.
Mechanism. Detectors answer "is there a holder?" (a lock file, a stamp, an owed line), which stays true for a dead pid, an
idle `cmd.exe`, an orphaned grep, a seat whose process exited, a seat blocked on its own question. The first moment the loss
could be seen is the first minute the holder stopped moving (L0912 cmd idle with the lock; L0563 pane B exited at 02:20:30Z
and the board first saw it at 12:54:41Z). Alarms that fire on presence fire for hours and are skipped (L0239 345 prints,
L0591 761 fires, L0590 4,577 fires, L0592 183 false fires), so the alarm itself adds no signal.
Ledger ids I claim it would have prevented [inferred]:
L0002, L0011, L0068, L0074, L0075, L0076, L0077, L0078, L0079, L0111, L0115, L0133, L0134, L0143, L0144, L0184, L0196,
L0235, L0239, L0240, L0241, L0245, L0254, L0288, L0289, L0290, L0292, L0293, L0294, L0298, L0303, L0304, L0311, L0314,
L0316, L0345, L0418, L0525, L0537, L0540, L0563, L0571, L0576, L0577, L0579, L0590, L0591, L0592, L0609, L0623, L0698,
L0710, L0745, L0799, L0804, L0849, L0857, L0862, L0863, L0872, L0912, L0941, L0951, L0966, L0967, L0968, L0969, L0970,
L0971, L0972, L0973, L0974, L0975, L0976, L0977, L0978, L0979, L0980, L0981, L0982, L0983, L0984, L1055, L1061, L1065,
L1079, L1109.
Fix kind. Every wait carries an owner and a clock, and a holder is released or named when its own work (cpu, output, child
exit) stops moving for a stated time, with the cause printed in the refusal.
One recorded case where a fix could fail today and pass after: L0970. An orphaned grep (parent gone, 6.3 GB commit) held
the landing train at the memory gate about 30 min; the gate message printed the tail and hid the cause. Fixture: the three
processes named in the row plus a dead parent; the gate must name the pid and command line that holds the headroom, and
must treat a holder with no live parent as releasable. Fails today (it printed "Memory Compression, Discord, claude").

## Root 2: A figure, time, sha, count or line citation enters the record from the writer's head, with no command at the moment of writing

Statement. Values that look like measurements (clock times, shas, counts, line numbers, "the file says") are typed by hand
or taken from an earlier relay, and the record keeps them as if measured.
Mechanism. The writer has the source one command away and writes from memory, a summary, a cut read, or a neighbouring
fact. The first moment it could be seen is the moment of writing (a hex string that resolves to no object, a clock stamp
ahead of the clock, a count that differs from one run of the instrument); the actual catch comes one turn to several days
later and costs a ruling, a dispatch built on the wrong premise, or a correction round (L0301, L0197, L0587, L0801).
Ledger ids I claim it would have prevented [inferred]:
L0033, L0034, L0036, L0049, L0059, L0066, L0071, L0081, L0083, L0084, L0087, L0097, L0105, L0116, L0118, L0121, L0153,
L0160, L0170, L0171, L0174, L0190, L0197, L0198, L0199, L0200, L0203, L0206, L0208, L0209, L0214, L0225, L0250, L0262,
L0264, L0295, L0301, L0307, L0413, L0485, L0489, L0507, L0531, L0532, L0566, L0568, L0572, L0584, L0586, L0587, L0588,
L0643, L0657, L0663, L0699, L0709, L0728, L0754, L0775, L0779, L0814, L0846, L0851, L0861, L0867, L0868, L0869, L0883,
L0897, L0903, L0904, L0905, L0911, L0924, L0927, L0930, L0939, L0945, L0947, L0985, L0986, L0990, L0997, L1002, L1009,
L1010, L1011, L1017, L1023, L1043, L1049, L1062, L1066, L1070, L1075, L1076, L1098, L1099, L1100, L1101, L1103, L1106,
L1107, L1111, L1118, L1119.
Fix kind. A write-time step that fills clock times and checks every sha, count and line cite against a command's output
(or marks it hand-made), in the same call that writes the note, hand-back or ring.
One recorded case: L0814. D665 s1 hand-back committed nine sha256 prefixes (9a672e35 and eight more) that were "not copied
from any command; none was real". Fixture: that commit's text. A check that requires each hex id to resolve (cat-file or
sha256 of a named file) fails today and passes after the printed values replace them. [read] row text; the check is [ours].
Note. This is the stand-in candidate the plan holds, narrowed to the writer's side; I did not find it explains the rows
where the stand-in is a tool's output (see Root 3), so I kept those apart.

## Root 3: A guard or test is called working because it passed against its author's model, and no run on a recorded real case is required first

Statement. A test, mutation score, gate or meter is accepted as live on its own fixtures, and its first run on real data is
the first moment it can fail.
Mechanism. The author builds the instrument and its fixtures from the same picture, mutants check the picture, and the
instrument ships. Real inputs differ (a child exit inside the window, a CRLF file, a drive letter, a path under another
shell, a population the filter never matches). The first moment the loss could be seen is the first run on one recorded
real case, which nobody is required to make; instead it is seen by the keeper's eye or by the next landing.
Ledger ids I claim it would have prevented [inferred]:
L0012, L0058, L0065, L0085, L0138, L0145, L0151, L0165, L0168, L0176, L0178, L0180, L0182, L0188, L0195, L0215, L0243,
L0258, L0259, L0260, L0261, L0266, L0267, L0284, L0286, L0302, L0309, L0310, L0330, L0360, L0380, L0382, L0383, L0388,
L0402, L0508, L0510, L0511, L0518, L0520, L0524, L0527, L0539, L0561, L0562, L0564, L0573, L0578, L0596, L0597, L0637,
L0662, L0665, L0668, L0675, L0749, L0782, L0838, L0839, L0858, L0866, L0884, L0888, L0914, L0956, L1015, L1037, L1042,
L1050, L1051, L1064, L1078, L1115.
Fix kind. An instrument counts as live only after it has been run once on a named recorded case and has produced the answer
that case is known to have (a positive control), kept beside the instrument.
One recorded case: L1064 with L1015. The idle-holder guard passed 101 tests and 73 mutants (or 97 of 97), then posted two
false "idle" lines with negative CPU figures (-47.67 s, -504.44 s) for working holders; "no row had a child exit inside the
window". Fixture: the board window 15:34Z to 17:54Z (L1109, 13 IDLE HOLDER rows). The guard must not name a working holder
idle on that window. Fails today (it posted), passes once the case is in the control. [read] rows; fixture choice [ours].

## Root 4: "Landed", "installed", "pushed" or "delivered" is reported from the sender's side, and the target is not asked what it now holds

Statement. Done is declared on the evidence at the writing end (a commit, an install order, a stamp, a green on source) and
the thing the next user touches is never read back.
Mechanism. Installed hooks are older than their source (L1088: 10 DRIFT and 3 ABSENT on D, 15 and 8 on L), an exe from a
past tag is run as the new one (L0448), a fetch cut at 20 s leaves the shelf on the old tree while the seat pulls 58 s later
(L1005), a gate scans a name not the sha pushed (L0746), a hand-back carries an in-flight commit. The first moment the loss
could be seen is the moment the sender writes "done", one read-back away; instead it is seen when a person drives the old
build (L0448 "still broken exactly the same", L0765 about 45 min on a wrong build) or when a later measurement measures the
wrong thing (L1088 "any wake measurement measures hooks that are not the repo's").
Ledger ids I claim it would have prevented [inferred]:
L0012, L0020, L0021, L0022, L0023, L0050, L0051, L0070, L0089, L0092, L0112, L0189, L0224, L0256, L0268, L0276, L0296,
L0355, L0421, L0448, L0463, L0464, L0472, L0487, L0544, L0565, L0575, L0613, L0627, L0648, L0654, L0655, L0670, L0696,
L0700, L0705, L0707, L0708, L0746, L0765, L0772, L0781, L0787, L0788, L0794, L0995, L0996, L1005, L1043, L1044,
L1079, L1085, L1086, L1087, L1088, L1089, L1096, L1097, L1121, L1122.
Fix kind. After any install, push, land or wake, the target is asked directly what it holds (version, sha, head), and the
word "done" is withheld until that answer matches the claim; the shape `close.js` already has after a push.
One recorded case: L0448. "Install 0.4.21" was ordered unchecked; the installed exe was the 10-24 build, so his test 10 ran
old code. Fixture: the installed exe's version against the ordered tag. A read-back of the installed version fails today
(old exe, "done" reported) and passes after the right exe is in place. [read] row; check [ours].

## Root 5: A stop, hold or cancel is sent as a message on the same queue as the work, and binds nothing the worker's next command checks

Statement. Control orders travel the slow path and are advisory, so the work they were meant to stop completes first.
Mechanism. A hold or stop is queued behind the receiver's turn (L1081: about 21 min, E had committed the step the hold said
to wait on; L1058: 1,151 s, the voice was built and handed back; L0917: 604 s; L0944: 29 to 49 min; L0943: stop at 09:09Z,
delivered 09:19Z, after a merge). The first moment the loss could be seen is the send time: the sender can read the receiver's
screen and the queue stamp at once but acts on "sent". A hold that is only text gives the receiving pane no mechanism to
refuse the next commit (L0866 "the relayed hold had no mechanism to bind until D663").
Ledger ids I claim it would have prevented [inferred]:
L0046, L0114, L0149, L0150, L0175, L0176, L0183, L0202, L0235, L0246, L0248, L0270, L0412, L0621, L0683, L0729, L0816,
L0822, L0823, L0866, L0875, L0917, L0935, L0943, L0944, L0948, L0962, L1004, L1007, L1008, L1019, L1031, L1058, L1081,
L1092, L1114.
Fix kind. A stop or hold is also written as a flag the worker's commit, build and run commands check, so it binds at the
next command, with the message only a notice.
One recorded case: L1081. The hold ring reached E after E had already committed the step it said waits. Fixture: the
send, arrival and commit times in the row. With a flag file that the commit step reads, the commit refuses and the case
passes; today it commits (fails). [read] row; mechanism [ours].

## Root 6: Whole conversations are carried and re-read on every wake, ping and compaction, and the cost of each event is not metered when it is spent

Statement. A seat's unit of carry is its full transcript, so every wake, keep-warm ping, resume on a different model, and
compaction rewrites or re-reads a very large context, and nobody sees the number until a transcript count weeks later.
Mechanism. Events that cause a cache write (idle compaction at 54.5 to 56.7 min, a ping woken by an echo of /effort, a
resume on another model, a manual reopen) have no per-event meter beside them; usage.js skipped transcripts over 512 MB
(L0562, about 93% of responses unlisted). The first moment the loss could be seen is the first wake that writes a big
context, with the tokens written already in the response metadata. The lost cost is large and measured late: L0010 84 calls
42,128,568 tokens; L0371 18,088,314; L0469 about 7,565M cache-read in 48 h; L1093 5.9 M then 2.0 M again.
Ledger ids I claim it would have prevented [inferred]:
L0010, L0016, L0024, L0025, L0048, L0095, L0100, L0101, L0102, L0201, L0226, L0251, L0252, L0257, L0263, L0326, L0334,
L0346, L0371, L0469, L0561, L0562, L0582, L0590, L0593, L0595, L0613, L0614, L0898, L0899, L1012, L1013, L1022, L1024,
L1093, L1094, L1095, L1096, L1097.
Fix kind. Each wake, ping and compaction writes the tokens it wrote beside its own row at the time, with a stated ceiling
that stops or asks above it, so a costly event is seen the minute it happens.
One recorded case: L1013. Keep-warm woke pane O after 13,722 idle minutes because activated_by_use counted a /effort echo;
8 of 11 cold pings had the same shape (642,636 tokens written for O). Fixture: O's transcript tail with the /effort echo.
The predicate must return "not used"; today it returns used (fails), after the fix it passes. [read] row; fixture [ours].

## Ledger ids I could not place under any root [inferred]

The rows below are real faults and none is upstream of a root above. I list them by kind, with the ids I am sure of; the
list is not exhaustive and I did not count it with a command.
- Seat-conduct rows about the keeper's words and the seat's own stance (deflation, base-rate, "No response requested",
  over-asking, misread meaning): L0014, L0031, L0336, L0343, L0369, L0370, L0393, L0394, L0395, L0396, L0450, L0451,
  L0452, L0454, L0598, L0599, L0600, L0603, L0645, L0653, L0724, L0733, L0738, L0761, L0793, L0817, L0824, L0825, L0826,
  L0827, L0919, L0928, L0952, L0953, L0954, L0989, L1034, L1073, L1074.
- Misreading the keeper's design words, or building on the wrong design premise: L0350, L0499, L0780, L0797, L0801,
  L0806, L0807, L0808, L0820, L0828, L0829, L0908, L0993, L1000, L1020, L1032, L1033, L1035.
- Geometry, physics, audio and game-design defects in the products (T-180, Dreamzone, Dreamride): L0323, L0433, L0473,
  L0481, L0504, L0505, L0506, L0512, L0513, L0514, L0515, L0517, L0519, L0521, L0533, L0549, L0550, L0630, L0652, L0656,
  L0658, L0674, L0802, L0803, L0805, L0809, L0830, L0847, L0848, L0849, L0864, L0922, L0925, L0926, L0998, L1003, L1014,
  L1016, L1018, L1029, L1038, L1039, L1052, L1056, L1113.
- External or machine events: L0236 (Windows Update restart), L0345 (PC crash; also listed under Root 1 for the lost
  restarts), L0725 (PC froze), L0104 (server 529), L0720 (laptop thermal), L0968 (low-memory reaper, cause of pressure not
  established; also under Root 1).
- Research-source misapplications (these could fall under Root 2 if the cite was written from memory; the rows do not say):
  L0991, L0992, L1112.
- Instrument and census findings that are rows of counts, not faults with a cost: L0005, L0006, L0009, L0017, L0018,
  L0026, L0027, L0028, L0067, L0052, L0287, L0328, L0333, L0386, L0387, L0428.

Overlap, stated plainly [inferred]: a row can sit under more than one root (L0176, L0235 under Root 1 and 5; L0613 under 4
and 6; L0866 under 3 and 5). Rows 849, L0345 and L0968 appear under Root 1 and in the unplaced list because the root
covers the wait they caused and not the event itself.

## What I did not open

- No primary under `exo_memory/` other than the plan and `00_ledger.md`; every row's cost, date and primary is as the
  ledger states it, and I did not re-derive any figure.
- Not the other group files in `vector_swarm_2026-11-13/` (blind rule), not the twelve `ledger_*.md` part files, not the
  board or transcripts, not any code.
- I did not count the id lists with a command; counts and membership are my placing by reading [inferred].
- I read the ledger's rows L0001 to L0147 in the first view and rows from L0148 on through a compact view that kept each
  row's id, date, machine, event text and cost, and left out the "who caught it" and "primary" fields; I did not read those
  two fields for rows L0148 to L1123.
- Root 5's fix shape and Root 3's positive-control shape are [ours]; I did not check that either can be built.
