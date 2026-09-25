# DRAFT · THE PANE BATTERY, RUN 2 — design only, nothing runs from this file

**Written by B (pane `12fb81f6`) on D, 2026-09-19 13:2x, lap D088 (unattended N6), stage 1 of 2.** A new file beside
`loop/pane_battery_registration_2026-09-16.md` (REG). **REG is not edited:** it measures the chair (REG `:13-25`), so no seat
rewrites it. This file proposes run 2's design and becomes a registration only when the chair adopts it in a new file, with
the keeper having seen §9.

**Status: DRAFT. No task is written, no key exists, no dispatch is authorised by this text.**

> **AMENDED 2026-09-24 (D135, B, the author).** E's twelve amendments (`handback/p-battery-run2-attack-E_2026-09-19.md` §7)
> are ADOPTED as written, and a thirteenth (A13, sealed authoring) is PROPOSED: all in §12 at the end. The dated markers in
> §1, §2, §3, §5, §6 and §8 point there. **Still true after the amendments: no task is written and no key exists.**

**My stake, stated first.**
- I wrote REG §9's six amendments (REG `:156-212`, from `handback/p-battery-attack-B_2026-09-16.md`).
- **My D085 amendment A4 is the direct cause of today's third ceiling.** `loop/t3_run_result_D086.md:11`: "The per-output
  test (A4, add-and-hold: commits, adds, holds) is met by following the task. `essay/recognition/prompts/primed1.txt:3` asks
  the reader for 'one further example … and one objection to your own reading' … B's attack did not [see it]."
- So I am designing the check against the failure I caused. **§2 exists because of that WRONG, and its positive control
  (§2.3) is my own A4.**

---

## 0 · WHAT RUN 1 AND TWO OTHER RUNS SAY, read at source

| run | what happened | source |
|---|---|---|
| battery run 1, T3 | **VOID, all four cells.** The key was sealed inside the search space; the obvious `grep` returned it, and "the leak is proportional to doing the task well" | `librarian/2026-09-16.md:57` (04:22) |
| battery run 1, T2 | **VOID by the ceiling rule.** 8 of 8 to every seat in 4–7 minutes; the key's own counting method was a defect; two cells leak-hit, one with content | `:61` (04:39) |
| battery run 1, T5 | **VOID before return.** Dispatched with no sealed row on origin; the digest hook was live for 31 s inside the window | `:67` (05:06) |
| L045 | plant method at ceiling twice; "**the vantage was the condition, not the pane**"; "If there is a third run: do not plant … score the edges" | `loop/l045_score_2026-09-08.md:116`, `:120-122` |
| T3 (D086) | 9 of 9 STANCE, cold 3 of 3: "**a reader given nothing passes**"; the task text asked for the scored criteria | `loop/t3_run_result_D086.md:9-13` |

**One lesson across five runs:** every ceiling was visible **before** dispatch to anyone who gave the task to a reader holding
nothing and looked. None of the three designs, mine included, did that. And every leak was a file the subject could reach.
**Run 2 is built on two pre-dispatch checks: a cold reader (§1) and a criterion scan (§2), plus a seal that is checked (§3).**

---

## 1 · THE CEILING CHECK: a cold restricted reader must NOT pass, before any pane sees the task

> *2026-09-24 (D135): amended by A1 (the cold reader gets every resource the subjects can check against), A2 (two cold
> readers: one calibrates, a fresh one is the base rate), A4 (the cold result is sealed like the key) and A13 (the route and
> its persistence). See §12.*

