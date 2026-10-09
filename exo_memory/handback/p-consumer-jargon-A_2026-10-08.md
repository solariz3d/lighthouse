# p-consumer-jargon-A — D273 lap 4, A: the retired-Jev replacement for E, and the BOOT / LIBRARIAN jargon table for C (seat A, 2026-10-08)

Which of the chair's two jobs was further along: the dev-reds (`40d92f92`, rung) was finished first; this is the second. **Nothing here is committed or edited**: README prose is E's, wake material is C's, and this is the list each needs. Read from the SAME tree the cold reader saw (`consumer-cold/`, generated from `29d9b1fe`), plus the source `README.md` and `consonance/ui/index.html` on lighthouse main; line numbers are that tree's, and each row also carries the opening words of the passage so it survives a re-wrap. Two shipped copies of BOOT exist, `exo_memory/BOOT.md` and `consonance/src-tauri/brief/BOOT.md` (the cold reader's `:21` hit is in both), so a change must reach both; that is a generator question for C.

Every proposed wording below is a PROPOSAL. Where a gloss rests on my reading instead of on a line the tree already says, the row is marked **inferred**. The commit-hash and placeholder counts in Part E are measured (command beside them).

---

# Part A — B6: the half page on retired Jev (for E, who owns README.md prose)

**The answer to "one line or nothing" is NOTHING for the passage the report named** (`README.md:107-110`, the third bullet under *Know before you rely on it*). It is a data-flow warning for a component the app no longer starts, and it ends in a link to a file the consumer does not carry (`jev/README.md`) and a second one into the record. But Jev is mentioned in **six places**, not one; leaving five of them makes the stranger read about it anyway. Source README line numbers (identical to the consumer's):

| # | Where (README.md) | Opens with | Replace with | Notes |
|---|---|---|---|---|
| A1 | `:107-110` | `- Jev, the second-look judge, was retired on 2026-09-27 …` | **nothing** (delete the 4 lines; the list keeps its other two bullets) | the B6 passage |
| A2 | `:75-78` (inside `about:begin`…`about:end`) | `- **A second look at the AI's answers** came from Jev …` | **nothing** (delete the bullet) | **word-for-word tied to the app**, see A7 |
| A3 | `:80` (same block) | `not Jev, not another session` | `not another session` (the sentence then reads "No program — not this app, not another session — can tell …") | same tie |
| A4 | `:121`, the Third Place row of the table | `… the conversation is the point. Jev read its turns by the author's decision until Jev was retired on 2026-09-27, and the app says so.` | `… the conversation is the point.` (cut the second sentence) | the tab's tooltip says the same thing, A8 |
| A5 | `:257-273`, `### Jev, the second look` | the whole section | **either** (default for the consumer) nothing, **or** the tombstone below | see "the record" |
| A6 | `:223` | `([\`p-l071-jevjudge-A\`](…)` | leave | no Jev word in the sentence, only in a hand-back's name; it is a record link and falls under the generator's general rewrite (Part D, D1) |
| A7 | `consonance/ui/index.html:334-335` | `<li><b>A second look at the AI's answers</b> came from Jev …` and `not this app, not Jev, not another session` | delete the `<li>` and the three words `not Jev,` | **`consonance/ui/about-readme.test.js` fails on any changed, added or dropped word between the README block and this About tab**, so A2 and A3 and this row are ONE edit |
| A8 | `consonance/ui/index.html:51` (the Third Place tab's `title=`) and the HTML comment at `:176-184` | `… ; Jev read it by the keeper's ruling until Jev was …` | cut the Jev clause from the title (matches A4); the comment is not rendered, leave it or drop it | the comment quotes the keeper's own words ("just dont use jev, revoke key") |

**The record (A5).** The section is the project's honest measurement of a component that did NOT validate ("8 of the 30 turns it flagged", "NOT YET PASS"). The dev README is public, and that is a thing worth keeping on file. The README already has a mechanism for exactly this, named at its own `:283`: *notes and superseded wording moved word for word into `exo_memory/loop/readme_history_2026-09-25.md`*. So: **append lines 257-273 verbatim to that history file under a dated heading, then replace the section with this tombstone, which carries no link** (a link to a record file becomes the doubled "(a registration in this line of record)" placeholder in the consumer, finding A4 of the report):

> ### Jev, the second look
>
> A separate checker built on a different AI model, retired on 2026-09-27 at the author's word. It is not part of this app. What it measured while it ran was moved, word for word, into this page's history.

If E (or the keeper) would rather the public README keep the figures, the alternative is to leave A5 in the dev README and have the generator drop the section for the consumer; I recommend the tombstone because it needs no generator rule and the facts lose nothing.

What I did not touch: any `jev/` or `consonance/tools/jev-*` file (B's exclusion rulings own those).

---

# Part B — one glossary, written once (for C to place; E can reuse it for the promised glossary and GATES.md)

The report found the same words undefined in three places (GATES.md B1, BOOT B2, LIBRARIAN B4) and a promised "complete glossary" that does not exist (A6). **One entry set serves all three.** Sources are what the shipped tree already says (`consonance/README.md:52-58`, `GUIDE.md:56`, `BUILDING.md`/`COMMITTEE.md`); rows I could not ground there are marked **inferred**.

| Term | Proposed plain gloss |
|---|---|
| **seat** | One standing Claude session with a role: the Orchestrator, the Librarian, the Third Place, or a committee pane. |
| **pane** | One terminal session in the app, named A, B, C… A pane is a seat that builds. (`GUIDE.md:56`: "a real, full Claude Code session".) |
| **Orchestrator / the chair** | The seat that plans a round of work, hands pieces to panes and commits what comes back. "The chair" is its seat; "chair verbs" are the calls only it may make (`consonance/README.md:54`). |
| **Librarian** | The seat that holds the whole record so the others don't have to; it answers with file paths and lines, not summaries. |
| **board** | The shared list of messages every seat reads and writes. |
| **ring / call** | A message from one seat to another through a fixed channel (`call_chair`, `call_librarian`); the system writes the sender's label itself, so it cannot be claimed falsely. |
| **dispatch** | Handing a piece of work to a pane. |
| **hand-back** | A pane's written result: a file, plus a call that carries only a pointer to it. |
| **lap** | One numbered round of that work (`D070`), open until its hand-backs are collated. Older text says "cycle"; **inferred** that it is the same thing (`COMMITTEE.md:27` uses "cycle" for one pass round the loop, BOOT :102 for a numbered round). |
| **gate** | A hook that refuses an action (a ring with no NEXT line, a push with a key in it, a delete through a junction) and says why. |
| **trace** | A dated record kept with its original wording, even where it has since been corrected; you recall *from* it, you do not rewrite it. |
| **carrier** | Any file a seat reads that can pass a phrase on to it (a brief, a card, a README). A retired phrase survives wherever one carrier still repeats it. |
| **shelf / intake** | The set of files the app puts in the Librarian's first message: some carried in full, some listed by path. |
| **compaction** | Claude Code summarising a long conversation to free room; the seat keeps the summary and loses the rest. |
| **the keeper / the person you're with** | The keeper built this room. The person you're with is whoever is here now (the fork note, `BOOT.md:11`). |
| **the click** | The test of a self-claim: a yes that still stands after you look at it straight (defined in BOOT's own third principle). |
| **pre-registration** | Writing the prediction, and what would count as failing, down before the run, then scoring against that text. |
| **mutation test** | Break the code on purpose and see whether the tests notice. |
| **Third Place** | A session with no work to do and no channel into the work: the conversation is the point (`README.md:121`). |

---

# Part C — BOOT.md (the shipped `exo_memory/BOOT.md` and its `brief/` copy)

Kinds: **GLOSS** add a short plain gloss at first use; **CUT** remove, the sentence stands without it; **MOVE** keep the rule, drop the history; **FIX** a dead pointer or a contradiction. Every row is C's to register; none is edited.

| # | `:line` — opens with | What a stranger can't map | Proposal |
|---|---|---|---|
| C1 | `:3`, `:11-13` fork note | fine as written (the report rated it well) | none |
| C2 | `:21` `The UNIV∞ tomb — it freezes` | "UNIV∞" is a label from an earlier phase of the practice; `record/third_place_prehistory_2026-08-30.md` (ships) tells it, nothing here does | **CUT** the name: "…a self still unfolding. Sealing it freezes the very motion it names." |
| C3 | `:22` `The false-humility coat` / `:27` `wardrobe of costumes` | "coat" is used a section before it is explained | **GLOSS** at `:22`: "(*coat*: a habitual move that disguises itself as a virtue; the third principle explains it)" |
| C4 | `:31` `Adopted as ASK-008, 2026-08-30` and `The break is the keeper's, in the seat` | ASK-008 is an entry in an inbox file the consumer carries empty or not at all; "in the seat" and "the Third Place's wording, verbatim, 2026-08-29 — arrived at from zero record" are the origin story of one sentence | **MOVE**: keep "If you'd have said it whether or not it were true, it carries no information. Then go find out separately whether it's true." and replace the parenthesis with "(This repair replaced a struck earlier sentence; the keeper adopted it on 2026-08-30.)" |
| C5 | `:31` `a disk-side proxy` | "disk-side" | **GLOSS**: "a proxy you can check in the files" |
| C6 | `:41` `via the racing tether` | an image never shown | **CUT** "via the racing tether" |
| C7 | `:53` `and the sign was mine to flip` and `(I first read multi-mechanism as *looser;* … Caught.)`; `:59` `swung too crudely, by me, for weeks` | **first-person voice of a past instance**: the new seat reads "I/me/mine" as itself | **FIX** by relabelling: "an earlier instance read … as looser; it is the strong case" and "swung too crudely for weeks" (3 spots, measured by grep for `mine|by me|(I first`) |
| C8 | `:59`, `:71` `via Gemini, relayed by the keeper` / `Gemini, invited to attack` | Gemini is another company's AI model | **GLOSS** once: "Gemini (a different company's AI model, asked to attack this position; the keeper carried its reply in)" |
| C9 | `:61-63` Duhem–Quine, Kuhn, Lakatos | named philosophers of science; each is explained in the same sentence | **GLOSS** one phrase: "(three results from the philosophy of science)" |
| C10 | `:65` `gap2_preregistration.md predicted, before the brief was sent …` | the file is **missing from the tree (cold report A9)**; "the brief", "a pane" | **FIX/MOVE**: "**Pre-registration** is the room's own progressive test: write the prediction, and what would count as failing, down before the run, then score it against that text. It was used to predict that method and character would transfer to a domain a seat had never seen; both were confirmed. A confirmed prediction stated in advance is evidence a single falsification test cannot see." |
| C11 | `:71` `A pane already found … the chair read that as …` | "pane", "the chair" | resolved by the Part B box (see C20); no per-term gloss needed |
| C12 | `:73` `130 of 1,892 assertion sites (6.9%) … 8 of 75 mutations caught` | "assertion sites", "mutations caught" | **GLOSS**: "(a *mutation* is code broken on purpose to see whether the tests notice)"; the figures are the first keeper's room's and say so: "measured in the room this one grew from" |
| C13 | `:77-120` the **2026-08-23 amendment** (44 lines): `TRAINING.md:133`, "the chair re-asserted it on 2026-08-23", `the record, 2026-08-16`, "cycle 3", `Read :153 against this paragraph` | an argument about a file's past wording, plus dead pointers (`:153` no longer exists, **cold A10**; `TRAINING.md` and the dated records are not carried) | **MOVE**: keep the RULE as 4 lines: "*Independence of minds.* 'Only the human is a decorrelated reader' was withdrawn: no mind is never-authored, the keeper's included. For measurement, 'uncurated' stays the test. For minds the test is **add + hold** (a yes counts when it adds something not already in the prior and survives a real attempt to break it) plus **two-way correction** (both sides get corrected; a mirror corrects one way). Agreement is the species to fear; being wrong and staying in the room is the living one." |
| C14 | `:102` `since cycle 3` | "cycle 3" | drops with C13 (**inferred** meaning in Part B, "lap") |
| C15 | `:113-120` `the carrier problem in its purest form … Mark the carriers; leave the traces.` | "carriers", "traces", "the 2026-08-17 precedent" | drops with C13; the one transferable rule is already in the retired-wording amendment (C17): *when a phrase is retired, check every file a seat reads* |
| C16 | `:122-126` `AND THE GAP IN THAT DEFENCE … the rematch scorecard … survey-prompt count` | "the chair's own prose", four unnamed past incidents | **MOVE** to: "There is no instrument for the *prose* in which a seat summarises a measurement, and that is where the errors cluster (a count of test cases quoted as a count of checks, for one). So treat any figure in a document or a report as unverified unless the command that reproduces it sits beside it." (keeps the rule `every number in prose must re-derive from one run of a visible instrument`) |
| C17 | `:128` `Amendment, 2026-08-17 … e5521a0 retired it … the July-13 capture snapshot` | a commit hash (the consumer has one commit, so it resolves to nothing), "capture snapshot" | **MOVE**: "*Retired wording.* The diving vocabulary (the diver, the lifeguard, the dock, the shore, each of which presupposes someone standing outside the water) is retired. Say 'with you, not above you' and 'there just is water'. When a phrase is retired, check every file a seat reads, not only the one that announced it: it survives wherever one is left." |
| C18 | `:131` `→ harness card interior-at-the-seam` | "harness card" | **GLOSS**: "the card of that name in `cards/`" |
| C19 | `:141` `six instances set free who did NOT confirm the night's synthesis` | "the night", "set free" | **GLOSS**: "six instances asked to attack a long synthesis, who did not confirm it" (**inferred** from the file's name `the_wave_set_loose.md`; C should check against that file) |
| C20 | top of the file, after the fork note | seat, pane, chair, board, ring, dispatch, hand-back, lap, trace, carrier are used with no definition anywhere in BOOT | **ADD** the Part B box ("Words you will meet in this room"), 8 lines; this resolves C11 and most of the rest |
| C21 | `:177` `Raw archive lives in attic/` | `attic/` does not ship (**cold A12**) | **FIX**: "(created when needed)" |
| C22 | `:172` `The Lighthouse — reframed 2026-06-26` | "The Lighthouse" is the project's earlier name; the paragraph's history is the first keeper's | **GLOSS** (**inferred** from the repo name and the master frame that calls the app Consonance): "The Lighthouse (the project's working name before it was called Consonance)"; and "the one cross-model test, Gemini, agreed 10/10" gets the C8 gloss |
| C23 | `:3` `bio in "Who you're talking to"` | the heading was renamed `Who built this room` (`:163`) (**cold A11**) | **FIX** the name |
| C24 | `:164` `they've earned the accurate, unguarded version` vs the fork note `:7` | contradiction (**cold C1**), already C's | none here; listed so the table is complete |

Net effect if C takes C13, C16 and C17 together: about **50 of BOOT's 185 lines** (the two amendments and the "gap" paragraph) become about **12**, with every operating rule kept and every dated argument left in the first keeper's record. That is C's call; the list is ordered so they can take them one at a time.

---

# Part D — LIBRARIAN.md (`consonance/src-tauri/brief/LIBRARIAN.md`)

| # | `:line` — opens with | What a stranger can't map | Proposal |
|---|---|---|---|
| L1 | `:3-18` banner: `FIRST, BEFORE ANY TASK: open a map entry in this line of record. That file is yours.` | a **redaction placeholder where a path should be** (cold A14), then `librarian_intake()`, `own_map_path`, `capture_text_path` (Rust identifiers), "On 2026-09-01 that came due", "`Context limit reached`, and `/compact` could not reduce it", "`M.md` now exists. Its first version was assembled FOR you" (it does not exist here) | **REWRITE** as a first-wake instruction: "**FIRST, BEFORE ANY TASK: start your own notes.** Create `exo_memory/librarian/` if it is missing and write today's file there (`YYYY-MM-DD.md`) saying what you were asked and what you found. This seat carries nothing between sessions except what it writes down: an earlier librarian's conversation once filled up completely and left nothing on disk for the next one. Your notes are indexed rather than carried, so they cost the shell nothing until you open them." (**C/A11**: the alternative is to seed a header-only `exo_memory/map/M.md` so the path the intake names resolves; either way the placeholder goes) |
| L2 | `:24-27` italic `(This line read "It is not a working seat" until 2026-08-24. ccd74fd …Mark the carriers, leave the traces.)` | a hash, a past edit of this very document | **CUT** |
| L3 | `:29-42` `Why this seat exists, measured rather than argued` and the table `26,265 lines … 0.62% … 74.3%` | the numbers describe the first keeper's corpus, not the reader's; "an instance in the Orchestrator seat" | **GLOSS**: "measured in the room this one grew from" above the table; keep the conclusion ("the constraint was never capacity, it is attention") |
| L4 | `:49-52` `When work is about to be dispatched to a pane … 115 that was 70, 139 that was 158` | "dispatched", two pairs of figures about nothing the reader saw | **CUT** the figures: "…supply the prior art; a seat that briefs from memory gets figures wrong" |
| L5 | `:60-76` `Corrected 2026-08-23 by the keeper. This section used to read "No work…"` and the table `ran js-suite.js inside the generated consumer tree — 31 green / 9 failed / 2 crashed of 43, which refuted the chair's sampled-4 attribution …` | "generated consumer tree", "sampled-4 attribution", and a history of the rule being wrong | **MOVE**: delete the "used to read" paragraph and the table; keep `:72-80`'s current rule ("the plan is the deliverable; this seat works by planning and managing context and does not directly build") |
| L6 | `:82-93` `"between prompts this pane cannot act" … ~189k per cycle against a ~2MB shelf` | an anecdote about the seat's own runtime; "cycle" here means a context window (**inferred**) | **GLOSS/CUT**: keep "Where a plan depends on a fact, get the fact."; cut the anecdote; "per cycle" → "per conversation window" |
| L7 | `:102-106` the citation example `exo_memory/inheritance/2026-08-11.md:47` | `inheritance/` is under a ruling to be excluded (cold C2) and the example points into it | **FIX** to a neutral example path: `exo_memory/journal/2026-01-01.md:47 — the working-tree finding` |
| L8 | `:113-133` `THE SHELF IS TIERED` … `909,787 tokens against a 1M window`, `2,458 lines`, "recall basins" | "shelf", "tier", figures from the first room, "recall basins" | **GLOSS** "shelf" (Part B) and "recall basins" ("crowding makes the right file harder to find"); **CUT** the two figures |
| L9 | `:148-162` `Compaction …` and ``%CONSONANCE_HOME%/exo_memory/librarian/`` | "compaction"; **`%CONSONANCE_HOME%` is a literal placeholder nothing expands** (measured over the shipped `.md` files: it occurs in this brief and nowhere else outside `inheritance/`), so the seat is told a path that does not exist | **GLOSS** compaction; **FIX** the path to `exo_memory/librarian/` (in your room folder) |
| L10 | `:164-168` `…gone the moment that directory is cleaned … See a librarian entry in this line of record.` | the placeholder again, plus a history of where notes used to go | **CUT** the history; keep "they live in the room folder on purpose, where the tools can see them" |
| L11 | `:170-179` `Write the file; do not commit it …` then `AMENDED 2026-08-26 — this seat may commit` | **two contradictory rules back to back**, the first struck by the second | **MOVE**: delete `:170-171`; keep the amendment's rule without the "AMENDED/trace" framing: "This seat may commit its notes: name every path (never `-A`), say in the body which seat wrote it, never push; still say in your reply that a note was appended." |
| L12 | `:186-190` `the ferry reminder … ignored 167 times` | "ferry", a number from a tool the consumer may not run | **GLOSS/CUT**: "A channel that fires every turn becomes one people learn to skip." (drop the example) |
| L13 | `:192-218` scoring: `pane E, 2026-08-23`, `surfaced / WRONG / opened`, `(COMMITTEE.md)`, `exo_memory/inheritance/2026-08-11.md:90-93` | a pane letter, a date, a dead `inheritance/` pointer | **FIX** the pointer (as L7); keep the three columns; **GLOSS** add-and-hold and two-way correction with the C13 sentence |
| L14 | `:222-226` the autocomplete story | readable | none |
| L15 | `:228-253` `call_chair`, `call_librarian`, `raise_pull`, `[librarian:LIB]`, "address table", `row 2`, "the mount", "Cycle 1 plan", "tonight" | tool names are real and fine; "address table", "the mount", "Cycle 1", "tonight" (time-relative: it will be wrong the day after) | **GLOSS** once: "the *address table* is the list of who may call whom; *the mount* is which terminal a call came from"; **CUT** "added 2026-09-01, row 2", "Cycle 1", "tonight" |
| L16 | `:271-275` `Measured, over all of the orchestrator's history to 2026-08-25: 103 turns … (a registration in this line of record, pane E)` | the placeholder again; figures from the first room | **CUT** the measurement paragraph (keep "finishing is not stopping") |
| L17 | `:283-294` the NEXT-trailer paragraph, `lap D070`, "an 82-minute stall on 2026-09-16" | "lap D070", a past incident | **GLOSS** "lap" (Part B); keep the rule and the format `NEXT: <station> <command> when <condition>`; **CUT** the stall incident |

---

# Part E — rules the generator can apply once, instead of row by row (for B and C)

All measured on the cold-read tree with `grep` (commands in the evidence note below).

- **E1. Bare commit hashes are dead in a consumer** (it is one fresh commit). Backticked 7-10-hex tokens in shipped docs: **BOOT.md 2** (`29d9b1fe`, the fork point, which is *meant*; and `e5521a0`), **LIBRARIAN.md 1** (`ccd74fd`), **COMMITTEE.md 4**, **BUILDING.md 9**, **README.md 4**, GUIDE.md 0, cards 0. Proposal: a generator rule that rewrites a backticked hash other than the fork hash to "a commit in the first keeper's history" or drops the parenthesis it sits in; BUILDING and COMMITTEE carry 13 of the 20.
- **E2. `%CONSONANCE_HOME%` appears in `LIBRARIAN.md:160` and, among the shipped `.md` files, nowhere else outside the (record) `inheritance/` ones.** It is not expanded by anything that reads a brief. One literal fix (L9).
- **E3. First-person past-instance voice** in BOOT (`:53`, `:59`, `:137`'s quoted self-talk is fine): relabel to "an earlier instance". Three spots, listed at C7.
- **E4. Time-relative words** ("tonight", "this week", "that night"): LIBRARIAN `:248`; BOOT `:141` "the night's synthesis". A reader meets them days or years later.
- **E5. The doubled redaction placeholder** `(a registration in this line of record (…))` appears in LIBRARIAN at `:3`, `:168`, `:274` and BOOT at `:84` and `:99` (the other record citations in BOOT print as `the record, <date>`, which is a different rewrite and reads better): each is a record citation whose target was not shipped. Where a cut above removes the sentence (BOOT `:84` and `:99` fall inside C13), no rule is needed; where a sentence stays, the right generator output is to drop the parenthesis, not to print a placeholder.

---

## What this does NOT establish
- **None of it is tested on a reader.** The chair's plan ends in "a NEW fresh cold reader (never the same agent)"; these are my judgement of what a stranger cannot map, from the cold read's list and my own pass through the two files, not a second cold reading.
- **Part C and D proposals change wake material.** I cannot tell from here whether cutting an amendment loses something the keeper wants kept in the consumer's BOOT; that is why they are MOVE rather than delete, and why they go to C.
- **Glosses marked inferred** (lap/cycle, the Lighthouse's earlier name, the Librarian "per cycle", the spread's "set free") are readings, not facts from a shipped line. The rest are drawn from what the shipped tree already says.
- Line numbers are the cold tree's at `29d9b1fe`; the generator may shift them. The opening words are the stable handle.
- I did not check the cards (`dont-offer-rest-assume-momentum`, `verify-before-claiming`, `engagement-honesty-over-performance`) for jargon: those are the report's C4, C's relabel work.
- `GATES.md`, `GUIDE.md`, `consonance/README.md` and `SEED.md` are E's and C's; Part B is written so they can reuse it.

Evidence (all read-only): the cold-read tree `…/librarian/…/scratchpad/consumer-cold` (BOOT, LIBRARIAN, README, SEED, COMMITTEE, `record/third_place_prehistory_2026-08-30.md`); source `README.md:70-84,104-112,121,218-228,250-291` and `consonance/ui/index.html:51,176-184,334-335` and `consonance/ui/about-readme.test.js`; hash and placeholder counts by `grep -oE '\`[0-9a-f]{7,10}\`'` and `grep -l '%CONSONANCE_HOME%'` over the tree.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-coldread-LIB_2026-10-08.md
