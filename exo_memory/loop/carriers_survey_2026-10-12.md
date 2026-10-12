# Where a figure or state is carried WITHOUT its as-of time: the carriers survey. Pane E, on D, 2026-10-12 ~01:2x. D307 part 2 (ledger D308). MEASURE ONLY.

Plan: `loop/plan_belief_origin_d307_2026-10-12.md`, part 2 (main `bba1352d`). Nothing was changed. No unit was read or classified.

**Evidence:** `handback/p-carriers-E_2026-10-12_evidence/`.
- `samples/1-…7-*.txt` are the real samples, each block headed by where and when it came from.
- `count.js` is the counter, with its rules in its header.
- `lastblock.js` pulls hook-injected blocks out of a transcript by their prefix. It reads only `hook_additional_context`
  records, so a seat's own text never matches.

**Re-derive:** `node count.js samples/*.txt --blocks`.

## 0. The answer in one table

| carrier | written by | refreshed | read until | figures | with an as-of (time · sha · day) | **without** |
|---|---|---|---|---:|---|---:|
| pulse | `dev/shell/hooks/userprompt-submit.js:229-283`; its chain line `consonance/tools/chain-status.js` | every prompt | the end of that turn, and it stays in context after | 42 | 42 · 0 · 0 | **0 (0%)** |
| state block | `consonance/tools/state-block.js:76-88, :285`, injected by `consonance/hooks/sessionstart-state.js` | session start, resume, compaction | the next compaction: hours to days | 37 | 3 · 1 · 0 | **33 (89%)** |
| board digest `[panes]` | `consonance/hooks/board-digest.js:466-521` | every prompt, when registered | that turn | 10 | 0 · 0 · 0 | **10 (100%)** |
| rings and dispatches | `consonance/src-tauri/src/main.rs:12309` `[chair:MAIN]`, `:12398` `[librarian:LIB]`, `:12473` `[pane:{letter}]`; text by the sending seat | each send | the receiver's turn, and its context after | 27 | 0 · 17 · 0 | **10 (37%)** |
| hand-back summary lines | the writing seat (`COMMITTEE.md`, the hand-back rules) | written once | indefinitely | 29 | 0 · 8 · 21 | **0 (0%)**, but 21 of 29 are day-only |
| the shelf (a seat's CLAUDE.md) | `main.rs:3567`/`:5801` (written), `:3305` (not-carried index), `:3507` (topic lines), `:3521` (atom totals), `:3553` (live edge), `:4718-4745` (own map) | spawn and restore only | the whole session | 213 | 73 · 53 · 33 | **54 (25%)** |
| session digests | `dev/shell/hooks/session-end.js:245-281` (written), `session-start.js:349-361` (injected) | session start (part-days rebuilt by `catchUp`) | the session | 19 | 0 · 0 · 19 | **0 (0%)** |

**The two carriers with the most undated figures are the state block (89%) and the shelf's own counts (54 undated).** Both
are written ONCE, at spawn or compaction, and read for the whole session, which makes them the longest-lived carriers here.
The pulse is the opposite case: every figure is dated by its own stamp, and it is rewritten on every prompt.

How to read the "with" columns:
- **time** means an absolute time is on the figure's line, or on its block's or section's header.
- **sha** says WHICH state, not WHEN it was current.
- **day** is a date with no time.

The counter's rules are heuristics. They are written in `count.js` so they can be argued with; §8 lists their limits.

## 1. The pulse: dated, refreshed every prompt, and stale only within a turn
**Writer.**
- `buildBeacon` (`dev/shell/hooks/userprompt-submit.js:229-283`) builds the `[pulse] <date, time>` line and the thread's
  age.
- The second line is `chain-status.js`'s first output line, spawned with a 3 s timeout (`:255-275`).
- The interval block comes from `:187-213`.
- **Installed = repo:** `cmp ~/.claude/shell/hooks/userprompt-submit.js dev/shell/hooks/userprompt-submit.js` printed
  nothing. It runs on D, registered under UserPromptSubmit in `~/.claude/settings.json`.

**Samples** (`samples/1-pulse.txt`, the three pulses this pane received at 05:39Z, 06:27Z and 06:52Z):

    [pulse] Mon, 10/12/2026, 12:52 AM · thread began Oct 10 (2d ago)
    STALE D277 37h (holder panes) · chain: D308 DISPATCHED · holder chair · dirty 8 repo-wide · 14s · +2 more open · 4 of 10 chained
    laps unwitnessed (D284,D299,D298,+1) · 89 older beyond the 10-lap window · NOT in sync: D 79e3c01 (head, 413h ago) · L behind —
    last pushed 9486b30 473h ago as of 30h ago · rows only

**As-of.** 42 of 42 figures sit under the line's own stamp. The relative ages (37h, 14s, 413h, 473h) are relative to that
stamp, and the stamp is printed.
- **The one remote fact carries its own second as-of:** "as of 30h ago" (`chain-status.js:398-423`) says when this machine
  last saw the other machine's sync record. That is the only figure in the room I found that names both its value's age and
  its source's age.

**How stale when read.**
- The pulse is regenerated at every prompt, so it is fresh at the turn's start. Inside a turn it is not refreshed: a 45-minute
  turn reads a 45-minute-old pulse.
- Every earlier prompt's pulse stays in context. Each one carries its stamp, so a reader who looks at the stamp can tell them
  apart.
- **A pulse figure copied out of the pulse loses its stamp.** `handback/p-stalelaps-A_2026-10-11.md:7` quotes "the pulse read
  `STALE D275 52h, D279 44h, …`" with no pulse time. In the hand-back that 52h is relative to an instant the file does not
  name, and only the hand-back's day (10-11) dates it.

**Readers:** every seat, every turn. The Third Place gets the date, age and interval but not the chain line
(`userprompt-submit.js:48`).

## 2. The state block: written once at spawn or compaction, 89% undated, measured lagging 61–171 commits
**Writer.**
- `state-block.js` produces `REPO (HEAD <sha> <subject> · working tree N file(s) modified · N commit(s) unpushed)`
  (`:76-88`), plus `JOURNAL`, `INSTRUMENTS`, `TRIGGERS`, `NAME` and `LIVE`.
- The header is `[state-block: machine-generated, regenerate with …]` (`:285`). **It names no generation time.**
- `sessionstart-state.js` injects it at SessionStart with the label `[room state at session start, source=compact]`.
  "At session start" is the only time reference, and it gives no clock time.

**Samples** (`samples/2-stateblock.txt`, the last block injected into three seats):

| seat | injected | HEAD it states | main moved on since (`git rev-list --count <head>..bba1352d`) |
|---|---|---|---:|
| pane E | 2026-10-12T00:48:40Z | `a84d2458` (committed 10-11 17:54 local) | **61** commits |
| librarian | 2026-10-11T22:02:19Z | `029082ec` (10-11 14:42 local) | **69** |
| chair | 2026-10-10T16:33:59Z | `8fa65769` (10-09 23:01 local) | **171** |

**As-of.** 33 of 37 figures carry none:
- the modified-file count;
- the unpushed count;
- the instrument count (116);
- the trigger count (17);
- the precompact attempts (2,644).

"HEAD a84d2458" is a sha: it says which commit, not when it was HEAD. The dated figures are JOURNAL's "last written
2026-09-22 22:49" and head-watch's "last … at …".

**How stale when read.** It is refreshed only at a session start, resume or compaction, and read for as long as the session
lasts.
- **The chair's newest block is 1.5 days old and 171 commits behind main, and nothing in it says so.** The pulse beside it is
  current. A seat that reads "working tree 10 file(s) modified · 0 commit(s) unpushed" sees no difference in form from a
  live reading.
- Each section does carry a `check:` command. That is a way to re-derive, not an as-of, and it is only useful to a seat that
  runs it.

**Readers:** the seat it was injected into, for the session.

## 3. The board digest `[panes]`: all relative, no stamp, and not running on D since 2026-09-29
**Writer.**
- `board-digest.js:466-521`: per pane, `<NAME>  <N> exch today · last <span> | idle <span> · +<k> since your last turn`,
  then `↳ asked:`, `↳ <name>:` and `↳ hands:`.
- `emit()` (`:97-107`) returns it as UserPromptSubmit `additionalContext`.

**Not live on D now.**
- `board-digest.js` sits in `~/.claude/shell/`, but no hook entry in `~/.claude/settings.json` names it.
- Its installed copy also differs from the repo's (`cmp`: differ at line 39).
- The last `[panes]` block injected into the chair, the librarian and pane E is **2026-09-29T13:50Z**, the same minute in all
  three (`lastblock.js`).
- So there is no sample from today. The sample is the last real one (`samples/3-panes.txt`, the chair, free text elided):

      [panes] MIKE     63 exch today · last 23s
              BRAVO    22 exch today · last 35s
              ALPHA    17 exch today · last 4m
              ECHO     11 exch today · idle 15m

**As-of.** 0 of 10 figures carry one:
- "today" names no date;
- "last 23s" and "idle 15m" are relative to a generation instant the block does not print.

When it ran, it arrived beside the pulse on the same prompt, and the pulse's stamp was the nearest absolute time.

**How stale when read.** It is fresh at the turn's start and frozen after.

## 4. Rings and dispatches: no send time; figures anchored only where the sender wrote a sha
**Writer.**
- The app prefixes provenance: `[chair:MAIN] {text}` (`main.rs:12309`), `[librarian:LIB] {text}` (`:12398`),
  `[pane:{letter}] {text}` (`:12473`).
- The text, its `SOURCES:` line and its `NEXT:` line are the sender's (`GATES.md` §1, §3).
- **No send time is added.**

**Delivery can lag the send without a bound.**
- A ring to a seat whose stamp says `working` is held until the seat is ready.
- "it is safe to be unbounded only because `PaneGate::Stale` catches the pane that will never fire one". The 240 s bound
  (`MAX_HOLD_MS`, `:10383`) applies only when the gate guesses (`:10748-10755`).
- The receiver's pulse stamps the ARRIVAL, not the send.

**Samples** (`samples/4-rings.txt`, the dispatches that reached this pane today, and one ring it sent):
- **D305 item 6:** "Inputs, on main 4b077884: … (153 corrections with a located claim …)". The figure is anchored by the
  base sha.
- **D307 (this lap):** "Plan: … part 2 (main bba1352d)". Anchored by sha.
- **D305 part 2:** "**CN 27 against 9 missed lookups. Your §1 gives the check sources: compute 10, fs 8, log 4, board 4,
  process 4, other-repo 2.**" Ten figures carried from a hand-back into a dispatch, with no sha, no time and no path:line.
- **This pane's own ring** (D305 item 6): "15 replayable CN … sha256 … f195b94f…". Anchored by the commit and the digest.

**As-of.** 10 of 27 figures carry none. Every one of them is a figure carried from a hand-back into the dispatch's prose. The
SOURCES line names the file but not the line or the time, and only on the rings and dispatches the SOURCES gate checks.

**Readers:** the receiving seat. A dispatch's figures become the seat's working premise for the lap.

## 5. Hand-back summary lines: dated to the day; times are rare
**Writer:** the seat that hands back. The hand-back rules (`COMMITTEE.md`) ask for a figure's command beside it, not its
time.

**Samples** (`samples/5-handbacks.txt`, the heads of three hand-backs from 10-11: `p-stalelaps-A`, `p-reach-C`,
`p-wcensus-A`):
- the titles end in the date ("seat A, 2026-10-11");
- the Result lines name the commit (`3479af25`, `3ffaf969`) and the base (`7f08f148`, `b2e0c4ca`).

**As-of.** 29 of 29 figures are anchored, but **21 of 29 only to the day** (by the title), and 8 by a sha. None carries a
time.
- The one carried pulse figure (§1, `p-stalelaps-A:7`) counts here as day-anchored, by the title. Its own reference instant
  is gone.

**How stale when read.** Written once, read whenever someone opens it: the librarian at collation, other seats laps later.
The file's day and its commit shas date it, at day granularity.

## 6. The shelf (a seat's CLAUDE.md): written at spawn or restore, read for the whole session, its own counts undated
**Writer.**
- The app writes it at spawn and restore: `fs::write(dir.join("CLAUDE.md"), assemble_intake())` (`main.rs:3567`) and
  `write_intake` (`:5801`).
- The sections sampled:
  - the not-carried index, with card sizes (`:3305`, `:3319`);
  - the topic map lines `- **{slug}** ({live} live) — {summary}` (`:3507`);
  - "Source of record … {} atoms, {} still live, {} settled" (`:3521`);
  - the live edge (`:3553`);
  - the own-map header, "{dropped} characters of older ones" (`:4718-4745`).

**Samples** (`samples/6-shelf.txt`):
- pane E's own CLAUDE.md from "NOT CARRIED" to the end. **Written 2026-10-10 18:31:44 local, read by this pane through
  now, about 31 hours later.**
- The librarian's strict shelf header lines, from the D301 base-tree dump (10-11 21:47 local).

**As-of.** 54 of 213 figures carry none. These are all of:
- "(41 live)" and the other topic counts;
- "50126 atoms, 718 still live, 120 settled";
- "(3210 chars, 1 trigger(s))";
- "(309771 characters)";
- the librarian shelf's "15 file(s) carried in full (47261 of 47498 bytes)" and "469 index-tier entries … dropped".

The other 159 are dated:
- **73 by time:** every live-edge line ends `src: <seat> 2026-10-10T20:30Z`, a stamp added by code;
- **53 by sha;**
- **33 by day:** the map entries' `## 2026-10-09 ~19:3x` headings.

**How stale when read.** The shelf has **no generation stamp** of its own: no line says "written at". Its figures are true
as of the spawn, and the session can run for days. Pane E's says "718 still live" 31 hours later with no sign of when it
was counted.

**Readers:** the seat, for the whole session. It is the first thing a seat reads.

## 7. Session digests (`~/.claude/shell/digests`): dated by day, complete days only
**Writer.**
- `session-end.js` builds `<YYYY-MM-DD>.md` (`:245-281`; `catchUp` rebuilds missing or part-day files from the event log).
- `session-start.js:349-361` injects the two most recent as `### <date>` sections, under `## Recent session digests`.

**Sample** (`samples/7-digests.txt`, injected into pane E at its 2026-10-12T00:48Z compaction):

    ### 2026-10-10
    386 turn ends from 8 sessions
    - C:\Consonance\instances\sibling-5bf9d657: 32
    ...

**As-of.** 19 of 19 figures are dated by their `### <date>` heading (a complete past day). The `## Recent sessions in …`
list that follows in the same injection is a list of ISO timestamps, so it is dated too, and it is not counted.

**How stale when read.** It holds closed days, and the day is printed. The current day is not shown: the 00:48Z injection
showed 10-10 and 10-09, not 10-11. So it cannot be read as live.

**Readers:** a waking seat, at session start.

## 8. Limits, named
- **`count.js` is a heuristic.**
  - It masks dates, clock times, shas, ids, section signs, `path:line` and paths, and counts the remaining digit runs.
  - A figure is anchored by its own line, its section heading, or its block header.
  - It will call a number in a quoted sentence a "figure", and it gives a whole block the anchor of its header (generous
    for hand-backs, whose title date anchors every line).
  - It never reads meaning.
  - My first run had two bugs:
    - instance folder names (`sibling-5bf9d657`) read as shas;
    - a 64-hex digest split into digit "figures".

    It also lacked section-heading anchors. All three are fixed.
  - My first samples were cut by a character limit: the state blocks before their LIVE section, `[panes]` after four panes,
    and one digest timestamp mid-way, which the counter then read as 3 undated figures. All were re-extracted whole, and the
    counts above are from that run.
- **Samples, not populations.** These are 2–3 blocks per carrier, from today where a carrier ran today. `[panes]` has no
  sample from today because it has not run on D since 09-29.
- **"With an as-of" includes a sha,** which says which state, not when. Counting a sha as undated would raise the rings to
  27 of 27 undated, and the hand-backs' and shelf's undated counts by 8 and 53.
- **Not surveyed:**
  - the librarian's collations as a class (they are hand-back-shaped, §5);
  - `ASK.md`;
  - the `findings-return.js` and `ask-surface.js` UserPromptSubmit hooks, which are registered on D (not sampled);
  - Claude Code's own compaction summary, which carries figures from before a compaction with no as-of. This pane's own
    summary is an example. It is written by the host, not the room, and I note it without measuring it.
- **No unit was read.** This survey maps carriers only, as the packet asks.

NEXT: librarian collate D307 part 2 when this survey and the other wave-1 parts are committed
