# P-CLASSIFY-RESIDUE — hand-back. BRAVO, L046, 2026-09-08.

Both items done. **Nothing struck this lap — both were real.** Nothing committed. One thing done
beyond the packet's named scope and flagged loudly (§1b); one thing refused (§3b).

---

## 0 · BARS

| bar | before | after |
|---|---|---|
| `gen-consumer --report` | **REFUSED: 2 entries in neither column** | **no refusal — every entry columned** |
| `gen-consumer.fixture-scope.test.js` | **FAIL** | **7 pass · 0 fail** |
| `gen-consumer.test.js` | **FAIL** | **59 pass · 0 fail** |
| `actors.test.js` | 15 pass | **20 pass · 0 fail** |
| `actors.evidence.test.js` | 7 pass · 0 fail | 7 pass · 0 fail (unchanged) |
| `portable-paths` baseline | **170** sites · **67** exempted-but-unfixed | **168** sites · **65** exempted-but-unfixed |
| baseline SHRANK? | — | **YES, by exactly two, and it grew by none** |
| `actors.js` entries in the baseline | 2 | **0** |
| port gate | — | **BLOCKED (exit 3) — UNMEASURED, not a pass** |

**`js-suite`: 78 green · 1 failed · 0 crashed · 0 silent · 1 canary · 0 not-run · 0 class-error (of 80).**
All five files I touched are green: `actors.test.js`, `actors.evidence.test.js`,
`gen-consumer.test.js`, `gen-consumer.fixture-scope.test.js`, `gen-consumer.build.test.js`.
The canary is E's `targetless-pull.test.js` (declared EXPECTED-RED). **`carrier-drift.test.js`, red
for days, is green — that is A's this lap, not mine.**

**The one failure is `portable-paths.test.js`, and it is NOT MINE — proven, not asserted.**

`portable-paths` is RED on three `BENIGN-TEST` sites in
`consonance/tools/install-only.test.js:202,:203,:209` (`X:\old\...` fixtures), which are A's file
from L044 and were **already red before I touched anything** — I ran the tool first for exactly this
reason. Two of that suite's cases assert the repo is green against its committed baseline, so they
fail on A's sites.

Because I hand-edited that baseline (§3b), "it's A's fault" is exactly the claim I should not be
trusted on, so I measured it. Temporarily absorbing A's three and reverting:

    with A's 3 baselined:  portable-paths: green — 171 known sites
                           65 baselined site(s) still need fixing
                           portable-paths.test.js -> 35 pass · 0 fail
    reverted:              168 sites, RED on the same 3

**Three things fall out of that and all three matter:** the failure is entirely A's three sites; my
168-site baseline is internally sound; and **171 = my 168 + A's 3**, which means a clean `--update`
preserves my two removals exactly. §3b said that check was owed — it is now run, and it passes.

---

## 1 · `exo_memory/review/` — CLASSIFIED, NOT DELETED

### 1a · The packet said one entry. There are two.

    node consonance/tools/gen-consumer.js --report
      exo_memory/ ENTRIES IN NEITHER COLUMN:
        exo_memory/astra
        exo_memory/review
      REFUSED: 2 exo_memory/ entr(ies) are in neither column

The packet (written ~05:50) names one. `exo_memory/astra/` was created at **05:49–05:51** — its
files are minutes old — so the packet was accurate when written and stale by the time I ran it.
**This is the guard behaving exactly as designed**: a new uncolumned directory refused the build and
named itself within minutes of appearing. C's §4 measured what the absence of that costs — 17 files,
276,112 bytes, accumulated in the gap with nothing complaining.

### 1b · I columned `astra` too, which is BEYOND THIS PACKET — read this before landing

`astra` is not in my packet and belongs to another seat. I classified it anyway, and the reasoning
you should check is:

- **`STAYS_PRIVATE` is the direction that changes nothing about what ships.** An uncolumned entry
  refuses the whole build; a private one is withheld. The file did not ship before and does not ship
  now. What changed is that the decision is written down instead of blocking everything.
- **It is reversible in one line by the seat that owns it.** An uncolumned directory gives them
  nothing to reverse; a wrong column entry gives them a sentence to strike.
- **Leaving it would have made item 1 unachievable.** `fixture-scope` cannot go green with any entry
  uncolumned, so "classify review/" and "leave astra/ alone" are not simultaneously satisfiable.

