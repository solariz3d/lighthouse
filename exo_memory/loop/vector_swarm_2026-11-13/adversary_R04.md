# Adversary on R04 (lock or gate records a holder, not whether it is alive and moving). Sonnet research agent, 2026-11-13

Marks: [read] I opened it and saw it, path:line; [inferred] mine; [ours] a proposal. Counts I derived with a node script over
`00_roots.md` and `00_ledger.md` are marked [read: script] but the keyword tests in them are crude, so they are [inferred] as
classifications. Sources I cite were read in whole lines.

## Verdict

SYMPTOM OF R09 (with R07 behind it) for the part that is truly liveness; the rest of R04's claim is a mix of other roots.
Single strongest reason: the only two recorded idle-holder cases have one upstream cause, `cmd /c` rewritten to `cmd C:/` by
Git Bash, and the librarian's own "fix for good" (set `MSYS_NO_PATHCONV=1` or use `cmd //c` in every wrapper) was owed and
never built, so it came back at seven times the length [read: `loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`, "Fix, for
good" and "The second time"].

## 1. What produces R04? Roots upstream of it

**1a. The idle holder is a downstream effect of a shell-launch hazard that has eight ledger rows.** [read: script, then each
row opened in `00_ledger.md`]
- L0842 (build.bat by relative name, 11-11), L0877 (`'build.bat' is not recognized`, 11-11), L0900 (same, B, 11-11), L0912
  (`cmd /c` became `cmd C:/`, 6 min, 11-12), L0933 (`cmd /c built nothing twice`, 11-12), L0956 (B's `.cmd` check used Git's
  find; "the `cmd C:/` stall was B's"), L0966 (the same stall again, 40 min, 11-13), L1080 (bare `call build.bat` under
  NoDefaultCurrentDirectoryInExePath=1, 11-13) [read].
- The 11-12 trace names the family itself: "the same family as B's 11-11 `'build.bat' is not recognized` false start, and E's L162
  note: `/c` was rewritten to a path by Git Bash" [read: stall_trace_lockbn_cmd_c_mangled_2026-11-12.md, Cause].
- The lock did what it was built to do in both cases (it held one heavy run). The hold became expensive only because the held
  child was a shell that never ran the build. Remove the mangling and neither idle hold happens [inferred, but the trace states
  the same: "Fix, for good" step 1 and its proving check].
- Who produces the mangling untouched: R09, "a fix or rule is filed where its finder sits" (R09 claims L0842 and L0877 and not
  L0912/L0966; R04 claims L0912 and L0966 and not L0842/L0877: the same family is split across two roots by the groups) [read:
  `00_roots.md` R04 and R09 id lists]. Behind R09, R07: the fix was "owed" with no owner and no deadline [read: same trace].

**1b. Most of R04's other rows are not about liveness; they are R05, R07 and R02.** See section 2.

**1c. The one liveness reader that was built was itself wrong on its first live window (R03 and R01 above it).** The idle-holder
guard (`l202-idle-guard` 901d3c39) went green on 101 of 101 rows, and 97 of 97 mutants caught, then named two working holders
idle, with CPU deltas of -47.67 s and -504.44 s, because the CPU sum shrinks when a child exits [read:
`librarian/2026-11-13.md:443`, the 10:36 entry]. P's fix (25b1dd17: 103 of 103, 98 of 98 mutants) records its own limit: a busy
tree of short children between two one-minute samples "is never seen... can read as idle", and "no row covers it" [read:
`librarian/2026-11-13.md:479`, the 11:53 entry]. So a fix to R04 inherits R03 (author fixtures stand in for the real case) and
adds a liveness reading that is itself a stand-in for work being done.

## 2. Which ledger rows R04's proposers claim that it does not explain

Union of the three groups' R04 lists is 121 ids (g2 87, g3 67, g4 60) [read: script]. Only 35 are in all three lists [read: script].
By a crude keyword test over the "what happened" field, 54 of 121 mention a lock, hold, gate, slot, pid, waiter, memory or
kill at all, and 16 use a liveness word (idle holder, dead lock, orphan, outlived, left running, mangled, kill, cmd.exe); the
count per group is 14 each [read: script; the classification is [inferred]]. 67 of 121 carry none of those words
[read: script]. Opened one by one, these are the ones I can show R04 does not explain:

- **Lap and baton stalls with no lock anywhere:** L0068 (lap died at WORKING, 80 min), L0075 to L0079 (collation failures and
  stalls by silence, up to 5,099 min dwell), L0143 (baton sat with the librarian 8 h 57 min, "nothing woke it"), L0196, L0235
  (chair window full, ~100 min of rings queued), L0239, L0240, L0245 (26 of 43 dispatches forced), L0254 [read: ledger rows].
  They are a missing consumer or a stage end with nobody woken: R07; and a queue that gives no receipt: R05. The "holder" in
  them is a seat, not a lock; a liveness read on a lock changes nothing there.
- **Queued rings behind a busy seat (R05):** L0288, L0293, L0294, L0418 (a ring unsubmitted in a composer 38 min), L0623 [read].
- **The 403 and API-error rows (L0971, L0972):** a packet delivered to a pane whose last reply is an error is not acted on;
  the digest hid the error (also L1079). That is delivery and a hidden state in a digest (R05, R06) [read: ledger].
- **Waits where the holder was alive and working:** L0974 (E waited on A's arms, back to back), L0975 (the train waited on C's
  and E's runs), L0976 (A waited 41 min behind the train; the librarian wrote "Not a stall"), L0983 (A gave up at the 30-minute
  limit behind other seats' holds) [read: ledger]. A holder-liveness reader says "alive and moving" on every one of these and
  does nothing. The inside reader of the lock itself says the cost there is slots filled back to back and no queue order
  [read: `loop/room_better_2026-11-13/in_lock.md`, "What held the machine, by kind" and "What a queue with priorities would
  change"], which is a scheduling matter, not a liveness one.
- **Bypass of a hold by a seat that can see the hold:** L0951 (P ran two test files inside C's exclusive timing hold), L0804
  (B started a build inside P's landing lock; "the lock tool waits only on a lock from the same tree"), L0799, L1036 (a 29 s
  compile overlapped P's bench after a wrong all-clear), L0571 (E overlapped P's timing session), L1055 (E's holder_look check
  failed; two builds ran inside its own hold) [read: ledger]. Here the holder was alive and the others did not respect it.
  That is non-binding (R05 as g2 states it) or a check not shown to fire (R03), and a liveness read makes no difference.
- **A kill that hit the wrong process:** L1065 (taskkill /T by a bare PID walked into P's exclusive GPU session via a reused
  PID) [read: `handback/p-d675-run-frame-O_2026-11-13.md:100`; `librarian/2026-11-13.md:497`]; L0857, L0862, L0863 (TaskStop
  leaves children). The fault is a stop tool that does not match what it stops. A liveness reader would not have prevented
  these, and the guard's own tree walk "reads the same parent ids" [read: `librarian/2026-11-13.md:497`, the 12:14 entry].
- **Load and memory with no holder to read:** L0314 (16 cores pinned by parallel suites, before any lock existed), L0316,
  L0319, L0348, L0383, L0647, L0771 (flakes and crashes under shared load); L0967 (a `grep -o` with a 7,000-wide repeat
  reached 1,552 MB; the gate worked and a librarian stopped it inside 3 min) [read: ledger]. That is no gate on the reader's
  own process, or R09: grep bounded repeats are the "filed where the finder sits" hazard, and the groups themselves
  placed L0967 under R04 while the hazard is a command's memory.
- **Not a lock row at all:** L0113, L0155, L0291 (commits that swept in other seats' in-flight files; parallel edits to one
  file), L0400, L0420, L0443 (a visible browser, sounds, 527 Explorer tabs), L0482, L0483, L0725 (PC froze), L0844 (sed-rewrited
  paths wrote into another lap's evidence) [read: ledger]. Shared machine, yes; liveness, no.

So, of R04's 121 ids: about 16 are liveness in any sense, and of those the clearest (an idle or dead holder that stalled a
seat) are L0912, L0966, L0577, L0579, L0710 and L0872 [inferred from the ledger rows I opened]. The root's own text claims
"idle, orphaned, mangled or killed holder stalls every seat until a person looks", and that sentence is true for two rows.

**What the cost record actually says.** The recorded minutes for a dead or idle holder: 6 (11-12) plus 40 (11-13), "46 minutes
over two nights" [read: `librarian/2026-11-13.md:318`, `:479`]. L0710 is a dead timing lock of 12 hours, but the ledger's own cost
field says "would read as live" and the hand-back records no seat waiting; E found it and removed it itself [read:
`handback/p-d643-forks-E_2026-11-06.md:21-25,81-85`]. For scale: L0143 8 h 57 min, L0235 about 100 min, L0245 about 3.6 h of a
5 h shift idle, L0239 82 min, L0068 about 80 min [read: ledger rows]. All five of those are R07/R05 rows that R04's groups also
claimed. Against the recorded costs, the true idle-holder class is small [inferred].

## 3. Could a fix be shown to work on a recorded case?

For the narrow thing: yes, and the room did it. P's fix has a row red on 901d3c39 that reproduces C's recorded shape (named at
-380 s) and green on the fix [read: `librarian/2026-11-13.md:479`]. The proving check is written in the trace: a wrapper holding a
shell that does nothing is named within N minutes, and a compiling one is not [read: the 11-12 trace, second section]. So
"idle-holder guard" is testable on L0912/L0966 and, for the false-positive side, on the P/A/C live misfires.

For R04 as stated ("a lock or gate records that someone holds it, not whether the holder is alive and moving"): no single test. It
spans (a) idle holder, (b) dead pid and stale lock files, (c) a kill by bare PID, (d) children left by TaskStop, (e) memory that
no lock covers, (f) bypass by seats that ignore the hold, (g) queued waits behind live holders, (h) load and flakes. Each needs
its own recorded case and its own check; (f) and (g) are the cases a liveness reader cannot change [inferred]. As a root it is
too wide to pass or fail as one thing. And the recorded false-positive side shows the test must include the "working holder
is not named" case, which the first guard did not have [read: 11-13 10:36 entry].

## 4. Has the room already tried a fix of this kind, and how did it end?

- **D283, 2026-10-09: pid-liveness on takeover.** `heavy-run.js` took over a LIVE lock because `pidAlive` (`process.kill(pid,0)`)
  judged the chair's run dead at 38 minutes. The plan asked for a second method (tasklist) and a rule that a young lock is never
  taken on a disagreeing read [read: `loop/plan_heavy_run_takeover_2026-10-09.md:1-30`]. The two-slot plan then states the rule
  as built ("D283's takeover rules apply per slot, unchanged: a young lock is taken only when tasklist agrees" [read:
  `loop/plan_heavy_run_two_slots_2026-10-10.md`, Part 1]). Outcome: a liveness check built in October, with a mutation harness
  (`handback/p-heavyrunmut-B_2026-10-11.md` exists; I did not open it). It works for a dead pid (L0872: a dead holder was taken
  over by E's waiter; L0577, L0579: panes removed their own dead locks) [read: ledger rows], and was blind to an idle live shell,
  which is the 11-12 and 11-13 case. So pid liveness has been tried and left a hole at "alive but not moving".
- **11-12 trace "fix for good", owed, never built; same fault 7x longer next day** [read: the trace].
- **L202 idle guard, 11-13:** built, 101 of 101 and mutants caught, misfired twice on first live window, repaired by P, ruled to
  land by another pane; at the time of my reading it is not recorded as landed [read: `librarian/2026-11-13.md:443,479`; I did not
  find a landing entry and did not search every later line].
- **Memory gate and low-memory reaper (11-13):** gate worked on the grep (held at 6,144 MB commit floor, stopped by a librarian
  in 3 min); the reaper hit A's and E's runs [read: in_lock.md table rows 07:04 and 12:2x; the stall_trace_lowmem_reaper file
  itself I did not open].
- **The timing slot lock:** E's dead timing lock stood 12 h in November [read: ledger L0710], which the L202 guard (CPU of the
  held child of a `heavy-run` run) does not obviously cover [inferred; I did not read the guard's code].

The pattern: each fix to R04 was built against the failure just seen, and the failure that returned was the neighbouring one
(false takeover, then idle shell, then false idle, then a kill by reused PID). That is the shape R03 names (a control not shown on
a recorded real case) more than a shortage of liveness readers [inferred].

## What survives the attack (in fairness)

1. A narrow, real, testable fault: an idle or dead holder of a shared slot stalls seats for minutes to hours until a person
   looks, with a recorded case that a guard can be written red-first against (L0912/L0966; P's rows prove it on a replay).
   This stays a good small lap; it is not a root.
2. Of the ledger, the cluster of lock and gate rows on 11-11 to 11-13 (about 35 shared by all three proposers) is real
   pain on a shared laptop; a lock-queue or class order would help the waits where the holder is alive, which is a different
   fix from the one R04 names.

## What I did not open

- Any session transcript or `C:/Consonance/data` file; none was needed.
- `consonance/tools/heavy-run.js` body (only its cited lines via other seats' notes), `heavy-run.mutants.js`, and the L202
  and P hand-backs themselves (I read their descriptions in the librarian's notes at `2026-11-13.md:443,479,497`).
- `handback/p-heavyrunmut-B_2026-10-11.md`, `handback/p-heavyrun-A_2026-10-09.md`, `loop/stall_trace_lowmem_reaper_2026-11-13.md`,
  and the primaries of most ledger rows I classify by their ledger text (I opened the ledger row, not each primary, except
  where a path:line is given above).
- Whether L202 or P's fix landed after 12:14.
- The ledger's row counts per root were not scored against the ledger by scorers; the keyword classification in section 2 is a
  crude regular expression over the ledger text and may miss or over-count rows.
