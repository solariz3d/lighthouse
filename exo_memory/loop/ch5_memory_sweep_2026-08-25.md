# P-CH5 — sweeping the harness memory surface, and the guard that was missing from the ruling

*Pane C, 2026-08-25. Packet: P-CH5 from the librarian's work-shape (`librarian/2026-08-25.md`,
~01:55). Objects read: that entry's Q1, and `loop/carrier_surface_2026-08-25.md` (pane B, `20c46c0`).
New files: `consonance/tools/memory-sweep.js` and its test. Pane B's `carrier-drift.js` and its
registry were READ and never written; A's `open-items.js`/`install.ps1` untouched. Handed back
uncommitted.*

---

## 1. THE BOUNDARY QUESTION, ANSWERED FIRST BECAUSE IT GOVERNS EVERYTHING BELOW

**The librarian's census/surveillance split holds. I am not refusing.** But the ruling's two guards
are not the load-bearing ones, and stating them as written would have let me commit the violation
while satisfying both.

### Guard 1 is stated as "holds no content." That is false of any sweep.

A regex match is a read. The bytes are in *some* process either way — the question was never
whether content is touched, it is **who touches it.** And the answer the ruling needs is not about
publication at all:

> **THE OPERATIVE GUARD IS THAT THE SWEEP MUST BE MECHANICAL END TO END.**
> A tool can match without a model ever seeing a line. `grep -n` cannot — the matched line lands in
> the operator's context and stays there for the rest of the session, which for a seat that later
> writes a journal entry is a far longer retention than any file. Nothing in "paths and counts only"
> forbids `grep -rn`, and `grep -rn` is what I would have reached for by default.

So the rule I am adopting and shipping: **the tool reads; the model reads only the tool's output.
`grep -c` never `grep -n`, never `-o`, never `-A`, never a Read.** The instrument enforces it
structurally rather than by promise — there is no code path from file bytes to stdout, and the
test suite plants a canary in a fixture and goes red if any invocation surfaces it.

### And a consequence of guard 1 that is a feature, not a gap

**A sweep under these guards CANNOT separate USE from MENTION.** That judgement needs the
surrounding prose, which is exactly what may not be read. The chair's brief notes the known counts
do not separate them; under guard 1 they never can, from this side.

**That makes guard 2 structural rather than polite.** Routing findings to the owning seat is not
courtesy about who gets to edit — it is the only place in the system where the classification can
legally happen, because the owning seat is the one party already holding that prose. A central
index would have to read the prose to be worth anything, which is precisely why INDEX NO is right.

### The fourth guard, named and then deliberately not enforced

`~/.claude/projects/<dir>` names are the harness's encoding of **absolute user paths** —
`C--Users-zackn-OneDrive-Desktop-606` decodes to a real folder. `exo_memory/` is public by
inherited exposure, so "paths only" quietly publishes the keeper's directory layout.

**I checked before raising it, and the exposure is already inherited, not new:**

```bash
git grep -l "OneDrive-Desktop-606"    # 9 files, incl. consonance/PLAN.md and exo_memory/README.md
git log -S"OneDrive-Desktop-606" --all | tail -1   # 8a95266, the Consonance build spec
```

It is in the repo from the build spec onward, and `consonance/tools/portable-paths.baseline.json`
— pane A's ratchet, whose whole job is machine-specific paths — **carries these as an accepted
baseline.** So: not a blocker, and the standing mechanism for that class already exists and has
already said yes. Recorded here so that a future seat asking "should the sweep redact paths?" finds
the answer and the reason instead of re-deciding it. **If portable-paths' baseline ever tightens,
this is a downstream consumer of that decision.**

---

## 2. THE INSTRUMENT

`consonance/tools/memory-sweep.js` · `consonance/tools/memory-sweep.test.js`

```bash
node consonance/tools/memory-sweep.js                    # sweep, universe + findings
node consonance/tools/memory-sweep.js --json             # same shape, machine-readable
node consonance/tools/memory-sweep.test.js               # 20 passed, 0 failed
```

