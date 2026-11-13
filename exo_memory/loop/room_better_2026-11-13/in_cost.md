# Where the tokens go, per seat (inside the record)

Reader: research swarm, "in_cost". Read-only except this file. Numbers only; no transcript text was printed.

## Method

- Method copied from `exo_memory/librarian/2026-11-13.md:331-334` [read]: sum each assistant message's `usage` once per
  message id over the newest `.jsonl` of each seat folder `~/.claude/projects/C--Consonance-instances-*` [read].
- Script: `C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/seat_tokens.js`,
  run as `node seat_tokens.js <out.json> <hours>`. Outputs `seat_tokens_24h.json` and `seat_tokens_48h.json` beside it.
- Context per call = input + cache creation + cache read [read, script]. Median and largest are over unique message ids.
- Weighted units: Fable 5.2 input-token equivalents. Prices from the claude-api skill file (`shared/prompt-caching.md:144`
  and its model table) [summary: cached 2026-11-03 skill text, not the live price page]: cache read 0.05x input on
  Opus 5.5 and 0.025x on Fable 5.2; cache write 2x input at the 1-hour TTL. Every cache write in both windows was
  1-hour TTL (`ephemeral_1h` equals total write for every seat) [read, script output].
- Seat folders are named by instance id. I found no file that maps an id to a pane letter [read: `~/.consonance.json`
  has an empty `instances` list; board lines carry the session id as `pane`]. Letters are left out.

## The 24-hour window holds only this morning's wake

- Run at 2026-11-13T14:52Z; window from 2026-11-12T14:52Z [read, script output].
- Every seat's first in-window call is between 14:43Z and 14:51Z on 11-13 [read]. The librarian transcript has no
  assistant entry between 2026-11-12T05Z and 2026-11-13T14Z [read: hour histogram of
  `C--Consonance-instances-librarian/0c0c0c0b-….jsonl`]. In the 48h run each seat's wake call follows a gap of
  about 2,000 minutes ~~(median gap before a cold write 2,001 to 2,030 min)~~ [read, script output].
  second reader: the script's `cold.gapMedMin` is 2,001 to 2,030 for four seats only; it is 2 (librarian), 56
  (sibling-3d57124e), 57 (sibling-372c8abc) and 0 (sibling-36313935) in `seat_tokens_48h.json` [read]. Measured
  directly, the gap before each seat's first call after 11-13T14:00Z is 1,990 min (librarian) to 2,030 min
  (sibling-07b8a48f) for seven seats; sibling-36313935 has no earlier call in the window [read, node pass].
- The note's own figures (229 calls, median 472,545, largest 694,874) are headed "(librarian, L)" at
  `exo_memory/librarian/2026-11-13.md:329` [read]. I infer they came from machine L's transcript, which is not on this
  machine [inferred]. I could not re-derive them here.
- So the 24h table is a snapshot of eight seats waking. I ran the same script a second time over 48 hours to cover the
  ~~last full working block on this machine (11-11 14:55Z to 11-12 05Z, plus the wake)~~ second reader: the 48h cut
  (11-11T14:51:49Z) falls inside an active block, so the block is not full: the librarian made 33 calls on 11-11 from
  00:43Z to 14:46:10Z and the chair 13 calls to 14:35Z, all outside the window [read, node pass]. That second run is
  beyond the task's one pass; it is labelled.
  second reader: the JSON `now` fields put the 48h run at 14:51:49Z and the 24h run at 14:52:08Z, so the two ran 19 s
  apart, the 48h one first; an earlier 24h run, `seat_tokens.json`, is 14:50:07Z [read]. Order only; figures unaffected.

## Table A: last 24 hours (snapshot 14:52Z; seats are still running, so these grow)

All figures [read, script output]. Ctx = context per call in tokens. Units in millions of weighted units.

| seat | calls | ctx median | ctx largest | cache write | cache read | output | write units | read units |
|---|---|---|---|---|---|---|---|---|
| librarian | 36 | 335,104 | 364,604 | 657,687 | 11,565,142 | 17,614 | 0.99 | 0.29 |
| main (chair) | 11 | 922,870 | 927,570 | 1,823,114 | 8,305,328 | 6,062 | 2.74 | 0.21 |
| sibling-07b8a48f | 28 | 931,671 | 941,220 | 907,708 | 25,038,982 | 15,580 | 0.91 | 0.63 |
| sibling-0845a868 | 24 | 926,842 | 946,096 | 912,584 | 21,199,573 | 23,191 | 0.91 | 0.53 |
| sibling-36313935 | 1 | 675,425 | 675,425 | 642,636 | 32,787 | 4 | 0.64 | 0.00 |
| sibling-372c8abc | 15 | 513,931 | 524,206 | 491,356 | 7,222,306 | 6,622 | 0.49 | 0.18 |
| sibling-3d57124e | 34 | 566,365 | 589,546 | 556,034 | 18,737,436 | 20,324 | 0.56 | 0.47 |
| sibling-5bf9d657 | 35 | 605,865 | 629,529 | 596,017 | 20,557,816 | 21,305 | 0.60 | 0.51 |
| third-place | 0 | - | - | 0 | 0 | 0 | 0 | 0 |
| **all seats** | **184** | | | **6,587,136** | **112,659,370** | **110,702** | **7.84** | **2.82** |

