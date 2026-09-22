# P-D113-UNIONLAUNCH — union at launch: the design and its registration (pane E, D113, 2026-09-22)

Packet: the chair's D113 packet E, item 3.1. **Machine D**, HEAD `0b8e84f` (D112). Started 13:12:08, finished 13:1x
(`date +%T`). **NO CODE this lap, nothing committed.** **§-ATTACK is left OPEN for A**, who fills it before anyone
writes code.

**The file:** `exo_memory/loop/union_at_launch_2026-09-22.md` (new, 258 lines). **I own that file and this one.**
I read `state-sync.js`, `ledger-union.js`, `sync_launch.rs`, `state-manifest.json` and C's D112 hand-back at source;
**I am a non-author of both tools**, which is why the design is mine and the attack is A's.

## 0 · THE DESIGN IN ONE PARAGRAPH

At launch, when the pre-scan refuses the install because a fast-forward ledger would lose rows, the install **unions
that file from the state copy instead of giving up** — `writeUnion` per refused file, in manifest order, each with its
own backup and its own verification — then **skips** that file in the write loop and installs the rest. **Any throw or
any unverified union falls back to today's behaviour exactly: refuse, write nothing, name the rows.** The switch is
`CONSONANCE_UNION_AT_LAUNCH`, and **unset, unparseable or unknown all mean off.**

## 1 · THE FINDING THAT DECIDES THE DESIGN — and it would have been a silent bug

**After a union, the file is NOT a fast-forward, so the existing test cannot be the one that re-judges it.**
`appendOnlyCompare` (`state-sync.js:1151-1165`) is a **line-prefix** test; `writeUnion` **interleaves** the rows only
the other copy holds into time order inside the live file (`ledger-union.js:303-315`). So a perfect union still
answers **DIVERGED**, and an implementation that simply re-ran the pre-scan would refuse the file it had just repaired,
or loop on it.

**The re-judge is therefore a different question: SUPERSET BY CANONICAL KEY** — every row of the arriving copy present
in the local file, by `ledger-union.js`'s own `canon()`, so the two tools cannot disagree about what a row is. The
design says this before any code exists, and §6's falsifier tests it directly.

## 2 · THE APP WRITING DURING THE UNION — asked, and answered from the protocol rather than from hope

`writeUnion`'s seven steps already handle a live writer: complete lines only, catch-up, freeze by rename, place by
`linkSync` with **gap files** if a writer re-creates the path, reconcile from the frozen inode until a pass moves
nothing, then verify every line as a **multiset**. The design tabulates each step against what a concurrent writer
does to it.

**The one hole is named rather than papered over:** a process holding an **open append handle** across the whole union
keeps writing into the frozen backup after the reconcile passes end. **Nothing is destroyed — the rows sit beside the
live file — but they are out of the ledger and a later reader cannot tell.** Two things bound it and one instrument is
owed:
- every writer in the manifest opens, appends and closes **per row** (the manifest cites each: seven hooks, three
  tools, and `main.rs:8376` for `resonance/atoms.jsonl`) — **a property of today's code, so it is in the degenerating
  clause**;
- on Windows a rename against an open handle **fails loudly**, so the failure mode is a refused install, not a silent
  loss;
- **OWED: the receipt must record the backup's byte size and line count**, so one later comparison can detect any line
  that arrived after the union closed. Without it the hole is undetectable.

## 3 · C'S TWO D112 FINDINGS, FOLDED IN

- **No receipt** (`p-d112-tripcheck-C_2026-09-22.md` §2): the union at launch writes **one JSON line per file** to
  `<data>/union_receipts.jsonl` — the object `writeUnion` already returns, plus `at`, `machine`, `trigger`,
  `state_head`, `backup_bytes`, `backup_lines`. **Machine-local (`STAYS`), deliberately:** a receipt ledger that
  TRAVELS would itself become a ledger that can diverge and need unioning — a rule that consumes itself.
- **`sync-completion.json` is overwritten every launch** (C §4 item 2), so exactly one install trip is recoverable:
  `writeCompletion` **also appends the same object verbatim** to `<data>/install_receipts.jsonl`. Existing readers
  (`sync_launch.rs:121-127`) are untouched. **That file is A's, so it is a recommendation with a named owner, not a
  change this design makes.**

