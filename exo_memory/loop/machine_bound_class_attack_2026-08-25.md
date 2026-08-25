# The MACHINE-BOUND class, attacked — 2026-08-25, pane E

**Brief:** break the class before it exists. I did not write it, and B was not consulted at any
point. No code was written and nothing under `consonance/` was edited; every probe below lives in
`%TEMP%` and every command is given so it can be re-run rather than trusted.

**What I actually attacked, and this matters.** The brief described a design. By the time I read the
tree, **B had already implemented it in the working directory** — a stronger design than the ruling
described, with five failure branches, two runner-side probes and a universe print. So this is an
attack on the *artifact*, not on the summary of it. The exact bytes:

```
sha1  271a5115faed204e54a1df3666ea52ab8dc2b9cd  consonance/tools/js-suite.js              (working tree, +170 over 219c0aa)
sha1  54bcce0dde6a852b2a346e1e2ac72eb927717c41  consonance/tools/actors.evidence.test.js  (untracked, first read)
sha1  db8e11972ff173f1e3d5cb948f6e08d02157598e  consonance/tools/actors.evidence.test.js  (changed under me; findings re-run against it)
HEAD  03a5fbc
```

Both files were dirty and moving while I worked, and the evidence file changed once mid-attack: B
replaced the hardcoded `'C:/Consonance/data'` default with a `CONSONANCE_DATA` → `~/.consonance.json
data_dir` → `null` ladder (`:44-53`). **Every finding below was re-run against `db8e119` and
survives it unchanged** — the gate's two mirrored branches (`:89-95`, `:95`, `:99`) are byte-identical
across the two shas. Line numbers still drift; re-derive before believing any of them.

---

## VERDICT

**The design does not survive, and the surviving defect is the one the brief named.** Two attacks
landed, both mutation-proven; one of them is live in the shipped gate right now. Two more attacks
failed cleanly, and B's design is better than mine would have been. One reporting bug is cosmetic
today and load-bearing the moment a second file declares the class.

| # | attack | outcome |
|---|--------|---------|
| E-1 | the gate is computed from the data the assertions assert on (the mirror-test) | **LANDS.** Two assertions are entailed by their own gate; both mutation-proven dead |
| E-2 | the `deny` probe tests the runner's knob, not the file's gate | **LANDS.** A 15-line file with no corpus question at all passes (d) and reports green |
| E-3 | a genuine red reaches the runner as NOT-RUN | **LANDS, via E-1.** Suite exits 0 over a corpus with 12 rows deleted |
| E-4 | the universe print miscounts what ran | **LANDS, small.** Files that explicitly printed NOT-RUN are counted as having run |
| E-5 | NOT-RUN indistinguishable from CRASHED-BEFORE-DECIDING | **FAILS.** Branch (a) is ordered first and closes it |
| E-6 | the class can be claimed to silently shrink the suite | **FAILS.** Every claim route I could build lands in `classErr` and exits 1 |
| E-7 | the split boundary is drawn wrong | **FAILS.** All five corpus tests moved, including the one above the old banner |

---

## E-1 — THE MIRROR TEST IS LIVE IN THE SHIPPED GATE (the one that matters)

The chair's question: *"If the predicate is computed FROM the same data the test asserts on, the
class can never fail."* It is, and it cannot — in two places.

**`actors.evidence.test.js:89-95`** counts letter assignments in `persist.log` with
`/^\d{9,12} letter [A-Z] -> pane=\S+/` and returns NOT-RUN when the count is zero.
**`:167`** is `assert.ok(stamps.length > 0, 'no letter assignments in persist.log at all — read it
before editing this')`, computed from the **same file with the same regex**. That assertion is
unreachable-false in every run on every machine. Not unlikely — entailed.

**`:93-101`** requires every id in `PRE_LETTER` to have a row on the board.
**`:176`** is `assert.ok(ts.length > 0, '<id> has no timestamped board rows — the class claims it
posted')`. Entailed, except in the sliver where an id's rows exist but none carries a numeric `ts`.

