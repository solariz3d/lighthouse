# W4, the gate on the first dispatch after a wake: what to change, and the check that is red on a recorded case

Reader: one research-swarm reader on D, 2026-11-13, read-only except this file. Marks: [read] opened and seen;
[summary] secondary or another swarm file; [inferred] my inference; [ours] a proposal. Code citations are at HEAD
3f5fa65d (no change under `consonance/` or `dev/shell/` since d41c088e, `git diff --stat` empty [read]).

## Summary

1. The recorded case is red, with one correction. At the 14:46:27Z `call_chair` the seat's own newest note was never opened
   whole (only grep, piped to cut). The newest L handoff by commit, `handoff_dreamzone3_2026-11-13-L.md`, was only read as
   a sed range piped to `cut -c1-260`. But the other L handoff of that date, `handoff_lighthouse_…-L.md`, WAS cat'ed whole.
2. Across this transcript, ~~153~~ [2nd reader: 154, my own whole-file pass; the extra one is the 2026-11-11T14:34:29Z
   resume wake] wakes were followed by a `call_chair` before the next wake (2026-09-01 to 11-13). In 0 of
   them were both a dated note and an L handoff opened whole first. ~~So the gate would refuse at every wake.~~
   [2nd reader: the first -L handoff reached D at 2026-11-11 08:32:47 -0600 (mtime of the three 11-11 -L files; first
   commit 07:34:25 -0600, `git log --diff-filter=A`). So 151 of the 154 wakes had no -L file to open, and the "both 0" is
   vacuous for (b) there. Under this file's own skip rule (section 6, "no suffixed handoff") the gate refuses at most 140
   of 154 (the 14 that opened some dated note whole aside). Only 3 wakes test (b); on them (b) was met 2 times, (a) 0.]
3. Build it as a new PreToolUse hook, `consonance/hooks/wake-gate.js`, on `mcp__consonance__call_chair`. Copy the shape of
   `sources-gate.js`: tail-read the transcript, write the ledger row first, then deny, and fail open. Do not put it in
   `dispatch-gate.js`: that file is not installed on D, and its "ask" is dropped under bypass. No Rust and no rebuild.
4. "Opened whole" has to be judged from the call AND its result. On D, `gates_mode` is "light", and in light mode the room's
   gates WARN instead of refusing. That includes the NEXT trailer that the plan cites as the gate that held. Whether W4
   refuses in light mode is the keeper's call.
5. Two facts change the plan's premises. The 08:43:40 pull was the seat's own first tool call, ~~54 s~~ [2nd reader:
   53 s: wake 14:42:47.130Z, reflog stamp 08:43:40 -0600 (second resolution); the call itself began 14:43:32.554Z, 6 s after
   the first prompt at 14:43:26.864Z] after it woke. Pulled
   files all share one mtime, so "newest" must be read from the date in the filename and the commit time, never from mtime.

## 1. The recorded case, call by call (names and target paths only)

Transcript `C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl`,
897,156,121 B. Streamed with a node readline pass over its last 400 MB, keeping only rows stamped 2026-11-13T14:30 to 14:47.
Kept: types, hook names, tool names, ids, paths, pipe-stage verbs and lengths. No text. [read]

- Wake: `attachment` row, `attachment.type` hook_success, `hookEvent` SessionStart, `hookName` "SessionStart:resume",
  14:42:47.130Z. The first user row after it carries `permissionMode` bypassPermissions (14:43:26.864Z). [read]
- In file order, rows are not sorted by time. A tool_result stamped 14:42:46.714Z sits after a frame-link stamped 14:42:47.549Z.
  So the gate must walk the file in file order, not by timestamp. [read]
- Before the dispatch: ~~25 unique tool ids (a raw count of tool_use blocks gives 26)~~ [2nd reader: 24 unique tool ids
  before the dispatch, 25 counting the `call_chair` itself; raw 25 and 26. The repeat is the Workflow tool_use (id ending
  m9FjGNkP), written a second time in the next row, which has NO timestamp field. A pass filtered by timestamp prefix never
  sees that row; my id pass over transcript rows 61040-61263 counted from a 497,000,000-byte offset]. `read-before-edit.js:35-36` records that
  transcripts repeat tool ids, so de-duplicate by id. [read; the cause of the 26th is inferred]