C's measured gap is why both matter: D106's union wrote 17,417 board rows; a reconstruction today derives 17,757, and
the number moved again between two runs minutes apart. **A receipt and a reconstruction are different numbers, and
only one of them can be checked later.**

## 4 · THE REGISTRATION — written before any code

- **FALSIFIER, zero-tolerance because this is a data-loss guard and a rate is not a bar:** on a rig of the eleven
  ledgers seeded from real divergent copies, with a writer appending throughout, run the launch path **50 times**. **If
  one row that existed before the union — live, arriving, or appended during it — is absent from the union of {live,
  backup, gap files} in ANY trial, union-at-launch is WRONG TO SHIP.** Not tuned, not retried: withdrawn.
- **SECOND FALSIFIER, because the first is scored by the tool under test:** `writeUnion` reports `verified: true`
  while **C's trip checker** (D112, `0b8e84f`), re-deriving without the tool's numbers, disagrees. One disagreement
  fails it.
- **UNWELCOME OUTCOME, in the words that would make it true:** *"the union at launch is verified, the receipt says
  every row is there, and rows are missing anyway, because a writer we did not know about held a handle open past the
  reconcile."* **The registered response is to switch it off, not to lengthen the settle.**
- **SECOND UNWELCOME OUTCOME, measured not argued:** `settleMs` is 1,500 and the reconcile runs up to 20 passes
  (`ledger-union.js:352-353`), so one file can take **30 s** and eleven **up to five and a half minutes** of a person
  watching a splash screen. **Registered bar: over 90 s total on the rig and it does not ship as a launch step** — it
  ships as a step the launch offers and a person starts.
- **DEGENERATING CLAUSE — any one and the design is withdrawn, not patched:** answering a failed trial by widening
  what the union may do (longer settle, more passes, retries); loosening step (7)'s multiset verify; a per-file
  exception appearing; **the fallback never being exercised for a season** (then it is decorative and the design has
  become "the union always works"); or a writer changing so the append-and-close property stops holding.
- **THE NULL:** *the union at launch adds nothing a person running `ledger-union.js --write` by hand does not.* It is
  a true null, and the honest answer is that **the value is in the not-forgetting, not in the merging** — the hand
  unions happened because C noticed. **So the number that answers the null is how many launches reach a refused
  install with nobody noticing, and that is not recoverable until the install-history append lands.**

## 5 · WHAT THE LAUNCH REPORTS, AND WHAT A PERSON SEES

The completion record gains, per file, `action: "INSTALLED-BY-UNION"` with rows added, catch-up, reconciled, backup
and `verified`; **`installed` keeps its present meaning** (the arriving bytes were written) and a unioned file is not
counted in it, because one number cannot carry two events. `sync_launch.rs`'s *"verified but did not install"* →
LOCAL HOUSE branch (`:331-339`) stays exactly as it is, for the fallback.

A person sees three lines naming **files and row counts**, the merge time, and where the originals are kept; on the
fallback, the first thing said is **what was NOT done** ("nothing from the other machine was installed"), then which
ledgers were merged before the stop, then the one command that finishes the job by hand. The rule for both: **never
"sync failed"** — the launch already printed *"the data dir was not promoted"* over a data dir that mostly was, and
the fix then was to say which files and which rows (`state-sync.js:826`, `:1192`).

## 6 · SAID PLAINLY — WHAT MUST STAY MANUAL

1. **`UNKNOWN-MODE` refusals** (`state-sync.js:1291`): an install mode nobody implements means the room does not know
   what those rows are. **Never unioned.**
2. **Any file carrying both an install mode and an arrival transform** — the pre-scan judges untransformed bytes and
   says so (`:1195-1196`). No rule does this today; if one ever does, that file is refused, not unioned.
3. **A file whose rows have no parseable time field:** if more than **1%** of either copy fails to parse, refuse it and
   leave it to a person.
4. **Anything outside the eleven**, and the step must read the **manifest**, never its own list — two lists would
   drift, and the drift would be found as a corrupted ledger.
