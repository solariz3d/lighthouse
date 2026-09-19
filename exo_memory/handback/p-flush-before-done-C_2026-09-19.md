# P-FLUSH-BEFORE-DONE — C (CHARLIE), D080 chunk 3, on D

**Packet:** `exo_memory/loop/plan_small_fixes_2_2026-09-19.md`, C row at :38 (read at `79ae65d`). **The case** is my
own D079 finding (`handback/p-stick-fault-cause-C_2026-09-19.md` §1, §6): on 09-14 a directory write to the stick
was still failing 53 s after the last write call had returned, and DONE was conditioned on those calls returning.

**Files touched (uncommitted):**

| file | change |
|---|---|
| `dev/tail-carry.js` | +101 / −7 |
| `dev/tail-carry.test.js` | +119 / −1 |
| `dev/tail-carry.mutants.js` | +32, ten rows: the harness is the file's own mutation test, so I counted it as "its tests" |

Measured with `git diff --stat -- dev/`. **No real stick was written:** tests use temp dirs, and the cost probe uses a
temp dir holding copies read from the stick.

| file | sha256 |
|---|---|
| `dev/tail-carry.js` | `e60cb44a13492903e33da8fdbae9888bb736bf1156656c1fded8ba63265bc7e5` |
| `dev/tail-carry.test.js` | `ef8d0974bdb8856e50c04aa09bc8c022ab875f1d973950da74112dd46b0cd3d9` |
| `dev/tail-carry.mutants.js` | `cb9241db1c4739d37bac689296affd80b75403fea0fb5d8e8a64358cd73d505b` |

Scratch lives at `…/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/flush/` (written `SCR/` below).

---

## 1. What was built, against the bar

**"Every file the export writes to the stick is opened, written, `fsyncSync`ed and closed before its rename."** Done
through one helper, `writeDurable(p, data)`: `openSync(p,'w')` → `writeFileSync(fd)` → `IO.fsync(fd, p)` → `closeSync`.
It is used at all three sites that put a carried file on the stick:

- `writeAtomic`, which writes the HANDOFF and the MANIFEST;
- `writeLedger`, which the import path uses too, since it rewrites the ledger on the stick;
- the tail write in `applyExport`.

`test('flush: every file an export leaves on the stick was fsynced under its temp name before the rename')` checks
every file present on the stick afterwards against a spy on the seam.

**"The containing directory is flushed where Windows allows it, and where it does not the hand-back says so from a
measurement."** I measured it with `node SCR/dirprobe.js` → `SCR/dirprobe-run1.txt`, on Node v24.14.1, Windows
10.0.26200, NTFS temp dir:

| call | result |
|---|---|
| `openSync(dir,'r')` then `fsyncSync` | **EPERM** at fsync |
| `openSync(dir,'w')` | **EISDIR** at open |
| `openSync(dir,'r+')` then `fsyncSync` | **OK** |

So directories are opened `'r+'`. At the end of every `--apply`, both export and import, `flushDirs` flushes the
tails directory, the transfer directory and the stick root. The record `[{dir, result}]` goes into the run's result
and into `--json` as a new top-level `flush` field.

- If a filesystem declines with one of `EISDIR/EPERM/EACCES/ENOTSUP/EINVAL`, the directory is recorded as
  `unsupported (<code>)` and **printed**. The run still carries, because the files in that directory were flushed and
  refusing every carry on such a stick would be a lockout.
- **Any other error is a failed flush.**
- **exFAT, the stick's filesystem, is not measured.** Measuring it means writing to the stick (§5).

**"A flush that throws turns the export's result into a named NOT DONE reason."** A failed flush raises
`FlushError`. `run()` catches only that class and returns `outcome: 'NOT_FLUSHED'`, `code: 1` (`EXIT.SEAT`), with a
`why` that names the file or directory and the error code. The human output says "NOT DONE — …" and tells the reader
not to unplug as though the carry had happened. Other exceptions still become `CRASHED`, as before. `NOT_FLUSHED` is
documented in the EXIT table under code 1.

**Both consumers already read code 1 as NOT DONE.** I read this at source and edited neither:

- the waiter prints DONE only when `obj.code === 0` (`dev/stick-waiter.js:533`);
- the app's Leave sets `done` only when `why.is_empty() && code == Some(0)`, and for a non-zero code shows
  `"{outcome} (exit {c}): {why}"` (`consonance/src-tauri/src/sync_launch.rs:1519-1575`).

A's packet this chunk traces those DONE sites independently.

## 2. Tests — red first, and red for the right reason

`node dev/tail-carry.test.js`:

| stage | result |
|---|---|
| before | **157 passed, 0 failed** |
| after | **163 passed, 0 failed** |

The six new tests are `flush: …`.

**Red first, twice.** The first run was 5 red, but only because `T.IO` did not exist. That is red for an unrelated
reason, the trap that cost me a vacuous test on D067. So I added the seam alone, with no flush calls, and re-ran. All
five were then red for their own behavioural reasons:

- "…tail reached the stick without a file flush"
- "directory not flushed: …\stick"
- "a clean export made only 0 flushes"
- `r.flush` undefined
- the import reporting something other than `NOT_FLUSHED`

