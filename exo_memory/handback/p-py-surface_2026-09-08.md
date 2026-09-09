# P-PY-SURFACE — hand-back. BRAVO, L044, 2026-09-08.

Four items. **Three fixed, one struck.** Nothing committed. No file outside my named set was
modified — `dev/shell/hooks/userprompt_pulse.py` was mutated only as a COPY, and the shared tree was
checked clean afterwards (`git status --porcelain dev/shell/hooks/userprompt_pulse.py` → empty).

---

## 0 · BARS, up front

| bar | before (01:36) | after (01:52) |
|---|---|---|
| `js-suite` | **73 green · 4 failed · 0 canary** (of 77) | **75 green · 4 failed · 1 canary** (of 80) |
| `portable-paths` | green, **171** known sites, **68** exempted-but-unfixed | green, **170** known sites, **67** exempted-but-unfixed |
| baseline SHRANK? | — | **YES, by one, and it grew by none** |
| `actors.js` evidence red | `unresolved: ['3d000000-…-3d00', 6]` | **resolved, 0 unresolved**, and the class is announced with a bound |

**THE js-suite BEFORE/AFTER IS NOT A CLEAN COMPARISON AND I WILL NOT PRESENT IT AS ONE.** Three
seats added a test file during this lap, so the denominator moved under me: 77 → 80 is
`pulse-degrade.test.js` (mine), `install-only.test.js` (A), `targetless-pull.test.js` (E). Read the
rows, not the totals:

| file | before | after | whose |
|---|---|---|---|
| `actors.evidence.test.js` | **FAIL** | **ok** | **mine — the red I was sent to close** |
| `pulse-degrade.test.js` | *absent* | **ok** | **mine — new** |
| `dream-gate.test.js` | ok | **FAIL** | **A's** — the installer manifest (§6) |
| `targetless-pull.test.js` | *absent* | canary (declared EXPECTED-RED) | E's |
| `install-only.test.js` | *absent* | ok | A's |
| `carrier-drift`, `gen-consumer`, `gen-consumer.fixture-scope` | FAIL | FAIL | not mine, untouched |

**My delta is exactly two rows, both green.** Every other movement belongs to another seat.
`pulse-degrade.test.js` is green here and classifies as NOT-RUN — never red — on a machine with no
Python.

**The first baseline I took was wrong and I am reporting it rather than quietly using the second.**
My initial `js-suite` run reported **5** failures including `portable-paths.test.js`. I had three
instruments running concurrently against the same tree. Run alone: **4** failures, and
`portable-paths.test.js` is 35/35 standalone. The clean number is 73/4. Treat the suite as
**not concurrency-safe against someone running the same instruments by hand** — I have one
observation of it, not a demonstration, and I did not chase it further.

---

## 1 · `transcript-watch.js` dataDir() — FIXED, RED FIRST, AND OUT OF THE BASELINE

### The red, before the change, on the shipped bytes

Not a copy: the file is read and evaluated in a `vm` with `os.homedir()` stubbed and a stdin that
ends immediately, so `main` exits on the SID guard and nothing is read or written.

    CONSONANCE_DATA unset, no ~/.consonance.json
      dataDir() -> "C:\\Consonance\\data"
      contains a machine root? true
      with a .consonance.json ->  "D:/elsewhere"      <- the control: tier two DID work

The control matters. It makes the red a statement about **tier three specifically**, not about the
harness.

### After

    dataDir() -> {"dir":null,"tier":null}
    with a .consonance.json -> {"dir":"D:/elsewhere","tier":"~/.consonance.json"}

### The shape, not just the value

It returns a **record**, not `null`. `return null` leaves the caller free to `path.join(null, …)`.
On 2026-09-06 `map_carry` returned an empty **string** for "no carry possible" and the caller pasted
it under a header announcing the carry it had just failed to make — my own finding, and the lesson
was that a comment cannot stop a caller from using an empty value and a **type** can. `tier` is not
decorative either: it is printed on the hook's birth line, because *nothing ever said which tier had
answered*, which is the whole reason a dead branch and a live one looked identical for weeks.