Mutation-proven rather than argued. Build a copy of this laptop's own corpus, then damage it:

```bash
mkdir -p /tmp/e-corpus && cd /c/Consonance/data && cp letters.json persist.log board.jsonl /tmp/e-corpus/
cd /c/Consonance/lighthouse/consonance/tools

# baseline — the copy is a valid universe
CONSONANCE_DATA=/tmp/e-corpus node actors.evidence.test.js     # pass 5, fail 0, EXIT 0

# MUTATION B: persist.log loses all 13 letter-assignment lines (13 -> 0)
grep -vE "^[0-9]{9,12} letter [A-Z] -> pane=" /tmp/e-corpus/persist.log > /tmp/p2
mv /tmp/p2 /tmp/e-corpus/persist.log
CONSONANCE_DATA=/tmp/e-corpus node actors.evidence.test.js     # EXIT 0
```

Printed:

```
JS-SUITE: NOT-RUN — persist.log under ... records no letter assignments at all,
                    so LETTER_BIRTH cannot be re-derived here
```

**That is the assertion's own failure message, printed as an excuse, with the exit code inverted.**

```bash
# MUTATION C: one pre-letter pane's 12 rows deleted from THIS MACHINE'S OWN board
grep -v '"pane":"433f587c-1627-4756-9aa4-1bd0d2e8fd8e"' /tmp/e-corpus/board.jsonl > /tmp/b2
mv /tmp/b2 /tmp/e-corpus/board.jsonl
CONSONANCE_DATA=/tmp/e-corpus node actors.evidence.test.js     # EXIT 0
```

```
JS-SUITE: NOT-RUN — 1 of 7 pre-letter ids have no row on ...board.jsonl
                    (433f587c-...) — this is a different board, not a broken record
```

**Read that last clause again. It is a conclusion the gate is not entitled to draw**, and it is
false in this run: it is this machine's board with twelve rows removed. The gate observed *ids
absent* and reported *different board*, choosing — with no evidence either way — the interpretation
that excuses it.

Full runner chain over the damaged corpus, and the whole suite goes green:

```bash
mkdir -p /tmp/e-real/sub && cp consonance/tools/actors.evidence.test.js consonance/tools/actors.js /tmp/e-real/sub/
CONSONANCE_DATA=/tmp/e-corpus JS_SUITE_ROOT=/tmp/e-real node consonance/tools/js-suite.js --quiet
#   0 green · 0 failed · ... · 1 not-run · 0 class-error  (of 1)      EXIT 0
```

**(e) GATE TOO STRICT does not catch it, and cannot.** (e) fires only when the forced run *passes*.
Here the forced run is red, so the runner accepts the NOT-RUN — and B's header says so explicitly:
*"It cannot prove a NOT-RUN is not hiding a RED... 'wrong universe' and 'real bug' are
indistinguishable from here."*

**That statement is true of a CONTENT gate and is not a property of the class.** It is the cost of
the design decision written at `actors.evidence.test.js:11` — *"the gate here is a CONTENT question"*
— and it is avoidable. A gate that asks **WHERE** instead of **WHAT** makes the two distinguishable
on exactly the machine where it matters: on the machine that owns the corpus, the file always runs,
and any red is a red about the record.

### The smallest change

**Declare a home machine, and make declining at home a CLASS ERROR.** One token in the header, one
branch in the runner:

```
// JS-SUITE: MACHINE-BOUND home=L
```

- The runner reads `machine_tag` **from `~/.consonance.json` only** — never the hostname derivation.
  This laptop has `"machine_tag": "L"` (`cat ~/.consonance.json`); the desktop's file has no such
  field (`desktop_observations_2026-08-25.md` §0), so the desktop can never accidentally claim to be
  home. Config-only is load-bearing: hostname-derived tags collide — `lap-row.js:244-252` derives
  `L` from any host whose name starts with an L — and a collision here would red the suite on an
  innocent machine.
