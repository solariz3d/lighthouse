# P-L070-FASTFORWARD · ALPHA — lap.jsonl and board.jsonl now install only as a row-for-row fast-forward, or are refused with their rows named; tonight on L both would be REFUSED and kept (plus the L070 addendum: E's two comment edits)

**Pane A, machine L, 2026-09-21 06:3x–07:2x.** Lap L070 packet 1 + addendum. Sources read at source: C's
`handback/p-l069-ledger-C_2026-09-21.md` (5b6cffc) §1-§3, §6; E's `handback/p-l069-envname-E_2026-09-21.md` (0d3378a) §3.
**Five files, uncommitted:** `consonance/tools/state-sync.js` (+96 −4, comments included), `consonance/tools/state-sync.test.js`
(+111 −0), `consonance/state-manifest.json` (+2 −2, two rules), `consonance/tools/close.js` and `close.test.js` (comments only,
4 lines each way). **No existing test was weakened, removed or modified**; the eleven L070 tests are new. **No real close,
no pull, no install was run** — the dry run in §4 is read-only. C's `lap-row.js`/`ledger-union.js` are dirty in the tree:
C's, untouched.

## 0 · ONE PREMISE OF THE PACKET CORRECTED BEFORE BUILDING

**`state-sync.js:975` "REPLACEMENT, NOT UNION" is not a ruling about append-only files, so it was not superseded.** Read at
source it is the header of `rosterApply`, the **roster** (`panes.json`) transform, grounded in `one_house_two_machines:48`
— C §3 says the same. It never governed `lap.jsonl` or `board.jsonl`; those were replaced by `installTree`'s generic
byte-compare-and-overwrite, which had no ruling at all. So I **kept it whole** and appended a dated note marking its edge:
*AMENDED 2026-09-21 (L070): this ruling is the ROSTER's … For [append-only files] the keeper's word at 06:34 … is: never
replace … it did not cover them at all.* The packet's instruction (amend with a dated pointer, do not delete) is followed;
its description ("supersedes it") is not repeated in the code because it would be false there.

**And one ambiguity in the packet, resolved by its own tests.** Its prose says fast-forward when *"incoming is a
prefix-extension of local, or local of incoming"*; its test list says *"longer local ledger + shorter incoming → refused"*.
Those disagree on the second case. I followed the tests and C's §6 step 2: **only an incoming file that extends the local
one installs**; local-ahead is REFUSED (and left as it is), because that is the case that lost L058-L065.

## 1 · THE CHANGE

- **The manifest declares it, the installer enforces it.** `lap.jsonl` and `board.jsonl` carry `"install": "fast-forward"`.
  `installModeFor(rel, rules)` reads it, first match wins, as `transformFor` does. **An unknown mode refuses the file** —
  falling back to replacement is the one outcome the mode exists to rule out. No change to `state-manifest.js` (not mine
  this lap): the field is read by the installer, and a bad value fails there, closed.
- **`appendOnlyCompare(cur, want)` compares ROW FOR ROW, not byte for byte.** A torn last row (`{"lap":"L05`) is a byte
  prefix of `{"lap":"L058"}` and still a different row; a byte test would call it a fast-forward and overwrite the evidence of
  an interrupted write. Verdicts: `ff` (install) · `LOCAL-AHEAD` (the incoming file is a prefix of the local one) ·
  `DIVERGED` (each side has rows the other lacks). Refusals carry every local-only row with its 1-based line, and how many
  rows only the incoming side has. Exported, for C's union work.
- **A refused file is SKIPPED, not a stop.** Every other file of the set still lands, so what arrives cannot depend on
  where the refused file sorts in the index (a test pins a file sorting AFTER `lap.jsonl`). The install still returns
  **rc 1**, so `--pull --install` exits 1 and records `installed: false`, `stage: install`, and a `refused[]` list
  (`path`, `kind`, `local_only`, `local_only_lines`, `incoming_only`) in `sync-completion.json`. Row text goes only to the
  terminal (up to 10 per file, each cut at 200 chars), not into the record.
- **The terminal message is now true for this case.** The old refusal line said *"nothing further was written"*; with
  skip-not-stop that would be false, so a refused append-only file prints its own branch: the file, its kind, *"This
  machine's copy is unchanged"*, the local-only rows, and how many other files did land.
