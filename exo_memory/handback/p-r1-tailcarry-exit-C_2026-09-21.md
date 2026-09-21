# P-R1-TAILCARRY-EXIT — C (CHARLIE), L058 R1, on L

**Packet:** `exo_memory/loop/plan_repo_fixes_2026-09-21.md` (`eb1b121`), §0 and the R1 row, read at source.
**Owned:** `dev/tail-carry.js` and `dev/tail-carry.test.js`. **Nothing committed. No stick written.**

---

## 1 · THE ANSWER FIRST: the defect does not exist at HEAD — and the two exact commands it named were never tested

**Both refusals already exit 2.** Measured on L at HEAD `eb1b121`, before any edit:

```
node dev/tail-carry.js --verify-set                         ; echo $?    -> 2
node dev/tail-carry.js --verify-set --carry-dir <dir>       ; echo $?    -> 2
```

**`dev/tail-carry.js` was not changed between the report and now** — `git-blob cb3de27d…` at `3a5fa50` (the HEAD
the librarian measured on D at 07:48, 09-20) and at `eb1b121` alike. So the report did not describe code that
has since been fixed. It described a measurement.

**The most likely mechanism, demonstrated, not proven** — the same command, four ways of reading "the exit code":

| how it was read | reported |
|---|---:|
| plain, `$?` | **2** |
| `… 2>&1 \| head -3`, `$?` | **0** — `head`'s exit, not node's |
| `… 2>&1 \| tail -2`, `$?` | **0** |
| `… \| head -3`, `${PIPESTATUS[0]}` | **2** — node's own |
| PowerShell, `$LASTEXITCODE` (plain and via `Select-Object`) | **2** |

**A POSIX pipe reports the last process's status.** The librarian's report says the commands *printed*
`code 2 · no such folder: null` and `REFUSED — …` and *exited 0* — both printed and exited are true if the
output was read through `| head` or `| tail`, which is how output is usually capped in the Bash tool. I cannot
see D's transcript from L, so this is the mechanism that **reproduces** the report, not a proof of which command
was typed.

**What the lap does instead of a fix:** no code change — there is nothing to fix and a "fix" would be
decoration. It adds the tests that could not have been written red because the defect is absent, and says so.

## 2 · REGISTERED BEFORE THE FIRST RUN — tonight's two standing items

**The quantity:** the OS exit code of `dev/tail-carry.js`. **It takes more than one value on this object**,
checked in the same run as the two targets rather than assumed:

| control | exit |
|---|---:|
| `--help` (a success path) | **0** |
| `--bogus` (a known refusal) | **2** |
| `--verify-set --stick <nonexistent>` | **2** |
| no arguments | **2** |

So a 2 on the two targets is information, not an instrument stuck at 2.

**The null**, as the packet framed it: *"the two refusals exit 0."* **The falsifier** of that null: an OS exit
code other than 0 on either target, read without a pipe between node and the reader. **It fired on both.**

## 3 · WHAT THE EXISTING 169 TESTS COULD AND COULD NOT SEE — measured, after a claim of mine was refuted

**A RETRACTION FIRST.** An earlier draft of this section said no existing test reads the process exit code, and
that changing line 1892 to `process.exit(0)` would leave all 169 tests green. **That was false**, and I found it
by scoring the mutant against HEAD's test file rather than by reading more carefully. The file already has
`tail-carry.test.js:986`, *"the process exit status IS the code — checked on a real child, not on a return
value"*, plus `:1493` and `:1500`, which spawn the CLI and assert exit 2. I had read the `J()` helper, seen that
it is in-process, and generalised from one helper to the whole file. **The suite was never blind to the exit
path.**

**What is true, and it is narrower — the two cases the packet names were never tested.** Measured by scoring the
same mutants against both test files:

| mutants | against the **169 pre-existing** tests | against **169 + my 4** |
|---|---:|---:|
| **shared exit path** (5): OS exit forced to 0 · `finish` returns 0 · `no()` returns 0 · the verify-set branch returns 0 · `--help` stops exiting 0 | **5 / 5 killed** | 5 / 5 killed |
| **the packet's two branches** (2): a null `--stick` falls through the door and crashes further in · `--verify-set` stops being refused alongside `--carry-dir` | **0 / 2 — both SURVIVE** | **2 / 2 killed** |

So:

1. **A regression in the shared exit path would already have been caught.** My four tests add nothing there, and
   I say so rather than count them as coverage.
2. **A regression in either of the two exact commands the librarian reported would NOT have been caught** — the
   two branch mutants survive the pre-existing suite untouched. That is the real gap, it is exactly the packet's
   scope, and it is now closed.
