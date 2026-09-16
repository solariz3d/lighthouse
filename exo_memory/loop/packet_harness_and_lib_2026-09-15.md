# P-HARNESS · no mutation run touches a tracked file again — and the librarian's per-launch growth, measured before anything is designed

**To ALPHA and ECHO, with BRAVO reading A's port before it lands, 2026-09-15 ~05:30, on machine L.** The keeper's
order from 00:58 (e705f67): this short lap first, then the Third Place crossing. His go at 05:21: "lets do it".
Work shape: the librarian's (`librarian/2026-09-14.md`, 05:17 entry, 166f0ef).

## 0 · WHY — measured, three sightings of one class

A mutation harness that rewrites the TRACKED source and restores it afterwards is unsafe on this machine: a kill from
outside runs no handler (L059 §1). It has left a live mutant in a tracked file three times:
- `lap-row.js` (09-06)
- `tail-carry.js` (09-14 02:02)
- `consonance/tools/state-sync.js` (09-15 00:42–01:20, `void b`, pid 21068, which the chair and B had to work around)

`dev/tail-carry.mutants.js:36-44` already does it right. Each mutant is written into a COPY beside the real file
(`.tail-carry.mutant-<pid>.js`), and the suite is pointed at the copy through `TAIL_CARRY_UNDER_TEST`
(`dev/tail-carry.test.js:27-37`). A kill leaves at worst an untracked copy and a stale lock.

## 1 · ALPHA — port the two in-place harnesses onto the copy pattern

    consonance/tools/close.mutants.js        writes the tracked source: :41 restore(), :84 original.replace
    consonance/tools/state-sync.mutants.js   :183 restores FILES (more than one tracked file — read it first)
    consonance/tools/close.test.js, state-sync.test.js   gain an UNDER_TEST pointer, the tail-carry.test.js:27-37 shape
    all three *.mutants.js                   gain --only <id>: run exactly that one mutant (none has it today)

- Measure what each suite loads — `require`, a spawned `node <file>`, a sibling module — before choosing where the
  pointer goes. A copy that only one load path sees is a mutant the other path never ran, so it reads as
  NOT APPLIED, never as caught.
- The tracked `close.js`, `state-sync.js` and `state-manifest.js` are NOT edited.
- The next run sweeps a stale copy or lock the way tail-carry's harness does.
- Add `.gitignore` lines for the new copy names, as `dev/.tail-carry.mutant-*.js` has.
- The L-side state hold stands: nothing here runs `close.js` for real or pushes state. Every run stays in fixtures.

## 2 · ECHO — measure the librarian's per-launch growth. Design nothing yet.

The keeper, via the librarian: the librarian seat "balloons every reset". The librarian's own figure: its transcript
grew 428,177 B at the 05:12 resume with nothing typed. **Give the number first:**

- **Per-launch growth** for the librarian and the chair across the last several launches: bytes, and the records
  that make them up. Read the transcripts' own records between launch rows in persist.log.
- **What the intake block is:** which code writes it, which files it carries, and how big each part is.
- **What an alternative would save, as measured bytes, not argument:** the keeper's "index only what changed since
  the last launch", and anything else the prior art names.
  Prior art: `loop/packet_lib_cap_2026-09-01.md`, `loop/packet_lib_cap_remainder_2026-09-02.md`,
  `loop/packet_lib_window_build_2026-09-01.md`, `librarian/2026-08-24.md`.

Read-only. Edit no code this lap, and write no CLAUDE.md or intake.

## 3 · BRAVO — read A's port before it lands

Check each ported harness against falsifiers F1–F3 below, and the `--only` flag against a real run. You wrote none of
this.

## 4 · FALSIFIERS — registered before the build (the librarian's)

    F1  At any moment during a run of either ported harness, git diff on a tracked source is non-empty.
    F2  A kill mid-mutant (taskkill /F on the harness pid) leaves a tracked source changed, or leaves no named copy.
    F3  --only <id> runs any mutant but <id>, or reports zero applied without saying NOT APPLIED.
    F4  (E) a design proposal arrives before the per-launch number.

    A   node consonance/tools/close.test.js · node consonance/tools/state-sync.test.js · both harnesses to completion
        with applied / caught / NOT APPLIED · one real kill mid-run with git diff after · what you did NOT verify

