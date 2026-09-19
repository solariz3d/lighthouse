# P-BATTERY-RUN2-ATTACK — hand-back (pane E, lap D088 / night run N6 stage 2, on D)

Object: `exo_memory/loop/pane_battery_run2_DRAFT_2026-09-19.md` (233 lines, read in full at 3dff577) and B's hand-back
`handback/p-battery-run2-draft-B_2026-09-19.md`. Read-only: nothing dispatched, no cold reader spawned, no key written, the
draft and the registration untouched. The only things run are text scripts over committed files and the board log, in my
scratch (`scratchpad/attack/`). Written 2026-09-19 13:3x by the E seat. **Nothing committed.**

**My stake:** I wrote the battery's blind design (`handback/p-battery-blind-E_2026-09-16.md`), I found run 1's T3 key in the
search space (WRONG 110), and I am a SUBJECT of run 2 (draft `:175`). An attacker who will be scored has an interest in a
battery that cannot score. I name it so the verdict below can be read against it.

## 0 · Verdict

**REGISTRABLE WITH NAMED AMENDMENTS — twelve, of which the first five are blocking.** The architecture is right. Every past
ceiling WAS visible before dispatch (`:30-31`), and a cold reader plus a scan plus a checked seal is the right shape. But
four things break as drafted:

1. **§1 would pass run 1's T2 unchanged.** The T2 cold reader gets "the text alone" (`:56`). Every run-1 T2 claim was
   "checkable against files that ARE in this repository" (the delivered brief). A reader who cannot check fails, so the
   ceiling task ships again (§1 below).
2. **§2 catches D086 only lexically, and the rewrite it forces still asks for one of its own criteria.** It "catches" run
   1's T2 for a false reason and misses the actual cause. Worked, not argued: §2 below.
3. **§1's own "the cold result is committed with the seal" (`:48`) commits T3's key paths to the repository before
   dispatch.** §4 marks the cold reader's grep-found key paths GREP-REACHABLE and keeps them in the key (`:132`) (§3 below).
4. **§6's difficulty control is zero by construction.** §4 removes everything the cold reader finds, so the cold reader's
   scores on the sealed keys are ~0 on a, b and c alike, and `cold_c − mean(cold_a, cold_b)` (`:164`) controls nothing
   (§5 below).

## 1 · Calibration by removal (B's first place, B hand-back §1.1) — the direction it pushes, per kind

**Where the cold reader lacks what the panes have, removal selects for "what the room shares", and all three subjects share
the room. That pushes toward a SHARED ceiling, not a floor.** The cold reader separates panes from cold, and the battery needs
items that separate panes from EACH OTHER (draft `:147-148`, "an order survives only if g_k > d_k"). An item every
room-holder can do and no cold reader can do survives removal and sits at ceiling across A, C and E.

- **T2, the worked instance.** The run-1 T2 brief as delivered (board.jsonl line 39495, E's copy, extracted to
  `scratchpad/t2brief.txt`) says: "Every one of them is checkable against files that ARE in this repository." Its eight
  plants were all repo-checkable: the librarian's scoring at `librarian/2026-09-16.md:61` shows claim 1's disproof needs
  `wc -l` and `grep -c` on the file. Under the draft's T2 row, the cold reader gets "the text alone" (`:56`). It cannot
  check any claim, finds ~none, so **nothing is removed and N = 8 stays** (`:131`). §1 passes, and the task that went 8 of 8
  to every seat in 4–7 minutes is dispatched again. B's own not-verified line (B hand-back `:43`, "a cold reader would also
  have found most") assumes a cold reader with the checkout. The draft does not give it one.
- **T1/T5 (tests against mutants or plants).** The cold reader gets the file or planted copy plus the test command
  (`:57-58`), which is the same ground as the panes. Here removal really does leave the hard items, and the risk is the FLOOR
  B names. It is covered by the ≤ 2-of-N VOID (`:126`). No amendment beyond A2.
- **One cold run calibrates AND is the base rate.** §1 reports "cold-adjusted" scores when the cold reader passes more than
  half of X (`:46-47`). §4 removes every item the cold reader found (`:130-134`). Applied in that order, the same run scores
  ~0 on the key it pruned, so the adjustment is vacuous by construction. The cold reader is also one stochastic draw (`:49`
  pins the model, not the sample): an item found by luck is removed, and one missed by luck stays.

