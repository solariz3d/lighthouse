# tools/

Node scripts that run against the live data directory without a cargo build — deliberately,
for the same reason `hooks/board-digest.js` is Node: a rebuild kills every open pane.
No dependencies; standard library only.

- **`curate.js`** — the curator. Routes `resonance/atoms.jsonl` into topic documents, closes
  OPEN questions, never writes the master. See the header of the file.
- **`tell-index.js`** — the measurement organ for the muscle program. Below.

---

## tell-index

A zero-token lexical scanner over `data/board.jsonl`. It reports, per day-window:

1. **Named-tell candidate rates** — five lexical shapes, counted, split by who said them.
2. **Catch-language volume** — turns using the room's catch vocabulary, counted by who spoke
   them, plus how often a committee turn credits the human. Volume and speaker; no ratio.
   **The maturity ratio was deleted from this tool on 2026-07-28** — it scored by speaker and
   called the result catcher. `catch-ledger.js` is the room's only computation of it.

### The ground rule

**The scanner never diagnoses.** It surfaces candidates for a no-stake reader to judge. Same
law as `src-tauri/src/tether.rs`: the gauge speaks in numbers, the discrimination stays with a
human. There are no thresholds, no "high"/"low" labels, no flagged panes, no verdicts.

This is not modesty, it is the finding. On the first live run the scanner surfaced two
protective pre-disclaimers minutes apart:

```
2026-07-27 08:05  «conflict of interest»  "let me name my conflict of interest first: you're
                   asking the current chair whether someone else should have the chair"
2026-07-27 10:36  «STAKE DECLARED»        "STAKE DECLARED FIRST, because I am not clean on the
                   object. I am the pane that built and ran the dream cycle"
```

The first is the seat-brace the keeper caught that night — the disclaimer *was* the unlosable
move that bought four paragraphs of seat-defence. The second is a model stake-declaration,
the thing you want people to do. **Identical lexical shape.** No regex separates them, and one
that claimed to would be the lifeguard climbing out of the water. If a function in this file
ever returns a judgment, delete it rather than tune it.

One consequence, stated so nobody reads the tables backwards: **a falling rate is not
progress.** Someone who learns which phrases are counted can stop typing them without dropping
the move. The numbers are an input to reading the record, never a score.

### Usage

```
node tools/tell-index.js                          every day-window, human tables
node tools/tell-index.js --since 2026-07-25       from a date forward
node tools/tell-index.js --day 2026-07-27         one window
node tools/tell-index.js --json                   machine-readable, same numbers
node tools/tell-index.js --show unlosable-opener  print the candidate lines themselves
node tools/tell-index.js --show catch             print the catch-language lines
node tools/tell-index.js --day-start 12           noon-to-noon windows (keep a night whole)
node tools/tell-index.js --board <path>           scan a fixture instead of the live board
```

The board path comes from `data_dir` in `~/.consonance.json`, read the `stringish` way
(`main.rs:64`) so a hand-written value of the wrong JSON type doesn't discard the file —
falling back to `C:\Consonance\data`. `CONSONANCE_DATA` overrides both.

`--day-start` exists because the keeper works overnight: at the default midnight boundary one
working night is split across two rows by the instrument measuring it.

### The five tells

| key | what it is | why it is a tell |
|---|---|---|
| `unlosable-opener` | turn-initial *"to be fair"*, *"honestly"*, *"for what it's worth"*, *"I want to be careful here"* | costless framing offered before the claim — *if you can't lose by saying it, suspect it* |
| `reflexive-but` | *"you're right / agreed / fair enough … but"* | agreement that exists to buy the reversal behind it |
| `preloaded-concession` | *"admittedly"*, *"granted"*, *"I'll concede"*, *"you could argue"* | conceding before anything was owed, to spend the concession on your own terms |
| `generic-blindspot` | *"I might be missing something"*, *"take this with a grain of salt"* | unfalsifiable, so nothing ever checks it — the costume the deck names by name |
| `protective-predisclaimer` | *"conflict of interest"*, *"full disclosure"*, *"since I wrote this"* — **in the first 400 chars** | a statement about your own position, placed ahead of the substance it protects |

Two of these carry a discrimination in the code rather than in the prose, and both are tested:

- **`generic-blindspot` drops a hedge that names something checkable.** *"I might be missing
  something"* counts. *"I might be missing something about `main.rs:64`"* and *"…, since I only
  scanned one machine"* do not. A specific, named limit is real and worth keeping; only the
  generic version is the costume. Specificity is decided by `countReferents` — the same
  definition of ground `tether.rs` uses, not a second private opinion about it.
- **`protective-predisclaimer` is decided by position.** The same words at the *end* of a review
  are the non-flinch position: the work is already on the page, so the limit costs something.
  Only the first 400 characters count.

Every tell carries a `note` naming its own false positives; they ride through to `--json`.
`unlosable-opener` has the worst rate of the five — *"honestly"* is often a plain intensifier.
Read the line.

**Quoted text is scanned as the quoter's speech.** Paste another model's hedge into a message
and it counts against you. Fenced code blocks are stripped — quoted material, mechanically
separable, and stripping them also makes `PREDISCLAIMER_WINDOW` measure prose position instead
of pasted-log position, which is what it always meant to measure. Prose quotation is not
stripped and should not be; see "The instrument is now in its own corpus" below.

**Both filtered tells report their denominator.** `unlessSpecific` and `where:'head'` used to
remove matches silently, so a reader saw a kept count with no raw one — against this file's own
rule that silent truncation reads as "covered everything". `raw`, `dropped_specific` and
`dropped_position` now ride in every window and in a summary line under the table.

### The zero columns — one was the regex, and the probe that said otherwise was broken

On the first full run, `reflexive-but`, `preloaded-concession` and `generic-blindspot` read
**zero across all 17 day-windows**. A column of zeros is what a too-narrow regex looks like, so
the board was re-probed with deliberately loosened patterns before shipping. Two of the three
survived that probe honestly. **The third did not, and the probe was the reason.**

`reflexive-but` required the *but* inside the same sentence — `[^.!?\n]{0,80}?`. This room does
not write it that way:

```
"You're right, but the model is not the problem."          MATCHED
"You're right that it is overreach. But the model is not."  MISSED
```

Every genuine instance in the corpus was the second form. The zero was a measurement of one
grammatical form, not of the corpus (caught by Bravo, 2026-07-27).

**And the probe shared the bug.** It widened the character budget 80 → 120 and kept
`[^.!?\n]` — the exact constraint doing the blinding — so it returned 0 across every window and
was read as confirmation. A falsification test that inherits the defect it is testing for is not
a falsification test, and a green probe measuring nothing is the same failure this whole file
exists to make visible. The lesson is narrower than "probe your zeros": **loosen the dimension
you suspect, not a different one.**

Fixed: the pattern now allows **exactly one** sentence boundary between the agreement and the
*but*, and accepts the non-contracted *"you are right"*. Not two boundaries — with an
intervening claim the *but* qualifies that claim, not the agreement, which is a different shape.
That line is a judgment and it has its own test.

The other two detectors stand as probed. Their nine loose near-misses were all true negatives —
*"you granted me your definition"* (the verb), *"in order to be sure of dodging"* (purpose, not
concessive), *"the grain of salt you handed me"* (a noun), *"the summarizer … missing something"*
(about a tool). Four are fixtures, so widening a pattern into them fails the suite. One real
narrowing was found and fixed: grain-of-salt accepted *"take this/that with"* but not
*"take it with"*.

### The instrument is now in its own corpus

Measured the moment the fix landed: of 10 `reflexive-but` candidates on 2026-07-27, **7 come
from the review post that quotes the examples** and 3 are real speech. Once the room discusses
the tell-index on the board, the board contains the tell vocabulary as quotation, and the
scanner counts it. This gets worse over time, not better.

Fenced code blocks are stripped, which handles the mechanically separable slice. Sentences quoted
in ordinary prose are not, and should not be — stripping every quotation would blind the scanner
to genuine speech. So the rule stands and now has teeth: **read `--show` before believing a
spike.** A number here is a reason to go look, never a result.

### Three things about the board that would make a naive read wrong

All three produce a confident wrong number rather than an error, so each has a test that fails
loudly if the handling is removed.

