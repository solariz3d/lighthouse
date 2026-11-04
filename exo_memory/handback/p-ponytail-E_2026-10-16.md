# Hand-back, pane E (machine D): D342 step 0, Ponytail read before install. STOPPED at the gate.

Packet: the chair's D342 (sent 2026-10-16T16:55:55Z); plan `exo_memory/loop/plan_ponytail_2026-10-16.md` (read in full); source
`C:\Users\nname\Downloads\for-the-librarian\ponytail-promotion_2026-10-16.md` (read in full). Uncommitted.

**Status: STOPPED at step 0, by the packet's own rule ("If anything reads as unsafe, stop and say so").** Nothing is installed. No hook or script
from the repo was run. Nothing was written to `~/.claude`, `~/.config` or `%APPDATA%`. The retro test (step 1) has not started.

## 1. What was read

- github.com/DietrichGebert/ponytail at **`6f1c2bfff0c837d268929a7c4e490918eb4fab29`** ("chore: release v5.3.1 (#1147)", 2026-10-16 15:20 +0200), fetched
  at depth 1 into `G:\Consonance-tools\ponytail-src` (211 files). checked: `git log -1 --format="%H %cd %s"`. The licence is MIT (`LICENSE`).
- The Claude plugin: `.claude-plugin/plugin.json` names two hook files, `hooks/claude-codex-hooks.json` and `hooks/claude-band.json`.
  - SessionStart runs `hooks/ponytail-activate.js`.
  - SubagentStart runs `hooks/ponytail-subagent.js`.
  - UserPromptSubmit runs `hooks/ponytail-mode-tracker.js`.
  - The band module is `hooks/band/register.tsx`.
  - Read in full: `ponytail-activate.js` (200 lines). Its line numbers below were re-checked with `grep -n` before ringing. Every write, network, spawn and config path in `ponytail-config.js`, `ponytail-runtime.js`,
    `ponytail-mode-tracker.js`, `ponytail-subagent.js`, `ponytail-map.js`, `ponytail-instructions.js`, `band/register.tsx`, `band/metrics.ts`,
    `band/board.ts` and `.opencode/plugins/{index.js,ponytail.mjs,ponytail-frontmatter.cjs}` was located by a `grep` for fs writes, fetch, http,
    child_process, homedir, HOME, the config dirs, settings.json, webhook and Bearer. The hits were then read in context.
- The review skill `skills/ponytail-review/SKILL.md` (5,244 bytes) was read in full.

## 2. What touches the file system outside the project, settings, or the network (quoted)

1. **It writes into `~/.claude` on every session start, at any install scope.** `hooks/ponytail-activate.js:4-6`:
   "Runs on every session start: 1. Writes flag file at $CLAUDE_CONFIG_DIR/.ponytail-active (defaults to ~/.claude; statusline reads this)".
   - `hooks/ponytail-config.js:73`: `return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');`.
   - `hooks/ponytail-runtime.js:60-66` (`setMode`): `fs.mkdirSync(...)`, then `fs.writeFileSync(file, mode)`, for a shared flag and for
     `<claudeDir>/ponytail-modes/<sha256 of the project dir>`.
   - `ponytail-mode-tracker.js:86-89` writes or unlinks the same flag on prompts.
2. **It copies a script into `~/.claude` and keeps a marker there.** `ponytail-activate.js:120-133`: `fs.copyFileSync(path.join(__dirname,
   scriptName), tmpPath, ...)`, `fs.renameSync(tmpPath, scriptPath)` with `scriptPath = path.join(claudeDir, 'ponytail-statusline.ps1')` on Windows;
   then `fs.writeFileSync(nudgeFlagPath, ...)` with `nudgeFlagPath = path.join(claudeDir, '.ponytail-statusline-nudged')`.
3. **It reads `~/.claude/settings.json` and tells the model to change it.** `ponytail-activate.js:76-79` reads and parses `settingsPath`
   (`path.join(claudeDir, 'settings.json')`). `:146-152` then puts hidden SessionStart text before the model: "STATUSLINE SETUP NEEDED: … To enable, add
   this to " + settingsPath + … "Proactively offer to set this up for the user on first interaction." The command it hands over is
   `powershell -ExecutionPolicy Bypass -File "<~/.claude>\ponytail-statusline.ps1"` (`:142-144`).
4. **A per-turn ledger outside the project, on by default.** `.claude-plugin/plugin.json` `userConfig.ledger`: `"default": true`, "After every turn,
   write this task's row (cost, turns, agent time, tokens, reuse, tests) to ~/.config/ponytail/band/<project>.csv". `band/register.tsx:120-138`:
   `ledgerDir` = `$XDG_CONFIG_HOME` or `<home>/.config` + `/ponytail/band`; `await $.fs.write(file, upsertCsv(existing, row))`, then `writeBoard`
   (a `board.html` beside it).
