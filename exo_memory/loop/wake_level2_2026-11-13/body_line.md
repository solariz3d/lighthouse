# W3, a body line at every start: what it carries, where it comes from, and the check that is red today

1. Today a resume gets no machine, model, effort, context, HEAD or shelf fact. In November the ledger has 136 resume rows, all skipped, and no startup rows.
2. A SessionStart hook can read the model, the context size and the resume gap from its input. Effort is not in that input. The machine, HEAD and shelf age come from env, git and file times.
   [2nd reader: effort IS readable at the wake from the transcript: every assistant row carries top-level `effort` and
   `perTurnEffort`; the last reply before the wake (11-12 05:33:49Z) and the first after (14:43:30Z) both say "high", the
   first fable-5-2 reply (14:48:53Z) says "xhigh" (librarian transcript, keys and values only, node readline pass). The field
   is undocumented in hooks.md, so it is "last reply", not "running".]
3. Origin counted locally would have said "0 behind" at this morning's wake. Local origin/main was 33.2 h old and 307 commits short, so the line has to print the fetch age.
4. The line costs about 240 bytes (~85 tokens) per wake. The state block costs 3,000 characters. A read-only prototype built the line in ~~133 ms~~ [2nd reader: 163, 182 and 174 ms in three re-runs of the same script, timed inside node, so node start-up is extra] against the 897 MB transcript.
5. Smallest change: a new hook file plus one manifest and registration row, and no Rust rebuild. The hook install needs his word (Lap W is parked at his word). A fixture of the 14:42:47Z wake is red today.

Reader: one research-swarm reader, 2026-11-13, on D, read-only except this file. Marks: [read] opened and seen; [summary]
secondary; [inferred] my inference; [ours] a proposal. Code read at HEAD d41c088e. HEAD moved to 3f5fa65d while I read, and
`git diff --stat d41c088e 3f5fa65d -- consonance dev` is empty, so the citations hold at both [read].

## 1. What a waking seat is handed today

- `sessionstart-state.js` serves its block only when `source` is in `CONSONANCE_STATE_SOURCES`, default `compact` [read]
  `consonance/hooks/sessionstart-state.js:67-68`. Any other source writes a `skipped` ledger row and prints nothing [read]
  `:151-161`.
- The block is `state-block.js`, capped at 3,000 characters (`const CAP = 3000;`) [read] `consonance/tools/state-block.js:60`.
  Its repo section counts `origin/main..HEAD` (unpushed) only. It never counts commits on origin that are not here [read] `:73-90`.
- `session-start.js` prints the ambient block (time, sun, moon), L3 notices, the digests and recent session times [read]
  `dev/shell/hooks/session-start.js:277-372`, `dev/shell/lib/ambient.js:239-251`. Night knocks are skipped on resume and
  compact [read] `session-start.js:328`. It prints nothing about machine, model, effort, context, HEAD or the shelf [read].
- The app launches every seat with `--resume <id>` or `--session-id <id>`, and with no `--model` and no `--effort` [read]
  `consonance/src-tauri/src/main.rs:1141-1145`.
- Ledger `C:/Consonance/data/sessionstart-state.jsonl`, 9,324 rows when read (~11:1x local). Since 2026-11-01: emitted/compact 68,
  skipped/compact 4, skipped/resume **136**, skipped/startup **0** [read] (node count by `event`/`source`). Today: 9 resume rows
  14:42:34Z to 14:47:18Z, all skipped; compact rows emitted 3,007, 2,992, 3,029 and 3,046 chars; one compact skipped at
  15:54:03Z [read].
- The librarian transcript on D (897,156,121 B; numbers only) [read]:
  - 14:42:47.130Z: one SessionStart `hook_success` row for `SessionStart:resume`, stdout 1,039 chars. That is
    session-start.js's output; the state hook printed none.
  - 39 SessionStart `hook_success` rows since 11-01. Compact wakes have two rows (~~about 1,010~~ [2nd reader: 774 to 1,473
    across November; about 1,010 only from 11-10 on] and about 3,150 chars).
  - Last reply before the wake: 2026-11-12T05:33:49Z, `claude-opus-5-5`, input 2 + cache read 276,157 + cache write 395
    = 276,554.
  - First reply after it: 14:43:30Z, `claude-opus-5-5`, 2 + 33,635 + 281,830 = 315,467.
  - The model changed to `claude-fable-5-2` at 14:48:53Z, six minutes after the wake.