| time (Z) | tool | target, stage by stage | opened whole? |
|---|---|---|---|
| 14:43:32 | Bash | `git` status, fetch, log, `pull -q --ff-only`; `ls -t exo_memory/loop/handoff_*`; `ls -t exo_memory/librarian/` | no (lists). The pull is reflog `8fd453c6` at 08:43:40 -0600 [read] |
| 14:43:43 | Bash | `wc -l` of both L handoffs, the 11-13 note and the letter; then `cat exo_memory/loop/handoff_lighthouse_2026-11-13-L.md` | **lighthouse-L: yes** (one stage, result 7,892 chars for a 7,612-B file) |
| 14:43:48 | Bash | `grep -rn -i` over the 11-13 note, the 11-12 note, the brief, the swarm plan and dreamzone3-L, piped to `cut -c1-260` and `head -20`; then a memory file piped to `tail -8` | no |
| 14:43:51 | Bash | `sed -n 18,30p` of the brief piped to cut; `grep -n -i exo_memory/librarian/2026-11-13.md` piped to `cut -c1-240` and `tail -15` | no |
| 14:43:55 | Bash | `cat` of the swarm plan piped to `cut -c1-260`; `sed -n <range> exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md` piped to `cut -c1-260` | **dreamzone3-L: no** |
| 14:44:01 to 14:44:40 | Bash ~~x8~~ [2nd reader: x7, ids tpusSwXG kqLDajXt KQKyc75N fVjMpLc9 7XkxsYBy zRNK3jrb XRLkKEA3], PowerShell x2 | the app exe, AppData, the dreamzone-3 build log, cargo output, processes | n/a |
| 14:45:36 to 14:45:48 | Bash x3 | `exo_memory/loop/room_better_swarm_2026-11-13.workflow.js` (head, grep, sed) | n/a |
| 14:45:50 | Workflow | (launch) | n/a |
| 14:45:56 | mcp__consonance__read_board | none | n/a |
| 14:46:00 to 14:46:07 | Bash x4 | `consonance/src-tauri/src/sync_launch.rs` (sed, grep); `C:/Consonance/data` listing | n/a |
| 14:46:18 | Bash | `node consonance/tools/stamp.js exo_memory/librarian/2026-11-13.md` (an APPEND), then git commit | no: a write is not a read |
| **14:46:27** | **mcp__consonance__call_chair** | text 1,857 chars; result 78 chars, not an error, so it was delivered | the dispatch |

The two required files, at the time of the dispatch [read, `git log -1 --format=%ci 8fd453c6 -- <path>`, `git cat-file -s`]:
- (a) Own newest dated note: `exo_memory/librarian/2026-11-13.md`, 61,668 B at the pull (110,879 B and 455 lines now). Never
  opened whole: grep piped to cut, twice. **Red.**
