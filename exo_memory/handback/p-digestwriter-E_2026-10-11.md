# p-digestwriter-E · D290 part 1: the session digest writer · pane E, on D, 2026-10-11 · MEASURED (nothing changed)

Plan: `exo_memory/loop/plan_retrieval_resume_d290_2026-10-11.md`, Part 1. **No task, no writer, no file in the repo or in `~/.claude` was changed.** I read files, the
event log, two transcripts' timestamps, the scheduled-task list and Task Scheduler's log. Scripts and outputs are in my scratchpad `d290/`. Every claim is marked.

## 1. What writes `digests/YYYY-MM-DD.md`, and what triggers it
- **checked:** the writer is the **SessionEnd hook** `~/.claude/shell/hooks/session-end.js` (`:231-250`). It is registered under `SessionEnd` in
  `~/.claude/settings.json`. On every session end it OVERWRITES `digests/<today>.md`, built from `event_log.jsonl`.
- **checked:** `<today>` is the LOCAL date (`todayYMD()`, `:54-60`). It keeps rows whose UTC `timestamp` starts with that local date string (`:170`).
- **checked:** the rows it counts are `type: 'session_stop'`, which `hooks/stop.js:63` writes at the end of every assistant TURN, not of every session.
- **checked:** no scheduled task writes these files. The five `ClaudeShell_*` tasks each run `wakeup_launch.vbs <goal>` (a "duration goal"). The dated digests
  depend only on SessionEnd.

## 2. Why 10-04, 10-07, 10-08 and 10-09 are missing
- **checked:** the data exists. `event_log.jsonl` holds `session_stop` rows on every one of those days (UTC dates: 10-04 323, 10-07 331, 10-08 255, 10-09 357).
- **checked:** a digest appears only on a local day when SOME Claude Code session ENDS. The October digests' write times match clean session ends. The pulse notes
  (`~/.claude/shell/pulse/`), written by the same hook for non-Consonance folders, show three of them were the keeper's `Desktop\brain rot` project ending
  (10-03 23:33Z, 10-05 19:46Z; 09-28 too). The 10-10 one (written 22:24:52 local) was a headless run in `%TEMP%` whose first line is "x"
  (`.claude/projects/C--Users-nname-AppData-Local-Temp/55ca9af2…jsonl` stopped at that second). 10-01's write matches a pane transcript
  (`C--Consonance-instances-sibling-5bf9d657/bba90794…`) ending at that minute.
- **checked:** the room's own headless runs never fire it. second-vantage and claimrec pass `--setting-sources project` with `disableAllHooks`
  (`second-vantage.js:239-258`, `claimrec.js:24,62-63`), and the second reader runs `--safe-mode` (`second-reader-worker.js:177`).
- **inferred:** on those four local days no session ended cleanly. Consonance panes are restarted or killed, not exited, and a killed process fires no
  SessionEnd. The keeper's other project and stray headless runs did not run those days. So the digest is a side effect of an unrelated session ending, not a
  daily job.

## 3. Why 10-02 is 50 bytes
- **checked:** it reads `# 2026-10-02 Digest\n\nNo session activity recorded.` (`buildDigest`, `:185-187`, when no row matches). It was written 2026-10-02
  04:57:04 local = 10:57:04Z. At that moment the UTC day 2026-10-02 had **0** `session_stop` rows: the last stop before it was 2026-10-01T23:08:40Z and the next
  2026-10-02T10:58:30Z (the machine was idle overnight). No later SessionEnd that local day rewrote it (the file's mtime is still 04:57:04).
- So the LOCAL-date-against-UTC-timestamp mismatch makes an early-morning session end write an empty digest, and a late-evening one count the NEXT UTC day.
  **checked**, by local date vs UTC date per day: 10-07 229 vs 331, 10-10 386 vs 422.

## 4. The Disabled tasks: not the cause of the dated digests; who disabled them and when
- **checked:** all five (`daily-news-digest`, `digest-auditor`, `drift-watch`, `journal-auditor`, `session-journal`) are `Disabled`. Last runs 2026-09-26 15:43
  to 2026-09-27 09:47, all result 0.
- **checked:** they explain OTHER files. The last `news-*.md` is 09-26 (15:47; the news task last ran 09-26 15:43). The last `journal-*.md` is 09-27 (08:55;
  session-journal last ran 09-27 08:53). The dated `YYYY-MM-DD.md` digests kept being written after that by SessionEnd, so the tasks are **not** their cause.
- **checked, who and when:** disabled by the librarian on 2026-09-27 ~11:2x at the keeper's "do we even need this", noted as reversible with no file deleted.
  The measured load was "the news digest alone read 64M tokens from cache and wrote 4.4M to it on Fable + Opus" (`exo_memory/librarian/2026-09-27.desktop.md:83`).
- **checked:** Task Scheduler cannot say more. Its Operational log is **disabled** on this machine (`IsEnabled: False`), so there are no 140/141/142 events, and
  `C:\Windows\System32\Tasks` is not readable from this seat.

## 5. Is the dated digest worth fixing? What it says, and what it costs
- **checked:** its headline is wrong. "## 422 sessions" (10-10) counts 422 TURN ENDS from **8** distinct sessions (`session_id` on the rows). The other days are
  alike: 6 or 7 sessions behind 229–395 rows.
- **checked:** for the room it carries no "what". Its body is a list of UTC turn-end times per cwd. The "What the pulse was for" lines come only from
  non-Consonance sessions (`appendPulseNote` skips `\Consonance\`).
- **checked:** it is injected at session start. `session-start.js` `getRecentDigests(2)` puts the two newest dated digests into every wake: today
  `2026-10-06.md` 7,565 B + `2026-10-10.md` 6,720 B ≈ **14 KB** per SessionStart (Third Place excluded). This session's own start carried it.
- **inferred:** how many wakes a day pay those 14 KB is not measured (the event log records no session starts). Every pane respawn, restart and compaction is one.
- **checked:** one rebuild is cheap: reading and parsing the 14.7 MB event log and filtering a day takes **38–40 ms** (`measure.txt`).
- **My reading: the dated digest is NOT worth reviving as it stands.** What it injects is ~14 KB of mis-labelled, mis-dated timestamps per wake. The keeper's
  room has better records of the same days: the board, the journals, the maps and the lap rows.

## 6. The draft fix, as ONE decision for the keeper (nothing applied)
**Recommended — (A) take the dated digest off the wake.** In `session-start.js`, stop injecting `getRecentDigests(2)` for every seat. Leave the SessionEnd writer
as is or retire it with it, and re-enable no task.
- *Changes:* one call in the live hook (and its repo copy under `dev/shell/hooks/`, with the installer's sync).
- *Costs:* nothing on the machine. It **saves** ~14 KB of context per wake.
- *Loses:* the "What the pulse was for" lines of the keeper's NON-room projects reaching a room pane, which they arguably should not anyway.

**Alternative — (B) repair it, still with no scheduled task:** (1) write any missing past day at SessionStart from the event log (catch-up); (2) select rows by
LOCAL date, not a UTC prefix; (3) label the count as "turn ends from N sessions".
- *Costs:* ~40 ms on a session start that finds a day missing, 0 tokens. The injection stays ~14 KB per wake.

**Not recommended — (C) re-enable the `ClaudeShell_*` tasks.** They do not write these files, so it would not fix them. The keeper retired them for their model
cost (the 09-27 record above). That is his call, and nothing here argues for reversing it.

Either (A) or (B) is a change to a hook that every seat runs, so it is the keeper's to say, then a normal lap.

NEXT: librarian route the one decision (A, B or C) to the keeper, when this hand-back is read
