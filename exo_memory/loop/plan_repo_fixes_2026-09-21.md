# The repo fixes, in chunks. Librarian (the lineage, on L), 2026-09-21 01:5x.

At the keeper's word: *"lets start the repo fixes"*. Chunks 1–3 (install / score / re-measure) are planned
separately at `loop/plan_install_score_remeasure_2026-09-21.md` and wait on D.

## 0 · MEASURED ON L TONIGHT, BEFORE PLANNING (HEAD 961cce3)

`node consonance/tools/js-suite.js` → **exit 1 · 103 green · 5 failed · 0 crashed · 1 silent · 1 canary (of 110)**.

| red | first failing assertion, verbatim |
|---|---|
| `consonance/tools/ask.test.js` | *"D091 · on the shipped store, ASK-009 parses OPEN and ASK-008 keeps its own ANSWERED status"* |
| `consonance/tools/actors.evidence.test.js` | *"the real board resolves with nothing left over — under the REAL letters map"* (unresolved ids on the live board) |
| `consonance/tools/carrier-drift.test.js` | 4 tests, first: *"THE BAR, half one: the shipped registry is GREEN against the working tree"* |
| `consonance/tools/forget-rate.test.js` | *"exo_memory/ has never lost a file from the reading path (all-time)"* — *"2 files left the reading path (172,048 bytes)"* |
| `consonance/tools/portable-paths.test.js` | 41 unbaselined machine-specific paths (baseline last touched L052, 09-09) |
| SILENT `dev/shell/hooks/l2-overseer-worker.test.js` | the file itself prints **"18 tests · 18 pass · 0 fail"** run alone — the runner does not recognise that summary |

**`ask.test.js` is new since the handoff.** The likely cause (UNVERIFIED — the pane confirms): D091's test pins
the LIVE queue, asserting ASK-009 is OPEN, and ASK-009 was cleared KEEP later the same day. A test that asserts
mutable live data goes red when the data legitimately changes.

**The SILENT matters for chunk 1:** `l2-overseer-worker.js` is where D095's abstain schema lives, and its test
is currently invisible to the suite.

Not in the table, from the handoff, still open: two `dev/tail-carry.js` refusals exit 0
(`--verify-set` with no stick → `code 2 · no such folder: null`, exit 0; `--verify-set --carry-dir <dir>` →
`REFUSED`, exit 0). `exo_memory/review/` is untracked on L (2 files: `tool_audit_draft_2026-09-07.md`,
`tool_audit_tally.js`), absent on D, and was named as the cause of two D reds.

## RULE FOR EVERY PACKET

The user's standing rule, verbatim from `CLAUDE.global.md`: *"never weaken, remove, or modify existing tests to
make them pass unless the test itself is verifiably wrong."* A packet that edits a test must state the proof
that the TEST is wrong, not the code. Bug fixes: failing test first, then the fix, then green.
Verification by varying: run plain `node <file>` AND through `js-suite.js`, and for machine-asymmetry claims,
in a **fresh detached worktree** (which carries no untracked files — that is the control).

## CHUNK R-A — three small fixes, disjoint files, in parallel

- **R1 · tail-carry exit codes** (`dev/tail-carry.js` + its test). A refusal exits non-zero. Test first: both
  commands above, asserting `exit != 0`. Bar: both red before, green after; every existing success path still
  exits 0.
- **R2 · js-suite SILENT** (`consonance/tools/js-suite.js` + its test). The classifier must read
  `N tests · N pass · 0 fail`. The runner's own warning: *"a SILENT is at least as likely to be the
  classifier's ignorance as the test's vacuity — check before editing."* Bar: l2-overseer-worker counts green;
  a file printing `0 tests · 0 pass` still SILENT (the rule it exists for survives).
- **R3 · ask.test.js D091** (test file only, if proven wrong). Prove the cause first: does the assertion read
  the live `exo_memory/ASK.md`? If so, re-point it at a fixture of the store **as it stood at D091's commit**,
  keeping the property D091 tested (a comma in a title parses; the neighbour keeps its own status). Bar: the
  fixture test is red on the pre-D091 regex (mutation: restore `([^,]+)`) and green now.

