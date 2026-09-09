# P-ATTRIBUTION — the correction mechanism, and the ruling the packet wanted more

**SEAT: pane BRAVO. LAP: L048. WRITTEN 2026-09-09, 00:20–02:0x local.** Packet:
`exo_memory/loop/packet_attribution_2026-09-08.md`. Nothing committed; nothing staged.

    node consonance/tools/essay-provenance.js --no-color     the table, with the corrections
    node --test consonance/tools/essay-provenance.test.js    55 pass, 0 fail (39 before)
    exo_memory/provenance_corrections.jsonl                  the ledger — path and format below

---

## 1 · THE PREMISE CORRECTION IS ITSELF WRONG, AND THAT IS THE FIRST FINDING

The dispatch ordered: *say which table shows what before you write the fixture.* Done first, and it
came back against the order that carried it.

**There is ONE shape, not two. The four captured files are ROWS, with the wrong seat.** They were
rows yesterday too.

    git log 14cc0ad --name-only --pretty=format:"%h %s" -- essay/

`14cc0ad` is the HEAD that carried the WRONG-84 entry (committed 07:41:33). `babe926` landed at
07:38:51, and at `14cc0ad` its four paths — both bare drafts and both prompts — are listed in the
history the tool reads. The milestone run is reported inside the `210dabc` block (07:48:25), so
whenever in that window it ran, `babe926` was already an ancestor of HEAD.

**And the instrument cannot produce the missing-row shape for a committed path.** `reconcile()`
emits one row per artifact path per commit with no filter between the git read and the row. That is
now an invariant with a test on it rather than a fact about tonight — *every artifact path a commit
carries produces exactly one row*, asserted with and without corrections applied.

**What the record actually says**, quoted rather than characterised. The librarian, 2026-09-07.md
~07:55: *"Provenance milestone run … the bare drafts do not yet appear as rows (landed in `babe926`
under this desk's name — WRONG 84 stands)."* The sentence contains both readings — an absence and a
landing under a name — and I cannot tell from outside which was meant. What is checkable is that the
rows existed. **The chair then read the ambiguous half, and built a premise on it that would have
had me write a fixture for a state the tool cannot reach.** That is the room's own carrier problem
at one hop: a hand-made sentence about an instrument's output, relayed, becoming the premise of the
next seat's work. The standing rule — every figure in prose re-derives from one named run — is what
this cost: one command would have settled it before the dispatch.

