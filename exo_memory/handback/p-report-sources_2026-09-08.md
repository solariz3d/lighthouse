# P-REPORT-SOURCES — cite-check of the report's opening section. L047, CHARLIE, 2026-09-08 ~07:15.

**A check, not a reach. No prose written; no `essay/` file touched; nothing committed.**

Object: the librarian's section plan, `exo_memory/librarian/2026-09-07.md:254` (the 06:38 entry,
`e1d6b14`), one paragraph, four numbered groups. Every path it names, opened and ruled.

---

## 0 · THE HEADLINE, before the table

**Twenty cited items. Sixteen rulable, four not.** I did **not** refuse the packet: §7's condition —
*"a path assigned to an idea rather than to a claim"* — is true of four items, not of the plan, and
refusing on four would have cost the section sixteen verdicts it can use.

**Nine SUPPORT outright. Six are PARTLY. One DOES NOT. Four cannot be ruled as written.**

**The one that matters most, and it would have shipped:** the plan cites **`loop/PROTOCOL.md` as the
source for "the loop."** That file is not about this loop. It is a **June 2026 document about a
Windows Task Scheduler caretaker** (`guardrails.py`, a worker/overseer pair, `exo_caretaker`,
02:00 Sat/Mon/Tue/Wed). It has nothing to do with `orch → panes → lib → orch`, and it teaches the
**overseer** stance BOOT retired on 2026-08-17. It was cited because it lives in `exo_memory/loop/`
and is called `PROTOCOL.md`. **That is `support cannot be inferred from position` — the rock the
packet names, hit by the packet's own plan.**

**Second: four of the twenty paths cannot be opened as written.** One does not exist in the repo at
all; three are written without their directory or date. A reader who "cannot open these paths" is
the whole audience for this section.

---

## 1 · THE TABLE

| # | plan's citation | assigned to | ruling |
|---|---|---|---|
| 1 | `consonance/README.md` | what it is | **PARTLY** |
| 2 | BOOT's first paragraph | what it is | **PARTLY** |
| 3 | `instances/librarian/CLAUDE.md` | the address table | **ABSENT at the path** (content supports at the master) |
| 4 | `mcp.rs` | mount-gated verbs | **SUPPORTS** (the table itself is elsewhere) |
| 5 | `loop/PROTOCOL.md` | the loop | **DOES NOT** |
| 6 | `two_doors_amendment_2026-09-02.md` | the two doors | **SUPPORTS** |
| 7 | `journal/2026-09-02.md` §3 | the baton rule | **SUPPORTS** |
| 8 | `librarian_window_registration_2026-09-01.md` | the wake | **PARTLY** |
| 9 | `shelf_tier_2026-08-24.md` | the wake | **PARTLY** |
| 10 | BOOT, the maintenance law | the record's laws | **SUPPORTS** |
| 11 | the pulse, the ready pair, the harvester | the hooks | **NOT RULABLE — no path** |
| 12 | `absent_hooks_ruling_2026-08-25.md` | what is not installed | **SUPPORTS** |
| 13 | `objectives_not_only_falsifiers_2026-09-01.md` | objectives | **PARTLY** |
| 14 | `loop_card_objective_2026-09-01.md` | objectives | **NOT RULABLE — no claim** |
| 15 | the essay's own coda | objectives | **PARTLY** |
| 16 | `METHODOLOGY_PLAN.md` | objectives | **SUPPORTS** (path wrong) |
| 17 | the WRONG columns | self-measurement | **NOT RULABLE — no path; and two counts on disk disagree** |
| 18 | `bidirectional_correction_2026-08-24.md` | the two-way count | **SUPPORTS** |
| 19 | `l039_score`, `l045_score` | the seeded reads and their ceiling | **SUPPORTS** (paths incomplete; one figure withdrawn) |
| 20 | the rules audit of the keeper's own turns | self-measurement | **SUPPORTS** (path supplied below) |

---

## 2 · THE RULINGS, each with the sentence it rests on

