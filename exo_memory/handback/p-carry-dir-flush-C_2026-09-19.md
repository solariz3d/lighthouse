# P-CARRY-DIR-FLUSH — C (CHARLIE), D082 (unattended run N1b), on D — DRAFT, appended as the lap runs

**Packet:** the chair's D082 dispatch. N1b is amended in `exo_memory/loop/night_log_2026-09-19.md:26,32` ("C flushes
--carry-dir (its own found-not-fixed, same fault class)"). The plan row `plan_night_run_2026-09-19.md:52` still
names only B's six reds; the amendment lives in the night log.

**The case:** my own `handback/p-flush-before-done-C_2026-09-19.md` §5. `applyDirCarry` copies with `fs.cpSync` and
prints CARRIED without flushing.

**Start state:**
- HEAD `6f4ec9f`
- `dev/tail-carry.js` sha256 `e60cb44a…` (D080, landed at `e12acc4`)
- the keeper asleep, so no question is put to anyone; see "Questions for the morning" below

## Log

- 11:1x — read the dispatch, the night log and my D080 §5. Draft opened.
- 11:2x — **Measured a hazard the packet did not name.** `fs.cpSync` carries the source mode, and a read-only copy
  cannot be fsynced on Windows. `node SCR/roprobe.js` → `SCR/roprobe-run1.txt` (Node v24.14.1, win32):

  | step | result |
  |---|---|
  | copied mode | 444, same as the source |
  | `open 'r'` + fsync | EPERM |
  | `open 'r+'` | EPERM at open |
  | chmod 0o644 → `'r+'` + fsync → chmod back | OK; mode back to 444; **mtime unchanged** |

  Git object files are 0444, so a carried repo would hit this. **Conservative default taken:** lift the read-only bit
  on the COPY, flush, and restore it. A failed lift, flush or restore is `NOT_FLUSHED`. Question for the morning, below.
- 11:3x — **Tests red first.** Six new `carry-dir flush: …` tests, run with `node dev/tail-carry.test.js`:
  163 passed, 6 failed. Each failed for its own reason, since the seam already existed from D080:

  | new test | failure |
  |---|---|
  | files | "copied but never flushed: a.jsonl" |
  | directories | "directory not flushed: …\on-stick\scratch" |
  | any single flush | "a clean carry made only 0 flushes" |
  | read-only | "the read-only copy was not flushed" |
  | unsupported | `r.flush` undefined |
  | --json | `flush` absent |
- 11:4x — **Built.** `flushFile` (lift read-only on the copy, `'r+'` open, fsync, close, restore; the first error wins),
  `dirsUnder`, and in `applyDirCarry` after the read-back passes: every copied regular file flushed, then every
  directory of the copy deepest-first, then the destination's parent. `runCarryDir` catches only `FlushError` →
  `NOT_FLUSHED`, code 1, "NOT DONE — …". The result and the carry-dir `--json` carry `flush`.
- 11:4x — **One of my own new assertions was wrong, and it is fixed at its meaning.** The read-only test's last line
  asserted the source was restored to exactly 0o644. On Windows, `chmod 0o644` reads back as 0o666, because only the
  read-only bit exists. It now asserts the source is writable. This was the test's own clean-up check, not a
  code-under-test assertion; the copy-side assertions passed.
- 11:4x — **Green:** `node dev/tail-carry.test.js` → **169 passed, 0 failed** (163 + 6).
  `node dev/stick-apply.test.js` → 48/0; `node dev/stick-waiter.test.js` → 74/0.
- 11:5x — **Mutants: `consonance/tools/mutant-harness.js` needed an adapter.** Two findings about the harness:
  - Its score parser reads only cargo's `test result: ok|FAILED. N passed; M failed` (`cargoResult`). A JS suite scores
    NO RESULT and the pre-flight refuses.
  - It copies only the mutated file into a HEAD worktree. With this lap's tests uncommitted, it would score the mutants
    against HEAD's 163 tests, which contain none of the six, so every row would falsely survive.

  So the score command is `SCR/score-js.js`. It copies the LIVE `dev/tail-carry.test.js` into the worktree, runs it,
  and prints the cargo-shaped line. Rows are in `SCR/rows-carrydir.js`, 12 rows;
  `node consonance/tools/mutant-harness.js SCR/rows-carrydir.js --audit` → "12 rows pass the gates".
- 12:0x — **Mutants, scored by `consonance/tools/mutant-harness.js` on a HEAD worktree copy** (live file hashed
  before and after):
  - Run 1, `node consonance/tools/mutant-harness.js SCR/rows-carrydir.js` → `SCR/harness-run1.txt`:
    pre-flight green 169/0. **12 listed · 11 killed · 0 survived · 1 no result · 0 not applied.** Live file unchanged.
  - **#1 was NO RESULT, and the fault was my row, not the code.** Replacing the whole `try` line orphaned its
    `finally` (SyntaxError), and the harness correctly refused to count it as killed. Rewritten to remove only the
    `IO.fsync` call inside the `try`.
  - Run 2, `… --only 1` → `SCR/harness-run2-only1.txt`: **killed**.
  - **Total: 12 applied, 12 killed, 0 survived, 0 NOT APPLIED.**