- (b) The other machine's newest handoff. There are two dated 2026-11-13 with suffix -L: `handoff_lighthouse_2026-11-13-L.md`
  (07:16:06, 7,612 B, cat'ed whole) and `handoff_dreamzone3_2026-11-13-L.md` (08:04:19, 13,826 B, sed range piped to cut).
  Red when "newest" means newest by commit, and red when it means every handoff of the newest date. Green only for the
  lighthouse file. So the task's "neither file was opened whole" holds only under the first two definitions. [read]
- At the wake itself (14:42:47) neither 11-13 file existed on D yet. The pull 54 s later brought them. So "newest" must be
  worked out when the dispatch is made, not at the wake. [read: reflog, and `0b85fead` lacks both]

## 2. Base rate on this transcript (an instrument run, not an estimate)

A whole-file streamed pass, run once. Wakes: hook_success SessionStart rows less than 5 s apart are merged into one wake (two
SessionStart hooks are registered). Opened whole: a Read with no offset and no limit, or a cat/type/Get-Content stage alone in
its pipeline. [read]
- Rows: SessionStart:resume 128, SessionStart:compact 171, SessionStart:clear 1; `system`/`compact_boundary` 80. The 171
  against 80 is not resolved here. [read; the cause is not checked] [2nd reader: resolved enough for the design. All 171
  compact hook rows sit within 50 transcript lines of a `compact_boundary` row and of an `isCompactSummary` row (my pass:
  171/171 and 171/171). So about two hook rows per compaction; the 5 s merge absorbs them. [read: my pass; the two-hooks
  cause is inferred]]
- 182 wakes. ~~153~~ [2nd reader: 154] had a `call_chair` before the next wake. Among those, before the first call: some dated note opened whole
  in 14; some -L handoff opened whole in ~~1 (today's)~~ [2nd reader: 2. Also the 2026-11-11T14:34:29Z resume wake: three
  plain Reads (no offset, no limit, non-error) of `handoff_{t180,lighthouse,dreamzone3}_2026-11-11-L.md` at 14:37:46-47Z,
  before its first `call_chair` at 15:13:22Z. Those Reads name the files with BACKSLASH paths; a matcher that expects `/`
  misses them, which is the likely cause of the miss here [inferred]]; **both in 0**; neither in 138. By source: resume ~~80~~
  [2nd reader: 81] (both 0), compact 72 (both 0), clear 1 (both 0). [read]
- These counts are upper bounds on compliance, because ANY dated note or ANY -L handoff counted, not only the newest. [inferred]

## 3. What the room's gates already do, and where W4 belongs

- `consonance/hooks/dispatch-gate.js` gates `mcp__consonance__chair_inject` and `call_chair` (`:128-131`). It checks one thing:
  does the text cite a sha or an existing repo path (`:147-162`)? ~~It reads no transcript.~~ [2nd reader: its hook path
  (`main`, `:206-270`) reads no transcript; the same file's `--outcomes` CLI does, through `transcriptDirFor` and `openedIn`
  (`:438-482`).] Its decision is "ask" or "print",
  never deny (`:125`, `:262-268`), and its own header records that bypass mode drops "ask" (`:29-35`). It fails open (`:25-27`,
  `:511`). It is **not registered on D**: `~/.claude/settings.json` has no entry for it, and D's `dispatch-gate.jsonl` last row
  is 2026-09-09T13:54:20Z. [read] **W4 does not belong inside it.** Its channel cannot refuse under bypass, and it is not live
  on D. [inferred]
- `consonance/hooks/sources-gate.js` is the model to copy. It is registered on D for call_librarian, call_chair and chair_inject
  [read settings.json]. It reads `transcript_path` from the tail, doubling from 4 MB up to 64 MB (`:43`, `:337-354`). It
  counts only completed, non-error calls (`:229-252`). It writes its ledger row before it denies, and allows when it cannot
  write one (`:15-17`, `:397-398`). It has an 8 s watchdog (`:42`, `:363`) and fails open (`:402`). In "light" it WARNS
  (`:390-393`). [read] Its window is THIS turn, from the last prompt (`:229-233`); W4 needs the window since the wake. Its
  mutation harness anchors on line text (`:273`). So W4 should reuse its parts in a separate file, not be edited into it.
  [inferred]
- The deny holds under bypass, by the room's own record. On D, `sources-gate.jsonl` has 430 deny rows, the last at
  2026-10-19T23:50:56Z [read]. Seats are spawned with `--dangerously-skip-permissions` (`consonance/src-tauri/src/main.rs:1150`)
  [read]. `sources-gate.js:390-392` records the refused rings as re-sent [read]. So deny was honoured under bypass; [inferred]
  from these three.
- `consonance/tools/read-before-edit.js` cannot judge "whole" as it stands. Its READ_VERB counts `head`, `tail`, `cut` and
  `sed -n` as reads (`:56`), and its window deliberately starts at the packet, so the wake's reading is left out (`:19-21`).
  Reusable parts: `seekTo` (`:112`), `records` (`:188`) and `encodeCwd` (`:61`). [read]
- The Rust NEXT gate. `call_chair` in `mcp.rs` runs `auth_librarian`, then `trailer_gate` (`mcp.rs:697-728`). A refusal returns
  `CallToolResult::success` with the reply text (`:721-724`). `trailer::policy` refuses on CallChair and ChairInject (`trailer.rs:207-212`).
  But `policy_in(Light)` is WarnAndDeliver on every verb (`trailer.rs:224-229`), and D's `~/.consonance.json` has
  `gates_mode` "light" [read]. So on D the NEXT trailer warns and does not refuse. The plan's "gates have held (the NEXT
  trailer)" (`plan_room_stretch_2026-11-13.md:40`) describes strict mode. [read; how it applies is inferred]

## 4. The Claude Code facts the hook rests on (downloaded with curl and read as text, 2026-11-13)

From https://code.claude.com/docs/en/hooks.md [read]:
- "Common input fields": every hook gets `session_id`, `transcript_path`, `cwd`, `permission_mode` and `hook_event_name`. The
  transcript "is written asynchronously and may lag", so the current turn's newest messages may be missing.
- "PreToolUse input": `tool_name`, `tool_input` and `tool_use_id`, plus `mcp_server` for an MCP tool (v2.1.274 or later).
- "Match MCP tools" and "Matcher patterns": tools are named `mcp__<server>__<tool>`. A matcher made only of letters, digits,
  ~~`_` and `|`~~ [2nd reader: `_`, `-`, spaces, `,` and `|` (hooks.md "Matcher patterns" table; the narrower `_`/`|` set is for
  FileChanged and StopFailure only)] is compared as an exact string, so `mcp__consonance__call_chair` matches that one tool.
- "PreToolUse decision control": with exit 0, `hookSpecificOutput.permissionDecision` "deny" prevents the call, and the reason
  "is shown to Claude". Precedence when several hooks answer: deny > defer > ask > allow. Exit 2 is routed the same as deny,
  with stderr as the reason. "Hook handler fields": all matching hooks run in parallel.
- "Timeouts": a command hook's default timeout is 600 s. A PreToolUse hook that times out "doesn't block the tool call" unless
  `onFailure: "block"` is set.