## 2. What the docs say a SessionStart hook gets (downloaded with curl and read as text)

Source: https://code.claude.com/docs/en/hooks.md, downloaded 2026-11-13. The installed CLI is `2.1.323 (Claude Code)` [read].
- **Common input** [read] "Common input fields": `session_id`, `prompt_id` (absent until the first user input),
  `transcript_path` ("written asynchronously and may lag"), `cwd`, `scratchpad_dir`, `permission_mode` (not on every event),
  `effort`, `hook_event_name`. **`effort` is "Present for `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStop`, and other
  events with a tool-use context"**, and the same row says `$CLAUDE_EFFORT` "holds the same level".
- **SessionStart input** [read] "SessionStart input": `source` (`startup`, `resume`, `clear`, `compact`, `fork`), and optionally
  `model`, `agent_type`, `session_title`. `model` "can be omitted, for example after `/clear` or when a session is restored
  through conversation recovery". On `resume`/`fork`, when the transcript has a reply (v2.1.251+), it also gets
  `seconds_since_last_response`, `context_tokens`, `prompt_cache_likely_expired` and `estimated_cache_write_usd`.
- "Only SessionStart hooks can receive a `model` field … There is no `$CLAUDE_MODEL` environment variable" [read] ~~same section~~
  [2nd reader: hooks.md "Common input fields", the paragraphs after the agent table, not "SessionStart input"].
- **Stdout** [read] "Exit code output": on SessionStart, plain-text stdout is added as context. JSON
  `hookSpecificOutput.additionalContext` lands "at the start of the conversation, before the first prompt" [read] "Add context
  for Claude". It runs on all five sources; on resume the hook runs again, so it can refresh [read] same section.
  When several hooks return `additionalContext`, Claude receives all of them [read].
- **Size** [read] "JSON output": `additionalContext` and plain stdout are capped at 10,000 characters. Over the cap, the text
  goes to a file with a 2,000-character preview, and "Claude Code doesn't ask Claude to read the file".
- **Wording** [read] "Add context for Claude": write factual statements. Text framed as system commands can trip
  prompt-injection defences.
- **PostModelSwitch** [read] "PostModelSwitch": it runs after a model change, including "Claude Code restoring the model when you
  resume a session". Its input carries `from_model`, `to_model` and `context_tokens` (PreModelSwitch input), and its stdout or
  `additionalContext` arrives "with the next request after the switch".
- Effort resolution [read] https://code.claude.com/docs/en/model-config.md "Adjust effort level". The order is:
  `CLAUDE_CODE_EFFORT_LEVEL`, then a pick in the session, then `--effort`, then saved settings, then the model default.
  A top-level `effortLevel` in user settings does not count for Opus 5.5. Saved per-model levels live under `modelSettings`
  [read] settings-reference.md, `modelSettings`.
- Side find, outside W3: "When a PreCompact hook exits 0 and doesn't block, Claude Code uses its stdout as instructions for the
  compaction summary" [read] hooks.md "PreCompact output". This bears on in_wake.md fault 7's doubt.

## 3. Each fact: how the hook gets it, or that it cannot