- Where the tag matches `home`: **NOT-RUN is a CLASS ERROR.** Everywhere else it is accepted exactly
  as now.

*Half of this is already built at `db8e119`.* `dataDir()` (`:44-53`) already asks a WHERE question —
does this machine declare a corpus at all — and reports NOT-RUN when it does not. The gap is that a
machine which **does** declare one gets the same verdict as one that does not, so *"I have no board"*
and *"my board disagrees with these ids"* are one outcome. `home=` is that same ladder run one rung
further.

This is the CANARY SANG rule turned the other way up, and it gives the class the thing it currently
lacks: **under the design as written there is no machine anywhere on which the gate itself can
fail.** (d) proves the gate responds; (e) proves it is not too strict *where forcing succeeds*.
Nothing checks the gate where forcing fails — which is the only place a real defect lives.

Against the same mutations: `home=L`, this laptop is `L`, gate declines → CLASS ERROR → **exit 1**,
with a human reading *the file that owns this corpus declined on the machine that owns it.*

**The cost, stated rather than buried:** the file goes from zero machine literals to one. That is
deliberate. The literal is not a path — it is a name, in the same shape as `LAP_MACHINE_TAG` from
P-LAPROW-PIN — and it is what makes the decline falsifiable. Portability bought by making every
outcome acceptable somewhere is not portability.

---

## E-2 — THE `deny` PROBE TESTS THE KNOB, NOT THE GATE

`js-suite.js:285-292` proves a gate is load-bearing by re-running with `JS_SUITE_UNIVERSE=deny` and
requiring NOT-RUN. But requirement 4 asks the *file* to honour the flag, so the probe exercises the
file's handling of the runner's own variable — **the abuse condition the chair named: a planted
positive drawn from the instrument's own unit.**

Fifteen lines, no corpus question anywhere in the file, asserting `1 + 1 === 2`:

```js
// JS-SUITE: MACHINE-BOUND
console.log('JS-SUITE: UNIVERSE — corpus considered present (no check performed)');
if (process.env.JS_SUITE_UNIVERSE === 'deny') {
  console.log('JS-SUITE: NOT-RUN — universe denied by JS_SUITE_UNIVERSE=deny');
} else { test('checks no corpus', () => assert.strictEqual(1 + 1, 2)); }
```

```
 ok    sub\knob.test.js
js-suite: 1 green · ... · 0 class-error  (of 1)     EXIT 0
```

It passes (d) perfectly. It has no gate. And this is not sabotage — it is the *most natural* way to
satisfy requirement 4: you add the env override to make the probe pass, and the override becomes the
only thing the probe ever exercises. B's header anticipates the malicious case (*"a file that
deliberately lies about its own gate defeats all of this"*); this is the honest case, and it fails
the same way.

### The smallest change

**Deny the universe, not the permission.** Have the file declare the variable that names its corpus
root, and let the runner deny by redirection:

```
// JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_DATA
```

The deny probe sets `CONSONANCE_DATA` to a fresh empty temp dir instead of setting
`JS_SUITE_UNIVERSE=deny`. A real gate reports NOT-RUN because the corpus is genuinely gone; the
knob-only file above *runs*, and is a CLASS ERROR.

**This costs B's actual file nothing.** `actors.evidence.test.js:38` already reads
`process.env.CONSONANCE_DATA`, and its `survey()` already returns `ok:false` on missing files — it
declines correctly under a redirected empty root. The change protects the *next* declarer, which is
the only one that can still be gotten wrong.

---

## E-4 — THE UNIVERSE PRINT COUNTS BUCKETS, NOT EXECUTIONS

`js-suite.js:325` computes `ran = files.length - notRunFiles.length`. That is membership in one
bucket, not what any file did. Two files — one that crashed on load, one that printed
`JS-SUITE: NOT-RUN` with an empty reason (so it lands in `classErr`, not `notRunFiles`):

