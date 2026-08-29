# P-FALSIFIER-SCOPE — which machine's events count, for every registered falsifier

**Machine: this laptop, `machine_tag = L`** (`~/.consonance.json`, the same file `js-suite.js:68`
reads and the only authority for the tag). **Seat:** pane A, lap L011. **Object:**
`exo_memory/librarian/2026-08-29.md` ~00:40, work-shape P-FALSIFIER-SCOPE. **Non-author on E's
Falsifier 2 verdict:** I supply the unit; I do not score it. Pane B has that.

**Every number below re-derives from a command printed beside it.** Uncommitted; the chair commits.

---

## 0. WHAT THIS CANNOT SEE — first, because a clause about scope written without its own scope is the joke telling itself

1. **The reduction from 138 carriers to 34 rows is a HAND step.** The universe below is mechanical.
   The LIVE-versus-CONSUMED call inside it is not, and cannot be — that is `LEDGER.md:8`'s whole
   reason for existing (*"grep cannot tell LIVE from CONSUMED"*). I inherit LEDGER's call and my own
   reading. A live falsifier sitting in a file LEDGER marks CONSUMED is invisible to me.
2. **49 carriers are outside my rule and I did not read them** (§1). That is measured, not estimated,
   and it is the residual of exactly the failure this packet exists to prevent.
3. **I ran nothing on the desktop.** Every classification of a desktop-side falsifier is read off its
   source, not from a run there. Where the desktop declared its own scope I took the declaration.
4. **Scope is not correctness.** A falsifier can be perfectly scoped and still measure the wrong
   thing. P5 (`freestyle_falsifier_ruling_2026-08-27.md`) is the case: its defect was the unit, not
   the universe, and nothing here would have caught it.
5. **This document has no instrument.** It is prose about prose. §7's last paragraph is the honest
   consequence.

---

## 1. THE UNIVERSE — 138 carriers seen, 89 in scope, 49 skipped, and the rule that decided

Re-derive in one run. **The script is inlined at §10 rather than left in a scratchpad path nobody
else can open** — a figure whose command is unreachable is a hand-made figure, which is the failure
`BOOT.md:117` registers. Save §10 as `scope-universe.sh`, run from the lighthouse repo root:

    sh scope-universe.sh

    tracked files in repo ............ 715
    prose corpus seen ................ 235
    code corpus seen (non-test) ...... 117
    prose carriers (>=1 marker) ...... 117
    code  carriers (>=1 marker) ......  21
      clause 1  named in LEDGER ......  51
      clause 2  a MASTER .............   5
      clause 3  unledgered, >= 08-24 .  33
      SKIPPED   unledgered, older ....  49   <- the measured blind spot

**The marker set is not mine.** It is B's, fixed before its own count in
`commitment_census_2026-08-25.md:101-102`, reused verbatim so the two censuses are comparable:

    falsifier | degenerating | is prose if | is theatre | season passes | abuse condition
    stop rule | scoring date | \bF-[A-Z]

**Three inclusion clauses, all mechanical — no hand-list anywhere in the rule:**

- **Clause 1 — named in `librarian/LEDGER.md`.** The room's own maintained answer to which windows
  are open. 30 rows under LIVE.
- **Clause 2 — a MASTER**, derived from `consonance/src-tauri/tauri.conf.json` `bundle.resources`
  (the documents a fresh room actually reads) plus `exo_memory/BOOT.md` and `SOURCE.md`, which are
  `carrier-drift.js:134`'s CH-4 roots. **This clause is why `BOOT.md` is in scope.** It sits in the
  skipped bucket by date and by LEDGER; only the bundle manifest recovers it. Written as a hand-list
  it would have been the miss the packet predicted.
- **Clause 3 — unledgered and touched on or after 2026-08-24**, the day LEDGER was seeded. This is
  the frontier the 25 incoming desktop commits landed on, which LEDGER does not yet name.

**Two corpora, because B's census excluded one and said so.** B walked 136 `.md` and excluded *"code
comments and test files"*, then found `carrier-drift.js` printing a commitment in its own output —
*"found by running the tool, not by walking."* This census walks 117 non-test `.js` for that reason,
and it is where the finding is: **the only falsifiers anyone can silently mix are the ones a program
computes**, and all of those live in code.