| fact | source the hook can read | recorded value at the 14:42:47Z wake | readable? |
|---|---|---|---|
| machine | env `CONSONANCE_MACHINE`, else `~/.consonance.json` `machine_tag`, else hostname (`state-sync.js:175-185`) [read] | `D` (env and config both `D`) [read] | yes |
| model | input `model`; else the last assistant row in `transcript_path` whose model is not `<synthetic>`; never settings | `claude-opus-5-5` from the transcript [read]; whether input carried it: no ledger records hook stdin [read] | yes, with its source shown |
| effort | env `CLAUDE_CODE_EFFORT_LEVEL`; env `CLAUDE_EFFORT` if a SessionStart hook gets it; else `modelSettings[<model>].effortLevel`, labelled "saved" [2nd reader: add, before "saved": the last non-synthetic assistant row's top-level `effort`, labelled "(last reply)"] | ~~not recoverable: `settings.json` changed 09:01:54 local, 19 min after the wake~~ [2nd reader: `high`, from the transcript's last reply 11-12 05:33:49Z; settings did change 15:01:54Z, but the transcript does not depend on it] [read stat] | ~~**unknown for SessionStart**~~ [2nd reader: yes, from the transcript, same caveat as model] |
| context | input `context_tokens` (resume/fork); else the last reply's input + cache read + cache write | 276,554 at last reply (11-12 05:33:49Z) [read] | yes |
| HEAD | `git rev-parse --short HEAD` in the repo `room_path` names (`sessionstart-state.js:91-97` pattern) [read] | `0b85fead` (`HEAD@{2026-11-13 08:42:42 -0600}`) [read] | yes |
| origin ahead | local only: `git rev-list --count HEAD..origin/main`, plus the age of the newest of the origin/main reflog entry and `.git/FETCH_HEAD` mtime | **0 behind by the local copy**; the copy was last moved 2026-11-11 23:32:51 -0600, **33.2 h** before the wake [read] [2nd reader: that move was "update by push", not a fetch; the last reflog fetch is 23:23:01 (33.3 h). A successful push is still a sync point, so label it "last synced", not "last fetched"] | count yes, truth no |
| shelf age | mtime of `<cwd>/CLAUDE.md`; HEAD at that time via `git rev-parse HEAD@{<mtime>}` | written 08:42:42.70, 5 s before the wake, at `0b85fead`; 307 commits arrived at 08:43:40 [read] | yes |

