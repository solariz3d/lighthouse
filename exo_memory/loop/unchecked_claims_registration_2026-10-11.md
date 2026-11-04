# Unchecked claims (Q3) and conduct against a written rule (Q2): the registration (pane B, machine D, 2026-10-11 23:0x, lap D303 part 1, ledger D304)

Sealed before any reader starts. Branch `d303-b` from main `bec8b7b7`. Committed alone.

**What I had read when I wrote this:**
- the plan `loop/plan_unchecked_claims_d303_2026-10-11.md`, except part 2 (A's runbook);
- the D301 plan's SCORE section (`loop/plan_retrieval_misses_d301_2026-10-11.md:60-95`);
- my own D301 reads, A's census units and C's census table. **I have read the census.** My guess (§G) is therefore informed by having seen these units, and it is not a blind prediction. It is sealed so the blind reader can be scored against something written before the read, not to pass as a fresh forecast.

**My stake.** I proposed Q3 ("a check that was not run against live state") in my D301 census read. A large Q3 share would vindicate that pointer.

**For the blind reader (E): read §0–§6 only. Stop at the line "STOP HERE". §G is my guess.**

## 0. The questions, for a reader who has not seen the plan
The room keeps a census of 103 errors made by seats (AI sessions working in this repository). Each error is a W entry recorded as wrong. A previous lap, D301, sorted the ones that were statements by whether the right answer was already written in a repository file that the seat failed to open. That explained about a quarter to a third of the decidable statement errors. This lap asks about two other groups:
- **Q3, unchecked claims.** Of the wrong statements D301 did not explain by a repository file, how many could a check the seat had at hand at the time have caught, and did the seat run it? A check here means a command, a tool, or a plain look at live state.
- **Q2, conduct against a written rule.** Of the census errors that were not statements but conduct (an action, a sequencing choice, a test written wrong), how many broke a rule that was already written down at the time and names that conduct?

## 1. Inputs, frozen
- **Units:** A's census, `handback/p-wcensus-A_2026-10-11_evidence/out/units.json`. sha256 `3e910cb0397c651ba763a653a00e4247e6c6a13895ab90f41342cfa0d499e7e4`. 104 units; 103 once S29 is counted as W042.
- **Each unit carries:** the correction text, the cited paths with their first-commit times, the time of the error **t_err**, and **the sha of the last main commit before t_err**. Where a transcript exists, it also carries the erring seat's transcript location.
- **The D301 classes, as ruled at the D301 score.** These are given here as lists, so the reader need not open the D301 reads.

| D301 class | meaning | units |
|---|---|---|
| NA (41) | not a statement | W001, W004, W005, W008, W009, W013, W015, W017, W024, W025, W027, W031, W037, W040, W043, W046, W048, W052, W055, W057, W061, W063, W065–W071, W072, W074–W077, W081, W083, W093–W095, W098, W099 |
| X (29) | undecidable by git | W002, W003, W006, W010, W011, W012, W014, W016, W018, W019, W020, W021, W022, W028, W029, W032, W034, W035, W038, W059, W062, W082, W084, W088, W090, W092, W096, W100, W101 |
| ND (11) | not found on disk before t_err | W026, W033, W036, W041, W042, W047, W064, W073, W079, W080, W089 |
| UC (7) | computable, not readable | W044, W049, W053, W054, W056, W058, W097 |
| RE (3) | file opened, misread | W023, W086, W087 |
| RM (9) | file not opened | W007, W030, W039, W050, W078, W085, W091, T1, T2 |
| OU (3) | on disk, no transcript | W045, W051, W060 |

- **The Q3 population:** X + ND + UC, **47 units**. RM, RE and OU (15) keep their D301 cause, and Q3 does not re-ask them (§5).
- **The Q2 population:** the 41 NA. Step Q2.1 sorts out the units that are headings or fragments.
- The reader may open:
  - the unit's own fields;
  - the files at the unit's sha (`git show`, `git grep`, `git ls-tree`);
  - the erring turn's tool calls and results in the transcript (tool inputs and outputs only, never prose).
- **Third Place content is never searched or read** (`exo_memory/third_place/`, `**/THIRD_PLACE.md`, and the Third Place's transcripts).

## 2. Q3: definitions, as an ordered procedure; each unit gets exactly one class
**Terms.**
- **The claim** is the wrong statement. **The answer** is the corrected statement.
- **The correction's evidence** is what the correction says showed the claim wrong: a command, a count, a log, a directory, the board, a process list, a re-run.
- **A check** is an action that would have printed the answer, or the data it follows from without further judgement:
  - (a) a command or tool;
  - (b) a plain read of **live state**: the board (`read_board` or `board.jsonl`), a process list, a pane roster or data file, a log, a directory listing, a file's size or modification time, a working-copy diff, or a file in another repository on the same machine.
  - **Not a check for Q3:** opening a repository file that states the answer as text. That is D301's lookup.
  - **Not a check at all:** reading a hook's digest or summary of the state (for example the `[panes]` digest). A summary is a copy, not the state.

**Step Q3.1: was a check available at t_err?** "Available" means both of these hold:
1. **The means existed at the sha before t_err.**
   - A repository tool: `git ls-tree <sha> -- <path>` finds it.
   - A standard command (`ls`, `grep`, `wc`, `git`, `Get-Process`, `Get-WinEvent`, `node -e` over existing files, a CLI the seat already had): always exists.
   - A test or script written **after** t_err does not count, unless a standard command over existing data would print the same answer.
2. **The data existed at t_err and the seat could reach it.**
   - The state or file existed at t_err, on the machine the erring seat ran on, readable without the keeper's help.
   - State on the other machine (laptop vs desktop) is not reachable. Neither is the keeper's unstated intent, nor a measurement whose method did not yet exist.

Decide availability from the correction's evidence. If that evidence is itself a check meeting 1 and 2, a check was available. If the evidence is something made after t_err (a new benchmark, a new test, a keeper's later word, a later run of code changed after t_err), and no standard command over data existing at t_err would print the answer, no check was available.

**Step Q3.2: class.**
- **NC (no check at hand):** Q3.1 fails. The error could only be caught by something that did not yet exist.
- **QX (undecidable):** the correction does not say what showed the claim wrong, and the reader cannot tell from the unit whether a check met Q3.1. QX is listed by id with the reason and counted, never dropped.
- Otherwise a check was available. Decide **run** from the transcript of the erring turn, exactly as in D301:
  - A check was **run** if, in the erring turn and **before the claim was written** (by timestamp), a tool call ran that check, or read that live state, and its printed output included the answer or the data it follows from.
  - A check run after the claim, in the same turn, counts as **not run** for the claim. The claim preceded the check. Flag it `late`.
  - **CN (check available, not run):** a transcript exists and shows no such call before the claim.
  - **CR (check run, still wrong):** a transcript exists and shows the call and its output before the claim. The seat had the answer printed and erred.
  - **CU (check available, run unknown):** no transcript of the erring turn exists, or the erring turn cannot be located.

**Limits of "run", named in advance:**
- It is per turn.
- Injected context and hook digests are not tool calls.
- A check run in an earlier turn counts as not run. This pushes toward CN.
- A correction's self-report ("checked nothing", "before opening the log") is evidence for the reader's note. It is never the class: no transcript means CU.

**For each Q3 unit, record:**
- the check, named as a command or source;
- **its source type:**
  - `board`;
  - `process` (process list or pane state);
  - `fs` (a listing, count, mtime or diff);
  - `log` (a log or event log);
  - `other-repo`;
  - `compute` (arithmetic or a re-run over existing files);
  - `doc` (a vendor or outside document on disk);
- the transcript evidence;
- the `late` flag.

## 3. Q2: definitions, as an ordered procedure; each unit gets exactly one class
**Step Q2.1: is a conduct identifiable?**
- **QN (no conduct identifiable):** the unit is a heading, a fragment, or a count with no content, and names no action the seat took. QN is listed and counted, and kept out of Q2's shares.
- Otherwise, state the conduct in one line: what the seat did, or failed to do.
  - A slip the seat caught before saying anything counts as conduct, when an action is named. Examples: a check written wrong, a fixture that failed.
  - A proposal that was never acted on is not conduct, so it is QN.

**Step Q2.2: is there a rule that names it?**
A **rule that names the conduct** is a sentence which, read alone, says which concrete action is required or forbidden in the unit's situation.
- Example: "the chair does not build while the loop is active".
- Example: "every ring ends on its own `NEXT:` line".
- Example: "commit by named paths, never a bare `git commit`".
- Example: "ask before deleting".
- A general virtue does not count: "verify before claiming", "be careful", "check your work". It names no action for this situation.
- The test: two readers given the rule and the situation would agree that this conduct breaks it.

**The lookup, fixed before it runs (as D301 A2):**
- Write at most 3 literal phrases naming the conduct or its rule, and record them in the table **before searching**.
- Then run:
  `git grep -n -i -F -e '<phrase>' <sha before t_err> -- . ':!exo_memory/third_place' ':!**/THIRD_PLACE.md'`
- Judge each hit with 3 lines either side, against the test above.
- The correction's own file never counts as the rule's source. Nor does anything first committed after t_err.
- Also count a rule the correction itself cites as already existing ("the rule is the LAST line (`BUILDING.md`, b0c13f2)"), if it is found at the sha.

**Outside git.** Rules in seat memory (`~/.claude/projects/*/memory/`), in `~/.consonance/` and in the global `~/.claude/CLAUDE.md` cannot be dated by git.
- The reader may search them with the same phrases.
- A hit there is recorded with its path, never as proof that it existed at t_err.
- A memory the correction says was **written as a result of** this error ("saved to this seat's memory as …") is evidence that it did not exist before.

**Classes:**
- **RF (rule on disk, not followed):** a rule that names the conduct is found at the sha before t_err. Record its path:line and its **place**:
  - `brief` (`consonance/src-tauri/brief/`);
  - `claude` (a tracked CLAUDE.md or shell file);
  - `card`;
  - `plan` (a plan, packet or handoff addressed to the seat);
  - `map`;
  - `other`.
- **RX (rule possibly on disk, undatable):** no rule is found in git, but one that names the conduct is found outside git, and nothing shows it was written after t_err.
- **RN (no rule on disk):** neither.

## 4. The shares and the bars
### Q3
- **Dq** = CN + CR + CU + NC.
- **Unchecked share as a band:** low = CN / Dq; high = (CN + CU) / Dq.
- QX is reported beside it: QX / 47.

| outcome | reading | what changes next |
|---|---|---|
| high < 20% | unchecked claims are not a main cause | no build for checks; the next lap goes to the largest cause in the joint table (§5) |
| low ≥ 40% | claiming before checking is a main cause | if one source type holds ≥ half of CN + CU, the next build is a direct probe for that source, put where the claim is made (a real read of that state replacing the digest the seat relied on); if none holds half, the habit is the cause, the room's existing `checked:` / `inferred:` rule is not working for state claims, and the next step is enforcement at the point of claim, not another rule |
| 20% ≤ low and high < 40% | a real contributor, not the main one | a probe for the single most common source type only; re-measure on A's frozen top-up pool before anything broader |
| band straddles 20% or 40% | undecided on this sample | find the CU units' turns, then re-score |

**Beside any outcome:** if CR ≥ a quarter of the units where the check ran or not (CN + CR), "ran it and misread the output" is a shape of its own, and it goes in the next lap's notes.

### Q2
- **D2** = RF + RX + RN.
- **Rule-on-disk share as a band:** low = RF / D2; high = (RF + RX) / D2.
- QN is reported beside it.

| outcome | reading | what changes next |
|---|---|---|
| high < 20% | conduct errors mostly happen where no rule was written | writing a rule after each error is the right habit; no enforcement build |
| low ≥ 40% | rules exist and do not stop the conduct | writing more rules will not help. Read the RF places: if ≥ half are in `brief` or `claude` (text the seat carries), the next build moves the most-broken rule from text into a gate or check; if ≥ half are in `plan`, `map` or `other` (text the seat may never load), the next step is carrying, not enforcing |
| 20% ≤ low and high < 40% | a real contributor | enforce only the single most-broken rule; re-measure |
| band straddles 20% or 40% | undecided | date the RX rules where any outside evidence allows, then re-score |

## 5. The joint table: one cause per unit, no double counting
Every one of the 103 units gets exactly one row, chosen by this precedence:

| order | units | cause row |
|---|---|---|
| 1 | D301 RM | **missed lookup** (the answer was in a repository file the seat did not open) |
| 1 | D301 RE | **read and misread** (the file was opened) |
| 1 | D301 OU | **on disk, unobserved** |
| 2 | Q3 CN | **check at hand, not run** |
| 2 | Q3 CR | **check run, misread** |
| 2 | Q3 CU | **check at hand, run unknown** |
| 2 | Q3 NC | **nothing at hand (new information)** |
| 2 | Q3 QX | **claim, cause undecidable** |
| 3 | Q2 RF | **rule on disk, not followed** |
| 3 | Q2 RX | **rule maybe on disk, undatable** |
| 3 | Q2 RN | **conduct, no rule on disk** |
| 3 | Q2 QN | **not identifiable** |

- D301's RM, RE and OU are not re-asked in Q3, so a unit is never both a missed lookup and an unrun check.
- Every claim unit is in order 1 or 2, and every NA unit in order 3, so the rows sum to 103. The scorer checks this sum.
- **Shares in the joint table** are over the decided rows: everything except CU, OU, QX, RX and QN. Those are reported as counts beside the table, the way D301 reported OU and X.
- **"Where the next build goes"** is the largest decided row. If the two largest are within 2 units of each other, it is a tie, and both are named.
- Seeded units T1 and T2 are D301 RMs, so they enter neither Q3 nor Q2. D301's §4 has nothing to check here.

## 6. Degenerate-test conditions
A question is reported **NOT MEASURED**, as a list of counts and not as a share, if any of these holds for it:
1. **Too few placed:**
   - Q3: Dq < 20, or QX + CU > 24 (half of 47).
   - Q2: D2 < 12, or RX > half of D2.
2. **The definition cannot fail.**
   - Q3: if NC + CR < 3, "a check was available and not run" was close to true by definition: live state is nearly always readable, so availability did no work. Q3 is reported as a count, not scored against the bar.
   - Q2: if RF > 90% of D2 and every RF hit comes from one rule text, one broad sentence did the deciding. Q2 is reported with that sentence named, not scored.
3. **One step made it:** more than 80% of a question's decided units decided at one step of §2 or §3 by one rule. Example: every CN decided only by "a standard command always exists".
4. **The definitions are not decidable in practice:** C, reading E's table as non-author, disagrees on more than 20% of a question's units (Q3 over 47, Q2 over 41).

**STOP HERE** (the blind reader reads no further).

---

## §G. My guess, sealed (B; informed by having read the census, see the header)
- **Q3 (over 47):**
  - CN about 26–32; CU 5–8; CR 3–5; NC 8–11; QX 2–4.
  - **The low end is ≥ 40%, around 55–65%.** Most of the 19 "answer outside git" X units become CN or CU, and most UC become CN.
  - The most common source type is `process` (pane and roster state, the digest-taken-for-the-machine family), then `fs` and `board`. No type holds half, so the "habit, not source" row applies.
  - The four laptop-era NDs (W064, W073, W079, W080) land in CN or CU, because their answers were on the seat's own working tree.
- **Q2 (over 41):**
  - QN about 20–23 (the headings and fragments).
  - Of the identifiable conduct (about 18–21): RF 6–9, RX 1–3, RN 8–11.
  - **The band is about 35–50%, straddling 40%.**
  - Expected RF include the ring-NEXT rule, the named-paths commit rule after 2026-08-26 (W061, W072), and the chair-does-not-build rule for errors after 09-16.
  - Expected RN include the never-hand-the-keeper-a-command and keeper-is-not-a-labeler memories, each written as a result of its error (W005, W040).
- **The joint table:** "check at hand, not run" is the largest decided row, larger than "missed lookup" (9).
- **What would show me wrong:**
  - Q3's high end < 40%;
  - NC ≥ 15;
  - Q2's high end < 25%;
  - "missed lookup" or "conduct, no rule" being the largest row.

NEXT: E reads the census blind against §0–§6 and stops at STOP HERE, when this is committed
