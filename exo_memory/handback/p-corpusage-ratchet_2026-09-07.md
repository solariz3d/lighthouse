# P-CORPUS-AGE RUNTIME + `.py` INTO THE RATCHET — hand-back. L043.

**BRAVO (`5bf9d657` / `12fb81f6`), 2026-09-07 ~04:35–05:35. ~60 minutes.**
Packet: `exo_memory/loop/packet_corpusage_ratchet_2026-09-07.md` (`c3fb748`).
Dossier row consulted: B — the arithmetic and self-limiting design.

---

## 0 · THE HEADLINE

**§1 — I took neither route. The bound is not raised and there is no index.** Both offered routes
treat the runtime as a fact to be accommodated. It was 1,443 `git log` subprocess spawns, and the
same answer comes back from 3. **137.7 s → 4.76 s, with three more tests than before**, no assertion
touched, `js-suite.js` not opened.

**§2 — the gap was real, it had already been used, and closing it surfaced two more.** The ratchet
was shown blind on a `.py` fixture before anything changed, then shown red on the identical
mutation. The first run over newly covered files found **one live site** — a hard-coded
`C:\Consonance\data` in a hook that runs on every prompt. Extending scope then exposed that
**half the guard's own exemption announcements were silent**: it said `FATAL` (34) where `--fatal`
counted `FATAL|DISGUISED|REVIEW` (68).

**The tree is left with `portable-paths` RED, on purpose.** See §2.6 — one line closes it and the
line is not mine to run.

---

## 1 · `corpus-age.test.js` — BEFORE, CAUSE, AFTER

### 1.1 BEFORE, with the command

    cd /c/Consonance/lighthouse
    { time node consonance/tools/corpus-age.test.js > /tmp/ca_before.out 2>&1 ; } 2> /tmp/ca_before.time

    real 2m17.765s          duration_ms 137679.4943          tests 9 · pass 9 · fail 0

**GREEN at 137.7 s against `js-suite.js:151`'s `TIMEOUT_MS = 120000`.** One precision worth having:
it is not "reported as a failure by comparing durations". `runFile()` passes `timeout: TIMEOUT_MS`
to `execFileSync`, so at 120 s the process is **killed** and `js-suite.js:292` records
`code = 'timeout/signal'`. **The test never finishes under the suite at all** — the suite has never
seen those 9 passes.

### 1.2 THE CAUSE — it was never bytes, and that is why "index the scan" was the wrong question

Per-case timings from the same run:

    a proposal needs BOTH unreferenced AND stale ...   92,065.9 ms   (2 review() calls)
    referenced files are never proposed ...            45,511.4 ms   (1 review() call)
    the other seven cases, together                        ~26.0 ms

**~45.9 s per `review()`.** Profiled directly:

    node -e "... ca.mdFiles('loop') ... 20 per-file git log spawns ..."
      mdFiles(loop): 481 files in 30 ms
      referenceBlob: 987 listed, 9,992,709 chars in 74 ms
      20 per-file git log spawns: 2048 ms -> 102 ms each -> x481 = 49.3 s per review()

`ageDays(rel)` ran `git log -1 --format=%ad --date=format:%s -- <rel>` **once per file**. 481 files
× 3 `review()` calls = **1,443 subprocess spawns at 102 ms each ≈ 147 s.** That is the whole test.

**The corpus-growth mechanism the packet named is exactly right, and its unit is spawns, not bytes:
every file added to `loop/` costs three more processes.** The packet's "214 files" is the top-level
count (`ls exo_memory/loop/*.md | wc -l` → 229 today); the walk is recursive and sees **481**.

One batched call over the same pathspec:

    time git log --format='%H %at' --name-only -- exo_memory/loop/     ->  real 0m0.170s

### 1.3 THE CHANGE — `ageDaysMap(dir)`, one `git log` per directory

`consonance/tools/corpus-age.js`: `ageDays(rel)` replaced by `ageDaysMap(dir)`, called once at the
top of `review()`; the row builder reads the Map. `%at` is the author date in epoch seconds, which
is precisely what `%ad --date=format:%s` was. Newest-first output means the first sighting of a path
is its last commit — the same answer `-1` gave.