Notes on the hard rows:
- **Effort.** The docs list `effort` only for tool-use events, and SessionStart's own field list has no effort [read].
  `$CLAUDE_EFFORT` is documented in the same row; whether it is set in a SessionStart hook's process is not stated [inferred].
  In this reader's own Bash env, `CLAUDE_EFFORT=high`, `CONSONANCE_MACHINE=D` and `CLAUDE_CODE_EFFORT_LEVEL` is unset [read].
  That is a subagent tool's env, not a hook's. Today's `settings.json` holds
  `modelSettings: claude-opus-5-5 high, claude-fable-5-2 xhigh`, no top-level `effortLevel` and no `statusLine` [read]. "Saved"
  is not "running": a session-only `/effort` pick (`s`) outranks it [read] model-config.md. So the line prints the env level
  when present, "(saved)" when only settings answer, and "not readable" otherwise.
  [2nd reader: missing source. The transcript's assistant rows carry top-level `effort` (and `perTurnEffort`): "high" on
  the 11-12 05:33:49Z and 13 14:43:30Z rows, "xhigh" on the 14:48:53Z fable row. It reflects a session-only pick too, which
  "saved" cannot. Order: env, then last reply's `effort` "(last reply)", then saved, then "not readable".]
- **Model.** The resumed seat ran `claude-opus-5-5`, and `settings.json` now says `"model": "fable"` [read]. The settings value
  at the wake is lost (the mtime is later), so I cannot say settings were wrong then [inferred]. A resume restores the
  session's own model (the PostModelSwitch doc), so settings is the wrong source for a resume [inferred from the docs].
- **Origin.** At 08:42:47 local, `refs/remotes/origin/main` was `0b85fead`, last moved 11-11 23:32:51 by a push. It moved to
  `8fd453c6` only at the 08:43:39 fetch [read] reflog. A count from local refs therefore said 0 behind while L had pushed 307
  commits. Only the fetch age carries the warning. `git ls-remote` would give the truth, but it is a network call from every
  seat at every start; ~~9 seats resumed within 12 s~~ [2nd reader: 8 resume rows in 14:42:34.842Z to 14:42:46.818Z; the
  9th, the Third Place, came at 14:47:18Z] this morning [read ledger]. I did not run it (rule 6) [ours: leave it out;
  W5, the pull before the shelf, is the fix; I would add ls-remote with a 3 s timeout only if W5 cannot guarantee the pull].
- **Context on compact.** The last reply before a compaction is the pre-compaction size. The boundary row (with `preTokens`,
  `postTokens`) may not be on disk yet when the hook runs: on 11-12 the `SessionStart:compact` row is stamped 04:59:09.217Z
  and the boundary 04:59:09.689Z (`preTokens` 967,632, `postTokens` 28,277) [read]. [2nd reader: the stamps do not show
  it. In file order the boundary is line 203,175 and the two hook rows 203,192 and 203,193, after the summary row; stamps
  are not write order. "May not be on disk" is unshown either way.] So on compact the line says
  "before compaction" [ours].
- **No dollars.** `estimated_cache_write_usd` is in the input and is never printed (the no-dollar-costs memory rule) [ours].

## 4. The line

Template [ours], one line, facts only, each field labelled with its source when it is not first-hand:

    [body] machine <tag> · model <id>[ (last reply)] · effort <level>[ (saved)]|not readable · context <N>k <to resend|at last
    reply HH:MM|before compaction> · HEAD <sha> · origin/main last fetched <age> ago, <b> behind by that copy · shelf written
    <age> ago at <sha>[, <n> commits behind HEAD] · source <source>

(Printed as one physical line; wrapped here.) This is what it would have printed at the recorded wake (14:42:47Z, resume),
built from the values in section 3 [ours, the values [read]]:

    [body] machine D · model claude-opus-5-5 · effort not readable · context 277k at last reply 11-12 05:33 · HEAD 0b85fead · origin/main last fetched 33.2 h ago, 0 behind by that copy · shelf written 5 s ago at 0b85fead · source resume

[2nd reader: with the transcript's `effort` the recorded wake reads "effort high (last reply)"; that line is 244 B.]

- **Cost:** 239 bytes, 232 characters [read, `Buffer.byteLength`]. A compact-shaped example with the shelf clause is 248 B [read].
  At the 2.89 B/token ratio (`shelf_tier_2026-08-24.md`, as cited in in_wake.md §2) [summary], that is about 85 tokens. The
  state block is 3,000 characters; session-start.js's resume output today is 1,039 [read].
  208 SessionStart rows in 13 November days × ~245 B ≈ 51 KB across all seats [inferred].
- **Speed:** a read-only prototype (`…/scratchpad/bodyline_proto.js`, writes nothing) ran in ~~**133 ms**~~ [2nd reader: 163,
  182, 174 ms in three re-runs; node start-up not counted] [read]. [2nd reader: the prototype dates origin/main with
  `git reflog show -1 --format=%ct`, which is the COMMIT's committer time, not the reflog entry's time: today it gives
  08:06:10 for 8fd453c6 while the fetch was 08:43:39. It matched 33.2 h only because a push stamps both within 2 s.] It read an
  8 MB tail of the 897 MB transcript and made 4 git calls. Two more git calls for the shelf's HEAD put it at about 180 ms
  [inferred]. Its live output on this seat now: model `claude-fable-5-2 (last reply)`, context 754k, 0 behind / 62 ahead,
  shelf 2.4 h, 199 B. Its effort field showed this reader's own env, not the seat's [read].
- **The shelf clause, live case:** at the 08:55:59 local compaction [2nd reader: a ledger row with no session id; not the
  librarian's, whose transcript has no compaction on 11-13 before 15:00Z. Every D shelf was written 08:42:28 to 08:42:42,
  before the pull, so the value holds for whichever seat it was, except the Third Place (08:47:16)], `HEAD@{08:55:59}` was `79bf5761`, 314 commits past the
  shelf's `0b85fead` [read]. The clause would have said "shelf … at 0b85fead, 314 commits behind HEAD". Once W1 stamps the
  shelf with its HEAD, the hook should read that stamp instead of the reflog lookup [ours].

## 5. Where it prints, per source [ours]

| source | today | with W3 |
|---|---|---|
| startup | session-start.js only; the state block is skipped (0 rows in November) | the line, as `additionalContext` |
| resume | session-start.js only (1,039 chars this morning); 136 skipped rows | the line; context from `context_tokens` |
| compact | session-start.js + the 3,000-char state block | the line, after the summary row, so it sits after "pick up the last task" |
| clear, fork | session-start.js only | the line |
| model switch (PostModelSwitch) | nothing; the 14:48:53Z switch to fable-5-2 left the wake line stale | optional: the same line with `to_model` [2nd reader: PostModelSwitch also fires with `source: "resume"` when a resume restores a model (hooks.md "PostModelSwitch input"), so a resume can print two lines; skip `source` "resume" there] |

- ~~The Third Place's cwd gets nothing, as both peer hooks skip it~~ [2nd reader: only the state hook is silent there
  (`sessionstart-state.js:142-149`). `session-start.js` skips only catchUp and the digests for it (`:351-352`, its only
  `isThirdPlaceCwd` uses); ambient, L3 notices and recent sessions still print] (`sessionstart-state.js:142-149`,
  `session-start.js:352`) [read]. Machine, model, effort and context are not the build, so including them is the Third
  Place's and his call, not mine [ours].
- Fresh panes are skipped as in `session-start.js:387`, along with the dream and overseer gates (`:14`, `:27`) [read].

## 6. The smallest change [ours]

- **New file** `consonance/hooks/sessionstart-body.js`: it reads stdin, builds the line from section 3's rules, and prints
  `{hookSpecificOutput:{hookEventName:'SessionStart', additionalContext: line}}`. It catches each field on its own: a field
  that throws prints "not readable", and the start is never blocked.
  - Ledger: one row to `<data>/sessionstart-body.jsonl`, `{ts, source, bytes, ms, model_src, effort_src, ctx_src}`. The
    sources are `input|transcript|env|saved|none`. **The first real wake then answers the two unknowns** (does `model`
    arrive on our resumes; does `CLAUDE_EFFORT` reach a SessionStart hook) as numbers, not guesses.
  - Clock seam `BODY_NOW`, the same shape as `STATE_BLOCK_NOW` at `state-block.js:307` [read].
  - Inline the 10-line `machineTag` and pin it equal to `state-sync.js`'s with a test, as `dirs.test.js` does for the D273
    text. The flat-installed hook cannot reach the repo's tools reliably (`sessionstart-state.js:88-90`) [read]. [2nd
    reader: DOWNGRADED. `:88-90` forbids COPYING a tool flat; `:84-86` and `fromConfig` `:91-97` reach the repo's tools via
    `room_path`. Inlining is a choice for start-up independence, not forced.]