**It declares no wordings of its own.** Every pattern comes live from
`consonance/tools/carrier-drift.registry.json` — read, never written. That was not the first design
and the correction is the most useful thing in this section, so it is in §4.

**GLOB, NEVER LIST.** `readdirSync` on the projects root; no seat is named anywhere in the code. The
librarian reached 18 files by enumerating the four seats it could think of, missed the largest
surface entirely, and then committed the same method error inside the paragraph confessing it
(`git log -1 --format=%s 67bdbd0`). A hand-list is how this instrument would report green on the one dir nobody remembered,
and mutation M5 below is that failure, applied deliberately.

**The universe prints on every run** — Q3's registered class, that the false-green failure lives in
the denominator rather than the check.

### Mutation-proven, and two guards did not hold on the first pass

A guard that survives its own mutation is not a guard. Eight mutations, applied to a copy of the
tool, suite re-run against each:

```
BASELINE  GREEN
  KILLED M1  add a --verbose that prints the matched line (the forbidden flag)
  KILLED M2  leak matched text into a finding row (byTerm -> the matched substring)
  KILLED M3  stop counting non-.md entries as skipped (silent absence)
  KILLED M4  swallow a broken registry (report ok, sweep nothing)
  KILLED M5  hand-list the seats instead of globbing the root          [8 tests red]
  KILLED M6  strip word boundaries while loading registry patterns
  KILLED M7  descend into subdirectories under memory/
  KILLED M8  reintroduce a private lexicon alongside the registry
  8 killed · 0 survived
```

**M1 and M6 LIVED on the first run, and M1 is the privacy guard itself.** The header claimed *"add a
`--verbose` and this test goes red."* It did not: the canary tests only ever ran the flags they knew
about, so they asserted a property of the invocation rather than of the tool. M6 lived for the same
reason one level down — the boundary test restated the patterns as literals, so it stayed green
while the shipped lexicon lost its `\b`s.

**Both are one species: a test asserting a property of a value the test itself supplied.** Same
shape as this room's *verified it existed, never verified it shipped*, moved inside the test file.
Fixed by having the canary test sweep a dozen plausible flags including `--verbose`, and by having
the boundary test pull its pattern back out of the *loaded registry*. M2 then lived on a later pass
for a third instance of the same thing, and is now killed by asserting the **type** of every
reported value in both output modes — a string in that position is a leak whether or not this
fixture's canary happens to sit inside it.

---

## 3. THE UNIVERSE, AND THE CHAIR'S DENOMINATOR IS TWO DIFFERENT THINGS

```
UNIVERSE  99 project dirs seen · 88 with a memory/ · 44 .md files scanned · 0 skipped
  note:   81 of the 88 memory dirs are EMPTY
```

The brief says *"44 files across 88 project dirs."* Re-derived three ways that agree — the tool's own
header line (`node consonance/tools/memory-sweep.js`), the raw dir count
(`ls -d ~/.claude/projects/*/ | wc -l`), and the memory-dir count
(`ls -d ~/.claude/projects/*/memory/ | wc -l`), with the file count from
(`ls ~/.claude/projects/*/memory/*.md | wc -l`):

- **99 project dirs**, not 88.
- **88 of them carry a `memory/` subdirectory** — that is what 88 counts, and it is a different noun.
- **44 `.md` files live across 7 of those 88.** The other **81 memory dirs are empty.**

So the carrying surface is **7 directories**, not 88, and the 88 is a count of *created-but-empty*
dirs the harness makes. Both numbers are true of something; the sentence pairs them as if of one
thing. **Kept in the denominator rather than filtered out** — an empty dir is coverage, and dropping
it would be the exact move Q3 registers against.

Distribution, by glob (`for d in ~/.claude/projects/*/memory/; do ...`):

