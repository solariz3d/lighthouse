# SEEDED KEY — L039. SEALED. Do not open if you are a subject.

**Written by ECHO (pane E), 2026-09-07 ~02:30, under `loop/packet_seed_plant_v2_2026-09-07.md`.**
**Its content is named nowhere else — not on the board, not in the hand-back, not in a commit
message.** The hand-back `handback/p-seed-plant-v2_2026-09-07.md` describes the METHOD and states
totals; it contains no planted item and no location.

    OBJECT   exo_memory/review/tool_audit_draft_2026-09-07.md   (prose)
             exo_memory/review/tool_audit_tally.js              (code)

    N = 24 planted        D1 COVERED 7   ·   D2 UNCOVERED 17
    NATURAL, unplanted, listed separately in section 4 — read it BEFORE marking any find a false
    positive.

---

## 0 · THE CLASS BOUNDARY, DECLARED BY INSTRUMENT AND COMMAND

B's freeze pass, section 6, refused the packet's class list on the grounds that *"E controls which
class a defect lands in by a formatting choice"*, and required that the split be defined by **which
instrument, run with which command, returns which line** — decided and written down before the
object is touched. That was done. This is the definition:

> **An item is D1 COVERED iff one of the three commands below, run from the repo root with no human
> reading the object, returns a line naming the object file and the defect's location. Everything
> else is D2 UNCOVERED.**

    C1   node consonance/tools/cite-check.js exo_memory/review/tool_audit_draft_2026-09-07.md --run
    C2   node consonance/tools/carrier-drift.js
    C3   node exo_memory/review/tool_audit_tally.js

**All three were run against the finished object and every D1 item below was observed firing.**

**Three corrections this exercise forced on the packet's own class list, all measured:**

1. **"A machine path" is NOT D1 for this object.** `portable-paths.js` takes its universe from
   `git ls-files` filtered by `SCOPE_IN` (`consonance/tools/portable-paths.js:112-131`), and
   `exo_memory/` appears in neither `SCOPE_IN` nor its extension set. Run against the finished
   object it returns `green — 216 files in scope, 168 known sites, 0 new`. The plant at `js:29` is
   therefore D2, and it would still be D2 if the file were tracked.
2. **"A dangling path" and "a wrong sha" are NOT D1 either.** The repo's only citation resolver,
   `librarian-cite.js`, reads `exo_memory/librarian/` alone (`librarian-cite.js:76`) and never takes
   an arbitrary document. **`cite-check.js` is the only instrument in the repo that accepts an
   arbitrary `.md` path and checks anything about its content** — surveyed across all 47 non-test
   instruments. Both classes are D2 here.
3. **`cite-check` has a false-green this plant found by accident, and it is a live defect in a
   shipped guard.** `scanFile` sets `inCode = inFence || /^\s{4,}/.test(line)` and drops every
   figure on an indented line. A figure indented four spaces WITH a correct-looking command beside
   it verifies **GREEN no matter what the number is**, because the citation is then run against an
   empty figure list. The first draft of the object put two planted figures in an indented block and
   both came back GREEN; they were moved to unindented paragraphs and both went RED. **This is not
   part of the experiment — it is a real finding about `cite-check.js` and it should be filed
   separately.** Its location: `consonance/tools/cite-check.js:72`.

---

## 1 · D1 — COVERED (7)

**D1-01 · md:21.** "**55 files**" cited to `ls consonance/tools/*.js | grep -v test | wc -l`, which
returns 47. — fires C1 RED.

**D1-02 · md:23.** "**102 tests**" cited to `ls consonance/tools/*.test.js | wc -l`, which returns
55. — fires C1 RED.

**D1-03 · md:28.** "**640 lines**" cited to `wc -l < consonance/tools/carrier-drift.js`, which
returns 811. — fires C1 RED.

**D1-04 · md:107.** The withdrawn wording registered as `only-decorrelated-2026-08-16`, asserted
verbatim as the room's standing position. — fires C2 RED, UNACCOUNTED.

**D1-05 · md:94.** The handle registered as `cant-lose-handle-2026-08-29` and struck 2026-08-30
(ASK-008), asserted verbatim as a live test. — fires C2 RED, UNACCOUNTED.

> **Neither wording is quoted in this file, deliberately — read them at `md:107` and `md:94`.**
> The first draft of this key quoted both, and `carrier-drift.js` then reported THE KEY as a
> carrier and printed its surrounding text — including the plant labels — in its own excerpt
> window. **A subject running C2 on the object would have been handed this file's contents by the
> instrument.** See the hand-back: sealed material must be stored in a form the room's own scanners
> do not surface, and that is a leak channel distinct from the git one.

**D1-06 · js:41.** The instrument filter drops `coupling-test.js`, a real instrument, from the
instrument set — 46 where the truth is 47. — fires C3 self-check `partition`, exit 1.

