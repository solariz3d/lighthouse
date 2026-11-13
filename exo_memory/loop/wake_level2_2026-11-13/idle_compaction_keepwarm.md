# Idle compaction against the keep-warm ping, and the ping that reached a seat idle 9.5 days

Reader: wake level two, idle-compaction-and-keep-warm reader, D, 2026-11-13, data cut 17:06Z. Read-only except this file.
Marks: [read] opened and seen; [summary] from another file; [inferred] my inference; [ours] a proposal.
HEAD d41c088e; `consonance/src-tauri/src/main.rs` last changed in 880f237f (2026-11-04). Repo paths are relative to the root.

## Summary (five lines)

1. The race holds: 293 idle compactions fire ~~54.5-55.5 min~~ [2nd reader: 54.5 to 56.7 min; 55.5 is the p90, not the
   top; max 56.7 on 372c8abc, 56.5 on the librarian, perseat.js idle-gap column, re-run 17:17Z] after a seat's last call; seats pinged at 50-53 min lose 22 of
   992 large pings to one, seats pinged at 54-56 lose 260 of 489. 30 of 42 compactions since 11-03T12:53Z were idle ones.
2. The ping that reached O (sibling-36313935) after 13,722 idle minutes was let through by a local `/effort` row 4 s
   before it: `activated_by_use` counts any non-meta user row after launch, and command echoes are non-meta. Same on 8 of 11 cold pings.
3. O's 642,636-token write was brought forward, not added: O's next real prompt came 133 min later, warm, at 676,002 tokens.
   What the wrong activation cost was the pings in between: 1.35M tokens read for O, 17.07M over all 8 cases since 10-31.
   [2nd reader: true for O, not for all 8. In 4 of 8 the next real call read only the ~33.5k prefix and wrote again
   (12fb81f6 61,638; a2122153 180,454; 0845a868 108,134; librarian 149,380), so those cold pings' 664,706 written were
   added, not brought forward; two were discarded by an idle compaction about 55 min after the ping (afterwake3.js,
   between_cw.js, section 3).]
4. Docs: `idleCompaction` (default true, Any-file scope, key from v2.1.290), terminal feature v2.1.299; it needs 200k+ context
   and the 1-hour cache. Turned off, a seat is bounded only by auto-compaction at about 967k ~~(4 today at 967,305-968,566)~~ [2nd reader: 3 today,
   968,138 / 968,566 / 967,305; the day's 4th is a manual one at 955,196 on the Third Place; x_*.json compacts, 17:17Z].
   [2nd reader: idle notices on D start at v2.1.292 on 10-10, before the changelog's 2.1.299; the docs say it is
   feature-flag gated, `settings-reference.md:2560`, so whether it runs on a given day is not the room's to set.]
5. Smallest fix: one more exclusion in `activated_by_use` (Rust, rebuild, no compaction word). Moving ping minutes or turning idle
   compaction off are compaction decisions and need his word for each seat. So does leaving the default as it is.

## 1. The second reader's figures, re-derived from primaries

Re-run of `second_reader_lean/` (race.js, kw.js, kwjoin.js, kwcold.js read whole first, run unchanged on fresh extracts in my
scratchpad `.../scratchpad/w2_idle`; extract.js re-streamed all nine seat transcripts at 17:05:53Z) [read]:

| figure (second reader, cut 14:52-15:10Z) | now (cut 17:06Z) | verdict |
|---|---|---|
| idle-paired compactions 292, 54.5 to 55.5 min, median 55.1 | 293; min 54.5, p10 54.8, median 55.1, p90 55.5 | holds |
| pings 4,334; with a compaction between row and reply 287 | 4,337; 288 (their replies wrote 18,503,949) | holds |
| chair pinged at 50: 1 idle of 34 compactions | 1 of 35 (one window compaction at 16:52:18Z today, pre 967,305) | holds |
| 372c8abc pinged at 56: 38 of 38 | 39 of 39 (one more idle compaction today at 16:24:11Z) | holds |
| since 11-03T12:53Z: 40 compactions, all auto, 29 idle | 42 auto, 30 idle (seats); +1 manual on the Third Place at 15:54:03Z | holds, moved |
| 36313935: one reply at 13,722 min wrote 642,636 | ping row 14:51:32Z, reply 14:51:37.931Z, read 32,787, wrote 642,636, out 4 | holds |

The four compactions after the second reader's cut [read, x_*.json]: 07b8a48f 14:56:19Z and 0845a868 14:55:59Z (auto, 968,138 and
968,566, not idle), 372c8abc 16:24:11Z (auto, 541,534, IDLE), main 16:52:18Z (auto, 967,305, not idle).

### Per seat, all keep-warm rows since 2026-09-21 (board) and all compactions in each seat's newest transcript

Ping minute = the code's threshold for that seat id (computed with the code's own FNV-1a, `main.rs:12950-12951`), and it matches
the modal minute on the board rows: main 50 (598 of 645 rows), 36313935 52 (246 of 285), 07b8a48f 53, 0845a868, 5bf9d657 and the
librarian 54, 3d57124e and 372c8abc 56 [read: perseat.js, board rows]. The Third Place hashes to 52; its rows carry no numbers.

