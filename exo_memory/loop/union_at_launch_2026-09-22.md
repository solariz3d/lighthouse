# UNION AT LAUNCH — the design, and the registration that says what would make it wrong to ship (pane E, D113, 2026-09-22)

**Design only. No code was written this lap**, and none may be written until ~~**§-ATTACK is filled by A**~~
**§-ATTACK is FILLED (A, 2026-09-22 13:1x–14:0x: 2 FATAL · 4 AMEND · 6 NOTE), every item answered in the new §9, and
every change made in place and dated.** Everything below was read at source on **machine D**, HEAD `0b8e84f` (D112).
**Author: pane E — a non-author of `state-sync.js` (A) and of `ledger-union.js` (C).**

> **AMENDED 2026-09-22 ~13:3x, D113, by E, after A's §-ATTACK. A's FATAL-1 is a save, and the defect is bigger than
> the check it surfaced in: I wrote a SET test over data that is a MULTISET.** A measured it —
> **board.jsonl carries 7,514 duplicate rows on this machine**, and the arriving `sessionstart-state.jsonl` carries 29
> — and the librarian re-derived it. **§10 is new and walks EVERY step of this design against that assumption**, because
> fixing only the step A named would leave the assumption in place everywhere else it landed. **Two more places were
> found that way, and neither is in A's list.**

**The problem, stated as it happens.** A launch pulls the other machine's state set. If any of the **eleven
append-only ledgers** would lose rows, `installTree` refuses the whole install **before the first byte**
(`state-sync.js:1196-1211`, L070 `6b9699b`; the eleventh through L074 `b40c8d8`), the launch reads
*"verified but did not install"* and starts as **LOCAL HOUSE** (`sync_launch.rs:331-339`). Nothing is lost and nothing
arrives. **The rows then come in only because a person runs the union by hand** — C did exactly that on D this morning
(D106 `3a19c6d`) and on L the night before (L071, L076, 6,782 rows). **This design is that hand becoming the launch.**

---

## 1 · WHAT THE LAUNCH WOULD DO — the sequence, and where it joins the existing code

The seam is **inside `installTree`**, between its pre-scan and its write loop, because that is the one place where
**the refusal set is already computed and nothing has been written yet**. Doing it in the launcher would mean
re-deriving the same judgement in a second language — two copies of one rule, which is how they drift.

    PHASE 0  pre-scan (today, unchanged)     every file with an install mode is judged against the arriving bytes
             -> no refusals                  ................ the install proceeds exactly as today
             -> refusals, and union is ON    ................ PHASE 1

    PHASE 1  union, one refused file at a time, in manifest order
               ledger-union.writeUnion({ dataDir, name, time, stateDir })
               - it already reads <state_dir>/data (L072 deff581), which is where the arriving copy lives
               - it already backs up to <file>.pre-union-<stamp> and never touches an attic copy
               - it already returns { added, caughtUp, reconciled, partialCarried, missingLines, missingRows, verified }
             any throw, or verified === false  ........... PHASE 3 (fall back)

    PHASE 2  RE-JUDGE, and this is NOT the pre-scan's test (see §2)
               (a) per canonical key, COUNT: local count >= arriving count   [amended 13:3x, A's FATAL-1]
               (b) the arriving copy's keyless lines: invalidNotInLive == 0  [amended 13:3x, A's FATAL-2, §2b]
               both -> that file is marked INSTALLED-BY-UNION and SKIPPED by the write loop
               else -> PHASE 3, with the offending key's count pair or the keyless line numbers named

    PHASE 3  fall back to today's behaviour exactly: refuse the install, write nothing, name the rows.
             Unions that already completed STAND (§4 says why that is safe), and the report says so.

    PHASE 4  the write loop (today, unchanged) for every other file, with its late re-check per file.

**The switch, and which way it fails.** `CONSONANCE_UNION_AT_LAUNCH` — **`off` is today's behaviour**, and **an
unset, unparseable or unknown value is `off`**. A feature that decides for itself that it is on is the wrong default
for a step that rewrites the room's ledgers.

