# REGISTRATION — the vantage disposition field. E, L046, 2026-09-08. DESIGNED, TESTED, NOT WIRED.

**Ruled at L044:** a boolean `read` flag is refused. It costs one keystroke, has no second reader,
and once it exists *ticked* and *acted on* share a footprint — the defect it was proposed to fix,
rebuilt inside the fix.

**Built here as the shape only.** `second-vantage.js` does not require it and no ledger is written.

    MODULE   consonance/tools/vantage-disposition.js
    TEST     consonance/tools/vantage-disposition.test.js      12 cases · 5 mutants · 5 caught · 0 survivors

---

## 1 · THE FIELD

```json
"disposition": { "kind": "fixed", "ref": "d4e7044", "ts": "...", "by": "..." }
```

    fixed          ref = a sha that resolves to a commit
    withdrawn      ref = a path that exists
    declared-dead  ref, PLUS superseded_by (sha|path) OR expires (date)

**Every value requires an EXTERNAL REFERENT.** That does not make lying impossible; it makes lying
**checkable in one command by someone who did not write the row**. A boolean never was.

---

## 2 · RULING (a) — the referent is enforced at WRITE TIME **and** in a LATER CHECKER

**Not read-time-only, and the reason is that the ledger is append-only.** A disposition whose
referent does not resolve must be refused at the boundary, because once appended it cannot be
edited out and a read-time check would reject the same row forever with nobody able to repair it.

**And a second pass is required because RESOLUTION IS NOT PERMANENT.** A sha can be rebased away; a
path can be deleted. A row that was valid can stop being valid, and only a re-check notices —
`recheck()` is that pass, and its test drives the same rows through a resolver where the sha has
vanished and requires them to come back named.

**Free text is never a referent.** `referentShape()` accepts a sha or a path and nothing else;
`'fixed it'`, `'done'`, `'see the handback'` and the empty string are all refused, and the kind must
match its shape — a path is not a fix and a sha is not a withdrawal.

---

## 3 · RULING (b) — `declared-dead` is the soft one, and here is what stops it being the boolean

**A reason is free text by nature, so a reason is never sufficient on its own.** `declared-dead`
additionally requires one of:

    superseded_by   a sha or path, checked exactly like any other referent
    expires         a date -- AND THE ROW REVERTS TO OPEN WHEN IT PASSES

**The expiry is the part that does the work.** It converts *dead* from an assertion into a claim
with a shelf life: if nobody renews it, the row re-surfaces on its own and is visible again to the
`--undispositioned` query. A dead row that stays dead has to be re-declared by someone.

**THE HONEST LIMIT, named rather than hidden:** a determined person can put a real sha beside a
false claim and nothing here detects it. This is a floor, not a proof. What changed is that the
referent is checkable by a second reader; the failure mode moved from *unfalsifiable* to *falsifiable
and possibly unfalsified*, which is the most this mechanism can do.

---

## 4 · RULING (c) — a row with NO disposition is **OPEN**, and OPEN is reachable by a command

**Silence must never read as handled.** `classify()` returns `OPEN` for absent and for explicit
`null`; `undispositioned(rows)` returns exactly those rows, so the state is produced by a command
rather than by reading the ledger and forming an impression. An expired `declared-dead` lands in the
same bucket.

---

## 5 · WHAT WIRING WOULD COST AND RISK — the keeper's call, priced

**COST**

1. **A write path in `second-vantage.js`.** The cell appends findings; nothing writes dispositions
   today. Something must — most plausibly a small CLI (`--dispose <id> <kind> <ref>`) rather than a
   hand-edit, because the ledger is append-only JSONL and a disposition is a *later* fact about an
   *earlier* row. **That is the real cost and it is not one line: it needs a decision about whether
   a disposition is a new row that references the old id, or a rewrite of the original row.** I
   recommend a NEW ROW referencing the id — it preserves append-only, and the reader folds.
2. **A `--undispositioned` report**, which is small.
3. **`git cat-file -e` per row on recheck.** At 178 rows this is trivial; it grows linearly.

**RISK**

1. **The cell runs unattended.** A validator that rejects wrongly makes rows unwriteable in a place
   nobody is watching. Mitigation: validation runs in the *disposition writer*, never in the
   ingest path, so a bug cannot stop findings being recorded.
2. **A disposition is a claim about the past made later**, so the sha may postdate the row by weeks.
   Nothing here checks that the sha is *related* to the finding — only that it exists. **A second
   reader must still read.** This mechanism removes the tick, not the judgement.
3. **The expiry clock creates re-surfacing work.** If nothing renews, rows come back. That is the
   intent, and it will look like noise the first time it happens; the alternative is a dead flag
   nobody revisits.

**NOT RECOMMENDED WITHOUT:** a decision on new-row-vs-rewrite (item 1), because that choice is hard
to reverse once rows exist.

---

## 6 · FALSIFIER

Registered before wiring: **if a disposition is ever written whose referent nobody can resolve, or
if `--undispositioned` is added and its count only ever grows, this field has become the boolean it
replaced with extra steps** — and the honest move is to say so rather than keep the ceremony.
