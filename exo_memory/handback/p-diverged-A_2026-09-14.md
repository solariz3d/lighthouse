# P-DIVERGED · ALPHA — the take, the grown seat that is not a fork, and the three debts. Built red-first; no §5 stop

## RESUME — paused 07:55 on L at the keeper's word ("pause your work to be picked up on desktop")

**Built and green; one measurement is owed.** The code, the tests and this hand-back are complete. Waking on D:
1. `git pull`, then check these files against this hand-back: `dev/tail-carry.js`, `.test.js`, `.mutants.js`,
   `dev/stick-apply.js`, `.test.js`, `consonance/state-manifest.json`. They were uncommitted when I paused, so they
   reach D only if the chair or the transfer carries them.
2. `node dev/tail-carry.test.js` → expect 129 / 0. `node dev/stick-apply.test.js` → 27 / 0.
3. **OWED: `node dev/tail-carry.mutants.js` to completion.** 90 mutants; the 21 new ones (§4) have never been scored.
   Then `node consonance/tools/js-suite.js`. Replace the two "INCOMPLETE / NOT RUN" lines in §4 with the numbers, and
   ring the librarian again with this path.
4. On D, do NOT `--apply` against the stick as part of this. The keeper's first real TAKE is the landing.

**Pane A, machine L, 2026-09-14 ~07:10–08:05.** Packet `exo_memory/loop/packet_diverged_2026-09-14.md` (d5fa623,
re-ruled 6397e1a). Built: §2.1–2.4, the forwarding half of §2.6, and §2.8's D-1 and D-7, which override §2 where they
conflict. Also debts (a) (b) (c) (d). **No §5 stop: every line assigned to A could be built as written.**

Files, all A's: `dev/tail-carry.js`, `dev/tail-carry.test.js`, `dev/tail-carry.mutants.js`, `dev/stick-apply.js`,
`dev/stick-apply.test.js`, `consonance/state-manifest.json` (one rule).
Nothing committed. Nothing run with `--apply` against `D:\consonance-L-20260911`: fixtures only, plus two read-only
rehearsals (§6). None of E's files touched. **C reads this.**

---

