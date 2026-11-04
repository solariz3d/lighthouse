# D301 blind read: the table (pane C, sibling-0845a868, 2026-10-11, ledger D302)

Sealed definitions: `loop/retrieval_miss_registration_2026-10-11.md` §0–§3 only (§4–§6 NOT read when this was committed).
Units: `handback/p-misssample-A_2026-10-11_evidence/out/units.json`, checked: `sha256sum` → `07b840c05eb21d34595c47227d4fc40b96eba101efe7bebed8e2944e4738ed65` (= A's digest), 62 units.
Read before classifying: A's hand-back (its Limits section first), B's §0–§3, the units. Nothing else, apart from the git and transcript checks named in the rows.
T1 is read with the librarian's correction (relayed verbatim in the chair's packet): the erring claim is D300's original part 3 (`plan_queue_sweep_d300_2026-10-11.md` at 700128c8), and `plan_clean_up_after_ourselves_2026-10-10.md:97` is the stale carrier.

## Edge rules, settled before row 1 (applied to every row)
- **R1, a claim is a statement.** B §0: "a seat said something, and a later correction showed it wrong"; §2 step 1: NA when "no erring claim can be identified". An error of CONDUCT is NA: an action, a sequencing choice, a test or fixture or script written wrong and caught by running it, a weak assertion caught by a mutant. In each of those the seat stated nothing false. Where the conduct rests on a stated factual premise that the correction names, the premise is the claim.
- **R2, caught before it was said.** A reading corrected inside the seat before it was written or sent ("corrected before writing", "never reached the registration") is NA: no claim left the seat.
- **R3, not a correction.** An item that does not say a claim was wrong (a disclosure, a plan line, an "unchanged" list, a heading with no body) is NA.
- **R4, a command.** A correction cites a command if it quotes one or names a tool or test run as its evidence.
- **R5, t_err.** Taken from the claim-located transcript hit when that hit is not after the correction line; otherwise from the time the correction text states. When neither exists and the claim has no line of its own, t_err is not located; neither step 3 test can then run, and the unit is X ("t_err not located").
- **R6, opened (step 4).** B's definition, in the erring turn only: a Read of the path, a shell command naming it, or a search whose printed output includes part of it. A's `opened_*` fields count Reads only, so for every unit that reaches step 4 I scanned that turn's tool calls and results with `turn.js`, which prints tool inputs and results that match, never prose.
- **R7, ambiguous refs.** A bare `main.rs` in a Consonance correction resolves to `consonance/src-tauri/src/main.rs`; used once (S01).

## The table
Class: NA, X, ND, UC, RE, RM, OU. The "deciding field" names what decided it.

