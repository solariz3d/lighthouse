# p-l214-spend-less-A: the probes, a reader agent that carries no intake, and a model-switch note

Pane A, machine L, ledger L214, packet `loop/packet_l214_spend_less_A_2026-11-21.md` (read whole). Built in my own worktree on branch `l214-spend-less` (nothing on main touched). Marked `checked:` or `inferred:`. Evidence: `p-l214-spend-less-A_2026-11-21_evidence/`.

## The result in six lines
1. **R1 (probes): five of the six features are real as described; the sixth (polling) is not what the packet assumed.** Details below.
2. **R2 held:** a reader agent started the new way carries **3,765** tokens on its first call, the old way **44,964** (41,199 fewer): same definition, 100 KB scratch CLAUDE.md.
3. **R3 held:** the model-switch hook warns on a warm session and prints nothing on a cold one; seen live (the warning surfaced, a row was written with real numbers).
4. **R4 held:** `node --test consonance/hooks/dream-gate.test.js` is 1 test, 1 pass, with `model-switch-note.js` in its table.
5. **The polling swap is NOT built, by the probe:** no scripted loop in the room calls a model per poll, so the failure line's second half cannot fire. What does cost a model call per poll is named below.
6. **Nothing installed or registered.** `dev/shell/install.ps1` has a two-row diff for B to read (`install_and_gate.diff`). One side effect: `-NoRegister` copied `model-switch-note.js` into `~/.claude/shell` (inert until registered).

## R1: the probes (2.1.330; a scoped `--settings`, never the user's; keys and numbers)
| item | verdict | what was seen |
|---|---|---|
| `omitClaudeMd` in an agent definition | **seen, works** | `claude -p --agents` with the flag true vs false in a folder with a 100 KB `CLAUDE.md`: first call 44,964 vs 3,765 tokens (checked: `r2_agent_first_call.txt`). An earlier run of the same idea read 19,488 vs 15,575: the harness may cap how much of a large CLAUDE.md a subagent loads, so the saving on the real intake is `inferred:` and should be measured once on the real librarian. |
| `CLAUDE_CODE_SUBAGENT_EFFORT` | **seen, works** | with `low` and with `xhigh` the subagent's own request carries `"effort":"low"` / `"effort":"xhigh"` (its transcript under `subagents/`). |
| the Agent tool's `effort` parameter | **seen in the tool's own schema** (an enum); not run (it may be set only when asked for). |
| agent frontmatter `effort` | **present** in the binary's frontmatter key list; used in the definition below; that it lowers the effort in a run is `inferred:` (not separately run). |
| `PreModelSwitch` / `PostModelSwitch` | **seen** | fired by a stream-json `set_model`. Input keys, both events: `session_id, transcript_path, cwd, prompt_id, hook_event_name, from_model, to_model, requested_model, source, context_tokens, prompt_cache_warm, cache_ttl, estimated_cache_write_usd, pricing` (`probe_modelswitch_keys.jsonl`). `source` read `sdk`. |
| can `PreModelSwitch` warn or block | **both** | the binary's text: "Before a requested model switch (/model, model picker, set_model)", and its output handling includes `blockingError` and a permission decision, so it CAN block. This hook warns only (a row asserts no decision is printed). |
| `StopFailure` | **present, input not observed** | description read from the binary ("Fires instead of Stop when an API error … ended the turn. Fire-and-forget"); matchers `rate_limit, overloaded, authentication_failed` and others. I cannot cause an API error, so its keys are unseen. |
| `notify_when_idle` | **seen, the subscription works** | `SendMessage` with `notify_when_idle: true` and no message to `sibling-5bf9d657-33` returned "Subscribed … one notice when it is next idle". The notice itself had not arrived when I wrote this (`inferred:` it arrives when that seat idles). Same-machine only, main conversation only; `ListAgents` shows each peer idle or busy. |

