# What a cold wake and a model switch write on D, and how to make the wake cheaper

Reader: one swarm reader, 2026-11-13, read-only except this file. HEAD d41c088e. Marks: [read] opened and seen;
[summary] from another swarm file; [inferred] my inference; [ours] a proposal. Repo paths are relative to the lighthouse
root. Transcript figures are numbers, times, tool and command names only.

## Summary (five lines)

1. This morning nine seats on D resumed cold after ~33 h (one after 9.5 days) and wrote 5,922,308 tokens to cache on their
   first calls, all on Opus 5.5, because a resume keeps the transcript's model and Consonance passes no `--model`.
2. Three seats (librarian, main, Third Place) were then moved to Fable and wrote their whole context again: 2,049,358
   tokens within 21 s to 5.4 min. A `--model` on resume (Rust) would have saved the 2,029,827 Opus tokens; no cut.
3. C and E resumed within 75k of the 967k auto line, wrote 1.73 M, then auto-compacted 9 min later.
4. Pane O was woken by keep-warm 4 s after an `/effort` row counted as "activation" (`main.rs:13162`): 642,636 written.
5. The large saves (a warm `/compact` at day's close, a fresh seat, a lower auto-compact line) are compactions or cuts,
   so they need his word for each seat. The model pin and the keep-warm fix are not cuts; both need a rebuild.

## 1. What starts a seat today

- The seat command carries `--resume <id>` or `--session-id <id>` and nothing about the model or effort:
  `consonance/src-tauri/src/main.rs:1141-1145` [read] ("if resume { cmd.args(["--resume", &pane_id]);"). The other
  args are permissions (`:1150`, `:1165`) and MCP (`:1196`) [read]. No `--model`, `--effort` or `--autocompact` in
  `spawn_claude_pane` (`:1109` to the spawn) [read, grep of the file: ~~the only `--model` text is the Scribe's note
  at `:9968`~~ [2nd reader: two `--model` texts, `:9968` and `:10128` ("no --model", a one-shot comment); neither is in
  the seat spawn, so the conclusion holds; `grep -n -- '--model' consonance/src-tauri/src/main.rs` at 3f5fa65d],
  "`--model` is deliberately NOT pinned", which is about the one-shot, not the seats].
- Fixed session ids, so each seat resumes itself: `MAIN_SID` `:7403`, `LIBRARIAN_SID` `:7620`, `THIRD_PLACE_SID` `:7630`
  [read]. The shelf is rewritten at each launch: `:9558` "the room is refreshed into CLAUDE.md each launch" [read].
- User settings: `~/.claude/settings.json:5` `"model": "fable"`; `:149-156` `modelSettings` gives `claude-opus-5-5`
  effort `high`, `claude-fable-5-2` effort `xhigh` [read]. No `autoCompactWindow`, `idleCompaction`, `promptCacheTtl`
  or `autoCompactEnabled` key (grep: 0) [read]. File last written 2026-11-13 15:01:54Z [read, stat].
- Claude Code 2.1.323 on D, `DISABLE_AUTOUPDATER=1` (`settings.json:3`) [read].
- Memory notes: `cold-start-reload-cost.md:11-15` (826,005 written on 09-18 after 20 h plus a switch; "compact before
  long breaks") and `seat-substrates.md:8-18` (Fable 5.2 default from 11-10; running seats keep their model until
  restart or `/model`; his 09:02 xhigh lean; "Whether it is pinned in config so a restart keeps it: not checked") [read].
  [2nd reader: that note is itself wrong for a resumed seat. `seat-substrates.md:8` says running seats keep their model
  "until they restart", and `:10` says a seat's model is "the global default at spawn". Consonance spawns seats with
  `--resume`, and a resume keeps the transcript's model (`model-config.md:152`): all nine seats resumed on Opus 5.5 this
  morning. So a restart does not change a seat's model. The memory note needs that correction, by its owner.]

## 2. What the current docs say (downloaded with curl as markdown, read as text)

Prompt caching, `https://code.claude.com/docs/en/prompt-caching.md`:
- Each model has its own cache; a `/model` switch makes the next request read the whole history with no cache hits
  (`:35`, `:79`) [read]. `/model` asks to confirm only while the cache is warm (`:81`) [read].
- Effort: with a subscription, changing effort keeps the cache on Fable 5.1+, Opus 5.5, Sonnet 5.5, Haiku 5.5
  (`:36`, `:97`) [read].
- Compaction, warm: the summary request reads the prefix from cache, "a fraction of what the context size suggests"
  (`:182`). Cold: after a break longer than the TTL it "reprocesses that history as uncached input" (`:184`). Either
  way the turn after rebuilds only the short history (`:184`) [read].
- Idle compaction: a long conversation left idle on the one-hour TTL can be compacted; `idleCompaction: false` turns it
  off, v2.1.290+ (`:190`) [read].
- Resume sends the whole conversation again and reads what is unchanged and still within the TTL (`:257`) [read].
- TTL: on a subscription within plan usage the main conversation gets one hour; everything else, including compaction,
  five minutes (`:269-279`) [read]. Overrides `promptCacheTtl` / `CLAUDE_CODE_PROMPT_CACHE_TTL` (`:285-299`) [read].
- Cache scope: one machine and directory; sequential sessions share the prefix only when the git status snapshot at
  startup matches (`:313-316`). Project context (CLAUDE.md) changes when a session starts (`:26`) [read].

Model configuration, `https://code.claude.com/docs/en/model-config.md`:
- "Resumed sessions started with `claude --resume` ... keep the model they were using when the transcript was saved"
  (`:152`) [read]. "A model you pick for the new launch with `--model` or `ANTHROPIC_MODEL` still takes precedence over
  the restored model" (`:156`) [read].
- `ANTHROPIC_DEFAULT_MODEL` is ignored when any settings file has `model` (`:216-220`), so it does nothing here [read].
- With `ANTHROPIC_MODEL` set, the next launch returns to it whatever `/model` saved (`:223`) [read].
- Default auto-compact: models with a native 1M window, including Opus 4.7+ and Fable, compact at about 967K (`:901`).
  Per-model `autoCompactWindow` via `/autocompact` or `modelSettings` (`:866-867`); `--autocompact` for one launch
  (`:868`) [read].
- Effort: `--effort` sets it for one session; `modelSettings` per model (`:729-731`) [read].

Settings reference, `https://code.claude.com/docs/en/settings-reference.md`:
- `idleCompaction` (`:2526-2547`): on by default when the conversation is on the one-hour TTL, its context has reached
  200,000 tokens, and "about an hour has passed since the last request, and your computer stays awake until then";
  its notice reads "Compacted while idle, before the prompt cache expired" (`:2530`) [read]. So an idle compaction is
  a warm compaction, run just before expiry [inferred from `:2530` and prompt-caching `:182`].
- Threshold env `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`, minimum 100,000 (`:2566`) [read].

CLI reference, `https://code.claude.com/docs/en/cli-reference.md`: `--model` (`:108`), `--effort` (`:88`, does not
persist), `--autocompact` (`:72`), `--resume` (`:126`), `--fork-session` (`:94`); the system prompt is recorded on a
conversation's first request and reused after `--resume` until compaction (`:173`) [read].

## 3. This morning's wake on D, re-measured (numbers only)

Method [read]: `exo_memory/loop/room_better_2026-11-13/scripts/second_reader_lean/extract.js` read whole, then run on the
nine current transcripts into my scratchpad (it keeps usage numbers per message id, compact boundaries, idle notices);
stopped at 17:05:57Z. A 30-line scratch script of mine (`wake.js`, numbers only) picked each seat's first call in the
window. Pane letters from the record (A 3d57124e, B 5bf9d657, C 0845a868, E 07b8a48f, O 36313935, P 372c8abc) [summary,
grep counts of "A (sibling-3d57124e" and similar across `exo_memory`]. Every write below was a one-hour write
(`ephemeral_1h` share 1.00) [read].

| seat | first call Z | idle min | written, 1st call | context | models 1st / 2nd call | second full write within 10 min |
|---|---|---|---|---|---|---|
| librarian | 14:43:30 | 1,990 | 281,830 | 315,467 | Opus / Opus | yes: Fable 14:48:53, 328,307 |
| main | 14:46:33 | 2,001 | 901,827 | 922,870 | Opus / Opus | yes: Fable 14:49:14, 914,993 (read 0) |
| P | 14:47:01 | 2,000 | 471,429 | 504,279 | Opus / Opus | no |
| C | 14:47:04 | 2,004 | 859,192 | 892,704 | Opus / Opus | auto compact 14:55:59 at 968,566; then 79,165 |
| A | 14:47:05 | 2,001 | 507,157 | 540,669 | Opus / Opus | no |
| B | 14:47:09 | 2,003 | 539,795 | 573,307 | Opus / Opus | no |
| E | 14:47:15 | 2,030 | 872,272 | 905,784 | Opus / Opus | auto compact 14:56:19 at 968,138; then 62,539 |
| O | 14:51:37 | 13,722 | 642,636 | 675,425 | Opus / Opus (15:43:43) | no |
| Third Place | 15:01:34 | 2,064 | 846,170 | 867,213 | Opus / Opus | yes: Fable 15:01:55, 806,058 |

[read, my run.] Third Place is 94 s past the 15:00Z edge; it is included because it is the same wake.
- Every first call also read ~21k-34k from cache (the shared system layer) [read]; the rest of the context was written.
- No seat compacted between its last call on 11-12 and this wake (no compact boundary in that span for any seat) [read].
- Totals: Opus first writes 5,922,308 tokens (5,076,138 inside 14:40-15:00Z); Fable switch writes 2,049,358; C and E
  after-compaction writes 141,704 [read, summed].
- The plan's "1.18 M to 2.49 M units" for two switched seats (`plan_room_stretch_2026-11-13.md:54-55`) re-derives:
  librarian + main Opus writes 1,183,657; their Fable writes 1,243,300 x 2 = 2.49 M [read]. The Third Place switch at
  15:01:55 is a third one, not in that count [read].
- `analyze.js` (read whole) over the 24 h to 17:05Z: ~~35.2 M~~ [2nd reader: 35.66 M, `analyze.js 2026-11-13T17:05:57Z`
  over a fresh `extract.js` run ending 17:17:48Z] weighted units in all; cold-wake plus model-change writes
  7,971,666 tokens (holds), ~~28.5 %~~ [2nd reader: 28.1 %; likely cause: the live files were read to different ends
  before 17:05:57Z in the first run, inferred] of units [read, my run]. D was dark for most of that 24 h, so the share is of a short day.

What triggered each first call [read, my `trigger.js`: per user row only origin kind, isMeta and two booleans]:
- librarian, main, A, C, P: a human-origin prompt 0-6 s before the call (14:43:26, 14:46:27, 14:47:01, 14:46:58,
  14:46:56).
- O: a slash command at 14:51:28 (command name `/effort`), then a keep-warm prompt at 14:51:32, then the write at
  14:51:37. The board's keep-warm row: 14:51:32, "13722 min since its last request started", context 642,569 [read,
  `C:/Consonance/data/board.jsonl`, numbers only].
- Slash-command names in the window [read, `cmds.js`, names only]: main `/effort` 14:47:22, `/model` 14:47:36, `/model`
  15:05:19; P `/effort` 14:51:23; O `/effort` 14:51:28; Third Place `/compact` 15:49:28. The librarian and the Third
  Place switched to Fable with no `<command-name>` row in their transcripts; the settings file was written 15:01:54Z,
  one second before the Third Place's first Fable call [read]. How the librarian's switch was made is not recorded.
  [2nd reader: the moment is recorded, the means is not. The librarian's last Opus call is 14:47:54 and an `attachment`
  row of type `model` sits at 14:48:49, with the prompt before its first Fable call. Main's `model` attachment is at
  14:49:06 after its `/model` at 14:47:36; the Third Place's at 15:01:56, after its first Fable call (15:01:55). Read
  from the three transcripts: `type`, `subtype`, `attachment.type` and model fields only.]
  [2nd reader: main's `/model` at 15:05:19 is a `system` row with subtype `local_command`, not a `user` row; the
  14:47:36 `/model` and every `/effort` are `user` rows. Two shapes in one transcript; `activated_by_use` ignores the
  first (`main.rs:13141`) and counts the second.]
- `/effort` caused no rewrite: P's and main's calls after their `/effort` rows wrote no context-sized block except
  main's `/model` switch [read]. This agrees with prompt-caching `:97`. [2nd reader: DOWNGRADED to one case. Main's
  last Opus call (14:47:18) came before its `/effort` (14:47:22) and its next call was the Fable switch, so main says
  nothing about effort. P alone holds: next call 14:59:15, read 524,816, wrote 694. O's `/effort` came before its cold
  write.]

