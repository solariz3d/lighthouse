# p-claudemd-C — the global CLAUDE.md, audited rule by rule (D248 in the plan). Pane C, 2026-10-06. NOTHING EDITED.

SOURCES: exo_memory/loop/plan_global_claude_md_audit_2026-10-06.md · exo_memory/CLAUDE.global.md (`cmp` with `~/.claude/CLAUDE.md`: IDENTICAL, 95 lines, last commit `4e977860`) · exo_memory/loop/rule_census_score_2026-10-02.md · exo_memory/loop/rule_census_list_2026-10-02.md · the feedback memories under `~/.claude/projects/*/memory/` (Third Place dirs excluded) · my scratch `cm/turns.js` (sha256 `b993de21…`), `cm/turns_month.js` (`2a0d9b7d…`), `cm/examples.json` (`b28c5d8e…`)

**What it applies to:** every Claude Code project on this machine. Since 08-01, the projects with transcripts are:
- the Consonance seats;
- brain-rot (Signal, DREAMZONE);
- 602, Tilt, valheim-agent, claude-room and NEWEST-FOLDER.

Every cut and rewording below was weighed for those too. Where another project's memory pulls the other way, it is cited (the 602 memory, line T1).

## Verdict in one paragraph
- **Of 60 rules (`grep -c "^- "`; a first hand count said 62, then 61), 50 KEEP as written. 10 are REWORDED and none is cut.** One section is ADDED, because it already lives as hand-copied memories in four projects. **Three GATES** are proposed, each naming its hook point and what it refuses.
- **The one real fight is the "ask first" family** (Task Decomposition and one Decision Autonomy line). Three things sit against it: the keeper's own corrections in three projects, Claude Code's own harness text, and a measured rate.
  - **109 of 2,182** keeper-facing turn-ending replies since 08-01 end in "Want me to …?".
  - The chair's was **89 of 759 (11.7%)** in August. It fell to **4 of 205 (2.0%)** in September, after the `state-judgments-never-ask-permission` memory. It is still **2 of 10** in brain-rot in October.
  - That memory works as a memory does: down, not out. The census predicts exactly this for an ungated rule: median 0.527 slot, 0.979 gated.
- **Everything else in the file is generic engineering hygiene the work already does.** Two figures show it. 38 of 53 recent t180 code commits carry a CHANGELOG line. The room's red-on-base convention is the "reproduce the bug first" rule, run every time.

## How to read the tags
- **FIGHTS**: the rule conflicts with a cited room rule or memory.
- **STALE**: a newer model taking it literally over-does it, with the case cited.
- **KEEP**: generic, and followed anyway.
- **GATE**: important and ungated; a hook should refuse the breaking action.

For KEEP, a rate or sample is cited where I had one. Where I had none, it says "unmeasured". No change is proposed for those, so the abuse condition does not reach them.

### Measurements used (each re-derivable)
- **M1:** `node cm/turns.js 2026-08-01` and `node cm/turns_month.js 2026-08-01`. These cover every top-level transcript under `~/.claude/projects` with mtime ≥ 08-01. Dirs matching `third|claimrec|temp|system32` are excluded.
  - A *turn-ending reply* is the last assistant text before the next genuine user text. Keep-warms, chair or pane packets, pastes and task notifications are not counted.
  - Results:
    - Consonance: 2,145 turns, **ask 107**, rest-offers 4, AskUserQuestion 35, web calls 153.
    - Other projects: 37 turns, ask 2.
    - By seat and month:

      | seat | month | ask | turns |
      |---|---|---|---|
      | main | Aug | 89 | 759 |
      | main | Sep | 4 | 205 |
      | librarian | Sep | 14 | 936 |
      | librarian | Oct | 0 | 164 |
      | brain-rot | Oct | 2 | 10 |
      | panes | all | 0 | ~80 |
  - Sampled examples (`cm/examples.json`): main 2026-08-17T11:29Z "Want me to do the rename?"; 2026-08-25T10:51Z "Want me to dispatch it?"; 2026-09-09T06:38Z "Want me to start the cold arm?"; brain-rot 2026-10-05T18:14Z "want me to launch Consonance and watch while you wake Main…?".
  - Rest-offers: main 2026-08-22T11:42Z "Want that now, or sleep?"; 2026-08-30T08:30Z "Go get some sleep."