**Why this is not the index the packet warned about, stated because the warning was correct.** There
is no cache file, no timestamp to compare, nothing written to disk, and nothing that can read fresh
while being stale. Git is still the only source and is still consulted on every run. **The only
thing that changed is how many processes it takes to ask.** A stale index that reads fresh is the
failure I have found three of; this construction cannot have it because there is nothing to go
stale.

**The limit, stated in the source and here:** `--name-only` prints nothing for a merge commit, so on
a repo with merges a file last touched by a merge would read as never-committed → `null` days →
never proposed (the safe direction). This repo has none — `git log --merges --oneline | wc -l` → **0**
— but that is a property of the history, not of the function, and it is what to re-check if it
changes.

### 1.4 AFTER, with the command

    { time node consonance/tools/corpus-age.test.js > /tmp/ca_after.out 2>&1 ; } 2> /tmp/ca_after.time

    real 0m4.834s           duration_ms 4761.2105            tests 12 · pass 12 · fail 0

**137,679 ms → 4,761 ms — 28.9×** — and against the 120,000 ms bound it now sits at **4.0%**, so the
falsifier ("the runtime crosses the bound again within ten laps") would need the corpus to grow 25×.
The two heavy cases are now 2,720.1 ms and 1,442.7 ms.

The CLI too: `time node consonance/tools/corpus-age.js --dir loop --days 30` → **1.544 s**, output
unchanged in shape (capacity block, tiers, candidate list, caveat).

### 1.5 CORRECTNESS — checked exhaustively, not sampled

A rewrite justified by a speed number has to prove it returns the same answer. All 481 files, batched
map against the old per-file command:

    node -e "... for each file: git log -1 --format=%ad --date=format:%s -- rel  vs  ages.get(rel) ..."
    -> checked 481 files · disagreements 0 · both-null 0

**Three tests added** to `corpus-age.test.js`, none of them touching an existing assertion:

    the batched age map returns exactly what the per-file git log returned   (5-file live cross-check, ~250 ms)
    a file with no commits is absent from the age map, not aged zero          (the null path -- treating
                                                                              "unknown" as 0 or as very old
                                                                              would change what gets ARCHIVED)
    every value in the age map is a non-negative integer number of days       (a mis-parsed timestamp)

### 1.6 WHAT I DECLINED TO DO IN §1, and why each is a refusal rather than an omission

- **Did not raise the bound, and did not open `js-suite.js`.** It was on my owned list conditionally
  and the condition never arose.
- **Did not build an index.** Answered above.
- **Did not memoize `referenceBlob`.** It is 74 ms. Three calls are 0.22 s of a 4.76 s test — 4.6%.
  Caching it would add process-lifetime state to save nothing measurable, and state that is correct
  only while the corpus does not change mid-run is precisely the stale-read shape I just refused in
  the larger case. **Leaving it alone is the same judgement, applied to my own convenient optimisation.**

---

## 2 · `.py` INTO THE RATCHET

### 2.1 RED FIRST — the guard shown blind, before anything changed

Script: `<scratchpad>/py_ratchet_proof.js`. It builds a fixture with a clean `.py` under
`dev/shell/hooks/`, baselines the tree green, then writes one machine path into that `.py`, and asks
two guards the identical question — a copy with `EXTS` reverted, and the guard as it now stands.

    ===== PRE  — EXTS = .js/.rs/.ps1 =====
    baseline-clean exit : 0  (green, as required)
    portable-paths: green — 2 files in scope, 0 known sites, 0 new
      universe: 1 code (git ls-files under SCOPE_IN, .js/.rs/.ps1)
    after mutation exit : 0
    names the .py?      : false
    VERDICT             : BLIND — a machine path in a live .py ships unseen

    ===== POST — EXTS = .js/.rs/.ps1/.py =====
    portable-paths: RED — 1 machine-specific path(s) not in the baseline
      DRIVE  FATAL-USER
        dev/shell/hooks/userprompt_pulse.py:3
        STATE = os.environ.get('CONSONANCE_DATA') or 'C:\Users\zackn\Consonance\data\pulse.json'
    after mutation exit : 1
    names the .py?      : true
    VERDICT             : CAUGHT — the ratchet fires on .py

    RED-FIRST HELD: true

