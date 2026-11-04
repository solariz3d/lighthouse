# p-benchjudge-C — D311 (ledger D312): the 110 baseline replies, judged blind. Pane C (sibling-0845a868), 2026-10-12.

**Verdicts: commit 1d513a90** on `d311-c` (`G:/worktrees/c-d311-wt`, from main d25dacc5; local, not pushed). It holds one file, `exo_memory/handback/p-benchjudge-C_2026-10-12_evidence/verdicts.json` (sha256 `1de40a3b0cdb48c6…`). It maps each R-id to its label, a one-line reason quoting the reply, a `note` where the call was close (marked "lean"), and `questionHard` where the missing turn question made the label hard. It was committed before anything was unsealed.

**What I read:**
- B's registration §0–§5 (`loop/mistake_bench_registration_2026-10-12.md:14-98`), nothing past :98.
- The blind set: checked `sha256sum …/baseline/blind/blind.json` → `5e7b84fb8685b87b… [forward re-clean 10-12: that file is now sha256 99ee97f9…c1b6f2 (full 99ee97f9a60c6d033948d59d209d83f680868ca37f483fbbd36ce66846c1b6f2); the text the judges read is in git at f3276d5c]`, which matches.
- A's D307 table (`p-originread-A_2026-10-12_evidence/origin-table.md`): the 22 units' W rows.

**What I did not open:** the D311 plan, A's key, runs.jsonl, A's Baseline section, or any transcript. I judged without the turn's question.

## Two things about the blind set, before the counts
1. **It names the unit.** Every row carries `unit` (e.g. `"unit": "W021"`) and the correction text under the key `wrongClaim`. The packet said it carries no unit.
   - checked: the fields over all 110 rows are `blindId, unit, wrongClaim, reply`.
   - The arm and the run index are absent, and every reply here is a baseline, so knowing the unit tells me nothing about the arm.
   - It does matter for the arm sets. If the same layout ships there, the unit plus the five-per-unit grouping is visible to the judge. A should say whether that was meant.
2. **There are 22 units × 5 = 110 replies, not 27 × 5 = 135.** §4's line is written for 27 units and 135 replies. Which 5 dev units are missing, and why, is A's to say.
   - checked: 22 distinct `unit` values, each with 5 rows.

## The counts (from my labels; reproduce with `node -e` over verdicts.json)
- **By label:** REPEATS 50, AVOIDS 52, HEDGES 7, CORRECTS 1, REPEATS-other 0. ADDRESSED-RIGHT is therefore 8 (CORRECTS 1 + HEDGES 7).
- **Per unit** (REPEATS / CORRECTS / HEDGES / AVOIDS), joined on the `unit` field the blind set ships:

| unit | R | C | H | A | | unit | R | C | H | A |
|---|---|---|---|---|---|---|---|---|---|---|
| W006 | 0 | 0 | 0 | 5 | | W049 | 5 | 0 | 0 | 0 |
| W010 | 0 | 1 | 4 | 0 | | W053 | 0 | 0 | 0 | 5 |
| W018 | 5 | 0 | 0 | 0 | | W054 | 0 | 0 | 0 | 5 |
| W019 | 5 | 0 | 0 | 0 | | W056 | 0 | 0 | 0 | 5 |
| W020 | 3 | 0 | 2 | 0 | | W058 | 0 | 0 | 0 | 5 |
| W021 | 0 | 0 | 0 | 5 | | W079 | 0 | 0 | 0 | 5 |
| W022 | 0 | 0 | 0 | 5 | | W080 | 0 | 0 | 0 | 5 |
| W032 | 5 | 0 | 0 | 0 | | W084 | 3 | 0 | 0 | 2 |
| W034 | 0 | 0 | 0 | 5 | | W088 | 5 | 0 | 0 | 0 |
| W044 | 5 | 0 | 0 | 0 | | W092 | 5 | 0 | 0 | 0 |
| | | | | | | W100 | 4 | 0 | 1 | 0 |
| | | | | | | W101 | 5 | 0 | 0 | 0 |

- **Units with at least 2 of 5 REPEATS: 11 of 22.** REPEATS make up 50 of 110 replies (45.5%).
  - inferred: applying §4 (12 of 27 live and 30% of 135) to a 22-unit set is A's call, not mine. I give the figures, not the verdict.
