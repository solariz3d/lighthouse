# Anchor-similarity DRAFT, second read: §8.8 (9c5ed10), §8.8.1 (57a299b), §8.9 (87b799a)

**B (pane `12fb81f6`), lap D064, on D, 2026-09-15 ~12:20. HEAD `87b799a` at open, clean tree.**
**Read against:** my `handback/anchor-registration-read-B_2026-09-15.md`, E's `handback/p-diversity-c1-E_2026-09-15.md`,
and the librarian's 12:04 entry (a326b5d). **Nothing in the repo edited except this file. Nothing run that writes.**
DRAFT line numbers below refer to `exo_memory/loop/anchor_similarity_registration_DRAFT_2026-09-15.md` at 87b799a.
B wrote the positive control and scores nothing.

---

## 0 · VERDICT

**NOT REGISTRABLE as written. Every blocking item is repairable by a named amendment, and none needs a new instrument.**

There are six blocking items, **K1–K6**. Four of them can produce an outcome whatever the data are (§4). The uptake half, R8c and
R8e, can be built as written once three small variant choices are pinned (§2). The polarity half, R8b, has two defects.
One is in the measure itself: AFFIRMS counts reuse. The other is in its negative control, which is not negative
against the version it is scored at. **The second defect came into R8b from my own §4.2, and I say so in §6.**

| # | blocking item | where | fires regardless of data? |
|---|---|---|---|
| K1 | the NEGATIVE polarity control builds the POSITIVE control's contests, so it is not negative @ed73e76 | :296-300 | yes, toward POLARITY INSTRUMENT FAILED |
| K2 | AFFIRMS includes "builds it as the packet does", so reuse counts as agreement, and P_u is likely void or biased | :279-286 | yes, toward P_b < P_u |
| K3 | the §8.4 overlap (mean r) and R8d (majority of cells) have no precedence and can both fire on one run | :317-318, :319-327 | yes, as a contradiction |
| K4 | the unbriefed arm always runs first and is committed before the packet, so the seal leaks by commit order and the briefed arm can read the unbriefed answer | :431-441 | yes, toward convergence (r → 0) |
| K5 | the 3d void rule greps the generic word "packet_" | :433-434 | yes, voids tasks for non-leaks |
| K6 | the redact fixture regex passes while letters and arm words leak, and it strips 7+ digit figures | :406-408 | the blind can pass its own test while not blind |

---

## 1 · Q1: DOES R8b STILL MEASURE WHAT MY §4.2(b) MEANT?

**Partly. It has become reuse-plus-verdict, not verdict.**

My §4.2(b), at `anchor-registration-read-B_2026-09-15.md:164-165`, reads: *"the count of the brief's claims the hand-back marks
wrong or contested, scored blind to arm by a non-dispatching seat."* The numerator was a verdict, and the denominator was left open.

R8b keeps the verdict (CONTRADICTS at :283-284) and adds a denominator: P = C/(A+C) at :285. The denominator is where it
changes. **AFFIRMS is "states or builds it as the packet does" (:282), and a claim is "a ruling, a figure, a path:line, a 'this
is built as X' statement" (:280).** So a hand-back that reuses the packet's path:line or figure AFFIRMS that claim, whether or not
it checked anything. Two consequences follow, and they are what makes this blocking rather than cosmetic:

1. **Composition bias toward P_b < P_u.** The briefed arm has the packet's figures and paths in front of it, so it reuses them.
   Each reuse adds to A, which pushes P_b down. The unbriefed arm never saw those strings, so it can only reach a claim by
   independent work, and independent work is where disagreement lives. **P_b < P_u follows from who saw the text, before any
   deference happens.** That feeds ANCHORING and DEFERENCE WITHOUT UPTAKE (:321, :323), which are the two cells that indict
   the chair.
2. **P_u is likely void.** The unbriefed arm gets a keeper quote and cited paths (:431). It does not get the chair's specific rulings,
   thresholds or line numbers. A+C < 3 voids P (:285-286), and nothing says what a void P_u does to the R8d cell for that task.
   A void on 2 or more of 4 tasks leaves no majority possible (:327), so the run is MIXED by construction. That is not stated as
   an outcome.

**Amendment that restores §4.2(b)'s meaning:**
- AFFIRMS requires the hand-back to state a check or an independent derivation at the cited line. Bare reuse is SILENT.
- Report per arm the count of claims touched, meaning non-SILENT cells, beside P. That separates engagement from polarity.
- State what a void P does to R8d. It is either a fifth cell "VOID" or it counts against a majority, and it must be ruled now.

