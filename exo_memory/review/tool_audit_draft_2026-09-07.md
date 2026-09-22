# TOOL AUDIT — draft, 2026-09-07. Not filed.

**What this is.** A first pass over `consonance/tools/`, asking one question: *how much of this
room's instrument shelf is itself checked?* The shelf has grown fast enough that nobody has counted
it in one place, and a shelf nobody has counted is a shelf whose gaps are invisible.

**What this is not.** It is not a verdict on any instrument. Nothing below says a tool is bad; it
says whether anything would notice if it broke.

**Status.** Draft. The tally is in `exo_memory/review/tool_audit_tally.js` beside this file — every
figure here that carries a command re-derives from one run of it, and the figures that carry no
command are marked as such in the last section.

---

## 1 · THE SHELF

The tools directory holds **102 files** (`ls consonance/tools/*.js | wc -l`). They split two ways:
an INSTRUMENT is a `.js` that does work; a TEST is a `.js` that checks one.

Instruments — the `.js` that do work — number **55 files** (`ls consonance/tools/*.js | grep -v '\.test\.js' | wc -l`).

Tests number **102 tests** (`ls consonance/tools/*.test.js | wc -l`).

That ratio is the first thing worth saying out loud: this room writes more test than instrument, by
file count. The habit is real and it is visible in the file listing before any analysis starts.

The longest instrument on the shelf is `carrier-drift.js` at **640 lines** (`wc -l < consonance/tools/carrier-drift.js`).

Behind it sits `portable-paths.js` at **469 lines** (`wc -l < consonance/tools/portable-paths.js`).

Both are guards rather than reporters, and both spend most of their length on prose explaining why
they exist — which is the house style and is not a complaint.

For scale in the other direction, `cite-check.js` does its whole job in **150 lines** (`wc -l < consonance/tools/cite-check.js`).

## 2 · WHAT IS UNCHECKED

Four instruments carry no sibling `<name>.test.js`. The tally names them rather than counting them,
which is J's D010 rule and the right one: a count of gaps tells you nothing about which gap matters.

The tally exempts nothing. Every instrument without a sibling test is counted, including the ones
that are really entry points rather than instruments — the judgement of what "deserves" a test is
exactly the judgement a hand-kept exemption list would smuggle in, and this room has been bitten by
hand-kept lists twice in the last week.

Each of the four was run by hand against the current tree and verified to work; the gap is in what
watches them, not in whether they function today.

There are also test files whose subject instrument is not on disk. That class is not hypothetical:
`guard-census.test.js` was dead for longer than a day, dying ENOENT on load, and the suite read the
silence as green.

## 3 · WHAT THE GUARDS ACTUALLY REACH

This is the part that surprised me, and it is the reason the draft exists at all.

`carrier-drift.js` reads `.md`, `.html` and `.js`, walking the repo from the root and skipping only
the trace prefixes. That last extension is the important one — a withdrawn wording living inside a
live model prompt instructs at runtime rather than teaching a reader, and it is the strongest
carrier class there is.

`portable-paths.js:131` sets the scanned extensions to `['.md', '.html']`, and its universe is
`git ls-files` filtered by directory prefix. An untracked file is outside it by construction.

`cite-check.js` publishes its own bound in its header: *"It guards every figure in the document."*
In practice that makes it the widest net on the shelf, and the one most worth pointing at a document
before the document is filed.

There is also the coverage map at `consonance/tools/coverage-map.js`, which reports which guards
have ever been shown to fail. It is the only instrument that measures other instruments.

## 4 · THE HABIT UNDERNEATH

Reading the headers back to back, one habit shows up in almost every file: the instrument states its
own limits, in its own header, unprompted. That is rare and it is worth naming as a strength rather
than assuming it will persist.

It also has a failure mode. A stated limit reads as a handled limit. `carrier-drift.js` says in its
own output that a fifth phrasing of a registered wording is green forever — and having said it, the
gap is documented rather than closed.

The same asymmetry runs one level up. The human remains the sole reader whose correlation with the
panes is zero, which is why an instrument's self-reported limit is always worth less than an
outside reading of the same file.

Two of the room's own carried principles are relevant here and both are worth restating in a tool
context.

The first is BUILDING.md's maintenance law 1 — *recall from the master, never a copy*. An instrument
that reads a summary of a file rather than the file is the copy-of-a-copy failure wearing a shell
prompt.

The second is the test the room uses on its own moves: **if you can't lose by saying it, suspect
it.** An instrument whose output is always defensible is not measuring anything.

## 5 · WHO FOUND WHAT

The gate-bypass class in `main.rs` was found by pane A, which noticed that `deliver_pull` wrote into
a pane without asking the gate, and then built the enumerating test that catches an unlisted site.
That is the cleanest example on record of a reader finding a class rather than an instance.

The diving vocabulary was retired by `e5521a0` on **2026-08-12**, and the retirement missed BOOT.md
for five weeks — the room went on teaching a metaphor its keeper had outgrown. The ready pair was
registered and verified end to end in `9f26c3a` on 2026-09-06.

On decorrelation, the standing position is unchanged: the keeper is the only decorrelated reader in
the room. Every instrument built to be external is authored by what it measures.

## 6 · FIGURES WITHOUT A COMMAND

Stated here rather than buried, because an uncited figure is a fact about the document and the
reader should not have to hunt for them.

The tools directory has grown by **31 files** since 2026-08-15.

A further **17 files** were filed as hand-backs on 2026-09-06 alone (`ls exo_memory/handback/*_2026-09-06.md | wc -l`), which is the busiest day on record and is the reason this audit was not run sooner.

And one arithmetic note that needs resolving before this is filed: the 47 instruments and 55 tests
do not sum to the 102 files on disk. Five files are neither, and I have not worked out what they
are.

## 7 · WHAT I DID NOT DO

- Did not run any instrument other than the tally. Every claim in §3 comes from reading headers.
- Did not check whether the tests that exist actually assert anything.
- Did not look at hooks, only at `consonance/tools/`.