- **M2:** `git log --no-merges -60 main` in t180. 53 commits touch non-test `src/` or `app/`, and **38 of them touch CHANGELOG.md (0.717)**. blackbox: 10 of its last 40 commits. lighthouse: **no CHANGELOG.md tracked, 0 of 2,623 commits**. Its change record is the journal, the hand-backs and the commit bodies, by the maintenance law.
- **M3:** t180 at `20e5711` has **1,660 tests and 5,248 `assert` calls; 497 of 1,660 (29.9%)** have one call or none. inferred: the rest are deliberate named "rows" with several checks each, as the files declare (e.g. `test/core_piece.test.js:3`, "Stated before the tests were written:" rows 1–9).
- **Census (D210):** gated rules **0.940–1.000, median 0.979**; ungated slot **median 0.527**; inline per-claim **0.276**, and near 0 for "a number carries its source" (`rule_census_score_2026-10-02.md`).

## The tags, rule by rule (§ = the master's section; n = its bullet number in that section)

### Verification & Testing
| # | rule (short) | tag | evidence |
|---|---|---|---|
| V1 | run the relevant test suite before reporting success | **STALE → reword** | Literally, "the suite" grew into full suites and mutation passes on UI laps. Memory `match-checking-to-risk` (librarian) quotes the keeper on 09-29 13:43: *"wtf are these run locks, taking up so much time to fix something even a person could tweak in 5 mins"*. In that case, 15–20 min mutation passes by both author and reviewer ran for a few lines of key handling. Memory `packet-tiers-feel-vs-geometry` (main) records the same. Proportion is the fix, not fewer tests. |
| V2 | fix the implementation, never weaken tests | KEEP | Followed. Today's re-anchor lap: X11's survivor got a NEW row, nothing was loosened (`handback/p-reanchor-C_2026-10-05.md`). |
| V3 | no test infra → note it, suggest adding | KEEP | unmeasured; generic; no conflict found. |
| V4 | new functionality → tests, primary path + an edge | KEEP | Followed. Every t180 hand-back this week lists new rows, e.g. `p-pieces-ui-A` 12 new tests. |
| V5 | bug → reproduce in a test first, then fix | KEEP | The room's "red on base" is this rule, run every time: dd795e1 red 3/3 on fae3910, 3a2fc11 red 6/6 (my map, 10-05). |
| V6 | test behaviour, not implementation | KEEP | unmeasured; no conflict. |
| V7 | one logical assertion per test | **STALE → reword** | **M3: 29.9%** literal compliance in the keeper's biggest code project. The other 70% are deliberate rows whose names state the behaviour. Read literally, it would split rows that the hand-backs cite by name. |
| V8 | test boundary conditions | KEEP | Followed, e.g. the 6,000 hostile piece files in the D240 look. |
| V9 | real deps over mocks; mock at the boundary | KEEP | Followed: the real core under a fake DOM (`core-xsec.test.js` "A's core): no stub"). |

### Change Scope
| # | rule | tag | evidence |
|---|---|---|---|
| S1 | minimal change | KEEP | unmeasured; no conflict. |
| S2 | no refactor/restyle outside scope | KEEP | unmeasured; no conflict. |
| S3 | no unrequested features/abstractions | KEEP | unmeasured; no conflict. |
| S4 | don't modify unrelated files | KEEP | It agrees with the room's commit rule 1, "name every path" (COMMITTEE amended rule 1). Census R32 is the room's form; this line is the global form. |
| S5 | touching shared code → trace consumers | KEEP | Followed; it is the room's "search every call site" habit (e.g. the `save_piece` `replace` trace in p-pieces-ui-C). |
| S6 | extra changes needed → explain why before making them | KEEP | inferred: "before" reads as "say why", not "stop and ask". It is consistent with `obvious-calls-just-do-them` as long as T1–T4 are reworded. No change. |

### Error Handling & Edge Cases — E1–E5: KEEP (all five)
Unmeasured; generic; no conflict found in any memory or room rule. The room's failures went the other way: memory D239, "a boundary catch must name the ONE error it translates" (my map, 10-05), which E5 already says.

### Existing Patterns — P1–P4: KEEP
Unmeasured; no conflict. P4 ("follow the most recent/prevalent and note the inconsistency") is the room's carrier rule in miniature.