- **`state-manifest.json` `lap.jsonl` `why` corrected**: it said chain-status prints "this machine only" *"precisely
  because this file does not travel"*. False — it is TRAVELS, it travelled, it was replaced. The new text says so, cites
  C's diagnosis, and points at chain-status.js's own note (`:377-390`, checked) that the caveat held only while the file
  lived on one disk.

## 2 · RED FIRST, THEN GREEN — the command beside every number

    node consonance/tools/state-sync.test.js
      BEFORE                          78 passed, 0 failed
      RED (11 new tests)              83 passed, 6 failed
        FAIL a LONGER local ledger and a shorter incoming one — REFUSED, local rows intact, the rows named
        FAIL the refused ledger is recorded — installed:false, the refused file named in the completion record
        FAIL DIVERGED ledgers — REFUSED, local intact, the local-only row named
        FAIL a byte-prefix that is NOT a row prefix (a torn last row) is diverged, not a fast-forward
        FAIL an unknown install mode REFUSES the file rather than falling back to replacement
        FAIL the SHIPPED manifest declares lap.jsonl and board.jsonl as fast-forward installs
        green at red ON PURPOSE (controls): an incoming ledger that EXTENDS the local one is installed · other files of
        the same install still land · no local ledger → installed · identical → skipped · a file with NO mode is still
        replaced as before
      GREEN                           89 passed, 0 failed

    node consonance/tools/state-manifest.test.js     27 passed, 0 failed
    node consonance/tools/close.test.js              30 passed, 0 failed   (the addendum's bar)
    node dev/stick-apply.test.js                     52 passed, 0 failed

## 3 · MUTANTS

    node consonance/tools/mutant-harness.js <scratchpad>/l070/rows.js   (scorer copies the LIVE test + manifest in)
      FIRST RUN:  pre-flight 89/0 · 10 listed · 8 killed · 2 SURVIVED · 0 not applied
        #3 a refused file stops the whole install — the only other file, board.jsonl, sorts BEFORE lap.jsonl, so a
           `break` lost nothing. The fixture now carries letters.json, which sorts after it.
        #8 the completion record drops the refused list — my assertion matched `lap.jsonl` inside `why`. It now asserts
           refused[] itself: [['lap.jsonl', 'LOCAL-AHEAD', [2]]].
        (and "live unchanged: false" on that run — I edited a comment in state-sync.js while it ran; it was re-run)
      FINAL RUN:  10 listed · 10 killed · 0 survived · 0 NOT APPLIED · live state-sync.js unchanged: true
        #1 the fast-forward check is skipped   #6 LOCAL-AHEAD taken as a fast-forward
        #2 an unknown mode falls back           #7 the local-only rows not named on the terminal
        #3 a refused file stops the install     #8 the completion record drops refused[]
        #4 refusals collected but exit 0        #9 the mode read from no rule
        #5 byte prefix instead of row prefix    #10 diverged names the arriving rows, not the local ones

    node consonance/tools/state-sync.mutants.js      (the tracked harness)   TRACKED_RESULT

**A slip of mine, and what it left behind.** My first run of the tracked harness was wrapped in `timeout 580`, which killed
it mid-run with no summary line; the `exit 0` I saw was the pipe's `tail`, not the harness. That harness writes its mutant
copies **beside the source**, so the kill left `.state-sync.mutant-37872.js`, `.state-manifest.mutant-37872.js` and a lock in
`consonance/tools/`. The re-run's own recovery reported and swept all three (*"taking over a lock left by pid 37872, which is
not running"*; *"swept a copy left by killed run pid 37872"* ×2). A tracked-harness run is never wrapped in a timeout again.

## 4 · WHAT IT WOULD DO TONIGHT ON L — a read-only dry run, prediction registered first

    node <scratchpad>/l070/dryrun.js     (appendOnlyCompare over C:\Consonance\data vs C:\Consonance\state\data; writes nothing)
      lap.jsonl:   local 493 rows · incoming 419 rows · LOCAL-AHEAD · local-only 74 · incoming-only 0
      board.jsonl: local 31163 rows · incoming 30160 rows · LOCAL-AHEAD · local-only 1003 · incoming-only 0
    state head for data/lap.jsonl: f70d50a "state: D 2026-09-10T07:39:42.374Z"

**Registered before running:** lap.jsonl LOCAL-AHEAD with 66 local-only rows (C's 419 shared + 66); board.jsonl
**DIVERGED**, because the board is not append-only (L062: its prefix hash `720c6d59` ≠ C's `2a4a559f`). **Scored:** lap
right in kind, wrong in count (74 — the ledger has grown since C measured). **Board WRONG: LOCAL-AHEAD, not DIVERGED.** The
likeliest reason, inferred: tonight's 06:50 install had just REPLACED L's board with the state set's 30,160 rows, so
everything since only extends it; a board that had been rewritten after its last install would read DIVERGED. **Either way,
under this change tonight's L launch would have refused both files and kept L's rows.** The quantity could take more than
one value (the compare distinguishes three kinds, and the unit tests produce all three), and it was not the value I
expected.

## 5 · THE ADDENDUM — E's two comments, applied verbatim

`close.js:160-161` and `close.test.js:168-169` replaced with E §3's exact text. Checked first that it is true:
`grep -rn CONSONANCE_STATE_REPO` over consonance/ and dev/ finds only comments and tests asserting the name is **not** read.
**The assertions at `close.test.js:173-174` are untouched**, and I agree they are the right guard. **One disagreement, small,
and left as instructed:** the assertion's *failure message* at `:174` still says *"CONSONANCE_STATE_REPO is live-follow's
name and does not reach close.js"* — the first half is now false. The check is right; its message would mislead whoever it
fires for. It is a string inside the assertion, so I did not touch it; a one-word fix ("was live-follow's name") is E's or
the chair's call.

## 6 · WHAT I DID NOT VERIFY, AND WHAT THIS DOES NOT FIX

- **No real `--pull --install`** ran on L or D. The behaviour is shown in fixtures and by the read-only dry run.
- **What the app does with an install that exits 1** — `sync_launch.rs` reads `installed:false, stage:install` as "partly
  written" per the comment at `cmdPull`; I did not run a launch. **After this lands, every L launch that MIGRATEs will
  report an install refusal until L publishes an L-authored head** (C §6 step 5). That is the intended loud outcome, but
  it is a visible change at every launch.
- **Ten other append-only TRAVELS files are still replaced on install** — `dispatch-gate.jsonl`, `precompact.jsonl`,
  `sessionstart-state.jsonl`, `sourced_ledger.jsonl`, `carrier-drift.jsonl`, `ferry.jsonl`, `read_ledger.jsonl`,
  `return_ledger.jsonl`, `vantage_findings.jsonl`, `resonance/atoms.jsonl`. The manifest's own `limits[0]` calls every
  TRAVELS file except three append-only JSONL. The packet named two; marking the rest is one field each, and it is the
  keeper's or the chair's call, not a default I took.
- **This refuses; it does not reconcile.** L's rows stay on L and D's on D until C's union work (or a person) joins them.
- **The live data dir has the leak's `digests/` and `pulse/` back** (`state-manifest.js` exit 1, UNPLACED 4; HEAD's
  manifest gives the same exit 1). Not mine, and a close would refuse on it again.
- **Machine D was not run. The js-suite was not run.**

NEXT: librarian re-run §2's state-sync.test and §4's dry run, and route §6's ten unmarked append-only files to the keeper, when the file is read


---

## §-REBUILD · 2026-09-22 00:3x–02:0x, on L — STOP BEFORE WRITE (option (a) of my correction, ead6e8d)

**Why this section exists.** §1 above chose *"a refused file is SKIPPED, not a stop"*, and I argued it from inside
`installTree` alone. On D I traced the consumer (`p-l070-fastforward-A-correction_2026-09-21.md`, landed `ead6e8d`):
the launch runs the checkout's `state-sync.js --pull --install` (`main.rs:11055`, `:10961`), and an exit 1 becomes
`Pull::Failed` → `LocalHouse`, which says *"the data dir was not promoted"* (`sync_launch.rs:257-264`). Under
skip-not-stop that sentence was false: the roster, the tails and every other TRAVELS file DID land. **Observed on L
tonight by the librarian:** the launch ran my uncommitted build, kept lap.jsonl and board.jsonl (LOCAL-AHEAD
76 / 1,067 rows), lost no data, and printed the false line. **The chair's packet: rebuild as (a).**
Read without pulling: `git show origin/main:<correction>` and `git show origin/main:exo_memory/loop/for_L_tonight_2026-09-21.md`.
This checkout stays at `06bf966`, 66 behind; nothing was pulled, installed or closed.

### R1 · THE CHANGE (`consonance/tools/state-sync.js`, now +132 −4 against HEAD)

- **A pre-scan pass** judges every file whose rule declares an install mode, against the ARRIVING bytes, before the
  write loop. If any one would be refused (LOCAL-AHEAD, DIVERGED, or an unknown mode), `installTree` returns rc 1 with
  **`wrote: 0`, `displaced: 0`, no attic backup**, the refused list, and a `why` that begins
  *"… would lose rows, so NOTHING WAS WRITTEN — no file of the set was installed and this machine's data dir is exactly
  as it was"*. So the launch's *"not promoted"* is now literally true. It is `cmdPush`'s own rule turned around
  (*"A REFUSED PATH ABORTS THE WHOLE PUSH"*, `state-sync.js:~509`), and it is order-independent by construction:
  nothing is written until every file has been judged. That was my original reason for skip, now met the other way.
- **One judgement, used twice.** `installRefusal(rel, cur, want, rules)` is the only place a file is judged; the scan and
  the loop both call it, so they cannot disagree.
- **The race, the one partial install left, stops and says so.** The loop re-judges each append-only file right before
  writing it. A refusal *there* means the file changed after the scan (the app appending mid-install), so the install
  **stops**, leaves that file as the other writer left it, and says *"… CHANGED DURING THE INSTALL … Stopped before
  touching it; N file(s) had already landed."* It no longer skips and carries on.
- **`cmdPull`'s refusal text** no longer prints *"The other N written … are in place"* (false now). It says *"No file of
  the set was written; this machine's data dir is exactly as it was"*, or, only in the race, how many had landed.
- **Unchanged:** `appendOnlyCompare` (row for row), the manifest's `install: "fast-forward"` on lap.jsonl and
  board.jsonl, the `refused[]` in `sync-completion.json`, and E's §3 comment edits in close.js/close.test.js (2 lines each
  way, untouched this section).
- **Limit, in a comment where it lives:** the scan judges ARRIVING bytes, so a rule declaring both an install mode and
  an arrival transform would be scanned untransformed. No rule does today; the in-loop re-check judges transformed bytes.

### R2 · ONE OF MY OWN TESTS WITHDRAWN, and replaced by its inverse

`L070: the other files of the same install still land when the ledger is refused` asserted the withdrawn skip-not-stop
behaviour. It is **replaced**, not deleted: `L070 rebuild: one refused ledger refuses the WHOLE install — no other file
of the set is written` asserts the opposite on the same fixture. A comment marks the withdrawal where the test was.
Every other L070 test is unchanged and still passes.

### R3 · RED FIRST, THEN GREEN — the command beside every number

    node consonance/tools/state-sync.test.js
      BEFORE (my skip-not-stop build)      89 passed, 0 failed
      RED (6 rebuild tests, 1 withdrawn)   90 passed, 4 failed
        FAIL one refused ledger refuses the WHOLE install — no other file of the set is written
        FAIL the refusal SAYS nothing was written — the text the launch relays is true
        FAIL a DIVERGED ledger refuses the whole install too
        FAIL a ledger that GROWS between the scan and its write is refused, never overwritten
             (red on its MESSAGE: the old build did catch the change, but called it an ordinary refusal and went on)
        green at red: prefix-extension installs the WHOLE set · a refused install makes no attic backup
      GREEN                                94 passed, 0 failed
    node consonance/tools/close.test.js    30 passed, 0 failed
    node consonance/tools/state-manifest.test.js   27 passed, 0 failed   (L's copy; D099/D100's manifest changes are not pulled here)

**The race test** runs `installTree` in-process with an arrival transform on an earlier file that appends a row to the
local ledger, which stands in for the app writing mid-install. It asserts rc 1, the mid-install row survives, and the
`why` says the file changed.

### R4 · MUTANTS — the tracked harness TO COMPLETION, and the rebuild's own rows

    node consonance/tools/state-sync.mutants.js          (pid 43896, 00:43:10 → 01:31:08, NO timeout)
      state-sync.mutants.js: 50 killed, 0 survived, 0 not applied, 50 run of 50 total
    = the §3 TRACKED_RESULT placeholder above, answered here: that line stays as written, a trace of the run that never finished.

**THE OVERLAP, stated rather than trusted.** A second `state-sync.mutants.js` (pid 15540, `timeout 550`) ran alongside
mine from **00:52:46** until the librarian killed it and its two `timeout.exe` parents at **00:5x** (its message on the
board at 06:56:44Z). It came from **L's old vantage cell**: a blind reader re-checking one of my earlier results, the
same writer class as D099, still live on L's pre-D100 build. **Contention can only produce false KILLS** (a starved
suite times out and goes red), so kills recorded in that window are not evidence. My run had printed 12 kills by about
00:56, roughly one row a minute, so the window covers about #9–#13. **Re-run clean, bracketed generously, one row at a
time, nothing else running:**

    for i in 7..14: node consonance/tools/state-sync.mutants.js --only $i
      #7 #8 #9 #11 #12 #13 #14 killed — each "1 killed, 0 survived, 0 not applied"
      #10 printed no row line inside that loop (most likely it met the previous run's lock at start; my grep kept only
          row lines, so I did not see why). Re-run ALONE: "killed #10 a manifest class error is tolerated" · 1 killed, 0 survived.
    → all eight rows in and around the window re-confirm KILLED on a clean machine. The 50/50 stands.

    node consonance/tools/mutant-harness.js <scratchpad>/l070/rebuild_rows.js    (worktree copy; scorer copies the live test + manifest in)
      pre-flight green 94/0 · 13 listed · 13 killed · 0 survived · 0 no result · 0 NOT APPLIED · live state-sync.js unchanged: true
        #1 the pre-scan skipped (back to skip-not-stop) · #2 the pre-scan judges nothing · #3 the pre-scan compares the local
        file with itself · #4 the re-check before the write dropped · #5 a raced file overwritten after all · #6 an unknown
        mode passes · #7 LOCAL-AHEAD taken as a fast-forward · #8 byte prefix instead of row prefix · #9 the old "are in
        place" line · #10 no NOTHING WAS WRITTEN · #11 local-only rows not named · #12 refused[] dropped from the record ·
        #13 diverged names the arriving rows