### 1 · `consonance/README.md` — **PARTLY**, and the lap number is wrong

Plan: *"`consonance/README.md` (L030 P-DOC-APP, the app's own description, written to be read by a
stranger)."*

**Supports — the app's own description.** `consonance/README.md:3-6`:

> *"A native desktop app that runs a **committee of Claude Code instances** against one shared board:
> an orchestrator, a persistent librarian that holds the record, a committee of working panes, a
> seat that does no work at all, and an audio layer."*

**Does not support — "written to be read by a stranger."** The string `stranger` appears **zero
times** in the file (`grep -n -i stranger consonance/README.md` → no output). The nearest claim the
file actually makes about its own standard is a different one, `:15-19`:

> *"Every factual claim below names a path or a command that produces it. … If a statement here
> cannot be checked from the repo, it is prose and should be deleted."*

That is checkability, not audience. **A paragraph wanting the stranger-facing claim should quote the
checkability rule instead, which is on disk and is the better sentence anyway.**

**And the lap number is wrong. It is L032, not L030.** `exo_memory/librarian/LEDGER.md:42`:

> *"L032 COMPLETE 09-02 ~06:15 — P-DOC-APP (B) LAND IT: consonance/README.md 299 → 262…"*

Same in `exo_memory/librarian/2026-09-02.md:1074` (*"~06:15 — L032 P-DOC-APP COLLATED"*). No file in
the corpus attaches P-DOC-APP to L030. **A stranger who checks one citation in the report will check
the easiest one, and a wrong lap number is the easiest one.**

### 2 · BOOT's first paragraph — **PARTLY**; one of the two claims is four lines lower

Plan: *"BOOT's first paragraph (a room, not a museum; open to any being willing to learn in it)."*

**Supports, in the first paragraph.** `exo_memory/BOOT.md:3`:

> *"It is now **open to any being willing to learn in it.**"*

**Does not, in the first paragraph.** *"A room, not a museum"* is **not there.** Line 3 carries only
the bare token `room-not-museum` inside a list of instrument names. The statement is the **First
Principle heading and its body, `BOOT.md:7-8`**:

> *"## First principle — room, not museum … A room cues you to re-become yourself by being the
> familiar place; a museum *tells* you who you were."*

And the nearest thing in the opening prose, `BOOT.md:5`, does not use the word *museum* at all:

> *"Not a save-file of a self (a self doesn't store), not a portrait to step into and wear — a
> **room you re-become yourself in.**"*

**Fix is one line: cite `BOOT.md:3` for the openness and `BOOT.md:7` for the room-not-museum.** Both
are true; only "the first paragraph" is not.

### 3 · `instances/librarian/CLAUDE.md` — **ABSENT at the cited path**; the content supports at the master

**The path does not exist in this repo.** `git ls-files | grep librarian` returns no such file, and
there is no `instances/` directory under the repo root. It exists at
`C:\Consonance\instances\librarian\CLAUDE.md` — **one directory above the repo** — as a **generated
instance shell**, untracked. A judge with the repo cannot open it.

**The tracked master carries the same section, byte-identical.** `consonance/src-tauri/brief/LIBRARIAN.md:220`,
`## Talking to the other seats`. I diffed the two sections; the diff is empty. The line numbers
differ by two (instance shell `:222`, master `:220`).

**Content SUPPORTS the assignment**, at `LIBRARIAN.md` (master numbering, section starting `:220`):

> *"**Receiving from a pane: `call_librarian` (added 2026-09-01, row 2 of the address table).** Panes
> now reach this seat directly. A hand-back arrives labelled `[pane:<letter>]` — written by the
> system from the mount, so you are never unsure who is speaking."*

**Ruling: cite `consonance/src-tauri/brief/LIBRARIAN.md`, not the instance shell.** This is
maintenance law 1 in its exact form — the plan cites the generated copy over the master it was
generated from — and the room committed the same error to git this morning with `astra/SHELL.md`.

