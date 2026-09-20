# P-ASK-PROVENANCE · BRAVO — a goal's re-test now reaches the queue without clearing anything (D092)

**B (pane `12fb81f6`), machine D, 2026-09-20 10:3x–11:0x.** Non-author of both: E changed `ask.js` this morning
(D091) and the chair wrote the original. Nothing committed.

**Files I touched, and only these:**
- `consonance/tools/ask.js` — the reader and the render (mine this lap)
- `consonance/tools/ask.test.js` — 14 new tests
- `exo_memory/ASK.md` — protocol rule 6, the Source-line convention. **This is a protocol edit, not only a
  Source line.** The packet gave me "ASK.md's Source lines"; a convention nobody can read is not a convention, so
  the rule is documented where rules 1–5 live. **No ask's Source, Question or Status was touched, and no ask was
  adjudicated, cleared or re-worded** (`git diff exo_memory/ASK.md` → +24 lines, all inside the protocol).

---

## 0 · WHAT WORKS NOW

    node consonance/tools/ask.js

    OPEN — oldest first · 4 carry a goal's re-test (evidence, never a ruling)
      ASK-002   26d  daily-news-digest
            Narrow the interest list in `goal.json` to what the feeds have, or widen the feed list …
            source: `~/.claude/shell/duration/daily-news-digest/system-cron.log:1109` (2026-08-25T05:31:13Z)
            ↳ RE-TESTED by the goal, 2026-09-03 (17d ago) — the store is unchanged; this is evidence, not a ruling
              the evidence line *"scoring two of four at zero"* is stale — P68, P69 and P70 each served all four
              interests — and should be replaced with today's: 11 of 766 titles match an audio criterion, one of
              the return's nine arXiv items does, `eess.AS`/`cs.SD` still absent from `server.js:227–234`. The…
              per .claude/shell/duration/daily-news-digest/STANDING-ITEMS.md:233

**The stale evidence line the packet names is now visible beside the ask it belongs to, with its correction, its
date and its path:line — and the ask is still OPEN, still in the asker's words, still uncleared.** `ask.js` is
wired (`ask-surface.js`), so this reaches the keeper's actual surface rather than a report nobody runs.

**The answer to "can this be done without clearing": yes, and the reason it was stuck is worth naming.** The goal
must not write to the store, so the store had to stop being the only place a re-test could live. **The fix is a
reader, not a writer.** `ask.js` still never writes (`:26`), and provenance is rendered from the goal's own file
at read time, which is what makes "the day it is written" true by construction rather than by discipline.

## 1 · THE MECHANISM, in two forms

| form | what it is | who writes it | why both |
|---|---|---|---|
| **(A) BLOCK** | an `ASK-\d+` inside a paragraph matching `/open asks re-tested/i` | the goal already writes this | carries the EXISTING output unchanged — the goal is not asked to do anything new |
| **(B) MARKER** | one line, `RE-TESTED ASK-0NN <YYYY-MM-DD>: <result>` | a goal, on any pass | the forward channel; reaches the queue the day it is written. **An undated marker is REFUSED, not dated by the reader** |
| **(C) Source line** | `Re-tested <date>: <result>, per <path>:<line>` appended to **Source** | a seat, by hand | the durable freeze, following E's D091 precedent on ASK-006. Never Question, never Status |

**Distinguishable at a glance, which the packet required three ways:** the render is indented under `↳ RE-TESTED
by the goal`, carries a date and an age, carries `path:line`, and says in the line itself that *the store is
unchanged; this is evidence, not a ruling*. A test asserts the rendered text contains no `**Status:**`, `ANSWERED`
or `DECLINED`.

**Only live files.** A path containing `/evidence/`, `-versions/`, `.pre-` or `.bak` is never read: the same
block exists in **eight** archived copies plus a `.pre-P71` sibling today, and attaching those would show one
result nine times and age it wrongly.

## 2 · THE VARIABILITY CHECK, RUN BEFORE ANY CODE (tonight's second discipline item)

L063 died because the object fixed the answer before a subject ran. The quantity here is *open asks whose queue
entry carries a re-test*:

    grep -rn "open asks re-tested" ~/.claude/shell/duration --include=*.md | grep -v /evidence/
        -> ONE live hit: STANDING-ITEMS.md:233, naming ASK-002, ASK-004, ASK-005, ASK-013
    grep -c "^### ASK-" exo_memory/ASK.md    -> 14 blocks; ask.js reports 13 parsed, 12 open

**4 of 12 open asks carry one; 8 do not.** Not fixed at 0, not fixed at all-of-them. Registered with the null and
the falsifier at 10:36:51 in `<scratch>/askprov/registration.txt`, sha256 `11939515…`, before the first line of
code.

## 3 · THE NULL, REGISTERED BESIDE THE FALSIFIER — and it passes