- "SessionStart input": `source` is one of startup, resume, clear, compact or fork. From https://code.claude.com/docs/en/permissions.md,
  "Precedence among rules, hooks, and mods": a call blocked by a PreToolUse hook "stays blocked" against a mod's approval. The
  docs do not say in one sentence that deny holds in bypassPermissions; section 3 gives the room's evidence that it does.

## 5. The definitions, made testable [ours]

- **Seat in scope.** Only the librarian in v1. Its tests: `CONSONANCE_PANE` equals `0c0c0c0b-0000-4000-8000-00000000115b`, the
  `LIBRARIAN_SID` at `main.rs:7620` that `main.rs:1222` sets as the pane env [read]; failing that, the cwd's last part is
  `librarian`. Every other seat exits 0. Also exit 0 when `CONSONANCE_DREAM` is set (the house rule, `sources-gate.js:31`) or
  when `agent_id` is present (a subagent).
- **The wake.** In file order, the last non-sidechain row that is either a `system` row with subtype `compact_boundary`, or an
  `attachment` row with type `hook_success`, `hookEvent` SessionStart and `hookName` `SessionStart:<source>`. Everything after
  that row is "since the wake". If no marker is found within the 64 MB tail, allow and record `no-wake-in-tail`. (The resume
  marker exists only because SessionStart hooks are installed on this machine; compaction is marked either way.)
- **First dispatch.** Allow when, since the wake, a `call_chair` tool_use already has a non-error result and its
  `tool_use_id` is not in this gate's own deny rows in `wake-gate.jsonl`.
- **Own newest note (a).** Take the largest `YYYY-MM-DD` among `exo_memory/librarian/????-??-??.md`, by filename and never by
  mtime. Ignore a name more than one day ahead of the clock. The repo comes from `room_path`, as in `dispatch-gate.js:56-65`.
- **Other machine's newest handoff (b).** Self is `CONSONANCE_MACHINE`, then `machine_tag` in `~/.consonance.json`. That is
  the Rust cascade at `main.rs:14498-14511`, and D's tag is "D" [read]. The other machine is the other of L and D. Required:
  every `exo_memory/loop/handoff_*_<date>-<other>.md` with the newest such `<date>`. Today that is two files, 21,438 B. Only 11
  handoff files carry the `-L`/`-D` suffix; 64 older ones do not, and they are never required [read, `ls | grep -c`].
- **Opened whole.** A completed, non-error call since the wake, of one of these two kinds:
  (i) `Read` whose path normalises to the file, with no `offset` and no `limit` (`allow_large` is fine);
  (ii) `Bash`/`PowerShell` where a segment (split on `&&`, `||`, `;` and newline) is one stage with no `|`: `cat`, `type`,
  `Get-Content` or `gc` naming the file, with no `-TotalCount`, `-Head` or `-Tail`, and a result that lacks the harness's
  persisted-output tag. That tag marks an output too large to show: 55 rows in this transcript carry it [read, `grep -c`]. So a
  cat of a 110 KB note shows the seat only a preview and does not count. [inferred]
  NOT whole: `head`, `tail`, `sed -n`, `grep`/`Grep`, `cut`, `awk`, any stage after the cat, a Read with offset or limit, and
  any write (Write, Edit, `stamp.js`). Chunked Reads that together cover the file are not counted in v1, and the refusal text
  says to use one Read with `allow_large`.

## 6. Ways it could misfire, with the rule for each [ours]

| case | rule |
|---|---|
| Nothing new to read (resume minutes after the last turn; a whole open of the file before the wake is still in context) | On a **resume** wake, a whole open after the last `compact_boundary` counts if the file's mtime is older than that open. On a **compact** wake, nothing before it counts: the summary dropped it. |
| The seat appends to its own note after opening it (as at 14:46:18) | It still counts, because a Read with no limit counts whatever the size is later. With the mtime rule on a resume, this IS a false refusal. Record it as `own-append`. Registered: if more than 1 in 5 refusals are this kind, add an exception for the seat's own appends. |
| No dated note exists | (a) is skipped; the row says `no-note`. Allow if (b) holds. |
| A pane (no dated notes; its file `map/<letter>.md` has no date [read `ls`]) | Not gated in v1. A pane's first dispatch is a hand-back pointer. Rust delivers `call_librarian` with a warning so a refusal never drops the pointer (`trailer.rs:200-203`) [read]. |
| The other machine wrote no suffixed handoff, or the tag is unknown | (b) is skipped and recorded (`no-handoff` / `no-machine`). With no machine tag, the gate fails open. |
| Two or more handoffs share the newest date (today) | All of them are required. |
| Pulled files share one mtime | Never decide by mtime. Use the date in the filename, then `git log -1 --format=%ct` if a tie must be broken. |
| The transcript lags (docs, "Common input fields") or the Read is in the same message as the ring | Count it only once its result is on disk. The refusal says to send the ring in a later message, as `sources-gate.js:330` does. |
| A file too large for a plain Read | The Read errors and does not count; the refusal names `allow_large`. [inferred: not tested here] |
| A genuine stop order (Lap D item 2) | `[interrupt]` in the text passes and is recorded, the precedent at `dispatch-gate.js:133-136`. |
| Hook error, unreadable transcript, ledger cannot be written, watchdog | Fail open and record. Deny only after the row is on disk (`sources-gate.js` precedent). |
| A compaction mid-turn, during a lap | The in-flight ring is refused. That is the intended case, and it costs one read. |