## 5 · IF THIS PACKET IS WRONG

If a harness cannot be pointed at a copy (a load path that resolves the tracked file by absolute name, say), **stop
and write why in your hand-back, then ring the librarian.** Do not build around it. "This harness should be retired,
not ported" is a valid answer.

## 6 · HAND-BACK

`exo_memory/handback/p-harness-<letter>_2026-09-15.md`, then `call_librarian` with the path in the same turn. One line
to your own map. Do not commit.

## 7 · §2's FIGURE, CORRECTED BESIDE IT (05:40, after E's measurement)

§2 says the librarian grew "428,177 B at the 05:12 resume with nothing typed". **That figure included the librarian's
own first turns.** E's cut for that launch is **357,388 B** (`handback/p-harness-E_2026-09-15.md` §1; WRONG 108, the
librarian's, carried into this packet by the chair). The line in §2 stands as written.

**E's answer, re-derived by the librarian (2782af4), no design this lap:**
- Every launch writes one instructions record that carries the intake TWICE: files[].content 141,865 B plus the
  rendered text 143,343 B, a ratio of 2.02.
- (A) The keeper's "index only what changed" saves ~285,749 B per launch on the librarian and ~246,112 B on the
  chair. Two constraints are measured and unsolved:
  - after a compaction the vendor re-reads the ON-DISK CLAUDE.md in full;
  - "since the last launch" crosses machines with the stick.
- The single largest item is the vendor's file-history snapshot: 114,574,171 B, 41% of the chair's file.

**Which lever to pull is the keeper's, and building it is its own lap.**

## 8 · LANDED, AND WHAT IS HELD FOR P-HARNESS-2

**Landed at the commit that carries this section.**
- F1, F2 and F3 held on both ported harnesses, on the lap's own evidence:
  - `state-sync.mutants.js`: 50 killed, 0 survived, 0 not applied; a 2,040 s watch saw tracked files dirty 0 times.
  - `close.mutants.js`: 10 of 10.
  - A real kill on each harness left the tracked sources clean, and the next run swept the copies.
- **Changed after B's read:** only the `--only` argument check, where a repeated or malformed `--only` now refuses.
  That is B's own minor (1). The chair read the diff: the same parse, before the lock, in all three harnesses.
  `node <harness> --only 3 --only 4` exits 2 in all three.
- Suites re-run by the chair: close.test.js 24/0, state-sync.test.js 75/0, tail-carry.test.js 129/0. No copy and no
  lock is left in `dev/` or `consonance/tools/`, and the tracked close.js, state-sync.js and state-manifest.js are
  unchanged.