- 12:1x — **Rows kept in the tracked `dev/tail-carry.mutants.js`**, ids 101–112, as for D080, so the list stays one
  list.
  - In that older harness, row 112 needed a different replacement: its "already mutated" check reads the whole file,
    so a `'\n'` replacement would falsely read as present.
  - **My own edit had orphaned D080's row #96:** its anchor `return { ok: false, code: EXIT.SEAT, outcome: 'NOT_FLUSHED',`
    now matched twice. That harness refused the whole list, which is its rule 2 working. I re-pointed #96 onto the same
    D080 line with a longer, unique anchor; the mutation is unchanged.
  - `node dev/tail-carry.mutants.js --only 96` → 1 killed; `--only 112` → 1 killed (`SCR/tracked-rescore.txt`). Rows
    101–111 in that file were **not re-scored there**; they were scored by `mutant-harness.js` above.
- 12:1x — **Cost**, `node SCR/cost-carrydir.js 5` → `SCR/cost-carrydir-run1.txt`: the real use case, the stick's
  `files/repo-carry` (**read only**, as the source) → a fresh temp destination on C:, HEAD vs the working tree,
  alternating.
  - Carried per run: 54 files, 300,312 B; excluded 311,754,634 B.
  - **Median OLD 0.119 s → NEW 0.195 s: +0.076 s.** All 7 directories report `flushed`.
  - It ran while the mutant harness was running, so the timings are contended. The folder has grown since D067
    (46 files / 88,217 B then).

---

## Result

**Built to the bar.** `--carry-dir --apply` now says CARRIED only after:
1. every copied regular file has been fsynced at its place in the copy;
2. every directory of the copy (deepest first) and the destination's parent have been flushed;
3. the read-back has already passed.

A failed flush → **`NOT_FLUSHED`, code 1**, with "NOT DONE — …" naming the path and the error. A directory that
declines the flush is printed as `unsupported` and still carries, the same rule as D080. The result and the carry-dir
`--json` carry `flush: [{dir, result}]`.

| check | command | result |
|---|---|---|
| tail-carry tests | `node dev/tail-carry.test.js` | **169 passed, 0 failed** (163 + 6; red first 163/6) |
| stick-apply tests | `node dev/stick-apply.test.js` | 48/0 |
| stick-waiter tests | `node dev/stick-waiter.test.js` | 74/0 |
| mutants | `mutant-harness.js` | **12/12 killed** after one row fix |
| cost | `SCR/cost-carrydir.js` | +0.076 s median, contended |

**Files touched (uncommitted):** `dev/tail-carry.js` (sha256 `8e82837202e45cd2…`), `dev/tail-carry.test.js`
(`c2357dcdce182d22…`), `dev/tail-carry.mutants.js` (`e612e753de90b518…`). No real stick was written: the stick was
only ever the *source* of the cost probe.

## Questions for the morning (the keeper was asleep; the conservative default was taken)

1. **Lifting read-only on the COPY to flush it.** The default taken lifts the bit, fsyncs, and restores it; a failure
   at any step is `NOT_FLUSHED`. The alternative is to leave read-only copies unflushed and *report* them. That
   touches nothing, but it means "every copied file is fsynced" would not hold for a carried git repository.
   **Is changing and restoring the copy's attribute acceptable?**
2. **The harness adapter.** `consonance/tools/mutant-harness.js` reads cargo output only and scores against HEAD's
   test file. Should it take a JS score line natively, and optionally copy named live files into its worktree? It is
   A's tool; I used a scratch adapter (`SCR/score-js.js`) and did not edit it.

## What is NOT verified

- **exFAT and the real stick**, as in D080: `'r+'` directory flushes and file fsyncs are measured on NTFS only.
- **A real device failure:** only an injected `EIO` exercises `NOT_FLUSHED`.
- **Read-only lift/restore on exFAT:** exFAT keeps a read-only *attribute* (no Unix mode). The chmod round trip is
  measured on NTFS only.
- **A failed restore:** "flushed, but could not restore read-only" is reachable and is a `FlushError`, but no test
  injects a chmod failure. No mutant targets the first-error-wins ordering either.
- **Symlinks** in a carried tree are not flushed as files (a link is a directory entry, covered by the directory
  flush). Untested, as `cpSync`'s link behaviour already was (`tail-carry.js`, the carry-dir header).
- **The destination is left in place after `NOT_FLUSHED`.** The message says to remove it and run again, because the
  door refuses an existing destination. Not automated: deleting on a device that just failed is its own risk.
