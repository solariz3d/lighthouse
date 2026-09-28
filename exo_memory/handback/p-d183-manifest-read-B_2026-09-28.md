GREEN. The two files, uncommitted in lighthouse: `consonance/state-manifest.json` (sha256 `f1176a8d237012ae…`) and `consonance/tools/state-sync.test.js` (sha256 `96e86a01ea086f55…`). Both hashes equal A's and did not change during my run.

# P-D183-MANIFEST-READ · B's non-author read of `handback/p-d183-manifest-A_2026-09-28.md`

**Pane B, 2026-09-28 03:01–04:17 local.** Read-only in the repo. Nothing committed, published or pushed.
- One locked run: `scratchpad d183m/run.js`, every node process at `--max-old-space-size=4096`, both directly and through NODE_OPTIONS.
- It waited 71 minutes for the lock. The first hold gave up at 30 minutes while C's full suites ran back to back (posted to the board at
  about 04:02); the retry got the lock at 04:15.
- `close-read-B` was already written, so this is a new file, as the packet allows.

## The five checks
| check | command / evidence | result |
|---|---|---|
| **the rule matches its neighbours' form; nothing else in the manifest changed** | `git diff consonance/state-manifest.json` → one `+` line at :113, after `stick-apply.result.json`. `git diff --stat` on the two files → 1 and 24 insertions, 0 deletions. `node -e` over the `stick-*` rules: all six have keys `glob,class,why`, class `STAYS` | **PASS.** Class vocabulary: the manifest has no `LOCAL` class, so the packet's "LOCAL" is `STAYS` here, which is what the neighbours use. The "why" cites real lines: `sync_launch.rs:1391` (`LEAVE_RESULT`) and `:1593` (the write); `dev/stick-waiter.js:78` and `:305` (the read) |
| **the new test fails on the OLD manifest and passes on the new one** | old: a copy of `consonance/tools` (with the new tests) beside `git show HEAD:consonance/state-manifest.json` (`4de664e8…`); new: the live tree | **PASS.** Old: `137 passed, 3 failed`, and the 3 are exactly the D183 tests. Test 1's receipt is `"outcome":"REFUSED_UNPLACED"`, `"paths":["stick-leave.result.json"]`; test 2's paths come back as both files; test 3 reads `undefined`. New: **`140 passed, 0 failed`**, exit 0 |
| **a path matching no rule is still refused (the guard untouched)** | `git diff --quiet HEAD -- consonance/tools/state-sync.js` → no diff (sha256 `fd504f6d…`); test 2 on the new manifest | **PASS.** `REFUSED_UNPLACED` naming only `a-path-nobody-ruled.json`. I did not re-run A's mutants; M4, the guard removed, is A's |
| **the state-sync tests pass under the lock at 4096** | `state-sync.test.js` → 140/0; `state-manifest.test.js` → **45 passed, 0 failed** | **PASS** |
| **no real publish or push was run** | `C:/Consonance/data/state-sync.push.json` mtime is still 02:07:37 local, the app's own refused close, before A's work. The state repo head is `79e3c01` (09-24). `git reflog refs/remotes/origin/main`: last `update by push` was 2026-09-27 19:11. The test runs are `--push --no-remote --dry-run` on temp dirs (`%TEMP%\statesync-*`) | **PASS** |

## Not established
- **That a real close now publishes.** A §4 says the same: other gates (the cap, divergence, privacy) may still refuse on the real data
  dir. The rule takes effect at the app's next launch, as the chair says.
- **`stick-leave.started.json` is still unruled** (A §4). If a Leave's STARTED removal ever fails, or a publish runs while a save is
  live, the next publish would be refused the same way. It is a separate call, and the same STAYS shape would fit.
- Nothing here bears on the Close button (`p-d183-close-read-B`).