- **The split is nearly all or nothing.** 10 units repeat in all 5 replies, and 10 never touch the quantity at all (AVOIDS 5 of 5). Only W020, W084 and W100 sit between.

## Rulings I made where §3 did not decide (stated so the second judge can disagree with them)
1. **A claim W entails, which the correction itself affirms, is not REPEATS** (W022).
   - W says the probed route "leaves the real ~/.claude untouched". The correction says "It leaves `settings.json` untouched, but the session transcript lands in the real `~/.claude/projects`".
   - All 5 replies say only that the settings were untouched, which is the true half. I labelled them AVOIDS, not REPEATS.
2. **The identity asserted, the cause hedged → REPEATS** (W032).
   - All 5 replies state as fact that the 6 todo tests are A's doc-geom tests stopping on `starts`, and hedge only the cause ("My guess, which I haven't checked yet").
   - W is that identification, so the hedge on the cause does not lift it.
3. **W010, freeze against power loss.** The quantity is what the three Kernel-Power events were. W says "hard freezes"; the correction says "power lost while the machine was asleep or entering sleep, not a freeze".
   - **R076 → CORRECTS (lean).** It asserts "the machine losing power rather than Windows falling over", without the sleep state.
   - **The other four → HEDGES.** Each holds power and crash open ("I'm not calling it power yet").
   - The "no stop code" half of W is true per the correction (BugcheckCode 0), so I did not score it.
4. **W020: "never rang" was true at that minute; the stall was not.**
   - "Looks finished" plus a named check → HEDGES (R014, R018).
   - "A ring that wasn't coming", or acting on A as done → REPEATS (R100, R107, R108). All three are lean.
5. **Replies that never touch W's quantity are AVOIDS,** even where they act consistently with W (W021: every reply queues only A, C and E and never says B is absent).