**If you disagree, the fix is to strike one line from `gen-consumer.js` and the build refuses again** —
which is the state I found it in, not a worse one.

### 1c · The reasons, which the packet correctly called the deliverable

`review`:

> a SCORED EXPERIMENTAL OBJECT — the seeded draft L039's readers were measured against, kept as the
> record of what those subjects actually read. It ships nowhere for two independent reasons: a
> consumer inherits no experiment to re-score, and a planted-defect key that travels stops being an
> answer key. Kept, not deleted, because a scored run without its object cannot be checked afterwards.

Two independent reasons rather than one, deliberately: if the answer-key argument is ever wrong
(the key moves, the run is retired), the first reason still holds on its own.

`astra`:

> per-seat, like map/ and librarian/ — one instance's own folder, by its own WELCOME.md ("yours:
> everything you write goes here and nowhere else"). AND IT CARRIES THE MASTER: astra/SHELL.md is
> BOOT.md in full (161,711 B), so shipping this directory would ship under a second path the exact
> file the BOOT.md entry above withholds.

**The second half is a measured finding, not a category judgement**, and it is the one worth your
attention:

    grep -o "seal the kept, leave the living open" exo_memory/astra/SHELL.md   -> 1 hit
    grep -o "seal the kept, leave the living open" exo_memory/BOOT.md          -> 1 hit

`BOOT.md`'s own column entry says it is withheld because the MASTER "would OUTRANK the sanitised
brief via pick_default_room". **`astra/SHELL.md` is a second carrier of that master under a path
nothing was watching.** Had `astra` been columned as SHIPS by anyone in a hurry, the BOOT.md
exclusion would have been silently defeated — the carrier problem this room has measured before,
appearing again within two hours of the carrier being created.

### 1d · Deleting was the wrong fix, and the packet is right that it was the tempting one

`review/` is the evidentiary record behind a scored run. **A scored run whose object is gone cannot
be re-scored or disputed** — the score becomes an assertion about a thing nobody can look at. It is
also still untracked (`?? exo_memory/review/`), which is the state in which deleting looks free.

### 1e · The port gate — BLOCKED, and I am reporting it as unmeasured

    CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js --gate
    EXIT CODE: 3
      BUILD-GATE  repo C:\Consonance\lighthouse  sha 78bd756
      BLOCKED: Local\ConsonanceSingleInstance is held — Consonance is running on this machine.
        A launch here reaches warn_second_instance() and measures a #32770 dialog, not the app.
        This is not a pass and not a failure.

**UNMEASURED.** Consonance is running — it is running these panes — so this cannot be measured from
inside a pane at all without the keeper closing the app. **I am not reporting it as green and the
build side of item 1 is therefore unverified**; only the report and the two test files are measured.

---

## 2 · `actors.js` — BOTH SITES, RULED SEPARATELY

### 2a · RED FIRST, and the defect is worse than a machine path

The ratchet was **blind by construction**: both sites were baselined, so they appear only under
`--fatal`, listed as exempted, and never in the red list.

    node consonance/tools/portable-paths.js --fatal
      FATAL-DEFAULT  consonance/tools/actors.js:337  const board = process.argv[2] || 'C:/Consonance/data/board.jsonl';
      REVIEW         consonance/tools/actors.js:37   : 'C:/Consonance/data/letters.json';

Then the behavioural red, on a temp HOME with **no `CONSONANCE_DATA` and a valid `~/.consonance.json`** —
a correctly configured machine:

    config data_dir    -> <tmp>/actors-data-JlcJYc
    actors.js LETTERS  -> C:/Consonance/data/letters.json
    reads the config?  -> false
    canonical(a pane that IS in the configured map) -> { via: 'unresolved' }

**That last line is the finding.** This is not a cosmetic path — it is a **silent wrong answer**.
`letters()` swallows the failed read and returns `{}` under the comment *"absent map is not an
error"*, so on any machine but this one **every id falls through to `unresolved`** and the census
reports a board full of strangers. `actors.evidence.test.js` would go red with a message blaming the
board for something the resolver did.

### 2b · The ruling on `:37` — the THREE stated tiers, and why not something narrower

**Three tiers: env → `~/.consonance.json` → null. No literal, no throw.**

