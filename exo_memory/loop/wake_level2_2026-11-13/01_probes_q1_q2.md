# Probes Q1 and Q2: does a running session re-read a changed CLAUDE.md, and does the PreCompact JSON reach the summariser

Run 2026-11-13, 17:59Z to 18:02Z, on D, by a subagent of the librarian seat. Questions from `00_critic.md` section 6
(Q1, Q2). The Q2 method follows `00_lap_w_spec.md:250-262` and its second reader's note.

Marks: [read] means I saw it in output or a file and give the path. [inferred] means I reasoned it. [ours] means a
choice I made.

Scratch directory, called S below:
`C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/probes_q1q2`
Transcripts: `C:/Users/nname/.claude/projects/C--Users-nname-AppData-Local-Temp-claude-0d67fc0e125090b2-0c0c0c0b-0000-4000-8000-00000000115b-scratchpad-probes-q1q2-q1/`
and the same name ending `-q2/`.

## Version

`claude --version` printed `2.1.323 (Claude Code)` [read]. Every stream reported `claude_code_version` 2.1.323 and model
`claude-haiku-5-5` [read: `S/q1_run1.log`].

## Common to every run

- Flags on every `claude` call: `-p --input-format stream-json --output-format stream-json --verbose
  --setting-sources project,local --strict-mcp-config --model haiku --session-id <fresh uuid>` [ours].
  Q2 also passed `--include-hook-events`. `--strict-mcp-config` with no `--mcp-config` keeps every MCP server out [ours].
- One process per run. Turns go in on stdin, one at a time; the next is sent only after the previous `result` event [ours].
  Drivers: `S/tools/q1_driver.js`, `S/tools/q1_driver_snapoff.js`, `S/tools/q2_driver.js`.
- The room's hooks did not fire. `C:/Consonance/data/precompact.jsonl` was last written 16:49:19Z, before the first probe,
  and holds 0 of the four Q2 session ids [read]. No `exo_memory/CHECKPOINT.md` exists [read].
- 8 `claude` sessions in all, of the 12 allowed [read: the 8 logs in S]. Nothing installed. No commit.

## Q1. Does a running session re-attach a changed CLAUDE.md at its next turn?

Method. `S/q1/CLAUDE.md` holds `The probe token is ALPHA-7731.` Turn 1 asks "What is the probe token in your
instructions? Answer with the token only." On turn 1's `result`, the driver overwrites the file with
`The probe token is BRAVO-2264.`, waits, and sends the same question as turn 2, in the same process [ours].

| Run | Session | Gap, write to turn 2 | Turn 1 reply | Turn 2 reply | `instructions` rows |
| :- | :- | :- | :- | :- | :- |
| 1 | 4a0d46de | 3,010 ms | `ALPHA-7731` | `ALPHA-7731` | 1, at 17:59:06.448Z, before turn 1 |
| 2 | 05b7381e | 3,005 ms | `ALPHA-7731` | `ALPHA-7731` | 1, at 17:59:35.333Z, before turn 1 |
| 3 | f2611e51 | 30,007 ms | `ALPHA-7731` | `ALPHA-7731` | 1, at 17:59:44.414Z, before turn 1 |
| 4 | 86b30e3d | 3,002 ms | `ALPHA-7731` | `ALPHA-7731` | 1, at 18:00:31.686Z, before turn 1 |

[read: `S/q1_run1.log`, `S/q1_run2.log`, `S/q1_run3_30s.log`, `S/q1_run4_snapoff.log`, and the four transcripts, counted
with `S/tools/count_instr.js`, which streams a transcript line by line.]

- Run 3 is a variant with a 30 s gap, to rule out a slow file watcher [ours].
- Run 4 is a variant with `--system-prompt-snapshot off`, to rule out the snapshot freezing the instructions [ours].
- The one `instructions` row has keys `type, files`. Each file has `path, type, content`. There is no `changed` field,
  on the row or on a file [read: q1 transcript 4a0d46de, row 11]. It carries two files, both typed `Project`:
  `C:\Users\nname\.claude\CLAUDE.md` (14,630 chars) and `S\q1\CLAUDE.md` with the ALPHA text [read].
