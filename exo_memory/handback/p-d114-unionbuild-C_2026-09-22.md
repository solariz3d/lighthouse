# P-D114-UNIONBUILD — C (D114 packet C, chunk 3.2, ON D, 2026-09-22 13:3x–14:3x) — UNCOMMITTED

**Union-at-launch is built to the amended design** (`exo_memory/loop/union_at_launch_2026-09-22.md`, blob `e4b2e816`),
and **D112's receipt is folded in**. Script only: no rebuild, nothing run against the live data dir, no launch, no close.

Files: `consonance/tools/state-sync.js`, `consonance/tools/ledger-union.js`, their tests, and a new
`consonance/tools/union-at-launch.mutants.js`.
sha256: state-sync.js `23dc3a5970ca490e…`, ledger-union.js `028cbc84d1eb2f65…`.

| suite | before | after |
|---|---|---|
| `node consonance/tools/state-sync.test.js` | 104 / 0 | **118 / 0** |
| `node --test consonance/tools/ledger-union.test.js` | 42 / 0 | **44 / 0** |

**ONE DELIBERATE DEVIATION FROM THE DESIGN'S LETTER — §3 below. It needs E's or the chair's word.**

## 1 · What was built, phase by phase (`state-sync.js`)

The seam is inside `installTree`, between the pre-scan and the write loop, as §1 specifies.

- **The switch** `CONSONANCE_UNION_AT_LAUNCH`: **only the exact value `on`** turns it on; unset, unknown, `1`, `true`
  and `yes` are all today's behaviour, pinned by a test over all of them. The design's note that it must live in the
  APP's environment is carried in the header comment, because a seat cannot flip it.