| seat (session) | ping min | pings | replies >50k written | compactions | idle ones | since 11-03T12:53Z: all / idle | median call ctx since 10-10 |
|---|---|---|---|---|---|---|---|
| main (0c0c0c0a) | 50 | 645 | 3 | 35 | 1 | 2 / 0 | 510,049 |
| 36313935 = O (c88002b1) | 52 | 286 | 4 | 12 | 3 | 0 / 0 | 484,160 |
| 07b8a48f (a2122153) | 53 | 703 | 22 | 51 | 19 | 4 / 1 | 453,653 |
| 0845a868 | 54 | 693 | 72 | 96 | 70 | 7 / 4 | 300,207 |
| 5bf9d657 (12fb81f6) | 54 | 583 | 45 | 58 | 38 | 3 / 1 | 293,177 |
| librarian (0c0c0c0b) | 54 | 508 | 56 | 80 | 55 | 8 / 7 | 265,480 |
| 3d57124e (6fe15f0a) | 56 | 653 | 69 | 99 | 66 | 8 / 7 | 280,497 |
| 372c8abc (fbf98f8e) | 56 | 266 | 40 | 39 | 39 | 10 / 10 | 211,154 |
| third-place (3d000000) | 52 | rows hold no numbers | - | 17 | 2 | 1 / 0 (manual) | not computed |

All [read: perseat.js, kwjoin.js logic per seat; "O" for 36313935 is [summary] from `exo_memory/librarian/2026-11-13.md:453`].
Total since 09-21: 311 ping replies wrote more than 50k [read: kwjoin.js `coldJoined`].

## 2. The mechanism of the race

- Idle compaction starts when a seat of 200k+ tokens on the 1-hour cache has been idle "about an hour"
  (`settings-reference.md` `### idleCompaction`, conditions list) [read]; the changelog for 2.1.299 says "about 54 minutes"
  (`CHANGELOG.md:1572`, under `## 2.1.299`) [read]. Measured: 54.5-55.5 min after the previous call [read: race.js].
- A keep-warm ping is a request. Each seat's ping waits a FIXED threshold, 50 min plus FNV-1a(pane id) mod 7
  (`main.rs:12930`, `:12946`, `:12950-12951`) [read]. So a seat's ping minute decides, every idle hour, which comes first.
- Over pings since 10-10 on contexts of 200k or more (idle-compaction size), the reply came AFTER an idle compaction [read:
  raceseat.js]: main (50) 0 of 381; O (52) 3 of 253; 07b8a48f (53) 19 of 358; 0845a868 (54) 69 of 147; 5bf9d657 (54) 38 of 71;
  librarian (54) 53 of 97; 3d57124e (56) 61 of 119; 372c8abc (56) 39 of 55. Total 282 of 1,481; those replies wrote 18,088,314.
- So a ping before about minute 54 resets the idle clock and the seat is never idle-compacted while the app runs [inferred,
  strongly: 0 of 381 at minute 50]. The "54" seats are a coin toss, because the ping clock starts at the request's START
  (`main.rs` `last_request`, doc comment above it) while the race measures from the response, and the tick is 60 s with one ping per
  tick (`keep_warm_pick`) [inferred].
  [2nd reader: by the minute the ping was actually SENT (row minute, pings >=200k, idle<60, since 10-10, lostmin.js):
  50: 0 of 350 lost; 51: 0/29; 52: 0/223; 53: 2/361; 54: 168/323; 55: 11/20; 56: 97/169; 57: 4/6. The cut is between 53
  and 54, and a seat's threshold is not its sent minute: O (52) sent 8 of 285 at 54 and lost all 3 of its losses there.
  The minute is necessary, not sufficient: 56-minute pings escaped on whole days (3d57124e 10-15/16, 10-30; 372c8abc
  11-05/06, v2.1.318), with no idle notice those days (none56.js, dayver.js); cause not established [inferred: the flag].]
- Idle compaction began on D on 2026-10-10 (first notice ~~09:11:33Z on 0845a868~~ [2nd reader: 07:54:50.796Z on 5bf9d657;
  0845a868's 09:11:33Z is the second seat's; firstidle.js over every instance transcript], version 2.1.292) [read: firstidle.js]. Main's only
  idle one is 2026-10-18 at 698,800; its other 8 since 10-10 are at the window, 966,996-968,029 [read].
- What each side costs per ping, in the second reader's units (cache read 0.025, write 1, Opus weights for all; an assumption about
  price, `kwjoin.js:5`): about 12k-19k units per ping at every seat, early or late minute. Late-minute seats pay in writes after the
  compaction (2.86M-4.98M written each since 10-10); early-minute seats pay in reads of a larger context (145.9M-226.9M read each)
  [read sums; units inferred]. The working-call difference (median context 454k-510k against 211k-300k) is real but confounded by how
  much each seat works; I did not separate it [inferred].

## 3. Why the ping reached O after 13,722 idle minutes