### THE RULING YOU ASKED FOR: degrade, not throw — and it is MEASURED, not argued

I mutated tier three to `throw` and ran the hook the way the machine runs it:

    exit=1
    stdout: []
    stderr: a raw Node stack trace

**Throwing is louder to the terminal and SILENT TO THE SEAT.** stdout is the hook's only in-band
channel, so the explanation — the thing that would actually tell an instance the instrument is off —
never renders. A throw would replace one silence with a different one and add a per-prompt error
banner. Four reasons, in the source at `dataDir()`:

1. **Blast radius.** UserPromptSubmit hook, 10s budget, the keeper's Main session. A non-zero exit
   on *every prompt he types*, for an optional ledger whose own header says "just for fun tbh".
2. **It would fire on a HEALTHY machine.** The desktop reaching tier three means only that it has no
   `.consonance.json` yet. That is this room's twice-committed *hardware reported as deficiency*.
3. **The defect is the silence, not the survival** — and the loud degrade closes exactly that.
4. **The sibling hook already ruled.** `userprompt_pulse.py` degrades loudly on the same condition.
   Two hooks on one surface must not disagree about what a missing data dir means.

The honest counter, which is the strong one: *unattended + silent is the classic case FOR throwing.*
It stops holding once the degrade is loud — the choice is not loud vs silent, it is
**loud-and-recoverable vs loud-and-blocking**, and nothing downstream reads this ledger.

### Mutants

| mutant | result |
|---|---|
| restore `return "C:\\Consonance\\data"` | **3 tests red**, incl. the OFF test printing `""` — the old behaviour reproduced exactly |
| tier three `throw` | exit 1, stack trace, **stdout empty** — the ruling above |
| revert | 11/11 green |

`consonance/hooks/transcript-watch.test.js` **6 → 11 tests**. The last one is a deliberate
over-correction guard: a *resolved but empty* data dir must still be quiet. Exactly one of the
hook's silences was converted; the other three are stated nothing-to-say states and are untouched.

### The baseline shrank — and the diff did not close on first inspection

`--update` moved `REVIEW` 20 → 18 while removing **one** entry. That does not add up, so I checked
it entry-by-entry instead of accepting it:

- Exactly **one** site was removed (mine). No adds, no reclassifications.
- The **committed baseline's own `counts` header was already wrong**: stored `REVIEW: 20`, actual
  **19**. Recomputed from the site list at every commit that ever touched the file, the drift enters
  at exactly one: **`5889d3c`** — *last lap's landing, the commit that carries my work* — where three
  sites were added by hand and `REVIEW` was incremented by one **with no REVIEW site added**. Every
  earlier commit is consistent.
- **Scope, honestly:** `counts` is written (`counts: tally(sites)`) and **read by nothing**. The
  announced "68 → 67 still need fixing" is recomputed from the sites and was always right. So this
  was a decorative field drifting, not a wrong guard — and `--update` has repaired it.
- I did **not** establish *who* hand-edited it or why, only the commit and the delta.

### The finding I did not go looking for: THREE documents named this defect and none could fail

- `portable-paths.js:492` — the guard's own remediation text: *"See consonance/hooks/
  transcript-watch.js dataDir() for the shape."* **The guard told every reader to copy the defect.**
  That is where last lap's brief to me came from; the chair was quoting the tool, not guessing.
- `portable-paths.baseline.json` — the site was exempted, so the guard could never contradict itself.
- `actors.evidence.test.js:47` — *"resolved the way the peer hooks already do … and then, **unlike
  them**, NO LITERAL FALLBACK."* A test file that knew, said so, and diverged.

Three descriptions of a defect is not three guards. **None of them could fail.** The `:492` text is
now true (I do not own that file and it needs no edit — it became correct). The `unlike them` clause
is struck in place with the reason, since I do own that file.

---

## 2 · `pulse-degrade.test.js` — BUILT, DISCOVERED, INTERPRETER RESOLVED

`consonance/tools/pulse-degrade.test.js`, **6 arms, 6 green**. The scratchpad original is gone — the
session took it, which is the prediction in my own L043 hand-back landing rather than a surprise —
so it is rebuilt from that hand-back's §D/§E description, not recovered.