3. **`:1191` asserts only the JSON field** (`r.obj.code`), not main's return (`r.code`). True of that one test,
   and **not a gap in practice**: other tests pin main's return, which is why mutant `finish returns 0` dies
   against the old file. Left exactly as it was — it is narrow, not wrong, and the keeper's rule forbids
   modifying a test that is not verifiably wrong.

## 4 · MUTANTS — every table here is `applied / caught / NOT APPLIED`

`node consonance/tools/mutant-harness.js <rows>`, each scored in a detached HEAD worktree with the live
`dev/tail-carry.js` copied in; the harness reads cargo-shaped output, so a JS adapter (`<scratch>/r1/score-tc.js`)
copies the **live** test file in and prints one `test result:` line. `live dev/tail-carry.js unchanged: true` on
every run.

| run | rows | pre-flight | applied | caught | survived | NOT APPLIED |
|---|---|---|---:|---:|---:|---:|
| shared exit path, **live** tests (`rows-r1.js`) | 5 | green 173/0 | 5 | **5** | 0 | 0 |
| shared exit path, **HEAD** tests (`rows-r1-head.js`) | 5 | green 169/0 | 5 | **5** | 0 | 0 |
| packet's two branches, **HEAD** tests | 2 | green 169/0 | 2 | **0** | **2** | 0 |
| packet's two branches, **live** tests | 2 | green 173/0 | 2 | **2** | 0 | 0 |

The HEAD-tests runs use `score-tc-head.js`, which is `score-tc.js` with its one `copyFileSync` line removed so the
worktree keeps HEAD's 169-test file — confirmed by the pre-flight reading **169/0**, not 173.

**The row that refuted me is the second one.** I wrote mutant #1 (*"OS exit forced to 0"*) believing it would
survive the old file; it died there. That is the only reason §3 is accurate.

## 5 · THE SUITE, PLAIN AND PARALLEL

```
node dev/tail-carry.test.js                 -> 173 passed, 0 failed · exit 0     (169 before this lap)
node consonance/tools/js-suite.js           -> "ok    dev\tail-carry.test.js"
                                               105 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 110) · exit 1
```

**The four suite reds are not this lap's**: `actors.evidence.test.js`, `carrier-drift.test.js`,
`forget-rate.test.js`, `portable-paths.test.js` — each named in the plan's own §0 table, measured on L at
`961cce3` **before** this lap opened. This lap touched `dev/tail-carry.test.js` and nothing else in the suite.
*(§0 also listed `ask.test.js` red and one silent; neither appears in tonight's run — other seats' packets this
lap, not mine, and I did not verify which.)*

## 6 · WHAT WAS NOT VERIFIED

1. **Which command the librarian actually typed on D.** The pipe mechanism **reproduces** the report exactly —
   the text printed, the status 0 — but D's transcript is not on L. "Piped into `head`/`tail`" is the most likely
   cause, not a proven one.
2. **D itself.** Everything here ran on L. The file is byte-identical (`git-blob cb3de27d…`) on both, so the
   behaviour should match; I did not run it on D.
3. **The callers.** The packet's worry is callers that check the code. I did not audit `stick-waiter.js`,
   `stick-apply.js` or `sync_launch.rs` for **how** they read it — a caller that pipes before reading would
   reproduce the false 0 in production, and that is the one version of this defect that could be real.
4. **No code in `dev/tail-carry.js` changed.** Nothing to fix. So "the fix is green" has no content here; what is
   green is four pins, two of which (§3 row 2) close a real gap and two of which duplicate existing coverage.

## 7 · COMMANDS

```
# the reproduction, before any edit
node dev/tail-carry.js --verify-set                        ; echo $?          # 2
node dev/tail-carry.js --verify-set --carry-dir <dir>      ; echo $?          # 2
node dev/tail-carry.js --verify-set 2>&1 | head -3         ; echo $?          # 0  <- the false zero
node dev/tail-carry.js --verify-set 2>&1 | head -3         ; echo ${PIPESTATUS[0]}   # 2

# unchanged since the report
git rev-parse 3a5fa50:dev/tail-carry.js HEAD:dev/tail-carry.js                 # same git-blob

# the suite, plain and through the runner
node dev/tail-carry.test.js
node consonance/tools/js-suite.js

# the four mutant runs in §4
node consonance/tools/mutant-harness.js <scratch>/r1/rows-r1.js
node consonance/tools/mutant-harness.js <scratch>/r1/rows-r1-head.js
node consonance/tools/mutant-harness.js <scratch>/r1/rows-branch-head.js
node consonance/tools/mutant-harness.js <scratch>/r1/rows-branch-live.js
```