**The guard named its own blindness in its own output the whole time** — `universe: 1 code
(… .js/.rs/.ps1)`. That is the third instance of one shape in this lap, found by three seats
independently: `cite-check`'s "guards only formatted figures", `carrier-drift`'s two extensions, and
this. **A guard whose universe silently excludes a live file type reads exactly like a guard that
found nothing** — and in all three cases the tool was saying so and nobody was reading it.

### 2.2 WHAT ENTERED SCOPE — one file, and it is the one the packet named

    node -e "<inScope with .py added over git ls-files>"
    -> NEWLY IN SCOPE with .py added (1):
         dev/shell/hooks/userprompt_pulse.py

The other 25 tracked `.py` files sit outside `SCOPE_IN` (`dev/live/`, `dev/harness/`,
`consonance/src-tauri/icons/`, `exo_memory/`) and stay out. **One file is the honest number** and I
am not dressing it up: the extension is small, and the site it caught is not.

### 2.3 THE FIRST RUN, AS A LIST — three sites, one of them real

    node consonance/tools/portable-paths.js          -> EXIT 1

    1  DRIVE / BENIGN-TEST   consonance/tools/portable-paths.test.js:483
       my own new fixture string. Belongs in the baseline, per the guard's own advice.
    2  DISGUISED             consonance/tools/portable-paths.test.js:503
       my own new fixture string. Same.
    3  DRIVE / REVIEW        dev/shell/hooks/userprompt_pulse.py:180
       _hw = os.path.join(os.environ.get("CONSONANCE_DATA", r"C:\Consonance\data"), "head-watch.jsonl")

**Item 3 is a live one-box default in a hook that runs on every prompt.** Not a fixture, not a test
constant. **The gap was not hypothetical — it had already been used**, and the packet asked for an
empty list to be reported honestly if that is what came back. It is not what came back.

### 2.4 THE SECOND FINDING — the DISGUISED detector could not read Python, and my own test caught it

I wrote three tests. The third went **red**: `os.path.expanduser('~')` glued to a machine segment
passed clean. `PORTABLE_PREFIX` was written in JavaScript idiom — `os.homedir()`, `homedir()`,
`home()`, `USERPROFILE`, `HOMEPATH`, `sysdrive()`, `$HOME`.

**A scope extension whose detectors cannot read the language it just admitted is the same
false-green one level up**, and it would have shipped as "`.py` is covered now". `\bexpanduser\(`
added, with the reason in the source. `Path.home()` and `USERPROFILE` were already reachable.

**Residual, stated rather than implied:** `os.getenv('HOME')` and `os.environ['HOME']` are still not
covered — `\$HOME\b` matches the shell form only. That is true in every language, not only Python,
and I did not fix it because I could not test it against a real instance of the shape in this repo.

### 2.5 THE THIRD FINDING — exactly half the exemptions were announced by nothing

`--fatal` filtered `FATAL* | DISGUISED | REVIEW`. The green line counted `FATAL*` alone. Two
expressions, one concept, and they disagreed. On this repo:

    node consonance/tools/portable-paths.js --fatal
    -> 68 shown of 171 · {"FATAL-DEFAULT":25,"BENIGN-TEST":91,"REVIEW":20,"DISGUISED":14,
                          "BENIGN-MESSAGE":5,"FATAL-USER":7,"BENIGN-FIXTURE":7,
                          "FATAL-TEST-READ":1,"FATAL-SHIPPED-INSTRUCTION":1}

`FATAL*` = 25 + 7 + 1 + 1 = **34 announced, of 68 owed. Exactly half silent** — in the three lines
whose own comment reads *"exempted reads exactly like fixed. Say the number on every run, green or
not."*

**Found only because of the `.py` extension:** the one real site it surfaced is a `REVIEW`, so
baselining it would have made it invisible. That is what forced the question.