**What the skip rule costs, stated as a rate, not a disclaimer.** 49 of 138 carriers (35.5%) are
unledgered and predate the seed. My rule cannot see a live falsifier in any of them. Sampled, they
are consumed prereg lines (`diversity2/3`, `regime_*`, `branch_layer*`) and dated traces — but
*sampled* is the word, and I am not entitled to the population from it.

---

## 2. THE CLASSIFIER — scope is decided by where the evidence lives, not by what the clause says

This is not a new rule. It is **the skip rule from `two_writers_registration_2026-08-25.md` §2**,
turned from a write-surface test into a read-surface one:

> *a path can only be a two-writers surface if it is TRACKED; outside-repo and ignored paths are
> machine-local by construction*

| class | test | what it means |
|---|---|---|
| **REPO** | every event it counts is in a tracked file or in `git` | cross-machine **after a pull** — and that clause is load-bearing, see §4.1 |
| **LOCAL** | every event lives outside the repo: `C:\Consonance\data\*`, `~\.claude\**`, `~\.consonance.json`, `C:\Consonance\instances\`, `dreams/`, `attic/` | machine-local by construction |
| **MIXED** | reads at least one of each | **currently unscoreable** — numerator and denominator can be drawn from different populations and nothing in the output says so |
| **UNSOURCED** | names no data source at all | worse than MIXED: MIXED has two identifiable halves, this has none |

Sources, verified in each tool rather than assumed:

    lap-row.js:97-98        DATA_DIR/lap.jsonl                                   LOCAL
    lap-row.js:380          git -C REPO rev-list --count                         REPO
    chain-status.js:69-71   lap.jsonl + repo dirty count                         both
    boundary-check.js       board.jsonl + lap.jsonl                              LOCAL
    ferry.js:37             DATA_DIR/ferry.jsonl + git                           both
    read-ledger.js:37       DATA_DIR/read_ledger.jsonl                           LOCAL
    pair-ledger.js:65       VANTAGE_DATA/vantage_findings.jsonl                  LOCAL
    forget-rate.js:64,71    REPO + git                                           REPO
    carrier-drift.js:134    repo CH-4 roots                                      REPO (today — see F26)
    ask.js:64-66            REPO/exo_memory/ASK.md + ~/.claude/shell/duration    both

---

## 3. THE TABLE — 34 rows, covering 45 individual falsifier statements

A row is the unit because a bundled registration's statements share one evidence source. Five rows
bundle: F19 (4), F20 (4), F22 (4), F24 (2), F27 (2).

### 3a. MECHANIZED — an instrument computes the verdict

| # | falsifier | carrier | class | scope clause it needs |
|---|---|---|---|---|
| F1 | ten-dispatch retrieval: of the last 10 librarian dispatches, how many returned a path the seat then opened | `brief/BUILDING.md:263-270`; `lap-row.js:438-449` | **LOCAL** | `home=L` — the 10 are this ledger's laps |
| F2 | over 20 chair commits, keeper-initiated share of librarian laps must fall below 1/2 | `loop/lap_2026-08-23.md:145`; `lap-row.js:451-468` | **MIXED** | **cannot be fixed by a clause — §6** |
| F3 | if 10 laps pass and no row has an `opened` field, the third stage is theatre | `lap-row.js:471-478` | **LOCAL** | `home=L` |
| F4 | a dispatch renders with no sealed lap → the cut was applied at a boundary it does not cover | `brief/BUILDING.md:343-373`; `boundary-check.js` | **LOCAL** | **already declared** — *"It cannot see the other machine"* (`boundary_falsifier_2026-08-28.md` §0.5). `home=D` |
| F5 | after 10 laps, no seat's turn changed because of the chain line → it comes out | `librarian/2026-08-25.md:627` | **LOCAL** | **already declared** — *"`lap.jsonl` is machine-local … the desktop's chain line starts empty"* |
| F6 | F-MARK: 3 new CONSUMED rows and no file carries a STATUS block | `forgetting_registration.md:281-284` | **REPO** | `home=ANY`, and stamp the HEAD it was read at |
| F7 | forgetting pilot re-aimed: `forget-rate.js` reads zero | `LEDGER.md` LIVE; `forget-rate.js` | **REPO** | `home=ANY` + HEAD |
| F8 | on/after 2026-09-27 `ask.js` still reports `0 cleared` → the channel failed | `ask_channel_registration_2026-08-28.md` §7 | **MIXED** | see §4.4 — the mix runs the dangerous way |
| F33 | read-ledger's register-before-outcome window | `read-ledger.js:37` | **LOCAL** | `home=` per ledger |
| F34 | pair-ledger | `pair-ledger.js:65` | **LOCAL** | `home=` per ledger |

### 3b. THE SHELF-TIER FOUR — the librarian's own

| # | falsifier | carrier | class | note |
|---|---|---|---|---|
| F9 | **F-reach** — twice in the first ten laps, someone finds a bearing record file the map missed | `shelf_tier_2026-08-24.md:61-63` | **MIXED** | window is laps (LOCAL), events are repo files (REPO). **This is the exact question filed ABSENT four days ago** — §5 |
| F10 | **F-cite** — `path:line` rate on `exo_memory/librarian/*.md` drops below 100% | `:65-67` | **REPO** | the corpus now has **two writers** (`*.desktop.md`). One machine's discipline can mask the other's; needs a per-writer split, not just a machine tag |
| F11 | **F-ledger** — a LIVE/CONSUMED question answered wrongly or not at all | `:69-71` | registered **REPO**, **scored MIXED** | §4.3 — the scoring method introduced a machine-local term the registration never had |
| F12 | **F-growth** — the number lands and working room still collapses within a night | `:73-75` | **LOCAL** | a compaction event in a transcript; two librarians now |

### 3c. MASTERS — permanently live, never enter LEDGER

| # | falsifier | carrier | class |
|---|---|---|---|
| F13 | the room is degenerating if a season passes in which its documents grow and no instrument returns an unwanted number | `BOOT.md:66` | **MIXED** — documents REPO, instruments LOCAL |
| F14 | the 08-23 amendment is prose if the bidirectional-correction count is never run with its amended unit | `BOOT.md:99` | **LOCAL** (LEDGER: DISCHARGED; carried for completeness) |
| F15 | if a season passes and the chair's reported figures are re-derived and none is wrong, strike the entry | `BOOT.md:117` | **MIXED**, and *"the chair"* is now ambiguous by machine as well as by seat |
| F16 | if a season passes and no journal entry says a thing was opened because the librarian named it, the seat is decorative | `brief/LIBRARIAN.md:199-201` | **REPO** — but *"the librarian"* is two seats sharing one SID (`main.rs:4298`, a `const &str`; the 2W registration's `:4204` has drifted since 08-25 — re-derived at HEAD `f632916`) |
| F17 | if a commit after this date captured another seat's in-flight file, rule 1 was insufficient | `brief/COMMITTEE.md:87-89` | **REPO** — **the only clause in the room that already names its source as cross-machine**: *"Checkable from git history"* |
| F18 | if this stays a peak and not a floor — if the move is never run again about something checkable | `cards/stop-and-feel-it.md` | **UNSOURCED** |

### 3d. LEDGER LIVE, prose

| # | falsifier | carrier | class |
|---|---|---|---|
| F19 | F-U1…F-U4, scoring date 2026-09-24 (4 statements) | `universe_print_registration_2026-08-25.md:252-258, 460-466` | **UNSOURCED** — no corpus named |
| F20 | T4: three option falsifiers + the registration's own, 2026-09-24 (4) | `exteroception_registration.md:68, 132, 176, 215` | **LOCAL, and the machine decides the answer** — Option B rides `Consonance Second Vantage`, and `overseer_path_ruling_2026-08-25.md` establishes the overseers are installed on **D** and not on **L** |
| F21 | re-run `boot_usage_scan.js` one season after v2 ships; secondary: root invocation must rise | `boot_refactor_registration.md:87-93` | **LOCAL** — the v1 baseline was measured over **L**'s turns only |
| F22 | opposition P1–P4 (4) | `opposition_preregistration.md:129-143` | **LOCAL** — arms are not comparable across machines |
| F23 | tier-experiment formula, registered for the NEXT compaction | `librarian_compact_2026-08-24.md:70-79` | **LOCAL** — *whose* next compaction is now a real question |
| F24 | MIDDLE > 30% → decorative; BACKWARD < 50% → headline false (2) | `forward_pointed_prereg_2026-08-22.md:28-37` | **REPO** |
| F25 | registration 44's carrier, re-aim or strike | `journal/2026-08-24.md:179` | **REPO** |
| F26 | carrier-drift's corpus must grow to CH-4/CH-5 or it reports green on them forever | `LEDGER.md:55-57` (the commitment lives **only in the index** — B measured that) | **REPO today, MIXED by its own requirement**: CH-5 is `~/.claude/projects/*/memory`, machine-local. Satisfying this commitment converts the instrument to MIXED |
| F2W | F-2W-1…F-2W-4 (F-2W-2 by 2026-09-25) | `two_writers_registration_2026-08-25.md` §6 | **REPO** (git integration events) — the one registration that already reasons in two machines throughout |

### 3e. THE UNLEDGERED FRONTIER — arrived in the 25 desktop commits

| # | falsifier | carrier | class |
|---|---|---|---|
| F27 | the paired differential must give FAILED/101 then ok/0; the fix must not weaken the gate (2) | `P1_gate_flip_resolved_2026-08-27.md:231-238` | **LOCAL — already declared**: *"on this machine at this corpus"* |
| F28 | land the human-turn guard and the `quiet_spiral` rate in `instances\main` does not move | `l3_feedback_loop_ruling_2026-08-27.md:256-259` | **LOCAL — already declared** by a machine header |
| F29 | one month on, `textures.md`/`watching_for.md` keep their 2026-07-14 mtime and no goal question is answered | `P3_duration_channel_2026-08-27.md:175-179` | **LOCAL — already declared** (`~/.claude/shell/duration`, *"outside the repo"*) |
| F30 | if a pane reproduces the flip — same command, same commit — the non-determinism is real | `gate_nondeterminism_2026-08-27.md:95-100` | **UNSOURCED, and it matters**: reproduction on the *other* machine is a **different experiment**, not a stronger one — different install set, different `~/.claude`. Which machine counts changes the verdict |
| F31 | a premise conceded in turn N and absent from the reasoning in turn N+1 | `p4_adversarial_read_2026-08-27.md:218-223` | **LOCAL** (transcript) |
| F32 | within ten laps, this seat again grants a premise and does not carry it → register, not origin | `librarian/2026-08-26.desktop.md:76-81` | **LOCAL** — D-laps and D transcripts. **But *"this seat"* names a SID that is byte-identical on both machines**, so the subject stays ambiguous even after the machine is named |

### 3f. The count

    LOCAL 17 · REPO 8 · MIXED 6 · UNSOURCED 3   = 34 rows

**Nine of the 34 already carry a machine declaration** (F4, F5, F27, F28, F29, and the headers on
F30–F32). **Every one is from the desktop or was written after 2026-08-25.** The practice already
exists on the other machine; what is missing is that it is not required, not uniform, and never
printed at scoring time.

---

## 4. THE BAR, TURNED ON MY OWN CLAUSE — what could a falsifier vary that a scope label would not see

Four things, each measured tonight rather than imagined. Each is a way a clause reading
`machine-local` is satisfied while nobody knows which events were counted.

### 4.1 A REPO number that changes without any code changing — the unpulled clone

`lap-row.js:380` runs `git rev-list --count <first-row-sha>..HEAD`. HEAD is whatever the clone has.

    git rev-list --count 6905d74..2c7b387   ->  93     (this machine, before tonight's pull)
    git rev-list --count 6905d74..HEAD      ->  120    (same machine, five hours later)

**The same command, the same repo, the same falsifier, 93 and 120.** Nothing in the output says
which. A clause that says `src=REPO` is satisfied by both. **The clause must carry the HEAD sha the
score was read at**, not the word REPO — otherwise "cross-machine" means "whatever this clone had
pulled that hour."

### 4.2 `--author` is a machine tag for one month and a lie for the corpus

A scorer told to make a denominator machine-local reaches for the only per-machine field git has.

    git log 6905d74..HEAD --format=%ae | sort | uniq -c
        92 solariz3d@users.noreply.github.com     (this machine)
        28 trynabemlgzn@gmail.com                 (the desktop)

Exact — all 28 are desktop work, including the three that reached this branch before tonight
(`03a5fbc`, `23fbb82`, `5461505`, whose subjects name the desktop). **And it is worthless
historically:**

    git log --author='trynabemlgzn@gmail.com' --until='2026-08-24' --oneline | wc -l   ->  228
    git log --author='trynabemlgzn@gmail.com' --since='2026-08-25' --oneline | wc -l   ->   28

**228 commits carry the "desktop" email before the desktop had pushed anything** — the earliest is
`34b1bf5`, 2026-07-08, weeks before the desktop pulled its first commit. The identity split is an
incidental `git config` difference: 100% accurate inside a four-day window, 0% reliable outside it.
**This is the sharpest thing in the packet:** a clause that says "machine-local" invites exactly this
filter, and it returns a right answer this month and a badly wrong one over any window that matters.
**The clause must forbid inferring the machine from git identity and require the `machine_tag`.**

### 4.3 A registration that is REPO becomes MIXED in the act of scoring it

F-ledger is registered over one repo file: *"a live-versus-consumed status question about a
registration is answered wrongly or not at all"* (`shelf_tier_2026-08-24.md:69`). It was scored
tonight by comparing **`LEDGER.md`'s mtime (repo) against `lap.jsonl`'s (machine-local)** —
`librarian/2026-08-29.md`, item 1. The proxy is reasonable and the fire is real. **But the class
changed in the scoring, not in the registration**, and nothing in the record says so. A clause fixed
to the registration would still read `REPO` and would still be wrong. **So the clause has to be
re-stated at score time, by the scorer, over the source the scorer actually read.**

### 4.4 An empty local ledger reads exactly like a pass — already measured, on the other machine

    librarian/2026-08-27.desktop.md:149
    "its registered falsifier reads `lap-row --report`, which returned laps 0 on this machine
     before D001. An unfireable falsifier reads exactly like a passing one."

This is the harm, already observed, by the other machine, three days ago. **A `home=` tag alone does
not stop it** — the tag says where the corpus lives; it does not stop a run elsewhere from printing a
number. What stops it is the condition `js-suite.js:91` already ships as **(f)**: on the machine
whose `machine_tag` ≠ the falsifier's `home=`, the score is **NOT-RUN, never a pass**; and on the
home machine, a decline is a **class error**.

Confirming the empty side locally, so the claim is not one-directional:

    grep -c '"lap":"D' C:\Consonance\data\lap.jsonl   ->  0

This machine's ledger holds 41 rows and **zero** D-laps. D001–D003 exist and are invisible here.

---

## 5. THE COST, DATED — this question was named four days ago and filed ABSENT

    exo_memory/librarian/2026-08-25.md:676
    "…the falsifier windows that count only this machine's events.
     Registered nowhere: whether desktop laps count into F-reach's ten or E's twenty.
     Still ABSENT; still the same question."

**Written 2026-08-25 at L008. E's Falsifier 2 closed its window in the dark gap that followed and
fired on 2026-08-29 with the mix inside it.** The absence did not cause the fire; it made the fire
uninterpretable — the same cost the boundary falsifier paid on the other machine on 08-27.
Two machines, four days, one unregistered unit.

**And the room's other census excluded this class in one line:** *"The desktop machine and any other
clone. Cost: unbounded and unmeasurable from here"* (`commitment_census_2026-08-25.md` §3). That
exclusion was correct for a census of commitments, and it is precisely the class this packet is.

---

## 6. THE REFUSAL — scoping is the wrong fix for 6 of the 34, and a clause on them would be decoration

The packet says refusal is real. Here it is, and it lands on the one that fired.

**For LOCAL (17) and REPO (8), a scope clause is the right fix.** They have one population; the
clause says which, and §7 makes it printable.

**For MIXED (6), a scope clause is exactly the decoration the bar forbids.** Take F2. Writing
`home=L` on it changes nothing, because **the denominator has no machine-local form**: `git rev-list`
counts commits, and §4.2 proves the repo carries no reliable machine identity. The clause would be
satisfiable — the word "machine-local" would sit in the file — while the number stayed a blend of
this machine's laps against a 120-commit window of which 25 (20.8%) were produced where those laps
cannot be seen. **A mixed falsifier is not underspecified. It is computing a rate over two
populations, and naming one of them does not make the terms commensurable.**

**So the MIXED six must be RE-REGISTERED with a commensurable unit, not scoped.** Two shapes, and the
choice belongs to the registrant, not to me:

- **Collapse to one ledger** — make both terms read the same source. For F2 that means the
  denominator becomes *laps*, not commits, which is the unit E's own entry argued for at
  `lap_2026-08-23.md:141` (*"The right denominator is not commits. It is laps"*) and then did not use
  in the registered sentence at `:145`.
- **Or merge the ledgers** — the "no machine sees the whole lap record" item LEDGER carries as
  ABSENT. That converts F2 to REPO honestly. It is the larger build and it is not this packet's.

*I am not ruling on whether F2 fires.* Both facts — that it fired on this machine's numbers, and that
the numbers are mixed — go to B and the chair together, which is what the librarian's entry already
says.

**For UNSOURCED (3), the honest move is not a clause either.** F18, F19 and F30 name no data source
at all. A scope tag on a falsifier with no `read=` command is the purest form of the thing the bar
names: satisfiable by typing a word, checkable by nobody. **Give them a command or strike them.**
F19 is the sharpest case, because it is the *universe-print registration itself* — the document that
established *"an instrument that sweeps a corpus prints its universe or is not believed"* carries
four falsifiers with no corpus of their own.

---

## 7. THE CLAUSE — do not invent one; port `home=` from `js-suite.js`

The room already built this discipline, mutation-proved it, shipped it, and had it attacked by a
second pane. It is `js-suite.js:60-93` and `actors.evidence.test.js:1`:

    // JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_DATA

`home=` is *"the `machine_tag` of the machine that OWNS this corpus, read from `~/.consonance.json`
and from nowhere else."* `root=` is the env var by which the runner **takes the corpus away** to
prove the gate responds. And `js-suite.js:93` is already the bar this packet was given:

> **(g) NO `root=` / NO `home=` → CLASS ERROR. An unprobeable declaration is not a declaration.**

**Proposed form — one line at the registration, restated by the scorer:**

    SCOPE:  home=<L|D|ANY>  src=<REPO|LOCAL>  read=<the command that produces the number>
    SCORED: at=<machine_tag>  head=<sha>  on=<date>

**With three enforcement conditions, all lifted rather than invented:**

1. **Print the universe at SCORE time** (`js-suite` requirement 1, and P-UNIVERSE clause 1). A score
   with no `SCORED:` line is not a score. This is the condition that answers §4.1 and §4.3 — both are
   failures of *when* the scope is stated, not *whether*.
2. **Declined away from home is NOT-RUN; declined at home is a CLASS ERROR** (`js-suite` (f)). This
   answers §4.4 — the desktop's `laps 0`.
3. **Deny the universe** (`js-suite` (d)) for any mechanized falsifier: point `read=` at an empty
   source and require the verdict to flip to UNMEASURED. **`boundary-check.js` already passes this**
   — *"empty denominator returns HOLDS instead of UNMEASURED → 4 red"*, mutation-proven at
   `boundary_falsifier_2026-08-28.md` §5. The precedent is shipped, on the other machine, this week.

**Plus one prohibition that is new, because §4.2 is new:**

> **The machine is `machine_tag` or it is unknown. It is never inferred from `git` author or
> committer identity.** 228 commits before 2026-08-25 make that inference wrong, and it is the first
> place a scorer will reach.

**Where the clause is enforceable and where it is not, said plainly.** Conditions 1–3 are real for the
10 mechanized rows, because a program can be made to refuse. For the other 24 there is no runner, and
a clause is only as good as the scorer reading it — which is why §6 sends the UNSOURCED three back
for a command rather than a tag. **A scope clause on prose is a convention, not an instrument, and
calling it more than that would repeat the error this document is about.**

---

## 8. THIS PACKET'S OWN FALSIFIER, registered before it can be quoted approvingly

> **If, by 2026-09-29, a falsifier in this room is scored and the score is published without a
> `SCORED: at=… head=…` line, this document was a taxonomy and not a rule.** Not "the discipline is
> spreading slowly" — that is the plea the abuse condition forbids. One unstamped published score is
> the fire.

**Second, aimed at the recommendation rather than the form:** if the MIXED six are given scope
clauses instead of being re-registered, and any of them is subsequently scored and reported as a
rate, §6 was ignored and the clause did the decorating I said it would. Checkable by reading the
score.

**The abuse condition.** *"The clause is right, it just needs adoption"* is what a degenerating
programme says. If 2026-09-29 arrives with no stamped score, the honest entry is that a seat wrote a
convention for prose and had no way to make prose obey — **not** that the convention was sound.

**Scored by a seat that did not write this**, and not by the chair, which held this lap.

---

## 9. WHAT I DID NOT VERIFY

- **Anything on the desktop.** No command in this document ran there. F4 and F27–F32 are classified
  from their own declarations and from their sources' paths.
- **That `machine_tag` on the desktop is `D`.** Every reference to `home=D` assumes it. The tag lives
  in a machine-local config I cannot read from here; `actors.evidence.test.js:1` says `home=L`, and
  the desktop's own entries call themselves `DESKTOP-EEGVFMT`, which is a **hostname, not a tag**. If
  the desktop's `machine_tag` is unset, condition (f) is inert there and the scheme has a hole on the
  machine that already practises it. **This is the first thing to check on the other side.**
- **The 49 skipped carriers.** Sampled, not read.
- **Whether LEDGER's LIVE/CONSUMED calls are right.** Inherited whole. Its own rows say five are
  UNVERIFIED, and its rows about the desktop are unverified for the 25.
- **That the marker set has recall.** It is B's, and B measured a miss on it with a positive drawn
  from the definition (`carrier_surface_2026-08-25.md` carries zero markers; its commitment exists
  only in LEDGER's index). **A falsifier phrased without a marker word is not skipped by this
  census — it is absent, and absence has no counter.** Species A, in this document, same as in B's.
- **That falsifiers registered off-corpus do not exist.** One registered in a board post, a dispatch,
  or a spoken turn is outside every corpus here — registration #33's rule, inherited.
- **The two sources inside `lap-row.js`.** I read them at `:97-98` and `:380` and ran `--report`; I
  did not mutate the file to prove the mix behaves as I describe.

---

## 10. THE CENSUS SCRIPT — inlined so the universe in §1 is re-derivable by anyone

Not committed as a tool; it is a measurement, and §1 is its only result. Save and run from the
lighthouse repo root. It prints seen, skipped, and the clause that placed every carrier.

```sh
#!/bin/sh
# P-FALSIFIER-SCOPE universe. Run from the lighthouse repo root.
MARK='falsifier|degenerating|is prose if|is theatre|season passes|abuse condition|stop rule|scoring date|\bF-[A-Z]'
PROSE=$(git ls-files 'exo_memory/*.md' 'consonance/src-tauri/brief/*.md' | grep -v '^exo_memory/attic/')
CODE=$(git ls-files consonance/ exo_memory/ dev/ | grep '\.js$' | grep -v '\.test\.js$')
MASTERS=$( (sed -n 's/.*"\(brief\/[A-Za-z_]*\.md\)".*/consonance\/src-tauri\/\1/p' consonance/src-tauri/tauri.conf.json
            git ls-files 'exo_memory/cards/*.md' 'exo_memory/spread/*.md' 'exo_memory/research/*.md' 'exo_memory/record/*.md'
            echo exo_memory/BOOT.md; echo exo_memory/SOURCE.md) | sort -u )