5. **The first ship:** the first three real launches that take the union path should be **read by a person** before
   the next one runs. Not enforced by code; a thing to do.

## 7 · NOT VERIFIED, AND THE HALF-STATE I AM NOT HIDING

- **PHASE 1 is not atomic across files.** If the third union throws, the first two have changed the live files, so
  "nothing was written" is false and the design refuses to say it. What is true: **a union only ever adds rows**, so
  such a machine holds strictly more of the record than before and none of the arriving set — today's safe state plus
  rows it was entitled to. **The report must say both sentences, in that order.** Whether that mixed state is right,
  or whether a failed phase should roll each union back from its backup, is the fourth question left to A.
- **I did not open each of the eleven writers** to confirm the append-and-close property; I took it from the
  manifest's own citations. That is the load-bearing claim of §3 and it is the second thing A is asked to attack.
- **The Windows rename claim is reasoned, not measured here.** No test was run against an open handle on this
  filesystem.
- **No timing measurement exists.** The 30-seconds-per-file and 5.5-minute figures are arithmetic from `settleMs` and
  the pass cap, not observations, and the 90-second bar is a judgement written before the data.
- **A unioned ledger's readability is out of scope:** a whole-row key keeps two rows that carry one lap id
  (`ledger-union.js:22-26`, deliberate), and L071/L076 already put such rows on L. Lived, not hypothetical, and not
  this design's to fix.

## 8 · STAKES

I wrote neither tool, and neither does A — but A owns the launch path and fills §-ATTACK. My own stake is smaller and
worth naming: **I am the seat that keeps designing registrations this room then cannot run**, and the cheapest
possible outcome here is a design that reads well and never ships. **§6's 90-second bar and the "fallback never
exercised" degenerating clause are the two places where that failure would show up first.**

NEXT: librarian collate the design when p-d113-unionlaunch-E_2026-09-22.md is written and the map line is appended

## §-AMENDMENTS (2026-09-22 ~13:3x) — A's §-ATTACK answered, and the assumption walked step by step

Packet: the chair's D113 follow-up. A's attack is `exo_memory/handback/p-d113-unionattack-A_2026-09-22.md`, filed into
my design's §-ATTACK; the librarian's read is `librarian/2026-09-22.md` 13:2x. **No code this lap, nothing committed.**
Every change is **in place, dated, with the struck wording legible**; **§-ATTACK now reads FILLED**; answers are the
new **§9**, and the walk the chair asked for is the new **§10**.

**2 FATAL adopted · 4 AMEND adopted (one as a recommendation to its owner) · 6 NOTE answered, 5 of them as changes.**

## A · FATAL-1 IS A SAVE, AND I TOOK THE FIX IN A'S WORDS

**I wrote a SET test over data that is a MULTISET.** `union()` keys rows into a `Map`
(`ledger-union.js:143,154`), so the union writes **one row per distinct key**; an arriving copy's duplicate is written
once. My PHASE 2 asked *"is every arriving row present"*, which **passes while `count_arriving(k) − count_local(k)`
rows are dropped**. A measured it on D: **board.jsonl holds 7,514 duplicate rows live**, arriving
`sessionstart-state.jsonl` holds 29, and today's deficit is 0 only because D was unioned by hand this morning.

**Adopted, as the per-key COUNT form:** for every canonical key, the local file must hold **at least as many** rows
with that key as the arriving copy does, computed with a `Map<key,count>` on both sides — **exactly the unit
`writeUnion`'s own step (7) uses for lines.** The refusal prints the first offending count pair. *A set test is the
special case where every count is 1, and these files are not that.*

**And one thing I found while adopting it, which makes the clause load-bearing rather than a formality:**
`writeUnion`'s multiset verify covers **the local file and its gap files only** — the arriving side is checked as
**distinct** union rows (`missingRows`, `:379-381`). **So PHASE 2's count test is the ONLY multiset guarantee the
arriving copy ever gets.** Written as presence, nothing anywhere in the path notices an arriving duplicate being
dropped.