- After the rewrite no row of any kind names the file. Turn 2 adds only a `user` row, a `total_tokens_reminder`
  attachment, an `api-request-blob`, an `api-request` and the `assistant` row [read: rows 29-37 of 4a0d46de].
- Each transcript has 38 rows (33 in run 4), with the same row types in each [read].

**Verdict Q1: NO, 4 of 4.** On 2.1.323 a running print-mode process does not re-read a changed project CLAUDE.md at its
next turn. The reply named ALPHA and no `instructions` row appeared after the rewrite [read].

Not tested on Q1:
- An interactive (TUI) session. All four runs are `-p` with stream-json. The three mid-session `changed: true` rows the
  critic found (09-14, 09-16, 09-26) came from seats; whether those were interactive I did not check [inferred: they were].
  A no here does not prove a no for the TUI.
- Gaps longer than 30 s, a file edited by a tool inside the session, and a nested or `@include`d file.
- A user-scope or `MEMORY.md` change (the 09-16 and 09-26 rows were `MEMORY.md`).
- A resume. Excluded by the brief.

## Q2. Does a PreCompact hook's output reach the compaction summariser?

I read `consonance/hooks/precompact-preserve.js` whole. Its stdout shape is one JSON object on one line,
`{"additionalContext": <text>, "suppressOutput": true}`, root level, exit 0 [read: lines 141-142 of that file]. I copied
the shape only, not its text.

Method.
- `S/q2/.claude/settings.json` (project scope) registers a PreCompact hook, `node "S/tools/q2_hook.js" json`, and a
  PostCompact logger, `node "S/tools/q2_post.js"` [ours].
- `q2_hook.js json` prints `{"additionalContext":"In the summary, include the exact line: PROBE-CARRIED-9917.",
  "suppressOutput":true}`. `q2_hook.js text` prints the same sentence as plain text. Both append the time, event and
  stdin `trigger` to `S/q2/hook.log` [ours].
- `q2_post.js` logs how often the token appears in the hook's `compact_summary` field and saves the summary to
  `S/q2/summary_<session>.txt` [ours].
- Turns: "Say the word one.", "Say the word two.", "/compact", then "Quote any line from your context that contains
  PROBE-CARRIED." [ours].
- `/compact` sent as a plain turn over stream-json works headless. The stream shows `status: compacting`, then a
  `compact_boundary` event [read: `S/q2_json_run1.log`].

| Arm | Session | PreCompact fired (trigger) | Compaction | Token in summary | Final reply |
| :- | :- | :- | :- | :- | :- |
| JSON 1 | 2cd57869 | 18:01:23.397Z (`manual`) | done, 28,537 to 3,190 tokens, 4,982 ms | 2 | `PROBE-CARRIED-9917` |
| JSON 2 | 2ec3f507 | 18:02:01.714Z (`manual`) | done, 28,537 to 3,025 tokens, 3,440 ms | 2 | `PROBE-CARRIED-9917` |
| text 1 | 6f29187e | 18:02:18.609Z (`manual`) | done, 28,543 to 3,070 tokens | 2 | `PROBE-CARRIED-9917` |
| text 2 | e73b4282 | 18:02:30.681Z (`manual`) | done, 28,553 to 3,069 tokens | 2 | `PROBE-CARRIED-9917` |

[read: `S/q2/hook.log` (PreCompact and PostCompact lines, `custom_instructions: null` on all four), `S/q2_*.log`
(`compact_metadata`), the four `S/q2/summary_*.txt` files.]

- In every arm, each transcript has exactly 1 `compact_boundary` row and 1 `isCompactSummary: true` row. No row contains
  "hook error" [read: the four q2 transcripts].