## CHUNK R-B — three reds whose cause is not yet known: DIAGNOSE, then fix

Each packet's first deliverable is the cause, with a command beside it. No fix lands without one.
- **R4 · actors.evidence** — name the unresolved ids. The test's own instruction: a pre-letter pane goes in
  PRE_LETTER with evidence; a live pane is a `letters.json` fix, *"NOT a hand-copied alias."*
- **R5 · carrier-drift ×4** — is `exo_memory/review/` the cause? Control: a fresh detached worktree at HEAD
  (no untracked files). Red there too → not review/. Green there → it is, and whether review/ gets tracked,
  moved or left is **the keeper's**, since it is his draft. The pane does not delete or commit it.
- **R6 · forget-rate** — name the 2 files and 172,048 bytes that left the reading path, and say whether the
  intake-cap change (L062, 71cbe8f) removed them on purpose. A deliberate cut is a baseline update with the
  commit named; an accidental one is a bug.

## CHUNK R-C — portable-paths, 41 sites, one ruling per site

Not `--update`, which would bless all 41 at once. Per site: machine path → env var with a portable default,
or a baseline entry with the reason. FATAL-DEFAULT first (e.g. `consonance/hooks/live-mirror-stop.js:49-54`
defaulting to `C:\Consonance\state`). Its own lap; the largest.

## ORDER AND SEATS

R-A now (A, B, C one each). R-B when R-A is filed, or alongside if seats are free — files are disjoint.
R-C last. **E is at "Prompt is too long"** and needs a fresh start from `map/E.md` before it can take work;
that restart is the chair's, not a compact.

---

## CHUNK R-C, SHAPED — appended 03:1x, after L058–L060 (R-A, R-B, carrier-drift follow-on) landed

`node consonance/tools/portable-paths.js` at HEAD after L060 → **exit 1, 41 unbaselined: 30 BENIGN-TEST ·
4 FATAL-DEFAULT · 5 REVIEW · 2 FATAL-SHIPPED-INSTRUCTION.** The tool's own repair shape for code:
*"env override, then ~/.consonance.json (data_dir / room_path / instances_dir), then degrade LOUDLY. See
consonance/hooks/transcript-watch.js dataDir() for the shape."*

- **R-C1 · the state/data defaults (code).** `consonance/hooks/live-mirror-stop.js` ×3 (FATAL-DEFAULT, :49-54),
  `consonance/tools/live-follow.js:33` (FATAL-DEFAULT, `STATE_REPO`), `consonance/tools/state-sync.js:141` (REVIEW,
  the same `C:\Consonance\state` default). One family, one resolver shape. Test first per site: unset env + no
  config → loud refusal, not a silent `C:\` path. Note: live-mirror-stop is an UNREGISTERED hook by open keeper
  decision; fixing its defaults is not registering it.
- **R-C2 · the four analysis tools' `--board` defaults (code).** `order-parameter.js:253`, `vicsek-phi.js:248`,
  `contamination.js`, `deference-unit.js` — all REVIEW, all `C:/Consonance/data/board.jsonl`. These are this week's
  instruments; give them to a seat that authored none of the four. Bar: every recorded result command in their
  hand-backs still reproduces its number with the resolved default (they are cited in results files).
- **R-C3 · the two shipped instructions (prose).** `consonance/README.md:230` → the location written so a reader can
  resolve it (the instances dir, not one checkout's `C:\`). `exo_memory/record/retired_seats_2026-09-11.md:62` is a
  **dated record master** — no rewrite; a baseline row carrying A's argument (`handback/p-l060-ch4-A_2026-09-21.md`
  §2: the path resolves on both machines, the class is about form), or a dated append. The record's writer decides.
- **R-C4 · the 30 BENIGN-TEST sites → `--update`, LAST and alone.** Only after C1–C3 land, so the baseline diff
  contains exactly the 30 test-file rows and nothing else. Bar: the diff is read and every added row is in a
  `*.test.js` / `#[test]` context; any row that is not stops the update.

C1, C2, C3 touch disjoint files and can run in parallel. C4 depends on all three.