The sixth test (the import directory flush) was written after mutant #100 survived. It is red under that mutant, since
#100 is now caught.

**One existing pin changed, not weakened.** Six older tests went red on `'top-level fields'`, the exact `--json` key
pin (`TOP`, `tail-carry.test.js:773`), because `flush` is a new field.

- I added `'flush'` to `TOP` with a dated CHANGED note, by the file's own precedent: `+staleLock`, 2026-09-14,
  "Additive; these lists still pin the exact shape." The pin is still exact.
- Other readers of this JSON take named fields and do not pin the set: `stick-apply.js:270`, and `sync_launch.rs`'s
  recorded fixture, which is parsed leniently.

**Neighbours, unchanged:** `node dev/stick-apply.test.js` → 48 passed, 0 failed; `node dev/stick-waiter.test.js` →
74 passed, 0 failed.

## 3. Mutants — applied / caught / NOT APPLIED

These are ten rows added to the tracked harness `dev/tail-carry.mutants.js`, ids 91–100 of 100. Each was run with
`node dev/tail-carry.mutants.js --only <id>`, which writes a copy beside the file and never touches the tracked source.
The tracked `tail-carry.js` sha256 was `e60cb44a…` before and after the run. Before any `--only` run, the harness
audits every anchor in the list, so the edit orphaned none of the 90 older mutants.

| id | mutant | result |
|---|---|---|
| 91 | the file flush **removed** | caught |
| 92 | the file flush error **swallowed** | caught |
| 93 | the export's directory flush removed | caught |
| 94 | the directory flush error swallowed as "unsupported" | caught |
| 95 | `EIO` added to the unsupported list | caught |
| 96 | `NOT_FLUSHED` exits 0 (every consumer would print DONE) | caught |
| 97 | the ledger bypasses the durable write | caught |
| 98 | a tail bypasses the durable write | caught |
| 99 | the HANDOFF/MANIFEST bypass the durable write | caught |
| 100 | the import's directory flush removed | **survived on run 1** → test added → caught on run 2 |

**Result: 10 applied, 10 caught, 0 NOT APPLIED** (run 1: 9 of 10, with #100 predicted as the survivor before the run).
Per-mutant output is in `SCR/mut-91.txt` … `SCR/mut-100.txt`. **Not run: the full 100-mutant list.** The 90 older
mutants were not re-scored against the new file, which would take about 110 minutes at this lap's measured pace.

## 4. The cost

`node SCR/cost.js 5` → `SCR/cost-run2.txt`.

- **What it ran:** the real export of the *current* set, D's live transcripts from each seat's agreed offset to its
  current size (the deltas a Leave would write right now).
- **Where:** a fresh temp "stick" on C: holding only copies of the stick's ledger and its named pending tails.
- **How:** HEAD's `tail-carry.js` against the working tree, alternating, five runs each.

**6 seats / 46,046,729 B carried per run. Median OLD 1.324 s, NEW 1.428 s: +0.104 s** (+8%). All three directories
report `flushed` in every NEW run.

**Correction on the way:** run 1 of the probe CRASHED in both versions (ENOENT in `writeTransferSet`). I had copied only
the ledger, and the manifest names the UP_TO_DATE seat's pending tail, which was not in the temp stick. That was a bug
in my probe, not in the tool; it is fixed and noted in `cost.js`.

**This number is for an NVMe/NTFS temp dir.** On the stick, a flush waits for the device. That is the whole point, and
there it will cost more. How much more is not measured, because measuring it would mean writing to the stick.

## 5. What is NOT verified

- **exFAT and the real stick:** the directory `'r+'` flush and the file fsync are measured on NTFS only. How exFAT or
  this stick answers `FlushFileBuffers` on a directory handle is unknown. If it declines, the run says `unsupported`
  out loud; it does not fail silently.
- **A real device failure:** the NOT DONE path is exercised only by an injected `EIO`. Whether a real removal or reset
  surfaces at fsync (as I expect: 09-14's errors were `VERIFY_REQUIRED` and `NO_SUCH_DEVICE`) rather than at a later
  read is argued, not demonstrated.
- **The app's Leave screen text for `NOT_FLUSHED`:** read in `sync_launch.rs`, not seen rendered. That is A's half of
  the chunk.
- **Left unflushed, deliberately:**
  - the ledger **lock** file (`takeLedgerLock`, `'wx'`): it is deleted at the end of the run and carries nothing;
  - the import's **local** writes (the transcript appends at `applyImport`, the receipt at `writeCarried`): these
    are on the machine's own disk, not the stick, and the bar names the export's stick writes;
  - **`--carry-dir`** (`applyDirCarry`, `fs.cpSync`), which also writes to the stick and prints its own CARRIED
    without a flush. It is mine, it is the same class of fault, and it is **not** changed here, because the packet
    scopes the export. It is one routing decision for the chair.
- **After a flush failure, the tool leaves the temp file behind** (e.g. `…tail.writing-<pid>`) and does not try to
  clean up on a device that just failed. `--verify-set` reports such files as `extra`. An import that fails its ledger
  flush has already appended to local transcripts; the next run settles that through the existing "tail already here"
  path. That settling path was not re-tested against this exact state.