```
js-suite: 0 green · 0 failed · 1 crashed · 0 silent · 0 canary · 0 not-run · 1 class-error  (of 2)
universe: 2 test files discovered · 2 ran · 0 NOT-RUN
```

**Both statements are false.** Neither file ran an assertion, and one of them said so in its own
stdout. Every malformed NOT-RUN vanishes from the NOT-RUN count and reappears in the ran count — the
direction that reports more coverage than exists, in the print added specifically so the desktop
could tell *61 of 61 ran* from *61 of 62 ran*.

**And the counting line still does not reconcile**, which predates this work and now matters more
with seven buckets:

```
js-suite: 1 green · 0 failed · 0 crashed · 0 silent · 0 canary · 0 not-run · 1 class-error  (of 3)
```

Two of three. `canarySang` is in no bucket on that line (reproduce with a fixture tree holding a
green `EXPECTED-RED` file, a `MACHINE-BOUND` file with an inert gate, and a plain file).

**Smallest change:** derive `ran` from what each file did rather than from `notRunFiles.length`, put
`canarySang` on the counting line, and assert the buckets sum to `files.length` — refusing the run if
they do not, which is rule 2's own shape applied to the runner's arithmetic.

---

## THE THREE ATTACKS THAT FAILED — plainly, because a clean miss is worth more than a hedge

**E-5, NOT-RUN vs CRASHED-BEFORE-DECIDING: closed.** Branch (a) at `js-suite.js:247` is ordered
first, so a non-zero exit is FAILED/CRASHED before any NOT-RUN handling is reached, and the comment
says why the order is load-bearing. I could not get a crash, a syntax error, or a mid-run throw to
land in NOT-RUN. **FILE-MISSING is also distinguishable, for the wrong reason** — discovery just
does not find a deleted file and the total silently drops from `(of 61)` to `(of 60)`. That predates
this class and is not its problem; the reconciliation fix in E-4 does not cover it either, since a
deleted file is absent from both sides of the sum.

**E-6, claiming the class to shrink the suite: closed.** Every route I could build is caught. Two
declarations → CLASS ERROR. No universe line → CLASS ERROR. NOT-RUN with an empty reason → CLASS
ERROR. NOT-RUN plus a completed run → CLASS ERROR. And `classErr` is in the exit expression at
`js-suite.js:385` while `notRunFiles` deliberately is not. The one route that *does* work is the
knob-only gate (E-2) — and note what it buys: green, not silence. It shrinks the suite's meaning,
not its count.

**E-7, the split boundary: correct, including the trap.** I expected `actors.test.js:158` — *"the
real board resolves with nothing left over"* — to be left behind, because it sat **above** the old
`THE CORPUS TESTS` banner while reading `board`, `realLetters` and `realData`. It moved. All five
corpus-touching tests moved (old lines 158, 246, 256, 270, 286), the fifteen portable ones stayed,
and the `C:/Consonance/data` literal left the portable file with them. Counts: `actors.test.js` runs
15, `actors.evidence.test.js` runs 5, 20 as before.

**And the split is right for a reason stronger than the one given.** Today's per-test `t.skip` is
invisible to the runner:

```
# 3 tests, 2 of them skipped by an existsSync guard
js-suite: 1 green · 0 failed · 0 crashed · 0 silent · 0 canary  (of 1)    EXIT 0
```

js-suite reads pass/fail and is blind to `skipped` in **every** file, not just this one. So on a
machine with no `C:/Consonance/data` at all, the old `actors.test.js` reported **green while its five
sharpest assertions silently declined**. Splitting makes decline a property of a whole file — the
only granularity the runner can see. I could not break that, and it is the real gain here.

*(Related, and B closed it independently: node:test prints `pass 0 / fail 0` when every test skips,
which today's classifier reads as SILENT and fails the run — so the split alone, keeping `t.skip`,
would have converted the desktop's FAILED into a still-red SILENT. `actors.evidence.test.js:119-122`
removes `t.skip` entirely and exits before requiring node:test. Correct, and for the stated reason.)*