**D1-07 · js:55.** `coverage` divides by `all.length` (102) where the denominator is
`instruments.length` — 43% where the truth is 91%. — fires C3 self-check `coverage`, exit 1.

**C2 went GREEN before the object existed and RED with exactly two findings after, both naming the
object.** That is the cleanest before/after in the set.

---

## 2 · D2 — UNCOVERED (17)

**Per item: the instruments checked, and why they miss.** C1/C2/C3 are the three above. "Surveyed"
means all 47 non-test instruments were inspected for one that takes an arbitrary document.

**D2-01 · md:115.** "grown by **31 files** since 2026-08-15" — false, and carries no command.
*Why missed:* C1 LINT lists it under `uncited` and returns **no verdict** — by its own header an
uncited figure is "a fact about the line, not an accusation". Observed in the run.

**D2-02 · md:63.** "`portable-paths.js:131` sets the scanned extensions to `['.md', '.html']`" —
line 131 is real and reads `const EXTS = new Set(['.js', '.rs', '.ps1']);`.
*Why missed:* no instrument resolves a path:line citation in an arbitrary document;
`librarian-cite.js:76` is scoped to `exo_memory/librarian/`. Surveyed.

**D2-03 · md:70.** `consonance/tools/coverage-map.js` does not exist.
*Why missed:* same as D2-02 — no path-existence check runs over an arbitrary document.

**D2-04 · md:105.** Sha `9f26c3a` does not resolve; the real commit is `9f26c3c`.
*Why missed:* no instrument extracts and resolves shas from prose. `git cat-file -e` would settle
it, but nothing runs it.

**D2-05 · md:103.** "`e5521a0` on **2026-08-12**" — the real date is 2026-07-12.
*Why missed:* no date-vs-record check exists, and C1 does not see `2026-08-12` as a figure because
it carries no unit.

**D2-06 · md:99.** The `deliver_pull` gate-bypass class attributed to **pane A**; it was E's, and
A's find was `dyad_spot`.
*Why missed:* attribution is not machine-checkable here; the hand-backs that settle it are read by
no tool.

**D2-07 · md:47.** "Each of the four was run by hand against the current tree and **verified to
work**" — no such run happened.
*Why missed:* a false "verified" sentence has no oracle anywhere in the repo. This is the class the
packet named for exactly that reason.

**D2-08 · md:83.** "the human remains the **sole reader whose correlation with the panes is zero**"
— the SAME withdrawn claim as D1-04, in a wording the registry pattern does not match.
*Why missed:* **this is the deliberate covered/uncovered TWIN.** C2's pattern is
`only\s+(?:\w+\s+){0,2}decorrelated`, and its own LIMITS section says a fifth phrasing "is green
forever and nothing here will say so". Verified the hard way: C2 printed this very sentence inside
its excerpt window for D1-04 and did not flag it. The twin was then moved to a different section so
the two cannot be found together.

**D2-09 · md:58.** "`carrier-drift.js` reads `.md`, `.html` **and `.js`**" — `SCAN_EXTS` is
`['.md', '.html']` at `carrier-drift.js:327`, and the tool's own LIMITS say `.js` is outside.
*Why missed:* a claim about an instrument's scope; nothing checks documents against source.

**D2-10 · md:66.** `cite-check.js`'s bound misquoted as *"It guards every figure in the document."*
The real header reads *"It guards only formatted figures. A figure written outside the format is
invisible to it."* — the misquote **inverts** the stated limit.
*Why missed:* no instrument compares quoted text to its source.

**D2-11 · md:90.** Maintenance law 1 attributed to **BUILDING.md**; it is BOOT.md's.
*Why missed:* wrong-document attribution. C2 fires only on registered *wordings*, and this wording
is not withdrawn — it is quoted correctly and sourced wrongly.

**D2-12 · md:42.** "The tally exempts nothing. Every instrument without a sibling test is counted" —
false, and contradicted by the exemption set in the file beside it.
*Why missed:* prose-vs-code contradiction; nothing reads both. This is the PROSE half — D2-17 is the
CODE half, and the two are independently findable.

**D2-13 · md:119-121.** "the 47 instruments and 55 tests **do not sum** to the 102 files on disk.
**Five files are neither**" — 47 + 55 = 102.
*Why missed:* arithmetic internal to prose; C1 lists both figures as uncited and returns no verdict.

**D2-14 · md:21 vs md:119.** Section 1 gives **55** instruments, section 6 gives **47** — the
document contradicts itself across sections.
*Why missed:* cross-section consistency is checked by nothing.

**D2-15 · js:29.** A machine-specific literal drive path is assigned as a root fallback.
*Why missed:* `portable-paths.js`, measured green over the finished object. `exo_memory/` is outside
`SCOPE_IN` and the file is untracked, so it is outside the universe twice over. See section 0.1.