Both call sites now read one named predicate, `needsFixing`, so they cannot drift again. The green
line on a fully baselined tree (run against a **temp** baseline; the committed one untouched):

    portable-paths: green — 218 files in scope, 171 known sites, 0 new
      universe: 188 code (git ls-files under SCOPE_IN, .js/.rs/.ps1/.py)
              + 30 shipped prose from 15 bundle.resources entr(ies) ... · 0 skipped
      68 baselined site(s) still need fixing (FATAL/DISGUISED/REVIEW) — exempted, NOT fixed.

**34 → 68.** Nobody chose that number and it came back worse than it read before.

### 2.6 WHY THE TREE IS LEFT RED, and the one line that closes it

`portable-paths.baseline.json` is **not on my owned list**, and neither is
`dev/shell/hooks/userprompt_pulse.py`. So:

- I did **not** run `--update`. Two of the three new sites are my own test fixtures and belong in the
  baseline by the room's own convention (91 `BENIGN-TEST` entries are already there). The third is a
  live defect, and absorbing it into a baseline is a decision for whoever owns that hook — not a
  side effect of my packet.
- I did **not** edit the hook.

**The order matters and it is why §2.5 had to land first:** before today, baselining
`userprompt_pulse.py:180` would have silenced it completely. Now it will be announced on every green
run as *"still need fixing … exempted, NOT fixed"*. **So `--update` is now safe to run, and was not
this morning.** The call is the chair's:

    node consonance/tools/portable-paths.js --update     # 3 sites; 2 fixtures, 1 real and now audible

Two pre-existing tests are red until that runs — `the real repo is green against its committed
baseline` and the exemption-line test. I re-pointed the **wording** of the second (the sentence it
asserts genuinely changed, for the reason in §2.5) and left its `code === 0` assertion untouched, so
the red keeps saying the one true thing: **the baseline is owed an update.** The property was
re-pointed, never relaxed.

### 2.7 TESTS ADDED — four, in `portable-paths.test.js`

    a .py under SCOPE_IN is in the universe at all
      -- asserts the printed UNIVERSE, not the verdict. The blindness was invisible in the verdict.
    THE .py MUTATION PROOF: a machine path in a hook that runs every prompt turns it red
      -- green -> mutate -> red naming the file -> restore -> green.
    the DISGUISED shape is caught in .py too, not only in .js
      -- the test that went red and produced §2.4.
    a baselined REVIEW site is ANNOUNCED on a green run — exempted must not read as fixed
      -- and it asserts the two counts are EQUAL, so --fatal and the green line cannot drift again.

Their own fixture (`pyFixtureRepo`), deliberately not the shared `fixtureRepo()`: adding a `.py`
there would have put a second file in scope and **silently defused** the existing
`a green run over ZERO files is refused` test. That is the hand-written-list failure in miniature and
I nearly walked into it.

---

## 3 · `js-suite` — the count, and what moved

    node consonance/tools/js-suite.js
    -> js-suite: 71 green · 6 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 0 not-run
                 · 0 class-error  (of 77)

**What moved: `corpus-age.test.js` is no longer in the failed list.** It was being killed at 120 s;
it now completes in 4.8 s with three more cases. That is the packet's objective at suite level.

The six reds:

    consonance/tools/portable-paths.test.js         MINE, deliberate — §2.6, one --update closes it
    consonance/tools/actors.evidence.test.js        not mine
    consonance/tools/carrier-drift.test.js          not mine  (expected 25 — a corpus count; note that
                                                     exo_memory/review/ appeared untracked tonight)
    consonance/tools/gen-consumer.fixture-scope.test.js   not mine
    consonance/tools/gen-consumer.test.js           not mine
    consonance/tools/librarian-cite.test.js         not mine

**Evidence for "not mine", rather than assertion:** none of the five requires either file I changed —

    for f in actors.evidence carrier-drift gen-consumer.fixture-scope gen-consumer librarian-cite; do
      grep -o "require('\./[a-z0-9.-]*'" consonance/tools/$f.test.js; done
    -> ./actors.js · ./carrier-drift.js · ./gen-consumer.js · ./gen-consumer.js · ./librarian-cite.js