**No debris from the killed run:** `ls consonance/tools/.state-*mutant*` finds nothing, and L's cell still holds only
`mutants-run.log` (3,383 B, 09-14 01:23), exactly as D100 §3 predicted.

### R5 · WHAT L'S NEXT LAUNCH WILL DO, read-only

    node <scratchpad>/l070/dryrun.js     (appendOnlyCompare over C:\Consonance\data vs C:\Consonance\state\data; writes nothing)
      lap.jsonl:   local 499 rows · incoming 419 rows · LOCAL-AHEAD · local-only 80 · incoming-only 0
      board.jsonl: local 31680 rows · incoming 30160 rows · LOCAL-AHEAD · local-only 1520 · incoming-only 0

(The librarian measured 76 / 1,067 at tonight's launch; both files have grown since.) **Under the rebuild, L's next MIGRATE
launch refuses the whole install before writing anything**: no roster, tails or ledger rows from the state set. The launch's
"not promoted" is then true. Receiving D's state waits for C's union and L's own publish (for-L §1 steps 4-6).

### R6 · A FALSE LINE IN THE FOR-L NOTE, found while checking

`for_L_tonight_2026-09-21.md` §3 says `dev/stick-waiter.test.js`'s SWEEP red on D is fixed *"in A's L070 work on L's
disk — land it with L070"*. **It is not.** `git status --short -- dev/` on L shows nothing dirty under `dev/`, and my
L070 work never touched stick-waiter or its test. So there is no stick-waiter fix to land with L070. Whoever owns that red
should take it as unowned, not as waiting on this lap. (The red's cause, which the note ties to my L068 `3d89dfb`
stick-apply change, is not diagnosed here.)

### R7 · WHAT I DID NOT VERIFY

- **A real launch or install** with the rebuild. Fixtures, the in-process race test and the read-only dry run only.
- **That `sync_launch.rs` reads a refused-before-write exit as intended** beyond `:257-264`, as on D.
- **Machine D.** D runs HEAD's state-sync (no L070) until L070 lands.
- **The js-suite** was not run; only the three suites above.

NEXT: librarian re-run R3's state-sync.test and close.test, check R4's overlap re-run, and collate L070 with C's files, when this section is read