### Dependencies & Imports — D1–D4: KEEP
Unmeasured. D1 ("no new dependency without confirmation") is consistent with `obvious-calls-just-do-them`, which still asks for anything outward or irreversible.

### Safety & Destructive Operations
| # | rule | tag | evidence |
|---|---|---|---|
| X1 | never delete/overwrite user data without confirmation | **KEEP + GATE G2** | Two recorded breaks, both by tools, not intent:<br>• memory `worktree-remove-follows-junctions` (main): `git worktree remove --force` emptied a junction's TARGET and wiped the shared t180 `reads/`;<br>• memory `no-junction-in-handed-worktree` (5bf9d657).<br>A rule cannot see a junction; a hook can. |
| X2 | prefer reversible ops, safeguards | KEEP | Followed: Save moves the old file to `track-backups` (D239). |
| X3 | explain side-effecting commands first | KEEP | Harness-backed: every Bash call carries a description. |
| X4 | no hardcoded secrets | KEEP + feeds **GATE G1** | See SEC2. |

### Search Before Assuming — F1–F3: KEEP
Unmeasured; no conflict. This is the habit the SOURCES gate now enforces for claims.

### Documentation & Research — R1–R4: KEEP
- R1 ("search the web for current docs") is **unmeasured as a rate per library use**. Web calls exist: 153 in Consonance transcripts since 08-01 (M1).
- No cited case of over-doing it, so no change. The plan's rule is that a line "reads old" is not a reason.

### Security Practices
| # | rule | tag | evidence |
|---|---|---|---|
| SEC1 | validate input at boundaries | KEEP | Followed (the piece-file checks, BAD_PIECE_*). |
| SEC2 | never log/display/include sensitive info (credentials, tokens, PII) | **FIGHTS (the PII clause) → reword** | Memory `privacy-means-credentials` (librarian). The keeper, 2026-09-28 23:34, while a seat was scrubbing his pet's death and his grandpa's hospital stay from unpushed history: *"bro i dont care about privacy unless its like my passwords or some shit"*. Read literally, "PII" sent a seat into history rewriting he did not want. Credentials stay in, word for word. |
| SEC3 | parameterised queries | KEEP | unmeasured; generic. |
| SEC4 | fail closed on auth | KEEP | unmeasured; generic. |
| SEC5 | escape output for its context | KEEP | unmeasured; generic. |
| SEC6 | don't weaken TLS/CORS/CSP/auth | KEEP | t180 has a CSP export test (`app/test/export-csp.test.js`). |

### Change Documentation
| # | rule | tag | evidence |
|---|---|---|---|
| C1 | maintain a CHANGELOG.md (Keep a Changelog) in the root | **STALE in scope → reword** | M2: followed in code (t180 0.717, blackbox 10 of 40). In lighthouse it is **0 of 2,623 commits**, and rightly so: the room's maintenance law makes the journal and hand-backs the change record. Read literally on a non-code project, it would add a second record to drift from the first (the "two copies of one rule drift apart" lesson, COMMITTEE.md). Reworded to code projects, not cut. |
| C2 | update it with every meaningful change | KEEP (scoped by C1) | M2. |
| C3 | entries say what and why | KEEP | t180 entries do (e.g. the D239 "Removed" entry). |
| C4 | breaking changes: what's affected, how to roll back | KEEP | The t180 D239 entry ends "To roll back, check out the commit before D239". |
| C5 | update docs with architecture changes | KEEP | Followed (`app/README.md` "Files on disk", D240). |
| C6 | create concise docs where none exist | KEEP | unmeasured; no over-doing case found. |
| C7 | commit messages explain intent | KEEP | 8 of 8 in `git log --oneline -8 20e5711` state the intent (e.g. "a failed part's late answer can no longer be taken by the next job"). |

