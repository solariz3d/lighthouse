# Packet (panes A and B, on L): finish the room's usage work, one build, one restart

Written by the librarian on L, 2026-11-25 00:5x. Parts 1 and 2 of `loop/plan_finish_lighthouse_2026-11-25.md`; read that
plan first (his words of 00:17 are at its top). For the chair to number and dispatch. One lap in two disjoint pieces:
pane B owns the app's Rust and the one release build; pane A owns the reads, the ledger's JavaScript and one probe.
Nothing here touches the track builder.

## Pane B

**B1. Q2 half B, finished and built.** Your packet is `loop/packet_q2_builder_floor_B_2026-11-21.md`; your own state is
the hand-back `handback/p-q2-builder-floor-B_2026-11-21.md` (its "WHERE IT STANDS" names the next probe command). Finish
the probe, then build only what it shows removable AND unused, with the same config switch to restore it.

**B2. Your own correction, carried from your answer of tonight** (`loop/effort_ask_2026-11-25/B.md`): line 88 of that
hand-back says "5 of 5"; your recount is 4 of 4. Mark the old figure struck in place with the new one beside it (do not
delete it), and put the `analyze.json` files the recount used into the evidence folder so another seat can redo it.

**B3. A false "interrupted" row.** `C:\Consonance\data\close-small.jsonl`: the click of 2026-11-21T13:47:04Z lists three
seats and each has a cut row (13:48:20Z, 13:51:12Z, 13:52:48Z). At this launch the app still wrote
`{"event":"interrupted","t":"2026-11-25T06:08:44.028Z"}`. Red first: a run whose every listed seat has an outcome row is
not reported as interrupted. Say what the launch check read that made it fire.

**B4. A ring that is pasted and never submitted. PROBE ONLY, no fix without a cause.** On D, 2026-11-24, a pane's
`call_librarian` ring sat in the librarian's input line from 09:54 to 14:04 local, unsent, until he found it
(`loop/handoff_lighthouse_2026-11-24-D.md`, the last section; `librarian/2026-11-24.md`, "14:05"). The write is
`inject_to_pane` to `deliver`: one bracketed paste, then a lone carriage return 120 ms later. Find, from the code and a
scratch pane, the conditions under which the paste lands and the return does not (a seat mid-turn; a dialog open; text
already in the line). Hand back the cause with a row that shows it, or "not reproduced" with what was tried. D's board
is not on this machine.

**B5. Land.** After pane A's read is clean: merge `q2-builder-floor` with B1 and B3 to main, one release build
(`node consonance/tools/heavy-run.js --status && <build>` in one call), the running exe moved aside and not replaced
under the running app. Then say so: his restart makes it live.

## Pane A

**A1. Second read of Q2 half A, now:** `git diff 0663ea74..q2-builder-floor` (origin, tip 1e450024). Vary what the author
fixed: assemble a builder's intake and a housed seat's yourself and compare, do not re-run B's own rows only. Then read
B's new commits (B1, B3) when B rings you through the chair.

**A2. The ledger counts waiting calls.** `consonance/tools/usage-ledger.js` gains, per seat, the number of model calls
that are a shell call which only waits or tails (sleep, a tail or poll loop, a status re-read of a run already started),
beside its total calls. Baseline to reproduce first, from my pass of 11-21 over 11:00Z to 12:00Z that day: pane A 61 of
171, pane B 26 of 150 (`librarian/2026-11-21.laptop.md`, "06:5x"; my classifier is not on disk, so write yours down and
say how far your count is from mine). Tests red first, in the tool's own test file.

**A3. Probe: can reasoning effort be set for ONE seat?** Today it is per model in `~/.claude/settings.json`
(`modelSettings.<model>.effortLevel`: fable high, opus medium, sonnet medium), so raising Opus moves the chair and panes
B, C and E together. On a scratch seat with the app's launch arguments: does `effortLevel` (or `modelSettings`) in a seat
folder's `.claude/settings.local.json` win for that seat; does the environment variable `CLAUDE_CODE_EFFORT_LEVEL` at
launch; does either survive a resume. Read the effort from the transcript's reply rows, not from the status line.
Pane B found `claude -p` is not a faithful copy of a pane's launch (its Q2 hand-back, finding 1): say which launch you used.
No setting on any real seat is changed.

## Registered before code (print each in the hand-back)

- **R1 (B1, the plan's line):** failed if a builder pane's first call after a cut is not under 90,000 tokens
  (`node exo_memory/loop/seat_context_2026-11-14.js --seat <name> --since <the cut>`; read after his restart).
- **R2 (B3):** the red row, then green; the click of 11-21 13:47Z replayed gives no interrupted line.
- **R3 (A2):** your count on the 11-21 hour beside mine, with the classifier's rule written before counting.
- **R4 (A3):** a table: route, honoured or not, at launch and at resume, each seen in a transcript row.
- **R5:** the Rust suite's count before and after (base: 1,286 pass / 1 fail / 7 ignored on L at L221; the 1 is
  `light_the_librarian_worst_case_intake_is_under_145_000`, red at base; D fixed three reds since, so read the base again).

## Not in this lap

BOOT, the committee brief, the deck, a pane's own map (Q3 is not decided). Any housed seat's intake. Any seat's effort
setting. Panes C and E (asleep at his word). The track builder.

## Standing rules

Commit by named paths. A second reader reads a diff before it lands. A long run goes to the background once and the turn
ends: no sleep, tail loop or polling call (this lap measures them). Every figure in the hand-back has the command that
printed it beside it; a count that was not counted is written "not counted". Hand-back as a file in
`exo_memory/handback/`, rung to the librarian as a pointer, each state claim marked checked or inferred, ending with who
acts next.