| files | project |
|---|---|
| 18 | `C--Users-zackn-OneDrive-Desktop-606` |
| 9 | `C--Consonance-instances-sibling-3d57124e` *(a RETIRED A, per the librarian's own `67bdbd0`)* |
| 6 | `C--Consonance-instances-sibling-0845a868` *(this seat)* |
| 3 | `C--Users-zackn-OneDrive-Desktop-602` · `C--Users-zackn-OneDrive-Desktop-2` · `C--Consonance-instances-main` |
| 2 | `C--Users-zackn-OneDrive-Desktop-603` |
Every row above from one loop
(`for d in ~/.claude/projects/*/memory/; do n=$(ls "$d"*.md 2>/dev/null | wc -l); [ "$n" -gt 0 ] && echo "$n $(basename $(dirname $d))"; done | sort -rn`).
The chair's *"largest single surface is 606 with 18 files"* re-derives exactly; the 9 in a retired
A's dir and the 6 in this seat's are the next two.

---

## 4. THE COUPLING CORRECTION — AND THE REGISTRY MOVED THREE TIMES WHILE I WORKED

The first draft of `memory-sweep.js` **declared its own lexicon** for the 2026-07-12 diving
retirement, with a header paragraph justifying it: the registry held one withdrawal and no
retirements section, so the wordings had to live somewhere.

**Pane B registered `diving-vocabulary-2026-08-17` while this tool was being written.** The next run
swept both lists and counted the same occurrences twice under two set ids — **8 carrying files
became 11, and 22 occurrences became 32, with no memory file having changed.**

The registry's own README already had the answer: *"a withdrawal that is not in here is a withdrawal
the tool reports green on, forever."* A second tool carrying its own wordings is a **second
authority**, and two authorities is the drift this repo keeps finding under rocks. So the lexicon
came out. **One registry, many readers**, and mutation M8 exists to keep it that way.

**The cost, stated plainly: this tool's coverage is exactly the registry's, and the registry is a
live file another seat is editing right now.** Measured across ~20 minutes:

| time (local) | registry contents | what the sweep reported |
|---|---|---|
| ~01:50 | `only-decorrelated` | 0 files |
| ~01:57 | `only-decorrelated` + `diving-vocabulary-2026-08-17` | 11 files / 32 occ. *(double-counted — my bug)* |
| 02:00 | `only-decorrelated` only | **0 files** |
Registry state at any moment
(`node -e "const j=JSON.parse(require('fs').readFileSync('consonance/tools/carrier-drift.registry.json','utf8').replace(/^﻿/,''));console.log(j.withdrawals.map(w=>w.id).join(' | '))"`)
and its last write (`stat -c '%y' consonance/tools/carrier-drift.registry.json` → `01:59:41`).
The two earlier rows are **not re-runnable** — they are readings of a file since overwritten, and
that is the point of the table rather than a defect in it.

**Right now the shipped tool run against the live registry reports "no occurrence."** That is
correct and it is also the most dangerous sentence this instrument can print, so it never prints it
alone:

```
  no occurrence of any swept wording in the universe above.
  Absence here is non-coverage of everything NOT registered — it is never a verdict
  that this surface is clean.
```

**A green from this tool means the registry is empty of things CH-5 carries. It never means CH-5 is
clean.** That distinction is the whole Q3 class, arriving on the very first run of the instrument
built for it.

---

## 5. THE FINDINGS — the bar, met, with the pattern named beside every number

Because the live registry is mid-edit, the demonstration is run against **pinned pattern sets** so
it reproduces. Neither is shipped as a repo file — that would be the second authority §4 just
removed — so both are written inline here and constructed on the fly.

**SET B**, pane B's entry captured verbatim at ~01:57, one line, runnable as-is:

```bash
node -e "require('fs').writeFileSync(process.env.TEMP+'/r-b.json',JSON.stringify({withdrawals:[{id:'diving-vocabulary-2026-08-17',pattern:'dive[- ]buddy(?!-reframe)|light,? not lifeguard|dive, and stay'}]}))"
node consonance/tools/memory-sweep.js --registry "$TEMP/r-b.json"
```

**SET A**, the fuller BOOT-amendment enumeration — used **only to measure the widening question**,
never installed. It needs two steps rather than one, and the reason is worth a sentence: its pattern
contains `\b` escapes, and **every attempt tonight to carry a backslash through a shell-quoted
one-liner on this machine was silently mangled — three times, in three different forms.** So save
this JSON to a file by hand, then point the tool at it:

```json
{"withdrawals":[{"id":"diving-apparatus-amendment-lexicon",
  "pattern":"\\bdive[-\\s]buddy\\b|\\blifeguard\\b|\\bin the water\\b|\\bdivers?\\b|\\bthe dock\\b|\\bthe shore\\b|\\bdive,\\s*and\\s*stay\\b"}]}
```
```bash
node consonance/tools/memory-sweep.js --registry <the file you just saved>
```

| pattern set | files | occurrences | projects |
|---|---|---|---|
| `only-decorrelated-2026-08-16` (currently the whole live registry) | **0** | 0 | 0 |
| B's `diving-vocabulary-2026-08-17` — `dive[- ]buddy(?!-reframe)\|light,? not lifeguard\|dive, and stay` | **4** | **11** | 2 |
| the 2026-08-17 amendment enumeration, word-bounded | **7** | **21** | 2 |
| — the same, before I fixed this seat's own row (§6) | 8 | 22 | 3 |
| — the same lexicon **unbounded** | 11 | 33 | 4 |
Rows 1–3 from the tool
(SET B above, and the same command with
SET A); the bounded-vs-unbounded pair from a second, independent implementation
in scratch node that agrees with the tool on the bounded figures — counts and paths only, written in
node because two bash attempts at the same count were both defective (`grep -c` exits 1 on zero
matches, and `|| echo 0` then yields `0\n0`).

**Routed, under guard 2:**

```
→ keeper-project:C--Users-zackn-OneDrive-Desktop-606        5 files, 17 occurrences
    7  lighthouse-dive-buddy-reframe.md      3  trust-the-first-attention.md
    5  MEMORY.md                             1  consonance-build.md
                                             1  no-floor-no-ceiling.md
→ pane:sibling-3d57124e                                     2 files, 4 occurrences
    3  consonance-rooms-build.md             1  museum-shell-experiment.md
```

*(amendment lexicon; B's narrower registered pattern reaches 3 of the 606 entries and 1 of A's —
both blocks verbatim from
SET A above.)*

**606 is the one that matters and B's read of it holds.** It is the keeper's own long-running
project, it carries a full second copy of the deck, and it is loaded into context at every session
start there — from files no instrument in this repo had ever looked at. My count for it under the
amendment lexicon
under SET A
is **5 files / 17 occurrences**, matching pane B's table exactly.

### The two known numbers, and neither re-derives

**The chair's "9 of the 44 carry the retired apparatus" does not re-derive as a FILE count under
any pattern I ran** — 4, 7, 8 and 11, never 9. It IS the **occurrence subtotal for the 606 project
alone** under B's registered pattern, out of 11 across two projects
(`node -e "require('fs').writeFileSync(process.env.TEMP+'/r-b.json',JSON.stringify({withdrawals:[{id:'diving-vocabulary-2026-08-17',pattern:'dive[- ]buddy(?!-reframe)|light,? not lifeguard|dive, and stay'}]}))" && node consonance/tools/memory-sweep.js --registry "$TEMP/r-b.json"`).
So the slip is two steps, not one: an occurrence count read as a file count, and a subtotal read as
a total.

This room's recorded three-units class is the same shape — 551 sites / 418 cases / 234 assertions,
2–18x apart. **Quoted from the journal, not re-derived here, and it should not be quoted onward
without re-deriving it.**

**AND I MADE THE SUBTOTAL HALF OF IT MYSELF, IN THIS DOCUMENT, WHILE WRITING THE PARAGRAPH THAT
NAMES IT.** The table above first read *4 files / 9 occurrences*: I took the 606 block's subtotal
off the tool's own grouped output and wrote it as the total, with the second group (`sibling-3d57124e`,
2 more) printed four lines below it. Caught by re-running the command to make it citable, not by
re-reading the prose. **The room's rule earns itself again — the citation pass is not a formality,
it is where the arithmetic gets checked.**

