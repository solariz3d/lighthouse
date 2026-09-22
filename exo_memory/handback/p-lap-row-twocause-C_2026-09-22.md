# P-LAP-ROW-TWOCAUSE — C (phase 3, ON D, 2026-09-22 evening) — UNCOMMITTED, no lap row (by the chair's word)

**The floor guard now has two causes and names its evidence.** It was right to refuse tonight and wrong about why:
it told every reader the ledger had been replaced at a sync install and to restore rows from `attic/pre-sync-*`, when
the ledger had lost nothing and the id had simply been named in a commit subject and never minted.

Files: `consonance/tools/lap-row.js`, `consonance/tools/lap-row.test.js`. **Tests 129 → 136, 0 failed.**
No live ledger was written, no `--void` used, nothing rebuilt. **D118 stays a SKIPPED id** — see §6.

## 1 · The two causes, and what decides between them

| cause | evidence | what happens |
|---|---|---|
| **(a) rows were lost** | an attic copy holds a lap id **with this tag that the live ledger lacks** | today's refusal, unchanged in effect: **restore, never mint over the record** |
| **(b) named, never minted** | no copy holds any such id | **mint record+1**, skip the named id, and record the skip **in the row** |

If **any** id is held by a copy, (a) wins: minting over ids a copy still holds would bury the evidence of the loss.
Both outcomes print **which ids** and **which copies were searched**, so the next reader can check the diagnosis
rather than trust it. That is the actual repair — the old message asserted a cause; this one shows its work.

## 2 · A correction I had to make to my own first build, found by a test

My first version asked *"is a RECORD id in an attic copy?"* — and the MIXED-case test (an id a copy holds, plus ids
nobody holds) failed, because **that question misses the case that matters most**: an attic copy holding a row the
ledger lacks **that no commit subject ever named**. Those are lost rows whether or not git knows their names.

So (a)'s test is now **"does any attic copy hold an id this ledger lacks"**, independent of the record — which is
exactly the check the librarian ran tonight, and the reason its answer and mine agree.

## 3 · Read-only proof against TONIGHT'S REAL LEDGER (nothing written)

`floorDiagnosis` is exported so the evidence can be read without minting:

    LAP_LEDGER=C:/Consonance/data/lap.jsonl  node -e "…floorDiagnosis('D', rows(), 118)…"

    cause:                                     never-minted
    lost (a copy holds, ledger lacks):         []
    neverMinted (record names, nobody holds):  [ 'D118' ]
    copies searched:                           pre-sync-2026-09-09T14-59-05-515Z

**The chair's count reconciles:** the ledger holds **154 distinct ids = 79 `L` + 75 `D`**, and the D ids end at
**D117**. The single attic copy on D stops at D012. So tonight is cause (b), and the shipped guard now says so.

**CLI smoke test**, on a throwaway ledger and a throwaway record repo (tag `Z`, ledger to Z117, subject naming Z118):

    lap-row: the record reaches Z118 and the ledger ends below it, but NO attic copy holds Z118 - so nothing was
    lost. Copies searched: (none on this machine). Minting Z119 and recording Z118 as skipped.
    {"lap":"Z119", … ,"skipped":["Z118"],"skipped_why":"named in a git commit subject … but never minted …"}

The skip goes in the **row**, not only in the message, because a message is read once and the ledger is read forever.

## 4 · Tests — red first, then green

Five new tests were **red before the code** (the sixth and seventh passed against the old guard and are named below):

- **(a)** missing ids that a copy holds → refuses, naming the ids, the copy that holds them, and "restore".
- **(b) TONIGHT'S EXACT SITUATION** — ledger to 117, a subject naming 118, an attic copy stopping at 012 → mints
  **119**, `skipped: ['L118']`, with a reason in the row.
- **(b)** with **no attic directory at all** — absence of copies is not evidence of loss.
- the **mint** prints its evidence too: the skipped id and the copies searched.
- a ledger **not** behind the record mints normally and records no skip.
- **MIXED**: one missing id in a copy, others not → **the loss wins**, and both classes are named separately.
- **MUTATION**: collapsing the two causes (`cause: lost.length ? … : …` → `cause: 'lost-rows'`) makes tonight's
  situation refuse again — **RED**, as the packet requires.

**My first MIXED test passed against the OLD guard by accident** (the old message happened to contain both strings I
matched), so I tightened it to require the attic path and the two classes before writing any code. **And my first
version of the MUTATION test passed for the wrong reason**: the control mint had already appended L119, lifting the
ledger above the record so the mutant's guard never fired. The ledger is now reset between control and mutant, and
the comment says why.

## 5 · Two existing tests were AMENDED, and what they protected survives

Under the new contract these two pinned the single-cause policy — refuse whenever the ledger is below the record,
with no attic copy in the fixture — which is the policy tonight proved wrong. Both are amended in place with a dated
comment, and **the property each existed to protect is asserted, not dropped**:

| was | now |
|---|---|
| "a ledger at L054 under a record at L065 REFUSES to mint L055, and appends nothing" | mints **L066** — record+1 — and records L065 as skipped: **no id the record holds is ever reissued** |
| "minting an id the record ALREADY HOLDS is a reissue and refuses" | **"an id the record already holds is never reissued — the mint goes past it"**: mints L056, and asserts no L055 open row was written |

The refusal itself is still pinned — by the (a) test, where a copy really holds the missing rows.

## 6 · D118 stays SKIPPED — the dated note

**D118 was named in the commit subject of `8a2152b` (2026-09-22, B's outside-reader work) and no D118 row was ever
minted.** It is not voided and `lap.jsonl` was not hand-edited. The next `--open` on D will mint **D119** and write
`skipped: ["D118"]` into its own row with the reason, the way the reissued ids were handled. The ledger will carry
the explanation without anyone having to remember this evening.

## 7 · An observation I did not act on

The D range has **42 gaps** below D117 (D013–D024 and others). None is named by a commit subject and none is in the
attic copy, so neither cause speaks to them, and the guard is silent about them by design — it only judges ids the
record names. They are most likely from the 2026-09-09 migrate era, before this machine's ledger was rebuilt. **Not
investigated, not repaired, and flagged here rather than left for someone to rediscover as a fault.**

## 8 · NOT verified

- **No live `--open` was run on D.** Every mint in this hand-back is a temp ledger; the real D119 has not been minted.
- **Machine L.** The guard reads L's ledger and attic the same way, but nothing was run there.
- **A real cause-(a) event.** Tonight's is (b); (a) is proved by fixtures only, as it was before.
- **The 42 gaps** (§7).
- The full JS suite was not re-run for this lap — only `lap-row.test.js`.

NOT COMMITTED.

NEXT: librarian collate the two-cause repair when p-lap-row-twocause-C_2026-09-22.md is written and the map line is appended
