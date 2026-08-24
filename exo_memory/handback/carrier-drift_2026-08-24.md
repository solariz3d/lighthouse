# Pane B — packet T3, hand-back. `carrier-drift`, built.

**Nothing committed.** Six new files, three modified, all in the working tree. Every figure below
has the command that re-derives it beside it; nothing is quoted from the brief.

> **THIS FILE IS INSIDE THE CORPUS THE TOOL SCANS.** It quotes the withdrawn wording, so it is
> registered as a `mention` site in `consonance/tools/carrier-drift.registry.json`. **If you move
> or rename it when committing, `carrier-drift` goes RED with `MISSING-FILE` and the suite goes
> red with it.** Either keep the path, or update the site's `file` field. This is the designed
> friction and it is being demonstrated on the tool's first day rather than described.

---

## The premise correction, confirmed independently before anything was built

The dispatch says `carriers.js` never existed as an instrument. Re-derived here rather than
accepted:

```
git log --all --oneline -- '*carriers.js'          # empty
ls consonance/tools/carriers.js consonance/hooks/carriers.js   # absent
```

and `dev/one-shot/carriers-2026-08-23.js` read in full: three hardcoded absolute paths, one
hardcoded `NOTE` constant, an `already marked` early-return, applied at `ae5ff99`. It detects
nothing. **T3 was a build.** Agreed, and it is now built.

---

## What was built

| path | what |
|---|---|
| `consonance/tools/carrier-drift.js` | the detector |
| `consonance/tools/carrier-drift.registry.json` | the armed half — withdrawals and their site census |
| `consonance/tools/carrier-drift.test.js` | 19 tests, two of them against real git trees |
| `consonance/hooks/carrier-drift-watch.js` | the unbidden trigger (Stop hook) |
| `consonance/hooks/carrier-drift-watch.test.js` | 7 tests, hook spawned for real |
| `dev/mutation/mutate-carrier-drift.js` | 21 mutants across tool, registry and hook |

Modified, and each is half of a **pair** that would have shipped broken alone:

- `dev/shell/install.ps1` — manifest entry **and** `$register` entry, in the same change. The
  file's own comment says registration and manifest ship together or a fresh install silently
  loses the hook.
- `consonance/hooks/dream-gate.test.js` — one `ENTRY` row. The hook roster is **discovered** from
  install.ps1 and that table is **hand-kept**, so landing the manifest line alone turns the suite
  red on a hook that is fine. Same shape as the `guard-census` pair.

---

## The bar, scored

**Red on the historical state, green at HEAD, mutation both directions.**

```
node consonance/tools/carrier-drift.js --quiet
  → GREEN — carrier-drift · 190 carriers · 0 findings

node --test consonance/tools/carrier-drift.test.js      → 19 tests, 19 pass, 0 fail
node --test consonance/hooks/carrier-drift-watch.test.js →  7 tests,  7 pass, 0 fail
node dev/mutation/mutate-carrier-drift.js               → applied 21 · caught 21 · NOT APPLIED 0
node consonance/hooks/dream-gate.test.js                → 51 passed, 0 failed
node consonance/tools/js-suite.js                       → 56 green · 0 failed · 0 crashed · 0 silent
node consonance/tools/portable-paths.js                 → green, 0 new
```

The historical half is not a hand-typed fixture. `carrier-drift.test.js` materialises **every
markdown file in the tree at `21d5453^`** through one `git ls-tree` and one `git cat-file --batch`
and runs the shipped registry against it. Against that tree it is RED, and the findings name:

- `UNMARKED-CARRIER exo_memory/TRAINING.md:133` — the packet's named fixture
- `UNMARKED-CARRIER exo_memory/loop/lap_2026-08-23.md:22` — the re-assertion
- `UNMARKED-CARRIER exo_memory/BOOT.md:117` — the `Previous:` pointer, unmarked at that rev

Both directions of mutation are covered: mutating the **data** (11 registry/tree cases in the
test file) and mutating the **source** (21 one-edit mutants, each restored, each caught).

---

## The finding that justifies the tool existing, and it is a measurement

`loop/handoff_2026-08-23.md:114` registers the room's own propagation sweep:

```
grep -rl "only decorrelated" exo_memory/ | grep -v journal/
```

Run against the tree as it stood **before** the marking pass:

```
git grep -l "only decorrelated" 21d5453^ -- exo_memory/ | grep -v journal/
  → exo_memory/BOOT.md
    exo_memory/TRAINING.md
    exo_memory/convergence_2026-07-28_methodology.md
    exo_memory/loop/trigger_index_objections.md
```

**Four files, and `loop/lap_2026-08-23.md` is not among them** — the re-assertion `21d5453`'s own
commit message calls out by name. The file was there to be found:

```
git cat-file -s 21d5453^:exo_memory/loop/lap_2026-08-23.md   → 20789
git show 21d5453^:exo_memory/loop/lap_2026-08-23.md | sed -n '22,23p'
  → "...the keeper remains the only"
    "genuinely decorrelated reader. ..."
```

The phrase wraps a line break and takes an inserted word, and a line-based fixed-string grep
cannot see either. **The instrument the room registered to find carriers would not have found the
carrier that motivated registering it.** It was found by a person noticing, again.

That is why matching here runs over whitespace-collapsed text with a regex rather than
line-by-line with a fixed string — and it is a kept test
(`THE COMPARISON: the registered sweep misses the carrier this tool finds`), so it cannot quietly
stop being true. It is also mutant #12: put the registered grep's fixed string back into the
registry as the pattern and the suite goes red.

---

## The refusal clause, answered: the trigger IS buildable here, but NOT the way the packet said

The packet says wire it unbidden on **checkpoint/PreCompact, residue's pattern**. That pattern is
`muscle_map.md:1049` — *"`residue.js` is now fired from `checkpoint.py`, which runs on the
`PreCompact` hook."* True on the desktop. **On this machine it is a no-op**, and the mechanism is
three lines of `dev/shell/hooks/precompact.js`:

```
precompact.js:27-30   SCRIPT = %USERPROFILE%\Desktop\lighthouse\exo_memory\loop\checkpoint.py
precompact.js:49      if (!fs.existsSync(SCRIPT)) process.exit(0);   // "different machine, no room here"

ls "$USERPROFILE/Desktop"   → No such file or directory
```

There is no `C:\Users\zackn\Desktop` at all, so the PreCompact chain exits at line 49 every time
and residue has never run unbidden on the laptop. Copying that wiring would have shipped a
trigger that is a no-op on the machine it was built on — registration 46's disease with a fresh
coat. **This is not a defect in precompact.js**; it is fail-open behaviour working as designed.
It is a defect in reading `muscle_map.md:1049` as machine-independent.

So the trigger is a **Stop** hook. The reasoning, each clause from a measured failure:

- **Not PreToolUse.** The dispatch gate built four hours ago fires correctly and bypass mode
  DROPS its `ask` outcome (`f8b64e8`). A hook needing a decision honoured can be silently
  overridden here. This one only needs to print.
- **Silent when green.** `dream-watch` announced a deficiency every turn for 27 days and the
  channel stopped being read.
- **Silent when the same red is already outstanding** (fingerprinted, 6h cooldown). A red nobody
  has got to yet is not news on turn forty — that is the 27-day failure, delayed.
- **One voice per finding, machine-wide.** The state file is in the shared data dir, so the first
  seat to report a fingerprint claims it and four other panes do not repeat it.
- **A ledger row on EVERY firing, including the silent ones.** Verbatim tonight's lesson: a silent
  pass-through is indistinguishable from a hook that never fired. `data/carrier-drift.jsonl`.

Measured cost: **152 ms** per turn, one ledger row:

```
{"ts":"2026-08-24T12:32:32.154Z","pane":"lighthouse","verdict":"GREEN","findings":0,
 "carriers":190,"fp":"green","spoke":false,"ms":152}
```

**LANDED, NOT SHIPPED — and the installer's own check says so:**

```
powershell -File dev/shell/install.ps1 -Check
  → DRIFT    carrier-drift-watch.js
```

I did **not** run `install.ps1`. It edits `~/.claude/settings.json`, which is user-global state,
and I was told to hand back. **Until someone runs it, this detector does not fire unbidden.** It
runs by command today.

---

## Three things found on the way, outside the packet