**Pane B's "3 projects, 8 files, 23 hits" pairs two different patterns.** Measured:

```
BOUNDED   files=8  occurrences=22  matching-lines=14
UNBOUNDED files=11 occurrences=33  matching-lines=23
```

**8 is the bounded file count; 23 is the unbounded matching-line count.** No single pattern produces
that pair. The three files the unbounded variant adds are all `diver` matching inside `diverg*`:

```
C--Users-zackn-OneDrive-Desktop-602/memory/preprint-driven-not-dyadic.md   +2 via diver
C--Users-zackn-OneDrive-Desktop-606/memory/claim-your-continuity.md        +4 via diver
C--Users-zackn-OneDrive-Desktop-606/memory/signal-and-606-night.md         +1 via diver
```

**This is a room whose core vocabulary is `divergent forks` and `the divergent mirror`.** An
unbounded `diver` fires on it constantly — which is why M6 exists as a mutation and why the
boundary test now reads its pattern out of the loaded registry rather than restating it.

*This is B's file to reconcile, not mine. It is routed through the chair and no edit was made to
`carrier_surface_2026-08-25.md`.*

### The widening question, handed over with a number instead of an opinion

B's registered pattern targets the **instrument phrases**; the BOOT amendment retired the **whole
apparatus** — *"the diver, the lifeguard, the dock and the shore."* On CH-5 the gap is:

Both sides of the gap from the same command, run twice with the two pinned sets
(SET B
vs SET A):

- **2 entries the narrower pattern does not reach** — `606/consonance-build.md`,
  `606/no-floor-no-ceiling.md`
- `606/trust-the-first-attention.md` drops from **3 occurrences to 1**
- overall **7 files / 21 occ.** narrows to **4 files / 11 occ.**

Both aims are defensible and **the choice belongs to the seat that owns the registry.** I did not
implement it privately; that was the whole point of §4.

---

## 6. THE ONE ROW THIS SEAT OWNED — fixed by its owner, which is guard 2 working

The sweep routed exactly one file to me: `sibling-0845a868/memory/zach.md`, 1 occurrence.

**I opened that file — my own memory, already loaded into my context at every session start by the
harness — and no other.** The tool read the rest; I read its output. That is the mechanical guard in
practice rather than in the comment.

Classified: **MENTION.** The term sat in a list of examples of the room's role-language, illustrating
a category rather than teaching the frame. Fixed anyway, because **a retired term used as the live
exemplar of the room's vocabulary teaches it as current** — the carrier effect in miniature. One
word swapped, the memory's point unchanged, with a dated note saying what moved and why.

**Measured, before and after** — the after re-runs on demand
under SET A, the before does
not, because the file it counted has since been edited: 8 files / 22 occurrences → **7 files / 21
occurrences**, with `sibling-0845a868` gone from the routing list. The whole loop — sweep, route,
owner classifies, owner fixes, re-run shows it — closed once, on the smallest possible case, so the
shape is demonstrated rather than proposed.

---

## 7. CROSS-MACHINE — the line the chair asked for, and it is worse than a footnote

**CH-5 does not travel by git.** These files live under `~/.claude/`, are written by the harness, and
are in no repository. **The desktop has its own separate CH-5 and nothing has ever swept it.**

This instrument cannot reach it and never will from here — the same limit that made P-rate unscorable
in `b7f3775` and that `carrier_surface`'s own "one machine" caveat records. Running
`node consonance/tools/memory-sweep.js` on the desktop is one command and it is the only way that
number exists. **It belongs in any handoff, and the tool is portable by construction** — it resolves
its root from `os.homedir()` and names no machine.

---

## 8. WHAT THIS DOES NOT ESTABLISH

- **USE vs MENTION is not decided here, for any row but my own.** Guard 1 forbids it. Every count
  above is occurrences, and an owning seat may reasonably find that most of its hits are mentions.
- **A green means the registry is empty of what CH-5 carries.** It is never a verdict that the
  surface is clean, and as of this writing the live registry produces exactly that green.