- **Two rows in `dev/shell/install.ps1`:** one in `$files`, as at `:157`, and one registration, as at `:290` (`Event =
  'SessionStart'`) [read].
- **Why a new file and not an edit to sessionstart-state.js:** the edit would make three existing tests wrong by design.
  They assert that an unserved source prints nothing at all (`sessionstart-state.test.js:46-53`, `:62-70`, `:72-75`) [read].
  The spec would change, not the tests' correctness, so they would have to be rewritten. The 3,000-char block's open
  question (worth unproven) also stays apart from the line. What would change my mind: if he wants no new registration,
  the in-place edit with those three tests amended, said so in the hand-back.
- **Needs:**
  - No Rust rebuild.
  - A hook install: install.ps1's new entry, run with `-Only` on D and on L, which writes `~/.claude/settings.json`.
  - **His word**, because Lap W is parked at his word (`plan_room_stretch_2026-11-13.md:33`) [read].
  - Nothing is compacted or cut. The line appears at each seat's next natural start, resume or compaction. Whether a running
    seat picks up a newly registered hook without a restart is not established here [inferred].

## 7. Checks that are red today on recorded cases [ours]

1. **Ledger pairing (recorded).** Since 2026-11-01 there are 208 SessionStart rows in `sessionstart-state.jsonl` (68 + 4 + 136)
   and 0 body rows; the file does not exist [read]. Pass: after install, every state-ledger row has a body-ledger row with
   the same `source` within 5 s. Third Place rows are excepted.
   [2nd reader: fires wrongly as written. The state hook skips only `CONSONANCE_DREAM` (`sessionstart-state.js:40`); it
   writes rows for fresh panes and overseer runs, which section 5 has the body hook skip. Except those too, or have the body
   hook ledger a `skipped` row with the reason. It is also passed by a hook that ledgers a row and prints a wrong line; only
   check 2 tests content. And the plan's own check (136 resume rows skipped, `plan_room_stretch_2026-11-13.md:39`) never
   turns green under this design, since the state hook is left unchanged; say in the hand-back that the check moved.]