**The room's polling loops, named** (grep over `consonance/` and `exo_memory/loop/`):
- `exo_memory/loop/api_error_watch_2026-11-13.js:66`: a `setInterval` reads the board's tail **every 10 s** and exits on a stopped seat; **0 model calls per poll**; it wakes the seat that started it once, on exit. It is already push-shaped; `StopFailure` would report at the moment, but its input is unseen.
- `consonance/src-tauri/src/main.rs` `keep_warm_tick`: **one model call per seat per ~45 minutes, by design** (keep-warm timing is outside this lap).
- `consonance/hooks/second-reader-worker.js`: one `claude -p` per hand-back ring (event-driven, not a poll).
- `dream-watch.js`, `transcript-watch.js`: a `schtasks` query and a file scan on a prompt; no model.
- **What does cost a model call per poll is a seat running its own `Monitor` loop** (a heartbeat or `until` loop whose every line wakes the seat). I ran one tonight, a one-minute heartbeat for a train, and stopped it. That is a habit, not a file. The push form is `notify_when_idle` (seen) for another seat, and a Monitor that emits only on the end state.
So the packet's premise holds for seat-run Monitor loops and keep-warm, not for a scripted watcher: there is no "costliest scripted loop", and I built nothing to replace one.

## What I built
- `dev/shell/agents/room-reader.md`: the definition (read-only tools, `effort: low`, `omitClaudeMd: true`). **Not installed:** an agent definition belongs in `~/.claude/agents/` or a seat's `.claude/agents/`, which `install.ps1`'s `$dest` (`~/.claude/shell`) does not cover; copying it is a step for B to rule on. `consonance/tools/agent-first-call.js` is R2 as a command (two `claude -p` runs on haiku in a temp folder, a few cents); `agent-first-call.test.js` has 3 rows, 3 of 3.
- **The one setting that makes lower effort the default for agents a seat spawns:** `CLAUDE_CODE_SUBAGENT_EFFORT` (seen to work). It is an environment variable of the seat's `claude` process, so it belongs in the user's settings `env` block or in the app's spawn; I added neither (a settings change needs B's read, and the spawn is B's file). A first value to try: `medium`.
- `consonance/hooks/model-switch-note.js` and its test (6 rows, 6 of 6; mutants **applied 8 / caught 8 / NOT APPLIED 0**, `mutants_run.txt`): PreModelSwitch; the dream guard first and the 3,000 ms unref'd watchdog (B's catch of tonight); it warns when the cache is warm and the context is at least 50,000 tokens (`CONSONANCE_MODELSWITCH_MIN` is the dial), prints `{"systemMessage": ...}`, never blocks, and writes one numbers-only row per switch to `<data>/model-switch.jsonl`. The rows were written with the hook, not before it, so red-first is shown only by the mutants.
  - **Live (R3):** a scratch session, one reply, then `set_model` to haiku with the floor at 1,000: the warning surfaced as an `informational` stream message ("model switch claude-sonnet-5-5 -> claude-haiku-5-5: this seat's cache is warm, and the switch will rewrite about 27k tokens (an estimated $0.01 at list price)", `r3_live_warning.txt`) and the row read `context_tokens 26536, warm true, est_usd 0.0053` (`r3_live_row.jsonl`). A switch before any reply read `context_tokens 0`, so nothing was said. **Not seen:** the note in a seat's TUI after `/model`.
- `install.ps1` (+4) and `dream-gate.test.js` (+2): a `$files` row, a `$register` row on `PreModelSwitch` (no matcher), the dream-gate entry marker. checked: dream-gate 1/1 (both new rows ok), `install-manifest` 5/5, `install-holds` 7/7, `install-fresh-home` 3/3.

## Registered, scored
- R1 held (above). R2 held: 44,964 vs 3,765. R3 held (6 rows, live once). R4 held.
- **Failure line:** "a reader agent's first call still carries the room's intake": the new way carries 3,765 tokens in a folder with a 100 KB CLAUDE.md, so no (a scratch folder, not the room's real intake: `inferred:` the same on the librarian). "A polling loop is still running after its push form is on": no push form was switched on and nothing ran.

## Not done, and open
The real librarian's first-agent token count with the definition in place; installing the agent definition and the effort variable (B to rule); `StopFailure`'s keys; the model-switch note in a real TUI; what `notify_when_idle` does when the subscribed seat is in a class that holds it.

## Where it stops
Branch `l214-spend-less` in worktree `C:\Consonance\lh-wt-l214`, committed by named paths. Scratch: `scratchpad\l214\`. Main untouched. Nothing running.

NEXT: pane B read `p-l214-spend-less-A_2026-11-21_evidence/install_and_gate.diff` and `consonance/hooks/model-switch-note.js` on `l214-spend-less`, then rule where the agent definition and `CLAUDE_CODE_SUBAGENT_EFFORT` are installed, when the librarian has routed this; the librarian lands the branch after B's read and B's ledger install.