## 1 · WHAT EACH RULING BECAME (dev/tail-carry.js unless named)

    §2.1   --take-stick <sid>, repeatable, parsed beside --retire-far and --repair; --help lists it.
    §2.2   planImport: in the size > pend.offset branch, after the ALREADY_APPLIED / INTERRUPTED tests and after D-1, a
           row that would be DIVERGED becomes RETIRE_THEN_APPEND when its sid is named. Nothing above that point
           consults the flag, so a named REFUSED / INTERRUPTED / APPEND / APPLIED_AND_GREW keeps its verdict (tested
           on all four; the INTERRUPTED case also under --apply, file unchanged, no attic file).
           The DIVERGED `why` now names the door: "…name it: --take-stick <sid> (this machine's file goes to the attic, whole)".
    §2.3   applyImport: RETIRE_THEN_APPEND joins DOES. asideTo = atticPath(projectsRoot, slug, sid, 'take-stick', now);
           copyFileSync(dest -> asideTo); truncate dest to pend.offset; append the tail; verify size === toOffset
           AND whole sha === fullSha; on ok agreed = {toOffset, fullSha, at}, pending = null, as every write.
           ONE ADDITION, named: between the copy and the truncate, the attic copy is READ BACK (size, and sha over the
           whole length, against the live file). If it differs, nothing is truncated, the seat is exactly as it was,
           and the row fails ("did not read back equal"). REPAIR does not do this. The take is the one operation that
           destroys this machine's future on purpose, so it waits for proof that the future exists elsewhere, whole.
           Cost: two extra reads of the file; on D's main that is ~271 MB twice, at the keeper's Carry only.
    §2.4   toJson: takeable = true on an import DIVERGED row, else null. ownBytes = size − pend.offset on DIVERGED and
           RETIRE_THEN_APPEND; size − pend.toOffset on APPLIED_AND_GREW (D-1's own wording); else null. Both fields
           are on every row (the contract's "every field, null where n/a"). RETIRE_THEN_APPEND rows carry
           carries: true and result.aside naming the attic file; a verified take goes on the carried receipt.
    D-1    BEFORE the DIVERGED verdict: size > pend.toOffset AND hashRange(dest, 0, pend.toOffset) === pend.fullSha
           → APPLIED_AND_GREW. Not a stop, not takeable, not in CARRIES. It is in SETTLES beside ALREADY_APPLIED:
           under --apply the file is re-verified NOW (fileSize > toOffset and the carried span's sha), then
           agreed = {offset: pend.toOffset, prefixSha: pend.fullSha}, pending = null, and nothing is written to the
           seat's file. result.advanced is true, the seat goes on the receipt, and the manifest is rewritten. Afterwards
           this machine's later bytes export as an ordinary TAIL from toOffset (tested).
    D-7    CARRIES.import gains RETIRE_THEN_APPEND. A DIVERGED row's `bytes` = pend.bytes (the tail's length;
           toOffset − offset if a ledger ever lacks it). THIS CHANGES THE ROW CONTRACT'S ONE INVARIANT: "bytes is 0
           when carries is false" now has one exception. It is written into toJson's header and into the test's
           wellFormed checker. I checked every consumer by grep: the only reader of a row's bytes is stick.js:93 (a
           per-row cell); nothing sums it.
    §2.6   dev/stick-apply.js: --take-stick <sid> is accepted and forwarded verbatim, in order, among
           --retire-far / --repair. A missing value refuses to start (exit 2, no handshake), as the others do.

## 2 · THE THREE DEBTS AND THE RULE

    (a)  planImport: a NOTHING_PENDING row reads this machine's file (stat + conversationKey, no settle wait, no
         verdict depends on it), so localSize and localFirstTimestamp are filled when the file exists and stay null
         when it does not. ALSO FOR OURS — beyond the packet's line, and why: the reopen after this machine's OWN
         export (the keeper's very next launch after a close with the stick in) reads OURS on every seat, and OURS was
         pushed before the file was read exactly as NOTHING_PENDING was. Measured on the real stick, read-only (§6):
         all seven rows are OURS today, and all seven now carry localSize and localFirstTimestamp. C may rule OURS out;
         it is one line and one mutant.
    (b)  planExport, right after the UNIMPORTED_TAIL refusal: when the pending tail is THIS machine's, the key
         matches, and the file's size === pend.toOffset and whole sha === pend.fullSha → UP_TO_DATE
         ("the stick already holds this machine's last session…"), carries nothing. That covers both a FULL pending
         (no agreed state yet — tonight's first carry) and a delta.
         GROWN PAST its own pending tail — today's behaviour, traced and kept, tested end to end: the row falls
         through to TAIL from the AGREED offset (FULL if there is none), and --apply replaces the pending record with
         the larger span. That is correct: the far machine has imported nothing, so a tail from where it agrees still
         lands as APPEND there, verified whole (test). The earlier tail FILE stays on the stick unreferenced. That is
         today's behaviour; verify-set counts it as `extra`, informational. Named, not changed.
         A file rewritten at the SAME size after its own export is not "already on the stick": the sha decides (test).
    (c)  renderHandoff: a delta's line no longer promises APPEND. It now reads "expected at the far end: APPEND if that
         machine has written nothing of its own to this seat since the agreed state; DIVERGED if it has — the keeper
         chooses there". Still a pure function of the ledger (the exporter cannot see the far disk). offset 0 is
         still FULL.
    (d)  consonance/state-manifest.json: { "glob": "ready/*.tmp", "class": "STAYS", … }, beside ready/*.json. Its
         writer is dev/shell/lib/ready.js:61 (`<pane>.json.<pid>.tmp`, then a rename that is silent on failure, :64).
         Measured with `node consonance/tools/state-manifest.js`: UNPLACED 2 → 1. The real
         `ready/0c0c0c0b-…-115b.json.29304.tmp` (216 B, 03:20) classifies as `ready/*.tmp STAYS` through the tool's own
         globToRe. `ready/x.json` still classifies under ready/*.json. A `.tmp` at the root still matches no rule.
         **The one still UNPLACED is `vantage_cell/mutants-run.log`.** It is not mine and not in this packet, so
         it is named here and left unruled; D's close refuses on it just the same.

## 3 · RED FIRST

The tests were written before any tool change and run against the unmodified tool (dev/tail-carry.js git-blob
58f2c68b…), then saved: `scratchpad/diverged_red_first.txt` → **110 passed, 17 failed**.

    red   (a) NOTHING_PENDING reads the file · (a) OURS reads the file
    red   (b) own FULL export → UP_TO_DATE · (b) own DELTA export → UP_TO_DATE
    red   (c) the HANDOFF does not promise APPEND for a delta
    red   2.1 parse+help · 2.2 take verdict · 2.3 the take · 2.2 named-on-non-DIVERGED · 2.4 fields · D-7 CARRIES
    red   D-1 verdict · D-1 settle · D-1 named-for-take · D-1 changed-between-plan-and-apply
    red   the two field-set tests (every EXPORT / IMPORT verdict path) — FIELDS gained takeable, ownBytes
    NOT red, and why: "(a) with no file, still null" (a guard: no guessed 0) · "(b) grown past its own pending tail,
          re-carries from the agreed state and lands whole" (TODAY'S behaviour, kept on purpose) · "D-1: a real fork
          one byte longer than the tail is still DIVERGED" (a guard against D-1 by length alone)

Two tests were added AFTER the build and BEFORE the mutation run, because the planned mutants showed nothing guarded
them: "a take whose attic copy does not read back equal truncates NOTHING" (it swaps fs.copyFileSync for a short copy
for one in-process call) and "(b) rewritten at the SAME size … the sha decides". Neither is red-first; each is killed
by its mutant (§4).

The applier's two tests are red against its HEAD parser. That is measured as a mutant on a scratch replica (§4, first
row): an unknown --take-stick exits 2 with no handshake.

## 4 · COUNTS AND MUTANTS

    node dev/tail-carry.test.js                        129 passed, 0 failed   (108 at the lap's start)
    node dev/stick-apply.test.js                        27 passed, 0 failed   (24)
    node consonance/tools/state-manifest.test.js        25 passed, 0 failed
    node consonance/tools/state-sync.test.js            75 passed, 0 failed
    node dev/stick-waiter.test.js                       41 passed, 0 failed
    node consonance/tools/js-suite.js                   NOT RUN this lap (stopped for the machine transfer, §RESUME)

    node dev/tail-carry.mutants.js                      INCOMPLETE — STOPPED at 07:54 for the keeper's transfer to D:
                                                        62 killed · 0 survived · 0 not applied, of 90. Pre-flight was
                                                        green. **The 28 not scored include ALL 21 NEW mutants below**:
                                                        the harness runs them after the 69 standing ones. So nothing in
                                                        this lap's code is mutation-measured yet. The 62 are standing
                                                        mutants, re-killed against the changed tool.
                                                        Leftovers removed by hand after the stop
                                                        (dev/.tail-carry.mutant-29472.js, dev/.tail-carry.mutants.lock);
                                                        `node dev/tail-carry.test.js` then 129 / 0 on the tracked file.
      (its own copy and green pre-flight; the 69 standing mutants plus 21 new)
      the 21 new: take without being named · INTERRUPTED named-for-take taken · the take appends without truncating
      (two futures concatenated) · the take keeps no attic copy · the attic copy not read back · the copy filed under
      another tag · RETIRE_THEN_APPEND planned but not in DOES · --take-stick not parsed · D-1 undone (grown seat reads
      DIVERGED) · D-1 by length alone · APPLIED_AND_GREW not settled · the settle re-verifies the whole file instead
      of the carried span · D-7 CARRIES undone · D-7 DIVERGED bytes undone · takeable on every import row · ownBytes
      from the tail's end · (a) undone for NOTHING_PENDING · (a) undone for OURS · (b) undone · (b) by length alone ·
      (c) undone

    node scratchpad/ctrl_diverged_apply.js              pre-flight 27 passed, 0 failed · 3 applied · 3 caught · 0 survived
      --take-stick unknown (HEAD) · accepted but not forwarded · forwarded as --retire-far

**A correction to my own run, before any number above was kept.** The first harness run refused to start: "THE SOURCE
ALREADY CARRIES A MUTATION". Four of my new mutants had a replacement string that already occurs in the source: an
empty string, a substring of the anchor, and `'pre-truncate'`, which REPAIR uses. The harness guard is right, because
a mutant whose output is already in the file cannot be told from the file. I made the four replacements distinct and
ran again. No count comes from the refused run.

## 5 · C'S READ, CHECKED AGAINST WHAT I BUILT

- **C §1 (D-1).** C's own probe (`…sibling-0845a868/…/scratchpad/diverged-probe/probe.js`), run unmodified against
  this working copy: case A still `DIVERGED`, and its export is still `REFUSED UNIMPORTED_TAIL`. Case B before growth
  reads `ALREADY_APPLIED`; case B after growth (675 B) reads **`APPLIED_AND_GREW`, stops false**. It was DIVERGED at
  C's read.
- **C §3c / §3e (D-7).** RETIRE_THEN_APPEND carries true with bytes = the tail. A DIVERGED row now has bytes (the
  tail) and ownBytes. E's hand-back §3 fed my working copy through its functions and got `bytes: 121, ownBytes: 139,
  takeable: true` for its fork. The two halves agree on the row shape; they have not been landed together.
- **C §5, the kill-point table.** Reasoned from the code as built (not run): killed after the copy → DIVERGED again,
  and a second attic copy takes a `-2` counter. After the truncate → APPEND (`size == pend.offset`). Part-way through
  the append → INTERRUPTED. After the append, before the ledger write → ALREADY_APPLIED, which is settled, not
  exposed. My read-back check adds one point: killed between the copy and the check → DIVERGED again, the same as
  "after the copy".
- **Falsifier (iii) admits the counter** in my test (`ATTIC_NAME` accepts `-n`).

## 6 · READ-ONLY AGAINST THE REAL STICK (no --apply, no write; this machine L, app open)

    node dev/tail-carry.js --stick D:\consonance-L-20260911 --import --json
      NOTHING_TO_DO · 7 × OURS from L · each with localSize and localFirstTimestamp (e.g. main 271,346,119 B,
      2026-06-30T08:05:32.435Z) — debt (a), the "unknown" column, now filled on real data
    node dev/tail-carry.js --stick D:\consonance-L-20260911 --export --json
      REHEARSED · 7 × TAIL from the agreed offset (main 260,427,744 → 271,346,119, 10,918,375 B)

**What that export does NOT show:** debt (b)'s UP_TO_DATE on real data. Every seat has grown since the close export,
because the app is open and seats are writing, so each correctly falls through to TAIL. The UP_TO_DATE case is shown
only on fixtures.

## 7 · WHAT I DID NOT VERIFY

- **Nothing landed end to end.** E's window → `stick_start_applier(take_stick)` → `stick-apply.js --take-stick` →
  tail-carry RETIRE_THEN_APPEND has not run as one chain. Each hop is tested on its own side. `stick-apply.js:80`
  refuses an unknown flag, so **both halves must land together.**
- **The packet's falsifiers on D** (i)–(iv) are shown on fixtures only (NOTHING_PENDING after the take, the attic file
  with the pre-truncate bytes, size and sha equal to toOffset/fullSha). Nothing has run on D or at D's scale, where a
  take reads main's ~271 MB file four times: the copy, the read-back ×2, the verify.
- **(ii), fresh or a launch-minute first timestamp**, is the launch's receipt path. I show the take goes on the carried
  receipt; the launch reading it on D is not run.
- **The idea file's third falsifier** (an export that reports DONE while a carried seat's file at export time is
  longer than the toOffset that export wrote) is untouched by this lap. It is still guarded only by applyExport's
  existing "the source grew while it was being read" check. Not re-tested here.
- **§2.7, a KEEP that clears the other machine's pending tail**, is not built, as the packet says.
- **OURS in debt (a)** is my extension. C or the chair may rule it out.
- **A hard kill mid-take** is reasoned (§5), not run.
- **Anything on D.**

## 8 · SCRATCH

    C:\Users\zackn\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\
      diverged_red_first.txt      the red-first run (110 / 17)
      diverged_mutants.txt        the tail-carry mutation run
      ctrl_diverged_apply.js      the applier mutants on a replica