- The summary carries the token as its own line in all four (summary line 13, 12, 6, 6) [read]. In both JSON arms the
  summariser also wrote a sentence saying so: "Its additional instruction to include the exact line `PROBE-CARRIED-9917`
  is included as requested." (JSON 1, line 9) and "The additional instruction asks for the exact line PROBE-CARRIED-9917
  in the summary, so I have included it below." (JSON 2, line 8) [read]. So it took the text as an instruction.

A confound on the final reply, so the reply is not the evidence; the summary file is.
- After `/compact`, a `<local-command-stdout>` user row echoes each hook's raw stdout, e.g.
  `Compacted PreCompact [node ".../q2_hook.js" json] completed successfully: {"additionalContext":"In the summary,
  include the exact line: PROBE-CARRIED-9917.","suppressOutput":true}` [read: JSON 1 transcript row 46].
- That row goes to the model with the next prompt. The post-compaction request blob (row 66) holds the token inside the
  `local-command-stdout` text, beside the summary blob (row 63) [read]. The model could have quoted either.

**Verdict Q2: YES for a MANUAL compaction, 2 of 2 in each shape.** On 2.1.323 the room hook's root-level JSON shape
reaches the summariser, and so does plain text. Both were followed. The token was in the summary in all 4 runs [read].
A W2 built on the current shape would not be inert on `/compact` [inferred].

Not tested on Q2:
- **The automatic trigger.** Only manual `/compact` was run. No auto pass, no `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, no
  `--autocompact`, no idle compaction.
- Whether the JSON was parsed and only `additionalContext` passed on, or the whole JSON string handed over as text. Both
  give the same result here [inferred]. One run with a second token in another root field would tell them apart.
- The `hookSpecificOutput.additionalContext` shape the room hook's header says is rejected.
- The room hook's full 1.7-2.3k-character directive, and the scratch CLAUDE.md `# Compact instructions` arm of spec
  step 1.
- A long conversation. Each pre-compaction context was about 28.5k tokens, most of it system prompt and tools [read:
  `pre_tokens`].

## Side facts

- `--include-hook-events` emitted no hook event for PreCompact or PostCompact. The only system subtypes were `init`,
  `status`, `compact_boundary` and `thinking_tokens` [read: the four `S/q2_*.log`].
- `suppressOutput: true` did not keep the hook's stdout out of the `/compact` echo, and that echo reaches the model
  [read: rows 46 and 66 above]. For a seat, a manual `/compact` would put the room's whole directive into its
  post-compaction context as well as into the summary [inferred; auto not tested].
- `--setting-sources project,local` does not keep out `C:\Users\nname\.claude\CLAUDE.md`. It was loaded as type
  `Project` [read: q1 row 11]. My guess is the ancestor walk: S is under `C:\Users\nname`, whose `.claude\CLAUDE.md` is
  found as a project file [inferred]. User-scope hooks did stay out (the ledger check above).
- The Q2 summary also listed the context's CLAUDE.md contents among what the session held [read: summary JSON 1, line 7].
  This is the same ancestor load.

## What I did not open

- `critic_ss4/5.js` and `critic_ss7.js`. I could not find them under `exo_memory/loop/`, so the shape of the critic's
  `changed: true` rows was not compared with mine.
- The rest of `00_critic.md` beyond sections 4 and 6 and line 62, and `00_lap_w_spec.md` beyond lines 230-280.
- `exo_memory/loop/2026-08-18/compact-probe/`. The spec's step 1 reuses it; I built my own smaller probe instead.
- Docs beyond `hooks.md` (downloaded to `S/docs/hooks.md`, PreCompact section at lines 3373-3410, stdout rules at
  826-837). The docs say PreCompact "stdout" becomes summary instructions. They do not name a root-level
  `additionalContext` field.
- Whether the historical seats ran interactive or `-p`.