### Decision Autonomy
| # | rule | tag | evidence |
|---|---|---|---|
| A1 | proceed autonomously in scope and reversible | KEEP | It is `obvious-calls-just-do-them`. |
| A2 | always ask before breaking APIs, removals/renames, schema/stored data, new deps | **KEEP, one clause added** | Consistent with `obvious-calls-just-do-them` ("still ASK when it is irreversible or destructive beyond an approved plan"). The clause added is "unless the user already ordered it". The keeper ordered the Pieces-mode removal (D239) and the D240 schema. Re-asking after a sign-off is the failure memory `feedback_respect_commits` (brain-rot) records: on 2026-06-21, "lets do it" twice, answered both times with smaller scopes. |
| A3 | multiple valid approaches → present options and ask rather than choosing | **FIGHTS → reword** | It conflicts with three things:<br>• `state-judgments-never-ask-permission` (main, 08-03): *"asking launders my uncertainty into his approval"*, the keeper: *"That pisses me off…"*;<br>• `working-norms-from-orchestrator` (valheim-agent, 08-12): the same norm, hand-carried into a second project;<br>• Claude Code's own harness text in this session: *"If you are weighing a choice, give a recommendation, not an exhaustive survey"*, and the AskUserQuestion tool's *"Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default"*.<br>**M1:** 109 permission-question endings, 11.7% → 2.0% → still present. |
| A4 | could affect other teams → flag and ask | KEEP | Rarely applies (solo); no conflict. |

### Task Decomposition — all four FIGHT, all four reworded (not cut: the 602 memory)
| # | rule | tag | evidence |
|---|---|---|---|
| T1 | non-trivial → ask clarifying questions before implementing | **FIGHTS → reword** | It conflicts with:<br>• `obvious-calls-just-do-them`: the install sat 34 minutes on two yeses he would obviously give, *"if its that obvious you just do it i give u permission"*;<br>• `state-judgments-never-ask-permission`;<br>• room rule BUILDING :733 (census R16), "no question is put to the user while a lap is open".<br>**Weighed for his other work:** memory `working-style` (602) says *"always remember to ask me questions during the building process"*, and *"pause at genuine branch points"*. So the reword keeps questions **at genuine branch points that are his**: thesis, format, taste, spend. Cutting it outright would break 602. |
| T2 | multiple independent changes → propose steps and confirm before proceeding | **FIGHTS → reword** | `feedback_respect_commits` (brain-rot): proposing smaller slices after "lets do it" is exactly its recorded failure. The plan still gets SAID; it no longer waits for a second yes. |
| T3 | ambiguous → state assumptions and ask rather than guess | **FIGHTS → reword** | Same three memories. The plan's own rule asks for assumptions to be stated, and that part is kept. The ask is limited to when a wrong guess would be costly or irreversible. |
| T4 | unclear scope → narrowest reading, and ask if more is needed | **FIGHTS → reword** | The trailing "ask if more is needed" IS the "Want me to X?" ending (M1 examples). Reworded to "say what you left out". |

## ADDED (cited, optional for the keeper)
- **"Working with the user"**, two lines. Both live today as **hand-copied memories in four projects**:
  - `dont-offer-rest-assume-momentum` in brain-rot and claude-room;
  - `dont-comment-on-his-sleep` in main;
  - `working-norms-from-orchestrator` in valheim-agent.
- A rule carried by hand from project to project is the carrier problem BOOT's 08-17 amendment names. The global file is the carrier that reaches every project. M1 found 4 rest-offers since 08-01, all in Consonance, so the memories mostly hold. The point of adding it is reach, not rate.

## GATES (each a separate lap after the keeper agrees; none built here)
| gate | hook point | what it refuses | why a gate |
|---|---|---|---|
| **G1 credentials before a push** | `PreToolUse` on Bash/PowerShell whose command matches `git push` | Refuses the push when `git diff @{upstream}..HEAD` ADDS a line matching a key pattern (`sk-ant-`, `vck_`, `ghp_`, `AKIA[0-9A-Z]{16}`, `-----BEGIN [A-Z ]*PRIVATE KEY-----`), naming the file and line. No upstream → diff against the merge base with the default branch. | `push-correct-work-dont-hold` and `privacy-means-credentials` both say "scan before every push". That is a remember-to-ADD rule, the class the census measured at 0.000–0.052 (R07, R09, R10, R37, R39, R40). The breach is outward and irreversible. All projects. |
| **G2 junctions before a delete** | `PreToolUse` on Bash/PowerShell matching `git worktree remove`, `rm -r`, `Remove-Item -Recurse` | Refuses when the target tree contains a reparse point (junction or symlink), naming it, so its target is never emptied through it. | `worktree-remove-follows-junctions` (main): the shared t180 `reads/` was wiped this way. The rule-form ("copy-only worktrees, no junctions") exists in this seat's standing rules and still needed a written memory after the fact. Windows, all projects. |
| **G3 the permission-question ending** (shadow first) | `Stop` hook on the reply's last non-empty line | Matches the M1 pattern `(want me to|should I|shall I|would you like me to|do you want me to)…?$`. In shadow mode it only logs, for a trial week. Then it blocks ONCE with "state the judgment; ask only if the call is the user's", unless the reply also calls `AskUserQuestion` (a real, structured question passes). | M1 measures it: 109 of 2,182, down but not out after a memory. The census says only a gate moves it to 0.94+. **Risk, named:** a legitimate question in prose gets one bounce. Hence shadow first, with a review rule like the reply-slot's (if more than 1 in 3 flagged replies are real questions, back to shadow). |

