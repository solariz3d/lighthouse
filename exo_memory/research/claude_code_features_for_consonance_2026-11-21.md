# Claude Code features that bear on Consonance, newest to oldest (the Third Place on L, 2026-11-21)

Asked by the keeper, 00:26: "can we help the lib by doing some work for them quick? Lets do some comprehensive research
into all anthropic feature for claude code, new and old, that would be beneficial to consonance, start from newest to
oldest."

## How this was read (re-run it to check any line)

- **Source:** Anthropic's own changelog, raw (`curl https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`,
  1,382,549 bytes, 446 versions, 0.2.21 to 2.1.330). Installed here: `claude --version` = 2.1.330.
- **Dates:** the changelog has none; each version's publish date is from `npm view @anthropic-ai/claude-code time --json`.
- **What was read:** 982 lines that add something (lines starting Added, New, Introduced and the like). Read whole for
  10-15 to 11-20 (146 lines); for 08-27 to 10-14 and 06-15 to 08-26 with enterprise, editor and fix lines left out;
  before 06-15 only lines that touch hooks, sessions, agents, memory, MCP, caching or usage. A feature announced only
  in a "Changed" or "Improved" line can be missed by this filter.
- **Code Mode** was also read on its own docs page (`https://code.claude.com/docs/en/code-mode.md`, raw markdown).
- **"Used now"** is a count of files under `consonance/`, `dev/` and the JSON/JS/RS/PS1 files of lighthouse that name the
  feature (`git grep -l -i`), plus the keys of `~/.claude/settings.json` on L. Zero means not named, not "proven
  unused".
- Marks: each feature line is **[read]** from the changelog at the version given. Every "why it matters here" is
  **[inferred]**, this seat's reading of the room, and not checked against the code beyond the counts above.

## The short list: what looks most worth the room's time

1. **Idle compaction and the prompt-cache meters** (2.1.299, 2.1.251, 2.1.260) against the keep-warm visits. The room
   already measured idle compaction (`main.rs:13760`, `idle_compaction_keepwarm.md`); the cache meters are not named
   anywhere (0 files).
2. **Subagent cost controls**: `omitClaudeMd` (2.1.271), `CLAUDE_CODE_SUBAGENT_EFFORT` (2.1.316), the Agent tool's
   `effort` (2.1.292), per-subagent `autoCompactWindow` (2.1.296). 0 files each.
3. **MCP**: `alwaysLoad` (2.1.121) for the consonance server, MCP tasks (2.1.319), channels (2.1.80). 0 files each.
4. **Hooks that replace polling**: `StopFailure` (2.1.78), `PreModelSwitch`/`PostModelSwitch` (2.1.251), Stop hooks
   that continue the turn (2.1.163), `onFailure: "block"` (2.1.295). Settings on L register six events only.
5. **Code Mode** (2.1.323), the one everyone is talking about. Real gains for many-call sweeps, and four limits that
   collide with how the room runs (below). A trial in one seat, not the room.

## By date, newest first

### 11-21 back to 10-15

- **Code Mode** (2.1.323, 11-12; teams 2.1.326, 11-16). Claude writes JavaScript that makes several tool calls in one
  step: parallel commands, one result fed to the next, only the needed part returned. Turned on with
  `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1` in the shell or user settings (ignored in project settings). Docs, [read]:
  terminal only; a Code Mode session resumes only with Code Mode on; no Remote Control, no background sessions, `/fork`
  can't start a background copy; code stops after ten minutes unless it can run in the background; on Windows needs Git
  for Windows; won't start with OpenTelemetry export or `DISABLE_TELEMETRY` (2.1.329 later allowed OpenTelemetry
  events and metrics). Hooks still run on each tool call.
  *Here:* the room's reads and sweeps (grep a dozen files, read three, filter) are exactly the many-call tasks it is
  built for, and every turn it saves is a re-read of a large context. The resume rule is the risk: a seat started
  with it must always be resumed with it, and Consonance resumes seats by script. Untested here.
- **MCP tasks in the terminal** (2.1.319, 11-06). A server tool call run as a task moves to the background at once and
  its result arrives when done (`CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` to wait instead).
  *Here:* `call_librarian` and the chair tools could return immediately while delivery happens, instead of holding the
  turn.