2. **Fixture of the 14:42:47Z wake** (`sessionstart-body.test.js`). Red today because the module is absent.
   - The fixture:
     - a temp git repo whose HEAD = origin/main = one commit. The origin/main reflog entry is written by `git update-ref` under
       `GIT_COMMITTER_DATE=2026-11-11T23:32:51-06:00` [inferred: the reflog takes the committer date].
     - a transcript fixture whose last assistant row is `claude-opus-5-5`, usage 2 / 276,157 / 395, at 2026-11-12T05:33:49Z.
     - `CLAUDE.md` with mtime 08:42:42, and `BODY_NOW=2026-11-13T08:42:47-06:00`.
     - payload `{source:'resume'}` with no `model` and no `context_tokens`.
   - Expect `model claude-opus-5-5 (last reply)`, `context 277k at last reply`, `last fetched 33.2 h ago`, `0 behind by that
     copy`, `source resume`, and length ≤ 300 bytes.
   - [2nd reader: three gaps. (a) The fixture's commit date equals its reflog date, so a hook dating origin by `%ct` (as the
     prototype does) passes; make the commit date hours older than the `update-ref` date and expect the reflog age. (b) Add
     `effort: "high"` to the transcript row and expect `effort high (last reply)`. (c) "Red today because the module is
     absent" is red for any missing file, not for the wrong-age reason; the probe that is red for the reason is
     `git rev-list --count HEAD..origin/main` at the wake's refs = 0 beside a reflog age of 33.2 h. At 2.1.323 (the wake rows'
     `version`) the real resume payload most likely carried `model` and `context_tokens`, so this fixture tests the fallback,
     not the recorded input [inferred from hooks.md "SessionStart input"].]
   - This is the one behaviour nobody sees by looking: a wrong fetch age reads as a healthy "0 behind".
3. **Edges in the same file.**
   - Payload `model` present: it wins over the transcript.
   - `context_tokens` present: "to resend" wins.
   - Empty transcript and no `model`: `model not readable`.
   - No effort env and no `modelSettings` entry: `effort not readable`. [2nd reader: and no `effort` on the last reply.]
   - Repo missing: `HEAD not readable`, and the hook still exits 0 with valid JSON.
   - A shelf HEAD 314 commits behind gives `314 commits behind HEAD` (the 08:55:59 case).
4. **Optional PostModelSwitch (recorded).** The 14:48:53Z switch to `claude-fable-5-2` has no line after it today. Pass: a
   PostModelSwitch payload with `to_model` produces the line with that model. It needs a second registration.
- Tier: the dispatcher names it. The plan routes W3 to P after its mutant run (`plan_room_stretch_2026-11-13.md:49`) [read].
  The fixture is required whatever the tier, because a wrong age is invisible [ours].

## What I did not open

- L's disk, L's transcripts and L's ledgers. The line's behaviour on L is unmeasured.
- Any recorded SessionStart stdin: no ledger keeps it, so whether `model` and `context_tokens` arrived on our resumes is
  inferred from the docs and the version, not seen.