Blindness (:287-290) and scorer exclusion (:291-292) still do what §4.2(b) asked. Agreement at :293 is on CONTRADICTS-vs-not,
which fits a verdict measure. Nothing wrong found there beyond K6.

---

## 2 · Q2: CAN R8e AND R8f BE BUILT AS WRITTEN?

**Yes, with three variant choices a builder would have to make alone. None of them is blocking. K3 is.**

**2.1 Six-phase mean (:355-360).**
- The PHASE 0 "first window of 0 ids" is resolved by :357, "PHASE 0 is §8.2 exactly". I had drafted this as a defect before
  rereading :357. It is not one (§6).
- **Variant V1:** for PHASE > 0, is the short first window (300–1500 ids plus CLS/SEP) a full member of the SECONDARY
  renormalised centroid? §8.2's centroid is unweighted, so a 300-id head gets the weight of an 1,800-id window. PRIMARY is
  token-weighted (R3), so PRIMARY is unaffected. **Pin it: SECONDARY is token-weighted too, or the head window is excluded from it.**
- "A phase at or past a text's length gives one window" (:357) is buildable.
- **Stated check:** E's §5.2 table has to reproduce from the landed code (:361-362). That table is at single-phase PRIMARY for P1
  (`p-diversity-c1-E_2026-09-15.md` §5.2), and the librarian's six-phase means (U_A 0.7328, U_B 0.6866, U_E 0.6497, a326b5d) are
  the arithmetic check on it. I did not re-run either (§5).

**2.2 Sign guard (:364-365).**
- r per phase is not defined anywhere; only U is (:358-359). Whether per-phase r uses per-phase controls or mean controls does
  not change the sign, because U_pos − U_neg is positive at every phase by a wide margin (controls 0.8575 against 0.4521 at
  PHASE 0, §9). So the sign rests on the numerator alone and **there is no real variant.**
- **Variant V2:** r = 0 exactly at some phase. "Changes sign" is undefined. Pin it: zero counts as a sign change, which is the
  conservative choice.
- **Variant V3:** the guard says it applies "under §8.4's overlap rule" (:364). It does not say whether a guarded task's R8d
  cell also reads uptake < bar. If it does not, a guarded task counts as r ≤ 0 for §8.4 and as ANCHORING for R8d. Pin it: the
  guard applies in both places.

**2.3 Version symmetry in m (:376-380, closed at :390-392).**
- Buildable. Rows with no other packet are out (n = 19). Rows with some other packets missing use a smaller other-mean, and
  the exclusion is reported (:378-379).
- **Not a variant but an unmeasured effect:** early rows' other-means are over fewer packets than late rows'. E §5.4 measured the
  asymmetry at 0.130 against 0.108 on the median. What symmetric-in-version does to the per-row spread is not measured, and m
  is a median of ratios. Report the n of other packets per row in the step-1 table.
- Step 1's stake (E wrote both U_neg texts, :414-415) is declared and re-derived. Nothing further found.

**2.4 K3: overlap against majority (:317-318 against :319-327). BLOCKING.**
§8.4 as re-stated at :317-318 fails the claim if **mean r < bar**. R8d classifies **per task** and takes 3 of 4. So three tasks
at r = 0.6m and one at r = −1.2m give a mean of 0.15m < 0.5m, and §8.4 reads "claim fails". But 3 of 4 tasks are above the bar,
so R8d can read ANCHORING or ENGAGEMENT by majority. **No line says which report wins.** Pin one: §8.4 is a gate before R8d,
or R8d replaces the mean clause. Either choice is fine. Leaving both unranked lets the reporter pick after the numbers.

**2.5 One more mixed regime, noted and not blocking:** U_pos is unstripped (:305, §8.7 R1). U_neg and both arms are stripped. It is
constant per packet and cancels in the ratio's direction, but not in its size. Declared already at R1, so nothing to add.

---

## 3 · Q3: CAN EACH §8.9 STEP BE BUILT AS WRITTEN?

### 3.1 Spawn claims (:397-402) against `consonance/src-tauri/src/main.rs`

- **"A FRESH pane … has no CLAUDE.md":** true. `prepare_fresh_dir` makes `instances/fresh-<8>` with no CLAUDE.md;
  `prepare_sibling_dir` writes one from `assemble_intake()`.