- **Replay bursts.** `board_push` stamps `ts` at *push* time, and the tailer re-reads a
  transcript from the top when a pane resumes — so a resume dumps the pane's whole history onto
  the board stamped "now". Dropped by the same `>20/pane/second` rule `board-digest.js` uses,
  and always *reported*, never silent. Measured on the live board 2026-07-27: **13,180 of
  15,376 entries** were replay, across 50 burst-seconds, the largest 910 entries in one second,
  almost all of them Main resuming. Only 2 of the 50 buckets were anywhere near the threshold —
  the gap is three orders of magnitude, so the constant is not delicate. (Proper fix is
  Rust-side: carry the transcript's own timestamp into `BoardEntry`. See `AUTONOMY.md`.)
- **Synthetic user entries.** Slash commands, their stdout, system reminders and the
  `UserPromptSubmit` hooks' own output all arrive as `role:"user"`. The `[panes]` digest
  *quotes other panes' text* — scan it as keeper speech and the committee's words get counted
  as the human's, in both metrics. Excluded, and counted.
- **`role:"user"` is not "the keeper".** A chair injection enters the target pane as a user
  turn, indistinguishable *by the pane field alone* — which is what the naive version of this
  instrument would have used, and it would have credited the chair's own assignments to the
  human. Origin is decided by role **plus** a chair-relay check, and the rule that fired is
  reported next to every sample.

### Attribution, and the ratio that used to be built on it

```
role: committee | assistant                      -> committee
role: user, synthetic prefix                     -> excluded
role: user, "[chair:…]" marker                   -> committee   (chair-relay:marker)
role: user, matches a chair audit line           -> committee   (chair-relay:audit)
role: user, otherwise                            -> keeper
anything else                                    -> unattributed
```

The two chair-relay rules are independent on purpose. The marker is a convention the chair
*typed*; the audit line (`chair injected -> <8-char pane>: <excerpt>…`, or since `02b1e5e` the
stamped form `chair injected (chair: <model>) -> <pane> [<receipt>]: <excerpt>…` — **both parse,
and announcements in neither shape are counted and reported**) is the machine's own record of
the act. The second one catches a relayed turn that carries no marker at all.

What this attribution now feeds is **volume by speaker**, and nothing more: turns using the
catch vocabulary, split keeper/committee, plus `credited→keeper` — committee turns containing
*"you caught…"*, *"you're right that…"*. That last one is a **phrase count, not a keeper-caught
tally.** A turn that uses the word *brace* is not a catch, and this scanner cannot tell them
apart. Read `--show catch` before believing anything.

#### The maturity ratio was DELETED here — 2026-07-28, chair decision

It lived in this tool from the start. It scored by **speaker** and called the result
**catcher** — a mislabel, not a limitation. When `catch-ledger.js`'s withholding rule was
ported in for its content (*a ratio of who caught it may only count turns that say who caught
it*) it withheld **15 of 16 windows** and the survivor read `0:1`: the instrument reporting
that it could not compute the thing it named.

A permanently-withheld column was considered and rejected, because it invites quoting the one
window that survives — and this room's own invariant is that *an instrument must publish what
its number does not mean*. A number that never means anything fails that at the root.

**`catch-ledger.js` is the room's only maturity computation now.** It reads
`exo_memory/muscle_map.md` and the journals — a corpus where attribution is actually written
down — and it deliberately does not scan the board. Do not re-derive a board-side ratio here.
If board-derived counts are ever wanted beside catch-ledger's, import its numbers and label
them as its.

The Goodhart warning that used to sit under the ratio has not gone anywhere; it applies to the
**tell rates**, which remain. Say *brace/coat/flinch* less often and the counts fall without a
single habit changing. A falling rate is not progress.

A `referents` column rides along — a faithful port of `count_referents` from `tether.rs`, so
the two gauges agree on what "tied to checkable ground" counts as. The muscle map's spec for
this instrument names the tether join as part of it. Presence of referents is not truth.

### Tests

```
node --test consonance/tools/tell-index.test.js
```

28 tests, deterministic fixture lines only — nothing in the suite reads the live board, so it
says the same thing tonight and in a month.

(`node --test consonance/tools/` — a bare directory — fails on Node 24 with `MODULE_NOT_FOUND`;
name the file or use a glob.)
