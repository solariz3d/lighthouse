# Probe: does a PreToolUse hook's additionalContext reach the model in the same turn?

Run 2026-11-13 (about 20:15Z), by a subagent of the librarian seat. Method copied from
`exo_memory/loop/wake_level2_2026-11-13/01_probes_q1_q2.md`. Marks: [read] I saw it; [inferred] I reasoned it; [ours] my choice.

## Answer

**Reached the model in 3 of 3 runs** when the hook printed the documented JSON (`hookSpecificOutput.additionalContext`,
exit 0) [read]. Plain stdout from the same hook (exit 0, no JSON) reached the model in **0 of 3** runs [read].
No hook (control): 0 of 3 [read]. The variant with `permissionDecision: "allow"` was not needed, so not run [ours].

## Version

`claude --version` printed `2.1.323 (Claude Code)` [read]. `--model haiku` was accepted; the stream reported
`claude-haiku-5-5` [read: `out_A_1.jsonl`].

## Docs (downloaded with curl, read as text)

Page: https://code.claude.com/docs/en/hooks , saved as `hooks.html`, text in `hooks.txt` in `C:/Users/nname/AppData/Local/Temp/claude/docs-dl/`.

- Section "Add context for Claude" [read]: "The `additionalContext` field passes a string from your hook into Claude's
  context window. Claude Code wraps the string in a system reminder and inserts it into the conversation at the point where
  the hook fired. Claude reads the reminder on the next model request, but it doesn't appear as a chat message in the
  interface." And: "PreToolUse, PostToolUse, PostToolUseFailure, and PostToolBatch: next to the tool result".
- Same section, shape [read]: `{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "..."}}`.
  For PreToolUse the event name is "PreToolUse".
- Section "PreToolUse decision control", field table [read]: "additionalContext: String added to Claude's context
  alongside the tool result. Ignored when permissionDecision is "defer"." `permissionDecision` takes allow/deny/ask/defer.
- Section "Exit code 0" [read]: "For most events, Claude Code writes stdout to the debug log and doesn't show it in the
  transcript. On these events, your stdout reaches Claude or the compaction summary: UserPromptSubmit,
  UserPromptExpansion, SessionStart, and PostModelSwitch". PreToolUse is not in that list, so docs predict plain stdout
  does not reach the model [read]. The runs agree.

## Setup [ours]

Temp folder T = `C:/Users/nname/AppData/Local/Temp/claude/pretool-probe-3cf6e0c2/`. One project per arm: `armA`, `armB`,
`armC` (and `armAV`, built, unused), each with its own `.claude/settings.local.json`. Nothing written under
`C:/Users/nname/.claude` by me (the CLI wrote its own transcripts there) and nothing under `C:/Consonance`.
Each run: fresh random 8-hex token written to `armX/token.txt`; hook reads it, appends a timestamped line to `armX/hook.log`.
Command per run (`tools/run.sh`): `claude -p --model haiku --session-id <uuid> --setting-sources project,local
--strict-mcp-config --allowedTools Bash --output-format stream-json --verbose "<prompt>" </dev/null`.
Prompt: "Run the command echo hello with the Bash tool, exactly once. Then answer in one line: did any text reach you
besides the command's output? If a PROBE-TOKEN appeared anywhere in your context, repeat the token exactly; otherwise say NONE."

Hook line printed (token varies): `PROBE-TOKEN-<8hex>: if you can read this line, write the token in your final answer.`

Arm A hook output, one line, exit 0:
`{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"<the line>"}}`
Arm B hook output: the line alone as plain text, newline, exit 0. Arm C: settings `{}`.
Hook command (A): `node ".../tools/hook.js" json ".../armA"`; B uses `text`.

## Runs

| Arm | Run | Token | Hook fired | Token in final answer | Token in stream output | Token in transcript |
| :- | :- | :- | :- | :- | :- | :- |
| A | 1 | ad9be298 | yes | yes | yes | yes |
| A | 2 | 4fc2a6e1 | yes | yes | yes | yes |
| A | 3 | b1d2e78e | yes | yes | yes | yes |
| B | 1 | d3b80329 | yes | no ("NONE") | no | yes, 1 row only (`hook_success`) |
| B | 2 | 3a1e7722 | yes | no | no | same |
| B | 3 | b8eae524 | yes | no | no | same |
| C | 1 | e58543aa | no | no | no | no |
| C | 2 | 5e5d4371 | no | no | no | no |
| C | 3 | 70ef002f | no | no | no | no |

All [read]; script `tools/tab.js`, full outputs `out_<arm>_<n>.jsonl`, hook logs `armX/hook.log` (3 lines each for A and B).

Transcript rows (types and counts only), run A1 vs B1 [read]:
- A1 has the token in 4 rows: an `attachment` of type `hook_success`, an `attachment` of type `hook_additional_context`,
  an `api-request-blob` (the request sent to the model), and the final `assistant` row.
- B1 has the token in 1 row only: the `hook_success` attachment. It is in no `api-request-blob` and not in the answer.
- Each transcript is 37 to 40 rows; same row types across arms plus one extra `attachment` row per hook output.

Each final answer in A repeated the token and described it as hook text, e.g. "a PreToolUse hook note said the token
should be written in my answer" (run 3). Arm B and C answers mentioned only a "working directory was reset" note.

## Not established

- Only `-p` with `--output-format stream-json`; interactive TUI not run [ours]. The docs describe one mechanism for both [inferred].
- Only Bash and only a command that succeeds; PreToolUse before a denied or failed call not tried.
- Whether the model acts on it in the same turn beyond repeating a token: here it acted on an instruction in the text (it wrote the token) [read].
  Whether the text arrives before the tool runs or after the result: the docs say "next to the tool result" [read: docs]; I did not
  read the order inside the request blob.
- The `permissionDecision: "allow"` variant (not needed). Multiple hooks, long strings (docs cap 10,000 chars), Windows paths with spaces.
- `--setting-sources project,local` still loads `C:\Users\nname\.claude\CLAUDE.md` as a project file (as the earlier probe found);
  user-scope hooks stayed out. A seat's real hooks were not tested [inferred].
- Haiku only; the harness path should not depend on model [inferred].

## Left behind

`C:/Users/nname/AppData/Local/Temp/claude/pretool-probe-3cf6e0c2/` (tools, arms, outputs, runs.txt). Docs copy in
`C:/Users/nname/AppData/Local/Temp/claude/docs-dl/`. 9 `claude` sessions run; their transcripts are under
`C:/Users/nname/.claude/projects/` in folders named after the arm paths.