**Cost, said plainly.** Every wake would cost one refusal plus about 110,879 + 21,438 B at today's sizes. At the shelf
measurement's 2.89 B per token (`shelf_tier_2026-08-24.md:129-152`, via `in_wake.md:33`) [summary], that is about 46k tokens
[inferred]. Section 2 says it would fire at every wake, so whether this is worth it is the keeper's call.

## 7. Hook against Rust

| | hook (`consonance/hooks/wake-gate.js`) | Rust (`mcp.rs` `call_chair`, before `trailer_gate`) |
|---|---|---|
| knows the transcript | handed `transcript_path` (docs) | must rebuild the path itself: `main.rs:9490-9495` does it for the librarian [read] |
| knows the wake | reads the marker rows | the same, plus the launch time it already knows; it cannot see a compaction except through the transcript |
| what the seat sees | a deny reason, in the same turn (docs; `sources-gate.js:9-11`) | the refusal text as a successful tool result (`mcp.rs:721-724`) |
| rebuild | none | one rebuild and one restart. It could ride W1's restart (`plan_room_stretch:46`) |
| install | copy plus one `settings.json` entry on **each** machine: a manifest row near `install.ps1:179` and a registration row near `:308`, with `-Only` [read]. Hook drift between machines is measured (`hooks_drift_D_2026-11-13.md`) [summary] | ships in the app to both machines |
| proved on a fixture | `node --test`, a pure `decide()` over parsed rows and a temp repo, plus mutation runs (`sources-gate` precedent) | `cargo test`, fixture-able, but test builds lock the tree |

**I would take the hook.** It can be proved on the recorded fixture today with no build. The deny contract is documented, and
the deny has held 430 times under bypass on D. The transcript readers it needs already exist in JS. What would change my mind:
if L cannot get the install in the same lap, Rust covers both machines through W1's restart.

## 8. The smallest change, and the checks [ours]

1. `consonance/hooks/wake-gate.js`, about 200 lines. Its exports are `wakeIndex(rows)`, `openedWhole(file, calls)`,
   `required(repo, machine, today)` and `decide(...)`. Its `main` follows `sources-gate.js:361-400`, with its own ledger
   `wake-gate.jsonl`. It is matched on `mcp__consonance__call_chair` only.
2. `consonance/hooks/wake-gate.test.js`. **The red fixture** is the section-1 rows rebuilt as structural JSONL: the
   SessionStart:resume attachment; the 25 calls with the recorded names and stage shapes, paths kept and patterns replaced by a
   placeholder; the results with their recorded lengths and error flags; then the call_chair. Next to it goes a temp repo
   holding the three files at their 8fd453c6 sizes. Expected: deny. Missing: `librarian/2026-11-13.md` (grep|cut only) and
   `handoff_dreamzone3_2026-11-13-L.md` (sed|cut). Satisfied: `handoff_lighthouse_2026-11-13-L.md` (cat, one stage). Edge
   tests, one per row of section 6.
3. **The check that is red on the recorded case today**, as a replay. Run `decide()` over each recorded wake's first
   `call_chair` in the librarian transcript (a `--replay <jsonl>` mode on the hook). ~~Today it prints 153 of 153 delivered
   without both~~ [2nd reader: the mode does not exist yet, so nothing can be red today except a stand-in pass (mine, section
   "Second reader"). With this file's own skip rule it would print at most 140 of 154 refused, not 153 of 153; 151 of the
   154 wakes test (a) alone. The recorded wakes that test (b) are three: 11-11 14:34Z (b green), 11-12 04:59Z (red),
   11-13 14:42Z (red on dreamzone3-L only)], including 2026-11-13T14:46:27Z (section 2). After install, the same replay
   counts only wakes since the install date, and it must read 0 delivered without both, `[interrupt]` and recorded skips
   aside. [2nd reader: on D this holds only if the keeper rules that W4 refuses under `gates_mode` "light"; copied from
   `sources-gate.js:393` it would WARN, and every ring would be delivered with a row saying so.] Every deny row in `wake-gate.jsonl`
   is the proof that it fired.
4. `consonance/GATES.md` gets a section for it, since every refusal points there (`sources-gate.js:98-115`). `CHANGELOG.md`
   gets an entry. `install.ps1` gets two rows.