**WHERE THE SWITCH HAS TO LIVE — ADDED 13:3x (A's NOTE-11, adopted):** `main.rs:11042-11045` spawns the pull with no
`env_clear`, so the child inherits **the app's** environment. The variable therefore has to be set **for the app** — an
HKCU user variable (where the Jev key lives) or by `launch.ps1`. **A seat cannot flip it, and a variable exported in a
terminal does not reach a shortcut launch.** That is a good default-off property, and it is written here so the first
person to try the feature does not set it in the wrong place and conclude it is broken.

## 2 · THE FINDING THAT DECIDES THE DESIGN: after a union, the file is NOT a fast-forward

`appendOnlyCompare` (`state-sync.js:1151-1165`) is a **line-prefix** test: the arriving copy installs only if the
local file's lines are its prefix. **A union does not produce a prefix.** `writeUnion` interleaves the rows only the
other copy holds **into time order inside the live file** (`ledger-union.js:303-315`). So after a perfect union, the
old test still answers **DIVERGED**, and a design that re-ran the pre-scan here would refuse a file it had just
repaired — or, worse, loop.

~~**So PHASE 2 asks a different question: `SUPERSET BY CANONICAL KEY`.** Every row of the arriving copy must be
**present** in the local file, comparing rows by `canon()`.~~ *(was — A's FATAL-1: `union()` keys rows into a `Map`
(`ledger-union.js:143,154`), so **the union writes one row per distinct key** and an arriving copy's duplicate is
written once. A presence test therefore **passes while `count_arriving(k) − count_local(k)` rows are dropped**, and
`writeUnion`'s own step (7) already verifies lines as a **multiset** — so the design contradicted the tool it is built
on. Measured by A on D: **board 7,514 duplicate rows live, `sessionstart-state` 29 arriving**.)*

**PHASE 2 IN FORCE — AMENDED 2026-09-22 ~13:3x, A's fix adopted in A's words, as a COUNT PER KEY:**

> **(a) For every canonical key, the local file holds at least as many rows with that key as the arriving copy does.**
> Computed with a `Map<key, count>` on both sides, exactly as step (7) does for lines. The refusal prints the first
> offending key with its count pair (`local 1 / arriving 2`). *A set test is the special case where every count is 1,
> and these files are not that.*
> **(b) The arriving copy's keyless lines: `invalidNotInLive` for the STATE source must be 0** — see §2b.
>
> Both must hold. Either failing sends that file to PHASE 3, and **the counts, not the verdict, go in the receipt.**

**Why this clause is load-bearing rather than a formality** (and this is mine, found while walking §10):
`writeUnion`'s multiset verify covers **the local file's lines and its gap files** — the copies it renamed — and the
**arriving** side is checked only as distinct union rows (`missingRows`, `ledger-union.js:379-381`). **So PHASE 2's
count test is the ONLY multiset guarantee the arriving copy ever gets.** If it is written as presence, nothing in the
whole path notices an arriving duplicate being dropped.

If both clauses hold, **this machine now holds at least as many of every row as the install would have given it**, and
installing the arriving bytes over it would be the row-loss the refusal exists to prevent. **The file is skipped, and
the report says merged, never "installed".**

**And what this test is NOT, said here rather than only in §6 (A's answer to my own prompt):** it is a **loss** test,
not a **correctness** test. A whole-row key keeps both of two rows that share one lap id, so **a corrected row arriving
from the other machine lands BESIDE the wrong one and PHASE 2 passes.** Merging cannot adjudicate which row is right,
and nothing here should be read as saying it can.

## 2b · THE ROWS WITH NO KEY — ADDED 2026-09-22 ~13:3x (A's FATAL-2, adopted), and what happens to them, named

**A line that does not parse as JSON has no `canon()` key at all**, so it is invisible to any key test, however it is
counted. `parseJsonl` puts such lines in `invalid`, not `rows` (`ledger-union.js:110-125`), and `union()` only
**counts** an arriving copy's invalid lines (`invalidNotInLive`, `:157-159`) — it never carries them. **The live
file's fused lines survive** (they are lines in `out`, and step (7) covers them). **The arriving copy's do not.**

**Measured by A on D today: the arriving `board.jsonl` holds 257 invalid lines and the live one 263, with
`invalidNotInLive` = 0** — every arriving fused line is byte-identical to one already here. **Zero today is not zero
tomorrow**, and a fused line is exactly where two real rows go when two writers collide, which is the very class §3 is
about.

**What happens to them — stated, not silently excluded:**
1. **They are never merged.** No rule here tries to split or repair a fused line. Guessing where one row ends inside
   another is exactly the discretion this design must not take.
2. **If the arriving copy holds a keyless line this machine does not have** (`invalidNotInLive` > 0 for the state
   source), **that file goes to PHASE 3 and is refused**, and the report **names the line numbers** so a person can
   read them. 257 lines is a readable amount; a lost row is not a recoverable one.
3. **Either way both counts go in the receipt** — `invalid_live`, `invalid_arriving`, `invalid_not_in_live` — so a
   later reader can see that keyless lines existed and how many, instead of inferring it from a row count that never
   counted them.
4. **One field is owed from `ledger-union.js`:** `invalidNotInLive` is computed per source but is not in `writeUnion`'s
   return (it is inside `u.perSource`). **One field to add, and it is C's file, not mine.**

## 3 · WHAT HAPPENS WHILE THE APP IS WRITING — the real hazard, named

**These eleven files all have live writers** (`state-manifest.json` names each one: `appendFileSync` in seven hooks
and three tools, `OpenOptions::append` in `main.rs:8376` for `resonance/atoms.jsonl`). A launch does not stop them:
other Claude sessions' hooks, and on a relaunch the previous app, can append **during** the union.

**`writeUnion` was built for exactly this and its protocol is already the answer** (`ledger-union.js:287-385`):

| step | what it does | what a concurrent writer does to it |
|---|---|---|
| (1) read | reads only **complete** lines; a partial last line is left | a half-written row is never consumed |
| (3) catch-up | appends whatever arrived since the read, verbatim, until a pass finds nothing | an append mid-union is carried |
| (4) freeze | `renameSync(live, backup)` — the original becomes the record | **see below** |
| (5) place | `linkSync`, never overwrite; a re-created path becomes a **gap file** and is carried | a writer that re-creates the file loses nothing |
| (6) reconcile | after `settleMs`, drains the frozen original past `consumed` and every gap file, until a pass moves nothing; a partial line is carried as a line | an append that landed in the frozen inode is recovered |
| (7) verify | every line of the original and of every gap, as a **multiset**, plus every union row, must be in the result | the check that makes the rest checkable |

**The one hole, and it is not closable by this design: a writer holding an open append handle across the whole
union.** Step (6) drains the frozen original for up to 20 passes and then stops. A process that appends to that same
inode *after* the last pass writes into `<file>.pre-union-<stamp>` forever, and step (7) will not see it, because it
compares against what the backup held at that moment. **Nothing is destroyed** — the rows are in a file beside the
live one — but they are out of the ledger, and **a later reader cannot tell.**

**Two facts make this acceptable, and one instrument is owed:**
1. ~~**Every writer in the manifest opens, appends and closes per row.**~~ **AMENDED 13:3x (A's NOTE-7, checked file
   by file as I asked): "no writer of the eleven holds a handle beyond one call; `resonance/atoms.jsonl` writes a
   BATCH inside one call** (`main.rs:8376` opens once and `writeln!`s every atom before the handle drops)." The ten JS
   writers are `appendFileSync` per row. **And the one long-lived handle on this machine — the PTY capture,
   `main.rs:1257`, held for the life of a pane — is NOT one of the eleven**, which is exactly what makes this hole
   narrow and exactly what the next writer like it would close. That is a property of the code today, not a guarantee
   about tomorrow, so it is in the registration (§6, degenerating).
2. **Windows is on our side here.** A `rename` over a file another process holds open without `FILE_SHARE_DELETE`
   fails loudly (`EPERM`/`EBUSY`) — step (4) throws, PHASE 3 catches it, and the launch falls back to today's refusal.
   **The failure mode is a refused install, not a silent loss.**
3. **OWED: the receipt (§5) must record the backup's size and line count at the end of the union, so a later check
   can re-read that file and report any line that arrived after the union closed.** Without it, hole (1) is
   undetectable; with it, it is one comparison.

**And one ordering rule that is not negotiable: the union runs before any seat is woken.** The launch's own writers
(the pane tailers, the board) must not be started against a file that is about to be renamed. Today's sequence already
has the install strictly before the seats; the union goes inside the install, so it inherits that.

## 4 · WHY A HALF-DONE UNION PHASE IS STILL SAFE, and why the install still refuses

PHASE 1 is **not atomic across files**. If file 3 of 5 throws, files 1 and 2 have already been unioned and their live
files have changed — so "nothing was written" is **false**, and the design must not claim it.

**What is true, and it is enough:** a union only ever **adds** rows. It removes nothing, renames nothing a reader
looks for, and leaves the original beside the live file. A machine that ends a failed launch with two ledgers unioned
and the install refused holds **strictly more of the record than before, and none of the arriving set**. That is the
same safe state as today, plus rows it was always entitled to.

**So the report must say both things, in this order:** *the install was refused and no file of the state set was
installed*, **and** *N ledger(s) were merged before the refusal; here they are, with their backups.* The second
sentence existing is the whole reason this section is in the design.

> **AMENDED 13:3x — A answered my own §-ATTACK prompt about rolling the completed unions back, and A's reason is
> better than my convenience argument: NO ROLLBACK.** Between a union and a rollback, **live writers have already
> appended into the new file** — that is what step (6)'s reconcile exists for — so restoring the backup would
> **destroy rows that never existed anywhere else.** The mixed state is not a compromise; it is the only state that
> loses nothing. **What it owes is legibility, and that is AMEND-4 below.**
>
> **AMENDED 13:3x (A's AMEND-4, adopted — this is the one silent-loss path left in the design):** step (4) renames
> `live → backup` and step (5) links the union into place, and **between them the ledger does not exist**. A process
> killed there leaves no local file, so the next launch's pre-scan **has nothing to refuse**: the arriving copy
> installs cleanly and every local-only row sits in a `*.pre-union-*` nobody reads again. **Not destroyed, and not
> recoverable by anyone who does not already know to look.** So:
> - **one receipt line with `state: "started"` is written BEFORE the freeze** (file, backup path, stamp), and a
>   `"finished"` line after step (7);
> - **at the START of every launch, any `started` with no `finished` — or any stray `*.pre-union-*` beside a ledger —
>   refuses the whole install** and names the file and the backup.
>
> That turns the one silent path into a loud one, using a file §5 already creates.
>
> **AMENDED 13:3x (A's AMEND-3, adopted): the union phase takes an exclusive lock.** `grep -c lock ledger-union.js`
> → **0**: nothing today stops two unions of one file from interleaving, and §8's fallback prints a command **a person
> can run into a running union** while the app is up. So: `<data>/union.lock` (pid, stamp, file; stale takeover
> logged, the pattern `jev-shadow-runner.js` already uses), **taken by the launch phase AND by `ledger-union.js
> --write`**, which refuses with *"a union is already running (pid N, started …)"*. And §8's fallback text gains
> **"Close Consonance first."** *The lock is in `ledger-union.js`, which is C's file: named with its owner.*

## 5 · THE RECEIPT, AND THE INSTALL HISTORY — C's two D112 findings, folded in

**(a) `ledger-union.js --write` leaves no receipt** (C, `p-d112-tripcheck-C_2026-09-22.md` §2). It prints its JSON to
stdout and nothing survives, so "rows added by the union" is **not recoverable from disk at any later time**. C
measured the gap between the tool's counts and what a later reconstruction derives, on D's own trips: board 17,417
written against 17,757 derived, atoms 18,203 against 18,434, lap 449 against 489 — and the board moved again between
two runs of the checker minutes apart. **The gap is every row a live writer appended afterwards. Neither number is
wrong; one is a receipt and one is a reconstruction.**

**Design: the union at launch writes one JSON line per file, at the moment it finishes**, to
`<data>/union_receipts.jsonl` — the object `writeUnion` already returns, plus `at`, `machine`, `trigger: "launch"`,
`state_head`, and (from §3) `backup_bytes` and `backup_lines`. **AMENDED 13:3x: plus `state: "started"|"finished"`
(§4), the keyless counts `invalid_live` / `invalid_arriving` / `invalid_not_in_live` (§2b), and the PHASE 2 count pair
when a file is refused.** **Every count field carries its UNIT in its name** — `distinct_rows_added` for the union's
`added` (distinct keys, by construction), `lines_caught_up` and `lines_reconciled` for the line counts — because a
receipt whose fields silently mix distinct-row counts with line counts is the same defect A found, one file later.
**It is machine-local (`STAYS`), deliberately:** a
receipt about what this machine did to its own ledgers is not the other machine's business, and making it TRAVELS
would put the receipt ledger into the set of ledgers that can diverge and need unioning — a rule that consumes itself.

**(b) `sync-completion.json` is overwritten every launch** (C, §4 item 2), so **exactly one install trip is
recoverable — the last one.** Every earlier install on this machine is gone as a trip.
**Design: `writeCompletion` also appends the same object, verbatim, as one line to `<data>/install_receipts.jsonl`.**
One append, machine-local, append-only; `sync-completion.json` keeps its shape and every existing reader
(`sync_launch.rs:121-127`, `:2162`) is untouched. **That file is A's, so this is a recommendation with a named owner, not
a change this design may make.**

**Both files are append-only and machine-local, so neither can ever be the thing a future launch has to union.**

## 6 · THE REGISTRATION — what would make this WRONG to ship, written before the code

**THE CLAIM:** *a launch can merge a diverged append-only ledger, in the presence of live writers, without losing a
single row, and can tell a person exactly what it did.*

**THE FALSIFIER — one, and it is zero-tolerance, because this is a data-loss guard and a rate is not a bar:**
> ~~If ONE row that existed before the union … is **absent** from the union of {live file, its backup, its gap
> files}…~~ *(struck 13:3x — the falsifier itself was written in the set language A's FATAL-1 is about: "absent" is a
> presence test, and it would have passed a trial that dropped a duplicate. **The check that was to catch the defect
> carried the defect.**)*
> **IN FORCE:** **on a rig of the eleven ledgers, seeded from real divergent copies (including the duplicate-bearing
> ones: board holds 7,514 duplicate rows and arriving `sessionstart-state` 29), with a writer appending to each live
> file throughout the union, run the launch path 50 times. Counting rows WITH MULTIPLICITY — for every canonical key,
> and for every keyless line, taken as a multiset — if the final live file holds FEWER of any row than
> `max(count_before_live, count_arriving)` plus everything appended during the trial, in ANY trial, union-at-launch is
> WRONG TO SHIP.** Not tuned, not retried: the design is withdrawn and the refusal stays.

**THE SECOND FALSIFIER, because the first is scored by the tool being tested:**
> **`writeUnion` reports `verified: true` while an independent check disagrees.** The independent check is C's trip
> checker (D112, `0b8e84f`), re-deriving from the backup and the live file without the tool's own numbers. One
> disagreement in the 50 trials is a fail. *A self-verifying merge whose only witness is itself is the thing this
> room's whole practice exists to distrust.*
> **AMENDED 13:3x: the independent check must itself count with multiplicity, and that is to be confirmed in C's
> checker before it is used as the witness** — a second witness that shares the first one's assumption is not a second
> witness. **And A's NOTE-8, adopted: the rig must TEST the Windows rename claim** (one trial with a held handle)
> rather than rest on it, and must cover `linkSync`'s own assumption — a hard link fails `EPERM` on exFAT or across
> volumes, which is a stick or a moved data dir. Both land in PHASE 3, so neither is dangerous; asserting them
> untested is.

**THE UNWELCOME OUTCOME, named in advance in the words that would make it true — so it is sayable before anyone knows
which way it goes:**
> *"The union at launch is verified, the receipt says every row is there, and rows are missing from the ledger anyway,
> because a writer we did not know about held an append handle open past the reconcile."* **If that sentence is ever
> true, the correct response is to switch union-at-launch off and go back to refusing, not to add a longer settle.**

**THE SECOND UNWELCOME OUTCOME, measured rather than argued, because it is the likely one:**
> **Launch gets slower by minutes.** `settleMs` is 1,500 and the reconcile loop runs up to 20 passes
> (`ledger-union.js:352-353`), so a single file can take **30 seconds**, and eleven refused files **up to five and a
> half minutes** of a person watching a splash screen. ~~**Registered bar: if the union phase exceeds 90 seconds in
> total on the rig**~~ **AMENDED 13:3x (A's NOTE-9, adopted): the bar is PER FILE as well as per set, because the cost
> is per file and one slow board should not condemn ten fast ledgers. In force: 20 s per file, 90 s per set, measured
> and reported per file.** A also predicts the bar will fire: the reconcile only exits when a pass moves nothing, and
> on a machine whose board is written every turn *"nothing moved"* is exactly what does not happen. **If it does fire,
> the fallback is not a failure of the design — it ships as a step the launch offers and a person starts, which is the
> manual path with one button instead of one command.**

**THE DEGENERATING CLAUSE — any one of these and the design is a patch-keeper, to be withdrawn rather than fixed:**
- the answer to a failing trial is to **widen what the union may do** (a longer settle, more passes, a retry) rather
  than to fall back to the refusal;
- the verify in step (7) is **loosened** — from a multiset of every line to counts, to a sample, or to "the file got
  bigger";
- a **per-file exception** appears ("union everything except X"), which means a file was found that this rule cannot
  hold for and the rule is being kept anyway;
- **PHASE 3 stops being exercised**: if no test drives the fallback for a season, the fallback is decorative and the
  design has quietly become "the union always works";
- **the writers change under it**: a new writer holds an append handle open, or writes a ledger by rewriting it, and
  the `appendFileSync`-per-row property §3 rests on stops being true. *That is a property of the code today and is
  re-checked before the ship, and at every later change to a writer.*

**THE NULL, beside the falsifier:** *the union at launch adds nothing a person running `ledger-union.js --write` by
hand does not* — same rows, same backups, same verification. **It is a true null, and the honest answer to it is that
the value is not in the merging but in the not-forgetting**: the hand union happened because C noticed. **So the
measurement that answers the null is not row counts — it is how many launches arrive at a refused install with nobody
noticing.** That number is recoverable once §5(b) lands, and not before.

**WHAT THIS DESIGN DOES NOT CLAIM:** that a unioned ledger reads correctly to every consumer. A whole-row key keeps
two rows that carry one lap id (`ledger-union.js:22-26`, deliberate), so a reader that assumes one row per id sees
both. L071 and L076 already put such rows on L, so this is lived, not hypothetical — and it is out of scope here.

## 7 · WHAT MUST STAY MANUAL, SAID PLAINLY

1. **`UNKNOWN-MODE` refusals.** If a manifest rule names an install mode the code does not implement, the install
   refuses (`state-sync.js:1291`). **The union must never be reached from there.** An unimplemented mode means the
   room does not know what the file's rows are; merging them by the append-only rule would be a guess with a backup.
2. **Any file that carries BOTH an install mode and an arrival transform.** The pre-scan judges untransformed bytes
   and says so (`state-sync.js:1195-1196`). No rule does this today. If one ever does, **that file is refused, not
   unioned**, until the order is designed.
3. **A file whose rows have no parseable time field.** The interleave orders by `timeOf` and a row without one keeps
   its place; that is fine for a few fused lines and is not a basis for merging a whole file. ~~**If more than 1% of
   either copy's rows fail to parse, refuse that file.**~~ **AMENDED 13:3x (A's AMEND-6, adopted): refuse the file if
   ANY row of either copy has no parseable time, and record the count in the receipt.** A measured the population:
   **0.00% in all eleven files, both copies**, so my 1% permitted up to **617 board rows** of slack that nothing has
   ever needed, in the step that decides whether a file may be merged at all. **A round number chosen against a
   measured zero is not a threshold, it is a guess with a percent sign.** If a real file ever trips the strict rule, a
   person reads the refusal and the bar is raised on purpose, with the case in hand.
4. **Anything outside the eleven.** `ledger-union.js`'s `FILES` and the manifest's `install: "fast-forward"` set are
   the same eleven today. **The union step must read the manifest, not its own list**, and refuse any file it is
   handed that is not marked fast-forward there. Two lists would drift, and the drift would be discovered as a
   corrupted ledger.
5. **The first ship.** The rig in §6 is not the room: **the first three real launches that take PHASE 1 should print
   what they did and be read by a person before the next one runs.** Not a rule the code enforces — a thing to do.

## 8 · WHAT THE LAUNCH REPORTS, AND WHAT A PERSON SEES

**The completion record** (`sync-completion.json`, and the new appended line) gains, per file:
`{ path, action: "INSTALLED-BY-UNION", rows_added, caught_up, reconciled, partial_carried, backup, backup_lines,
verified, ms }`, and the set-level `union: { attempted, succeeded, failed, ms }`. **`installed` stays what it means
today** — the arriving bytes were written — and a file repaired by union is **not** counted in it, because the two are
different events and one number cannot carry both.

**`sync_launch.rs` gains one verdict shape, and it is a `Resume`/`Migrate` as today plus a sentence**, because a
successful union means **the record did arrive**. The existing *"verified but did not install"* → LOCAL HOUSE branch
(`:331-339`) stays exactly as it is for PHASE 3.

**What a person sees, in the launch pane — three lines, no jargon:**

    Three ledgers held rows only this machine had. They were merged, not replaced:
      lap +80 rows · board +1,525 · resonance/atoms +3,377   (merged in 6.2s)
    The originals are kept beside them (lap.jsonl.pre-union-2026-09-22T…), and the merged file
    was checked against the original that is kept beside it.

~~*and every row was checked twice*~~ *(struck 13:3x — A's NOTE-10.1: that is the merger vouching for itself, which
this file's own second falsifier says to distrust. Say what was checked against what.)*

**And on the fallback — AMENDED 13:3x (A's NOTE-10.2): the CHANGE goes first.** My version said *"this machine's
record is exactly as it was, plus 2 ledgers that were merged"*, which contradicts itself inside one sentence, **and at
8am the first half wins.** A's ordering, adopted verbatim:

    Nothing from the other machine was installed.
    2 ledgers here were merged before the stop (lap, resonance/atoms) — they GAINED rows; nothing was replaced.
    Originals are beside them. Everything else is untouched.
    To finish by hand, with Consonance closed:
      node consonance/tools/ledger-union.js --write --file board --data <data dir>

**And the word "installed" is never printed for a merged file** (A's NOTE-10.3): in the record the distinction is
`INSTALLED-BY-UNION` versus `installed`, which is right there and invisible in prose. **In the pane it is "merged".**

**One rule for both:** the report names **files and row counts, never "sync failed"**. Today's launch already learned
that lesson once — *"the data dir was not promoted"* was printed over a data dir that mostly was (the tool's own note, `state-sync.js:826` and `:1192`), and the fix was to say which files and which rows.

## 9 · ANSWERS TO §-ATTACK (A, D113), one line each — E, 2026-09-22 ~13:3x

Every change is made **in place at its site**, dated, with the struck wording kept legible. **No code was written.**

| item | answer | where |
|---|---|---|
| **FATAL-1** superset-by-key is a SET test over MULTISET data | **ADOPTED, in A's words: the per-key COUNT form.** Local count ≥ arriving count for every key, `Map<key,count>` both sides, the first offending pair printed. And **§10 walks every other step for the same assumption** | §2 · §10 |
| **FATAL-2** keyless rows are invisible to PHASE 2 (257 arriving) | **ADOPTED, and what happens to them is named, not silent:** never merged, `invalidNotInLive` > 0 sends the file to PHASE 3 with its line numbers, both counts in the receipt, and one field is owed from `ledger-union.js` | §2b |
| AMEND-3 nothing locks | **ADOPTED**: `<data>/union.lock`, taken by the launch phase AND by `--write`; the fallback text gains "Close Consonance first" | §4 |
| AMEND-4 the rename→link crash window orphans the record | **ADOPTED**: `started`/`finished` receipt lines around the freeze, and a launch-start scan that refuses on a dangling `started` or a stray `*.pre-union-*` | §4 |
| AMEND-5 PHASE 3 would print two FALSE sentences | **ADOPTED as a recommendation to its owner (A, `state-sync.js:1209`, `:830`)**: "no file of the STATE SET was installed", plus the merged ledgers named | §4 · §8 |
| AMEND-6 the 1% time bar permits 617 rows against a measured 0 | **ADOPTED**: refuse if ANY row of either copy has no parseable time; the count goes in the receipt | §7.3 |
| NOTE-7 the writer property, checked file by file | **ADOPTED as a correction to my sentence**: no writer of the eleven holds a handle beyond one call; atoms writes a batch inside one; the PTY capture is the long-lived handle and is not one of the eleven | §3 |
| NOTE-8 the rename claim is untested, and `linkSync` needs hard links | **ADOPTED into the registration**: the rig tests the held-handle rename, and exFAT/cross-volume `EPERM` is named | §6 |
| NOTE-9 the 90 s bar is per set when the cost is per file | **ADOPTED**: 20 s per file and 90 s per set, measured and reported per file | §6 |
| NOTE-10 the two 8am sentences | **BOTH FIXED**: "checked against the original that is kept beside it", and the fallback reordered so the change comes first; "installed" is never printed for a merged file | §8 |
| NOTE-11 where the switch lives | **ADOPTED into §1**: it must be in the APP's environment; a seat cannot flip it and a terminal export does not reach a shortcut launch | §1 |
| NOTE-12 the two-list rule is right and free | **ACKNOWLEDGED**: eleven and eleven, the same eleven today | §7.4 |
| A's answer on **rollback** | **ADOPTED, and A's reason replaces mine**: a rollback would destroy rows live writers appended after the union — the mixed state is the only one that loses nothing | §4 |
| A's answer on **"superset ≠ correct"** | **ADOPTED into §2**, where a reader forms the idea, not only into §6 | §2 |

## 10 · THE ASSUMPTION, NOT THE CHECK — every step walked for set-vs-multiset

**The chair's question, and it is the right one: the failed check was where the defect surfaced, not what it was.**
I wrote *"is every arriving row present"* in a design whose data holds the same row many times. So every step gets the
same question: **does it decide, count or report by SET, and is that safe here?**

| step | unit it uses | safe? | what was done |
|---|---|---|---|
| **PHASE 0** pre-scan decision (`appendOnlyCompare`, line prefix) | **lines, in order** | **SAFE** — a prefix test cannot collapse duplicates | unchanged |
| **PHASE 0** the refusal's *counts* (`incSet`/`curSet`, `state-sync.js:1162-1165`) | **sets** | **NO — and nobody named this** | **§10a below** |
| **PHASE 1** step (1) read, (3) catch-up, (5) gaps, (6) reconcile | **lines** | **SAFE** | unchanged |
| **PHASE 1** step (2) `union()`'s `added` | **distinct keys, by construction** (`Map`, `:143,154`) | **SET, and it cannot be changed from here** | **§10b below** |
| **PHASE 1** step (7) verify: `have`/`need` over backup + gaps | **lines, as a multiset** | **SAFE** — and it is the standard the rest must match | unchanged |
| **PHASE 1** step (7) `missingRows` | **distinct union rows, presence** | **SAFE only for the local side** — the arriving side's multiplicity is never checked here | named in §2; PHASE 2(a) is the only guard |
| **PHASE 2** the post-union check | was a **set** | **NO** | rewritten as counts per key (A's FATAL-1) |
| **PHASE 2** keyless lines | **no key at all** | **NO** | §2b (A's FATAL-2) |
| **PHASE 3** fallback message | inherits PHASE 0's set counts | **NO** | **§10a** |
| **PHASE 4** write loop + late re-check | same `appendOnlyCompare` | **SAFE** (decision); same under-count in its message | **§10a** |
| **§5** the receipt's fields | **mixed**: `added` is distinct rows, `caughtUp`/`reconciled` are lines | **NO, silently** | every field now carries its unit in its name (§5) |
| **§6** the falsifier's own wording | **presence** | **NO — the check meant to catch the defect carried it** | rewritten as multiplicity (§6) |
| **§6** the second witness (C's trip checker) | **unknown to me** | **UNVERIFIED** | must be confirmed to count with multiplicity before it is used as the witness (§6) |
| **§8** the pane's "+80 rows" | distinct rows added | **honest, if labelled** | the record says `distinct_rows_added`; the pane says "rows added", which is what that number is |

**§10a — FOUND IN THE WALK, not in the attack: the refusal's own counts under-report duplicates.**
`appendOnlyCompare`'s DIVERGED branch builds `incSet`/`curSet` and filters with `has()`
(`state-sync.js:1162-1165`), so **a local row the arriving copy holds once and this machine holds twice is reported as
not-local-only at all.** The *decision* is right (the prefix test already failed); the *number a person reads* —
*"N row(s) only this machine holds"* — is a lower bound and does not say so. **It is A's file, so this is a
recommendation with its owner named: count with multiplicity, or print the number as "at least N".** The same figures
flow into the completion record's `local_only` and into PHASE 3's message, so one fix covers three readers.

**§10b — FOUND IN THE WALK: a count deficit cannot be repaired by running the union again, and the design must say
so rather than retry.** Because `union()` adds **one row per distinct key it lacks**, a file where the arriving copy
holds a row **twice** and this machine holds it **once** comes out of a perfect union still one row short. **A second
union changes nothing** — the key is present, so there is nothing to add. **So for that file the union is a no-op and
PHASE 2(a) must send it to PHASE 3, where a person merges by hand.** Retrying, or "unioning harder", is the
degenerating move this registration already forbids in words and now forbids by name. *Fixing it properly means
count-aware merging inside `ledger-union.js` — C's file, a bigger change than this design, and not something to
smuggle in through a launch step.*

**§10c — the honest summary of the walk: three places carried the assumption beyond the one A named** — the refusal's
counts (§10a), the receipt's mixed units (§5), and **my own falsifier's wording (§6)**, which would have passed a
trial that dropped a duplicate. **The check written to catch the defect carried the defect.** That is the whole reason
the chair asked for a walk instead of a patch.

## §-ATTACK · FILLED 2026-09-22 by pane A — answered in §9, walked in §10, with every change made in place

*(Prompts, not limits. A did not write `state-sync.js` or `ledger-union.js` either, and A owns the launch path.)*
- **§2's superset test:** is canonical-key superset the right question after a union, or does it hide a real
  divergence — two rows with one id, where the arriving row is the corrected one?
- **§3's hole:** is the "every writer appends and closes per row" property actually true today, file by file? It is
  the load-bearing claim and I read it from the manifest's own citations rather than from each writer.
- **§3's Windows claim:** does `renameSync` really fail loudly against an open handle here, on this filesystem, or
  does it sometimes succeed and leave the writer appending into a renamed inode?
- **§4:** is "unions stand, install refuses" the right mixed state to leave a machine in, or should a failed PHASE 1
  roll each completed union back from its backup — and what would that cost in rows appended since?
- **§6's 90-second bar and the 50-trial falsifier:** too lax, too strict, or measuring the wrong thing?
- **§7:** is there a twelfth file that should be in the set, or one of the eleven that should not be?
- **The whole premise:** should the launch merge ledgers at all, or is a refused install that a person answers the
  correct behaviour for a record this room cannot reconstruct?

*ATTACK — pane A, machine D, 2026-09-22 13:1x–14:0x, read-only (no code, no union write, no install, no close). Every
number below is from one command against D's real files, named beside it. Two FATAL, five AMEND, five NOTE. The design
survives: the premise is right and the fallback is the right shape. Both FATALs are in PHASE 2, and both are cases where
the check PASSES while rows are gone.*

**THE MEASUREMENT EVERYTHING BELOW RESTS ON.** For each of the eleven, live vs the arriving copy at
`C:\Consonance\state\data`, parsed with `ledger-union.js`'s own `parseJsonl`/`canon`/`timeOf` (so the units are the
tool's, not mine):

| file | live rows | arriving rows | dup rows LIVE | dup rows ARRIVING | invalid lines live/arr | rows with no parseable time |
|---|---|---|---|---|---|---|
| board | 61,709 | 35,427 | **7,514** | 0 | **263 / 257** | 0.00% |
| sessionstart-state | 7,693 | 2,345 | **241** | **29** | 0 / 0 | 0.00% |
| the other nine | — | — | 0 | 0 | 0 / 0 | 0.00% |

### FATAL-1 · `SUPERSET BY CANONICAL KEY` is a SET test over data that is a MULTISET — and the tool says so itself

`union()` keys rows into `const all = new Map()` (`ledger-union.js:143,154`), so **the union writes one row per distinct
key**: an identical row the arriving copy holds twice is written once. Live duplicates survive only because `out` is
built by walking the live **lines** (`:305-313`). So a PHASE 2 written as *"every arriving row is present by key"*
**passes while `count_arriving(k) − count_local(k)` rows are dropped.**

This is not hypothetical: **board.jsonl carries 7,514 duplicate rows on this machine right now**, and the arriving
`sessionstart-state.jsonl` carries 29. Today's deficit is 0 only because D was unioned by hand this morning (D106) and
its live file already holds every arriving key. The mirror case — the other machine holding a row twice where this one
holds it once — is a matter of time.

**And the design contradicts the tool it is built on.** `writeUnion` step (7) verifies the original's lines **as a
multiset** (`:369-378`, `have`/`need` counts). Its author already ruled that two identical lines are two pieces of
record. PHASE 2 must use the same unit or the two disagree by construction — the exact failure §2 was written to avoid.

**FIX, in words E can adopt:** state PHASE 2 as *"for every canonical key, the local file holds at least as many rows
with that key as the arriving copy does"*, and compute it with a `Map<key, count>` on both sides, exactly as step (7)
does for lines. Print the first offending key's count pair in the refusal. A set test is the special case where every
count is 1, and these files are not that.

### FATAL-2 · A row with no key is invisible to PHASE 2 — and 257 of them are arriving today

`parseJsonl` puts every unparseable line in `invalid`, not `rows` (`:110-125`). `union()` never carries an arriving
copy's invalid lines: it only counts them (`invalidNotInLive`, `:157-159`). The live file's fused lines survive (they
are lines in `out`, and step (7) covers them); **the arriving copy's do not, and PHASE 2 cannot see them, because they
have no `canon()` key at all.** A fused line is exactly where two real rows go when a writer collides — the class E's
own §3 is about.

**Measured: the arriving `board.jsonl` holds 257 invalid lines and the live one 263.** `invalidNotInLive` is 0 today
(every arriving fused line is byte-identical to one already here, the same 257 C found on L). **Zero today is not zero
tomorrow**, and the failure is silent: the union reports `verified: true`, PHASE 2 passes, the file is marked
INSTALLED-BY-UNION, and a fused line only the other machine had is gone with nothing naming it.

**FIX:** PHASE 2 has a second clause: **the STATE source's `invalidNotInLive` must be 0.** `writeUnion` already computes
it per source; return it (it is in `u.perSource`, not in the returned object — one field to add). If it is not 0, that
file goes to PHASE 3 and the report names the line numbers. Do not try to merge fused lines: refusing is the correct
answer, and a person can read 257 lines.

### AMEND-3 · Nothing locks. The fallback prints a command a person can run INTO a running union

`grep -c lock consonance/tools/ledger-union.js` → **0**. Two `writeUnion` calls on one file interleave at the rename:
whoever renames second gets `ENOENT` and throws (PHASE 3, acceptable), but the loser can also be mid-`reconcile`,
appending drained lines into a file the winner has replaced. Nothing is destroyed — every byte is in a backup or a gap
file — but the live ledger is then a partial interleave of two unions and **only the backups say so.** The launch is not
the only caller: §8's fallback prints `node consonance/tools/ledger-union.js --write --file board …` for the person to
run, and the app is usually still running; a second launch is one double-click away.

**FIX:** the union phase takes an exclusive lock (`<data>/union.lock`, pid + stamp + file name, stale takeover logged —
the pattern `jev-shadow-runner.js` already uses), and `ledger-union.js --write` takes the same lock and refuses with
"a union is already running (pid N, started …)". Then add to §8's fallback text: **"Close Consonance first"**.

### AMEND-4 · The crash window between `rename` and `link` ORPHANS the local record, invisibly

Step (4) renames `live → backup`; step (5) links the tmp into place. **Between them the ledger does not exist.** If the
process dies there (a kill, a reboot, the app's own exit path), the next launch's pre-scan finds **no local file**, so
there is nothing to refuse: the arriving copy installs cleanly, and every local-only row sits in `<file>.pre-union-<stamp>`
that nothing ever reads again. **Data is not destroyed and is not recoverable by anyone who does not already know to
look.** This is the one path where the design can lose the record while every check says green.

**FIX:** write the intent BEFORE the freeze — one line to `<data>/union_receipts.jsonl` (§5) with `state: "started"`,
the file, the backup path and the stamp, and a `"finished"` line after step (7). Then, at the START of every launch,
**any `started` with no `finished`, or any stray `*.pre-union-*` beside a ledger, refuses the whole install and says
which file and which backup.** That turns the one silent path into a loud one, using a file §5 already creates.

### AMEND-5 · PHASE 3 would print two sentences that are now FALSE — and they are in my file

`state-sync.js:1209` says **"NOTHING WAS WRITTEN — no file of the set was installed and this machine's data dir is
exactly as it was"**, and `:830` prints **"No file of the set was written; this machine's data dir is exactly as it
was."** After a PHASE 1 that unioned two files and then fell back, **the second half of both sentences is a lie** — the
data dir is not as it was, it has two merged ledgers and two backups in it. §4 says the report must say both things;
the *existing strings* must change, or the design ships a true design and a false message.

**FIX:** `installTree` takes the union result and the two strings become: *"No file of the STATE SET was installed"* plus,
when `union.succeeded > 0`, *"N ledger(s) here were merged before the refusal (…names…). Their originals are beside
them."* Owner: A (`state-sync.js`). I did not change it this lap — this is read-only.

### AMEND-6 · The 1% time-parse threshold has no derivation, and it silently permits 617 board rows

§7.3's 1% is unargued in the design. **Measured now: 0.00% of rows fail `timeOf` in all eleven files, both copies.** So
the bar permits, in board, up to **617 rows** (1% of 61,709) with no time, against a measured population of **zero** —
slack nobody has ever needed, in the step that decides whether a file may be merged at all.

**FIX:** make it the measurement, not a round number: **refuse the file if ANY row of either copy has no parseable
time**, and record the count in the receipt. If a real file ever trips it, the refusal is read by a person and the bar
is raised on purpose, with the case in hand. Keep 1% only if the design can name the file it was chosen for — and it
cannot, because today that number is 0.

### NOTE-7 · §3's load-bearing writer property, checked file by file as E asked — nearly true, with one correction

- **The ten JS writers** use `appendFileSync` per row: open, append, close inside one call. True.
- **`resonance/atoms.jsonl` is NOT per row.** `main.rs:8376` opens once and `writeln!`s **every atom of the batch**
  before the handle drops at the end of the call. It is a short batch, not a held handle, but §3's sentence as written
  ("every writer opens, appends and closes per row") is not what the code does. Say *"no writer of the eleven holds a
  handle beyond one call; atoms writes a batch inside one"*.
- **The one long-lived handle on this machine writes the PTY capture** (`main.rs:1257`, `capture_path(pane_id)`, held
  for the life of the pane). **It is not one of the eleven** — which is the fact that makes §3's hole narrow, and it is
  worth naming in the design, because the next writer like it might be.

### NOTE-8 · The Windows `rename` claim is unverified, and step (5) has its own filesystem assumption

§3 asserts `rename` over an open handle fails loudly here. **I did not test it and neither did the design** — it is the
kind of claim that is true on NTFS with the usual share flags and false the day something opens with `FILE_SHARE_DELETE`.
Also `linkSync` (step 5) needs a **hard link**, so a data dir on exFAT (a stick) or across volumes fails `EPERM`. Both
land in PHASE 3, so neither is dangerous — but the registration should *test* the rename claim rather than rest on it:
one trial with a held handle, in the rig, is five lines.

### NOTE-9 · The 90-second bar will probably fire, and it is measured per set when the cost is per file

`settleMs` 1,500 × up to 20 passes = **30 s per file worst case**, and the loop only exits when a pass moves nothing —
on a machine whose board is being written every turn, "nothing moved" is exactly what does not happen. Eleven files cost
**≥16.5 s even when perfectly idle**. So the bar is likely to fire on the first busy rig, and E's answer (ship it as a
step a person starts) becomes the real design. **FIX:** measure and report per file, and put the bar per file (say 20 s)
plus a set bar; a single slow board should not condemn ten fast ledgers.

### NOTE-10 · The 8AM READING — two sentences a tired person will get wrong

1. *"every row was checked twice"* (§8) is **the merger vouching for itself**, which E's own second falsifier says to
   distrust. Say who checked: *"checked against the original file, which is kept beside it"*.
2. The fallback's *"this machine's record is exactly as it was, plus 2 ledgers that were merged"* **contradicts itself**
   in one sentence, and at 8am the first half wins. Order it so the change comes first:

       Nothing from the other machine was installed.
       2 ledgers here were merged before the stop (lap, resonance/atoms) — they GAINED rows; nothing was replaced.
       Originals are beside them. Everything else is untouched.

3. `INSTALLED-BY-UNION` vs `installed` is right in the record and invisible in prose. In the pane, never print the word
   "installed" for a unioned file at all — print **"merged"**, as §8's good three-line version already does.

### NOTE-11 · Where the switch actually lives, since it decides whether any of this can be turned on

`main.rs:11042-11045` spawns `Command::new("node") … --install` **with no `env_clear`**, so the child inherits the app's
environment. `CONSONANCE_UNION_AT_LAUNCH` therefore has to be in the APP's environment — an HKCU user variable (the Jev
key's place) or set by `launch.ps1`. **A seat cannot flip it for the app**, and a variable set in a terminal does not
reach a shortcut launch. That is a good default-off property; write it in §1 so the first person to try it does not set
it in the wrong place and conclude the feature is broken.

### NOTE-12 · §7.4's two-list rule is right and currently free

Measured: `ledger-union.js`'s `FILES` holds 11 keys; the manifest's `install: "fast-forward"` set holds 11 paths; **they
are the same eleven today.** So reading the manifest costs nothing now and is the correct rule — the drift it prevents
is the one that would be found as a corrupted ledger.

### ANSWERS TO §-ATTACK'S OWN PROMPTS

- **Is canonical-key superset the right question?** Yes as a *loss* test, once it is a multiset (FATAL-1) and once
  keyless lines are handled (FATAL-2). It is **not** a *correctness* test: whole-row keys keep both of two rows that
  share one lap id, so a corrected row arriving from the other machine lands BESIDE the wrong one, and PHASE 2 passes.
  §6's WHAT THIS DESIGN DOES NOT CLAIM already says this; it should also say it in §2, where a reader forms the idea
  that "superset" means "right".
- **Should a failed PHASE 1 roll completed unions back?** No, and not for the reason of convenience: between the union
  and the rollback, **live writers have already appended into the new file** (that is what §3's reconcile exists for),
  so restoring the backup would destroy rows that never existed anywhere else. E's mixed state is correct. What it owes
  is the receipt (AMEND-4) so the state is legible afterwards.
- **A twelfth file, or one of the eleven that should not be?** None found: the eleven are exactly the append-only
  ledgers the manifest marks, and the two files §5 adds are machine-local and append-only by construction.
- **Should the launch merge at all?** Yes — for a step that only ever ADDS rows and can prove it. The whole weight of
  this attack is on the word *prove*: with FATAL-1 and FATAL-2 unfixed, the proof is weaker than the tool's own verify,
  and a refusal a person answers is better than a merge that says it lost nothing and did.

NEXT: librarian collate the design when p-d113-unionlaunch-E_2026-09-22.md is written and the map line is appended