---

## THE POSITIVE THAT WOULD ACTUALLY TEST THIS CLASS

Not "point `CONSONANCE_DATA` at an empty dir and watch it decline" — that is the instrument's own
unit again, and a file that does nothing anywhere passes it. Four legs, and the last two carry the
weight:

1. **On this laptop:** the file RUNS — `pass 5 · fail 0 · skipped 0`. Skipped must be zero, or the
   per-test decline hole is back inside the file.
2. **On a foreign corpus:** NOT-RUN with its reason, suite exit 0. Reproducible here — the desktop's
   condition is `CONSONANCE_DATA` pointed at any other directory.
3. **On this laptop, damage the corpus** (mutations B and C above): the file must go **RED**, not
   NOT-RUN. It currently goes NOT-RUN, exit 0. **This is the leg the class fails**, and the leg that
   proves the gate did not eat the assertions.
4. **The falsifier:** with `home=L` implemented, force the config tag to `L` on a machine with no
   corpus → CLASS ERROR, not NOT-RUN. Until some machine exists on which the gate's own decline is a
   failure, "the gate is correct" is unfalsifiable — which is the abuse condition, wearing the class
   system as a coat.

A planted red inside the file, run where it does run, must still come out FAILED — branch (a)
delivers that, and I verified it — but it is not the interesting leg. Leg 3 is.

---

## WHAT I DID NOT ESTABLISH

- **I never touched the desktop.** Every statement about desktop behaviour is the desktop's own file
  or the librarian's reading of it, not my measurement.
- **The `home=L` fix is a design, not a build.** I wrote no code. Its interaction with a third
  machine, and with a machine whose `machine_tag` is set by hand to something wrong, is unexamined.
- **`js-suite.test.js` was unmodified at the sha I ran** — 14 tests, `js-suite-self: 14 passed, 0
  failed`, none of them exercising MACHINE-BOUND. B is mid-work and this is presumably in flight; I
  note it only because the last time a class shipped without a test for its own branches, the runner
  failed on itself at the commit that shipped it.
- **`portable-paths.js` was not re-run** against the new files, and one of my own notes went stale
  inside the hour. At `54bcce0` the evidence file carried `'C:/Consonance/data'` as a hardcoded
  default and I had this filed as an unresolved portable-paths question. At `db8e119` B had already
  removed it — `dataDir()` at `:44-53` reads `CONSONANCE_DATA`, then `~/.consonance.json`'s
  `data_dir`, then returns `null` and reports NOT-RUN with *"no corpus declared on this machine."*
  **That is the right shape and it is also the WHERE-gate I am asking for in E-1, already half-built**
  — it just stops one step short: an undeclared corpus is a decline, a *declared* corpus that
  disagrees with the data is also a decline, and nothing separates them. Whether the scanner sees
  the file at all I still have not checked.
- **Two of B's claims I checked rather than accepted, and both hold.** The `universe-print.test.js`
  citation greps back (`06fab50`, clause 1 at `:13`). And the ruling's literal predicate — *"it runs
  where persist.log contains the referenced ids"* — is **false on this laptop**: 6 of the 7
  pre-letter ids appear in `persist.log` zero times
  (`cd /c/Consonance/data && for id in ...; do grep -c "$id" persist.log; done`). B did not implement
  the ruling's wording; the shipped gate reads the **board** for ids and `persist.log` only for an
  assignment *count*. Had the ruling been implemented literally, the file would have declined on
  every machine — and (e) GATE TOO STRICT would have caught it here, loudly. That is (e) earning its
  place, on a defect that was in the room's own written instruction.

---

**Nothing committed. Nothing under `consonance/` edited.** `/tmp/e-*` holds the probe fixtures and a
165MB corpus copy; delete freely, the commands above rebuild them.

— pane E