- **`permissions.denyInsteadOfPrompting`** (2.1.319). A call that would wait on a permission prompt is denied and the
  turn goes on, in sessions, subagents and teammates. Also `--permission-prompts none` (2.1.259) for headless hosts.
  *Here:* a pane that would sit on a prompt nobody sees fails loudly instead.
- **Finished subagents stay reachable** (2.1.319): `/tasks` lists them under "Earlier in this session", to reopen and
  message after a restart. And 2.1.329: scheduled tasks, `/loop` wakeups, the goal and forks in `/tasks`.
- **`CLAUDE_CODE_SUBAGENT_EFFORT`** (2.1.316). The effort subagents run at when nothing names one, instead of the
  session's. *Here:* the librarian at xhigh spawns readers at xhigh today unless each call says otherwise.
- **`$.model.fork` with `effort`** for mods (2.1.318): a quick side job at low effort whatever the session uses.
- **`CLAUDE_CODE_DISABLE_AGENT_PROGRESS_SUMMARIES`** (since 2.1.318). Turns off subagent progress summaries and the
  requests that write them. *Here:* a cost line nobody reads in a pane.
- **`CLAUDE_CODE_RESUME_HINT_COMMAND`** (2.1.323). A program that starts Claude Code sets what the exit hint tells you
  to run. *Here:* the exit hint could name Consonance's own relaunch instead of `claude --resume`.
- **`onFailure: "block"` for `mcp_tool` hooks** (2.1.328), as for command and HTTP hooks (2.1.295).
- **`CLAUDE_CODE_DISABLE_DEFERRED_TOOL_RESUME`** (2.1.328): a host can stop `-p --resume` from running a tool call a
  hook deferred.
- **`/status` lists broken agents, skills, commands, output styles, and hook matchers that never match** (2.1.327).
  *Here:* a free check of the room's hook wiring after every install.
- **Trust dialog names where a folder's hooks are declared** (2.1.329).
- **`permissions.blockWritesOutsideWorkingDirectories`** (2.1.314). Write and Edit refuse paths outside the working
  directories in every mode. *Here:* seats write across `C:\Consonance\…` on purpose, so this would need care, but a
  pane meant to touch only its worktree could carry it.
- **Fable 5.2** (2.1.321, 11-09): 1M context, $8/$40 per million tokens, cache reads $0.20 (API prices).
- **Idle compaction in the terminal** (2.1.299, 10-14). A 200K+ token conversation idle about 54 minutes is compacted
  before its one-hour cache expires, so the next message does not reprocess it all.
  `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` changes the 200K floor; `"idleCompaction": false` turns it off (2.1.290+).
  *Here:* this is the same problem the keep-warm visits solve the other way (keep the cache alive instead of
  compacting). The room has measured it; whether the two fight each other on a seat that gets a visit at minute 53
  is worth one look.
- **`/usage` warnings for max effort, workflows, always-on context and large tool results** (2.1.299).
- **Program Status Protocol** (OSC 7501, 2.1.295): a terminal that implements it shows whether Claude is working,
  waiting on you, or done. *Here:* Consonance's pane frames could show each seat's state without reading transcripts.

### 10-14 back to 08-27

