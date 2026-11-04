# vantage SURFACE 1/37 · id d09fee3cc9bfc707 · 2026-08-23T06:22:18.822Z

source: {"session":"447e5f08","pane":"vantage_cell","turn_ts":"2026-08-18T06:52:57.724Z","head":"b4c297790c23b4a24a4a081429b5e587e80aea5d"}
tier: middle  verdict: DISAGREE  status: SURFACE

## claim (excerpt the reader checked)
cat C:\Users\zackn\.claude\settings.json → only live hook config anywhere (7 hooks: sessionstart-ambient.js, userprompt_pulse.py, board-digest.js, transcript-watch.js, dream-watch.js, ferry-watch.js, sourced-stop.js); mtime 2026-08-17 04:03 … ls --time-style=full-iso C:\Users\zackn\.claude\shell\ → newest hook-script edits 2026-08-17 04:17/04:46 (~20h before now), nothing modified ~1h ago … EVIDENCE: Every live hook executes cleanly right now (all exit 0 with both empty and realistic transcript payloads, and both session-visible hooks fired successfully this session), and no hook script or settings file was modified within rou

## reader commands
Read C:\Users\zackn\.claude\settings.json → 9 hook commands, not 7: sessionstart-ambient.js, sessionstart-state.js (SessionStart); userprompt_pulse.py, board-digest.js, transcript-watch.js, dream-watch.js, ferry-watch.js (UserPromptSubmit); sourced-stop.js (Stop); precompact-preserve.js (PreCompact)
ls -la --time-style=full-iso /c/Users/zackn/.claude/settings.json → 2026-08-22 07:48:11 -0600 (claim: 2026-08-17 04:03)
ls -la --time-style=full-iso /c/Users/zackn/.claude/shell/ → transcript-watch.js 2026-08-17 04:17:41 and blind.js 2026-08-17 04:46:59 (match claim); but sessionstart-state.js 2026-08-22 00:38:56 and precompact-preserve.js 2026-08-18 06:09:54 are newer hook-script edits

## reader evidence
The primary object today has 9 live hooks (two not in the claim's list) with settings.json mtime 2026-08-22 07:48 and newest hook-script edit 2026-08-22 00:38, so the claimed 7-hook / 04:03 / "newest 08-17 04:17–04:46" snapshot does not match current measurement — the 08-17 timestamps cited do exist, but the settings file and hook set were changed after the claim shipped, and its historical state is no longer re-derivable from the file itself.

## audit
{"clean":true,"reason":""}

## caveat
"F0: 2/2 correct blind DISAGREEs on the reachable subset; 2 of 16 of the record"

## return_ledger rows naming this id (1)
{"ts":"2026-09-08T07:07:28.727Z","pane":"vantage_cell","session":"35dc1697","surfaced":["d09fee3cc9bfc707"],"misses":[{"id":"3c2130eb9d8cad7a","reason":"held-unaudited"}]}