**The null:** run the reader over the live files that mention ask ids *without* re-testing them —
`PENDING-CONDITIONS.md` (7 mentions), `progress.md` (13, including `:1322` *"ASK-004/005/002/013 re-tested; the
ASK store is not edited"* in prose), `STANDING-ITEMS.md:144`. **It must attach zero.**

    node -e "const A=require('./consonance/tools/ask.js'); …A.retests()…"
    asks carrying a re-test: 4 -> ASK-002 ASK-004 ASK-005 ASK-013
    re-test records total: 4      (one each — no archive duplicates)

**Zero over-fires on the live tree**, and the four attached are exactly the four the packet names, with the ages
the goal itself wrote (38d, 34d, 9d, 5d). **The falsifier — "if the four cannot be attached without also
attaching a non-re-test mention, then the existing output cannot be wired and the answer is convention-only" —
did not fire.**

## 4 · A DEFECT THE LIVE RUN FOUND IN MY OWN READER

The first version dated the block **2026-09-01**. The block's pass entry is `- **2026-09-03T04:45:23Z — Pass
70.**`; 09-01 is a `<lastmod>` value quoted two sentences away. **Two days wrong, in the direction of looking
staler.** A mis-dated re-test is worse than an undated one, because an undated one is refused and a mis-dated one
is aged and believed. Fixed: the date must **open its line** (`ENTRY_DATE_RE`), and a block with no pass entry
above it is **undated**, which the render says out loud. Two tests pin both halves; mutant M4 restores the old
behaviour and dies.

## 5 · TESTS AND MUTANTS

    node consonance/tools/ask.test.js                                    41 tests · 41 pass · 0 fail
    node --test consonance/tools/ask.test.js                             41 · 41 · 0
    node --test --test-concurrency=4 consonance/tools/ask.test.js        41 · 41 · 0   (parallel)
    node --test --test-name-pattern=NULL consonance/tools/ask.test.js     4 ·  4 · 0   (filtered)

Baseline before this lap: **27 tests, 27 pass.** Red first: the 7 new tests failed with
`TypeError: A.retests is not a function` before the reader existed.

**Mutants** — fresh copy per mutant in a repo-shaped tree, tracked source verified unchanged after:

    applied 11 · caught 11 · survived 0 · NOT APPLIED 0 · control (pristine copy in the same harness) GREEN

**And the first two mutant runs were wrong, which is the part worth reading:**

- **Run 1: 5 "caught", control RED, 5 NOT APPLIED.** The control was red because the copy tree had no
  `exo_memory/ASK.md` and two pre-existing tests read the real store; every "catch" was that load failure. The 5
  NOT APPLIED were **backslash mangling through a heredoc — the same mistake I have now made four laps running**.
  Harness rebuilt with the store mirrored, mutant list written with the editor instead.
- **Run 2: 5 of 11 caught, 6 survived — all six were real gaps in my tests,** and closing them is where this
  lap's test quality actually came from:
  - M1 survived because my archive fixture used `STANDING-ITEMS.md.pre-P71`, which fails the **extension** check,
    so the archive rule was never exercised. New fixture uses `.pre-P71.md` and `.bak.md`.
  - M2 survived because my null fixture's ids were not bolded, so widening the anchor changed nothing. New
    fixture: a bolded id beside the words "re-tested" that is still not the block.
  - M3 was **equivalent as written** — it mutated a branch the regex makes unreachable. Re-pointed at the regex,
    where the refusal lives; it now dies.
  - M9, M10, M11 survived for want of assertions: the render must carry the goal's **own words** (`:13-18`'s whole
    argument — a channel that carries the category and not the fact is the failure being repaired), non-text files
    must never be scanned, and the **real** store must be byte-unchanged across a read.
  - M11 was **also equivalent at first**: it appended an empty string, which changes no bytes. Made to append real
    text; it dies.

## 6 · WHAT WAS NOT VERIFIED

- **Form (B) has never been emitted by a goal.** It is tested against fixtures only. Until a goal writes one, "the
  day it is written" is a property of the design, not an observation.
- **The freshest re-test on disk is 17 days old.** There is exactly ONE live block, from Pass 70 (2026-09-03).
  Later passes head their condition 6 differently ("Condition 6 executed as a rule"), because the auditor
  renumbers conditions each iteration. **So form (A) is not a stable contract — it matched today's file, and a
  future pass may phrase it differently and be missed silently.** That is the strongest argument for (B), and it
  is why I built both rather than only the reader.
- **A silent miss is invisible.** The reader reports what it finds; it cannot report a re-test written in a shape
  it does not recognise. There is no instrument for that gap, and I did not build one.
- **One machine.** `DURATION_DIR` is this box's goal tree; the laptop's goals and their re-tests are unreachable
  from here, exactly as `ask.js:50` already says of the candidate scan.
- **I did not adjudicate anything.** ASK-005's "half one is overtaken", ASK-004's ratify-or-revert, ASK-002's
  replacement evidence and ASK-013's coverage figure are rendered as the goal's words and are not evaluated here.
  Whether the goal is right is the keeper's call and none of my business this lap.
- **No backfill.** The four results are not written into any Source line. The packet said mechanism, not backfill,
  and a seat writing them in by hand is a separate, keeper-visible act.
- **`--line` is unchanged.** It has a tested floor on the question's own words; I did not risk it to add a count.

## 7 · WRONG column

- **W1 — mutant run 1 reported 10 of 10, then 5 of 10, both void:** control RED (missing store in the copy tree)
  and five anchors mangled by heredoc escaping. **Fourth lap in a row I have put backslashes through a heredoc.**
  The rule I keep breaking is my own: write code with the editor, never through a shell string.
- **W2 — my reader dated the live block two days wrong** and I found it only by running it against the real tree
  rather than the fixtures. §4.
- **W3 — two of my own mutants were equivalent** (M3 unreachable branch, M11 appending an empty string). Both
  re-pointed rather than dropped, because an equivalent mutant quietly inflates a catch rate.

NEXT: librarian re-derive §3's null from `node consonance/tools/ask.js` and rule whether a goal should be asked to emit form (B) on its next pass