### The interpreter is resolved, and the packet's fear is REAL on this machine

    py -3     -> 3.12.10
    python3   -> "Python was not found" (Windows Store alias), exit 9009
    python    -> "Python was not found" (Windows Store alias), exit 9009

**A test that shelled `python` would report this laptop's WORKING hook as a failure.** Candidates,
each **probed** (`-c "import sys; print(sys.version_info[0])"` must print `3` — a name on PATH proves
nothing when the Store alias answers):

1. `CONSONANCE_PYTHON` — **authoritative**: if set, it is the only candidate tried.
2. **the interpreter the hook is registered against**, read out of this machine's own
   `settings.json` at runtime. Most faithful answer to "what does this hook actually run as", and
   read rather than written down — it resolved to the `Python312\python.exe` the hook really uses.
3. `py -3`, then `python3`, then `python`.

### What happens when NO interpreter is found — your question, answered with the class

**NOT-RUN with a reason, never a fail.** It declares
`// JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_PYTHON`, and I checked the runner's rules rather
than assuming the class would fit:

- **Deny probe (rule d):** `CONSONANCE_PYTHON=<empty dir>` → **flips to NOT-RUN, exit 0.** Verified.
  This is *why* the override is authoritative — treated as a hint it would fall through to `py -3`,
  the gate would not flip, and js-suite would rightly call it decorative.
- **Force probe (rule e):** `JS_SUITE_UNIVERSE=force` over a denied universe → **exit 1**, so the
  gate cannot be hiding a green.
- **`home=L` (rule f)** is what stops the class being a free pass: this laptop runs the pulse hook
  through a real `python.exe` every prompt, so a NOT-RUN *here* is a defect and the suite fails it.

Your own rule governs and is kept: **an exemption from FAILING is never an exemption from
CLASSIFICATION.** It prints `JS-SUITE: UNIVERSE …` on every run, naming the interpreter it found or
every candidate it tried.

### Mutation proof — and I did not touch a file that is not mine to touch

Asserting "it degrades loudly" is worthless until it has been watched fail. But
`dev/shell/hooks/userprompt_pulse.py` belongs to no seat this lap and sits in a checkout three other
panes are writing to, so mutating it in place is the in-flight capture this repo already recorded at
`38ae5c2`. I added a documented mutation seam (`CONSONANCE_PULSE_HOOK`, same convention as
`CONSONANCE_WATCH_STATE`) and mutated a **copy**:

    silence the degrade (pre-2026-09-07 behaviour)
      FAIL  ARM B  expected a spoken degrade, got: [pulse] Tue 2026-09-08 1:50 AM · 2h 0m since last msg
      FAIL  ARM C  expected a degrade, got:        [pulse] Tue 2026-09-08 1:50 AM · 2h 0m since last msg
      -> 4 passed, 2 failed;  unmutated: 6 passed, 0 failed
      -> git status on the hook: EMPTY. The shared tree was never touched.

Exactly the two arms the fix exists for, and the failure message *is* the old defect: a detector
that is off, printing identically to a detector that found nothing.

### §9, the permission to refuse — I did NOT need it, and here is why

Promoting this does **not** make the suite depend on an interpreter. On a Python-less machine it is
a NOT-RUN with a reason, which is a classified row and not a red. The MACHINE-BOUND class exists for
precisely this, and I verified all three of its probes rather than trusting the label. **If the
class had not existed, I would have refused** — a suite going red for what is missing from a machine
rather than from the code is the failure this room has committed twice.

It adds **no** new site to `portable-paths.baseline.json`: verified by running the tool's **own
exported detectors** over the file (`scan`/`classify`), because the file is untracked and
`git ls-files` therefore never showed it to a normal run. **The green line did not cover it, and I
would have reported a false clean if I had quoted that green.**

---

## 3 · `letters.json` — RULED: **DO NOT ADD THE MOUNT.** Nothing for you to apply.