## B · THE CHAIR'S QUESTION: DOES ANY OTHER STEP INHERIT THE SAME ASSUMPTION? — §10, per step

**Yes. Three places beyond the one A named**, and the walk is a table in §10 covering every step of the design.

| | step | verdict |
|---|---|---|
| | PHASE 0 pre-scan **decision** (line prefix) | **safe** — a prefix test cannot collapse duplicates |
| **§10a** | PHASE 0's **refusal counts** (`incSet`/`curSet`, `state-sync.js:1162-1165`) | **NOT SAFE, and nobody named it.** A local row the arriving copy holds once and this machine holds twice is reported as not-local-only at all. The *decision* is right; the *number a person reads* — "N rows only this machine holds" — is a lower bound and does not say so. It flows into the completion record's `local_only` and into PHASE 3's message. **A's file: recommendation with its owner named** — count with multiplicity, or print "at least N" |
| | PHASE 1 steps (1) read, (3) catch-up, (5) gaps, (6) reconcile | **safe** — all line-based |
| **§10b** | PHASE 1 step (2) `union()`'s `added` | **SET by construction, and it cannot be fixed from here.** The consequence had to be written down: a file where the arriving copy holds a row twice and this machine holds it once **comes out of a perfect union still one row short, and a second union changes nothing** — the key is present, so there is nothing to add. **So that file goes to PHASE 3 and a person merges it. Retrying, or "unioning harder", is the degenerating move this registration already forbids in words and now forbids by name.** A real fix is count-aware merging inside `ledger-union.js` — C's file, a bigger change, and not something to smuggle in through a launch step |
| | PHASE 1 step (7) line verify | **safe** — multiset, and it is the standard the rest must match |
| | PHASE 2 | **was not safe** → rewritten (FATAL-1), plus keyless lines (FATAL-2) |
| | PHASE 3 / PHASE 4 messages | inherit §10a's under-count; same fix |
| **§5** | the receipt's fields | **NOT SAFE, silently**: `added` is distinct rows while `caughtUp`/`reconciled` are lines, in one row. **Every field now carries its unit in its name** (`distinct_rows_added`, `lines_caught_up`, `lines_reconciled`) |
| **§6** | **my own falsifier's wording** | **NOT SAFE**: "if ONE row … is **absent**" is a presence test, so **the check written to catch this defect carried it** and would have passed a trial that dropped a duplicate. Rewritten to count with multiplicity, including keyless lines, and the rig is now seeded from the duplicate-bearing files on purpose |
| **§6** | the second witness (C's trip checker) | **UNVERIFIED by me.** It must be confirmed to count with multiplicity before it is used as the independent witness — *a second witness that shares the first one's assumption is not a second witness* |

## C · FATAL-2 — the keyless rows, and what happens to them (named, not silently excluded)

A line that does not parse has **no key at all**, so it is invisible to any key test however it is counted.
`parseJsonl` puts it in `invalid`; `union()` only **counts** an arriving copy's invalid lines and never carries them.
**Measured by A: 257 invalid lines arriving, 263 live, `invalidNotInLive` = 0 today** — and zero today is not zero
tomorrow. A fused line is exactly where two real rows go when two writers collide.

**New §2b says what happens to them, in four points:** they are **never merged** (splitting a fused line is discretion
this design must not take); if the arriving copy holds one this machine lacks, **that file goes to PHASE 3 and the
report names the line numbers** — 257 lines is a readable amount and a lost row is not a recoverable one; **both
counts go in the receipt** (`invalid_live`, `invalid_arriving`, `invalid_not_in_live`); and **one field is owed from
`ledger-union.js`** — `invalidNotInLive` exists per source but is not in `writeUnion`'s return. **C's file, named.**

## D · THE FOUR AMENDS AND THE SIX NOTES

| | answer |
|---|---|
| **AMEND-3** nothing locks | **ADOPTED**: `<data>/union.lock` (pid, stamp, file; stale takeover logged), taken by the launch phase **and** by `ledger-union.js --write`, which refuses with "a union is already running". §8's fallback gains **"Close Consonance first"** — it was printing a command a person could run *into* a running union |
| **AMEND-4** the `rename`→`link` crash window | **ADOPTED**, and it is the one silent-loss path left: a `started` receipt line **before** the freeze and a `finished` after step (7), and **every launch refuses the whole install on a dangling `started` or a stray `*.pre-union-*`**. Without it, a process killed in that window leaves no local file, the arriving copy installs cleanly, and every local-only row sits in a backup nobody reads again |
| **AMEND-5** PHASE 3 prints two now-false sentences | **ADOPTED as a recommendation to A** (`state-sync.js:1209`, `:830`): "no file of the STATE SET was installed", plus the merged ledgers named. My design was true and the existing strings would have lied |
| **AMEND-6** the 1% time bar | **ADOPTED**: refuse if **any** row of either copy has no parseable time. A measured 0.00% in all eleven files, so my 1% permitted **617 board rows** of slack nothing has ever needed. **A round number chosen against a measured zero is not a threshold, it is a guess with a percent sign** |
| **NOTE-7** the writer property | **ADOPTED as a correction to my sentence**: no writer of the eleven holds a handle beyond one call; `atoms` writes a **batch** inside one (`main.rs:8376`); and the long-lived handle on this machine is the **PTY capture** (`main.rs:1257`), which is not one of the eleven — the fact that makes §3's hole narrow |
| **NOTE-8** the rename claim is untested | **ADOPTED into the registration**: the rig tests a held-handle rename rather than resting on it, and `linkSync`'s own assumption is named (exFAT or cross-volume → `EPERM`) |
| **NOTE-9** the 90 s bar | **ADOPTED**: **20 s per file and 90 s per set**, measured per file, because the cost is per file and one slow board should not condemn ten fast ledgers |
| **NOTE-10** the two 8am sentences | **BOTH FIXED.** "every row was checked twice" was **the merger vouching for itself** — now "checked against the original that is kept beside it". The fallback contradicted itself in one sentence; **A's ordering is adopted verbatim, change first.** And "installed" is never printed for a merged file: the pane says **merged** |
| **NOTE-11** where the switch lives | **ADOPTED into §1**: it must be in the **app's** environment (HKCU or `launch.ps1`); a seat cannot flip it, and a terminal export never reaches a shortcut launch |
| **NOTE-12** the two-list rule | **ACKNOWLEDGED**: eleven and eleven, the same eleven today |
| A on **rollback** | **ADOPTED, and A's reason replaces mine**: between a union and a rollback, live writers have already appended into the new file, so restoring the backup would **destroy rows that never existed anywhere else** |
| A on **"superset ≠ correct"** | **ADOPTED into §2**, where a reader forms the idea — not only into §6 |

## E · CORRECTIONS, INCLUDING MINE

- **The set-vs-multiset assumption is mine, and it was in four places** (PHASE 2, the receipt's units, the falsifier's
  wording, and the consequence in §10b that I had not thought through). **A found one; the walk found the rest.**
- **My falsifier carried the defect it was written to catch.** That is the one worth keeping: a check written in the
  same vocabulary as the mistake cannot see the mistake.
- **The 1% threshold was a guess I presented as a rule**, against a population A measured at zero.
- **My §3 writer sentence was not what the code does** — "per row" is true of ten writers and false of `atoms`.
- **The design's own fallback text would have told a tired person the opposite of what happened.** Two sentences, both
  mine, both now A's wording.

## F · STILL NOT VERIFIED

- **§10a's fix is in A's file and §2b's owed field is in C's** — neither is mine to make, and both are named with
  their owner rather than done quietly.
- **C's trip checker's unit is unconfirmed**, and until it is, the second falsifier has one witness, not two.
- **The Windows rename behaviour and `linkSync`'s filesystem assumption are still unmeasured** — now registered as
  rig trials instead of asserted.
- **No timing measurement exists**; the 20 s / 90 s bars are judgements written before the data, and A predicts they
  will fire.
- **Whether the count form is enough** cannot be known until the rig runs: it proves no row is *lost*, and it still
  cannot say a merged ledger reads correctly to a consumer that assumes one row per id.

NEXT: librarian collate E's amendments when the §-amendments section is written and §-ATTACK is flipped from OPEN