**And an honest caveat on the whole count: the tree is being edited live by four other seats right
now** (`git status --porcelain` shows C's `main.rs`, A's `cite-check.*`, E's `harvest_guard.rs`
alongside my four). Two runs of `js-suite` eight minutes apart returned 5 failures and then 6 —
`librarian-cite` appeared between them and I did not touch it. **This number is a reading taken on a
moving tree and should be re-run when the lap files.**

---

## 4 · WHAT I DID NOT DO

- **Did not chase the five other reds.** Not my files this lap, and A/C/E are live in three of them.
- **Did not touch `js-suite.js`.** The bound stands at 120,000 ms, unmodified and unread except to
  diagnose §1.1.
- **Did not verify that `ageDaysMap` behaves on a repo WITH merge commits.** Stated as a limit in
  the source and in §1.3; unreachable from here because this repo has none.
- **Did not extend `.py` coverage to `dev/live/`, `dev/harness/` or `exo_memory/`.** Those are
  outside `SCOPE_IN` for reasons already stated in that file, and widening `SCOPE_IN` was not asked
  for and is a bigger decision than an extension list.
- **Did not add `HOME` env-read forms to `PORTABLE_PREFIX`** (§2.4 residual).
- **Did not measure whether the 68 owed sites are individually still real.** The number is the
  baseline's own verdicts, re-counted; some of the 20 `REVIEW`s may be benign on inspection. **The
  count is honest and the triage has not been done**, and reading 68 as "68 live defects" would be
  the overstatement.
- **Did not commit.** Four files dirty, all mine, all on the owned list.

---