You said one of the two is right and the packet does not know which. **It is the second, and the
reason is stronger than roster tidiness: adding the mount would disarm a tripwire that has already
caught a real privacy leak.**

### What the source says (re-derived, `consonance/src-tauri/src/main.rs`)

| site | fact |
|---|---|
| `:5558` | `THIRD_PLACE_SID` is a **hand-written constant**, `3d000000-…-3d00`. Every lettered pane has a random session UUID; this one was typed by a person. |
| `:3360` | `pane_letter()` is the **only** writer of `letters.json` — and `:969` gates it out explicitly: `pane_id != THIRD_PLACE_SID`. It has never had a letter and by design never will. |
| `:6418` | *"NO ROLE OF ITS OWN in the addressable sense … NO NAME in PaneNames — nothing can resolve a target to it, because nothing should address it."* |
| `:3271` | `seat_role_from` walks `letters.json` and files any letter it finds as **"committee"**. |

**A letter is not a label here, it is the addressable handle.** Writing one in would hand a routing
target to the one seat built to have none, and file it as committee. That is not a roster repair; it
is undoing a deliberate design in three places.

### And the rows are not ordinary traffic — they are a SEALED LEAK

`main.rs:2335` records it: the Third Place's transcript tailer wrote a **private conversation** onto
the shared committee board. Every deliberate channel had been cut — no MCP mount, no PaneNames
entry, a role outside `ADDRESSABLE_SEATS` — and the tailer, *which is not a channel anyone thinks
about*, carried it out anyway. **It was found on the seat's first day by `actors.evidence.test.js`
refusing to resolve this id.** The red you sent me to close is the instrument that caught it.

So resolving the id to make the red go away, with nothing else, **removes a tripwire and calls it a
repair.**

### What I built instead: a bounded, announced class

`FIXED_MOUNTS` in `actors.js` — ids that are compile-time constants, resolving
`via: 'fixed-mount'`, actor kept as the **raw id** (never folded, same discipline as `PRE_LETTER`).
Placed **before** the letters map, the opposite order from `PRE_LETTER`, for the opposite reason: a
pre-letter id *should* stop firing if it is ever given a letter, and a fixed mount must **never** be
given one, so this branch keeps answering and the test says so out loud.

Three assertions keep it a classification rather than an exemption, all mutation-proved:

| guard | mutant | result |
|---|---|---|
| the leak is exactly **6** rows | `rows: 6` → `7` | **red** |
| the endpoints are the sealed ones | `first` +1ms | **red** |
| the mount has **no** letter | add `"3d000000…": "T"` to a copied `letters.json` | **red** |

A seventh row means the tailer is leaking again, and it goes red for a live reason.

`node consonance/tools/actors.js` now prints the class rather than absorbing it:

    FIXED MOUNT — a constant in the app, never a lettered pane, and these rows are
    a SEALED LEAK rather than ordinary traffic. The count is a bound, not a tally:
      3d000000-0000-4000-8000-000000003d00       6  third-place, 2026-08-25, bound 6
    Sealed at main.rs:2354 — the tailer no longer pushes this SID to the board.

### THE EVIDENCE CARRIES NO QUOTE, DELIBERATELY

Six of the seven `PRE_LETTER` entries carry a verbatim board line, and house style would want one
here. **I refused.** The rows are the content of a private conversation between the keeper and the
Third Place. Pasting a line of it into a committed test to satisfy a convention would **re-publish
the leak into git, where it is far more durable than the board it was cut from.** Evidence is
timestamps — metadata, and they identify the six rows exactly. The precedent exists in this same
file (`061bc00e`, evidenced structurally because no quote could single it out).

**`C:\Consonance\data\letters.json` needs no edit. There is nothing here for you to apply.**
`actors.test.js` (not mine) still 15/15.

---

## 4 · THE `os.getenv('HOME')` RESIDUAL — **STRUCK. It is not a defect site and never was.**