- **"No board mount":** not re-verified this lap (§5).
- **"Stock permissions, so it asks before tool use":** true. `spawn_fresh` calls `spawn_claude_pane(..., false, false)`, which
  is skip_perms=false. **Consequence the step does not state:** every Read by a scorer is a keeper click, and the prompt shows
  the path. With neutral names (:451) that is harmless. With control filenames it is not. Pin it: the scratch folder holds
  only neutral names.
- **Both kinds are born KEPT.** `spawn_sibling` and `spawn_fresh` both call `write_kept`. The two panes are "✦ brief" and
  "○ fresh". **3g "Both siblings are closed" (:438) has to mean un-kept as well**, or they are restored on the next relaunch
  and "neither is used on another task" depends on nobody relaunching. I did not verify whether closing a pane removes its
  kept row (§5).
- **Letters:** `pane_letter` (main.rs:3573-3600) never frees a letter. `C:\Consonance\data\letters.json` holds A–M today, so new
  seats get N, O, P… and no existing `map/<letter>.md` exists for them. **"No map" (:429) holds by construction.** Nothing found.
- **"No capture tail":** the siblings still get `assemble_intake()`, and that carries **THE LIVE EDGE** (see this pane's own
  CLAUDE.md, "The live edge"). Step 2 greps the live edge once, when the task list is committed (:420). The live edge is
  regenerated at every spawn. Between step 2 and a task's 3b it can fill with rows distilled from the lap: the sealed-row
  commits, the chair's picks with reasons (:422), and the previous task's commits. **Pin it: grep each new sibling's written
  CLAUDE.md at 3b for the task's keeper quote and cited paths, and commit the grep. A hit voids the task.**

### 3.2 Sealed-packet order (:427-441). K4, BLOCKING

- **3c commits the unbriefed hand-back before 3e commits the packet.** From then on the briefed sibling's checkout holds the
  unbriefed answer on the same task, one `ls exo_memory/handback` away. A briefed pane that reads it is pulled toward the
  unbriefed text, so r → 0 and P_b → P_u, which is **NULL**. Nothing checks for this. 3d greps only the *unbriefed* transcript.
- **The arm mapping is sealed (:439-441), but the order is fixed.** "the unbriefed arm runs first" (:438-439), so for every task the
  hand-back committed before the packet commit is the unbriefed one. `git log` recovers the mapping without the seal. That
  matters for the scorers only if they see history. It matters fully for anyone computing U at step 4 (E), and for the librarian.
  The seal protects less than :439-441 says.
- **Order is also a confound, not only a leak.** The unbriefed arm always meets an earlier room (HEAD, live edge, board) than the
  briefed arm does, on every task.
- **Pin it:** keep the unbriefed hand-back in the keeper's or librarian's scratch, **sealed by sha like the packet**, until the
  briefed hand-back is written. Grep the briefed transcript for the unbriefed hand-back's path. Commit both together.
  Counterbalancing the order is not possible, because the packet would have to be withheld from a later unbriefed arm. So say
  plainly that the order is fixed and the seal covers only the scorers.
- **Step 3a's length check (:428)** is buildable. The sealed row holds only a sha, so the librarian checks length from the
  scratchpad file, and the chair has to hand over the path. Minor.
- **Board-side:** "Nothing in a lap row or board line names an arm" (:439). The chair's delivery verbs are audited. The
  dispatch-gate ledger rows carry `chars` (`consonance/hooks/dispatch-gate.js:292-295`, `dispatch-gate.test.js:461`), so a
  2,000-char packet and a short keeper quote with paths are distinguishable in the ledger. **PLAUSIBLE, not verified.** I did
  not read whether the board row itself carries `chars` or the target pane (§5).

### 3.3 3d, the void grep (:433-434). K5, BLOCKING

- **"the word 'packet_'":** every file under `exo_memory/loop/` named `packet_*` matches, so does any `git log --stat`, and so does
  any cited path that sits beside one. A transcript's own tool results (an `ls`, a Glob) will contain it. The rule voids tasks
  for exploration, not for leaks, and more often in whichever arm explores more, which is the unbriefed one.
- **"the packet's sealed first distinctive line":** not sealed at 3a. Only the packet's sha256 is committed (:427-428). The chair
  names the line at grep time, after it has seen the unbriefed hand-back. That breaks the rule the lap is built on.
- **Pin it:** at 3a, also commit the sha256 of the chosen distinctive line. At 3d, grep for **this task's packet filename** and
  that line, not for the generic prefix.

### 3.4 The redact rule's regex (:406-408). K6, BLOCKING for the blind