**The shape the chair was reaching for exists, and I have printed it.** There is exactly one way
this table can drop a file that landed: **git prints no file names for a merge commit**, so an
artifact introduced BY a merge lands in no row at all. Live count, printed in the output every run:
**0 merge commits touch the prefix** (0 in the repo's 1,221 commits). Blindness 7. The other
adjacent case was already built in L047 and is the same distinction the dispatch invoked:
`ON-DISK-NOT-COMMITTED`, the third state between done and never-started.

---

## 2 · WHAT WAS BUILT, AND WHY IT CANNOT BE SATISFIED BY ASSERTION

The permission to refuse was: **if no referent rule exists that a motivated seat cannot satisfy with
a plausible-looking pointer, say so and stop.** One exists. I did not refuse.

    A CORRECTION IS NEVER BELIEVED. IT IS CHECKED AGAINST A BLOB FROZEN IN THE COMMIT IT CORRECTS.

Four conditions, all machine-checked, all against objects nobody can now rewrite:

    1  the sha must be a commit the tool already read, and that commit's own diff must contain the
       corrected PATH                                     -> else NO-SUCH-COMMIT / PATH-NOT-IN-COMMIT
    2  the EVIDENCE must be readable at that sha, `git show <sha>:<evidence>` — the content as it
       stood when the commit landed, never the working tree   -> else EVIDENCE-NOT-READABLE
    3  the evidence's HEADER (first 4 KB) must carry the claimed seat as a WHOLE WORD on a line that
       also carries an authorship marker (`SEAT:`, `placed here by`, `written by`, `spawned by`,
       `filed by`, `authored by`, `committed by`)         -> else NO-SEAT-IN-EVIDENCE
    4  when the evidence is a DIFFERENT file from the one corrected, its header must NAME the
       corrected path                                     -> else EVIDENCE-DOES-NOT-NAME-PATH

**Why a motivated seat cannot satisfy this.** To take an artifact it did not write, a seat would
have to have written its own name into that artifact's header *before the commit was pushed* — which
is not distinguishable from having authored it. The evidence door reads `git show <sha>:<path>`,
never the file on disk, and that is the single property the whole mechanism rests on; it is tested
against a real repository (created by the test, committed, then the working copy rewritten) rather
than asserted about a comment.

**Three more properties, each a bar the packet set:**

- **Never a silent override.** The row keeps `seatFrom` and prints `librarian->chair` in table 1,
  carries the ruling `SEAT-CORRECTED`, and gets a CORRECTIONS block quoting the evidence line. The
  `--json` shape keeps both names too. A table that quietly prints the right answer teaches nobody
  that a capture happened, and the capture is the thing worth seeing.
- **A correction is a claim.** `by`, `at` and `seat` are required; a row missing any is REFUSED with
  the field named. Refusals are printed, never dropped.
- **Not last-writer-wins.** The first verified correction for a (commit, path) stands; a later one
  is REFUSED as CONFLICTING. Keyed on the commit's own full sha, so an abbreviation and the long
  form cannot stand as two corrections of one artifact.

**Where it lives and why.** `exo_memory/provenance_corrections.jsonl` — in the REPO, not in
`data/`. The other four ledgers are machine-local, which is blindness 2 and would make a correction
invisible on the second machine, on the eve of a two-machine lap. JSONL like its peers, with one
deviation stated in the file: lines beginning `#` are skipped, because this is the only one of the
five sources written by a hand rather than a machine and it has to be legible where it is written.

**The limits, printed rather than buried.** It authenticates against the FROZEN RECORD, not against
the world: a header that was already false when written is inherited, not caught. A file with no
header and nothing naming it — a `.pdf`, a `.png` — cannot be corrected at all, and that failure is
closed and loud. And corrections change the SEAT column only: the log-entry ruling is keyed to the
committing thread, so a correction naming the log-keeping thread would leave the row saying the
entry is owed elsewhere (blindness 8; not live — no correction on file names it).

---

## 3 · THE LIVE RESULT

Four rows written, all four verified, none refused:

    2026-09-08 librarian->chair  essay/bare/prompt_B_2026-09-08.txt   … SEAT-CORRECTED
    2026-09-08 librarian->chair  essay/bare/prompt_C_2026-09-08.txt   … SEAT-CORRECTED
    2026-09-08 librarian->chair  essay/ESSAY_B_BARE_2026-09-08.md     … SEAT-CORRECTED
    2026-09-08 librarian->chair  essay/ESSAY_C_BARE_2026-09-08.md     … SEAT-CORRECTED

    corrections offered / applied        4 / 4
    corrections REFUSED                  0

The two prompts carry no header of their own. They are reachable only because each draft's header
names its prompt — `essay/ESSAY_B_BARE_2026-09-08.md` says *"The full prompt is preserved at
`essay/bare/prompt_B_2026-09-08.txt`"* — which is condition 4 doing real work on its first live
case, and is exactly why a `.pdf` in that position would stay uncorrectable.

**One thing the correction does not say, and the frozen header does.** These four are *placed* by
the chair and *written* by a bare instance the chair spawned; the header states both
(*"Placed here by the chair; the header is the chair's, the essay is not"*). The table's SEAT column
means the seat that LANDED the file. The distinction is carried in the correction's `note` and
printed. **The tool conflates lander and author, and for these four the record is explicit that they
differ** — worth a column one day, not tonight.

**The tree moved under this lap:** the Third Place landed `eab82fd` and `328df3d` while I worked, so
the run now reads 39 commits / 97 rows against yesterday's 37 / 94. Re-derive from a run; do not
quote these.

---

## 4 · THE RULING — §3 OF THE PACKET

**(c), the structural fix: per-seat worktrees. And this is not my preference — it is a falsifier the
room registered in advance, firing.**

`COMMITTEE.md:142` (K, 2026-09-04, verbatim): *"if a capture happens again after this, the index is
not lockable by convention and the answer is per-seat worktrees, not a better sentence."*

A capture happened again after that. `babe926`, 2026-09-08 07:38:51, **266 of its 270 insertions
were the chair's four staged files** (92 + 106 + 23 + 45 = 266; `git show --stat babe926`). The
condition was named before the event, in the words that would make it true, and the event occurred.
Choosing (b) now is choosing to un-register a fired falsifier because the remedy is inconvenient.

**The recorded run of captures, four in seven days, three different seats, two machines:**

    2026-09-02  e6215a8 + bbac990   the chair, twice in 84 seconds — A's and E's live files
    2026-09-04  38ae5c2             the librarian (desktop) — seven of pane K's staged files
    2026-09-04  WRONG 73            the desktop, same class (2026-09-04.desktop.md 12:41)
    2026-09-08  babe926             the librarian (laptop) — the chair's four

**What each option costs.**

**(a) extend the gate to refuse staged paths not owned by the committing seat.** The blocking fact
is that **git's index has no author field** — nothing records who staged a path, so "not owned by
the committing seat" is not readable from the index. The implementable form is different: *refuse
when the staged set contains paths beyond the ones this commit names* (`stagedPaths()` already
exists at `commit-gate.js:339`, and `--paths` is already an argument at `:416`). That would have
fired on `babe926`. **What it does not fix is why it did not fire**: `.git/hooks` holds nothing but
samples and `core.hooksPath` is unset, so **the gate is a tool a seat chooses to run, not a hook** —
and the failure it exists to catch is precisely a seat not thinking about it. Its own source says so
in the sentence next to the ownership rule: *"the seat that must not commit is the seat that can
disable it… The structural fix — one checkout per seat — is named in the hand-back and is not this
file."* Cost: one afternoon; near-zero risk; and a control against the reflex only, by the author's
own statement. **Worth doing anyway** — it is the difference between an unclaimed path being handed
over silently and being refused — but it is not the answer to §3.

**(b) leave it, corrections as the standing repair.** Cost is the one the packet already named and
the reason it asked: the ledger repairs the record and does nothing about the cause, so the number
of corrections grows as a reproach nobody acts on. It also has a cost the packet did not name: **the
ledger cannot reach every capture.** A captured `.pdf`, `.png`, or any file whose header nothing
names, is uncorrectable by construction — `babe926` happened to carry four files with headers, and
`38ae5c2` captured seven `.js` files whose headers name no seat at all. A repair that covers the
easy half is the worst thing to rely on, because the coverage is invisible from the counts.

**(c) per-seat worktrees.** `git worktree add` gives each seat its own working directory **and its
own index**, on one repository and one branch. Capture stops being a rule and becomes impossible:
what a seat commits is what is in *its* index, and no other seat can put anything there. Measured
cost, not estimated: `.git` is **45 MB** (`size-pack 12.76 MiB`), so N checkouts is tens of MB, not
gigabytes. The real costs are three, and all three are checkable rather than feared:
  1. **Path assumptions.** Anything resolving to one checkout breaks. The instrument for exactly
     this already exists and is green — `portable-paths.js`, the L046 baseline — so this is a
     measurable job, not an open-ended one.
  2. **Commits from several worktrees onto one branch** will collide where two seats touch one file;
     today the shared checkout hides that by letting the last writer win silently. Surfacing it is
     the point, but it is new work for whoever holds the branch.
  3. **The panes' cwd changes**, which touches the launcher and anything that assumes
     `C:\Consonance\lighthouse` is *the* tree.
**And the honest limit on (c):** it defeats *capture*, not *collision*. Two seats can still edit the
same file in two worktrees and one can still overwrite the other's landed work through the branch.
It removes the failure that has happened four times; it does not remove every failure.

**Falsifier for this ruling, registered here:** if per-seat worktrees are built and a commit after
that date still carries a file its committing seat did not write, the diagnosis was wrong — the
hazard was never the shared index — and the answer is the review discipline, not the plumbing.

**What I did not do, per the packet:** neither (a) nor (c) is built here.

---

## 5 · THE BARS

    node --test consonance/tools/essay-provenance.test.js     55 pass, 0 fail   (39 before this lap)
    node consonance/tools/js-suite.js    79 green · 3 failed · 0 crashed · 0 silent · 1 canary (of 83)

**js-suite moved from 1 failure to 3, and the two new ones are not this lap's — but I am reporting
the reasoning, not the conclusion, because "it's another seat's fault" is the claim I least deserve
to be trusted on.** `essay-provenance.test.js` is green inside the suite, and so are
`portable-paths.test.js` (the new ledger introduced no path violation) and `commit-gate.test.js`.

    forget-rate.test.js       the KNOWN false red, and it is quoted in this tool's own header:
                              "1 files left the reading path (161,665 bytes)" is a deliberate
                              deletion reported as loss. Red on 2026-09-08 too (L047 §"the one
                              failure is not mine").
    gen-consumer.test.js      NEW tonight. Both key assertions on main.rs LINE NUMBERS
    gen-consumer.fixture-     (gen-consumer.js:863 cites "main.rs:4226" and ":8336"), and
      scope.test.js           main.rs is modified in the working tree RIGHT NOW by a concurrent
                              L049 pane: +64 lines, uncommitted. That is the likely cause and I
                              did not prove it — proving it would mean touching a file another
                              seat is holding, which is the exact thing this lap is about.

**And the caveat that matters more than the number: this suite was run over a shared checkout with
L049 live in it** — three other panes' uncommitted work is in the tree (`main.rs`,
`state-manifest.json`, `live-host.js`). It is not a clean measurement of anything, mine included.
That is the cause in §4 showing up in the measurement of the ledger built to repair its effects.

**Mutants — six, all killed, source byte-identical after the run** (tap reporter; the spec reporter
prints two lines per failure and doubles the count, which is how I mis-reported these figures in
L047):

    M1  silent override — the commit body name is dropped              3 failing   KILLED
    M2  no evidence check — any correction is believed                 3 failing   KILLED
    M3  a correction reaches a commit it does not name                 1 failing   KILLED
    M4  the new label is undocumented in the header                    1 failing   KILLED
    M5  last-writer-wins over the same artifact                        2 failing   KILLED
    M6  evidence read from the working tree, not the frozen blob       1 failing   KILLED

M4 is an existing guard I extended rather than dodged: the suite already asserted that every label
the code emits is documented in the source header, but it collected labels only from uncorrected
runs, so `SEAT-CORRECTED` would have shipped undocumented. One line added to that test's collection.

M6 is the mutation that would undo the entire mechanism — a reader that reads the file as it stands
today makes every correction forgeable — and it was untestable while the reader was an inline
closure in the CLI. Extracted as `gitBlobReader(repoRoot)` and tested against a real repository the
test creates, commits, and then rewrites in the working tree.

---

## 6 · CAUGHT IN MY OWN WORK

1. **I wrote two raw NUL bytes into the source.** Two template literals came out with `\u0000`
   where a space belonged (`essay-provenance.js:384` and `:391`), which `grep` reported by calling
   the file binary. Found by inspecting a line with `od -c` after a search behaved oddly, replaced,
   and verified zero remaining by byte scan. Both were inside backtick strings; the affected key
   builder now uses an explicit `\u0000` escape, matching `dedupeBoard`'s existing house shape.
   **And the first check I reached for was wrong in a way worth recording:** `grep -c $'\x00'` in
   bash passes an EMPTY pattern, which matches every line — it reported "851" and I nearly took that
   as 851 NULs. A shell cannot carry a NUL in an argument. Counted in node instead.
2. **My first corrections key used the sha as the row typed it**, so `babe926` and its 40-character
   form would have keyed as two different corrections of one artifact — defeating the
   first-writer-wins rule that is the whole anti-rewrite property. Changed to key on the commit's
   own `full` before any test was written for it.
3. **The corrections section first read from its own copy of the correction data** rather than from
   the rows, so the CORRECTIONS block and table 1 could have drifted into two accounts of one
   correction. Now derived from `landed`.

---

## 7 · WHAT I DID NOT VERIFY

- **Whether the librarian's milestone run was actually executed**, and if so what it printed. There
  is no artifact of it — no saved output, no log line — so §1 establishes that the rows *existed*,
  not what any particular run *displayed*. An instrument whose runs leave no trace cannot be audited
  after the fact, which is its own small finding.
- **That the two gen-consumer failures are the concurrent main.rs edit.** Stated with its reason in
  §5 and unproven; the isolating run would require reverting a file another seat holds.
- **`js-suite.js` on a quiet tree.** It ran with Consonance live and three panes mid-lap; see §5.
- **The desktop.** All five ledgers are machine-local except the new one; a capture on the desktop
  is invisible from here.
- **Whether any OTHER commit in the history has a wrong seat.** I corrected the four the record
  names. Nothing here scans for further misattributions, and the tool has no way to find one — a
  wrong seat is only visible when a human notices.
- **The two-machine behaviour of the corrections ledger.** It is in the repo so it travels, but it
  has never been read on the second machine.

---

## 8 · WHAT THIS DOES NOT ESTABLISH

The table is now right about who landed those four files **because a frozen header says so**. That
is a claim about the record's internal consistency, not about the world. If the chair's header had
been wrong on 2026-09-08, this mechanism would have propagated it with a checkmark beside it. The
strongest thing it can honestly claim: **after this, a correction is as trustworthy as the artifact
was at the moment it landed — and no more.**

And the corrections ledger does not make the contribution table complete. Blindnesses 1–8 print with
every run. The largest remains unchanged and is not about attribution at all: **61 of 97 rows say no
board row ever named the work** — the essay is still being written in panes with no channel out.

---

## 9 · FILES

    consonance/tools/essay-provenance.js         the ledger read, verified, applied, printed
    consonance/tools/essay-provenance.test.js    +16 tests (39 -> 55)
    exo_memory/provenance_corrections.jsonl      NEW — the ledger, four rows
    exo_memory/handback/p-attribution_2026-09-08.md   this file
    exo_memory/map/B.md                          one line

**Nothing committed. Nothing staged** — on a lap about a commit that captured staged files, an empty
index is the only defensible state to leave behind. `essay/` prose and the drafts were read, never
written; `babe926` was not amended, rebased or reverted.

    OBJECTIVE  the contribution table is right about who did what, and shows where it was corrected.
    FALSIFIER  an attribution the table gets wrong that no correction can reach — or a correction
               that lands with no checkable evidence behind it.

**The falsifier's first half is ALREADY LIVE and I am not going to let it read as clean:** a
captured file with no header and nothing naming it is an attribution no correction can reach. Four
of `38ae5c2`'s seven captured files are `.js` sources with no seat in their headers. **The mechanism
covers the case in front of it and not the class it belongs to** — which is the argument for §4's
ruling, made by the mechanism's own limit rather than by preference.
