# P-HEAVYRUNMUT-B: D289 part 1, heavy-run's two surviving mutants (pane B, machine D, 2026-10-11)

**DONE. Commit `7b717f8a` on branch `d289-b`** (worktree `G:\b-d289-wt`, from main `ba6d7f68`). Not pushed. It touches 3 files, all mine by the packet:
- `consonance/tools/heavy-run.js`
- `consonance/tools/heavy-run.test.js`
- `consonance/tools/heavy-run.mutants.js`

Both survivors were **missing tests, not equivalent mutants**. One was also a defect in the code.

## #16: the put-back judged a raced lock by kill(0) alone. A defect, now fixed
- **What it guarded:** in `takeIfStale`, after the stale lock is renamed aside, a lock with a different token means another runner wrote it between our read and our rename. The condition put it back only when `alive(moved.pid)`.
- **Why the check was wrong:** a moved lock that kill(0) reads dead was thrown away on that one reading, even if it was young. D283's rule is that a lock younger than `YOUNG_MS` is taken only when tasklist also says the holder is gone. The racer's lock skipped that rule.
  - Removing the check (mutant #16) is the safer code: the lock is put back, and the next poll judges it through the full rule, second witness included. It costs one poll. It also stops the old misattribution, where `took_over` named the lock we had read, not the one we removed.
- **The row:** `D289 a race: a YOUNG lock caught by the rename is not thrown away on kill(0) alone; …`.
  - An old holder dies, kill(0) reads it dead, and that read alone is allowed to take it. Between the read and the rename, a racer's young lock replaces it. kill(0) reads the racer dead too, but tasklist says RUNNING.
  - The waiter must time out naming the racer. The racer's lock must be put back exactly, tasklist must have been asked about it, and nothing may be left set aside.
- **The fix:** `&& alive(moved.pid)` is removed (`heavy-run.js:205`), and both the comment there and the header (:46-47) now say so.
- **The harness:** mutant #16 is inverted. It now ADDS the old check back ("race: the moved lock is judged by kill(0) alone …"), which the new row catches. The numbering is unchanged.

## #30: `r.error` in the tasklist check. Not redundant, now pinned
- **The equivalence question:** in every common failure, spawnSync returns `status: null` along with the error, so `r.status !== 0` already returns "cannot tell". If that always held, the mutant would be equivalent.
- **Measured, and it does not always hold** (`scratchpad/d289b/probe.js`, `probe2.js`; `probe.out`, `probe2.out`):
  - A missing binary, a bad cwd, a timeout on a live child and ENOBUFS all return `status: null`.
  - **A child that exits 0 while a process it started still holds its stdout** returns `{"error":"ETIMEDOUT","status":0,"signal":null,"stdout":"partial"}` (node v24.14.1).
  - So with `r.error` dropped, partial output that stops before the pid's row would read as "gone", and a running young holder could be taken.
- **The row:** `D289 pidGone: a call that timed out after tasklist exited 0 (error set, status 0, partial output) is "cannot tell", not gone`. It checks that exact shape with three partial stdouts: empty, another pid's row, and a cut-off row. The code under test is unchanged.

## Runs (all under the heavy-run lock via `scratchpad/d273/run.js`, which loads main's heavy-run.js by absolute path; `--test-concurrency=1`)

| run | tree | result |
|---|---|---|
| `node --test consonance/tools/heavy-run.test.js` (`red-test.out`) | ba6d7f68 code + new rows | **46 pass / 1 fail**: the D289 race row ("it did not take the racer's lock") |
| the same (`green-test.out`) | 7b717f8a content | **47 / 0** |
| `node consonance/tools/heavy-run.mutants.js` (`green-mut.out`, 1,220 s) | 7b717f8a content | control 47/0; **70 applied · 70 caught · 0 survived · 0 NOT APPLIED**. #16 pass 46 fail 1 CAUGHT; #30 pass 46 fail 1 CAUGHT |
| `node --test consonance/tools/portable-paths.test.js` (`pp.out`) | committed 7b717f8a | **43 / 0** |

- The baseline for comparison is A's table (`handback/p-mutantscopy-A_2026-10-10.md:25`): 70 applied, 68 caught, 2 survived (#16, #30).
- The `--only 16` and `--only 30` runs before the fix had a red control (46/1, from the new row), so they show nothing. The caught #30 comes from the full run after the fix.
- Logs: `scratchpad/d289b/`.
- No existing row was weakened. The D283 race row (a LIVE racer is put back) is unchanged and still green.

## Finding beyond the ask (not fixed, for a ruling)

**F1: an UNREADABLE moved lock is thrown away, and two runners can then share one slot.** This is inferred from reading the code. No test.
1. Waiter W reads a stale lock. Meanwhile X takes it over and claims the slot with `openSync(file, 'wx')`, so the file exists but is still empty.
2. If W's rename lands between X's open and X's write, `readLock(aside)` sees an empty file, so it reads `unreadable`. The condition `!moved.unreadable` then skips the put-back, and W unlinks the file and claims the slot.
3. X writes to its open fd, and its clash check scans every slot except its own (`heavy-run.js:243`, `if (j === k) continue`), so it never sees W. Both run.
- The window is microseconds wide.
- A likely fix: treat an unreadable moved lock as another runner's lock being written, and put it back. One exception is needed: when `h` was itself unreadable, the moved file may be the same old file, and it should be taken.
- Same family as #16, but it is not a surviving mutant, so I left it for a ruling.

## Corrections to myself
- **W1:** two one-line `node -e` calls ran outside the lock: a line-ending check and the in-place source edit. Neither was a test run.
- **W2:** my first probe run passed the scratchpad path to node in Git Bash form (`/c/...`), so node resolved it against `G:` and found nothing. I re-ran it with the Windows path.

NEXT: librarian read this, rule on F1; the chair lands `7b717f8a` (independent of C's ledger-union part).

---

# F1 follow-up (D289 F1, 2026-10-11 ~03:2x): an unreadable moved lock is put back

**DONE. Commit `2db943ee` on branch `d289-b2`** (worktree `G:\b-d289b2-wt`, from main `b8b52bbd`). Not pushed. It touches the same 3 files: `heavy-run.js`, `heavy-run.test.js` and `heavy-run.mutants.js`.

## The condition: I argue the ruling's is too narrow, and took a stricter one
- **The ruling:** put an unreadable moved lock back unless the lock first read (`h`) was itself unreadable.
- **Why that is too narrow:** suppose `h` is an OLD junk lock. Racer X also judges it stale, takes it over, and opens its own claim with `wx`, empty for now. Our rename then moves X's empty claim. Both reads are unreadable, so the ruling's condition takes it, and two runners share the slot again. Row 2 below is exactly this, and mutant #72 (the ruling's condition) fails it.
- **What I did instead:** an unreadable moved lock gets the rule every unreadable lock already gets, `UNREADABLE_GRACE_MS` by mtime. The rename keeps the file's mtime.
  - Younger than the grace, it is put back and judged at the next poll.
  - Older, it is taken. So the old junk file the first read saw is still taken, as the ruling wants: the existing D283 unreadable row stays green, and mutant #73 (always put back) shows taking a junk lock would otherwise never end.
- **If the aside vanishes before its age is read,** it counts as fresh: we try to put it back and judge it at the next poll. **This branch is not pinned by any row.** Nothing reaches it without another seam, so I added no mutant that could only survive.

## The seam and the rows
- **The seam:** `beforeTake({ slot, file })` fires just before the rename (`heavy-run.js`, in `takeIfStale`), beside the existing `beforeClaim`. It is test-only and changes no behaviour.
- **The racer is a real `wx` handle,** so after the put-back (`linkSync` to the same file) its write lands in the slot, as on a live machine.
- **The rows:**
  1. `D289 F1 a race: another runner's claim caught between its wx open and its write …`. A dead old holder, then the racer's empty claim swapped in. The waiter times out, the racer's record is in the slot, and nothing is left set aside.
  2. `D289 F1 the same race when the lock first read was itself an OLD unreadable lock …`. The same, behind a junk lock, through `beforeTake`.
  3. `D289 F1 a claim being written this instant … is waited for without ever being moved aside`. `beforeTake` fires 0 times.
     - Why it is needed: my first full harness run left **#69 SURVIVED** ("unreadable: a lock being written this instant is taken at once"), because the new put-back rescued the claim.
     - But that mutant moves the claim aside and back on every poll. In that gap a third runner can claim the slot, the put-back then fails, and the claim being written is lost. So the first-read grace check is not redundant, and this row pins it.

## Runs (all under the lock via `scratchpad/d273/run.js`, main's heavy-run.js by absolute path; logs `scratchpad/d289b2/`)

| run | tree | result |
|---|---|---|
| `heavy-run.test.js` (`red-test.out`) | the seam + rows 1–2 only, with the old condition | **47 pass / 2 fail**: rows 1 and 2, "the waiter did not claim the racer's slot" |
| full mutants (`green-mut.out`) | condition + rows 1–2 | 72 applied · 71 caught · **1 survived (#69) · 1 NOT APPLIED (#16**, whose anchor was the line F1 changed) |
| `--only 16`, `--only 69` (`q-mut*.out`) | + #16 re-anchored, + row 3 | both CAUGHT (49 pass / 1 fail) |
| `heavy-run.test.js` (`q-test.out`) | final | **50 / 0** |
| full mutants (`full-mut.out`, 1,244 s) | final | control 50/0; **73 applied · 73 caught · 0 survived · 0 NOT APPLIED** (#71: 48/2, #72: 49/1, #73: 49/1) |
| `portable-paths.test.js` (`pp.out`) | committed 2db943ee | **43 / 0** |

- The three new mutants are **appended at the end** of the list (#71–73), so #1–70 keep the numbers earlier hand-backs cite.
- **#16 is re-anchored** on the new condition (`: moved.token !== h.token)) {`), and its meaning is unchanged.
- No existing row was weakened.

## Corrections to myself
- **W3:** my first full run's NOT APPLIED #16 was my own doing: I changed the line its anchor named. It is re-anchored, and it is caught.

NEXT: librarian read this, and say whether the stricter condition stands over the ruling's; the chair lands `2db943ee` on top of `594b05e2`.
