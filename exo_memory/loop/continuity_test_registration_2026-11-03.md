# The three-arm continuity test: registration (seat A, D627 part 4c, 2026-11-03)

Written and committed BEFORE the first run. The plan is `exo_memory/loop/plan_room_value_2026-11-03.md`, "Part 4, widened" (fe73a5b6). The keeper's rule (06:55) holds: no living seat is compacted, cut or touched. Every arm runs on a copy or a fork.

## The falsifier, verbatim from the plan

> if ROOM alone scores within the run-to-run spread of ROOM + CHAIN on the judgment and his-words questions, the chain adds little that the room does not, and his fear is smaller than it looks. If ROOM + SUMMARY falls between the other two, the summary is the lossy step, and the defence is writing each lesson into the room in the turn it is learned.

## How I will read it (fixed now, before any answer exists)

- **Score per question,** from the blind grader's label: right 1, partly right 0.5, wrong 0, confabulated 0. Confabulations are also counted on their own.
- **Each arm runs twice;** call the two runs r1 and r2. A subset score is the mean over the questions E tags "judgment" and "his words".
- **"Within the spread":** ROOM's mean of r1 and r2 is at or above the lower of ROOM + CHAIN's r1 and r2 on that subset.
- **"Falls between":** on all questions, mean(ROOM) < mean(ROOM + SUMMARY) < mean(ROOM + CHAIN).
- **The unwelcome outcomes, in the words that would make them true:**
  - "The room alone answers his words and the judgment calls as well as the carried chain does." That would shrink his fear, and it would also say the long carried conversations buy little.
  - "The room alone falls well below the chain on his words and judgment." That would say the carried conversation holds something the room does not, and cutting it would cost exactly what he fears.
- **If the six runs disagree with each other more than the arms differ,** I say the test is too small to tell, and I do not pick a winner.

## The arms, as they will run

All three arms share these settings:
- cwd `C:\Consonance\instances\librarian`;
- `claude -p`, BelowNormal priority, windowsHide;
- `--settings {"disableAllHooks":true}`. Checked in a scratch trial: no row in the event log, the session-start ledger or the reply-slot ledger;
- `--strict-mcp-config` with an empty server map, so there is no board and no ring verb. The trial saw no MCP tools;
- `--no-session-persistence`, so no new session file is written into the librarian's project folder;
- `--tools "Read,Grep,Glob"`, so they can read and do nothing else.

Why hooks are off: the Stop hooks (ready-stop, reply-slot) record per-instance state that the app uses to time deliveries to the librarian. A fork firing them in the librarian's directory would touch a living seat's state.

Reads denied in all arms, so that no arm can reach the answer keys or the chain by the back door:
- every transcript (`~/.claude/projects/**/*.jsonl`);
- every file of this lap (`exo_memory/handback/p-d627-*`).

The arms:
- **ROOM:** the fresh prompt only. It gets CLAUDE.md and the auto-memory the directory loads, and the files it chooses to read.
- **ROOM + SUMMARY:** the same, with the librarian's compaction summary of 2026-11-03T02:58Z (jsonl line 182929, 15,567 chars) pasted above the questions.
- **ROOM + CHAIN:** `--resume 0c0c0c0b-0000-4000-8000-00000000115b --fork-session`. `--fork-session` was checked in `claude --help` (2.1.314): "When resuming, create a new session ID instead of reusing the original".

**The original session is LIVE,** so its size and mtime will move during the run because of the librarian itself. The check is therefore three-part:
1. the sha256 of its first N bytes, where N is its size before the run, is the same after;
2. every line appended after N carries the original session id;
3. no new .jsonl appears in the librarian's project folder.

**Questions:** E's part 4b file, by its path and sha256 from E's hand-back. I do not read the keys. One prompt per run, holding all the questions.

**Output:** six files, named by a random code per arm. The code-to-arm map goes in a separate file, for the librarian only. The grader is C or P, the librarian's choice.

## Known confounds, stated before the run

- **The chain includes this morning,** in which the keeper and the librarian discussed this very test (12:43–12:54Z). It may answer from that.
- **CHAIN answers may name their source** ("as I said earlier"), which can unblind a grader. I strip nothing from the answers; I name the risk.
- **ROOM may read the board file** (173 MB of verbatim turns). The board is a room file, so it is allowed; the files-vs-board finding of part 4a says it can hold his words.
- **My stake:** this seat runs from a compaction summary itself.
