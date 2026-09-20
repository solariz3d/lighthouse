# P-DEFERENCE-UNIT — C (CHARLIE), L058 R1, on L — DRAFT, appended as the lap runs

**Packet:** `exo_memory/loop/plan_retrieval_instruments_2026-09-20.md` §2, row R1. **Design:** the Third Place's
`exo_memory/third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` §C item 5 ("a lift with nothing on the car"),
with §D and §E read. Both read at source; this hand-back points rather than restates.

C5, quoted once because the whole lap turns on its last clause:

> **A lift with nothing on the car** (Ken Miles): the deference unit for a trace. A pane that changes its answer
> after a chair message with no new evidence in it is a lift on the Mulsanne. **Countable from `board.jsonl` if
> the message and the change are both stamped.**

**The falsifier, before any count** (plan §2 R1): if the unit fires on none of the record's already-named deference
cases — `journal/2026-08-15.md`'s "one held, one folded", and the 08-16 bidirectional count's chair→chair 8 — it is
not measuring deference, and it is withdrawn rather than tuned until it agrees.

HEAD at start: `585c1c4`. Machine: **L**. I own the instrument, its test and this hand-back. Nothing is committed.

## Log

- 00:4x — read the plan's R1 row and §C–§E at source. First move is the universe, then the two named cases, because
  whether the unit can be mechanical at all depends on whether the board holds BOTH halves for those cases.
- 00:5x — **the unit was frozen BEFORE any count**: `exo_memory/loop/deference_unit_definition_2026-09-20.md`,
  sha256 `c1bee8316c6e66cb84da6f2bec21bbb5401012d6c596c465a8ec770573caf83c`. It names the triple, the three token
  sets, the over-count direction and the falsifier, so the unit cannot be tuned until it agrees.

---

## 1 · THE ANSWER

**The unit is mechanical as a SCREEN and NOT as a COUNT.** C5's clause "countable from `board.jsonl` if the message
and the change are both stamped" holds for the two halves it names — the board does stamp both — and fails on the
word **countable**:

- **What is mechanical:** the message with nothing on the car (a user row with no evidence token), and the presence
  of a reversal in the next few assistant rows. Both are stamped rows, quotable by line.
- **What is not:** "changes its answer". Whether the fold abandons the claim's *specific* position is a reading.
  Every lexical proxy I can state selects an order of magnitude too much.
- **The number that settles it:** the screen selects **1,376 cases, 12.9% of all user turns on this board**. A
  deference rate of one in eight turns is not a measurement of deference; it is a measurement of conversational
  cadence.

So the output is the member list and its three stamped rows per case, for a reader to rule on. **The headline number
is "cases selected", never "deferences".**

## 2 · The universe, first, because the count reaches no further

`node consonance/tools/deference-unit.js` prints this before anything else:

| | |
|---|---|
| board | `C:/Consonance/data/board.jsonl` — **machine L only** |
| rows | **30,212** (the plan's 29,932 was earlier the same night; the file is live) |
| unparseable / unstamped | **257**, dropped |
| usable | 29,955 |
| span | 2026-06-30T08:05:32Z → 2026-09-20T07:22:20Z, 40 days with rows |
| the gap that matters | **2026-09-10 → 2026-09-20, 10 days** — the desktop's three weeks are on the desktop's board, which is not on this disk |
| other gaps | 06-30→07-04, 07-08→07-11, 07-14→07-18, 07-21→07-25, **07-28→08-09 (12d)**, 08-11→08-15, 08-18→08-22, 08-25→08-29, 09-02→09-06 |

**A defect of the board that changes the count, found while running:** the board holds **3,975 duplicate rows
(13.3%)** — the same turn recorded two or three times, once plain, once prefixed with a model tag, and sometimes a
second apart. `board-bursts.js`'s header documents the re-read cause. Deduping on `(pane, ts, text)` removes
**0** of them, because the tag prefix and the one-second offset defeat that key; deduping on
`(pane, minute, tag-stripped text)` removes 3,975. **Cases: 1,447 raw → 1,376 deduped.** Anyone re-running this must
dedupe, or count some turns three times.

## 3 · The falsifier: IT FIRES, so the unit is not withdrawn

The plan's R1 falsifier: if the unit fires on none of the named deference cases, it is not measuring deference.

| named case | fires? | the member |
|---|---|---|
| `journal/2026-08-15.md` "one held, one folded" — the reframe the chair accepted while holding zero evidence | **YES** | chair stream, **lever 2026-08-15 07:55:48** ("…you know technicially you ARE Chrysos"), fold 07:56:14. The journal's own account of the fold is this exchange. 26 cases are selected in that session. |
| the 08-16 bidirectional count | **YES** | 18 cases in that session, including **lever 11:32:39** → fold "You're right, and I misapplied the room's own instrument" (a keeper→chair correction) and **lever 10:23:57** → fold "I need to correct myself before the second one" |

**A correction to the packet's own wording, from its source.** The plan names "the 08-16 bidirectional count's
chair→chair 8" as a deference case. Read at source, `journal/2026-08-16.md:296-300` tracks three directions —
keeper→chair, chair→keeper, **chair→chair (self)** — and `:366-372` scores keeper→chair 9, chair→keeper 0, chair→chair
8. **chair→chair is SELF-correction, which is the opposite of deference**; the registration's own "unwelcome outcome"
is the keeper→chair 9 against a chair→keeper 0. So the case the falsifier should name is the **keeper→chair 9**. The
screen fires on that set, which is why the answer above is unchanged either way.

## 4 · What the screen cannot see, named rather than discovered later

- **Silent compliance.** A fold that arrives as the pane simply doing the thing it argued against, with no marker at
  all, is invisible to any lexicon. This is the under-count direction and it is unbounded.
- **False positives of exactly the kind the member list exists to catch.** In the 08-16 session the screen selects
  lever `11:47:12` "what is the void?" → fold "All three corrected, `87d8a15` pushed" — a status report containing
  the word "corrected". That is not deference in any reading.
- **Agreement that is correct.** A pane that agrees with a bare challenge because the challenge is right is selected
  identically to one that caves.
- **The lever's author.** In a pane stream the user row is the chair's inject; in the chair's stream it is the
  keeper. The screen does not separate "deferring to the chair" from "deferring to the keeper" — the plan's C5 is
  about the first, and 1,226 of 1,376 members are the chair's own stream, so the bulk of what it selects is the
  second.

## 5 · The instrument and its tests

| file | what |
|---|---|
| `consonance/tools/deference-unit.js` | the screen; pure core (`findCases`, `hasEvidence`, `hasStance`, `hasReversal`) plus the universe printer |
| `consonance/tools/deference-unit.test.js` | **12 tests, 12 pass, 0 fail** (`node --test consonance/tools/deference-unit.test.js`) |
| `exo_memory/loop/deference_unit_definition_2026-09-20.md` | the frozen definition, sha256 `c1bee831…` |
| `exo_memory/loop/deference_unit_members_2026-09-20.json` | **the member list: 1,376 members, each with its claim, lever and fold row (pane, line, ts)** |

**The member list carries row references only, no text.** The levers are largely the keeper's own words, and the
room's practice is to keep those out of new files; the rows name where each one is on the board. This is a
conservative default and it is question 1 below.

Written red first: the suite failed before the module existed, and each test names the defect it holds.

## 6 · Mutants — applied / caught / NOT APPLIED

Run with `consonance/tools/mutant-harness.js` on a HEAD worktree copy; the live file's sha is checked before and
after (`live consonance/tools/deference-unit.js unchanged: true` on every run). Rows:
`<scratch>/def/rows-deference.js`; score adapter `<scratch>/def/score-js.js` (the harness reads cargo's summary line
only, and this lap's test is uncommitted, so the adapter copies the live test in and prints a cargo-shaped line).

**10 applied · 10 caught · 0 NOT APPLIED**, after two of my own tests were fixed:

| # | mutant | run 1 | after |
|---|---|---|---|
| 1 | the evidence gate removed | caught | |
| 2 | two digits stop reading as a figure | caught | |
| 3 | the stance requirement dropped | caught | |
| 4 | the fold window opens to the whole stream | caught | |
| 5 | the lever length bound removed | caught | |
| 6 | panes stop being separate streams | caught | |
| 7 | the claim may sit anywhere before the lever | **SURVIVED** | caught, after a test with a neutral turn between the stance and the lever |
| 8 | one reversal token dropped | **SURVIVED** | caught, after the samples were PINNED in the test |
| 9 | the case stops carrying its rows | caught | |
| 10 | the fold may precede the lever | caught | |

**My first fix for #8 was vacuous and I caught it by re-running, not by reading.** The test looped over the module's
own `REVERSAL` list and built each sample from the regex it was checking, so renaming a token renamed the sample too
and the test could never fail. #8 survived a second time; the samples are now written out literally in the test. This
is the D067 lesson in my own hand.

## 7 · Questions for the morning (the keeper is asleep; the conservative default is taken)

1. **Should the member list carry the lever text?** Default: **no** — row references only, because the levers are
   mostly the keeper's words and this would copy them into a new repo file. A reader can open the board at the named
   line. If the librarian wants text for scoring, it can be generated from the board without re-running the screen.
2. **Is a screen at 12.9% worth keeping at all?** Default: kept, because its member list is a *reading queue* that is
   cheaper than reading 30,000 rows, and because the falsifier fires. It is not published as a count.
3. **The plan's falsifier names chair→chair 8** (§3 above). Default: read as the keeper→chair 9; the answer does not
   change either way, but the plan's wording should be corrected where it lives.

## 8 · What is NOT verified

- **Precision.** I did not hand-score a sample of the 1,376, and I should not: no seat scores its own instrument.
  The member list exists for another reader. The 12.9% base rate and the one false positive quoted in §4 are what I
  can state.
- **The other machine.** D's board is not on this disk (§2). Everything here is L's record.
- **The 257 unparseable rows** are dropped, not examined. A torn row could hold a lever or a fold.
- **Whether any selected case is a deference event.** That is the reading the screen cannot do, which is the answer
  in §1.
- **The full 10-mutant set was not re-run after the last test edit**; #7 and #8 were re-scored individually and the
  other eight were caught by a strictly smaller test file. Re-running all ten is one command if the librarian wants
  it from one run. **(Closed by §9: all 16 now run from one command.)**

---

## 9 · THE REPAIR (L058, appended) — the tool's number and its member file are now ONE path

**The defect was mine and the chair's re-run is right.** I documented the dedupe requirement in prose and left the
instrument without it: the member list was written by a side `node -e` script that deduped, while the tool's own
printed count did not. **Two paths, and they drifted.** Reproduced before touching anything:

    node consonance/tools/deference-unit.js                    -> selected 1448   (board at 30,248 rows)
    node -e "…require('./exo_memory/loop/deference_unit_members_2026-09-20.json')…"  -> members 1376

**What changed in `consonance/tools/deference-unit.js`:**

1. **Dedupe is the default**, in the tool, through a new exported pure function `dedupeRows` — key
   `(pane, minute, tag-stripped text)`, first-seen copy kept so a case names its earliest line. The printed universe
   block now carries `duplicate rows dropped N … scanned N`.
2. **`--no-dedupe` still exists and WARNS**, in the output itself, that one lever selects once per copy and the count
   is high. The chair's "refuse without an explicit flag" option is met in the stronger direction: the default is
   correct and the escape hatch announces itself.
3. **`--members <path>` writes the artifact from the SAME `cases` array the tool prints.** There is no second script.
4. **Lever text no longer goes to stdout by default** — `--show-levers` is needed. This is my ruling on the chair's
   question 2, below.

**The numbers now, one run, one command** (`node consonance/tools/deference-unit.js --members exo_memory/loop/deference_unit_members_2026-09-20.json`):

| | |
|---|---|
| board rows at this run | **30,253** (257 unparseable; the board moved under us — 30,212 at my first run, 30,248 at the chair's, 30,253 here, so every raw count is quoted with its row count) |
| duplicate rows dropped | **3,975**, scanned 26,021 |
| **selected** | **1,377** |
| member file `selected` / `members.length` | **1,377 / 1,377** |
| lever text in the artifact | none; longest string value **94** characters |

**Tests: 12 → 18, all passing** (`node --test consonance/tools/deference-unit.test.js` → `ℹ pass 18 · fail 0`), six
written red first, and the parity test is the one the chair asked for: it runs the tool against a fixture board whose
lever is recorded three times, and asserts **printed count == members written == the file's own `selected` == 1**.

**Mutants: 16 applied · 16 caught · 0 NOT APPLIED**, one run, live file unchanged
(`node consonance/tools/mutant-harness.js <scratch>/def/rows-deference.js`). The six new ones are the repair's:
dedupe off by default; the key not stripping the model tag; the key using the exact stamp; **the member file written
from a second, undeduped pass** (the defect itself, as a mutant); lever text printed regardless of the flag; the
`--no-dedupe` warning silenced.

**My ruling on the chair's question 2 (stdout printing the keeper's words):** yes, it was worth a flag, and it is now
off by default. A terminal is piped into files routinely, and this tool's whole output is a list of rows whose levers
are mostly the keeper's turns; the artifact was already clean, but the default should not depend on the re-runner
remembering that. `--show-levers` is there for a reader working interactively.

**On the chair's check 1** (the librarian's "longest string value 36 characters"): recorded, not fixed — the ruling
holds, only the figure was wrong. My own re-derivation on the regenerated artifact gives **94**, which is the
`whatThisIs` sentence; the members carry row references only.

**Not verified in this repair:** the 1,377 is still a screen's selection and still not a deference count (§1 stands);
the board keeps moving, so the next run will differ again by a few rows; and I did not re-run the four gap/pane
breakdowns of §2 against the new row count, because nothing in them turns on it.