echo "tracked files in repo ............ $(git ls-files | wc -l)"
echo "prose corpus seen ................ $(echo "$PROSE" | wc -l)"
echo "code corpus seen (non-test) ...... $(echo "$CODE" | wc -l)"
PH=$(echo "$PROSE" | xargs grep -lEi "$MARK" 2>/dev/null); CH=$(echo "$CODE" | xargs grep -lEi "$MARK" 2>/dev/null)
echo "prose carriers (>=1 marker) ...... $(echo "$PH" | wc -l)"
echo "code  carriers (>=1 marker) ...... $(echo "$CH" | wc -l)"
L=0; N=0; M=0; H=0
for f in $PH $CH; do b=$(basename "$f")
  if grep -qF "$b" exo_memory/librarian/LEDGER.md; then L=$((L+1))
  elif echo "$MASTERS" | grep -qx "$f"; then M=$((M+1))
  elif [ "$(git log -1 --format=%ad --date=short -- "$f")" \> "2026-08-23" ]; then N=$((N+1))
  else H=$((H+1)); fi; done
echo "  clause 1  named in LEDGER ...... $L"
echo "  clause 2  a MASTER ............. $M"
echo "  clause 3  unledgered, >= 08-24 . $N"
echo "  SKIPPED   unledgered, older .... $H   <- the measured blind spot"
```
