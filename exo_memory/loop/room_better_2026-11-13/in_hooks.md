# The hooks: what exists, what is installed where, what each costs (2026-11-13, research reader, read-only)

Machine: D (`~/.consonance.json` machine_tag "D", CONSONANCE_MACHINE=D) [read]. Repo root C:/Users/nname/Desktop/lighthouse.
Ledger figures come from one node pass over C:/Consonance/data/*.jsonl (rows, decision counts) run today [read].
Token figures are what each ledger row records. No dollar figures are given.

## 1. -Check on D today

- `pwsh` is not installed on D (`which pwsh` -> not found). I ran the same script with Windows PowerShell 5.1:
  `powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev\shell\install.ps1 -Check`. Exit 1 [read].
- -Check exits at install.ps1:757, before any write; ~~the writes start at :822 and later [read].~~
  second reader: the file-sync writes come earlier in the file, at install.ps1:405, :442-443, :461, :465-466, each in
  the non-Check branch of the same loop; the settings writes are at :839-840, :987, :998, :1005, :1011. :822 is a
  blank line. The conclusion holds: no write runs under -Check (no write or external call in :364-402 or :586-757) [read].
- The output is 5,031 lines. 4,950 of them list UNCLAIMED code under ~/.claude/shell: mcp\ 3,179, duration\ 1,744,
  11 `hooks\*.pre-install-2026-09-21*` backups, 15 top-level scratch scripts (`_tmp_*`, `l2-audit.js`, ...) [read].
  second reader: those four sum to 4,949. The 4,950th is `misplaced-from-consonance-data-2026-09-21\MANIFEST.sha256`
  (check output line 5009) [read: my own -Check re-run, piped to a counter, no file written].
  The verdict lines sit at the end, after that list. My first run's tool output was cut off before them [read].
  Cost: one re-run into a file [read]. Cost to others: not recorded.

Drift, as -Check printed it [read]:

| state | files |
|---|---|
| DRIFT (10) | hooks\l2-overseer-worker.js, userprompt_pulse.py, board-digest.js, hooks\second-reader.js, hooks\second-reader-worker.js, hooks\sources-gate.js, hooks\push-gate.js, hooks\delete-gate.js, hooks\ask-ending.js, hooks\release-chime.js |
| ABSENT (3) | dispatch-gate.js, carrier-drift-watch.js, hooks\second-reader-note.js |
| DECLARED, NOT REGISTERED (4) | userprompt_pulse.py, dispatch-gate.js, carrier-drift-watch.js, hooks\second-reader-note.js |
| REGISTERED, NOT DECLARED (1) | hooks\userprompt-submit.js |
| EXCLUDED BY RULING, absent (3) | hooks\jev-flags.js, hooks\l2-overseer.js, hooks\l3-overseer.js |
| EXCLUDED BUT LIVE (1) | hooks\stop.js |
| counts | manifest 36 entries, 33 claimed at their path; settings.json 19 hooks over 7 events; $register 24 entries |

How old the drifted copies are, from the copy's mtime and `git log -1` on the source [read]:

| installed copy | copy mtime | repo last change | lines differ (CR stripped) |
|---|---|---|---|
| hooks\second-reader.js | 2026-10-01 | 2026-11-03 bd576735, call_chair rings only | 27 |
| hooks\second-reader-worker.js | 2026-10-01 | 2026-11-03 acbc2a60 | 2 |
| hooks\sources-gate.js | 2026-10-19 | 2026-10-24 49adc96d, data dir found by the app's rule | 6 |
| hooks\push-gate.js, delete-gate.js, ask-ending.js | 2026-10-06/08 | 2026-10-25 77bf7c04, same data-dir change | 2 each |
| hooks\release-chime.js | 2026-10-09 | 2026-10-24 f44e0886, default repo list | 15 |
| board-digest.js | 2026-08-25 | 2026-11-13 a3cefeb9, L198 fix 2c (names panes whose last line is an API error) | 62 |
| userprompt_pulse.py | 2026-09-09 | 2026-10-24 49adc96d | 6 |
| hooks\l2-overseer-worker.js | 2026-09-20 | 2026-09-23 1c5b4f2d | 8 |

Five findings from that run:

1. **The second reader's narrowing never reached D.** bd576735 (2026-11-03 09:24 -0600) narrowed it to call_chair rings.
   The D copy is from 10-01, and D's matcher still covers call_librarian [read: settings.json PreToolUse entry].
   After 15:25Z that day the ledger has 229 `ok` model reads of call_librarian rings, 2,385,722 tokens (all kinds),
   112 of them with flags [read: second-reader.jsonl]. Cost: those tokens, if the narrowing was meant for D [inferred].
   second reader: the matcher is not the drift. install.ps1:302-303 still declares
   `mcp__consonance__call_librarian|mcp__consonance__call_chair` for the second reader, the same as D's settings.json.
   bd576735's message puts the narrowing in the script: "a call_librarian ring is a skipped-class row with no model
   call" [read: git show bd576735]. So the cause is the 10-01 copy alone. Figures 229, 2,385,722 and 112 reproduce
   over the first 3,940 rows [read]; at 3,948 rows they are 234, 2,431,909 and 115.
2. **The same-turn note (D631 (b)) has never run on D.** second-reader-note.js is ABSENT and unregistered [read].
3. **ask-surface.js runs on D from the repo path**, not from a copy: settings.json registers
   `C:\Users\nname\Desktop\lighthouse\consonance\hooks\ask-surface.js` on UserPromptSubmit [read].
   install.ps1 still lists it in $unmanaged with "No ruling yet" and no dream guard [read: install.ps1 $unmanaged, first entry];
   `grep -c CONSONANCE_DREAM consonance/hooks/ask-surface.js` -> 0 [read].
   -Check does not report it as live: the registration pass skips live hooks outside $files (install.ps1:688-692),
   and the destination sweep only walks ~/.claude/shell [read]. In the output it appears once, as "DECLARED UNMANAGED"
   (check line 44) [read]. A repo-path registration is the case install.ps1:201-203 warns of: "a pull silently changes
   what executes mid-session" [read]. Cost not recorded.
4. **Today's board-digest fix does not run on D.** board-digest.js is not in $register and not in D's settings.json [read];
   the copy is from 08-25. The fix lands only where the hook is wired. Which machine wires it today I did not see.
   second reader: the commit names its target: "Not yet installed on L: install.ps1 -Check lists board-digest.js as
   DRIFT" [read: git show a3cefeb9]. Whether L registers it is not said there.
5. **README figures are stale.** consonance/hooks/README.md:103-104 says 35 files, 23 registrations; -Check says 36 and 24
   [read]. The README itself says the command wins (:107) [read].

For L, the record has a separate reading: M.md:1030, "on L, 15 managed hooks are DRIFT and 9 are ABSENT",
including push-gate.js, delete-gate.js and sources-gate.js [read]. I could not run -Check on L.

## 2. The table

"Block" means the hook can stop a tool call or a turn end. Ledger counts are all rows on D since the ledger began.
"Keeper ruling" quotes are as carried in install.ps1 or the hook header; I did not open each primary note (see the end).

### Registered on D (19 hooks in settings.json) [read]

| hook | event (matcher) | block? | prints or gates | recorded failures, and their cost | keeper ruling |
|---|---|---|---|---|---|
| hooks\session-start.js | SessionStart | no | injects the recent digest as additionalContext (session-start.js:2-8) | pane C ruled DO NOT INSTALL 08-25 (absent_hooks_ruling_2026-08-25.md:18), later installed on D by D097 (the 2026-09-23 note, :29-40). Cost not recorded | none found; the 08-25 ruling is pane C's (:3) |
| sessionstart-state.js | SessionStart | no | state block after a compaction; emitted 466 of 9,319 rows, else skipped | plan named PostCompact, which cannot inject on auto compaction (sessionstart-state.js:6-15). Shipped in $files without a registration, found 08-18 (install.ps1:283-288). Cost not recorded | none found |
| hooks\userprompt-submit.js | UserPromptSubmit | no | the Node pulse: beacon and L3 verdicts (userprompt-submit.js:2-9) | two-way conflict, 83 lines (install.ps1:104-108); an A/B test gave a 898-vs-117-byte result "that meant nothing" (:110-112); declared and live sets disjoint for 6 days (:212-216). Cost not recorded | none found; REGISTERED, NOT DECLARED on D |
| findings-return.js | UserPromptSubmit | no | audited DISAGREEs to the originating pane (findings-return.js:1-4) | hand-registered at a repo path 08-15 (install.ps1:807). Cost not recorded | pane C ruled INSTALL (absent_hooks_ruling_2026-08-25.md:27); keeper's not found |
| ask-surface.js (repo path) | UserPromptSubmit | no | unread ASK questions | see finding 3. Cost not recorded | open: "wire ask-surface.js/baton-wake-stop.js" listed as the keeper's decision (loop/handoff_librarian_2026-09-08.md:26) |
| hooks\ready-prompt.js | UserPromptSubmit (10 s) | no | writes the WORKING ready stamp | 09-07 bare installer run re-registered three hooks against the 09-06 ruling; the hand removal then deleted ready-stop.js by substring; restored from a backup (install.ps1:18-24). Cost not recorded | 09-06 06:55, recorded as "READY PAIR ONLY" (librarian/2026-09-06.md:603, the librarian's note of it) |
| hooks\stop.js | Stop | no | appends a session_stop event | had no dream gate for its whole life until 08-17 (stop.js:5-8). Cost not recorded | Excluded by the 09-06 ruling; on D "EXCLUDED BUT LIVE, which is the true, open state" (install.ps1:254-255) |
| sourced-stop.js | Stop | no | one ledger row per turn, no output | a blocking gate was refused in writing: 110 of 137 value-turns unsourced (sourced-stop.js:10-15). Hand-registered at a repo path 08-15 (install.ps1:807) | none found |
| hooks\ready-stop.js | Stop (10 s) | no | writes the READY stamp | deleted by substring collision 09-07, see ready-prompt. Cost not recorded | same 09-06 ruling |
| hooks\reply-slot.js | Stop (10 s) | yes in strict; warns in light | blocks once per turn a keeper reply naming a path/sha/count with no backed Sources line | 6,297 rows; strict: 47 blocked; light since 2026-10-11 00:34Z: 4,945 rows, 0 blocked; would-block-missing 1,007, unmatched 54. The rate clause (reply-slot.js:3-4) — no review found by my grep. Cost not recorded. second reader: 1,007 and 54 are over all modes; light rows alone carry 1,000 and 11 [read: reply-slot.jsonl, first 6,297 rows] | "lets finish it all" (install.ps1:180); light mode under "GO LIVE, with E's gate switch" (~~plan_lighten_the_load_2026-10-09.md:59-61~~ second reader: the quoted words are at :62; the move of the reply slot to WARN is at :35 [read]) |
| hooks\ask-ending.js | Stop (10 s) | no (shadow) | logs a "want me to…?" last line | 6,983 rows from 10-06; 22 matched. Ruled "SHADOW ONLY, for a trial week" (ask-ending.js:1-2); still shadow 5 weeks on; no review found by `grep -rl ask-ending exo_memory/librarian exo_memory/loop/*.md` (1 hit, unrelated). DRIFT. Cost not recorded. second reader: that grep skips loop/ subfolders and handback/. handback/p-d619-hooks-tools-C_2026-11-02.md:68 assessed it on 11-02: "22 matched, all `mode=shadow`: it never acted", verdict "CUT candidate" [read]. Not the header's trial review, but a reading exists | "the keeper delegated, the librarian ruled" (install.ps1:184) |
| hooks\session-end.js | SessionEnd | no | writes today's digest | pane C ruled DO NOT INSTALL 08-25 (absent_hooks_ruling_2026-08-25.md:21). Cost not recorded | none found |
| hooks\precompact.js | PreCompact | no | fires checkpoint.py | on L a no-op, no Desktop\lighthouse there (carrier-drift-watch.js:7-14). Cost not recorded | none found |
| precompact-preserve.js | PreCompact (10 s) | no | shapes what the summary keeps (canary) | 3,176 attempts; registered late, 08-18 (install.ps1:283-288). Cost not recorded | none found |
| hooks\second-reader.js | PreToolUse (call_librarian, call_chair) | no, allows at once | spawns a `claude -p` Sonnet worker per ring | 3,940 rows: ok 3,695, skipped-busy 237, error 4 (second reader: plus skipped-no-text 4, which makes 3,940 [read]). Tokens: in 7,390, out 2,055,698, cacheRead 5,417,898, cacheCreate 22,387,536; median 7,036 ms. DRIFT; see finding 1 | "the keeper's approval 09:34" (install.ps1:168) |
| hooks\sources-gate.js | PreToolUse (call_librarian, call_chair, chair_inject) | yes, deny | denies a ring with no SOURCES line or an unbacked item | 6,195 rows: deny 430 (strict 166, light 264), warn 2,381, allow 3,380 (second reader: plus skipped-no-text 4, which makes 6,195; the 166 rows carry no mode field and predate the first light row, 2026-10-11 00:34:07Z, so "strict" is [inferred]). Each deny costs the seat a re-send in the same turn (sources-gate.js:7); minutes not recorded. DRIFT | "the keeper approved it 2026-10-02 13:42" (sources-gate.js:1) |
| hooks\push-gate.js | PreToolUse (Bash, PowerShell) | yes, deny | denies a push whose new commits add a credential-shaped line | 349 rows: deny 2, both planted test keys on 10-06 (planted2.txt, h.txt); allow-error 9, all "not a git repo". No real catch in the ledger. Absent on L (M.md:1030). DRIFT | "the keeper delegated, the librarian ruled" (install.ps1:184); push permission rests on "the credential scan" (plan_lighten_the_load:64) |
| hooks\delete-gate.js | PreToolUse (Bash, PowerShell) | yes, deny | denies a recursive delete of a tree holding a junction | origin: 09-28 a worktree removal emptied the shared t180 reads/ (delete-gate.js:8). 773 rows: deny 5 (3 on 10-06, 1 on 10-11, 1 on 10-29). Whether the later two were real I did not check. second reader: the 10-11 row's last target resolves to `C:\` (links 2); the 10-29 row's targets include the whole `AppData\Local\Temp` (links 1) [read: delete-gate.jsonl]. handback/p-d619-hooks-tools-C_2026-11-02.md:63 already called both "2 real denies" [read]. DRIFT | same as push-gate |
| hooks\release-chime.js | PostToolUse (Bash, PowerShell) | no | plays a sound on a release or a push to main | 73 rows: chimed 50, debounced 23. DRIFT. Cost not recorded | asked for: "you ding when the laps are complete, ..." (install.ps1:192; release-chime.js:1) |

### In the repo, not registered on D

| hook | event | block? | prints or gates | recorded failures, and their cost | keeper ruling |
|---|---|---|---|---|---|
| userprompt_pulse.py | UserPromptSubmit | no | the Python pulse | declared; the Conflicts guard keeps it off D beside the Node pulse (install.ps1:210-224). DRIFT | none found |
| dispatch-gate.js | PreToolUse (chair_inject, call_chair) | asks (a permission prompt) | asks before a dispatch with no citation | ledger 525 rows, 2026-08-24..09-09, asked 73. An old copy ran with ~~the "click never removed"~~ second reader: the words at LEDGER.md:72 are "the click was never removed" [read] (librarian/LEDGER.md:72). -Check now says "never installed - nothing to compare", while the ledger shows a copy ran [read both]. No removal ruling found by grep | none found |
| carrier-drift-watch.js | Stop | no | one line only on a new red | ledger 4,117 rows, 08-24..09-22: RED 2,050, spoke 68. Now ABSENT | none found |
| hooks\second-reader-note.js | PostToolUse (call_chair, 30 s) | no | the reader's flags as a same-turn note | never installed on D | D631 (b); keeper's words not found |
| board-digest.js | UserPromptSubmit (not in $register) | no | the [panes] digest | 08-17: a missing blind.js printed "Cannot find module './blind.js'" on every prompt (install.ps1:130-134); ~~its broadcast reached blind pairs (blind.js:6-15);~~ second reader: the cited lines say the reverse for the desktop: the claim that its blind pairs (cycles 4-7) ran under the leak is "false on this machine", with zero `[panes]` blocks in pane A's or B's transcripts (blind.js:10-16); the channel is real, ran on the desktop for at least one day, and "remains live on the laptop" (:23-24); a laptop blind arm "survived only because ... PROGRAMS DO NOT READ THE HOOK" (:29) [read]; "the digest hook off for a dated window by the keeper's hands" 09-16 (M.md:913). Costs not recorded | none found |
| dream-watch.js | UserPromptSubmit (not in $register) | no | one line when the dream cycle stops | an unactionable line every turn for 27 days (ferry-watch.js:10-13). Cost: "paid on the one instrument that most needed reading" (:13), not in minutes | none found |
| ferry-watch.js | UserPromptSubmit (not in $register) | no | a fresh un-ferried artifact | printed every prompt for hours and read past: 84 of 109 never ferried, 77.1% (dispatch-gate.js:3-7). second reader: the record disagrees with itself here: ferry-watch.js:8 says "109 artifact commits, 3 ferried, 97.2% never put in front of another mind" [read]. Both stand; which is current I did not check | none found |
| transcript-watch.js, sessionstart-ambient.js | UserPromptSubmit / SessionStart | no | survey watch; the sky at wake | none found in what I opened | none found |
| hooks\l2-overseer.js, l3-overseer.js | Stop | no | detached `claude -p` judges | Excluded everywhere | "Yes switch them off, only jev" (install.ps1:259) |
| jev-flags.js | UserPromptSubmit | no | Jev L2 verdicts | retired | D273 ruling 5 (install.ps1:226-230); its wiring was by "the settings edit for Jev flags" (:142) |
| baton-wake-stop.js | Stop | yes, by design | wakes the outgoing seat | no dream guard (grep 0) | open, keeper's call ($unmanaged entry 2) |
| live-mirror-stop.js | Stop | no | heartbeat lease, publish state | round trip 4,760 ms against a 5,000 ms bound ($unmanaged entry 3) | open |
| claim-check.js | PreToolUse + Stop | yes when on | refuses a claim the turn could not back | OFF (`claim_check` unset in ~/.consonance.json) [read] | open, keeper's call after a replay ($unmanaged entry 4) |

## 3. Options (evidence only, no decision)

- [ours] Sync the four live gates and the second reader on D with `-Only`, one entry at a time, as M.md:1032-1033 says for L.
  Evidence for: findings 1 and 2. Evidence against a bare run: the 09-07 incident (install.ps1:18-24).
- [ours] Teach -Check to report a live hook registered at a repo path. Evidence: finding 3.
- [ours] Put -Check's verdict lines first, or cap the UNCLAIMED list. Evidence: 4,950 of 5,031 lines.
- [ours] Hold the ask-ending trial review its own header promises, or note that it was skipped. Evidence: 22 of 6,983.
- [ours] Decide whether board-digest is meant to run on D, ~~since today's fix lands there~~ second reader: finding 4 says
  today's fix does not run on D; its commit names L as the target (a3cefeb9). Evidence: finding 4.

## What I did not open

- The primary notes behind each keeper ruling: librarian/2026-09-06.md:603 only, read; 09-21, 09-22 (D105), D203, D212,
  D218, D248, D273, D281 rulings were read only as quoted in install.ps1 or a hook header.
- consonance/hooks/README is read whole; dev/shell/README.md is not.
- install.ps1 lines 420-580 (file sync detail) and 760-1035 (register writer) were not read line by line.
- Hook bodies past their headers; the .test.js files; no test was run.
- Machine L. Everything about L here is ~~M.md:1029-1034~~ M.md:1029-1033 (second reader: M.md has 1,033 lines [read]).
- Why dispatch-gate.js and carrier-drift-watch.js left D: no ruling found by grep; the record may hold one I missed.
- Whether delete-gate's 10-11 and 10-29 denies were real or tests; whether reply-slot's rate clause was ever reviewed.
- handback/p-claudemd-C_2026-10-06.md "GATES", plan_sources_gate_d212, plan_second_reader_d203, plan_release_chime.
- No web sources: the hooks reference (code.claude.com/docs/en/hooks) is only as quoted in the hook headers [summary].

## Second reader

2026-11-13, adversarial second reader, read-only except this section and the marked strikes above.

**How I checked.** I re-ran `install.ps1 -Check` with Windows PowerShell 5.1, piped to a counter, no file written. First I
read the source to confirm the -Check path writes nothing (:364-402, :586-757). The ledgers grew while I worked
(second-reader 3,948 rows, sources-gate 6,209, reply-slot 6,306, ask-ending 6,992). So I re-counted each one over the
reader's own row count, sliced from the top [read].

**What reproduced exactly** [read]:
- -Check: 5,031 lines; 4,950 UNCLAIMED; ask-surface at check line 44; verdicts after the list (5011-5031).
  Also every row of the drift table above: DRIFT 10, ABSENT 3, declared-not-registered 4, registered-not-declared 1,
  excluded-absent 3, excluded-but-live 1. Manifest 36, claimed 33, settings 19 hooks over 7 events, $register 24.
- $files 36 and $register 24, counted in install.ps1 itself (:79-197, :208-324); $unmanaged 5, in the order the file uses.
- `grep -c CONSONANCE_DREAM` gives 0 for ask-surface.js and for baton-wake-stop.js.
  `~/.consonance.json`: machine_tag D, claim_check unset.
- Drift ages: all ten mtimes (as local dates), commits and diff counts (27, 2, 6, 2, 15, 62, 6, 8, as repo-only plus
  copy-only lines with CR stripped).
- Second reader: 3,940 rows, tokens 7,390 / 2,055,698 / 5,417,898 / 22,387,536, median ok 7,036 ms. Post-15:25Z
  call_librarian: 229 ok, 2,385,722 tokens, 112 flagged.
- reply-slot: 6,297 rows, 47 blocked, light 4,945 from 00:34Z, 0 blocked.
- push-gate: 349 rows, 2 deny (planted2.txt, h.txt), 9 allow-error. delete-gate: 773 rows, 5 denies on the stated dates.
  release-chime: 50/23. ask-ending: 6,983 rows, 22 matched.
- sessionstart-state: 466 of 9,319. dispatch-gate: 525 rows, asked 73. carrier-drift: 4,117 rows, RED 2,050, spoke 68.
- Citations opened and correct: install.ps1:18-24, :104-112, :130-134, :142, :168, :180, :184, :192, :201-203,
  :212-216, :226-230, :254-255, :259, :283-288, :688-692, :757, :807. Also absent_hooks_ruling:3, :18, :21, :27 and
  the :29-40 note; librarian/2026-09-06.md:603; handoff_librarian_2026-09-08.md:26; M.md:913 and :1030-1033;
  README.md:103-104 and :107; plan_lighten_the_load:64.
- Hook headers: session-start.js:2-8, sessionstart-state.js:6-15, userprompt-submit.js:2-9, findings-return.js:1-4,
  stop.js:5-10, sourced-stop.js:10-15, reply-slot.js:3-4, ask-ending.js:1-2, carrier-drift-watch.js:7-14,
  sources-gate.js:1 and :7, delete-gate.js:8, release-chime.js:1, ferry-watch.js:10-13, dispatch-gate.js:3-7.

**Struck, five** (each corrected in place above): the ":822" write line (writes sit at :405-466 and :839-1011, behind
the Check branch); the board-digest "reached blind pairs" claim, which its own citation reverses for the desktop; the
"click never removed" quote; the lighten-plan citation (:62, not :59-61); and the option that said today's fix "lands"
on D, against finding 4. One small range fix: M.md:1034 does not exist.
Cost of these errors: not recorded. No ruling rests on them yet.

**Added, not struck:**
- The UNCLAIMED split sums to 4,949; the 4,950th is a MANIFEST.sha256.
- skipped-no-text 4 is missing from both the second-reader and sources-gate breakdowns.
- "strict 166" is inferred from rows that carry no mode.
- reply-slot's 1,007 and 54 are counted over all modes.
- Finding 1's matcher is declared identically in the repo, so the stale script copy is the whole cause.
- ferry-watch.js:8 and dispatch-gate.js:3-4 give different miss rates for the same 109 commits.

**Prior art the reader did not cite.** handback/p-d619-hooks-tools-C_2026-11-02.md (pane C, D619, 2026-11-02) is a
census of every hook. It covers the same ledgers and verdicts as section 2, and it found the drift [read]:
- :63 rules delete-gate's 10-11 and 10-29 denies "2 real denies". This answers an item in "What I did not open".
- :66 has push-gate "No real catch", with the same planted keys.
- :68 marks ask-ending a "CUT candidate".
- :128 found "7 installed copies differ ... by 2 to 47 lines", eleven days before this file's drift table.
The section is in part a re-derivation of that census. Its cost is not recorded [inferred: one reader's pass].

**Could not check:**
- Anything on L. The keeper's primary notes behind the rulings (I opened only 09-06:603), so each quoted ruling is
  checked only against its carrier.
- Whether "declared and live sets disjoint for 6 days" fits :212-216. The source says only that the Python pulse was
  REGISTERED, NOT DECLARED for six days. I read the paraphrase as fair [inferred].
- The events given for transcript-watch.js and sessionstart-ambient.js.
- The precompact-preserve figure, 3,176: the ledger read 3,177 when I counted, and 3,175 before 14:54Z, so 3,176 fits
  an in-between snapshot [inferred].
- Which of 77.1% and 97.2% is current.
- Why dispatch-gate.js and carrier-drift-watch.js left D.