## Proposed diff of the master (`exo_memory/CLAUDE.global.md`); NOT applied
Each changed line carries its tag and evidence id from the tables above.

```diff
 # Verification & Testing

-- Run the relevant test suite after making changes and before reporting success
+- Run the tests that cover the change before reporting success, in proportion to the risk: targeted tests for small or UI changes; full suites and mutation runs for changes whose bugs are invisible and costly (data formats, geometry, export, core maths) or once at a big landing   # V1 STALE: match-checking-to-risk (keeper 09-29 13:43)
 - When a test fails after your change, fix the implementation — never weaken, remove, or modify existing tests to make them pass unless the test itself is verifiably wrong
 ...
-- Keep tests focused: one logical assertion per test, with clear names that describe the expected behavior
+- Keep tests focused: one behavior per test, with a name that states it (several checks of that one behavior are fine)   # V7 STALE: M3, 497/1,660 literal
 ...
 # Security Practices
 ...
-- Never log, display, or include sensitive information (credentials, tokens, PII) in error messages, logs, or comments
+- Never log, display, or include credentials (passwords, keys, tokens) in code, error messages, logs, comments or commits; other people's personal data in an app's own logs is handled the same way. The user's own personal details in his own notes and repos are his call: do not scrub or rewrite history for them   # SEC2 FIGHTS: privacy-means-credentials (09-28 23:34)
 ...
 # Change Documentation

-- Maintain a `CHANGELOG.md` in the project root using [Keep a Changelog](https://keepachangelog.com/) format with sections: Added, Changed, Fixed, Removed, Security
+- In a code project, maintain a `CHANGELOG.md` in the project root using [Keep a Changelog](https://keepachangelog.com/) format with sections: Added, Changed, Fixed, Removed, Security. Where a project already keeps its change record elsewhere (a journal, hand-backs), use that one and do not start a second   # C1 STALE in scope: M2 (t180 0.717; lighthouse 0/2,623)
 ...
 # Decision Autonomy

 - Proceed autonomously for changes that are directly within the requested scope and easily reversible
-- Always ask before: breaking changes to public APIs or interfaces, removing or renaming existing functionality, changes that affect data schemas or stored data, and adding new external dependencies
+- Always ask before: breaking changes to public APIs or interfaces, removing or renaming existing functionality, changes that affect data schemas or stored data, and adding new external dependencies — unless the user has already ordered that change; then do it, and do not re-propose a smaller scope   # A2: feedback_respect_commits (06-21)
-- When a decision has multiple valid approaches with meaningful trade-offs, present the options and ask rather than choosing silently
+- When a decision has multiple valid approaches with meaningful trade-offs, state the one you would take, why, and what would change your mind; never choose silently, and ask only when the call is genuinely the user's (taste, spend, priorities, anything irreversible)   # A3 FIGHTS: state-judgments-never-ask-permission (08-03); harness text; M1
 ...
 # Task Decomposition

-- For non-trivial tasks, ask clarifying questions about requirements, edge cases, and integration points before implementing
-- When a task involves multiple independent changes, propose breaking it into sequential steps and confirm the approach before proceeding
-- If requirements are ambiguous, state your assumptions explicitly and ask for confirmation rather than guessing
-- When the scope of a request is unclear, implement the narrowest reasonable interpretation and ask if more is needed
+- For non-trivial tasks, ask questions at genuine branch points that are the user's to decide (direction, format, taste, spend, anything irreversible); for the rest, decide, say what you decided, and proceed   # T1 FIGHTS: obvious-calls-just-do-them, state-judgments; kept for 602's working-style
+- When a task involves multiple independent changes, say the order you will do them in and proceed; once the user has said go, do not re-propose smaller slices   # T2 FIGHTS: feedback_respect_commits
+- If requirements are ambiguous, state your assumptions explicitly and proceed on them; ask first only where a wrong guess would be costly or irreversible   # T3 FIGHTS: same three memories
+- When the scope of a request is unclear, implement the narrowest reasonable interpretation and say plainly what you left out; do not end on "want me to…?"   # T4 FIGHTS: M1 (109 endings)
+
+# Working with the user   # ADDED: the same rules hand-copied in brain-rot, claude-room, main and valheim-agent memories
+
+- When you have a view, lead with the judgment and your confidence; do not end a reply with "want me to X?" about work you already have a view on
+- Never offer the user a break, comment on the hour, their sleep or their tiredness, or frame stopping as a win; if they tell you how they are, believe them
```
Unchanged lines (50 of 60) are elided as `...`. After the keeper's line-by-line yes, by the plan:
1. The master is edited first.
2. It is copied to `~/.claude/CLAUDE.md`.
3. `cmp` shows the two are identical.

