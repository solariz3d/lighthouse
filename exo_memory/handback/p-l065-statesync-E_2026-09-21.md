# P-L065-STATESYNC — state-sync.js:141, steps 2 and 4 of my own landing order (pane E, L065, 2026-09-21)

Packet: the chair's L065. The order it executes is `handback/p-l062-rc1-E_2026-09-21.md` §4. Step 1 (L's config) is
the librarian's `78661f2`; step 3 (`close.js`) is A's and was not touched. Started 03:55:30, suite finished 04:14:05
(`date +%T`). Machine L. HEAD `78661f2` at the start, `9ee1bbb` by the end (another seat's commit).
**Nothing committed.** `git diff --numstat`: `state-sync.js` 10/3 · `state-sync.test.js` 55/0.

## 0 · Actuals, as the packet asked — not expectations

    node consonance/tools/state-sync.test.js                 78 passed, 0 failed   (was 75/0; +3 new, 0 edited)
      two concurrent runs (absolute paths, `&` … `wait`)     78/0 · 78/0
    node consonance/tools/portable-paths.js                  green — 272 files in scope, 210 known sites, 0 new · exit 0
    node consonance/tools/portable-paths.test.js             43 / 0   (was 41/2)
      node --test --test-concurrency=4 …                     43 / 0
    node consonance/tools/js-suite.js                        110 green · 0 failed · 0 crashed · 0 silent · 1 canary
                                                             · 0 not-run · 0 class-error (of 111)

**The whole js-suite is green on L, and so is portable-paths.** The expectation in the packet and the actual agree
on every line. Each actual is from the command beside it, run after both edits.

## 1 · Step 2 — `arrivalCtx` stops resolving a state dir it does not need. DID §4'S PREDICTION HOLD? YES.

`reconcileInstall` passed `(over && over.state) || stateDir()` into `arrivalCtx`, so every reconcile resolved the
state dir, including reconciles with no transformed path, which never read it. The only reader of `ctx.state` in
the file is the transformed-path branch (`grep -n "ctx\.state"` → one hit, the arriving copy's re-read). The fix:
`arrivalCtx(DATA, (over && over.state) || null, v, over)`, and that one branch resolves lazily,
`ctx.state || stateDir()`. Inside its existing try, an undeclared state dir there becomes a named TRANSFORM
shortfall for that path, not a crash of the whole reconcile.

**THE CAN-IT-VARY PROBLEM, and how it was answered.** Step 1 put `state_dir` into L's config, so on L the six
`reconcileInstall` tests pass **whether or not step 2 lands**. On L's real config the prediction cannot be falsified
at all. So it was run where it can fail: a **D-like home**, which is L's `~/.consonance.json` with only `state_dir`
removed (`scratchpad/l065/home`; keys `base, flags, instances, room_path, instances_dir, data_dir, ambient_*,
machine_tag`). That is D's actual situation tonight, per the packet.

    D-like home · :141 refusing · step 2 REVERTED (a scratch copy, repo layout)   71 passed, 7 failed
       the SAME six as R-C1 §3 — "reports the whole set present…", "NAMES BY PATH…", "reads the destination…",
       "distinguishes a SHORT file…", "catches right-length-wrong-bytes…", "names a directory standing…"
       + the new L065 step-2 test
    D-like home · both steps (the live files)                                        78 passed, 0 failed
    real L config · both steps                                                       78 passed, 0 failed

**The six went green with no test edit**, exactly as §4 said. I also cannot claim a stronger form of the prediction
than I registered: §4 said "go green with NO test edit", and nothing more.

## 2 · Step 4 — `:141` refuses, its test moved into `state-sync.test.js`, red before and green after

`stateDir()` now ends in `throw new Error('no state dir declared: set state_dir in ~/.consonance.json or
CONSONANCE_STATE. Nothing was read and nothing was sent.')` where it used to return the literal.

Three tests, appended under `L065 (pane E)`. Each runs in a child with an **empty home** and **no `CONSONANCE_*`
variables**, so the machine's own config cannot answer for the code:
- *nothing declared → stateDir() REFUSES and names state_dir, never a guessed drive path*: the moved R-C1 §3 proof
- *~/.consonance.json state_dir resolves, and CONSONANCE_STATE wins over it*
- *an ordinary install reconciles with NO state dir declared — only a transformed path needs one*: step 2's property

    RED    step 2 in, :141 still the literal     77 passed, 1 failed
           FAIL L065: nothing declared → … : got {"ok":"C:\\Consonance\\state"}
    GREEN  both                                  78 passed, 0 failed
    RED for the step-2 test: only under the D-like home with step 2 reverted (§1), which is the only condition that
           can turn it red while :141 is refusing.

**Mutants.** The runner is named by path: `scratchpad/l065/mutants.js`. It mutates a copy in `scratchpad/l065/m/`
(repo layout) and runs every row under the D-like home.

    GREEN 78/0 pre-flight
    KILLED 77/1  :141 literal restored
    KILLED 77/1  :141 refusal stops naming state_dir
    KILLED 71/7  step 2 reverted (eager stateDir)
    KILLED 73/5  the transformed branch loses its lazy fallback  ← I expected this to SURVIVE; the CLI roster tests
                                                                    reach that branch with no explicit state
    KILLED 77/1  config state_dir ignored
    5 listed · 5 killed · 0 survived

**Live on L after the change:** `node -e "require('./consonance/tools/state-sync.js').stateDir()"` →
`C:\Consonance\state`, now from `~/.consonance.json:19` and not from a literal. The app's launch pull and
`close.js` on L resolve exactly as before.

## 3 · Corrections, including mine

- **My first "parallel" state-sync run was void twice.** First, `( … &)` detached the job, so I read its tail before
  it finished (it printed a git warning as its "result"). Then `cd … && node A & node B & wait` put the `cd` into A's
  background subshell, so B, the suite and `git diff` ran from the wrong directory. That produced `error: Could not
  access 'consonance/tools/state-sync.js'`, which for a moment read as a vanished file. It was checked with `ls -la`,
  and the file was intact. The reported concurrent pair (78/0 · 78/0) comes from the absolute-path re-run.
- **§4 of R-C1 said the six tests "go green with no test edit"** without saying under which config. Once step 1
  landed on L, that claim became untestable on L. I only noticed because the packet asked whether it held. The
  D-like home is the correction. A prediction about a machine-dependent failure has to name the machine state that
  makes it falsifiable.

## 4 · NOT verified

- **D itself.** D still lacks `state_dir` (packet). After this lands, D's `state-sync.js` and D's launch pull and
  `close` will **refuse until D's config gets the line**. That is the intended loud state, but it is a real
  behaviour change on D, and **D needs step 1 before this commit reaches it.**
- **A's `close.js:140` change (step 3)** is A's; I did not read it or run it together with this.
- **No real `--pull` or `close` ran** against the state repo. The live resolution is shown by `stateDir()` alone.