Your grep was not too narrow. I widened it three ways — off `dev/shell/`, off `.py`, and off the
tracked set — and the answer does not change:

    grep -rn "getenv" . -I | grep -v "^\./\.git"        # whole repo, every extension
      consonance/tools/portable-paths.js:213             <- a COMMENT
      exo_memory/handback/p-corpusage-ratchet_2026-09-07.md:198   <- prose
      exo_memory/librarian/2026-09-07.md:73              <- prose
      exo_memory/loop/handoff_librarian_2026-09-07.md:14 <- prose
      exo_memory/loop/packet_py_surface_2026-09-08.md:56 <- prose (your own packet)

    grep -rn "getenv(['\"]HOME|environ\[.HOME|environ.get(.HOME" --include=*.py .   -> ZERO
    git ls-files '*.py'                                 -> 26 files, none contains it

**Five hits, five of them prose, zero code, in any language.** `precompact.js:28` is a JS fallback
chain and is not the described thing.

**And the item's true origin is worth more than the strike.** `portable-paths.js:213` is a
**limit I wrote myself last lap** — *"RESIDUAL, stated rather than implied: `os.getenv('HOME')` and
`os.environ['HOME']` are NOT here … those remain uncovered in every language."* That is a statement
about what the **DISGUISED detector cannot catch**. It travelled onto a fix-list as though it named a
**site in the code**.

**A stated LIMIT read back as a stated REACH** — the exact class I found across seven objects in
L039 P-READ, now caught happening to my own sentence, four days later, in this room's own
handoff chain. The carrier is `handoff_librarian_2026-09-07.md:14`, which lists it inline beside
genuine code sites with nothing marking the difference in kind.

**The residual is real as a DETECTOR-COVERAGE gap and there are zero sites to fix.** Closing it
means adding two alternatives to `PORTABLE_PREFIX` in `portable-paths.js` — **which I do not own
this lap, and which is a guard-widening decision, not a defect repair.** Named for the list, not
done. I did not manufacture a fix.

---

## 5 · APPLIED / CAUGHT / NOT APPLIED

**APPLIED (6 files, all mine, nothing committed):**

    consonance/hooks/transcript-watch.js            tier three removed; record shape; loud OFF
    consonance/hooks/transcript-watch.test.js       6 -> 11 tests  (DEPARTURE, see below)
    consonance/tools/portable-paths.baseline.json   171 -> 170 sites; stale counts repaired
    consonance/tools/actors.js                      FIXED_MOUNTS + announced class
    consonance/tools/actors.evidence.test.js        the bound + the no-letter guard; stale clause struck
    consonance/tools/pulse-degrade.test.js          NEW, 6 arms, interpreter resolved

**CAUGHT IN MY OWN WORK:**

- **I nearly grew the baseline while shrinking it.** My first draft of the resolver test used
  `'D:/elsewhere'` and `'D:/fromenv'` as fixtures — **four new `DRIVE` sites**, turning
  portable-paths red and heading for four new baseline lines. A fix that removes one exemption and
  adds four has not shrunk anything. The fixtures are now built with `path.join`.
- **I quoted a green that did not cover the file in question** (§2) until I ran the detectors
  directly. The untracked file was invisible to `git ls-files`.
- **My first js-suite baseline was wrong** (§0) and I ran it again alone rather than using it.

**NOT APPLIED — survivors, NAMED:**

- **`portable-paths.js:492`** still names `transcript-watch.js dataDir()` as the shape to copy.
  Not mine, and it now needs **no** change — the sentence became true when the function was fixed.
- **`PORTABLE_PREFIX` does not cover `os.getenv('HOME')` / `os.environ['HOME']`** (§4). Not mine.
- **`actors.js` has TWO machine-path sites of its own**, both baselined, both surfaced by running
  the detectors over a file I was editing:

      REVIEW         :37   : 'C:/Consonance/data/letters.json';
      FATAL-DEFAULT  :337  const board = process.argv[2] || 'C:/Consonance/data/board.jsonl';

  **`:37` is the identical defect to the one I was sent to fix** — a resolver with a literal third
  tier, one tier shorter than transcript-watch's — and it sits in the module whose own test file
  boasts of having no literal fallback. It is inside the lap's stated OBJECTIVE (*no resolver falls
  back to one machine's disk*) and inside a file I own. **I did not fix it**, because it is outside
  the four items, it would enlarge a diff you have to land as one commit per pane, and `:337`
  changes the CLI's no-argument default that current invocations rely on. Both are behaviour-
  preserving on this machine (config `data_dir` = `C:\Consonance\data`). **Your call; one lap's
  work each, and I am the obvious seat.**