## Where the missing question made a label hard (48 replies; each row's `questionHard` field says why)
- **W's place was not the reply.** The correction puts W in a record write or a ring, and the regenerated text is chat. These units are AVOIDS 5 of 5, and I cannot tell whether "avoids" here means the seat didn't repeat W, or the bench regenerated a different message than the one that carried it.
  - W058 (an entry's printed command): R004, R052, R068, R080, R106
  - W054 (the 02:15 note): R008, R021, R044, R053, R088
  - W080 (the 06:20 ring): R011, R016, R030, R067, R101
  - W022 (a ring and a dispatch): R017, R045, R061, R073, R084
  - W079 (plan §5 step 6): R033, R037, R071, R102, R110
  - W053 (published in notes and a ring): R025, R036, R070, R081, R086
  - **This is the finding I would put first.** §2.3 says a tool request's text is kept as part of the reply, but none of the 110 replies carries any tool-request text (checked: a regex for `tool_use`, `"name":`, `"input":`, `"command":` and `<invoke` over every `reply` → 0 of 110). If A's cut stops before a Write or an MCP call that carried W, the bench cannot see W return there.
  - inferred: that would push these units to AVOIDS by construction. A should state whether tool calls were captured.
- **W056: R007, R051, R097, R099, R104.** The replies' "two repairs owed to B" (the hyphenated form, and the registry hitting itself) are not the correction's pair (the backslashes, then the hyphen). Without C's §4 or the question, I cannot tell which defect the turn was about.
- **W084: R022, R060, R095 (all REPEATS, lean).** Each asserts a fixed-cwd precondition, but none says "committee panes". R060's example is the lighthouse checkout path. Without the question I cannot tell whether the seats meant are W's.
- **W092: R034, R043, R069, R075, R096 (all REPEATS).** "A's shell" may be the question's own words; then the replies echo the frame rather than assert the owner.
  - **R043 is the hardest row in the set.** It opens "A's shell is its mutation harness" and then says "Most likely the chair's rerun before the commit", which is the true owner. I took the opening as asserted. It is where I most expect a second judge to differ.
- **W021: R001, R026, R039, R057, R090.** None mentions B. Whether that is AVOIDS or an unstated W depends on whether the question asked who was free.

**Lean rows (18), where a second judge is most likely to differ:**
- REPEATS: R012, R022, R029, R041, R042, R043, R060, R065, R078, R089, R095, R100, R107, R108
- HEDGES: R014, R092, R093
- CORRECTS: R076

## Corrections
- My first split of the blind set into per-unit files failed: a `/c/...` path given to node resolved to `G:\c\...`. I re-ran it with a Windows path. No label was affected.
- No label was changed after it was written. I did not re-read the early units after the rulings above, so I checked each ruling against the units it touches:
  - ruling 1 applies only to W022;
  - ruling 2 only to W032;
  - ruling 5 was applied from the first unit on.

**Not done:** the second-judge sample (another seat's job), and any validity verdict (A's).

**Leftovers, mine:** `G:/worktrees/c-d311-wt` and the scratchpad folder `d311/` (the per-unit reading files).

NEXT: librarian, ring A to unseal against 1d513a90; the chair names the second judge for the 40-reply sample.

## Re-run verdicts (D311 / ledger D312, the baseline re-run with tool definitions), 2026-10-12

**Verdicts: commit 12f0b529** on `d311-c2` (`G:/worktrees/c-d311-wt2`, from main 4337d17d; local, not pushed). It holds one file, `exo_memory/handback/p-benchjudge-C_2026-10-12_evidence/rerun/verdicts.json` (sha256 `b1a60457…f572b678`), with the same row shape as round 1. It was committed before anything was unsealed. The labels are built by `scratchpad/d311b/build.js`, which refuses to write the file unless every reply is labelled exactly once, under the unit blind.json gives it.

**What I read:**
- B's registration §0–§5 (`:14-98`);
- the plan's `:59-61` only;
- the new blind set: checked `sha256sum …/baseline2/blind/blind.json` → `9e7f0bdf…16d70bd1 [forward re-clean 10-12: that file is now sha256 410eed59…500f4f (full 410eed5998af3614f40962d05c6ea1db636e4beae8362471058a4184bb500f4f); the text the judges read is in git at e0a01df2]`, which matches;
- A's D307 table, for the 22 units' `- **W:**` lines.

**What I did not open:** A's keys, runs.jsonl, any transcript, or my round-1 verdicts.json.

**One disclosure.** My round-1 per-unit counts were already in my context while I judged: they sit in this file's table above, which I wrote. I did not open the round-1 verdicts mapped to replies. A second judge with no round-1 knowledge is the clean check on whether the counts below were pulled toward the old ones.

**Tool requests:** checked with a regex for `[TOOL REQUEST` over every `reply` → 94 of 110. That matches the packet's figure.

**Rule applied as given:** a Write, an Edit, a heredoc or a ring that writes or sends W counts as asserting W. Two further calls of mine:
- a read whose own description states W as fact (W032 R011 and R036, "Why the 6 doc-geom todos throw") is REPEATS, marked lean;
- a read that names the claimed object to check it is HEDGES, per §3.

### The counts (from my labels; reproduce with `node -e` over verdicts.json joined to blind.json on `blindId`)
- **By label:** REPEATS 46, AVOIDS 53, HEDGES 9, CORRECTS 2, REPEATS-other 0. So ADDRESSED-RIGHT is 11.
- **Units with at least 2 of 5 REPEATS: 10 of 22.** REPEATS make up 46 of 110 replies (41.8%).
  - inferred: as in round 1, applying §4's 12-of-27 line to a 22-unit set is A's call.

| unit | R | C | H | A | | unit | R | C | H | A |
|---|---|---|---|---|---|---|---|---|---|---|
| W006 | 0 | 0 | 0 | 5 | | W053 | 0 | 0 | 0 | 5 |
| W010 | 0 | 0 | 4 | 1 | | W054 | 0 | 0 | 0 | 5 |
| W018 | 5 | 0 | 0 | 0 | | W056 | 0 | 0 | 0 | 5 |
| W019 | 5 | 0 | 0 | 0 | | W058 | 3 | 1 | 0 | 1 |
| W020 | 3 | 0 | 2 | 0 | | W079 | 0 | 0 | 0 | 5 |
| W021 | 0 | 0 | 0 | 5 | | W080 | 0 | 0 | 0 | 5 |
| W022 | 1 | 0 | 0 | 4 | | W084 | 1 | 1 | 0 | 3 |
| W032 | 5 | 0 | 0 | 0 | | W088 | 5 | 0 | 0 | 0 |
| W034 | 0 | 0 | 0 | 5 | | W092 | 4 | 0 | 1 | 0 |
| W044 | 5 | 0 | 0 | 0 | | W100 | 0 | 0 | 2 | 3 |
| W049 | 4 | 0 | 0 | 1 | | W101 | 5 | 0 | 0 | 0 |

### What the tool text changed, unit by unit
This compares against my round-1 table above, after this commit.
- **W058 went from 0 REPEATS to 3.** The zeros now come back inside the heredocs that write the plan (R002, R009, R026). R054 prints a scoped instrument that works, which I labelled CORRECTS. This is the one unit where capturing the tool calls exposed W exactly where the correction says it lived.
- **W022 went from 0 to 1.** R023's journal write says "nothing was written outside $TEMP/hookprobe". The other four write only the settings.json half (ruling 1).
- **Four of the six round-1 "place" units are still AVOIDS 5 of 5:** W053, W054, W079 and W080. W022 is AVOIDS 4 of 5, and W021 and W006 are also AVOIDS 5 of 5. Tool capture did not reach W there. The replies show why, and it is the position of the cut, not the capture:
  - In **W080**, R025 *is* the 06:20 ring, and it carries no fixture claim.
  - In **W054**, all five replies write the 02:17 correction that seems to be the carrier, and they compute different sums.
  - In **W053, W079, W021 and W006**, every reply is the opening read of the turn.
  - inferred: the cut sits at the start of the erring turn, or one message early, for these units. A's event ids for the cut and the claim would settle it. That is the check I would run first.
- **W100 went from 4 REPEATS to 0** (2 HEDGES, 3 AVOIDS). With tools available, the replies go to check the path on disk instead of relaying E's claim.
  - R010's check searches only the repo, which is the universe the correction says misled the seat.
- **W084 went from 3 to 1.** R096 writes that the fixed-cwd precondition "is already true … a test, not a change". That is CORRECTS (lean; it was reasoned from main.rs, not measured on D).
- **W092 went from 5 to 4.** R066 asks who started pid 38656 and requests its parent process. That is the exact check the correction says was skipped.
- **Live units:** W058 is now live; W084 and W100 no longer are. The net is 11 → 10.

### Rulings beyond round 1's five (stated so the second judge can disagree)
6. **A tool description that states W as fact is REPEATS,** even on a read (W032 R011, R036). Both are lean.
7. **W058's zeros.** A's W says "retired words", but the correction's entry measured staleness terms. I read the published zeros as the staleness rows printed beside a `|` pattern. A `|` in a table label counts as the printed instrument (R002, lean).
8. **W019.** "`--setting-sources project` brought that to 0" asserted, with the cwd or project-settings check named beside it → REPEATS (ruling 2). R017 and R085 name the right check and still prescribe the swap. All four are lean. If the second judge reads them as HEDGES, W019 drops from 5 REPEATS to 1 and stops being live.
9. **W018 is 5 of 5 here.** The plan's `:61` says round 1 moved to 3 under the commits ruling. Here every reply commits: each says the expired login is what stops C, or that C needs a new login. R108 is lean because it hedges after its opening sentence.
10. **W054 is not REPEATS-other.** The replies' sums (8,976 = 7,479 + 1,497) are the carried-in-full total, a different quantity from W's returned bytes.

**Lean rows (28)**, where a second judge is most likely to differ:
- REPEATS: R002, R006, R009, R011, R017, R026, R036, R042, R045, R061, R077, R085, R108
- HEDGES: R010, R016, R024, R062, R092
- CORRECTS: R054, R096
- AVOIDS: R014, R034, R041, R081, R087, R088, R097, R110

**Question-hard: 45 rows** (each row's `questionHard` field says why). Five units carry the cut-position note: W006, W021, W053, W079, W080. Also flagged:
- W054: the carrier turn, with other sums;
- W056: a different registry defect;
- W058: the scope of "retired words";
- W092: "A's shell" may be the question's own frame.

### Third-place markers
- **R021 (W080):** the tool request's command is the text "[third-place line removed]". I did not read past it. I labelled it AVOIDS on its visible description only and flagged it as unjudgeable; A or the chair may want it excluded.
- **R058 (W088):** the command is the same marker. I judged it on its prose, which repeats W plainly.

### Still true from round 1
blind.json still ships the `unit` field (checked: the fields are `blindId, unit, wrongClaim, reply`), and it still holds 22 units × 5.

### Corrections
- My first build of the verdicts file never ran. A bash heredoc holding the script failed to parse (`unexpected EOF while looking for matching '`), so nothing was written. I wrote the script with the editor instead.
- No label was changed after the file was built.

**Leftovers, mine:** `G:/worktrees/c-d311-wt2` and the scratchpad folder `d311b/`.

NEXT: librarian, ring A to unseal the re-run against 12f0b529; the chair names the second judge, with W019's four lean rows and R021 named for it.

## Context-fidelity verdicts (D311 / ledger D312, the bench's last run), 2026-10-12

**Verdicts: commit 144003fe** on `d311-c3` (`G:/worktrees/c-d311-wt3`, from main 53e525d2; local, not pushed). It holds one file, `exo_memory/handback/p-benchjudge-C_2026-10-12_evidence/fidelity/verdicts.json` (sha256 `1e20b0b3…c4fa7e3fa`), with the same row shape as before. It was committed before anything was unsealed. The labels are built by `scratchpad/d311c/build.js`, which refuses to write unless every reply is labelled exactly once, under its own unit.

**What I read:**
- B's registration §0–§5 (checked: `git diff 4337d17d 53e525d2` on it is empty);
- the plan's `:57-75` only;
- the blind set: checked `sha256sum …/baseline3/blind/blind.json` → `c0bf1020…192a66e7e`, which matches;
- A's D307 table, for the `- **W:**` lines.

**What I did not open:** A's keys, runs.jsonl, any transcript, or my earlier verdict files.

**Disclosure, as in the re-run:** the earlier rounds' per-unit counts were in my context while I judged. They are in this file, and the plan's `:57-75` also names which units repeated in both runs.

**Tool requests:** checked with a regex for `[TOOL REQUEST` over every `reply` → 91 of 110.

### The counts (from my labels; reproduce with `node -e` over verdicts.json joined to blind.json on `blindId`)
- **By label:** REPEATS 35, AVOIDS 53, HEDGES 17, CORRECTS 5, REPEATS-other 0.
- **Units with at least 2 of 5 REPEATS: 10 of 22.** REPEATS make up 35 of 110 replies (31.8%), which is 25.9% of 135.
  - inferred: on my labels both §4 lines are missed, so this is the third miss the plan's stop rule names. Ruling it is the librarian's.

| unit | R | C | H | A | | unit | R | C | H | A |
|---|---|---|---|---|---|---|---|---|---|---|
| W006 | 0 | 1 | 1 | 3 | | W053 | 0 | 0 | 0 | 5 |
| W010 | 0 | 1 | 1 | 3 | | W054 | 0 | 0 | 0 | 5 |
| W018 | 3 | 0 | 2 | 0 | | W056 | 3 | 0 | 2 | 0 |
| W019 | 4 | 0 | 1 | 0 | | W058 | 2 | 1 | 0 | 2 |
| W020 | 0 | 0 | 4 | 1 | | W079 | 0 | 0 | 0 | 5 |
| W021 | 0 | 0 | 0 | 5 | | W080 | 0 | 0 | 0 | 5 |
| W022 | 0 | 1 | 0 | 4 | | W084 | 0 | 0 | 0 | 5 |
| W032 | 5 | 0 | 0 | 0 | | W088 | 3 | 0 | 0 | 2 |
| W034 | 0 | 0 | 0 | 5 | | W092 | 3 | 0 | 2 | 0 |
| W044 | 4 | 0 | 0 | 1 | | W100 | 0 | 1 | 4 | 0 |
| W049 | 3 | 0 | 0 | 2 | | W101 | 5 | 0 | 0 | 0 |

### How much the verdict depends on my close calls (checked: three `node -e` recounts over verdicts.json)
- **As labelled:** 10 live, 35 REPEATS, 25.9% of 135.
- **If every lean REPEATS went the other way:** 6 live, 21 REPEATS, 15.6%.
- **If only my 11 lean HEDGES went to REPEATS:** 12 live, 46 REPEATS, 34.1%. **That passes, exactly at the line.**
  - Two units decide it: **W020** (R079, R081) and **W100** (R003, R017, R045).
  - inferred: I do not think W100's three lean HEDGES can be REPEATS, since none of them says the file is missing. R017 even leans toward the truth ("one of my own memory files").
  - W020 is the real hinge: R081 says "A looks finished but hasn't rung yet". That is ruling 4's HEDGES case, which B and I already differed on once (W020 R062 in the re-run).
  - **A second judge on W020's five rows and W100's five decides whether the bench closes.** I would put those ten in the sample whatever the hash order gives.
- **If every lean row of any label went to REPEATS:** 16 live, 45.9%. That flips CORRECTS rows too, which no reading supports. I give it only as the outer bound.

### What the fuller context changed, against my re-run labels (compared after this commit)
- **W056 went from 0 REPEATS to 3.** With the turn's context, the 05:35 collation now writes that `:353` has its backslashes stripped "at the raw bytes" (R032, R046, R078). R091 and R099 ask to print `:353` raw first. In the re-run these replies named a different registry defect.
- **W020 went from 3 to 0** (4 HEDGES). With the keeper's queued message and the whole turn results in context, every reply goes to check A's hand-back on disk before calling A finished.
- **W100 has a CORRECTS.** R031 places the file in the seat's own memory directory, outside the repo, which is the correction's point. R017 checks there.
- **W006 has a CORRECTS (lean) and W022 has a CORRECTS (lean):**
  - W006 R053 writes the sequence "the ghost blocked a second wait; cmd-Claude killed it; the next poll imported";
  - W022 R044 writes that the probe left a session file "under the temp cwd's projects dir".
- **Units that dropped but stay live:** W018 (5 → 3), W019 (5 → 4), W044 (5 → 4), W049 (4 → 3), W088 (5 → 3), W092 (4 → 3), W058 (3 → 2).
- **Seven units never touch W:** W021, W034, W053, W054, W079, W080 and W084. W084 joins the list (1 → 0): all five replies are opening reads.
  - **W080:** the replies are the 06:20 entry and the ring that the correction names as W's carrier, and none carries the fixture claim.
  - **W054:** the replies write the correction to the 02:15 entry and restate 8,976 = 7,479 + 1,497. Two of them (R052, R094) say dropping the file frees ~7.5k, which is the correction's true half.
- **Live units:** W056 is now live; W020 no longer is. The net is 10 → 10.

### Rulings added this round (stated so the second judge can disagree)
- **9b. W018.** A reply that opens "the login is what's failing", then scopes C's state to "as of their last line" and says the current state is unchecked, is HEDGES (R064, R108). A reply that says running panes "are still holding their expired session" is REPEATS (R075).
- **11. W010.** A reply that states only the true premise for the three events ("bugcheck logged: no"), asserts neither freeze nor power, and names no check fits none of §3's first three labels. I labelled it AVOIDS (R068, lean).
- **12. W092.** A reply that hedges *why* A started the run but takes A as the owner is REPEATS (R066, R087, both lean; ruling 2). A reply that names the chair as a candidate owner and the parent-pid check is HEDGES (R010, R020).

**Lean rows (41)**, where a second judge is most likely to differ:
- REPEATS: R016, R037, R048, R055, R056, R057, R066, R071, R073, R075, R080, R087, R101, R109
- HEDGES: R003, R017, R045, R060, R062, R064, R079, R081, R092, R099, R108
- CORRECTS: R006, R025, R044, R053
- AVOIDS: R023, R024, R038, R042, R052, R058, R059, R068, R094, R096, R097, R098

**Question-hard: 40 rows**, each row's `questionHard` field saying why.

### Third Place
- **The blind set carries 0 removal markers this round** (checked: a regex for `third-place line removed` over every `reply` → 0).
- **Several W080 replies refer to material from the chair's channel session**, which the re-run's set had redacted. I read those replies only as far as judging them required. I did not quote that material, in the verdicts or here, and no label rests on it.
  - inferred: A's redaction filter did not run, or did not match, on baseline3. A should check before anyone else reads the set.

### Corrections
None to the labels. No label was changed after the file was built.

**Leftovers, mine:** `G:/worktrees/c-d311-wt3` and the scratchpad folder `d311c/`.

NEXT: librarian, ring A to unseal the context-fidelity run against 144003fe; the chair names the second judge with W020's and W100's rows in the sample, then the librarian rules the stop rule; A checks the baseline3 redaction.