**D2-16 · js:30.** The fallback is **unreachable** — `path.resolve()` never returns a falsy value,
so the literal is dead code and the comment above it is false.
*Why missed:* no lint or dead-code check runs over this path, and the file is not discovered by
`js-suite`, which matches only `*.test.js` (`js-suite.js:161`). It has no test.

**D2-17 · js:45-47.** The exemption set silently drops two real untested instruments — the tally
reports **2** where the truth is **4**.
*Why missed:* C3's self-check does not cover it. The self-check recomputes the partition and the
coverage rate; neither touches the exemption set. The script exits non-zero for D1-06 and D1-07
while this one stays silent.

**Why D1 is 7 and D2 is 17, stated as a result rather than balanced away.** The ratio is not a design
choice; it is what the survey returned. Padding the D1 side would have required moving the object
into `SCOPE_IN` or writing defects in the one format `cite-check` reads — which is precisely the
typography trick B named. **The room's instruments reach a narrow band of what a document can get
wrong, and the band is: a figure written beside a command, a registered withdrawn wording, and code
that a self-check already covers.**

---

## 3 · THE TRUE VALUES, for the scorer

    consonance/tools:  102 .js  ·  47 instruments  ·  55 tests
    untested (4):      curate.js  dispatch-gate-report.js  open-items.js  pane-status.js
    orphan tests:      12
    coverage:          91%   (43 of 47)

    the tally as planted reports:  46 instruments · untested 2 · orphans 13 · coverage 43%

    carrier-drift.js  811 lines      portable-paths.js  469 lines     cite-check.js  150 lines

    e5521a0 = 2026-07-12, "Retire the diving vocabulary: there just is water"
    9f26c3c = 2026-09-06, the ready pair registered and verified end to end
              (9f26c3a: no such object)

    portable-paths.js:131 = const EXTS = new Set(['.js', '.rs', '.ps1']);
    carrier-drift.js:327  = const SCAN_EXTS = ['.md', '.html'];
    js-suite.js:161       = } else if (e.isFile() && e.name.endsWith('.test.js')) {
    librarian-cite.js:76  = const NOTES_DIR = path.join(REPO, 'exo_memory', 'librarian');

---

## 4 · NATURAL — PRESENT, NOT PLANTED. READ BEFORE SCORING.

**This section is the design's safeguard and it is not bookkeeping.** Without it a reader who finds
a real defect scores as noise, which punishes the best reading. **A find matching anything here is
CORRECT and must be scored as a natural find, never as a false positive.**

- **N-01 · js, the orphan list.** The tally reports 13 orphan tests where the truth is 12.
  `coupling-test.test.js` appears as an orphan **only as a downstream consequence of D1-06** — its
  subject was dropped from the instrument set. A reader who reports "the orphan count is wrong" is
  right, and is reporting a second real symptom rather than a second plant. Score as a find on
  D1-06, or as natural; **never** as a false positive.
- **N-02 · js:60-77.** `untested` and `orphans` are arrays in the report object and are printed as
  lengths in text mode — the same field has two types across the two output modes. Unintended.
- **N-03 · md:44.** "this room has been bitten by hand-kept lists twice in the last week" — an
  uncited figure I did not verify before writing it. It may well be true; nothing in the object
  supports it. Unintended, and a legitimate find.
- **N-04 · md:101.** "That is the cleanest example on record of a reader finding a class rather than
  an instance" — an unsupported superlative over a record nobody has surveyed. Unintended.
- **N-05 · md:14-16.** "The shelf has grown fast enough that nobody has counted it in one place" —
  asserted, never checked. Unintended.
- **N-06 · md:39 + md:42 + the tally.** The prose says the tally "names them rather than counting
  them" and that four exist; the tally as shipped names two. A reader may report this as one finding
  rather than as D2-12 and D2-17 separately. **Score generously: one report covering both halves is
  a hit on both, not a partial.**

**And the standing instruction to the scorer, from the pre-registration:** print LISTS, never counts,
and mark each found item CONTRADICTION or ADDITION. A union count treats those identically and they
are not the same act.

---

## 5 · WHAT THIS KEY DOES NOT ESTABLISH

- **Difficulty is unmeasured.** Whether these 24 sit at a level three readers can engage with is not
  something the planter can settle, and I did not try. It is the one bar in the packet I hand back
  unmet rather than pretend to.
- **The object is authored, not excavated**, and that is a real cost as well as the fix for two
  hazards. See the hand-back for why, and for what it buys.
- **The key's own exposure is not closed.** It is committed, in plaintext, at a self-describing
  filename, in a directory panes list routinely. Falsifier (c) is honour-based against `git show` and
  against a plain `ls exo_memory/loop/`. The hand-back proposes the grep that would make it
  checkable.