1. **`ferry-watch.js`'s fix from tonight is not installed.** `b6057b1` (2026-08-24 01:39) rewrote
   the backlog line because its citation resolved to a different figure. The installed copy still
   contains the old one-line version:
   ```
   diff consonance/hooks/ferry-watch.js ~/.claude/shell/ferry-watch.js
     → installed still prints: "Backlog beyond the window: N never ferried (…--report)."
   powershell -File dev/shell/install.ps1 -Check   → DRIFT ferry-watch.js  (13 files drifted)
   ```
   *Stated where it applies:* I cannot tell from here whether an install was attempted tonight —
   `Copy-Item` preserves `LastWriteTime`, so the installed file's Aug-10 mtime shows which SOURCE
   it came from, not when it was copied. What is established is the content: **the running hook
   does not have the fix, and `-Check` sees it.** Not fixed — installing is user-global state.

2. **The librarian's own citation is four lines off.** `librarian/2026-08-23.md:392` cites
   `loop/lap_2026-08-23.md:18`; the re-assertion is at `:22`. Noted in the registry entry rather
   than edited — that file is a dated record.

3. **`carriers.js` was not the only thing the record over-reported.** `muscle_map.md:1049`'s
   present-tense "is now fired from" is the same shape at one machine's remove. Both are the
   record describing a wiring rather than a file.

---

## What this does NOT establish

- **It matches wording, not meaning.** `record/claim-your-continuity.md:15` calls the keeper *"the
  decorrelated instrument"* with no "only" — the same withdrawn unit, invisible to this pattern.
  I did **not** widen the pattern to catch it: that is a judgement about what the withdrawal
  covers, and widening it silently would be the seat that built the instrument also deciding what
  it measures. **Flagged for a decision, not taken.**
- **The registry is hand-written.** The tool cannot tell you what has been withdrawn, only whether
  registered withdrawals have propagated. One withdrawal is registered. Every other correction
  this room has made is outside it and reports green by absence.
- **`.md` only.** A withdrawn claim asserted in a `.rs`, `.js` or `.py` comment is not seen.
- **The corpus is moving under this.** Two other panes are writing to this tree right now; the
  carrier count went 189 → 190 mid-run. A new `.md` containing the wording turns the suite red
  until it is registered. That is the design, and it means **the suite's greenness is a claim
  about the tree at the moment of the run**, not a standing property.
- **The hook is lexically gated, not behaviourally proven.** `dream-gate.test.js` classifies it
  `NOT BEHAVIOURALLY PROVEN (8/19)` because it is silent in that fixture either way — which is
  correct, since it is silent when green. Its own suite spawns it for real and proves the emit
  path; the cross-hook gate covers it by source inspection only, which is weaker and printed as
  weaker.

---

## Corrections I made to myself

- **The first design was file-scoped** — "the file contains a WITHDRAWN marker, therefore it is
  fine" — and it was thrown away because `lap_2026-08-23.md` **carries a marker and carried the
  re-assertion**. A file-scoped rule is green on the exact case the packet is about. The census is
  the cost of not having that hole.
- **The header first claimed collapsed matching is why the wrapped case is caught.** Imprecise:
  `\s+` in the pattern already crosses a newline. The load-bearing reason is that **anchors** span
  line breaks and `indexOf` on raw text would miss them — mutant #1 proves it. Header corrected.
- **I wrote a `DEAD-SITE` check and then deleted it as unreachable.** `BAD-ANCHOR` requires every
  anchor to contain the wording, so an anchor found in a file always brings an occurrence with it.
  Unreachable code inside a guard is the shape that reports coverage it does not have. The comment
  where it was says why it is absent.
- **One test asserted less than its name claimed** (a `DEAD-SITE` case that only reached
  `BAD-ANCHOR`) and was replaced with the real behaviour: properly removing the wording goes RED
  as `STALE-SITE` until the registry is pruned. That friction is now named rather than discovered.
- **I nearly reported `ferry-watch` as "the install did not take"** off an mtime. `Copy-Item`
  preserves mtime, so the mtime cannot carry that claim. Narrowed to what the bytes show.

---

## What I did not touch

`consonance/tools/actors.js`, `consonance/tools/actors.test.js` (pane A), `exo_memory/loop/`
(pane C). Both A's files and three of C's show modified in `git status` from their own work; none
of it is mine.

**Scope taken beyond the three files the dispatch named:** `dev/shell/install.ps1` and
`consonance/hooks/dream-gate.test.js`, both because the trigger is half of the packet's objective
and each of those is the other half of a pair that fails alone. Neither is claimed by another
pane this cycle. Say if that was wrong and I will unwind it.