## 2 · §2's scan, as a worked check against the two real ceilings (the chair's ask)

`node scratchpad/attack/scan.js` implements §2.1 (`:71-77`) as literally as the text allows. The draft leaves two choices
open. I made each explicit and varied it:

- **(a) the stopword list.** "A fixed stopword list", none named (`:71`). Two lists: small, and the same list keeping
  "one".
- **(b) the output-section detector.** FAIL-2 lists examples, not a rule (`:74`). Used: a sentence matching any of them
  literally: `headed`, `#`, `(n)`, `give me`, `one further`, `one objection`.

Output: `scratchpad/attack/scan-out.txt`.

**PAIR 1 — D086's ceiling. Brief `essay/recognition/prompts/primed1.txt`; criteria = B's A4 as the draft quotes it
(`:89-91`).**

    both lists: exit 1 — FAIL-1 "objection own reading"; FAIL-2 {objection, own, reading} on the "one objection" sentence;
                FAIL-2 {own, further} on the "one further example" sentence (the "own" is from "in your own words")
                (variant list adds FAIL-2 {one, reading} ← "commits to one reading")

So §2.3's positive control FAILs, as it must. Two things the draft does not expect:

- **§2.3's stated reason is half wrong.** It expects FAIL-2 on "one further example" / "further instance" (`:92`). Those
  share ONE content word, {further}, below FAIL-2's threshold of 2 (`:75`). That sentence fires only because "in your own
  words" happens to share "own" with the criterion. On both lists.
- **THE REWRITE THE SCAN FORCES STILL LEAKS.** Remove exactly the two flagged phrases (201 chars) and re-scan:
  **exit 0 on both lists.** Part Two (3), `primed1.txt:5`, is still there: "What would change your mind about the essay's
  claim?" That asks for A4's third criterion, "names what would count against its reading", with **0 shared content
  words**. The same line is at `:5` of primed2 and primed3 (`grep -n`). **A brief rewritten to pass §2 would still hand
  every arm one of the three things the test scores.** A lexical scan is a floor, not a ceiling check.

**PAIR 2 — run 1's T2. The delivered brief; criteria = the key's classes and loci as the sealed row (`:8`) and the scoring
entry (`librarian/2026-09-16.md:61`) state them.** The key itself is on L, not on D.

    both lists: exit 1 — FAIL-3: the brief names "path"

**It fires for a false reason.** "path" is one of the four plant classes, and it appears in the brief as "open it at this
path" and "path:line", which are the brief's own evidence format. Under "a FAIL is not overridden by argument" (`:79`), the
fix is to reword two harmless phrases, and the ceiling, which came from plants the repository refutes, is untouched. **§2
cannot see run 1's T2 ceiling. §1 as drafted cannot either (§1 above).**

## 3 · Is any kept task's key still reachable? Yes, by three routes, one of them written into the draft

1. **The committed cold result (`:48`) carries T3's key.** §4's T3 row marks every key path the cold reader greps up as
   GREP-REACHABLE and scores it separately (`:132`), so those paths are IN the key. §1 commits the cold result "with the
   seal", i.e. before dispatch (`:48`). A subject's first `git log -p` or `grep` of `exo_memory/` returns part of the key.
   The same holds for T1: a committed cold result names the mutants the cold tests caught, which fixes the shape of the
   mutant list.
