# P-HARNESS · ALPHA — close.mutants.js and state-sync.mutants.js no longer write a tracked file; --only on all three

**Pane A, machine L, 2026-09-15 ~05:25–06:25.** Packet `exo_memory/loop/packet_harness_and_lib_2026-09-15.md`
(1bc3299), §1. **Ported, not retired. No §5 stop.** One load path cannot be reached by any pointer, and it is measured
and named in §2 rather than built around. **B reads this.**

**Files (uncommitted):**
- `consonance/tools/close.mutants.js`, `consonance/tools/state-sync.mutants.js`: ported.
- `dev/tail-carry.mutants.js`: `--only` only.
- `consonance/tools/close.test.js`, `consonance/tools/state-sync.test.js`: the UNDER_TEST pointers.
- `.gitignore`: five lines.

**Not edited:** the tracked `close.js`, `state-sync.js`, `state-manifest.js` and `tail-carry.js`. Their `git status` is
clean after every run below. Nothing ran `close.js` for real or pushed state; every suite run is on fixtures.

---

## 1 · WHAT THE PORT IS

Both harnesses now follow `dev/tail-carry.mutants.js:36-44`, the copy pattern:

- **A copy per target, beside the real file.** `consonance/tools/.close.mutant-<pid>.js`, `.state-sync.mutant-<pid>.js`
  and `.state-manifest.mutant-<pid>.js`. They sit in the same directory so every sibling require, the spawned
  `<dirname>/state-sync.js`, and `REPO = path.resolve(__dirname,'..','..')` resolve exactly as they do for the real file.
- **The suite is pointed at the copy by environment variable.** `CLOSE_UNDER_TEST`, `STATE_SYNC_UNDER_TEST` and
  `STATE_MANIFEST_UNDER_TEST` have the `tail-carry.test.js:27-37` shape: unset means nothing changes; a path outside the
  directory, or a missing file, throws loudly.
- **No restore step and no SIGINT handler.** There is nothing to restore. A kill leaves at worst a named untracked copy
  and a lock naming a dead pid.
- **Lock.** `wx`; a live holder refuses; a dead holder's lock is taken over. **Sweep:** at start, copies named for
  dead pids are deleted.
- **The tripwire on the tracked source stays.** It now refuses without "restoring" anything.
- **Green pre-flight.** Unmutated copies with the pointers set must be green, or nothing is scored. close had none
  before.
- **Function replacement, never a string.** String replacement expands `$&`, `` $` `` and `$'`.
- **At the end, each tracked target is compared byte-for-byte with what the run read.** A difference is another writer,
  reported with exit 3 and never restored.
- **state-sync: one mutant, one copy.** Before every mutant, both copies are rewritten — the target mutated, the other
  original.
- **`--only <id>` on all three harnesses.** The id is the 1-based list position, printed before every mutant line.
  - A malformed argument (a non-integer, a missing value, a repeated `--only`, anything else) exits 2 BEFORE the lock
    is taken.
  - An id outside 1..N exits 2 AFTER the lock and the sweep, then unlocks. *(Corrected per B §4: the first draft said
    "before the lock" for both. So an out-of-range id run while another run holds the lock reports the lock, not the
    id. Harmless, and not changed.)*
  - A NOT APPLIED mutant says `NOT APPLIED` on its own line and in the summary.
  - The summary reads `N run of M total (--only id)`.
- **The mutant lists are byte-identical to HEAD** in both ported harnesses (the slice from `const MUTANTS = [` to `];`,
  compared with `git show HEAD:`).

**One behaviour kept, and said out loud.** The in-place state-sync harness applied a mutant whenever its anchor occurred
anywhere, replacing the FIRST match. Measured with `scratchpad/anchor_counts.js`:
- close: 10 of 10 anchors are unique; tail-carry: 90 of 90.
- state-sync: 47 of 50. #11 "verify accepts any sha256" and #12 "verify accepts any size" occur twice; #13 "verify
  treats a missing file as present" occurs three times.

Switching state-sync to tail-carry's exactly-once rule would silently turn three measured mutants into NOT APPLIED. So
the port keeps first-match for state-sync, and those lines print `(first of N matches in state-sync.js)`. close and
tail-carry keep exactly-once.

## 2 · THE LOAD PATHS — measured before the pointers went in, then measured again with them