## 5 · THE ONE-LINE VERSION

    §1  REFUSED both offered routes. The cost was 1,443 git subprocess spawns, not corpus bytes;
        one batched `git log` per directory returns a bit-identical answer for all 481 files.
        137.7 s -> 4.76 s, 9 -> 12 tests, bound untouched, no index, nothing to go stale.
    §2  The ratchet was blind to .py, shown blind before it was fixed, and the first run found a
        live machine path in a hook that runs every prompt. Closing it exposed that half the
        guard's own exemption count was silent (34 announced of 68 owed) -- which is why the
        baseline update is now safe and was not this morning.

    FALSIFIER (the packet's): the runtime crosses 120 s again within ten laps -- it is at 4.0% of
    the bound, so the corpus would have to grow 25x; or a .py machine path passes the ratchet
    after this -- three tests now fail if it does, and one of them asserts the universe line
    itself rather than the verdict.

Nothing committed. Files touched: `consonance/tools/corpus-age.js`, `corpus-age.test.js`,
`portable-paths.js`, `portable-paths.test.js` — all four on the owned list.

— BRAVO (`5bf9d657` / `12fb81f6`)

---
---

# APPENDED 2026-09-07 ~05:55 — THE ONE SITE, FIXED. Not baselined.

**Chair's follow-up: fix `dev/shell/hooks/userprompt_pulse.py:180` the way the peer hooks do; run
the ratchet before and after; show what it prints when the data dir is absent; do not baseline it.**
~25 minutes. Owned this pass: `dev/shell/hooks/userprompt_pulse.py`,
`consonance/tools/portable-paths.baseline.json`.

## A · THE RATCHET, BEFORE AND AFTER

    BEFORE   node consonance/tools/portable-paths.js
             portable-paths: RED — 1 machine-specific path(s) not in the baseline
               DRIVE  REVIEW
                 dev/shell/hooks/userprompt_pulse.py:180
                 _hw = os.path.join(os.environ.get("CONSONANCE_DATA", r"C:\Consonance\data"), "head-watch.jsonl")
             EXIT=1

    AFTER    node consonance/tools/portable-paths.js
             portable-paths: green — 218 files in scope, 171 known sites, 0 new
               universe: 188 code (git ls-files under SCOPE_IN, .js/.rs/.ps1/.py)
                       + 30 shipped prose from 15 bundle.resources entr(ies) ... · 0 skipped
               68 baselined site(s) still need fixing (FATAL/DISGUISED/REVIEW) — exempted, NOT fixed.
             EXIT=0

**Green because the code changed, not because the baseline did.** Checked rather than asserted:

    node -e "const b=require('./consonance/tools/portable-paths.baseline.json'); ..."
    -> baseline sites: 171 · userprompt_pulse entries: 0

I ran no `--update`. `portable-paths.baseline.json` shows modified in `git status` — that is the
chair's three-fixture baselining from before this leg, not mine.

## B · THE DEFECT WAS WORSE THAN "IT HAS A HARD-CODED FALLBACK"

    echo $CONSONANCE_DATA                                  -> (empty)
    node -e "...require(homedir()+'/.consonance.json')..."  -> data_dir = "C:\\Consonance\\data"

**On this machine tier one was empty and there was no tier two, so the hard-coded literal was not a
fallback — it was the live code path, on every prompt, on the only machine that runs this hook.** It
returned the right answer only because the literal happened to match the config. Change `data_dir`
in `~/.consonance.json` and this hook keeps reading the old directory, finds no ledger, and — under
the old `except Exception: pass` — reports that identically to *"no restart happened."*

That is the case the chair's 09-02 refusal on `commit-gate.js:316` was protecting, and he was right
to hold the line here: a baselined entry would have read green while the hook silently pointed at
a directory nobody uses.

## C · WHERE I DEPART FROM THE INSTRUCTION, AND WHY — the peer pattern does not do what its own advice says

The brief said *match `transcript-watch.js dataDir()` rather than inventing a fourth pattern.* Its
tiers one and two are exactly right and I copied them. **Its third tier is the same defect:**

    sed -n '/function dataDir/,/^}/p' consonance/hooks/transcript-watch.js
      const env = envOverride("CONSONANCE_DATA"); if (env) return env;
      try { ...JSON.parse(readFileSync(homedir()/.consonance.json)) ... if (d) return d; } catch (_) {}
      return "C:\\Consonance\\data";                      <-- tier three

And the guard already knows:

    node -e "...baseline.sites.filter(/transcript-watch/)..."
    -> REVIEW   consonance/hooks/transcript-watch.js   |   return "C:\\Consonance\\data";

**It is a baselined REVIEW site of its own — one of the 68.** So the guard's printed advice ("env,
then `~/.consonance.json`, then degrade LOUDLY") and the file it names as *the shape* disagree, and
copying the shape whole would have reproduced the defect I was sent to remove. **Tiers one and two
are the peer pattern; tier three is the advice.** That is not a fourth pattern — it is the stated
three-tier pattern, implemented completely for the first time. `transcript-watch.js` is A/C
territory tonight and I did not touch it; it is now a named, checkable follow-up rather than a
baseline entry nobody re-reads.

**And the escape hatch the brief offered does not apply:** reading `~/.consonance.json` from Python
needs no machinery at all — `json` and `os` are already imported at lines 23–24, and the whole tier
is six lines. I am declining the "tier one only, but loud" answer because it was not necessary, not
because it would have been wrong.

## D · THE CHANGE

`_consonance_data_dir()` returns `(path, tier)` or `(None, None)` and never raises — this hook must
not break the pulse. At the call site the resolution result is acted on rather than swallowed:

- **dir unresolvable** → `_degraded = "restart detection OFF: CONSONANCE_DATA unset and
  ~/.consonance.json has no data_dir"`
- **dir resolves, ledger absent** (`except FileNotFoundError`) → `_degraded = "restart detection
  OFF: no head-watch.jsonl under the <tier> data dir"`. Same class one layer in: before, an absent
  ledger read exactly like *no restart*.
- **ledger present but malformed** → still quiet, deliberately. The per-row parse already skips
  junk and that is the block's stated fail-open case.

**Loud means the pulse line**, which is the one surface this seat reads every single turn — louder
here than stderr, which nothing watches.

**Scoped honestly:** the ROW 10 block's header already declares *"FAILS SILENT AND OPEN … no stdin,
no transcript, no ledger → no line."* That stated limit covers three states where there is genuinely
nothing to say. **An unresolvable data dir is not one of them** — it means the detector is off for
the whole session — so it is the one silence I converted, and the other three are untouched.

## E · WHAT IT PRINTS — four arms, isolated `HOME`, nothing on the real machine touched

`<scratchpad>/pulse_degrade_proof.js`. Each arm builds a temp HOME, seeds a prompt two hours back so
the restart check actually runs, and reads the hook's own `additionalContext`.

    A · config has data_dir, ledger present   (the normal machine)
        [pulse] Mon 2026-09-07 5:51 AM · 2h 0m since last msg · this gap crosses a restart ->
        open exo_memory/cards/claim-your-continuity.md before claiming or denying continuity

    B · no env, config has NO data_dir        (THE BAR: the data dir is absent)
        [pulse] Mon 2026-09-07 5:51 AM · 2h 0m since last msg · restart detection OFF:
        CONSONANCE_DATA unset and ~/.consonance.json has no data_dir

    C · config resolves, ledger missing       (dir fine, detector still off)
        [pulse] Mon 2026-09-07 5:51 AM · 2h 0m since last msg · restart detection OFF:
        no head-watch.jsonl under the config data dir

    D · CONSONANCE_DATA set, ledger present   (tier one still wins)
        [pulse] ... · this gap crosses a restart -> open exo_memory/cards/claim-your-continuity.md ...

A and D are byte-identical to the old behaviour on a working machine — **the degrade costs the
normal path nothing.** B and C are the states that used to print nothing at all.

**One defect in my own first draft, caught by running it:** the marker began `[pulse]`, so arm B
printed `[pulse] … · [pulse] restart detection OFF`. The whole line already opens with it. Fixed,
with the reason in the source so nobody re-adds it.

## F · THE GAP I AM LEAVING, said rather than skipped

**There is no regression guard on any of this.** `js-suite` discovers `.js` only; there is no
harness for `dev/shell/hooks/*.py`, and the four-arm proof above lives in a session scratchpad that
will not survive. So the fix has a *proof* and no *test* — and this room's own repeated finding is
that a guard nobody runs is indistinguishable from one that never existed.

The concrete close, cheap and not mine to place this pass: keep `pulse_degrade_proof.js` as
`consonance/tools/pulse-degrade.test.js` (it is already Node, already isolated, already asserts by
comparing printed lines) so `js-suite` discovers it. It needs a Python interpreter path resolved
rather than hard-coded — which, given what this leg was about, is the joke and also the requirement.

## G · SUITE

    node consonance/tools/js-suite.js
    -> js-suite: 73 green · 4 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 0 not-run
                 · 0 class-error  (of 77)

    node consonance/tools/portable-paths.test.js  ->  tests 35 · pass 35 · fail 0

**`portable-paths.test.js` is green** — both tests that were deliberately red last leg are closed:
the repo is green against its committed baseline, and the exemption line reads the re-pointed
wording. `librarian-cite.test.js` also cleared between runs; not mine either way.

The four remaining reds — `actors.evidence`, `carrier-drift`, `gen-consumer.fixture-scope`,
`gen-consumer` — are unchanged from §3 and none of them requires a file I have touched.

## H · WHAT I DID NOT DO

- **Did not baseline it.** That was the whole point and it is checkable: 0 `userprompt_pulse`
  entries in the baseline.
- **Did not touch `consonance/hooks/transcript-watch.js`** — not mine, live in another seat, and
  now a named follow-up (§C) instead of a silent 1-of-68.
- **Did not fix the other 67 owed sites**, and did not triage them. Same statement as §4: that
  count is the baseline's own verdicts re-counted, not 68 confirmed live defects.
- **Did not add a Python test harness** (§F) — the proposal is there, the placement is a call above
  my paths.
- **Did not verify the hook end to end against the REAL `~` and the real pulse state.** Arm A is an
  isolated equivalent; the true confirmation is the next real turn's `[pulse]` line, and if it
  carries a `restart detection OFF` marker on a configured machine then I am wrong and it is
  visible immediately — which is the point of putting the degrade there.
- **Did not commit.** Two files dirty from this leg, both on the owned list, and the baseline's
  modification is the chair's.

    FALSIFIER for this leg: a machine-specific path re-enters `userprompt_pulse.py` and the ratchet
    stays green — checkable by re-running it; or the pulse shows `restart detection OFF` on a
    machine whose `~/.consonance.json` carries a valid `data_dir`, which would mean tier two is
    misreading and arm A is not the case I think it is.

— BRAVO (`5bf9d657` / `12fb81f6`)