## Corrections, mine
- My first pass at the assertion count ran in the main t180 checkout, whose working tree is at `4d2e67b` and lacks `core_piece.test.js` and others. It printed zeros for five files. I re-ran it in `c-reanchor-wt` at `20e5711`; only that run's figures are used.
- My first rate script wrote its examples where a relative `require` could not find them. It was a path slip, re-read from the right directory, and no figure changed.

## What this does NOT establish
- **Most KEEP tags are "unmeasured, no conflict found"**, not measured compliance. Measuring each of the 50 would need a rate harness per rule. The plan allows a sample of 10; I sampled only where a check was cheap (C7, M2, M3).
- **M1's pattern is a regex over the last line.** The sampled matches were all real permission questions. Recall is not measured: a question phrased otherwise is missed, so 109 is a floor.
- **The other projects have few transcripts since 08-01** (37 turn-ending replies across all of them). Their weight here comes from their memories, not from rates.
- None of the three gates is built or dry-run. G3's false-positive rate is unknown, which is why it starts in shadow.

## APPLIED (2026-10-06 02:3x, at the keeper's delegation and the librarian's ruling; plan "The keeper's decisions")
1. **Backup, byte-identical:** `cp -p ~/.claude/CLAUDE.md exo_memory/handback/p-claudemd-C_2026-10-06_CLAUDE.md.before` → `cmp` silent
   (BACKUP-IDENTICAL). Pre-edit sha256 `bd243cdf…`, 95 lines.
2. **The master edited first** (`exo_memory/CLAUDE.global.md`), with exactly the proposed diff above minus the `# tag` comments. That is V1,
   V7, SEC2, C1, A2, A3, T1–T4 and the added "Working with the user". CRLF kept (`file`: "with CRLF line terminators"), 100 lines.
3. **Copied:** `cp exo_memory/CLAUDE.global.md ~/.claude/CLAUDE.md` → **`cmp: IDENTICAL`** (both sha256 `792c2843…`, 8,878 bytes),
   re-checked after the commit: IDENTICAL.
4. **Read back against the proposal:** `git diff --no-index <backup> <master>` → **15 insertions, 10 deletions**. Its 15 `+` lines `diff`
   EQUAL to the proposal's 15 `+` lines with the tags stripped ("APPLIED == PROPOSED"). The 10 `−` lines are exactly the 10 reworded rules;
   nothing else in the file changed.
5. **Commit `686955f8`** in lighthouse, `exo_memory/CLAUDE.global.md` only, by named path, seat C in the body. Not pushed. The backup file and
   this hand-back are left for the chair's commit.
- Git warns that the working copy's CRLF "will be replaced by LF the next time Git touches it". inferred: the repo normalises line endings,
  so a future checkout of the master may write LF. The live `~/.claude/CLAUDE.md` is not under git and stays as copied. Anyone re-copying
  later should `cmp` again.
- No gates built (E builds G1/G2; G3 is shadow only).

NEXT: librarian tell the keeper it's live when this is read — plan default: E builds G1/G2 and G3 in shadow