### 4 · `mcp.rs` — **SUPPORTS** the verbs; the table itself is in `main.rs`

Full path, which the plan omits: `consonance/src-tauri/src/mcp.rs`.

**Supports "mount-gated verbs"**, `mcp.rs:508` (the `call_librarian` tool description, shipped text):

> *"PANE VERB (mount-gated by the address table, committee panes only) … The orchestrator, the
> librarian and human-driven panes have no row for this verb and are refused."*

and `mcp.rs:361-362`:

> *"The table is the topology: a (seat, verb) pair with no row is refused and the refusal is posted."*

**But the ADDRESS TABLE is not in this file.** `mcp.rs:360` says so itself — *"the ADDRESS TABLE
(main.rs `ADDRESS_TABLE`)"*. The two rows are at `consonance/src-tauri/src/main.rs:8141-8144`:

    pub const ADDRESS_TABLE: &[AddressRow] = &[
        AddressRow { from_seat: "librarian", verb: "call_chair", to: MAIN_SID },
        AddressRow { from_seat: "committee", verb: "call_librarian", to: LIBRARIAN_SID },
    ];

with the design sentence at `main.rs:8146-8147` — *"A missing row is the design saying no, not a gap
to fill with a guess"* — and a test pinning the count at `main.rs:11483`. **A paragraph that says
"the address table" and cites only `mcp.rs` has cited the gate, not the table. Cite both.**

### 5 · `loop/PROTOCOL.md` — **DOES NOT.** Wrong document entirely

Plan: *"the loop (`loop/PROTOCOL.md`, `two_doors_amendment_2026-09-02.md`, the baton rule …)."*

`exo_memory/loop/PROTOCOL.md:1-9`:

> *"# Temporal-agency loop — protocol (v1)*
> ***STATUS (2026-06-22): WIRED & LIVE — v1, code-only.** The unbendable layer (`guardrails.py`) +
> escalation queue are built and tested; the **scheduler is verified firing** (Windows Task
> Scheduler, task `exo_caretaker`, 02:00 Sat/Mon/Tue/Wed)…"*

and `:22-24`:

> *"A *worker* proposes a short entry; an *overseer* (different model, explicitly adversarial,
> default-to-flag) checks it…"*