**What needs what.** No Rust rebuild. A hook install on D and on L (one `settings.json` registration each) needs the keeper's
word under the hygiene section's per-entry rule (`plan_room_stretch:81-82`) [read]. [2nd reader: `:81-82` gives the
  install METHOD (one entry at a time, `-Only`, settings sha equal before and after); the need for his word is `:33`
  ("needs his word to start") and `:49` ("his word first").] The tier is "prove it": a gate is "a system's
own delivery or gates" (`~/.claude/CLAUDE.md`), so it takes test-first, mutation runs and the full suite at landing. Also his
calls: whether it refuses under `gates_mode` light (I would have it refuse; its refusal asks for a read, not a reworded claim,
which is what D276 measured as harmful, `sources-gate.js:84-87`); and the cost per wake (section 6). No compaction is needed
or asked for.

## What I did not open

- L's transcripts and L's `~/.consonance.json`. The 11-12 and 11-13 03:45 wakes on L are not measured here.
- How a hook-denied call appears as a row in the transcript (its tool_result shape). The rule in section 5 avoids needing it by
  using the gate's own ledger.
- Read's exact size cap. Whether a plain Read of a 110 KB note errors is inferred, not tested.
- Why there are 171 SessionStart:compact rows against 80 compact_boundary rows.
- `second-reader.js`, `stop.js`, `GATES.md`, `install.ps1` beyond `:14`, `:70`, `:178-182` and `:300-316`, and most of
  `mcp.rs` and `main.rs`.
- The chair's side (`chair_inject`) and what its own dated record would be. No hook was run; `install.ps1 -Check` was not run.

## Second reader