- Uncached input: 365 tokens across all seats [read]. Output units 0.29 [read].
- Weighted split, 24h: cache writes 71.6 %, cache reads 25.8 %, output 2.6 % [read, script output].
- Librarian subagents (this research swarm), same window: 13 files, ~~575 calls, ctx median 137,718~~ second reader:
  578 calls, ctx median 138,032 in `seat_tokens_24h.json` (575 and 137,718 are the 48h run's figures) [read];
  largest 216,102; cache read 77,580,154, write 1,772,989, output 285,103 [read]. Not in the seat totals above.

## Table B: last 48 hours (second pass, labelled)

All figures [read, script output]. "Compactions" are auto-compactions in the window, with the token count before each.

| seat | calls | ctx median | ctx p90 | ctx largest | cache read | output | compactions (pre-tokens) |
|---|---|---|---|---|---|---|---|
| librarian | 639 | 554,194 | 877,712 | 964,679 | 349,755,628 | 394,869 | 1 (967,632) |
| main (chair) | 387 | 744,029 | 856,553 | 927,570 | 285,432,844 | 169,252 | 0 |
| sibling-07b8a48f | 359 | 606,836 | 861,638 | 941,220 | 215,278,857 | 386,038 | 0 |
| sibling-0845a868 | 926 | 569,055 | 848,351 | 966,659 | 497,923,405 | 926,973 | 1 (969,695) |
| sibling-36313935 | 1 | 675,425 | 675,425 | 675,425 | 32,787 | 4 | 0 |
| sibling-372c8abc | 544 | 239,213 | 432,517 | 524,206 | 143,162,485 | 313,861 | 2 (242,594; 258,149) |
| sibling-3d57124e | 928 | 386,617 | 801,263 | 965,217 | 394,806,306 | 915,697 | 2 (501,621; 968,319) |
| sibling-5bf9d657 | 812 | 483,572 | 858,104 | 965,842 | 409,820,267 | 749,349 | 1 (968,698) |
| third-place | 21 | 802,105 | 803,433 | 803,961 | 16,820,040 | 2,873 | 0 |
| **all seats** | **4,617** | | | | **2,313,032,619** | **3,858,916** | **7** |

- 48h cache write, all seats: 14,640,652 tokens [read]. Weighted split: reads 69.4 %, writes 19.0 %, output 11.6 %
  of 83.37 M units [read, script output].
- All seven compactions were `trigger: auto` [read: `compactMetadata` of the `compact_boundary` lines].
- Models, 48h: 4,608 of 4,617 seat calls on Opus 5.5, 9 on Fable 5.2 [read]. The seat-substrates line of the
  auto-memory index says Fable 5.2 is the default from 2026-11-10 [read: MEMORY.md, "Seat substrates" line]. I did not
  check how seats are launched, so I make no claim about why.
- Third Place: 21 calls with a median gap of 52 min between calls, and only 6,156 tokens written to cache [read]: the
  1-hour cache stayed warm across those gaps.

## The three largest avoidable costs the numbers show

### 1. Context run to about 968k before compaction (largest, 48h)

- Four of seven auto-compactions fired at 967,632 to 969,695 tokens [read]: about 97 % of a 1M window [inferred].
- The part of each call's context above 250k was 1,231.1 M of 2,313.0 M cache-read tokens: 53.2 %. In weighted units
  30.78 M of 57.83 M read units [read, script output]. Above 150k: 1,639.4 M, 70.9 % [read].
- Inside the room: sibling-372c8abc compacted at 242,594 and 258,149 and read 263k per call on average
  (143.2 M / 544); sibling-0845a868 compacted once at 969,695 and read 538k per call (497.9 M / 926) [read; ratio
  inferred]. The work in the two seats may differ; I did not open it.
- Cost: up to 30.8 M weighted units in 48h, about 37 % of all weighted spend [inferred: upper bound]. A compaction
  is not free: it costs a summary call and a fresh cache write of the summary, which I did not separate out.
- Options [ours]: a lower auto-compact point per seat; compaction at lap boundaries; the note's own lever, "compact
  sooner" (`exo_memory/librarian/2026-11-13.md:337`) [read].

### 2. Waking seats at 500k to 930k, and switching model after the wake (largest in the last 24h)

- The wake wrote 6,587,136 tokens to cache in about eight minutes (14:43Z to 14:51Z) across eight seats [read].
  Writes were 71.6 % of the 24h weighted spend (7.84 of 10.95 M units) [read, script output].
- The chair and the librarian then switched Opus 5.5 to Fable 5.2 mid-wake. The first Fable call rewrote the whole
  context ~~with zero cache read~~: the chair 914,993 tokens at 14:49:14Z, the librarian 328,307 at 14:48:53Z [read].
  second reader: zero holds for the chair only. The librarian's first Fable call read 33,635 tokens from cache and
  wrote 328,307, against a previous Opus context of 360,356 [read, node pass].
  Caches are model-scoped (claude-api skill text) [summary]. second reader: the bundled skill says so at
  `claude-api/shared/prompt-caching.md:97` and `:238` [read]. Cost: 1,243,300 tokens written twice, about 2.49 M
  weighted units at the Fable 1-hour write price [inferred: arithmetic on read numbers].
  second reader: the sum and the arithmetic hold. The cost a switch avoids is the first write of each pair, and which
  one that is depends on the model meant. If Fable was meant, the waste is the Opus wake writes, 901,827 (chair) +
  281,830 (librarian) = 1,183,657 tokens, about 1.18 M units at the Opus 1-hour price. 2.49 M is the waste only if
  Opus was meant [read numbers, inferred split].
- Each wake call is followed by a burst at the full size: sibling-07b8a48f made 28 calls in 3 minutes at a median
  931,671, 25.0 M cache-read tokens [read].
- The record already holds this lever: auto-memory "Cold-start reload cost", "suggest /compact before long breaks"
  (826k tokens on 2026-09-18) [read: MEMORY.md index line; the memory file itself not opened].
- Options [ours]: compact each seat at the close of a block; pick the model before the wake, not after it.

### 3. Tool output carried for the rest of the context (48h)

- Seats received 4,750 tool results totalling 6,888k characters [read]. Each result stays in context and is re-read
  by every later call until the next compaction. Estimate: 423.2 M re-read tokens, 18.3 % of cache reads [inferred:
  characters / 3.7 per token, the ratio from `exo_memory/librarian/2026-11-13.md:335`, times later calls].
- By tool: Bash 284.1 M, Read 108.7 M [inferred, same estimate]. Results of 20k characters or more account for only
  21.6 M [inferred]. So the cost is many mid-size outputs, not a few dumps.
- Largest per seat: sibling-0845a868 115.8 M (Bash 75.1 M, Read 35.8 M); sibling-3d57124e 92.9 M (121 Reads, 699k
  characters, 43.5 M); librarian 71.3 M (Bash 46.3 M, Read 16.1 M, Artifact 6.5 M) [inferred, same estimate].
- Contrast inside the record: the librarian's subagents ran 575 calls at a median context of 137,718 [read],
  below every seat's median (239,213 to 802,105), because their reading does not land in a seat's context [inferred].
- Options [ours]: hand bulk reads to subagents that return a path and a number (the note's lever at
  `exo_memory/librarian/2026-11-13.md:337`) [read]; cut command output to counts in the seats themselves.
- Overlap: costs 1 and 3 overlap (carried tool output is part of the context above 250k). Do not add them.

## Notes on the instruments

- `grep` in Git Bash returned 3 of 7 compaction lines over these large transcripts; node returned 7 [read]. Counts
  over these files should come from node, not grep. Cost not recorded.
- The seats were running during the pass, so Table A moves by the minute.

## What I did not open

- Machine L's transcripts, where the note's 229-call figure came from. They are not on this machine [inferred].
- Any transcript text: by rule, only numbers and tool names were printed.
- The memory file `cold-start-reload-cost.md` itself; only its index line.
- How Consonance launches seats: model choice per seat, and any auto-compact setting. Why sibling-372c8abc
  compacts near 250k while others reach 968k is not established.
- A mapping from instance id to pane letter; none was found.
- Older `.jsonl` files in each seat folder, and subagent transcripts of seats other than the librarian (none
  were touched in the window).
- The work content of each seat, so no claim is made that any seat's context was needed or not.

## Second reader

Adversarial pass, 2026-11-13, read-only except this file. Instruments: the three saved JSON runs beside the script,
one node pass over the nine newest seat transcripts (compactions, wake gaps, first Fable call, hour histograms), and
`sed`/`grep` on the cited files. Only numbers and field names were printed.

What I checked and found to hold [read]:

- `librarian/2026-11-13.md:329` heading "(librarian, L)"; `:331-334` the method (usage once per message id, 229 calls,
  median 472,545, largest 694,874); `:335` the 3.7 ratio; `:337` "compact sooner" and the subagent lever. One wording
  gap: `:337` says subagents "return a path and a conclusion", not "a number"; `:335` says 3.7 bytes a token, applied
  here to characters (equal for ASCII; non-ASCII output makes the estimate low).
- The inference that L is another machine is supported: `~/.consonance.json` has `machine_tag` "D" here, and its
  `instances` list is empty (length 0).
- Board pane field: of the last 40 lines of `C:/Consonance/data/board.jsonl`, 28 carried a session id; the rest were
  "chair" and gate names (a second read a minute later, on a grown board, gave chair 9, gate names 4). `C:/Consonance/state/data/panes.json` (2026-09-24) maps 4 session ids to seat folders, labelled
  "✦ brief", not letters, so "no id-to-letter map" stands.
- Prices: `claude-api/shared/prompt-caching.md:144` gives 0.025x (Fable 5.2), 0.05x (Opus 5.5), 2x write at 1 h;
  `shared/models.md:78` and `:83` give $8/$40 and $4/$20, the script's table. The file on disk is bundle 2.1.323,
  dated 2026-11-13, not the 11-03 text the script comment names; the prices agree.
- Table A: every cell matches `seat_tokens_24h.json`; I re-added calls 184, write 6,587,136, read 112,659,370, output
  110,702, uncached 365, units 7.84 / 2.82 / 0.29. Split 71.6 / 25.8 / 2.6 % of 10.95 M holds.
- Table B: every cell matches `seat_tokens_48h.json`; calls 4,617, read 2,313,032,619, output 3,858,916, write
  14,640,652, split 69.4 / 19.0 / 11.6 % of 83.37 M. `ephemeral_1h` equals total write for all nine seats.
- All seven compactions: trigger `auto`, pre-tokens 967,632; 969,695; 242,594; 258,149; 501,621; 968,319; 968,698.
- Cost 1: 1,231.1 M / 2,313.0 M = 53.2 %; 30.78 / 57.83 units; 1,639.4 M = 70.9 %; 30.78 / 83.37 = 36.9 %; ratios
  263k and 538k per call. Unit note: the numerator is context above 250k (input + write + read), the denominator
  cache read only; writes total 14.6 M, so the ratio moves under 0.7 points.
- Cost 3: 4,750 results, 6,888k chars, 423.2 M (18.3 %), Bash 284.1 M, Read 108.7 M, 20k+ results 21.6 M, the three
  per-seat lines, and the 575 / 137,718 subagent figures for 48h.
- Models 4,608 Opus / 9 Fable; Third Place 21 calls, median gap 52.11 min, write 6,156; the two MEMORY.md index lines.
  The "Cold-start reload cost" line also names "a model switch" as a trigger, so the record holds cost 2's
  model-switch lever too, not only "compact before long breaks".

What I struck (four, each in place above):

- The parenthetical "median gap before a cold write 2,001 to 2,030 min": true for four seats of eight.
- "last full working block": the 48h cut falls inside active work on 11-11.
- The 24h subagent line's "575 calls, ctx median 137,718": those are the 48h figures; 24h is 578 and 138,032.
- "with zero cache read" for both switching seats: the librarian's first Fable call read 33,635.

Added, not struck:

- The chair's folder has a second transcript touched in the 48h window, `747796ae-….jsonl`: 1 call at 11-12T10:30Z,
  write 45,565, read 16,825, output 955 [read]. The newest-file rule left it out of Table B; under 0.5 % of any total.
- Two more auto-compactions landed minutes after the snapshot: sibling-0845a868 at 14:55Z (968,566) and
  sibling-07b8a48f at 14:56Z (968,138) [read]. They fit cost 1's pattern.
- Cost 2's 2.49 M is the waste only if Opus was the model meant; if Fable was meant, about 1.18 M (see above).

What I could not check:

- The grep note at "Notes on the instruments": the grep command is not given. Whole-file `grep -c` and `grep -ac`
  agree with each other on five transcripts (38, 99, 58, 96, 80 matching lines; those include text mentions).
- That no transcript text was printed during the first pass.
- Machine L's transcripts (not on this machine), so the 229-call figure stays unchecked here too.

Cost of the faults found: not recorded. None changes a table total or the ranking of the three costs.