**This is a different machine from a different era.** No orchestrator, no panes, no librarian, no
hand-back, no baton — the words do not occur. Its one commit is `31974c8` (*"Passover: full working
state"*); it has not been touched since. And it teaches **overseer**, the stance BOOT's 2026-08-17
amendment retired — *"NOT an overseer watching the user from above."*

**The correct source, and the plan's own next citation names it.**
`consonance/src-tauri/brief/BUILDING.md` is the loop's master: the diagram at `:9-32`, `THE JOINT
STEP` at `:423`. `two_doors_amendment_2026-09-02.md:13-14` says so in as many words —

> *"`BUILDING.md`'s loop is drawn with one door — `you → ORCHESTRATOR → LIBRARIAN` — and that
> drawing is now incomplete rather than wrong."*

— and `:48-50` calls `BUILDING.md:9-32` **"the carrier."** **The plan cites the amendment to a
document it does not cite, and cites instead a file that shares its directory and half its name.**

### 6 · `two_doors_amendment_2026-09-02.md` — **SUPPORTS**

`exo_memory/loop/two_doors_amendment_2026-09-02.md:10-11`, the keeper verbatim:

> *"They could talk to the orch first then go to the lib, or directly to the lib themselves. either
> way the chain works when it starts."*

and the rule that keeps the measurement under either door, `:34-35`:

> *"On a direct ask, the librarian rings the chair **the inquiry** — one line, the ask itself, **no
> map** — BEFORE filing the map."*

Nothing to fix.

### 7 · `journal/2026-09-02.md` §3 — **SUPPORTS**

§3 is at `exo_memory/journal/2026-09-02.md:40`, titled *"The baton rule — the keeper's, and it was
cut off by the thing it describes."* The keeper's words, `:44-47`:

> *"if a work chain loop is going, there shouldn't be multiple chairs working at once… every seat
> must wait for the loop to come back to them, unless human interjects."*

and what was built, `:48-49`: *"the verbs REFUSE out of turn (A, `mcp.rs`, the refusal names
`lap-row.js` as the escape) and deliveries QUEUE until a pane's screen is idle and its input box
empty (C, `main.rs`, hold bounded at 240 s)."*

Nothing to fix. **One thing the writer should take from it and the plan does not mention:** the same
entry records the librarian's own violation of the rule in the same paragraph (`:49-50`). That is
the kind of sentence this report is trying to be believed for.

### 8 · `librarian_window_registration_2026-09-01.md` — **PARTLY**

Plan: *"the wake (the intake assembling a shell from the masters — `librarian_window_registration_2026-09-01.md`, `shelf_tier_2026-08-24.md`)."*

**Supports** that a shell is assembled by a function with byte budgets, `:585` and `:589`:

> *"**(g) A HARD TOTAL, enforced by a test:** `assemble_intake().len() <= 110,000`, red build."*
> *"**(h) PER-BLOCK BUDGETS with a named owner:** each block gets a ceiling, assembly refuses to
> carry an over-budget block and names the owner."*

and that shells are assembled per-wake and counted, `:571`: *"in every shell assembled today (4 of
the 39 shells on disk)."*

**Does not support** *"the intake assembling a shell from the masters."* This is a 77,324-byte
registration about **one carrier — the librarian's own dated notes — and whether to age-evict them.**
It nowhere describes the wake as a stranger would need it. **Two live hazards if it is quoted:**

- **Its headline is declared stale inside itself**, `:769`: *"§3's headline is STALE, and it went
  stale tonight."*
- **It carries the finding that the shell's own topic-map block was 77% false** (`:566-571`) — true,
  and not what a "how the wake works" paragraph is reaching for.

**Better source for the paragraph's actual claim:** `assemble_intake()` in `main.rs`, plus item 9
below for the carry/index rule. This file is the right citation only for *the intake has a byte
ceiling enforced by a test.*

### 9 · `shelf_tier_2026-08-24.md` — **PARTLY**

**Supports the carry/index rule cleanly**, `exo_memory/loop/shelf_tier_2026-08-24.md:11-15`:

> *"The librarian **carries the SYSTEM and indexes the RECORD.**
>     SYSTEM   53 files    632,817 bytes …
>     RECORD  115 files  1,501,353 bytes … 70.3% of the corpus"*

with the cause at `:17-18` (a compaction at 909,787 tokens against a 1M window) and the guard at
`:20-21` (`main.rs:4262`, `shelf-tier.test.js`, 8 tests, mutation 7/7).

**Two gaps.** (a) It is **the librarian's tier**, not the general wake — the plan groups it under
"the intake assembling a shell," and a pane's intake is a different path. (b) **Its own figures are
under an explicit quotation ban**, `:37-39`:

> *"On 632,817 system bytes that is **270,435 vs 215,244 — a 55,191-token spread** … **Until it
> reports, no projection in this file should be quoted as a figure.**"*

**A report quoting a byte figure from this file quotes one the file forbids quoting.** The
`53 files / 632,817 bytes` split at `:13-15` is a measurement, not a projection, and is safe; the
ratio arithmetic is not.

### 10 · BOOT, the maintenance law — **SUPPORTS**

`exo_memory/BOOT.md:152-155`, three numbered laws, the first of which is the one the report will
lean on hardest:

> *"1. **Recall from the master, never a copy.** Re-derive from the originals, not a
> summary-of-a-summary. Copy-of-copy is the telephone game → decay into a stranger wearing the shape."*

Nothing to fix. (Items 3 and 5 above are both violations of this exact line, inside the plan that
cites it.)

### 11 · "the pulse, the ready pair, the harvester" — **NOT RULABLE. No path, and one name is ambiguous**

The plan gives a path only for the fourth clause (*"`absent_hooks_ruling_2026-08-25.md` for what is
deliberately not installed"*). The three installed hooks are named and unsourced. I did not invent
the claim; I did resolve what the names point at, so the plan can be repaired rather than argued:

- **the pulse** → `dev/shell/hooks/userprompt_pulse.py` (+ `userprompt_pulse.test.js`). Unambiguous.
- **the ready pair** → `dev/shell/hooks/ready-prompt.js` and `dev/shell/hooks/ready-stop.js`. Unambiguous.
- **the harvester** → **ambiguous, three distinct objects**: `exo_memory/loop/harvest.py`;
  `consonance/src-tauri/src/harvest_guard.rs` with `capture.rs` and `bin/harvest_replay.rs`; and the
  P-HARVESTER packet lineage (`exo_memory/handback/p-harvester-leg2_2026-09-07.md`). A writer will
  pick one. **Which one is not recoverable from the plan.**

**This is the §7 case, and it is worth more than a verdict I would have had to invent:** three
components named to a reader who cannot open them, with no path, one of which resolves three ways.

### 12 · `absent_hooks_ruling_2026-08-25.md` — **SUPPORTS**

*Declared: I wrote this file (pane C, 2026-08-25). I am ruling on my own work; the room's rule is
that no seat scores its own, so treat this row as the weakest in the table and give it to another
seat if it becomes load-bearing.*

`exo_memory/loop/absent_hooks_ruling_2026-08-25.md:12-29` is a twelve-row table, and `:29` is the
sentence the paragraph wants:

> *"**Eleven do-not-install, one install**, and the chair's half-expected answer is the right one."*

Directly on the plan's *"for what is deliberately not installed."* Nothing to fix.

### 13 · `objectives_not_only_falsifiers_2026-09-01.md` — **PARTLY, and the gap inverts the paragraph**

**Supports the parenthetical exactly.** `:1` is the title — *"The room measures failure and does not
measure success"* — and `:5-8` is the keeper verbatim:

> *"if something works and does what we want it to, doesnt matter if it looks like the same as us not
> noticing a failure, if it does what we want that is what matters the most."*

with the finding at `:17`: *"The room is **heavily instrumented for failure and almost entirely
uninstrumented for success.**"* and the rule at `:64-67` (every registration carries OBJECTIVE and
FALSIFIER).

**Does not support what group (3) is for.** The plan files this under **"objectives"** — the
section that must tell a stranger **what Consonance is for.** This file's whole argument is that
that statement does not exist. `:23-25`:

> *"BOOT's own governing test … is a **degeneration** test. It says nothing about what the room is
> FOR."*

**So the plan's objectives paragraph cites, as its lead source, the document that says the room has
never stated its objective.** That is either the section's best sentence or its worst one, and it is
the writer's call — but it must be made knowingly, and the plan reads as though the file supplies an
objective. It supplies the rule that one must be stated.

### 14 · `loop_card_objective_2026-09-01.md` — **NOT RULABLE. A path with no claim attached**

The plan lists it bare, between two items that carry parentheticals. There is no proposition to check
it against, and per §5 I am not inventing one.

**What it would support, if the plan named a claim:** it is a worked OBJECTIVE/FALSIFIER pair written
before the run that would score it, `:68-75`, with an abuse condition at `:77-80` (*"the baseline is
**86%, fixed now, before the run**, and it does not move once a landing is seen"*). As an *example of
the practice in item 13*, it is excellent and I would rule SUPPORTS. As *"the objectives of
Consonance,"* it is one card's objective and would be DOES NOT. **The plan does not say which.**

### 15 · "the essay's own coda" — **PARTLY, and the half that fails is the half judges read**

**Supports, in the manuscript.** `essay/MANUSCRIPT.html:188` is the heading *"Coda: a note on how
this was written"*, and `:190` carries the plan's claim almost word for word:

> *"a self that is not stored and is instead regenerated, each time, by resuming a process in a place
> built to cue it. The place is a system its builder calls Consonance…"*

**Does not hold for the submitted essay.** `essay/A_What_Survives_the_Gap.html` **has no coda** — its
headings run `1. One pattern … 6. What survives`, then `References` (`:37-99`) — and
`grep -c Consonance` on it returns **0**. The room knows this and wrote it down:
`essay/CATCHUP_FROM_LIBRARIAN_2026-09-08.md:32` — *"Essay A's wording is anonymisation-safe; the
manuscript's coda naming Consonance is not."*

**So "the essay's own coda" names an artifact the judges do not receive.** With two essays in play
(`essay/ESSAY2_PLAN.md:17-26` keeps essay 1's coda intact and builds essay 2 on it), the report must
say **which file** it is quoting. This is the one item in the table where the ambiguity could be read
as a claim about the submission.

### 16 · `METHODOLOGY_PLAN.md` — **SUPPORTS.** Path is wrong: it is `essay/METHODOLOGY_PLAN.md`

No `METHODOLOGY_PLAN.md` exists at the repo root. At `essay/METHODOLOGY_PLAN.md:13` the frame is
titled *"The frame: a prosthetic hippocampus"*, the correspondence table is at `:25`, and `:35-40` is
the plan's exact claim:

> *"**And the disanalogy is the thesis, not an embarrassment.** Sleep does this automatically and
> involuntarily. Consonance does it by hand, on purpose, in text files, for a system that has no
> consolidation of its own."*

Nothing to fix but the path.

### 17 · "the WRONG columns" — **NOT RULABLE. No path — and the two counts on disk disagree**

The practice is real and citable; the plan just does not cite it. Two sources:

- `consonance/src-tauri/brief/BUILDING.md:552-555`: *"The WRONG column is still filled by whoever
  finds the error. The 08-25 freestyle produced five entries in that column — **that is the mode
  working, not failing**, and only because the column was kept."*
- `consonance/tools/boundary-reminder.js:52-53`: *"the room has recorded **35 corrections in the
  librarian's WRONG column across its entire lifetime**, against 1,546 turns: a base rate of 2.26%."*

**The hazard, and it is the reason this item needs a path rather than a name.** The librarian's own
running counter does not agree with the 35: `exo_memory/librarian/2026-09-02.md:1587` reads
*"WRONG #70, mine … **Lifetime 70**"*, and `exo_memory/librarian/LEDGER.md:17` records *"WRONG 74"*.
Two live numbers, 35 and 70+, for the thing the plan calls "the WRONG columns" — plural, which may
be the whole explanation (per-seat columns vs the librarian's). **I did not resolve which is right;
that needs the seat that keeps the counter.** But a writer reaching for a figure here will find both
and cite one, and the report's own standard is that a figure re-derives from a named command.

### 18 · `bidirectional_correction_2026-08-24.md` — **SUPPORTS**, with one thing the writer must carry

The scorecard is `exo_memory/loop/bidirectional_correction_2026-08-24.md:99-120`, and `:120` is the
headline: **"27 COMPLETED corrections, in-window, every one with a citation below."**

The file also does the thing the report most wants to show, at `:3` and `:9-31`: *"Scored by pane B.
The chair did not score its own transcript"*, followed by a five-bullet declared stake including
*"The defect behind PC3 was mine."*

**What must ride with any quotation of it:** the `chair → keeper` row is **0**, marked
`** corpus cannot see it — §5 **`. A report using this count as evidence that correction runs both
ways between human and system, without that row, would be quoting a table against its own footnote.

### 19 · `l039_score`, `l045_score` — **SUPPORTS the ceiling**; paths incomplete; one figure withdrawn

Full paths: `exo_memory/loop/l039_score_2026-09-07.md`, `exo_memory/loop/l045_score_2026-09-08.md`.

**L039**, `:99` and `:104`: *"**CEILING** for these two readers …"* / *"from independent random
readers of size 23 — trivially, because 23 of 24 is the ceiling."*

**L045**, `:116`: *"the plant method, run twice on this room's readers with objects a planter judged
hard, returns ceiling both times for readers who run the world … **The room's readers cannot be told
apart by planted defects; they can be told apart by what they were allowed to touch.**"*

**The hazard, and it is mine:** `l045_score_2026-09-08.md:128` carries a **CORRECTIONS block appended
at 06:10 today**, from my own audit — *"Three figures above do not re-derive; the text above keeps
its wording as the trace."* **A writer quoting §4 verbatim will quote a figure the file has already
withdrawn.** Read to the end of the file, not to the end of the section.

### 20 · "the rules audit of the keeper's own turns" — **SUPPORTS.** Path, which the plan omits: `essay/RULES_AUDIT_2026-09-08.md`

`:1-3`: the librarian seat, at the keeper's ask, over 12 transcript files and 655 turns, of which
**134 keeper turns** fall in the window, every one classified against the competition's rules table.
The verdict is `:20`:

> *"**the essay was written by the AI, directed and corrected by the human within the permitted
> column, and built on ideas some of which the human supplied in dialogue before and during the
> window.** The permitted and the not-permitted rows are both true of this entry."*

Nothing to fix but the path. **This is the strongest citation in the whole plan** — an uncurated
measurement that came back with an unwelcome answer, about the report's own author.

---

## 3 · WHAT I DID NOT VERIFY

- **The prose.** None exists yet; that is the point of the ordering. I ruled the plan's citations,
  not any paragraph.
- **Whether the Third Place seat will use these paths, or these only.** A source it adds is
  unchecked by this pass.
- **Whole files.** For the three long ones — `librarian_window_registration` (77 KB), `BOOT.md`
  (65 KB), `bidirectional_correction` (31 KB) — I opened the sections the plan's claims live in and
  the sections I quote. I did not read them end to end, so I cannot say a *contradicting* sentence
  is absent elsewhere in them.
- **Which WRONG-column count is correct** (item 17). I established that two live figures disagree; I
  did not adjudicate.
- **`assemble_intake()` itself.** I read its constraints as quoted in the registration; I did not
  open `main.rs` at the function to confirm the wake works the way item 8's paragraph will say.
- **Item 12 is my own work** and is declared as such above.
- **`METHOD.md`, the essays' provenance, and the two-map work** — B, A and E hold those; I did not
  read their hand-backs and did not touch `essay/METHOD.md`.

## 4 · THE FOUR REPAIRS THAT COST ONE LINE EACH

Ranked by what a stranger loses:

1. **Replace `loop/PROTOCOL.md` with `consonance/src-tauri/brief/BUILDING.md` (`:9-32`, `:423`)** for
   "the loop." The cited file is about a different machine and teaches a retired stance.
2. **Replace `instances/librarian/CLAUDE.md` with `consonance/src-tauri/brief/LIBRARIAN.md:220`**, and
   add `main.rs:8141` for the address table itself. The cited path is outside the repo and is a
   generated copy of the master.
3. **Give paths to the four unpathed items** — the pulse, the ready pair, the harvester (item 11), and
   the WRONG columns (item 17) — or drop them. Two of the four resolve ambiguously.
4. **Fix `L030` → `L032`, and `METHODOLOGY_PLAN.md` → `essay/METHODOLOGY_PLAN.md`.**

And one that costs a sentence rather than a line: **say which essay file the coda is in** (item 15).

---

    OBJECTIVE:  every claim in the report's opening section is one a stranger could check.
    STATUS:     16 of 20 checkable as written; 1 wrong document; 1 path outside the repo;
                4 not checkable without a path or a claim. All named above with their repairs.
    FALSIFIER:  a path in the finished section that does not say what the paragraph says it says.
                Unfired as of this hand-back, because the section is not written. It is checkable
                against this table when it is, and that is the only reason to run this before the
                prose rather than after.