Second reader on D, 2026-11-13, read-only except this file. Line numbers in the table are the FIRST reader's (the file as
handed over, 217 lines); in-place corrections above are marked `[2nd reader: ...]`. Instruments, all re-run by me: a node
readline pass over the transcript window 14:40-14:47Z (structure only); an id pass over rows 61040-61263 from a
497,000,000-byte offset, with no timestamp filter; one whole-file pass (206,081 rows) for wakes, opens and rings; git
`reflog`, `log`, `cat-file`, `stat`; `~/.claude/settings.json` and `~/.consonance.json` read as JSON; hooks.md (4,341
lines) and permissions.md (837 lines) fetched with curl and read as text. No text was taken from any transcript.

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 5 | HEAD 3f5fa65d, no change in consonance/, dev/shell/ since d41c088e | git | OK | `git diff --stat d41c088e HEAD -- consonance dev/shell` empty |
| 26 | transcript 897,156,121 B | stat | OK | 897,157,428 B now; the session is live and grows |
| 29-30 | wake row 14:42:47.130Z; first prompt 14:43:26.864Z, bypass | transcript | OK | hook_success SessionStart:resume, then user row with permissionMode |
| 31-32 | rows not in time order | transcript | OK | result stamped 14:42:46.714Z after frame-link 14:42:47.549Z |
| 33 | 25 unique tool ids before dispatch, raw 26 | transcript | WRONG | 24 before, 25 with the ring; repeat is a timestamp-less Workflow row |
| 38 | pull is reflog 8fd453c6 at 08:43:40 | git reflog | OK | `HEAD@{2026-11-13 08:43:40 -0600}: pull -q --ff-only` |
| 39 | lighthouse-L cat'ed alone, result 7,892 chars | transcript | OK | single-stage cat segment; result 7,892, not an error |
| 40-42 | note only via grep/sed piped to cut | transcript | OK | 14:43:48 and 14:43:51 grep to cut; 14:43:43 is `wc` only |
| 42 | dreamzone3-L only as sed range piped to cut | transcript | OK | 14:43:55, sed to cut |
| 43 | 14:44:01-14:44:40: Bash x8, PowerShell x2 | transcript | WRONG | 7 Bash, 2 PowerShell |
| 49 | ring text 1,857 chars, result 78, not error | transcript | OK | DJoorxhC, ok, 78 |
| 52 | note 61,668 B at pull; 110,879 B, 455 lines now | git cat-file, wc | OK | 61668; 455 110879 |
| 55 | lighthouse 07:16:06, 7,612 B; dreamzone3 08:04:19, 13,826 B | git log, cat-file | OK | 3c71dd94 07:16:06; 6ff2d95d 08:04:19 |
| 58-59 | neither 11-13 -L file existed at the wake | git, stat | OK | absent in 0b85fead; mtimes 08:43:40.46 |
| 20 | pull 54 s after the wake | transcript, reflog | DOWNGRADED | 52.9-53.9 s; the reflog stamp has second resolution |
| 21 | pulled files share one mtime | stat | OK | 08:43:40.441 to .466 for note 11-12 and both -L files |
| 66 | rows: resume 128, compact 171, clear 1, boundary 80 | whole pass | OK | identical counts |
| 66-67 | 171 vs 80 unresolved | whole pass | OK (now resolved) | 171/171 compact hook rows within 50 lines of a boundary |
| 68 | 153 wakes with a ring; -L opened whole in 1 | whole pass | WRONG | 154; 2 (11-11 14:34Z wake read three -L files, backslash paths) |
| 68 | note whole 14; both 0; neither 138 | whole pass | OK | 14, 0, 138 |
| 12-13 | the gate would refuse at every wake | git log, stat, pass | DOWNGRADED | 151 of 154 wakes predate any -L file on D |
| 75 | dispatch-gate gates chair_inject and call_chair | dispatch-gate.js:128-131 | OK | DISPATCH_VERBS set |
| 76 | it reads no transcript | dispatch-gate.js:206-270, :438-482 | DOWNGRADED | hook path no; its `--outcomes` CLI does |
| 77 | ask/print only; bypass drops ask; fails open | dispatch-gate.js:25-35, :125, :262-268, :511 | OK | as cited |
| 78 | not registered on D; last ledger row 09-09T13:54:20Z | settings.json, data ledger | OK | PreToolUse holds second-reader, sources-gate, push-gate, delete-gate |
| 81 | sources-gate registered for three verbs | settings.json | OK | matcher call_librarian, call_chair, chair_inject |
| 82-86 | sources-gate :15-17 :42 :43 :229-252 :337-354 :363 :390-393 :397-398 :402 | sources-gate.js | OK | each line says what is claimed |
| 88 | 430 deny rows, last 2026-10-19T23:50:56Z | sources-gate.jsonl | OK | `grep -c` 430; last ts matches |
| 89 | seats spawned with skip-permissions | main.rs:1150 | OK | `cmd.arg("--dangerously-skip-permissions")` under `skip_perms` |
| 92-94 | read-before-edit :56 :19-21 :112 :188 :61 | read-before-edit.js | OK | READ_VERB lists head, tail, cut, sed -n |
| 95-97 | mcp.rs:697-728, :721-724; trailer.rs:207-212, :224-229 | mcp.rs, trailer.rs | OK | Refuse returns `CallToolResult::success`; Light is WarnAndDeliver |
| 98 | D's gates_mode is light | ~/.consonance.json | OK | `light`, machine_tag `D` |
| 99 | plan says gates held (NEXT trailer) | plan_room_stretch:40 | OK | as quoted |
| 105 | transcript_path may lag | hooks.md:754 | OK | "written asynchronously and may lag" |
| 106 | mcp_server on MCP tools, v2.1.274 | hooks.md:1792 | OK | as stated |
| 107-108 | exact-string matcher charset: letters, digits, _ and pipe | hooks.md "Matcher patterns" | WRONG | also `-`, spaces and `,`; the narrow set is FileChanged/StopFailure |
| 109-111 | deny shown to Claude; deny>defer>ask>allow; exit 2 as deny | hooks.md:1991-2008 | OK | "For `"deny"`, shown to Claude" |
| 111 | matching hooks run in parallel | hooks.md:407 | OK | "its matching hooks run in parallel" |
| 112-113 | default 600 s; timeout does not block unless onFailure block | hooks.md:423, :902 | OK | onFailure needs v2.1.295; installed CLI is 2.1.323 |
| 114 | SessionStart sources incl. fork | hooks.md:1292-1300 | OK | startup, resume, clear, compact, fork |
| 115 | a hook-blocked call stays blocked | permissions.md:642 | OK | as quoted |
| 120-121 | LIBRARIAN_SID at main.rs:7620, pane env at :1222 | main.rs | OK | also: MY env (a workflow subagent) carries the same CONSONANCE_PANE |
| 123 | subagent hook input has agent_id | hooks.md:255, :761-765 | OK | as stated |
| 131 | room_path repo resolution, dispatch-gate.js:56-65 | dispatch-gate.js | OK | `repoRoot()` |
| 132-133 | machine cascade main.rs:14498-14511; D's tag D | main.rs, config | OK | env, then machine_tag |
| 134-135 | two files 21,438 B; 11 suffixed, 64 not | git cat-file, ls | OK | 7612+13826; `grep -c` 11 and 64 |
| 140 | 55 rows carry the persisted-output tag | whole pass | OK | 55 |
| 153 | call_librarian warns, never refuses, trailer.rs:200-203 | trailer.rs | OK | as cited |
| 159 | `[interrupt]` precedent dispatch-gate.js:133-136 | dispatch-gate.js | OK | INTERRUPT regex |
| 164 | 2.89 B/token, shelf_tier :129-152 | shelf_tier_2026-08-24.md:152 | OK | "÷ **2.89**"; 46k tokens re-derives |
| 171 | librarian transcript path main.rs:9490-9495 | main.rs | OK | encode_cwd + LIBRARIAN_SID |
| 175 | install rows near :179 and :308 | install.ps1 | OK | sources-gate manifest and registration rows |
| 195 | replay prints 153 of 153 today | (no such mode) | WRONG | mode not built; own skip rule gives at most 140 of 154 |
| 202 | keeper's word per plan:81-82 | plan_room_stretch:33, :49, :81-82 | DOWNGRADED | :81-82 is the install method; the word is :33, :49 |