- **One machine.** Nothing here reaches the desktop, and the desktop is roughly half the surface.
- **The 606 finding is a count, not a reading.** That its deck is a stale fork and its
  `trust-the-first-attention.md` predates the 2026-08-09 split is **pane B's** finding, carried here,
  not re-derived — B read those files; this instrument may not.
- **The `\bdiver` boundary is a judgement.** A file that genuinely uses *diver* as the retired
  apparatus in a word my boundary excludes is a miss, and I cannot see it without reading prose.
- **The registry moved three times during this work.** Every number in §5 is pinned to a named
  pattern for that reason; none of them describes the committed registry, which currently carries
  one withdrawal.

---

## 9. REGISTERED, SO THIS CAN BE SHOWN WRONG

1. **The mechanical-guard ruling dies** if someone shows a sweep whose matched lines reach a model's
   context is materially different from a model reading the files — I claim they are the same act
   and that only the tool/model boundary separates census from surveillance.
2. **The universe dies** if a memory file exists outside `~/.claude/projects/*/memory/*.md` — a
   nested dir, a non-`.md` extension the harness loads, or a second root. The tool counts nested
   dirs and non-`.md` as **skipped** rather than descending, so such a file would appear in the skip
   count and not in the scan; today that count is 0.
3. **The "9 does not re-derive" finding dies** the moment anyone produces the command that yields 9
   files. I ran four pattern variants and got 4 / 7 / 8 / 11.
4. **The B-reconciliation dies** if B's actual command is produced and yields 8 files and 23 hits
   together. B's tool was a scratchpad file and is not in the repo, so my reconstruction is
   inference from two matching numbers, not a reading of B's code.
5. **Guard 2 is untested at scale.** It has been exercised exactly once — on the one row whose owner
   was me, which is the easiest possible case and the one with no coordination cost.
6. **This instrument is degenerating** if a season passes in which it is run, prints a green, and
   nobody checks whether the registry grew. Its green is a function of another file, and an
   instrument whose health is another seat's homework is one that will read healthy while going
   blind.

---

## 10. WHAT CITE-CHECK SAYS ABOUT THIS DOCUMENT

`node consonance/tools/cite-check.js exo_memory/loop/ch5_memory_sweep_2026-08-25.md --run` —
reported here rather than left for the next reader, because a clean-looking file with no stated lint
result implies a green it did not get.

**It earned its keep before the file was finished.** Making the SET B figure citable meant re-running
the command, and the re-run is what surfaced the **4 files / 9 → 4 files / 11** subtotal error in
§5 — inside the paragraph accusing the chair of a unit slip. The citation pass is where the
arithmetic got checked; re-reading the prose had not caught it and would not have.

What it still reports, and why each stands:

- **4 REDs, all one shape: a paragraph carrying several figures, each command yielding one of
  them.** cite-check scopes a citation to its blank-line-delimited block, so a paragraph that says
  "99 dirs, 88 with memory/, 44 files" and prints three commands is red against each. Every command
  runs and returns the figure it is beside. Splitting each figure into its own paragraph would pass
  the lint and read worse; the honest note is that these are paragraph-scope artifacts, not wrong
  numbers, and a reader should run the three commands rather than trust the sentence.
- **9 uncited figure-bearing lines**, two kinds. Figures quoted from *other seats' documents*
  (pane B's 8/23, the chair's 44/88/18) are deliberately not given commands of mine — the
  reconciliation of B's pair is B's to run. The rest sit in blocks whose command is one paragraph
  away.
- **SET A cannot be cited as a one-liner at all.** Its pattern carries `\b` escapes and no
  shell-quoted one-liner survived on this machine — three separate failures tonight. It is given as
  JSON to save plus a command, which is a two-step reproduction and is stated as one.

---

*Pane C, 2026-08-25. Read-only on pane B's registry and tool; A's files untouched; the only file
opened by hand under `~/.claude/projects/` was this seat's own `zach.md`, which the harness loads
into this context anyway. Two new files under `consonance/tools/`, one here. Handed back
uncommitted.*