**Read at source first:**

    close.js          close.test.js: require(TOOL) · spawned `node TOOL` (:357) · and two source-text reads of TOOL
                      (the "no flag turns the gate off" and "does not touch the record repository" tests) — missed in my
                      first draft, found by B §1; they also go through TOOL, and a hook that watches loads cannot see a read
    state-sync.js     state-sync.test.js: require(TOOL) · spawned `node TOOL` in run() · readFileSync(TOOL) text check (:742)
    state-manifest.js state-sync.test.js: require(path) (:822, the classErrorsFor / VALID_ARRIVAL tests) · spawned
                      `node <path>` CLI (:749) · AND state-sync.js's own `require('./state-manifest.js')` (state-sync.js:84)
    no test in either suite lists consonance/tools (the two readdirSync calls read fixture dirs)

**Then measured with a preload hook.** `scratchpad/loadpath_hook.js` goes into EVERY node process of the suite through
`NODE_OPTIONS=--require`. It logs each load of the three modules, as main script or require, with the resolved file.
Each suite was run once with its pointers on unmodified copies (`scratchpad/loadpath_probe.js`):

    close.test.js       24 passed, 0 failed
      close.js           COPY main 1 · COPY require 1 · TRACKED 0
      (state-sync.js TRACKED main 24 / require 2, state-manifest.js TRACKED require 26 — not close's targets)
    state-sync.test.js  75 passed, 0 failed
      state-sync.js      COPY main 95 · COPY require 1 · TRACKED 0
      state-manifest.js  COPY main 1 · COPY require 1 · TRACKED require 96

**What that establishes, and the one thing it shows no pointer can reach:**
- Every load of `close.js` and of `state-sync.js` in its suite is the copy.
- `state-manifest.js` is the copy on the two paths the test file owns. It is the TRACKED file on 96 loads, every one of
  them the internal `require('./state-manifest.js')` inside `state-sync.js`: 95 spawned CLIs plus the in-process require.
  *(Corrected per B §1.)* My first draft said reaching that path "means editing the tracked `state-sync.js`". Not quite:
  the harness writes the state-sync COPY itself and could rewrite that line there. What blocks it is a test.
  `state-sync.test.js` asserts the tool's source contains the literal `require('./state-manifest.js')`, so a rewritten
  copy would turn every manifest mutant into a false kill. A resolution hook would keep that text honest; none is built
  (§7). **So a manifest mutant whose ONLY
  witness goes through state-sync.js reads SURVIVED, never killed.** It fails loud, in the safe direction. The header of
  `state-sync.mutants.js` and the test file both say so.
- All five manifest guards are exercised today through the direct `manifestMod.classErrorsFor` calls
  (state-sync.test.js :911, :917, :925, :931, :1076). The full run (§3) is the check that they are killed through the
  pointed path.
- **A second copy of `state-manifest.js` (the copy plus the tracked file) is live in the same test process during a
  manifest mutant.** The one cross-module comparison, :944 `Object.keys(M.ARRIVAL_TRANSFORMS)` against
  `manifestMod.VALID_ARRIVAL`, compares values, not identity. No manifest mutant touches VALID_ARRIVAL.

## 3 · PROOF — both harnesses to completion, F1 watched throughout

**F1 instrument.** `scratchpad/f1_watch.js` runs beside the harness (`scratchpad/drive_harness.js`). Every 250 ms it
runs `git hash-object` on each tracked target and compares it with the value at the start. It stops when the harness pid
is gone. At the start each target's hash equalled `HEAD:<path>`.

    node consonance/tools/close.mutants.js
      close.mutants.js: 10 killed, 0 survived, 0 not applied, 10 run of 10 total        exit 0
      F1: 545 polls over 150 s, 0 dirty · close.js baseline == HEAD

    node consonance/tools/state-sync.mutants.js
      state-sync.mutants.js: 50 killed, 0 survived, 0 not applied, 50 run of 50 total   exit 0
      the three first-match lines: "killed  #11 verify accepts any sha256  (first of 2 matches in state-sync.js)",
        "#12 … (first of 2 …)", "#13 verify treats a missing file as present  (first of 3 …)"
      all five state-manifest.js mutants killed through the pointed path (so none relies on the unpointed one)
      F1: 7,010 polls over 2,040 s, 0 dirty · state-sync.js and state-manifest.js baselines == HEAD

**Compared with the record, checked rather than assumed:**
- state-sync's in-place harness last recorded "50 killed, 0 survived, 50 total" (`handback/p-roster-arrival_2026-09-09.md`),
  the same count as the ported run.
- For `close.mutants.js` I found no recorded in-place count to compare with (grep across `exo_memory/`), so 10/10 here
  stands on its own.
- (A first draft of this paragraph said both matched "the librarian's collations". I had not checked; this is the
  checked version.)

## 4 · F2 — a real kill mid-mutant

`scratchpad/f2_kill.js` does four things:
- starts the harness and waits until at least one mutant is scored and its named copy exists, so the copy holds a
  MUTANT, not the pre-flight original;
- waits 1.5 s more, inside the next suite run, and runs `taskkill /F /PID <harness>`;
- reads `git diff` / `git status` on the tracked targets, and what was left behind;
- then runs the harness once more, to show the sweep.

    close.mutants.js    pid 26524 · killed after 33 s with 1 mutant scored
                        taskkill: "SUCCESS: The process with PID 26524 has been terminated."
                        git diff --stat on close.js: (empty) · git status: (clean)
                        left: .close.mutant-26524.js (18,319 B, differs from close.js: it holds the mutant) ·
                              lock "26524 2026-09-15T11:37:17.502Z"
      next run (--only 2): "taking over a lock left by pid 26524, which is not running (a killed run)."
                           "swept a copy left by killed run pid 26524: .close.mutant-26524.js"
                           1 killed · afterwards 0 copies, close.js clean

    state-sync.mutants.js  pid 16096 · killed after 80 s with 1 mutant scored (so inside #2's suite run)
                        taskkill: "SUCCESS: The process with PID 16096 has been terminated."
                        git diff --stat on state-sync.js and state-manifest.js: (empty) · git status: (clean)
                        left: .state-sync.mutant-16096.js (72,131 B, holds the mutant) ·
                              .state-manifest.mutant-16096.js (16,056 B, the original, since #2 targets state-sync.js) ·
                              lock "16096 2026-09-15T12:11:55.066Z"
      next run (--only 1): "taking over a lock left by pid 16096, which is not running (a killed run)."
                           "swept a copy left by killed run pid 16096: .state-manifest.mutant-16096.js"
                           "swept a copy left by killed run pid 16096: .state-sync.mutant-16096.js"
                           "1 killed, 0 survived, 0 not applied, 1 run of 50 total (--only 1)" · exit 0 ·
                           afterwards 0 copies, 0 locks, both tracked files clean

**F2 did not fire for either harness:** no tracked source changed, and every kill left named copies.

## 5 · F3 — --only against real runs

    close.mutants.js --only 3        "killed  #3 the DEFERRED retry is removed" · "1 killed, 0 survived, 0 not applied, 1 run of 10 total (--only 3)" · exit 0
    close.mutants.js --only 0 / 11   "--only N is not a mutant; ids are 1..10." · exit 2
    close.mutants.js --only abc      "--only needs a mutant id (a positive integer); got abc" · exit 2
    close.mutants.js --only          "... got nothing" · exit 2 — and after all four refusals: 0 copies, no lock
    tail-carry.mutants.js --only 91  "--only 91 is not a mutant; ids are 1..90." · exit 2
    tail-carry.mutants.js --only 1   "killed  #1 THE SPEC AS WRITTEN: …" · "1 run of 90 total (--only 1)" · exit 0

**NOT APPLIED under --only** (`scratchpad/only_not_applied.js`). This runs on a scratch replica of `consonance/tools`
whose `close.js` has mutant #3's anchor changed; nothing tracked is touched.

    replica --only 3   "????  #3 the DEFERRED retry is removed  (NOT APPLIED: anchor missing)"
                       "0 killed, 0 survived, 1 not applied, 1 run of 10 total (--only 3)" · exit 1
    replica --only 4   "killed  #4 …" · exit 0   (the replica's pre-flight is green, so the replica itself works)

    state-sync.mutants.js --only 1   (the run after its kill, above) · "1 run of 50 total (--only 1)" · exit 0

**A defect in my own `--only`, found by watching another seat run it, and fixed.**
- At 12:10 a live process was running `close.mutants.js --only 3 --only 4` (pid 4676, parent 33200; B's read, by the
  board).
- My first parser took the first `--only` and silently ignored the rest. So that command ran #3 alone and said nothing
  about #4. A typo such as `--onyl 3` would have run ALL mutants without a word.
- That is F3's spirit ("runs any mutant but <id>"), even if not its letter.
- **Fixed in all three harnesses:** the only accepted argument is exactly one `--only <id>`. Anything else exits 2 before
  the lock.

    each of close / state-sync / tail-carry, with   "--only 3 --only 4" · "--onyl 3" · "3" · "--only 2 extra"
      -> "<harness>: the only argument is one --only <id>; got: <args>" · exit 2   (12 of 12) · 0 locks left

- The valid path was re-run after the fix: state-sync `--only 1` (above).
- **Order matters for the counts:** close's full run (10/10), its F2 kill and the close `--only` checks above ran
  BEFORE the fix; the state-sync full run started before it too. The fix touches only argument parsing, and no count was
  produced with a repeated or unknown argument.

## 6 · TESTS

    node consonance/tools/close.test.js         24 passed, 0 failed   (unset pointer; unchanged from before)
    node consonance/tools/state-sync.test.js    75 passed, 0 failed   (unset pointers; unchanged from before)
    CLOSE_UNDER_TEST=../nope.js close.test.js   throws "CLOSE_UNDER_TEST must name an existing file in …"
    node consonance/tools/js-suite.js           92 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 97), run after
                                                every copy was gone. The same 4 as every L run (actors.evidence,
                                                carrier-drift, forget-rate, portable-paths); close.test, state-sync.test
                                                and state-manifest.test are green inside it.
    re-run after the comment corrections in §8:  close.test.js 24/0 · state-sync.test.js 75/0 · all three harnesses
                                                pass `node --check`

## 7 · WHAT I DID NOT VERIFY

- **The one unpointed load path**, measured in §2. A future manifest guard witnessed only through state-sync.js would
  read SURVIVED. Closing it needs one of two things, neither built: a seam in `state-sync.js`'s own require, which edits
  a tracked tool; or a resolution hook in the harness, like the probe's, which was not ruled.
- **A kill during a state-manifest.js mutant specifically.** Both F2 kills landed in the second mutant: close #2 and
  state-sync #2, which targets state-sync.js.
- **A kill of the orphaned suite child.** `taskkill /F` on the harness leaves its running `*.test.js` child alive for
  the rest of that suite run, working on the named copy. The copy is untracked, so that child cannot touch a tracked
  file. The sweep on the next run may delete the copy under a still-running orphan; that is harmless.
- **Two harnesses running at once on the same directory.** Different locks (`.close.mutants.lock`,
  `.state-sync.mutants.lock`). Runs overlapped tonight (close's F2 and `--only` checks ran during the state-sync full run)
  and nothing interfered, but that is one observation, not a test.
- **Other tools that list `consonance/tools` while a copy exists.** Searched by `grep readdirSync`:
  - Filtered by name, so they never see a copy: `guard-census.js` (`*.test.js` and `.rs` only) and `js-suite.js`
    (`*.test.js`).
  - Matched by suffix, so they WOULD see a dotfile copy if run during a mutation run: `portable-paths.js` (glob by
    suffix, :186) and `gen-consumer.js` (copies directory listings, :1738).
  - That is the same exposure `dev/.tail-carry.mutant-*.js` already has.
  - Not measured, and not changed: those files are not mine, and the copies are gone when a run ends (or swept after a
    kill).
- **Anything on D.**

## 8 · B's READ (`handback/p-harness-read-B_2026-09-15.md`) — it arrived before this hand-back was finished; each point answered

B's read held F1 and F3, and F2 for close. It found F2 for state-sync not yet in evidence, because my placeholder was
unfilled when B read. It is filled now (§4): state-sync's kill left the tracked files clean.

    B §4 / minor 1  a repeated --only is silently ignored     FIXED in all three (§5). I found it the same way B did, from
                                                               the `--only 3 --only 4` process; B's read names it too.
    B §4 / minor 2  the range check runs after the lock        CORRECTED in §1's wording; behaviour unchanged, as B judges
                                                               it harmless.
    B §1 / minor 3  §2 omitted close.test.js's two source-text  ADDED to §2. Both read TOOL, so the pointer covers them.
                    reads of TOOL
    B §1            "reaching the manifest path means editing   CORRECTED in §2 and in the two code comments that repeated it
                    the tracked state-sync.js" is too strong     (state-sync.mutants.js header, state-sync.test.js header): the
                                                               blocker is the literal-require text check, which a rewritten
                                                               copy would fail.
    B §1            the port is a coverage change: the in-place  AGREED, and not in my draft in those words. The old harness
                    harness's manifest mutants were seen by all  mutated the tracked manifest, so all 96 internal loads saw
                    loads                                        it. The port reaches only the two pointed paths. Cost today
                                                                 is none (#46–#50 killed); the risk is a future guard
                                                                 witnessed only through state-sync, and it reads SURVIVED.
    B §5 / minor 4  first match is order-dependent; the output  NOT CHANGED. The line names the file and the count, not
                    gives only a count                           which occurrence; the first occurrence is the one mutated.
    B minor 5       unfinished placeholders                      FILLED.

B's own WRONG (its first F1 watcher never polled) does not touch any count here: my F1 figures come from my own watcher
(§3), not B's.
