# p-trailing-A — D294 part 3 (ledger row D295): the trailing-reminder experiment; seat A, 2026-10-11

Worktree `G:\consonance-worktrees\a-d294-wt`, branch `d294-a` from main `7f08f148`. **Two commits, local, named paths, not pushed:**
- `dc45c56c` — the registration, committed FIRST: `exo_memory/loop/trailing_reminder_registration_2026-10-11.md` (the bar, written before any code).
- `1b4cb7c0` — the shadow: `dev/shell/hooks/userprompt-submit.js` (+47) and a new `dev/shell/hooks/userprompt-trailing-shadow.test.js` (12 rows). Not installed live.

## 1. Did it ever run? No — and it was refused once on the design (checked)
- `consonance/tools/boundary-reminder.js` (commit `4ec5ef53`, L016 packet A, 2026-08-30): built the second measure first and REFUSED the live reminder: the quality signals are unpowered in twenty dispatches (1.6 active days), and a constant reminder is already a nag by the room's own record (`turn_boundary_detection_2026-08-25.md` §5: P2 refused at 94.2%; `dispatch-gate.js` header: a reminder that fires regardless is ignored). No hook was modified. The research file's 09-01 note ("the hook test itself is unrun") is still true.
- The NEXT-trailer gate did NOT replace the turn-boundary rule: `consonance/GATES.md` §3 checks that a ring ends in a `NEXT:` line, not that output is finished before a dispatch. So the baseline still applies.
- **Live equivalent of 98.1%:** `node consonance/tools/boundary-reminder.js --scan --transcript C:\Users\nname\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl` (2026-10-11) → **1089 of 1091 dispatch turns (99.8%) wrote text after the last dispatch; 95.2% above 500 characters; 75.9% above 1000.** I used 500 as the shadow's threshold. (The other two main-dir transcripts had 0 dispatch turns.)

## 2. What I built, and what it can and cannot tell you
A SHADOW. Per prompt, the Node hook reads the last 512 KB of `transcript_path`, finds the previous turn with assistant output, and appends one row to `<shell dir>/trailing_reminder_shadow.jsonl`: `{ts, session_id, prompt_id, cwd, dispatches, charsAfter, threshold:500, wouldFire, reminderChars, ms}`. `wouldFire` = a `chair_inject` dispatch then more than 500 characters. Nothing reaches the output (pinned: output identical with and without the transcript). The Third Place and fresh panes are never logged; any error is swallowed.
**It measures only the fire rate** (is the reminder a nag?). It cannot say whether a reminder changes compliance, because nothing is sent. The registered bar: among the first 20 chair dispatch turns, **≥ 90% wouldFire → the live reminder is refused on a measured number; < 50% → propose a randomised live arm by the keeper's go; between → B decides.** My expectation (history) is the nag result; B scores it, not me.
- To score (inferred, not run on real data — no rows exist yet): `node -e "const r=require('fs').readFileSync(process.argv[1],'utf8').trim().split('\n').map(JSON.parse).filter(x=>/instances.main/i.test(x.cwd)&&x.dispatches>0).slice(0,20);console.log(r.length,r.filter(x=>x.wouldFire).length)" <shell dir>\trailing_reminder_shadow.jsonl`.
- Proposed live wording if it ever ships: "Finish your output before you dispatch: a dispatch ends the turn." (66 characters; short for light mode). It is a constant in the file, never emitted.

## 3. Checks
- Red first: 10 of 11 new rows failed on the old hook (the 11th, "unreadable path logs nothing", passes vacuously on it); with the shadow 11 pass; one more row added after mutants → 12.
- Tests that spawn the hook, after the change: `userprompt-trailing-shadow` + `userprompt-submit` + `shell-dir-seam` + `third-place-gate` + `consonance/hooks/dream-gate` → pass 29 / fail 0 (run through `heavy-run.hold()`).
- Mutants on `userprompt-submit.js`: first batch **applied 11 / caught 6 / NOT APPLIED 0**. Survivors: "text before the dispatch counts", "reminder emitted", "first assistant turn kept" were real gaps — I added two assertions/rows and re-ran those three: **applied 3 / caught 3**. Still surviving, and equivalent by construction: "torn first line kept" (an unparseable fragment is skipped by `JSON.parse` anyway) and "wouldFire ignores dispatch" (`charsAfter` only accrues after a dispatch). The "reminder emitted" mutant in the first batch was itself faulty (it threw inside the beacon's catch, so both runs went quiet equally); the replacement (reminder appended to the context when it would fire) is caught.
- Cost (registration falsifier 3): 20 runs against the real chair transcript (571 MB) → median 2 ms, p95 2 ms, max 3 ms, against the 50 ms bar.
- Ratchets after committing: `portable-paths` green (381 files, 0 new); `carrier-drift` GREEN.

## 4. Readers and which pulse is live (checked)
- `dev/shell/install.ps1 -Check`: `userprompt_pulse.py` is the registered, managed pulse (`ok`); `hooks\userprompt-submit.js` is "installed and running; no $register entry" and shows `DRIFT`. I diffed the installed file against the repo's HEAD copy with CR stripped: **0 differing lines**, so the DRIFT is line endings only and syncing will carry exactly my +47 lines.
- **The shadow is in the Node hook only.** `userprompt_pulse.py` (also live on D) is not shadowed. If the chair wants both beds, a Python mirror is a separate packet; the Node hook sees every prompt it is wired to, which is what the 20-dispatch count needs.
- Readers of the new log: none yet (B scores it). Readers of the hook's output and state file are unchanged (the shadow touches neither); `userprompt_state.json` consumers: only this hook and one old evidence harness.
- Not traced: whether Consonance's janitor will sweep `trailing_reminder_shadow.jsonl` (one ~250-byte row per prompt in every non-fresh pane, so it grows with every prompt; no cap in this change).

## Corrections to myself
- My first test-file heredoc was rejected by the shell and the first edit script put real newlines inside JS strings (the file's own comment warns about this); both caught by running (`node --check`/the tests), fixed with `String.fromCharCode(10)`.
- The first mutant script had a faulty mutant (above); I did not count it.

## Not run / not checked
- No live install, no real-window test. The shadow has logged nothing on real data; the cost figure is from replaying the hook against a real transcript with a temp shell dir.
- Whether the chair's own transcript is the only seat that dispatches via `chair_inject`: rows from other panes are logged but filtered by cwd at scoring.

NEXT: chair sync userprompt-submit.js to ~/.claude/shell/hooks after the suite, then B scores the first 20 chair dispatch rows against the registered bar