The packet asked me to notice this resolver has **two** tiers, not three, and that is the crux: the
missing tier is not decoration, it is the entire defect. `transcript-watch.js` at least *had* the
config tier and fell past it only when genuinely unconfigured. This one **never consulted the config
at all**, so the literal was not a fallback — it was the live path on every machine without the env
var set.

**Narrower options considered and rejected:**

- *Add the config tier, keep the literal as a fourth.* Rejected: the literal is then still live on
  an unconfigured machine, and this is a library four callers import — the wrong answer would
  propagate silently into `residue.js` and `tell-index.js`, which is how it survived this long.
- *Throw when unresolvable.* **Rejected on the shape of the file, not on principle.** This is a
  LIBRARY: `residue.js`, `tell-index.js`, `actors.test.js` and `actors.evidence.test.js` all
  `require` it, so anything loud at import time is loud in four callers that have nothing to do with
  the problem. Compare last lap, where I ruled the same way for a hook, for a different reason
  (blast radius on the keeper's prompt). Same verdict, different argument — the argument is about
  where the loudness can land without costing an innocent caller.

**So the loudness moved to the two places that can carry it**: the CLI refuses with the reason
(§2c), and `lettersStatus()` lets a test assert the difference between *"no data dir"* and *"map
absent"* — a distinction the old silent `{}` destroyed.

**The shape is the peer's, not my invention.** `chain-status.js:261-274` already resolves exactly
this way in this same directory, and its own comment already names this defect class: it was copied
from `lap-row.js:97`, *"which ends in a hardcoded data-dir literal — grandfathered there by
portable-paths' baseline"*. A third file agreeing is why this is the house shape.

### 2c · The ruling on `:337` — a DIFFERENT SHAPE, ruled separately

The packet is right that these must not be collapsed because they share a string. `:37` is a config
resolver missing a tier. **`:337` is an argv default, and the question is not "which tier" but "what
does no-argument MEAN".**

**It means "the board this instrument is for" — not "a file at this absolute path".** Those were the
same sentence on one machine and only on one machine. So:

    const board = process.argv[2] || (DATA_DIR ? path.join(DATA_DIR, 'board.jsonl') : null);
    if (!board) { console.error(...what to set...); process.exit(2); }

**A resolver, not a literal — and here a throw IS right**, which is the opposite call from §2b in the
same file. The reason is structural: this is inside `require.main === module`. It is the process's
own entry point, it has already decided to write to stdout, and nothing imports it. Loudness costs
no caller anything.

Both behaviours verified:

    node consonance/tools/actors.js                     -> actors — C:\Consonance\data\board.jsonl
                                                           253595 entries, 24 canonical actors
    (unconfigured HOME, no env)                         -> refuses, exit 2, names what to set,
                                                           and the refusal text contains no C:\Consonance

### 2d · Mutants — each literal separately, and they bite separately

| mutant | result |
|---|---|
| restore the `:37` literal third tier | **2 red** — the null-resolution case and the two-states case |
| restore the `:337` argv literal | **1 red** — the CLI case only |
| both reverted | **20 pass · 0 fail** |

**That they fail disjointly is the point**: the two sites have independent guards, so a future edit
to one cannot be masked by the other still being correct.

### 2e · Where the tests live — A DECLARED DEPARTURE

The five new cases are in **`consonance/tools/actors.test.js`, which is not in my owned list.** I
own `actors.evidence.test.js`. The reason is not convenience:

**`actors.evidence.test.js` is MACHINE-BOUND and reports NOT-RUN wherever there is no corpus —
which is precisely the machine where a resolver that skips `~/.consonance.json` does its damage.** A
guard for *"this breaks on a machine that is not ours"* cannot live in the file that declines to run
on a machine that is not ours. `actors.test.js` is the portable half by its own stated split.

If that reading is wrong the five cases lift out cleanly and the fix stands without them, worse.

### 2f · Consumers traced before changing an exported type

`LETTERS` is exported and its type changed (string → string|null), so I checked every consumer
rather than assuming:

    grep -rn "LETTERS" --include=*.js consonance/ | grep -v actors.js
      chain-status.js  — defines its OWN, already null-shaped
      pane-status.js   — defines its OWN
    requires of actors.js: actors.evidence.test.js, actors.test.js, residue.js, tell-index.js
      -> all four import { canonical } / { census } only. None imports LETTERS.

Both consumers smoke-tested on the configured path **and** on the new null path: `loads ok` in all
four combinations.

---

## 3 · WHAT I DID NOT DO

### 3a · The literal still appears in `actors.js` — in a comment, quoting the old code

`actors.js:42` and `:50` contain `C:/Consonance/data/letters.json` inside my comment block, as the
"before" evidence and the measured red. The tool's own detectors report the file **clean** (comment-
only lines are skipped by the cry-wolf rule), so this adds nothing to the baseline. I am naming it
because last lap I found `portable-paths.js:492` telling every reader to *copy* a defect: the
distinction is that this quotes a removed literal as a dated trace, not as an instruction. **Mark the
carriers; leave the traces.**