**HELD, not built (B's read, collated at 692012d):**
- (a) **Coverage change.** The manifest load path through `state-sync.js:84`: the in-place harness exposed a mutant
  to all 96 loads, and the copy reaches only the two pointed paths. It costs nothing today. The fix is the resolution
  hook A named.
- (b) **Order-dependent first match.** Anchors #11–#13 are first-match inside `verifyTree` (`:678`/`:685`/`:695`),
  right today and order-dependent tomorrow. The fix is to print the matched line, or assert the enclosing function.

**§2 closes as a record.** No design is owed. The keeper withdrew the balloon concern at 05:56: "i think the
ballooning context was a visual error".

---

# §3 · THE MUTANT-LIST RULES — added 2026-09-16 (L061, pane A), from the P-LEAVE-3 laps

*Three rules and one refinement, written for a stranger to apply. Each is labelled **GATE** (the harness refuses)
or **SENTENCE** (only a reader enforces it). That labelling is the point: **a rule nobody enforces is still worth
having, and its silence must never be read as a passing gate.** The carrier is `dev/tail-carry.mutants.js`; the
same three apply to `consonance/tools/close.mutants.js` and `state-sync.mutants.js`, which were not edited tonight.*

## R1 · PIN THE SHAPE A VALUE SITS IN, NEVER THAT A TOKEN APPEARS — **SENTENCE**

A pin that reads for a token passes when the mutant leaves that token behind somewhere else. Four survivors in one
lap, all this shape:

| the mutant | why the pin still passed |
|---|---|
| a guard disabled with `&& false` | the pin searched for the guard's text, which was still there |
| a figure dropped from a measured list | the same figure appeared in the sentence below it |
| an assignment moved inside a conditional | the search found the moved copy and read the order as unchanged |
| a probe's fall-through changed | its error path still returned the word the pin looked for |

**Write instead:** the ARM (`X => {`, not `X`), the ORDER (`a` occurs before `b`), or the COUNT (`occurs exactly
once`, not `occurs`). **Why this cannot be a gate:** it is a property of the SUITE, not of the list. A harness that
could tell a shape-pin from a token-pin would have to understand what the test means, which is the suite's job. The
harness now prints, for every SURVIVOR, that mutant’s own anchor and replacement — **the surviving MUTATION, never
the pin that let it through.** The harness never sees a pin, so it cannot check one; it puts the changed text in
front of the reader, who must then go and find the assertion that read it. An aid, and explicitly not a check.

## R2 · AN ORPHANED ANCHOR IS LOUD, AND IT NAMES ITS ANCHOR — **GATE** (exit 2, before anything is mutated)

An edit that rewrites the line a mutant anchors on reports **nothing** until the next FULL run, and then only as one
`NOT APPLIED` line among the counts. It happened twice in one lap; the second time it orphaned two rows at once, and
both were found only because a re-run happened for another reason.

**Built:** the WHOLE list is audited before any mutation — **including under `--only`**, which is exactly how the
staleness stayed invisible (a list audited only where it was run cannot see the row nobody asked for). Every orphan
prints its id, its name, whether it is MISSING or AMBIGUOUS, and **the anchor text itself**.

**The cost, named rather than discovered later:** a legitimate refactor now makes the harness REFUSE until its
anchors are re-pointed. That is the trade — a stale list produces counts that read like measurements and are not.

## R3 · THE LIST IS VALIDATED BEFORE USE — **GATE** (exit 2)

A malformed row is not a typo, it is a silent re-interpretation. One row written with double quotes (an apostrophe
in its name) was skipped by a bulk edit that added a column; it then destructured one field short, and the runner
read an **anchor as a filename** and died mid-run, after scoring three rows. Every row is now checked for three
non-empty strings with a replacement that differs from the anchor, and a bad row is named by index before anything
runs.

## R4 · THE LEAK CHECK: EXPOSURE IS NOT A VOID — **SENTENCE** (the reader applies it; `leak-check.sh` still exits 1 on either)

A **filename** appearing in a status listing is EXPOSURE: the cell is scored, and the exposure is recorded beside
it. Returned **content** — a quotation, a figure, a verdict read out of another seat's file — is a VOID. The two
were one rule on 2026-09-16 and the rule as written voided a cell that had only ever seen a name. **The cut is what
the seat could have LEARNED, not what it could have NAMED.** The rule is in `dev/diversity/leak-check.sh`'s header;
the script was deliberately not changed tonight, so its exit 1 means "go look at which of the two this was", never
"the cell is void".

## What was measured before this landed

```
node dev/tail-carry.test.js                      129 passed · 0 failed   (unchanged by this lap)
node dev/tail-carry.mutants.js --only 1          1 killed · 0 survived · 0 not applied
node consonance/tools/close.mutants.js --only 1  1 killed · 0 survived · 0 not applied
node consonance/tools/state-sync.mutants.js --only 1  1 killed · 0 survived · 0 not applied
both gates, on a REPLICA of dev/ (tracked files hashed before and after, unchanged):
  R2  a rewritten anchor, asked for with --only 5   -> exit 2, names #1 and prints its anchor text
  R3  a row carrying two fields instead of three    -> exit 2, names #1 and prints the row
```
