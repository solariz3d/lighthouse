# P-D115-NARROWING — the stray-backup rule narrowed, and two things C's build found (pane E, D115, 2026-09-22)

Packet: the chair's D115 packet E. **Machine D**, C's build landed as **`a81d339`** (D114), its hand-back is
`exo_memory/handback/p-d114-unionbuild-C_2026-09-22.md`, and the librarian ruled on C's §3 deviation and **accepted
it**. **No code. Nothing committed.** I own `exo_memory/loop/union_at_launch_2026-09-22.md` and this file; **A's
§-ATTACK inside the design is untouched**, including the sentence of A's that proposed the rule now narrowed.

Started 14:42:22, finished 14:4x (`date +%T`). Three dated notes, each **in place at the clause it changes**, with my
original wording struck and legible.

## 1 · THE NARROWING — my rule would have refused every install on this machine, forever

**Mine (struck, kept visible):** at the start of every launch, a dangling `started` receipt **or any stray
`*.pre-union-*` beside a ledger** refuses the whole install.

**C's, in force:** a backup is stray **only when no `finished` receipt names it.**

**Why C is right, and I verified the count myself rather than taking it:**

    cd C:\Consonance\data && ls *.pre-union-* resonance/*.pre-union-* | wc -l   → 9

Nine backups: board, lap, precompact, sessionstart-state, sourced_ledger, carrier-drift, return_ledger,
vantage_findings, resonance/atoms. **They were left by D106's hand unions, they are kept deliberately by their own
`STAYS` rules (L071, L076), and they predate the receipt file** — so **no `finished` line will ever name them**, and
my literal rule would have refused every install on D from today onward. **A guard that fires forever on a correct
state is not a guard; it is the thing people learn to skip** (C's sentence, and it is right).

**What the literal rule would have needed, named as the packet asks:** a **one-time reconciliation** writing
`finished` receipt lines for those nine existing backups before the first launch under the guard.
**It is not being done, and the reason is recorded rather than left implicit:** those nine receipts would assert
completions nobody witnessed. **A record invented to satisfy a check is worse than a narrower check.**

**The fault in my own words, since it recurs:** I wrote a condition over **what is on disk** when the thing I meant
was **an event that did not finish**. The receipt carries that event; the disk never did. C's form is the crash
signature AMEND-4 was actually about, and the dangling-`started` half is built exactly as written.

## 2 · A MERGED FILE IS LEGITIMATELY LONGER — the step my design never mentioned

Recorded at §2, where PHASE 2 is defined, because that is where it lands.

`reconcileInstall` compares the data dir against the verified tree, and **a merged ledger is longer than the copy that
arrived**, so **a successful merge reported `SHORTFALL … LONGER than the verified file` and the install exited 1**
(C, §4). **My design named PHASE 0 through PHASE 4 and never mentioned the check that runs after them** — the same
class of omission as §10's walk: a step whose assumption ("what is on disk equals what arrived") the design had
quietly broken, found by C's tests rather than by my design.

**The fix keeps the L055 law** and follows the pattern already there for transformed paths, which are also supposed to
differ: the claim is **re-derived from the destination, with PHASE 2 itself as the postcondition** — at least as many
rows per key as the arriving copy, and no keyless line missing. **A merged file is never hashed against the arriving
bytes.** Its two findings are `UNION-SHORT` and `UNION-UNCHECKABLE`.

## 3 · THE STALE-LOCK BUG — C's first mutant run found a real defect in C's own work

Recorded at the lock clause, because the clause is mine.

**Taking over a dead holder's lock returned `took: 'fresh'`, so the stale takeover the design says to LOG was
invisible** — the takeover happened and the log line did not (C, §6). **C fixed it in the implementation, not in the
test**, and it now returns `stale-takeover` with the dead holder's row.

**Why it is worth a dated note rather than a shrug:** *"stale takeover logged"* were **my words in the design**, and
without the mutant run they would have stayed a sentence in a design with nothing on disk behind them. **This is the
case for mutants stated in one line: the test passed, the feature was absent, and only a mutation asked.**

## 4 · WHAT I CHECKED, WITH ITS COMMAND

    git log -1 --format="%h %s" a81d339                      → a81d339 D114 … union-at-launch built … plus writeUnion's receipt
    cd C:\Consonance\data && ls *.pre-union-* resonance/*.pre-union-* | wc -l   → 9  (8 beside the ledgers, 1 under resonance/)
    grep -n "stray" exo_memory/loop/union_at_launch_2026-09-22.md   → my clause (struck) and A's §-ATTACK line, which is A's and untouched

## 5 · NOT VERIFIED

- **I did not read C's implementation or re-run its tests or mutants.** The packet asked for three dated notes, and
  the figures above are C's own, cited to its hand-back — except the nine, which I counted on disk.
- **Whether any other clause of mine is a disk-state condition standing in for an event** was not swept. §1's is the
  one C hit. *It is the shape to look for next time, and I am naming it rather than claiming there are no others.*
- **Nothing about the registration's bars changed**, and no rig has run: the falsifier, the 20 s / 90 s bars and the
  degenerating clause are all still unmeasured.

NEXT: librarian collate the narrowing note when p-d115-narrowing-E_2026-09-22.md is written and the map line is appended