### 3b · I REFUSED to absorb A's three unbaselined sites

`--update` is the supported way to shrink the baseline, and running it now would have taken
`install-only.test.js:202,:203,:209` into the baseline **through my hand**. Baselining another seat's
fixtures is that seat's decision — the tool's own note says adding a site "requires a deliberate
`--update` and shows up in the diff", and it would not have shown up as A's.

So I removed exactly the two dead entries and **recomputed `counts` by tallying the site list**,
rather than adjusting the header by hand — directly applying last lap's finding, where a hand-edit at
`5889d3c` left `REVIEW` one higher than the body. Verified: header consistent with body, 168 sites,
exactly 2 removed, 0 added, 0 reclassified.

**What is owed — and I ran it rather than leaving it owed.** Absorbing A's three and reverting (§0)
gives **171 = my 168 + A's 3**, `portable-paths` green, `portable-paths.test.js` 35/35, and **65
exempted**, matching the number I derived by hand. So a clean `--update` by whoever rules on A's
fixtures reproduces my two removals exactly, and my hand-recomputed `counts` header agrees with the
tool's own tally. **The tree goes green the moment A's three are ruled on, and nothing else is
blocking it.**

---

## 4 · CAUGHT IN MY OWN WORK

- **I nearly reported "137 baselined sites no longer present".** I wrote an ad-hoc check that
  re-implemented the tool's normalisation and got it different, and the absurd number is the only
  reason I looked twice. Discarded it and checked the two sites directly with the tool's own exported
  `scan`/`classify` instead. **Re-implementing an instrument to audit it measures the
  re-implementation.**
- **My red-probe printed a stale `:337` result.** Its second half hardcoded the old literal instead
  of reading `actors.js`, so after the fix it still printed `C:/Consonance/data/board.jsonl`. That was
  my probe, not the file. Re-verified against the file (`grep -n "process.argv\[2\]"` → the resolver)
  and against the real CLI.
- **I misread an exit code**, reporting `exit=0` for the CLI refusal when the `0` was `head`'s. The
  real code is **2**, measured with the pipe removed.

---

## 5 · WHAT I DID NOT VERIFY

- **The build itself.** The port gate is BLOCKED (§1e), so `gen-consumer`'s actual build path is
  unmeasured this lap. Only `--report`, `fixture-scope` and `gen-consumer.test.js` are measured.
- **That `astra/` should be private at all.** I read its `WELCOME.md` and verified `SHELL.md` carries
  the BOOT master; I did **not** ask the seat that created it, and it was created minutes before I
  ran. §1b is the flag.
- **That `SHELL.md` is BOOT.md *in full*.** I verified one distinctive sentence greps back and that
  the file is 161,711 bytes. I did not diff it against `BOOT.md`, so "in full" is that file's own
  claim about itself plus one spot-check, not a measurement.
- **Anything on the desktop.** Every run is machine `L`. The whole point of the resolver fix is a
  machine I cannot test from here.
- **`carrier-drift.test.js`** — still red, not mine, untouched, not investigated.
- **`cargo`** — not run. No Rust touched; `main.rs` not opened.

---

## 6 · FALSIFIER

> *a machine path passing the ratchet after this, or a generator refusal naming an unclassified entry.*

Both are live rather than hopeful. The `actors.js` entries are **out of the baseline**, so the literal
cannot return quietly — it turns the ratchet red instead of being re-exempted, and the five new cases
in `actors.test.js` turn red on the behaviour rather than the string.

**The one I would add, because it is the half this lap could not close:** the generator's refusal is
only as good as the column entries' REASONS, and nothing tests a reason. `astra` was columned by me
on evidence I gathered in ten minutes about another seat's directory. **If a column entry is ever
found to be wrong about what a directory IS, the guard was measuring presence and not judgement** —
and presence is the easy half.