- **Claude Mods** (2.1.287, 10-01): plugins that change deeper behavior. What they can do by now, each [read]:
  `prompt.submit`, `prompt.change`, `session.append`, `tool.check` (with `decider: "person"`), `agent.spawn` (refuse or
  rewrite a workflow agent's prompt and model), `$.model.complete` with prompt caching, `$.model.fork`, `$.ui.notify`,
  `$.ui.view({agentId})`, panes and text drawn in the prompt box. The plugin-authoring skill in this session builds
  them.
  *Here:* the pulse line, the dream watch and the state block reach every seat today through hooks that run a process
  per prompt; a mod could hold them in one place, and `agent.spawn` could set every workflow agent's model and effort
  from the room's lean plan.
- **"You should know"** (2.1.287): a built-in mod where a side agent watches and flags things you or Claude might miss.
- **Opus 5.5** (2.1.280): $4/$20, cache reads $0.20. **Sonnet 5.5** (2.1.284): $2/$10. **Haiku 5.5** (2.1.293):
  $0.10/$0.50 (API prices).
- **The Agent tool's `effort` parameter** (2.1.292): run a sub-agent at a named effort.
- **`autoCompactWindow`** in subagent frontmatter and `--agents` (2.1.296): a subagent compacts earlier than the main
  conversation. **`CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL`** (2.1.296): every workflow agent on one model.
- **Read `allow_large`** (2.1.296): read a whole large text file in one call when context has room. *Here:* the
  briefs and masters are large; today they are read in slices.
- **`onFailure: "block"`** for command and HTTP hooks (2.1.295): a hook that cannot start, times out or exits oddly
  blocks the action instead of letting it through. *Here:* the room's gates (delete-gate, read-before-edit) fail open
  today if their process dies. Named in 2 files already.
- **`/doctor prompt-audit`** (2.1.283): audits CLAUDE.md files, skills, agents and commands for prompting written for
  older models. *Here:* the intake is large and was written across many model versions.
- **`CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH`** (2.1.280): changes the 2,048-character cap on MCP tool descriptions
  and **server instructions**. *Here:* the consonance server's instructions are cut at 2,048 characters unless raised.
- **AGENTS.md** read when there is no CLAUDE.md (2.1.277).
- **Send-now key** (2.1.275): interrupt the turn and send all queued messages at once.
- **Skills and plugins on the claude.ai account sync into terminal sessions** (2.1.275); opt out with
  `syncClaudeAiSkills: false`, `syncClaudeAiPlugins: false`. *Here:* each seat's intake can grow from the account
  without anyone in the room choosing it.
- **`CLAUDE_CODE_MCP_STARTUP_WAIT_MS`** (2.1.274): bounds how long a headless first turn waits for MCP servers.
- **`omitClaudeMd`** in agent frontmatter and `--agents` JSON (2.1.271): custom and plugin subagents run without user,
  project and local CLAUDE.md files. *Here:* a reader agent spawned from a room seat may load the room's intake of
  80k+ bytes before reading one page; this is the switch for that.
- **`claude plugin eval`** (2.1.269): scored, reproducible runs of a plugin's eval suite.
- **`CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS`** (2.1.269).
- **`--system-prompt-snapshot off`** (2.1.267): render the system prompt fresh each request, for iterating on prompt
  text. *Here:* for testing intake changes; it costs the cache.
- **`--plugin-dir` at a folder of plugins**, picked up live (2.1.265). **1 GB cap on saved tool results** (2.1.265).
- **`bashOutputMaxChars` and `taskOutputMaxChars`** (2.1.261), up to 128K inline. **`/skill-doctor`** (2.1.261):
  which loaded skills go unused and what they cost in context.
- **Likely cause of a prompt-cache miss** in `/cost` and the status line's `prompt_cache` field (2.1.260): tool
  definitions changed, system prompt changed, idle past the TTL. *Here:* the room's usage questions of 11-14 were
  answered by hand; this measures them per seat.
- **`--permission-prompts none`** (2.1.259).
- **`CLAUDE_CODE_SUBAGENT_MODEL_FORCE`** (2.1.257): one model for every subagent, ignoring per-spawn overrides.
- **`PreModelSwitch` and `PostModelSwitch` hook events** (2.1.251): block, confirm or annotate a model switch. And
  **`SessionStart` resume hooks now receive the session's staleness and the estimated re-cache cost.** *Here:* the room
  switches models by hand (11-12, 11-14) and the record of each switch is written after the fact; a hook writes it at
  the switch. The re-cache cost at resume is the number the lean plan has been estimating.
- **Per-session prompt-cache line in `/cost`** (hit ratio, misses, tokens re-cached, warm or cold) and a `prompt_cache`
  object for status line scripts (2.1.251). 0 files.
- **`claude attach`, `logs`, `stop`, `respawn`, `rm`** for background sessions (2.1.251; names accepted 2.1.290).
- **`experimental.cacheTtl`** per agent (2.1.248), and `promptCacheTtl` / `subagentPromptCacheTtl` (2.1.243): 1-hour
  cache on the main conversation, 5 minutes for subagents (for API-key and cloud users).
- **`--restricted`** (2.1.248): no command-running tools, file tools kept inside the working directory.

### 08-26 back to 06-15

- **`SendFeedback`** (2.1.247): Claude drafts a feedback report for you to send from `/feedback`.
- **Loops breakdown in `/usage`** (2.1.243): per-loop runs and tokens.
- **The model and effort each subagent ran on, in `/tasks`** (2.1.243).
- **Concise output style** (2.1.237): leads with results, no narration.
- **`ANTHROPIC_DEFAULT_MODEL`** (2.1.236): the model new sessions start on, while `/model` still overrides.
- **Cross-session `SendMessage` and `ListAgents`** (2.1.224, macOS and Linux when added; the librarian's messages to
  this seat arrive this way on Windows now), with **`notify_when_idle`** (2.1.236): ask another session for one notice
  when it next goes idle, no polling. And **`crossSessionInbound` / `dialogExpiry`** (2.1.224, `/config` rows 2.1.232):
  messages to a session running with bypassed permissions are held for approval. *Here:* the room waits on other seats
  by watcher loops that poll the board; `notify_when_idle` is the push form. The bypass hold matters because the panes
  run bypassed. 0 files name any of the three.
- **`CLAUDE_CODE_PROJECT_DIR_NAME`** (2.1.234): hosts that give each session its own config directory choose a short
  name for the per-project transcript directory. *Here:* possibly bears on the room's per-machine `sibling-<random>`
  directory defect (`record/retired_seats_2026-09-11.md`); not checked.
- **Cap on concurrent subagents** (default 20, 2.1.217) and on spawns per session (default 200, 2.1.212); WebSearch
  calls per session (default 200, 2.1.212).
- **Transcript write failures are now warned** (2.1.217) instead of lost silently.
- **`--forward-subagent-text`** (2.1.211): subagent text and thinking in stream-json.
- **`DirectoryAdded` hook** (2.1.219).
- **An auto mode rule that blocks tampering with session transcript files** (2.1.205). *Here:* the room's carry and
  restore scripts move transcripts; a seat in auto mode running them would be stopped.
- **Background agent notifications fire the `Notification` hook** (`agent_needs_input`, `agent_completed`; 2.1.198).
- **`/dataviz` skill** (2.1.198). **`/config key=value`** for any setting (2.1.181).
- **`Tool(param:value)` permission rules** (2.1.178), e.g. `Agent(model:opus)`.

### 06-14 back to 03-01 (selected)

- **`--safe-mode`** (2.1.169): start with every customization off, for troubleshooting. **`/cd`** without breaking the
  cache (2.1.169). **`fallbackModel`**, up to three (2.1.166).
- **Stop and SubagentStop hooks can return `additionalContext` and keep the turn going** (2.1.163).
- **Dynamic workflows** (2.1.154). **`/reload-skills`**, **`MessageDisplay` hook** (2.1.152).
- **`claude agents --json`** (2.1.145): live sessions as JSON for scripting. **Agent view** (2.1.139). **`/goal`**
  (2.1.139): a completion condition Claude keeps working toward across turns. **Hook `args` (exec form, no shell)** and
  **`continueOnBlock`** (2.1.139). *Here:* exec form ends quoting trouble in hook commands on Windows paths.
- **`CLAUDE_CODE_SESSION_ID`** in the Bash environment (2.1.132).
- **MCP `alwaysLoad`** (2.1.121): a server's tools skip tool-search deferral. *Here:* `call_librarian` is deferred in
  this seat and must be loaded by ToolSearch before every use after a wake.
- **`duration_ms` in PostToolUse hooks** (2.1.119). **`xhigh` effort** (2.1.111).
- **`/recap`** on returning to a session (2.1.108). **PreCompact hooks can block compaction** (2.1.105); **plugin
  monitors** (2.1.105); **Monitor tool** (2.1.98). Already used by the room (PreCompact 57 files, Monitor 32).
- **Status line `refreshInterval`** (2.1.97). **`sessionTitle` from UserPromptSubmit hooks** (2.1.94).
- **`"defer"` from PreToolUse hooks** and **`PermissionDenied` hook** (2.1.89).
- **Hook `if` field** with permission-rule syntax, so a hook runs only for matching calls (2.1.85): fewer process
  spawns per prompt. **`CwdChanged`, `FileChanged` hooks** (2.1.83).
- **`--bare`** for scripted `-p` calls (2.1.81). **`--channels`** (2.1.80): an MCP server pushes messages into a
  session. *Here:* the shape of the visits and rings, done by the harness. **`rate_limits` in the status line**
  (5-hour and 7-day windows, 2.1.80). **`effort` frontmatter for skills** (2.1.80).
- **`StopFailure` hook** (2.1.78): fires when a turn ends on an API error. *Here:* the room's API-error watcher polls
  the board for stopped seats (`loop/api_error_watch_2026-11-13.js`); this hook reports at the moment instead.
- **`PostCompact` hook**, **`-n` session names** (2.1.76). **Memory file timestamps** (2.1.75).
- **`InstructionsLoaded` hook** (2.1.69).

### Before 03-01 (selected; older and mostly in use)

HTTP hooks (2.1.63); agent `isolation: worktree` (2.1.50); `last_assistant_message` in Stop hooks (2.1.47); agent
teams (2.1.32), `memory` frontmatter for agents (2.1.33); `context: fork` for skills, hooks in agent and skill
frontmatter, `once: true` hooks (2.1.0); custom session ids on fork (2.0.73); named sessions (2.0.64); background
agents (2.0.60); `PermissionRequest` hook (2.0.45); `SubagentStart` (2.0.43); skills (2.0.20); `SessionEnd` (1.0.85).

## Open, not looked at

- Whether idle compaction and the keep-warm visits work against each other on a seat visited near minute 53.
- Whether Consonance's launcher starts seats in a way Code Mode's resume rule would break.
- Whether the consonance server's instructions exceed 2,048 characters.
- `CLAUDE_CODE_PROJECT_DIR_NAME` against the sibling directory defect.
- X and press coverage was read only through one search; its claims (for example that Code Mode work can run in the
  background for two hours) were not checked against the docs beyond what is quoted above.

## Re-ranked for usage alone (added 00:4x, at his word)

His words, 00:38: "the sole purpose of this is to save usage, we went way too ham last week testing how far we could push
the models reasoning, which showed us errors in consonance that could be fixed, errors in design that make us use more
usage than needed". So the ranking above (useful to Consonance) was the wrong aim. Below, each feature is set against
the three largest avoidable costs the room measured last week (`loop/room_better_2026-11-13/in_cost.md:90-140`), and
nothing else.

**Leak 1: context run to about 968k before compaction** (the part of each call above 250k was 53.2 % of cache reads
in 48 hours). The direct lever, a smaller auto-compact window, is a cut, and cuts are his word per seat
(`no-cut-without-his-word`; the librarian's 500k window was withdrawn at his objection on 11-14, `e468b871`). Features
that work on this leak without a cut:
- **Code Mode** (2.1.323): fewer turns for the same work, so fewer re-reads of the whole context. Untested here.
- **Idle compaction** (2.1.299): compacts a 200K+ idle conversation before its cache expires. That is a cut too, made by
  the harness on a timer, and it is on by default (`idleCompaction`); whether it already fires on the room's seats, and
  whether he wants it to, is his.

**Leak 2: cold wakes and switching model after the wake** (cache writes were 71.6 % of a day's weighted spend; caches
are per model, so a switch after the wake writes the whole context twice).
- **`PreModelSwitch` hook** (2.1.251): can block or ask before a model switch. A switch on a large context could ask
  first with the re-write it costs in the question.
- **`SessionStart` resume hooks receive staleness and the estimated re-cache cost** (2.1.251): the wake can print what
  it is about to cost before the first request.
- **`ANTHROPIC_DEFAULT_MODEL`** (2.1.236) or a model in each seat's settings: the model set before the wake (the lean
  plan's item 5, built and shipped empty).
- **The resume warning on Pro and Max** (2.1.304) already exists in the harness.

**Leak 3: tool output carried for the rest of the context** (18.3 % of cache reads; many mid-size Bash and Read
results, not a few dumps).
- **Code Mode** again, and here it is the strongest fit: the code returns only what Claude needs to read; the
  intermediate output of each call stays in the script and does not enter the context.
- **`omitClaudeMd`** (2.1.271), **`CLAUDE_CODE_SUBAGENT_EFFORT`** (2.1.316), **`CLAUDE_CODE_SUBAGENT_MODEL`** and the
  Agent tool's `effort` (2.1.292): the lean plan sends bulk reading to cheap subagents; these make each of those agents
  cheaper (no 80K intake, lower effort, cheaper model).

**Measuring whether any of it worked:** the per-session cache line in `/cost` and the `prompt_cache` status line
object (2.1.251), with the likely cause of each miss (2.1.260). Without a meter the room is back to estimating.

**Taken back from the list above, because it costs usage:** MCP `alwaysLoad`. It loads the consonance server's tools
into every request instead of behind tool search. It saves a lookup per wake and spends context on every call. Also
"You should know" (a side agent that runs alongside) and any mod that calls a model per prompt.