**Tally: 54 checked. OK 45, WRONG 5, DOWNGRADED 4, UNSUPPORTED 0.**

### The red check, run as a stand-in today

The proposed `--replay` mode does not exist, so I ran its logic as a probe (`base.js` in my scratchpad: wakes merged under
5 s, first `call_chair` after each, opens counted only if completed and non-error, de-duplicated by id).
- **The recorded case is red for the reason given.** At 14:46:27Z: (a) `librarian/2026-11-13.md` was touched only by `wc`
  and two grep-to-cut pipelines; red under every definition. (b) `handoff_dreamzone3_2026-11-13-L.md` only by sed-to-cut;
  red under "every -L handoff of the newest date" and "newest by commit"; green under "any -L handoff" (lighthouse-L, cat).
  So the fixture must fix the definition of (b) as "every file of the newest date", or the case goes half green.
- **A green fixture exists on the record and should be pinned beside the red one:** the 2026-11-11T14:34:29Z resume wake
  opened all three 11-11 -L handoffs with plain Reads before its first ring (15:13:22Z). (b) green, (a) red. It also pins
  path normalisation, because those Reads name the files with backslashes.
- **What the base rate can and cannot say.** Only 3 wakes post-date any -L file on D (11-11 14:34Z, 11-12 04:59Z,
  11-13 14:42Z). (a) was met at 0 of 3, (b) at 2 of 3 (any -L). The plan's "cues have failed" is borne out for (a) and
  only half for (b) on this transcript.

### The design under attack

Ways to satisfy the rule without fixing the problem [inferred unless marked]:
1. **`cat <file> > /dev/null`** (or `>nul`, or into a temp file) is one stage with no `|`, so rule (ii) counts it and the seat
   sees nothing. Rule (ii) must also exclude any stdout redirect in that stage.
2. **A subagent rings.** The design exits 0 when `agent_id` is present (hooks.md:761). A workflow subagent inherits
   `CONSONANCE_PANE` = the librarian's id (seen in my own env [read]) and is offered `mcp__consonance__call_chair` (it is in
   my own deferred tool list [read]). Whether the server delivers a subagent's ring was NOT tested. If it does, the
   exemption is a door; refuse `call_chair` from a subagent outright instead of exempting it.
3. **`gates_mode` light.** Copied from sources-gate, the gate warns on D (`sources-gate.js:393`, D's config [read]) and
   nothing changes. The lap rests on the keeper's ruling here; the success check in section 8.3 cannot pass without it.
4. **Open, then ignore.** A gate proves the file came back to the seat, not that it was used. Only the plan's registered
   falsifier (`plan_room_stretch_2026-11-13.md:43-45`) measures use; keep it as the real verdict.

Cases where it would fire wrongly:
1. **Backslash paths.** If `openedWhole` compares with `/` only, the 11-11 wake above is a false refusal. Normalise both sides.
2. **A busy day's note over the Read cap.** 110,879 B at 2.89 B/token is about 38k tokens. A plain Read may error and a
   `cat` is persisted as a preview, so the only counted path is Read with `allow_large`. The refusal text must say so
   (section 5 already does). The cap itself is unchecked.
3. **Own appends on a resume** under the mtime rule (section 6 already registers it).
4. **Every compaction re-requires a stale -L handoff**, even one already read whole many times since it last changed. That
   is arguably right (the context was cut), but it is 13-21 KB per compaction with nothing new; the cost line should count it.
5. **A Rust trailer refusal in strict mode** returns a non-error result (`mcp.rs:721-724`), so section 5's "first dispatch
   already delivered" test would treat a refused ring as delivered. Harmless in practice (W4 allowed it, so the reads were
   done), but the ledger row should not call it a delivery.

What needs what (section 8, confirmed): hook only, no Rust rebuild; an install on each machine plus a `settings.json`
registration, which needs the keeper's word (`plan_room_stretch:33`, `:49`); his call on light-mode refusal; no compaction.

### What I did not open (second reader)

- L's disk, L's transcripts and L's config: every L-side claim stays unmeasured.
- Whether the MCP server delivers a `call_chair` made by a subagent (`auth_librarian` by mount): not called, not read.
- The Read tool's size cap; how a hook-denied call appears as a transcript row.
- `GATES.md`, `second-reader.js`, `sessionstart-state.js` beyond its first 20 lines; `install.ps1 -Check` was not run.