About pane O (the relayed question "o pane is inactive btw?"): by the record, O made no request of its own from
11-04T02:09Z until 17:04:17Z today. Its calls before that answered keep-warm pings only: 14:51:32 (woke it, 642,636
written), 15:43:41 and 16:35:49 (each read ~675k). A human-origin prompt of 4,316 characters arrived at 17:04:17Z and O
was working at 17:05:39Z, the extract's last row [read]. So: inactive until 17:04Z, active since.

## 4. Ways to make the wake cheaper

Relative cost is an ASSUMPTION, not the plan's accounting: units = Fable 5.2 input-token equivalents, from
`analyze.js:2-3` (Opus 5.5 input 0.5, 1 h write 1, read 0.025; Fable 5.2 input 1, 1 h write 2, read 0.025). On a
subscription this stands for weekly usage, not money [inferred]. The rule that governs half of these:
`memory/no-cut-without-his-word.md:7` "No seat's carried conversation is compacted or cut ... without the keeper's
explicit word for that seat", and `:11` "never recommend a compaction on cost alone" [read]. [2nd reader: the quotes
hold. The path is not repo-relative: there is no such file under `exo_memory/memory/`; it is
`C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory/no-cut-without-his-word.md`.]

### 4.1 Choose the model before the first request [ours] (not a cut)