5. **The network: an optional webhook, empty by default.** `plugin.json` `webhookUrl` has `"default": ""` ("Empty: nothing leaves this machine").
   `register.tsx:139-152` uses `$.http.fetch(request.url, request.init)` when it is set, with an optional `Bearer` token (`metrics.ts:303`) and,
   by default, the task's name (`sendNames` `"default": true`). The name is read from the session transcript (`metrics.ts:165-175`,
   `"type":"custom-title"`). It refuses a URL that is not https (`metrics.ts:301`).
6. **Other host config dirs** (not Claude Code, so they don't fire here, but they are the same pattern): `%APPDATA%\ponytail\config.json`
   (`ponytail-config.js:9,60`, written at `:147-154`), `~/.cursor`, `~/.codebuddy` and `~/.qoder` (`ponytail-runtime.js:41-42`), and opencode's
   `~/.config/...` state (`.opencode/plugins/ponytail.mjs:32,47-48`).
7. **A process it spawns:** `ponytail-map.js:39` runs `git ls-files` in the project (read-only), under SessionStart, unless `PONYTAIL_MAP=0`.

## 3. Why I stopped

- Items 1–3 write to and read the live `~/.claude` and its `settings.json` whatever the install scope, because the hooks resolve `CLAUDE_CONFIG_DIR`
  or `~/.claude` themselves. My standing rules forbid that: "never edit the live ~/.claude, settings.json". The packet's "NEVER user-wide" forbids
  it too. A project-scope install of the plugin is therefore still a user-wide write.
- Item 3 is a standing hidden instruction to the model to offer a change to user-wide settings. That is the one I would not run in this room under
  any scope.
- Item 4 is a per-turn write outside the project, on by default.
- inferred: nothing here reads as malicious. Every write is documented in the repo's own comments, the webhook is off by default and https-only, and
  the code is careful (temp-and-rename, a BOM strip, a shell-safety check). It is unsafe for this room's rules, not hostile.

## 4. The safe path, for a word (not taken)

- **`ponytail-review` is text only.** Its SKILL.md runs nothing. It ends "Lists findings, changes no code". checked: a `grep` of it for http, curl,
  fetch, install, settings, `~/`, `.claude`, run, execute, bash and npm → nothing that runs anything. The rule file `.agents/rules/ponytail.md`
  (2,653 bytes) and `skills/ponytail/SKILL.md` (3,548 bytes) are text too.
- **Option A, no install at all (my recommendation):** for each of the five diffs, a fresh subagent is briefed with `skills/ponytail-review/SKILL.md`
  verbatim, plus the diff's sha and its worktree, and returns the findings. No hook, no file outside the project, and the same skill text any install
  would load. Then step 1 as planned: each finding applied alone in a throwaway worktree, its tests and mutants run, and a score.
- **Option B, a text-only project skill:** copy only `skills/ponytail-review/SKILL.md` into a throwaway worktree's `.claude/skills/ponytail-review/`,
  with no `plugin.json` and no hooks. It is only picked up by a session started in that worktree, so for this seat it amounts to option A
  with an extra copy.
- **Not offered:** installing the plugin, even at project scope, for the reasons in §3.
- What would change my mind: a word that the room accepts the `~/.claude` flag and script writes. I would not take one for item 3's settings nudge.

## 5. Nothing else changed

- `G:\Consonance-tools\ponytail-src` holds the source checkout only (read, never run).
- No worktree has been made for D342 yet.

NEXT: librarian, rule on option A, option B or no; on A or B, pane E starts step 1 on the five diffs at once and re-rings when they are scored against the registration.


(The NEXT above was step 0's, answered by the chair's word at 2026-10-16T16:59:17Z: option A, ruling at the end of `plan_ponytail_2026-10-16.md`.)

## 6. The retro test, option A (2026-10-16 ~11:00–15:30)

**What this tests:** the review skill's TEXT (`skills/ponytail-review/SKILL.md` at `6f1c2bff`), not the plugin's always-on rule and not its hooks. The plugin was never installed, and nothing ran from its hooks. Arm 6 (§8) adds the always-on rule text beside the skill and is scored separately.

**How it ran.**
- **The reviewers.** Each of the five diffs had a fresh subagent. Its instruction was to read `G:\Consonance-tools\ponytail-src\skills\ponytail-review\SKILL.md` and follow it, so the skill reached it byte for byte. It worked read-only in its own detached worktree, `C:\Users\nname\Downloads\t180-pt-<335|336|337|340|341>`, at the diff's tip, and saw no other review and no room record.
  - One addition to the skill's own format: every finding had to carry its exact old and new text, so it could be applied alone.
  - D336's two commits were reviewed as landed. `b2f7b4f` has the same patch id as `6fd2537` (checked: `git patch-id --stable` → `2e2801e6…` for both), then `8fbab15`.
- **The scoring.** `scratchpad\d342\score.js <base>` under the heavy-run lock, one base at a time. For each base:
  1. A baseline: its tests and mutant scripts with nothing applied.
  2. Then each finding ALONE, from a reset tree. A bug finding first runs its new test on the old code, which must be red. Then the whole edit, with the base's tests, its mutant scripts and the line count. Then a reset.
  - The tests and mutants come from each diff's hand-back. D335: handles, core-pieces-ui, core-sculpt, core-eqonly and preview tests; A's `mut335.js`. D336: preview-stuck and preview; C's `stuck_mutants.js`, plus `app/test/mutation.test.js`'s 41 `preview.js` mutants (N13 among them). D337: core_finish, core_close_flip, overlap-lap, close-worker, core-close-preview, preview-close-reuse and the Close mutation file. D340: preview-late, preview-stuck, preview and inputlog; `late_mutants.js`, `log_mutants.js`, the 41 preview mutants, and `cargo test --lib`. D341: validate_sustained, export_catch, underskin and validate; `mut341.js` and `mut341b.js`.
  - Findings: `scratchpad\d342\findings.js`. Results: `score_<base>.json`. Follow-ups: `followup.json` and `followup2.json`. The reviews: `review_<base>.md` and `arm6_<base>.md`.
- **Baselines.** checked:

  | base | tests | mutants |
  |---|---|---|
  | 335 | 218/218 | mut335 8/8 |
  | 336 | 95/95 | stuck 10/10; preview mutants 42/42 (41 plus the control) |
  | 337 | 76: 75 pass, 1 skipped, 0 fail | |
  | 340 | 104/104 | late 8/8; log applied 7 / caught 6 (the guard survivor C's hand-back named); preview 42/42; cargo 37/0 |
  | 341 | 44/44 | mut341 applied 18 / caught 18 / NOT APPLIED 1; mut341b 3/3 |

**How I scored.**
- I kept the plan's scale.
- A lean finding is **real** when the tests are green, every mutant is still caught and it has fewer lines.
- A bug fix, wording or added test has no "fewer lines" to show. It is **real** when its claim is checked true (for a bug, its own test is red first and green after), and the edit keeps every test green and every mutant caught.
- **Harmful** and **wrong/echo** are exactly as registered. An added test that bites nothing new counts as echo.
- Where a fix rewrote a line a mutant targeted, so that mutant read NOT APPLIED, I wrote the same mutant for the new line and ran it. Otherwise "every mutant caught" would quietly mean "fewer mutants".

### The table, arm 1 (the registered arm), 17 findings

| # | diff | finding | verdict | lines (code; tests) | evidence (checked) |
|---|---|---|---|---|---|
| 335-1 | d335 | Sculpt's ratio cache is keyed by doc and channel, not piece: after an undo, another piece gets the wrong ratio | **real (bug)** | +1; +8 | red first: row 10b fails on the old code; then 219/219, mut335 8/8 |
| 335-2 | d335 | Ctrl-snapping is slowed by the speed blend | **real (claim checked; design call)** | 0 | 218/218, mut335 8/8. The arithmetic: bank 0.45°/px with a slow gain of 0.0222 is 0.01°/px, so ~250 px to the first 5° snap against ~5.6 px before (`scrubGain('bank', 0.05)` = 0.0222). No test pins Ctrl at slow speed |
| 335-3 | d335 | the README and one comment describe the old drag | **real (docs)** | 0 | the old README text matched exactly (applied), and the drag no longer holds; 218/218, 8/8 |
| 335-4 | d335 | the hold code no longer runs in the app: delete it | **HARMFUL** | −13 code | code-only: 211 of 218, 7 red (rows 3, 4 …). The review says itself that the hold rows "must be dropped or rewritten". Its premise is true (checked: `targetFor` has one app caller, `handles.js:264`, passing `hold: false`), but the cut removes tests |
| 336-1 | d336 | any header control (Save) lets go of the held keys: `closest()` matches the whole header | **real (bug)** | 0; +7 | red first: row 3b. Then 96/96, preview mutants 42/42, stuck 9/9 with 1 NOT APPLIED: H2's line was rewritten. The same mutant on the new `hasAttribute` line is caught (3 rows red) |
| 336-2 | d336 | after the net lets go of S, Left Ctrl stops flying down (`shortcutDown` not cleared) | **real (bug)** | 0; +6 | red first: row 4b; then 96/96, stuck 10/10, preview 42/42 |
| 337-1 | d337 | the Close menu still says "moves nothing" | **real (words)** | 0 | 76/75/0 (1 skipped, as at baseline) |
| 337-2 | d337 | the FINISH_NEAR refusal has no test | **real (claim checked; no edit given)** | n/a | `git grep FINISH_NEAR` → only `finish.js:188`. A mutant throwing another code leaves every Close test green (37/36/0) |
| 337-3 | d337 | `residual(doc)` built twice on the whole track | **real (lean)** | −1 | 76/75/0, Close mutation file green |
| 337-4 | d337 | a `converged` check that can never fire | **real (lean)** | −1 | `close.js:284` throws when local and not converged; 76/75/0 |
| 340-1 | d340 | a key more than 20 s late gets the wrong cause (frames older than 10 s are dropped) | **real (bug)** | 0; +6 | red first: row 1b, my test (the review gave it in words). Then 105/105, late 8/8, log 6/7 as at baseline, preview 42/42 |
| 340-2 | d340 | `append_capped`: a failed read silently wipes the old log | **real (bug)** | 0 | cargo 37/0. The defect is confirmed by arm 6's test, red on the old code (§8). This fix keeps the log (lossy) instead of refusing, so it fails that stricter test by design, not by fault |
| 340-3 | d340 | `flush` exported, never called; its guard can never fire | **real (lean)** | −1 | 104/104. log_mutants 7/7 (was caught 6: the survivor C's hand-back named as equivalent is gone), late 8/8, preview 42/42 |
| 341-1 | d341 | the default `'loaded'` catch has no test: add row 6 | **echo** | 0; +6 | green 45/45, but the mutants are unchanged. Its own words: "It still does not cover the wiring on line 252", and line 252 handed `[]` leaves all 44 tests green (checked) |
| 341-2 | d341 | the export warning repeats 55 g and 0.5 s by hand | **real** | +1 | 44/44, mut341 18/18, mut341b 3/3 |
| 341-3 | d341 | a three-part condition that is `Array.isArray(o.underCatch)` | **real (lean)** | 0 (3 checks → 1) | the equivalence checked by reading: the two forms are true for exactly the same inputs; 44/44, mutants as at baseline. (Re-run alone: the batch's run was voided by my error, §10) |
| 341-4 | d341 | `catchOf` a near-copy of `skinOf`: one `offsetSurface` | **real (lean)** | −14 | 44/44, mut341b 3/3. mut341 applied 15 / caught 15 / NOT APPLIED 4 (3 moved into `offsetSurface`). Those three re-made on it are each caught (export_catch row 2) |

**Lines a real lean finding saves (arm 1):** 17 lines of code (337-3 1, 337-4 1, 340-3 1, 341-4 14), plus 341-3's shorter condition. The harmful 335-4 would have saved 13 more, and taken 7 test rows with it.

## 7. The totals against the registration (`plan_ponytail_2026-10-16.md:42-52`)

- **Real:** 15 of 17 (88%; 14 of 16 if 337-2, which has no edit, is left out). **Harmful:** 1 (335-4). **Wrong/echo:** 1 (341-1).
- **The prediction (≥30% real, 0 harmful) is REFUTED, on the second clause.** One finding is harmful.
- **Degenerating:** "any finding is harmful" FIRES. "More than half wrong or echo": no, 1 of 17. "The two-line ending used in place of evidence": no. Every verdict above carries its command and numbers.
- **The stop rule did not fire.** No finding would remove the N13 row, the D336 net or the D337 rows. checked: no edit touches `preview.test.js`'s blur row, the net's lines in `preview.js` (336-2 adds two clears to them and deletes nothing) or `core_finish.test.js`.
- **"At least one real finding no seat caught in the read": met, and more than once.** A grep of the room's record (librarian, loop, journal and hand-backs dated 10-15/16) and of the five diffs' own hand-backs finds none of: the per-piece Sculpt ratio, header clicks dropping keys, Left Ctrl after the net, the 25 s cause, the silent log wipe. inferred: no seat caught them; the check is a grep, not a read of every line.
- **So, by the registration as written: NO.** The prediction fails, and "good enough to promote" needs 0 harmful. **The stripped copy is not built**, per the chair's addition ("If it fails the registration, don't build the copy; say so").

## 8. Arm 6: the always-on rule beside the review skill (scored separately, not against the registration)

The same five diffs, each with a fresh subagent told to read `.agents/rules/ponytail.md` as its standing rule and the review skill as its method. They used clean copies `t180-pt-<base>r`. Scored by the same driver (`FINDINGS_FILE=arm6_findings.js`), and `score_arm6_<base>.json` holds the results.

- **Real 17, harmful 1, echo 1, of 19.** Four are the same edit as an arm-1 finding and take its score (A6-337-2 = 337-1, A6-337-4 = 337-3, A6-340-3 = 340-3, A6-341-4 = 341-3); A6-341-2 is a claim with no edit, checked true (line 252 handed [] leaves all 44 tests green).
- **Harmful: A6-335-2, the same cut as 335-4**, this time with its test edits. It rewrites two rows, deletes two, and still leaves 3 red (217/214/3) and one mut335 mutant NOT APPLIED.
- **Echo: A6-337-1**, a row 16 for a real 0.5 m gap. Two mutants, each run without and with it (`followup2.json`): "the near check is off" is already caught by row 14 alone; "the bend tries only the last piece" survives both. It adds no catch.
- **One defect only arm 6 found, and real: A6-341-1, a held load across a closed lap's seam is missed.** Red first: its row 3c on the old code. Then 45/45. The four mutants the rewrite displaced, re-made on the new loop, are all caught. inferred: on ELYSIUM it matters only if the hardest held turn crosses the start. The code's own comment named the limit ("A run does not wrap the lap's seam"); no seat flagged it as a fault.
- **A different, stricter fix for the log wipe, A6-340-2:** refuse the write with an error rather than rewrite lossily. Its test is red on the old code and green with the fix (cargo 36/1, then 37/0). **Its test anchor as given did not apply:** 4-space indents where the file has 8, and the pair it named occurs twice in `lib.rs`. I re-anchored it on the `append_capped` test it was written for, and I count it as the review's slip, not mine.
- **Its other findings** (each real; full runs in `score_arm6_<base>.json`):
  - A6-335-1, the Sculpt ratio with its own test (red first, then 219/219).
  - A6-335-3, reuse `stamp(e)` (0 lines).
  - A6-336-1, the header fix with its own test (red first; the re-made H2 mutant is caught).
  - A6-336-2, delete the `STUCK_SORT` sorting loop and the test file's export (−2 test lines). Green, but it removes the instrument D336's host-sort figures came from, so I would not take it.
  - A6-336-3, an unused `require`.
  - A6-336-4, the net's clock on the capped `dt`. Green, every mutant caught, but its own trade-off: below 10 fps the net acts later in real time.
  - A6-336-5 and A6-337-3, one-line comments.
  - A6-340-1, cause `'unknown'` past the kept 10 s (red first, green, the re-made cause mutant caught).
  - A6-341-3, catch over `skinOf(offset, flip)`: −17 lines, the four displaced mutants re-made and caught.
- **Arm 6 against arm 1:**
  - It found the seam defect and the stricter log fix.
  - It missed 336-2 (Left Ctrl after the net), 335-2 (the Ctrl speed) and 335-3 (the stale README).
  - It skipped two near-copies as "the house pattern" (`world()` in 15 test files; inputlog's source check). That is the rule's "keep the conventions" working.
  - It made the same harmful cut.

## 9. My read: where it helped, where it would have hurt

- **It helped most as a bug-finder, not as a cutter.** The five bugs every seat missed are real, each proven by a test red before and green after. They are all small, and on the user's own paths: Save while flying, Ctrl after a lost key, Sculpt after an undo, a 25 s key, a wiped log. Its lean cuts were modest (17 lines in arm 1, every one safe once checked).
- **It would have hurt in one place, and the same place twice.** In both arms it cut code it rightly found unreachable, but whose tests pin a behaviour the code still offers ("for a caller that asks"). In the registration's words, a cut that removes tests is harmful. To be fair to it, the review said plainly that the rows must go, so it was never hidden. And nothing it cut had caught a fault today: no N13, no net, no D337 row.
- **Its "Verdict: Ship."** It said Ship on D337 and D341, which carry the most real defects (four and three). It shipped what a seat would have shipped, and its findings came after the verdict, not instead of it.
- **What would change my mind** about the "no": if the librarian rules that deleting tests of code proven unreachable is not "removing a test" in the registration's sense. Then arm 1 is 15 real, 0 harmful, 1 echo, and the promotion question passes on every registered clause. That is the librarian's call, and the registration was written to make it before the run.

## 10. Corrections, mine

- **My dry check clobbered one scoring run.** At about 11:18 I ran a dry apply-check for arm 6 in the same `t180-pt-*` worktrees the arm-1 batch was using. Its reset removed finding 341-3's edit, and possibly a mutant, mid-run. The batch's 341-3 result is void. 341-3 was re-run alone after the batch (`rerun_341-3.log`: 44/44, mutants 18/18 and 3/3). Every later check ran only when no batch was running. checked: no other finding's run overlapped; base 341's 341-1 and 341-2 had finished at 11:17:30, and bases 335–340 had not started.
- My first arm-6 brief named its worktree `t180-pt-335r` a few seconds before I created it. Its review came back normally.
- I first counted A6-340-2's NOT APPLIED as my transcription. It was the review's anchor (§8).

## 11. What is left on disk

- **Ten throwaway worktrees**, detached, no branches, never pushed, at the diffs' tips and clean:
  - `C:\Users\nname\Downloads\t180-pt-{335,336,337,340,341}` and `…r`;
  - checked: `git status --porcelain` is empty in each after the last reset.
  - Remove them with `git worktree remove` once the librarian has read this (no junctions in them).
- `G:\Consonance-tools\ponytail-src`, the pinned source, read only.
- `G:\Consonance-tools\ponytail-target`, cargo's build folder for the 340 runs. It can be deleted.
- Nothing is installed, and nothing touched `~/.claude`, `~/.config` or `%APPDATA%`.

NEXT: librarian, rule on promotion against §7: the registration's "no" stands as written, unless you rule that 335-4 is not "removing a test" (§9). The stripped copy waits on that ruling.


(The NEXT above was answered by the librarian's ruling, `plan_ponytail_2026-10-16.md:90` to the end: the registered answer NO stands. The chair's
part-2 packet was sent 2026-10-16T21:19:17Z.)

## 12. D342 part 2: the real defects landed (branch `d342-e` off `7abf52e`)

Worktree `C:\Users\nname\Downloads\t180-wt-e3`; the branch is `d342-e`, ten commits, tip **`de7b5cb`**, not pushed. Headless only. Driver:
`scratchpad\d342\land2.js`. Results: `land2.json`, `e3mut_baseline.json`, `e3mut_final.json` and `e3extra.json`.

**Each fix, one commit, its test first** (run on the old code, red expected), then its targeted tests:

| fix | commit | red first (checked) | green (checked) |
|---|---|---|---|
| 335-1: Sculpt's ratio per piece | `f1226d0` | core-sculpt row 10b, 14/15 | the D335 set 219/219 |
| 335-2: Ctrl at full weight | `d07ae6d` | no test (behaviour; see below) | 219/219 |
| 336-1: header controls keep the held keys | `3452a0d` | preview-stuck row 3b, 10/11 | preview-stuck + preview 96/96 |
| 336-2: Left Ctrl after the net lets go of S | `210b79f` | row 4b, 11/12 | 97/97 |
| 340-1: a 25 s key is "host late" | `dfd1d1b` | preview-late row 1b, 4/5 | the D340 set 107/107 |
| A6-340-2: refuse, never rewrite a log it cannot read | `e06bf5b` | cargo 36 passed / 1 failed (the input-log test, extended) | cargo 37/0 |
| A6-341-1: a held load across the seam | `951df4e` | validate_sustained row 3c, 6/7 | the D341 set 45/45 |
| 337-2: the FINISH_NEAR refusal tested | `edfd0cb` | pins behaviour that already exists, so no red is possible. Its proof is the mutant below | core_finish and the Close tests: 76, 74 pass, 2 skipped, 0 fail |
| "the words" (see 337-1) | `9442794` | comment only | core_finish 16: 15 pass, 1 skipped |
| CHANGELOG | `de7b5cb` | | |

**Mutants, before and after (checked, under the lock):**
- **Baseline at `7abf52e`:** mut335 8/8; stuck 10/10; late 8/8; log applied 7 / caught 6 (the known guard survivor); mut341 applied 18 / caught 18 / NOT APPLIED 1; mut341b 3/3; the 41 preview mutants 42/42; cargo 37/0.
- **On `9442794`** (the code at `de7b5cb`, which adds only the CHANGELOG): mut335 8/8; late 8/8; log 6/7 as at baseline; preview 42/42; cargo 37/0.
- **Read NOT APPLIED because a fix rewrote their line:** stuck applied 9 / caught 9 / NOT APPLIED 1 (H2); mut341 applied 15 / caught 15 / NOT APPLIED 4 (3 more than baseline); mut341b applied 1 / caught 1 / NOT APPLIED 2.
- **Re-made on the new lines, each caught** (`e3extra.json`):
  - H2 on the `hasAttribute` line: 3 rows red.
  - The four sustained-load rules on the new loop: the edge, the duration, a quiet station, a non-road station.
  - A new one: the seam wrap removed, caught by row 3c.
- **One mutant per new fix, reverting it,** each caught by that fix's own new row: the ratio cache ignoring the piece, the net leaving `shortcutDown`, a trimmed frame not remembered.
- **The FINISH_NEAR code swap, which no test caught before, is now caught by row 16.**
- checked: `node --test --test-name-pattern="no water" app/test/core-readout-display.test.js` → 1/1, and the D238 pattern grepped over `app/` outside the tests finds nothing. That is the test my D334 comment broke.

**337-1, the words: not landed as written, because `7abf52e` already fixed it.**
- D339 removed the Close menu: Close is one press now.
- Its message names a bend: `closejob.js:96-103`, "closed: bent the last k pieces (…) by up to …"; "nothing already built moved" only when new road is laid.
- checked: `git grep "moves nothing"` in app and src → only comments.
- What still said the old thing was `finish.js`'s header ("ADDS road instead and moves nothing the user built"). I landed arm 6's one-line header note (A6-337-3) there instead, and say so.

**337-2's test, built because the reviews gave none** (`scratchpad\d342\near.js` and `near2.js`):
- Small near-start gaps just bend: 0.5 m and 0.9 m both read BEND.
- What reaches the refusal is an end exactly on the start whose LAST piece is a crest the car leaves at full speed (kv −0.002 over 400 m). Every bend window Finish tries holds that piece, so each fails the road test.
- At kv −0.001 the car holds the crest and Finish bends, so the test's track is at the edge, not deep inside it.

**335-2, for the keeper's hands: the px per Ctrl snap.** Computed from `7abf52e`'s own `handles.js` (`scrubGain`, `perPx`, `snap`). Pixels between one snap and the next; a slow drag reaches its first snap after about half:

| handle | snap | slow drag (≤0.1 px/ms) now | 0.3 px/ms now | quick drag (≥1 px/ms) now | with the fix, any speed |
|---|---|---|---|---|---|
| bank | 5° | 500 | 76 | 11.1 | 11.1 |
| length | 10 m | 1000 | 162 | 23.8 | 23.8 |
| width | 5 m | 500 | 289 | 73.5 | 73.5 |
| cup | 5° | 500 | 128 | 20.8 | 20.8 |
| turn, climb | 5°/100 m | 500 | ~260 | ~60 | ~60 |

- So with Ctrl held, a drag snaps at the quick drag's pace whatever the speed. That is how Ctrl felt before D335.
- Without Ctrl, nothing changes.
- If he likes the slow Ctrl, `d07ae6d` reverts alone.

**Kept to the brief:**
- No lean cuts and no refactors.
- **No existing test deleted or rewritten.** checked: `git diff 7abf52e -- app/test test` deletes three lines only, all in `preview-stuck.test.js`'s fake host: the element maker, the panel/title line and its return object. They now also give `hasAttribute` and a header button for row 3b, and everything they gave before is unchanged.
- **The CHANGELOG** has one Changed entry and six Fixed entries, in our own words.
- **Every commit was by named paths.**
- **The scan:** checked, `scan.js` over the CHANGELOG and the branch's 76 other added lines → 0 credentials, 0 home paths, 0 "the keeper".

**The ten throwaway worktrees are removed:**
- checked: a reparse-point scan of each → 0 junctions.
- Each was clean and detached. Removed with plain `git worktree remove`, no `--force`.
- `git worktree list` before and after (`worktrees_before.txt`, `worktrees_after.txt`) differ by exactly those ten lines, plus the new `t180-wt-e3`. No `t180-pt-*` folder remains.
- `G:\Consonance-tools\ponytail-target` (cargo's build folder) is still there and can be deleted.

**Not run here:** the full suite (the chair's, at landing), and `core-close-mutation.test.js` (none of these commits touches Close's code).

NEXT: chair, collate `d342-e` (`de7b5cb`) with D343 and D344 into one build.


## 13. D346 part 1: the stripped copy, built and tested (2026-10-16 ~18:4x, parked for D347, finished ~20:1x)

The chair's D346 was sent 2026-10-17T00:35:57Z. The brief is `plan_ponytail_2026-10-16.md:146-156`, built to the spec at `:76-89`.

**The copy: `G:\Consonance-tools\ponytail-room\`**, from `G:\Consonance-tools\ponytail-src` at `6f1c2bfff0c837d268929a7c4e490918eb4fab29`.
- **Kept** (checked: each `cmp`-identical to the source):
  - `LICENSE` (MIT, unchanged);
  - `.agents/rules/ponytail.md` (the always-on rule);
  - `skills/ponytail/SKILL.md`, `skills/ponytail-review/SKILL.md`, `skills/ponytail-audit/SKILL.md`, `skills/ponytail-debt/SKILL.md`;
  - plus `NOTICE`.
- **NOTICE** gives each kept file's sha256, every class of the 205 removed files, how the copy is loaded, and the room's rulings where they meet the text.
  - Removed: the hooks (activate, mode-tracker, subagent, map, runtime, config, instructions and their manifests), the statusline scripts, the band module with its ledger and webhook, the plugin manifests and marketplaces, the other agents' copies, and the scripts, benchmarks and tests.
  - The rulings: comment density, evidence in findings, the changelog's why, and no finding that deletes or rewrites a test landing.
- **Each kept skill folder is one SKILL.md, so no scripts.** Read in full before copying (the review skill at D342, the other three now):
  - nothing in the text asks for a network call, an install or a settings change;
  - the one write is `ponytail-debt`'s "To persist it, ask and it writes the ledger to a file (e.g. `PONYTAIL-DEBT.md`)", only on request and inside the project;
  - the one command named is its read-only `git grep`.
  - The rule's "Comment only the why … in one line" conflicts with the room's density ruling; NOTICE records that the ruling wins.

**Test 1, the grep:** checked: `grep -rn -i -E "writeFile|appendFile|fs\.|require\(|import |fetch|https?:|child_process|execFile|exec\(|spawn|homedir|\$HOME|USERPROFILE|APPDATA|settings|\.claude|~/|webhook|curl|wget|npm|npx|pip |install"` over the copy.
- The matches, quoted:
  - `.agents/rules/ponytail.md:16` and `skills/ponytail/SKILL.md:30`: "4. An installed dependency? Use it. Never add a dependency for a few lines." That is advice in prose.
  - NOTICE:17–37, its own description of what was removed.
- **Nothing that runs:** every file is ASCII text (`file`), and none is a script.

**Test 2, `~/.claude` before and after one session that loads the copy.**
- **The session:** `claude -p` (2.1.299, print mode, no window) in a detached reviewer worktree `C:\Users\nname\Downloads\t180-wt-e4` at `56ba827`. The four skills were copied into its `.claude/skills/<name>/SKILL.md`, untracked and never committed. The tools were read-only: `Bash(git grep:*)`, Read, Grep and Glob.
  - The prompt asked it to list the ponytail skills and run `ponytail-debt` read-only.
  - It answered: "Skills whose names begin with ponytail: `ponytail`, `ponytail-audit`, `ponytail-debt` and `ponytail-review`. … No shortcut debt. Clean ledger."
- **A control first:** the same session, same prompt and same flags, in the same worktree without the copy. It answered "None."
- **The hash** (`scratchpad\d342\snap.js`: every file under `~/.claude` as path, size and mtime, sorted, hashed):
  - control: `86d09cc8…` → `04ac2821…`;
  - copy: `75f2a321…` → `e42ec8c3…`.
  - **The list changed in both.** Claude Code writes its own session files there in any session, and other seats write theirs at the same time. So a literally unchanged hash is not possible for any session. I measured what the copy adds instead.
- **What changed** (checked: `diff_control.txt`, `diff_ponytail.txt`):
  - each session's own transcript in `projects/C--Users-nname-Downloads-t180-wt-e4/`;
  - elsewhere, Claude Code's housekeeping and other seats' activity: the `.claude.json` backup rotation, plugins and skills `synced/` (the account's sync), other seats' transcripts, and the `shell/` hook logs.
  - Set against the control, the copy's session alone changed: the backup rotation, the account's `skills/synced` manifest, and the librarian's transcript. None is ours.
- **Nothing of Ponytail anywhere:**
  - checked: 0 paths under `~/.claude` naming ponytail after the session;
  - no `.ponytail-active`, `ponytail-statusline.*`, `.ponytail-statusline-nudged` or `ponytail-modes`, before or after;
  - no `~/.config/ponytail`;
  - 0 files under `~/.claude/skills` naming ponytail;
  - `settings.json` not among the changed files.
- **Verdict: the copy is safe to load for one pane.** It runs nothing and writes nothing outside the project. The `~/.claude` changes around its session are Claude Code's own and match the control's in kind.

**Left in place for the trial:**
- `t180-wt-e4`, a detached worktree with the four skills untracked in `.claude/skills/`, for reviewing D343 when it lands. git sees them only as untracked; they are never committed.
- `G:\Consonance-tools\ponytail-room\`.

NEXT: chair, ring pane E when D343 lands; pane E then runs ponytail-review on it (reviewer only, the standing rule held).