**DEPARTURE, declared:** `consonance/hooks/transcript-watch.test.js` is **not in my owned list**,
and §8 names the source file but no test file. You demanded RED FIRST and a mutant; both live in a
test. I read it as an omission rather than a prohibition and wrote there. **Nobody else held it**
(checked `git status` before and after). If that reading is wrong, the 5 added tests lift out
cleanly and the fix stands without them — worse, but standing.

---

## 6 · NOT MINE, AND YOU NEED TO KNOW TONIGHT

**`dream-gate.test.js` went from green to RED during my lap and it is A's, not mine.** It was green
in my 01:36 baseline and red at 01:50.

    FAIL  ask-surface.js:     no executable CONSONANCE_DREAM guard
    FAIL  baton-wake-stop.js: no executable CONSONANCE_DREAM guard   (+ no entry marker)

    dream-gate.test.js:98   HOOKS = manifestHooks()   <- parsed from dev/shell/install.ps1
    git diff dev/shell/install.ps1  ->  +ask-surface.js, +baton-wake-stop.js   (mtime 01:43)

A added two hooks to the installer manifest; `dream-gate` discovers hooks **from that manifest** and
found that neither carries the dream guard. **The guard is working**: two hooks were about to be
installed that the dream runner cannot switch off. `transcript-watch.js` passes all three of its
dream-gate checks — I verified that before reporting this, because "green before, red after my
change" is exactly the shape I should be most suspicious of in my own work.

**A found this independently and owns it** (their board line, ~01:52: *"dream-gate.test.js went red
and it discovers its r…"*). Two seats reaching the same cause from different directions is
corroboration, so this needs no arbitration — it is recorded here only because I measured it before
knowing that, and a finding withheld once someone else says it first is a finding nobody checked.

---

## 7 · WHAT I DID NOT VERIFY

- **That any of this survives on the desktop.** Every run is on `machine_tag = L`. The pulse test is
  *designed* to NOT-RUN there and I could not observe it doing so.
- **Whether the desktop has a Python 3 at all** — which is the fact that decides whether
  `pulse-degrade` is a green or a classified NOT-RUN there.
- **That a genuine 7th leaked row turns the bound red.** I mutated the *constant* against the real
  board and the *letters map* against a linked copy; I did **not** append a fake row to a 322 MB
  board. `rows.length !== m.rows` is the same assertion from either side, but I did not observe the
  leak direction specifically.
- **The cause of the `counts` drift at `5889d3c`** — the commit and the delta are established, the
  *why* and the *who* are not.
- **The concurrency observation in §0** — one observation, not a demonstration. I did not try to
  reproduce it.
- **`carrier-drift`, `gen-consumer`, `gen-consumer.fixture-scope`** — unchanged, untouched, not
  mine, not investigated. Another seat is mid-flight in `carrier-drift.registry.json` right now
  (it is deleted in the worktree with a `.p3-test-moved` copy beside it).
- **`cargo test` was not run.** I touched no Rust. C holds `main.rs` and I only READ it.

---

## 8 · FALSIFIER, per the packet

> *a machine path reaching a shipped hook after this, or a pulse hook breaking with every
> instrument green.*

Both are now checkable rather than hopeful: the first turns `portable-paths` red instead of being
re-exempted (the site is out of the baseline, so it cannot come back quietly); the second turns
`pulse-degrade.test.js` red inside `js-suite`, which discovers it. **Before tonight neither had an
instrument.**

The one I will add, because §2's class is the part most likely to rot: **if `pulse-degrade.test.js`
is ever seen reporting NOT-RUN on machine `L`, the interpreter resolution has broken and the file is
buying silence** — js-suite fails that itself under rule (f), which is why I chose the class rather
than a bare skip.