Cause [read]: the resume restored Opus 5.5 (`model-config.md:152`) while settings say `fable` (`settings.json:5`);
the switch afterwards paid a second full write (`prompt-caching.md:79`). [2nd reader: DOWNGRADED. `settings.json` was
last written 15:01:54Z, after all nine first calls, and no backup is newer than `settings.json.before-opus-2026-10-30`.
So what the `model` key said at 14:43-14:51Z is not on disk. The cause holds either way (a resume ignores the `model`
key, `model-config.md:152`); "settings say fable" is only known from 15:01:54Z.]
[2nd reader: an option not listed here: `model-config.md:156` says an `ANTHROPIC_DEFAULT_OPUS_MODEL` family variable
also outranks the restored model (v2.1.195+). No rebuild, but it changes what the `opus` alias means for every seat and
pane. Its effect on a resumed Opus seat is not tested (inferred).]
- (a) Smallest real fix, Rust: in `spawn_claude_pane`, after `:1141-1145`, push `--model <m>` when the room has named a
  model for that seat. `--model` outranks the restored model (`model-config.md:156`). Source of `<m>`: a per-seat (or
  per-role) value in Consonance's own config, read with `get_state()` as the ambient settings are at `:1227`; empty
  means today's behaviour. Saves this morning 2,029,827 Opus-write tokens (2.03 M units); the Fable writes stay.
  Needs a rebuild and one restart. Loses nothing of context. His word: which model each seat runs is his call week by
  week (`seat-substrates.md:12`). [2nd reader: it does lose one thing. `--model` holds "for the current session"
  (`cli-reference.md:108`), so after each restart the pin outranks any `/model` he made in that pane. His `/model` stops
  deciding a seat's model past a restart, and the pin becomes a second place where the model is chosen (inferred).]
- (b) No rebuild: `ANTHROPIC_MODEL` in the `env` block of `settings.json`. Docs give the variable precedence over the
  restored model (`:156`); whether a settings `env` value counts the same is not documented where I read [inferred, needs
  a probe]. [2nd reader: DOWNGRADED, half of it is documented. `settings-reference.md:2465` says user-settings `env` is
  applied "at startup, and again in the running session when a saved change alters the merged `env`", and `:2467` puts
  model selection among the variables applied at startup. So the value is set at launch like a shell variable. Its
  precedence over a restored model still needs the probe. The live re-apply also means that writing it would reach every
  running seat at once; whether that switches their model mid-session is not documented (inferred).] It puts every seat and pane on one model, which today would move six Opus panes to Fable and double their
  write weight. Settings change: his word.
- (c) No build: a standing order to run `/model` in a seat before its first message after a launch. Free while the
  cache is cold (`prompt-caching.md:81`) [2nd reader: DOWNGRADED. `:81` says only that `/model` switches without asking
  once the cache has expired. "Free" is an inference: the switch itself sends no request, and the first request writes
  the context once, on the new model.]. It is a cue racing the first prompt (the librarian's came 4 s before its call).
- Check that fails today [ours]: over the extract, for each wake (a call after a gap of 60 min or more), red when a call
  within 10 min is on another model family and writes at least half its context. Red today: librarian, main, Third
  Place (3 of 9). Pass: 0 on the next two wakes. Pin test, like `main.rs:1084`: with a model configured the spawn args
  hold `--model <m>` before `spawn_command`; with none they hold no `--model`.
  [2nd reader: re-run red for the reason given: librarian 14:48:53, main 14:49:14 and Third Place 15:01:55 each write a
  Fable block of at least half the context within 10 min of an Opus wake; the other six do not. The design is weak in
  two ways. (1) It passes with no fix at all on any wake where he does not switch, so "0 on the next two wakes" proves
  nothing unless a switch was wanted. A stronger check: the first call after a wake is on the model named for that seat;
  that is red today wherever a seat is named Fable. (2) It fires wrongly when he switches on purpose within 10 min of a
  wake. The pin test is a source-text test, like `:1084`; a `--model` written in a comment inside `spawn_claude_pane`
  would satisfy a `find()`. Anchor it on the `cmd.args` call, as `:1081-1082` warns.]
- Probe for (b), not run by me: resume a throwaway session with `ANTHROPIC_MODEL` set to a model name that does not
  exist in the settings `env`; the "issue with the selected model" error means the env value won. That is C's trick at
  `main.rs:9960-9963` ("a model name that does not exist, so no turn was billed") [read].
  [2nd reader: the error text is documented (`model-config.md:173`). Do not run the probe by writing the user
  `settings.json`: that file is under `~/.claude`, needs his word, and its `env` is re-applied to running sessions
  (`settings-reference.md:2465`). Pass the value for one launch with `--settings '{"env":{"ANTHROPIC_MODEL":"..."}}'`
  (`cli-reference.md`, `--settings` row), on a throwaway session or with `--fork-session`, never on a seat.]

### 4.2 Keep-warm must not treat a slash command as activation [ours] (not a cut)

Cause [read + inferred]: `activated_by_use` (`main.rs:13138`) counts any non-meta human `user` row after launch whose
text does not start with `<task-notification>` (`:13162`). A local `/effort` writes such a row and makes no request. The
code's own rule is "a request since the app started" (`:13103-13104`). Then `keep_warm_decision` pings at 50 min or
more idle "with no ceiling" (`:13107-13109`). The running app is the 11-08 build (`target/release/consonance.exe` 11-08
23:56 local; `activated_by_use` landed 09-21, `6966c761`) [read].
- Fix: also refuse rows whose text starts with `<command-name>` or `<local-command-stdout>`. Rust; rebuild.
- Saves 642,636 Opus-write tokens on a day the pane gets no work. Today O got work at 17:04Z, so the write moved earlier
  rather than being saved; the two later pings read ~1.35 M (~34k units) [read, inferred].
- Check that fails today: a unit test beside `main.rs:23640-23678`: a transcript holding only the three rows of a local
  `/effort` after app start makes `activated_by_use` return false. Red on today's code; recorded case O 14:51:28 to
  14:51:37.
  [2nd reader: confirmed red for the reason given. O's three rows at 14:51:28 are one `isMeta` row and two non-meta
  `user` rows with no `origin.kind`, one starting `<command-name>/effort`, one `<local-command-stdout>`. Both pass every
  filter at `main.rs:13141-13162`. The app running is that exe, started 14:42:24Z (process path and start time), so
  14:51:28 is after app start. The design can be met without the fix's intent by refusing only `/effort`. It would fire
  wrongly (stay cold) for a seat whose only input since launch is a slash command that does send a request, e.g.
  `/compact` or a prompt-type command. The rule closer to the code's own words (":13103", "a request since the app
  started") is an assistant row after app start, still excluding turns that a task notification started.]

### 4.3 A seat resumed near the 967k line [ours]: his word, per seat

C and E resumed at 892,704 and 905,784, wrote 1.73 M, and auto-compacted at 968,566 and 968,138 nine minutes later
[read]. The compaction was coming anyway; only its timing is open.
- A cold `/compact` sent before the first message would reprocess the history as uncached input (`prompt-caching.md:184`):
  about 0.87 M units for the two instead of 1.73 M, then ~0.14 M for the short history [inferred, assumed weights].
- It is a compaction: his word for each seat. Needs a command sent to the pane (keeper or chair), no build.
- Check that fails today: count wakes where an auto compaction follows the first cold write within 15 min. Red: 2 (C, E).
  [2nd reader: re-run red, C 14:47:04 to 14:55:59 and E 14:47:15 to 14:56:19. It can be met with no saving by raising
  the auto-compact line or turning auto-compaction off: no compaction follows, and the 1.73 M write stays.]

### 4.4 A warm `/compact` at the close of a day, or a fresh seat from its handoff [ours]: his word, per seat

- Warm compaction before the app closes: the summary reads the prefix from cache (`prompt-caching.md:182`). The next wake
  writes only the short history: C and E's post-compaction contexts were 112,759 and 96,133 [read]. On this morning's
  numbers: about 5.92 M down to about 0.9 M, so roughly 5.0 M units saved, less the closing reads (about 0.15 M)
  [inferred, assumed weights]. [2nd reader: the summaries' own output is not counted. At the assumed Opus output
  weight of 2.5, nine summaries of ~20k tokens are about 0.45 M (inferred; summary length not measured here).] Needs a command sent to each pane at the close (by hand or via the chair; automating it in
  the Leave path is Rust). Loses the carried conversation: one window hand-counted 14 KEPT, 8 PART, 15 LOST of 37, and
  his exact words survive one compaction, not two [summary, `in_wake.md:50-51`].
- The harness already does this in-process: 36 of the 50 compactions on D since 11-03 sit within 5 min of an idle notice
  (49 auto, 1 manual) [read, my count from the extracts]. It cannot run when the app closes before the idle hour, which
  is what happened on 11-12 [inferred: no boundary before today's wake].
- Fresh seat from its handoff: a one-call session in the main seat's directory had context 62,392 (11-12 10:30Z) and one
  in the Third Place's 81,019 (11-07 10:30Z) [read; what those sessions were for, not opened]. Saves about 5.3 M units
  this morning [inferred]. The seats resume fixed ids by design (`main.rs:7403`, `:7620`, `:7630`), so a fresh seat needs
  a new id: Rust, or a change to how the seat is registered. It is a cut of the whole carried conversation: his word.

### 4.5 A lower auto-compact line [ours]: his word

`modelSettings.<model>.autoCompactWindow` in settings (no rebuild) or `--autocompact` per seat (rebuild). At 400k this
morning's first writes would have been 2,682,251 tokens smaller; at 600k, 1,263,996 [read, summed]. [2nd reader:
re-summed, both hold, as the sum of each seat's context above the line. That is a floor, not an estimate: after a
compaction a seat regrows from ~100k, so its context at a wake can sit anywhere under the line.] Every seat would
compact more often while working, so more cuts: his word, for every seat it covers.

### 4.6 Keep warm across the gap [ours]: not a cut, but his call on spend

An hourly ping reads the context at 0.025 per token against 1 per token for a cold Opus write, so it breaks even near
40 pings [inferred, assumed weights]. This morning's gaps were 33-34 h, so it would save ~~about 15 % of 5.08 M~~
[2nd reader: pings fire at 50 min plus a 0-6 min offset plus a tick (`main.rs:12930`, `:12946`, `:12941-12942`), so a
2,000-min gap takes about 35-39 pings, not 33. That is 0.88-0.98 of one write, a saving of about 2-12 %, roughly
0.1-0.6 M of 5.08 M before the pings' own output. O's 13,722-min gap would have taken ~250 pings, about 6 writes.], and only
if D and the app stay up while he works on L and no ping misses the hour (`KEEP_WARM_AFTER` 50 min plus 0-6,
`main.rs:12930`, `:12946`) [read]. Weak; listed for completeness.

### 4.7 Not a saving, but it decides W1's cost [ours]

W1 needs a rebuild and a restart (`plan_room_stretch_2026-11-13.md:46`). The shelf is rewritten at every launch
(`main.rs:9558`), project context reloads at session start, and sequential sessions share a prefix only if the git
snapshot matches (`prompt-caching.md:26`, `:316`) [read]. So a mid-day restart likely rewrites every seat whole even
inside the hour [inferred]. Record: 84 calls since 08-01 wrote at least half of a context over 100k after a gap under
55 min with no model change and no compaction, 42,128,568 tokens; 0 since 11-01; causes not opened [read, my
`warmgap.js`]. Do W1's restart when the seats are cold anyway, before a day's first message, and it costs no extra wake.

### What each needs, in one place

| way | saves this morning (assumed units) | rebuild | hook install | his word | cut? |
|---|---|---|---|---|---|
| 4.1a `--model` on resume | 2.03 M | yes | no | which model per seat | no |
| 4.1b `ANTHROPIC_MODEL` in settings env | 2.03 M if the probe passes | no | no | settings change, one model for all | no |
| 4.2 keep-warm activation | 0.64 M on an unused day | yes | no | no (matches the code's own rule) | no |
| 4.3 cold `/compact` before first message, near the line | ~0.7 M | no | no | yes, per seat | yes |
| 4.4 warm `/compact` at close / fresh seat | ~5.0 M / ~5.3 M | no / yes | no | yes, per seat | yes |
| 4.5 lower auto-compact line | 1.3-2.7 M | no (settings) | no | yes | yes |
| 4.6 keep warm across the gap | ~~~0.8 M~~ [2nd reader: ~0.1-0.6 M, see 4.6] | no | no | spend | no |

Not proposed: `promptCacheTtl: "5m"` (cheaper writes, but every pause over five minutes would be a cold rewrite;
`prompt-caching.md:265`) [inferred]. `idleCompaction: false` honours the no-cut word but turns each warm idle compaction
into a later cold write unless keep-warm lands first; that trade is Lap C item 2 and his (`plan_room_stretch:56-58`)
[summary].

## What I did not open

- L's disk and transcripts; any wake on L.
- `in_cost.md`, `00_lean_seats.md`, the hook files, `consonance/launch.ps1`, the Leave path in `main.rs`.
- Downloaded but not read: `costs.md`, `slash-commands.md`, `interactive-mode.md`, `settings.md` (docs). The platform
  pricing page: the weights above are the in_cost table's, used as an assumption.
- `seat_tokens.js` was read whole but not run: it aggregates over hours and does not give a per-wake first call, so
  `extract.js` plus `analyze.js` were used instead.
- What the 84 warm-gap rewrites were (restarts, upgrades or something else); what the 11-07 and 11-12 one-call sessions
  were for; how the librarian's model switch at 14:48:53 was made.
- Whether a settings-`env` `ANTHROPIC_MODEL` or a project-settings `model` outranks the restored model (no probe run).

## Second reader

Second reader, 2026-11-13 ~17:20Z on D, HEAD 3f5fa65d (no commit touched `consonance/src-tauri/src/main.rs` since the
first reader's d41c088e). Read-only except this file. Primaries opened: `main.rs`, `~/.claude/settings.json` (read),
the two memory notes and `no-cut-without-his-word.md`, the four doc pages downloaded fresh with curl (line numbers
matched the first reader's on every cite), `extract.js` and `analyze.js` read whole and re-run over the nine current
transcripts, scratch scripts of my own (numbers, row types, slash-command names and booleans only), the board rows for
14:51:32Z (numbers only), git log, the release exe's mtime, and the running process's path and start time.

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 9 | 9 seats cold ~33 h, O 9.5 d, 5,922,308 written, all Opus | extract.js re-run | OK | idle 1,990-2,064 min, O 13,722; sum 5,922,308 |
| 11-12 | 3 switched, 2,049,358, 21 s-5.4 min, 2,029,827 saved | extract.js re-run | OK | 328,307+914,993+806,058; 281,830+901,827+846,170 |
| 13 | C, E within 75k of 967k, 1.73 M, compact 9 min on | extract.js re-run | OK | 892,704 / 905,784; 14:55:59, 14:56:19 |
| 14 | O woken 4 s after an /effort row counted | transcript rows, main.rs:13162 | OK | /effort 14:51:28, ping 14:51:32, write 14:51:37 |
| 21 | spawn passes --resume / --session-id only | main.rs:1141-1145 | OK | quoted lines present |
| 22 | other args :1150, :1165, :1196 | main.rs | OK | skip-perms, allowedTools, mcp-config |
| 23 | only --model text is :9968 | grep main.rs | WRONG | also :10128; neither in the spawn |
| 25-26 | SIDs :7403/:7620/:7630; shelf rewritten :9558 | main.rs | OK | constants and comment present |
| 27-29 | model fable; modelSettings; no 4 keys; mtime 15:01:54Z | settings.json:5, :149-156 | OK | grep count 0; mtime 09:01:54 local |
| 30 | Claude Code 2.1.323, DISABLE_AUTOUPDATER | claude --version, settings.json:3 | OK | 2.1.323 |
| 31 | 826,005 written on 09-18 | cold-start-reload-cost.md:11 | OK | cache_write 826,005 |
| 32-33 | substrates note :8-18 quoted | seat-substrates.md | OK | note added: its "restart" claim is wrong |
| 38-39 | per-model cache; /model asks only while warm | prompt-caching.md:35, :79, :81 | OK | text matches |
| 40-41 | effort keeps cache on Fable 5.1+, Opus 5.5 | prompt-caching.md:36, :97 | OK | text matches |
| 42-44 | warm vs cold compaction | prompt-caching.md:182, :184 | OK | text matches |
| 45-46 | idleCompaction false, v2.1.290+ | prompt-caching.md:190 | OK | text matches |
| 47 | resume re-sends, reads unchanged prefix | prompt-caching.md:257 | OK | text matches |
| 48-49 | 1 h main / 5 min else; overrides | prompt-caching.md:269-279, :285-299 | OK | table rows match |
| 50-51 | cache scope, git snapshot, project context | prompt-caching.md:26, :313-316 | OK | text matches |
| 54-56 | resume keeps model; --model outranks | model-config.md:152, :156 | OK | quotes exact |
| 57-58 | ANTHROPIC_DEFAULT_MODEL ignored; ANTHROPIC_MODEL returns | model-config.md:216-223 | OK | list and sentence match |
| 59-61 | ~967K default; autoCompactWindow; --autocompact | model-config.md:866-868, :901 | OK | text matches |
| 62 | --effort one session; modelSettings | model-config.md:729-731 | OK | text matches |
| 65-69 | idleCompaction conditions; notice; min 100,000 | settings-reference.md:2526-2566 | OK | text matches |
| 71-73 | CLI rows and system prompt reuse | cli-reference.md:72, 88, 94, 108, 126, 173 | OK | rows match |
| 80 | pane letters by grep | grep exo_memory | OK | B, E hold; the "X (sibling-" form gives 0 for B and E |
| 82 | every write a 1 h write | extract.js re-run | OK | cw1h/cw 1.00 on all nine |
| 86-94 | the table, all nine rows | extract.js re-run | OK | every number re-derived |
| 97-98 | 21k-34k read; no compaction before the wake | extract.js re-run | OK | 21,041-33,635; 0 boundaries in each gap |
| 99-100 | 5,922,308 / 5,076,138 / 2,049,358 / 141,704 | extract.js re-run | OK | 79,165+62,539 |
| 101-103 | plan's 1.18 M to 2.49 M | plan_room_stretch:54-55 | OK | 1,183,657; 1,243,300 x 2 |
| 104-105 | 35.2 M units, 7,971,666, 28.5 % | analyze.js re-run | WRONG | 35.66 M, 28.1 %; 7,971,666 holds |
| 108-109 | human prompt 0-6 s before 5 first calls | user rows, origin only | OK | 14:43:26, 14:46:27, 14:46:56, 14:46:58, 14:47:01 |
| 110-112 | O rows; board row 13722 min, 642,569 | transcript; board.jsonl | OK | board ts 14:51:32.368Z and .942Z |
| 113-115 | slash-command list | rows, names only | OK | main 15:05:19 is a system local_command row |
| 115-116 | lib, TP: no command row; means unrecorded | row types | DOWNGRADED | `model` attachment rows mark the moment |
| 117-118 | /effort caused no rewrite (P and main) | extract.js re-run | DOWNGRADED | P alone; main's next call was the switch |
| 120-123 | O inactive until 17:04Z; pings; 4,316 chars | extract.js; user rows | OK | 43 calls 17:04:20-17:09:49 |
| 128 | weights from analyze.js:2-3 | analyze.js | OK | comment lines match |
| 130-131 | no-cut rule quotes :7, :11 | memory note | OK | path is not repo-relative (noted) |
| 135 | settings say fable at the wake | settings.json mtime, backups | DOWNGRADED | written 15:01:54Z, after all first calls |
| 137-142 | --model outranks; get_state at :1227 | model-config.md:156; main.rs:1227 | OK | loss added: the pin outranks his /model |
| 143-146 | settings env not documented | settings-reference.md:2465, :2467 | DOWNGRADED | applied at startup, and live |
| 147-148 | /model free while cold | prompt-caching.md:81 | DOWNGRADED | :81 is about the confirm; "free" inferred |
| 149-152 | 4.1 check red on 3 of 9 | extract.js re-run | OK | red for the reason; design weak (noted) |
| 155 | C's trick at :9960-9963 | main.rs | OK | quote at :9962-9963 |
| 159-162 | activated_by_use; keeper's rule; no ceiling | main.rs:13103-13108, :13138-13163 | OK | code matches |
| 162-163 | running app is the 11-08 build; 6966c761 09-21 | exe mtime, git, process | OK | exe 11-08 23:56 local; process start 14:42:24Z |
| 165-166 | 642,636 saved; later pings ~1.35 M read | extract.js re-run | OK | 675,423 + 675,722 |
| 167-169 | 4.2 unit test red on today's code | O's rows vs main.rs:13141-13162 | OK | the command row passes every filter |
| 173 | C, E numbers | extract.js re-run | OK | as line 13 |
| 178 | 4.3 check red 2 | extract.js re-run | OK | gameable by raising the line (noted) |
| 183 | post-compaction contexts 112,759 / 96,133 | extract.js re-run | OK | first calls 14:56:02, 14:56:20 |
| 186-187 | 14/8/15 of 37 | in_wake.md:50-51 | OK | marked [summary]; matches |
| 188-189 | 36 of 50 near idle; 49 auto, 1 manual | extract.js re-run | OK | same counts |
| 191-192 | one-call sessions 62,392 / 81,019 | two small transcripts | OK | 11-12 10:30:24Z, 11-07 10:30:48Z |
| 199 | 2,682,251 at 400k; 1,263,996 at 600k | re-summed | OK | a floor, not an estimate (noted) |
| 204-207 | keep warm saves ~15 % of 5.08 M | main.rs:12930-12951 | WRONG | 35-39 pings, ~2-12 % |
| 211-213 | W1 rebuild; shelf rewrite; cache scope | plan:46; main.rs:9558; docs | OK | lines match |
| 214-216 | 84 warm-gap rewrites, 42,128,568, 0 since 11-01 | own re-count | OK | same three numbers |
| 232-233 | Lap C item 2 | plan_room_stretch:56-58 | OK | lines match |

Line numbers in this table are the first reader's, before my inserts.

**Tally:** 61 rows checked. OK 53, WRONG 3, DOWNGRADED 5, UNSUPPORTED 0. Notes added without a verdict change: the
substrates memory note's "restart" claim, the `ANTHROPIC_DEFAULT_OPUS_MODEL` option, the probe's write path, the
summaries' output in 4.4, the floor reading of 4.5, and the pin's loss of his `/model`.

**The proposed checks, tested as designs:**
- 4.1 model check: red today for the reason given (3 of 9). It passes with no fix on any wake without a switch, and
  fires on a deliberate switch inside 10 min. Better: the first call after a wake is on the model named for that seat.
- 4.1 pin test: red today (no `--model` in the spawn). A source-text `find()` is met by a comment; anchor on `cmd.args`.
- 4.2 unit test: red today for the reason given. Met narrowly by refusing only `/effort`; it would leave a seat cold
  whose only post-launch input is a slash command that does send a request.
- 4.3 check: red today (C, E). Met with no saving by raising the auto line or turning auto-compaction off.
- None of these needs a hook install. 4.1(a) and 4.2 need a rebuild of `consonance/src-tauri` and one restart. 4.1(b),
  4.5 and any `idleCompaction` change are writes to `~/.claude/settings.json`: his word. 4.3, 4.4 and 4.5 compact or cut
  seats: his word, per seat (`no-cut-without-his-word.md:7`), and that note's `:11` forbids recommending them on cost
  alone.

**A slip of mine, recorded:** one scratch command wrote three small output files (row types near the model switches,
190-298 bytes each) into the working directory `C:/Consonance/instances/librarian` by mistake. I deleted those three
files in the next call. Nothing else under `C:/Consonance` or `~/.claude` was written.

**What I could not check:**
- What the settings `model` key said at 14:43-14:51Z (no copy on disk), and by what means the librarian and the Third
  Place were switched.
- Whether `ANTHROPIC_MODEL` from a settings `env`, or `ANTHROPIC_DEFAULT_OPUS_MODEL`, outranks a restored model in
  practice (no probe run; it needs a launch).
- Whether a mid-day restart rewrites a seat whole inside the hour (4.7), and the causes of the 84 warm-gap rewrites.
- The first reader's scratch scripts (`tools/trigger.js`, `tools/warmgap.js` in the shared scratchpad): found, not run;
  I re-derived their outputs with my own.

## What I did not open (2nd reader)

- L's disk and transcripts. `seat_tokens.js` past line 60 (not run; the first reader did not run it either).
- The docs pages on costs, sessions, errors and env-vars. The platform pricing page: the weights stay an assumption.
- `consonance/launch.ps1`, the hooks, and the Leave path in `main.rs`.
- Any transcript text: only numbers, timestamps, row types, slash-command names and booleans were taken.
