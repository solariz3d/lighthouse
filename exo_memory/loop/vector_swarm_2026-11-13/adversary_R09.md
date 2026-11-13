# Adversary for R09 (Sonnet research agent, 2026-11-13)

Marks: [read] I opened it, path:line; [inferred] mine; [ours] a proposal. Counts marked "command" were derived by a node or
shell command run in this session.

R09 as filed: "A fix or rule is filed where its finder sits, so the next lane meets the same fault with no rule in front of it."
Proposed by group 4 alone (its R2), 49 ledger ids [read: 00_roots.md R09; roots_g4.md:59-80].

## Verdict

TOO BROAD TO TEST as one root. The 49 rows hold three different mechanisms under one name. The part that is unique to R09 and
testable (the shell-hazard rows) is the cheapest on the ledger.

## What the 49 rows are (I opened each row in 00_ledger.md) [read]

The grouping is [inferred]; the row ids are [read].

- A. Shell and environment quirks and commit-message leaks, 21 rows that sit in no other root (command: ids only in R09 = 21):
  L0498, L0689, L0711, L0712, L0718, L0748, L0752, L0755, L0766, L0785, L0841, L0842, L0852, L0865, L0871, L0877, L0893, L0900,
  L0938, L0987, L1072. Bare `build.bat` under NoDefaultCurrentDirectoryInExePath (L0842, L0877, L0900), `cmd //c` rewritten
  (L0871), heredoc and escape losses (L0748, L0841, L0852, L0865, L0938, L0987), POSIX path read as C:\c (L0712, L0893, L1072),
  CRLF edits (L0498, L0711, L0752), cargo off PATH (L0689), commit-message seat and lap-id leaks (L0718, L0755, L0766, L0785).
  Also in R09 but listed in other roots too: L0137, L0880, L0940, L1080 (same class).
- B. A figure, time or sha typed by hand: 16 rows that are also in R01's lists (command: overlap of R09 and R01 = 16): L0059,
  L0066, L0199, L0209, L0214, L0295, L0568, L0813, L0814, L0861, L0867, L0868, L0905, L0911, L1062, L1118.