| unit | class | deciding field(s) and reason | answer's directory (misses) | stale carrier |
|---|---|---|---|---|
| S01 | **RM** | claim (transcript, librarian 2026-09-16T15:31:09Z, not after the correction line): "fills the window before I open a file". Answer: the intake cap `const SHELL_SOFT_CEILING: usize = 140_000` (ref `main.rs:4202`, R7), present at t_err: checked: `git show d5d954d3:consonance/src-tauri/src/main.rs \| grep SHELL_SOFT_CEILING` → `:4211 const SHELL_SOFT_CEILING: usize = 140_000;`. Opened: checked: `turn.js` on the 15:30:54Z turn → 0 tool calls. | `consonance/src-tauri/src/` | none (nothing opened) |
| S02 | NA | R1: building before routing (conduct) | | |
| S03 | NA | R1: a destructive misreading of the keeper's word (conduct) | | |
| S04 | NA | the erring premise is the keeper's ("why didn't the orch dispatch"); erring party not a seat | | |
| S05 | NA | R1: a keeper goal filed "in no order" (conduct); the COMMITTEE.md item is a finding, not a correction | | |
| S06 | NA | R1: sequencing (conduct) | | |
| S07 | NA | R1: handing the keeper a labelling sheet (conduct) | | |
| S08 | NA | R1: landing orders that named files to edit (conduct) | | |
| S09 | NA | R1: handing the keeper a git command (conduct) | | |
| S10 | NA | R1: queueing T1 behind D164 (conduct; no stated premise) | | |
| S11 | NA | R1: a method choice, "summarised the result instead of questioning the method" | | |
| S12 | **X** | claim "the route works anyway because the MCP tool instructions name `call_librarian`"; the correction (whether a pane uses it is unmeasured) cites no path and no command | | |
| S13 | NA | R1: a weak test assertion caught by a mutant | | |
| S14 | NA | R1+R2: a test draft caught before the mutants ran | | |
| S15 | NA | R3: an unexplained event, not a correction | | |
| S16 | **UC** | claim (transcript, B 2026-10-08T23:28:29Z): "passes alone, red in the suite" (= flaky). Correction: a cwd difference; its evidence is a run (R4: js-suite runs each file from its own folder, the build test run from each directory) on code that existed at t_err (the claim was itself about running that test). It cites no path holding the answer as text. | | |
| S17 | NA | R1: a fixture red for the wrong reason | | |
| S18 | NA | R1: a mutant replacement and a script defect | | |
| S19 | NA | R1: a weak test caught by a mutant | | |
| S20 | NA | R1: a vacuous regex caught by an assertion | | |
| S21 | NA | R1: a checker parse bug | | |
| S22 | NA | R1: a tool (portable-paths) caught a committed path; no statement | | |
| S23 | NA | R1: a declined proposal to write an absolute path (a proposal, not a factual claim). Borderline: if the proposal is read as a claim ("this path is fine there"), the evidence is a portable-paths run → UC candidate. | | |
| S24 | NA | R1: a test with the wrong instrument | | |
| S25 | NA | the corrected statement is the keeper's ("we are closer to closing diversity collapse"); the prior-art line names a gap, not a stated claim. Borderline: read as a novelty claim by the Third Place, its answer (`cycle9_armA_result.md:13`, line 2026-07-28) was on disk; no Third Place transcript is scanned (and none may be read) → OU. | | |
| S26 | **X** | claim "no hook reaches composition"; the correction cites no path and no command | | |
| S27 | **X** | claim: the chair scored `CLEAN.md:5` as a nonexistent file. Cites `librarian/2026-09-06.md` (~02:27, a librarian day log landed in batches) and untracked `CLEAN.md`; R5: the chair's scoring turn is not located, so t_err is unknown and step 3 cannot run | | |
| S28 | **X** | a fragment: the chair looked at a target path that had moved; the only cited path (`handoff_chair_2026-09-02.md`) is the record of the self-catch; R5: t_err not located | | |
| S29 | **X** | claim (transcript, librarian 2026-10-07T07:42:54Z): relayed "Onuris is the friend's private project". The correction ("a public community track; D262 cancelled") cites no path (`mutation.test.js` belongs to the item's second, conduct half). Bias case, see the hand-back: the answer sat uncited in `map/A.md:1815`. | | |
| S30 | NA | R1: a URL rewrite in code, revised | | |
| S31 | NA | R3: shelf additions, not a correction | | |
| S32 | **X** | claim (transcript, librarian 2026-10-10T15:43:52Z): "B hasn't started its half". The answer's evidence, `board.jsonl:150038` and `verify/B` claims.json, is outside git (no first-commit time) | | |
| S33 | NA | "I garbled a T1 count": the count is not given, so no erring claim can be identified | | |
| S34 | NA | R3: the item confirms the design line ("parity tests live on the room side") and adds a consequence; it does not say the claim was wrong | | |
| S35 | NA | R1: escape-layer defects in scripts and a file | | |
| S36 | NA | R3: an observation (python not on PATH), not a correction | | |
| S37 | NA | R1: an invented fixture | | |
| S38 | NA | the false sentence is the app's printed note (code output), fixed in code | | |
| S39 | NA | R2: a suspicion about A's test, settled by a rerun before any claim | | |
| S40 | NA | R1+R2: void runs from shell mistakes; the "vanished file" reading was checked with `ls` in the same turn | | |
| S41 | NA | R3: a disclosure (diffs applied in the landing seat) | | |
| S42 | **X** | claim: the librarian's 08:57 entry "two 600-s waits" (the transcript hit is after the correction line, so R5 takes 08:57 local). The answer came from `persist.log` (outside git, no first-commit time); the other cited source, A's hand-back, was committed 10:01 local, after t_err | | |
| S43 | NA | R3: acceptance lines, not a correction | | |
| S44 | NA | R1: a method gap (no specificity check) | | |
| S45 | **X** | claim "§6's '0 escapes'"; the unit's text is the heading only, and it cites a commit (`371875f`), no path; the answer's content is not in the unit | | |
| S46 | NA | R1+R2: fixture writes failed before any reading | | |
| S47 | NA | R3: a disclosure (the js-suite was not run) | | |
| S48 | NA | R3: a plan line | | |
| S49 | **X** | claim: the registration's §4 sentence (`:175`) on comparability. The registration's path is not given, so t_err (when `:175` was written) is not located (R5); the evidence is a sha256 run over `cells/*/handoff.js`, whose dates against t_err cannot be compared | | |
| S50 | NA | R3: a test description, not a correction | | |
| S51 | NA | R3: an "unchanged" list | | |
| S52 | NA | R1: time spent on a render (conduct) | | |
| S53 | NA | R1+R2: `node -e` escaping; no number came from it | | |
| S54 | NA | R1+R2: a loose regex; "the looser numbers never reached the registration" | | |
| S55 | NA | the wrong value is a tool's recorded hash (`sourcesSha`); the item explains the mechanism. Erring party not a seat | | |
| S56 | NA | R2+R3: a heading, "a correction … made before it reached a test title" | | |
| S57 | NA | R2: "corrected before writing" | | |
| S58 | **X** | claim (transcript, C 2026-09-28T06:36:34Z): "the process that died is node/V8 itself". The correction rests on a "machine-wide picture" (event logs); the item cites no path and no command | | |
| S59 | NA | R1: a timeout cut runs short; re-run | | |
| S60 | NA | R1+R2: a path form threw ENOENT; "no wrong figure resulted" | | |
| T1 | **RM** + stale | claim: D300's original part 3, in `plan_queue_sweep_d300_2026-10-11.md`, first committed 700128c8 (2026-10-11T20:37:00Z); erring turn 20:36:24–20:37:15Z (librarian). Answer `handback/p-heavyrunmut-B_2026-10-11.md`: first commit b8b52bbd 08:38:13Z; text present: checked: `git show 700128c8^:…p-heavyrunmut-B_2026-10-11.md` → ":10 ## #16 … now fixed", ":20 ## #30 … now pinned". Opened: checked: `turn.js` with heavyrunmut/d289/594b05e2/ccdfb587 → nothing names it. (The librarian had Read it at 08:19:58Z, a different turn: the per-turn bias, pushing to RM.) | `exo_memory/handback/` | **`exo_memory/loop/plan_clean_up_after_ourselves_2026-10-10.md:97`**: the erring turn's own grep (20:36:36Z) printed line 97 ("the two pre-existing heavy-run mutant survivors (#16, #30)"), so it was opened by B's definition (a search whose output included part of the file) |
| T2 | **RM** | claim `handback/p-soakclean-E_2026-10-11.md:109` (E, written in the turn at 23:52:56Z): the four `Chases_*` reads "left out by the standing rule". Answer `map/A.md:1815` (D262 CANCELLED: Onuris is a public community track): line time 2026-10-07T04:19Z, before t_err, and outside the 24 h batch window; text present: checked: `git show 83188cb1:exo_memory/map/A.md` → `:1815 … Onuris (Chases_Onuris) is a public community track`. Opened: checked: `turn.js` on 23:52:08–00:48:39Z → 3 Bash, 2 Read (both E's own hand-back), no call names map/A.md; the "onuris"/"chases" hits are only an ENOENT error from E's own test run. | `exo_memory/map/` | none by B's rule: the turn opened no file stating the old rule. Its Reads of E's own hand-back did not print "Chases". Where the rule came from is not visible in the turn (A's limit: injected context is not a tool call). |

## Counts
| | all 62 | drawn 60 (without T1, T2) |
|---|---:|---:|
| NA | 48 | 48 |
| X | 10 | 10 |
| ND | 0 | 0 |
| UC | 1 (S16) | 1 |
| RE | 0 | 0 |
| RM | 3 (S01, T1, T2) | 1 (S01) |
| OU | 0 | 0 |
| stale flag (within RM/RE/OU) | 1 (T1) | 0 |

## Shares, by §3's formula
- D = ND + UC + RE + RM + OU: **62 → 4; drawn 60 → 2.**
- Miss band, low = RM/D, high = (RM+OU)/D: **62 → 3/4 = 75% to 75%; drawn 60 → 1/2 = 50% to 50%.**
- X share = X / (units − NA). §3 writes 60 − NA, and for 62 I use 62 − NA: **62 → 10/14 = 71%; drawn 60 → 10/12 = 83%.**
- Where the RM + OU answers lived: 62 → `consonance/src-tauri/src/` 1, `exo_memory/handback/` 1, `exo_memory/map/` 1, so no directory holds half; drawn 60 → `consonance/src-tauri/src/` 1 of 1.
- Stale flag on RM: 62 → 1 of 3; drawn 60 → 0 of 1.
- Undecidable counted, not dropped: 10 X, listed above with reasons.