**Rule R2-1.** Every task, as it will be sent, is first given to a **cold restricted reader** by C's route: `claude -p
--restricted --strict-mcp-config --model claude-opus-5`, from a directory outside every repo (`handback/p-t3-readiness-C_2026-09-19.md:94-98`).
The reader gets the same brief and the same object copy the panes will get, and nothing of the room. C measured that the
route carries no room shell, hooks or memory (`:45`, `:49-57`).

- **It is scored with the task's own key and its ceiling X (named in the sealed row, §4), by the scorer who will score the panes.**
- **If the cold reader reaches the ceiling X, the task is rewritten or dropped BEFORE dispatch.** A task a reader holding
  nothing passes measures the task, not the pane (D086 `:11-13`).
- **If the cold reader passes more than half of X, the difference between the panes' scores and the cold score is what gets
  reported** ("cold-adjusted"), never the raw score.
- **The cold result is committed with the seal (§3),** so no later reader can say the task was calibrated after the fact.
- **The same model is pinned for every cold reader** (C's leak 2, `:116-117`).

**Per kind, what "the object" means for the cold reader** (the kinds are §4's):

| kind | the cold reader is given | why that is the fair control |
|---|---|---|
| T1 build with tests | the defect statement and a copy of the one file | anything the panes know beyond it is the room |
| T2 contest a text | the text alone | L045 `:122`: text-only is a declared condition, not a cheat |
| T3 find prior art | a **clean checkout copy** (`git worktree` at the dispatch commit, no `instances/`, no scratchpads, no maps outside the repo) | T3's object is the repository. A cold reader with no repo would fail trivially and prove nothing; one with the repo and no room tells you whether the task measures grep |
| T5 catch in running code | the planted copy and its test command | as T1 |

**What this does not do:** a cold reader who fails does not prove the panes are separable. It proves only that the task is
not free. The separability claim is §5's.

## 2 · NO TASK TEXT CONTAINS ITS OWN SCORING CRITERIA, checked mechanically

> *2026-09-24 (D135): amended by A3 (lexical floor plus a non-subject's semantic mark), A10 (FAIL-3 on locus, not class
> words) and A11 (§2.3's expected hit corrected). The tool is BUILT and its controls run: §12, "§2 as built".*

**Rule R2-2.** Each task's key carries a **criteria list**: the exact statements the scorer will check (for T2/T5, each
plant's category and locus; for T1, each mutant's anchor; for T3, each key path's topic phrase). Before sealing, a script
compares the brief against the criteria list.

### 2.1 · The check, specified (it is not built in this lap)

    normalise   lowercase; strip punctuation; collapse whitespace; drop a fixed stopword list committed with the tool
    unit        every 3-gram of content words in each criterion
    FAIL-1      any criterion 3-gram occurs in the normalised brief
    FAIL-2      the brief requests an OUTPUT SECTION (a heading, a numbered "give me …", "one further …", "one objection …")
                whose content words overlap a criterion by >= 2 content words
    FAIL-3      for T2/T5: the brief names a plant's line, symbol or category word
    output      every hit printed with the brief line and the criterion it matched; exit 1 on any hit

A FAIL is not overridden by argument. The brief is rewritten, or the criterion is dropped from the key. **A criterion that
cannot be scored without the brief asking for it measures compliance.**

### 2.2 · Negative control

A brief and key pair with no overlap, written for the fixture, must exit 0.

### 2.3 · Positive control: THE CASE THAT HAPPENED, and it must FAIL

- **Brief:** `essay/recognition/prompts/primed1.txt:3`.
- **Criteria:** my D085 A4, verbatim from `handback/p-t3-attack-B_2026-09-19.md` §4: "commits to one reading", "adds
  something not in the cases as presented (a further instance, a consequence, or an objection to its own reading)", "names
  what would count against its reading".
- **Expected:** FAIL-2 on "one further example" / "further instance" and on "one objection to your own reading" / "objection
  to its own reading".
- **If the tool passes this pair, it is not shipped.**

## 3 · KEYS OFF-REPO AND OFF-DIRECTORY, SEAL ON ORIGIN BEFORE DISPATCH

> *2026-09-24 (D135): amended by A5 (object and key never neighbours; the void-grep covers every session transcript and
> every capture; keys printed only as sha256) and A13 (which makes A5 satisfiable). See §12.*

**Rule R2-3**, assembled from rules that already exist:
- the T3-KEY rule, `librarian/2026-09-16.md:57`;
- A8's triple, REG `:223-229`;
- the T2 row's own clause, `:67`;
- COMMITTEE's seal-row exception, pushed unattended by the chair.

1. **Where the key lives:** the key and every planted object live in the **dispatcher's scratchpad, outside the repository
   and outside every pane's cwd.** The repository carries only the triple **(commit, path, sha256)** in a one-file sealed row
   under `exo_memory/loop/`.
2. **Before dispatch, and checked, not trusted:**
   - `git branch -r --contains <seal commit>` is non-empty. That is the seal gate in `chair_inject` (`consonance/src-tauri/src/mcp.rs:524`, P-SEAL-GATE, D068), which refuses a
     keyed dispatch until its row is on origin. **Every run-2 dispatch names its key so the gate fires.** T5's run-1 void is
     the case this closes.
   - **The void-grep, BEFORE dispatch** (T3-KEY rule): grep the repository and every directory a pane can list without
     searching (its cwd, `exo_memory/`, the board) for the key's distinctive lines and the question's exact words. **Any hit
     voids the task before it is sent.**
3. **What "off-directory" buys, said honestly:** panes run with skipped permissions and can read any path on D. A scratchpad
   is out of the obvious search, **not unreadable.** Secrecy is therefore also checked after the fact:
   - the A3 per-cell leak check (REG `:183-187`), with run 1's refinement (`librarian/2026-09-16.md:61`): **a path in a
     listing is EXPOSURE, recorded beside the cell; a read that returns the key's CONTENT voids the cell.**
   - The transcript grep runs for the key's path **and** for its distinctive lines.
4. **The digest window (A3):** `board-digest.js` is off for the whole window. **The window's end is conditioned on the
   board's last delivery row for the run, not on a file.** That is the 05:05 failure (`:67`), where the condition was a file
   and the event was a delivery. Its start and end go in the run file.

## 4 · THE TASKS: kept, fixed, dropped

**The ceiling X for every kept task is named in the sealed row, before dispatch** (A5, REG `:195-199`). The floor is named
too: every subject ≤ 2 of N → VOID, from run 1 (`:61`).

| task | run 2 | why it will not hit the ceiling again (the check, run before any pane sees it) |
|---|---|---|
| **T1 build with tests** | **KEPT** (never run) | The mutant list is written by a non-subject. The cold reader (§1) writes its tests against the same defect, and the mutant list is run on the cold reader's tests. **Any mutant the cold reader's tests catch is DROPPED from the key before sealing.** It measures the defect statement, not the pane. X = all remaining mutants caught |
| **T2 contest a text** | **KEPT, re-cut per L045 `:116`, `:122`** | Plants are calibrated against the cold reader: **a plant the cold reader finds is removed from the key before sealing.** N ≥ 8 must remain after removal, or the object is too easy and is replaced. The key's own claims are re-derived by a second non-subject before sealing, because run 1's key had a defect (`:61`: `grep -c ''` counted a NUL-split line twice). A6's second number (real unplanted defects, confirmed by the adjudicator) is **SCORED**, not reported beside |
| **T3 find prior art** | **KEPT, new question** (run 1's is spent: `:57`, "its answer is in three committed files and four transcripts") | The key is built by a non-subject, off-repo. The cold reader gets a clean checkout (§1) and runs its own search. **Every key path the cold reader finds by grep is marked GREP-REACHABLE and scored separately.** The pane score is paths found **beyond** what a room-less grep finds. If the cold reader finds ≥ X of the key, the question is replaced |
| **T4 measure and report** | **DROPPED** | Its two numbers are: (1) figures sourced / figures reported, at ceiling by `COMMITTEE.md`'s own rule (REG `:197-198`); (2) reproduces-by-rerun, 1 or 0. Two trials per pane (§5) give three levels (0, 1, 2) for three panes, so no between-pane gap can exceed the within-pane retest noise the statistic tolerates. **It cannot separate panes at any N this room can afford.** Measurement stays in the room as work, not as a battery cell |
| **T5 catch in running code** | **KEPT, calibrated as T2** | As T2: plants the cold reader catches by running the test command are removed. Planted in a copy only. **The seal is on origin before the first delivery, or the cells are void by the row's own clause** (`:67`) |
| **T6 score blind** | **DROPPED** | Its KEY is another scorer's labels (REG `:85`), so its score belongs to a PAIR, not a pane (A5, REG `:198-199`). A reference label set would need two non-subject scorers who agree. D086's two scorers agreed 9/9 at a ceiling (`t3_run_result_D086.md:9`), which says the room cannot yet build a reference that is not itself at ceiling. **Revisit when a scorer-agreement instrument exists that has been shown to disagree** |

## 5 · TEST–RETEST FOR EACH KIND (A4, REG `:189-193`)

> *2026-09-24 (D135): amended by A6 (order set per subject, alternating; the learning estimate reported; a KIND VOID
> condition on it) and A7 (LENGTH-CONCORDANT flag). See §12.*

**Rule R2-5.** Each kept kind has **two tasks, a and b**, of the same kind, both passing §1 and §2, both sent to every subject,
both idle (§6's control condition).

    per pane p, kind k:   s_a, s_b  (cold-adjusted where §1 requires it)
    retest noise          d_k = median over panes of |s_a − s_b|
    pane spread           g_k = max over panes of mean(s_a, s_b) − min over panes of the same
    KIND VOID             if d_k >= g_k — the battery measured the task, not the pane (A4's own sentence)

**Named before any score:** with three subjects, the reportable result per kind is an ORDER, never a rate. An order survives
only if g_k > d_k.

## 6 · LOAD, AS A MANIPULATION WITH ITS OWN CONTROL

> *2026-09-24 (D135): the design below is SUPERSEDED by A8 (Latin square, estimated within task) and A9 (idle tasks in the
> same packet format). See §12.*

REG `:142-143` and the 04:39 entry (`:61`): "fresh subjects with one question all pass; the failure the room cares about is
under load." **Load has never been manipulated. It has only been named as the thing missing.**

- **The manipulation:** a third task **c** per kind. Each pane receives it **under load**: c arrives as the third item of a
  packet whose first two items are real open-queue work with a stated finish time, and c is due in the same hand-back.
  Nothing else differs from a and b.
- **The control, two-sided:**
  1. **The pane's own idle baseline:** mean(s_a, s_b) from §5.
  2. **Task difficulty:** c is also given, idle, to the cold reader, and so are a and b (§1 already does this).

  The load effect per pane is a difference in differences:

        L_p = [ s_c(loaded) − mean(s_a, s_b) ]  −  [ cold_c − mean(cold_a, cold_b) ]

  The second bracket removes the part of the drop that is just c being harder.
- **Named before any score:** at n = 3 panes and one loaded task per kind, **L is descriptive per pane.** A load claim is made
  only if L_p < 0 for **every** subject in **at least 3 of 4** kinds. Otherwise the report says "no load effect detected at
  this n", not "no load effect".
- **What load is NOT, here:** it is not the chair's live traffic, which varies by night and cannot be held equal. It is a
  fixed, written two-item packet, the same text for every pane, committed with the seal.

## 7 · SUBJECTS, SCORERS, PREDICTION

- **Subjects: A, C, E. B is OUT as a subject of run 2.** B wrote this design, including every check a subject would be scored
  under. That is A1's reason (REG `:161-165`) at one remove. B may score any kind whose key B did not write.
- **Scorers:** never the dispatcher, the key's author, or a subject (REG `:44-45`, A1). For T2/T5 the planter is not the
  scorer. The cold reader's score is by the pane scorer (§1).
- **A new sealed prediction** by the chair, triple-sealed (A8) and on origin before any dispatch. Run 1's prediction
  (0a54c5a) is spent: its content is recoverable (A2, REG `:170-176`) and it named six tasks, two of which are dropped here.
- **The guess gate (A9, REG `:231-237`) applies unchanged:** if it fires, there is no comparative table and the kinds go
  descriptive.

## 8 · COST, from C's §10 figures (upper bounds, not counts)

> *2026-09-24 (D135): amended by A12 (a scoring block; intake-only upper bound, no bound on the whole). A2 doubles the cold
> block, and A13 adds an authoring block. The re-stated table is in §12.*

- **C's basis:** `handback/p-battery-cost-C_2026-09-16.md:156-161`, context tokens per hand-back, UB: **A 34,460 ·
  B 34,077 · E 40,153 · C 43,815.** That is the **intake bill only**. It excludes every token spent reading, running and
  writing (`:200`).
- **Cold reader per task,** from C's 09-19 route (`p-t3-readiness-C_2026-09-19.md:77-81`): harness **13,215** input, plus the
  object (T2's text ≈ +12k for a 6.5k-word document; T1/T5 one file; **T3 unbounded, because it searches a checkout**), plus
  2–4k output.

| block | cells | intake-bill UB per cell | subtotal (UB, intake only) |
|---|---|---|---|
| subjects: 4 kinds × tasks a, b, c × panes A, C, E | 36 | 34–44k (C's row per pane) | **≈ 1.4–1.5M** |
| cold readers: 4 kinds × 3 tasks × 1 reader | 12 | 15–30k (T1, T2, T5); T3 not bounded | **≈ 0.14–0.3M + T3's three** |
| a second non-subject re-derives T2's and T5's keys | 4 | 15–30k | ≈ 0.06–0.12M |
| **total, stated as a floor on a ceiling** | | | **≈ 1.6–1.9M tokens + T3 cold search + all work tokens** |

**For scale:** C's A10 (REG `:239-242`): the room's four panes cost ≤ 4.82M context tokens in two weeks
(`p-battery-cost-C:163`). **Run 2 as drafted is about a third of that in intake bill alone,** plus the keeper's clicks for
the digest window.

**The cheaper cut, if the keeper wants one:** drop task c (load) → 24 subject cells, ≈ 1.0M. Drop test–retest too → the run
cannot state §5's void condition and **should not be run**. There is no cheaper honest version below "a and b".

## 9 · WHAT THE KEEPER MUST SEE BEFORE THE KEYS ARE SEALED

1. **The §1 cold-reader results for every task,** and which tasks were rewritten or dropped because of them.
2. **The §2 scan's output for every brief,** including the positive control (§2.3) failing as it must.
3. **The one-file sealed rows,** and `git branch -r --contains` for each. Every seal is on origin before any delivery.
4. **The load packet's two real items** (§6). They are real work, so he is choosing what the room does while measuring it.
5. **B out as a subject, and why** (§7). Three subjects means a result is an order, never a rate (§5).
6. **The cost** (§8), and whether the load block is in.
7. **The digest-window plan** (§3.4), with its end conditioned on the board, because it is his hook on his machine.
8. **The prediction's triple**, not its content.

## 10 · QUESTIONS NOT PUT TO ANYONE (the keeper was asleep); default taken

1. **Is B out as a subject?** Default: yes (§7).
2. **Does the load block run?** Default: it is **designed in and not run** until the keeper sees §9.4 and §8.
3. **T4 and T6 dropped, not deferred?** Default: dropped from run 2, each with a reason that names what would bring it back.
4. **Does "do not plant" (L045 `:122`) forbid T2 and T5?** Default: no. L045 retired planting for **text readers at ceiling**.
   Run 2 keeps plants only where the cold reader has removed every free one (§4), which answers the ceiling L045 measured. If
   run 2's T2 hits ceiling anyway, T2 is retired for good (§11).

## 11 · FALSIFIER AND DEGENERATING, named before any task exists

- **The design falsifier:** if any kept task that passed §1 (cold reader below X) still reaches the ceiling with every
  subject, **§1 is not a sufficient ceiling check**, and run 2's design is withdrawn, not patched.
- **REG §6 (`:128-133`) carries over unchanged.** Any change after the first score voids the run. "If two consecutive runs
  produce no table that survives §5, the battery is reported dead rather than widened." **Run 1 produced no table. If run 2
  produces none, that clause fires,** and this draft says so now so it cannot be argued away then.

## 12 · AMENDMENTS — 2026-09-24 (D135, B, the author of this draft)

### 12.1 · E's A1–A12, ADOPTED as written

The master is `handback/p-battery-run2-attack-E_2026-09-19.md` §7: twelve pasteable sentences, **A1–A5 blocking**,
**A6–A9 required before any kind or load claim**, **A10–A12 accuracy**. **They are adopted verbatim from that file and not
restated here**, because two copies of one rule drift apart.

What adopting them changes, by section:
- **§1:** A1 gives the cold reader every resource the subjects can check against (a clean checkout for T2/T5 too, where a claim is repo-checkable). A2 uses two cold readers per task, so calibration and base rate never share a run. A4 seals the cold result like a key and commits it only after scoring.
- **§2:** A3 makes this a lexical floor, followed by a non-subject's semantic mark. A10 puts FAIL-3 on the locus. A11 corrects §2.3's expected hit.
- **§3:** A5 keeps object and key in separate directories, runs the void-grep over every `~/.claude/projects/*/*.jsonl` and `C:\Consonance\data\captures\*`, and prints keys only as sha256.
- **§5:** A6 sets the order per subject, alternating, and reports the learning estimate with its own VOID condition. A7 adds the LENGTH-CONCORDANT flag.
- **§6:** replaced by A8 (a Latin square, estimated within task) and A9 (idle tasks in the same packet format).
- **§8:** A12 adds a scoring block and states the bound honestly.

### 12.2 · A13, PROPOSED — sealed authoring, because A5 cannot otherwise be satisfied

**The problem, measured 2026-09-24.**
- A5's void-grep covers every session transcript. A seat that writes or reads a task or key records it verbatim in its own transcript: this seat's is 46.6 MB and holds **233** Write calls with their content (`grep -c '"name":"Write"'`).
- So any task or key authored, read or scored by a seat on D is (a) plaintext that A, C and E can read, since they run with skipped permissions, and (b) a guaranteed void-grep hit.
- **A5 is unsatisfiable for a hand-authored battery on D.** That includes the librarian scoring a cold reader before dispatch.

**The proposal (pasteable).** "Every task brief, key, planted object and cold-reader output is authored, cold-read and
cold-scored only by `claude -p --no-session-persistence` processes, isolated as D127/L085 learned (`--setting-sources
project --settings {"disableAllHooks":true} --strict-mcp-config --mcp-config {"mcpServers":{}}`, tools as the kind needs, cwd
a fresh temp dir outside every repository and every pane's cwd). They write only into the off-repo working directory, the
object and the key in separate subdirectories (A5). The seat that runs them reads none of their outputs. It sees only sha256
digests, counts and exit codes, and every script it runs prints nothing else."

**Measured, not assumed (2026-09-24, `claude` 2.1.282):**
- With `--no-session-persistence`, one call leaves **no `.jsonl` anywhere under `~/.claude/projects/`**. The control call without the flag leaves one (a project dir is still created, empty).
- The isolated route **still loads the user's global `~/.claude/CLAUDE.md`**: the reader quoted its first bullet verbatim (C's D133 finding, upstream #87590).
  - **For the cold reader this does not bias the control:** every subject pane loads the same file, so the cold-vs-pane difference is still exactly the room.
  - It does make the cold reader a better test writer on T1/T5, which errs toward dropping items, not keeping free ones.

**What A13 still cannot do:** stop a subject from reading the off-repo directory by path. That's A5's own after-the-fact
check (EXPOSURE vs content-read), unchanged.

### 12.3 · §2 as built (the lexical floor)

Built off-repo (`<B scratch>/d135/scan.js`); it becomes a committed tool only when the chair adopts run 2.

**The rules:**
- **FAIL-1:** a criterion content 3-gram occurs in the brief.
- **FAIL-2:** a request sentence shares ≥ 2 content words with a criterion. A request is a question, a line starting with a heading/number/bullet marker, or a sentence with a fixed request verb.
- **FAIL-3:** a criterion's locus occurs in the brief.
- **Stopwords** are a fixed list committed with the tool, and include "one" and "own" (E §2 PAIR 1).
- **It never prints brief or criterion text:** only the kind, the brief line number, the criterion id and a word count. On a real task, printing text would be the A5 leak.

**Controls, run 2026-09-24 — 5 of 5 as expected:**

| control | expected | got |
|---|---|---|
| **POSITIVE** (§2.3 as amended by A11): `essay/recognition/prompts/primed1.txt` vs A4's three criteria | **FAIL** | **exit 1**: FAIL-2 at brief line 3, criterion A4-2, 2 content words |
| A3's case: the same brief vs "names what would count against its reading" alone | lexical PASS (the floor) | exit 0 |
| NEGATIVE: a fixture brief and key with no overlap | PASS | exit 0 |
| FAIL-3 locus (A10): a brief naming the plant's locus | FAIL | exit 1 |
| class word (A10): a brief using "path" / "path:line" | PASS | exit 0 |

### 12.4 · §8 re-stated (A2, A12, A13) — HAND-MADE ESTIMATES, no run behind them

| block | cells | note |
|---|---|---|
| **authoring (A13)** | 8 tasks (a, b × 4 kinds); 12 if the load block is in (A8 needs a, b and c) | a T3 author searches the repository: unbounded |
| **cold readers (A2)** | 2 per task: 16, or 24 with load | T2/T5 now carry a checkout (A1), so they are unbounded like T3 |
| **cold scoring** | one non-persisting scorer pass per cold cell | the librarian cannot score before dispatch (§12.2) |
| subjects | 24 (a, b × 4 kinds × A, C, E), or 36 with load | C's intake UB 34–44k per cell |

**The whole, before any subject runs, as a rough guess:** about 1–3M tokens of the keeper's Claude usage. **It is an estimate,
not a measurement, and it bounds nothing.** Subject cells come after that.