- C. Rows that are not about a shared hazard: L0598, L0644, L0645 (Third Place conduct, a folder missing on L), L0400, L0420,
  L0443 (headless browser on his machine), L0670 (P's scan dropped a term).

Cost [read, by command]: of the 49 rows, 15 say "cost not recorded", "none" or "nothing". Only two give a time: L0689 (246 s) and
L0785 (a 31 min suite run). The rest say "one lost run", "a false start", "restored before commit". The 21 R09-only rows are
mostly a lost run, or a correction the pane made itself within the hour.

## (1) Is it a symptom? What produces it

Part B is R01's mechanism. adversary_R01.md:36-42 argues the other way, that R09 produces R01's time and sha rows. I opened the
rows. A hand-typed time or sha is caused by the typing, whether or not a tool exists elsewhere. The tool that exists, stamp.js,
covers the librarian's notes only [read: exo_memory/librarian/README.md "Stamps are read, never typed"]. BUILDING.md and
COMMITTEE.md never tell panes to read the clock (command: grep -ci "clock" returned 0 in both) [read]. So there is a carrier
gap. But a pane with stamp.js named in its brief could still type "~03:xx"; the fix that binds is a check on the hand-back, which
is R01's kind of fix. Group 4's own recorded test for R09 is a scan of hand-backs for time headings (roots_g4.md:73-76), which is
R01's fix [inferred]. Part B is R01.

Part A has no upstream root on the list that produces it. Its producer is the shell on this machine (Windows, Git Bash), whose
quirks changed under the panes. NoDefaultCurrentDirectoryInExePath=1 appears in the ledger on 11-11 in three rows (L0842,
L0877, L0900) plus L1080 on 11-13, and in none before [read: command grep of "not recognized|NoDefault|build.bat" in
00_ledger.md matched rows 881, 916, 939, 1119 only]. Several lanes met a new condition on one day, so a rule "filed where the
finder sits" cannot be what was missing that day: there was no earlier finder [inferred]. The nearest root on the list is R07
(no owner for the hazards), not R09 [inferred].

The commit-message leaks (L0718, L0755, L0766, L0785) are not "no rule in front of it". P's scan caught each before push and the
rows say so [read: ledger, "P's message scan", "P's scan"]. The rule dates from 10-29 and a gate enforces it. That is R03's
question (does the author's lane check it). Group 4 itself doubts these four (roots_g4.md:78-80) [read].

## (2) Rows R09 claims that it does not explain

- L0867 and L0868 (pane E, 11-11, "~03:xx" and "05:0x"). L0868's own row says "the same error the chair had caught at 03:23"
  [read: 00_ledger.md:907]. The same pane was told and repeated it about two hours later. Finder and next lane are one seat,
  so "filed where its finder sits" is not the mechanism. The rule was in front of it.
- L0842 (pane B, D) and L0900 (pane B, L) on 11-11, then L1080 (pane B, 11-13) [read: 00_ledger.md:881, 939, 1119]. L1080's
  primary says the landing-train check script called a bare `build.bat` [read: handback/p-l194-landing-train-B_2026-11-13.md:124-128].
  Pane B met the fault, then wrote it into a script two days later. That is "written down nowhere" and a within-seat repeat.
- L0598 (a seat said a card-warned phrase mid-answer; the row says the card had been read that morning) [read: ledger row]. The
  rule was in front of it and read. L0644 is a folder missing on L, so the rule could not run: an environment fact. L0645, "the
  correction was already sealed in July": a carried-copy case (R06 or R10), not lane to lane.
- L0400, L0420, L0443, the headless-browser rows: the fix was filed in the shared brief afterwards (see 4). They show shared
  filing working, not failing.
- L0670: P's own scan dropped a term on every push. An instrument gap (R03).
- The mechanism text (roots_g4.md:62-64) names TaskStop leaving children and `cmd /c` rewriting. The 49 ids do not include the
  TaskStop rows (L0857, L0862, L0863) or the 6-minute idle `cmd` lock hold (L0912) [read: ledger rows 896, 901, 902, 951;
  command: none is in R09's list]. R09 names the costly hazards in prose and counts the cheap ones.

## (3) Could a fix be shown to work on a recorded case

Narrow form, yes. A shared preflight or wrapper for the shell hazards can be run on the recorded commands: the bare `build.bat`
calls, the `cmd //c` forms, the POSIX-path calls, the CRLF `sed -i` edits, the heredoc escapes. Pass means each recorded command
runs correctly through the wrapper or is refused with the reason. That is about 20 rows [inferred] and a real test. What it
would have saved is small: one lost run each (rows above).

Broad form (a rule or lesson reaches every fresh pane): I can name no test. "In front of it" has no measurement. A pane brief
that carries the line does not show the pane read it, and L0598 and L0868 are rows where the rule was read or told and the fault
happened anyway. A grep that the brief contains the line would pass and show nothing [inferred]. The only honest test is the
recurrence of each named hazard after the fix, which needs days of new rows.

## (4) Has the room tried a fix of this kind

Three tries of the form "write it down in one place":

- stamp.js, 09-09, for typed times. After it the ledger has L0867, L0868, L0905, L1062, L1118 (and L0813, a wrong date). It
  stayed with the librarian's notes. A fix that did not travel: this supports R09 for this sub-class.
- The digest card (every-digest-carries-its-function, 09-09). After it, L0814 (11-11): nine sha prefixes not copied from any
  command. A different fault (no command run), caught by the pane the same hour.
- The headless-browser rule in BUILDING.md "Leave the machine as you found it", added after 10-24 [read:
  consonance/src-tauri/brief/BUILDING.md:164-175]. After it the ledger shows no Explorer-tab rows. It does show L0716 (11-06,
  nine headless Chrome left after an auto-update) and L0725 (a freeze, "inferred, not proven") [read: ledger]. The shared-place
  fix held for the fault it named and not for neighbours [inferred].
- No shared wrapper set and no pane preamble exists: `consonance/tools` has no wrapper tool for pane shells (command: ls piped to
  grep for brief|preamble|packet|dispatch|pane- returned dispatch-gate-report.js, gen-brief-gate.test.js, pane-status.js); BUILDING.md
  and COMMITTEE.md have 0 mentions of build.bat or heredoc (command) [read]. I found no earlier file in loop/ or research/ that
  proposed or tried a shared shell wrapper for panes [inferred: greps for "heredoc" matched 30 loop files, none a wrapper plan].

## What survives

- A small real cluster: about 20 shell-quirk rows, some repeated by one pane (B on build.bat, E on times) across 11-11 to
  11-13, where no brief named the hazard. A narrow preflight for it is testable on recorded commands.
- R09's best claim is the carrier side of R01 (time and sha): the tool exists and does not reach the panes.

## What I did not open

- The primaries behind most rows (only handback lines the ledger already cites, as listed above, were opened).
- Any session transcript or C:/Consonance data file.
- Whether any pane met the NoDefaultCurrentDirectoryInExePath fault before 11-11: the ledger shows none, but it is built from
  what was recorded.
- librarian/2026-11-11.md, third_place/2026-11-11.md, and the other adversary files beyond the lines I searched.
- BUILDING.md and COMMITTEE.md beyond the grep counts and BUILDING.md lines 164-175.