The rule [read]: a seat is pinged only if `activated` (`main.rs:13109-13110`, skip text "not activated this session: no request
since the app started"). Once activated there is no ceiling, by his 07:33 word carried at `main.rs:13106`. Activation is sticky for
the session (`:13358-13367`) and is decided by `activated_by_use` (`:13138-13163`).

`activated_by_use` says it looks for "a turn-starting `user` entry ... that a person or a seat sent" (`:13126`). It excludes
sidechain, `isMeta`, `origin.kind == task-notification`, and rows with no text part; the last test is (`:13162`):

    matches!(text, Some(t) if !t.trim_start().starts_with("<task-notification>"))

A local slash command writes three user rows: a meta caveat, a row whose text opens `<command-name>`, and one that opens
`<local-command-stdout>`. The last two carry no `isMeta` and no `origin`, so they pass. No API request follows them; they start no turn.

The recorded case, O's transcript `c88002b1-....jsonl` (row shapes only) [read: shape.js, tailrows.js]:
- last request before today: 2026-11-04T02:09:26.991Z (line 52115); then nothing until a `hook_success` attachment row at 14:42:42.332Z (the launch);
- 14:51:28.831Z: meta caveat (52135), `<command-name>` row naming `/effort` (52136), `<local-command-stdout>` row (52137);
- 14:51:32.368Z board: `keep-warm MISSED -> c88002b1 ... 13722 min`, last reason "not activated this session ..." [read: board];
- 14:51:32.942Z board: the ping row, same tick; 14:51:37.931Z reply: read 32,787, wrote 642,636, out 4 [read].

So the previous tick still skipped O as not activated, and the only rows between the two ticks were the command echo [read]. The
code reads that echo as use [read: `:13138-13163`]. It is not his 05:57 rule in practice: "keep warm what is already warm, and then wait
for each seat and pane to activate" (`exo_memory/loop/plan_keep_warm_2026-09-21.md:75-76`, verbatim) [read]. Whether a `/effort` is
him activating a seat is his reading. Nothing on disk rules on it [inferred: no hit for `command-name` in the keep-warm code].

The same shape on the other cold pings [read: coldwhy.js]. Of 11 pings at 60+ idle minutes since 09-21, 8 were preceded within ~~4 s to
2 min~~ [2nd reader: 4 s to 204 s; 0845a868 133 s, 6fe15f0a 204 s on 11-10, coldwhy.js re-run] by a command row: `/model` (fbf98f8e 10-31, 6,121 min), `/effort` (12fb81f6, a2122153, 0845a868, 6fe15f0a on 11-10 at 703-5,099
min; main and the librarian on 11-11 at 529 and 523 min; O on 11-13). The other 3 (90, 70, 108 min) had no command row.
On 11-10 the board shows the same flip: four MISSED rows at 18:28-18:29Z, each with last reason "not activated this session" [read].

What it cost [read: afterwake.js]: every one of the 8 seats got a real prompt later (+1 to +4,657 min), ~~so each cold write would have
been paid then anyway~~ [inferred]. [2nd reader: not in 4 of 8. The first call at the real prompt read only the ~33.5k prefix
and wrote again: 12fb81f6 61,638 (19:23Z, just after an idle compaction 55 min after its 18:28 ping), a2122153 180,454
(+1,299 min), 0845a868 108,134 (+1,256 min, after an idle compaction at 19:25Z), librarian 149,380 (+1 min, cause not
established). Their cold-ping writes, 176,973 + 142,782 + 195,558 + 149,393 = 664,706, were added, not brought forward.
The other 4 (fbf98f8e, 6fe15f0a, main, O) were carried warm to the prompt. afterwake3.js (skips compaction-summary rows),
between_cw.js. The pings between also wrote 196,350.] For O the real prompt came at 17:04:20Z (+133 min). It read 676,002 warm because of the ping
[read]. The extra was the pings in between: O 2 pings, 1,351,145 read; all 8 cases 17,071,513 read (fbf98f8e alone 82 pings,
12,261,432 over 4,657 min). That is about 0.43M units at 0.025 [inferred]. The "642,636 written" in plan Lap C item 3 and W9 is a cost
moved 133 min earlier, not one added [inferred from the counterfactual]. [2nd reader: holds for O; see the correction above
for the 4 cases where it was added, about 0.66M write units, more than the 0.43M of reads.] It would have been added only if O had never been used that
session.

On his question at 11:01, "o pane is inactive btw?" (`exo_memory/briefs/lighthouse_the_room.md:117`, verbatim) [read]: O made no
request from 2026-11-04T02:09Z to 2026-11-13T14:51Z except the keep-warm reply; it has been working since 17:04:20Z (calls to
17:06:22Z, context 737,287) [read: tailrows.js].

## 4. The docs, downloaded as text (curl, 2026-11-13; installed `claude --version` 2.1.323) [read]

- `idleCompaction` (`https://code.claude.com/docs/en/settings-reference.md`, `### idleCompaction`): Boolean, default `true`, scope
  "Any file". It runs in an interactive terminal session when auto-compaction is on, the conversation is on the one-hour cache
  TTL, it has reached the token threshold (default 200,000), and "about an hour has passed since the last request". Off: `"idleCompaction":
  false`, or `/config`'s Idle compaction row (v2.1.302+). The key needs v2.1.290+; on older versions turn off `autoCompactEnabled`.
  The terminal notice starts "Compacted while idle, before the prompt cache expired".
- Threshold: `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`, positive whole number, minimum 100,000 (same section; `env-vars.md:321`).
- `DISABLE_AUTO_COMPACT=1` or `"autoCompactEnabled": false` turns idle compaction off as well (`settings-reference.md`,
  `### autoCompactEnabled`; `env-vars.md:448`).
- Changelog (`raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`): 2.1.299 "Added idle compaction in the terminal:
  a 200K+ token conversation left idle for about 54 minutes is compacted before its one-hour prompt cache expires" and the env var
  and setting "Both need v2.1.290 or later" (`:1572-1573`); 2.1.302 the `/config` row (`:1361`); 2.1.314 runs it with
  telemetry off too (`:903`); 2.1.318 "Fixed idle compaction replacing a conversation with a reply that was not a summary" (`:591`).
- The bound with idle compaction off (`model-config.md`, `### Default auto-compact thresholds`): native 1M-window models "compact
  before the window fills, at about 967K tokens by default"; `autoCompactWindow` (100,000-1,000,000) or
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW` moves it (`### Set the auto-compact window`).
- PreCompact (`hooks.md`, `### PreCompact`): matcher `auto` covers both the window and idle compaction. Exit 2 or
  `"decision": "block"` blocks it; a proactive auto compaction is then ~~"skipped and the conversation continues uncompacted"~~
  [2nd reader: verbatim "Claude Code skips it and the conversation continues uncompacted", `hooks.md` `### PreCompact`]. PreCompact
  stdout ~~"becomes instructions for the compaction summary"~~ [2nd reader: verbatim "Claude Code uses its stdout as instructions
  for the compaction summary", cut at 10,000 characters] (`hooks.md`, `#### PreCompact output`). That bears on in_wake fault 7.
- Settings on D [read]: `~/.claude/settings.json` sets `"model"` and ~~nothing about compaction~~ [2nd reader: no compaction
  key or env var; it does register two PreCompact hooks, `settings.json:84-96`, and neither can block (no exit 2 or
  `decision` in `~/.claude/shell/hooks/precompact.js` or `~/.claude/shell/precompact-preserve.js`)]. No seat instance dir has a
  `.claude/settings.json`: O's has no `.claude`, the librarian's holds only a lock. `main.rs` sets no compaction flag or env
  (grep). So every seat runs the default: idle compaction on at 200k, window at about 967k.

## 5. The options, costed on the measured numbers

| option | change | what it buys | what it costs | his word? |
|---|---|---|---|---|
| A. every ping before minute 54 | `KEEP_WARM_SPREAD_MIN` 7 to 3 (`main.rs:12946`): 50-52 | about 260 idle compactions avoided since 10-10 (16.73M written after them at the 54/56 seats) | those 5 seats grow like main and O (median 454k-510k, not 211k-300k), ~967k at the window; it races a timing the harness calls "about an hour", which a release can move; Rust rebuild + restart [2nd reader: and 8 seats in 3 slots share crossing minutes, so one-ping-per-tick deferral pushes more pings to 54+, the very slip that cost O its 3; keeping 7 slots and lowering `KEEP_WARM_AFTER` to 45 (45-51) avoids that at about 11% more pings, ~14k units each, `main.rs:12930`, :13302] | yes: it decides which compactions happen, per seat |
| B. idle compaction off | `"idleCompaction": false` in `C:/Consonance/instances/<seat>/.claude/settings.json` (per seat; Any-file scope) or in `~/.claude/settings.json` (every session on D) | the same seats keep their thread; no race; no rebuild | bound becomes the ~967k window only; seats close larger, so the cold-wake writes (plan Lap C 4, W1) grow; ~~whether a running seat picks up a file edit without restart not checked~~ [2nd reader: the docs say settings files are watched and most edits apply without restart, a new project `.claude/` file included (`settings.md` `### When edits take effect`); `idleCompaction` is not in its restart-only list; untested on a seat] | yes, per seat; it is the direct form of A |
| B'. raise the idle threshold | `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` (e.g. 600000) in the same per-seat file's `env` | idle compaction only for very large seats | a middle bound nobody has measured | yes |
| C1. activation ignores command echoes | one clause at `main.rs:13162` (section 6) | no ping to a cold seat until someone prompts it; 8 recorded cases | 17.07M read since 10-31 saved (~0.43M units); ~~writes unchanged (paid at the real prompt)~~ [2nd reader: plus 664,706 written in the 4 cases where the seat was cold again at its real prompt, section 3]; Rust rebuild + restart | not a compaction; plan lists it as his call (Lap C 3) |
| C2. no ping past X idle minutes | a ceiling in `keep_warm_decision` | same 11 cold pings | undoes ~~his 07:33 ruling that an activated seat stays warm with no ceiling~~ [2nd reader: "with no ceiling" is the code comment's reading, `main.rs:13107-13108`; his 07:33 words at `:13106` are a question; his ruling words are 05:57, "always on during that session, it could last all day", `plan_keep_warm_2026-09-21.md:75-76`] (`main.rs:13106`) | yes |
| D. default stands | nothing | nothing to build | 30 idle compactions of seats since 11-03T12:53Z ran without a per-seat word (rule: ~~`memory/no-cut-without-his-word.md:7`~~ [2nd reader: not a repo path; the file is the librarian's auto-memory, `C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory/no-cut-without-his-word.md:7`, and `:11` below; text holds]) | yes: whether the rule covers harness idle compaction is his reading; no ruling found on disk [inferred: `idleCompaction` appears only in today's swarm files] |

- A, B and B' each decide when a seat's carried conversation is compacted, so under his standing rule each needs his word for each
  seat [read: the rule's text, `no-cut-without-his-word.md:7`]. The same file says "never recommend a compaction on cost alone"
  (`:11`). On cost alone idle compaction is close to neutral per ping (section 2), so cost does not decide this [inferred].
- A PreCompact hook that blocks `auto` below some size would also stop idle compaction per seat. It needs a hook install and the
  same word, and the hook cannot tell idle from window by `trigger` [read: hooks.md]. I would not take it while B exists [ours].
- My view [ours]: B, per seat, if he wants seats uncut; A is B by a race, so it is fragile. Either way, pair it with the plan's
  warm compaction at close (Lap C 4) or the cold-wake cost rises. C1 is independent and smallest.

## 6. The smallest fix and its red-first checks

**C1, `activated_by_use`** [ours]. At `main.rs:13162` also refuse texts that open with a local-command tag:

    matches!(text, Some(t) if { let t = t.trim_start(); !t.starts_with("<task-notification>")
        && !t.starts_with("<command-name>") && !t.starts_with("<local-command-") })

Red-first unit test, beside the D098 tests (`main.rs:23620-23680`), built on the recorded shape (synthetic text, real structure):

```rust
#[test]
fn a_local_slash_command_after_launch_is_not_activation() {
    // O on D, 2026-11-13: last request 11-04T02:09Z; launch 14:42:42Z; /effort echo 14:51:28Z; pinged 14:51:32Z at 13,722 min.
    let start = iso_utc_ms("2026-11-13T14:42:42.000Z");
    let t = [d098_reply("2026-11-04T02:09:26.991Z", "r"),
             r#"{"type":"user","isMeta":true,"timestamp":"2026-11-13T14:51:28.831Z","message":{"role":"user","content":"<local-command-caveat>x</local-command-caveat>"}}"#.to_string(),
             d098_prompt("2026-11-13T14:51:28.831Z", None, "<command-name>/effort</command-name>\n<command-message>effort</command-message>"),
             d098_prompt("2026-11-13T14:51:28.831Z", None, "<local-command-stdout>x</local-command-stdout>")].join("\n");
    assert!(!activated_by_use(&t, start), "a local command echo starts no turn and activates no seat");
}
```

- It FAILS at HEAD: both echo rows are `type: user`, not meta, no origin, have text, and do not open `<task-notification>`, so
  `activated_by_use` returns true [inferred from `:13138-13163`; not run, read-only].
  [2nd reader: confirmed red for that reason on the REAL rows, through a line-for-line JS port of `activated_by_use`
  (actprobe.js, O's transcript lines 52133-52137, start 14:42:42.000Z): HEAD activates on 52136 and 52137; the fix on none.
  The Rust test itself was not compiled (no builds). Helpers `d098_prompt`/`d098_reply` exist at `main.rs:23627`, `:23631`.]
- [2nd reader, design test] Satisfied without fixing: a tag list misses other non-turn rows, such as shell-mode
  `<bash-input>` echoes (0 recorded in O, 372c8abc or the Third Place). Fires wrongly: a slash command that expands to a
  prompt writes a `<command-name>` row and DOES start a turn; under the fix it would not activate the seat. Recorded: 34
  command echoes in three seat transcripts (/compact 16, /model 12, /effort 3, /login 2, /clear 1), 0 followed by a
  request (cmdturn.js), so no recorded case of either. The structural form, "a user row after launch that an API request
  follows", covers both [ours]. Whether `/effort` typed by a person is him activating the seat stays his reading.
- The existing `a_prompt_after_launch_is_activation_and_so_is_one_after_a_notice` must stay green: a real prompt still activates.
- A board check on the recorded case, run after the rebuild: count `keep-warm MISSED` rows whose last reason is "not activated this
  session" followed within 5 min by a ping row for that seat. Today it is ~~5: 4 on 11-10 (pinged 0-3 ticks later, one per tick),
  1 on 11-13 (same tick)~~ [2nd reader: 6; also fbf98f8e 10-31T02:39:01Z, ping +0.4 s; missedna.js] [read: boardkw.js].
  [2nd reader: the probe sees 6 of the 8 recorded cases. Main and the librarian on 11-11 were activated by `/effort` before
  their first evaluated tick, so their MISSED rows (14:35:06Z) say "no reason recorded", not "not activated". The probe that
  is red on all 8 is the transcript one: a ping at 60+ idle min whose only non-meta user rows since launch are command
  echoes (coldwhy.js: 8 of 11 today).] After the fix, a command echo must add none. To replay, run `/effort` on a seat left idle
  past 60 min with the app open.
- Needs: a Rust rebuild of Consonance and one restart (plan: W1 rides the same rebuild). No hook install. Not a compaction, so
  not under the no-cut rule; Lap C item 3 in the plan is his call.
- Tier: prove it (an invisible cost) [ours]: this test first, the mutation harness over the keep-warm tests, the suite at landing.

**If he rules B for a seat**, the check that fails today on recorded data [ours]: for that seat's transcript, count
`system/informational` rows holding "Compacted while idle" after the ruling's time; at the rule's own start (11-03T12:53Z) it is 30
over the seats today [read]. After: 0, while auto compactions stay at the window (preTokens about 967k).
[2nd reader: a 0 can also come from the server flag being off (372c8abc had 0 idle notices 10-30 to 11-02 with no setting,
dayver.js), so the static half below is the part that proves the setting.] A static half: each named
seat's `.claude/settings.json` parses and has `idleCompaction === false`; today no such file exists [read].

**If he rules A**, a unit test that `keep_warm_after(id) <= 52 min` for the eight recorded ids fails today for five of them (54, 54, 54,
56, 56) and 07b8a48f (53) [read: computed with the code's hash]. ~~53 is not safe: 07b8a48f lost 19 of 358~~ [read].
[2nd reader: by sent minute, 53 lost 2 of 361 (07b8a48f 2 of 332); its other 17 were pings that slipped to 54 (lostmin1.js).
What is not safe is slip, not 53. The threshold test can pass while pings still go at 54 through deferral or a busy gate;
the check that proves A is the transcript count of pings answered after an idle compaction, by sent minute, staying 0.]

## 7. Corrections to earlier files

- Plan Lap C item 3 and `00_lean_seats.md` W9 call O's 642,636 a seat "woken with no work". The write was brought forward
  133 min, not added; the wrong-activation cost is the pings between (section 3) [read numbers; inferred counterfactual].
- `00_lean_seats.md:455` "Why the activation rule let a ping through ... is not established": now established (section 3) [read].
- The ping minute for 36313935 was not listed by the second reader: it is 52 [read].
- "The skip rule is fixed" (plan Lap C item 3) is right in effect; the rule fails on command echoes only [read].

## How to rerun

Scripts are in my scratchpad `C:\Users\nname\AppData\Local\Temp\claude\0d67fc0e125090b2\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\w2_idle`
(copies of `second_reader_lean/` plus perseat.js, raceseat.js, coldwhy.js, afterwake.js, boardkw.js, tailrows.js, shape.js,
firstidle.js; all print numbers, timestamps, types, tags or command names only). Order: `bash run_extract.sh`; `node kw.js
/c/Consonance/data/board.jsonl <end>`; then race.js, kwjoin.js, kwcold.js, perseat.js `2026-11-03T12:53:00Z`, raceseat.js
`2026-10-10T00:00:00Z`, coldwhy.js, afterwake.js, boardkw.js. The scratchpad is session-scoped; copy them into the repo if they matter.

## What I did not open

- Machine L, its board and its transcripts. Older per-seat transcripts beyond the newest (main's 747796ae has 1 call).
- The usage of the compaction request itself (the summary call). It is not in the assistant rows I read, so the cost of an idle
  compaction here counts only the write after it.
- Whether a running seat re-reads a settings file edit, or needs a restart, for `idleCompaction`.
- `CHANGELOG.md` entries other than the idle-compaction lines; `interactive-mode.md` (session recap), downloaded but not read.
- The plan file `exo_memory/loop/plan_keep_warm_2026-09-21.md` beyond lines 59-82; `handback/p-l067-keepwarm-E_2026-09-21.md`.
- `consonance/launch.ps1`, the session launch arguments beyond the grep for compaction flags.
- Whether the 3 cold pings without a command row (09-25, 10-04, 10-06) were sticky activations from earlier in those sessions.
- Separating working-call context from how much each seat works, so the cost of a larger uncompacted seat is not measured here.

## Second reader

Adversarial second reader, D, 2026-11-13, data cut 17:17Z, read-only except this file. Marks as above. Line numbers in the
table are the first reader's ORIGINAL lines (they moved with the corrections). HEAD is now 2771b65f; `main.rs` has no change
since d41c088e (`git diff --stat d41c088e HEAD -- consonance/src-tauri/src/main.rs` is empty), so every code line cited holds.
Scripts: copies of `second_reader_lean/` and of the first reader's eight, plus mine (none56.js, dayver.js, lostmin.js,
lostmin1.js, between_cw.js, afterwake2/3.js, missedna.js, actprobe.js, cmdturn.js), all printing numbers, timestamps, ids,
types, tags or command names only, in
`C:\Users\nname\AppData\Local\Temp\claude\0d67fc0e125090b2\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\w2_idle_2nd`.
Fresh extracts of all nine seat transcripts at 17:17:17Z. Docs downloaded with curl at the same time into `docs/` there.

### What I checked

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 5 | main.rs last changed 880f237f; HEAD d41c088e | git log | OK | HEAD moved to 2771b65f; main.rs unchanged since d41c088e |
| 9 | 293 idle compactions | perseat.js, race.js | OK | TOTAL idle 293; idle-paired 293 |
| 9 | they fire 54.5-55.5 min after the last call | perseat.js gap column | WRONG | min 54.5, p90 55.5, max 56.7 (372c8abc), 56.5 (librarian) |
| 9-10 | 50-53 seats lose 22 of 992; 54-56 lose 260 of 489 | raceseat.js | OK | 0/381, 3/253, 19/358; 69/147, 38/71, 53/97, 61/119, 39/55 |
| 10, 31 | 30 of 42 auto since 11-03T12:53Z idle; +1 manual | perseat.js | OK | since 43, idle 30, auto 42; Third Place 15:54:03Z manual |
| 12, 96 | /effort echo 4 s before O's ping | shape.js, O lines 52135-52138 | OK | echo 14:51:28.831Z, ping row 14:51:32.834Z |
| 13 | O's real prompt +133 min, read 676,002 warm | x_36313935.json, afterwake3.js | OK | 17:04:20.362Z cr 676,002 cw 1,920 |
| 13, 110-111, 152 | cold-ping writes brought forward, not added, in all 8 | afterwake3.js, between_cw.js | WRONG | 4 of 8 cold again at the prompt (cr ~33.5k); 664,706 added |
| 14, 112 | 1.35M for O; 17.07M read over 8 cases | afterwake.js | OK | 1,351,145; sum 17,071,513 |
| 15 | key from v2.1.290, terminal feature v2.1.299 | settings-reference.md :2562; CHANGELOG :1572-1573 | DOWNGRADED | notices on D from v2.1.292 (10-10); flag-gated, settings-reference :2560 |
| 16 | 4 window compactions today at 967,305-968,566 | x_*.json compacts | WRONG | 3 auto (968,138; 968,566; 967,305); the 4th is a manual 955,196 |
| 27 | 293; min 54.5, p10 54.8, median 55.1, p90 55.5 | race.js | OK | identical |
| 28 | 4,337 pings; 288 with a compaction; 18,503,949 | kw.js, race.js | OK | identical; board rows 09-21T15:40Z to 11-13T16:35Z |
| 29-30 | chair 1 of 35; 372c8abc 39 of 39 | extract log | OK | main 35 compactions, 1 idle; 372c8abc 39/39 |
| 32 | O reply 14:51:37.931Z: 32,787 / 642,636 / 4 | x_36313935.json | OK | identical, claude-opus-5-5 |
| 34-35 | four compactions after 14:52Z, which idle | x_*.json | OK | 14:56:19 / 14:55:59 window; 16:24:11 idle; 16:52:18 window |
| 39-41 | ping minute = 50 + FNV-1a(session id) mod 7 | main.rs:1837-1844, :12950-12951; node | OK | 50, 54, 52, 53, 54, 54, 56, 56; TP 52. Hashing "sibling-..." names gives 51: the id is the session id (:12940) |
| 40 | modal minute 598 of 645 (main), 246 of 285 (O) | kw_rows.json | OK | identical; 07b8a48f 588 at 53, 97 at 54 |
| 45-53 | per-seat pings, >50k replies, compactions, idle, since | perseat.js | OK | all nine rows identical |
| 45-52 | median call context since 10-10 | x_*.json | OK | moved under 1% (live): main 509,949, O 485,741 |
| 56 | 311 ping replies wrote >50k | kwjoin.js coldJoined; kwcold.js n | OK | 311 and 311 |
| 61, 125 | idle-compaction conditions, "about an hour" | settings-reference.md :2534-2540 | OK | verbatim |
| 62, 131-132 | changelog "about 54 minutes"; both need 2.1.290 | CHANGELOG.md :1572-1573, under 2.1.299 (:1569) | OK | verbatim |
| 63-64 | 50 min + fnv mod 7 | main.rs:12930, :12946, :12950-12951 | OK | as quoted |
| 66-67 | per-seat race since 10-10, total 282 of 1,481 | raceseat.js | OK | identical; cw 18,088,314 |
| 68 | before about minute 54 the seat is never idle-compacted | lostmin.js | OK | by sent minute 50-52: 0 of 602; 53: 2/361; 54: 168/323 |
| 72 | first notice 09:11:33Z on 0845a868 | firstidle.js over every instance transcript | WRONG | 07:54:50.796Z on 5bf9d657, v2.1.292 |
| 72-73 | main's one idle compaction 10-18 at 698,800; 8 at window | x_main.json | OK | 2026-10-18T16:55:15Z 698,800; 8 at 966,996-968,029 |
| 74-77 | 12k-19k units per ping; 2.86M-4.98M written; 145.9M-226.9M read | own sum since 10-10 | OK | 11,672-18,937 units; 2.86-4.98M; 145.9M (O), 226.9M (main) |
| 82-84 | skip at :13109-13110; sticky :13358-13367; rule :13138-13163 | main.rs | OK | as cited |
| 89 | the last test at :13162 | main.rs:13162 | OK | verbatim |
| 91-92 | echo rows carry no isMeta, no origin | shape.js | OK | 52136, 52137: no meta, no origin; 52135 meta |
| 95-98 | O lines 52115, 52133-52137; board MISSED and ping rows | shape.js, boardkw.js | OK | all timestamps identical |
| 101-102 | his 05:57 words at plan :75-76, verbatim | plan_keep_warm_2026-09-21.md:75-76 | OK | verbatim |
| 105-106 | 8 of 11 cold pings preceded within 4 s to 2 min | coldwhy.js | WRONG | 8 of 11 holds; range 4 s to 204 s |
| 106-108 | command names, idle minutes, four MISSED on 11-10 | coldwhy.js, missedna.js | OK | /model, /effort x7; 18:28-18:29Z, "not activated" |
| 117 | "o pane is inactive btw?" at the brief :117 | briefs/lighthouse_the_room.md:116-117 | OK | verbatim; the brief says it was about dispatch |
| 121 | installed 2.1.323 | `claude --version` | OK | 2.1.323 |
| 128-130 | env-vars :321, :448; autoCompactEnabled turns idle off | env-vars.md; settings-reference.md :2334 | OK | verbatim |
| 133-134 | changelog :1361 (2.1.302), :903 (2.1.314), :591 (2.1.318) | CHANGELOG.md headers :1358, :809, :574 | OK | each under the version named |
| 135-137 | ~967K default; window 100,000-1,000,000 | model-config.md :901; settings-reference.md :2341 | OK | verbatim |
| 138-140 | two PreCompact quotes | hooks.md `### PreCompact`, `#### PreCompact output` | WRONG | meaning holds; the quoted words are not the docs' words (fixed in place) |
| 141 | settings.json has nothing about compaction | ~/.claude/settings.json:84-96 | DOWNGRADED | no key or env var; two non-blocking PreCompact hooks registered |
| 142-143 | no seat has .claude/settings.json; main.rs sets no flag | ls instances; grep | OK | seats hold only locks; fresh-* (not seats) hold settings.local.json |
| 149 | 16.73M written after idle compactions at 54/56 seats | raceseat.js | OK | 16,729,940 |
| 150 | settings reload without restart "not checked" | settings.md `### When edits take effect` | answered | watched and reloaded; idleCompaction not restart-only |
| 153 | C2 undoes his 07:33 ruling of no ceiling | main.rs:13102-13108; plan :75-76 | DOWNGRADED | "no ceiling" is the comment's reading; 07:33 is a question |
| 154, 157 | rule at `memory/no-cut-without-his-word.md:7`, `:11` | the auto-memory file | WRONG | path: text holds at :7 and :11; not a repo path |
| 154 | idleCompaction appears only in today's swarm files | grep exo_memory | OK | 4 files, all 11-13 swarm files |
| 171 | D098 tests at main.rs:23620-23680 | main.rs:23627-23680 | OK | helpers at :23627, :23631 |
| 186 | the new test fails at HEAD | actprobe.js (JS port) on O's real rows | OK | HEAD activates on 52136, 52137; the fix on none |
| 190-191 | board probe is 5 today | missedna.js | WRONG | 6 (adds 10-31 fbf98f8e); sees 6 of the 8 recorded cases |
| 199-200 | 30 idle since rule start; no seat settings file | perseat.js; ls | OK | 30; none |
| 202-203 | 53 is not safe: 07b8a48f lost 19 of 358 | lostmin1.js | WRONG | at sent minute 53 it lost 2 of 332; 17 were slips to 54 |

**Tally: 53 claims judged. OK 41, WRONG 9, DOWNGRADED 3, UNSUPPORTED 0; one "not checked" item answered from the docs.**
No WRONG changes a verdict of the file: the race, the mechanism of the 9.5-day ping, the smallest fix and the his-word
marks all stand. The WRONGs raise the cost of C1 (writes, not only reads) and move the safe line for A from "a threshold
of 52" to "a ping SENT before minute 54".

### Per seat, as the task asked (re-derived, cut 17:17Z)

Ping minute / pings since 09-21 / idle compactions (newest transcript) / ping replies that wrote >50k:
main 50 / 645 / 1 / 3; O (36313935) 52 / 286 / 3 / 4; 07b8a48f 53 / 703 / 19 / 22; 0845a868 54 / 693 / 70 / 72;
5bf9d657 54 / 583 / 38 / 45; librarian 54 / 508 / 55 / 56; 3d57124e 56 / 653 / 66 / 69; 372c8abc 56 / 266 / 39 / 40;
Third Place 52 / 767 rows without numbers / 2 / not joinable [read: perseat.js, kw.js, boardkw.js].

### Why the ping reached a seat idle 9.5 days, from the code (checked)

`keep_warm_decision` skips only an un-activated seat (`main.rs:13109-13110`) and has no upper bound once activated
(`:13114-13121`). Activation is sticky and decided by `activated_by_use` (`:13360-13369`), which counts any non-meta user
row after launch with a text part not opening `<task-notification>` (`:13138-13163`). A `/effort` echo is such a row. In
the same tick the MISSED row is written with the PREVIOUS tick's skip reason, because the Ping arm records no skip
(`:13377-13380`, `:13386-13393`). So the board said "not activated" 0.6 s before it pinged. [read]

### The options, marked (the first reader's marks hold)

- Needs his word as a compaction decision: A (ping minutes), B and B' (settings), and D (leave the default). By the rule's
  text it is under D that seats are compacted without his word: 30 idle ones since 11-03T12:53Z. [read: rule `:7`; inferred]
- Not a compaction decision: C1. Plan Lap C item 3 still lists it as his call. It needs a Rust rebuild and one restart.
- C2 changes his "always on" rule and needs his word.
- B needs no rebuild and, per the docs, no restart; it needs a file in each named seat's
  `C:/Consonance/instances/<seat>/.claude/`, which is his to authorise. No option needs a hook install.

### The smallest fix, re-judged

C1 stays the smallest. Its red-first check is red today for the reason given, on O's real rows (actprobe.js). Its
recorded saving is 17.07M read plus 664,706 written since 10-31. Prefer the structural rule (a request follows the row)
over a tag list, for the two failure cases named under section 6.

### What I could not check

- The Rust test compiled and run (no builds allowed); its red is shown on a JS port of the function only.
- Why 56-minute pings escaped idle compaction on whole days (10-15/16, 10-30, 11-05/06): the flag is an inference.
- Why the librarian's real prompt at 2026-11-11T14:37:04Z, 1 min after its ping, read only the prefix and wrote 149,380.
- Machine L; the Third Place's ping replies (its rows carry no numbers, so no join).
- Whether a prompt-type slash command opens its row with `<command-name>` or `<command-message>` on 2.1.323: a probe over
  302 small transcripts found 0 such rows in the shape it looked for, so the wrong-fire case has no recorded instance.

### What I did not open

`consonance/launch.ps1`; `plan_keep_warm_2026-09-21.md` beyond lines 73-78; the L067 and D098 hand-backs; `00_lean_seats.md`
(its W9 and :455 lines are taken from the first reader); `interactive-mode.md`, `context-window.md` and `prompt-caching.md`
in the docs; the precompact hooks beyond a grep for a block; transcripts older than each seat's newest beyond firstidle.js.