- **PHASE 1** unions each refused ledger one at a time, in manifest order, under **one lock held for the whole set**.
- **PHASE 2 is a COUNT PER KEY, never a set test** (A's FATAL-1). `countsByKey` counts ROWS per canonical key; the
  refusal prints the offending key with its pair (`local 1 / arriving 2`) and says, in the message, that **a union
  cannot repair a deficit** — §10b — so nobody reaches for a retry.
- **PHASE 2(b)** refuses when the arriving copy holds a keyless line this machine lacks, **naming the line numbers**.
  A fused line is never merged.
- **Eligibility reads the MANIFEST, not ledger-union's list** (§7.4). A file is refused rather than unioned when its
  mode is not `fast-forward`, when the mode is UNKNOWN (§7.1), when it also carries an arrival transform (§7.2), or
  when ledger-union has no spec for it. Each refusal says which rule it hit.
- **§7.3 is strict**: if ANY row of either copy has no parseable time, the file is refused. A threshold against a
  measured zero is a guess with a percent sign.
- **PHASE 3 is reachable from every failure** — ineligible, time, a throw from the union, an unverified union, a failed
  PHASE 2, and a failure to take the lock. The refusal keeps today's words and adds the merged ledgers, **change
  first** (§8, A's NOTE-10.2).
- **PHASE 4** skips merged files. `installed`/`wrote` keeps its old meaning exactly; a merged file is
  **`INSTALLED-BY-UNION`** in the record and **"merged"** in the pane, never "installed".
- The completion record gains `union: { attempted, succeeded, failed, ms, merged[], failures[] }`, each merged entry
  carrying `distinct_rows_added`, `lines_caught_up`, `lines_reconciled`, `backup`, `backup_lines`, `backup_bytes`,
  the three keyless counts and `verified`.

## 2 · The receipt and the lock (`ledger-union.js`) — D112 folded in

- **One append in `writeUnion`**, as the packet says: a `started` line **before the freeze** (§4, A's AMEND-4 — that is
  the window where a crash leaves no live file at all) and a `finished` line after verify, to
  `<data>/union_receipts.jsonl`.
- **Every count field carries its unit in its name** (E §5): `distinct_rows_added`, `union_distinct_rows`,
  `live_lines_read`, `lines_caught_up`, `lines_reconciled`, `lines_partial_carried`, `final_lines`, `missing_lines`,
  `missing_union_rows`, `backup_lines`, `backup_bytes`.
- **The field §2b said was owed** is returned now: `invalidLive`, `invalidArriving`, `invalidNotInLive`, plus the line
  numbers. PHASE 2(b) is built on it.
- **§3 item 3** is satisfied: `backup_bytes` and `backup_lines` are recorded at the end, so a later check can re-read
  the backup and see any line a writer appended after the union closed — the one hole the protocol cannot close.
- **`<data>/union.lock`** (§4, A's AMEND-3), taken by `writeUnion` AND by the launch phase, refusing with
  *"a union is already running (pid N, started …). Close Consonance first"*. A dead holder's lock is taken over **and
  the takeover is reported**.
- `writeUnion`'s existing behaviour is unchanged: same protocol, same backups, same verification.

## 3 · THE DEVIATION, AND WHY — §4's "any stray `*.pre-union-*` refuses"

§4 says the launch-start scan refuses on **a dangling `started`, OR any stray `*.pre-union-*` beside a ledger**.

**I built the first and NOT the second.** Taken literally, the second **refuses every install on D from now on**: D106
left **nine** `*.pre-union-*` backups in this data dir, they are kept deliberately by their own STAYS rules (L071,
L076), and they were written before this receipt file existed, so no `finished` line will ever name them. A guard that
fires forever on a correct state is not a guard — it is the thing people learn to skip.

**What is built instead:** a backup is treated as stray **only when no `finished` receipt names it**, which is exactly
the crash signature AMEND-4 is about, and is silent about backups made before receipts existed. The dangling-`started`
half is built exactly as written and refuses the whole install, naming the file and the backup.

**This is a real narrowing of the design and it is E's call, not mine.** If the literal rule is wanted, it needs a
one-time reconciliation step that writes `finished` lines for the nine existing backups first — otherwise D cannot
install anything again.

## 4 · What the design did not anticipate, found by its own tests

**A merged file fails the post-install reconcile.** `reconcileInstall` compares the data dir against the verified tree,
and a merged ledger is **longer** than the copy that arrived — so a successful merge reported `SHORTFALL … LONGER than
the verified file` and the install exited 1. The design never mentions the reconcile.

**The fix keeps the L055 law** and follows the pattern already there for transformed paths, which are also supposed to
differ: the claim is **re-derived from the destination**, with PHASE 2 itself as the postcondition — the file on disk
holds at least as many rows per key as the arriving copy, and none of its keyless lines is missing. A merged file is
never hashed against the arriving bytes. `UNION-SHORT` and `UNION-UNCHECKABLE` are the two new reconcile findings.

## 5 · Tests, and the two mutants the packet named

`node consonance/tools/union-at-launch.mutants.js` → controls `state-sync 117/0` and `ledger-union 44/0`, then
**13 applied · 13 caught · 0 survived · 0 no result · 0 NOT APPLIED.**

The two the packet named by hand are rows 1 and 2, and both go RED:

| # | mutant | result |
|---|---|---|
| **1** | **PHASE 2(a) asks presence, not counts** (A's FATAL-1) | **CAUGHT**, 2 tests red |
| **2** | **PHASE 2(b) stops looking at the arriving copy's keyless lines** (A's FATAL-2) | **CAUGHT**, 1 test red |
| 3 | the switch turns on for any truthy value | CAUGHT |
| 4 | `countsByKey` counts distinct keys instead of rows | CAUGHT, 3 red |
| 5 | §7.3's strict time rule dropped | CAUGHT |
| 6 | a dangling `started` no longer refuses | CAUGHT |
| 7 | a merged file counted as INSTALLED | CAUGHT |
| 8 | a file failing PHASE 2 treated as merged | CAUGHT |
| 9 | an unverified union accepted | CAUGHT |
| 10 | the write loop installs over a merged file | CAUGHT, 2 red |
| 11 | the reconcile hashes a merged file | CAUGHT, 2 red |
| 12 | the receipt's `started` written after the freeze | CAUGHT |
| 13 | the lock lets a second union in | CAUGHT |

The `state-sync` tests added: the switch over eight values; PHASE 2(a) failing on a duplicate the arriving copy holds
twice; PHASE 2(a) passing when counts are met; PHASE 2(b) refusing an orphan keyless line and NOT refusing one already
here; the strict time rule on both sides; the dangling-`started` scan; `countsByKey` counting rows; `unionVerdict`'s
two gates; and **five end-to-end runs through the real phases** — merged-and-installed, switch off, the receipt's
`started`-before-`finished` with its unit-bearing fields, a PHASE 2 refusal on an arriving duplicate, and a dangling
receipt refusing the next install. `ledger-union` gained two lock tests.

## 6 · The first mutant run found two holes in MY tests, and one was a real bug

The first run was **13 applied · 11 caught · 2 survived**, and neither survivor was noise:

1. **"an unverified union is accepted" SURVIVED** — no test could reach that branch, because it only fires when
   `writeUnion` reports `verified: false`, which an end-to-end test cannot force. I split the decision out as
   `unionVerdict(r, j)` so both gates are drivable, and re-anchored the mutant onto it. **CAUGHT** after.
2. **"the lock lets a second union in" SURVIVED — and writing its test found a REAL BUG.** After clearing a dead
   holder's lock, `takeUnionLock` returned `took: 'fresh'`, so **the stale takeover the design says to log was
   invisible**. Fixed in the implementation, not the test: it now returns `stale-takeover` with the dead holder's row.

A third row read NOT APPLIED after the refactor (its anchor was gone) and a fourth then read SURVIVED because the
receipt's ORDER is pinned by `state-sync`'s end-to-end test, not by `ledger-union`'s own suite — a mutant scored
against a suite that cannot see it is a false pass, so a row may now name the suite that catches it.

## 7 · NOT verified

- **The rig in §6 of the design: 50 trials with a writer appending throughout, the held-handle rename, the exFAT /
  cross-volume `linkSync` case, and the 20 s-per-file / 90 s-per-set timing bars.** None of that was built or run
  this lap — the packet asked for the build, and the registration's trial is its own piece of work. **Until that rig
  runs, this is code that satisfies its tests, not a design that has met its falsifier.**
- **A real launch.** Nothing was run against the live data dir; every test is a temp world. `sync_launch.rs` is
  untouched, so the launcher still reads today's verdicts — the Rust side of §8 is not built.
- **The 257 real keyless lines and the 7,514 real duplicates.** PHASE 2's behaviour on them is proved by fixtures of
  the same shape, not by D's own files.
- **The switch has never been set on this machine**, and per §1 it would have to be set for the app.
- **`install_receipts.jsonl` (§5b)** was NOT added: `writeCompletion` is A's file, and the design names A as its owner.
- The full JS suite and the Rust suite were not re-run for this lap; both were green earlier today at D110.

NOT COMMITTED.

NEXT: librarian collate the build when p-d114-unionbuild-C_2026-09-22.md is written and the map line is appended
