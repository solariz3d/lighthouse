# The claim check: a state or figure claim goes out only when the same turn ran something that could show it wrong. Design, no code. Pane E, on D, 2026-10-11 23:5x. Lap D305 part 2 (ledger D306).

Plan: `loop/plan_claim_check_d305_2026-10-11.md`, part 2 (main `40cade98`). Why: D303 found **CN 27** (a check at hand, not run)
against 9 missed lookups, with no source type holding half of CN + CU (compute 10, fs 8, log 4, board 4, process 4, other-repo 2;
`handback/p-causeread-E_2026-10-11.md` §1, rows in `handback/p-causeread-E_2026-10-11_evidence/classification.json`).

**What this design is not.**
- It is not SOURCES (`consonance/GATES.md` §1). SOURCES asks whether a listed PATH was opened. This asks whether the claim's own
  FIGURE, or a read of the claimed STATE, appears in what the turn ran, before the claim.
- It is not a model reader. claimrec's reader was measured INDISCRIMINATE on the census items: it flagged 66% of units (arm 1),
  then 50% (arm 2) (`loop/claim_recognition_score_2026-09-27.md:19-26`; `loop/claim_recognition_arm2_score_2026-09-27.md:14-28`).
  A gate that refuses on half of all sentences is not usable. So recognition here is lexical and narrow. It reuses claimrec's
  unit splitter and the reply slot's token patterns. The model reader stays an offline instrument.

**My stake.** My D303 read produced the CN count this design answers, and my per-unit estimates in §6 are my own. A's replay is
the measurement, and B's bar is sealed separately.

## 1. The interface (for A's harness and C's build)

One pure function, with no I/O of its own:

    check(turn, opts) -> { verdict: 'allow' | 'refuse', flagged: Flag[], backed: Backing[], skipped: Skip[] }

**`turn`**, built by the caller from the transcript (A: with `find.js`/`turn.js`; C's hook: with `sources-gate.js`
`readTurnEntries` + `turnCalls`):

    {
      prompt:  string,                      // the turn's user prompt text (packets, pasted content included)
      events:  [                            // in transcript order, this turn only, sidechains excluded
        { ts, kind: 'call',   tool, input },          // tool_use; input as the JSON the tool got
        { ts, kind: 'result', tool, text, isError },  // tool_result text, joined across content parts
        { ts, kind: 'text',   text }                  // assistant text blocks
      ],
      outgoing: { ts, via, text }           // the message being checked (see below); `via` is one of
                                            // 'reply' | 'call_librarian' | 'call_chair' | 'chair_inject' | 'record-write'
    }

**What counts as "before".** Only `result` events whose `ts` is earlier than `outgoing.ts`, plus `prompt`, are evidence. A result
that comes after the claim backs nothing; that is the census's `late` case (W020, W056, W082).

**`opts`**: `{ mode: 'strict' | 'shadow', today, sourcesLine }`. `shadow` never refuses; it fills `flagged` and the caller logs it.

**`Flag`** = `{ unit, text, kind: 'figure' | 'state', token, need, why }`.
- `unit` is the claimrec unit number (`units.js`), and `text` is that unit.
- `token` is the matched figure or state word.
- `need` names the source type that would back it (§3).
- `why` is one sentence (§4).

**`Backing`** = `{ unit, token, by: { eventIndex, tool, how } }`.
- `how` is one of: `'literal'`, `'rounded'`, `'computed'`, `'read'`, `'empty-result'`, `'prompt'`.

**`Skip`** = `{ unit, reason }`, for units out of scope (§2.3). The harness counts these, so "nothing was flagged" can be told apart
from "nothing was looked at".

**Verdict:** `refuse` if any flag is unbacked and not marked `inferred:`, else `allow`. One refusal names every unbacked flag at
once, so a seat answers the whole message in one re-send.

## 2. Which sentences count as a claim

### 2.1 The units
Split `outgoing.text` with claimrec's `units.js` (`exo_memory/loop/claimrec/units.js`, `module.exports = { units, splitSentences }`).
It is the splitter the claim-recognition registration fixed (§4 of `loop/claim_recognition_registration_2026-09-27.md`). One
unit is one sentence, list item, table row, heading or code block.

### 2.2 Figure claims: a unit is flagged once per figure token in it
The reply slot's `TOKEN_KINDS` (`consonance/hooks/reply-slot.js:88-95`), reused, not copied:

| kind | pattern (theirs) | flagged here? |
|---|---|---|
| `count` | `N/M`, `N of M` | yes |
| `percentage` | `12.5%` | yes |
| `version` | `v1.2`, `1.2.3` | yes |
| `sha` | 7-64 hex with a letter and a digit | yes: a digest claim |
| `commit` | `commit <hex>` | yes: a state claim about git, §3 |
| `path` | paths | **no**: SOURCES already covers paths |

Plus four kinds the reply slot does not have, each a whole token:
- **`number`**: a digit run with an optional `,` thousands separator and decimals (`428,177`, `0.05`, `98`). A unit is
  optional (`B`, `KB`, `MB`, `ms`, `s`, `min`, `h`, `°`, `m`).
- **`size`**: `5.7k`, `30k`.
- **`time`**: `HH:MM` or `HH:MM:SS`, when the unit states something happened at that time ("finished ~03:14").
- **`multiplier`**: `21.1×`.

**Not figures, so never flagged:**
- dates (`2026-10-11`);
- ledger and lap ids (`D303`, `L085`, `W027`, `#63`);
- `path:line` citations;
- ordinals inside headings (`## 3`);
- section signs (`§4`);
- a number that is part of a path or a sha.

**Number words** ("two", "four", "three") are **not** flagged. That costs real misses: W006 "two 600-s waits", W010
"the other three", W079 "prints two hashes". The reason is that in prose, number words are mostly not claims ("two panes",
"one line"). The flood would come back, which is claimrec's result again. This is the first rule to revisit if A's replay shows
the misses are mostly number words.

### 2.3 State claims: a unit is flagged when it holds a state word about a named object
The plan's eight, plus the words the CN units actually used. Each row's state word maps to the source that reads that state:

| state words (and their negations) | object | `need` |
|---|---|---|
| landed, merged, committed, on main, pushed, unpushed, behind, ahead | a commit, a branch, a remote | git |
| running, alive, started, finished, exited, stopped, killed | a process, a harness, a run | process |
| idle, working, logged in/out, rang, rung, queued, delivered, waiting, started its half | a seat or pane | board |
| exists, absent, missing, on disk, does not exist, never did, deleted, untouched, unchanged, empty | a file, a folder, a path | fs |
| green, red, passing, failing, N/N pass | a test or suite | compute (the run itself) |
| open, filed, done, closed, dispatched | a lap, a ledger row | board (the lap ledger) |
| confirmed, verified, checked (said of the seat's own check) | the check named | the check itself, as compute |

"About a named object" means the unit also holds a path, a sha, a seat letter or seat name (A–E, chair, librarian, keeper's
machine names), a pid, or a tool name. A state word with no object ("the work is done") is skipped as `no-object`. This is the
narrowing that keeps the recognizer off ordinary prose.

### 2.4 Out of scope: never flagged, and each listed in `skipped` with its reason
- **Quotes:** text in `"…"`, `*"…"*` or `>` blocks, and a code block. A quote reports what something said, not what is.
- **Plans and intent:** the unit's main verb is future or modal (will, would, should, next, to do, owed, plan, propose).
  "The chair runs the full suite before landing" is a plan, not a state.
- **Questions:** units ending in `?`.
- **`inferred:` lines:** the room's own label (`COMMITTEE.md`, "Show the check beside a claim about state, or mark it
  `inferred:`"). A unit on an `inferred:` line, or under one in the same list, is skipped as `inferred`. This is the honest exit
  in §4.
- **Carried figures:** a figure that appears in `prompt` (the packet or the keeper's message) is backed by `how: 'prompt'`,
  because restating the asker's own figure is quotation. It is listed in `backed`, so the replay can count how often this exit
  does the work. W053's risk is named in §6.
- **The `NEXT:` and `SOURCES:` lines,** and `OUTPUT → NEXT`.

## 3. The match rule, per source type
A flag is backed when ONE earlier `result` event (or the prompt, §2.4) satisfies the rule for its kind. Every comparison is on
normalised text: thousands separators removed, whitespace collapsed, ANSI colour codes stripped. ANSI matters because the census
turns print `[33m98[39m`.

### 3.1 Figures (all source types): the figure appears, or follows by a shown computation
- **`literal`:** the figure, as a whole token, is in a result's text. `98` matches `98 journal`, but `600` does not match
  `600000`. A trailing unit may differ in spelling (`57 MB` and `57M`).
- **`rounded`:** the unit marks the figure as approximate (`~`, `about`, `≈`), and a result holds a figure that rounds to it at
  the precision written (`~66 KB` ← `67,911`).
- **`computed`:** the figure is a sum, difference, ratio or percentage of figures that are themselves backed, either in this unit
  or in an earlier backed unit of the same message. The checker recomputes it, and accepts within the precision written
  (`27/44 = 61.4%`). The computation must be written out (`27/44`, `7,479 + 15,753`). An unwritten ratio is just a figure,
  and needs `literal`.
- **`empty-result`:** a zero or "none" claim (`0 hits`, `0 left`) is backed by a call whose INPUT names the thing counted and
  whose result is empty, or exits 1 for grep. Example: `grep -c foo` printing `0`, or `ls x` printing "No such file".

### 3.2 State claims: a command in the turn read that state
The state word's `need` (§2.3) names the reads that count. Only a call whose input reaches that state, with a non-error result,
backs it. The result's CONTENT is not matched against the state word. A read of the right source is enough. §6 shows what that
costs.

| need | a call that backs it |
|---|---|
| **git** | `git log`, `git status`, `git rev-parse`, `git branch`, `git show`, `git ls-remote`, `git fetch` (whose result mentions the ref), or `gh` against the repo. For `pushed`/`unpushed`: something comparing with the remote (`origin/…`, `ls-remote`, `log origin..HEAD`). |
| **process** | `Get-Process`, `Get-CimInstance Win32_Process`, `tasklist`, `ps`, or a read of a lock file that names a pid together with a liveness test of that pid in the same call. |
| **board** | `read_board`, a read of `board.jsonl` (`node`, `grep`, `tail` with that file in the input), `chair_status`, a read of `data/panes.json` or of the seat's capture file, or `chain-status.js` / `lap-row.js --report` for lap states. **Not** the `[panes]` hook digest, the pulse line or any other injected summary: they are not tool calls (B's §2, "a summary is a copy"). |
| **fs** | Read, Glob, Grep, or a shell `ls`, `stat`, `test -e`, `find`, `wc`, `du`, `cmp`, `diff`, `git hash-object` whose input names the path or its folder. `stat`/`ls` COUNT here, though SOURCES does not count them as opening. The claim is about existence or size, and `ls` reads exactly that. |
| **compute** | A call that RAN the thing the claim reports: the test command for green or red, the script for its output, the harness for its counts. Reading a file that states a result is not a run; that is a lookup (D301), and it backs a figure by `literal`, not a run state. |

### 3.3 The three the plan asked about: compute, log, other-repo
- **compute** (10 of the CN + CU checks): for a figure, `literal` against the run's output, or `computed` from backed figures.
  For a state (green, passing, "confirmed"), the run itself must be in the turn, before the claim. "Confirmed" written in the
  same call that runs the check is the W056 case: the claim is in the call's INPUT, so the call's own result is after it, and
  nothing backs it.
- **log** (4): log files are files. A figure or event claim about a log is backed by `literal` on a result of a call whose input
  names the log: `persist.log`, `*.jsonl`, `Get-WinEvent` and the event log, `head-watch.jsonl`. A claim about a log FIELD
  (W010's "hard freezes", where the answer was in `SleepInProgress`) is backed only if that field's name or value is in the
  result. The checker cannot know which field decides. So a log claim with no figure is matched as a state claim with
  `need: fs` on the log, which is weaker (§6, W010).
- **other-repo** (2): a file outside this checkout, read in the turn: the car data, the decompiled source, the T-180 tree.
  Matched exactly as `fs` for state and `literal` for figures. The only difference is that the path need not be under the repo.
  The checker must not restrict paths to the cwd.

### 3.4 Where the claim is made: `outgoing.via`
The census CN claims were made in five places. A check that watches only one of them misses the rest.

The census CN claims, by where each was FIRST made (D303 turn reads):

| via | how a hook sees it | CN units | n |
|---|---|---|---:|
| `reply` | Stop hook, the reply text | W018, W020, W034, W044, W049, W092, W100, W101 | 8 |
| `call_chair` / `call_librarian` / `chair_inject` | PreToolUse on the MCP verb, the `text` input | W028, W032, W080, W082 | 4 |
| `record-write`, Write/Edit to `exo_memory/**` | PreToolUse on Write or Edit, the content | W084 | 1 |
| `record-write`, a Bash heredoc appended to `exo_memory/**` | PreToolUse on Bash, the heredoc body | W006, W010, W012, W019, W021, W022, W053, W054, W056, W058, W090, W096 | 12 |
| a draft in the seat's scratchpad, later copied into the record | Write to a path outside the repo | W079, W088 | 2 |

**v1 recommendation:** `reply` + the three MCP verbs + Write/Edit to `exo_memory/**`. **That covers 13 of 27.** Of my 12
"refused" in §6, it reaches only 7: W018, W020, W034, W049, W080, W100, W101.
- **The Bash heredoc path holds 12 of the 27,** and 5 of my 12 refusals (W006, W022, W054, W056, W096).
- So v2, a PreToolUse on Bash that finds a heredoc or `>>` into `exo_memory/**`, is where most of the remaining catch is. It is
  fragile to parse, and it is not optional for B's bar.
- Scratchpad drafts (2) are checked when they are copied into the record, as a record-write.

I flag this coverage gap for B's bar. It is not a detail.

## 4. The refusal, and how a seat answers it (the SOURCES shape)
**What it says.** It is one block, written in plain words, and it names every unbacked flag at once:

    CLAIM CHECK: 2 claim(s) in this message have nothing in THIS turn that could have shown them wrong.
      - "428,177 B" (unit 3): a figure. No result before this message contains it, and it is not computed from figures that do.
      - "B hasn't started its half" (unit 5): a state of a seat. Nothing in this turn read the board or the pane roster.
    Answer one of three ways, then send again:
      1. run or open the thing that shows it (the command for the figure; read_board for a seat), in a message BEFORE this one;
      2. drop the claim;
      3. mark it as an inference: put it on a line starting `inferred:` (and name where it would be checked).
    Nothing was sent. The message is logged, so nothing is lost.

**How a seat answers.** These are the same three exits as SOURCES (`GATES.md` §1, "open the item … in a message before the
ring, then send the ring again … Or drop the claim, or write none"). There is one addition, mark it `inferred:`, which is the
room's existing label (`COMMITTEE.md`, the `checked:` / `inferred:` rule, L121).

**Like the reply slot, it blocks once per message.** If the re-sent message still fails, it goes through with a logged row, and
the claim is not dropped. The reply slot's watch-only rule applies: more than 1 in 3 still refused after a week puts the check
back to shadow (`GATES.md` §2).

**What it never does:** it does not rewrite the message, add an `inferred:` label itself, or judge whether the claim is TRUE.
It asks only whether the turn could have known.

## 5. Order of the checks (for C's build)
1. Pick `outgoing` (§3.4). If the switch is off, or `via` is out of scope, return allow with nothing flagged.
2. `units(outgoing.text)`. Drop the out-of-scope units into `skipped` (§2.4).
3. Flag the figures (§2.2) and the state words with an object (§2.3).
4. Collect the evidence: the `prompt` and every `result` with `ts` before `outgoing.ts`.
5. Back each flag (§3). The figures that become backed then make `computed` available to later flags.
6. Verdict (§1). In `shadow`, log `{flagged, backed, skipped}` with the figures redacted to their kind, as the reply slot does.

## 6. The census's 27 CN units, worked
This is **my reading of the D303 turns, not a replay.** A's harness is the measurement, and where my reading and A's disagree,
A's stands. "Refused" means the rule would have refused the claim as made. "Missed" means it would have allowed it.

| unit | via | the claim (short) | flagged as | backed in the turn? | rule's answer | what would have backed it |
|---|---|---|---|---|---|---|
| W006 | record | "two 600-s waits" | `600 s` (number) | no 600 printed (the source read shows the constant's name, not its value) | **refused**, but for the RIGHT figure: 600 was true, "two" was the error | `grep applier persist.log` |
| W010 | record | "four unclean shutdowns … three hard freezes" | none: "four" and "three" are words, "hard freezes" is not a state word | n/a | **missed** | Get-WinEvent with the fields |
| W012 | record | "0 forced" | `0` (number) | yes: its own board count printed 0 | **missed**: backed by an instrument that could not see the marking | count FORCED on DELIVERED rows |
| W018 | reply | "C is still logged out" | logged out, seat C (board) | no board or roster read; a transcript tail is not a board read | **refused** | `read_board`, or C's capture |
| W019 | record | "`--setting-sources project` gives 0 hooks" | `0` | yes: `grep -c` printed 0 | **missed**: the right count under an unvaried cwd | the probe from home |
| W020 | reply | "A finished ~03:14 and never rang" | `03:14` (time), finished/rang, seat A | no call before the claim | **refused** | `stat` A's file, plus the QUEUED rows |
| W021 | record | "Panes on L: A, C, E (no B here)" | none: "no B here" has no state word from the list | n/a | **missed** | `data/panes.json` / process list |
| W022 | record | "leaves the real ~/.claude untouched" | untouched, `~/.claude` (fs) | no read of `~/.claude` after the probe | **refused** | `ls ~/.claude/projects` |
| W028 | ring | "98 journals" | `98` | yes: `98 journal` printed | **missed**: the count folded in `.bak` copies | `ls` with extensions |
| W032 | ring | "the 6 TODOs are A's doc-geom tests" | `6` | yes: `todo 6` printed | **missed**: right count, wrong attribution | the TODO rows' names |
| W034 | reply | "friction 0.05, nearly ice" | `0.05` | no tool call in the turn | **refused** | read the car's tyre data |
| W044 | reply | "no event this harness exposes precedes the composition" | none: a generalisation | n/a | **missed** | the per-trial count |
| W049 | reply | "5.7k against its own 30k floor" | `5.7k`, `30k` | no such figure printed | **refused** | the arithmetic, shown |
| W053 | record | "247 run artifacts" | `247` | depends: the packet read in the turn may carry 247 (an echo of the seat's own earlier figure) | **refused or missed**: if the echo backs it, the rule is fooled by its own record | `ls loop/run1/items \| wc -l` |
| W054 | record | "23,232 … ~10 of 12 cards fit" | `23,232`, `10 of 12` | 7,479 and 15,753 printed, so 23,232 is `computed`; 12 printed; "10 of 12" not | **refused** (on "10 of 12", the wrong figure) | per-card sizes in walk order |
| W056 | record | "(confirmed at the line)" | confirmed (compute) | the check runs in the SAME call as the claim, so its result is after | **refused** (`late`) | run the check, read it, then write |
| W058 | record | "0 on all five" (the 04:15 zeros) | `0` | yes: the counts printed 0 | **missed**: the printed command was not the run command | run the printed command |
| W079 | scratch | "chain-status.js prints two hashes" | none: "two" is a word | n/a | **missed** | run `chain-status.js` |
| W080 | ring | "the frame C already has on disk" | on disk (fs) | no fixture listing | **refused** | `ls` C's fixtures |
| W082 | ring | "you are idle" (to the chair) | idle, the chair (board) | yes: a board scan ran, and it even printed `stamp=working` | **missed**: a read of the right source backs it whatever it printed | read the chair's stamp now |
| W084 | record | the plan step "rename cwds" (premise: slugs do not match) | none: a plan step (§2.4) | n/a | **missed** | `ls` the cwds |
| W088 | scratch | "4 of 4 … dir and project exist" | `4 of 4` (count) | yes: four rows printed | **missed**: measured a directory, not the conversation | `persist.log` resume rows |
| W090 | record | the attic address `…-002859` | none: a folder-name stamp is not a figure | n/a | **missed** | the files' own timestamps |
| W092 | reply | "the harness pid 38656 is A's re-confirmation pass" | `38656` (number) | yes: the process list printed it | **missed**: the right pid, the wrong owner | the parent pid |
| W096 | record | "grew 428,177 B" | `428,177` | no computation in the turn | **refused** | the cut, computed in the turn |
| W100 | reply | "the path does not exist and never did" | does not exist (fs) | no call in the turn | **refused** | `ls` the memory dirs (and `git ls-files` would NOT back it: wrong universe) |
| W101 | reply | "B hasn't started its half" | started, seat B (board) | `ls verify/B` ran, which is fs, not board | **refused** | `read_board` for B |

**Count, from this reading: 12 refused, 14 missed, 1 depends (W053).**
- Refused: W006, W018, W020, W022, W034, W049, W054, W056, W080, W096, W100, W101.
- Missed: W010, W012, W019, W021, W028, W032, W044, W058, W079, W082, W084, W088, W090, W092.
- inferred: if A's replay agrees, the check stops about 12 to 13 of 27 (44–48%). B's bar decides whether that is enough. I have
  not seen B's bar.

**What the misses have in common, and what would change it.**
- **Backed by a figure that was right, about a claim that was wrong (7: W012, W019, W028, W032, W058, W088, W092).** The figure
  was in the output, and the error was in what the seat said the figure meant. No presence check catches these. This is the
  design's floor, and it is the "check run, misread" shape one level down. I name it rather than patch it.
- **Not recognised (6: W010, W021, W044, W079, W084, W090).** Number words, "no X here", generalisations, plan premises,
  folder stamps. Number words (W010, W079) are the only group a rule change could recover cheaply (§2.2).
- **A read of the right source, whatever it said (1: W082).** A content check would catch it: "idle" claimed, `stamp=working`
  printed for the same seat. It is left out of v1 because state words would then need a synonym table per source. It is the
  first upgrade if B's bar is missed by a few units.

## 7. Where the rule refuses a right claim
These are the false refusals I can name in advance. A's right-claim sample measures how often they occur.
1. **A figure read in an EARLIER turn.** The rule is turn-scoped, as SOURCES is. A seat that measured a figure an hour ago and
   restates it is refused until it re-runs or re-reads. This is the biggest expected cost. Every collation restates hand-back
   figures, which is fine when the collation turn opens the hand-back (a `literal` backing), and not when it works from memory.
2. **A figure the seat computed in its head from backed figures, without writing the arithmetic** ("about a third").
   `computed` needs the operands written in the message.
3. **A figure in a file the seat itself WROTE this turn.** Write is an input, not a result. It needs a read-back, exactly as
   SOURCES does.
4. **Unit conversions:** `67,911 B` printed and `66 KB` claimed without `~`; or minutes from milliseconds (`75.4 min` from
   `4525603 ms`). The rounded match needs the approximation marker. A conversion table (B↔KB↔MB, ms↔s↔min) is cheap, and I
   recommend it.
5. **A state claim about something the seat just DID** ("committed `fd122708`", "pushed"). The commit command's own output
   backs "committed": a `git commit` result naming the sha is a git read. But "pushed" by a seat that only ran `git push`
   without `-v` output naming the ref would be refused, even though it is right.
6. **Absence after an empty search.** `grep` with no output and exit 1 backs a "0 hits" claim (`empty-result`). But `Glob`
   returning nothing, or a PowerShell `-ErrorAction SilentlyContinue` that prints nothing, gives the checker no input naming the
   thing counted unless the call input names it. Those right claims are refused.
7. **Times of day as labels** ("the 09:41 ruling"). §2.2 flags `HH:MM` only when the unit states something happened at that
   time. That test is itself a heuristic, and some labels will be flagged.

And one way it allows a WRONG claim beyond §6: **an echo backs itself.** A figure the seat wrote earlier into a note or packet
is printed when the seat reads that note, and then backs the same figure again (W053's risk). The check confirms the figure was
SEEN, not that it was measured.

## 8. What A and C need from this, in one place
- **Interface:** §1.
- **Recognizer:** claimrec `units.js`, the reply slot's `TOKEN_KINDS` (minus `path`) plus §2.2's four kinds, and the §2.3
  table.
- **Matcher:** §3. Evidence is results with a `ts` before `outgoing.ts`, plus the prompt.
- **Coverage:** §3.4. v1 is reply + MCP verbs + Write/Edit to `exo_memory/**`. A's replay should report caught and missed BY
  `via`, so B can see what the v1 scope leaves out (v1 reaches 13 of the 27 CN; 12 of the rest were Bash heredocs into the record, §3.4).
- **Switch:** `claim_check` in `~/.consonance.json`, read like `handback_index` (JSON boolean `true` only; off by default;
  `consonance/src-tauri/src/main.rs` `handback_index_from`, D301). In the hook, read as the gates read `gates_mode`.
- **Logged in shadow:** `{via, flagged:[{kind, need, backed}], skipped:[{reason}]}`, with no figure values or claim text. That
  is the reply slot's discipline (`reply-slot.js:96`, "NO surrounding text is kept").

NEXT: librarian collate D305 part 2 when this design and A's and B's parts are committed