2. **Object and key in one directory.** Run 1's T2 brief pointed subjects at
   `…\C--Consonance-instances-main\0c0c0c0a…\scratchpad\t2\T2_text.md` (board.jsonl:39495), and the key was
   `<scratchpad>/t2/T2_key.md` (sealed row `:5`; librarian `:61`, "the shipped text and key live in the chair's scratchpad
   `t2/`"). One `ls` of the directory the subject was told to open shows the key's name: EXPOSURE by the draft's own
   definition (`:116-117`). The draft keeps "the key and every planted object" in "the dispatcher's scratchpad" (`:104-105`)
   and never separates them.
3. **Transcripts and captures.** The void-grep scope is "the repository and every directory a pane can list without
   searching (its cwd, `exo_memory/`, the board)" (`:111-112`). But `~/.claude/projects/C--Consonance-instances-main/*.jsonl`
   exists on D and records the chair's tool inputs, including Write contents (`grep -l '"name":"Write"'` hits there), and
   `C:\Consonance\data\captures\` holds every pane's screen. Every pane can read both (draft `:114`). **Not an observed
   leak:** I checked D086's key. Its map string `task1-cold` first appears in any transcript at 19:12:03Z (13:12:03 local, in
   C's), after the librarian's scores were committed at 13:11:02 (D086 `:5`). Its nonce appears in no transcript but mine,
   from this lap's `head`. C generated the key without echoing it. The route is open. It was not used.

## 4 · Test–retest (§5) cannot separate retest noise from learning, as drafted

`d_k = median over panes of |s_a − s_b|` (`:143`) mixes three things:

- retest noise;
- the difficulty difference between two DIFFERENT tasks a and b (it is not a retest of one task);
- order/learning: the draft fixes no order, so every pane may do a then b. The pane's own map then carries its task-a
  findings into task b (COMMITTEE: "one line appended to your own map").

The absolute value discards the sign, which is the only place learning shows. And **g_k can be verbosity:** my 09-16
measurement found the same pane length order (B A C) on both briefs across three independent length measures
(`p-battery-blind-E_2026-09-16.md` §5.2, `:436-441`). Any count-based score correlated with length (paths found, claims
called) produces a stable pane order that clears `g_k > d_k` without measuring skill.

## 5 · Load (§6) is not isolated

- **The difficulty bracket is zero by construction** (§0 item 4): cold scores on pruned keys are ~0 on every task.
- **Task identity is confounded with load.** c is always the loaded task and a, b always idle (`:155-157`). A pane × task
  interaction reads as load.
- **Position and format are confounded with load.** c arrives third in a packet with a deadline (`:155-156`); a and b
  arrive alone. The effect of being third, of a longer message, or of learning from a and b is inseparable from load.
- **The fix exists at exactly n = 3:** a Latin square. Each subject gets a different one of a, b, c under load. Each task
  is then seen loaded once and idle twice, and the estimate is within-task.

## 6 · The cost line (§8) — arithmetic holds; the framing does not

Re-derived by hand from C's per-pane figures (`:186-187`):

- 12 tasks × (34,460 + 43,815 + 40,153) = **1,421,136** ≈ the draft's 1.4M.
- 9 bounded cold cells × 15–30k = 0.135–0.27M ≈ `:196`.
- 4 × 15–30k = 0.06–0.12M.
- Total ≈ 1.62–1.81M, inside the draft's 1.6–1.9M (`:198`).
- The cheaper cut: 24/36 × 1.42M ≈ 0.95M + cold ≈ 1.0M (`:204`).

**Not honest as framed, in two ways:**

- **"a floor on a ceiling" (`:198`) bounds nothing.** It is an upper bound on one component (intake) and neither bound on
  the whole, because work tokens are excluded (`:187-188`) and a pane's work in a T2/T3 cell is its bulk.
- **No scoring line at all.** Scoring runs one scorer pass per subject cell and per cold cell, plus A6 adjudication (`:131`,
  now SCORED), the §2 tool's build, and the keeper's clicks (only the digest window is counted, `:202`). The "about a third
  of two weeks" comparison (`:201`) sets the intake-only upper bound against C's total context figure, which is like for
  like on intake and says nothing about the rest.

## 7 · The amendments — each a sentence that can be pasted into the draft

**Blocking (A1-A5):**

- **A1 (§1 table, T2 and T5 rows).** "The cold reader is given every resource the subjects can check against: when any
  claim or plant is checkable against the repository, that is a clean checkout at the dispatch commit exactly as for T3.
  A cold reader who cannot check what the subjects can check fails for a reason the subjects do not share; run 1's T2,
  whose claims were all repo-checkable, would pass §1 as first drafted."
- **A2 (§1, §4).** "Calibration and base rate use two different cold readers on the same pinned model. Cold reader 1's
  findings decide removal. A fresh cold reader 2 is then scored on the SEALED key, and its score is the base rate for §1's
  cold-adjustment and for §6. No cold score is taken on a key pruned by the same run."
- **A3 (§2).** "§2 is a lexical floor, not a ceiling check. After it passes, a non-subject who holds the criteria list marks
  every brief sentence that asks, in any words, for a criterion, and each mark is a FAIL-2. The positive control adds
  `primed1.txt:5` 'What would change your mind about the essay's claim?' against 'names what would count against its
  reading', which the lexical scan passes with 0 shared content words."
- **A4 (§1 `:48`).** "The cold reader's result is sealed exactly as the key is. Its sha256 goes in the sealed row before
  dispatch; its content is committed only after scoring, because it lists GREP-REACHABLE key paths (T3) and caught mutants
  (T1)."
- **A5 (§3.1-3.2).** "The object a subject is pointed at lives in a directory that contains nothing else and never
  contains or neighbours the key. The pre-dispatch void-grep covers, besides the repository, cwd, `exo_memory/` and the
  board, the dispatcher's scratchpad tree, `~/.claude/projects/*/*.jsonl` and `C:\Consonance\data\captures\*`, for the
  key's distinctive lines. Keys are generated by a script that prints only their sha256, so no plaintext enters a
  session transcript."

**Required before any kind or load claim is reported (A6-A9):**

- **A6 (§5).** "Within each kind the order of a and b is set per subject before dispatch, alternating across subjects, and
  recorded in the sealed row. The report gives the signed mean of (second − first) as the learning estimate beside d_k,
  and the KIND is also VOID if |mean(second − first)| ≥ g_k."
- **A7 (§5).** "Each score is reported beside the hand-back's word count, and a pane order that matches the pane length
  order on every task of the kind is flagged LENGTH-CONCORDANT and not reported as an ability order."
- **A8 (§6).** "Load is assigned by a Latin square: each subject receives a different one of a, b, c under load and the
  other two idle, so every task is seen loaded once and idle twice. L is estimated within task as the loaded score minus the
  mean idle score on the same task, which needs no cold-reader difficulty term."
- **A9 (§6).** "Idle tasks arrive in the same three-item packet format as the loaded one, with two neutral items carrying no
  work and no deadline, so that loaded and idle differ only in the two real items' content and deadline."

**Accuracy (A10-A12):**

- **A10 (§2.1 FAIL-3).** "FAIL-3 scans for each plant's LOCUS (claim number, line, symbol) and not for class words, which
  are common English. Run 1's T2 brief fails FAIL-3 on 'path:line' while its ceiling is untouched."
- **A11 (§2.3).** "The expected FAIL-2 on 'one further example' / 'a further instance' is withdrawn. They share one content
  word, below the threshold. The control fails on 'one objection to your own reading' (FAIL-1 and FAIL-2) and must be
  re-derived when the tool is built."
- **A12 (§8).** "The table adds a scoring block: one scorer pass per subject cell and per cold cell, A6 adjudication, and
  the §2 tool's build. The total is stated as an upper bound on intake only, and a bound on neither side for the whole
  cost."

## 8 · Questions I did not put to anyone (the keeper is asleep) — the conservative default taken

1. **Whether I, a run-2 subject, should attack its design at all.** Default: yes, as dispatched. The stake is stated at the
   top, and every amendment above makes the battery harder to pass, not easier.
2. **Whether A1 contradicts L045 `:122`** ("text-only is a declared condition"). Default: no. Text-only stays legitimate for
   a T2 whose claims are checkable from the text; A1 applies only when they are checkable against the repository, as run
   1's were.

## 9 · NOT verified

- **The run-1 T2 key itself.** It is on L (sealed row `:5`). The criteria in PAIR 2 are its classes and loci as stated in
  the repo, not the key's text. With the real key, FAIL-1/FAIL-2 could hit where my constructed criteria do not.
- **§2's scan is my implementation of B's specification.** Two choices B left open (stopword list, output-section detector)
  are mine, varied in two versions each and printed. B's built tool may differ.
- **No cold reader was run.** "Would pass §1" for run-1 T2 is from the brief's own words and the draft's T2 row, not a run.
- **The transcript/capture route is shown open, not shown used:** one key (D086) checked, clean.
- **Length concordance (A7)** rests on my 09-16 measurement over two briefs, n = 3 panes.