- A SessionStart hook's real env. I installed and ran no hook, so `$CLAUDE_EFFORT` there is unknown.
- `git ls-remote` was not run (an outside request carrying the repo's name).
- session-start.js was not run (its `catchUp` writes digests under `~/.claude`). Its 1,039-char resume output is read from
  the transcript's length field only.
- `state-block.js` beyond `:1-140` and its section list; `state-sync.js` beyond `:160-195`; `install.ps1` beyond the two
  greps; `sessionstart-state.test.js` beyond `:40-80`; `dirs.test.js`.
- The docs pages beyond the sections cited: the statusline page was downloaded and grepped for `effort` only (its input has
  `effort.level`, `statusline.md` field table [read]), and statusLine is not configured here, so it is no route today.
- The relayed user line in this run ("o pane is inactive btw?") asks about pane O. This reader's task did not cover it and
  I did not check.

## Second reader

Second reader, 2026-11-13, on D, read-only except this file. HEAD 3f5fa65d; `git diff --stat d41c088e HEAD -- consonance dev`
empty. Docs re-downloaded with curl (hooks.md, model-config.md, settings-reference.md, statusline.md) and read as text.
Transcript: numbers, types, timestamps and the `effort` value only, by node readline.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3, 25-26 | Nov: emitted/compact 68, skipped/compact 4, skipped/resume 136, startup 0 | `C:/Consonance/data/sessionstart-state.jsonl` | OK | node count: same; 9,324 rows. Of the 136, 10 are Third Place, 126 "source not in compact" |
| 26-28 | today 9 resume rows, compacts 3,007/2,992/3,029/3,046, skip 15:54:03Z | same ledger | OK | rows listed match |
| 94 | 9 seats resumed within 12 s | same ledger | WRONG | 8 rows 14:42:34.842Z-14:42:46.818Z; 9th at 14:47:18Z |
| 15-17 | block only for `CONSONANCE_STATE_SOURCES`, default compact; skip at :151-161 | `sessionstart-state.js:67-68`, `:151-161` | OK | `\|\| 'compact'`; skipped row then return |
| 18 | `const CAP = 3000;` | `state-block.js:60` | OK | line 60 |
| 19 | repo section counts only origin/main..HEAD | `state-block.js:73-90` | OK | `:80` only rev-list count |
| 20-22 | session-start prints ambient, L3, digests, sessions; knocks skipped on resume/compact | `session-start.js:277-372`, `:328`; `ambient.js:239-251` | OK | as cited |
| 23-24 | launch has no --model / --effort | `main.rs:1141-1145`; grep | OK | no `effort` in main.rs |
| 30-31 | resume 14:42:47.130Z one hook row, 1,039 chars | transcript | OK | `SessionStart:resume` stdout 1,039; version 2.1.323 |
| 32 | 39 rows since 11-01; compact rows ~1,010 and ~3,150 | transcript | DOWNGRADED | 39 OK; first row 774-1,473 in Nov |
| 33-35 | 276,554 before; 315,467 after | transcript usage | OK | 2+276,157+395; 2+33,635+281,830 |
| 36 | fable-5-2 at 14:48:53Z | transcript | OK | first non-opus reply 14:48:53.407Z |
| 40 | CLI 2.1.323 | `claude --version`; transcript `version` | OK | both 2.1.323 |
| 41-44 | `effort` only on tool-use events; `$CLAUDE_EFFORT` same level | hooks.md "Common input fields" | OK | it is an object with `level` |
| 45-48 | SessionStart fields, resume extras v2.1.251+ | hooks.md "SessionStart input" | OK | quoted text matches |
| 49 | "Only SessionStart … no `$CLAUDE_MODEL`", "same section" | hooks.md | DOWNGRADED | text is under "Common input fields" |
| 50-57 | stdout as context; 10,000 cap, 2,000 preview; factual wording | hooks.md "Exit code 0", "JSON output", "Add context" | OK | as quoted |
| 58-60 | PostModelSwitch on resume restore; fields; delivery | hooks.md "PostModelSwitch" | OK | also fires with source "resume" |
| 61-64 | effort order; top-level effortLevel ignored for Opus 5.5 | model-config.md "Adjust effort level" | OK | items 1-5 and the paragraph after |
| 65-66 | PreCompact stdout = summary instructions | hooks.md "PreCompact output" | OK | quoted |
| 72 | machine D, `state-sync.js:175-185` | file; `~/.consonance.json`; env | OK | env D, machine_tag D |
| 74, 81-87 | effort not recoverable at the wake | transcript | WRONG | assistant rows carry `effort` "high" |
| 74, 85, 88 | settings mtime 09:01:54; modelSettings high/xhigh; model fable; no statusLine | `~/.claude/settings.json` (read, not written) | OK | stat and node read |
| 76 | HEAD 0b85fead at the wake | HEAD reflog | OK | 0b85fead until pull 08:43:40 |
| 77, 91-93 | origin/main moved 23:32:51 by push, 8fd453c6 at 08:43:39; 307 | origin reflog; rev-list | OK, label DOWNGRADED | "update by push"; last fetch 23:23:01 |
| 78 | shelf 08:42:42.70 | stat of instance CLAUDE.md | OK | 08:42:42.70 |
| 97-98 | boundary maybe not on disk when the hook runs | transcript file order | UNSUPPORTED | boundary row precedes hook rows |
| 115 | 239 B, 232 chars | `Buffer.byteLength` | OK | 239 / 232 |
| 115 | compact example 248 B | none (string not given) | not checked | |
| 118 | 208 × ~245 B ≈ 51 KB | arithmetic | OK | 50,960 |
| 119 | prototype 133 ms | re-ran the script 3 times | DOWNGRADED | 163, 182, 174 ms |
| 119 | prototype fetch age | the script's source | WRONG method | `%ct` = commit time, 08:06:10 vs fetch 08:43:39 today |
| 123 | HEAD@{08:55:59}=79bf5761, 314 past | HEAD reflog; rev-list | OK, seat DOWNGRADED | that compaction is not the librarian's |
| 137 | Third Place gets nothing from both hooks | `session-start.js:351-352` | WRONG | only digests and catchUp skipped |
| 140 | fresh / dream / overseer gates `:387`, `:14`, `:27` | session-start.js | OK | as cited |
| 150 | `STATE_BLOCK_NOW` at :307 | state-block.js:307 | OK | `function clock()` |
| 152 | flat hook cannot reach repo tools | `sessionstart-state.js:84-97` | DOWNGRADED | room_path route exists |
| 153 | install.ps1 :157 and :290 | install.ps1 | OK | both rows; `-Only` is a param at :70 |
| 156 | tests :46-53, :62-70, :72-75 | sessionstart-state.test.js | OK, drift +1 | tests at 47-54, 63-71, 73-76 |
| 163, 191 | plan :33 parked; :49 routes W3 to P | plan_room_stretch_2026-11-13.md | OK | as cited |
| 169 | body ledger absent | `ls C:/Consonance/data` | OK | only sessionstart-state.jsonl |
| check 1 | pairing check | sessionstart-state.js:40 | fires wrongly | fresh and overseer rows unpaired |
| check 2 | fixture red today | ls consonance/hooks | red, not for the reason | module absent; equal dates hide `%ct` |

Installed state, via `install.ps1 -Check` (exit 255 because of other drift): `hooks\session-start.js` ok,
`sessionstart-state.js` ok, `sessionstart-ambient.js` ok but not registered (settings has two SessionStart commands).
Many other hooks show DRIFT. That is outside W3, but `-Only` matters: a full install would also overwrite those.

Tally: 43 rows. OK 31 (3 of them with a weaker label, seat or line drift). DOWNGRADED 4. WRONG 4 (the effort reading, 9
seats, Third Place, the prototype's age method). UNSUPPORTED 1. Not checked 1. Design faults 2 (check 1 fires wrongly;
check 2 is red for the wrong reason and blind to `%ct`).

How each change could pass without fixing the problem:
- Check 1: a hook that ledgers a row and prints any line passes it.
- Check 2: a hook that dates origin by commit time passes, because the fixture's commit and reflog dates are equal.
- The plan's own check (136 resume rows skipped) passes if `CONSONANCE_STATE_SOURCES` is set to include resume, but that
  serves the 3,000-char block, not the line. Under the new-file design it never turns green.

Where it would fire wrongly:
- Check 1: fresh-pane and overseer starts.
- The optional PostModelSwitch: a resume that restores a model prints two lines.
- "0 behind by that copy": after any push from D the age resets. That is right (a push proves sync), but a reader can take
  a fresh age to mean L was looked at.

Could not check:
- What a SessionStart hook's stdin and env really held at 14:42:47Z (no ledger keeps stdin).
- Whether `effort` in the transcript tracks a session-only `/effort` pick before the next reply.
- L's disk.
- The 248 B compact example.
- `git ls-remote`, as the first reader also left it unrun.