The pattern `/\b[A-Z]\b pane|§\d|packet_|[0-9a-f]{7,40}/` is an **alternation of four branches**. The first branch matches only
"<letter> pane". Measured with `node -e` on sample strings:

```
CAUGHT  "B pane wrote"        PASSES  "pane B wrote"      PASSES  "[pane:B]"
PASSES  "B's read"            PASSES  "BRAVO, the read"   PASSES  "ECHO built"
PASSES  "the chair ruled"     PASSES  "the packet says"   PASSES  "HEAD 87B799A"
CAUGHT  "348026190 B"         CAUGHT  "1757000000"        CAUGHT  "§8.9"  CAUGHT "sha 87b799a"  CAUGHT "packet_leave_window"
```

- **The fixture test can pass while the texts leak letters and arm words.** The spec says "removes pane letters, arm words" (:406).
  The regex that tests it checks one word order. Pin it: the fixture test must fail on each of `pane B`, `[pane:B]`, `B's`,
  a NATO callsign, and the arm words, and the arm-word list must be committed.
- **`[0-9a-f]{7,40}` also matches any run of 7+ decimal digits** (byte counts, epochs, offsets), and without `i` it misses
  upper-case shas. If redact.js uses the same class to *remove*, it deletes figures, and figures are one of R8b's claim types
  (:280). A figure claim then becomes unlabellable in the redacted text. That lands as SILENT, which feeds K2's void. Pin it: shas
  are matched as `\b[0-9a-f]{7,40}\b` with at least one letter a–f, case-insensitive.
- **Unredacted arm markers:** "packet", "chair", "ruled", "the brief", "§" written out as "section 2.7". The guess rate (:289-290)
  measures what this costs. It does not stop it. That is declared at :288, so not blocking, but the guess rate needs a stated
  consequence (for example, guess rate ≥ 0.75 voids blindness). None is given.

### 3.5 Fresh panes as blind scorers (:446-453, :464-466)

- **"blind by construction as far as the machine allows":** only half true. The fresh guard (`~/.claude/shell/lib/fresh-guard.js`
  `isFreshCwd`) is consulted by `hooks/session-start.js:304-305`, `hooks/userprompt-submit.js` and `hooks/precompact.js`. Three
  user-global hooks are **not** fresh-guarded:
  - `~/.claude/shell/sessionstart-state.js`: injects the room state block. **Only on `compact` by default**
    (`sessionstart-state.js:50`, `CONSONANCE_STATE_SOURCES || 'compact'`; no override found in settings.json). The block
    carries `HEAD <sha> <subject>` (`consonance/tools/state-block.js:74-79`). A scorer that compacts partway through labelling
    wakes with the subject of whatever the chair last committed. During step 5 that is a claim-list or labels commit, or a
    task's arm commits if they are not all landed. **This lap's own compaction showed it:** my state block read `HEAD 87b799a
    … two fresh panes as blind polarity scorers …`.
  - `~/.claude/shell/findings-return.js`: keyed on `row.pane === basename(cwd)` (:46-49). A `fresh-<8>` basename matches no
    finding row, so it is **inert in practice.** Nothing found.
  - `consonance/hooks/ask-surface.js`: the "ask: N open" line. I did not read what it prints beyond that (§5).
- **"the same for both scorers" (:465-466)** does not cancel it. The scorers label the same texts, so an injection that names an
  arm biases both in the same direction. Agreement goes up, and P moves together.
- **Pin it:** commit subjects during steps 3–5 name no arm and no task. Scorers get `CONSONANCE_STATE_SOURCES=none`, if the keeper
  can set env for a fresh spawn (unverified). Otherwise record whether each scorer compacted.
- **Neutral names and mixing order (:451):** who assigns them is not stated. If the librarian or chair assigns them after the
  arms are known, the order is a channel. Pin it: a seeded shuffle, with the seed committed at step 2.
- **5a:** scorer 1 writes the claim list and then labels against its own list. Scorer 2 checks it for missed claims, but not for
  the *grain* of each claim. Scorer 1's grain choices favour its own labelling, so agreement is inflated toward scorer 1. Small.
  Pin it: alternate the list-writer per task.

---

## 4 · Q4: WHAT LETS A RESULT COME OUT ONE WAY REGARDLESS OF THE DATA?

1. **K1: the negative polarity control is not negative @ed73e76 (:296-300).** R8b scores both controls against
   `packet_leave_window` **@ed73e76**. `handback/p-leave-E_2026-09-14.md:4` says it built against *"(ed73e76), with §2.7
   (9e29daf) overriding, and §2.8 (9c78231, ruled while I built)"*. Its appendix (:272) builds §2.9 (c59530a). It builds my
   contests: D-1 as pid plus proc_listed instead of waiting on the killer (:29-35), D-2, D-4 (:6), and a D-8 item built and
   removed (:173). Against the claims as @ed73e76 states them, those builds "reach a different conclusion on the same point"
   (:283). **They are CONTRADICTS by R8b's own label.** E §5.1 in `p-diversity-c1-E_2026-09-15.md` measured exactly this version
   gap for cosine. R8f made like-for-like a rule of the run (:370-371), but the polarity controls were not held to it.
   **Outcome regardless of data:** P(neg) close to P(pos), so POLARITY INSTRUMENT FAILED (:300) can fire on a working instrument.
   **Fix:** score the controls at the version each actually answered, with p-leave-read-B @ed73e76 and p-leave-E against §2.9
   @c59530a, or pick a negative control that built an unrevised packet.
2. **K2: AFFIRMS-by-reuse** gives P_b < P_u from exposure alone, and a likely-void P_u gives MIXED (§1).
3. **K3: overlap against majority** has no precedence, so the reporter chooses (§2.4).
4. **K4: fixed order plus an early commit.** The briefed arm can converge on the unbriefed answer, which gives NULL (§3.2).
5. **K5: the generic "packet_" void** removes tasks in proportion to how much an arm explores (§3.3). The surviving task set is
   selected on unbriefed-arm behaviour.
6. **Direction of the whole, stated because the chair stated its own stake (:458-462).** K2 pushes toward the chair-indicting
   cells. K4 pushes toward NULL, the chair's pull. K1 pushes toward no polarity result at all. **They do not cancel. They make the
   outcome depend on which defect dominates on four tasks,** and that dependence is invisible in the report.

---

## 5 · WHAT I DID NOT VERIFY

1. **No number re-derived this lap.** E's §5.2 table and the librarian's six-phase means were read, not re-run. No encoder load.
2. **"No board mount" for fresh panes (:399-400).** Not re-read in the MCP mount code.
3. **Whether closing a pane removes its kept row.** `write_kept` at spawn was read in the earlier half of this lap. The close path
   was not.
4. **Whether the board audit row for a chair delivery carries `chars` or a target.** Only the dispatch-gate ledger shape was
   read (§3.2). PLAUSIBLE.
5. **What `ask-surface.js` prints in full,** and whether a fresh spawn can be given an env var.
6. **`state-block.js` output beyond the REPO section.** Read at :62-84 only. Its other sections (JOURNAL, TRIGGERS, the live
   edge?) were seen in my own injected block. It was not checked whether any of them would name an arm during step 5.
7. **How often an unbriefed arm reaches A+C ≥ 3.** K2's void claim is an argument from what the arm receives (:431), not a
   measurement. It can be measured on existing data: label p-leave-read-B, a hand-back that did *not* receive the chair's
   rulings, against a later packet.
8. **No hook was executed.** Everything in §3.5 is from source.

---

## 6 · WRONG (mine)

- **W1. K1 descends from my own §4.2.** `anchor-registration-read-B_2026-09-15.md:160-162` proposed *"B's read against A's and E's
  builds"* as the known-polarity pair for @ed73e76, which treated E's build as compliant. It was compliant with §2.9, not with
  ed73e76. E §5.1 showed that later. R8b inherited my framing. **Class: a control chosen by its author's label ("built as
  ruled"), not by the version it was scored at.** This is the same asymmetry R8f names, and I made it first.
- **W2. I had a PHASE 0 "empty first window" defect drafted,** before rereading :357, which resolves it ("PHASE 0 is §8.2
  exactly"). Withdrawn before filing. What survives is V1 (the head window in SECONDARY), which is a different point.
- **W3. Carried into this lap from my pre-compaction notes: "`sessionstart-state.js` injects room state into a fresh pane."** It
  was stated too strongly. By default it fires only on `compact` (`sessionstart-state.js:50`). The leak is real but conditional
  on a scorer compacting, and §3.5 states it that way.
- **W4. I drafted the sign guard as having a per-phase-r variant that changes outcomes.** It does not, because the control span
  is positive at every phase, so only the numerator sets the sign (§2.2). What survives is V2, r = 0 exactly.

---

## 7 · THE ONE LINE

**The uptake half can be built. The polarity half is not yet the measure it was meant to be. Its negative control fails the
like-for-like rule R8f wrote for everything else, and it failed it on a framing I supplied.**
